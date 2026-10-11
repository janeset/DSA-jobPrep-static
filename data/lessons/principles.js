// Programming principles: step 1 of the Learn path. The ideas behind the code, with the same example
// in Python, Java and C#, then a short quiz. Text fields may use `backticks` for inline code.
// Java/C# snippets are focused fragments, like the data-structure lessons: put statements in a method
// (C# also allows top-level statements, with type declarations after them) and keep the imports shown.
// Quiz: `a` is the index of the right option; `why` is shown after answering.
// Optional per lesson: `topics` (extra cards with text, a table and/or code; a table cell or row can be
// per language) and `practice` (bad / good code pairs with why).

// Boolean literals in each language's spelling, for the tables.
const PR_T = { py: "`True`", java: "`true`", cs: "`true`" }, PR_F = { py: "`False`", java: "`false`", cs: "`false`" };

const PRINCIPLES = [
  // ---------------- core building blocks ----------------
  {
    id: "variables", name: "Variables, values & types", short: "Va", part: "Core building blocks",
    yt: "variables and data types programming explained for beginners",
    what: {
      py: "A variable is a name for a value. Every value has a type (whole number, decimal, text, true/false, list...) that decides what you can do with it. Python is dynamically typed: the type belongs to the value, not the variable, and type mistakes show up while the program runs. Type hints (`count: int = 3`) document intent, and a checker such as mypy can catch mismatches before you run anything.",
      java: "A variable is a name for a value. Every value has a type (whole number, decimal, text, true/false, list...) that decides what you can do with it. Java is statically typed: every variable has a fixed type, and the compiler rejects type mistakes before the program runs. `var` lets the compiler infer the type, but it's still fixed.",
      cs: "A variable is a name for a value. Every value has a type (whole number, decimal, text, true/false, list...) that decides what you can do with it. C# is statically typed: every variable has a fixed type, and the compiler rejects type mistakes before the program runs. `var` lets the compiler infer the type, but it's still fixed.",
    },
    points: [
      { py: "Assignment (`x = 5`) binds a name to a value. Assigning again rebinds the name, even to a value of another type.",
        java: "Assignment (`x = 5;`) stores a value in a variable. The compiler only accepts values of the variable's type.",
        cs: "Assignment (`x = 5;`) stores a value in a variable. The compiler only accepts values of the variable's type." },
      "Pick the type that fits the data: an integer for counts, a boolean for yes/no flags, a decimal for measurements. Don't store everything as text.",
      { py: "Decimals (`float`) are approximations: `0.1 + 0.2` is not exactly `0.3`. Use `decimal.Decimal` for money.",
        java: "Decimals (`double`) are approximations: `0.1 + 0.2` is not exactly `0.3`. Use `BigDecimal` for money.",
        cs: "Decimals (`double`) are approximations: `0.1 + 0.2` is not exactly `0.3`. Use `decimal` for money." },
      { py: "Python integers grow as needed and never overflow.",
        java: "`int` is 32 bits (about ±2.1 billion) and silently wraps around when it overflows. Use `long` for big sums.",
        cs: "`int` is 32 bits (about ±2.1 billion) and silently wraps around when it overflows, unless you use `checked`. Use `long` for big sums." },
      { py: "Constants are UPPER_CASE names by convention (`MAX_RETRIES = 3`). Python doesn't enforce them, but readers know not to change them.",
        java: "`final` variables can't be reassigned, and `static final` makes a class-wide constant (`MAX_RETRIES`). They make intent clear and remove magic numbers.",
        cs: "`const` (fixed at compile time) and `readonly` (set once) make values that can't change. They make intent clear and remove magic numbers." },
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
      { java: "Overflow: `(lo + hi) / 2` can overflow on large indexes. Write `lo + (hi - lo) / 2`.",
        cs: "Overflow: `(lo + hi) / 2` can overflow on large indexes. Write `lo + (hi - lo) / 2`." },
      { py: "`/` always gives a decimal (`7 / 2` is `3.5`). Use `//` for whole-number division (`7 // 2` is `3`).",
        java: "Integer division drops the remainder: `7 / 2` is `3`. Write `7 / 2.0` to get `3.5`.",
        cs: "Integer division drops the remainder: `7 / 2` is `3`. Write `7 / 2.0` to get `3.5`." },
      "Reusing one variable for two different meanings makes code hard to follow.",
    ],
    practice: [
      { why: "A named constant says what the number means and gives one place to change it.",
        bad: { py: `if retries > 3:
    give_up()
expires = now + 86400`, java: `long expiry(int retries, long now) {
    if (retries > 3) giveUp();
    return now + 86400;
}`, cs: `long Expiry(int retries, long now)
{
    if (retries > 3) GiveUp();
    return now + 86400;
}` },
        good: { py: `MAX_RETRIES = 3
SECONDS_PER_DAY = 24 * 60 * 60

if retries > MAX_RETRIES:
    give_up()
expires = now + SECONDS_PER_DAY`, java: `static final int MAX_RETRIES = 3;
static final long SECONDS_PER_DAY = 24 * 60 * 60;

long expiry(int retries, long now) {
    if (retries > MAX_RETRIES) giveUp();
    return now + SECONDS_PER_DAY;
}`, cs: `const int MaxRetries = 3;
const long SecondsPerDay = 24 * 60 * 60;

long Expiry(int retries, long now)
{
    if (retries > MaxRetries) GiveUp();
    return now + SecondsPerDay;
}` } },
      { why: "Text for everything lets typos (\"Yes\", \"y\") slip through and needs converting before every comparison. Store numbers as numbers and yes/no as booleans.",
        bad: { py: `age = "42"
is_member = "yes"
if is_member == "yes" and int(age) >= 18:
    grant()`, java: `String age = "42";
String isMember = "yes";
if (isMember.equals("yes") && Integer.parseInt(age) >= 18) {
    grant();
}`, cs: `string age = "42";
string isMember = "yes";
if (isMember == "yes" && int.Parse(age) >= 18)
{
    Grant();
}` },
        good: { py: `age = 42
is_member = True
if is_member and age >= 18:
    grant()`, java: `int age = 42;
boolean isMember = true;
if (isMember && age >= 18) {
    grant();
}`, cs: `int age = 42;
bool isMember = true;
if (isMember && age >= 18)
{
    Grant();
}` } },
      { why: "Decimals are approximations, so two results that should match can differ in the last digit. Compare with a small tolerance.",
        bad: { py: `total = 0.1 + 0.2
if total == 0.3:              # False
    print("equal")`, java: `double total = 0.1 + 0.2;
if (total == 0.3) {           // false
    System.out.println("equal");
}`, cs: `double total = 0.1 + 0.2;
if (total == 0.3)             // false
{
    Console.WriteLine("equal");
}` },
        good: { py: `import math

total = 0.1 + 0.2
if math.isclose(total, 0.3):  # True
    print("equal")`, java: `final double EPS = 1e-9;
double total = 0.1 + 0.2;
if (Math.abs(total - 0.3) < EPS) {   // true
    System.out.println("equal");
}`, cs: `const double Eps = 1e-9;
double total = 0.1 + 0.2;
if (Math.Abs(total - 0.3) < Eps)     // true
{
    Console.WriteLine("equal");
}` } },
      { why: "One variable, one meaning. When a name changes meaning halfway through, every reader has to track which version they're looking at.",
        bad: { py: `data = line.split(",")
data = [int(x) for x in data]     # now numbers
data = sum(data)                  # now a single total`, java: `int n = 0;
for (int s : scores) n += s;
n = n / scores.length;            // n was the sum, now it's the average`, cs: `int n = 0;
foreach (int s in scores) n += s;
n = n / scores.Length;            // n was the sum, now it's the average` },
        good: { py: `parts = line.split(",")
numbers = [int(p) for p in parts]
total = sum(numbers)`, java: `int sum = 0;
for (int s : scores) sum += s;
int average = sum / scores.length;`, cs: `int sum = 0;
foreach (int s in scores) sum += s;
int average = sum / scores.Length;` } },
    ],
    interview: {
      py: "Say which division you mean (`/` or `//`) and compare floats with a tolerance. Small slips like these are what interviewers notice in otherwise working code.",
      java: "Overflow is a favourite follow-up: if you sum large values or compute a midpoint, say why you use `long` or `lo + (hi - lo) / 2`.",
      cs: "Overflow is a favourite follow-up: if you sum large values or compute a midpoint, say why you use `long` or `lo + (hi - lo) / 2`.",
    },
    quiz: [
      { id: "var1", langs: ["java", "cs"],
        q: { java: "In Java, `int` holds up to about 2.1 billion. What happens when you add 1 to `Integer.MAX_VALUE`?",
             cs: "In C#, `int` holds up to about 2.1 billion. What happens when you add 1 to `int.MaxValue` (outside a `checked` block)?" },
        options: ["It throws an exception", "It becomes a `long` automatically", "It wraps around to a large negative number", "It stays at the maximum"], a: 2,
        why: { java: "Java integers wrap around silently. Use `long`, or `Math.addExact` if you'd rather get an exception.",
               cs: "C# integers wrap around silently by default. Use `long`, or a `checked` block to get an `OverflowException`." } },
      { id: "var1py", langs: ["py"], q: "In Python, what is `2 ** 64 + 1`?",
        options: ["An `OverflowError`", "A negative number: it wraps around", "`18446744073709551617`: Python integers grow as needed", "A float"], a: 2,
        why: "Python integers have no fixed size, so they never overflow. They just get slower as they get very large." },
      { id: "var2", q: "`0.1 + 0.2 == 0.3` is false. What's the right way to compare two decimals?",
        options: ["Check that their difference is smaller than a tiny tolerance", "Convert both to strings and compare", "Round both to whole numbers", "Use `===` instead"], a: 0,
        why: { py: "Binary floating point can't store 0.1 exactly, so tiny errors creep in. `abs(a - b) < 1e-9` (or `math.isclose(a, b)`) treats nearly-equal values as equal.",
               java: "Binary floating point can't store 0.1 exactly, so tiny errors creep in. `Math.abs(a - b) < 1e-9` treats nearly-equal values as equal.",
               cs: "Binary floating point can't store 0.1 exactly, so tiny errors creep in. `Math.Abs(a - b) < 1e-9` treats nearly-equal values as equal." } },
      { id: "var3", langs: ["java", "cs"],
        q: { java: "Java is statically typed. When is `int n = \"3\";` rejected?", cs: "C# is statically typed. When is `int n = \"3\";` rejected?" },
        options: ["When that line runs", "Never: it's converted automatically", "Only in debug builds", "At compile time, before the program runs"], a: 3,
        why: "The compiler checks every assignment against the variable's type, so the program never starts with this mistake." },
      { id: "var3py", langs: ["py"], q: "Python is dynamically typed. When is a mistake like `\"3\" + 4` found?",
        options: ["When the file is saved", "When that line actually runs", "Never: Python converts the types automatically", "Before the program starts"], a: 1,
        why: "Python checks types as each line runs, so a bug in a rarely used branch can hide for a long time. Type hints plus a checker like mypy catch many of these earlier." },
    ],
  },
  {
    id: "control", name: "Control flow: decisions & loops", short: "If", part: "Core building blocks",
    yt: "control flow if else loops programming explained",
    what: {
      py: "Code runs top to bottom unless control flow changes the path. Branches (`if` / `elif` / `else`, `match`) choose between paths, loops (`for`, `while`) repeat work, and `break`, `continue` and `return` leave early. Conditions are boolean expressions combined with `and`, `or` and `not`.",
      java: "Code runs top to bottom unless control flow changes the path. Branches (`if` / `else`, `switch`) choose between paths, loops (`for`, for-each, `while`) repeat work, and `break`, `continue` and `return` leave early. Conditions are boolean expressions combined with `&&`, `||` and `!`.",
      cs: "Code runs top to bottom unless control flow changes the path. Branches (`if` / `else`, `switch`) choose between paths, loops (`for`, `foreach`, `while`) repeat work, and `break`, `continue` and `return` leave early. Conditions are boolean expressions combined with `&&`, `||` and `!`.",
    },
    points: [
      { py: "Use `for` to go over a collection or a `range`, and `while` to repeat until something happens.",
        java: "Use for-each (`for (int x : nums)`) to go over a collection, a counted `for` when you need the index, and `while` to repeat until something happens.",
        cs: "Use `foreach` to go over a collection, a counted `for` when you need the index, and `while` to repeat until something happens." },
      "Every loop needs a condition that eventually becomes false. Know what changes on each pass.",
      { py: "`and` / `or` short-circuit: in `a and b`, `b` isn't evaluated when `a` is false. Use that to guard risky checks.",
        java: "`&&` / `||` short-circuit: in `a && b`, `b` isn't evaluated when `a` is false. Use that to guard risky checks.",
        cs: "`&&` / `||` short-circuit: in `a && b`, `b` isn't evaluated when `a` is false. Use that to guard risky checks." },
      "Guard clauses (return early for special cases) keep the main logic flat instead of deeply nested.",
      { py: "Ranges are half-open: `range(a, b)` includes `a` and stops before `b`. Sticking to that habit avoids off-by-one errors.",
        java: "Write loops half-open: `for (int i = a; i < b; i++)` includes `a` and stops before `b`. Sticking to that habit avoids off-by-one errors.",
        cs: "Write loops half-open: `for (int i = a; i < b; i++)` includes `a` and stops before `b`. Sticking to that habit avoids off-by-one errors." },
    ],
    topics: [
      { title: "Booleans: true / false values",
        text: { py: "A boolean (`bool`) is either `True` or `False`. Every comparison produces one, and you can keep it in a variable. Name it like a yes/no question (`is_adult`, `has_ticket`, `can_enter`) and the `if` reads like a sentence.",
          java: "A `boolean` is either `true` or `false`. Every comparison produces one, and you can keep it in a variable. Name it like a yes/no question (`isAdult`, `hasTicket`, `canEnter`) and the `if` reads like a sentence.",
          cs: "A `bool` is either `true` or `false`. Every comparison produces one, and you can keep it in a variable. Name it like a yes/no question (`isAdult`, `hasTicket`, `canEnter`) and the `if` reads like a sentence." },
        code: {
          py: `age, has_ticket = 20, True
is_adult = age >= 18                 # a comparison gives a bool: True
can_enter = is_adult and has_ticket  # combine named conditions
print(type(is_adult), can_enter)     # <class 'bool'> True
if can_enter:                        # not: if can_enter == True
    print("welcome")`,
          java: `int age = 20;
boolean hasTicket = true;
boolean isAdult = age >= 18;               // a comparison gives a boolean: true
boolean canEnter = isAdult && hasTicket;   // combine named conditions
System.out.println(canEnter);              // true
if (canEnter) {                            // not: if (canEnter == true)
    System.out.println("welcome");
}`,
          cs: `int age = 20;
bool hasTicket = true;
bool isAdult = age >= 18;                  // a comparison gives a bool: true
bool canEnter = isAdult && hasTicket;      // combine named conditions
Console.WriteLine(canEnter);               // True (C# prints bools capitalised)
if (canEnter)                              // not: if (canEnter == true)
{
    Console.WriteLine("welcome");
}` } },
      { title: "Comparison operators",
        text: { py: "Comparisons return a boolean. One `=` assigns, two `==` compare. Python's `==` compares values (two lists with the same items are equal), while `is` checks that both names point to the very same object.",
          java: "Comparisons return a boolean. One `=` assigns, two `==` compare. On numbers, `==` compares values; on objects (including `String`) it checks whether both point to the very same object, so compare content with `.equals()`.",
          cs: "Comparisons return a boolean. One `=` assigns, two `==` compare. On numbers and on `string`, `==` compares values (the text, for strings); on most other classes it checks for the very same object unless the class defines its own `==`." },
        head: ["Operator", "Meaning", "Example", "Result"],
        rows: [
          ["`==`", "equal to", "`3 == 3`", PR_T],
          ["`!=`", "not equal to", "`3 != 4`", PR_T],
          ["`<`", "less than", "`2 < 5`", PR_T],
          ["`>`", "greater than", "`2 > 5`", PR_F],
          ["`<=`", "less than or equal to", "`5 <= 5`", PR_T],
          ["`>=`", "greater than or equal to", "`4 >= 5`", PR_F],
          { py: ["`is` / `is not`", "the same object (use it for `None`)", "`x is None`", "`True` when `x` is `None`"] },
          { py: ["`in` / `not in`", "is it in the collection?", "`3 in [1, 2, 3]`", "`True`"] },
          { py: ["chained", "both comparisons at once", "`0 <= i < n`", "`True` when `i` is a valid index"] },
          { java: ["`.equals()`", "same content (strings, objects)", "`s.equals(\"hi\")`", "`true` when `s` reads hi"] },
          { cs: ["`is null` / `is not null`", "null check", "`s is null`", "`true` when `s` is `null`"] },
        ] },
      { title: { py: "Truth table: and, or, not", java: "Truth table: &&, ||, !", cs: "Truth table: &&, ||, !" },
        text: { py: "`and` is `True` only when both sides are, `or` is `True` when at least one side is, and `not` flips a value.",
          java: "`&&` (and) is `true` only when both sides are, `||` (or) is `true` when at least one side is, and `!` (not) flips a value.",
          cs: "`&&` (and) is `true` only when both sides are, `||` (or) is `true` when at least one side is, and `!` (not) flips a value." },
        head: { py: ["`a`", "`b`", "`a and b`", "`a or b`", "`not a`"], java: ["`a`", "`b`", "`a && b`", "`a || b`", "`!a`"], cs: ["`a`", "`b`", "`a && b`", "`a || b`", "`!a`"] },
        rows: [
          [PR_T, PR_T, PR_T, PR_T, PR_F],
          [PR_T, PR_F, PR_F, PR_T, PR_F],
          [PR_F, PR_T, PR_F, PR_T, PR_T],
          [PR_F, PR_F, PR_F, PR_F, PR_T],
        ],
        after: { py: "`not` binds tighter than `and`, which binds tighter than `or`: `a or b and c` means `a or (b and c)`. Add brackets when you mix them.",
          java: "`!` binds tighter than `&&`, which binds tighter than `||`: `a || b && c` means `a || (b && c)`. Add brackets when you mix them.",
          cs: "`!` binds tighter than `&&`, which binds tighter than `||`: `a || b && c` means `a || (b && c)`. Add brackets when you mix them." } },
      { title: { py: "Truthy and falsy values", java: "Conditions must be booleans", cs: "Conditions must be booleans" },
        text: { py: "Any value can be a condition. These count as false (falsy): `False`, `None`, `0`, `0.0`, `\"\"` (empty string) and empty collections (`[]`, `{}`, `set()`, `()`). Everything else is truthy, so `if nums:` means \"if nums isn't empty\". Careful: `if x:` is also false when `x` is `0`; write `if x is not None:` when 0 is a valid value.",
          java: "A condition must be a `boolean`. `if (n)` or `if (list)` doesn't compile: write the comparison you mean, such as `if (n != 0)`, `if (!list.isEmpty())` or `if (s != null)`.",
          cs: "A condition must be a `bool`. `if (n)` or `if (list)` doesn't compile: write the comparison you mean, such as `if (n != 0)`, `if (list.Count > 0)` or `if (!string.IsNullOrEmpty(s))`." },
        code: { py: `print(bool(0), bool(""), bool([]), bool(None))   # False False False False
print(bool(5), bool("0"), bool([0]))             # True True True` } },
      { title: { py: "if / elif / else", java: "if / else if / else", cs: "if / else if / else" },
        text: { py: "Conditions are checked from the top, and only the first branch whose condition is `True` runs; the rest are skipped. `else` catches everything that didn't match. A one-line choice can use a conditional expression: `label = \"even\" if n % 2 == 0 else \"odd\"`.",
          java: "Conditions are checked from the top, and only the first branch whose condition is `true` runs; the rest are skipped. `else` catches everything that didn't match. A one-line choice can use the ternary operator: `String label = n % 2 == 0 ? \"even\" : \"odd\";`.",
          cs: "Conditions are checked from the top, and only the first branch whose condition is `true` runs; the rest are skipped. `else` catches everything that didn't match. A one-line choice can use the ternary operator: `string label = n % 2 == 0 ? \"even\" : \"odd\";`." },
        code: {
          py: `score = 72
if score >= 90:
    grade = "A"
elif score >= 70:          # only checked when the line above was False
    grade = "B"
else:
    grade = "C"
print(grade)               # B: the first true branch wins, the rest are skipped`,
          java: `int score = 72;
String grade;
if (score >= 90) {
    grade = "A";
} else if (score >= 70) {  // only checked when the line above was false
    grade = "B";
} else {
    grade = "C";
}
System.out.println(grade); // B: the first true branch wins, the rest are skipped`,
          cs: `int score = 72;
string grade;
if (score >= 90)
{
    grade = "A";
}
else if (score >= 70)      // only checked when the line above was false
{
    grade = "B";
}
else
{
    grade = "C";
}
Console.WriteLine(grade);  // B: the first true branch wins, the rest are skipped` } },
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
      { py: "Adding or removing items in a list while looping over it skips items. Loop over a copy, or build a new list.",
        java: "Removing from a list inside a for-each throws `ConcurrentModificationException`. Use an `Iterator` or `removeIf`.",
        cs: "Changing a `List<T>` inside `foreach` throws `InvalidOperationException`. Loop backwards with `for`, or use `RemoveAll`." },
      "`=` (assign) versus `==` (compare).",
      { py: "Off by one: `range(1, n)` stops at `n - 1`.",
        java: "Off by one: `i <= nums.length` reads one past the end and throws `ArrayIndexOutOfBoundsException`.",
        cs: "Off by one: `i <= nums.Length` reads one past the end and throws `IndexOutOfRangeException`." },
    ],
    practice: [
      { why: "The variable already is the condition; comparing it with a boolean only adds noise.",
        bad: { py: `if is_valid == True:
    save()
if is_empty == False:
    load()`, java: `if (isValid == true) {
    save();
}
if (isEmpty == false) {
    load();
}`, cs: `if (isValid == true)
{
    Save();
}
if (isEmpty == false)
{
    Load();
}` },
        good: { py: `if is_valid:
    save()
if not is_empty:
    load()`, java: `if (isValid) {
    save();
}
if (!isEmpty) {
    load();
}`, cs: `if (isValid)
{
    Save();
}
if (!isEmpty)
{
    Load();
}` } },
      { why: "A comparison already is a boolean, so return it directly instead of branching to return a constant.",
        bad: { py: `def is_even(n):
    if n % 2 == 0:
        return True
    else:
        return False`, java: `boolean isEven(int n) {
    if (n % 2 == 0) {
        return true;
    } else {
        return false;
    }
}`, cs: `bool IsEven(int n)
{
    if (n % 2 == 0)
    {
        return true;
    }
    else
    {
        return false;
    }
}` },
        good: { py: `def is_even(n):
    return n % 2 == 0`, java: `boolean isEven(int n) {
    return n % 2 == 0;
}`, cs: `bool IsEven(int n) => n % 2 == 0;` } },
      { why: "Guard clauses deal with the special cases first and return, so the main work isn't buried inside nested `if`s and `else`s.",
        bad: { py: `def average(nums):
    if nums is not None:
        if len(nums) > 0:
            return sum(nums) / len(nums)
        else:
            return 0
    else:
        return 0`, java: `double average(int[] nums) {
    if (nums != null) {
        if (nums.length > 0) {
            int sum = 0;
            for (int x : nums) sum += x;
            return (double) sum / nums.length;
        } else {
            return 0;
        }
    } else {
        return 0;
    }
}`, cs: `double Average(int[] nums)
{
    if (nums != null)
    {
        if (nums.Length > 0)
        {
            int sum = 0;
            foreach (int x in nums) sum += x;
            return (double)sum / nums.Length;
        }
        else
        {
            return 0;
        }
    }
    else
    {
        return 0;
    }
}` },
        good: { py: `def average(nums):
    if not nums:   # None or empty
        return 0
    return sum(nums) / len(nums)`, java: `double average(int[] nums) {
    if (nums == null || nums.length == 0) return 0;
    int sum = 0;
    for (int x : nums) sum += x;
    return (double) sum / nums.length;
}`, cs: `double Average(int[] nums)
{
    if (nums == null || nums.Length == 0) return 0;
    int sum = 0;
    foreach (int x in nums) sum += x;
    return (double)sum / nums.Length;
}` } },
      { why: "A long condition is hard to read and easy to get wrong. Give each part a name and the `if` explains itself.",
        bad: { py: `if age >= 18 and (country == "CA" or has_visa) and not banned:
    hire()`, java: `if (age >= 18 && (country.equals("CA") || hasVisa) && !banned) {
    hire();
}`, cs: `if (age >= 18 && (country == "CA" || hasVisa) && !banned)
{
    Hire();
}` },
        good: { py: `is_adult = age >= 18
may_work = country == "CA" or has_visa
if is_adult and may_work and not banned:
    hire()`, java: `boolean isAdult = age >= 18;
boolean mayWork = country.equals("CA") || hasVisa;
if (isAdult && mayWork && !banned) {
    hire();
}`, cs: `bool isAdult = age >= 18;
bool mayWork = country == "CA" || hasVisa;
if (isAdult && mayWork && !banned)
{
    Hire();
}` } },
      { why: { py: "`None` is a single object, so `is None` is the exact check; `== None` can be fooled by a class that defines its own `==`.",
          java: "`==` on strings compares references, so two strings with the same text can be unequal. Putting the literal first also avoids a `NullPointerException` when `name` is `null`.",
          cs: "`ToLower()` creates two new strings and throws when `a` is `null`. `string.Equals` with a comparison option ignores case without either problem." },
        bad: { py: `if result == None:
    retry()`, java: `if (name == "admin") {
    grantAccess();
}`, cs: `if (a.ToLower() == b.ToLower())
{
    Merge();
}` },
        good: { py: `if result is None:
    retry()`, java: `if ("admin".equals(name)) {
    grantAccess();
}`, cs: `if (string.Equals(a, b, StringComparison.OrdinalIgnoreCase))
{
    Merge();
}` } },
      { why: { py: "When you only need the items, loop over them directly. Use `enumerate` when you need the index too.",
          java: "When you don't need the index, for-each says what you mean and can't go out of bounds.",
          cs: "When you don't need the index, `foreach` says what you mean and can't go out of bounds." },
        bad: { py: `for i in range(len(nums)):
    print(nums[i])`, java: `for (int i = 0; i < nums.length; i++) {
    System.out.println(nums[i]);
}`, cs: `for (int i = 0; i < nums.Length; i++)
{
    Console.WriteLine(nums[i]);
}` },
        good: { py: `for x in nums:
    print(x)
for i, x in enumerate(nums):   # index and item
    print(i, x)`, java: `for (int x : nums) {
    System.out.println(x);
}`, cs: `foreach (int x in nums)
{
    Console.WriteLine(x);
}` } },
    ],
    interview: "Say your loop bounds out loud (\"`left` starts at 0, `right` at the last index, stop when they cross\") and check the empty and one-element cases before you run anything.",
    quiz: [
      { id: "ctl1", q: { py: "How many times does `for i in range(2, 5)` run?", java: "How many times does `for (int i = 2; i < 5; i++)` run?", cs: "How many times does `for (int i = 2; i < 5; i++)` run?" },
        options: ["2", "3", "4", "5"], a: 1, why: "It runs for 2, 3 and 4. The end of the range is excluded." },
      { id: "ctl2", q: { py: "Why write `i < len(nums) and nums[i] > 0` in that order?", java: "Why write `i < nums.length && nums[i] > 0` in that order?", cs: "Why write `i < nums.Length && nums[i] > 0` in that order?" },
        options: ["Conditions are evaluated right to left", "The order doesn't matter", "If `i` is out of range, the second check is skipped instead of crashing", "It's shorter to type"], a: 2,
        why: { py: "`and` stops at the first false part, so the bounds check protects the index lookup.",
               java: "`&&` stops at the first false part, so the bounds check protects the index lookup.",
               cs: "`&&` stops at the first false part, so the bounds check protects the index lookup." } },
      { id: "ctl3", q: "What's a guard clause?",
        options: ["An early return that handles a special case first, so the main logic isn't nested", "A comment explaining a loop", "A try/catch block", "A loop that never ends"], a: 0,
        why: { py: "Handling odd cases up front (`if not nums: return 0`) leaves the normal path at the top level, which is easier to read.",
               java: "Handling odd cases up front (`if (nums.length == 0) return 0;`) leaves the normal path at the top level, which is easier to read.",
               cs: "Handling odd cases up front (`if (nums.Length == 0) return 0;`) leaves the normal path at the top level, which is easier to read." } },
    ],
  },
  {
    id: "functions", name: "Functions, parameters & scope", short: "Fn", part: "Core building blocks",
    yt: "functions parameters return values scope programming explained",
    what: {
      py: "A function puts a few steps behind a name: inputs come in as parameters, and the result goes out as the return value. Functions let you reuse code, test pieces on their own, and name an idea so the code reads like the solution. Names created inside a function are local: they exist only while that call runs.",
      java: "A method puts a few steps behind a name: inputs come in as parameters, and the result goes out as the return value. Methods let you reuse code, test pieces on their own, and name an idea so the code reads like the solution. Variables declared inside a method are local: they exist only while that call runs.",
      cs: "A method puts a few steps behind a name: inputs come in as parameters, and the result goes out as the return value. Methods let you reuse code, test pieces on their own, and name an idea so the code reads like the solution. Variables declared inside a method are local: they exist only while that call runs.",
    },
    points: [
      { py: "One function, one job. Name it with a verb that says what it does: `parse_date`, `is_valid`.",
        java: "One method, one job. Name it with a verb that says what it does: `parseDate`, `isValid`.",
        cs: "One method, one job. Name it with a verb that says what it does: `ParseDate`, `IsValid`." },
      { py: "Pass data in and return results. Reading and writing global variables hides what a function depends on.",
        java: "Pass data in and return results. Reading and writing shared `static` fields hides what a method depends on.",
        cs: "Pass data in and return results. Reading and writing shared `static` fields hides what a method depends on." },
      { py: "Local scope: a variable made inside a function disappears when the function returns. Assigning to a name inside a function makes a new local, even if a global has the same name.",
        java: "Local scope: a variable declared inside a method (or a block) disappears when that method (or block) ends.",
        cs: "Local scope: a variable declared inside a method (or a block) disappears when that method (or block) ends." },
      { py: "Default parameters (`def area(w, h=1)`) and keyword arguments (`area(w=3, h=4)`) make calls shorter and clearer.",
        java: "Java has no default parameters: overloading (several methods with one name and different parameters) gives callers shorter calls.",
        cs: "Optional parameters (`int height = 1`) and named arguments (`Area(width: 3)`) make calls shorter and clearer. Overloading works too." },
      { py: "Functions are values: pass one to `sorted(key=...)`, `max(key=...)` or `map`. Short ones can be `lambda`s.",
        java: "Lambdas and method references (`String::length`) let you pass behaviour to `sort`, streams and comparators.",
        cs: "Lambdas and delegates (`Func<int, int>`) let you pass behaviour to `Sort`, LINQ and events." },
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
      { py: "Mutable default arguments: `def f(x, seen=[])` shares one list across every call. Use `seen=None`, then create the list inside." },
      "Code that computes and also prints is hard to test and reuse. Return the value; print at the edge.",
      "More than three or four parameters usually means they belong together in an object.",
      { java: "Several parameters of the same type (`int, int, int`) are easy to pass in the wrong order. Name things clearly, or group them in a record.",
        cs: "Several parameters of the same type (`int, int, int`) are easy to pass in the wrong order. Named arguments help: `Resize(width: 3, height: 4)`." },
    ],
    practice: [
      { why: "A function that returns its result can be tested, reused and combined. Printing is the caller's choice.",
        bad: { py: `def area(w, h):
    print(w * h)            # the caller can't use the number`, java: `void area(int w, int h) {
    System.out.println(w * h);   // the caller can't use the number
}`, cs: `void Area(int w, int h)
{
    Console.WriteLine(w * h);    // the caller can't use the number
}` },
        good: { py: `def area(w, h):
    return w * h

print(area(3, 4))           # print where you need it`, java: `int area(int w, int h) {
    return w * h;
}`, cs: `int Area(int w, int h) => w * h;` } },
      { why: "Everything a function uses should come in as a parameter and leave as a return value. Hidden shared state makes calls depend on what ran before.",
        bad: { py: `total = 0

def add(price):
    global total
    total += price          # changes hidden shared state`, java: `static int total = 0;

static void add(int price) {
    total += price;         // changes hidden shared state
}`, cs: `static int total = 0;

static void Add(int price)
{
    total += price;         // changes hidden shared state
}` },
        good: { py: `def add(total, price):
    return total + price

total = add(0, 5)`, java: `static int add(int total, int price) {
    return total + price;   // inputs in, result out
}`, cs: `static int Add(int total, int price) => total + price;   // inputs in, result out` } },
      { why: { py: "A default value is created once, when the function is defined, so a list default is shared by every call. Default to `None` and create the list inside.",
          java: "Five loose parameters are easy to pass in the wrong order. A record groups them with names.",
          cs: "Five loose parameters are easy to pass in the wrong order. A record groups them with names." },
        bad: { py: `def add_tag(tag, tags=[]):
    tags.append(tag)        # the same list on every call
    return tags`, java: `void book(String name, String email, String phone, int guests, String date) {
    save(name, email, phone, guests, date);
}`, cs: `void Book(string name, string email, string phone, int guests, string date)
{
    Save(name, email, phone, guests, date);
}` },
        good: { py: `def add_tag(tag, tags=None):
    if tags is None:
        tags = []           # a new list for each call
    tags.append(tag)
    return tags`, java: `record Booking(String name, String email, String phone, int guests, String date) {}

void book(Booking booking) {
    save(booking);
}`, cs: `record Booking(string Name, string Email, string Phone, int Guests, string Date);

void Book(Booking booking)
{
    Save(booking);
}` } },
    ],
    interview: {
      py: "Split a solution into small helpers (`in_bounds(r, c)`, `neighbors(node)`). The interviewer follows it faster, and a bug is easier to find in a five-line function.",
      java: "Split a solution into small helpers (`inBounds(r, c)`, `neighbors(node)`). The interviewer follows it faster, and a bug is easier to find in a five-line method.",
      cs: "Split a solution into small helpers (`InBounds(r, c)`, `Neighbors(node)`). The interviewer follows it faster, and a bug is easier to find in a five-line method.",
    },
    quiz: [
      { id: "fn1", langs: ["py"], q: "In Python, what goes wrong with `def visit(node, seen=[])`?",
        options: ["It's a syntax error", "`seen` is always empty", "Nothing, it's fine", "The same list is shared by every call that uses the default"], a: 3,
        why: "Default values are created once, when the function is defined, so every call shares that one list. Use `seen=None` and `if seen is None: seen = []`." },
      { id: "fn1java", langs: ["java"], q: "Java has no default parameter values. How do you let callers leave out an argument?",
        options: ["You can't", "Overload the method: a shorter version calls the full one with a default value", "Pass `null` and hope", "Use a global variable"], a: 1,
        why: "`area(int w)` can simply `return area(w, 1);`. Callers get the short form, and the logic lives in one place." },
      { id: "fn1cs", langs: ["cs"], q: "Given `int Area(int width, int height = 1)`, what does `Area(5)` do?",
        options: ["Compile error: an argument is missing", "Uses 0 for height", "Throws at run time", "Uses the default, so height is 1 and it returns 5"], a: 3,
        why: "Optional parameters take their default value when the caller leaves them out. Defaults must be compile-time constants." },
      { id: "fn2", q: "Which is easiest to test?",
        options: ["A function that takes values and returns a result",
          { py: "One that reads `input()`, computes and prints", java: "One that reads `System.in`, computes and prints", cs: "One that reads `Console.ReadLine()`, computes and prints" },
          { py: "One that changes a global variable", java: "One that changes a static field", cs: "One that changes a static field" }, "One with no parameters that reads a file"], a: 0,
        why: "A test just calls it with inputs and checks the return value: no keyboard, files or shared state involved." },
      { id: "fn3", q: "A variable created inside a function or method...",
        options: ["...is visible everywhere in the program", "...exists only while that call runs (local scope)", "...becomes a global after the call returns", "...is shared by every function in the file"], a: 1,
        why: "Each call gets its own local variables, which disappear when it returns. That's why recursion works: each call has its own copy." },
    ],
  },
  {
    id: "references", name: "Data, references & mutability", short: "Rf", part: "Core building blocks",
    yt: "mutable vs immutable references aliasing shallow deep copy explained",
    what: {
      py: "Some values can't change: numbers, strings and tuples are immutable, so \"changing\" one creates a new value. Others are mutable: lists, dicts, sets and most objects change in place. A variable holds a reference to its object, so two names can point at the same object (aliasing), and a change through one name shows through the other.",
      java: "Some values can't change: `String` and the boxed types (`Integer`) are immutable, so \"changing\" one creates a new value. Others are mutable: `ArrayList`, `HashMap` and most objects change in place. A variable of an object type holds a reference, so two variables can point at the same object (aliasing), and a change through one shows through the other.",
      cs: "Some values can't change: `string` is immutable, so \"changing\" one creates a new value. Others are mutable: `List<T>`, `Dictionary` and most objects change in place. A variable of a class type holds a reference, so two variables can point at the same object (aliasing), and a change through one shows through the other.",
    },
    points: [
      "Assigning one variable to another doesn't copy a list or object. It gives the same object a second name.",
      { py: "A shallow copy (`a[:]`, `list(a)`) makes a new outer list that still shares the items inside. `copy.deepcopy` copies everything.",
        java: "A shallow copy (`new ArrayList<>(a)`) makes a new list that still shares the objects inside. For a deep copy, copy the nested objects yourself.",
        cs: "A shallow copy (`new List<T>(a)`) makes a new list that still shares the objects inside. For a deep copy, copy the nested objects yourself." },
      "String methods return new strings; the original never changes.",
      { py: "`==` compares contents; `is` asks whether two names point at the same object.",
        java: "`.equals` compares contents; `==` on objects asks whether two variables point at the same object.",
        cs: "`==` compares contents for strings and records, but identity for most classes. `ReferenceEquals` always checks identity." },
      { java: "Primitives (`int`, `double`, `boolean`) are values: assignment copies them. Everything else is a reference.",
        cs: "Value types (`int`, `double`, structs) are copied on assignment. Classes are references." },
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
      { py: "`[[0] * n] * m` makes `m` references to one row. Use `[[0] * n for _ in range(m)]`.",
        java: "`Arrays.fill(rows, new int[n])` puts the same array in every slot. Create each row in a loop.",
        cs: "`Enumerable.Repeat(new List<int>(), m)` gives `m` references to one list. Create each list in a loop." },
      { py: "Backtracking: `res.append(path)` stores the same list every time. Store a copy: `res.append(path[:])`.",
        java: "Backtracking: `res.add(path)` stores the same list every time. Store a copy: `res.add(new ArrayList<>(path))`.",
        cs: "Backtracking: `res.Add(path)` stores the same list every time. Store a copy: `res.Add(new List<int>(path))`." },
      "Returning an internal list lets callers change your object's state behind its back.",
      { java: "Comparing strings with `==` checks identity, not contents. Use `.equals`.",
        cs: "A struct you get from a list or a property is a copy: changing it doesn't change the original." },
    ],
    practice: [
      { why: "Sorting in place also reorders the caller's list. Unless changing it is the point (and the name says so), work on a copy.",
        bad: { py: `def sorted_scores(scores):
    scores.sort()           # also reorders the caller's list
    return scores`, java: `List<Integer> sortedScores(List<Integer> scores) {
    Collections.sort(scores);    // also reorders the caller's list
    return scores;
}`, cs: `List<int> SortedScores(List<int> scores)
{
    scores.Sort();               // also reorders the caller's list
    return scores;
}` },
        good: { py: `def sorted_scores(scores):
    return sorted(scores)   # a new list; the caller's is untouched`, java: `List<Integer> sortedScores(List<Integer> scores) {
    List<Integer> copy = new ArrayList<>(scores);
    Collections.sort(copy);      // the caller's list is untouched
    return copy;
}`, cs: `List<int> SortedScores(List<int> scores)
{
    var copy = new List<int>(scores);
    copy.Sort();                 // the caller's list is untouched
    return copy;
}` } },
      { why: "Storing the list you keep changing stores a reference, not its current contents. Store a copy to keep a snapshot.",
        bad: { py: `res, path = [], []
for x in [1, 2]:
    path.append(x)
    res.append(path)        # the same list, twice
print(res)                  # [[1, 2], [1, 2]]`, java: `List<List<Integer>> res = new ArrayList<>();
List<Integer> path = new ArrayList<>();
for (int x : new int[] {1, 2}) {
    path.add(x);
    res.add(path);               // the same list, twice
}
System.out.println(res);         // [[1, 2], [1, 2]]`, cs: `var res = new List<List<int>>();
var path = new List<int>();
foreach (int x in new[] { 1, 2 })
{
    path.Add(x);
    res.Add(path);               // the same list, twice
}
// res[0] and res[1] are both [1, 2]` },
        good: { py: `res, path = [], []
for x in [1, 2]:
    path.append(x)
    res.append(path[:])     # a snapshot
print(res)                  # [[1], [1, 2]]`, java: `List<List<Integer>> res = new ArrayList<>();
List<Integer> path = new ArrayList<>();
for (int x : new int[] {1, 2}) {
    path.add(x);
    res.add(new ArrayList<>(path));   // a snapshot
}
System.out.println(res);              // [[1], [1, 2]]`, cs: `var res = new List<List<int>>();
var path = new List<int>();
foreach (int x in new[] { 1, 2 })
{
    path.Add(x);
    res.Add(new List<int>(path));     // a snapshot
}
// res[0] is [1], res[1] is [1, 2]` } },
      { why: "Repeating one row object makes every row the same object, so a change to one shows up in all of them. Create each row separately.",
        bad: { py: `grid = [[0] * 3] * 2         # two references to one row
grid[0][0] = 1
print(grid)                  # [[1, 0, 0], [1, 0, 0]]`, java: `int[][] grid = new int[2][];
Arrays.fill(grid, new int[3]);   // one row array in both slots
grid[0][0] = 1;                  // grid[1][0] is now 1 too`, cs: `var grid = Enumerable.Repeat(new int[3], 2).ToArray();   // one row in both slots
grid[0][0] = 1;                  // grid[1][0] is now 1 too` },
        good: { py: `grid = [[0] * 3 for _ in range(2)]   # a new row each time
grid[0][0] = 1
print(grid)                  # [[1, 0, 0], [0, 0, 0]]`, java: `int[][] grid = new int[2][3];    // independent rows
grid[0][0] = 1;                  // grid[1][0] is still 0`, cs: `var grid = new int[2][];
for (int r = 0; r < grid.Length; r++) grid[r] = new int[3];   // independent rows
grid[0][0] = 1;                  // grid[1][0] is still 0` } },
    ],
    interview: {
      py: "The backtracking copy bug is a classic: if every result comes out empty, you appended the shared `path` instead of `path[:]`.",
      java: "The backtracking copy bug is a classic: if every result comes out empty, you added the shared `path` instead of `new ArrayList<>(path)`.",
      cs: "The backtracking copy bug is a classic: if every result comes out empty, you added the shared `path` instead of `new List<int>(path)`.",
    },
    quiz: [
      { id: "ref1", q: { py: "After `b = a` (where `a` is a list) and `b.append(4)`, what is `a`?",
                        java: "After `List<Integer> b = a;` and `b.add(4)`, what is `a`?",
                        cs: "After `var b = a;` (where `a` is a `List<int>`) and `b.Add(4)`, what is `a`?" },
        options: ["Unchanged, because `b` is a copy", "Also ends with 4: `a` and `b` are the same list", "An error is raised", "Empty"], a: 1,
        why: { py: "Assignment copies the reference, not the list. Use `a[:]` or `list(a)` to get a separate copy.",
               java: "Assignment copies the reference, not the list. Use `new ArrayList<>(a)` to get a separate copy.",
               cs: "Assignment copies the reference, not the list. Use `new List<int>(a)` to get a separate copy." } },
      { id: "ref2", q: { py: "In a backtracking solution you collect results with `res.append(path)`, and at the end every result is empty. Why?",
                        java: "In a backtracking solution you collect results with `res.add(path)`, and at the end every result is empty. Why?",
                        cs: "In a backtracking solution you collect results with `res.Add(path)`, and at the end every result is empty. Why?" },
        options: ["Adding to a list doesn't work inside recursion", "Lists can't hold other lists", "The recursion never reached a base case", "Every entry is the same `path` list, which ended up empty after backtracking"], a: 3,
        why: { py: "Each result points at one shared list that keeps changing. Append a snapshot instead: `res.append(path[:])`.",
               java: "Each result points at one shared list that keeps changing. Add a snapshot instead: `res.add(new ArrayList<>(path))`.",
               cs: "Each result points at one shared list that keeps changing. Add a snapshot instead: `res.Add(new List<int>(path))`." } },
      { id: "ref3", langs: ["java"], q: "In Java, why can `s1 == s2` be false for two strings that both read \"hi\"?",
        options: ["`==` checks whether they're the same object; `.equals` compares contents", "Strings are mutable in Java", "`==` only works on numbers", "It's a compiler bug"], a: 0,
        why: "For objects, `==` compares references. Use `.equals` to compare contents." },
      { id: "ref3py", langs: ["py"], q: "Two lists `a` and `b` hold the same items. Why is `a == b` True but `a is b` False?",
        options: ["`==` compares contents; `is` checks whether they're the same object", "`is` only works on numbers", "Lists can't be compared", "It's random"], a: 0,
        why: "They're equal in value but are two separate objects. Use `is` only for identity checks like `x is None`." },
      { id: "ref3cs", langs: ["cs"], q: "Two `List<int>` objects hold the same items. Why is `a == b` false?",
        options: ["Lists are value types", "`==` on a class compares references unless the class overrides it; `SequenceEqual` compares the items", "`==` only works on numbers", "It's a compiler bug"], a: 1,
        why: "`List<T>` doesn't override `==`, so it checks identity. `a.SequenceEqual(b)` (LINQ) compares contents." },
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
      { py: "Python stops at about 1,000 levels by default (`RecursionError`). For deep inputs, use a loop with an explicit stack.",
        java: "Very deep recursion throws `StackOverflowError`. For deep inputs, use a loop with an explicit stack.",
        cs: "A `StackOverflowException` can't be caught: it ends the program. For deep inputs, use a loop with an explicit stack." },
      "Plain recursive Fibonacci repeats work exponentially. Memoize, or build the answer bottom-up.",
      "Backtracking that changes shared state must undo the change after the recursive call.",
    ],
    practice: [
      { why: "Write the base case first, so every call path has a way to stop.",
        bad: { py: `def count_down(n):
    print(n)
    count_down(n - 1)       # never stops`, java: `void countDown(int n) {
    System.out.println(n);
    countDown(n - 1);       // never stops
}`, cs: `void CountDown(int n)
{
    Console.WriteLine(n);
    CountDown(n - 1);       // never stops
}` },
        good: { py: `def count_down(n):
    if n < 0:               # base case first
        return
    print(n)
    count_down(n - 1)`, java: `void countDown(int n) {
    if (n < 0) return;      // base case first
    System.out.println(n);
    countDown(n - 1);
}`, cs: `void CountDown(int n)
{
    if (n < 0) return;      // base case first
    Console.WriteLine(n);
    CountDown(n - 1);
}` } },
      { why: "Plain recursive Fibonacci solves the same subproblems over and over (O(2ⁿ)). Remembering each answer makes it O(n).",
        bad: { py: `def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)`, java: `long fib(int n) {
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);
}`, cs: `long Fib(int n)
{
    if (n < 2) return n;
    return Fib(n - 1) + Fib(n - 2);
}` },
        good: { py: `from functools import cache

@cache                      # remembers each answer
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)`, java: `Map<Integer, Long> memo = new HashMap<>();

long fib(int n) {
    if (n < 2) return n;
    Long known = memo.get(n);
    if (known != null) return known;
    long result = fib(n - 1) + fib(n - 2);
    memo.put(n, result);
    return result;
}`, cs: `Dictionary<int, long> memo = new();

long Fib(int n)
{
    if (n < 2) return n;
    if (memo.TryGetValue(n, out long known)) return known;
    long result = Fib(n - 1) + Fib(n - 2);
    memo[n] = result;
    return result;
}` } },
      { why: "Copying the rest of the input on every call adds O(n) work per call, O(n²) in total. Pass an index instead.",
        bad: { py: `def total(nums):
    if not nums:
        return 0
    return nums[0] + total(nums[1:])   # copies the list each call`, java: `int total(int[] nums) {
    if (nums.length == 0) return 0;
    // copies the rest of the array on every call
    return nums[0] + total(Arrays.copyOfRange(nums, 1, nums.length));
}`, cs: `int Total(int[] nums)
{
    if (nums.Length == 0) return 0;
    return nums[0] + Total(nums[1..]);   // copies the array each call
}` },
        good: { py: `def total(nums, i=0):
    if i == len(nums):
        return 0
    return nums[i] + total(nums, i + 1)`, java: `int total(int[] nums, int i) {   // call total(nums, 0)
    if (i == nums.length) return 0;
    return nums[i] + total(nums, i + 1);
}`, cs: `int Total(int[] nums, int i = 0)
{
    if (i == nums.Length) return 0;
    return nums[i] + Total(nums, i + 1);
}` } },
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
    what: {
      py: "When a function is called, it gets a frame on the call stack holding its parameters and local variables; the frame is removed when the call returns. Objects (lists, class instances) live on the heap and stay as long as something refers to them; the garbage collector frees them after that. Python passes each argument as a reference to its object, so a function can change a mutable object but can't rebind the caller's variable.",
      java: "When a method is called, it gets a frame on the call stack holding its parameters and local variables; the frame is removed when the call returns. Objects live on the heap and stay as long as something refers to them; the garbage collector frees them after that. Java always passes by value: primitives are copied, and for objects the reference is copied.",
      cs: "When a method is called, it gets a frame on the call stack holding its parameters and local variables; the frame is removed when the call returns. Objects (class instances) live on the heap and stay as long as something refers to them; the garbage collector frees them after that. C# passes by value by default: value types are copied, and for classes the reference is copied.",
    },
    points: [
      "The call stack is why a function's locals are separate from its caller's, and why recursion uses memory.",
      { py: "Changing an object inside a function (`items.append(x)`) is visible to the caller. Rebinding the parameter (`items = []`) isn't.",
        java: "Changing an object inside a method (`items.add(x)`) is visible to the caller. Reassigning the parameter (`items = new ArrayList<>()`) isn't.",
        cs: "Changing an object inside a method (`items.Add(x)`) is visible to the caller. Reassigning the parameter (`items = new List<string>()`) isn't." },
      { py: "To give the caller a new value, return it. Python can return several values at once as a tuple.",
        java: "A method can't reassign the caller's variable. Return the new value instead.",
        cs: "`ref` and `out` pass the caller's variable itself, so the method can reassign it. Returning a value (or a tuple) is usually clearer." },
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
      { py: "Expecting `items = []` inside a function to clear the caller's list. Use `items.clear()` to change the object itself.",
        java: "Expecting `items = new ArrayList<>()` inside a method to clear the caller's list. Use `items.clear()` to change the object itself.",
        cs: "Expecting `items = new List<string>()` inside a method to clear the caller's list. Use `items.Clear()` to change the object itself." },
      "A function that changes its argument as a side effect surprises callers. Say so in its name, or return a new value.",
      "Deep recursion: thousands of frames can overflow the stack.",
      "A cache or listener list that only grows keeps objects alive forever.",
    ],
    practice: [
      { why: "Assigning to a parameter only points the local name somewhere new. To change the caller's object, call a method on it (or return a new value).",
        bad: { py: `def reset(items):
    items = []              # only rebinds the local name`, java: `void reset(List<String> items) {
    items = new ArrayList<>();   // only changes the local variable
}`, cs: `void Reset(List<string> items)
{
    items = new List<string>();  // only changes the local variable
}` },
        good: { py: `def reset(items):
    items.clear()           # empties the caller's list`, java: `void reset(List<String> items) {
    items.clear();               // empties the caller's list
}`, cs: `void Reset(List<string> items)
{
    items.Clear();               // empties the caller's list
}` } },
      { why: "Reading a whole file into memory fails on big files. Stream it a line at a time, and let the language close the file.",
        bad: { py: `def count_errors(path):
    lines = open(path).readlines()       # whole file in memory, never closed
    return sum("ERROR" in line for line in lines)`, java: `long countErrors(Path path) throws IOException {
    List<String> lines = Files.readAllLines(path);   // whole file in memory
    return lines.stream().filter(l -> l.contains("ERROR")).count();
}`, cs: `int CountErrors(string path)
{
    string[] lines = File.ReadAllLines(path);       // whole file in memory
    return lines.Count(l => l.Contains("ERROR"));
}` },
        good: { py: `def count_errors(path):
    with open(path) as f:                # one line at a time, closed after
        return sum("ERROR" in line for line in f)`, java: `long countErrors(Path path) throws IOException {
    // one line at a time, closed after
    try (Stream<String> lines = Files.lines(path)) {
        return lines.filter(l -> l.contains("ERROR")).count();
    }
}`, cs: `int CountErrors(string path) =>
    File.ReadLines(path).Count(l => l.Contains("ERROR"));   // one line at a time` } },
      { why: "A cache that only grows keeps every object alive until the program runs out of memory. Give it a size limit.",
        bad: { py: `cache = {}

def lookup(key):
    if key not in cache:
        cache[key] = fetch(key)     # grows forever
    return cache[key]`, java: `Map<String, String> cache = new HashMap<>();

String lookup(String key) {
    return cache.computeIfAbsent(key, k -> fetch(k));   // grows forever
}`, cs: `Dictionary<string, string> cache = new();

string Lookup(string key)
{
    if (!cache.TryGetValue(key, out var value))
        cache[key] = value = Fetch(key);   // grows forever
    return value;
}` },
        good: { py: `from functools import lru_cache

@lru_cache(maxsize=1000)            # keeps the 1,000 most recent
def lookup(key):
    return fetch(key)`, java: `static final int MAX = 1000;
Map<String, String> cache = new LinkedHashMap<>(16, 0.75f, true) {
    protected boolean removeEldestEntry(Map.Entry<String, String> eldest) {
        return size() > MAX;        // drops the least recently used
    }
};

String lookup(String key) {
    return cache.computeIfAbsent(key, k -> fetch(k));
}`, cs: `const int Max = 1000;
Dictionary<string, string> cache = new();

string Lookup(string key)
{
    if (cache.TryGetValue(key, out var value)) return value;
    // simplest cap; an LRU would drop one entry instead
    if (cache.Count >= Max) cache.Clear();
    return cache[key] = Fetch(key);
}` } },
    ],
    interview: "When asked for space complexity, count the call stack too: \"O(n) for the hash map plus O(h) for the recursion\".",
    quiz: [
      { id: "mem1", q: { py: "A function receives a list and calls `items.append(x)`. Does the caller see the change?",
                        java: "A method receives a list and calls `items.add(x)`. Does the caller see the change?",
                        cs: "A method receives a list and calls `items.Add(x)`. Does the caller see the change?" },
        options: ["No, the function got a copy of the list", "Only if the list was empty", "Yes: both refer to the same list object", "Only if the function returns the list"], a: 2,
        why: "The reference was copied, not the list, so both names point at one object." },
      { id: "mem2", q: { py: "Inside the function, `items = []` rebinds the parameter. Does the caller's list change?",
                        java: "Inside the method, `items = new ArrayList<>();` reassigns the parameter. Does the caller's list change?",
                        cs: "Inside the method, `items = new List<string>();` reassigns the parameter. Does the caller's list change?" },
        options: ["No: only the local parameter now points to a new list", "Yes, it becomes empty", "It raises an error", "Yes, but only after the call returns"], a: 0,
        why: { py: "Rebinding changes which object the local name refers to. The caller's variable still points at the original list.",
               java: "Reassigning changes which object the local variable refers to. The caller's variable still points at the original list.",
               cs: "Reassigning changes which object the local variable refers to. The caller's variable still points at the original list (unless the parameter is `ref`)." } },
      { id: "mem3", q: "Why can a recursive DFS crash on a very deep input?",
        options: ["The heap runs out of objects", "Each call adds a stack frame, and too many overflow the call stack", "Recursion isn't allowed on graphs", "The garbage collector stops it"], a: 1,
        why: "The stack is much smaller than the heap. Use an iterative DFS with your own stack when depth can reach many thousands." },
    ],
  },
  // ---------------- object-oriented programming ----------------
  {
    id: "classes", name: "Classes & objects", short: "Cl", part: "Object-oriented programming",
    yt: "classes and objects explained object oriented programming",
    what: {
      py: "A class is a blueprint that bundles data (attributes) with the behaviour that works on it (methods). An object is one instance built from that blueprint, with its own data. `__init__` sets up each new object, and every method receives the object it was called on as `self`. Class attributes belong to the class itself and are shared by all instances.",
      java: "A class is a blueprint that bundles data (fields) with the behaviour that works on it (methods). An object is one instance built from that blueprint, with its own data. A constructor sets up each new object, and inside a method `this` is the object it was called on. `static` members belong to the class itself and are shared by all instances.",
      cs: "A class is a blueprint that bundles data (fields and properties) with the behaviour that works on it (methods). An object is one instance built from that blueprint, with its own data. A constructor sets up each new object, and inside a method `this` is the object it was called on. `static` members belong to the class itself and are shared by all instances.",
    },
    points: [
      { py: "Use a class when data and the operations on it belong together, like an account's balance and `deposit()`.",
        java: "Use a class when data and the operations on it belong together, like an account's balance and `deposit()`.",
        cs: "Use a class when data and the operations on it belong together, like an account's balance and `Deposit()`." },
      { py: "Each object has its own instance attributes (set on `self`); class attributes are shared.",
        java: "Each object has its own copy of the instance fields; `static` fields are shared.",
        cs: "Each object has its own copy of the instance fields; `static` fields are shared." },
      "The constructor puts a new object into a valid starting state.",
      { py: "Methods are functions that take the object as their first parameter, `self`, which you write out explicitly.",
        java: "Methods can use the object's fields directly; `this.` makes it explicit when a parameter has the same name.",
        cs: "Methods can use the object's fields and properties directly; `this.` makes it explicit when a parameter has the same name." },
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
      { py: "Forgetting `self.` creates a local variable instead of setting the attribute.",
        java: "A parameter named like a field hides it: `balance = balance;` assigns the parameter to itself. Write `this.balance = balance;`.",
        cs: "A parameter named like a field hides it: `balance = balance;` assigns the parameter to itself. Write `this.balance = balance;`, or name fields `_balance`." },
      { py: "A mutable class attribute (`members = []` at class level) is shared by every instance.",
        java: "A `static` field is shared by every instance. Use it only for data that truly belongs to the class.",
        cs: "A `static` field is shared by every instance. Use it only for data that truly belongs to the class." },
      "\"God classes\" that do everything. Split by responsibility.",
      "Making a class for something that's only ever one function call.",
    ],
    practice: [
      { why: { py: "Without `self.`, the value goes into a local variable that disappears when `__init__` returns.",
          java: "A parameter with the same name as a field hides it. `this.` says which one you mean.",
          cs: "A parameter with the same name as a field hides it. `this.` says which one you mean." },
        bad: { py: `class Counter:
    def __init__(self):
        count = 0           # a local variable, not an attribute

    def add(self):
        self.count += 1     # AttributeError`, java: `class Account {
    private int balance;

    Account(int balance) {
        balance = balance;  // assigns the parameter to itself
    }
}`, cs: `class Account
{
    private int balance;

    public Account(int balance)
    {
        balance = balance;  // assigns the parameter to itself
    }
}` },
        good: { py: `class Counter:
    def __init__(self):
        self.count = 0      # an attribute on this object

    def add(self):
        self.count += 1`, java: `class Account {
    private int balance;

    Account(int balance) {
        this.balance = balance;
    }
}`, cs: `class Account
{
    private int balance;

    public Account(int balance)
    {
        this.balance = balance;
    }
}` } },
      { why: { py: "A list written at class level is created once and shared by every instance. Create per-object data in `__init__`.",
          java: "A `static` field is shared by every instance. Data that belongs to each object needs an instance field.",
          cs: "A `static` field is shared by every instance. Data that belongs to each object needs an instance field." },
        bad: { py: `class Team:
    members = []            # one list shared by every team

    def add(self, name):
        self.members.append(name)`, java: `class Team {
    static List<String> members = new ArrayList<>();   // shared by every team

    void add(String name) { members.add(name); }
}`, cs: `class Team
{
    static List<string> members = new();   // shared by every team

    public void Add(string name) => members.Add(name);
}` },
        good: { py: `class Team:
    def __init__(self):
        self.members = []   # one list per team

    def add(self, name):
        self.members.append(name)`, java: `class Team {
    private final List<String> members = new ArrayList<>();   // one list per team

    void add(String name) { members.add(name); }
}`, cs: `class Team
{
    private readonly List<string> members = new();   // one list per team

    public void Add(string name) => members.Add(name);
}` } },
      { why: "Parallel lists have to be kept in step by hand, and one bad index mixes up people. A class keeps each person's data together, with names.",
        bad: { py: `names = ["Ana", "Ben"]
ages = [31, 25]
emails = ["ana@example.com", "ben@example.com"]
print(names[1], ages[1])`, java: `void show() {
    String[] names = {"Ana", "Ben"};
    int[] ages = {31, 25};
    String[] emails = {"ana@example.com", "ben@example.com"};
    System.out.println(names[1] + " " + ages[1]);
}`, cs: `void Show()
{
    string[] names = { "Ana", "Ben" };
    int[] ages = { 31, 25 };
    string[] emails = { "ana@example.com", "ben@example.com" };
    Console.WriteLine($"{names[1]} {ages[1]}");
}` },
        good: { py: `from dataclasses import dataclass

@dataclass
class Person:
    name: str
    age: int
    email: str

people = [
    Person("Ana", 31, "ana@example.com"),
    Person("Ben", 25, "ben@example.com"),
]
print(people[1].name, people[1].age)`, java: `record Person(String name, int age, String email) {}

void show() {
    List<Person> people = List.of(
        new Person("Ana", 31, "ana@example.com"),
        new Person("Ben", 25, "ben@example.com"));
    System.out.println(people.get(1).name() + " " + people.get(1).age());
}`, cs: `record Person(string Name, int Age, string Email);

void Show()
{
    var people = new List<Person>
    {
        new("Ana", 31, "ana@example.com"),
        new("Ben", 25, "ben@example.com"),
    };
    Console.WriteLine($"{people[1].Name} {people[1].Age}");
}` } },
    ],
    interview: "In design questions (LRU cache, parking lot), turn the nouns into classes and the verbs into methods, keep fields private, and say which object owns which data.",
    quiz: [
      { id: "cls1", q: "What's the difference between a class and an object?",
        options: ["They're two names for the same thing", "An object is the blueprint; a class is one instance", "A class is the blueprint; an object is one instance built from it, with its own data", "Classes hold data; objects hold methods"], a: 2,
        why: { py: "`BankAccount` is the class; `BankAccount(\"Ada\", 100)` creates one object with its own owner and balance.",
               java: "`BankAccount` is the class; `new BankAccount(\"Ada\", 100)` creates one object with its own owner and balance.",
               cs: "`BankAccount` is the class; `new BankAccount(\"Ada\", 100)` creates one object with its own owner and balance." } },
      { id: "cls2", langs: ["py"], q: "In Python, `class Team: members = []`. Two Team objects each call `self.members.append(...)`. What happens?",
        options: ["Both teams share one list, because it's a class attribute", "Each team gets its own list", "It raises an error", "Only the first append works"], a: 0,
        why: "Class attributes are shared. Create per-object data in `__init__`: `self.members = []`." },
      { id: "cls2jc", langs: ["java", "cs"],
        q: { java: "Class `Team` has `static List<String> members = new ArrayList<>();`. Two Team objects each add a member. What happens?",
             cs: "Class `Team` has `static List<string> Members = new();`. Two Team objects each add a member. What happens?" },
        options: ["Both teams share one list, because it's static", "Each team gets its own list", "Compile error", "Only the first add works"], a: 0,
        why: "Static fields belong to the class, not to any one object. Per-object data goes in an instance field, set up in the constructor." },
      { id: "cls3", q: { py: "What does `__init__` (the constructor) do?", java: "What does a constructor (the method named after the class) do?", cs: "What does a constructor (the method named after the class) do?" },
        options: ["Deletes an object", "Copies a class", "Runs once when the program starts", "Sets up a new object's starting state"], a: 3,
        why: "It runs each time an object is created, so every object starts out valid." },
    ],
  },
  {
    id: "encapsulation", name: "Encapsulation", short: "En", part: "Object-oriented programming",
    yt: "encapsulation object oriented programming explained",
    what: "Encapsulation means an object keeps its data to itself and offers a small set of methods that keep that data valid. The rules (\"a balance can't go negative\", \"a temperature can't go below absolute zero\") live in one place, and callers depend on what the object does, not on how it stores things. That lets you change the inside without breaking the code that uses it.",
    points: [
      { py: "Mark internal attributes with a leading `_` (a convention) and expose methods or `@property`s.",
        java: "Make fields `private` and expose methods. Add a getter only when callers really need the value.",
        cs: "Make fields `private` and expose methods or properties (`public int Balance { get; private set; }`)." },
      "Check the rules (invariants) in the one method that changes the data, so the object can never be invalid.",
      { py: "Callers should ask the object to do things (`account.withdraw(50)`) rather than reach in (`account._balance -= 50`).",
        java: "Callers should ask the object to do things (`account.withdraw(50)`) rather than reach in and change its fields.",
        cs: "Callers should ask the object to do things (`account.Withdraw(50)`) rather than reach in and change its fields." },
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
      { py: "`_name` is only a convention: it signals intent, but nothing stops access.",
        java: "`final` on a field stops reassignment, not mutation: a `final List` can still be changed.",
        cs: "`readonly` on a field stops reassignment, not mutation: a `readonly List<T>` can still be changed." },
    ],
    practice: [
      { why: "A public field lets any code put the object into an invalid state. Keep the data private and change it through methods that check the rules.",
        bad: { py: `class Account:
    def __init__(self):
        self.balance = 0

acct = Account()
acct.balance = -500         # nothing stops it`, java: `class Account {
    public int balance;     // anyone can set it to -500
}`, cs: `class Account
{
    public int Balance;     // anyone can set it to -500
}` },
        good: { py: `class Account:
    def __init__(self):
        self._balance = 0

    @property
    def balance(self):      # read-only from outside
        return self._balance

    def withdraw(self, amount):
        if amount <= 0 or amount > self._balance:
            raise ValueError("invalid amount")
        self._balance -= amount`, java: `class Account {
    private int balance;

    public int getBalance() { return balance; }

    public void withdraw(int amount) {
        if (amount <= 0 || amount > balance)
            throw new IllegalArgumentException("invalid amount");
        balance -= amount;
    }
}`, cs: `class Account
{
    public int Balance { get; private set; }   // read-only from outside

    public void Withdraw(int amount)
    {
        if (amount <= 0 || amount > Balance)
            throw new ArgumentException("invalid amount");
        Balance -= amount;
    }
}` } },
      { why: "Handing out your internal list lets callers change it without going through your methods. Return a read-only view or a copy.",
        bad: { py: `class Playlist:
    def __init__(self):
        self._songs = []

    def songs(self):
        return self._songs          # callers can append or clear it`, java: `class Playlist {
    private final List<String> songs = new ArrayList<>();

    public List<String> getSongs() {
        return songs;               // callers can add or clear it
    }
}`, cs: `class Playlist
{
    private readonly List<string> songs = new();

    public List<string> Songs => songs;   // callers can add or clear it
}` },
        good: { py: `class Playlist:
    def __init__(self):
        self._songs = []

    def songs(self):
        return tuple(self._songs)   # a read-only snapshot`, java: `class Playlist {
    private final List<String> songs = new ArrayList<>();

    public List<String> getSongs() {
        return Collections.unmodifiableList(songs);   // read-only view
    }
}`, cs: `class Playlist
{
    private readonly List<string> songs = new();

    public IReadOnlyList<string> Songs => songs.AsReadOnly();   // read-only view
}` } },
      { why: "\"Tell, don't ask\": when callers read an object's data, decide, and write it back, the rule is copied into every caller. Put the rule in a method on the object.",
        bad: { py: `if acct.balance >= price:
    acct.balance -= price       # the rule lives in every caller`, java: `if (acct.getBalance() >= price) {
    acct.setBalance(acct.getBalance() - price);   // the rule lives in every caller
}`, cs: `if (acct.Balance >= price)
{
    acct.Balance -= price;      // the rule lives in every caller
}` },
        good: { py: `acct.pay(price)                 # Account checks its own rule`, java: `acct.pay(price);                // Account checks its own rule`, cs: `acct.Pay(price);                // Account checks its own rule` } },
    ],
    interview: {
      py: "In a design round, say it explicitly: \"`_balance` is internal; the only way to change it is `withdraw()`, which rejects overdrafts.\"",
      java: "In a design round, say it explicitly: \"`balance` is private; the only way to change it is `withdraw()`, which rejects overdrafts.\"",
      cs: "In a design round, say it explicitly: \"`Balance` has a private setter; the only way to change it is `Withdraw()`, which rejects overdrafts.\"",
    },
    quiz: [
      { id: "enc1", q: "What is encapsulation mainly for?",
        options: ["Making code run faster", "Keeping an object's data valid by only allowing changes through its own methods", "Reusing code from a parent class", "Writing less code"], a: 1,
        why: "With the data private and the rules in its methods, no outside code can put the object into an invalid state." },
      { id: "enc2", q: { py: "A class returns its internal list from `get_items()`, and callers append to it directly. What's the problem?",
                        java: "A class returns its internal list from `getItems()`, and callers add to it directly. What's the problem?",
                        cs: "A class returns its internal list from `GetItems()`, and callers add to it directly. What's the problem?" },
        options: ["Nothing, that's what getters are for", "It's slower", "Lists can't be returned from methods", "It breaks encapsulation: outside code changes the object's state without its rules"], a: 3,
        why: { py: "Return a copy (`list(self._items)`) or a tuple, and offer an `add_item()` method that checks the rules.",
               java: "Return a copy (`new ArrayList<>(items)`) or `Collections.unmodifiableList(items)`, and offer an `addItem()` method that checks the rules.",
               cs: "Return a copy, or expose an `IReadOnlyList<T>`, and offer an `AddItem()` method that checks the rules." } },
      { id: "enc3", langs: ["py"], q: "In Python, what does a leading underscore (`self._balance`) mean?",
        options: ["A convention: internal, not part of the public interface", "Python makes the attribute truly private", "The attribute is a constant", "The attribute is shared by all instances"], a: 0,
        why: "Python trusts programmers: `_name` signals \"internal\", but nothing stops access. (Double underscores only rename the attribute.)" },
      { id: "enc3java", langs: ["java"], q: "What does `private` on a Java field mean?",
        options: ["Only code inside that class can use it", "Only subclasses can use it", "Nobody can read it, not even the class itself", "It can't change after construction"], a: 0,
        why: "`private` limits access to the class's own code. Subclasses need `protected`; \"can't change\" is what `final` means." },
      { id: "enc3cs", langs: ["cs"], q: "What does `public int Balance { get; private set; }` allow?",
        options: ["Anyone can read and change it", "Only subclasses can read it", "Anyone can read it; only the class's own code can change it", "Nobody can change it after construction"], a: 2,
        why: "The getter is public and the setter private, so outside code can see the balance but must go through methods like `Withdraw()` to change it." },
    ],
  },
  {
    id: "abstraction", name: "Abstraction", short: "Ab", part: "Object-oriented programming",
    yt: "abstraction object oriented programming explained interfaces",
    what: "Abstraction means showing what something does while hiding how it does it. You sort a list without knowing the sorting algorithm, and drive a car without knowing how the engine works. In code, functions, classes, interfaces and abstract classes are abstractions. Good ones let you think about a problem at one level at a time, and swap the implementation without touching the code that uses it.",
    points: [
      { py: "An abstract base class (`ABC` with `@abstractmethod`) or a `Protocol` lists what an object can do, with no implementation.",
        java: "An `interface` (or an `abstract class`) lists what an object can do, with no implementation.",
        cs: "An `interface` (or an `abstract class`) lists what an object can do, with no implementation." },
      { py: "Code written against the abstraction (`Storage`) works with any implementation: memory, a database, or a fake for tests.",
        java: "Code written against the abstraction (`Storage`) works with any implementation: memory, a database, or a fake for tests.",
        cs: "Code written against the abstraction (`IStorage`) works with any implementation: memory, a database, or a fake for tests." },
      "Abstraction is about what you expose. Encapsulation is about protecting the data behind it. They work together.",
      { py: "Keep one level of detail per function: `solve()` calls `build_graph()` and `bfs()`; it doesn't also do index arithmetic.",
        java: "Keep one level of detail per method: `solve()` calls `buildGraph()` and `bfs()`; it doesn't also do index arithmetic.",
        cs: "Keep one level of detail per method: `Solve()` calls `BuildGraph()` and `Bfs()`; it doesn't also do index arithmetic." },
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
      { py: "Leaky abstractions: callers still have to know the details (\"call `connect()` first or `save()` crashes\").",
        java: "Leaky abstractions: callers still have to know the details (\"call `connect()` first or `save()` crashes\").",
        cs: "Leaky abstractions: callers still have to know the details (\"call `Connect()` first or `Save()` crashes\")." },
      "Abstracting too early adds interfaces nobody needs.",
      "Mixing levels: a function that does both high-level steps and low-level details is hard to read.",
    ],
    practice: [
      { why: "A function that mixes high-level steps with low-level details is hard to read. Name each step and let the top level read like a summary.",
        bad: { py: `def checkout(cart, card):
    total = sum(item.price * item.qty for item in cart)
    if total > 100:
        total *= 0.9
    gateway.connect()
    gateway.send({"card": card, "amount": total})
    gateway.close()`, java: `void checkout(List<Item> cart, String card) {
    double total = 0;
    for (Item item : cart) total += item.price() * item.qty();
    if (total > 100) total *= 0.9;
    gateway.connect();
    gateway.send(card, total);
    gateway.close();
}`, cs: `void Checkout(List<Item> cart, string card)
{
    double total = 0;
    foreach (var item in cart) total += item.Price * item.Qty;
    if (total > 100) total *= 0.9;
    gateway.Connect();
    gateway.Send(card, total);
    gateway.Close();
}` },
        good: { py: `def checkout(cart, card):
    total = apply_discount(subtotal(cart))
    charge(card, total)         # each step is one named call`, java: `void checkout(List<Item> cart, String card) {
    double total = applyDiscount(subtotal(cart));
    charge(card, total);        // each step is one named call
}`, cs: `void Checkout(List<Item> cart, string card)
{
    double total = ApplyDiscount(Subtotal(cart));
    Charge(card, total);        // each step is one named call
}` } },
      { why: "If callers must remember to connect first and close after, the abstraction leaks. Let the object manage its own setup and cleanup.",
        bad: { py: `db = Database()
db.connect()                # forget this and save() crashes
db.save(record)
db.close()                  # skipped if save() raises`, java: `Database db = new Database();
db.connect();               // forget this and save() crashes
db.save(record);
db.close();                 // skipped if save() throws`, cs: `var db = new Database();
db.Connect();               // forget this and Save() crashes
db.Save(record);
db.Close();                 // skipped if Save() throws` },
        good: { py: `with Database() as db:      # connects, and always closes
    db.save(record)`, java: `try (Database db = Database.open()) {   // connected, and always closed
    db.save(record);
}`, cs: `using (var db = Database.Open())        // connected, and always disposed
{
    db.Save(record);
}` } },
      { why: "Checking raw data everywhere spreads one rule across the code. A method with a meaningful name hides the representation and keeps the rule in one place.",
        bad: { py: `if user.role == "admin" or user.role == "owner":
    show_edit_button()`, java: `if (user.getRole().equals("admin") || user.getRole().equals("owner")) {
    showEditButton();
}`, cs: `if (user.Role == "admin" || user.Role == "owner")
{
    ShowEditButton();
}` },
        good: { py: `if user.can_edit():         # the rule lives in User
    show_edit_button()`, java: `if (user.canEdit()) {       // the rule lives in User
    showEditButton();
}`, cs: `if (user.CanEdit())         // the rule lives in User
{
    ShowEditButton();
}` } },
    ],
    interview: {
      py: "Write the top level first (`return bfs(build_graph(edges), start)`) and fill in the helpers after. It shows the plan and keeps each piece simple.",
      java: "Write the top level first (`return bfs(buildGraph(edges), start);`) and fill in the helpers after. It shows the plan and keeps each piece simple.",
      cs: "Write the top level first (`return Bfs(BuildGraph(edges), start);`) and fill in the helpers after. It shows the plan and keeps each piece simple.",
    },
    quiz: [
      { id: "abs1", q: "Which best describes abstraction?",
        options: ["Copying code from a parent class", "Making every field private", "Exposing a simple interface and hiding the details of how it works", "Using as few classes as possible"], a: 2,
        why: "Callers see what it does (save, load), not how (a dictionary, a database, a file)." },
      { id: "abs2", q: { py: "`remember_score(store, ...)` accepts any `Storage`. What's the benefit?",
                        java: "`rememberScore(store, ...)` accepts any `Storage`. What's the benefit?",
                        cs: "`RememberScore(store, ...)` accepts any `IStorage`. What's the benefit?" },
        options: ["You can pass in a database or a fake for tests without changing the function", "It runs faster", "It uses less memory", "It stops subclasses being created"], a: 0,
        why: "Depending on the abstraction makes the function independent of any one implementation." },
      { id: "abs3", q: "How do abstraction and encapsulation differ?",
        options: ["They're the same thing", "Encapsulation is about interfaces; abstraction is about private fields", "Abstraction only exists in some languages", "Abstraction is about what you expose (a simpler view); encapsulation is about protecting the data behind it"], a: 3,
        why: "An interface hides how something works (abstraction); private fields and checked methods keep the state valid (encapsulation)." },
    ],
  },
  {
    id: "inheritance", name: "Inheritance vs composition", short: "In", part: "Object-oriented programming",
    yt: "composition over inheritance explained",
    what: "Inheritance models an \"is-a\" relationship: a `Dog` is an `Animal`, so it inherits the parent's data and methods and can override some of them. Composition models a \"has-a\" relationship: a `Car` has an `Engine` and passes work to it. Both reuse code, but inheritance ties the child tightly to its parent's internals, so the common advice is to favour composition and keep inheritance for true \"is-a\" relationships.",
    points: [
      { py: "Override a method to change one step of the parent's behaviour; call the parent's version with `super()`.",
        java: "Override a method (`@Override`) to change one step of the parent's behaviour; call the parent's version with `super`.",
        cs: "Override a `virtual` method to change one step of the parent's behaviour; call the parent's version with `base`." },
      { py: "Composition lets you swap parts (`Car(ElectricEngine())`) and test them on their own.",
        java: "Composition lets you swap parts (`new Car(new ElectricEngine())`) and test them on their own.",
        cs: "Composition lets you swap parts (`new Car(new ElectricEngine())`) and test them on their own." },
      "Deep inheritance trees are fragile: a change in a base class ripples into every subclass.",
      "Liskov substitution: a subclass must work anywhere its parent is expected. If it can't, it shouldn't inherit.",
      { py: "Inheriting only to reuse code (a `Stack` that subclasses `list`) leaks the parent's methods, like `insert`, into your class.",
        java: "Inheriting only to reuse code leaks the parent's methods into your class: Java's own `Stack extends Vector`, which lets you insert in the middle of a stack, is the classic example.",
        cs: "Inheriting only to reuse code (a `Stack<T>` that extends `List<T>`) leaks the parent's methods, like `Insert`, into your class." },
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
      { py: "Forgetting `super().__init__(...)` in a subclass's `__init__`, so the parent's attributes are never set.",
        java: "If the parent has no no-argument constructor, the subclass constructor must call `super(...)` first.",
        cs: "A method must be `virtual` before a subclass can `override` it; without that, a same-named method only hides it." },
      "`Square` as a subclass of `Rectangle` looks right but breaks code that sets width and height separately (Liskov).",
      "Using inheritance for \"has-a\": a `Car` that extends `Engine` gets engine methods it shouldn't expose.",
    ],
    practice: [
      { why: "Inheritance means \"is a\". A car has an engine; it isn't one. Holding the part as a field (composition) exposes only what you choose.",
        bad: { py: `class Engine:
    def start(self):
        print("vroom")

class Car(Engine):          # a car is not an engine
    pass`, java: `class Engine {
    void start() { System.out.println("vroom"); }
}

class Car extends Engine { }    // a car is not an engine`, cs: `class Engine
{
    public void Start() => Console.WriteLine("vroom");
}

class Car : Engine { }          // a car is not an engine` },
        good: { py: `class Engine:
    def start(self):
        print("vroom")

class Car:
    def __init__(self, engine):
        self.engine = engine    # a car has an engine

    def start(self):
        self.engine.start()`, java: `class Engine {
    void start() { System.out.println("vroom"); }
}

class Car {
    private final Engine engine;    // a car has an engine

    Car(Engine engine) { this.engine = engine; }

    void start() { engine.start(); }
}`, cs: `class Engine
{
    public void Start() => Console.WriteLine("vroom");
}

class Car
{
    private readonly Engine engine;   // a car has an engine

    public Car(Engine engine) => this.engine = engine;

    public void Start() => engine.Start();
}` } },
      { why: { py: "A subclass's `__init__` replaces the parent's. Call `super().__init__(...)` so the parent sets up its part.",
          java: "Copying the parent's logic into an override means two places to fix. Call `super` and add only what's different.",
          cs: "Copying the parent's logic into an override means two places to fix. Call `base` and add only what's different." },
        bad: { py: `class Animal:
    def __init__(self, name):
        self.name = name

class Dog(Animal):
    def __init__(self, name, breed):
        self.breed = breed      # self.name is never set`, java: `class Animal {
    String name = "Rex";
    String describe() { return "Name: " + name; }
}

class Dog extends Animal {
    @Override   // copies the parent's logic
    String describe() { return "Name: " + name + ", barks"; }
}`, cs: `class Animal
{
    public string Name = "Rex";
    public virtual string Describe() => "Name: " + Name;
}

class Dog : Animal
{
    // copies the parent's logic
    public override string Describe() => "Name: " + Name + ", barks";
}` },
        good: { py: `class Animal:
    def __init__(self, name):
        self.name = name

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)  # the parent sets self.name
        self.breed = breed`, java: `class Animal {
    String name = "Rex";
    String describe() { return "Name: " + name; }
}

class Dog extends Animal {
    @Override
    String describe() { return super.describe() + ", barks"; }
}`, cs: `class Animal
{
    public string Name = "Rex";
    public virtual string Describe() => "Name: " + Name;
}

class Dog : Animal
{
    public override string Describe() => base.Describe() + ", barks";
}` } },
      { why: "A subclass must work wherever its parent does (Liskov). A Square that changes its height when you set its width breaks code written for Rectangle. Make them siblings instead.",
        bad: { py: `class Rectangle:
    def __init__(self, w, h):
        self.w, self.h = w, h

    def set_width(self, w):
        self.w = w

class Square(Rectangle):
    def set_width(self, w):
        self.w = self.h = w     # surprises code written for Rectangle`, java: `class Rectangle {
    int w, h;
    void setWidth(int w) { this.w = w; }
}

class Square extends Rectangle {
    @Override   // surprises code written for Rectangle
    void setWidth(int w) { this.w = this.h = w; }
}`, cs: `class Rectangle
{
    public int W, H;
    public virtual void SetWidth(int w) => W = w;
}

class Square : Rectangle
{
    // surprises code written for Rectangle
    public override void SetWidth(int w) => W = H = w;
}` },
        good: { py: `class Shape:
    def area(self):
        raise NotImplementedError

class Rectangle(Shape):
    def __init__(self, w, h):
        self.w, self.h = w, h

    def area(self):
        return self.w * self.h

class Square(Shape):
    def __init__(self, side):
        self.side = side

    def area(self):
        return self.side ** 2`, java: `interface Shape { int area(); }

record Rectangle(int w, int h) implements Shape {
    public int area() { return w * h; }
}

record Square(int side) implements Shape {
    public int area() { return side * side; }
}`, cs: `interface IShape { int Area(); }

record Rectangle(int W, int H) : IShape
{
    public int Area() => W * H;
}

record Square(int Side) : IShape
{
    public int Area() => Side * Side;
}` } },
    ],
    interview: "If you say \"favour composition over inheritance\", give the reason: parts can be swapped and tested on their own, and the child isn't tied to the parent's internals.",
    quiz: [
      { id: "inh1", q: "Which relationship suggests composition rather than inheritance?",
        options: ["A Dog and an Animal", "A Car and its Engine", "A SavingsAccount and an Account", "A Square and a Shape"], a: 1,
        why: "A car has an engine (composition). The others are \"is-a\" relationships." },
      { id: "inh2", q: "Why is \"favour composition over inheritance\" common advice?",
        options: ["Inheritance is being removed from modern languages", "Composition always uses less memory", "Composed parts can be swapped and tested on their own; inheritance ties a subclass to its parent's internals", "Composition is faster"], a: 2,
        why: "A change to a base class can break every subclass; a composed part only needs to keep its interface." },
      { id: "inh3", q: "A `Square` subclass of `Rectangle` breaks code that sets width and height separately. Which principle does it violate?",
        options: ["Liskov substitution", "DRY", "YAGNI", "Encapsulation"], a: 0,
        why: "Liskov: a subclass must work anywhere its parent does. A square can't have its width changed independently, so it isn't a safe `Rectangle`." },
    ],
  },
  {
    id: "polymorphism", name: "Polymorphism & interfaces", short: "Po", part: "Object-oriented programming",
    yt: "polymorphism explained object oriented programming",
    what: {
      py: "Polymorphism means \"many forms\": one interface, many implementations. Code calls `shape.area()` and each kind of shape answers in its own way; the right method is chosen at run time. In Python any object with the right method works (duck typing), so polymorphism doesn't even need a shared parent class. It replaces long chains of type checks, and new types can be added without editing the code that uses them.",
      java: "Polymorphism means \"many forms\": one interface, many implementations. Code calls `shape.area()` and each kind of shape answers in its own way; the right method is chosen at run time (dynamic dispatch). It replaces long chains of type checks, and new types can be added without editing the code that uses them. Overloading (same name, different parameter types) is the compile-time kind.",
      cs: "Polymorphism means \"many forms\": one interface, many implementations. Code calls `shape.Area()` and each kind of shape answers in its own way; the right method is chosen at run time (dynamic dispatch). It replaces long chains of type checks, and new types can be added without editing the code that uses them. Overloading (same name, different parameter types) is the compile-time kind.",
    },
    points: [
      "Overriding: a subclass or implementing class replaces a method. The object's actual type decides which version runs.",
      { py: "Python has no overloading: a later `def` with the same name replaces the earlier one. Use default arguments instead.",
        java: "Overloading: several methods share a name but take different parameters. The compiler picks one.",
        cs: "Overloading: several methods share a name but take different parameters. The compiler picks one." },
      { py: "Duck typing: any object with the right methods works, whatever its class. `len()` works on strings, lists and dicts alike.",
        java: "Generics (`List<T>`) are another kind: one class works with many types, checked at compile time.",
        cs: "Generics (`List<T>`) are another kind: one class works with many types, checked at compile time." },
      { py: "A growing `if isinstance(...)` / `elif isinstance(...)` chain is a sign polymorphism would help.",
        java: "A growing `if (x instanceof ...)` / `else if` chain is a sign polymorphism would help.",
        cs: "A growing `if (x is ...)` / `else if` chain is a sign polymorphism would help." },
      { py: "A `Protocol` (from `typing`) names a role, such as \"has an `area()` method\", without forcing a shared parent class.",
        java: "Interfaces (`Comparable`, `Shape`) let unrelated classes share a role without sharing a parent.",
        cs: "Interfaces (`IComparable`, `IShape`) let unrelated classes share a role without sharing a parent." },
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
      { py: "`isinstance` checks scattered through the code instead of a method on each type.",
        java: "`instanceof` checks scattered through the code instead of a method on each type.",
        cs: "`is` type checks scattered through the code instead of a method on each type." },
      "Overriding a method to do something different from what its name promises.",
      { java: "Mixing up overloading (compile time, different parameters) and overriding (run time, same signature).",
        cs: "Mixing up overloading (compile time, different parameters) and overriding (run time, same signature)." },
    ],
    practice: [
      { why: "A chain of type checks must be edited for every new type. Give each type its own method, and the caller just calls it.",
        bad: { py: `def area(shape):
    if isinstance(shape, Circle):
        return math.pi * shape.r ** 2
    elif isinstance(shape, Square):
        return shape.side ** 2
    raise TypeError("unknown shape")`, java: `double area(Object shape) {
    if (shape instanceof Circle c) return Math.PI * c.r * c.r;
    if (shape instanceof Square s) return s.side * s.side;
    throw new IllegalArgumentException("unknown shape");
}`, cs: `double Area(object shape)
{
    if (shape is Circle c) return Math.PI * c.R * c.R;
    if (shape is Square s) return s.Side * s.Side;
    throw new ArgumentException("unknown shape");
}` },
        good: { py: `class Circle:
    def __init__(self, r):
        self.r = r

    def area(self):
        return math.pi * self.r ** 2

class Square:
    def __init__(self, side):
        self.side = side

    def area(self):
        return self.side ** 2

total = sum(s.area() for s in shapes)   # works for any shape`, java: `interface Shape { double area(); }

record Circle(double r) implements Shape {
    public double area() { return Math.PI * r * r; }
}

record Square(double side) implements Shape {
    public double area() { return side * side; }
}`, cs: `interface IShape { double Area(); }

record Circle(double R) : IShape
{
    public double Area() => Math.PI * R * R;
}

record Square(double Side) : IShape
{
    public double Area() => Side * Side;
}` } },
      { why: "Branching on a type code means editing this function for every new option. Put each option's behaviour in its own object, so adding one is a new entry.",
        bad: { py: `def shipping(method, weight):
    if method == "standard":
        return 5 + weight
    elif method == "express":
        return 15 + 2 * weight
    raise ValueError(method)`, java: `double shipping(String method, double weight) {
    switch (method) {
        case "standard": return 5 + weight;
        case "express": return 15 + 2 * weight;
        default: throw new IllegalArgumentException(method);
    }
}`, cs: `double Shipping(string method, double weight) => method switch
{
    "standard" => 5 + weight,
    "express" => 15 + 2 * weight,
    _ => throw new ArgumentException(method),
};` },
        good: { py: `RATES = {
    "standard": lambda w: 5 + w,
    "express": lambda w: 15 + 2 * w,
}

def shipping(method, weight):
    return RATES[method](weight)    # a new method is one new entry`, java: `enum Shipping {
    STANDARD { double cost(double w) { return 5 + w; } },
    EXPRESS { double cost(double w) { return 15 + 2 * w; } };

    abstract double cost(double w);  // each option brings its own rule
}`, cs: `interface IShipping { double Cost(double weight); }

class Standard : IShipping { public double Cost(double w) => 5 + w; }
class Express : IShipping { public double Cost(double w) => 15 + 2 * w; }
// a new option is a new class` } },
      { why: "Ask for the most general type you need. Then callers can pass any kind of collection, and you can change the concrete type later.",
        bad: { py: `def print_all(names: list[str]) -> None:   # only lists, says the hint
    for n in names:
        print(n)`, java: `void printAll(ArrayList<String> names) {   // only ArrayLists
    for (String n : names) System.out.println(n);
}`, cs: `void PrintAll(List<string> names)          // only Lists
{
    foreach (var n in names) Console.WriteLine(n);
}` },
        good: { py: `from collections.abc import Iterable

def print_all(names: Iterable[str]) -> None:   # lists, sets, tuples, generators
    for n in names:
        print(n)`, java: `void printAll(Collection<String> names) {   // any list, set or queue
    for (String n : names) System.out.println(n);
}`, cs: `void PrintAll(IEnumerable<string> names)    // any collection or sequence
{
    foreach (var n in names) Console.WriteLine(n);
}` } },
    ],
    interview: "In design rounds, a new payment method or vehicle type should be a new class implementing the interface, not another branch in the checkout code.",
    quiz: [
      { id: "pol1", langs: ["java", "cs"], q: "What's the difference between overloading and overriding?",
        options: ["They're the same", "Overloading: same name, different parameters, picked at compile time. Overriding: a subclass replaces a method, picked at run time", "Overriding happens at compile time; overloading at run time", "Overloading is only for operators"], a: 1,
        why: "`add(int, int)` and `add(double, double)` are overloads. `Dog.sound()` replacing `Animal.sound()` is an override." },
      { id: "pol1py", langs: ["py"], q: "In Python you define `def area(self)` and then `def area(self, scale)` in the same class. What happens?",
        options: ["Python picks one based on the arguments", "It's a syntax error", "The second definition replaces the first: Python has no overloading", "Both are kept"], a: 2,
        why: "A class body is like a dictionary of names, so the later `def` wins. Use a default argument instead: `def area(self, scale=1)`." },
      { id: "pol2", q: { py: "Your code keeps gaining `elif isinstance(x, NewType)` branches. What's the polymorphic fix?",
                        java: "Your code keeps gaining `else if (x instanceof NewType)` branches. What's the polymorphic fix?",
                        cs: "Your code keeps gaining `else if (x is NewType)` branches. What's the polymorphic fix?" },
        options: ["Give each type a method with the same name and call it", "Add a comment listing the types", "Use a bigger switch statement", "Store the type name as a string"], a: 0,
        why: "Each type knows how to do its own work, so adding a type means adding a class, not editing every switch." },
      { id: "pol3", langs: ["py"], q: "What does Python's duck typing mean?",
        options: ["Classes must inherit from a common base", "Types are checked before the program runs", "Only built-in types can be used with `len()`", "Any object with the right methods works, whatever its class"], a: 3,
        why: "\"If it walks like a duck...\": `len()` works on anything with `__len__`." },
      { id: "pol3jc", langs: ["java", "cs"], q: "What do generics (`List<T>`) give you?",
        options: ["Faster loops", "Automatic inheritance", "Dynamic typing", "One class that works with many types, with the types checked at compile time"], a: 3,
        why: "`List<String>` and `List<Integer>` share one implementation, and the compiler stops you adding the wrong type." },
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
    practice: [
      { why: "DRY: the same check pasted twice means a fix can reach one copy and miss the other. Give it a name and call it from both places.",
        bad: { py: `if not email or "@" not in email:
    raise ValueError("bad email")
if not backup_email or "@" not in backup_email:
    raise ValueError("bad email")`, java: `if (email == null || !email.contains("@"))
    throw new IllegalArgumentException("bad email");
if (backupEmail == null || !backupEmail.contains("@"))
    throw new IllegalArgumentException("bad email");`, cs: `if (string.IsNullOrEmpty(email) || !email.Contains('@'))
    throw new ArgumentException("bad email");
if (string.IsNullOrEmpty(backupEmail) || !backupEmail.Contains('@'))
    throw new ArgumentException("bad email");` },
        good: { py: `def check_email(e):
    if not e or "@" not in e:
        raise ValueError(f"bad email: {e!r}")

check_email(email)
check_email(backup_email)`, java: `void checkEmail(String e) {
    if (e == null || !e.contains("@"))
        throw new IllegalArgumentException("bad email: " + e);
}

void checkBoth(String email, String backupEmail) {
    checkEmail(email);
    checkEmail(backupEmail);
}`, cs: `void CheckEmail(string e)
{
    if (string.IsNullOrEmpty(e) || !e.Contains('@'))
        throw new ArgumentException($"bad email: {e}");
}

void CheckBoth(string email, string backupEmail)
{
    CheckEmail(email);
    CheckEmail(backupEmail);
}` } },
      { why: "KISS: the standard library already has it, tested and clear. A hand-written loop is more code to read and more room for bugs.",
        bad: { py: `largest = nums[0]
for x in nums[1:]:
    if x > largest:
        largest = x`, java: `int largest = nums.get(0);
for (int x : nums) {
    if (x > largest) largest = x;
}`, cs: `int largest = nums[0];
foreach (int x in nums)
{
    if (x > largest) largest = x;
}` },
        good: { py: `largest = max(nums)`, java: `int largest = Collections.max(nums);`, cs: `int largest = nums.Max();` } },
      { why: "YAGNI: a factory and an interface for the one kind of greeter that exists is code to maintain for a future that may never come. Write the simple version; add the flexibility when a second case appears.",
        bad: { py: `class Greeter:
    def greet(self, name):
        print(f"Hello, {name}")

class GreeterFactory:              # only one kind of greeter exists
    def create(self, kind="default"):
        if kind == "default":
            return Greeter()
        raise NotImplementedError(kind)

GreeterFactory().create().greet("Ana")`, java: `interface Greeter { void greet(String name); }

class DefaultGreeter implements Greeter {
    public void greet(String name) { System.out.println("Hello, " + name); }
}

class GreeterFactory {             // only one kind of greeter exists
    Greeter create(String kind) {
        if (kind.equals("default")) return new DefaultGreeter();
        throw new UnsupportedOperationException(kind);
    }
}`, cs: `interface IGreeter { void Greet(string name); }

class DefaultGreeter : IGreeter
{
    public void Greet(string name) => Console.WriteLine($"Hello, {name}");
}

class GreeterFactory               // only one kind of greeter exists
{
    public IGreeter Create(string kind) => kind == "default"
        ? new DefaultGreeter()
        : throw new NotSupportedException(kind);
}` },
        good: { py: `def greet(name):
    print(f"Hello, {name}")

greet("Ana")`, java: `void greet(String name) {
    System.out.println("Hello, " + name);
}`, cs: `void Greet(string name) => Console.WriteLine($"Hello, {name}");` } },
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
    practice: [
      { why: "Single responsibility: totals and email delivery change for different reasons. Split them, so a new mail server doesn't touch the report maths.",
        bad: { py: `class Report:
    def __init__(self, sales):
        self.sales = sales

    def total(self):
        return sum(self.sales)

    def send_email(self, smtp, to):     # a second reason to change
        smtp.send(to, f"Total: {self.total()}")`, java: `class Report {
    private final List<Integer> sales;
    Report(List<Integer> sales) { this.sales = sales; }

    int total() { return sales.stream().mapToInt(Integer::intValue).sum(); }

    void sendEmail(Smtp smtp, String to) {   // a second reason to change
        smtp.send(to, "Total: " + total());
    }
}`, cs: `class Report
{
    private readonly List<int> sales;
    public Report(List<int> sales) => this.sales = sales;

    public int Total() => sales.Sum();

    public void SendEmail(Smtp smtp, string to) =>   // a second reason to change
        smtp.Send(to, $"Total: {Total()}");
}` },
        good: { py: `class Report:
    def __init__(self, sales):
        self.sales = sales

    def total(self):
        return sum(self.sales)

class ReportMailer:
    def __init__(self, smtp):
        self.smtp = smtp

    def send(self, report, to):
        self.smtp.send(to, f"Total: {report.total()}")`, java: `class Report {
    private final List<Integer> sales;
    Report(List<Integer> sales) { this.sales = sales; }

    int total() { return sales.stream().mapToInt(Integer::intValue).sum(); }
}

class ReportMailer {
    private final Smtp smtp;
    ReportMailer(Smtp smtp) { this.smtp = smtp; }

    void send(Report report, String to) {
        smtp.send(to, "Total: " + report.total());
    }
}`, cs: `class Report
{
    private readonly List<int> sales;
    public Report(List<int> sales) => this.sales = sales;

    public int Total() => sales.Sum();
}

class ReportMailer
{
    private readonly Smtp smtp;
    public ReportMailer(Smtp smtp) => this.smtp = smtp;

    public void Send(Report report, string to) =>
        smtp.Send(to, $"Total: {report.Total()}");
}` } },
      { why: "Dependency inversion: a class that builds its own collaborators is welded to them. Pass them in (as an interface), and you can swap them, or use a fake in tests.",
        bad: { py: `class OrderService:
    def __init__(self):
        self.mailer = SmtpMailer()      # welded to one mailer

    def place(self, order):
        self.mailer.send(order.email, "Thanks!")`, java: `class OrderService {
    private final SmtpMailer mailer = new SmtpMailer();   // welded to one mailer

    void place(Order order) { mailer.send(order.email(), "Thanks!"); }
}`, cs: `class OrderService
{
    private readonly SmtpMailer mailer = new();   // welded to one mailer

    public void Place(Order order) => mailer.Send(order.Email, "Thanks!");
}` },
        good: { py: `class OrderService:
    def __init__(self, mailer):         # any object with send() works
        self.mailer = mailer

    def place(self, order):
        self.mailer.send(order.email, "Thanks!")

service = OrderService(FakeMailer())    # in a test`, java: `interface Mailer { void send(String to, String body); }

class OrderService {
    private final Mailer mailer;
    OrderService(Mailer mailer) { this.mailer = mailer; }   // passed in

    void place(Order order) { mailer.send(order.email(), "Thanks!"); }
}`, cs: `interface IMailer { void Send(string to, string body); }

class OrderService
{
    private readonly IMailer mailer;
    public OrderService(IMailer mailer) => this.mailer = mailer;   // passed in

    public void Place(Order order) => mailer.Send(order.Email, "Thanks!");
}` } },
      { why: "Interface segregation: a fat interface forces classes to implement methods that make no sense for them. Split it into small ones.",
        bad: { py: `from abc import ABC, abstractmethod

class Worker(ABC):
    @abstractmethod
    def work(self): ...

    @abstractmethod
    def eat(self): ...              # robots don't eat

class Robot(Worker):
    def work(self):
        print("welding")

    def eat(self):
        raise NotImplementedError`, java: `interface Worker {
    void work();
    void eat();                     // robots don't eat
}

class Robot implements Worker {
    public void work() { System.out.println("welding"); }
    public void eat() { throw new UnsupportedOperationException(); }
}`, cs: `interface IWorker
{
    void Work();
    void Eat();                     // robots don't eat
}

class Robot : IWorker
{
    public void Work() => Console.WriteLine("welding");
    public void Eat() => throw new NotSupportedException();
}` },
        good: { py: `from abc import ABC, abstractmethod

class Workable(ABC):
    @abstractmethod
    def work(self): ...

class Eater(ABC):
    @abstractmethod
    def eat(self): ...

class Robot(Workable):              # only what applies
    def work(self):
        print("welding")`, java: `interface Workable { void work(); }
interface Eater { void eat(); }

class Robot implements Workable {   // only what applies
    public void work() { System.out.println("welding"); }
}`, cs: `interface IWorkable { void Work(); }
interface IEater { void Eat(); }

class Robot : IWorkable             // only what applies
{
    public void Work() => Console.WriteLine("welding");
}` } },
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
      { py: "Names: `seconds_elapsed` beats `t`, and `is_valid` beats `flag`. Short names are fine for tiny loops (`i`, `j`).",
        java: "Names: `secondsElapsed` beats `t`, and `isValid` beats `flag`. Short names are fine for tiny loops (`i`, `j`).",
        cs: "Names: `secondsElapsed` beats `t`, and `IsValid` beats `Flag`. Short names are fine for tiny loops (`i`, `j`)." },
      { py: "A named constant (`SECONDS_PER_DAY`) explains a number and keeps it in one place.",
        java: "A named constant (`SECONDS_PER_DAY`) explains a number and keeps it in one place.",
        cs: "A named constant (`SecondsPerDay`) explains a number and keeps it in one place." },
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
      { py: "Comments that repeat the code (`i += 1  # add one to i`).",
        java: "Comments that repeat the code (`i++; // add one to i`).",
        cs: "Comments that repeat the code (`i++; // add one to i`)." },
      { py: "Boolean flag parameters (`render(True, False)`). Two clearly named functions read better.",
        java: "Boolean flag parameters (`render(true, false)`). Two clearly named methods read better.",
        cs: "Boolean flag parameters (`Render(true, false)`). Two clearly named methods, or named arguments, read better." },
      "Logic that prints or writes files deep inside a calculation can't be tested without capturing output.",
      "Dead code and commented-out blocks left \"just in case\".",
    ],
    practice: [
      { why: "Names are the cheapest documentation. Say what the thing is, so readers don't have to work it out from the code.",
        bad: { py: `def calc(m, t):
    r = []
    for k, v in m.items():
        if v > t:
            r.append(k)
    return r`, java: `List<String> calc(Map<String, Integer> m, int t) {
    List<String> r = new ArrayList<>();
    for (var e : m.entrySet())
        if (e.getValue() > t) r.add(e.getKey());
    return r;
}`, cs: `List<string> Calc(Dictionary<string, int> m, int t)
{
    var r = new List<string>();
    foreach (var (k, v) in m)
        if (v > t) r.Add(k);
    return r;
}` },
        good: { py: `def customers_over_limit(spend_by_customer, limit):
    big_spenders = []
    for customer, spend in spend_by_customer.items():
        if spend > limit:
            big_spenders.append(customer)
    return big_spenders`, java: `List<String> customersOverLimit(Map<String, Integer> spendByCustomer, int limit) {
    List<String> bigSpenders = new ArrayList<>();
    for (var entry : spendByCustomer.entrySet())
        if (entry.getValue() > limit) bigSpenders.add(entry.getKey());
    return bigSpenders;
}`, cs: `List<string> CustomersOverLimit(Dictionary<string, int> spendByCustomer, int limit)
{
    var bigSpenders = new List<string>();
    foreach (var (customer, spend) in spendByCustomer)
        if (spend > limit) bigSpenders.Add(customer);
    return bigSpenders;
}` } },
      { why: "A calculation that also writes a file can't be tested or reused without that side effect. Keep the calculation pure, and do the input/output separately.",
        bad: { py: `def invoice_total(items):
    total = sum(price * qty for price, qty in items)
    with open("invoice.txt", "w") as f:    # hidden side effect
        f.write(str(total))
    return total`, java: `double invoiceTotal(List<Item> items) throws IOException {
    double total = 0;
    for (Item i : items) total += i.price() * i.qty();
    // hidden side effect
    Files.writeString(Path.of("invoice.txt"), String.valueOf(total));
    return total;
}`, cs: `double InvoiceTotal(List<Item> items)
{
    double total = items.Sum(i => i.Price * i.Qty);
    File.WriteAllText("invoice.txt", total.ToString());   // hidden side effect
    return total;
}` },
        good: { py: `def invoice_total(items):                   # pure: same input, same output
    return sum(price * qty for price, qty in items)

def save_invoice(path, total):
    with open(path, "w") as f:
        f.write(str(total))`, java: `double invoiceTotal(List<Item> items) {     // pure: same input, same output
    double total = 0;
    for (Item i : items) total += i.price() * i.qty();
    return total;
}

void saveInvoice(Path path, double total) throws IOException {
    Files.writeString(path, String.valueOf(total));
}`, cs: `double InvoiceTotal(List<Item> items) =>     // pure: same input, same output
    items.Sum(i => i.Price * i.Qty);

void SaveInvoice(string path, double total) =>
    File.WriteAllText(path, total.ToString());` } },
      { why: "A `true` or `false` argument says nothing at the call site. Two clearly named functions (or a named argument) read on their own.",
        bad: { py: `def render(doc, as_pdf):
    return to_pdf(doc) if as_pdf else to_html(doc)

render(doc, True)                       # True what?`, java: `String render(Doc doc, boolean asPdf) {
    return asPdf ? toPdf(doc) : toHtml(doc);
}
// render(doc, true): true what?`, cs: `string Render(Doc doc, bool asPdf) => asPdf ? ToPdf(doc) : ToHtml(doc);
// Render(doc, true): true what?` },
        good: { py: `def render_pdf(doc):
    return to_pdf(doc)

def render_html(doc):
    return to_html(doc)

render_pdf(doc)`, java: `String renderPdf(Doc doc) { return toPdf(doc); }
String renderHtml(Doc doc) { return toHtml(doc); }
// renderPdf(doc) says what it does`, cs: `string RenderPdf(Doc doc) => ToPdf(doc);
string RenderHtml(Doc doc) => ToHtml(doc);
// RenderPdf(doc) says what it does` } },
      { why: "Commented-out code and leftover debug prints are noise. Version control remembers old versions; delete them.",
        bad: { py: `def area(w, h):
    # old version:
    # return w * h * 1.0
    print("debug", w, h)
    return w * h`, java: `int area(int w, int h) {
    // old version:
    // return (int) (w * h * 1.0);
    System.out.println("debug " + w + " " + h);
    return w * h;
}`, cs: `int Area(int w, int h)
{
    // old version:
    // return (int)(w * h * 1.0);
    Console.WriteLine($"debug {w} {h}");
    return w * h;
}` },
        good: { py: `def area(w, h):
    return w * h`, java: `int area(int w, int h) {
    return w * h;
}`, cs: `int Area(int w, int h) => w * h;` } },
    ],
    interview: "Readability is graded. Rename `i, j` to `left, right` in two-pointer code, pull out helpers, and delete debugging prints before you say \"done\".",
    quiz: [
      { id: "cln1", q: "What is a pure function?",
        options: ["A function with no parameters", "One that always returns the same output for the same input and changes nothing outside itself", "A function written in one line", "A function without comments"], a: 1,
        why: "No hidden inputs (globals, the clock) and no hidden outputs (printing, mutation), so it's trivial to test." },
      { id: "cln2", q: { py: "What's wrong with `if status == 3:`?", java: "What's wrong with `if (status == 3)`?", cs: "What's wrong with `if (status == 3)`?" },
        options: ["Nothing", "`==` is the wrong operator", { py: "3 is a magic number; a named constant (`STATUS_SHIPPED`) says what it means", java: "3 is a magic number; a named constant or enum (`Status.SHIPPED`) says what it means", cs: "3 is a magic number; an enum (`Status.Shipped`) says what it means" }, "Numbers can't be compared to status codes"], a: 2,
        why: "A reader can't tell what 3 means, and if it changes you have to find every copy." },
      { id: "cln3", q: "What should a good comment explain?",
        options: ["Why the code does something non-obvious", "What each line does", "Who wrote it", "The variable types"], a: 0,
        why: "The code already says what it does. Comments add the reason: a constraint, a bug it avoids, a trade-off." },
    ],
  },
  {
    id: "errors", name: "Errors, edge cases & defensive code", short: "Er", part: "Writing good code",
    yt: "error handling exceptions edge cases best practices programming",
    what: "Robust code expects the unexpected. Check inputs where they enter your code and fail fast, with a clear error, instead of carrying on with bad data. Catch only the exceptions you can actually handle. Before you call a solution done, test the edge cases: empty input, one element, duplicates, negatives, very large values and missing values.",
    points: [
      { py: "Fail fast: reject bad input at the boundary with a clear message (`raise ValueError(\"age must be >= 0\")`).",
        java: "Fail fast: reject bad input at the boundary with a clear message (`throw new IllegalArgumentException(\"age must be >= 0\")`).",
        cs: "Fail fast: reject bad input at the boundary with a clear message (`throw new ArgumentException(\"age must be >= 0\")`)." },
      { py: "Catch specific exceptions (`ValueError`, `KeyError`), never a bare `except:` that hides bugs.",
        java: "Catch specific exceptions (`NumberFormatException`, `IOException`), never a blanket `catch (Exception e)` that hides bugs.",
        cs: "Catch specific exceptions (`FormatException`, `IOException`), never a blanket `catch (Exception)` that hides bugs." },
      { py: "Exceptions are for exceptional cases. For an expected \"not found\", return a value such as `None` or `-1`.",
        java: "Exceptions are for exceptional cases. For an expected \"not found\", return a value such as `-1` or an `Optional`.",
        cs: "Exceptions are for exceptional cases. For an expected \"not found\", return a value, or use the `TryParse` / `TryGetValue` pattern." },
      { py: "The edge-case checklist: empty, single element, all the same, sorted or reverse sorted, negatives and zero, maximum size, `None`.",
        java: "The edge-case checklist: empty, single element, all the same, sorted or reverse sorted, negatives and zero, maximum size, `null`.",
        cs: "The edge-case checklist: empty, single element, all the same, sorted or reverse sorted, negatives and zero, maximum size, `null`." },
      { java: "Use a type large enough for sums and products: `long` once values can pass 2.1 billion.",
        cs: "Use a type large enough for sums and products: `long` once values can pass 2.1 billion." },
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
      { py: "`except Exception: pass` swallows real bugs along with the error you expected.",
        java: "An empty `catch (Exception e) {}` swallows real bugs along with the error you expected.",
        cs: "An empty `catch { }` swallows real bugs along with the error you expected." },
      { py: "Returning `None` silently, so the crash happens far away from the cause.",
        java: "Returning `null` silently, so the `NullPointerException` happens far away from the cause.",
        cs: "Returning `null` silently, so the `NullReferenceException` happens far away from the cause." },
      "Using exceptions for normal flow inside a hot loop: they're slow and hide intent.",
      "Never testing the empty input.",
    ],
    practice: [
      { why: "Catching everything and ignoring it hides real bugs. Catch only the errors you expect, and handle each one on purpose.",
        bad: { py: `port = 0
try:
    port = int(config["port"])
except Exception:
    pass                    # hides a missing key, a typo, anything`, java: `int port = 0;
try {
    port = Integer.parseInt(config.get("port"));
} catch (Exception e) {
    // ignored: hides a missing key, a typo, anything
}`, cs: `int port = 0;
try
{
    port = int.Parse(config["port"]);
}
catch { }                   // hides a missing key, a typo, anything` },
        good: { py: `try:
    port = int(config["port"])
except KeyError:
    port = DEFAULT_PORT     # missing is fine: use the default
except ValueError:
    raise ValueError(f"port must be a number, got {config['port']!r}")`, java: `String raw = config.get("port");
int port = DEFAULT_PORT;    // missing is fine: use the default
if (raw != null) {
    try {
        port = Integer.parseInt(raw);
    } catch (NumberFormatException e) {
        throw new IllegalArgumentException("port must be a number, got " + raw, e);
    }
}`, cs: `int port = DefaultPort;     // missing is fine: use the default
if (config.TryGetValue("port", out var raw) && !int.TryParse(raw, out port))
    throw new ArgumentException($"port must be a number, got {raw}");` } },
      { why: { py: "Falling off the end returns `None`, and the crash happens later, far from the cause. Raise a clear error where the problem is.",
          java: "Returning `null` moves the crash somewhere else. `Optional` makes \"not found\" part of the type, so the caller has to deal with it.",
          cs: "Returning `null` moves the crash somewhere else. The Try pattern makes \"not found\" an explicit result the caller has to check." },
        bad: { py: `def find_user(users, user_id):
    for u in users:
        if u.id == user_id:
            return u
    # falls off the end: returns None`, java: `User findUser(List<User> users, int id) {
    for (User u : users)
        if (u.id() == id) return u;
    return null;            // the NullPointerException comes later
}`, cs: `User FindUser(List<User> users, int id)
{
    foreach (var u in users)
        if (u.Id == id) return u;
    return null;            // the NullReferenceException comes later
}` },
        good: { py: `def find_user(users, user_id):
    for u in users:
        if u.id == user_id:
            return u
    raise KeyError(f"no user with id {user_id}")`, java: `Optional<User> findUser(List<User> users, int id) {
    for (User u : users)
        if (u.id() == id) return Optional.of(u);
    return Optional.empty();    // the caller must decide what missing means
}`, cs: `bool TryFindUser(List<User> users, int id, out User user)
{
    user = users.Find(u => u.Id == id);
    return user != null;        // if (TryFindUser(...)) makes the check explicit
}` } },
      { why: "Check inputs where they enter, with a message that says what was wrong. Bad data caught early is easy to trace; bad data stored is not.",
        bad: { py: `def set_age(person, age):
    person.age = age        # accepts -5, 999 or "ten"`, java: `void setAge(Person person, int age) {
    person.age = age;       // accepts -5 or 999
}`, cs: `void SetAge(Person person, int age)
{
    person.Age = age;       // accepts -5 or 999
}` },
        good: { py: `def set_age(person, age):
    if not isinstance(age, int) or not 0 <= age <= 150:
        raise ValueError(f"age must be 0-150, got {age!r}")
    person.age = age`, java: `void setAge(Person person, int age) {
    if (age < 0 || age > 150)
        throw new IllegalArgumentException("age must be 0-150, got " + age);
    person.age = age;
}`, cs: `void SetAge(Person person, int age)
{
    if (age < 0 || age > 150)
        throw new ArgumentOutOfRangeException(
            nameof(age), age, "age must be 0-150");
    person.Age = age;
}` } },
      { why: { java: "Exceptions are for the unexpected. A missing map entry is a normal case: check for it instead of catching the crash.",
          cs: "Exceptions are slow and hide intent when failure is a normal case. `TryParse` reports it as a plain `bool`." },
        bad: { java: `int nameLength(Map<String, String> names, String id) {
    try {
        return names.get(id).length();
    } catch (NullPointerException e) {   // missing is normal, not exceptional
        return 0;
    }
}`, cs: `int? ParseOrNull(string s)
{
    try
    {
        return int.Parse(s);
    }
    catch (FormatException)       // bad input is normal here, not exceptional
    {
        return null;
    }
}` },
        good: { java: `int nameLength(Map<String, String> names, String id) {
    String name = names.get(id);
    return name == null ? 0 : name.length();
}`, cs: `int? ParseOrNull(string s) => int.TryParse(s, out int n) ? n : null;` } },
    ],
    interview: "Before coding, list the edge cases out loud; after coding, walk one through by hand. Interviewers notice, and it catches bugs before they do.",
    quiz: [
      { id: "err1", q: "Which inputs should you test first for most array problems?",
        options: ["A very large random array", "Only the example from the prompt", "An empty array and a single element", "An array of strings"], a: 2,
        why: "Empty and one-element inputs break more solutions than anything else: loops that never run, reading the first element of an empty array, off-by-one bounds." },
      { id: "err2", q: { py: "Why is `except Exception: pass` around a block risky?", java: "Why is an empty `catch (Exception e) {}` around a block risky?", cs: "Why is an empty `catch { }` around a block risky?" },
        options: ["It hides real bugs, not just the error you expected", "It's a syntax error", "It's slow", "It only catches syntax errors"], a: 0,
        why: { py: "A typo, a `None` or a wrong index all get silently ignored. Catch the specific exception you can handle.",
               java: "A typo, a `null` or a wrong index all get silently ignored. Catch the specific exception you can handle.",
               cs: "A typo, a `null` or a wrong index all get silently ignored. Catch the specific exception you can handle." } },
      { id: "err3", q: "What does \"fail fast\" mean?",
        options: ["Write code quickly", "Reject bad input with a clear error as early as possible, instead of carrying on", "Stop testing after the first failure", "Use timeouts everywhere"], a: 1,
        why: "An error at the boundary points straight at the cause. Bad data that travels on fails later, somewhere confusing." },
    ],
  },
];
