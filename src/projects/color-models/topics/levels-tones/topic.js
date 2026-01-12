(() => {
  const MODULE_KEY = "color-models/levels-tones";
  const IMPL_GLOBAL = "DesignBookLevelsTonesImpl";

  const DesignBook = window.DesignBook;
  if (!DesignBook || typeof DesignBook.registerModule !== "function") {
    console.error("[levels-tones] DesignBook registry not loaded. Did you include src/registry.js?");
    return;
  }

  const currentScript = document.currentScript;
  const baseUrl =
    currentScript && currentScript.src ? new URL("./", currentScript.src).toString() : new URL("./src/projects/color-models/topics/levels-tones/", location.href).toString();
  const implSrc = new URL("impl.js", baseUrl).toString();

  const loadScriptOnce = (() => {
    const cache = new Map();
    return (src) => {
      if (cache.has(src)) return cache.get(src);
      const p = new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(s);
      });
      cache.set(src, p);
      return p;
    };
  })();

  async function ensureImpl() {
    if (window[IMPL_GLOBAL]) return window[IMPL_GLOBAL];
    await loadScriptOnce(implSrc);
    const impl = window[IMPL_GLOBAL];
    if (!impl || typeof impl.mount !== "function") throw new Error(`[levels-tones] Impl not ready: ${implSrc}`);
    return impl;
  }

  DesignBook.registerModule(MODULE_KEY, {
    mount: async (api) => {
      const impl = await ensureImpl();
      return impl.mount(api);
    },
  });
})();

