(function () {
  if (window.DesignBookKit) return;

  const kit = (window.DesignBookKit = {});

  kit.version = "0.1.0";

  kit.math = {
    clamp(n, min, max) {
      return Math.max(min, Math.min(max, n));
    },
  };

  kit.text = {
    escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
    },
    escapeRegExp(s) {
      return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    },
  };

  kit.rand = {
    randomSeed() {
      return Math.floor(Math.random() * 1e9);
    },
    hashStringToU32(str) {
      let h = 2166136261;
      for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return h >>> 0;
    },
    mulberry32(seed) {
      let t = seed >>> 0;
      return function rand() {
        t += 0x6d2b79f5;
        let x = t;
        x = Math.imul(x ^ (x >>> 15), x | 1);
        x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
        return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
      };
    },
  };

  kit.storage = {
    loadJson(key, fallback = {}) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : fallback;
      } catch {
        return fallback;
      }
    },
    saveJson(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.warn("[DesignBookKit] saveJson failed:", key, e);
        return false;
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.warn("[DesignBookKit] remove failed:", key, e);
        return false;
      }
    },
  };

  kit.css = {
    ensureStyleOnce(id, cssText) {
      if (!id) throw new Error("ensureStyleOnce: missing id");
      const existing = document.getElementById(id);
      if (existing) return existing;
      const style = document.createElement("style");
      style.id = id;
      style.textContent = String(cssText || "");
      document.head.appendChild(style);
      return style;
    },
  };

  kit.three = {
    waitReady({ timeoutMs = 15000 } = {}) {
      if (window.THREE && window.OrbitControls) {
        return Promise.resolve({ THREE: window.THREE, OrbitControls: window.OrbitControls });
      }
      return new Promise((resolve, reject) => {
        let done = false;
        const onReady = () => {
          if (done) return;
          done = true;
          cleanup();
          if (window.THREE && window.OrbitControls) resolve({ THREE: window.THREE, OrbitControls: window.OrbitControls });
          else reject(new Error("THREE 初始化失败：three-ready 已触发但依赖未挂载到 window"));
        };
        const cleanup = () => {
          window.removeEventListener("three-ready", onReady);
          if (timer) clearTimeout(timer);
        };
        window.addEventListener("three-ready", onReady, { once: true });
        const timer =
          typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0
            ? setTimeout(() => {
                if (done) return;
                done = true;
                cleanup();
                reject(new Error("THREE 初始化超时：请检查网络或控制台错误"));
              }, timeoutMs)
            : null;
      });
    },
  };
})();

