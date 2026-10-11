"use strict";
// The problem workspace (#/problems/<slug>), laid out like a coding interview platform: the prompt,
// hints, solution and video in tabs on the left; the editor, Run tests and results on the right.
// The scratchpad (#/problems/scratchpad) is the right-hand side alone.
// Loaded before app.js; it only uses app.js / checker.js globals (S, views, PROBLEMS...) at call time.
// State: S.wsTab[slug] (the open left tab), S.hints[slug] (hints shown), views._rev[slug] (solution revealed).

const WS_TABS = [["prompt", "Prompt"], ["hints", "Hints"], ["solution", "Solution"], ["video", "Video"]];
const hintsFor = (p) => [`The pattern here is <b>${esc(CATS[p.c])}</b>. If it isn't fresh, review it before going further.`, ...((typeof HINTS !== "undefined" && HINTS[p.s]) || []).map(esc)];
const hintsShown = (slug) => (S.hints || {})[slug] || 0;
const isRevealed = (slug) => !!(views._rev || {})[slug];

// ---------- content loaded on demand ----------
// Solutions, tests and prompts (about 325 KB) are only needed by the workspace, the interview's
// coding rounds and search, so they load the first time one of those needs them, not on every page.
// Nothing may touch SOL, TESTS, PROMPT or HINTS until contentReady is true.
const CONTENT_FILES = ["data/solutions/solutions1.js", "data/solutions/solutions2.js", "data/solutions/solutions3.js",
  "data/solutions/solutions4.js", "data/prompts.js", "data/tests.js"];
let contentReady = false, contentLoading = null;
function loadContent() {
  if (!contentLoading) {
    contentLoading = Promise.all(CONTENT_FILES.map((src) => new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = src; s.async = false; // download in parallel, run in order
      s.onload = res; s.onerror = () => rej(new Error("Couldn't load " + src));
      document.head.appendChild(s);
    }))).then(() => { contentReady = true; }, (e) => { contentLoading = null; throw e; });
  }
  return contentLoading;
}
// Renders `html` now; once the content has loaded, re-renders if `stillHere()` says the page is still open.
function whenContent(stillHere, html) {
  loadContent().then(() => { if (stillHere()) rerender(); }, () => { if (stillHere()) { const v = $("#view .content-wait"); if (v) v.textContent = "Couldn't load the problem files. Check your connection and refresh."; } });
  return html;
}
const contentWait = () => `<div class="card empty content-wait"><span class="spinner" aria-hidden="true"></span> Loading…</div>`;

// ---------- timer + python ----------
let timerId = null, timerSec = 0, pyodide = null;
function fmt(s) { return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); }
async function ensurePy() {
  if (pyodide) return pyodide;
  if (!window.loadPyodide) await new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
    s.integrity = "sha384-i3R37b3tF+HWudsUf1VSEOY2YxwSNMqY8DQa9Z0O3xh+NkJ9o+yjcGyIi5huj+nB"; s.crossOrigin = "anonymous";
    s.onload = res; s.onerror = () => rej(new Error("Could not load Pyodide (offline?)"));
    document.head.appendChild(s);
  });
  return (pyodide = await loadPyodide());
}
// Runs code (optionally in a fresh namespace); resolves { out, err } and never throws.
async function execPy(code, fresh) {
  let out = "", err = "";
  try {
    const py = await ensurePy();
    py.setStdout({ batched: (t) => (out += t + "\n") });
    py.setStderr({ batched: (t) => (out += t + "\n") });
    try { await py.runPythonAsync(code, fresh ? { globals: py.globals.get("dict")() } : undefined); }
    catch (e) { err = String(e.message || e).trim().split("\n").filter(Boolean).slice(-1)[0]; }
  } catch (e) { err = e.message; }
  return { out, err };
}

// Opens a problem's workspace (or the scratchpad with ""), optionally on the Solution tab, revealed.
function openWorkspace(slug, reveal) {
  views._ws = slug;
  if (reveal) { (views._rev = views._rev || {})[slug] = true; (S.wsTab = S.wsTab || {})[slug] = "solution"; save(); }
  go("problems");
}

// ---------- the page ----------
function workspace(slug) {
  if (!contentReady) return whenContent(() => tab === "problems" && views._ws === slug, contentWait());
  warmPython();
  const p = probBySlug(slug);
  const code = S.code[slug] ?? (p ? starterFor(p) : "# Scratchpad: try anything here. Use print() to see output.\n\n");
  const editor = `<div class="card ws-editor"><div class="row between" style="margin-bottom:10px"><h3 style="margin:0">Your code <span class="muted" style="font-weight:400">Python</span></h3>
      ${p ? "" : timerHtml()}</div>
    <textarea id="code" spellcheck="false">${esc(code)}</textarea>
    <div class="row" style="margin-top:8px">${p && TESTS[p.s] ? `<button class="btn primary" data-runtests>Run tests</button><button class="btn" data-runcode title="Run your code and show what it prints">Run</button>` : `<button class="btn primary" data-runcode>Run</button>`}
      ${p ? `<button class="btn ghost" data-starter title="Replace your code with the empty starter">Reset code</button>` : ""}
      <span class="muted" id="py-status">${p ? "Run tests checks your answer; Run shows what it prints." : "Run shows what your code prints."} Saves as you type.</span></div>
    <pre id="out"></pre></div>
    ${p && TESTS[p.s] ? `<div class="card" id="ws-tests">${testsHtml(p.s)}</div>` : ""}`;
  if (!p) return `<div class="card ws-head"><div class="row between"><button class="btn small ghost" data-wsback>&larr; All problems</button></div>
      <h2 style="margin:12px 0 4px">Scratchpad</h2><p class="muted" style="margin:0">A Python editor for trying examples from Learn or your own experiments. Open a problem from the list to work on it.</p></div>` + editor;

  const r = rec(p.s), sibs = included().filter((x) => x.c === p.c), i = sibs.indexOf(p);
  const cur = (S.wsTab || {})[p.s] || "prompt";
  const head = `<div class="card ws-head">
    <div class="ws-head-top"><button class="btn small ghost" data-wsback>&larr; All problems</button>
      <div class="row">${sibs[i - 1] ? `<button class="btn small" data-open="${sibs[i - 1].s}" title="${esc(sibs[i - 1].t)}">&larr; Prev</button>` : ""}
        ${i >= 0 ? `<span class="muted">${i + 1} of ${sibs.length} in ${esc(CATS[p.c])}</span>` : ""}
        ${sibs[i + 1] ? `<button class="btn small" data-open="${sibs[i + 1].s}" title="${esc(sibs[i + 1].t)}">Next &rarr;</button>` : ""}</div></div>
    <div class="ws-head-main"><div><div class="label">${esc(CATS[p.c])}</div>
      <h2>${esc(p.t)} ${diffBadge(p.d)} ${coPills(p)} ${statusCell(p)}</h2></div>
      <div class="row">${timerHtml()}<button class="btn primary" data-log="${p.s}">${r ? "Log another attempt" : "Log attempt"}</button></div></div></div>`;
  const tabs = `<div class="ws-tabs" role="tablist">${WS_TABS.map(([k, l]) => `<button role="tab" aria-selected="${k === cur}" class="${k === cur ? "on" : ""}" data-wstab="${k}">${l}${k === "hints" && hintsShown(p.s) ? ` <span class="muted">${hintsShown(p.s)}/${hintsFor(p).length}</span>` : ""}${(k === "solution" || k === "video") && !isRevealed(p.s) ? ' <span class="lock" aria-label="locked">&#128274;</span>' : ""}</button>`).join("")}</div>`;
  const pane = { prompt: panePrompt, hints: paneHints, solution: paneSolution, video: paneVideo }[cur] || panePrompt;
  return head + `<div class="ws-split"><section class="card ws-left">${tabs}<div class="ws-pane">${pane(p)}</div></section>
    <section class="ws-right">${editor}</section></div>`;
}
const timerHtml = () => `<span class="row ws-timer"><span id="timer" class="timer">00:00</span><button class="btn small" id="t-go">Start timer</button><button class="btn small ghost" id="t-reset">Reset</button></span>`;

function panePrompt(p) {
  const pr = typeof PROMPT !== "undefined" && PROMPT[p.s], spec = TESTS[p.s];
  const ex = pr && spec && !spec.design ? `<div class="label">Example</div><pre class="plain ws-ex">Input:  ${esc(spec.args[0])}${pr.ex ? `\nOutput: ${esc(pr.ex)}` : ""}</pre>` : "";
  // Problems written for this app carry their full statement (trusted HTML from prompts.js) and have no LeetCode page.
  if (isCustom(p.s)) return `<div class="callout" style="margin-bottom:14px">Written for this app from interview reports (unverified). Treat it like a real round: read it once, plan out loud, then code.</div>
    <div class="ws-full">${pr.full}</div>${ex}
    <div class="row"><button class="btn ghost" data-ref="pat:${p.c}" data-goto="learn">Review the pattern</button></div>${promptFooter(p)}`;
  return `${pr ? `<p class="ws-prompt">${esc(pr.s)}</p>${ex}
      <p class="muted">This is a short summary. The full statement, constraints and more examples are on LeetCode.</p>`
    : `<p class="muted">Read the full statement, constraints and examples on LeetCode, then code your answer on the right.</p>`}
    <div class="row"><a class="btn" href="https://leetcode.com/problems/${p.s}/" target="_blank" rel="noopener">Full problem on LeetCode &nearr;</a>
      <button class="btn ghost" data-ref="pat:${p.c}" data-goto="learn">Review the pattern</button></div>${promptFooter(p)}`;
}
// Your notes and attempts, plus the interview routine, under every prompt.
function promptFooter(p) {
  const r = rec(p.s);
  return `
    ${r ? `<div class="callout" style="margin-top:14px">${r.notes ? `<b>Your notes:</b> ${esc(r.notes)}<br>` : ""}<span class="muted">${r.attempts.length} attempt${r.attempts.length === 1 ? "" : "s"} · next review ${esc(r.next)}</span></div>` : ""}
    <details class="ws-routine"><summary>Interview routine</summary><ol>${MOCK_TIPS.map((t) => `<li>${esc(t)}</li>`).join("")}</ol></details>`;
}

function paneHints(p) {
  const all = hintsFor(p), n = Math.min(hintsShown(p.s), all.length);
  return `<p class="muted" style="margin-top:0">Stuck? Open one hint at a time and give each a few minutes before the next.</p>
    <ol class="hints">${all.slice(0, n).map((h, j) => `<li><div class="label">Hint ${j + 1}</div>${h}${j === 0 ? ` <button class="link-btn" data-ref="pat:${p.c}" data-goto="learn">Review ${esc(CATS[p.c])} &rarr;</button>` : ""}</li>`).join("")}</ol>
    ${n < all.length ? `<button class="btn ${n ? "" : "primary"}" data-hint="${p.s}">Show hint ${n + 1} of ${all.length}</button>`
      : `<p class="muted">That's every hint. Next step: the Solution tab.</p>`}
    ${n ? `<button class="btn ghost small" data-hintreset="${p.s}">Hide hints</button>` : ""}`;
}

const lockedPane = (p, what) => `<div class="empty"><span class="big">&#128161;</span>Give it 20-30 minutes${hintsShown(p.s) < hintsFor(p).length ? " and try the hints" : ""} before you look at the ${what}.
  <div style="margin-top:12px"><button class="btn primary" data-reveal="${p.s}">Reveal solution &amp; video</button></div></div>`;

function paneSolution(p) {
  const s = SOL[p.s];
  if (!s) return `<p class="muted">No worked solution for this one yet.</p>`;
  if (!isRevealed(p.s)) return lockedPane(p, "solution");
  return `<p><b>Approach:</b> ${esc(s.a)}</p><p><b>Complexity:</b> ${esc(s.t)}</p>
    <pre>${esc(s.c)}</pre>
    <div class="row"><button class="btn small" data-copy="${p.s}">Copy code</button><button class="btn small" data-tocode="${p.s}">Load into editor</button>
      <button class="btn small ghost" data-reveal="${p.s}">Hide again</button></div>
    ${rec(p.s) ? "" : `<p class="muted" style="margin-bottom:0">Needed the solution? Log the attempt as "Struggled" so it comes back tomorrow.</p>`}`;
}

function paneVideo(p) {
  if (!isRevealed(p.s)) return lockedPane(p, "video");
  const vid = VIDEOS[p.s];
  return `${vid ? `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${vid}" title="${esc(p.t)} video" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`
      : `<p class="muted">No verified video for this one yet.</p>`}
    <p><a class="btn small" href="${videoUrl(p)}" target="_blank" rel="noopener">${vid ? "Watch on YouTube" : "Search YouTube for videos"}</a></p>`;
}

// ---------- wiring ----------
document.addEventListener("click", (e) => {
  const t = e.target, d = t.dataset;
  const op = t.closest("[data-open]");
  if (op) return openWorkspace(op.dataset.open);
  if (d.sol) return openWorkspace(d.sol, true);
  if (t.closest("[data-wsback]")) { views._ws = null; return go("problems"); }
  if (t.closest("[data-scratch]")) return openWorkspace("");
  const wt = t.closest("[data-wstab]");
  if (wt) { (S.wsTab = S.wsTab || {})[views._ws] = wt.dataset.wstab; save(); return rerender(); }
  if (d.hint) { S.hints = S.hints || {}; S.hints[d.hint] = hintsShown(d.hint) + 1; save(); return rerender(); }
  if (d.hintreset) { delete (S.hints || {})[d.hintreset]; save(); return rerender(); }
  if (d.reveal) { views._rev = views._rev || {}; views._rev[d.reveal] = !views._rev[d.reveal]; return rerender(); }
  if (d.copy) { const c = SOL[d.copy].c; return navigator.clipboard?.writeText(c).then(() => { t.textContent = "Copied!"; }, () => {}); }
  if (d.tocode) { if (S.code[d.tocode] && !confirm("Replace your code with the solution?")) return; S.code[d.tocode] = SOL[d.tocode].c; save(); return rerender(); }
  if (t.id === "t-go") {
    if (timerId) { clearInterval(timerId); timerId = null; }
    else timerId = setInterval(() => { timerSec++; const el = $("#timer"); if (el) el.textContent = fmt(timerSec); }, 1000);
    return rerender();
  }
  if (t.id === "t-reset") { clearInterval(timerId); timerId = null; timerSec = 0; return rerender(); }
});
document.addEventListener("input", (e) => {
  if (e.target.id === "code") { S.code[views._ws || ""] = e.target.value; saveSoon(); }
});
