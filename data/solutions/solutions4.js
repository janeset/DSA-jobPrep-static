// Worked Python solutions for the problems added from the FAANG Top 250 (research/faang-top250.csv).
// Same format as solutions1-3.js: SOL[slug] = { a: approach, t: complexity, c: code }. Uses add() from solutions1.js.

// ---- Batch 1: new problems from the top 50 ----
add("palindrome-number", "Reverse only the second half of the digits and compare it with the first half; no string conversion needed.", "O(log n) time, O(1) space",
`class Solution:
    def isPalindrome(self, x):
        if x < 0 or (x % 10 == 0 and x != 0):
            return False
        rev = 0
        while x > rev:
            rev = rev * 10 + x % 10
            x //= 10
        # odd digit count: the middle digit sits at the end of rev
        return x == rev or x == rev // 10`);
add("longest-common-prefix", "Start with the first word as the prefix and trim it until every other word starts with it.", "O(S) time where S is the total number of characters, O(1) extra space",
`class Solution:
    def longestCommonPrefix(self, strs):
        prefix = strs[0]
        for s in strs[1:]:
            while not s.startswith(prefix):
                prefix = prefix[:-1]
        return prefix`);
add("merge-sorted-array", "Fill nums1 from the back: compare the largest remaining values of both arrays and place the bigger one at the end.", "O(m + n) time, O(1) space",
`class Solution:
    def merge(self, nums1, m, nums2, n):
        i, j, k = m - 1, n - 1, m + n - 1
        while j >= 0:
            if i >= 0 and nums1[i] > nums2[j]:
                nums1[k] = nums1[i]
                i -= 1
            else:
                nums1[k] = nums2[j]
                j -= 1
            k -= 1`);
add("3sum-closest", "Sort, fix the first number, then two-pointer the rest, keeping the sum nearest the target. Move left up if the sum is too small, right down if too big.", "O(n^2) time, O(1) extra space (besides sorting)",
`class Solution:
    def threeSumClosest(self, nums, target):
        nums.sort()
        best = nums[0] + nums[1] + nums[2]
        for i in range(len(nums) - 2):
            lo, hi = i + 1, len(nums) - 1
            while lo < hi:
                s = nums[i] + nums[lo] + nums[hi]
                if abs(s - target) < abs(best - target):
                    best = s
                if s < target:
                    lo += 1
                elif s > target:
                    hi -= 1
                else:
                    return s
        return best`);
add("4sum", "3Sum with one more fixed number: sort, fix two numbers with nested loops, two-pointer the rest, and skip repeated values at every level.", "O(n^3) time, O(1) extra space (besides the output)",
`class Solution:
    def fourSum(self, nums, target):
        nums.sort()
        n, res = len(nums), []
        for a in range(n - 3):
            if a > 0 and nums[a] == nums[a - 1]:
                continue
            for b in range(a + 1, n - 2):
                if b > a + 1 and nums[b] == nums[b - 1]:
                    continue
                lo, hi = b + 1, n - 1
                while lo < hi:
                    s = nums[a] + nums[b] + nums[lo] + nums[hi]
                    if s < target:
                        lo += 1
                    elif s > target:
                        hi -= 1
                    else:
                        res.append([nums[a], nums[b], nums[lo], nums[hi]])
                        lo += 1
                        while lo < hi and nums[lo] == nums[lo - 1]:
                            lo += 1
                        hi -= 1
        return res`);
add("next-permutation", "From the right, find the first number smaller than its right neighbour. Swap it with the smallest larger number to its right, then reverse the tail.", "O(n) time, O(1) space",
`class Solution:
    def nextPermutation(self, nums):
        i = len(nums) - 2
        while i >= 0 and nums[i] >= nums[i + 1]:
            i -= 1
        if i >= 0:
            j = len(nums) - 1
            while nums[j] <= nums[i]:
                j -= 1
            nums[i], nums[j] = nums[j], nums[i]
        nums[i + 1:] = reversed(nums[i + 1:])`);
add("max-consecutive-ones-iii", "Sliding window that may hold at most k zeros: grow right, and when there are too many zeros, move left until there aren't.", "O(n) time, O(1) space",
`class Solution:
    def longestOnes(self, nums, k):
        left = zeros = best = 0
        for right, x in enumerate(nums):
            if x == 0:
                zeros += 1
            while zeros > k:
                if nums[left] == 0:
                    zeros -= 1
                left += 1
            best = max(best, right - left + 1)
        return best`);
add("search-insert-position", "Binary search for the first index whose value is >= target (lower bound). That's where it is, or where it would go.", "O(log n) time, O(1) space",
`class Solution:
    def searchInsert(self, nums, target):
        lo, hi = 0, len(nums)
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] < target:
                lo = mid + 1
            else:
                hi = mid
        return lo`);
add("find-first-and-last-position-of-element-in-sorted-array", "Two lower-bound binary searches: the first index >= target, and the first index >= target + 1, minus one.", "O(log n) time, O(1) space",
`class Solution:
    def searchRange(self, nums, target):
        def lower(x):  # first index with nums[i] >= x
            lo, hi = 0, len(nums)
            while lo < hi:
                mid = (lo + hi) // 2
                if nums[mid] < x:
                    lo = mid + 1
                else:
                    hi = mid
            return lo
        first = lower(target)
        if first == len(nums) or nums[first] != target:
            return [-1, -1]
        return [first, lower(target + 1) - 1]`);
add("find-peak-element", "Binary search on the slope: if nums[mid] < nums[mid + 1] a peak lies to the right, otherwise at mid or to its left.", "O(log n) time, O(1) space",
`class Solution:
    def findPeakElement(self, nums):
        lo, hi = 0, len(nums) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] < nums[mid + 1]:
                lo = mid + 1
            else:
                hi = mid
        return lo`);
add("roman-to-integer", "Add each symbol's value, except subtract it when a larger symbol follows (IV, IX, XL...).", "O(n) time, O(1) space",
`class Solution:
    def romanToInt(self, s):
        val = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
        total = 0
        for i, c in enumerate(s):
            if i + 1 < len(s) and val[c] < val[s[i + 1]]:
                total -= val[c]
            else:
                total += val[c]
        return total`);

// ---- Batch 2: new problems from ranks 51-100 ----
add("remove-element", "Keep a write pointer: copy every value that isn't val forward, and return how many were kept.", "O(n) time, O(1) space",
`class Solution:
    def removeElement(self, nums, val):
        k = 0
        for x in nums:
            if x != val:
                nums[k] = x
                k += 1
        return k`);
add("merge-strings-alternately", "Walk both words with one index, taking a letter from each while they last, then append whatever is left of the longer word.", "O(m + n) time, O(m + n) space for the result",
`class Solution:
    def mergeAlternately(self, word1, word2):
        out = []
        for i in range(max(len(word1), len(word2))):
            if i < len(word1):
                out.append(word1[i])
            if i < len(word2):
                out.append(word2[i])
        return "".join(out)`);
add("squares-of-a-sorted-array", "The biggest square is at one of the two ends. Two pointers from the ends fill the result from the back.", "O(n) time, O(n) space for the result",
`class Solution:
    def sortedSquares(self, nums):
        res = [0] * len(nums)
        lo, hi = 0, len(nums) - 1
        for k in range(len(nums) - 1, -1, -1):
            if abs(nums[lo]) > abs(nums[hi]):
                res[k] = nums[lo] * nums[lo]
                lo += 1
            else:
                res[k] = nums[hi] * nums[hi]
                hi -= 1
        return res`);
add("intersection-of-two-arrays", "Put one array in a set, then keep the values of the other that are in it (as a set, so each appears once).", "O(n + m) time, O(n + m) space",
`class Solution:
    def intersection(self, nums1, nums2):
        return list(set(nums1) & set(nums2))`);
add("find-the-index-of-the-first-occurrence-in-a-string", "Try every start position and compare the next len(needle) characters. (KMP gets O(n + m), but this is what's expected first.)", "O(n * m) time, O(1) space",
`class Solution:
    def strStr(self, haystack, needle):
        n, m = len(haystack), len(needle)
        for i in range(n - m + 1):
            if haystack[i:i + m] == needle:
                return i
        return -1`);
add("first-missing-positive", "The answer is in 1..n+1. Use the array itself as a hash: swap each value v in 1..n into slot v - 1, then the first slot i without i + 1 gives the answer.", "O(n) time, O(1) extra space",
`class Solution:
    def firstMissingPositive(self, nums):
        n = len(nums)
        for i in range(n):
            while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
                j = nums[i] - 1
                nums[i], nums[j] = nums[j], nums[i]
        for i in range(n):
            if nums[i] != i + 1:
                return i + 1
        return n + 1`);
add("max-consecutive-ones", "Count the current run of 1s, reset it on a 0, and keep the longest.", "O(n) time, O(1) space",
`class Solution:
    def findMaxConsecutiveOnes(self, nums):
        best = cur = 0
        for x in nums:
            cur = cur + 1 if x == 1 else 0
            best = max(best, cur)
        return best`);
add("minimum-size-subarray-sum", "All numbers are positive, so a sliding window works: grow right, and while the sum is at least target, record the length and shrink from the left.", "O(n) time, O(1) space",
`class Solution:
    def minSubArrayLen(self, target, nums):
        left = total = 0
        best = float("inf")
        for right, x in enumerate(nums):
            total += x
            while total >= target:
                best = min(best, right - left + 1)
                total -= nums[left]
                left += 1
        return 0 if best == float("inf") else best`);
add("fruit-into-baskets", "Longest window with at most two distinct values: count types in the window and shrink from the left when a third type appears.", "O(n) time, O(1) space (at most 3 keys)",
`class Solution:
    def totalFruit(self, fruits):
        count = {}
        left = best = 0
        for right, f in enumerate(fruits):
            count[f] = count.get(f, 0) + 1
            while len(count) > 2:
                count[fruits[left]] -= 1
                if count[fruits[left]] == 0:
                    del count[fruits[left]]
                left += 1
            best = max(best, right - left + 1)
        return best`);
add("next-greater-element-i", "Monotonic stack over nums2: when a bigger value arrives, it's the next greater element for everything smaller on the stack. Store the answers in a hash map, then look up nums1.", "O(n + m) time, O(m) space",
`class Solution:
    def nextGreaterElement(self, nums1, nums2):
        nxt, stack = {}, []
        for x in nums2:
            while stack and stack[-1] < x:
                nxt[stack.pop()] = x
            stack.append(x)
        return [nxt.get(x, -1) for x in nums1]`);
add("sqrtx", "Binary search for the largest r with r * r <= x.", "O(log x) time, O(1) space",
`class Solution:
    def mySqrt(self, x):
        lo, hi = 0, x
        while lo < hi:
            mid = (lo + hi + 1) // 2
            if mid * mid <= x:
                lo = mid
            else:
                hi = mid - 1
        return lo`);
add("kth-missing-positive-number", "arr[i] - (i + 1) counts how many numbers are missing before index i. Binary search for the first index where that count reaches k; the answer is that index + k.", "O(log n) time, O(1) space",
`class Solution:
    def findKthPositive(self, arr, k):
        lo, hi = 0, len(arr)
        while lo < hi:
            mid = (lo + hi) // 2
            if arr[mid] - (mid + 1) < k:
                lo = mid + 1
            else:
                hi = mid
        return lo + k`);
add("single-element-in-a-sorted-array", "Before the single element, pairs start at even indices; after it, at odd ones. Binary search on even indices: if nums[mid] == nums[mid + 1] the single is to the right.", "O(log n) time, O(1) space",
`class Solution:
    def singleNonDuplicate(self, nums):
        lo, hi = 0, len(nums) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if mid % 2 == 1:
                mid -= 1
            if nums[mid] == nums[mid + 1]:
                lo = mid + 2
            else:
                hi = mid
        return nums[lo]`);
add("random-pick-with-weight", "Prefix sums turn the weights into ranges on a number line. Pick a random point in [1, total] and binary search for the range it falls in.", "O(n) to build, O(log n) per pick, O(n) space",
`import bisect
import random

class Solution:
    def __init__(self, w):
        self.prefix = []
        total = 0
        for x in w:
            total += x
            self.prefix.append(total)

    def pickIndex(self):
        r = random.randint(1, self.prefix[-1])
        return bisect.bisect_left(self.prefix, r)`);
add("palindrome-linked-list", "Find the middle with slow and fast pointers, reverse the second half, then compare the two halves node by node.", "O(n) time, O(1) space",
`class Solution:
    def isPalindrome(self, head):
        slow = fast = head
        while fast and fast.next:
            slow, fast = slow.next, fast.next.next
        prev = None
        while slow:
            slow.next, prev, slow = prev, slow, slow.next
        a, b = head, prev
        while b:
            if a.val != b.val:
                return False
            a, b = a.next, b.next
        return True`);
add("find-the-duplicate-number", "Treat i -> nums[i] as a linked list; the duplicate is where the cycle starts. Floyd: find a meeting point, then walk from the start and the meeting point together.", "O(n) time, O(1) space, array not modified",
`class Solution:
    def findDuplicate(self, nums):
        slow = fast = nums[0]
        while True:
            slow = nums[slow]
            fast = nums[nums[fast]]
            if slow == fast:
                break
        slow = nums[0]
        while slow != fast:
            slow = nums[slow]
            fast = nums[fast]
        return slow`);
add("lowest-common-ancestor-of-a-binary-tree", "Recurse: a node that is p or q returns itself. If both subtrees return something, this node is the LCA; otherwise pass up whichever side found one.", "O(n) time, O(h) space for the recursion",
`class Solution:
    def lowestCommonAncestor(self, root, p, q):
        if root is None or root is p or root is q:
            return root
        left = self.lowestCommonAncestor(root.left, p, q)
        right = self.lowestCommonAncestor(root.right, p, q)
        if left and right:
            return root
        return left or right`);
add("best-time-to-buy-and-sell-stock-ii", "With unlimited trades, take every rise: add prices[i] - prices[i - 1] whenever it's positive.", "O(n) time, O(1) space",
`class Solution:
    def maxProfit(self, prices):
        return sum(max(0, prices[i] - prices[i - 1]) for i in range(1, len(prices)))`);
add("power-of-two", "A power of two has exactly one 1 bit, so n > 0 and n & (n - 1) == 0.", "O(1) time and space",
`class Solution:
    def isPowerOfTwo(self, n):
        return n > 0 and n & (n - 1) == 0`);
add("fibonacci-number", "Bottom-up: keep the last two values and step forward n times.", "O(n) time, O(1) space",
`class Solution:
    def fib(self, n):
        a, b = 0, 1
        for _ in range(n):
            a, b = b, a + b
        return a`);

// ---- Batch 3: new problems from ranks 101-150 ----
add("check-if-array-is-sorted-and-rotated", "A sorted array rotated once has at most one place where a value is bigger than the next one, counting the wrap from the last element to the first.", "O(n) time, O(1) space",
`class Solution:
    def check(self, nums):
        n = len(nums)
        drops = sum(1 for i in range(n) if nums[i] > nums[(i + 1) % n])
        return drops <= 1`);
add("first-unique-character-in-a-string", "Count every character, then return the first index whose character has count 1.", "O(n) time, O(1) space (26 letters)",
`from collections import Counter

class Solution:
    def firstUniqChar(self, s):
        count = Counter(s)
        for i, c in enumerate(s):
            if count[c] == 1:
                return i
        return -1`);
add("rotate-string", "Every rotation of s is a substring of s + s, so check the lengths match and goal is in s + s.", "O(n^2) worst case with the built-in search (O(n) with KMP), O(n) space",
`class Solution:
    def rotateString(self, s, goal):
        return len(s) == len(goal) and goal in s + s`);
add("length-of-last-word", "Skip trailing spaces from the end, then count letters until the next space.", "O(n) time, O(1) space",
`class Solution:
    def lengthOfLastWord(self, s):
        i = len(s) - 1
        while s[i] == " ":
            i -= 1
        n = 0
        while i >= 0 and s[i] != " ":
            n += 1
            i -= 1
        return n`);
add("isomorphic-strings", "Map characters both ways: each character of s must always map to the same character of t, and no two characters of s may map to the same one.", "O(n) time, O(1) space (bounded alphabet)",
`class Solution:
    def isIsomorphic(self, s, t):
        st, ts = {}, {}
        for a, b in zip(s, t):
            if st.get(a, b) != b or ts.get(b, a) != a:
                return False
            st[a], ts[b] = b, a
        return True`);
add("zigzag-conversion", "Walk the string while bouncing a row index between 0 and numRows - 1, appending each character to its row, then join the rows.", "O(n) time, O(n) space",
`class Solution:
    def convert(self, s, numRows):
        if numRows == 1:
            return s
        rows = [[] for _ in range(numRows)]
        r, step = 0, 1
        for c in s:
            rows[r].append(c)
            if r == 0:
                step = 1
            elif r == numRows - 1:
                step = -1
            r += step
        return "".join("".join(row) for row in rows)`);
add("valid-palindrome-ii", "Two pointers from both ends. At the first mismatch you may delete one side: check whether either remaining middle part is a palindrome.", "O(n) time, O(1) extra space (O(n) for the slices)",
`class Solution:
    def validPalindrome(self, s):
        lo, hi = 0, len(s) - 1
        while lo < hi:
            if s[lo] != s[hi]:
                a, b = s[lo + 1:hi + 1], s[lo:hi]
                return a == a[::-1] or b == b[::-1]
            lo += 1
            hi -= 1
        return True`);
add("reverse-string", "Swap the two ends and move both pointers inward.", "O(n) time, O(1) space",
`class Solution:
    def reverseString(self, s):
        lo, hi = 0, len(s) - 1
        while lo < hi:
            s[lo], s[hi] = s[hi], s[lo]
            lo += 1
            hi -= 1`);
add("remove-duplicates-from-sorted-array-ii", "Write pointer k: keep a value if k < 2 or it differs from the value two slots back in the kept part.", "O(n) time, O(1) space",
`class Solution:
    def removeDuplicates(self, nums):
        k = 0
        for x in nums:
            if k < 2 or x != nums[k - 2]:
                nums[k] = x
                k += 1
        return k`);
add("decode-string", "Stack of (string so far, repeat count). On '[' push and start fresh; on ']' pop and append the current string repeated.", "O(output length) time and space",
`class Solution:
    def decodeString(self, s):
        stack, cur, num = [], "", 0
        for c in s:
            if c.isdigit():
                num = num * 10 + int(c)
            elif c == "[":
                stack.append((cur, num))
                cur, num = "", 0
            elif c == "]":
                prev, k = stack.pop()
                cur = prev + cur * k
            else:
                cur += c
        return cur`);
add("next-greater-element-ii", "Monotonic stack of indices, scanning the array twice (i mod n) to handle the wrap-around.", "O(n) time, O(n) space",
`class Solution:
    def nextGreaterElements(self, nums):
        n = len(nums)
        res, stack = [-1] * n, []
        for i in range(2 * n):
            x = nums[i % n]
            while stack and nums[stack[-1]] < x:
                res[stack.pop()] = x
            if i < n:
                stack.append(i)
        return res`);
add("longest-valid-parentheses", "Stack of indices with a sentinel -1. Push '(' indices; on ')' pop, and if the stack empties push this index as the new base, otherwise the valid run is i - stack top.", "O(n) time, O(n) space",
`class Solution:
    def longestValidParentheses(self, s):
        stack, best = [-1], 0
        for i, c in enumerate(s):
            if c == "(":
                stack.append(i)
            else:
                stack.pop()
                if not stack:
                    stack.append(i)
                else:
                    best = max(best, i - stack[-1])
        return best`);
add("search-a-2d-matrix-ii", "Start at the top-right corner: if the value is too big move left, if too small move down. Each step removes a row or a column.", "O(m + n) time, O(1) space",
`class Solution:
    def searchMatrix(self, matrix, target):
        r, c = 0, len(matrix[0]) - 1
        while r < len(matrix) and c >= 0:
            v = matrix[r][c]
            if v == target:
                return True
            if v > target:
                c -= 1
            else:
                r += 1
        return False`);
add("capacity-to-ship-packages-within-d-days", "Binary search the capacity between max(weights) and sum(weights); a capacity works if loading greedily in order needs at most days days.", "O(n log(sum)) time, O(1) space",
`class Solution:
    def shipWithinDays(self, weights, days):
        def need(cap):
            d, load = 1, 0
            for w in weights:
                if load + w > cap:
                    d += 1
                    load = 0
                load += w
            return d
        lo, hi = max(weights), sum(weights)
        while lo < hi:
            mid = (lo + hi) // 2
            if need(mid) <= days:
                hi = mid
            else:
                lo = mid + 1
        return lo`);
add("split-array-largest-sum", "Binary search the answer (the largest part sum): a limit works if a greedy split needs at most k parts.", "O(n log(sum)) time, O(1) space",
`class Solution:
    def splitArray(self, nums, k):
        def parts(limit):
            count, cur = 1, 0
            for x in nums:
                if cur + x > limit:
                    count += 1
                    cur = 0
                cur += x
            return count
        lo, hi = max(nums), sum(nums)
        while lo < hi:
            mid = (lo + hi) // 2
            if parts(mid) <= k:
                hi = mid
            else:
                lo = mid + 1
        return lo`);
add("rotate-list", "Find the length and tail, make the list a ring, then cut it n - k % n steps from the head.", "O(n) time, O(1) space",
`class Solution:
    def rotateRight(self, head, k):
        if not head or not head.next:
            return head
        n, tail = 1, head
        while tail.next:
            tail = tail.next
            n += 1
        k %= n
        if k == 0:
            return head
        tail.next = head
        new_tail = head
        for _ in range(n - k - 1):
            new_tail = new_tail.next
        new_head = new_tail.next
        new_tail.next = None
        return new_head`);
add("sort-list", "Merge sort: split the list in half with slow and fast pointers, sort both halves, merge them.", "O(n log n) time, O(log n) space for the recursion",
`class Solution:
    def sortList(self, head):
        if not head or not head.next:
            return head
        slow, fast = head, head.next
        while fast and fast.next:
            slow, fast = slow.next, fast.next.next
        mid, slow.next = slow.next, None
        a, b = self.sortList(head), self.sortList(mid)
        dummy = tail = ListNode()
        while a and b:
            if a.val <= b.val:
                tail.next, a = a, a.next
            else:
                tail.next, b = b, b.next
            tail = tail.next
        tail.next = a or b
        return dummy.next`);
add("reverse-nodes-in-k-group", "Check that k nodes remain, reverse exactly those k, link the reversed group to the previous part, and repeat from the group's new tail.", "O(n) time, O(1) space",
`class Solution:
    def reverseKGroup(self, head, k):
        dummy = ListNode(0, head)
        group_prev = dummy
        while True:
            kth = group_prev
            for _ in range(k):
                kth = kth.next
                if not kth:
                    return dummy.next
            group_next = kth.next
            prev, cur = group_next, group_prev.next
            while cur is not group_next:
                cur.next, prev, cur = prev, cur, cur.next
            first = group_prev.next
            group_prev.next = kth
            group_prev = first`);
add("binary-tree-inorder-traversal", "Iterative inorder: go left as far as possible pushing nodes, pop one, visit it, then go to its right child.", "O(n) time, O(h) space",
`class Solution:
    def inorderTraversal(self, root):
        res, stack, node = [], [], root
        while stack or node:
            while node:
                stack.append(node)
                node = node.left
            node = stack.pop()
            res.append(node.val)
            node = node.right
        return res`);
add("symmetric-tree", "The tree is symmetric if its left and right subtrees are mirrors: equal roots, and left.left mirrors right.right while left.right mirrors right.left.", "O(n) time, O(h) space",
`class Solution:
    def isSymmetric(self, root):
        def mirror(a, b):
            if not a or not b:
                return a is b
            return a.val == b.val and mirror(a.left, b.right) and mirror(a.right, b.left)
        return mirror(root.left, root.right)`);
add("all-nodes-distance-k-in-binary-tree", "Record each node's parent so the tree becomes an undirected graph, then BFS k steps out from the target.", "O(n) time, O(n) space",
`from collections import deque

class Solution:
    def distanceK(self, root, target, k):
        parent, stack = {root: None}, [root]
        while stack:
            node = stack.pop()
            for child in (node.left, node.right):
                if child:
                    parent[child] = node
                    stack.append(child)
        seen, q = {target}, deque([target])
        for _ in range(k):
            for _ in range(len(q)):
                node = q.popleft()
                for nxt in (node.left, node.right, parent[node]):
                    if nxt and nxt not in seen:
                        seen.add(nxt)
                        q.append(nxt)
        return [node.val for node in q]`);
add("meeting-rooms-ii", "Sort by start time; a min-heap holds the end times of rooms in use. Reuse the room that frees up first if it's free by this start, else open a new one.", "O(n log n) time, O(n) space",
`import heapq

class Solution:
    def minMeetingRooms(self, intervals):
        intervals.sort()
        ends = []
        for start, end in intervals:
            if ends and ends[0] <= start:
                heapq.heapreplace(ends, end)
            else:
                heapq.heappush(ends, end)
        return len(ends)`);
add("reorganize-string", "Greedy with a max-heap of counts: always place the most frequent letter that isn't the one just placed. If a letter appears more than (n + 1) / 2 times it's impossible.", "O(n log 26) time, O(26) space",
`import heapq
from collections import Counter

class Solution:
    def reorganizeString(self, s):
        heap = [(-n, c) for c, n in Counter(s).items()]
        heapq.heapify(heap)
        out, prev = [], None
        while heap:
            n, c = heapq.heappop(heap)
            out.append(c)
            if prev:
                heapq.heappush(heap, prev)
            prev = (n + 1, c) if n + 1 < 0 else None
        return "".join(out) if len(out) == len(s) else ""`);
add("subsets-ii", "Sort, then backtrack; at each level skip a value equal to the previous one at the same level, so duplicate subsets are never built.", "O(n * 2^n) time, O(n) space besides the output",
`class Solution:
    def subsetsWithDup(self, nums):
        nums.sort()
        res = []
        def go(start, path):
            res.append(path[:])
            for i in range(start, len(nums)):
                if i > start and nums[i] == nums[i - 1]:
                    continue
                path.append(nums[i])
                go(i + 1, path)
                path.pop()
        go(0, [])
        return res`);
add("largest-number", "Sort the numbers as strings with the rule 'a before b if a + b > b + a', then join. Return '0' if the result starts with 0.", "O(n log n) comparisons, O(n) space",
`from functools import cmp_to_key

class Solution:
    def largestNumber(self, nums):
        strs = sorted(map(str, nums), key=cmp_to_key(lambda a, b: -1 if a + b > b + a else 1 if a + b < b + a else 0))
        res = "".join(strs)
        return "0" if res[0] == "0" else res`);
add("integer-to-roman", "Greedy over the 13 values (including the subtractive pairs like 900 = CM): take the largest that fits, as many times as it fits.", "O(1) time and space (the number is at most 3,999)",
`class Solution:
    def intToRoman(self, num):
        vals = [(1000, "M"), (900, "CM"), (500, "D"), (400, "CD"), (100, "C"), (90, "XC"),
                (50, "L"), (40, "XL"), (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")]
        out = []
        for v, sym in vals:
            while num >= v:
                out.append(sym)
                num -= v
        return "".join(out)`);
add("add-binary", "Add from the right with a carry, digit by digit, then reverse.", "O(max(m, n)) time and space",
`class Solution:
    def addBinary(self, a, b):
        i, j, carry, out = len(a) - 1, len(b) - 1, 0, []
        while i >= 0 or j >= 0 or carry:
            total = carry
            if i >= 0:
                total += int(a[i])
                i -= 1
            if j >= 0:
                total += int(b[j])
                j -= 1
            out.append(str(total % 2))
            carry = total // 2
        return "".join(reversed(out))`);
add("pascals-triangle", "Each row starts and ends with 1; every middle value is the sum of the two values above it.", "O(numRows^2) time and space",
`class Solution:
    def generate(self, numRows):
        rows = [[1]]
        for _ in range(numRows - 1):
            prev = rows[-1]
            rows.append([1] + [prev[i] + prev[i + 1] for i in range(len(prev) - 1)] + [1])
        return rows`);
add("regular-expression-matching", "dp[i][j] = s[i:] matches p[j:]. If p[j + 1] is '*', either skip 'x*' or, when the first characters match, use it once and stay on j.", "O(m * n) time and space",
`from functools import lru_cache

class Solution:
    def isMatch(self, s, p):
        @lru_cache(None)
        def dp(i, j):
            if j == len(p):
                return i == len(s)
            first = i < len(s) and p[j] in (s[i], ".")
            if j + 1 < len(p) and p[j + 1] == "*":
                return dp(i, j + 2) or (first and dp(i + 1, j))
            return first and dp(i + 1, j + 1)
        return dp(0, 0)`);

// ---- Batch 4: new problems from ranks 151-200 ----
add("contains-duplicate-ii", "Remember each value's last index in a hash map; a repeat within k of its last position is the answer.", "O(n) time, O(n) space",
`class Solution:
    def containsNearbyDuplicate(self, nums, k):
        last = {}
        for i, x in enumerate(nums):
            if x in last and i - last[x] <= k:
                return True
            last[x] = i
        return False`);
add("find-all-anagrams-in-a-string", "Slide a window of len(p) over s, keeping letter counts updated as it moves, and record each start where the counts match p's.", "O(n) time (26-letter compare per step), O(1) space",
`from collections import Counter

class Solution:
    def findAnagrams(self, s, p):
        m, need, win, res = len(p), Counter(p), Counter(), []
        for i, c in enumerate(s):
            win[c] += 1
            if i >= m:
                out = s[i - m]
                win[out] -= 1
                if win[out] == 0:
                    del win[out]
            if win == need:
                res.append(i - m + 1)
        return res`);
add("set-mismatch", "Count each value; the one seen twice is the duplicate and the one never seen is the missing number.", "O(n) time, O(n) space",
`class Solution:
    def findErrorNums(self, nums):
        n = len(nums)
        seen = [0] * (n + 1)
        for x in nums:
            seen[x] += 1
        dup = seen.index(2)
        missing = seen.index(0, 1)
        return [dup, missing]`);
add("ransom-note", "Count the magazine's letters, then spend them on the note; fail if any count goes negative.", "O(m + n) time, O(1) space (26 letters)",
`from collections import Counter

class Solution:
    def canConstruct(self, ransomNote, magazine):
        have = Counter(magazine)
        for c in ransomNote:
            have[c] -= 1
            if have[c] < 0:
                return False
        return True`);
add("can-make-arithmetic-progression-from-sequence", "Sort; then every neighbouring difference must equal the first one.", "O(n log n) time, O(1) extra space",
`class Solution:
    def canMakeArithmeticProgression(self, arr):
        arr.sort()
        d = arr[1] - arr[0]
        return all(arr[i + 1] - arr[i] == d for i in range(len(arr) - 1))`);
add("majority-element-ii", "At most two values can appear more than n/3 times. Boyer-Moore with two candidates, then a second pass to confirm their counts.", "O(n) time, O(1) space",
`class Solution:
    def majorityElement(self, nums):
        c1, c2, n1, n2 = None, None, 0, 0
        for x in nums:
            if x == c1:
                n1 += 1
            elif x == c2:
                n2 += 1
            elif n1 == 0:
                c1, n1 = x, 1
            elif n2 == 0:
                c2, n2 = x, 1
            else:
                n1 -= 1
                n2 -= 1
        return [c for c in (c1, c2) if c is not None and nums.count(c) > len(nums) // 3]`);
add("sort-an-array", "Merge sort: split in half, sort each half recursively, merge the two sorted halves.", "O(n log n) time, O(n) space",
`class Solution:
    def sortArray(self, nums):
        if len(nums) <= 1:
            return nums
        mid = len(nums) // 2
        a, b = self.sortArray(nums[:mid]), self.sortArray(nums[mid:])
        out, i, j = [], 0, 0
        while i < len(a) and j < len(b):
            if a[i] <= b[j]:
                out.append(a[i])
                i += 1
            else:
                out.append(b[j])
                j += 1
        return out + a[i:] + b[j:]`);
add("subarray-sums-divisible-by-k", "Two prefix sums with the same remainder mod k bound a subarray divisible by k. Count remainders as you go.", "O(n) time, O(k) space",
`class Solution:
    def subarraysDivByK(self, nums, k):
        count = {0: 1}
        prefix = res = 0
        for x in nums:
            prefix = (prefix + x) % k
            res += count.get(prefix, 0)
            count[prefix] = count.get(prefix, 0) + 1
        return res`);
add("contiguous-array", "Treat 0 as -1. A subarray with equal 0s and 1s sums to 0, so look for the earliest index with the same running sum.", "O(n) time, O(n) space",
`class Solution:
    def findMaxLength(self, nums):
        first = {0: -1}
        total = best = 0
        for i, x in enumerate(nums):
            total += 1 if x else -1
            if total in first:
                best = max(best, i - first[total])
            else:
                first[total] = i
        return best`);
add("reverse-pairs", "Merge sort: before merging two sorted halves, count pairs with left > 2 * right using a moving pointer.", "O(n log n) time, O(n) space",
`class Solution:
    def reversePairs(self, nums):
        def sort(a):
            if len(a) <= 1:
                return a, 0
            mid = len(a) // 2
            left, x = sort(a[:mid])
            right, y = sort(a[mid:])
            count, j = x + y, 0
            for v in left:
                while j < len(right) and v > 2 * right[j]:
                    j += 1
                count += j
            merged, i, j = [], 0, 0
            while i < len(left) and j < len(right):
                if left[i] <= right[j]:
                    merged.append(left[i])
                    i += 1
                else:
                    merged.append(right[j])
                    j += 1
            return merged + left[i:] + right[j:], count
        return sort(nums)[1]`);
add("reverse-vowels-of-a-string", "Two pointers moving inward, each skipping non-vowels; swap when both sit on vowels.", "O(n) time, O(n) space for the list",
`class Solution:
    def reverseVowels(self, s):
        vowels = set("aeiouAEIOU")
        a = list(s)
        lo, hi = 0, len(a) - 1
        while lo < hi:
            if a[lo] not in vowels:
                lo += 1
            elif a[hi] not in vowels:
                hi -= 1
            else:
                a[lo], a[hi] = a[hi], a[lo]
                lo += 1
                hi -= 1
        return "".join(a)`);
add("reverse-words-in-a-string", "Split on whitespace (which drops extra spaces), reverse the words, join with single spaces.", "O(n) time, O(n) space",
`class Solution:
    def reverseWords(self, s):
        return " ".join(reversed(s.split()))`);
add("string-compression", "Read pointer finds each run; write pointer writes the character and, if the run is longer than 1, its count digit by digit.", "O(n) time, O(1) extra space",
`class Solution:
    def compress(self, chars):
        write = read = 0
        while read < len(chars):
            c, start = chars[read], read
            while read < len(chars) and chars[read] == c:
                read += 1
            chars[write] = c
            write += 1
            if read - start > 1:
                for d in str(read - start):
                    chars[write] = d
                    write += 1
        return write`);
add("asteroid-collision", "Stack of surviving asteroids. A left-moving one destroys smaller right-moving ones on top of the stack; equal sizes both explode.", "O(n) time, O(n) space",
`class Solution:
    def asteroidCollision(self, asteroids):
        stack = []
        for a in asteroids:
            alive = True
            while alive and a < 0 and stack and stack[-1] > 0:
                if stack[-1] < -a:
                    stack.pop()
                    continue
                if stack[-1] == -a:
                    stack.pop()
                alive = False
            if alive:
                stack.append(a)
        return stack`);
add("basic-calculator", "Scan once with a running result and sign. On '(' push the result and sign and start fresh; on ')' combine with what was pushed.", "O(n) time, O(n) space for nested brackets",
`class Solution:
    def calculate(self, s):
        res, num, sign, stack = 0, 0, 1, []
        for c in s:
            if c.isdigit():
                num = num * 10 + int(c)
            elif c in "+-":
                res += sign * num
                num, sign = 0, 1 if c == "+" else -1
            elif c == "(":
                stack.append((res, sign))
                res, sign = 0, 1
            elif c == ")":
                res += sign * num
                num = 0
                prev, prev_sign = stack.pop()
                res = prev + prev_sign * res
        return res + sign * num`);
add("first-bad-version", "Binary search for the first version where isBadVersion is true.", "O(log n) time, O(1) space",
`class Solution:
    def firstBadVersion(self, n):
        lo, hi = 1, n
        while lo < hi:
            mid = (lo + hi) // 2
            if isBadVersion(mid):
                hi = mid
            else:
                lo = mid + 1
        return lo`);
add("remove-duplicates-from-sorted-list", "Walk the list; while the next node has the same value, skip it.", "O(n) time, O(1) space",
`class Solution:
    def deleteDuplicates(self, head):
        cur = head
        while cur and cur.next:
            if cur.next.val == cur.val:
                cur.next = cur.next.next
            else:
                cur = cur.next
        return head`);
add("odd-even-linked-list", "Keep two chains, odd and even, linking every other node to each; then attach the even chain after the odd one.", "O(n) time, O(1) space",
`class Solution:
    def oddEvenList(self, head):
        if not head:
            return head
        odd, even = head, head.next
        even_head = even
        while even and even.next:
            odd.next = even.next
            odd = odd.next
            even.next = odd.next
            even = even.next
        odd.next = even_head
        return head`);
add("linked-list-cycle-ii", "Floyd: after slow and fast meet, a pointer from the head and one from the meeting point, moving one step each, meet at the cycle's start.", "O(n) time, O(1) space",
`class Solution:
    def detectCycle(self, head):
        slow = fast = head
        while fast and fast.next:
            slow, fast = slow.next, fast.next.next
            if slow is fast:
                p = head
                while p is not slow:
                    p, slow = p.next, slow.next
                return p
        return None`);
add("convert-sorted-array-to-binary-search-tree", "The middle value becomes the root; build the left subtree from the left half and the right subtree from the right half.", "O(n) time, O(log n) space for the recursion",
`class Solution:
    def sortedArrayToBST(self, nums):
        def build(lo, hi):
            if lo > hi:
                return None
            mid = (lo + hi) // 2
            return TreeNode(nums[mid], build(lo, mid - 1), build(mid + 1, hi))
        return build(0, len(nums) - 1)`);
add("binary-tree-zigzag-level-order-traversal", "Level-order BFS, reversing every second level.", "O(n) time, O(n) space",
`from collections import deque

class Solution:
    def zigzagLevelOrder(self, root):
        if not root:
            return []
        res, q = [], deque([root])
        while q:
            level = []
            for _ in range(len(q)):
                node = q.popleft()
                level.append(node.val)
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
            res.append(level if len(res) % 2 == 0 else level[::-1])
        return res`);
add("vertical-order-traversal-of-a-binary-tree", "Record (column, row, value) for every node, sort the triples, then group by column.", "O(n log n) time, O(n) space",
`class Solution:
    def verticalTraversal(self, root):
        cells = []
        def dfs(node, row, col):
            if node:
                cells.append((col, row, node.val))
                dfs(node.left, row + 1, col - 1)
                dfs(node.right, row + 1, col + 1)
        dfs(root, 0, 0)
        cells.sort()
        res, last = [], None
        for col, _, val in cells:
            if col != last:
                res.append([])
                last = col
            res[-1].append(val)
        return res`);
add("combinations", "Backtrack from a start number: add each number from start to n, recurse from the next one, and record the path at length k.", "O(k * C(n, k)) time, O(k) space besides the output",
`class Solution:
    def combine(self, n, k):
        res = []
        def go(start, path):
            if len(path) == k:
                res.append(path[:])
                return
            for x in range(start, n + 1):
                path.append(x)
                go(x + 1, path)
                path.pop()
        go(1, [])
        return res`);
add("number-of-provinces", "Count connected components: DFS from every unvisited city, marking everything it reaches.", "O(n^2) time, O(n) space",
`class Solution:
    def findCircleNum(self, isConnected):
        n = len(isConnected)
        seen = [False] * n
        def dfs(i):
            for j in range(n):
                if isConnected[i][j] and not seen[j]:
                    seen[j] = True
                    dfs(j)
        count = 0
        for i in range(n):
            if not seen[i]:
                seen[i] = True
                dfs(i)
                count += 1
        return count`);
add("valid-parenthesis-string", "Track the range [lo, hi] of possible open-bracket counts: '(' raises both, ')' lowers both, '*' lowers lo and raises hi. Fail if hi < 0; succeed if lo can be 0 at the end.", "O(n) time, O(1) space",
`class Solution:
    def checkValidString(self, s):
        lo = hi = 0
        for c in s:
            if c == "(":
                lo, hi = lo + 1, hi + 1
            elif c == ")":
                lo, hi = lo - 1, hi - 1
            else:
                lo, hi = lo - 1, hi + 1
            if hi < 0:
                return False
            lo = max(lo, 0)
        return lo == 0`);
add("can-place-flowers", "Greedy: plant in every empty plot whose neighbours are both empty (or off the edge), and see whether that reaches n.", "O(n) time, O(1) space",
`class Solution:
    def canPlaceFlowers(self, flowerbed, n):
        bed = flowerbed
        for i in range(len(bed)):
            if bed[i] == 0 and (i == 0 or bed[i - 1] == 0) and (i == len(bed) - 1 or bed[i + 1] == 0):
                bed[i] = 1
                n -= 1
        return n <= 0`);
add("assign-cookies", "Sort both lists; give each cookie (smallest first) to the least greedy child it can satisfy.", "O(n log n + m log m) time, O(1) extra space",
`class Solution:
    def findContentChildren(self, g, s):
        g.sort()
        s.sort()
        child = 0
        for cookie in s:
            if child < len(g) and cookie >= g[child]:
                child += 1
        return child`);
add("angle-between-hands-of-a-clock", "The minute hand is at 6 degrees per minute; the hour hand at 30 per hour plus 0.5 per minute. Take the difference, and the smaller of it and 360 minus it.", "O(1) time and space",
`class Solution:
    def angleClock(self, hour, minutes):
        diff = abs((hour % 12) * 30 + minutes * 0.5 - minutes * 6)
        return min(diff, 360 - diff)`);
add("divide-two-integers", "Subtract the divisor doubled as many times as fits (shifting left), which builds the quotient bit by bit. Clamp the one overflow case.", "O(log^2 n) time, O(1) space",
`class Solution:
    def divide(self, dividend, divisor):
        if dividend == -2**31 and divisor == -1:
            return 2**31 - 1
        neg = (dividend < 0) != (divisor < 0)
        a, b, q = abs(dividend), abs(divisor), 0
        while a >= b:
            chunk, times = b, 1
            while a >= chunk << 1:
                chunk <<= 1
                times <<= 1
            a -= chunk
            q += times
        return -q if neg else q`);
add("string-to-integer-atoi", "Skip leading spaces, read an optional sign, then read digits until a non-digit; clamp the result to the 32-bit range.", "O(n) time, O(1) space",
`class Solution:
    def myAtoi(self, s):
        i, n = 0, len(s)
        while i < n and s[i] == " ":
            i += 1
        sign = 1
        if i < n and s[i] in "+-":
            sign = -1 if s[i] == "-" else 1
            i += 1
        num = 0
        while i < n and s[i].isdigit():
            num = num * 10 + int(s[i])
            i += 1
        return max(-2**31, min(2**31 - 1, sign * num))`);
add("fizz-buzz", "For each i, check divisibility by 15 first, then 3, then 5.", "O(n) time, O(n) space for the output",
`class Solution:
    def fizzBuzz(self, n):
        res = []
        for i in range(1, n + 1):
            if i % 15 == 0:
                res.append("FizzBuzz")
            elif i % 3 == 0:
                res.append("Fizz")
            elif i % 5 == 0:
                res.append("Buzz")
            else:
                res.append(str(i))
        return res`);
add("add-digits", "The repeated digit sum (digital root) is 1 + (num - 1) % 9 for num > 0, and 0 for 0.", "O(1) time and space",
`class Solution:
    def addDigits(self, num):
        return 0 if num == 0 else 1 + (num - 1) % 9`);
add("burst-balloons", "Think of the last balloon burst in each range: dp[l][r] = best over k of dp[l][k] + dp[k][r] + a[l] * a[k] * a[r], with 1s padded at both ends.", "O(n^3) time, O(n^2) space",
`class Solution:
    def maxCoins(self, nums):
        a = [1] + nums + [1]
        n = len(a)
        dp = [[0] * n for _ in range(n)]
        for length in range(2, n):
            for l in range(n - length):
                r = l + length
                best = 0
                for k in range(l + 1, r):
                    v = dp[l][k] + dp[k][r] + a[l] * a[k] * a[r]
                    if v > best:
                        best = v
                dp[l][r] = best
        return dp[0][n - 1]`);
add("predict-the-winner", "dp(i, j) = the best score difference the player to move can get from nums[i..j]: take an end and subtract what the opponent then gets.", "O(n^2) time and space",
`from functools import lru_cache

class Solution:
    def predictTheWinner(self, nums):
        @lru_cache(None)
        def diff(i, j):
            if i > j:
                return 0
            return max(nums[i] - diff(i + 1, j), nums[j] - diff(i, j - 1))
        return diff(0, len(nums) - 1) >= 0`);

// ---- Batch 5: new problems from ranks 201-250 ----
add("range-sum-query-immutable", "Precompute prefix sums once; any range sum is then a difference of two prefix sums.", "O(n) to build, O(1) per query, O(n) space",
`class NumArray:
    def __init__(self, nums):
        self.prefix = [0]
        for x in nums:
            self.prefix.append(self.prefix[-1] + x)

    def sumRange(self, left, right):
        return self.prefix[right + 1] - self.prefix[left]`);
add("find-the-highest-altitude", "Keep a running altitude starting at 0 and track its maximum.", "O(n) time, O(1) space",
`class Solution:
    def largestAltitude(self, gain):
        alt = best = 0
        for g in gain:
            alt += g
            best = max(best, alt)
        return best`);
add("find-pivot-index", "With the total known, the right sum is total - left - nums[i]; return the first i where it equals the left sum.", "O(n) time, O(1) space",
`class Solution:
    def pivotIndex(self, nums):
        total, left = sum(nums), 0
        for i, x in enumerate(nums):
            if left == total - left - x:
                return i
            left += x
        return -1`);
add("left-and-right-sum-differences", "Walk once with a running left sum; the right sum is total - left - nums[i].", "O(n) time, O(1) extra space",
`class Solution:
    def leftRightDifference(self, nums):
        total, left, res = sum(nums), 0, []
        for x in nums:
            res.append(abs(left - (total - left - x)))
            left += x
        return res`);
add("rank-transform-of-an-array", "Sort the distinct values and give each its position + 1, then map the original array through that.", "O(n log n) time, O(n) space",
`class Solution:
    def arrayRankTransform(self, arr):
        rank = {v: i + 1 for i, v in enumerate(sorted(set(arr)))}
        return [rank[v] for v in arr]`);
add("number-of-strings-that-appear-as-substrings-in-word", "Count the patterns that occur in word as substrings.", "O(p * n * m) time with the built-in search, O(1) space",
`class Solution:
    def numOfStrings(self, patterns, word):
        return sum(1 for p in patterns if p in word)`);
add("insert-delete-getrandom-o1", "Array of values plus a hash map of value -> index. Remove by moving the last value into the removed slot and popping the end; getRandom picks a random index.", "O(1) average per operation, O(n) space",
`import random

class RandomizedSet:
    def __init__(self):
        self.vals, self.pos = [], {}

    def insert(self, val):
        if val in self.pos:
            return False
        self.pos[val] = len(self.vals)
        self.vals.append(val)
        return True

    def remove(self, val):
        if val not in self.pos:
            return False
        i, last = self.pos[val], self.vals[-1]
        self.vals[i], self.pos[last] = last, i
        self.vals.pop()
        del self.pos[val]
        return True

    def getRandom(self):
        return random.choice(self.vals)`);
add("count-subarrays-with-majority-element-i", "For each start, extend the end while tracking (target count - other count); the target is the majority whenever that balance is positive.", "O(n^2) time, O(1) space (n is at most 1,000)",
`class Solution:
    def countMajoritySubarrays(self, nums, target):
        n, res = len(nums), 0
        for i in range(n):
            bal = 0
            for j in range(i, n):
                bal += 1 if nums[j] == target else -1
                if bal > 0:
                    res += 1
        return res`);
add("minimum-moves-to-make-array-complementary", "For each pair (a, b) with a <= b, a target sum costs 0 moves at a + b, 1 move in [a + 1, b + limit], and 2 elsewhere. Add these costs over all pairs with a difference array, then take the minimum.", "O(n + limit) time, O(limit) space",
`class Solution:
    def minMoves(self, nums, limit):
        n = len(nums)
        diff = [0] * (2 * limit + 2)
        for i in range(n // 2):
            a, b = sorted((nums[i], nums[n - 1 - i]))
            diff[2] += 2
            diff[a + 1] -= 1
            diff[a + b] -= 1
            diff[a + b + 1] += 1
            diff[b + limit + 1] += 1
        best, cur = float("inf"), 0
        for t in range(2, 2 * limit + 1):
            cur += diff[t]
            best = min(best, cur)
        return best`);
add("is-subsequence", "Walk t once, advancing a pointer in s whenever the characters match; s is a subsequence if the pointer reaches its end.", "O(len(t)) time, O(1) space",
`class Solution:
    def isSubsequence(self, s, t):
        i = 0
        for c in t:
            if i < len(s) and s[i] == c:
                i += 1
        return i == len(s)`);
add("rearrange-array-elements-by-sign", "Two write positions: positives go to even indices, negatives to odd ones, in their original order.", "O(n) time, O(n) space for the result",
`class Solution:
    def rearrangeArray(self, nums):
        res = [0] * len(nums)
        pos, neg = 0, 1
        for x in nums:
            if x > 0:
                res[pos] = x
                pos += 2
            else:
                res[neg] = x
                neg += 2
        return res`);
add("subarray-product-less-than-k", "Sliding window of positive numbers: grow right, divide out from the left while the product is >= k; every window ending at right adds right - left + 1 subarrays.", "O(n) time, O(1) space",
`class Solution:
    def numSubarrayProductLessThanK(self, nums, k):
        if k <= 1:
            return 0
        prod, left, res = 1, 0, 0
        for right, x in enumerate(nums):
            prod *= x
            while prod >= k:
                prod //= nums[left]
                left += 1
            res += right - left + 1
        return res`);
add("maximum-length-substring-with-two-occurrences", "Sliding window that allows each character at most twice: when a third copy enters, shrink from the left.", "O(n) time, O(1) space (26 letters)",
`class Solution:
    def maximumLengthSubstring(self, s):
        count, left, best = {}, 0, 0
        for right, c in enumerate(s):
            count[c] = count.get(c, 0) + 1
            while count[c] > 2:
                count[s[left]] -= 1
                left += 1
            best = max(best, right - left + 1)
        return best`);
add("remove-all-adjacent-duplicates-in-string", "Stack of characters: if the next one equals the top, pop it (the pair cancels); otherwise push.", "O(n) time, O(n) space",
`class Solution:
    def removeDuplicates(self, s):
        stack = []
        for c in s:
            if stack and stack[-1] == c:
                stack.pop()
            else:
                stack.append(c)
        return "".join(stack)`);
add("simplify-path", "Split on '/'; skip empty parts and '.', pop on '..', push anything else. Join the stack with '/'.", "O(n) time, O(n) space",
`class Solution:
    def simplifyPath(self, path):
        stack = []
        for part in path.split("/"):
            if part == "..":
                if stack:
                    stack.pop()
            elif part and part != ".":
                stack.append(part)
        return "/" + "/".join(stack)`);
add("online-stock-span", "Monotonic stack of (price, span). A new price absorbs the spans of every smaller-or-equal price on top of the stack.", "O(1) amortised per call, O(n) space",
`class StockSpanner:
    def __init__(self):
        self.stack = []

    def next(self, price):
        span = 1
        while self.stack and self.stack[-1][0] <= price:
            span += self.stack.pop()[1]
        self.stack.append((price, span))
        return span`);
add("basic-calculator-ii", "Scan with the last operator seen: + and - push the number (or its negative), * and / combine with the top of the stack. The answer is the stack's sum.", "O(n) time, O(n) space",
`class Solution:
    def calculate(self, s):
        stack, num, op = [], 0, "+"
        for i, c in enumerate(s):
            if c.isdigit():
                num = num * 10 + int(c)
            if c in "+-*/" or i == len(s) - 1:
                if op == "+":
                    stack.append(num)
                elif op == "-":
                    stack.append(-num)
                elif op == "*":
                    stack.append(stack.pop() * num)
                else:
                    stack.append(int(stack.pop() / num))
                op, num = c, 0
        return sum(stack)`);
add("remove-k-digits", "Monotonic increasing stack: while the top digit is bigger than the next digit and removals remain, pop it. Remove any leftover from the end and strip leading zeros.", "O(n) time, O(n) space",
`class Solution:
    def removeKdigits(self, num, k):
        stack = []
        for d in num:
            while k and stack and stack[-1] > d:
                stack.pop()
                k -= 1
            stack.append(d)
        if k:
            stack = stack[:-k]
        return "".join(stack).lstrip("0") or "0"`);
add("sum-of-subarray-minimums", "For each value, count the subarrays where it's the minimum: (distance to the previous smaller) x (distance to the next smaller-or-equal), found with monotonic stacks.", "O(n) time, O(n) space",
`class Solution:
    def sumSubarrayMins(self, arr):
        n, MOD = len(arr), 10**9 + 7
        left, right, stack = [0] * n, [0] * n, []
        for i in range(n):
            while stack and arr[stack[-1]] > arr[i]:
                stack.pop()
            left[i] = i - stack[-1] if stack else i + 1
            stack.append(i)
        stack = []
        for i in range(n - 1, -1, -1):
            while stack and arr[stack[-1]] >= arr[i]:
                stack.pop()
            right[i] = stack[-1] - i if stack else n - i
            stack.append(i)
        return sum(arr[i] * left[i] * right[i] for i in range(n)) % MOD`);
add("swap-nodes-in-pairs", "From a dummy node, repeatedly relink the next two nodes in swapped order and move two steps on.", "O(n) time, O(1) space",
`class Solution:
    def swapPairs(self, head):
        dummy = prev = ListNode(0, head)
        while prev.next and prev.next.next:
            a, b = prev.next, prev.next.next
            prev.next, a.next, b.next = b, b.next, a
            prev = a
        return dummy.next`);
add("range-sum-of-bst", "DFS, skipping subtrees the BST ordering rules out: no left side when the node is below low, no right side when it's above high.", "O(n) time worst case, O(h) space",
`class Solution:
    def rangeSumBST(self, root, low, high):
        if not root:
            return 0
        if root.val < low:
            return self.rangeSumBST(root.right, low, high)
        if root.val > high:
            return self.rangeSumBST(root.left, low, high)
        return root.val + self.rangeSumBST(root.left, low, high) + self.rangeSumBST(root.right, low, high)`);
add("sort-characters-by-frequency", "Count characters, then build the string with the most frequent characters first, each repeated by its count.", "O(n + k log k) time for k distinct characters, O(n) space",
`from collections import Counter

class Solution:
    def frequencySort(self, s):
        return "".join(c * n for c, n in Counter(s).most_common())`);
add("shortest-path-in-binary-matrix", "BFS from the top-left over the 8 neighbours of each open cell; the first time the bottom-right is reached gives the path length.", "O(n^2) time and space",
`from collections import deque

class Solution:
    def shortestPathBinaryMatrix(self, grid):
        n = len(grid)
        if grid[0][0] or grid[n - 1][n - 1]:
            return -1
        q, seen = deque([(0, 0, 1)]), {(0, 0)}
        while q:
            r, c, d = q.popleft()
            if (r, c) == (n - 1, n - 1):
                return d
            for dr in (-1, 0, 1):
                for dc in (-1, 0, 1):
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < n and 0 <= nc < n and not grid[nr][nc] and (nr, nc) not in seen:
                        seen.add((nr, nc))
                        q.append((nr, nc, d + 1))
        return -1`);
add("swim-in-rising-water", "Dijkstra-style: always expand the reachable cell with the lowest elevation (min-heap), tracking the highest elevation used so far; stop at the bottom-right.", "O(n^2 log n) time, O(n^2) space",
`import heapq

class Solution:
    def swimInWater(self, grid):
        n = len(grid)
        heap, seen = [(grid[0][0], 0, 0)], {(0, 0)}
        while heap:
            t, r, c = heapq.heappop(heap)
            if (r, c) == (n - 1, n - 1):
                return t
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in seen:
                    seen.add((nr, nc))
                    heapq.heappush(heap, (max(t, grid[nr][nc]), nr, nc))`);
add("maximum-sum-circular-subarray", "Either the best subarray doesn't wrap (Kadane's max), or it wraps, which means total minus the minimum subarray. If every number is negative, return the plain max.", "O(n) time, O(1) space",
`class Solution:
    def maxSubarraySumCircular(self, nums):
        total = 0
        cur_max = cur_min = 0
        best_max, best_min = nums[0], nums[0]
        for x in nums:
            cur_max = max(x, cur_max + x)
            best_max = max(best_max, cur_max)
            cur_min = min(x, cur_min + x)
            best_min = min(best_min, cur_min)
            total += x
        return best_max if best_max < 0 else max(best_max, total - best_min)`);
add("maximize-active-section-with-trade-i", "A trade turns a block of 1s between two 0-blocks into 0s and then the merged 0-block into 1s, gaining the two 0-blocks' lengths. Answer = ones + the largest sum of two neighbouring 0-blocks.", "O(n) time, O(n) space for the block lengths",
`class Solution:
    def maxActiveSectionsAfterTrade(self, s):
        ones = s.count("1")
        zeros, i = [], 0
        while i < len(s):
            if s[i] == "0":
                j = i
                while j < len(s) and s[j] == "0":
                    j += 1
                zeros.append(j - i)
                i = j
            else:
                i += 1
        best = max((zeros[k] + zeros[k + 1] for k in range(len(zeros) - 1)), default=0)
        return ones + best`);
add("find-the-lexicographically-smallest-valid-sequence", "suf[i] = how much of word2's tail word1[i:] can match. Go left to right taking matching indices; spend the one allowed change at the first index where the rest of word2 can still be matched afterwards.", "O(n) time, O(n) space",
`class Solution:
    def validSequence(self, word1, word2):
        n, m = len(word1), len(word2)
        suf = [m] * (n + 1)
        j = m
        for i in range(n - 1, -1, -1):
            if j > 0 and word1[i] == word2[j - 1]:
                j -= 1
            suf[i] = j
        res, j, used = [], 0, False
        for i in range(n):
            if j == m:
                break
            if word1[i] == word2[j]:
                res.append(i)
                j += 1
            elif not used and suf[i + 1] <= j + 1:
                res.append(i)
                j += 1
                used = True
        return res if j == m else []`);
add("count-primes", "Sieve of Eratosthenes: cross out multiples of each prime from its square upward, then count what's left.", "O(n log log n) time, O(n) space",
`class Solution:
    def countPrimes(self, n):
        if n < 3:
            return 0
        sieve = bytearray([1]) * n
        sieve[0] = sieve[1] = 0
        for p in range(2, int(n ** 0.5) + 1):
            if sieve[p]:
                sieve[p * p::p] = bytearray(len(range(p * p, n, p)))
        return sum(sieve)`);
add("add-strings", "Add digit by digit from the right with a carry, then reverse.", "O(max(m, n)) time and space",
`class Solution:
    def addStrings(self, num1, num2):
        i, j, carry, out = len(num1) - 1, len(num2) - 1, 0, []
        while i >= 0 or j >= 0 or carry:
            total = carry
            if i >= 0:
                total += ord(num1[i]) - 48
                i -= 1
            if j >= 0:
                total += ord(num2[j]) - 48
                j -= 1
            out.append(str(total % 10))
            carry = total // 10
        return "".join(reversed(out))`);
add("count-and-say", "Build each term from the last by reading off runs: the run's length, then its digit.", "O(total length) time and space",
`class Solution:
    def countAndSay(self, n):
        s = "1"
        for _ in range(n - 1):
            out, i = [], 0
            while i < len(s):
                j = i
                while j < len(s) and s[j] == s[i]:
                    j += 1
                out.append(str(j - i) + s[i])
                i = j
            s = "".join(out)
        return s`);
add("sequential-digits", "Every candidate is a slice of '123456789'. Generate slices by length and start, keeping those in range (already in order).", "O(1) time and space (at most 36 candidates)",
`class Solution:
    def sequentialDigits(self, low, high):
        digits, res = "123456789", []
        for length in range(2, 10):
            for start in range(10 - length):
                x = int(digits[start:start + length])
                if low <= x <= high:
                    res.append(x)
        return res`);
add("maximum-product-of-three-numbers", "The answer is either the three largest numbers, or the largest times the two most negative ones.", "O(n log n) time with sorting (O(n) with a single pass), O(1) extra space",
`class Solution:
    def maximumProduct(self, nums):
        nums.sort()
        return max(nums[-1] * nums[-2] * nums[-3], nums[0] * nums[1] * nums[-1])`);
add("best-time-to-buy-and-sell-stock-iii", "Track four running values: best after first buy, first sell, second buy and second sell, updating each from the previous one every day.", "O(n) time, O(1) space",
`class Solution:
    def maxProfit(self, prices):
        buy1 = buy2 = float("-inf")
        sell1 = sell2 = 0
        for p in prices:
            buy1 = max(buy1, -p)
            sell1 = max(sell1, buy1 + p)
            buy2 = max(buy2, sell1 - p)
            sell2 = max(sell2, buy2 + p)
        return sell2`);

// ---- OpenAI (LeetCode company tags) ----
add("encode-and-decode-strings", "Length-prefix each string ('5#hello'), so any characters, including '#', survive; decode by reading the number, the '#', then exactly that many characters.", "O(total length) time and space",
`class Codec:
    def encode(self, strs):
        return "".join("%d#%s" % (len(s), s) for s in strs)

    def decode(self, s):
        res, i = [], 0
        while i < len(s):
            j = s.index("#", i)
            n = int(s[i:j])
            res.append(s[j + 1:j + 1 + n])
            i = j + 1 + n
        return res`);
add("design-hit-counter", "Keep hit timestamps in a queue (they arrive in order); getHits drops everything older than 300 seconds from the front and returns the size.", "O(1) amortised per call, O(hits in the window) space",
`from collections import deque

class HitCounter:
    def __init__(self):
        self.q = deque()

    def hit(self, timestamp):
        self.q.append(timestamp)

    def getHits(self, timestamp):
        while self.q and self.q[0] <= timestamp - 300:
            self.q.popleft()
        return len(self.q)`);
add("design-authentication-manager", "A hash map of token -> expiry time. Renew only tokens that haven't expired yet (expiry > now); count tokens whose expiry is after now.", "O(1) generate and renew, O(n) count",
`class AuthenticationManager:
    def __init__(self, timeToLive):
        self.ttl = timeToLive
        self.expiry = {}

    def generate(self, tokenId, currentTime):
        self.expiry[tokenId] = currentTime + self.ttl

    def renew(self, tokenId, currentTime):
        if self.expiry.get(tokenId, 0) > currentTime:
            self.expiry[tokenId] = currentTime + self.ttl

    def countUnexpiredTokens(self, currentTime):
        return sum(1 for t in self.expiry.values() if t > currentTime)`);
add("design-spreadsheet", "Store only cells that were set, in a hash map; a formula '=X+Y' adds two operands, each either a number or a cell (missing cells are 0).", "O(1) per call, O(cells set) space",
`class Spreadsheet:
    def __init__(self, rows):
        self.cells = {}

    def setCell(self, cell, value):
        self.cells[cell] = value

    def resetCell(self, cell):
        self.cells.pop(cell, None)

    def getValue(self, formula):
        a, b = formula[1:].split("+")
        val = lambda x: int(x) if x.isdigit() else self.cells.get(x, 0)
        return val(a) + val(b)`);
add("design-memory-allocator", "Simulate memory as an array of owner IDs (0 = free). Allocate scans for the first run of size free cells; free clears every cell with that ID.", "O(n) per call, O(n) space",
`class Allocator:
    def __init__(self, n):
        self.mem = [0] * n

    def allocate(self, size, mID):
        run = 0
        for i, v in enumerate(self.mem):
            run = run + 1 if v == 0 else 0
            if run == size:
                start = i - size + 1
                self.mem[start:i + 1] = [mID] * size
                return start
        return -1

    def freeMemory(self, mID):
        count = 0
        for i, v in enumerate(self.mem):
            if v == mID:
                self.mem[i] = 0
                count += 1
        return count`);
add("snapshot-array", "Don't copy the array on snap. Each index keeps a history of (snap_id, value); get binary searches that history for the last change at or before snap_id.", "O(1) set and snap, O(log s) get, O(changes) space",
`import bisect

class SnapshotArray:
    def __init__(self, length):
        self.hist = [[(-1, 0)] for _ in range(length)]
        self.snap_id = 0

    def set(self, index, val):
        h = self.hist[index]
        if h[-1][0] == self.snap_id:
            h[-1] = (self.snap_id, val)
        else:
            h.append((self.snap_id, val))

    def snap(self):
        self.snap_id += 1
        return self.snap_id - 1

    def get(self, index, snap_id):
        h = self.hist[index]
        i = bisect.bisect_right(h, (snap_id, float("inf"))) - 1
        return h[i][1]`);
add("flatten-nested-list-iterator", "Keep a stack of NestedIntegers (reversed). hasNext unpacks lists on top of the stack until an integer is on top or the stack is empty; next pops it.", "O(1) amortised per call, O(depth + width) space",
`class NestedIterator:
    def __init__(self, nestedList):
        self.stack = list(reversed(nestedList))

    def next(self):
        return self.stack.pop().getInteger()

    def hasNext(self):
        while self.stack and not self.stack[-1].isInteger():
            self.stack.extend(reversed(self.stack.pop().getList()))
        return bool(self.stack)`);

// ---- Practical problems written for this app (reported for Anthropic and OpenAI) ----
add("in-memory-database", "A hash map of key -> {field: (value, expires_at)}. A field is live at time t if it has no expiry or t < expires_at. Scans filter live fields, sort by name and format them.", "O(1) set/get/delete, O(f log f) scan for f fields",
`class InMemoryDB:
    def __init__(self):
        self.data = {}  # key -> {field: (value, expires_at or None)}

    def _alive(self, rec, t):
        return rec is not None and (rec[1] is None or t < rec[1])

    def set(self, timestamp, key, field, value):
        self.data.setdefault(key, {})[field] = (value, None)

    def set_with_ttl(self, timestamp, key, field, value, ttl):
        self.data.setdefault(key, {})[field] = (value, timestamp + ttl)

    def get(self, timestamp, key, field):
        rec = self.data.get(key, {}).get(field)
        return rec[0] if self._alive(rec, timestamp) else None

    def delete(self, timestamp, key, field):
        rec = self.data.get(key, {}).get(field)
        if not self._alive(rec, timestamp):
            return False
        del self.data[key][field]
        return True

    def scan(self, timestamp, key):
        return self.scan_by_prefix(timestamp, key, "")

    def scan_by_prefix(self, timestamp, key, prefix):
        fields = self.data.get(key, {})
        return ["%s(%s)" % (f, fields[f][0]) for f in sorted(fields)
                if f.startswith(prefix) and self._alive(fields[f], timestamp)]`);
add("crawler-fake-web", "BFS from the start page with a visited set, following only links whose hostname (the part after 'http://' up to the next '/') matches the start page's.", "O(pages + links) time, O(pages) space",
`from collections import deque

class Solution:
    def crawl(self, startUrl, web):
        host = startUrl.split("/")[2]
        seen, q = {startUrl}, deque([startUrl])
        while q:
            url = q.popleft()
            for nxt in web.get(url, []):
                if nxt not in seen and nxt.split("/")[2] == host:
                    seen.add(nxt)
                    q.append(nxt)
        return list(seen)`);
add("stack-samples-to-trace", "Compare each stack with the previous one by their common prefix: frames past it in the old stack end (innermost first), frames past it in the new stack begin (outermost first). Close whatever is still open at the last timestamp.", "O(total frames) time, O(depth) extra space",
`class Solution:
    def samplesToEvents(self, samples):
        events, prev = [], []
        for ts, stack in samples:
            c = 0
            while c < len(prev) and c < len(stack) and prev[c] == stack[c]:
                c += 1
            for name in reversed(prev[c:]):
                events.append(["E", ts, name])
            for name in stack[c:]:
                events.append(["B", ts, name])
            prev = stack
        if samples:
            last = samples[-1][0]
            for name in reversed(prev):
                events.append(["E", last, name])
        return events`);
add("greedy-tokenizer", "Put the vocabulary in a trie. From each position walk the trie as far as the text allows, remembering the last token that ended; emit it (or -1 for an unknown character) and jump past it.", "O(n * L) time for longest token length L, O(total vocabulary length) space",
`class Solution:
    def tokenize(self, text, vocab):
        root = {}
        for i, tok in enumerate(vocab):
            node = root
            for ch in tok:
                node = node.setdefault(ch, {})
            node[None] = i  # token id ends here
        res, i = [], 0
        while i < len(text):
            node, best, end, j = root, -1, i + 1, i
            while j < len(text) and text[j] in node:
                node = node[text[j]]
                j += 1
                if None in node:
                    best, end = node[None], j
            res.append(best)
            i = end
        return res`);
