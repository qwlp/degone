# DeGone Presentation

Standalone presentation for showcasing the DeGone app in a video.

## Files

- `index.html`: full-screen presentation
- `styles.css`: cinematic styling and motion
- `script.js`: scene switching, autoplay, and UI animation

## Use

Open `index.html` in a browser, then record the screen.

Controls:

- `Next` / `Prev` buttons
- `ArrowRight` / `ArrowLeft`
- `Space` to pause or resume autoplay

For the cleanest capture:

1. Open the file in a desktop browser fullscreen window.
2. Let autoplay run if you want a guided sequence.
3. Pause on any scene you want to talk over manually.

## Recording Workflow

The repo now includes helper scripts for a segment-based recording flow:

- [`scripts/serve-presentation.sh`](/home/tsp/projects/DeGoneVideo/scripts/serve-presentation.sh): serves the site on `http://localhost:8000`
- [`scripts/generate-segments-manifest.sh`](/home/tsp/projects/DeGoneVideo/scripts/generate-segments-manifest.sh): builds a concat manifest from `segment-*.mp4`
- [`scripts/concat-segments.sh`](/home/tsp/projects/DeGoneVideo/scripts/concat-segments.sh): joins segment files into one final MP4
- [`RECORDING.md`](/home/tsp/projects/DeGoneVideo/RECORDING.md): step-by-step capture instructions, including optional `ffmpeg` examples

Quick start:

```bash
cd /home/tsp/projects/DeGoneVideo
./scripts/serve-presentation.sh
```

Then record segment files named `segment-01.mp4`, `segment-02.mp4`, and so on. When they are ready:

```bash
./scripts/concat-segments.sh
```
