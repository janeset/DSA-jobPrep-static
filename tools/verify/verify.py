"""Checks the Java and C# solutions against the same tests as the Python ones.

    python tools/verify/verify.py [java] [cs] [--only slug,slug]

1. Loads the app's own data files in headless Chrome and exports every problem's test spec and its
   Python / Java / C# solutions (so the data is read exactly as the app reads it).
2. Runs the Python reference on each test input with the app's own harness (HARNESS_PY in
   js/checker.js) to get the expected answers.
3. Compiles the Java and C# solutions together with a small runner (tools/verify/java, tools/verify/csharp)
   that builds the same inputs, calls each solution and prints what it returned.
4. Compares the answers with the app's own rules (same() in HARNESS_PY: any order, floats, random picks...).

Needs Chrome, a JDK (javac / java on PATH or in JAVA_HOME) and the .NET SDK (dotnet). Speed tests aren't
run: the app has no Java / C# runner, so only correctness matters here. Exit code 0 when everything passes.
"""
import base64, copy, functools, http.server, json, os, re, shutil, socket, struct, subprocess, sys, threading, time, urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.join(HERE, "build")
CHROME = os.environ.get("CHROME") or next((p for p in [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe", r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"] if os.path.exists(p)), None)


# ---------------- 1. export the data with headless Chrome ----------------
class _WS:
    """A minimal WebSocket client for the DevTools protocol (stdlib only)."""
    def __init__(self, url):
        host, path = url[5:].split("/", 1)
        h, p = host.split(":")
        self.s = socket.create_connection((h, int(p)))
        key = base64.b64encode(os.urandom(16)).decode()
        self.s.sendall(f"GET /{path} HTTP/1.1\r\nHost: {host}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n"
                       f"Sec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n".encode())
        buf = b""
        while b"\r\n\r\n" not in buf:
            buf += self.s.recv(4096)
        self.rest, self.n = buf.split(b"\r\n\r\n", 1)[1], 0

    def _read(self, k):
        while len(self.rest) < k:
            self.rest += self.s.recv(1 << 16)
        out, self.rest = self.rest[:k], self.rest[k:]
        return out

    def _recv(self):
        b1, b2 = self._read(2)
        n = b2 & 0x7F
        if n == 126: n = struct.unpack(">H", self._read(2))[0]
        elif n == 127: n = struct.unpack(">Q", self._read(8))[0]
        data = self._read(n)
        return json.loads(data) if (b1 & 0x0F) == 1 else {}

    def call(self, method, **params):
        self.n += 1
        data = json.dumps({"id": self.n, "method": method, "params": params}).encode()
        n = len(data)
        hdr = bytes([0x81]) + (bytes([0x80 | n]) if n < 126 else bytes([0x80 | 126]) + struct.pack(">H", n) if n < 65536 else bytes([0x80 | 127]) + struct.pack(">Q", n))
        mask = os.urandom(4)
        self.s.sendall(hdr + mask + bytes(b ^ mask[i % 4] for i, b in enumerate(data)))
        while True:
            msg = self._recv()
            if msg.get("id") == self.n:
                if "error" in msg:
                    raise RuntimeError(msg["error"])
                return msg.get("result", {})


EXPORT_JS = r"""(async () => {
  await loadContent();
  for (const lang of ["java", "cs"]) await loadLangSolutions(lang);
  return JSON.stringify(PROBLEMS.map((p) => ({ slug: p.s, title: p.t, spec: TESTS[p.s], m: methodName(SOL[p.s].c), py: SOL[p.s].c,
    java: SOL_LANG.java[p.s] || null, cs: SOL_LANG.cs[p.s] || null })));
})()"""


def export_data():
    if not CHROME:
        sys.exit("Chrome not found: set CHROME to its path.")

    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
        def handle(self):
            try: super().handle()
            except (ConnectionResetError, BrokenPipeError): pass

    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=ROOT))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0)); dbg = s.getsockname()[1]
    profile = os.path.join(os.environ.get("TEMP", "/tmp"), "dsa-verify-chrome")  # short: long profile paths break Chrome's caches
    shutil.rmtree(profile, ignore_errors=True)
    chrome = subprocess.Popen([CHROME, "--headless=new", "--disable-gpu", "--no-first-run", f"--user-data-dir={profile}",
                               f"--remote-debugging-port={dbg}", "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(100):
            try:
                tabs = json.load(urllib.request.urlopen(f"http://127.0.0.1:{dbg}/json")); break
            except Exception:
                time.sleep(0.1)
        ws = _WS(next(t for t in tabs if t["type"] == "page")["webSocketDebuggerUrl"])
        ws.call("Page.navigate", url=f"http://127.0.0.1:{srv.server_address[1]}/index.html#/home")
        time.sleep(1.5)
        r = ws.call("Runtime.evaluate", expression=EXPORT_JS, awaitPromise=True, returnByValue=True)
        if "exceptionDetails" in r:
            sys.exit("Export failed: " + json.dumps(r["exceptionDetails"])[:500])
        return json.loads(r["result"]["value"])
    finally:
        chrome.kill(); srv.shutdown()
        time.sleep(0.5)
        shutil.rmtree(profile, ignore_errors=True)


# ---------------- 2. expected answers from the Python reference ----------------
def load_harness():
    src = open(os.path.join(ROOT, "js", "checker.js"), encoding="utf-8").read()
    py = re.search(r"const HARNESS_PY = String\.raw`(.*?)\n`;", src, re.S).group(1)
    H = {"__name__": "harness"}
    exec(compile(py, "<HARNESS_PY>", "exec"), H)
    return H


def plainify(v):
    """JSON-friendly copy of a raw Python input (tuples become lists)."""
    if isinstance(v, (list, tuple)): return [plainify(x) for x in v]
    if isinstance(v, dict): return {k: plainify(x) for k, x in v.items()}
    return v


def expected(H, problems):
    cases = {}
    for p in problems:
        spec = dict(p["spec"], m=p["m"])
        rns = H["fresh_ns"](spec)
        exec(compile(p["py"], "<reference>", "exec"), rns)
        tests = []
        for src in spec["args"]:
            raw = eval("(" + src + ",)", H["input_globals"](1))
            try:
                exp, _ = H["call"](rns, spec, copy.deepcopy(raw))
                tests.append({"input": src, "raw": plainify(raw), "rawPy": raw, "exp": exp})
            except Exception as e:
                tests.append({"input": src, "raw": plainify(raw), "rawPy": raw, "refError": H["err_text"](e)})
        cases[p["slug"]] = {"spec": spec, "tests": tests}
    return cases


# ---------------- 3. compile and run one language ----------------
def pascal(name):
    return name[:1].upper() + name[1:]


def run_java(problems, cases):
    src_dir = os.path.join(BUILD, "java", "src"); out_dir = os.path.join(BUILD, "java", "classes")
    shutil.rmtree(os.path.join(BUILD, "java"), ignore_errors=True)
    os.makedirs(src_dir); os.makedirs(out_dir)
    shutil.copytree(os.path.join(HERE, "java", "verify"), os.path.join(src_dir, "verify"))
    index, offsets = [], {}
    for i, p in enumerate(problems):
        if not p["java"]: continue
        pkg = f"p{i}"
        kinds = (p["spec"].get("in") or []) + [p["spec"].get("out") or ""]
        node = ""
        if "rlist" in kinds:
            node = "\nclass Node {\n    public int val; public Node next; public Node random;\n    public Node(int val) { this.val = val; }\n}\n"
        elif "graph" in kinds:
            node = ("\nclass Node {\n    public int val; public List<Node> neighbors;\n    public Node() { neighbors = new ArrayList<>(); }\n"
                    "    public Node(int v) { val = v; neighbors = new ArrayList<>(); }\n"
                    "    public Node(int v, ArrayList<Node> n) { val = v; neighbors = n; }\n}\n")
        head = f"package {pkg};\nimport java.util.*;\nimport java.util.function.*;\nimport java.util.stream.*;\nimport verify.*;\n{node}\n"
        offsets[pkg] = head.count("\n")  # so compile errors can report the solution's own line numbers
        # LeetCode accepts "public class Codec" next to anything; javac wants one public class per file named
        # after it, so top-level classes become package-private here (the runner uses reflection anyway).
        code = head + re.sub(r"^public (?=(?:final |abstract )?(?:class|interface|enum|record) )", "", p["java"], flags=re.M) + "\n"
        os.makedirs(os.path.join(src_dir, pkg))
        open(os.path.join(src_dir, pkg, "Solution.java"), "w", encoding="utf-8").write(code)
        index.append({"slug": p["slug"], "ns": pkg, "offset": offsets[pkg], "spec": cases[p["slug"]]["spec"], "tests": [t["raw"] for t in cases[p["slug"]]["tests"]]})
    files =[os.path.join(dp, f) for dp, _, fs in os.walk(src_dir) for f in fs if f.endswith(".java")]
    javac = shutil.which("javac") or os.path.join(os.environ.get("JAVA_HOME", ""), "bin", "javac")
    java = shutil.which("java") or os.path.join(os.environ.get("JAVA_HOME", ""), "bin", "java")
    argfile = os.path.join(BUILD, "java", "files.txt")
    open(argfile, "w", encoding="utf-8").write("\n".join('"' + f.replace("\\", "/") + '"' for f in files))
    r = subprocess.run([javac, "-encoding", "UTF-8", "-nowarn", "-d", out_dir, "@" + argfile], capture_output=True, text=True)
    compile_errors = {}
    for m in re.finditer(r"[/\\](p\d+)[/\\]Solution\.java:(\d+): error: (.*)", r.stdout + r.stderr):
        slug = problems[int(m.group(1)[1:])]["slug"]
        compile_errors.setdefault(slug, []).append(f"line {int(m.group(2)) - offsets[m.group(1)]}: {m.group(3)}")
    if r.returncode and not compile_errors:
        print(r.stdout + r.stderr); sys.exit("javac failed in the runner itself")
    if compile_errors:
        return {"compile": compile_errors}
    jobs = os.path.join(BUILD, "java", "jobs.json")
    json.dump(index, open(jobs, "w", encoding="utf-8"))
    r = subprocess.run([java, "-Xss64m", "-cp", out_dir, "verify.Runner", jobs], capture_output=True, text=True, encoding="utf-8")
    if r.returncode:
        print(r.stdout[-3000:], r.stderr[-3000:]); sys.exit("Java runner crashed")
    return {"results": json.loads(r.stdout)}


def run_cs(problems, cases):
    proj = os.path.join(BUILD, "cs")
    shutil.rmtree(proj, ignore_errors=True)
    shutil.copytree(os.path.join(HERE, "csharp"), proj)
    index = []
    for i, p in enumerate(problems):
        if not p["cs"]: continue
        ns = f"P{i}"
        kinds = (p["spec"].get("in") or []) + [p["spec"].get("out") or ""]
        node = ""
        if "rlist" in kinds:
            node = "public class Node { public int val; public Node next; public Node random; public Node(int _val) { val = _val; next = null; random = null; } }\n"
        elif "graph" in kinds:
            node = ("public class Node { public int val; public IList<Node> neighbors;\n  public Node() { val = 0; neighbors = new List<Node>(); }\n"
                    "  public Node(int _val) { val = _val; neighbors = new List<Node>(); }\n"
                    "  public Node(int _val, List<Node> _neighbors) { val = _val; neighbors = _neighbors; } }\n")
        code = (f"using System;\nusing System.Collections.Generic;\nusing System.Linq;\nusing System.Text;\nusing Verify;\n"
                f"namespace {ns} {{\n{node}#line 1 \"{ns}.cs\"\n{p['cs']}\n#line default\n}}\n")  # line numbers count from the solution's first line
        open(os.path.join(proj, f"{ns}.cs"), "w", encoding="utf-8").write(code)
        index.append({"slug": p["slug"], "ns": ns, "spec": cases[p["slug"]]["spec"], "tests": [t["raw"] for t in cases[p["slug"]]["tests"]]})
    r = subprocess.run(["dotnet", "build", proj, "-c", "Release", "-nologo", "-v", "q", "-clp:NoSummary"], capture_output=True, text=True)
    errs = {}
    for m in re.finditer(r"^(\S+?)\((\d+),\d+\): error (\w+): (.*?) \[", r.stdout, re.M):
        name = m.group(1).replace("\\", "/").split("/")[-1]
        slug = problems[int(name[1:-3])]["slug"] if re.fullmatch(r"P\d+\.cs", name) else name
        errs.setdefault(slug, []).append(f"line {m.group(2)}: {m.group(3)} {m.group(4)}")
    if r.returncode and not errs:
        print(r.stdout[-4000:]); sys.exit("dotnet build failed in the runner itself")
    if errs:
        return {"compile": errs}
    jobs = os.path.join(proj, "jobs.json")
    json.dump(index, open(jobs, "w", encoding="utf-8"))
    r = subprocess.run(["dotnet", "run", "--project", proj, "-c", "Release", "--no-build", "--", jobs], capture_output=True, text=True, encoding="utf-8")
    if r.returncode:
        print(r.stdout[-3000:], r.stderr[-3000:]); sys.exit("C# runner crashed")
    return {"results": json.loads(r.stdout)}


# ---------------- 4. compare ----------------
def compare(H, cases, out, lang):
    if "compile" in out:
        for slug, es in out["compile"].items():
            print(f"  COMPILE {slug}: " + " | ".join(es[:3]))
        return len(out["compile"]), 0
    bad = 0
    for slug, results in out["results"].items():
        c = cases[slug]
        for t, r in zip(c["tests"], results):
            if "refError" in t:
                continue
            if "error" in r:
                print(f"  ERROR   {slug}  input {t['input'][:60]}: {r['error'][:200]}"); bad += 1; continue
            ok = False
            try:
                ok = bool(H["same"](r["got"], t["exp"], c["spec"], t["rawPy"]))
            except Exception as e:
                r["got"] = f"{r['got']} (compare failed: {e})"
            if not ok:
                print(f"  WRONG   {slug}  input {t['input'][:60]}\n          expected {H['show'](t['exp'])[:150]}\n          got      {json.dumps(r['got'])[:150]}")
                bad += 1
    return bad, sum(len(v) for v in out["results"].values())


def main():
    args = sys.argv[1:]
    only = set()
    if "--only" in args:
        i = args.index("--only"); only = set(args[i + 1].split(",")); del args[i:i + 2]
    langs = [a for a in args if a in ("java", "cs")] or ["java", "cs"]
    os.makedirs(BUILD, exist_ok=True)
    print("Exporting data from the app...")
    problems = export_data()
    if only:
        problems = [p for p in problems if p["slug"] in only]
    H = load_harness()
    print(f"Running the Python reference on {sum(len(p['spec']['args']) for p in problems)} test inputs...")
    cases = expected(H, problems)
    failed = 0
    for lang in langs:
        have = [p for p in problems if p[lang]]
        missing = [p["slug"] for p in problems if not p[lang]]
        print(f"\n== {'Java' if lang == 'java' else 'C#'}: {len(have)} of {len(problems)} problems have a solution ==")
        if missing:
            print(f"  missing: {len(missing)} ({', '.join(missing[:8])}{'...' if len(missing) > 8 else ''})")
        if not have:
            continue
        out = (run_java if lang == "java" else run_cs)(problems, cases)
        bad, total = compare(H, cases, out, lang)
        failed += bad
        if "compile" in out:
            print(f"  {len(out['compile'])} solutions don't compile")
        else:
            print(f"  {total - bad} / {total} test cases pass")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
