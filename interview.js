"use strict";
// Interview section: timed mock interviews (coding + behavioural), a STAR story bank tagged by
// theme, and mock history with weak-spot suggestions. Coding rounds draw on PROBLEMS/SOL.
// Loaded before app.js; it only uses app.js / track globals at call time.
// Assessments are fixed sets of coding rounds (ASSESSMENTS in data.js) that run as a mock with an `assess` id.
// State: S.ivActive (the mock in progress), S.ivMocks (finished mocks), S.stories (STAR stories).

const IV_TABS = [["mock", "Mock interview"], ["assess", "Assessments"], ["stories", "Story bank"], ["history", "History"]];
TRACK_ICON.interview = `<svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 10.5h7M8.5 13.5h4.5"/></svg>`;

const STORY_THEMES = [
  ["conflict", "Conflict & disagreement"], ["failure", "Failure & mistakes"], ["leadership", "Leadership & ownership"],
  ["ambiguity", "Ambiguity & unclear problems"], ["impact", "Impact & results"], ["learning", "Learning something fast"],
  ["teamwork", "Teamwork & helping others"], ["pressure", "Deadlines & pressure"], ["customer", "Users & stakeholders"],
];
const themeName = (k) => (STORY_THEMES.find(([id]) => id === k) || [k, k])[1];

// Common behavioural questions, tagged with the themes a good story for them covers.
const BEHAVIORAL_QS = [
  { id: "b1", q: "Tell me about yourself.", themes: ["impact"], tip: "Two minutes: present (current work and a highlight), past (how you got here), future (why this role). End on why you want this job." },
  { id: "b2", q: "Tell me about a time you disagreed with a teammate or your manager.", themes: ["conflict"], tip: "Show you understood their view, used evidence, and committed once a decision was made. Avoid making the other person the villain." },
  { id: "b3", q: "Tell me about a project that failed or a mistake you made.", themes: ["failure"], tip: "Own it plainly, spend most of the time on what you changed afterwards, and give a later example where the lesson paid off." },
  { id: "b4", q: "Describe a time you took ownership of something outside your job description.", themes: ["leadership"], tip: "Why you noticed it, why nobody else had picked it up, what you did, and the measurable result." },
  { id: "b5", q: "Tell me about a time you had to work with unclear or changing requirements.", themes: ["ambiguity"], tip: "How you reduced the uncertainty: questions you asked, a prototype, a decision you documented, check-ins." },
  { id: "b6", q: "What's the project you're most proud of?", themes: ["impact"], tip: "Pick one with a clear 'I' contribution and numbers. Be ready for deep technical follow-ups on it." },
  { id: "b7", q: "Tell me about a time you had to learn a new technology quickly.", themes: ["learning"], tip: "What you had to learn, how (docs, small spikes, asking experts), how fast, and what you delivered with it." },
  { id: "b8", q: "Describe a time you helped a struggling teammate.", themes: ["teamwork"], tip: "Show empathy and specifics: pairing, unblocking, reviewing. Keep the teammate's dignity intact." },
  { id: "b9", q: "Tell me about a time you missed a deadline or nearly did.", themes: ["pressure", "failure"], tip: "When you saw the risk, how early you raised it, what you cut or traded, and what you'd plan differently." },
  { id: "b10", q: "Tell me about a time you had to push back on a stakeholder or customer request.", themes: ["customer", "conflict"], tip: "Understand the underlying need, offer an alternative that meets it, and show how the relationship stayed good." },
  { id: "b11", q: "Describe a time you improved a process or tool for your team.", themes: ["leadership", "impact"], tip: "Before and after, with a number (time saved, errors reduced), and how you got others to adopt it." },
  { id: "b12", q: "Tell me about a technical decision you made with incomplete information.", themes: ["ambiguity"], tip: "The options, how you limited the downside (reversible choice, feature flag), and how you checked it later." },
  { id: "b13", q: "Tell me about a time you received critical feedback.", themes: ["learning", "failure"], tip: "Describe the feedback without defending yourself, what you changed, and evidence the change stuck." },
  { id: "b14", q: "Describe a time you handled a production incident.", themes: ["pressure"], tip: "Timeline: detect, mitigate, communicate, root cause, follow-up actions. Stress calm communication." },
  { id: "b15", q: "Tell me about a time you influenced people without having authority over them.", themes: ["leadership", "teamwork"], tip: "Data, prototypes and finding allies. Show you listened and adjusted the proposal." },
  { id: "b16", q: "Tell me about a time you balanced quality against speed.", themes: ["pressure", "ambiguity"], tip: "What 'good enough' meant, what you deliberately left out, and how you made the shortcut safe (tests, follow-up ticket)." },
  { id: "b17", q: "Describe a time you explained something technical to a non-technical audience.", themes: ["customer"], tip: "Analogies, focusing on decisions and trade-offs rather than mechanics, and checking understanding." },
  { id: "b18", q: "Tell me about a time you went above and beyond for a user.", themes: ["customer", "impact"], tip: "The user's problem, why it mattered, what you did, and how you knew it helped." },
  { id: "b19", q: "Tell me about a time you worked across teams to deliver something.", themes: ["teamwork"], tip: "Dependencies, how you aligned priorities and kept everyone informed, and the outcome." },
  { id: "b20", q: "Describe a bug or problem that took you a long time to solve.", themes: ["learning", "pressure"], tip: "Your debugging method (hypotheses, narrowing down, instrumentation), the root cause and the guard you added." },
  { id: "b21", q: "Tell me about a time you used data to make a decision.", themes: ["impact", "ambiguity"], tip: "The question, the data and its limits, the decision, and what happened next." },
  { id: "b22", q: "Describe a time you had too many priorities at once.", themes: ["pressure"], tip: "How you ranked them (impact, urgency, who's blocked), what you said no to, and how you communicated it." },
  { id: "b23", q: "Tell me about a time you mentored someone or shared knowledge.", themes: ["leadership", "teamwork"], tip: "What they needed, your approach, and how they grew. Docs or talks you wrote count too." },
  { id: "b24", q: "Why do you want to work here, and why this role?", themes: ["impact"], tip: "Connect specific things about the company and the posting to your experience and goals. Research first." },
  { id: "b25", q: "Tell me about a time you changed your mind after seeing new evidence.", themes: ["learning", "conflict"], tip: "What you believed, what changed it, and how you updated the plan and told others." },
];

const IV_FORMATS = {
  standard: { name: "Coding loop · 60 min", rounds: [["dsa", 25], ["dsa", 20], ["beh", 15]] },
  short: { name: "Short · 35 min", rounds: [["dsa", 25], ["beh", 10]] },
  dsa: { name: "Coding only · 50 min", rounds: [["dsa", 25], ["dsa", 25]] },
};
const ROUND_NAMES = { dsa: "Coding", beh: "Behavioural" };
const SCORES = [[1, "Struggled"], [2, "Partly"], [3, "Solid"], [4, "Strong"]];

function ivState() {
  S.ivMocks = S.ivMocks || [];
  S.stories = S.stories || [];
  S.ivPrefs = Object.assign({ format: "standard" }, S.ivPrefs || {});
  if (!IV_FORMATS[S.ivPrefs.format]) S.ivPrefs.format = "standard";
  // a mock started in the combined Prep Hub app can hold rounds this version can't show
  if (S.ivActive && !S.ivActive.rounds.every((r) => ROUND_NAMES[r.kind])) S.ivActive = null;
  return S;
}
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pickFrom = (...pools) => { for (const p of pools) if (p.length) return shuffle(p)[0]; return null; };

// ---------------- dealing rounds ----------------
// Recent mocks' items are skipped so consecutive mocks don't repeat.
function recentRefs() { return new Set(ivState().ivMocks.slice(-5).flatMap((m) => m.rounds.map((r) => r.ref))); }

function dealRound(kind, used) {
  const fresh = (ref) => !used.has(ref);
  if (kind === "dsa") {
    const inc = included(), due = dueReviews().filter((p) => p.l <= S.maxLevel);
    const reached = WEEKS.slice(0, currentWeek()).flatMap((w) => w.cats);
    const p = pickFrom(due.filter((x) => fresh(x.s)), inc.filter((x) => !isDone(x.s) && reached.includes(x.c) && fresh(x.s)), inc.filter((x) => !isDone(x.s) && fresh(x.s)), inc);
    return { ref: p.s, title: p.t };
  }
  const beh = BEHAVIORAL_QS;
  // favour themes with no story yet, so practice fills the gaps
  const covered = new Set(ivState().stories.flatMap((s) => s.themes));
  const q = pickFrom(beh.filter((b) => fresh(b.id) && b.themes.some((t) => !covered.has(t))), beh.filter((b) => fresh(b.id)), beh);
  return { ref: q.id, title: q.q };
}
function startMock() {
  const st = ivState(), { format } = st.ivPrefs, used = recentRefs();
  const rounds = IV_FORMATS[format].rounds.map(([kind, mins]) => {
    const r = Object.assign({ kind, mins, score: 0, notes: "", acc: 0, since: null, shown: false }, dealRound(kind, used));
    used.add(r.ref);
    return r;
  });
  st.ivActive = { id: "m" + Date.now().toString(36), date: today(), format, cur: 0, rounds };
  bump(); save();
}
function startAssessment(id) {
  const a = ASSESSMENTS.find((x) => x.id === id);
  const rounds = a.probs.map(([slug, mins]) => ({ kind: "dsa", mins, score: 0, notes: "", acc: 0, since: null, shown: false, ref: slug, title: probBySlug(slug).t }));
  ivState().ivActive = { id: "m" + Date.now().toString(36), date: today(), format: "assess", assess: id, cur: 0, rounds };
  bump(); save();
}
// The name a mock shows in History and on the run screen.
const mockName = (m) => m.assess ? "Assessment: " + ((ASSESSMENTS.find((a) => a.id === m.assess) || {}).name || m.assess) : IV_FORMATS[m.format] ? IV_FORMATS[m.format].name : "";
const mockAvg = (m) => { const s = m.rounds.filter((r) => r.score); return s.length ? s.reduce((a, r) => a + r.score, 0) / s.length : 0; };
const roundSecs = (r) => r.acc + (r.since ? (Date.now() - r.since) / 1000 : 0);
function pauseRound(r) { if (r.since) { r.acc = roundSecs(r); r.since = null; } }

// ---------------- pages ----------------
let ivTimer = null;
function interviewView(sub) {
  clearInterval(ivTimer); ivTimer = null;
  ivState();
  if (sub === "stories") return ivStories();
  if (sub === "history") return ivHistory();
  if (sub === "assess") return ivAssess();
  return S.ivActive ? ivRun(S.ivActive) : ivSetup();
}
const ivHead = (title, subtitle) => pageHead(title, subtitle);

function ivSetup() {
  const st = ivState(), p = st.ivPrefs, last = st.ivMocks[st.ivMocks.length - 1];
  const fmt = IV_FORMATS[p.format];
  return `<section class="card hero t-interview">
      <div style="position:relative;z-index:1">
        <div class="eyebrow">${st.ivMocks.length} mock${st.ivMocks.length === 1 ? "" : "s"} done${last ? ` · last on ${esc(last.date)}` : ""}</div>
        <h1>Mock interview</h1>
        <p>A timed set of rounds dealt from your own prep: coding problems (due reviews first, then this week's topics) and a behavioural question. Answer out loud as if someone is listening, then score yourself honestly.</p>
      </div></section>
    <div class="card"><h3>Set up</h3>
      <div class="setting"><div><b>Format</b><div class="muted">${fmt.rounds.map(([k, m]) => `${ROUND_NAMES[k]} ${m}m`).join(" · ")}</div></div>
        <div class="seg">${Object.entries(IV_FORMATS).map(([id, f]) => `<button data-ivformat="${id}" class="${p.format === id ? "on" : ""}">${esc(f.name)}</button>`).join("")}</div></div>
      <div class="row" style="margin-top:14px"><button class="btn primary" data-ivstart>Start mock interview &rarr;</button>
        <span class="muted">The timer for each round starts when you press Start round.</span></div></div>
    <div class="cols-2">
      <div class="card"><h3>How to run it</h3><ol>${MOCK_TIPS.map((t) => `<li>${esc(t)}</li>`).join("")}</ol></div>
      <div class="card"><h3>Behavioural answers: STAR</h3><ul>
        <li><b>Situation</b>: one or two sentences of context.</li><li><b>Task</b>: what you were responsible for.</li>
        <li><b>Action</b>: what <i>you</i> did, in detail. Most of the answer goes here.</li><li><b>Result</b>: the outcome, with a number if you can, and what you learned.</li></ul>
        <div class="row"><button class="btn small" data-nav-go="interview:stories">Open your story bank (${st.stories.length})</button></div></div>
    </div>`;
}

function ivRun(m) {
  const r = m.rounds[m.cur], n = m.rounds.length, secs = roundSecs(r), left = r.mins * 60 - secs;
  if (r.since) ivTimer = setInterval(tickIv, 1000);
  const steps = m.rounds.map((x, i) => `<span class="iv-step ${i === m.cur ? "on" : ""} ${x.score ? "done" : ""}">${i + 1}. ${ROUND_NAMES[x.kind]}${x.score ? ` · ${x.score}/4` : ""}</span>`).join("");
  return `<div class="card iv-bar">
      <div class="iv-steps"><b class="iv-name">${esc(mockName(m))}</b>${steps}</div>
      <div class="row"><span id="iv-timer" class="timer ${left < 0 ? "over" : ""}">${fmtLeft(left)}</span>
        <button class="btn ${r.since ? "" : "primary"}" data-ivclock>${r.since ? "Pause" : secs ? "Resume" : "Start round"}</button></div></div>
    ${roundBody(m, r)}
    <div class="card"><div class="section-head"><h3>Score this round</h3><span class="muted">Be honest: weak rounds come back in History and in your question bank.</span></div>
      <div class="seg iv-score">${SCORES.map(([v, l]) => `<button data-ivscore="${v}" class="${r.score === v ? "on" : ""}">${v} · ${l}</button>`).join("")}</div>
      <label class="fld" style="margin-top:12px"><span>Notes: what went well, what to fix</span><textarea data-ivnotes rows="3" placeholder="e.g. Jumped to code before clarifying input size">${esc(r.notes)}</textarea></label>
      <div class="row between"><button class="btn ghost danger" data-ivquit>Abandon mock</button>
        <div class="row">${m.cur > 0 ? `<button class="btn" data-ivgo="${m.cur - 1}">&larr; Previous</button>` : ""}
        ${m.cur < n - 1 ? `<button class="btn primary" data-ivgo="${m.cur + 1}">Next round &rarr;</button>` : `<button class="btn primary" data-ivfinish>Finish &amp; save</button>`}</div></div></div>`;
}
const fmtLeft = (s) => (s < 0 ? "+" : "") + fmt(Math.abs(Math.round(s)));
function tickIv() {
  const m = S.ivActive, el = $("#iv-timer");
  if (!m || !el) { clearInterval(ivTimer); ivTimer = null; return; }
  const r = m.rounds[m.cur], left = r.mins * 60 - roundSecs(r);
  el.textContent = fmtLeft(left); el.classList.toggle("over", left < 0);
}

function roundBody(m, r) {
  const reveal = (label, html) => r.shown ? `<div class="callout">${html}</div><button class="btn small ghost" data-ivshow>Hide ${label}</button>` : `<button class="btn small" data-ivshow>Show ${label}</button>`;
  const head = (extra = "") => `<div class="label">Round ${m.cur + 1} · ${ROUND_NAMES[r.kind]} · ${r.mins} min</div>${extra}`;
  if (r.kind === "dsa") {
    const p = PROBLEMS.find((x) => x.s === r.ref), sol = SOL[p.s];
    return `<div class="card">${head()}<h2 style="margin:6px 0 8px">${esc(p.t)} ${diffBadge(p.d)}</h2>
      <div class="row" style="margin-bottom:10px"><span class="pill">${esc(CATS[p.c])}</span>${rec(p.s) ? `<span class="pill">${rec(p.s).next <= today() ? "Review due" : "Solved before"}</span>` : '<span class="pill">New to you</span>'}</div>
      <p class="muted">Clarify the input and edge cases, say a brute force and its complexity, then optimise and code it. Talk the whole time.</p>
      <div class="row">${isCustom(p.s) ? "" : `<a class="btn primary" href="https://leetcode.com/problems/${p.s}/" target="_blank" rel="noopener">Open on LeetCode &nearr;</a>`}
        <button class="btn ${isCustom(p.s) ? "primary" : ""}" data-open="${p.s}">Code it in the workspace</button><button class="btn" data-log="${p.s}">Log attempt</button></div>
      ${sol ? `<div style="margin-top:14px">${reveal("approach", `<b>Approach:</b> ${esc(sol.a)}<br><b>Complexity:</b> ${esc(sol.t)}`)}</div>` : ""}</div>`;
  }
  const q = BEHAVIORAL_QS.find((x) => x.id === r.ref) || { q: r.title, themes: ["impact"], tip: "Use STAR: situation, task, your actions, and a measurable result." };
  const stories = ivState().stories.filter((s) => s.themes.some((t) => q.themes.includes(t)));
  return `<div class="card">${head()}<h2 style="margin:6px 0 8px">${esc(q.q)}</h2>
    <div class="row" style="margin-bottom:10px">${q.themes.map((t) => `<span class="pill">${esc(themeName(t))}</span>`).join("")}</div>
    <p class="muted">Use STAR and keep it to about two minutes. Most of the time goes on your Actions; finish with a measurable Result.</p>
    ${reveal("tip", esc(q.tip))}</div>
    <div class="card"><div class="section-head"><h3>Your matching stories <span class="muted">${stories.length}</span></h3><button class="btn small ghost" data-ivnewstory="${q.themes.join(",")}">+ Write a story for this</button></div>
      ${stories.length ? stories.map((s) => `<details class="iv-story"><summary>${esc(s.title || "Untitled story")}</summary>${starHtml(s)}</details>`).join("")
        : `<p class="muted" style="margin:0">No story covers ${q.themes.map((t) => `<b>${esc(themeName(t).toLowerCase())}</b>`).join(" or ")} yet. Answer from memory now, then write it up in the story bank.</p>`}</div>`;
}
const starHtml = (s) => `<dl class="star">${[["Situation", s.s], ["Task", s.t], ["Action", s.a], ["Result", s.r]].map(([k, v]) => `<dt>${k}</dt><dd>${esc(v || "—")}</dd>`).join("")}</dl>`;

function finishMock() {
  const m = S.ivActive;
  m.rounds.forEach(pauseRound);
  S.ivMocks.push({ id: m.id, date: m.date, format: m.format, ...(m.assess ? { assess: m.assess } : {}), rounds: m.rounds.map(({ kind, ref, title, mins, score, notes, acc }) => ({ kind, ref, title, mins, score, notes, secs: Math.round(acc) })) });
  S.ivActive = null; bump(); save();
}

// ---------------- assessments ----------------
function ivAssess() {
  const st = ivState(), busy = st.ivActive;
  const cards = ASSESSMENTS.map((a, i) => {
    const runs = st.ivMocks.filter((m) => m.assess === a.id), best = runs.length ? Math.max(...runs.map(mockAvg)) : 0;
    const mins = a.probs.reduce((n, [, m]) => n + m, 0), ps = a.probs.map(([s]) => probBySlug(s));
    return `<div class="card assess-card">
      <div class="row between"><span class="label" style="margin:0">Assessment ${i + 1}</span><span class="pill">${lvlName[a.level]}${a.level > S.maxLevel ? " · above your level" : ""}</span></div>
      <h3>${esc(a.name)}</h3><p class="muted" style="margin:0">${esc(a.desc)}</p>
      <div class="row">${ps.map((p) => diffBadge(p.d)).join("")}<span class="muted">${ps.length} questions · ${mins} min</span></div>
      <div class="row between"><span class="muted">${runs.length ? `Best ${best.toFixed(1)} / 4 · ${runs.length} run${runs.length === 1 ? "" : "s"}` : "Not taken yet"}</span>
        <button class="btn ${busy ? "" : "primary"}" data-ivassess="${a.id}" ${busy ? "disabled" : ""}>${runs.length ? "Retake" : "Start"} &rarr;</button></div></div>`;
  }).join("");
  return ivHead("Assessments", `${ASSESSMENTS.length} fixed sets of timed coding questions, like a real interview day. The questions stay hidden until you start; each round has its own clock, and you score yourself at the end of each one.`) +
    (busy ? `<div class="callout" style="margin-bottom:var(--gap)"><b>${esc(mockName(busy))}</b> is in progress. Finish or abandon it before starting another. <button class="btn small" data-nav-go="interview:mock">Continue it &rarr;</button></div>` : "") +
    `<div class="assess-grid">${cards}</div>`;
}

// ---------------- history ----------------
function ivHistory() {
  const mine = ivState().ivMocks.filter((m) => m.rounds.every((r) => ROUND_NAMES[r.kind])), mocks = mine.slice().reverse();
  const byKind = Object.keys(ROUND_NAMES).map((k) => {
    const rs = mine.flatMap((m) => m.rounds).filter((r) => r.kind === k && r.score);
    return { k, n: rs.length, avg: rs.length ? rs.reduce((a, r) => a + r.score, 0) / rs.length : 0 };
  });
  const weakest = byKind.filter((x) => x.n).sort((a, b) => a.avg - b.avg)[0];
  const advice = {
    dsa: ["Work through your due reviews and log every attempt.", "data-due=\"1\"", "Review due problems"],
    beh: ["Write STAR stories for the themes you haven't covered.", 'data-nav-go="interview:stories"', "Story bank"],
  };
  return ivHead(`History <span class="muted">${mocks.length}</span>`, "Every finished mock, with your scores per round type.") +
    `<div class="grid">${byKind.map((x) => `<div class="card"><div class="label">${ROUND_NAMES[x.k]}</div><div class="stat">${x.n ? x.avg.toFixed(1) : "–"}<small> / 4</small></div><div class="muted">${x.n} round${x.n === 1 ? "" : "s"} scored</div></div>`).join("")}</div>` +
    (weakest && weakest.avg < 3 ? `<div class="callout" style="margin-bottom:var(--gap)"><b>Weakest area: ${ROUND_NAMES[weakest.k]}</b> (${weakest.avg.toFixed(1)} / 4). ${advice[weakest.k][0]} <button class="btn small" ${advice[weakest.k][1]}>${advice[weakest.k][2]} &rarr;</button></div>` : "") +
    (mocks.length ? mocks.map((m) => {
      const avg = mockAvg(m);
      return `<details class="card iv-mock"><summary><span style="flex:1"><b>${esc(m.date)}</b> · ${esc(mockName(m))}</span>
        ${m.rounds.map((r) => `<span class="badge ${r.score >= 3 ? "done" : r.score ? "due" : ""}" title="${esc(r.title)}">${ROUND_NAMES[r.kind]} ${r.score || "–"}</span>`).join("")}<span class="muted">avg ${avg ? avg.toFixed(1) : "–"}</span></summary>
        <div class="list" style="margin-top:10px">${m.rounds.map((r) => `<div class="li"><div style="flex:1;min-width:0"><span class="t">${ROUND_NAMES[r.kind]}: ${esc(r.title)}</span>
          <div class="muted">${r.score ? `${r.score}/4 ${SCORES[r.score - 1][1]}` : "Not scored"} · ${fmt(r.secs || 0)} of ${r.mins}:00</div>${r.notes ? `<div style="margin-top:4px;white-space:pre-wrap">${esc(r.notes)}</div>` : ""}</div></div>`).join("")}</div>
        <div class="row" style="margin-top:10px;justify-content:flex-end"><button class="btn small danger" data-ivdel="${esc(m.id)}">Delete</button></div></details>`;
    }).join("") : `<div class="card empty"><span class="big">&#127908;</span>No mocks yet. <button class="btn small primary" data-nav-go="interview:mock">Start one</button></div>`);
}

// ---------------- story bank ----------------
const blankStory = (themes = []) => ({ id: null, title: "", s: "", t: "", a: "", r: "", themes, skills: [] });
function ivStories() {
  const st = ivState(), stories = st.stories;
  if (views._ivEdit && !views._ivDraft) {
    const s = stories.find((x) => x.id === views._ivEdit);
    views._ivDraft = s ? JSON.parse(JSON.stringify(s)) : blankStory();
  }
  views._ivEdit = null;
  const d = views._ivDraft;
  const themeCount = (k) => stories.filter((s) => s.themes.includes(k)).length;
  return ivHead(`Story bank <span class="muted">${stories.length}</span>`, "Write each story once in STAR form and tag it. Mock interviews show your matching stories in behavioural rounds.") +
    (d ? storyForm(d) : `<div class="row" style="margin-bottom:var(--gap)"><button class="btn primary" data-ivnewstory="">+ New story</button><span class="muted">Aim for 6-8 strong stories that together cover every theme.</span></div>`) +
    `<div class="card"><h3>Theme coverage</h3><div class="list">${STORY_THEMES.map(([k, l]) => { const n = themeCount(k); return `<div class="li"><span>${esc(l)}</span>${n ? `<span class="badge done">${n} stor${n === 1 ? "y" : "ies"}</span>` : `<button class="btn small" data-ivnewstory="${k}">Write one</button>`}</div>`; }).join("")}</div></div>` +
    (stories.length ? stories.map((s) => `<div class="card" id="story-${esc(s.id)}"><div class="section-head"><h3 style="margin:0">${esc(s.title || "Untitled story")}</h3>
        <div class="row"><button class="btn small" data-ivedit="${esc(s.id)}">Edit</button><button class="btn small danger" data-ivsdel="${esc(s.id)}">Delete</button></div></div>
        <div class="row" style="margin:8px 0">${s.themes.map((t) => `<span class="pill">${esc(themeName(t))}</span>`).join("")}</div>
        ${starHtml(s)}</div>`).join("") : d ? "" : `<div class="card empty"><span class="big">&#128221;</span>No stories yet. Start with your proudest project and one failure you learned from.</div>`);
}
function storyForm(d) {
  const area = (k, label, ph) => `<label class="fld"><span>${label}</span><textarea data-ivs="${k}" rows="${k === "a" ? 4 : 2}" placeholder="${esc(ph)}">${esc(d[k])}</textarea></label>`;
  return `<div class="card" id="iv-form"><div class="section-head"><h3 style="margin:0">${d.id ? "Edit story" : "New story"}</h3><button class="btn small ghost" data-ivscancel>Cancel</button></div>
    <label class="fld" style="margin-top:12px"><span>Title</span><input data-ivs="title" value="${esc(d.title)}" placeholder="e.g. Cut report generation from 2 hours to 5 minutes" autocomplete="off"></label>
    ${area("s", "Situation", "Where you were, the team, what was going on.")}${area("t", "Task", "What you were responsible for, and why it mattered.")}
    ${area("a", "Action", "What you did, step by step. Say 'I', not 'we'.")}${area("r", "Result", "The outcome with numbers if you can, and what you learned.")}
    <div class="label" style="margin-top:6px">Themes</div><div class="rl-tags" style="margin:6px 0 12px">${STORY_THEMES.map(([k, l]) => `<button class="tag tag-btn ${d.themes.includes(k) ? "lv-confident" : ""}" data-ivtheme="${k}">${esc(l)}</button>`).join("")}</div>
    <div class="row between" style="margin-top:12px"><span class="M" id="ivs-msg" role="alert"></span><div class="row"><button class="btn ghost" data-ivscancel>Cancel</button><button class="btn primary" data-ivssave>${d.id ? "Save changes" : "Save story"}</button></div></div></div>`;
}
function saveStory() {
  const d = views._ivDraft;
  if (!d.title.trim() && !d.a.trim()) { $("#ivs-msg").textContent = "Give the story a title or at least the Action."; return; }
  const st = ivState(), s = Object.assign({}, d, { id: d.id || "s" + Date.now().toString(36), updated: today() });
  const i = st.stories.findIndex((x) => x.id === s.id);
  if (i >= 0) st.stories[i] = s; else { st.stories.push(s); bump(); }
  views._ivDraft = null; save(); render(); revealEl("#story-" + s.id);
}

// ---------------- events ----------------
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-ivformat], [data-ivstart], [data-ivassess], [data-ivclock], [data-ivscore], [data-ivgo], [data-ivfinish], [data-ivquit], [data-ivshow], [data-ivdel], [data-ivnewstory], [data-ivedit], [data-ivsdel], [data-ivscancel], [data-ivssave], [data-ivtheme]");
  if (!b) return;
  const d = b.dataset, st = ivState(), m = st.ivActive, r = m && m.rounds[m.cur];
  if (d.ivformat) { st.ivPrefs.format = d.ivformat; save(); return rerender(); }
  if (d.ivstart !== undefined) { startMock(); render(); return window.scrollTo(0, 0); }
  if (d.ivassess && !m) { startAssessment(d.ivassess); return go("interview:mock"); }
  if (d.ivclock !== undefined && r) { if (r.since) pauseRound(r); else r.since = Date.now(); save(); return rerender(); }
  if (d.ivscore && r) { r.score = +d.ivscore; save(); return rerender(); }
  if (d.ivshow !== undefined && r) { r.shown = !r.shown; save(); return rerender(); }
  if (d.ivgo && m) {
    const wasRunning = !!r.since; pauseRound(r);
    m.cur = +d.ivgo;
    if (wasRunning && !m.rounds[m.cur].score) m.rounds[m.cur].since = Date.now(); // keep the clock going into the next round
    save(); render(); return window.scrollTo(0, 0);
  }
  if (d.ivfinish !== undefined && m) {
    const unscored = m.rounds.filter((x) => !x.score).length;
    if (unscored && !confirm(`${unscored} round${unscored === 1 ? " isn't" : "s aren't"} scored yet. Save anyway?`)) return;
    finishMock(); return go("interview:history");
  }
  if (d.ivquit !== undefined && m) { if (confirm("Abandon this mock? It won't be saved.")) { st.ivActive = null; save(); render(); } return; }
  if (d.ivdel) { if (confirm("Delete this mock from your history?")) { st.ivMocks = st.ivMocks.filter((x) => x.id !== d.ivdel); save(); } return rerender(); }
  // stories
  if (d.ivnewstory !== undefined) { views._ivDraft = blankStory(d.ivnewstory ? d.ivnewstory.split(",") : []); go("interview:stories"); return revealEl("#iv-form"); }
  if (d.ivedit) { views._ivEdit = d.ivedit; views._ivDraft = null; render(); return revealEl("#iv-form"); }
  if (d.ivsdel) { if (confirm("Delete this story?")) { st.stories = st.stories.filter((x) => x.id !== d.ivsdel); searchIndex = null; save(); } return rerender(); }
  if (d.ivscancel !== undefined) { views._ivDraft = null; return rerender(); }
  if (d.ivssave !== undefined && views._ivDraft) return saveStory();
  if (d.ivtheme && views._ivDraft) { const t = views._ivDraft.themes, i = t.indexOf(d.ivtheme); if (i >= 0) t.splice(i, 1); else t.push(d.ivtheme); return rerender(); }
});
document.addEventListener("input", (e) => {
  const d = e.target.dataset || {};
  if (d.ivnotes !== undefined && S.ivActive) { S.ivActive.rounds[S.ivActive.cur].notes = e.target.value; save(); }
  if (d.ivs && views._ivDraft) views._ivDraft[d.ivs] = e.target.value;
});
