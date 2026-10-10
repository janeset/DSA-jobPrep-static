// Big-O refresher content. HTML here is trusted (written in this file).
const BIGO_SECTIONS = [
  {
    title: "1. What Big-O actually means",
    html: `<p>Big-O describes how an algorithm's <b>running time (or memory) grows as the input size n grows</b>. It is not a stopwatch measurement. It answers: "if the input gets 10x bigger, how much slower does this get?"</p>
    <ul>
      <li><b>Drop constants:</b> 3n and 100n are both O(n). <b>Drop lower terms:</b> n² + n is O(n²).</li>
      <li>Interviews usually mean the <b>worst case</b> unless you say otherwise.</li>
      <li><b>Name your variables.</b> If there are two inputs, say O(n + m) or O(n * m), not just O(n).</li>
      <li><b>Time</b> = how many steps. <b>Space</b> = extra memory beyond the input (recursion stack counts; the returned output usually doesn't).</li>
    </ul>`,
  },
  {
    title: "2. The common growth rates",
    html: `<table><tr><th>Class</th><th>Name</th><th>Typical source</th><th>Example</th></tr>
      <tr><td>O(1)</td><td>constant</td><td>direct access</td><td>array index, dict lookup</td></tr>
      <tr><td>O(log n)</td><td>logarithmic</td><td>halving the problem each step</td><td>binary search, balanced BST</td></tr>
      <tr><td>O(n)</td><td>linear</td><td>one pass</td><td>scan an array, hash-map approach</td></tr>
      <tr><td>O(n log n)</td><td>linearithmic</td><td>sort, or n operations of log n</td><td>merge sort, heap of n items</td></tr>
      <tr><td>O(n²)</td><td>quadratic</td><td>nested loops over the input</td><td>comparing all pairs, bubble sort</td></tr>
      <tr><td>O(2ⁿ)</td><td>exponential</td><td>try take/skip for every element</td><td>subsets, naive Fibonacci</td></tr>
      <tr><td>O(n!)</td><td>factorial</td><td>try every ordering</td><td>permutations</td></tr></table>
    <p><b>Rule of thumb from input limits</b> (about 10<sup>8</sup> simple operations per second): n up to ~20 means O(2ⁿ) is fine, ~10 means O(n!), ~10³-10⁴ allows O(n²), ~10⁵ needs O(n log n), and ~10⁶ or more needs O(n). Read the constraints in the problem: they hint at the intended complexity.</p>`,
  },
  {
    title: "3. How to figure it out from code",
    html: `<ul>
      <li><b>Sequential steps add:</b> a loop of n then a loop of n is O(n + n) = O(n).</li>
      <li><b>Nested loops multiply:</b> a loop of n inside a loop of n is O(n²). The inner loop <code>for j in range(i)</code> still gives about n²/2, which is O(n²).</li>
      <li><b>Halving or doubling is log:</b> <code>while n &gt; 1: n //= 2</code> runs log₂ n times.</li>
      <li><b>Recursion:</b> (work per call) x (number of calls). Draw the call tree.</li>
      <li><b>Hidden costs:</b> slicing <code>a[i:]</code>, <code>x in list</code>, <code>list.insert(0, x)</code>, <code>s += ch</code> and <code>sorted()</code> are not O(1).</li>
      <li><b>Amortized:</b> an occasional expensive step averaged out. <code>list.append</code> is O(1) amortized even though it sometimes resizes.</li>
      <li><b>Two-pointer / sliding window loops</b> look nested but each pointer only moves forward, so the total is O(n).</li></ul>
    <p><b>Recursion cheat sheet</b></p>
    <table><tr><th>Recurrence</th><th>Result</th><th>Example</th></tr>
      <tr><td>T(n) = T(n - 1) + O(1)</td><td>O(n)</td><td>factorial, linked-list recursion</td></tr>
      <tr><td>T(n) = T(n / 2) + O(1)</td><td>O(log n)</td><td>binary search</td></tr>
      <tr><td>T(n) = 2 T(n / 2) + O(n)</td><td>O(n log n)</td><td>merge sort</td></tr>
      <tr><td>T(n) = 2 T(n / 2) + O(1)</td><td>O(n)</td><td>tree traversal</td></tr>
      <tr><td>T(n) = 2 T(n - 1) + O(1)</td><td>O(2ⁿ)</td><td>naive Fibonacci</td></tr></table>
    <p>Memoization turns overlapping recursion into (number of distinct states) x (work per state), which is how DP turns O(2ⁿ) into polynomial.</p>`,
  },
  {
    title: "4. Space complexity",
    html: `<ul>
      <li>Extra variables only: <b>O(1)</b>. A set/dict/list that can hold n items: <b>O(n)</b>. A 2-D table: <b>O(n * m)</b>.</li>
      <li><b>Recursion uses stack space</b> equal to the maximum depth: DFS on a tree is O(height), which is O(log n) when balanced and O(n) when skewed.</li>
      <li>BFS queue can hold a whole level (up to O(n)). Sorting in place (<code>list.sort()</code>) uses O(n) in Python's Timsort worst case; many interviewers still accept "O(1) or O(n)", just say which assumption you're making.</li>
      <li>Trade-off to mention: hash maps buy speed (O(n) time instead of O(n²)) with O(n) space.</li></ul>`,
  },
  {
    title: "5. Cost of Python operations",
    html: `<table><tr><th>Operation</th><th>Cost</th><th>Note</th></tr>
      <tr><td><code>lst[i]</code>, <code>len(x)</code>, <code>lst.append(x)</code>, <code>lst.pop()</code></td><td>O(1)</td><td>append is amortized</td></tr>
      <tr><td><code>lst.insert(i, x)</code>, <code>lst.pop(0)</code>, <code>del lst[i]</code></td><td>O(n)</td><td>shifts elements. Use <code>collections.deque</code> for queues</td></tr>
      <tr><td><code>x in lst</code>, <code>lst.index(x)</code>, <code>min/max/sum(lst)</code></td><td>O(n)</td><td></td></tr>
      <tr><td><code>x in set</code>, <code>x in dict</code>, <code>d[k]</code>, <code>set.add</code></td><td>O(1) avg</td><td>worst case O(n) with collisions, ignore in interviews</td></tr>
      <tr><td><code>lst[a:b]</code> (slice), <code>lst.copy()</code>, <code>lst + other</code></td><td>O(k)</td><td>slicing in a recursion/loop quietly adds a factor of n</td></tr>
      <tr><td><code>sorted(x)</code>, <code>lst.sort()</code></td><td>O(n log n)</td><td></td></tr>
      <tr><td><code>s + t</code>, <code>s += ch</code></td><td>O(len)</td><td>strings are immutable, so building in a loop is O(n²). Use <code>"".join(parts)</code></td></tr>
      <tr><td><code>heapq.heappush / heappop</code></td><td>O(log n)</td><td><code>heapify</code> is O(n)</td></tr>
      <tr><td><code>deque.append / popleft / appendleft / pop</code></td><td>O(1)</td><td></td></tr>
      <tr><td><code>bisect.bisect_left</code></td><td>O(log n)</td><td>but <code>insort</code> is O(n)</td></tr></table>`,
  },
];

// Quiz: q = code, a = correct option, why = explanation.
const BIGO_OPTIONS = ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)", "O(n!)"];
const BIGO_QUIZ = [
  { id: "q1", q: "total = 0\nfor x in nums:\n    total += x", a: "O(n)", why: "One pass over n items." },
  { id: "q2", q: "for i in range(n):\n    for j in range(n):\n        print(i, j)", a: "O(n²)", why: "n iterations of an inner loop of n." },
  { id: "q3", q: "while n > 1:\n    n //= 2", a: "O(log n)", why: "n is halved each step, so it takes log₂ n steps." },
  { id: "q4", q: "for i in range(n):\n    for j in range(i):\n        work()", a: "O(n²)", why: "0 + 1 + ... + (n-1) = n(n-1)/2, and the constant 1/2 is dropped." },
  { id: "q5", q: "for x in nums:\n    a(x)\nfor x in nums:\n    b(x)", a: "O(n)", why: "Sequential loops add: n + n = 2n, which is O(n)." },
  { id: "q6", q: "def search(a, t, lo, hi):\n    if lo > hi: return -1\n    mid = (lo + hi) // 2\n    if a[mid] == t: return mid\n    if a[mid] < t: return search(a, t, mid + 1, hi)\n    return search(a, t, lo, mid - 1)", a: "O(log n)", why: "T(n) = T(n/2) + O(1). Binary search." },
  { id: "q7", q: "def fib(n):\n    if n < 2: return n\n    return fib(n - 1) + fib(n - 2)", a: "O(2ⁿ)", why: "Each call makes two calls on nearly the same size: a call tree that roughly doubles per level. (Memoizing makes it O(n).)" },
  { id: "q8", q: "nums.sort()\nfor x in nums:\n    print(x)", a: "O(n log n)", why: "The sort dominates the O(n) loop." },
  { id: "q9", q: "# a and b are lists of length n\nfor x in a:\n    if x in b:\n        print(x)", a: "O(n²)", why: "'x in list' is O(n), done n times. Converting b to a set first would make this O(n)." },
  { id: "q10", q: "seen = set()\nfor x in nums:\n    if x in seen:\n        return True\n    seen.add(x)", a: "O(n)", why: "Set lookup and insert are O(1) average, n times." },
  { id: "q11", q: "for i in range(n):\n    j = 1\n    while j < n:\n        j *= 2", a: "O(n log n)", why: "The inner loop doubles j, so it runs log n times; that happens n times." },
  { id: "q12", q: "for i in range(n):\n    lst.insert(0, i)", a: "O(n²)", why: "insert at the front shifts every element: O(n) each, n times." },
  { id: "q13", q: "import heapq\nh = []\nfor x in nums:\n    heapq.heappush(h, x)", a: "O(n log n)", why: "n pushes, each O(log n). (heapify on a list is O(n).)" },
  { id: "q14", q: "def subsets(i, path):\n    if i == len(nums):\n        out.append(path[:])\n        return\n    subsets(i + 1, path + [nums[i]])\n    subsets(i + 1, path)", a: "O(2ⁿ)", why: "Take or skip for each of n elements: 2ⁿ leaves (times the copy cost per leaf)." },
  { id: "q15", q: "for p in itertools.permutations(nums):\n    check(p)", a: "O(n!)", why: "There are n! orderings." },
  { id: "q16", q: "def count(node):\n    if not node: return 0\n    return 1 + count(node.left) + count(node.right)\n\n# SPACE complexity on a skewed tree with n nodes?", a: "O(n)", why: "Recursion depth equals the height, which is n for a skewed (linked-list-like) tree. Time is O(n) too." },
  { id: "q17", q: "def f(a):\n    if len(a) <= 1: return\n    f(a[1:])\n\n# TIME for a list of length n?", a: "O(n²)", why: "n calls, each slicing a copy of O(n) elements. Slicing in recursion is a classic hidden cost." },
  { id: "q18", q: "def has_pair(a, target):\n    l, r = 0, len(a) - 1\n    while l < r:\n        s = a[l] + a[r]\n        if s == target: return True\n        if s < target: l += 1\n        else: r -= 1\n    return False", a: "O(n)", why: "It looks like a loop with branches, but l and r only ever move toward each other: at most n steps total." },
  { id: "q19", q: "x = nums[0]\ny = d['key']\nz = len(nums)", a: "O(1)", why: "Index, dict lookup and len are all constant time." },
  { id: "q20", q: "s = ''\nfor ch in text:\n    s = s + ch", a: "O(n²)", why: "Each concatenation can copy the whole string (strings are immutable). Collect characters in a list and join once for O(n)." },
];
