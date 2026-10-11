// Java solutions in LeetCode's format (java.util.* is available, as on LeetCode), shown when Java is the
// main language. Each one is checked against the same tests as the Python solution by
// tools/verify/verify.py. The approach and complexity text is shared with the Python solution (SOL).

// ---- First batch: one of each input / output shape ----
addLang("java", "two-sum", String.raw`class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();   // value -> index
        for (int i = 0; i < nums.length; i++) {
            Integer j = seen.get(target - nums[i]);
            if (j != null) return new int[] { j, i };
            seen.put(nums[i], i);
        }
        return new int[0];
    }
}`);
addLang("java", "move-zeroes", String.raw`class Solution {
    public void moveZeroes(int[] nums) {
        int w = 0;
        for (int x : nums)
            if (x != 0) nums[w++] = x;
        while (w < nums.length) nums[w++] = 0;
    }
}`);
addLang("java", "remove-duplicates-from-sorted-array", String.raw`class Solution {
    public int removeDuplicates(int[] nums) {
        int w = 1;
        for (int r = 1; r < nums.length; r++)
            if (nums[r] != nums[r - 1]) nums[w++] = nums[r];
        return w;
    }
}`);
addLang("java", "merge-two-sorted-lists", String.raw`class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(), tail = dummy;
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) { tail.next = list1; list1 = list1.next; }
            else { tail.next = list2; list2 = list2.next; }
            tail = tail.next;
        }
        tail.next = list1 != null ? list1 : list2;
        return dummy.next;
    }
}`);
addLang("java", "merge-k-sorted-lists", String.raw`class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> heap = new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val));
        for (ListNode node : lists)
            if (node != null) heap.add(node);
        ListNode dummy = new ListNode(), tail = dummy;
        while (!heap.isEmpty()) {
            ListNode node = heap.poll();
            tail.next = node;
            tail = node;
            if (node.next != null) heap.add(node.next);
        }
        return dummy.next;
    }
}`);
addLang("java", "linked-list-cycle", String.raw`public class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}`);
addLang("java", "invert-binary-tree", String.raw`class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root != null) {
            TreeNode left = invertTree(root.left);
            root.left = invertTree(root.right);
            root.right = left;
        }
        return root;
    }
}`);
addLang("java", "lowest-common-ancestor-of-a-binary-search-tree", String.raw`class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        while (root != null) {
            if (p.val < root.val && q.val < root.val) root = root.left;
            else if (p.val > root.val && q.val > root.val) root = root.right;
            else return root;
        }
        return null;
    }
}`);
addLang("java", "clone-graph", String.raw`class Solution {
    private final Map<Node, Node> copies = new HashMap<>();

    public Node cloneGraph(Node node) {
        if (node == null) return null;
        if (copies.containsKey(node)) return copies.get(node);
        Node c = new Node(node.val);
        copies.put(node, c);
        for (Node nb : node.neighbors) c.neighbors.add(cloneGraph(nb));
        return c;
    }
}`);
addLang("java", "copy-list-with-random-pointer", String.raw`class Solution {
    public Node copyRandomList(Node head) {
        Map<Node, Node> m = new HashMap<>();
        for (Node cur = head; cur != null; cur = cur.next) m.put(cur, new Node(cur.val));
        for (Node cur = head; cur != null; cur = cur.next) {
            m.get(cur).next = m.get(cur.next);
            m.get(cur).random = m.get(cur.random);
        }
        return m.get(head);
    }
}`);
addLang("java", "serialize-and-deserialize-binary-tree", String.raw`public class Codec {
    public String serialize(TreeNode root) {
        StringBuilder out = new StringBuilder();
        write(root, out);
        return out.toString();
    }

    private void write(TreeNode node, StringBuilder out) {
        if (out.length() > 0) out.append(',');
        if (node == null) { out.append('N'); return; }
        out.append(node.val);
        write(node.left, out);
        write(node.right, out);
    }

    public TreeNode deserialize(String data) {
        return read(new ArrayDeque<>(Arrays.asList(data.split(","))));
    }

    private TreeNode read(Deque<String> it) {
        String v = it.poll();
        if (v.equals("N")) return null;
        TreeNode node = new TreeNode(Integer.parseInt(v));
        node.left = read(it);
        node.right = read(it);
        return node;
    }
}`);
addLang("java", "first-bad-version", String.raw`public class Solution extends VersionControl {
    public int firstBadVersion(int n) {
        int lo = 1, hi = n;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;   // (lo + hi) / 2 can overflow
            if (isBadVersion(mid)) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }
}`);
addLang("java", "flatten-nested-list-iterator", String.raw`public class NestedIterator implements Iterator<Integer> {
    private final Deque<NestedInteger> stack = new ArrayDeque<>();

    public NestedIterator(List<NestedInteger> nestedList) {
        for (int i = nestedList.size() - 1; i >= 0; i--) stack.push(nestedList.get(i));
    }

    @Override
    public Integer next() {
        hasNext();
        return stack.pop().getInteger();
    }

    @Override
    public boolean hasNext() {
        while (!stack.isEmpty() && !stack.peek().isInteger()) {
            List<NestedInteger> inner = stack.pop().getList();
            for (int i = inner.size() - 1; i >= 0; i--) stack.push(inner.get(i));
        }
        return !stack.isEmpty();
    }
}`);
addLang("java", "encode-and-decode-strings", String.raw`public class Codec {
    // Each string as "<length>#<string>", so any character (even '#') is safe.
    public String encode(List<String> strs) {
        StringBuilder out = new StringBuilder();
        for (String s : strs) out.append(s.length()).append('#').append(s);
        return out.toString();
    }

    public List<String> decode(String s) {
        List<String> res = new ArrayList<>();
        int i = 0;
        while (i < s.length()) {
            int j = s.indexOf('#', i);
            int n = Integer.parseInt(s.substring(i, j));
            res.add(s.substring(j + 1, j + 1 + n));
            i = j + 1 + n;
        }
        return res;
    }
}`);
addLang("java", "lru-cache", String.raw`class LRUCache {
    private final int cap;
    // accessOrder = true keeps the least recently used entry first
    private final LinkedHashMap<Integer, Integer> d = new LinkedHashMap<>(16, 0.75f, true);

    public LRUCache(int capacity) { cap = capacity; }

    public int get(int key) {
        return d.getOrDefault(key, -1);
    }

    public void put(int key, int value) {
        d.put(key, value);
        if (d.size() > cap) d.remove(d.keySet().iterator().next());
    }
}`);

// ---- Arrays & Hashing, strings ----
addLang("java", "contains-duplicate", String.raw`class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int x : nums)
            if (!seen.add(x)) return true;   // add() returns false if x was already there
        return false;
    }
}`);
addLang("java", "valid-anagram", String.raw`class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }
        for (int c : count)
            if (c != 0) return false;
        return true;
    }
}`);
addLang("java", "majority-element", String.raw`class Solution {
    public int majorityElement(int[] nums) {
        int cand = 0, count = 0;   // Boyer-Moore voting
        for (int x : nums) {
            if (count == 0) cand = x;
            count += x == cand ? 1 : -1;
        }
        return cand;
    }
}`);
addLang("java", "group-anagrams", String.raw`class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> groups = new HashMap<>();
        for (String w : strs) {
            char[] key = w.toCharArray();
            Arrays.sort(key);
            groups.computeIfAbsent(new String(key), k -> new ArrayList<>()).add(w);
        }
        return new ArrayList<>(groups.values());
    }
}`);
addLang("java", "top-k-frequent-elements", String.raw`class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : nums) count.merge(x, 1, Integer::sum);
        List<List<Integer>> buckets = new ArrayList<>();   // buckets[c] = numbers seen c times
        for (int c = 0; c <= nums.length; c++) buckets.add(new ArrayList<>());
        for (var e : count.entrySet()) buckets.get(e.getValue()).add(e.getKey());
        int[] res = new int[k];
        int i = 0;
        for (int c = nums.length; c > 0 && i < k; c--)
            for (int num : buckets.get(c))
                if (i < k) res[i++] = num;
        return res;
    }
}`);
addLang("java", "product-of-array-except-self", String.raw`class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] res = new int[n];
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
addLang("java", "valid-sudoku", String.raw`class Solution {
    public boolean isValidSudoku(char[][] board) {
        Set<String> seen = new HashSet<>();
        for (int r = 0; r < 9; r++)
            for (int c = 0; c < 9; c++) {
                char v = board[r][c];
                if (v == '.') continue;
                // one set, three kinds of key: row, column and 3x3 box
                if (!seen.add(v + " in row " + r) || !seen.add(v + " in col " + c)
                        || !seen.add(v + " in box " + r / 3 + "," + c / 3))
                    return false;
            }
        return true;
    }
}`);
addLang("java", "longest-consecutive-sequence", String.raw`class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> s = new HashSet<>();
        for (int x : nums) s.add(x);
        int best = 0;
        for (int x : s) {
            if (s.contains(x - 1)) continue;   // only count from the start of a run
            int y = x;
            while (s.contains(y + 1)) y++;
            best = Math.max(best, y - x + 1);
        }
        return best;
    }
}`);
addLang("java", "subarray-sum-equals-k", String.raw`class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();   // prefix sum -> how often seen
        freq.put(0, 1);
        int pre = 0, count = 0;
        for (int x : nums) {
            pre += x;
            count += freq.getOrDefault(pre - k, 0);
            freq.merge(pre, 1, Integer::sum);
        }
        return count;
    }
}`);
addLang("java", "longest-common-prefix", String.raw`class Solution {
    public String longestCommonPrefix(String[] strs) {
        String prefix = strs[0];
        for (int i = 1; i < strs.length; i++)
            while (!strs[i].startsWith(prefix))
                prefix = prefix.substring(0, prefix.length() - 1);
        return prefix;
    }
}`);
addLang("java", "rotate-array", String.raw`class Solution {
    public void rotate(int[] nums, int k) {
        int n = nums.length;
        k %= n;
        reverse(nums, 0, n - 1);
        reverse(nums, 0, k - 1);
        reverse(nums, k, n - 1);
    }

    private void reverse(int[] nums, int l, int r) {
        while (l < r) {
            int t = nums[l];
            nums[l++] = nums[r];
            nums[r--] = t;
        }
    }
}`);
addLang("java", "intersection-of-two-arrays", String.raw`class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        Set<Integer> a = new HashSet<>(), both = new HashSet<>();
        for (int x : nums1) a.add(x);
        for (int x : nums2)
            if (a.contains(x)) both.add(x);
        return both.stream().mapToInt(Integer::intValue).toArray();
    }
}`);
addLang("java", "find-the-index-of-the-first-occurrence-in-a-string", String.raw`class Solution {
    public int strStr(String haystack, String needle) {
        int n = haystack.length(), m = needle.length();
        for (int i = 0; i + m <= n; i++)
            if (haystack.startsWith(needle, i)) return i;
        return -1;
    }
}`);
addLang("java", "first-missing-positive", String.raw`class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n; i++)
            // put each value v in 1..n at index v - 1 (cyclic sort)
            while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                int j = nums[i] - 1, t = nums[i];
                nums[i] = nums[j];
                nums[j] = t;
            }
        for (int i = 0; i < n; i++)
            if (nums[i] != i + 1) return i + 1;
        return n + 1;
    }
}`);
addLang("java", "check-if-array-is-sorted-and-rotated", String.raw`class Solution {
    public boolean check(int[] nums) {
        int n = nums.length, drops = 0;
        for (int i = 0; i < n; i++)
            if (nums[i] > nums[(i + 1) % n]) drops++;
        return drops <= 1;
    }
}`);
addLang("java", "first-unique-character-in-a-string", String.raw`class Solution {
    public int firstUniqChar(String s) {
        int[] count = new int[26];
        for (char c : s.toCharArray()) count[c - 'a']++;
        for (int i = 0; i < s.length(); i++)
            if (count[s.charAt(i) - 'a'] == 1) return i;
        return -1;
    }
}`);
addLang("java", "rotate-string", String.raw`class Solution {
    public boolean rotateString(String s, String goal) {
        return s.length() == goal.length() && (s + s).contains(goal);
    }
}`);
addLang("java", "length-of-last-word", String.raw`class Solution {
    public int lengthOfLastWord(String s) {
        int i = s.length() - 1, n = 0;
        while (s.charAt(i) == ' ') i--;
        while (i >= 0 && s.charAt(i) != ' ') { n++; i--; }
        return n;
    }
}`);
addLang("java", "isomorphic-strings", String.raw`class Solution {
    public boolean isIsomorphic(String s, String t) {
        Map<Character, Character> st = new HashMap<>(), ts = new HashMap<>();
        for (int i = 0; i < s.length(); i++) {
            char a = s.charAt(i), b = t.charAt(i);
            if (st.getOrDefault(a, b) != b || ts.getOrDefault(b, a) != a) return false;
            st.put(a, b);
            ts.put(b, a);
        }
        return true;
    }
}`);
addLang("java", "zigzag-conversion", String.raw`class Solution {
    public String convert(String s, int numRows) {
        if (numRows == 1) return s;
        StringBuilder[] rows = new StringBuilder[numRows];
        for (int i = 0; i < numRows; i++) rows[i] = new StringBuilder();
        int r = 0, step = 1;
        for (char c : s.toCharArray()) {
            rows[r].append(c);
            if (r == 0) step = 1;
            else if (r == numRows - 1) step = -1;
            r += step;
        }
        StringBuilder out = new StringBuilder();
        for (StringBuilder row : rows) out.append(row);
        return out.toString();
    }
}`);

addLang("java", "set-mismatch", String.raw`class Solution {
    public int[] findErrorNums(int[] nums) {
        int n = nums.length;
        int[] seen = new int[n + 1];
        for (int x : nums) seen[x]++;
        int dup = 0, missing = 0;
        for (int v = 1; v <= n; v++) {
            if (seen[v] == 2) dup = v;
            if (seen[v] == 0) missing = v;
        }
        return new int[] { dup, missing };
    }
}`);
addLang("java", "ransom-note", String.raw`class Solution {
    public boolean canConstruct(String ransomNote, String magazine) {
        int[] have = new int[26];
        for (char c : magazine.toCharArray()) have[c - 'a']++;
        for (char c : ransomNote.toCharArray())
            if (--have[c - 'a'] < 0) return false;
        return true;
    }
}`);
addLang("java", "can-make-arithmetic-progression-from-sequence", String.raw`class Solution {
    public boolean canMakeArithmeticProgression(int[] arr) {
        Arrays.sort(arr);
        int d = arr[1] - arr[0];
        for (int i = 0; i + 1 < arr.length; i++)
            if (arr[i + 1] - arr[i] != d) return false;
        return true;
    }
}`);
addLang("java", "majority-element-ii", String.raw`class Solution {
    public List<Integer> majorityElement(int[] nums) {
        // Boyer-Moore with two candidates: at most two values can appear more than n/3 times
        Integer c1 = null, c2 = null;
        int n1 = 0, n2 = 0;
        for (int x : nums) {
            if (c1 != null && x == c1) n1++;
            else if (c2 != null && x == c2) n2++;
            else if (n1 == 0) { c1 = x; n1 = 1; }
            else if (n2 == 0) { c2 = x; n2 = 1; }
            else { n1--; n2--; }
        }
        List<Integer> res = new ArrayList<>();
        for (Integer c : new Integer[] { c1, c2 }) {
            if (c == null) continue;
            int count = 0;
            for (int x : nums) if (x == c) count++;
            if (count > nums.length / 3) res.add(c);
        }
        return res;
    }
}`);
addLang("java", "sort-an-array", String.raw`class Solution {
    public int[] sortArray(int[] nums) {   // merge sort
        if (nums.length <= 1) return nums;
        int mid = nums.length / 2;
        int[] a = sortArray(Arrays.copyOfRange(nums, 0, mid));
        int[] b = sortArray(Arrays.copyOfRange(nums, mid, nums.length));
        int[] out = new int[nums.length];
        int i = 0, j = 0, k = 0;
        while (i < a.length && j < b.length) out[k++] = a[i] <= b[j] ? a[i++] : b[j++];
        while (i < a.length) out[k++] = a[i++];
        while (j < b.length) out[k++] = b[j++];
        return out;
    }
}`);
addLang("java", "subarray-sums-divisible-by-k", String.raw`class Solution {
    public int subarraysDivByK(int[] nums, int k) {
        int[] count = new int[k];   // remainder of the prefix sum -> how often seen
        count[0] = 1;
        int prefix = 0, res = 0;
        for (int x : nums) {
            prefix = ((prefix + x) % k + k) % k;   // Java's % can be negative
            res += count[prefix]++;
        }
        return res;
    }
}`);
addLang("java", "contiguous-array", String.raw`class Solution {
    public int findMaxLength(int[] nums) {
        Map<Integer, Integer> first = new HashMap<>();   // running balance -> first index seen
        first.put(0, -1);
        int total = 0, best = 0;
        for (int i = 0; i < nums.length; i++) {
            total += nums[i] == 1 ? 1 : -1;
            if (first.containsKey(total)) best = Math.max(best, i - first.get(total));
            else first.put(total, i);
        }
        return best;
    }
}`);
addLang("java", "reverse-pairs", String.raw`class Solution {
    public int reversePairs(int[] nums) {
        return sort(nums, 0, nums.length - 1);
    }

    // Merge sort that also counts pairs i < j with nums[i] > 2 * nums[j] across the two halves.
    private int sort(int[] a, int lo, int hi) {
        if (lo >= hi) return 0;
        int mid = (lo + hi) / 2;
        int count = sort(a, lo, mid) + sort(a, mid + 1, hi);
        for (int i = lo, j = mid + 1; i <= mid; i++) {
            while (j <= hi && a[i] > 2L * a[j]) j++;   // 2L: 2 * a[j] can overflow an int
            count += j - (mid + 1);
        }
        int[] merged = new int[hi - lo + 1];
        int i = lo, j = mid + 1, k = 0;
        while (i <= mid && j <= hi) merged[k++] = a[i] <= a[j] ? a[i++] : a[j++];
        while (i <= mid) merged[k++] = a[i++];
        while (j <= hi) merged[k++] = a[j++];
        System.arraycopy(merged, 0, a, lo, merged.length);
        return count;
    }
}`);
addLang("java", "range-sum-query-immutable", String.raw`class NumArray {
    private final int[] prefix;   // prefix[i] = sum of the first i numbers

    public NumArray(int[] nums) {
        prefix = new int[nums.length + 1];
        for (int i = 0; i < nums.length; i++) prefix[i + 1] = prefix[i] + nums[i];
    }

    public int sumRange(int left, int right) {
        return prefix[right + 1] - prefix[left];
    }
}`);
addLang("java", "find-the-highest-altitude", String.raw`class Solution {
    public int largestAltitude(int[] gain) {
        int alt = 0, best = 0;
        for (int g : gain) {
            alt += g;
            best = Math.max(best, alt);
        }
        return best;
    }
}`);
addLang("java", "find-pivot-index", String.raw`class Solution {
    public int pivotIndex(int[] nums) {
        int total = 0, left = 0;
        for (int x : nums) total += x;
        for (int i = 0; i < nums.length; i++) {
            if (left == total - left - nums[i]) return i;
            left += nums[i];
        }
        return -1;
    }
}`);
addLang("java", "left-and-right-sum-differences", String.raw`class Solution {
    public int[] leftRightDifference(int[] nums) {
        int total = 0, left = 0;
        for (int x : nums) total += x;
        int[] res = new int[nums.length];
        for (int i = 0; i < nums.length; i++) {
            res[i] = Math.abs(left - (total - left - nums[i]));
            left += nums[i];
        }
        return res;
    }
}`);
addLang("java", "rank-transform-of-an-array", String.raw`class Solution {
    public int[] arrayRankTransform(int[] arr) {
        int[] sorted = arr.clone();
        Arrays.sort(sorted);
        Map<Integer, Integer> rank = new HashMap<>();
        for (int v : sorted) rank.putIfAbsent(v, rank.size() + 1);
        int[] res = new int[arr.length];
        for (int i = 0; i < arr.length; i++) res[i] = rank.get(arr[i]);
        return res;
    }
}`);
addLang("java", "number-of-strings-that-appear-as-substrings-in-word", String.raw`class Solution {
    public int numOfStrings(String[] patterns, String word) {
        int count = 0;
        for (String p : patterns)
            if (word.contains(p)) count++;
        return count;
    }
}`);
addLang("java", "insert-delete-getrandom-o1", String.raw`class RandomizedSet {
    private final List<Integer> vals = new ArrayList<>();
    private final Map<Integer, Integer> pos = new HashMap<>();   // value -> its index in vals
    private final Random rand = new Random();

    public boolean insert(int val) {
        if (pos.containsKey(val)) return false;
        pos.put(val, vals.size());
        vals.add(val);
        return true;
    }

    public boolean remove(int val) {
        Integer i = pos.remove(val);
        if (i == null) return false;
        int last = vals.remove(vals.size() - 1);   // move the last value into the gap
        if (i < vals.size()) {
            vals.set(i, last);
            pos.put(last, i);
        }
        return true;
    }

    public int getRandom() {
        return vals.get(rand.nextInt(vals.size()));
    }
}`);
addLang("java", "count-subarrays-with-majority-element-i", String.raw`class Solution {
    public int countMajoritySubarrays(int[] nums, int target) {
        int n = nums.length, res = 0;
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
addLang("java", "minimum-moves-to-make-array-complementary", String.raw`class Solution {
    public int minMoves(int[] nums, int limit) {
        int n = nums.length;
        int[] diff = new int[2 * limit + 2];   // difference array over target sums
        for (int i = 0; i < n / 2; i++) {
            int a = Math.min(nums[i], nums[n - 1 - i]), b = Math.max(nums[i], nums[n - 1 - i]);
            diff[2] += 2;
            diff[a + 1] -= 1;
            diff[a + b] -= 1;
            diff[a + b + 1] += 1;
            diff[b + limit + 1] += 1;
        }
        int best = Integer.MAX_VALUE, cur = 0;
        for (int t = 2; t <= 2 * limit; t++) {
            cur += diff[t];
            best = Math.min(best, cur);
        }
        return best;
    }
}`);
addLang("java", "design-hit-counter", String.raw`class HitCounter {
    private final Deque<Integer> q = new ArrayDeque<>();

    public void hit(int timestamp) {
        q.addLast(timestamp);
    }

    public int getHits(int timestamp) {
        while (!q.isEmpty() && q.peekFirst() <= timestamp - 300) q.pollFirst();
        return q.size();
    }
}`);
addLang("java", "design-authentication-manager", String.raw`class AuthenticationManager {
    private final int ttl;
    private final Map<String, Integer> expiry = new HashMap<>();

    public AuthenticationManager(int timeToLive) {
        ttl = timeToLive;
    }

    public void generate(String tokenId, int currentTime) {
        expiry.put(tokenId, currentTime + ttl);
    }

    public void renew(String tokenId, int currentTime) {
        if (expiry.getOrDefault(tokenId, 0) > currentTime) expiry.put(tokenId, currentTime + ttl);
    }

    public int countUnexpiredTokens(int currentTime) {
        int n = 0;
        for (int t : expiry.values())
            if (t > currentTime) n++;
        return n;
    }
}`);
addLang("java", "design-spreadsheet", String.raw`class Spreadsheet {
    private final Map<String, Integer> cells = new HashMap<>();

    public Spreadsheet(int rows) {}

    public void setCell(String cell, int value) {
        cells.put(cell, value);
    }

    public void resetCell(String cell) {
        cells.remove(cell);
    }

    public int getValue(String formula) {
        String[] parts = formula.substring(1).split("\\+");
        return val(parts[0]) + val(parts[1]);
    }

    private int val(String x) {
        return Character.isDigit(x.charAt(0)) ? Integer.parseInt(x) : cells.getOrDefault(x, 0);
    }
}`);

addLang("java", "design-memory-allocator", String.raw`class Allocator {
    private final int[] mem;   // 0 = free, otherwise the mID that owns the unit

    public Allocator(int n) {
        mem = new int[n];
    }

    public int allocate(int size, int mID) {
        int run = 0;
        for (int i = 0; i < mem.length; i++) {
            run = mem[i] == 0 ? run + 1 : 0;
            if (run == size) {
                int start = i - size + 1;
                Arrays.fill(mem, start, i + 1, mID);
                return start;
            }
        }
        return -1;
    }

    public int freeMemory(int mID) {
        int count = 0;
        for (int i = 0; i < mem.length; i++)
            if (mem[i] == mID) { mem[i] = 0; count++; }
        return count;
    }
}`);
addLang("java", "in-memory-database", String.raw`class InMemoryDB {
    private record Rec(String value, Integer expiresAt) {}   // expiresAt == null: never expires

    private final Map<String, Map<String, Rec>> data = new HashMap<>();

    private boolean alive(Rec rec, int t) {
        return rec != null && (rec.expiresAt() == null || t < rec.expiresAt());
    }

    private Rec find(String key, String field) {
        return data.getOrDefault(key, Map.of()).get(field);
    }

    public void set(int timestamp, String key, String field, String value) {
        data.computeIfAbsent(key, k -> new HashMap<>()).put(field, new Rec(value, null));
    }

    public void setWithTtl(int timestamp, String key, String field, String value, int ttl) {
        data.computeIfAbsent(key, k -> new HashMap<>()).put(field, new Rec(value, timestamp + ttl));
    }

    public String get(int timestamp, String key, String field) {
        Rec rec = find(key, field);
        return alive(rec, timestamp) ? rec.value() : null;
    }

    public boolean delete(int timestamp, String key, String field) {
        if (!alive(find(key, field), timestamp)) return false;
        data.get(key).remove(field);
        return true;
    }

    public List<String> scan(int timestamp, String key) {
        return scanByPrefix(timestamp, key, "");
    }

    public List<String> scanByPrefix(int timestamp, String key, String prefix) {
        List<String> out = new ArrayList<>();
        Map<String, Rec> fields = new TreeMap<>(data.getOrDefault(key, Map.of()));   // sorted by field
        for (var e : fields.entrySet())
            if (e.getKey().startsWith(prefix) && alive(e.getValue(), timestamp))
                out.add(e.getKey() + "(" + e.getValue().value() + ")");
        return out;
    }
}`);
addLang("java", "valid-palindrome", String.raw`class Solution {
    public boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;
            l++;
            r--;
        }
        return true;
    }
}`);
addLang("java", "merge-sorted-array", String.raw`class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1, j = n - 1, k = m + n - 1;   // fill from the back
        while (j >= 0) {
            if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
            else nums1[k--] = nums2[j--];
        }
    }
}`);
addLang("java", "two-sum-ii-input-array-is-sorted", String.raw`class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int l = 0, r = numbers.length - 1;
        while (l < r) {
            int s = numbers[l] + numbers[r];
            if (s == target) return new int[] { l + 1, r + 1 };
            if (s < target) l++;
            else r--;
        }
        return new int[0];
    }
}`);
addLang("java", "3sum", String.raw`class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < nums.length && nums[i] <= 0; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;   // skip duplicate first numbers
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int s = nums[i] + nums[l] + nums[r];
                if (s < 0) l++;
                else if (s > 0) r--;
                else {
                    res.add(List.of(nums[i], nums[l], nums[r]));
                    l++;
                    while (l < r && nums[l] == nums[l - 1]) l++;
                }
            }
        }
        return res;
    }
}`);
addLang("java", "3sum-closest", String.raw`class Solution {
    public int threeSumClosest(int[] nums, int target) {
        Arrays.sort(nums);
        int best = nums[0] + nums[1] + nums[2];
        for (int i = 0; i < nums.length - 2; i++) {
            int lo = i + 1, hi = nums.length - 1;
            while (lo < hi) {
                int s = nums[i] + nums[lo] + nums[hi];
                if (Math.abs(s - target) < Math.abs(best - target)) best = s;
                if (s < target) lo++;
                else if (s > target) hi--;
                else return s;
            }
        }
        return best;
    }
}`);
addLang("java", "4sum", String.raw`class Solution {
    public List<List<Integer>> fourSum(int[] nums, int target) {
        Arrays.sort(nums);
        int n = nums.length;
        List<List<Integer>> res = new ArrayList<>();
        for (int a = 0; a < n - 3; a++) {
            if (a > 0 && nums[a] == nums[a - 1]) continue;
            for (int b = a + 1; b < n - 2; b++) {
                if (b > a + 1 && nums[b] == nums[b - 1]) continue;
                int lo = b + 1, hi = n - 1;
                while (lo < hi) {
                    long s = (long) nums[a] + nums[b] + nums[lo] + nums[hi];   // long: four ints can overflow
                    if (s < target) lo++;
                    else if (s > target) hi--;
                    else {
                        res.add(List.of(nums[a], nums[b], nums[lo], nums[hi]));
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
addLang("java", "next-permutation", String.raw`class Solution {
    public void nextPermutation(int[] nums) {
        int i = nums.length - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) i--;   // rightmost place where the order rises
        if (i >= 0) {
            int j = nums.length - 1;
            while (nums[j] <= nums[i]) j--;
            swap(nums, i, j);
        }
        for (int l = i + 1, r = nums.length - 1; l < r; l++, r--) swap(nums, l, r);
    }

    private void swap(int[] a, int i, int j) {
        int t = a[i];
        a[i] = a[j];
        a[j] = t;
    }
}`);
addLang("java", "container-with-most-water", String.raw`class Solution {
    public int maxArea(int[] height) {
        int l = 0, r = height.length - 1, best = 0;
        while (l < r) {
            best = Math.max(best, (r - l) * Math.min(height[l], height[r]));
            if (height[l] < height[r]) l++;   // move the shorter wall
            else r--;
        }
        return best;
    }
}`);
addLang("java", "sort-colors", String.raw`class Solution {
    public void sortColors(int[] nums) {
        int lo = 0, i = 0, hi = nums.length - 1;   // Dutch national flag
        while (i <= hi) {
            if (nums[i] == 0) swap(nums, lo++, i++);
            else if (nums[i] == 2) swap(nums, hi--, i);
            else i++;
        }
    }

    private void swap(int[] a, int i, int j) {
        int t = a[i];
        a[i] = a[j];
        a[j] = t;
    }
}`);
addLang("java", "trapping-rain-water", String.raw`class Solution {
    public int trap(int[] height) {
        int l = 0, r = height.length - 1, lmax = 0, rmax = 0, water = 0;
        while (l < r) {
            if (height[l] < height[r]) {
                lmax = Math.max(lmax, height[l]);
                water += lmax - height[l++];
            } else {
                rmax = Math.max(rmax, height[r]);
                water += rmax - height[r--];
            }
        }
        return water;
    }
}`);
addLang("java", "remove-element", String.raw`class Solution {
    public int removeElement(int[] nums, int val) {
        int k = 0;
        for (int x : nums)
            if (x != val) nums[k++] = x;
        return k;
    }
}`);
addLang("java", "merge-strings-alternately", String.raw`class Solution {
    public String mergeAlternately(String word1, String word2) {
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < Math.max(word1.length(), word2.length()); i++) {
            if (i < word1.length()) out.append(word1.charAt(i));
            if (i < word2.length()) out.append(word2.charAt(i));
        }
        return out.toString();
    }
}`);
addLang("java", "squares-of-a-sorted-array", String.raw`class Solution {
    public int[] sortedSquares(int[] nums) {
        int[] res = new int[nums.length];
        int lo = 0, hi = nums.length - 1;
        for (int k = nums.length - 1; k >= 0; k--) {   // the biggest square is at one of the ends
            if (Math.abs(nums[lo]) > Math.abs(nums[hi])) { res[k] = nums[lo] * nums[lo]; lo++; }
            else { res[k] = nums[hi] * nums[hi]; hi--; }
        }
        return res;
    }
}`);
addLang("java", "valid-palindrome-ii", String.raw`class Solution {
    public boolean validPalindrome(String s) {
        int lo = 0, hi = s.length() - 1;
        while (lo < hi) {
            if (s.charAt(lo) != s.charAt(hi))   // skip one side or the other
                return isPal(s, lo + 1, hi) || isPal(s, lo, hi - 1);
            lo++;
            hi--;
        }
        return true;
    }

    private boolean isPal(String s, int lo, int hi) {
        while (lo < hi)
            if (s.charAt(lo++) != s.charAt(hi--)) return false;
        return true;
    }
}`);
addLang("java", "reverse-string", String.raw`class Solution {
    public void reverseString(char[] s) {
        for (int lo = 0, hi = s.length - 1; lo < hi; lo++, hi--) {
            char t = s[lo];
            s[lo] = s[hi];
            s[hi] = t;
        }
    }
}`);
addLang("java", "remove-duplicates-from-sorted-array-ii", String.raw`class Solution {
    public int removeDuplicates(int[] nums) {
        int k = 0;
        for (int x : nums)
            if (k < 2 || x != nums[k - 2]) nums[k++] = x;   // keep at most two of each
        return k;
    }
}`);
addLang("java", "reverse-vowels-of-a-string", String.raw`class Solution {
    public String reverseVowels(String s) {
        String vowels = "aeiouAEIOU";
        char[] a = s.toCharArray();
        int lo = 0, hi = a.length - 1;
        while (lo < hi) {
            if (vowels.indexOf(a[lo]) < 0) lo++;
            else if (vowels.indexOf(a[hi]) < 0) hi--;
            else {
                char t = a[lo];
                a[lo++] = a[hi];
                a[hi--] = t;
            }
        }
        return new String(a);
    }
}`);
addLang("java", "reverse-words-in-a-string", String.raw`class Solution {
    public String reverseWords(String s) {
        List<String> words = Arrays.asList(s.trim().split("\\s+"));
        Collections.reverse(words);
        return String.join(" ", words);
    }
}`);

addLang("java", "string-compression", String.raw`class Solution {
    public int compress(char[] chars) {
        int write = 0, read = 0;
        while (read < chars.length) {
            char c = chars[read];
            int start = read;
            while (read < chars.length && chars[read] == c) read++;
            chars[write++] = c;
            if (read - start > 1)
                for (char d : Integer.toString(read - start).toCharArray()) chars[write++] = d;
        }
        return write;
    }
}`);
addLang("java", "is-subsequence", String.raw`class Solution {
    public boolean isSubsequence(String s, String t) {
        int i = 0;
        for (int j = 0; j < t.length() && i < s.length(); j++)
            if (s.charAt(i) == t.charAt(j)) i++;
        return i == s.length();
    }
}`);
addLang("java", "rearrange-array-elements-by-sign", String.raw`class Solution {
    public int[] rearrangeArray(int[] nums) {
        int[] res = new int[nums.length];
        int pos = 0, neg = 1;
        for (int x : nums) {
            if (x > 0) { res[pos] = x; pos += 2; }
            else { res[neg] = x; neg += 2; }
        }
        return res;
    }
}`);
addLang("java", "best-time-to-buy-and-sell-stock", String.raw`class Solution {
    public int maxProfit(int[] prices) {
        int low = Integer.MAX_VALUE, best = 0;
        for (int p : prices) {
            low = Math.min(low, p);
            best = Math.max(best, p - low);
        }
        return best;
    }
}`);
addLang("java", "maximum-average-subarray-i", String.raw`class Solution {
    public double findMaxAverage(int[] nums, int k) {
        int s = 0;
        for (int i = 0; i < k; i++) s += nums[i];
        int best = s;
        for (int i = k; i < nums.length; i++) {   // slide: add the new number, drop the oldest
            s += nums[i] - nums[i - k];
            best = Math.max(best, s);
        }
        return (double) best / k;
    }
}`);
addLang("java", "longest-substring-without-repeating-characters", String.raw`class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> last = new HashMap<>();   // char -> index where it was last seen
        int l = 0, best = 0;
        for (int r = 0; r < s.length(); r++) {
            char ch = s.charAt(r);
            Integer seen = last.get(ch);
            if (seen != null && seen >= l) l = seen + 1;
            last.put(ch, r);
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
}`);
addLang("java", "max-consecutive-ones-iii", String.raw`class Solution {
    public int longestOnes(int[] nums, int k) {
        int left = 0, zeros = 0, best = 0;
        for (int right = 0; right < nums.length; right++) {
            if (nums[right] == 0) zeros++;
            while (zeros > k)
                if (nums[left++] == 0) zeros--;
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}`);
addLang("java", "longest-repeating-character-replacement", String.raw`class Solution {
    public int characterReplacement(String s, int k) {
        int[] count = new int[26];
        int l = 0, best = 0, maxf = 0;
        for (int r = 0; r < s.length(); r++) {
            maxf = Math.max(maxf, ++count[s.charAt(r) - 'A']);
            while ((r - l + 1) - maxf > k) count[s.charAt(l++) - 'A']--;
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
}`);
addLang("java", "permutation-in-string", String.raw`class Solution {
    public boolean checkInclusion(String s1, String s2) {
        int k = s1.length();
        if (k > s2.length()) return false;
        int[] need = new int[26], window = new int[26];
        for (int i = 0; i < k; i++) {
            need[s1.charAt(i) - 'a']++;
            window[s2.charAt(i) - 'a']++;
        }
        if (Arrays.equals(need, window)) return true;
        for (int i = k; i < s2.length(); i++) {
            window[s2.charAt(i) - 'a']++;
            window[s2.charAt(i - k) - 'a']--;
            if (Arrays.equals(need, window)) return true;
        }
        return false;
    }
}`);
addLang("java", "minimum-window-substring", String.raw`class Solution {
    public String minWindow(String s, String t) {
        int[] need = new int[128];
        for (char c : t.toCharArray()) need[c]++;
        int missing = t.length(), l = 0, bestLen = Integer.MAX_VALUE, bestStart = 0;
        for (int r = 0; r < s.length(); r++) {
            if (need[s.charAt(r)]-- > 0) missing--;
            while (missing == 0) {   // the window holds all of t: shrink from the left
                if (r - l + 1 < bestLen) { bestLen = r - l + 1; bestStart = l; }
                if (++need[s.charAt(l++)] > 0) missing++;
            }
        }
        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
    }
}`);
addLang("java", "sliding-window-maximum", String.raw`class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        Deque<Integer> dq = new ArrayDeque<>();   // indexes, values decreasing from the front
        int[] res = new int[nums.length - k + 1];
        for (int i = 0; i < nums.length; i++) {
            while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();
            dq.addLast(i);
            if (dq.peekFirst() <= i - k) dq.pollFirst();
            if (i >= k - 1) res[i - k + 1] = nums[dq.peekFirst()];
        }
        return res;
    }
}`);
addLang("java", "max-consecutive-ones", String.raw`class Solution {
    public int findMaxConsecutiveOnes(int[] nums) {
        int best = 0, cur = 0;
        for (int x : nums) {
            cur = x == 1 ? cur + 1 : 0;
            best = Math.max(best, cur);
        }
        return best;
    }
}`);
addLang("java", "minimum-size-subarray-sum", String.raw`class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int left = 0, total = 0, best = Integer.MAX_VALUE;
        for (int right = 0; right < nums.length; right++) {
            total += nums[right];
            while (total >= target) {
                best = Math.min(best, right - left + 1);
                total -= nums[left++];
            }
        }
        return best == Integer.MAX_VALUE ? 0 : best;
    }
}`);
addLang("java", "fruit-into-baskets", String.raw`class Solution {
    public int totalFruit(int[] fruits) {
        Map<Integer, Integer> count = new HashMap<>();
        int left = 0, best = 0;
        for (int right = 0; right < fruits.length; right++) {
            count.merge(fruits[right], 1, Integer::sum);
            while (count.size() > 2) {   // more than two kinds: shrink from the left
                int f = fruits[left++];
                if (count.merge(f, -1, Integer::sum) == 0) count.remove(f);
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}`);
addLang("java", "contains-duplicate-ii", String.raw`class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        Map<Integer, Integer> last = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            Integer j = last.put(nums[i], i);   // put returns the previous index, if any
            if (j != null && i - j <= k) return true;
        }
        return false;
    }
}`);
addLang("java", "find-all-anagrams-in-a-string", String.raw`class Solution {
    public List<Integer> findAnagrams(String s, String p) {
        List<Integer> res = new ArrayList<>();
        int m = p.length();
        int[] need = new int[26], win = new int[26];
        for (char c : p.toCharArray()) need[c - 'a']++;
        for (int i = 0; i < s.length(); i++) {
            win[s.charAt(i) - 'a']++;
            if (i >= m) win[s.charAt(i - m) - 'a']--;
            if (Arrays.equals(win, need)) res.add(i - m + 1);
        }
        return res;
    }
}`);
addLang("java", "subarray-product-less-than-k", String.raw`class Solution {
    public int numSubarrayProductLessThanK(int[] nums, int k) {
        if (k <= 1) return 0;
        int prod = 1, left = 0, res = 0;
        for (int right = 0; right < nums.length; right++) {
            prod *= nums[right];
            while (prod >= k) prod /= nums[left++];
            res += right - left + 1;   // every subarray ending at right that starts in [left, right]
        }
        return res;
    }
}`);
addLang("java", "maximum-length-substring-with-two-occurrences", String.raw`class Solution {
    public int maximumLengthSubstring(String s) {
        int[] count = new int[26];
        int left = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            int c = s.charAt(right) - 'a';
            count[c]++;
            while (count[c] > 2) count[s.charAt(left++) - 'a']--;
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}`);
addLang("java", "valid-parentheses", String.raw`class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char ch : s.toCharArray()) {
            if (ch == '(') stack.push(')');   // push the closer we expect
            else if (ch == '[') stack.push(']');
            else if (ch == '{') stack.push('}');
            else if (stack.isEmpty() || stack.pop() != ch) return false;
        }
        return stack.isEmpty();
    }
}`);
addLang("java", "min-stack", String.raw`class MinStack {
    // each entry stores { value, minimum of the stack up to and including it }
    private final Deque<int[]> st = new ArrayDeque<>();

    public void push(int val) {
        int m = st.isEmpty() ? val : Math.min(val, st.peek()[1]);
        st.push(new int[] { val, m });
    }

    public void pop() {
        st.pop();
    }

    public int top() {
        return st.peek()[0];
    }

    public int getMin() {
        return st.peek()[1];
    }
}`);

addLang("java", "daily-temperatures", String.raw`class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int[] res = new int[temperatures.length];
        Deque<Integer> st = new ArrayDeque<>();   // indexes still waiting for a warmer day
        for (int i = 0; i < temperatures.length; i++) {
            while (!st.isEmpty() && temperatures[st.peek()] < temperatures[i]) {
                int j = st.pop();
                res[j] = i - j;
            }
            st.push(i);
        }
        return res;
    }
}`);
addLang("java", "evaluate-reverse-polish-notation", String.raw`class Solution {
    public int evalRPN(String[] tokens) {
        Deque<Integer> st = new ArrayDeque<>();
        for (String tok : tokens) {
            switch (tok) {
                case "+" -> st.push(st.pop() + st.pop());
                case "-" -> { int b = st.pop(), a = st.pop(); st.push(a - b); }
                case "*" -> st.push(st.pop() * st.pop());
                case "/" -> { int b = st.pop(), a = st.pop(); st.push(a / b); }   // Java's / truncates toward zero
                default -> st.push(Integer.parseInt(tok));
            }
        }
        return st.pop();
    }
}`);
addLang("java", "car-fleet", String.raw`class Solution {
    public int carFleet(int target, int[] position, int[] speed) {
        int n = position.length;
        Integer[] order = new Integer[n];
        for (int i = 0; i < n; i++) order[i] = i;
        Arrays.sort(order, (a, b) -> position[b] - position[a]);   // closest to the target first
        int fleets = 0;
        double last = 0;
        for (int i : order) {
            double t = (double) (target - position[i]) / speed[i];
            if (t > last) {   // can't catch the fleet ahead: a new fleet
                fleets++;
                last = t;
            }
        }
        return fleets;
    }
}`);
addLang("java", "largest-rectangle-in-histogram", String.raw`class Solution {
    public int largestRectangleArea(int[] heights) {
        Deque<int[]> st = new ArrayDeque<>();   // { start index, height }, heights increasing
        int best = 0, n = heights.length;
        for (int i = 0; i <= n; i++) {
            int h = i == n ? 0 : heights[i], start = i;
            while (!st.isEmpty() && st.peek()[1] > h) {
                int[] top = st.pop();
                best = Math.max(best, top[1] * (i - top[0]));
                start = top[0];
            }
            st.push(new int[] { start, h });
        }
        return best;
    }
}`);
addLang("java", "next-greater-element-i", String.raw`class Solution {
    public int[] nextGreaterElement(int[] nums1, int[] nums2) {
        Map<Integer, Integer> nxt = new HashMap<>();
        Deque<Integer> stack = new ArrayDeque<>();
        for (int x : nums2) {
            while (!stack.isEmpty() && stack.peek() < x) nxt.put(stack.pop(), x);
            stack.push(x);
        }
        int[] res = new int[nums1.length];
        for (int i = 0; i < nums1.length; i++) res[i] = nxt.getOrDefault(nums1[i], -1);
        return res;
    }
}`);
addLang("java", "decode-string", String.raw`class Solution {
    public String decodeString(String s) {
        Deque<StringBuilder> strs = new ArrayDeque<>();
        Deque<Integer> counts = new ArrayDeque<>();
        StringBuilder cur = new StringBuilder();
        int num = 0;
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) num = num * 10 + (c - '0');
            else if (c == '[') {
                strs.push(cur);
                counts.push(num);
                cur = new StringBuilder();
                num = 0;
            } else if (c == ']') {
                StringBuilder prev = strs.pop();
                prev.append(cur.toString().repeat(counts.pop()));
                cur = prev;
            } else cur.append(c);
        }
        return cur.toString();
    }
}`);
addLang("java", "next-greater-element-ii", String.raw`class Solution {
    public int[] nextGreaterElements(int[] nums) {
        int n = nums.length;
        int[] res = new int[n];
        Arrays.fill(res, -1);
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i < 2 * n; i++) {   // go round twice to wrap around
            int x = nums[i % n];
            while (!stack.isEmpty() && nums[stack.peek()] < x) res[stack.pop()] = x;
            if (i < n) stack.push(i);
        }
        return res;
    }
}`);
addLang("java", "longest-valid-parentheses", String.raw`class Solution {
    public int longestValidParentheses(String s) {
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(-1);   // index just before the current valid run
        int best = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '(') stack.push(i);
            else {
                stack.pop();
                if (stack.isEmpty()) stack.push(i);
                else best = Math.max(best, i - stack.peek());
            }
        }
        return best;
    }
}`);
addLang("java", "asteroid-collision", String.raw`class Solution {
    public int[] asteroidCollision(int[] asteroids) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (int a : asteroids) {
            boolean alive = true;
            while (alive && a < 0 && !stack.isEmpty() && stack.peekLast() > 0) {
                if (stack.peekLast() < -a) { stack.pollLast(); continue; }
                if (stack.peekLast() == -a) stack.pollLast();
                alive = false;
            }
            if (alive) stack.addLast(a);
        }
        return stack.stream().mapToInt(Integer::intValue).toArray();
    }
}`);
addLang("java", "basic-calculator", String.raw`class Solution {
    public int calculate(String s) {
        int res = 0, num = 0, sign = 1;
        Deque<int[]> stack = new ArrayDeque<>();   // { result before the bracket, sign before it }
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) num = num * 10 + (c - '0');
            else if (c == '+' || c == '-') {
                res += sign * num;
                num = 0;
                sign = c == '+' ? 1 : -1;
            } else if (c == '(') {
                stack.push(new int[] { res, sign });
                res = 0;
                sign = 1;
            } else if (c == ')') {
                res += sign * num;
                num = 0;
                int[] prev = stack.pop();
                res = prev[0] + prev[1] * res;
            }
        }
        return res + sign * num;
    }
}`);
addLang("java", "remove-all-adjacent-duplicates-in-string", String.raw`class Solution {
    public String removeDuplicates(String s) {
        StringBuilder stack = new StringBuilder();
        for (char c : s.toCharArray()) {
            int n = stack.length();
            if (n > 0 && stack.charAt(n - 1) == c) stack.deleteCharAt(n - 1);
            else stack.append(c);
        }
        return stack.toString();
    }
}`);
addLang("java", "simplify-path", String.raw`class Solution {
    public String simplifyPath(String path) {
        Deque<String> stack = new ArrayDeque<>();
        for (String part : path.split("/")) {
            if (part.equals("..")) stack.pollLast();
            else if (!part.isEmpty() && !part.equals(".")) stack.addLast(part);
        }
        return "/" + String.join("/", stack);
    }
}`);
addLang("java", "online-stock-span", String.raw`class StockSpanner {
    private final Deque<int[]> stack = new ArrayDeque<>();   // { price, span }, prices decreasing

    public int next(int price) {
        int span = 1;
        while (!stack.isEmpty() && stack.peek()[0] <= price) span += stack.pop()[1];
        stack.push(new int[] { price, span });
        return span;
    }
}`);
addLang("java", "basic-calculator-ii", String.raw`class Solution {
    public int calculate(String s) {
        Deque<Integer> stack = new ArrayDeque<>();
        int num = 0;
        char op = '+';
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (Character.isDigit(c)) num = num * 10 + (c - '0');
            if ("+-*/".indexOf(c) >= 0 || i == s.length() - 1) {
                switch (op) {   // apply the previous operator to num
                    case '+' -> stack.push(num);
                    case '-' -> stack.push(-num);
                    case '*' -> stack.push(stack.pop() * num);
                    default -> stack.push(stack.pop() / num);
                }
                op = c;
                num = 0;
            }
        }
        int sum = 0;
        for (int x : stack) sum += x;
        return sum;
    }
}`);
addLang("java", "remove-k-digits", String.raw`class Solution {
    public String removeKdigits(String num, int k) {
        StringBuilder stack = new StringBuilder();   // digits kept, non-decreasing
        for (char d : num.toCharArray()) {
            while (k > 0 && stack.length() > 0 && stack.charAt(stack.length() - 1) > d) {
                stack.deleteCharAt(stack.length() - 1);
                k--;
            }
            stack.append(d);
        }
        stack.setLength(stack.length() - k);
        int i = 0;
        while (i < stack.length() && stack.charAt(i) == '0') i++;   // strip leading zeros
        return i == stack.length() ? "0" : stack.substring(i);
    }
}`);
addLang("java", "sum-of-subarray-minimums", String.raw`class Solution {
    public int sumSubarrayMins(int[] arr) {
        int n = arr.length, MOD = 1_000_000_007;
        int[] left = new int[n], right = new int[n];   // how far each element is the minimum
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && arr[stack.peek()] > arr[i]) stack.pop();
            left[i] = stack.isEmpty() ? i + 1 : i - stack.peek();
            stack.push(i);
        }
        stack.clear();
        for (int i = n - 1; i >= 0; i--) {
            while (!stack.isEmpty() && arr[stack.peek()] >= arr[i]) stack.pop();
            right[i] = stack.isEmpty() ? n - i : stack.peek() - i;
            stack.push(i);
        }
        long sum = 0;
        for (int i = 0; i < n; i++) sum = (sum + (long) arr[i] * left[i] * right[i]) % MOD;
        return (int) sum;
    }
}`);
addLang("java", "stack-samples-to-trace", String.raw`class Solution {
    // Each sample is [timestamp, [function names, outermost first]]; each event is [type, timestamp, name].
    @SuppressWarnings("unchecked")
    public List<List<Object>> samplesToEvents(List<List<Object>> samples) {
        List<List<Object>> events = new ArrayList<>();
        List<String> prev = new ArrayList<>();
        for (List<Object> sample : samples) {
            int ts = (Integer) sample.get(0);
            List<String> stack = (List<String>) sample.get(1);
            int c = 0;   // length of the shared prefix: those calls are still running
            while (c < prev.size() && c < stack.size() && prev.get(c).equals(stack.get(c))) c++;
            for (int i = prev.size() - 1; i >= c; i--) events.add(List.of("E", ts, prev.get(i)));
            for (int i = c; i < stack.size(); i++) events.add(List.of("B", ts, stack.get(i)));
            prev = stack;
        }
        if (!samples.isEmpty()) {
            int last = (Integer) samples.get(samples.size() - 1).get(0);
            for (int i = prev.size() - 1; i >= 0; i--) events.add(List.of("E", last, prev.get(i)));
        }
        return events;
    }
}`);
addLang("java", "binary-search", String.raw`class Solution {
    public int search(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        while (l <= r) {
            int m = l + (r - l) / 2;
            if (nums[m] == target) return m;
            if (nums[m] < target) l = m + 1;
            else r = m - 1;
        }
        return -1;
    }
}`);
addLang("java", "search-insert-position", String.raw`class Solution {
    public int searchInsert(int[] nums, int target) {
        int lo = 0, hi = nums.length;   // first index with nums[i] >= target
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
}`);
addLang("java", "find-first-and-last-position-of-element-in-sorted-array", String.raw`class Solution {
    public int[] searchRange(int[] nums, int target) {
        int first = lower(nums, target);
        if (first == nums.length || nums[first] != target) return new int[] { -1, -1 };
        return new int[] { first, lower(nums, target + 1) - 1 };
    }

    private int lower(int[] nums, int x) {   // first index with nums[i] >= x
        int lo = 0, hi = nums.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] < x) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
}`);

addLang("java", "find-peak-element", String.raw`class Solution {
    public int findPeakElement(int[] nums) {
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] < nums[mid + 1]) lo = mid + 1;   // uphill to the right: a peak is there
            else hi = mid;
        }
        return lo;
    }
}`);
addLang("java", "search-a-2d-matrix", String.raw`class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int rows = matrix.length, cols = matrix[0].length;
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
addLang("java", "koko-eating-bananas", String.raw`class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        int l = 1, r = 0;
        for (int p : piles) r = Math.max(r, p);
        while (l < r) {
            int k = l + (r - l) / 2;
            long hours = 0;   // long: the total can pass 2^31
            for (int p : piles) hours += (p + k - 1) / k;   // ceil(p / k)
            if (hours <= h) r = k;
            else l = k + 1;
        }
        return l;
    }
}`);
addLang("java", "find-minimum-in-rotated-sorted-array", String.raw`class Solution {
    public int findMin(int[] nums) {
        int l = 0, r = nums.length - 1;
        while (l < r) {
            int m = l + (r - l) / 2;
            if (nums[m] > nums[r]) l = m + 1;   // the drop is to the right of m
            else r = m;
        }
        return nums[l];
    }
}`);
addLang("java", "search-in-rotated-sorted-array", String.raw`class Solution {
    public int search(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
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
addLang("java", "time-based-key-value-store", String.raw`class TimeMap {
    // per key: timestamp -> value; floorEntry finds the latest one at or before a time
    private final Map<String, TreeMap<Integer, String>> map = new HashMap<>();

    public void set(String key, String value, int timestamp) {
        map.computeIfAbsent(key, k -> new TreeMap<>()).put(timestamp, value);
    }

    public String get(String key, int timestamp) {
        TreeMap<Integer, String> t = map.get(key);
        if (t == null) return "";
        Map.Entry<Integer, String> e = t.floorEntry(timestamp);
        return e == null ? "" : e.getValue();
    }
}`);
addLang("java", "median-of-two-sorted-arrays", String.raw`class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        int[] a = nums1, b = nums2;
        if (a.length > b.length) { a = nums2; b = nums1; }   // binary search the shorter array
        int total = a.length + b.length, half = (total + 1) / 2;
        int l = 0, r = a.length;
        while (true) {
            int i = (l + r) / 2, j = half - i;   // take i from a and j from b for the left half
            double aL = i > 0 ? a[i - 1] : Double.NEGATIVE_INFINITY;
            double aR = i < a.length ? a[i] : Double.POSITIVE_INFINITY;
            double bL = j > 0 ? b[j - 1] : Double.NEGATIVE_INFINITY;
            double bR = j < b.length ? b[j] : Double.POSITIVE_INFINITY;
            if (aL <= bR && bL <= aR)
                return total % 2 == 1 ? Math.max(aL, bL) : (Math.max(aL, bL) + Math.min(aR, bR)) / 2;
            if (aL > bR) r = i - 1;
            else l = i + 1;
        }
    }
}`);
addLang("java", "sqrtx", String.raw`class Solution {
    public int mySqrt(int x) {
        long lo = 0, hi = x;   // long: mid * mid overflows an int
        while (lo < hi) {
            long mid = (lo + hi + 1) / 2;
            if (mid * mid <= x) lo = mid;
            else hi = mid - 1;
        }
        return (int) lo;
    }
}`);
addLang("java", "kth-missing-positive-number", String.raw`class Solution {
    public int findKthPositive(int[] arr, int k) {
        int lo = 0, hi = arr.length;   // arr[i] - (i + 1) numbers are missing before arr[i]
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (arr[mid] - (mid + 1) < k) lo = mid + 1;
            else hi = mid;
        }
        return lo + k;
    }
}`);
addLang("java", "single-element-in-a-sorted-array", String.raw`class Solution {
    public int singleNonDuplicate(int[] nums) {
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (mid % 2 == 1) mid--;   // pairs start at even indexes before the single one
            if (nums[mid] == nums[mid + 1]) lo = mid + 2;
            else hi = mid;
        }
        return nums[lo];
    }
}`);
addLang("java", "random-pick-with-weight", String.raw`class Solution {
    private final int[] prefix;   // prefix[i] = w[0] + ... + w[i]
    private final Random rand = new Random();

    public Solution(int[] w) {
        prefix = new int[w.length];
        int total = 0;
        for (int i = 0; i < w.length; i++) prefix[i] = total += w[i];
    }

    public int pickIndex() {
        int r = rand.nextInt(prefix[prefix.length - 1]) + 1;   // 1..total
        int lo = 0, hi = prefix.length - 1;   // first prefix >= r
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (prefix[mid] < r) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
}`);
addLang("java", "search-a-2d-matrix-ii", String.raw`class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int r = 0, c = matrix[0].length - 1;   // start top-right: left is smaller, down is bigger
        while (r < matrix.length && c >= 0) {
            int v = matrix[r][c];
            if (v == target) return true;
            if (v > target) c--;
            else r++;
        }
        return false;
    }
}`);
addLang("java", "capacity-to-ship-packages-within-d-days", String.raw`class Solution {
    public int shipWithinDays(int[] weights, int days) {
        int lo = 0, hi = 0;
        for (int w : weights) { lo = Math.max(lo, w); hi += w; }
        while (lo < hi) {   // smallest capacity that fits in the days
            int mid = lo + (hi - lo) / 2;
            if (daysNeeded(weights, mid) <= days) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }

    private int daysNeeded(int[] weights, int cap) {
        int d = 1, load = 0;
        for (int w : weights) {
            if (load + w > cap) { d++; load = 0; }
            load += w;
        }
        return d;
    }
}`);
addLang("java", "split-array-largest-sum", String.raw`class Solution {
    public int splitArray(int[] nums, int k) {
        int lo = 0, hi = 0;
        for (int x : nums) { lo = Math.max(lo, x); hi += x; }
        while (lo < hi) {   // smallest largest-sum that needs at most k parts
            int mid = lo + (hi - lo) / 2;
            if (parts(nums, mid) <= k) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }

    private int parts(int[] nums, int limit) {
        int count = 1, cur = 0;
        for (int x : nums) {
            if (cur + x > limit) { count++; cur = 0; }
            cur += x;
        }
        return count;
    }
}`);
addLang("java", "snapshot-array", String.raw`class SnapshotArray {
    // per index: snap id -> value set during that snap; floorEntry finds the value at a snap
    private final List<TreeMap<Integer, Integer>> hist = new ArrayList<>();
    private int snapId = 0;

    public SnapshotArray(int length) {
        for (int i = 0; i < length; i++) {
            TreeMap<Integer, Integer> h = new TreeMap<>();
            h.put(-1, 0);
            hist.add(h);
        }
    }

    public void set(int index, int val) {
        hist.get(index).put(snapId, val);
    }

    public int snap() {
        return snapId++;
    }

    public int get(int index, int snap_id) {
        return hist.get(index).floorEntry(snap_id).getValue();
    }
}`);
addLang("java", "reverse-linked-list", String.raw`class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        while (head != null) {
            ListNode next = head.next;
            head.next = prev;
            prev = head;
            head = next;
        }
        return prev;
    }
}`);
addLang("java", "middle-of-the-linked-list", String.raw`class Solution {
    public ListNode middleNode(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }
}`);
addLang("java", "reorder-list", String.raw`class Solution {
    public void reorderList(ListNode head) {
        ListNode slow = head, fast = head.next;   // 1. find the middle
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode second = slow.next, prev = null;   // 2. reverse the second half
        slow.next = null;
        while (second != null) {
            ListNode next = second.next;
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
addLang("java", "remove-nth-node-from-end-of-list", String.raw`class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head), lead = dummy, trail = dummy;
        for (int i = 0; i < n; i++) lead = lead.next;   // lead runs n nodes ahead
        while (lead.next != null) {
            lead = lead.next;
            trail = trail.next;
        }
        trail.next = trail.next.next;
        return dummy.next;
    }
}`);
addLang("java", "add-two-numbers", String.raw`class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(), tail = dummy;
        int carry = 0;
        while (l1 != null || l2 != null || carry != 0) {
            int s = carry + (l1 != null ? l1.val : 0) + (l2 != null ? l2.val : 0);
            carry = s / 10;
            tail.next = new ListNode(s % 10);
            tail = tail.next;
            if (l1 != null) l1 = l1.next;
            if (l2 != null) l2 = l2.next;
        }
        return dummy.next;
    }
}`);

addLang("java", "palindrome-linked-list", String.raw`class Solution {
    public boolean isPalindrome(ListNode head) {
        ListNode slow = head, fast = head;   // find the middle
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode prev = null;   // reverse the second half
        while (slow != null) {
            ListNode next = slow.next;
            slow.next = prev;
            prev = slow;
            slow = next;
        }
        for (ListNode a = head, b = prev; b != null; a = a.next, b = b.next)
            if (a.val != b.val) return false;
        return true;
    }
}`);
addLang("java", "find-the-duplicate-number", String.raw`class Solution {
    public int findDuplicate(int[] nums) {
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
addLang("java", "rotate-list", String.raw`class Solution {
    public ListNode rotateRight(ListNode head, int k) {
        if (head == null || head.next == null) return head;
        int n = 1;
        ListNode tail = head;
        while (tail.next != null) { tail = tail.next; n++; }
        k %= n;
        if (k == 0) return head;
        tail.next = head;   // make a ring, then cut it n - k nodes in
        ListNode newTail = head;
        for (int i = 0; i < n - k - 1; i++) newTail = newTail.next;
        ListNode newHead = newTail.next;
        newTail.next = null;
        return newHead;
    }
}`);
addLang("java", "sort-list", String.raw`class Solution {
    public ListNode sortList(ListNode head) {   // merge sort
        if (head == null || head.next == null) return head;
        ListNode slow = head, fast = head.next;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode mid = slow.next;
        slow.next = null;
        ListNode a = sortList(head), b = sortList(mid);
        ListNode dummy = new ListNode(), tail = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { tail.next = a; a = a.next; }
            else { tail.next = b; b = b.next; }
            tail = tail.next;
        }
        tail.next = a != null ? a : b;
        return dummy.next;
    }
}`);
addLang("java", "reverse-nodes-in-k-group", String.raw`class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0, head), groupPrev = dummy;
        while (true) {
            ListNode kth = groupPrev;
            for (int i = 0; i < k; i++) {
                kth = kth.next;
                if (kth == null) return dummy.next;   // fewer than k left: done
            }
            ListNode groupNext = kth.next, prev = groupNext, cur = groupPrev.next;
            while (cur != groupNext) {   // reverse the group
                ListNode next = cur.next;
                cur.next = prev;
                prev = cur;
                cur = next;
            }
            ListNode first = groupPrev.next;
            groupPrev.next = kth;
            groupPrev = first;
        }
    }
}`);
addLang("java", "remove-duplicates-from-sorted-list", String.raw`class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        ListNode cur = head;
        while (cur != null && cur.next != null) {
            if (cur.next.val == cur.val) cur.next = cur.next.next;
            else cur = cur.next;
        }
        return head;
    }
}`);
addLang("java", "odd-even-linked-list", String.raw`class Solution {
    public ListNode oddEvenList(ListNode head) {
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
addLang("java", "linked-list-cycle-ii", String.raw`public class Solution {
    public ListNode detectCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {   // they met inside the cycle
                ListNode p = head;
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
addLang("java", "swap-nodes-in-pairs", String.raw`class Solution {
    public ListNode swapPairs(ListNode head) {
        ListNode dummy = new ListNode(0, head), prev = dummy;
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
addLang("java", "maximum-depth-of-binary-tree", String.raw`class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}`);
addLang("java", "same-tree", String.raw`class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) return true;
        if (p == null || q == null || p.val != q.val) return false;
        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
}`);
addLang("java", "diameter-of-binary-tree", String.raw`class Solution {
    private int best = 0;

    public int diameterOfBinaryTree(TreeNode root) {
        depth(root);
        return best;
    }

    private int depth(TreeNode node) {
        if (node == null) return 0;
        int l = depth(node.left), r = depth(node.right);
        best = Math.max(best, l + r);   // longest path through this node
        return 1 + Math.max(l, r);
    }
}`);
addLang("java", "balanced-binary-tree", String.raw`class Solution {
    public boolean isBalanced(TreeNode root) {
        return height(root) != -1;
    }

    private int height(TreeNode node) {   // -1 means "not balanced"
        if (node == null) return 0;
        int l = height(node.left), r = height(node.right);
        if (l == -1 || r == -1 || Math.abs(l - r) > 1) return -1;
        return 1 + Math.max(l, r);
    }
}`);
addLang("java", "subtree-of-another-tree", String.raw`class Solution {
    public boolean isSubtree(TreeNode root, TreeNode subRoot) {
        if (root == null) return false;
        return same(root, subRoot) || isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
    }

    private boolean same(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null || a.val != b.val) return false;
        return same(a.left, b.left) && same(a.right, b.right);
    }
}`);
addLang("java", "binary-tree-level-order-traversal", String.raw`class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        Deque<TreeNode> q = new ArrayDeque<>();
        if (root != null) q.add(root);
        while (!q.isEmpty()) {
            List<Integer> level = new ArrayList<>();
            for (int i = q.size(); i > 0; i--) {   // exactly the nodes of this level
                TreeNode node = q.poll();
                level.add(node.val);
                if (node.left != null) q.add(node.left);
                if (node.right != null) q.add(node.right);
            }
            res.add(level);
        }
        return res;
    }
}`);
addLang("java", "validate-binary-search-tree", String.raw`class Solution {
    public boolean isValidBST(TreeNode root) {
        return ok(root, Long.MIN_VALUE, Long.MAX_VALUE);   // long: values can be Integer.MIN/MAX_VALUE
    }

    private boolean ok(TreeNode node, long lo, long hi) {
        if (node == null) return true;
        if (node.val <= lo || node.val >= hi) return false;
        return ok(node.left, lo, node.val) && ok(node.right, node.val, hi);
    }
}`);
addLang("java", "binary-tree-right-side-view", String.raw`class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        Deque<TreeNode> q = new ArrayDeque<>();
        if (root != null) q.add(root);
        while (!q.isEmpty()) {
            res.add(q.peekLast().val);   // the last node of each level
            for (int i = q.size(); i > 0; i--) {
                TreeNode node = q.poll();
                if (node.left != null) q.add(node.left);
                if (node.right != null) q.add(node.right);
            }
        }
        return res;
    }
}`);
addLang("java", "kth-smallest-element-in-a-bst", String.raw`class Solution {
    public int kthSmallest(TreeNode root, int k) {
        Deque<TreeNode> st = new ArrayDeque<>();   // iterative in-order traversal
        TreeNode cur = root;
        while (true) {
            while (cur != null) {
                st.push(cur);
                cur = cur.left;
            }
            cur = st.pop();
            if (--k == 0) return cur.val;
            cur = cur.right;
        }
    }
}`);
addLang("java", "count-good-nodes-in-binary-tree", String.raw`class Solution {
    public int goodNodes(TreeNode root) {
        return dfs(root, Integer.MIN_VALUE);
    }

    private int dfs(TreeNode node, int mx) {   // mx = largest value on the path from the root
        if (node == null) return 0;
        int good = node.val >= mx ? 1 : 0;
        mx = Math.max(mx, node.val);
        return good + dfs(node.left, mx) + dfs(node.right, mx);
    }
}`);
addLang("java", "construct-binary-tree-from-preorder-and-inorder-traversal", String.raw`class Solution {
    private final Map<Integer, Integer> idx = new HashMap<>();   // value -> position in inorder
    private int next = 0;   // next root in preorder
    private int[] preorder;

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        this.preorder = preorder;
        for (int i = 0; i < inorder.length; i++) idx.put(inorder[i], i);
        return build(0, inorder.length - 1);
    }

    private TreeNode build(int lo, int hi) {
        if (lo > hi) return null;
        TreeNode root = new TreeNode(preorder[next++]);
        int m = idx.get(root.val);
        root.left = build(lo, m - 1);
        root.right = build(m + 1, hi);
        return root;
    }
}`);

addLang("java", "binary-tree-maximum-path-sum", String.raw`class Solution {
    private int best = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        gain(root);
        return best;
    }

    private int gain(TreeNode node) {   // best downward path starting at node
        if (node == null) return 0;
        int l = Math.max(gain(node.left), 0), r = Math.max(gain(node.right), 0);   // drop negative branches
        best = Math.max(best, node.val + l + r);   // a path that bends at node
        return node.val + Math.max(l, r);
    }
}`);
addLang("java", "lowest-common-ancestor-of-a-binary-tree", String.raw`class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) return root;   // p and q are on different sides
        return left != null ? left : right;
    }
}`);
addLang("java", "binary-tree-inorder-traversal", String.raw`class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode node = root;
        while (!stack.isEmpty() || node != null) {
            while (node != null) {   // go as far left as possible
                stack.push(node);
                node = node.left;
            }
            node = stack.pop();
            res.add(node.val);
            node = node.right;
        }
        return res;
    }
}`);
addLang("java", "symmetric-tree", String.raw`class Solution {
    public boolean isSymmetric(TreeNode root) {
        return mirror(root.left, root.right);
    }

    private boolean mirror(TreeNode a, TreeNode b) {
        if (a == null || b == null) return a == b;
        return a.val == b.val && mirror(a.left, b.right) && mirror(a.right, b.left);
    }
}`);
addLang("java", "all-nodes-distance-k-in-binary-tree", String.raw`class Solution {
    public List<Integer> distanceK(TreeNode root, TreeNode target, int k) {
        Map<TreeNode, TreeNode> parent = new HashMap<>();   // so we can walk up as well as down
        Deque<TreeNode> stack = new ArrayDeque<>(List.of(root));
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            for (TreeNode child : new TreeNode[] { node.left, node.right })
                if (child != null) {
                    parent.put(child, node);
                    stack.push(child);
                }
        }
        Set<TreeNode> seen = new HashSet<>(List.of(target));
        Deque<TreeNode> q = new ArrayDeque<>(List.of(target));
        for (int d = 0; d < k; d++)   // BFS k steps out from the target
            for (int i = q.size(); i > 0; i--) {
                TreeNode node = q.poll();
                for (TreeNode nxt : new TreeNode[] { node.left, node.right, parent.get(node) })
                    if (nxt != null && seen.add(nxt)) q.add(nxt);
            }
        List<Integer> res = new ArrayList<>();
        for (TreeNode node : q) res.add(node.val);
        return res;
    }
}`);
addLang("java", "convert-sorted-array-to-binary-search-tree", String.raw`class Solution {
    public TreeNode sortedArrayToBST(int[] nums) {
        return build(nums, 0, nums.length - 1);
    }

    private TreeNode build(int[] nums, int lo, int hi) {   // the middle value becomes the root
        if (lo > hi) return null;
        int mid = (lo + hi) / 2;
        return new TreeNode(nums[mid], build(nums, lo, mid - 1), build(nums, mid + 1, hi));
    }
}`);
addLang("java", "binary-tree-zigzag-level-order-traversal", String.raw`class Solution {
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Deque<TreeNode> q = new ArrayDeque<>(List.of(root));
        while (!q.isEmpty()) {
            LinkedList<Integer> level = new LinkedList<>();
            boolean leftToRight = res.size() % 2 == 0;
            for (int i = q.size(); i > 0; i--) {
                TreeNode node = q.poll();
                if (leftToRight) level.addLast(node.val);
                else level.addFirst(node.val);
                if (node.left != null) q.add(node.left);
                if (node.right != null) q.add(node.right);
            }
            res.add(level);
        }
        return res;
    }
}`);
addLang("java", "vertical-order-traversal-of-a-binary-tree", String.raw`class Solution {
    private final List<int[]> cells = new ArrayList<>();   // { col, row, val }

    public List<List<Integer>> verticalTraversal(TreeNode root) {
        dfs(root, 0, 0);
        cells.sort((a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] != b[1] ? a[1] - b[1] : a[2] - b[2]);
        List<List<Integer>> res = new ArrayList<>();
        Integer last = null;
        for (int[] c : cells) {
            if (last == null || c[0] != last) {
                res.add(new ArrayList<>());
                last = c[0];
            }
            res.get(res.size() - 1).add(c[2]);
        }
        return res;
    }

    private void dfs(TreeNode node, int row, int col) {
        if (node == null) return;
        cells.add(new int[] { col, row, node.val });
        dfs(node.left, row + 1, col - 1);
        dfs(node.right, row + 1, col + 1);
    }
}`);
addLang("java", "range-sum-of-bst", String.raw`class Solution {
    public int rangeSumBST(TreeNode root, int low, int high) {
        if (root == null) return 0;
        if (root.val < low) return rangeSumBST(root.right, low, high);   // the left side is all too small
        if (root.val > high) return rangeSumBST(root.left, low, high);
        return root.val + rangeSumBST(root.left, low, high) + rangeSumBST(root.right, low, high);
    }
}`);
addLang("java", "last-stone-weight", String.raw`class Solution {
    public int lastStoneWeight(int[] stones) {
        PriorityQueue<Integer> h = new PriorityQueue<>(Comparator.reverseOrder());   // max-heap
        for (int s : stones) h.add(s);
        while (h.size() > 1) {
            int a = h.poll(), b = h.poll();
            if (a != b) h.add(a - b);
        }
        return h.isEmpty() ? 0 : h.peek();
    }
}`);
addLang("java", "kth-largest-element-in-a-stream", String.raw`class KthLargest {
    private final int k;
    private final PriorityQueue<Integer> h = new PriorityQueue<>();   // min-heap of the k largest

    public KthLargest(int k, int[] nums) {
        this.k = k;
        for (int x : nums) add(x);
    }

    public int add(int val) {
        h.add(val);
        if (h.size() > k) h.poll();
        return h.peek();
    }
}`);
addLang("java", "kth-largest-element-in-an-array", String.raw`class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> h = new PriorityQueue<>();   // min-heap of the k largest so far
        for (int x : nums) {
            h.add(x);
            if (h.size() > k) h.poll();
        }
        return h.peek();
    }
}`);
addLang("java", "k-closest-points-to-origin", String.raw`class Solution {
    public int[][] kClosest(int[][] points, int k) {
        // max-heap by distance: keep the k closest, drop the farthest
        PriorityQueue<int[]> h = new PriorityQueue<>((a, b) -> Integer.compare(b[0] * b[0] + b[1] * b[1], a[0] * a[0] + a[1] * a[1]));
        for (int[] p : points) {
            h.add(p);
            if (h.size() > k) h.poll();
        }
        return h.toArray(new int[0][]);
    }
}`);
addLang("java", "task-scheduler", String.raw`class Solution {
    public int leastInterval(char[] tasks, int n) {
        int[] counts = new int[26];
        for (char t : tasks) counts[t - 'A']++;
        int mx = 0, ties = 0;
        for (int c : counts) mx = Math.max(mx, c);
        for (int c : counts) if (c == mx) ties++;
        // (mx - 1) full rounds of n + 1 slots, then one slot per task tied for the most
        return Math.max(tasks.length, (mx - 1) * (n + 1) + ties);
    }
}`);
addLang("java", "find-median-from-data-stream", String.raw`class MedianFinder {
    private final PriorityQueue<Integer> lo = new PriorityQueue<>(Comparator.reverseOrder());   // smaller half (max-heap)
    private final PriorityQueue<Integer> hi = new PriorityQueue<>();                            // larger half (min-heap)

    public void addNum(int num) {
        lo.add(num);
        hi.add(lo.poll());
        if (hi.size() > lo.size()) lo.add(hi.poll());   // lo keeps the extra one
    }

    public double findMedian() {
        if (lo.size() > hi.size()) return lo.peek();
        return (lo.peek() + (double) hi.peek()) / 2;
    }
}`);
addLang("java", "meeting-rooms-ii", String.raw`class Solution {
    public int minMeetingRooms(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        PriorityQueue<Integer> ends = new PriorityQueue<>();   // end times of rooms in use
        for (int[] m : intervals) {
            if (!ends.isEmpty() && ends.peek() <= m[0]) ends.poll();   // reuse the room that frees first
            ends.add(m[1]);
        }
        return ends.size();
    }
}`);
addLang("java", "reorganize-string", String.raw`class Solution {
    public String reorganizeString(String s) {
        int[] count = new int[26];
        for (char c : s.toCharArray()) count[c - 'a']++;
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> b[0] - a[0]);   // { count, letter }, most first
        for (int i = 0; i < 26; i++) if (count[i] > 0) heap.add(new int[] { count[i], i });
        StringBuilder out = new StringBuilder();
        int[] prev = null;   // the letter just used waits one turn
        while (!heap.isEmpty()) {
            int[] cur = heap.poll();
            out.append((char) ('a' + cur[1]));
            if (prev != null) heap.add(prev);
            cur[0]--;
            prev = cur[0] > 0 ? cur : null;
        }
        return out.length() == s.length() ? out.toString() : "";
    }
}`);
addLang("java", "sort-characters-by-frequency", String.raw`class Solution {
    public String frequencySort(String s) {
        Map<Character, Integer> count = new HashMap<>();
        for (char c : s.toCharArray()) count.merge(c, 1, Integer::sum);
        List<Character> chars = new ArrayList<>(count.keySet());
        chars.sort((a, b) -> count.get(b) - count.get(a));
        StringBuilder out = new StringBuilder();
        for (char c : chars) out.append(String.valueOf(c).repeat(count.get(c)));
        return out.toString();
    }
}`);
addLang("java", "implement-trie-prefix-tree", String.raw`class Trie {
    private static class Node {
        Node[] next = new Node[26];
        boolean end;
    }

    private final Node root = new Node();

    public void insert(String word) {
        Node node = root;
        for (char ch : word.toCharArray()) {
            if (node.next[ch - 'a'] == null) node.next[ch - 'a'] = new Node();
            node = node.next[ch - 'a'];
        }
        node.end = true;
    }

    public boolean search(String word) {
        Node node = find(word);
        return node != null && node.end;
    }

    public boolean startsWith(String prefix) {
        return find(prefix) != null;
    }

    private Node find(String s) {
        Node node = root;
        for (char ch : s.toCharArray()) {
            node = node.next[ch - 'a'];
            if (node == null) return null;
        }
        return node;
    }
}`);
addLang("java", "design-add-and-search-words-data-structure", String.raw`class WordDictionary {
    private static class Node {
        Node[] next = new Node[26];
        boolean end;
    }

    private final Node root = new Node();

    public void addWord(String word) {
        Node node = root;
        for (char ch : word.toCharArray()) {
            if (node.next[ch - 'a'] == null) node.next[ch - 'a'] = new Node();
            node = node.next[ch - 'a'];
        }
        node.end = true;
    }

    public boolean search(String word) {
        return dfs(word, 0, root);
    }

    private boolean dfs(String word, int i, Node node) {
        if (i == word.length()) return node.end;
        char ch = word.charAt(i);
        if (ch == '.') {   // try every child
            for (Node child : node.next)
                if (child != null && dfs(word, i + 1, child)) return true;
            return false;
        }
        Node child = node.next[ch - 'a'];
        return child != null && dfs(word, i + 1, child);
    }
}`);

addLang("java", "word-search-ii", String.raw`class Solution {
    private static class Node {
        Map<Character, Node> next = new HashMap<>();
        String word;   // set where a word ends
    }

    private char[][] board;
    private final List<String> found = new ArrayList<>();

    public List<String> findWords(char[][] board, String[] words) {
        this.board = board;
        Node root = new Node();
        for (String w : words) {
            Node node = root;
            for (char ch : w.toCharArray()) node = node.next.computeIfAbsent(ch, k -> new Node());
            node.word = w;
        }
        for (int r = 0; r < board.length; r++)
            for (int c = 0; c < board[0].length; c++)
                if (root.next.containsKey(board[r][c])) dfs(r, c, root);
        return found;
    }

    private void dfs(int r, int c, Node parent) {
        char ch = board[r][c];
        Node node = parent.next.get(ch);
        if (node.word != null) {   // report each word once
            found.add(node.word);
            node.word = null;
        }
        board[r][c] = '#';   // mark as used on this path
        int[][] dirs = { { 1, 0 }, { -1, 0 }, { 0, 1 }, { 0, -1 } };
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length && node.next.containsKey(board[nr][nc]))
                dfs(nr, nc, node);
        }
        board[r][c] = ch;
        if (node.next.isEmpty() && node.word == null) parent.next.remove(ch);   // prune finished branches
    }
}`);
addLang("java", "greedy-tokenizer", String.raw`class Solution {
    private static class Node {
        Map<Character, Node> next = new HashMap<>();
        int id = -1;   // token id ending here, or -1
    }

    public int[] tokenize(String text, String[] vocab) {
        Node root = new Node();
        for (int i = 0; i < vocab.length; i++) {
            Node node = root;
            for (char ch : vocab[i].toCharArray()) node = node.next.computeIfAbsent(ch, k -> new Node());
            node.id = i;
        }
        List<Integer> res = new ArrayList<>();
        int i = 0;
        while (i < text.length()) {   // longest token starting at i; -1 for one unknown character
            Node node = root;
            int best = -1, end = i + 1;
            for (int j = i; j < text.length(); j++) {
                node = node.next.get(text.charAt(j));
                if (node == null) break;
                if (node.id >= 0) { best = node.id; end = j + 1; }
            }
            res.add(best);
            i = end;
        }
        return res.stream().mapToInt(Integer::intValue).toArray();
    }
}`);
addLang("java", "subsets", String.raw`class Solution {
    private final List<List<Integer>> res = new ArrayList<>();
    private final List<Integer> path = new ArrayList<>();

    public List<List<Integer>> subsets(int[] nums) {
        dfs(nums, 0);
        return res;
    }

    private void dfs(int[] nums, int i) {   // take nums[i] or leave it
        if (i == nums.length) {
            res.add(new ArrayList<>(path));
            return;
        }
        path.add(nums[i]);
        dfs(nums, i + 1);
        path.remove(path.size() - 1);
        dfs(nums, i + 1);
    }
}`);
addLang("java", "combination-sum", String.raw`class Solution {
    private final List<List<Integer>> res = new ArrayList<>();
    private final List<Integer> path = new ArrayList<>();

    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        dfs(candidates, 0, target);
        return res;
    }

    private void dfs(int[] cands, int i, int remain) {
        if (remain == 0) {
            res.add(new ArrayList<>(path));
            return;
        }
        if (remain < 0 || i == cands.length) return;
        path.add(cands[i]);
        dfs(cands, i, remain - cands[i]);   // use cands[i] again
        path.remove(path.size() - 1);
        dfs(cands, i + 1, remain);          // or move on
    }
}`);
addLang("java", "permutations", String.raw`class Solution {
    private final List<List<Integer>> res = new ArrayList<>();
    private final List<Integer> path = new ArrayList<>();

    public List<List<Integer>> permute(int[] nums) {
        dfs(nums, new boolean[nums.length]);
        return res;
    }

    private void dfs(int[] nums, boolean[] used) {
        if (path.size() == nums.length) {
            res.add(new ArrayList<>(path));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            path.add(nums[i]);
            dfs(nums, used);
            path.remove(path.size() - 1);
            used[i] = false;
        }
    }
}`);
addLang("java", "generate-parentheses", String.raw`class Solution {
    private final List<String> res = new ArrayList<>();

    public List<String> generateParenthesis(int n) {
        dfs("", 0, 0, n);
        return res;
    }

    private void dfs(String s, int opens, int closes, int n) {
        if (s.length() == 2 * n) {
            res.add(s);
            return;
        }
        if (opens < n) dfs(s + "(", opens + 1, closes, n);
        if (closes < opens) dfs(s + ")", opens, closes + 1, n);   // only close what's open
    }
}`);
addLang("java", "word-search", String.raw`class Solution {
    public boolean exist(char[][] board, String word) {
        for (int r = 0; r < board.length; r++)
            for (int c = 0; c < board[0].length; c++)
                if (dfs(board, word, r, c, 0)) return true;
        return false;
    }

    private boolean dfs(char[][] board, String word, int r, int c, int i) {
        if (i == word.length()) return true;
        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length || board[r][c] != word.charAt(i)) return false;
        char tmp = board[r][c];
        board[r][c] = '#';   // don't reuse this cell on the current path
        boolean ok = dfs(board, word, r + 1, c, i + 1) || dfs(board, word, r - 1, c, i + 1)
                || dfs(board, word, r, c + 1, i + 1) || dfs(board, word, r, c - 1, i + 1);
        board[r][c] = tmp;
        return ok;
    }
}`);
addLang("java", "letter-combinations-of-a-phone-number", String.raw`class Solution {
    private static final String[] KEYS = { "", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz" };
    private final List<String> res = new ArrayList<>();

    public List<String> letterCombinations(String digits) {
        if (!digits.isEmpty()) dfs(digits, 0, new StringBuilder());
        return res;
    }

    private void dfs(String digits, int i, StringBuilder cur) {
        if (i == digits.length()) {
            res.add(cur.toString());
            return;
        }
        for (char ch : KEYS[digits.charAt(i) - '0'].toCharArray()) {
            cur.append(ch);
            dfs(digits, i + 1, cur);
            cur.deleteCharAt(cur.length() - 1);
        }
    }
}`);
addLang("java", "palindrome-partitioning", String.raw`class Solution {
    private final List<List<String>> res = new ArrayList<>();
    private final List<String> path = new ArrayList<>();

    public List<List<String>> partition(String s) {
        dfs(s, 0);
        return res;
    }

    private void dfs(String s, int start) {
        if (start == s.length()) {
            res.add(new ArrayList<>(path));
            return;
        }
        for (int end = start + 1; end <= s.length(); end++) {
            String piece = s.substring(start, end);
            if (new StringBuilder(piece).reverse().toString().equals(piece)) {   // only cut off palindromes
                path.add(piece);
                dfs(s, end);
                path.remove(path.size() - 1);
            }
        }
    }
}`);
addLang("java", "n-queens", String.raw`class Solution {
    private final List<List<String>> res = new ArrayList<>();
    private final Set<Integer> cols = new HashSet<>(), d1 = new HashSet<>(), d2 = new HashSet<>();
    private final List<Integer> board = new ArrayList<>();   // board.get(r) = column of the queen in row r

    public List<List<String>> solveNQueens(int n) {
        dfs(0, n);
        return res;
    }

    private void dfs(int r, int n) {
        if (r == n) {
            List<String> rows = new ArrayList<>();
            for (int c : board) rows.add(".".repeat(c) + "Q" + ".".repeat(n - c - 1));
            res.add(rows);
            return;
        }
        for (int c = 0; c < n; c++) {
            if (cols.contains(c) || d1.contains(r - c) || d2.contains(r + c)) continue;   // attacked
            cols.add(c); d1.add(r - c); d2.add(r + c); board.add(c);
            dfs(r + 1, n);
            cols.remove(c); d1.remove(r - c); d2.remove(r + c); board.remove(board.size() - 1);
        }
    }
}`);
addLang("java", "subsets-ii", String.raw`class Solution {
    private final List<List<Integer>> res = new ArrayList<>();

    public List<List<Integer>> subsetsWithDup(int[] nums) {
        Arrays.sort(nums);   // duplicates side by side
        go(nums, 0, new ArrayList<>());
        return res;
    }

    private void go(int[] nums, int start, List<Integer> path) {
        res.add(new ArrayList<>(path));
        for (int i = start; i < nums.length; i++) {
            if (i > start && nums[i] == nums[i - 1]) continue;   // same value at the same depth: skip
            path.add(nums[i]);
            go(nums, i + 1, path);
            path.remove(path.size() - 1);
        }
    }
}`);
addLang("java", "combinations", String.raw`class Solution {
    private final List<List<Integer>> res = new ArrayList<>();

    public List<List<Integer>> combine(int n, int k) {
        go(1, n, k, new ArrayList<>());
        return res;
    }

    private void go(int start, int n, int k, List<Integer> path) {
        if (path.size() == k) {
            res.add(new ArrayList<>(path));
            return;
        }
        for (int x = start; x <= n; x++) {
            path.add(x);
            go(x + 1, n, k, path);
            path.remove(path.size() - 1);
        }
    }
}`);
addLang("java", "find-if-path-exists-in-graph", String.raw`class Solution {
    public boolean validPath(int n, int[][] edges, int source, int destination) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] e : edges) {
            g.get(e[0]).add(e[1]);
            g.get(e[1]).add(e[0]);
        }
        boolean[] seen = new boolean[n];
        Deque<Integer> q = new ArrayDeque<>(List.of(source));
        seen[source] = true;
        while (!q.isEmpty()) {   // BFS from the source
            int u = q.poll();
            if (u == destination) return true;
            for (int v : g.get(u))
                if (!seen[v]) {
                    seen[v] = true;
                    q.add(v);
                }
        }
        return false;
    }
}`);
addLang("java", "number-of-islands", String.raw`class Solution {
    public int numIslands(char[][] grid) {
        int count = 0;
        for (int r = 0; r < grid.length; r++)
            for (int c = 0; c < grid[0].length; c++)
                if (grid[r][c] == '1') {
                    sink(grid, r, c);   // erase the whole island so it's counted once
                    count++;
                }
        return count;
    }

    private void sink(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') return;
        grid[r][c] = '0';
        sink(grid, r + 1, c);
        sink(grid, r - 1, c);
        sink(grid, r, c + 1);
        sink(grid, r, c - 1);
    }
}`);
addLang("java", "max-area-of-island", String.raw`class Solution {
    public int maxAreaOfIsland(int[][] grid) {
        int best = 0;
        for (int r = 0; r < grid.length; r++)
            for (int c = 0; c < grid[0].length; c++)
                best = Math.max(best, area(grid, r, c));
        return best;
    }

    private int area(int[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != 1) return 0;
        grid[r][c] = 0;   // visited
        return 1 + area(grid, r + 1, c) + area(grid, r - 1, c) + area(grid, r, c + 1) + area(grid, r, c - 1);
    }
}`);
addLang("java", "course-schedule", String.raw`class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) g.add(new ArrayList<>());
        int[] indeg = new int[numCourses];
        for (int[] p : prerequisites) {
            g.get(p[1]).add(p[0]);
            indeg[p[0]]++;
        }
        Deque<Integer> q = new ArrayDeque<>();   // Kahn's algorithm: take courses with no open prerequisites
        for (int i = 0; i < numCourses; i++) if (indeg[i] == 0) q.add(i);
        int done = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            done++;
            for (int v : g.get(u))
                if (--indeg[v] == 0) q.add(v);
        }
        return done == numCourses;
    }
}`);
addLang("java", "rotting-oranges", String.raw`class Solution {
    public int orangesRotting(int[][] grid) {
        int R = grid.length, C = grid[0].length, fresh = 0;
        Deque<int[]> q = new ArrayDeque<>();
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++) {
                if (grid[r][c] == 2) q.add(new int[] { r, c });
                else if (grid[r][c] == 1) fresh++;
            }
        int minutes = 0;
        int[][] dirs = { { 1, 0 }, { -1, 0 }, { 0, 1 }, { 0, -1 } };
        while (!q.isEmpty() && fresh > 0) {   // multi-source BFS, one ring per minute
            for (int i = q.size(); i > 0; i--) {
                int[] cell = q.poll();
                for (int[] d : dirs) {
                    int nr = cell[0] + d[0], nc = cell[1] + d[1];
                    if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] == 1) {
                        grid[nr][nc] = 2;
                        fresh--;
                        q.add(new int[] { nr, nc });
                    }
                }
            }
            minutes++;
        }
        return fresh == 0 ? minutes : -1;
    }
}`);
addLang("java", "course-schedule-ii", String.raw`class Solution {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) g.add(new ArrayList<>());
        int[] indeg = new int[numCourses];
        for (int[] p : prerequisites) {
            g.get(p[1]).add(p[0]);
            indeg[p[0]]++;
        }
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) if (indeg[i] == 0) q.add(i);
        int[] order = new int[numCourses];
        int k = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            order[k++] = u;
            for (int v : g.get(u))
                if (--indeg[v] == 0) q.add(v);
        }
        return k == numCourses ? order : new int[0];   // a cycle leaves courses untaken
    }
}`);
addLang("java", "pacific-atlantic-water-flow", String.raw`class Solution {
    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        int R = heights.length, C = heights[0].length;
        boolean[][] pac = new boolean[R][C], atl = new boolean[R][C];
        for (int c = 0; c < C; c++) { reach(heights, pac, 0, c); reach(heights, atl, R - 1, c); }
        for (int r = 0; r < R; r++) { reach(heights, pac, r, 0); reach(heights, atl, r, C - 1); }
        List<List<Integer>> res = new ArrayList<>();
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++)
                if (pac[r][c] && atl[r][c]) res.add(List.of(r, c));
        return res;
    }

    // Walk uphill from the ocean: every cell reached can drain into it.
    private void reach(int[][] h, boolean[][] seen, int r, int c) {
        if (seen[r][c]) return;
        seen[r][c] = true;
        int[][] dirs = { { 1, 0 }, { -1, 0 }, { 0, 1 }, { 0, -1 } };
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < h.length && nc >= 0 && nc < h[0].length && h[nr][nc] >= h[r][c]) reach(h, seen, nr, nc);
        }
    }
}`);
addLang("java", "surrounded-regions", String.raw`class Solution {
    public void solve(char[][] board) {
        int R = board.length, C = board[0].length;
        for (int r = 0; r < R; r++) { mark(board, r, 0); mark(board, r, C - 1); }   // O's reachable from the edge survive
        for (int c = 0; c < C; c++) { mark(board, 0, c); mark(board, R - 1, c); }
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++)
                board[r][c] = board[r][c] == 'S' ? 'O' : 'X';
    }

    private void mark(char[][] b, int r, int c) {
        if (r < 0 || r >= b.length || c < 0 || c >= b[0].length || b[r][c] != 'O') return;
        b[r][c] = 'S';
        mark(b, r + 1, c);
        mark(b, r - 1, c);
        mark(b, r, c + 1);
        mark(b, r, c - 1);
    }
}`);

addLang("java", "redundant-connection", String.raw`class Solution {
    private int[] parent;

    public int[] findRedundantConnection(int[][] edges) {
        parent = new int[edges.length + 1];
        for (int i = 0; i < parent.length; i++) parent[i] = i;
        for (int[] e : edges) {
            int ra = find(e[0]), rb = find(e[1]);
            if (ra == rb) return e;   // already connected: this edge closes a cycle
            parent[ra] = rb;
        }
        return new int[0];
    }

    private int find(int x) {   // union-find with path halving
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }
}`);
addLang("java", "network-delay-time", String.raw`class Solution {
    public int networkDelayTime(int[][] times, int n, int k) {
        Map<Integer, List<int[]>> g = new HashMap<>();
        for (int[] t : times) g.computeIfAbsent(t[0], x -> new ArrayList<>()).add(new int[] { t[1], t[2] });
        Map<Integer, Integer> dist = new HashMap<>();
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);   // { distance, node }
        heap.add(new int[] { 0, k });
        while (!heap.isEmpty()) {   // Dijkstra
            int[] top = heap.poll();
            int d = top[0], u = top[1];
            if (dist.containsKey(u)) continue;
            dist.put(u, d);
            for (int[] e : g.getOrDefault(u, List.of()))
                if (!dist.containsKey(e[0])) heap.add(new int[] { d + e[1], e[0] });
        }
        if (dist.size() < n) return -1;
        return Collections.max(dist.values());
    }
}`);
addLang("java", "cheapest-flights-within-k-stops", String.raw`class Solution {
    public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
        int INF = Integer.MAX_VALUE;
        int[] prices = new int[n];
        Arrays.fill(prices, INF);
        prices[src] = 0;
        for (int i = 0; i <= k; i++) {   // Bellman-Ford, one more flight per round
            int[] next = prices.clone();
            for (int[] f : flights)
                if (prices[f[0]] != INF && prices[f[0]] + f[2] < next[f[1]]) next[f[1]] = prices[f[0]] + f[2];
            prices = next;
        }
        return prices[dst] == INF ? -1 : prices[dst];
    }
}`);
addLang("java", "word-ladder", String.raw`class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> words = new HashSet<>(wordList);
        if (!words.contains(endWord)) return 0;
        Deque<String> q = new ArrayDeque<>(List.of(beginWord));
        Set<String> seen = new HashSet<>(List.of(beginWord));
        for (int steps = 1; !q.isEmpty(); steps++) {   // BFS: each step changes one letter
            for (int i = q.size(); i > 0; i--) {
                String w = q.poll();
                if (w.equals(endWord)) return steps;
                char[] cs = w.toCharArray();
                for (int p = 0; p < cs.length; p++) {
                    char orig = cs[p];
                    for (char ch = 'a'; ch <= 'z'; ch++) {
                        cs[p] = ch;
                        String next = new String(cs);
                        if (words.contains(next) && seen.add(next)) q.add(next);
                    }
                    cs[p] = orig;
                }
            }
        }
        return 0;
    }
}`);
addLang("java", "number-of-provinces", String.raw`class Solution {
    public int findCircleNum(int[][] isConnected) {
        int n = isConnected.length, count = 0;
        boolean[] seen = new boolean[n];
        for (int i = 0; i < n; i++)
            if (!seen[i]) {
                seen[i] = true;
                dfs(isConnected, seen, i);
                count++;
            }
        return count;
    }

    private void dfs(int[][] g, boolean[] seen, int i) {
        for (int j = 0; j < g.length; j++)
            if (g[i][j] == 1 && !seen[j]) {
                seen[j] = true;
                dfs(g, seen, j);
            }
    }
}`);
addLang("java", "shortest-path-in-binary-matrix", String.raw`class Solution {
    public int shortestPathBinaryMatrix(int[][] grid) {
        int n = grid.length;
        if (grid[0][0] == 1 || grid[n - 1][n - 1] == 1) return -1;
        Deque<int[]> q = new ArrayDeque<>();   // { row, col, path length }
        q.add(new int[] { 0, 0, 1 });
        grid[0][0] = 1;   // mark visited
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            if (cur[0] == n - 1 && cur[1] == n - 1) return cur[2];
            for (int dr = -1; dr <= 1; dr++)
                for (int dc = -1; dc <= 1; dc++) {   // 8 directions
                    int nr = cur[0] + dr, nc = cur[1] + dc;
                    if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] == 0) {
                        grid[nr][nc] = 1;
                        q.add(new int[] { nr, nc, cur[2] + 1 });
                    }
                }
        }
        return -1;
    }
}`);
addLang("java", "swim-in-rising-water", String.raw`class Solution {
    public int swimInWater(int[][] grid) {
        int n = grid.length;
        boolean[][] seen = new boolean[n][n];
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);   // { time, row, col }
        heap.add(new int[] { grid[0][0], 0, 0 });
        seen[0][0] = true;
        int[][] dirs = { { 1, 0 }, { -1, 0 }, { 0, 1 }, { 0, -1 } };
        while (true) {   // always expand the cell with the lowest water level needed
            int[] cur = heap.poll();
            if (cur[1] == n - 1 && cur[2] == n - 1) return cur[0];
            for (int[] d : dirs) {
                int nr = cur[1] + d[0], nc = cur[2] + d[1];
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && !seen[nr][nc]) {
                    seen[nr][nc] = true;
                    heap.add(new int[] { Math.max(cur[0], grid[nr][nc]), nr, nc });
                }
            }
        }
    }
}`);
addLang("java", "crawler-fake-web", String.raw`class Solution {
    // web maps a URL to the URLs its page links to; stay on the start URL's host.
    public List<String> crawl(String startUrl, Map<String, List<String>> web) {
        String host = startUrl.split("/")[2];   // "http://host/path" -> "host"
        Set<String> seen = new HashSet<>(List.of(startUrl));
        Deque<String> q = new ArrayDeque<>(List.of(startUrl));
        while (!q.isEmpty()) {
            String url = q.poll();
            for (String next : web.getOrDefault(url, List.of()))
                if (next.split("/")[2].equals(host) && seen.add(next)) q.add(next);
        }
        return new ArrayList<>(seen);
    }
}`);
addLang("java", "maximum-subarray", String.raw`class Solution {
    public int maxSubArray(int[] nums) {
        int cur = nums[0], best = nums[0];   // Kadane: best sum ending here
        for (int i = 1; i < nums.length; i++) {
            cur = Math.max(nums[i], cur + nums[i]);
            best = Math.max(best, cur);
        }
        return best;
    }
}`);
addLang("java", "jump-game", String.raw`class Solution {
    public boolean canJump(int[] nums) {
        int far = 0;   // furthest index reachable so far
        for (int i = 0; i < nums.length; i++) {
            if (i > far) return false;
            far = Math.max(far, i + nums[i]);
        }
        return true;
    }
}`);
addLang("java", "merge-intervals", String.raw`class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> out = new ArrayList<>();
        for (int[] iv : intervals) {
            if (!out.isEmpty() && iv[0] <= out.get(out.size() - 1)[1])
                out.get(out.size() - 1)[1] = Math.max(out.get(out.size() - 1)[1], iv[1]);   // overlaps: extend
            else out.add(new int[] { iv[0], iv[1] });
        }
        return out.toArray(new int[0][]);
    }
}`);
addLang("java", "insert-interval", String.raw`class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> res = new ArrayList<>();
        int i = 0, n = intervals.length;
        int[] cur = newInterval.clone();
        while (i < n && intervals[i][1] < cur[0]) res.add(intervals[i++]);   // entirely before
        while (i < n && intervals[i][0] <= cur[1]) {                          // overlapping: merge
            cur[0] = Math.min(cur[0], intervals[i][0]);
            cur[1] = Math.max(cur[1], intervals[i][1]);
            i++;
        }
        res.add(cur);
        while (i < n) res.add(intervals[i++]);                                // entirely after
        return res.toArray(new int[0][]);
    }
}`);
addLang("java", "non-overlapping-intervals", String.raw`class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));   // earliest end first
        long end = Long.MIN_VALUE;
        int removed = 0;
        for (int[] iv : intervals) {
            if (iv[0] >= end) end = iv[1];
            else removed++;
        }
        return removed;
    }
}`);
addLang("java", "jump-game-ii", String.raw`class Solution {
    public int jump(int[] nums) {
        int jumps = 0, curEnd = 0, far = 0;
        for (int i = 0; i < nums.length - 1; i++) {
            far = Math.max(far, i + nums[i]);
            if (i == curEnd) {   // end of this jump's reach: jump again
                jumps++;
                curEnd = far;
            }
        }
        return jumps;
    }
}`);
addLang("java", "gas-station", String.raw`class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        int total = 0, tank = 0, start = 0;
        for (int i = 0; i < gas.length; i++) {
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
addLang("java", "partition-labels", String.raw`class Solution {
    public List<Integer> partitionLabels(String s) {
        int[] last = new int[26];
        for (int i = 0; i < s.length(); i++) last[s.charAt(i) - 'a'] = i;
        List<Integer> res = new ArrayList<>();
        int start = 0, end = 0;
        for (int i = 0; i < s.length(); i++) {
            end = Math.max(end, last[s.charAt(i) - 'a']);
            if (i == end) {   // every letter so far ends by here
                res.add(end - start + 1);
                start = i + 1;
            }
        }
        return res;
    }
}`);
addLang("java", "best-time-to-buy-and-sell-stock-ii", String.raw`class Solution {
    public int maxProfit(int[] prices) {
        int profit = 0;
        for (int i = 1; i < prices.length; i++) profit += Math.max(0, prices[i] - prices[i - 1]);   // take every rise
        return profit;
    }
}`);
addLang("java", "largest-number", String.raw`class Solution {
    public String largestNumber(int[] nums) {
        String[] strs = new String[nums.length];
        for (int i = 0; i < nums.length; i++) strs[i] = String.valueOf(nums[i]);
        Arrays.sort(strs, (a, b) -> (b + a).compareTo(a + b));   // a before b if "ab" > "ba"
        if (strs[0].equals("0")) return "0";
        return String.join("", strs);
    }
}`);
addLang("java", "valid-parenthesis-string", String.raw`class Solution {
    public boolean checkValidString(String s) {
        int lo = 0, hi = 0;   // range of possible open-bracket counts
        for (char c : s.toCharArray()) {
            if (c == '(') { lo++; hi++; }
            else if (c == ')') { lo--; hi--; }
            else { lo--; hi++; }   // '*' could be ')', '' or '('
            if (hi < 0) return false;
            lo = Math.max(lo, 0);
        }
        return lo == 0;
    }
}`);
addLang("java", "can-place-flowers", String.raw`class Solution {
    public boolean canPlaceFlowers(int[] flowerbed, int n) {
        int[] bed = flowerbed;
        for (int i = 0; i < bed.length; i++)
            if (bed[i] == 0 && (i == 0 || bed[i - 1] == 0) && (i == bed.length - 1 || bed[i + 1] == 0)) {
                bed[i] = 1;   // plant greedily
                n--;
            }
        return n <= 0;
    }
}`);

addLang("java", "assign-cookies", String.raw`class Solution {
    public int findContentChildren(int[] g, int[] s) {
        Arrays.sort(g);
        Arrays.sort(s);
        int child = 0;
        for (int cookie : s)   // smallest cookie that satisfies the least greedy child left
            if (child < g.length && cookie >= g[child]) child++;
        return child;
    }
}`);
addLang("java", "maximum-sum-circular-subarray", String.raw`class Solution {
    public int maxSubarraySumCircular(int[] nums) {
        int total = 0, curMax = 0, curMin = 0, bestMax = nums[0], bestMin = nums[0];
        for (int x : nums) {   // Kadane for the best and the worst subarray at once
            curMax = Math.max(x, curMax + x);
            bestMax = Math.max(bestMax, curMax);
            curMin = Math.min(x, curMin + x);
            bestMin = Math.min(bestMin, curMin);
            total += x;
        }
        // wrapping around = everything minus the worst middle part (unless everything is negative)
        return bestMax < 0 ? bestMax : Math.max(bestMax, total - bestMin);
    }
}`);
addLang("java", "maximize-active-section-with-trade-i", String.raw`class Solution {
    public int maxActiveSectionsAfterTrade(String s) {
        int ones = 0;
        List<Integer> zeros = new ArrayList<>();   // lengths of the runs of '0'
        for (int i = 0; i < s.length(); ) {
            if (s.charAt(i) == '1') { ones++; i++; continue; }
            int j = i;
            while (j < s.length() && s.charAt(j) == '0') j++;
            zeros.add(j - i);
            i = j;
        }
        int best = 0;   // the trade turns two zero runs around a block of ones into ones
        for (int k = 0; k + 1 < zeros.size(); k++) best = Math.max(best, zeros.get(k) + zeros.get(k + 1));
        return ones + best;
    }
}`);
addLang("java", "find-the-lexicographically-smallest-valid-sequence", String.raw`class Solution {
    public int[] validSequence(String word1, String word2) {
        int n = word1.length(), m = word2.length();
        int[] suf = new int[n + 1];   // suf[i] = start of the longest suffix of word2 matchable from word1[i..]
        suf[n] = m;
        for (int i = n - 1, j = m; i >= 0; i--) {
            if (j > 0 && word1.charAt(i) == word2.charAt(j - 1)) j--;
            suf[i] = j;
        }
        List<Integer> res = new ArrayList<>();
        int j = 0;
        boolean used = false;   // at most one mismatch allowed
        for (int i = 0; i < n && j < m; i++) {
            if (word1.charAt(i) == word2.charAt(j)) { res.add(i); j++; }
            else if (!used && suf[i + 1] <= j + 1) { res.add(i); j++; used = true; }
        }
        if (j < m) return new int[0];
        return res.stream().mapToInt(Integer::intValue).toArray();
    }
}`);
addLang("java", "single-number", String.raw`class Solution {
    public int singleNumber(int[] nums) {
        int x = 0;
        for (int n : nums) x ^= n;   // pairs cancel out
        return x;
    }
}`);
addLang("java", "plus-one", String.raw`class Solution {
    public int[] plusOne(int[] digits) {
        for (int i = digits.length - 1; i >= 0; i--) {
            if (digits[i] < 9) {
                digits[i]++;
                return digits;
            }
            digits[i] = 0;   // 9 rolls over; carry on to the left
        }
        int[] res = new int[digits.length + 1];   // all nines: 1 followed by zeros
        res[0] = 1;
        return res;
    }
}`);
addLang("java", "palindrome-number", String.raw`class Solution {
    public boolean isPalindrome(int x) {
        if (x < 0 || (x % 10 == 0 && x != 0)) return false;
        int rev = 0;
        while (x > rev) {   // reverse only the second half
            rev = rev * 10 + x % 10;
            x /= 10;
        }
        return x == rev || x == rev / 10;   // odd digit count: the middle digit sits at the end of rev
    }
}`);
addLang("java", "roman-to-integer", String.raw`class Solution {
    public int romanToInt(String s) {
        Map<Character, Integer> val = Map.of('I', 1, 'V', 5, 'X', 10, 'L', 50, 'C', 100, 'D', 500, 'M', 1000);
        int total = 0;
        for (int i = 0; i < s.length(); i++) {
            int v = val.get(s.charAt(i));
            if (i + 1 < s.length() && v < val.get(s.charAt(i + 1))) total -= v;   // IV, IX, XL...
            else total += v;
        }
        return total;
    }
}`);
addLang("java", "number-of-1-bits", String.raw`class Solution {
    public int hammingWeight(int n) {
        int count = 0;
        while (n != 0) {
            n &= n - 1;   // clears the lowest set bit
            count++;
        }
        return count;
    }
}`);
addLang("java", "counting-bits", String.raw`class Solution {
    public int[] countBits(int n) {
        int[] dp = new int[n + 1];
        for (int i = 1; i <= n; i++) dp[i] = dp[i >> 1] + (i & 1);   // i's bits = (i / 2)'s bits + last bit
        return dp;
    }
}`);
addLang("java", "missing-number", String.raw`class Solution {
    public int missingNumber(int[] nums) {
        int n = nums.length, sum = 0;
        for (int x : nums) sum += x;
        return n * (n + 1) / 2 - sum;
    }
}`);
addLang("java", "happy-number", String.raw`class Solution {
    public boolean isHappy(int n) {
        Set<Integer> seen = new HashSet<>();
        while (n != 1 && seen.add(n)) {   // stop at 1, or when a number repeats (a loop)
            int next = 0;
            for (; n > 0; n /= 10) next += (n % 10) * (n % 10);
            n = next;
        }
        return n == 1;
    }
}`);
addLang("java", "rotate-image", String.raw`class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        for (int i = 0; i < n / 2; i++) {   // flip upside down...
            int[] t = matrix[i];
            matrix[i] = matrix[n - 1 - i];
            matrix[n - 1 - i] = t;
        }
        for (int i = 0; i < n; i++)   // ...then transpose
            for (int j = 0; j < i; j++) {
                int t = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = t;
            }
    }
}`);
addLang("java", "spiral-matrix", String.raw`class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> res = new ArrayList<>();
        int top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;
        while (top <= bottom && left <= right) {   // peel one ring at a time
            for (int c = left; c <= right; c++) res.add(matrix[top][c]);
            for (int r = top + 1; r <= bottom; r++) res.add(matrix[r][right]);
            if (top < bottom) for (int c = right - 1; c >= left; c--) res.add(matrix[bottom][c]);
            if (left < right) for (int r = bottom - 1; r > top; r--) res.add(matrix[r][left]);
            top++; bottom--; left++; right--;
        }
        return res;
    }
}`);
addLang("java", "set-matrix-zeroes", String.raw`class Solution {
    public void setZeroes(int[][] matrix) {
        int R = matrix.length, C = matrix[0].length;
        boolean[] rows = new boolean[R], cols = new boolean[C];
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++)
                if (matrix[r][c] == 0) { rows[r] = true; cols[c] = true; }
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++)
                if (rows[r] || cols[c]) matrix[r][c] = 0;
    }
}`);
addLang("java", "powx-n", String.raw`class Solution {
    public double myPow(double x, int n) {
        long e = n;   // long: -Integer.MIN_VALUE doesn't fit in an int
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
addLang("java", "reverse-integer", String.raw`class Solution {
    public int reverse(int x) {
        long rev = 0;   // long: the reversed number can overflow an int
        while (x != 0) {
            rev = rev * 10 + x % 10;   // Java's % keeps the sign, so negatives just work
            x /= 10;
        }
        return rev < Integer.MIN_VALUE || rev > Integer.MAX_VALUE ? 0 : (int) rev;
    }
}`);
addLang("java", "power-of-two", String.raw`class Solution {
    public boolean isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;   // exactly one bit set
    }
}`);
addLang("java", "integer-to-roman", String.raw`class Solution {
    public String intToRoman(int num) {
        int[] vals = { 1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1 };
        String[] syms = { "M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I" };
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < vals.length; i++)   // greedy: largest symbol first
            while (num >= vals[i]) {
                out.append(syms[i]);
                num -= vals[i];
            }
        return out.toString();
    }
}`);
addLang("java", "add-binary", String.raw`class Solution {
    public String addBinary(String a, String b) {
        StringBuilder out = new StringBuilder();
        int i = a.length() - 1, j = b.length() - 1, carry = 0;
        while (i >= 0 || j >= 0 || carry > 0) {
            int total = carry;
            if (i >= 0) total += a.charAt(i--) - '0';
            if (j >= 0) total += b.charAt(j--) - '0';
            out.append(total % 2);
            carry = total / 2;
        }
        return out.reverse().toString();
    }
}`);

addLang("java", "angle-between-hands-of-a-clock", String.raw`class Solution {
    public double angleClock(int hour, int minutes) {
        // the hour hand moves 30 degrees an hour plus 0.5 a minute; the minute hand 6 a minute
        double diff = Math.abs((hour % 12) * 30 + minutes * 0.5 - minutes * 6);
        return Math.min(diff, 360 - diff);
    }
}`);
addLang("java", "divide-two-integers", String.raw`class Solution {
    public int divide(int dividend, int divisor) {
        if (dividend == Integer.MIN_VALUE && divisor == -1) return Integer.MAX_VALUE;   // the only overflow
        boolean neg = (dividend < 0) != (divisor < 0);
        long a = Math.abs((long) dividend), b = Math.abs((long) divisor);   // long: |MIN_VALUE| needs it
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
addLang("java", "string-to-integer-atoi", String.raw`class Solution {
    public int myAtoi(String s) {
        int i = 0, n = s.length();
        while (i < n && s.charAt(i) == ' ') i++;
        int sign = 1;
        if (i < n && (s.charAt(i) == '+' || s.charAt(i) == '-')) sign = s.charAt(i++) == '-' ? -1 : 1;
        long num = 0;
        while (i < n && Character.isDigit(s.charAt(i))) {
            num = num * 10 + (s.charAt(i++) - '0');
            if (num > Integer.MAX_VALUE) break;   // already out of range: stop before long overflows too
        }
        return (int) Math.max(Integer.MIN_VALUE, Math.min(Integer.MAX_VALUE, sign * num));
    }
}`);
addLang("java", "fizz-buzz", String.raw`class Solution {
    public List<String> fizzBuzz(int n) {
        List<String> res = new ArrayList<>();
        for (int i = 1; i <= n; i++) {
            if (i % 15 == 0) res.add("FizzBuzz");
            else if (i % 3 == 0) res.add("Fizz");
            else if (i % 5 == 0) res.add("Buzz");
            else res.add(String.valueOf(i));
        }
        return res;
    }
}`);
addLang("java", "add-digits", String.raw`class Solution {
    public int addDigits(int num) {
        return num == 0 ? 0 : 1 + (num - 1) % 9;   // digital root
    }
}`);
addLang("java", "count-primes", String.raw`class Solution {
    public int countPrimes(int n) {
        if (n < 3) return 0;
        boolean[] composite = new boolean[n];   // sieve of Eratosthenes
        int count = 0;
        for (int p = 2; p < n; p++) {
            if (composite[p]) continue;
            count++;
            for (long m = (long) p * p; m < n; m += p) composite[(int) m] = true;
        }
        return count;
    }
}`);
addLang("java", "add-strings", String.raw`class Solution {
    public String addStrings(String num1, String num2) {
        StringBuilder out = new StringBuilder();
        int i = num1.length() - 1, j = num2.length() - 1, carry = 0;
        while (i >= 0 || j >= 0 || carry > 0) {
            int total = carry;
            if (i >= 0) total += num1.charAt(i--) - '0';
            if (j >= 0) total += num2.charAt(j--) - '0';
            out.append(total % 10);
            carry = total / 10;
        }
        return out.reverse().toString();
    }
}`);
addLang("java", "count-and-say", String.raw`class Solution {
    public String countAndSay(int n) {
        String s = "1";
        for (int k = 1; k < n; k++) {
            StringBuilder out = new StringBuilder();
            for (int i = 0; i < s.length(); ) {   // read off each run: count, then digit
                int j = i;
                while (j < s.length() && s.charAt(j) == s.charAt(i)) j++;
                out.append(j - i).append(s.charAt(i));
                i = j;
            }
            s = out.toString();
        }
        return s;
    }
}`);
addLang("java", "sequential-digits", String.raw`class Solution {
    public List<Integer> sequentialDigits(int low, int high) {
        String digits = "123456789";
        List<Integer> res = new ArrayList<>();
        for (int len = 2; len <= 9; len++)   // shorter numbers first, then left to right
            for (int start = 0; start + len <= 9; start++) {
                int x = Integer.parseInt(digits.substring(start, start + len));
                if (x >= low && x <= high) res.add(x);
            }
        return res;
    }
}`);
addLang("java", "maximum-product-of-three-numbers", String.raw`class Solution {
    public int maximumProduct(int[] nums) {
        Arrays.sort(nums);
        int n = nums.length;
        // three largest, or two most negative times the largest
        return Math.max(nums[n - 1] * nums[n - 2] * nums[n - 3], nums[0] * nums[1] * nums[n - 1]);
    }
}`);
addLang("java", "climbing-stairs", String.raw`class Solution {
    public int climbStairs(int n) {
        int a = 1, b = 1;   // ways to reach the previous two steps
        for (int i = 1; i < n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}`);
addLang("java", "min-cost-climbing-stairs", String.raw`class Solution {
    public int minCostClimbingStairs(int[] cost) {
        int a = cost[0], b = cost[1];   // cheapest way to stand on the last two steps
        for (int i = 2; i < cost.length; i++) {
            int c = cost[i] + Math.min(a, b);
            a = b;
            b = c;
        }
        return Math.min(a, b);
    }
}`);
addLang("java", "house-robber", String.raw`class Solution {
    public int rob(int[] nums) {
        int prev = 0, cur = 0;   // best totals up to two houses back and one house back
        for (int x : nums) {
            int next = Math.max(cur, prev + x);   // skip this house, or rob it
            prev = cur;
            cur = next;
        }
        return cur;
    }
}`);
addLang("java", "coin-change", String.raw`class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];   // dp[a] = fewest coins that make a
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;
        for (int a = 1; a <= amount; a++)
            for (int c : coins)
                if (c <= a && dp[a - c] != Integer.MAX_VALUE) dp[a] = Math.min(dp[a], dp[a - c] + 1);
        return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];
    }
}`);
addLang("java", "house-robber-ii", String.raw`class Solution {
    public int rob(int[] nums) {
        if (nums.length == 1) return nums[0];
        // the first and last houses touch: rob without the last, or without the first
        return Math.max(line(nums, 0, nums.length - 2), line(nums, 1, nums.length - 1));
    }

    private int line(int[] nums, int lo, int hi) {
        int prev = 0, cur = 0;
        for (int i = lo; i <= hi; i++) {
            int next = Math.max(cur, prev + nums[i]);
            prev = cur;
            cur = next;
        }
        return cur;
    }
}`);
addLang("java", "longest-palindromic-substring", String.raw`class Solution {
    public String longestPalindrome(String s) {
        int bestLo = 0, bestLen = 0;
        for (int i = 0; i < s.length(); i++)
            for (int[] seed : new int[][] { { i, i }, { i, i + 1 } }) {   // odd and even centres
                int l = seed[0], r = seed[1];
                while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }
                if (r - l - 1 > bestLen) {
                    bestLo = l + 1;
                    bestLen = r - l - 1;
                }
            }
        return s.substring(bestLo, bestLo + bestLen);
    }
}`);
addLang("java", "decode-ways", String.raw`class Solution {
    public int numDecodings(String s) {
        int prev = 1, cur = s.charAt(0) != '0' ? 1 : 0;   // ways to decode up to i - 1 and up to i
        for (int i = 1; i < s.length(); i++) {
            int next = 0;
            if (s.charAt(i) != '0') next += cur;   // read one digit
            int two = Integer.parseInt(s.substring(i - 1, i + 1));
            if (two >= 10 && two <= 26) next += prev;   // or two digits
            prev = cur;
            cur = next;
        }
        return cur;
    }
}`);
addLang("java", "word-break", String.raw`class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> words = new HashSet<>(wordDict);
        boolean[] dp = new boolean[s.length() + 1];   // dp[i]: the first i letters can be split
        dp[0] = true;
        for (int i = 1; i <= s.length(); i++)
            for (int j = 0; j < i; j++)
                if (dp[j] && words.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
                }
        return dp[s.length()];
    }
}`);
addLang("java", "longest-increasing-subsequence", String.raw`class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] tails = new int[nums.length];   // tails[k] = smallest tail of an increasing run of length k + 1
        int size = 0;
        for (int x : nums) {
            int lo = 0, hi = size;
            while (lo < hi) {   // first tail >= x
                int mid = (lo + hi) / 2;
                if (tails[mid] < x) lo = mid + 1;
                else hi = mid;
            }
            tails[lo] = x;
            if (lo == size) size++;
        }
        return size;
    }
}`);
addLang("java", "palindromic-substrings", String.raw`class Solution {
    public int countSubstrings(String s) {
        int count = 0;
        for (int i = 0; i < s.length(); i++) count += expand(s, i, i) + expand(s, i, i + 1);   // odd and even centres
        return count;
    }

    private int expand(String s, int l, int r) {
        int n = 0;
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { n++; l--; r++; }
        return n;
    }
}`);

addLang("java", "maximum-product-subarray", String.raw`class Solution {
    public int maxProduct(int[] nums) {
        int best = nums[0], hi = nums[0], lo = nums[0];   // largest and smallest product ending here
        for (int i = 1; i < nums.length; i++) {
            int x = nums[i], a = hi * x, b = lo * x;   // a negative x swaps the roles of hi and lo
            hi = Math.max(x, Math.max(a, b));
            lo = Math.min(x, Math.min(a, b));
            best = Math.max(best, hi);
        }
        return best;
    }
}`);
addLang("java", "partition-equal-subset-sum", String.raw`class Solution {
    public boolean canPartition(int[] nums) {
        int total = 0;
        for (int x : nums) total += x;
        if (total % 2 == 1) return false;
        int target = total / 2;
        boolean[] reachable = new boolean[target + 1];   // reachable[s]: some subset sums to s
        reachable[0] = true;
        for (int x : nums)
            for (int s = target; s >= x; s--)   // backwards so each number is used once
                if (reachable[s - x]) reachable[s] = true;
        return reachable[target];
    }
}`);
addLang("java", "fibonacci-number", String.raw`class Solution {
    public int fib(int n) {
        int a = 0, b = 1;
        for (int i = 0; i < n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return a;
    }
}`);
addLang("java", "pascals-triangle", String.raw`class Solution {
    public List<List<Integer>> generate(int numRows) {
        List<List<Integer>> rows = new ArrayList<>();
        rows.add(List.of(1));
        for (int r = 1; r < numRows; r++) {
            List<Integer> prev = rows.get(r - 1), row = new ArrayList<>();
            row.add(1);
            for (int i = 0; i + 1 < prev.size(); i++) row.add(prev.get(i) + prev.get(i + 1));   // sum of the two above
            row.add(1);
            rows.add(row);
        }
        return rows;
    }
}`);
addLang("java", "unique-paths", String.raw`class Solution {
    public int uniquePaths(int m, int n) {
        int[] row = new int[n];   // paths to each cell of the current row
        Arrays.fill(row, 1);
        for (int r = 1; r < m; r++)
            for (int j = 1; j < n; j++) row[j] += row[j - 1];   // from above + from the left
        return row[n - 1];
    }
}`);
addLang("java", "longest-common-subsequence", String.raw`class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[][] dp = new int[m + 1][n + 1];   // dp[i][j] = LCS of the first i and first j letters
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                dp[i][j] = text1.charAt(i - 1) == text2.charAt(j - 1)
                        ? dp[i - 1][j - 1] + 1
                        : Math.max(dp[i - 1][j], dp[i][j - 1]);
        return dp[m][n];
    }
}`);
addLang("java", "coin-change-ii", String.raw`class Solution {
    public int change(int amount, int[] coins) {
        long[] dp = new long[amount + 1];   // dp[a] = ways to make a (long: partial counts can get big)
        dp[0] = 1;
        for (int c : coins)   // coins in the outer loop: each combination counted once, in one order
            for (int a = c; a <= amount; a++) dp[a] += dp[a - c];
        return (int) dp[amount];
    }
}`);
addLang("java", "target-sum", String.raw`class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        Map<Integer, Integer> dp = new HashMap<>();   // running sum -> number of ways to reach it
        dp.put(0, 1);
        for (int x : nums) {
            Map<Integer, Integer> next = new HashMap<>();
            for (var e : dp.entrySet()) {
                next.merge(e.getKey() + x, e.getValue(), Integer::sum);
                next.merge(e.getKey() - x, e.getValue(), Integer::sum);
            }
            dp = next;
        }
        return dp.getOrDefault(target, 0);
    }
}`);
addLang("java", "best-time-to-buy-and-sell-stock-with-cooldown", String.raw`class Solution {
    public int maxProfit(int[] prices) {
        // best profit when holding a share, having just sold, or resting (free to buy)
        int hold = Integer.MIN_VALUE, sold = 0, rest = 0;
        for (int p : prices) {
            int prevSold = sold;
            sold = hold + p;
            hold = Math.max(hold, rest - p);
            rest = Math.max(rest, prevSold);
        }
        return Math.max(sold, rest);
    }
}`);
addLang("java", "edit-distance", String.raw`class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[][] dp = new int[m + 1][n + 1];   // dp[i][j] = edits to turn the first i letters into the first j
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                dp[i][j] = word1.charAt(i - 1) == word2.charAt(j - 1)
                        ? dp[i - 1][j - 1]
                        : 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));   // replace, delete, insert
        return dp[m][n];
    }
}`);
addLang("java", "regular-expression-matching", String.raw`class Solution {
    private String s, p;
    private Boolean[][] memo;

    public boolean isMatch(String s, String p) {
        this.s = s;
        this.p = p;
        memo = new Boolean[s.length() + 1][p.length() + 1];
        return dp(0, 0);
    }

    private boolean dp(int i, int j) {   // does s[i..] match p[j..]?
        if (memo[i][j] != null) return memo[i][j];
        boolean res;
        if (j == p.length()) res = i == s.length();
        else {
            boolean first = i < s.length() && (p.charAt(j) == s.charAt(i) || p.charAt(j) == '.');
            if (j + 1 < p.length() && p.charAt(j + 1) == '*')
                res = dp(i, j + 2) || (first && dp(i + 1, j));   // skip "x*", or use it once more
            else res = first && dp(i + 1, j + 1);
        }
        return memo[i][j] = res;
    }
}`);
addLang("java", "burst-balloons", String.raw`class Solution {
    public int maxCoins(int[] nums) {
        int n = nums.length + 2;
        int[] a = new int[n];   // pad with 1s at both ends
        a[0] = a[n - 1] = 1;
        for (int i = 0; i < nums.length; i++) a[i + 1] = nums[i];
        int[][] dp = new int[n][n];   // dp[l][r] = best coins from bursting everything strictly between l and r
        for (int len = 2; len < n; len++)
            for (int l = 0; l + len < n; l++) {
                int r = l + len;
                for (int k = l + 1; k < r; k++)   // k is the last balloon burst in (l, r)
                    dp[l][r] = Math.max(dp[l][r], dp[l][k] + dp[k][r] + a[l] * a[k] * a[r]);
            }
        return dp[0][n - 1];
    }
}`);
addLang("java", "predict-the-winner", String.raw`class Solution {
    private Integer[][] memo;
    private int[] nums;

    public boolean predictTheWinner(int[] nums) {
        this.nums = nums;
        memo = new Integer[nums.length][nums.length];
        return diff(0, nums.length - 1) >= 0;
    }

    private int diff(int i, int j) {   // best (my score - opponent's score) on nums[i..j]
        if (i > j) return 0;
        if (memo[i][j] != null) return memo[i][j];
        return memo[i][j] = Math.max(nums[i] - diff(i + 1, j), nums[j] - diff(i, j - 1));
    }
}`);
addLang("java", "best-time-to-buy-and-sell-stock-iii", String.raw`class Solution {
    public int maxProfit(int[] prices) {
        int buy1 = Integer.MIN_VALUE, sell1 = 0, buy2 = Integer.MIN_VALUE, sell2 = 0;
        for (int p : prices) {   // best balance after each of the four moves
            buy1 = Math.max(buy1, -p);
            sell1 = Math.max(sell1, buy1 + p);
            buy2 = Math.max(buy2, sell1 - p);
            sell2 = Math.max(sell2, buy2 + p);
        }
        return sell2;
    }
}`);
