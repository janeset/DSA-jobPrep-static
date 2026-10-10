"use strict";
// Workspace content per problem, in our own words (the full statement stays on LeetCode).
//   PROMPT[slug] = { s: short summary, ex: the output for the first test input in tests.js }
//   HINTS[slug]  = [key idea, approach sketch]. Hint 1 (the pattern) is added by workspace.js.
// Hints follow the worked solution's approach (SOL[slug].a) so they never point elsewhere.

const PROMPT = {}, HINTS = {};
const pq = (slug, s, ex, h1, h2) => { PROMPT[slug] = { s, ex }; HINTS[slug] = [h1, h2]; };

// ---- Arrays & Hashing ----
pq("contains-duplicate", "Given an integer array, return true if any value appears at least twice, and false if every value is distinct.", "True",
  "You only need to know whether you've seen a value before. Which structure answers that in O(1)?",
  "Scan once, keeping a set of values seen so far. If the current value is already in the set, return True.");
pq("valid-anagram", "Given two strings, return true if one is a rearrangement of the other: the same letters, each used the same number of times.", "True",
  "Order doesn't matter, only how many times each letter appears.",
  "Count the characters of both strings (a dict or Counter) and compare the counts. Different lengths can return False straight away.");
pq("two-sum", "Given an array of integers and a target, return the indices of the two numbers that add up to the target. Exactly one answer exists, and you can't use the same element twice.", "[0, 1]",
  "For each number x you need target - x. Can you look that up instantly instead of scanning again?",
  "Keep a dict of value -> index for numbers already seen. For each x, if target - x is in the dict, return both indices; otherwise store x.");
pq("majority-element", "Given an array of size n, return the element that appears more than n / 2 times. It always exists.", "3",
  "If you pair off each majority element against a different element, some majority elements are always left over.",
  "Boyer-Moore voting: keep a candidate and a count. When the count is 0, take the current number as candidate; add 1 for a match and subtract 1 otherwise.");
pq("move-zeroes", "Move every 0 in the array to the end, in place, keeping the other elements in their original order.", "[1, 3, 12, 0, 0]",
  "Think of it as copying the non-zero values forward and leaving the end for the zeros.",
  "Use a write pointer: for every non-zero value, write it at the pointer and advance. Then fill from the pointer to the end with zeros (or swap as you go).");
pq("group-anagrams", "Given a list of strings, group the words that are anagrams of each other. Groups can be in any order.", "[['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]",
  "Anagrams look identical once you put their letters in a fixed order. That can be a dictionary key.",
  "For each word build a key (sorted letters, or a tuple of 26 letter counts) and append the word to dict[key]. Return the dict's values.");
pq("top-k-frequent-elements", "Given an integer array and k, return the k values that appear most often, in any order.", "[1, 2]",
  "First count how often each value appears. Then you need the top k counts without a full sort.",
  "Count with a dict, then make buckets where bucket[c] lists the values that appear c times. Walk the buckets from the highest count down until you have k values.");
pq("product-of-array-except-self", "Return an array where position i holds the product of every element except nums[i]. Do it in O(n) without division.", "[24, 12, 8, 6]",
  "The answer at i is (product of everything left of i) times (product of everything right of i).",
  "One pass left to right fills each slot with the running prefix product. A second pass right to left multiplies in a running suffix product.");
pq("valid-sudoku", "Check whether a partly filled 9x9 Sudoku board is valid: no digit repeats in any row, any column, or any of the nine 3x3 boxes. Empty cells are '.'.", "True",
  "Every filled cell belongs to exactly one row, one column and one box. Track what's been seen in each.",
  "Keep a set for each row, column and box (box index = (r // 3) * 3 + c // 3). If a digit is already in any of its three sets, the board is invalid.");
pq("longest-consecutive-sequence", "Given an unsorted integer array, return the length of the longest run of consecutive values (like 1, 2, 3, 4). Aim for O(n).", "4",
  "With all values in a set you can check x + 1 in O(1). But walking from every number repeats work.",
  "Only start counting at a number whose predecessor x - 1 is not in the set; from there count upward. Each run is walked once, so it's O(n).");
pq("subarray-sum-equals-k", "Count the contiguous subarrays whose elements add up to k. Values can be negative.", "2",
  "A subarray sum is the difference of two prefix sums. Negative numbers rule out a sliding window.",
  "Keep a running prefix sum and a dict counting each prefix seen (starting with {0: 1}). At each step add count[prefix - k] to the answer, then record prefix.");
pq("rotate-array", "Rotate the array to the right by k steps, in place. For example, [1,2,3] rotated by 1 becomes [3,1,2].", "[5, 6, 7, 1, 2, 3, 4]",
  "k can be bigger than n, so use k % n. The last k elements end up at the front, each block in its original order.",
  "Reverse the whole array, then reverse the first k elements, then reverse the remaining n - k.");

// ---- Two Pointers ----
pq("valid-palindrome", "Return true if the string reads the same forwards and backwards once you lowercase it and ignore everything except letters and digits.", "True",
  "Compare characters from both ends, moving inward.",
  "Left and right pointers: skip characters that aren't alphanumeric, compare the lowercase versions, and stop at the first mismatch.");
pq("remove-duplicates-from-sorted-array", "The array is sorted. Remove the duplicates in place so each value appears once at the front, and return how many unique values there are.", "2 (nums starts [1, 2])",
  "Because the array is sorted, duplicates sit next to each other.",
  "A slow pointer marks the end of the unique part. A fast pointer scans; when it finds a value different from nums[slow], move slow forward and copy it there.");
pq("two-sum-ii-input-array-is-sorted", "The array is sorted in ascending order. Return the 1-indexed positions of the two numbers that add up to the target, using O(1) extra space.", "[1, 2]",
  "Sorted order tells you which way to move: a bigger sum needs a bigger number, a smaller sum a smaller one.",
  "Start with pointers at both ends. If the sum is too small move left up, if too big move right down, and stop when it matches.");
pq("3sum", "Return every unique triple of values in the array that adds up to 0. No triple may repeat.", "[[-1, -1, 2], [-1, 0, 1]]",
  "Fix one number and the rest becomes Two Sum on a sorted array.",
  "Sort. For each index i (skipping repeated values), run two pointers on the part after i looking for -nums[i]. After a match, skip repeated values on both sides.");
pq("container-with-most-water", "Each value is the height of a vertical line. Pick two lines that, with the x-axis, hold the most water, and return that amount.", "49",
  "The area is width times the shorter line. Moving the taller line inward can never help.",
  "Start with the widest pair (both ends). Record the area, then move the pointer at the shorter line inward. Repeat until they meet.");
pq("sort-colors", "The array holds only 0s, 1s and 2s. Sort it in place in one pass, without a library sort.", "[0, 0, 1, 1, 2, 2]",
  "Think of three regions: 0s at the front, 2s at the back, 1s in the middle.",
  "Dutch national flag: keep low, mid and high pointers. A 0 at mid swaps to low (both advance), a 2 swaps to high (high moves back, mid stays), a 1 just moves mid on.");
pq("trapping-rain-water", "Each value is the height of a bar of width 1. Work out how much rain water is trapped between the bars.", "6",
  "Water above a bar = min(tallest bar to its left, tallest bar to its right) - its height.",
  "Two pointers with leftMax and rightMax. Always move the side with the smaller max: that max is the limit for that side, so add max - height there.");

// ---- Sliding Window ----
pq("best-time-to-buy-and-sell-stock", "prices[i] is a stock's price on day i. Buy on one day and sell on a later day for the biggest profit. Return 0 if no profit is possible.", "5",
  "The best sale on any day uses the cheapest price before it.",
  "Scan once, tracking the lowest price so far. At each day the profit is price - lowest; keep the maximum.");
pq("maximum-average-subarray-i", "Find the contiguous subarray of exactly length k with the highest average, and return that average.", "12.75",
  "Every window has the same length k, so the biggest sum gives the biggest average.",
  "Sum the first k values. Slide the window: add the new element, subtract the one leaving, keep the best sum, and divide by k at the end.");
pq("longest-substring-without-repeating-characters", "Return the length of the longest substring with no repeated characters.", "3",
  "Keep a window with no repeats. When a repeat enters, the left edge has to move past the earlier copy.",
  "Store each character's last index. When s[r] was last seen inside the window, jump l to that index + 1. The answer is the max of r - l + 1.");
pq("longest-repeating-character-replacement", "You can change up to k characters to any other uppercase letter. Return the length of the longest substring of one repeated letter you can make.", "4",
  "A window works if (its length - the count of its most common letter) <= k: those are the letters you'd change.",
  "Grow the right edge while counting letters. While the window needs more than k changes, shrink from the left. Track the longest valid window.");
pq("permutation-in-string", "Return true if s2 contains some rearrangement of s1 as a contiguous substring.", "True",
  "A rearrangement has the same letter counts, and it's exactly len(s1) long.",
  "Slide a fixed window of len(s1) over s2, updating letter counts as it moves, and compare them to s1's counts each step.");
pq("minimum-window-substring", "Return the shortest substring of s that contains every character of t, including duplicates. Return '' if none exists.", "'BANC'",
  "Grow the window until it covers t, then shrink it while it still does.",
  "Count what t needs and track how many requirements are met. Move right until all are met, then move left as far as you can, recording the smallest window, and repeat.");
pq("sliding-window-maximum", "A window of size k slides across the array one step at a time. Return the maximum of each window.", "[3, 3, 5, 5, 6, 7]",
  "A smaller value that sits behind a bigger, newer one can never be a window's max again.",
  "Keep a deque of indices with decreasing values. Pop from the back while the new value is bigger, drop the front once it leaves the window, and the front is the max.");

// ---- Stack ----
pq("valid-parentheses", "Given a string of the brackets ()[]{}, return true if every bracket is closed by the matching type in the right order.", "True",
  "The most recently opened bracket must be the first one closed.",
  "Push opening brackets onto a stack. A closing bracket must match the top (pop it); otherwise it's invalid. At the end the stack must be empty.");
pq("min-stack", "Design a stack with push, pop, top and getMin, where every operation (including getMin) runs in O(1) time.", "",
  "When you pop, the minimum may change. The stack needs to remember the minimum at each depth.",
  "Push pairs of (value, minimum so far including this value). getMin reads the top pair's minimum.");
pq("daily-temperatures", "For each day, return how many days you'd wait for a warmer temperature, or 0 if none comes.", "[1, 1, 4, 2, 1, 1, 0, 0]",
  "Days still waiting for a warmer day form a decreasing sequence. A warm day can answer several of them at once.",
  "Keep a stack of indices. For each day, while it's warmer than the day on top, pop that day and set its answer to the gap in indices. Then push today.");
pq("evaluate-reverse-polish-notation", "Evaluate an arithmetic expression given in Reverse Polish (postfix) notation with + - * /. Division truncates toward zero.", "9",
  "In postfix, an operator always applies to the two most recent values.",
  "Push numbers onto a stack. For an operator, pop b then a, push a op b. Use int(a / b) for division so it truncates toward zero.");
pq("car-fleet", "Cars drive toward a target at different speeds and can't pass each other; a faster car that catches up joins the slower car's fleet. Return how many fleets arrive.", "3",
  "Work out when each car would arrive on its own. Then process cars from the closest to the target backwards.",
  "Sort by position, descending. Arrival time = (target - pos) / speed. If a car's time is larger than the fleet in front's, it starts a new fleet; otherwise it joins it.");
pq("largest-rectangle-in-histogram", "Each value is the height of a bar of width 1. Return the area of the largest rectangle that fits inside the histogram.", "10",
  "For each bar, the widest rectangle at its height stretches until a shorter bar on each side.",
  "Keep a stack of indices with increasing heights. When a shorter bar arrives, pop taller bars; each popped bar's width ends just before the current index. Add a 0 bar at the end to flush.");

// ---- Binary Search ----
pq("binary-search", "Given a sorted array and a target, return the target's index, or -1 if it isn't there. It must run in O(log n).", "4",
  "Each comparison with the middle element rules out half of what's left.",
  "Keep lo and hi. Look at mid: return it on a match, search the right half if it's too small, the left half if too big.");
pq("search-a-2d-matrix", "Each row is sorted, and each row starts after the previous row ends. Return true if the target is in the matrix, in O(log(m*n)).", "True",
  "Read row by row, the whole matrix is one sorted list.",
  "Binary search indices 0 .. m*n - 1, mapping index i to row i // n and column i % n.");
pq("koko-eating-bananas", "Koko eats from one pile per hour, at most k bananas an hour. Find the smallest k that lets her finish every pile within h hours.", "4",
  "If speed k works, every faster speed also works. That 'yes after some point' shape can be binary searched.",
  "Binary search k between 1 and max(piles). A speed works if the sum of ceil(pile / k) is <= h. Find the smallest speed that works.");
pq("find-minimum-in-rotated-sorted-array", "A sorted array of distinct values was rotated at an unknown point. Return its minimum in O(log n).", "1",
  "Compare the middle to the right end to tell which side the rotation point is on.",
  "If nums[mid] > nums[hi], the minimum is right of mid (lo = mid + 1). Otherwise it's at mid or to its left (hi = mid). Stop when lo == hi.");
pq("search-in-rotated-sorted-array", "A sorted array of distinct values was rotated at an unknown point. Return the target's index, or -1, in O(log n).", "4",
  "Around any midpoint, at least one half is still sorted, and with a sorted half you can tell whether the target is in it.",
  "Find which half is sorted by comparing nums[lo] and nums[mid]. If the target falls inside that half's range, search it; otherwise search the other half.");
pq("time-based-key-value-store", "Design a key-value store that keeps every version: set(key, value, timestamp), and get(key, timestamp) returns the value with the latest timestamp at or before the one asked for.", "",
  "Timestamps for a key arrive in increasing order, so each key's history is already sorted.",
  "Keep a list of (timestamp, value) per key. get() binary searches that list for the last timestamp <= the query, returning '' if there's none.");
pq("median-of-two-sorted-arrays", "Given two sorted arrays, return the median of all their values combined, in O(log(m + n)).", "2.0",
  "You don't need to merge. You need a split of both arrays into a left half and a right half where everything left is <= everything right.",
  "Binary search how many elements to take from the smaller array; the rest of the left half comes from the other. Check the four edge values; once the split is valid, the median comes from them.");

// ---- Linked List ----
pq("reverse-linked-list", "Reverse a singly linked list and return its new head.", "[5, 4, 3, 2, 1]",
  "Each node's next pointer should point to the node before it. Keep hold of the rest of the list before you overwrite next.",
  "Walk with prev = None and cur = head: save cur.next, point cur.next at prev, move prev and cur forward. prev is the new head.");
pq("merge-two-sorted-lists", "Merge two sorted linked lists into one sorted list made by splicing their nodes, and return its head.", "[1, 1, 2, 3, 4, 4]",
  "At each step the next node is the smaller of the two current heads.",
  "Use a dummy head and a tail pointer. Attach the smaller node and advance in that list. When one list runs out, attach the rest of the other.");
pq("linked-list-cycle", "Return true if following next pointers from the head ever loops back to an earlier node.", "True",
  "Two runners at different speeds on a loop always meet eventually.",
  "Floyd: slow moves one step and fast two. If fast reaches the end there's no cycle; if they land on the same node, there is one.");
pq("middle-of-the-linked-list", "Return the middle node of a linked list. With two middle nodes, return the second.", "[3, 4, 5]",
  "When one pointer has gone twice as far as another, the slower one is halfway.",
  "Move fast two steps and slow one step while fast and fast.next exist. slow is the middle.");
pq("reorder-list", "Reorder the list L0, L1, ..., Ln in place to L0, Ln, L1, Ln-1, L2, ... by relinking nodes.", "[1, 4, 2, 3]",
  "The result alternates nodes from the front half and the back half, with the back half reversed.",
  "Find the middle with slow and fast pointers, cut the list there, reverse the second half, then interleave the two halves.");
pq("remove-nth-node-from-end-of-list", "Remove the n-th node from the end of the list and return the head. Try to do it in one pass.", "[1, 2, 3, 5]",
  "Two pointers kept exactly n nodes apart: when the front one reaches the end, the back one is at the right spot.",
  "Start both pointers at a dummy node in front of head. Move the lead n + 1 steps, then move both until lead is None, then skip the node after the trailing pointer.");
pq("add-two-numbers", "Two non-negative numbers are stored as linked lists of digits, least significant digit first. Return their sum as a list in the same format.", "[7, 0, 8]",
  "This is grade-school addition, and the digits already come in the order you add them.",
  "Walk both lists together with a carry. Each new node holds (a + b + carry) % 10 and the carry becomes the sum // 10. Keep going while either list or the carry remains.");
pq("lru-cache", "Design a fixed-capacity cache with get and put in O(1). When full, put evicts the least recently used key.", "",
  "You need O(1) lookup by key and O(1) 'move to most recent' and 'remove oldest'.",
  "Use a hash map plus a recency order: an OrderedDict (move_to_end, popitem(last=False)) or a dict with a doubly linked list. get and put both mark the key as most recent.");
pq("copy-list-with-random-pointer", "Each node has a next pointer and a random pointer to any node or None. Return a deep copy of the list.", "[[7, None], [13, 0], [11, 4], [10, 2], [1, 0]]",
  "A random pointer may point at a node you haven't copied yet. Copy all the nodes before wiring anything.",
  "First pass: map each original node to a new node with the same value. Second pass: set copy.next = map[node.next] and copy.random = map[node.random].");
pq("merge-k-sorted-lists", "Merge k sorted linked lists into one sorted list.", "[1, 1, 2, 3, 4, 4, 5, 6]",
  "The next node is always the smallest of the k current heads. Which structure gives you the smallest quickly?",
  "Push each list's head into a min-heap as (value, index, node). Pop the smallest, attach it, and push its next node. O(N log k).");

// ---- Trees ----
pq("invert-binary-tree", "Mirror a binary tree: swap the left and right children of every node. Return the root.", "[4, 7, 2, 9, 6, 3, 1]",
  "Inverting a tree is inverting both subtrees and then swapping them.",
  "Recursively: if the node is None return None; otherwise swap node.left and node.right and invert each. Return the node.");
pq("maximum-depth-of-binary-tree", "Return the number of nodes on the longest path from the root down to a leaf.", "3",
  "A tree's depth follows from its subtrees' depths.",
  "depth(None) = 0; depth(node) = 1 + max(depth(left), depth(right)).");
pq("same-tree", "Return true if two binary trees have the same shape and the same values in every position.", "True",
  "Two trees match if their roots match and both pairs of subtrees match.",
  "Both None: True. Exactly one None, or different values: False. Otherwise recurse on (left, left) and (right, right).");
pq("diameter-of-binary-tree", "Return the number of edges on the longest path between any two nodes. The path doesn't have to pass through the root.", "3",
  "The longest path that bends at a node is its left height plus its right height.",
  "Write a height function. At each node, update a global best with left + right, and return 1 + max(left, right).");
pq("balanced-binary-tree", "A tree is balanced if, at every node, the heights of the two subtrees differ by at most 1. Return whether it's balanced.", "True",
  "Checking every node's heights from the top repeats work. Compute heights bottom-up once.",
  "Return the height from a DFS, or -1 to mean 'unbalanced'. If either child is -1 or their heights differ by more than 1, return -1. Balanced if the root isn't -1.");
pq("subtree-of-another-tree", "Return true if subRoot appears inside root as a complete subtree: some node plus all of its descendants, matching exactly.", "True",
  "You already know how to check whether two trees are identical (Same Tree).",
  "For every node of root, check whether the tree starting there equals subRoot. Recurse: isSame(root, sub) or check root.left or check root.right.");
pq("lowest-common-ancestor-of-a-binary-search-tree", "In a binary search tree, return the lowest node that has both p and q as descendants (a node counts as its own descendant).", "6",
  "The BST ordering tells you which side each of p and q is on.",
  "From the root: if both values are smaller go left, if both are larger go right. Otherwise this node is where they split, so it's the answer.");
pq("binary-tree-level-order-traversal", "Return the tree's values level by level, left to right, as a list of lists.", "[[3], [9, 20], [15, 7]]",
  "Visiting nodes in order of distance from the root is breadth-first search.",
  "Use a queue. Each round, note its current length, pop exactly that many nodes into one level's list, and enqueue their children.");
pq("validate-binary-search-tree", "Return true if the tree is a valid BST: every node is greater than everything in its left subtree and smaller than everything in its right subtree.", "True",
  "Comparing a node with only its children isn't enough. Each node has a range it must fit in, set by its ancestors.",
  "DFS passing (low, high). The node must satisfy low < val < high. Recurse left with (low, val) and right with (val, high).");
pq("binary-tree-right-side-view", "Imagine standing to the right of the tree. Return the values you'd see, from top to bottom: the rightmost node on each level.", "[1, 3, 4]",
  "Each level contributes exactly one node: its last one.",
  "Level-order BFS. For each level, append the last node's value. (Or DFS visiting right before left and record the first node seen at each depth.)");
pq("kth-smallest-element-in-a-bst", "Return the k-th smallest value (1-indexed) in a binary search tree.", "1",
  "An inorder traversal visits a BST's values in sorted order.",
  "Inorder traversal (iterative with a stack is easiest to stop early). Count nodes as you visit them and return the value of the k-th.");
pq("count-good-nodes-in-binary-tree", "A node is good if no node on the path from the root to it has a bigger value. Count the good nodes.", "4",
  "What each node needs to know is the largest value on its path so far.",
  "DFS carrying maxSoFar. If node.val >= maxSoFar, count it. Recurse into the children with max(maxSoFar, node.val).");
pq("construct-binary-tree-from-preorder-and-inorder-traversal", "Given a tree's preorder and inorder traversals (values are unique), rebuild the tree.", "[3, 9, 20, None, None, 15, 7]",
  "Preorder gives you the root first. Finding that root in inorder tells you which values are in the left subtree and which in the right.",
  "Map each value to its inorder index. Take the next preorder value as the root, split the inorder range at its index, and build the left then the right subtree recursively.");
pq("binary-tree-maximum-path-sum", "A path is any chain of connected nodes, used at most once each. Return the largest sum of any non-empty path.", "6",
  "At each node, a path can bend there (left + node + right), but what it passes up to its parent can only use one side.",
  "DFS returns the node's best downward gain: val + max(left, right), with negative child gains counted as 0. At each node, update a global best with val + left + right.");
pq("serialize-and-deserialize-binary-tree", "Design serialize (tree to string) and deserialize (string back to the same tree) for any binary tree.", "",
  "A traversal that also records the empty spots gives you enough to rebuild the exact shape.",
  "Serialize with preorder, writing a marker such as 'N' for None. Deserialize by reading tokens in the same order: build a node, then its left subtree, then its right.");

// ---- Heap ----
pq("last-stone-weight", "Repeatedly smash the two heaviest stones: equal weights destroy both, otherwise the smaller is destroyed and the larger loses that weight. Return the last stone's weight, or 0.", "1",
  "Every turn you need the two biggest values, and the set keeps changing.",
  "Use a max-heap (push negated values with heapq). Pop two, push back the difference if it isn't 0, and repeat until at most one stone is left.");
pq("kth-largest-element-in-a-stream", "Design a class that receives numbers one at a time and, after each add, returns the k-th largest value seen so far.", "",
  "You only ever care about the k largest values. The smallest of those is the answer.",
  "Keep a min-heap of size k. On add, push the value and pop if the size goes over k. The heap's root is the k-th largest.");
pq("kth-largest-element-in-an-array", "Return the k-th largest element of an unsorted array (the k-th in sorted order, not the k-th distinct). Try not to sort the whole array.", "5",
  "Keeping just the top k values is cheaper than sorting all of them.",
  "Keep a min-heap of size k as you scan; whenever it grows past k, pop. The root is the answer. Quickselect gives O(n) on average.");
pq("k-closest-points-to-origin", "Given points on a plane, return the k points closest to the origin (0, 0), in any order.", "[[-2, 2]]",
  "You don't need the real distance: comparing x*x + y*y is enough.",
  "Keep a max-heap of size k on squared distance (push negatives), dropping the farthest when it grows past k. Or sort by squared distance for O(n log n).");
pq("task-scheduler", "A CPU runs tasks labelled A-Z, one per time unit. The same task needs at least n units between runs (idle is allowed). Return the fewest units needed to run them all.", "8",
  "The most frequent task sets the length: its copies need gaps of n between them.",
  "With maxFreq the top count and m the number of tasks with that count, the answer is max(len(tasks), (maxFreq - 1) * (n + 1) + m).");
pq("find-median-from-data-stream", "Design a class with addNum(num) and findMedian() that returns the median of every number added so far.", "",
  "The median sits between the lower half and the upper half. Keep each half where you can reach its edge quickly.",
  "A max-heap holds the lower half and a min-heap the upper half. Keep their sizes within one of each other and every low value <= every high value. The median comes from the tops.");

// ---- Trie ----
pq("implement-trie-prefix-tree", "Implement a trie with insert(word), search(word) for a whole word, and startsWith(prefix) for any word with that prefix.", "",
  "Words that share a prefix share the same path of nodes from the root.",
  "Each node is a dict of char -> child, plus an end-of-word flag. insert walks and creates nodes; search and startsWith walk the path, and only search requires the flag.");
pq("design-add-and-search-words-data-structure", "Design addWord(word) and search(word), where search's word may contain '.' that matches any single letter.", "",
  "Store the words in a trie. A '.' means trying every child at that level.",
  "search is a DFS(node, i): for a letter follow that child; for '.' try every child. Return True when i reaches the end at a node that ends a word.");
pq("word-search-ii", "Given a grid of letters and a list of words, return every word that can be traced by moving between adjacent cells, without reusing a cell in the same word.", "['eat', 'oath']",
  "Running Word Search once per word repeats the same grid walks. Search for all the words at once.",
  "Build a trie of the words and DFS from each cell, following trie edges and marking cells visited on the current path. When you reach a word's end, record it (and remove it to avoid duplicates and prune).");

// ---- Backtracking ----
pq("subsets", "Return every subset of an array of distinct integers, with no duplicate subsets.", "[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]",
  "Each element is either in or out: two choices per element, 2^n subsets in total.",
  "Backtrack(i, path): at i == n record a copy of path. Otherwise recurse once with nums[i] added and once without it.");
pq("combination-sum", "Return every unique combination of candidates that adds up to the target. A number can be used any number of times.", "[[2, 2, 3], [7]]",
  "To avoid listing the same combination in a different order, only pick numbers at or after the current position.",
  "Backtrack(start, remaining): for i from start, add candidates[i] and recurse with i (reuse allowed) and remaining - candidates[i]. Stop when remaining is 0 (record) or below 0.");
pq("permutations", "Return every ordering of an array of distinct integers.", "[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]",
  "Fill the positions one at a time from the numbers you haven't used yet.",
  "Backtrack with a used array (or set). When the path has n numbers, record it. Otherwise try each unused number: mark it, recurse, unmark.");
pq("generate-parentheses", "Return every string of n pairs of parentheses that is well-formed.", "['((()))', '(()())', '(())()', '()(())', '()()()']",
  "A string stays valid as long as you never close more brackets than you've opened.",
  "Backtrack(open, close): add '(' if open < n, add ')' if close < open. Record the string when its length is 2n.");
pq("word-search", "Return true if the word can be traced in the grid by moving up, down, left or right between cells, without using any cell twice.", "True",
  "Try starting from every cell. From each, explore the four neighbours for the next letter.",
  "DFS(r, c, i): fail if out of bounds or board[r][c] != word[i]. Mark the cell (e.g. '#'), recurse on the neighbours with i + 1, then restore it. Success when i reaches len(word).");
pq("letter-combinations-of-a-phone-number", "Given a string of digits 2-9, return every letter combination they could spell on a phone keypad.", "['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf']",
  "Each digit offers a few letters. Make one choice per digit.",
  "Map digits to letters. Backtrack(i, path): at the end of the digits record path; otherwise try each letter of digits[i]. Return [] for empty input.");
pq("palindrome-partitioning", "Split the string into pieces so that every piece is a palindrome. Return every such split.", "[['a', 'a', 'b'], ['aa', 'b']]",
  "Choose the first piece, as long as it's a palindrome, then split the rest the same way.",
  "Backtrack(start, path): for each end > start, if s[start:end] is a palindrome, add it and recurse from end. Record path when start reaches len(s).");
pq("n-queens", "Place n queens on an n x n board so that no two attack each other. Return every distinct board.", "[['.Q..', '...Q', 'Q...', '..Q.'], ['..Q.', 'Q...', '...Q', '.Q..']]",
  "There must be exactly one queen per row, so place them row by row.",
  "Track used columns, diagonals (r - c) and anti-diagonals (r + c) in sets. For each row try each free column, recurse to the next row, then undo. Build the board at row n.");

// ---- Graphs ----
pq("find-if-path-exists-in-graph", "Given an undirected graph as an edge list, return true if there is a path from source to destination.", "True",
  "Turn the edge list into an adjacency list, then explore from the source.",
  "Build the adjacency list, then BFS or DFS from source with a visited set. Return True as soon as you reach destination. (Union-Find works too.)");
pq("number-of-islands", "In a grid of '1' (land) and '0' (water), count the islands: groups of land cells joined up, down, left or right.", "1",
  "Each time you find land you haven't seen, that's a new island. Then mark the whole island as seen.",
  "Scan every cell. On a '1', add one to the count and flood-fill (DFS or BFS) from it, turning connected land to '0'.");
pq("max-area-of-island", "In a grid of 1s and 0s, return the area (number of cells) of the largest island, or 0 if there isn't one.", "6",
  "This is Number of Islands, but the flood fill also counts cells.",
  "DFS from each land cell returns 1 + the sizes from its four neighbours, sinking the cells as it goes. Keep the largest result.");
pq("course-schedule", "There are numCourses courses and prerequisite pairs [a, b] meaning b must come before a. Return true if you can finish every course.", "True",
  "Courses and prerequisites form a directed graph. You can finish them all exactly when it has no cycle.",
  "Kahn's algorithm: count indegrees, queue the courses with 0, and pop them while lowering their neighbours' indegrees. If you process every course, there's no cycle.");
pq("clone-graph", "Return a deep copy of a connected undirected graph, given one of its nodes.", "[[2, 4], [1, 3], [2, 4], [1, 3]]",
  "The graph has cycles. Remember which nodes you've already copied.",
  "Keep a dict from original to copy. DFS(node): if it's already copied return the copy; otherwise create it, store it, then add DFS(neighbour) for each neighbour.");
pq("rotting-oranges", "Each minute, a rotten orange (2) rots its fresh neighbours (1) up, down, left and right. Return the minutes until no fresh orange is left, or -1 if that never happens.", "4",
  "The rot spreads from all rotten oranges at once, one step per minute: breadth-first, from several starting points.",
  "Put every rotten orange in the queue and count the fresh ones. BFS one layer per minute, rotting fresh neighbours. At the end return the minutes, or -1 if any fresh orange remains.");
pq("course-schedule-ii", "As in Course Schedule, but return an order in which to take all the courses, or [] if that's impossible.", "[0, 1]",
  "Any valid order is a topological sort of the prerequisite graph.",
  "Run Kahn's algorithm and append each course as it leaves the queue. If the order has fewer than numCourses courses, there's a cycle, so return [].");
pq("pacific-atlantic-water-flow", "Water flows from a cell to a neighbour of equal or lower height. The Pacific touches the top and left edges, the Atlantic the bottom and right. Return the cells whose water can reach both oceans.", "[[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]]",
  "Searching from every cell is slow. Search backwards from the oceans instead.",
  "From every Pacific border cell, DFS 'uphill' (to neighbours at least as tall) and mark what you reach; do the same for the Atlantic. Return the cells in both sets.");
pq("surrounded-regions", "Capture every region of 'O's that is completely surrounded by 'X's by flipping it to 'X', in place. Regions touching the border stay.", "[['X', 'X', 'X', 'X'], ['X', 'X', 'X', 'X'], ['X', 'X', 'X', 'X'], ['X', 'O', 'X', 'X']]",
  "It's easier to find the regions that are safe: the ones connected to the border.",
  "DFS from every border 'O', marking it temporarily (e.g. 'T'). Then flip the remaining 'O's to 'X' and turn the 'T's back to 'O'.");
pq("redundant-connection", "A tree with n nodes had one extra edge added, making a cycle. Return the edge you can remove to get a tree back (the last such edge in the input).", "[2, 3]",
  "Add edges one at a time. The extra edge is the first one that joins two nodes that are already connected.",
  "Union-Find with path compression. For each edge, if find(a) == find(b) return it; otherwise union them.");
pq("network-delay-time", "A signal starts at node k and travels along weighted directed edges. Return the time until every node has received it, or -1 if some node never does.", "2",
  "The time a node hears the signal is its shortest-path distance from k. Weights are non-negative.",
  "Dijkstra: a min-heap of (time, node). Pop the closest unvisited node, record its time, and push its neighbours with time + weight. The answer is the largest recorded time, if every node was reached.");
pq("cheapest-flights-within-k-stops", "Return the cheapest price from src to dst using at most k stops, or -1 if there's no such route.", "700",
  "Limiting the stops means limiting the number of edges: at most k + 1 flights.",
  "Bellman-Ford for k + 1 rounds: each round, relax every flight using a copy of the previous round's prices, so each round adds at most one flight.");
pq("word-ladder", "Change beginWord into endWord one letter at a time, where every word along the way must be in the word list. Return the number of words in the shortest such chain, or 0.", "5",
  "Each word is a node, linked to words one letter away. The shortest chain is a shortest path, so use BFS.",
  "BFS from beginWord. For each word, try every position and every letter a-z; any result in the word set that isn't visited joins the next level. Return the level number when you reach endWord.");

// ---- Intervals & Greedy ----
pq("maximum-subarray", "Return the largest sum of any non-empty contiguous subarray.", "6",
  "At each position, either extend the best subarray that ends just before it, or start fresh here.",
  "Kadane: cur = max(x, cur + x), best = max(best, cur).");
pq("jump-game", "nums[i] is the furthest you can jump from index i. Starting at index 0, return true if you can reach the last index.", "True",
  "You don't need the exact path, only the furthest index you can reach so far.",
  "Scan with reach = 0. If i > reach, return False; otherwise reach = max(reach, i + nums[i]). Return True if you finish the scan.");
pq("merge-intervals", "Merge every overlapping interval and return the non-overlapping result.", "[[1, 6], [8, 10], [15, 18]]",
  "Once the intervals are sorted by start, overlaps can only happen between neighbours.",
  "Sort by start. If the next interval starts at or before the last merged interval's end, extend that end; otherwise add it as a new interval.");
pq("insert-interval", "Insert a new interval into a sorted list of non-overlapping intervals, merging where needed so the result is still sorted and non-overlapping.", "[[1, 5], [6, 9]]",
  "The list falls into three parts: intervals entirely before the new one, ones that overlap it, and ones entirely after.",
  "Add the intervals that end before the new start. Merge every overlapping interval into the new one (min of starts, max of ends) and add it. Add the rest.");
pq("non-overlapping-intervals", "Return the fewest intervals you need to remove so the rest don't overlap. Intervals that only touch at an end are fine.", "1",
  "To keep as many intervals as possible, always keep the one that finishes earliest.",
  "Sort by end. Keep the end of the last kept interval. If the next starts before it, remove it (count += 1); otherwise keep it and update the end.");
pq("jump-game-ii", "nums[i] is the furthest you can jump from index i. Return the fewest jumps from index 0 to the last index (it's always reachable).", "2",
  "Group indices by how many jumps it takes to reach them: each group is a range, like a level in BFS.",
  "Track the current range's end and the furthest reach. When i reaches the current end, add a jump and set end = furthest.");
pq("gas-station", "Gas stations are on a circular route: gas[i] is the fuel at station i and cost[i] the fuel needed to reach the next. Return the station to start from to complete the circle, or -1. The answer is unique if it exists.", "3",
  "If total gas is less than total cost, no start works. Otherwise, a start that runs out at station j can't be fixed by starting anywhere before j.",
  "Check the totals first. Then scan with a tank: whenever it goes negative, set start = i + 1 and empty the tank. Return start.");
pq("partition-labels", "Split the string into as many parts as possible so that each letter appears in at most one part. Return the parts' sizes.", "[9, 7, 8]",
  "A part has to stretch at least to the last place any of its letters appears.",
  "Record each letter's last index. Scan, extending end = max(end, last[c]). When i == end, close the part and record its size.");

// ---- Math, Matrix & Bits ----
pq("single-number", "Every value appears twice except one. Find that one, in O(n) time and O(1) extra space.", "1",
  "Look for an operation where a value combined with itself cancels out.",
  "XOR every number together: x ^ x = 0 and x ^ 0 = x, so the pairs cancel and the single number is left.");
pq("plus-one", "A large integer is given as an array of digits, most significant first. Add one and return the resulting digits.", "[1, 2, 4]",
  "Only trailing 9s cause carries.",
  "Walk from the last digit: if it's below 9, add one and return. Otherwise set it to 0 and keep going. If every digit was 9, return [1] followed by zeros.");
pq("number-of-1-bits", "Return how many 1 bits are in the binary form of a positive integer.", "3",
  "n & (n - 1) removes the lowest 1 bit.",
  "Count how many times you can do n &= n - 1 before n is 0. (Or check n & 1 and shift right.)");
pq("counting-bits", "For every i from 0 to n, return how many 1 bits i has, ideally in O(n).", "[0, 1, 1]",
  "i has the same bits as i // 2, plus its own last bit.",
  "dp[0] = 0; dp[i] = dp[i >> 1] + (i & 1).");
pq("missing-number", "The array holds n distinct numbers from 0 to n. Return the one number in that range that's missing.", "2",
  "You know what the numbers 0 to n should add up to.",
  "Return n * (n + 1) // 2 - sum(nums). (XOR-ing all indices and values also works.)");
pq("happy-number", "Replace a number with the sum of the squares of its digits, again and again. It's happy if this reaches 1. Return whether n is happy.", "True",
  "If it never reaches 1, the sequence must loop forever.",
  "Keep a set of numbers seen. Repeat the digit-square sum; return True at 1 and False on a repeat. (Floyd's slow/fast pointers also work.)");
pq("rotate-image", "Rotate an n x n matrix 90 degrees clockwise, in place.", "[[7, 4, 1], [8, 5, 2], [9, 6, 3]]",
  "A rotation can be built from two simpler in-place steps: a flip and a transpose.",
  "Reverse the order of the rows, then transpose (swap m[i][j] with m[j][i] for j > i).");
pq("spiral-matrix", "Return every element of the matrix in spiral order: clockwise, starting top left and moving inward.", "[1, 2, 3, 6, 9, 8, 7, 4, 5]",
  "Walk the outer ring, then the next ring in, and so on.",
  "Keep top, bottom, left and right bounds. Read the top row, the right column, the bottom row and the left column, shrinking the matching bound after each, until they cross.");
pq("set-matrix-zeroes", "If a cell is 0, set its whole row and column to 0. Do it in place.", "[[1, 0, 1], [0, 0, 0], [1, 0, 1]]",
  "If you zero rows as you go, the new zeros spread too far. Record first, then change.",
  "Scan to collect the rows and columns that contain a 0, then zero them in a second pass. For O(1) space, use the first row and column as the markers.");
pq("powx-n", "Implement pow(x, n), x raised to the integer power n, which can be negative. It needs to be faster than n multiplications.", "1024.0",
  "x^n = (x^(n/2))^2, so you can halve the exponent each step.",
  "Recursively, or by squaring in a loop: square x and halve n, multiplying the result by x when n is odd. For a negative n, compute 1 / x^(-n).");
pq("reverse-integer", "Reverse the digits of a 32-bit signed integer, keeping its sign. Return 0 if the result doesn't fit in 32 bits.", "321",
  "Take the sign aside, then pop digits off the end and push them onto the result.",
  "Work with abs(x): rev = rev * 10 + x % 10, x //= 10. Put the sign back, and return 0 if the result is outside [-2^31, 2^31 - 1].");

// ---- 1-D DP ----
pq("climbing-stairs", "You climb 1 or 2 steps at a time. Return how many distinct ways there are to reach the top of n steps.", "2",
  "Your last move onto step n came from step n - 1 or from step n - 2.",
  "ways(n) = ways(n - 1) + ways(n - 2), with ways(1) = 1 and ways(2) = 2. Keep just the last two values.");
pq("min-cost-climbing-stairs", "cost[i] is what it costs to step on stair i, and you can then climb 1 or 2. Start at step 0 or 1 and return the cheapest way past the last stair.", "15",
  "The cheapest way to stand on step i depends on the cheapest ways to reach the two steps before it.",
  "dp[i] = cost[i] + min(dp[i - 1], dp[i - 2]). The answer is min(dp[n - 1], dp[n - 2]).");
pq("house-robber", "Each house holds some money, and you can't rob two houses next to each other. Return the most you can take.", "4",
  "At each house you either skip it, or rob it and add the best from two houses back.",
  "Keep two values, prev2 and prev1, and step: cur = max(prev1, prev2 + x).");
pq("coin-change", "Return the fewest coins needed to make the amount, with unlimited coins of each value, or -1 if it can't be made.", "3",
  "The best way to make amount a uses some last coin c, plus the best way to make a - c.",
  "dp[0] = 0 and every other dp[a] starts at infinity. For each a, dp[a] = min(dp[a - c] + 1) over coins c <= a. Return dp[amount], or -1 if it's still infinity.");
pq("house-robber-ii", "Like House Robber, but the houses form a circle, so the first and last houses are neighbours too.", "3",
  "The first and last houses can't both be robbed. Leave out one or the other and you have the straight-line problem.",
  "Answer = max(rob(nums[1:]), rob(nums[:-1])) using the House Robber function (with a special case for a single house).");
pq("longest-palindromic-substring", "Return the longest substring that reads the same forwards and backwards.", "'bab' (or 'aba')",
  "Every palindrome has a centre, either one character or the gap between two.",
  "For each of the 2n - 1 centres, expand outwards while the two ends match, and keep the longest span found.");
pq("decode-ways", "Letters map to numbers (A = 1 ... Z = 26). Count the ways a string of digits could be decoded back into letters.", "2",
  "The last letter used either one digit (1-9) or two digits (10-26).",
  "dp[i] = ways for the first i digits: add dp[i - 1] if s[i - 1] isn't '0', and dp[i - 2] if s[i - 2:i] is between 10 and 26. dp[0] = 1.");
pq("word-break", "Return true if the string can be split into a sequence of one or more words from the dictionary (words can be reused).", "True",
  "A prefix can be built if a shorter buildable prefix is followed by a dictionary word.",
  "dp[0] = True. dp[i] = True if some j < i has dp[j] and s[j:i] in the word set. Return dp[n].");
pq("longest-increasing-subsequence", "Return the length of the longest strictly increasing subsequence (the elements don't have to be next to each other).", "4",
  "For each possible length, keep the smallest value an increasing subsequence of that length can end with.",
  "Keep a list tails. For each x, binary search the first tail >= x and replace it, or append x if there's none. The answer is len(tails). O(n log n).");
pq("palindromic-substrings", "Count every substring that is a palindrome. The same text at different positions counts separately.", "3",
  "Each palindrome has a centre. Expanding from a centre finds every palindrome around it.",
  "For every centre (each character and each gap), expand while the ends match, adding one to the count at each step.");
pq("maximum-product-subarray", "Return the largest product of any non-empty contiguous subarray.", "6",
  "A negative number turns the smallest product into the largest, so track both.",
  "Keep hi and lo for the products ending here. For x: hi, lo = max(x, hi*x, lo*x), min(x, hi*x, lo*x). The answer is the largest hi seen.");
pq("partition-equal-subset-sum", "Return true if the array can be split into two groups with equal sums.", "True",
  "You need a subset that adds up to exactly half the total.",
  "If the total is odd, return False. Otherwise keep the set of reachable sums (starting at {0}), adding each number to every sum in it, and check whether total / 2 shows up.");

// ---- 2-D DP ----
pq("unique-paths", "A robot starts at the top-left of an m x n grid and only moves right or down. Count the distinct paths to the bottom-right.", "28",
  "You can only arrive at a cell from above or from the left.",
  "paths[r][c] = paths[r - 1][c] + paths[r][c - 1], with the first row and column all 1. One rolling row is enough.");
pq("longest-common-subsequence", "Return the length of the longest sequence of characters that appears, in order, in both strings (not necessarily next to each other).", "3",
  "Compare the two strings' last characters: they either match or one of them gets dropped.",
  "dp[i][j] for prefixes text1[:i] and text2[:j]: if the characters match, dp[i - 1][j - 1] + 1; else max(dp[i - 1][j], dp[i][j - 1]).");
pq("coin-change-ii", "Count the combinations of coins that make the amount, with unlimited coins of each value. Order doesn't matter.", "4",
  "To count combinations rather than orderings, decide coin by coin.",
  "dp[0] = 1. For each coin (outer loop), for a from coin to amount, dp[a] += dp[a - coin]. Return dp[amount].");
pq("target-sum", "Put a + or - in front of every number. Count the sign choices that make the expression equal the target.", "5",
  "After each number, many different running totals are possible. Count how many ways reach each one.",
  "Keep a dict {total: ways}, starting at {0: 1}. For each number, build a new dict adding ways to total + x and total - x. Return ways[target].");
pq("best-time-to-buy-and-sell-stock-with-cooldown", "Buy and sell as often as you like, holding at most one share, but after a sale you must wait a day before buying again. Return the maximum profit.", "3",
  "Each day you're in one of three states: holding a share, just sold, or resting with no share.",
  "Update together each day: hold = max(hold, rest - p); sold = hold + p; rest = max(rest, sold). Use the previous day's values. The answer is max(sold, rest).");
pq("edit-distance", "Return the fewest single-character inserts, deletes or replacements that turn word1 into word2.", "3",
  "Compare prefixes. If the last characters match there's no cost; otherwise the last edit was an insert, delete or replace.",
  "dp[i][j] = edits from word1[:i] to word2[:j]. Base cases: dp[i][0] = i, dp[0][j] = j. If they match, dp[i - 1][j - 1]; else 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]).");

// ---- FAANG Top 250, batch 1 ----
pq("palindrome-number", "Return true if the integer reads the same forwards and backwards. Negative numbers never do. Try it without turning the number into a string.", "True",
  "You can get digits off the end with % 10 and // 10. Reversing the whole number works, but you only need half of it.",
  "Build the reverse of the last half: while x > rev, move x's last digit onto rev. Then x == rev (even length) or x == rev // 10 (odd). Rule out negatives and numbers ending in 0 (except 0) first.");
pq("longest-common-prefix", "Return the longest string that every word in the list starts with, or '' if they share no first letter.", "'fl'",
  "The answer can't be longer than any single word, and it's a prefix of the first word.",
  "Take the first word as the prefix. For each other word, chop the prefix's last character until the word starts with it. (Or compare column by column.)");
pq("merge-sorted-array", "nums1 has room for m + n numbers: m real ones followed by n zeros. Merge the sorted nums2 into nums1, in place, so all of nums1 is sorted.", "[1, 2, 2, 3, 5, 6]",
  "Filling from the front overwrites values you still need. The end of nums1 is empty space.",
  "Three pointers: i at nums1's last real value, j at nums2's last value, k at the very end. Put the bigger of nums1[i] and nums2[j] at k and step back. Stop when nums2 is used up.");
pq("3sum-closest", "Find three numbers whose sum is as close as possible to the target, and return that sum. There's exactly one closest answer.", "2",
  "This is 3Sum, but instead of finding an exact zero you're tracking the nearest sum.",
  "Sort. For each i, run two pointers on the rest: update the best sum when |sum - target| shrinks, then move left up if the sum is too small, right down if too big. Return at once on an exact match.");
pq("4sum", "Return every unique group of four values in the array that adds up to the target.", "[[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]]",
  "Fix two numbers and the rest is Two Sum on a sorted array, just like 3Sum fixes one.",
  "Sort. Two nested loops pick a and b (skip repeated values); two pointers search the rest for target - a - b. After a match, skip repeats on the left pointer too.");
pq("next-permutation", "Rearrange the numbers, in place, into the next larger ordering in dictionary order. If they're already the largest ordering, wrap around to the smallest (sorted ascending).", "[1, 3, 2]",
  "The part of the array that changes is a tail that is in decreasing order: it's already as large as it can be.",
  "Find the rightmost i with nums[i] < nums[i + 1]. If there is one, swap nums[i] with the rightmost value larger than it. Then reverse everything after i.");
pq("max-consecutive-ones-iii", "The array holds 0s and 1s. You may flip at most k zeros to ones. Return the length of the longest run of 1s you can get.", "6",
  "Flipping zeros inside a window is the same as allowing a window with at most k zeros.",
  "Sliding window: grow the right edge and count zeros. While there are more than k, move the left edge forward (uncounting zeros). The answer is the widest window seen.");
pq("search-insert-position", "Given a sorted array of distinct values and a target, return the target's index, or the index where it would be inserted to keep the order. It must run in O(log n).", "2",
  "Whether or not the target is there, you want the first position whose value is at least the target.",
  "Lower-bound binary search with lo = 0, hi = len(nums): if nums[mid] < target set lo = mid + 1, else hi = mid. Return lo.");
pq("find-first-and-last-position-of-element-in-sorted-array", "Given a sorted array, return the first and last index of the target, or [-1, -1] if it isn't there. It must run in O(log n).", "[3, 4]",
  "Finding the target once and then scanning outwards is O(n) when the target repeats a lot. Search for each end separately.",
  "Write one lower-bound search (first index >= x). The first position is lower(target); if that isn't the target, return [-1, -1]. The last is lower(target + 1) - 1.");
pq("find-peak-element", "A peak is a value strictly bigger than its neighbours, treating outside the array as minus infinity. Return the index of any peak, in O(log n). Neighbours are never equal.", "2",
  "If the next value is bigger, walking uphill to the right must reach a peak eventually.",
  "Binary search: if nums[mid] < nums[mid + 1], a peak is right of mid (lo = mid + 1); otherwise it's at mid or to its left (hi = mid). Return lo. Any peak is accepted by the tests.");
pq("roman-to-integer", "Convert a Roman numeral (I, V, X, L, C, D, M) to an integer. A smaller symbol before a larger one is subtracted, as in IV = 4 and CM = 900.", "3",
  "Most symbols just add their value. The exceptions are exactly the ones followed by something bigger.",
  "Map each symbol to its value. Walk the string: if the next symbol is larger, subtract this one; otherwise add it.");

// ---- FAANG Top 250, batch 2 ----
pq("remove-element", "Remove every copy of val from the array in place. Return k, the number of values left; the first k slots must hold them, in any order.", "2 (nums starts [2, 2])",
  "You don't have to delete anything: just make sure the values you keep end up at the front.",
  "Use a write pointer k. For each value that isn't val, write it at nums[k] and move k on. Return k.");
pq("merge-strings-alternately", "Merge two words by taking letters in turn, starting with word1. When one word runs out, add the rest of the other.", "'apbqcr'",
  "Walk both words with the same index.",
  "Loop i up to the longer length; add word1[i] if it exists, then word2[i] if it exists. Join at the end.");
pq("squares-of-a-sorted-array", "Given a sorted array (it may include negatives), return the squares of each number, also sorted. Try for O(n).", "[0, 1, 9, 16, 100]",
  "Negatives make the smallest squares sit in the middle. The largest square is always at one of the two ends.",
  "Two pointers at both ends. Compare absolute values, put the bigger square at the back of the result, move that pointer inward, and fill the result from right to left.");
pq("intersection-of-two-arrays", "Return the values that appear in both arrays, each listed once, in any order.", "[2]",
  "Duplicates don't matter and order doesn't matter. Which structure ignores both?",
  "Turn both arrays into sets and return their intersection as a list.");
pq("find-the-index-of-the-first-occurrence-in-a-string", "Return the index where needle first appears in haystack, or -1 if it doesn't appear.", "0",
  "Only start positions up to len(haystack) - len(needle) can work.",
  "For each start i in that range, compare haystack[i:i + len(needle)] with needle and return i on a match. (KMP gives O(n + m) if asked.)");
pq("first-missing-positive", "Return the smallest positive integer that isn't in the unsorted array, in O(n) time and O(1) extra space.", "3",
  "With n numbers, the answer is between 1 and n + 1. Values outside 1..n can be ignored.",
  "Cyclic sort: swap each value v in 1..n into index v - 1 (while it isn't already there). Then scan: the first index i with nums[i] != i + 1 gives i + 1; otherwise the answer is n + 1.");
pq("max-consecutive-ones", "Return the length of the longest run of 1s in a binary array.", "3",
  "You only need the length of the current run and the best so far.",
  "Scan once: add one to the run on a 1, reset it to 0 on a 0, and keep the maximum.");
pq("minimum-size-subarray-sum", "Given positive integers and a target, return the length of the shortest contiguous subarray whose sum is at least target, or 0 if there's none.", "2",
  "Because every number is positive, growing a window only increases its sum and shrinking only decreases it.",
  "Grow the right edge, adding to the sum. While the sum is >= target, record the length and remove nums[left] from the left. Return 0 if nothing was recorded.");
pq("fruit-into-baskets", "Walk along a row of trees picking one fruit from each, with two baskets that each hold one fruit type. Return the most fruit you can pick: the longest stretch with at most two types.", "3",
  "This is 'longest window with at most 2 distinct values'.",
  "Keep a count of each type in the window. Add the right fruit; while there are more than 2 types, remove fruits from the left (deleting types that hit 0). Track the widest window.");
pq("next-greater-element-i", "nums1 is a subset of nums2. For each value in nums1, find the first larger value to its right in nums2, or -1 if there isn't one.", "[-1, 3, -1]",
  "Work out the next greater element for every value of nums2 once, then answer nums1 from that.",
  "Scan nums2 with a stack of values still waiting. When x is bigger than the top, pop it and record x as its answer. Then map nums1 through the dict, defaulting to -1.");
pq("sqrtx", "Return the square root of a non-negative integer, rounded down, without using a built-in power or sqrt function.", "2",
  "The answer is the largest r with r * r <= x, and that condition flips only once as r grows.",
  "Binary search r in [0, x]. Round mid up ((lo + hi + 1) // 2) so lo = mid makes progress; keep mid if mid * mid <= x, otherwise go below it.");
pq("kth-missing-positive-number", "Given a strictly increasing array of positive integers, return the k-th positive integer that's missing from it.", "9",
  "At index i, arr[i] - (i + 1) numbers are missing before arr[i]. That count only grows.",
  "Binary search for the first index where the missing count is >= k. If that index is lo, the answer is lo + k.");
pq("single-element-in-a-sorted-array", "In a sorted array, every value appears twice except one. Find that one in O(log n) time and O(1) space.", "2",
  "Look at where pairs start. Before the single element they start at even indices; after it, at odd indices.",
  "Binary search with mid forced to an even index. If nums[mid] == nums[mid + 1], the single is after this pair (lo = mid + 2); otherwise it's at mid or before (hi = mid).");
pq("random-pick-with-weight", "Design a class built from weights w where pickIndex() returns index i at random with probability w[i] / sum(w). The tests make 3,000 picks and check the share each index gets.", "",
  "Lay the weights end to end on a number line. A random point on the line lands in index i's stretch with exactly the right probability.",
  "Store prefix sums in __init__. In pickIndex, take r = random.randint(1, total) and binary search (bisect_left) for the first prefix sum >= r.");
pq("palindrome-linked-list", "Return true if the linked list's values read the same forwards and backwards. Can you do it in O(1) extra space?", "True",
  "Copying the values into a list works but uses O(n) space. Can you compare the first half with the second half reversed?",
  "Find the middle with slow and fast pointers, reverse the list from the middle, then walk from the head and from the reversed half comparing values.");
pq("find-the-duplicate-number", "The array has n + 1 numbers, each between 1 and n, so at least one repeats; exactly one value does. Find it without changing the array and with O(1) extra space.", "2",
  "Think of each index as a node pointing to nums[i]. A repeated value means two nodes point to the same place: a cycle.",
  "Floyd's cycle detection: move slow one step and fast two steps until they meet. Then restart slow from the beginning and step both one at a time; where they meet is the duplicate.");
pq("lowest-common-ancestor-of-a-binary-tree", "In a binary tree (not a search tree), return the lowest node that has both p and q as descendants. A node counts as its own descendant.", "3",
  "Without BST ordering, ask each subtree: did you find p or q?",
  "Recurse: return the node itself if it's None, p or q. Otherwise recurse left and right. If both sides return a node, this is the LCA; otherwise return the side that isn't None.");
pq("best-time-to-buy-and-sell-stock-ii", "You may buy and sell the stock as many times as you like, holding at most one share at a time. Return the maximum profit.", "7",
  "Any rising run of prices can be split into day-to-day gains.",
  "Add up every positive daily change: profit += max(0, prices[i] - prices[i - 1]).");
pq("power-of-two", "Return true if n is a power of two (1, 2, 4, 8, ...).", "True",
  "Look at the binary form of a power of two.",
  "A power of two has exactly one 1 bit, so it's n > 0 and n & (n - 1) == 0.");
pq("fibonacci-number", "Return the n-th Fibonacci number, where F(0) = 0, F(1) = 1 and F(n) = F(n - 1) + F(n - 2).", "1",
  "Plain recursion recomputes the same values again and again.",
  "Keep the last two values a, b and move forward n times: a, b = b, a + b. Return a.");

// ---- FAANG Top 250, batch 3 ----
pq("check-if-array-is-sorted-and-rotated", "Return true if the array could be a non-decreasing array that was rotated some number of times (including zero). Duplicates are allowed.", "True",
  "In a rotated sorted array, the values only drop once: where the end of the original array meets its start.",
  "Count indices i where nums[i] > nums[(i + 1) % n], including the wrap from last to first. It's valid if there's at most one such drop.");
pq("first-unique-character-in-a-string", "Return the index of the first character that appears only once in the string, or -1 if every character repeats.", "0",
  "Checking each character with s.count() is O(n^2). Count everything once first.",
  "Count the characters (Counter or a 26-slot array), then scan the string again and return the first index whose count is 1.");
pq("rotate-string", "Return true if s can become goal by repeatedly moving its first character to the end.", "True",
  "Write s twice in a row. Every rotation of s appears somewhere in that doubled string.",
  "Return len(s) == len(goal) and goal in s + s.");
pq("length-of-last-word", "Return the length of the last word in a string of words and spaces. There may be extra spaces anywhere, including at the end.", "5",
  "Start from the end, but trailing spaces don't count.",
  "Move an index back past trailing spaces, then count characters until you reach a space or the start. (Or len(s.split()[-1]).)");
pq("isomorphic-strings", "Two strings are isomorphic if you can replace s's characters to get t, where each character always maps to the same one and no two characters map to the same one. Return whether they are.", "True",
  "A one-way map isn't enough: 'ab' -> 'cc' maps consistently but two letters share a target.",
  "Keep two dicts, s -> t and t -> s. For each pair (a, b), if either dict already maps to something else, return False; otherwise record both directions.");
pq("zigzag-conversion", "Write the string in a zigzag down and up across numRows rows, then read the rows left to right, top to bottom. Return that string.", "'PAHNAPLSIIGYIR'",
  "You don't need a grid: you only need to know which row each character lands in.",
  "Keep a list per row and a row index that moves down then up, flipping direction at the top and bottom rows. Append each character to its row, then join all rows. One row returns s.");
pq("valid-palindrome-ii", "Return true if the string can be a palindrome after deleting at most one character.", "True",
  "Compare from both ends as usual. Only the first mismatch matters.",
  "Two pointers. On a mismatch at (lo, hi), return whether s[lo + 1..hi] or s[lo..hi - 1] is a palindrome. If you reach the middle, it's True.");
pq("reverse-string", "Reverse a list of characters in place, with O(1) extra memory.", "['o', 'l', 'l', 'e', 'h']",
  "Swap from the outside in.",
  "Two pointers at both ends: swap, move both inward, stop when they meet.");
pq("remove-duplicates-from-sorted-array-ii", "The array is sorted. Remove extra copies in place so each value appears at most twice, and return the number of values kept (they go at the front).", "5 (nums starts [1, 1, 2, 2, 3])",
  "A value can be kept if it differs from the value two places back in the part you've kept.",
  "Write pointer k. For each x: if k < 2 or x != nums[k - 2], write nums[k] = x and add one to k. Return k.");
pq("decode-string", "Decode a string where k[text] means text repeated k times. Brackets can be nested.", "'aaabcbc'",
  "Nested brackets suggest a stack: when one closes you need the text and count from just before it opened.",
  "Track the current string and number. On '[' push (current string, number) and reset both. On ']' pop (prev, k) and set current = prev + current * k. Digits build the number; letters extend the string.");
pq("next-greater-element-ii", "For each element of a circular array, return the next larger value going forward (wrapping around to the start), or -1 if there isn't one.", "[2, -1, 2]",
  "This is Next Greater Element with a wrap-around. Going round the array twice covers it.",
  "Loop i from 0 to 2n - 1 using nums[i % n]. Keep a stack of indices waiting for a bigger value: pop and answer them while the current value is bigger. Only push indices in the first pass.");
pq("longest-valid-parentheses", "Return the length of the longest substring of well-formed parentheses.", "2",
  "A stack of indices can tell you where the current valid run started.",
  "Start the stack with -1. Push the index of each '('. On ')', pop; if the stack is now empty push this index as the new base, otherwise the run length is i - stack[-1]. Track the maximum.");
pq("search-a-2d-matrix-ii", "Every row is sorted left to right and every column top to bottom. Return true if the target is in the matrix.", "True",
  "Look at the top-right corner: everything to its left is smaller and everything below is bigger.",
  "Start at the top-right. If the value equals the target return True; if it's too big move left; if too small move down. Stop when you leave the matrix.");
pq("capacity-to-ship-packages-within-d-days", "Packages must ship in the given order, one day's load at most the ship's capacity. Return the smallest capacity that ships everything within days days.", "15",
  "If a capacity works, any bigger capacity also works. That shape can be binary searched.",
  "Binary search capacity between max(weights) and sum(weights). For each guess, load packages greedily and count days; keep the smallest capacity that needs at most days days.");
pq("split-array-largest-sum", "Split the array into k non-empty contiguous parts so that the largest part sum is as small as possible. Return that sum.", "18",
  "Guess the answer instead: can you split so every part's sum is at most X? Bigger X is always easier.",
  "Binary search X between max(nums) and sum(nums). Check a guess greedily: start a new part whenever adding the next number would go over X, and see whether you used at most k parts.");
pq("rotate-list", "Rotate a linked list to the right by k places, moving the last k nodes to the front. k can be much larger than the list's length.", "[4, 5, 1, 2, 3]",
  "Rotating by the length changes nothing, so only k % length matters.",
  "Find the length and the tail. Link the tail to the head to make a ring, walk length - k % length - 1 steps from the head to the new tail, and cut the ring after it.");
pq("sort-list", "Sort a linked list in ascending order, in O(n log n) time.", "[1, 2, 3, 4]",
  "Merge sort works well on linked lists: splitting and merging need no extra arrays.",
  "Find the middle with slow and fast pointers and cut the list in two. Sort both halves recursively, then merge them as in Merge Two Sorted Lists.");
pq("reverse-nodes-in-k-group", "Reverse the list's nodes k at a time and return the new head. A final group shorter than k stays as it is. Change links, not values.", "[2, 1, 4, 3, 5]",
  "Handle one group at a time, and remember the node just before it so you can relink.",
  "From a dummy node, check that k nodes remain. Reverse those k (pointing the first at the node after the group), connect the node before the group to the new first node, then move on from the group's new tail.");
pq("binary-tree-inorder-traversal", "Return the tree's values in inorder: left subtree, then the node, then the right subtree.", "[1, 3, 2]",
  "The recursive version is three lines. The iterative one needs a stack to remember where to come back to.",
  "Iterative: while there's a node or the stack isn't empty, push nodes going left as far as possible, pop one, record its value, then move to its right child.");
pq("symmetric-tree", "Return true if the tree is a mirror image of itself around its centre.", "True",
  "Compare the left subtree with the right subtree, mirrored.",
  "mirror(a, b): both None is True; one None is False; otherwise the values must match and mirror(a.left, b.right) and mirror(a.right, b.left). Call it on root.left, root.right.");
pq("all-nodes-distance-k-in-binary-tree", "Return the values of every node exactly k edges away from the target node, in any order.", "[7, 4, 1]",
  "Distance can go up through parents as well as down. Tree nodes don't know their parents.",
  "First record each node's parent with a DFS. Then BFS from target over left, right and parent links, with a visited set, for k levels. The queue then holds the answer.");
pq("meeting-rooms-ii", "Given meeting time intervals [start, end], return the fewest conference rooms needed so no two overlapping meetings share a room. (LeetCode Premium.)", "2",
  "Process meetings by start time. When one starts, the question is whether any room has already been freed.",
  "Sort by start. Keep a min-heap of end times. If the earliest end is <= this start, reuse that room (replace its end); otherwise add a room. The heap's size is the answer.");
pq("reorganize-string", "Rearrange the letters so that no two adjacent letters are the same, and return any such arrangement, or '' if it's impossible.", "'aba'",
  "The most frequent letter is the hard one to place. If it appears more than (n + 1) / 2 times, it can't be done.",
  "Max-heap of (count, letter). Each step pop the most frequent letter, append it, then push back the letter you held from the previous step (if any is left) and hold this one. If you finish with fewer than n letters, return ''.");
pq("subsets-ii", "Return every subset of an array that may contain duplicates, with no duplicate subsets.", "[[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]",
  "Sort first so equal values sit together. Duplicate subsets come from picking a different copy of the same value at the same step.",
  "Backtrack(start, path): record path; for i from start, skip i if i > start and nums[i] == nums[i - 1]; otherwise add nums[i], recurse with i + 1, remove it.");
pq("largest-number", "Arrange the non-negative integers so that they form the largest possible number, and return it as a string.", "'210'",
  "Sorting by value doesn't work: '9' should come before '34'. Compare the two possible orders of a pair.",
  "Sort the numbers as strings with a comparator: a goes first if a + b > b + a. Join them, and return '0' if the result starts with '0'.");
pq("integer-to-roman", "Convert an integer from 1 to 3,999 to a Roman numeral, using subtractive forms like IV, IX, XL, XC, CD and CM.", "'MMMDCCXLIX'",
  "Treat the subtractive pairs (900, 400, 90, 40, 9, 4) as symbols of their own.",
  "List the 13 values from 1000 down to 1 with their symbols. For each, while num >= value, append the symbol and subtract.");
pq("add-binary", "Given two binary strings, return their sum as a binary string.", "'100'",
  "Do grade-school addition from the right, in base 2.",
  "Walk both strings from the end with a carry. Each step the digit is total % 2 and the carry total // 2. Continue while either string or the carry remains, then reverse.");
pq("pascals-triangle", "Return the first numRows rows of Pascal's triangle, where each value is the sum of the two values above it.", "[[1]]",
  "Each row can be built from the one before it.",
  "Start with [[1]]. For each new row: 1, then prev[i] + prev[i + 1] for each neighbouring pair, then 1.");
pq("regular-expression-matching", "Implement matching where '.' matches any single character and '*' matches zero or more of the element before it. The whole string must match the whole pattern.", "False",
  "The tricky case is 'x*': it can match nothing, or one character and still be available for more.",
  "dp(i, j) = does s[i:] match p[j:]. If p[j + 1] is '*': dp(i, j + 2) (skip it) or (first chars match and dp(i + 1, j)). Otherwise: first chars match and dp(i + 1, j + 1). Memoise it.");

// ---- FAANG Top 250, batch 4 ----
pq("contains-duplicate-ii", "Return true if some value appears twice at indices i and j with |i - j| <= k.", "True",
  "For each value you only care about where you saw it most recently.",
  "Keep a dict of value -> last index. If the value was seen and i - last[value] <= k, return True; then update last[value] = i.");
pq("find-all-anagrams-in-a-string", "Return every start index in s where a rearrangement of p begins, in any order.", "[0, 6]",
  "Every candidate is a window of exactly len(p) letters, and the windows overlap almost entirely.",
  "Count p's letters. Slide a window of len(p) over s, adding the entering letter and removing the leaving one, and record the start whenever the window's counts equal p's.");
pq("set-mismatch", "The array should hold 1..n once each, but one number was replaced by a copy of another. Return [the duplicate, the missing number].", "[2, 3]",
  "Counting how often each value appears tells you both answers at once.",
  "Count occurrences of 1..n in an array. The value with count 2 is the duplicate; the one with count 0 is missing.");
pq("ransom-note", "Return true if ransomNote can be written using letters from magazine, each magazine letter used at most once.", "False",
  "Only the number of each letter matters.",
  "Count the magazine's letters. For each letter of the note, take one away; if any count goes below zero, return False.");
pq("can-make-arithmetic-progression-from-sequence", "Return true if the numbers can be rearranged so that every pair of neighbours has the same difference.", "True",
  "If it's possible, the sorted order is one such arrangement.",
  "Sort, take d = arr[1] - arr[0], and check that every neighbouring difference equals d. (An O(n) version uses the min, max and a set.)");
pq("majority-element-ii", "Return every value that appears more than n / 3 times, in any order.", "[3]",
  "At most two values can pass the n / 3 bar. Extend the Boyer-Moore voting idea to two candidates.",
  "Keep two candidates with counts: match one to add to its count, fill an empty slot, or subtract from both. Then count the two candidates for real and keep those above n // 3.");
pq("sort-an-array", "Sort an array of integers in ascending order in O(n log n) without a built-in sort.", "[1, 2, 3, 5]",
  "Pick an O(n log n) sort you can write from memory: merge sort or heap sort.",
  "Merge sort: split the list in half, sort each half recursively, then merge the two sorted halves with two pointers.");
pq("subarray-sums-divisible-by-k", "Count the non-empty contiguous subarrays whose sum is divisible by k. Numbers can be negative.", "7",
  "A subarray's sum is a difference of two prefix sums. It's divisible by k when they leave the same remainder.",
  "Keep a running prefix % k (Python's % is never negative) and a count of each remainder, starting with {0: 1}. Add count[remainder] to the answer before recording it.");
pq("contiguous-array", "In a binary array, return the length of the longest contiguous subarray with an equal number of 0s and 1s.", "2",
  "Count a 0 as -1 and a 1 as +1. Equal numbers then means the subarray sums to 0.",
  "Keep a running sum and the first index where each sum appeared (sum 0 at index -1). When a sum repeats, i - first[sum] is a balanced subarray.");
pq("reverse-pairs", "Count pairs i < j with nums[i] > 2 * nums[j].", "2",
  "Checking every pair is O(n^2). Merge sort lets you count across the two halves while they're sorted.",
  "In merge sort, after sorting both halves, walk the left half with a pointer into the right half that moves while left > 2 * right[j]; add j for each left value. Then merge as usual.");
pq("reverse-vowels-of-a-string", "Reverse only the vowels (a, e, i, o, u, upper and lower case) of the string, leaving other characters in place.", "'AceCreIm'",
  "This is Reverse String, but the pointers skip anything that isn't a vowel.",
  "Turn the string into a list. Move lo right and hi left until both point at vowels, swap, move both, and repeat until they cross.");
pq("reverse-words-in-a-string", "Reverse the order of the words. The result should have single spaces between words and none at the ends.", "'blue is sky the'",
  "Splitting on whitespace already removes the extra spaces.",
  "Return ' '.join(reversed(s.split())). For an in-place version: reverse the whole string, then reverse each word.");
pq("string-compression", "Compress a list of characters in place: each run becomes the character followed by its count (if the count is above 1), written digit by digit. Return the new length.", "6 (chars starts ['a', '2', 'b', '2', 'c', '3'])",
  "The compressed form is never longer than the part already read, so you can write over the same list.",
  "A read pointer finds the end of each run; a write pointer writes the character, then each digit of the run length when it's more than 1. Return the write pointer.");
pq("asteroid-collision", "Positive asteroids move right, negative ones left, all at the same speed. When two meet the smaller explodes (both if equal). Return the asteroids left after all collisions.", "[5, 10]",
  "A collision only happens when a left-moving asteroid meets right-moving ones before it. The most recent survivor is the first it hits.",
  "Use a stack. For a negative asteroid, while the top is positive and smaller, pop it; if the top is equal, pop it and drop this one; if the top is bigger, drop this one. Otherwise push.");
pq("basic-calculator", "Evaluate a string with integers, +, -, parentheses and spaces. Minus can also be a unary sign. Don't use eval.", "2",
  "Without * and /, the whole expression is a sum of signed numbers. Parentheses only change the signs.",
  "Keep a result, the current number and its sign. On + or -, add sign * number to the result. On '(', push (result, sign) and reset; on ')', finish the inner result and combine: prev + prevSign * result.");
pq("first-bad-version", "Versions 1..n were built in order, and once one is bad every later one is too. Using the provided isBadVersion(version), find the first bad version with as few calls as possible. (In the tests, the second number is that first bad version; your code only sees n.)", "4",
  "isBadVersion is False, False, ..., then True from some point on. That's a binary search.",
  "lo = 1, hi = n. While lo < hi: if isBadVersion(mid) set hi = mid, else lo = mid + 1. Return lo.");
pq("remove-duplicates-from-sorted-list", "Delete the duplicates from a sorted linked list so each value appears once, and return the list.", "[1, 2]",
  "In a sorted list, duplicates are next to each other.",
  "Walk the list. While the next node has the same value as the current one, skip it (cur.next = cur.next.next); otherwise move on.");
pq("odd-even-linked-list", "Group the nodes at odd positions (1st, 3rd, ...) first, followed by the nodes at even positions, keeping each group's order. Use O(1) extra space.", "[1, 3, 5, 2, 4]",
  "Build the odd chain and the even chain at the same time, then join them.",
  "odd = head, even = head.next, remember even's head. While even and even.next: odd.next = even.next, advance odd; even.next = odd.next, advance even. Finally odd.next = evenHead.");
pq("linked-list-cycle-ii", "Return the node where the cycle begins, or None if there's no cycle. Try O(1) extra space.", "2 (the node with value 2)",
  "Floyd's slow and fast pointers find a meeting point inside the cycle. Some arithmetic shows the start is as far from the head as from that meeting point.",
  "Run slow and fast until they meet (or fast reaches the end: no cycle). Then move one pointer from the head and one from the meeting point, one step each; they meet at the cycle's start.");
pq("convert-sorted-array-to-binary-search-tree", "Turn a sorted array into a height-balanced binary search tree (every node's subtrees differ in height by at most 1). Any such tree is accepted.", "[0, -10, 5, None, -3, None, 9] (any height-balanced BST is accepted)",
  "Picking the middle value as the root splits the rest evenly between the two sides.",
  "build(lo, hi): if lo > hi return None; mid = (lo + hi) // 2; return TreeNode(nums[mid], build(lo, mid - 1), build(mid + 1, hi)).");
pq("binary-tree-zigzag-level-order-traversal", "Return the tree's values level by level, alternating direction: left to right, then right to left, and so on.", "[[3], [20, 9], [15, 7]]",
  "It's ordinary level-order traversal; only the order you record each level in changes.",
  "BFS one level at a time, collecting the level's values, and reverse every other level before adding it.");
pq("vertical-order-traversal-of-a-binary-tree", "Give the root column 0; a left child is one column left and one row down, a right child one column right. Return the values column by column, top to bottom, with ties at the same row and column ordered by value.", "[[9], [3, 15], [20], [7]]",
  "Every node has a (column, row) position. Sorting by column, then row, then value gives exactly the order wanted.",
  "DFS recording (col, row, val) for each node. Sort the list, then walk it, starting a new group whenever the column changes.");
pq("combinations", "Return every combination of k numbers chosen from 1..n.", "[[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]",
  "Choose numbers in increasing order so each combination is built only once.",
  "Backtrack(start, path): if path has k numbers record it; otherwise for x from start to n, add x, recurse from x + 1, remove x.");
pq("number-of-provinces", "isConnected[i][j] = 1 means cities i and j are directly connected. A province is a group of cities connected directly or indirectly. Return the number of provinces.", "2",
  "A province is a connected component of the graph.",
  "Keep a visited list. For each unvisited city, start a DFS (or BFS) marking every city it reaches, and add one to the count. Union-Find works too.");
pq("valid-parenthesis-string", "The string holds '(', ')' and '*', where '*' can be '(', ')' or nothing. Return true if some choice makes the brackets valid.", "True",
  "Instead of trying every choice for each '*', track the range of how many brackets could be open.",
  "Keep lo and hi, the fewest and most open brackets possible. '(' adds 1 to both, ')' subtracts 1 from both, '*' does lo - 1 and hi + 1. Fail if hi < 0, clamp lo at 0, and succeed if lo == 0 at the end.");
pq("can-place-flowers", "Flowers can't be planted in neighbouring plots. Given a flowerbed of 0s (empty) and 1s, return true if n new flowers can be planted.", "True",
  "Planting as early as possible never hurts: it only blocks the plot after it.",
  "Scan the plots; whenever a plot and both its neighbours (treating the ends as empty) are 0, plant there and reduce n. Return n <= 0.");
pq("assign-cookies", "Child i is happy with a cookie of size at least g[i]; each child gets at most one cookie. Return the most children you can make happy.", "1",
  "Don't waste a big cookie on a child a small cookie would satisfy.",
  "Sort both lists. Go through the cookies from smallest; if the current cookie satisfies the least greedy unhappy child, give it and move to the next child.");
pq("angle-between-hands-of-a-clock", "Return the smaller angle, in degrees, between the hour and minute hands at the given time.", "165.0",
  "The hour hand moves too: half a degree for every minute.",
  "minute angle = 6 * minutes; hour angle = 30 * (hour % 12) + 0.5 * minutes. Take the absolute difference d and return min(d, 360 - d).");
pq("divide-two-integers", "Divide two 32-bit integers without using *, / or %, truncating toward zero. If the result overflows, return 2^31 - 1.", "3",
  "Subtracting the divisor one at a time is far too slow for 2^31 / 1. Subtract big doubled chunks of it instead.",
  "Work with absolute values. While a >= b, double b (shift left) as long as it still fits, subtract that chunk and add the matching power of two to the quotient. Fix the sign and clamp the -2^31 / -1 case.");
pq("string-to-integer-atoi", "Implement atoi: skip leading spaces, read an optional + or -, then read digits until something else. Clamp the result to the 32-bit range; return 0 if there are no digits.", "42",
  "Go through it as a fixed sequence of steps, and only check the range at the end (Python ints don't overflow).",
  "Index past the spaces; read a sign if present; build the number from digits while they last. Return max(-2^31, min(2^31 - 1, sign * number)).");
pq("fizz-buzz", "Return the strings for 1..n: 'FizzBuzz' for multiples of 15, 'Fizz' for multiples of 3, 'Buzz' for multiples of 5, otherwise the number itself.", "['1', '2', 'Fizz']",
  "Check 15 before 3 and 5, otherwise it never gets a chance.",
  "Loop i from 1 to n with if/elif for i % 15, i % 3, i % 5, else str(i).");
pq("add-digits", "Keep adding a number's digits until one digit is left, and return it. Can you do it in O(1)?", "2",
  "Adding the digits doesn't change the remainder mod 9.",
  "The digital root is 0 for 0, otherwise 1 + (num - 1) % 9.");
pq("burst-balloons", "Bursting balloon i earns nums[i - 1] * nums[i] * nums[i + 1] from its current neighbours (missing neighbours count as 1). Return the most coins you can earn by bursting them all.", "167",
  "Thinking about the first balloon to burst gets messy, because neighbours change. Think about the last balloon to burst in a range instead.",
  "Pad with 1 at both ends. dp[l][r] = the best for the balloons strictly between l and r = max over k of dp[l][k] + dp[k][r] + a[l] * a[k] * a[r]. Fill by increasing length.");
pq("predict-the-winner", "Two players take turns taking a number from either end of the array; both play optimally. Return true if player 1 ends with at least as many points as player 2.", "False",
  "Track the score difference rather than both scores: what you take minus the best the opponent can do on what's left.",
  "diff(i, j) = max(nums[i] - diff(i + 1, j), nums[j] - diff(i, j - 1)), with diff = 0 for an empty range. Memoise it and return diff(0, n - 1) >= 0.");

// ---- FAANG Top 250, batch 5 ----
pq("range-sum-query-immutable", "Design NumArray(nums) with sumRange(left, right), the sum of nums[left..right] inclusive. It will be called many times, so make each call fast.", "",
  "Summing the range on every call is O(n) per query. Do the work once up front.",
  "Store prefix sums with a leading 0: prefix[i] = sum of the first i numbers. Then sumRange(l, r) = prefix[r + 1] - prefix[l].");
pq("find-the-highest-altitude", "A biker starts at altitude 0; gain[i] is the change between points i and i + 1. Return the highest altitude reached.", "1",
  "The altitude at each point is a running total of the gains.",
  "Keep a running altitude starting at 0 and the maximum seen (which starts at 0 too).");
pq("find-pivot-index", "Return the leftmost index where the sum of everything to its left equals the sum of everything to its right, or -1.", "3",
  "Once you know the total, the right-hand sum follows from the left-hand sum.",
  "Compute the total. Walk with a running left sum: if left == total - left - nums[i], return i; then add nums[i] to left.");
pq("left-and-right-sum-differences", "Return an array where answer[i] = |sum of the values left of i - sum of the values right of i|.", "[15, 1, 11, 22]",
  "Same trick as Find Pivot Index: the right sum is total - left - nums[i].",
  "Compute the total, walk with a running left sum, and append abs(left - (total - left - x)) for each x.");
pq("rank-transform-of-an-array", "Replace each value with its rank: 1 for the smallest, equal values get equal ranks, and ranks have no gaps.", "[4, 1, 2, 3]",
  "The rank of a value is its position among the distinct values, sorted.",
  "Sort set(arr), map each value to its index + 1, then translate arr through that dict.");
pq("number-of-strings-that-appear-as-substrings-in-word", "Count how many strings in patterns appear as substrings of word (repeated patterns count each time).", "3",
  "Python's in operator already checks for a substring.",
  "Return the number of patterns p with p in word.");
pq("insert-delete-getrandom-o1", "Design RandomizedSet with insert(val) and remove(val) (each returning whether it changed the set) and getRandom() returning a random member, all in average O(1). The tests check getRandom only returns members, spread evenly.", "",
  "A list gives O(1) random picks, a dict gives O(1) lookup. Removing from the middle of a list is the slow part.",
  "Keep a list of values and a dict value -> index. To remove, move the last value into the removed value's slot (update its index), then pop the end. getRandom is random.choice(list).");
pq("count-subarrays-with-majority-element-i", "Return how many subarrays have target as their majority element: it appears in strictly more than half of the subarray's positions.", "5",
  "Score the target as +1 and anything else as -1. Then target is the majority exactly when the subarray's score is positive.",
  "With n up to 1,000, O(n^2) works: for each start, extend the end while keeping the running score, and count each end where the score is > 0.");
pq("minimum-moves-to-make-array-complementary", "In one move you can change any number to a value from 1 to limit. Make nums[i] + nums[n - 1 - i] the same for every i using as few moves as possible.", "1",
  "Try every possible target sum T from 2 to 2 * limit. For a pair (a, b), T costs 0, 1 or 2 moves depending on where it falls.",
  "For a pair with a <= b: 0 moves at T = a + b, 1 move for T in [a + 1, b + limit], 2 otherwise. Add those ranges into a difference array, sweep T, and take the smallest total.");
pq("is-subsequence", "Return true if s can be made by deleting some characters of t without reordering the rest.", "True",
  "Match s's characters greedily in order as you walk t.",
  "Walk t with a pointer i into s; whenever t's character equals s[i], move i on. s is a subsequence if i reaches len(s).");
pq("rearrange-array-elements-by-sign", "The array has equal numbers of positive and negative values. Rearrange it to alternate positive, negative, positive, ..., keeping each sign's original order.", "[3, -2, 1, -5, 2, -4]",
  "Positives go to even indices and negatives to odd ones, in the order you meet them.",
  "Create the result array and two write positions, 0 for positives and 1 for negatives, each moving on by 2.");
pq("subarray-product-less-than-k", "Given positive integers, count the contiguous subarrays whose product is strictly less than k.", "8",
  "All values are positive, so extending a window only grows its product. That's a sliding window.",
  "Grow right and multiply in nums[right]; while the product >= k, divide out nums[left] and move left on. Each step adds right - left + 1 (the valid windows ending at right). k <= 1 means 0.");
pq("maximum-length-substring-with-two-occurrences", "Return the length of the longest substring in which no character appears more than twice.", "4",
  "Keep a window where every count is at most 2; only the character just added can break that.",
  "Count characters in the window. Add s[right]; while its count is above 2, remove s[left] and move left on. Track the widest window.");
pq("remove-all-adjacent-duplicates-in-string", "Repeatedly delete two neighbouring equal letters until there are none left, and return the result.", "'ca'",
  "Deleting a pair can bring two new equal letters together. A stack handles that naturally.",
  "Push each letter; if it equals the top of the stack, pop instead. Join the stack at the end.");
pq("simplify-path", "Turn an absolute Unix path into its simplest form: one slash between names, no trailing slash, '.' removed and '..' going up a level.", "'/home'",
  "Split on '/' and handle the pieces one by one; '..' undoes the most recent name.",
  "For each piece: skip '' and '.', pop the stack on '..' (if it isn't empty), otherwise push the name. Return '/' + '/'.join(stack).");
pq("online-stock-span", "Design StockSpanner where next(price) returns the number of consecutive days, ending today, on which the price was at most today's price.", "",
  "Once a bigger price arrives, the smaller prices before it never need to be looked at one by one again.",
  "Keep a stack of (price, span). In next(price), start with span 1 and pop every entry with price <= today, adding its span. Push (price, span) and return span.");
pq("basic-calculator-ii", "Evaluate a string with non-negative integers, + - * / and spaces (no brackets). Division truncates toward zero. Don't use eval.", "7",
  "Multiplication and division happen before addition. Settle each * or / as soon as you see its second number.",
  "Track the last operator. When a number ends: push it for +, push -number for -, and for * or / pop the top, combine, and push. Return the sum of the stack.");
pq("remove-k-digits", "Remove k digits from the number (given as a string) to make the smallest possible number. Return it without leading zeros ('0' if nothing is left).", "'1219'",
  "A digit followed by a smaller one should go: removing it makes the number smaller sooner.",
  "Monotonic stack: for each digit, while k > 0 and the top is bigger than it, pop and reduce k. Push it. Drop the last k digits if any removals remain, strip leading zeros, and return '0' if empty.");
pq("sum-of-subarray-minimums", "Return the sum of min(subarray) over every contiguous subarray, modulo 10^9 + 7.", "17",
  "Instead of looking at each subarray, ask for each value: in how many subarrays is it the minimum?",
  "With monotonic stacks find, for each i, the distance to the previous smaller value (left) and to the next smaller-or-equal value (right). arr[i] is the minimum of left * right subarrays. Sum arr[i] * left * right.");
pq("swap-nodes-in-pairs", "Swap every two neighbouring nodes of the list and return the new head. Change links, not values.", "[2, 1, 4, 3]",
  "A dummy node in front of the head makes the first pair work like every other one.",
  "prev = dummy. While two nodes follow prev: a, b = prev.next, prev.next.next; relink prev -> b -> a -> (rest); then prev = a.");
pq("range-sum-of-bst", "Return the sum of all values in the binary search tree that lie between low and high, inclusive.", "32",
  "The BST ordering tells you when a whole subtree can't contain anything in range.",
  "DFS: if the node is below low, only search its right subtree; if above high, only its left; otherwise add its value and search both sides.");
pq("sort-characters-by-frequency", "Sort the string so the most frequent characters come first, with each character's copies together. Ties can be in any order.", "'eetr' (any order of equally common letters is accepted)",
  "Count first; then it's about ordering a small number of distinct characters by count.",
  "Counter(s).most_common() gives (char, count) by count, highest first. Join char * count for each.");
pq("shortest-path-in-binary-matrix", "Return the length (in cells) of the shortest path of 0s from the top-left to the bottom-right of an n x n grid, moving in any of 8 directions, or -1 if there isn't one.", "2",
  "Every step costs the same, so BFS finds the shortest path.",
  "If either corner is 1, return -1. BFS from (0, 0) with distance 1, visiting the 8 neighbours that are 0 and unseen. Return the distance when you pop the bottom-right.");
pq("swim-in-rising-water", "At time t you can swim between neighbouring cells whose elevations are both at most t. Return the least time needed to get from the top-left to the bottom-right.", "3",
  "The cost of a path is its highest cell, not the sum. Always extend the route through the lowest cell you can reach.",
  "Min-heap of (time so far, r, c) starting with (grid[0][0], 0, 0). Pop the smallest, push unseen neighbours with max(time, their elevation), and return the time when you pop the bottom-right.");
pq("maximum-sum-circular-subarray", "Return the largest sum of a non-empty subarray of a circular array (the end wraps round to the start, but each element is used at most once).", "3",
  "A wrapping subarray is the whole array minus a non-wrapping middle part. To maximise it, take away the smallest middle part.",
  "One pass of Kadane for both the max and min subarray sums, plus the total. If the max is negative (all negative) return it; otherwise return max(max, total - min).");
pq("maximize-active-section-with-trade-i", "s is a string of 1s (active) and 0s. Treat it as if it had a 1 at each end. One optional trade turns a block of 1s with 0s on both sides into 0s, then turns a block of 0s with 1s on both sides into 1s. Return the most 1s s can have afterwards.", "1",
  "Removing a 1-block between two 0-blocks merges them; flipping that merged block gains both 0-blocks' lengths.",
  "Count the 1s and list the lengths of the 0-blocks in order. The answer is ones + the largest sum of two neighbouring 0-blocks (or just ones if there are fewer than two).");
pq("find-the-lexicographically-smallest-valid-sequence", "Pick indices of word1, in increasing order and as many as word2 has letters, so that the picked letters match word2 with at most one letter different. Return the lexicographically smallest such index list, or [].", "[0, 1, 2]",
  "To be smallest, take each index as early as possible. Use the single allowed change as early as possible too, but only if the rest of word2 can still be matched after it.",
  "Precompute suf[i] = the earliest position j such that word2[j:] is a subsequence of word1[i:]. Scan word1: take a matching letter; or, if the change is unused and suf[i + 1] <= j + 1, take this index as the change. Return the list if all of word2 was matched.");
pq("count-primes", "Return how many prime numbers are strictly less than n.", "4",
  "Testing each number separately is slow. Cross out the multiples of each prime instead.",
  "Sieve of Eratosthenes: a boolean array of size n; for each p from 2 up to sqrt(n) that is still marked prime, unmark p*p, p*p + p, ... Count the marked entries.");
pq("add-strings", "Add two non-negative numbers given as strings and return the sum as a string, without converting the whole strings to integers.", "'134'",
  "Grade-school addition: line up the last digits and carry.",
  "Two pointers from the ends with a carry. Each step appends (digits + carry) % 10 and carries the // 10. Keep going while either string or the carry remains, then reverse.");
pq("count-and-say", "The sequence starts '1'; each next term reads the previous one aloud ('1' is 'one 1' -> '11', then 'two 1s' -> '21', ...). Return the n-th term.", "'1'",
  "Each term is built only from the one before it, by reading off runs of the same digit.",
  "Start from '1' and repeat n - 1 times: walk the string, and for each run append str(run length) + the digit.");
pq("sequential-digits", "Return, in increasing order, every number in [low, high] whose digits each go up by one from the last (like 1234).", "[123, 234]",
  "Every such number is a slice of '123456789'.",
  "For each length from 2 to 9 and each start position, take int(digits[start:start + length]) and keep it if it's in range. That order is already sorted.");
pq("maximum-product-of-three-numbers", "Return the largest product of any three numbers in the array.", "6",
  "Two large negative numbers multiply to a large positive.",
  "Sort, then return max(the three largest multiplied, the two smallest times the largest). (A single pass can track those five values instead.)");
pq("best-time-to-buy-and-sell-stock-iii", "Return the most profit from at most two buy-then-sell transactions (you must sell before buying again).", "6",
  "Think of four states: after the first buy, first sell, second buy and second sell.",
  "Each day update buy1 = max(buy1, -p), sell1 = max(sell1, buy1 + p), buy2 = max(buy2, sell1 - p), sell2 = max(sell2, buy2 + p). Return sell2.");

// ---- OpenAI (LeetCode company tags) ----
pq("encode-and-decode-strings", "Design a Codec with encode(list of strings) -> one string and decode(that string) -> the original list. Strings may contain any characters, including your separator. (LeetCode Premium.)", "['Hello', 'World']",
  "Joining with a separator breaks as soon as a string contains that separator. Store each string's length instead.",
  "encode: for each s write str(len(s)) + '#' + s. decode: read digits up to '#', convert to n, take the next n characters, repeat.");
pq("design-hit-counter", "Design HitCounter with hit(timestamp) and getHits(timestamp), which returns the hits in the past 300 seconds (timestamp - 300 < t <= timestamp). Timestamps never go backwards. (LeetCode Premium.)", "",
  "Hits arrive in time order, so the old ones are always at the front.",
  "Keep a deque of timestamps. hit appends; getHits pops from the front while the oldest is <= timestamp - 300, then returns the deque's length.");
pq("design-authentication-manager", "Design AuthenticationManager(timeToLive): generate(token, t) creates a token expiring at t + timeToLive; renew(token, t) extends it only if it hasn't expired; countUnexpiredTokens(t) counts live tokens. A token expiring at time t counts as expired at t.", "",
  "All you need per token is its expiry time.",
  "Dict token -> expiry. generate sets it. renew updates it only if expiry > t. count returns how many expiries are > t.");
pq("design-spreadsheet", "Design Spreadsheet(rows) with columns A-Z: setCell('A1', value), resetCell('A1') and getValue('=X+Y'), where X and Y are cell names or non-negative numbers. Unset cells count as 0.", "",
  "Most cells are never set, so don't build a grid.",
  "Keep a dict of cell -> value; resetCell deletes. getValue splits formula[1:] on '+' and adds the two operands, using int() for numbers and dict.get(cell, 0) for cells.");
pq("design-memory-allocator", "Design Allocator(n) over n memory units: allocate(size, mID) claims the leftmost run of size free units and returns its start (or -1); freeMemory(mID) frees every unit owned by mID and returns how many were freed.", "",
  "With n and the number of calls at most 1,000, a direct simulation is what's expected.",
  "Keep an array of owner IDs (0 = free). allocate scans counting consecutive free cells and fills the first run that reaches size. freeMemory resets every cell equal to mID and counts them.");
pq("snapshot-array", "Design SnapshotArray(length) with set(index, val), snap() returning the snapshot id (0, 1, 2, ...), and get(index, snap_id) returning the value at that index when that snapshot was taken.", "",
  "Copying the whole array on every snap is too slow. Most indices don't change between snapshots.",
  "Each index keeps a list of (snap_id, value) changes, starting with (-1, 0). set records (current snap_id, val), overwriting a change from the same snap. get binary searches for the last change with snap_id <= the one asked for.");
pq("flatten-nested-list-iterator", "Implement NestedIterator(nestedList) with next() and hasNext() so that calling next() while hasNext() is True returns every integer of the nested list in order. Elements are NestedIntegers with isInteger(), getInteger() and getList().", "[1, 1, 2, 1, 1]",
  "Flattening everything up front works, but an iterator should do the work lazily. A stack remembers where you are in each nested list.",
  "Push the top-level elements in reverse. hasNext: while the top is a list, pop it and push its elements in reverse; return whether the stack is non-empty. next pops and returns getInteger().");

// ---- Practical problems written for this app (from candidate reports, unverified) ----
pq("in-memory-database", "Build an in-memory database in three stages: set/get/delete fields of records, then sorted scans, then fields that expire (TTL).", "",
  "Store each key as a dict of field -> (value, expiry). Most of the work is being careful about what counts as 'live'.",
  "Stage 1: dicts. Stage 2: sort the live field names and format 'field(value)'. Stage 3: store expires_at = timestamp + ttl (None for plain set); a field is live at t if expires_at is None or t < expires_at. Check liveness in get, delete and scans.");
PROMPT["in-memory-database"].full = `<p>Real interview tasks like this one come in stages: you're shown stage 1, and the next stage unlocks when it passes. Build a class <code>InMemoryDB</code>. Every method takes a <code>timestamp</code> first; timestamps strictly increase from call to call. Records are identified by <code>key</code>; each record holds <code>field</code> &rarr; <code>value</code> pairs (all strings).</p>
<p><b>Stage 1: basic operations</b></p><ul>
<li><code>set(timestamp, key, field, value)</code>: set the field (create the record if needed). Returns <code>None</code>.</li>
<li><code>get(timestamp, key, field)</code>: the field's value, or <code>None</code> if the record or field doesn't exist.</li>
<li><code>delete(timestamp, key, field)</code>: remove the field. Return <code>True</code> if it existed, else <code>False</code>.</li></ul>
<p><b>Stage 2: scans</b></p><ul>
<li><code>scan(timestamp, key)</code>: a list of <code>"field(value)"</code> strings for every field of the record, sorted by field name. An empty list if the record doesn't exist.</li>
<li><code>scan_by_prefix(timestamp, key, prefix)</code>: the same, only for fields whose name starts with <code>prefix</code>.</li></ul>
<p><b>Stage 3: time to live</b></p><ul>
<li><code>set_with_ttl(timestamp, key, field, value, ttl)</code>: like <code>set</code>, but the field only exists for times in <code>[timestamp, timestamp + ttl)</code>.</li>
<li>Expired fields behave as if they were never there: <code>get</code> returns <code>None</code>, <code>delete</code> returns <code>False</code>, scans leave them out.</li>
<li>A plain <code>set</code> on a field removes any expiry it had.</li></ul>
<p><b>Example:</b> <code>set_with_ttl(1, "k", "f", "v", 5)</code> &rarr; <code>get(3, "k", "f")</code> is <code>"v"</code>, <code>get(6, "k", "f")</code> is <code>None</code>.</p>
<p class="muted">Follow-ups to discuss: a stage 4 with <code>backup(timestamp)</code> and <code>restore(timestamp, backup_timestamp)</code>, and how remaining TTLs should carry across a restore.</p>`;
pq("crawler-fake-web", "Starting from startUrl, crawl a fake web (a dict of page -> the pages it links to) and return every reachable page on the same hostname as startUrl, in any order.", "['http://news.yahoo.com/news/topics/', 'http://news.yahoo.com/news', 'http://news.yahoo.com', 'http://news.yahoo.com/us'] (any order)",
  "It's graph traversal: pages are nodes, links are edges, and pages on other hosts are walls you don't go through.",
  "Get the hostname with url.split('/')[2]. BFS from startUrl with a visited set, following only links with the same hostname. Return the visited set as a list.");
PROMPT["crawler-fake-web"].full = `<p>Write <code>Solution.crawl(startUrl, web)</code>. <code>web</code> is a dict standing in for the internet: <code>web[url]</code> is the list of URLs that page links to (a URL missing from the dict has no links). Every URL looks like <code>http://hostname/path</code>; the hostname is the part between <code>http://</code> and the next <code>/</code>.</p>
<p>Return every URL reachable from <code>startUrl</code> by following links, <b>without leaving startUrl's hostname</b>: don't visit other hosts, and don't follow their links either. Include <code>startUrl</code>. Visit each page once (pages can link in circles). Any order is accepted.</p>
<p>Watch out: <code>http://a.com.evil.org</code> is a different hostname from <code>http://a.com</code>.</p>
<p class="muted">Follow-ups reported in interviews: make it concurrent (a thread pool fetching pages in parallel, with a thread-safe visited set and a clean way to know when every worker is done), rate-limit requests per host, and make it robust to slow or failing pages. This page can't run threads, so the tests cover the single-threaded version.</p>`;
pq("stack-samples-to-trace", "A sampling profiler records the call stack every so often. Turn the list of samples into begin/end trace events: ['B', time, name] when a frame starts and ['E', time, name] when it ends.", "[['B', 0, 'main'], ['B', 1, 'foo'], ['B', 2, 'bar'], ['E', 3, 'bar'], ['E', 3, 'foo'], ['E', 4, 'main']]",
  "Between two samples, only the part of the stack after their common prefix changes.",
  "For each sample, find the common prefix length c with the previous stack. Emit 'E' for the old frames after c, innermost first, then 'B' for the new frames after c, outermost first, all at this sample's time. After the last sample, end what's still open at its time.");
PROMPT["stack-samples-to-trace"].full = `<p>Write <code>Solution.samplesToEvents(samples)</code>. Each sample is <code>[timestamp, stack]</code>, where <code>stack</code> lists function names from the outermost call to the innermost (an empty list means nothing was running). Samples come in increasing time order.</p>
<p>Return trace events, as a trace viewer expects them: <code>["B", timestamp, name]</code> when a function call begins and <code>["E", timestamp, name]</code> when it ends.</p><ul>
<li>Compare each sample with the previous one (the stack before the first sample is empty). Frames are compared by <b>position</b>: two stacks agree up to the first index where the names differ. A recursive call like <code>["a", "a"]</code> is two separate frames.</li>
<li>At each sample's timestamp: first emit <code>E</code> events for the previous stack's frames past the common part, <b>innermost first</b>; then <code>B</code> events for the new stack's frames past the common part, <b>outermost first</b>.</li>
<li>After the last sample, end every frame still open at the last sample's timestamp (innermost first).</li></ul>
<p><b>Example:</b> <code>[[0, ["main"]], [1, ["main", "foo"]], [3, ["main", "bar"]]]</code> &rarr; <code>B 0 main</code>, <code>B 1 foo</code>, <code>E 3 foo</code>, <code>B 3 bar</code>, then at the end <code>E 3 bar</code>, <code>E 3 main</code>.</p>
<p class="muted">Follow-ups to discuss: ignoring frames that appear in only one sample (noise), and turning the events into total time per function.</p>`;
pq("greedy-tokenizer", "Split text into tokens from a vocabulary by always taking the longest token that matches at the current position. Return the token ids (their indices in vocab); an unmatched character becomes -1.", "[0, 1, 3]",
  "Trying every vocabulary word at every position is slow with a big vocabulary. A trie lets you follow all candidate tokens at once.",
  "Insert every token into a trie, storing its id where it ends. From position i, walk the trie along the text, remembering the last id seen and where it ended. Emit that id and jump there; if none ended, emit -1 and move one character.");
PROMPT["greedy-tokenizer"].full = `<p>Write <code>Solution.tokenize(text, vocab)</code>. <code>vocab</code> is a list of distinct, non-empty token strings; a token's id is its index in the list.</p><ul>
<li>Start at the beginning of <code>text</code>. At each position, find the <b>longest</b> token in <code>vocab</code> that <code>text</code> continues with there, output its id, and move past it.</li>
<li>If no token matches at a position, output <code>-1</code> and move on by one character.</li>
<li>Return the list of ids. Empty text gives an empty list.</li></ul>
<p><b>Example:</b> <code>text = "unhappiness"</code>, <code>vocab = ["un", "happi", "happy", "ness", "h", "a", "p"]</code> &rarr; <code>"un" + "happi" + "ness"</code> &rarr; <code>[0, 1, 3]</code>.</p>
<p class="muted">Follow-ups to discuss: why greedy longest-match isn't always the fewest tokens, how byte-pair encoding (BPE) differs, and streaming text that arrives in chunks (a token can span two chunks).</p>`;
