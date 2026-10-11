// Programming principles: step 1 of the Learn path. The ideas behind the code, with the same example
// in Python, Java and C#, then a short quiz. Text fields may use `backticks` for inline code.
// Java/C# snippets are focused fragments, like the data-structure lessons: put statements in a method
// (C# also allows top-level statements, with type declarations after them) and keep the imports shown.
// Quiz: `a` is the index of the right option; `why` is shown after answering.

const PRINCIPLES = [
  // ---------------- core building blocks ----------------
  {
    id: "variables", name: "Variables, values & types", short: "Va", part: "Core building blocks",
    yt: "variables and data types programming explained for beginners",
    what: "A variable is a name for a value. Every value has a type (whole number, decimal, text, true/false, list...) that decides what you can do with it. Java and C# are statically typed: a variable's type is fixed when you write the code, and the compiler rejects mistakes before the program runs. Python is dynamically typed: the type belongs to the value and is checked while the program runs.",
    points: [
      "Assignment (`x = 5`) binds a name to a value; assigning again rebinds the name.",
      "Pick the type that fits the data: an integer for counts, a boolean for yes/no flags, a decimal for measurements. Don't store everything as text.",
      "Decimals (`float`, `double`) are approximations: `0.1 + 0.2` is not exactly `0.3`.",
      "Java and C# `int` is 32 bits (about ±2.1 billion) and silently wraps around when it overflows. Python integers grow as needed.",
      "Constants are names that never change (`MAX_RETRIES`, `final`, `const`). They make intent clear and remove magic numbers.",
    ],
    code: {
      py: `count = 3                 # int
price = 9.99              # float
name = "Ada"              # str
ready = True              # bool
print(type(count).__name__, type(name).__name__)   # int str

count = count + 1         # rebinding: count now names 4
x = 0.1 + 0.2
print(x == 0.3, abs(x - 0.3) < 1e-9)   # False True: floats are approximate

big = 2 ** 40             # Python ints grow as needed
print(big)                # 1099511627776
MAX_RETRIES = 3           # a constant, by convention (UPPER_CASE)`,
      java: `int count = 3;                    // the type is fixed: only ints
double price = 9.99;
String name = "Ada";
boolean ready = true;
var total = count * 2;            // type inferred (int), still static

count = count + 1;                // 4
double x = 0.1 + 0.2;
System.out.println(x == 0.3);                 // false: floats are approximate
System.out.println(Math.abs(x - 0.3) < 1e-9); // true

int max = Integer.MAX_VALUE;      // 2147483647
System.out.println(max + 1);      // -2147483648: overflow wraps around
long big = 1L << 40;              // use long for big numbers
final int MAX_RETRIES = 3;        // can't be reassigned`,
      cs: `int count = 3;                    // the type is fixed: only ints
double price = 9.99;
string name = "Ada";
bool ready = true;
var total = count * 2;            // type inferred (int), still static

count = count + 1;                // 4
double x = 0.1 + 0.2;
Console.WriteLine(x == 0.3);                  // False: floats are approximate
Console.WriteLine(Math.Abs(x - 0.3) < 1e-9);  // True

int max = int.MaxValue;           // 2147483647
Console.WriteLine(unchecked(max + 1));  // -2147483648: overflow wraps around
long big = 1L << 40;              // use long for big numbers
const int MaxRetries = 3;         // a compile-time constant`,
    },
    pitfalls: [
      "Comparing decimals with `==`. Compare the difference against a small tolerance instead.",
      "Overflow in Java and C#: `(lo + hi) / 2` can overflow on large indexes; write `lo + (hi - lo) / 2`.",
      "Integer division: in Java and C# `7 / 2` is `3`. Python's `/` gives `3.5`, and `//` gives `3`.",
      "Reusing one variable for two different meanings makes code hard to follow.",
    ],
    interview: "Overflow is a favourite follow-up in Java and C#: if you sum large values or compute a midpoint, say why you use `long` or `lo + (hi - lo) / 2`.",
    quiz: [
      { id: "var1", q: "In Java, `int` holds up to about 2.1 billion. What happens when you add 1 to `Integer.MAX_VALUE`?",
        options: ["It throws an exception", "It becomes a `long` automatically", "It wraps around to a large negative number", "It stays at the maximum"], a: 2,
        why: "Java and C# integers wrap around silently (C# can be told to check with `checked`). Python integers never overflow." },
      { id: "var2", q: "`0.1 + 0.2 == 0.3` is false in Python, Java and C#. What's the right way to compare two decimals?",
        options: ["Check that their difference is smaller than a tiny tolerance", "Convert both to strings and compare", "Round both to whole numbers", "Use `===` instead"], a: 0,
        why: "Binary floating point can't store 0.1 exactly, so tiny errors creep in. `abs(a - b) < 1e-9` treats nearly-equal values as equal." },
      { id: "var3", q: "What does static typing (Java, C#) give you that dynamic typing (Python) doesn't?",
        options: ["Variables that can never change", "Automatic memory management", "Faster typing at the keyboard", "Type mistakes caught before the program runs"], a: 3,
        why: "The compiler checks types up front. Python finds the same mistakes only when that line actually runs (type hints plus a checker like mypy get you part of the way)." },
    ],
  },
  {
    id: "control", name: "Control flow: decisions & loops", short: "If", part: "Core building blocks",
    yt: "control flow if else loops programming explained",
    what: "Code runs top to bottom unless control flow changes the path. Branches (`if` / `else`, `switch` / `match`) choose between paths, loops (`for`, `while`) repeat work, and `break`, `continue` and `return` leave early. Conditions are boolean expressions combined with `and` / `or` / `not`.",
    points: [
      "Use `for` to go over a collection or a known range, and `while` to repeat until something happens.",
      "Every loop needs a condition that eventually becomes false. Know what changes on each pass.",
      "`and` / `or` short-circuit: in `a and b`, `b` isn't evaluated when `a` is false. Use that to guard risky checks.",
      "Guard clauses (return early for special cases) keep the main logic flat instead of deeply nested.",
      "Decide whether ranges include their end. Half-open ranges, `[start, end)`, are the usual choice and avoid off-by-one errors.",
    ],
    code: {
      py: `def classify(n):
    if n < 0:                     # guard clause: handle the special case first
        return "negative"
    if n == 0:
        return "zero"
    return "even" if n % 2 == 0 else "odd"

print([classify(x) for x in (-2, 0, 3, 8)])   # ['negative', 'zero', 'odd', 'even']

for i in range(3):                 # 0, 1, 2: the end is excluded
    if i == 1:
        continue                   # skip the rest of this pass
    print("i =", i)                # i = 0, then i = 2

nums, i = [4, 7, -1, 9], 0
while i < len(nums) and nums[i] >= 0:   # short-circuit guards the index
    i += 1
print("first negative at", i)      # first negative at 2`,
      java: `static String classify(int n) {
    if (n < 0) return "negative";      // guard clause: handle the special case first
    if (n == 0) return "zero";
    return n % 2 == 0 ? "even" : "odd";
}

for (int i = 0; i < 3; i++) {          // 0, 1, 2: the end is excluded
    if (i == 1) continue;              // skip the rest of this pass
    System.out.println("i = " + i);
}

int[] nums = {4, 7, -1, 9};
int i = 0;
while (i < nums.length && nums[i] >= 0) i++;   // && short-circuits
System.out.println("first negative at " + i);  // 2

switch (classify(7)) {                 // arrow switch (Java 14+)
    case "odd" -> System.out.println("odd one");
    default -> System.out.println("something else");
}`,
      cs: `static string Classify(int n)
{
    if (n < 0) return "negative";      // guard clause: handle the special case first
    if (n == 0) return "zero";
    return n % 2 == 0 ? "even" : "odd";
}

for (int i = 0; i < 3; i++)            // 0, 1, 2: the end is excluded
{
    if (i == 1) continue;              // skip the rest of this pass
    Console.WriteLine($"i = {i}");
}

int[] nums = { 4, 7, -1, 9 };
int j = 0;
while (j < nums.Length && nums[j] >= 0) j++;   // && short-circuits
Console.WriteLine($"first negative at {j}");   // 2

string msg = Classify(7) switch        // switch expression
{
    "odd" => "odd one",
    _ => "something else",
};`,
    },
    pitfalls: [
      "A `while` loop that never changes its condition runs forever.",
      "Adding or removing items in a list while looping over it skips or repeats items.",
      "`=` (assign) versus `==` (compare).",
      "Off by one: `range(1, n)` stops at `n - 1`.",
    ],
    interview: "Say your loop bounds out loud (\"`left` starts at 0, `right` at the last index, stop when they cross\") and check the empty and one-element cases before you run anything.",
    quiz: [
      { id: "ctl1", q: "How many times does `for i in range(2, 5)` (or `for (int i = 2; i < 5; i++)`) run?",
        options: ["2", "3", "4", "5"], a: 1, why: "It runs for 2, 3 and 4. The end of the range is excluded." },
      { id: "ctl2", q: "Why write `i < len(nums) and nums[i] > 0` in that order?",
        options: ["Python evaluates conditions right to left", "The order doesn't matter", "If `i` is out of range, the second check is skipped instead of crashing", "It's shorter to type"], a: 2,
        why: "`and` stops at the first false part, so the bounds check protects the index lookup." },
      { id: "ctl3", q: "What's a guard clause?",
        options: ["An early return that handles a special case first, so the main logic isn't nested", "A comment explaining a loop", "A try/catch block", "A loop that never ends"], a: 0,
        why: "Handling odd cases up front (`if not nums: return 0`) leaves the normal path at the top level, which is easier to read." },
    ],
  },
  {
    id: "functions", name: "Functions, parameters & scope", short: "Fn", part: "Core building blocks",
    yt: "functions parameters return values scope programming explained",
    what: "A function puts a few steps behind a name: inputs come in as parameters, and the result goes out as the return value. Functions let you reuse code, test pieces on their own, and name an idea so the code reads like the solution. Names created inside a function are local: they exist only while that call runs.",
    points: [
      "One function, one job. Name it with a verb that says what it does: `parse_date`, `isValid`, `CountWords`.",
      "Pass data in and return results. Reading and writing global variables hides what a function depends on.",
      "Local scope: a variable made inside a function disappears when the function returns.",
      "Default parameters (Python, C#) and overloading (Java, C#) give callers shorter ways to call the same function.",
      "Functions are values too: you can pass one to `sorted`, a comparator or `map`. Short ones can be lambdas.",
    ],
    code: {
      py: `def area(width, height=1):          # height has a default
    """Return the area of a rectangle."""
    return width * height

print(area(3, 4), area(5))          # 12 5

total = 0                           # a global
def add_all(nums):
    total = sum(nums)               # a NEW local 'total'; the global is untouched
    return total

print(add_all([1, 2, 3]), total)    # 6 0

words = ["pear", "fig", "banana"]
print(sorted(words, key=len))       # a function as a value: ['fig', 'pear', 'banana']
square = lambda x: x * x            # a small anonymous function
print(list(map(square, [1, 2, 3]))) # [1, 4, 9]`,
      java: `import java.util.*;
import java.util.function.Function;

static int area(int width, int height) { return width * height; }
static int area(int width) { return area(width, 1); }   // overloading instead of a default

System.out.println(area(3, 4) + " " + area(5));        // 12 5

List<String> words = new ArrayList<>(List.of("pear", "fig", "banana"));
words.sort(Comparator.comparingInt(String::length));   // a function passed as a value
System.out.println(words);                             // [fig, pear, banana]

Function<Integer, Integer> square = x -> x * x;        // a lambda
System.out.println(square.apply(4));                   // 16`,
      cs: `using System;
using System.Collections.Generic;
using System.Linq;

static int Area(int width, int height = 1) => width * height;   // default parameter

Console.WriteLine($"{Area(3, 4)} {Area(5)}");          // 12 5

var words = new List<string> { "pear", "fig", "banana" };
words.Sort((a, b) => a.Length.CompareTo(b.Length));    // a function passed as a value
Console.WriteLine(string.Join(", ", words));           // fig, pear, banana

Func<int, int> square = x => x * x;                    // a lambda
Console.WriteLine(string.Join(", ", new[] { 1, 2, 3 }.Select(square)));   // 1, 4, 9`,
    },
    pitfalls: [
      "Python's mutable default: `def f(x, seen=[])` shares one list across every call. Use `seen=None`, then create the list inside.",
      "Functions that compute and also print are hard to test and reuse. Return the value; print at the edge.",
      "More than three or four parameters usually means they belong together in an object.",
      "Depending on globals: the function silently changes behaviour when someone else changes the global.",
    ],
    interview: "Split a solution into small helpers (`in_bounds(r, c)`, `neighbors(node)`). The interviewer follows it faster, and a bug is easier to find in a five-line function.",
    quiz: [
      { id: "fn1", q: "In Python, what goes wrong with `def visit(node, seen=[])`?",
        options: ["It's a syntax error", "`seen` is always empty", "Nothing, it's fine", "The same list is shared by every call that uses the default"], a: 3,
        why: "Default values are created once, when the function is defined, so every call shares that one list. Use `seen=None` and `if seen is None: seen = []`." },
      { id: "fn2", q: "Which function is easiest to test?",
        options: ["One that takes values and returns a result", "One that reads `input()`, computes and prints", "One that changes a global variable", "One with no parameters that reads a file"], a: 0,
        why: "A test just calls it with inputs and checks the return value: no keyboard, files or shared state involved." },
      { id: "fn3", q: "A variable created inside a function...",
        options: ["...is visible everywhere in the program", "...exists only while that call runs (local scope)", "...becomes a global after the function returns", "...is shared by every function in the file"], a: 1,
        why: "Each call gets its own local variables, which disappear when it returns. That's why recursion works: each call has its own copy." },
    ],
  },
  {
    id: "references", name: "Data, references & mutability", short: "Rf", part: "Core building blocks",
    yt: "mutable vs immutable references aliasing shallow deep copy explained",
    what: "Some values can't change: numbers, strings and tuples are immutable, so \"changing\" one creates a new value. Others are mutable: lists, dictionaries and most objects change in place. A variable holding an object holds a reference to it, so two names can point at the same object (aliasing), and a change through one name shows through the other.",
    points: [
      "`b = a` doesn't copy a list or object. It gives the same object a second name.",
      "A shallow copy makes a new outer container that still shares the items inside. A deep copy copies everything.",
      "String methods return new strings; the original never changes.",
      "Equality: Python's `==` and Java's `.equals` compare contents; Python's `is` and Java's `==` (for objects) ask whether it's the same object.",
      "C# structs and Java/C# primitives are value types: assignment copies the value itself.",
    ],
    code: {
      py: `a = [1, 2, 3]
b = a                    # b is another name for the SAME list
b.append(4)
print(a)                 # [1, 2, 3, 4]: a changed too

c = a[:]                 # shallow copy: a new outer list
c.append(5)
print(a, c)              # [1, 2, 3, 4] [1, 2, 3, 4, 5]

s = "hi"
t = s.upper()            # strings are immutable: upper() returns a NEW string
print(s, t)              # hi HI

grid = [[0, 0]] * 2      # trap: two references to ONE inner list
grid[0][0] = 9
print(grid)              # [[9, 0], [9, 0]]

import copy
nested = [[1], [2]]
deep = copy.deepcopy(nested)   # copies the inner lists too
deep[0].append(99)
print(nested, deep)      # [[1], [2]] [[1, 99], [2]]`,
      java: `import java.util.*;

List<Integer> a = new ArrayList<>(List.of(1, 2, 3));
List<Integer> b = a;                      // the same list, two names
b.add(4);
System.out.println(a);                    // [1, 2, 3, 4]

List<Integer> c = new ArrayList<>(a);     // shallow copy: a new list
c.add(5);
System.out.println(a + " " + c);          // [1, 2, 3, 4] [1, 2, 3, 4, 5]

String s = "hi";
String t = s.toUpperCase();               // Strings are immutable
System.out.println(s + " " + t);          // hi HI

String x = new String("hi");
System.out.println(x == s);               // false: two different objects
System.out.println(x.equals(s));          // true: same contents`,
      cs: `using System;
using System.Collections.Generic;

var a = new List<int> { 1, 2, 3 };
var b = a;                                // the same list, two names
b.Add(4);
Console.WriteLine(string.Join(",", a));   // 1,2,3,4

var c = new List<int>(a);                 // shallow copy: a new list
c.Add(5);
Console.WriteLine($"{a.Count} {c.Count}"); // 4 5

string s = "hi";
string t = s.ToUpper();                   // strings are immutable
Console.WriteLine($"{s} {t}");            // hi HI

var p1 = new Point(1, 2);                 // a struct is a value type:
var p2 = p1;                              // assignment copies it
p2.X = 9;
Console.WriteLine($"{p1.X} {p2.X}");      // 1 9

struct Point { public int X, Y; public Point(int x, int y) { X = x; Y = y; } }`,
    },
    pitfalls: [
      "`[[0] * n] * m` in Python makes `m` references to one row. Use `[[0] * n for _ in range(m)]`.",
      "Backtracking: `res.append(path)` stores the same list every time. Store a copy: `res.append(path[:])`.",
      "Returning an internal list lets callers change your object's state behind its back.",
      "Comparing strings with `==` in Java checks identity, not contents. Use `.equals`.",
    ],
    interview: "The backtracking copy bug is a classic: if every result comes out empty, you appended the shared `path` instead of a copy.",
    quiz: [
      { id: "ref1", q: "After `b = a` (where `a` is a list) and `b.append(4)`, what is `a`?",
        options: ["Unchanged, because `b` is a copy", "Also ends with 4: `a` and `b` are the same list", "An error is raised", "Empty"], a: 1,
        why: "Assignment copies the reference, not the list. Use `a[:]`, `list(a)` or `new ArrayList<>(a)` to get a separate copy." },
      { id: "ref2", q: "In a backtracking solution you collect results with `res.append(path)`, and at the end every result is empty. Why?",
        options: ["`append` doesn't work inside recursion", "Python lists can't hold other lists", "The recursion never reached a base case", "Every entry is the same `path` list, which ended up empty after backtracking"], a: 3,
        why: "Each result points at one shared list that keeps changing. Append a snapshot instead: `res.append(path[:])` or `new ArrayList<>(path)`." },
      { id: "ref3", q: "In Java, why can `s1 == s2` be false for two strings that both read \"hi\"?",
        options: ["`==` checks whether they're the same object; `.equals` compares contents", "Strings are mutable in Java", "`==` only works on numbers", "It's a compiler bug"], a: 0,
        why: "For objects, `==` compares references. Use `.equals` for contents. (C# overloads `==` on strings to compare contents.)" },
    ],
  },
  {
    id: "recursion", name: "Recursion", short: "Rc", part: "Core building blocks",
    yt: "recursion explained base case call stack",
    what: "A recursive function solves a problem by calling itself on a smaller version of the same problem. It needs a base case, a version small enough to answer directly, and every call must move toward it. Recursion fits naturally on recursive shapes: trees, nested lists, divide and conquer, and backtracking.",
    points: [
      "Write the base case first, then trust the recursive call to solve the smaller problem.",
      "Each call gets its own frame on the call stack, holding its own parameters and locals.",
      "Depth matters: recursion `h` levels deep uses O(h) extra memory, and very deep recursion overflows the stack.",
      "If the same subproblem comes up again and again, cache its answer (memoization). That's the first step towards dynamic programming.",
      "Any recursion can be rewritten as a loop with an explicit stack, when depth is a concern.",
    ],
    code: {
      py: `def factorial(n):
    if n <= 1:                    # base case: stops the recursion
        return 1
    return n * factorial(n - 1)   # a smaller problem each time

print(factorial(5))               # 120

def depth(tree):                  # a tree is a node plus two smaller trees
    if tree is None:
        return 0
    left, right = tree
    return 1 + max(depth(left), depth(right))

print(depth(((None, None), (None, (None, None)))))   # 3

from functools import cache
@cache                            # memoization: each n is computed once
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(80))                    # 23416728348467685`,
      java: `import java.util.*;

static long factorial(int n) {
    if (n <= 1) return 1;              // base case: stops the recursion
    return n * factorial(n - 1);       // a smaller problem each time
}

static Map<Integer, Long> memo = new HashMap<>();
static long fib(int n) {
    if (n < 2) return n;
    if (memo.containsKey(n)) return memo.get(n);   // memoization
    long v = fib(n - 1) + fib(n - 2);
    memo.put(n, v);
    return v;
}

System.out.println(factorial(5));      // 120
System.out.println(fib(80));           // 23416728348467685`,
      cs: `using System;
using System.Collections.Generic;

long Factorial(int n) => n <= 1 ? 1 : n * Factorial(n - 1);   // base case, then a smaller problem

var memo = new Dictionary<int, long>();
long Fib(int n)
{
    if (n < 2) return n;
    if (memo.TryGetValue(n, out var v)) return v;   // memoization
    return memo[n] = Fib(n - 1) + Fib(n - 2);
}

Console.WriteLine(Factorial(5));       // 120
Console.WriteLine(Fib(80));            // 23416728348467685`,
    },
    pitfalls: [
      "A missing or unreachable base case recurses until the stack overflows.",
      "Python stops at about 1,000 levels by default. For deep inputs, use a loop with an explicit stack.",
      "Plain recursive Fibonacci repeats work exponentially. Memoize, or build the answer bottom-up.",
      "Backtracking that changes shared state must undo the change after the recursive call.",
    ],
    interview: "State the base case and what each call returns before writing code, and count the call stack in your space complexity: a recursive DFS is O(h) space.",
    quiz: [
      { id: "rec1", q: "What two things does every recursive function need?",
        options: ["A loop and a counter", "A base case, and a step that moves toward it", "A global variable and a return value", "Two recursive calls"], a: 1,
        why: "The base case ends the recursion; each step must shrink the problem, or it never gets there." },
      { id: "rec2", q: "Why is plain recursive `fib(n)` so slow?",
        options: ["It recomputes the same values exponentially many times", "Recursion is always slower than loops", "Additions are slow", "It uses floating point"], a: 0,
        why: "`fib(n-1)` and `fib(n-2)` both compute `fib(n-3)`, and so on down the tree. Caching each answer makes it O(n)." },
      { id: "rec3", q: "A recursive function walks a tree of height `h`. How much extra memory does the call stack use?",
        options: ["O(1)", "O(log n) always", "O(n²)", "O(h)"], a: 3,
        why: "At most `h` calls are active at once, one per level. For a balanced tree that's O(log n); for a line-shaped one, O(n)." },
    ],
  },
  // ---------------- how code runs ----------------
  {
    id: "memory", name: "Memory, the call stack & passing values", short: "Me", part: "How code runs",
    yt: "stack vs heap memory call stack pass by value vs reference explained",
    what: "When a function is called, it gets a frame on the call stack holding its parameters and local variables; the frame is removed when the call returns. Objects (lists, class instances) live on the heap and stay as long as something refers to them; a garbage collector frees them after that. Passing an argument copies what the variable holds: for a number that's the value, for an object it's a reference to the same object.",
    points: [
      "The call stack is why a function's locals are separate from its caller's, and why recursion uses memory.",
      "Python, Java and C# pass a copy of what the variable holds. For objects that's a reference, so the function can change the object but can't make the caller's variable point somewhere else.",
      "Changing an object inside a function (`items.append(x)`) is visible to the caller. Reassigning the parameter (`items = []`) isn't.",
      "C#'s `ref` and `out` pass the caller's variable itself, so the function can reassign it.",
      "Garbage collection frees unreachable objects. Leaks still happen when something, like a cache, keeps references you no longer need.",
    ],
    code: {
      py: `def grow(items):
    items.append("new")      # changes the caller's list: the reference was copied
    items = ["other"]        # rebinding only changes the local name
    return items

mine = ["a"]
print(grow(mine), mine)      # ['other'] ['a', 'new']

def bump(n):
    n += 1                   # ints are immutable: this makes a new local value
    return n

x = 5
print(bump(x), x)            # 6 5

def countdown(n):            # each call gets its own frame with its own n
    return [] if n == 0 else [n] + countdown(n - 1)

print(countdown(3))          # [3, 2, 1]`,
      java: `import java.util.*;

static void grow(List<String> items) {
    items.add("new");                 // changes the caller's list: the reference was copied
    items = new ArrayList<>();        // only changes the local copy of the reference
}
static int bump(int n) { n += 1; return n; }   // primitives are copied

List<String> mine = new ArrayList<>(List.of("a"));
grow(mine);
System.out.println(mine);             // [a, new]

int x = 5;
System.out.println(bump(x) + " " + x);   // 6 5
// Objects live on the heap; the garbage collector frees them once nothing refers to them.`,
      cs: `using System;
using System.Collections.Generic;

void Grow(List<string> items)
{
    items.Add("new");                 // changes the caller's list: the reference was copied
    items = new List<string>();       // only changes the local reference
}
void Bump(ref int n) => n += 1;       // ref: the caller's variable itself

var mine = new List<string> { "a" };
Grow(mine);
Console.WriteLine(string.Join(",", mine));   // a,new

int x = 5;
Bump(ref x);
Console.WriteLine(x);                 // 6`,
    },
    pitfalls: [
      "Expecting `items = []` inside a function to clear the caller's list. Use `items.clear()` to change the object itself.",
      "A function that changes its argument as a side effect surprises callers. Say so in its name or return a new value.",
      "Deep recursion: thousands of frames can overflow the stack.",
      "A cache or listener list that only grows keeps objects alive forever.",
    ],
    interview: "When asked for space complexity, count the call stack too: \"O(n) for the hash map plus O(h) for the recursion\".",
    quiz: [
      { id: "mem1", q: "A function receives a list and calls `items.append(x)`. Does the caller see the change?",
        options: ["No, the function got a copy of the list", "Only in Java", "Yes: both refer to the same list object", "Only if the function returns the list"], a: 2,
        why: "The reference was copied, not the list, so both names point at one object." },
      { id: "mem2", q: "Inside the function, `items = []` reassigns the parameter. Does the caller's list change?",
        options: ["No: only the function's local name now points to a new list", "Yes, it becomes empty", "It raises an error", "Yes, but only in Python"], a: 0,
        why: "Reassigning changes which object the local name refers to. The caller's variable still points at the original list." },
      { id: "mem3", q: "Why can a recursive DFS crash on a very deep input?",
        options: ["The heap runs out of objects", "Each call adds a stack frame, and too many overflow the call stack", "Recursion isn't allowed on graphs", "The garbage collector stops it"], a: 1,
        why: "The stack is much smaller than the heap. Use an iterative DFS with your own stack when depth can reach many thousands." },
    ],
  },
  // ---------------- object-oriented programming ----------------
  {
    id: "classes", name: "Classes & objects", short: "Cl", part: "Object-oriented programming",
    yt: "classes and objects explained object oriented programming",
    what: "A class is a blueprint that bundles data (fields or attributes) with the behaviour that works on it (methods). An object is one instance built from that blueprint, with its own data. A constructor sets up each new object, and `self` (Python) or `this` (Java, C#) means \"the object this method was called on\". Class-level (static) members belong to the class itself and are shared by all instances.",
    points: [
      "Use a class when data and the operations on it belong together, like an account's balance and `deposit()`.",
      "Each object has its own copy of the instance fields; static or class fields are shared.",
      "The constructor puts a new object into a valid starting state.",
      "Methods are functions that receive the object they're called on (`self`, `this`).",
      "Not everything needs a class: a plain function is often simpler.",
    ],
    code: {
      py: `class BankAccount:
    interest_rate = 0.02                  # class attribute: shared by all accounts

    def __init__(self, owner, balance=0): # constructor: sets up each new object
        self.owner = owner                # instance attributes: one set per object
        self.balance = balance

    def deposit(self, amount):            # method: behaviour that uses the object's data
        self.balance += amount
        return self.balance

    def __repr__(self):
        return f"BankAccount({self.owner!r}, {self.balance})"

a = BankAccount("Ada", 100)
b = BankAccount("Lin")
a.deposit(50)
print(a, b)                       # BankAccount('Ada', 150) BankAccount('Lin', 0)
print(BankAccount.interest_rate)  # 0.02`,
      java: `class BankAccount {
    static double interestRate = 0.02;    // shared by all accounts
    private final String owner;           // fields: one set per object
    private int balance;

    BankAccount(String owner, int balance) {   // constructor
        this.owner = owner;
        this.balance = balance;
    }
    int deposit(int amount) {             // method
        balance += amount;
        return balance;
    }
    @Override public String toString() { return owner + ": " + balance; }
}

BankAccount a = new BankAccount("Ada", 100);
BankAccount b = new BankAccount("Lin", 0);
a.deposit(50);
System.out.println(a + ", " + b);         // Ada: 150, Lin: 0`,
      cs: `using System;

var a = new BankAccount("Ada", 100);
var b = new BankAccount("Lin");
a.Deposit(50);
Console.WriteLine($"{a}, {b}");           // Ada: 150, Lin: 0

class BankAccount
{
    public static double InterestRate = 0.02;   // shared by all accounts
    public string Owner { get; }                // read-only property
    public int Balance { get; private set; }

    public BankAccount(string owner, int balance = 0)   // constructor
    {
        Owner = owner;
        Balance = balance;
    }
    public int Deposit(int amount) => Balance += amount;
    public override string ToString() => $"{Owner}: {Balance}";
}`,
    },
    pitfalls: [
      "Forgetting `self.` in Python creates a local variable instead of setting the attribute.",
      "A mutable class attribute (`members = []` at class level) is shared by every instance.",
      "\"God classes\" that do everything. Split by responsibility.",
      "Making a class for something that's only ever one function call.",
    ],
    interview: "In design questions (LRU cache, parking lot), turn the nouns into classes and the verbs into methods, keep fields private, and say which object owns which data.",
    quiz: [
      { id: "cls1", q: "What's the difference between a class and an object?",
        options: ["They're two names for the same thing", "An object is the blueprint; a class is one instance", "A class is the blueprint; an object is one instance built from it, with its own data", "Classes hold data; objects hold methods"], a: 2,
        why: "`BankAccount` is the class; `BankAccount(\"Ada\", 100)` creates one object with its own owner and balance." },
      { id: "cls2", q: "In Python, `class Team: members = []`. Two Team objects each call `self.members.append(...)`. What happens?",
        options: ["Both teams share one list, because it's a class attribute", "Each team gets its own list", "It raises an error", "Only the first append works"], a: 0,
        why: "Class attributes are shared. Create per-object data in `__init__`: `self.members = []`." },
      { id: "cls3", q: "What does a constructor (`__init__`, or a method named after the class) do?",
        options: ["Deletes an object", "Copies a class", "Runs once when the program starts", "Sets up a new object's starting state"], a: 3,
        why: "It runs each time an object is created, so every object starts out valid." },
    ],
  },
  {
    id: "encapsulation", name: "Encapsulation", short: "En", part: "Object-oriented programming",
    yt: "encapsulation object oriented programming explained",
    what: "Encapsulation means an object keeps its data to itself and offers a small set of methods that keep that data valid. The rules (\"a balance can't go negative\", \"a temperature can't go below absolute zero\") live in one place, and callers depend on what the object does, not on how it stores things. That lets you change the inside without breaking the code that uses it.",
    points: [
      "Make fields private (`private` in Java and C#, a leading `_` by convention in Python) and expose methods or properties.",
      "Check the rules (invariants) in the one method that changes the data, so the object can never be invalid.",
      "Callers should ask the object to do things (`account.withdraw(50)`) rather than reach in (`account.balance -= 50`).",
      "Don't hand out internal mutable collections; return a copy or a read-only view.",
      "A getter and setter for every field isn't encapsulation, just public fields with extra steps.",
    ],
    code: {
      py: `class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius            # goes through the setter below

    @property
    def celsius(self):
        return self._celsius              # _name: "internal, please don't touch"

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:               # the rule lives in one place
            raise ValueError("below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self):                 # a derived value, always consistent
        return self._celsius * 9 / 5 + 32

t = Temperature(25)
print(t.fahrenheit)                       # 77.0
try:
    t.celsius = -300
except ValueError as e:
    print("rejected:", e)                 # rejected: below absolute zero`,
      java: `class Temperature {
    private double celsius;                       // hidden: only the methods below change it

    Temperature(double celsius) { setCelsius(celsius); }

    double getCelsius() { return celsius; }
    void setCelsius(double value) {
        if (value < -273.15) throw new IllegalArgumentException("below absolute zero");
        celsius = value;                          // the rule lives in one place
    }
    double getFahrenheit() { return celsius * 9 / 5 + 32; }
}

Temperature t = new Temperature(25);
System.out.println(t.getFahrenheit());            // 77.0`,
      cs: `using System;

var t = new Temperature(25);
Console.WriteLine(t.Fahrenheit);          // 77

class Temperature
{
    private double _celsius;              // hidden backing field

    public Temperature(double celsius) => Celsius = celsius;

    public double Celsius
    {
        get => _celsius;
        set
        {
            if (value < -273.15) throw new ArgumentException("below absolute zero");
            _celsius = value;             // the rule lives in one place
        }
    }
    public double Fahrenheit => _celsius * 9 / 5 + 32;
}`,
    },
    pitfalls: [
      "Public fields anyone can set to an invalid value.",
      "Returning your internal list from a getter: callers can change it without going through your rules.",
      "Python's `_name` is only a convention; it signals intent but nothing enforces it.",
    ],
    interview: "In a design round, say it explicitly: \"`balance` is private; the only way to change it is `withdraw()`, which rejects overdrafts.\"",
    quiz: [
      { id: "enc1", q: "What is encapsulation mainly for?",
        options: ["Making code run faster", "Keeping an object's data valid by only allowing changes through its own methods", "Reusing code from a parent class", "Writing less code"], a: 1,
        why: "With the data private and the rules in its methods, no outside code can put the object into an invalid state." },
      { id: "enc2", q: "A class returns its internal list from `get_items()`, and callers append to it directly. What's the problem?",
        options: ["Nothing, that's what getters are for", "It's slower", "Lists can't be returned from methods", "It breaks encapsulation: outside code changes the object's state without its rules"], a: 3,
        why: "Return a copy (`list(self._items)`) or a read-only view, and offer an `add_item()` method that checks the rules." },
      { id: "enc3", q: "In Python, what does a leading underscore (`self._balance`) mean?",
        options: ["A convention: internal, not part of the public interface", "Python makes the attribute truly private", "The attribute is a constant", "The attribute is shared by all instances"], a: 0,
        why: "Python trusts programmers: `_name` signals \"internal\", but nothing stops access. (Double underscores only rename the attribute.)" },
    ],
  },
  {
    id: "abstraction", name: "Abstraction", short: "Ab", part: "Object-oriented programming",
    yt: "abstraction object oriented programming explained interfaces",
    what: "Abstraction means showing what something does while hiding how it does it. You call `sorted(list)` without knowing the sorting algorithm, and drive a car without knowing how the engine works. In code, functions, classes, interfaces and abstract classes are abstractions. Good ones let you think about a problem at one level at a time, and swap the implementation without touching the code that uses it.",
    points: [
      "An interface (Java, C#) or abstract base class (Python's `ABC`) lists what an object can do, with no implementation.",
      "Code written against the abstraction (`Storage`) works with any implementation (memory, database, a fake for tests).",
      "Abstraction is about what you expose. Encapsulation is about protecting the data behind it. They work together.",
      "Keep one level of detail per function: `solve()` calls `build_graph()` and `bfs()`; it doesn't also do index arithmetic.",
      "Don't abstract too early: wait until you have two real uses (see YAGNI).",
    ],
    code: {
      py: `from abc import ABC, abstractmethod

class Storage(ABC):                     # an abstraction: WHAT storage does, not HOW
    @abstractmethod
    def save(self, key, value): ...
    @abstractmethod
    def load(self, key): ...

class MemoryStorage(Storage):           # one HOW: a dict in memory
    def __init__(self):
        self._data = {}
    def save(self, key, value):
        self._data[key] = value
    def load(self, key):
        return self._data.get(key)

def remember_score(store: Storage, user, score):   # works with ANY Storage
    store.save(user, score)
    return store.load(user)

print(remember_score(MemoryStorage(), "ada", 42))   # 42
# Storage() would raise TypeError: an abstract class can't be created directly`,
      java: `import java.util.*;

interface Storage {                         // WHAT storage does, not HOW
    void save(String key, int value);
    Integer load(String key);
}

class MemoryStorage implements Storage {   // one HOW: a map in memory
    private final Map<String, Integer> data = new HashMap<>();
    public void save(String key, int value) { data.put(key, value); }
    public Integer load(String key) { return data.get(key); }
}

static int rememberScore(Storage store, String user, int score) {   // any Storage works
    store.save(user, score);
    return store.load(user);
}

System.out.println(rememberScore(new MemoryStorage(), "ada", 42));   // 42`,
      cs: `using System;
using System.Collections.Generic;

int RememberScore(IStorage store, string user, int score)   // any IStorage works
{
    store.Save(user, score);
    return store.Load(user);
}
Console.WriteLine(RememberScore(new MemoryStorage(), "ada", 42));   // 42

interface IStorage                          // WHAT storage does, not HOW
{
    void Save(string key, int value);
    int Load(string key);
}

class MemoryStorage : IStorage              // one HOW: a dictionary in memory
{
    private readonly Dictionary<string, int> _data = new();
    public void Save(string key, int value) => _data[key] = value;
    public int Load(string key) => _data[key];
}`,
    },
    pitfalls: [
      "Leaky abstractions: callers still have to know the details (\"call `connect()` first or `save()` crashes\").",
      "Abstracting too early adds interfaces nobody needs.",
      "Mixing levels: a function that does both high-level steps and low-level details is hard to read.",
    ],
    interview: "Write the top level first (`return bfs(build_graph(edges), start)`) and fill in the helpers after. It shows the plan and keeps each piece simple.",
    quiz: [
      { id: "abs1", q: "Which best describes abstraction?",
        options: ["Copying code from a parent class", "Making every field private", "Exposing a simple interface and hiding the details of how it works", "Using as few classes as possible"], a: 2,
        why: "Callers see what it does (`save`, `load`), not how (dictionary, database, file)." },
      { id: "abs2", q: "`remember_score(store, ...)` accepts any `Storage`. What's the benefit?",
        options: ["You can pass in a database or a fake for tests without changing the function", "It runs faster", "It uses less memory", "It stops subclasses being created"], a: 0,
        why: "Depending on the abstraction makes the function independent of any one implementation." },
      { id: "abs3", q: "How do abstraction and encapsulation differ?",
        options: ["They're the same thing", "Encapsulation is about interfaces; abstraction is about private fields", "Abstraction only exists in Java", "Abstraction is about what you expose (a simpler view); encapsulation is about protecting the data behind it"], a: 3,
        why: "An interface hides how something works (abstraction); private fields and checked methods keep the state valid (encapsulation)." },
    ],
  },
  {
    id: "inheritance", name: "Inheritance vs composition", short: "In", part: "Object-oriented programming",
    yt: "composition over inheritance explained",
    what: "Inheritance models an \"is-a\" relationship: a `Dog` is an `Animal`, so it inherits the parent's fields and methods and can override some of them. Composition models a \"has-a\" relationship: a `Car` has an `Engine` and passes work to it. Both reuse code, but inheritance ties the child tightly to its parent's internals, so the common advice is to favour composition and keep inheritance for true \"is-a\" relationships.",
    points: [
      "Override a method to change one step of the parent's behaviour; call the parent's version with `super()` / `base`.",
      "Composition lets you swap parts (`Car(ElectricEngine())`) and test them on their own.",
      "Deep inheritance trees are fragile: a change in a base class ripples into every subclass.",
      "Liskov substitution: a subclass must work anywhere its parent is expected. If it can't, it shouldn't inherit.",
      "Inheriting only to reuse code (\"`Stack` extends `ArrayList`\") leaks the parent's methods into your class.",
    ],
    code: {
      py: `class Animal:
    def __init__(self, name):
        self.name = name
    def describe(self):
        return f"{self.name} makes a sound: {self.sound()}"
    def sound(self):
        return "..."

class Dog(Animal):                     # inheritance: a Dog IS an Animal
    def sound(self):                   # override one step
        return "woof"

print(Dog("Rex").describe())           # Rex makes a sound: woof

class Engine:
    def start(self):
        return "engine on"

class Car:                             # composition: a Car HAS an Engine
    def __init__(self, engine):
        self.engine = engine           # swap in another engine without touching Car
    def drive(self):
        return self.engine.start() + ", driving"

print(Car(Engine()).drive())           # engine on, driving`,
      java: `class Animal {
    protected final String name;
    Animal(String name) { this.name = name; }
    String describe() { return name + " makes a sound: " + sound(); }
    String sound() { return "..."; }
}
class Dog extends Animal {               // inheritance: a Dog IS an Animal
    Dog(String name) { super(name); }
    @Override String sound() { return "woof"; }
}

class Engine { String start() { return "engine on"; } }
class Car {                              // composition: a Car HAS an Engine
    private final Engine engine;
    Car(Engine engine) { this.engine = engine; }
    String drive() { return engine.start() + ", driving"; }
}

System.out.println(new Dog("Rex").describe());      // Rex makes a sound: woof
System.out.println(new Car(new Engine()).drive());  // engine on, driving`,
      cs: `using System;

Console.WriteLine(new Dog("Rex").Describe());       // Rex makes a sound: woof
Console.WriteLine(new Car(new Engine()).Drive());   // engine on, driving

class Animal
{
    protected readonly string Name;
    public Animal(string name) => Name = name;
    public string Describe() => $"{Name} makes a sound: {Sound()}";
    public virtual string Sound() => "...";          // virtual: subclasses may override
}
class Dog : Animal                                   // inheritance: a Dog IS an Animal
{
    public Dog(string name) : base(name) { }
    public override string Sound() => "woof";
}

class Engine { public string Start() => "engine on"; }
class Car                                            // composition: a Car HAS an Engine
{
    private readonly Engine _engine;
    public Car(Engine engine) => _engine = engine;
    public string Drive() => _engine.Start() + ", driving";
}`,
    },
    pitfalls: [
      "Forgetting `super().__init__(...)` in a Python subclass's constructor, so the parent's fields are never set.",
      "`Square extends Rectangle` looks right but breaks code that sets width and height separately (Liskov).",
      "In C#, a method must be `virtual` before a subclass can `override` it.",
    ],
    interview: "If you say \"favour composition over inheritance\", give the reason: parts can be swapped and tested on their own, and the child isn't tied to the parent's internals.",
    quiz: [
      { id: "inh1", q: "Which relationship suggests composition rather than inheritance?",
        options: ["A Dog and an Animal", "A Car and its Engine", "A SavingsAccount and an Account", "A Square and a Shape"], a: 1,
        why: "A car has an engine (composition). The others are \"is-a\" relationships." },
      { id: "inh2", q: "Why is \"favour composition over inheritance\" common advice?",
        options: ["Inheritance isn't allowed in Python", "Composition always uses less memory", "Composed parts can be swapped and tested on their own; inheritance ties a subclass to its parent's internals", "Composition is faster"], a: 2,
        why: "A change to a base class can break every subclass; a composed part only needs to keep its interface." },
      { id: "inh3", q: "A `Square` subclass of `Rectangle` breaks code that sets width and height separately. Which principle does it violate?",
        options: ["Liskov substitution", "DRY", "YAGNI", "Encapsulation"], a: 0,
        why: "Liskov: a subclass must work anywhere its parent does. A square can't have its width changed independently, so it isn't a safe `Rectangle`." },
    ],
  },
  {
    id: "polymorphism", name: "Polymorphism & interfaces", short: "Po", part: "Object-oriented programming",
    yt: "polymorphism explained object oriented programming",
    what: "Polymorphism means \"many forms\": one interface, many implementations. Code calls `shape.area()` and each kind of shape answers in its own way; the right method is chosen at run time (dynamic dispatch). It replaces long chains of type checks, and new types can be added without editing the code that uses them. Overloading (same name, different parameter types) is the compile-time kind.",
    points: [
      "Overriding: a subclass or implementing class replaces a method. The object's actual type decides which version runs.",
      "Overloading: several methods share a name but take different parameters. The compiler picks one (Java, C#).",
      "Python uses duck typing: any object with the right methods works, whatever its class (`len()` works on strings, lists and dicts).",
      "A growing `if type == ... elif type == ...` chain is a sign polymorphism would help.",
      "Interfaces let unrelated classes share a role (`Comparable`, `IShape`) without sharing a parent.",
    ],
    code: {
      py: `import math

class Circle:
    def __init__(self, r): self.r = r
    def area(self): return math.pi * self.r ** 2

class Square:
    def __init__(self, side): self.side = side
    def area(self): return self.side ** 2

for s in [Circle(1), Square(2)]:          # the same call; each type answers its own way
    print(type(s).__name__, round(s.area(), 2))   # Circle 3.14, then Square 4

print(len("abc"), len([1, 2]), len({"a": 1}))     # duck typing: 3 2 1

# Without polymorphism: a type switch that grows with every new shape
def area_switch(s):
    if isinstance(s, Circle):
        return math.pi * s.r ** 2
    elif isinstance(s, Square):
        return s.side ** 2
    raise TypeError("unknown shape")`,
      java: `import java.util.*;

interface Shape { double area(); }
record Circle(double r) implements Shape { public double area() { return Math.PI * r * r; } }
record Square(double side) implements Shape { public double area() { return side * side; } }

List<Shape> shapes = List.of(new Circle(1), new Square(2));
for (Shape s : shapes)                                  // the object's type picks area()
    System.out.printf("%s %.2f%n", s.getClass().getSimpleName(), s.area());
// Circle 3.14
// Square 4.00

static int add(int a, int b) { return a + b; }          // overloading: picked at compile time
static double add(double a, double b) { return a + b; }`,
      cs: `using System;
using System.Collections.Generic;

var shapes = new List<IShape> { new Circle(1), new Square(2) };
foreach (var s in shapes)                         // the object's type picks Area()
    Console.WriteLine($"{s.GetType().Name} {s.Area():F2}");
// Circle 3.14
// Square 4.00

interface IShape { double Area(); }
record Circle(double R) : IShape { public double Area() => Math.PI * R * R; }
record Square(double Side) : IShape { public double Area() => Side * Side; }`,
    },
    pitfalls: [
      "`isinstance` or `instanceof` checks scattered through the code instead of a method on each type.",
      "Overriding a method to do something different from what its name promises.",
      "Mixing up overloading (compile time, different parameters) and overriding (run time, same signature).",
    ],
    interview: "In design rounds, a new payment method or vehicle type should be a new class implementing the interface, not another `elif` in the checkout code.",
    quiz: [
      { id: "pol1", q: "What's the difference between overloading and overriding?",
        options: ["They're the same", "Overloading: same name, different parameters, picked at compile time. Overriding: a subclass replaces a method, picked at run time", "Overriding happens at compile time; overloading at run time", "Overloading is only for operators"], a: 1,
        why: "`add(int, int)` and `add(double, double)` are overloads. `Dog.sound()` replacing `Animal.sound()` is an override." },
      { id: "pol2", q: "Your code keeps gaining `elif isinstance(x, NewType)` branches. What's the polymorphic fix?",
        options: ["Give each type a method with the same name and call it", "Add a comment listing the types", "Use a bigger switch statement", "Store the type name as a string"], a: 0,
        why: "Each type knows how to do its own work, so adding a type means adding a class, not editing every switch." },
      { id: "pol3", q: "What does Python's duck typing mean?",
        options: ["Classes must inherit from a common base", "Types are checked before the program runs", "Only built-in types can be used with `len()`", "Any object with the right methods works, whatever its class"], a: 3,
        why: "\"If it walks like a duck...\": `len()` works on anything with `__len__`." },
    ],
  },
  // ---------------- writing good code ----------------
  {
    id: "dry-kiss-yagni", name: "DRY, KISS & YAGNI", short: "DK", part: "Writing good code",
    yt: "DRY KISS YAGNI programming principles explained",
    what: "Three rules of thumb for keeping code simple. DRY (Don't Repeat Yourself): every piece of knowledge, like a tax rate or a validation rule, should live in one place, so a fix happens once. KISS (Keep It Simple, Stupid): choose the simplest solution that works; clear beats clever. YAGNI (You Aren't Gonna Need It): don't build features or abstractions for needs you only imagine.",
    points: [
      "DRY is about knowledge, not identical-looking lines. Two pieces of code that change for different reasons should stay separate.",
      "Rule of three: duplicate once if you must; on the third copy, extract a function.",
      "KISS: plain loops, clear names and the standard library usually beat a clever one-liner.",
      "YAGNI: build for today's requirement, and keep the code easy to change for tomorrow's.",
      "The three pull against over-engineering, the most common trap in design questions.",
    ],
    code: {
      py: `# DRY: the tax rule used to live in two places; now it lives in one
TAX = 0.13
def with_tax(amount):
    return round(amount * (1 + TAX), 2)

print(with_tax(100), with_tax(20))    # 113.0 22.6

# KISS: clear beats clever
nums = [3, 8, 1, 9]
clever = sorted(nums)[-1:][0] if nums else None   # works, but takes a while to read
simple = max(nums, default=None)                  # says what it means
print(clever, simple)                             # 9 9

# YAGNI: the task is "sum the prices". No plugin system, no config, no class hierarchy.
def total(prices):
    return sum(prices)

print(total([1.5, 2.5]))              # 4.0`,
      java: `import java.util.*;

static final double TAX = 0.13;                   // DRY: one source of truth
static double withTax(double amount) { return Math.round(amount * (1 + TAX) * 100) / 100.0; }

System.out.println(withTax(100) + " " + withTax(20));   // 113.0 22.6

int[] nums = {3, 8, 1, 9};
int simple = Arrays.stream(nums).max().orElse(-1);       // KISS: says what it means
System.out.println(simple);                               // 9

// YAGNI: no TotalCalculatorFactory until a second kind of total actually exists`,
      cs: `using System;
using System.Linq;

const double Tax = 0.13;                           // DRY: one source of truth
double WithTax(double amount) => Math.Round(amount * (1 + Tax), 2);

Console.WriteLine($"{WithTax(100)} {WithTax(20)}");   // 113 22.6

int[] nums = { 3, 8, 1, 9 };
Console.WriteLine(nums.Max());                     // KISS: says what it means. 9

// YAGNI: build the plugin system when a second plugin actually exists`,
    },
    pitfalls: [
      "DRY taken too far: one function with five boolean flags serving four callers. Duplication is cheaper than the wrong abstraction.",
      "Copy-pasted code where a bug fix reached only one copy.",
      "KISS doesn't mean sloppy: simple code still handles edge cases.",
      "YAGNI doesn't mean no design: keep code easy to extend, just don't build the extensions yet.",
    ],
    interview: "Start with the simple brute force and say its complexity (KISS), then optimise. In design rounds, build what was asked; when the interviewer asks \"what if...\", show how your design extends.",
    quiz: [
      { id: "dky1", q: "The same validation logic is copy-pasted in three places, and a bug fix reached only one. Which principle helps?",
        options: ["YAGNI", "DRY", "KISS", "Liskov substitution"], a: 1,
        why: "Put the rule in one function that all three call, so the fix happens once." },
      { id: "dky2", q: "You add a config system and plugin hooks \"in case we need them later\". Which principle warns against this?",
        options: ["DRY", "Encapsulation", "Single responsibility", "YAGNI"], a: 3,
        why: "You Aren't Gonna Need It: unused flexibility costs time and adds complexity now, for a need that may never come." },
      { id: "dky3", q: "Two functions look alike today but change for different reasons. What happens if you merge them into one with flags?",
        options: ["It's always right: DRY says merge", "You create coupling and complexity: duplication is cheaper than the wrong abstraction", "It makes them faster", "Nothing changes"], a: 1,
        why: "DRY is about one piece of knowledge, not similar-looking code. Merging unrelated logic means every change risks the other caller." },
    ],
  },
  {
    id: "solid", name: "SOLID principles", short: "SO", part: "Writing good code",
    yt: "SOLID principles explained with examples",
    what: "Five object-oriented design principles that keep code easy to change. S, Single responsibility: a class has one reason to change. O, Open/closed: add behaviour by adding code (a new class), not by editing working code. L, Liskov substitution: a subtype must work anywhere its parent does. I, Interface segregation: several small interfaces beat one big one. D, Dependency inversion: depend on abstractions, and pass dependencies in instead of creating them inside.",
    points: [
      "Single responsibility: `OrderService` handles orders; sending messages is a `Notifier`'s job.",
      "Open/closed: a new notification channel is a new class, not another `if` in `OrderService`.",
      "Liskov: if a subclass throws \"not supported\" for a parent method, the hierarchy is wrong.",
      "Interface segregation: a `Printer` shouldn't have to implement `fax()`.",
      "Dependency inversion: pass a `Notifier` into the constructor (dependency injection), so tests can pass a fake.",
    ],
    code: {
      py: `from typing import Protocol

class Notifier(Protocol):                 # D: high-level code depends on this abstraction
    def send(self, to: str, msg: str) -> str: ...

class EmailNotifier:                      # O: new channels are new classes, no edits elsewhere
    def send(self, to, msg):
        return f"email to {to}: {msg}"

class SmsNotifier:
    def send(self, to, msg):
        return f"sms to {to}: {msg}"

class OrderService:                       # S: handles orders; sending is another class's job
    def __init__(self, notifier: Notifier):   # D: the dependency is passed in
        self.notifier = notifier
    def place(self, user, item):
        return self.notifier.send(user, f"order placed: {item}")

print(OrderService(EmailNotifier()).place("ada", "book"))   # email to ada: order placed: book
print(OrderService(SmsNotifier()).place("lin", "pen"))      # sms to lin: order placed: pen`,
      java: `interface Notifier { String send(String to, String msg); }            // D: depend on this

class EmailNotifier implements Notifier {                              // O: new channels are new classes
    public String send(String to, String msg) { return "email to " + to + ": " + msg; }
}
class SmsNotifier implements Notifier {
    public String send(String to, String msg) { return "sms to " + to + ": " + msg; }
}

class OrderService {                                                   // S: orders only
    private final Notifier notifier;
    OrderService(Notifier notifier) { this.notifier = notifier; }      // D: passed in
    String place(String user, String item) { return notifier.send(user, "order placed: " + item); }
}

System.out.println(new OrderService(new EmailNotifier()).place("ada", "book"));
// email to ada: order placed: book`,
      cs: `using System;

Console.WriteLine(new OrderService(new EmailNotifier()).Place("ada", "book"));
// email to ada: order placed: book
Console.WriteLine(new OrderService(new SmsNotifier()).Place("lin", "pen"));
// sms to lin: order placed: pen

interface INotifier { string Send(string to, string msg); }           // D: depend on this

class EmailNotifier : INotifier                                        // O: new channels are new classes
{
    public string Send(string to, string msg) => $"email to {to}: {msg}";
}
class SmsNotifier : INotifier
{
    public string Send(string to, string msg) => $"sms to {to}: {msg}";
}

class OrderService                                                     // S: orders only
{
    private readonly INotifier _notifier;
    public OrderService(INotifier notifier) => _notifier = notifier;   // D: passed in
    public string Place(string user, string item) => _notifier.Send(user, $"order placed: {item}");
}`,
    },
    pitfalls: [
      "Treating SOLID as law: dozens of tiny classes and interfaces for a 50-line program.",
      "An interface for every class \"just in case\", with only ever one implementation (YAGNI).",
      "Reading single responsibility as \"one method per class\". It means one reason to change.",
    ],
    interview: "In low-level design rounds, name the principle when you use it: \"I'm injecting the notifier so it's easy to swap and to fake in tests.\" That's dependency inversion in one sentence.",
    quiz: [
      { id: "sol1", q: "Adding a new notification channel means editing a big if/else inside `OrderService`. Which principle is broken?",
        options: ["Open/closed", "Liskov substitution", "Interface segregation", "DRY"], a: 0,
        why: "Code should be open to extension (a new `Notifier` class) but closed to modification (no edits to working code)." },
      { id: "sol2", q: "\"A class should have one reason to change\" is which principle?",
        options: ["Dependency inversion", "Open/closed", "Single responsibility", "Interface segregation"], a: 2,
        why: "If tax rules and email formatting both live in one class, either change risks breaking the other." },
      { id: "sol3", q: "Passing a `Notifier` into `OrderService`'s constructor, instead of creating an `EmailNotifier` inside it, is an example of...",
        options: ["Inheritance", "Encapsulation", "YAGNI", "Dependency inversion (dependency injection)"], a: 3,
        why: "`OrderService` depends on the abstraction and gets the concrete object from outside, so tests can pass a fake." },
    ],
  },
  {
    id: "clean", name: "Readable code: naming, pure functions & side effects", short: "Rd", part: "Writing good code",
    yt: "clean code naming pure functions side effects explained",
    what: "Code is read far more often than it's written, so readability is a feature. Names should say what something means, functions should be small and do one thing, and magic numbers deserve a name. Pure functions, which always give the same output for the same input and change nothing outside themselves, are the easiest to test and reason about. Keep side effects like printing, files and network calls at the edges of the program.",
    points: [
      "Names: `seconds_elapsed` beats `t`, and `is_valid` beats `flag`. Short names are fine for tiny loops (`i`, `j`).",
      "A named constant (`SECONDS_PER_DAY`) explains a number and keeps it in one place.",
      "Pure function: same input, same output, no side effects. Easy to test, safe to reuse, safe to cache.",
      "Push side effects (printing, I/O, changing shared state) to the outer layer; keep the core logic pure.",
      "Comments explain why, not what. If code needs a comment to say what it does, rename or extract first.",
    ],
    code: {
      py: `# Before: what is d? what is 86400? It also prints and changes its argument.
def f(d, l):
    for x in l:
        if x[1] > 86400:
            d.append(x[0])
    print(d)

# After: the names say what they mean, the constant has a name, and the function is pure.
SECONDS_PER_DAY = 86_400

def long_running_jobs(jobs):
    """Names of the jobs that ran longer than a day."""
    return [name for name, seconds in jobs if seconds > SECONDS_PER_DAY]

jobs = [("backup", 90_000), ("email", 30)]
print(long_running_jobs(jobs))     # ['backup']: printing happens out here, at the edge`,
      java: `import java.util.*;

static final int SECONDS_PER_DAY = 86_400;        // a named constant, not a magic number

record Job(String name, int seconds) {}

static List<String> longRunningJobs(List<Job> jobs) {   // pure: no printing, no mutation
    List<String> names = new ArrayList<>();
    for (Job j : jobs) if (j.seconds() > SECONDS_PER_DAY) names.add(j.name());
    return names;
}

System.out.println(longRunningJobs(List.of(new Job("backup", 90_000), new Job("email", 30))));
// [backup]`,
      cs: `using System;
using System.Collections.Generic;
using System.Linq;

const int SecondsPerDay = 86_400;               // a named constant, not a magic number

List<string> LongRunningJobs(IEnumerable<Job> jobs) =>   // pure: same input, same output
    jobs.Where(j => j.Seconds > SecondsPerDay).Select(j => j.Name).ToList();

var jobs = new[] { new Job("backup", 90_000), new Job("email", 30) };
Console.WriteLine(string.Join(", ", LongRunningJobs(jobs)));   // backup

record Job(string Name, int Seconds);`,
    },
    pitfalls: [
      "Comments that repeat the code (`i += 1  # add one to i`).",
      "Boolean flag parameters (`render(true, false)`). Two clearly named functions read better.",
      "Logic that prints or writes files deep inside a calculation can't be tested without capturing output.",
      "Dead code and commented-out blocks left \"just in case\".",
    ],
    interview: "Readability is graded. Rename `i, j` to `left, right` in two-pointer code, pull out helpers, and delete debugging prints before you say \"done\".",
    quiz: [
      { id: "cln1", q: "What is a pure function?",
        options: ["A function with no parameters", "One that always returns the same output for the same input and changes nothing outside itself", "A function written in one line", "A function without comments"], a: 1,
        why: "No hidden inputs (globals, the clock) and no hidden outputs (printing, mutation), so it's trivial to test." },
      { id: "cln2", q: "What's wrong with `if status == 3:`?",
        options: ["Nothing", "`==` should be `is`", "3 is a magic number; a named constant (`STATUS_SHIPPED`) says what it means", "Numbers can't be compared to status codes"], a: 2,
        why: "A reader can't tell what 3 means, and if it changes you have to find every copy." },
      { id: "cln3", q: "What should a good comment explain?",
        options: ["Why the code does something non-obvious", "What each line does", "Who wrote it", "The variable types"], a: 0,
        why: "The code already says what it does. Comments add the reason: a constraint, a bug it avoids, a trade-off." },
    ],
  },
  {
    id: "errors", name: "Errors, edge cases & defensive code", short: "Er", part: "Writing good code",
    yt: "error handling exceptions edge cases best practices programming",
    what: "Robust code expects the unexpected. Check inputs where they enter your code and fail fast, with a clear error, instead of carrying on with bad data. Catch only the exceptions you can actually handle. Before you call a solution done, test the edge cases: empty input, one element, duplicates, negatives, very large values and missing (null) values.",
    points: [
      "Fail fast: reject bad input at the boundary with a clear message (`ValueError(\"age must be >= 0\")`).",
      "Catch specific exceptions (`ValueError`, `NumberFormatException`), never a bare catch-all that hides bugs.",
      "Exceptions are for exceptional cases. For an expected \"not found\", return a value (`None`, `-1`, `TryParse`).",
      "The edge-case checklist: empty, single element, all the same, sorted / reverse sorted, negatives and zero, maximum size, null.",
      "Use a type large enough for sums and products (`long` in Java and C#).",
    ],
    code: {
      py: `def average(nums):
    if not nums:                              # edge case first: empty input
        raise ValueError("average of an empty list")
    return sum(nums) / len(nums)

def safe_int(text, default=0):
    try:
        return int(text)
    except ValueError:                        # catch only the error you expect
        return default

print(average([2, 4]), safe_int("42"), safe_int("4x2"))   # 3.0 42 0
try:
    average([])
except ValueError as e:
    print("error:", e)                        # error: average of an empty list

# Edge cases to try on any function: [], [x], duplicates, negatives, very large input, None`,
      java: `static double average(int[] nums) {
    if (nums == null || nums.length == 0)                    // edge cases first
        throw new IllegalArgumentException("average of an empty array");
    long sum = 0;                                            // long: no overflow on big inputs
    for (int n : nums) sum += n;
    return (double) sum / nums.length;
}
static int safeInt(String text, int fallback) {
    try { return Integer.parseInt(text); }
    catch (NumberFormatException e) { return fallback; }    // catch only what you expect
}

System.out.println(average(new int[]{2, 4}) + " " + safeInt("42", 0) + " " + safeInt("4x2", 0));
// 3.0 42 0`,
      cs: `using System;

double Average(int[] nums)
{
    if (nums is null || nums.Length == 0)                    // edge cases first
        throw new ArgumentException("average of an empty array");
    long sum = 0;                                            // long: no overflow on big inputs
    foreach (var n in nums) sum += n;
    return (double)sum / nums.Length;
}
int SafeInt(string text, int fallback = 0) => int.TryParse(text, out var n) ? n : fallback;

Console.WriteLine($"{Average(new[] { 2, 4 })} {SafeInt("42")} {SafeInt("4x2")}");   // 3 42 0`,
    },
    pitfalls: [
      "`except Exception: pass` (or an empty `catch`) swallows real bugs along with the error you expected.",
      "Returning `null` silently, so the crash happens far away from the cause.",
      "Using exceptions for normal flow inside a hot loop: they're slow and hide intent.",
      "Never testing the empty input.",
    ],
    interview: "Before coding, list the edge cases out loud; after coding, walk one through by hand. Interviewers notice, and it's where a QA background shines.",
    quiz: [
      { id: "err1", q: "Which inputs should you test first for most array problems?",
        options: ["A very large random array", "Only the example from the prompt", "An empty array and a single element", "An array of strings"], a: 2,
        why: "Empty and one-element inputs break more solutions than anything else: loops that never run, `nums[0]` on an empty list, off-by-one bounds." },
      { id: "err2", q: "Why is `except Exception: pass` around a block risky?",
        options: ["It hides real bugs, not just the error you expected", "It's a syntax error", "It's slow", "It only works in Python 2"], a: 0,
        why: "A typo, a `None` or a wrong index all get silently ignored. Catch the specific exception you can handle." },
      { id: "err3", q: "What does \"fail fast\" mean?",
        options: ["Write code quickly", "Reject bad input with a clear error as early as possible, instead of carrying on", "Stop testing after the first failure", "Use timeouts everywhere"], a: 1,
        why: "An error at the boundary points straight at the cause. Bad data that travels on fails later, somewhere confusing." },
    ],
  },
];
