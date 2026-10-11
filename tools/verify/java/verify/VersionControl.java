package verify;

// First Bad Version: LeetCode's Solution extends VersionControl, which provides isBadVersion.
public class VersionControl {
    public static int firstBad;
    public boolean isBadVersion(int version) { return version >= firstBad; }
}
