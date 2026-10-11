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
// Java and C# solutions (data/solutions/java.js, csharp.js) load the same way, only for the main
// language, so Python users never download them. Each file calls addLang(lang, slug, code).
const SOL_LANG = { java: {}, cs: {} };
const addLang = (lang, slug, c) => { SOL_LANG[lang][slug] = c; };
const LANG_SOL_FILES = { java: "data/solutions/java.js", cs: "data/solutions/csharp.js" };
const langSolLoading = {}, langSolReady = { py: true };
function loadLangSolutions(lang) {
  if (!LANG_SOL_FILES[lang]) return Promise.resolve();
  return (langSolLoading[lang] ||= new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = LANG_SOL_FILES[lang]; s.onload = res; s.onerror = () => rej(new Error("Couldn't load " + LANG_SOL_FILES[lang]));
    document.head.appendChild(s);
  }).then(() => { langSolReady[lang] = true; }, (e) => { delete langSolLoading[lang]; throw e; }));
}
// Renders `html` now; once the content (and `lang`'s solutions) have loaded, re-renders if `stillHere()`
// says the page is still open.
function whenContent(stillHere, html, lang = "py") {
  Promise.all([loadContent(), loadLangSolutions(lang)]).then(() => { if (stillHere()) rerender(); },
    () => { if (stillHere()) { const v = $("#view .content-wait"); if (v) v.textContent = "Couldn't load the problem files. Check your connection and refresh."; } });
  return html;
}

// ---------- the editor's language ----------
// Problems follow the main language (Learn / Settings). Python runs and is graded right here; Java and
// C# get starter code and solutions in that language, checked against the expected outputs or on
// LeetCode. Code is saved per language (S.code[slug] for Python, S.code["java:" + slug]...), so
// switching languages never overwrites anything. The scratchpad is always Python.
const LANG_NAME = { py: "Python", java: "Java", cs: "C#" };
const wsLang = (slug) => (slug ? mainLang() : "py");
const codeKey = (slug, lang = wsLang(slug)) => (lang === "py" ? slug : lang + ":" + slug);
const solCode = (slug, lang = wsLang(slug)) => (lang === "py" ? (SOL[slug] || {}).c : SOL_LANG[lang][slug]);
const HL_NAME = { py: "python", java: "java", cs: "cs" };

// Test inputs and examples are written in Python syntax; for Java / C# show them as plain literals.
function plainLiteral(s, lang) {
  if (lang === "py") return s;
  return String(s)
    .replace(/list\('([^']*)'\)/g, (m, chars) => JSON.stringify([...chars]))
    .replace(/'((?:[^'\\]|\\.)*)'|"(?:[^"\\]|\\.)*"|\b(None|True|False)\b/g, (m, single, word) =>
      word ? { None: "null", True: "true", False: "false" }[word] : single !== undefined ? JSON.stringify(single.replace(/\\'/g, "'")) : m);
}

// Java / C# starter: the reference solution's classes and public methods with empty bodies (helpers,
// fields and nested classes are left out), like LeetCode's starter code.
function starterForLang(p, lang) {
  const code = solCode(p.s, lang) || "", out = [];
  let depth = 0, skipTo = -1, note = null, stubs = 0;
  for (const line of code.split("\n")) {
    const t = line.trim(), start = depth;
    depth += braceDelta(line);
    if (skipTo >= 0) { if (depth <= skipTo) skipTo = -1; continue; }
    if (start === 0) { if (/\b(class|interface)\b/.test(t) || t === "}") out.push(line.trimEnd()); continue; }
    if (start !== 1) continue;
    if (t === "}") { out.push("}"); continue; }
    if (t.startsWith("@")) { note = line.trimEnd(); continue; }
    const member = /^public\s/.test(t) && t.includes("(") && !/\b(class|record|struct)\b/.test(t.split("(")[0]);
    if (member) {
      const sig = line.slice(0, line.search(t.includes("=>") && !t.includes("{") ? /\s*=>/ : /\s*\{/)).trimEnd();
      if (note) out.push(note);
      out.push(sig + " {", "        ", "    }");
      stubs++;
    }
    note = null;
    if (depth > 1) skipTo = 1;   // skip the body (or a nested class / multi-line field)
  }
  const c = "//", spec = TESTS[p.s] || {};
  return `${c} ${p.t}\n${c} ${isCustom(p.s) ? "Read the problem on the left" : "Read the problem on LeetCode"}, fill in the method${stubs > 1 ? "s" : ""}, then check it against the test cases below.\n${providedNoteLang(spec, lang)}\n${out.join("\n")}\n`;
}
// Braces outside string / char literals and // comments.
function braceDelta(line) {
  let d = 0;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "/" && line[i + 1] === "/") break;
    if (ch === '"' || ch === "'") {
      for (i++; i < line.length && line[i] !== ch; i++) if (line[i] === "\\") i++;
    } else if (ch === "{") d++;
    else if (ch === "}") d--;
  }
  return d;
}
function providedNoteLang(spec, lang) {
  const java = lang === "java", kinds = [...(spec.in || []), spec.out || ""];
  if (spec.api === "nestediter") return java ? "// NestedInteger is provided: isInteger(), getInteger(), getList()\n" : "// NestedInteger is provided: IsInteger(), GetInteger(), GetList()\n";
  if (spec.api === "badversion") return java ? "// isBadVersion(int version) is provided by VersionControl, which your Solution extends.\n" : "// IsBadVersion(int version) is provided by VersionControl, which your Solution derives from.\n";
  if (kinds.includes("rlist")) return "// Node is provided: Node(int val), with fields val, next and random.\n";
  if (kinds.includes("graph")) return `// Node is provided: Node(int val), with fields val and neighbors (${java ? "List<Node>" : "IList<Node>"}).\n`;
  if (kinds.some((k) => ["list", "lists", "cycle"].includes(k))) return `// ListNode is provided: ${java ? "ListNode(int val, ListNode next)" : "ListNode(int val = 0, ListNode next = null)"}, with fields val and next.\n`;
  if (kinds.some((k) => ["tree", "ref"].includes(k)) || spec.design === "codec") return `// TreeNode is provided: ${java ? "TreeNode(int val, TreeNode left, TreeNode right)" : "TreeNode(int val = 0, TreeNode left = null, TreeNode right = null)"}, with fields val, left and right.\n`;
  return "";
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
  const p = probBySlug(slug), lang = p ? mainLang() : "py", runs = lang === "py";
  if (!contentReady || !langSolReady[lang]) return whenContent(() => tab === "problems" && views._ws === slug, contentWait(), lang);
  if (runs) warmPython();
  const code = S.code[codeKey(slug, lang)] ?? (!p ? "# Scratchpad: try anything here. Use print() to see output.\n\n" : runs ? starterFor(p) : starterForLang(p, lang));
  const editor = `<div class="card ws-editor"><div class="row between" style="margin-bottom:10px"><h3 style="margin:0">Your code <span class="muted" style="font-weight:400">${LANG_NAME[lang]}</span></h3>
      ${p ? "" : timerHtml()}</div>
    <textarea id="code" data-hl="${HL_NAME[lang]}" spellcheck="false">${esc(code)}</textarea>
    <div class="row" style="margin-top:8px">${!runs ? "" : p && TESTS[p.s] ? `<button class="btn primary" data-runtests>Run tests</button><button class="btn" data-runcode title="Run your code and show what it prints">Run</button>` : `<button class="btn primary" data-runcode>Run</button>`}
      ${p ? `<button class="btn ghost" data-starter title="Replace your code with the empty starter">Reset code</button>` : ""}
      <span class="muted" id="py-status">${!runs ? `${LANG_NAME[lang]} can't run in the browser: check it against the test cases below.` : p ? "Run tests checks your answer; Run shows what it prints." : "Run shows what your code prints."} Saves as you type.</span></div>
    ${runs ? `<pre id="out"></pre>` : ""}</div>
    ${!p || !TESTS[p.s] ? "" : runs ? `<div class="card" id="ws-tests">${testsHtml(p.s)}</div>` : `<div class="card" id="ws-cases">${casesHtml(p, lang)}</div>`}`;
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
  const lang = wsLang(p.s);
  const ex = pr && spec && !spec.design ? `<div class="label">Example</div><pre class="plain ws-ex">Input:  ${esc(plainLiteral(spec.args[0], lang))}${pr.ex ? `\nOutput: ${esc(plainLiteral(pr.ex, lang))}` : ""}</pre>` : "";
  // Problems written for this app carry their full statement (trusted HTML from prompts.js) and have no LeetCode page.
  if (isCustom(p.s)) return `<div class="callout" style="margin-bottom:14px">Written for this app from interview reports (unverified). Treat it like a real round: read it once, plan out loud, then code.</div>
    <div class="ws-full">${pr.full}${lang !== "py" && pr.lang ? `<p><b>In ${LANG_NAME[lang]}:</b> ${pr.lang[lang]}</p>` : ""}</div>${ex}
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
  const s = SOL[p.s], lang = wsLang(p.s), code = solCode(p.s, lang);
  if (!s || !code) return `<p class="muted">No worked solution for this one yet.</p>`;
  if (!isRevealed(p.s)) return lockedPane(p, "solution");
  return `<p><b>Approach:</b> ${esc(s.a)}</p><p><b>Complexity:</b> ${esc(s.t)}</p>
    <pre class="language-${HL_NAME[lang]}">${esc(code)}</pre>
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

// ---------- Java / C#: test cases to check by hand ----------
// The expected outputs come from running the Python reference (the same harness as Run tests), so
// nothing is stored. views._cases[slug] = { loading } | { error } | { results: [{ shown, expected }] }.
const CMP_NOTE = {
  sort: "Any order is accepted.", sortall: "Any order is accepted, inside each item too.",
  topo: "Any valid order is accepted; this is one of them.", pal: "Any longest palindrome is accepted; this is one of them.",
  peak: "Any peak index is accepted; this is one of them.", reorg: "Any valid arrangement is accepted; this is one of them.",
  freqsort: "Letters with the same count can come in any order.", balbst: "Any height-balanced BST is accepted; this is one of them.",
  weighted: "Picks are random: this is one possible run.", randset: "getRandom is random: this is one possible run.",
};
function casesHtml(p, lang) {
  const spec = TESTS[p.s], st = (views._cases || {})[p.s];
  const lc = isCustom(p.s) ? "" : `<a class="btn" href="https://leetcode.com/problems/${p.s}/" target="_blank" rel="noopener">Run it on LeetCode &nearr;</a>`;
  let html = `<div class="section-head"><h3>Check your answer</h3><span class="muted">${spec.args.length} test cases</span></div>
    <p class="muted" style="margin-top:0">${LANG_NAME[lang]} can't run inside this page. Trace your code through these cases by hand (the expected outputs come from the reference solution)${lc ? `, or paste it into LeetCode, which runs ${LANG_NAME[lang]}` : ""}. ${CMP_NOTE[spec.cmp] || ""}</p>`;
  if (!st) return html + `<div class="row"><button class="btn primary" data-cases="${p.s}">Show the test cases</button>${lc}</div>`;
  if (st.loading) return html + `<div class="tests-running"><span class="spinner" aria-hidden="true"></span>Working out the expected outputs${pywReady ? "" : " (the first time loads Python, about 10 MB)"}…</div>`;
  if (st.error) return html + `<div class="callout bad-callout">${esc(st.error)}</div><div class="row"><button class="btn" data-cases="${p.s}">Try again</button>${lc}</div>`;
  const short = (s) => (s.length > 80 ? s.slice(0, 80) + "…" : s);
  html += st.results.map((x, i) => `<details class="tc" ${i === 0 ? "open" : ""}><summary>Test ${i + 1}<code class="tc-in">${esc(short(x.shown))}</code></summary>
    <div class="tc-body"><div class="label">Input</div><pre class="plain">${esc(x.shown)}</pre><div class="label">Expected output</div><pre class="plain">${esc(x.expected)}</pre></div></details>`).join("");
  return html + (lc ? `<div class="row" style="margin-top:10px">${lc}</div>` : "");
}
async function loadCases(slug) {
  const all = (views._cases = views._cases || {});
  if (all[slug] && !all[slug].error) return;
  all[slug] = { loading: true };
  drawCases(slug);
  const ref = SOL[slug].c, payload = { spec: Object.assign({ m: methodName(ref) }, TESTS[slug]), user: ref, ref };
  const r = await pyExclusive(() => pyRun(`run_tests(${pyStr(JSON.stringify(payload))})`, 60));
  all[slug] = r.timeout || r.err ? { error: "Couldn't work out the expected outputs (" + (r.err || "it timed out") + "). Check your connection and try again." }
    : { results: JSON.parse(r.value).results.filter((x) => !x.refError) };
  drawCases(slug);
}
function drawCases(slug) {
  const box = $("#ws-cases");
  if (box && views._ws === slug) box.innerHTML = casesHtml(probBySlug(slug), wsLang(slug));
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
  if (d.copy) { const c = solCode(d.copy); return navigator.clipboard?.writeText(c).then(() => { t.textContent = "Copied!"; }, () => {}); }
  if (d.tocode) {
    const key = codeKey(d.tocode);
    if (S.code[key] && !confirm("Replace your code with the solution?")) return;
    S.code[key] = solCode(d.tocode); save(); return rerender();
  }
  if (d.cases) return loadCases(d.cases);
  if (t.id === "t-go") {
    if (timerId) { clearInterval(timerId); timerId = null; }
    else timerId = setInterval(() => { timerSec++; const el = $("#timer"); if (el) el.textContent = fmt(timerSec); }, 1000);
    return rerender();
  }
  if (t.id === "t-reset") { clearInterval(timerId); timerId = null; timerSec = 0; return rerender(); }
});
document.addEventListener("input", (e) => {
  if (e.target.id === "code") { S.code[codeKey(views._ws || "")] = e.target.value; saveSoon(); }
});
