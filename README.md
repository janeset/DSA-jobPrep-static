# DSA Prep

Data structures and algorithms prep for coding interviews at software jobs around Toronto and
Kitchener-Waterloo: a 12-week plan, one pattern family at a time. No build step, no backend:
plain HTML, CSS and JavaScript. One of four Job Preps apps, each in its own repo: DSA Prep, Cloud Prep, AI / LLM Prep and System Design Prep.

## Run it

```bash
python -m http.server 5174
```

Then visit http://localhost:5174. Opening `index.html` directly also works, but embedded videos need a server.

## What's inside

The app is organised as three steps, numbered in the nav: **1. Learn**, then **2. Problems** to
practise what you learned, then the **3. Roadmap** that paces it all over 12 weeks.

| Page | What it does |
| --- | --- |
| Home | Landing page: how the app works, the three steps with your progress on each, today's problems and reviews due, and a welcome note on your first visit |
| 1. Learn | One path through the sidebar: your main language's refresher (Python, Java or C#), Big-O (growth calculator + quiz), the Data Structures Crash Course (an overview plus 13 numbered lessons), then the algorithm patterns. Each pattern ends with "Practise this pattern". Other languages and full courses are extras |
| 2. Problems | 269 problems: 265 from LeetCode plus 4 practical problems written for this app, grouped by pattern, filtered by level (Core / Mid / Stretch). A grid of pattern cards on top shows progress per pattern and filters the list. The **company filter** shows the **FAANG Top 250** (in rank order, the problems Google, Amazon and Meta asked most in the last six months, each marked "FAANG #n"), **OpenAI** (LeetCode's OpenAI tags plus practical problems) and **Anthropic** (from candidate reports, unverified). The practical problems (an in-memory database built in stages, a web crawler, stack samples to trace events, a greedy tokenizer) have their full statement in the workspace instead of a LeetCode link. Each problem opens a split-screen workspace: **Prompt / Hints / Solution / Video** tabs on the left (a short summary with an example, three hints opened one at a time, and the solution and video locked until you reveal them); the Python editor (Pyodide) with **Run tests** (see below) on the right, plus an interview timer and attempt logging with spaced repetition. A scratchpad is there for experiments |
| 3. Roadmap | 12 weeks, one pattern family at a time, with each week's patterns to learn first and its problems and solutions |
| Interview | Timed mock interviews (coding problems from your due reviews plus a behavioural round) with self-scoring and notes; seven fixed **Assessments** (Warm-up, Standard, Mid-size & startups, FAANG favourites, OpenAI-style, Anthropic-style, Big tech) of 2-3 timed coding questions each, with your best score; a STAR story bank with theme coverage; history with averages per round type |
| Companies | Local employer tiers (with the problem level each one needs) and an application tracker |
| Settings | 9 themes, accent colour, text size, density, code colours (Visual Studio Dark, or matching the theme), main language, plan start date, problem level, export / import |
| Search | **Ctrl+K** (or **/**) searches problems, lessons, patterns, assessments and your stories |

Old bookmarks (`#/today`, `#/refreshers/...`, `#/solutions/...`, `#/practice/...`) still open the matching new page.

### Run tests

Every problem has 3-6 test inputs (`tests.js`). **Run tests** runs your `Solution` and the reference
solution on each one and compares the results, so expected answers never need to be stored or shown.
Linked lists, trees, graphs and design problems (LRU cache, Trie...) are built and compared the way
LeetCode does; problems whose answer can come in any order are compared ignoring order.

Once every test passes, a **speed test** times your solution on a large input at LeetCode's stated
size limit. It passes if it finishes within 20x the reference solution's time (at least 2 seconds),
which catches a wrong complexity (O(n^2) where O(n) is expected) without failing a solution that is
only a little slower. Python runs in a background worker (`pyworker.js`), so a slow or endless
solution is stopped instead of freezing the page. Problems where timing can't tell approaches apart
(binary search, fixed-size boards, tiny limits) say so instead of showing a speed test.

The speed test needs the app served over http (`python -m http.server`); opened as a file,
Run tests still checks correctness.

Python exercises are auto-graded in the browser via [Pyodide](https://pyodide.org) (loaded from a
CDN on first run). Java and C# exercises are self-checked: each has sample cases and a reference
solution, plus links to online compilers.

## Files

| File | Contents |
| --- | --- |
| `index.html`, `style.css`, `app.js` | App shell, design system / themes, views and logic (Home, the Learn path, Problems, Roadmap, Companies, Settings) |
| `workspace.js` | The problem workspace: the Prompt / Hints / Solution / Video tabs, the editor side, the timer and the Pyodide loader |
| `prompts.js` | A short summary, an example output and two hints for every problem, in our own words (the full statement stays on LeetCode), plus the full statements of the practical problems |
| `tests.js` | Test inputs and speed-test inputs for every problem |
| `codecolors.js` | Visual Studio Dark+ / Light+ syntax colours for code blocks and the editors (tokens from [highlight.js](https://highlightjs.org), loaded from a CDN) |
| `checker.js`, `pyworker.js` | Run tests: the Python test harness, the background worker, starter code and the results panel |
| `nav.js` | Top navigation, the Interview sub-tabs and `go()` |
| `data.js` | Roadmap weeks, problem list, pattern notes, company tiers, mock tips, the four assessments |
| `solutions1-4.js` | Python solutions for every problem (`solutions4.js` holds the ones added for the company lists) |
| `faang.js`, `research/faang-top250.csv` | The company lists: the FAANG Top 250 ranking (rank and Meta / Amazon / Google frequency, generated from the research CSV) and the OpenAI and Anthropic lists with their sources |
| `refresher.js`, `langlessons.js` | Python, Java and C# lessons and exercises |
| `bigo.js`, `datastructures.js` | Big-O and data-structure content |
| `videos.js` | YouTube video IDs (each verified for channel and title) |
| `interview.js` | Mock interviews, assessments, behavioural question bank, STAR story bank and mock history |
| `router.js` | URL routing (`#/learn/py:basics`, `#/problems/two-sum`...): refresh, Back/Forward and bookmarks |
| `search.js` | Search index (problems and their summaries, lessons, patterns, assessments, your stories) and the Ctrl+K dialog |

## Your data

Progress is stored in the browser's `localStorage` under `dsa-prep-v1`, including stories and mock
history. Use **Settings > Export** to back it up. An export from the combined Prep Hub app imports here too.
