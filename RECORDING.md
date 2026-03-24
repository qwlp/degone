# Recording Guide

This presentation is easiest to capture as separate scene-level clips, then join into one final MP4.

## Files

- [`scripts/serve-presentation.sh`](/home/tsp/projects/DeGoneVideo/scripts/serve-presentation.sh)
- [`scripts/generate-segments-manifest.sh`](/home/tsp/projects/DeGoneVideo/scripts/generate-segments-manifest.sh)
- [`scripts/concat-segments.sh`](/home/tsp/projects/DeGoneVideo/scripts/concat-segments.sh)

## Recommended Defaults

- Resolution: `1920x1080`
- Frame rate: `30 fps`
- Container: `mp4`
- Video codec: `H.264`
- Segment names: `segment-01.mp4`, `segment-02.mp4`, ...

## 1. Serve The Site

Run:

```bash
cd /home/tsp/projects/DeGoneVideo
./scripts/serve-presentation.sh
```

Open:

```text
http://localhost:8000
```

Use `localhost` rather than `file://` so external fonts, icons, and Chart.js assets load consistently.

## 2. Prepare The Browser

- Open the presentation in a clean tab.
- Maximize or fullscreen the window.
- Keep browser zoom at `100%`.
- Hide bookmarks, sidebars, and devtools.
- Wait for fonts and charts to finish loading before the first take.

Presentation controls:

- `ArrowRight`: next scene
- `ArrowLeft`: previous scene
- `Space`: pause or resume autoplay

## 3. Capture In Segments

Recommended segments:

1. Intro
2. Intake walkthrough
3. Analysis result
4. Dashboard review
5. More analytics
6. Outcomes
7. Patient detail / report section
8. Closing

Recommended timings:

- Intro: `6-8s`
- Intake walkthrough: `11-13s`
- Analysis result: `8-10s`
- Dashboard review: `8-10s`
- More analytics: `8-10s`
- Outcomes: `8-10s`
- Detail/report section: `8-10s`
- Closing: `6-8s`

Notes:

- The deck autoplays by default.
- The intake scene is the longest animation sequence.
- The deck loops, so stop each take before it rolls back to the intro.

## 4. Optional `ffmpeg` Capture Examples

`ffmpeg` is suitable for screen capture and final muxing. It is not a replacement for the browser renderer.

### X11 Example

Record a fixed region for 8 seconds:

```bash
ffmpeg -y \
  -f x11grab \
  -framerate 30 \
  -video_size 1920x1080 \
  -i :0.0+0,0 \
  -t 8 \
  -c:v libx264 \
  -preset veryfast \
  -pix_fmt yuv420p \
  segment-01.mp4
```

Adjust `:0.0+0,0` and `1920x1080` to match the browser window or screen region you want to record.

### Record Audio Too

If you want desktop or mic audio later, use a consistent audio setup across all segments. If audio settings differ between segments, concat will require re-encoding.

## 5. Generate The Concat Manifest

After recording segment files:

```bash
./scripts/generate-segments-manifest.sh
```

This writes [`segments.txt`](/home/tsp/projects/DeGoneVideo/segments.txt) using every `segment-*.mp4` in sorted order.

## 6. Join Segments

If all segments share the same codec settings:

```bash
./scripts/concat-segments.sh
```

This produces `degone-presentation-final.mp4`.

If your segments differ in codec, frame rate, or audio layout:

```bash
./scripts/concat-segments.sh --reencode
```

## Validation Checklist

- Page loads from `http://localhost:8000`
- Google Fonts render correctly
- Lucide icons are visible
- Charts animate correctly
- Browser UI does not overlap the presentation
- Every segment uses the same capture size
- Intake completes before the segment ends
- Closing holds long enough to read
- Final MP4 plays through without concat glitches
