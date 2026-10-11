# DSA Prep

Data structures and algorithms prep for coding interviews at software jobs around Toronto and
Kitchener-Waterloo: a 12-week plan, one pattern family at a time. No build step, no backend:
plain HTML, CSS and JavaScript. One of four Job Preps apps, each in its own repo: DSA Prep, Cloud Prep, AI / LLM Prep and System Design Prep.

## Run it

```bash
python -m http.server 5174
```

Then visit http://localhost:5174. After one visit the app works offline too, Python included (a service
worker, `sw.js`, keeps a copy). Opening `index.html` directly also works, but without a server there are no
embedded videos, no speed test, no offline copy and no syntax colours.

To host it, any static host works (GitHub Pages, Netlify...). Pick one that compresses files (gzip or
brotli; most do): the first visit drops from about 430 KB to about 140 KB.

## What's inside

The app is organised as three steps, numbered in the nav: **1. Learn**, then **2. Problems** to
practise what you learned, then the **3. Roadmap** that paces it all over 12 weeks.

| Page | What it does |
| --- | --- |
| Home | Landing page: how the app works, the three steps with your progress on each, today's problems and reviews due, and a welcome note on your first visit |
| 1. Learn | One path through the sidebar: Programming Principles (15 lessons: variables and types, control flow, functions, references, recursion, memory and the call stack, the four OOP pillars, composition, DRY / KISS / YAGNI, SOLID, readable code, errors and edge cases; each with code in your main language and a 3-question quiz), then your main language's refresher (Python, Java or C#), Big-O (growth calculator + quiz, with code and operation costs in your main language), the Data Structures Crash Course (an overview plus 13 numbered lessons), then the algorithm patterns. Each pattern ends with "Practise this pattern". Other languages and full courses are extras |
| 2. Problems | 269 problems: 265 from LeetCode plus 4 practical problems written for this app, grouped by pattern and tagged Easy / Medium / Hard (all of them always shown). A grid of pattern cards on top shows progress per pattern and filters the list. The **company filter** shows the **FAANG Top 250** (in rank order, the problems Google, Amazon and Meta asked most in the last six months, each marked "FAANG #n"), **OpenAI** (LeetCode's OpenAI tags plus practical problems) and **Anthropic** (from candidate reports, unverified). The practical problems (an in-memory database built in stages, a web crawler, stack samples to trace events, a greedy tokenizer) have their full statement in the workspace instead of a LeetCode link. Each problem opens a split-screen workspace: **Prompt / Hints / Solution / Video** tabs on the left (a short summary with an example, three hints opened one at a time, and the solution and video locked until you reveal them); the editor on the right, in your main language (see Problems in Java and C# below), with **Run tests** for Python, plus an interview timer and attempt logging with spaced repetition. A scratchpad is there for experiments |
| 3. Roadmap | 12 weeks, one pattern family at a time, with each week's patterns to learn first and its problems and solutions |
| Interview | Timed mock interviews (coding problems from your due reviews plus a behavioural round) with self-scoring and notes; seven fixed **Assessments** (Warm-up, Standard, Mid-size & startups, FAANG favourites, OpenAI-style, Anthropic-style, Big tech) of 2-3 timed coding questions each, with your best score; a STAR story bank with theme coverage; history with averages per round type |
| Companies | Local employer tiers (with the problem level each one needs) and an application tracker |
| Settings | 9 themes, accent colour, text size, density, code colours (Visual Studio Dark, or matching the theme), main language, plan start date, problem level, export / import |
| Search | **Ctrl+K** (or **/**) searches problems, lessons, patterns, assessments and your stories |

Old bookmarks (`#/today`, `#/refreshers/...`, `#/solutions/...`, `#/practice/...`) still open the matching new page.

### Run tests

Every problem has 3-6 test inputs (`data/tests.js`). **Run tests** runs your `Solution` and the reference
solution on each one and compares the results, so expected answers never need to be stored or shown.
Linked lists, trees, graphs and design problems (LRU cache, Trie...) are built and compared the way
LeetCode does; problems whose answer can come in any order are compared ignoring order.

Once every test passes, a **speed test** times your solution on a large input at LeetCode's stated
size limit. It passes if it finishes within 20x the reference solution's time (at least 2 seconds),
which catches a wrong complexity (O(n^2) where O(n) is expected) without failing a solution that is
only a little slower. Python runs in a background worker (`js/pyworker.js`), so a slow or endless
solution is stopped instead of freezing the page. Problems where timing can't tell approaches apart
(binary search, fixed-size boards, tiny limits) say so instead of showing a speed test.

The speed test needs the app served over http (`python -m http.server`); opened as a file,
Run tests still checks correctness.

### Problems in Java and C#

With Java or C# as the main language (Settings, or the switch in the Learn sidebar), the workspace follows it:
a LeetCode-style starter with the method signatures the tests use, the Solution tab in that language, and
your code saved separately per language (switching back and forth loses nothing). The browser can't compile
Java or C#, so instead of Run tests there's a **Check your answer** card: each test input with the expected
output (worked out by the Python reference) to trace your code against, plus a link to run it on LeetCode.
The practical problems add the Java / C# signatures under their statement.

Every Java and C# solution is checked against the same tests as the Python ones:

```bash
python tools/verify/verify.py            # both languages; add java or cs for one, --only slug,slug for a few problems
```

It needs Chrome, a JDK and the .NET 8 SDK. It reads the app's data in headless Chrome, gets the expected
answers from the Python reference with the app's own harness, compiles every solution with a small runner
(`tools/verify/java`, `tools/verify/csharp`) and compares results the way Run tests does. Build output goes
to `tools/verify/build/` (git-ignored). Run it after changing a solution, a test or `HARNESS_PY`.

Python exercises are auto-graded in the browser via [Pyodide](https://pyodide.org) (about 10 MB from a
CDN, fetched in the background when you open a problem or a Python lesson, then kept by the service worker).
They run in the same background worker, so an endless loop is stopped after 15 seconds. Java and C# exercises are self-checked: each has sample cases and a reference
solution, plus links to online compilers.

## Files

```
index.html          the page: top bar, script order, Content Security Policy
sw.js               service worker: offline copy and fast repeat visits
css/style.css       design system and the 9 themes
js/                 app logic
js/vendor/          highlight.js core + Python / Java / C# (unmodified copies)
data/               content: plain data in globals, no logic
data/lessons/       language, Big-O and data-structure lessons
data/solutions/     reference solutions
research/           source data for the company lists
tools/verify/       checks the Java and C# solutions against the tests (not part of the app)
```

| File | Contents |
| --- | --- |
| `js/theme-init.js` | Applies the saved theme before first paint (loaded in `<head>`) |
| `js/app.js` | State (load, save, checking imported backups), views and logic: Home, the Learn path, Problems, Roadmap, Companies, Settings |
| `js/workspace.js` | The problem workspace: the Prompt / Hints / Solution / Video tabs, the editor side, the timer, the Pyodide loader, and `loadContent()`, which fetches the solutions, prompts and tests the first time a page needs them |
| `js/checker.js`, `js/pyworker.js` | Run tests and lesson exercises: the Python test harness, the background worker (one job at a time), starter code and the results panel |
| `js/codecolors.js`, `js/highlight.js` | Visual Studio Dark+ / Light+ syntax colours for code blocks and the editors. Tokens come from [highlight.js](https://highlightjs.org) 11.9.0, self-hosted in `js/vendor/highlight/` with only the three languages the app shows (checked against cdnjs's published hashes) |
| `js/nav.js` | Top navigation, the Interview sub-tabs and `go()` |
| `js/router.js` | URL routing (`#/learn/py:basics`, `#/problems/two-sum`...): refresh, Back/Forward and bookmarks |
| `js/search.js` | Search index (problems and their summaries, lessons, patterns, assessments, your stories) and the Ctrl+K dialog |
| `js/interview.js` | Mock interviews, assessments, behavioural question bank, STAR story bank and mock history |
| `data/data.js` | Roadmap weeks, problem list, pattern notes, company tiers, mock tips, the assessments |
| `data/prompts.js` | A short summary, an example output and two hints for every problem, in our own words (the full statement stays on LeetCode), plus the full statements of the practical problems |
| `data/tests.js` | Test inputs and speed-test inputs for every problem |
| `data/faang.js`, `research/faang-top250.csv` | The company lists: the FAANG Top 250 ranking (rank and Meta / Amazon / Google frequency, generated from the research CSV) and the OpenAI and Anthropic lists with their sources |
| `data/videos.js` | YouTube video IDs (each verified for channel and title) |
| `data/lessons/principles.js` | Programming Principles: the 15 lessons, their Python / Java / C# code and quizzes |
| `data/lessons/refresher.js`, `data/lessons/langlessons.js` | Python, Java and C# lessons and exercises |
| `data/lessons/bigo.js`, `data/lessons/datastructures.js` | Big-O and data-structure content |
| `data/solutions/solutions1-4.js` | Python solutions and the approach text for every problem (`solutions4.js` holds the ones added for the company lists) |
| `data/solutions/java.js`, `data/solutions/csharp.js` | Java and C# solutions for every problem (`addLang(lang, slug, code)`), loaded only when the main language needs them |

Scripts load in the order listed in `index.html`: content first, then the app, with `js/app.js` last.
`data/solutions/*`, `data/prompts.js` and `data/tests.js` (about 325 KB) aren't in that list: they load on
demand (`CONTENT_FILES` in `js/workspace.js`), so code must check `contentReady` before using `SOL`,
`TESTS`, `PROMPT` or `HINTS`. The Java and C# solutions (about 150 KB each) load separately through
`loadLangSolutions(lang)`, only for that main language.

When you add, rename or remove a file, update `SHELL` in `sw.js` too, so the offline copy stays complete.
The Content Security Policy in `index.html` only lets the page load its own files, Google Fonts,
jsdelivr (Pyodide) and YouTube; add a host there before loading anything new.

## Your data

Progress is stored in the browser's `localStorage` under `dsa-prep-v1`, including stories and mock
history. Use **Settings > Export** to back it up. An export from the combined Prep Hub app imports here too.
