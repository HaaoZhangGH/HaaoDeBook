(() => {
  const MODULE_KEY = "color-models/ui-color-system";

  const DesignBook = window.DesignBook;
  if (!DesignBook || typeof DesignBook.registerModule !== "function") {
    console.error("[ui-color-system] DesignBook registry not loaded. Did you include src/registry.js?");
    return;
  }

  const Kit = window.DesignBookKit;
  if (!Kit) {
    console.error("[ui-color-system] DesignBookKit not loaded. Did you include src/designbook-kit.js?");
    return;
  }

  const STYLE_ID = "topic-ui-color-system-styles";
  const STORAGE_KEY = "designbook.colorSystem.v1";
  const UI_STATE_KEY = "designbook.uiDesignSystem.ui.v1";

  function ensureStyles() {
    const cssText = `
	.ucs-root{--ucs-right-w:440px;padding:var(--space-16);position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(340px,var(--ucs-right-w));grid-template-rows:minmax(0,1fr);gap:var(--space-16);height:100%;min-height:0}
		.ucs-split-resize{position:absolute;top:var(--space-16);bottom:var(--space-16);left:calc(100% - var(--ucs-right-w));width:18px;transform:translateX(-50%);cursor:col-resize;z-index:30;touch-action:none}
		.ucs-split-resize::before,.ucs-split-resize::after{content:none}
		.ucs-card{border:1px solid color-mix(in srgb, var(--stroke-2) 80%, transparent);border-radius:var(--radius-16);background:linear-gradient(180deg, rgba(255,255,255,.03) 0%, rgba(10,14,26,.42) 100%),var(--glass);overflow:hidden;box-shadow:0 14px 48px rgba(0,0,0,.26)}
	.ucs-card-h{padding:14px 16px;border-bottom:1px solid color-mix(in srgb, var(--stroke-2) 80%, transparent);display:flex;align-items:center;justify-content:space-between;gap:var(--space-12);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
	.ucs-card-t{font-size:var(--fs-title);font-weight:860;letter-spacing:.2px}
.ucs-card-b{padding:var(--space-12) var(--space-14)}
.ucs-token-card{display:flex;flex-direction:column;min-height:0}
.ucs-token-card .ucs-card-b{flex:1;overflow:auto;scrollbar-gutter:stable}
.ucs-token-card .ucs-card-b{padding:12px}
	.ucs-table{position:relative;border:1px solid rgba(168,186,238,.16);border-radius:18px;overflow:hidden;background:linear-gradient(180deg, rgba(12,17,30,.72), rgba(8,12,24,.66));box-shadow:inset 0 1px 0 rgba(255,255,255,.04);--ucs-col-name:240px}
.ucs-row{display:grid;grid-template-columns:32px var(--ucs-col-name) minmax(0,1fr) minmax(0,1fr);align-items:center;min-width:0}
.ucs-row.cols-3{grid-template-columns:32px var(--ucs-col-name) minmax(0,1fr)}
.ucs-col-resize{position:absolute;top:0;bottom:0;left:calc(32px + var(--ucs-col-name));width:14px;transform:translateX(-7px);cursor:col-resize;z-index:6;touch-action:none}
.ucs-col-resize::before{content:"";position:absolute;top:10px;bottom:10px;left:50%;width:1px;transform:translateX(-.5px);background:linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.18), rgba(255,255,255,.03))}
.ucs-col-resize::after{content:"";position:absolute;inset:8px 2px;border-radius:12px;background:rgba(255,255,255,.02);opacity:0;transition:opacity .14s ease}
.ucs-col-resize:hover::after{opacity:1}
.ucs-row + .ucs-row{border-top:1px solid rgba(255,255,255,.09)}
	.ucs-row.head{position:sticky;top:0;z-index:4;background:linear-gradient(180deg, rgba(8,12,22,.9), rgba(8,12,22,.7));backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
		.ucs-row.group{background:linear-gradient(180deg, rgba(255,255,255,.025), rgba(0,0,0,.08));font-weight:860;letter-spacing:.3px;color:color-mix(in srgb, var(--text-2) 88%, #fff 12%);user-select:none}
	.ucs-row.group .ucs-cellx.check,.ucs-row.group .ucs-cellx.col{display:none}
	.ucs-row.group .ucs-cellx.name{grid-column:1 / -1;padding:14px 14px 10px;font-size:14px;letter-spacing:.35px}
		.ucs-row.group:hover{background:linear-gradient(180deg, rgba(255,255,255,.04), rgba(0,0,0,.10))}
		.ucs-row.group.is-collapsed{background:linear-gradient(180deg, rgba(7,10,18,.72), rgba(7,10,18,.6));color:color-mix(in srgb, var(--text-2) 92%, #fff 8%)}
	.ucs-row.group.is-collapsed .ucs-group-btn .meta{opacity:.9}
.ucs-group-btn{appearance:none;-webkit-appearance:none;border:0;background:transparent;color:inherit;display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;padding:0;margin:0;cursor:pointer}
.ucs-group-left{display:flex;align-items:center;gap:10px;min-width:0}
.ucs-group-left .ttl{flex:0 1 auto;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ucs-group-btn .chev{width:18px;height:18px;border-radius:8px;display:grid;place-items:center;background:rgba(0,0,0,.20);border:1px solid rgba(255,255,255,.10);color:rgba(255,255,255,.82);transition:transform .16s ease,background .16s ease;flex:0 0 auto}
.ucs-row.group:hover .ucs-group-btn .chev{background:rgba(255,255,255,.06)}
.ucs-row.group.is-collapsed .ucs-group-btn .chev{transform:rotate(-90deg)}
.ucs-group-btn .meta{font-size:12px;color:var(--muted);font-weight:750;border:1px solid rgba(255,255,255,.12);background:rgba(0,0,0,.16);padding:4px 8px;border-radius:999px;font-variant-numeric:tabular-nums}
.ucs-cellx{padding:12px 14px;min-width:0}
	.ucs-cellx.check{display:flex;justify-content:center;align-items:center}
.ucs-cellx.col{border-left:1px solid rgba(255,255,255,.10)}
	.ucs-cellx.name{font-size:var(--fs-body);font-weight:650;line-height:1.2;color:var(--text);overflow:hidden}
	.ucs-name{display:flex;align-items:center;gap:8px;min-width:0}
	.ucs-name .txt{flex:1 1 auto;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
	.ucs-row.token.indent-1 .ucs-name .txt{padding-left:14px}
	.ucs-row.token.indent-1 .ucs-cellx.check{justify-content:flex-start}
	.ucs-row.token.indent-1 .ucs-check{margin-left:14px}
	.ucs-cellx.name .ref{margin-left:8px;color:var(--muted);font-weight:600;font-size:var(--fs-note);opacity:.9;white-space:nowrap}
		.ucs-locate{width:26px;height:26px;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:rgba(0,0,0,.18);color:var(--muted);display:grid;place-items:center;cursor:pointer;opacity:.25;transition:opacity .15s ease,background .15s ease;line-height:1;padding:0}
		.ucs-locate svg{width:14px;height:14px;display:block;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
	.ucs-row.token:hover .ucs-locate{opacity:.9}
	.ucs-locate:hover{background:rgba(0,0,0,.26)}
	.ucs-locate:active{transform:translateY(1px)}
	.ucs-locate:focus-visible{outline:2px solid rgba(255,255,255,.18);outline-offset:2px}
	.ucs-del{width:24px;height:24px;border-radius:10px;border:1px solid rgba(255,255,255,.14);background:rgba(0,0,0,.18);color:var(--muted);display:grid;place-items:center;cursor:pointer;opacity:.12;transition:opacity .15s ease,background .15s ease,border-color .15s ease,color .15s ease}
	.ucs-row.token:hover .ucs-del{opacity:.85}
	.ucs-del:hover{background:rgba(255,62,62,.14);border-color:rgba(255,62,62,.26);color:rgba(255,255,255,.86)}
	.ucs-del:active{transform:translateY(1px)}
	.ucs-del:focus-visible{outline:2px solid rgba(255,255,255,.18);outline-offset:2px}
.ucs-row.head .ucs-cellx{font-size:var(--fs-note);color:var(--muted);font-weight:650;padding:12px 14px}
.ucs-row.head .ucs-cellx.check{opacity:0}
	.ucs-row.token:hover{background:rgba(255,255,255,.028)}
	.ucs-row.token.is-editing{background:rgba(255,255,255,.04)}
	.ucs-row.token.is-editing .ucs-cellx.name{color:color-mix(in srgb, var(--text) 92%, #fff 8%)}
	.ucs-row.token.is-editing .ucs-locate{opacity:.9}
	.ucs-row.token.is-ping{position:relative;background:color-mix(in srgb, var(--brand-100) 65%, rgba(255,255,255,.03))}
	.ucs-row.token.is-ping::after{content:"";position:absolute;inset:6px;border-radius:16px;border:1px solid color-mix(in srgb, var(--brand-500) 55%, rgba(255,255,255,.12));pointer-events:none}
	.ucs-type-cols-head{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;align-items:center;font-size:12px;color:var(--muted);font-weight:650}
	.ucs-type-cols-head span{white-space:nowrap}
		.ucs-type-triple{display:grid;grid-template-columns:repeat(3,minmax(72px,1fr));gap:10px;align-items:center}
		.ucs-type-triple .ucs-num{width:100%}
	.ucs-type-triple input[type="number"]{width:100%;min-width:72px;border:1px solid rgba(255,255,255,.10);background:rgba(0,0,0,.14);color:var(--text);border-radius:12px;padding:8px 10px;font-size:12px;font-weight:780;outline:none;font-variant-numeric:tabular-nums;text-align:right;transition:border-color .14s ease,background .14s ease,box-shadow .14s ease}
	.ucs-type-triple input[type="number"]:hover{border-color:rgba(255,255,255,.16);background:rgba(0,0,0,.16)}
	.ucs-type-triple input[type="number"]:focus{outline:2px solid rgba(255,255,255,.14);outline-offset:2px}
	.ucs-type-scale{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center}
	.ucs-type-scale .n{font-variant-numeric:tabular-nums;color:var(--text);font-weight:760;min-width:58px;text-align:right}
.ucs-cell{display:flex;align-items:center;gap:10px;min-width:0}
.ucs-cell input[type="color"]{appearance:none;-webkit-appearance:none;width:26px;height:18px;border-radius:6px;border:0;background:transparent;padding:0;flex:0 0 auto}
.ucs-cell input[type="color"]::-webkit-color-swatch-wrapper{padding:0}
.ucs-cell input[type="color"]::-webkit-color-swatch{border:0;border-radius:6px}
.ucs-cell input[type="color"]::-moz-color-swatch{border:0;border-radius:6px}
.ucs-cell input[type="text"]{width:78px;max-width:96px;border:0;border-radius:0;background:transparent;color:var(--text);padding:0;font-size:var(--fs-note);font-weight:700;letter-spacing:.4px;text-transform:uppercase;outline:none}
.ucs-cell input[type="text"]::placeholder{color:rgba(255,255,255,.35)}
.ucs-cell input[type="text"]:focus{outline:none;border-bottom:1px solid rgba(255,255,255,.22)}
	.ucs-cell input[type="number"]{width:92px;max-width:140px;border:1px solid rgba(255,255,255,.10);border-radius:12px;background:rgba(0,0,0,.14);color:var(--text);padding:8px 10px;font-size:12px;font-weight:780;letter-spacing:.2px;outline:none;font-variant-numeric:tabular-nums;text-align:right;transition:border-color .14s ease,background .14s ease,box-shadow .14s ease}
	.ucs-cell input[type="number"]:hover{border-color:rgba(255,255,255,.16);background:rgba(0,0,0,.16)}
	.ucs-cell input[type="number"]:focus{outline:2px solid rgba(255,255,255,.14);outline-offset:2px}
		.ucs-num{display:flex;align-items:center;gap:6px}
		.ucs-num input[type="number"]{flex:1 1 auto;min-width:0;height:40px;padding:0 12px;box-sizing:border-box}
		.ucs-stepper{display:flex;flex-direction:column;gap:0;flex:0 0 auto;width:32px;height:40px;border:1px solid rgba(255,255,255,.12);border-radius:14px;overflow:hidden;background:rgba(0,0,0,.12);opacity:.45;transition:opacity .12s ease,border-color .12s ease,background .12s ease}
	.ucs-num:hover .ucs-stepper,.ucs-num:focus-within .ucs-stepper{opacity:1;border-color:rgba(255,255,255,.18);background:rgba(0,0,0,.14)}
		.ucs-step{appearance:none;-webkit-appearance:none;border:0;background:transparent;color:rgba(255,255,255,.62);width:100%;flex:1 1 0;display:grid;place-items:center;cursor:pointer;line-height:1;font-size:9px;padding:0;transition:background .12s ease,color .12s ease}
	.ucs-step + .ucs-step{border-top:1px solid rgba(255,255,255,.10)}
	.ucs-step:hover{background:rgba(255,255,255,.06);color:rgba(255,255,255,.78)}
	.ucs-step:active{background:rgba(255,255,255,.08)}
	.ucs-step:focus-visible{outline:2px solid rgba(255,255,255,.16);outline-offset:2px}
	.ucs-disabled .ucs-stepper{opacity:.35;pointer-events:none}
.ucs-cell input[type="number"]::-webkit-outer-spin-button,.ucs-cell input[type="number"]::-webkit-inner-spin-button{appearance:none;-webkit-appearance:none;margin:0}
.ucs-type-triple input[type="number"]::-webkit-outer-spin-button,.ucs-type-triple input[type="number"]::-webkit-inner-spin-button{appearance:none;-webkit-appearance:none;margin:0}
.ucs-shadow-nums input[type="number"]::-webkit-outer-spin-button,.ucs-shadow-nums input[type="number"]::-webkit-inner-spin-button{appearance:none;-webkit-appearance:none;margin:0}
.ucs-cell input[type="number"],.ucs-type-triple input[type="number"],.ucs-shadow-nums input[type="number"]{appearance:textfield;-moz-appearance:textfield}
.ucs-cell .mini{font-size:var(--fs-note);color:var(--muted);font-variant-numeric:tabular-nums}
.ucs-cell .sep{width:1px;height:18px;background:rgba(255,255,255,.10)}
.ucs-ctrls{display:flex;align-items:center;gap:10px;min-width:0}
.ucs-ctrls .ucs-alpha{max-width:140px}
.ucs-ctrls .ucs-alpha .k{display:none}
.ucs-ctrls .ucs-alpha .n{min-width:28px}
.ucs-ctrls[data-alpha="false"] .ucs-alpha{display:none}
.ucs-cell input[type="range"],.ucs-shadow-ctrl input[type="range"],.ucs-type-scale input[type="range"]{width:100%;appearance:none;background:transparent;height:18px;--p:50%;--track:rgba(255,255,255,.10);--fill:rgba(255,255,255,.78)}
.ucs-cell input[type="range"]::-webkit-slider-runnable-track,.ucs-shadow-ctrl input[type="range"]::-webkit-slider-runnable-track,.ucs-type-scale input[type="range"]::-webkit-slider-runnable-track{height:10px;border-radius:999px;background:linear-gradient(to right,var(--fill) 0%,var(--fill) var(--p),var(--track) var(--p),var(--track) 100%);border:1px solid rgba(255,255,255,.14)}
.ucs-cell input[type="range"]::-webkit-slider-thumb,.ucs-shadow-ctrl input[type="range"]::-webkit-slider-thumb,.ucs-type-scale input[type="range"]::-webkit-slider-thumb{appearance:none;-webkit-appearance:none;margin-top:-6px;width:22px;height:22px;border-radius:999px;background:var(--fill);border:2px solid rgba(0,0,0,.35);box-shadow:0 0 0 1px rgba(255,255,255,.12)}
.ucs-cell input[type="range"]::-moz-range-track,.ucs-shadow-ctrl input[type="range"]::-moz-range-track,.ucs-type-scale input[type="range"]::-moz-range-track{height:10px;border-radius:999px;background:var(--track);border:1px solid rgba(255,255,255,.14)}
.ucs-cell input[type="range"]::-moz-range-progress,.ucs-shadow-ctrl input[type="range"]::-moz-range-progress,.ucs-type-scale input[type="range"]::-moz-range-progress{height:10px;border-radius:999px;background:var(--fill)}
.ucs-cell input[type="range"]::-moz-range-thumb,.ucs-shadow-ctrl input[type="range"]::-moz-range-thumb,.ucs-type-scale input[type="range"]::-moz-range-thumb{width:22px;height:22px;border-radius:999px;background:var(--fill);border:2px solid rgba(0,0,0,.35)}
.ucs-alpha{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;min-width:0;flex:1 1 auto}
.ucs-alpha .n{font-variant-numeric:tabular-nums;font-size:var(--fs-note);color:var(--muted);min-width:30px;text-align:right}
.ucs-shadow-ctrl{display:flex;flex-direction:column;gap:10px;min-width:0}
.ucs-shadow-ctrl input[type="color"]{appearance:none;-webkit-appearance:none;width:26px;height:18px;border-radius:6px;border:0;background:transparent;padding:0;flex:0 0 auto}
.ucs-shadow-ctrl input[type="color"]::-webkit-color-swatch-wrapper{padding:0}
.ucs-shadow-ctrl input[type="color"]::-webkit-color-swatch{border:0;border-radius:6px}
.ucs-shadow-ctrl input[type="color"]::-moz-color-swatch{border:0;border-radius:6px}
.ucs-shadow-ctrl input[type="text"]{width:78px;max-width:96px;border:0;border-radius:0;background:transparent;color:var(--text);padding:0;font-size:var(--fs-note);font-weight:700;letter-spacing:.4px;text-transform:uppercase;outline:none}
.ucs-shadow-ctrl input[type="text"]::placeholder{color:rgba(255,255,255,.35)}
.ucs-shadow-ctrl input[type="text"]:focus{outline:none;border-bottom:1px solid rgba(255,255,255,.22)}
	.ucs-shadow-nums{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
	.ucs-shadow-nums .ucs-num{width:100%}
.ucs-shadow-nums .k{font-size:10px;color:var(--muted);font-weight:800;text-transform:uppercase;letter-spacing:.6px;margin-bottom:4px}
.ucs-shadow-nums input[type="number"]{width:100%;border:1px solid rgba(255,255,255,.10);background:rgba(0,0,0,.14);color:var(--text);border-radius:12px;padding:8px 10px;font-size:12px;font-weight:780;outline:none;font-variant-numeric:tabular-nums}
.ucs-shadow-nums input[type="number"]:focus{outline:2px solid rgba(255,255,255,.14);outline-offset:2px}
.ucs-shadow-color{display:flex;align-items:center;gap:10px;min-width:0}
.ucs-ref{font-size:var(--fs-note);color:var(--muted);opacity:.9}
.ucs-disabled{opacity:.55;pointer-events:none}
	.ucs-actions{display:flex;align-items:center;gap:10px;row-gap:10px;flex-wrap:wrap;justify-content:flex-end}
	.ucs-actions .btn{border-radius:999px;border:1px solid rgba(255,255,255,.14);background:linear-gradient(180deg, rgba(255,255,255,.07), rgba(0,0,0,.18));color:var(--text);padding:10px 14px;font-size:var(--fs-note);cursor:pointer;box-shadow:inset 0 1px 0 rgba(255,255,255,.08);transition:transform .12s ease,background .12s ease,border-color .12s ease}
	.ucs-actions .btn:hover{background:linear-gradient(180deg, rgba(255,255,255,.10), rgba(0,0,0,.22));border-color:rgba(255,255,255,.18)}
	.ucs-actions .btn:active{transform:translateY(1px)}
	.ucs-actions .btn.primary{background:linear-gradient(180deg, rgba(255,255,255,.14), rgba(0,0,0,.14));border-color:rgba(255,255,255,.22)}
		.ucs-actions .pill{font-size:var(--fs-note);color:var(--muted)}
		.ucs-actions .pill:empty{display:none}

			.ucs-editor-tabs{position:sticky;top:0;z-index:6;margin-bottom:12px;display:flex;gap:6px;padding:6px;border-radius:999px;border:1px solid rgba(168,186,238,.16);background:linear-gradient(180deg, rgba(255,255,255,.03), rgba(5,8,16,.42));backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
		.ucs-editor-tabs .ucs-tab{flex:1 1 0;display:flex;align-items:center;justify-content:center;padding:10px 12px;border-radius:999px;font-size:13px;font-weight:760;color:var(--text);opacity:.7;cursor:pointer;user-select:none;background:transparent;border:0}
		.ucs-editor-tabs .ucs-tab:hover{opacity:.9}
		.ucs-editor-tabs .ucs-tab.on{opacity:1;background:rgba(255,255,255,.10);box-shadow:none}
		.ucs-editor-tabs .ucs-tab:active{transform:translateY(1px)}
		.ucs-editor-tabs .ucs-tab:focus-visible{outline:2px solid rgba(255,255,255,.18);outline-offset:2px}
	
		.ucs-addwrap{margin-bottom:12px;padding:12px;border-radius:18px;border:1px solid var(--stroke-2);background:rgba(0,0,0,.16)}
		.ucs-addrow{display:grid;grid-template-columns:minmax(140px,1.2fr) minmax(110px,1fr) minmax(110px,1fr) auto auto;gap:10px;align-items:center}
		.ucs-addrow input{width:100%;border:1px solid rgba(255,255,255,.10);background:rgba(0,0,0,.18);color:var(--text);border-radius:14px;padding:10px 12px;font-size:var(--fs-note);outline:none}
	.ucs-addrow input:focus{outline:2px solid rgba(255,255,255,.14);outline-offset:2px}
	.ucs-addwrap .btn{border-radius:14px;border:1px solid rgba(255,255,255,.14);background:rgba(0,0,0,.20);color:var(--text);padding:10px 12px;font-size:var(--fs-note);cursor:pointer}
	.ucs-addwrap .btn:hover{background:rgba(0,0,0,.26)}
	.ucs-addwrap .btn:active{transform:translateY(1px)}
	.ucs-addwrap .btn.primary{background:rgba(255,255,255,.10);border-color:rgba(255,255,255,.18)}
	.ucs-addhint{margin-top:8px;font-size:12px;color:var(--muted);line-height:1.4}
	
	.ucs-preview-wrap{display:flex;flex-direction:column;gap:var(--space-12);min-height:0}
	.ucs-preview-card{display:flex;flex-direction:column;min-height:0;flex:1 1 auto;border:0;background:transparent;overflow:visible;box-shadow:none}
	.ucs-preview-card .ucs-card-b{flex:1;min-height:0;overflow:visible;padding:0}
	.ucs-preview{border:0;border-radius:0;overflow:visible;position:relative;background:transparent}
	.ucs-preview{height:100%;min-height:0;display:flex;flex-direction:column}
	.ucs-toggle{display:flex;align-items:center;gap:var(--space-8);font-size:var(--fs-note);color:var(--muted)}
	.ucs-toggle button{border-radius:999px;border:1px solid rgba(255,255,255,.16);background:rgba(0,0,0,.18);color:var(--text);padding:8px 10px;font-size:var(--fs-note);cursor:pointer}
	.ucs-toggle button[aria-pressed="true"]{background:rgba(255,255,255,.12)}
	
		.ucs-canvas{position:relative;flex:1;min-height:0;display:flex;flex-direction:column;background:transparent;color:var(--ucs-text, #111);font-size:var(--ucs-type-body-size,13px);line-height:var(--ucs-type-body-lh,20px);font-weight:var(--ucs-type-body-weight,450)}
		.ucs-preview-scroll{
		  flex:1;
		  min-height:0;
			  overflow:auto;
			  scrollbar-gutter:stable;
			  display:grid;
			  grid-template-columns:repeat(var(--ucs-layout-grid-columns,2),minmax(0,1fr));
			  gap:var(--ucs-layout-grid-gutter,var(--ucs-space-grid-gap,14px));
			  grid-auto-flow:dense;
			  grid-auto-rows:4px;
			  padding:var(--ucs-space-canvas-top,40px) max(var(--ucs-layout-content-pad-x,var(--ucs-space-canvas-x,36px)), calc((100% - var(--ucs-layout-content-maxw, 100%)) / 2)) var(--ucs-space-canvas-bottom,56px);
			  color:var(--ucs-text, #111);
			  background:var(--ucs-bg, #F3F5FA);
			  overscroll-behavior:contain;
			}
		.ucs-frame,.ucs-card2,.ucs-layer-tile,.ucs-item,.ucs-input,.ucs-switch,.ucs-toast,.ucs-popover,.ucs-modal .dlg{
		  -webkit-mask-image:-webkit-radial-gradient(white, black);
		  mask-image:radial-gradient(#fff,#fff);
		}
		.ucs-frame{border-radius:var(--ucs-radius-card,22px);background:color-mix(in srgb, var(--ucs-surface) 88%, transparent);border:1px solid var(--ucs-border);box-shadow:var(--ucs-shadow-lg);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);overflow:hidden}
	.ucs-frame-inner{padding:18px 18px 16px}
	.ucs-top{display:flex;align-items:center;justify-content:space-between;gap:12px}
	.ucs-pill{display:inline-flex;align-items:center;gap:10px;border-radius:999px;padding:10px 12px;background:color-mix(in srgb, var(--ucs-surface) 88%, transparent);border:1px solid var(--ucs-border);box-shadow:none;color:var(--ucs-text)}
.ucs-icon{width:34px;height:34px;border-radius:999px;display:grid;place-items:center;background:color-mix(in srgb, var(--ucs-surface) 88%, transparent);border:1px solid var(--ucs-border);box-shadow:none}
.ucs-avatar{width:34px;height:34px;border-radius:999px;background:linear-gradient(135deg,color-mix(in srgb,var(--ucs-primary) 55%, #fff) 0%, color-mix(in srgb,var(--ucs-primary-50) 55%, #fff) 100%);border:1px solid var(--ucs-border);box-shadow:none}
.ucs-title{margin-top:14px;font-size:var(--ucs-type-display-size,30px);letter-spacing:.2px;font-weight:var(--ucs-type-display-weight,820);line-height:var(--ucs-type-display-lh,1.08)}
.ucs-subtitle{margin-top:8px;color:var(--ucs-text-2);font-size:var(--ucs-type-body-size,13px);line-height:var(--ucs-type-body-lh,1.4);font-weight:var(--ucs-type-body-weight,650)}
.ucs-hr{height:1px;background:var(--ucs-divider);margin:14px 0}
	.ucs-paragraph{margin-top:10px;color:var(--ucs-text-2);font-size:var(--ucs-type-body-size,13px);line-height:var(--ucs-type-body-lh,1.55);font-weight:var(--ucs-type-body-weight,450)}
.ucs-meta2{margin-top:10px;display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:var(--ucs-type-caption-size,12px);line-height:var(--ucs-type-caption-lh,normal);color:var(--ucs-text-3);font-weight:var(--ucs-type-caption-weight,650)}

	.ucs-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:var(--ucs-space-grid-gap,14px);margin-top:var(--ucs-space-canvas-gap,16px)}
	.ucs-card2{border-radius:var(--ucs-radius-card,22px);background:color-mix(in srgb, var(--ucs-surface) 92%, transparent);border:0;box-shadow:var(--ucs-shadow-sm);padding:var(--ucs-space-card-pad,14px)}
.ucs-card2.soft{box-shadow:var(--ucs-shadow-sm)}
	.ucs-card2.hero{grid-column:1 / -1}
.ucs-card2 .h{display:flex;align-items:center;justify-content:space-between;gap:12px}
.ucs-card2 .h .k{font-size:var(--ucs-type-title-size,18px);line-height:var(--ucs-type-title-lh,normal);font-weight:var(--ucs-type-title-weight,760);letter-spacing:.2px}
.ucs-card2 .h .s{color:var(--ucs-text-2);font-size:var(--ucs-type-caption-size,12px);line-height:var(--ucs-type-caption-lh,normal);font-weight:var(--ucs-type-caption-weight,650)}
.ucs-ring{margin-top:14px;display:grid;place-items:center}
.ucs-ring svg{width:170px;height:170px}
.ucs-legend{margin-top:12px;display:grid;gap:8px}
.ucs-leg{display:flex;align-items:center;justify-content:space-between;gap:10px}
.ucs-leg .l{display:flex;align-items:center;gap:10px;min-width:0}
.ucs-dot{width:10px;height:10px;border-radius:999px;background:var(--c);box-shadow:0 0 0 6px color-mix(in srgb, var(--c) 16%, transparent);border:1px solid color-mix(in srgb, var(--c) 70%, #000)}
.ucs-leg .t{font-size:var(--ucs-type-caption-size,12px);line-height:var(--ucs-type-caption-lh,normal);color:var(--ucs-text-2)}
.ucs-leg .v{font-size:var(--ucs-type-body-size,13px);line-height:var(--ucs-type-body-lh,normal);font-weight:760}

.ucs-list{margin-top:12px;display:grid;gap:10px}
	.ucs-item{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 12px;border-radius:var(--ucs-radius-control,18px);border:1px solid var(--ucs-border);background:color-mix(in srgb, var(--ucs-surface) 86%, transparent);box-shadow:none;position:relative;overflow:hidden}
.ucs-item .left{display:flex;align-items:center;gap:10px;min-width:0}
.ucs-badge{font-size:var(--ucs-type-caption-size,12px);line-height:var(--ucs-type-caption-lh,normal);border-radius:999px;padding:7px 10px;border:1px solid var(--ucs-border);color:var(--ucs-text)}
.ucs-badge.success{background:color-mix(in srgb, var(--ucs-success-bg) 100%, transparent);border-color:color-mix(in srgb, var(--ucs-success) 22%, var(--ucs-border));color:var(--ucs-success-text)}
.ucs-badge.warn{background:color-mix(in srgb, var(--ucs-warning-bg) 100%, transparent);border-color:color-mix(in srgb, var(--ucs-warning) 22%, var(--ucs-border));color:var(--ucs-warning-text)}
.ucs-badge.danger{background:color-mix(in srgb, var(--ucs-danger-bg) 100%, transparent);border-color:color-mix(in srgb, var(--ucs-danger) 22%, var(--ucs-border));color:var(--ucs-danger-text)}
.ucs-badge.info{background:color-mix(in srgb, var(--ucs-info-bg) 100%, transparent);border-color:color-mix(in srgb, var(--ucs-info) 22%, var(--ucs-border));color:var(--ucs-info-text)}
.ucs-item .ttl{font-size:var(--ucs-type-body-size,13px);line-height:var(--ucs-type-body-lh,normal);font-weight:760;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ucs-item .sub{font-size:var(--ucs-type-caption-size,12px);line-height:var(--ucs-type-caption-lh,normal);color:var(--ucs-text-2);white-space:nowrap}
.ucs-item .chk{width:18px;height:18px;border-radius:6px;border:1px solid var(--ucs-border);display:grid;place-items:center;color:var(--ucs-text);opacity:.55}
.ucs-item.hover::after{content:"";position:absolute;inset:0;background:var(--ucs-overlay-hover);pointer-events:none}

.ucs-tabs{margin-top:12px;display:flex;gap:6px;padding:6px;border-radius:999px;border:1px solid var(--ucs-border-muted);background:color-mix(in srgb, var(--ucs-surface) 84%, transparent);box-shadow:none}
.ucs-tab{flex:1 1 0;display:flex;align-items:center;justify-content:center;padding:10px 12px;border-radius:999px;font-size:var(--ucs-type-body-size,13px);line-height:var(--ucs-type-body-lh,normal);font-weight:760;color:var(--ucs-text-2);user-select:none}
.ucs-tab.on{background:linear-gradient(180deg, color-mix(in srgb, var(--ucs-primary-25) 78%, var(--ucs-surface) 22%), color-mix(in srgb, var(--ucs-surface) 68%, transparent));color:var(--ucs-text);box-shadow:inset 0 1px 0 rgba(255,255,255,.10)}

.ucs-datatable{margin-top:12px;border-radius:var(--ucs-radius-control,18px);overflow:hidden;border:1px solid var(--ucs-border-muted);background:color-mix(in srgb, var(--ucs-surface) 86%, transparent);box-shadow:none}
.ucs-datatable .r{display:grid;grid-template-columns:1.35fr 1fr auto;gap:12px;padding:10px 12px;align-items:center;min-width:0}
.ucs-datatable .r > span{justify-self:start;text-align:left}
.ucs-datatable .r .c3{justify-self:end}
.ucs-datatable .r.h > span:last-child{justify-self:end;text-align:right}
.ucs-datatable .r.h{font-size:var(--ucs-type-caption-size,12px);line-height:var(--ucs-type-caption-lh,normal);color:var(--ucs-text-3);font-weight:750;text-transform:uppercase;letter-spacing:.6px;background:color-mix(in srgb, var(--ucs-surface) 92%, transparent)}
.ucs-datatable .r + .r{border-top:1px solid var(--ucs-divider)}
.ucs-datatable .r.sel{background:color-mix(in srgb, var(--ucs-primary-25) 42%, var(--ucs-surface) 58%)}
.ucs-datatable .c1{font-weight:750;color:var(--ucs-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ucs-datatable .c2{color:var(--ucs-text-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ucs-datatable .c3{display:flex;justify-content:flex-end}

	.ucs-cta{margin-top:12px;display:flex;gap:10px;flex-wrap:wrap}
	.ucs-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:var(--ucs-radius-button,16px);padding:12px 14px;border:1px solid var(--ucs-border);background:transparent;color:var(--ucs-text);box-shadow:none;cursor:pointer;position:relative;overflow:visible}
	.ucs-btn::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;background:var(--ucs-overlay-hover);z-index:1;transition:opacity var(--ucs-motion-exit,180ms) var(--ucs-ease-exit,cubic-bezier(0.4, 0, 1, 1))}
	.ucs-btn.primary{background:var(--ucs-primary);border-color:transparent;color:var(--ucs-on-primary);box-shadow:none}
	.ucs-btn.hover::before{
		content:"";
		position:absolute;
	left:50%;
	top:50%;
	width:22px;
	height:22px;
	transform:translate(10px, -60%) rotate(-6deg);
	background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24'%3E%3Cpath d='M5.7 3.7l12 10.3c.5.4.2 1.2-.4 1.2h-4.6l1.8 4.2c.2.4 0 .8-.4 1l-2.1.9c-.4.2-.8 0-1-.4l-1.8-4.2-3.2 3.3c-.4.4-1.1.1-1.1-.5V4.3c0-.6.7-.9 1.1-.6z' fill='%23ffffff' fill-opacity='.92'/%3E%3Cpath d='M5.7 3.7l12 10.3c.5.4.2 1.2-.4 1.2h-4.6l1.8 4.2c.2.4 0 .8-.4 1l-2.1.9c-.4.2-.8 0-1-.4l-1.8-4.2-3.2 3.3c-.4.4-1.1.1-1.1-.5V4.3c0-.6.7-.9 1.1-.6z' fill='none' stroke='%230b1220' stroke-opacity='.28' stroke-width='1.2'/%3E%3C/svg%3E");
	background-repeat:no-repeat;
	background-size:contain;
		filter:drop-shadow(0 8px 18px rgba(0,0,0,.18));
		pointer-events:none;
		z-index:2;
	}
	.ucs-btn.hover::after{opacity:1;transition:opacity var(--ucs-motion-enter,220ms) var(--ucs-ease-enter,cubic-bezier(0, 0, 0.2, 1))}
	.ucs-btn:active{transform:translateY(1px)}

	.ucs-heatmap-months{margin-top:10px;display:flex;gap:10px;justify-content:space-between;font-size:var(--ucs-type-caption-size,12px);line-height:var(--ucs-type-caption-lh,normal);color:var(--ucs-text-2);opacity:.9;user-select:none}
	.ucs-year{display:flex;align-items:center;gap:10px;border-radius:999px;border:1px solid var(--ucs-border);background:color-mix(in srgb, var(--ucs-surface) 84%, transparent);padding:8px 10px;color:var(--ucs-text);box-shadow:none}
	.ucs-year button{appearance:none;-webkit-appearance:none;width:28px;height:28px;border-radius:calc(var(--ucs-radius-button,16px) - 4px);border:1px solid color-mix(in srgb, var(--ucs-border) 80%, transparent);background:transparent;color:var(--ucs-text);cursor:pointer}
	.ucs-year button:hover{background:color-mix(in srgb, var(--ucs-surface) 86%, transparent)}
	.ucs-year .y{font-weight:780;letter-spacing:.2px}
	
	.ucs-heatmap{
	  margin-top:12px;
	  display:grid;
	  grid-auto-flow:column;
	  grid-template-rows:repeat(7, 9px);
	  grid-auto-columns:9px;
	  gap:3px;
	  align-content:start;
	  --hm0: color-mix(in srgb, var(--ucs-border-muted) 68%, var(--ucs-surface) 32%);
	  --hm1: color-mix(in srgb, var(--ucs-primary-25) 72%, var(--ucs-surface) 28%);
	  --hm2: color-mix(in srgb, var(--ucs-primary-50) 72%, var(--ucs-surface) 28%);
	  --hm3: color-mix(in srgb, var(--ucs-primary-75) 74%, var(--ucs-surface) 26%);
	  --hm4: color-mix(in srgb, var(--ucs-primary) 78%, var(--ucs-surface) 22%);
	  --hm5: color-mix(in srgb, var(--ucs-primary-deep) 86%, var(--ucs-surface) 14%);
	}
	.ucs-heatmap .cell{width:9px;height:9px;border-radius:3px;border:1px solid color-mix(in srgb, var(--ucs-border) 18%, transparent);background:var(--hm0)}
	.ucs-heatmap .cell.lv0{background:var(--hm0)}
	.ucs-heatmap .cell.lv1{background:var(--hm1)}
	.ucs-heatmap .cell.lv2{background:var(--hm2)}
	.ucs-heatmap .cell.lv3{background:var(--hm3)}
	.ucs-heatmap .cell.lv4{background:var(--hm4)}
	.ucs-heatmap .cell.lv5{background:var(--hm5)}
	
	.ucs-heatmap-legend{margin-top:12px;display:flex;align-items:center;gap:10px;font-size:var(--ucs-type-caption-size,12px);line-height:var(--ucs-type-caption-lh,normal);color:var(--ucs-text-2)}
	.ucs-heatmap-legend .dots{display:flex;align-items:center;gap:6px}
	.ucs-heatmap-legend .dots .cell{width:9px;height:9px}
	
	.ucs-row2{display:contents}
	.ucs-layer-grid{margin-top:12px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--ucs-space-grid-gap,14px)}
	.ucs-layer-tile{border-radius:var(--ucs-radius-card,22px);border:1px solid var(--ucs-border);box-shadow:none;padding:var(--ucs-space-card-pad,14px);min-height:92px;display:flex;flex-direction:column;justify-content:space-between;min-width:0}
	.ucs-layer-tile.surface{background:color-mix(in srgb, var(--ucs-surface) 92%, transparent)}
	.ucs-layer-tile.elevated{background:color-mix(in srgb, var(--ucs-elevated) 92%, transparent);box-shadow:var(--ucs-shadow-md)}
	.ucs-layer-tile .k{font-weight:760;letter-spacing:.2px}
	.ucs-layer-tile .s{font-size:var(--ucs-type-caption-size,12px);line-height:var(--ucs-type-caption-lh,normal);color:var(--ucs-text-2)}
		.ucs-mini-list{margin-top:10px;border-radius:var(--ucs-radius-control,18px);border:1px solid var(--ucs-border-muted);overflow:hidden}
	.ucs-mini-list .r{padding:8px 10px;font-size:var(--ucs-type-caption-size,12px);line-height:var(--ucs-type-caption-lh,normal);color:var(--ucs-text);display:flex;align-items:center;justify-content:space-between;gap:10px}
	.ucs-mini-list .d{height:1px;background:var(--ucs-divider)}
	

		.ucs-form{margin-top:12px;display:grid;gap:12px}
		.ucs-field .lb{font-size:var(--ucs-type-caption-size,12px);line-height:var(--ucs-type-caption-lh,normal);color:var(--ucs-text-2);font-weight:650;margin-bottom:6px}
			.ucs-input{height:var(--ucs-control-height,44px);border-radius:min(var(--ucs-radius-control,18px),calc(var(--ucs-control-height,44px) / 2));border:1px solid var(--ucs-border-muted);background:color-mix(in srgb, var(--ucs-surface) 86%, transparent);padding:0 12px;display:flex;align-items:center;justify-content:space-between;gap:10px;box-shadow:none}
		.ucs-input.is-focus{
		  border-color:color-mix(in srgb, var(--ucs-primary) 46%, var(--ucs-border-muted));
		  box-shadow:0 0 0 4px color-mix(in srgb, var(--ucs-primary) 18%, transparent);
		}
		.ucs-input .ph{font-size:var(--ucs-type-body-size,13px);line-height:var(--ucs-type-body-lh,normal);color:var(--ucs-text-3)}
		.ucs-input .val{font-size:var(--ucs-type-body-size,13px);line-height:var(--ucs-type-body-lh,normal);color:var(--ucs-text);font-weight:var(--ucs-type-body-weight,450)}
			.ucs-input .tag{display:inline-flex;align-items:center;justify-content:center;height:28px;font-size:var(--ucs-type-caption-size,12px);line-height:var(--ucs-type-caption-lh,normal);color:var(--ucs-text-2);padding:0 10px;border-radius:999px;border:1px solid var(--ucs-border);background:color-mix(in srgb, var(--ucs-surface) 84%, transparent);transform:rotate(0deg);transform-origin:center;transition:transform 160ms ease}
		.ucs-input.is-open .tag{transform:rotate(180deg)}
		.ucs-input.is-disabled{opacity:.75;border-style:dashed;background:color-mix(in srgb, var(--ucs-border-muted) 18%, var(--ucs-surface) 82%)}
		.ucs-input.is-disabled .ph,.ucs-input.is-disabled .val{color:var(--ucs-text-3)}
		.ucs-input.is-disabled .tag{opacity:.7}
		.ucs-switch{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px;border-radius:var(--ucs-radius-control,18px);border:1px solid var(--ucs-border);background:color-mix(in srgb, var(--ucs-surface) 86%, transparent);box-shadow:none}
		.ucs-switch .meta{display:grid;gap:2px;min-width:0}
		.ucs-switch .meta .t{font-weight:760;color:var(--ucs-text)}
		.ucs-switch .meta .d{font-size:var(--ucs-type-caption-size,12px);line-height:var(--ucs-type-caption-lh,normal);color:var(--ucs-text-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
		.ucs-togglepill{width:46px;height:28px;border-radius:999px;border:1px solid var(--ucs-border);background:color-mix(in srgb, var(--ucs-primary-25) 42%, var(--ucs-surface) 58%);position:relative;box-shadow:none;flex:0 0 auto}
		.ucs-togglepill::after{content:"";position:absolute;top:3px;left:21px;width:22px;height:22px;border-radius:999px;background:var(--ucs-surface);box-shadow:none}
		.ucs-form-actions{display:flex;gap:10px;flex-wrap:wrap}

		.ucs-toast-list{margin-top:12px;display:grid;gap:10px}
		.ucs-toast{position:relative;overflow:hidden;border-radius:var(--ucs-radius-control,18px);border:1px solid var(--ucs-border);padding:12px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;box-shadow:none}
		.ucs-toast .t{font-weight:820;font-size:var(--ucs-type-body-size,13px);line-height:var(--ucs-type-body-lh,normal)}
		.ucs-toast .d{margin-top:3px;font-size:var(--ucs-type-caption-size,12px);line-height:var(--ucs-type-caption-lh,normal);color:var(--ucs-text-2)}
		.ucs-toast .x{width:28px;height:28px;border-radius:calc(var(--ucs-radius-button,16px) - 6px);border:1px solid color-mix(in srgb, var(--ucs-border) 70%, transparent);display:grid;place-items:center;color:var(--ucs-text-2);background:color-mix(in srgb, var(--ucs-surface) 86%, transparent);flex:0 0 auto}
		.ucs-toast.hover::after{content:"";position:absolute;inset:0;background:var(--ucs-overlay-hover);pointer-events:none}
		.ucs-toast.success{background:color-mix(in srgb, var(--ucs-success-bg) 100%, transparent);border-color:color-mix(in srgb, var(--ucs-success) 22%, var(--ucs-border))}
		.ucs-toast.success .t{color:var(--ucs-success-text)}
		.ucs-toast.warn{background:color-mix(in srgb, var(--ucs-warning-bg) 100%, transparent);border-color:color-mix(in srgb, var(--ucs-warning) 22%, var(--ucs-border))}
		.ucs-toast.warn .t{color:var(--ucs-warning-text)}
		.ucs-toast.danger{background:color-mix(in srgb, var(--ucs-danger-bg) 100%, transparent);border-color:color-mix(in srgb, var(--ucs-danger) 22%, var(--ucs-border))}
		.ucs-toast.danger .t{color:var(--ucs-danger-text)}
		.ucs-toast.info{background:color-mix(in srgb, var(--ucs-info-bg) 100%, transparent);border-color:color-mix(in srgb, var(--ucs-info) 22%, var(--ucs-border))}
		.ucs-toast.info .t{color:var(--ucs-info-text)}
		
		.ucs-type{margin-top:12px;display:grid;gap:8px}
		.ucs-type .t0{font-size:var(--ucs-type-display-size,30px);font-weight:var(--ucs-type-display-weight,820);line-height:var(--ucs-type-display-lh,1.08);letter-spacing:.2px;color:var(--ucs-text)}
		.ucs-type .t1{font-size:var(--ucs-type-title-size,16px);font-weight:var(--ucs-type-title-weight,820);line-height:var(--ucs-type-title-lh,normal);color:var(--ucs-text)}
		.ucs-type .t2{font-size:var(--ucs-type-body-size,13px);font-weight:var(--ucs-type-body-weight,inherit);line-height:var(--ucs-type-body-lh,1.4);color:var(--ucs-text-2)}
		.ucs-type .t3{font-size:var(--ucs-type-caption-size,12px);font-weight:var(--ucs-type-caption-weight,inherit);line-height:var(--ucs-type-caption-lh,normal);color:var(--ucs-text-3)}
		.ucs-type .link{font-size:var(--ucs-type-body-size,13px);font-weight:750;color:var(--ucs-text-brand)}
		.ucs-type .inverse{display:inline-flex;align-items:center;gap:8px;width:max-content;border-radius:var(--ucs-radius-button,16px);padding:9px 12px;background:var(--ucs-primary-deep);border:1px solid color-mix(in srgb, var(--ucs-primary-deep) 65%, var(--ucs-border));color:var(--ucs-text-inverse);box-shadow:none;font-size:var(--ucs-type-caption-size,12px);font-weight:750}
		.ucs-typo-grid{margin-top:12px;border-radius:var(--ucs-radius-control,18px);overflow:hidden;border:1px solid var(--ucs-border-muted);background:color-mix(in srgb, var(--ucs-surface) 86%, transparent)}
		.ucs-typo-grid .r{display:grid;grid-template-columns:1fr;gap:6px;align-items:start;padding:12px}
		.ucs-typo-grid .r + .r{border-top:1px solid var(--ucs-divider)}
		.ucs-typo-grid .lb{font-size:var(--ucs-type-caption-size,12px);line-height:var(--ucs-type-caption-lh,normal);color:var(--ucs-text-3);font-weight:760;text-transform:uppercase;letter-spacing:.6px;white-space:nowrap}
		.ucs-typo-grid .v{min-width:0;display:block}
		.ucs-typo-grid .v.txt{white-space:normal;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
		.ucs-typo-grid .v.txt.truncate{white-space:nowrap;display:block;-webkit-line-clamp:unset;text-overflow:ellipsis}
		.ucs-typo-grid .v.primary{color:var(--ucs-text);font-weight:var(--ucs-type-body-weight,450)}
		.ucs-typo-grid .v.secondary{color:var(--ucs-text-2)}
		.ucs-typo-grid .v.tertiary{color:var(--ucs-text-3)}
		.ucs-typo-grid .v.link{color:var(--ucs-text-brand);font-weight:750;text-decoration:underline;text-underline-offset:2px}
		.ucs-inline-code{display:inline-flex;align-items:center;border-radius:999px;padding:2px 8px;border:1px solid var(--ucs-border-muted);background:color-mix(in srgb, var(--ucs-surface) 86%, transparent);font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:11px;color:var(--ucs-text)}
		.ucs-text-samples{margin-top:12px;display:grid;gap:10px}
			.ucs-text-sample{display:flex;flex-direction:column;align-items:stretch;gap:6px;padding:12px;border-radius:var(--ucs-radius-control,18px);border:1px solid var(--ucs-border-muted);background:color-mix(in srgb, var(--ucs-surface) 86%, transparent);box-shadow:none;min-width:0}
		.ucs-text-sample .name{font-size:var(--ucs-type-caption-size,12px);font-weight:760;color:var(--ucs-text-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
		.ucs-text-sample .sample{width:100%;font-size:var(--ucs-type-body-size,13px);line-height:var(--ucs-type-body-lh,1.55);font-weight:var(--ucs-type-body-weight,450);white-space:normal;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}
		.ucs-text-sample.on-dark{border-color:color-mix(in srgb, var(--ucs-primary-deep) 60%, var(--ucs-border));background:var(--ucs-primary-deep);box-shadow:none}
		.ucs-text-sample.on-dark .name{color:color-mix(in srgb, var(--ucs-text-inverse) 78%, transparent)}
	
	.ucs-states{margin-top:12px;display:grid;gap:10px}
	.ucs-states .ucs-btn{width:100%;justify-content:center}
	.ucs-note{margin-top:10px;font-size:var(--ucs-type-caption-size,12px);line-height:var(--ucs-type-caption-lh,1.4);color:var(--ucs-text-2)}
	.ucs-note .code{display:inline-flex;align-items:center;border-radius:999px;padding:2px 8px;border:1px solid var(--ucs-border-muted);background:color-mix(in srgb, var(--ucs-surface) 86%, transparent);font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:11px;color:var(--ucs-text)}
			.ucs-btn.sm{height:var(--ucs-control-height,44px);padding:0 12px;border-radius:min(var(--ucs-radius-button,16px),calc(var(--ucs-control-height,44px) / 2));font-size:var(--ucs-type-body-size,13px);line-height:var(--ucs-type-body-lh,normal)}
	.ucs-btn.pressed::after{opacity:1;background:var(--ucs-overlay-pressed)}
	.ucs-btn:disabled{opacity:.55;cursor:not-allowed;box-shadow:none}
	.ucs-btn:disabled::after{content:none}
	.ucs-btn.primary:disabled{
	  opacity:1;
	  background:color-mix(in srgb, var(--ucs-primary) 42%, var(--ucs-surface) 58%);
	  border-color:color-mix(in srgb, var(--ucs-border) 72%, transparent);
	  color:color-mix(in srgb, var(--ucs-text) 62%, transparent);
	}
	
		.ucs-shadow-grid{margin-top:12px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--ucs-space-grid-gap,14px)}
		.ucs-shadow-card{border-radius:var(--ucs-radius-control,18px);border:1px solid var(--ucs-border);background:color-mix(in srgb, var(--ucs-surface) 92%, transparent);padding:var(--ucs-space-card-pad,14px);min-height:92px;display:flex;flex-direction:column;justify-content:space-between;min-width:0}
	.ucs-shadow-card.sm{box-shadow:var(--ucs-shadow-sm)}
	.ucs-shadow-card.md{box-shadow:var(--ucs-shadow-md)}
	.ucs-shadow-card.lg{box-shadow:var(--ucs-shadow-lg)}
	.ucs-shadow-card .k{font-weight:760;letter-spacing:.2px}
	.ucs-shadow-card .s{font-size:var(--ucs-type-caption-size,12px);line-height:var(--ucs-type-caption-lh,normal);color:var(--ucs-text-2)}

	.ucs-popover-demo{margin-top:12px;display:grid;gap:10px}
	.ucs-popover-demo .cap{display:flex;align-items:center;justify-content:space-between;gap:12px}
	.ucs-popover-demo .cap .k{font-size:var(--ucs-type-caption-size,12px);line-height:var(--ucs-type-caption-lh,normal);font-weight:760;letter-spacing:.2px}
	.ucs-popover-demo .cap .s{font-size:var(--ucs-type-caption-size,12px);line-height:var(--ucs-type-caption-lh,normal);color:var(--ucs-text-2)}
	.ucs-popover-demo .anchor{display:flex;gap:10px;flex-wrap:wrap}
	.ucs-popover{border-radius:var(--ucs-radius-control,18px);border:1px solid var(--ucs-border);background:color-mix(in srgb, var(--ucs-elevated) 92%, transparent);box-shadow:var(--ucs-shadow-md);padding:10px;display:grid;gap:6px}
	.ucs-popover .row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 10px;border-radius:calc(var(--ucs-radius-control,18px) - 4px);color:var(--ucs-text);border:1px solid transparent}
	.ucs-popover .row.on{background:color-mix(in srgb, var(--ucs-primary-25) 42%, var(--ucs-elevated) 58%);border-color:color-mix(in srgb, var(--ucs-primary) 18%, var(--ucs-border))}
	.ucs-popover .row .hint{font-size:var(--ucs-type-caption-size,12px);line-height:var(--ucs-type-caption-lh,normal);color:var(--ucs-text-2);font-variant-numeric:tabular-nums}
	.ucs-popover .sep{height:1px;background:var(--ucs-divider);margin:2px 6px}

	.ucs-focus{outline:2px solid color-mix(in srgb, var(--ucs-primary) 72%, #fff);outline-offset:4px}
	
		.ucs-modal{position:absolute;inset:0;display:grid;place-items:center;pointer-events:none}
	.ucs-modal .scrim{position:absolute;inset:0;background:var(--ucs-scrim);cursor:pointer;opacity:0;transition:opacity var(--ucs-motion-exit,180ms) var(--ucs-ease-exit,cubic-bezier(0.4, 0, 1, 1))}
		.ucs-modal .dlg{position:relative;width:min(520px,86%);border-radius:var(--ucs-radius-card,22px);background:var(--ucs-elevated);border:1px solid var(--ucs-border);box-shadow:var(--ucs-shadow-lg);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);padding:18px;opacity:0;transform:translateY(14px) scale(.985);transition:transform var(--ucs-motion-exit,180ms) var(--ucs-ease-exit,cubic-bezier(0.4, 0, 1, 1)),opacity var(--ucs-motion-exit,180ms) var(--ucs-ease-exit,cubic-bezier(0.4, 0, 1, 1))}
		.ucs-modal.is-on{pointer-events:auto}
	.ucs-modal.is-on .scrim{opacity:1;transition:opacity var(--ucs-motion-enter,220ms) var(--ucs-ease-enter,cubic-bezier(0, 0, 0.2, 1))}
		.ucs-modal.is-on .dlg{opacity:1;transform:translateY(0) scale(1);transition:transform var(--ucs-motion-enter,220ms) var(--ucs-ease-enter,cubic-bezier(0, 0, 0.2, 1)),opacity var(--ucs-motion-enter,220ms) var(--ucs-ease-enter,cubic-bezier(0, 0, 0.2, 1))}
		.ucs-modal .dlg .h{display:flex;align-items:center;justify-content:space-between;gap:12px}
			.ucs-modal .dlg .h .x{width:40px;height:40px;border-radius:var(--ucs-radius-button,16px);border:1px solid var(--ucs-border);background:color-mix(in srgb, var(--ucs-surface) 82%, transparent);display:grid;place-items:center;box-shadow:none;cursor:pointer}
	.ucs-modal .dlg .title{font-size:var(--ucs-type-title-size,18px);font-weight:var(--ucs-type-title-weight,820);line-height:var(--ucs-type-title-lh,normal)}
	.ucs-modal .dlg .p{margin-top:8px;color:var(--ucs-text-2);line-height:var(--ucs-type-body-lh,1.55);font-size:var(--ucs-type-body-size,13px);font-weight:var(--ucs-type-body-weight,inherit)}
.ucs-modal .dlg .bar{margin-top:14px;height:10px;border-radius:999px;background:color-mix(in srgb, var(--ucs-border) 35%, transparent);overflow:hidden;border:1px solid color-mix(in srgb, var(--ucs-border) 70%, transparent)}
.ucs-modal .dlg .bar > i{display:block;height:100%;width:46%;background:linear-gradient(90deg,var(--ucs-primary) 0%, var(--ucs-primary-75) 100%);border-radius:999px}

	.ucs-check{display:grid;place-items:center;opacity:.35;transition:opacity .15s ease}
	.ucs-row.token:hover .ucs-check{opacity:.9}
	.ucs-row.token.checked .ucs-check{opacity:1}
	.ucs-row.token.required .ucs-check{opacity:.45}
	.ucs-row.token.required:hover .ucs-check{opacity:.45}
	.ucs-row.token.required .ucs-check input{cursor:not-allowed}
	.ucs-check input{appearance:none;-webkit-appearance:none;width:16px;height:16px;border-radius:6px;border:1px solid rgba(255,255,255,.18);background:rgba(0,0,0,.18);display:grid;place-items:center;cursor:pointer}
		.ucs-check input:checked{background:rgba(255,255,255,.26);border-color:rgba(255,255,255,.42);background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18'%3E%3Cpath d='M4.2 9.4l2.4 2.6L13.8 5.8' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:center;background-size:11px 11px}
	.ucs-check input:focus-visible{outline:2px solid rgba(255,255,255,.18);outline-offset:2px}

		.ucs-token-pop{position:fixed;z-index:80;display:none;min-width:240px;max-width:380px;max-height:360px;overflow:hidden;border-radius:18px;border:1px solid rgba(255,255,255,.16);background:rgba(10,10,10,.78);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);box-shadow:0 24px 80px rgba(0,0,0,.55);color:var(--text);padding:12px}
		.ucs-token-pop .h{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px}
		.ucs-token-pop .ttl{font-size:12px;font-weight:860;letter-spacing:.3px;color:var(--text)}
		.ucs-token-pop .cnt{font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums}
		.ucs-token-pop .list{display:grid;gap:6px;max-height:300px;overflow:auto;padding-right:6px}
		.ucs-token-pop .it{appearance:none;-webkit-appearance:none;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);border-radius:14px;padding:10px 10px;display:flex;align-items:center;justify-content:space-between;gap:10px;color:var(--text);cursor:pointer;text-align:left}
		.ucs-token-pop .it:hover{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.18)}
		.ucs-token-pop .it:active{transform:translateY(1px)}
		.ucs-token-pop .it:focus-visible{outline:2px solid rgba(255,255,255,.18);outline-offset:2px}
		.ucs-token-pop .txt{min-width:0}
		.ucs-token-pop .id{font-size:12px;font-weight:820;letter-spacing:.2px;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
		.ucs-token-pop .meta{font-size:11px;color:var(--muted);margin-top:2px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
		.ucs-token-pop .tag{font-size:11px;font-weight:750;color:rgba(255,255,255,.75);border:1px solid rgba(255,255,255,.12);background:rgba(0,0,0,.18);padding:4px 8px;border-radius:999px;white-space:nowrap;flex:0 0 auto}
		.ucs-token-pop .more{appearance:none;-webkit-appearance:none;border:1px dashed rgba(255,255,255,.14);background:transparent;color:var(--muted);cursor:pointer;padding:10px;border-radius:14px;text-align:left;font-weight:650}
		.ucs-token-pop .more:hover{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.18);color:color-mix(in srgb, var(--muted) 70%, #fff 30%)}
		.ucs-token-pop-x{margin-left:auto;width:30px;height:30px;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);color:rgba(255,255,255,.85);display:grid;place-items:center;cursor:pointer}
		.ucs-token-pop-x:hover{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.18)}
		.ucs-token-pop-x:active{transform:translateY(1px)}
		.ucs-token-pop-x:focus-visible{outline:2px solid rgba(255,255,255,.18);outline-offset:2px}

		@media (max-width: 980px){
		  .ucs-root{grid-template-columns:1fr}
		}
		@media (max-width: 860px){
		  .ucs-preview-scroll{grid-template-columns:1fr}
		  .ucs-row2{grid-template-columns:1fr}
		  .ucs-layer-grid{grid-template-columns:1fr}
		  .ucs-shadow-grid{grid-template-columns:1fr 1fr}
		}
		`;

    const existing = document.getElementById(STYLE_ID);
    if (existing) {
      existing.textContent = cssText;
      return;
    }
    Kit.css.ensureStyleOnce(STYLE_ID, cssText);
  }

  function normalizeHex(input) {
    const raw = String(input || "").trim();
    const m = raw.match(/^#?([0-9a-fA-F]{6})$/);
    return m ? `#${m[1].toUpperCase()}` : null;
  }

  function normalizeAlpha(input, fallback = 1) {
    const n = typeof input === "number" ? input : parseFloat(String(input ?? ""));
    if (!Number.isFinite(n)) return fallback;
    return Kit.math.clamp(n, 0, 1);
  }

  function hexToSrgbComponents(hex) {
    const n = normalizeHex(hex);
    if (!n) return [0, 0, 0];
    const r = parseInt(n.slice(1, 3), 16);
    const g = parseInt(n.slice(3, 5), 16);
    const b = parseInt(n.slice(5, 7), 16);
    return [r / 255, g / 255, b / 255];
  }

  function srgbToLinear(u) {
    const x = Kit.math.clamp(u, 0, 1);
    return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }

  function linearToSrgb(u) {
    const x = Kit.math.clamp(u, 0, 1);
    return x <= 0.0031308 ? x * 12.92 : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
  }

  function relativeLuminance(hex) {
    const n = normalizeHex(hex);
    if (!n) return 0;
    const [r, g, b] = hexToSrgbComponents(n);
    const rl = srgbToLinear(r);
    const gl = srgbToLinear(g);
    const bl = srgbToLinear(b);
    return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
  }

  function contrastRatio(hexA, hexB) {
    const a = relativeLuminance(hexA);
    const b = relativeLuminance(hexB);
    const hi = Math.max(a, b);
    const lo = Math.min(a, b);
    return (hi + 0.05) / (lo + 0.05);
  }

  function toHexByte(u01) {
    const n = Kit.math.clamp(u01, 0, 1);
    const b = Math.round(n * 255);
    return b.toString(16).toUpperCase().padStart(2, "0");
  }

  function mixHex(hexA, hexB, t01) {
    const t = Kit.math.clamp(t01, 0, 1);
    const a = normalizeHex(hexA) || "#000000";
    const b = normalizeHex(hexB) || "#000000";
    const [ar, ag, ab] = hexToSrgbComponents(a);
    const [br, bg, bb] = hexToSrgbComponents(b);
    const arl = srgbToLinear(ar);
    const agl = srgbToLinear(ag);
    const abl = srgbToLinear(ab);
    const brl = srgbToLinear(br);
    const bgl = srgbToLinear(bg);
    const bbl = srgbToLinear(bb);
    const rl = arl * (1 - t) + brl * t;
    const gl = agl * (1 - t) + bgl * t;
    const bl = abl * (1 - t) + bbl * t;
    const r = linearToSrgb(rl);
    const g = linearToSrgb(gl);
    const b2 = linearToSrgb(bl);
    return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b2)}`;
  }

  function mixHexSrgb(hexA, hexB, t01) {
    const t = Kit.math.clamp(t01, 0, 1);
    const a = normalizeHex(hexA) || "#000000";
    const b = normalizeHex(hexB) || "#000000";
    const [ar, ag, ab] = hexToSrgbComponents(a);
    const [br, bg, bb] = hexToSrgbComponents(b);
    const r = ar * (1 - t) + br * t;
    const g = ag * (1 - t) + bg * t;
    const b2 = ab * (1 - t) + bb * t;
    return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b2)}`;
  }

  function rgbaCss(hex, alpha01) {
    const n = normalizeHex(hex) || "#000000";
    const [r, g, b] = hexToSrgbComponents(n);
    const a = normalizeAlpha(alpha01, 1);
    return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
  }

  function figmaVariableId(tokenId) {
    const Kit = window.DesignBookKit;
    const u32 = Kit?.rand?.hashStringToU32 ? Kit.rand.hashStringToU32(String(tokenId || "")) : Math.floor(Math.random() * 1e9);
    return `VariableID:0:${u32}`;
  }

  function asColorValue(v, fallbackHex, fallbackAlpha = 1) {
    if (v && typeof v === "object") {
      return { hex: normalizeHex(v.hex) || fallbackHex, alpha: normalizeAlpha(v.alpha, fallbackAlpha) };
    }
    const hex = normalizeHex(v) || fallbackHex;
    return { hex, alpha: fallbackAlpha };
  }

  function tokenType(token) {
    const t = String(token?.type || "");
    if (t === "number" || t === "shadow" || t === "string") return t;
    return "color";
  }

  function asNumberValue(v, fallback = 0) {
    const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
    if (!Number.isFinite(n)) return fallback;
    return n;
  }

  function asStringValue(v, fallback = "") {
    if (v === undefined || v === null) return fallback;
    return String(v);
  }

  function asShadowValue(v, fallback) {
    const base =
      fallback && typeof fallback === "object"
        ? fallback
        : { x: 0, y: 0, blur: 0, spread: 0, color: { hex: "#000000", alpha: 0.2 } };

    // Legacy: allow passing a color-like value as the shadow color.
    if (typeof v === "string" || (v && typeof v === "object" && "hex" in v && !("x" in v))) {
      return { ...base, color: asColorValue(v, base.color.hex, base.color.alpha) };
    }

    if (!v || typeof v !== "object") return base;
    const x = asNumberValue(v.x, base.x);
    const y = asNumberValue(v.y, base.y);
    const blur = Math.max(0, asNumberValue(v.blur, base.blur));
    const spread = asNumberValue(v.spread, base.spread);
    const color = asColorValue(v.color, base.color.hex, base.color.alpha);
    return { x, y, blur, spread, color };
  }

  function shadowCss(shadow) {
    const s = shadow && typeof shadow === "object" ? shadow : null;
    if (!s) return "none";
    const c = s.color && typeof s.color === "object" ? s.color : { hex: "#000000", alpha: 0.2 };
    return `${asNumberValue(s.x, 0)}px ${asNumberValue(s.y, 0)}px ${Math.max(0, asNumberValue(s.blur, 0))}px ${asNumberValue(
      s.spread,
      0
    )}px ${rgbaCss(c.hex, c.alpha)}`;
  }

  function computeColorValueFromSource(model, src, mode, seen) {
    if (!src) return { hex: "#000000", alpha: 1 };
    if (typeof src === "string" && src.trim().startsWith("#")) return { hex: normalizeHex(src) || "#000000", alpha: 1 };
    const id = String(src || "");
    const t = getToken(model, id);
    if (!t) return { hex: "#000000", alpha: 1 };
    return computeColorTokenValue(model, t, mode, seen);
  }

  function computeColorTokenValue(model, token, mode, seen = new Set()) {
    const id = String(token?.id || "");
    if (id) {
      if (seen.has(id)) return asColorValue(mode === "dark" ? token?.dark : token?.light, mode === "dark" ? "#FFFFFF" : "#000000", 1);
      seen.add(id);
    }

    if (token?.ref) {
      const refId = String(token.ref || "");
      if (!refId) return asColorValue(mode === "dark" ? token?.dark : token?.light, mode === "dark" ? "#FFFFFF" : "#000000", 1);
      const ref = getToken(model, refId);
      if (!ref) return asColorValue(mode === "dark" ? token?.dark : token?.light, mode === "dark" ? "#FFFFFF" : "#000000", 1);
      return computeColorTokenValue(model, ref, mode, seen);
    }

    if (token?.derive && typeof token.derive === "object") {
      const d = token.derive;
      if (d.type === "mix") {
        const a = computeColorValueFromSource(model, d.a, mode, seen);
        const b = computeColorValueFromSource(model, d.b, mode, seen);
        const t01 = normalizeAlpha(d.t, 0.5);
        const hex = mixHex(a.hex, b.hex, t01);
        const alpha = normalizeAlpha(d.alpha, 1);
        return { hex, alpha };
      }
    }

    const raw = mode === "dark" ? token?.dark : token?.light;
    return asColorValue(raw, mode === "dark" ? "#FFFFFF" : "#000000", 1);
  }

  function computeNumberTokenValue(model, token, mode, seen = new Set()) {
    const id = String(token?.id || "");
    if (id) {
      if (seen.has(id)) return asNumberValue(token?.value ?? token?.light ?? token?.dark, 0);
      seen.add(id);
    }
    if (token?.ref) {
      const refId = String(token.ref || "");
      if (!refId) return asNumberValue(token?.value ?? token?.light ?? token?.dark, 0);
      const ref = getToken(model, refId);
      if (!ref || tokenType(ref) !== "number") return asNumberValue(token?.value ?? token?.light ?? token?.dark, 0);
      return computeNumberTokenValue(model, ref, mode, seen);
    }
    const raw = token?.value ?? token?.light ?? token?.dark;
    return asNumberValue(raw, 0);
  }

  function computeStringTokenValue(model, token, mode, seen = new Set()) {
    const id = String(token?.id || "");
    if (id) {
      if (seen.has(id)) return asStringValue(token?.value ?? token?.light ?? token?.dark, "");
      seen.add(id);
    }
    if (token?.ref) {
      const refId = String(token.ref || "");
      if (!refId) return asStringValue(token?.value ?? token?.light ?? token?.dark, "");
      const ref = getToken(model, refId);
      if (!ref || tokenType(ref) !== "string") return asStringValue(token?.value ?? token?.light ?? token?.dark, "");
      return computeStringTokenValue(model, ref, mode, seen);
    }
    const raw = token?.value ?? token?.light ?? token?.dark;
    return asStringValue(raw, "");
  }

  function computeShadowTokenValue(model, token, mode, seen = new Set()) {
    const id = String(token?.id || "");
    if (id) {
      if (seen.has(id)) return asShadowValue(token?.value ?? token?.light ?? token?.dark, token?.value ?? token?.light ?? token?.dark);
      seen.add(id);
    }
    if (token?.ref) {
      const refId = String(token.ref || "");
      if (!refId) return asShadowValue(token?.value ?? token?.light ?? token?.dark, token?.value ?? token?.light ?? token?.dark);
      const ref = getToken(model, refId);
      if (!ref || tokenType(ref) !== "shadow") return asShadowValue(token?.value ?? token?.light ?? token?.dark, token?.value ?? token?.light ?? token?.dark);
      return computeShadowTokenValue(model, ref, mode, seen);
    }
    const fallback = asShadowValue(token?.value ?? token?.light ?? token?.dark, null);
    const raw = token?.value ?? token?.light ?? token?.dark;
    return asShadowValue(raw, fallback);
  }

  function computeTokenValueAny(model, token, mode, seen = new Set()) {
    const t = tokenType(token);
    if (t === "number") return computeNumberTokenValue(model, token, mode, seen);
    if (t === "string") return computeStringTokenValue(model, token, mode, seen);
    if (t === "shadow") return computeShadowTokenValue(model, token, mode, seen);
    return computeColorTokenValue(model, token, mode, seen);
  }

  function defaultModel() {
    return {
      version: 1,
      tokens: [
        {
          id: "primary",
          title: "主题色",
          group: "主题色",
          desc: "主色本身（按钮/选中/关键高亮）。",
          light: { hex: "#4F46E5", alpha: 1 },
          dark: { hex: "#8B5CF6", alpha: 1 },
          preview: true,
        },
        {
          id: "primary.25",
          title: "主题色 25%",
          group: "主题色",
          desc: "主色弱强度（覆盖感）。",
          derive: { type: "mix", a: "background.surface", b: "primary", t: 0.25 },
          preview: false,
        },
        {
          id: "primary.50",
          title: "主题色 50%",
          group: "主题色",
          desc: "主色中强度（覆盖感）。",
          derive: { type: "mix", a: "background.surface", b: "primary", t: 0.5 },
          preview: false,
        },
        {
          id: "primary.75",
          title: "主题色 75%",
          group: "主题色",
          desc: "主色较强（覆盖感）。",
          derive: { type: "mix", a: "background.surface", b: "primary", t: 0.75 },
          preview: false,
        },
        {
          id: "primary.deep",
          title: "主题色 Deep",
          group: "主题色",
          desc: "比主色更深（往更黑方向）。",
          derive: { type: "mix", a: "primary", b: "#000000", t: 0.22 },
          preview: false,
        },
        {
          id: "text.brand",
          title: "品牌文字",
          group: "文字色",
          desc: "用于链接/强调文案（= 主色）。",
          ref: "primary",
          preview: true,
        },
        {
          id: "text.black",
          title: "纯黑",
          group: "文字色",
          desc: "固定色（可跨模式一致）。",
          light: { hex: "#000000", alpha: 1 },
          dark: { hex: "#000000", alpha: 1 },
          preview: false,
        },
        {
          id: "text.white",
          title: "纯白",
          group: "文字色",
          desc: "固定色（可跨模式一致）。",
          light: { hex: "#FFFFFF", alpha: 1 },
          dark: { hex: "#FFFFFF", alpha: 1 },
          preview: false,
        },
        {
          id: "text.primary",
          title: "主文字",
          group: "文字色",
          desc: "正文/标题主文字（Role）。",
          light: { hex: "#1A1A1A", alpha: 1 },
          dark: { hex: "#E6E6E6", alpha: 1 },
          preview: true,
        },
        {
          id: "text.secondary",
          title: "次文字",
          group: "文字色",
          desc: "辅助说明（Role）。",
          light: { hex: "#4D4D4D", alpha: 1 },
          dark: { hex: "#B3B3B3", alpha: 1 },
          preview: true,
        },
        {
          id: "text.tertiary",
          title: "弱文字",
          group: "文字色",
          desc: "弱提示/占位（Role）。",
          light: { hex: "#808080", alpha: 1 },
          dark: { hex: "#808080", alpha: 1 },
          preview: false,
        },
        {
          id: "text.inverse",
          title: "反色文字",
          group: "文字色",
          desc: "深色底上的文字（Role）。",
          light: { hex: "#FFFFFF", alpha: 1 },
          dark: { hex: "#FFFFFF", alpha: 1 },
          preview: false,
        },
        {
          id: "background.base",
          title: "背景 Base",
          group: "结构层级色",
          desc: "地面（页面最底部背景）。",
          light: { hex: "#F3F5FA", alpha: 1 },
          dark: { hex: "#070A12", alpha: 1 },
          preview: true,
        },
        {
          id: "background.surface",
          title: "背景 Surface",
          group: "结构层级色",
          desc: "地摊/卡片（容器表面）。",
          light: { hex: "#FFFFFF", alpha: 1 },
          dark: { hex: "#0E1424", alpha: 1 },
          preview: true,
        },
        {
          id: "background.elevated",
          title: "背景 Elevated",
          group: "结构层级色",
          desc: "悬浮（弹窗/浮窗）。",
          light: { hex: "#FFFFFF", alpha: 1 },
          dark: { hex: "#111A30", alpha: 1 },
          preview: false,
        },
        {
          id: "border.default",
          title: "描边 Default",
          group: "结构层级色",
          desc: "常规描边。",
          light: { hex: "#E6E8F0", alpha: 1 },
          dark: { hex: "#223055", alpha: 1 },
          preview: true,
        },
        {
          id: "border.muted",
          title: "描边 Muted",
          group: "结构层级色",
          desc: "更弱描边。",
          light: { hex: "#EEF0F6", alpha: 1 },
          dark: { hex: "#1C2746", alpha: 1 },
          preview: false,
        },
        {
          id: "divider.default",
          title: "分割线 Default",
          group: "结构层级色",
          desc: "列表/区块分隔。",
          light: { hex: "#EEF0F6", alpha: 1 },
          dark: { hex: "#1C2746", alpha: 1 },
          preview: true,
        },
        {
          id: "overlay.hover",
          title: "叠加 Hover",
          group: "结构层级色",
          desc: "统一 hover 叠层。",
          light: { hex: "#000000", alpha: 0.1 },
          dark: { hex: "#FFFFFF", alpha: 0.1 },
          preview: true,
        },
        {
          id: "overlay.pressed",
          title: "叠加 Pressed",
          group: "结构层级色",
          desc: "按下叠层（更强）。",
          light: { hex: "#000000", alpha: 0.16 },
          dark: { hex: "#FFFFFF", alpha: 0.16 },
          preview: false,
        },
        {
          id: "overlay.scrim",
          title: "遮罩 Scrim",
          group: "结构层级色",
          desc: "弹窗遮罩。",
          light: { hex: "#000000", alpha: 0.45 },
          dark: { hex: "#000000", alpha: 0.55 },
          preview: false,
        },
        {
          id: "functional.success.default",
          title: "Success Default",
          group: "功能色",
          desc: "成功主色（驱动状态 bg/text 自动派生）。",
          light: { hex: "#16A34A", alpha: 1 },
          dark: { hex: "#22C55E", alpha: 1 },
          preview: true,
        },
        {
          id: "functional.warning.default",
          title: "Warning Default",
          group: "功能色",
          desc: "警告主色（驱动状态 bg/text 自动派生）。",
          light: { hex: "#D97706", alpha: 1 },
          dark: { hex: "#F59E0B", alpha: 1 },
          preview: true,
        },
        {
          id: "functional.danger.default",
          title: "Danger Default",
          group: "功能色",
          desc: "错误主色（驱动状态 bg/text 自动派生）。",
          light: { hex: "#DC2626", alpha: 1 },
          dark: { hex: "#F87171", alpha: 1 },
          preview: true,
        },
        {
          id: "functional.info.default",
          title: "Info Default",
          group: "功能色",
          desc: "信息主色（驱动状态 bg/text 自动派生）。",
          light: { hex: "#2563EB", alpha: 1 },
          dark: { hex: "#60A5FA", alpha: 1 },
          preview: false,
        },
        {
          id: "type.scale",
          title: "整体字号",
          type: "number",
          unit: "%",
          group: "文字",
          desc: "整体字号缩放（影响 Display/Title/Body/Caption 的字号与行高）。",
          light: 100,
          dark: 100,
          preview: true,
        },
        {
          id: "type.display.size",
          title: "Display 字号",
          type: "number",
          unit: "px",
          group: "文字 / Display",
          desc: "大标题字号（用于页面 Hero）。",
          light: 30,
          dark: 30,
          preview: true,
        },
        {
          id: "type.display.lineHeight",
          title: "Display 行高",
          type: "number",
          unit: "px",
          group: "文字 / Display",
          desc: "大标题行高（px）。",
          light: 32,
          dark: 32,
          preview: true,
        },
        {
          id: "type.display.weight",
          title: "Display 字重",
          type: "number",
          unit: "",
          group: "文字 / Display",
          desc: "大标题字重（建议 400–900）。",
          light: 820,
          dark: 820,
          preview: true,
        },
        {
          id: "type.title.size",
          title: "Title 字号",
          type: "number",
          unit: "px",
          group: "文字 / Title",
          desc: "标题字号（px）。",
          light: 16,
          dark: 16,
          preview: true,
        },
        {
          id: "type.title.lineHeight",
          title: "Title 行高",
          type: "number",
          unit: "px",
          group: "文字 / Title",
          desc: "标题行高（px）。",
          light: 20,
          dark: 20,
          preview: true,
        },
        {
          id: "type.title.weight",
          title: "Title 字重",
          type: "number",
          unit: "",
          group: "文字 / Title",
          desc: "标题字重（建议 400–900）。",
          light: 760,
          dark: 760,
          preview: true,
        },
        {
          id: "type.body.size",
          title: "Body 字号",
          type: "number",
          unit: "px",
          group: "文字 / Body",
          desc: "正文字号（px）。",
          light: 13,
          dark: 13,
          preview: true,
        },
        {
          id: "type.body.lineHeight",
          title: "Body 行高",
          type: "number",
          unit: "px",
          group: "文字 / Body",
          desc: "正文行高（px）。",
          light: 20,
          dark: 20,
          preview: true,
        },
        {
          id: "type.body.weight",
          title: "Body 字重",
          type: "number",
          unit: "",
          group: "文字 / Body",
          desc: "正文字重（建议 400–900）。",
          light: 450,
          dark: 450,
          preview: true,
        },
        {
          id: "type.caption.size",
          title: "Caption 字号",
          type: "number",
          unit: "px",
          group: "文字 / Caption",
          desc: "说明/注释字号（px）。",
          light: 12,
          dark: 12,
          preview: true,
        },
        {
          id: "type.caption.lineHeight",
          title: "Caption 行高",
          type: "number",
          unit: "px",
          group: "文字 / Caption",
          desc: "说明/注释行高（px）。",
          light: 16,
          dark: 16,
          preview: true,
        },
        {
          id: "type.caption.weight",
          title: "Caption 字重",
          type: "number",
          unit: "",
          group: "文字 / Caption",
          desc: "说明/注释字重（建议 400–900）。",
          light: 450,
          dark: 450,
          preview: true,
        },
        {
          id: "layout.content.maxWidth",
          title: "内容区最大宽度",
          type: "number",
          unit: "px",
          group: "布局 / 内容区",
          desc: "内容区最大宽度（px，0 表示不限制）。",
          light: 0,
          dark: 0,
          preview: true,
        },
        {
          id: "layout.content.paddingX",
          title: "内容区左右边距",
          type: "number",
          unit: "px",
          group: "布局 / 内容区",
          desc: "内容区左右边距（px）。",
          light: 16,
          dark: 16,
          preview: true,
        },
        {
          id: "layout.grid.columns",
          title: "网格列数",
          type: "number",
          unit: "",
          group: "布局 / 网格",
          desc: "网格列数（建议 2/3/4/12）。",
          light: 2,
          dark: 2,
          preview: true,
        },
        {
          id: "layout.grid.gutter",
          title: "网格 Gutter",
          type: "number",
          unit: "px",
          group: "布局 / 网格",
          desc: "网格列间距 gutter（px）。",
          light: 16,
          dark: 16,
          preview: true,
        },
	        {
	          id: "motion.duration.enter",
	          title: "进入时长",
	          type: "number",
	          unit: "ms",
	          group: "交互 / Duration",
	          desc: "进入/出现（hover in / modal open 等）。",
	          light: 220,
	          dark: 220,
	          preview: true,
	        },
	        {
	          id: "motion.duration.exit",
	          title: "退出时长",
	          type: "number",
	          unit: "ms",
	          group: "交互 / Duration",
	          desc: "退出/消失（hover out / modal close 等）。",
	          light: 180,
	          dark: 180,
	          preview: true,
	        },
	        {
	          id: "motion.easing.enter",
	          title: "进入曲线",
	          type: "string",
	          group: "交互 / Easing",
	          desc: "进入/出现的缓动曲线（CSS timing-function）。",
	          light: "cubic-bezier(0, 0, 0.2, 1)",
	          dark: "cubic-bezier(0, 0, 0.2, 1)",
	          preview: true,
	        },
	        {
	          id: "motion.easing.exit",
	          title: "退出曲线",
	          type: "string",
	          group: "交互 / Easing",
	          desc: "退出/消失的缓动曲线（CSS timing-function）。",
	          light: "cubic-bezier(0.4, 0, 1, 1)",
	          dark: "cubic-bezier(0.4, 0, 1, 1)",
	          preview: true,
	        },
	        {
	          id: "radius.card",
	          title: "卡片圆角",
          type: "number",
          group: "外观 / 圆角",
          desc: "预览卡片/容器圆角（px）。",
          light: 22,
          dark: 22,
          preview: true,
        },
        {
          id: "radius.control",
          title: "控件圆角",
          type: "number",
          group: "外观 / 圆角",
          desc: "输入框/列表/Toast 等（px）。",
          light: 18,
          dark: 18,
          preview: true,
        },
        {
          id: "radius.button",
          title: "按钮圆角",
          type: "number",
          group: "外观 / 圆角",
          desc: "按钮（px）。",
          light: 16,
          dark: 16,
          preview: true,
        },
        {
          id: "control.height",
          title: "控件高度",
          type: "number",
          unit: "px",
          group: "外观 / 控件",
          desc: "输入框/按钮/下拉等的统一高度（px）。",
          light: 44,
          dark: 44,
          preview: true,
        },
        {
          id: "space.canvas.paddingX",
          title: "画布左右内边距",
          type: "number",
          group: "布局 / 间距",
          desc: "预览画布左右 padding（px）。",
          light: 36,
          dark: 36,
          preview: true,
        },
        {
          id: "space.canvas.paddingTop",
          title: "画布上内边距",
          type: "number",
          group: "布局 / 间距",
          desc: "预览画布顶部 padding（px）。",
          light: 40,
          dark: 40,
          preview: true,
        },
        {
          id: "space.canvas.paddingBottom",
          title: "画布下内边距",
          type: "number",
          group: "布局 / 间距",
          desc: "预览画布底部 padding（px）。",
          light: 56,
          dark: 56,
          preview: true,
        },
        {
          id: "space.canvas.gap",
          title: "画布模块间距",
          type: "number",
          group: "布局 / 间距",
          desc: "预览画布模块间距 gap（px）。",
          light: 16,
          dark: 16,
          preview: true,
        },
        {
          id: "space.grid.gap",
          title: "网格间距",
          type: "number",
          group: "布局 / 间距",
          desc: "两列/多列卡片之间 gap（px）。",
          light: 14,
          dark: 14,
          preview: true,
        },
        {
          id: "space.card.padding",
          title: "卡片内边距",
          type: "number",
          group: "布局 / 间距",
          desc: "卡片内部 padding（px）。",
          light: 14,
          dark: 14,
          preview: true,
        },
        {
          id: "shadow.sm",
          title: "阴影 SM",
          type: "shadow",
          group: "外观 / 阴影",
          desc: "轻微抬升。",
          light: { x: 0, y: 12, blur: 28, spread: 0, color: { hex: "#0B1220", alpha: 0.12 } },
          dark: { x: 0, y: 12, blur: 28, spread: 0, color: { hex: "#000000", alpha: 0.5 } },
          preview: true,
        },
        {
          id: "shadow.md",
          title: "阴影 MD",
          type: "shadow",
          group: "外观 / 阴影",
          desc: "中抬升。",
          light: { x: 0, y: 18, blur: 44, spread: 0, color: { hex: "#0B1220", alpha: 0.16 } },
          dark: { x: 0, y: 18, blur: 44, spread: 0, color: { hex: "#000000", alpha: 0.6 } },
          preview: true,
        },
        {
          id: "shadow.lg",
          title: "阴影 LG",
          type: "shadow",
          group: "外观 / 阴影",
          desc: "强抬升。",
          light: { x: 0, y: 24, blur: 68, spread: 0, color: { hex: "#0B1220", alpha: 0.22 } },
          dark: { x: 0, y: 24, blur: 68, spread: 0, color: { hex: "#000000", alpha: 0.75 } },
          preview: true,
        },
      ],
    };
  }

  function loadModel() {
    const raw = Kit.storage.loadJson(STORAGE_KEY, null);
    const defaults = defaultModel();
    if (!raw || typeof raw !== "object" || raw.version !== 1 || !Array.isArray(raw.tokens)) return defaults;
    const rawMeta = raw.meta && typeof raw.meta === "object" ? raw.meta : null;

    const isDeprecatedTokenId = (id) => {
      const s = String(id || "");
      return /^text\d{3}$/.test(s) || /^functional\.(success|warning|danger|info)\.(bg|text)$/.test(s);
    };

	    const legacyIdMap = new Map([
	      ["theme.primary", "primary"],
	      ["primary.100", "primary"],
	      ["structure.background", "background.base"],
	      ["structure.surface", "background.surface"],
	      ["structure.border", "border.default"],
	      ["structure.onPrimary", "text.white"],
	      ["functional.success", "functional.success.default"],
	      ["functional.warning", "functional.warning.default"],
	      ["functional.danger", "functional.danger.default"],
	      ["motion.duration.normal", "motion.duration.enter"],
	      ["motion.duration.fast", "motion.duration.exit"],
	    ]);

    const rawById = new Map();
    for (const t of raw.tokens || []) {
      if (!t || typeof t !== "object") continue;
      const id = String(t.id || "");
      if (!id) continue;
      rawById.set(id, t);
      const mapped = legacyIdMap.get(id);
      if (mapped && !rawById.has(mapped)) rawById.set(mapped, t);
    }

    const merged = { version: 1, tokens: [], meta: rawMeta ? { ...rawMeta } : {} };
    for (const def of defaults.tokens) {
      const found = rawById.get(def.id);
      const next = { ...def };
      if (found && typeof found === "object") {
        // Preserve user-set values when possible.
        if (found.ref) {
          const refId = String(found.ref || "");
          if (refId && isDeprecatedTokenId(refId) && String(def.id || "").startsWith("text.")) {
            // Keep temporarily for legacy migration; will be inlined below.
            next.ref = refId;
          } else if (refId && !isDeprecatedTokenId(refId) && rawById.has(refId)) {
            next.ref = refId;
          }
        }
        if (found.preview !== undefined) next.preview = !!found.preview;
	        if (!next.ref && !next.derive) {
	          const t = tokenType(next);
	          if (t === "number") {
	            const dl = asNumberValue(def.light, 0);
	            const v = asNumberValue(found.light ?? found.value, dl);
	            next.light = v;
	            next.dark = v;
	          } else if (t === "string") {
	            const dl = asStringValue(def.light ?? def.value ?? def.dark, "");
	            const v = asStringValue(found.light ?? found.value ?? found.dark, dl);
	            next.light = v;
	            next.dark = v;
	          } else if (t === "shadow") {
	            const dl = asShadowValue(def.light, def.light);
	            const v = asShadowValue(found.light ?? found.value, dl);
	            next.light = v;
	            next.dark = v;
          } else {
            next.light = asColorValue(found.light, asColorValue(def.light, "#000000", 1).hex, asColorValue(def.light, "#000000", 1).alpha);
            next.dark = asColorValue(found.dark, asColorValue(def.dark, "#FFFFFF", 1).hex, asColorValue(def.dark, "#FFFFFF", 1).alpha);
          }
        }
      }
      merged.tokens.push(next);
    }

    // Migrate legacy text palette → role tokens (when role tokens weren't explicitly saved yet).
    const maybeSeedRoleFromLegacy = (roleId, legacyId) => {
      if (rawById.has(roleId)) return;
      const legacy = rawById.get(legacyId);
      if (!legacy || typeof legacy !== "object") return;
      const role = merged.tokens.find((t) => t.id === roleId);
      if (!role || role.ref || role.derive) return;
      role.light = asColorValue(legacy.light, asColorValue(role.light, "#000000", 1).hex, asColorValue(role.light, "#000000", 1).alpha);
      role.dark = asColorValue(legacy.dark, asColorValue(role.dark, "#FFFFFF", 1).hex, asColorValue(role.dark, "#FFFFFF", 1).alpha);
    };
    maybeSeedRoleFromLegacy("text.primary", "text100");
    maybeSeedRoleFromLegacy("text.secondary", "text300");
    maybeSeedRoleFromLegacy("text.tertiary", "text500");
    maybeSeedRoleFromLegacy("text.inverse", "text900");

    // Drop refs to deprecated text palette tokens (text100–text900), and inline their values.
    const inlineDeprecatedTextRef = (roleId, legacyId) => {
      const role = merged.tokens.find((t) => t && t.id === roleId);
      if (!role || !role.ref) return;
      const refId = String(role.ref || "");
      if (!isDeprecatedTokenId(refId)) return;
      const legacy = rawById.get(legacyId);
      if (legacy && typeof legacy === "object") {
        role.light = asColorValue(legacy.light, asColorValue(role.light, "#000000", 1).hex, asColorValue(role.light, "#000000", 1).alpha);
        role.dark = asColorValue(legacy.dark, asColorValue(role.dark, "#FFFFFF", 1).hex, asColorValue(role.dark, "#FFFFFF", 1).alpha);
      }
      delete role.ref;
    };
    inlineDeprecatedTextRef("text.primary", "text100");
    inlineDeprecatedTextRef("text.secondary", "text300");
    inlineDeprecatedTextRef("text.tertiary", "text500");
    inlineDeprecatedTextRef("text.inverse", "text900");

    // Preserve user-created tokens (e.g. custom text colors) that aren't in defaults.
    const existingIds = new Set(merged.tokens.map((t) => t.id));
    for (const t of raw.tokens || []) {
      if (!t || typeof t !== "object") continue;
      const id = String(t.id || "");
      if (!id || existingIds.has(id)) continue;
      if (isDeprecatedTokenId(id)) continue;

      const next = { ...t };
      next.id = id;
      next.title = String(t.title || id);
      next.group = String(t.group || "Color");
      if (t.desc !== undefined) next.desc = String(t.desc || "");
      if (t.ref !== undefined && t.ref !== null && String(t.ref || "")) {
        const refId = String(t.ref || "");
        if (refId && !isDeprecatedTokenId(refId)) next.ref = refId;
      }
      if (t.derive !== undefined && t.derive !== null && typeof t.derive === "object") next.derive = t.derive;
      if (t.preview !== undefined) next.preview = !!t.preview;
      else next.preview = false;
      if (t.custom !== undefined) next.custom = !!t.custom;
      else next.custom = true;
	      if (!next.ref && !next.derive) {
	        const tt = tokenType(next);
	        if (tt === "number") {
	          const v = asNumberValue(t.value ?? t.light ?? t.dark, 0);
	          next.light = v;
	          next.dark = v;
	        } else if (tt === "string") {
	          const v = asStringValue(t.value ?? t.light ?? t.dark, "");
	          next.light = v;
	          next.dark = v;
	        } else if (tt === "shadow") {
	          const v = asShadowValue(t.value ?? t.light ?? t.dark, null);
	          next.light = v;
	          next.dark = v;
        } else {
          next.light = asColorValue(t.light, "#000000", 1);
          next.dark = asColorValue(t.dark, "#FFFFFF", 1);
        }
      }

      merged.tokens.push(next);
      existingIds.add(id);
    }

    // Migration: make newly introduced foundation tokens visible by default (one-time).
    {
      const meta = merged.meta && typeof merged.meta === "object" ? merged.meta : {};
      const migrations = meta.migrations && typeof meta.migrations === "object" ? meta.migrations : {};
      const key = "uiDesignSystem.previewDefaults.v1";

      if (!migrations[key]) {
        for (const t of merged.tokens || []) {
          const id = String(t?.id || "");
          if (!id) continue;
          if (id.startsWith("type.") || id.startsWith("layout.") || id.startsWith("motion.")) t.preview = true;
        }
        migrations[key] = true;
        meta.migrations = migrations;
        merged.meta = meta;
        Kit.storage.saveJson(STORAGE_KEY, merged);
      }
    }

    // Migration: normalize overly-bold typography defaults (one-time).
    {
      const meta = merged.meta && typeof merged.meta === "object" ? merged.meta : {};
      const migrations = meta.migrations && typeof meta.migrations === "object" ? meta.migrations : {};
      const key = "uiDesignSystem.typographyWeights.v1";

      if (!migrations[key]) {
        const patchWeight = (id, from, to) => {
          const tok = merged.tokens.find((t) => String(t?.id || "") === id);
          if (!tok || tokenType(tok) !== "number") return false;
          const v = asNumberValue(tok.light ?? tok.value ?? tok.dark, NaN);
          if (!Number.isFinite(v) || v !== from) return false;
          tok.light = to;
          tok.dark = to;
          return true;
        };

        patchWeight("type.body.weight", 650, 450);
        patchWeight("type.caption.weight", 650, 450);

        migrations[key] = true;
        meta.migrations = migrations;
        merged.meta = meta;
        Kit.storage.saveJson(STORAGE_KEY, merged);
      }
    }

    // Always-on: typography tokens should map 1:1 to preview roles.
    {
      let changed = false;
      for (const t of merged.tokens || []) {
        const id = String(t?.id || "");
        if (!id.startsWith("type.")) continue;
        if (t.preview !== true) {
          t.preview = true;
          changed = true;
        }
      }
      if (changed) Kit.storage.saveJson(STORAGE_KEY, merged);
    }

    // Always-on: base structure tokens.
    {
      let changed = false;
      const required = new Set(["background.surface", "border.default", "divider.default"]);
      for (const t of merged.tokens || []) {
        const id = String(t?.id || "");
        if (!required.has(id)) continue;
        if (t.preview !== true) {
          t.preview = true;
          changed = true;
        }
      }
      if (changed) Kit.storage.saveJson(STORAGE_KEY, merged);
    }

    // Always-on: cards should always have padding.
    {
      let changed = false;
      for (const t of merged.tokens || []) {
        const id = String(t?.id || "");
        if (id !== "space.card.padding") continue;
        if (t.preview !== true) {
          t.preview = true;
          changed = true;
        }
      }
      if (changed) Kit.storage.saveJson(STORAGE_KEY, merged);
    }

    // Migration: seed typography scale + deltas (one-time).
    {
      const meta = merged.meta && typeof merged.meta === "object" ? merged.meta : {};
      const migrations = meta.migrations && typeof meta.migrations === "object" ? meta.migrations : {};
      const key = "uiDesignSystem.typographyScale.v1";

      if (!migrations[key]) {
        const bodyTok = getToken(merged, "type.body.size");
        const bodyCur =
          bodyTok && tokenType(bodyTok) === "number" ? asNumberValue(bodyTok.light ?? bodyTok.value ?? bodyTok.dark, TYPE_SCALE_BASE.body.size) : TYPE_SCALE_BASE.body.size;

        let scale = Math.round((asNumberValue(bodyCur, TYPE_SCALE_BASE.body.size) / TYPE_SCALE_BASE.body.size) * 100);
        scale = clampNumber(scale, TYPE_SCALE_MIN, TYPE_SCALE_MAX);

        const scaleTok = getToken(merged, "type.scale");
        if (scaleTok && tokenType(scaleTok) === "number" && !scaleTok.ref && !scaleTok.derive) {
          scaleTok.light = scale;
          scaleTok.dark = scale;
        }

        const deltas = {};
        for (const [role, base] of Object.entries(TYPE_SCALE_BASE)) {
          const sizeId = `type.${role}.size`;
          const lhId = `type.${role}.lineHeight`;
          const sizeTok = getToken(merged, sizeId);
          const lhTok = getToken(merged, lhId);
          const sizeCur =
            sizeTok && tokenType(sizeTok) === "number" ? asNumberValue(sizeTok.light ?? sizeTok.value ?? sizeTok.dark, base.size) : base.size;
          const lhCur =
            lhTok && tokenType(lhTok) === "number" ? asNumberValue(lhTok.light ?? lhTok.value ?? lhTok.dark, base.lineHeight) : base.lineHeight;

          const sizeBaseScaled = Math.round((base.size * scale) / 100);
          const lhBaseScaled = Math.round((base.lineHeight * scale) / 100);
          deltas[sizeId] = Math.round(sizeCur - sizeBaseScaled);
          deltas[lhId] = Math.round(lhCur - lhBaseScaled);
        }

        meta.typeDeltas = deltas;
        migrations[key] = true;
        meta.migrations = migrations;
        merged.meta = meta;
        Kit.storage.saveJson(STORAGE_KEY, merged);
      }
    }

    // Keep typography sizes in sync with type.scale + deltas.
    {
      const changed = applyTypeScaleToModel(merged);
      if (changed) Kit.storage.saveJson(STORAGE_KEY, merged);
    }

    return merged;
  }

  function saveModel(model) {
    Kit.storage.saveJson(STORAGE_KEY, model);
  }

  function getToken(model, id) {
    return model.tokens.find((t) => t.id === id) || null;
  }

  function readTokenValue(model, token, mode) {
    return computeTokenValueAny(model, token, mode);
  }

  const TYPE_SCALE_MIN = 80;
  const TYPE_SCALE_MAX = 140;
  const TYPE_SCALE_BASE = {
    display: { size: 30, lineHeight: 32 },
    title: { size: 16, lineHeight: 20 },
    body: { size: 13, lineHeight: 20 },
    caption: { size: 12, lineHeight: 16 },
  };
  const TYPE_SCALE_DELTA_LIMIT = { size: 4, lineHeight: 6 };

  const clampNumber = (n, min, max) => Math.min(max, Math.max(min, n));

  function getTypeScale(model, fallback = 100) {
    const t = getToken(model, "type.scale");
    if (!t || tokenType(t) !== "number") return fallback;
    const v = readTokenValue(model, t, "light");
    const n = typeof v === "number" && Number.isFinite(v) ? Math.round(v) : fallback;
    return clampNumber(n, TYPE_SCALE_MIN, TYPE_SCALE_MAX);
  }

  function isTypeScaledId(id) {
    const tid = String(id || "");
    return /^type\.(display|title|body|caption)\.(size|lineHeight)$/.test(tid);
  }

  function getTypeDeltas(model) {
    const meta = model && typeof model.meta === "object" ? model.meta : null;
    if (!meta) return {};
    const cur = meta.typeDeltas;
    if (cur && typeof cur === "object") return cur;
    const next = {};
    meta.typeDeltas = next;
    return next;
  }

  function setTypeScaledDeltaFromValue(model, id, desiredValue) {
    const tid = String(id || "");
    const m = /^type\.(display|title|body|caption)\.(size|lineHeight)$/.exec(tid);
    if (!m) return false;
    const role = m[1];
    const prop = m[2] === "size" ? "size" : "lineHeight";
    const desired = typeof desiredValue === "number" && Number.isFinite(desiredValue) ? Math.round(desiredValue) : null;
    if (desired === null) return false;

    const base = TYPE_SCALE_BASE?.[role]?.[prop];
    if (typeof base !== "number" || !Number.isFinite(base)) return false;

    const scale = getTypeScale(model, 100);
    const baseScaled = Math.round((base * scale) / 100);
    const deltaWanted = desired - baseScaled;
    const limit = prop === "size" ? TYPE_SCALE_DELTA_LIMIT.size : TYPE_SCALE_DELTA_LIMIT.lineHeight;
    const delta = clampNumber(deltaWanted, -limit, limit);

    const meta = model.meta && typeof model.meta === "object" ? model.meta : (model.meta = {});
    const deltas = getTypeDeltas(model);
    deltas[tid] = delta;
    meta.typeDeltas = deltas;
    return true;
  }

  function applyTypeScaleToModel(model) {
    if (!model || !Array.isArray(model.tokens)) return false;
    let changed = false;

    const scale = getTypeScale(model, 100);
    const scaleTok = getToken(model, "type.scale");
    if (scaleTok && tokenType(scaleTok) === "number" && !scaleTok.ref && !scaleTok.derive) {
      if (scaleTok.light !== scale || scaleTok.dark !== scale) {
        scaleTok.light = scale;
        scaleTok.dark = scale;
        changed = true;
      }
    }

    const deltas = getTypeDeltas(model);
    const setNum = (id, value) => {
      const tok = getToken(model, id);
      if (!tok || tokenType(tok) !== "number" || tok.ref || tok.derive) return;
      const v = Math.round(value);
      if (tok.light !== v || tok.dark !== v) {
        tok.light = v;
        tok.dark = v;
        changed = true;
      }
    };

    for (const [role, base] of Object.entries(TYPE_SCALE_BASE)) {
      if (!base) continue;
      const sizeBase = base.size;
      const lhBase = base.lineHeight;
      if (typeof sizeBase !== "number" || typeof lhBase !== "number") continue;
      const sizeId = `type.${role}.size`;
      const lhId = `type.${role}.lineHeight`;
      const sizeDelta = typeof deltas?.[sizeId] === "number" ? deltas[sizeId] : 0;
      const lhDelta = typeof deltas?.[lhId] === "number" ? deltas[lhId] : 0;
      const size = Math.round((sizeBase * scale) / 100) + Math.round(sizeDelta);
      const lh = Math.round((lhBase * scale) / 100) + Math.round(lhDelta);
      setNum(sizeId, size);
      setNum(lhId, lh);
    }

    return changed;
  }

  function applyPreviewVars(previewEl, model, mode, enabled) {
    const isDark = mode === "dark";
    const isEnabled = (id) => (enabled instanceof Set ? enabled.has(String(id || "")) : true);

    const pickColor = (id, fallbackHex, fallbackAlpha = 1) => {
      const t = getToken(model, id);
      if (!t || tokenType(t) !== "color") return { hex: fallbackHex, alpha: fallbackAlpha };
      const v = readTokenValue(model, t, mode);
      if (!v || typeof v !== "object" || typeof v.hex !== "string") return { hex: fallbackHex, alpha: fallbackAlpha };
      return asColorValue(v, fallbackHex, fallbackAlpha);
    };
	    const pickNumber = (id, fallback = 0) => {
	      const t = getToken(model, id);
	      if (!t || tokenType(t) !== "number") return fallback;
	      const v = readTokenValue(model, t, mode);
	      return typeof v === "number" && Number.isFinite(v) ? v : fallback;
	    };
	    const pickString = (id, fallback = "") => {
	      const t = getToken(model, id);
	      if (!t || tokenType(t) !== "string") return fallback;
	      const v = readTokenValue(model, t, mode);
	      return asStringValue(v, fallback);
	    };
	    const pickShadow = (id, fallback) => {
	      const t = getToken(model, id);
	      if (!t || tokenType(t) !== "shadow") return fallback;
	      const v = readTokenValue(model, t, mode);
	      return asShadowValue(v, fallback);
	    };

    const setHex = (name, v) => previewEl.style.setProperty(name, normalizeHex(v.hex) || v.hex);
    const setRgba = (name, v) => previewEl.style.setProperty(name, rgbaCss(v.hex, v.alpha));

	    const bg = isEnabled("background.base") ? pickColor("background.base", isDark ? "#070A12" : "#F3F5FA", 1) : { hex: isDark ? "#070A12" : "#F3F5FA", alpha: 1 };
	    const surface = isEnabled("background.surface") ? pickColor("background.surface", isDark ? "#0E1424" : "#FFFFFF", 1) : { hex: isDark ? "#0E1424" : "#FFFFFF", alpha: 1 };
	    const elevated = isEnabled("background.elevated") ? pickColor("background.elevated", isDark ? "#111A30" : "#FFFFFF", 1) : { hex: isDark ? "#111A30" : "#FFFFFF", alpha: 1 };
	    const border = isEnabled("border.default") ? pickColor("border.default", isDark ? "#223055" : "#E6E8F0", 1) : { hex: "rgba(0,0,0,0)", alpha: 1 };
	    const borderMuted = isEnabled("border.muted") ? pickColor("border.muted", isDark ? "#1C2746" : "#EEF0F6", 1) : { hex: "rgba(0,0,0,0)", alpha: 1 };
	    const divider = isEnabled("divider.default") ? pickColor("divider.default", isDark ? "#1C2746" : "#EEF0F6", 1) : { hex: "rgba(0,0,0,0)", alpha: 1 };
	    const primary25 = isEnabled("primary.25") ? pickColor("primary.25", isDark ? "#1D1633" : "#E9E7FF", 1) : { hex: isDark ? "#1D1633" : "#E9E7FF", alpha: 1 };
	    const primary50 = isEnabled("primary.50") ? pickColor("primary.50", isDark ? "#3A2B66" : "#C9C4FF", 1) : { hex: isDark ? "#3A2B66" : "#C9C4FF", alpha: 1 };
	    const primary75 = isEnabled("primary.75") ? pickColor("primary.75", isDark ? "#6A50CC" : "#8F86FF", 1) : { hex: isDark ? "#6A50CC" : "#8F86FF", alpha: 1 };
	    const primary = isEnabled("primary") ? pickColor("primary", isDark ? "#8B5CF6" : "#4F46E5", 1) : { hex: isDark ? "#8B5CF6" : "#4F46E5", alpha: 1 };
	    const primaryDeep = isEnabled("primary.deep") ? pickColor("primary.deep", mixHex(primary.hex, "#000000", 0.22), 1) : { hex: mixHex(primary.hex, "#000000", 0.22), alpha: 1 };
	    const onPrimary = isEnabled("text.inverse") ? pickColor("text.inverse", "#FFFFFF", 1) : { hex: "#FFFFFF", alpha: 1 };
	
	    setHex("--ucs-bg", bg);
	    setHex("--ucs-surface", surface);
	    setHex("--ucs-elevated", elevated);
	    setHex("--ucs-border", border);
	    setHex("--ucs-border-muted", borderMuted);
	    setHex("--ucs-divider", divider);
	    setHex("--ucs-primary-25", primary25);
	    setHex("--ucs-primary-50", primary50);
	    setHex("--ucs-primary-75", primary75);
	    setHex("--ucs-primary", primary);
	    setHex("--ucs-primary-deep", primaryDeep);
	    setHex("--ucs-on-primary", onPrimary);
	    setHex("--ucs-text", isEnabled("text.primary") ? pickColor("text.primary", isDark ? "#E6E6E6" : "#1A1A1A", 1) : { hex: isDark ? "#E6E6E6" : "#1A1A1A", alpha: 1 });
	    setHex("--ucs-text-2", isEnabled("text.secondary") ? pickColor("text.secondary", isDark ? "#B3B3B3" : "#4D4D4D", 1) : { hex: isDark ? "#B3B3B3" : "#4D4D4D", alpha: 1 });
	    setHex("--ucs-text-3", isEnabled("text.tertiary") ? pickColor("text.tertiary", isDark ? "#808080" : "#808080", 1) : { hex: isDark ? "#808080" : "#808080", alpha: 1 });
	    setHex("--ucs-text-inverse", isEnabled("text.inverse") ? pickColor("text.inverse", "#FFFFFF", 1) : { hex: "#FFFFFF", alpha: 1 });
	    setHex("--ucs-text-brand", isEnabled("text.brand") ? pickColor("text.brand", primary.hex, 1) : { hex: primary.hex, alpha: 1 });
	    setHex("--ucs-text-black", isEnabled("text.black") ? pickColor("text.black", "#000000", 1) : { hex: "#000000", alpha: 1 });
	    setHex("--ucs-text-white", isEnabled("text.white") ? pickColor("text.white", "#FFFFFF", 1) : { hex: "#FFFFFF", alpha: 1 });
	    setRgba("--ucs-overlay-hover", isEnabled("overlay.hover") ? pickColor("overlay.hover", isDark ? "#FFFFFF" : "#000000", 0.1) : { hex: "#000000", alpha: 0 });
	    setRgba("--ucs-overlay-pressed", isEnabled("overlay.pressed") ? pickColor("overlay.pressed", isDark ? "#FFFFFF" : "#000000", 0.16) : { hex: "#000000", alpha: 0 });
	    setRgba("--ucs-scrim", isEnabled("overlay.scrim") ? pickColor("overlay.scrim", "#000000", isDark ? 0.55 : 0.45) : { hex: "#000000", alpha: 0 });

    const shadowSm = pickShadow("shadow.sm", {
      x: 0,
      y: 12,
      blur: 28,
      spread: 0,
      color: { hex: isDark ? "#000000" : "#0B1220", alpha: isDark ? 0.5 : 0.12 },
    });
    const shadowMd = pickShadow("shadow.md", {
      x: 0,
      y: 18,
      blur: 44,
      spread: 0,
      color: { hex: isDark ? "#000000" : "#0B1220", alpha: isDark ? 0.6 : 0.16 },
    });
    const shadowLg = pickShadow("shadow.lg", {
      x: 0,
      y: 24,
      blur: 68,
      spread: 0,
      color: { hex: isDark ? "#000000" : "#0B1220", alpha: isDark ? 0.75 : 0.22 },
    });
    previewEl.style.setProperty("--ucs-shadow-sm", isEnabled("shadow.sm") ? shadowCss(shadowSm) : "none");
    previewEl.style.setProperty("--ucs-shadow-md", isEnabled("shadow.md") ? shadowCss(shadowMd) : "none");
    previewEl.style.setProperty("--ucs-shadow-lg", isEnabled("shadow.lg") ? shadowCss(shadowLg) : "none");

    const radiusCard = pickNumber("radius.card", 22);
    const radiusControl = pickNumber("radius.control", 18);
    const radiusButton = pickNumber("radius.button", 16);
    previewEl.style.setProperty("--ucs-radius-card", isEnabled("radius.card") ? `${radiusCard}px` : "0px");
    previewEl.style.setProperty("--ucs-radius-control", isEnabled("radius.control") ? `${radiusControl}px` : "0px");
    previewEl.style.setProperty("--ucs-radius-button", isEnabled("radius.button") ? `${radiusButton}px` : "0px");

    const spaceCanvasX = pickNumber("space.canvas.paddingX", 36);
    const spaceCanvasTop = pickNumber("space.canvas.paddingTop", 40);
    const spaceCanvasBottom = pickNumber("space.canvas.paddingBottom", 56);
    const spaceCanvasGap = pickNumber("space.canvas.gap", 16);
    const spaceGridGap = pickNumber("space.grid.gap", 14);
    const spaceCardPad = pickNumber("space.card.padding", 14);
    previewEl.style.setProperty("--ucs-space-canvas-x", isEnabled("space.canvas.paddingX") ? `${spaceCanvasX}px` : "0px");
    previewEl.style.setProperty("--ucs-space-canvas-top", isEnabled("space.canvas.paddingTop") ? `${spaceCanvasTop}px` : "0px");
    previewEl.style.setProperty("--ucs-space-canvas-bottom", isEnabled("space.canvas.paddingBottom") ? `${spaceCanvasBottom}px` : "0px");
    previewEl.style.setProperty("--ucs-space-canvas-gap", isEnabled("space.canvas.gap") ? `${spaceCanvasGap}px` : "0px");
    previewEl.style.setProperty("--ucs-space-grid-gap", isEnabled("space.grid.gap") ? `${spaceGridGap}px` : "0px");
    previewEl.style.setProperty("--ucs-space-card-pad", isEnabled("space.card.padding") ? `${spaceCardPad}px` : "0px");

    const setNumVar = (cssName, tokenId) => {
      if (isEnabled(tokenId)) previewEl.style.setProperty(cssName, String(pickNumber(tokenId, 0)));
      else previewEl.style.removeProperty(cssName);
    };
    const setPxVar = (cssName, tokenId) => {
      if (isEnabled(tokenId)) previewEl.style.setProperty(cssName, `${pickNumber(tokenId, 0)}px`);
      else previewEl.style.removeProperty(cssName);
    };
	    const setMsVar = (cssName, tokenId) => {
	      if (isEnabled(tokenId)) previewEl.style.setProperty(cssName, `${pickNumber(tokenId, 0)}ms`);
	      else previewEl.style.removeProperty(cssName);
	    };
	    const setStrVar = (cssName, tokenId) => {
	      if (!isEnabled(tokenId)) {
	        previewEl.style.removeProperty(cssName);
	        return;
	      }
	      const v = pickString(tokenId, "");
	      if (v) previewEl.style.setProperty(cssName, v);
	      else previewEl.style.removeProperty(cssName);
	    };

    // Typography
    setPxVar("--ucs-type-display-size", "type.display.size");
    setPxVar("--ucs-type-display-lh", "type.display.lineHeight");
    setNumVar("--ucs-type-display-weight", "type.display.weight");
    setPxVar("--ucs-type-title-size", "type.title.size");
    setPxVar("--ucs-type-title-lh", "type.title.lineHeight");
    setNumVar("--ucs-type-title-weight", "type.title.weight");
    setPxVar("--ucs-type-body-size", "type.body.size");
    setPxVar("--ucs-type-body-lh", "type.body.lineHeight");
    setNumVar("--ucs-type-body-weight", "type.body.weight");
    setPxVar("--ucs-type-caption-size", "type.caption.size");
    setPxVar("--ucs-type-caption-lh", "type.caption.lineHeight");
    setNumVar("--ucs-type-caption-weight", "type.caption.weight");

    // Control
    setPxVar("--ucs-control-height", "control.height");

    // Layout
    setPxVar("--ucs-layout-content-pad-x", "layout.content.paddingX");
    setNumVar("--ucs-layout-grid-columns", "layout.grid.columns");
    setPxVar("--ucs-layout-grid-gutter", "layout.grid.gutter");
    const maxWidth = pickNumber("layout.content.maxWidth", 0);
    if (isEnabled("layout.content.maxWidth") && maxWidth > 0) previewEl.style.setProperty("--ucs-layout-content-maxw", `${maxWidth}px`);
    else previewEl.style.removeProperty("--ucs-layout-content-maxw");

	    // Motion
	    setMsVar("--ucs-motion-enter", "motion.duration.enter");
	    setMsVar("--ucs-motion-exit", "motion.duration.exit");
	    setStrVar("--ucs-ease-enter", "motion.easing.enter");
	    setStrVar("--ucs-ease-exit", "motion.easing.exit");

    const success = isEnabled("functional.success.default") ? pickColor("functional.success.default", isDark ? "#22C55E" : "#16A34A", 1) : { hex: isDark ? "#22C55E" : "#16A34A", alpha: 1 };
    const warning = isEnabled("functional.warning.default") ? pickColor("functional.warning.default", isDark ? "#F59E0B" : "#D97706", 1) : { hex: isDark ? "#F59E0B" : "#D97706", alpha: 1 };
    const danger = isEnabled("functional.danger.default") ? pickColor("functional.danger.default", isDark ? "#F87171" : "#DC2626", 1) : { hex: isDark ? "#F87171" : "#DC2626", alpha: 1 };
    const info = isEnabled("functional.info.default") ? pickColor("functional.info.default", isDark ? "#60A5FA" : "#2563EB", 1) : { hex: isDark ? "#60A5FA" : "#2563EB", alpha: 1 };

    const deriveFunctionalBg = (accentHex) => {
      const accent = normalizeHex(accentHex) || "#000000";
      if (!isDark) return mixHexSrgb(surface.hex, accent, 0.09);
      // Dark mode: neutralize surface a bit to avoid hue drifting too much.
      const bgBase = mixHexSrgb(surface.hex, "#000000", 0.7);
      return mixHexSrgb(bgBase, accent, 0.18);
    };

    const deriveFunctionalText = (accentHex, bgHex) => {
      const accent = normalizeHex(accentHex) || "#000000";
      const bg2 = normalizeHex(bgHex) || "#000000";
      const toward = isDark ? "#FFFFFF" : "#000000";
      const target = 4.5;
      for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const cand = mixHexSrgb(accent, toward, t);
        if (contrastRatio(cand, bg2) >= target) return cand;
      }
      return toward;
    };

    const successBg = deriveFunctionalBg(success.hex);
    const warningBg = deriveFunctionalBg(warning.hex);
    const dangerBg = deriveFunctionalBg(danger.hex);
    const infoBg = deriveFunctionalBg(info.hex);

    setHex("--ucs-success", success);
    setHex("--ucs-warning", warning);
    setHex("--ucs-danger", danger);
    setHex("--ucs-info", info);
    setHex("--ucs-success-bg", { hex: successBg, alpha: 1 });
    setHex("--ucs-warning-bg", { hex: warningBg, alpha: 1 });
    setHex("--ucs-danger-bg", { hex: dangerBg, alpha: 1 });
    setHex("--ucs-info-bg", { hex: infoBg, alpha: 1 });
    setHex("--ucs-success-text", { hex: deriveFunctionalText(success.hex, successBg), alpha: 1 });
    setHex("--ucs-warning-text", { hex: deriveFunctionalText(warning.hex, warningBg), alpha: 1 });
    setHex("--ucs-danger-text", { hex: deriveFunctionalText(danger.hex, dangerBg), alpha: 1 });
    setHex("--ucs-info-text", { hex: deriveFunctionalText(info.hex, infoBg), alpha: 1 });
  }

  function figmaVariablesModeExport(model, modeName, which) {
    const out = {};
    for (const t of model.tokens) {
      if (tokenType(t) !== "color") continue;
      const name = String(t.title || t.id);
      const v = readTokenValue(model, t, which);
      const hex = normalizeHex(v.hex) || (which === "dark" ? "#FFFFFF" : "#000000");
      out[name] = {
        $type: "color",
        $value: {
          colorSpace: "srgb",
          components: hexToSrgbComponents(hex),
          alpha: normalizeAlpha(v.alpha, 1),
          hex,
        },
        $extensions: {
          "com.figma.variableId": figmaVariableId(t.id),
          "com.figma.hiddenFromPublishing": true,
          "com.figma.scopes": ["ALL_SCOPES"],
          "com.figma.isOverride": true,
        },
      };
    }
    out.$extensions = { "com.figma.modeName": String(modeName || "") || "Mode 1" };
    return out;
  }

  function downloadJson(filename, obj) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  DesignBook.registerModule(MODULE_KEY, {
    mount: async ({ contentEl, panelEl, actionsEl, setPanelTitle }) => {
      ensureStyles();
      setPanelTitle("UI 设计系统");

		      let model = loadModel();
		      let mode = "light";
		      let editorTab = "color";
		      let suppressEditorSelectUntil = 0;
			      let uiState = Kit.storage.loadJson(UI_STATE_KEY, { collapsed: {} }) || { collapsed: {} };
		      if (!uiState || typeof uiState !== "object") uiState = { collapsed: {} };
			      if (!uiState.collapsed || typeof uiState.collapsed !== "object") uiState.collapsed = {};
			      if (!uiState.editor || typeof uiState.editor !== "object") uiState.editor = {};
			      if (!uiState.layout || typeof uiState.layout !== "object") uiState.layout = {};

			      const USE_TYPE_DISPLAY = "type.display.size type.display.lineHeight type.display.weight";
			      const USE_TYPE_TITLE = "type.title.size type.title.lineHeight type.title.weight";
			      const USE_TYPE_BODY = "type.body.size type.body.lineHeight type.body.weight";
			      const USE_TYPE_CAPTION = "type.caption.size type.caption.lineHeight type.caption.weight";
			      const USE_TYPE_DISPLAY2 = "type.display.size type.display.lineHeight";
			      const USE_TYPE_TITLE2 = "type.title.size type.title.lineHeight";
			      const USE_TYPE_BODY2 = "type.body.size type.body.lineHeight";
			      const USE_TYPE_CAPTION2 = "type.caption.size type.caption.lineHeight";

		      contentEl.innerHTML = `
	        <div class="ucs-root">
	          <section class="ucs-preview-wrap">
	            <div class="ucs-card ucs-preview-card">
	              <header class="ucs-card-h">
	                <div class="ucs-card-t">预览</div>
	                <div class="ucs-toggle" role="group" aria-label="预览模式">
	                  <button type="button" data-mode="light" aria-pressed="true">亮色</button>
	                  <button type="button" data-mode="dark" aria-pressed="false">暗色</button>
	                </div>
	              </header>
	              <div class="ucs-card-b">
	                <div class="ucs-preview" data-preview>
		                  <div class="ucs-canvas">
			                    <div class="ucs-preview-scroll" data-preview-scroll data-uses="background.base">
		                      <div class="ucs-card2 hero" data-needs-any="background.surface border.default text.primary text.secondary primary">
		                        <div class="ucs-top" data-needs-any="background.surface border.default text.primary">
		                          <div class="ucs-pill">
		                            <span style="opacity:.7">←</span>
		                            <span style="font-weight:750">Back</span>
		                          </div>
		                          <div style="display:flex;align-items:center;gap:10px">
		                            <div class="ucs-icon">⋯</div>
		                            <div class="ucs-avatar"></div>
		                          </div>
		                        </div>
		
			                        <div class="ucs-title" data-needs="text.primary" data-uses="text.primary ${USE_TYPE_DISPLAY}">Welcome Back</div>
			                        <div class="ucs-subtitle" data-needs="text.secondary" data-uses="text.secondary ${USE_TYPE_BODY}">Your weekly summary is ready.</div>
			                        <div class="ucs-cta" data-needs-any="primary border.default text.primary">
			                          <button class="ucs-btn primary sm" type="button" data-needs="primary" data-uses="primary ${USE_TYPE_BODY}">Primary</button>
			                          <button class="ucs-btn sm" type="button" data-needs="border.default text.primary" data-uses="border.default text.primary ${USE_TYPE_BODY}">Ghost</button>
			                        </div>
		                      </div>
		
		                      <div class="ucs-row2">
			                        <div class="ucs-card2" data-needs-any="primary primary.25 primary.50 primary.75">
			                          <div class="h">
			                            <div class="k" data-uses="text.primary ${USE_TYPE_TITLE}">Dashboard</div>
			                            <div class="s" data-uses="text.secondary ${USE_TYPE_CAPTION}">Progress</div>
			                          </div>
		                          <div class="ucs-ring" data-needs="primary">
		                            <svg viewBox="0 0 120 120" aria-hidden="true">
		                              <circle cx="60" cy="60" r="46" fill="none" stroke="color-mix(in srgb, var(--ucs-border) 52%, transparent)" stroke-width="12"/>
		                              <circle cx="60" cy="60" r="46" fill="none" stroke="var(--ucs-primary)" stroke-width="12" stroke-linecap="round"
		                                stroke-dasharray="140 289" transform="rotate(-90 60 60)"/>
		                            </svg>
		                          </div>
		                          <div class="ucs-legend" data-needs-any="primary.25 primary.50 primary.75">
		                            <div class="ucs-leg" data-needs="primary.25">
			                              <div class="l"><span class="ucs-dot" style="--c:var(--ucs-primary-25)"></span><span class="t" data-uses="text.secondary ${USE_TYPE_CAPTION2}">25%</span></div>
			                              <div class="v" data-uses="text.primary ${USE_TYPE_BODY2}">25%</div>
			                            </div>
		                            <div class="ucs-leg" data-needs="primary.50">
			                              <div class="l"><span class="ucs-dot" style="--c:var(--ucs-primary-50)"></span><span class="t" data-uses="text.secondary ${USE_TYPE_CAPTION2}">50%</span></div>
			                              <div class="v" data-uses="text.primary ${USE_TYPE_BODY2}">50%</div>
			                            </div>
		                            <div class="ucs-leg" data-needs="primary.75">
			                              <div class="l"><span class="ucs-dot" style="--c:var(--ucs-primary-75)"></span><span class="t" data-uses="text.secondary ${USE_TYPE_CAPTION2}">75%</span></div>
			                              <div class="v" data-uses="text.primary ${USE_TYPE_BODY2}">75%</div>
			                            </div>
		                          </div>
		                        </div>
		
				                        <div class="ucs-card2" data-needs="border.default border.muted divider.default text.primary text.secondary text.tertiary primary background.surface">
				                          <div class="h">
				                            <div class="k" data-uses="text.primary ${USE_TYPE_TITLE}">输入框相关</div>
				                            <div class="s" data-uses="text.secondary ${USE_TYPE_CAPTION}">状态列表</div>
				                          </div>
			                          <div class="ucs-form">
				                            <div class="ucs-field" data-needs="text.secondary text.tertiary border.muted">
				                              <div class="lb" data-uses="text.secondary ${USE_TYPE_CAPTION2}">未输入（占位）</div>
				                              <div class="ucs-input">
				                                <span class="ph" data-uses="text.tertiary ${USE_TYPE_BODY2}">请输入邮箱（name@example.com）</span>
				                                <span class="tag" data-uses="text.secondary ${USE_TYPE_CAPTION2}">⌘K</span>
				                              </div>
				                            </div>
				                            <div class="ucs-field" data-needs="text.secondary text.tertiary border.muted">
				                              <div class="lb" data-uses="text.secondary ${USE_TYPE_CAPTION2}">点击输入（Focus）</div>
				                              <div class="ucs-input is-focus" data-needs="primary">
				                                <span class="ph" data-uses="text.tertiary ${USE_TYPE_BODY2}">name@example.com</span>
				                                <span class="tag" data-uses="text.secondary ${USE_TYPE_CAPTION2}">Focus</span>
				                              </div>
				                            </div>
				                            <div class="ucs-field" data-needs="text.secondary text.tertiary border.muted">
				                              <div class="lb" data-uses="text.secondary ${USE_TYPE_CAPTION2}">已输入（Filled）</div>
				                              <div class="ucs-input">
				                                <span class="val" data-needs="text.primary" data-uses="text.primary ${USE_TYPE_BODY}">zhanghao@haao.design</span>
				                                <span class="tag" data-uses="text.secondary ${USE_TYPE_CAPTION2}">✓</span>
				                              </div>
				                            </div>
				                            <div class="ucs-field" data-needs="text.secondary text.tertiary border.muted">
				                              <div class="lb" data-uses="text.secondary ${USE_TYPE_CAPTION2}">下拉框（Idle）</div>
				                              <div class="ucs-input">
				                                <span class="val" data-needs="text.primary" data-uses="text.primary ${USE_TYPE_BODY}">Pro（Monthly）</span>
				                                <span class="tag" data-uses="text.secondary ${USE_TYPE_CAPTION2}">▾</span>
				                              </div>
				                            </div>
				                            <div class="ucs-field" data-needs="text.secondary text.tertiary border.muted">
				                              <div class="lb" data-uses="text.secondary ${USE_TYPE_CAPTION2}">下拉框（点击）</div>
				                              <div class="ucs-input is-focus is-open" data-needs="primary">
				                                <span class="val" data-needs="text.primary" data-uses="text.primary ${USE_TYPE_BODY}">Pro（Monthly）</span>
				                                <span class="tag" data-uses="text.secondary ${USE_TYPE_CAPTION2}">▾</span>
				                              </div>
				                            </div>
				                            <div class="ucs-field" data-needs="text.secondary text.tertiary border.muted">
				                              <div class="lb" data-uses="text.secondary ${USE_TYPE_CAPTION2}">不可点击（Disabled）</div>
				                              <div class="ucs-input is-disabled">
				                                <span class="ph" data-uses="text.tertiary ${USE_TYPE_BODY2}">不可用</span>
				                                <span class="tag" data-uses="text.secondary ${USE_TYPE_CAPTION2}">—</span>
				                              </div>
				                            </div>
			                          </div>
			                        </div>
			                      </div>

				                      <div class="ucs-row2">
						                        <div class="ucs-card2" data-needs-any="functional.success.default functional.warning.default functional.danger.default functional.info.default">
					                          <div class="h">
					                            <div class="k" data-uses="text.primary ${USE_TYPE_TITLE}">Notifications</div>
					                            <div class="s" data-uses="text.secondary ${USE_TYPE_CAPTION}">Toasts</div>
					                          </div>
				                          <div class="ucs-toast-list">
					                            <div class="ucs-toast success" data-needs="functional.success.default" data-uses="functional.success.default text.primary text.secondary ${USE_TYPE_BODY2} ${USE_TYPE_CAPTION2}">
				                              <div>
				                                <div class="t">Saved</div>
				                                <div class="d">All changes synced.</div>
				                              </div>
				                              <div class="x" aria-hidden="true">✕</div>
				                            </div>
					                            <div class="ucs-toast warn" data-needs="functional.warning.default" data-uses="functional.warning.default text.primary text.secondary ${USE_TYPE_BODY2} ${USE_TYPE_CAPTION2}">
				                              <div>
				                                <div class="t">Pending</div>
				                                <div class="d">Waiting for review.</div>
				                              </div>
				                              <div class="x" aria-hidden="true">✕</div>
				                            </div>
					                            <div class="ucs-toast danger" data-needs="functional.danger.default" data-uses="functional.danger.default text.primary text.secondary ${USE_TYPE_BODY2} ${USE_TYPE_CAPTION2}">
				                              <div>
				                                <div class="t">Failed</div>
				                                <div class="d">Please try again later.</div>
				                              </div>
				                              <div class="x" aria-hidden="true">✕</div>
				                            </div>
					                            <div class="ucs-toast info" data-needs="functional.info.default" data-uses="functional.info.default text.primary text.secondary ${USE_TYPE_BODY2} ${USE_TYPE_CAPTION2}">
				                              <div>
				                                <div class="t">Update</div>
				                                <div class="d">New version available.</div>
				                              </div>
				                              <div class="x" aria-hidden="true">✕</div>
				                            </div>
			                          </div>
			                        </div>
			                      </div>

			                      <div class="ucs-row2">
			                        <div class="ucs-card2" data-needs-any="primary primary.25 border.muted text.primary text.secondary">
			                          <div class="h">
			                            <div class="k">Navigation</div>
			                            <div class="s">Tabs</div>
			                          </div>
			                          <div class="ucs-tabs" data-needs-any="primary.25 border.muted text.primary text.secondary">
			                            <div class="ucs-tab on" data-needs="primary.25 text.primary">Overview</div>
			                            <div class="ucs-tab" data-needs="text.secondary">Activity</div>
			                            <div class="ucs-tab" data-needs="text.secondary">Billing</div>
			                          </div>
			                        </div>
			                      </div>

		                      <div class="ucs-card2" data-needs-any="divider.default border.muted text.primary text.secondary text.tertiary primary.25 functional.success.default functional.warning.default functional.danger.default functional.info.default">
			                        <div class="h">
			                          <div class="k">Table</div>
			                          <div class="s">Data</div>
			                        </div>
			                        <div class="ucs-datatable" data-needs-any="divider.default border.muted text.primary text.secondary text.tertiary primary.25 functional.success.default functional.warning.default functional.danger.default functional.info.default">
			                          <div class="r h" data-needs-any="text.primary text.secondary text.tertiary">
			                            <span>Task</span>
			                            <span>Owner</span>
			                            <span>Status</span>
			                          </div>
				                          <div class="r sel" data-needs="primary.25 functional.warning.default">
			                            <span class="c1" data-needs="text.primary">Design review</span>
			                            <span class="c2" data-needs="text.secondary">Haao</span>
			                            <span class="c3"><span class="ucs-badge warn">Pending</span></span>
			                          </div>
				                          <div class="r" data-needs="functional.success.default">
			                            <span class="c1" data-needs="text.primary">Ship update</span>
			                            <span class="c2" data-needs="text.secondary">Team</span>
			                            <span class="c3"><span class="ucs-badge success">Done</span></span>
			                          </div>
				                          <div class="r" data-needs="functional.danger.default">
			                            <span class="c1" data-needs="text.primary">Payment issue</span>
			                            <span class="c2" data-needs="text.secondary">Finance</span>
			                            <span class="c3"><span class="ucs-badge danger">Failed</span></span>
			                          </div>
				                          <div class="r" data-needs="functional.info.default">
			                            <span class="c1" data-needs="text.primary">System notice</span>
			                            <span class="c2" data-needs="text.secondary">Bot</span>
			                            <span class="c3"><span class="ucs-badge info">Info</span></span>
			                          </div>
				                          <div class="r" data-needs="functional.warning.default">
			                            <span class="c1" data-needs="text.primary">Release notes</span>
			                            <span class="c2" data-needs="text.secondary">PM</span>
			                            <span class="c3"><span class="ucs-badge warn">Review</span></span>
			                          </div>
				                          <div class="r" data-needs="functional.success.default">
			                            <span class="c1" data-needs="text.primary">Merge PR</span>
			                            <span class="c2" data-needs="text.secondary">Dev</span>
			                            <span class="c3"><span class="ucs-badge success">Done</span></span>
			                          </div>
			                        </div>
			                      </div>
			
			                      <div class="ucs-card2" data-needs="primary primary.25 primary.50 primary.75 primary.deep">
			                        <div class="h">
			                          <div>
		                            <div class="k">有记录</div>
		                            <div class="s" data-heatmap-count>15天</div>
		                          </div>
		                          <div class="ucs-year" aria-label="Year">
		                            <button type="button" aria-label="Previous year">‹</button>
		                            <div class="y">2026年</div>
		                            <button type="button" aria-label="Next year">›</button>
		                          </div>
		                        </div>
		                        <div class="ucs-heatmap-months" aria-hidden="true">
		                          <span>1月</span><span>2月</span><span>3月</span><span>4月</span><span>5月</span><span>6月</span><span>7月</span><span>8月</span><span>9月</span><span>10月</span><span>11月</span><span>12月</span>
		                        </div>
		                        <div class="ucs-heatmap" data-heatmap data-needs="primary primary.25 primary.50 primary.75 primary.deep"></div>
		                        <div class="ucs-heatmap-legend" data-needs="primary primary.25 primary.50 primary.75 primary.deep">
		                          <span style="opacity:.9">0</span>
		                          <div class="dots" aria-hidden="true">
		                            <span class="cell lv0"></span>
		                            <span class="cell lv1"></span>
		                            <span class="cell lv2"></span>
		                            <span class="cell lv3"></span>
		                            <span class="cell lv4"></span>
		                            <span class="cell lv5"></span>
		                          </div>
		                          <span style="opacity:.9">1000+</span>
		                        </div>
		                      </div>
		
		                      <div class="ucs-row2">
			                        <div class="ucs-card2" data-needs-any="background.surface background.elevated border.default border.muted">
			                          <div class="h">
			                            <div class="k">Layers</div>
			                            <div class="s">Structure</div>
			                          </div>
			                          <div class="ucs-layer-grid" data-needs-any="background.surface background.elevated">
			                            <div class="ucs-layer-tile surface" data-needs="background.surface">
			                              <div>
			                                <div class="k">Surface</div>
			                                <div class="s">Card</div>
			                              </div>
			                            </div>
			                            <div class="ucs-layer-tile elevated" data-needs="background.elevated">
			                              <div>
			                                <div class="k">Elevated</div>
		                                <div class="s">Popover</div>
		                              </div>
		                            </div>
		                          </div>
		                        </div>

			                        <div class="ucs-card2" data-typography-card data-needs-any="text.primary text.secondary text.tertiary text.brand text.inverse text.black text.white primary.deep divider.default">
			                          <div class="h">
			                            <div class="k">Typography</div>
			                          </div>
			                          <div class="ucs-type">
		                            <div class="t0" data-needs="text.primary">UI 设计系统</div>
		                            <div class="t1" data-needs="text.primary">用 Token 约束风格，减少返工</div>
		                            <div class="t2" data-needs="text.secondary">颜色 / 字号 / 间距都来自同一套 Token，页面会更一致，也更好维护。</div>
		                            <div class="ucs-paragraph" data-needs="text.secondary">这是一段用于预览正文排版的真实示例：正文以 Regular 为主，标题再提升字重；这样更耐读，也更不容易“看起来脏”。</div>
		                            <div class="t3" data-needs="text.tertiary">Caption：用于时间、注释、辅助说明（12px/16px）。</div>
		                            <div class="ucs-typo-grid" data-needs-any="divider.default text.primary text.secondary text.tertiary text.brand text.inverse primary.deep">
		                              <div class="r" data-needs="text.primary">
		                                <span class="lb">主文字</span>
		                                <span class="v primary txt">这是一段主文字示例：用于正文与关键说明（Aa 0123 中文 English）。</span>
		                              </div>
		                              <div class="r" data-needs="text.secondary">
		                                <span class="lb">次文字</span>
		                                <span class="v secondary txt">用于补充解释、描述与状态说明：信息层级更弱，但仍要可读。</span>
		                              </div>
		                              <div class="r" data-needs="text.tertiary">
		                                <span class="lb">弱文字</span>
		                                <span class="v tertiary txt">用于占位、禁用态、辅助提示：例如「暂无数据 / 可选」。</span>
		                              </div>
		                              <div class="r" data-needs="text.brand">
		                                <span class="lb">链接</span>
		                                <span class="v link txt">查看规范 →</span>
		                              </div>
		                              <div class="r" data-needs="text.secondary">
		                                <span class="lb">单行省略</span>
		                                <span class="v secondary txt truncate">这是一条用于演示单行省略的超长文本：当空间不足时会被截断并显示省略号（…）。</span>
		                              </div>
		                              <div class="r" data-needs="text.secondary">
		                                <span class="lb">Token</span>
		                                <span class="v secondary txt"><span class="ucs-inline-code">--ucs-text</span> / <span class="ucs-inline-code">--ucs-type-body-size</span> 在文档与代码中保持一致。</span>
		                              </div>
		                              <div class="r" data-needs="text.inverse primary.deep">
		                                <span class="lb">反色</span>
		                                <span class="v"><span class="inverse">反色标签</span></span>
		                              </div>
		                            </div>
		                            <div class="ucs-hr" data-needs="divider.default"></div>
		                            <div class="ucs-meta2" data-needs="text.tertiary">
		                              <span>最近更新</span>
		                              <span>2 天前</span>
		                            </div>
		                          </div>
		                          <div class="ucs-text-samples" data-text-samples>
		                            <div class="ucs-text-sample" data-needs="text.black">
		                              <span class="name">纯黑</span>
		                              <span class="sample" style="color:var(--ucs-text-black)">这是一段用于检验正文可读性的示例文本：请确保在最常见的卡片背景上，对比度 ≥ 4.5:1，并避免过粗字重造成阅读疲劳。</span>
		                            </div>
		                            <div class="ucs-text-sample on-dark" data-needs="text.white">
		                              <span class="name">纯白</span>
		                              <span class="sample" style="color:var(--ucs-text-white)">这是一段用于检验深色背景可读性的示例文本：在暗黑模式下，正文同样建议保持 Regular 字重，优先用层级与对比度表达重要性。</span>
		                            </div>
		                            <div data-custom-text-list></div>
		                          </div>
		                        </div>
		                      </div>

		                      <div class="ucs-row2">
		                        <div class="ucs-card2" data-needs-any="overlay.hover overlay.pressed primary border.default text.primary text.secondary">
		                          <div class="h">
		                            <div class="k">Buttons</div>
		                            <div class="s">State</div>
		                          </div>
		                          <div class="ucs-note" data-needs="text.secondary">
		                            Hover 使用 <span class="code">overlay.hover</span>；Pressed 使用 <span class="code">overlay.pressed</span>。
		                          </div>
		                          <div class="ucs-states">
		                            <button class="ucs-btn primary sm" type="button" data-needs="primary">Default</button>
		                            <button class="ucs-btn primary sm" type="button" data-hover="state-hover" data-needs="primary overlay.hover">Hover</button>
		                            <button class="ucs-btn primary sm pressed" type="button" data-needs="primary overlay.pressed">Pressed</button>
		                            <button class="ucs-btn sm" type="button" data-needs="border.default text.primary">Ghost</button>
		                            <button class="ucs-btn primary sm" type="button" disabled data-needs="primary">Disabled</button>
		                          </div>
		                        </div>

		                        <div class="ucs-card2" data-needs-any="shadow.sm shadow.md shadow.lg">
		                          <div class="h">
		                            <div class="k">Shadows</div>
		                            <div class="s">Elevation</div>
		                          </div>
		                          <div class="ucs-shadow-grid">
		                            <div class="ucs-shadow-card sm" data-needs="shadow.sm">
		                              <div class="k">SM</div>
		                              <div class="s">Card</div>
		                            </div>
		                            <div class="ucs-shadow-card md" data-needs="shadow.md">
		                              <div class="k">MD</div>
		                              <div class="s">Popup</div>
		                            </div>
		                            <div class="ucs-shadow-card lg" data-needs="shadow.lg">
		                              <div class="k">LG</div>
		                              <div class="s">Modal</div>
		                            </div>
		                          </div>
		                          <div class="ucs-popover-demo" data-needs="shadow.md background.elevated border.default divider.default text.primary text.secondary primary.25">
		                            <div class="cap">
		                              <div class="k">Popover</div>
		                              <div class="s">shadow.md</div>
		                            </div>
		                            <div class="anchor">
		                              <button class="ucs-btn sm" type="button" data-needs="border.default text.primary">Filter</button>
		                              <button class="ucs-btn sm" type="button" data-needs="border.default text.primary">Sort</button>
		                            </div>
		                            <div class="ucs-popover">
		                              <div class="row on"><span>Most recent</span><span class="hint">⌘1</span></div>
		                              <div class="row"><span>Unread only</span><span class="hint">⌘2</span></div>
		                              <div class="sep"></div>
		                              <div class="row"><span>Download CSV</span><span class="hint">⌘D</span></div>
		                            </div>
		                          </div>
		                        </div>
		                      </div>
		                    </div>
		
			                    <div class="ucs-modal" aria-label="Modal Preview" aria-hidden="true">
			                      <div class="scrim" data-modal="scrim"></div>
		                      <div class="dlg" role="dialog" aria-modal="true" aria-label="Setup Updates">
	                        <div class="h">
                          <div class="title">Setup Updates</div>
                          <button class="x" type="button" data-modal="close-scrim" aria-label="Close">✕</button>
                        </div>
	                        <div class="p">A lightweight modal for contrast and elevation checks.</div>
	                        <div class="bar"><i></i></div>
	                      </div>
	                    </div>
	                  </div>
	                </div>
		              </div>
		            </div>
		          </section>

	          <div class="ucs-split-resize" data-k="splitResize" role="separator" aria-orientation="vertical" aria-label="调整 Tokens 面板宽度"></div>

	          <section class="ucs-card ucs-token-card">
	            <header class="ucs-card-h">
	              <div class="ucs-card-t">Tokens</div>
              <div class="ucs-actions" data-actions>
                <span class="pill" data-status aria-live="polite"></span>
                <button class="btn" type="button" data-reset>重置默认</button>
                <button class="btn" type="button" data-add-text>新增文字色</button>
                <button class="btn primary" type="button" data-export-current>导出当前</button>
                <button class="btn" type="button" data-export-all>导出全部规范</button>
              </div>
            </header>
            <div class="ucs-card-b">
              <div class="ucs-editor-tabs" data-editor-tabs></div>
              <div class="ucs-addwrap" data-addwrap style="display:none"></div>
              <div data-editor></div>
            </div>
          </section>
        </div>
      `;

      panelEl.replaceChildren();

		      const rootEl = contentEl.querySelector(".ucs-root");
		      const splitResizeEl = contentEl.querySelector('[data-k="splitResize"]');

		      const editorEl = contentEl.querySelector("[data-editor]");
		      const previewEl = contentEl.querySelector("[data-preview]");
		      const prevTokenPop = document.querySelector(`.ucs-token-pop[data-owner="${MODULE_KEY}"]`);
		      prevTokenPop?.remove?.();
		      const tokenPopEl = document.createElement("div");
		      tokenPopEl.className = "ucs-token-pop";
		      tokenPopEl.dataset.k = "tokenPop";
		      tokenPopEl.dataset.owner = MODULE_KEY;
		      tokenPopEl.setAttribute("role", "dialog");
		      tokenPopEl.setAttribute("aria-label", "使用到的 Tokens");
		      tokenPopEl.style.display = "none";
		      document.body.appendChild(tokenPopEl);
		      const statusEl = contentEl.querySelector("[data-status]");
		      const tabsEl = contentEl.querySelector("[data-editor-tabs]");
			      const addWrapEl = contentEl.querySelector("[data-addwrap]");
			      const typographyCardEl = contentEl.querySelector("[data-typography-card]");
			      const textSamplesEl = contentEl.querySelector("[data-text-samples]");
		      const customTextListEl = contentEl.querySelector("[data-custom-text-list]");

		      const cssEscape = (value) => {
		        if (window.CSS && typeof window.CSS.escape === "function") return window.CSS.escape(String(value));
		        return String(value).replace(/["\\]/g, "\\$&");
		      };

		      const LOCATE_ICON = `
		        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
		          <path d="M12 2v4M12 18v4M2 12h4M18 12h4"></path>
		          <circle cx="12" cy="12" r="4"></circle>
		        </svg>
		      `.trim();

				      let tokenPopAnchorEl = null;
				      let tokenPopTokenIds = [];
				      let tokenPopExpanded = false;
				      let tokenPopDocPointerHandler = null;
				      let tokenPopDocKeyHandler = null;

			      function parseNeeds(value) {
			        return String(value || "")
			          .trim()
			          .split(/\s+/)
			          .filter(Boolean);
			      }

			      const TYPE_DISPLAY_IDS = parseNeeds(USE_TYPE_DISPLAY);
			      const TYPE_TITLE_IDS = parseNeeds(USE_TYPE_TITLE);
			      const TYPE_BODY_IDS = parseNeeds(USE_TYPE_BODY);
			      const TYPE_CAPTION_IDS = parseNeeds(USE_TYPE_CAPTION);
			      const TYPE_DISPLAY2_IDS = parseNeeds(USE_TYPE_DISPLAY2);
			      const TYPE_TITLE2_IDS = parseNeeds(USE_TYPE_TITLE2);
			      const TYPE_BODY2_IDS = parseNeeds(USE_TYPE_BODY2);
			      const TYPE_CAPTION2_IDS = parseNeeds(USE_TYPE_CAPTION2);

			      function inferredTypeIdsForEl(el) {
			        if (!el || !(el instanceof HTMLElement)) return [];

			        const cls = el.classList;

			        if (cls.contains("ucs-title") || cls.contains("t0")) return TYPE_DISPLAY_IDS;
			        if (cls.contains("t1")) return TYPE_TITLE_IDS;
			        if (cls.contains("t2") || cls.contains("ucs-subtitle") || cls.contains("ucs-paragraph")) return TYPE_BODY_IDS;
			        if (cls.contains("t3")) return TYPE_CAPTION_IDS;

			        if (cls.contains("ucs-btn")) return TYPE_BODY_IDS;
			        if (cls.contains("ucs-tab")) return TYPE_BODY2_IDS;
			        if (cls.contains("ucs-note") || el.closest(".ucs-note")) return TYPE_CAPTION2_IDS;

			        if (cls.contains("k") && el.closest(".ucs-card2 .h")) return TYPE_TITLE_IDS;
			        if (cls.contains("s") && el.closest(".ucs-card2 .h")) return TYPE_CAPTION_IDS;

			        if (cls.contains("k") && el.closest(".ucs-layer-tile")) return TYPE_BODY2_IDS;
			        if (cls.contains("s") && el.closest(".ucs-layer-tile")) return TYPE_CAPTION2_IDS;

			        if (cls.contains("k") && el.closest(".ucs-popover-demo .cap")) return TYPE_CAPTION2_IDS;
			        if (cls.contains("s") && el.closest(".ucs-popover-demo .cap")) return TYPE_CAPTION2_IDS;

			        if (cls.contains("hint") && el.closest(".ucs-popover")) return TYPE_CAPTION2_IDS;

			        if (cls.contains("ph")) return TYPE_BODY2_IDS;
			        if (cls.contains("val")) return TYPE_BODY_IDS;
			        if (cls.contains("lb")) return TYPE_CAPTION2_IDS;
			        if (cls.contains("tag")) return TYPE_CAPTION2_IDS;

			        if (cls.contains("t") && el.closest(".ucs-toast")) return TYPE_BODY2_IDS;
			        if (cls.contains("d") && el.closest(".ucs-toast")) return TYPE_CAPTION2_IDS;

			        if (cls.contains("name") && el.closest(".ucs-text-sample")) return TYPE_CAPTION2_IDS;
			        if (cls.contains("sample") && el.closest(".ucs-text-sample")) return TYPE_BODY_IDS;

			        if (cls.contains("ttl") && el.closest(".ucs-item")) return TYPE_BODY2_IDS;
			        if (cls.contains("sub") && el.closest(".ucs-item")) return TYPE_CAPTION2_IDS;

			        if (cls.contains("meta2") || cls.contains("ucs-meta2")) return TYPE_CAPTION_IDS;

			        if (cls.contains("link") && el.closest(".ucs-type")) return TYPE_BODY2_IDS;
			        if (cls.contains("inverse") && el.closest(".ucs-type")) return TYPE_CAPTION2_IDS;

			        if (cls.contains("c1") || cls.contains("c2")) return TYPE_BODY2_IDS;
			        if (cls.contains("ucs-badge")) return TYPE_CAPTION2_IDS;

			        if (cls.contains("title") && el.closest(".ucs-modal .dlg")) return TYPE_TITLE_IDS;
			        if (cls.contains("p") && el.closest(".ucs-modal .dlg")) return TYPE_BODY_IDS;

			        if (el.closest(".ucs-heatmap-months") || el.closest(".ucs-heatmap-legend")) return TYPE_CAPTION2_IDS;
			        if (el.closest(".ucs-datatable .r.h")) return TYPE_CAPTION2_IDS;

			        return [];
			      }

			      function inferredComponentIdsForEl(el) {
			        if (!el || !(el instanceof HTMLElement)) return [];

			        const out = [];
			        const cls = el.classList;

			        if (cls.contains("ucs-card2")) out.push("radius.card", "shadow.sm", "space.card.padding");

			        if (cls.contains("ucs-layer-tile")) {
			          out.push("radius.card", "space.card.padding");
			          if (cls.contains("elevated")) out.push("shadow.md");
			        }

			        if (cls.contains("ucs-input")) out.push("control.height", "radius.control");
			        if (cls.contains("ucs-btn"))
			          out.push(
			            "control.height",
			            "radius.button",
			            "motion.duration.enter",
			            "motion.duration.exit",
			            "motion.easing.enter",
			            "motion.easing.exit"
			          );

			        if (cls.contains("ucs-toast")) out.push("radius.control");
			        if (cls.contains("ucs-popover")) out.push("radius.control", "shadow.md");
			        if (cls.contains("ucs-datatable")) out.push("radius.control");

			        if (cls.contains("dlg") && el.closest(".ucs-modal")) out.push("radius.card", "shadow.lg");
			        if (cls.contains("scrim") && el.closest(".ucs-modal")) out.push("overlay.scrim");

			        const toast = el.closest(".ucs-toast");
			        if (toast && toast instanceof HTMLElement) {
			          if (toast.classList.contains("success")) out.push("functional.success.default");
			          else if (toast.classList.contains("warn")) out.push("functional.warning.default");
			          else if (toast.classList.contains("danger")) out.push("functional.danger.default");
			          else if (toast.classList.contains("info")) out.push("functional.info.default");
			        }

			        const badge = el.closest(".ucs-badge");
			        if (badge && badge instanceof HTMLElement) {
			          if (badge.classList.contains("success")) out.push("functional.success.default");
			          else if (badge.classList.contains("warn")) out.push("functional.warning.default");
			          else if (badge.classList.contains("danger")) out.push("functional.danger.default");
			          else if (badge.classList.contains("info")) out.push("functional.info.default");
			        }

			        return out;
			      }

			      function rawIdsForEl(el) {
			        const uses = el?.dataset?.uses;
			        const usesAny = el?.dataset?.usesAny;
			        const base =
			          (uses && String(uses).trim()) || (usesAny && String(usesAny).trim())
			            ? [...parseNeeds(uses), ...parseNeeds(usesAny)]
			            : [...parseNeeds(el?.dataset?.needs), ...parseNeeds(el?.dataset?.needsAny)];
			        const extra = [...inferredTypeIdsForEl(el), ...inferredComponentIdsForEl(el)];
			        if (!extra.length) return base;
			        return [...base, ...extra];
			      }

		      function tokensForAnchor(anchorEl) {
		        if (!anchorEl || !(anchorEl instanceof HTMLElement)) return [];
		        const ids = rawIdsForEl(anchorEl);
		        const out = [];
		        const seen = new Set();
		        for (const id of ids) {
		          const tid = String(id || "").trim();
		          if (!tid || seen.has(tid)) continue;
		          seen.add(tid);
		          if (!getToken(model, tid)) continue;
		          out.push(tid);
		        }
		        return out;
		      }

		      function findNeedsAnchor(startEl, event) {
		        const path = typeof event?.composedPath === "function" ? event.composedPath() : null;
		        if (Array.isArray(path) && path.length) {
		          for (const node of path) {
		            if (!(node instanceof HTMLElement)) continue;
		            // Only consider elements inside preview.
		            if (previewEl && node !== previewEl && !previewEl.contains(node)) continue;
		            const ids = tokensForAnchor(node);
		            if (ids.length) return node;
		            if (node === previewEl) break;
		          }
		        }

		        // Fallback: walk up DOM tree.
		        let cur = startEl;
		        while (cur && cur instanceof HTMLElement && cur !== previewEl) {
		          const ids = tokensForAnchor(cur);
		          if (ids.length) return cur;
		          cur = cur.parentElement;
		        }
		        return null;
		      }

		      function editorTabForToken(token) {
		        const t = tokenType(token);
		        const tid = String(token?.id || "");
		        if (t === "color") return "color";
		        if (t === "shadow") return "appearance";
		        if (t === "string") return tid.startsWith("motion.") ? "motion" : "color";
		        if (t === "number") {
		          if (tid.startsWith("type.")) return "type";
		          if (tid.startsWith("layout.") || tid.startsWith("space.")) return "layout";
		          if (tid.startsWith("radius.") || tid.startsWith("control.")) return "appearance";
		          if (tid.startsWith("motion.")) return "motion";
		        }
		        return "color";
		      }

		      function locateTokenInEditor(id) {
		        const tid = String(id || "");
		        const tok = getToken(model, tid);
		        if (!tok) return;
		        const targetTab = editorTabForToken(tok);
		        if (editorTab !== targetTab) setEditorTab(targetTab);

		        const groupName = String(tok.group || "");
		        if (groupName && targetTab !== "type" && isGroupCollapsed(targetTab, groupName)) {
		          setGroupCollapsed(targetTab, groupName, false);
		          renderEditor();
		        }

		        const row =
		          editorEl?.querySelector?.(`.ucs-row.token button.ucs-locate[data-id="${cssEscape(tid)}"]`)?.closest?.(".ucs-row.token") ||
		          editorEl?.querySelector?.(`.ucs-row.token input[data-id="${cssEscape(tid)}"]`)?.closest?.(".ucs-row.token");
		        if (!row || !(row instanceof HTMLElement)) return;

		        row.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
		        row.classList.add("is-ping");
		        window.clearTimeout(locateTokenInEditor._t);
		        locateTokenInEditor._t = window.setTimeout(() => {
		          row.classList.remove("is-ping");
		        }, 1200);
		      }
		      locateTokenInEditor._t = 0;

		      function editorTabLabel(key) {
		        const k = String(key || "");
		        const found = EDITOR_TABS?.find?.((t) => t.key === k);
		        return found?.label || k || "";
		      }

		      function positionTokenPop() {
		        if (!tokenPopAnchorEl || !(tokenPopAnchorEl instanceof HTMLElement)) return;
		        if (tokenPopEl.style.display === "none") return;
		        const r = tokenPopAnchorEl.getBoundingClientRect();

		        tokenPopEl.style.left = "0px";
		        tokenPopEl.style.top = "0px";
		        const popRect = tokenPopEl.getBoundingClientRect();

		        const pad = 12;
		        let left = r.right + 12;
		        if (left + popRect.width + pad > window.innerWidth) left = r.left - popRect.width - 12;
		        left = clampNumber(left, pad, Math.max(pad, window.innerWidth - popRect.width - pad));

		        let top = r.top + r.height / 2 - popRect.height / 2;
		        top = clampNumber(top, pad, Math.max(pad, window.innerHeight - popRect.height - pad));

		        tokenPopEl.style.left = `${Math.round(left)}px`;
		        tokenPopEl.style.top = `${Math.round(top)}px`;
		      }

			      function renderTokenPop() {
			        const ids = tokenPopTokenIds.slice();
			        if (!ids.length) {
			          tokenPopEl.style.display = "none";
			          tokenPopEl.replaceChildren();
			          return;
			        }

			        const typeRoleMatch = (id) => /^type\.(display|title|body|caption)\.(size|lineHeight|weight)$/.exec(String(id || ""));
			        const typeRoles = new Map();
			        const plainIds = [];
			        for (const id of ids) {
			          const m = typeRoleMatch(id);
			          if (m) {
			            const role = m[1];
			            if (!typeRoles.has(role)) typeRoles.set(role, true);
			            continue;
			          }
			          plainIds.push(id);
			        }

			        const readNum = (id) => {
			          const tok = getToken(model, id);
			          if (!tok || tokenType(tok) !== "number") return null;
			          const v = readTokenValue(model, tok, mode);
			          return typeof v === "number" && Number.isFinite(v) ? v : null;
			        };

			        const roleLabel = (role) => {
			          const r = String(role || "");
			          if (r === "display") return "Display";
			          if (r === "title") return "Title";
			          if (r === "body") return "Body";
			          if (r === "caption") return "Caption";
			          return r || "Type";
			        };

			        const roleOrder = new Map([
			          ["display", 0],
			          ["title", 1],
			          ["body", 2],
			          ["caption", 3],
			        ]);

			        const items = [];
			        for (const role of Array.from(typeRoles.keys()).sort((a, b) => (roleOrder.get(a) ?? 99) - (roleOrder.get(b) ?? 99))) {
			          const sizeId = `type.${role}.size`;
			          const lhId = `type.${role}.lineHeight`;
			          const wId = `type.${role}.weight`;

			          const size = readNum(sizeId);
			          const lh = readNum(lhId);
			          const w = readNum(wId);
			          const tag = [size, lh, w]
			            .filter((n) => typeof n === "number" && Number.isFinite(n))
			            .map((n) => String(Math.round(n)))
			            .join("/");

			          items.push({
			            kind: "typeRole",
			            role,
			            id: `type.${role}`,
			            label: roleLabel(role),
			            tab: "type",
			            group: roleLabel(role),
			            title: roleLabel(role),
			            token: sizeId,
			            tag: tag || editorTabLabel("type"),
			          });
			        }

			        for (const id of plainIds) {
			          const tok = getToken(model, id);
			          if (!tok) continue;
			          const tab = editorTabForToken(tok);
			          items.push({ kind: "token", id, tab, group: String(tok.group || ""), title: String(tok.title || ""), token: id });
			        }

			        const tabRank = { color: 0, type: 1, layout: 2, appearance: 3, motion: 4 };
			        items.sort((a, b) => {
			          const ra = tabRank[a.tab] ?? 99;
			          const rb = tabRank[b.tab] ?? 99;
			          if (ra !== rb) return ra - rb;
			          if (a.kind === "typeRole" && b.kind === "typeRole") {
			            return (roleOrder.get(a.role) ?? 99) - (roleOrder.get(b.role) ?? 99);
			          }
			          return String(a.id).localeCompare(String(b.id));
			        });

		        const collapsedCount = tokenPopExpanded ? 0 : Math.max(0, items.length - 8);
		        const visibleItems = tokenPopExpanded ? items : items.slice(0, 8);

			        tokenPopEl.innerHTML = `
			          <div class="h">
			            <div class="ttl">使用到的 Tokens</div>
			            <div class="cnt">${items.length}</div>
			          </div>
			          <div class="list">
			            ${visibleItems
			              .map((it) => {
			                const label = it.label || it.id;
			                const metaParts = [editorTabLabel(it.tab), it.group].filter(Boolean);
			                const meta = metaParts.join(" · ");
			                const tag = it.tag || editorTabLabel(it.tab);
			                return `
			                  <button class="it" type="button" data-k="tokenPick" data-token="${Kit.text.escapeHtml(it.token || it.id)}">
			                    <span class="txt">
			                      <div class="id">${Kit.text.escapeHtml(label)}</div>
			                      <div class="meta">${Kit.text.escapeHtml(meta)}</div>
			                    </span>
			                    <span class="tag">${Kit.text.escapeHtml(tag)}</span>
			                  </button>
			                `;
			              })
			              .join("")}
		            ${
		              collapsedCount > 0
		                ? `<button class="more" type="button" data-k="tokenMore">展开更多 +${collapsedCount}</button>`
		                : items.length > 8
		                  ? `<button class="more" type="button" data-k="tokenLess">收起</button>`
		                  : ""
		            }
			          </div>
			        `;

			        const header = tokenPopEl.querySelector(".h");
			        if (header) {
			          const close = document.createElement("button");
			          close.type = "button";
			          close.className = "ucs-token-pop-x";
			          close.dataset.k = "tokenClose";
			          close.setAttribute("aria-label", "关闭");
			          close.textContent = "✕";
			          header.appendChild(close);
			        }
			      }

		      function setTokenPopVisible(visible) {
		        if (!visible) {
		          tokenPopEl.style.display = "none";
		          tokenPopEl.replaceChildren();
		          tokenPopAnchorEl = null;
		          tokenPopTokenIds = [];
		          tokenPopExpanded = false;
		          return;
		        }
			        tokenPopEl.style.display = "block";
			        renderTokenPop();
			        positionTokenPop();
			      }

		
		      const modeButtons = Array.from(contentEl.querySelectorAll("[data-mode]"));

      function setStatus(text) {
        if (!statusEl) return;
        const msg = String(text || "").trim();
        statusEl.textContent = msg;
        window.clearTimeout(setStatus._t);
        if (!msg) return;
        setStatus._t = window.setTimeout(() => {
          if (statusEl.textContent === msg) statusEl.textContent = "";
        }, 1800);
      }
      setStatus._t = 0;

      function normalizeCustomTextId(input) {
        const raw = String(input || "").trim();
        if (!raw) return "";
        const cleaned = raw
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9._-]/g, "")
          .replace(/_{2,}/g, "_");
        if (!cleaned) return "";
        return cleaned.startsWith("text") ? cleaned : `text_${cleaned}`;
      }

      function nextCustomTextId() {
        const used = new Set((model.tokens || []).map((t) => String(t?.id || "")));
        for (let i = 1; i < 1000; i += 1) {
          const id = `text_new${i}`;
          if (!used.has(id)) return id;
        }
        return `text_new${Date.now()}`;
      }

      function showAddTextForm() {
        if (!addWrapEl) return;
        const placeholderId = nextCustomTextId();
        addWrapEl.style.display = "";
        addWrapEl.innerHTML = `
          <div class="ucs-addrow">
            <input type="text" data-add="id" placeholder="${Kit.text.escapeHtml(placeholderId)}（可不填自动生成）" aria-label="变量名">
            <input type="text" data-add="light" placeholder="亮色 HEX（如 1A1A1A）" aria-label="亮色 HEX">
            <input type="text" data-add="dark" placeholder="暗色 HEX（可选）" aria-label="暗色 HEX">
            <button class="btn primary" type="button" data-add="confirm">添加</button>
            <button class="btn" type="button" data-add="cancel">取消</button>
          </div>
          <div class="ucs-addhint">添加后会自动按亮度排序，并在左侧 Typography 里以真实文本展示。</div>
        `;
        addWrapEl.querySelector('input[data-add="id"]')?.focus?.();
      }

      function hideAddTextForm() {
        if (!addWrapEl) return;
        addWrapEl.style.display = "none";
        addWrapEl.replaceChildren();
      }

		      const EDITOR_TABS = [
		        { key: "color", label: "颜色" },
		        { key: "type", label: "文字" },
		        { key: "layout", label: "布局" },
		        { key: "appearance", label: "外观" },
		        { key: "motion", label: "交互" },
		      ];

		      function saveUiState() {
		        try {
		          Kit.storage.saveJson(UI_STATE_KEY, uiState);
		        } catch (e) {
		          // ignore
		        }
		      }

		      function groupKey(tabKey, groupName) {
		        return `${String(tabKey || "")}::${String(groupName || "")}`;
		      }

		      function isGroupCollapsed(tabKey, groupName) {
		        const key = groupKey(tabKey, groupName);
		        return !!uiState?.collapsed?.[key];
		      }

		      function setGroupCollapsed(tabKey, groupName, collapsed) {
		        const key = groupKey(tabKey, groupName);
		        if (!uiState.collapsed || typeof uiState.collapsed !== "object") uiState.collapsed = {};
		        uiState.collapsed[key] = !!collapsed;
		        saveUiState();
		      }

		      function withEditorScrollPreserved(fn) {
		        const scroller = editorEl?.closest?.(".ucs-card-b");
		        const prev = scroller && scroller instanceof HTMLElement ? scroller.scrollTop : 0;
		        fn();
		        if (scroller && scroller instanceof HTMLElement) scroller.scrollTop = prev;
		      }

		      function getEditorNameColPx() {
		        const raw = uiState?.editor?.nameColPx;
		        const n = typeof raw === "number" && Number.isFinite(raw) ? Math.round(raw) : 240;
		        return clampNumber(n, 160, 420);
		      }

			      function applyEditorNameColPx(px) {
			        const table = editorEl?.querySelector?.(".ucs-table");
			        if (!table || !(table instanceof HTMLElement)) return;
			        const n = clampNumber(Math.round(px), 160, 420);
			        table.style.setProperty("--ucs-col-name", `${n}px`);
			      }

			      function clampSplitRightW(px) {
			        const minW = 340;
			        const absMax = 860;
			        if (!rootEl || !(rootEl instanceof HTMLElement)) return clampNumber(Math.round(px), minW, absMax);

			        const rect = rootEl.getBoundingClientRect();
			        const cs = getComputedStyle(rootEl);
			        const gapRaw = String(cs.columnGap || cs.gap || "0");
			        const gap = parseFloat(gapRaw.split(" ")[0]) || 0;
			        const minLeft = 420;
			        const maxByLayout = Math.max(minW, Math.floor(rect.width - gap - minLeft));
			        const maxW = Math.min(absMax, maxByLayout);
			        return clampNumber(Math.round(px), minW, maxW);
			      }

			      function getSplitRightW() {
			        const raw = uiState?.layout?.rightW;
			        const n = typeof raw === "number" && Number.isFinite(raw) ? Math.round(raw) : 440;
			        return clampSplitRightW(n);
			      }

			      function applySplitRightW(px) {
			        if (!rootEl || !(rootEl instanceof HTMLElement)) return;
			        const next = clampSplitRightW(px);
			        rootEl.style.setProperty("--ucs-right-w", `${next}px`);
			        if (!uiState.layout || typeof uiState.layout !== "object") uiState.layout = {};
			        uiState.layout.rightW = next;
			      }

			      function isRequiredTokenId(id) {
			        const tid = String(id || "");
			        return (
			          tid === "background.surface" ||
	          tid === "border.default" ||
	          tid === "divider.default" ||
	          tid === "space.card.padding" ||
	          tid.startsWith("type.")
	        );
	      }

		      function requiredHintForTokenId(id) {
		        const tid = String(id || "");
		        if (tid === "background.surface") return "Surface 为基础结构：不可取消预览";
		        if (tid === "border.default") return "描边为基础结构：不可取消预览";
		        if (tid === "divider.default") return "分割线为基础结构：不可取消预览";
		        if (tid === "space.card.padding") return "卡片内边距为基础规范：不可取消预览";
		        if (tid.startsWith("type.")) return "文字为基础规范：不可取消预览";
		        return "必选：不可取消预览";
		      }

	      function tokenInEditorTab(token) {
	        const k = String(editorTab || "color");
	        const t = tokenType(token);
	        const tid = String(token?.id || "");
	        if (k === "type") return t === "number" && tid.startsWith("type.");
	        if (k === "layout") return t === "number" && (tid.startsWith("layout.") || tid.startsWith("space."));
	        if (k === "appearance") return t === "shadow" || (t === "number" && (tid.startsWith("radius.") || tid.startsWith("control.")));
	        if (k === "motion") return (t === "number" || t === "string") && tid.startsWith("motion.");
	        return t === "color";
	      }

	      function renderEditorTabs() {
	        if (!tabsEl) return;
	        tabsEl.replaceChildren();
	        for (const tab of EDITOR_TABS) {
	          const b = document.createElement("button");
	          b.type = "button";
	          b.className = `ucs-tab${editorTab === tab.key ? " on" : ""}`;
	          b.dataset.tab = tab.key;
	          b.textContent = tab.label;
	          tabsEl.appendChild(b);
	        }

	        const btnAddText = contentEl.querySelector("[data-add-text]");
	        if (btnAddText && btnAddText instanceof HTMLButtonElement) {
	          btnAddText.style.display = editorTab === "color" ? "" : "none";
	        }
	      }

	      function setEditorTab(next) {
	        const key = EDITOR_TABS.some((t) => t.key === next) ? next : "color";
	        if (editorTab === key) return;
	        editorTab = key;
	        if (editorTab !== "color") hideAddTextForm();
	        renderEditor();
	      }

		      function renderEditor() {
		        renderEditorTabs();

			        const table = document.createElement("div");
			        table.className = "ucs-table";
			        table.style.setProperty("--ucs-col-name", `${getEditorNameColPx()}px`);

			        const showModes = editorTab === "color";
			        const showType = editorTab === "type";
			        const colsClass = showModes ? "cols-4" : "cols-3";

        const head = document.createElement("div");
        head.className = `ucs-row head ${colsClass}`;
        head.innerHTML = showModes
          ? `
              <div class="ucs-cellx check"></div>
              <div class="ucs-cellx name">Name</div>
              <div class="ucs-cellx col">亮色</div>
              <div class="ucs-cellx col">暗色</div>
            `
          : showType
            ? `
                <div class="ucs-cellx check"></div>
                <div class="ucs-cellx name">Name</div>
                <div class="ucs-cellx col">
                  <div class="ucs-type-cols-head">
                    <span>字号（px）</span>
                    <span>行高（px）</span>
                    <span>字重</span>
                  </div>
                </div>
              `
            : `
                <div class="ucs-cellx check"></div>
                <div class="ucs-cellx name">Name</div>
                <div class="ucs-cellx col">值</div>
              `;
	        table.appendChild(head);

		        if (showType) {
		          const scaleMin = TYPE_SCALE_MIN;
		          const scaleMax = TYPE_SCALE_MAX;
		          const scale = getTypeScale(model, 100);
		          const scalePct = Math.round(((scale - scaleMin) / (scaleMax - scaleMin)) * 100);
		          const scaleRow = document.createElement("div");
		          scaleRow.className = `ucs-row token ${colsClass} checked required`;
		          scaleRow.innerHTML = `
		            <div class="ucs-cellx check"></div>
		            <div class="ucs-cellx name">
		              <div class="ucs-name">
	                <span class="txt">整体字号</span>
		                <button class="ucs-locate" type="button" data-id="type.scale" data-k="locate" title="定位使用地方" aria-label="定位使用地方">${LOCATE_ICON}</button>
	              </div>
	            </div>
	            <div class="ucs-cellx col">
	              <div class="ucs-type-scale">
	                <input type="range" min="${scaleMin}" max="${scaleMax}" step="1" value="${scale}" style="--p:${scalePct}%" data-id="type.scale" data-k="typeScale" aria-label="整体字号">
	                <span class="n" data-type-scale-n>${scale}%</span>
	              </div>
	            </div>
	          `;
	          table.appendChild(scaleRow);

	          const roles = [
	            { key: "display", label: "Display" },
	            { key: "title", label: "Title" },
	            { key: "body", label: "Body" },
	            { key: "caption", label: "Caption" },
	          ];

		          for (const role of roles) {
	            const sizeId = `type.${role.key}.size`;
	            const lhId = `type.${role.key}.lineHeight`;
	            const wId = `type.${role.key}.weight`;

	            const readNum = (id) => {
	              const tok = getToken(model, id);
	              if (!tok || tokenType(tok) !== "number") return 0;
	              const v = readTokenValue(model, tok, "light");
	              return typeof v === "number" && Number.isFinite(v) ? v : 0;
	            };
	            const size = readNum(sizeId);
	            const lh = readNum(lhId);
		            const w = readNum(wId);

		            const row = document.createElement("div");
		            row.className = `ucs-row token ${colsClass} checked required`;
		            row.innerHTML = `
		              <div class="ucs-cellx check">
		                <div class="ucs-check" title="文字为基础规范：不可取消预览">
		                  <input type="checkbox" checked disabled data-id="${Kit.text.escapeHtml(sizeId)}" data-k="preview" aria-label="预览 ${Kit.text.escapeHtml(role.label)}">
		                </div>
		              </div>
	              <div class="ucs-cellx name">
	                <div class="ucs-name">
	                  <span class="txt">${Kit.text.escapeHtml(role.label)}</span>
		                  <button class="ucs-locate" type="button" data-id="${Kit.text.escapeHtml(sizeId)}" data-k="locate" title="定位使用地方" aria-label="定位使用地方">${LOCATE_ICON}</button>
	                </div>
	              </div>
		              <div class="ucs-cellx col">
		                <div class="ucs-type-triple">
		                  <div class="ucs-num">
		                    <input type="number" step="1" value="${Math.round(size)}" data-id="${Kit.text.escapeHtml(sizeId)}" data-k="num" aria-label="${Kit.text.escapeHtml(role.label)} 字号">
		                    <div class="ucs-stepper" aria-hidden="false">
		                      <button class="ucs-step" type="button" data-k="stepUp" aria-label="增加">▲</button>
		                      <button class="ucs-step" type="button" data-k="stepDown" aria-label="减少">▼</button>
		                    </div>
		                  </div>
		                  <div class="ucs-num">
		                    <input type="number" step="1" value="${Math.round(lh)}" data-id="${Kit.text.escapeHtml(lhId)}" data-k="num" aria-label="${Kit.text.escapeHtml(role.label)} 行高">
		                    <div class="ucs-stepper" aria-hidden="false">
		                      <button class="ucs-step" type="button" data-k="stepUp" aria-label="增加">▲</button>
		                      <button class="ucs-step" type="button" data-k="stepDown" aria-label="减少">▼</button>
		                    </div>
		                  </div>
		                  <div class="ucs-num">
		                    <input type="number" step="1" value="${Math.round(w)}" data-id="${Kit.text.escapeHtml(wId)}" data-k="num" aria-label="${Kit.text.escapeHtml(role.label)} 字重">
		                    <div class="ucs-stepper" aria-hidden="false">
		                      <button class="ucs-step" type="button" data-k="stepUp" aria-label="增加">▲</button>
		                      <button class="ucs-step" type="button" data-k="stepDown" aria-label="减少">▼</button>
		                    </div>
		                  </div>
		                </div>
		              </div>
		            `;
			            table.appendChild(row);
		          }

		          const resizer = document.createElement("div");
		          resizer.className = "ucs-col-resize";
		          resizer.dataset.k = "colResize";
		          resizer.setAttribute("role", "separator");
		          resizer.setAttribute("aria-orientation", "vertical");
		          resizer.setAttribute("aria-label", "调整分栏");
		          table.appendChild(resizer);

		          editorEl.replaceChildren(table);
		          return;
		        }

	        const groups = new Map();
        for (const t of model.tokens) {
          if (!tokenInEditorTab(t)) continue;
          const g = String(t.group || "Color");
          if (!groups.has(g)) groups.set(g, []);
          groups.get(g).push(t);
        }

	        for (const [groupName, tokens] of groups.entries()) {
          const tokensSorted =
            groupName === "文字色"
              ? tokens
                  .slice()
                  .sort((a, b) => {
                    const order = new Map([
                      ["text.primary", 0],
                      ["text.secondary", 1],
                      ["text.tertiary", 2],
                      ["text.brand", 3],
                      ["text.inverse", 4],
                      ["text.black", 5],
                      ["text.white", 6],
                    ]);
                    const ida = String(a?.id || "");
                    const idb = String(b?.id || "");
                    const ra = order.has(ida) ? order.get(ida) : 1000;
                    const rb = order.has(idb) ? order.get(idb) : 1000;
                    if (ra !== rb) return ra - rb;
                    const va = readTokenValue(model, a, "light");
                    const vb = readTokenValue(model, b, "light");
                    const la = relativeLuminance(normalizeHex(va.hex) || "#000000");
                    const lb = relativeLuminance(normalizeHex(vb.hex) || "#000000");
                    if (la !== lb) return la - lb;
                    return ida.localeCompare(idb);
                  })
              : tokens;

	          const groupHeader = document.createElement("div");
	          const collapsed = isGroupCollapsed(editorTab, groupName);
	          groupHeader.className = `ucs-row group ${colsClass}${collapsed ? " is-collapsed" : ""}`;
	          groupHeader.dataset.group = String(groupName || "");
	          groupHeader.innerHTML = showModes
	            ? `
	              <div class="ucs-cellx check"></div>
	              <div class="ucs-cellx name">
	                <button class="ucs-group-btn" type="button" data-k="groupToggle" data-group="${Kit.text.escapeHtml(groupName)}" aria-expanded="${collapsed ? "false" : "true"}">
	                  <span class="ucs-group-left">
	                    <span class="ttl">${Kit.text.escapeHtml(groupName)}</span>
	                    <span class="meta">${tokensSorted.length}</span>
	                  </span>
	                  <span class="chev" aria-hidden="true">▾</span>
	                </button>
	              </div>
	              <div class="ucs-cellx col"></div>
	              <div class="ucs-cellx col"></div>
	            `
	            : `
	              <div class="ucs-cellx check"></div>
	              <div class="ucs-cellx name">
	                <button class="ucs-group-btn" type="button" data-k="groupToggle" data-group="${Kit.text.escapeHtml(groupName)}" aria-expanded="${collapsed ? "false" : "true"}">
	                  <span class="ucs-group-left">
	                    <span class="ttl">${Kit.text.escapeHtml(groupName)}</span>
	                    <span class="meta">${tokensSorted.length}</span>
	                  </span>
	                  <span class="chev" aria-hidden="true">▾</span>
	                </button>
	              </div>
	              <div class="ucs-cellx col"></div>
	            `;
	          table.appendChild(groupHeader);

	          for (const t of tokensSorted) {
	            if (collapsed) continue;
	            const type = tokenType(t);
	            const isLocked = !!t.ref || !!t.derive;
		            const isRequired = isRequiredTokenId(t.id);
	            const isChecked = isRequired || !!t.preview;
            const lightAny = readTokenValue(model, t, "light");
            const darkAny = readTokenValue(model, t, "dark");

	            const isDerivedColor =
	              showModes && groupName !== "文字色" && type === "color" && (!!t.ref || !!t.derive || !!previewParentId(t.id));

	            const row = document.createElement("div");
	            row.className = `ucs-row token ${colsClass}${isDerivedColor ? " indent-1" : ""}${isChecked ? " checked" : ""}${isRequired ? " required" : ""}`;
	            row.title = `${t.id || ""}${t.desc ? `\n${t.desc}` : ""}${t.ref ? `\n→ ${t.ref}` : ""}${isRequired ? `\n${requiredHintForTokenId(t.id)}` : ""}`.trim();

            const mkColorCol = (which, value, pct, showAlpha) => {
              const hex = normalizeHex(value.hex) || "#000000";
              return `
                <div class="ucs-cell ucs-ctrls ${isLocked ? "ucs-disabled" : ""}" data-alpha="${showAlpha ? "true" : "false"}">
                  <input type="color" value="${hex}" data-id="${t.id}" data-k="${which}" aria-label="${which === "light" ? "亮色" : "暗色"} ${t.title || t.id}">
                  <input type="text" value="${hex.slice(1)}" placeholder="FFFFFF" data-id="${t.id}" data-k="${which === "light" ? "lightText" : "darkText"}" aria-label="${which === "light" ? "亮色" : "暗色"}文本 ${t.title || t.id}">
                  <div class="ucs-alpha">
                    <input type="range" min="0" max="100" value="${pct}" style="--p:${pct}%" data-id="${t.id}" data-k="${which === "light" ? "lightAlpha" : "darkAlpha"}" aria-label="${which === "light" ? "亮色" : "暗色"}透明度 ${t.title || t.id}">
                    <span class="n">${pct}</span>
                  </div>
                </div>
              `;
            };

	            const mkNumberSingle = (n) => {
	              const v = typeof n === "number" && Number.isFinite(n) ? n : 0;
	              const unit = typeof t?.unit === "string" ? t.unit : "px";
	              const unitHtml = unit ? `<span class="mini">${Kit.text.escapeHtml(unit)}</span>` : "";
	              return `
	                <div class="ucs-cell ${isLocked ? "ucs-disabled" : ""}">
	                  <div class="ucs-num">
	                    <input type="number" step="1" value="${v}" data-id="${t.id}" data-k="num" aria-label="数值 ${t.title || t.id}">
	                    <div class="ucs-stepper" aria-hidden="false">
	                      <button class="ucs-step" type="button" data-k="stepUp" aria-label="增加">▲</button>
	                      <button class="ucs-step" type="button" data-k="stepDown" aria-label="减少">▼</button>
	                    </div>
	                  </div>
	                  ${unitHtml}
	                </div>
	              `;
	            };

            const mkStringSingle = (s) => {
              const v = typeof s === "string" ? s : s === undefined || s === null ? "" : String(s);
              return `
                <div class="ucs-cell ${isLocked ? "ucs-disabled" : ""}">
                  <input type="text" value="${Kit.text.escapeHtml(v)}" placeholder="cubic-bezier(...)" data-id="${t.id}" data-k="str" aria-label="文本 ${t.title || t.id}">
                </div>
              `;
            };

            const mkShadowSingle = (s) => {
              const base = asShadowValue(s, null);
              const hex = normalizeHex(base.color?.hex) || "#000000";
              const pct = Math.round(normalizeAlpha(base.color?.alpha, 1) * 100);
              return `
                <div class="ucs-shadow-ctrl ${isLocked ? "ucs-disabled" : ""}">
                  <div class="ucs-shadow-color">
                    <input type="color" value="${hex}" data-id="${t.id}" data-k="shadowColor" aria-label="阴影颜色 ${t.title || t.id}">
                    <input type="text" value="${hex.slice(1)}" placeholder="000000" data-id="${t.id}" data-k="shadowColorText" aria-label="阴影颜色文本 ${t.title || t.id}">
                    <div class="ucs-alpha">
                      <input type="range" min="0" max="100" value="${pct}" style="--p:${pct}%" data-id="${t.id}" data-k="shadowAlpha" aria-label="阴影透明度 ${t.title || t.id}">
                      <span class="n">${pct}</span>
                    </div>
                  </div>
	                  <div class="ucs-shadow-nums">
	                    <div class="f">
	                      <div class="k">x</div>
	                      <div class="ucs-num">
	                        <input type="number" step="1" value="${asNumberValue(base.x, 0)}" data-id="${t.id}" data-k="shadowX" aria-label="X ${t.title || t.id}">
	                        <div class="ucs-stepper" aria-hidden="false">
	                          <button class="ucs-step" type="button" data-k="stepUp" aria-label="增加">▲</button>
	                          <button class="ucs-step" type="button" data-k="stepDown" aria-label="减少">▼</button>
	                        </div>
	                      </div>
	                    </div>
	                    <div class="f">
	                      <div class="k">y</div>
	                      <div class="ucs-num">
	                        <input type="number" step="1" value="${asNumberValue(base.y, 0)}" data-id="${t.id}" data-k="shadowY" aria-label="Y ${t.title || t.id}">
	                        <div class="ucs-stepper" aria-hidden="false">
	                          <button class="ucs-step" type="button" data-k="stepUp" aria-label="增加">▲</button>
	                          <button class="ucs-step" type="button" data-k="stepDown" aria-label="减少">▼</button>
	                        </div>
	                      </div>
	                    </div>
	                    <div class="f">
	                      <div class="k">blur</div>
	                      <div class="ucs-num">
	                        <input type="number" step="1" min="0" value="${asNumberValue(base.blur, 0)}" data-id="${t.id}" data-k="shadowBlur" aria-label="Blur ${t.title || t.id}">
	                        <div class="ucs-stepper" aria-hidden="false">
	                          <button class="ucs-step" type="button" data-k="stepUp" aria-label="增加">▲</button>
	                          <button class="ucs-step" type="button" data-k="stepDown" aria-label="减少">▼</button>
	                        </div>
	                      </div>
	                    </div>
	                    <div class="f">
	                      <div class="k">spread</div>
	                      <div class="ucs-num">
	                        <input type="number" step="1" value="${asNumberValue(base.spread, 0)}" data-id="${t.id}" data-k="shadowSpread" aria-label="Spread ${t.title || t.id}">
	                        <div class="ucs-stepper" aria-hidden="false">
	                          <button class="ucs-step" type="button" data-k="stepUp" aria-label="增加">▲</button>
	                          <button class="ucs-step" type="button" data-k="stepDown" aria-label="减少">▼</button>
	                        </div>
	                      </div>
	                    </div>
	                  </div>
	                </div>
	              `;
	            };

	            const refBadge = t.ref
	              ? `<span class="ref">→ ${Kit.text.escapeHtml(t.ref)}</span>`
	              : t.derive
	                ? `<span class="ref">auto</span>`
	                : "";

	            const deleteBtn = t.custom
	              ? `<button class="ucs-del" type="button" data-id="${t.id}" data-k="delete" title="删除" aria-label="删除">✕</button>`
	              : "";

	            const nameHtml = `
	              <div class="ucs-cellx name">
	                <div class="ucs-name">
	                  <span class="txt">${Kit.text.escapeHtml(t.title || t.id)}</span>
	                  ${refBadge}
		                  <button class="ucs-locate" type="button" data-id="${t.id}" data-k="locate" title="定位使用地方" aria-label="定位使用地方">${LOCATE_ICON}</button>
	                  ${deleteBtn}
	                </div>
	              </div>
	            `;

	            const checkHtml = `
	              <div class="ucs-cellx check">
		                <div class="ucs-check" title="${Kit.text.escapeHtml(isRequired ? requiredHintForTokenId(t.id) : "勾选后在左侧预览出现")}">
		                  <input type="checkbox" ${isChecked ? "checked" : ""} ${isRequired ? "disabled" : ""} data-id="${t.id}" data-k="preview" aria-label="预览 ${Kit.text.escapeHtml(t.title || t.id)}">
		                </div>
		              </div>
		            `;

	            if (showModes) {
	              const light = asColorValue(lightAny, "#000000", 1);
	              const dark = asColorValue(darkAny, "#FFFFFF", 1);
		              const lightP = Math.round(normalizeAlpha(light.alpha, 1) * 100);
		              const darkP = Math.round(normalizeAlpha(dark.alpha, 1) * 100);
		              const showAlpha = (!isLocked && (lightP !== 100 || darkP !== 100)) || String(t.id || "").startsWith("overlay.");
	
	              row.innerHTML = `
	                ${checkHtml}
	                ${nameHtml}
	                <div class="ucs-cellx col">${mkColorCol("light", light, lightP, showAlpha)}</div>
	                <div class="ucs-cellx col">${mkColorCol("dark", dark, darkP, showAlpha)}</div>
	              `;
	            } else {
	              const valueHtml =
	                type === "shadow" ? mkShadowSingle(lightAny) : type === "string" ? mkStringSingle(lightAny) : mkNumberSingle(lightAny);
	              row.innerHTML = `
	                ${checkHtml}
	                ${nameHtml}
	                <div class="ucs-cellx col">${valueHtml}</div>
	              `;
	            }

            table.appendChild(row);
          }
        }

	        editorEl.replaceChildren(table);
	        const resizer = document.createElement("div");
	        resizer.className = "ucs-col-resize";
	        resizer.dataset.k = "colResize";
	        resizer.setAttribute("role", "separator");
	        resizer.setAttribute("aria-orientation", "vertical");
	        resizer.setAttribute("aria-label", "调整分栏");
	        table.appendChild(resizer);
	      }

      function persistAndRefresh(reason) {
        saveModel(model);
        renderEditor();
        refreshPreview();
        if (reason) setStatus(reason);
      }

      function setMode(nextMode) {
        mode = nextMode === "dark" ? "dark" : "light";
        for (const btn of modeButtons) btn.setAttribute("aria-pressed", btn.dataset.mode === mode ? "true" : "false");
        refreshPreview({ heatmap: true });
      }

      function setTokenPreview(id, enabled) {
        if (!enabled && isRequiredTokenId(id)) return;
        const t = getToken(model, id);
        if (!t) return;
        t.preview = !!enabled;
      }

      function previewParentId(id) {
        const tid = String(id || "");
        if (/^primary\.(25|50|75|deep)$/.test(tid)) return "primary";
        if (tid === "text.brand") return "primary";
        if (tid === "border.muted") return "border.default";
        if (tid === "overlay.pressed") return "overlay.hover";
        const m = /^functional\.(success|warning|danger|info)\.(bg|text)$/.exec(tid);
        if (m) return `functional.${m[1]}.default`;
        return null;
      }

      function previewChildrenIds(parentId) {
        const pid = String(parentId || "");
        const out = [];
        for (const tok of model.tokens || []) {
          const cid = String(tok?.id || "");
          if (!cid) continue;
          if (previewParentId(cid) === pid) out.push(cid);
        }
        return out;
      }

      function cascadeDisableChildren(parentId) {
        for (const childId of previewChildrenIds(parentId)) {
          setTokenPreview(childId, false);
          cascadeDisableChildren(childId);
        }
      }

      function setTokenHex(id, which, value) {
        const t = getToken(model, id);
        if (!t || tokenType(t) !== "color" || t.ref || t.derive) return;
        const v = normalizeHex(value);
        if (!v) return;
        if (which === "light") t.light = { ...asColorValue(t.light, v, 1), hex: v };
        if (which === "dark") t.dark = { ...asColorValue(t.dark, v, 1), hex: v };
      }

      function setTokenAlpha(id, which, alpha01) {
        const t = getToken(model, id);
        if (!t || tokenType(t) !== "color" || t.ref || t.derive) return;
        const a = normalizeAlpha(alpha01, 1);
        if (which === "light") t.light = { ...asColorValue(t.light, "#000000", 1), alpha: a };
        if (which === "dark") t.dark = { ...asColorValue(t.dark, "#FFFFFF", 1), alpha: a };
      }

	      function syncComputedColorRows(skipId) {
	        if (!editorEl || editorTab !== "color") return;
	        const skip = String(skipId || "");

	        const syncOne = (id, which, v) => {
	          const tokId = cssEscape(id);
	          const hex = normalizeHex(v?.hex) || (which === "dark" ? "#FFFFFF" : "#000000");
	          const colorK = which;
	          const textK = which === "light" ? "lightText" : "darkText";
	          const alphaK = which === "light" ? "lightAlpha" : "darkAlpha";

	          const colorEl = editorEl.querySelector(`input[type="color"][data-id="${tokId}"][data-k="${colorK}"]`);
	          if (colorEl && colorEl instanceof HTMLInputElement) colorEl.value = hex;
	          const textEl = editorEl.querySelector(`input[type="text"][data-id="${tokId}"][data-k="${textK}"]`);
	          if (textEl && textEl instanceof HTMLInputElement) textEl.value = hex.slice(1);

	          const pct = Math.round(normalizeAlpha(v?.alpha, 1) * 100);
	          const rangeEl = editorEl.querySelector(`input[type="range"][data-id="${tokId}"][data-k="${alphaK}"]`);
	          if (rangeEl && rangeEl instanceof HTMLInputElement) {
	            rangeEl.value = String(pct);
	            rangeEl.style.setProperty("--p", `${pct}%`);
	            const n = rangeEl.parentElement?.querySelector?.(".n");
	            if (n) n.textContent = String(pct);
	          }
	        };

	        for (const t of model.tokens || []) {
	          if (!t || tokenType(t) !== "color") continue;
	          const id = String(t.id || "");
	          if (!id || id === skip) continue;
	          if (!t.ref && !t.derive) continue;
	          const light = asColorValue(readTokenValue(model, t, "light"), "#000000", 1);
	          const dark = asColorValue(readTokenValue(model, t, "dark"), "#FFFFFF", 1);
	          syncOne(id, "light", light);
	          syncOne(id, "dark", dark);
	        }
	      }

		      function setTokenNumber(id, which, value) {
		        const t = getToken(model, id);
		        if (!t || tokenType(t) !== "number" || t.ref || t.derive) return null;
		        let n = asNumberValue(value, asNumberValue(t.light, 0));
		        const tid = String(t.id || "");
		        n = Math.round(n);
		        if (tid.startsWith("radius.") || tid.startsWith("space.") || tid.startsWith("type.") || tid.startsWith("motion.") || tid.startsWith("layout.content.") || tid.startsWith("control.")) {
		          n = Math.max(0, n);
		        }
	        if (tid === "layout.grid.gutter") n = Math.max(0, n);
	        if (tid === "layout.grid.columns") n = Math.max(1, n);
	        if (
	          tid === "type.display.weight" ||
	          tid === "type.title.weight" ||
	          tid === "type.body.weight" ||
	          tid === "type.caption.weight"
	        ) {
	          n = Kit.math.clamp(n, 1, 1000);
	        }
		        t.light = n;
		        t.dark = n;
		        return n;
		      }

		      function syncTypeEditorRows() {
		        if (!editorEl || editorTab !== "type") return;

		        const scale = getTypeScale(model, 100);
		        const scalePct = Math.round(((scale - TYPE_SCALE_MIN) / (TYPE_SCALE_MAX - TYPE_SCALE_MIN)) * 100);
		        const range = editorEl.querySelector('input[type="range"][data-id="type.scale"][data-k="typeScale"]');
		        if (range && range instanceof HTMLInputElement) {
		          range.value = String(scale);
		          range.style.setProperty("--p", `${scalePct}%`);
		          const n = range.parentElement?.querySelector?.("[data-type-scale-n]");
		          if (n) n.textContent = `${scale}%`;
		        }

		        const roles = ["display", "title", "body", "caption"];
		        for (const role of roles) {
		          const ids = {
		            size: `type.${role}.size`,
		            lineHeight: `type.${role}.lineHeight`,
		            weight: `type.${role}.weight`,
		          };
		          for (const id of Object.values(ids)) {
		            const tok = getToken(model, id);
		            if (!tok || tokenType(tok) !== "number") continue;
		            const v = readTokenValue(model, tok, "light");
		            if (typeof v !== "number" || !Number.isFinite(v)) continue;
		            const input = editorEl.querySelector(`input[type="number"][data-k="num"][data-id="${cssEscape(id)}"]`);
		            if (!input || !(input instanceof HTMLInputElement)) continue;
		            const normalized = String(Math.round(v));
		            if (input.value !== normalized) input.value = normalized;
		          }
		        }
		      }

	      function setTokenString(id, value) {
	        const t = getToken(model, id);
	        if (!t || tokenType(t) !== "string" || t.ref || t.derive) return null;
	        const v = asStringValue(value, asStringValue(t.light ?? t.value ?? t.dark, ""));
	        t.light = v;
	        t.dark = v;
	        return v;
	      }

      function updateShadowToken(id, which, patch) {
        const t = getToken(model, id);
        if (!t || tokenType(t) !== "shadow" || t.ref || t.derive) return;
        const cur = asShadowValue(t.light ?? t.dark, null);
        const next = { ...cur, ...(patch && typeof patch === "object" ? patch : null) };
        next.x = asNumberValue(next.x, cur.x);
        next.y = asNumberValue(next.y, cur.y);
        next.blur = Math.max(0, asNumberValue(next.blur, cur.blur));
        next.spread = asNumberValue(next.spread, cur.spread);
        const cc = next.color && typeof next.color === "object" ? next.color : cur.color;
        next.color = asColorValue(cc, cur.color?.hex || "#000000", normalizeAlpha(cc?.alpha, cur.color?.alpha ?? 1));
        t.light = next;
        t.dark = next;
      }

      function setShadowNumber(id, which, key, value) {
        const n = asNumberValue(value, 0);
        updateShadowToken(id, which, { [key]: key === "blur" ? Math.max(0, n) : n });
      }

      function setShadowColorHex(id, which, hex) {
        const v = normalizeHex(hex);
        if (!v) return false;
        const t = getToken(model, id);
        const cur = asShadowValue(t?.light ?? t?.dark, null);
        updateShadowToken(id, which, { color: { ...asColorValue(cur.color, "#000000", 0.2), hex: v } });
        return true;
      }

      function setShadowAlpha(id, which, alpha01) {
        const a = normalizeAlpha(alpha01, 1);
        const t = getToken(model, id);
        const cur = asShadowValue(t?.light ?? t?.dark, null);
        updateShadowToken(id, which, { color: { ...asColorValue(cur.color, "#000000", 0.2), alpha: a } });
      }

      function enabledTokenIds() {
        const s = new Set();
        for (const t of model.tokens) if (t && t.preview) s.add(t.id);
        return s;
      }

      function syncPreviewVisibility() {
        const enabled = enabledTokenIds();
        const nodes = previewEl?.querySelectorAll?.("[data-needs],[data-needs-any]") || [];
        for (const el of nodes) {
          const needsAll = String(el.dataset.needs || "")
            .split(/\s+/)
            .filter(Boolean);
          const needsAny = String(el.dataset.needsAny || "")
            .split(/\s+/)
            .filter(Boolean);

          let show = true;
          if (needsAll.length) show = needsAll.every((id) => enabled.has(id));
          if (show && needsAny.length) show = needsAny.some((id) => enabled.has(id));
          if (!needsAll.length && !needsAny.length) show = true;
          el.style.display = show ? "" : "none";
        }
      }

	      function syncHoverOverlay() {
	        const enabled = enabledTokenIds();
	        const shouldHover = enabled.has("overlay.hover");
	        const nodes = previewEl?.querySelectorAll?.("[data-hover]") || [];
	        for (const el of nodes) {
	          el.classList.toggle("hover", shouldHover);
	        }
	      }

	      function syncModalOverlay() {
	        const enabled = enabledTokenIds();
	        const shouldShow = enabled.has("overlay.scrim");
	        const modal = previewEl?.querySelector?.(".ucs-modal");
	        if (!modal) return;
	        modal.classList.toggle("is-on", shouldShow);
	        modal.setAttribute("aria-hidden", shouldShow ? "false" : "true");
	      }

	      function aiTokenSpec(token) {
	        const t = token && typeof token === "object" ? token : null;
	        if (!t) return null;
	        const type = tokenType(t);
	        const out = {
	          id: String(t.id || ""),
	          title: String(t.title || t.id || ""),
	          group: String(t.group || ""),
	          type,
	        };
	        if (t.desc) out.desc = String(t.desc);
	        if (t.preview !== undefined) out.preview = !!t.preview;
	        if (t.custom) out.custom = true;
	        if (t.ref) out.ref = String(t.ref);
	        if (t.derive && typeof t.derive === "object") out.derive = t.derive;

	        if (type === "color") {
	          const l = asColorValue(readTokenValue(model, t, "light"), "#000000", 1);
	          const d = asColorValue(readTokenValue(model, t, "dark"), "#000000", 1);
	          out.modes = {
	            light: { hex: normalizeHex(l.hex) || l.hex, alpha: normalizeAlpha(l.alpha, 1) },
	            dark: { hex: normalizeHex(d.hex) || d.hex, alpha: normalizeAlpha(d.alpha, 1) },
	          };
	          return out;
	        }

		        if (type === "number") {
		          const v = readTokenValue(model, t, "light");
		          out.unit = typeof t.unit === "string" ? t.unit : "px";
		          out.value = asNumberValue(v, 0);
		          return out;
		        }

		        if (type === "string") {
		          const v = readTokenValue(model, t, "light");
		          out.value = asStringValue(v, "");
		          return out;
		        }

		        if (type === "shadow") {
		          const v = asShadowValue(readTokenValue(model, t, "light"), null);
		          out.unit = "px";
		          out.value = {
	            x: asNumberValue(v.x, 0),
	            y: asNumberValue(v.y, 0),
	            blur: Math.max(0, asNumberValue(v.blur, 0)),
	            spread: asNumberValue(v.spread, 0),
	            color: { hex: normalizeHex(v.color?.hex) || (v.color?.hex || "#000000"), alpha: normalizeAlpha(v.color?.alpha, 1) },
	          };
	          return out;
	        }

	        return out;
	      }

	      function exportAiSpec(tokens, { category } = {}) {
	        const list = Array.isArray(tokens) ? tokens : [];
	        const payload = {
	          schema: "haao.ui-design-system.v1",
	          exportedAt: new Date().toISOString(),
	          tokens: list.map(aiTokenSpec).filter(Boolean),
	        };
	        if (category) payload.category = String(category);
	        return payload;
	      }

	      function exportCurrent() {
	        if (editorTab === "color") {
	          const modeName = mode === "dark" ? "Dark" : "Light";
	          const json = figmaVariablesModeExport(model, modeName, mode);
	          downloadJson(`haao-ui-colors-${mode}.json`, json);
	          return;
	        }
	        const tokens = (model.tokens || []).filter(tokenInEditorTab);
	        const json = exportAiSpec(tokens, { category: editorTab });
	        const name =
	          editorTab === "type"
	            ? "typography"
	            : editorTab === "appearance"
	              ? "appearance"
	              : editorTab === "motion"
	                ? "interaction"
	                : editorTab;
	        downloadJson(`haao-ui-${name}.json`, json);
	      }

	      function exportAllSpec() {
	        const json = exportAiSpec(model.tokens || [], { category: "all" });
	        downloadJson("haao-ui-design-system.json", json);
	      }

	      function customTextTokens() {
	        const builtin = new Set([
	          "text.primary",
	          "text.secondary",
	          "text.tertiary",
	          "text.brand",
	          "text.inverse",
	          "text.black",
	          "text.white",
	        ]);
	        return (model.tokens || []).filter((t) => {
	          if (!t || typeof t !== "object") return false;
	          const id = String(t.id || "");
	          if (!id || builtin.has(id)) return false;
	          if (!id.startsWith("text")) return false;
	          if (!t.custom) return false;
	          return true;
	        });
	      }

		      function renderCustomTextSamples() {
		        if (!typographyCardEl || !textSamplesEl || !customTextListEl) return;

		        const tokens = customTextTokens();
		        const ids = tokens.map((t) => String(t.id || "")).filter(Boolean);

	        const baseNeeds = [
	          "text.primary",
	          "text.secondary",
	          "text.tertiary",
	          "text.brand",
	          "text.inverse",
	          "text.black",
	          "text.white",
	          "primary.deep",
	        ];
		        typographyCardEl.dataset.needsAny = Array.from(new Set(baseNeeds.concat(ids))).join(" ");
		        delete typographyCardEl.dataset.needs;
		        textSamplesEl.dataset.needsAny = Array.from(new Set(["text.black", "text.white"].concat(ids))).join(" ");
		        delete textSamplesEl.dataset.needs;

	        const list = tokens
	          .map((t) => {
	            const v = readTokenValue(model, t, mode);
	            const hex = normalizeHex(v.hex) || (mode === "dark" ? "#FFFFFF" : "#000000");
	            const lum = relativeLuminance(hex);
	            return { t, v: { ...v, hex }, lum };
	          })
	          .sort((a, b) => a.lum - b.lum);

	        customTextListEl.replaceChildren();
	        for (const item of list) {
	          const row = document.createElement("div");
	          row.className = "ucs-text-sample";
	          row.dataset.needs = String(item.t.id || "");
	          if (item.lum > 0.72) row.classList.add("on-dark");

	          const name = document.createElement("span");
	          name.className = "name";
	          name.textContent = String(item.t.title || item.t.id || "text");

	          const sample = document.createElement("span");
	          sample.className = "sample";
	          sample.textContent = "这是一段用于预览自定义文字色的示例文本：适合用于标签、强调或局部信息，但不建议替代主正文角色。";
	          sample.style.color = rgbaCss(item.v.hex, item.v.alpha);

	          row.appendChild(name);
	          row.appendChild(sample);
	          customTextListEl.appendChild(row);
	        }
	      }

		      function refreshPreview({ heatmap = false } = {}) {
		        applyPreviewVars(previewEl, model, mode, enabledTokenIds());
		        renderCustomTextSamples();
		        syncPreviewVisibility();
		        syncHoverOverlay();
		        syncModalOverlay();
		        schedulePreviewLayout();
		        if (heatmap) renderHeatmap();
		      }

	      let layoutRaf = 0;
	      function schedulePreviewLayout() {
	        if (!previewEl) return;
	        window.cancelAnimationFrame(layoutRaf);
	        layoutRaf = window.requestAnimationFrame(() => {
	          layoutRaf = 0;
	          layoutPreviewMasonry();
	        });
	      }

		      function layoutPreviewMasonry() {
		        const grid = previewEl.querySelector("[data-preview-scroll]");
		        if (!grid) return;
		        const styles = window.getComputedStyle(grid);
		        const rh = parseFloat(styles.gridAutoRows);
		        const rowHeight = Number.isFinite(rh) && rh > 0 ? rh : 8;

		        const rg = parseFloat(styles.rowGap);
		        const gg = parseFloat(styles.gap);
		        const rowGap = Number.isFinite(rg) ? rg : Number.isFinite(gg) ? gg : 14;

		        const items = Array.from(grid.querySelectorAll(".ucs-card2"));
		        for (const el of items) {
		          if (!(el instanceof HTMLElement)) continue;
		          if (el.getClientRects().length === 0) {
		            el.style.gridRowEnd = "";
	            continue;
	          }
	          el.style.gridRowEnd = "auto";
	        }
		        for (const el of items) {
		          if (!(el instanceof HTMLElement)) continue;
		          if (el.getClientRects().length === 0) continue;
			          // In a fixed-row grid, getBoundingClientRect().height reflects the *current grid area height* (often 1 row),
			          // so we must use the content height to calculate correct row spans.
			          const h = el.scrollHeight;
			          const span = Math.max(1, Math.ceil((h + rowGap) / (rowHeight + rowGap)));
			          el.style.gridRowEnd = `span ${span}`;
			        }
			      }

		      function renderHeatmap() {
		        const heatEl = previewEl?.querySelector?.("[data-heatmap]");
		        if (!heatEl) return;

	        const countEl = previewEl?.querySelector?.("[data-heatmap-count]");
	        const rows = 7;
	        const cols = 52;

	        heatEl.replaceChildren();

	        let seed = 1337;
	        const rand = () => {
	          seed = (seed * 1664525 + 1013904223) >>> 0;
	          return seed / 4294967296;
	        };

	        let active = 0;
	        for (let c = 0; c < cols; c += 1) {
	          const x = c / Math.max(1, cols - 1);
	          const cluster = Math.exp(-x * 3.1);
	          const p = 0.06 + 0.62 * cluster;

	          for (let r = 0; r < rows; r += 1) {
	            const cell = document.createElement("span");
	            let lv = 0;

	            if (rand() < p) {
	              const strength = rand() * (0.45 + 0.55 * cluster) + 0.08 * cluster;
	              if (strength < 0.18) lv = 1;
	              else if (strength < 0.36) lv = 2;
	              else if (strength < 0.58) lv = 3;
	              else if (strength < 0.78) lv = 4;
	              else lv = 5;
	              active += 1;
	            }

	            cell.className = `cell lv${lv}`;
	            heatEl.appendChild(cell);
	          }
	        }

		        if (countEl) countEl.textContent = `${active}天`;
		      }

		      function stepNumberInput(inputEl, { dir, step }) {
		        if (!(inputEl instanceof HTMLInputElement)) return;
		        if (inputEl.type !== "number") return;
		        if (inputEl.disabled || inputEl.readOnly) return;

		        const id = inputEl.dataset.id;
		        const k = inputEl.dataset.k;
		        if (!id || !k) return;

		        const cur = parseFloat(String(inputEl.value ?? ""));
		        let next = (Number.isFinite(cur) ? cur : 0) + dir * step;

		        const min = parseFloat(String(inputEl.min ?? ""));
		        const max = parseFloat(String(inputEl.max ?? ""));
		        if (Number.isFinite(min)) next = Math.max(next, min);
		        if (Number.isFinite(max)) next = Math.min(next, max);

			        inputEl.value = String(Math.round(next));

		        if (k === "num" && editorTab === "type" && isTypeScaledId(id)) {
		          setTypeScaledDeltaFromValue(model, id, next);
		          applyTypeScaleToModel(model);
		          syncTypeEditorRows();
		          refreshPreview();
		          saveModel(model);
		          return;
		        }

		        inputEl.dispatchEvent(new Event("input", { bubbles: true }));
		      }

		      function wireEditorEvents() {
		        let focusTimer = 0;
		        let lastFocusEl = null;
	
	        const needsCount = (el) =>
	          String(el?.dataset?.needs || "")
	            .split(/\s+/)
	            .filter(Boolean).length +
	          String(el?.dataset?.needsAny || "")
	            .split(/\s+/)
	            .filter(Boolean).length;
	        const depth = (el) => {
	          let d = 0;
	          let cur = el;
	          while (cur && cur !== previewEl) {
	            d += 1;
	            cur = cur.parentElement;
	          }
	          return d;
	        };
	
	        const focusEl = (el) => {
	          if (!el) return;
	          if (lastFocusEl && lastFocusEl !== el) lastFocusEl.classList.remove("ucs-focus");
	          lastFocusEl = el;
	          el.classList.add("ucs-focus");
	          window.clearTimeout(focusTimer);
	          focusTimer = window.setTimeout(() => {
	            el.classList.remove("ucs-focus");
	            if (lastFocusEl === el) lastFocusEl = null;
	          }, 1200);
	        };
	
	        const bestPreviewElForToken = (id) => {
	          if (!previewEl) return null;
	          const tid0 = String(id || "");
	          if (tid0 === "divider.default") return previewEl.querySelector(".ucs-datatable") || previewEl.querySelector(".ucs-popover .sep");
	          const q = `[data-needs~="${cssEscape(id)}"],[data-needs-any~="${cssEscape(id)}"]`;
	          const all = Array.from(previewEl.querySelectorAll(q));
	          if (all.length === 0) {
		            // Fallback for tokens that don't participate in data-needs visibility (e.g. radius/spacing).
		            const tid = String(id || "");
		            if (tid.startsWith("background.")) return previewEl.querySelector("[data-preview-scroll]") || previewEl.querySelector(".ucs-preview-scroll");
		            if (tid === "overlay.scrim") return previewEl.querySelector(".ucs-modal") || previewEl.querySelector("[data-preview-scroll]");
		            if (tid.startsWith("space.canvas.")) return previewEl.querySelector("[data-preview-scroll]") || previewEl.querySelector(".ucs-preview-scroll");
		            if (tid.startsWith("layout.")) return previewEl.querySelector("[data-preview-scroll]") || previewEl.querySelector(".ucs-preview-scroll");
		            if (tid.startsWith("type.")) return previewEl.querySelector("[data-typography-card]") || previewEl.querySelector(".ucs-type");
		            if (tid.startsWith("control.")) return previewEl.querySelector(".ucs-input") || previewEl.querySelector(".ucs-btn.sm") || previewEl.querySelector(".ucs-btn");
		            if (tid.startsWith("motion.")) return previewEl.querySelector(".ucs-states") || previewEl.querySelector(".ucs-btn");
	            if (tid === "space.grid.gap") return previewEl.querySelector(".ucs-row2") || previewEl.querySelector(".ucs-grid") || previewEl.querySelector(".ucs-layer-grid");
	            if (tid === "space.card.padding") return previewEl.querySelector(".ucs-card2");
	            if (tid === "radius.card") return previewEl.querySelector(".ucs-card2") || previewEl.querySelector(".ucs-frame");
	            if (tid === "radius.control") return previewEl.querySelector(".ucs-input") || previewEl.querySelector(".ucs-toast") || previewEl.querySelector(".ucs-item");
	            if (tid === "radius.button") return previewEl.querySelector(".ucs-btn") || previewEl.querySelector(".ucs-type .inverse");
	            return null;
	          }
	          const visible = all.filter((el) => el.getClientRects().length > 0);
	          const list = visible.length ? visible : all;
	          list.sort((a, b) => {
	            const na = needsCount(a);
	            const nb = needsCount(b);
	            if (na !== nb) return na - nb;
	            return depth(b) - depth(a);
	          });
	          return list[0] || null;
	        };
	
			        editorEl.addEventListener("click", (e) => {
			          const t = e.target;
			          if (!(t instanceof HTMLElement)) return;

			          const stepBtn = t.closest?.('button[data-k="stepUp"],button[data-k="stepDown"]');
			          if (stepBtn && stepBtn instanceof HTMLButtonElement) {
			            const wrap = stepBtn.closest?.(".ucs-num");
			            const inputEl = wrap?.querySelector?.('input[type="number"][data-id][data-k]');
			            if (inputEl instanceof HTMLInputElement) {
			              const dir = stepBtn.dataset.k === "stepUp" ? 1 : -1;
			              const step = e.shiftKey ? 10 : 1;
			              stepNumberInput(inputEl, { dir, step });
			              if (document.activeElement !== inputEl) {
			                suppressEditorSelectUntil = performance.now() + 250;
			                inputEl.focus({ preventScroll: true });
			              }
			            }
			            return;
			          }

		          const groupBtn = t.closest?.('button[data-k="groupToggle"][data-group]');
		          if (groupBtn && groupBtn instanceof HTMLButtonElement) {
		            const groupName = groupBtn.dataset.group;
		            if (!groupName) return;
	            const next = !isGroupCollapsed(editorTab, groupName);
	            setGroupCollapsed(editorTab, groupName, next);
	            withEditorScrollPreserved(() => renderEditor());
	            return;
	          }

	          const btn = t.closest?.('button[data-k][data-id]');
	          if (!btn) return;
	          const k = btn.dataset.k;
	          const id = btn.dataset.id;
	          if (!id) return;

	          if (k === "delete") {
	            const token = getToken(model, id);
	            const name = String(token?.title || id);
	            if (!window.confirm(`删除「${name}」？`)) return;
	            model.tokens = (model.tokens || []).filter((x) => String(x?.id || "") !== id);
	            saveModel(model);
	            renderEditor();
	            refreshPreview();
	            setStatus("已删除");
	            return;
	          }
	          if (k !== "locate") return;
	
		          const cb = editorEl.querySelector(`input[type="checkbox"][data-k="preview"][data-id="${cssEscape(id)}"]`);
		          if (cb && cb instanceof HTMLInputElement && !cb.checked) {
		            cb.checked = true;
		            const row = cb.closest?.(".ucs-row.token");
		            if (row) row.classList.add("checked");
	            setTokenPreview(id, true);
	            const parent = previewParentId(id);
	            if (parent) setTokenPreview(parent, true);
	            saveModel(model);
	            renderEditor();
	          }
	
	          refreshPreview();
	
	          const node = bestPreviewElForToken(id);
	          if (!node) {
	            setStatus("未找到该 Token 的预览位置");
	            return;
	          }
	          node.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
	          focusEl(node);
	        });
	
		        editorEl.addEventListener("input", (e) => {
		          const el = e.target;
		          if (!(el instanceof HTMLInputElement)) return;
		          const id = el.dataset.id;
	          const k = el.dataset.k;
	          if (!id || !k) return;

		          if (k === "typeScale") {
		            const n = setTokenNumber(id, "light", el.value);
		            if (typeof n === "number" && Number.isFinite(n)) {
		              const normalized = String(clampNumber(Math.round(n), TYPE_SCALE_MIN, TYPE_SCALE_MAX));
		              if (el.value !== normalized) el.value = normalized;
		            }
		            applyTypeScaleToModel(model);
		            syncTypeEditorRows();
		            refreshPreview();
		            saveModel(model);
		            return;
		          }

			          if (k === "num") {
			            if (editorTab === "type" && isTypeScaledId(id)) return;
			            const n = setTokenNumber(id, "light", el.value);
			            if (typeof n === "number" && Number.isFinite(n)) {
			              const normalized = String(n);
			              if (el.value !== normalized) el.value = normalized;
		            }
		            refreshPreview();
		            saveModel(model);
		            return;
		          }

	          if (k === "str") {
	            setTokenString(id, el.value);
	            refreshPreview();
	            saveModel(model);
	            return;
	          }

          const shadowNumSingle = /^shadow(X|Y|Blur|Spread)$/.exec(k);
          if (shadowNumSingle) {
            const key = shadowNumSingle[1].toLowerCase();
            const raw = parseFloat(String(el.value ?? ""));
            if (key === "blur" && Number.isFinite(raw) && raw < 0) el.value = "0";
            setShadowNumber(id, "light", key, el.value);
            refreshPreview();
            saveModel(model);
            return;
          }

          if (k === "shadowColor") {
            setShadowColorHex(id, "light", el.value);
            refreshPreview();
            saveModel(model);
            return;
          }

          if (k === "shadowColorText") {
            const v = normalizeHex(el.value);
            if (!v) return;
            setShadowColorHex(id, "light", v);
            refreshPreview();
            saveModel(model);
            return;
          }

          if (k === "shadowAlpha") {
            const pct = Kit.math.clamp(parseInt(el.value || "100", 10), 0, 100);
            el.style.setProperty("--p", `${pct}%`);
            const n = el.parentElement?.querySelector?.(".n");
            if (n) n.textContent = String(pct);
            setShadowAlpha(id, "light", pct / 100);
            refreshPreview();
            saveModel(model);
            return;
          }

          if (k === "lightNum" || k === "darkNum") {
            const which = k === "lightNum" ? "light" : "dark";
            const raw = parseFloat(String(el.value ?? ""));
            if (Number.isFinite(raw) && raw < 0) el.value = "0";
            setTokenNumber(id, which, el.value);
            refreshPreview();
            saveModel(model);
            return;
          }

          const shadowNumMatch = /^(light|dark)Shadow(X|Y|Blur|Spread)$/.exec(k);
          if (shadowNumMatch) {
            const which = shadowNumMatch[1] === "dark" ? "dark" : "light";
            const key = shadowNumMatch[2].toLowerCase();
            const raw = parseFloat(String(el.value ?? ""));
            if (key === "blur" && Number.isFinite(raw) && raw < 0) el.value = "0";
            setShadowNumber(id, which, key, el.value);
            refreshPreview();
            saveModel(model);
            return;
          }

          if (k === "lightShadowColor" || k === "darkShadowColor") {
            const which = k.startsWith("dark") ? "dark" : "light";
            setShadowColorHex(id, which, el.value);
            refreshPreview();
            saveModel(model);
            return;
          }

          if (k === "lightShadowColorText" || k === "darkShadowColorText") {
            const which = k.startsWith("dark") ? "dark" : "light";
            const v = normalizeHex(el.value);
            if (!v) return;
            setShadowColorHex(id, which, v);
            refreshPreview();
            saveModel(model);
            return;
          }

          if (k === "lightShadowAlpha" || k === "darkShadowAlpha") {
            const which = k.startsWith("dark") ? "dark" : "light";
            const pct = Kit.math.clamp(parseInt(el.value || "100", 10), 0, 100);
            el.style.setProperty("--p", `${pct}%`);
            const n = el.parentElement?.querySelector?.(".n");
            if (n) n.textContent = String(pct);
            setShadowAlpha(id, which, pct / 100);
            refreshPreview();
            saveModel(model);
            return;
          }

          if (k === "light" || k === "dark") {
            setTokenHex(id, k, el.value);
            refreshPreview();
            syncComputedColorRows(id);
            saveModel(model);
            return;
          }

          if (k === "lightText" || k === "darkText") {
            const which = k === "lightText" ? "light" : "dark";
            const v = normalizeHex(el.value);
            if (!v) return;
            setTokenHex(id, which, v);
            refreshPreview();
            syncComputedColorRows(id);
            saveModel(model);
            return;
          }

          if (k === "lightAlpha" || k === "darkAlpha") {
            const which = k === "lightAlpha" ? "light" : "dark";
            const pct = Kit.math.clamp(parseInt(el.value || "100", 10), 0, 100);
            el.style.setProperty("--p", `${pct}%`);
            const n = el.parentElement?.querySelector?.(".n");
            if (n) n.textContent = String(pct);
            setTokenAlpha(id, which, pct / 100);
            refreshPreview();
            syncComputedColorRows(id);
            saveModel(model);
            return;
          }
        });

	        editorEl.addEventListener("change", (e) => {
	          const el = e.target;
	          if (!(el instanceof HTMLInputElement)) return;
	          const id = el.dataset.id;
	          const k = el.dataset.k;
	          if (!id || !k) return;

	          if (k === "num" && editorTab === "type" && isTypeScaledId(id)) {
	            const desired = parseFloat(String(el.value ?? ""));
	            if (!Number.isFinite(desired)) return;
	            setTypeScaledDeltaFromValue(model, id, desired);
	            applyTypeScaleToModel(model);
	            syncTypeEditorRows();
	            refreshPreview();
	            saveModel(model);
	            return;
	          }

		          if (k === "preview") {
		            const checked = !!el.checked;
		            if (!checked && isRequiredTokenId(id)) {
		              el.checked = true;
	              setStatus(requiredHintForTokenId(id));
	              return;
	            }
	            setTokenPreview(id, checked);
	            if (!checked) {
	              cascadeDisableChildren(id);
	            } else {
	              const parent = previewParentId(id);
	              if (parent) setTokenPreview(parent, true);
	            }
	            renderEditor();
	            refreshPreview();
	            saveModel(model);
	            return;
	          }

          if (k === "lightText" || k === "darkText") {
            const v = normalizeHex(el.value);
            if (!v) {
              el.value = "";
              setStatus("无效色值：请使用 6 位 HEX（如 FFFFFF）");
              return;
            }
            el.value = v.slice(1);
            persistAndRefresh();
          }

          if (k === "lightShadowColorText" || k === "darkShadowColorText") {
            const which = k.startsWith("dark") ? "dark" : "light";
            const v = normalizeHex(el.value);
            if (!v) {
              el.value = "";
              setStatus("无效色值：请使用 6 位 HEX（如 000000）");
              return;
            }
            el.value = v.slice(1);
            setShadowColorHex(id, which, v);
            persistAndRefresh();
          }

          if (k === "shadowColorText") {
            const v = normalizeHex(el.value);
            if (!v) {
              el.value = "";
              setStatus("无效色值：请使用 6 位 HEX（如 000000）");
              return;
            }
            el.value = v.slice(1);
            setShadowColorHex(id, "light", v);
            persistAndRefresh();
          }
        });
      }

      function wirePreviewEvents() {
        if (!previewEl) return;
        tokenPopEl.addEventListener("click", (e) => {
          const t = e.target;
          if (!(t instanceof HTMLElement)) return;
          const btn = t.closest?.("button[data-k]");
          const action = btn?.dataset?.k;
          if (action === "tokenClose") {
            setTokenPopVisible(false);
            return;
          }
          if (action === "tokenMore") {
            tokenPopExpanded = true;
            renderTokenPop();
            positionTokenPop();
            return;
          }
          if (action === "tokenLess") {
            tokenPopExpanded = false;
            renderTokenPop();
            positionTokenPop();
            return;
          }
          if (!btn || !(btn instanceof HTMLButtonElement)) return;
          if (btn.dataset.k !== "tokenPick") return;
          const id = btn.dataset.token;
          if (!id) return;
          locateTokenInEditor(id);
        });

        const scrollEl = previewEl.querySelector("[data-preview-scroll]");
        scrollEl?.addEventListener?.(
          "scroll",
          () => {
            if (tokenPopEl.style.display !== "none") positionTokenPop();
          },
          { passive: true }
        );

        previewEl.addEventListener("click", (e) => {
          const t = e.target;
          if (!(t instanceof HTMLElement)) return;

          const closeBtn = t.closest?.('[data-modal="close-scrim"]');
          const scrim = t.closest?.('[data-modal="scrim"]');
          if ((closeBtn || scrim) && getToken(model, "overlay.scrim")?.preview) {
            setTokenPreview("overlay.scrim", false);
            renderEditor();
            refreshPreview();
            saveModel(model);
            return;
          }

          const anchor = findNeedsAnchor(t, e);
          const ids = anchor ? tokensForAnchor(anchor) : [];

          if (anchor && ids.length) {
            if (tokenPopEl.style.display !== "none" && tokenPopAnchorEl === anchor) {
              setTokenPopVisible(false);
              return;
            }
            tokenPopAnchorEl = anchor;
            tokenPopTokenIds = ids;
            tokenPopExpanded = false;
            setTokenPopVisible(true);
            return;
          }

          if (tokenPopEl.style.display !== "none") setTokenPopVisible(false);
        });

        if (!tokenPopDocPointerHandler) {
          tokenPopDocPointerHandler = (e) => {
            if (tokenPopEl.style.display === "none") return;
            const t = e.target;
            if (!(t instanceof Node)) return;
            if (tokenPopEl.contains(t)) return;
            if (previewEl.contains(t)) return;
            setTokenPopVisible(false);
          };
          document.addEventListener("pointerdown", tokenPopDocPointerHandler, { capture: true });
        }

        if (!tokenPopDocKeyHandler) {
          tokenPopDocKeyHandler = (e) => {
            if (e.key !== "Escape") return;
            if (tokenPopEl.style.display === "none") return;
            e.preventDefault();
            setTokenPopVisible(false);
          };
          document.addEventListener("keydown", tokenPopDocKeyHandler);
        }
      }

			      function wirePreviewLayoutEvents() {
			        const onResize = () => {
			          applySplitRightW(getSplitRightW());
			          if (tokenPopEl.style.display !== "none") positionTokenPop();
			          schedulePreviewLayout();
			        };
		        window.addEventListener("resize", onResize);
		        return () => window.removeEventListener("resize", onResize);
		      }

			      function wireSplitResize() {
			        if (!rootEl || !(rootEl instanceof HTMLElement)) return;
			        if (!splitResizeEl || !(splitResizeEl instanceof HTMLElement)) return;

			        applySplitRightW(getSplitRightW());

			        splitResizeEl.addEventListener("pointerdown", (e) => {
			          e.preventDefault();
			          e.stopPropagation();

			          const startX = e.clientX;
			          const startW = getSplitRightW();

			          const prevCursor = document.body.style.cursor;
			          const prevSelect = document.body.style.userSelect;
			          document.body.style.cursor = "col-resize";
			          document.body.style.userSelect = "none";

			          const onMove = (ev) => {
			            applySplitRightW(startW - (ev.clientX - startX));
			          };

			          const onUp = () => {
			            window.removeEventListener("pointermove", onMove);
			            document.body.style.cursor = prevCursor;
			            document.body.style.userSelect = prevSelect;
			            saveUiState();
			          };

			          window.addEventListener("pointermove", onMove);
			          window.addEventListener("pointerup", onUp, { once: true });
			        });
			      }

		      function wireEditorTabs() {
			        let activeEditingRow = null;

		        tabsEl?.addEventListener("click", (e) => {
		          const t = e.target;
		          if (!(t instanceof HTMLElement)) return;
		          const btn = t.closest?.("button[data-tab]");
	          if (!btn) return;
	          const key = String(btn.dataset.tab || "");
	          setEditorTab(key);
	        });

		        editorEl.addEventListener("pointerdown", (e) => {
		          const t = e.target;
		          if (!(t instanceof HTMLElement)) return;
		          const stepBtn = t.closest?.('button[data-k="stepUp"],button[data-k="stepDown"]');
		          if (stepBtn) {
		            // Prevent the button from stealing focus (avoids selection flashing).
		            e.preventDefault();
		            return;
		          }
		          const handle = t.closest?.('[data-k="colResize"]');
		          if (!handle) return;
		          const table = handle.closest?.(".ucs-table");
		          if (!table || !(table instanceof HTMLElement)) return;

	          e.preventDefault();

	          const rect = table.getBoundingClientRect();
	          const startX = e.clientX;
	          const startW = getEditorNameColPx();
	          const minW = 160;
	          const reserve = 320;
	          const maxW = Math.max(minW, Math.min(520, rect.width - reserve));

	          const setW = (w) => {
	            const next = clampNumber(Math.round(w), minW, maxW);
	            table.style.setProperty("--ucs-col-name", `${next}px`);
	            uiState.editor.nameColPx = next;
	          };

	          setW(startW);

	          const prevCursor = document.body.style.cursor;
	          const prevSelect = document.body.style.userSelect;
	          document.body.style.cursor = "col-resize";
	          document.body.style.userSelect = "none";

	          const onMove = (ev) => {
	            setW(startW + (ev.clientX - startX));
	          };

	          const onUp = () => {
	            window.removeEventListener("pointermove", onMove);
	            document.body.style.cursor = prevCursor;
	            document.body.style.userSelect = prevSelect;
	            saveUiState();
	          };

			          window.addEventListener("pointermove", onMove);
			          window.addEventListener("pointerup", onUp, { once: true });
			        });

		        editorEl.addEventListener("keydown", (e) => {
		          const el = e.target;
		          if (!(el instanceof HTMLInputElement)) return;
		          if (el.type !== "number") return;
		          if (el.disabled || el.readOnly) return;
		          const id = el.dataset.id;
		          const k = el.dataset.k;
		          if (!id || !k) return;
		          if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;

		          e.preventDefault();

		          const dir = e.key === "ArrowUp" ? 1 : -1;
		          const step = e.shiftKey ? 10 : 1;
		          stepNumberInput(el, { dir, step });
		        });

			        editorEl.addEventListener("focusin", (e) => {
			          const el = e.target;
			          if (!(el instanceof HTMLInputElement)) return;
		          const row = el.closest?.(".ucs-row.token");
		          if (row && row instanceof HTMLElement) {
		            if (activeEditingRow && activeEditingRow !== row) activeEditingRow.classList.remove("is-editing");
		            row.classList.add("is-editing");
		            activeEditingRow = row;
		          }

			          if (el.type !== "number" && el.type !== "text") return;
			          if (el.disabled || el.readOnly) return;
			          if (performance.now() < suppressEditorSelectUntil) return;
			          window.requestAnimationFrame(() => {
			            try {
			              el.select();
		            } catch (err) {
		              // ignore
		            }
		          });
		        });

		        editorEl.addEventListener("focusout", () => {
		          const row = activeEditingRow;
		          if (!row) return;
		          window.setTimeout(() => {
		            const ae = document.activeElement;
		            if (!(ae instanceof HTMLElement) || !row.contains(ae)) {
		              row.classList.remove("is-editing");
		              if (activeEditingRow === row) activeEditingRow = null;
		            }
		          }, 0);
		        });
		      }

      function wireActions() {
        const btnReset = contentEl.querySelector("[data-reset]");
        const btnAddText = contentEl.querySelector("[data-add-text]");
        const btnExportCurrent = contentEl.querySelector("[data-export-current]");
        const btnExportAll = contentEl.querySelector("[data-export-all]");
        const btns = contentEl.querySelector("[data-actions]");

        btns?.addEventListener("click", (e) => {
          const t = e.target;
          if (!(t instanceof HTMLElement)) return;
          if (t === btnReset) {
            model = defaultModel();
            saveModel(model);
            renderEditor();
            refreshPreview({ heatmap: true });
            setStatus("");
          }
          if (t === btnAddText) {
            const open = String(addWrapEl?.style?.display || "") !== "none";
            if (open) hideAddTextForm();
            else showAddTextForm();
          }
          if (t === btnExportCurrent) exportCurrent();
          if (t === btnExportAll) exportAllSpec();
        });

        addWrapEl?.addEventListener("click", (e) => {
          const t = e.target;
          if (!(t instanceof HTMLElement)) return;
          const btn = t.closest?.("button[data-add]");
          if (!btn) return;
          const action = btn.dataset.add;

          if (action === "cancel") {
            hideAddTextForm();
            return;
          }

          if (action !== "confirm") return;

          const idInput = addWrapEl.querySelector('input[data-add="id"]');
          const lightInput = addWrapEl.querySelector('input[data-add="light"]');
          const darkInput = addWrapEl.querySelector('input[data-add="dark"]');
          if (!(idInput instanceof HTMLInputElement) || !(lightInput instanceof HTMLInputElement) || !(darkInput instanceof HTMLInputElement)) return;

          const proposed = normalizeCustomTextId(idInput.value) || nextCustomTextId();
          if (!proposed) {
            setStatus("变量名无效");
            return;
          }
          if ((model.tokens || []).some((x) => String(x?.id || "") === proposed)) {
            setStatus("变量名已存在");
            return;
          }

          const lightHex = normalizeHex(lightInput.value);
          if (!lightHex) {
            setStatus("无效亮色 HEX：请使用 6 位 HEX（如 1A1A1A）");
            return;
          }
          const darkHex = normalizeHex(darkInput.value || lightHex);
          if (!darkHex) {
            setStatus("无效暗色 HEX：请使用 6 位 HEX（如 E6E6E6）");
            return;
          }

          model.tokens.push({
            id: proposed,
            title: proposed,
            group: "文字色",
            desc: "自定义文字色（按亮度排序展示）。",
            light: { hex: lightHex, alpha: 1 },
            dark: { hex: darkHex, alpha: 1 },
            preview: true,
            custom: true,
          });
          saveModel(model);
          renderEditor();
          refreshPreview();
          hideAddTextForm();
          setStatus("");
        });

        for (const btn of modeButtons) {
          btn.addEventListener("click", () => setMode(btn.dataset.mode));
        }
      }

			      renderEditor();
			      wireEditorEvents();
			      wirePreviewEvents();
			      wireSplitResize();
			      const unbindLayout = wirePreviewLayoutEvents();
			      wireEditorTabs();
			      wireActions();
			      setMode("light");

      actionsEl.replaceChildren();

	      return () => {
			        unbindLayout?.();
			        setTokenPopVisible(false);
			        if (tokenPopDocPointerHandler) {
			          document.removeEventListener("pointerdown", tokenPopDocPointerHandler, { capture: true });
			          tokenPopDocPointerHandler = null;
			        }
			        if (tokenPopDocKeyHandler) {
			          document.removeEventListener("keydown", tokenPopDocKeyHandler);
			          tokenPopDocKeyHandler = null;
			        }
			        tokenPopEl?.remove?.();
	      };
    },
  });
})();
