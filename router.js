"use strict";
// URL routing: every page has an address (#/learn/py:basics, #/problems/two-sum, #/interview/mock),
// so refresh keeps your place, Back/Forward work and any page can be bookmarked.
// The URL is derived from app state after each render; handlers keep setting `tab` and the
// selection as before and never touch the URL themselves.
// Loaded before app.js; it only uses app.js globals (tab, S, views, render...) at call time.

const SIMPLE_TABS = ["home", "learn", "problems", "roadmap", "companies", "settings"];
// Addresses from before the Learn / Problems / Roadmap layout still work.
const OLD_TABS = { today: "home", refreshers: "learn", solutions: "problems", practice: "problems" };

// The address for the current state, without the leading "#/".
function currentPath() {
  const sec = sectionOf(tab), sub = tab.split(":")[1] || "mock";
  if (sec === "interview") return `${sec}/${sub}`;
  if (tab === "learn") return "learn/" + (S.refSel || learnPath()[0][0]);
  if (tab === "problems" && views._ws !== null && views._ws !== undefined) return "problems/" + (views._ws || "scratchpad");
  return tab;
}

// Sets state from an address. Unknown addresses fall back to Home.
function applyPath(hash) {
  const parts = decodeURIComponent(String(hash || "").replace(/^#\/?/, "")).split("/").filter(Boolean);
  let [a, b] = parts;
  if (!a) { tab = "home"; return; }
  if (OLD_TABS[a]) { if (a === "practice" && !b) b = "scratchpad"; a = OLD_TABS[a]; }
  if (a === "interview") tab = `${a}:${b || "mock"}`;
  else if (SIMPLE_TABS.includes(a)) {
    tab = a;
    if (a === "learn" && b) S.refSel = parts.slice(1).join("/");
    if (a === "problems") views._ws = b === "scratchpad" ? "" : b && PROBLEMS.some((p) => p.s === b) ? b : null;
  } else tab = "home";
  const s = sectionOf(tab);
  if (s) { S.lastTab = S.lastTab || {}; S.lastTab[s] = tab; }
}

// Called at the end of render(): push a history entry when the page changed. The entry being
// left remembers its scroll position so Back returns to the same spot.
let lastPath = null;
function syncUrl() {
  const p = currentPath();
  if (p === lastPath) return;
  const h = "#/" + p;
  if (lastPath === null) history.replaceState({ y: 0 }, "", h);
  else { history.replaceState({ y: window.scrollY }, "", location.hash); history.pushState({ y: 0 }, "", h); }
  lastPath = p;
}
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.addEventListener("popstate", (e) => {
  applyPath(location.hash);
  lastPath = currentPath();
  history.replaceState(e.state, "", "#/" + lastPath);
  render();
  window.scrollTo(0, (e.state && e.state.y) || 0);
});

// Re-render in place: keeps the page scroll position and puts keyboard focus back on the same
// control (matched by id or its first data-* attribute), so ticking a box doesn't jump the page.
function focusKey(el) {
  if (!el || el === document.body) return null;
  if (el.id) return "#" + CSS.escape(el.id);
  const d = Object.keys(el.dataset || {})[0];
  if (!d) return null;
  const attr = "data-" + d.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
  return `${el.tagName.toLowerCase()}[${attr}="${CSS.escape(el.dataset[d])}"]`;
}
function rerender() {
  const y = window.scrollY, key = focusKey(document.activeElement);
  render();
  window.scrollTo(0, y);
  if (key) { const n = document.querySelector(key); if (n) n.focus({ preventScroll: true }); }
}
