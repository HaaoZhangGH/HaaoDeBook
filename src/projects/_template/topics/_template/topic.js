(() => {
  async function mount({ contentEl, panelEl, actionsEl, setPanelTitle }) {
    setPanelTitle("新主题");

    contentEl.innerHTML = `
      <div style="padding:16px;line-height:1.6;color:rgba(234,240,255,0.9)">
        <div style="font-weight:700;margin-bottom:8px">主题已加载</div>
        <div style="opacity:.85">把你的内容渲染到 <code>contentEl</code>，把控制项放到 <code>panelEl</code>。</div>
      </div>
    `;

    panelEl.innerHTML = `
      <div style="font-size:12px;line-height:1.55;color:rgba(234,240,255,0.85)">
        <div style="margin-bottom:10px;opacity:.9">这里是右侧面板区域（可放滑杆、开关、说明等）。</div>
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

