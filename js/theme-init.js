// Apply the saved theme before first paint so there's no flash. Loaded in <head>, before the CSS.
(function () {
  var s = {};
  try { s = JSON.parse(localStorage.getItem("dsa-prep-v1")) || {}; } catch (e) {}
  var t = s.theme || "system", r = document.documentElement;
  if (t === "system") t = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  r.setAttribute("data-theme", t);
  r.setAttribute("data-density", s.density || "comfortable");
  r.setAttribute("data-code", s.codeTheme === "match" && ["light", "sand", "rose"].indexOf(t) >= 0 ? "light" : "dark");
  r.style.fontSize = { s: "14px", m: "15px", l: "16.5px" }[s.fontSize] || "15px";
  if (/^#[0-9a-f]{6}$/i.test(s.accent || "")) r.style.setProperty("--accent", s.accent);
})();
