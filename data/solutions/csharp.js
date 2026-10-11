// C# solutions in LeetCode's format (System, System.Collections.Generic, System.Linq and System.Text are
// available, as on LeetCode), shown when C# is the main language. Each one is checked against the same
// tests as the Python solution by tools/verify/verify.py. The approach and complexity text is shared
// with the Python solution (SOL).

// ---- First batch: one of each input / output shape ----
addLang("cs", "two-sum", String.raw`public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        var seen = new Dictionary<int, int>();   // value -> index
        for (int i = 0; i < nums.Length; i++) {
            if (seen.TryGetValue(target - nums[i], out int j)) return new[] { j, i };
            seen[nums[i]] = i;
        }
        return Array.Empty<int>();
    }
}`);
addLang("cs", "move-zeroes", String.raw`public class Solution {
    public void MoveZeroes(int[] nums) {
        int w = 0;
        foreach (int x in nums)
            if (x != 0) nums[w++] = x;
        while (w < nums.Length) nums[w++] = 0;
    }
}`);
addLang("cs", "remove-duplicates-from-sorted-array", String.raw`public class Solution {
    public int RemoveDuplicates(int[] nums) {
        int w = 1;
        for (int r = 1; r < nums.Length; r++)
            if (nums[r] != nums[r - 1]) nums[w++] = nums[r];
        return w;
    }
}`);
addLang("cs", "merge-two-sorted-lists", String.raw`public class Solution {
    public ListNode MergeTwoLists(ListNode list1, ListNode list2) {
        var dummy = new ListNode();
        var tail = dummy;
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) { tail.next = list1; list1 = list1.next; }
            else { tail.next = list2; list2 = list2.next; }
            tail = tail.next;
        }
        tail.next = list1 ?? list2;
        return dummy.next;
    }
}`);
addLang("cs", "merge-k-sorted-lists", String.raw`public class Solution {
    public ListNode MergeKLists(ListNode[] lists) {
        var heap = new PriorityQueue<ListNode, int>();
        foreach (var node in lists)
            if (node != null) heap.Enqueue(node, node.val);
        var dummy = new ListNode();
        var tail = dummy;
        while (heap.Count > 0) {
            var node = heap.Dequeue();
            tail.next = node;
            tail = node;
            if (node.next != null) heap.Enqueue(node.next, node.next.val);
        }
        return dummy.next;
    }
}`);
addLang("cs", "linked-list-cycle", String.raw`public class Solution {
    public bool HasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}`);
addLang("cs", "invert-binary-tree", String.raw`public class Solution {
    public TreeNode InvertTree(TreeNode root) {
        if (root != null)
            (root.left, root.right) = (InvertTree(root.right), InvertTree(root.left));
        return root;
    }
}`);
addLang("cs", "lowest-common-ancestor-of-a-binary-search-tree", String.raw`public class Solution {
    public TreeNode LowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        while (root != null) {
            if (p.val < root.val && q.val < root.val) root = root.left;
            else if (p.val > root.val && q.val > root.val) root = root.right;
            else return root;
        }
        return null;
    }
}`);
addLang("cs", "clone-graph", String.raw`public class Solution {
    private readonly Dictionary<Node, Node> copies = new();

    public Node CloneGraph(Node node) {
        if (node == null) return null;
        if (copies.TryGetValue(node, out var done)) return done;
        var c = new Node(node.val);
        copies[node] = c;
        foreach (var nb in node.neighbors) c.neighbors.Add(CloneGraph(nb));
        return c;
    }
}`);
addLang("cs", "copy-list-with-random-pointer", String.raw`public class Solution {
    public Node CopyRandomList(Node head) {
        var m = new Dictionary<Node, Node>();
        for (var cur = head; cur != null; cur = cur.next) m[cur] = new Node(cur.val);
        for (var cur = head; cur != null; cur = cur.next) {
            m[cur].next = cur.next == null ? null : m[cur.next];
            m[cur].random = cur.random == null ? null : m[cur.random];
        }
        return head == null ? null : m[head];
    }
}`);
addLang("cs", "serialize-and-deserialize-binary-tree", String.raw`public class Codec {
    public string serialize(TreeNode root) {
        var parts = new List<string>();
        void Write(TreeNode node) {
            if (node == null) { parts.Add("N"); return; }
            parts.Add(node.val.ToString());
            Write(node.left);
            Write(node.right);
        }
        Write(root);
        return string.Join(",", parts);
    }

    public TreeNode deserialize(string data) {
        var it = new Queue<string>(data.Split(','));
        TreeNode Read() {
            string v = it.Dequeue();
            if (v == "N") return null;
            var node = new TreeNode(int.Parse(v));
            node.left = Read();
            node.right = Read();
            return node;
        }
        return Read();
    }
}`);
addLang("cs", "first-bad-version", String.raw`public class Solution : VersionControl {
    public int FirstBadVersion(int n) {
        int lo = 1, hi = n;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;   // (lo + hi) / 2 can overflow
            if (IsBadVersion(mid)) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }
}`);
addLang("cs", "flatten-nested-list-iterator", String.raw`public class NestedIterator {
    private readonly Stack<NestedInteger> stack = new();

    public NestedIterator(IList<NestedInteger> nestedList) {
        for (int i = nestedList.Count - 1; i >= 0; i--) stack.Push(nestedList[i]);
    }

    public bool HasNext() {
        while (stack.Count > 0 && !stack.Peek().IsInteger()) {
            var inner = stack.Pop().GetList();
            for (int i = inner.Count - 1; i >= 0; i--) stack.Push(inner[i]);
        }
        return stack.Count > 0;
    }

    public int Next() {
        HasNext();
        return stack.Pop().GetInteger();
    }
}`);
addLang("cs", "encode-and-decode-strings", String.raw`public class Codec {
    // Each string as "<length>#<string>", so any character (even '#') is safe.
    public string encode(IList<string> strs) {
        var sb = new StringBuilder();
        foreach (var s in strs) sb.Append(s.Length).Append('#').Append(s);
        return sb.ToString();
    }

    public IList<string> decode(string s) {
        var res = new List<string>();
        int i = 0;
        while (i < s.Length) {
            int j = s.IndexOf('#', i);
            int n = int.Parse(s.Substring(i, j - i));
            res.Add(s.Substring(j + 1, n));
            i = j + 1 + n;
        }
        return res;
    }
}`);
addLang("cs", "lru-cache", String.raw`public class LRUCache {
    private readonly int cap;
    private readonly Dictionary<int, LinkedListNode<(int Key, int Value)>> map = new();
    private readonly LinkedList<(int Key, int Value)> order = new();   // most recently used first

    public LRUCache(int capacity) { cap = capacity; }

    public int Get(int key) {
        if (!map.TryGetValue(key, out var node)) return -1;
        order.Remove(node);
        order.AddFirst(node);
        return node.Value.Value;
    }

    public void Put(int key, int value) {
        if (map.TryGetValue(key, out var old)) order.Remove(old);
        var node = order.AddFirst((key, value));
        map[key] = node;
        if (map.Count > cap) {
            map.Remove(order.Last.Value.Key);
            order.RemoveLast();
        }
    }
}`);

// ---- Arrays & Hashing, strings ----
addLang("cs", "contains-duplicate", String.raw`public class Solution {
    public bool ContainsDuplicate(int[] nums) {
        var seen = new HashSet<int>();
        foreach (int x in nums)
            if (!seen.Add(x)) return true;   // Add returns false if x was already there
        return false;
    }
}`);
addLang("cs", "valid-anagram", String.raw`public class Solution {
    public bool IsAnagram(string s, string t) {
        if (s.Length != t.Length) return false;
        var count = new int[26];
        for (int i = 0; i < s.Length; i++) {
            count[s[i] - 'a']++;
            count[t[i] - 'a']--;
        }
        return count.All(c => c == 0);
    }
}`);
addLang("cs", "majority-element", String.raw`public class Solution {
    public int MajorityElement(int[] nums) {
        int cand = 0, count = 0;   // Boyer-Moore voting
        foreach (int x in nums) {
            if (count == 0) cand = x;
            count += x == cand ? 1 : -1;
        }
        return cand;
    }
}`);
addLang("cs", "group-anagrams", String.raw`public class Solution {
    public IList<IList<string>> GroupAnagrams(string[] strs) {
        var groups = new Dictionary<string, IList<string>>();
        foreach (var w in strs) {
            var chars = w.ToCharArray();
            Array.Sort(chars);
            var key = new string(chars);
            if (!groups.TryGetValue(key, out var list)) groups[key] = list = new List<string>();
            list.Add(w);
        }
        return groups.Values.ToList();
    }
}`);
addLang("cs", "top-k-frequent-elements", String.raw`public class Solution {
    public int[] TopKFrequent(int[] nums, int k) {
        var count = new Dictionary<int, int>();
        foreach (int x in nums) count[x] = count.GetValueOrDefault(x) + 1;
        var buckets = new List<int>[nums.Length + 1];   // buckets[c] = numbers seen c times
        foreach (var (num, c) in count) (buckets[c] ??= new List<int>()).Add(num);
        var res = new List<int>();
        for (int c = nums.Length; c > 0 && res.Count < k; c--)
            if (buckets[c] != null)
                foreach (int num in buckets[c])
                    if (res.Count < k) res.Add(num);
        return res.ToArray();
    }
}`);
addLang("cs", "product-of-array-except-self", String.raw`public class Solution {
    public int[] ProductExceptSelf(int[] nums) {
        int n = nums.Length;
        var res = new int[n];
        int left = 1;
        for (int i = 0; i < n; i++) {   // res[i] = product of everything to the left
            res[i] = left;
            left *= nums[i];
        }
        int right = 1;
        for (int i = n - 1; i >= 0; i--) {   // times the product of everything to the right
            res[i] *= right;
            right *= nums[i];
        }
        return res;
    }
}`);
addLang("cs", "valid-sudoku", String.raw`public class Solution {
    public bool IsValidSudoku(char[][] board) {
        var seen = new HashSet<string>();
        for (int r = 0; r < 9; r++)
            for (int c = 0; c < 9; c++) {
                char v = board[r][c];
                if (v == '.') continue;
                // one set, three kinds of key: row, column and 3x3 box
                if (!seen.Add($"{v} in row {r}") || !seen.Add($"{v} in col {c}") || !seen.Add($"{v} in box {r / 3},{c / 3}"))
                    return false;
            }
        return true;
    }
}`);
addLang("cs", "longest-consecutive-sequence", String.raw`public class Solution {
    public int LongestConsecutive(int[] nums) {
        var s = new HashSet<int>(nums);
        int best = 0;
        foreach (int x in s) {
            if (s.Contains(x - 1)) continue;   // only count from the start of a run
            int y = x;
            while (s.Contains(y + 1)) y++;
            best = Math.Max(best, y - x + 1);
        }
        return best;
    }
}`);
addLang("cs", "subarray-sum-equals-k", String.raw`public class Solution {
    public int SubarraySum(int[] nums, int k) {
        var freq = new Dictionary<int, int> { [0] = 1 };   // prefix sum -> how often seen
        int pre = 0, count = 0;
        foreach (int x in nums) {
            pre += x;
            count += freq.GetValueOrDefault(pre - k);
            freq[pre] = freq.GetValueOrDefault(pre) + 1;
        }
        return count;
    }
}`);
addLang("cs", "longest-common-prefix", String.raw`public class Solution {
    public string LongestCommonPrefix(string[] strs) {
        string prefix = strs[0];
        foreach (var s in strs.Skip(1))
            while (!s.StartsWith(prefix, StringComparison.Ordinal))
                prefix = prefix[..^1];
        return prefix;
    }
}`);
addLang("cs", "rotate-array", String.raw`public class Solution {
    public void Rotate(int[] nums, int k) {
        int n = nums.Length;
        k %= n;
        Array.Reverse(nums);
        Array.Reverse(nums, 0, k);
        Array.Reverse(nums, k, n - k);
    }
}`);
addLang("cs", "intersection-of-two-arrays", String.raw`public class Solution {
    public int[] Intersection(int[] nums1, int[] nums2) {
        var a = new HashSet<int>(nums1);
        a.IntersectWith(nums2);
        return a.ToArray();
    }
}`);
addLang("cs", "find-the-index-of-the-first-occurrence-in-a-string", String.raw`public class Solution {
    public int StrStr(string haystack, string needle) {
        int n = haystack.Length, m = needle.Length;
        for (int i = 0; i + m <= n; i++)
            if (string.CompareOrdinal(haystack, i, needle, 0, m) == 0) return i;
        return -1;
    }
}`);
addLang("cs", "first-missing-positive", String.raw`public class Solution {
    public int FirstMissingPositive(int[] nums) {
        int n = nums.Length;
        for (int i = 0; i < n; i++)
            // put each value v in 1..n at index v - 1 (cyclic sort)
            while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                int j = nums[i] - 1;
                (nums[i], nums[j]) = (nums[j], nums[i]);
            }
        for (int i = 0; i < n; i++)
            if (nums[i] != i + 1) return i + 1;
        return n + 1;
    }
}`);
addLang("cs", "check-if-array-is-sorted-and-rotated", String.raw`public class Solution {
    public bool Check(int[] nums) {
        int n = nums.Length, drops = 0;
        for (int i = 0; i < n; i++)
            if (nums[i] > nums[(i + 1) % n]) drops++;
        return drops <= 1;
    }
}`);
addLang("cs", "first-unique-character-in-a-string", String.raw`public class Solution {
    public int FirstUniqChar(string s) {
        var count = new int[26];
        foreach (char c in s) count[c - 'a']++;
        for (int i = 0; i < s.Length; i++)
            if (count[s[i] - 'a'] == 1) return i;
        return -1;
    }
}`);
addLang("cs", "rotate-string", String.raw`public class Solution {
    public bool RotateString(string s, string goal) {
        return s.Length == goal.Length && (s + s).Contains(goal);
    }
}`);
addLang("cs", "length-of-last-word", String.raw`public class Solution {
    public int LengthOfLastWord(string s) {
        int i = s.Length - 1, n = 0;
        while (s[i] == ' ') i--;
        while (i >= 0 && s[i] != ' ') { n++; i--; }
        return n;
    }
}`);
addLang("cs", "isomorphic-strings", String.raw`public class Solution {
    public bool IsIsomorphic(string s, string t) {
        var st = new Dictionary<char, char>();
        var ts = new Dictionary<char, char>();
        for (int i = 0; i < s.Length; i++) {
            char a = s[i], b = t[i];
            if (st.GetValueOrDefault(a, b) != b || ts.GetValueOrDefault(b, a) != a) return false;
            st[a] = b;
            ts[b] = a;
        }
        return true;
    }
}`);
addLang("cs", "zigzag-conversion", String.raw`public class Solution {
    public string Convert(string s, int numRows) {
        if (numRows == 1) return s;
        var rows = new StringBuilder[numRows];
        for (int i = 0; i < numRows; i++) rows[i] = new StringBuilder();
        int r = 0, step = 1;
        foreach (char c in s) {
            rows[r].Append(c);
            if (r == 0) step = 1;
            else if (r == numRows - 1) step = -1;
            r += step;
        }
        return string.Concat(rows.Select(row => row.ToString()));
    }
}`);

addLang("cs", "set-mismatch", String.raw`public class Solution {
    public int[] FindErrorNums(int[] nums) {
        int n = nums.Length;
        var seen = new int[n + 1];
        foreach (int x in nums) seen[x]++;
        int dup = 0, missing = 0;
        for (int v = 1; v <= n; v++) {
            if (seen[v] == 2) dup = v;
            if (seen[v] == 0) missing = v;
        }
        return new[] { dup, missing };
    }
}`);
addLang("cs", "ransom-note", String.raw`public class Solution {
    public bool CanConstruct(string ransomNote, string magazine) {
        var have = new int[26];
        foreach (char c in magazine) have[c - 'a']++;
        foreach (char c in ransomNote)
            if (--have[c - 'a'] < 0) return false;
        return true;
    }
}`);
addLang("cs", "can-make-arithmetic-progression-from-sequence", String.raw`public class Solution {
    public bool CanMakeArithmeticProgression(int[] arr) {
        Array.Sort(arr);
        int d = arr[1] - arr[0];
        for (int i = 0; i + 1 < arr.Length; i++)
            if (arr[i + 1] - arr[i] != d) return false;
        return true;
    }
}`);
addLang("cs", "majority-element-ii", String.raw`public class Solution {
    public IList<int> MajorityElement(int[] nums) {
        // Boyer-Moore with two candidates: at most two values can appear more than n/3 times
        int? c1 = null, c2 = null;
        int n1 = 0, n2 = 0;
        foreach (int x in nums) {
            if (x == c1) n1++;
            else if (x == c2) n2++;
            else if (n1 == 0) { c1 = x; n1 = 1; }
            else if (n2 == 0) { c2 = x; n2 = 1; }
            else { n1--; n2--; }
        }
        var res = new List<int>();
        foreach (var c in new[] { c1, c2 })
            if (c.HasValue && nums.Count(x => x == c) > nums.Length / 3) res.Add(c.Value);
        return res;
    }
}`);
addLang("cs", "sort-an-array", String.raw`public class Solution {
    public int[] SortArray(int[] nums) {   // merge sort
        if (nums.Length <= 1) return nums;
        int mid = nums.Length / 2;
        int[] a = SortArray(nums[..mid]), b = SortArray(nums[mid..]);
        var output = new int[nums.Length];
        int i = 0, j = 0, k = 0;
        while (i < a.Length && j < b.Length) output[k++] = a[i] <= b[j] ? a[i++] : b[j++];
        while (i < a.Length) output[k++] = a[i++];
        while (j < b.Length) output[k++] = b[j++];
        return output;
    }
}`);
addLang("cs", "subarray-sums-divisible-by-k", String.raw`public class Solution {
    public int SubarraysDivByK(int[] nums, int k) {
        var count = new int[k];   // remainder of the prefix sum -> how often seen
        count[0] = 1;
        int prefix = 0, res = 0;
        foreach (int x in nums) {
            prefix = ((prefix + x) % k + k) % k;   // C#'s % can be negative
            res += count[prefix]++;
        }
        return res;
    }
}`);
addLang("cs", "contiguous-array", String.raw`public class Solution {
    public int FindMaxLength(int[] nums) {
        var first = new Dictionary<int, int> { [0] = -1 };   // running balance -> first index seen
        int total = 0, best = 0;
        for (int i = 0; i < nums.Length; i++) {
            total += nums[i] == 1 ? 1 : -1;
            if (first.TryGetValue(total, out int j)) best = Math.Max(best, i - j);
            else first[total] = i;
        }
        return best;
    }
}`);
addLang("cs", "reverse-pairs", String.raw`public class Solution {
    public int ReversePairs(int[] nums) => Sort(nums, 0, nums.Length - 1);

    // Merge sort that also counts pairs i < j with nums[i] > 2 * nums[j] across the two halves.
    private int Sort(int[] a, int lo, int hi) {
        if (lo >= hi) return 0;
        int mid = (lo + hi) / 2;
        int count = Sort(a, lo, mid) + Sort(a, mid + 1, hi);
        for (int i = lo, j = mid + 1; i <= mid; i++) {
            while (j <= hi && a[i] > 2L * a[j]) j++;   // 2L: 2 * a[j] can overflow an int
            count += j - (mid + 1);
        }
        Array.Sort(a, lo, hi - lo + 1);   // both halves are sorted; a merge would do, Sort keeps it short
        return count;
    }
}`);
addLang("cs", "range-sum-query-immutable", String.raw`public class NumArray {
    private readonly int[] prefix;   // prefix[i] = sum of the first i numbers

    public NumArray(int[] nums) {
        prefix = new int[nums.Length + 1];
        for (int i = 0; i < nums.Length; i++) prefix[i + 1] = prefix[i] + nums[i];
    }

    public int SumRange(int left, int right) => prefix[right + 1] - prefix[left];
}`);
addLang("cs", "find-the-highest-altitude", String.raw`public class Solution {
    public int LargestAltitude(int[] gain) {
        int alt = 0, best = 0;
        foreach (int g in gain) {
            alt += g;
            best = Math.Max(best, alt);
        }
        return best;
    }
}`);
addLang("cs", "find-pivot-index", String.raw`public class Solution {
    public int PivotIndex(int[] nums) {
        int total = nums.Sum(), left = 0;
        for (int i = 0; i < nums.Length; i++) {
            if (left == total - left - nums[i]) return i;
            left += nums[i];
        }
        return -1;
    }
}`);
addLang("cs", "left-and-right-sum-differences", String.raw`public class Solution {
    public int[] LeftRightDifference(int[] nums) {
        int total = nums.Sum(), left = 0;
        var res = new int[nums.Length];
        for (int i = 0; i < nums.Length; i++) {
            res[i] = Math.Abs(left - (total - left - nums[i]));
            left += nums[i];
        }
        return res;
    }
}`);
addLang("cs", "rank-transform-of-an-array", String.raw`public class Solution {
    public int[] ArrayRankTransform(int[] arr) {
        var rank = new Dictionary<int, int>();
        foreach (int v in arr.Distinct().OrderBy(v => v)) rank[v] = rank.Count + 1;
        return arr.Select(v => rank[v]).ToArray();
    }
}`);
addLang("cs", "number-of-strings-that-appear-as-substrings-in-word", String.raw`public class Solution {
    public int NumOfStrings(string[] patterns, string word) {
        return patterns.Count(p => word.Contains(p));
    }
}`);
addLang("cs", "insert-delete-getrandom-o1", String.raw`public class RandomizedSet {
    private readonly List<int> vals = new();
    private readonly Dictionary<int, int> pos = new();   // value -> its index in vals
    private readonly Random rand = new();

    public bool Insert(int val) {
        if (pos.ContainsKey(val)) return false;
        pos[val] = vals.Count;
        vals.Add(val);
        return true;
    }

    public bool Remove(int val) {
        if (!pos.Remove(val, out int i)) return false;
        int last = vals[^1];   // move the last value into the gap
        vals.RemoveAt(vals.Count - 1);
        if (i < vals.Count) {
            vals[i] = last;
            pos[last] = i;
        }
        return true;
    }

    public int GetRandom() => vals[rand.Next(vals.Count)];
}`);
addLang("cs", "count-subarrays-with-majority-element-i", String.raw`public class Solution {
    public int CountMajoritySubarrays(int[] nums, int target) {
        int n = nums.Length, res = 0;
        for (int i = 0; i < n; i++) {
            int bal = 0;   // (count of target) - (count of everything else)
            for (int j = i; j < n; j++) {
                bal += nums[j] == target ? 1 : -1;
                if (bal > 0) res++;
            }
        }
        return res;
    }
}`);
addLang("cs", "minimum-moves-to-make-array-complementary", String.raw`public class Solution {
    public int MinMoves(int[] nums, int limit) {
        int n = nums.Length;
        var diff = new int[2 * limit + 2];   // difference array over target sums
        for (int i = 0; i < n / 2; i++) {
            int a = Math.Min(nums[i], nums[n - 1 - i]), b = Math.Max(nums[i], nums[n - 1 - i]);
            diff[2] += 2;
            diff[a + 1] -= 1;
            diff[a + b] -= 1;
            diff[a + b + 1] += 1;
            diff[b + limit + 1] += 1;
        }
        int best = int.MaxValue, cur = 0;
        for (int t = 2; t <= 2 * limit; t++) {
            cur += diff[t];
            best = Math.Min(best, cur);
        }
        return best;
    }
}`);
addLang("cs", "design-hit-counter", String.raw`public class HitCounter {
    private readonly Queue<int> q = new();

    public void Hit(int timestamp) => q.Enqueue(timestamp);

    public int GetHits(int timestamp) {
        while (q.Count > 0 && q.Peek() <= timestamp - 300) q.Dequeue();
        return q.Count;
    }
}`);
addLang("cs", "design-authentication-manager", String.raw`public class AuthenticationManager {
    private readonly int ttl;
    private readonly Dictionary<string, int> expiry = new();

    public AuthenticationManager(int timeToLive) => ttl = timeToLive;

    public void Generate(string tokenId, int currentTime) => expiry[tokenId] = currentTime + ttl;

    public void Renew(string tokenId, int currentTime) {
        if (expiry.GetValueOrDefault(tokenId) > currentTime) expiry[tokenId] = currentTime + ttl;
    }

    public int CountUnexpiredTokens(int currentTime) => expiry.Values.Count(t => t > currentTime);
}`);
addLang("cs", "design-spreadsheet", String.raw`public class Spreadsheet {
    private readonly Dictionary<string, int> cells = new();

    public Spreadsheet(int rows) { }

    public void SetCell(string cell, int value) => cells[cell] = value;

    public void ResetCell(string cell) => cells.Remove(cell);

    public int GetValue(string formula) {
        var parts = formula[1..].Split('+');
        return Val(parts[0]) + Val(parts[1]);
    }

    private int Val(string x) => char.IsDigit(x[0]) ? int.Parse(x) : cells.GetValueOrDefault(x);
}`);

addLang("cs", "design-memory-allocator", String.raw`public class Allocator {
    private readonly int[] mem;   // 0 = free, otherwise the mID that owns the unit

    public Allocator(int n) => mem = new int[n];

    public int Allocate(int size, int mID) {
        int run = 0;
        for (int i = 0; i < mem.Length; i++) {
            run = mem[i] == 0 ? run + 1 : 0;
            if (run == size) {
                int start = i - size + 1;
                Array.Fill(mem, mID, start, size);
                return start;
            }
        }
        return -1;
    }

    public int FreeMemory(int mID) {
        int count = 0;
        for (int i = 0; i < mem.Length; i++)
            if (mem[i] == mID) { mem[i] = 0; count++; }
        return count;
    }
}`);
addLang("cs", "in-memory-database", String.raw`public class InMemoryDB {
    private record Rec(string Value, int? ExpiresAt);   // ExpiresAt == null: never expires

    private readonly Dictionary<string, Dictionary<string, Rec>> data = new();

    private static bool Alive(Rec rec, int t) => rec != null && (rec.ExpiresAt == null || t < rec.ExpiresAt);

    private Rec Find(string key, string field) =>
        data.TryGetValue(key, out var fields) ? fields.GetValueOrDefault(field) : null;

    private Dictionary<string, Rec> Fields(string key) => data.TryGetValue(key, out var f) ? f : data[key] = new();

    public void Set(int timestamp, string key, string field, string value) => Fields(key)[field] = new Rec(value, null);

    public void SetWithTtl(int timestamp, string key, string field, string value, int ttl) =>
        Fields(key)[field] = new Rec(value, timestamp + ttl);

    public string Get(int timestamp, string key, string field) {
        var rec = Find(key, field);
        return Alive(rec, timestamp) ? rec.Value : null;
    }

    public bool Delete(int timestamp, string key, string field) {
        if (!Alive(Find(key, field), timestamp)) return false;
        data[key].Remove(field);
        return true;
    }

    public IList<string> Scan(int timestamp, string key) => ScanByPrefix(timestamp, key, "");

    public IList<string> ScanByPrefix(int timestamp, string key, string prefix) {
        if (!data.TryGetValue(key, out var fields)) return new List<string>();
        return fields.Where(e => e.Key.StartsWith(prefix, StringComparison.Ordinal) && Alive(e.Value, timestamp))
                     .OrderBy(e => e.Key, StringComparer.Ordinal)
                     .Select(e => $"{e.Key}({e.Value.Value})")
                     .ToList();
    }
}`);
addLang("cs", "valid-palindrome", String.raw`public class Solution {
    public bool IsPalindrome(string s) {
        int l = 0, r = s.Length - 1;
        while (l < r) {
            while (l < r && !char.IsLetterOrDigit(s[l])) l++;
            while (l < r && !char.IsLetterOrDigit(s[r])) r--;
            if (char.ToLowerInvariant(s[l]) != char.ToLowerInvariant(s[r])) return false;
            l++;
            r--;
        }
        return true;
    }
}`);
addLang("cs", "merge-sorted-array", String.raw`public class Solution {
    public void Merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1, j = n - 1, k = m + n - 1;   // fill from the back
        while (j >= 0) {
            if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
            else nums1[k--] = nums2[j--];
        }
    }
}`);
addLang("cs", "two-sum-ii-input-array-is-sorted", String.raw`public class Solution {
    public int[] TwoSum(int[] numbers, int target) {
        int l = 0, r = numbers.Length - 1;
        while (l < r) {
            int s = numbers[l] + numbers[r];
            if (s == target) return new[] { l + 1, r + 1 };
            if (s < target) l++;
            else r--;
        }
        return Array.Empty<int>();
    }
}`);
addLang("cs", "3sum", String.raw`public class Solution {
    public IList<IList<int>> ThreeSum(int[] nums) {
        Array.Sort(nums);
        var res = new List<IList<int>>();
        for (int i = 0; i < nums.Length && nums[i] <= 0; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;   // skip duplicate first numbers
            int l = i + 1, r = nums.Length - 1;
            while (l < r) {
                int s = nums[i] + nums[l] + nums[r];
                if (s < 0) l++;
                else if (s > 0) r--;
                else {
                    res.Add(new List<int> { nums[i], nums[l], nums[r] });
                    l++;
                    while (l < r && nums[l] == nums[l - 1]) l++;
                }
            }
        }
        return res;
    }
}`);
addLang("cs", "3sum-closest", String.raw`public class Solution {
    public int ThreeSumClosest(int[] nums, int target) {
        Array.Sort(nums);
        int best = nums[0] + nums[1] + nums[2];
        for (int i = 0; i < nums.Length - 2; i++) {
            int lo = i + 1, hi = nums.Length - 1;
            while (lo < hi) {
                int s = nums[i] + nums[lo] + nums[hi];
                if (Math.Abs(s - target) < Math.Abs(best - target)) best = s;
                if (s < target) lo++;
                else if (s > target) hi--;
                else return s;
            }
        }
        return best;
    }
}`);
addLang("cs", "4sum", String.raw`public class Solution {
    public IList<IList<int>> FourSum(int[] nums, int target) {
        Array.Sort(nums);
        int n = nums.Length;
        var res = new List<IList<int>>();
        for (int a = 0; a < n - 3; a++) {
            if (a > 0 && nums[a] == nums[a - 1]) continue;
            for (int b = a + 1; b < n - 2; b++) {
                if (b > a + 1 && nums[b] == nums[b - 1]) continue;
                int lo = b + 1, hi = n - 1;
                while (lo < hi) {
                    long s = (long)nums[a] + nums[b] + nums[lo] + nums[hi];   // long: four ints can overflow
                    if (s < target) lo++;
                    else if (s > target) hi--;
                    else {
                        res.Add(new List<int> { nums[a], nums[b], nums[lo], nums[hi] });
                        lo++;
                        while (lo < hi && nums[lo] == nums[lo - 1]) lo++;
                        hi--;
                    }
                }
            }
        }
        return res;
    }
}`);
addLang("cs", "next-permutation", String.raw`public class Solution {
    public void NextPermutation(int[] nums) {
        int i = nums.Length - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) i--;   // rightmost place where the order rises
        if (i >= 0) {
            int j = nums.Length - 1;
            while (nums[j] <= nums[i]) j--;
            (nums[i], nums[j]) = (nums[j], nums[i]);
        }
        Array.Reverse(nums, i + 1, nums.Length - i - 1);
    }
}`);
addLang("cs", "container-with-most-water", String.raw`public class Solution {
    public int MaxArea(int[] height) {
        int l = 0, r = height.Length - 1, best = 0;
        while (l < r) {
            best = Math.Max(best, (r - l) * Math.Min(height[l], height[r]));
            if (height[l] < height[r]) l++;   // move the shorter wall
            else r--;
        }
        return best;
    }
}`);
addLang("cs", "sort-colors", String.raw`public class Solution {
    public void SortColors(int[] nums) {
        int lo = 0, i = 0, hi = nums.Length - 1;   // Dutch national flag
        while (i <= hi) {
            if (nums[i] == 0) { (nums[lo], nums[i]) = (nums[i], nums[lo]); lo++; i++; }
            else if (nums[i] == 2) { (nums[hi], nums[i]) = (nums[i], nums[hi]); hi--; }
            else i++;
        }
    }
}`);
addLang("cs", "trapping-rain-water", String.raw`public class Solution {
    public int Trap(int[] height) {
        int l = 0, r = height.Length - 1, lmax = 0, rmax = 0, water = 0;
        while (l < r) {
            if (height[l] < height[r]) {
                lmax = Math.Max(lmax, height[l]);
                water += lmax - height[l++];
            } else {
                rmax = Math.Max(rmax, height[r]);
                water += rmax - height[r--];
            }
        }
        return water;
    }
}`);
addLang("cs", "remove-element", String.raw`public class Solution {
    public int RemoveElement(int[] nums, int val) {
        int k = 0;
        foreach (int x in nums)
            if (x != val) nums[k++] = x;
        return k;
    }
}`);
addLang("cs", "merge-strings-alternately", String.raw`public class Solution {
    public string MergeAlternately(string word1, string word2) {
        var sb = new StringBuilder();
        for (int i = 0; i < Math.Max(word1.Length, word2.Length); i++) {
            if (i < word1.Length) sb.Append(word1[i]);
            if (i < word2.Length) sb.Append(word2[i]);
        }
        return sb.ToString();
    }
}`);
addLang("cs", "squares-of-a-sorted-array", String.raw`public class Solution {
    public int[] SortedSquares(int[] nums) {
        var res = new int[nums.Length];
        int lo = 0, hi = nums.Length - 1;
        for (int k = nums.Length - 1; k >= 0; k--) {   // the biggest square is at one of the ends
            if (Math.Abs(nums[lo]) > Math.Abs(nums[hi])) { res[k] = nums[lo] * nums[lo]; lo++; }
            else { res[k] = nums[hi] * nums[hi]; hi--; }
        }
        return res;
    }
}`);
addLang("cs", "valid-palindrome-ii", String.raw`public class Solution {
    public bool ValidPalindrome(string s) {
        int lo = 0, hi = s.Length - 1;
        while (lo < hi) {
            if (s[lo] != s[hi])   // skip one side or the other
                return IsPal(s, lo + 1, hi) || IsPal(s, lo, hi - 1);
            lo++;
            hi--;
        }
        return true;
    }

    private static bool IsPal(string s, int lo, int hi) {
        while (lo < hi)
            if (s[lo++] != s[hi--]) return false;
        return true;
    }
}`);
addLang("cs", "reverse-string", String.raw`public class Solution {
    public void ReverseString(char[] s) {
        for (int lo = 0, hi = s.Length - 1; lo < hi; lo++, hi--)
            (s[lo], s[hi]) = (s[hi], s[lo]);
    }
}`);
addLang("cs", "remove-duplicates-from-sorted-array-ii", String.raw`public class Solution {
    public int RemoveDuplicates(int[] nums) {
        int k = 0;
        foreach (int x in nums)
            if (k < 2 || x != nums[k - 2]) nums[k++] = x;   // keep at most two of each
        return k;
    }
}`);
addLang("cs", "reverse-vowels-of-a-string", String.raw`public class Solution {
    public string ReverseVowels(string s) {
        const string vowels = "aeiouAEIOU";
        var a = s.ToCharArray();
        int lo = 0, hi = a.Length - 1;
        while (lo < hi) {
            if (!vowels.Contains(a[lo])) lo++;
            else if (!vowels.Contains(a[hi])) hi--;
            else { (a[lo], a[hi]) = (a[hi], a[lo]); lo++; hi--; }
        }
        return new string(a);
    }
}`);
addLang("cs", "reverse-words-in-a-string", String.raw`public class Solution {
    public string ReverseWords(string s) {
        return string.Join(" ", s.Split(' ', StringSplitOptions.RemoveEmptyEntries).Reverse());
    }
}`);

addLang("cs", "string-compression", String.raw`public class Solution {
    public int Compress(char[] chars) {
        int write = 0, read = 0;
        while (read < chars.Length) {
            char c = chars[read];
            int start = read;
            while (read < chars.Length && chars[read] == c) read++;
            chars[write++] = c;
            if (read - start > 1)
                foreach (char d in (read - start).ToString()) chars[write++] = d;
        }
        return write;
    }
}`);
addLang("cs", "is-subsequence", String.raw`public class Solution {
    public bool IsSubsequence(string s, string t) {
        int i = 0;
        foreach (char c in t)
            if (i < s.Length && s[i] == c) i++;
        return i == s.Length;
    }
}`);
addLang("cs", "rearrange-array-elements-by-sign", String.raw`public class Solution {
    public int[] RearrangeArray(int[] nums) {
        var res = new int[nums.Length];
        int pos = 0, neg = 1;
        foreach (int x in nums) {
            if (x > 0) { res[pos] = x; pos += 2; }
            else { res[neg] = x; neg += 2; }
        }
        return res;
    }
}`);
addLang("cs", "best-time-to-buy-and-sell-stock", String.raw`public class Solution {
    public int MaxProfit(int[] prices) {
        int low = int.MaxValue, best = 0;
        foreach (int p in prices) {
            low = Math.Min(low, p);
            best = Math.Max(best, p - low);
        }
        return best;
    }
}`);
addLang("cs", "maximum-average-subarray-i", String.raw`public class Solution {
    public double FindMaxAverage(int[] nums, int k) {
        int s = nums.Take(k).Sum(), best = s;
        for (int i = k; i < nums.Length; i++) {   // slide: add the new number, drop the oldest
            s += nums[i] - nums[i - k];
            best = Math.Max(best, s);
        }
        return (double)best / k;
    }
}`);
addLang("cs", "longest-substring-without-repeating-characters", String.raw`public class Solution {
    public int LengthOfLongestSubstring(string s) {
        var last = new Dictionary<char, int>();   // char -> index where it was last seen
        int l = 0, best = 0;
        for (int r = 0; r < s.Length; r++) {
            if (last.TryGetValue(s[r], out int seen) && seen >= l) l = seen + 1;
            last[s[r]] = r;
            best = Math.Max(best, r - l + 1);
        }
        return best;
    }
}`);
addLang("cs", "max-consecutive-ones-iii", String.raw`public class Solution {
    public int LongestOnes(int[] nums, int k) {
        int left = 0, zeros = 0, best = 0;
        for (int right = 0; right < nums.Length; right++) {
            if (nums[right] == 0) zeros++;
            while (zeros > k)
                if (nums[left++] == 0) zeros--;
            best = Math.Max(best, right - left + 1);
        }
        return best;
    }
}`);
addLang("cs", "longest-repeating-character-replacement", String.raw`public class Solution {
    public int CharacterReplacement(string s, int k) {
        var count = new int[26];
        int l = 0, best = 0, maxf = 0;
        for (int r = 0; r < s.Length; r++) {
            maxf = Math.Max(maxf, ++count[s[r] - 'A']);
            while ((r - l + 1) - maxf > k) count[s[l++] - 'A']--;
            best = Math.Max(best, r - l + 1);
        }
        return best;
    }
}`);
addLang("cs", "permutation-in-string", String.raw`public class Solution {
    public bool CheckInclusion(string s1, string s2) {
        int k = s1.Length;
        if (k > s2.Length) return false;
        int[] need = new int[26], window = new int[26];
        for (int i = 0; i < k; i++) {
            need[s1[i] - 'a']++;
            window[s2[i] - 'a']++;
        }
        if (need.SequenceEqual(window)) return true;
        for (int i = k; i < s2.Length; i++) {
            window[s2[i] - 'a']++;
            window[s2[i - k] - 'a']--;
            if (need.SequenceEqual(window)) return true;
        }
        return false;
    }
}`);
addLang("cs", "minimum-window-substring", String.raw`public class Solution {
    public string MinWindow(string s, string t) {
        var need = new int[128];
        foreach (char c in t) need[c]++;
        int missing = t.Length, l = 0, bestLen = int.MaxValue, bestStart = 0;
        for (int r = 0; r < s.Length; r++) {
            if (need[s[r]]-- > 0) missing--;
            while (missing == 0) {   // the window holds all of t: shrink from the left
                if (r - l + 1 < bestLen) { bestLen = r - l + 1; bestStart = l; }
                if (++need[s[l++]] > 0) missing++;
            }
        }
        return bestLen == int.MaxValue ? "" : s.Substring(bestStart, bestLen);
    }
}`);
addLang("cs", "sliding-window-maximum", String.raw`public class Solution {
    public int[] MaxSlidingWindow(int[] nums, int k) {
        var dq = new LinkedList<int>();   // indexes, values decreasing from the front
        var res = new int[nums.Length - k + 1];
        for (int i = 0; i < nums.Length; i++) {
            while (dq.Count > 0 && nums[dq.Last.Value] <= nums[i]) dq.RemoveLast();
            dq.AddLast(i);
            if (dq.First.Value <= i - k) dq.RemoveFirst();
            if (i >= k - 1) res[i - k + 1] = nums[dq.First.Value];
        }
        return res;
    }
}`);
addLang("cs", "max-consecutive-ones", String.raw`public class Solution {
    public int FindMaxConsecutiveOnes(int[] nums) {
        int best = 0, cur = 0;
        foreach (int x in nums) {
            cur = x == 1 ? cur + 1 : 0;
            best = Math.Max(best, cur);
        }
        return best;
    }
}`);
addLang("cs", "minimum-size-subarray-sum", String.raw`public class Solution {
    public int MinSubArrayLen(int target, int[] nums) {
        int left = 0, total = 0, best = int.MaxValue;
        for (int right = 0; right < nums.Length; right++) {
            total += nums[right];
            while (total >= target) {
                best = Math.Min(best, right - left + 1);
                total -= nums[left++];
            }
        }
        return best == int.MaxValue ? 0 : best;
    }
}`);
addLang("cs", "fruit-into-baskets", String.raw`public class Solution {
    public int TotalFruit(int[] fruits) {
        var count = new Dictionary<int, int>();
        int left = 0, best = 0;
        for (int right = 0; right < fruits.Length; right++) {
            count[fruits[right]] = count.GetValueOrDefault(fruits[right]) + 1;
            while (count.Count > 2) {   // more than two kinds: shrink from the left
                int f = fruits[left++];
                if (--count[f] == 0) count.Remove(f);
            }
            best = Math.Max(best, right - left + 1);
        }
        return best;
    }
}`);
addLang("cs", "contains-duplicate-ii", String.raw`public class Solution {
    public bool ContainsNearbyDuplicate(int[] nums, int k) {
        var last = new Dictionary<int, int>();
        for (int i = 0; i < nums.Length; i++) {
            if (last.TryGetValue(nums[i], out int j) && i - j <= k) return true;
            last[nums[i]] = i;
        }
        return false;
    }
}`);
addLang("cs", "find-all-anagrams-in-a-string", String.raw`public class Solution {
    public IList<int> FindAnagrams(string s, string p) {
        var res = new List<int>();
        int m = p.Length;
        int[] need = new int[26], win = new int[26];
        foreach (char c in p) need[c - 'a']++;
        for (int i = 0; i < s.Length; i++) {
            win[s[i] - 'a']++;
            if (i >= m) win[s[i - m] - 'a']--;
            if (win.SequenceEqual(need)) res.Add(i - m + 1);
        }
        return res;
    }
}`);
addLang("cs", "subarray-product-less-than-k", String.raw`public class Solution {
    public int NumSubarrayProductLessThanK(int[] nums, int k) {
        if (k <= 1) return 0;
        int prod = 1, left = 0, res = 0;
        for (int right = 0; right < nums.Length; right++) {
            prod *= nums[right];
            while (prod >= k) prod /= nums[left++];
            res += right - left + 1;   // every subarray ending at right that starts in [left, right]
        }
        return res;
    }
}`);
addLang("cs", "maximum-length-substring-with-two-occurrences", String.raw`public class Solution {
    public int MaximumLengthSubstring(string s) {
        var count = new int[26];
        int left = 0, best = 0;
        for (int right = 0; right < s.Length; right++) {
            int c = s[right] - 'a';
            count[c]++;
            while (count[c] > 2) count[s[left++] - 'a']--;
            best = Math.Max(best, right - left + 1);
        }
        return best;
    }
}`);
addLang("cs", "valid-parentheses", String.raw`public class Solution {
    public bool IsValid(string s) {
        var stack = new Stack<char>();
        foreach (char ch in s) {
            if (ch == '(') stack.Push(')');   // push the closer we expect
            else if (ch == '[') stack.Push(']');
            else if (ch == '{') stack.Push('}');
            else if (stack.Count == 0 || stack.Pop() != ch) return false;
        }
        return stack.Count == 0;
    }
}`);
addLang("cs", "min-stack", String.raw`public class MinStack {
    // each entry stores the value and the minimum of the stack up to and including it
    private readonly Stack<(int Val, int Min)> st = new();

    public void Push(int val) => st.Push((val, st.Count == 0 ? val : Math.Min(val, st.Peek().Min)));

    public void Pop() => st.Pop();

    public int Top() => st.Peek().Val;

    public int GetMin() => st.Peek().Min;
}`);

addLang("cs", "daily-temperatures", String.raw`public class Solution {
    public int[] DailyTemperatures(int[] temperatures) {
        var res = new int[temperatures.Length];
        var st = new Stack<int>();   // indexes still waiting for a warmer day
        for (int i = 0; i < temperatures.Length; i++) {
            while (st.Count > 0 && temperatures[st.Peek()] < temperatures[i]) {
                int j = st.Pop();
                res[j] = i - j;
            }
            st.Push(i);
        }
        return res;
    }
}`);
addLang("cs", "evaluate-reverse-polish-notation", String.raw`public class Solution {
    public int EvalRPN(string[] tokens) {
        var st = new Stack<int>();
        foreach (var tok in tokens) {
            if (tok is "+" or "-" or "*" or "/") {
                int b = st.Pop(), a = st.Pop();
                st.Push(tok switch { "+" => a + b, "-" => a - b, "*" => a * b, _ => a / b });   // / truncates toward zero
            } else st.Push(int.Parse(tok));
        }
        return st.Pop();
    }
}`);
addLang("cs", "car-fleet", String.raw`public class Solution {
    public int CarFleet(int target, int[] position, int[] speed) {
        var cars = position.Zip(speed).OrderByDescending(c => c.First);   // closest to the target first
        int fleets = 0;
        double last = 0;
        foreach (var (p, s) in cars) {
            double t = (double)(target - p) / s;
            if (t > last) {   // can't catch the fleet ahead: a new fleet
                fleets++;
                last = t;
            }
        }
        return fleets;
    }
}`);
addLang("cs", "largest-rectangle-in-histogram", String.raw`public class Solution {
    public int LargestRectangleArea(int[] heights) {
        var st = new Stack<(int Start, int Height)>();   // heights increasing
        int best = 0, n = heights.Length;
        for (int i = 0; i <= n; i++) {
            int h = i == n ? 0 : heights[i], start = i;
            while (st.Count > 0 && st.Peek().Height > h) {
                var top = st.Pop();
                best = Math.Max(best, top.Height * (i - top.Start));
                start = top.Start;
            }
            st.Push((start, h));
        }
        return best;
    }
}`);
addLang("cs", "next-greater-element-i", String.raw`public class Solution {
    public int[] NextGreaterElement(int[] nums1, int[] nums2) {
        var nxt = new Dictionary<int, int>();
        var stack = new Stack<int>();
        foreach (int x in nums2) {
            while (stack.Count > 0 && stack.Peek() < x) nxt[stack.Pop()] = x;
            stack.Push(x);
        }
        return nums1.Select(x => nxt.GetValueOrDefault(x, -1)).ToArray();
    }
}`);
addLang("cs", "decode-string", String.raw`public class Solution {
    public string DecodeString(string s) {
        var stack = new Stack<(StringBuilder Prev, int Times)>();
        var cur = new StringBuilder();
        int num = 0;
        foreach (char c in s) {
            if (char.IsDigit(c)) num = num * 10 + (c - '0');
            else if (c == '[') {
                stack.Push((cur, num));
                cur = new StringBuilder();
                num = 0;
            } else if (c == ']') {
                var (prev, times) = stack.Pop();
                prev.Insert(prev.Length, cur.ToString(), times);
                cur = prev;
            } else cur.Append(c);
        }
        return cur.ToString();
    }
}`);
addLang("cs", "next-greater-element-ii", String.raw`public class Solution {
    public int[] NextGreaterElements(int[] nums) {
        int n = nums.Length;
        var res = Enumerable.Repeat(-1, n).ToArray();
        var stack = new Stack<int>();
        for (int i = 0; i < 2 * n; i++) {   // go round twice to wrap around
            int x = nums[i % n];
            while (stack.Count > 0 && nums[stack.Peek()] < x) res[stack.Pop()] = x;
            if (i < n) stack.Push(i);
        }
        return res;
    }
}`);
addLang("cs", "longest-valid-parentheses", String.raw`public class Solution {
    public int LongestValidParentheses(string s) {
        var stack = new Stack<int>();
        stack.Push(-1);   // index just before the current valid run
        int best = 0;
        for (int i = 0; i < s.Length; i++) {
            if (s[i] == '(') stack.Push(i);
            else {
                stack.Pop();
                if (stack.Count == 0) stack.Push(i);
                else best = Math.Max(best, i - stack.Peek());
            }
        }
        return best;
    }
}`);
addLang("cs", "asteroid-collision", String.raw`public class Solution {
    public int[] AsteroidCollision(int[] asteroids) {
        var stack = new List<int>();
        foreach (int a in asteroids) {
            bool alive = true;
            while (alive && a < 0 && stack.Count > 0 && stack[^1] > 0) {
                if (stack[^1] < -a) { stack.RemoveAt(stack.Count - 1); continue; }
                if (stack[^1] == -a) stack.RemoveAt(stack.Count - 1);
                alive = false;
            }
            if (alive) stack.Add(a);
        }
        return stack.ToArray();
    }
}`);
addLang("cs", "basic-calculator", String.raw`public class Solution {
    public int Calculate(string s) {
        int res = 0, num = 0, sign = 1;
        var stack = new Stack<(int Res, int Sign)>();   // result and sign before each bracket
        foreach (char c in s) {
            if (char.IsDigit(c)) num = num * 10 + (c - '0');
            else if (c == '+' || c == '-') {
                res += sign * num;
                num = 0;
                sign = c == '+' ? 1 : -1;
            } else if (c == '(') {
                stack.Push((res, sign));
                res = 0;
                sign = 1;
            } else if (c == ')') {
                res += sign * num;
                num = 0;
                var prev = stack.Pop();
                res = prev.Res + prev.Sign * res;
            }
        }
        return res + sign * num;
    }
}`);
addLang("cs", "remove-all-adjacent-duplicates-in-string", String.raw`public class Solution {
    public string RemoveDuplicates(string s) {
        var stack = new StringBuilder();
        foreach (char c in s) {
            if (stack.Length > 0 && stack[^1] == c) stack.Length--;
            else stack.Append(c);
        }
        return stack.ToString();
    }
}`);
addLang("cs", "simplify-path", String.raw`public class Solution {
    public string SimplifyPath(string path) {
        var stack = new List<string>();
        foreach (var part in path.Split('/')) {
            if (part == "..") { if (stack.Count > 0) stack.RemoveAt(stack.Count - 1); }
            else if (part != "" && part != ".") stack.Add(part);
        }
        return "/" + string.Join("/", stack);
    }
}`);
addLang("cs", "online-stock-span", String.raw`public class StockSpanner {
    private readonly Stack<(int Price, int Span)> stack = new();   // prices decreasing

    public int Next(int price) {
        int span = 1;
        while (stack.Count > 0 && stack.Peek().Price <= price) span += stack.Pop().Span;
        stack.Push((price, span));
        return span;
    }
}`);
addLang("cs", "basic-calculator-ii", String.raw`public class Solution {
    public int Calculate(string s) {
        var stack = new Stack<int>();
        int num = 0;
        char op = '+';
        for (int i = 0; i < s.Length; i++) {
            char c = s[i];
            if (char.IsDigit(c)) num = num * 10 + (c - '0');
            if ("+-*/".Contains(c) || i == s.Length - 1) {
                switch (op) {   // apply the previous operator to num
                    case '+': stack.Push(num); break;
                    case '-': stack.Push(-num); break;
                    case '*': stack.Push(stack.Pop() * num); break;
                    default: stack.Push(stack.Pop() / num); break;
                }
                op = c;
                num = 0;
            }
        }
        return stack.Sum();
    }
}`);
addLang("cs", "remove-k-digits", String.raw`public class Solution {
    public string RemoveKdigits(string num, int k) {
        var stack = new StringBuilder();   // digits kept, non-decreasing
        foreach (char d in num) {
            while (k > 0 && stack.Length > 0 && stack[^1] > d) {
                stack.Length--;
                k--;
            }
            stack.Append(d);
        }
        stack.Length -= k;
        var res = stack.ToString().TrimStart('0');
        return res == "" ? "0" : res;
    }
}`);
addLang("cs", "sum-of-subarray-minimums", String.raw`public class Solution {
    public int SumSubarrayMins(int[] arr) {
        int n = arr.Length;
        const int MOD = 1_000_000_007;
        int[] left = new int[n], right = new int[n];   // how far each element is the minimum
        var stack = new Stack<int>();
        for (int i = 0; i < n; i++) {
            while (stack.Count > 0 && arr[stack.Peek()] > arr[i]) stack.Pop();
            left[i] = stack.Count == 0 ? i + 1 : i - stack.Peek();
            stack.Push(i);
        }
        stack.Clear();
        for (int i = n - 1; i >= 0; i--) {
            while (stack.Count > 0 && arr[stack.Peek()] >= arr[i]) stack.Pop();
            right[i] = stack.Count == 0 ? n - i : stack.Peek() - i;
            stack.Push(i);
        }
        long sum = 0;
        for (int i = 0; i < n; i++) sum = (sum + (long)arr[i] * left[i] * right[i]) % MOD;
        return (int)sum;
    }
}`);
addLang("cs", "stack-samples-to-trace", String.raw`public class Solution {
    // Each sample is [timestamp, [function names, outermost first]]; each event is [type, timestamp, name].
    public IList<IList<object>> SamplesToEvents(IList<IList<object>> samples) {
        var events = new List<IList<object>>();
        var prev = new List<string>();
        foreach (var sample in samples) {
            int ts = (int)sample[0];
            var stack = ((IEnumerable<object>)sample[1]).Cast<string>().ToList();
            int c = 0;   // length of the shared prefix: those calls are still running
            while (c < prev.Count && c < stack.Count && prev[c] == stack[c]) c++;
            for (int i = prev.Count - 1; i >= c; i--) events.Add(new List<object> { "E", ts, prev[i] });
            for (int i = c; i < stack.Count; i++) events.Add(new List<object> { "B", ts, stack[i] });
            prev = stack;
        }
        if (samples.Count > 0) {
            int last = (int)samples[^1][0];
            for (int i = prev.Count - 1; i >= 0; i--) events.Add(new List<object> { "E", last, prev[i] });
        }
        return events;
    }
}`);
addLang("cs", "binary-search", String.raw`public class Solution {
    public int Search(int[] nums, int target) {
        int l = 0, r = nums.Length - 1;
        while (l <= r) {
            int m = l + (r - l) / 2;
            if (nums[m] == target) return m;
            if (nums[m] < target) l = m + 1;
            else r = m - 1;
        }
        return -1;
    }
}`);
addLang("cs", "search-insert-position", String.raw`public class Solution {
    public int SearchInsert(int[] nums, int target) {
        int lo = 0, hi = nums.Length;   // first index with nums[i] >= target
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
}`);
addLang("cs", "find-first-and-last-position-of-element-in-sorted-array", String.raw`public class Solution {
    public int[] SearchRange(int[] nums, int target) {
        int first = Lower(nums, target);
        if (first == nums.Length || nums[first] != target) return new[] { -1, -1 };
        return new[] { first, Lower(nums, target + 1) - 1 };
    }

    private static int Lower(int[] nums, int x) {   // first index with nums[i] >= x
        int lo = 0, hi = nums.Length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] < x) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
}`);

addLang("cs", "find-peak-element", String.raw`public class Solution {
    public int FindPeakElement(int[] nums) {
        int lo = 0, hi = nums.Length - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] < nums[mid + 1]) lo = mid + 1;   // uphill to the right: a peak is there
            else hi = mid;
        }
        return lo;
    }
}`);
addLang("cs", "search-a-2d-matrix", String.raw`public class Solution {
    public bool SearchMatrix(int[][] matrix, int target) {
        int rows = matrix.Length, cols = matrix[0].Length;
        int l = 0, r = rows * cols - 1;   // binary search over the matrix read as one sorted list
        while (l <= r) {
            int m = l + (r - l) / 2;
            int v = matrix[m / cols][m % cols];
            if (v == target) return true;
            if (v < target) l = m + 1;
            else r = m - 1;
        }
        return false;
    }
}`);
addLang("cs", "koko-eating-bananas", String.raw`public class Solution {
    public int MinEatingSpeed(int[] piles, int h) {
        int l = 1, r = piles.Max();
        while (l < r) {
            int k = l + (r - l) / 2;
            long hours = 0;   // long: the total can pass 2^31
            foreach (int p in piles) hours += (p + k - 1) / k;   // ceil(p / k)
            if (hours <= h) r = k;
            else l = k + 1;
        }
        return l;
    }
}`);
addLang("cs", "find-minimum-in-rotated-sorted-array", String.raw`public class Solution {
    public int FindMin(int[] nums) {
        int l = 0, r = nums.Length - 1;
        while (l < r) {
            int m = l + (r - l) / 2;
            if (nums[m] > nums[r]) l = m + 1;   // the drop is to the right of m
            else r = m;
        }
        return nums[l];
    }
}`);
addLang("cs", "search-in-rotated-sorted-array", String.raw`public class Solution {
    public int Search(int[] nums, int target) {
        int l = 0, r = nums.Length - 1;
        while (l <= r) {
            int m = l + (r - l) / 2;
            if (nums[m] == target) return m;
            if (nums[l] <= nums[m]) {   // left half is sorted
                if (nums[l] <= target && target < nums[m]) r = m - 1;
                else l = m + 1;
            } else {                     // right half is sorted
                if (nums[m] < target && target <= nums[r]) l = m + 1;
                else r = m - 1;
            }
        }
        return -1;
    }
}`);
addLang("cs", "time-based-key-value-store", String.raw`public class TimeMap {
    // per key: timestamps (set in increasing order) and their values, side by side
    private readonly Dictionary<string, (List<int> Times, List<string> Vals)> map = new();

    public void Set(string key, string value, int timestamp) {
        if (!map.TryGetValue(key, out var e)) map[key] = e = (new List<int>(), new List<string>());
        e.Times.Add(timestamp);
        e.Vals.Add(value);
    }

    public string Get(string key, int timestamp) {
        if (!map.TryGetValue(key, out var e)) return "";
        int lo = 0, hi = e.Times.Count;   // first time > timestamp
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (e.Times[mid] <= timestamp) lo = mid + 1;
            else hi = mid;
        }
        return lo == 0 ? "" : e.Vals[lo - 1];
    }
}`);
addLang("cs", "median-of-two-sorted-arrays", String.raw`public class Solution {
    public double FindMedianSortedArrays(int[] nums1, int[] nums2) {
        int[] a = nums1, b = nums2;
        if (a.Length > b.Length) (a, b) = (b, a);   // binary search the shorter array
        int total = a.Length + b.Length, half = (total + 1) / 2;
        int l = 0, r = a.Length;
        while (true) {
            int i = (l + r) / 2, j = half - i;   // take i from a and j from b for the left half
            double aL = i > 0 ? a[i - 1] : double.NegativeInfinity;
            double aR = i < a.Length ? a[i] : double.PositiveInfinity;
            double bL = j > 0 ? b[j - 1] : double.NegativeInfinity;
            double bR = j < b.Length ? b[j] : double.PositiveInfinity;
            if (aL <= bR && bL <= aR)
                return total % 2 == 1 ? Math.Max(aL, bL) : (Math.Max(aL, bL) + Math.Min(aR, bR)) / 2;
            if (aL > bR) r = i - 1;
            else l = i + 1;
        }
    }
}`);
addLang("cs", "sqrtx", String.raw`public class Solution {
    public int MySqrt(int x) {
        long lo = 0, hi = x;   // long: mid * mid overflows an int
        while (lo < hi) {
            long mid = (lo + hi + 1) / 2;
            if (mid * mid <= x) lo = mid;
            else hi = mid - 1;
        }
        return (int)lo;
    }
}`);
addLang("cs", "kth-missing-positive-number", String.raw`public class Solution {
    public int FindKthPositive(int[] arr, int k) {
        int lo = 0, hi = arr.Length;   // arr[i] - (i + 1) numbers are missing before arr[i]
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (arr[mid] - (mid + 1) < k) lo = mid + 1;
            else hi = mid;
        }
        return lo + k;
    }
}`);
addLang("cs", "single-element-in-a-sorted-array", String.raw`public class Solution {
    public int SingleNonDuplicate(int[] nums) {
        int lo = 0, hi = nums.Length - 1;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (mid % 2 == 1) mid--;   // pairs start at even indexes before the single one
            if (nums[mid] == nums[mid + 1]) lo = mid + 2;
            else hi = mid;
        }
        return nums[lo];
    }
}`);
addLang("cs", "random-pick-with-weight", String.raw`public class Solution {
    private readonly int[] prefix;   // prefix[i] = w[0] + ... + w[i]
    private readonly Random rand = new();

    public Solution(int[] w) {
        prefix = new int[w.Length];
        int total = 0;
        for (int i = 0; i < w.Length; i++) prefix[i] = total += w[i];
    }

    public int PickIndex() {
        int r = rand.Next(1, prefix[^1] + 1);   // 1..total
        int i = Array.BinarySearch(prefix, r);
        return i >= 0 ? i : ~i;   // ~i = first index with a bigger prefix
    }
}`);
addLang("cs", "search-a-2d-matrix-ii", String.raw`public class Solution {
    public bool SearchMatrix(int[][] matrix, int target) {
        int r = 0, c = matrix[0].Length - 1;   // start top-right: left is smaller, down is bigger
        while (r < matrix.Length && c >= 0) {
            int v = matrix[r][c];
            if (v == target) return true;
            if (v > target) c--;
            else r++;
        }
        return false;
    }
}`);
addLang("cs", "capacity-to-ship-packages-within-d-days", String.raw`public class Solution {
    public int ShipWithinDays(int[] weights, int days) {
        int lo = weights.Max(), hi = weights.Sum();
        while (lo < hi) {   // smallest capacity that fits in the days
            int mid = lo + (hi - lo) / 2;
            if (DaysNeeded(weights, mid) <= days) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }

    private static int DaysNeeded(int[] weights, int cap) {
        int d = 1, load = 0;
        foreach (int w in weights) {
            if (load + w > cap) { d++; load = 0; }
            load += w;
        }
        return d;
    }
}`);
addLang("cs", "split-array-largest-sum", String.raw`public class Solution {
    public int SplitArray(int[] nums, int k) {
        int lo = nums.Max(), hi = nums.Sum();
        while (lo < hi) {   // smallest largest-sum that needs at most k parts
            int mid = lo + (hi - lo) / 2;
            if (Parts(nums, mid) <= k) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }

    private static int Parts(int[] nums, int limit) {
        int count = 1, cur = 0;
        foreach (int x in nums) {
            if (cur + x > limit) { count++; cur = 0; }
            cur += x;
        }
        return count;
    }
}`);
addLang("cs", "snapshot-array", String.raw`public class SnapshotArray {
    // per index: (snap id, value) pairs in increasing snap id; binary search finds the value at a snap
    private readonly List<(int Snap, int Val)>[] hist;
    private int snapId = 0;

    public SnapshotArray(int length) {
        hist = new List<(int, int)>[length];
        for (int i = 0; i < length; i++) hist[i] = new List<(int, int)> { (-1, 0) };
    }

    public void Set(int index, int val) {
        var h = hist[index];
        if (h[^1].Snap == snapId) h[^1] = (snapId, val);
        else h.Add((snapId, val));
    }

    public int Snap() => snapId++;

    public int Get(int index, int snap_id) {
        var h = hist[index];
        int lo = 0, hi = h.Count - 1;   // last entry with Snap <= snap_id
        while (lo < hi) {
            int mid = (lo + hi + 1) / 2;
            if (h[mid].Snap <= snap_id) lo = mid;
            else hi = mid - 1;
        }
        return h[lo].Val;
    }
}`);
addLang("cs", "reverse-linked-list", String.raw`public class Solution {
    public ListNode ReverseList(ListNode head) {
        ListNode prev = null;
        while (head != null) {
            var next = head.next;
            head.next = prev;
            prev = head;
            head = next;
        }
        return prev;
    }
}`);
addLang("cs", "middle-of-the-linked-list", String.raw`public class Solution {
    public ListNode MiddleNode(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }
}`);
addLang("cs", "reorder-list", String.raw`public class Solution {
    public void ReorderList(ListNode head) {
        ListNode slow = head, fast = head.next;   // 1. find the middle
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode second = slow.next, prev = null;   // 2. reverse the second half
        slow.next = null;
        while (second != null) {
            var next = second.next;
            second.next = prev;
            prev = second;
            second = next;
        }
        ListNode first = head;   // 3. weave the halves together
        second = prev;
        while (second != null) {
            ListNode f2 = first.next, s2 = second.next;
            first.next = second;
            second.next = f2;
            first = f2;
            second = s2;
        }
    }
}`);
addLang("cs", "remove-nth-node-from-end-of-list", String.raw`public class Solution {
    public ListNode RemoveNthFromEnd(ListNode head, int n) {
        var dummy = new ListNode(0, head);
        ListNode lead = dummy, trail = dummy;
        for (int i = 0; i < n; i++) lead = lead.next;   // lead runs n nodes ahead
        while (lead.next != null) {
            lead = lead.next;
            trail = trail.next;
        }
        trail.next = trail.next.next;
        return dummy.next;
    }
}`);
addLang("cs", "add-two-numbers", String.raw`public class Solution {
    public ListNode AddTwoNumbers(ListNode l1, ListNode l2) {
        var dummy = new ListNode();
        var tail = dummy;
        int carry = 0;
        while (l1 != null || l2 != null || carry != 0) {
            int s = carry + (l1?.val ?? 0) + (l2?.val ?? 0);
            carry = s / 10;
            tail.next = new ListNode(s % 10);
            tail = tail.next;
            l1 = l1?.next;
            l2 = l2?.next;
        }
        return dummy.next;
    }
}`);

addLang("cs", "palindrome-linked-list", String.raw`public class Solution {
    public bool IsPalindrome(ListNode head) {
        ListNode slow = head, fast = head;   // find the middle
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode prev = null;   // reverse the second half
        while (slow != null) {
            var next = slow.next;
            slow.next = prev;
            prev = slow;
            slow = next;
        }
        for (ListNode a = head, b = prev; b != null; a = a.next, b = b.next)
            if (a.val != b.val) return false;
        return true;
    }
}`);
addLang("cs", "find-the-duplicate-number", String.raw`public class Solution {
    public int FindDuplicate(int[] nums) {
        int slow = nums[0], fast = nums[0];   // Floyd's cycle detection on i -> nums[i]
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);
        slow = nums[0];
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }
        return slow;
    }
}`);
addLang("cs", "rotate-list", String.raw`public class Solution {
    public ListNode RotateRight(ListNode head, int k) {
        if (head == null || head.next == null) return head;
        int n = 1;
        var tail = head;
        while (tail.next != null) { tail = tail.next; n++; }
        k %= n;
        if (k == 0) return head;
        tail.next = head;   // make a ring, then cut it n - k nodes in
        var newTail = head;
        for (int i = 0; i < n - k - 1; i++) newTail = newTail.next;
        var newHead = newTail.next;
        newTail.next = null;
        return newHead;
    }
}`);
addLang("cs", "sort-list", String.raw`public class Solution {
    public ListNode SortList(ListNode head) {   // merge sort
        if (head == null || head.next == null) return head;
        ListNode slow = head, fast = head.next;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        var mid = slow.next;
        slow.next = null;
        ListNode a = SortList(head), b = SortList(mid);
        var dummy = new ListNode();
        var tail = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { tail.next = a; a = a.next; }
            else { tail.next = b; b = b.next; }
            tail = tail.next;
        }
        tail.next = a ?? b;
        return dummy.next;
    }
}`);
addLang("cs", "reverse-nodes-in-k-group", String.raw`public class Solution {
    public ListNode ReverseKGroup(ListNode head, int k) {
        var dummy = new ListNode(0, head);
        var groupPrev = dummy;
        while (true) {
            var kth = groupPrev;
            for (int i = 0; i < k; i++) {
                kth = kth.next;
                if (kth == null) return dummy.next;   // fewer than k left: done
            }
            ListNode groupNext = kth.next, prev = groupNext, cur = groupPrev.next;
            while (cur != groupNext) {   // reverse the group
                var next = cur.next;
                cur.next = prev;
                prev = cur;
                cur = next;
            }
            var first = groupPrev.next;
            groupPrev.next = kth;
            groupPrev = first;
        }
    }
}`);
addLang("cs", "remove-duplicates-from-sorted-list", String.raw`public class Solution {
    public ListNode DeleteDuplicates(ListNode head) {
        var cur = head;
        while (cur != null && cur.next != null) {
            if (cur.next.val == cur.val) cur.next = cur.next.next;
            else cur = cur.next;
        }
        return head;
    }
}`);
addLang("cs", "odd-even-linked-list", String.raw`public class Solution {
    public ListNode OddEvenList(ListNode head) {
        if (head == null) return head;
        ListNode odd = head, even = head.next, evenHead = even;
        while (even != null && even.next != null) {
            odd.next = even.next;
            odd = odd.next;
            even.next = odd.next;
            even = even.next;
        }
        odd.next = evenHead;
        return head;
    }
}`);
addLang("cs", "linked-list-cycle-ii", String.raw`public class Solution {
    public ListNode DetectCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {   // they met inside the cycle
                var p = head;
                while (p != slow) {
                    p = p.next;
                    slow = slow.next;
                }
                return p;
            }
        }
        return null;
    }
}`);
addLang("cs", "swap-nodes-in-pairs", String.raw`public class Solution {
    public ListNode SwapPairs(ListNode head) {
        var dummy = new ListNode(0, head);
        var prev = dummy;
        while (prev.next != null && prev.next.next != null) {
            ListNode a = prev.next, b = a.next;
            prev.next = b;
            a.next = b.next;
            b.next = a;
            prev = a;
        }
        return dummy.next;
    }
}`);
addLang("cs", "maximum-depth-of-binary-tree", String.raw`public class Solution {
    public int MaxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.Max(MaxDepth(root.left), MaxDepth(root.right));
    }
}`);
addLang("cs", "same-tree", String.raw`public class Solution {
    public bool IsSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) return true;
        if (p == null || q == null || p.val != q.val) return false;
        return IsSameTree(p.left, q.left) && IsSameTree(p.right, q.right);
    }
}`);
addLang("cs", "diameter-of-binary-tree", String.raw`public class Solution {
    private int best = 0;

    public int DiameterOfBinaryTree(TreeNode root) {
        Depth(root);
        return best;
    }

    private int Depth(TreeNode node) {
        if (node == null) return 0;
        int l = Depth(node.left), r = Depth(node.right);
        best = Math.Max(best, l + r);   // longest path through this node
        return 1 + Math.Max(l, r);
    }
}`);
addLang("cs", "balanced-binary-tree", String.raw`public class Solution {
    public bool IsBalanced(TreeNode root) => Height(root) != -1;

    private static int Height(TreeNode node) {   // -1 means "not balanced"
        if (node == null) return 0;
        int l = Height(node.left), r = Height(node.right);
        if (l == -1 || r == -1 || Math.Abs(l - r) > 1) return -1;
        return 1 + Math.Max(l, r);
    }
}`);
addLang("cs", "subtree-of-another-tree", String.raw`public class Solution {
    public bool IsSubtree(TreeNode root, TreeNode subRoot) {
        if (root == null) return false;
        return Same(root, subRoot) || IsSubtree(root.left, subRoot) || IsSubtree(root.right, subRoot);
    }

    private static bool Same(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null || a.val != b.val) return false;
        return Same(a.left, b.left) && Same(a.right, b.right);
    }
}`);
addLang("cs", "binary-tree-level-order-traversal", String.raw`public class Solution {
    public IList<IList<int>> LevelOrder(TreeNode root) {
        var res = new List<IList<int>>();
        var q = new Queue<TreeNode>();
        if (root != null) q.Enqueue(root);
        while (q.Count > 0) {
            var level = new List<int>();
            for (int i = q.Count; i > 0; i--) {   // exactly the nodes of this level
                var node = q.Dequeue();
                level.Add(node.val);
                if (node.left != null) q.Enqueue(node.left);
                if (node.right != null) q.Enqueue(node.right);
            }
            res.Add(level);
        }
        return res;
    }
}`);
addLang("cs", "validate-binary-search-tree", String.raw`public class Solution {
    public bool IsValidBST(TreeNode root) => Ok(root, long.MinValue, long.MaxValue);   // long: values can be int.MinValue/MaxValue

    private static bool Ok(TreeNode node, long lo, long hi) {
        if (node == null) return true;
        if (node.val <= lo || node.val >= hi) return false;
        return Ok(node.left, lo, node.val) && Ok(node.right, node.val, hi);
    }
}`);
addLang("cs", "binary-tree-right-side-view", String.raw`public class Solution {
    public IList<int> RightSideView(TreeNode root) {
        var res = new List<int>();
        var q = new Queue<TreeNode>();
        if (root != null) q.Enqueue(root);
        while (q.Count > 0) {
            for (int i = q.Count; i > 0; i--) {
                var node = q.Dequeue();
                if (i == 1) res.Add(node.val);   // the last node of each level
                if (node.left != null) q.Enqueue(node.left);
                if (node.right != null) q.Enqueue(node.right);
            }
        }
        return res;
    }
}`);
addLang("cs", "kth-smallest-element-in-a-bst", String.raw`public class Solution {
    public int KthSmallest(TreeNode root, int k) {
        var st = new Stack<TreeNode>();   // iterative in-order traversal
        var cur = root;
        while (true) {
            while (cur != null) {
                st.Push(cur);
                cur = cur.left;
            }
            cur = st.Pop();
            if (--k == 0) return cur.val;
            cur = cur.right;
        }
    }
}`);
addLang("cs", "count-good-nodes-in-binary-tree", String.raw`public class Solution {
    public int GoodNodes(TreeNode root) => Dfs(root, int.MinValue);

    private static int Dfs(TreeNode node, int mx) {   // mx = largest value on the path from the root
        if (node == null) return 0;
        int good = node.val >= mx ? 1 : 0;
        mx = Math.Max(mx, node.val);
        return good + Dfs(node.left, mx) + Dfs(node.right, mx);
    }
}`);
addLang("cs", "construct-binary-tree-from-preorder-and-inorder-traversal", String.raw`public class Solution {
    public TreeNode BuildTree(int[] preorder, int[] inorder) {
        var idx = new Dictionary<int, int>();   // value -> position in inorder
        for (int i = 0; i < inorder.Length; i++) idx[inorder[i]] = i;
        int next = 0;   // next root in preorder
        TreeNode Build(int lo, int hi) {
            if (lo > hi) return null;
            var root = new TreeNode(preorder[next++]);
            int m = idx[root.val];
            root.left = Build(lo, m - 1);
            root.right = Build(m + 1, hi);
            return root;
        }
        return Build(0, inorder.Length - 1);
    }
}`);

addLang("cs", "binary-tree-maximum-path-sum", String.raw`public class Solution {
    private int best = int.MinValue;

    public int MaxPathSum(TreeNode root) {
        Gain(root);
        return best;
    }

    private int Gain(TreeNode node) {   // best downward path starting at node
        if (node == null) return 0;
        int l = Math.Max(Gain(node.left), 0), r = Math.Max(Gain(node.right), 0);   // drop negative branches
        best = Math.Max(best, node.val + l + r);   // a path that bends at node
        return node.val + Math.Max(l, r);
    }
}`);
addLang("cs", "lowest-common-ancestor-of-a-binary-tree", String.raw`public class Solution {
    public TreeNode LowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        var left = LowestCommonAncestor(root.left, p, q);
        var right = LowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) return root;   // p and q are on different sides
        return left ?? right;
    }
}`);
addLang("cs", "binary-tree-inorder-traversal", String.raw`public class Solution {
    public IList<int> InorderTraversal(TreeNode root) {
        var res = new List<int>();
        var stack = new Stack<TreeNode>();
        var node = root;
        while (stack.Count > 0 || node != null) {
            while (node != null) {   // go as far left as possible
                stack.Push(node);
                node = node.left;
            }
            node = stack.Pop();
            res.Add(node.val);
            node = node.right;
        }
        return res;
    }
}`);
addLang("cs", "symmetric-tree", String.raw`public class Solution {
    public bool IsSymmetric(TreeNode root) => Mirror(root.left, root.right);

    private static bool Mirror(TreeNode a, TreeNode b) {
        if (a == null || b == null) return a == b;
        return a.val == b.val && Mirror(a.left, b.right) && Mirror(a.right, b.left);
    }
}`);
addLang("cs", "all-nodes-distance-k-in-binary-tree", String.raw`public class Solution {
    public IList<int> DistanceK(TreeNode root, TreeNode target, int k) {
        var parent = new Dictionary<TreeNode, TreeNode>();   // so we can walk up as well as down
        var stack = new Stack<TreeNode>(new[] { root });
        while (stack.Count > 0) {
            var node = stack.Pop();
            foreach (var child in new[] { node.left, node.right })
                if (child != null) {
                    parent[child] = node;
                    stack.Push(child);
                }
        }
        var seen = new HashSet<TreeNode> { target };
        var q = new Queue<TreeNode>(new[] { target });
        for (int d = 0; d < k; d++)   // BFS k steps out from the target
            for (int i = q.Count; i > 0; i--) {
                var node = q.Dequeue();
                foreach (var nxt in new[] { node.left, node.right, parent.GetValueOrDefault(node) })
                    if (nxt != null && seen.Add(nxt)) q.Enqueue(nxt);
            }
        return q.Select(node => node.val).ToList();
    }
}`);
addLang("cs", "convert-sorted-array-to-binary-search-tree", String.raw`public class Solution {
    public TreeNode SortedArrayToBST(int[] nums) {
        TreeNode Build(int lo, int hi) {   // the middle value becomes the root
            if (lo > hi) return null;
            int mid = (lo + hi) / 2;
            return new TreeNode(nums[mid], Build(lo, mid - 1), Build(mid + 1, hi));
        }
        return Build(0, nums.Length - 1);
    }
}`);
addLang("cs", "binary-tree-zigzag-level-order-traversal", String.raw`public class Solution {
    public IList<IList<int>> ZigzagLevelOrder(TreeNode root) {
        var res = new List<IList<int>>();
        if (root == null) return res;
        var q = new Queue<TreeNode>(new[] { root });
        while (q.Count > 0) {
            var level = new List<int>();
            for (int i = q.Count; i > 0; i--) {
                var node = q.Dequeue();
                level.Add(node.val);
                if (node.left != null) q.Enqueue(node.left);
                if (node.right != null) q.Enqueue(node.right);
            }
            if (res.Count % 2 == 1) level.Reverse();   // every other level right to left
            res.Add(level);
        }
        return res;
    }
}`);
addLang("cs", "vertical-order-traversal-of-a-binary-tree", String.raw`public class Solution {
    public IList<IList<int>> VerticalTraversal(TreeNode root) {
        var cells = new List<(int Col, int Row, int Val)>();
        void Dfs(TreeNode node, int row, int col) {
            if (node == null) return;
            cells.Add((col, row, node.val));
            Dfs(node.left, row + 1, col - 1);
            Dfs(node.right, row + 1, col + 1);
        }
        Dfs(root, 0, 0);
        cells.Sort();   // tuples sort by Col, then Row, then Val
        return cells.GroupBy(c => c.Col).Select(g => (IList<int>)g.Select(c => c.Val).ToList()).ToList();
    }
}`);
addLang("cs", "range-sum-of-bst", String.raw`public class Solution {
    public int RangeSumBST(TreeNode root, int low, int high) {
        if (root == null) return 0;
        if (root.val < low) return RangeSumBST(root.right, low, high);   // the left side is all too small
        if (root.val > high) return RangeSumBST(root.left, low, high);
        return root.val + RangeSumBST(root.left, low, high) + RangeSumBST(root.right, low, high);
    }
}`);
addLang("cs", "last-stone-weight", String.raw`public class Solution {
    public int LastStoneWeight(int[] stones) {
        var h = new PriorityQueue<int, int>();   // max-heap: the priority is the negated weight
        foreach (int s in stones) h.Enqueue(s, -s);
        while (h.Count > 1) {
            int a = h.Dequeue(), b = h.Dequeue();
            if (a != b) h.Enqueue(a - b, b - a);
        }
        return h.Count == 0 ? 0 : h.Peek();
    }
}`);
addLang("cs", "kth-largest-element-in-a-stream", String.raw`public class KthLargest {
    private readonly int k;
    private readonly PriorityQueue<int, int> h = new();   // min-heap of the k largest

    public KthLargest(int k, int[] nums) {
        this.k = k;
        foreach (int x in nums) Add(x);
    }

    public int Add(int val) {
        h.Enqueue(val, val);
        if (h.Count > k) h.Dequeue();
        return h.Peek();
    }
}`);
addLang("cs", "kth-largest-element-in-an-array", String.raw`public class Solution {
    public int FindKthLargest(int[] nums, int k) {
        var h = new PriorityQueue<int, int>();   // min-heap of the k largest so far
        foreach (int x in nums) {
            h.Enqueue(x, x);
            if (h.Count > k) h.Dequeue();
        }
        return h.Peek();
    }
}`);
addLang("cs", "k-closest-points-to-origin", String.raw`public class Solution {
    public int[][] KClosest(int[][] points, int k) {
        // max-heap by distance (negated priority): keep the k closest, drop the farthest
        var h = new PriorityQueue<int[], int>();
        foreach (var p in points) {
            h.Enqueue(p, -(p[0] * p[0] + p[1] * p[1]));
            if (h.Count > k) h.Dequeue();
        }
        return h.UnorderedItems.Select(e => e.Element).ToArray();
    }
}`);
addLang("cs", "task-scheduler", String.raw`public class Solution {
    public int LeastInterval(char[] tasks, int n) {
        var counts = new int[26];
        foreach (char t in tasks) counts[t - 'A']++;
        int mx = counts.Max(), ties = counts.Count(c => c == mx);
        // (mx - 1) full rounds of n + 1 slots, then one slot per task tied for the most
        return Math.Max(tasks.Length, (mx - 1) * (n + 1) + ties);
    }
}`);
addLang("cs", "find-median-from-data-stream", String.raw`public class MedianFinder {
    private readonly PriorityQueue<int, int> lo = new();   // smaller half, max-heap (negated priority)
    private readonly PriorityQueue<int, int> hi = new();   // larger half, min-heap

    public void AddNum(int num) {
        lo.Enqueue(num, -num);
        int top = lo.Dequeue();
        hi.Enqueue(top, top);
        if (hi.Count > lo.Count) {   // lo keeps the extra one
            int back = hi.Dequeue();
            lo.Enqueue(back, -back);
        }
    }

    public double FindMedian() {
        if (lo.Count > hi.Count) return lo.Peek();
        return (lo.Peek() + (double)hi.Peek()) / 2;
    }
}`);
addLang("cs", "meeting-rooms-ii", String.raw`public class Solution {
    public int MinMeetingRooms(int[][] intervals) {
        var ends = new PriorityQueue<int, int>();   // end times of rooms in use
        foreach (var m in intervals.OrderBy(m => m[0])) {
            if (ends.Count > 0 && ends.Peek() <= m[0]) ends.Dequeue();   // reuse the room that frees first
            ends.Enqueue(m[1], m[1]);
        }
        return ends.Count;
    }
}`);
addLang("cs", "reorganize-string", String.raw`public class Solution {
    public string ReorganizeString(string s) {
        var heap = new PriorityQueue<(int Count, char Letter), int>();   // most frequent first
        foreach (var g in s.GroupBy(c => c)) heap.Enqueue((g.Count(), g.Key), -g.Count());
        var sb = new StringBuilder();
        (int Count, char Letter)? prev = null;   // the letter just used waits one turn
        while (heap.Count > 0) {
            var cur = heap.Dequeue();
            sb.Append(cur.Letter);
            if (prev is { } p) heap.Enqueue(p, -p.Count);
            prev = cur.Count > 1 ? (cur.Count - 1, cur.Letter) : null;
        }
        return sb.Length == s.Length ? sb.ToString() : "";
    }
}`);
addLang("cs", "sort-characters-by-frequency", String.raw`public class Solution {
    public string FrequencySort(string s) {
        return string.Concat(s.GroupBy(c => c).OrderByDescending(g => g.Count()).Select(g => new string(g.Key, g.Count())));
    }
}`);
addLang("cs", "implement-trie-prefix-tree", String.raw`public class Trie {
    private class Node {
        public Node[] Next = new Node[26];
        public bool End;
    }

    private readonly Node root = new();

    public void Insert(string word) {
        var node = root;
        foreach (char ch in word) node = node.Next[ch - 'a'] ??= new Node();
        node.End = true;
    }

    public bool Search(string word) => Find(word)?.End ?? false;

    public bool StartsWith(string prefix) => Find(prefix) != null;

    private Node Find(string s) {
        var node = root;
        foreach (char ch in s) {
            node = node.Next[ch - 'a'];
            if (node == null) return null;
        }
        return node;
    }
}`);
addLang("cs", "design-add-and-search-words-data-structure", String.raw`public class WordDictionary {
    private class Node {
        public Node[] Next = new Node[26];
        public bool End;
    }

    private readonly Node root = new();

    public void AddWord(string word) {
        var node = root;
        foreach (char ch in word) node = node.Next[ch - 'a'] ??= new Node();
        node.End = true;
    }

    public bool Search(string word) => Dfs(word, 0, root);

    private static bool Dfs(string word, int i, Node node) {
        if (i == word.Length) return node.End;
        char ch = word[i];
        if (ch == '.') return node.Next.Any(child => child != null && Dfs(word, i + 1, child));   // try every child
        var next = node.Next[ch - 'a'];
        return next != null && Dfs(word, i + 1, next);
    }
}`);

addLang("cs", "word-search-ii", String.raw`public class Solution {
    private class Node {
        public Dictionary<char, Node> Next = new();
        public string Word;   // set where a word ends
    }

    private static readonly (int, int)[] Dirs = { (1, 0), (-1, 0), (0, 1), (0, -1) };

    public IList<string> FindWords(char[][] board, string[] words) {
        var root = new Node();
        foreach (var w in words) {
            var node = root;
            foreach (char ch in w) {
                if (!node.Next.TryGetValue(ch, out var child)) node.Next[ch] = child = new Node();
                node = child;
            }
            node.Word = w;
        }
        var found = new List<string>();
        void Dfs(int r, int c, Node parent) {
            char ch = board[r][c];
            var node = parent.Next[ch];
            if (node.Word != null) {   // report each word once
                found.Add(node.Word);
                node.Word = null;
            }
            board[r][c] = '#';   // mark as used on this path
            foreach (var (dr, dc) in Dirs) {
                int nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < board.Length && nc >= 0 && nc < board[0].Length && node.Next.ContainsKey(board[nr][nc]))
                    Dfs(nr, nc, node);
            }
            board[r][c] = ch;
            if (node.Next.Count == 0 && node.Word == null) parent.Next.Remove(ch);   // prune finished branches
        }
        for (int r = 0; r < board.Length; r++)
            for (int c = 0; c < board[0].Length; c++)
                if (root.Next.ContainsKey(board[r][c])) Dfs(r, c, root);
        return found;
    }
}`);
addLang("cs", "greedy-tokenizer", String.raw`public class Solution {
    private class Node {
        public Dictionary<char, Node> Next = new();
        public int Id = -1;   // token id ending here, or -1
    }

    public int[] Tokenize(string text, string[] vocab) {
        var root = new Node();
        for (int t = 0; t < vocab.Length; t++) {
            var node = root;
            foreach (char ch in vocab[t]) {
                if (!node.Next.TryGetValue(ch, out var child)) node.Next[ch] = child = new Node();
                node = child;
            }
            node.Id = t;
        }
        var res = new List<int>();
        int i = 0;
        while (i < text.Length) {   // longest token starting at i; -1 for one unknown character
            var node = root;
            int best = -1, end = i + 1;
            for (int j = i; j < text.Length && node.Next.TryGetValue(text[j], out node); j++)
                if (node.Id >= 0) { best = node.Id; end = j + 1; }
            res.Add(best);
            i = end;
        }
        return res.ToArray();
    }
}`);
addLang("cs", "subsets", String.raw`public class Solution {
    public IList<IList<int>> Subsets(int[] nums) {
        var res = new List<IList<int>>();
        var path = new List<int>();
        void Dfs(int i) {   // take nums[i] or leave it
            if (i == nums.Length) {
                res.Add(new List<int>(path));
                return;
            }
            path.Add(nums[i]);
            Dfs(i + 1);
            path.RemoveAt(path.Count - 1);
            Dfs(i + 1);
        }
        Dfs(0);
        return res;
    }
}`);
addLang("cs", "combination-sum", String.raw`public class Solution {
    public IList<IList<int>> CombinationSum(int[] candidates, int target) {
        var res = new List<IList<int>>();
        var path = new List<int>();
        void Dfs(int i, int remain) {
            if (remain == 0) {
                res.Add(new List<int>(path));
                return;
            }
            if (remain < 0 || i == candidates.Length) return;
            path.Add(candidates[i]);
            Dfs(i, remain - candidates[i]);   // use candidates[i] again
            path.RemoveAt(path.Count - 1);
            Dfs(i + 1, remain);               // or move on
        }
        Dfs(0, target);
        return res;
    }
}`);
addLang("cs", "permutations", String.raw`public class Solution {
    public IList<IList<int>> Permute(int[] nums) {
        var res = new List<IList<int>>();
        var path = new List<int>();
        var used = new bool[nums.Length];
        void Dfs() {
            if (path.Count == nums.Length) {
                res.Add(new List<int>(path));
                return;
            }
            for (int i = 0; i < nums.Length; i++) {
                if (used[i]) continue;
                used[i] = true;
                path.Add(nums[i]);
                Dfs();
                path.RemoveAt(path.Count - 1);
                used[i] = false;
            }
        }
        Dfs();
        return res;
    }
}`);
addLang("cs", "generate-parentheses", String.raw`public class Solution {
    public IList<string> GenerateParenthesis(int n) {
        var res = new List<string>();
        void Dfs(string s, int opens, int closes) {
            if (s.Length == 2 * n) {
                res.Add(s);
                return;
            }
            if (opens < n) Dfs(s + "(", opens + 1, closes);
            if (closes < opens) Dfs(s + ")", opens, closes + 1);   // only close what's open
        }
        Dfs("", 0, 0);
        return res;
    }
}`);
addLang("cs", "word-search", String.raw`public class Solution {
    public bool Exist(char[][] board, string word) {
        bool Dfs(int r, int c, int i) {
            if (i == word.Length) return true;
            if (r < 0 || r >= board.Length || c < 0 || c >= board[0].Length || board[r][c] != word[i]) return false;
            char tmp = board[r][c];
            board[r][c] = '#';   // don't reuse this cell on the current path
            bool ok = Dfs(r + 1, c, i + 1) || Dfs(r - 1, c, i + 1) || Dfs(r, c + 1, i + 1) || Dfs(r, c - 1, i + 1);
            board[r][c] = tmp;
            return ok;
        }
        for (int r = 0; r < board.Length; r++)
            for (int c = 0; c < board[0].Length; c++)
                if (Dfs(r, c, 0)) return true;
        return false;
    }
}`);
addLang("cs", "letter-combinations-of-a-phone-number", String.raw`public class Solution {
    private static readonly string[] Keys = { "", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz" };

    public IList<string> LetterCombinations(string digits) {
        var res = new List<string>();
        if (digits.Length == 0) return res;
        void Dfs(int i, string cur) {
            if (i == digits.Length) {
                res.Add(cur);
                return;
            }
            foreach (char ch in Keys[digits[i] - '0']) Dfs(i + 1, cur + ch);
        }
        Dfs(0, "");
        return res;
    }
}`);
addLang("cs", "palindrome-partitioning", String.raw`public class Solution {
    public IList<IList<string>> Partition(string s) {
        var res = new List<IList<string>>();
        var path = new List<string>();
        bool IsPal(int lo, int hi) {
            while (lo < hi) if (s[lo++] != s[hi--]) return false;
            return true;
        }
        void Dfs(int start) {
            if (start == s.Length) {
                res.Add(new List<string>(path));
                return;
            }
            for (int end = start + 1; end <= s.Length; end++)
                if (IsPal(start, end - 1)) {   // only cut off palindromes
                    path.Add(s[start..end]);
                    Dfs(end);
                    path.RemoveAt(path.Count - 1);
                }
        }
        Dfs(0);
        return res;
    }
}`);
addLang("cs", "n-queens", String.raw`public class Solution {
    public IList<IList<string>> SolveNQueens(int n) {
        var res = new List<IList<string>>();
        var cols = new HashSet<int>();
        var d1 = new HashSet<int>();
        var d2 = new HashSet<int>();
        var board = new List<int>();   // board[r] = column of the queen in row r
        void Dfs(int r) {
            if (r == n) {
                res.Add(board.Select(c => new string('.', c) + "Q" + new string('.', n - c - 1)).ToList());
                return;
            }
            for (int c = 0; c < n; c++) {
                if (cols.Contains(c) || d1.Contains(r - c) || d2.Contains(r + c)) continue;   // attacked
                cols.Add(c); d1.Add(r - c); d2.Add(r + c); board.Add(c);
                Dfs(r + 1);
                cols.Remove(c); d1.Remove(r - c); d2.Remove(r + c); board.RemoveAt(board.Count - 1);
            }
        }
        Dfs(0);
        return res;
    }
}`);
addLang("cs", "subsets-ii", String.raw`public class Solution {
    public IList<IList<int>> SubsetsWithDup(int[] nums) {
        Array.Sort(nums);   // duplicates side by side
        var res = new List<IList<int>>();
        var path = new List<int>();
        void Go(int start) {
            res.Add(new List<int>(path));
            for (int i = start; i < nums.Length; i++) {
                if (i > start && nums[i] == nums[i - 1]) continue;   // same value at the same depth: skip
                path.Add(nums[i]);
                Go(i + 1);
                path.RemoveAt(path.Count - 1);
            }
        }
        Go(0);
        return res;
    }
}`);
addLang("cs", "combinations", String.raw`public class Solution {
    public IList<IList<int>> Combine(int n, int k) {
        var res = new List<IList<int>>();
        var path = new List<int>();
        void Go(int start) {
            if (path.Count == k) {
                res.Add(new List<int>(path));
                return;
            }
            for (int x = start; x <= n; x++) {
                path.Add(x);
                Go(x + 1);
                path.RemoveAt(path.Count - 1);
            }
        }
        Go(1);
        return res;
    }
}`);
addLang("cs", "find-if-path-exists-in-graph", String.raw`public class Solution {
    public bool ValidPath(int n, int[][] edges, int source, int destination) {
        var g = new List<int>[n];
        for (int i = 0; i < n; i++) g[i] = new List<int>();
        foreach (var e in edges) {
            g[e[0]].Add(e[1]);
            g[e[1]].Add(e[0]);
        }
        var seen = new bool[n];
        var q = new Queue<int>();
        q.Enqueue(source);
        seen[source] = true;
        while (q.Count > 0) {   // BFS from the source
            int u = q.Dequeue();
            if (u == destination) return true;
            foreach (int v in g[u])
                if (!seen[v]) {
                    seen[v] = true;
                    q.Enqueue(v);
                }
        }
        return false;
    }
}`);
addLang("cs", "number-of-islands", String.raw`public class Solution {
    public int NumIslands(char[][] grid) {
        void Sink(int r, int c) {
            if (r < 0 || r >= grid.Length || c < 0 || c >= grid[0].Length || grid[r][c] != '1') return;
            grid[r][c] = '0';
            Sink(r + 1, c); Sink(r - 1, c); Sink(r, c + 1); Sink(r, c - 1);
        }
        int count = 0;
        for (int r = 0; r < grid.Length; r++)
            for (int c = 0; c < grid[0].Length; c++)
                if (grid[r][c] == '1') {
                    Sink(r, c);   // erase the whole island so it's counted once
                    count++;
                }
        return count;
    }
}`);
addLang("cs", "max-area-of-island", String.raw`public class Solution {
    public int MaxAreaOfIsland(int[][] grid) {
        int Area(int r, int c) {
            if (r < 0 || r >= grid.Length || c < 0 || c >= grid[0].Length || grid[r][c] != 1) return 0;
            grid[r][c] = 0;   // visited
            return 1 + Area(r + 1, c) + Area(r - 1, c) + Area(r, c + 1) + Area(r, c - 1);
        }
        int best = 0;
        for (int r = 0; r < grid.Length; r++)
            for (int c = 0; c < grid[0].Length; c++)
                best = Math.Max(best, Area(r, c));
        return best;
    }
}`);
addLang("cs", "course-schedule", String.raw`public class Solution {
    public bool CanFinish(int numCourses, int[][] prerequisites) {
        var g = new List<int>[numCourses];
        for (int i = 0; i < numCourses; i++) g[i] = new List<int>();
        var indeg = new int[numCourses];
        foreach (var p in prerequisites) {
            g[p[1]].Add(p[0]);
            indeg[p[0]]++;
        }
        var q = new Queue<int>(Enumerable.Range(0, numCourses).Where(i => indeg[i] == 0));   // Kahn's algorithm
        int done = 0;
        while (q.Count > 0) {
            int u = q.Dequeue();
            done++;
            foreach (int v in g[u])
                if (--indeg[v] == 0) q.Enqueue(v);
        }
        return done == numCourses;
    }
}`);
addLang("cs", "rotting-oranges", String.raw`public class Solution {
    public int OrangesRotting(int[][] grid) {
        int R = grid.Length, C = grid[0].Length, fresh = 0;
        var q = new Queue<(int, int)>();
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++) {
                if (grid[r][c] == 2) q.Enqueue((r, c));
                else if (grid[r][c] == 1) fresh++;
            }
        int minutes = 0;
        var dirs = new[] { (1, 0), (-1, 0), (0, 1), (0, -1) };
        while (q.Count > 0 && fresh > 0) {   // multi-source BFS, one ring per minute
            for (int i = q.Count; i > 0; i--) {
                var (r, c) = q.Dequeue();
                foreach (var (dr, dc) in dirs) {
                    int nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] == 1) {
                        grid[nr][nc] = 2;
                        fresh--;
                        q.Enqueue((nr, nc));
                    }
                }
            }
            minutes++;
        }
        return fresh == 0 ? minutes : -1;
    }
}`);
addLang("cs", "course-schedule-ii", String.raw`public class Solution {
    public int[] FindOrder(int numCourses, int[][] prerequisites) {
        var g = new List<int>[numCourses];
        for (int i = 0; i < numCourses; i++) g[i] = new List<int>();
        var indeg = new int[numCourses];
        foreach (var p in prerequisites) {
            g[p[1]].Add(p[0]);
            indeg[p[0]]++;
        }
        var q = new Queue<int>(Enumerable.Range(0, numCourses).Where(i => indeg[i] == 0));
        var order = new List<int>();
        while (q.Count > 0) {
            int u = q.Dequeue();
            order.Add(u);
            foreach (int v in g[u])
                if (--indeg[v] == 0) q.Enqueue(v);
        }
        return order.Count == numCourses ? order.ToArray() : Array.Empty<int>();   // a cycle leaves courses untaken
    }
}`);
addLang("cs", "pacific-atlantic-water-flow", String.raw`public class Solution {
    public IList<IList<int>> PacificAtlantic(int[][] heights) {
        int R = heights.Length, C = heights[0].Length;
        var pac = new bool[R, C];
        var atl = new bool[R, C];
        void Reach(bool[,] seen, int r, int c) {   // walk uphill from the ocean
            if (seen[r, c]) return;
            seen[r, c] = true;
            foreach (var (dr, dc) in new[] { (1, 0), (-1, 0), (0, 1), (0, -1) }) {
                int nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < R && nc >= 0 && nc < C && heights[nr][nc] >= heights[r][c]) Reach(seen, nr, nc);
            }
        }
        for (int c = 0; c < C; c++) { Reach(pac, 0, c); Reach(atl, R - 1, c); }
        for (int r = 0; r < R; r++) { Reach(pac, r, 0); Reach(atl, r, C - 1); }
        var res = new List<IList<int>>();
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++)
                if (pac[r, c] && atl[r, c]) res.Add(new List<int> { r, c });
        return res;
    }
}`);
addLang("cs", "surrounded-regions", String.raw`public class Solution {
    public void Solve(char[][] board) {
        int R = board.Length, C = board[0].Length;
        void Mark(int r, int c) {
            if (r < 0 || r >= R || c < 0 || c >= C || board[r][c] != 'O') return;
            board[r][c] = 'S';
            Mark(r + 1, c); Mark(r - 1, c); Mark(r, c + 1); Mark(r, c - 1);
        }
        for (int r = 0; r < R; r++) { Mark(r, 0); Mark(r, C - 1); }   // O's reachable from the edge survive
        for (int c = 0; c < C; c++) { Mark(0, c); Mark(R - 1, c); }
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++)
                board[r][c] = board[r][c] == 'S' ? 'O' : 'X';
    }
}`);

addLang("cs", "redundant-connection", String.raw`public class Solution {
    public int[] FindRedundantConnection(int[][] edges) {
        var parent = Enumerable.Range(0, edges.Length + 1).ToArray();
        int Find(int x) {   // union-find with path halving
            while (parent[x] != x) {
                parent[x] = parent[parent[x]];
                x = parent[x];
            }
            return x;
        }
        foreach (var e in edges) {
            int ra = Find(e[0]), rb = Find(e[1]);
            if (ra == rb) return e;   // already connected: this edge closes a cycle
            parent[ra] = rb;
        }
        return Array.Empty<int>();
    }
}`);
addLang("cs", "network-delay-time", String.raw`public class Solution {
    public int NetworkDelayTime(int[][] times, int n, int k) {
        var g = new Dictionary<int, List<(int To, int W)>>();
        foreach (var t in times) {
            if (!g.TryGetValue(t[0], out var list)) g[t[0]] = list = new List<(int, int)>();
            list.Add((t[1], t[2]));
        }
        var dist = new Dictionary<int, int>();
        var heap = new PriorityQueue<int, int>();   // node, by distance
        heap.Enqueue(k, 0);
        while (heap.TryDequeue(out int u, out int d)) {   // Dijkstra
            if (dist.ContainsKey(u)) continue;
            dist[u] = d;
            if (g.TryGetValue(u, out var edges))
                foreach (var (v, w) in edges)
                    if (!dist.ContainsKey(v)) heap.Enqueue(v, d + w);
        }
        return dist.Count < n ? -1 : dist.Values.Max();
    }
}`);
addLang("cs", "cheapest-flights-within-k-stops", String.raw`public class Solution {
    public int FindCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
        const int INF = int.MaxValue;
        var prices = Enumerable.Repeat(INF, n).ToArray();
        prices[src] = 0;
        for (int i = 0; i <= k; i++) {   // Bellman-Ford, one more flight per round
            var next = (int[])prices.Clone();
            foreach (var f in flights)
                if (prices[f[0]] != INF && prices[f[0]] + f[2] < next[f[1]]) next[f[1]] = prices[f[0]] + f[2];
            prices = next;
        }
        return prices[dst] == INF ? -1 : prices[dst];
    }
}`);
addLang("cs", "word-ladder", String.raw`public class Solution {
    public int LadderLength(string beginWord, string endWord, IList<string> wordList) {
        var words = new HashSet<string>(wordList);
        if (!words.Contains(endWord)) return 0;
        var q = new Queue<string>(new[] { beginWord });
        var seen = new HashSet<string> { beginWord };
        for (int steps = 1; q.Count > 0; steps++) {   // BFS: each step changes one letter
            for (int i = q.Count; i > 0; i--) {
                var w = q.Dequeue();
                if (w == endWord) return steps;
                var cs = w.ToCharArray();
                for (int p = 0; p < cs.Length; p++) {
                    char orig = cs[p];
                    for (char ch = 'a'; ch <= 'z'; ch++) {
                        cs[p] = ch;
                        var next = new string(cs);
                        if (words.Contains(next) && seen.Add(next)) q.Enqueue(next);
                    }
                    cs[p] = orig;
                }
            }
        }
        return 0;
    }
}`);
addLang("cs", "number-of-provinces", String.raw`public class Solution {
    public int FindCircleNum(int[][] isConnected) {
        int n = isConnected.Length, count = 0;
        var seen = new bool[n];
        void Dfs(int i) {
            for (int j = 0; j < n; j++)
                if (isConnected[i][j] == 1 && !seen[j]) {
                    seen[j] = true;
                    Dfs(j);
                }
        }
        for (int i = 0; i < n; i++)
            if (!seen[i]) {
                seen[i] = true;
                Dfs(i);
                count++;
            }
        return count;
    }
}`);
addLang("cs", "shortest-path-in-binary-matrix", String.raw`public class Solution {
    public int ShortestPathBinaryMatrix(int[][] grid) {
        int n = grid.Length;
        if (grid[0][0] == 1 || grid[n - 1][n - 1] == 1) return -1;
        var q = new Queue<(int R, int C, int D)>();
        q.Enqueue((0, 0, 1));
        grid[0][0] = 1;   // mark visited
        while (q.Count > 0) {
            var (r, c, d) = q.Dequeue();
            if (r == n - 1 && c == n - 1) return d;
            for (int dr = -1; dr <= 1; dr++)
                for (int dc = -1; dc <= 1; dc++) {   // 8 directions
                    int nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] == 0) {
                        grid[nr][nc] = 1;
                        q.Enqueue((nr, nc, d + 1));
                    }
                }
        }
        return -1;
    }
}`);
addLang("cs", "swim-in-rising-water", String.raw`public class Solution {
    public int SwimInWater(int[][] grid) {
        int n = grid.Length;
        var seen = new bool[n, n];
        var heap = new PriorityQueue<(int R, int C, int T), int>();   // by time
        heap.Enqueue((0, 0, grid[0][0]), grid[0][0]);
        seen[0, 0] = true;
        var dirs = new[] { (1, 0), (-1, 0), (0, 1), (0, -1) };
        while (true) {   // always expand the cell with the lowest water level needed
            var (r, c, t) = heap.Dequeue();
            if (r == n - 1 && c == n - 1) return t;
            foreach (var (dr, dc) in dirs) {
                int nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && !seen[nr, nc]) {
                    seen[nr, nc] = true;
                    int nt = Math.Max(t, grid[nr][nc]);
                    heap.Enqueue((nr, nc, nt), nt);
                }
            }
        }
    }
}`);
addLang("cs", "crawler-fake-web", String.raw`public class Solution {
    // web maps a URL to the URLs its page links to; stay on the start URL's host.
    public IList<string> Crawl(string startUrl, IDictionary<string, IList<string>> web) {
        string Host(string url) => url.Split('/')[2];   // "http://host/path" -> "host"
        string host = Host(startUrl);
        var seen = new HashSet<string> { startUrl };
        var q = new Queue<string>(new[] { startUrl });
        while (q.Count > 0) {
            var url = q.Dequeue();
            if (!web.TryGetValue(url, out var links)) continue;
            foreach (var next in links)
                if (Host(next) == host && seen.Add(next)) q.Enqueue(next);
        }
        return seen.ToList();
    }
}`);
addLang("cs", "maximum-subarray", String.raw`public class Solution {
    public int MaxSubArray(int[] nums) {
        int cur = nums[0], best = nums[0];   // Kadane: best sum ending here
        for (int i = 1; i < nums.Length; i++) {
            cur = Math.Max(nums[i], cur + nums[i]);
            best = Math.Max(best, cur);
        }
        return best;
    }
}`);
addLang("cs", "jump-game", String.raw`public class Solution {
    public bool CanJump(int[] nums) {
        int far = 0;   // furthest index reachable so far
        for (int i = 0; i < nums.Length; i++) {
            if (i > far) return false;
            far = Math.Max(far, i + nums[i]);
        }
        return true;
    }
}`);
addLang("cs", "merge-intervals", String.raw`public class Solution {
    public int[][] Merge(int[][] intervals) {
        var output = new List<int[]>();
        foreach (var iv in intervals.OrderBy(iv => iv[0])) {
            if (output.Count > 0 && iv[0] <= output[^1][1])
                output[^1][1] = Math.Max(output[^1][1], iv[1]);   // overlaps: extend
            else output.Add(new[] { iv[0], iv[1] });
        }
        return output.ToArray();
    }
}`);
addLang("cs", "insert-interval", String.raw`public class Solution {
    public int[][] Insert(int[][] intervals, int[] newInterval) {
        var res = new List<int[]>();
        int i = 0, n = intervals.Length;
        int lo = newInterval[0], hi = newInterval[1];
        while (i < n && intervals[i][1] < lo) res.Add(intervals[i++]);   // entirely before
        while (i < n && intervals[i][0] <= hi) {                         // overlapping: merge
            lo = Math.Min(lo, intervals[i][0]);
            hi = Math.Max(hi, intervals[i][1]);
            i++;
        }
        res.Add(new[] { lo, hi });
        while (i < n) res.Add(intervals[i++]);                           // entirely after
        return res.ToArray();
    }
}`);
addLang("cs", "non-overlapping-intervals", String.raw`public class Solution {
    public int EraseOverlapIntervals(int[][] intervals) {
        long end = long.MinValue;
        int removed = 0;
        foreach (var iv in intervals.OrderBy(iv => iv[1])) {   // earliest end first
            if (iv[0] >= end) end = iv[1];
            else removed++;
        }
        return removed;
    }
}`);
addLang("cs", "jump-game-ii", String.raw`public class Solution {
    public int Jump(int[] nums) {
        int jumps = 0, curEnd = 0, far = 0;
        for (int i = 0; i < nums.Length - 1; i++) {
            far = Math.Max(far, i + nums[i]);
            if (i == curEnd) {   // end of this jump's reach: jump again
                jumps++;
                curEnd = far;
            }
        }
        return jumps;
    }
}`);
addLang("cs", "gas-station", String.raw`public class Solution {
    public int CanCompleteCircuit(int[] gas, int[] cost) {
        int total = 0, tank = 0, start = 0;
        for (int i = 0; i < gas.Length; i++) {
            total += gas[i] - cost[i];
            tank += gas[i] - cost[i];
            if (tank < 0) {   // can't reach i + 1 from start: start after i instead
                tank = 0;
                start = i + 1;
            }
        }
        return total < 0 ? -1 : start;
    }
}`);
addLang("cs", "partition-labels", String.raw`public class Solution {
    public IList<int> PartitionLabels(string s) {
        var last = new int[26];
        for (int i = 0; i < s.Length; i++) last[s[i] - 'a'] = i;
        var res = new List<int>();
        int start = 0, end = 0;
        for (int i = 0; i < s.Length; i++) {
            end = Math.Max(end, last[s[i] - 'a']);
            if (i == end) {   // every letter so far ends by here
                res.Add(end - start + 1);
                start = i + 1;
            }
        }
        return res;
    }
}`);
addLang("cs", "best-time-to-buy-and-sell-stock-ii", String.raw`public class Solution {
    public int MaxProfit(int[] prices) {
        int profit = 0;
        for (int i = 1; i < prices.Length; i++) profit += Math.Max(0, prices[i] - prices[i - 1]);   // take every rise
        return profit;
    }
}`);
addLang("cs", "largest-number", String.raw`public class Solution {
    public string LargestNumber(int[] nums) {
        var strs = nums.Select(x => x.ToString()).ToList();
        strs.Sort((a, b) => string.CompareOrdinal(b + a, a + b));   // a before b if "ab" > "ba"
        return strs[0] == "0" ? "0" : string.Concat(strs);
    }
}`);
addLang("cs", "valid-parenthesis-string", String.raw`public class Solution {
    public bool CheckValidString(string s) {
        int lo = 0, hi = 0;   // range of possible open-bracket counts
        foreach (char c in s) {
            if (c == '(') { lo++; hi++; }
            else if (c == ')') { lo--; hi--; }
            else { lo--; hi++; }   // '*' could be ')', '' or '('
            if (hi < 0) return false;
            lo = Math.Max(lo, 0);
        }
        return lo == 0;
    }
}`);
addLang("cs", "can-place-flowers", String.raw`public class Solution {
    public bool CanPlaceFlowers(int[] flowerbed, int n) {
        var bed = flowerbed;
        for (int i = 0; i < bed.Length; i++)
            if (bed[i] == 0 && (i == 0 || bed[i - 1] == 0) && (i == bed.Length - 1 || bed[i + 1] == 0)) {
                bed[i] = 1;   // plant greedily
                n--;
            }
        return n <= 0;
    }
}`);

addLang("cs", "assign-cookies", String.raw`public class Solution {
    public int FindContentChildren(int[] g, int[] s) {
        Array.Sort(g);
        Array.Sort(s);
        int child = 0;
        foreach (int cookie in s)   // smallest cookie that satisfies the least greedy child left
            if (child < g.Length && cookie >= g[child]) child++;
        return child;
    }
}`);
addLang("cs", "maximum-sum-circular-subarray", String.raw`public class Solution {
    public int MaxSubarraySumCircular(int[] nums) {
        int total = 0, curMax = 0, curMin = 0, bestMax = nums[0], bestMin = nums[0];
        foreach (int x in nums) {   // Kadane for the best and the worst subarray at once
            curMax = Math.Max(x, curMax + x);
            bestMax = Math.Max(bestMax, curMax);
            curMin = Math.Min(x, curMin + x);
            bestMin = Math.Min(bestMin, curMin);
            total += x;
        }
        // wrapping around = everything minus the worst middle part (unless everything is negative)
        return bestMax < 0 ? bestMax : Math.Max(bestMax, total - bestMin);
    }
}`);
addLang("cs", "maximize-active-section-with-trade-i", String.raw`public class Solution {
    public int MaxActiveSectionsAfterTrade(string s) {
        int ones = s.Count(c => c == '1');
        var zeros = new List<int>();   // lengths of the runs of '0'
        for (int i = 0; i < s.Length; ) {
            if (s[i] == '1') { i++; continue; }
            int j = i;
            while (j < s.Length && s[j] == '0') j++;
            zeros.Add(j - i);
            i = j;
        }
        int best = 0;   // the trade turns two zero runs around a block of ones into ones
        for (int k = 0; k + 1 < zeros.Count; k++) best = Math.Max(best, zeros[k] + zeros[k + 1]);
        return ones + best;
    }
}`);
addLang("cs", "find-the-lexicographically-smallest-valid-sequence", String.raw`public class Solution {
    public int[] ValidSequence(string word1, string word2) {
        int n = word1.Length, m = word2.Length;
        var suf = new int[n + 1];   // suf[i] = start of the longest suffix of word2 matchable from word1[i..]
        suf[n] = m;
        for (int i = n - 1, k = m; i >= 0; i--) {
            if (k > 0 && word1[i] == word2[k - 1]) k--;
            suf[i] = k;
        }
        var res = new List<int>();
        int j = 0;
        bool used = false;   // at most one mismatch allowed
        for (int i = 0; i < n && j < m; i++) {
            if (word1[i] == word2[j]) { res.Add(i); j++; }
            else if (!used && suf[i + 1] <= j + 1) { res.Add(i); j++; used = true; }
        }
        return j == m ? res.ToArray() : Array.Empty<int>();
    }
}`);
addLang("cs", "single-number", String.raw`public class Solution {
    public int SingleNumber(int[] nums) {
        int x = 0;
        foreach (int n in nums) x ^= n;   // pairs cancel out
        return x;
    }
}`);
addLang("cs", "plus-one", String.raw`public class Solution {
    public int[] PlusOne(int[] digits) {
        for (int i = digits.Length - 1; i >= 0; i--) {
            if (digits[i] < 9) {
                digits[i]++;
                return digits;
            }
            digits[i] = 0;   // 9 rolls over; carry on to the left
        }
        var res = new int[digits.Length + 1];   // all nines: 1 followed by zeros
        res[0] = 1;
        return res;
    }
}`);
addLang("cs", "palindrome-number", String.raw`public class Solution {
    public bool IsPalindrome(int x) {
        if (x < 0 || (x % 10 == 0 && x != 0)) return false;
        int rev = 0;
        while (x > rev) {   // reverse only the second half
            rev = rev * 10 + x % 10;
            x /= 10;
        }
        return x == rev || x == rev / 10;   // odd digit count: the middle digit sits at the end of rev
    }
}`);
addLang("cs", "roman-to-integer", String.raw`public class Solution {
    public int RomanToInt(string s) {
        var val = new Dictionary<char, int> { ['I'] = 1, ['V'] = 5, ['X'] = 10, ['L'] = 50, ['C'] = 100, ['D'] = 500, ['M'] = 1000 };
        int total = 0;
        for (int i = 0; i < s.Length; i++) {
            if (i + 1 < s.Length && val[s[i]] < val[s[i + 1]]) total -= val[s[i]];   // IV, IX, XL...
            else total += val[s[i]];
        }
        return total;
    }
}`);
addLang("cs", "number-of-1-bits", String.raw`public class Solution {
    public int HammingWeight(int n) {
        int count = 0;
        while (n != 0) {
            n &= n - 1;   // clears the lowest set bit
            count++;
        }
        return count;
    }
}`);
addLang("cs", "counting-bits", String.raw`public class Solution {
    public int[] CountBits(int n) {
        var dp = new int[n + 1];
        for (int i = 1; i <= n; i++) dp[i] = dp[i >> 1] + (i & 1);   // i's bits = (i / 2)'s bits + last bit
        return dp;
    }
}`);
addLang("cs", "missing-number", String.raw`public class Solution {
    public int MissingNumber(int[] nums) {
        int n = nums.Length;
        return n * (n + 1) / 2 - nums.Sum();
    }
}`);
addLang("cs", "happy-number", String.raw`public class Solution {
    public bool IsHappy(int n) {
        var seen = new HashSet<int>();
        while (n != 1 && seen.Add(n)) {   // stop at 1, or when a number repeats (a loop)
            int next = 0;
            for (; n > 0; n /= 10) next += (n % 10) * (n % 10);
            n = next;
        }
        return n == 1;
    }
}`);
addLang("cs", "rotate-image", String.raw`public class Solution {
    public void Rotate(int[][] matrix) {
        Array.Reverse(matrix);   // flip upside down...
        int n = matrix.Length;
        for (int i = 0; i < n; i++)   // ...then transpose
            for (int j = 0; j < i; j++)
                (matrix[i][j], matrix[j][i]) = (matrix[j][i], matrix[i][j]);
    }
}`);
addLang("cs", "spiral-matrix", String.raw`public class Solution {
    public IList<int> SpiralOrder(int[][] matrix) {
        var res = new List<int>();
        int top = 0, bottom = matrix.Length - 1, left = 0, right = matrix[0].Length - 1;
        while (top <= bottom && left <= right) {   // peel one ring at a time
            for (int c = left; c <= right; c++) res.Add(matrix[top][c]);
            for (int r = top + 1; r <= bottom; r++) res.Add(matrix[r][right]);
            if (top < bottom) for (int c = right - 1; c >= left; c--) res.Add(matrix[bottom][c]);
            if (left < right) for (int r = bottom - 1; r > top; r--) res.Add(matrix[r][left]);
            top++; bottom--; left++; right--;
        }
        return res;
    }
}`);
addLang("cs", "set-matrix-zeroes", String.raw`public class Solution {
    public void SetZeroes(int[][] matrix) {
        int R = matrix.Length, C = matrix[0].Length;
        var rows = new bool[R];
        var cols = new bool[C];
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++)
                if (matrix[r][c] == 0) { rows[r] = true; cols[c] = true; }
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++)
                if (rows[r] || cols[c]) matrix[r][c] = 0;
    }
}`);
addLang("cs", "powx-n", String.raw`public class Solution {
    public double MyPow(double x, int n) {
        long e = n;   // long: -int.MinValue doesn't fit in an int
        if (e < 0) { x = 1 / x; e = -e; }
        double res = 1;
        while (e > 0) {   // fast power: square x, halve e
            if ((e & 1) == 1) res *= x;
            x *= x;
            e >>= 1;
        }
        return res;
    }
}`);
addLang("cs", "reverse-integer", String.raw`public class Solution {
    public int Reverse(int x) {
        long rev = 0;   // long: the reversed number can overflow an int
        while (x != 0) {
            rev = rev * 10 + x % 10;   // C#'s % keeps the sign, so negatives just work
            x /= 10;
        }
        return rev < int.MinValue || rev > int.MaxValue ? 0 : (int)rev;
    }
}`);
addLang("cs", "power-of-two", String.raw`public class Solution {
    public bool IsPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;   // exactly one bit set
    }
}`);
addLang("cs", "integer-to-roman", String.raw`public class Solution {
    public string IntToRoman(int num) {
        int[] vals = { 1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1 };
        string[] syms = { "M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I" };
        var sb = new StringBuilder();
        for (int i = 0; i < vals.Length; i++)   // greedy: largest symbol first
            while (num >= vals[i]) {
                sb.Append(syms[i]);
                num -= vals[i];
            }
        return sb.ToString();
    }
}`);
addLang("cs", "add-binary", String.raw`public class Solution {
    public string AddBinary(string a, string b) {
        var sb = new StringBuilder();
        int i = a.Length - 1, j = b.Length - 1, carry = 0;
        while (i >= 0 || j >= 0 || carry > 0) {
            int total = carry;
            if (i >= 0) total += a[i--] - '0';
            if (j >= 0) total += b[j--] - '0';
            sb.Insert(0, total % 2);
            carry = total / 2;
        }
        return sb.ToString();
    }
}`);

addLang("cs", "angle-between-hands-of-a-clock", String.raw`public class Solution {
    public double AngleClock(int hour, int minutes) {
        // the hour hand moves 30 degrees an hour plus 0.5 a minute; the minute hand 6 a minute
        double diff = Math.Abs((hour % 12) * 30 + minutes * 0.5 - minutes * 6);
        return Math.Min(diff, 360 - diff);
    }
}`);
addLang("cs", "divide-two-integers", String.raw`public class Solution {
    public int Divide(int dividend, int divisor) {
        if (dividend == int.MinValue && divisor == -1) return int.MaxValue;   // the only overflow
        bool neg = (dividend < 0) != (divisor < 0);
        long a = Math.Abs((long)dividend), b = Math.Abs((long)divisor);   // long: |MinValue| needs it
        int q = 0;
        while (a >= b) {   // subtract the biggest doubled chunk of b that fits
            long chunk = b;
            int times = 1;
            while (a >= chunk << 1) {
                chunk <<= 1;
                times <<= 1;
            }
            a -= chunk;
            q += times;
        }
        return neg ? -q : q;
    }
}`);
addLang("cs", "string-to-integer-atoi", String.raw`public class Solution {
    public int MyAtoi(string s) {
        int i = 0, n = s.Length;
        while (i < n && s[i] == ' ') i++;
        int sign = 1;
        if (i < n && (s[i] == '+' || s[i] == '-')) sign = s[i++] == '-' ? -1 : 1;
        long num = 0;
        while (i < n && char.IsDigit(s[i])) {
            num = num * 10 + (s[i++] - '0');
            if (num > int.MaxValue) break;   // already out of range: stop before long overflows too
        }
        return (int)Math.Clamp(sign * num, int.MinValue, int.MaxValue);
    }
}`);
addLang("cs", "fizz-buzz", String.raw`public class Solution {
    public IList<string> FizzBuzz(int n) {
        var res = new List<string>();
        for (int i = 1; i <= n; i++)
            res.Add(i % 15 == 0 ? "FizzBuzz" : i % 3 == 0 ? "Fizz" : i % 5 == 0 ? "Buzz" : i.ToString());
        return res;
    }
}`);
addLang("cs", "add-digits", String.raw`public class Solution {
    public int AddDigits(int num) {
        return num == 0 ? 0 : 1 + (num - 1) % 9;   // digital root
    }
}`);
addLang("cs", "count-primes", String.raw`public class Solution {
    public int CountPrimes(int n) {
        if (n < 3) return 0;
        var composite = new bool[n];   // sieve of Eratosthenes
        int count = 0;
        for (int p = 2; p < n; p++) {
            if (composite[p]) continue;
            count++;
            for (long m = (long)p * p; m < n; m += p) composite[m] = true;
        }
        return count;
    }
}`);
addLang("cs", "add-strings", String.raw`public class Solution {
    public string AddStrings(string num1, string num2) {
        var sb = new StringBuilder();
        int i = num1.Length - 1, j = num2.Length - 1, carry = 0;
        while (i >= 0 || j >= 0 || carry > 0) {
            int total = carry;
            if (i >= 0) total += num1[i--] - '0';
            if (j >= 0) total += num2[j--] - '0';
            sb.Insert(0, total % 10);
            carry = total / 10;
        }
        return sb.ToString();
    }
}`);
addLang("cs", "count-and-say", String.raw`public class Solution {
    public string CountAndSay(int n) {
        string s = "1";
        for (int k = 1; k < n; k++) {
            var sb = new StringBuilder();
            for (int i = 0; i < s.Length; ) {   // read off each run: count, then digit
                int j = i;
                while (j < s.Length && s[j] == s[i]) j++;
                sb.Append(j - i).Append(s[i]);
                i = j;
            }
            s = sb.ToString();
        }
        return s;
    }
}`);
addLang("cs", "sequential-digits", String.raw`public class Solution {
    public IList<int> SequentialDigits(int low, int high) {
        const string digits = "123456789";
        var res = new List<int>();
        for (int len = 2; len <= 9; len++)   // shorter numbers first, then left to right
            for (int start = 0; start + len <= 9; start++) {
                int x = int.Parse(digits.Substring(start, len));
                if (x >= low && x <= high) res.Add(x);
            }
        return res;
    }
}`);
addLang("cs", "maximum-product-of-three-numbers", String.raw`public class Solution {
    public int MaximumProduct(int[] nums) {
        Array.Sort(nums);
        int n = nums.Length;
        // three largest, or two most negative times the largest
        return Math.Max(nums[n - 1] * nums[n - 2] * nums[n - 3], nums[0] * nums[1] * nums[n - 1]);
    }
}`);
addLang("cs", "climbing-stairs", String.raw`public class Solution {
    public int ClimbStairs(int n) {
        int a = 1, b = 1;   // ways to reach the previous two steps
        for (int i = 1; i < n; i++) (a, b) = (b, a + b);
        return b;
    }
}`);
addLang("cs", "min-cost-climbing-stairs", String.raw`public class Solution {
    public int MinCostClimbingStairs(int[] cost) {
        int a = cost[0], b = cost[1];   // cheapest way to stand on the last two steps
        for (int i = 2; i < cost.Length; i++) (a, b) = (b, cost[i] + Math.Min(a, b));
        return Math.Min(a, b);
    }
}`);
addLang("cs", "house-robber", String.raw`public class Solution {
    public int Rob(int[] nums) {
        int prev = 0, cur = 0;   // best totals up to two houses back and one house back
        foreach (int x in nums) (prev, cur) = (cur, Math.Max(cur, prev + x));   // skip this house, or rob it
        return cur;
    }
}`);
addLang("cs", "coin-change", String.raw`public class Solution {
    public int CoinChange(int[] coins, int amount) {
        var dp = new int[amount + 1];   // dp[a] = fewest coins that make a
        Array.Fill(dp, int.MaxValue);
        dp[0] = 0;
        for (int a = 1; a <= amount; a++)
            foreach (int c in coins)
                if (c <= a && dp[a - c] != int.MaxValue) dp[a] = Math.Min(dp[a], dp[a - c] + 1);
        return dp[amount] == int.MaxValue ? -1 : dp[amount];
    }
}`);
addLang("cs", "house-robber-ii", String.raw`public class Solution {
    public int Rob(int[] nums) {
        if (nums.Length == 1) return nums[0];
        int Line(int lo, int hi) {
            int prev = 0, cur = 0;
            for (int i = lo; i <= hi; i++) (prev, cur) = (cur, Math.Max(cur, prev + nums[i]));
            return cur;
        }
        // the first and last houses touch: rob without the last, or without the first
        return Math.Max(Line(0, nums.Length - 2), Line(1, nums.Length - 1));
    }
}`);
addLang("cs", "longest-palindromic-substring", String.raw`public class Solution {
    public string LongestPalindrome(string s) {
        int bestLo = 0, bestLen = 0;
        void Expand(int l, int r) {
            while (l >= 0 && r < s.Length && s[l] == s[r]) { l--; r++; }
            if (r - l - 1 > bestLen) { bestLo = l + 1; bestLen = r - l - 1; }
        }
        for (int i = 0; i < s.Length; i++) {   // odd and even centres
            Expand(i, i);
            Expand(i, i + 1);
        }
        return s.Substring(bestLo, bestLen);
    }
}`);
addLang("cs", "decode-ways", String.raw`public class Solution {
    public int NumDecodings(string s) {
        int prev = 1, cur = s[0] != '0' ? 1 : 0;   // ways to decode up to i - 1 and up to i
        for (int i = 1; i < s.Length; i++) {
            int next = 0;
            if (s[i] != '0') next += cur;   // read one digit
            int two = (s[i - 1] - '0') * 10 + (s[i] - '0');
            if (two >= 10 && two <= 26) next += prev;   // or two digits
            (prev, cur) = (cur, next);
        }
        return cur;
    }
}`);
addLang("cs", "word-break", String.raw`public class Solution {
    public bool WordBreak(string s, IList<string> wordDict) {
        var words = new HashSet<string>(wordDict);
        var dp = new bool[s.Length + 1];   // dp[i]: the first i letters can be split
        dp[0] = true;
        for (int i = 1; i <= s.Length; i++)
            for (int j = 0; j < i; j++)
                if (dp[j] && words.Contains(s[j..i])) {
                    dp[i] = true;
                    break;
                }
        return dp[s.Length];
    }
}`);
addLang("cs", "longest-increasing-subsequence", String.raw`public class Solution {
    public int LengthOfLIS(int[] nums) {
        var tails = new List<int>();   // tails[k] = smallest tail of an increasing run of length k + 1
        foreach (int x in nums) {
            int i = tails.BinarySearch(x);
            if (i < 0) i = ~i;   // first tail >= x
            if (i == tails.Count) tails.Add(x);
            else tails[i] = x;
        }
        return tails.Count;
    }
}`);
addLang("cs", "palindromic-substrings", String.raw`public class Solution {
    public int CountSubstrings(string s) {
        int Expand(int l, int r) {
            int n = 0;
            while (l >= 0 && r < s.Length && s[l] == s[r]) { n++; l--; r++; }
            return n;
        }
        int count = 0;
        for (int i = 0; i < s.Length; i++) count += Expand(i, i) + Expand(i, i + 1);   // odd and even centres
        return count;
    }
}`);

addLang("cs", "maximum-product-subarray", String.raw`public class Solution {
    public int MaxProduct(int[] nums) {
        int best = nums[0], hi = nums[0], lo = nums[0];   // largest and smallest product ending here
        for (int i = 1; i < nums.Length; i++) {
            int x = nums[i], a = hi * x, b = lo * x;   // a negative x swaps the roles of hi and lo
            hi = Math.Max(x, Math.Max(a, b));
            lo = Math.Min(x, Math.Min(a, b));
            best = Math.Max(best, hi);
        }
        return best;
    }
}`);
addLang("cs", "partition-equal-subset-sum", String.raw`public class Solution {
    public bool CanPartition(int[] nums) {
        int total = nums.Sum();
        if (total % 2 == 1) return false;
        int target = total / 2;
        var reachable = new bool[target + 1];   // reachable[s]: some subset sums to s
        reachable[0] = true;
        foreach (int x in nums)
            for (int s = target; s >= x; s--)   // backwards so each number is used once
                if (reachable[s - x]) reachable[s] = true;
        return reachable[target];
    }
}`);
addLang("cs", "fibonacci-number", String.raw`public class Solution {
    public int Fib(int n) {
        int a = 0, b = 1;
        for (int i = 0; i < n; i++) (a, b) = (b, a + b);
        return a;
    }
}`);
addLang("cs", "pascals-triangle", String.raw`public class Solution {
    public IList<IList<int>> Generate(int numRows) {
        var rows = new List<IList<int>> { new List<int> { 1 } };
        for (int r = 1; r < numRows; r++) {
            var prev = rows[r - 1];
            var row = new List<int> { 1 };
            for (int i = 0; i + 1 < prev.Count; i++) row.Add(prev[i] + prev[i + 1]);   // sum of the two above
            row.Add(1);
            rows.Add(row);
        }
        return rows;
    }
}`);
addLang("cs", "unique-paths", String.raw`public class Solution {
    public int UniquePaths(int m, int n) {
        var row = Enumerable.Repeat(1, n).ToArray();   // paths to each cell of the current row
        for (int r = 1; r < m; r++)
            for (int j = 1; j < n; j++) row[j] += row[j - 1];   // from above + from the left
        return row[n - 1];
    }
}`);
addLang("cs", "longest-common-subsequence", String.raw`public class Solution {
    public int LongestCommonSubsequence(string text1, string text2) {
        int m = text1.Length, n = text2.Length;
        var dp = new int[m + 1, n + 1];   // dp[i, j] = LCS of the first i and first j letters
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                dp[i, j] = text1[i - 1] == text2[j - 1] ? dp[i - 1, j - 1] + 1 : Math.Max(dp[i - 1, j], dp[i, j - 1]);
        return dp[m, n];
    }
}`);
addLang("cs", "coin-change-ii", String.raw`public class Solution {
    public int Change(int amount, int[] coins) {
        var dp = new long[amount + 1];   // dp[a] = ways to make a (long: partial counts can get big)
        dp[0] = 1;
        foreach (int c in coins)   // coins in the outer loop: each combination counted once, in one order
            for (int a = c; a <= amount; a++) dp[a] += dp[a - c];
        return (int)dp[amount];
    }
}`);
addLang("cs", "target-sum", String.raw`public class Solution {
    public int FindTargetSumWays(int[] nums, int target) {
        var dp = new Dictionary<int, int> { [0] = 1 };   // running sum -> number of ways to reach it
        foreach (int x in nums) {
            var next = new Dictionary<int, int>();
            foreach (var (s, ways) in dp) {
                next[s + x] = next.GetValueOrDefault(s + x) + ways;
                next[s - x] = next.GetValueOrDefault(s - x) + ways;
            }
            dp = next;
        }
        return dp.GetValueOrDefault(target);
    }
}`);
addLang("cs", "best-time-to-buy-and-sell-stock-with-cooldown", String.raw`public class Solution {
    public int MaxProfit(int[] prices) {
        // best profit when holding a share, having just sold, or resting (free to buy)
        int hold = int.MinValue, sold = 0, rest = 0;
        foreach (int p in prices) {
            int prevSold = sold;
            sold = hold + p;
            hold = Math.Max(hold, rest - p);
            rest = Math.Max(rest, prevSold);
        }
        return Math.Max(sold, rest);
    }
}`);
addLang("cs", "edit-distance", String.raw`public class Solution {
    public int MinDistance(string word1, string word2) {
        int m = word1.Length, n = word2.Length;
        var dp = new int[m + 1, n + 1];   // dp[i, j] = edits to turn the first i letters into the first j
        for (int i = 0; i <= m; i++) dp[i, 0] = i;
        for (int j = 0; j <= n; j++) dp[0, j] = j;
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                dp[i, j] = word1[i - 1] == word2[j - 1]
                    ? dp[i - 1, j - 1]
                    : 1 + Math.Min(dp[i - 1, j - 1], Math.Min(dp[i - 1, j], dp[i, j - 1]));   // replace, delete, insert
        return dp[m, n];
    }
}`);
addLang("cs", "regular-expression-matching", String.raw`public class Solution {
    public bool IsMatch(string s, string p) {
        var memo = new bool?[s.Length + 1, p.Length + 1];
        bool Dp(int i, int j) {   // does s[i..] match p[j..]?
            if (memo[i, j] is bool done) return done;
            bool res;
            if (j == p.Length) res = i == s.Length;
            else {
                bool first = i < s.Length && (p[j] == s[i] || p[j] == '.');
                if (j + 1 < p.Length && p[j + 1] == '*') res = Dp(i, j + 2) || (first && Dp(i + 1, j));   // skip "x*", or use it once more
                else res = first && Dp(i + 1, j + 1);
            }
            memo[i, j] = res;
            return res;
        }
        return Dp(0, 0);
    }
}`);
addLang("cs", "burst-balloons", String.raw`public class Solution {
    public int MaxCoins(int[] nums) {
        var a = new[] { 1 }.Concat(nums).Append(1).ToArray();   // pad with 1s at both ends
        int n = a.Length;
        var dp = new int[n, n];   // dp[l, r] = best coins from bursting everything strictly between l and r
        for (int len = 2; len < n; len++)
            for (int l = 0; l + len < n; l++) {
                int r = l + len;
                for (int k = l + 1; k < r; k++)   // k is the last balloon burst in (l, r)
                    dp[l, r] = Math.Max(dp[l, r], dp[l, k] + dp[k, r] + a[l] * a[k] * a[r]);
            }
        return dp[0, n - 1];
    }
}`);
addLang("cs", "predict-the-winner", String.raw`public class Solution {
    public bool PredictTheWinner(int[] nums) {
        var memo = new int?[nums.Length, nums.Length];
        int Diff(int i, int j) {   // best (my score - opponent's score) on nums[i..j]
            if (i > j) return 0;
            if (memo[i, j] is int done) return done;
            int res = Math.Max(nums[i] - Diff(i + 1, j), nums[j] - Diff(i, j - 1));
            memo[i, j] = res;
            return res;
        }
        return Diff(0, nums.Length - 1) >= 0;
    }
}`);
addLang("cs", "best-time-to-buy-and-sell-stock-iii", String.raw`public class Solution {
    public int MaxProfit(int[] prices) {
        int buy1 = int.MinValue, sell1 = 0, buy2 = int.MinValue, sell2 = 0;
        foreach (int p in prices) {   // best balance after each of the four moves
            buy1 = Math.Max(buy1, -p);
            sell1 = Math.Max(sell1, buy1 + p);
            buy2 = Math.Max(buy2, sell1 - p);
            sell2 = Math.Max(sell2, buy2 + p);
        }
        return sell2;
    }
}`);
