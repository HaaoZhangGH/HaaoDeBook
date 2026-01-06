(() => {
  const THREE = window.THREE;
  const OrbitControls = window.OrbitControls;
  if (!THREE || !OrbitControls) {
    console.error("[rgb-cube] THREE / OrbitControls not found on window. Did three-ready run?");
    return;
  }

const STYLE_ID = "topic-rgb-cube-styles";

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
.rgb-cube-root{position:absolute;inset:0;overflow:hidden}
.rgb-cube-view{position:absolute;inset:0;overflow:hidden}
.rgb-cube-view canvas{display:block;width:100%;height:100%}
.rgb-panel .hint{font-size:12px;opacity:.82;line-height:1.45;margin:0 0 12px}
.rgb-panel .row{margin:12px 0}
.rgb-panel .row label{display:flex;justify-content:space-between;font-size:12px;opacity:.92;margin-bottom:6px}
.rgb-panel input[type="range"]{width:100%}
.rgb-panel .swatches{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}
.rgb-panel .swatch{border:1px solid rgba(255,255,255,.12);border-radius:12px;overflow:hidden;background:rgba(255,255,255,.04)}
.rgb-panel .swatch .box{height:56px}
.rgb-panel .swatch .meta{padding:8px 10px;font-size:12px;line-height:1.35}
.rgb-panel .toggle{display:flex;align-items:center;gap:10px;font-size:12px;opacity:.92;margin-top:10px}
.rgb-panel .small{font-size:12px;opacity:.85;margin-top:12px;line-height:1.45}
.rgb-panel .mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace}
.rgb-panel .kbd{font-family:ui-monospace,monospace;padding:0 6px;border:1px solid rgba(255,255,255,.18);border-radius:6px;background:rgba(255,255,255,.06)}
`;
  document.head.appendChild(style);
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
  setPanelTitle("RGB 颜色模型");

  contentEl.innerHTML = `<div class="rgb-cube-root"><div class="rgb-cube-view" data-view></div></div>`;
  const view = contentEl.querySelector("[data-view]");

  panelEl.innerHTML = `
    <div class="rgb-panel">
      <div class="hint">
        鼠标拖拽旋转，滚轮缩放。立方体八个顶点对应：黑/白/红/绿/蓝/黄/青/品红。<br/>
        灰度线：<span class="mono">R=G=B</span>（从黑到白的对角线）。
      </div>

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

      <div class="row">
        <label><span>颜色强度（不改变RGB含义）</span><span class="mono" data-strengthVal>100%</span></label>
        <input data-strength type="range" min="0" max="200" value="100" />
      </div>

      <div class="row">
        <label><span>立方体透明度</span><span class="mono" data-opVal>0.18</span></label>
        <input data-opacity type="range" min="0" max="100" value="18" />
      </div>

      <div class="toggle">
        <input data-showVolume type="checkbox" />
        <label style="margin:0; cursor:pointer;">显示体积点云（更接近“RGB空间”）</label>
      </div>
      <div class="row">
        <label><span>体积点云强度</span><span class="mono" data-volVal>0.35</span></label>
        <input data-volumeOpacity type="range" min="0" max="100" value="35" />
      </div>
      <div class="row">
        <label><span>体积点大小</span><span class="mono" data-volSizeVal>6</span></label>
        <input data-volumeSize type="range" min="1" max="18" value="6" />
      </div>

      <div class="toggle">
        <input data-showComplement type="checkbox" checked />
        <label style="margin:0; cursor:pointer;">显示补色点（255-R,255-G,255-B）</label>
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
        <input data-showTriRGB type="checkbox" checked />
        <label style="margin:0; cursor:pointer;">显示 RGB 三角平面</label>
      </div>
      <div class="toggle">
        <input data-showTriCMY type="checkbox" checked />
        <label style="margin:0; cursor:pointer;">显示 CMY 三角平面</label>
      </div>

      <div class="swatches">
        <div class="swatch">
          <div class="box" data-swatchMain></div>
          <div class="meta">
            <div>当前：<span class="mono" data-hexMain>#808080</span></div>
            <div>HSV：<span class="mono" data-hsvMain>—</span></div>
            <div>HSL：<span class="mono" data-hslMain>—</span></div>
          </div>
        </div>

        <div class="swatch">
          <div class="box" data-swatchComp></div>
          <div class="meta">
            <div>补色：<span class="mono" data-hexComp>#7F7F7F</span></div>
            <div>说明：RGB取反</div>
            <div class="mono">C=(255-R,255-G,255-B)</div>
          </div>
        </div>
      </div>

      <div class="small">
        观察要点：当你让 <span class="mono">R=G=B</span> 时，颜色点会落在灰度线；偏离灰度线越远，通常“彩度感”越强。<br/>
        快捷：按 <span class="kbd">1</span> 设为纯红，<span class="kbd">2</span> 纯绿，<span class="kbd">3</span> 纯蓝，<span class="kbd">0</span> 灰(128)，<span class="kbd">R</span> 重置视角。
      </div>
    </div>
  `;

  const ui = {
    r: panelEl.querySelector("[data-r]"),
    g: panelEl.querySelector("[data-g]"),
    b: panelEl.querySelector("[data-b]"),
    rVal: panelEl.querySelector("[data-rVal]"),
    gVal: panelEl.querySelector("[data-gVal]"),
    bVal: panelEl.querySelector("[data-bVal]"),

    strength: panelEl.querySelector("[data-strength]"),
    strengthVal: panelEl.querySelector("[data-strengthVal]"),
    opacity: panelEl.querySelector("[data-opacity]"),
    opVal: panelEl.querySelector("[data-opVal]"),

    showVolume: panelEl.querySelector("[data-showVolume]"),
    volumeOpacity: panelEl.querySelector("[data-volumeOpacity]"),
    volumeSize: panelEl.querySelector("[data-volumeSize]"),
    volVal: panelEl.querySelector("[data-volVal]"),
    volSizeVal: panelEl.querySelector("[data-volSizeVal]"),

    showComplement: panelEl.querySelector("[data-showComplement]"),
    showLabels: panelEl.querySelector("[data-showLabels]"),
    showGray: panelEl.querySelector("[data-showGray]"),
    grayFocus: panelEl.querySelector("[data-grayFocus]"),
    showContrastLinks: panelEl.querySelector("[data-showContrastLinks]"),
    showTriRGB: panelEl.querySelector("[data-showTriRGB]"),
    showTriCMY: panelEl.querySelector("[data-showTriCMY]"),

    swatchMain: panelEl.querySelector("[data-swatchMain]"),
    swatchComp: panelEl.querySelector("[data-swatchComp]"),
    hexMain: panelEl.querySelector("[data-hexMain]"),
    hexComp: panelEl.querySelector("[data-hexComp]"),
    hsvMain: panelEl.querySelector("[data-hsvMain]"),
    hslMain: panelEl.querySelector("[data-hslMain]"),
  };

  // ---------- Scene ----------
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
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
    opacity: 0.18,
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
  function createLabelTexture({ text, fg = "#EAF0FF", bg = "rgba(0,0,0,0.55)" }) {
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
    const fg = "#EAF0FF";
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

  // ---------- Complement point ----------
  const compMat = new THREE.MeshStandardMaterial({
    color: 0x7f7f7f,
    emissive: 0x7f7f7f,
    emissiveIntensity: 0.55,
    roughness: 0.35,
    metalness: 0.0,
    transparent: true,
    opacity: 0.9,
  });
  const compPoint = new THREE.Mesh(pointGeo, compMat);
  scene.add(compPoint);

  const compLineGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)]);
  const compLine = new THREE.Line(
    compLineGeom,
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22 })
  );
  scene.add(compLine);

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

    const showComp = ui.showComplement.checked;
    compPoint.visible = enabled ? false : showComp;
    compLine.visible = enabled ? false : showComp;

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

  function update() {
    const r = Number(ui.r.value);
    const g = Number(ui.g.value);
    const b = Number(ui.b.value);

    ui.rVal.textContent = r;
    ui.gVal.textContent = g;
    ui.bVal.textContent = b;

    const hex = rgbToHex(r, g, b);
    ui.hexMain.textContent = hex;
    ui.swatchMain.style.background = hex;

    const hsv = rgbToHsv(r, g, b);
    const hsl = rgbToHsl(r, g, b);
    ui.hsvMain.textContent = fmtHSV(hsv);
    ui.hslMain.textContent = fmtHSL(hsl);

    const strength = Number(ui.strength.value);
    ui.strengthVal.textContent = `${strength}%`;
    const strength01 = strength / 100;
    const cubeGlowOpacity = computeGlowOpacity(strength01);
    cubeGlowMat.opacity = cubeGlowOpacity;
    pointMat.emissiveIntensity = 0.55 * Math.min(2, strength01);
    compMat.emissiveIntensity = 0.55 * Math.min(2, strength01);

    colorPoint.position.copy(rgbToPos(r, g, b));
    pointMat.color.setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
    pointMat.emissive.setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);

    const cr = 255 - r;
    const cg = 255 - g;
    const cb = 255 - b;
    const chex = rgbToHex(cr, cg, cb);
    ui.hexComp.textContent = chex;
    ui.swatchComp.style.background = chex;
    compPoint.position.copy(rgbToPos(cr, cg, cb));
    compMat.color.setRGB(cr / 255, cg / 255, cb / 255, THREE.SRGBColorSpace);
    compMat.emissive.setRGB(cr / 255, cg / 255, cb / 255, THREE.SRGBColorSpace);

    const showComp = ui.showComplement.checked;
    compPoint.visible = showComp;
    compLine.visible = showComp;
    compLine.geometry.setFromPoints([colorPoint.position, compPoint.position]);

    const op = Number(ui.opacity.value) / 100;
    ui.opVal.textContent = op.toFixed(2);

    const showVol = ui.showVolume.checked;
    volumePoints.visible = showVol;
    const volOp = Number(ui.volumeOpacity.value) / 100;
    ui.volVal.textContent = volOp.toFixed(2);
    volumePoints.material.opacity = volOp;

    const volSize = Number(ui.volumeSize.value);
    ui.volSizeVal.textContent = String(volSize);
    volumePoints.material.size = volSize;

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

  const onInput = () => update();
  const onChange = () => update();
  ui.r.addEventListener("input", onInput);
  ui.g.addEventListener("input", onInput);
  ui.b.addEventListener("input", onInput);
  ui.strength.addEventListener("input", onInput);
  ui.opacity.addEventListener("input", onInput);
  ui.showVolume.addEventListener("change", onChange);
  ui.volumeOpacity.addEventListener("input", onInput);
  ui.volumeSize.addEventListener("input", onInput);
  ui.showComplement.addEventListener("change", onChange);
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
      ui.r.value = "255";
      ui.g.value = "0";
      ui.b.value = "0";
      update();
    }
    if (e.key === "2") {
      ui.r.value = "0";
      ui.g.value = "255";
      ui.b.value = "0";
      update();
    }
    if (e.key === "3") {
      ui.r.value = "0";
      ui.g.value = "0";
      ui.b.value = "255";
      update();
    }
    if (e.key === "0") {
      ui.r.value = "128";
      ui.g.value = "128";
      ui.b.value = "128";
      update();
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
  update();
  animate();

  return () => {
    resetBtn.removeEventListener("click", onReset);
    actionsEl.replaceChildren();

    window.removeEventListener("keydown", onKeydown);
    ui.r.removeEventListener("input", onInput);
    ui.g.removeEventListener("input", onInput);
    ui.b.removeEventListener("input", onInput);
    ui.strength.removeEventListener("input", onInput);
    ui.opacity.removeEventListener("input", onInput);
    ui.showVolume.removeEventListener("change", onChange);
    ui.volumeOpacity.removeEventListener("input", onInput);
    ui.volumeSize.removeEventListener("input", onInput);
    ui.showComplement.removeEventListener("change", onChange);
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
