(() => {
  const Kit = window.DesignBookKit;
  if (!Kit) {
    console.error("[rgb-cube] DesignBookKit not loaded. Did you include src/designbook-kit.js?");
    return;
  }

  let THREE = null;
  let OrbitControls = null;

  const STYLE_ID = "topic-rgb-cube-styles";

  function ensureStyles() {
    Kit.css.ensureStyleOnce(
      STYLE_ID,
      `
.rgb-cube-root{position:absolute;inset:0;overflow:hidden}
.rgb-cube-view{position:absolute;inset:0;overflow:hidden}
.rgb-cube-view canvas{display:block;width:100%;height:100%}
.rgb-panel{--fg:var(--text);--muted:var(--muted);--border:var(--stroke-2);--track:rgba(255,255,255,.10);color:var(--fg)}
.rgb-panel .hint{font-size:var(--fs-note);line-height:1.5;margin:0;color:var(--muted)}
.rgb-panel .mode{display:flex;align-items:center;justify-content:flex-start;gap:var(--space-12);margin:var(--space-12) 0 var(--space-16);flex-wrap:nowrap}
.rgb-panel .mode-label{font-size:var(--fs-note);opacity:.9;white-space:nowrap;flex:1 1 auto}
.rgb-panel .mode select{flex:0 0 auto;width:clamp(140px,52%,200px);min-width:120px;max-width:220px}
.rgb-panel select{appearance:none;-webkit-appearance:none;border-radius:var(--radius-12);padding-right:44px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M5 7.5l5 5 5-5' fill='none' stroke='%23FFFFFF' stroke-opacity='0.75' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;background-size:16px 16px}
.rgb-panel .row{margin:var(--space-12) 0}
.rgb-panel .row label{display:flex;justify-content:space-between;font-size:var(--fs-note);opacity:.92;margin-bottom:6px}
.rgb-panel input[type="range"]{width:100%;appearance:none;background:transparent;height:18px;--p:50%;--range-fill:rgba(255,255,255,.78)}
.rgb-panel input[type="range"]::-webkit-slider-runnable-track{height:10px;border-radius:999px;background:linear-gradient(to right,var(--range-fill) 0%,var(--range-fill) var(--p),var(--track) var(--p),var(--track) 100%);border:1px solid rgba(255,255,255,.16)}
.rgb-panel input[type="range"]::-webkit-slider-thumb{appearance:none;-webkit-appearance:none;margin-top:-6px;width:22px;height:22px;border-radius:999px;background:var(--range-fill);border:2px solid rgba(0,0,0,.35);box-shadow:0 0 0 1px rgba(255,255,255,.12)}
.rgb-panel input[type="range"]::-moz-range-track{height:10px;border-radius:999px;background:var(--track);border:1px solid rgba(255,255,255,.16)}
.rgb-panel input[type="range"]::-moz-range-progress{height:10px;border-radius:999px;background:var(--range-fill)}
.rgb-panel input[type="range"]::-moz-range-thumb{width:22px;height:22px;border-radius:999px;background:var(--range-fill);border:2px solid rgba(0,0,0,.35)}
.rgb-panel input[type="range"]::-moz-focus-outer{border:0}
.rgb-panel .colorbar{display:grid;grid-template-columns:1fr;gap:var(--space-8);border:0;border-radius:var(--radius-16);background:var(--glass);padding:var(--space-12);margin:var(--space-8) 0 var(--space-12)}
.rgb-panel .colorbar .divider{display:none}
.rgb-panel .rel{display:flex;align-items:center;gap:var(--space-8);min-width:0;flex:1 1 auto}
.rgb-panel .chips{display:flex;align-items:center;gap:var(--space-8);flex:0 0 auto}
.rgb-panel .colorseg{display:flex;align-items:center;gap:var(--space-8);min-width:0}
.rgb-panel .chip{width:12px;height:12px;border-radius:4px;border:1px solid rgba(255,255,255,.20);background:rgba(255,255,255,.18);flex:0 0 auto}
.rgb-panel .colorname{font-size:var(--fs-note);opacity:.9;white-space:nowrap}
.rgb-panel .colortext{font-size:var(--fs-note);opacity:.95;white-space:nowrap}
.rgb-panel .divider{width:1px;height:18px;background:rgba(255,255,255,.14)}
.rgb-panel .section-title{margin:calc(var(--space-16) + var(--space-8)) 0 var(--space-12);font-size:var(--fs-title);font-weight:750;letter-spacing:.2px}
.rgb-panel input[type="checkbox"]{appearance:none;-webkit-appearance:none;width:18px;height:18px;border-radius:6px;border:1px solid rgba(255,255,255,.18);background:var(--track);display:grid;place-items:center;flex:0 0 auto}
.rgb-panel input[type="checkbox"]:checked{background:var(--neutral-800);border-color:rgba(255,255,255,.18);background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18'%3E%3Cpath d='M4.2 9.4l2.4 2.6L13.8 5.8' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:center;background-size:11px 11px}
.rgb-panel input[type="checkbox"]:focus-visible{outline:2px solid rgba(255,255,255,.18);outline-offset:2px}
.rgb-panel .toggle{display:flex;align-items:center;gap:var(--space-8);font-size:var(--fs-note);opacity:.92;margin-top:var(--space-12)}
.rgb-panel .notes{margin-top:var(--space-16);padding-top:var(--space-12)}
.rgb-panel .small{font-size:var(--fs-note);opacity:.82;margin-top:var(--space-12);line-height:1.55;color:var(--muted)}
.rgb-panel .mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace}
.rgb-panel .kbd{font-family:ui-monospace,monospace;padding:0 6px;border:1px solid rgba(255,255,255,.18);border-radius:6px;background:rgba(255,255,255,.06)}
`
    );
  }

function rgbToHex(r, g, b) {
  const to2 = (n) => n.toString(16).padStart(2, "0");
  return `#${to2(r)}${to2(g)}${to2(b)}`.toUpperCase();
}

function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  const v = max;
  return { h, s: s * 100, v: v * 100 };
}

function hsvToRgb(h, s01, v01) {
  const hh = ((h % 360) + 360) % 360;
  const s = Math.max(0, Math.min(1, s01));
  const v = Math.max(0, Math.min(1, v01));
  const c = v * s;
  const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
  const m = v - c;

  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (hh < 60) [rp, gp, bp] = [c, x, 0];
  else if (hh < 120) [rp, gp, bp] = [x, c, 0];
  else if (hh < 180) [rp, gp, bp] = [0, c, x];
  else if (hh < 240) [rp, gp, bp] = [0, x, c];
  else if (hh < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];

  const r = Math.round((rp + m) * 255);
  const g = Math.round((gp + m) * 255);
  const b = Math.round((bp + m) * 255);
  return { r, g, b };
}

function hslToRgb(h, s01, l01) {
  const hh = ((h % 360) + 360) % 360;
  const s = Math.max(0, Math.min(1, s01));
  const l = Math.max(0, Math.min(1, l01));
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
  const m = l - c / 2;

  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (hh < 60) [rp, gp, bp] = [c, x, 0];
  else if (hh < 120) [rp, gp, bp] = [x, c, 0];
  else if (hh < 180) [rp, gp, bp] = [0, c, x];
  else if (hh < 240) [rp, gp, bp] = [0, x, c];
  else if (hh < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];

  const r = Math.round((rp + m) * 255);
  const g = Math.round((gp + m) * 255);
  const b = Math.round((bp + m) * 255);
  return { r, g, b };
}

function wrapHue(h) {
  return ((h % 360) + 360) % 360;
}

function harmonyLabel(type) {
  switch (type) {
    case "analogous":
      return "类似";
    case "adjacent":
      return "邻近";
    case "triadic":
      return "三角";
    case "split":
      return "分裂互补";
    case "warmcool":
      return "冷暖";
    case "complement":
    default:
      return "互补";
  }
}

function computeHarmonyRgb({ h, s, l }, type) {
  const s01 = Math.max(0, Math.min(1, s / 100));
  const l01 = Math.max(0, Math.min(1, l / 100));
  const baseH = wrapHue(h);

  const mk = (hh) => hslToRgb(wrapHue(hh), s01, l01);

  switch (type) {
    case "analogous":
      return [mk(baseH - 30), mk(baseH + 30)];
    case "adjacent":
      return [mk(baseH - 60), mk(baseH + 60)];
    case "triadic":
      return [mk(baseH + 120), mk(baseH + 240)];
    case "split":
      return [mk(baseH + 150), mk(baseH + 210)];
    case "warmcool":
      return [mk(baseH + 180)];
    case "complement":
    default:
      return [mk(baseH + 180)];
  }
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: s * 100, l: l * 100 };
}

function fmtHSV({ h, s, v }) {
  return `${h.toFixed(0)}°, ${s.toFixed(0)}%, ${v.toFixed(0)}%`;
}
function fmtHSL({ h, s, l }) {
  return `${h.toFixed(0)}°, ${s.toFixed(0)}%, ${l.toFixed(0)}%`;
}

function computeGlowOpacity(strength01) {
  return Math.max(0, strength01 - 1) * 0.18;
}

function disposeMaterial(material) {
  if (!material) return;
  if (Array.isArray(material)) {
    for (const m of material) disposeMaterial(m);
    return;
  }
  const maybeMaps = ["map", "alphaMap", "emissiveMap", "roughnessMap", "metalnessMap", "normalMap"];
  for (const k of maybeMaps) {
    const t = material[k];
    if (t && typeof t.dispose === "function") t.dispose();
  }
  if (typeof material.dispose === "function") material.dispose();
}

function disposeObject3D(obj) {
  obj?.traverse?.((child) => {
    if (child.geometry?.dispose) child.geometry.dispose();
    disposeMaterial(child.material);
  });
}

	  async function mount({ contentEl, panelEl, actionsEl, setPanelTitle }) {
	  ensureStyles();
	  await Kit.three.waitReady();
	  THREE = window.THREE;
	  OrbitControls = window.OrbitControls;
	  if (!THREE || !OrbitControls) throw new Error("[rgb-cube] THREE / OrbitControls not found on window. Did three-ready run?");
	  setPanelTitle("RGB 颜色模型");

  contentEl.innerHTML = `<div class="rgb-cube-root"><div class="rgb-cube-view" data-view></div></div>`;
  const view = contentEl.querySelector("[data-view]");

  panelEl.innerHTML = `
    <div class="rgb-panel">
      <div class="mode">
        <div class="mode-label">颜色模式</div>
        <select data-mode aria-label="选择颜色模式">
          <option value="rgb" selected>RGB</option>
          <option value="hsb">HSB</option>
          <option value="hsl">HSL</option>
        </select>
      </div>

      <div data-rgbGroup>
        <div class="row">
          <label><span>R</span><span class="mono" data-rVal>128</span></label>
          <input data-r type="range" min="0" max="255" value="128" />
        </div>
        <div class="row">
          <label><span>G</span><span class="mono" data-gVal>128</span></label>
          <input data-g type="range" min="0" max="255" value="128" />
        </div>
        <div class="row">
          <label><span>B</span><span class="mono" data-bVal>128</span></label>
          <input data-b type="range" min="0" max="255" value="128" />
        </div>
      </div>

      <div data-hsbGroup hidden>
        <div class="row">
          <label><span>H</span><span class="mono" data-hVal>0</span></label>
          <input data-h type="range" min="0" max="360" value="0" />
        </div>
        <div class="row">
          <label><span>S</span><span class="mono" data-sVal>0</span></label>
          <input data-s type="range" min="0" max="100" value="0" />
        </div>
        <div class="row">
          <label><span>B</span><span class="mono" data-brightVal>50</span></label>
          <input data-bright type="range" min="0" max="100" value="50" />
        </div>
      </div>

      <div data-hslGroup hidden>
        <div class="row">
          <label><span>H</span><span class="mono" data-h2Val>0</span></label>
          <input data-h2 type="range" min="0" max="360" value="0" />
        </div>
        <div class="row">
          <label><span>S</span><span class="mono" data-s2Val>0</span></label>
          <input data-s2 type="range" min="0" max="100" value="0" />
        </div>
        <div class="row">
          <label><span>L</span><span class="mono" data-l2Val>50</span></label>
          <input data-l2 type="range" min="0" max="100" value="50" />
        </div>
      </div>

      <div class="mode">
        <div class="mode-label">关系色</div>
        <select data-harmony aria-label="选择关系色">
          <option value="off">关闭</option>
          <option value="complement" selected>互补色</option>
          <option value="analogous">类似色</option>
          <option value="adjacent">邻近色</option>
          <option value="triadic">三角色</option>
          <option value="split">分裂互补色</option>
          <option value="warmcool">冷暖色</option>
        </select>
      </div>

      <div class="colorbar" aria-label="颜色信息">
        <div class="colorseg">
          <div class="chip" data-chipMain></div>
          <div class="colorname">当前</div>
          <div class="mono colortext" data-hexMain>#808080</div>
        </div>
        <div class="divider" aria-hidden="true"></div>
        <div class="rel">
          <div class="chips" aria-hidden="true">
            <div class="chip" data-chipRelA></div>
            <div class="chip" data-chipRelB hidden></div>
          </div>
          <div class="colorname" data-relLabel>互补</div>
          <div class="mono colortext" data-relHexA>#7F7F7F</div>
          <div class="mono colortext" data-relHexB hidden>#7F7F7F</div>
        </div>
      </div>

      <div class="section-title">模型</div>
      <div class="row">
        <label><span>颜色强度（不改变RGB含义）</span><span class="mono" data-strengthVal>100%</span></label>
        <input data-strength type="range" min="0" max="200" value="100" />
      </div>

      <div class="row">
        <label><span>立方体透明度</span><span class="mono" data-opVal>0.60</span></label>
        <input data-opacity type="range" min="0" max="100" value="60" />
      </div>
      <div class="toggle">
        <input data-showLabels type="checkbox" checked />
        <label style="margin:0; cursor:pointer;">显示顶点标签（黑/白/R/G/B/C/M/Y）</label>
      </div>
      <div class="toggle">
        <input data-showGray type="checkbox" checked />
        <label style="margin:0; cursor:pointer;">显示灰度线（R=G=B）</label>
      </div>
      <div class="toggle">
        <input data-grayFocus type="checkbox" />
        <label style="margin:0; cursor:pointer;">灰度线专注（弱化其他颜色）</label>
      </div>
      <div class="toggle">
        <input data-showContrastLinks type="checkbox" />
        <label style="margin:0; cursor:pointer;">显示撞色连线（R↔C，G↔M，B↔Y）</label>
      </div>
      <div class="toggle">
        <input data-showTriRGB type="checkbox" />
        <label style="margin:0; cursor:pointer;">显示 RGB 三角平面</label>
      </div>
      <div class="toggle">
        <input data-showTriCMY type="checkbox" />
        <label style="margin:0; cursor:pointer;">显示 CMY 三角平面</label>
      </div>

      <div class="notes">
        <div class="small">
          快捷：<span class="kbd">1</span> 纯红，<span class="kbd">2</span> 纯绿，<span class="kbd">3</span> 纯蓝，<span class="kbd">0</span> 灰(128)，<span class="kbd">R</span> 重置视角。
        </div>
      </div>
    </div>
  `;

  const ui = {
    mode: panelEl.querySelector("[data-mode]"),
    harmony: panelEl.querySelector("[data-harmony]"),
    rgbGroup: panelEl.querySelector("[data-rgbGroup]"),
    hsbGroup: panelEl.querySelector("[data-hsbGroup]"),
    hslGroup: panelEl.querySelector("[data-hslGroup]"),
    r: panelEl.querySelector("[data-r]"),
    g: panelEl.querySelector("[data-g]"),
    b: panelEl.querySelector("[data-b]"),
    rVal: panelEl.querySelector("[data-rVal]"),
    gVal: panelEl.querySelector("[data-gVal]"),
    bVal: panelEl.querySelector("[data-bVal]"),
    h: panelEl.querySelector("[data-h]"),
    s: panelEl.querySelector("[data-s]"),
    bright: panelEl.querySelector("[data-bright]"),
    hVal: panelEl.querySelector("[data-hVal]"),
    sVal: panelEl.querySelector("[data-sVal]"),
    brightVal: panelEl.querySelector("[data-brightVal]"),
    h2: panelEl.querySelector("[data-h2]"),
    s2: panelEl.querySelector("[data-s2]"),
    l2: panelEl.querySelector("[data-l2]"),
    h2Val: panelEl.querySelector("[data-h2Val]"),
    s2Val: panelEl.querySelector("[data-s2Val]"),
    l2Val: panelEl.querySelector("[data-l2Val]"),

    strength: panelEl.querySelector("[data-strength]"),
    strengthVal: panelEl.querySelector("[data-strengthVal]"),
    opacity: panelEl.querySelector("[data-opacity]"),
    opVal: panelEl.querySelector("[data-opVal]"),
    showLabels: panelEl.querySelector("[data-showLabels]"),
    showGray: panelEl.querySelector("[data-showGray]"),
    grayFocus: panelEl.querySelector("[data-grayFocus]"),
    showContrastLinks: panelEl.querySelector("[data-showContrastLinks]"),
    showTriRGB: panelEl.querySelector("[data-showTriRGB]"),
    showTriCMY: panelEl.querySelector("[data-showTriCMY]"),

    chipMain: panelEl.querySelector("[data-chipMain]"),
    hexMain: panelEl.querySelector("[data-hexMain]"),
    relLabel: panelEl.querySelector("[data-relLabel]"),
    chipRelA: panelEl.querySelector("[data-chipRelA]"),
    chipRelB: panelEl.querySelector("[data-chipRelB]"),
    relHexA: panelEl.querySelector("[data-relHexA]"),
    relHexB: panelEl.querySelector("[data-relHexB]"),
  };

  // ---------- Scene ----------
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    const detail = e?.message ? `（${e.message}）` : "";
    throw new Error(
      `无法创建 WebGL 上下文${detail}。这通常是因为浏览器/系统禁用了硬件加速或 WebGL。请在浏览器设置中开启硬件加速，并在浏览器的 GPU/WebGL 状态页确认 WebGL 可用。`
    );
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  view.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0c10);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.01, 100);
  camera.position.set(1.8, 1.35, 2.1);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.target.set(0, 0, 0);
  controls.update();
  controls.saveState();

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dir = new THREE.DirectionalLight(0xffffff, 0.6);
  dir.position.set(3, 4, 2);
  scene.add(dir);

  const cubeSize = 1.0;
  const boxGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

  const posAttr = boxGeo.attributes.position;
  const colors = new Float32Array(posAttr.count * 3);
  const tmpColor = new THREE.Color();
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i) / cubeSize + 0.5;
    const y = posAttr.getY(i) / cubeSize + 0.5;
    const z = posAttr.getZ(i) / cubeSize + 0.5;
    tmpColor.setRGB(x, y, z, THREE.SRGBColorSpace);
    colors[i * 3 + 0] = tmpColor.r;
    colors[i * 3 + 1] = tmpColor.g;
    colors[i * 3 + 2] = tmpColor.b;
  }
  boxGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const cubeMat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
    blending: THREE.NormalBlending,
    side: THREE.DoubleSide,
  });
  const cubeMesh = new THREE.Mesh(boxGeo, cubeMat);
  scene.add(cubeMesh);

  const cubeGlowMat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const cubeGlowMesh = new THREE.Mesh(boxGeo, cubeGlowMat);
  scene.add(cubeGlowMesh);

  // ---------- Volume point cloud ----------
  function createPointSpriteTexture() {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0.0, "rgba(255,255,255,1.0)");
    g.addColorStop(0.25, "rgba(255,255,255,0.9)");
    g.addColorStop(0.55, "rgba(255,255,255,0.35)");
    g.addColorStop(1.0, "rgba(255,255,255,0.0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.needsUpdate = true;
    return t;
  }

  const pointSprite = createPointSpriteTexture();

  function buildVolumePoints(stepsPerAxis = 13) {
    const steps = Math.max(3, Math.floor(stepsPerAxis));
    const total = steps * steps * steps;
    const positions = new Float32Array(total * 3);
    const colors3 = new Float32Array(total * 3);
    let idx = 0;
    const c = new THREE.Color();
    for (let zi = 0; zi < steps; zi++) {
      const z01 = zi / (steps - 1);
      for (let yi = 0; yi < steps; yi++) {
        const y01 = yi / (steps - 1);
        for (let xi = 0; xi < steps; xi++) {
          const x01 = xi / (steps - 1);
          positions[idx * 3 + 0] = x01 - 0.5;
          positions[idx * 3 + 1] = y01 - 0.5;
          positions[idx * 3 + 2] = z01 - 0.5;
          c.setRGB(x01, y01, z01, THREE.SRGBColorSpace);
          colors3[idx * 3 + 0] = c.r;
          colors3[idx * 3 + 1] = c.g;
          colors3[idx * 3 + 2] = c.b;
          idx++;
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors3, 3));
    const sizePx = 6 * (13 / steps);
    const m = new THREE.PointsMaterial({
      size: sizePx,
      map: pointSprite,
      alphaTest: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const pts = new THREE.Points(g, m);
    pts.frustumCulled = false;
    return pts;
  }

  const volumePoints = buildVolumePoints(13);
  volumePoints.visible = false;
  scene.add(volumePoints);

  // Edges
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(boxGeo),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 })
  );
  scene.add(edges);

  // Axis helper (subtle)
  const axes = new THREE.AxesHelper(1.2);
  axes.material.transparent = true;
  axes.material.opacity = 0.35;
  scene.add(axes);

  // ---------- RGB / CMY triangle planes ----------
  function rgbPos01(r01, g01, b01) {
    return new THREE.Vector3(r01 - 0.5, g01 - 0.5, b01 - 0.5);
  }

  function createTriangle({ a, b, c }) {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array([a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z]);
    const colorsTri = new Float32Array(9);
    const pts = [a, b, c];
    for (let i = 0; i < 3; i++) {
      const r01 = pts[i].x + 0.5;
      const g01 = pts[i].y + 0.5;
      const b01 = pts[i].z + 0.5;
      tmpColor.setRGB(r01, g01, b01, THREE.SRGBColorSpace);
      colorsTri[i * 3 + 0] = tmpColor.r;
      colorsTri[i * 3 + 1] = tmpColor.g;
      colorsTri[i * 3 + 2] = tmpColor.b;
    }
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(colorsTri, 3));
    geom.computeVertexNormals();

    const mesh = new THREE.Mesh(
      geom,
      new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.NormalBlending,
      })
    );

    const outline = new THREE.LineLoop(
      geom,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.28, depthWrite: false })
    );

    return { mesh, outline };
  }

  const trianglesGroup = new THREE.Group();
  const triRGB = createTriangle({ a: rgbPos01(1, 0, 0), b: rgbPos01(0, 1, 0), c: rgbPos01(0, 0, 1) });
  const triCMY = createTriangle({ a: rgbPos01(0, 1, 1), b: rgbPos01(1, 0, 1), c: rgbPos01(1, 1, 0) });
  trianglesGroup.add(triRGB.mesh, triRGB.outline, triCMY.mesh, triCMY.outline);
  scene.add(trianglesGroup);

  // ---------- Vertex labels ----------
  function createLabelTexture({ text, fg = "#FFFFFF", bg = "rgba(0,0,0,0.55)" }) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 4);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const fontSize = 18;
    const padX = Math.round(fontSize * 0.6);
    const padY = Math.round(fontSize * 0.45);
    const font = `600 ${fontSize}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Noto Sans CJK SC, Arial`;
    ctx.font = font;
    const metrics = ctx.measureText(text);
    const w = Math.ceil(metrics.width + padX * 2);
    const h = Math.ceil(fontSize * 1.9 + padY * 2);
    canvas.width = Math.ceil(w * dpr);
    canvas.height = Math.ceil(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = font;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    const r = Math.round(fontSize * 0.55);
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.arcTo(w, 0, w, h, r);
    ctx.arcTo(w, h, 0, h, r);
    ctx.arcTo(0, h, 0, 0, r);
    ctx.arcTo(0, 0, w, 0, r);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.lineWidth = 1.6;
    ctx.stroke();

    ctx.fillStyle = fg;
    ctx.textBaseline = "middle";
    ctx.fillText(text, padX, h / 2);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    tex.premultiplyAlpha = true;
    tex.needsUpdate = true;
    return { tex, w, h };
  }

  function createLabelSprite({ text, pos, fg, bg }) {
    const { tex, w, h } = createLabelTexture({ text, fg, bg });
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity: 0.95,
        premultipliedAlpha: true,
        depthTest: false,
        depthWrite: false,
      })
    );
    sprite.renderOrder = 999;
    sprite.position.copy(pos);
    const heightWorld = 0.085;
    const aspect = w / h;
    sprite.scale.set(heightWorld * aspect, heightWorld, 1);
    return sprite;
  }

  const labelsGroup = new THREE.Group();
  const labelOffset = 0.07;
  const vertices = [
    { text: "黑 K (0,0,0)", rgb: [0, 0, 0], pos: rgbPos01(0, 0, 0), dir: new THREE.Vector3(-1, -1, -1) },
    { text: "白 W (255,255,255)", rgb: [255, 255, 255], pos: rgbPos01(1, 1, 1), dir: new THREE.Vector3(1, 1, 1) },
    { text: "红 R (255,0,0)", rgb: [255, 0, 0], pos: rgbPos01(1, 0, 0), dir: new THREE.Vector3(1, -1, -1) },
    { text: "绿 G (0,255,0)", rgb: [0, 255, 0], pos: rgbPos01(0, 1, 0), dir: new THREE.Vector3(-1, 1, -1) },
    { text: "蓝 B (0,0,255)", rgb: [0, 0, 255], pos: rgbPos01(0, 0, 1), dir: new THREE.Vector3(-1, -1, 1) },
    { text: "青 C (0,255,255)", rgb: [0, 255, 255], pos: rgbPos01(0, 1, 1), dir: new THREE.Vector3(-1, 1, 1) },
    { text: "品红 M (255,0,255)", rgb: [255, 0, 255], pos: rgbPos01(1, 0, 1), dir: new THREE.Vector3(1, -1, 1) },
    { text: "黄 Y (255,255,0)", rgb: [255, 255, 0], pos: rgbPos01(1, 1, 0), dir: new THREE.Vector3(1, 1, -1) },
  ];

  for (const v of vertices) {
    const fg = "#FFFFFF";
    const bg = `rgba(${v.rgb[0]},${v.rgb[1]},${v.rgb[2]},0.22)`;
    const p = v.pos.clone().add(v.dir.clone().normalize().multiplyScalar(labelOffset));
    labelsGroup.add(createLabelSprite({ text: v.text, pos: p, fg, bg }));
  }
  scene.add(labelsGroup);

  // ---------- Contrast links ----------
  function srgbToLinearColor(r01, g01, b01) {
    const c = new THREE.Color();
    c.setRGB(r01, g01, b01, THREE.SRGBColorSpace);
    return c;
  }

  function createGradientLink({ a, b, colorA, colorB, radius = 0.012, segments = 28 }) {
    const dir = b.clone().sub(a);
    const len = dir.length();
    const geom = new THREE.CylinderGeometry(radius, radius, len, 18, segments, true);

    const pos = geom.attributes.position;
    const colorsAttr = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const t = y / len + 0.5;
      tmpColor.copy(colorA).lerp(colorB, t);
      colorsAttr[i * 3 + 0] = tmpColor.r;
      colorsAttr[i * 3 + 1] = tmpColor.g;
      colorsAttr[i * 3 + 2] = tmpColor.b;
    }
    geom.setAttribute("color", new THREE.BufferAttribute(colorsAttr, 3));

    const mat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.renderOrder = 50;

    const mid = a.clone().add(b).multiplyScalar(0.5);
    mesh.position.copy(mid);

    const up = new THREE.Vector3(0, 1, 0);
    const q = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());
    mesh.setRotationFromQuaternion(q);
    return mesh;
  }

  const contrastLinksGroup = new THREE.Group();
  const vR = rgbPos01(1, 0, 0);
  const vG = rgbPos01(0, 1, 0);
  const vB = rgbPos01(0, 0, 1);
  const vC = rgbPos01(0, 1, 1);
  const vM = rgbPos01(1, 0, 1);
  const vY = rgbPos01(1, 1, 0);
  contrastLinksGroup.add(
    createGradientLink({ a: vR, b: vC, colorA: srgbToLinearColor(1, 0, 0), colorB: srgbToLinearColor(0, 1, 1) }),
    createGradientLink({ a: vG, b: vM, colorA: srgbToLinearColor(0, 1, 0), colorB: srgbToLinearColor(1, 0, 1) }),
    createGradientLink({ a: vB, b: vY, colorA: srgbToLinearColor(0, 0, 1), colorB: srgbToLinearColor(1, 1, 0) })
  );
  contrastLinksGroup.visible = false;
  scene.add(contrastLinksGroup);

  // ---------- Grayscale diagonal line (R=G=B) ----------
  const grayGroup = new THREE.Group();
  const grayLineGeom = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-0.5, -0.5, -0.5),
    new THREE.Vector3(0.5, 0.5, 0.5),
  ]);
  const grayLineColors = new Float32Array(2 * 3);
  tmpColor.setRGB(0, 0, 0, THREE.SRGBColorSpace);
  grayLineColors[0] = tmpColor.r;
  grayLineColors[1] = tmpColor.g;
  grayLineColors[2] = tmpColor.b;
  tmpColor.setRGB(1, 1, 1, THREE.SRGBColorSpace);
  grayLineColors[3] = tmpColor.r;
  grayLineColors[4] = tmpColor.g;
  grayLineColors[5] = tmpColor.b;
  grayLineGeom.setAttribute("color", new THREE.BufferAttribute(grayLineColors, 3));
  const grayLine = new THREE.Line(
    grayLineGeom,
    new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9, depthTest: false })
  );
  grayGroup.add(grayLine);

  const grayCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.5, -0.5, -0.5),
    new THREE.Vector3(0.5, 0.5, 0.5),
  ]);
  const grayTubeGeom = new THREE.TubeGeometry(grayCurve, 48, 0.012, 20, false);
  const gpos = grayTubeGeom.attributes.position;
  const gcols = new Float32Array(gpos.count * 3);
  const diagDir = new THREE.Vector3(1, 1, 1).normalize();
  const minDot = new THREE.Vector3(-0.5, -0.5, -0.5).dot(diagDir);
  const maxDot = new THREE.Vector3(0.5, 0.5, 0.5).dot(diagDir);
  const inv = 1 / (maxDot - minDot);
  for (let i = 0; i < gpos.count; i++) {
    const v = new THREE.Vector3(gpos.getX(i), gpos.getY(i), gpos.getZ(i));
    const t = Math.min(1, Math.max(0, (v.dot(diagDir) - minDot) * inv));
    tmpColor.setRGB(t, t, t, THREE.SRGBColorSpace);
    gcols[i * 3 + 0] = tmpColor.r;
    gcols[i * 3 + 1] = tmpColor.g;
    gcols[i * 3 + 2] = tmpColor.b;
  }
  grayTubeGeom.setAttribute("color", new THREE.BufferAttribute(gcols, 3));
  const grayTube = new THREE.Mesh(
    grayTubeGeom,
    new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthTest: false,
      depthWrite: false,
      blending: THREE.NormalBlending,
    })
  );
  grayGroup.add(grayTube);

  const ticksGroup = new THREE.Group();
  const tickMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 });
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    const p = new THREE.Vector3(-0.5 + t, -0.5 + t, -0.5 + t);
    const tick = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(p.x - 0.03, p.y + 0.02, p.z),
      new THREE.Vector3(p.x + 0.03, p.y - 0.02, p.z),
    ]);
    ticksGroup.add(new THREE.Line(tick, tickMat));
  }
  grayGroup.add(ticksGroup);

  const grayProjMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.95,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const grayProjPoint = new THREE.Mesh(new THREE.SphereGeometry(0.022, 20, 16), grayProjMat);
  grayProjPoint.visible = false;
  grayGroup.add(grayProjPoint);

  const toGrayLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25, depthTest: false })
  );
  toGrayLine.visible = false;
  grayGroup.add(toGrayLine);

  scene.add(grayGroup);

  // ---------- Current color point ----------
  const pointGeo = new THREE.SphereGeometry(0.045, 24, 18);
  const pointMat = new THREE.MeshStandardMaterial({
    color: 0x808080,
    emissive: 0x808080,
    emissiveIntensity: 0.55,
    roughness: 0.35,
    metalness: 0.0,
  });
  const colorPoint = new THREE.Mesh(pointGeo, pointMat);
  scene.add(colorPoint);

  // ---------- Harmony points ----------
  const relMatA = new THREE.MeshStandardMaterial({
    color: 0x7f7f7f,
    emissive: 0x7f7f7f,
    emissiveIntensity: 0.55,
    roughness: 0.35,
    metalness: 0.0,
    transparent: true,
    opacity: 0.9,
  });
  const relPointA = new THREE.Mesh(pointGeo, relMatA);
  scene.add(relPointA);

  const relMatB = relMatA.clone();
  const relPointB = new THREE.Mesh(pointGeo, relMatB);
  scene.add(relPointB);

  const relLineA = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22 })
  );
  scene.add(relLineA);

  const relLineB = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22 })
  );
  scene.add(relLineB);

  function rgbToPos(r, g, b) {
    return new THREE.Vector3(r / 255 - 0.5, g / 255 - 0.5, b / 255 - 0.5);
  }

  function applyFocusMode({ enabled, cubeOpacity, cubeGlowOpacity, volumeOpacity }) {
    const weak = enabled ? 0.08 : 1.0;
    const weakEdges = enabled ? 0.12 : 1.0;

    cubeMat.opacity = cubeOpacity * weak;
    cubeGlowMat.opacity = cubeGlowOpacity * (enabled ? 0.05 : 1.0);
    edges.material.opacity = 0.35 * weakEdges;
    axes.material.opacity = 0.35 * weakEdges;

    volumePoints.material.opacity = volumeOpacity * (enabled ? 0.06 : 1.0);

    const showRel = ui.harmony.value !== "off";
    const vis = !enabled && showRel;
    relPointA.visible = vis && relCount > 0;
    relLineA.visible = vis && relCount > 0;
    relPointB.visible = vis && relCount > 1;
    relLineB.visible = vis && relCount > 1;

    const weakOther = enabled ? 0.18 : 1.0;
    triRGB.mesh.material.opacity = 0.22 * weakOther;
    triCMY.mesh.material.opacity = 0.22 * weakOther;
    triRGB.outline.material.opacity = 0.28 * weakOther;
    triCMY.outline.material.opacity = 0.28 * weakOther;
    for (const s of labelsGroup.children) {
      s.material.opacity = 0.95 * weakOther;
    }
    for (const m of contrastLinksGroup.children) {
      m.material.opacity = enabled ? 0.18 : 1.0;
    }

    grayLine.material.opacity = enabled ? 1.0 : 0.9;
    grayTube.material.opacity = enabled ? 1.0 : 0.95;
    tickMat.opacity = enabled ? 0.55 : 0.25;

    grayProjPoint.visible = enabled;
    toGrayLine.visible = enabled;
  }

  const state = { r: 128, g: 128, b: 128 };
  let relCount = 1;

  function clampByte(n) {
    return Math.max(0, Math.min(255, Math.round(Number(n) || 0)));
  }

  function setColorRgb(r, g, b) {
    state.r = clampByte(r);
    state.g = clampByte(g);
    state.b = clampByte(b);
  }

  function setRangeVisual(rangeEl, fillColor) {
    if (!rangeEl) return;
    const min = Number(rangeEl.min || 0);
    const max = Number(rangeEl.max || 100);
    const val = Number(rangeEl.value || 0);
    const pct = max === min ? 0 : ((val - min) / (max - min)) * 100;
    rangeEl.style.setProperty("--p", `${Math.max(0, Math.min(100, pct)).toFixed(2)}%`);
    if (fillColor) rangeEl.style.setProperty("--range-fill", fillColor);
  }

  function render() {
    const UI_FILL = "rgba(255,255,255,.78)";
    const mode = ui.mode.value;
    ui.rgbGroup.hidden = mode !== "rgb";
    ui.hsbGroup.hidden = mode !== "hsb";
    ui.hslGroup.hidden = mode !== "hsl";
    setPanelTitle(mode === "hsb" ? "HSB 颜色模型" : mode === "hsl" ? "HSL 颜色模型" : "RGB 颜色模型");

    const r = state.r;
    const g = state.g;
    const b = state.b;

    ui.r.value = String(r);
    ui.g.value = String(g);
    ui.b.value = String(b);
    ui.rVal.textContent = String(r);
    ui.gVal.textContent = String(g);
    ui.bVal.textContent = String(b);

    const hsv = rgbToHsv(r, g, b);
    const h = Math.round(hsv.h);
    const s = Math.round(hsv.s);
    const v = Math.round(hsv.v);
    ui.h.value = String(h);
    ui.s.value = String(s);
    ui.bright.value = String(v);
    ui.hVal.textContent = String(h);
    ui.sVal.textContent = String(s);
    ui.brightVal.textContent = String(v);

    const hsl = rgbToHsl(r, g, b);
    const h2 = Math.round(hsl.h);
    const s2 = Math.round(hsl.s);
    const l2 = Math.round(hsl.l);
    ui.h2.value = String(h2);
    ui.s2.value = String(s2);
    ui.l2.value = String(l2);
    ui.h2Val.textContent = String(h2);
    ui.s2Val.textContent = String(s2);
    ui.l2Val.textContent = String(l2);

    setRangeVisual(ui.r, "#ff4d4f");
    setRangeVisual(ui.g, "#22c55e");
    setRangeVisual(ui.b, "#3b82f6");
    setRangeVisual(ui.h, UI_FILL);
    setRangeVisual(ui.s, UI_FILL);
    setRangeVisual(ui.bright, UI_FILL);
    setRangeVisual(ui.h2, UI_FILL);
    setRangeVisual(ui.s2, UI_FILL);
    setRangeVisual(ui.l2, UI_FILL);
    setRangeVisual(ui.strength, UI_FILL);
    setRangeVisual(ui.opacity, UI_FILL);

    const strength = Number(ui.strength.value);
    ui.strengthVal.textContent = `${strength}%`;
    const strength01 = strength / 100;
    const cubeGlowOpacity = computeGlowOpacity(strength01);
    cubeGlowMat.opacity = cubeGlowOpacity;
    pointMat.emissiveIntensity = 0.55 * Math.min(2, strength01);
    relMatA.emissiveIntensity = 0.55 * Math.min(2, strength01);
    relMatB.emissiveIntensity = 0.55 * Math.min(2, strength01);

    const hex = rgbToHex(r, g, b);
    ui.hexMain.textContent = hex;
    ui.chipMain.style.background = hex;

    colorPoint.position.copy(rgbToPos(r, g, b));
    pointMat.color.setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
    pointMat.emissive.setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);

    const harmony = ui.harmony.value;
    const showRel = harmony !== "off";

    if (!showRel) {
      relCount = 0;
      ui.relLabel.textContent = "关闭";
      ui.chipRelA.style.background = "rgba(255,255,255,.18)";
      ui.chipRelB.hidden = true;
      ui.relHexA.textContent = "—";
      ui.relHexB.hidden = true;
      relPointA.visible = false;
      relLineA.visible = false;
      relPointB.visible = false;
      relLineB.visible = false;
    } else {
      ui.relLabel.textContent = harmonyLabel(harmony);
      const relColors = computeHarmonyRgb(hsl, harmony);
      relCount = relColors.length;

      const relA = relColors[0];
      if (relA) {
        const relHexA = rgbToHex(relA.r, relA.g, relA.b);
        ui.relHexA.textContent = relHexA;
        ui.chipRelA.style.background = relHexA;
        relPointA.position.copy(rgbToPos(relA.r, relA.g, relA.b));
        relMatA.color.setRGB(relA.r / 255, relA.g / 255, relA.b / 255, THREE.SRGBColorSpace);
        relMatA.emissive.setRGB(relA.r / 255, relA.g / 255, relA.b / 255, THREE.SRGBColorSpace);
        relLineA.geometry.setFromPoints([colorPoint.position, relPointA.position]);
      }

      const relB = relColors[1];
      if (relB) {
        const relHexB = rgbToHex(relB.r, relB.g, relB.b);
        ui.relHexB.hidden = false;
        ui.chipRelB.hidden = false;
        ui.relHexB.textContent = relHexB;
        ui.chipRelB.style.background = relHexB;
        relPointB.position.copy(rgbToPos(relB.r, relB.g, relB.b));
        relMatB.color.setRGB(relB.r / 255, relB.g / 255, relB.b / 255, THREE.SRGBColorSpace);
        relMatB.emissive.setRGB(relB.r / 255, relB.g / 255, relB.b / 255, THREE.SRGBColorSpace);
        relLineB.geometry.setFromPoints([colorPoint.position, relPointB.position]);
      } else {
        ui.relHexB.hidden = true;
        ui.chipRelB.hidden = true;
      }

      relPointA.visible = relCount > 0;
      relLineA.visible = relCount > 0;
      relPointB.visible = relCount > 1;
      relLineB.visible = relCount > 1;
    }

    const op = Number(ui.opacity.value) / 100;
    ui.opVal.textContent = op.toFixed(2);

    const volOp = 0;
    volumePoints.visible = false;
    volumePoints.material.opacity = 0;

    labelsGroup.visible = ui.showLabels.checked;
    contrastLinksGroup.visible = ui.showContrastLinks.checked;

    const showRGBTri = ui.showTriRGB.checked;
    const showCMYTri = ui.showTriCMY.checked;
    triRGB.mesh.visible = showRGBTri;
    triRGB.outline.visible = showRGBTri;
    triCMY.mesh.visible = showCMYTri;
    triCMY.outline.visible = showCMYTri;
    trianglesGroup.visible = showRGBTri || showCMYTri;

    const focus = ui.grayFocus.checked;
    let showGray = ui.showGray.checked;
    if (focus && !showGray) {
      ui.showGray.checked = true;
      showGray = true;
    }
    grayGroup.visible = showGray;
    applyFocusMode({ enabled: focus, cubeOpacity: op, cubeGlowOpacity, volumeOpacity: volOp });

    if (showGray && focus) {
      const t = (r / 255 + g / 255 + b / 255) / 3;
      const proj = new THREE.Vector3(-0.5 + t, -0.5 + t, -0.5 + t);
      grayProjPoint.position.copy(proj);
      toGrayLine.geometry.setFromPoints([colorPoint.position, proj]);
    }
  }

  function syncFromRgbInputs() {
    setColorRgb(ui.r.value, ui.g.value, ui.b.value);
    render();
  }

  function syncFromHsbInputs() {
    const h = Number(ui.h.value);
    const s = Number(ui.s.value) / 100;
    const v = Number(ui.bright.value) / 100;
    const rgb = hsvToRgb(h, s, v);
    setColorRgb(rgb.r, rgb.g, rgb.b);
    render();
  }

  function syncFromHslInputs() {
    const h = Number(ui.h2.value);
    const s = Number(ui.s2.value) / 100;
    const l = Number(ui.l2.value) / 100;
    const rgb = hslToRgb(h, s, l);
    setColorRgb(rgb.r, rgb.g, rgb.b);
    render();
  }

  const onInput = (e) => {
    if (e?.target === ui.r || e?.target === ui.g || e?.target === ui.b) return syncFromRgbInputs();
    if (e?.target === ui.h || e?.target === ui.s || e?.target === ui.bright) return syncFromHsbInputs();
    if (e?.target === ui.h2 || e?.target === ui.s2 || e?.target === ui.l2) return syncFromHslInputs();
    render();
  };

  const onChange = () => render();

  ui.mode.addEventListener("change", onChange);
  ui.harmony.addEventListener("change", onChange);
  ui.r.addEventListener("input", onInput);
  ui.g.addEventListener("input", onInput);
  ui.b.addEventListener("input", onInput);
  ui.h.addEventListener("input", onInput);
  ui.s.addEventListener("input", onInput);
  ui.bright.addEventListener("input", onInput);
  ui.h2.addEventListener("input", onInput);
  ui.s2.addEventListener("input", onInput);
  ui.l2.addEventListener("input", onInput);
  ui.strength.addEventListener("input", onInput);
  ui.opacity.addEventListener("input", onInput);
  ui.showLabels.addEventListener("change", onChange);
  ui.showGray.addEventListener("change", onChange);
  ui.grayFocus.addEventListener("change", onChange);
  ui.showContrastLinks.addEventListener("change", onChange);
  ui.showTriRGB.addEventListener("change", onChange);
  ui.showTriCMY.addEventListener("change", onChange);

  // Topic actions: reset view
  const resetBtn = document.createElement("button");
  resetBtn.className = "icon-btn";
  resetBtn.type = "button";
  resetBtn.title = "重置视角";
  resetBtn.setAttribute("aria-label", "重置视角");
  resetBtn.textContent = "⟲";
  actionsEl.appendChild(resetBtn);

  const onReset = () => controls.reset();
  resetBtn.addEventListener("click", onReset);

  const onKeydown = (e) => {
    if (e.key === "1") {
      setColorRgb(255, 0, 0);
      render();
    }
    if (e.key === "2") {
      setColorRgb(0, 255, 0);
      render();
    }
    if (e.key === "3") {
      setColorRgb(0, 0, 255);
      render();
    }
    if (e.key === "0") {
      setColorRgb(128, 128, 128);
      render();
    }
    if (e.key.toLowerCase() === "r") controls.reset();
  };
  window.addEventListener("keydown", onKeydown);

  function resize() {
    const w = view.clientWidth;
    const h = view.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(view);

  let rafId = 0;
  function animate() {
    controls.update();
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  }

  resize();
  render();
  animate();

  return () => {
    resetBtn.removeEventListener("click", onReset);
    actionsEl.replaceChildren();

    window.removeEventListener("keydown", onKeydown);
    ui.mode.removeEventListener("change", onChange);
    ui.harmony.removeEventListener("change", onChange);
    ui.r.removeEventListener("input", onInput);
    ui.g.removeEventListener("input", onInput);
    ui.b.removeEventListener("input", onInput);
    ui.h.removeEventListener("input", onInput);
    ui.s.removeEventListener("input", onInput);
    ui.bright.removeEventListener("input", onInput);
    ui.h2.removeEventListener("input", onInput);
    ui.s2.removeEventListener("input", onInput);
    ui.l2.removeEventListener("input", onInput);
    ui.strength.removeEventListener("input", onInput);
    ui.opacity.removeEventListener("input", onInput);
    ui.showLabels.removeEventListener("change", onChange);
    ui.showGray.removeEventListener("change", onChange);
    ui.grayFocus.removeEventListener("change", onChange);
    ui.showContrastLinks.removeEventListener("change", onChange);
    ui.showTriRGB.removeEventListener("change", onChange);
    ui.showTriCMY.removeEventListener("change", onChange);

    ro.disconnect();
    cancelAnimationFrame(rafId);
    controls.dispose();

    disposeObject3D(scene);
    renderer.dispose();
    view.replaceChildren();
    panelEl.replaceChildren();
  };
}

  window.DesignBook?.registerModule?.("color-models/rgb-cube", { mount });
})();
