const scenes = [...document.querySelectorAll(".scene")];

const inputTimeline = [
  { id: "field-patient", value: "DG-204", side: "brief-patient", completion: "2 / 9" },
  { id: "field-day", value: "Day 5", side: "brief-day", completion: "4 / 9" },
  { id: "field-history", value: "Yes", side: "brief-history", completion: "5 / 9" },
  { id: "field-temp", value: "39.2 C", completion: "6 / 9" },
  { id: "field-pulse", value: "108 bpm", completion: "7 / 9" },
  { id: "field-platelets", value: "88", completion: "8 / 9" },
  { id: "field-hct", value: "21%", completion: "9 / 9" },
];

const signals = [
  { icon: "thermometer", label: "High fever" },
  { icon: "droplets", label: "Low platelets" },
  { icon: "flame", label: "Marked Hct rise" },
  { icon: "triangle-alert", label: "Multiple warning signs" },
  { icon: "history", label: "Secondary infection concern" },
  { icon: "timer", label: "Late-phase presentation" },
];

const logicHits = [
  { icon: "thermometer", label: "Temperature exceeds severe-fever threshold." },
  { icon: "droplets", label: "Platelet count suggests elevated clinical risk." },
  { icon: "flame", label: "Hematocrit rise indicates stronger monitoring need." },
  { icon: "triangle-alert", label: "Warning-sign burden increases escalation score." },
];

const warningIds = ["warn-pain", "warn-vomiting", "warn-lethargy"];
const chartInstances = [];

let currentScene = 0;
let autoplay = true;
let sceneTimer = null;
let intakeRunning = false;
let dashboardRunning = false;
let analysisReasonsOpen = false;

function fitScenesToViewport() {
  const desktopMode = window.innerWidth > 1180;

  scenes.forEach((scene) => {
    const page = scene.querySelector(".page");
    if (!page) return;

    if (!desktopMode) {
      page.style.transform = "";
      return;
    }

    page.style.transform = "";

    const availableWidth = scene.clientWidth - 48;
    const availableHeight = scene.clientHeight - 56;
    const pageWidth = page.scrollWidth;
    const pageHeight = page.scrollHeight;

    const scale = Math.min(
      1,
      availableWidth / pageWidth,
      availableHeight / pageHeight,
    );

    page.style.transform = `scale(${Math.max(scale - 0.005, 0.72)})`;
  });
}

function createSignalMarkup(icon, label, className) {
  return `<span class="${className}"><i data-lucide="${icon}"></i><span>${label}</span></span>`;
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function createChart(canvasId, config) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !window.Chart) return null;
  const chart = new window.Chart(canvas, config);
  chartInstances.push(chart);
  return chart;
}

function setAnalysisReasonsOpen(isOpen) {
  analysisReasonsOpen = isOpen;

  const layout = document.querySelector(".analysis-layout");
  const panel = document.getElementById("analysis-reasons-panel");
  const button = document.getElementById("analysis-reason-button");
  const scene = document.querySelector(".scene-analysis");

  if (!layout || !panel || !button) return;

  layout.classList.toggle("reasons-open", isOpen);
  scene?.classList.toggle("analysis-overlay-open", isOpen);
  panel.setAttribute("aria-hidden", String(!isOpen));
  button.setAttribute("aria-expanded", String(isOpen));

  window.setTimeout(() => {
    fitScenesToViewport();
  }, isOpen ? 240 : 40);
}

function setupAnalysisInteractions() {
  const button = document.getElementById("analysis-reason-button");
  const closeButton = document.getElementById("analysis-overlay-close");
  if (!button || button.dataset.bound === "true") return;

  button.dataset.bound = "true";
  button.addEventListener("click", () => {
    setAnalysisReasonsOpen(!analysisReasonsOpen);
  });

  closeButton?.addEventListener("click", () => {
    setAnalysisReasonsOpen(false);
  });
}

function buildCharts() {
  const axisColor = "#7f8fa5";
  const gridColor = "rgba(61, 120, 216, 0.10)";
  const slate = "#8ea4bf";
  const amber = "#3d78d8";
  const sage = "#5d9cd6";
  const rose = "#2f67c2";
  const animation = {
    duration: 2200,
    easing: "easeOutQuart",
  };
  const basePlugins = {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: "#ffffff",
      borderColor: "#bdd0e8",
      borderWidth: 1,
      titleColor: "#132033",
      bodyColor: "#132033",
      displayColors: false,
    },
  };

  createChart("preview-mini-chart", {
    type: "line",
    data: {
      labels: ["D1", "D2", "D3", "D4", "D5"],
      datasets: [{
        data: [112, 108, 105, 93, 88],
        borderColor: amber,
        backgroundColor: "rgba(61, 120, 216, 0.12)",
        fill: true,
        tension: 0.38,
        pointRadius: 0,
        borderWidth: 3,
      }],
    },
    options: {
      maintainAspectRatio: false,
      animation,
      plugins: basePlugins,
      scales: {
        x: { ticks: { color: axisColor }, grid: { color: gridColor } },
        y: { ticks: { color: axisColor }, grid: { color: gridColor } },
      },
    },
  });

  createChart("volume-chart", {
    type: "line",
    data: {
      labels: ["Mar 14", "Mar 15", "Mar 16", "Mar 17", "Mar 18", "Mar 19"],
      datasets: [
        {
          label: "Cases",
          data: [5, 8, 7, 10, 12, 9],
          borderColor: amber,
          backgroundColor: "rgba(61, 120, 216, 0.14)",
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointBackgroundColor: amber,
        },
        {
          label: "High risk",
          data: [1, 2, 2, 3, 5, 4],
          borderColor: sage,
          backgroundColor: "rgba(93, 156, 214, 0.14)",
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointBackgroundColor: sage,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      animation,
      plugins: {
        ...basePlugins,
        legend: {
          display: true,
          labels: { color: "#5f6f85", boxWidth: 10, boxHeight: 10, usePointStyle: true },
        },
      },
      scales: {
        x: { ticks: { color: axisColor }, grid: { color: gridColor } },
        y: { ticks: { color: axisColor }, grid: { color: gridColor } },
      },
    },
  });

  createChart("risk-chart", {
    type: "bar",
    data: {
      labels: ["Low", "Medium", "High"],
      datasets: [{
        data: [9, 22, 15],
        backgroundColor: [slate, amber, rose],
        borderRadius: 6,
      }],
    },
    options: {
      maintainAspectRatio: false,
      animation,
      plugins: basePlugins,
      scales: {
        x: { ticks: { color: axisColor }, grid: { display: false } },
        y: { ticks: { color: axisColor }, grid: { color: gridColor } },
      },
    },
  });

  createChart("warning-chart", {
    type: "bar",
    data: {
      labels: ["Pain", "Vomiting", "Bleeding", "Lethargy", "Fluid"],
      datasets: [{
        data: [18, 15, 7, 13, 10],
        backgroundColor: sage,
        borderRadius: 6,
      }],
    },
    options: {
      indexAxis: "y",
      maintainAspectRatio: false,
      animation,
      plugins: basePlugins,
      scales: {
        x: { ticks: { color: axisColor }, grid: { color: gridColor } },
        y: { ticks: { color: axisColor }, grid: { display: false } },
      },
    },
  });

  createChart("day-chart", {
    type: "bar",
    data: {
      labels: ["D1", "D2", "D3", "D4", "D5", "D6", "D7+"],
      datasets: [{
        data: [4, 8, 12, 15, 19, 10, 6],
        backgroundColor: amber,
        borderRadius: 6,
      }],
    },
    options: {
      maintainAspectRatio: false,
      animation,
      plugins: basePlugins,
      scales: {
        x: { ticks: { color: axisColor }, grid: { display: false } },
        y: { ticks: { color: axisColor }, grid: { color: gridColor } },
      },
    },
  });

  createChart("serotype-chart", {
    type: "doughnut",
    data: {
      labels: ["DENV-1", "DENV-2", "DENV-3", "DENV-4", "Unknown"],
      datasets: [{
        data: [6, 18, 11, 4, 7],
        backgroundColor: [slate, amber, sage, rose, "#b8aea3"],
        borderColor: "#fffaf4",
        borderWidth: 4,
      }],
    },
    options: {
      maintainAspectRatio: false,
      cutout: "62%",
      animation,
      plugins: {
        ...basePlugins,
        legend: {
          display: true,
          position: "bottom",
          labels: { color: "#5f6f85", boxWidth: 10, boxHeight: 10 },
        },
      },
    },
  });

  createChart("scatter-chart", {
    type: "scatter",
    data: {
      datasets: [{
        data: [
          { x: 37.8, y: 148 }, { x: 38.1, y: 133 }, { x: 38.4, y: 124 }, { x: 38.7, y: 118 },
          { x: 39.0, y: 102 }, { x: 39.2, y: 88 }, { x: 39.4, y: 79 }, { x: 38.9, y: 97 },
          { x: 38.3, y: 129 },
        ],
        backgroundColor: amber,
        pointRadius: 6,
      }],
    },
    options: {
      maintainAspectRatio: false,
      animation,
      plugins: basePlugins,
      scales: {
        x: { title: { display: true, text: "Temperature", color: axisColor }, ticks: { color: axisColor }, grid: { color: gridColor } },
        y: { title: { display: true, text: "Platelets", color: axisColor }, ticks: { color: axisColor }, grid: { color: gridColor } },
      },
    },
  });

  createChart("outcome-chart", {
    type: "doughnut",
    data: {
      labels: ["Unknown", "Improved", "Stable", "Severe", "Referred"],
      datasets: [{
        data: [8, 11, 13, 5, 9],
        backgroundColor: ["#a9b8cb", sage, slate, rose, amber],
        borderColor: "#fffaf4",
        borderWidth: 4,
      }],
    },
    options: {
      maintainAspectRatio: false,
      cutout: "60%",
      animation,
      plugins: {
        ...basePlugins,
        legend: {
          display: true,
          position: "bottom",
          labels: { color: "#5f6f85", boxWidth: 10, boxHeight: 10 },
        },
      },
    },
  });

  createChart("platelet-chart", {
    type: "line",
    data: {
      labels: ["S1", "S2", "S3", "S4", "S5", "S6", "S7"],
      datasets: [{
        data: [132, 126, 118, 114, 106, 95, 88],
        borderColor: "#79a98b",
        backgroundColor: "rgba(121, 169, 139, 0.14)",
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: "#79a98b",
      }],
    },
    options: {
      maintainAspectRatio: false,
      animation,
      plugins: basePlugins,
      scales: {
        x: { ticks: { color: axisColor }, grid: { color: gridColor } },
        y: { ticks: { color: axisColor }, grid: { color: gridColor } },
      },
    },
  });

  createChart("referral-chart", {
    type: "bar",
    data: {
      labels: ["Low", "Medium", "High", "Referred"],
      datasets: [
        {
          label: "Cases",
          data: [9, 22, 15, 9],
          backgroundColor: slate,
          borderRadius: 6,
        },
        {
          label: "Referral load",
          data: [1, 4, 9, 9],
          backgroundColor: amber,
          borderRadius: 6,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      animation,
      plugins: {
        ...basePlugins,
        legend: {
          display: true,
          labels: { color: "#6d6258", boxWidth: 10, boxHeight: 10, usePointStyle: true },
        },
      },
      scales: {
        x: { ticks: { color: axisColor }, grid: { display: false } },
        y: { ticks: { color: axisColor }, grid: { color: gridColor } },
      },
    },
  });

  createChart("analysis-profile-chart", {
    type: "radar",
    data: {
      labels: ["Fever", "Platelets", "Hct", "Warnings", "History"],
      datasets: [{
        data: [86, 78, 74, 72, 63],
        borderColor: amber,
        backgroundColor: "rgba(61, 120, 216, 0.16)",
        pointBackgroundColor: amber,
        pointBorderColor: amber,
      }],
    },
    options: {
      maintainAspectRatio: false,
      animation,
      plugins: basePlugins,
      scales: {
        r: {
          angleLines: { color: gridColor },
          grid: { color: gridColor },
          pointLabels: { color: axisColor, font: { size: 10 } },
          ticks: { display: false },
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    },
  });

  createChart("analysis-driver-chart", {
    type: "bar",
    data: {
      labels: ["Fever", "Platelets", "Hct rise", "History"],
      datasets: [{
        data: [4.0, 3.1, 2.7, 1.8],
        backgroundColor: [rose, amber, "#6aa8e4", slate],
        borderRadius: 8,
        barThickness: 18,
      }],
    },
    options: {
      indexAxis: "y",
      maintainAspectRatio: false,
      animation,
      plugins: {
        ...basePlugins,
        legend: { display: false },
        tooltip: {
          ...basePlugins.tooltip,
          callbacks: {
            label(context) {
              return `Score contribution: ${context.raw}`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: axisColor },
          grid: { color: gridColor },
          suggestedMax: 4.5,
        },
        y: {
          ticks: { color: axisColor },
          grid: { display: false },
        },
      },
    },
  });

  createChart("analysis-severity-chart", {
    type: "bar",
    data: {
      labels: ["Fever", "Platelets", "Warnings"],
      datasets: [{
        data: [86, 78, 72],
        backgroundColor: [amber, amber, amber],
        borderRadius: 8,
      }],
    },
    options: {
      maintainAspectRatio: false,
      animation,
      plugins: basePlugins,
      scales: {
        x: { ticks: { color: axisColor }, grid: { display: false } },
        y: { ticks: { color: axisColor }, grid: { color: gridColor }, suggestedMax: 100 },
      },
    },
  });
}

function replayVisibleCharts(scene) {
  const canvases = scene.querySelectorAll("canvas");
  canvases.forEach((canvas) => {
    const chart = chartInstances.find((entry) => entry.canvas === canvas);
    if (!chart) return;
    chart.reset();
    chart.update();
  });
}

function typeValue(element, text, speed = 60) {
  element.value = "";
  let index = 0;
  element.parentElement.classList.add("field-typing");

  return new Promise((resolve) => {
    const interval = window.setInterval(() => {
      element.value = text.slice(0, index + 1);
      index += 1;
      if (index >= text.length) {
        window.clearInterval(interval);
        window.setTimeout(() => {
          element.parentElement.classList.remove("field-typing");
          resolve();
        }, 180);
      }
    }, speed);
  });
}

function setScene(index) {
  currentScene = (index + scenes.length) % scenes.length;

  scenes.forEach((scene, sceneIndex) => {
    scene.classList.toggle("scene-active", sceneIndex === currentScene);
  });

  if (currentScene !== 2 && analysisReasonsOpen) {
    setAnalysisReasonsOpen(false);
  }

  fitScenesToViewport();

  if (currentScene === 1) {
    window.setTimeout(playIntakeSequence, 450);
  }

  if (currentScene === 3) {
    window.setTimeout(playDashboardSequence, 500);
  }

  if ([0, 2, 3, 4, 5].includes(currentScene)) {
    window.setTimeout(() => {
      replayVisibleCharts(scenes[currentScene]);
    }, 260);
  }

  resetAutoplayTimer();
}

function resetIntakeScene() {
  document.getElementById("completion-value").textContent = "0 / 9";
  document.getElementById("brief-patient").textContent = "Pending ID";
  document.getElementById("brief-day").textContent = "Awaiting input";
  document.getElementById("brief-history").textContent = "Awaiting input";

  for (const item of inputTimeline) {
    document.getElementById(item.id).value = "";
  }

  for (const id of warningIds) {
    document.getElementById(id).classList.remove("active");
  }

  const signalList = document.getElementById("signal-list");
  const logicList = document.getElementById("logic-list");
  const resultCard = document.getElementById("result-card");
  const resultRisk = document.getElementById("result-risk");

  signalList.innerHTML = createSignalMarkup("scan-search", "Awaiting stronger severity signals", "signal-item");
  logicList.innerHTML = createSignalMarkup("bot", "Logic hits will appear after analysis.", "logic-item");
  resultCard.classList.remove("ready");
  resultRisk.classList.remove("high");
  document.getElementById("risk-level").textContent = "Pending";
  document.getElementById("risk-serotype").textContent = "Inconclusive";
  document.getElementById("risk-secondary").textContent = "Pending";
  refreshIcons();
}

function resetDashboardScene() {
  document.getElementById("metric-total").textContent = "00";
  document.getElementById("metric-risk").textContent = "00";
  document.getElementById("metric-platelets").textContent = "--";
  document.getElementById("metric-temp").textContent = "--";
}

async function playIntakeSequence() {
  if (intakeRunning) return;
  intakeRunning = true;
  resetIntakeScene();

  const completionValue = document.getElementById("completion-value");
  const signalList = document.getElementById("signal-list");
  const logicList = document.getElementById("logic-list");
  const analyzeButton = document.getElementById("analyze-button");
  const resultCard = document.getElementById("result-card");
  const riskLevel = document.getElementById("risk-level");
  const riskSerotype = document.getElementById("risk-serotype");
  const riskSecondary = document.getElementById("risk-secondary");
  const resultRisk = document.getElementById("result-risk");

  for (const item of inputTimeline) {
    const field = document.getElementById(item.id);
    await typeValue(field, item.value);
    completionValue.textContent = item.completion;

    if (item.side) {
      document.getElementById(item.side).textContent = item.value;
    }
  }

  signalList.innerHTML = "";
  signals.forEach((signal, index) => {
    window.setTimeout(() => {
      signalList.insertAdjacentHTML("beforeend", createSignalMarkup(signal.icon, signal.label, "signal-item"));
      refreshIcons();
    }, index * 180);
  });

  warningIds.forEach((id, index) => {
    window.setTimeout(() => {
      document.getElementById(id).classList.add("active");
    }, 380 + index * 220);
  });

  window.setTimeout(() => {
    analyzeButton.classList.add("button-flash");
  }, 1100);

  window.setTimeout(() => {
    resultCard.classList.add("ready");
    resultRisk.classList.add("high");
    riskLevel.textContent = "High";
    riskSerotype.textContent = "DENV-2";
    riskSecondary.textContent = "Likely";
    logicList.innerHTML = "";

    logicHits.forEach((item, index) => {
      window.setTimeout(() => {
        logicList.insertAdjacentHTML("beforeend", createSignalMarkup(item.icon, item.label, "logic-item"));
        refreshIcons();
      }, index * 170);
    });
  }, 1700);

  window.setTimeout(() => {
    intakeRunning = false;
  }, 2700);
}

function animateMetric(id, end, formatter = (value) => String(value), duration = 1800) {
  const element = document.getElementById(id);
  const startTime = performance.now();

  function frame(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = typeof end === "number" ? end * eased : end;
    element.textContent = formatter(value, progress);
    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

function playDashboardSequence() {
  if (dashboardRunning) return;
  dashboardRunning = true;
  resetDashboardScene();
  animateMetric("metric-total", 46, (value) => String(Math.round(value)).padStart(2, "0"));
  window.setTimeout(() => {
    animateMetric("metric-risk", 15, (value) => String(Math.round(value)).padStart(2, "0"));
  }, 220);
  window.setTimeout(() => {
    animateMetric("metric-platelets", 102, (value) => String(Math.round(value)));
  }, 420);
  window.setTimeout(() => {
    animateMetric("metric-temp", 39.1, (value) => `${value.toFixed(1)} C`);
  }, 620);
  window.setTimeout(() => {
    dashboardRunning = false;
  }, 2600);
}

function nextScene() {
  if (currentScene === 2 && !analysisReasonsOpen) {
    setAnalysisReasonsOpen(true);
    resetAutoplayTimer();
    return;
  }

  setScene(currentScene + 1);
}

function resetAutoplayTimer() {
  window.clearTimeout(sceneTimer);
  if (!autoplay) return;

  const baseDelay =
    currentScene === 1 ? 10500 :
    currentScene === 3 ? 8600 :
    currentScene === 4 ? 8600 :
    currentScene === 5 ? 8600 :
    currentScene === 6 ? 7600 :
    6800;

  sceneTimer = window.setTimeout(() => {
    nextScene();
  }, baseDelay);
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && analysisReasonsOpen) {
    setAnalysisReasonsOpen(false);
    resetAutoplayTimer();
    return;
  }
  if (event.key === "ArrowRight") nextScene();
  if (event.key === "ArrowLeft") setScene(currentScene - 1);
  if (event.key.toLowerCase() === " ") {
    event.preventDefault();
    autoplay = !autoplay;
    resetAutoplayTimer();
  }
});

window.addEventListener("resize", () => {
  fitScenesToViewport();
});

window.addEventListener("load", () => {
  refreshIcons();
  setupAnalysisInteractions();
  buildCharts();
  fitScenesToViewport();
  setAnalysisReasonsOpen(false);
  setScene(0);
});
