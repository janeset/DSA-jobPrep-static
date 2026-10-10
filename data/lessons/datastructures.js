// Data structures refresher: concepts, costs, built-ins, and code in Python, Java and C#.
// Java/C# snippets are focused fragments: put statements inside a method (or use top-level
// statements in C#) and keep the imports/usings shown at the top.

const DS_OVERVIEW = {
  table: [
    ["Array / dynamic array", "O(1)", "O(n)", "O(1)* at end, O(n) middle", "O(1) at end, O(n) middle"],
    ["String", "O(1)", "O(n)", "O(n) (new string)", "O(n) (new string)"],
    ["Linked list", "O(n)", "O(n)", "O(1) at a known node", "O(1) at a known node"],
    ["Stack", "O(1) top", "O(n)", "O(1) push", "O(1) pop"],
    ["Queue / deque", "O(1) ends", "O(n)", "O(1)", "O(1)"],
    ["Hash map / hash set", "n/a", "O(1) avg", "O(1) avg", "O(1) avg"],
    ["Balanced BST", "O(log n)", "O(log n)", "O(log n)", "O(log n)"],
    ["Heap / priority queue", "O(1) min/max", "O(n)", "O(log n)", "O(log n) pop"],
    ["Trie", "n/a", "O(L)", "O(L)", "O(L)"],
    ["Graph (adjacency list)", "n/a", "O(deg) edge check", "O(1) add edge", "O(deg)"],
    ["Union-Find", "n/a", "~O(1) find", "~O(1) union", "n/a"],
  ],
  choose: [
    ["Look things up by key, count, or group", "Hash map"],
    ["Check membership or remove duplicates", "Hash set"],
    ["Undo, matching brackets, 'most recent first'", "Stack"],
    ["Process in arrival order, BFS", "Queue / deque"],
    ["Repeatedly take the smallest or largest", "Heap"],
    ["Keep items sorted while inserting and deleting", "Balanced BST (TreeMap / SortedSet)"],
    ["Prefix search, autocomplete", "Trie"],
    ["Relationships, networks, dependencies", "Graph"],
    ["'Are these connected?' as edges are added", "Union-Find"],
    ["Index-based access, contiguous data", "Array"],
  ],
};

const DS = [
  {
    id: "array", name: "Array & dynamic array", short: "Ar",
    what: "A contiguous block of memory holding elements of one type. Index arithmetic makes access O(1). A dynamic array (Python list, Java ArrayList, C# List) grows by allocating a bigger block and copying, which is why append is O(1) amortized.",
    when: ["You need fast access by index", "Data is naturally ordered by position (scores, pixels, grid cells)", "Building blocks for two pointers, sliding window, prefix sums"],
    ops: [["Read / write by index", "O(1)"], ["Append at end", "O(1) amortized"], ["Insert / delete in the middle", "O(n)"], ["Search unsorted", "O(n)"], ["Search sorted (binary search)", "O(log n)"], ["Sort", "O(n log n)"]],
    builtin: { py: "list", java: "int[], ArrayList<T>", cs: "T[], List<T>" },
    pitfalls: ["Inserting or removing at the front is O(n): every element shifts.", "In Python, [[0] * c] * r creates rows that share one list. Use a comprehension.", "Off-by-one errors at the boundaries: test empty and single-element arrays."],
    code: {
      py: `nums = [3, 1, 4]          # dynamic array (list)
nums.append(1)            # O(1) amortized
x = nums[2]               # O(1) read
nums[0] = 9               # O(1) write
nums.insert(0, 7)         # O(n): shifts everything right
nums.pop()                # O(1) from the end
nums.sort()               # O(n log n)
print(nums, x)            # [1, 4, 7, 9] 4

grid = [[0] * 3 for _ in range(2)]   # 2-D array, rows are independent
grid[0][1] = 5
print(grid)               # [[0, 5, 0], [0, 0, 0]]`,
      java: `import java.util.*;

int[] fixedArr = new int[5];                     // fixed size, zero-filled
List<Integer> nums = new ArrayList<>(List.of(3, 1, 4));
nums.add(1);                                     // O(1) amortized
int x = nums.get(2);                             // O(1) read
nums.set(0, 9);                                  // O(1) write
nums.add(0, 7);                                  // O(n): shifts right
nums.remove(nums.size() - 1);                    // O(1) from the end
Collections.sort(nums);                          // O(n log n)
System.out.println(nums + " " + x);              // [1, 4, 7, 9] 4

int[][] grid = new int[2][3];                    // 2-D array
grid[0][1] = 5;`,
      cs: `using System;
using System.Collections.Generic;

int[] fixedArr = new int[5];                     // fixed size, zero-filled
var nums = new List<int> { 3, 1, 4 };
nums.Add(1);                                     // O(1) amortized
int x = nums[2];                                 // O(1) read
nums[0] = 9;                                     // O(1) write
nums.Insert(0, 7);                               // O(n): shifts right
nums.RemoveAt(nums.Count - 1);                   // O(1) from the end
nums.Sort();                                     // O(n log n)
Console.WriteLine(string.Join(", ", nums) + " " + x);   // 1, 4, 7, 9 4

int[,] grid = new int[2, 3];                     // 2-D array (or int[][] jagged)
grid[0, 1] = 5;`,
    },
  },
  {
    id: "string", name: "String", short: "Str",
    what: "A sequence of characters. In Python, Java and C# strings are immutable: every 'change' builds a new string. Many interview problems are really array problems on characters.",
    when: ["Parsing and text processing", "Anagram / palindrome / substring problems", "Character counting with a fixed 26-slot array"],
    ops: [["Read character by index", "O(1)"], ["Length", "O(1)"], ["Concatenate", "O(n + m)"], ["Substring / slice", "O(k)"], ["Find substring (naive)", "O(n * m)"], ["Build with a builder / join", "O(total length)"]],
    builtin: { py: "str (+ list for building)", java: "String, StringBuilder", cs: "string, StringBuilder" },
    pitfalls: ["s += c inside a loop can be O(n²). Use a list + join or a StringBuilder.", "In Java, compare content with .equals(), never ==.", "C# Substring takes (start, length); Java substring takes (start, end)."],
    code: {
      py: `s = "hello"
print(s[0], s[-1], s[1:4])     # h o ell
print(s.upper(), s.split("l")) # new strings: s itself never changes

parts = []
for ch in s:
    parts.append(ch.upper())
built = "".join(parts)         # O(n) instead of += in a loop
print(built)                   # HELLO

counts = [0] * 26
for ch in s:
    counts[ord(ch) - ord("a")] += 1
print(counts[ord("l") - ord("a")])   # 2`,
      java: `import java.util.*;

String s = "hello";
char c = s.charAt(0);                            // 'h'
String sub = s.substring(1, 4);                  // "ell" (start, end)
char[] arr = s.toCharArray();                    // mutable copy
Arrays.sort(arr);

StringBuilder sb = new StringBuilder();
for (char ch : s.toCharArray()) sb.append(Character.toUpperCase(ch));
String built = sb.toString();                    // "HELLO"

int[] counts = new int[26];
for (char ch : s.toCharArray()) counts[ch - 'a']++;
boolean same = s.equals("hello");                // never == for content`,
      cs: `using System;
using System.Text;

string s = "hello";
char c = s[0];                                   // 'h'
string sub = s.Substring(1, 3);                  // "ell" (start, length)
char[] arr = s.ToCharArray();
Array.Sort(arr);

var sb = new StringBuilder();
foreach (char ch in s) sb.Append(char.ToUpper(ch));
string built = sb.ToString();                    // "HELLO"

int[] counts = new int[26];
foreach (char ch in s) counts[ch - 'a']++;
bool same = s == "hello";                        // == compares content in C#`,
    },
  },
  {
    id: "linkedlist", name: "Linked list", short: "LL",
    what: "Nodes that each hold a value and a pointer to the next node (and the previous one, in a doubly linked list). There's no index arithmetic, so reaching the k-th node means walking k steps, but splicing nodes in or out is O(1) once you're there.",
    when: ["Interview problems that give you a ListNode", "O(1) insert/remove at a known position (LRU cache)", "Merging or reordering sequences without copying"],
    ops: [["Access k-th element", "O(k)"], ["Insert / delete at head", "O(1)"], ["Insert / delete after a known node", "O(1)"], ["Search", "O(n)"], ["Find middle / detect cycle (fast & slow)", "O(n), O(1) space"]],
    builtin: { py: "None built-in (use your own ListNode; deque for O(1) ends)", java: "LinkedList<T> (doubly linked)", cs: "LinkedList<T> (doubly linked)" },
    pitfalls: ["Lose the rest of the list by overwriting .next before saving it.", "Use a dummy head node to avoid special cases at the front.", "Always check node and node.next for null before following them."],
    code: {
      py: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

head = ListNode(1, ListNode(2, ListNode(3)))   # 1 -> 2 -> 3

def reverse(head):
    prev = None
    while head:
        nxt = head.next      # save the rest before rewiring
        head.next = prev
        prev, head = head, nxt
    return prev

node = reverse(head)
values = []
while node:
    values.append(node.val)
    node = node.next
print(values)                # [3, 2, 1]`,
      java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

static ListNode reverse(ListNode head) {
    ListNode prev = null;
    while (head != null) {
        ListNode nxt = head.next;     // save the rest before rewiring
        head.next = prev;
        prev = head;
        head = nxt;
    }
    return prev;
}

// usage
ListNode head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);
ListNode reversed = reverse(head);    // 3 -> 2 -> 1`,
      cs: `public class ListNode {
    public int val;
    public ListNode next;
    public ListNode(int val) { this.val = val; }
}

static ListNode Reverse(ListNode head) {
    ListNode prev = null;
    while (head != null) {
        var nxt = head.next;          // save the rest before rewiring
        head.next = prev;
        prev = head;
        head = nxt;
    }
    return prev;
}

// usage
var head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);
var reversed = Reverse(head);         // 3 -> 2 -> 1`,
    },
  },
  {
    id: "stack", name: "Stack", short: "Stk",
    what: "Last in, first out (LIFO). You only touch the top: push adds to it, pop removes from it. The call stack that runs recursion is literally a stack.",
    when: ["Matching brackets, undo, backtracking state", "'Next greater / smaller element' (monotonic stack)", "Turning recursion into iteration (iterative DFS)"],
    ops: [["Push", "O(1)"], ["Pop", "O(1)"], ["Peek top", "O(1)"], ["Search", "O(n)"]],
    builtin: { py: "list (append / pop / [-1])", java: "ArrayDeque<T> (push / pop / peek)", cs: "Stack<T>" },
    pitfalls: ["Popping or peeking an empty stack throws (or returns None). Check first.", "In Java prefer ArrayDeque over the legacy synchronized Stack class.", "Java: compare boxed Characters/Integers with .equals(), not ==."],
    code: {
      py: `stack = []
stack.append(1)        # push
stack.append(2)
print(stack[-1])       # peek -> 2
print(stack.pop())     # pop  -> 2
print(not stack)       # empty? -> False

def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    st = []
    for ch in s:
        if ch in pairs:
            if not st or st.pop() != pairs[ch]:
                return False
        else:
            st.append(ch)
    return not st

print(is_valid("([]{})"), is_valid("(]"))   # True False`,
      java: `import java.util.*;

Deque<Integer> stack = new ArrayDeque<>();   // preferred over legacy Stack
stack.push(1);
stack.push(2);
int top = stack.peek();                      // 2
stack.pop();                                 // 2
boolean isEmpty = stack.isEmpty();

static boolean isValid(String s) {
    Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');
    Deque<Character> st = new ArrayDeque<>();
    for (char ch : s.toCharArray()) {
        if (pairs.containsKey(ch)) {
            if (st.isEmpty() || !st.pop().equals(pairs.get(ch))) return false;
        } else {
            st.push(ch);
        }
    }
    return st.isEmpty();
}`,
      cs: `using System.Collections.Generic;

var stack = new Stack<int>();
stack.Push(1);
stack.Push(2);
int top = stack.Peek();                      // 2
stack.Pop();                                 // 2
bool isEmpty = stack.Count == 0;

static bool IsValid(string s) {
    var pairs = new Dictionary<char, char> { [')'] = '(', [']'] = '[', ['}'] = '{' };
    var st = new Stack<char>();
    foreach (char ch in s) {
        if (pairs.ContainsKey(ch)) {
            if (st.Count == 0 || st.Pop() != pairs[ch]) return false;
        } else {
            st.Push(ch);
        }
    }
    return st.Count == 0;
}`,
    },
  },
  {
    id: "queue", name: "Queue & deque", short: "Q",
    what: "A queue is first in, first out (FIFO): add at the back, remove from the front. A deque (double-ended queue) allows O(1) adds and removes at both ends, so it can act as a stack or a queue.",
    when: ["Breadth-first search (level by level)", "Processing tasks in arrival order", "Sliding window maximum (monotonic deque)"],
    ops: [["Enqueue (back)", "O(1)"], ["Dequeue (front)", "O(1)"], ["Peek front", "O(1)"], ["Deque: push/pop either end", "O(1)"], ["Search", "O(n)"]],
    builtin: { py: "collections.deque", java: "ArrayDeque<T> (Queue / Deque)", cs: "Queue<T>; LinkedList<T> as a deque" },
    pitfalls: ["Python list.pop(0) is O(n). Always use deque.popleft().", "Java poll()/peek() return null on empty; remove()/element() throw.", "Mark nodes as seen when you enqueue them (not when you dequeue) to avoid duplicates in BFS."],
    code: {
      py: `from collections import deque

q = deque()
q.append(1)            # enqueue at the back
q.append(2)
print(q[0])            # peek front -> 1
print(q.popleft())     # dequeue -> 1  (O(1); list.pop(0) is O(n))
q.appendleft(0)        # deque: add at the front too
q.pop()                # remove from the back
print(list(q))         # [0]

def bfs(start, neighbors):
    seen, q = {start}, deque([start])
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for nb in neighbors(node):
            if nb not in seen:
                seen.add(nb)       # mark when enqueued
                q.append(nb)
    return order

graph = {1: [2, 3], 2: [4], 3: [4], 4: []}
print(bfs(1, lambda n: graph[n]))   # [1, 2, 3, 4]`,
      java: `import java.util.*;

Queue<Integer> q = new ArrayDeque<>();
q.offer(1);                     // enqueue
q.offer(2);
int front = q.peek();           // 1
q.poll();                       // dequeue -> 1 (null if empty)

Deque<Integer> dq = new ArrayDeque<>();
dq.offerFirst(0);               // add at the front
dq.offerLast(9);                // add at the back
dq.pollLast();                  // 9
dq.pollFirst();                 // 0`,
      cs: `using System.Collections.Generic;

var q = new Queue<int>();
q.Enqueue(1);
q.Enqueue(2);
int front = q.Peek();           // 1
q.Dequeue();                    // 1 (throws if empty; use TryDequeue to avoid)

// Deque: LinkedList<T> gives O(1) at both ends
var dq = new LinkedList<int>();
dq.AddFirst(0);
dq.AddLast(9);
dq.RemoveLast();                // removes 9
int first = dq.First.Value;     // 0`,
    },
  },
  {
    id: "hashmap", name: "Hash map", short: "HM",
    what: "Stores key -> value pairs. A hash function turns each key into a bucket index, so lookups, inserts and deletes are O(1) on average. Keys must be hashable/immutable (or have consistent equals and hashCode).",
    when: ["Counting frequencies", "'Have I seen this before?' with extra info (like an index)", "Grouping items by a computed key", "Memoization caches"],
    ops: [["Get / put / delete", "O(1) average"], ["Contains key", "O(1) average"], ["Iterate all entries", "O(n)"], ["Worst case (many collisions)", "O(n)"]],
    builtin: { py: "dict, collections.Counter, defaultdict", java: "HashMap<K, V> (LinkedHashMap keeps order)", cs: "Dictionary<TKey, TValue>" },
    pitfalls: ["Reading a missing key throws in Python (KeyError) and C# (KeyNotFoundException); Java returns null.", "Mutable keys (Python lists) can't be used. Convert to a tuple.", "Don't modify a map while iterating over it."],
    code: {
      py: `from collections import defaultdict, Counter

ages = {"ana": 31}
ages["bo"] = 25                  # insert / update, O(1) avg
print(ages.get("cy", 0))         # lookup with a default -> 0
print("ana" in ages)             # O(1) membership -> True
del ages["bo"]
for name, age in ages.items():
    print(name, age)             # ana 31

counts = Counter("banana")
print(counts["a"], counts.most_common(1))   # 3 [('a', 3)]

groups = defaultdict(list)       # missing keys start as []
for word in ["eat", "tea", "tan"]:
    groups["".join(sorted(word))].append(word)
print(dict(groups))              # {'aet': ['eat', 'tea'], 'ant': ['tan']}`,
      java: `import java.util.*;

Map<String, Integer> ages = new HashMap<>();
ages.put("ana", 31);
ages.put("bo", 25);
int cy = ages.getOrDefault("cy", 0);             // 0
boolean has = ages.containsKey("ana");           // true
ages.remove("bo");
for (Map.Entry<String, Integer> e : ages.entrySet())
    System.out.println(e.getKey() + " " + e.getValue());

Map<Character, Integer> counts = new HashMap<>();
for (char ch : "banana".toCharArray()) counts.merge(ch, 1, Integer::sum);

Map<String, List<String>> groups = new HashMap<>();
for (String w : List.of("eat", "tea", "tan")) {
    char[] key = w.toCharArray();
    Arrays.sort(key);
    groups.computeIfAbsent(new String(key), k -> new ArrayList<>()).add(w);
}`,
      cs: `using System;
using System.Collections.Generic;

var ages = new Dictionary<string, int>();
ages["ana"] = 31;
ages["bo"] = 25;
int cy = ages.GetValueOrDefault("cy", 0);        // 0
bool has = ages.ContainsKey("ana");              // true
ages.Remove("bo");
foreach (var (name, age) in ages)
    Console.WriteLine($"{name} {age}");

if (ages.TryGetValue("ana", out int anaAge))     // safe lookup
    Console.WriteLine(anaAge);

var counts = new Dictionary<char, int>();
foreach (char ch in "banana")
    counts[ch] = counts.GetValueOrDefault(ch) + 1;`,
    },
  },
  {
    id: "hashset", name: "Hash set", short: "HS",
    what: "A hash map without values: it stores unique keys and answers 'is x in here?' in O(1) on average. Also supports set algebra (union, intersection, difference).",
    when: ["Removing duplicates", "Visited sets in BFS / DFS", "Fast membership checks instead of scanning a list"],
    ops: [["Add / remove / contains", "O(1) average"], ["Union / intersection", "O(n + m)"], ["Iterate", "O(n)"]],
    builtin: { py: "set, frozenset", java: "HashSet<T> (TreeSet if sorted)", cs: "HashSet<T> (SortedSet if sorted)" },
    pitfalls: ["Sets are unordered: don't rely on iteration order.", "x in list is O(n) but x in set is O(1). Convert once if you check many times.", "add() returns false (Java/C#) when the item already exists, which is a handy duplicate check."],
    code: {
      py: `seen = set()
seen.add(3)
print(3 in seen)          # O(1) avg -> True
seen.discard(4)           # no error if missing (remove() would raise)

a, b = {1, 2, 3}, {2, 3, 4}
print(a & b, a | b, a - b)    # {2, 3} {1, 2, 3, 4} {1}
print(set([1, 1, 2]))         # {1, 2}

def has_duplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False

print(has_duplicate([1, 2, 3, 1]))   # True`,
      java: `import java.util.*;

Set<Integer> seen = new HashSet<>();
seen.add(3);                                     // returns false if already present
boolean has = seen.contains(3);                  // true
seen.remove(4);

Set<Integer> a = new HashSet<>(List.of(1, 2, 3));
Set<Integer> b = new HashSet<>(List.of(2, 3, 4));
Set<Integer> inter = new HashSet<>(a); inter.retainAll(b);   // [2, 3]
Set<Integer> union = new HashSet<>(a); union.addAll(b);      // [1, 2, 3, 4]
Set<Integer> diff = new HashSet<>(a);  diff.removeAll(b);    // [1]`,
      cs: `using System.Collections.Generic;

var seen = new HashSet<int>();
seen.Add(3);                                     // returns false if already present
bool has = seen.Contains(3);                     // true
seen.Remove(4);

var a = new HashSet<int> { 1, 2, 3 };
var b = new HashSet<int> { 2, 3, 4 };
var inter = new HashSet<int>(a); inter.IntersectWith(b);   // {2, 3}
var union = new HashSet<int>(a); union.UnionWith(b);       // {1, 2, 3, 4}
var diff = new HashSet<int>(a);  diff.ExceptWith(b);       // {1}`,
    },
  },
  {
    id: "tree", name: "Binary tree", short: "BT",
    what: "Each node has up to two children (left, right). Trees are recursive by nature: most solutions are 'do something at this node, then recurse on both children'. Traversals: preorder (node, left, right), inorder (left, node, right), postorder (left, right, node), and level order (BFS).",
    when: ["Hierarchical data", "Most 'tree' interview problems: depth, paths, symmetry, views", "Expression trees, decision trees, recursion practice"],
    ops: [["Visit every node (any traversal)", "O(n)"], ["Height / depth", "O(n)"], ["Search (unsorted tree)", "O(n)"], ["Recursion stack", "O(h): log n balanced, n skewed"]],
    builtin: { py: "None (write your own TreeNode)", java: "None (write your own TreeNode)", cs: "None (write your own TreeNode)" },
    pitfalls: ["Always handle the empty tree (root is None/null) first.", "Decide what each recursive call returns before writing it.", "Deep, skewed trees can overflow the recursion stack. Use an explicit stack if needed."],
    code: {
      py: `from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right

#       1
#      / \\
#     2   3
#    / \\
#   4   5
root = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3))

def preorder(node):            # node, left, right
    if not node:
        return []
    return [node.val] + preorder(node.left) + preorder(node.right)

def inorder(node):             # left, node, right
    if not node:
        return []
    return inorder(node.left) + [node.val] + inorder(node.right)

def height(node):
    return 0 if not node else 1 + max(height(node.left), height(node.right))

def level_order(root):         # BFS, one list per level
    res, q = [], deque([root] if root else [])
    while q:
        res.append([n.val for n in q])
        for _ in range(len(q)):
            n = q.popleft()
            if n.left: q.append(n.left)
            if n.right: q.append(n.right)
    return res

print(preorder(root), inorder(root))   # [1, 2, 4, 5, 3] [4, 2, 5, 1, 3]
print(height(root), level_order(root)) # 3 [[1], [2, 3], [4, 5]]`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

static void inorder(TreeNode node, List<Integer> out) {
    if (node == null) return;
    inorder(node.left, out);
    out.add(node.val);
    inorder(node.right, out);
}

static int height(TreeNode node) {
    return node == null ? 0 : 1 + Math.max(height(node.left), height(node.right));
}

static List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    Queue<TreeNode> q = new ArrayDeque<>();
    if (root != null) q.offer(root);
    while (!q.isEmpty()) {
        List<Integer> level = new ArrayList<>();
        for (int i = q.size(); i > 0; i--) {
            TreeNode n = q.poll();
            level.add(n.val);
            if (n.left != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
        res.add(level);
    }
    return res;
}`,
      cs: `using System;
using System.Collections.Generic;

public class TreeNode {
    public int val;
    public TreeNode left, right;
    public TreeNode(int val) { this.val = val; }
}

static void Inorder(TreeNode node, List<int> output) {
    if (node == null) return;
    Inorder(node.left, output);
    output.Add(node.val);
    Inorder(node.right, output);
}

static int Height(TreeNode node) =>
    node == null ? 0 : 1 + Math.Max(Height(node.left), Height(node.right));

static List<List<int>> LevelOrder(TreeNode root) {
    var res = new List<List<int>>();
    var q = new Queue<TreeNode>();
    if (root != null) q.Enqueue(root);
    while (q.Count > 0) {
        var level = new List<int>();
        for (int i = q.Count; i > 0; i--) {
            var n = q.Dequeue();
            level.Add(n.val);
            if (n.left != null) q.Enqueue(n.left);
            if (n.right != null) q.Enqueue(n.right);
        }
        res.Add(level);
    }
    return res;
}`,
    },
  },
  {
    id: "bst", name: "Binary search tree", short: "BST",
    what: "A binary tree with an ordering rule: everything in the left subtree is smaller than the node, everything in the right subtree is larger. That makes search, insert and delete O(h). Balanced trees (red-black, AVL) keep h = O(log n); an unbalanced one can degrade to a linked list.",
    when: ["Keep data sorted while inserting and deleting", "Floor / ceiling / range queries ('largest value <= x')", "Inorder traversal gives sorted output"],
    ops: [["Search / insert / delete (balanced)", "O(log n)"], ["Same, unbalanced worst case", "O(n)"], ["Min / max", "O(log n)"], ["Sorted iteration (inorder)", "O(n)"]],
    builtin: { py: "None built-in (bisect on a sorted list, or sortedcontainers)", java: "TreeMap<K, V>, TreeSet<T>", cs: "SortedDictionary<K, V>, SortedSet<T>" },
    pitfalls: ["Validating a BST needs a (low, high) range, not just comparing a node to its children.", "Inserting already-sorted data into a plain BST makes it a linked list.", "Decide how to handle duplicates (left, right, or a count)."],
    code: {
      py: `import bisect

class TreeNode:
    def __init__(self, val):
        self.val, self.left, self.right = val, None, None

def insert(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root

def search(root, val):
    while root and root.val != val:
        root = root.left if val < root.val else root.right
    return root is not None

root = None
for v in [5, 3, 8, 1, 4]:
    root = insert(root, v)
print(search(root, 4), search(root, 7))   # True False

# Python has no built-in balanced BST. For sorted data with lookups,
# keep a sorted list and binary search it with bisect:
data = [1, 3, 4, 5, 8]
i = bisect.bisect_right(data, 6)
print(data[i - 1], data[i])               # floor(6)=5, ceiling(6)=8`,
      java: `import java.util.*;

static TreeNode insert(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    if (val < root.val) root.left = insert(root.left, val);
    else root.right = insert(root.right, val);
    return root;
}

static boolean search(TreeNode root, int val) {
    while (root != null && root.val != val)
        root = val < root.val ? root.left : root.right;
    return root != null;
}

// Built-in balanced BST (red-black tree): TreeSet / TreeMap
TreeSet<Integer> set = new TreeSet<>(List.of(5, 3, 8, 1, 4));
Integer floor = set.floor(6);        // 5 (largest <= 6), null if none
Integer ceil = set.ceiling(6);       // 8 (smallest >= 6)
int min = set.first();               // 1
TreeMap<String, Integer> map = new TreeMap<>();   // keys kept sorted`,
      cs: `using System.Collections.Generic;
using System.Linq;

static TreeNode Insert(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    if (val < root.val) root.left = Insert(root.left, val);
    else root.right = Insert(root.right, val);
    return root;
}

static bool Search(TreeNode root, int val) {
    while (root != null && root.val != val)
        root = val < root.val ? root.left : root.right;
    return root != null;
}

// Built-in balanced BST (red-black tree): SortedSet / SortedDictionary
var set = new SortedSet<int> { 5, 3, 8, 1, 4 };
int min = set.Min;                               // 1
int max = set.Max;                               // 8
var between = set.GetViewBetween(3, 6);          // {3, 4, 5}
int floor = between.Max;                         // 5 = largest in [3, 6]`,
    },
  },
  {
    id: "heap", name: "Heap / priority queue", short: "Hp",
    what: "A complete binary tree stored in an array where every parent is <= its children (min-heap). The smallest item is always at the top, and push/pop rebalance in O(log n). A priority queue is the abstract idea; a heap is how it's built.",
    when: ["Top-k / k-th largest or smallest", "Repeatedly process the cheapest next item (Dijkstra, scheduling)", "Merging k sorted lists, running median"],
    ops: [["Peek min (or max)", "O(1)"], ["Push", "O(log n)"], ["Pop min", "O(log n)"], ["Build from n items (heapify)", "O(n)"], ["Search arbitrary item", "O(n)"]],
    builtin: { py: "heapq (min-heap on a list)", java: "PriorityQueue<T> (min-heap)", cs: "PriorityQueue<TElement, TPriority> (.NET 6+)" },
    pitfalls: ["Python heapq is min-only: push negated values for a max-heap.", "A heap is not sorted: only the top is guaranteed.", "For ties in Python tuples, add a counter so non-comparable items are never compared."],
    code: {
      py: `import heapq

h = []
for x in [5, 1, 3]:
    heapq.heappush(h, x)      # O(log n)
print(h[0])                   # peek min -> 1
print(heapq.heappop(h))       # pop min -> 1

nums = [5, 1, 8, 3]
heapq.heapify(nums)           # O(n), in place

max_h = []                    # max-heap: store negatives
for x in [5, 1, 8]:
    heapq.heappush(max_h, -x)
print(-max_h[0])              # 8

tasks = [(2, "write"), (1, "plan")]     # (priority, item)
heapq.heapify(tasks)
print(heapq.heappop(tasks))             # (1, 'plan')
print(heapq.nlargest(2, [5, 1, 8, 3]))  # [8, 5]`,
      java: `import java.util.*;

PriorityQueue<Integer> minHeap = new PriorityQueue<>();
minHeap.offer(5);
minHeap.offer(1);
minHeap.offer(3);
int smallest = minHeap.peek();                   // 1
minHeap.poll();                                  // 1

PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
maxHeap.addAll(List.of(5, 1, 8));
int largest = maxHeap.peek();                    // 8

// Custom priority: int[] {priority, id}, ordered by priority
PriorityQueue<int[]> tasks = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
tasks.offer(new int[]{2, 7});
tasks.offer(new int[]{1, 9});
int[] next = tasks.poll();                       // {1, 9}`,
      cs: `using System.Collections.Generic;

// .NET 6+: PriorityQueue<TElement, TPriority> is a min-heap on the priority
var pq = new PriorityQueue<string, int>();
pq.Enqueue("write", 2);
pq.Enqueue("plan", 1);
string next = pq.Peek();                         // "plan"
pq.Dequeue();                                    // "plan"
int size = pq.Count;                             // 1

// Max-heap: flip the priority comparer
var maxHeap = new PriorityQueue<int, int>(Comparer<int>.Create((a, b) => b.CompareTo(a)));
foreach (int x in new[] { 5, 1, 8 }) maxHeap.Enqueue(x, x);
int largest = maxHeap.Peek();                    // 8`,
    },
  },
  {
    id: "trie", name: "Trie (prefix tree)", short: "Tr",
    what: "A tree where each edge is a character and each path from the root spells a prefix. Words sharing a prefix share nodes, so prefix lookups cost O(L) in the length of the word, regardless of how many words are stored.",
    when: ["Autocomplete and 'starts with' queries", "Word search on a grid with many words", "Spell checking, IP routing (longest prefix)"],
    ops: [["Insert word of length L", "O(L)"], ["Search word", "O(L)"], ["Starts-with (prefix)", "O(L)"], ["Space", "O(total characters)"]],
    builtin: { py: "None (nested dicts or a TrieNode class)", java: "None (Node with children array or map)", cs: "None (Node with Dictionary children)" },
    pitfalls: ["Mark the end of a word explicitly: 'app' isn't stored just because 'apple' is.", "A 26-slot array is fast but assumes lowercase a-z; use a map otherwise.", "Prune nodes in Word Search II after finding a word to avoid repeats."],
    code: {
      py: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
        node.is_word = True

    def _walk(self, s):
        node = self.root
        for ch in s:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node

    def search(self, word):
        node = self._walk(word)
        return node is not None and node.is_word

    def starts_with(self, prefix):
        return self._walk(prefix) is not None

t = Trie()
t.insert("apple")
print(t.search("apple"), t.search("app"), t.starts_with("app"))   # True False True`,
      java: `class Trie {
    private static class Node {
        Node[] next = new Node[26];
        boolean isWord;
    }
    private final Node root = new Node();

    void insert(String word) {
        Node node = root;
        for (char ch : word.toCharArray()) {
            int i = ch - 'a';
            if (node.next[i] == null) node.next[i] = new Node();
            node = node.next[i];
        }
        node.isWord = true;
    }

    private Node walk(String s) {
        Node node = root;
        for (char ch : s.toCharArray()) {
            node = node.next[ch - 'a'];
            if (node == null) return null;
        }
        return node;
    }

    boolean search(String word) { Node n = walk(word); return n != null && n.isWord; }
    boolean startsWith(String prefix) { return walk(prefix) != null; }
}`,
      cs: `using System.Collections.Generic;

public class Trie {
    private class Node {
        public Dictionary<char, Node> Next = new();
        public bool IsWord;
    }
    private readonly Node root = new();

    public void Insert(string word) {
        var node = root;
        foreach (char ch in word) {
            if (!node.Next.TryGetValue(ch, out var child)) {
                child = new Node();
                node.Next[ch] = child;
            }
            node = child;
        }
        node.IsWord = true;
    }

    private Node Walk(string s) {
        var node = root;
        foreach (char ch in s)
            if (!node.Next.TryGetValue(ch, out node)) return null;
        return node;
    }

    public bool Search(string word) => Walk(word)?.IsWord == true;
    public bool StartsWith(string prefix) => Walk(prefix) != null;
}`,
    },
  },
  {
    id: "graph", name: "Graph", short: "G",
    what: "Vertices (nodes) connected by edges, directed or undirected, optionally weighted. Interviews almost always use an adjacency list: for each node, the list of its neighbours. Grids are graphs too: each cell's neighbours are up, down, left, right.",
    when: ["Networks, maps, dependencies (course prerequisites)", "Connected components, flood fill on grids", "Shortest paths (BFS unweighted, Dijkstra weighted), topological sort"],
    ops: [["Build adjacency list", "O(V + E)"], ["BFS / DFS traversal", "O(V + E)"], ["Check edge u-v (adjacency list)", "O(deg(u))"], ["Dijkstra with a heap", "O((V + E) log V)"], ["Space", "O(V + E)"]],
    builtin: { py: "None (dict of lists / defaultdict(list))", java: "None (List<List<Integer>> or Map)", cs: "None (List<int>[] or Dictionary)" },
    pitfalls: ["Forgetting a visited set causes infinite loops on cycles.", "Undirected graphs need both directions added.", "Graphs can be disconnected: loop over every node as a possible start."],
    code: {
      py: `from collections import defaultdict, deque

edges = [(0, 1), (0, 2), (1, 3), (2, 3)]
graph = defaultdict(list)            # adjacency list
for a, b in edges:
    graph[a].append(b)
    graph[b].append(a)               # drop this line for a directed graph

def dfs(node, seen):
    seen.add(node)
    for nb in graph[node]:
        if nb not in seen:
            dfs(nb, seen)
    return seen

def shortest_path(start, goal):      # BFS = fewest edges
    dist, q = {start: 0}, deque([start])
    while q:
        node = q.popleft()
        if node == goal:
            return dist[node]
        for nb in graph[node]:
            if nb not in dist:
                dist[nb] = dist[node] + 1
                q.append(nb)
    return -1

print(sorted(dfs(0, set())), shortest_path(0, 3))   # [0, 1, 2, 3] 2`,
      java: `import java.util.*;

int n = 4;
int[][] edges = {{0, 1}, {0, 2}, {1, 3}, {2, 3}};
List<List<Integer>> graph = new ArrayList<>();
for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
for (int[] e : edges) {
    graph.get(e[0]).add(e[1]);
    graph.get(e[1]).add(e[0]);       // omit for a directed graph
}

// BFS shortest path (fewest edges) from node 0
int[] dist = new int[n];
Arrays.fill(dist, -1);
dist[0] = 0;
Queue<Integer> q = new ArrayDeque<>(List.of(0));
while (!q.isEmpty()) {
    int node = q.poll();
    for (int nb : graph.get(node)) {
        if (dist[nb] == -1) {
            dist[nb] = dist[node] + 1;
            q.offer(nb);
        }
    }
}
// dist[3] == 2`,
      cs: `using System.Collections.Generic;
using System.Linq;

int n = 4;
int[][] edges = { new[] { 0, 1 }, new[] { 0, 2 }, new[] { 1, 3 }, new[] { 2, 3 } };
var graph = new List<int>[n];
for (int i = 0; i < n; i++) graph[i] = new List<int>();
foreach (var e in edges) {
    graph[e[0]].Add(e[1]);
    graph[e[1]].Add(e[0]);           // omit for a directed graph
}

// BFS shortest path (fewest edges) from node 0
int[] dist = Enumerable.Repeat(-1, n).ToArray();
dist[0] = 0;
var q = new Queue<int>(new[] { 0 });
while (q.Count > 0) {
    int node = q.Dequeue();
    foreach (int nb in graph[node]) {
        if (dist[nb] == -1) {
            dist[nb] = dist[node] + 1;
            q.Enqueue(nb);
        }
    }
}
// dist[3] == 2`,
    },
  },
  {
    id: "unionfind", name: "Union-Find (disjoint set)", short: "UF",
    what: "Tracks which items belong to the same group. find(x) returns the group's representative; union(a, b) merges two groups. With path compression and union by size, both are effectively O(1) (inverse Ackermann).",
    when: ["Connected components as edges arrive", "Detecting a cycle in an undirected graph", "Kruskal's minimum spanning tree, 'accounts merge' style grouping"],
    ops: [["find", "~O(1) amortized"], ["union", "~O(1) amortized"], ["Build for n items", "O(n)"], ["Space", "O(n)"]],
    builtin: { py: "None (two small arrays)", java: "None", cs: "None" },
    pitfalls: ["Union the roots, not the original nodes.", "Without path compression and union by size, it can degrade to O(n) per find.", "Map non-integer items (strings, coordinates) to ids first."],
    code: {
      py: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]   # path halving
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False                   # already connected (a cycle edge)
        if self.size[ra] < self.size[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra               # attach smaller under larger
        self.size[ra] += self.size[rb]
        return True

uf = UnionFind(5)
uf.union(0, 1)
uf.union(3, 4)
print(uf.find(1) == uf.find(0), uf.find(1) == uf.find(3))   # True False
print(uf.union(1, 0))                                         # False`,
      java: `class UnionFind {
    private final int[] parent, size;

    UnionFind(int n) {
        parent = new int[n];
        size = new int[n];
        for (int i = 0; i < n; i++) { parent[i] = i; size[i] = 1; }
    }

    int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];   // path halving
            x = parent[x];
        }
        return x;
    }

    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;          // already connected
        if (size[ra] < size[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;                     // attach smaller under larger
        size[ra] += size[rb];
        return true;
    }
}`,
      cs: `public class UnionFind {
    private readonly int[] parent, size;

    public UnionFind(int n) {
        parent = new int[n];
        size = new int[n];
        for (int i = 0; i < n; i++) { parent[i] = i; size[i] = 1; }
    }

    public int Find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];   // path halving
            x = parent[x];
        }
        return x;
    }

    public bool Union(int a, int b) {
        int ra = Find(a), rb = Find(b);
        if (ra == rb) return false;          // already connected
        if (size[ra] < size[rb]) (ra, rb) = (rb, ra);
        parent[rb] = ra;                     // attach smaller under larger
        size[ra] += size[rb];
        return true;
    }
}`,
    },
  },
];
