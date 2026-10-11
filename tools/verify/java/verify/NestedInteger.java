package verify;

import java.util.List;

// LeetCode's NestedInteger (an interface there; a class here is used the same way).
public class NestedInteger {
    private final Integer value;
    private final List<NestedInteger> list;
    public NestedInteger(int value) { this.value = value; this.list = null; }
    public NestedInteger(List<NestedInteger> list) { this.value = null; this.list = list; }
    public boolean isInteger() { return value != null; }
    public Integer getInteger() { return value; }
    public List<NestedInteger> getList() { return list; }
}
