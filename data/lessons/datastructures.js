// Data structures refresher: concepts, costs, built-ins, and code in Python, Java and C#.
// Java/C# snippets are focused fragments: put statements inside a method (or use top-level
// statements in C#) and keep the imports/usings shown at the top.
// `practice` holds good vs bad code pairs (shown after the code, like the principles lessons).

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
    what: {
      py: "A contiguous block of memory holding elements of one type. Index arithmetic makes access O(1). Python's list is a dynamic array: it grows by allocating a bigger block and copying, which is why append is O(1) amortized.",
      java: "A contiguous block of memory holding elements of one type. Index arithmetic makes access O(1). An int[] has a fixed size; ArrayList is a dynamic array that grows by allocating a bigger block and copying, which is why add is O(1) amortized.",
      cs: "A contiguous block of memory holding elements of one type. Index arithmetic makes access O(1). An int[] has a fixed size; List<T> is a dynamic array that grows by allocating a bigger block and copying, which is why Add is O(1) amortized.",
    },
    when: ["You need fast access by index", "Data is naturally ordered by position (scores, pixels, grid cells)", "Building blocks for two pointers, sliding window, prefix sums"],
    ops: [["Read / write by index", "O(1)"], ["Append at end", "O(1) amortized"], ["Insert / delete in the middle", "O(n)"], ["Search unsorted", "O(n)"], ["Search sorted (binary search)", "O(log n)"], ["Sort", "O(n log n)"]],
    builtin: { py: "list", java: "int[], ArrayList<T>", cs: "T[], List<T>" },
    pitfalls: ["Inserting or removing at the front is O(n): every element shifts.",
      { py: "[[0] * c] * r creates rows that share one list. Use a comprehension: [[0] * c for _ in range(r)].",
        java: "Arrays.fill(grid, row) puts the same row object in every slot. new int[r][c] creates independent rows.",
        cs: "A jagged array new int[r][] starts with every row null: create each row in a loop, or use int[r, c]." },
      "Off-by-one errors at the boundaries: test empty and single-element arrays."],
    practice: [
      { why: "Inserting at the front shifts every element, so building a list that way is O(n²). Append (O(1)) and reverse once at the end.",
        bad: { py: `res = []
for x in nums:
    res.insert(0, x)        # shifts everything: O(n) each time`, java: `List<Integer> res = new ArrayList<>();
for (int x : nums) {
    res.add(0, x);          // shifts everything: O(n) each time
}`, cs: `var res = new List<int>();
foreach (int x in nums)
{
    res.Insert(0, x);       // shifts everything: O(n) each time
}` },
        good: { py: `res = []
for x in nums:
    res.append(x)           # O(1) amortized
res.reverse()               # once, O(n)`, java: `List<Integer> res = new ArrayList<>();
for (int x : nums) {
    res.add(x);             // O(1) amortized
}
Collections.reverse(res);   // once, O(n)`, cs: `var res = new List<int>();
foreach (int x in nums)
{
    res.Add(x);             // O(1) amortized
}
res.Reverse();              // once, O(n)` } },
      { why: { py: "Removing from a list while looping over it shifts the items under the loop, so some are skipped. Build a new list instead.",
          java: "Removing from a list inside a for-each throws `ConcurrentModificationException`. `removeIf` does it safely in one pass.",
          cs: "Removing from a list inside `foreach` throws `InvalidOperationException`. `RemoveAll` does it safely in one pass." },
        bad: { py: `for x in nums:
    if x < 0:
        nums.remove(x)      # [-1, -2, 3] leaves [-2, 3]`, java: `for (Integer x : nums) {
    if (x < 0) nums.remove(x);   // ConcurrentModificationException
}`, cs: `foreach (int x in nums)
{
    if (x < 0) nums.Remove(x);   // InvalidOperationException
}` },
        good: { py: `nums = [x for x in nums if x >= 0]   # a new list, nothing skipped`, java: `nums.removeIf(x -> x < 0);   // safe, one pass`, cs: `nums.RemoveAll(x => x < 0);  // safe, one pass` } },
      { why: "Re-adding the whole window at every position is O(n·k). Slide it instead: add the item that enters and subtract the one that leaves, for O(n).",
        bad: { py: `best = float("-inf")
for i in range(len(nums) - k + 1):
    best = max(best, sum(nums[i:i + k]))   # re-adds k items each time`, java: `int best = Integer.MIN_VALUE;
for (int i = 0; i + k <= nums.length; i++) {
    int sum = 0;
    // re-adds k items each time
    for (int j = i; j < i + k; j++) sum += nums[j];
    best = Math.max(best, sum);
}`, cs: `int best = int.MinValue;
for (int i = 0; i + k <= nums.Length; i++)
{
    int sum = 0;
    // re-adds k items each time
    for (int j = i; j < i + k; j++) sum += nums[j];
    best = Math.Max(best, sum);
}` },
        good: { py: `window = sum(nums[:k])
best = window
for i in range(k, len(nums)):
    window += nums[i] - nums[i - k]        # one in, one out
    best = max(best, window)`, java: `int window = 0;
for (int i = 0; i < k; i++) window += nums[i];
int best = window;
for (int i = k; i < nums.length; i++) {
    window += nums[i] - nums[i - k];       // one in, one out
    best = Math.max(best, window);
}`, cs: `int window = 0;
for (int i = 0; i < k; i++) window += nums[i];
int best = window;
for (int i = k; i < nums.Length; i++)
{
    window += nums[i] - nums[i - k];       // one in, one out
    best = Math.Max(best, window);
}` } },
    ],
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
    what: {
      py: "A sequence of characters. Python strings are immutable: every 'change' builds a new string. Many interview problems are really array problems on characters.",
      java: "A sequence of characters. Java Strings are immutable: every 'change' builds a new String. Many interview problems are really array problems on characters (toCharArray()).",
      cs: "A sequence of characters. C# strings are immutable: every 'change' builds a new string. Many interview problems are really array problems on characters (ToCharArray()).",
    },
    when: ["Parsing and text processing", "Anagram / palindrome / substring problems", "Character counting with a fixed 26-slot array"],
    ops: [["Read character by index", "O(1)"], ["Length", "O(1)"], ["Concatenate", "O(n + m)"], ["Substring / slice", "O(k)"], ["Find substring (naive)", "O(n * m)"], ["Build with a builder / join", "O(total length)"]],
    builtin: { py: "str (+ list for building)", java: "String, StringBuilder", cs: "string, StringBuilder" },
    pitfalls: [
      { py: "s += c inside a loop can be O(n²). Collect pieces in a list and ''.join() them once.",
        java: "s += c inside a loop can be O(n²). Use a StringBuilder.",
        cs: "s += c inside a loop can be O(n²). Use a StringBuilder." },
      { py: "Slices s[a:b] stop before b, and negative indexes count from the end (s[-1] is the last character).",
        java: "Compare contents with .equals(), never ==. substring(start, end) stops before end.",
        cs: "Substring(start, length) takes a length, not an end index." }],
    practice: [
      { why: "Strings are immutable, so each `+=` copies everything built so far: O(n²) in a loop. Collect the pieces and join once.",
        bad: { py: `out = ""
for word in words:
    out += word + ","       # copies the whole string each time`, java: `String out = "";
for (String word : words) {
    out += word + ",";      // copies the whole string each time
}`, cs: `string output = "";
foreach (string word in words)
{
    output += word + ",";   // copies the whole string each time
}` },
        good: { py: `out = ",".join(words)    # one pass, one copy`, java: `StringBuilder sb = new StringBuilder();
for (String word : words) {
    sb.append(word).append(',');   // O(1) amortized
}
String out = sb.toString();`, cs: `var sb = new StringBuilder();
foreach (string word in words)
{
    sb.Append(word).Append(',');   // O(1) amortized
}
string output = sb.ToString();` } },
      { why: "Counting each character with a scan of the whole string is O(n) per character. One pass with a counter (or a 26-slot array) is O(n).",
        bad: { py: `counts = {c: s.count(c) for c in s}    # a full scan per character`, java: `Map<Character, Integer> counts = new HashMap<>();
for (char c : s.toCharArray()) {
    int n = 0;
    // a full scan per character
    for (char d : s.toCharArray()) if (d == c) n++;
    counts.put(c, n);
}`, cs: `var counts = new Dictionary<char, int>();
foreach (char c in s)
{
    counts[c] = s.Count(d => d == c);   // a full scan per character
}` },
        good: { py: `from collections import Counter

counts = Counter(s)                    # one pass`, java: `int[] counts = new int[26];           // lowercase a-z
for (char c : s.toCharArray()) {
    counts[c - 'a']++;                 // one pass
}`, cs: `var counts = new Dictionary<char, int>();
foreach (char c in s)
{
    counts[c] = counts.GetValueOrDefault(c) + 1;   // one pass
}` } },
      { why: "The built-in method is shorter, already tested, and says what you mean. Hand-written index loops are where off-by-one bugs live.",
        bad: { py: `def has_prefix(word, prefix):
    if len(prefix) > len(word):
        return False
    for i in range(len(prefix)):
        if word[i] != prefix[i]:
            return False
    return True`, java: `boolean hasPrefix(String word, String prefix) {
    if (prefix.length() > word.length()) return false;
    for (int i = 0; i < prefix.length(); i++) {
        if (word.charAt(i) != prefix.charAt(i)) return false;
    }
    return true;
}`, cs: `bool HasPrefix(string word, string prefix)
{
    if (prefix.Length > word.Length) return false;
    for (int i = 0; i < prefix.Length; i++)
    {
        if (word[i] != prefix[i]) return false;
    }
    return true;
}` },
        good: { py: `def has_prefix(word, prefix):
    return word.startswith(prefix)`, java: `boolean hasPrefix(String word, String prefix) {
    return word.startsWith(prefix);
}`, cs: `bool HasPrefix(string word, string prefix) =>
    word.StartsWith(prefix, StringComparison.Ordinal);` } },
    ],
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
    pitfalls: ["Lose the rest of the list by overwriting .next before saving it.", "Use a dummy head node to avoid special cases at the front.",
      { py: "Always check node and node.next for None before following them.",
        java: "Always check node and node.next for null before following them.",
        cs: "Always check node and node.next for null before following them." }],
    practice: [
      { why: "Once `next` is overwritten, the rest of the list is unreachable. Save the next node first, then rewire.",
        bad: { py: `def reverse(head):
    prev, node = None, head
    while node:
        node.next = prev    # the rest of the list is lost
        prev = node
        node = node.next    # now points backwards
    return prev`, java: `ListNode reverse(ListNode head) {
    ListNode prev = null, node = head;
    while (node != null) {
        node.next = prev;   // the rest of the list is lost
        prev = node;
        node = node.next;   // now points backwards
    }
    return prev;
}`, cs: `ListNode Reverse(ListNode head)
{
    ListNode prev = null, node = head;
    while (node != null)
    {
        node.next = prev;   // the rest of the list is lost
        prev = node;
        node = node.next;   // now points backwards
    }
    return prev;
}` },
        good: { py: `def reverse(head):
    prev, node = None, head
    while node:
        nxt = node.next     # save the rest first
        node.next = prev
        prev, node = node, nxt
    return prev`, java: `ListNode reverse(ListNode head) {
    ListNode prev = null, node = head;
    while (node != null) {
        ListNode nxt = node.next;   // save the rest first
        node.next = prev;
        prev = node;
        node = nxt;
    }
    return prev;
}`, cs: `ListNode Reverse(ListNode head)
{
    ListNode prev = null, node = head;
    while (node != null)
    {
        var nxt = node.next;        // save the rest first
        node.next = prev;
        prev = node;
        node = nxt;
    }
    return prev;
}` } },
      { why: "A dummy node before the head means removing the first node is no different from removing any other, so the special case disappears.",
        bad: { py: `def remove(head, val):
    while head and head.val == val:    # special case: the front
        head = head.next
    node = head
    while node and node.next:
        if node.next.val == val:
            node.next = node.next.next
        else:
            node = node.next
    return head`, java: `ListNode remove(ListNode head, int val) {
    // special case: the front
    while (head != null && head.val == val) head = head.next;
    ListNode node = head;
    while (node != null && node.next != null) {
        if (node.next.val == val) node.next = node.next.next;
        else node = node.next;
    }
    return head;
}`, cs: `ListNode Remove(ListNode head, int val)
{
    // special case: the front
    while (head != null && head.val == val) head = head.next;
    var node = head;
    while (node != null && node.next != null)
    {
        if (node.next.val == val) node.next = node.next.next;
        else node = node.next;
    }
    return head;
}` },
        good: { py: `def remove(head, val):
    dummy = ListNode(0, head)          # a node before the head
    node = dummy
    while node.next:
        if node.next.val == val:
            node.next = node.next.next
        else:
            node = node.next
    return dummy.next`, java: `ListNode remove(ListNode head, int val) {
    ListNode dummy = new ListNode(0);  // a node before the head
    dummy.next = head;
    ListNode node = dummy;
    while (node.next != null) {
        if (node.next.val == val) node.next = node.next.next;
        else node = node.next;
    }
    return dummy.next;
}`, cs: `ListNode Remove(ListNode head, int val)
{
    var dummy = new ListNode(0) { next = head };   // a node before the head
    var node = dummy;
    while (node.next != null)
    {
        if (node.next.val == val) node.next = node.next.next;
        else node = node.next;
    }
    return dummy.next;
}` } },
      { why: "Copying the values into an array costs O(n) extra space. A fast pointer moving two steps for each slow step finds the middle in one pass with O(1) space.",
        bad: { py: `def middle(head):
    vals = []
    while head:
        vals.append(head.val)          # O(n) extra space
        head = head.next
    return vals[len(vals) // 2]`, java: `int middle(ListNode head) {
    List<Integer> vals = new ArrayList<>();
    // O(n) extra space
    for (ListNode n = head; n != null; n = n.next) vals.add(n.val);
    return vals.get(vals.size() / 2);
}`, cs: `int Middle(ListNode head)
{
    var vals = new List<int>();
    // O(n) extra space
    for (var n = head; n != null; n = n.next) vals.Add(n.val);
    return vals[vals.Count / 2];
}` },
        good: { py: `def middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next               # one step
        fast = fast.next.next          # two steps
    return slow.val`, java: `int middle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;              // one step
        fast = fast.next.next;         // two steps
    }
    return slow.val;
}`, cs: `int Middle(ListNode head)
{
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null)
    {
        slow = slow.next;              // one step
        fast = fast.next.next;         // two steps
    }
    return slow.val;
}` } },
    ],
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
    pitfalls: [
      { py: "Popping or peeking an empty list raises IndexError. Check that the stack is non-empty first.",
        java: "pop() and peek() on an empty ArrayDeque throw or return null. Check isEmpty() first.",
        cs: "Pop() and Peek() on an empty Stack<T> throw InvalidOperationException. Check Count first, or use TryPop." },
      { java: "Prefer ArrayDeque over the legacy, synchronized Stack class." },
      { java: "Compare boxed Characters and Integers with .equals(), not ==." }],
    practice: [
      { why: { py: "The top of a list-based stack belongs at the end: `append` and `pop()` are O(1), while inserting or popping at index 0 shifts everything.",
          java: "`Stack` is a legacy class with synchronised, slower methods. `ArrayDeque` is the recommended stack.",
          cs: "Using the front of a `List` as the top shifts every element on each push and pop. `Stack<T>` does both in O(1)." },
        bad: { py: `stack = []
stack.insert(0, x)          # O(n): shifts everything
top = stack.pop(0)          # O(n)`, java: `Stack<Integer> stack = new Stack<>();   // legacy, synchronised
stack.push(x);
int top = stack.pop();`, cs: `var stack = new List<int>();
stack.Insert(0, x);         // O(n): shifts everything
int top = stack[0];
stack.RemoveAt(0);          // O(n)` },
        good: { py: `stack = []
stack.append(x)             # O(1)
top = stack.pop()           # O(1)`, java: `Deque<Integer> stack = new ArrayDeque<>();
stack.push(x);              // O(1)
int top = stack.pop();      // O(1)`, cs: `var stack = new Stack<int>();
stack.Push(x);              // O(1)
int top = stack.Pop();      // O(1)` } },
      { why: "A closing bracket can arrive when the stack is empty, and leftover openers mean the string isn't balanced. Check both.",
        bad: { py: `def valid(s):
    pairs = {")": "(", "]": "["}
    stack = []
    for c in s:
        if c in pairs:
            if stack.pop() != pairs[c]:     # IndexError on ")"
                return False
        else:
            stack.append(c)
    return True                             # "((" counts as valid`, java: `boolean valid(String s) {
    Map<Character, Character> pairs = Map.of(')', '(', ']', '[');
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (pairs.containsKey(c)) {
            // throws on ")"
            if (!stack.pop().equals(pairs.get(c))) return false;
        } else {
            stack.push(c);
        }
    }
    return true;                            // "((" counts as valid
}`, cs: `bool Valid(string s)
{
    var pairs = new Dictionary<char, char> { [')'] = '(', [']'] = '[' };
    var stack = new Stack<char>();
    foreach (char c in s)
    {
        if (pairs.ContainsKey(c))
        {
            if (stack.Pop() != pairs[c]) return false;   // throws on ")"
        }
        else stack.Push(c);
    }
    return true;                            // "((" counts as valid
}` },
        good: { py: `def valid(s):
    pairs = {")": "(", "]": "["}
    stack = []
    for c in s:
        if c in pairs:
            if not stack or stack.pop() != pairs[c]:
                return False
        else:
            stack.append(c)
    return not stack                        # every bracket closed`, java: `boolean valid(String s) {
    Map<Character, Character> pairs = Map.of(')', '(', ']', '[');
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (pairs.containsKey(c)) {
            if (stack.isEmpty() || !stack.pop().equals(pairs.get(c)))
                return false;
        } else {
            stack.push(c);
        }
    }
    return stack.isEmpty();                 // every bracket closed
}`, cs: `bool Valid(string s)
{
    var pairs = new Dictionary<char, char> { [')'] = '(', [']'] = '[' };
    var stack = new Stack<char>();
    foreach (char c in s)
    {
        if (pairs.TryGetValue(c, out char open))
        {
            if (!stack.TryPop(out char top) || top != open) return false;
        }
        else stack.Push(c);
    }
    return stack.Count == 0;                // every bracket closed
}` } },
      { why: "\"Next greater element\" with nested loops is O(n²). A stack of indexes still waiting for an answer handles each index once: O(n).",
        bad: { py: `def next_greater(nums):
    res = [-1] * len(nums)
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):  # O(n²)
            if nums[j] > nums[i]:
                res[i] = nums[j]
                break
    return res`, java: `int[] nextGreater(int[] nums) {
    int[] res = new int[nums.length];
    Arrays.fill(res, -1);
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {   // O(n²)
            if (nums[j] > nums[i]) { res[i] = nums[j]; break; }
        }
    }
    return res;
}`, cs: `int[] NextGreater(int[] nums)
{
    var res = Enumerable.Repeat(-1, nums.Length).ToArray();
    for (int i = 0; i < nums.Length; i++)
    {
        for (int j = i + 1; j < nums.Length; j++)     // O(n²)
        {
            if (nums[j] > nums[i]) { res[i] = nums[j]; break; }
        }
    }
    return res;
}` },
        good: { py: `def next_greater(nums):
    res = [-1] * len(nums)
    stack = []                             # indexes waiting for an answer
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:
            res[stack.pop()] = x
        stack.append(i)
    # O(n): each index pushed and popped once
    return res`, java: `int[] nextGreater(int[] nums) {
    int[] res = new int[nums.length];
    Arrays.fill(res, -1);
    // indexes waiting for an answer
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < nums.length; i++) {
        while (!stack.isEmpty() && nums[stack.peek()] < nums[i])
            res[stack.pop()] = nums[i];
        stack.push(i);
    }
    return res;                            // O(n)
}`, cs: `int[] NextGreater(int[] nums)
{
    var res = Enumerable.Repeat(-1, nums.Length).ToArray();
    var stack = new Stack<int>();          // indexes waiting for an answer
    for (int i = 0; i < nums.Length; i++)
    {
        while (stack.Count > 0 && nums[stack.Peek()] < nums[i])
            res[stack.Pop()] = nums[i];
        stack.Push(i);
    }
    return res;                            // O(n)
}` } },
    ],
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
    pitfalls: [
      { py: "list.pop(0) is O(n). Always use collections.deque and popleft().",
        java: "poll() and peek() return null on an empty queue; remove() and element() throw.",
        cs: "Dequeue() throws on an empty Queue<T>. Check Count first, or use TryDequeue." },
      "Mark nodes as seen when you enqueue them (not when you dequeue) to avoid duplicates in BFS."],
    practice: [
      { why: { py: "`list.pop(0)` shifts every remaining item, so a list-based queue is O(n) per dequeue. `deque.popleft()` is O(1).",
          java: "`ArrayList.remove(0)` shifts every remaining item: O(n) per dequeue. `ArrayDeque` adds and removes at both ends in O(1).",
          cs: "`List.RemoveAt(0)` shifts every remaining item: O(n) per dequeue. `Queue<T>` does it in O(1)." },
        bad: { py: `queue = [start]
while queue:
    node = queue.pop(0)     # O(n): shifts everything
    queue.extend(graph[node])`, java: `List<Integer> queue = new ArrayList<>(List.of(start));
while (!queue.isEmpty()) {
    int node = queue.remove(0);   // O(n): shifts everything
    queue.addAll(graph.get(node));
}`, cs: `var queue = new List<int> { start };
while (queue.Count > 0)
{
    int node = queue[0];
    queue.RemoveAt(0);            // O(n): shifts everything
    queue.AddRange(graph[node]);
}` },
        good: { py: `from collections import deque

queue = deque([start])
while queue:
    node = queue.popleft()  # O(1)
    queue.extend(graph[node])`, java: `Deque<Integer> queue = new ArrayDeque<>(List.of(start));
while (!queue.isEmpty()) {
    int node = queue.poll();      // O(1)
    queue.addAll(graph.get(node));
}`, cs: `var queue = new Queue<int>();
queue.Enqueue(start);
while (queue.Count > 0)
{
    int node = queue.Dequeue();   // O(1)
    foreach (int nb in graph[node]) queue.Enqueue(nb);
}` } },
      { why: "If nodes are marked when they're taken out, a node can be added many times before its turn comes. Mark it as seen when you add it.",
        bad: { py: `queue, seen = deque([start]), set()
while queue:
    node = queue.popleft()
    seen.add(node)              # marked late: queued many times
    for nb in graph[node]:
        if nb not in seen:
            queue.append(nb)`, java: `Deque<Integer> queue = new ArrayDeque<>(List.of(start));
Set<Integer> seen = new HashSet<>();
while (!queue.isEmpty()) {
    int node = queue.poll();
    seen.add(node);             // marked late: queued many times
    for (int nb : graph.get(node))
        if (!seen.contains(nb)) queue.offer(nb);
}`, cs: `var queue = new Queue<int>(new[] { start });
var seen = new HashSet<int>();
while (queue.Count > 0)
{
    int node = queue.Dequeue();
    seen.Add(node);             // marked late: queued many times
    foreach (int nb in graph[node])
        if (!seen.Contains(nb)) queue.Enqueue(nb);
}` },
        good: { py: `queue, seen = deque([start]), {start}
while queue:
    node = queue.popleft()
    for nb in graph[node]:
        if nb not in seen:
            seen.add(nb)        # marked when queued: once each
            queue.append(nb)`, java: `Deque<Integer> queue = new ArrayDeque<>(List.of(start));
Set<Integer> seen = new HashSet<>(List.of(start));
while (!queue.isEmpty()) {
    int node = queue.poll();
    for (int nb : graph.get(node))
        // marked when queued: once each
        if (seen.add(nb)) queue.offer(nb);
}`, cs: `var queue = new Queue<int>(new[] { start });
var seen = new HashSet<int> { start };
while (queue.Count > 0)
{
    int node = queue.Dequeue();
    foreach (int nb in graph[node])
        // marked when queued: once each
        if (seen.Add(nb)) queue.Enqueue(nb);
}` } },
      { why: "Taking the max of every window is O(n·k). A deque of indexes whose values decrease keeps the current max at the front: O(n).",
        bad: { py: `def window_max(nums, k):
    return [max(nums[i:i + k]) for i in range(len(nums) - k + 1)]   # O(n·k)`, java: `List<Integer> windowMax(int[] nums, int k) {
    List<Integer> res = new ArrayList<>();
    for (int i = 0; i + k <= nums.length; i++) {
        int best = nums[i];
        // O(n·k)
        for (int j = i; j < i + k; j++) best = Math.max(best, nums[j]);
        res.add(best);
    }
    return res;
}`, cs: `List<int> WindowMax(int[] nums, int k)
{
    var res = new List<int>();
    for (int i = 0; i + k <= nums.Length; i++)
        res.Add(nums.Skip(i).Take(k).Max());   // O(n·k)
    return res;
}` },
        good: { py: `def window_max(nums, k):
    dq, res = deque(), []        # indexes, values decreasing
    for i, x in enumerate(nums):
        while dq and nums[dq[-1]] <= x:
            dq.pop()             # smaller values can never be the max
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()         # fell out of the window
        if i >= k - 1:
            res.append(nums[dq[0]])
    return res`, java: `List<Integer> windowMax(int[] nums, int k) {
    Deque<Integer> dq = new ArrayDeque<>();   // indexes, values decreasing
    List<Integer> res = new ArrayList<>();
    for (int i = 0; i < nums.length; i++) {
        while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i])
            dq.pollLast();
        dq.offerLast(i);
        // fell out of the window
        if (dq.peekFirst() <= i - k) dq.pollFirst();
        if (i >= k - 1) res.add(nums[dq.peekFirst()]);
    }
    return res;
}`, cs: `List<int> WindowMax(int[] nums, int k)
{
    var dq = new LinkedList<int>();       // indexes, values decreasing
    var res = new List<int>();
    for (int i = 0; i < nums.Length; i++)
    {
        while (dq.Count > 0 && nums[dq.Last.Value] <= nums[i])
            dq.RemoveLast();
        dq.AddLast(i);
        // fell out of the window
        if (dq.First.Value <= i - k) dq.RemoveFirst();
        if (i >= k - 1) res.Add(nums[dq.First.Value]);
    }
    return res;
}` } },
    ],
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
    what: {
      py: "Stores key -> value pairs. A hash function turns each key into a bucket index, so lookups, inserts and deletes are O(1) on average. Keys must be hashable: numbers, strings and tuples work; lists don't.",
      java: "Stores key -> value pairs. A hash function turns each key into a bucket index, so lookups, inserts and deletes are O(1) on average. Keys need consistent equals() and hashCode().",
      cs: "Stores key -> value pairs. A hash function turns each key into a bucket index, so lookups, inserts and deletes are O(1) on average. Keys need consistent Equals() and GetHashCode().",
    },
    when: ["Counting frequencies", "'Have I seen this before?' with extra info (like an index)", "Grouping items by a computed key", "Memoization caches"],
    ops: [["Get / put / delete", "O(1) average"], ["Contains key", "O(1) average"], ["Iterate all entries", "O(n)"], ["Worst case (many collisions)", "O(n)"]],
    builtin: { py: "dict, collections.Counter, defaultdict", java: "HashMap<K, V> (LinkedHashMap keeps order)", cs: "Dictionary<TKey, TValue>" },
    pitfalls: [
      { py: "Reading a missing key raises KeyError. Use d.get(k, default), or a defaultdict.",
        java: "get() on a missing key returns null, and unboxing that null into an int throws. Use getOrDefault().",
        cs: "Reading a missing key throws KeyNotFoundException. Use TryGetValue() or GetValueOrDefault()." },
      { py: "Lists can't be keys because they're mutable. Convert to a tuple first.",
        java: "Never change a key object while it's in the map: its hashCode() changes and the entry is lost.",
        cs: "Never change a key object while it's in the dictionary: its hash changes and the entry is lost. Records make good keys." },
      "Don't modify a map while iterating over it."],
    practice: [
      { why: "Checking for the key and then reading or writing it does two or three lookups and more code. Use the one call made for counting.",
        bad: { py: `counts = {}
for w in words:
    if w in counts:
        counts[w] += 1
    else:
        counts[w] = 1`, java: `Map<String, Integer> counts = new HashMap<>();
for (String w : words) {
    if (counts.containsKey(w)) counts.put(w, counts.get(w) + 1);
    else counts.put(w, 1);
}`, cs: `var counts = new Dictionary<string, int>();
foreach (string w in words)
{
    if (counts.ContainsKey(w)) counts[w] = counts[w] + 1;
    else counts[w] = 1;
}` },
        good: { py: `from collections import Counter

counts = Counter(words)`, java: `Map<String, Integer> counts = new HashMap<>();
for (String w : words) {
    counts.merge(w, 1, Integer::sum);   // add 1, or start at 1
}`, cs: `var counts = new Dictionary<string, int>();
foreach (string w in words)
{
    counts[w] = counts.GetValueOrDefault(w) + 1;
}` } },
      { why: "Checking every pair is O(n²). Remembering what you've seen in a hash map turns \"is the partner here?\" into an O(1) lookup: O(n) overall.",
        bad: { py: `def two_sum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):    # O(n²)
            if nums[i] + nums[j] == target:
                return [i, j]`, java: `int[] twoSum(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++)
        for (int j = i + 1; j < nums.length; j++)   // O(n²)
            if (nums[i] + nums[j] == target) return new int[] {i, j};
    return new int[0];
}`, cs: `int[] TwoSum(int[] nums, int target)
{
    for (int i = 0; i < nums.Length; i++)
        for (int j = i + 1; j < nums.Length; j++)   // O(n²)
            if (nums[i] + nums[j] == target) return new[] { i, j };
    return new int[0];
}` },
        good: { py: `def two_sum(nums, target):
    index_of = {}                            # value -> index
    for i, x in enumerate(nums):
        if target - x in index_of:           # O(1) lookup
            return [index_of[target - x], i]
        index_of[x] = i`, java: `int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> indexOf = new HashMap<>();   // value -> index
    for (int i = 0; i < nums.length; i++) {
        Integer j = indexOf.get(target - nums[i]);     // O(1) lookup
        if (j != null) return new int[] {j, i};
        indexOf.put(nums[i], i);
    }
    return new int[0];
}`, cs: `int[] TwoSum(int[] nums, int target)
{
    var indexOf = new Dictionary<int, int>();   // value -> index
    for (int i = 0; i < nums.Length; i++)
    {
        if (indexOf.TryGetValue(target - nums[i], out int j))
            return new[] { j, i };
        indexOf[nums[i]] = i;
    }
    return new int[0];
}` } },
      { why: "Grouping by hand needs a \"create the list if missing\" check every time. Let the map create it for you.",
        bad: { py: `groups = {}
for w in words:
    key = "".join(sorted(w))
    if key not in groups:
        groups[key] = []
    groups[key].append(w)`, java: `Map<String, List<String>> groups = new HashMap<>();
for (String w : words) {
    char[] cs = w.toCharArray();
    Arrays.sort(cs);
    String key = new String(cs);
    if (!groups.containsKey(key)) groups.put(key, new ArrayList<>());
    groups.get(key).add(w);
}`, cs: `var groups = new Dictionary<string, List<string>>();
foreach (string w in words)
{
    string key = new string(w.OrderBy(c => c).ToArray());
    if (!groups.ContainsKey(key)) groups[key] = new List<string>();
    groups[key].Add(w);
}` },
        good: { py: `from collections import defaultdict

groups = defaultdict(list)          # a missing key starts as []
for w in words:
    groups["".join(sorted(w))].append(w)`, java: `Map<String, List<String>> groups = new HashMap<>();
for (String w : words) {
    char[] cs = w.toCharArray();
    Arrays.sort(cs);
    groups.computeIfAbsent(new String(cs), k -> new ArrayList<>()).add(w);
}`, cs: `var groups = new Dictionary<string, List<string>>();
foreach (string w in words)
{
    string key = new string(w.OrderBy(c => c).ToArray());
    if (!groups.TryGetValue(key, out var list))
        groups[key] = list = new List<string>();
    list.Add(w);
}` } },
    ],
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
    pitfalls: ["Sets are unordered: don't rely on iteration order.",
      { py: "x in list is O(n) but x in set is O(1). Convert once if you check many times.",
        java: "list.contains(x) is O(n) but set.contains(x) is O(1). Convert once if you check many times.",
        cs: "list.Contains(x) is O(n) but set.Contains(x) is O(1). Convert once if you check many times." },
      { java: "add() returns false when the item already exists, which is a handy duplicate check.",
        cs: "Add() returns false when the item already exists, which is a handy duplicate check." }],
    practice: [
      { why: "Checking membership in a list scans it: O(n) per check, O(n²) in a loop. A set answers in O(1).",
        bad: { py: `def has_duplicate(nums):
    seen = []
    for x in nums:
        if x in seen:       # O(n) scan
            return True
        seen.append(x)
    return False`, java: `boolean hasDuplicate(int[] nums) {
    List<Integer> seen = new ArrayList<>();
    for (int x : nums) {
        if (seen.contains(x)) return true;   // O(n) scan
        seen.add(x);
    }
    return false;
}`, cs: `bool HasDuplicate(int[] nums)
{
    var seen = new List<int>();
    foreach (int x in nums)
    {
        if (seen.Contains(x)) return true;   // O(n) scan
        seen.Add(x);
    }
    return false;
}` },
        good: { py: `def has_duplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:       # O(1)
            return True
        seen.add(x)
    return False`, java: `boolean hasDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int x : nums) {
        if (!seen.add(x)) return true;   // false for a repeat: O(1)
    }
    return false;
}`, cs: `bool HasDuplicate(int[] nums)
{
    var seen = new HashSet<int>();
    foreach (int x in nums)
    {
        if (!seen.Add(x)) return true;   // false for a repeat: O(1)
    }
    return false;
}` } },
      { why: "A plain hash set doesn't keep insertion order, so de-duplicating through one can shuffle the items. Use an order-keeping structure when order matters.",
        bad: { py: `unique = list(set(names))          # order is lost`, java: `// order is lost
List<String> unique = new ArrayList<>(new HashSet<>(names));`, cs: `// order isn't guaranteed
var unique = new HashSet<string>(names).ToList();` },
        good: { py: `unique = list(dict.fromkeys(names)) # first-seen order kept`, java: `// order kept
List<String> unique = new ArrayList<>(new LinkedHashSet<>(names));`, cs: `var seen = new HashSet<string>();
var unique = new List<string>();
foreach (string n in names)
    if (seen.Add(n)) unique.Add(n);   // first-seen order kept` } },
      { why: "Comparing every item with every other is O(n·m). Sets have intersection built in, in about O(n + m).",
        bad: { py: `common = []
for x in a:
    for y in b:                     # O(n·m)
        if x == y and x not in common:
            common.append(x)`, java: `List<Integer> common = new ArrayList<>();
for (int x : a)
    for (int y : b)                 // O(n·m)
        if (x == y && !common.contains(x)) common.add(x);`, cs: `var common = new List<int>();
foreach (int x in a)
    foreach (int y in b)            // O(n·m)
        if (x == y && !common.Contains(x)) common.Add(x);` },
        good: { py: `common = set(a) & set(b)            # O(n + m)`, java: `Set<Integer> common = new HashSet<>();
for (int x : a) common.add(x);
Set<Integer> inB = new HashSet<>();
for (int y : b) inB.add(y);
common.retainAll(inB);              // O(n + m)`, cs: `var common = new HashSet<int>(a);
common.IntersectWith(b);            // O(n + m)` } },
    ],
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
    pitfalls: [{ py: "Always handle the empty tree (root is None) first.", java: "Always handle the empty tree (root == null) first.", cs: "Always handle the empty tree (root is null) first." }, "Decide what each recursive call returns before writing it.", "Deep, skewed trees can overflow the recursion stack. Use an explicit stack if needed."],
    practice: [
      { why: "Let each call return its answer and combine the children's results. A shared variable updated from inside the recursion is harder to follow and to reuse.",
        bad: { py: `best = 0

def depth(node, d=1):
    global best
    if node:
        best = max(best, d)         # shared state
        depth(node.left, d + 1)
        depth(node.right, d + 1)`, java: `int best = 0;

void depth(TreeNode node, int d) {
    if (node == null) return;
    best = Math.max(best, d);       // shared state
    depth(node.left, d + 1);
    depth(node.right, d + 1);
}`, cs: `int best = 0;

void Depth(TreeNode node, int d)
{
    if (node == null) return;
    best = Math.Max(best, d);       // shared state
    Depth(node.left, d + 1);
    Depth(node.right, d + 1);
}` },
        good: { py: `def depth(node):
    if not node:
        return 0
    return 1 + max(depth(node.left), depth(node.right))`, java: `int depth(TreeNode node) {
    if (node == null) return 0;
    return 1 + Math.max(depth(node.left), depth(node.right));
}`, cs: `int Depth(TreeNode node)
{
    if (node == null) return 0;
    return 1 + Math.Max(Depth(node.left), Depth(node.right));
}` } },
      { why: "Calling `height()` at every node walks the same subtrees again and again: O(n²) on a skewed tree. Return the height and the answer from one pass: O(n).",
        bad: { py: `def height(node):
    return 0 if not node else 1 + max(height(node.left), height(node.right))

def balanced(node):
    if not node:
        return True
    # walks the subtree again
    if abs(height(node.left) - height(node.right)) > 1:
        return False
    return balanced(node.left) and balanced(node.right)`, java: `int height(TreeNode n) {
    return n == null ? 0 : 1 + Math.max(height(n.left), height(n.right));
}

boolean balanced(TreeNode n) {
    if (n == null) return true;
    // walks it again
    if (Math.abs(height(n.left) - height(n.right)) > 1) return false;
    return balanced(n.left) && balanced(n.right);
}`, cs: `int Height(TreeNode n) =>
    n == null ? 0 : 1 + Math.Max(Height(n.left), Height(n.right));

bool Balanced(TreeNode n)
{
    if (n == null) return true;
    // walks it again
    if (Math.Abs(Height(n.left) - Height(n.right)) > 1) return false;
    return Balanced(n.left) && Balanced(n.right);
}` },
        good: { py: `def balanced(root):
    def check(node):                # height, or -1 if unbalanced
        if not node:
            return 0
        left, right = check(node.left), check(node.right)
        if left < 0 or right < 0 or abs(left - right) > 1:
            return -1
        return 1 + max(left, right)
    return check(root) >= 0`, java: `int check(TreeNode n) {             // height, or -1 if unbalanced
    if (n == null) return 0;
    int left = check(n.left), right = check(n.right);
    if (left < 0 || right < 0 || Math.abs(left - right) > 1) return -1;
    return 1 + Math.max(left, right);
}

boolean balanced(TreeNode root) { return check(root) >= 0; }`, cs: `int Check(TreeNode n)               // height, or -1 if unbalanced
{
    if (n == null) return 0;
    int left = Check(n.left), right = Check(n.right);
    if (left < 0 || right < 0 || Math.Abs(left - right) > 1) return -1;
    return 1 + Math.Max(left, right);
}

bool Balanced(TreeNode root) => Check(root) >= 0;` } },
      { why: "Two different trees can give the same traversal: [1, 2] is the inorder of 2 with a left child 1, and of 1 with a right child 2. Compare the structure node by node.",
        bad: { py: `def same_tree(a, b):
    return inorder(a) == inorder(b)     # different shapes can match`, java: `boolean sameTree(TreeNode a, TreeNode b) {
    return inorder(a).equals(inorder(b));   // different shapes can match
}`, cs: `bool SameTree(TreeNode a, TreeNode b) =>
    Inorder(a).SequenceEqual(Inorder(b));   // different shapes can match` },
        good: { py: `def same_tree(a, b):
    if not a or not b:
        return a is b                   # both empty, or not the same
    return (a.val == b.val and same_tree(a.left, b.left)
            and same_tree(a.right, b.right))`, java: `boolean sameTree(TreeNode a, TreeNode b) {
    // both empty, or not the same
    if (a == null || b == null) return a == b;
    return a.val == b.val
        && sameTree(a.left, b.left) && sameTree(a.right, b.right);
}`, cs: `bool SameTree(TreeNode a, TreeNode b)
{
    // both empty, or not the same
    if (a == null || b == null) return a == b;
    return a.val == b.val
        && SameTree(a.left, b.left) && SameTree(a.right, b.right);
}` } },
    ],
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
    practice: [
      { why: "Every node must fit the range set by all its ancestors, not just its parent. In 5 → (left 4 → right 6), 6 is bigger than 4 but sits left of 5. Pass the allowed range down.",
        bad: { py: `def valid(node):
    if not node:
        return True
    if node.left and node.left.val >= node.val:
        return False
    if node.right and node.right.val <= node.val:
        return False
    return valid(node.left) and valid(node.right)   # misses deeper nodes`, java: `boolean valid(TreeNode n) {
    if (n == null) return true;
    if (n.left != null && n.left.val >= n.val) return false;
    if (n.right != null && n.right.val <= n.val) return false;
    return valid(n.left) && valid(n.right);   // misses deeper nodes
}`, cs: `bool Valid(TreeNode n)
{
    if (n == null) return true;
    if (n.left != null && n.left.val >= n.val) return false;
    if (n.right != null && n.right.val <= n.val) return false;
    return Valid(n.left) && Valid(n.right);   // misses deeper nodes
}` },
        good: { py: `def valid(node, low=float("-inf"), high=float("inf")):
    if not node:
        return True
    if not low < node.val < high:
        return False
    return (valid(node.left, low, node.val)
            and valid(node.right, node.val, high))`, java: `// start with Long.MIN_VALUE, MAX_VALUE
boolean valid(TreeNode n, long low, long high) {
    if (n == null) return true;
    if (n.val <= low || n.val >= high) return false;
    return valid(n.left, low, n.val) && valid(n.right, n.val, high);
}`, cs: `bool Valid(TreeNode n, long low = long.MinValue, long high = long.MaxValue)
{
    if (n == null) return true;
    if (n.val <= low || n.val >= high) return false;
    return Valid(n.left, low, n.val) && Valid(n.right, n.val, high);
}` } },
      { why: "Searching both sides ignores the ordering and visits every node: O(n). The ordering tells you which side to go: O(height).",
        bad: { py: `def contains(node, target):
    if not node:
        return False
    return (node.val == target or contains(node.left, target)
            or contains(node.right, target))       # visits everything`, java: `boolean contains(TreeNode n, int target) {
    if (n == null) return false;
    // visits everything
    return n.val == target
        || contains(n.left, target) || contains(n.right, target);
}`, cs: `bool Contains(TreeNode n, int target)
{
    if (n == null) return false;
    // visits everything
    return n.val == target
        || Contains(n.left, target) || Contains(n.right, target);
}` },
        good: { py: `def contains(node, target):
    while node:
        if target == node.val:
            return True
        # one side only
        node = node.left if target < node.val else node.right
    return False`, java: `boolean contains(TreeNode n, int target) {
    while (n != null) {
        if (target == n.val) return true;
        n = target < n.val ? n.left : n.right;   // one side only
    }
    return false;
}`, cs: `bool Contains(TreeNode n, int target)
{
    while (n != null)
    {
        if (target == n.val) return true;
        n = target < n.val ? n.left : n.right;   // one side only
    }
    return false;
}` } },
      { why: "Listing the whole tree to read one item costs O(n) time and space. An inorder walk visits values in sorted order, so stop at the k-th.",
        bad: { py: `def kth_smallest(root, k):
    vals = inorder(root)            # the whole tree, O(n) space
    return vals[k - 1]`, java: `int kthSmallest(TreeNode root, int k) {
    List<Integer> vals = inorder(root);   // the whole tree, O(n) space
    return vals.get(k - 1);
}`, cs: `int KthSmallest(TreeNode root, int k)
{
    List<int> vals = Inorder(root);       // the whole tree, O(n) space
    return vals[k - 1];
}` },
        good: { py: `def kth_smallest(root, k):
    stack, node = [], root
    while True:
        while node:                 # go as far left as possible
            stack.append(node)
            node = node.left
        node = stack.pop()
        k -= 1
        if k == 0:
            return node.val         # stop here
        node = node.right`, java: `int kthSmallest(TreeNode root, int k) {
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode node = root;
    while (true) {
        // go far left
        for (; node != null; node = node.left) stack.push(node);
        node = stack.pop();
        if (--k == 0) return node.val;    // stop here
        node = node.right;
    }
}`, cs: `int KthSmallest(TreeNode root, int k)
{
    var stack = new Stack<TreeNode>();
    var node = root;
    while (true)
    {
        // go far left
        for (; node != null; node = node.left) stack.Push(node);
        node = stack.Pop();
        if (--k == 0) return node.val;    // stop here
        node = node.right;
    }
}` } },
    ],
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
    pitfalls: [
      { py: "heapq is min-only: push negated values for a max-heap.",
        java: "PriorityQueue is a min-heap by default: pass Comparator.reverseOrder() for a max-heap.",
        cs: "PriorityQueue<TElement, TPriority> is a min-heap: negate the priority, or pass a reversed comparer, for a max-heap." },
      "A heap is not sorted: only the top is guaranteed.",
      { py: "For ties in tuples, add a counter, (priority, count, item), so non-comparable items are never compared.",
        java: "Iterating a PriorityQueue doesn't give sorted order: only poll() returns items smallest first.",
        cs: "Enumerating UnorderedItems doesn't give sorted order: only Dequeue() returns items smallest first." }],
    practice: [
      { why: "Sorting everything to keep k items is O(n log n). A min-heap that never holds more than k items does it in O(n log k).",
        bad: { py: `top = sorted(nums, reverse=True)[:k]     # sorts all n`, java: `int[] sorted = nums.clone();
Arrays.sort(sorted);                         // sorts all n
int[] top = Arrays.copyOfRange(sorted, sorted.length - k, sorted.length);`, cs: `var top = nums.OrderByDescending(x => x).Take(k).ToList();   // sorts all n` },
        good: { py: `import heapq

top = heapq.nlargest(k, nums)            # a heap of size k: O(n log k)`, java: `PriorityQueue<Integer> heap = new PriorityQueue<>();   // min-heap
for (int x : nums) {
    heap.offer(x);
    // drop the smallest: k items left
    if (heap.size() > k) heap.poll();
}`, cs: `var heap = new PriorityQueue<int, int>();   // min-heap
foreach (int x in nums)
{
    heap.Enqueue(x, x);
    // drop the smallest: k items left
    if (heap.Count > k) heap.Dequeue();
}` } },
      { why: "Finding and removing the minimum from a list is O(n) each time, so repeating it is O(n²). A heap gives the minimum in O(log n).",
        bad: { py: `cost = 0
while len(sticks) > 1:
    a = min(sticks); sticks.remove(a)    # O(n) each
    b = min(sticks); sticks.remove(b)
    cost += a + b
    sticks.append(a + b)`, java: `int cost = 0;
while (sticks.size() > 1) {
    Integer a = Collections.min(sticks); sticks.remove(a);   // O(n) each
    Integer b = Collections.min(sticks); sticks.remove(b);
    cost += a + b;
    sticks.add(a + b);
}`, cs: `int cost = 0;
while (sticks.Count > 1)
{
    int a = sticks.Min(); sticks.Remove(a);   // O(n) each
    int b = sticks.Min(); sticks.Remove(b);
    cost += a + b;
    sticks.Add(a + b);
}` },
        good: { py: `import heapq

heapq.heapify(sticks)                    # O(n), once
cost = 0
while len(sticks) > 1:
    a, b = heapq.heappop(sticks), heapq.heappop(sticks)   # O(log n)
    cost += a + b
    heapq.heappush(sticks, a + b)`, java: `PriorityQueue<Integer> heap = new PriorityQueue<>(sticks);
int cost = 0;
while (heap.size() > 1) {
    int a = heap.poll(), b = heap.poll();    // O(log n)
    cost += a + b;
    heap.offer(a + b);
}`, cs: `var heap = new PriorityQueue<int, int>(sticks.Select(s => (s, s)));
int cost = 0;
while (heap.Count > 1)
{
    int a = heap.Dequeue(), b = heap.Dequeue();   // O(log n)
    cost += a + b;
    heap.Enqueue(a + b, a + b);
}` } },
      { why: { py: "When two priorities tie, Python compares the next tuple item, and two objects without an order raise `TypeError`. A counter in the middle breaks ties first.",
          java: "`b - a` overflows for big values (say 2,000,000,000 and -2,000,000,000), and the heap orders them wrongly. Use a comparator that can't overflow.",
          cs: "`b - a` overflows for big values (say 2,000,000,000 and -2,000,000,000), and the heap orders them wrongly. Use a comparison that can't overflow." },
        bad: { py: `heap = []
# a tie compares two nodes: TypeError
heapq.heappush(heap, (dist, node))`, java: `// can overflow
PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> b - a);`, cs: `// can overflow
var maxHeap = new PriorityQueue<int, int>(
    Comparer<int>.Create((a, b) => b - a));` },
        good: { py: `from itertools import count

order = count()                          # 0, 1, 2, ...
heap = []
# ties settle on the counter
heapq.heappush(heap, (dist, next(order), node))`, java: `PriorityQueue<Integer> maxHeap =
    new PriorityQueue<>(Comparator.reverseOrder());`, cs: `var maxHeap = new PriorityQueue<int, int>(
    Comparer<int>.Create((a, b) => b.CompareTo(a)));` } },
    ],
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
    practice: [
      { why: "Checking a prefix against every word is O(n·L) per query. A trie walks only the prefix's characters: O(L), however many words there are.",
        bad: { py: `def starts_with(words, prefix):
    # every word, every query
    return any(w.startswith(prefix) for w in words)`, java: `boolean startsWith(List<String> words, String prefix) {
    for (String w : words)                 // every word, every query
        if (w.startsWith(prefix)) return true;
    return false;
}`, cs: `bool StartsWith(List<string> words, string prefix) =>
    // every word
    words.Any(w => w.StartsWith(prefix, StringComparison.Ordinal));` },
        good: { py: `def starts_with(root, prefix):
    node = root
    for c in prefix:
        if c not in node.children:
            return False
        node = node.children[c]
    return True                            # O(len(prefix))`, java: `boolean startsWith(Node root, String prefix) {
    Node node = root;
    for (char c : prefix.toCharArray()) {
        node = node.next[c - 'a'];
        if (node == null) return false;
    }
    return true;                           // O(prefix length)
}`, cs: `bool StartsWith(Node root, string prefix)
{
    var node = root;
    foreach (char c in prefix)
        if (!node.Next.TryGetValue(c, out node)) return false;
    return true;                           // O(prefix length)
}` } },
      { why: "A path in the trie only means some word starts that way. Without checking the end-of-word flag, \"app\" is found just because \"apple\" was added.",
        bad: { py: `def search(root, word):
    node = root
    for c in word:
        if c not in node.children:
            return False
        node = node.children[c]
    # "app" found after inserting "apple"
    return True`, java: `boolean search(Node root, String word) {
    Node node = root;
    for (char c : word.toCharArray()) {
        node = node.next[c - 'a'];
        if (node == null) return false;
    }
    // "app" found after inserting "apple"
    return true;
}`, cs: `bool Search(Node root, string word)
{
    var node = root;
    foreach (char c in word)
        if (!node.Next.TryGetValue(c, out node)) return false;
    // "app" found after inserting "apple"
    return true;
}` },
        good: { py: `def search(root, word):
    node = root
    for c in word:
        if c not in node.children:
            return False
        node = node.children[c]
    return node.is_word                    # a whole word ends here`, java: `boolean search(Node root, String word) {
    Node node = root;
    for (char c : word.toCharArray()) {
        node = node.next[c - 'a'];
        if (node == null) return false;
    }
    return node.isWord;                    // a whole word ends here
}`, cs: `bool Search(Node root, string word)
{
    var node = root;
    foreach (char c in word)
        if (!node.Next.TryGetValue(c, out node)) return false;
    return node.IsWord;                    // a whole word ends here
}` } },
      { why: "Storing every prefix as its own string copies the same letters over and over: O(L²) per word. A trie stores shared prefixes once.",
        bad: { py: `prefixes = set()
for w in words:
    for i in range(1, len(w) + 1):
        # every prefix copied: O(L²) per word
        prefixes.add(w[:i])`, java: `Set<String> prefixes = new HashSet<>();
for (String w : words)
    for (int i = 1; i <= w.length(); i++)
        // every prefix copied: O(L²) per word
        prefixes.add(w.substring(0, i));`, cs: `var prefixes = new HashSet<string>();
foreach (string w in words)
    for (int i = 1; i <= w.Length; i++)
        // every prefix copied: O(L²) per word
        prefixes.Add(w[..i]);` },
        good: { py: `root = TrieNode()
for w in words:
    node = root
    for c in w:
        if c not in node.children:
            node.children[c] = TrieNode()  # shared prefixes stored once
        node = node.children[c]
    node.is_word = True`, java: `Node root = new Node();
for (String w : words) {
    Node node = root;
    for (char c : w.toCharArray()) {
        // stored once
        if (node.next[c - 'a'] == null) node.next[c - 'a'] = new Node();
        node = node.next[c - 'a'];
    }
    node.isWord = true;
}`, cs: `var root = new Node();
foreach (string w in words)
{
    var node = root;
    foreach (char c in w)
    {
        if (!node.Next.TryGetValue(c, out var child))
            // shared prefixes stored once
            node.Next[c] = child = new Node();
        node = child;
    }
    node.IsWord = true;
}` } },
    ],
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
    practice: [
      { why: "An n × n matrix uses O(n²) memory even when there are few edges: 100,000 nodes would need 10 billion cells. An adjacency list uses O(n + edges).",
        bad: { py: `matrix = [[0] * n for _ in range(n)]     # O(n²) memory
for a, b in edges:
    matrix[a][b] = matrix[b][a] = 1`, java: `boolean[][] matrix = new boolean[n][n];  // O(n²) memory
for (int[] e : edges) {
    matrix[e[0]][e[1]] = true;
    matrix[e[1]][e[0]] = true;
}`, cs: `var matrix = new bool[n, n];             // O(n²) memory
foreach (var e in edges)
{
    matrix[e[0], e[1]] = true;
    matrix[e[1], e[0]] = true;
}` },
        good: { py: `from collections import defaultdict

graph = defaultdict(list)                # O(n + edges)
for a, b in edges:
    graph[a].append(b)
    graph[b].append(a)                   # undirected: both ways`, java: `List<List<Integer>> graph = new ArrayList<>();   // O(n + edges)
for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
for (int[] e : edges) {
    graph.get(e[0]).add(e[1]);
    graph.get(e[1]).add(e[0]);           // undirected: both ways
}`, cs: `var graph = new List<int>[n];            // O(n + edges)
for (int i = 0; i < n; i++) graph[i] = new List<int>();
foreach (var e in edges)
{
    graph[e[0]].Add(e[1]);
    graph[e[1]].Add(e[0]);               // undirected: both ways
}` } },
      { why: "Without a visited set, a cycle (or simply an undirected edge, which goes both ways) sends the search around forever.",
        bad: { py: `def dfs(node):
    for nb in graph[node]:
        dfs(nb)                          # A -> B -> A -> B ... forever`, java: `void dfs(int node) {
    for (int nb : graph.get(node))
        dfs(nb);                         // A -> B -> A -> B ... forever
}`, cs: `void Dfs(int node)
{
    foreach (int nb in graph[node])
        Dfs(nb);                         // A -> B -> A -> B ... forever
}` },
        good: { py: `seen = set()

def dfs(node):
    seen.add(node)
    for nb in graph[node]:
        if nb not in seen:               # each node once
            dfs(nb)`, java: `Set<Integer> seen = new HashSet<>();

void dfs(int node) {
    seen.add(node);
    for (int nb : graph.get(node))
        if (!seen.contains(nb)) dfs(nb); // each node once
}`, cs: `HashSet<int> seen = new();

void Dfs(int node)
{
    seen.Add(node);
    foreach (int nb in graph[node])
        if (!seen.Contains(nb)) Dfs(nb); // each node once
}` } },
      { why: "A graph can be in several pieces. Searching from one node only reaches its own piece, so try every node as a start.",
        bad: { py: `dfs(0)
# nodes not reachable from 0 are missed
components = 1`, java: `dfs(0);
// nodes not reachable from 0 are missed
int components = 1;`, cs: `Dfs(0);
// nodes not reachable from 0 are missed
int components = 1;` },
        good: { py: `components = 0
for node in range(n):
    if node not in seen:                 # a new, unvisited piece
        dfs(node)
        components += 1`, java: `int components = 0;
for (int node = 0; node < n; node++) {
    if (!seen.contains(node)) {          // a new, unvisited piece
        dfs(node);
        components++;
    }
}`, cs: `int components = 0;
for (int node = 0; node < n; node++)
{
    if (!seen.Contains(node))            // a new, unvisited piece
    {
        Dfs(node);
        components++;
    }
}` } },
    ],
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
    practice: [
      { why: "Joining the nodes themselves leaves their old groups behind. Always join the two roots.",
        bad: { py: `def union(a, b):
    parent[a] = b                        # a's old group is left behind`, java: `void union(int a, int b) {
    parent[a] = b;                       // a's old group is left behind
}`, cs: `void Union(int a, int b)
{
    parent[a] = b;                       // a's old group is left behind
}` },
        good: { py: `def union(a, b):
    ra, rb = find(a), find(b)
    if ra != rb:
        parent[ra] = rb                  # join the roots`, java: `void union(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra != rb) parent[ra] = rb;       // join the roots
}`, cs: `void Union(int a, int b)
{
    int ra = Find(a), rb = Find(b);
    if (ra != rb) parent[ra] = rb;       // join the roots
}` } },
      { why: "Without path compression (and union by size), chains grow long and each find is O(n). With them, finds are close to O(1).",
        bad: { py: `def find(x):
    while parent[x] != x:
        x = parent[x]                    # walks the whole chain every time
    return x`, java: `int find(int x) {
    // walks the whole chain every time
    while (parent[x] != x) x = parent[x];
    return x;
}`, cs: `int Find(int x)
{
    // walks the whole chain every time
    while (parent[x] != x) x = parent[x];
    return x;
}` },
        good: { py: `def find(x):
    while parent[x] != x:
        # point to the grandparent: paths shrink
        parent[x] = parent[parent[x]]
        x = parent[x]
    return x

def union(a, b):
    ra, rb = find(a), find(b)
    if ra == rb:
        return
    if size[ra] < size[rb]:
        ra, rb = rb, ra
    parent[rb] = ra                      # small tree under big tree
    size[ra] += size[rb]`, java: `int find(int x) {
    while (parent[x] != x) {
        // point to the grandparent: paths shrink
        parent[x] = parent[parent[x]];
        x = parent[x];
    }
    return x;
}

void union(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return;
    if (size[ra] < size[rb]) { int t = ra; ra = rb; rb = t; }
    parent[rb] = ra;                     // small tree under big tree
    size[ra] += size[rb];
}`, cs: `int Find(int x)
{
    while (parent[x] != x)
    {
        // point to the grandparent: paths shrink
        parent[x] = parent[parent[x]];
        x = parent[x];
    }
    return x;
}

void Union(int a, int b)
{
    int ra = Find(a), rb = Find(b);
    if (ra == rb) return;
    if (size[ra] < size[rb]) (ra, rb) = (rb, ra);
    parent[rb] = ra;                     // small tree under big tree
    size[ra] += size[rb];
}` } },
      { why: "Running a fresh search for every new edge is O(edges × (nodes + edges)). Union-Find answers \"already connected?\" in near O(1) as edges arrive.",
        bad: { py: `def redundant_edge(edges):
    graph = defaultdict(list)
    for a, b in edges:
        if connected(graph, a, b):       # a full search per edge
            return [a, b]
        graph[a].append(b)
        graph[b].append(a)`, java: `int[] redundantEdge(int[][] edges) {
    Map<Integer, List<Integer>> graph = new HashMap<>();
    for (int[] e : edges) {
        // a full search per edge
        if (connected(graph, e[0], e[1])) return e;
        graph.computeIfAbsent(e[0], k -> new ArrayList<>()).add(e[1]);
        graph.computeIfAbsent(e[1], k -> new ArrayList<>()).add(e[0]);
    }
    return null;
}`, cs: `int[] RedundantEdge(int[][] edges)
{
    var graph = new Dictionary<int, List<int>>();
    foreach (var e in edges)
    {
        // a full search per edge
        if (Connected(graph, e[0], e[1])) return e;
        AddEdge(graph, e[0], e[1]);
    }
    return null;
}` },
        good: { py: `def redundant_edge(edges):
    parent = list(range(len(edges) + 1))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    for a, b in edges:
        ra, rb = find(a), find(b)
        if ra == rb:
            # already connected: this edge closes a cycle
            return [a, b]
        parent[ra] = rb`, java: `int[] redundantEdge(int[][] edges) {
    parent = new int[edges.length + 1];
    for (int i = 0; i < parent.length; i++) parent[i] = i;
    for (int[] e : edges) {
        int ra = find(e[0]), rb = find(e[1]);
        // already connected: closes a cycle
        if (ra == rb) return e;
        parent[ra] = rb;
    }
    return null;
}`, cs: `int[] RedundantEdge(int[][] edges)
{
    parent = Enumerable.Range(0, edges.Length + 1).ToArray();
    foreach (var e in edges)
    {
        int ra = Find(e[0]), rb = Find(e[1]);
        // already connected: closes a cycle
        if (ra == rb) return e;
        parent[ra] = rb;
    }
    return null;
}` } },
    ],
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
