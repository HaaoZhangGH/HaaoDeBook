(function () {
  const DesignBook = window.DesignBook;
  if (!DesignBook) {
    console.error("DesignBook registry not loaded. Did you include src/registry.js?");
    return;
  }

  const Kit = window.DesignBookKit;
  if (!Kit) {
    console.error("DesignBookKit not loaded. Did you include src/designbook-kit.js?");
    return;
  }

  const ALL_PROJECTS = "__all__";

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
	    btnPanelCloseHeader: document.getElementById("btnPanelCloseHeader"),
	  };

	  const SIDEBAR_COLLAPSE_MQ = window.matchMedia("(max-width: 1180px)");
	  const PANEL_COLLAPSE_MQ = window.matchMedia("(max-width: 860px)");
	  const LEVELS_TONES_PANEL_COLLAPSE_MQ = window.matchMedia("(max-width: 1100px)");
	  function syncResponsiveUi() {
	    document.body.classList.toggle("sidebar-collapsed", SIDEBAR_COLLAPSE_MQ.matches);
	    const topic = document.body.dataset.topic || "";
	    const shouldCollapsePanel =
	      topic === "levels-tones" ? LEVELS_TONES_PANEL_COLLAPSE_MQ.matches : PANEL_COLLAPSE_MQ.matches;
	    document.body.classList.toggle("panel-collapsed", shouldCollapsePanel);
	  }

	  const STORAGE_KEY = "designbook.ui.v1";
	  const uiState = loadUiState();
	  applyUiState(uiState);
	  if (!uiState.projectFilter) uiState.projectFilter = ALL_PROJECTS;

	  let current = null;
	  const scriptCache = new Map();

  function loadUiState() {
    return Kit.storage.loadJson(STORAGE_KEY, {});
  }

  function saveUiState(next) {
    Kit.storage.saveJson(STORAGE_KEY, next);
  }

  function setProjectFilter(next) {
    uiState.projectFilter = next || ALL_PROJECTS;
    saveUiState(uiState);
  }

  function setSidebarCollapsed(collapsed) {
    // Sidebar collapse is responsive-only. Ignore manual/persisted attempts.
    syncResponsiveUi();
  }

	  function setPanelCollapsed(collapsed) {
	    // Panel collapse is responsive-only. Ignore manual/persisted attempts.
	    syncResponsiveUi();
	  }

	  function setPanelLockedOpen(locked) {
	    if (locked) {
	      document.body.classList.add("panel-header-hidden");
	      syncResponsiveUi();
	      return;
	    }
	    document.body.classList.remove("panel-header-hidden");
	    syncResponsiveUi();
	  }

	  function applyUiState(state) {
	    syncResponsiveUi();
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

  function renderProjectSelect(selectedProjectIdOrAll) {
    els.projectSelect.replaceChildren();
    const optAll = document.createElement("option");
    optAll.value = ALL_PROJECTS;
    optAll.textContent = "全部";
    els.projectSelect.appendChild(optAll);
    for (const project of DesignBook.projects) {
      const opt = document.createElement("option");
      opt.value = project.id;
      opt.textContent = project.title;
      els.projectSelect.appendChild(opt);
    }
    els.projectSelect.value = selectedProjectIdOrAll || ALL_PROJECTS;
  }

  function renderToc({ filterProjectId, activeProjectId, activeTopicId }) {
    const wrap = document.createElement("div");
    wrap.className = "toc-list";

    const addTopicLink = (project, topic) => {
      const a = document.createElement("a");
      a.className = "toc-link";
      a.href = `#/${project.id}/${topic.id}`;
      a.textContent = topic.title;
      if (project.id === activeProjectId && topic.id === activeTopicId) a.setAttribute("aria-current", "page");
      wrap.appendChild(a);
    };

    if (!filterProjectId || filterProjectId === ALL_PROJECTS) {
      for (const project of DesignBook.projects) {
        const title = document.createElement("div");
        title.className = "toc-group-title";
        title.textContent = project.title;
        wrap.appendChild(title);
        for (const topic of project.topics) addTopicLink(project, topic);
      }
    } else {
      const project = DesignBook.getProject(filterProjectId);
      for (const topic of project?.topics || []) addTopicLink(project, topic);
    }
    els.toc.replaceChildren(wrap);
  }

  function setPanelTitle(title) {
    els.panelTitle.textContent = title || "—";
  }

  function showError(title, error) {
    console.error(error);
    setPanelTitle(title);
    els.topicActions.replaceChildren();
    els.content.innerHTML = `<div style="padding:var(--space-16);color:var(--text);font-size:var(--fs-body);line-height:1.6">
      <div style="font-weight:750;margin-bottom:var(--space-8);font-size:var(--fs-title)">加载失败</div>
      <div style="opacity:.85">${Kit.text.escapeHtml(error?.message || error)}</div>
    </div>`;
    els.panelContent.innerHTML = `<div style="color:var(--muted);font-size:var(--fs-note);line-height:1.55">
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

    if (route.projectId !== project.id || route.topicId !== topic.id) {
      setRoute({ projectId: project.id, topicId: topic.id }, { replace: true });
    }

    if (uiState.projectFilter !== ALL_PROJECTS && uiState.projectFilter !== project.id) {
      setProjectFilter(ALL_PROJECTS);
    }
	    renderProjectSelect(uiState.projectFilter);
	    renderToc({ filterProjectId: uiState.projectFilter, activeProjectId: project.id, activeTopicId: topic.id });
	    setPanelTitle(topic.title);
	    document.body.dataset.topic = topic.id || "";
	    setPanelLockedOpen(topic.id === "levels-tones");

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
      if (topic.needsThree) await Kit.three.waitReady();
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
    // Sidebar collapse controls removed.
    els.btnPanelOpen.addEventListener("click", () => setPanelCollapsed(false));
    els.btnPanelCloseHeader.addEventListener("click", () => setPanelCollapsed(true));

    els.projectSelect.addEventListener("change", () => {
      const val = els.projectSelect.value || ALL_PROJECTS;
      setProjectFilter(val);
      if (val === ALL_PROJECTS) {
        const r = parseRoute();
        renderToc({ filterProjectId: ALL_PROJECTS, activeProjectId: r.projectId, activeTopicId: r.topicId });
        return;
      }
      const project = DesignBook.getProject(val) || DesignBook.projects[0];
      const first = project?.topics?.[0];
      if (!project || !first) return;
      setRoute({ projectId: project.id, topicId: first.id });
    });

    window.addEventListener("hashchange", () => mountTopic(parseRoute()));

	    // Responsive sidebar: size-driven only
	    if (typeof SIDEBAR_COLLAPSE_MQ.addEventListener === "function") {
	      SIDEBAR_COLLAPSE_MQ.addEventListener("change", syncResponsiveUi);
	    } else if (typeof SIDEBAR_COLLAPSE_MQ.addListener === "function") {
	      SIDEBAR_COLLAPSE_MQ.addListener(syncResponsiveUi);
	    }
	    if (typeof PANEL_COLLAPSE_MQ.addEventListener === "function") {
	      PANEL_COLLAPSE_MQ.addEventListener("change", syncResponsiveUi);
	      LEVELS_TONES_PANEL_COLLAPSE_MQ.addEventListener("change", syncResponsiveUi);
	    } else if (typeof PANEL_COLLAPSE_MQ.addListener === "function") {
	      PANEL_COLLAPSE_MQ.addListener(syncResponsiveUi);
	      LEVELS_TONES_PANEL_COLLAPSE_MQ.addListener(syncResponsiveUi);
	    }
	    window.addEventListener("resize", syncResponsiveUi, { passive: true });

	    window.addEventListener("keydown", (e) => {
	      // Panels are responsive-only; ignore manual toggles.
	      if (e.key === "Escape") syncResponsiveUi();
	    });
	  }

  wireUi();

  const initial = parseRoute();
  setRoute(initial, { replace: true });
  mountTopic(initial);
})();
