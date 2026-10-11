using System.Collections.Generic;

// The classes LeetCode provides to C# solutions.
namespace Verify
{
    public class ListNode
    {
        public int val;
        public ListNode next;
        public ListNode(int val = 0, ListNode next = null) { this.val = val; this.next = next; }
    }

    public class TreeNode
    {
        public int val;
        public TreeNode left;
        public TreeNode right;
        public TreeNode(int val = 0, TreeNode left = null, TreeNode right = null) { this.val = val; this.left = left; this.right = right; }
    }

    // An interface on LeetCode; a class here is used the same way.
    public class NestedInteger
    {
        private readonly int? _value;
        private readonly IList<NestedInteger> _list;
        public NestedInteger(int value) { _value = value; }
        public NestedInteger(IList<NestedInteger> list) { _list = list; }
        public bool IsInteger() => _value.HasValue;
        public int GetInteger() => _value ?? 0;
        public IList<NestedInteger> GetList() => _list;
    }

    // First Bad Version: LeetCode's Solution derives from VersionControl, which provides IsBadVersion.
    public class VersionControl
    {
        public static int FirstBad;
        public bool IsBadVersion(int version) => version >= FirstBad;
    }
}
