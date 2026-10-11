"use strict";
// ---------- state ----------
const KEY = "dsa-prep-v1";
const INTERVALS = [1, 3, 7, 14, 30, 60]; // days until next review by stage
const STATUSES = ["Researching", "Applied", "Screen", "Interview", "Offer", "Rejected"];

const iso = (d) => { const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return z.toISOString().slice(0, 10); };
const today = () => iso(new Date());
const addDays = (s, n) => { const d = new Date(s + "T00:00:00"); d.setDate(d.getDate() + n); return iso(d); };
const dayDiff = (a, b) => Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 86400000);

const blankState = () => ({ start: today(), solved: {}, companies: [], code: {}, activity: {}, ref: {}, bigo: {}, principles: {}, learnRead: {} });
const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const isDate = (v) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
// Keeps only well-formed fields of a stored or imported state, so a bad backup file can't break a page
// or inject markup. Fields this app doesn't know (e.g. from the combined Prep Hub app) are kept as they are.
function cleanState(d) {
  const s = blankState();
  if (!isObj(d)) return s;
  for (const k of Object.keys(d)) {
    if (k === "__proto__" || k === "constructor" || k === "prototype") continue;
    const v = d[k], def = s[k];
    if (def === undefined || (Array.isArray(def) ? Array.isArray(v) : isObj(def) ? isObj(v) : typeof v === typeof def)) s[k] = v;
  }
  if (!isDate(s.start)) s.start = today();
  if (s.accent != null && !/^#[0-9a-f]{6}$/i.test(s.accent)) s.accent = null;
  for (const [slug, r] of Object.entries(s.solved)) {
    if (!isObj(r)) { delete s.solved[slug]; continue; }
    if (!isDate(r.next)) r.next = today();
    if (!Number.isInteger(r.stage) || r.stage < 0) r.stage = 0;
    r.attempts = Array.isArray(r.attempts) ? r.attempts.filter(isObj) : [];
  }
  for (const k of Object.keys(s.code)) if (typeof s.code[k] !== "string") delete s.code[k];
  for (const k of Object.keys(s.activity)) if (!isDate(k) || typeof s.activity[k] !== "number") delete s.activity[k];
  s.companies = s.companies.filter(isObj).map((c) => ({
    name: String(c.name ?? ""), tier: TIERS.some((t) => t.id === +c.tier) ? +c.tier : TIERS[0].id,
    status: STATUSES.includes(c.status) ? c.status : STATUSES[0], note: String(c.note ?? ""),
  }));
  cleanInterview(s); // js/interview.js
  return s;
}
function load() {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
  return cleanState(s);
}
let S = load();
let saveTimer = null;
function save() {
  clearTimeout(saveTimer); saveTimer = null;
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { alert("Could not save to browser storage."); }
}
// For typing in editors: saves once the keystrokes pause instead of on every key.
function saveSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(save, 400); }
addEventListener("pagehide", () => { if (saveTimer) save(); });
document.addEventListener("visibilitychange", () => { if (document.hidden && saveTimer) save(); });

// ---------- appearance ----------
const THEMES = [
  { id: "system", name: "System", desc: "Follows your device" },
  { id: "light", name: "Paper", desc: "Clean and bright" },
  { id: "dark", name: "Graphite", desc: "Calm, neutral dark" },
  { id: "midnight", name: "Midnight", desc: "Deep blue night" },
  { id: "nord", name: "Nord", desc: "Arctic, muted blues" },
  { id: "sand", name: "Sand", desc: "Warm paper tones" },
  { id: "forest", name: "Forest", desc: "Dark with green accent" },
  { id: "rose", name: "Rosé", desc: "Soft and light" },
  { id: "contrast", name: "High contrast", desc: "Maximum legibility" },
];
const LIGHT_THEMES = new Set(["light", "sand", "rose"]);
const ACCENTS = ["#5b5bd6", "#2f6fed", "#0f9d8f", "#16a34a", "#ea580c", "#e11d48", "#8b5cf6"];
const darkQuery = window.matchMedia ? matchMedia("(prefers-color-scheme: dark)") : null;
const resolvedTheme = () => { const t = S.theme || "system"; return t === "system" ? (darkQuery && darkQuery.matches ? "dark" : "light") : t; };
const ICON_SUN = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`;
const ICON_MOON = `<svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></svg>`;
function applyTheme() {
  const r = document.documentElement, t = resolvedTheme();
  r.dataset.theme = t;
  r.dataset.density = S.density || "comfortable";
  r.dataset.code = S.codeTheme === "match" && LIGHT_THEMES.has(t) ? "light" : "dark";
  r.style.fontSize = { s: "14px", m: "15px", l: "16.5px" }[S.fontSize || "m"];
  if (S.accent) r.style.setProperty("--accent", S.accent); else r.style.removeProperty("--accent");
  const q = document.getElementById("theme-quick");
  if (q) q.innerHTML = LIGHT_THEMES.has(t) ? ICON_MOON : ICON_SUN;
}
if (darkQuery) darkQuery.addEventListener("change", () => { if ((S.theme || "system") === "system") { applyTheme(); if (tab === "settings") render(); } });

// ---------- helpers ----------
const DIFF = { E: "Easy", M: "Medium", H: "Hard" };
const diffBadge = (d) => `<span class="badge ${d}">${DIFF[d]}</span>`;
const ICON_SEARCH = `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`;
const searchBox = (id, value, ph = "Search problems...") => `<label class="search">${ICON_SEARCH}<input id="${id}" placeholder="${ph}" value="${esc(value)}" autocomplete="off"></label>`;
const pageHead = (title, sub = "") => `<div class="page-head"><h2>${title}</h2>${sub ? `<p class="muted">${sub}</p>` : ""}</div>`;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const $ = (sel, root = document) => root.querySelector(sel);
// Every problem is always shown; its Easy / Medium / Hard tag says how hard it is.
const included = () => PROBLEMS;
const rec = (slug) => S.solved[slug];
const isDone = (slug) => !!rec(slug);
const probBySlug = (slug) => PROBLEMS.find((p) => p.s === slug);
const weekProblems = (w) => included().filter((p) => w.cats.includes(p.c));
const currentWeek = () => Math.min(12, Math.max(1, Math.floor(dayDiff(S.start, today()) / 7) + 1));
const stepNum = (n) => `<span class="step-n">${n}</span>`;

function streak() {
  let n = 0, d = today();
  if (!S.activity[d]) d = addDays(d, -1); // today may not be done yet
  while (S.activity[d]) { n++; d = addDays(d, -1); }
  return n;
}
function dueReviews() {
  const t = today();
  return PROBLEMS.filter((p) => rec(p.s) && rec(p.s).next <= t).sort((a, b) => rec(a.s).next.localeCompare(rec(b.s).next));
}
function statusCell(p) {
  const r = rec(p.s);
  if (!r) return `<span class="badge">To do</span>`;
  const due = r.next <= today();
  return due ? `<span class="badge due">Review due</span>` : `<span class="badge done">Done</span>`;
}
const videoUrl = (p) => VIDEOS[p.s] ? `https://www.youtube.com/watch?v=${VIDEOS[p.s]}` : yt("neetcode " + p.t + " leetcode solution");
// Click-to-play video cards (the iframe only loads when clicked).
const vids = (list) => !list || !list.length ? "" : `<div class="vgrid">${list.map((v) =>
  `<div class="vcard" data-vid="${v.id}" role="button" tabindex="0" title="Play video"><img loading="lazy" alt="" src="https://i.ytimg.com/vi/${v.id}/mqdefault.jpg"><span class="play">&#9654;</span>
   <div class="vt">${esc(v.title)}<br><span class="muted">${esc(v.ch)}</span></div></div>`).join("")}</div>`;
const yt = (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
const LESSON_YT = {
  basics: "python basics variables loops conditionals tutorial", strings: "python strings methods slicing tutorial",
  lists: "python lists tuples slicing tutorial", dicts: "python dictionaries sets tutorial",
  functions: "python functions args kwargs scope closures", comprehensions: "python list comprehensions generators yield",
  classes: "python classes OOP tutorial", errors: "python exceptions try except tutorial",
  stdlib: "python collections heapq bisect deque for coding interviews", recursion: "recursion and big o notation python",
  testing: "python pytest unittest tutorial",
};
// One row per problem: the title and Open both go to its workspace.
// Company pills: "FAANG #12" (frequency on hover), "OpenAI", "Anthropic", and "Practical" for problems written for this app.
const coPills = (p) => {
  const f = faangOf(p.s);
  return (f ? `<span class="pill faang" title="FAANG Top 250 #${f[0]} · Meta ${f[1]} · Amazon ${f[2]} · Google ${f[3]} (LeetCode frequency, last 6 months)">FAANG #${f[0]}</span> ` : "")
    + companiesOf(p.s).map((k) => `<span class="pill faang" title="On the ${esc(COMPANY_SETS[k].name)} list">${esc(COMPANY_SETS[k].name)}</span> `).join("")
    + (isCustom(p.s) ? `<span class="pill" title="Written for this app from candidate reports; no LeetCode page">Practical</span>` : "");
};
function probRow(p) {
  return `<tr><td><button class="link-btn" data-open="${p.s}">${esc(p.t)}</button> ${coPills(p)}</td><td>${diffBadge(p.d)}</td>
    <td class="hide-sm muted">${esc(CATS[p.c])}</td>
    <td>${statusCell(p)}</td><td class="actions"><button class="btn small primary" data-open="${p.s}">Open</button>
    <button class="btn small" data-log="${p.s}">${isDone(p.s) ? "Log again" : "Log"}</button>
    <button class="btn small ghost" data-sol="${p.s}">Solution</button></td></tr>`;
}
const probTable = (list) => `<div class="table-wrap"><table><tr><th>Problem</th><th>Difficulty</th><th class="hide-sm">Topic</th><th>Status</th><th></th></tr>${list.map(probRow).join("")}</table></div>`;

// ---------- logging dialog ----------
function logDialog(slug) {
  const p = probBySlug(slug), r = rec(slug) || {};
  const dlg = document.createElement("dialog");
  dlg.innerHTML = `<form method="dialog" class="card" style="margin:0">
    <div class="label">Log attempt</div>
    <h3 style="margin:4px 0 14px">${esc(p.t)} ${diffBadge(p.d)}</h3>
    <p><label>Minutes taken <input id="l-min" type="number" min="1" value="${timerSec && views._ws === slug ? Math.max(1, Math.round(timerSec / 60)) : 25}"></label></p>
    <p><label>How did it go? <select id="l-conf">
      <option value="0">Struggled / needed the solution</option>
      <option value="1" selected>Solved with some effort</option>
      <option value="2">Solved easily</option></select></label></p>
    ${hintsShown(slug) ? `<p class="muted">You opened ${hintsShown(slug)} hint${hintsShown(slug) === 1 ? "" : "s"}. That's saved with this attempt.</p>` : ""}
    <p><label>Notes: the trick, your mistakes <textarea id="l-notes" rows="3" placeholder="e.g. hash map of value -> index">${esc(r.notes || "")}</textarea></label></p>
    <div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn ghost" value="cancel">Cancel</button><button class="btn primary" value="ok">Save attempt</button></div></form>`;
  document.body.appendChild(dlg);
  dlg.addEventListener("close", () => {
    if (dlg.returnValue === "ok") {
      const conf = +$("#l-conf", dlg).value, mins = +$("#l-min", dlg).value || 0;
      const prev = rec(slug);
      let stage = prev ? prev.stage : 0;
      stage = conf === 0 ? 0 : stage + (conf === 2 ? 2 : 1);
      const t = today();
      S.solved[slug] = {
        stage, next: addDays(t, INTERVALS[Math.min(stage, INTERVALS.length - 1)]),
        notes: $("#l-notes", dlg).value, attempts: [...(prev?.attempts || []), Object.assign({ date: t, mins, conf }, hintsShown(slug) ? { hints: hintsShown(slug) } : {})],
      };
      S.activity[t] = (S.activity[t] || 0) + 1;
      save(); rerender();
    }
    dlg.remove();
  });
  dlg.showModal();
}

// ---------- the Learn path ----------
// Step 1 in order: your main language, Big-O, data structures, then the algorithm patterns.
// Each unit is [key, label, done]. Other languages are optional extras outside the path.
const LANGS = [["py", "Python"], ["java", "Java"], ["cs", "C#"]];
const mainLang = () => S.dsLang || "py";
const langName = (k) => LANGS.find(([v]) => v === k)[1];
const lessonLabel = (l) => l.title.replace(/^\d+\.\s*/, "").split(":")[0];
const pyLessonDone = (l) => l.exercises.every((_, j) => S.ref[l.id + "-" + j]);
const learnRead = (k) => !!(S.learnRead || {})[k];
function langUnits(lang) {
  if (lang === "py") return LESSONS.map((l) => ["py:" + l.id, lessonLabel(l), pyLessonDone(l)]);
  const m = LANG_META[lang];
  return m.lessons().map((l) => [m.prefix + l.id, lessonLabel(l), langLessonDone(lang, l) === l.exercises.length]);
}
// A principles lesson is done once its quiz is all correct, or it's marked as reviewed.
const prDone = (l) => learnRead("pr:" + l.id) || prQuiz(l).every((q) => S.principles[q.id]);
function learnPath() {
  return [
    ...PRINCIPLES.map((l) => ["pr:" + l.id, l.name, prDone(l)]),
    ...langUnits(mainLang()),
    ["bigo", "Big-O", learnRead("bigo") || Object.keys(S.bigo).length === BIGO_QUIZ.length],
    ["ds:overview", "Data structures overview", learnRead("ds:overview")],
    ...DS.map((d) => ["ds:" + d.id, d.name, learnRead("ds:" + d.id)]),
    ...Object.keys(NOTES).map((k) => ["pat:" + k, CATS[k], learnRead("pat:" + k)]),
  ];
}
const learnNext = () => learnPath().find((u) => !u[2]);
// The Data Structures Crash Course: the overview, then one lesson per structure.
const DS_COURSE = () => ["ds:overview", ...DS.map((d) => "ds:" + d.id)];
const dsCourseDone = () => DS_COURSE().filter(learnRead).length;
// "Python: Basics" for language lessons, the plain label otherwise.
const unitLabel = (u) => (partOf(u[0]) === "lang" ? `${langName(mainLang())}: ${u[1]}` : u[1]);
const PATH_PARTS = [["pr", "Principles"], ["lang", "Your language"], ["bigo", "Big-O"], ["ds", "Data Structures Crash Course"], ["pat", "Algorithm patterns"]];
const partOf = (key) => (key === "bigo" ? "bigo" : key.startsWith("pr:") ? "pr" : key.startsWith("ds:") ? "ds" : key.startsWith("pat:") ? "pat" : "lang");
// Previous / Next along the path; pages outside it (other languages) step through their own lessons.
function learnNav(key) {
  const path = learnPath(), i = path.findIndex((u) => u[0] === key);
  let prev, next;
  if (i >= 0) {
    prev = path[i - 1];
    next = path[i + 1];
  } else {
    const lang = key.startsWith("py:") ? "py" : key.startsWith("j:") ? "java" : "cs", units = langUnits(lang), k = units.findIndex((u) => u[0] === key);
    prev = units[k - 1];
    next = units[k + 1] || ["bigo", "Big-O"];
  }
  // Crossing into another part of the path names the language ("Next: Python: Basics", not "Next: Basics").
  const label = (u) => esc(i >= 0 && partOf(u[0]) !== partOf(key) ? unitLabel(u) : u[1]);
  const nextBtn = next ? `<button class="btn primary" data-ref="${next[0]}">Next: ${label(next)} &rarr;</button>`
    : `<button class="btn primary" data-goto-tab="problems">Step 2: practise the problems &rarr;</button>`;
  return `<div class="row between">${prev ? `<button class="btn" data-ref="${prev[0]}">&larr; ${label(prev)}</button>` : "<span></span>"}${nextBtn}</div>`;
}
const reviewBtn = (key) => `<button class="btn ${learnRead(key) ? "" : "primary"}" data-learnread="${key}">${learnRead(key) ? "Reviewed ✓ (undo)" : "Mark as reviewed"}</button>`;

// ---------- views ----------
const views = {
  home() {
    const inc = included(), done = inc.filter((p) => isDone(p.s)).length;
    const wk = currentWeek(), w = WEEKS[wk - 1], wp = weekProblems(w), next = wp.filter((p) => !isDone(p.s)).slice(0, 3);
    const due = dueReviews(), st = streak();
    const path = learnPath(), learned = path.filter((u) => u[2]).length, nextUnit = learnNext();
    const hr = new Date().getHours(), hello = hr < 12 ? "Good morning" : hr < 18 ? "Good afternoon" : "Good evening";
    const dateStr = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
    const fresh = !Object.keys(S.activity).length;
    const bar = (n, total) => `<div class="bar"><i style="width:${total ? (100 * n / total) | 0 : 0}%"></i></div>`;
    const primary = nextUnit && (fresh || learned < path.length)
      ? `<button class="btn primary" data-ref="${nextUnit[0]}" data-goto="learn">${fresh ? "Start here" : "Continue"}: ${esc(unitLabel(nextUnit))} &rarr;</button>`
      : next.length ? `<button class="btn primary" data-open="${next[0].s}">Next problem: ${esc(next[0].t)} &rarr;</button>`
      : `<button class="btn primary" data-goto-tab="roadmap">Open the roadmap &rarr;</button>`;
    const intro = S.introSeen ? "" : `<div class="card intro"><div class="section-head"><h3>New here? How DSA Prep works</h3><button class="btn small" data-introok>Got it</button></div>
      <ul style="margin-bottom:0">
        <li><b>Follow the three steps in order.</b> Learn a topic, then solve the problems for it. The Roadmap spreads it all over 12 weeks so you always know what this week is about.</li>
        <li><b>Log every attempt.</b> Problems come back for review on a spaced schedule (1, 3, 7, 14, 30 and 60 days). If you needed the solution, log "Struggled" and it comes back tomorrow.</li>
        <li><b>Give each problem 20-30 minutes</b> before revealing the solution. Struggling first is what makes it stick.</li>
        <li><b>A good daily routine:</b> reviews due first (about 10 minutes), then one or two new problems.</li>
        <li><b>Everything saves in this browser.</b> Export a backup now and then from Settings. Press <kbd>Ctrl K</kbd> anywhere to search.</li></ul></div>`;
    const step = (n, title, desc, n1, total, unit, extra, btn) => `<div class="card step-card">
      <div class="step-head">${stepNum(n)}<h3>${title}</h3></div>
      <p class="muted" style="margin:0">${desc}</p>
      <div><div class="row between"><span class="label" style="margin:0">${n1} / ${total} ${unit}</span>${extra}</div>${bar(n1, total)}</div>
      <div class="row">${btn}</div></div>`;
    return `${intro}<section class="card hero">
      <div style="position:relative;z-index:1">
        <div class="eyebrow">${esc(dateStr)} · Week ${wk} of 12</div>
        <h1>${hello}.</h1>
        <p>DSA Prep gets you ready for coding interviews in three steps: <b style="color:var(--text)">learn</b> programming principles, your language, Big-O, data structures and patterns, <b style="color:var(--text)">practise</b> problems for each pattern, and follow the <b style="color:var(--text)">12-week roadmap</b>. Spaced reviews keep it all fresh.</p>
        <div class="row" style="margin-top:14px">${primary}${due.length ? `<button class="btn" data-due="1">Review ${due.length} due</button>` : ""}</div>
      </div>
      <div class="ring" title="${done} of ${inc.length} problems solved">
        <svg viewBox="0 0 120 120"><circle class="track" cx="60" cy="60" r="52" fill="none" stroke-width="10"/>
          <circle class="prog" cx="60" cy="60" r="52" fill="none" stroke-width="10" stroke-linecap="round" stroke-dasharray="${2 * Math.PI * 52}" stroke-dashoffset="${2 * Math.PI * 52 * (1 - (inc.length ? done / inc.length : 0))}"/></svg>
        <div class="ring-label"><b>${Math.round(100 * (inc.length ? done / inc.length : 0))}%</b><span>${done} / ${inc.length} solved</span></div>
      </div>
    </section>
    <div class="section-head" style="margin:22px 0 10px"><h3 style="margin:0">How it works</h3><span class="muted">Three steps, in order. Your progress is on each card.</span></div>
    <div class="steps">
      ${step(1, "Learn", `Start with programming principles, refresh ${esc(langName(mainLang()))}, then Big-O, the core data structures and the algorithm patterns interviews use. Lessons have quizzes, exercises and videos.`,
        learned, path.length, "topics", nextUnit ? `<span class="muted">Next: ${esc(unitLabel(nextUnit))}</span>` : '<span class="badge done">Done</span>',
        `<button class="btn primary" data-ref="${(nextUnit || path[0])[0]}" data-goto="learn">${learned ? "Continue learning" : "Start learning"} &rarr;</button>`)}
      ${step(2, "Problems", `${PROBLEMS.length} problems grouped by pattern and tagged Easy, Medium or Hard. Open one to code it in the browser, log your attempt and reveal the solution.`,
        done, inc.length, "solved", due.length ? `<span class="badge due">${due.length} due</span>` : "",
        `<button class="btn primary" data-goto-tab="problems">Practise problems &rarr;</button>`)}
      ${step(3, "Roadmap", "Twelve weeks, one pattern family at a time, with every week's problems and solutions in one place. Week 12 is mock interviews.",
        wk, 12, "weeks", `<span class="muted">${esc(w.title)}</span>`,
        `<button class="btn primary" data-goto-tab="roadmap">Open the roadmap &rarr;</button>`)}
    </div>
    <div class="section-head" style="margin:22px 0 10px"><h3 style="margin:0">Today</h3><span class="muted">&#128293; ${st} day streak · ${Math.max(0, 84 - dayDiff(S.start, today()))} days left in the plan</span></div>
    <div class="cols-2">
      <div class="card"><div class="section-head"><h3>This week · ${esc(w.title)}</h3><span class="muted">${wp.filter((p) => isDone(p.s)).length} / ${wp.length}</span></div>
        ${next.length ? `<div class="list">${next.map((p) => `<div class="li"><div><button class="link-btn" data-open="${p.s}">${esc(p.t)}</button><div class="muted">${esc(CATS[p.c])}</div></div>
          <div class="row">${diffBadge(p.d)}<button class="btn small primary" data-open="${p.s}">Open</button></div></div>`).join("")}</div>`
          : wk === 12 ? mockBlock() : `<div class="empty"><span class="big">&#10003;</span>This week's set is done. Get ahead from the Roadmap.</div>`}</div>
      <div class="card"><div class="section-head"><h3>Reviews due</h3>${due.length > 3 ? `<button class="btn small ghost" data-due="1">See all ${due.length}</button>` : ""}</div>
        ${due.length ? `<div class="list">${due.slice(0, 3).map((p) => `<div class="li"><div><button class="link-btn" data-open="${p.s}">${esc(p.t)}</button><div class="muted">${esc(CATS[p.c])}</div></div>
          <div class="row">${diffBadge(p.d)}<button class="btn small primary" data-log="${p.s}">Log</button></div></div>`).join("")}</div>`
          : `<div class="empty"><span class="big">&#9788;</span>Nothing due. Problems you log come back here on a spaced schedule.</div>`}</div>
    </div>
    <div class="section-head" style="margin:22px 0 10px"><h3 style="margin:0">Also in the app</h3></div>
    <div class="mini-grid">
      ${(() => { const c = DS_COURSE(), n = dsCourseDone(), nx = c.find((k) => !learnRead(k)) || c[0];
        return `<div class="card"><h3>Data Structures Crash Course</h3><p class="muted">An overview, then ${DS.length} short lessons from arrays to union-find, each with costs, code in your language and a video.</p>
          <div class="label" style="margin:0">${n} / ${c.length} lessons</div>${bar(n, c.length)}
          <button class="btn small" style="margin-top:12px" data-ref="${nx}" data-goto="learn">${n ? (n === c.length ? "Review the course" : "Continue the course") : "Start the course"} &rarr;</button></div>`; })()}
      <div class="card"><h3>Assessments</h3><p class="muted">${ASSESSMENTS.length} timed assessments like a real interview day, including a FAANG set.</p><button class="btn small" data-nav-go="interview:assess">Take an assessment &rarr;</button></div>
      <div class="card"><h3>Mock interviews</h3><p class="muted">Timed mock interviews with coding and behavioural rounds, a STAR story bank and your score history.</p><button class="btn small" data-nav-go="interview:mock">Start a mock &rarr;</button></div>
      <div class="card"><h3>Companies</h3><p class="muted">What coding rounds look like at local employers, the problem level each needs, and your application tracker.</p><button class="btn small" data-goto-tab="companies">Open companies &rarr;</button></div>
      <div class="card"><h3>Settings</h3><p class="muted">Themes, your main language, plan start date, problem level, and backups of your progress.</p><button class="btn small" data-goto-tab="settings">Open settings &rarr;</button></div>
    </div>`;
  },

  learn() {
    const sel = S.refSel || learnPath()[0][0];
    const compact = !!S.refCompact, shut = S.refShut || {}, lang = mainLang();
    const initials = (s) => s.split(/\s+/).filter((w) => /\w/.test(w)).map((w) => w[0].toUpperCase()).join("").slice(0, 2);
    // item = [key, label, progress, short label for the compact rail]
    const grp = (title, items, extra = "") => `<button class="side-h" data-grp="${esc(title)}" title="${shut[title] ? "Expand" : "Collapse"} ${esc(title)}"><span class="lbl">${esc(title)}</span>${extra ? `<span class="muted lbl side-n">${extra}</span>` : ""}<span class="chev">${shut[title] ? "&#9656;" : "&#9662;"}</span></button>` +
      (shut[title] && !compact ? "" : items.map(([k, label, extra, short]) =>
        `<button class="side-i ${sel === k ? "active" : ""}" data-ref="${k}" title="${esc(label)}"><span class="lbl">${esc(label)}</span><span class="sh">${esc(short || initials(label))}</span>${extra ? `<span class="muted lbl">${extra}</span>` : ""}</button>`).join(""));
    const tick = (k) => (learnRead(k) ? "✓" : "");
    const langGroup = (lg, title) => grp(title, lg === "py"
      ? LESSONS.map((l, i) => ["py:" + l.id, lessonLabel(l), `${l.exercises.filter((_, j) => S.ref[l.id + "-" + j]).length}/${l.exercises.length}`, String(i + 1)])
      : LANG_META[lg].lessons().map((l, i) => [LANG_META[lg].prefix + l.id, lessonLabel(l), `${langLessonDone(lg, l)}/${l.exercises.length}`, (lg === "java" ? "J" : "C") + (i + 1)]));
    const side = `<button class="side-toggle" id="ref-compact" title="${compact ? "Expand sidebar" : "Compact sidebar"}"><span class="lbl">Compact</span><span>${compact ? "&raquo;" : "&laquo;"}</span></button>`
      + (compact ? "" : `<div class="side-lang"><span class="muted">Main language</span><div class="seg">${LANGS.map(([v, l]) => `<button data-dslang="${v}" class="${lang === v ? "on" : ""}">${l}</button>`).join("")}</div></div>`)
      + grp("1 · Programming principles", PRINCIPLES.map((l, i) => ["pr:" + l.id, `${i + 1}. ${l.name}`, prDone(l) ? "✓" : `${prQuiz(l).filter((q) => S.principles[q.id]).length}/${prQuiz(l).length}`, l.short]),
        `${PRINCIPLES.filter(prDone).length}/${PRINCIPLES.length}`)
      + langGroup(lang, `2 · ${langName(lang)} refresher`)
      + grp("3 · Complexity", [["bigo", "Big-O", Object.keys(S.bigo).length === BIGO_QUIZ.length || learnRead("bigo") ? "✓" : `${Object.keys(S.bigo).length}/${BIGO_QUIZ.length}`, "O(n)"]])
      + grp("4 · Data Structures Crash Course", [["ds:overview", "Start: overview & cheat sheet", tick("ds:overview"), "≡"], ...DS.map((d, i) => ["ds:" + d.id, `${i + 1}. ${d.name}`, tick("ds:" + d.id), d.short])], `${dsCourseDone()}/${DS_COURSE().length}`)
      + grp("5 · Algorithm patterns", Object.keys(NOTES).map((k) => ["pat:" + k, CATS[k], tick("pat:" + k)]))
      + LANGS.filter(([v]) => v !== lang).map(([v, l]) => langGroup(v, `Also: ${l}`)).join("")
      + grp("Courses", [["courses", "Full courses", "", "▶"]]);
    let body;
    if (sel.startsWith("pr:") && PRINCIPLES.some((l) => l.id === sel.slice(3))) body = refPrinciple(sel.slice(3));
    else if (sel.startsWith("py:") && LESSONS.some((l) => l.id === sel.slice(3))) body = refPython(sel.slice(3));
    else if (sel.startsWith("j:") && JAVA_LESSONS.some((l) => l.id === sel.slice(2))) body = refLang("java", sel.slice(2));
    else if (sel.startsWith("c:") && CS_LESSONS.some((l) => l.id === sel.slice(2))) body = refLang("cs", sel.slice(2));
    else if (sel === "bigo") body = refBigo();
    else if (sel === "ds:overview") body = refDSOverview();
    else if (sel.startsWith("ds:") && DS.some((d) => d.id === sel.slice(3))) body = refDS(sel.slice(3));
    else if (sel.startsWith("pat:") && NOTES[sel.slice(4)]) body = refPattern(sel.slice(4));
    else if (sel === "courses") body = refCourses();
    else { S.refSel = learnPath()[0][0]; return views.learn(); }
    const path = learnPath(), learned = path.filter((u) => u[2]).length, part = partOf(sel);
    const crumbs = `<div class="learn-steps">${PATH_PARTS.map(([k, l], i) => `<span class="${k === part && path.some((u) => u[0] === sel) ? "on" : ""}">${i + 1}. ${k === "lang" ? esc(langName(lang)) : l}</span>`).join('<span class="muted">&rsaquo;</span>')}
      <span class="muted" style="margin-left:auto">${learned} / ${path.length} topics done</span></div>`;
    return pageHead(`${stepNum(1)} Learn`, "Work down the sidebar in order: programming principles, your main language, Big-O, data structures, then the patterns. When a pattern clicks, practise its problems.") +
      `<div class="ref-layout ${compact ? "compact" : ""}"><aside class="ref-side">${side}</aside><section class="ref-main">${crumbs}${body}</section></div>`;
  },

  problems() {
    if (views._ws !== null && views._ws !== undefined) return workspace(views._ws);
    const f = views._f = views._f || { cat: "", diff: "", status: "", q: "", co: "" };
    const list = included().filter((p) =>
      (!f.cat || p.c === f.cat) && (!f.diff || p.d === f.diff) && (!f.co || (f.co === "faang" ? faangOf(p.s) : COMPANY_SETS[f.co].slugs.includes(p.s))) &&
      (!f.q || p.t.toLowerCase().includes(f.q.toLowerCase())) &&
      (!f.status || (f.status === "todo" ? !isDone(p.s) : f.status === "done" ? isDone(p.s) : isDone(p.s) && rec(p.s).next <= today())));
    const groups = Object.keys(CATS).map((k) => [k, list.filter((p) => p.c === k)]).filter(([, ps]) => ps.length);
    // One card per pattern, AlgoExpert-style: progress, plus a dot per problem (colour = difficulty, filled = solved).
    const catGrid = `<div class="cat-grid">${Object.keys(CATS).map((k) => {
      const all = included().filter((p) => p.c === k), n = all.filter((p) => isDone(p.s)).length;
      if (!all.length) return "";
      return `<button class="cat-card ${f.cat === k ? "on" : ""}" data-catpick="${k}" aria-pressed="${f.cat === k}" title="${f.cat === k ? "Show all patterns" : "Show only " + esc(CATS[k])}">
        <span class="cat-name">${esc(CATS[k])}</span>
        <span class="cat-dots">${all.map((p) => `<i class="${p.d}${isDone(p.s) ? " on" : ""}" title="${esc(p.t)}"></i>`).join("")}</span>
        <span class="cat-foot"><span class="muted">${n} / ${all.length}</span></span>
        <span class="bar"><i style="width:${(100 * n / all.length) | 0}%"></i></span></button>`;
    }).join("")}</div>`;
    return pageHead(`${stepNum(2)} Problems <span class="muted">${list.length}</span>`, "Grouped by pattern, in the same order as Learn. Pick a pattern to focus on, or open any problem to code it, log your attempt and check the solution.") + catGrid + `
    <div class="card toolbar">
      ${searchBox("f-q", f.q)}
      <select id="f-cat"><option value="">All patterns</option>${Object.entries(CATS).map(([k, v]) => `<option value="${k}" ${f.cat === k ? "selected" : ""}>${v}</option>`).join("")}</select>
      <select id="f-diff"><option value="">Any difficulty</option>${["E", "M", "H"].map((d) => `<option value="${d}" ${f.diff === d ? "selected" : ""}>${DIFF[d]}</option>`).join("")}</select>
      <select id="f-co">${[["", "All companies"], ["faang", "FAANG Top 250"], ...Object.entries(COMPANY_SETS).map(([k, c]) => [k, c.name])].map(([v, l]) => `<option value="${v}" ${f.co === v ? "selected" : ""}>${l}</option>`).join("")}</select>
      <select id="f-status">${[["", "Any status"], ["todo", "To do"], ["done", "Done"], ["due", "Review due"]].map(([v, l]) => `<option value="${v}" ${f.status === v ? "selected" : ""}>${l}</option>`).join("")}</select>
      <button class="btn ghost" data-scratch>Scratchpad</button></div>
    ${f.co && f.co !== "faang" && list.length ? `<div class="card"><div class="section-head"><h3>${esc(COMPANY_SETS[f.co].name)} <span class="muted">${list.length} here</span></h3></div>
        <p class="muted" style="margin-top:0">${esc(COMPANY_SETS[f.co].note)}</p>
        ${probTable(list.slice().sort((a, b) => COMPANY_SETS[f.co].slugs.indexOf(a.s) - COMPANY_SETS[f.co].slugs.indexOf(b.s)))}</div>`
    : f.co && list.length ? `<div class="card"><div class="section-head"><h3>FAANG Top 250 <span class="muted">${list.length} here</span></h3>
        <span class="muted">Ranked by how often Google, Amazon and Meta asked them in the last 6 months</span></div>
        <p class="muted" style="margin-top:0">From LeetCode's company tags (<a href="https://github.com/liquidslr/leetcode-company-wise-problems" target="_blank" rel="noopener">liquidslr/leetcode-company-wise-problems</a>, 16 Aug 2026). Hover a FAANG pill for each company's score. Every ranked problem is here except 16 SQL questions, one JavaScript-only question and three one-liners.</p>
        ${probTable(list.slice().sort((a, b) => faangOf(a.s)[0] - faangOf(b.s)[0]))}</div>`
    : groups.length ? groups.map(([k, ps]) => {
      const all = included().filter((p) => p.c === k), n = all.filter((p) => isDone(p.s)).length;
      return `<div class="card"><div class="section-head"><h3>${esc(CATS[k])}</h3>
        <div class="row"><span class="muted">${n} / ${all.length} solved</span><button class="btn small ghost" data-ref="pat:${k}" data-goto="learn">${learnRead("pat:" + k) ? "Review" : "Learn"} the pattern</button></div></div>
        ${probTable(ps)}</div>`;
    }).join("") : `<div class="card empty">No problems match these filters.</div>`}`;
  },

  roadmap() {
    const wk = currentWeek();
    return pageHead(`${stepNum(3)} Roadmap`, "Twelve weeks, one pattern family at a time, with each week's problems and solutions. The current week is highlighted; change the start date in Settings.") + WEEKS.map((w) => {
      const list = weekProblems(w), done = list.filter((p) => isDone(p.s)).length;
      return `<details class="card week ${w.n === wk ? "current" : ""}" ${w.n === wk ? "open" : ""}>
        <summary><span style="flex:1">Week ${w.n} · ${esc(w.title)}</span>${w.n === wk ? '<span class="badge accent">This week</span>' : ""}<span class="muted" style="font-variant-numeric:tabular-nums">${done}/${list.length}</span></summary>
        <div class="bar" style="margin:8px 0"><i style="width:${list.length ? (100 * done / list.length) | 0 : 0}%"></i></div>
        ${w.cats.length ? `<div class="row" style="margin-bottom:10px"><span class="muted">Learn first:</span>${w.cats.map((c) => `<button class="tag tag-btn" data-ref="pat:${c}" data-goto="learn">${learnRead("pat:" + c) ? "✓ " : ""}${esc(CATS[c])}</button>`).join("")}</div>` : ""}
        ${list.length ? probTable(list) : mockBlock()}</details>`;
    }).join("");
  },

  companies() {
    const tierName = (id) => TIERS.find((t) => t.id === +id).name;
    const TIER_DIFF = { 1: "mostly Easy and Medium", 2: "mostly Medium", 3: "Medium and Hard" };
    return pageHead("Companies", "Toronto &amp; Kitchener-Waterloo. Tiers are general guidance, not inside information: check recent postings and interview reports (Glassdoor, Levels.fyi, LeetCode Discuss) for each employer.") + `
    ${TIERS.map((t) => `<div class="card"><div class="row between"><h3 style="margin:0">${esc(t.name)}</h3><span class="pill">${esc(t.bar)} · ${TIER_DIFF[t.levels]}</span></div>
      <p>${esc(t.emphasis)}</p>
      <p><b>Prioritise:</b> ${t.focus.map((c) => `<button class="tag tag-btn" data-probcat="${c}">${esc(CATS[c])}</button>`).join("")}</p>
      <p><b>Examples:</b> ${t.names.map((n) => `<span class="tag">${esc(n)}</span>`).join("")}</p>
      ${t.levels === 3 ? `<button class="btn small" data-diffgo="H">Practise the Hard problems</button>` : ""}</div>`).join("")}
    <div class="card"><h3 style="margin-top:0">My application tracker</h3>
      <div class="row"><input id="c-name" placeholder="Company"><select id="c-tier">${TIERS.map((t) => `<option value="${t.id}">${esc(t.name)}</option>`).join("")}</select>
      <button class="btn primary" id="c-add">Add</button></div>
      ${S.companies.length ? `<table><tr><th>Company</th><th class="hide-sm">Tier</th><th>Status</th><th>Notes</th><th></th></tr>${S.companies.map((c, i) => `<tr>
        <td>${esc(c.name)}</td><td class="hide-sm muted">${esc(tierName(c.tier))}</td>
        <td><select data-cstatus="${i}">${STATUSES.map((s) => `<option ${s === c.status ? "selected" : ""}>${s}</option>`).join("")}</select></td>
        <td><input data-cnote="${i}" value="${esc(c.note)}" placeholder="Interview date, contact..."></td>
        <td class="actions"><button class="btn small" data-cdel="${i}">Remove</button></td></tr>`).join("")}</table>` : `<p class="muted">Add companies you're applying to.</p>`}</div>`;
  },

  settings() {
    const cur = S.theme || "system";
    const prev = (id) => `<div class="tp" data-theme="${id}"><div class="tp-card"><i class="l1"></i><i class="l2"></i><div class="row2"><i class="acc"></i><i class="ok"></i></div></div></div>`;
    const seg = (attr, val, opts) => `<div class="seg">${opts.map(([v, l]) => `<button ${attr}="${v}" class="${val === v ? "on" : ""}">${l}</button>`).join("")}</div>`;
    return pageHead("Settings", "Appearance, your plan, and backups. Everything is saved in this browser.") + `
      <div class="card">
        <div class="section-head"><h3>Theme</h3><span class="muted">Now showing: ${esc(THEMES.find((t) => t.id === resolvedTheme())?.name || "")}</span></div>
        <div class="theme-grid">${THEMES.map((t) => `<button class="theme-card ${cur === t.id ? "on" : ""}" data-theme-pick="${t.id}">
          <div class="theme-prev">${t.id === "system" ? prev("light") + prev("dark") : prev(t.id)}</div>
          <div class="theme-meta"><span>${esc(t.name)}</span>${cur === t.id ? '<span class="check">&#10003;</span>' : ""}</div>
          <div class="theme-desc">${esc(t.desc)}</div></button>`).join("")}</div>
        <div class="setting"><div><b>Accent color</b><div class="muted">Use the theme's own accent, or pick one.</div></div>
          <div class="swatches"><button class="swatch auto ${!S.accent ? "on" : ""}" data-accent="" title="Theme default"></button>
            ${ACCENTS.map((c) => `<button class="swatch ${S.accent === c ? "on" : ""}" data-accent="${c}" style="background:${c}" title="${c}"></button>`).join("")}</div></div>
        <div class="setting"><div><b>Text size</b><div class="muted">Scales the whole interface.</div></div>
          ${seg("data-fs", S.fontSize || "m", [["s", "Small"], ["m", "Default"], ["l", "Large"]])}</div>
        <div class="setting"><div><b>Density</b><div class="muted">Compact tightens spacing in cards and lists.</div></div>
          ${seg("data-dens", S.density || "comfortable", [["comfortable", "Comfortable"], ["compact", "Compact"]])}</div>
        <div class="setting"><div><b>Code colours</b><div class="muted">Syntax colours for code and the editors, in the style of Visual Studio. "Match theme" switches to the light version on light themes.</div></div>
          ${seg("data-codetheme", S.codeTheme || "dark", [["dark", "Visual Studio Dark"], ["match", "Match theme"]])}</div>
      </div>
      <div class="card"><h3>Your plan</h3>
        <div class="setting"><div><b>Main language</b><div class="muted">Step 1 starts with this language's refresher, and lessons, Big-O, problem starters and solutions are shown in it. Run tests checks Python code only.</div></div>
          ${seg("data-dslang", mainLang(), LANGS)}</div>
        <div class="setting"><div><b>Start date</b><div class="muted">Week 1 of the roadmap begins on this day. Today is week ${currentWeek()}.</div></div>
          <input type="date" id="s-start" value="${esc(S.start)}"></div>
      </div>
      <div class="card"><h3>Help</h3>
        <div class="setting"><div><b>Welcome note</b><div class="muted">The short "how DSA Prep works" note on Home.</div></div>
          <button class="btn" data-introshow>Show it again</button></div>
      </div>
      <div class="card"><h3>Backup</h3>
        <div class="setting"><div><b>Your data</b><div class="muted">Progress lives in this browser only. Export now and then so you don't lose it. An export from the combined Prep Hub app imports here too.</div></div>
          <div class="row"><button class="btn" id="s-export">Export</button>
            <label class="btn">Import<input type="file" id="s-import" accept="application/json"></label>
            <button class="btn danger" id="s-reset">Reset everything</button></div></div>
      </div>`;
  },
};

// ---------- learn: content for each sidebar item ----------
function refPython(id) {
  warmPython(); // the exercises below run Python
  const i = LESSONS.findIndex((l) => l.id === id), l = LESSONS[i];
  const done = l.exercises.filter((_, j) => S.ref[l.id + "-" + j]).length;
  return `<div class="label">Python</div><h2>${esc(l.title.replace(/^\d+\.\s*/, ""))}</h2>
    <p class="muted">${done} / ${l.exercises.length} exercises passed (${refDone()} / ${refTotal()} across all Python lessons). Your code runs against tests right here; Python loads on first run. Pass every exercise to complete the lesson.</p>
    <div class="card">${l.body}<pre>${esc(l.example)}</pre>
      <div class="row"><button class="btn small" data-example="${i}">Try this example in the scratchpad</button>
      <a class="btn small" href="${yt(LESSON_YT[l.id])}" target="_blank" rel="noopener">More videos</a></div>
      ${vids(EXPLAINERS.python[l.id])}</div>
    ${l.exercises.map((ex, j) => { const eid = l.id + "-" + j; return `<div class="card"><h3 class="ex-title">Exercise ${j + 1}${S.ref[eid] ? ' <span class="badge done">Passed</span>' : ""}</h3>
      <p>${esc(ex.prompt)}</p><textarea id="ex-${eid}" class="ex" rows="${Math.max(5, ex.starter.split("\n").length + 2)}" spellcheck="false">${esc(S.code["ex:" + eid] ?? ex.starter)}</textarea>
      <div class="row"><button class="btn primary small" data-ex="${i}:${j}">Run tests</button><button class="btn small" data-exreset="${i}:${j}">Reset</button></div>
      <pre id="res-${eid}" class="muted" style="display:none"></pre></div>`; }).join("")}
    ${learnNav("py:" + id)}`;
}

function refBigo() {
  const bq = views._bq = views._bq || {};
  const solved = BIGO_QUIZ.filter((q) => S.bigo[q.id]).length, lang = mainLang();
  return `<div class="label">Complexity</div><h2>Big-O</h2>
    <p class="muted">Read the sections, play with the growth calculator, then take the quiz. Finishing the quiz completes this step. <a href="${yt("big o notation explained for coding interviews " + langName(lang).toLowerCase())}" target="_blank" rel="noopener">More videos</a></p>
    <div class="card"><h3 style="margin-top:0">Watch first</h3>${vids(EXPLAINERS.bigo)}</div>` +
    BIGO_SECTIONS.map((s, i) => `<details class="card" ${i === 0 ? "open" : ""}><summary>${esc(forLang(s.title))}</summary>${forLang(s.html)}</details>`).join("") +
    `<div class="card"><h3 style="margin-top:0">Growth calculator</h3>
      <label>Input size n: <b id="g-n"></b> <input type="range" id="g-slider" min="0" max="6" step="1" value="${views._gi ?? 3}" style="width:240px"></label>
      <div id="g-table"></div>
      <p class="muted">Time assumes about 100 million simple operations per second. Notice how O(n²) is fine at n = 1,000 but hopeless at n = 1,000,000.</p></div>
    <div class="card"><h3 style="margin-top:0">Quiz: what's the complexity? <span class="muted">${solved} / ${BIGO_QUIZ.length} solved</span></h3>
      <p class="muted">Time complexity unless the question says space.</p></div>` +
    BIGO_QUIZ.map((q, i) => {
      const ch = bq[q.id], done = ch !== undefined;
      return `<div class="card"><h3 class="ex-title">Question ${i + 1} ${S.bigo[q.id] ? '<span class="badge done">Solved</span>' : ""}</h3><pre class="language-${lang}">${esc(forLang(q.q))}</pre>
        <div class="row">${BIGO_OPTIONS.map((o) => `<button class="btn small ${done && o === q.a ? "primary" : ""}" data-bq="${q.id}" data-opt="${esc(o)}" ${done ? "disabled" : ""}>${o}</button>`).join("")}</div>
        ${done ? `<p class="${ch === q.a ? "s-solved" : "M"}"><b>${ch === q.a ? "Correct." : "Not quite (you chose " + esc(ch) + "). Answer: " + q.a + "."}</b> ${esc(forLang(q.why))}</p><button class="btn small" data-bretry="${q.id}">Try again</button>` : ""}</div>`;
    }).join("") + `<div class="row" style="margin-bottom:var(--gap)">${reviewBtn("bigo")}</div>${learnNav("bigo")}`;
}

const langSeg = () => `<div class="seg">${LANGS.map(([v, l]) => `<button data-dslang="${v}" class="${mainLang() === v ? "on" : ""}">${l}</button>`).join("")}</div>`;

// Videos card for a data structure: concept videos plus the selected language's videos.
function dsVideos(key, name) {
  const v = DS_VIDEOS[key] || {}, lang = mainLang(), label = langName(lang);
  const search = yt(`${name} ${label === "C#" ? "C# csharp" : label} tutorial`);
  const langList = v[lang] || [];
  return `<div class="card"><div class="section-head"><h3>Videos</h3>${langSeg()}</div>
    ${v.any && v.any.length ? `<div class="label" style="margin-top:4px">Concept (any language)</div>${vids(v.any)}` : ""}
    <div class="label" style="margin-top:8px">In ${label}</div>
    ${langList.length ? vids(langList) : `<p class="muted">No verified ${label} video for this one yet. The concept videos above apply, and the search below finds ${label}-specific ones.</p>`}
    <a class="btn small" href="${search}" target="_blank" rel="noopener">More ${label} videos on YouTube &nearr;</a></div>`;
}

function refDSOverview() {
  return `<div class="label">Data Structures Crash Course · Start here</div><h2>Overview &amp; cheat sheet</h2>
    <p class="muted">The structures interviews lean on, with costs and the built-in type in Python, Java and C#. Then work through the ${DS.length} lessons in order: each covers when to use the structure, its operations and costs, code, pitfalls and a video. ${dsCourseDone()} / ${DS_COURSE().length} done.</p>
    <div class="card"><h3>Cost cheat sheet</h3><div class="table-wrap"><table>
      <tr><th>Structure</th><th>Access</th><th>Search</th><th>Insert</th><th>Delete</th></tr>
      ${DS_OVERVIEW.table.map((r) => `<tr><td><b style="font-weight:500">${esc(r[0])}</b></td>${r.slice(1).map((c) => `<td class="muted">${esc(c)}</td>`).join("")}</tr>`).join("")}
    </table></div><p class="muted">* amortized. "avg" = average case; hash structures degrade to O(n) with heavy collisions.</p></div>
    <div class="card"><h3>Which one should I reach for?</h3><div class="list">
      ${DS_OVERVIEW.choose.map(([need, ds]) => `<div class="li"><span>${esc(need)}</span><span class="badge accent">${esc(ds)}</span></div>`).join("")}</div></div>
    <div class="card"><h3>Built-in types by language</h3><div class="table-wrap"><table>
      <tr><th>Structure</th><th>Python</th><th>Java</th><th>C#</th></tr>
      ${DS.map((d) => `<tr><td><button class="btn small ghost" data-ref="ds:${d.id}">${esc(d.name)}</button></td><td><code>${esc(d.builtin.py)}</code></td><td><code>${esc(d.builtin.java)}</code></td><td><code>${esc(d.builtin.cs)}</code></td></tr>`).join("")}
    </table></div></div>
    ${dsVideos("overview", "data structures full course")}
    <div class="row" style="margin-bottom:var(--gap)">${reviewBtn("ds:overview")}</div>${learnNav("ds:overview")}`;
}

// Escaped text with `backticks` shown as inline code (the principles content uses them).
const md = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
// Lesson text (principles, data structures) can be shared or per language: a string shows for every
// language, { py, java, cs } shows the main language's version, and an item with no version for the
// main language is hidden, so a Java learner never sees Python-only tips and vice versa. An array (a
// table row) is shared too.
const forLang = (v, lang = mainLang()) => (v == null || typeof v === "string" || Array.isArray(v) ? v : v[lang]);
const langList = (list) => list.map((v) => forLang(v)).filter((v) => v != null);
const allLangText = (v) => (typeof v === "string" ? v : Object.values(v).join(" "));
// How to run the Java / C# fragments, in the main language's own terms.
const snippetNote = (lang) => (lang === "java"
  ? "Java snippets are fragments: put the statements inside a method (such as main), and keep the imports shown."
  : "C# snippets are fragments: they run as top-level statements in a console app (type declarations go at the end), or inside a method. Keep the usings shown.");
// A quiz question with `langs` only shows for those languages.
const prQuiz = (l, lang = mainLang()) => l.quiz.filter((q) => !q.langs || q.langs.includes(lang));
// A lesson's extra card: text, a table and/or code, each shared or per language. Hidden when its title
// has no version for the main language.
function prTopic(t, lang) {
  const title = forLang(t.title), head = forLang(t.head), code = forLang(t.code);
  if (title == null) return "";
  const rows = langList(t.rows || []), cells = (r, tag) => r.map((c) => `<${tag}>${md(forLang(c))}</${tag}>`).join("");
  return `<div class="card"><h3 style="margin-top:0">${md(title)}</h3>${t.text ? `<p>${md(forLang(t.text))}</p>` : ""}
    ${head ? `<div class="table-wrap"><table class="pr-table"><tr>${cells(head, "th")}</tr>${rows.map((r) => `<tr>${cells(r, "td")}</tr>`).join("")}</table></div>` : ""}
    ${t.after ? `<p>${md(forLang(t.after))}</p>` : ""}${code ? `<pre class="language-${lang}">${esc(code)}</pre>` : ""}</div>`;
}
// Good vs bad practice: the same job written two ways, with why one is better.
function prPractice(list, lang) {
  const items = (list || []).filter((x) => forLang(x.bad) != null);
  if (!items.length) return "";
  return `<div class="card"><h3 style="margin-top:0">Good practice vs bad practice</h3>
    ${items.map((x) => `<div class="pr-pair"><div class="pr-cols">
      <div><div class="pr-tag pr-bad">✗ Avoid</div><pre class="language-${lang}">${esc(forLang(x.bad))}</pre></div>
      <div><div class="pr-tag pr-good">✓ Prefer</div><pre class="language-${lang}">${esc(forLang(x.good))}</pre></div></div>
      <p>${md(forLang(x.why))}</p></div>`).join("")}</div>`;
}

// Programming principles lesson: the idea, code in your main language, pitfalls, then a quiz.
function refPrinciple(id) {
  const l = PRINCIPLES.find((x) => x.id === id), n = PRINCIPLES.indexOf(l) + 1, lang = mainLang();
  const pq = views._pq = views._pq || {}, qs = prQuiz(l), solved = qs.filter((q) => S.principles[q.id]).length;
  const quiz = qs.map((q, i) => {
    const ch = pq[q.id], answered = ch !== undefined;
    return `<div class="card"><h3 class="ex-title">Question ${i + 1} ${S.principles[q.id] ? '<span class="badge done">Solved</span>' : ""}</h3><p>${md(forLang(q.q))}</p>
      <div class="pq-opts">${q.options.map((o, j) => `<button class="btn small ${answered && j === q.a ? "primary" : ""} ${answered && j === ch && j !== q.a ? "pq-wrong" : ""}" data-pq="${q.id}" data-popt="${j}" ${answered ? "disabled" : ""}>${md(forLang(o))}</button>`).join("")}</div>
      ${answered ? `<p class="${ch === q.a ? "s-solved" : "M"}"><b>${ch === q.a ? "Correct." : "Not quite."}</b> ${md(forLang(q.why))}</p><button class="btn small" data-pretry="${q.id}">Try again</button>` : ""}</div>`;
  }).join("");
  return `<div class="label">Programming principles · ${esc(l.part)} · Lesson ${n} of ${PRINCIPLES.length}</div><h2>${esc(l.name)}</h2>
    <div class="card"><p>${md(forLang(l.what))}</p>
      <h3>Key ideas</h3><ul>${langList(l.points).map((p) => `<li>${md(p)}</li>`).join("")}</ul></div>
    ${(l.topics || []).map((t) => prTopic(t, lang)).join("")}
    <div class="card"><div class="section-head"><h3>Code</h3>${langSeg()}</div>
      <pre class="language-${lang}">${esc(l.code[lang])}</pre>
      <div class="row">${lang === "py" ? `<button class="btn small primary" data-prrun="${l.id}">Run in the scratchpad</button>` : `<span class="muted">${snippetNote(lang)}</span>`}
        <button class="btn small" data-prcopy="${l.id}">Copy</button></div></div>
    <div class="cols-2">
      <div class="card"><h3>Watch out for</h3><ul>${langList(l.pitfalls).map((p) => `<li>${md(p)}</li>`).join("")}</ul></div>
      <div class="card"><h3>In interviews</h3><p>${md(forLang(l.interview))}</p>
        <a class="btn small" href="${yt(l.yt)}" target="_blank" rel="noopener">Videos on YouTube &nearr;</a></div>
    </div>
    ${prPractice(l.practice, lang)}
    <div class="card"><h3 style="margin:0">Quick check <span class="muted">${solved} / ${qs.length} solved</span></h3>
      <p class="muted" style="margin-bottom:0">Get every question right, or mark the lesson as reviewed, to complete it.</p></div>
    ${quiz}
    <div class="row" style="margin-bottom:var(--gap)">${reviewBtn("pr:" + id)}</div>${learnNav("pr:" + id)}`;
}

function refDS(id) {
  const d = DS.find((x) => x.id === id), lang = mainLang(), n = DS.indexOf(d) + 1;
  return `<div class="label">Data Structures Crash Course · Lesson ${n} of ${DS.length}</div><h2>${esc(d.name)}</h2>
    <div class="card"><p>${esc(forLang(d.what))}</p>
      <h3>Use it when</h3><ul>${langList(d.when).map((w) => `<li>${esc(w)}</li>`).join("")}</ul></div>
    <div class="cols-2">
      <div class="card"><h3>Operations</h3><table>${d.ops.map(([op, c]) => `<tr><td>${esc(op)}</td><td style="text-align:right"><code>${esc(c)}</code></td></tr>`).join("")}</table></div>
      <div class="card"><h3>Built-in</h3><div class="list">
        ${LANGS.map(([k, l]) => `<div class="li"><span class="t">${l}</span><code>${esc(d.builtin[k])}</code></div>`).join("")}</div>
        <h3>Watch out for</h3><ul>${langList(d.pitfalls).map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>
    </div>
    <div class="card"><div class="section-head"><h3>Code</h3>${langSeg()}</div>
      <pre class="language-${lang}">${esc(d.code[lang])}</pre>
      <div class="row">${lang === "py" ? `<button class="btn small primary" data-dsrun="${d.id}">Run in the scratchpad</button>` : `<span class="muted">${snippetNote(lang)}</span>`}
        <button class="btn small" data-dscopy="${d.id}">Copy</button></div></div>
    ${dsVideos(d.id, d.name.replace(/\s*\(.*\)$/, "") + " data structure")}
    <div class="row" style="margin-bottom:var(--gap)">${reviewBtn("ds:" + id)}</div>${learnNav("ds:" + id)}`;
}

function refPattern(k) {
  const n = NOTES[k], probs = included().filter((p) => p.c === k), solved = probs.filter((p) => isDone(p.s)).length;
  return `<div class="label">Algorithm pattern</div><h2>${esc(CATS[k])}</h2>
    <div class="card"><p><b>Spot it:</b> ${esc(n.spot)}</p><p><b>Approach:</b> ${esc(n.how)}</p><p><b>Complexity:</b> ${esc(n.big)}</p>
      <pre>${esc(n.code)}</pre>
      <div class="row"><a class="btn small" href="${yt("neetcode " + CATS[k] + " explained")}" target="_blank" rel="noopener">More videos</a></div>
      ${vids(EXPLAINERS.cats[k])}</div>
    <div class="card practise-cta"><div class="row between"><div><b>Practise this pattern</b><div class="muted">${probs.length} problem${probs.length === 1 ? "" : "s"} · ${solved} solved</div></div>
      <button class="btn primary" data-probcat="${k}">Practise ${esc(CATS[k])} &rarr;</button></div></div>
    <div class="row" style="margin-bottom:var(--gap)">${reviewBtn("pat:" + k)}</div>${learnNav("pat:" + k)}`;
}

function refCourses() {
  return `<div class="label">Extra</div><h2>Full courses</h2><p class="muted">Long-form videos you can watch in chunks alongside the plan.</p>
    <div class="card">${vids(EXPLAINERS.general)}${vids(EXPLAINERS.cats.arrays.slice(1))}${vids(EXPLAINERS.cats.graphs.slice(0, 1))}${vids(EXPLAINERS.cats.dp1)}</div>`;
}

function mockBlock() {
  return `<div class="card"><b>Mock interview time.</b> Run 3-4 timed mocks this week: the Interview section deals coding problems from your due reviews plus a behavioural round, and tracks your scores. A friend or a site like Pramp adds a real listener.
    <div class="row" style="margin-top:10px"><button class="btn small primary" data-nav-go="interview:mock">Start a mock interview &rarr;</button></div></div>`;
}

// ---------- Python lesson exercises ----------
async function runExercise(i, j) {
  const l = LESSONS[i], ex = l.exercises[j], id = l.id + "-" + j;
  const code = $("#ex-" + id).value, res = $("#res-" + id);
  S.code["ex:" + id] = code; save();
  res.style.display = "block"; res.textContent = "Running...";
  const { out, err } = await runFresh(code + "\n\n" + ex.tests);
  if (err) res.textContent = "Not yet:\n" + err + (out ? "\n\nOutput:\n" + out : "");
  else { if (!S.ref[id]) bump(); S.ref[id] = true; save(); res.textContent = "All tests passed!" + (out ? "\n\nOutput:\n" + out : ""); }
  res.className = err ? "muted" : "s-solved";
  if (!err) { setTimeout(() => { const keep = res.textContent; rerender(); const r = $("#res-" + id); r.style.display = "block"; r.textContent = keep; r.className = "s-solved"; }, 0); }
}
// ---------- Java / C# refreshers (self-checked exercises) ----------
const LANG_META = {
  java: { name: "Java", lessons: () => JAVA_LESSONS, prefix: "j:", compiler: "https://www.jdoodle.com/online-java-compiler", compilerName: "JDoodle" },
  cs: { name: "C#", lessons: () => CS_LESSONS, prefix: "c:", compiler: "https://dotnetfiddle.net/", compilerName: ".NET Fiddle" },
};
const langKey = (lang, lid, j) => `${lang}:${lid}-${j}`;
const langLessonDone = (lang, l) => l.exercises.filter((_, j) => S.langDone?.[langKey(lang, l.id, j)]).length;
const langTotals = (lang) => {
  const ls = LANG_META[lang].lessons();
  return { done: ls.reduce((n, l) => n + langLessonDone(lang, l), 0), total: ls.reduce((n, l) => n + l.exercises.length, 0) };
};

function refLang(lang, id) {
  const m = LANG_META[lang], ls = m.lessons(), l = ls.find((x) => x.id === id);
  const shown = views._lsol = views._lsol || {}, tot = langTotals(lang);
  return `<div class="label">${m.name}</div><h2>${esc(l.title.replace(/^\d+\.\s*/, ""))}</h2>
    <p class="muted">${langLessonDone(lang, l)} / ${l.exercises.length} exercises done here (${tot.done} / ${tot.total} across ${m.name}). ${m.name} can't run inside this page: write your answer, check it against the cases, then compare with the reference solution or run it in <a href="${m.compiler}" target="_blank" rel="noopener">${m.compilerName}</a>. Mark every exercise done to complete the lesson.</p>
    <div class="card" data-code-lang="${lang}">${l.body}<pre>${esc(l.example)}</pre>
      <div class="row"><button class="btn small" data-lcopy="${lang}|${l.id}">Copy example</button>
      <a class="btn small" href="${m.compiler}" target="_blank" rel="noopener">Open ${m.compilerName} &nearr;</a>
      <a class="btn small" href="${yt(`${m.name === "C#" ? "C# csharp" : "Java"} ${l.title.replace(/^\d+\.\s*/, "")} tutorial`)}" target="_blank" rel="noopener">More videos</a></div>
      ${vids(LANG_VIDEOS[lang][l.id])}</div>
    ${l.exercises.map((ex, j) => {
      const k = langKey(lang, l.id, j), done = !!S.langDone?.[k];
      return `<div class="card"><div class="section-head"><h3 class="ex-title">Exercise ${j + 1}</h3>${done ? '<span class="badge done">Done</span>' : ""}</div>
        <p>${esc(ex.prompt)}</p>
        <textarea class="lx" data-lx="${k}" rows="${Math.max(6, ex.starter.split("\n").length + 3)}" spellcheck="false">${esc(S.code["lx:" + k] ?? ex.starter)}</textarea>
        <div class="label" style="margin-top:10px">Check your answer against</div>
        <ul>${ex.checks.map((c) => `<li><code>${esc(c)}</code></li>`).join("")}</ul>
        <div class="row"><button class="btn small" data-lsol="${k}">${shown[k] ? "Hide solution" : "Show solution"}</button>
          <button class="btn small ${done ? "" : "primary"}" data-ldone="${k}">${done ? "Mark not done" : "Mark done"}</button>
          <button class="btn small ghost" data-lreset="${k}">Reset</button></div>
        ${shown[k] ? `<pre class="language-${lang}">${esc(ex.solution)}</pre>` : ""}</div>`;
    }).join("")}
    ${learnNav(m.prefix + id)}`;
}

const refTotal = () => LESSONS.reduce((n, l) => n + l.exercises.length, 0);
const refDone = () => Object.keys(S.ref).filter((k) => S.ref[k]).length;

// ---------- wiring ----------
const NS = [10, 100, 1e3, 1e4, 1e5, 1e6, 1e7];
function growth() {
  const n = NS[views._gi ?? 3];
  const fact = (k) => { let r = 1; for (let i = 2; i <= k; i++) r *= i; return r; };
  const time = (ops) => {
    const s = ops / 1e8;
    if (s < 1e-3) return "instant"; if (s < 1) return (s * 1000).toFixed(0) + " ms"; if (s < 60) return s.toFixed(1) + " s";
    if (s < 3600) return (s / 60).toFixed(0) + " min"; if (s < 86400) return (s / 3600).toFixed(0) + " hours";
    if (s < 3.15e7 * 100) return (s / 3.15e7).toFixed(1) + " years"; return "longer than the universe has existed";
  };
  const big = (x) => (x === Infinity ? "astronomical" : x < 1e6 ? Math.round(x).toLocaleString() : x.toExponential(1));
  const rows = [["O(1)", 1], ["O(log n)", Math.log2(n)], ["O(n)", n], ["O(n log n)", n * Math.log2(n)], ["O(n²)", n * n],
    ["O(2ⁿ)", n > 1000 ? Infinity : 2 ** n], ["O(n!)", n > 170 ? Infinity : fact(n)]];
  $("#g-n").textContent = n.toLocaleString();
  $("#g-table").innerHTML = `<table><tr><th>Complexity</th><th>Operations</th><th>Time</th></tr>${rows.map(([c, o]) =>
    `<tr><td>${c}</td><td>${big(o)}</td><td>${o === Infinity || o > 1e300 ? "never" : time(o)}</td></tr>`).join("")}</table>`;
}

let tab = "home";
views._ws = null;
function render() {
  const sec = sectionOf(tab);
  if (sec === "interview") $("#view").innerHTML = interviewView(tab.split(":")[1]);
  else $("#view").innerHTML = (views[tab] || views.home)();
  $("#view").classList.toggle("wide", tab === "problems" && !!views._ws);
  renderNav();
  highlightCode();
  if (tab === "learn" && S.refSel === "bigo") growth();
  if ($("#timer")) {
    $("#timer").textContent = fmt(timerSec);
    $("#t-go").textContent = timerId ? "Pause" : "Start timer";
  }
  syncUrl();
}
$("#nav").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.nav === "problems") views._ws = null; // the nav button always shows the list
  if (b.dataset.track) { const k = b.dataset.track; go(S.lastTab?.[k] || defaultTab(k)); }
  else if (b.dataset.nav) go(b.dataset.nav);
});
$("#subnav").addEventListener("click", (e) => { const b = e.target.closest("button[data-tab]"); if (b) go(b.dataset.tab); });

document.addEventListener("click", (e) => {
  const t = e.target;
  if (t.dataset.log) return logDialog(t.dataset.log);
  if (t.closest("[data-introok]")) { S.introSeen = true; save(); return rerender(); }
  if (t.closest("[data-introshow]")) { S.introSeen = false; save(); return go("home"); }
  const lr = t.closest("[data-learnread]");
  if (lr) {
    const k = lr.dataset.learnread; S.learnRead = S.learnRead || {};
    if (S.learnRead[k]) delete S.learnRead[k]; else { S.learnRead[k] = true; bump(); }
    save(); return rerender();
  }
  // appearance
  const tp = t.closest("[data-theme-pick]");
  if (tp) { S.theme = tp.dataset.themePick; save(); applyTheme(); return render(); }
  const ac = t.closest("[data-accent]");
  if (ac) { S.accent = ac.dataset.accent || null; save(); applyTheme(); return render(); }
  if (t.dataset.fs) { S.fontSize = t.dataset.fs; save(); applyTheme(); return render(); }
  if (t.dataset.dens) { S.density = t.dataset.dens; save(); applyTheme(); return render(); }
  if (t.dataset.codetheme) { S.codeTheme = t.dataset.codetheme; save(); applyTheme(); return render(); }
  if (t.closest("#theme-quick")) { S.theme = LIGHT_THEMES.has(resolvedTheme()) ? "dark" : "light"; save(); applyTheme(); return render(); }
  if (t.closest("#brand")) return go("home");
  if (t.dataset.gotoTab) { if (t.dataset.gotoTab === "problems") views._ws = null; return go(t.dataset.gotoTab); }
  if (t.dataset.due) { views._ws = null; views._f = { cat: "", diff: "", status: "due", q: "" }; return go("problems"); }
  if (t.dataset.lsol) { views._lsol = views._lsol || {}; views._lsol[t.dataset.lsol] = !views._lsol[t.dataset.lsol]; return rerender(); }
  if (t.dataset.ldone) { S.langDone = S.langDone || {}; S.langDone[t.dataset.ldone] = !S.langDone[t.dataset.ldone]; if (S.langDone[t.dataset.ldone]) bump(); save(); return rerender(); }
  if (t.dataset.lreset) { delete S.code["lx:" + t.dataset.lreset]; save(); return rerender(); }
  if (t.dataset.lcopy) {
    const [lang, lid] = t.dataset.lcopy.split("|"), l = LANG_META[lang].lessons().find((x) => x.id === lid);
    return navigator.clipboard?.writeText(l.example).then(() => { t.textContent = "Copied!"; }, () => {});
  }
  if (t.dataset.dslang) {
    // Switching the main language keeps you on the same lesson number in the new language.
    const was = mainLang(); S.dsLang = t.dataset.dslang; save();
    if (tab === "learn" && was !== S.dsLang) {
      const from = langUnits(was).findIndex((u) => u[0] === S.refSel), to = langUnits(S.dsLang);
      if (from >= 0) S.refSel = (to[from] || to[0])[0];
    }
    return rerender();
  }
  if (t.dataset.dsrun) { S.code[""] = DS.find((d) => d.id === t.dataset.dsrun).code.py; save(); return openWorkspace(""); }
  if (t.dataset.dscopy) {
    const d = DS.find((x) => x.id === t.dataset.dscopy);
    return navigator.clipboard?.writeText(d.code[mainLang()]).then(() => { t.textContent = "Copied!"; }, () => {});
  }
  if (t.closest("#ref-compact")) { S.refCompact = !S.refCompact; save(); return render(); }
  const gb = t.closest("[data-grp]");
  if (gb) { S.refShut = S.refShut || {}; S.refShut[gb.dataset.grp] = !S.refShut[gb.dataset.grp]; save(); return render(); }
  const rb = t.closest("[data-ref]");
  if (rb) {
    S.refSel = rb.dataset.ref; save();
    if (tab !== "learn" || rb.dataset.goto) return go("learn");
    render(); return window.scrollTo(0, 0);
  }
  const cp = t.closest("[data-catpick]");
  if (cp) { views._f.cat = views._f.cat === cp.dataset.catpick ? "" : cp.dataset.catpick; return rerender(); }
  const pc = t.closest("[data-probcat]");
  if (pc) { views._ws = null; views._f = { cat: pc.dataset.probcat, diff: "", status: "", q: "" }; return go("problems"); }
  const vc = t.closest(".vcard");
  if (vc) {
    vc.outerHTML = `<div class="vcard playing"><div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${vc.dataset.vid}?autoplay=1" title="Video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div></div>`;
    return;
  }
  if (t.dataset.bq) {
    const q = BIGO_QUIZ.find((x) => x.id === t.dataset.bq);
    views._bq[q.id] = t.dataset.opt;
    if (t.dataset.opt === q.a) { if (!S.bigo[q.id]) bump(); S.bigo[q.id] = true; save(); }
    return rerender();
  }
  if (t.dataset.bretry) { delete views._bq[t.dataset.bretry]; return rerender(); }
  // programming principles: quiz answers, Try again, Run and Copy
  const pqb = t.closest("[data-pq]");
  if (pqb) {
    const id = pqb.dataset.pq, q = PRINCIPLES.flatMap((l) => l.quiz).find((x) => x.id === id), pick = +pqb.dataset.popt;
    views._pq[id] = pick;
    if (pick === q.a && !S.principles[id]) { S.principles[id] = true; bump(); save(); }
    return rerender();
  }
  if (t.dataset.pretry) { delete views._pq[t.dataset.pretry]; return rerender(); }
  if (t.dataset.prrun) { S.code[""] = PRINCIPLES.find((l) => l.id === t.dataset.prrun).code.py; save(); return openWorkspace(""); }
  if (t.dataset.prcopy) {
    const l = PRINCIPLES.find((x) => x.id === t.dataset.prcopy);
    return navigator.clipboard?.writeText(l.code[mainLang()]).then(() => { t.textContent = "Copied!"; }, () => {});
  }
  if (t.dataset.goto) return go(t.dataset.goto);
  if (t.dataset.example) { S.code[""] = LESSONS[+t.dataset.example].example; save(); return openWorkspace(""); }
  if (t.dataset.ex) { const [i, j] = t.dataset.ex.split(":").map(Number); return runExercise(i, j); }
  if (t.dataset.exreset) {
    const [i, j] = t.dataset.exreset.split(":").map(Number), id = LESSONS[i].id + "-" + j;
    delete S.code["ex:" + id]; save(); return rerender();
  }
  if (t.dataset.diffgo) { views._ws = null; views._f = { cat: "", diff: t.dataset.diffgo, status: "", q: "", co: "" }; return go("problems"); }
  if (t.dataset.cdel) { S.companies.splice(+t.dataset.cdel, 1); save(); return render(); }
  switch (t.id) {
    case "c-add": {
      const name = $("#c-name").value.trim(); if (!name) return;
      S.companies.push({ name, tier: +$("#c-tier").value, status: "Researching", note: "" }); save(); return render();
    }
    case "s-export": {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: "application/json" }));
      a.download = `dsa-progress-${today()}.json`; a.click(); return;
    }
    case "s-reset": if (confirm("Delete all progress? This cannot be undone.")) { S = blankState(); save(); render(); } return;
  }
});

document.addEventListener("change", (e) => {
  const t = e.target;
  if (t.id === "f-cat" || t.id === "f-diff" || t.id === "f-status" || t.id === "f-co") { views._f[t.id.slice(2)] = t.value; render(); }
  else if (t.id === "s-start") { S.start = t.value || today(); save(); }
  else if (t.dataset.cstatus) { S.companies[+t.dataset.cstatus].status = t.value; save(); }
  else if (t.dataset.cnote) { S.companies[+t.dataset.cnote].note = t.value; save(); }
  else if (t.id === "s-import" && t.files[0]) {
    t.files[0].text().then((txt) => {
      try { const d = JSON.parse(txt); if (!isObj(d) || !isObj(d.solved)) throw 0; S = cleanState(d); searchIndex = null; save(); applyTheme(); render(); }
      catch (err) { alert("That file isn't a valid progress export."); }
    });
  }
});
document.addEventListener("input", (e) => {
  const t = e.target;
  if (t.dataset && t.dataset.lx) { S.code["lx:" + t.dataset.lx] = t.value; saveSoon(); return; }
  if (t.id === "g-slider") { views._gi = +t.value; growth(); }
  if (t.id === "f-q") {
    views._f.q = t.value; const pos = t.selectionStart; render();
    const el = $("#f-q"); el.focus(); el.setSelectionRange(pos, pos);
  }
});

applyTheme();
if (location.hash.length > 2) applyPath(location.hash);
render();
// Offline support and fast repeat visits (sw.js); service workers need http, so not as a file.
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
