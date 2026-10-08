#!/usr/bin/env python3
"""Square 256px thumbnails for the /program/ wall: img/speakers/<id>.jpeg → img/speakers/thumb/<id>.jpeg.
Run after adding portraits (needs Pillow: pip3 install pillow), then `npm run photos:manifest`."""
import os
from PIL import Image, ImageOps
here = os.path.dirname(os.path.abspath(__file__))
src = os.path.join(here, '..', 'img', 'speakers'); dst = os.path.join(src, 'thumb')
os.makedirs(dst, exist_ok=True); n = 0
for f in sorted(os.listdir(src)):
    if not f.endswith('.jpeg'): continue
    im = ImageOps.fit(Image.open(os.path.join(src, f)).convert('RGB'), (256, 256), Image.LANCZOS, centering=(0.5, 0.2))
    im.save(os.path.join(dst, f), 'JPEG', quality=78, optimize=True, progressive=True); n += 1
print(f'{n} thumbnails in img/speakers/thumb/')
