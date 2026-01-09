(() => {
	  async function mount({ contentEl, panelEl, actionsEl, setPanelTitle }) {
	    setPanelTitle("新主题");

	    contentEl.innerHTML = `
	      <div style="padding:var(--space-16);line-height:1.6;color:var(--text)">
	        <div style="font-weight:700;margin-bottom:var(--space-8);font-size:var(--fs-title)">主题已加载</div>
	        <div style="opacity:.85;font-size:var(--fs-body)">把你的内容渲染到 <code>contentEl</code>，把控制项放到 <code>panelEl</code>。</div>
	        <div style="margin-top:var(--space-12);font-size:var(--fs-note);color:var(--muted)">UI 约定：优先使用 <code>src/styles.css</code> 的 tokens（见 <code>docs/UI-规范.md</code>）。</div>
	      </div>
	    `;

	    panelEl.innerHTML = `
	      <div style="font-size:var(--fs-body);line-height:1.55;color:var(--text)">
	        <div style="margin-bottom:var(--space-12);opacity:.9">这里是右侧面板区域（可放滑杆、开关、说明等）。</div>
	      </div>
	    `;

    actionsEl.replaceChildren();
    const btn = document.createElement("button");
    btn.className = "icon-btn";
    btn.type = "button";
    btn.textContent = "重置";
    btn.addEventListener("click", () => {
      panelEl.scrollTop = 0;
    });
    actionsEl.appendChild(btn);

    return () => {
      btn.remove();
      actionsEl.replaceChildren();
      contentEl.replaceChildren();
      panelEl.replaceChildren();
    };
  }

  window.DesignBook?.registerModule?.("<projectId>/<topicId>", { mount });
})();
