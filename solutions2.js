// ---- Linked list ----
add("reverse-linked-list", "Walk the list, pointing each node back at the previous one.", "O(n) time, O(1) space",
`class Solution:
    def reverseList(self, head):
        prev = None
        while head:
            head.next, prev, head = prev, head, head.next
        return prev`);
add("merge-two-sorted-lists", "Dummy head; repeatedly attach the smaller of the two current nodes.", "O(n + m) time, O(1) space",
`class Solution:
    def mergeTwoLists(self, list1, list2):
        dummy = tail = ListNode()
        while list1 and list2:
            if list1.val <= list2.val:
                tail.next, list1 = list1, list1.next
            else:
                tail.next, list2 = list2, list2.next
            tail = tail.next
        tail.next = list1 or list2
        return dummy.next`);
add("linked-list-cycle", "Floyd's tortoise and hare: if fast ever meets slow, there is a cycle.", "O(n) time, O(1) space",
`class Solution:
    def hasCycle(self, head):
        slow = fast = head
        while fast and fast.next:
            slow, fast = slow.next, fast.next.next
            if slow is fast:
                return True
        return False`);
add("middle-of-the-linked-list", "Fast moves two steps per slow step; when fast hits the end, slow is in the middle.", "O(n) time, O(1) space",
`class Solution:
    def middleNode(self, head):
        slow = fast = head
        while fast and fast.next:
            slow, fast = slow.next, fast.next.next
        return slow`);
add("reorder-list", "Find the middle, reverse the second half, then interleave the two halves.", "O(n) time, O(1) space",
`class Solution:
    def reorderList(self, head):
        slow, fast = head, head.next
        while fast and fast.next:
            slow, fast = slow.next, fast.next.next
        second, slow.next, prev = slow.next, None, None
        while second:
            second.next, prev, second = prev, second, second.next
        first, second = head, prev
        while second:
            f2, s2 = first.next, second.next
            first.next, second.next = second, f2
            first, second = f2, s2`);
add("remove-nth-node-from-end-of-list", "Advance a lead pointer n steps, then move both until lead hits the end; the trailing pointer sits before the target.", "O(n) time, O(1) space",
`class Solution:
    def removeNthFromEnd(self, head, n):
        dummy = ListNode(0, head)
        lead = trail = dummy
        for _ in range(n):
            lead = lead.next
        while lead.next:
            lead, trail = lead.next, trail.next
        trail.next = trail.next.next
        return dummy.next`);
add("add-two-numbers", "Add digit by digit, carrying over, building a new list.", "O(max(n, m)) time, O(max(n, m)) space",
`class Solution:
    def addTwoNumbers(self, l1, l2):
        dummy = tail = ListNode()
        carry = 0
        while l1 or l2 or carry:
            s = carry + (l1.val if l1 else 0) + (l2.val if l2 else 0)
            carry, digit = divmod(s, 10)
            tail.next = ListNode(digit)
            tail = tail.next
            l1 = l1.next if l1 else None
            l2 = l2.next if l2 else None
        return dummy.next`);
add("lru-cache", "OrderedDict keeps usage order: move a key to the end on access, evict from the front when full.", "O(1) per operation",
`from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.d = OrderedDict()

    def get(self, key):
        if key not in self.d:
            return -1
        self.d.move_to_end(key)
        return self.d[key]

    def put(self, key, value):
        self.d[key] = value
        self.d.move_to_end(key)
        if len(self.d) > self.cap:
            self.d.popitem(last=False)`);
add("copy-list-with-random-pointer", "First pass: map each original node to a new copy. Second pass: wire next and random through the map.", "O(n) time, O(n) space",
`class Solution:
    def copyRandomList(self, head):
        m = {None: None}
        cur = head
        while cur:
            m[cur] = Node(cur.val)
            cur = cur.next
        cur = head
        while cur:
            m[cur].next = m[cur.next]
            m[cur].random = m[cur.random]
            cur = cur.next
        return m[head]`);
add("merge-k-sorted-lists", "Min-heap holding the current head of each list; pop the smallest and push its successor.", "O(N log k) time, O(k) space",
`import heapq

class Solution:
    def mergeKLists(self, lists):
        heap = [(node.val, i, node) for i, node in enumerate(lists) if node]
        heapq.heapify(heap)
        dummy = tail = ListNode()
        while heap:
            _, i, node = heapq.heappop(heap)
            tail.next = node
            tail = node
            if node.next:
                heapq.heappush(heap, (node.next.val, i, node.next))
        return dummy.next`);

// ---- Trees ----
add("invert-binary-tree", "Swap the children of every node, recursively.", "O(n) time, O(h) space",
`class Solution:
    def invertTree(self, root):
        if root:
            root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)
        return root`);
add("maximum-depth-of-binary-tree", "Depth = 1 + max(depth of left, depth of right).", "O(n) time, O(h) space",
`class Solution:
    def maxDepth(self, root):
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))`);
add("same-tree", "Both empty -> equal; one empty or values differ -> not equal; otherwise compare both subtrees.", "O(n) time, O(h) space",
`class Solution:
    def isSameTree(self, p, q):
        if not p and not q:
            return True
        if not p or not q or p.val != q.val:
            return False
        return self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)`);
add("diameter-of-binary-tree", "At each node the longest path through it is left depth + right depth. Track the max while computing depths.", "O(n) time, O(h) space",
`class Solution:
    def diameterOfBinaryTree(self, root):
        best = 0
        def depth(node):
            nonlocal best
            if not node:
                return 0
            l, r = depth(node.left), depth(node.right)
            best = max(best, l + r)
            return 1 + max(l, r)
        depth(root)
        return best`);
add("balanced-binary-tree", "Compute heights bottom-up; return -1 as soon as any subtree is unbalanced.", "O(n) time, O(h) space",
`class Solution:
    def isBalanced(self, root):
        def height(node):
            if not node:
                return 0
            l, r = height(node.left), height(node.right)
            if l == -1 or r == -1 or abs(l - r) > 1:
                return -1
            return 1 + max(l, r)
        return height(root) != -1`);
add("subtree-of-another-tree", "For each node of root, check whether the tree starting there is identical to subRoot.", "O(n * m) time, O(h) space",
`class Solution:
    def isSubtree(self, root, subRoot):
        def same(a, b):
            if not a and not b:
                return True
            if not a or not b or a.val != b.val:
                return False
            return same(a.left, b.left) and same(a.right, b.right)
        if not root:
            return False
        return same(root, subRoot) or self.isSubtree(root.left, subRoot) or self.isSubtree(root.right, subRoot)`);
add("lowest-common-ancestor-of-a-binary-search-tree", "Walk down: if both targets are smaller go left, both larger go right; otherwise the current node is the split point.", "O(h) time, O(1) space",
`class Solution:
    def lowestCommonAncestor(self, root, p, q):
        while root:
            if p.val < root.val and q.val < root.val:
                root = root.left
            elif p.val > root.val and q.val > root.val:
                root = root.right
            else:
                return root`);
add("binary-tree-level-order-traversal", "BFS with a queue, processing exactly one level's worth of nodes per iteration.", "O(n) time, O(n) space",
`from collections import deque

class Solution:
    def levelOrder(self, root):
        res, q = [], deque([root] if root else [])
        while q:
            level = []
            for _ in range(len(q)):
                node = q.popleft()
                level.append(node.val)
                if node.left: q.append(node.left)
                if node.right: q.append(node.right)
            res.append(level)
        return res`);
add("validate-binary-search-tree", "Pass down the allowed (low, high) range; every node must lie strictly inside it.", "O(n) time, O(h) space",
`class Solution:
    def isValidBST(self, root):
        def ok(node, lo, hi):
            if not node:
                return True
            if not (lo < node.val < hi):
                return False
            return ok(node.left, lo, node.val) and ok(node.right, node.val, hi)
        return ok(root, float("-inf"), float("inf"))`);
add("binary-tree-right-side-view", "BFS by level and keep the last node of each level.", "O(n) time, O(n) space",
`from collections import deque

class Solution:
    def rightSideView(self, root):
        res, q = [], deque([root] if root else [])
        while q:
            res.append(q[-1].val)
            for _ in range(len(q)):
                node = q.popleft()
                if node.left: q.append(node.left)
                if node.right: q.append(node.right)
        return res`);
add("kth-smallest-element-in-a-bst", "Inorder traversal of a BST is sorted; stop at the k-th visited node.", "O(h + k) time, O(h) space",
`class Solution:
    def kthSmallest(self, root, k):
        st, cur = [], root
        while st or cur:
            while cur:
                st.append(cur)
                cur = cur.left
            cur = st.pop()
            k -= 1
            if k == 0:
                return cur.val
            cur = cur.right`);
add("count-good-nodes-in-binary-tree", "DFS carrying the max value seen on the path; a node is good if it's >= that max.", "O(n) time, O(h) space",
`class Solution:
    def goodNodes(self, root):
        def dfs(node, mx):
            if not node:
                return 0
            good = 1 if node.val >= mx else 0
            mx = max(mx, node.val)
            return good + dfs(node.left, mx) + dfs(node.right, mx)
        return dfs(root, float("-inf"))`);
add("construct-binary-tree-from-preorder-and-inorder-traversal", "Preorder's first element is the root; its position in inorder splits left and right subtrees.", "O(n) time, O(n) space",
`class Solution:
    def buildTree(self, preorder, inorder):
        idx = {v: i for i, v in enumerate(inorder)}
        it = iter(preorder)
        def build(lo, hi):
            if lo > hi:
                return None
            root = TreeNode(next(it))
            m = idx[root.val]
            root.left = build(lo, m - 1)
            root.right = build(m + 1, hi)
            return root
        return build(0, len(inorder) - 1)`);
add("binary-tree-maximum-path-sum", "Each node returns its best downward path (>= 0). The best path through a node is val + left gain + right gain.", "O(n) time, O(h) space",
`class Solution:
    def maxPathSum(self, root):
        best = float("-inf")
        def gain(node):
            nonlocal best
            if not node:
                return 0
            l, r = max(gain(node.left), 0), max(gain(node.right), 0)
            best = max(best, node.val + l + r)
            return node.val + max(l, r)
        gain(root)
        return best`);
add("serialize-and-deserialize-binary-tree", "Preorder with a marker (N) for nulls; deserialize by consuming tokens in the same order.", "O(n) time, O(n) space",
`class Codec:
    def serialize(self, root):
        out = []
        def dfs(node):
            if not node:
                out.append("N")
                return
            out.append(str(node.val))
            dfs(node.left)
            dfs(node.right)
        dfs(root)
        return ",".join(out)

    def deserialize(self, data):
        it = iter(data.split(","))
        def dfs():
            v = next(it)
            if v == "N":
                return None
            node = TreeNode(int(v))
            node.left = dfs()
            node.right = dfs()
            return node
        return dfs()`);

// ---- Heap ----
add("last-stone-weight", "Max-heap (negated values): smash the two heaviest, push back any remainder.", "O(n log n) time, O(n) space",
`import heapq

class Solution:
    def lastStoneWeight(self, stones):
        h = [-s for s in stones]
        heapq.heapify(h)
        while len(h) > 1:
            a, b = -heapq.heappop(h), -heapq.heappop(h)
            if a != b:
                heapq.heappush(h, -(a - b))
        return -h[0] if h else 0`);
add("kth-largest-element-in-a-stream", "Keep a min-heap of the k largest values; its root is the k-th largest.", "O(log k) per add, O(k) space",
`import heapq

class KthLargest:
    def __init__(self, k, nums):
        self.k, self.h = k, []
        for x in nums:
            self.add(x)

    def add(self, val):
        heapq.heappush(self.h, val)
        if len(self.h) > self.k:
            heapq.heappop(self.h)
        return self.h[0]`);
add("kth-largest-element-in-an-array", "Maintain a min-heap of size k over the array; the root is the answer. (Quickselect gives O(n) average.)", "O(n log k) time, O(k) space",
`import heapq

class Solution:
    def findKthLargest(self, nums, k):
        h = []
        for x in nums:
            heapq.heappush(h, x)
            if len(h) > k:
                heapq.heappop(h)
        return h[0]`);
add("k-closest-points-to-origin", "Max-heap of size k keyed by squared distance (negated), evicting the farthest.", "O(n log k) time, O(k) space",
`import heapq

class Solution:
    def kClosest(self, points, k):
        h = []
        for x, y in points:
            heapq.heappush(h, (-(x * x + y * y), x, y))
            if len(h) > k:
                heapq.heappop(h)
        return [[x, y] for _, x, y in h]`);
add("task-scheduler", "The most frequent task forces idle slots: answer = max(len(tasks), (maxFreq - 1) * (n + 1) + number of tasks tied at maxFreq).", "O(n) time, O(26) space",
`from collections import Counter

class Solution:
    def leastInterval(self, tasks, n):
        counts = Counter(tasks).values()
        mx = max(counts)
        ties = sum(1 for c in counts if c == mx)
        return max(len(tasks), (mx - 1) * (n + 1) + ties)`);
add("find-median-from-data-stream", "Two heaps: a max-heap for the lower half and a min-heap for the upper half, kept balanced within one element.", "add O(log n), median O(1)",
`import heapq

class MedianFinder:
    def __init__(self):
        self.lo, self.hi = [], []          # lo is a max-heap (negated)

    def addNum(self, num):
        heapq.heappush(self.lo, -num)
        heapq.heappush(self.hi, -heapq.heappop(self.lo))
        if len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))

    def findMedian(self):
        if len(self.lo) > len(self.hi):
            return float(-self.lo[0])
        return (-self.lo[0] + self.hi[0]) / 2`);

// ---- Trie ----
add("implement-trie-prefix-tree", "Nested dicts: each node maps a character to its child; a '$' key marks end of word.", "O(L) per operation",
`class Trie:
    def __init__(self):
        self.root = {}

    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.setdefault(ch, {})
        node["$"] = True

    def _find(self, s):
        node = self.root
        for ch in s:
            if ch not in node:
                return None
            node = node[ch]
        return node

    def search(self, word):
        node = self._find(word)
        return bool(node and "$" in node)

    def startsWith(self, prefix):
        return self._find(prefix) is not None`);
add("design-add-and-search-words-data-structure", "Trie plus DFS: on a '.' wildcard, try every child at that level.", "O(L) add; search O(26^L) worst case",
`class WordDictionary:
    def __init__(self):
        self.root = {}

    def addWord(self, word):
        node = self.root
        for ch in word:
            node = node.setdefault(ch, {})
        node["$"] = True

    def search(self, word):
        def dfs(i, node):
            if i == len(word):
                return "$" in node
            ch = word[i]
            if ch == ".":
                return any(dfs(i + 1, child) for k, child in node.items() if k != "$")
            return ch in node and dfs(i + 1, node[ch])
        return dfs(0, self.root)`);
add("word-search-ii", "Build a trie of the words and DFS the grid once, following trie edges; prune exhausted branches.", "O(m*n*4^L) worst case",
`class Solution:
    def findWords(self, board, words):
        root = {}
        for w in words:
            node = root
            for ch in w:
                node = node.setdefault(ch, {})
            node["$"] = w
        R, C, found = len(board), len(board[0]), []

        def dfs(r, c, parent):
            ch = board[r][c]
            node = parent[ch]
            if "$" in node:
                found.append(node.pop("$"))
            board[r][c] = "#"
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < R and 0 <= nc < C and board[nr][nc] in node:
                    dfs(nr, nc, node)
            board[r][c] = ch
            if not node:
                del parent[ch]

        for r in range(R):
            for c in range(C):
                if board[r][c] in root:
                    dfs(r, c, root)
        return found`);

// ---- Backtracking ----
add("subsets", "For each element choose to include it or not; record the path at the end.", "O(n * 2^n) time, O(n) recursion space",
`class Solution:
    def subsets(self, nums):
        res, path = [], []
        def dfs(i):
            if i == len(nums):
                res.append(path[:])
                return
            path.append(nums[i]); dfs(i + 1)
            path.pop(); dfs(i + 1)
        dfs(0)
        return res`);
add("combination-sum", "Backtrack with a start index; you may reuse the same number, so recurse on i (not i + 1). Stop when the remaining target goes negative.", "O(2^target) worst case",
`class Solution:
    def combinationSum(self, candidates, target):
        res, path = [], []
        def dfs(i, remain):
            if remain == 0:
                res.append(path[:])
                return
            if remain < 0 or i == len(candidates):
                return
            path.append(candidates[i]); dfs(i, remain - candidates[i])
            path.pop(); dfs(i + 1, remain)
        dfs(0, target)
        return res`);
add("permutations", "Build the permutation one slot at a time, using a 'used' array to avoid repeats.", "O(n * n!) time, O(n) space",
`class Solution:
    def permute(self, nums):
        res, path, used = [], [], [False] * len(nums)
        def dfs():
            if len(path) == len(nums):
                res.append(path[:])
                return
            for i, x in enumerate(nums):
                if not used[i]:
                    used[i] = True; path.append(x)
                    dfs()
                    path.pop(); used[i] = False
        dfs()
        return res`);
add("generate-parentheses", "Add '(' while opens < n, and ')' while closes < opens; that guarantees validity.", "O(4^n / sqrt(n)) time",
`class Solution:
    def generateParenthesis(self, n):
        res = []
        def dfs(s, opens, closes):
            if len(s) == 2 * n:
                res.append(s)
                return
            if opens < n:
                dfs(s + "(", opens + 1, closes)
            if closes < opens:
                dfs(s + ")", opens, closes + 1)
        dfs("", 0, 0)
        return res`);
add("word-search", "DFS from every cell, marking cells visited on the current path and restoring them on backtrack.", "O(m*n*3^L) time, O(L) space",
`class Solution:
    def exist(self, board, word):
        R, C = len(board), len(board[0])
        def dfs(r, c, i):
            if i == len(word):
                return True
            if not (0 <= r < R and 0 <= c < C) or board[r][c] != word[i]:
                return False
            tmp, board[r][c] = board[r][c], "#"
            ok = any(dfs(r + dr, c + dc, i + 1) for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)))
            board[r][c] = tmp
            return ok
        return any(dfs(r, c, 0) for r in range(R) for c in range(C))`);
add("letter-combinations-of-a-phone-number", "For each digit try each of its letters, recursing to the next digit.", "O(4^n * n) time",
`class Solution:
    def letterCombinations(self, digits):
        if not digits:
            return []
        m = {"2": "abc", "3": "def", "4": "ghi", "5": "jkl", "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"}
        res = []
        def dfs(i, cur):
            if i == len(digits):
                res.append(cur)
                return
            for ch in m[digits[i]]:
                dfs(i + 1, cur + ch)
        dfs(0, "")
        return res`);
add("palindrome-partitioning", "At each start index try every end index; if s[start:end] is a palindrome, recurse on the rest.", "O(n * 2^n) time",
`class Solution:
    def partition(self, s):
        res, path = [], []
        def dfs(start):
            if start == len(s):
                res.append(path[:])
                return
            for end in range(start + 1, len(s) + 1):
                piece = s[start:end]
                if piece == piece[::-1]:
                    path.append(piece)
                    dfs(end)
                    path.pop()
        dfs(0)
        return res`);
add("n-queens", "Place one queen per row; track used columns and both diagonals (r - c and r + c) in sets.", "O(n!) time, O(n) space",
`class Solution:
    def solveNQueens(self, n):
        cols, d1, d2, res, board = set(), set(), set(), [], []
        def dfs(r):
            if r == n:
                res.append(["." * c + "Q" + "." * (n - c - 1) for c in board])
                return
            for c in range(n):
                if c in cols or (r - c) in d1 or (r + c) in d2:
                    continue
                cols.add(c); d1.add(r - c); d2.add(r + c); board.append(c)
                dfs(r + 1)
                cols.remove(c); d1.remove(r - c); d2.remove(r + c); board.pop()
        dfs(0)
        return res`);
