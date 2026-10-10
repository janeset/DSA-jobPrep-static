// ---- Graphs ----
add("find-if-path-exists-in-graph", "Build an adjacency list and BFS/DFS from the source; check whether the destination is reached.", "O(V + E) time, O(V + E) space",
`from collections import defaultdict, deque

class Solution:
    def validPath(self, n, edges, source, destination):
        g = defaultdict(list)
        for a, b in edges:
            g[a].append(b); g[b].append(a)
        seen, q = {source}, deque([source])
        while q:
            u = q.popleft()
            if u == destination:
                return True
            for v in g[u]:
                if v not in seen:
                    seen.add(v); q.append(v)
        return False`);
add("number-of-islands", "Scan the grid; each unvisited '1' starts a new island. Flood-fill it (sinking cells to '0') so it isn't counted again.", "O(m*n) time, O(m*n) worst-case space",
`class Solution:
    def numIslands(self, grid):
        R, C, count = len(grid), len(grid[0]), 0
        def sink(r, c):
            if not (0 <= r < R and 0 <= c < C) or grid[r][c] != "1":
                return
            grid[r][c] = "0"
            sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1)
        for r in range(R):
            for c in range(C):
                if grid[r][c] == "1":
                    sink(r, c)
                    count += 1
        return count`);
add("max-area-of-island", "Flood-fill each island with DFS returning its size; keep the maximum.", "O(m*n) time, O(m*n) space",
`class Solution:
    def maxAreaOfIsland(self, grid):
        R, C = len(grid), len(grid[0])
        def area(r, c):
            if not (0 <= r < R and 0 <= c < C) or grid[r][c] != 1:
                return 0
            grid[r][c] = 0
            return 1 + area(r + 1, c) + area(r - 1, c) + area(r, c + 1) + area(r, c - 1)
        return max(area(r, c) for r in range(R) for c in range(C))`);
add("course-schedule", "Cycle detection in a directed graph via Kahn's algorithm: if you can process all courses by indegree, there is no cycle.", "O(V + E) time, O(V + E) space",
`from collections import defaultdict, deque

class Solution:
    def canFinish(self, numCourses, prerequisites):
        g, indeg = defaultdict(list), [0] * numCourses
        for a, b in prerequisites:
            g[b].append(a); indeg[a] += 1
        q = deque(i for i in range(numCourses) if indeg[i] == 0)
        done = 0
        while q:
            u = q.popleft(); done += 1
            for v in g[u]:
                indeg[v] -= 1
                if indeg[v] == 0:
                    q.append(v)
        return done == numCourses`);
add("clone-graph", "DFS with a dict old -> new so each node is copied once and cycles are handled.", "O(V + E) time, O(V) space",
`class Solution:
    def cloneGraph(self, node):
        if not node:
            return None
        copies = {}
        def dfs(n):
            if n in copies:
                return copies[n]
            c = copies[n] = Node(n.val)
            c.neighbors = [dfs(nb) for nb in n.neighbors]
            return c
        return dfs(node)`);
add("rotting-oranges", "Multi-source BFS from all rotten oranges at once; each BFS layer is one minute.", "O(m*n) time, O(m*n) space",
`from collections import deque

class Solution:
    def orangesRotting(self, grid):
        R, C = len(grid), len(grid[0])
        q, fresh = deque(), 0
        for r in range(R):
            for c in range(C):
                if grid[r][c] == 2: q.append((r, c))
                elif grid[r][c] == 1: fresh += 1
        minutes = 0
        while q and fresh:
            for _ in range(len(q)):
                r, c = q.popleft()
                for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == 1:
                        grid[nr][nc] = 2; fresh -= 1; q.append((nr, nc))
            minutes += 1
        return minutes if fresh == 0 else -1`);
add("course-schedule-ii", "Same as Course Schedule but record the order in which Kahn's algorithm processes nodes; empty if a cycle exists.", "O(V + E) time, O(V + E) space",
`from collections import defaultdict, deque

class Solution:
    def findOrder(self, numCourses, prerequisites):
        g, indeg = defaultdict(list), [0] * numCourses
        for a, b in prerequisites:
            g[b].append(a); indeg[a] += 1
        q = deque(i for i in range(numCourses) if indeg[i] == 0)
        order = []
        while q:
            u = q.popleft(); order.append(u)
            for v in g[u]:
                indeg[v] -= 1
                if indeg[v] == 0:
                    q.append(v)
        return order if len(order) == numCourses else []`);
add("pacific-atlantic-water-flow", "Reverse the flow: DFS uphill from each ocean's border cells. The answer is cells reachable from both oceans.", "O(m*n) time, O(m*n) space",
`class Solution:
    def pacificAtlantic(self, heights):
        R, C = len(heights), len(heights[0])
        def reach(starts):
            seen = set(starts)
            st = list(starts)
            while st:
                r, c = st.pop()
                for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nr, nc = r + dr, c + dc
                    if (0 <= nr < R and 0 <= nc < C and (nr, nc) not in seen
                            and heights[nr][nc] >= heights[r][c]):
                        seen.add((nr, nc)); st.append((nr, nc))
            return seen
        pac = [(0, c) for c in range(C)] + [(r, 0) for r in range(R)]
        atl = [(R - 1, c) for c in range(C)] + [(r, C - 1) for r in range(R)]
        return [list(p) for p in reach(pac) & reach(atl)]`);
add("surrounded-regions", "Any 'O' connected to the border can't be captured. Mark those safe with DFS from the border, then flip the rest.", "O(m*n) time, O(m*n) space",
`class Solution:
    def solve(self, board):
        R, C = len(board), len(board[0])
        def mark(r, c):
            if not (0 <= r < R and 0 <= c < C) or board[r][c] != "O":
                return
            board[r][c] = "S"
            mark(r + 1, c); mark(r - 1, c); mark(r, c + 1); mark(r, c - 1)
        for r in range(R):
            mark(r, 0); mark(r, C - 1)
        for c in range(C):
            mark(0, c); mark(R - 1, c)
        for r in range(R):
            for c in range(C):
                board[r][c] = "O" if board[r][c] == "S" else "X"`);
add("redundant-connection", "Union-Find: the first edge whose endpoints are already connected closes the cycle.", "O(n * alpha(n)) time, O(n) space",
`class Solution:
    def findRedundantConnection(self, edges):
        parent = list(range(len(edges) + 1))
        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x
        for a, b in edges:
            ra, rb = find(a), find(b)
            if ra == rb:
                return [a, b]
            parent[ra] = rb`);
add("network-delay-time", "Dijkstra from k with a min-heap; the answer is the largest shortest distance (or -1 if a node is unreachable).", "O(E log V) time, O(V + E) space",
`import heapq
from collections import defaultdict

class Solution:
    def networkDelayTime(self, times, n, k):
        g = defaultdict(list)
        for u, v, w in times:
            g[u].append((v, w))
        dist, heap = {}, [(0, k)]
        while heap:
            d, u = heapq.heappop(heap)
            if u in dist:
                continue
            dist[u] = d
            for v, w in g[u]:
                if v not in dist:
                    heapq.heappush(heap, (d + w, v))
        return max(dist.values()) if len(dist) == n else -1`);
add("cheapest-flights-within-k-stops", "Bellman-Ford limited to k + 1 edges: relax all flights k + 1 times, using the previous round's prices.", "O(k * E) time, O(n) space",
`class Solution:
    def findCheapestPrice(self, n, flights, src, dst, k):
        INF = float("inf")
        prices = [INF] * n
        prices[src] = 0
        for _ in range(k + 1):
            nxt = prices[:]
            for u, v, w in flights:
                if prices[u] + w < nxt[v]:
                    nxt[v] = prices[u] + w
            prices = nxt
        return -1 if prices[dst] == INF else prices[dst]`);
add("word-ladder", "BFS over words; neighbours are found by replacing one letter at a time and checking the word list. BFS depth is the shortest ladder.", "O(N * L * 26) time, O(N * L) space",
`from collections import deque
import string

class Solution:
    def ladderLength(self, beginWord, endWord, wordList):
        words = set(wordList)
        if endWord not in words:
            return 0
        q, steps = deque([beginWord]), 1
        seen = {beginWord}
        while q:
            for _ in range(len(q)):
                w = q.popleft()
                if w == endWord:
                    return steps
                for i in range(len(w)):
                    for ch in string.ascii_lowercase:
                        nxt = w[:i] + ch + w[i + 1:]
                        if nxt in words and nxt not in seen:
                            seen.add(nxt); q.append(nxt)
            steps += 1
        return 0`);

// ---- Intervals & greedy ----
add("maximum-subarray", "Kadane's algorithm: at each element either extend the running sum or restart from the element.", "O(n) time, O(1) space",
`class Solution:
    def maxSubArray(self, nums):
        cur = best = nums[0]
        for x in nums[1:]:
            cur = max(x, cur + x)
            best = max(best, cur)
        return best`);
add("jump-game", "Track the farthest index reachable; if you ever stand beyond it, you're stuck.", "O(n) time, O(1) space",
`class Solution:
    def canJump(self, nums):
        far = 0
        for i, x in enumerate(nums):
            if i > far:
                return False
            far = max(far, i + x)
        return True`);
add("merge-intervals", "Sort by start; extend the last merged interval when the next one overlaps, else start a new one.", "O(n log n) time, O(n) space",
`class Solution:
    def merge(self, intervals):
        intervals.sort()
        out = [intervals[0]]
        for s, e in intervals[1:]:
            if s <= out[-1][1]:
                out[-1][1] = max(out[-1][1], e)
            else:
                out.append([s, e])
        return out`);
add("insert-interval", "Add everything that ends before the new interval, merge everything that overlaps it, then add the rest.", "O(n) time, O(n) space",
`class Solution:
    def insert(self, intervals, newInterval):
        res, i, n = [], 0, len(intervals)
        while i < n and intervals[i][1] < newInterval[0]:
            res.append(intervals[i]); i += 1
        while i < n and intervals[i][0] <= newInterval[1]:
            newInterval = [min(newInterval[0], intervals[i][0]), max(newInterval[1], intervals[i][1])]
            i += 1
        res.append(newInterval)
        return res + intervals[i:]`);
add("non-overlapping-intervals", "Greedy: sort by end time and always keep the interval that ends earliest; count the ones you must drop.", "O(n log n) time, O(1) space",
`class Solution:
    def eraseOverlapIntervals(self, intervals):
        intervals.sort(key=lambda x: x[1])
        end, removed = float("-inf"), 0
        for s, e in intervals:
            if s >= end:
                end = e
            else:
                removed += 1
        return removed`);
add("jump-game-ii", "BFS by jump count: each 'level' is the range reachable with one more jump; extend to the farthest reach.", "O(n) time, O(1) space",
`class Solution:
    def jump(self, nums):
        jumps = cur_end = far = 0
        for i in range(len(nums) - 1):
            far = max(far, i + nums[i])
            if i == cur_end:
                jumps += 1
                cur_end = far
        return jumps`);
add("gas-station", "If total gas >= total cost a solution exists. Whenever the running tank goes negative, restart from the next station.", "O(n) time, O(1) space",
`class Solution:
    def canCompleteCircuit(self, gas, cost):
        if sum(gas) < sum(cost):
            return -1
        tank = start = 0
        for i in range(len(gas)):
            tank += gas[i] - cost[i]
            if tank < 0:
                tank, start = 0, i + 1
        return start`);
add("partition-labels", "Record each letter's last index. Extend the current part to the furthest last index seen; cut when you reach it.", "O(n) time, O(26) space",
`class Solution:
    def partitionLabels(self, s):
        last = {ch: i for i, ch in enumerate(s)}
        res, start, end = [], 0, 0
        for i, ch in enumerate(s):
            end = max(end, last[ch])
            if i == end:
                res.append(end - start + 1)
                start = i + 1
        return res`);

// ---- Math, matrix, bits ----
add("single-number", "XOR of all numbers cancels the pairs and leaves the single one.", "O(n) time, O(1) space",
`class Solution:
    def singleNumber(self, nums):
        x = 0
        for n in nums:
            x ^= n
        return x`);
add("plus-one", "Walk from the last digit: a 9 becomes 0 and carries; otherwise add one and stop. If all were 9s, prepend 1.", "O(n) time, O(1) space",
`class Solution:
    def plusOne(self, digits):
        for i in range(len(digits) - 1, -1, -1):
            if digits[i] < 9:
                digits[i] += 1
                return digits
            digits[i] = 0
        return [1] + digits`);
add("number-of-1-bits", "n & (n - 1) clears the lowest set bit; count how many times you can do that.", "O(number of set bits)",
`class Solution:
    def hammingWeight(self, n):
        count = 0
        while n:
            n &= n - 1
            count += 1
        return count`);
add("counting-bits", "dp[i] = dp[i >> 1] + (i & 1): the bits of i are the bits of i/2 plus the last bit.", "O(n) time, O(n) space",
`class Solution:
    def countBits(self, n):
        dp = [0] * (n + 1)
        for i in range(1, n + 1):
            dp[i] = dp[i >> 1] + (i & 1)
        return dp`);
add("missing-number", "Expected sum 0..n minus the actual sum (or XOR indices with values).", "O(n) time, O(1) space",
`class Solution:
    def missingNumber(self, nums):
        n = len(nums)
        return n * (n + 1) // 2 - sum(nums)`);
add("happy-number", "Repeatedly sum squared digits. If you ever revisit a number you're in a cycle (not happy); reaching 1 means happy.", "O(log n) per step, O(log n) space",
`class Solution:
    def isHappy(self, n):
        seen = set()
        while n != 1 and n not in seen:
            seen.add(n)
            n = sum(int(d) ** 2 for d in str(n))
        return n == 1`);
add("rotate-image", "Rotate 90 degrees clockwise in place: reverse the rows, then transpose.", "O(n^2) time, O(1) space",
`class Solution:
    def rotate(self, matrix):
        matrix.reverse()
        n = len(matrix)
        for i in range(n):
            for j in range(i):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]`);
add("spiral-matrix", "Peel the matrix layer by layer: top row, right column, bottom row, left column, shrinking the bounds.", "O(m*n) time, O(1) extra space",
`class Solution:
    def spiralOrder(self, matrix):
        res = []
        top, bottom, left, right = 0, len(matrix) - 1, 0, len(matrix[0]) - 1
        while top <= bottom and left <= right:
            for c in range(left, right + 1): res.append(matrix[top][c])
            for r in range(top + 1, bottom + 1): res.append(matrix[r][right])
            if top < bottom:
                for c in range(right - 1, left - 1, -1): res.append(matrix[bottom][c])
            if left < right:
                for r in range(bottom - 1, top, -1): res.append(matrix[r][left])
            top += 1; bottom -= 1; left += 1; right -= 1
        return res`);
add("set-matrix-zeroes", "Record which rows and columns contain a zero, then zero them. (Using the first row/column as markers gets O(1) space.)", "O(m*n) time, O(m + n) space",
`class Solution:
    def setZeroes(self, matrix):
        R, C = len(matrix), len(matrix[0])
        rows = {r for r in range(R) for c in range(C) if matrix[r][c] == 0}
        cols = {c for r in range(R) for c in range(C) if matrix[r][c] == 0}
        for r in range(R):
            for c in range(C):
                if r in rows or c in cols:
                    matrix[r][c] = 0`);
add("powx-n", "Fast exponentiation: x^n = (x^(n/2))^2, times x if n is odd. Handle negative n by inverting.", "O(log n) time, O(log n) space",
`class Solution:
    def myPow(self, x, n):
        if n < 0:
            x, n = 1 / x, -n
        def p(b, e):
            if e == 0:
                return 1.0
            half = p(b, e // 2)
            return half * half * (b if e % 2 else 1)
        return p(x, n)`);
add("reverse-integer", "Pop digits off with divmod and build the reverse; return 0 if the result leaves the 32-bit signed range.", "O(log n) time, O(1) space",
`class Solution:
    def reverse(self, x):
        sign = -1 if x < 0 else 1
        x, rev = abs(x), 0
        while x:
            x, d = divmod(x, 10)
            rev = rev * 10 + d
        rev *= sign
        return rev if -2**31 <= rev <= 2**31 - 1 else 0`);

// ---- 1-D DP ----
add("climbing-stairs", "ways(n) = ways(n - 1) + ways(n - 2): Fibonacci. Keep only the last two values.", "O(n) time, O(1) space",
`class Solution:
    def climbStairs(self, n):
        a, b = 1, 1
        for _ in range(n - 1):
            a, b = b, a + b
        return b`);
add("min-cost-climbing-stairs", "dp over steps: cost to stand on step i is cost[i] + min of the previous two. Finish from either of the last two.", "O(n) time, O(1) space",
`class Solution:
    def minCostClimbingStairs(self, cost):
        a, b = cost[0], cost[1]
        for i in range(2, len(cost)):
            a, b = b, cost[i] + min(a, b)
        return min(a, b)`);
add("house-robber", "At each house choose max(skip it, rob it + best from two houses back).", "O(n) time, O(1) space",
`class Solution:
    def rob(self, nums):
        prev = cur = 0
        for x in nums:
            prev, cur = cur, max(cur, prev + x)
        return cur`);
add("coin-change", "dp[a] = fewest coins to make amount a = 1 + min(dp[a - c]) over coins c.", "O(amount * coins) time, O(amount) space",
`class Solution:
    def coinChange(self, coins, amount):
        INF = float("inf")
        dp = [0] + [INF] * amount
        for a in range(1, amount + 1):
            for c in coins:
                if c <= a:
                    dp[a] = min(dp[a], dp[a - c] + 1)
        return dp[amount] if dp[amount] != INF else -1`);
add("house-robber-ii", "Houses are in a circle: run House Robber twice, once without the first house and once without the last.", "O(n) time, O(1) space",
`class Solution:
    def rob(self, nums):
        def line(a):
            prev = cur = 0
            for x in a:
                prev, cur = cur, max(cur, prev + x)
            return cur
        if len(nums) == 1:
            return nums[0]
        return max(line(nums[1:]), line(nums[:-1]))`);
add("longest-palindromic-substring", "Expand around each possible center (odd and even length) and keep the longest.", "O(n^2) time, O(1) space",
`class Solution:
    def longestPalindrome(self, s):
        best = ""
        def expand(l, r):
            while l >= 0 and r < len(s) and s[l] == s[r]:
                l -= 1; r += 1
            return s[l + 1:r]
        for i in range(len(s)):
            for cand in (expand(i, i), expand(i, i + 1)):
                if len(cand) > len(best):
                    best = cand
        return best`);
add("decode-ways", "dp[i] = ways to decode the first i chars: add dp[i-1] if the last digit is 1-9, add dp[i-2] if the last two digits form 10-26.", "O(n) time, O(1) space",
`class Solution:
    def numDecodings(self, s):
        prev, cur = 1, 1 if s[0] != "0" else 0
        for i in range(1, len(s)):
            nxt = 0
            if s[i] != "0":
                nxt += cur
            if 10 <= int(s[i - 1:i + 1]) <= 26:
                nxt += prev
            prev, cur = cur, nxt
        return cur`);
add("word-break", "dp[i] is True if some j < i has dp[j] True and s[j:i] is a word.", "O(n^2) time, O(n) space",
`class Solution:
    def wordBreak(self, s, wordDict):
        words = set(wordDict)
        dp = [True] + [False] * len(s)
        for i in range(1, len(s) + 1):
            for j in range(i):
                if dp[j] and s[j:i] in words:
                    dp[i] = True
                    break
        return dp[-1]`);
add("longest-increasing-subsequence", "Patience sorting: keep 'tails' where tails[k] is the smallest tail of an increasing subsequence of length k + 1; binary search where each number goes.", "O(n log n) time, O(n) space",
`import bisect

class Solution:
    def lengthOfLIS(self, nums):
        tails = []
        for x in nums:
            i = bisect.bisect_left(tails, x)
            if i == len(tails):
                tails.append(x)
            else:
                tails[i] = x
        return len(tails)`);
add("palindromic-substrings", "Expand around every center (odd and even) and count each expansion that is still a palindrome.", "O(n^2) time, O(1) space",
`class Solution:
    def countSubstrings(self, s):
        count = 0
        def expand(l, r):
            n = 0
            while l >= 0 and r < len(s) and s[l] == s[r]:
                n += 1; l -= 1; r += 1
            return n
        for i in range(len(s)):
            count += expand(i, i) + expand(i, i + 1)
        return count`);
add("maximum-product-subarray", "Track both the max and min product ending here, since a negative can flip the min into the max.", "O(n) time, O(1) space",
`class Solution:
    def maxProduct(self, nums):
        best = hi = lo = nums[0]
        for x in nums[1:]:
            cands = (x, hi * x, lo * x)
            hi, lo = max(cands), min(cands)
            best = max(best, hi)
        return best`);
add("partition-equal-subset-sum", "Subset-sum to total/2: dp is the set of reachable sums, updated for each number.", "O(n * sum) time, O(sum) space",
`class Solution:
    def canPartition(self, nums):
        total = sum(nums)
        if total % 2:
            return False
        target = total // 2
        reachable = {0}
        for x in nums:
            reachable |= {s + x for s in reachable if s + x <= target}
            if target in reachable:
                return True
        return False`);

// ---- 2-D DP ----
add("unique-paths", "Each cell's path count = paths from above + paths from the left. Roll a single row.", "O(m*n) time, O(n) space",
`class Solution:
    def uniquePaths(self, m, n):
        row = [1] * n
        for _ in range(m - 1):
            for j in range(1, n):
                row[j] += row[j - 1]
        return row[-1]`);
add("longest-common-subsequence", "dp[i][j] over prefixes: if chars match take dp[i-1][j-1] + 1, else the better of dropping a char from either string.", "O(m*n) time, O(m*n) space",
`class Solution:
    def longestCommonSubsequence(self, text1, text2):
        dp = [[0] * (len(text2) + 1) for _ in range(len(text1) + 1)]
        for i in range(1, len(text1) + 1):
            for j in range(1, len(text2) + 1):
                if text1[i - 1] == text2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
        return dp[-1][-1]`);
add("coin-change-ii", "Unbounded knapsack counting combinations: loop coins in the outer loop so each combination is counted once regardless of order.", "O(amount * coins) time, O(amount) space",
`class Solution:
    def change(self, amount, coins):
        dp = [1] + [0] * amount
        for c in coins:
            for a in range(c, amount + 1):
                dp[a] += dp[a - c]
        return dp[amount]`);
add("target-sum", "Count ways to reach each running total using a dict of {sum: ways}, updated per number with + and -.", "O(n * sum) time, O(sum) space",
`from collections import defaultdict

class Solution:
    def findTargetSumWays(self, nums, target):
        dp = {0: 1}
        for x in nums:
            nxt = defaultdict(int)
            for s, ways in dp.items():
                nxt[s + x] += ways
                nxt[s - x] += ways
            dp = nxt
        return dp.get(target, 0)`);
add("best-time-to-buy-and-sell-stock-with-cooldown", "State machine per day: holding, sold (cooldown next), or resting. Update the three values each day.", "O(n) time, O(1) space",
`class Solution:
    def maxProfit(self, prices):
        hold, sold, rest = float("-inf"), 0, 0
        for p in prices:
            prev_sold = sold
            sold = hold + p
            hold = max(hold, rest - p)
            rest = max(rest, prev_sold)
        return max(sold, rest)`);
add("edit-distance", "dp[i][j] = edits to turn word1[:i] into word2[:j]: if chars match carry dp[i-1][j-1], else 1 + min(insert, delete, replace).", "O(m*n) time, O(m*n) space",
`class Solution:
    def minDistance(self, word1, word2):
        m, n = len(word1), len(word2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(m + 1): dp[i][0] = i
        for j in range(n + 1): dp[0][j] = j
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if word1[i - 1] == word2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1]
                else:
                    dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
        return dp[m][n]`);
