// Good vs bad practice for each algorithm pattern (keys match CATS in data/data.js), in Python,
// Java and C#. Same shape as the lessons' practice pairs: { why, bad, good }, where each of those is
// shared text or { py, java, cs }. Shown on the pattern page in the main language.
const PATTERN_PRACTICE = {
  arrays: [
      { why: "Summing a slice for every query is O(n) each. Build prefix sums once (O(n)), and every range sum is one subtraction: O(1).",
        bad: { py: `def range_sum(nums, l, r):
    return sum(nums[l:r + 1])       # O(n) per query`, java: `int rangeSum(int[] nums, int l, int r) {
    int s = 0;
    for (int i = l; i <= r; i++) s += nums[i];   // O(n) per query
    return s;
}`, cs: `int RangeSum(int[] nums, int l, int r)
{
    int s = 0;
    for (int i = l; i <= r; i++) s += nums[i];   // O(n) per query
    return s;
}` },
        good: { py: `prefix = [0]
for x in nums:
    prefix.append(prefix[-1] + x)   # prefix[i] = sum of nums[:i]

def range_sum(l, r):
    return prefix[r + 1] - prefix[l]    # O(1) per query`, java: `class RangeSums {
    private final long[] prefix;         // prefix[i] = sum of first i

    RangeSums(int[] nums) {
        prefix = new long[nums.length + 1];
        for (int i = 0; i < nums.length; i++)
            prefix[i + 1] = prefix[i] + nums[i];
    }

    long query(int l, int r) { return prefix[r + 1] - prefix[l]; }   // O(1)
}`, cs: `class RangeSums
{
    private readonly long[] prefix;      // prefix[i] = sum of first i

    public RangeSums(int[] nums)
    {
        prefix = new long[nums.Length + 1];
        for (int i = 0; i < nums.Length; i++)
            prefix[i + 1] = prefix[i] + nums[i];
    }

    public long Query(int l, int r) => prefix[r + 1] - prefix[l];   // O(1)
}` } },
      { why: "Dividing the total product breaks as soon as there's a zero. Multiply a prefix pass and a suffix pass instead: no division, O(n).",
        bad: { py: `def product_except_self(nums):
    total = 1
    for x in nums:
        total *= x
    return [total // x for x in nums]    # ZeroDivisionError on a 0`, java: `int[] productExceptSelf(int[] nums) {
    int total = 1;
    for (int x : nums) total *= x;
    int[] res = new int[nums.length];
    for (int i = 0; i < nums.length; i++)
        res[i] = total / nums[i];        // ArithmeticException on a 0
    return res;
}`, cs: `int[] ProductExceptSelf(int[] nums)
{
    int total = 1;
    foreach (int x in nums) total *= x;
    var res = new int[nums.Length];
    for (int i = 0; i < nums.Length; i++)
        res[i] = total / nums[i];        // DivideByZeroException on a 0
    return res;
}` },
        good: { py: `def product_except_self(nums):
    res = [1] * len(nums)
    left = 1
    for i in range(len(nums)):           # product of everything to the left
        res[i] = left
        left *= nums[i]
    right = 1
    for i in reversed(range(len(nums))): # times everything to the right
        res[i] *= right
        right *= nums[i]
    return res`, java: `int[] productExceptSelf(int[] nums) {
    int[] res = new int[nums.length];
    int left = 1;
    for (int i = 0; i < nums.length; i++) {
        res[i] = left;
        left *= nums[i];
    }
    int right = 1;
    for (int i = nums.length - 1; i >= 0; i--) {
        res[i] *= right;
        right *= nums[i];
    }
    return res;
}`, cs: `int[] ProductExceptSelf(int[] nums)
{
    var res = new int[nums.Length];
    int left = 1;
    for (int i = 0; i < nums.Length; i++)
    {
        res[i] = left;
        left *= nums[i];
    }
    int right = 1;
    for (int i = nums.Length - 1; i >= 0; i--)
    {
        res[i] *= right;
        right *= nums[i];
    }
    return res;
}` } },
      { why: "Sorting first costs O(n log n). With a set, start counting only at numbers whose predecessor is missing, so each number is visited about twice: O(n).",
        bad: { py: `def longest_consecutive(nums):
    nums = sorted(set(nums))             # O(n log n)
    best = run = 0
    for i, x in enumerate(nums):
        run = run + 1 if i and x == nums[i - 1] + 1 else 1
        best = max(best, run)
    return best`, java: `int longestConsecutive(int[] nums) {
    // O(n log n)
    int[] s = Arrays.stream(nums).distinct().sorted().toArray();
    int best = 0, run = 0;
    for (int i = 0; i < s.length; i++) {
        run = i > 0 && s[i] == s[i - 1] + 1 ? run + 1 : 1;
        best = Math.max(best, run);
    }
    return best;
}`, cs: `int LongestConsecutive(int[] nums)
{
    var s = nums.Distinct().OrderBy(x => x).ToArray();   // O(n log n)
    int best = 0, run = 0;
    for (int i = 0; i < s.Length; i++)
    {
        run = i > 0 && s[i] == s[i - 1] + 1 ? run + 1 : 1;
        best = Math.Max(best, run);
    }
    return best;
}` },
        good: { py: `def longest_consecutive(nums):
    have = set(nums)
    best = 0
    for x in have:
        # only start at a sequence's first number
        if x - 1 not in have:
            y = x
            while y + 1 in have:
                y += 1
            best = max(best, y - x + 1)
    return best`, java: `int longestConsecutive(int[] nums) {
    Set<Integer> have = new HashSet<>();
    for (int x : nums) have.add(x);
    int best = 0;
    for (int x : have) {
        if (have.contains(x - 1)) continue;   // not the start of a run
        int y = x;
        while (have.contains(y + 1)) y++;
        best = Math.max(best, y - x + 1);
    }
    return best;
}`, cs: `int LongestConsecutive(int[] nums)
{
    var have = new HashSet<int>(nums);
    int best = 0;
    foreach (int x in have)
    {
        if (have.Contains(x - 1)) continue;   // not the start of a run
        int y = x;
        while (have.Contains(y + 1)) y++;
        best = Math.Max(best, y - x + 1);
    }
    return best;
}` } },
  ],
  twoptr: [
      { why: "On sorted input, checking every pair is O(n²). Two pointers moving inward use the order: too small moves left up, too big moves right down. O(n), O(1) space.",
        bad: { py: `def pair_sum(a, target):              # a is sorted
    for i in range(len(a)):
        for j in range(i + 1, len(a)):   # O(n²): ignores the order
            if a[i] + a[j] == target:
                return [i, j]`, java: `int[] pairSum(int[] a, int target) {     // a is sorted
    for (int i = 0; i < a.length; i++)
        for (int j = i + 1; j < a.length; j++)   // O(n²)
            if (a[i] + a[j] == target) return new int[] {i, j};
    return null;
}`, cs: `int[] PairSum(int[] a, int target)       // a is sorted
{
    for (int i = 0; i < a.Length; i++)
        for (int j = i + 1; j < a.Length; j++)   // O(n²)
            if (a[i] + a[j] == target) return new[] { i, j };
    return null;
}` },
        good: { py: `def pair_sum(a, target):
    l, r = 0, len(a) - 1
    while l < r:
        s = a[l] + a[r]
        if s == target:
            return [l, r]
        if s < target:
            l += 1                       # need bigger
        else:
            r -= 1                       # need smaller`, java: `int[] pairSum(int[] a, int target) {
    int l = 0, r = a.length - 1;
    while (l < r) {
        int s = a[l] + a[r];
        if (s == target) return new int[] {l, r};
        if (s < target) l++;             // need bigger
        else r--;                        // need smaller
    }
    return null;
}`, cs: `int[] PairSum(int[] a, int target)
{
    int l = 0, r = a.Length - 1;
    while (l < r)
    {
        int s = a[l] + a[r];
        if (s == target) return new[] { l, r };
        if (s < target) l++;             // need bigger
        else r--;                        // need smaller
    }
    return null;
}` } },
      { why: "\"In place\" means no second array. A slow write pointer and a fast read pointer filter the array as you go.",
        bad: { py: `def remove_duplicates(nums):           # nums is sorted
    unique = []
    for x in nums:
        if not unique or x != unique[-1]:
            unique.append(x)             # O(n) extra space
    nums[:] = unique
    return len(unique)`, java: `int removeDuplicates(int[] nums) {
    List<Integer> unique = new ArrayList<>();   // O(n) extra space
    for (int x : nums)
        if (unique.isEmpty() || x != unique.get(unique.size() - 1))
            unique.add(x);
    for (int i = 0; i < unique.size(); i++) nums[i] = unique.get(i);
    return unique.size();
}`, cs: `int RemoveDuplicates(int[] nums)
{
    var unique = new List<int>();            // O(n) extra space
    foreach (int x in nums)
        if (unique.Count == 0 || x != unique[^1]) unique.Add(x);
    unique.CopyTo(nums);
    return unique.Count;
}` },
        good: { py: `def remove_duplicates(nums):
    w = 0                                # next slot to write
    for x in nums:
        if w == 0 or x != nums[w - 1]:
            nums[w] = x
            w += 1
    return w`, java: `int removeDuplicates(int[] nums) {
    int w = 0;                               // next slot to write
    for (int x : nums)
        if (w == 0 || x != nums[w - 1]) nums[w++] = x;
    return w;
}`, cs: `int RemoveDuplicates(int[] nums)
{
    int w = 0;                               // next slot to write
    foreach (int x in nums)
        if (w == 0 || x != nums[w - 1]) nums[w++] = x;
    return w;
}` } },
      { why: "Three nested loops plus a set to remove repeats is O(n³). Sort, fix one number, two-pointer the rest, and skip equal neighbours: O(n²), no set.",
        bad: { py: `def three_sum(nums):
    found = set()
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):    # O(n³)
                if nums[i] + nums[j] + nums[k] == 0:
                    found.add(tuple(sorted((nums[i], nums[j], nums[k]))))
    return [list(t) for t in found]`, java: `List<List<Integer>> threeSum(int[] nums) {
    Set<List<Integer>> found = new HashSet<>();
    for (int i = 0; i < nums.length; i++)
        for (int j = i + 1; j < nums.length; j++)
            for (int k = j + 1; k < nums.length; k++)   // O(n³)
                if (nums[i] + nums[j] + nums[k] == 0) {
                    int[] t = {nums[i], nums[j], nums[k]};
                    Arrays.sort(t);
                    found.add(List.of(t[0], t[1], t[2]));
                }
    return new ArrayList<>(found);
}`, cs: `List<List<int>> ThreeSum(int[] nums)
{
    var found = new HashSet<(int, int, int)>();
    for (int i = 0; i < nums.Length; i++)
        for (int j = i + 1; j < nums.Length; j++)
            for (int k = j + 1; k < nums.Length; k++)   // O(n³)
                if (nums[i] + nums[j] + nums[k] == 0)
                {
                    var t = new[] { nums[i], nums[j], nums[k] };
                    Array.Sort(t);
                    found.Add((t[0], t[1], t[2]));
                }
    return found
        .Select(t => new List<int> { t.Item1, t.Item2, t.Item3 })
        .ToList();
}` },
        good: { py: `def three_sum(nums):
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i and nums[i] == nums[i - 1]:
            continue                     # same first number: skip
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s < 0:
                l += 1
            elif s > 0:
                r -= 1
            else:
                res.append([nums[i], nums[l], nums[r]])
                l += 1
                while l < r and nums[l] == nums[l - 1]:
                    l += 1               # skip repeats
    return res`, java: `List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> res = new ArrayList<>();
    for (int i = 0; i + 2 < nums.length; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;   // skip repeats
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
}`, cs: `List<List<int>> ThreeSum(int[] nums)
{
    Array.Sort(nums);
    var res = new List<List<int>>();
    for (int i = 0; i + 2 < nums.Length; i++)
    {
        if (i > 0 && nums[i] == nums[i - 1]) continue;   // skip repeats
        int l = i + 1, r = nums.Length - 1;
        while (l < r)
        {
            int s = nums[i] + nums[l] + nums[r];
            if (s < 0) l++;
            else if (s > 0) r--;
            else
            {
                res.Add(new List<int> { nums[i], nums[l], nums[r] });
                l++;
                while (l < r && nums[l] == nums[l - 1]) l++;
            }
        }
    }
    return res;
}` } },
  ],
  window: [
      { why: "Restarting from every left edge re-checks the same characters: O(n²). Keep one window, move the right edge every step, and jump the left edge past the repeat: O(n).",
        bad: { py: `def longest_unique(s):
    best = 0
    for i in range(len(s)):
        seen = set()
        for j in range(i, len(s)):       # restarts for every i: O(n²)
            if s[j] in seen:
                break
            seen.add(s[j])
        best = max(best, len(seen))
    return best`, java: `int longestUnique(String s) {
    int best = 0;
    for (int i = 0; i < s.length(); i++) {
        Set<Character> seen = new HashSet<>();
        // O(n²)
        for (int j = i; j < s.length() && seen.add(s.charAt(j)); j++) { }
        best = Math.max(best, seen.size());
    }
    return best;
}`, cs: `int LongestUnique(string s)
{
    int best = 0;
    for (int i = 0; i < s.Length; i++)
    {
        var seen = new HashSet<char>();
        for (int j = i; j < s.Length && seen.Add(s[j]); j++) { }   // O(n²)
        best = Math.Max(best, seen.Count);
    }
    return best;
}` },
        good: { py: `def longest_unique(s):
    last, l, best = {}, 0, 0
    for r, ch in enumerate(s):
        if last.get(ch, -1) >= l:
            l = last[ch] + 1             # jump past the repeat
        last[ch] = r
        best = max(best, r - l + 1)
    return best`, java: `int longestUnique(String s) {
    Map<Character, Integer> last = new HashMap<>();
    int l = 0, best = 0;
    for (int r = 0; r < s.length(); r++) {
        char ch = s.charAt(r);
        // jump past
        if (last.getOrDefault(ch, -1) >= l) l = last.get(ch) + 1;
        last.put(ch, r);
        best = Math.max(best, r - l + 1);
    }
    return best;
}`, cs: `int LongestUnique(string s)
{
    var last = new Dictionary<char, int>();
    int l = 0, best = 0;
    for (int r = 0; r < s.Length; r++)
    {
        // jump past
        if (last.GetValueOrDefault(s[r], -1) >= l) l = last[s[r]] + 1;
        last[s[r]] = r;
        best = Math.Max(best, r - l + 1);
    }
    return best;
}` } },
      { why: "Counting the whole window again at every step is O(n·k). Update the counts as one character enters and one leaves: O(n).",
        bad: { py: `from collections import Counter

def has_anagram(s, p):
    need, k = Counter(p), len(p)
    for i in range(len(s) - k + 1):
        if Counter(s[i:i + k]) == need:  # recounts k characters each time
            return True
    return False`, java: `boolean hasAnagram(String s, String p) {
    int[] need = new int[26];
    for (char c : p.toCharArray()) need[c - 'a']++;
    for (int i = 0; i + p.length() <= s.length(); i++) {
        int[] have = new int[26];
        // recount
        for (int j = i; j < i + p.length(); j++) have[s.charAt(j) - 'a']++;
        if (Arrays.equals(have, need)) return true;
    }
    return false;
}`, cs: `bool HasAnagram(string s, string p)
{
    var need = new int[26];
    foreach (char c in p) need[c - 'a']++;
    for (int i = 0; i + p.Length <= s.Length; i++)
    {
        var have = new int[26];
        // recount
        for (int j = i; j < i + p.Length; j++) have[s[j] - 'a']++;
        if (have.SequenceEqual(need)) return true;
    }
    return false;
}` },
        good: { py: `from collections import Counter

def has_anagram(s, p):
    need, k = Counter(p), len(p)
    have = Counter(s[:k])
    if have == need:
        return True
    for i in range(k, len(s)):
        have[s[i]] += 1                  # one enters
        have[s[i - k]] -= 1              # one leaves
        if have == need:                 # 26 letters at most
            return True
    return False`, java: `boolean hasAnagram(String s, String p) {
    int k = p.length();
    if (k > s.length()) return false;
    int[] need = new int[26], have = new int[26];
    for (int i = 0; i < k; i++) {
        need[p.charAt(i) - 'a']++;
        have[s.charAt(i) - 'a']++;
    }
    if (Arrays.equals(have, need)) return true;
    for (int i = k; i < s.length(); i++) {
        have[s.charAt(i) - 'a']++;       // one enters
        have[s.charAt(i - k) - 'a']--;   // one leaves
        if (Arrays.equals(have, need)) return true;
    }
    return false;
}`, cs: `bool HasAnagram(string s, string p)
{
    int k = p.Length;
    if (k > s.Length) return false;
    int[] need = new int[26], have = new int[26];
    for (int i = 0; i < k; i++) { need[p[i] - 'a']++; have[s[i] - 'a']++; }
    if (have.SequenceEqual(need)) return true;
    for (int i = k; i < s.Length; i++)
    {
        have[s[i] - 'a']++;              // one enters
        have[s[i - k] - 'a']--;          // one leaves
        if (have.SequenceEqual(need)) return true;
    }
    return false;
}` } },
      { why: "After adding one element the window may need to shrink by several, so shrinking with `if` (once) misses shorter windows. Shrink with `while`.",
        bad: { py: `def min_len(nums, target):             # shortest window with sum >= target
    l = total = 0
    best = float("inf")
    for r, x in enumerate(nums):
        total += x
        if total >= target:              # shrinks only once
            best = min(best, r - l + 1)
            total -= nums[l]
            l += 1
    return 0 if best == float("inf") else best`, java: `int minLen(int[] nums, int target) {
    int l = 0, total = 0, best = Integer.MAX_VALUE;
    for (int r = 0; r < nums.length; r++) {
        total += nums[r];
        if (total >= target) {           // shrinks only once
            best = Math.min(best, r - l + 1);
            total -= nums[l++];
        }
    }
    return best == Integer.MAX_VALUE ? 0 : best;
}`, cs: `int MinLen(int[] nums, int target)
{
    int l = 0, total = 0, best = int.MaxValue;
    for (int r = 0; r < nums.Length; r++)
    {
        total += nums[r];
        if (total >= target)             // shrinks only once
        {
            best = Math.Min(best, r - l + 1);
            total -= nums[l++];
        }
    }
    return best == int.MaxValue ? 0 : best;
}` },
        good: { py: `def min_len(nums, target):
    l = total = 0
    best = float("inf")
    for r, x in enumerate(nums):
        total += x
        while total >= target:           # shrink as far as it stays valid
            best = min(best, r - l + 1)
            total -= nums[l]
            l += 1
    return 0 if best == float("inf") else best`, java: `int minLen(int[] nums, int target) {
    int l = 0, total = 0, best = Integer.MAX_VALUE;
    for (int r = 0; r < nums.length; r++) {
        total += nums[r];
        while (total >= target) {        // shrink as far as it stays valid
            best = Math.min(best, r - l + 1);
            total -= nums[l++];
        }
    }
    return best == Integer.MAX_VALUE ? 0 : best;
}`, cs: `int MinLen(int[] nums, int target)
{
    int l = 0, total = 0, best = int.MaxValue;
    for (int r = 0; r < nums.Length; r++)
    {
        total += nums[r];
        while (total >= target)          // shrink as far as it stays valid
        {
            best = Math.Min(best, r - l + 1);
            total -= nums[l++];
        }
    }
    return best == int.MaxValue ? 0 : best;
}` } },
  ],
  stack: [
      { why: "Scanning the stack for the minimum is O(n) per call. Store the minimum so far alongside each value, and `get_min` is O(1).",
        bad: { py: `class MinStack:
    def __init__(self):
        self.items = []

    def push(self, x):
        self.items.append(x)

    def get_min(self):
        return min(self.items)           # O(n) every call`, java: `class MinStack {
    private final Deque<Integer> items = new ArrayDeque<>();

    void push(int x) { items.push(x); }

    int getMin() { return Collections.min(items); }   // O(n) every call
}`, cs: `class MinStack
{
    private readonly Stack<int> items = new();

    public void Push(int x) => items.Push(x);

    public int GetMin() => items.Min();   // O(n) every call
}` },
        good: { py: `class MinStack:
    def __init__(self):
        self.items = []                  # (value, min so far)

    def push(self, x):
        low = min(x, self.items[-1][1]) if self.items else x
        self.items.append((x, low))

    def pop(self):
        return self.items.pop()[0]

    def get_min(self):
        return self.items[-1][1]         # O(1)`, java: `class MinStack {
    // {value, min so far}
    private final Deque<int[]> items = new ArrayDeque<>();

    void push(int x) {
        int low = items.isEmpty() ? x : Math.min(x, items.peek()[1]);
        items.push(new int[] {x, low});
    }

    int pop() { return items.pop()[0]; }

    int getMin() { return items.peek()[1]; }   // O(1)
}`, cs: `class MinStack
{
    private readonly Stack<(int Value, int Min)> items = new();

    public void Push(int x) =>
        items.Push((x, items.Count == 0
            ? x : Math.Min(x, items.Peek().Min)));

    public int Pop() => items.Pop().Value;

    public int GetMin() => items.Peek().Min;   // O(1)
}` } },
      { why: "If you need how far apart two elements are, push their indexes. Pushing values and searching for the index later is slow, and wrong when values repeat.",
        bad: { py: `def days_until_warmer(temps):
    res, stack = [0] * len(temps), []
    for i, t in enumerate(temps):
        while stack and stack[-1] < t:
            j = temps.index(stack.pop())  # O(n), and wrong for repeats
            res[j] = i - j
        stack.append(t)
    return res`, java: `int[] daysUntilWarmer(int[] temps) {
    int[] res = new int[temps.length];
    Deque<Integer> stack = new ArrayDeque<>();   // values
    for (int i = 0; i < temps.length; i++) {
        while (!stack.isEmpty() && stack.peek() < temps[i]) {
            int v = stack.pop(), j = 0;
            // O(n), and wrong for repeats
            while (temps[j] != v) j++;
            res[j] = i - j;
        }
        stack.push(temps[i]);
    }
    return res;
}`, cs: `int[] DaysUntilWarmer(int[] temps)
{
    var res = new int[temps.Length];
    var stack = new Stack<int>();                // values
    for (int i = 0; i < temps.Length; i++)
    {
        while (stack.Count > 0 && stack.Peek() < temps[i])
        {
            // wrong for repeats
            int j = Array.IndexOf(temps, stack.Pop());
            res[j] = i - j;
        }
        stack.Push(temps[i]);
    }
    return res;
}` },
        good: { py: `def days_until_warmer(temps):
    res, stack = [0] * len(temps), []    # stack of indexes
    for i, t in enumerate(temps):
        while stack and temps[stack[-1]] < t:
            j = stack.pop()
            res[j] = i - j
        stack.append(i)
    return res`, java: `int[] daysUntilWarmer(int[] temps) {
    int[] res = new int[temps.length];
    Deque<Integer> stack = new ArrayDeque<>();   // indexes
    for (int i = 0; i < temps.length; i++) {
        while (!stack.isEmpty() && temps[stack.peek()] < temps[i]) {
            int j = stack.pop();
            res[j] = i - j;
        }
        stack.push(i);
    }
    return res;
}`, cs: `int[] DaysUntilWarmer(int[] temps)
{
    var res = new int[temps.Length];
    var stack = new Stack<int>();                // indexes
    for (int i = 0; i < temps.Length; i++)
    {
        while (stack.Count > 0 && temps[stack.Peek()] < temps[i])
        {
            int j = stack.Pop();
            res[j] = i - j;
        }
        stack.Push(i);
    }
    return res;
}` } },
      { why: "String replacements can't tell what \"..\" should cancel. Split into parts and use a stack: a name is pushed, \"..\" pops, \".\" and empty parts are skipped.",
        bad: { py: `def simplify(path):
    while "//" in path:
        path = path.replace("//", "/")
    path = path.replace("/./", "/")      # "/a/../b" is left unsimplified
    return path.rstrip("/") or "/"`, java: `String simplify(String path) {
    while (path.contains("//")) path = path.replace("//", "/");
    path = path.replace("/./", "/");     // "/a/../b" is left unsimplified
    return path.length() > 1 && path.endsWith("/")
        ? path.substring(0, path.length() - 1) : path;
}`, cs: `string Simplify(string path)
{
    while (path.Contains("//")) path = path.Replace("//", "/");
    path = path.Replace("/./", "/");     // "/a/../b" is left unsimplified
    return path.Length > 1 ? path.TrimEnd('/') : path;
}` },
        good: { py: `def simplify(path):
    stack = []
    for part in path.split("/"):
        if part == "..":
            if stack:
                stack.pop()              # go up one level
        elif part and part != ".":
            stack.append(part)
    return "/" + "/".join(stack)`, java: `String simplify(String path) {
    Deque<String> stack = new ArrayDeque<>();
    for (String part : path.split("/")) {
        // up one
        if (part.equals("..")) { if (!stack.isEmpty()) stack.pollLast(); }
        else if (!part.isEmpty() && !part.equals(".")) stack.addLast(part);
    }
    return "/" + String.join("/", stack);
}`, cs: `string Simplify(string path)
{
    var stack = new List<string>();
    foreach (var part in path.Split('/'))
    {
        if (part == "..")
        {
            if (stack.Count > 0) stack.RemoveAt(stack.Count - 1);
        }
        else if (part != "" && part != ".") stack.Add(part);
    }
    return "/" + string.Join("/", stack);
}` } },
  ],
  bsearch: [
      { why: "When the search keeps `l = m`, the middle must round up. With `(l + r) // 2`, two elements left means `m == l` forever: an infinite loop.",
        bad: { py: `def last_true(lo, hi, ok):              # largest x with ok(x)
    l, r = lo, hi
    while l < r:
        m = (l + r) // 2                 # rounds down...
        if ok(m):
            l = m                        # ...so l == m loops forever
        else:
            r = m - 1
    return l`, java: `int lastTrue(int lo, int hi, IntPredicate ok) {
    int l = lo, r = hi;
    while (l < r) {
        int m = (l + r) / 2;             // rounds down, and can overflow
        if (ok.test(m)) l = m;           // l == m loops forever
        else r = m - 1;
    }
    return l;
}`, cs: `int LastTrue(int lo, int hi, Func<int, bool> ok)
{
    int l = lo, r = hi;
    while (l < r)
    {
        int m = (l + r) / 2;             // rounds down, and can overflow
        if (ok(m)) l = m;                // l == m loops forever
        else r = m - 1;
    }
    return l;
}` },
        good: { py: `def last_true(lo, hi, ok):
    l, r = lo, hi
    while l < r:
        m = (l + r + 1) // 2             # round up when l = m
        if ok(m):
            l = m
        else:
            r = m - 1
    return l`, java: `int lastTrue(int lo, int hi, IntPredicate ok) {
    int l = lo, r = hi;
    while (l < r) {
        int m = l + (r - l + 1) / 2;     // round up, no overflow
        if (ok.test(m)) l = m;
        else r = m - 1;
    }
    return l;
}`, cs: `int LastTrue(int lo, int hi, Func<int, bool> ok)
{
    int l = lo, r = hi;
    while (l < r)
    {
        int m = l + (r - l + 1) / 2;     // round up, no overflow
        if (ok(m)) l = m;
        else r = m - 1;
    }
    return l;
}` } },
      { why: "When the answer is a number and \"is this big enough?\" flips from no to yes once, binary search the answer: O(n log max) instead of trying every value.",
        bad: { py: `import math

def min_speed(piles, hours):           # Koko eating bananas
    speed = 1
    while sum(math.ceil(p / speed) for p in piles) > hours:
        speed += 1                       # tries every speed: O(n · max)
    return speed`, java: `int minSpeed(int[] piles, int hours) {
    int speed = 1;
    while (hoursAt(piles, speed) > hours) speed++;   // O(n · max)
    return speed;
}

long hoursAt(int[] piles, int speed) {
    long h = 0;
    for (int p : piles) h += (p + speed - 1) / speed;
    return h;
}`, cs: `int MinSpeed(int[] piles, int hours)
{
    int speed = 1;
    while (HoursAt(piles, speed) > hours) speed++;   // O(n · max)
    return speed;
}

long HoursAt(int[] piles, int speed) =>
    piles.Sum(p => (long)(p + speed - 1) / speed);` },
        good: { py: `import math

def min_speed(piles, hours):
    l, r = 1, max(piles)
    while l < r:
        m = (l + r) // 2
        if sum(math.ceil(p / m) for p in piles) <= hours:
            r = m                        # fast enough: try slower
        else:
            l = m + 1
    return l                             # O(n log max)`, java: `int minSpeed(int[] piles, int hours) {
    int l = 1, r = Arrays.stream(piles).max().getAsInt();
    while (l < r) {
        int m = l + (r - l) / 2;
        if (hoursAt(piles, m) <= hours) r = m;   // fast enough: try slower
        else l = m + 1;
    }
    return l;                            // O(n log max)
}

long hoursAt(int[] piles, int speed) {
    long h = 0;
    for (int p : piles) h += (p + speed - 1) / speed;
    return h;
}`, cs: `int MinSpeed(int[] piles, int hours)
{
    int l = 1, r = piles.Max();
    while (l < r)
    {
        int m = l + (r - l) / 2;
        if (HoursAt(piles, m) <= hours) r = m;   // fast enough: try slower
        else l = m + 1;
    }
    return l;                            // O(n log max)
}

long HoursAt(int[] piles, int speed) =>
    piles.Sum(p => (long)(p + speed - 1) / speed);` } },
      { why: "A linear scan for the insert position ignores the order. The library binary search does it in O(log n). Know how it reports \"not found\", and that Java's and C#'s return any match when values repeat.",
        bad: { py: `def insert_pos(a, x):                  # a is sorted
    for i, v in enumerate(a):
        if v >= x:
            return i                     # O(n)
    return len(a)`, java: `int insertPos(int[] a, int x) {         // a is sorted
    for (int i = 0; i < a.length; i++)
        if (a[i] >= x) return i;         // O(n)
    return a.length;
}`, cs: `int InsertPos(int[] a, int x)           // a is sorted
{
    for (int i = 0; i < a.Length; i++)
        if (a[i] >= x) return i;         // O(n)
    return a.Length;
}` },
        good: { py: `from bisect import bisect_left

def insert_pos(a, x):
    return bisect_left(a, x)             # O(log n)`, java: `int insertPos(int[] a, int x) {
    int i = Arrays.binarySearch(a, x);   // O(log n)
    // any match if x repeats; not found: -(insert point) - 1
    return i >= 0 ? i : -(i + 1);
}`, cs: `int InsertPos(int[] a, int x)
{
    int i = Array.BinarySearch(a, x);    // O(log n)
    // any match if x repeats; not found: ~insert point
    return i >= 0 ? i : ~i;
}` } },
  ],
  linked: [
      { why: "A set of visited nodes finds a cycle but uses O(n) memory. Floyd's fast and slow pointers meet inside any cycle, with O(1) memory.",
        bad: { py: `def has_cycle(head):
    seen = set()
    while head:
        if head in seen:
            return True
        seen.add(head)                   # O(n) memory
        head = head.next
    return False`, java: `boolean hasCycle(ListNode head) {
    Set<ListNode> seen = new HashSet<>();
    for (ListNode n = head; n != null; n = n.next)
        if (!seen.add(n)) return true;   // O(n) memory
    return false;
}`, cs: `bool HasCycle(ListNode head)
{
    var seen = new HashSet<ListNode>();
    for (var n = head; n != null; n = n.next)
        if (!seen.Add(n)) return true;   // O(n) memory
    return false;
}` },
        good: { py: `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:                 # met inside a cycle
            return True
    return False`, java: `boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;   // met inside a cycle
    }
    return false;
}`, cs: `bool HasCycle(ListNode head)
{
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null)
    {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;   // met inside a cycle
    }
    return false;
}` } },
      { why: "Counting the length first takes two passes. Start a second pointer n steps behind, and when the first reaches the end, the second is at the node to remove.",
        bad: { py: `def remove_nth_from_end(head, n):
    length, node = 0, head
    while node:                          # pass 1: count
        length, node = length + 1, node.next
    dummy = ListNode(0, head)
    node = dummy
    for _ in range(length - n):          # pass 2: walk again
        node = node.next
    node.next = node.next.next
    return dummy.next`, java: `ListNode removeNthFromEnd(ListNode head, int n) {
    int length = 0;
    for (ListNode x = head; x != null; x = x.next) length++;   // pass 1
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode node = dummy;
    for (int i = 0; i < length - n; i++) node = node.next;     // pass 2
    node.next = node.next.next;
    return dummy.next;
}`, cs: `ListNode RemoveNthFromEnd(ListNode head, int n)
{
    int length = 0;
    for (var x = head; x != null; x = x.next) length++;        // pass 1
    var dummy = new ListNode(0) { next = head };
    var node = dummy;
    for (int i = 0; i < length - n; i++) node = node.next;     // pass 2
    node.next = node.next.next;
    return dummy.next;
}` },
        good: { py: `def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    lead = trail = dummy
    for _ in range(n + 1):               # open a gap of n
        lead = lead.next
    while lead:                          # move both until lead falls off
        lead, trail = lead.next, trail.next
    trail.next = trail.next.next         # one pass
    return dummy.next`, java: `ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode lead = dummy, trail = dummy;
    for (int i = 0; i <= n; i++) lead = lead.next;   // open a gap of n
    while (lead != null) { lead = lead.next; trail = trail.next; }
    trail.next = trail.next.next;        // one pass
    return dummy.next;
}`, cs: `ListNode RemoveNthFromEnd(ListNode head, int n)
{
    var dummy = new ListNode(0) { next = head };
    ListNode lead = dummy, trail = dummy;
    for (int i = 0; i <= n; i++) lead = lead.next;   // open a gap of n
    while (lead != null) { lead = lead.next; trail = trail.next; }
    trail.next = trail.next.next;        // one pass
    return dummy.next;
}` } },
      { why: "An LRU cache that keeps its order in a list pays O(n) to move a key on every access. A hash map plus a linked list (built in as OrderedDict / LinkedHashMap) does it in O(1).",
        bad: { py: `class LRUCache:
    def __init__(self, capacity):
        self.cap, self.data, self.order = capacity, {}, []

    def get(self, key):
        if key not in self.data:
            return -1
        self.order.remove(key)           # O(n)
        self.order.append(key)
        return self.data[key]`, java: `class LRUCache {
    private final int cap;
    private final Map<Integer, Integer> data = new HashMap<>();
    private final List<Integer> order = new ArrayList<>();
    LRUCache(int cap) { this.cap = cap; }

    int get(int key) {
        if (!data.containsKey(key)) return -1;
        order.remove(Integer.valueOf(key));   // O(n)
        order.add(key);
        return data.get(key);
    }
}`, cs: `class LRUCache
{
    private readonly int cap;
    private readonly Dictionary<int, int> data = new();
    private readonly List<int> order = new();
    public LRUCache(int cap) => this.cap = cap;

    public int Get(int key)
    {
        if (!data.TryGetValue(key, out int v)) return -1;
        order.Remove(key);               // O(n)
        order.Add(key);
        return v;
    }
}` },
        good: { py: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cap, self.data = capacity, OrderedDict()

    def get(self, key):
        if key not in self.data:
            return -1
        self.data.move_to_end(key)       # O(1)
        return self.data[key]

    def put(self, key, value):
        self.data[key] = value
        self.data.move_to_end(key)
        if len(self.data) > self.cap:
            self.data.popitem(last=False)   # drop the oldest`, java: `class LRUCache extends LinkedHashMap<Integer, Integer> {
    private final int cap;
    // access order
    LRUCache(int cap) { super(16, 0.75f, true); this.cap = cap; }

    // O(1), moves to end
    int get(int key) { return getOrDefault(key, -1); }

    @Override
    protected boolean removeEldestEntry(
            Map.Entry<Integer, Integer> eldest) {
        return size() > cap;             // drop the oldest
    }
}`, cs: `class LRUCache
{
    private readonly int cap;
    private readonly Dictionary<int, LinkedListNode<(int Key, int Val)>> map
        = new();
    // oldest first
    private readonly LinkedList<(int Key, int Val)> order = new();
    public LRUCache(int cap) => this.cap = cap;

    public int Get(int key)
    {
        if (!map.TryGetValue(key, out var node)) return -1;
        order.Remove(node);              // O(1): we hold the node
        order.AddLast(node);
        return node.Value.Val;
    }
}` } },
  ],
  trees: [
      { why: "Collecting every root-to-leaf path copies lists and stores them all. Pass the remaining sum down instead: no lists, O(h) space.",
        bad: { py: `def has_path_sum(root, target):
    paths = []
    def collect(node, path):
        if not node:
            return
        path = path + [node.val]         # a copy per node
        if not node.left and not node.right:
            paths.append(path)
        collect(node.left, path)
        collect(node.right, path)
    collect(root, [])
    return any(sum(p) == target for p in paths)`, java: `boolean hasPathSum(TreeNode root, int target) {
    List<List<Integer>> paths = new ArrayList<>();
    collect(root, new ArrayList<>(), paths);
    return paths.stream()
        .anyMatch(p -> p.stream().mapToInt(x -> x).sum() == target);
}

void collect(TreeNode n, List<Integer> path, List<List<Integer>> paths) {
    if (n == null) return;
    List<Integer> next = new ArrayList<>(path);   // a copy per node
    next.add(n.val);
    if (n.left == null && n.right == null) paths.add(next);
    collect(n.left, next, paths);
    collect(n.right, next, paths);
}`, cs: `bool HasPathSum(TreeNode root, int target)
{
    var paths = new List<List<int>>();
    Collect(root, new List<int>(), paths);
    return paths.Any(p => p.Sum() == target);
}

void Collect(TreeNode n, List<int> path, List<List<int>> paths)
{
    if (n == null) return;
    var next = new List<int>(path) { n.val };   // a copy per node
    if (n.left == null && n.right == null) paths.Add(next);
    Collect(n.left, next, paths);
    Collect(n.right, next, paths);
}` },
        good: { py: `def has_path_sum(node, target):
    if not node:
        return False
    target -= node.val                   # what's still needed below
    if not node.left and not node.right:
        return target == 0
    return (has_path_sum(node.left, target)
            or has_path_sum(node.right, target))`, java: `boolean hasPathSum(TreeNode n, int target) {
    if (n == null) return false;
    target -= n.val;                     // what's still needed below
    if (n.left == null && n.right == null) return target == 0;
    return hasPathSum(n.left, target) || hasPathSum(n.right, target);
}`, cs: `bool HasPathSum(TreeNode n, int target)
{
    if (n == null) return false;
    target -= n.val;                     // what's still needed below
    if (n.left == null && n.right == null) return target == 0;
    return HasPathSum(n.left, target) || HasPathSum(n.right, target);
}` } },
      { why: "Recording both root-to-node paths and comparing them takes extra lists and passes. One recursion can return where p and q were found, and the first node that sees both is the answer.",
        bad: { py: `def lca(root, p, q):
    def path_to(node, target, path):
        if not node:
            return False
        path.append(node)
        if node is target or path_to(node.left, target, path) \\
                or path_to(node.right, target, path):
            return True
        path.pop()
        return False
    a, b = [], []
    path_to(root, p, a)
    path_to(root, q, b)
    i = 0
    while i < min(len(a), len(b)) and a[i] is b[i]:
        i += 1
    return a[i - 1]`, java: `TreeNode lca(TreeNode root, TreeNode p, TreeNode q) {
    List<TreeNode> a = new ArrayList<>(), b = new ArrayList<>();
    pathTo(root, p, a);                  // two extra lists
    pathTo(root, q, b);
    int i = 0;
    while (i < Math.min(a.size(), b.size()) && a.get(i) == b.get(i)) i++;
    return a.get(i - 1);
}

boolean pathTo(TreeNode n, TreeNode target, List<TreeNode> path) {
    if (n == null) return false;
    path.add(n);
    if (n == target || pathTo(n.left, target, path)
            || pathTo(n.right, target, path))
        return true;
    path.remove(path.size() - 1);
    return false;
}`, cs: `TreeNode Lca(TreeNode root, TreeNode p, TreeNode q)
{
    List<TreeNode> a = new(), b = new();
    PathTo(root, p, a);                  // two extra lists
    PathTo(root, q, b);
    int i = 0;
    while (i < Math.Min(a.Count, b.Count) && a[i] == b[i]) i++;
    return a[i - 1];
}

bool PathTo(TreeNode n, TreeNode target, List<TreeNode> path)
{
    if (n == null) return false;
    path.Add(n);
    if (n == target || PathTo(n.left, target, path)
        || PathTo(n.right, target, path))
        return true;
    path.RemoveAt(path.Count - 1);
    return false;
}` },
        good: { py: `def lca(node, p, q):
    if not node or node is p or node is q:
        return node
    left = lca(node.left, p, q)
    right = lca(node.right, p, q)
    if left and right:
        return node                      # p and q on different sides
    return left or right`, java: `TreeNode lca(TreeNode n, TreeNode p, TreeNode q) {
    if (n == null || n == p || n == q) return n;
    TreeNode left = lca(n.left, p, q), right = lca(n.right, p, q);
    if (left != null && right != null) return n;   // on different sides
    return left != null ? left : right;
}`, cs: `TreeNode Lca(TreeNode n, TreeNode p, TreeNode q)
{
    if (n == null || n == p || n == q) return n;
    TreeNode left = Lca(n.left, p, q), right = Lca(n.right, p, q);
    if (left != null && right != null) return n;   // on different sides
    return left ?? right;
}` } },
      { why: "Re-walking from the root to find each node's path maximum is O(n·h). Pass the maximum so far down as you go: each node is visited once.",
        bad: { py: `def good_nodes(root):                  # node >= every value above it
    count, stack = 0, [root]
    while stack:
        node = stack.pop()
        if node:
            # walks from the root again
            if node.val >= path_max(root, node):
                count += 1
            stack += [node.left, node.right]
    return count`, java: `int goodNodes(TreeNode root) {
    int count = 0;
    Deque<TreeNode> stack = new ArrayDeque<>(List.of(root));
    while (!stack.isEmpty()) {
        TreeNode n = stack.pop();
        // walks from the root again
        if (n.val >= pathMax(root, n)) count++;
        if (n.left != null) stack.push(n.left);
        if (n.right != null) stack.push(n.right);
    }
    return count;
}`, cs: `int GoodNodes(TreeNode root)
{
    int count = 0;
    var stack = new Stack<TreeNode>(new[] { root });
    while (stack.Count > 0)
    {
        var n = stack.Pop();
        // walks from the root again
        if (n.val >= PathMax(root, n)) count++;
        if (n.left != null) stack.Push(n.left);
        if (n.right != null) stack.Push(n.right);
    }
    return count;
}` },
        good: { py: `def good_nodes(node, best=float("-inf")):
    if not node:
        return 0
    good = 1 if node.val >= best else 0
    best = max(best, node.val)           # carried down, never recomputed
    return good + good_nodes(node.left, best) + good_nodes(node.right, best)`, java: `int goodNodes(TreeNode n, int best) {   // call with Integer.MIN_VALUE
    if (n == null) return 0;
    int good = n.val >= best ? 1 : 0;
    best = Math.max(best, n.val);        // carried down, never recomputed
    return good + goodNodes(n.left, best) + goodNodes(n.right, best);
}`, cs: `int GoodNodes(TreeNode n, int best = int.MinValue)
{
    if (n == null) return 0;
    int good = n.val >= best ? 1 : 0;
    best = Math.Max(best, n.val);        // carried down, never recomputed
    return good + GoodNodes(n.left, best) + GoodNodes(n.right, best);
}` } },
  ],
  heap: [
      { why: "Pouring all N values into one list and sorting is O(N log N). A heap holding just the current head of each of the k lists merges in O(N log k).",
        bad: { py: `def merge_k(lists):                    # lists of sorted numbers
    out = []
    for lst in lists:
        out.extend(lst)
    return sorted(out)                   # O(N log N), ignores the order`, java: `List<Integer> mergeK(List<List<Integer>> lists) {
    List<Integer> out = new ArrayList<>();
    for (List<Integer> l : lists) out.addAll(l);
    Collections.sort(out);               // O(N log N), ignores the order
    return out;
}`, cs: `List<int> MergeK(List<List<int>> lists)
{
    var output = lists.SelectMany(l => l).ToList();
    output.Sort();                       // O(N log N), ignores the order
    return output;
}` },
        good: { py: `import heapq

def merge_k(lists):
    heap = [(lst[0], i, 0) for i, lst in enumerate(lists) if lst]
    heapq.heapify(heap)                  # one head per list
    out = []
    while heap:
        val, i, j = heapq.heappop(heap)
        out.append(val)
        if j + 1 < len(lists[i]):
            heapq.heappush(heap, (lists[i][j + 1], i, j + 1))
    return out                           # O(N log k)`, java: `List<Integer> mergeK(List<List<Integer>> lists) {
    // {value, list, index}, smallest value first
    PriorityQueue<int[]> heap =
        new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
    for (int i = 0; i < lists.size(); i++)
        if (!lists.get(i).isEmpty())
            heap.offer(new int[] {lists.get(i).get(0), i, 0});
    List<Integer> out = new ArrayList<>();
    while (!heap.isEmpty()) {
        int[] t = heap.poll();
        out.add(t[0]);
        List<Integer> l = lists.get(t[1]);
        if (t[2] + 1 < l.size())
            heap.offer(new int[] {l.get(t[2] + 1), t[1], t[2] + 1});
    }
    return out;                          // O(N log k)
}`, cs: `List<int> MergeK(List<List<int>> lists)
{
    // one head per list
    var heap = new PriorityQueue<(int List, int Index), int>();
    for (int i = 0; i < lists.Count; i++)
        if (lists[i].Count > 0) heap.Enqueue((i, 0), lists[i][0]);
    var output = new List<int>();
    while (heap.TryDequeue(out var t, out int val))
    {
        output.Add(val);
        if (t.Index + 1 < lists[t.List].Count)
            heap.Enqueue((t.List, t.Index + 1), lists[t.List][t.Index + 1]);
    }
    return output;                       // O(N log k)
}` } },
      { why: "Re-sorting on every insert to read the middle is O(n log n) per number. Two heaps (a max-heap for the lower half, a min-heap for the upper) give the median in O(log n) per insert.",
        bad: { py: `class MedianFinder:
    def __init__(self):
        self.nums = []

    def add(self, x):
        self.nums.append(x)
        self.nums.sort()                 # O(n log n) per insert

    def median(self):
        n, a = len(self.nums), self.nums
        return a[n // 2] if n % 2 else (a[n // 2 - 1] + a[n // 2]) / 2`, java: `class MedianFinder {
    private final List<Integer> nums = new ArrayList<>();

    void add(int x) {
        nums.add(x);
        Collections.sort(nums);          // O(n log n) per insert
    }

    double median() {
        int n = nums.size();
        return n % 2 == 1 ? nums.get(n / 2)
            : (nums.get(n / 2 - 1) + nums.get(n / 2)) / 2.0;
    }
}`, cs: `class MedianFinder
{
    private readonly List<int> nums = new();

    public void Add(int x)
    {
        nums.Add(x);
        nums.Sort();                     // O(n log n) per insert
    }

    public double Median()
    {
        int n = nums.Count;
        return n % 2 == 1 ? nums[n / 2]
            : (nums[n / 2 - 1] + nums[n / 2]) / 2.0;
    }
}` },
        good: { py: `import heapq

class MedianFinder:
    def __init__(self):
        self.low, self.high = [], []     # max-heap (negated), min-heap

    def add(self, x):
        heapq.heappush(self.low, -x)
        heapq.heappush(self.high, -heapq.heappop(self.low))
        if len(self.high) > len(self.low):
            heapq.heappush(self.low, -heapq.heappop(self.high))

    def median(self):
        if len(self.low) > len(self.high):
            return -self.low[0]
        return (-self.low[0] + self.high[0]) / 2`, java: `class MedianFinder {
    private final PriorityQueue<Integer> low =
        // lower half, max on top
        new PriorityQueue<>(Comparator.reverseOrder());
    // upper half
    private final PriorityQueue<Integer> high = new PriorityQueue<>();

    void add(int x) {
        low.offer(x);
        high.offer(low.poll());
        if (high.size() > low.size()) low.offer(high.poll());
    }

    double median() {
        return low.size() > high.size() ? low.peek()
            : (low.peek() + high.peek()) / 2.0;
    }
}`, cs: `class MedianFinder
{
    // lower half: max on top (negated priority); upper half: min on top
    private readonly PriorityQueue<int, int> low = new(), high = new();

    public void Add(int x)
    {
        low.Enqueue(x, -x);
        int y = low.Dequeue();
        high.Enqueue(y, y);
        if (high.Count > low.Count)
        {
            int z = high.Dequeue();
            low.Enqueue(z, -z);
        }
    }

    public double Median() =>
        low.Count > high.Count ? low.Peek()
            : (low.Peek() + high.Peek()) / 2.0;
}` } },
      { why: "Scanning every room for a free one is O(rooms) per meeting. A min-heap of end times always has the room that frees up first on top.",
        bad: { py: `def min_rooms(meetings):
    ends = []                            # end time of each room
    for start, end in sorted(meetings):
        for i, e in enumerate(ends):     # scan every room
            if e <= start:
                ends[i] = end
                break
        else:
            ends.append(end)
    return len(ends)`, java: `int minRooms(int[][] meetings) {
    Arrays.sort(meetings, (a, b) -> Integer.compare(a[0], b[0]));
    List<Integer> ends = new ArrayList<>();
    for (int[] m : meetings) {
        int i = 0;
        // scan every room
        while (i < ends.size() && ends.get(i) > m[0]) i++;
        if (i < ends.size()) ends.set(i, m[1]);
        else ends.add(m[1]);
    }
    return ends.size();
}`, cs: `int MinRooms(int[][] meetings)
{
    var ends = new List<int>();          // end time of each room
    foreach (var m in meetings.OrderBy(m => m[0]))
    {
        int i = ends.FindIndex(e => e <= m[0]);   // scans every room
        if (i >= 0) ends[i] = m[1];
        else ends.Add(m[1]);
    }
    return ends.Count;
}` },
        good: { py: `import heapq

def min_rooms(meetings):
    ends = []                            # min-heap of end times
    for start, end in sorted(meetings):
        if ends and ends[0] <= start:
            # reuse the room that freed first
            heapq.heapreplace(ends, end)
        else:
            heapq.heappush(ends, end)
    return len(ends)`, java: `int minRooms(int[][] meetings) {
    Arrays.sort(meetings, (a, b) -> Integer.compare(a[0], b[0]));
    // earliest end on top
    PriorityQueue<Integer> ends = new PriorityQueue<>();
    for (int[] m : meetings) {
        // reuse it
        if (!ends.isEmpty() && ends.peek() <= m[0]) ends.poll();
        ends.offer(m[1]);
    }
    return ends.size();
}`, cs: `int MinRooms(int[][] meetings)
{
    var ends = new PriorityQueue<int, int>();   // earliest end on top
    foreach (var m in meetings.OrderBy(m => m[0]))
    {
        // reuse it
        if (ends.Count > 0 && ends.Peek() <= m[0]) ends.Dequeue();
        ends.Enqueue(m[1], m[1]);
    }
    return ends.Count;
}` } },
  ],
  trie: [
      { why: "Testing each word against every root is O(words × roots × L). Put the roots in a trie and walk each word only until the first root ends.",
        bad: { py: `def replace_words(roots, sentence):
    out = []
    for w in sentence.split():
        best = w
        for r in roots:                  # every root, for every word
            if w.startswith(r) and len(r) < len(best):
                best = r
        out.append(best)
    return " ".join(out)`, java: `String replaceWords(List<String> roots, String sentence) {
    List<String> out = new ArrayList<>();
    for (String w : sentence.split(" ")) {
        String best = w;
        for (String r : roots)           // every root, for every word
            if (w.startsWith(r) && r.length() < best.length()) best = r;
        out.add(best);
    }
    return String.join(" ", out);
}`, cs: `string ReplaceWords(List<string> roots, string sentence)
{
    var output = new List<string>();
    foreach (var w in sentence.Split(' '))
    {
        string best = w;
        foreach (var r in roots)         // every root, for every word
            if (w.StartsWith(r) && r.Length < best.Length) best = r;
        output.Add(best);
    }
    return string.Join(" ", output);
}` },
        good: { py: `def replace_words(roots, sentence):
    trie = {}
    for r in roots:
        node = trie
        for c in r:
            node = node.setdefault(c, {})
        node["$"] = True                 # a root ends here
    def shortest_root(w):
        node = trie
        for i, c in enumerate(w):
            if c not in node:
                return w
            node = node[c]
            if "$" in node:
                return w[:i + 1]         # stop at the first root
        return w
    return " ".join(shortest_root(w) for w in sentence.split())`, java: `String replaceWords(List<String> roots, String sentence) {
    Node trie = new Node();
    for (String r : roots) {
        Node node = trie;
        for (char c : r.toCharArray()) {
            if (node.next[c - 'a'] == null) node.next[c - 'a'] = new Node();
            node = node.next[c - 'a'];
        }
        node.isWord = true;
    }
    StringBuilder out = new StringBuilder();
    for (String w : sentence.split(" ")) {
        Node node = trie;
        int i = 0;
        while (i < w.length() && !node.isWord
                && node.next[w.charAt(i) - 'a'] != null)
            node = node.next[w.charAt(i++) - 'a'];
        if (out.length() > 0) out.append(' ');
        // stop at the first root
        out.append(node.isWord ? w.substring(0, i) : w);
    }
    return out.toString();
}`, cs: `string ReplaceWords(List<string> roots, string sentence)
{
    var trie = new Node();
    foreach (var r in roots)
    {
        var node = trie;
        foreach (char c in r)
        {
            if (!node.Next.TryGetValue(c, out var child))
                node.Next[c] = child = new Node();
            node = child;
        }
        node.IsWord = true;
    }
    return string.Join(" ", sentence.Split(' ').Select(w =>
    {
        var node = trie;
        int i = 0;
        while (i < w.Length && !node.IsWord
            && node.Next.TryGetValue(w[i], out var child))
        {
            node = child;
            i++;
        }
        return node.IsWord ? w[..i] : w;   // stop at the first root
    }));
}` } },
      { why: "Filtering the whole word list for every keystroke is O(all words). Walk the trie to the prefix node, then collect only the words below it.",
        bad: { py: `def suggest(words, prefix):
    # every word
    return sorted(w for w in words if w.startswith(prefix))[:3]`, java: `List<String> suggest(List<String> words, String prefix) {
    return words.stream().filter(w -> w.startsWith(prefix))   // every word
        .sorted().limit(3).toList();
}`, cs: `List<string> Suggest(List<string> words, string prefix) =>
    words.Where(w => w.StartsWith(prefix))   // every word
         .OrderBy(w => w, StringComparer.Ordinal).Take(3).ToList();` },
        good: { py: `def suggest(trie, prefix):                # trie: nested dicts, "$" = end
    node = trie
    for c in prefix:
        if c not in node:
            return []
        node = node[c]
    out = []
    def collect(n, word):                # visits letters in order
        if len(out) == 3:
            return
        if "$" in n:
            out.append(word)
        for c in sorted(k for k in n if k != "$"):
            collect(n[c], word + c)
    collect(node, prefix)
    return out`, java: `List<String> suggest(Node trie, String prefix) {
    Node node = trie;
    for (char c : prefix.toCharArray()) {
        node = node.next[c - 'a'];
        if (node == null) return List.of();
    }
    List<String> out = new ArrayList<>();
    // only words under the prefix
    collect(node, new StringBuilder(prefix), out);
    return out;
}

void collect(Node n, StringBuilder word, List<String> out) {
    if (out.size() == 3) return;
    if (n.isWord) out.add(word.toString());
    for (int c = 0; c < 26; c++) {       // a to z: sorted for free
        if (n.next[c] == null) continue;
        word.append((char) ('a' + c));
        collect(n.next[c], word, out);
        word.setLength(word.length() - 1);
    }
}`, cs: `List<string> Suggest(Node trie, string prefix)
{
    var node = trie;
    foreach (char c in prefix)
        if (!node.Next.TryGetValue(c, out node)) return new List<string>();
    var output = new List<string>();
    Collect(node, prefix, output);       // only words under the prefix
    return output;
}

void Collect(Node n, string word, List<string> output)
{
    if (output.Count == 3) return;
    if (n.IsWord) output.Add(word);
    foreach (var (c, child) in n.Next.OrderBy(kv => kv.Key))
        Collect(child, word + c, output);
}` } },
      { why: "A 26-slot array assumes lowercase a-z: an uppercase letter or a digit indexes outside it and crashes. Use a map when the alphabet isn't guaranteed.",
        bad: { py: `class TrieNode:
    def __init__(self):
        self.children = [None] * 26      # a-z only

def insert(root, word):
    node = root
    for c in word:
        i = ord(c) - ord("a")            # "Apple" gives -32: wrong slot
        if not node.children[i]:
            node.children[i] = TrieNode()
        node = node.children[i]`, java: `class TrieNode {
    TrieNode[] next = new TrieNode[26];  // a-z only
}

void insert(TrieNode root, String word) {
    TrieNode node = root;
    for (char c : word.toCharArray()) {
        // 'A' gives -32: ArrayIndexOutOfBounds
        int i = c - 'a';
        if (node.next[i] == null) node.next[i] = new TrieNode();
        node = node.next[i];
    }
}`, cs: `class TrieNode
{
    public TrieNode[] Next = new TrieNode[26];   // a-z only
}

void Insert(TrieNode root, string word)
{
    var node = root;
    foreach (char c in word)
    {
        int i = c - 'a';                 // 'A' gives -32: IndexOutOfRange
        node.Next[i] ??= new TrieNode();
        node = node.Next[i];
    }
}` },
        good: { py: `class TrieNode:
    def __init__(self):
        self.children = {}               # any character

def insert(root, word):
    node = root
    for c in word:
        node = node.children.setdefault(c, TrieNode())`, java: `class TrieNode {
    Map<Character, TrieNode> next = new HashMap<>();   // any character
}

void insert(TrieNode root, String word) {
    TrieNode node = root;
    for (char c : word.toCharArray())
        node = node.next.computeIfAbsent(c, k -> new TrieNode());
}`, cs: `class TrieNode
{
    public Dictionary<char, TrieNode> Next = new();   // any character
}

void Insert(TrieNode root, string word)
{
    var node = root;
    foreach (char c in word)
    {
        if (!node.Next.TryGetValue(c, out var child))
            node.Next[c] = child = new TrieNode();
        node = child;
    }
}` } },
  ],
  backtrack: [
      { why: "`x not in path` scans the path: O(n) per check. A boolean array of used positions answers in O(1), and also handles repeated values correctly.",
        bad: { py: `def permutations(nums):
    res, path = [], []
    def go():
        if len(path) == len(nums):
            res.append(path[:])
            return
        for x in nums:
            if x not in path:            # O(n) scan, breaks on repeats
                path.append(x)
                go()
                path.pop()
    go()
    return res`, java: `void permute(int[] nums, List<Integer> path, List<List<Integer>> res) {
    if (path.size() == nums.length) {
        res.add(new ArrayList<>(path));
        return;
    }
    for (int x : nums) {
        if (path.contains(x)) continue;  // O(n) scan, breaks on repeats
        path.add(x);
        permute(nums, path, res);
        path.remove(path.size() - 1);
    }
}`, cs: `void Permute(int[] nums, List<int> path, List<List<int>> res)
{
    if (path.Count == nums.Length) { res.Add(new List<int>(path)); return; }
    foreach (int x in nums)
    {
        if (path.Contains(x)) continue;  // O(n) scan, breaks on repeats
        path.Add(x);
        Permute(nums, path, res);
        path.RemoveAt(path.Count - 1);
    }
}` },
        good: { py: `def permutations(nums):
    res, path, used = [], [], [False] * len(nums)
    def go():
        if len(path) == len(nums):
            res.append(path[:])
            return
        for i, x in enumerate(nums):
            if not used[i]:              # O(1)
                used[i] = True
                path.append(x)
                go()
                path.pop()
                used[i] = False
    go()
    return res`, java: `void permute(int[] nums, boolean[] used, List<Integer> path,
             List<List<Integer>> res) {
    if (path.size() == nums.length) {
        res.add(new ArrayList<>(path));
        return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;           // O(1)
        used[i] = true;
        path.add(nums[i]);
        permute(nums, used, path, res);
        path.remove(path.size() - 1);
        used[i] = false;
    }
}`, cs: `void Permute(int[] nums, bool[] used, List<int> path, List<List<int>> res)
{
    if (path.Count == nums.Length) { res.Add(new List<int>(path)); return; }
    for (int i = 0; i < nums.Length; i++)
    {
        if (used[i]) continue;           // O(1)
        used[i] = true;
        path.Add(nums[i]);
        Permute(nums, used, path, res);
        path.RemoveAt(path.Count - 1);
        used[i] = false;
    }
}` } },
      { why: "Generating duplicates and removing them at the end wastes the work of building them. Sort first, then skip a value equal to the one just tried at the same level.",
        bad: { py: `def subsets_with_dup(nums):
    seen = set()
    def go(i, path):
        if i == len(nums):
            # builds repeats, then drops them
            seen.add(tuple(sorted(path)))
            return
        go(i + 1, path + [nums[i]])
        go(i + 1, path)
    go(0, [])
    return [list(t) for t in seen]`, java: `Set<List<Integer>> seen = new HashSet<>();

void subsets(int[] nums, int i, List<Integer> path) {
    if (i == nums.length) {
        List<Integer> s = new ArrayList<>(path);
        Collections.sort(s);
        seen.add(s);                     // builds repeats, then drops them
        return;
    }
    path.add(nums[i]);
    subsets(nums, i + 1, path);
    path.remove(path.size() - 1);
    subsets(nums, i + 1, path);
}`, cs: `HashSet<string> seen = new();

void Subsets(int[] nums, int i, List<int> path)
{
    if (i == nums.Length)
    {
        // repeats dropped late
        seen.Add(string.Join(",", path.OrderBy(x => x)));
        return;
    }
    path.Add(nums[i]);
    Subsets(nums, i + 1, path);
    path.RemoveAt(path.Count - 1);
    Subsets(nums, i + 1, path);
}` },
        good: { py: `def subsets_with_dup(nums):
    nums.sort()
    res, path = [], []
    def go(start):
        res.append(path[:])
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i - 1]:
                continue                 # same value at this level: skip
            path.append(nums[i])
            go(i + 1)
            path.pop()
    go(0)
    return res`, java: `void subsets(int[] nums, int start, List<Integer> path,
             List<List<Integer>> res) {
    res.add(new ArrayList<>(path));      // nums sorted first
    for (int i = start; i < nums.length; i++) {
        if (i > start && nums[i] == nums[i - 1]) continue;   // skip repeats
        path.add(nums[i]);
        subsets(nums, i + 1, path, res);
        path.remove(path.size() - 1);
    }
}`, cs: `void Subsets(int[] nums, int start, List<int> path, List<List<int>> res)
{
    res.Add(new List<int>(path));        // nums sorted first
    for (int i = start; i < nums.Length; i++)
    {
        if (i > start && nums[i] == nums[i - 1]) continue;   // skip repeats
        path.Add(nums[i]);
        Subsets(nums, i + 1, path, res);
        path.RemoveAt(path.Count - 1);
    }
}` } },
      { why: "Exploring a branch that can't succeed wastes the whole subtree under it. With sorted candidates, stop the loop as soon as one is too big: every later one is too.",
        bad: { py: `def combination_sum(cands, target):
    res = []
    def go(start, left, path):
        if left == 0:
            res.append(path[:])
            return
        if left < 0:
            return                       # discovered only after recursing
        for i in range(start, len(cands)):
            path.append(cands[i])
            go(i, left - cands[i], path)
            path.pop()
    go(0, target, [])
    return res`, java: `void combine(int[] cands, int start, int left, List<Integer> path,
             List<List<Integer>> res) {
    if (left == 0) { res.add(new ArrayList<>(path)); return; }
    if (left < 0) return;                // discovered only after recursing
    for (int i = start; i < cands.length; i++) {
        path.add(cands[i]);
        combine(cands, i, left - cands[i], path, res);
        path.remove(path.size() - 1);
    }
}`, cs: `void Combine(int[] cands, int start, int left, List<int> path,
             List<List<int>> res)
{
    if (left == 0) { res.Add(new List<int>(path)); return; }
    if (left < 0) return;                // discovered only after recursing
    for (int i = start; i < cands.Length; i++)
    {
        path.Add(cands[i]);
        Combine(cands, i, left - cands[i], path, res);
        path.RemoveAt(path.Count - 1);
    }
}` },
        good: { py: `def combination_sum(cands, target):
    cands.sort()
    res = []
    def go(start, left, path):
        if left == 0:
            res.append(path[:])
            return
        for i in range(start, len(cands)):
            if cands[i] > left:
                break                    # sorted: the rest are too big too
            path.append(cands[i])
            go(i, left - cands[i], path)
            path.pop()
    go(0, target, [])
    return res`, java: `// cands sorted first
void combine(int[] cands, int start, int left, List<Integer> path,
             List<List<Integer>> res) {
    if (left == 0) { res.add(new ArrayList<>(path)); return; }
    // prune
    for (int i = start; i < cands.length && cands[i] <= left; i++) {
        path.add(cands[i]);
        combine(cands, i, left - cands[i], path, res);
        path.remove(path.size() - 1);
    }
}`, cs: `// cands sorted first
void Combine(int[] cands, int start, int left, List<int> path,
             List<List<int>> res)
{
    if (left == 0) { res.Add(new List<int>(path)); return; }
    // prune
    for (int i = start; i < cands.Length && cands[i] <= left; i++)
    {
        path.Add(cands[i]);
        Combine(cands, i, left - cands[i], path, res);
        path.RemoveAt(path.Count - 1);
    }
}` } },
  ],
  graphs: [
      { why: "DFS finds a path, not the shortest one, and trying every path to compare is exponential. BFS visits nodes in order of distance, so the first time it reaches the target is the shortest: O(V + E).",
        bad: { py: `def shortest(graph, start, goal):
    best = float("inf")
    def dfs(node, dist, seen):
        nonlocal best
        if node == goal:
            best = min(best, dist)
            return
        for nb in graph[node]:
            if nb not in seen:
                dfs(nb, dist + 1, seen | {nb})   # every path: exponential
    dfs(start, 0, {start})
    return best`, java: `int best = Integer.MAX_VALUE;

void dfs(Map<Integer, List<Integer>> g, int node, int goal, int dist,
         Set<Integer> seen) {
    if (node == goal) { best = Math.min(best, dist); return; }
    for (int nb : g.get(node)) {
        if (seen.add(nb)) {
            dfs(g, nb, goal, dist + 1, seen);   // every path: exponential
            seen.remove(nb);
        }
    }
}`, cs: `int best = int.MaxValue;

void Dfs(Dictionary<int, List<int>> g, int node, int goal, int dist,
         HashSet<int> seen)
{
    if (node == goal) { best = Math.Min(best, dist); return; }
    foreach (int nb in g[node])
    {
        if (!seen.Add(nb)) continue;
        Dfs(g, nb, goal, dist + 1, seen);   // every path: exponential
        seen.Remove(nb);
    }
}` },
        good: { py: `from collections import deque

def shortest(graph, start, goal):
    dist = {start: 0}
    q = deque([start])
    while q:
        node = q.popleft()
        if node == goal:
            return dist[node]            # first arrival is the shortest
        for nb in graph[node]:
            if nb not in dist:
                dist[nb] = dist[node] + 1
                q.append(nb)
    return -1`, java: `int shortest(Map<Integer, List<Integer>> g, int start, int goal) {
    Map<Integer, Integer> dist = new HashMap<>(Map.of(start, 0));
    Deque<Integer> q = new ArrayDeque<>(List.of(start));
    while (!q.isEmpty()) {
        int node = q.poll();
        // first arrival is shortest
        if (node == goal) return dist.get(node);
        for (int nb : g.get(node))
            if (dist.putIfAbsent(nb, dist.get(node) + 1) == null)
                q.offer(nb);
    }
    return -1;
}`, cs: `int Shortest(Dictionary<int, List<int>> g, int start, int goal)
{
    var dist = new Dictionary<int, int> { [start] = 0 };
    var q = new Queue<int>(new[] { start });
    while (q.Count > 0)
    {
        int node = q.Dequeue();
        // first arrival is shortest
        if (node == goal) return dist[node];
        foreach (int nb in g[node])
            if (dist.TryAdd(nb, dist[node] + 1)) q.Enqueue(nb);
    }
    return -1;
}` } },
      { why: "Four copy-pasted neighbour checks are easy to get subtly wrong. Loop over a list of directions with one bounds check.",
        bad: { py: `def neighbours(grid, r, c):
    out = []
    if r > 0: out.append((r - 1, c))
    if r < len(grid) - 1: out.append((r + 1, c))
    if c > 0: out.append((r, c - 1))
    # one typo away from a bug
    if c < len(grid[0]) - 1: out.append((r, c + 1))
    return out`, java: `List<int[]> neighbours(int[][] grid, int r, int c) {
    List<int[]> out = new ArrayList<>();
    if (r > 0) out.add(new int[] {r - 1, c});
    if (r < grid.length - 1) out.add(new int[] {r + 1, c});
    if (c > 0) out.add(new int[] {r, c - 1});
    // easy to typo
    if (c < grid[0].length - 1) out.add(new int[] {r, c + 1});
    return out;
}`, cs: `List<(int, int)> Neighbours(int[][] grid, int r, int c)
{
    var output = new List<(int, int)>();
    if (r > 0) output.Add((r - 1, c));
    if (r < grid.Length - 1) output.Add((r + 1, c));
    if (c > 0) output.Add((r, c - 1));
    if (c < grid[0].Length - 1) output.Add((r, c + 1));   // easy to typo
    return output;
}` },
        good: { py: `DIRS = ((1, 0), (-1, 0), (0, 1), (0, -1))

def neighbours(grid, r, c):
    rows, cols = len(grid), len(grid[0])
    return [(r + dr, c + dc) for dr, dc in DIRS
            if 0 <= r + dr < rows and 0 <= c + dc < cols]`, java: `static final int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

List<int[]> neighbours(int[][] grid, int r, int c) {
    List<int[]> out = new ArrayList<>();
    for (int[] d : DIRS) {
        int nr = r + d[0], nc = c + d[1];
        if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length)
            out.add(new int[] {nr, nc});
    }
    return out;
}`, cs: `static readonly (int, int)[] Dirs = { (1, 0), (-1, 0), (0, 1), (0, -1) };

List<(int, int)> Neighbours(int[][] grid, int r, int c)
{
    var output = new List<(int, int)>();
    foreach (var (dr, dc) in Dirs)
    {
        int nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < grid.Length && nc >= 0 && nc < grid[0].Length)
            output.Add((nr, nc));
    }
    return output;
}` } },
      { why: "Rescanning all courses each round to find one with no prerequisites left is O(V²) or worse. Kahn's algorithm keeps a queue of the ready ones: O(V + E), and leftovers mean a cycle.",
        bad: { py: `def can_finish(n, prereqs):              # prereqs: [course, needs]
    done = set()
    progress = True
    while progress:
        progress = False
        for course in range(n):          # rescans every course each round
            needs = [b for a, b in prereqs if a == course]
            if course not in done and all(b in done for b in needs):
                done.add(course)
                progress = True
    return len(done) == n`, java: `boolean canFinish(int n, int[][] prereqs) {
    Set<Integer> done = new HashSet<>();
    boolean progress = true;
    while (progress) {
        progress = false;
        for (int c = 0; c < n; c++) {    // rescans every course each round
            if (done.contains(c)) continue;
            boolean ready = true;
            for (int[] p : prereqs)
                if (p[0] == c && !done.contains(p[1])) ready = false;
            if (ready) { done.add(c); progress = true; }
        }
    }
    return done.size() == n;
}`, cs: `bool CanFinish(int n, int[][] prereqs)
{
    var done = new HashSet<int>();
    bool progress = true;
    while (progress)
    {
        progress = false;
        for (int c = 0; c < n; c++)      // rescans every course each round
        {
            if (done.Contains(c)) continue;
            if (prereqs.All(p => p[0] != c || done.Contains(p[1])))
            {
                done.Add(c);
                progress = true;
            }
        }
    }
    return done.Count == n;
}` },
        good: { py: `from collections import deque

def can_finish(n, prereqs):
    graph, indeg = [[] for _ in range(n)], [0] * n
    for course, need in prereqs:
        graph[need].append(course)
        indeg[course] += 1
    q = deque(c for c in range(n) if indeg[c] == 0)   # ready now
    taken = 0
    while q:
        c = q.popleft()
        taken += 1
        for nxt in graph[c]:
            indeg[nxt] -= 1
            if indeg[nxt] == 0:
                q.append(nxt)
    return taken == n                    # leftovers mean a cycle`, java: `boolean canFinish(int n, int[][] prereqs) {
    List<List<Integer>> graph = new ArrayList<>();
    for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
    int[] indeg = new int[n];
    for (int[] p : prereqs) { graph.get(p[1]).add(p[0]); indeg[p[0]]++; }
    Deque<Integer> q = new ArrayDeque<>();
    // ready now
    for (int c = 0; c < n; c++) if (indeg[c] == 0) q.offer(c);
    int taken = 0;
    while (!q.isEmpty()) {
        int c = q.poll();
        taken++;
        for (int nxt : graph.get(c)) if (--indeg[nxt] == 0) q.offer(nxt);
    }
    return taken == n;                   // leftovers mean a cycle
}`, cs: `bool CanFinish(int n, int[][] prereqs)
{
    var graph = new List<int>[n];
    for (int i = 0; i < n; i++) graph[i] = new List<int>();
    var indeg = new int[n];
    foreach (var p in prereqs) { graph[p[1]].Add(p[0]); indeg[p[0]]++; }
    // ready now
    var q = new Queue<int>(
        Enumerable.Range(0, n).Where(c => indeg[c] == 0));
    int taken = 0;
    while (q.Count > 0)
    {
        int c = q.Dequeue();
        taken++;
        foreach (int nxt in graph[c]) if (--indeg[nxt] == 0) q.Enqueue(nxt);
    }
    return taken == n;                   // leftovers mean a cycle
}` } },
  ],
  greedy: [
      { why: "Comparing every interval with every other is O(n²). After sorting by start, only the last merged interval can overlap the next one: one sweep.",
        bad: { py: `def merge(intervals):
    merged = True
    # repeat until nothing merges: O(n²)+
    while merged:
        merged = False
        for i in range(len(intervals)):
            for j in range(i + 1, len(intervals)):
                a, b = intervals[i], intervals[j]
                if a[0] <= b[1] and b[0] <= a[1]:
                    intervals[i] = [min(a[0], b[0]), max(a[1], b[1])]
                    del intervals[j]
                    merged = True
                    break
            if merged:
                break
    return intervals`, java: `List<int[]> merge(List<int[]> intervals) {
    boolean merged = true;
    // repeat until nothing merges: O(n²)+
    while (merged) {
        merged = false;
        outer:
        for (int i = 0; i < intervals.size(); i++)
            for (int j = i + 1; j < intervals.size(); j++) {
                int[] a = intervals.get(i), b = intervals.get(j);
                if (a[0] <= b[1] && b[0] <= a[1]) {
                    intervals.set(i, new int[] {
                        Math.min(a[0], b[0]), Math.max(a[1], b[1])});
                    intervals.remove(j);
                    merged = true;
                    break outer;
                }
            }
    }
    return intervals;
}`, cs: `List<int[]> Merge(List<int[]> intervals)
{
    bool merged = true;
    // repeat until nothing merges: O(n²)+
    while (merged)
    {
        merged = false;
        for (int i = 0; i < intervals.Count && !merged; i++)
            for (int j = i + 1; j < intervals.Count && !merged; j++)
            {
                int[] a = intervals[i], b = intervals[j];
                if (a[0] <= b[1] && b[0] <= a[1])
                {
                    intervals[i] = new[]
                        { Math.Min(a[0], b[0]), Math.Max(a[1], b[1]) };
                    intervals.RemoveAt(j);
                    merged = true;
                }
            }
    }
    return intervals;
}` },
        good: { py: `def merge(intervals):
    intervals.sort()                     # by start
    out = [intervals[0][:]]
    for s, e in intervals[1:]:
        if s <= out[-1][1]:
            out[-1][1] = max(out[-1][1], e)   # overlaps the last one
        else:
            out.append([s, e])
    return out`, java: `List<int[]> merge(int[][] intervals) {
    // by start
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> out = new ArrayList<>();
    for (int[] iv : intervals) {
        if (!out.isEmpty() && iv[0] <= out.get(out.size() - 1)[1])
            {
                int[] last = out.get(out.size() - 1);
                last[1] = Math.max(last[1], iv[1]);   // overlaps the last
            }
        else out.add(iv.clone());
    }
    return out;
}`, cs: `List<int[]> Merge(int[][] intervals)
{
    var output = new List<int[]>();
    foreach (var iv in intervals.OrderBy(x => x[0]))   // by start
    {
        if (output.Count > 0 && iv[0] <= output[^1][1])
            // overlaps the last
            output[^1][1] = Math.Max(output[^1][1], iv[1]);
        else output.Add((int[])iv.Clone());
    }
    return output;
}` } },
      { why: "To keep the most non-overlapping intervals, sort by end time: the interval that finishes first leaves the most room. Sorting by start keeps a long early interval and removes too many.",
        bad: { py: `def min_removals(intervals):
    # by start: [1,10] blocks [2,3], [4,5]
    intervals.sort()
    removed, end = 0, float("-inf")
    for s, e in intervals:
        if s >= end:
            end = e
        else:
            removed += 1
    return removed`, java: `int minRemovals(int[][] intervals) {
    // by start
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    int removed = 0;
    long end = Long.MIN_VALUE;
    for (int[] iv : intervals) {
        if (iv[0] >= end) end = iv[1];
        else removed++;                  // [1,10] blocks [2,3] and [4,5]
    }
    return removed;
}`, cs: `int MinRemovals(int[][] intervals)
{
    int removed = 0;
    long end = long.MinValue;
    foreach (var iv in intervals.OrderBy(x => x[0]))   // by start
    {
        if (iv[0] >= end) end = iv[1];
        else removed++;                  // [1,10] blocks [2,3] and [4,5]
    }
    return removed;
}` },
        good: { py: `def min_removals(intervals):
    intervals.sort(key=lambda iv: iv[1]) # by end: finish early, keep room
    removed, end = 0, float("-inf")
    for s, e in intervals:
        if s >= end:
            end = e                      # keep it
        else:
            removed += 1
    return removed`, java: `int minRemovals(int[][] intervals) {
    // by end
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
    int removed = 0;
    long end = Long.MIN_VALUE;
    for (int[] iv : intervals) {
        if (iv[0] >= end) end = iv[1];   // keep it
        else removed++;
    }
    return removed;
}`, cs: `int MinRemovals(int[][] intervals)
{
    int removed = 0;
    long end = long.MinValue;
    foreach (var iv in intervals.OrderBy(x => x[1]))   // by end
    {
        if (iv[0] >= end) end = iv[1];   // keep it
        else removed++;
    }
    return removed;
}` } },
      { why: "A DP table over every jump is O(n²). Tracking just the farthest reachable index is enough: if you ever stand past it, you're stuck. O(n), O(1) space.",
        bad: { py: `def can_jump(nums):
    ok = [False] * len(nums)
    ok[0] = True
    for i in range(len(nums)):
        if ok[i]:
            for j in range(i + 1, min(i + nums[i], len(nums) - 1) + 1):
                ok[j] = True             # O(n²)
    return ok[-1]`, java: `boolean canJump(int[] nums) {
    boolean[] ok = new boolean[nums.length];
    ok[0] = true;
    for (int i = 0; i < nums.length; i++)
        if (ok[i])
            for (int j = i + 1;
                    j <= Math.min(i + nums[i], nums.length - 1); j++)
                ok[j] = true;            // O(n²)
    return ok[nums.length - 1];
}`, cs: `bool CanJump(int[] nums)
{
    var ok = new bool[nums.Length];
    ok[0] = true;
    for (int i = 0; i < nums.Length; i++)
        if (ok[i])
            for (int j = i + 1;
                j <= Math.Min(i + nums[i], nums.Length - 1); j++)
                ok[j] = true;            // O(n²)
    return ok[^1];
}` },
        good: { py: `def can_jump(nums):
    reach = 0                            # farthest index reachable so far
    for i, x in enumerate(nums):
        if i > reach:
            return False                 # stuck before i
        reach = max(reach, i + x)
    return True`, java: `boolean canJump(int[] nums) {
    int reach = 0;                       // farthest index reachable so far
    for (int i = 0; i < nums.length; i++) {
        if (i > reach) return false;     // stuck before i
        reach = Math.max(reach, i + nums[i]);
    }
    return true;
}`, cs: `bool CanJump(int[] nums)
{
    int reach = 0;                       // farthest index reachable so far
    for (int i = 0; i < nums.Length; i++)
    {
        if (i > reach) return false;     // stuck before i
        reach = Math.Max(reach, i + nums[i]);
    }
    return true;
}` } },
  ],
  math: [
      { why: "Logarithms are floating point, so log(n) / log(2) can land just off a whole number and give the wrong answer. A power of two has exactly one bit set: `n & (n - 1)` clears it.",
        bad: { py: `import math

def is_power_of_two(n):
    # log(2**29, 2) is 29.000000000000004
    return n > 0 and math.log(n, 2).is_integer()`, java: `boolean isPowerOfTwo(int n) {
    // floating point: can be off by a hair
    double x = Math.log(n) / Math.log(2);
    return n > 0 && x == Math.floor(x);
}`, cs: `bool IsPowerOfTwo(int n)
{
    // floating point: can be off by a hair
    double x = Math.Log(n) / Math.Log(2);
    return n > 0 && x == Math.Floor(x);
}` },
        good: { py: `def is_power_of_two(n):
    return n > 0 and n & (n - 1) == 0    # exactly one bit set`, java: `boolean isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;  // exactly one bit set
}`, cs: `bool IsPowerOfTwo(int n) => n > 0 && (n & (n - 1)) == 0;   // one bit set` } },
      { why: "\"Rotate in place\" means no second matrix. Reversing the rows and then transposing turns it 90° clockwise using swaps only: O(1) extra space.",
        bad: { py: `def rotate(m):
    n = len(m)
    out = [[0] * n for _ in range(n)]    # a whole second matrix
    for r in range(n):
        for c in range(n):
            out[c][n - 1 - r] = m[r][c]
    m[:] = out`, java: `void rotate(int[][] m) {
    int n = m.length;
    int[][] out = new int[n][n];         // a whole second matrix
    for (int r = 0; r < n; r++)
        for (int c = 0; c < n; c++) out[c][n - 1 - r] = m[r][c];
    for (int r = 0; r < n; r++) m[r] = out[r];
}`, cs: `void Rotate(int[][] m)
{
    int n = m.Length;
    var output = new int[n][];           // a whole second matrix
    for (int r = 0; r < n; r++) output[r] = new int[n];
    for (int r = 0; r < n; r++)
        for (int c = 0; c < n; c++) output[c][n - 1 - r] = m[r][c];
    for (int r = 0; r < n; r++) m[r] = output[r];
}` },
        good: { py: `def rotate(m):                          # 90° clockwise, in place
    m.reverse()                          # flip top to bottom
    for i in range(len(m)):
        for j in range(i):
            m[i][j], m[j][i] = m[j][i], m[i][j]   # transpose`, java: `void rotate(int[][] m) {                // 90° clockwise, in place
    // flip top to bottom
    for (int i = 0, j = m.length - 1; i < j; i++, j--) {
        int[] t = m[i]; m[i] = m[j]; m[j] = t;
    }
    for (int i = 0; i < m.length; i++)
        for (int j = 0; j < i; j++) {    // transpose
            int t = m[i][j]; m[i][j] = m[j][i]; m[j][i] = t;
        }
}`, cs: `void Rotate(int[][] m)                  // 90° clockwise, in place
{
    Array.Reverse(m);                    // flip top to bottom
    for (int i = 0; i < m.Length; i++)
        for (int j = 0; j < i; j++)      // transpose
            (m[i][j], m[j][i]) = (m[j][i], m[i][j]);
}` } },
      { why: "When the answer is \"modulo 10⁹ + 7\", take the modulo at every step. Waiting until the end overflows in Java and C#, and in Python makes huge, slow integers.",
        bad: { py: `MOD = 10**9 + 7

def count_ways(n):
    a, b = 1, 1
    for _ in range(n):
        a, b = b, a + b                  # grows to hundreds of digits
    return a % MOD`, java: `static final int MOD = 1_000_000_007;

int countWays(int n) {
    long a = 1, b = 1;
    // overflows
    for (int i = 0; i < n; i++) { long t = a + b; a = b; b = t; }
    return (int) (a % MOD);
}`, cs: `const int Mod = 1_000_000_007;

int CountWays(int n)
{
    long a = 1, b = 1;
    for (int i = 0; i < n; i++) (a, b) = (b, a + b);   // overflows
    return (int)(a % Mod);
}` },
        good: { py: `MOD = 10**9 + 7

def count_ways(n):
    a, b = 1, 1
    for _ in range(n):
        a, b = b, (a + b) % MOD          # stays small every step
    return a`, java: `static final int MOD = 1_000_000_007;

int countWays(int n) {
    long a = 1, b = 1;
    for (int i = 0; i < n; i++) { long t = (a + b) % MOD; a = b; b = t; }
    return (int) a;                      // never overflows
}`, cs: `const int Mod = 1_000_000_007;

int CountWays(int n)
{
    long a = 1, b = 1;
    for (int i = 0; i < n; i++) (a, b) = (b, (a + b) % Mod);
    return (int)a;                       // never overflows
}` } },
  ],
  dp1: [
      { why: "When each state depends only on the last one or two, a whole table is O(n) memory for nothing. Keep two variables: O(1).",
        bad: { py: `def rob(nums):
    dp = [0] * (len(nums) + 1)           # O(n) memory
    for i, x in enumerate(nums):
        dp[i + 1] = max(dp[i], (dp[i - 1] if i else 0) + x)
    return dp[-1]`, java: `int rob(int[] nums) {
    int[] dp = new int[nums.length + 1];   // O(n) memory
    for (int i = 0; i < nums.length; i++)
        dp[i + 1] = Math.max(dp[i], (i > 0 ? dp[i - 1] : 0) + nums[i]);
    return dp[nums.length];
}`, cs: `int Rob(int[] nums)
{
    var dp = new int[nums.Length + 1];     // O(n) memory
    for (int i = 0; i < nums.Length; i++)
        dp[i + 1] = Math.Max(dp[i], (i > 0 ? dp[i - 1] : 0) + nums[i]);
    return dp[^1];
}` },
        good: { py: `def rob(nums):
    # best without / with the last house
    skip, take = 0, 0
    for x in nums:
        skip, take = max(skip, take), skip + x
    return max(skip, take)`, java: `int rob(int[] nums) {
    // best without / with the last house
    int skip = 0, take = 0;
    for (int x : nums) {
        int t = skip + x;
        skip = Math.max(skip, take);
        take = t;
    }
    return Math.max(skip, take);
}`, cs: `int Rob(int[] nums)
{
    // best without / with the last house
    int skip = 0, take = 0;
    foreach (int x in nums) (skip, take) = (Math.Max(skip, take), skip + x);
    return Math.Max(skip, take);
}` } },
      { why: "Always taking the biggest coin isn't always optimal: with coins [1, 3, 4] and amount 6, greedy gives 4 + 1 + 1 (3 coins) but 3 + 3 is 2. DP tries every last coin.",
        bad: { py: `def min_coins(coins, amount):
    count = 0
    for c in sorted(coins, reverse=True):    # biggest first
        count += amount // c
        amount %= c
    return count if amount == 0 else -1  # [1, 3, 4], 6 gives 3; answer is 2`, java: `int minCoins(int[] coins, int amount) {
    int[] c = coins.clone();
    Arrays.sort(c);
    int count = 0;
    for (int i = c.length - 1; i >= 0; i--) {   // biggest first
        count += amount / c[i];
        amount %= c[i];
    }
    // [1, 3, 4], 6 gives 3; answer is 2
    return amount == 0 ? count : -1;
}`, cs: `int MinCoins(int[] coins, int amount)
{
    int count = 0;
    foreach (int c in coins.OrderByDescending(x => x))   // biggest first
    {
        count += amount / c;
        amount %= c;
    }
    // [1, 3, 4], 6 gives 3; answer is 2
    return amount == 0 ? count : -1;
}` },
        good: { py: `def min_coins(coins, amount):
    INF = float("inf")
    dp = [0] + [INF] * amount            # dp[a] = fewest coins for a
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)   # try every last coin
    return dp[amount] if dp[amount] < INF else -1`, java: `int minCoins(int[] coins, int amount) {
    int[] dp = new int[amount + 1];      // dp[a] = fewest coins for a
    Arrays.fill(dp, Integer.MAX_VALUE);
    dp[0] = 0;
    for (int a = 1; a <= amount; a++)
        for (int c : coins)              // try every last coin
            if (c <= a && dp[a - c] != Integer.MAX_VALUE)
                dp[a] = Math.min(dp[a], dp[a - c] + 1);
    return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];
}`, cs: `int MinCoins(int[] coins, int amount)
{
    var dp = new int[amount + 1];        // dp[a] = fewest coins for a
    Array.Fill(dp, int.MaxValue);
    dp[0] = 0;
    for (int a = 1; a <= amount; a++)
        foreach (int c in coins)         // try every last coin
            if (c <= a && dp[a - c] != int.MaxValue)
                dp[a] = Math.Min(dp[a], dp[a - c] + 1);
    return dp[amount] == int.MaxValue ? -1 : dp[amount];
}` } },
      { why: "The textbook longest-increasing-subsequence DP compares every pair: O(n²). Keeping the smallest possible tail for each length and binary searching where each number goes is O(n log n).",
        bad: { py: `def lis(nums):
    dp = [1] * len(nums)                 # dp[i] = LIS ending at i
    for i in range(len(nums)):
        for j in range(i):               # O(n²)
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp, default=0)`, java: `int lis(int[] nums) {
    int[] dp = new int[nums.length];     // dp[i] = LIS ending at i
    int best = 0;
    for (int i = 0; i < nums.length; i++) {
        dp[i] = 1;
        for (int j = 0; j < i; j++)      // O(n²)
            if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
        best = Math.max(best, dp[i]);
    }
    return best;
}`, cs: `int Lis(int[] nums)
{
    var dp = new int[nums.Length];       // dp[i] = LIS ending at i
    int best = 0;
    for (int i = 0; i < nums.Length; i++)
    {
        dp[i] = 1;
        for (int j = 0; j < i; j++)      // O(n²)
            if (nums[j] < nums[i]) dp[i] = Math.Max(dp[i], dp[j] + 1);
        best = Math.Max(best, dp[i]);
    }
    return best;
}` },
        good: { py: `from bisect import bisect_left

def lis(nums):
    # tails[k] = smallest tail of length k+1
    tails = []
    for x in nums:
        i = bisect_left(tails, x)        # O(log n)
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)`, java: `int lis(int[] nums) {
    // tails[k] = smallest tail of length k+1
    int[] tails = new int[nums.length];
    int len = 0;
    for (int x : nums) {
        int i = Arrays.binarySearch(tails, 0, len, x);   // O(log n)
        if (i < 0) i = -(i + 1);
        tails[i] = x;
        if (i == len) len++;
    }
    return len;
}`, cs: `int Lis(int[] nums)
{
    // tails[k] = smallest tail of length k+1
    var tails = new List<int>();
    foreach (int x in nums)
    {
        int i = tails.BinarySearch(x);   // O(log n)
        if (i < 0) i = ~i;
        if (i == tails.Count) tails.Add(x);
        else tails[i] = x;
    }
    return tails.Count;
}` } },
  ],
  dp2: [
      { why: "Each row of a grid DP only reads the row above, so a full table is O(m·n) memory for nothing. One row updated in place is O(n).",
        bad: { py: `def unique_paths(m, n):
    dp = [[1] * n for _ in range(m)]     # O(m·n) memory
    for r in range(1, m):
        for c in range(1, n):
            dp[r][c] = dp[r - 1][c] + dp[r][c - 1]
    return dp[-1][-1]`, java: `int uniquePaths(int m, int n) {
    int[][] dp = new int[m][n];          // O(m·n) memory
    for (int[] row : dp) Arrays.fill(row, 1);
    for (int r = 1; r < m; r++)
        for (int c = 1; c < n; c++) dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
    return dp[m - 1][n - 1];
}`, cs: `int UniquePaths(int m, int n)
{
    var dp = new int[m, n];              // O(m·n) memory
    for (int r = 0; r < m; r++)
        for (int c = 0; c < n; c++)
            dp[r, c] = r == 0 || c == 0 ? 1 : dp[r - 1, c] + dp[r, c - 1];
    return dp[m - 1, n - 1];
}` },
        good: { py: `def unique_paths(m, n):
    # the previous row, updated in place
    row = [1] * n
    for _ in range(1, m):
        for c in range(1, n):
            row[c] += row[c - 1]         # above + left
    return row[-1]`, java: `int uniquePaths(int m, int n) {
    // the previous row, updated in place
    int[] row = new int[n];
    Arrays.fill(row, 1);
    for (int r = 1; r < m; r++)
        for (int c = 1; c < n; c++) row[c] += row[c - 1];   // above + left
    return row[n - 1];
}`, cs: `int UniquePaths(int m, int n)
{
    var row = Enumerable.Repeat(1, n).ToArray();   // previous row, in place
    for (int r = 1; r < m; r++)
        for (int c = 1; c < n; c++) row[c] += row[c - 1];   // above + left
    return row[^1];
}` } },
      { why: "Plain recursion on two indexes repeats the same (i, j) pairs exponentially often. There are only m·n distinct pairs, so fill a table (or memoize): O(m·n).",
        bad: { py: `def lcs(a, b, i=0, j=0):
    if i == len(a) or j == len(b):
        return 0
    if a[i] == b[j]:
        return 1 + lcs(a, b, i + 1, j + 1)
    return max(lcs(a, b, i + 1, j), lcs(a, b, i, j + 1))   # exponential`, java: `int lcs(String a, String b, int i, int j) {
    if (i == a.length() || j == b.length()) return 0;
    if (a.charAt(i) == b.charAt(j)) return 1 + lcs(a, b, i + 1, j + 1);
    // exponential
    return Math.max(lcs(a, b, i + 1, j), lcs(a, b, i, j + 1));
}`, cs: `int Lcs(string a, string b, int i = 0, int j = 0)
{
    if (i == a.Length || j == b.Length) return 0;
    if (a[i] == b[j]) return 1 + Lcs(a, b, i + 1, j + 1);
    // exponential
    return Math.Max(Lcs(a, b, i + 1, j), Lcs(a, b, i, j + 1));
}` },
        good: { py: `def lcs(a, b):
    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(len(a) - 1, -1, -1):
        for j in range(len(b) - 1, -1, -1):
            if a[i] == b[j]:
                dp[i][j] = 1 + dp[i + 1][j + 1]
            else:
                dp[i][j] = max(dp[i + 1][j], dp[i][j + 1])
    return dp[0][0]                      # each (i, j) once: O(m·n)`, java: `int lcs(String a, String b) {
    int[][] dp = new int[a.length() + 1][b.length() + 1];
    for (int i = a.length() - 1; i >= 0; i--)
        for (int j = b.length() - 1; j >= 0; j--)
            dp[i][j] = a.charAt(i) == b.charAt(j)
                ? 1 + dp[i + 1][j + 1]
                : Math.max(dp[i + 1][j], dp[i][j + 1]);
    return dp[0][0];                     // each (i, j) once: O(m·n)
}`, cs: `int Lcs(string a, string b)
{
    var dp = new int[a.Length + 1, b.Length + 1];
    for (int i = a.Length - 1; i >= 0; i--)
        for (int j = b.Length - 1; j >= 0; j--)
            dp[i, j] = a[i] == b[j]
                ? 1 + dp[i + 1, j + 1]
                : Math.Max(dp[i + 1, j], dp[i, j + 1]);
    return dp[0, 0];                     // each (i, j) once: O(m·n)
}` } },
      { why: "In a 1-D 0/1 knapsack, going up through the capacities lets an item build on a value that already used it, so each item can be taken many times. Go down so every read comes from before this item.",
        bad: { py: `def knapsack(items, cap):              # items: (weight, value), each once
    dp = [0] * (cap + 1)
    for w, v in items:
        for c in range(w, cap + 1):      # upward: reuses the same item
            dp[c] = max(dp[c], dp[c - w] + v)
    return dp[cap]`, java: `int knapsack(int[][] items, int cap) {   // {weight, value}, each once
    int[] dp = new int[cap + 1];
    for (int[] it : items)
        for (int c = it[0]; c <= cap; c++)   // upward: reuses the same item
            dp[c] = Math.max(dp[c], dp[c - it[0]] + it[1]);
    return dp[cap];
}`, cs: `int Knapsack(int[][] items, int cap)     // {weight, value}, each once
{
    var dp = new int[cap + 1];
    foreach (var it in items)
        for (int c = it[0]; c <= cap; c++)   // upward: reuses the same item
            dp[c] = Math.Max(dp[c], dp[c - it[0]] + it[1]);
    return dp[cap];
}` },
        good: { py: `def knapsack(items, cap):
    dp = [0] * (cap + 1)
    for w, v in items:
        for c in range(cap, w - 1, -1):  # downward: each item at most once
            dp[c] = max(dp[c], dp[c - w] + v)
    return dp[cap]`, java: `int knapsack(int[][] items, int cap) {
    int[] dp = new int[cap + 1];
    for (int[] it : items)
        for (int c = cap; c >= it[0]; c--)   // downward: each item once
            dp[c] = Math.max(dp[c], dp[c - it[0]] + it[1]);
    return dp[cap];
}`, cs: `int Knapsack(int[][] items, int cap)
{
    var dp = new int[cap + 1];
    foreach (var it in items)
        for (int c = cap; c >= it[0]; c--)   // downward: each item once
            dp[c] = Math.Max(dp[c], dp[c - it[0]] + it[1]);
    return dp[cap];
}` } },
  ],
};
