// Worked Python solutions (LeetCode format). SOL[slug] = { a: approach, t: complexity, c: code }
const SOL = {};
const add = (slug, a, t, c) => { SOL[slug] = { a, t, c }; };

// ---- Arrays & Hashing ----
add("contains-duplicate", "Put numbers in a set as you scan; if one is already there, it's a duplicate.", "O(n) time, O(n) space",
`class Solution:
    def containsDuplicate(self, nums):
        seen = set()
        for x in nums:
            if x in seen:
                return True
            seen.add(x)
        return False`);
add("valid-anagram", "Two strings are anagrams iff their character counts match.", "O(n) time, O(1) space (26 letters)",
`from collections import Counter

class Solution:
    def isAnagram(self, s, t):
        return Counter(s) == Counter(t)`);
add("two-sum", "Store value -> index. For each x, check whether target - x was already seen.", "O(n) time, O(n) space",
`class Solution:
    def twoSum(self, nums, target):
        seen = {}
        for i, x in enumerate(nums):
            if target - x in seen:
                return [seen[target - x], i]
            seen[x] = i`);
add("majority-element", "Boyer-Moore voting: keep a candidate and a count; the majority element survives the cancellations.", "O(n) time, O(1) space",
`class Solution:
    def majorityElement(self, nums):
        cand, count = None, 0
        for x in nums:
            if count == 0:
                cand = x
            count += 1 if x == cand else -1
        return cand`);
add("move-zeroes", "Write non-zeros forward with a write pointer, then fill the rest with zeros.", "O(n) time, O(1) space",
`class Solution:
    def moveZeroes(self, nums):
        w = 0
        for x in nums:
            if x != 0:
                nums[w] = x
                w += 1
        for i in range(w, len(nums)):
            nums[i] = 0`);
add("group-anagrams", "Anagrams share the same sorted-letters key. Group words in a dict by that key.", "O(n * k log k) time, O(n * k) space",
`from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs):
        groups = defaultdict(list)
        for w in strs:
            groups["".join(sorted(w))].append(w)
        return list(groups.values())`);
add("top-k-frequent-elements", "Count frequencies, then bucket numbers by frequency (index = count) and read buckets from the top.", "O(n) time, O(n) space",
`from collections import Counter

class Solution:
    def topKFrequent(self, nums, k):
        buckets = [[] for _ in range(len(nums) + 1)]
        for num, c in Counter(nums).items():
            buckets[c].append(num)
        res = []
        for c in range(len(buckets) - 1, 0, -1):
            for num in buckets[c]:
                res.append(num)
                if len(res) == k:
                    return res`);
add("product-of-array-except-self", "Product of everything left of i times everything right of i. Two passes, no division.", "O(n) time, O(1) extra space",
`class Solution:
    def productExceptSelf(self, nums):
        n = len(nums)
        res = [1] * n
        left = 1
        for i in range(n):
            res[i] = left
            left *= nums[i]
        right = 1
        for i in range(n - 1, -1, -1):
            res[i] *= right
            right *= nums[i]
        return res`);
add("valid-sudoku", "Track seen digits per row, column and 3x3 box in sets; a repeat means invalid.", "O(1) time (fixed 9x9), O(1) space",
`from collections import defaultdict

class Solution:
    def isValidSudoku(self, board):
        rows, cols, boxes = defaultdict(set), defaultdict(set), defaultdict(set)
        for r in range(9):
            for c in range(9):
                v = board[r][c]
                if v == ".":
                    continue
                b = (r // 3, c // 3)
                if v in rows[r] or v in cols[c] or v in boxes[b]:
                    return False
                rows[r].add(v); cols[c].add(v); boxes[b].add(v)
        return True`);
add("longest-consecutive-sequence", "Put everything in a set. Only start counting from numbers with no predecessor (x - 1 not in set), so each run is walked once.", "O(n) time, O(n) space",
`class Solution:
    def longestConsecutive(self, nums):
        s, best = set(nums), 0
        for x in s:
            if x - 1 not in s:
                y = x
                while y + 1 in s:
                    y += 1
                best = max(best, y - x + 1)
        return best`);
add("subarray-sum-equals-k", "Prefix sums: a subarray ending here sums to k if (prefix - k) appeared earlier. Count with a dict.", "O(n) time, O(n) space",
`class Solution:
    def subarraySum(self, nums, k):
        freq = {0: 1}
        pre = count = 0
        for x in nums:
            pre += x
            count += freq.get(pre - k, 0)
            freq[pre] = freq.get(pre, 0) + 1
        return count`);
add("rotate-array", "Reverse the whole array, then reverse the first k and the remaining n - k elements.", "O(n) time, O(1) space",
`class Solution:
    def rotate(self, nums, k):
        n = len(nums)
        k %= n
        def rev(l, r):
            while l < r:
                nums[l], nums[r] = nums[r], nums[l]
                l += 1; r -= 1
        rev(0, n - 1)
        rev(0, k - 1)
        rev(k, n - 1)`);

// ---- Two pointers ----
add("valid-palindrome", "Two pointers from both ends, skipping non-alphanumerics, comparing lowercase.", "O(n) time, O(1) space",
`class Solution:
    def isPalindrome(self, s):
        l, r = 0, len(s) - 1
        while l < r:
            while l < r and not s[l].isalnum():
                l += 1
            while l < r and not s[r].isalnum():
                r -= 1
            if s[l].lower() != s[r].lower():
                return False
            l += 1; r -= 1
        return True`);
add("remove-duplicates-from-sorted-array", "Slow pointer marks the end of the unique prefix; fast pointer finds the next new value.", "O(n) time, O(1) space",
`class Solution:
    def removeDuplicates(self, nums):
        w = 1
        for r in range(1, len(nums)):
            if nums[r] != nums[r - 1]:
                nums[w] = nums[r]
                w += 1
        return w`);
add("two-sum-ii-input-array-is-sorted", "Sorted input: pointers at both ends; move the left up if the sum is too small, the right down if too big.", "O(n) time, O(1) space",
`class Solution:
    def twoSum(self, numbers, target):
        l, r = 0, len(numbers) - 1
        while l < r:
            s = numbers[l] + numbers[r]
            if s == target:
                return [l + 1, r + 1]
            if s < target:
                l += 1
            else:
                r -= 1`);
add("3sum", "Sort, fix the first number, then two-pointer the rest. Skip duplicate values to avoid repeated triples.", "O(n^2) time, O(1) extra space",
`class Solution:
    def threeSum(self, nums):
        nums.sort()
        res = []
        for i, a in enumerate(nums):
            if a > 0:
                break
            if i > 0 and a == nums[i - 1]:
                continue
            l, r = i + 1, len(nums) - 1
            while l < r:
                s = a + nums[l] + nums[r]
                if s < 0:
                    l += 1
                elif s > 0:
                    r -= 1
                else:
                    res.append([a, nums[l], nums[r]])
                    l += 1
                    while l < r and nums[l] == nums[l - 1]:
                        l += 1
        return res`);
add("container-with-most-water", "Start with the widest container; move the shorter wall inward, since only a taller wall can help.", "O(n) time, O(1) space",
`class Solution:
    def maxArea(self, height):
        l, r, best = 0, len(height) - 1, 0
        while l < r:
            best = max(best, (r - l) * min(height[l], height[r]))
            if height[l] < height[r]:
                l += 1
            else:
                r -= 1
        return best`);
add("sort-colors", "Dutch national flag: keep low/high boundaries; swap 0s to the front and 2s to the back in one pass.", "O(n) time, O(1) space",
`class Solution:
    def sortColors(self, nums):
        lo, i, hi = 0, 0, len(nums) - 1
        while i <= hi:
            if nums[i] == 0:
                nums[lo], nums[i] = nums[i], nums[lo]
                lo += 1; i += 1
            elif nums[i] == 2:
                nums[hi], nums[i] = nums[i], nums[hi]
                hi -= 1
            else:
                i += 1`);
add("trapping-rain-water", "Water above a cell = min(max left, max right) - height. Two pointers track both maxes, advancing the smaller side.", "O(n) time, O(1) space",
`class Solution:
    def trap(self, height):
        l, r = 0, len(height) - 1
        lmax = rmax = water = 0
        while l < r:
            if height[l] < height[r]:
                lmax = max(lmax, height[l])
                water += lmax - height[l]
                l += 1
            else:
                rmax = max(rmax, height[r])
                water += rmax - height[r]
                r -= 1
        return water`);

// ---- Sliding window ----
add("best-time-to-buy-and-sell-stock", "Track the lowest price so far; the best profit is the max of price - lowest.", "O(n) time, O(1) space",
`class Solution:
    def maxProfit(self, prices):
        low, best = float("inf"), 0
        for p in prices:
            low = min(low, p)
            best = max(best, p - low)
        return best`);
add("maximum-average-subarray-i", "Fixed-size window: keep a running sum, add the new element and drop the one leaving.", "O(n) time, O(1) space",
`class Solution:
    def findMaxAverage(self, nums, k):
        s = sum(nums[:k])
        best = s
        for i in range(k, len(nums)):
            s += nums[i] - nums[i - k]
            best = max(best, s)
        return best / k`);
add("longest-substring-without-repeating-characters", "Window [l, r]. Remember each char's last index; on a repeat inside the window, jump l past it.", "O(n) time, O(min(n, alphabet)) space",
`class Solution:
    def lengthOfLongestSubstring(self, s):
        last, l, best = {}, 0, 0
        for r, ch in enumerate(s):
            if ch in last and last[ch] >= l:
                l = last[ch] + 1
            last[ch] = r
            best = max(best, r - l + 1)
        return best`);
add("longest-repeating-character-replacement", "A window is valid if (length - count of its most frequent char) <= k. Grow right, shrink left when invalid.", "O(n) time, O(26) space",
`from collections import defaultdict

class Solution:
    def characterReplacement(self, s, k):
        count, l, best, maxf = defaultdict(int), 0, 0, 0
        for r, ch in enumerate(s):
            count[ch] += 1
            maxf = max(maxf, count[ch])
            while (r - l + 1) - maxf > k:
                count[s[l]] -= 1
                l += 1
            best = max(best, r - l + 1)
        return best`);
add("permutation-in-string", "Slide a window of len(s1) over s2 and compare character counts.", "O(n) time, O(26) space",
`from collections import Counter

class Solution:
    def checkInclusion(self, s1, s2):
        need, k = Counter(s1), len(s1)
        window = Counter(s2[:k])
        if window == need:
            return True
        for i in range(k, len(s2)):
            window[s2[i]] += 1
            out = s2[i - k]
            window[out] -= 1
            if window[out] == 0:
                del window[out]
            if window == need:
                return True
        return False`);
add("minimum-window-substring", "Expand right until the window covers t, then shrink left as far as it stays valid, recording the smallest.", "O(n + m) time, O(m) space",
`from collections import Counter

class Solution:
    def minWindow(self, s, t):
        need = Counter(t)
        missing, l = len(t), 0
        best = (float("inf"), 0, 0)
        for r, ch in enumerate(s):
            if need[ch] > 0:
                missing -= 1
            need[ch] -= 1
            while missing == 0:
                if r - l + 1 < best[0]:
                    best = (r - l + 1, l, r + 1)
                need[s[l]] += 1
                if need[s[l]] > 0:
                    missing += 1
                l += 1
        return "" if best[0] == float("inf") else s[best[1]:best[2]]`);
add("sliding-window-maximum", "Monotonic decreasing deque of indices: the front is always the max of the current window.", "O(n) time, O(k) space",
`from collections import deque

class Solution:
    def maxSlidingWindow(self, nums, k):
        dq, res = deque(), []
        for i, x in enumerate(nums):
            while dq and nums[dq[-1]] <= x:
                dq.pop()
            dq.append(i)
            if dq[0] <= i - k:
                dq.popleft()
            if i >= k - 1:
                res.append(nums[dq[0]])
        return res`);

// ---- Stack ----
add("valid-parentheses", "Push opening brackets; on a closing one, the top of the stack must be its match.", "O(n) time, O(n) space",
`class Solution:
    def isValid(self, s):
        pairs, stack = {")": "(", "]": "[", "}": "{"}, []
        for ch in s:
            if ch in pairs:
                if not stack or stack.pop() != pairs[ch]:
                    return False
            else:
                stack.append(ch)
        return not stack`);
add("min-stack", "Store (value, min so far) on the stack so the minimum is always O(1).", "O(1) per operation",
`class MinStack:
    def __init__(self):
        self.st = []

    def push(self, val):
        m = min(val, self.st[-1][1]) if self.st else val
        self.st.append((val, m))

    def pop(self):
        self.st.pop()

    def top(self):
        return self.st[-1][0]

    def getMin(self):
        return self.st[-1][1]`);
add("daily-temperatures", "Monotonic stack of indices with decreasing temperatures; a warmer day resolves all colder days on the stack.", "O(n) time, O(n) space",
`class Solution:
    def dailyTemperatures(self, temperatures):
        res, st = [0] * len(temperatures), []
        for i, t in enumerate(temperatures):
            while st and temperatures[st[-1]] < t:
                j = st.pop()
                res[j] = i - j
            st.append(i)
        return res`);
add("evaluate-reverse-polish-notation", "Push numbers; on an operator pop two operands, apply, push the result. Truncate division toward zero.", "O(n) time, O(n) space",
`class Solution:
    def evalRPN(self, tokens):
        st = []
        for tok in tokens:
            if tok in "+-*/" and len(tok) == 1:
                b, a = st.pop(), st.pop()
                if tok == "+": st.append(a + b)
                elif tok == "-": st.append(a - b)
                elif tok == "*": st.append(a * b)
                else: st.append(int(a / b))
            else:
                st.append(int(tok))
        return st[0]`);
add("car-fleet", "Sort cars by position from the end; compute arrival time. A car slower than the one ahead joins its fleet.", "O(n log n) time, O(n) space",
`class Solution:
    def carFleet(self, target, position, speed):
        fleets, last = 0, 0
        for p, s in sorted(zip(position, speed), reverse=True):
            t = (target - p) / s
            if t > last:
                fleets += 1
                last = t
        return fleets`);
add("largest-rectangle-in-histogram", "Monotonic increasing stack. When a shorter bar arrives, pop taller bars and compute the rectangle each could form.", "O(n) time, O(n) space",
`class Solution:
    def largestRectangleArea(self, heights):
        st, best = [], 0              # st holds (start index, height)
        for i, h in enumerate(heights + [0]):
            start = i
            while st and st[-1][1] > h:
                idx, height = st.pop()
                best = max(best, height * (i - idx))
                start = idx
            st.append((start, h))
        return best`);

// ---- Binary search ----
add("binary-search", "Classic: compare to the middle, discard half each step.", "O(log n) time, O(1) space",
`class Solution:
    def search(self, nums, target):
        l, r = 0, len(nums) - 1
        while l <= r:
            m = (l + r) // 2
            if nums[m] == target:
                return m
            if nums[m] < target:
                l = m + 1
            else:
                r = m - 1
        return -1`);
add("search-a-2d-matrix", "Treat the matrix as one sorted array of rows*cols elements and binary search with index math.", "O(log(m*n)) time, O(1) space",
`class Solution:
    def searchMatrix(self, matrix, target):
        rows, cols = len(matrix), len(matrix[0])
        l, r = 0, rows * cols - 1
        while l <= r:
            m = (l + r) // 2
            v = matrix[m // cols][m % cols]
            if v == target:
                return True
            if v < target:
                l = m + 1
            else:
                r = m - 1
        return False`);
add("koko-eating-bananas", "Binary search the eating speed: the smallest k whose total hours <= h.", "O(n log max) time, O(1) space",
`import math

class Solution:
    def minEatingSpeed(self, piles, h):
        l, r = 1, max(piles)
        while l < r:
            k = (l + r) // 2
            if sum(math.ceil(p / k) for p in piles) <= h:
                r = k
            else:
                l = k + 1
        return l`);
add("find-minimum-in-rotated-sorted-array", "Compare mid to the right end: if nums[m] > nums[r] the minimum is to the right, otherwise at m or left.", "O(log n) time, O(1) space",
`class Solution:
    def findMin(self, nums):
        l, r = 0, len(nums) - 1
        while l < r:
            m = (l + r) // 2
            if nums[m] > nums[r]:
                l = m + 1
            else:
                r = m
        return nums[l]`);
add("search-in-rotated-sorted-array", "At each step one half is sorted. Check if the target lies in the sorted half and go there; otherwise go to the other half.", "O(log n) time, O(1) space",
`class Solution:
    def search(self, nums, target):
        l, r = 0, len(nums) - 1
        while l <= r:
            m = (l + r) // 2
            if nums[m] == target:
                return m
            if nums[l] <= nums[m]:            # left half sorted
                if nums[l] <= target < nums[m]:
                    r = m - 1
                else:
                    l = m + 1
            else:                             # right half sorted
                if nums[m] < target <= nums[r]:
                    l = m + 1
                else:
                    r = m - 1
        return -1`);
add("time-based-key-value-store", "Per key keep a list of (timestamp, value) in increasing time; get() binary searches for the latest timestamp <= query.", "set O(1), get O(log n)",
`import bisect
from collections import defaultdict

class TimeMap:
    def __init__(self):
        self.times = defaultdict(list)
        self.vals = defaultdict(list)

    def set(self, key, value, timestamp):
        self.times[key].append(timestamp)
        self.vals[key].append(value)

    def get(self, key, timestamp):
        i = bisect.bisect_right(self.times[key], timestamp)
        return self.vals[key][i - 1] if i else ""`);
add("median-of-two-sorted-arrays", "Binary search the partition of the smaller array so left halves hold half the elements and max(left) <= min(right).", "O(log(min(m, n))) time, O(1) space",
`class Solution:
    def findMedianSortedArrays(self, nums1, nums2):
        A, B = nums1, nums2
        if len(A) > len(B):
            A, B = B, A
        total, half = len(A) + len(B), (len(A) + len(B) + 1) // 2
        l, r = 0, len(A)
        inf = float("inf")
        while True:
            i = (l + r) // 2
            j = half - i
            aL = A[i - 1] if i > 0 else -inf
            aR = A[i] if i < len(A) else inf
            bL = B[j - 1] if j > 0 else -inf
            bR = B[j] if j < len(B) else inf
            if aL <= bR and bL <= aR:
                if total % 2:
                    return max(aL, bL)
                return (max(aL, bL) + min(aR, bR)) / 2
            if aL > bR:
                r = i - 1
            else:
                l = i + 1`);
