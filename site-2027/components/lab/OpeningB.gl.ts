// Opening B ("Sculpture"): Mount Fuji as a generated object, drawn in raw WebGL2.
// A polar heightfield (dense at the summit, sparse at the horizon) is displaced in the
// vertex shader: concave cone, summit crater, radial gullies, the Hōei crater, hills,
// far ranges and a lake that mirrors the mountain. The fragment shader lights it at dawn
// (alpenglow from behind the camera, Earth's shadow and the Belt of Venus in the sky) and
// draws 100 m / 500 m contour lines plus one scanning altitude ring.
// Lazy-loaded by OpeningB.tsx; returns null when WebGL2 is missing so the SVG frame stays.

const DEG = Math.PI / 180;

// Terrain constants (km). Kept in sync with the GLSL below and the SVG fallback.
export const FUJI = { R: 20, HP: 2.45, K: 2.25, APRON: 0.55, GROUND: 1.0, TOP: 3.776, WATER: 0.9, E: 1.8 };

function smin(a: number, b: number, k: number) {
  const h = Math.min(Math.max(0.5 + (0.5 * (b - a)) / k, 0), 1);
  return b * (1 - h) + a * h - k * h * (1 - h);
}
/** Noise-free altitude (km) at distance r (km) from the summit. */
export function profile(r: number) {
  const rn = r / FUJI.R;
  const cone = FUJI.HP * Math.pow(Math.max(1 - rn, 0), FUJI.K) + FUJI.APRON * Math.exp(-rn * 2.2);
  return smin(FUJI.GROUND + cone, FUJI.TOP, 0.1);
}
/** Distance from the summit (km) where the noise-free slope reaches altitude a (km). */
export function radiusAt(a: number) {
  let lo = 0, hi = FUJI.R * 1.4;
  for (let i = 0; i < 28; i++) {
    const mid = (lo + hi) / 2;
    if (profile(mid) > a) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const TERRAIN = /* glsl */ `
const float R=${FUJI.R.toFixed(2)};
const float HP=${FUJI.HP.toFixed(3)};
const float KP=${FUJI.K.toFixed(3)};
const float APRON=${FUJI.APRON.toFixed(3)};
const float GROUND=${FUJI.GROUND.toFixed(3)};
const float TOP=${FUJI.TOP.toFixed(3)};
const float WATER=${FUJI.WATER.toFixed(3)};
uniform vec2 uLake;
uniform vec2 uLakeAxis;
float smin(float a,float b,float k){float h=clamp(0.5+0.5*(b-a)/k,0.0,1.0);return mix(b,a,h)-k*h*(1.0-h);}
float height(vec2 p,out float g){
  float r=length(p);
  float rn=r/R;
  float h=GROUND+HP*pow(max(1.0-rn,0.0),KP)+APRON*exp(-rn*2.2);
  h=smin(h,TOP,0.1);
  // summit crater and rim
  h-=0.24*smoothstep(0.46,0.12,r);
  h+=0.035*exp(-pow((r-0.5)/0.12,2.0));
  // radial gullies (barrancos), strongest on the mid flanks
  g=0.0;
  float band=smoothstep(0.02,0.12,rn)*(1.0-smoothstep(0.28,0.62,rn));
  if(band>0.0){
    vec2 dir=p/max(r,1e-3);
    vec3 q=vec3(dir*6.5,rn*2.6);
    float n1=1.0-abs(snoise(q));
    float n2=1.0-abs(snoise(q*vec3(2.0,2.0,1.5)+11.3));
    float rg=n1*0.8+n2*0.2;
    float gully=smoothstep(0.62,0.96,rg);
    g=(0.22-gully)*band;
    h+=(g*0.1+(n1-0.7)*0.035*band)*(1.0-rn*0.5);
  }
  // Hoei crater on the south-east flank
  vec2 hc=p-vec2(3.4,3.7);
  float hd=length(hc*vec2(1.0,0.8));
  h-=0.30*smoothstep(1.5,0.25,hd)*smoothstep(0.55,0.15,rn);
  h+=0.06*exp(-pow((hd-1.6)/0.45,2.0));
  // rolling hills around the foot
  vec2 dn=p/max(r,1e-3);
  float front=smoothstep(-0.15,0.55,dot(dn,uLakeAxis));
  float hw=smoothstep(0.75,1.7,rn)*(1.0-front*(1.0-smoothstep(46.0,62.0,r)));
  if(hw>0.0){
    float n=snoise(vec3(p*0.07,3.7))*0.6+snoise(vec3(p*0.17,9.1))*0.3+snoise(vec3(p*0.42,1.3))*0.1;
    h+=hw*0.42*(n*0.5+0.5);
  }
  // far ranges dissolving into haze
  float fw=smoothstep(42.0,85.0,r)*(1.0-0.9*front);
  if(fw>0.0){
    float m1=1.0-abs(snoise(vec3(p*0.026,5.1)));
    float m2=1.0-abs(snoise(vec3(p*0.07,2.2)));
    h+=fw*(m1*m1*2.1+m1*m2*0.8);
  }
  // the lake in front of the mountain
  vec2 lp=p-uLake;
  vec2 lq=vec2(dot(lp,uLakeAxis),dot(lp,vec2(-uLakeAxis.y,uLakeAxis.x)));
  float le=length(lq/vec2(7.5,15.0))+snoise(vec3(p*0.22,4.0))*0.14;
  h-=0.75*smoothstep(1.0,0.6,le);
  return max(h,WATER);
}`;

const SKY = /* glsl */ `
uniform vec3 uSun;
uniform float uDawn;
// Dawn with the sun behind the viewer: Earth's shadow (blue band on the horizon),
// the Belt of Venus (pink band above it), indigo at the zenith. uDawn warms it all.
vec3 sky(vec3 rd){
  float ed=asin(clamp(rd.y,0.0,1.0))*57.2958;
  vec3 shade=mix(vec3(0.085,0.095,0.175),vec3(0.34,0.40,0.56),uDawn);
  vec3 belt=mix(vec3(0.46,0.30,0.40),vec3(0.82,0.64,0.62),uDawn);
  vec3 mid=mix(vec3(0.11,0.12,0.25),vec3(0.30,0.40,0.62),uDawn);
  vec3 zen=mix(vec3(0.016,0.02,0.06),vec3(0.10,0.17,0.36),uDawn);
  float hb=2.2*(1.0-uDawn*0.5);
  vec3 c=mix(shade,belt,smoothstep(hb*0.3,hb+1.6,ed));
  c=mix(c,mid,smoothstep(hb+2.2,hb+9.0,ed));
  c=mix(c,zen,smoothstep(9.0,38.0,ed));
  vec3 Lh=normalize(vec3(uSun.x,0.0,uSun.z));
  float s=max(dot(normalize(vec3(rd.x,0.0,rd.z)+1e-5),Lh),0.0);
  c+=vec3(1.0,0.46,0.26)*pow(s,8.0)*exp(-ed*0.12)*(0.3+uDawn*0.6);
  return c;
}`;

const TERRAIN_VS = /* glsl */ `#version 300 es
precision highp float;
in vec2 aXZ;
uniform mat4 uVP;
uniform vec3 uCam;
uniform float uE;
uniform float uMirror;
out vec3 vPos;
out vec3 vNor;
out float vH;
out float vG;
out float vR;
out float vDist;
out float vSn;
${NOISE}
${TERRAIN}
void main(){
  vec2 p=aXZ;
  float r=length(p);
  float e=0.02+r*0.004;
  float g,gx,gz;
  float h=height(p,g);
  float hx=height(p+vec2(e,0.0),gx);
  float hz=height(p+vec2(0.0,e),gz);
  vNor=normalize(vec3(-(hx-h)*uE,e,-(hz-h)*uE));
  vec3 world=vec3(p.x,h*uE,p.y);
  vec3 pos=world;
  if(uMirror>0.5) pos.y=2.0*WATER*uE-pos.y;
  vPos=world;
  vH=h;
  vG=g;
  vR=r;
  vSn=snoise(vec3(p*0.55,7.7));
  vDist=length(pos-uCam);
  gl_Position=uVP*vec4(pos,1.0);
}`;

const TERRAIN_FS = /* glsl */ `#version 300 es
precision highp float;
in vec3 vPos;
in vec3 vNor;
in float vH;
in float vG;
in float vR;
in float vDist;
in float vSn;
uniform vec3 uCam;
uniform float uMirror;
uniform float uScan;
uniform float uScanOn;
uniform float uFogStart;
uniform float uFogK;
uniform float uTime;
uniform float uBreath;
out vec4 outColor;
const float R=${FUJI.R.toFixed(2)};
const float WATER=${FUJI.WATER.toFixed(3)};
${SKY}
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){
  bool water=vH<=WATER+0.0004;
  if(uMirror>0.5&&water) discard;
  vec3 N=normalize(vNor);
  vec3 L=normalize(uSun);
  vec3 toP=vPos-uCam;
  vec3 rd=normalize(toP);
  // atmosphere: haze grows past the mountain, plus mist pooled on the plain
  float fog=1.0-exp(-max(vDist-uFogStart,0.0)*uFogK);
  fog=max(fog,smoothstep(1.55,0.95,vH)*smoothstep(uFogStart*0.6,uFogStart*1.4,vDist)*0.55);
  fog=clamp(fog,0.0,1.0);
  vec3 fogCol=sky(normalize(vec3(rd.x,max(rd.y,0.0),rd.z)));
  if(water){
    float c=abs(rd.y);
    float fr=0.03+0.97*pow(1.0-c,5.0);
    float rip=hash(floor(vPos.xz*vec2(2.4,9.0)+vec2(0.0,uTime*0.6)));
    float a=clamp((1.0-fr)*0.55,0.12,0.6)*(0.85+rip*0.15);
    vec3 tint=vec3(0.012,0.02,0.045);
    outColor=vec4(mix(tint,fogCol,fog),max(a,fog));
    return;
  }
  float ndl=dot(N,L);
  // snow cap: lower in the gullies, ragged edge
  float snowLine=2.36+vG*0.5+vSn*0.1;
  float snow=smoothstep(snowLine-0.06,snowLine+0.08,vH);
  vec3 base=mix(vec3(0.07,0.075,0.10),vec3(0.13,0.095,0.10),smoothstep(1.9,2.7,vH));
  vec3 alb=mix(base,vec3(0.93,0.94,0.99),snow);
  vec3 sunCol=mix(vec3(1.0,0.40,0.34),vec3(1.0,0.74,0.56),uDawn)*(1.15+uDawn*0.45);
  float wrap=mix(max(ndl,0.0),max((ndl+0.3)/1.3,0.0),snow);
  vec3 amb=mix(vec3(0.05,0.05,0.08),vec3(0.30,0.33,0.55),N.y*0.5+0.5)*(0.7+uDawn*0.6);
  vec3 col=alb*(sunCol*wrap+amb);
  // contour lines: 100 m minor, 500 m index, antialiased in screen space
  float a1=vH*10.0;
  float f1=fwidth(a1);
  float d1=abs(fract(a1+0.5)-0.5)/max(f1,1e-5);
  float minor=(1.0-smoothstep(0.3,1.05,d1))*(1.0-smoothstep(0.16,0.42,f1));
  float a5=vH*2.0;
  float f5=fwidth(a5);
  float d5=abs(fract(a5+0.5)-0.5)/max(f5,1e-5);
  float major=(1.0-smoothstep(0.55,1.45,d5))*(1.0-smoothstep(0.22,0.55,f5));
  float lit=smoothstep(-0.15,0.55,ndl);
  vec3 lineCol=mix(vec3(0.36,0.48,0.86)*0.65,vec3(1.0,0.66,0.52),lit);
  float near=1.0-smoothstep(R*1.1,R*2.2,vR)*0.6;
  float la=max(minor*0.42*near,major*0.95)*uBreath;
  col+=lineCol*la*(1.0-snow)*0.85;
  col=mix(col,col*0.62+lineCol*0.05,la*snow*0.75);
  // scanning altitude ring, only on the cone
  float cone=1.0-smoothstep(R*0.82,R*1.0,vR);
  float sf=fwidth(vH);
  float sd=abs(vH-uScan);
  float scan=(1.0-smoothstep(0.6*sf,1.8*sf,sd))+exp(-sd*42.0)*0.28;
  col+=vec3(1.0,0.88,0.80)*scan*uScanOn*cone;
  col=mix(col,fogCol,fog);
  if(uMirror>0.5) col*=0.82;
  col+=(hash(gl_FragCoord.xy)-0.5)/255.0;
  outColor=vec4(col,1.0);
}`;

const SKY_VS = /* glsl */ `#version 300 es
out vec2 vNdc;
void main(){
  vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));
  vNdc=p*2.0-1.0;
  gl_Position=vec4(vNdc,0.0,1.0);
}`;

const SKY_FS = /* glsl */ `#version 300 es
precision highp float;
in vec2 vNdc;
uniform vec3 uRight;
uniform vec3 uUp;
uniform vec3 uFwd;
uniform vec2 uTan;
uniform vec2 uShift;
uniform float uStars;
out vec4 outColor;
${SKY}
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){
  vec2 q=vNdc-uShift;
  vec3 rd=normalize(uFwd+q.x*uTan.x*uRight+q.y*uTan.y*uUp);
  vec3 c;
  if(rd.y>=0.0){
    c=sky(rd);
    vec2 sp=vec2(atan(rd.z,rd.x),asin(rd.y))*260.0;
    vec2 cell=floor(sp);
    float h=hash(cell);
    float d=length(fract(sp)-0.5);
    float star=step(0.9965,h)*smoothstep(0.32,0.0,d)*(0.5+0.5*hash(cell+3.1));
    c+=vec3(0.85,0.88,1.0)*star*uStars*smoothstep(0.08,0.45,rd.y);
  }else{
    c=sky(vec3(rd.x,-rd.y,rd.z))*mix(1.0,0.78,smoothstep(0.0,0.03,-rd.y));
  }
  c+=(hash(gl_FragCoord.xy)-0.5)/255.0;
  outColor=vec4(c,1.0);
}`;

// ── small matrix kit (column-major, like GL) ─────────────────────────────
type V3 = [number, number, number];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);
const ease = (x: number) => x * x * (3 - 2 * x);

function perspective(fovy: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far), m = new Float32Array(16);
  m[0] = f / aspect; m[5] = f; m[10] = (far + near) * nf; m[11] = -1; m[14] = 2 * far * near * nf;
  return m;
}
function view(eye: V3, x: V3, y: V3, z: V3) {
  return new Float32Array([x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, eye), -dot(y, eye), -dot(z, eye), 1]);
}
function mul(a: Float32Array, b: Float32Array) {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
    o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
  }
  return o;
}
function project(m: Float32Array, p: V3): [number, number, number] {
  const x = m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12];
  const y = m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13];
  const w = m[3] * p[0] + m[7] * p[1] + m[11] * p[2] + m[15];
  return [x / w, y / w, w];
}

export type Frame = {
  p: number;   // scroll progress through the opening, 0..1
  mx: number;  // eased pointer, -1..1
  my: number;
  t: number;   // seconds
  scan: number; // scanning altitude, km
};
export type Anchors = { summit: [number, number, boolean]; scan: [number, number, boolean] };

export type Sculpture = {
  resize(cssW: number, cssH: number, dpr: number): void;
  render(f: Frame): Anchors;
  dispose(): void;
};

function compile(gl: WebGL2RenderingContext, vs: string, fs: string) {
  const mk = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
    return s;
  };
  const p = gl.createProgram()!;
  gl.attachShader(p, mk(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || 'link');
  const u = new Proxy({} as Record<string, WebGLUniformLocation | null>, {
    get: (cache, name: string) => (name in cache ? cache[name] : (cache[name] = gl.getUniformLocation(p, name))),
  });
  return { p, u };
}

export function createSculpture(canvas: HTMLCanvasElement, opt: { lite: boolean }): Sculpture | null {
  const gl = canvas.getContext('webgl2', { antialias: !opt.lite, alpha: false, depth: true, powerPreference: opt.lite ? 'low-power' : 'high-performance' });
  if (!gl) return null;
  let terrain: ReturnType<typeof compile>, skyP: ReturnType<typeof compile>;
  try {
    terrain = compile(gl, TERRAIN_VS, TERRAIN_FS);
    skyP = compile(gl, SKY_VS, SKY_FS);
  } catch (e) {
    console.warn('[OpeningB] WebGL compile failed, keeping the static frame', e);
    return null;
  }

  // Polar mesh: ring radii grow exponentially, so the summit gets ~40 m detail and the
  // horizon ~2.5 km, all in one draw call.
  const RINGS = opt.lite ? 150 : 260, SEGS = opt.lite ? 300 : 620, RMAX = 320;
  const b = 4.9, a = RMAX / (Math.exp(b) - 1);
  const verts = new Float32Array((1 + RINGS * SEGS) * 2);
  for (let i = 1; i <= RINGS; i++) {
    const r = a * (Math.exp((b * i) / RINGS) - 1);
    for (let j = 0; j < SEGS; j++) {
      const th = (j / SEGS) * Math.PI * 2, k = (1 + (i - 1) * SEGS + j) * 2;
      verts[k] = Math.cos(th) * r;
      verts[k + 1] = Math.sin(th) * r;
    }
  }
  const idx = new Uint32Array(SEGS * 3 + (RINGS - 1) * SEGS * 6);
  let n = 0;
  for (let j = 0; j < SEGS; j++) { idx[n++] = 0; idx[n++] = 1 + j; idx[n++] = 1 + ((j + 1) % SEGS); }
  for (let i = 1; i < RINGS; i++) {
    const r0 = 1 + (i - 1) * SEGS, r1 = 1 + i * SEGS;
    for (let j = 0; j < SEGS; j++) {
      const j1 = (j + 1) % SEGS;
      idx[n++] = r0 + j; idx[n++] = r1 + j; idx[n++] = r1 + j1;
      idx[n++] = r0 + j; idx[n++] = r1 + j1; idx[n++] = r0 + j1;
    }
  }
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const vb = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vb);
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(terrain.p, 'aXZ');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const ib = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
  gl.bindVertexArray(null);
  const skyVao = gl.createVertexArray();

  let cssW = 1, cssH = 1;
  const E = FUJI.E;
  // The lake sits between the resting camera and the mountain (camera looks from the NNW).
  const AZ0 = -22 * DEG;
  const lakeR = 25;
  const lakeAxis: [number, number] = [Math.sin(AZ0), -Math.cos(AZ0)];
  const lake: [number, number] = [lakeAxis[0] * lakeR, lakeAxis[1] * lakeR];

  return {
    resize(w, h, dpr) {
      cssW = w; cssH = h;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
    },
    render(f) {
      const W = canvas.width, H = canvas.height, aspect = W / H;
      const portrait = aspect < 0.9;
      const k = ease(clamp01(f.p / 0.88));

      // camera: low over the lake at rest, rising to a near plan view with scroll
      // Resting camera: a few km above the lake, looking across it at the mountain
      // (portrait screens sit higher so the cone reads as an object, not a sliver).
      // Scroll lifts it on a sphere around the summit axis to a near plan view.
      const fovY = (portrait ? 38 : 27) * DEG;
      const tanY = Math.tan(fovY / 2), tanX = tanY * aspect;
      const ty = 3.4;
      const d0 = portrait ? 46 : 38, eyeY = portrait ? 12 : 3.4;
      const el0 = Math.atan2(eyeY - ty, d0), dist0 = Math.hypot(d0, eyeY - ty);
      const dist1 = portrait ? 13.5 / tanX : 58;
      const dist = lerp(dist0, dist1, k);
      const el = lerp(el0, 77 * DEG, k) + f.my * 0.8 * DEG * (1 - k);
      const az = AZ0 + Math.sin(f.t * ((2 * Math.PI) / 96)) * 7 * DEG + f.mx * 4 * DEG + k * 38 * DEG;
      const target: V3 = [0, ty, 0];
      const eye: V3 = [
        target[0] + dist * Math.cos(el) * Math.sin(az),
        target[1] + dist * Math.sin(el),
        target[2] - dist * Math.cos(el) * Math.cos(az),
      ];
      const zA = norm(sub(eye, target));
      const xA = norm(cross([0, 1, 0], zA));
      const yA = cross(zA, xA);
      const V = view(eye, xA, yA, zA);
      const P = perspective(fovY, aspect, 0.5, 600);

      // lens shift so the summit lands where the layout wants it, at any aspect ratio
      const summitW: V3 = [0, FUJI.TOP * E, 0];
      const s0 = project(mul(P, V), summitW);
      const want = portrait ? [0, lerp(0.5, 0.34, k)] : [lerp(0.2, 0.36, k), lerp(0.5, 0.02, k)];
      const sx = want[0] - s0[0], sy = want[1] - s0[1];
      P[8] -= sx; P[9] -= sy;
      const VP = mul(P, V);

      // dawn: sun behind the camera's left shoulder, rising with scroll; pointer swings it
      const dawn = clamp01(0.08 + f.p * 1.0);
      const sunEl = (1.6 + dawn * 11) * DEG;
      const sunAz = az + (38 - f.mx * 24) * DEG; // behind the viewer's left shoulder
      const sun: V3 = [Math.cos(sunEl) * Math.sin(sunAz), Math.sin(sunEl), -Math.cos(sunEl) * Math.cos(sunAz)];

      gl.viewport(0, 0, W, H);
      gl.clearColor(0.02, 0.025, 0.06, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // sky
      gl.disable(gl.DEPTH_TEST);
      gl.depthMask(false);
      gl.disable(gl.BLEND);
      gl.useProgram(skyP.p);
      gl.uniform3fv(skyP.u.uRight, xA);
      gl.uniform3fv(skyP.u.uUp, yA);
      gl.uniform3fv(skyP.u.uFwd, [-zA[0], -zA[1], -zA[2]]);
      gl.uniform2f(skyP.u.uTan, tanX, tanY);
      gl.uniform2f(skyP.u.uShift, sx, sy);
      gl.uniform3fv(skyP.u.uSun, sun);
      gl.uniform1f(skyP.u.uDawn, dawn);
      gl.uniform1f(skyP.u.uStars, 1 - dawn);
      gl.bindVertexArray(skyVao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // terrain: mirrored pass (reflection in the lake), then the real one
      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(true);
      gl.useProgram(terrain.p);
      const u = terrain.u;
      gl.uniformMatrix4fv(u.uVP, false, VP);
      gl.uniform3fv(u.uCam, eye);
      gl.uniform1f(u.uE, E);
      gl.uniform3fv(u.uSun, sun);
      gl.uniform1f(u.uDawn, dawn);
      gl.uniform2fv(u.uLake, lake);
      gl.uniform2fv(u.uLakeAxis, lakeAxis);
      gl.uniform1f(u.uScan, f.scan);
      gl.uniform1f(u.uScanOn, 1);
      gl.uniform1f(u.uFogStart, dist * 1.05);
      gl.uniform1f(u.uFogK, 1 / 38);
      gl.uniform1f(u.uTime, f.t);
      gl.uniform1f(u.uBreath, 0.86 + 0.14 * Math.sin(f.t * 0.7));
      gl.bindVertexArray(vao);
      if (el < 40 * DEG) {
        gl.uniform1f(u.uMirror, 1);
        gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_INT, 0);
      }
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.uniform1f(u.uMirror, 0);
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_INT, 0);
      gl.bindVertexArray(null);

      // anchors for the HTML annotations
      const toPx = (q: [number, number, number]): [number, number, boolean] =>
        [(q[0] * 0.5 + 0.5) * cssW, (0.5 - q[1] * 0.5) * cssH, q[2] > 0 && Math.abs(q[0]) < 1.2 && Math.abs(q[1]) < 1.2];
      const rs = radiusAt(f.scan);
      const right: V3 = norm([xA[0], 0, xA[2]]);
      return {
        summit: toPx(project(VP, summitW)),
        scan: toPx(project(VP, [right[0] * rs, f.scan * E, right[2] * rs])),
      };
    },
    dispose() {
      gl.deleteBuffer(vb); gl.deleteBuffer(ib);
      gl.deleteVertexArray(vao); gl.deleteVertexArray(skyVao);
      gl.deleteProgram(terrain.p); gl.deleteProgram(skyP.p);
    },
  };
}
