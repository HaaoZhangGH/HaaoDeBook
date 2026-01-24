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

  function ensureStyles() {
    Kit.css.ensureStyleOnce(
      STYLE_ID,
      `
	.ucs-root{padding:var(--space-16);display:grid;grid-template-columns:1.15fr .85fr;grid-template-rows:minmax(0,1fr);gap:var(--space-16);height:100%;min-height:0}
.ucs-card{border:1px solid var(--stroke-2);border-radius:var(--radius-16);background:var(--glass);overflow:hidden}
.ucs-card-h{padding:14px 16px;border-bottom:1px solid var(--stroke-2);display:flex;align-items:center;justify-content:space-between;gap:var(--space-12)}
.ucs-card-t{font-size:var(--fs-title);font-weight:750;letter-spacing:.2px}
.ucs-card-b{padding:var(--space-12) var(--space-14)}
.ucs-token-card{display:flex;flex-direction:column;min-height:0}
.ucs-token-card .ucs-card-b{flex:1;overflow:auto;scrollbar-gutter:stable}
.ucs-table{border:1px solid rgba(255,255,255,.10);border-radius:18px;overflow:hidden;background:rgba(0,0,0,.10)}
.ucs-row{display:grid;grid-template-columns:32px minmax(180px,.9fr) minmax(0,1fr) minmax(0,1fr);align-items:center;min-width:0}
.ucs-row.cols-3{grid-template-columns:32px minmax(180px,.9fr) minmax(0,1fr)}
.ucs-row + .ucs-row{border-top:1px solid rgba(255,255,255,.08)}
.ucs-row.head{position:sticky;top:0;z-index:4;background:rgba(0,0,0,.24);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
	.ucs-row.group{background:rgba(0,0,0,.10);font-weight:850;letter-spacing:.35px;color:var(--text-2)}
	.ucs-row.group .ucs-cellx.check,.ucs-row.group .ucs-cellx.col{display:none}
	.ucs-row.group .ucs-cellx.name{grid-column:1 / -1;padding:18px 14px 10px;font-size:16px;letter-spacing:.45px}
.ucs-cellx{padding:12px 14px;min-width:0}
.ucs-cellx.check{display:flex;justify-content:center}
.ucs-cellx.col{border-left:1px solid rgba(255,255,255,.10)}
	.ucs-cellx.name{font-size:var(--fs-body);font-weight:650;line-height:1.2;color:var(--text);overflow:hidden}
	.ucs-name{display:flex;align-items:center;gap:8px;min-width:0}
	.ucs-name .txt{flex:1 1 auto;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
	.ucs-row.token.indent-1 .ucs-name .txt{padding-left:14px}
	.ucs-row.token.indent-1 .ucs-cellx.check{justify-content:flex-start}
	.ucs-row.token.indent-1 .ucs-check{margin-left:14px}
	.ucs-cellx.name .ref{margin-left:8px;color:var(--muted);font-weight:600;font-size:var(--fs-note);opacity:.9;white-space:nowrap}
	.ucs-locate{width:24px;height:24px;border-radius:10px;border:1px solid rgba(255,255,255,.14);background:rgba(0,0,0,.18);color:var(--muted);display:grid;place-items:center;cursor:pointer;opacity:.25;transition:opacity .15s ease,background .15s ease}
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
	.ucs-row.token:hover{background:rgba(255,255,255,.02)}
.ucs-cell{display:flex;align-items:center;gap:10px;min-width:0}
.ucs-cell input[type="color"]{appearance:none;-webkit-appearance:none;width:26px;height:18px;border-radius:6px;border:0;background:transparent;padding:0;flex:0 0 auto}
.ucs-cell input[type="color"]::-webkit-color-swatch-wrapper{padding:0}
.ucs-cell input[type="color"]::-webkit-color-swatch{border:0;border-radius:6px}
.ucs-cell input[type="color"]::-moz-color-swatch{border:0;border-radius:6px}
.ucs-cell input[type="text"]{width:78px;max-width:96px;border:0;border-radius:0;background:transparent;color:var(--text);padding:0;font-size:var(--fs-note);font-weight:700;letter-spacing:.4px;text-transform:uppercase;outline:none}
.ucs-cell input[type="text"]::placeholder{color:rgba(255,255,255,.35)}
.ucs-cell input[type="text"]:focus{outline:none;border-bottom:1px solid rgba(255,255,255,.22)}
.ucs-cell input[type="number"]{width:78px;max-width:110px;border:0;border-radius:0;background:transparent;color:var(--text);padding:0;font-size:var(--fs-note);font-weight:760;letter-spacing:.2px;outline:none;font-variant-numeric:tabular-nums}
.ucs-cell input[type="number"]:focus{outline:none;border-bottom:1px solid rgba(255,255,255,.22)}
.ucs-cell .mini{font-size:var(--fs-note);color:var(--muted);font-variant-numeric:tabular-nums}
.ucs-cell .sep{width:1px;height:18px;background:rgba(255,255,255,.10)}
.ucs-ctrls{display:flex;align-items:center;gap:10px;min-width:0}
.ucs-ctrls .ucs-alpha{max-width:140px}
.ucs-ctrls .ucs-alpha .k{display:none}
.ucs-ctrls .ucs-alpha .n{min-width:28px}
.ucs-ctrls[data-alpha="false"] .ucs-alpha{display:none}
.ucs-cell input[type="range"],.ucs-shadow-ctrl input[type="range"]{width:100%;appearance:none;background:transparent;height:18px;--p:50%;--track:rgba(255,255,255,.10);--fill:rgba(255,255,255,.78)}
.ucs-cell input[type="range"]::-webkit-slider-runnable-track,.ucs-shadow-ctrl input[type="range"]::-webkit-slider-runnable-track{height:10px;border-radius:999px;background:linear-gradient(to right,var(--fill) 0%,var(--fill) var(--p),var(--track) var(--p),var(--track) 100%);border:1px solid rgba(255,255,255,.14)}
.ucs-cell input[type="range"]::-webkit-slider-thumb,.ucs-shadow-ctrl input[type="range"]::-webkit-slider-thumb{appearance:none;-webkit-appearance:none;margin-top:-6px;width:22px;height:22px;border-radius:999px;background:var(--fill);border:2px solid rgba(0,0,0,.35);box-shadow:0 0 0 1px rgba(255,255,255,.12)}
.ucs-cell input[type="range"]::-moz-range-track,.ucs-shadow-ctrl input[type="range"]::-moz-range-track{height:10px;border-radius:999px;background:var(--track);border:1px solid rgba(255,255,255,.14)}
.ucs-cell input[type="range"]::-moz-range-progress,.ucs-shadow-ctrl input[type="range"]::-moz-range-progress{height:10px;border-radius:999px;background:var(--fill)}
.ucs-cell input[type="range"]::-moz-range-thumb,.ucs-shadow-ctrl input[type="range"]::-moz-range-thumb{width:22px;height:22px;border-radius:999px;background:var(--fill);border:2px solid rgba(0,0,0,.35)}
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
.ucs-shadow-nums .k{font-size:10px;color:var(--muted);font-weight:800;text-transform:uppercase;letter-spacing:.6px;margin-bottom:4px}
.ucs-shadow-nums input[type="number"]{width:100%;border:1px solid rgba(255,255,255,.10);background:rgba(0,0,0,.14);color:var(--text);border-radius:12px;padding:8px 10px;font-size:12px;font-weight:780;outline:none;font-variant-numeric:tabular-nums}
.ucs-shadow-nums input[type="number"]:focus{outline:2px solid rgba(255,255,255,.14);outline-offset:2px}
.ucs-shadow-color{display:flex;align-items:center;gap:10px;min-width:0}
.ucs-ref{font-size:var(--fs-note);color:var(--muted);opacity:.9}
.ucs-disabled{opacity:.55;pointer-events:none}
	.ucs-actions{display:flex;align-items:center;gap:var(--space-10);flex-wrap:wrap}
	.ucs-actions .btn{border-radius:var(--radius-12);border:1px solid rgba(255,255,255,.14);background:rgba(0,0,0,.20);color:var(--text);padding:10px 12px;font-size:var(--fs-note);cursor:pointer}
	.ucs-actions .btn:hover{background:rgba(0,0,0,.26)}
		.ucs-actions .btn:active{transform:translateY(1px)}
		.ucs-actions .btn.primary{background:rgba(255,255,255,.10);border-color:rgba(255,255,255,.18)}
		.ucs-actions .pill{font-size:var(--fs-note);color:var(--muted)}
		.ucs-actions .pill:empty{display:none}

		.ucs-editor-tabs{position:sticky;top:0;z-index:6;margin-bottom:12px;display:flex;gap:6px;padding:6px;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:rgba(0,0,0,.18);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
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
	
	.ucs-canvas{position:relative;flex:1;min-height:0;display:flex;flex-direction:column;background:transparent;color:var(--ucs-text, #111)}
		.ucs-preview-scroll{
		  flex:1;
		  min-height:0;
		  overflow:auto;
		  scrollbar-gutter:stable;
		  display:grid;
		  grid-template-columns:repeat(2,minmax(0,1fr));
		  gap:var(--ucs-space-grid-gap,14px);
		  grid-auto-flow:dense;
		  grid-auto-rows:8px;
		  padding:var(--ucs-space-canvas-top,40px) var(--ucs-space-canvas-x,36px) var(--ucs-space-canvas-bottom,56px);
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
.ucs-title{margin-top:14px;font-size:30px;letter-spacing:.2px;font-weight:820;line-height:1.08}
.ucs-subtitle{margin-top:8px;color:var(--ucs-text-2);font-size:14px;line-height:1.4}
.ucs-hr{height:1px;background:var(--ucs-divider);margin:14px 0}
.ucs-paragraph{margin-top:10px;color:var(--ucs-text-2);font-size:13px;line-height:1.55}
.ucs-meta2{margin-top:10px;display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:12px;color:var(--ucs-text-3)}

	.ucs-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:var(--ucs-space-grid-gap,14px);margin-top:var(--ucs-space-canvas-gap,16px)}
	.ucs-card2{border-radius:var(--ucs-radius-card,22px);background:color-mix(in srgb, var(--ucs-surface) 92%, transparent);border:0;box-shadow:var(--ucs-shadow-sm);padding:var(--ucs-space-card-pad,14px)}
.ucs-card2.soft{box-shadow:var(--ucs-shadow-sm)}
.ucs-card2.hero{grid-column:1 / -1}
.ucs-card2 .h{display:flex;align-items:center;justify-content:space-between;gap:12px}
.ucs-card2 .h .k{font-weight:760;letter-spacing:.2px}
.ucs-card2 .h .s{color:var(--ucs-text-2);font-size:12px}
.ucs-ring{margin-top:14px;display:grid;place-items:center}
.ucs-ring svg{width:170px;height:170px}
.ucs-legend{margin-top:12px;display:grid;gap:8px}
.ucs-leg{display:flex;align-items:center;justify-content:space-between;gap:10px}
.ucs-leg .l{display:flex;align-items:center;gap:10px;min-width:0}
.ucs-dot{width:10px;height:10px;border-radius:999px;background:var(--c);box-shadow:0 0 0 6px color-mix(in srgb, var(--c) 16%, transparent);border:1px solid color-mix(in srgb, var(--c) 70%, #000)}
.ucs-leg .t{font-size:12px;color:var(--ucs-text-2)}
.ucs-leg .v{font-size:13px;font-weight:760}

.ucs-list{margin-top:12px;display:grid;gap:10px}
	.ucs-item{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 12px;border-radius:var(--ucs-radius-control,18px);border:1px solid var(--ucs-border);background:color-mix(in srgb, var(--ucs-surface) 86%, transparent);box-shadow:none;position:relative;overflow:hidden}
.ucs-item .left{display:flex;align-items:center;gap:10px;min-width:0}
.ucs-badge{font-size:12px;border-radius:999px;padding:7px 10px;border:1px solid var(--ucs-border);color:var(--ucs-text)}
.ucs-badge.success{background:color-mix(in srgb, var(--ucs-success-bg) 100%, transparent);border-color:color-mix(in srgb, var(--ucs-success) 22%, var(--ucs-border));color:var(--ucs-success-text)}
.ucs-badge.warn{background:color-mix(in srgb, var(--ucs-warning-bg) 100%, transparent);border-color:color-mix(in srgb, var(--ucs-warning) 22%, var(--ucs-border));color:var(--ucs-warning-text)}
.ucs-badge.danger{background:color-mix(in srgb, var(--ucs-danger-bg) 100%, transparent);border-color:color-mix(in srgb, var(--ucs-danger) 22%, var(--ucs-border));color:var(--ucs-danger-text)}
.ucs-badge.info{background:color-mix(in srgb, var(--ucs-info-bg) 100%, transparent);border-color:color-mix(in srgb, var(--ucs-info) 22%, var(--ucs-border));color:var(--ucs-info-text)}
.ucs-item .ttl{font-size:13px;font-weight:760;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ucs-item .sub{font-size:12px;color:var(--ucs-text-2);white-space:nowrap}
.ucs-item .chk{width:18px;height:18px;border-radius:6px;border:1px solid var(--ucs-border);display:grid;place-items:center;color:var(--ucs-text);opacity:.55}
.ucs-item.hover::after{content:"";position:absolute;inset:0;background:var(--ucs-overlay-hover);pointer-events:none}

.ucs-tabs{margin-top:12px;display:flex;gap:6px;padding:6px;border-radius:999px;border:1px solid var(--ucs-border-muted);background:color-mix(in srgb, var(--ucs-surface) 84%, transparent);box-shadow:none}
.ucs-tab{flex:1 1 0;display:flex;align-items:center;justify-content:center;padding:10px 12px;border-radius:999px;font-size:13px;font-weight:760;color:var(--ucs-text-2);user-select:none}
.ucs-tab.on{background:color-mix(in srgb, var(--ucs-primary-25) 72%, var(--ucs-surface) 28%);color:var(--ucs-text);box-shadow:none}

.ucs-datatable{margin-top:12px;border-radius:var(--ucs-radius-control,18px);overflow:hidden;border:1px solid var(--ucs-border-muted);background:color-mix(in srgb, var(--ucs-surface) 86%, transparent);box-shadow:none}
.ucs-datatable .r{display:grid;grid-template-columns:1.35fr 1fr auto;gap:12px;padding:10px 12px;align-items:center;min-width:0}
.ucs-datatable .r.h{font-size:11px;color:var(--ucs-text-3);font-weight:750;text-transform:uppercase;letter-spacing:.6px;background:color-mix(in srgb, var(--ucs-surface) 92%, transparent)}
.ucs-datatable .r + .r{border-top:1px solid var(--ucs-divider)}
.ucs-datatable .r.sel{background:color-mix(in srgb, var(--ucs-primary-25) 42%, var(--ucs-surface) 58%)}
.ucs-datatable .c1{font-weight:750;color:var(--ucs-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ucs-datatable .c2{color:var(--ucs-text-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ucs-datatable .c3{display:flex;justify-content:flex-end}

.ucs-cta{margin-top:12px;display:flex;gap:10px;flex-wrap:wrap}
.ucs-btn{border-radius:var(--ucs-radius-button,16px);padding:12px 14px;border:1px solid var(--ucs-border);background:transparent;color:var(--ucs-text);box-shadow:none;cursor:pointer;position:relative;overflow:visible}
.ucs-btn.primary{background:var(--ucs-primary);border-color:transparent;color:var(--ucs-on-primary);box-shadow:none}
.ucs-btn.hover::before{
	content:"";
	position:absolute;
	left:50%;
	top:-26px;
	width:22px;
	height:22px;
	transform:translateX(10px) rotate(-6deg);
	background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24'%3E%3Cpath d='M5.7 3.7l12 10.3c.5.4.2 1.2-.4 1.2h-4.6l1.8 4.2c.2.4 0 .8-.4 1l-2.1.9c-.4.2-.8 0-1-.4l-1.8-4.2-3.2 3.3c-.4.4-1.1.1-1.1-.5V4.3c0-.6.7-.9 1.1-.6z' fill='%23ffffff' fill-opacity='.92'/%3E%3Cpath d='M5.7 3.7l12 10.3c.5.4.2 1.2-.4 1.2h-4.6l1.8 4.2c.2.4 0 .8-.4 1l-2.1.9c-.4.2-.8 0-1-.4l-1.8-4.2-3.2 3.3c-.4.4-1.1.1-1.1-.5V4.3c0-.6.7-.9 1.1-.6z' fill='none' stroke='%230b1220' stroke-opacity='.28' stroke-width='1.2'/%3E%3C/svg%3E");
	background-repeat:no-repeat;
	background-size:contain;
	filter:drop-shadow(0 8px 18px rgba(0,0,0,.18));
	pointer-events:none;
}
.ucs-btn.hover::after{content:"";position:absolute;inset:0;background:var(--ucs-overlay-hover)}
.ucs-btn:active{transform:translateY(1px)}

	.ucs-heatmap-months{margin-top:10px;display:flex;gap:10px;justify-content:space-between;font-size:12px;color:var(--ucs-text-2);opacity:.9;user-select:none}
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
	
	.ucs-heatmap-legend{margin-top:12px;display:flex;align-items:center;gap:10px;font-size:12px;color:var(--ucs-text-2)}
	.ucs-heatmap-legend .dots{display:flex;align-items:center;gap:6px}
	.ucs-heatmap-legend .dots .cell{width:9px;height:9px}
	
	.ucs-row2{display:contents}
	.ucs-layer-grid{margin-top:12px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--ucs-space-grid-gap,14px)}
	.ucs-layer-tile{border-radius:var(--ucs-radius-card,22px);border:1px solid var(--ucs-border);box-shadow:none;padding:var(--ucs-space-card-pad,14px);min-height:92px;display:flex;flex-direction:column;justify-content:space-between;min-width:0}
	.ucs-layer-tile.surface{background:color-mix(in srgb, var(--ucs-surface) 92%, transparent)}
	.ucs-layer-tile.elevated{background:color-mix(in srgb, var(--ucs-elevated) 92%, transparent);box-shadow:var(--ucs-shadow-md)}
	.ucs-layer-tile .k{font-weight:760;letter-spacing:.2px}
	.ucs-layer-tile .s{font-size:12px;color:var(--ucs-text-2)}
		.ucs-mini-list{margin-top:10px;border-radius:var(--ucs-radius-control,18px);border:1px solid var(--ucs-border-muted);overflow:hidden}
	.ucs-mini-list .r{padding:8px 10px;font-size:12px;color:var(--ucs-text);display:flex;align-items:center;justify-content:space-between;gap:10px}
	.ucs-mini-list .d{height:1px;background:var(--ucs-divider)}
	

		.ucs-form{margin-top:12px;display:grid;gap:12px}
		.ucs-field .lb{font-size:12px;color:var(--ucs-text-2);font-weight:650;margin-bottom:6px}
		.ucs-input{border-radius:var(--ucs-radius-control,18px);border:1px solid var(--ucs-border-muted);background:color-mix(in srgb, var(--ucs-surface) 86%, transparent);padding:12px 12px;display:flex;align-items:center;justify-content:space-between;gap:10px;box-shadow:none}
		.ucs-input.is-focus{
		  border-color:color-mix(in srgb, var(--ucs-primary) 46%, var(--ucs-border-muted));
		  box-shadow:0 0 0 4px color-mix(in srgb, var(--ucs-primary) 18%, transparent);
		}
		.ucs-input .ph{font-size:13px;color:var(--ucs-text-3)}
		.ucs-input .tag{font-size:12px;color:var(--ucs-text-2);padding:6px 8px;border-radius:999px;border:1px solid var(--ucs-border);background:color-mix(in srgb, var(--ucs-surface) 84%, transparent)}
		.ucs-switch{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px;border-radius:var(--ucs-radius-control,18px);border:1px solid var(--ucs-border);background:color-mix(in srgb, var(--ucs-surface) 86%, transparent);box-shadow:none}
		.ucs-switch .meta{display:grid;gap:2px;min-width:0}
		.ucs-switch .meta .t{font-weight:760;color:var(--ucs-text)}
		.ucs-switch .meta .d{font-size:12px;color:var(--ucs-text-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
		.ucs-togglepill{width:46px;height:28px;border-radius:999px;border:1px solid var(--ucs-border);background:color-mix(in srgb, var(--ucs-primary-25) 42%, var(--ucs-surface) 58%);position:relative;box-shadow:none;flex:0 0 auto}
		.ucs-togglepill::after{content:"";position:absolute;top:3px;left:21px;width:22px;height:22px;border-radius:999px;background:var(--ucs-surface);box-shadow:none}
		.ucs-form-actions{display:flex;gap:10px;flex-wrap:wrap}

		.ucs-toast-list{margin-top:12px;display:grid;gap:10px}
		.ucs-toast{position:relative;overflow:hidden;border-radius:var(--ucs-radius-control,18px);border:1px solid var(--ucs-border);padding:12px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;box-shadow:none}
		.ucs-toast .t{font-weight:820;font-size:13px}
		.ucs-toast .d{margin-top:3px;font-size:12px;color:var(--ucs-text-2)}
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
		.ucs-type .t1{font-size:16px;font-weight:820;color:var(--ucs-text)}
	.ucs-type .t2{font-size:13px;color:var(--ucs-text-2);line-height:1.4}
	.ucs-type .t3{font-size:12px;color:var(--ucs-text-3)}
	.ucs-type .link{font-size:13px;font-weight:750;color:var(--ucs-text-brand)}
		.ucs-type .inverse{display:inline-flex;align-items:center;gap:8px;width:max-content;border-radius:var(--ucs-radius-button,16px);padding:9px 12px;background:var(--ucs-primary-deep);border:1px solid color-mix(in srgb, var(--ucs-primary-deep) 65%, var(--ucs-border));color:var(--ucs-text-inverse);box-shadow:none;font-size:12px;font-weight:750}
	.ucs-text-samples{margin-top:12px;display:grid;gap:10px}
		.ucs-text-sample{display:grid;grid-template-columns:92px minmax(0,1fr);align-items:center;gap:12px;padding:12px;border-radius:var(--ucs-radius-control,18px);border:1px solid var(--ucs-border-muted);background:color-mix(in srgb, var(--ucs-surface) 86%, transparent);box-shadow:none;min-width:0}
	.ucs-text-sample .name{font-size:12px;font-weight:760;color:var(--ucs-text-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
	.ucs-text-sample .sample{font-size:13px;font-weight:780;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
	.ucs-text-sample.on-dark{border-color:color-mix(in srgb, var(--ucs-primary-deep) 60%, var(--ucs-border));background:var(--ucs-primary-deep);box-shadow:none}
	.ucs-text-sample.on-dark .name{color:color-mix(in srgb, var(--ucs-text-inverse) 78%, transparent)}
	
	.ucs-states{margin-top:12px;display:grid;gap:10px}
	.ucs-states .ucs-btn{width:100%;justify-content:center}
	.ucs-note{margin-top:10px;font-size:12px;color:var(--ucs-text-2);line-height:1.4}
	.ucs-note .code{display:inline-flex;align-items:center;border-radius:999px;padding:2px 8px;border:1px solid var(--ucs-border-muted);background:color-mix(in srgb, var(--ucs-surface) 86%, transparent);font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:11px;color:var(--ucs-text)}
		.ucs-btn.sm{padding:10px 12px;border-radius:var(--ucs-radius-button,16px);font-size:13px}
	.ucs-btn.pressed::after{content:"";position:absolute;inset:0;background:var(--ucs-overlay-pressed)}
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
	.ucs-shadow-card .s{font-size:12px;color:var(--ucs-text-2)}

	.ucs-popover-demo{margin-top:12px;display:grid;gap:10px}
	.ucs-popover-demo .cap{display:flex;align-items:center;justify-content:space-between;gap:12px}
	.ucs-popover-demo .cap .k{font-size:12px;font-weight:760;letter-spacing:.2px}
	.ucs-popover-demo .cap .s{font-size:12px;color:var(--ucs-text-2)}
	.ucs-popover-demo .anchor{display:flex;gap:10px;flex-wrap:wrap}
	.ucs-popover{border-radius:var(--ucs-radius-control,18px);border:1px solid var(--ucs-border);background:color-mix(in srgb, var(--ucs-elevated) 92%, transparent);box-shadow:var(--ucs-shadow-md);padding:10px;display:grid;gap:6px}
	.ucs-popover .row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 10px;border-radius:calc(var(--ucs-radius-control,18px) - 4px);color:var(--ucs-text);border:1px solid transparent}
	.ucs-popover .row.on{background:color-mix(in srgb, var(--ucs-primary-25) 42%, var(--ucs-elevated) 58%);border-color:color-mix(in srgb, var(--ucs-primary) 18%, var(--ucs-border))}
	.ucs-popover .row .hint{font-size:12px;color:var(--ucs-text-2);font-variant-numeric:tabular-nums}
	.ucs-popover .sep{height:1px;background:var(--ucs-divider);margin:2px 6px}

	.ucs-focus{outline:2px solid color-mix(in srgb, var(--ucs-primary) 72%, #fff);outline-offset:4px}
	
		.ucs-modal{position:absolute;inset:0;display:grid;place-items:center;pointer-events:auto}
	.ucs-modal .scrim{position:absolute;inset:0;background:var(--ucs-scrim);cursor:pointer}
		.ucs-modal .dlg{position:relative;width:min(520px,86%);border-radius:var(--ucs-radius-card,22px);background:var(--ucs-elevated);border:1px solid var(--ucs-border);box-shadow:var(--ucs-shadow-lg);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);padding:18px}
	.ucs-modal .dlg .h{display:flex;align-items:center;justify-content:space-between;gap:12px}
		.ucs-modal .dlg .h .x{width:40px;height:40px;border-radius:var(--ucs-radius-button,16px);border:1px solid var(--ucs-border);background:color-mix(in srgb, var(--ucs-surface) 82%, transparent);display:grid;place-items:center;box-shadow:none;cursor:pointer}
	.ucs-modal .dlg .title{font-size:18px;font-weight:820}
	.ucs-modal .dlg .p{margin-top:8px;color:var(--ucs-text-2);line-height:1.55;font-size:13px}
.ucs-modal .dlg .bar{margin-top:14px;height:10px;border-radius:999px;background:color-mix(in srgb, var(--ucs-border) 35%, transparent);overflow:hidden;border:1px solid color-mix(in srgb, var(--ucs-border) 70%, transparent)}
.ucs-modal .dlg .bar > i{display:block;height:100%;width:46%;background:linear-gradient(90deg,var(--ucs-primary) 0%, var(--ucs-primary-75) 100%);border-radius:999px}

	.ucs-check{display:grid;place-items:center;opacity:.35;transition:opacity .15s ease}
	.ucs-row.token:hover .ucs-check{opacity:.9}
	.ucs-row.token.checked .ucs-check{opacity:1}
	.ucs-check input{appearance:none;-webkit-appearance:none;width:16px;height:16px;border-radius:6px;border:1px solid rgba(255,255,255,.18);background:rgba(0,0,0,.18);display:grid;place-items:center;cursor:pointer}
	.ucs-check input:checked{background:rgba(255,255,255,.26);border-color:rgba(255,255,255,.42);background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18'%3E%3Cpath d='M4.2 9.4l2.4 2.6L13.8 5.8' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:center;background-size:11px 11px}
.ucs-check input:focus-visible{outline:2px solid rgba(255,255,255,.18);outline-offset:2px}

	@media (max-width: 980px){
	  .ucs-root{grid-template-columns:1fr}
	}
	@media (max-width: 860px){
	  .ucs-preview-scroll{grid-template-columns:1fr}
	  .ucs-row2{grid-template-columns:1fr}
	  .ucs-layer-grid{grid-template-columns:1fr}
	  .ucs-shadow-grid{grid-template-columns:1fr 1fr}
	}
	`
	    );
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
    if (t === "number" || t === "shadow") return t;
    return "color";
  }

  function asNumberValue(v, fallback = 0) {
    const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
    if (!Number.isFinite(n)) return fallback;
    return n;
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
          preview: false,
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
          id: "radius.card",
          title: "卡片圆角",
          type: "number",
          group: "圆角",
          desc: "预览卡片/容器圆角（px）。",
          light: 22,
          dark: 22,
          preview: true,
        },
        {
          id: "radius.control",
          title: "控件圆角",
          type: "number",
          group: "圆角",
          desc: "输入框/列表/Toast 等（px）。",
          light: 18,
          dark: 18,
          preview: true,
        },
        {
          id: "radius.button",
          title: "按钮圆角",
          type: "number",
          group: "圆角",
          desc: "按钮（px）。",
          light: 16,
          dark: 16,
          preview: true,
        },
        {
          id: "space.canvas.paddingX",
          title: "画布左右内边距",
          type: "number",
          group: "间距",
          desc: "预览画布左右 padding（px）。",
          light: 36,
          dark: 36,
          preview: true,
        },
        {
          id: "space.canvas.paddingTop",
          title: "画布上内边距",
          type: "number",
          group: "间距",
          desc: "预览画布顶部 padding（px）。",
          light: 40,
          dark: 40,
          preview: true,
        },
        {
          id: "space.canvas.paddingBottom",
          title: "画布下内边距",
          type: "number",
          group: "间距",
          desc: "预览画布底部 padding（px）。",
          light: 56,
          dark: 56,
          preview: true,
        },
        {
          id: "space.canvas.gap",
          title: "画布模块间距",
          type: "number",
          group: "间距",
          desc: "预览画布模块间距 gap（px）。",
          light: 16,
          dark: 16,
          preview: true,
        },
        {
          id: "space.grid.gap",
          title: "网格间距",
          type: "number",
          group: "间距",
          desc: "两列/多列卡片之间 gap（px）。",
          light: 14,
          dark: 14,
          preview: true,
        },
        {
          id: "space.card.padding",
          title: "卡片内边距",
          type: "number",
          group: "间距",
          desc: "卡片内部 padding（px）。",
          light: 14,
          dark: 14,
          preview: true,
        },
        {
          id: "shadow.sm",
          title: "阴影 SM",
          type: "shadow",
          group: "阴影",
          desc: "轻微抬升。",
          light: { x: 0, y: 12, blur: 28, spread: 0, color: { hex: "#0B1220", alpha: 0.12 } },
          dark: { x: 0, y: 12, blur: 28, spread: 0, color: { hex: "#000000", alpha: 0.5 } },
          preview: true,
        },
        {
          id: "shadow.md",
          title: "阴影 MD",
          type: "shadow",
          group: "阴影",
          desc: "中抬升。",
          light: { x: 0, y: 18, blur: 44, spread: 0, color: { hex: "#0B1220", alpha: 0.16 } },
          dark: { x: 0, y: 18, blur: 44, spread: 0, color: { hex: "#000000", alpha: 0.6 } },
          preview: true,
        },
        {
          id: "shadow.lg",
          title: "阴影 LG",
          type: "shadow",
          group: "阴影",
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

    const merged = { version: 1, tokens: [] };
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
      setPanelTitle("UI 系统配色");

      let model = loadModel();
      let mode = "light";
      let editorTab = "color";

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
		                    <div class="ucs-preview-scroll" data-preview-scroll>
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
		
		                        <div class="ucs-title" data-needs="text.primary">Welcome Back</div>
		                        <div class="ucs-subtitle" data-needs="text.secondary">Your weekly summary is ready.</div>
		                        <div class="ucs-cta" data-needs-any="primary border.default text.primary">
		                          <button class="ucs-btn primary sm" type="button" data-needs="primary">Primary</button>
		                          <button class="ucs-btn sm" type="button" data-needs="border.default text.primary">Ghost</button>
		                        </div>
		                      </div>
		
		                      <div class="ucs-row2">
		                        <div class="ucs-card2" data-needs-any="primary primary.25 primary.50 primary.75">
		                          <div class="h">
		                            <div class="k">Dashboard</div>
		                            <div class="s">Progress</div>
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
		                              <div class="l"><span class="ucs-dot" style="--c:var(--ucs-primary-25)"></span><span class="t">25%</span></div>
		                              <div class="v">25%</div>
		                            </div>
		                            <div class="ucs-leg" data-needs="primary.50">
		                              <div class="l"><span class="ucs-dot" style="--c:var(--ucs-primary-50)"></span><span class="t">50%</span></div>
		                              <div class="v">50%</div>
		                            </div>
		                            <div class="ucs-leg" data-needs="primary.75">
		                              <div class="l"><span class="ucs-dot" style="--c:var(--ucs-primary-75)"></span><span class="t">75%</span></div>
		                              <div class="v">75%</div>
		                            </div>
		                          </div>
		                        </div>
		
			                        <div class="ucs-card2" data-needs="border.default border.muted divider.default text.primary text.secondary text.tertiary primary background.surface">
			                          <div class="h">
			                            <div class="k">Settings</div>
			                            <div class="s">Form</div>
			                          </div>
			                          <div class="ucs-form">
			                            <div class="ucs-field" data-needs="text.secondary text.tertiary border.muted">
			                              <div class="lb">Email</div>
			                              <div class="ucs-input is-focus" data-needs="primary">
			                                <span class="ph">name@example.com</span>
			                                <span class="tag">Primary</span>
			                              </div>
			                            </div>
			                            <div class="ucs-field" data-needs="text.secondary text.tertiary border.muted">
			                              <div class="lb">Plan</div>
			                              <div class="ucs-input">
			                                <span class="ph">Pro (Monthly)</span>
			                                <span class="tag">›</span>
			                              </div>
			                            </div>
			                            <div class="ucs-switch" data-needs="border.default text.primary text.secondary primary.25">
			                              <div class="meta">
			                                <div class="t">Auto sync</div>
			                                <div class="d">Keep preferences across devices.</div>
			                              </div>
			                              <div class="ucs-togglepill" aria-hidden="true"></div>
			                            </div>
			                            <div class="ucs-form-actions" data-needs="primary border.default text.primary">
			                              <button class="ucs-btn primary sm" type="button" data-needs="primary">Save</button>
			                              <button class="ucs-btn sm" type="button" data-needs="border.default text.primary">Cancel</button>
			                            </div>
			                          </div>
			                        </div>
			                      </div>

			                      <div class="ucs-row2">
			                        <div class="ucs-card2 soft" data-needs-any="functional.success.default functional.warning.default functional.danger.default functional.info.default">
		                          <div class="h">
		                            <div class="k">Today</div>
		                            <div class="s">Tasks</div>
		                          </div>
		                          <div class="ucs-list">
			                            <div class="ucs-item" data-needs="functional.success.default">
		                              <div class="left">
		                                <div>
		                                  <div class="ttl">Project Done</div>
		                                  <div class="sub">Update complete</div>
		                                </div>
		                              </div>
		                              <span class="ucs-badge success">Success</span>
		                            </div>
			                            <div class="ucs-item" data-needs="functional.warning.default">
		                              <div class="left">
		                                <div>
		                                  <div class="ttl">Need Review</div>
		                                  <div class="sub">Pending approval</div>
		                                </div>
		                              </div>
		                              <span class="ucs-badge warn">Warning</span>
		                            </div>
			                            <div class="ucs-item" data-needs="functional.danger.default">
		                              <div class="left">
		                                <div>
		                                  <div class="ttl">Payment Failed</div>
		                                  <div class="sub">Try again later</div>
		                                </div>
		                              </div>
		                              <span class="ucs-badge danger">Danger</span>
		                            </div>
			                            <div class="ucs-item" data-needs="functional.info.default">
		                              <div class="left">
		                                <div>
		                                  <div class="ttl">New Message</div>
		                                  <div class="sub">System notice</div>
		                                </div>
		                              </div>
		                              <span class="ucs-badge info">Info</span>
		                            </div>
		                          </div>
			                        </div>

				                        <div class="ucs-card2" data-needs-any="functional.success.default functional.warning.default functional.danger.default functional.info.default">
			                          <div class="h">
			                            <div class="k">Notifications</div>
			                            <div class="s">Toasts</div>
			                          </div>
			                          <div class="ucs-toast-list">
				                            <div class="ucs-toast success" data-needs="functional.success.default">
			                              <div>
			                                <div class="t">Saved</div>
			                                <div class="d">All changes synced.</div>
			                              </div>
			                              <div class="x" aria-hidden="true">✕</div>
			                            </div>
				                            <div class="ucs-toast warn" data-needs="functional.warning.default">
			                              <div>
			                                <div class="t">Pending</div>
			                                <div class="d">Waiting for review.</div>
			                              </div>
			                              <div class="x" aria-hidden="true">✕</div>
			                            </div>
				                            <div class="ucs-toast danger" data-needs="functional.danger.default">
			                              <div>
			                                <div class="t">Failed</div>
			                                <div class="d">Please try again later.</div>
			                              </div>
			                              <div class="x" aria-hidden="true">✕</div>
			                            </div>
				                            <div class="ucs-toast info" data-needs="functional.info.default">
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
			                            <span style="text-align:right">Status</span>
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
		                        <div class="ucs-card2" data-needs-any="background.surface background.elevated border.default border.muted divider.default">
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
		                              <div class="ucs-mini-list" data-needs-any="divider.default border.muted">
		                                <div class="r"><span>Item</span><span style="opacity:.8">›</span></div>
		                                <div class="d" data-needs="divider.default"></div>
		                                <div class="r"><span>Item</span><span style="opacity:.8">›</span></div>
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
		                            <div class="s">Text</div>
		                          </div>
		                          <div class="ucs-type">
		                            <div class="t1" data-needs="text.primary">Design systems</div>
		                            <div class="t2" data-needs="text.secondary">Reusable tokens, consistent UI.</div>
		                            <div class="ucs-paragraph" data-needs="text.secondary">Tokens make UI predictable and reusable across components.</div>
		                            <div class="ucs-hr" data-needs="divider.default"></div>
		                            <div class="t3" data-needs="text.tertiary">Helper / placeholder text.</div>
		                            <div class="ucs-meta2" data-needs="text.tertiary">
		                              <span>Last updated</span>
		                              <span>2 days ago</span>
		                            </div>
		                            <div class="link" data-needs="text.brand">Learn more</div>
		                            <div class="inverse" data-needs="text.inverse primary.deep">Inverse</div>
		                          </div>
		                          <div class="ucs-text-samples" data-text-samples>
		                            <div class="ucs-text-sample" data-needs="text.black">
		                              <span class="name">纯黑</span>
		                              <span class="sample" style="color:var(--ucs-text-black)">示例正文：用于检查阅读对比（Aa 0123）。</span>
		                            </div>
		                            <div class="ucs-text-sample on-dark" data-needs="text.white">
		                              <span class="name">纯白</span>
		                              <span class="sample" style="color:var(--ucs-text-white)">示例正文：用于检查阅读对比（Aa 0123）。</span>
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
		
		                    <div class="ucs-modal" data-needs="overlay.scrim" aria-label="Modal Preview">
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

	      const editorEl = contentEl.querySelector("[data-editor]");
	      const previewEl = contentEl.querySelector("[data-preview]");
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
	        { key: "shadow", label: "阴影" },
	        { key: "radius", label: "圆角" },
	        { key: "space", label: "间距" },
	      ];

	      function tokenInEditorTab(token) {
	        const k = String(editorTab || "color");
	        const t = tokenType(token);
	        if (k === "shadow") return t === "shadow";
	        if (k === "radius") return t === "number" && String(token?.group || "") === "圆角";
	        if (k === "space") return t === "number" && String(token?.group || "") === "间距";
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

	        const showModes = editorTab === "color";
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
          : `
            <div class="ucs-cellx check"></div>
            <div class="ucs-cellx name">Name</div>
            <div class="ucs-cellx col">值</div>
          `;
        table.appendChild(head);

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
          groupHeader.className = `ucs-row group ${colsClass}`;
          groupHeader.innerHTML = showModes
            ? `
              <div class="ucs-cellx check"></div>
              <div class="ucs-cellx name">${Kit.text.escapeHtml(groupName)}</div>
              <div class="ucs-cellx col"></div>
              <div class="ucs-cellx col"></div>
            `
            : `
              <div class="ucs-cellx check"></div>
              <div class="ucs-cellx name">${Kit.text.escapeHtml(groupName)}</div>
              <div class="ucs-cellx col"></div>
            `;
          table.appendChild(groupHeader);

          for (const t of tokensSorted) {
            const type = tokenType(t);
            const isLocked = !!t.ref || !!t.derive;
            const lightAny = readTokenValue(model, t, "light");
            const darkAny = readTokenValue(model, t, "dark");

            const isDerivedColor =
              showModes &&
              groupName !== "文字色" &&
              type === "color" &&
              (!!t.ref ||
                !!t.derive ||
                [".25", ".50", ".75", ".deep", ".muted", ".bg", ".text", ".pressed", ".scrim"].some((suf) =>
                  String(t.id || "").endsWith(suf)
                ));

	            const row = document.createElement("div");
	            row.className = `ucs-row token ${colsClass}${isDerivedColor ? " indent-1" : ""}${t.preview ? " checked" : ""}`;
	            row.title = `${t.id || ""}${t.desc ? `\n${t.desc}` : ""}${t.ref ? `\n→ ${t.ref}` : ""}`.trim();

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
              return `
                <div class="ucs-cell ${isLocked ? "ucs-disabled" : ""}">
                  <input type="number" step="1" value="${v}" data-id="${t.id}" data-k="num" aria-label="数值 ${t.title || t.id}">
                  <span class="mini">px</span>
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
                      <input type="number" step="1" value="${asNumberValue(base.x, 0)}" data-id="${t.id}" data-k="shadowX" aria-label="X ${t.title || t.id}">
                    </div>
                    <div class="f">
                      <div class="k">y</div>
                      <input type="number" step="1" value="${asNumberValue(base.y, 0)}" data-id="${t.id}" data-k="shadowY" aria-label="Y ${t.title || t.id}">
                    </div>
                    <div class="f">
                      <div class="k">blur</div>
                      <input type="number" step="1" min="0" value="${asNumberValue(base.blur, 0)}" data-id="${t.id}" data-k="shadowBlur" aria-label="Blur ${t.title || t.id}">
                    </div>
                    <div class="f">
                      <div class="k">spread</div>
                      <input type="number" step="1" value="${asNumberValue(base.spread, 0)}" data-id="${t.id}" data-k="shadowSpread" aria-label="Spread ${t.title || t.id}">
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
	                  <button class="ucs-locate" type="button" data-id="${t.id}" data-k="locate" title="定位使用地方" aria-label="定位使用地方">⌖</button>
	                  ${deleteBtn}
	                </div>
	              </div>
	            `;

	            const checkHtml = `
	              <div class="ucs-cellx check">
	                <div class="ucs-check" title="勾选后在左侧预览出现">
	                  <input type="checkbox" ${t.preview ? "checked" : ""} data-id="${t.id}" data-k="preview" aria-label="预览 ${t.title || t.id}">
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
	              const valueHtml = type === "shadow" ? mkShadowSingle(lightAny) : mkNumberSingle(lightAny);
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
        if (!t || tokenType(t) !== "number" || t.ref || t.derive) return;
        let n = asNumberValue(value, asNumberValue(t.light, 0));
        const tid = String(t.id || "");
        if (tid.startsWith("radius.") || tid.startsWith("space.")) n = Math.max(0, n);
        t.light = n;
        t.dark = n;
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
	          out.unit = "px";
	          out.value = asNumberValue(v, 0);
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
	          schema: "haao.ui-system.v1",
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
	        const name = editorTab === "radius" ? "radius" : editorTab === "space" ? "space" : editorTab;
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
	          sample.textContent = "示例正文：自定义文字色（Aa 0123）。";
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
	        const rowHeight = parseFloat(styles.gridAutoRows) || 8;
	        const rowGap = parseFloat(styles.rowGap) || parseFloat(styles.gap) || 14;
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
	          const q = `[data-needs~="${cssEscape(id)}"],[data-needs-any~="${cssEscape(id)}"]`;
	          const all = Array.from(previewEl.querySelectorAll(q));
	          if (all.length === 0) {
	            // Fallback for tokens that don't participate in data-needs visibility (e.g. radius/spacing).
	            const tid = String(id || "");
	            if (tid.startsWith("background.")) return previewEl.querySelector("[data-preview-scroll]") || previewEl.querySelector(".ucs-preview-scroll");
	            if (tid.startsWith("space.canvas.")) return previewEl.querySelector("[data-preview-scroll]") || previewEl.querySelector(".ucs-preview-scroll");
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

          if (k === "num") {
            const raw = parseFloat(String(el.value ?? ""));
            if (Number.isFinite(raw) && raw < 0) el.value = "0";
            setTokenNumber(id, "light", el.value);
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

	          if (k === "preview") {
	            const checked = !!el.checked;
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
        previewEl.addEventListener("click", (e) => {
	          const t = e.target;
	          if (!(t instanceof HTMLElement)) return;
	          const closeBtn = t.closest?.('[data-modal="close-scrim"]');
	          const scrim = t.closest?.('[data-modal="scrim"]');
	          if (!closeBtn && !scrim) return;
	          if (!getToken(model, "overlay.scrim")?.preview) return;
	          setTokenPreview("overlay.scrim", false);
	          renderEditor();
	          refreshPreview();
	          saveModel(model);
        });
      }

	      function wirePreviewLayoutEvents() {
	        const onResize = () => schedulePreviewLayout();
	        window.addEventListener("resize", onResize);
	        return () => window.removeEventListener("resize", onResize);
	      }

	      function wireEditorTabs() {
	        tabsEl?.addEventListener("click", (e) => {
	          const t = e.target;
	          if (!(t instanceof HTMLElement)) return;
	          const btn = t.closest?.("button[data-tab]");
	          if (!btn) return;
	          const key = String(btn.dataset.tab || "");
	          setEditorTab(key);
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
	      const unbindLayout = wirePreviewLayoutEvents();
	      wireEditorTabs();
	      wireActions();
	      setMode("light");

      actionsEl.replaceChildren();

      return () => {
	        unbindLayout?.();
      };
    },
  });
})();
