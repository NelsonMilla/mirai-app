#!/usr/bin/env python3
"""Portrait variants for the speaker walls. From img/speakers/<id>.jpeg it writes:

  img/speakers/thumb/<id>.jpeg   256px square JPEG (the /program/ wall)
  img/speakers/thumb/<id>.webp   the same square as WebP
  img/speakers/480/<id>.webp     480px wide, source aspect kept (phone tiles at 2x)
  img/speakers/800/<id>.webp     800px wide, source aspect kept (desktop big tiles at 2x)

It never upscales: a source narrower than the target is written at its own width.
Only outputs that are missing or older than their source are written, so reruns are
cheap and git stays quiet. Needs Pillow with WebP support (pip3 install pillow).
Run after adding portraits, then `npm run photos:manifest`.
"""
import os
from PIL import Image, ImageOps

here = os.path.dirname(os.path.abspath(__file__))
src = os.path.join(here, '..', 'img', 'speakers')
OUT = {'thumb': os.path.join(src, 'thumb'), '480': os.path.join(src, '480'), '800': os.path.join(src, '800')}
for d in OUT.values(): os.makedirs(d, exist_ok=True)

def stale(out, source):
    return not os.path.exists(out) or os.path.getmtime(out) < os.path.getmtime(source)

def fit_width(im, w):
    if im.width <= w: return im
    return im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)

written = 0
for f in sorted(os.listdir(src)):
    if not f.endswith('.jpeg'): continue
    path = os.path.join(src, f); sid = f[:-5]
    im = None
    jobs = [
        (os.path.join(OUT['thumb'], sid + '.jpeg'), 'thumb', 'JPEG'),
        (os.path.join(OUT['thumb'], sid + '.webp'), 'thumb', 'WEBP'),
        (os.path.join(OUT['480'], sid + '.webp'), 480, 'WEBP'),
        (os.path.join(OUT['800'], sid + '.webp'), 800, 'WEBP'),
    ]
    for out, kind, fmt in jobs:
        if not stale(out, path): continue
        if im is None: im = Image.open(path).convert('RGB')
        if kind == 'thumb':
            v = ImageOps.fit(im, (256, 256), Image.LANCZOS, centering=(0.5, 0.2))
        else:
            v = fit_width(im, kind)
        if fmt == 'JPEG':
            v.save(out, 'JPEG', quality=78, optimize=True, progressive=True)
        else:
            v.save(out, 'WEBP', quality=80 if kind == 'thumb' else 82, method=6)
        written += 1
print(f'{written} files written under img/speakers/ (thumb/, 480/, 800/)')
