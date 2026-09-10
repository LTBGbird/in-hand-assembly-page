#!/usr/bin/env python3
"""Export the verified experiment cuts and original paper figures for the website.

Usage: python3 scripts/prepare_media.py --ffmpeg /path/to/ffmpeg
Requires Pillow and pypdf. Source files are only read; outputs stay in assets/.
"""
import argparse
import json
import subprocess
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from PIL import Image
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
FPS = 25
# Exclusive end frames, checked against the section cuts in the edited master.
CUTS = [
    ("bottle", 235, 724, 4),
    ("syringe", 724, 1216, 9),
    ("marker", 1216, 1657, 3),
    ("bottle-recovery", 1657, 2401, 6),
    ("syringe-recovery", 2401, 3118, 13),
    ("bottle-tilt", 3118, 3633, 7),
    ("syringe-tilt", 3635, 4373, 10),
]
# Full success-rate sequence in main 0604 2.mp4, after the one-frame black cut.
SUCCESS_TEST_CUT = (4513, 7235, 2)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ffmpeg", default="ffmpeg")
    parser.add_argument("--source", type=Path, default=Path("/Users/bird/fachand_video/output/main 0604 3.mp4"))
    parser.add_argument("--paper", type=Path, default=ROOT / "assets/papers/paper.pdf")
    parser.add_argument("--hero-source", type=Path, default=ROOT.parent / "cover_v0910.mp4")
    parser.add_argument("--success-test-source", type=Path, default=Path("/Users/bird/fachand_video/output/main 0604 2.mp4"))
    only = parser.add_mutually_exclusive_group()
    only.add_argument("--only-hero", action="store_true")
    only.add_argument("--only-success-test", action="store_true")
    args = parser.parse_args()
    videos = ROOT / "assets/videos"
    images = ROOT / "assets/images"
    videos.mkdir(parents=True, exist_ok=True)
    images.mkdir(parents=True, exist_ok=True)

    def run(*options):
        subprocess.run([args.ffmpeg, "-hide_banner", "-loglevel", "error", "-y", *map(str, options)], check=True)

    success_test_record = None
    if not args.only_hero:
        start, end, poster_time = SUCCESS_TEST_CUT
        duration = (end - start) / FPS
        run("-ss", start / FPS, "-i", args.success_test_source, "-t", duration,
            "-map", "0:v:0", "-map", "0:a?", "-c:v", "libx264",
            "-preset", "medium", "-crf", "21", "-pix_fmt", "yuv420p",
            "-threads", "2", "-c:a", "aac", "-b:a", "128k",
            "-movflags", "+faststart", videos / "uncut-success-rate-test.mp4")
        run("-ss", start / FPS + poster_time, "-i", args.success_test_source,
            "-frames:v", "1", "-vf", "scale=1920:1080", "-q:v", "2",
            images / "uncut-success-rate-test.jpg")
        success_test_record = {
            "source": str(args.success_test_source), "fps": FPS,
            "startFrame": start, "endFrameExclusive": end, "duration": duration,
            "posterOffsetSeconds": poster_time,
            "video": "assets/videos/uncut-success-rate-test.mp4",
            "poster": "assets/images/uncut-success-rate-test.jpg",
            "finalOnScreenCounts": {"Bottle": "14/20", "Syringe": "19/20", "Marker": "16/20"},
            "note": "Original counters and playback speed preserved; video counts differ from the paper's Table 1."
        }
        print(f"Exported uncut success-rate test: {duration:.2f}s", flush=True)
    if args.only_success_test:
        manifest = ROOT / "assets/media-manifest.json"
        data = json.loads(manifest.read_text()) if manifest.exists() else {}
        data["successRateTest"] = success_test_record
        manifest.write_text(json.dumps(data, indent=2) + "\n")
        return

    # Preserve the complete user-edited cover; only adapt encoding for the web.
    run("-i", args.hero_source, "-an",
        "-vf", "scale=1920:1080", "-c:v", "libx264", "-crf", "22",
        "-preset", "medium", "-pix_fmt", "yuv420p", "-threads", "2",
        "-movflags", "+faststart", videos / "hero.mp4")
    run("-ss", "1.00", "-i", args.hero_source, "-frames:v", "1",
        "-vf", "scale=1920:1080", "-q:v", "2", images / "hero.jpg")
    hero_record = {"source": str(args.hero_source), "fullClip": True,
                   "posterSeconds": 1.00, "audio": False}
    if args.only_hero:
        manifest = ROOT / "assets/media-manifest.json"
        data = json.loads(manifest.read_text()) if manifest.exists() else {}
        data["hero"] = hero_record
        manifest.write_text(json.dumps(data, indent=2) + "\n")
        print("Exported complete hero clip", flush=True)
        return

    def export(cut):
        name, start, end, poster_time = cut
        duration = (end - start) / FPS
        run("-ss", start / FPS, "-i", args.source, "-t", duration,
            "-map", "0:v:0", "-map", "0:a?", "-c:v", "libx264",
            "-preset", "medium", "-crf", "21", "-pix_fmt", "yuv420p",
            "-threads", "2", "-c:a", "aac", "-b:a", "128k",
            "-movflags", "+faststart", videos / f"{name}.mp4")
        run("-ss", start / FPS + poster_time, "-i", args.source,
            "-frames:v", "1", "-vf", "scale=1440:-2", "-q:v", "2", images / f"{name}.jpg")
        print(f"Exported {name}: {duration:.2f}s", flush=True)
        return {"id": name, "startFrame": start, "endFrameExclusive": end,
                "duration": duration, "posterOffsetSeconds": poster_time,
                "video": f"assets/videos/{name}.mp4", "poster": f"assets/images/{name}.jpg"}

    with ThreadPoolExecutor(max_workers=2) as pool:
        records = list(pool.map(export, CUTS))
    reader = PdfReader(args.paper)
    for page, name in [(2, "task-geometry"), (4, "reference-snapshot"), (5, "hand-morphology")]:
        original = reader.pages[page].images[0].image.convert("RGB")
        original.thumbnail((2400, 2400), Image.Resampling.LANCZOS)
        original.save(images / f"{name}.jpg", quality=94, subsampling=0)
    (ROOT / "assets/media-manifest.json").write_text(json.dumps({
        "source": str(args.source), "fps": FPS, "experiments": records, "hero": hero_record,
        "successRateTest": success_test_record,
        "figures": {"task-geometry": "Paper Figure 2", "reference-snapshot": "Paper Figure 3",
                    "hand-morphology": "Paper Figure 4"}
    }, indent=2) + "\n")


if __name__ == "__main__":
    main()
