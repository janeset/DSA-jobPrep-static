"use strict";
// Global search (Ctrl+K or "/"): one index over every content file, built the first time search
// opens. Each entry knows how to open itself, using the same state + go() the pages use.
// Loaded before app.js; it only uses app.js / track globals at call time.

const SEARCH_TYPES = [
  // [type, label, weight]: weight breaks ties between equally good matches
  ["refresher", "Learn", 5], ["problem", "Problems", 5], ["interview", "Interview", 4], ["story", "Your stories", 3],
];
const stripHtml = (h) => String(h || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&[#\w]+;/g, " ").replace(/\s+/g, " ").trim();

// After navigating, bring an element into view under the sticky header and flash it.
function revealEl(sel) {
  const n = document.querySelector(sel);
  if (!n) return;
  n.scrollIntoView({ block: "start" }); window.scrollBy(0, -130);
  n.classList.add("flash"); setTimeout(() => n.classList.remove("flash"), 1600);
}

let searchIndex = null;
function buildSearchIndex() {
  const out = [];
  const add = (type, title, sub, text, open) => out.push({ type, title, sub, open, hay: (title + " " + sub + " " + text).toLowerCase(), text });

  // DSA
  PROBLEMS.forEach((p) => add("problem", p.t, `${CATS[p.c]} · ${DIFF[p.d]}`, contentReady && PROMPT[p.s] ? PROMPT[p.s].s : "", () => openWorkspace(p.s)));
  ASSESSMENTS.forEach((a) => add("interview", "Assessment: " + a.name, `${a.probs.length} questions · ${a.probs.reduce((n, [, m]) => n + m, 0)} min`, a.desc + " timed assessment test", () => go("interview:assess")));
  Object.keys(NOTES).forEach((k) => add("refresher", CATS[k], "Algorithm pattern", NOTES[k].spot + " " + NOTES[k].how, () => { S.refSel = "pat:" + k; go("learn"); }));
  const ref = (key, title, sub, text) => add("refresher", title, sub, text, () => { S.refSel = key; go("learn"); });
  const clean = (t) => t.replace(/^\d+\.\s*/, "");
  PRINCIPLES.forEach((l) => ref("pr:" + l.id, l.name, "Programming principles", (l.what + " " + l.points.join(" ")).replace(/`/g, "")));
  LESSONS.forEach((l) => ref("py:" + l.id, clean(l.title), "Python refresher", stripHtml(l.body)));
  JAVA_LESSONS.forEach((l) => ref("j:" + l.id, clean(l.title), "Java refresher", stripHtml(l.body)));
  CS_LESSONS.forEach((l) => ref("c:" + l.id, clean(l.title), "C# refresher", stripHtml(l.body)));
  ref("ds:overview", "Data Structures Crash Course", "Overview & cheat sheet", "data structures course cheat sheet costs");
  DS.forEach((d) => ref("ds:" + d.id, d.name, "Data Structures Crash Course", d.what));
  ref("bigo", "Big-O", "Complexity", "time space complexity growth calculator quiz");
  return out;
}

// Stories are user data, so they're added fresh on every search rather than cached.
function storyEntries() {
  return (S.stories || []).map((s) => ({ type: "story", title: s.title || "Untitled story", sub: "STAR story", text: [s.s, s.t, s.a, s.r].join(" "),
    hay: [s.title, s.s, s.t, s.a, s.r, (s.themes || []).join(" ")].join(" ").toLowerCase(), open: () => { views._ivEdit = s.id; go("interview:stories"); } }));
}

function runSearch(q) {
  q = q.trim().toLowerCase();
  if (!q) return [];
  if (!searchIndex) searchIndex = buildSearchIndex();
  const terms = q.split(/\s+/), weight = Object.fromEntries(SEARCH_TYPES.map(([t, , w]) => [t, w]));
  // Short terms must start a word ("rag" shouldn't match "storage"); longer ones match anywhere.
  const reEsc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = (t) => new RegExp((t.length < 4 ? "(^|[^a-z0-9])" : "") + reEsc(t));
  const termRes = terms.map(re), phrase = re(q);
  const startRes = terms.map((t) => new RegExp("(^|[^a-z0-9])" + reEsc(t)));
  const hits = [];
  for (const e of searchIndex.concat(storyEntries())) {
    if (!termRes.every((r) => r.test(e.hay))) continue;
    const title = e.title.toLowerCase();
    let score = weight[e.type] * 6;
    if (title === q) score += 120; else if (title.startsWith(q)) score += 90; else if (phrase.test(title)) score += 50;
    score += startRes.filter((r) => r.test(title)).length * 20 + termRes.filter((r) => r.test(title)).length * 5;
    if (e.sub.toLowerCase().includes(q)) score += 5;
    hits.push({ e, score });
  }
  hits.sort((a, b) => b.score - a.score || a.e.title.length - b.e.title.length);
  return hits.slice(0, 60).map((h) => h.e);
}

// ~120 characters of body text around the first matching term, with the terms highlighted.
function snippet(e, q) {
  if (!e.text) return "";
  const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean), low = e.text.toLowerCase();
  if (terms.every((t) => e.title.toLowerCase().includes(t))) return esc(e.text.slice(0, 110)) + (e.text.length > 110 ? "…" : "");
  const found = terms.map((t) => low.indexOf(t)).filter((i) => i >= 0);
  if (!found.length) return "";
  const at = Math.min(...found);
  const from = Math.max(0, at - 40), part = e.text.slice(from, from + 130);
  return (from ? "…" : "") + markTerms(part, terms) + (from + 130 < e.text.length ? "…" : "");
}
function markTerms(s, terms) {
  const re = new RegExp("(" + terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")", "gi");
  return s.split(re).map((p, i) => (i % 2 ? `<mark>${esc(p)}</mark>` : esc(p))).join("");
}

// ---------------- dialog ----------------
let searchHits = [], searchPos = 0;
function openSearch() {
  let dlg = document.getElementById("search-dlg");
  if (!dlg) {
    dlg = document.createElement("dialog");
    dlg.id = "search-dlg";
    dlg.innerHTML = `<div class="card search-panel">
      <label class="search">${ICON_SEARCH}<input id="gs-q" placeholder="Search problems, lessons, patterns, stories..." autocomplete="off" spellcheck="false" aria-label="Search" aria-controls="gs-res"></label>
      <div id="gs-res" class="gs-res" role="listbox"></div>
      <div class="gs-foot muted"><span><kbd>&uarr;</kbd><kbd>&darr;</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></div></div>`;
    document.body.appendChild(dlg);
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
    $("#gs-q", dlg).addEventListener("input", (e) => { searchPos = 0; drawSearch(e.target.value); });
    $("#gs-q", dlg).addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!searchHits.length) return;
        searchPos = (searchPos + (e.key === "ArrowDown" ? 1 : -1) + searchHits.length) % searchHits.length;
        markActive();
      } else if (e.key === "Enter" && searchHits[searchPos]) { e.preventDefault(); pickHit(searchPos); }
    });
    $("#gs-res", dlg).addEventListener("click", (e) => { const r = e.target.closest("[data-gs]"); if (r) pickHit(+r.dataset.gs); });
    $("#gs-res", dlg).addEventListener("mousemove", (e) => { const r = e.target.closest("[data-gs]"); if (r && +r.dataset.gs !== searchPos) { searchPos = +r.dataset.gs; markActive(); } });
  }
  dlg.showModal();
  const inp = $("#gs-q", dlg); inp.select(); drawSearch(inp.value);
  // Problem summaries come with the on-demand content (js/workspace.js): rebuild the index once it's in.
  if (!contentReady) loadContent().then(() => { searchIndex = null; if (dlg.open) drawSearch(inp.value); }, () => {});
}
function drawSearch(q) {
  const box = $("#gs-res");
  if (!q.trim()) {
    searchHits = [];
    box.innerHTML = `<div class="gs-empty muted">Search across ${SEARCH_TYPES.map(([, l]) => l.toLowerCase()).join(", ")}.<br>Try <b>two pointers</b>, <b>heap</b>, <b>dictionaries</b> or <b>linked list</b>.</div>`;
    return;
  }
  const hits = runSearch(q);
  // group by type, groups ordered by their best hit
  const groups = [];
  hits.forEach((h) => { let g = groups.find((x) => x.type === h.type); if (!g) groups.push((g = { type: h.type, list: [] })); if (g.list.length < 8) g.list.push(h); });
  searchHits = groups.flatMap((g) => g.list);
  if (!searchHits.length) { box.innerHTML = `<div class="gs-empty muted">No results for "${esc(q)}".</div>`; return; }
  let i = 0;
  const terms = q.trim().toLowerCase().split(/\s+/);
  box.innerHTML = groups.map((g) => `<div class="gs-group">${esc(SEARCH_TYPES.find(([t]) => t === g.type)[1])}</div>` + g.list.map((h) => {
    const sn = snippet(h, q);
    return `<div class="gs-hit" role="option" data-gs="${i++}"><div class="gs-t">${markTerms(h.title, terms)}</div><div class="gs-s muted">${esc(h.sub)}</div>${sn ? `<div class="gs-x muted">${sn}</div>` : ""}</div>`;
  }).join("")).join("");
  markActive();
}
function markActive() {
  document.querySelectorAll("#gs-res .gs-hit").forEach((n) => {
    const on = +n.dataset.gs === searchPos;
    n.classList.toggle("on", on); n.setAttribute("aria-selected", on);
    if (on) n.scrollIntoView({ block: "nearest" });
  });
}
function pickHit(i) {
  const h = searchHits[i];
  document.getElementById("search-dlg").close();
  if (h) h.open();
}

document.addEventListener("keydown", (e) => {
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
  if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) { e.preventDefault(); openSearch(); }
  else if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); openSearch(); }
});
document.addEventListener("click", (e) => { if (e.target.closest("#search-open")) openSearch(); });
