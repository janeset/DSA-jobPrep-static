// "Python from zero": the beginner track, for people who have never programmed. Same shape as the
// Python LESSONS in refresher.js. body is trusted HTML (written here). Each exercise has a plain
// prompt, an example, a hint and a model answer; tests are Python asserts run in the browser (Pyodide).
const ZERO_LESSONS = [
  {
    id: "values", title: "1. Values and variables",
    body: `<p>A <b>program</b> is a list of instructions the computer follows, one line at a time, from top to bottom. This lesson covers the two things almost every line works with: <b>values</b> and <b>variables</b>.</p>
      <h3>Values</h3>
      <p>A value is a piece of data. You'll meet three kinds first:</p>
      <ul><li><b>Numbers</b>: <code>42</code>, <code>-7</code>, <code>3.5</code>. Whole numbers are called <i>integers</i> (<code>int</code>); numbers with a decimal point are <i>floats</i> (<code>float</code>).</li>
      <li><b>Text</b>: <code>"hello"</code>. Text always goes inside quotes. Python calls a piece of text a <i>string</i> (<code>str</code>), because it's a string of characters.</li>
      <li><b>True or False</b>: <code>True</code> and <code>False</code>, with capital letters and no quotes. These are called <i>booleans</i> (<code>bool</code>).</li></ul>
      <p>You can do maths with numbers: <code>+</code> add, <code>-</code> subtract, <code>*</code> multiply, <code>/</code> divide, and <code>%</code> gives the <i>remainder</i> after dividing (<code>7 % 2</code> is <code>1</code>, because 7 divided by 2 is 3 with 1 left over).</p>
      <h3>Variables</h3>
      <p>A variable is a <b>name</b> that holds a value, so you can use it later. You create one with <code>=</code>:</p>
      <pre>age = 36</pre>
      <p>Read this as "<i>age</i> now holds 36", not "age equals 36". The <code>=</code> sign means "store the value on the right under the name on the left". You can store a new value under the same name later; the old value is replaced.</p>
      <h3>print</h3>
      <p><code>print(...)</code> shows a value on the screen. It's how you look inside your program while it runs. Anything after a <code>#</code> is a <i>comment</i>: a note for people, which Python ignores.</p>
      <h3>Worked example, step by step</h3>
      <p>The example below works out the cost of three coffees. Follow it line by line:</p>
      <ol><li><code>price = 4</code> creates a variable called <code>price</code> holding 4.</li>
      <li><code>quantity = 3</code> creates another one holding 3.</li>
      <li><code>total = price * quantity</code>: Python first works out the right side (4 times 3 is 12), then stores 12 in <code>total</code>.</li>
      <li><code>print(total)</code> shows <code>12</code>.</li>
      <li><code>price = 5</code> replaces the 4 with a 5. <code>total</code> does <i>not</i> change by itself: it still holds 12 until you work it out again.</li></ol>
      <p><b>How the exercises work:</b> type your code in the box and press <b>Run tests</b>. The page checks your code with a few tests. Stuck? Open the hint, and if you're still stuck, open the model answer, read it, then type it in yourself.</p>`,
    example: `price = 4          # a variable called price, holding the number 4
quantity = 3
total = price * quantity
print(total)       # 12

price = 5          # price now holds 5
print(total)       # still 12: total was worked out before the change
print(price * quantity)   # 15

name = "Ada"       # text goes in quotes
print("Hello", name)      # Hello Ada
print(7 % 2)       # 1: the remainder of 7 divided by 2
print(type(3.5), type("hi"), type(True))
`,
    practice: [
      { why: "A variable name should say what the value means. Six months later, `total_price` still makes sense; `x` doesn't.",
        bad: `x = 4
y = 3
z = x * y`,
        good: `price = 4
quantity = 3
total_price = price * quantity` },
      { why: "Quotes turn a number into text. `\"36\"` is two characters, not a number, so maths on it fails or does something surprising (`\"36\" * 2` is `\"3636\"`).",
        bad: `age = "36"         # text that looks like a number`,
        good: `age = 36           # a real number` },
    ],
    exercises: [
      { prompt: "Create a variable called name that holds the text Ada.",
        example: `After your code runs, name holds "Ada"`,
        hint: "Text goes in quotes: write the variable name, then =, then the text in quotes.",
        starter: "# Write your line below\n",
        tests: `assert name == "Ada", "name should hold the text Ada (with quotes around it in your code)"`,
        solution: `name = "Ada"` },
      { prompt: "Create a variable called age that holds the number 36. Make it a number, not text.",
        example: "After your code runs, age holds 36",
        hint: "Numbers don't use quotes. `age = \"36\"` would be text.",
        starter: "# Write your line below\n",
        tests: `assert age == 36, "age should hold 36 (no quotes: it's a number)"
assert type(age) is int`,
        solution: `age = 36` },
      { prompt: "The variables width and height are already made for you. Create a variable called area that holds width multiplied by height. Use the variables, not the number 21.",
        example: "width = 7 and height = 3, so area holds 21",
        hint: "Multiplication is `*`. Put the variable names on the right of `=`: `area = width * height`.",
        starter: "width = 7\nheight = 3\n# Write your line below\n",
        tests: `assert area == 21, "area should be width * height, which is 21"`,
        solution: `width = 7
height = 3
area = width * height` },
      { prompt: "Create a variable called is_raining that holds the boolean True.",
        example: "After your code runs, is_raining holds True",
        hint: "`True` has a capital T and no quotes.",
        starter: "# Write your line below\n",
        tests: `assert is_raining is True, "is_raining should hold True (capital T, no quotes)"`,
        solution: `is_raining = True` },
      { prompt: "The variable minutes holds 3. Create a variable called seconds that holds how many seconds that is (a minute has 60 seconds).",
        example: "minutes = 3, so seconds holds 180",
        hint: "Multiply minutes by 60 and store the answer: `seconds = minutes * 60`.",
        starter: "minutes = 3\n# Write your line below\n",
        tests: `assert seconds == 180, "3 minutes is 180 seconds"`,
        solution: `minutes = 3
seconds = minutes * 60` },
    ],
  },
  {
    id: "first-functions", title: "2. Functions: reusable steps",
    body: `<p>A <b>function</b> is a named set of steps, like a recipe. You write the recipe once, then <i>use</i> it as often as you like. Python already has some: <code>print</code> is a function, and so is <code>len</code>, which counts things.</p>
      <h3>Defining a function</h3>
      <pre>def double(n):
    return n * 2</pre>
      <ul><li><code>def</code> means "define a function". <code>double</code> is its name.</li>
      <li><code>n</code>, in the brackets, is a <b>parameter</b>: a variable that will hold the input each time the function is used.</li>
      <li>The colon <code>:</code> starts the function's <b>body</b>. Every line of the body is <b>indented</b> (pushed right by 4 spaces). Indentation is how Python knows which lines belong to the function.</li>
      <li><code>return</code> hands an answer back to whoever used the function, and ends the function.</li></ul>
      <p>Defining a function doesn't run it. It only teaches Python the recipe.</p>
      <h3>Calling a function</h3>
      <p>Using a function is called <b>calling</b> it: write its name and put the input in brackets, like <code>double(5)</code>. The value you pass in (5) is called an <b>argument</b>.</p>
      <h3>Worked example, step by step</h3>
      <p>What happens when Python runs <code>x = double(5)</code>?</p>
      <ol><li>Python jumps into <code>double</code> and sets the parameter <code>n</code> to 5.</li>
      <li>It runs the body: <code>n * 2</code> is 10, and <code>return</code> hands 10 back.</li>
      <li>Back where the call was, <code>double(5)</code> is replaced by 10, so the line becomes <code>x = 10</code>.</li></ol>
      <p>A function can take several inputs, separated by commas: <code>def add(a, b):</code>, called as <code>add(2, 3)</code>. The first argument goes into the first parameter, the second into the second.</p>
      <h3>return is not print</h3>
      <p><code>print</code> only shows a value on screen; the program can't use it afterwards. <code>return</code> gives the value back so you can store it, print it, or pass it to another function. In the exercises, always <b>return</b> your answer.</p>`,
    example: `def double(n):        # define: a recipe called double with one input, n
    result = n * 2    # the body is indented
    return result     # hand the answer back

print(double(5))      # call it with 5: prints 10
x = double(21)        # the answer can be stored in a variable
print(x)              # 42

def add(a, b):        # two parameters
    return a + b

print(add(2, 3))      # 5
print(add(double(2), 1))   # double(2) is 4, then add(4, 1) is 5
`,
    practice: [
      { why: "A function that prints its answer can't be reused: the caller can't store it or do maths with it. Return the answer and let the caller decide whether to print it.",
        bad: `def add(a, b):
    print(a + b)

total = add(2, 3)      # total is None, not 5`,
        good: `def add(a, b):
    return a + b

total = add(2, 3)      # 5
print(total)` },
      { why: "Lines after `return` never run, because `return` ends the function straight away.",
        bad: `def double(n):
    return n * 2
    print("done")      # never runs`,
        good: `def double(n):
    print("doubling", n)
    return n * 2` },
    ],
    exercises: [
      { prompt: "Write a function add(a, b) that returns the sum of the two numbers.",
        example: "add(2, 3) returns 5",
        hint: "Replace `pass` with a line that returns the two parameters added together: `return a + b`.",
        starter: "def add(a, b):\n    pass\n",
        tests: `assert add(2, 3) == 5, f"add(2, 3) should be 5, got {add(2, 3)}"
assert add(-1, 1) == 0
assert add(0, 0) == 0`,
        solution: `def add(a, b):
    return a + b` },
      { prompt: "Write a function square(n) that returns n multiplied by itself.",
        example: "square(4) returns 16",
        hint: "Multiply the parameter by itself: `return n * n`.",
        starter: "def square(n):\n    pass\n",
        tests: `assert square(4) == 16, f"square(4) should be 16, got {square(4)}"
assert square(0) == 0
assert square(-3) == 9`,
        solution: `def square(n):
    return n * n` },
      { prompt: "Write a function is_even(n) that returns True if n is even and False if it's odd.",
        example: "is_even(4) returns True\nis_even(7) returns False",
        hint: "A number is even when the remainder after dividing by 2 is 0. `n % 2 == 0` is already True or False, so you can return it directly.",
        starter: "def is_even(n):\n    pass\n",
        tests: `assert is_even(4) is True, "4 is even"
assert is_even(7) is False, "7 is odd"
assert is_even(0) is True, "0 is even"`,
        solution: `def is_even(n):
    return n % 2 == 0` },
      { prompt: "Write a function greet(name) that returns a greeting: the text Hello, then the name, then an exclamation mark.",
        example: `greet("Sam") returns "Hello, Sam!"`,
        hint: "`+` joins pieces of text together: `\"Hello, \" + name + \"!\"`. Watch the space after the comma.",
        starter: "def greet(name):\n    pass\n",
        tests: `assert greet("Sam") == "Hello, Sam!", f"got {greet('Sam')!r}"
assert greet("Ada") == "Hello, Ada!"`,
        solution: `def greet(name):
    return "Hello, " + name + "!"` },
      { prompt: "Write a function to_seconds(minutes) that returns how many seconds are in that many minutes.",
        example: "to_seconds(2) returns 120",
        hint: "There are 60 seconds in a minute, so multiply by 60.",
        starter: "def to_seconds(minutes):\n    pass\n",
        tests: `assert to_seconds(2) == 120
assert to_seconds(0) == 0
assert to_seconds(10) == 600`,
        solution: `def to_seconds(minutes):
    return minutes * 60` },
    ],
  },
  {
    id: "first-lists", title: "3. Lists: many values in one",
    body: `<p>A <b>list</b> holds several values in order, inside square brackets, separated by commas: <code>scores = [70, 85, 90]</code>. One variable now holds three numbers.</p>
      <h3>Getting items out</h3>
      <p>Each item has a position number called an <b>index</b>. Counting starts at <b>0</b>, not 1:</p>
      <ul><li><code>scores[0]</code> is the first item (70), <code>scores[1]</code> the second (85).</li>
      <li><code>scores[-1]</code> is the last item (90): negative numbers count back from the end.</li>
      <li><code>len(scores)</code> is how many items there are (3).</li></ul>
      <h3>Changing a list</h3>
      <p><code>scores.append(100)</code> adds 100 to the end. A list can grow and shrink while the program runs. <code>[]</code> is an empty list, with nothing in it.</p>
      <h3>Going through every item: the for loop</h3>
      <pre>for s in scores:
    print(s)</pre>
      <p>Read this as "for each item in <code>scores</code>, call it <code>s</code> and run the indented lines". The body runs once per item: first with <code>s</code> = 70, then 85, then 90.</p>
      <h3>Worked example: adding up a list</h3>
      <ol><li>Start a running total at 0: <code>total = 0</code>.</li>
      <li>Loop over the list. Each time round, add the current item: <code>total = total + s</code>. That line means "work out total plus s, then store the answer back in total".</li>
      <li>After the loop, <code>total</code> is 0 + 70 + 85 + 90 = 245.</li></ol>`,
    example: `scores = [70, 85, 90]   # a list of three numbers
print(scores[0])        # 70: positions start at 0
print(scores[-1])       # 90: the last item
print(len(scores))      # 3

scores.append(100)      # add to the end
print(scores)           # [70, 85, 90, 100]

total = 0
for s in scores:        # s is each item in turn
    total = total + s
print(total)            # 345

names = []              # an empty list
names.append("Ada")
print(names, len(names))
`,
    practice: [
      { why: "`[-1]` always means the last item, so you don't need to work out the length first.",
        bad: `last = scores[len(scores) - 1]`,
        good: `last = scores[-1]` },
      { why: "A for loop hands you each item directly. Counting positions by hand is more code and easy to get off by one.",
        bad: `i = 0
while i < len(scores):
    print(scores[i])
    i = i + 1`,
        good: `for s in scores:
    print(s)` },
    ],
    exercises: [
      { prompt: "Write a function first_item(items) that returns the first item of the list.",
        example: "first_item([7, 8, 9]) returns 7",
        hint: "The first position is 0: `items[0]`.",
        starter: "def first_item(items):\n    pass\n",
        tests: `assert first_item([7, 8, 9]) == 7, "the first item of [7, 8, 9] is 7"
assert first_item(["a"]) == "a"`,
        solution: `def first_item(items):
    return items[0]` },
      { prompt: "Write a function last_item(items) that returns the last item of the list.",
        example: "last_item([7, 8, 9]) returns 9",
        hint: "Negative positions count from the end: `items[-1]` is the last item.",
        starter: "def last_item(items):\n    pass\n",
        tests: `assert last_item([7, 8, 9]) == 9
assert last_item(["only"]) == "only"`,
        solution: `def last_item(items):
    return items[-1]` },
      { prompt: "Write a function count_items(items) that returns how many items are in the list.",
        example: "count_items([5, 5, 5, 5]) returns 4\ncount_items([]) returns 0",
        hint: "`len(...)` counts the items in a list.",
        starter: "def count_items(items):\n    pass\n",
        tests: `assert count_items([5, 5, 5, 5]) == 4
assert count_items([]) == 0`,
        solution: `def count_items(items):
    return len(items)` },
      { prompt: "Write a function add_to_end(items, x) that adds x to the end of the list and returns the list.",
        example: "add_to_end([1, 2], 3) returns [1, 2, 3]",
        hint: "`items.append(x)` adds to the end. Then `return items` on the next line.",
        starter: "def add_to_end(items, x):\n    pass\n",
        tests: `assert add_to_end([1, 2], 3) == [1, 2, 3]
assert add_to_end([], "a") == ["a"]`,
        solution: `def add_to_end(items, x):
    items.append(x)
    return items` },
      { prompt: "Write a function total(nums) that adds up all the numbers in the list, using a for loop. An empty list adds up to 0.",
        example: "total([1, 2, 3]) returns 6\ntotal([]) returns 0",
        hint: "Start with `result = 0`. Loop with `for n in nums:` and inside the loop do `result = result + n`. After the loop (not indented under it), return result.",
        starter: "def total(nums):\n    pass\n",
        tests: `assert total([1, 2, 3]) == 6, f"total([1, 2, 3]) should be 6, got {total([1, 2, 3])}"
assert total([]) == 0, "an empty list adds up to 0"
assert total([10, -10, 5]) == 5`,
        solution: `def total(nums):
    result = 0
    for n in nums:
        result = result + n
    return result` },
    ],
  },
  {
    id: "reading-errors", title: "4. Reading error messages",
    body: `<p>Every programmer sees error messages all day. They aren't a sign you've failed: they're Python telling you exactly what went wrong and where. Learning to read them is one of the most useful skills you can build.</p>
      <h3>How to read one</h3>
      <p>Read the <b>last line first</b>. It names the kind of error and gives a short reason. The lines above it say which line of your code was running (look for <code>line 3</code>, for example).</p>
      <h3>The errors you'll meet most</h3>
      <ul><li><b>SyntaxError</b>: Python couldn't understand the code as written. Often a missing colon <code>:</code> after <code>def</code> or <code>for</code>, a missing bracket, or a missing quote.</li>
      <li><b>IndentationError</b>: the spaces at the start of a line are wrong, for example a function body that isn't indented.</li>
      <li><b>NameError</b>: you used a name Python doesn't know. Usually a typo (<code>totl</code> instead of <code>total</code>) or a variable used before it was created.</li>
      <li><b>TypeError</b>: you combined values that don't go together, such as <code>"Age: " + 36</code> (text plus a number). Turn the number into text first with <code>str(36)</code>.</li>
      <li><b>IndexError</b>: you asked for a position the list doesn't have, like <code>[1, 2][5]</code>.</li>
      <li><b>AssertionError</b>: in these exercises, this means your code ran but gave a different answer from the one the test expected. The message says what was expected.</li></ul>
      <h3>Worked example</h3>
      <p>Suppose you run this:</p>
      <pre>def greet(name):
    return "Hi " + nme</pre>
      <p>and call <code>greet("Sam")</code>. The last line of the error reads <code>NameError: name 'nme' is not defined</code>. Python is saying "I don't know anything called <code>nme</code>". Compare it with the parameter, <code>name</code>: it's a typo. Fix the spelling and run again.</p>
      <p>In the exercises below, each starter has a mistake in it. Press <b>Run tests</b> first to see the error, read it, then fix the code.</p>`,
    example: `# Each of these lines would cause an error. Remove the # in front of one to see it.
# print("Age: " + 36)      # TypeError: text + number
# print([1, 2][5])         # IndexError: no position 5
# print(totl)              # NameError: totl was never created

print("Age: " + str(36))   # works: str turns 36 into the text "36"
`,
    practice: [
      { why: "Text and numbers can't be added with `+`. Convert the number with `str()` first.",
        bad: `age = 36
print("Age: " + age)       # TypeError`,
        good: `age = 36
print("Age: " + str(age))` },
    ],
    exercises: [
      { prompt: "This function has a SyntaxError. Run it to see the message, then fix it so double(n) returns n times 2.",
        example: "double(4) returns 8",
        hint: "Every `def` line must end with a colon `:`.",
        starter: "def double(n)\n    return n * 2\n",
        tests: `assert double(4) == 8
assert double(0) == 0`,
        solution: `def double(n):
    return n * 2` },
      { prompt: "This function has a NameError. Fix it so area(w, h) returns w times h.",
        example: "area(3, 4) returns 12",
        hint: "Compare the names in the body with the parameter names in the brackets. One is misspelled.",
        starter: "def area(w, h):\n    return w * hh\n",
        tests: `assert area(3, 4) == 12
assert area(5, 1) == 5`,
        solution: `def area(w, h):
    return w * h` },
      { prompt: "This function has a TypeError. Fix it so label(age) returns the text Age: followed by the number.",
        example: `label(36) returns "Age: 36"`,
        hint: "You can't add text and a number. Turn the number into text with `str(age)`.",
        starter: "def label(age):\n    return \"Age: \" + age\n",
        tests: `assert label(36) == "Age: 36", f"got {label(36)!r}"
assert label(0) == "Age: 0"`,
        solution: `def label(age):
    return "Age: " + str(age)` },
      { prompt: "This function runs but gives the wrong answer, so the test fails with an AssertionError. Fix it so average(a, b) returns the average of the two numbers.",
        example: "average(2, 4) returns 3.0",
        hint: "Python does `/` before `+`, so `a + b / 2` means a + (b / 2). Use brackets to add first: `(a + b) / 2`.",
        starter: "def average(a, b):\n    return a + b / 2\n",
        tests: `assert average(2, 4) == 3, f"average(2, 4) should be 3, got {average(2, 4)}"
assert average(5, 5) == 5`,
        solution: `def average(a, b):
    return (a + b) / 2` },
    ],
  },
];
