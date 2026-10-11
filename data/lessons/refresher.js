// Python refresher lessons. body is trusted HTML (written here). Exercise tests are Python asserts
// run against the learner's code in the browser (Pyodide).
// practice: good vs bad code pairs ({ why, bad, good }), shown after the example.
const LESSONS = [
  {
    id: "basics", title: "1. Basics: types, control flow, loops",
    body: `<p>Python is dynamically typed and indentation-based. Know the core types: <code>int, float, str, bool, list, tuple, dict, set, None</code>.</p>
      <ul><li><code>//</code> is floor division, <code>%</code> modulo, <code>**</code> power. <code>/</code> always returns a float.</li>
      <li>Falsy values: <code>0, "", [], {}, set(), None</code>. Prefer <code>if not items:</code> over <code>if len(items) == 0:</code>.</li>
      <li><code>for i in range(n)</code>, <code>for i, x in enumerate(xs)</code>, <code>for a, b in zip(xs, ys)</code>. Avoid indexing by <code>range(len(xs))</code> unless you need to.</li>
      <li><code>and</code>/<code>or</code> short-circuit. Chained comparisons work: <code>0 &lt;= i &lt; n</code>.</li></ul>`,
    example: `for i, x in enumerate(["a", "b", "c"], start=1):\n    print(i, x)\n\nprint(7 // 2, -7 // 2, 7 % 3, 2 ** 10)   # 3 -4 1 1024\nprint(bool([]), bool("0"), None is None)\n`,
    practice: [
      { why: "Empty collections are falsy, so `if not items:` says \"if it's empty\" directly, and works for any collection.",
        bad: `if len(items) == 0:
    print("nothing to do")`,
        good: `if not items:
    print("nothing to do")` },
      { why: "Tuple assignment swaps in one line, with no temporary variable to name or get wrong.",
        bad: `temp = a
a = b
b = temp`,
        good: `a, b = b, a` },
      { why: "Python chains comparisons, so a range check reads the way you'd write it in maths.",
        bad: `if x >= 0 and x < n:
    print("in range")`,
        good: `if 0 <= x < n:
    print("in range")` },
    ],
    exercises: [{
      prompt: "Write fizzbuzz(n) returning a list of strings for 1..n: 'Fizz' for multiples of 3, 'Buzz' for 5, 'FizzBuzz' for both, otherwise the number as a string.",
      starter: "def fizzbuzz(n):\n    pass\n",
      tests: `assert fizzbuzz(5) == ['1','2','Fizz','4','Buzz'], fizzbuzz(5)
assert fizzbuzz(15)[-1] == 'FizzBuzz'
assert fizzbuzz(0) == []`,
    }],
  },
  {
    id: "strings", title: "2. Strings",
    body: `<p>Strings are immutable sequences. Concatenating in a loop is O(n^2); build a list and <code>"".join(parts)</code>.</p>
      <ul><li>Slicing: <code>s[a:b:step]</code>, <code>s[::-1]</code> reverses.</li>
      <li>Useful methods: <code>split, join, strip, lower, startswith, find, replace, isalnum, isdigit</code>.</li>
      <li>f-strings: <code>f"{name}: {value:.2f}"</code>. <code>ord('a')</code> and <code>chr(97)</code> convert chars and codes.</li></ul>`,
    example: `s = "Hello, World"\nprint(s[::-1], s.lower().split(", "), s.find("World"))\nprint("-".join(["a", "b", "c"]), f"{3.14159:.2f}")\n`,
    practice: [
      { why: "`in` checks for a substring directly; `find` returns a position, and comparing it with -1 is easy to get wrong.",
        bad: `if text.find("error") != -1:
    alert()`,
        good: `if "error" in text:
    alert()` },
      { why: "An f-string puts values where they appear and converts them for you, so there's no `str()` or `+` to juggle.",
        bad: `msg = "Hi " + name + ", you have " + str(count) + " new messages"`,
        good: `msg = f"Hi {name}, you have {count} new messages"` },
      { why: "Slicing with a step of -1 reverses a string in one readable expression.",
        bad: `rev = ""
for c in s:
    rev = c + rev           # also O(n²): a new string each time`,
        good: `rev = s[::-1]` },
    ],
    exercises: [{
      prompt: "Write is_palindrome(s) that ignores case and non-alphanumeric characters (so 'A man, a plan, a canal: Panama' is True).",
      starter: "def is_palindrome(s):\n    pass\n",
      tests: `assert is_palindrome('A man, a plan, a canal: Panama') is True
assert is_palindrome('race a car') is False
assert is_palindrome('') is True`,
    }, {
      prompt: "Write reverse_words(s) that reverses the order of words, collapsing extra spaces: '  the sky  is blue ' -> 'blue is sky the'.",
      starter: "def reverse_words(s):\n    pass\n",
      tests: `assert reverse_words('  the sky  is blue ') == 'blue is sky the'
assert reverse_words('one') == 'one'`,
    }],
  },
  {
    id: "lists", title: "3. Lists, tuples & slicing",
    body: `<p>Lists are dynamic arrays: index O(1), append O(1) amortized, <code>insert(0, x)</code> and <code>pop(0)</code> O(n) (use <code>collections.deque</code> for queues), <code>x in list</code> O(n).</p>
      <ul><li>Slices copy: <code>a[1:3]</code>, <code>a[:]</code>, <code>a[-1]</code>. Assignment (<code>b = a</code>) does NOT copy.</li>
      <li>2-D grids: <code>[[0] * cols for _ in range(rows)]</code>. Never <code>[[0] * cols] * rows</code> (shared rows!).</li>
      <li><code>sorted(xs, key=lambda x: x[1], reverse=True)</code> returns a new list; <code>xs.sort()</code> sorts in place.</li>
      <li>Tuples are immutable and hashable, so they can be dict keys or set members. Unpack with <code>a, b = b, a</code>.</li></ul>`,
    example: `a = [1, 2, 3, 4, 5]\nb = a            # same list\nc = a[:]         # copy\nb.append(6)\nprint(a, c)\n\ngrid = [[0] * 3 for _ in range(2)]\ngrid[0][0] = 1\nprint(grid)\nprint(sorted([("x", 3), ("y", 1)], key=lambda t: t[1]))\n`,
    practice: [
      { why: "`sort()` sorts in place and returns `None`, so assigning its result loses the list. Use `sort()` alone, or `sorted()` for a new list.",
        bad: `nums = nums.sort()          # nums is now None`,
        good: `nums.sort()                 # in place
ordered = sorted(nums)      # or: a new sorted list` },
      { why: "Negative indexes count from the end: `nums[-1]` is the last item, with no length arithmetic.",
        bad: `last = nums[len(nums) - 1]
second_last = nums[len(nums) - 2]`,
        good: `last = nums[-1]
second_last = nums[-2]` },
      { why: "Unpacking names each part of a tuple or list in one step, and fails loudly if the size is wrong.",
        bad: `point = (3, 4)
x = point[0]
y = point[1]`,
        good: `point = (3, 4)
x, y = point` },
    ],
    exercises: [{
      prompt: "Write rotate_left(lst, k) returning a NEW list rotated left by k (k may exceed the length; handle empty lists).",
      starter: "def rotate_left(lst, k):\n    pass\n",
      tests: `assert rotate_left([1,2,3,4,5], 2) == [3,4,5,1,2]
assert rotate_left([1,2,3], 7) == [2,3,1]
assert rotate_left([], 3) == []`,
    }, {
      prompt: "Write dedupe(lst) that removes duplicates but keeps first-seen order.",
      starter: "def dedupe(lst):\n    pass\n",
      tests: `assert dedupe([3,1,3,2,1]) == [3,1,2]
assert dedupe([]) == []`,
    }],
  },
  {
    id: "dicts", title: "4. Dicts & sets",
    body: `<p>Hash tables: average O(1) insert, lookup, delete. Keys must be hashable (no lists; use tuples). Sets are for membership and de-duplication; they support <code>| &amp; - ^</code>.</p>
      <ul><li><code>d.get(k, default)</code>, <code>d.setdefault(k, [])</code>, <code>defaultdict(list)</code>, <code>Counter(items)</code>.</li>
      <li>Iterate with <code>d.items()</code>. Dicts keep insertion order. Don't mutate a dict while looping over it.</li>
      <li>This is the most important structure for interviews: counting, grouping, "seen before", memoization.</li></ul>`,
    example: `from collections import Counter, defaultdict\nc = Counter("mississippi")\nprint(c.most_common(2))\ngroups = defaultdict(list)\nfor w in ["eat", "tea", "tan"]:\n    groups["".join(sorted(w))].append(w)\nprint(dict(groups))\nprint({1, 2, 3} & {2, 3, 4})\n`,
    practice: [
      { why: "`items()` gives the key and value together, instead of looking every value up again.",
        bad: `for k in ages.keys():
    print(k, ages[k])       # a second lookup each time`,
        good: `for name, age in ages.items():
    print(name, age)` },
      { why: "`get` returns a default for a missing key in one call.",
        bad: `if key in config:
    port = config[key]
else:
    port = 8080`,
        good: `port = config.get(key, 8080)` },
      { why: "Deleting keys while looping over a dict raises `RuntimeError`. Build a new dict with the keys you keep.",
        bad: `for k in stock:
    if stock[k] == 0:
        del stock[k]        # RuntimeError: dict changed size`,
        good: `stock = {k: n for k, n in stock.items() if n > 0}` },
    ],
    exercises: [{
      prompt: "Write word_count(text) returning a dict of lowercase word -> count (split on whitespace).",
      starter: "def word_count(text):\n    pass\n",
      tests: `assert word_count('the cat The dog') == {'the': 2, 'cat': 1, 'dog': 1}
assert word_count('') == {}`,
    }, {
      prompt: "Write first_unique_char(s) returning the index of the first non-repeating character, or -1.",
      starter: "def first_unique_char(s):\n    pass\n",
      tests: `assert first_unique_char('leetcode') == 0
assert first_unique_char('loveleetcode') == 2
assert first_unique_char('aabb') == -1`,
    }],
  },
  {
    id: "functions", title: "5. Functions, scope & closures",
    body: `<ul><li>Default args are evaluated once: <code>def f(x, acc=[])</code> is a classic bug; use <code>acc=None</code>.</li>
      <li><code>*args</code> collects extra positional args, <code>**kwargs</code> keyword args. Keyword-only: <code>def f(a, *, b)</code>.</li>
      <li>Scope is LEGB (local, enclosing, global, built-in). Use <code>nonlocal</code> to rebind an enclosing variable in a closure.</li>
      <li>Functions are first-class: pass them as arguments (<code>key=</code>), return them, use <code>lambda</code> for one-liners.</li>
      <li>Add type hints and docstrings; interviewers like readable signatures.</li></ul>`,
    example: `def add_item(x, bucket=None):\n    bucket = [] if bucket is None else bucket\n    bucket.append(x)\n    return bucket\n\nprint(add_item(1), add_item(2))\n\ndef counter():\n    n = 0\n    def inc():\n        nonlocal n\n        n += 1\n        return n\n    return inc\nc = counter(); c(); print(c())\n`,
    practice: [
      { why: "A lambda assigned to a name is just a worse `def`: no name in tracebacks, no docstring, one expression only (PEP 8 says so too).",
        bad: `square = lambda x: x * x`,
        good: `def square(x):
    return x * x` },
      { why: "A closure looks up `i` when it's called, not when it's made, so every function sees the last value. Bind the current value with a default argument.",
        bad: `funcs = [lambda: i for i in range(3)]
print([f() for f in funcs])     # [2, 2, 2]`,
        good: `funcs = [lambda i=i: i for i in range(3)]
print([f() for f in funcs])     # [0, 1, 2]` },
      { why: "A bare `True` at the call site says nothing. A keyword-only argument (after `*`) must be named, so the call explains itself.",
        bad: `def connect(host, port, use_ssl):
    ...

connect("example.com", 443, True)          # True what?`,
        good: `def connect(host, port, *, use_ssl=False):
    ...

connect("example.com", 443, use_ssl=True)` },
    ],
    exercises: [{
      prompt: "Write make_counter(start=0) returning a function; each call returns the next integer (start, start+1, ...). Two counters must be independent.",
      starter: "def make_counter(start=0):\n    pass\n",
      tests: `a = make_counter(); b = make_counter(10)
assert (a(), a(), a()) == (0, 1, 2)
assert b() == 10 and a() == 3`,
    }, {
      prompt: "Write total(*nums, scale=1) returning sum(nums) * scale.",
      starter: "def total(*nums, scale=1):\n    pass\n",
      tests: `assert total(1, 2, 3) == 6
assert total(1, 2, 3, scale=2) == 12
assert total() == 0`,
    }],
  },
  {
    id: "comprehensions", title: "6. Comprehensions, iterators & generators",
    body: `<ul><li><code>[f(x) for x in xs if cond]</code>, <code>{k: v for ...}</code>, <code>{x for ...}</code>. Keep them to one readable line.</li>
      <li>Generators (<code>yield</code>) produce values lazily and use O(1) memory. Generator expressions: <code>sum(x*x for x in xs)</code>.</li>
      <li><code>any(...)</code>, <code>all(...)</code>, <code>min/max(key=...)</code>, <code>map</code>, <code>filter</code>, <code>zip</code>, <code>enumerate</code>, <code>reversed</code>.</li></ul>`,
    example: `print([x * x for x in range(6) if x % 2 == 0])\nprint({w: len(w) for w in ["a", "bb"]})\n\ndef evens():\n    n = 0\n    while True:\n        yield n\n        n += 2\n\ng = evens()\nprint([next(g) for _ in range(4)])\n`,
    practice: [
      { why: "A comprehension builds the list in one expression: shorter, a little faster, and it reads as \"the squares of the evens\".",
        bad: `squares = []
for x in nums:
    if x % 2 == 0:
        squares.append(x * x)`,
        good: `squares = [x * x for x in nums if x % 2 == 0]` },
      { why: "`sum`, `max`, `any` and friends accept a generator, so there's no need to build a whole list in memory first.",
        bad: `total = sum([x * x for x in nums])     # builds a full list first`,
        good: `total = sum(x * x for x in nums)       # one item at a time` },
      { why: "Comprehensions are for simple transformations. Past two loops or a condition per level, plain loops are easier to read and debug.",
        bad: `pairs = [(r, c) for r, row in enumerate(grid) for c, v in enumerate(row)
         if v and r % 2 if c > r]`,
        good: `pairs = []
for r, row in enumerate(grid):
    for c, v in enumerate(row):
        if v and r % 2 and c > r:
            pairs.append((r, c))` },
    ],
    exercises: [{
      prompt: "Write squares_of_evens(nums) using a list comprehension.",
      starter: "def squares_of_evens(nums):\n    pass\n",
      tests: `assert squares_of_evens([1,2,3,4]) == [4,16]
assert squares_of_evens([]) == []`,
    }, {
      prompt: "Write fib(n), a GENERATOR yielding the first n Fibonacci numbers (0, 1, 1, 2, ...).",
      starter: "def fib(n):\n    pass\n",
      tests: `import types
g = fib(7)
assert isinstance(g, types.GeneratorType), 'use yield'
assert list(g) == [0,1,1,2,3,5,8]
assert list(fib(0)) == []`,
    }],
  },
  {
    id: "classes", title: "7. Classes & OOP",
    body: `<ul><li><code>__init__</code> sets up instance state; <code>self</code> is explicit. Dunder methods: <code>__len__, __repr__, __eq__, __iter__, __lt__</code>.</li>
      <li>Use <code>@dataclass</code> for plain data holders. Use <code>@property</code> for computed attributes.</li>
      <li>Interview staples built from classes: <code>ListNode</code>, <code>TreeNode</code>, <code>Trie</code>, <code>LRUCache</code>, <code>MinStack</code>.</li>
      <li>Prefer composition over inheritance; know that <code>super().__init__()</code> calls the parent.</li></ul>`,
    example: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val, self.next = val, next\n    def __repr__(self):\n        return f"ListNode({self.val})"\n\nhead = ListNode(1, ListNode(2))\nprint(head, head.next)\n`,
    practice: [
      { why: "`@dataclass` writes `__init__`, `__repr__` and `__eq__` for you from the field list.",
        bad: `class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

    def __eq__(self, other):
        return (self.x, self.y) == (other.x, other.y)`,
        good: `from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int` },
      { why: "Python doesn't need getter methods. Use a plain attribute, and switch to `@property` later if you need a rule, without changing callers.",
        bad: `class User:
    def __init__(self, name):
        self._name = name

    def get_name(self):
        return self._name

print(user.get_name())`,
        good: `class User:
    def __init__(self, name):
        self.name = name

print(user.name)` },
      { why: "`type(x) == Dog` is false for a subclass of `Dog`. `isinstance` respects inheritance.",
        bad: `if type(pet) == Dog:        # false for a Puppy(Dog)
    pet.bark()`,
        good: `if isinstance(pet, Dog):    # true for Dog and its subclasses
    pet.bark()` },
    ],
    exercises: [{
      prompt: "Implement class Stack with push(x), pop(), peek(), is_empty(), and len(). pop/peek on an empty stack must raise IndexError.",
      starter: "class Stack:\n    pass\n",
      tests: `s = Stack()
assert s.is_empty() and len(s) == 0
s.push(1); s.push(2)
assert s.peek() == 2 and len(s) == 2
assert s.pop() == 2 and s.pop() == 1
for fn in (s.pop, s.peek):
    try:
        fn(); raise SystemExit('expected IndexError')
    except IndexError:
        pass`,
    }],
  },
  {
    id: "errors", title: "8. Errors & exceptions",
    body: `<ul><li><code>try / except SpecificError / else / finally</code>. Catch the narrowest exception you can; never a bare <code>except:</code>.</li>
      <li><code>raise ValueError("message")</code> for bad input. Python favours EAFP ("easier to ask forgiveness"): try it and handle the failure.</li>
      <li>Context managers (<code>with open(...) as f:</code>) guarantee cleanup.</li>
      <li>In interviews: state your assumptions about invalid input, and handle empty input explicitly.</li></ul>`,
    example: `def parse(s):\n    try:\n        return int(s)\n    except ValueError:\n        return None\n\nprint(parse("42"), parse("4x2"))\ntry:\n    {}["missing"]\nexcept KeyError as e:\n    print("KeyError", e)\n`,
    practice: [
      { why: "A bare `except:` catches everything, even Ctrl+C and typos like `NameError`. Name the exception you expect.",
        bad: `try:
    n = int(text)
except:
    n = 0`,
        good: `try:
    n = int(text)
except ValueError:
    n = 0` },
      { why: "Raising a new error inside `except` without `from` buries the original cause. `raise ... from e` keeps both in the traceback.",
        bad: `try:
    port = int(config["port"])
except KeyError:
    raise ConfigError("port is missing")`,
        good: `try:
    port = int(config["port"])
except KeyError as e:
    raise ConfigError("port is missing") from e` },
      { why: "Checking first and then acting has a gap: the file can vanish in between. Python's style is to try it and handle the failure (EAFP).",
        bad: `import os

if os.path.exists(path):
    with open(path) as f:       # can still fail
        data = f.read()`,
        good: `try:
    with open(path) as f:
        data = f.read()
except FileNotFoundError:
    data = ""` },
    ],
    exercises: [{
      prompt: "Write safe_div(a, b) returning a / b, or None when b is 0.",
      starter: "def safe_div(a, b):\n    pass\n",
      tests: `assert safe_div(6, 3) == 2
assert safe_div(1, 0) is None`,
    }, {
      prompt: "Write parse_int(s, default=0) returning int(s), or default when s is not a valid integer (also handle None).",
      starter: "def parse_int(s, default=0):\n    pass\n",
      tests: `assert parse_int('12') == 12
assert parse_int('abc') == 0
assert parse_int(None, -1) == -1
assert parse_int(' 7 ') == 7`,
    }],
  },
  {
    id: "stdlib", title: "9. Standard library for interviews",
    body: `<ul><li><code>collections</code>: <code>deque</code> (O(1) both ends), <code>Counter</code>, <code>defaultdict</code>, <code>OrderedDict</code>.</li>
      <li><code>heapq</code>: min-heap (<code>heappush, heappop, nlargest</code>). Negate values for a max-heap; push tuples for priorities.</li>
      <li><code>bisect</code>: <code>bisect_left/right</code> for binary search on sorted lists.</li>
      <li><code>functools.cache</code> for memoization; <code>itertools</code>: <code>permutations, combinations, product, accumulate</code>.</li>
      <li><code>math.inf</code>, <code>sys.setrecursionlimit</code> (default depth ~1000), <code>string.ascii_lowercase</code>.</li></ul>`,
    example: `import heapq, bisect\nfrom collections import deque\nh = []\nfor x in [5, 1, 4]: heapq.heappush(h, x)\nprint(heapq.heappop(h), heapq.nlargest(2, [5, 1, 4]))\nprint(bisect.bisect_left([1, 3, 5, 7], 5))\nq = deque([1, 2]); q.appendleft(0); print(q.popleft(), q.pop())\n`,
    practice: [
      { why: "`itertools.combinations` gives every pair once, with no index arithmetic to get wrong.",
        bad: `for i in range(len(items)):
    for j in range(i + 1, len(items)):
        check(items[i], items[j])`,
        good: `from itertools import combinations

for a, b in combinations(items, 2):
    check(a, b)` },
      { why: "Re-sorting after every append is O(n log n) per insert. `bisect.insort` puts the item in place: O(log n) to find the spot.",
        bad: `scores.append(x)
scores.sort()                       # O(n log n) every time`,
        good: `import bisect

bisect.insort(scores, x)            # stays sorted` },
      { why: "A made-up big number fails once real data is bigger. `math.inf` is larger than any number.",
        bad: `best = 999999                       # what if a cost is bigger?
for c in costs:
    best = min(best, c)`,
        good: `import math

best = math.inf
for c in costs:
    best = min(best, c)` },
    ],
    exercises: [{
      prompt: "Write merge_sorted(a, b) returning one sorted list from two sorted lists, using heapq.merge.",
      starter: "import heapq\n\ndef merge_sorted(a, b):\n    pass\n",
      tests: `assert merge_sorted([1,4,7],[2,3,9]) == [1,2,3,4,7,9]
assert merge_sorted([], [1]) == [1]`,
    }, {
      prompt: "Write insert_position(sorted_list, x) returning the index where x should be inserted to keep order (leftmost), using bisect.",
      starter: "import bisect\n\ndef insert_position(sorted_list, x):\n    pass\n",
      tests: `assert insert_position([1,3,5,7], 5) == 2
assert insert_position([1,3,5,7], 4) == 2
assert insert_position([], 1) == 0`,
    }],
  },
  {
    id: "recursion", title: "10. Recursion & Big-O",
    body: `<p>Recursion = base case + smaller subproblem. Every recursive call uses stack space, so depth matters (Python's default limit is ~1000).</p>
      <table><tr><th>Big-O</th><th>Typical example</th></tr>
      <tr><td>O(1)</td><td>dict lookup, array index</td></tr><tr><td>O(log n)</td><td>binary search, balanced tree height</td></tr>
      <tr><td>O(n)</td><td>single pass, hash-map approach</td></tr><tr><td>O(n log n)</td><td>sorting, heap of n items</td></tr>
      <tr><td>O(n^2)</td><td>nested loops, brute-force pairs</td></tr><tr><td>O(2^n) / O(n!)</td><td>subsets / permutations (backtracking)</td></tr></table>
      <p>Always state time AND space. Drop constants, keep the dominant term. Memoizing a recursion with <code>@cache</code> turns exponential into polynomial when subproblems overlap.</p>`,
    example: `from functools import cache\n\n@cache\ndef fib(n):\n    return n if n < 2 else fib(n - 1) + fib(n - 2)\n\nprint(fib(80))   # instant with the cache\n`,
    practice: [
      { why: "`@cache` needs hashable arguments, so passing a list raises `TypeError`. Cache on the index only, and read the list from the enclosing function.",
        bad: `from functools import cache

@cache
def best(nums, i):          # TypeError: unhashable type: 'list'
    if i >= len(nums):
        return 0
    return max(best(nums, i + 1), nums[i] + best(nums, i + 2))`,
        good: `from functools import cache

def rob(nums):
    @cache
    def best(i):            # only the index is cached
        if i >= len(nums):
            return 0
        return max(best(i + 1), nums[i] + best(i + 2))
    return best(0)` },
      { why: "Raising the recursion limit just moves the crash: the interpreter's own stack can still overflow. For deep inputs, loop with an explicit stack.",
        bad: `import sys
sys.setrecursionlimit(10**6)        # may crash the interpreter instead

def depth(node):
    return 0 if not node else 1 + depth(node.next)`,
        good: `def depth(node):
    n = 0
    while node:                     # no recursion, no limit
        n += 1
        node = node.next
    return n` },
      { why: "`path + [x]` copies the whole path on every call. Append, recurse, then pop: copy only when you store a result.",
        bad: `def subsets(nums, i=0, path=[]):
    if i == len(nums):
        return [path]
    return (subsets(nums, i + 1, path + [nums[i]])
            + subsets(nums, i + 1, path))`,
        good: `def subsets(nums):
    res, path = [], []
    def go(i):
        if i == len(nums):
            res.append(path[:])     # copy only here
            return
        path.append(nums[i])
        go(i + 1)
        path.pop()                  # undo
        go(i + 1)
    go(0)
    return res` },
    ],
    exercises: [{
      prompt: "Write power(x, n) computing x**n for integer n >= 0 recursively in O(log n) (square when n is even). Don't use ** or pow.",
      starter: "def power(x, n):\n    pass\n",
      tests: `assert power(2, 10) == 1024
assert power(3, 0) == 1
assert power(5, 1) == 5
assert power(2, 30) == 2**30`,
    }, {
      prompt: "Write flatten(nested) that flattens arbitrarily nested lists of ints: [1,[2,[3,4]],5] -> [1,2,3,4,5].",
      starter: "def flatten(nested):\n    pass\n",
      tests: `assert flatten([1,[2,[3,4]],5]) == [1,2,3,4,5]
assert flatten([]) == []
assert flatten([[[]]]) == []`,
    }],
  },
  {
    id: "testing", title: "11. Testing your own code (your QA edge)",
    body: `<p>This is where your QA background is an advantage. Before and after coding in an interview, test deliberately:</p>
      <ul><li><b>Happy path</b>, then <b>boundaries</b>: empty input, one element, duplicates, negatives, zero, very large values, already sorted / reverse sorted.</li>
      <li>Trace one example by hand through your code, line by line, before saying "done".</li>
      <li>Outside interviews: <code>assert</code> statements, <code>unittest</code> or <code>pytest</code> (<code>assert f(x) == y</code> in <code>test_*.py</code>, <code>pytest.mark.parametrize</code> for tables of cases).</li>
      <li>Use the exercises on this page as practice: the hidden tests are the kind of edge cases an interviewer will probe.</li></ul>`,
    example: `def clamp(x, lo, hi):\n    return max(lo, min(x, hi))\n\ncases = [((5, 0, 10), 5), ((-1, 0, 10), 0), ((11, 0, 10), 10), ((0, 0, 0), 0)]\nfor args, want in cases:\n    got = clamp(*args)\n    print("ok" if got == want else "FAIL", args, got, want)\n`,
    practice: [
      { why: "Printing means you have to read the output and judge it every time. An `assert` checks it for you and fails loudly.",
        bad: `print(total([1, 2, 3]))     # look: is it 6?`,
        good: `assert total([1, 2, 3]) == 6` },
      { why: "The happy path is the case least likely to break. Test the edges: empty, one item, negatives, duplicates.",
        bad: `assert total([1, 2, 3]) == 6`,
        good: `assert total([1, 2, 3]) == 6
assert total([]) == 0               # empty
assert total([5]) == 5              # one item
assert total([-1, 1]) == 0          # negatives` },
      { why: "Decimal results are approximations, so `==` can fail on a correct answer. Compare with a tolerance.",
        bad: `assert average([0.1, 0.2]) == 0.15     # fails: 0.15000000000000002`,
        good: `import math

assert math.isclose(average([0.1, 0.2]), 0.15)` },
    ],
    exercises: [{
      prompt: "Write is_leap_year(y): divisible by 4, except centuries unless divisible by 400. Think about which edge cases to test (1900, 2000, 2024, 2100).",
      starter: "def is_leap_year(y):\n    pass\n",
      tests: `assert is_leap_year(2024) is True
assert is_leap_year(1900) is False
assert is_leap_year(2000) is True
assert is_leap_year(2023) is False
assert is_leap_year(2100) is False`,
    }],
  },
];
