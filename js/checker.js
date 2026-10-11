"use strict";
// Run tests for the problem workspace: checks your Solution against the inputs in tests.js
// (expected answers come from the reference solution in SOL), then times it on a large input.
// Python runs in a worker (js/pyworker.js) so a slow or endless solution can be stopped. Opened as
// a file (file://) workers aren't allowed, so it falls back to the page's own Python and skips
// the speed test. Loaded before app.js; uses app.js globals (S, views, SOL, esc, ensurePy...) at call time.

// ---------------- the Python side ----------------
const HARNESS_PY = String.raw`
import json, time, random, math, sys, copy, itertools, functools, collections, heapq, bisect, string, re, traceback
sys.setrecursionlimit(20000)  # LeetCode-like headroom for recursive solutions
from typing import List, Optional, Dict, Set, Tuple

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
    def __repr__(self):
        return "ListNode(%r)" % (self.val,)

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
    def __repr__(self):
        return "TreeNode(%r)" % (self.val,)

class RandomNode:
    def __init__(self, x=0, next=None, random=None):
        self.val = int(x)
        self.next = next
        self.random = random

class GraphNode:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

class NestedInteger:
    def __init__(self, value):
        self._v = value
    def isInteger(self):
        return not isinstance(self._v, list)
    def getInteger(self):
        return None if isinstance(self._v, list) else self._v
    def getList(self):
        return self._v if isinstance(self._v, list) else None
    def __repr__(self):
        return repr(self._v)

def mk_nested(a):
    return [NestedInteger(mk_nested(x) if isinstance(x, list) else x) for x in a]

PRELUDE = dict(ListNode=ListNode, TreeNode=TreeNode, NestedInteger=NestedInteger, List=List, Optional=Optional, Dict=Dict, Set=Set, Tuple=Tuple,
               collections=collections, heapq=heapq, bisect=bisect, math=math, itertools=itertools, functools=functools,
               deque=collections.deque, defaultdict=collections.defaultdict, Counter=collections.Counter, inf=math.inf)

def fresh_ns(spec):
    ns = {"__name__": "solution"}
    ns.update(PRELUDE)
    ns["Node"] = GraphNode if "graph" in (spec.get("in") or []) else RandomNode
    return ns

# ---- building inputs and reading outputs ----
def mk_list(a):
    head = cur = ListNode()
    for v in a:
        cur.next = ListNode(v)
        cur = cur.next
    return head.next

def list_out(h):
    out = []
    while h is not None:
        out.append(h.val)
        h = h.next
        if len(out) > 2000000:
            raise ValueError("the returned list loops forever (it has a cycle)")
    return out

def mk_tree(a):
    if not a or a[0] is None:
        return None
    root = TreeNode(a[0])
    q, i = collections.deque([root]), 1
    while q and i < len(a):
        node = q.popleft()
        if i < len(a) and a[i] is not None:
            node.left = TreeNode(a[i])
            q.append(node.left)
        i += 1
        if i < len(a) and a[i] is not None:
            node.right = TreeNode(a[i])
            q.append(node.right)
        i += 1
    return root

def tree_out(root):
    out, q = [], collections.deque([root])
    while q:
        n = q.popleft()
        if n is None:
            out.append(None)
            continue
        out.append(n.val)
        q.append(n.left)
        q.append(n.right)
        if len(out) > 4000000:
            raise ValueError("the returned tree loops forever (a node points back up)")
    while out and out[-1] is None:
        out.pop()
    return out

def mk_cycle(vals, pos):
    nodes = [ListNode(v) for v in vals]
    for x, y in zip(nodes, nodes[1:]):
        x.next = y
    if pos >= 0 and nodes:
        nodes[-1].next = nodes[pos]
    return nodes[0] if nodes else None

def mk_rlist(pairs):
    nodes = [RandomNode(v) for v, _ in pairs]
    for x, y in zip(nodes, nodes[1:]):
        x.next = y
    for n, (_, r) in zip(nodes, pairs):
        n.random = nodes[r] if r is not None else None
    return nodes

def rlist_out(head, orig):
    nodes, cur = [], head
    while cur is not None:
        if id(cur) in orig:
            raise ValueError("the copy reuses nodes from the original list; create new nodes")
        nodes.append(cur)
        cur = cur.next
        if len(nodes) > 1000000:
            raise ValueError("the returned list loops forever (it has a cycle)")
    idx = {id(n): i for i, n in enumerate(nodes)}
    out = []
    for n in nodes:
        if n.random is not None and id(n.random) in orig:
            raise ValueError("a random pointer in the copy points into the original list")
        out.append([n.val, idx.get(id(n.random)) if n.random is not None else None])
    return out

def mk_graph(adj):
    if not adj:
        return None, set()
    nodes = [GraphNode(i + 1) for i in range(len(adj))]
    for n, nb in zip(nodes, adj):
        n.neighbors = [nodes[j - 1] for j in nb]
    return nodes[0], set(map(id, nodes))

def graph_out(node, orig):
    if node is None:
        return []
    seen, q = {}, collections.deque([node])
    while q:
        n = q.popleft()
        if id(n) in orig:
            raise ValueError("the clone reuses nodes from the original graph; create new nodes")
        if n.val in seen:
            continue
        seen[n.val] = n
        for m in n.neighbors:
            if m.val not in seen:
                q.append(m)
    return [[m.val for m in seen[v].neighbors] for v in sorted(seen)]

def find(root, v):
    st = [root]
    while st:
        n = st.pop()
        if n is None:
            continue
        if n.val == v:
            return n
        st.append(n.left)
        st.append(n.right)
    return None

# helpers for large inputs
def balanced_bst(n):
    def build(lo, hi):
        if lo > hi:
            return None
        mid = (lo + hi) // 2
        return TreeNode(mid, build(lo, mid - 1), build(mid + 1, hi))
    return tree_out(build(1, n))

def pre_in(n):
    pre, ino = [], []
    def walk(x):
        if x is None:
            return
        pre.append(x.val)
        walk(x.left)
        ino.append(x.val)
        walk(x.right)
    walk(mk_tree(balanced_bst(n)))
    return (pre, ino)

def input_globals(seed):
    return dict(R=random.Random(seed), balanced_bst=balanced_bst, pre_in=pre_in, itertools=itertools)

def build_args(raw, spec, st):
    ins = spec.get("in") or []
    args, k = [], 0
    while k < len(raw):
        kind = ins[k] if k < len(ins) else None
        a = raw[k]
        if kind == "list":
            args.append(mk_list(a))
        elif kind == "tree":
            args.append(mk_tree(a))
        elif kind == "lists":
            args.append([mk_list(x) for x in a])
        elif kind == "cycle":
            args.append(mk_cycle(a, raw[k + 1]))
            k += 1
        elif kind == "rlist":
            nodes = mk_rlist(a)
            st["orig"] = set(map(id, nodes))
            args.append(nodes[0] if nodes else None)
        elif kind == "graph":
            node, st["orig"] = mk_graph(a)
            args.append(node)
        elif kind == "ref":
            args.append(find(args[0], a))
        else:
            args.append(a)
        k += 1
    return args

def plain(v):
    if isinstance(v, tuple):
        v = list(v)
    if isinstance(v, list):
        return [plain(x) for x in v]
    if isinstance(v, (ListNode, TreeNode, RandomNode, GraphNode)):
        raise ValueError("returned a %s, but this problem expects a plain value" % type(v).__name__)
    return v

def conv_out(v, kind, st):
    if kind == "list":
        return list_out(v)
    if kind == "tree":
        return tree_out(v)
    if kind == "rlist":
        return rlist_out(v, st.get("orig", set()))
    if kind == "graph":
        return graph_out(v, st.get("orig", set()))
    if kind == "val":
        return None if v is None else v.val
    return plain(v)

def call(ns, spec, raw):
    """Runs one test; returns (output, seconds spent inside the solution)."""
    if spec.get("design") == "codec":
        C = ns.get("Codec")
        if C is None:
            raise NameError("define a class named Codec")
        root = mk_tree(raw[0])
        t = time.perf_counter()
        res = C().deserialize(C().serialize(root))
        dt = time.perf_counter() - t
        return tree_out(res), dt
    if spec.get("design"):
        ops, params = raw[0], raw[1]
        cls = ns.get(ops[0])
        if cls is None:
            raise NameError("define a class named %s" % ops[0])
        t = time.perf_counter()
        obj = cls(*params[0])
        res = [None]
        for op, p in zip(ops[1:], params[1:]):
            fn = getattr(obj, op, None)
            if fn is None:
                raise AttributeError("%s needs a method named %s" % (ops[0], op))
            res.append(fn(*p))
        dt = time.perf_counter() - t
        return plain(res), dt
    if spec.get("api") == "nestediter":
        C = ns.get("NestedIterator")
        if C is None:
            raise NameError("define a class named NestedIterator")
        t = time.perf_counter()
        it, res = C(mk_nested(raw[0])), []
        while it.hasNext():
            res.append(it.next())
            if len(res) > 10**5:
                raise RuntimeError("hasNext() kept returning True")
        return res, time.perf_counter() - t
    if spec.get("api") == "strcodec":
        C = ns.get("Codec")
        if C is None:
            raise NameError("define a class named Codec")
        t = time.perf_counter()
        enc = C().encode(raw[0])
        if not isinstance(enc, str):
            raise TypeError("encode must return a single string, not %s" % type(enc).__name__)
        res = C().decode(enc)
        return plain(res), time.perf_counter() - t
    if spec.get("api") == "badversion":
        bad = raw[1]
        ns["isBadVersion"] = lambda v: v >= bad
        raw = raw[:1]
    st = {}
    args = build_args(raw, spec, st)
    sol = ns.get("Solution")
    if sol is None:
        raise NameError("define a class named Solution")
    fn = getattr(sol(), spec["m"], None)
    if fn is None:
        raise AttributeError("Solution needs a method named %s" % spec["m"])
    t = time.perf_counter()
    v = fn(*args)
    dt = time.perf_counter() - t
    cmp = spec.get("cmp", "")
    if cmp.startswith("inplace"):
        idx = int(cmp[7:] or 0)
        kinds = spec.get("in") or []
        return conv_out(args[idx], kinds[idx] if idx < len(kinds) else None, st), dt
    if cmp in ("k", "ksort"):
        return [v, plain(args[0][:v]) if isinstance(v, int) else None], dt
    return conv_out(v, spec.get("out"), st), dt

# ---- comparing ----
def close(a, b):
    if isinstance(a, list) and isinstance(b, list):
        return len(a) == len(b) and all(close(x, y) for x, y in zip(a, b))
    if isinstance(a, (int, float)) and isinstance(b, (int, float)) and not isinstance(a, bool) and not isinstance(b, bool):
        return abs(a - b) <= 1e-5 * max(1, abs(b))
    return a == b

def same(got, exp, spec, raw):
    cmp = spec.get("cmp", "")
    if cmp == "weighted":
        w, picks = raw[1][0][0], got[1:] if isinstance(got, list) else None
        if not picks or len(picks) != len(raw[0]) - 1 or not all(isinstance(i, int) and 0 <= i < len(w) for i in picks):
            return False
        return all(abs(picks.count(i) / len(picks) - w[i] / sum(w)) <= 0.04 for i in range(len(w)))
    if cmp == "freqsort":
        s = raw[0]
        if not isinstance(got, str) or sorted(got) != sorted(s):
            return False
        runs = [len(list(g)) for _, g in itertools.groupby(got)]
        return len(runs) == len(set(got)) and all(runs[i] >= runs[i + 1] for i in range(len(runs) - 1))
    if cmp == "randset":
        if not isinstance(got, list) or len(got) != len(exp):
            return False
        cur, picks = set(), {}
        for op, p, g, e in zip(raw[0][1:], raw[1][1:], got[1:], exp[1:]):
            if op == "getRandom":
                if g not in cur:
                    return False
                picks.setdefault(frozenset(cur), []).append(g)
                continue
            if g != e:
                return False
            if e and op == "insert":
                cur.add(p[0])
            elif e and op == "remove":
                cur.discard(p[0])
        return all(abs(ps.count(x) / len(ps) - 1 / len(st)) <= 0.05 for st, ps in picks.items() if len(ps) >= 300 for x in st)
    if cmp == "balbst":
        vals = []
        def height(n):
            if not n:
                return 0
            l = height(n.left)
            vals.append(n.val)
            r = height(n.right)
            return -1 if l < 0 or r < 0 or abs(l - r) > 1 else 1 + max(l, r)
        return isinstance(got, list) and height(mk_tree(got)) >= 0 and vals == list(raw[0])
    if cmp == "reorg":
        s = raw[0]
        if exp == "":
            return got == ""
        return isinstance(got, str) and sorted(got) == sorted(s) and all(got[i] != got[i + 1] for i in range(len(got) - 1))
    if cmp == "ksort":
        return isinstance(got[1], list) and got[0] == exp[0] and sorted(got[1]) == sorted(exp[1])
    if cmp == "float" or spec.get("design") is True:
        return close(got, exp)
    if cmp == "sort":
        return isinstance(got, list) and sorted(got, key=repr) == sorted(exp, key=repr)
    if cmp == "sortall":
        if not isinstance(got, list) or not all(isinstance(x, list) for x in got):
            return False
        norm = lambda x: sorted((sorted(i, key=repr) for i in x), key=repr)
        return norm(got) == norm(exp)
    if cmp == "topo":
        n, pre = raw[0], raw[1]
        if exp == []:
            return got == []
        if not isinstance(got, list) or sorted(got) != list(range(n)):
            return False
        pos = {c: i for i, c in enumerate(got)}
        return all(pos[b] < pos[a] for a, b in pre)
    if cmp == "peak":
        a = raw[0]
        return isinstance(got, int) and 0 <= got < len(a) and (got == 0 or a[got - 1] < a[got]) and (got == len(a) - 1 or a[got] > a[got + 1])
    if cmp == "pal":
        s = raw[0]
        return isinstance(got, str) and got in s and got == got[::-1] and len(got) == len(exp)
    return got == exp

def err_text(e):
    if isinstance(e, SyntaxError):
        return "SyntaxError: %s (line %s)" % (e.msg, e.lineno)
    tb = traceback.extract_tb(e.__traceback__)
    line = next((f.lineno for f in reversed(tb) if f.filename == "<your code>"), None)
    msg = "%s: %s" % (type(e).__name__, e)
    if isinstance(e, RecursionError):
        msg += ". The recursion goes too deep for Python here; try an iterative version or an explicit stack."
    return msg + (" (line %d)" % line if line else "")

def show(v):
    try:
        s = json.dumps(v)
    except Exception:
        s = repr(v)
    return s if len(s) <= 600 else s[:600] + " ..."

STATE = {}

def run_tests(payload):
    p = json.loads(payload)
    spec = p["spec"]
    STATE.clear()
    STATE["spec"] = spec
    out = {"results": []}
    uns = fresh_ns(spec)
    try:
        exec(compile(p["user"], "<your code>", "exec"), uns)
    except Exception as e:
        out["compile"] = err_text(e)
        return json.dumps(out)
    rns = fresh_ns(spec)
    exec(compile(p["ref"], "<reference>", "exec"), rns)
    STATE["uns"], STATE["rns"] = uns, rns
    for src in spec["args"]:
        raw = eval("(" + src + ",)", input_globals(1))
        shown = show(list(raw))
        r = {"input": src, "shown": shown[1:-1] if shown.startswith("[") and shown.endswith("]") else shown}
        try:
            exp, _ = call(rns, spec, copy.deepcopy(raw))
        except Exception as e:
            r["refError"] = err_text(e)
            r["ok"] = False
            out["results"].append(r)
            continue
        r["expected"] = show(exp)
        try:
            got, _ = call(uns, spec, copy.deepcopy(raw))
            r["got"] = show(got)
            r["ok"] = bool(same(got, exp, spec, raw))
        except Exception as e:
            r["error"] = err_text(e)
            r["ok"] = False
        out["results"].append(r)
    return json.dumps(out)

def size_label(raw):
    sizes = [len(a) for a in raw if isinstance(a, (list, str))]
    if sizes:
        return "an input of %s items" % format(max(sizes), ",")
    nums = [a for a in raw if isinstance(a, (int, float)) and not isinstance(a, bool)]
    return "n = %s" % format(max(nums), ",") if nums else "a large input"

def big_ref():
    spec = STATE["spec"]
    raw = eval(spec["big"], input_globals(7))
    STATE["big"] = raw
    if spec.get("bigLabel"):
        label = spec["bigLabel"]
    elif spec.get("design") is True:
        label = "%s operations" % format(len(raw[0]) - 1, ",")
    else:
        label = size_label(raw)
    exp, dt = call(STATE["rns"], spec, copy.deepcopy(raw))
    STATE["bigExp"] = exp
    return json.dumps({"t": dt, "label": label})

def big_user():
    spec, raw = STATE["spec"], STATE["big"]
    try:
        got, dt = call(STATE["uns"], spec, copy.deepcopy(raw))
    except Exception as e:
        return json.dumps({"error": err_text(e)})
    return json.dumps({"t": dt, "ok": bool(same(got, STATE["bigExp"], spec, raw))})

def run_plain(code, spec_json):
    ns = fresh_ns(json.loads(spec_json))
    try:
        exec(compile(code, "<your code>", "exec"), ns)
    except Exception as e:
        print(err_text(e))

def run_fresh(code):
    """Lesson exercises: the code plus its asserts, in an empty namespace."""
    try:
        exec(compile(code, "<your code>", "exec"), {"__name__": "__main__"})
    except SyntaxError as e:
        return json.dumps({"err": err_text(e)})
    except Exception as e:
        return json.dumps({"err": "%s: %s" % (type(e).__name__, e)})
    return json.dumps({})
`;

// ---------------- running Python: a worker if we can, else the page ----------------
let pyw = null, pywReady = false, pywSeq = 0;
const pywWait = new Map();
const workerOk = () => typeof Worker !== "undefined" && location.protocol !== "file:";
function killWorker(reply) {
  if (pyw) pyw.terminate();
  pyw = null; pywReady = false;
  for (const [id, w] of pywWait) { clearTimeout(w.timer); w.resolve(Object.assign({ id }, reply)); }
  pywWait.clear();
}
function getWorker() {
  if (pyw) return pyw;
  pyw = new Worker("js/pyworker.js");
  pyw.onmessage = (e) => { const w = pywWait.get(e.data.id); if (w) { pywWait.delete(e.data.id); clearTimeout(w.timer); w.resolve(e.data); } };
  pyw.onerror = () => killWorker({ err: "Python couldn't start in the background (are you offline?)." });
  return pyw;
}
// Resolves { value, out } / { err, out } / { timeout: true } (the worker is stopped on timeout).
function pyCall(code, secs) {
  return new Promise((resolve) => {
    const w = getWorker(), id = ++pywSeq;
    const timer = setTimeout(() => killWorker({ timeout: true }), secs * 1000);
    pywWait.set(id, { resolve, timer });
    w.postMessage({ id, code });
  });
}
let mainHarness = false;
async function pyMain(code) {
  let out = "";
  try {
    const py = await ensurePy();
    py.setStdout({ batched: (t) => (out += t + "\n") });
    py.setStderr({ batched: (t) => (out += t + "\n") });
    if (!mainHarness) { await py.runPythonAsync(HARNESS_PY); mainHarness = true; }
    const v = await py.runPythonAsync(code);
    return { value: v === undefined || v === null ? null : String(v), out };
  } catch (e) { return { err: String(e.message || e), out }; }
}
// The harness has to be loaded into each new worker (the first load also downloads Python).
async function pyRun(code, secs) {
  if (!workerOk()) return pyMain(code);
  if (!pywReady) {
    const h = await pyCall(HARNESS_PY, 120);
    if (h.timeout) return { err: "Python took too long to load. Check your connection and try again." };
    if (h.err) return h;
    pywReady = true;
  }
  return pyCall(code, secs);
}
const pyStr = (s) => JSON.stringify(s); // a JSON string is also a valid Python string literal
// One Python job at a time: the worker keeps a single set of test state (the speed test reads what
// run_tests left), and a timeout stops the whole worker, so jobs mustn't overlap.
let pyQueue = Promise.resolve(), pyJobs = 0;
function pyExclusive(job) {
  pyJobs++;
  const p = pyQueue.then(job).finally(() => pyJobs--);
  pyQueue = p.catch(() => {});
  return p;
}
// Opening a problem or a Python lesson starts Python loading in the background (when the browser is
// idle), so the first Run doesn't sit through the 10 MB download. Once per page load; a failed load
// (offline) is retried by the next real run.
let pyWarm = false;
function warmPython() {
  if (pyWarm || !workerOk()) return;
  pyWarm = true;
  (window.requestIdleCallback || setTimeout)(() => pyExclusive(() => pyRun("None", 120)));
}
// Lesson exercises: resolves { out, err }. In the worker an endless loop is stopped after 15 seconds;
// opened as a file there's no worker, so it runs on the page as before.
function runFresh(code) {
  if (!workerOk()) return execPy(code, true);
  return pyExclusive(async () => {
    const r = await pyRun(`run_fresh(${pyStr(code)})`, 15);
    if (r.timeout) return { out: r.out || "", err: "Stopped after 15 seconds. Is there an infinite loop?" };
    if (r.err) return { out: r.out || "", err: r.err };
    return { out: (r.out || "").trimEnd(), err: JSON.parse(r.value).err || "" };
  });
}

// ---------------- starter code ----------------
// The method to test: the first public method of the reference Solution class.
const methodName = (ref) => { const i = ref.indexOf("class Solution"); const m = i < 0 ? null : /\n {4}def ([A-Za-z]\w*)\(self/.exec(ref.slice(i)); return m ? m[1] : ""; };
function providedNote(spec) {
  if (spec.api === "nestediter") return "# NestedInteger is provided: isInteger(), getInteger(), getList()\n";
  if (spec.api === "badversion") return "# isBadVersion(version) is provided: it returns True for the first bad version and every one after it.\n";
  const kinds = [...(spec.in || []), spec.out || ""];
  if (kinds.includes("rlist")) return "# Node is provided: Node(x, next=None, random=None)\n";
  if (kinds.includes("graph")) return "# Node is provided: Node(val=0, neighbors=None)\n";
  if (kinds.some((k) => ["list", "lists", "cycle"].includes(k))) return "# ListNode is provided: ListNode(val=0, next=None)\n";
  if (kinds.some((k) => ["tree", "ref"].includes(k)) || spec.design === "codec") return "# TreeNode is provided: TreeNode(val=0, left=None, right=None)\n";
  return "";
}
// The class and method signatures of the reference solution, with empty bodies.
function starterFor(p) {
  const ref = (SOL[p.s] || {}).c || "", spec = TESTS[p.s] || {}, out = [];
  ref.split("\n").forEach((ln) => {
    let m;
    if (/^class \w+/.test(ln)) out.push((out.length ? "\n" : "") + ln.trimEnd());
    else if ((m = /^ {4}def (\w+)\(self.*\):\s*$/.exec(ln)) && (!m[1].startsWith("_") || m[1] === "__init__")) out.push(ln.trimEnd(), "        pass");
  });
  return `# ${p.t}\n# ${isCustom(p.s) ? "Read the problem on the left" : "Read the problem on LeetCode"}, fill in the method, then press Run tests.\n${providedNote(spec)}\n${out.join("\n")}\n`;
}

// ---------------- running the tests ----------------
const fmtSecs = (s) => (s < 1 ? Math.max(1, Math.round(s * 1000)) + " ms" : s.toFixed(s < 10 ? 2 : 1) + " s");
async function runTests(slug) {
  const p = probBySlug(slug), spec = TESTS[slug], ref = SOL[slug];
  views._tr = views._tr || {};
  if (!spec || !ref || (views._tr[slug] && views._tr[slug].running)) return;
  const st = views._tr[slug] = { running: pyJobs && pywReady ? "Waiting for your other run to finish…" : "Loading Python (the first run downloads about 10 MB)…" };
  drawTests(slug);
  return pyExclusive(() => testJob(slug, st, p, spec, ref));
}
async function testJob(slug, st, p, spec, ref) {
  if (st.running.startsWith("Waiting")) { st.running = "Running the tests…"; drawTests(slug); }
  const payload = { spec: Object.assign({ m: methodName(ref.c) }, spec), user: S.code[slug] ?? starterFor(p), ref: ref.c };
  let r = await pyRun(`run_tests(${pyStr(JSON.stringify(payload))})`, 10);
  const done = () => { st.running = null; drawTests(slug); };
  if (r.timeout) { st.error = "Your code ran for more than 10 seconds on the small tests and was stopped. Look for an infinite loop."; return done(); }
  if (r.err) { st.error = r.err; return done(); }
  st.results = JSON.parse(r.value); st.out = r.out;
  const passed = !st.results.compile && st.results.results.every((x) => x.ok);
  if (!spec.big) { st.speed = { status: "none", msg: spec.fast || "" }; return done(); }
  if (!passed) { st.speed = { status: "skip" }; return done(); }
  if (!workerOk()) { st.speed = { status: "none", msg: "The speed test needs the app served over http (python -m http.server); opened as a file, only correctness is checked." }; return done(); }
  st.running = "Speed test: timing the reference solution on a large input…"; drawTests(slug);
  r = await pyRun("big_ref()", 60);
  if (r.timeout || r.err) { st.speed = { status: "none", msg: "The large input couldn't be prepared (" + (r.err || "timed out") + "), so there's no speed result this time." }; return done(); }
  const base = JSON.parse(r.value), limit = Math.max(2, 20 * base.t);
  st.running = `Speed test: running your solution on ${base.label} (limit ${fmtSecs(limit)})…`; drawTests(slug);
  r = await pyRun("big_user()", limit + 1.5);
  const sp = { label: base.label, tr: base.t, limit };
  if (r.timeout) st.speed = Object.assign(sp, { status: "slow" });
  else if (r.err) st.speed = Object.assign(sp, { status: "error", msg: r.err });
  else {
    const u = JSON.parse(r.value);
    if (u.error) st.speed = Object.assign(sp, { status: "error", msg: u.error });
    else st.speed = Object.assign(sp, { tu: u.t, status: !u.ok ? "wrong" : u.t > limit ? "slow" : "ok" });
  }
  done();
}

// Run: just execute the code (with ListNode / TreeNode available) and show what it prints.
async function runCode() {
  const slug = views._ws || "", code = $("#code").value, status = $("#py-status"), out = $("#out");
  S.code[slug] = code; save();
  status.textContent = "Running…";
  const r = await pyExclusive(() => pyRun(`run_plain(${pyStr(code)}, ${pyStr(JSON.stringify(TESTS[slug] || {}))})`, 15));
  if (!$("#out")) return;
  out.textContent = r.timeout ? (r.out || "") + "Stopped after 15 seconds. Is there an infinite loop?" : ((r.out || "") + (r.err || "")) || noOutputHint(slug);
  status.textContent = "Done.";
}
// Run only runs the file, so suggest a call to try, built from the first test's input.
function noOutputHint(slug) {
  const spec = TESTS[slug], ref = SOL[slug];
  if (!spec || !ref || spec.design || (spec.in || []).length) return "(no output: add print() calls to see values)";
  return `(no output: Run only runs your file. To try your method, add a line at the bottom like\nprint(Solution().${methodName(ref.c)}(${spec.args[0]}))\nor press Run tests to check it on every test.)`;
}

// ---------------- results ----------------
function drawTests(slug) {
  const box = $("#ws-tests");
  if (box && views._ws === slug) box.innerHTML = testsHtml(slug);
}
function testsHtml(slug) {
  const spec = TESTS[slug];
  if (!spec) return "";
  const st = (views._tr || {})[slug], n = spec.args.length;
  const head = `<div class="section-head"><h3>Tests</h3><span class="muted">${n} tests${spec.big ? " + a speed test" : ""}</span></div>`;
  if (!st) return head + `<p class="muted" style="margin:0">Run tests checks your solution on ${n} inputs${spec.big ? ", then times it on a large one" : ""}. Expected answers come from the reference solution, so you won't see it unless you reveal it below.</p>`;
  let html = head;
  if (st.running) html += `<div class="tests-running"><span class="spinner" aria-hidden="true"></span>${esc(st.running)}</div>`;
  if (st.error) html += `<div class="callout bad-callout">${esc(st.error)}</div>`;
  const res = st.results;
  if (res && res.compile) html += `<div class="callout bad-callout"><b>Your code didn't run.</b> ${esc(res.compile)}</div>`;
  else if (res) {
    const ok = res.results.filter((x) => x.ok).length;
    html += `<div class="tests-sum"><span class="badge ${ok === n ? "done" : "due"}">${ok} / ${n} passed</span></div>`;
    let opened = false;
    html += res.results.map((x, i) => {
      const open = !x.ok && !opened; if (open) opened = true;
      return `<details class="tc ${x.ok ? "ok" : "bad"}" ${open ? "open" : ""}><summary><span class="tc-mark">${x.ok ? "&#10003;" : "&#10007;"}</span>Test ${i + 1}<code class="tc-in">${esc(x.input.length > 90 ? x.input.slice(0, 90) + "…" : x.input)}</code></summary>
        <div class="tc-body"><div class="label">Input</div><pre>${esc(x.input)}</pre>
          ${x.refError ? `<div class="label">Problem with this test</div><pre>${esc(x.refError)}</pre>` : `<div class="label">Expected</div><pre>${esc(x.expected)}</pre>
          <div class="label">${x.error ? "Error" : "Your output"}</div><pre class="${x.ok ? "" : "M"}">${esc(x.error || x.got)}</pre>`}</div></details>`;
    }).join("");
  }
  const sp = st.speed;
  if (sp) {
    if (sp.status === "ok") html += `<div class="speed ok">&#10003; <b>Speed test passed:</b> ${esc(sp.label)} in ${fmtSecs(sp.tu)} (reference ${fmtSecs(sp.tr)}, limit ${fmtSecs(sp.limit)}).</div>`;
    else if (sp.status === "slow") html += `<div class="speed bad"><b>&#10007; Too slow:</b> on ${esc(sp.label)} your solution ${sp.tu ? `took ${fmtSecs(sp.tu)}` : `ran past ${fmtSecs(sp.limit)} and was stopped`} (reference ${fmtSecs(sp.tr)}). It gives right answers; look for an approach with a lower time complexity.</div>`;
    else if (sp.status === "wrong") html += `<div class="speed bad"><b>&#10007; Wrong answer on the large input</b> (${esc(sp.label)}), though the small tests passed. Think about edge cases that only show up at scale.</div>`;
    else if (sp.status === "error") html += `<div class="speed bad"><b>&#10007; Error on the large input</b> (${esc(sp.label)}): ${esc(sp.msg)}</div>`;
    else if (sp.status === "skip") html += `<p class="muted" style="margin:10px 0 0">The speed test runs once every test passes.</p>`;
    else if (sp.msg) html += `<p class="muted" style="margin:10px 0 0"><b>No speed test:</b> ${esc(sp.msg)}</p>`;
  }
  const allOk = res && !res.compile && res.results.every((x) => x.ok) && !st.running;
  if (allOk && (!sp || sp.status === "ok" || sp.status === "none")) {
    html += `<div class="callout good-callout"><b>All tests passed${sp && sp.status === "ok" ? ", including the speed test" : ""}.</b> Log the attempt so it comes back for review on schedule.
      <div class="row" style="margin-top:8px"><button class="btn small primary" data-log="${slug}">Log attempt</button></div></div>`;
  }
  if (st.out && st.out.trim()) html += `<details class="tc"><summary>Printed output</summary><pre>${esc(st.out)}</pre></details>`;
  return html;
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-runtests], [data-runcode], [data-starter]");
  if (!b) return;
  if (b.dataset.runtests !== undefined) { S.code[views._ws] = $("#code").value; save(); return runTests(views._ws); }
  if (b.dataset.runcode !== undefined) return runCode();
  if (b.dataset.starter !== undefined && confirm("Replace your code with the empty starter?")) { delete S.code[codeKey(views._ws)]; save(); delete (views._tr || {})[views._ws]; rerender(); }
});
