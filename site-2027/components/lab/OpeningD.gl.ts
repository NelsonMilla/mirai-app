// Variant D · Atmosphere. A raw WebGL1 fragment shader: a living dawn field
// (domain-warped gradient blobs, stars, grain) over Fuji's silhouette and its
// reflection in a lake, plus a refractive lens that shows the sky a little
// further into the morning. No dependencies. Returns null when WebGL is missing
// so the CSS frame underneath stays the finished picture.

export type FujiBox = { cx: number; top: number; hb: number; bottom: number }; // CSS px, stage-relative
export type SkyFrame = {
  time: number;
  dawn: number; // 0 pre-dawn indigo → 1 sun on the summit
  lensDawn: number; // how much further into the morning the lens sees
  lens: [number, number, number]; // x, y, r in CSS px, stage-relative (r = 0 → no lens)
  fuji: FujiBox;
};
export type Sky = {
  resize(cssW: number, cssH: number, quality?: number): void;
  render(f: SkyFrame): void;
  destroy(): void;
};

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform float uDawn;
uniform float uLensDawn;
uniform vec3 uLens;   // px, bottom-left origin
uniform vec4 uFuji;   // cx, peakY, halfBase, horizonY (px, bottom-left origin)

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    s += a * noise(p);
    p = p * 2.03 + vec2(11.3, 7.7);
    a *= 0.5;
  }
  return s;
}

// Same curve as profile() in OpeningD.tsx: flat crater, concave flanks.
float profile(float xn) {
  float d = abs(xn);
  float dd = max(d - 0.05, 0.0) / 0.95;
  float h = pow(max(1.0 - dd, 0.0), 1.7);
  h -= 0.008 * (1.0 - smoothstep(0.0, 0.05, d));
  return h;
}

vec2 sunPos(float dawn) {
  float H = uFuji.y - uFuji.w;
  float y = mix(uFuji.w + H * 0.22, uFuji.y + 0.03 * uRes.y, smoothstep(0.04, 1.0, dawn));
  return vec2(uFuji.x, y);
}

vec3 skyAt(vec2 px, float dawn) {
  float Y = uRes.y;
  float A = uRes.x / Y;
  vec2 q = px / Y;
  float hz = uFuji.w / Y;
  float hy = clamp((q.y - hz) / max(1.0 - hz, 0.001), 0.0, 1.0);
  float t = uTime;

  // base: black → ultramarine → violet on the horizon (pearl and peach by sunrise)
  vec3 top = mix(vec3(0.006, 0.008, 0.030), vec3(0.030, 0.070, 0.300), dawn);
  vec3 mid = mix(vec3(0.025, 0.045, 0.230), vec3(0.220, 0.300, 0.760), dawn);
  vec3 low = mix(vec3(0.200, 0.070, 0.230), vec3(0.980, 0.640, 0.440), dawn);
  vec3 c = mix(low, mid, smoothstep(0.0, 0.5, hy));
  c = mix(c, top, smoothstep(0.45, 1.0, hy));

  // monopo-style field: a few large soft blobs, warped so their edges breathe.
  vec2 wq = q + 0.17 * (vec2(fbm(q * 1.15 + vec2(0.0, t * 0.03)), fbm(q * 1.15 + vec2(4.7, -t * 0.026))) - 0.5);
  // ultramarine glow, upper middle
  vec2 b1 = vec2(A * (0.50 + 0.05 * sin(t * 0.05)), 0.88 + 0.03 * cos(t * 0.04));
  float g1 = exp(-pow(length((wq - b1) * vec2(0.75, 1.35)) / 0.36, 2.0));
  c = mix(c, mix(vec3(0.09, 0.19, 0.86), vec3(0.32, 0.54, 1.0), dawn), g1 * 0.9);
  // ember, wide and low behind the mountain
  vec2 b2 = vec2(uFuji.x / Y, hz + 0.05);
  float g2 = exp(-pow(length((wq - b2) * vec2(0.5, 1.45)) / 0.42, 2.0));
  c = mix(c, mix(vec3(0.96, 0.27, 0.07), vec3(1.0, 0.66, 0.34), dawn), g2 * (0.78 + 0.18 * dawn));
  // ember drifting low on the left
  vec2 b3 = vec2(A * (0.04 + 0.04 * sin(t * 0.03 + 1.0)), hz + 0.15 + 0.04 * sin(t * 0.04));
  float g3 = exp(-pow(length((wq - b3) * vec2(0.9, 1.25)) / 0.30, 2.0));
  c = mix(c, mix(vec3(0.86, 0.22, 0.07), vec3(1.0, 0.52, 0.24), dawn), g3 * 0.72);
  // voids: deep pockets where the type sits and in the far corner
  vec2 b4 = vec2(A * 0.2, 0.74);
  float g4 = exp(-pow(length((wq - b4) * vec2(0.8, 1.0)) / 0.36, 2.0));
  c *= 1.0 - g4 * (0.74 - 0.14 * dawn);
  vec2 b5 = vec2(A * 1.02, 0.98);
  float g5 = exp(-pow(length(wq - b5) / 0.3, 2.0));
  c *= 1.0 - g5 * 0.7;
  float e = max(g2, g3);

  // stars, gone by sunrise
  vec2 g = q * 150.0;
  vec2 id = floor(g);
  float hs = hash(id);
  if (hs > 0.968) {
    vec2 o = vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5;
    float d = length(fract(g) - 0.5 - o * 0.6);
    float tw = 0.55 + 0.45 * sin(t * (0.8 + hs * 3.0) + hs * 40.0);
    float s = smoothstep(0.17, 0.0, d) * tw * (hs - 0.968) / 0.032;
    c += vec3(0.9, 0.92, 1.0) * s * pow(1.0 - dawn, 2.0) * smoothstep(0.15, 0.6, hy) * (1.0 - e);
  }

  // the sun, below the summit until the end
  vec2 sun = sunPos(dawn);
  float ds = length(px - sun) / Y;
  c += vec3(1.0, 0.55, 0.26) * exp(-ds * 3.2) * (0.10 + 0.85 * dawn);
  c += vec3(1.0, 0.82, 0.6) * exp(-ds * 13.0) * smoothstep(0.2, 1.0, dawn) * 0.9;
  c += vec3(1.0, 0.95, 0.85) * smoothstep(0.024, 0.019, ds) * smoothstep(0.3, 0.9, dawn);
  return c;
}

vec3 above(vec2 px, float dawn) {
  float Y = uRes.y;
  vec3 c = skyAt(px, dawn);

  float xn = (px.x - uFuji.x) / uFuji.z;
  float H = uFuji.y - uFuji.w;
  float ridge = uFuji.w + H * profile(xn);
  float m = smoothstep(ridge + 0.9, ridge - 0.9, px.y);
  if (m > 0.0) {
    float hn = (px.y - uFuji.w) / H;
    vec3 rock = mix(vec3(0.030, 0.030, 0.080), vec3(0.10, 0.070, 0.15), dawn);
    rock *= 0.82 + 0.3 * noise(vec2(xn * 55.0, hn * 4.0));
    float a = xn / max(1.0 - hn, 0.04);
    float fing = 0.6 * noise(vec2(a * 9.0, 0.5)) + 0.4 * noise(vec2(a * 23.0, 2.0));
    float sl = 0.64 + 0.025 * sin(a * 5.0 + 0.8) - 0.24 * smoothstep(0.52, 0.86, fing);
    float snow = smoothstep(sl - 0.004, sl + 0.012, hn);
    vec3 snowC = mix(vec3(0.19, 0.21, 0.38), vec3(0.86, 0.66, 0.72), dawn);
    snowC *= (0.72 + 0.4 * smoothstep(0.5, 1.0, hn)) * (0.84 + 0.16 * noise(vec2(a * 40.0, hn * 3.0)));
    vec3 mc = mix(rock, snowC, snow);
    float edge = exp(-(ridge - px.y) / (0.005 * Y));
    float near = exp(-abs(px.x - uFuji.x) / (0.22 * Y));
    mc += vec3(1.0, 0.58, 0.32) * edge * near * (0.18 + 1.1 * dawn);
    vec3 haze = mix(vec3(0.09, 0.07, 0.18), vec3(0.72, 0.44, 0.38), dawn);
    mc = mix(mc, haze, smoothstep(0.45, 0.0, hn) * (0.22 + 0.25 * dawn));
    c = mix(c, mc, m);
  }

  // treeline on the far shore
  if (px.y < uFuji.w + 0.04 * Y) {
    float tl = uFuji.w + Y * (0.008 + 0.012 * fbm(vec2(px.x / Y * 9.0, 3.0)) + 0.005 * noise(vec2(px.x / Y * 120.0, 1.0)));
    float tm = smoothstep(tl + 0.9, tl - 0.9, px.y);
    c = mix(c, vec3(0.012, 0.012, 0.03) + vec3(0.06, 0.035, 0.045) * dawn, tm);
  }
  return c;
}

vec3 flare(vec2 px, float dawn) {
  float Y = uRes.y;
  vec2 sun = sunPos(dawn);
  float g = exp(-pow((sun.y - uFuji.y) / (0.05 * Y), 2.0)) * smoothstep(0.3, 0.7, dawn);
  if (g < 0.002) return vec3(0.0);
  vec2 r = (px - vec2(uFuji.x, uFuji.y + 0.004 * Y)) / Y;
  float L = length(r);
  float core = exp(-L * 60.0);
  float sh = exp(-abs(r.y) * 260.0) * exp(-abs(r.x) * 5.5);
  float sv = exp(-abs(r.x) * 300.0) * exp(-abs(r.y) * 8.0);
  float a = atan(r.y, r.x);
  float rays = pow(0.5 + 0.5 * cos(a * 8.0 + 0.4), 16.0) * exp(-L * 8.0);
  return vec3(1.0, 0.86, 0.68) * (core * 1.7 + sh * 0.9 + sv * 0.45 + rays * 0.55) * g;
}

vec3 scene(vec2 px, float dawn) {
  float Y = uRes.y;
  vec3 c;
  if (px.y >= uFuji.w) {
    c = above(px, dawn);
    c += flare(px, dawn);
  } else {
    float depth = (uFuji.w - px.y) / Y;
    float wob = (noise(vec2(px.x / Y * 5.0, depth * 70.0 - uTime * 0.5)) - 0.5) * (0.004 + depth * 0.09) * Y;
    vec2 rp = vec2(px.x + wob, 2.0 * uFuji.w - px.y + 1.0);
    c = above(rp, dawn) * vec3(0.58, 0.60, 0.76);
    c += flare(rp, dawn) * 0.45;
    c *= 1.0 - smoothstep(0.0, 0.3, depth) * 0.5;
    vec2 sun = sunPos(dawn);
    float gl = pow(noise(vec2(px.x / Y * 90.0, depth * 520.0 + uTime * 1.4)), 7.0);
    c += vec3(1.0, 0.72, 0.42) * gl * exp(-abs(px.x - sun.x) / (0.07 * Y)) * 2.4 * smoothstep(0.25, 1.0, dawn);
  }
  // mist lying on the water line
  float dy = abs(px.y - uFuji.w) / Y;
  if (dy < 0.14) {
    float mist = exp(-dy / 0.03) * (0.35 + 0.65 * fbm(vec2(px.x / Y * 2.6 - uTime * 0.02, px.y / Y * 9.0)));
    c += mix(vec3(0.10, 0.08, 0.20), vec3(0.80, 0.52, 0.40), dawn) * mist * (0.22 + 0.3 * dawn);
  }
  return c;
}

void main() {
  vec2 px = gl_FragCoord.xy;
  vec3 c;
  vec2 dv = px - uLens.xy;
  float dl = length(dv);
  if (uLens.z > 1.0 && dl < uLens.z) {
    // a glass lensball: the view through it is inverted, wide, and a little further into the morning
    float k = dl / uLens.z;
    float ld = clamp(uDawn + uLensDawn, 0.0, 1.0);
    vec2 dir = dv / max(dl, 1.0);
    vec2 b = uLens.xy - dv * (1.5 + 2.4 * k * k);
    float ab = uLens.z * 0.09 * k * k;
    c.r = scene(b - dir * ab, ld).r;
    c.g = scene(b, ld).g;
    c.b = scene(b + dir * ab, ld).b;
    c *= 1.08;
    c *= 1.0 - smoothstep(0.8, 1.0, k) * 0.3;
    float rimBand = smoothstep(0.93, 0.985, k) * (1.0 - smoothstep(0.985, 1.0, k));
    c += vec3(0.55, 0.5, 0.48) * rimBand;
    float caustic = smoothstep(0.72, 0.96, k) * (1.0 - smoothstep(0.96, 1.0, k)) * smoothstep(0.2, 0.95, -dir.y);
    c += vec3(1.0, 0.72, 0.48) * caustic * (0.25 + 0.45 * ld);
  } else {
    c = scene(px, uDawn);
  }
  vec2 uv = px / uRes;
  c *= 1.0 - 0.32 * pow(length((uv - 0.5) * vec2(1.05, 1.25)), 2.2);
  c += (hash(px + fract(uTime * 7.0) * 517.0) - 0.5) * 0.075;
  gl_FragColor = vec4(c, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    if (process.env.NODE_ENV !== 'production') console.warn('[OpeningD] shader:', gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export function createSky(canvas: HTMLCanvasElement, opts: { maxDpr: number; maxPixels: number }): Sky | null {
  let gl: WebGLRenderingContext | null = null;
  try {
    gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: 'default',
    }) as WebGLRenderingContext | null;
  } catch {
    return null;
  }
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = {
    res: gl.getUniformLocation(prog, 'uRes'),
    time: gl.getUniformLocation(prog, 'uTime'),
    dawn: gl.getUniformLocation(prog, 'uDawn'),
    lensDawn: gl.getUniformLocation(prog, 'uLensDawn'),
    lens: gl.getUniformLocation(prog, 'uLens'),
    fuji: gl.getUniformLocation(prog, 'uFuji'),
  };

  let cw = 1, ch = 1, cssW = 1, cssH = 1;

  return {
    resize(w, h, quality = 1) {
      cssW = Math.max(1, w);
      cssH = Math.max(1, h);
      const dpr = Math.min(window.devicePixelRatio || 1, opts.maxDpr);
      const pr = Math.min(dpr, Math.sqrt(opts.maxPixels / (cssW * cssH))) * quality;
      cw = Math.max(1, Math.round(cssW * pr));
      ch = Math.max(1, Math.round(cssH * pr));
      canvas.width = cw;
      canvas.height = ch;
      gl!.viewport(0, 0, cw, ch);
    },
    render(f) {
      const g = gl!;
      const sx = cw / cssW, sy = ch / cssH;
      g.uniform2f(u.res, cw, ch);
      g.uniform1f(u.time, f.time);
      g.uniform1f(u.dawn, f.dawn);
      g.uniform1f(u.lensDawn, f.lensDawn);
      g.uniform3f(u.lens, f.lens[0] * sx, (cssH - f.lens[1]) * sy, f.lens[2] * sx);
      g.uniform4f(u.fuji, f.fuji.cx * sx, (cssH - f.fuji.top) * sy, f.fuji.hb * sx, (cssH - f.fuji.bottom) * sy);
      g.drawArrays(g.TRIANGLES, 0, 3);
    },
    destroy() {
      gl!.deleteProgram(prog);
      gl!.deleteShader(vs);
      gl!.deleteShader(fs);
      gl!.deleteBuffer(buf);
    },
  };
}
