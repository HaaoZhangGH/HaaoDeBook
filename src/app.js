(function () {
  const DesignBook = window.DesignBook;
  if (!DesignBook) {
    console.error("DesignBook registry not loaded. Did you include src/registry.js?");
    return;
  }

  const els = {
    sidebar: document.getElementById("sidebar"),
    panel: document.getElementById("panel"),
    content: document.getElementById("content"),
    panelTitle: document.getElementById("panelTitle"),
    panelContent: document.getElementById("panelContent"),
    toc: document.getElementById("toc"),
    projectSelect: document.getElementById("projectSelect"),
    topicActions: document.getElementById("topicActions"),
    btnSidebarOpen: document.getElementById("btnSidebarOpen"),
    btnSidebarClose: document.getElementById("btnSidebarClose"),
    btnPanelOpen: document.getElementById("btnPanelOpen"),
    btnPanelClose: document.getElementById("btnPanelClose"),
    btnPanelCloseHeader: document.getElementById("btnPanelCloseHeader"),
  };

  const STORAGE_KEY = "designbook.ui.v1";
  const uiState = loadUiState();
  applyUiState(uiState);

  let current = null;
  const scriptCache = new Map();

  function waitForThree() {
    if (window.THREE && window.OrbitControls) return Promise.resolve();
    return new Promise((resolve) => window.addEventListener("three-ready", () => resolve(), { once: true }));
  }

  function loadUiState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveUiState(next) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function setSidebarCollapsed(collapsed) {
    document.body.classList.toggle("sidebar-collapsed", collapsed);
    uiState.sidebarCollapsed = collapsed;
    saveUiState(uiState);
  }

  function setPanelCollapsed(collapsed) {
    document.body.classList.toggle("panel-collapsed", collapsed);
    uiState.panelCollapsed = collapsed;
    saveUiState(uiState);
  }

  function applyUiState(state) {
    if (state.sidebarCollapsed) document.body.classList.add("sidebar-collapsed");
    if (state.panelCollapsed) document.body.classList.add("panel-collapsed");
  }

  function parseRoute() {
    const raw = (location.hash || "").replace(/^#\/?/, "");
    const parts = raw.split("/").filter(Boolean);
    const projectId = parts[0] || DesignBook.projects[0]?.id;
    const topicId = parts[1] || DesignBook.projects[0]?.topics?.[0]?.id;
    return { projectId, topicId };
  }

  function setRoute(route, { replace = false } = {}) {
    const nextHash = `#/${route.projectId}/${route.topicId}`;
    if (replace) history.replaceState(null, "", nextHash);
    else location.hash = nextHash;
  }

  function renderProjectSelect(activeProjectId) {
    els.projectSelect.replaceChildren();
    for (const project of DesignBook.projects) {
      const opt = document.createElement("option");
      opt.value = project.id;
      opt.textContent = project.title;
      els.projectSelect.appendChild(opt);
    }
    els.projectSelect.value = activeProjectId;
  }

  function renderToc(project, activeTopicId) {
    const wrap = document.createElement("div");
    wrap.className = "toc-list";
    for (const topic of project.topics) {
      const a = document.createElement("a");
      a.className = "toc-link";
      a.href = `#/${project.id}/${topic.id}`;
      a.textContent = topic.title;
      if (topic.id === activeTopicId) a.setAttribute("aria-current", "page");
      wrap.appendChild(a);
    }
    els.toc.replaceChildren(wrap);
  }

  function setPanelTitle(title) {
    els.panelTitle.textContent = title || "—";
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  }

  function showError(title, error) {
    console.error(error);
    setPanelTitle(title);
    els.topicActions.replaceChildren();
    els.content.innerHTML = `<div style="padding:16px;color:rgba(234,240,255,0.85);font-size:13px;line-height:1.6">
      <div style="font-weight:700;margin-bottom:8px">加载失败</div>
      <div style="opacity:.85">${escapeHtml(error?.message || error)}</div>
    </div>`;
    els.panelContent.innerHTML = `<div style="color:rgba(234,240,255,0.75);font-size:12px;line-height:1.55">
      <div>该主题加载失败，请打开控制台查看错误信息。</div>
    </div>`;
  }

  function loadScript(src) {
    if (scriptCache.has(src)) return scriptCache.get(src);
    const p = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(s);
    });
    scriptCache.set(src, p);
    return p;
  }

  async function mountTopic(route) {
    const project = DesignBook.getProject(route.projectId) || DesignBook.projects[0];
    const topic = DesignBook.getTopic(project, route.topicId) || project?.topics?.[0];
    if (!project || !topic) return;

    const isSame = current?.projectId === project.id && current?.topicId === topic.id;
    if (isSame) return;

    renderProjectSelect(project.id);
    renderToc(project, topic.id);
    setPanelTitle(topic.title);

    if (current?.unmount) {
      try {
        await current.unmount();
      } catch (e) {
        console.warn("Topic unmount failed:", e);
      }
    }

    els.content.replaceChildren();
    els.panelContent.replaceChildren();
    els.topicActions.replaceChildren();

    try {
      await waitForThree();
      await loadScript(topic.entry);
      const mod = DesignBook.getModule(topic.key);
      if (!mod || typeof mod.mount !== "function") throw new Error(`Topic module not registered: ${topic.key}`);

      const api = {
        contentEl: els.content,
        panelEl: els.panelContent,
        actionsEl: els.topicActions,
        setPanelTitle,
        setPanelCollapsed,
        setSidebarCollapsed,
      };
      const unmount = await mod.mount(api);
      current = { projectId: project.id, topicId: topic.id, unmount: typeof unmount === "function" ? unmount : null };
      document.title = `${topic.title} · ${project.title}`;
    } catch (e) {
      current = { projectId: project.id, topicId: topic.id, unmount: null };
      showError(topic.title, e);
    }
  }

  function wireUi() {
    els.btnSidebarOpen.addEventListener("click", () => setSidebarCollapsed(false));
    els.btnSidebarClose.addEventListener("click", () => setSidebarCollapsed(true));
    els.btnPanelOpen.addEventListener("click", () => setPanelCollapsed(false));
    els.btnPanelClose.addEventListener("click", () => setPanelCollapsed(true));
    els.btnPanelCloseHeader.addEventListener("click", () => setPanelCollapsed(true));

    els.projectSelect.addEventListener("change", () => {
      const project = DesignBook.getProject(els.projectSelect.value) || DesignBook.projects[0];
      const first = project?.topics?.[0];
      if (!project || !first) return;
      setRoute({ projectId: project.id, topicId: first.id });
    });

    window.addEventListener("hashchange", () => mountTopic(parseRoute()));

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setPanelCollapsed(!document.body.classList.contains("panel-collapsed"));
    });
  }

  wireUi();

  const initial = parseRoute();
  setRoute(initial, { replace: true });
  mountTopic(initial);
})();

