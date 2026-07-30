"""Convert the source PNG frame sequence to web-ready WebP.

Source : ./ramses farmes/ezgif-frame-###.png   (240 frames, 1280x720)
Output : ./public/seq/desktop/f###.webp  (1280w)
         ./public/seq/mobile/f###.webp   (720w)
         ./public/seq/manifest.json      (count + naming pattern)

Run once: python scripts/build-frames.py
"""
import json
import os
import re
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "ramses farmes"
OUT = ROOT / "public" / "seq"

VARIANTS = {
    "desktop": dict(width=1280, quality=68),
    "mobile": dict(width=720, quality=62),
}

files = sorted(SRC.glob("*.png"), key=lambda p: int(re.search(r"(\d+)", p.stem).group(1)))
assert files, f"no frames found in {SRC}"

for name, cfg in VARIANTS.items():
    (OUT / name).mkdir(parents=True, exist_ok=True)

first = Image.open(files[0])
ratio = first.height / first.width

for i, path in enumerate(files, start=1):
    im = Image.open(path).convert("RGB")
    for name, cfg in VARIANTS.items():
        w = cfg["width"]
        h = round(w * ratio / 2) * 2
        dst = OUT / name / f"f{i:03d}.webp"
        im.resize((w, h), Image.LANCZOS).save(dst, "WEBP", quality=cfg["quality"], method=5)
    if i % 20 == 0:
        print(f"{i}/{len(files)}", flush=True)

manifest = {
    "count": len(files),
    "pattern": "/seq/{variant}/f{index}.webp",
    "pad": 3,
    "aspect": round(first.width / first.height, 6),
    "variants": {k: {"width": v["width"], "height": round(v["width"] * ratio / 2) * 2} for k, v in VARIANTS.items()},
}
(OUT / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")

total = sum(f.stat().st_size for v in VARIANTS for f in (OUT / v).glob("*.webp"))
print(f"done: {len(files)} frames, {total / 1e6:.1f} MB total")
