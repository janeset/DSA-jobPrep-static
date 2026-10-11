// Big-O refresher content. HTML here is trusted (written in this file).
// Titles, section html, quiz code and explanations are either shared (a string) or per language
// ({ py, java, cs }, the main language's version is shown), the same way as the other lessons.
// The Java / C# quiz snippets are fragments: methods and statements as they'd sit inside a class.
const BIGO_RECURRENCES = `<p><b>Recursion cheat sheet</b></p>
    <table><tr><th>Recurrence</th><th>Result</th><th>Example</th></tr>
      <tr><td>T(n) = T(n - 1) + O(1)</td><td>O(n)</td><td>factorial, linked-list recursion</td></tr>
      <tr><td>T(n) = T(n / 2) + O(1)</td><td>O(log n)</td><td>binary search</td></tr>
      <tr><td>T(n) = 2 T(n / 2) + O(n)</td><td>O(n log n)</td><td>merge sort</td></tr>
      <tr><td>T(n) = 2 T(n / 2) + O(1)</td><td>O(n)</td><td>tree traversal</td></tr>
      <tr><td>T(n) = 2 T(n - 1) + O(1)</td><td>O(2ⁿ)</td><td>naive Fibonacci</td></tr></table>
    <p>Memoization turns overlapping recursion into (number of distinct states) x (work per state), which is how DP turns O(2ⁿ) into polynomial.</p>`;
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
      <tr><td>O(1)</td><td>constant</td><td>direct access</td><td>array index, hash map lookup</td></tr>
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
    html: {
      py: `<ul>
      <li><b>Sequential steps add:</b> a loop of n then a loop of n is O(n + n) = O(n).</li>
      <li><b>Nested loops multiply:</b> a loop of n inside a loop of n is O(n²). The inner loop <code>for j in range(i)</code> still gives about n²/2, which is O(n²).</li>
      <li><b>Halving or doubling is log:</b> <code>while n &gt; 1: n //= 2</code> runs log₂ n times.</li>
      <li><b>Recursion:</b> (work per call) x (number of calls). Draw the call tree.</li>
      <li><b>Hidden costs:</b> slicing <code>a[i:]</code>, <code>x in list</code>, <code>list.insert(0, x)</code>, <code>s += ch</code> and <code>sorted()</code> are not O(1).</li>
      <li><b>Amortized:</b> an occasional expensive step averaged out. <code>list.append</code> is O(1) amortized even though it sometimes resizes.</li>
      <li><b>Two-pointer / sliding window loops</b> look nested but each pointer only moves forward, so the total is O(n).</li></ul>
    ${BIGO_RECURRENCES}`,
      java: `<ul>
      <li><b>Sequential steps add:</b> a loop of n then a loop of n is O(n + n) = O(n).</li>
      <li><b>Nested loops multiply:</b> a loop of n inside a loop of n is O(n²). The inner loop <code>for (int j = 0; j &lt; i; j++)</code> still gives about n²/2, which is O(n²).</li>
      <li><b>Halving or doubling is log:</b> <code>while (n &gt; 1) n /= 2;</code> runs log₂ n times.</li>
      <li><b>Recursion:</b> (work per call) x (number of calls). Draw the call tree.</li>
      <li><b>Hidden costs:</b> <code>list.contains(x)</code>, <code>list.add(0, x)</code>, <code>Arrays.copyOfRange</code>, <code>s.substring(i)</code>, <code>s += ch</code> and <code>Collections.sort</code> are not O(1).</li>
      <li><b>Amortized:</b> an occasional expensive step averaged out. <code>ArrayList.add</code> is O(1) amortized even though it sometimes resizes.</li>
      <li><b>Two-pointer / sliding window loops</b> look nested but each pointer only moves forward, so the total is O(n).</li></ul>
    ${BIGO_RECURRENCES}`,
      cs: `<ul>
      <li><b>Sequential steps add:</b> a loop of n then a loop of n is O(n + n) = O(n).</li>
      <li><b>Nested loops multiply:</b> a loop of n inside a loop of n is O(n²). The inner loop <code>for (int j = 0; j &lt; i; j++)</code> still gives about n²/2, which is O(n²).</li>
      <li><b>Halving or doubling is log:</b> <code>while (n &gt; 1) n /= 2;</code> runs log₂ n times.</li>
      <li><b>Recursion:</b> (work per call) x (number of calls). Draw the call tree.</li>
      <li><b>Hidden costs:</b> <code>list.Contains(x)</code>, <code>list.Insert(0, x)</code>, ranges <code>a[i..]</code> on arrays and strings, <code>s.Substring(i)</code>, <code>s += ch</code>, <code>list.Sort()</code> and LINQ (<code>.Count()</code>, <code>.ToList()</code>, <code>.OrderBy()</code>) are not O(1).</li>
      <li><b>Amortized:</b> an occasional expensive step averaged out. <code>List&lt;T&gt;.Add</code> is O(1) amortized even though it sometimes resizes.</li>
      <li><b>Two-pointer / sliding window loops</b> look nested but each pointer only moves forward, so the total is O(n).</li></ul>
    ${BIGO_RECURRENCES}`,
    },
  },
  {
    title: "4. Space complexity",
    html: {
      py: `<ul>
      <li>Extra variables only: <b>O(1)</b>. A set/dict/list that can hold n items: <b>O(n)</b>. A 2-D table: <b>O(n * m)</b>.</li>
      <li><b>Recursion uses stack space</b> equal to the maximum depth: DFS on a tree is O(height), which is O(log n) when balanced and O(n) when skewed.</li>
      <li>BFS queue can hold a whole level (up to O(n)). Sorting in place (<code>list.sort()</code>) uses O(n) in Python's Timsort worst case; many interviewers still accept "O(1) or O(n)", just say which assumption you're making.</li>
      <li>Trade-off to mention: hash maps buy speed (O(n) time instead of O(n²)) with O(n) space.</li></ul>`,
      java: `<ul>
      <li>Extra variables only: <b>O(1)</b>. A HashSet/HashMap/ArrayList that can hold n items: <b>O(n)</b>. A 2-D table: <b>O(n * m)</b>.</li>
      <li><b>Recursion uses stack space</b> equal to the maximum depth: DFS on a tree is O(height), which is O(log n) when balanced and O(n) when skewed. Very deep recursion (around 10⁴ frames and up) can throw <code>StackOverflowError</code>; use an explicit stack then.</li>
      <li>BFS queue can hold a whole level (up to O(n)). <code>Arrays.sort</code> on primitives (dual-pivot quicksort) uses O(log n) stack; on objects and <code>Collections.sort</code> (TimSort) up to O(n). Many interviewers still accept "O(1) or O(n)", just say which assumption you're making.</li>
      <li>Trade-off to mention: hash maps buy speed (O(n) time instead of O(n²)) with O(n) space.</li></ul>`,
      cs: `<ul>
      <li>Extra variables only: <b>O(1)</b>. A HashSet/Dictionary/List that can hold n items: <b>O(n)</b>. A 2-D table: <b>O(n * m)</b>.</li>
      <li><b>Recursion uses stack space</b> equal to the maximum depth: DFS on a tree is O(height), which is O(log n) when balanced and O(n) when skewed. Very deep recursion can crash the process with a stack overflow (it can't be caught); use an explicit <code>Stack&lt;T&gt;</code> then.</li>
      <li>BFS queue can hold a whole level (up to O(n)). <code>Array.Sort</code> and <code>List.Sort</code> (introsort) sort in place with O(log n) stack; LINQ <code>OrderBy</code> builds a new sorted copy, O(n). Many interviewers still accept "O(1) or O(n)", just say which assumption you're making.</li>
      <li>Trade-off to mention: hash maps buy speed (O(n) time instead of O(n²)) with O(n) space.</li></ul>`,
    },
  },
  {
    title: { py: "5. Cost of Python operations", java: "5. Cost of Java collection operations", cs: "5. Cost of .NET collection operations" },
    html: {
      py: `<table><tr><th>Operation</th><th>Cost</th><th>Note</th></tr>
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
      java: `<table><tr><th>Operation</th><th>Cost</th><th>Note</th></tr>
      <tr><td><code>a[i]</code>, <code>a.length</code>, <code>list.get(i)</code>, <code>list.size()</code>, <code>list.add(x)</code>, <code>list.remove(list.size() - 1)</code></td><td>O(1)</td><td>ArrayList; <code>add</code> is amortized</td></tr>
      <tr><td><code>list.add(0, x)</code>, <code>list.remove(0)</code>, <code>list.remove(i)</code></td><td>O(n)</td><td>shifts elements. Use <code>ArrayDeque</code> for queues</td></tr>
      <tr><td><code>list.contains(x)</code>, <code>list.indexOf(x)</code>, <code>Collections.max(list)</code></td><td>O(n)</td><td></td></tr>
      <tr><td><code>set.contains</code>, <code>set.add</code>, <code>map.get</code>, <code>map.put</code>, <code>map.getOrDefault</code></td><td>O(1) avg</td><td>HashSet / HashMap. Worst case with collisions, ignore in interviews</td></tr>
      <tr><td><code>TreeMap / TreeSet</code>: <code>get</code>, <code>put</code>, <code>add</code>, <code>floorKey</code>, <code>ceiling</code>, <code>first</code></td><td>O(log n)</td><td>keeps keys sorted</td></tr>
      <tr><td><code>Arrays.copyOfRange</code>, <code>new ArrayList&lt;&gt;(list)</code>, <code>s.substring(a, b)</code>, <code>s.toCharArray()</code></td><td>O(k)</td><td>copies; in a recursion or loop it quietly adds a factor of n. Pass indices instead</td></tr>
      <tr><td><code>Arrays.sort</code>, <code>Collections.sort</code>, <code>list.sort</code></td><td>O(n log n)</td><td></td></tr>
      <tr><td><code>s + t</code>, <code>s += ch</code></td><td>O(len)</td><td>strings are immutable, so building in a loop is O(n²). Use a <code>StringBuilder</code> (<code>append</code> is O(1) amortized)</td></tr>
      <tr><td><code>PriorityQueue.offer / poll</code></td><td>O(log n)</td><td><code>peek</code> is O(1); <code>remove(x)</code> and <code>contains</code> are O(n). <code>new PriorityQueue&lt;&gt;(collection)</code> builds in O(n)</td></tr>
      <tr><td><code>ArrayDeque.offerFirst / offerLast / pollFirst / pollLast</code></td><td>O(1)</td><td>also the stack to use (<code>push / pop</code>)</td></tr>
      <tr><td><code>Arrays.binarySearch</code>, <code>Collections.binarySearch</code></td><td>O(log n)</td><td>on sorted data; inserting to keep a list sorted is still O(n)</td></tr></table>`,
      cs: `<table><tr><th>Operation</th><th>Cost</th><th>Note</th></tr>
      <tr><td><code>a[i]</code>, <code>a.Length</code>, <code>list[i]</code>, <code>list.Count</code>, <code>list.Add(x)</code>, <code>list.RemoveAt(list.Count - 1)</code></td><td>O(1)</td><td>List&lt;T&gt;; <code>Add</code> is amortized</td></tr>
      <tr><td><code>list.Insert(0, x)</code>, <code>list.RemoveAt(0)</code>, <code>list.Remove(x)</code></td><td>O(n)</td><td>shifts elements. Use <code>Queue&lt;T&gt;</code> or <code>LinkedList&lt;T&gt;</code> for queues</td></tr>
      <tr><td><code>list.Contains(x)</code>, <code>list.IndexOf(x)</code>, LINQ <code>Min / Max / Sum</code></td><td>O(n)</td><td>so is LINQ <code>.Count()</code> on a sequence, unlike the <code>Count</code> property</td></tr>
      <tr><td><code>set.Contains</code>, <code>set.Add</code>, <code>dict[k]</code>, <code>dict.ContainsKey</code>, <code>dict.TryGetValue</code></td><td>O(1) avg</td><td>HashSet / Dictionary. Worst case with collisions, ignore in interviews</td></tr>
      <tr><td><code>SortedDictionary / SortedSet</code>: <code>Add</code>, <code>Remove</code>, <code>Contains</code>, <code>Min</code></td><td>O(log n)</td><td>keeps keys sorted</td></tr>
      <tr><td><code>a[i..j]</code> on arrays and strings, <code>s.Substring</code>, <code>list.GetRange</code>, <code>.ToList()</code>, <code>.ToArray()</code></td><td>O(k)</td><td>copies; in a recursion or loop it quietly adds a factor of n. Pass indices, or slice a <code>Span</code> (no copy)</td></tr>
      <tr><td><code>Array.Sort</code>, <code>list.Sort()</code>, LINQ <code>OrderBy</code></td><td>O(n log n)</td><td></td></tr>
      <tr><td><code>s + t</code>, <code>s += ch</code></td><td>O(len)</td><td>strings are immutable, so building in a loop is O(n²). Use a <code>StringBuilder</code> (<code>Append</code> is O(1) amortized)</td></tr>
      <tr><td><code>PriorityQueue.Enqueue / Dequeue</code></td><td>O(log n)</td><td><code>Peek</code> is O(1). Passing all items to the constructor builds in O(n)</td></tr>
      <tr><td><code>Queue.Enqueue / Dequeue</code>, <code>Stack.Push / Pop</code></td><td>O(1)</td><td>Enqueue and Push are amortized</td></tr>
      <tr><td><code>Array.BinarySearch</code>, <code>list.BinarySearch</code></td><td>O(log n)</td><td>on sorted data; inserting to keep a list sorted is still O(n)</td></tr></table>`,
    },
  },
];

// Quiz: q = code, a = correct option (the same in every language), why = explanation.
const BIGO_OPTIONS = ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)", "O(n!)"];
const BIGO_QUIZ = [
  { id: "q1", a: "O(n)", why: "One pass over n items.", q: {
    py: "total = 0\nfor x in nums:\n    total += x",
    java: "int total = 0;\nfor (int x : nums)\n    total += x;",
    cs: "int total = 0;\nforeach (int x in nums)\n    total += x;" } },
  { id: "q2", a: "O(n²)", why: "n iterations of an inner loop of n.", q: {
    py: "for i in range(n):\n    for j in range(n):\n        print(i, j)",
    java: "for (int i = 0; i < n; i++)\n    for (int j = 0; j < n; j++)\n        System.out.println(i + \" \" + j);",
    cs: "for (int i = 0; i < n; i++)\n    for (int j = 0; j < n; j++)\n        Console.WriteLine($\"{i} {j}\");" } },
  { id: "q3", a: "O(log n)", why: "n is halved each step, so it takes log₂ n steps.", q: {
    py: "while n > 1:\n    n //= 2",
    java: "while (n > 1)\n    n /= 2;",
    cs: "while (n > 1)\n    n /= 2;" } },
  { id: "q4", a: "O(n²)", why: "0 + 1 + ... + (n-1) = n(n-1)/2, and the constant 1/2 is dropped.", q: {
    py: "for i in range(n):\n    for j in range(i):\n        work()",
    java: "for (int i = 0; i < n; i++)\n    for (int j = 0; j < i; j++)\n        work();",
    cs: "for (int i = 0; i < n; i++)\n    for (int j = 0; j < i; j++)\n        Work();" } },
  { id: "q5", a: "O(n)", why: "Sequential loops add: n + n = 2n, which is O(n).", q: {
    py: "for x in nums:\n    a(x)\nfor x in nums:\n    b(x)",
    java: "for (int x : nums)\n    a(x);\nfor (int x : nums)\n    b(x);",
    cs: "foreach (int x in nums)\n    A(x);\nforeach (int x in nums)\n    B(x);" } },
  { id: "q6", a: "O(log n)", why: "T(n) = T(n/2) + O(1). Binary search.", q: {
    py: "def search(a, t, lo, hi):\n    if lo > hi: return -1\n    mid = (lo + hi) // 2\n    if a[mid] == t: return mid\n    if a[mid] < t: return search(a, t, mid + 1, hi)\n    return search(a, t, lo, mid - 1)",
    java: "int search(int[] a, int t, int lo, int hi) {\n    if (lo > hi) return -1;\n    int mid = (lo + hi) / 2;\n    if (a[mid] == t) return mid;\n    if (a[mid] < t) return search(a, t, mid + 1, hi);\n    return search(a, t, lo, mid - 1);\n}",
    cs: "int Search(int[] a, int t, int lo, int hi)\n{\n    if (lo > hi) return -1;\n    int mid = (lo + hi) / 2;\n    if (a[mid] == t) return mid;\n    if (a[mid] < t) return Search(a, t, mid + 1, hi);\n    return Search(a, t, lo, mid - 1);\n}" } },
  { id: "q7", a: "O(2ⁿ)", why: "Each call makes two calls on nearly the same size: a call tree that roughly doubles per level. (Memoizing makes it O(n).)", q: {
    py: "def fib(n):\n    if n < 2: return n\n    return fib(n - 1) + fib(n - 2)",
    java: "int fib(int n) {\n    if (n < 2) return n;\n    return fib(n - 1) + fib(n - 2);\n}",
    cs: "int Fib(int n)\n{\n    if (n < 2) return n;\n    return Fib(n - 1) + Fib(n - 2);\n}" } },
  { id: "q8", a: "O(n log n)", why: "The sort dominates the O(n) loop.", q: {
    py: "nums.sort()\nfor x in nums:\n    print(x)",
    java: "Arrays.sort(nums);\nfor (int x : nums)\n    System.out.println(x);",
    cs: "Array.Sort(nums);\nforeach (int x in nums)\n    Console.WriteLine(x);" } },
  { id: "q9", a: "O(n²)", q: {
    py: "# a and b are lists of length n\nfor x in a:\n    if x in b:\n        print(x)",
    java: "// a and b are ArrayLists of length n\nfor (int x : a)\n    if (b.contains(x))\n        System.out.println(x);",
    cs: "// a and b are Lists of length n\nforeach (int x in a)\n    if (b.Contains(x))\n        Console.WriteLine(x);" }, why: {
    py: "'x in list' is O(n), done n times. Converting b to a set first would make this O(n).",
    java: "contains on a list is O(n), done n times. Copying b into a HashSet first would make this O(n).",
    cs: "Contains on a List is O(n), done n times. Copying b into a HashSet first would make this O(n)." } },
  { id: "q10", a: "O(n)", why: "Set lookup and insert are O(1) average, n times.", q: {
    py: "seen = set()\nfor x in nums:\n    if x in seen:\n        return True\n    seen.add(x)",
    java: "Set<Integer> seen = new HashSet<>();\nfor (int x : nums) {\n    if (seen.contains(x))\n        return true;\n    seen.add(x);\n}",
    cs: "var seen = new HashSet<int>();\nforeach (int x in nums)\n{\n    if (seen.Contains(x))\n        return true;\n    seen.Add(x);\n}" } },
  { id: "q11", a: "O(n log n)", why: "The inner loop doubles j, so it runs log n times; that happens n times.", q: {
    py: "for i in range(n):\n    j = 1\n    while j < n:\n        j *= 2",
    java: "for (int i = 0; i < n; i++) {\n    int j = 1;\n    while (j < n)\n        j *= 2;\n}",
    cs: "for (int i = 0; i < n; i++)\n{\n    int j = 1;\n    while (j < n)\n        j *= 2;\n}" } },
  { id: "q12", a: "O(n²)", q: {
    py: "for i in range(n):\n    lst.insert(0, i)",
    java: "// list is an ArrayList\nfor (int i = 0; i < n; i++)\n    list.add(0, i);",
    cs: "// list is a List<int>\nfor (int i = 0; i < n; i++)\n    list.Insert(0, i);" }, why: {
    py: "insert at the front shifts every element: O(n) each, n times.",
    java: "add(0, x) on an ArrayList shifts every element: O(n) each, n times. (ArrayDeque.offerFirst is O(1).)",
    cs: "Insert(0, x) on a List shifts every element: O(n) each, n times. (LinkedList.AddFirst is O(1).)" } },
  { id: "q13", a: "O(n log n)", q: {
    py: "import heapq\nh = []\nfor x in nums:\n    heapq.heappush(h, x)",
    java: "PriorityQueue<Integer> h = new PriorityQueue<>();\nfor (int x : nums)\n    h.offer(x);",
    cs: "var h = new PriorityQueue<int, int>();\nforeach (int x in nums)\n    h.Enqueue(x, x);" }, why: {
    py: "n pushes, each O(log n). (heapify on a list is O(n).)",
    java: "n inserts, each O(log n). (new PriorityQueue<>(collection) builds the heap in O(n).)",
    cs: "n inserts, each O(log n). (Passing all the items to the constructor builds the heap in O(n).)" } },
  { id: "q14", a: "O(2ⁿ)", why: "Take or skip for each of n elements: 2ⁿ leaves (times the copy cost per leaf).", q: {
    py: "def subsets(i, path):\n    if i == len(nums):\n        out.append(path[:])\n        return\n    subsets(i + 1, path + [nums[i]])\n    subsets(i + 1, path)",
    java: "void subsets(int i, List<Integer> path) {\n    if (i == nums.length) {\n        result.add(new ArrayList<>(path));\n        return;\n    }\n    path.add(nums[i]);\n    subsets(i + 1, path);\n    path.remove(path.size() - 1);\n    subsets(i + 1, path);\n}",
    cs: "void Subsets(int i, List<int> path)\n{\n    if (i == nums.Length)\n    {\n        result.Add(new List<int>(path));\n        return;\n    }\n    path.Add(nums[i]);\n    Subsets(i + 1, path);\n    path.RemoveAt(path.Count - 1);\n    Subsets(i + 1, path);\n}" } },
  { id: "q15", a: "O(n!)", q: {
    py: "for p in itertools.permutations(nums):\n    check(p)",
    java: "void permute(int i) {   // called as permute(0)\n    if (i == nums.length) {\n        check(nums);\n        return;\n    }\n    for (int j = i; j < nums.length; j++) {\n        swap(nums, i, j);\n        permute(i + 1);\n        swap(nums, i, j);\n    }\n}",
    cs: "void Permute(int i)   // called as Permute(0)\n{\n    if (i == nums.Length)\n    {\n        Check(nums);\n        return;\n    }\n    for (int j = i; j < nums.Length; j++)\n    {\n        (nums[i], nums[j]) = (nums[j], nums[i]);\n        Permute(i + 1);\n        (nums[i], nums[j]) = (nums[j], nums[i]);\n    }\n}" }, why: {
    py: "There are n! orderings.",
    java: "n choices for the first position, n - 1 for the next, and so on: n! orderings.",
    cs: "n choices for the first position, n - 1 for the next, and so on: n! orderings." } },
  { id: "q16", a: "O(n)", why: "Recursion depth equals the height, which is n for a skewed (linked-list-like) tree. Time is O(n) too.", q: {
    py: "def count(node):\n    if not node: return 0\n    return 1 + count(node.left) + count(node.right)\n\n# SPACE complexity on a skewed tree with n nodes?",
    java: "int count(TreeNode node) {\n    if (node == null) return 0;\n    return 1 + count(node.left) + count(node.right);\n}\n\n// SPACE complexity on a skewed tree with n nodes?",
    cs: "int Count(TreeNode node)\n{\n    if (node == null) return 0;\n    return 1 + Count(node.left) + Count(node.right);\n}\n\n// SPACE complexity on a skewed tree with n nodes?" } },
  { id: "q17", a: "O(n²)", q: {
    py: "def f(a):\n    if len(a) <= 1: return\n    f(a[1:])\n\n# TIME for a list of length n?",
    java: "void f(int[] a) {\n    if (a.length <= 1) return;\n    f(Arrays.copyOfRange(a, 1, a.length));\n}\n\n// TIME for an array of length n?",
    cs: "void F(int[] a)\n{\n    if (a.Length <= 1) return;\n    F(a[1..]);\n}\n\n// TIME for an array of length n?" }, why: {
    py: "n calls, each slicing a copy of O(n) elements. Slicing in recursion is a classic hidden cost.",
    java: "n calls, each copying O(n) elements. Copying subarrays in recursion is a classic hidden cost; pass a start index instead.",
    cs: "n calls, and a[1..] on an array copies O(n) elements each time. Copying in recursion is a classic hidden cost; pass a start index (or a Span) instead." } },
  { id: "q18", a: "O(n)", why: "It looks like a loop with branches, but l and r only ever move toward each other: at most n steps total.", q: {
    py: "def has_pair(a, target):\n    l, r = 0, len(a) - 1\n    while l < r:\n        s = a[l] + a[r]\n        if s == target: return True\n        if s < target: l += 1\n        else: r -= 1\n    return False",
    java: "boolean hasPair(int[] a, int target) {\n    int l = 0, r = a.length - 1;\n    while (l < r) {\n        int s = a[l] + a[r];\n        if (s == target) return true;\n        if (s < target) l++;\n        else r--;\n    }\n    return false;\n}",
    cs: "bool HasPair(int[] a, int target)\n{\n    int l = 0, r = a.Length - 1;\n    while (l < r)\n    {\n        int s = a[l] + a[r];\n        if (s == target) return true;\n        if (s < target) l++;\n        else r--;\n    }\n    return false;\n}" } },
  { id: "q19", a: "O(1)", q: {
    py: "x = nums[0]\ny = d['key']\nz = len(nums)",
    java: "int x = nums[0];\nint y = map.get(\"key\");\nint z = nums.length;",
    cs: "int x = nums[0];\nint y = map[\"key\"];\nint z = nums.Length;" }, why: {
    py: "Index, dict lookup and len are all constant time.",
    java: "Index, HashMap lookup and length are all constant time.",
    cs: "Index, Dictionary lookup and Length are all constant time." } },
  { id: "q20", a: "O(n²)", q: {
    py: "s = ''\nfor ch in text:\n    s = s + ch",
    java: "String s = \"\";\nfor (char ch : text.toCharArray())\n    s = s + ch;",
    cs: "string s = \"\";\nforeach (char ch in text)\n    s = s + ch;" }, why: {
    py: "Each concatenation can copy the whole string (strings are immutable). Collect characters in a list and join once for O(n).",
    java: "Each concatenation copies the whole string (strings are immutable). A StringBuilder makes it O(n).",
    cs: "Each concatenation copies the whole string (strings are immutable). A StringBuilder makes it O(n)." } },
];
