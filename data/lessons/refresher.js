// Python lessons. body is trusted HTML (written here). Exercise tests are Python asserts
// run against the learner's code in the browser (Pyodide).
// practice: good vs bad code pairs ({ why, bad, good }), shown after the example.
// Each exercise has a plain prompt, an example, a hint and a model answer (solution). Its progress is
// saved under "<lesson id>-<key>"; key defaults to the exercise's position, and is set explicitly so that
// adding or reordering exercises never moves a learner's saved progress onto a different exercise.
// A link to the Big-O lesson, for the first mention of O(...) in a lesson.
const BIGO_LINK = `<button class="link-btn inline-link" data-ref="bigo">Big-O lesson</button>`;
const LESSONS = [
  {
    id: "types", title: "1. Types and arithmetic",
    body: `<p>Every value in Python has a <b>type</b>, which decides what you can do with it. You can add two numbers, and you can join two pieces of text, but you can't add a number to a piece of text.</p>
      <h3>The core types</h3>
      <table><tr><th>Type</th><th>Examples</th><th>What it is</th></tr>
      <tr><td><code>int</code></td><td><code>42</code>, <code>-7</code></td><td>whole numbers</td></tr>
      <tr><td><code>float</code></td><td><code>3.5</code>, <code>2.0</code></td><td>numbers with a decimal point</td></tr>
      <tr><td><code>str</code></td><td><code>"hi"</code>, <code>'hi'</code></td><td>text (a "string" of characters)</td></tr>
      <tr><td><code>bool</code></td><td><code>True</code>, <code>False</code></td><td>yes / no answers</td></tr>
      <tr><td><code>None</code></td><td><code>None</code></td><td>"no value here"</td></tr></table>
      <p><code>type(x)</code> tells you a value's type. Collections (<code>list</code>, <code>dict</code>, <code>set</code>, <code>tuple</code>) get lessons of their own later.</p>
      <h3>Arithmetic</h3>
      <ul><li><code>+ - *</code> work as you'd expect.</li>
      <li><code>/</code> is normal division and <b>always</b> gives a float: <code>6 / 2</code> is <code>3.0</code>.</li>
      <li><code>//</code> is <b>floor division</b>: divide, then round down to a whole number. <code>7 // 2</code> is <code>3</code>.</li>
      <li><code>%</code> is the <b>remainder</b> (also called modulo): <code>7 % 2</code> is <code>1</code>.</li>
      <li><code>**</code> is power: <code>2 ** 10</code> is <code>1024</code>.</li></ul>
      <h3>Converting between types</h3>
      <p><code>int("42")</code> turns text into a number, <code>str(42)</code> turns a number into text, <code>float(3)</code> gives <code>3.0</code>. You need this whenever you mix them: <code>"Age: " + str(36)</code>.</p>
      <h3>Worked example: sharing a pizza</h3>
      <p>10 slices, 3 people. How many whole slices does each person get, and how many are left over?</p>
      <ol><li><code>10 / 3</code> is <code>3.333...</code>: true, but you can't hand out a third of a slice.</li>
      <li><code>10 // 3</code> is <code>3</code>: each person gets 3 whole slices.</li>
      <li><code>10 % 3</code> is <code>1</code>: one slice is left over.</li>
      <li>Check: 3 people &times; 3 slices + 1 left over = 10. The <code>//</code> and <code>%</code> pair always fits back together this way.</li></ol>`,
    example: `slices, people = 10, 3
print(slices / people)    # 3.3333333333333335 (always a float)
print(slices // people)   # 3  whole slices each
print(slices % people)    # 1  left over
print(2 ** 10)            # 1024

print(type(3), type(3.0), type("3"), type(True), type(None))
print(int("42") + 1)      # 43: text turned into a number
print("Age: " + str(36))  # number turned into text
`,
    practice: [
      { why: "Tuple assignment swaps in one line, with no temporary variable to name or get wrong.",
        bad: `temp = a
a = b
b = temp`,
        good: `a, b = b, a` },
      { why: "`/` always returns a float, so using it for an index or a count gives `3.0` where you needed `3`. Use `//` when you want a whole number.",
        bad: `middle = len(items) / 2       # 2.5 or 3.0: can't be a list index`,
        good: `middle = len(items) // 2      # a whole number` },
    ],
    exercises: [
      { key: "average", prompt: "Write average(a, b) that returns the average of two numbers.",
        example: "average(3, 4) returns 3.5",
        hint: "Add them, then divide by 2. Use brackets so the adding happens first: `(a + b) / 2`.",
        starter: "def average(a, b):\n    pass\n",
        tests: `assert average(3, 4) == 3.5, f"average(3, 4) should be 3.5, got {average(3, 4)}"
assert average(2, 2) == 2
assert average(-1, 1) == 0`,
        solution: `def average(a, b):
    return (a + b) / 2` },
      { key: "slices", prompt: "Write slices_each(slices, people) that returns how many WHOLE slices each person gets.",
        example: "slices_each(10, 3) returns 3",
        hint: "Floor division `//` divides and drops the part after the decimal point.",
        starter: "def slices_each(slices, people):\n    pass\n",
        tests: `assert slices_each(10, 3) == 3
assert slices_each(8, 4) == 2
assert slices_each(2, 5) == 0
assert type(slices_each(10, 3)) is int, "the answer should be a whole number (int), not 3.0"`,
        solution: `def slices_each(slices, people):
    return slices // people` },
      { key: "leftover", prompt: "Write leftover(slices, people) that returns how many slices are left after everyone gets the same whole number of slices.",
        example: "leftover(10, 3) returns 1",
        hint: "That's the remainder of the division: the `%` operator.",
        starter: "def leftover(slices, people):\n    pass\n",
        tests: `assert leftover(10, 3) == 1
assert leftover(8, 4) == 0
assert leftover(2, 5) == 2`,
        solution: `def leftover(slices, people):
    return slices % people` },
      { key: "describe", prompt: "Write describe(name, age) that returns text like \"Ada is 36\".",
        example: `describe("Ada", 36) returns "Ada is 36"`,
        hint: "age is a number, so turn it into text with `str(age)` before joining it with `+`.",
        starter: "def describe(name, age):\n    pass\n",
        tests: `assert describe("Ada", 36) == "Ada is 36", f"got {describe('Ada', 36)!r}"
assert describe("Sam", 0) == "Sam is 0"`,
        solution: `def describe(name, age):
    return name + " is " + str(age)` },
    ],
  },
  {
    id: "conditionals", title: "2. Conditionals: if, elif, else",
    body: `<p>Programs often need to <b>choose</b>: do one thing if something is true, something else if it isn't. That's what <code>if</code> is for.</p>
      <h3>Comparisons give True or False</h3>
      <p><code>==</code> equal (two equals signs; one <code>=</code> stores a value), <code>!=</code> not equal, <code>&lt;</code> <code>&gt;</code> <code>&lt;=</code> <code>&gt;=</code>. Each one gives <code>True</code> or <code>False</code>.</p>
      <p>Combine them with <code>and</code> (both must be true), <code>or</code> (at least one), and <code>not</code> (flips it). Python stops early when it already knows the answer: in <code>a or b</code>, if <code>a</code> is true, <code>b</code> is never checked. This is called <i>short-circuiting</i>.</p>
      <h3>if / elif / else</h3>
      <pre>if temperature &gt; 25:
    print("hot")
elif temperature &gt; 15:
    print("mild")
else:
    print("cold")</pre>
      <p>Python checks each condition from the top and runs the <b>first</b> block whose condition is true, then skips the rest. <code>elif</code> ("else if") adds another check; <code>else</code> catches everything left over. Both are optional.</p>
      <h3>Worked example: a grade from a score</h3>
      <p>For a score of 85 with the rules A &ge; 90, B &ge; 80, C &ge; 70, otherwise F:</p>
      <ol><li><code>if score &gt;= 90</code>: 85 &ge; 90 is False, so skip this block.</li>
      <li><code>elif score &gt;= 80</code>: 85 &ge; 80 is True, so return "B".</li>
      <li>The remaining checks never run. Because the order goes from the highest score down, there's no need to write <code>score &gt;= 80 and score &lt; 90</code>: anything 90 or above was already caught.</li></ol>
      <p>Python also lets you chain comparisons: <code>0 &lt;= x &lt; 10</code> means "x is at least 0 and less than 10".</p>`,
    example: `def grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    else:
        return "F"

print(grade(95), grade(85), grade(40))   # A B F

x = 7
print(x > 5 and x < 10)   # True
print(0 <= x < 10)        # True: the same check, chained
print(not x == 7)         # False
`,
    practice: [
      { why: "Python chains comparisons, so a range check reads the way you'd write it in maths.",
        bad: `if x >= 0 and x < n:
    print("in range")`,
        good: `if 0 <= x < n:
    print("in range")` },
      { why: "A comparison is already True or False. Wrapping it in `if ... return True else return False` says the same thing four times longer.",
        bad: `def is_adult(age):
    if age >= 18:
        return True
    else:
        return False`,
        good: `def is_adult(age):
    return age >= 18` },
    ],
    exercises: [
      { key: "bigger", prompt: "Write bigger(a, b) that returns the larger of two numbers, using if (not the built-in max).",
        example: "bigger(3, 9) returns 9\nbigger(4, 4) returns 4",
        hint: "`if a > b: return a`, otherwise return b.",
        starter: "def bigger(a, b):\n    pass\n",
        tests: `assert bigger(3, 9) == 9
assert bigger(9, 3) == 9
assert bigger(4, 4) == 4
assert bigger(-1, -5) == -1`,
        solution: `def bigger(a, b):
    if a > b:
        return a
    return b` },
      { key: "sign", prompt: "Write sign(n) that returns \"positive\", \"negative\" or \"zero\".",
        example: `sign(5) returns "positive"\nsign(-2) returns "negative"\nsign(0) returns "zero"`,
        hint: "Three cases means if / elif / else: check `n > 0`, then `n < 0`, and anything else is zero.",
        starter: "def sign(n):\n    pass\n",
        tests: `assert sign(5) == "positive"
assert sign(-2) == "negative"
assert sign(0) == "zero"`,
        solution: `def sign(n):
    if n > 0:
        return "positive"
    elif n < 0:
        return "negative"
    else:
        return "zero"` },
      { key: "grade", prompt: "Write grade(score): \"A\" for 90 and up, \"B\" for 80 and up, \"C\" for 70 and up, otherwise \"F\".",
        example: `grade(85) returns "B"\ngrade(90) returns "A"`,
        hint: "Check from the highest grade down, as in the worked example. Watch the boundaries: 90 is an A, so use `>=`.",
        starter: "def grade(score):\n    pass\n",
        tests: `assert grade(95) == "A" and grade(90) == "A", "90 and above is an A"
assert grade(85) == "B" and grade(80) == "B"
assert grade(70) == "C"
assert grade(69) == "F" and grade(0) == "F"`,
        solution: `def grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    return "F"` },
      { key: "in_range", prompt: "Write in_range(x, lo, hi) that returns True if x is between lo and hi, including both ends.",
        example: "in_range(5, 1, 10) returns True\nin_range(10, 1, 10) returns True\nin_range(11, 1, 10) returns False",
        hint: "A chained comparison does it in one line: `lo <= x <= hi`.",
        starter: "def in_range(x, lo, hi):\n    pass\n",
        tests: `assert in_range(5, 1, 10) is True
assert in_range(1, 1, 10) is True and in_range(10, 1, 10) is True, "both ends count"
assert in_range(11, 1, 10) is False and in_range(0, 1, 10) is False`,
        solution: `def in_range(x, lo, hi):
    return lo <= x <= hi` },
      { key: "fizz_one", prompt: "Write fizz_one(n) for a single number: \"FizzBuzz\" if n is a multiple of both 3 and 5, \"Fizz\" if only of 3, \"Buzz\" if only of 5, otherwise the number as text.",
        example: `fizz_one(9) returns "Fizz"\nfizz_one(10) returns "Buzz"\nfizz_one(15) returns "FizzBuzz"\nfizz_one(7) returns "7"`,
        hint: "\"Multiple of 3\" means `n % 3 == 0`. Check the both-3-and-5 case FIRST, otherwise 15 would stop at \"Fizz\". Use `str(n)` for the last case.",
        starter: "def fizz_one(n):\n    pass\n",
        tests: `assert fizz_one(15) == "FizzBuzz", "check the 3-and-5 case first"
assert fizz_one(9) == "Fizz"
assert fizz_one(10) == "Buzz"
assert fizz_one(7) == "7", "other numbers come back as text: str(n)"`,
        solution: `def fizz_one(n):
    if n % 3 == 0 and n % 5 == 0:
        return "FizzBuzz"
    elif n % 3 == 0:
        return "Fizz"
    elif n % 5 == 0:
        return "Buzz"
    return str(n)` },
    ],
  },
  {
    id: "loops", title: "3. Loops: for and while",
    body: `<p>A <b>loop</b> repeats some lines. Python has two kinds: <code>for</code> goes through a sequence of values, and <code>while</code> keeps going as long as a condition is true.</p>
      <h3>for and range</h3>
      <p><code>for x in items:</code> runs the indented body once for each item. To loop over numbers, use <code>range</code>:</p>
      <ul><li><code>range(5)</code> gives 0, 1, 2, 3, 4 (it stops <b>before</b> 5).</li>
      <li><code>range(1, 6)</code> gives 1 to 5. <code>range(10, 0, -2)</code> counts down in steps of 2: 10, 8, 6, 4, 2.</li></ul>
      <h3>while</h3>
      <p><code>while n &gt; 0:</code> checks the condition before each round and stops when it's false. Something in the body must change the condition, or the loop never ends.</p>
      <p><code>break</code> leaves a loop early; <code>continue</code> skips to the next round.</p>
      <h3>Worked example: building a list in a loop</h3>
      <p>To collect the even numbers from 1 to 6:</p>
      <ol><li>Start with an empty list: <code>evens = []</code>.</li>
      <li><code>for n in range(1, 7):</code> sets n to 1, 2, 3, 4, 5, 6 in turn.</li>
      <li>Inside, <code>if n % 2 == 0: evens.append(n)</code> keeps only the even ones.</li>
      <li>After the loop (the next line that isn't indented), <code>evens</code> is <code>[2, 4, 6]</code>.</li></ol>
      <h3>Two helpers worth knowing</h3>
      <ul><li><code>for i, x in enumerate(items):</code> gives the position and the item together.</li>
      <li><code>for a, b in zip(xs, ys):</code> walks two lists side by side.</li></ul>`,
    example: `evens = []
for n in range(1, 7):
    if n % 2 == 0:
        evens.append(n)
print(evens)              # [2, 4, 6]

n = 3
while n > 0:
    print("countdown", n)
    n = n - 1

for i, name in enumerate(["Ada", "Sam"], start=1):
    print(i, name)        # 1 Ada / 2 Sam

for name, score in zip(["Ada", "Sam"], [90, 75]):
    print(name, score)
`,
    practice: [
      { why: "`enumerate` gives the position and the item together, so you don't index back into the list.",
        bad: `for i in range(len(names)):
    print(i, names[i])`,
        good: `for i, name in enumerate(names):
    print(i, name)` },
      { why: "`zip` pairs up two lists directly and stops at the shorter one, so there's no index to get wrong.",
        bad: `for i in range(len(names)):
    print(names[i], scores[i])`,
        good: `for name, score in zip(names, scores):
    print(name, score)` },
      { why: "A while loop whose condition never changes runs forever. Make sure the body moves towards the end.",
        bad: `n = 3
while n > 0:
    print(n)              # n never changes: endless`,
        good: `n = 3
while n > 0:
    print(n)
    n -= 1                # moves towards the end` },
    ],
    exercises: [
      { key: "count_up", prompt: "Write count_up(n) that returns a list of the numbers from 1 to n.",
        example: "count_up(3) returns [1, 2, 3]\ncount_up(0) returns []",
        hint: "Start with an empty list, loop `for i in range(1, n + 1)` (range stops before its end, hence the + 1), and append each i.",
        starter: "def count_up(n):\n    pass\n",
        tests: `assert count_up(3) == [1, 2, 3], f"got {count_up(3)}"
assert count_up(1) == [1]
assert count_up(0) == []`,
        solution: `def count_up(n):
    result = []
    for i in range(1, n + 1):
        result.append(i)
    return result` },
      { key: "sum_to", prompt: "Write sum_to(n) that returns 1 + 2 + ... + n, using a loop.",
        example: "sum_to(4) returns 10",
        hint: "Keep a running total that starts at 0, and add each number from `range(1, n + 1)` to it.",
        starter: "def sum_to(n):\n    pass\n",
        tests: `assert sum_to(4) == 10
assert sum_to(1) == 1
assert sum_to(0) == 0
assert sum_to(100) == 5050`,
        solution: `def sum_to(n):
    total = 0
    for i in range(1, n + 1):
        total += i
    return total` },
      { key: "count_evens", prompt: "Write count_evens(nums) that returns how many numbers in the list are even.",
        example: "count_evens([1, 2, 3, 4]) returns 2",
        hint: "Start a counter at 0. Loop over nums, and add 1 to the counter when `n % 2 == 0`.",
        starter: "def count_evens(nums):\n    pass\n",
        tests: `assert count_evens([1, 2, 3, 4]) == 2
assert count_evens([]) == 0
assert count_evens([1, 3]) == 0
assert count_evens([0, -2]) == 2, "0 and -2 are even too"`,
        solution: `def count_evens(nums):
    count = 0
    for n in nums:
        if n % 2 == 0:
            count += 1
    return count` },
      { key: "countdown", prompt: "Write countdown(n) that uses a while loop to return [n, n-1, ..., 1].",
        example: "countdown(3) returns [3, 2, 1]",
        hint: "`while n > 0:` append n, then make n one smaller (`n -= 1`). Forgetting that line makes the loop endless.",
        starter: "def countdown(n):\n    pass\n",
        tests: `assert countdown(3) == [3, 2, 1]
assert countdown(1) == [1]
assert countdown(0) == []`,
        solution: `def countdown(n):
    result = []
    while n > 0:
        result.append(n)
        n -= 1
    return result` },
      { key: "fizzbuzz", prompt: "Write fizzbuzz(n) that returns a list of strings for 1 to n: \"Fizz\" for multiples of 3, \"Buzz\" for multiples of 5, \"FizzBuzz\" for both, otherwise the number as a string.",
        example: `fizzbuzz(5) returns ["1", "2", "Fizz", "4", "Buzz"]`,
        hint: "Loop `for i in range(1, n + 1)` and append one string per number. The if / elif chain is the same as in fizz_one from the Conditionals lesson: check 3-and-5 first.",
        starter: "def fizzbuzz(n):\n    pass\n",
        tests: `assert fizzbuzz(5) == ['1','2','Fizz','4','Buzz'], fizzbuzz(5)
assert fizzbuzz(15)[-1] == 'FizzBuzz'
assert fizzbuzz(0) == []`,
        solution: `def fizzbuzz(n):
    out = []
    for i in range(1, n + 1):
        if i % 15 == 0:
            out.append("FizzBuzz")
        elif i % 3 == 0:
            out.append("Fizz")
        elif i % 5 == 0:
            out.append("Buzz")
        else:
            out.append(str(i))
    return out` },
    ],
  },
  {
    id: "truthiness", title: "4. Truthiness: what counts as True",
    body: `<p>An <code>if</code> doesn't need a real <code>True</code> or <code>False</code>. Python treats every value as either "truthy" or "falsy" when it has to decide.</p>
      <h3>The falsy values</h3>
      <p>These count as false: <code>False</code>, <code>None</code>, <code>0</code>, <code>0.0</code>, the empty string <code>""</code>, and empty collections: <code>[]</code>, <code>{}</code>, <code>set()</code>, <code>()</code>. <b>Everything else is truthy</b>, including <code>"0"</code>, <code>" "</code> (a space) and <code>[0]</code> (a list with one item).</p>
      <p><code>bool(x)</code> shows how Python sees a value: <code>bool([])</code> is <code>False</code>, <code>bool("0")</code> is <code>True</code>.</p>
      <h3>Why it's useful</h3>
      <p>"Is this list empty?" becomes <code>if not items:</code>, and "do we have a name?" becomes <code>if name:</code>. Both read like plain English and work for any kind of collection.</p>
      <h3>and / or return a value</h3>
      <p><code>a or b</code> gives back <code>a</code> if it's truthy, otherwise <code>b</code>. So <code>name or "Anonymous"</code> means "the name, or Anonymous if there isn't one".</p>
      <h3>Worked example</h3>
      <p>What does <code>display_name("")</code> return, for <code>return name or "Anonymous"</code>?</p>
      <ol><li><code>name</code> is <code>""</code>, the empty string, which is falsy.</li>
      <li><code>or</code> moves on to the right-hand side and returns <code>"Anonymous"</code>.</li>
      <li>For <code>display_name("Ada")</code>, <code>"Ada"</code> is truthy, so <code>or</code> returns it straight away.</li></ol>
      <p>One trap: <code>0</code> is falsy too. If 0 is a valid value (a score, a count), check <code>if x is None:</code> instead of <code>if not x:</code>.</p>`,
    example: `for v in [0, 1, "", "0", [], [0], None, {}]:
    print(repr(v), bool(v))

items = []
if not items:
    print("nothing to do")

name = ""
print(name or "Anonymous")   # Anonymous
score = 0
print(score or "no score")   # no score: a trap, 0 is a real score
print("no score" if score is None else score)   # 0
`,
    practice: [
      { why: "Empty collections are falsy, so `if not items:` says \"if it's empty\" directly, and works for any collection.",
        bad: `if len(items) == 0:
    print("nothing to do")`,
        good: `if not items:
    print("nothing to do")` },
      { why: "When 0 is a real value, `if not x` wrongly treats it as missing. Check for `None` explicitly.",
        bad: `def show(score):
    if not score:               # true for 0 as well!
        return "no score yet"
    return str(score)`,
        good: `def show(score):
    if score is None:
        return "no score yet"
    return str(score)` },
    ],
    exercises: [
      { key: "is_empty", prompt: "Write is_empty(items) that returns True if the list has no items. Use not instead of len.",
        example: "is_empty([]) returns True\nis_empty([0]) returns False",
        hint: "An empty list is falsy, so `not items` is True exactly when the list is empty.",
        starter: "def is_empty(items):\n    pass\n",
        tests: `assert is_empty([]) is True
assert is_empty([0]) is False, "[0] has one item, so it isn't empty"
assert is_empty([1, 2]) is False`,
        solution: `def is_empty(items):
    return not items` },
      { key: "display_name", prompt: "Write display_name(name) that returns the name, or \"Anonymous\" when the name is empty or None.",
        example: `display_name("Ada") returns "Ada"\ndisplay_name("") returns "Anonymous"\ndisplay_name(None) returns "Anonymous"`,
        hint: "`or` returns the left side if it's truthy, otherwise the right side.",
        starter: "def display_name(name):\n    pass\n",
        tests: `assert display_name("Ada") == "Ada"
assert display_name("") == "Anonymous"
assert display_name(None) == "Anonymous"`,
        solution: `def display_name(name):
    return name or "Anonymous"` },
      { key: "first_or", prompt: "Write first_or(items, default) that returns the first item of the list, or default if the list is empty.",
        example: "first_or([4, 5], 0) returns 4\nfirst_or([], 0) returns 0",
        hint: "Check `if not items:` first and return default; otherwise return `items[0]`. (`items[0] or default` would be wrong when the first item is 0.)",
        starter: "def first_or(items, default):\n    pass\n",
        tests: `assert first_or([4, 5], 0) == 4
assert first_or([], 0) == 0
assert first_or([], "none") == "none"
assert first_or([0, 5], 9) == 0, "the first item is 0, which is a real value"`,
        solution: `def first_or(items, default):
    if not items:
        return default
    return items[0]` },
      { key: "count_truthy", prompt: "Write count_truthy(values) that returns how many values in the list are truthy.",
        example: `count_truthy([0, 1, "", "a", None, [], [0]]) returns 3`,
        hint: "Loop over the values and add 1 whenever `if v:` passes.",
        starter: "def count_truthy(values):\n    pass\n",
        tests: `assert count_truthy([0, 1, "", "a", None, [], [0]]) == 3, "1, 'a' and [0] are truthy"
assert count_truthy([]) == 0
assert count_truthy(["0", " "]) == 2, "non-empty strings are truthy, even '0'"`,
        solution: `def count_truthy(values):
    count = 0
    for v in values:
        if v:
            count += 1
    return count` },
    ],
  },
  {
    id: "functions", title: "5. Functions",
    body: `<p>A <b>function</b> is a named block of code you can run whenever you need it. Functions let you write a piece of logic once and reuse it, and give it a name that says what it does.</p>
      <h3>Defining and calling</h3>
      <pre>def rect_area(width, height):
    return width * height

print(rect_area(3, 4))   # 12</pre>
      <ul><li><code>def</code> starts the definition; <code>width</code> and <code>height</code> are the <b>parameters</b>: names for the inputs.</li>
      <li>The indented lines are the <b>body</b>. Defining the function doesn't run it.</li>
      <li><code>rect_area(3, 4)</code> <b>calls</b> it. The values 3 and 4 are the <b>arguments</b>; they're matched to the parameters in order.</li>
      <li><code>return</code> sends a value back to the caller and ends the function. A function with no <code>return</code> gives back <code>None</code>.</li></ul>
      <h3>What a call does, step by step</h3>
      <p>For <code>area = rect_area(3, 4)</code>:</p>
      <ol><li>Python creates fresh variables for this call: <code>width = 3</code>, <code>height = 4</code>. They only exist while the function runs (they're <i>local</i> to it).</li>
      <li>It runs the body: <code>3 * 4</code> is 12, and <code>return</code> sends 12 back.</li>
      <li>The call is replaced by its result, so the line becomes <code>area = 12</code>.</li></ol>
      <h3>Default values and keyword arguments</h3>
      <p>A parameter can have a default: <code>def greet(name, greeting="Hello"):</code>. Leave it out and the default is used; pass it to override. You can also name arguments in the call, <code>greet("Sam", greeting="Hi")</code>, which makes calls easier to read.</p>
      <h3>Returning more than one value</h3>
      <p><code>return lo, hi</code> returns both values together (as a <i>tuple</i>, an unchangeable pair). The caller can unpack them: <code>lo, hi = min_max(nums)</code>.</p>
      <p>The <button class="link-btn inline-link" data-ref="py:functions-more">Functions: going further</button> lesson, later on, covers <code>*args</code>, closures and scope.</p>`,
    example: `def rect_area(width, height):
    return width * height

area = rect_area(3, 4)
print(area)                       # 12

def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Sam"))               # Hello, Sam!
print(greet("Sam", greeting="Hi"))  # Hi, Sam!

def min_max(nums):
    return min(nums), max(nums)

lo, hi = min_max([4, 1, 9])
print(lo, hi)                     # 1 9

def no_return():
    x = 1
print(no_return())                # None
`,
    practice: [
      { why: "A function that returns its answer can be tested, stored and reused; one that prints it can only be read by a person.",
        bad: `def rect_area(w, h):
    print(w * h)`,
        good: `def rect_area(w, h):
    return w * h` },
      { why: "A function that changes a global variable is hard to follow and test. Take inputs as parameters and return the result.",
        bad: `total = 0

def add_price(p):
    global total
    total += p`,
        good: `def add_price(total, p):
    return total + p

total = add_price(total, 5)` },
    ],
    exercises: [
      { key: "rect_area", prompt: "Write rect_area(width, height) that returns the area of a rectangle.",
        example: "rect_area(3, 4) returns 12",
        hint: "Area is width times height: `return width * height`.",
        starter: "def rect_area(width, height):\n    pass\n",
        tests: `assert rect_area(3, 4) == 12
assert rect_area(5, 0) == 0`,
        solution: `def rect_area(width, height):
    return width * height` },
      { key: "greet", prompt: "Write greet(name, greeting=\"Hello\") that returns \"<greeting>, <name>!\". The greeting is optional and defaults to Hello.",
        example: `greet("Sam") returns "Hello, Sam!"\ngreet("Sam", "Hi") returns "Hi, Sam!"`,
        hint: "The default is already in the starter's signature. Join the pieces: `greeting + \", \" + name + \"!\"` (or an f-string).",
        starter: "def greet(name, greeting=\"Hello\"):\n    pass\n",
        tests: `assert greet("Sam") == "Hello, Sam!", f"got {greet('Sam')!r}"
assert greet("Sam", "Hi") == "Hi, Sam!"
assert greet("Ada", greeting="Welcome") == "Welcome, Ada!"`,
        solution: `def greet(name, greeting="Hello"):
    return greeting + ", " + name + "!"` },
      { key: "discount", prompt: "Write apply_discount(price, percent) that returns the price after taking off that percentage.",
        example: "apply_discount(200, 25) returns 150.0",
        hint: "25% of 200 is `200 * 25 / 100`. Subtract that from the price.",
        starter: "def apply_discount(price, percent):\n    pass\n",
        tests: `assert apply_discount(200, 25) == 150
assert apply_discount(80, 0) == 80
assert apply_discount(50, 100) == 0`,
        solution: `def apply_discount(price, percent):
    return price - price * percent / 100` },
      { key: "min_max", prompt: "Write min_max(nums) that returns two values, the smallest and the largest number, without using the built-in min or max.",
        example: "min_max([4, 1, 9]) returns (1, 9)",
        hint: "Start both lo and hi at `nums[0]`. Loop over nums and update lo when you see something smaller, hi when you see something bigger. End with `return lo, hi`.",
        starter: "def min_max(nums):\n    pass\n",
        tests: `assert min_max([4, 1, 9]) == (1, 9), f"got {min_max([4, 1, 9])}"
assert min_max([5]) == (5, 5)
assert min_max([-3, -8, -1]) == (-8, -1)`,
        solution: `def min_max(nums):
    lo = hi = nums[0]
    for n in nums:
        if n < lo:
            lo = n
        if n > hi:
            hi = n
    return lo, hi` },
    ],
  },
  {
    id: "strings", title: "6. Strings",
    body: `<p>A string is a sequence of characters. Strings are <b>immutable</b>: once made, they can't be changed. Methods like <code>upper()</code> or <code>replace()</code> don't change the string; they return a new one.</p>
      <h3>Building strings</h3>
      <p>Because strings can't change, <code>s = s + c</code> inside a loop makes a brand-new string each time, copying everything so far. For long text that gets slow: the work grows with the <i>square</i> of the length, which is written <b>O(n²)</b>. (O-notation describes how work grows with input size; the ${BIGO_LINK} explains it.) The fast way is to collect pieces in a list and join them once: <code>"".join(parts)</code>.</p>
      <h3>The everyday tools</h3>
      <ul><li>Indexing and slicing: <code>s[0]</code>, <code>s[-1]</code>, <code>s[a:b]</code> (from a up to, not including, b), <code>s[::-1]</code> (reversed).</li>
      <li>Methods: <code>split, join, strip, lower, upper, startswith, find, replace, isalnum, isdigit</code>.</li>
      <li>f-strings put values into text: <code>f"{name}: {value:.2f}"</code>.</li>
      <li><code>ord('a')</code> is the character's code (97); <code>chr(97)</code> turns it back into <code>'a'</code>.</li></ul>
      <h3>Worked example: initials</h3>
      <p>To turn <code>"ada lovelace"</code> into <code>"AL"</code>:</p>
      <ol><li><code>name.split()</code> splits on spaces: <code>["ada", "lovelace"]</code>.</li>
      <li>Loop over the words. For each one, <code>word[0]</code> is its first letter and <code>.upper()</code> makes it a capital; append it to a list, <code>letters</code>.</li>
      <li><code>"".join(letters)</code> glues the letters together with nothing in between: <code>"AL"</code>.</li></ol>`,
    example: `s = "Hello, World"
print(s[::-1], s.lower().split(", "), s.find("World"))
print("-".join(["a", "b", "c"]), f"{3.14159:.2f}")

letters = []
for word in "ada lovelace".split():
    letters.append(word[0].upper())
print("".join(letters))   # AL
`,
    practice: [
      { why: "`in` checks for a substring directly; `find` returns a position, and comparing it with -1 is easy to get wrong.",
        bad: `if text.find("error") != -1:
    alert()`,
        good: `if "error" in text:
    alert()` },
      { why: "An f-string puts values where they appear and converts them for you, so there's no `str()` or `+` to juggle.",
        bad: `msg = "Hi " + name + ", you have " + str(count) + " new messages"`,
        good: `msg = f"Hi {name}, you have {count} new messages"` },
      { why: "Slicing with a step of -1 reverses a string in one readable expression.",
        bad: `rev = ""
for c in s:
    rev = c + rev           # also O(n²): a new string each time`,
        good: `rev = s[::-1]` },
    ],
    exercises: [
      { key: "shout", prompt: "Write shout(s) that returns the text in capital letters with an exclamation mark at the end.",
        example: `shout("hi") returns "HI!"`,
        hint: "`s.upper()` gives the capitals; add `\"!\"` with `+`.",
        starter: "def shout(s):\n    pass\n",
        tests: `assert shout("hi") == "HI!"
assert shout("Stop") == "STOP!"
assert shout("") == "!"`,
        solution: `def shout(s):
    return s.upper() + "!"` },
      { key: "initials", prompt: "Write initials(name) that returns the capitalised first letter of each word.",
        example: `initials("ada lovelace") returns "AL"`,
        hint: "Follow the worked example: `split()` into words, append `word[0].upper()` for each one to a list, then join the list with `\"\".join(letters)`.",
        starter: "def initials(name):\n    pass\n",
        tests: `assert initials("ada lovelace") == "AL"
assert initials("Grace Brewster Hopper") == "GBH"
assert initials("  sam  ") == "S", "split() with no argument ignores extra spaces"`,
        solution: `def initials(name):
    letters = []
    for word in name.split():
        letters.append(word[0].upper())
    return "".join(letters)` },
      { key: 0, prompt: "Write is_palindrome(s) that returns True if s reads the same forwards and backwards, ignoring case and anything that isn't a letter or digit.",
        example: `is_palindrome("A man, a plan, a canal: Panama") returns True\nis_palindrome("race a car") returns False`,
        hint: "First build a cleaned string: keep only characters where `c.isalnum()`, lowercased. Then compare it with its reverse, `cleaned[::-1]`.",
        starter: "def is_palindrome(s):\n    pass\n",
        tests: `assert is_palindrome('A man, a plan, a canal: Panama') is True
assert is_palindrome('race a car') is False
assert is_palindrome('') is True`,
        solution: `def is_palindrome(s):
    kept = []
    for c in s:
        if c.isalnum():
            kept.append(c.lower())
    cleaned = "".join(kept)
    return cleaned == cleaned[::-1]` },
      { key: 1, prompt: "Write reverse_words(s) that reverses the order of the words and leaves exactly one space between them.",
        example: `reverse_words("  the sky  is blue ") returns "blue is sky the"`,
        hint: "`s.split()` (no argument) splits on any run of spaces and drops the empty bits. Reverse that list, then `\" \".join(...)` it.",
        starter: "def reverse_words(s):\n    pass\n",
        tests: `assert reverse_words('  the sky  is blue ') == 'blue is sky the'
assert reverse_words('one') == 'one'`,
        solution: `def reverse_words(s):
    return " ".join(s.split()[::-1])` },
    ],
  },
  {
    id: "lists", title: "7. Lists, tuples & slicing",
    body: `<p>A list is an ordered collection you can change. Under the hood it's a <b>dynamic array</b>: the items sit side by side in memory, so jumping to any position is instant.</p>
      <h3>What's fast and what's slow</h3>
      <p>In O-notation (see the ${BIGO_LINK}): <b>O(1)</b> means "takes the same time however long the list is"; <b>O(n)</b> means "grows in step with the length".</p>
      <ul><li>Fast, O(1): <code>a[i]</code>, <code>a.append(x)</code>, <code>a.pop()</code> from the end.</li>
      <li>Slow, O(n): <code>a.insert(0, x)</code> and <code>a.pop(0)</code> (every other item shifts along), and <code>x in a</code> (checks items one by one). For a queue, use <code>collections.deque</code>.</li></ul>
      <h3>Copies and shared lists</h3>
      <ul><li>Slices make a copy: <code>a[1:3]</code>, <code>a[:]</code>. But <code>b = a</code> does <b>not</b> copy: both names point at the same list, so changing one changes "both".</li>
      <li>2-D grids: <code>[[0] * cols for _ in range(rows)]</code>. Never <code>[[0] * cols] * rows</code>, which repeats the same row object.</li></ul>
      <h3>Sorting</h3>
      <p><code>sorted(xs)</code> returns a new sorted list; <code>xs.sort()</code> sorts in place and returns <code>None</code>. Both take <code>key=</code> and <code>reverse=True</code>.</p>
      <h3>Tuples</h3>
      <p>A tuple, <code>(3, 4)</code>, is like a list that can't be changed (<b>immutable</b>). Because it can't change, it can be a dictionary key or set member. Unpack it with <code>x, y = point</code>.</p>
      <h3>Worked example: rotating a list</h3>
      <p>Rotate <code>[1, 2, 3, 4, 5]</code> left by 2: the first 2 items move to the end.</p>
      <ol><li><code>lst[2:]</code> is <code>[3, 4, 5]</code>; <code>lst[:2]</code> is <code>[1, 2]</code>.</li>
      <li>Put them together: <code>lst[2:] + lst[:2]</code> is <code>[3, 4, 5, 1, 2]</code>.</li>
      <li>Rotating by 7 on a 5-item list is the same as rotating by 2, so use <code>k % len(lst)</code> first (and handle the empty list, where <code>len</code> is 0).</li></ol>`,
    example: `a = [1, 2, 3, 4, 5]
b = a            # same list
c = a[:]         # copy
b.append(6)
print(a, c)

grid = [[0] * 3 for _ in range(2)]
grid[0][0] = 1
print(grid)
print(sorted([("x", 3), ("y", 1)], key=lambda t: t[1]))

k = 2
print(a[k:] + a[:k])   # rotate left by 2
`,
    practice: [
      { why: "`sort()` sorts in place and returns `None`, so assigning its result loses the list. Use `sort()` alone, or `sorted()` for a new list.",
        bad: `nums = nums.sort()          # nums is now None`,
        good: `nums.sort()                 # in place
ordered = sorted(nums)      # or: a new sorted list` },
      { why: "Negative indexes count from the end: `nums[-1]` is the last item, with no length arithmetic.",
        bad: `last = nums[len(nums) - 1]
second_last = nums[len(nums) - 2]`,
        good: `last = nums[-1]
second_last = nums[-2]` },
      { why: "Unpacking names each part of a tuple or list in one step, and fails loudly if the size is wrong.",
        bad: `point = (3, 4)
x = point[0]
y = point[1]`,
        good: `point = (3, 4)
x, y = point` },
    ],
    exercises: [
      { key: "ends", prompt: "Write ends(lst) that returns a new list holding the first and the last item.",
        example: "ends([4, 5, 6, 7]) returns [4, 7]\nends([9]) returns [9, 9]",
        hint: "`lst[0]` is the first item and `lst[-1]` the last. Put them in a new list: `[lst[0], lst[-1]]`.",
        starter: "def ends(lst):\n    pass\n",
        tests: `assert ends([4, 5, 6, 7]) == [4, 7]
assert ends([9]) == [9, 9]`,
        solution: `def ends(lst):
    return [lst[0], lst[-1]]` },
      { key: "reversed_copy", prompt: "Write reversed_copy(lst) that returns a NEW list in reverse order, leaving the original list unchanged.",
        example: "reversed_copy([1, 2, 3]) returns [3, 2, 1]",
        hint: "A slice with a step of -1, `lst[::-1]`, makes a reversed copy. (`lst.reverse()` would change the original.)",
        starter: "def reversed_copy(lst):\n    pass\n",
        tests: `orig = [1, 2, 3]
assert reversed_copy(orig) == [3, 2, 1]
assert orig == [1, 2, 3], "the original list must not change"
assert reversed_copy([]) == []`,
        solution: `def reversed_copy(lst):
    return lst[::-1]` },
      { key: 0, prompt: "Write rotate_left(lst, k) that returns a NEW list rotated left by k places. k may be bigger than the list's length; an empty list stays empty.",
        example: "rotate_left([1, 2, 3, 4, 5], 2) returns [3, 4, 5, 1, 2]",
        hint: "Follow the worked example: return `[]` for an empty list, set `k = k % len(lst)`, then `lst[k:] + lst[:k]`.",
        starter: "def rotate_left(lst, k):\n    pass\n",
        tests: `assert rotate_left([1,2,3,4,5], 2) == [3,4,5,1,2]
assert rotate_left([1,2,3], 7) == [2,3,1]
assert rotate_left([], 3) == []`,
        solution: `def rotate_left(lst, k):
    if not lst:
        return []
    k %= len(lst)
    return lst[k:] + lst[:k]` },
      { key: 1, prompt: "Write dedupe(lst) that removes duplicates but keeps the items in the order they first appeared.",
        example: "dedupe([3, 1, 3, 2, 1]) returns [3, 1, 2]",
        hint: "Keep a set of items you've already seen. Loop over the list and append an item to the result only if it isn't in the set yet, then add it to the set.",
        starter: "def dedupe(lst):\n    pass\n",
        tests: `assert dedupe([3,1,3,2,1]) == [3,1,2]
assert dedupe([]) == []`,
        solution: `def dedupe(lst):
    seen, out = set(), []
    for x in lst:
        if x not in seen:
            seen.add(x)
            out.append(x)
    return out` },
    ],
  },
  {
    id: "dicts", title: "8. Dicts & sets",
    body: `<p>A <b>dict</b> (dictionary) maps <b>keys</b> to <b>values</b>, like a phone book maps names to numbers: <code>ages = {"Ada": 36, "Sam": 20}</code>, then <code>ages["Ada"]</code> is 36. A <b>set</b> is a collection of unique items with no order: <code>{1, 2, 3}</code>.</p>
      <h3>Why they're fast</h3>
      <p>Both are <b>hash tables</b>: Python turns each key into a number (its <i>hash</i>) that says where to store it, so finding a key doesn't mean searching through everything. Insert, lookup and delete take about the same time however big the dict is: O(1) on average (see the ${BIGO_LINK}). Keys must be <b>hashable</b>, which in practice means unchangeable: strings, numbers and tuples work; lists don't.</p>
      <h3>The everyday tools</h3>
      <ul><li><code>d.get(k, default)</code> returns a default instead of failing on a missing key.</li>
      <li><code>for k, v in d.items():</code> loops over keys and values together. Dicts keep insertion order. Don't add or remove keys while looping over a dict.</li>
      <li><code>collections.Counter(items)</code> counts things; <code>defaultdict(list)</code> groups them.</li>
      <li>Sets support <code>|</code> (union), <code>&amp;</code> (in both), <code>-</code> (difference), and fast <code>x in s</code>.</li></ul>
      <h3>Worked example: counting words</h3>
      <ol><li>Start with an empty dict: <code>counts = {}</code>.</li>
      <li>For each word, <code>counts[w] = counts.get(w, 0) + 1</code>: look up the current count (0 if the word is new), add 1, store it back.</li>
      <li>For <code>"the cat the"</code>, counts goes <code>{"the": 1}</code>, then <code>{"the": 1, "cat": 1}</code>, then <code>{"the": 2, "cat": 1}</code>.</li></ol>
      <p>Counting, grouping, "have I seen this before?" and caching results are the most common uses in interviews.</p>`,
    example: `ages = {"Ada": 36, "Sam": 20}
print(ages["Ada"], ages.get("Bob", "unknown"))

counts = {}
for w in "the cat the".split():
    counts[w] = counts.get(w, 0) + 1
print(counts)

from collections import Counter, defaultdict
print(Counter("mississippi").most_common(2))
groups = defaultdict(list)
for w in ["eat", "tea", "tan"]:
    groups["".join(sorted(w))].append(w)
print(dict(groups))
print({1, 2, 3} & {2, 3, 4})
`,
    practice: [
      { why: "`items()` gives the key and value together, instead of looking every value up again.",
        bad: `for k in ages.keys():
    print(k, ages[k])       # a second lookup each time`,
        good: `for name, age in ages.items():
    print(name, age)` },
      { why: "`get` returns a default for a missing key in one call.",
        bad: `if key in config:
    port = config[key]
else:
    port = 8080`,
        good: `port = config.get(key, 8080)` },
      { why: "Deleting keys while looping over a dict raises `RuntimeError`. Build a new dict with the keys you keep.",
        bad: `for k in stock:
    if stock[k] == 0:
        del stock[k]        # RuntimeError: dict changed size`,
        good: `stock = {k: n for k, n in stock.items() if n > 0}` },
    ],
    exercises: [
      { key: "phone", prompt: "Write phone_for(book, name) that returns the person's number from the dict, or \"unknown\" if they're not in it.",
        example: `phone_for({"Ada": "555-1234"}, "Ada") returns "555-1234"\nphone_for({"Ada": "555-1234"}, "Bob") returns "unknown"`,
        hint: "`book.get(name, \"unknown\")` does both cases in one call.",
        starter: "def phone_for(book, name):\n    pass\n",
        tests: `book = {"Ada": "555-1234", "Sam": "555-9876"}
assert phone_for(book, "Ada") == "555-1234"
assert phone_for(book, "Bob") == "unknown"
assert phone_for({}, "Ada") == "unknown"`,
        solution: `def phone_for(book, name):
    return book.get(name, "unknown")` },
      { key: "invert", prompt: "Write invert(d) that returns a new dict with the keys and values swapped.",
        example: `invert({"a": 1, "b": 2}) returns {1: "a", 2: "b"}`,
        hint: "Start with an empty dict, loop `for k, v in d.items():` and set `out[v] = k`.",
        starter: "def invert(d):\n    pass\n",
        tests: `assert invert({"a": 1, "b": 2}) == {1: "a", 2: "b"}
assert invert({}) == {}`,
        solution: `def invert(d):
    out = {}
    for k, v in d.items():
        out[v] = k
    return out` },
      { key: 0, prompt: "Write word_count(text) that returns a dict of each lowercase word and how many times it appears (split on whitespace).",
        example: `word_count("the cat The dog") returns {"the": 2, "cat": 1, "dog": 1}`,
        hint: "Follow the worked example, but lowercase the text first with `text.lower()`.",
        starter: "def word_count(text):\n    pass\n",
        tests: `assert word_count('the cat The dog') == {'the': 2, 'cat': 1, 'dog': 1}
assert word_count('') == {}`,
        solution: `def word_count(text):
    counts = {}
    for w in text.lower().split():
        counts[w] = counts.get(w, 0) + 1
    return counts` },
      { key: 1, prompt: "Write first_unique_char(s) that returns the position of the first character that appears only once, or -1 if there isn't one.",
        example: `first_unique_char("leetcode") returns 0\nfirst_unique_char("aabb") returns -1`,
        hint: "Two passes: first count every character (a dict or `Counter`), then loop with `enumerate(s)` and return the first position whose count is 1.",
        starter: "def first_unique_char(s):\n    pass\n",
        tests: `assert first_unique_char('leetcode') == 0
assert first_unique_char('loveleetcode') == 2
assert first_unique_char('aabb') == -1`,
        solution: `from collections import Counter

def first_unique_char(s):
    counts = Counter(s)
    for i, c in enumerate(s):
        if counts[c] == 1:
            return i
    return -1` },
    ],
  },
  {
    id: "functions-more", title: "9. Functions: going further", label: "Functions: going further",
    body: `<p>This lesson builds on <button class="link-btn inline-link" data-ref="py:functions">Functions</button>. These features are common in real code and in interviews, but you can write plenty of working programs without them.</p>
      <ul><li><b>Default values are made once.</b> <code>def f(x, acc=[])</code> creates that list a single time, when the function is defined, and every call shares it: a classic bug. Use <code>acc=None</code> and create the list inside.</li>
      <li><b>Any number of arguments.</b> <code>*args</code> collects extra positional arguments into a tuple; <code>**kwargs</code> collects extra named ones into a dict. Parameters after a bare <code>*</code> must be named: <code>def f(a, *, b)</code> is called as <code>f(1, b=2)</code>.</li>
      <li><b>Scope</b> is where a name is visible. Python looks a name up in this order, called <b>LEGB</b>: Local (inside this function), Enclosing (an outer function), Global (the file), Built-in (like <code>len</code>).</li>
      <li><b>Closures.</b> A function defined inside another can use the outer function's variables, even after the outer one has returned. That inner function plus the variables it remembers is a <b>closure</b>. To <i>change</i> (not just read) an outer variable, declare it <code>nonlocal</code>.</li>
      <li><b>Functions are values.</b> You can pass them as arguments (<code>sorted(xs, key=len)</code>), return them, and write short ones with <code>lambda x: x * 2</code>.</li>
      <li>Add type hints and docstrings; interviewers like readable signatures.</li></ul>
      <h3>Worked example: a counter</h3>
      <ol><li><code>counter()</code> sets <code>n = 0</code>, defines <code>inc</code>, and returns <code>inc</code> itself (not a call to it).</li>
      <li><code>c = counter()</code>: <code>c</code> is now the inner function, still holding on to its own <code>n</code>.</li>
      <li>Each <code>c()</code> runs <code>nonlocal n; n += 1</code>, so it returns 1, then 2, ... A second <code>counter()</code> gets a separate <code>n</code>.</li></ol>`,
    example: `def add_item(x, bucket=None):
    bucket = [] if bucket is None else bucket
    bucket.append(x)
    return bucket

print(add_item(1), add_item(2))   # [1] [2]

def counter():
    n = 0
    def inc():
        nonlocal n
        n += 1
        return n
    return inc

c = counter(); c(); print(c())   # 2

def total(*nums, scale=1):
    return sum(nums) * scale
print(total(1, 2, 3, scale=10))   # 60
`,
    practice: [
      { why: "A lambda assigned to a name is just a worse `def`: no name in tracebacks, no docstring, one expression only (PEP 8 says so too).",
        bad: `square = lambda x: x * x`,
        good: `def square(x):
    return x * x` },
      { why: "A closure looks up `i` when it's called, not when it's made, so every function sees the last value. Bind the current value with a default argument.",
        bad: `funcs = [lambda: i for i in range(3)]
print([f() for f in funcs])     # [2, 2, 2]`,
        good: `funcs = [lambda i=i: i for i in range(3)]
print([f() for f in funcs])     # [0, 1, 2]` },
      { why: "A bare `True` at the call site says nothing. A keyword-only argument (after `*`) must be named, so the call explains itself.",
        bad: `def connect(host, port, use_ssl):
    ...

connect("example.com", 443, True)          # True what?`,
        good: `def connect(host, port, *, use_ssl=False):
    ...

connect("example.com", 443, use_ssl=True)` },
    ],
    exercises: [
      { key: "add_item", prompt: "Write add_item(x, items=None) that appends x to items and returns the list. When items isn't given, start a NEW empty list each call.",
        example: "add_item(1) returns [1]\nadd_item(2) returns [2] (not [1, 2])\nadd_item(3, [0]) returns [0, 3]",
        hint: "Inside the function: `if items is None: items = []`. Never write `items=[]` in the signature.",
        starter: "def add_item(x, items=None):\n    pass\n",
        tests: `assert add_item(1) == [1]
assert add_item(2) == [2], "each call without items needs its own new list"
assert add_item(3, [0]) == [0, 3]`,
        solution: `def add_item(x, items=None):
    if items is None:
        items = []
    items.append(x)
    return items` },
      { key: 1, prompt: "Write total(*nums, scale=1) that returns the sum of all the numbers passed in, multiplied by scale.",
        example: "total(1, 2, 3) returns 6\ntotal(1, 2, 3, scale=2) returns 12\ntotal() returns 0",
        hint: "`nums` is a tuple of every positional argument, so `sum(nums) * scale` does it.",
        starter: "def total(*nums, scale=1):\n    pass\n",
        tests: `assert total(1, 2, 3) == 6
assert total(1, 2, 3, scale=2) == 12
assert total() == 0`,
        solution: `def total(*nums, scale=1):
    return sum(nums) * scale` },
      { key: 0, prompt: "Write make_counter(start=0) that returns a function; each call to that function returns the next number (start, start+1, ...). Two counters must count independently.",
        example: "a = make_counter()\na(), a(), a() returns 0, 1, 2\nb = make_counter(10)\nb() returns 10",
        hint: "Follow the worked example: store `n = start` in make_counter, define an inner function that saves the current n, adds 1 (with `nonlocal n`), and returns the saved value. Return the inner function.",
        starter: "def make_counter(start=0):\n    pass\n",
        tests: `a = make_counter(); b = make_counter(10)
assert (a(), a(), a()) == (0, 1, 2)
assert b() == 10 and a() == 3`,
        solution: `def make_counter(start=0):
    n = start
    def next_value():
        nonlocal n
        value = n
        n += 1
        return value
    return next_value` },
    ],
  },
  {
    id: "comprehensions", title: "10. Comprehensions, iterators & generators",
    body: `<p>A <b>comprehension</b> builds a list, dict or set in one expression. <code>[x * x for x in nums]</code> reads as "x squared, for each x in nums". It's the same as a loop that appends, written more compactly.</p>
      <ul><li><code>[f(x) for x in xs if cond]</code>, <code>{k: v for ...}</code>, <code>{x for ...}</code>. Keep them to one readable line.</li>
      <li>A <b>generator</b> produces values one at a time, only when asked, instead of building the whole list in memory. Write one with <code>yield</code> in a function, or as a generator expression: <code>sum(x*x for x in xs)</code>.</li>
      <li><code>any(...)</code>, <code>all(...)</code>, <code>min/max(key=...)</code>, <code>map</code>, <code>filter</code>, <code>zip</code>, <code>enumerate</code>, <code>reversed</code>.</li></ul>
      <h3>Worked example: from loop to comprehension</h3>
      <pre>result = []
for x in nums:
    if x % 2 == 0:
        result.append(x * x)</pre>
      <p>Take the appended expression (<code>x * x</code>), then the <code>for</code> line, then the <code>if</code> line, and put them in square brackets: <code>[x * x for x in nums if x % 2 == 0]</code>.</p>`,
    example: `print([x * x for x in range(6) if x % 2 == 0])
print({w: len(w) for w in ["a", "bb"]})

def evens():
    n = 0
    while True:
        yield n
        n += 2

g = evens()
print([next(g) for _ in range(4)])
`,
    practice: [
      { why: "A comprehension builds the list in one expression: shorter, a little faster, and it reads as \"the squares of the evens\".",
        bad: `squares = []
for x in nums:
    if x % 2 == 0:
        squares.append(x * x)`,
        good: `squares = [x * x for x in nums if x % 2 == 0]` },
      { why: "`sum`, `max`, `any` and friends accept a generator, so there's no need to build a whole list in memory first.",
        bad: `total = sum([x * x for x in nums])     # builds a full list first`,
        good: `total = sum(x * x for x in nums)       # one item at a time` },
      { why: "Comprehensions are for simple transformations. Past two loops or a condition per level, plain loops are easier to read and debug.",
        bad: `pairs = [(r, c) for r, row in enumerate(grid) for c, v in enumerate(row)
         if v and r % 2 if c > r]`,
        good: `pairs = []
for r, row in enumerate(grid):
    for c, v in enumerate(row):
        if v and r % 2 and c > r:
            pairs.append((r, c))` },
    ],
    exercises: [
      { key: "lengths", prompt: "Write lengths(words) that returns a list of the length of each word, using a list comprehension.",
        example: `lengths(["a", "bb", "ccc"]) returns [1, 2, 3]`,
        hint: "`[len(w) for w in words]`.",
        starter: "def lengths(words):\n    pass\n",
        tests: `assert lengths(["a", "bb", "ccc"]) == [1, 2, 3]
assert lengths([]) == []`,
        solution: `def lengths(words):
    return [len(w) for w in words]` },
      { key: 0, prompt: "Write squares_of_evens(nums) that returns the squares of the even numbers, using a list comprehension.",
        example: "squares_of_evens([1, 2, 3, 4]) returns [4, 16]",
        hint: "This is the worked example: `[x * x for x in nums if x % 2 == 0]`.",
        starter: "def squares_of_evens(nums):\n    pass\n",
        tests: `assert squares_of_evens([1,2,3,4]) == [4,16]
assert squares_of_evens([]) == []`,
        solution: `def squares_of_evens(nums):
    return [x * x for x in nums if x % 2 == 0]` },
      { key: "word_lengths", prompt: "Write word_lengths(words) that returns a dict from each word to its length, using a dict comprehension.",
        example: `word_lengths(["hi", "hey"]) returns {"hi": 2, "hey": 3}`,
        hint: "Curly brackets with `key: value`: `{w: len(w) for w in words}`.",
        starter: "def word_lengths(words):\n    pass\n",
        tests: `assert word_lengths(["hi", "hey"]) == {"hi": 2, "hey": 3}
assert word_lengths([]) == {}`,
        solution: `def word_lengths(words):
    return {w: len(w) for w in words}` },
      { key: 1, prompt: "Write fib(n), a GENERATOR (use yield) that produces the first n Fibonacci numbers: 0, 1, 1, 2, 3, 5, ... (each number is the sum of the two before it).",
        example: "list(fib(7)) returns [0, 1, 1, 2, 3, 5, 8]",
        hint: "Keep two variables, `a, b = 0, 1`. Loop n times: `yield a`, then `a, b = b, a + b`.",
        starter: "def fib(n):\n    pass\n",
        tests: `import types
g = fib(7)
assert isinstance(g, types.GeneratorType), 'use yield'
assert list(g) == [0,1,1,2,3,5,8]
assert list(fib(0)) == []`,
        solution: `def fib(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b` },
    ],
  },
  {
    id: "classes", title: "11. Classes & OOP",
    body: `<p>A <b>class</b> is a blueprint for making objects that bundle data with the functions that work on it. Each object made from the class is an <b>instance</b>; functions defined inside a class are called <b>methods</b>.</p>
      <ul><li><code>__init__</code> runs when you create an instance and sets up its data. <code>self</code> is the instance itself, written explicitly as the first parameter of every method.</li>
      <li>"Dunder" (double underscore) methods hook into Python's syntax: <code>__len__</code> makes <code>len(x)</code> work, <code>__repr__</code> controls how it prints, <code>__eq__</code> defines <code>==</code>.</li>
      <li>Use <code>@dataclass</code> for plain data holders. Use <code>@property</code> for computed attributes.</li>
      <li>Interview staples built from classes: <code>ListNode</code>, <code>TreeNode</code>, <code>Trie</code>, <code>LRUCache</code>, <code>MinStack</code>.</li>
      <li>Prefer composition over inheritance; know that <code>super().__init__()</code> calls the parent.</li></ul>
      <h3>Worked example</h3>
      <ol><li><code>r = Rectangle(3, 4)</code> creates an instance and calls <code>__init__(r, 3, 4)</code>, which stores <code>self.width = 3</code>, <code>self.height = 4</code>.</li>
      <li><code>r.area()</code> calls the method with <code>self</code> set to <code>r</code>, so it returns <code>3 * 4</code>.</li></ol>`,
    example: `class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

r = Rectangle(3, 4)
print(r.width, r.area())   # 3 12

class ListNode:
    def __init__(self, val=0, next=None):
        self.val, self.next = val, next
    def __repr__(self):
        return f"ListNode({self.val})"

head = ListNode(1, ListNode(2))
print(head, head.next)
`,
    practice: [
      { why: "`@dataclass` writes `__init__`, `__repr__` and `__eq__` for you from the field list.",
        bad: `class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

    def __eq__(self, other):
        return (self.x, self.y) == (other.x, other.y)`,
        good: `from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int` },
      { why: "Python doesn't need getter methods. Use a plain attribute, and switch to `@property` later if you need a rule, without changing callers.",
        bad: `class User:
    def __init__(self, name):
        self._name = name

    def get_name(self):
        return self._name

print(user.get_name())`,
        good: `class User:
    def __init__(self, name):
        self.name = name

print(user.name)` },
      { why: "`type(x) == Dog` is false for a subclass of `Dog`. `isinstance` respects inheritance.",
        bad: `if type(pet) == Dog:        # false for a Puppy(Dog)
    pet.bark()`,
        good: `if isinstance(pet, Dog):    # true for Dog and its subclasses
    pet.bark()` },
    ],
    exercises: [
      { key: "rectangle", prompt: "Write a class Rectangle created as Rectangle(width, height), with methods area() and perimeter().",
        example: "r = Rectangle(3, 4)\nr.area() returns 12\nr.perimeter() returns 14",
        hint: "Store both values in `__init__` (`self.width = width`, ...). Perimeter is `2 * (width + height)`. Every method takes `self` first.",
        starter: "class Rectangle:\n    pass\n",
        tests: `r = Rectangle(3, 4)
assert r.area() == 12
assert r.perimeter() == 14
assert Rectangle(1, 1).area() == 1`,
        solution: `class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)` },
      { key: "tally", prompt: "Write a class Tally with a count attribute that starts at 0, a method add() that adds 1 to it, and a method reset() that sets it back to 0.",
        example: "t = Tally()\nt.add(); t.add()\nt.count is 2\nt.reset()\nt.count is 0",
        hint: "Set `self.count = 0` in `__init__`. `add` does `self.count += 1`.",
        starter: "class Tally:\n    pass\n",
        tests: `t = Tally()
assert t.count == 0
t.add(); t.add()
assert t.count == 2
t.reset()
assert t.count == 0
assert Tally().count == 0, "each Tally has its own count"`,
        solution: `class Tally:
    def __init__(self):
        self.count = 0

    def add(self):
        self.count += 1

    def reset(self):
        self.count = 0` },
      { key: 0, prompt: "Write a class Stack with push(x), pop(), peek(), is_empty() and len() support. pop and peek on an empty stack must raise IndexError.",
        example: "s = Stack(); s.push(1); s.push(2)\ns.peek() returns 2, len(s) is 2\ns.pop() returns 2",
        hint: "Keep a list in `self.items`. push appends, pop uses `self.items.pop()`, peek returns `self.items[-1]` (both raise IndexError on an empty list by themselves). `__len__` returns `len(self.items)`.",
        starter: "class Stack:\n    pass\n",
        tests: `s = Stack()
assert s.is_empty() and len(s) == 0
s.push(1); s.push(2)
assert s.peek() == 2 and len(s) == 2
assert s.pop() == 2 and s.pop() == 1
for fn in (s.pop, s.peek):
    try:
        fn(); raise SystemExit('expected IndexError')
    except IndexError:
        pass`,
        solution: `class Stack:
    def __init__(self):
        self.items = []

    def push(self, x):
        self.items.append(x)

    def pop(self):
        return self.items.pop()

    def peek(self):
        return self.items[-1]

    def is_empty(self):
        return not self.items

    def __len__(self):
        return len(self.items)` },
    ],
  },
  {
    id: "errors", title: "12. Errors & exceptions",
    body: `<p>When something goes wrong at run time, Python <b>raises</b> an <b>exception</b>: an object describing the problem, such as <code>ValueError</code> or <code>KeyError</code>. If nothing handles it, the program stops and prints the error.</p>
      <ul><li><code>try / except SpecificError / else / finally</code> handles an exception. Catch the narrowest exception you can; never a bare <code>except:</code>.</li>
      <li><code>raise ValueError("message")</code> signals bad input from your own code. Python favours EAFP ("easier to ask forgiveness than permission"): try the operation and handle the failure, rather than checking everything first.</li>
      <li>Context managers (<code>with open(...) as f:</code>) guarantee cleanup.</li>
      <li>In interviews: state your assumptions about invalid input, and handle empty input explicitly.</li></ul>
      <h3>Worked example</h3>
      <ol><li><code>parse("42")</code>: <code>int("42")</code> works, so the <code>try</code> block returns 42 and the <code>except</code> is skipped.</li>
      <li><code>parse("4x2")</code>: <code>int</code> raises <code>ValueError</code>. Python jumps to <code>except ValueError:</code>, which returns <code>None</code> instead of crashing.</li></ol>`,
    example: `def parse(s):
    try:
        return int(s)
    except ValueError:
        return None

print(parse("42"), parse("4x2"))
try:
    {}["missing"]
except KeyError as e:
    print("KeyError", e)
`,
    practice: [
      { why: "A bare `except:` catches everything, even Ctrl+C and typos like `NameError`. Name the exception you expect.",
        bad: `try:
    n = int(text)
except:
    n = 0`,
        good: `try:
    n = int(text)
except ValueError:
    n = 0` },
      { why: "Raising a new error inside `except` without `from` buries the original cause. `raise ... from e` keeps both in the traceback.",
        bad: `try:
    port = int(config["port"])
except KeyError:
    raise ConfigError("port is missing")`,
        good: `try:
    port = int(config["port"])
except KeyError as e:
    raise ConfigError("port is missing") from e` },
      { why: "Checking first and then acting has a gap: the file can vanish in between. Python's style is to try it and handle the failure (EAFP).",
        bad: `import os

if os.path.exists(path):
    with open(path) as f:       # can still fail
        data = f.read()`,
        good: `try:
    with open(path) as f:
        data = f.read()
except FileNotFoundError:
    data = ""` },
    ],
    exercises: [
      { key: 0, prompt: "Write safe_div(a, b) that returns a divided by b, or None when b is 0.",
        example: "safe_div(6, 3) returns 2.0\nsafe_div(1, 0) returns None",
        hint: "Either check `if b == 0: return None` first, or wrap `a / b` in `try` and catch `ZeroDivisionError`.",
        starter: "def safe_div(a, b):\n    pass\n",
        tests: `assert safe_div(6, 3) == 2
assert safe_div(1, 0) is None`,
        solution: `def safe_div(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None` },
      { key: 1, prompt: "Write parse_int(s, default=0) that returns int(s), or default when s isn't a valid whole number. s may also be None.",
        example: `parse_int("12") returns 12\nparse_int("abc") returns 0\nparse_int(None, -1) returns -1`,
        hint: "`int(\"abc\")` raises ValueError and `int(None)` raises TypeError. Catch both: `except (ValueError, TypeError):`.",
        starter: "def parse_int(s, default=0):\n    pass\n",
        tests: `assert parse_int('12') == 12
assert parse_int('abc') == 0
assert parse_int(None, -1) == -1
assert parse_int(' 7 ') == 7`,
        solution: `def parse_int(s, default=0):
    try:
        return int(s)
    except (ValueError, TypeError):
        return default` },
      { key: "check_age", prompt: "Write check_age(age) that returns age when it's 0 or more, and raises ValueError when it's negative.",
        example: "check_age(30) returns 30\ncheck_age(-1) raises ValueError",
        hint: "`if age < 0: raise ValueError(\"age can't be negative\")`, then return age.",
        starter: "def check_age(age):\n    pass\n",
        tests: `assert check_age(30) == 30
assert check_age(0) == 0
try:
    check_age(-1)
    raise SystemExit("check_age(-1) should raise ValueError")
except ValueError:
    pass`,
        solution: `def check_age(age):
    if age < 0:
        raise ValueError("age can't be negative")
    return age` },
    ],
  },
  {
    id: "stdlib", title: "13. Standard library for interviews",
    body: `<p>Python ships with a large <b>standard library</b>: modules you can <code>import</code> without installing anything. A few of them come up in almost every coding interview.</p>
      <ul><li><code>collections</code>: <code>deque</code> (fast adds and removes at both ends), <code>Counter</code>, <code>defaultdict</code>, <code>OrderedDict</code>.</li>
      <li><code>heapq</code>: a <b>min-heap</b>, a list arranged so the smallest item is always at the front (<code>heappush, heappop, nlargest, nsmallest</code>). Negate values for a max-heap; push tuples for priorities.</li>
      <li><code>bisect</code>: <code>bisect_left/right</code> for binary search on sorted lists.</li>
      <li><code>functools.cache</code> for memoization (remembering results of earlier calls); <code>itertools</code>: <code>permutations, combinations, product, accumulate</code>.</li>
      <li><code>math.inf</code>, <code>sys.setrecursionlimit</code> (default depth ~1000), <code>string.ascii_lowercase</code>.</li></ul>
      <h3>Worked example</h3>
      <p><code>Counter("banana")</code> counts each letter: <code>{"a": 3, "n": 2, "b": 1}</code>. <code>.most_common(1)</code> returns the top one as a list of pairs, <code>[("a", 3)]</code>, so <code>[0][0]</code> picks out <code>"a"</code>.</p>`,
    example: `import heapq, bisect
from collections import deque, Counter
print(Counter("banana").most_common(1)[0][0])   # a
h = []
for x in [5, 1, 4]: heapq.heappush(h, x)
print(heapq.heappop(h), heapq.nlargest(2, [5, 1, 4]))
print(bisect.bisect_left([1, 3, 5, 7], 5))
q = deque([1, 2]); q.appendleft(0); print(q.popleft(), q.pop())
`,
    practice: [
      { why: "`itertools.combinations` gives every pair once, with no index arithmetic to get wrong.",
        bad: `for i in range(len(items)):
    for j in range(i + 1, len(items)):
        check(items[i], items[j])`,
        good: `from itertools import combinations

for a, b in combinations(items, 2):
    check(a, b)` },
      { why: "Re-sorting after every append is O(n log n) per insert. `bisect.insort` puts the item in place: O(log n) to find the spot.",
        bad: `scores.append(x)
scores.sort()                       # O(n log n) every time`,
        good: `import bisect

bisect.insort(scores, x)            # stays sorted` },
      { why: "A made-up big number fails once real data is bigger. `math.inf` is larger than any number.",
        bad: `best = 999999                       # what if a cost is bigger?
for c in costs:
    best = min(best, c)`,
        good: `import math

best = math.inf
for c in costs:
    best = min(best, c)` },
    ],
    exercises: [
      { key: "most_common", prompt: "Write most_common_char(s) that returns the character that appears most often, using collections.Counter.",
        example: `most_common_char("banana") returns "a"`,
        hint: "Follow the worked example: `Counter(s).most_common(1)[0][0]`.",
        starter: "from collections import Counter\n\ndef most_common_char(s):\n    pass\n",
        tests: `assert most_common_char("banana") == "a"
assert most_common_char("x") == "x"
assert most_common_char("abbccc") == "c"`,
        solution: `from collections import Counter

def most_common_char(s):
    return Counter(s).most_common(1)[0][0]` },
      { key: "smallest_k", prompt: "Write smallest_k(nums, k) that returns the k smallest numbers in increasing order, using heapq.",
        example: "smallest_k([5, 1, 4, 2], 2) returns [1, 2]",
        hint: "`heapq.nsmallest(k, nums)` returns them already sorted.",
        starter: "import heapq\n\ndef smallest_k(nums, k):\n    pass\n",
        tests: `assert smallest_k([5, 1, 4, 2], 2) == [1, 2]
assert smallest_k([3], 1) == [3]
assert smallest_k([4, 4, 1], 3) == [1, 4, 4]`,
        solution: `import heapq

def smallest_k(nums, k):
    return heapq.nsmallest(k, nums)` },
      { key: 0, prompt: "Write merge_sorted(a, b) that returns one sorted list from two sorted lists, using heapq.merge.",
        example: "merge_sorted([1, 4, 7], [2, 3, 9]) returns [1, 2, 3, 4, 7, 9]",
        hint: "`heapq.merge(a, b)` gives the items in order, but as an iterator: wrap it in `list(...)`.",
        starter: "import heapq\n\ndef merge_sorted(a, b):\n    pass\n",
        tests: `assert merge_sorted([1,4,7],[2,3,9]) == [1,2,3,4,7,9]
assert merge_sorted([], [1]) == [1]`,
        solution: `import heapq

def merge_sorted(a, b):
    return list(heapq.merge(a, b))` },
      { key: 1, prompt: "Write insert_position(sorted_list, x) that returns the index where x should be inserted to keep the list sorted (the leftmost such place), using bisect.",
        example: "insert_position([1, 3, 5, 7], 4) returns 2",
        hint: "`bisect.bisect_left(sorted_list, x)` is exactly this.",
        starter: "import bisect\n\ndef insert_position(sorted_list, x):\n    pass\n",
        tests: `assert insert_position([1,3,5,7], 5) == 2
assert insert_position([1,3,5,7], 4) == 2
assert insert_position([], 1) == 0`,
        solution: `import bisect

def insert_position(sorted_list, x):
    return bisect.bisect_left(sorted_list, x)` },
    ],
  },
  {
    id: "recursion", title: "14. Recursion & Big-O",
    body: `<p>A <b>recursive</b> function is one that calls itself on a smaller version of the same problem. Every recursive function needs a <b>base case</b>: an input small enough to answer directly, which stops the calls.</p>
      <h3>Worked example: factorial</h3>
      <p><code>factorial(n)</code> is 1 &times; 2 &times; ... &times; n. Notice that <code>factorial(4)</code> is <code>4 * factorial(3)</code>:</p>
      <ol><li>Base case: <code>factorial(0)</code> is 1.</li>
      <li><code>factorial(3)</code> calls <code>factorial(2)</code>, which calls <code>factorial(1)</code>, which calls <code>factorial(0)</code> and gets 1.</li>
      <li>The answers come back up: 1 &times; 1 = 1, then 2 &times; 1 = 2, then 3 &times; 2 = 6.</li></ol>
      <p>Each waiting call takes space on the <b>call stack</b>, so depth matters: Python's default limit is about 1000 calls deep.</p>
      <h3>How fast is it? Big-O</h3>
      <p>Big-O describes how the work grows as the input grows. The full ${BIGO_LINK} comes right after this track; here's the short version:</p>
      <table><tr><th>Big-O</th><th>Typical example</th></tr>
      <tr><td>O(1)</td><td>dict lookup, array index</td></tr><tr><td>O(log n)</td><td>binary search, balanced tree height</td></tr>
      <tr><td>O(n)</td><td>single pass, hash-map approach</td></tr><tr><td>O(n log n)</td><td>sorting, heap of n items</td></tr>
      <tr><td>O(n²)</td><td>nested loops, brute-force pairs</td></tr><tr><td>O(2ⁿ) / O(n!)</td><td>subsets / permutations (backtracking)</td></tr></table>
      <p>Always state time AND space. Drop constants, keep the dominant term. Memoizing a recursion with <code>@cache</code> (remembering answers already worked out) turns exponential into polynomial when subproblems overlap.</p>`,
    example: `def factorial(n):
    if n == 0:          # base case
        return 1
    return n * factorial(n - 1)

print(factorial(5))     # 120

from functools import cache

@cache
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(80))   # instant with the cache
`,
    practice: [
      { why: "`@cache` needs hashable arguments, so passing a list raises `TypeError`. Cache on the index only, and read the list from the enclosing function.",
        bad: `from functools import cache

@cache
def best(nums, i):          # TypeError: unhashable type: 'list'
    if i >= len(nums):
        return 0
    return max(best(nums, i + 1), nums[i] + best(nums, i + 2))`,
        good: `from functools import cache

def rob(nums):
    @cache
    def best(i):            # only the index is cached
        if i >= len(nums):
            return 0
        return max(best(i + 1), nums[i] + best(i + 2))
    return best(0)` },
      { why: "Raising the recursion limit just moves the crash: the interpreter's own stack can still overflow. For deep inputs, loop with an explicit stack.",
        bad: `import sys
sys.setrecursionlimit(10**6)        # may crash the interpreter instead

def depth(node):
    return 0 if not node else 1 + depth(node.next)`,
        good: `def depth(node):
    n = 0
    while node:                     # no recursion, no limit
        n += 1
        node = node.next
    return n` },
      { why: "`path + [x]` copies the whole path on every call. Append, recurse, then pop: copy only when you store a result.",
        bad: `def subsets(nums, i=0, path=[]):
    if i == len(nums):
        return [path]
    return (subsets(nums, i + 1, path + [nums[i]])
            + subsets(nums, i + 1, path))`,
        good: `def subsets(nums):
    res, path = [], []
    def go(i):
        if i == len(nums):
            res.append(path[:])     # copy only here
            return
        path.append(nums[i])
        go(i + 1)
        path.pop()                  # undo
        go(i + 1)
    go(0)
    return res` },
    ],
    exercises: [
      { key: "factorial", prompt: "Write factorial(n) recursively: 1 × 2 × ... × n, with factorial(0) being 1.",
        example: "factorial(5) returns 120\nfactorial(0) returns 1",
        hint: "This is the worked example: base case `if n == 0: return 1`, otherwise `return n * factorial(n - 1)`.",
        starter: "def factorial(n):\n    pass\n",
        tests: `assert factorial(0) == 1
assert factorial(1) == 1
assert factorial(5) == 120`,
        solution: `def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)` },
      { key: "sum_digits", prompt: "Write sum_digits(n) recursively: the sum of the digits of a non-negative whole number.",
        example: "sum_digits(1234) returns 10",
        hint: "`n % 10` is the last digit and `n // 10` is the number without it. Base case: a number below 10 is its own digit sum.",
        starter: "def sum_digits(n):\n    pass\n",
        tests: `assert sum_digits(1234) == 10
assert sum_digits(7) == 7
assert sum_digits(0) == 0
assert sum_digits(1001) == 2`,
        solution: `def sum_digits(n):
    if n < 10:
        return n
    return n % 10 + sum_digits(n // 10)` },
      { key: 0, prompt: "Write power(x, n) that computes x to the power n (a whole number, 0 or more) recursively in O(log n): when n is even, compute x to the n/2 once and square it. Don't use ** or pow.",
        example: "power(2, 10) returns 1024\npower(3, 0) returns 1",
        hint: "Base case: n == 0 gives 1. Otherwise `half = power(x, n // 2)`; return `half * half` if n is even, or `half * half * x` if it's odd.",
        starter: "def power(x, n):\n    pass\n",
        tests: `assert power(2, 10) == 1024
assert power(3, 0) == 1
assert power(5, 1) == 5
assert power(2, 30) == 2**30`,
        solution: `def power(x, n):
    if n == 0:
        return 1
    half = power(x, n // 2)
    if n % 2 == 0:
        return half * half
    return half * half * x` },
      { key: 1, prompt: "Write flatten(nested) that turns lists nested to any depth into one flat list.",
        example: "flatten([1, [2, [3, 4]], 5]) returns [1, 2, 3, 4, 5]",
        hint: "Loop over the items. If an item is a list (`isinstance(item, list)`), add everything from `flatten(item)`; otherwise append the item.",
        starter: "def flatten(nested):\n    pass\n",
        tests: `assert flatten([1,[2,[3,4]],5]) == [1,2,3,4,5]
assert flatten([]) == []
assert flatten([[[]]]) == []`,
        solution: `def flatten(nested):
    out = []
    for item in nested:
        if isinstance(item, list):
            out.extend(flatten(item))
        else:
            out.append(item)
    return out` },
    ],
  },
  {
    id: "testing", title: "15. Testing your own code",
    body: `<p>Writing code is half the job; checking that it works is the other half. Before and after coding in an interview, test deliberately:</p>
      <ul><li><b>Happy path</b> (a normal input) first, then <b>boundaries</b>: empty input, one element, duplicates, negatives, zero, very large values, already sorted / reverse sorted.</li>
      <li>Trace one example by hand through your code, line by line, before saying "done".</li>
      <li>Outside interviews: <code>assert</code> statements, <code>unittest</code> or <code>pytest</code> (<code>assert f(x) == y</code> in <code>test_*.py</code>, <code>pytest.mark.parametrize</code> for tables of cases).</li>
      <li>The exercises on this page are tested the same way: the tests are the kind of edge cases an interviewer will probe.</li></ul>
      <h3>Worked example</h3>
      <p>For <code>clamp(x, lo, hi)</code> (keep x inside lo..hi), good test cases are: a value inside the range, one below it, one above it, and the exact edges. The example below runs a small table of cases and prints <code>ok</code> or <code>FAIL</code> for each.</p>`,
    example: `def clamp(x, lo, hi):
    return max(lo, min(x, hi))

cases = [((5, 0, 10), 5), ((-1, 0, 10), 0), ((11, 0, 10), 10), ((0, 0, 0), 0)]
for args, want in cases:
    got = clamp(*args)
    print("ok" if got == want else "FAIL", args, got, want)
`,
    practice: [
      { why: "Printing means you have to read the output and judge it every time. An `assert` checks it for you and fails loudly.",
        bad: `print(total([1, 2, 3]))     # look: is it 6?`,
        good: `assert total([1, 2, 3]) == 6` },
      { why: "The happy path is the case least likely to break. Test the edges: empty, one item, negatives, duplicates.",
        bad: `assert total([1, 2, 3]) == 6`,
        good: `assert total([1, 2, 3]) == 6
assert total([]) == 0               # empty
assert total([5]) == 5              # one item
assert total([-1, 1]) == 0          # negatives` },
      { why: "Decimal results are approximations, so `==` can fail on a correct answer. Compare with a tolerance.",
        bad: `assert average([0.1, 0.2]) == 0.15     # fails: 0.15000000000000002`,
        good: `import math

assert math.isclose(average([0.1, 0.2]), 0.15)` },
    ],
    exercises: [
      { key: "clamp", prompt: "Write clamp(x, lo, hi) that returns x if it's between lo and hi, lo if it's below, and hi if it's above.",
        example: "clamp(5, 0, 10) returns 5\nclamp(-1, 0, 10) returns 0\nclamp(11, 0, 10) returns 10",
        hint: "Two checks: `if x < lo: return lo`, `if x > hi: return hi`, otherwise return x. (Or `max(lo, min(x, hi))`.)",
        starter: "def clamp(x, lo, hi):\n    pass\n",
        tests: `assert clamp(5, 0, 10) == 5
assert clamp(-1, 0, 10) == 0
assert clamp(11, 0, 10) == 10
assert clamp(0, 0, 10) == 0 and clamp(10, 0, 10) == 10, "the edges themselves are inside"`,
        solution: `def clamp(x, lo, hi):
    if x < lo:
        return lo
    if x > hi:
        return hi
    return x` },
      { key: 0, prompt: "Write is_leap_year(y): a year is a leap year if it's divisible by 4, except century years (divisible by 100), which are only leap years if divisible by 400. Think about which edge cases to test: 1900, 2000, 2024, 2100.",
        example: "is_leap_year(2024) returns True\nis_leap_year(1900) returns False\nis_leap_year(2000) returns True",
        hint: "Check the most specific rule first: divisible by 400 → True; else divisible by 100 → False; else divisible by 4 → True; else False.",
        starter: "def is_leap_year(y):\n    pass\n",
        tests: `assert is_leap_year(2024) is True
assert is_leap_year(1900) is False
assert is_leap_year(2000) is True
assert is_leap_year(2023) is False
assert is_leap_year(2100) is False`,
        solution: `def is_leap_year(y):
    if y % 400 == 0:
        return True
    if y % 100 == 0:
        return False
    return y % 4 == 0` },
      { key: "max_fix", prompt: "This largest(nums) has a bug that only shows up for some inputs. Run the tests to find the failing case, then fix it.",
        example: "largest([3, 7, 2]) returns 7\nlargest([-5, -2, -9]) returns -2",
        hint: "What happens when every number is negative? Starting `best` at 0 means it's never replaced. Start it at the first item, `nums[0]`, instead.",
        starter: "def largest(nums):\n    best = 0\n    for n in nums:\n        if n > best:\n            best = n\n    return best\n",
        tests: `assert largest([3, 7, 2]) == 7
assert largest([5]) == 5
assert largest([-5, -2, -9]) == -2, f"all negative: expected -2, got {largest([-5, -2, -9])}"`,
        solution: `def largest(nums):
    best = nums[0]
    for n in nums:
        if n > best:
            best = n
    return best` },
    ],
  },
];
// Pages renamed when the old Basics and Functions lessons were split, so old links still open.
const LESSON_ALIASES = { "py:basics": "py:types" };
// Saved exercise progress from before the split: old key -> new key (see migrateRef in js/app.js).
const REF_MOVED = { "basics-0": "loops-fizzbuzz", "functions-0": "functions-more-0", "functions-1": "functions-more-1" };
