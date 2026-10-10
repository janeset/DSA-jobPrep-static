// Java and C# refresher lessons. Same shape as the Python LESSONS, but exercises carry a
// reference solution and sample checks instead of auto-run tests (Java/C# can't run in the page).
// body is trusted HTML written here. Code is Java 17 / C# 10 (.NET 6+) with implicit usings.

const JAVA_LESSONS = [
  {
    id: "basics", title: "1. Basics: types, variables, control flow",
    body: `<p>Java is statically typed and compiled. Code lives in classes, and a program starts at <code>public static void main(String[] args)</code>.</p>
      <ul><li>Primitives (<code>int, long, double, boolean, char</code>) hold values. Everything else (<code>String</code>, arrays, objects) is a reference.</li>
      <li><code>int</code> is 32-bit and silently overflows past about 2.1 billion. Use <code>long</code> for big sums.</li>
      <li>Integer division truncates: <code>7 / 2 == 3</code>, but <code>7 / 2.0 == 3.5</code>. <code>%</code> keeps the sign of the left side.</li>
      <li>Loops: <code>for (int i = 0; i &lt; n; i++)</code>, enhanced <code>for (int x : arr)</code>, <code>while</code>. <code>var</code> infers local types (Java 10+).</li>
      <li>Compare primitives with <code>==</code>, but objects (<code>String</code>, <code>Integer</code>) with <code>.equals()</code>.</li></ul>`,
    example: `public class Main {
    public static void main(String[] args) {
        int[] nums = {3, 8, 1};
        int sum = 0;
        for (int x : nums) {
            if (x % 2 == 0) continue;      // skip evens
            sum += x;
        }
        System.out.println(sum);           // 4
        System.out.println(7 / 2 + " " + 7 / 2.0 + " " + (-7 % 3));   // 3 3.5 -1
        long big = 3_000_000_000L;         // too big for int
        var name = "Ada";                  // inferred as String
        System.out.println(name + " " + big);
    }
}`,
    exercises: [{
      prompt: "Write fizzBuzz(int n) returning a List<String> for 1..n: \"Fizz\" for multiples of 3, \"Buzz\" for 5, \"FizzBuzz\" for both, otherwise the number.",
      starter: `import java.util.*;

static List<String> fizzBuzz(int n) {
    // your code
}`,
      solution: `static List<String> fizzBuzz(int n) {
    List<String> out = new ArrayList<>();
    for (int i = 1; i <= n; i++) {
        if (i % 15 == 0) out.add("FizzBuzz");
        else if (i % 3 == 0) out.add("Fizz");
        else if (i % 5 == 0) out.add("Buzz");
        else out.add(String.valueOf(i));
    }
    return out;
}`,
      checks: ["fizzBuzz(5) -> [1, 2, Fizz, 4, Buzz]", "fizzBuzz(15) ends with FizzBuzz", "fizzBuzz(0) -> []"],
    }],
  },
  {
    id: "strings", title: "2. Strings & StringBuilder",
    body: `<p>Strings are immutable objects. Each "change" makes a new string, so build big strings with <code>StringBuilder</code>.</p>
      <ul><li><code>s.length()</code>, <code>s.charAt(i)</code>, <code>s.substring(start, end)</code> (end exclusive), <code>s.indexOf("x")</code>, <code>s.split(",")</code>, <code>s.toCharArray()</code>.</li>
      <li>Compare content with <code>s.equals(t)</code> or <code>equalsIgnoreCase</code>. <code>==</code> compares references and is a classic bug.</li>
      <li><code>char</code> is a number: <code>c - 'a'</code> gives 0-25, handy for counting letters. Use <code>Character.isLetterOrDigit</code> and <code>Character.toLowerCase</code>.</li>
      <li><code>StringBuilder</code>: <code>append</code>, <code>insert</code>, <code>reverse</code>, <code>toString</code>. Using <code>s += c</code> in a loop is O(n²).</li></ul>`,
    example: `String s = "Hello, World";
System.out.println(s.length() + " " + s.charAt(0) + " " + s.substring(7, 12));  // 12 H World
System.out.println(s.toLowerCase().indexOf("world"));        // 7
String[] parts = "a,b,c".split(",");                          // [a, b, c]
StringBuilder sb = new StringBuilder();
for (String p : parts) sb.append(p.toUpperCase());
System.out.println(sb.reverse().toString());                  // CBA
System.out.println("abc".equals("ab" + "c"));                // true (never use ==)
char c = 'a';
System.out.println((char) (c + 2));                           // c`,
    exercises: [{
      prompt: "Write isPalindrome(String s) that ignores case and non-alphanumeric characters (\"A man, a plan, a canal: Panama\" is true). Use two pointers.",
      starter: `static boolean isPalindrome(String s) {
    // your code
}`,
      solution: `static boolean isPalindrome(String s) {
    int l = 0, r = s.length() - 1;
    while (l < r) {
        while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
        while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
        if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;
        l++;
        r--;
    }
    return true;
}`,
      checks: ["\"A man, a plan, a canal: Panama\" -> true", "\"race a car\" -> false", "\"\" -> true"],
    }, {
      prompt: "Write reverseWords(String s) that reverses word order and collapses extra spaces: \"  the sky  is blue \" -> \"blue is sky the\".",
      starter: `import java.util.*;

static String reverseWords(String s) {
    // your code
}`,
      solution: `static String reverseWords(String s) {
    String[] words = s.trim().split(" +");     // one or more spaces
    Collections.reverse(Arrays.asList(words));  // reverses the array in place
    return String.join(" ", words);
}`,
      checks: ["\"  the sky  is blue \" -> \"blue is sky the\"", "\"one\" -> \"one\""],
    }],
  },
  {
    id: "arrays", title: "3. Arrays & ArrayList",
    body: `<p>Arrays have a fixed size (<code>arr.length</code>, a field). <code>ArrayList</code> grows as needed (<code>list.size()</code>, a method) and holds objects, so <code>int</code> values are boxed to <code>Integer</code>.</p>
      <ul><li><code>Arrays.sort</code>, <code>Arrays.toString</code>, <code>Arrays.fill</code>, <code>Arrays.copyOfRange</code>. <code>Collections.sort(list)</code> for lists.</li>
      <li><code>List.of(...)</code> is immutable. Wrap it in <code>new ArrayList&lt;&gt;(...)</code> to modify.</li>
      <li>Trap: <code>list.remove(1)</code> removes <em>index</em> 1, but <code>list.remove(Integer.valueOf(1))</code> removes the <em>value</em> 1.</li>
      <li>2-D arrays: <code>int[][] grid = new int[rows][cols]</code>, filled with zeros.</li></ul>`,
    example: `import java.util.*;

int[] arr = {5, 2, 9};
Arrays.sort(arr);
System.out.println(Arrays.toString(arr) + " " + arr.length);   // [2, 5, 9] 3

List<Integer> list = new ArrayList<>(List.of(4, 7, 1));
list.add(3);
list.remove(Integer.valueOf(7));   // removes the VALUE 7
list.remove(0);                    // removes the element at INDEX 0
Collections.sort(list);
System.out.println(list + " " + list.size());                  // [1, 3] 2

int[][] grid = new int[3][4];      // 3 rows, 4 columns, all 0
grid[1][2] = 8;
int[] firstTwo = Arrays.copyOfRange(arr, 0, 2);                // [2, 5]`,
    exercises: [{
      prompt: "Write rotateLeft(int[] a, int k) returning a NEW array rotated left by k. k may exceed the length; handle an empty array.",
      starter: `static int[] rotateLeft(int[] a, int k) {
    // your code
}`,
      solution: `static int[] rotateLeft(int[] a, int k) {
    int n = a.length;
    int[] out = new int[n];
    if (n == 0) return out;
    k %= n;
    for (int i = 0; i < n; i++) out[i] = a[(i + k) % n];
    return out;
}`,
      checks: ["[1, 2, 3, 4, 5], k = 2 -> [3, 4, 5, 1, 2]", "[1, 2, 3], k = 7 -> [2, 3, 1]", "[], k = 3 -> []"],
    }, {
      prompt: "Write dedupe(List<Integer> nums) that removes duplicates but keeps first-seen order.",
      starter: `import java.util.*;

static List<Integer> dedupe(List<Integer> nums) {
    // your code
}`,
      solution: `static List<Integer> dedupe(List<Integer> nums) {
    return new ArrayList<>(new LinkedHashSet<>(nums));   // LinkedHashSet keeps insertion order
}`,
      checks: ["[3, 1, 3, 2, 1] -> [3, 1, 2]", "[] -> []"],
    }],
  },
  {
    id: "maps", title: "4. HashMap & HashSet",
    body: `<p><code>HashMap</code> and <code>HashSet</code> give O(1) average lookups. They're the most-used tools in interviews: counting, grouping, and "have I seen this?".</p>
      <ul><li><code>put</code>, <code>get</code> (null if missing), <code>getOrDefault</code>, <code>containsKey</code>, <code>remove</code>, <code>entrySet()</code> to loop.</li>
      <li>Counting in one line: <code>map.merge(key, 1, Integer::sum)</code>. Grouping: <code>map.computeIfAbsent(key, k -&gt; new ArrayList&lt;&gt;()).add(x)</code>.</li>
      <li><code>set.add(x)</code> returns false if x was already there, which doubles as a duplicate check.</li>
      <li><code>LinkedHashMap</code> keeps insertion order, and <code>TreeMap</code> keeps keys sorted (O(log n)). Custom key classes need <code>equals</code> and <code>hashCode</code>; records get them for free.</li></ul>`,
    example: `import java.util.*;

Map<String, Integer> counts = new HashMap<>();
for (String w : "the cat the dog".split(" "))
    counts.merge(w, 1, Integer::sum);                 // add 1, or start at 1
System.out.println(counts.get("the"));                // 2
System.out.println(counts.getOrDefault("cow", 0));    // 0

Map<Integer, List<String>> byLen = new TreeMap<>();  // keys kept sorted
for (String w : List.of("hi", "cat", "ox", "dog"))
    byLen.computeIfAbsent(w.length(), k -> new ArrayList<>()).add(w);
System.out.println(byLen);                            // {2=[hi, ox], 3=[cat, dog]}

Set<Integer> seen = new HashSet<>();
System.out.println(seen.add(5) + " " + seen.add(5));  // true false`,
    exercises: [{
      prompt: "Write wordCount(String text) returning a Map of lowercase word -> count, splitting on spaces.",
      starter: `import java.util.*;

static Map<String, Integer> wordCount(String text) {
    // your code
}`,
      solution: `static Map<String, Integer> wordCount(String text) {
    Map<String, Integer> counts = new HashMap<>();
    for (String w : text.toLowerCase().split(" +")) {
        if (!w.isEmpty()) counts.merge(w, 1, Integer::sum);
    }
    return counts;
}`,
      checks: ["\"the cat The dog\" -> {the=2, cat=1, dog=1}", "\"\" -> {}"],
    }, {
      prompt: "Write firstUniqueChar(String s) returning the index of the first non-repeating character, or -1. Assume lowercase a-z.",
      starter: `static int firstUniqueChar(String s) {
    // your code
}`,
      solution: `static int firstUniqueChar(String s) {
    int[] freq = new int[26];
    for (char c : s.toCharArray()) freq[c - 'a']++;
    for (int i = 0; i < s.length(); i++)
        if (freq[s.charAt(i) - 'a'] == 1) return i;
    return -1;
}`,
      checks: ["\"leetcode\" -> 0", "\"loveleetcode\" -> 2", "\"aabb\" -> -1"],
    }],
  },
  {
    id: "methods", title: "5. Methods, static & pass-by-value",
    body: `<ul><li><code>static</code> methods belong to the class; instance methods need an object. Interview solutions are usually static helpers or methods on a <code>Solution</code> class.</li>
      <li>Java is <b>always pass-by-value</b>. For objects, the value copied is the reference, so a method can mutate the caller's list but can't make the caller's variable point to a new list.</li>
      <li>Overloading: same name, different parameter types. Varargs: <code>int... nums</code> arrives as an <code>int[]</code>.</li>
      <li><code>final</code> on a variable stops reassignment, not mutation of the object it points to.</li></ul>`,
    example: `import java.util.*;

public class Main {
    static void addOne(int x) { x++; }                          // changes a copy
    static void addItem(List<Integer> list) { list.add(1); }    // same list object
    static void replace(List<Integer> list) { list = new ArrayList<>(); }  // no effect outside

    static int total(int... nums) {                             // varargs
        int s = 0;
        for (int n : nums) s += n;
        return s;
    }
    static double area(double r) { return Math.PI * r * r; }    // overloads: same name,
    static int area(int w, int h) { return w * h; }            // different parameters

    public static void main(String[] args) {
        int a = 5;
        addOne(a);
        List<Integer> list = new ArrayList<>();
        addItem(list);
        replace(list);
        System.out.println(a + " " + list + " " + total(1, 2, 3) + " " + area(2, 3));  // 5 [1] 6 6
    }
}`,
    exercises: [{
      prompt: "Write maxOf(int first, int... rest) returning the largest argument (at least one is required).",
      starter: `static int maxOf(int first, int... rest) {
    // your code
}`,
      solution: `static int maxOf(int first, int... rest) {
    int best = first;
    for (int x : rest) best = Math.max(best, x);
    return best;
}`,
      checks: ["maxOf(3) -> 3", "maxOf(3, 9, 4) -> 9", "maxOf(-5, -2) -> -2"],
    }, {
      prompt: "Write swap(int[] a, int i, int j) that swaps two elements in place. Why does this work when swap(int x, int y) can't?",
      starter: `static void swap(int[] a, int i, int j) {
    // your code
}`,
      solution: `static void swap(int[] a, int i, int j) {
    int t = a[i];
    a[i] = a[j];
    a[j] = t;
}
// Works because the method receives a copy of the REFERENCE to the same array.
// swap(int x, int y) only gets copies of the values, so the caller never sees the change.`,
      checks: ["a = [1, 2, 3]; swap(a, 0, 2) -> a is [3, 2, 1]"],
    }],
  },
  {
    id: "classes", title: "6. Classes, interfaces & records",
    body: `<ul><li>A class bundles fields and methods. Constructors set up state; <code>this</code> refers to the current object.</li>
      <li>Encapsulate with <code>private</code> fields. <code>final</code> fields make objects immutable.</li>
      <li><code>interface</code> defines behaviour (<code>Comparable</code>, <code>Runnable</code>); a class can implement many but extend only one class.</li>
      <li>Override <code>toString</code>, <code>equals</code> and <code>hashCode</code> together. <b>Records</b> (Java 16+) generate all three for immutable data.</li>
      <li>Interview staples are small classes: <code>ListNode</code>, <code>TreeNode</code>, <code>LRUCache</code>, <code>MinStack</code>.</li></ul>`,
    example: `import java.util.*;

interface Shape { double area(); }

class Circle implements Shape {
    private final double r;                  // encapsulated, immutable
    Circle(double r) { this.r = r; }
    @Override public double area() { return Math.PI * r * r; }
    @Override public String toString() { return "Circle(" + r + ")"; }
}

record Point(int x, int y) {}                // equals, hashCode, toString for free

public class Main {
    public static void main(String[] args) {
        List<Shape> shapes = List.of(new Circle(1), new Circle(2));
        double sum = 0;
        for (Shape s : shapes) sum += s.area();
        System.out.printf("%.2f%n", sum);                 // 15.71
        Set<Point> pts = new HashSet<>(List.of(new Point(1, 2), new Point(1, 2)));
        System.out.println(pts.size());                    // 1 (records compare by value)
    }
}`,
    exercises: [{
      prompt: "Implement class IntStack with push, pop, peek, isEmpty and size. pop and peek on an empty stack should throw IllegalStateException.",
      starter: `import java.util.*;

class IntStack {
    // your code
}`,
      solution: `class IntStack {
    private final List<Integer> items = new ArrayList<>();

    void push(int x) { items.add(x); }

    int pop() {
        if (items.isEmpty()) throw new IllegalStateException("empty stack");
        return items.remove(items.size() - 1);     // remove(int index)
    }

    int peek() {
        if (items.isEmpty()) throw new IllegalStateException("empty stack");
        return items.get(items.size() - 1);
    }

    boolean isEmpty() { return items.isEmpty(); }
    int size() { return items.size(); }
}`,
      checks: ["push(1), push(2) -> peek() == 2, size() == 2", "pop() -> 2, then pop() -> 1", "pop() on an empty stack throws IllegalStateException"],
    }],
  },
  {
    id: "generics", title: "7. Generics, collections & comparators",
    body: `<ul><li>Collections are generic: <code>List&lt;Integer&gt;</code>, <code>Map&lt;String, List&lt;Integer&gt;&gt;</code>. Primitives aren't allowed as type arguments (no <code>List&lt;int&gt;</code>).</li>
      <li>Program to interfaces: <code>List</code>, <code>Set</code>, <code>Map</code>, <code>Deque</code>, <code>Queue</code>. Pick implementations: <code>ArrayList</code>, <code>HashSet</code>, <code>HashMap</code>, <code>ArrayDeque</code>, <code>PriorityQueue</code>.</li>
      <li>Sorting objects: <code>Comparator.comparingInt(P::age).reversed().thenComparing(P::name)</code>.</li>
      <li>Prefer <code>Integer.compare(a, b)</code> over <code>a - b</code> in comparators, since subtraction can overflow.</li>
      <li>Generic methods: <code>static &lt;T extends Comparable&lt;T&gt;&gt; T max(List&lt;T&gt; xs)</code>.</li></ul>`,
    example: `import java.util.*;

public class Main {
    record Person(String name, int age) {}

    static <T extends Comparable<T>> T maxOf(List<T> items) {   // generic method
        T best = items.get(0);
        for (T x : items) if (x.compareTo(best) > 0) best = x;
        return best;
    }

    public static void main(String[] args) {
        List<Person> people = new ArrayList<>(List.of(
            new Person("Ana", 31), new Person("Bo", 25), new Person("Cy", 31)));
        people.sort(Comparator.comparingInt(Person::age).reversed()
                              .thenComparing(Person::name));
        System.out.println(people.get(0).name());                // Ana (oldest, then by name)
        System.out.println(maxOf(List.of("pear", "fig", "apple")));  // pear

        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1]));
        pq.offer(new int[]{7, 5});
        pq.offer(new int[]{8, 1});
        System.out.println(pq.poll()[0]);                        // 8 (smallest second value)
    }
}`,
    exercises: [{
      prompt: "Write sortWords(List<String> words) returning a new list sorted by length, then alphabetically.",
      starter: `import java.util.*;

static List<String> sortWords(List<String> words) {
    // your code
}`,
      solution: `static List<String> sortWords(List<String> words) {
    List<String> out = new ArrayList<>(words);
    out.sort(Comparator.comparingInt(String::length)
                       .thenComparing(Comparator.naturalOrder()));
    return out;
}`,
      checks: ["[pear, fig, apple, kiwi] -> [fig, kiwi, pear, apple]"],
    }, {
      prompt: "Write topKFrequent(int[] nums, int k) returning the k most frequent values (any order), using a HashMap and a min-heap of size k.",
      starter: `import java.util.*;

static List<Integer> topKFrequent(int[] nums, int k) {
    // your code
}`,
      solution: `static List<Integer> topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int x : nums) freq.merge(x, 1, Integer::sum);
    PriorityQueue<Integer> heap = new PriorityQueue<>(Comparator.comparingInt(freq::get));
    for (int x : freq.keySet()) {
        heap.offer(x);
        if (heap.size() > k) heap.poll();     // drop the least frequent
    }
    return new ArrayList<>(heap);
}`,
      checks: ["[1, 1, 1, 2, 2, 3], k = 2 -> contains 1 and 2", "[4], k = 1 -> [4]"],
    }],
  },
  {
    id: "exceptions", title: "8. Exceptions",
    body: `<ul><li><code>try / catch / finally</code>. Catch the most specific type you can.</li>
      <li><b>Checked</b> exceptions (<code>IOException</code>) must be caught or declared with <code>throws</code>. <b>Unchecked</b> ones (<code>RuntimeException</code>: <code>NullPointerException</code>, <code>ArrayIndexOutOfBoundsException</code>, <code>NumberFormatException</code>, <code>ArithmeticException</code>) don't.</li>
      <li>Signal bad input with <code>throw new IllegalArgumentException("why")</code>.</li>
      <li><code>try (var r = new BufferedReader(...)) { }</code> (try-with-resources) closes resources automatically.</li>
      <li>In interviews, say how you'd handle null or empty input, then handle it explicitly.</li></ul>`,
    example: `public class Main {
    static Integer parse(String s) {
        try {
            return Integer.parseInt(s.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    static int divide(int a, int b) {
        if (b == 0) throw new IllegalArgumentException("b must not be 0");
        return a / b;
    }

    public static void main(String[] args) {
        System.out.println(parse("42") + " " + parse("4x2"));   // 42 null
        try {
            divide(1, 0);
        } catch (IllegalArgumentException e) {
            System.out.println("caught: " + e.getMessage());     // caught: b must not be 0
        } finally {
            System.out.println("always runs");
        }
    }
}`,
    exercises: [{
      prompt: "Write safeDivide(double a, double b) returning a / b, or null when b is 0 (return type Double).",
      starter: `static Double safeDivide(double a, double b) {
    // your code
}`,
      solution: `static Double safeDivide(double a, double b) {
    if (b == 0) return null;
    return a / b;
}`,
      checks: ["safeDivide(6, 3) -> 2.0", "safeDivide(1, 0) -> null"],
    }, {
      prompt: "Write parseIntOr(String s, int fallback) returning the parsed int, or fallback when s is null or not a valid integer. Leading/trailing spaces are allowed.",
      starter: `static int parseIntOr(String s, int fallback) {
    // your code
}`,
      solution: `static int parseIntOr(String s, int fallback) {
    if (s == null) return fallback;
    try {
        return Integer.parseInt(s.trim());
    } catch (NumberFormatException e) {
        return fallback;
    }
}`,
      checks: ["parseIntOr(\"12\", 0) -> 12", "parseIntOr(\"abc\", 0) -> 0", "parseIntOr(null, -1) -> -1", "parseIntOr(\" 7 \", 0) -> 7"],
    }],
  },
  {
    id: "lambdas", title: "9. Lambdas & streams",
    body: `<ul><li>A lambda is a short function: <code>x -&gt; x * 2</code>. It fills any <em>functional interface</em> (<code>Function</code>, <code>Predicate</code>, <code>Comparator</code>, <code>Runnable</code>).</li>
      <li>Method references are shorthand: <code>String::length</code>, <code>Integer::sum</code>, <code>System.out::println</code>.</li>
      <li>Streams: <code>list.stream().filter(...).map(...).collect(Collectors.toList())</code>. Also <code>sum</code>, <code>count</code>, <code>anyMatch</code>, <code>Collectors.groupingBy</code>, <code>IntStream.range</code>.</li>
      <li>Streams read nicely, but a plain loop is fine (and often faster) in interviews. Use whichever is clearer.</li></ul>`,
    example: `import java.util.*;
import java.util.stream.*;

List<Integer> nums = List.of(1, 2, 3, 4, 5, 6);
List<Integer> evenSquares = nums.stream()
        .filter(n -> n % 2 == 0)
        .map(n -> n * n)
        .collect(Collectors.toList());                       // [4, 16, 36]
int total = nums.stream().mapToInt(Integer::intValue).sum();  // 21
boolean anyBig = nums.stream().anyMatch(n -> n > 5);          // true

Map<Integer, Long> byLength = Stream.of("hi", "cat", "ox")
        .collect(Collectors.groupingBy(String::length, Collectors.counting()));  // {2=2, 3=1}

int[] squares = IntStream.range(0, 5).map(i -> i * i).toArray();   // [0, 1, 4, 9, 16]`,
    exercises: [{
      prompt: "Write squaresOfEvens(List<Integer> nums) using a stream.",
      starter: `import java.util.*;
import java.util.stream.*;

static List<Integer> squaresOfEvens(List<Integer> nums) {
    // your code
}`,
      solution: `static List<Integer> squaresOfEvens(List<Integer> nums) {
    return nums.stream()
               .filter(n -> n % 2 == 0)
               .map(n -> n * n)
               .collect(Collectors.toList());
}`,
      checks: ["[1, 2, 3, 4] -> [4, 16]", "[] -> []"],
    }, {
      prompt: "Write joinUpper(List<String> words) returning the words uppercased and joined with \", \".",
      starter: `import java.util.*;
import java.util.stream.*;

static String joinUpper(List<String> words) {
    // your code
}`,
      solution: `static String joinUpper(List<String> words) {
    return words.stream()
                .map(String::toUpperCase)
                .collect(Collectors.joining(", "));
}`,
      checks: ["[a, b] -> \"A, B\"", "[] -> \"\""],
    }],
  },
  {
    id: "recursion", title: "10. Recursion & Big-O in Java",
    body: `<ul><li>Every call uses a stack frame. Very deep recursion (around 10,000+ calls, depending on the JVM) throws <code>StackOverflowError</code>. Use a loop or an explicit stack for deep inputs.</li>
      <li>Memoize overlapping subproblems with an array or <code>HashMap</code>. That turns naive Fibonacci from O(2ⁿ) into O(n).</li>
      <li>Overflow is silent: <code>Integer.MAX_VALUE + 1</code> wraps to a negative. Use <code>long</code>, or <code>Math.addExact</code> to throw on overflow.</li>
      <li>Costs to know: <code>ArrayList.add</code> O(1) amortized, <code>add(0, x)</code> O(n), <code>HashMap</code> O(1) average, <code>TreeMap</code> O(log n), <code>Collections.sort</code> O(n log n), <code>String +=</code> in a loop O(n²).</li></ul>`,
    example: `public class Main {
    static long[] memo = new long[91];

    static long fib(int n) {                 // memoized: O(n) instead of O(2^n)
        if (n < 2) return n;
        if (memo[n] != 0) return memo[n];
        return memo[n] = fib(n - 1) + fib(n - 2);
    }

    static long power(long x, int n) {       // fast exponentiation: O(log n)
        if (n == 0) return 1;
        long half = power(x, n / 2);
        return n % 2 == 0 ? half * half : half * half * x;
    }

    public static void main(String[] args) {
        System.out.println(fib(90));          // 2880067194370816120
        System.out.println(power(2, 30));     // 1073741824
        int big = Integer.MAX_VALUE;
        System.out.println(big + 1);          // -2147483648: int overflow wraps
    }
}`,
    exercises: [{
      prompt: "Write sumDigits(int n) recursively for n >= 0 (1234 -> 10).",
      starter: `static int sumDigits(int n) {
    // your code
}`,
      solution: `static int sumDigits(int n) {
    if (n < 10) return n;
    return n % 10 + sumDigits(n / 10);
}`,
      checks: ["sumDigits(1234) -> 10", "sumDigits(7) -> 7", "sumDigits(0) -> 0"],
    }, {
      prompt: "Write gridPaths(int r, int c, long[][] memo): the number of paths from the top-left to the bottom-right of an r x c grid, moving only right or down. Memoize it.",
      starter: `static long gridPaths(int r, int c, long[][] memo) {
    // your code
}
// call: gridPaths(3, 7, new long[4][8])`,
      solution: `static long gridPaths(int r, int c, long[][] memo) {
    if (r == 1 || c == 1) return 1;
    if (memo[r][c] != 0) return memo[r][c];
    return memo[r][c] = gridPaths(r - 1, c, memo) + gridPaths(r, c - 1, memo);
}`,
      checks: ["gridPaths(3, 7, new long[4][8]) -> 28", "gridPaths(1, 1, new long[2][2]) -> 1", "gridPaths(2, 2, new long[3][3]) -> 2"],
    }],
  },
  {
    id: "testing", title: "11. Testing with JUnit (your QA edge)",
    body: `<p>Your QA background transfers directly. JUnit 5 is the standard Java test framework, and the habits are the same ones you already use.</p>
      <ul><li><code>@Test</code> methods with <code>assertEquals(expected, actual)</code>, <code>assertTrue</code>, <code>assertThrows(Ex.class, () -&gt; ...)</code>.</li>
      <li><code>@ParameterizedTest</code> with <code>@CsvSource</code> turns a table of cases into tests, just like a test-case matrix.</li>
      <li>Arrange, act, assert. Name tests after behaviour: <code>clampKeepsValuesInRange</code>.</li>
      <li>In interviews, there's no framework: walk through a normal case, an edge case (empty, one element, negatives, max int) and a tricky case out loud.</li></ul>`,
    example: `import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import static org.junit.jupiter.api.Assertions.*;

class MathUtilsTest {
    @Test
    void clampKeepsValuesInRange() {
        assertEquals(5, MathUtils.clamp(5, 0, 10));
        assertEquals(0, MathUtils.clamp(-1, 0, 10));
        assertEquals(10, MathUtils.clamp(11, 0, 10));
    }

    @ParameterizedTest
    @CsvSource({"2024, true", "1900, false", "2000, true", "2023, false"})
    void leapYears(int year, boolean expected) {
        assertEquals(expected, MathUtils.isLeapYear(year));
    }

    @Test
    void clampRejectsBadRange() {
        assertThrows(IllegalArgumentException.class, () -> MathUtils.clamp(1, 10, 0));
    }
}`,
    exercises: [{
      prompt: "Implement MathUtils so the tests above pass: isLeapYear(int y) (divisible by 4, except centuries unless divisible by 400), and clamp(int x, int lo, int hi) that throws IllegalArgumentException when lo > hi.",
      starter: `class MathUtils {
    static boolean isLeapYear(int y) {
        // your code
    }

    static int clamp(int x, int lo, int hi) {
        // your code
    }
}`,
      solution: `class MathUtils {
    static boolean isLeapYear(int y) {
        return y % 4 == 0 && (y % 100 != 0 || y % 400 == 0);
    }

    static int clamp(int x, int lo, int hi) {
        if (lo > hi) throw new IllegalArgumentException("lo must be <= hi");
        return Math.max(lo, Math.min(x, hi));
    }
}`,
      checks: ["isLeapYear: 2024 true, 1900 false, 2000 true, 2100 false", "clamp(5, 0, 10) -> 5, clamp(-1, 0, 10) -> 0, clamp(11, 0, 10) -> 10", "clamp(1, 10, 0) throws IllegalArgumentException"],
    }],
  },
];

const CS_LESSONS = [
  {
    id: "basics", title: "1. Basics: types, variables, control flow",
    body: `<p>C# is statically typed and runs on .NET. Modern projects (.NET 6+) allow <b>top-level statements</b>: you write code directly in <code>Program.cs</code> without a <code>Main</code> method.</p>
      <ul><li>Value types (<code>int, long, double, decimal, bool, char</code>, structs) hold data. Reference types (<code>string</code>, arrays, classes) point to it.</li>
      <li>Integer division truncates: <code>7 / 2 == 3</code>, <code>7 / 2.0 == 3.5</code>. Overflow wraps silently unless you use <code>checked(...)</code>.</li>
      <li>Loops: <code>for</code>, <code>foreach (var x in items)</code>, <code>while</code>. <code>var</code> infers the type.</li>
      <li>String interpolation: <code>$"{name} is {age}"</code>. Unlike Java, <code>==</code> on strings compares content.</li></ul>`,
    example: `int[] nums = { 3, 8, 1 };
int sum = 0;
foreach (int x in nums)
{
    if (x % 2 == 0) continue;           // skip evens
    sum += x;
}
Console.WriteLine(sum);                                     // 4
Console.WriteLine($"{7 / 2} {7 / 2.0} {-7 % 3}");            // 3 3.5 -1
long big = 3_000_000_000;                                   // too big for int
var name = "Ada";                                           // inferred as string
Console.WriteLine($"{name} {big}");
int max = int.MaxValue;
Console.WriteLine(max + 1);                                 // -2147483648: wraps
// checked(max + 1) would throw OverflowException instead`,
    exercises: [{
      prompt: "Write FizzBuzz(int n) returning a List<string> for 1..n: \"Fizz\" for multiples of 3, \"Buzz\" for 5, \"FizzBuzz\" for both, otherwise the number.",
      starter: `static List<string> FizzBuzz(int n)
{
    // your code
}`,
      solution: `static List<string> FizzBuzz(int n)
{
    var result = new List<string>();
    for (int i = 1; i <= n; i++)
    {
        if (i % 15 == 0) result.Add("FizzBuzz");
        else if (i % 3 == 0) result.Add("Fizz");
        else if (i % 5 == 0) result.Add("Buzz");
        else result.Add(i.ToString());
    }
    return result;
}`,
      checks: ["FizzBuzz(5) -> [1, 2, Fizz, 4, Buzz]", "FizzBuzz(15) ends with FizzBuzz", "FizzBuzz(0) -> []"],
    }],
  },
  {
    id: "strings", title: "2. Strings & StringBuilder",
    body: `<p>Strings are immutable. Use <code>StringBuilder</code> (namespace <code>System.Text</code>) to build big strings.</p>
      <ul><li><code>s.Length</code> (a property), <code>s[i]</code>, <code>s.Substring(start, length)</code> (length, not end!), <code>IndexOf</code>, <code>Split</code>, <code>string.Join</code>, <code>ToUpper</code>, <code>Trim</code>.</li>
      <li><code>s.Split(' ', StringSplitOptions.RemoveEmptyEntries)</code> drops empty pieces from repeated spaces.</li>
      <li>Case-insensitive compare: <code>string.Equals(a, b, StringComparison.OrdinalIgnoreCase)</code>. Null or empty check: <code>string.IsNullOrEmpty(s)</code>.</li>
      <li><code>char</code> helpers: <code>char.IsLetterOrDigit</code>, <code>char.ToLower</code>. <code>c - 'a'</code> gives 0-25.</li></ul>`,
    example: `using System.Text;

string s = "Hello, World";
Console.WriteLine($"{s.Length} {s[0]} {s.Substring(7, 5)}");   // 12 H World
Console.WriteLine(s.ToLower().IndexOf("world"));              // 7
string[] parts = "a,b,c".Split(',');
var sb = new StringBuilder();
foreach (string p in parts) sb.Append(p.ToUpper());
char[] chars = sb.ToString().ToCharArray();
Array.Reverse(chars);
Console.WriteLine(new string(chars));                         // CBA
Console.WriteLine("abc" == "ab" + "c");                       // True: == compares content
Console.WriteLine(string.Equals("Hi", "hi", StringComparison.OrdinalIgnoreCase));  // True
char c = 'a';
Console.WriteLine((char)(c + 2));                             // c`,
    exercises: [{
      prompt: "Write IsPalindrome(string s) that ignores case and non-alphanumeric characters. Use two pointers.",
      starter: `static bool IsPalindrome(string s)
{
    // your code
}`,
      solution: `static bool IsPalindrome(string s)
{
    int l = 0, r = s.Length - 1;
    while (l < r)
    {
        while (l < r && !char.IsLetterOrDigit(s[l])) l++;
        while (l < r && !char.IsLetterOrDigit(s[r])) r--;
        if (char.ToLower(s[l]) != char.ToLower(s[r])) return false;
        l++;
        r--;
    }
    return true;
}`,
      checks: ["\"A man, a plan, a canal: Panama\" -> True", "\"race a car\" -> False", "\"\" -> True"],
    }, {
      prompt: "Write ReverseWords(string s) that reverses word order and collapses extra spaces.",
      starter: `static string ReverseWords(string s)
{
    // your code
}`,
      solution: `static string ReverseWords(string s)
{
    string[] words = s.Split(' ', StringSplitOptions.RemoveEmptyEntries);
    Array.Reverse(words);
    return string.Join(" ", words);
}`,
      checks: ["\"  the sky  is blue \" -> \"blue is sky the\"", "\"one\" -> \"one\""],
    }],
  },
  {
    id: "arrays", title: "3. Arrays & List<T>",
    body: `<p>Arrays are fixed size (<code>arr.Length</code>). <code>List&lt;T&gt;</code> grows (<code>list.Count</code>) and stores <code>int</code> without boxing.</p>
      <ul><li><code>Array.Sort</code>, <code>Array.Reverse</code>, <code>Array.Fill</code>, <code>list.Sort()</code>, <code>list.Contains</code>, <code>list.IndexOf</code>.</li>
      <li>Trap: <code>list.Remove(7)</code> removes the <em>value</em> 7, while <code>list.RemoveAt(0)</code> removes <em>index</em> 0.</li>
      <li>Rectangular <code>int[,] grid = new int[3, 4]</code> (<code>grid[r, c]</code>) versus jagged <code>int[][]</code> (<code>grid[r][c]</code>). LeetCode uses jagged.</li>
      <li>Ranges (C# 8): <code>arr[1..3]</code>, <code>arr[^1]</code> is the last element.</li></ul>`,
    example: `int[] arr = { 5, 2, 9 };
Array.Sort(arr);
Console.WriteLine($"{string.Join(", ", arr)} {arr.Length}");    // 2, 5, 9 3

var list = new List<int> { 4, 7, 1 };
list.Add(3);
list.Remove(7);        // removes the VALUE 7
list.RemoveAt(0);      // removes the element at INDEX 0
list.Sort();
Console.WriteLine($"{string.Join(", ", list)} {list.Count}");   // 1, 3 2

int[,] grid = new int[3, 4];     // rectangular: grid[1, 2]
int[][] jagged = new int[3][];   // array of arrays: jagged[1][2]
int[] firstTwo = arr[..2];       // { 2, 5 }
int last = arr[^1];              // 9`,
    exercises: [{
      prompt: "Write RotateLeft(int[] a, int k) returning a NEW array rotated left by k. Handle k > length and an empty array.",
      starter: `static int[] RotateLeft(int[] a, int k)
{
    // your code
}`,
      solution: `static int[] RotateLeft(int[] a, int k)
{
    int n = a.Length;
    var result = new int[n];
    if (n == 0) return result;
    k %= n;
    for (int i = 0; i < n; i++) result[i] = a[(i + k) % n];
    return result;
}`,
      checks: ["[1, 2, 3, 4, 5], k = 2 -> [3, 4, 5, 1, 2]", "[1, 2, 3], k = 7 -> [2, 3, 1]", "[], k = 3 -> []"],
    }, {
      prompt: "Write Dedupe(List<int> nums) that removes duplicates but keeps first-seen order.",
      starter: `static List<int> Dedupe(List<int> nums)
{
    // your code
}`,
      solution: `static List<int> Dedupe(List<int> nums)
{
    var seen = new HashSet<int>();
    var result = new List<int>();
    foreach (int x in nums)
        if (seen.Add(x)) result.Add(x);     // Add returns false for duplicates
    return result;
}`,
      checks: ["[3, 1, 3, 2, 1] -> [3, 1, 2]", "[] -> []"],
    }],
  },
  {
    id: "maps", title: "4. Dictionary & HashSet",
    body: `<p><code>Dictionary&lt;TKey, TValue&gt;</code> and <code>HashSet&lt;T&gt;</code> give O(1) average lookups.</p>
      <ul><li><code>dict[key] = value</code> adds or overwrites, but <code>dict.Add(key, value)</code> <em>throws</em> if the key exists. Reading a missing key with <code>dict[key]</code> throws <code>KeyNotFoundException</code>.</li>
      <li>Safe reads: <code>TryGetValue(key, out var v)</code> or <code>GetValueOrDefault(key)</code>. Counting: <code>counts[w] = counts.GetValueOrDefault(w) + 1</code>.</li>
      <li><code>set.Add(x)</code> returns false for duplicates. Set algebra: <code>UnionWith</code>, <code>IntersectWith</code>, <code>ExceptWith</code>.</li>
      <li><code>SortedDictionary</code> and <code>SortedSet</code> keep keys ordered (O(log n)).</li></ul>`,
    example: `var counts = new Dictionary<string, int>();
foreach (string w in "the cat the dog".Split(' '))
    counts[w] = counts.GetValueOrDefault(w) + 1;
Console.WriteLine(counts["the"]);                         // 2
Console.WriteLine(counts.GetValueOrDefault("cow", 0));    // 0
if (counts.TryGetValue("cat", out int c)) Console.WriteLine(c);   // 1

var byLen = new SortedDictionary<int, List<string>>();   // keys kept sorted
foreach (string w in new[] { "hi", "cat", "ox", "dog" })
{
    if (!byLen.ContainsKey(w.Length)) byLen[w.Length] = new List<string>();
    byLen[w.Length].Add(w);
}
foreach (var (len, words) in byLen)
    Console.WriteLine($"{len}: {string.Join(", ", words)}");   // 2: hi, ox   then   3: cat, dog

var seen = new HashSet<int>();
Console.WriteLine($"{seen.Add(5)} {seen.Add(5)}");        // True False`,
    exercises: [{
      prompt: "Write WordCount(string text) returning a Dictionary of lowercase word -> count.",
      starter: `static Dictionary<string, int> WordCount(string text)
{
    // your code
}`,
      solution: `static Dictionary<string, int> WordCount(string text)
{
    var counts = new Dictionary<string, int>();
    foreach (string w in text.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries))
        counts[w] = counts.GetValueOrDefault(w) + 1;
    return counts;
}`,
      checks: ["\"the cat The dog\" -> {the: 2, cat: 1, dog: 1}", "\"\" -> {}"],
    }, {
      prompt: "Write FirstUniqueChar(string s) returning the index of the first non-repeating character, or -1. Assume lowercase a-z.",
      starter: `static int FirstUniqueChar(string s)
{
    // your code
}`,
      solution: `static int FirstUniqueChar(string s)
{
    var freq = new int[26];
    foreach (char ch in s) freq[ch - 'a']++;
    for (int i = 0; i < s.Length; i++)
        if (freq[s[i] - 'a'] == 1) return i;
    return -1;
}`,
      checks: ["\"leetcode\" -> 0", "\"loveleetcode\" -> 2", "\"aabb\" -> -1"],
    }],
  },
  {
    id: "methods", title: "5. Methods, ref/out & parameters",
    body: `<ul><li>Arguments are passed by value by default. For reference types the reference is copied, so a method can mutate the caller's list.</li>
      <li><code>ref</code> passes the variable itself (the caller sees reassignment). <code>out</code> is for extra return values (<code>int.TryParse(s, out int n)</code>).</li>
      <li>Optional parameters (<code>double h = 1</code>), named arguments (<code>Area(h: 2, w: 3)</code>), and <code>params int[]</code> for variable arguments.</li>
      <li>Expression-bodied members (<code>=&gt;</code>) and tuple returns: <code>(int Min, int Max) MinMax(...)</code>.</li></ul>`,
    example: `int a = 5;
AddOne(a);                              // no effect: a copy was changed
AddOneRef(ref a);                       // a is now 6
var list = new List<int>();
AddItem(list);
var (lo, hi) = MinMax(new[] { 4, 9, 1 });
Console.WriteLine($"{a} {list.Count} {Total(1, 2, 3)} {Area(h: 2, w: 3)} {lo} {hi}");  // 6 1 6 6 1 9

static void AddOne(int x) => x++;                          // copy: caller unaffected
static void AddOneRef(ref int x) => x++;                   // ref: caller's variable changes
static void AddItem(List<int> list) => list.Add(1);        // same list object
static int Total(params int[] nums) => nums.Sum();         // LINQ Sum
static double Area(double w, double h = 1) => w * h;       // optional parameter
static (int Min, int Max) MinMax(int[] arr) => (arr.Min(), arr.Max());   // tuple return`,
    exercises: [{
      prompt: "Write MaxOf(int first, params int[] rest) returning the largest argument.",
      starter: `static int MaxOf(int first, params int[] rest)
{
    // your code
}`,
      solution: `static int MaxOf(int first, params int[] rest)
{
    int best = first;
    foreach (int x in rest) best = Math.Max(best, x);
    return best;
}`,
      checks: ["MaxOf(3) -> 3", "MaxOf(3, 9, 4) -> 9", "MaxOf(-5, -2) -> -2"],
    }, {
      prompt: "Write Swap(ref int a, ref int b) that swaps two variables in the caller.",
      starter: `static void Swap(ref int a, ref int b)
{
    // your code
}`,
      solution: `static void Swap(ref int a, ref int b) => (a, b) = (b, a);   // tuple swap`,
      checks: ["int x = 1, y = 2; Swap(ref x, ref y); -> x == 2, y == 1"],
    }],
  },
  {
    id: "classes", title: "6. Classes, interfaces & records",
    body: `<ul><li>Classes are reference types; <code>struct</code>s are value types (copied on assignment).</li>
      <li><b>Properties</b> wrap fields: <code>public int Age { get; set; }</code>, <code>{ get; }</code> for read-only, <code>{ get; init; }</code> for set-once.</li>
      <li>Interfaces (<code>IComparable&lt;T&gt;</code>, <code>IEnumerable&lt;T&gt;</code>) define behaviour. A class can implement many but inherit from one base class (<code>virtual</code>/<code>override</code>).</li>
      <li><b>Records</b> (<code>record Point(int X, int Y);</code>) give value equality and <code>ToString</code> for free.</li>
      <li>With top-level statements, the statements go first and type declarations come after them in the file.</li></ul>`,
    example: `var shapes = new List<IShape> { new Circle(1), new Circle(2) };
double sum = 0;
foreach (var s in shapes) sum += s.Area();
Console.WriteLine(sum.ToString("F2"));           // 15.71
var pts = new HashSet<Point> { new Point(1, 2), new Point(1, 2) };
Console.WriteLine(pts.Count);                    // 1 (records compare by value)

interface IShape { double Area(); }

class Circle : IShape
{
    public double Radius { get; }                // read-only property
    public Circle(double radius) => Radius = radius;
    public double Area() => Math.PI * Radius * Radius;
    public override string ToString() => $"Circle({Radius})";
}

record Point(int X, int Y);                      // value equality, ToString for free`,
    exercises: [{
      prompt: "Implement class IntStack with Push, Pop, Peek, Count and IsEmpty. Pop and Peek on an empty stack should throw InvalidOperationException.",
      starter: `class IntStack
{
    // your code
}`,
      solution: `class IntStack
{
    private readonly List<int> items = new();

    public void Push(int x) => items.Add(x);

    public int Pop()
    {
        if (items.Count == 0) throw new InvalidOperationException("empty stack");
        int top = items[^1];
        items.RemoveAt(items.Count - 1);
        return top;
    }

    public int Peek() =>
        items.Count == 0 ? throw new InvalidOperationException("empty stack") : items[^1];

    public int Count => items.Count;
    public bool IsEmpty => items.Count == 0;
}`,
      checks: ["Push(1), Push(2) -> Peek() == 2, Count == 2", "Pop() -> 2, then Pop() -> 1", "Pop() on an empty stack throws InvalidOperationException"],
    }],
  },
  {
    id: "generics", title: "7. Generics, collections & sorting",
    body: `<ul><li>Generic collections: <code>List&lt;T&gt;</code>, <code>Dictionary&lt;K, V&gt;</code>, <code>HashSet&lt;T&gt;</code>, <code>Stack&lt;T&gt;</code>, <code>Queue&lt;T&gt;</code>, <code>PriorityQueue&lt;TElement, TPriority&gt;</code> (.NET 6+), <code>SortedSet&lt;T&gt;</code>.</li>
      <li>Generic methods with constraints: <code>static T MaxOf&lt;T&gt;(List&lt;T&gt; xs) where T : IComparable&lt;T&gt;</code>.</li>
      <li>Sort with a comparison lambda: <code>list.Sort((a, b) =&gt; a.Age.CompareTo(b.Age))</code>, or LINQ <code>OrderBy(...).ThenBy(...)</code> for a new sequence.</li>
      <li>Tuples like <code>(string Name, int Age)</code> make quick throwaway records.</li></ul>`,
    example: `var people = new List<(string Name, int Age)> { ("Ana", 31), ("Bo", 25), ("Cy", 31) };
people.Sort((a, b) => a.Age != b.Age ? b.Age.CompareTo(a.Age) : string.CompareOrdinal(a.Name, b.Name));
Console.WriteLine(people[0].Name);                                    // Ana (oldest, then by name)
Console.WriteLine(MaxOf(new List<string> { "pear", "fig", "apple" }));   // pear

var pq = new PriorityQueue<string, int>();     // min-heap on the priority
pq.Enqueue("low", 5);
pq.Enqueue("high", 1);
Console.WriteLine(pq.Dequeue());               // high

static T MaxOf<T>(List<T> items) where T : IComparable<T>   // generic method
{
    T best = items[0];
    foreach (T x in items) if (x.CompareTo(best) > 0) best = x;
    return best;
}`,
    exercises: [{
      prompt: "Write SortWords(List<string> words) returning a new list sorted by length, then alphabetically.",
      starter: `static List<string> SortWords(List<string> words)
{
    // your code
}`,
      solution: `static List<string> SortWords(List<string> words)
{
    var result = new List<string>(words);
    result.Sort((a, b) => a.Length != b.Length
        ? a.Length.CompareTo(b.Length)
        : string.CompareOrdinal(a, b));
    return result;
}`,
      checks: ["[pear, fig, apple, kiwi] -> [fig, kiwi, pear, apple]"],
    }, {
      prompt: "Write TopKFrequent(int[] nums, int k) returning the k most frequent values (any order), using a Dictionary and a PriorityQueue of size k.",
      starter: `static List<int> TopKFrequent(int[] nums, int k)
{
    // your code
}`,
      solution: `static List<int> TopKFrequent(int[] nums, int k)
{
    var freq = new Dictionary<int, int>();
    foreach (int x in nums) freq[x] = freq.GetValueOrDefault(x) + 1;

    var heap = new PriorityQueue<int, int>();      // min-heap by count
    foreach (var (num, count) in freq)
    {
        heap.Enqueue(num, count);
        if (heap.Count > k) heap.Dequeue();        // drop the least frequent
    }

    var result = new List<int>();
    while (heap.Count > 0) result.Add(heap.Dequeue());
    return result;
}`,
      checks: ["[1, 1, 1, 2, 2, 3], k = 2 -> contains 1 and 2", "[4], k = 1 -> [4]"],
    }],
  },
  {
    id: "exceptions", title: "8. Exceptions & null safety",
    body: `<ul><li><code>try / catch (SpecificException e) / finally</code>. Rethrow with <code>throw;</code> (not <code>throw e;</code>) to keep the stack trace.</li>
      <li>Signal bad input with <code>ArgumentException</code> or <code>ArgumentNullException</code>, and bad state with <code>InvalidOperationException</code>.</li>
      <li>Prefer the <b>Try pattern</b> to avoid exceptions for expected failures: <code>int.TryParse(s, out int n)</code>, <code>dict.TryGetValue</code>.</li>
      <li><code>using var file = ...;</code> disposes resources automatically.</li>
      <li>Nullable helpers: <code>string?</code>, <code>x?.Length</code> (null if x is null), <code>a ?? b</code> (fallback).</li></ul>`,
    example: `Console.WriteLine($"{Parse("42")} [{Parse("4x2")}]");          // 42 []  (null prints as empty)
Console.WriteLine(int.TryParse("17", out int n) ? n : -1);   // 17: no exception needed

try
{
    Divide(1, 0);
}
catch (ArgumentException e)
{
    Console.WriteLine($"caught: {e.Message}");
}
finally
{
    Console.WriteLine("always runs");
}

string? name = null;
Console.WriteLine(name?.Length ?? 0);                        // 0

static int? Parse(string s)
{
    try { return int.Parse(s.Trim()); }
    catch (FormatException) { return null; }
}

static int Divide(int a, int b)
{
    if (b == 0) throw new ArgumentException("b must not be 0", nameof(b));
    return a / b;
}`,
    exercises: [{
      prompt: "Write SafeDivide(double a, double b) returning a / b, or null when b is 0 (return type double?).",
      starter: `static double? SafeDivide(double a, double b)
{
    // your code
}`,
      solution: `static double? SafeDivide(double a, double b) => b == 0 ? null : a / b;`,
      checks: ["SafeDivide(6, 3) -> 2", "SafeDivide(1, 0) -> null"],
    }, {
      prompt: "Write ParseIntOr(string? s, int fallback) returning the parsed int, or fallback for null or invalid input. Use TryParse, not try/catch.",
      starter: `static int ParseIntOr(string? s, int fallback)
{
    // your code
}`,
      solution: `static int ParseIntOr(string? s, int fallback) =>
    int.TryParse(s?.Trim(), out int value) ? value : fallback;`,
      checks: ["ParseIntOr(\"12\", 0) -> 12", "ParseIntOr(\"abc\", 0) -> 0", "ParseIntOr(null, -1) -> -1", "ParseIntOr(\" 7 \", 0) -> 7"],
    }],
  },
  {
    id: "linq", title: "9. LINQ & lambdas",
    body: `<ul><li>A lambda is a short function: <code>x =&gt; x * 2</code>. It fits delegate types like <code>Func&lt;int, int&gt;</code> (returns a value) and <code>Action&lt;T&gt;</code> (returns nothing).</li>
      <li>LINQ chains queries over any collection: <code>Where</code>, <code>Select</code>, <code>OrderBy</code>/<code>ThenBy</code>, <code>GroupBy</code>, <code>Count</code>, <code>Sum</code>, <code>Any</code>, <code>All</code>, <code>First</code>, <code>ToList</code>, <code>ToDictionary</code>.</li>
      <li>LINQ is <b>lazy</b>: nothing runs until you enumerate or call <code>ToList()</code>/<code>Count()</code>.</li>
      <li>It reads well, but loops avoid allocations. In interviews, use whichever is clearer and mention the cost.</li></ul>`,
    example: `var nums = new List<int> { 1, 2, 3, 4, 5, 6 };
var evenSquares = nums.Where(n => n % 2 == 0).Select(n => n * n).ToList();   // 4, 16, 36
int total = nums.Sum();                                                       // 21
bool anyBig = nums.Any(n => n > 5);                                           // True

var byLength = new[] { "hi", "cat", "ox" }
    .GroupBy(w => w.Length)
    .ToDictionary(g => g.Key, g => g.Count());                                // {2: 2, 3: 1}

int[] squares = Enumerable.Range(0, 5).Select(i => i * i).ToArray();          // 0, 1, 4, 9, 16
Func<int, int> twice = x => x * 2;
Console.WriteLine($"{string.Join(", ", evenSquares)} {total} {anyBig} {twice(4)}");  // 4, 16, 36 21 True 8`,
    exercises: [{
      prompt: "Write SquaresOfEvens(List<int> nums) using LINQ.",
      starter: `static List<int> SquaresOfEvens(List<int> nums)
{
    // your code
}`,
      solution: `static List<int> SquaresOfEvens(List<int> nums) =>
    nums.Where(n => n % 2 == 0).Select(n => n * n).ToList();`,
      checks: ["[1, 2, 3, 4] -> [4, 16]", "[] -> []"],
    }, {
      prompt: "Write JoinUpper(List<string> words) returning the words uppercased and joined with \", \".",
      starter: `static string JoinUpper(List<string> words)
{
    // your code
}`,
      solution: `static string JoinUpper(List<string> words) =>
    string.Join(", ", words.Select(w => w.ToUpper()));`,
      checks: ["[a, b] -> \"A, B\"", "[] -> \"\""],
    }],
  },
  {
    id: "recursion", title: "10. Recursion & Big-O in C#",
    body: `<ul><li>Deep recursion causes a <code>StackOverflowException</code>, which <b>cannot be caught</b>: the process dies. Use a loop or an explicit <code>Stack&lt;T&gt;</code> for deep inputs.</li>
      <li>Memoize with an array or <code>Dictionary</code> to turn exponential recursion into linear.</li>
      <li>Arithmetic wraps on overflow by default. Wrap risky math in <code>checked(...)</code> or use <code>long</code>.</li>
      <li>Costs to know: <code>List.Add</code> O(1) amortized, <code>Insert(0, x)</code> O(n), <code>Dictionary</code> O(1) average, <code>SortedDictionary</code> O(log n), <code>List.Sort</code> O(n log n), string <code>+=</code> in a loop O(n²). LINQ adds allocations.</li></ul>`,
    example: `var memo = new long[91];
Console.WriteLine(Fib(90));                 // 2880067194370816120
Console.WriteLine(Power(2, 30));            // 1073741824

long Fib(int n)                             // memoized: O(n) instead of O(2^n)
{
    if (n < 2) return n;
    if (memo[n] != 0) return memo[n];
    return memo[n] = Fib(n - 1) + Fib(n - 2);
}

static long Power(long x, int n)            // fast exponentiation: O(log n)
{
    if (n == 0) return 1;
    long half = Power(x, n / 2);
    return n % 2 == 0 ? half * half : half * half * x;
}`,
    exercises: [{
      prompt: "Write SumDigits(int n) recursively for n >= 0 (1234 -> 10).",
      starter: `static int SumDigits(int n)
{
    // your code
}`,
      solution: `static int SumDigits(int n) => n < 10 ? n : n % 10 + SumDigits(n / 10);`,
      checks: ["SumDigits(1234) -> 10", "SumDigits(7) -> 7", "SumDigits(0) -> 0"],
    }, {
      prompt: "Write GridPaths(int r, int c, long[,] memo): paths from the top-left to the bottom-right of an r x c grid moving only right or down, memoized.",
      starter: `static long GridPaths(int r, int c, long[,] memo)
{
    // your code
}
// call: GridPaths(3, 7, new long[4, 8])`,
      solution: `static long GridPaths(int r, int c, long[,] memo)
{
    if (r == 1 || c == 1) return 1;
    if (memo[r, c] != 0) return memo[r, c];
    return memo[r, c] = GridPaths(r - 1, c, memo) + GridPaths(r, c - 1, memo);
}`,
      checks: ["GridPaths(3, 7, new long[4, 8]) -> 28", "GridPaths(1, 1, new long[2, 2]) -> 1", "GridPaths(2, 2, new long[3, 3]) -> 2"],
    }],
  },
  {
    id: "testing", title: "11. Testing with xUnit (your QA edge)",
    body: `<p>xUnit is the most common .NET test framework (NUnit and MSTest are similar). Run tests with <code>dotnet test</code>.</p>
      <ul><li><code>[Fact]</code> is a single test. <code>[Theory]</code> with <code>[InlineData(...)]</code> runs a table of cases, like a test-case matrix.</li>
      <li><code>Assert.Equal(expected, actual)</code>, <code>Assert.True</code>, <code>Assert.Throws&lt;ArgumentException&gt;(() =&gt; ...)</code>.</li>
      <li>Name tests <code>Method_Scenario_Expected</code> and follow arrange, act, assert.</li>
      <li>In interviews: narrate a normal case, edge cases (empty, single, negatives, <code>int.MaxValue</code>) and a tricky case.</li></ul>`,
    example: `using Xunit;

public class MathUtilsTests
{
    [Fact]
    public void Clamp_ValueInRange_ReturnsValue()
    {
        Assert.Equal(5, MathUtils.Clamp(5, 0, 10));
        Assert.Equal(0, MathUtils.Clamp(-1, 0, 10));
        Assert.Equal(10, MathUtils.Clamp(11, 0, 10));
    }

    [Theory]
    [InlineData(2024, true)]
    [InlineData(1900, false)]
    [InlineData(2000, true)]
    [InlineData(2023, false)]
    public void IsLeapYear_FollowsGregorianRules(int year, bool expected)
    {
        Assert.Equal(expected, MathUtils.IsLeapYear(year));
    }

    [Fact]
    public void Clamp_BadRange_Throws()
    {
        Assert.Throws<ArgumentException>(() => MathUtils.Clamp(1, 10, 0));
    }
}`,
    exercises: [{
      prompt: "Implement MathUtils so the tests above pass: IsLeapYear(int y), and Clamp(int x, int lo, int hi) that throws ArgumentException when lo > hi.",
      starter: `public static class MathUtils
{
    public static bool IsLeapYear(int y)
    {
        // your code
    }

    public static int Clamp(int x, int lo, int hi)
    {
        // your code
    }
}`,
      solution: `public static class MathUtils
{
    public static bool IsLeapYear(int y) => y % 4 == 0 && (y % 100 != 0 || y % 400 == 0);

    public static int Clamp(int x, int lo, int hi)
    {
        if (lo > hi) throw new ArgumentException("lo must be <= hi");
        return Math.Max(lo, Math.Min(x, hi));
    }
}`,
      checks: ["IsLeapYear: 2024 True, 1900 False, 2000 True, 2100 False", "Clamp(5, 0, 10) -> 5, Clamp(-1, 0, 10) -> 0, Clamp(11, 0, 10) -> 10", "Clamp(1, 10, 0) throws ArgumentException"],
    }],
  },
];

// Verified videos (YouTube oEmbed: channel + title) per lesson, plus full courses.
const LANG_VIDEOS = {
  java: {
    courses: [V("eIrMbAQSU34", "Java Full Course for Beginners", "Programming with Mosh"), V("grEKMHGYyns", "Learn Java 8 - Full Tutorial for Beginners", "freeCodeCamp.org"), V("xk4_1vDrzzo", "Java Full Course for free", "Bro Code")],
    basics: [V("drQK8ciCAjY", "Learn Java in One Video - 15-minute Crash Course", "Coding with John")],
    strings: [V("Ntl3DxhyrQQ", "Useful string methods in Java!", "Bro Code")],
    arrays: [V("9dr2mHYYoug", "Learn Java arrays in 9 minutes!", "Bro Code"), V("wsTSREgCE5E", "Learn Java arraylists in 9 minutes!", "Bro Code")],
    maps: [V("H62Jfv1DJlU", "Map and HashMap in Java - Full Tutorial", "Coding with John"), V("WPcKwA5WF7s", "Java HashSet Tutorial", "Coders Campus")],
    methods: [V("-Y67pdWHr9Y", "Static vs Non-Static Variables and Methods In Java", "Coding with John")],
    classes: [],
    generics: [V("K1iu1kXkVoA", "Generics In Java - Full Simple Tutorial", "Coding with John")],
    exceptions: [V("1XAfapkBQjk", "Exception Handling in Java Tutorial", "Coding with John")],
    lambdas: [V("tj5sLSFjVj4", "Lambda Expressions in Java - Full Simple Tutorial", "Coding with John"), V("yv9Q2E39kJM", "Java Streams Crash Course", "camelCase")],
    recursion: [V("k-7jJP7QFEM", "Recursion in Java Full Tutorial", "Coding with John")],
    testing: [V("flpmSXVTqBI", "Java Testing - JUnit 5 Crash Course", "freeCodeCamp.org")],
  },
  cs: {
    courses: [V("GhQdlIFylQ8", "C# Tutorial - Full Course for Beginners", "freeCodeCamp.org"), V("gfkTfcpWqAY", "C# Tutorial For Beginners - Learn C# Basics in 1 Hour", "Programming with Mosh"), V("wxznTygnRfQ", "C# Full Course for free", "Bro Code")],
    basics: [V("IxBMVztdlr4", "C# variables", "Bro Code")],
    strings: [V("BKYBiUAWZKM", "C# string methods", "Bro Code")],
    arrays: [V("IHMmPVEOT64", "C# arrays", "Bro Code"), V("vQzREQUhGSA", "C# Lists", "Bro Code")],
    maps: [V("R94JHIXdTk0", "The Dictionary Data Structure in C# in 10 Minutes", "IAmTimCorey"), V("4Mi4OuSMo4A", "C# Collections: List, HashSet, Dictionary", "Coderversity")],
    methods: [V("IPpEefuFiVM", "C# methods", "Bro Code")],
    classes: [V("9V5B3dNoVIA", "C# classes", "Bro Code")],
    generics: [V("8bfaqFDJ3ME", "Generics in C# for Beginners", "CodeBeauty")],
    exceptions: [V("QqWfw_CFR6Q", "C# exception handling", "Bro Code")],
    linq: [V("3ZfwqWl-YI0", "What are Delegates? (Lambda, Action, Func)", "Code Monkey"), V("j59mfvCBC4Y", "LINQ Ordering and Aggregates in C#", "Metrik Rule")],
    recursion: [V("ELjaRNQ4qWQ", "Introduction to Recursion in C#", "Jeff Chastine")],
    testing: [V("mtlE-iHIrH0", "C# Unit Tests Using xUnit (.NET)", "MatthiWare")],
  },
};
