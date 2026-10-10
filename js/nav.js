"use strict";
// Navigation: the top bar (one button per page) plus the Interview section's sub-tabs.
// Loaded before interview.js and app.js; it only uses app.js globals (tab, S, save, render, today) at call time.

const TRACK_ICON = {};

// Sections with their own sub-tabs, addressed as "section:sub" (e.g. "interview:mock").
function sectionOf(t) {
  const m = /^(interview):/.exec(t);
  return m ? m[1] : null;
}

function renderNav() {
  const sec = sectionOf(tab);
  document.querySelectorAll("#nav button").forEach((b) => b.classList.toggle("active", (b.dataset.nav && b.dataset.nav === tab) || (!!b.dataset.track && b.dataset.track === sec)));
  const sub = $("#subnav");
  if (!sub) return;
  if (!sec) { sub.hidden = true; sub.innerHTML = ""; return; }
  const items = IV_TABS.map(([k, l]) => ["interview:" + k, l]);
  sub.hidden = false;
  sub.innerHTML = `<div class="subnav-inner"><span class="subnav-title t-${sec}">${TRACK_ICON[sec]}Interview</span>
    <div class="subnav-tabs">${items.map(([k, l]) => `<button data-tab="${k}" class="${k === tab ? "active" : ""}">${esc(l)}</button>`).join("")}</div></div>`;
}
// The page a section opens on the first time.
const defaultTab = (k) => k + ":mock";
function go(t) {
  tab = t;
  const s = sectionOf(t);
  if (s) { S.lastTab = S.lastTab || {}; S.lastTab[s] = t; save(); }
  render();
  window.scrollTo(0, 0);
}
// Counts one unit of activity today (feeds the streak).
function bump() { const t = today(); S.activity[t] = (S.activity[t] || 0) + 1; }

document.addEventListener("click", (e) => {
  let b;
  if ((b = e.target.closest("[data-nav-go]"))) return go(b.dataset.navGo);
});
