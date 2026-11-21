/*
 * ============================================================================
 * UI HELPERS — DOM creation, toasts, formatting
 * ============================================================================
 */

const UI = (() => {
  const el = (html) => {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };

  const toast = (msg, type = "info") => {
    const node = document.getElementById("toast");
    if (!node) return;
    node.textContent = msg;
    node.className = type ? `toast-${type}` : "";
    node.classList.add("show");
    setTimeout(() => node.classList.remove("show"), 2200);
  };

  const fmtDate = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  };

  const fmtPct = (n) => `${Math.round(n)}%`;

  const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));

  return { el, toast, fmtDate, fmtPct, escapeHtml };
})();
