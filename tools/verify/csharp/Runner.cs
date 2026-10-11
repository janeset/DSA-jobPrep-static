using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.Json;
using System.Threading;

namespace Verify
{
    // Runs every C# solution on the same raw inputs as the Python reference (built like build_args in
    // HARNESS_PY) and prints {slug: [{got} | {error}]} as JSON. verify.py compares the answers with the
    // app's own same(), so the comparison rules live in one place. Method names match case-insensitively:
    // LeetCode's C# mixes PascalCase (Get, Put) and lowercase (Codec.serialize).
    public static class Runner
    {
        const int TimeoutMs = 10000;

        public static int Main(string[] argv)
        {
            var jobs = JsonDocument.Parse(File.ReadAllText(argv[0])).RootElement;
            var sb = new StringBuilder("{");
            bool firstJob = true;
            foreach (var job in jobs.EnumerateArray())
            {
                string ns = job.GetProperty("ns").GetString(), slug = job.GetProperty("slug").GetString();
                var spec = job.GetProperty("spec");
                var results = new List<string>();
                foreach (var raw in job.GetProperty("tests").EnumerateArray())
                {
                    object got = null; Exception err = null; bool done = false;
                    var th = new Thread(() =>
                    {
                        try { got = RunOne(ns, spec, raw.EnumerateArray().ToList()); }
                        catch (Exception e) { err = e; }
                        done = true;
                    }, 256 * 1024 * 1024) { IsBackground = true };
                    th.Start();
                    th.Join(TimeoutMs);
                    if (!done) results.Add("{\"error\":" + Quote($"ran for more than {TimeoutMs / 1000} seconds") + "}");
                    else if (err != null) results.Add("{\"error\":" + Quote(Describe(err, ns)) + "}");
                    else
                    {
                        try { results.Add("{\"got\":" + ToJson(got) + "}"); }
                        catch (Exception e) { results.Add("{\"error\":" + Quote("couldn't read the result: " + e.Message) + "}"); }
                    }
                }
                if (!firstJob) sb.Append(',');
                firstJob = false;
                sb.Append(Quote(slug)).Append(":[").Append(string.Join(",", results)).Append(']');
            }
            Console.Out.Write(sb.Append('}').ToString());
            Console.Out.Flush();
            return 0;
        }

        static string Describe(Exception e, string ns)
        {
            while (e is TargetInvocationException && e.InnerException != null) e = e.InnerException;
            string where = "";
            var st = new System.Diagnostics.StackTrace(e, true);
            foreach (var f in st.GetFrames() ?? Array.Empty<System.Diagnostics.StackFrame>())
                if (f.GetMethod()?.DeclaringType?.Namespace == ns && f.GetFileLineNumber() > 0) { where = $" (line {f.GetFileLineNumber()})"; break; }
            return e.GetType().Name + ": " + e.Message + where;
        }

        // ---------------- running one test ----------------
        static string Str(JsonElement spec, string key) =>
            spec.TryGetProperty(key, out var v) && v.ValueKind == JsonValueKind.String ? v.GetString() : null;

        static object RunOne(string ns, JsonElement spec, List<JsonElement> raw)
        {
            var kinds = spec.TryGetProperty("in", out var ins) && ins.ValueKind == JsonValueKind.Array ? ins.EnumerateArray().Select(x => x.GetString()).ToList() : new List<string>();
            string outKind = Str(spec, "out"), cmp = Str(spec, "cmp") ?? "", api = Str(spec, "api"), m = Str(spec, "m");
            bool designTrue = spec.TryGetProperty("design", out var d) && d.ValueKind == JsonValueKind.True;
            string designStr = spec.TryGetProperty("design", out var d2) && d2.ValueKind == JsonValueKind.String ? d2.GetString() : null;
            var orig = new HashSet<object>(ReferenceEqualityComparer.Instance);

            if (designStr == "codec")
            {
                var c = Cls(ns, "Codec");
                var root = MkTree(raw[0]);
                var s = Method(c, "serialize", 1).Invoke(Activator.CreateInstance(c, true), new object[] { root });
                var back = Method(c, "deserialize", 1).Invoke(Activator.CreateInstance(c, true), new[] { s });
                return TreeOut((TreeNode)back);
            }
            if (designTrue)
            {
                var ops = raw[0].EnumerateArray().Select(x => x.GetString()).ToList();
                var ps = raw[1].EnumerateArray().Select(x => x.EnumerateArray().ToList()).ToList();
                var c = Cls(ns, ops[0]);
                var ctor = c.GetConstructors(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).FirstOrDefault(k => k.GetParameters().Length == ps[0].Count)
                    ?? throw new MissingMethodException($"{ops[0]} needs a constructor taking {ps[0].Count} argument(s)");
                var obj = ctor.Invoke(ConvertAll(ps[0], ctor.GetParameters()));
                var res = new List<object> { null };
                for (int i = 1; i < ops.Count; i++)
                {
                    var mm = Method(c, ops[i], ps[i].Count);
                    var r = mm.Invoke(obj, ConvertAll(ps[i], mm.GetParameters()));
                    res.Add(mm.ReturnType == typeof(void) ? null : Plain(r));
                }
                return res;
            }
            if (api == "nestediter")
            {
                var c = Cls(ns, "NestedIterator");
                var it = c.GetConstructors()[0].Invoke(new object[] { MkNested(raw[0]) });
                var hasNext = Method(c, "HasNext", 0); var next = Method(c, "Next", 0);
                var res = new List<object>();
                while ((bool)hasNext.Invoke(it, null))
                {
                    res.Add(next.Invoke(it, null));
                    if (res.Count > 100000) throw new Exception("HasNext() kept returning true");
                }
                return res;
            }
            if (api == "strcodec")
            {
                var c = Cls(ns, "Codec");
                var enc = Method(c, "encode", 1); var dec = Method(c, "decode", 1);
                var e = enc.Invoke(Activator.CreateInstance(c, true), new[] { Convert(raw[0], enc.GetParameters()[0].ParameterType) });
                if (e is not string) throw new Exception("encode must return a single string");
                return Plain(dec.Invoke(Activator.CreateInstance(c, true), new[] { e }));
            }
            if (api == "badversion")
            {
                VersionControl.FirstBad = raw[1].GetInt32();
                raw = raw.Take(1).ToList();
            }
            var sol = Cls(ns, "Solution");
            int argc = raw.Count - kinds.Count(k => k == "cycle");
            var meth = Method(sol, m, argc);
            var args = BuildArgs(ns, raw, kinds, meth.GetParameters(), orig);
            var v = meth.Invoke(Activator.CreateInstance(sol, true), args);
            if (cmp.StartsWith("inplace"))
            {
                int idx = cmp.Length > 7 ? int.Parse(cmp.Substring(7)) : 0;
                return ConvOut(args[idx], idx < kinds.Count ? kinds[idx] : null, orig);
            }
            if (cmp == "k" || cmp == "ksort")
            {
                int k = System.Convert.ToInt32(v);
                var first = ((Array)args[0]).Cast<object>().Take(k).ToList();
                return new List<object> { k, first };
            }
            return ConvOut(v, outKind, orig);
        }

        static Type Cls(string ns, string name) =>
            typeof(Runner).Assembly.GetType(ns + "." + name) ?? throw new TypeLoadException("define a class named " + name);

        static MethodInfo Method(Type c, string name, int argc) =>
            c.GetMethods(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.Static)
                .FirstOrDefault(mm => string.Equals(mm.Name.Replace("_", ""), name.Replace("_", ""), StringComparison.OrdinalIgnoreCase) && mm.GetParameters().Length == argc)
            ?? throw new MissingMethodException($"{c.Name} needs a method {name} taking {argc} argument(s)");

        // ---------------- building inputs ----------------
        static object[] BuildArgs(string ns, List<JsonElement> raw, List<string> kinds, ParameterInfo[] ps, HashSet<object> orig)
        {
            var args = new List<object>();
            for (int k = 0; k < raw.Count; k++)
            {
                string kind = k < kinds.Count ? kinds[k] : null;
                var a = raw[k];
                var t = ps[args.Count].ParameterType;
                switch (kind)
                {
                    case "list": args.Add(MkList(a)); break;
                    case "tree": args.Add(MkTree(a)); break;
                    case "lists":
                        var ls = a.EnumerateArray().Select(MkList).ToList();
                        args.Add(t.IsArray ? ls.ToArray() : ls);
                        break;
                    case "cycle": args.Add(MkCycle(a, raw[k + 1].GetInt32())); k++; break;
                    case "rlist": args.Add(MkRList(ns, a, orig)); break;
                    case "graph": args.Add(MkGraph(ns, a, orig)); break;
                    case "ref": args.Add(Find((TreeNode)args[0], a.GetInt32())); break;
                    default: args.Add(Convert(a, t)); break;
                }
            }
            return args.ToArray();
        }

        static object[] ConvertAll(List<JsonElement> vals, ParameterInfo[] ps) =>
            ps.Select((p, i) => Convert(vals[i], p.ParameterType)).ToArray();

        static object Convert(JsonElement j, Type t)
        {
            var under = Nullable.GetUnderlyingType(t);
            if (j.ValueKind == JsonValueKind.Null) return t.IsValueType && under == null ? Activator.CreateInstance(t) : null;
            if (under != null) t = under;
            if (t == typeof(int)) return j.GetInt32();
            if (t == typeof(long)) return j.GetInt64();
            if (t == typeof(double)) return j.GetDouble();
            if (t == typeof(float)) return (float)j.GetDouble();
            if (t == typeof(bool)) return j.GetBoolean();
            if (t == typeof(char)) return j.GetString()[0];
            if (t == typeof(string)) return j.GetString();
            if (t.IsArray)
            {
                var el = t.GetElementType();
                if (j.ValueKind == JsonValueKind.String && el == typeof(char)) return j.GetString().ToCharArray();
                var items = j.EnumerateArray().ToList();
                var arr = Array.CreateInstance(el, items.Count);
                for (int i = 0; i < items.Count; i++) arr.SetValue(Convert(items[i], el), i);
                return arr;
            }
            if (t.IsGenericType)
            {
                var def = t.GetGenericTypeDefinition();
                var el = t.GetGenericArguments()[0];
                if (def == typeof(IDictionary<,>) || def == typeof(Dictionary<,>) || def == typeof(IReadOnlyDictionary<,>))
                {
                    var args2 = t.GetGenericArguments();
                    var dict = (IDictionary)Activator.CreateInstance(typeof(Dictionary<,>).MakeGenericType(args2));
                    foreach (var p in j.EnumerateObject())
                        dict.Add(args2[0] == typeof(string) ? p.Name : Convert(JsonDocument.Parse(p.Name).RootElement, args2[0]), Convert(p.Value, args2[1]));
                    return dict;
                }
                if (def == typeof(IList<>) || def == typeof(List<>) || def == typeof(IEnumerable<>) || def == typeof(ICollection<>) || def == typeof(IReadOnlyList<>))
                {
                    var list = (IList)Activator.CreateInstance(typeof(List<>).MakeGenericType(el));
                    foreach (var x in j.EnumerateArray()) list.Add(Convert(x, el));
                    return list;
                }
            }
            if (t == typeof(object)) return Untyped(j);
            throw new NotSupportedException("can't build a " + t.Name + " from " + j.ValueKind);
        }

        // Mixed data typed as object (e.g. [timestamp, [names]]): numbers become int, arrays List<object>.
        static object Untyped(JsonElement j) => j.ValueKind switch
        {
            JsonValueKind.Number => j.TryGetInt32(out int i) ? (object)i : j.GetDouble(),   // (object): else ?: makes both double
            JsonValueKind.String => j.GetString(),
            JsonValueKind.True => true,
            JsonValueKind.False => false,
            JsonValueKind.Array => j.EnumerateArray().Select(Untyped).ToList(),
            _ => null,
        };

        static ListNode MkList(JsonElement a)
        {
            var head = new ListNode(); var cur = head;
            foreach (var v in a.EnumerateArray()) { cur.next = new ListNode(v.GetInt32()); cur = cur.next; }
            return head.next;
        }

        static ListNode MkCycle(JsonElement vals, int pos)
        {
            var nodes = vals.EnumerateArray().Select(v => new ListNode(v.GetInt32())).ToList();
            for (int i = 0; i + 1 < nodes.Count; i++) nodes[i].next = nodes[i + 1];
            if (pos >= 0 && nodes.Count > 0) nodes[^1].next = nodes[pos];
            return nodes.Count > 0 ? nodes[0] : null;
        }

        static TreeNode MkTree(JsonElement a)
        {
            var v = a.EnumerateArray().ToList();
            if (v.Count == 0 || v[0].ValueKind == JsonValueKind.Null) return null;
            var root = new TreeNode(v[0].GetInt32());
            var q = new Queue<TreeNode>(); q.Enqueue(root);
            int i = 1;
            while (q.Count > 0 && i < v.Count)
            {
                var n = q.Dequeue();
                if (i < v.Count && v[i].ValueKind != JsonValueKind.Null) { n.left = new TreeNode(v[i].GetInt32()); q.Enqueue(n.left); }
                i++;
                if (i < v.Count && v[i].ValueKind != JsonValueKind.Null) { n.right = new TreeNode(v[i].GetInt32()); q.Enqueue(n.right); }
                i++;
            }
            return root;
        }

        static TreeNode Find(TreeNode root, int val)
        {
            var st = new Stack<TreeNode>();
            if (root != null) st.Push(root);
            while (st.Count > 0)
            {
                var n = st.Pop();
                if (n.val == val) return n;
                if (n.left != null) st.Push(n.left);
                if (n.right != null) st.Push(n.right);
            }
            return null;
        }

        static IList<NestedInteger> MkNested(JsonElement a) =>
            a.EnumerateArray().Select(x => x.ValueKind == JsonValueKind.Array ? new NestedInteger(MkNested(x)) : new NestedInteger(x.GetInt32())).ToList();

        static object MkRList(string ns, JsonElement pairs, HashSet<object> orig)
        {
            var c = Cls(ns, "Node");
            var ps = pairs.EnumerateArray().Select(p => p.EnumerateArray().ToList()).ToList();
            var nodes = ps.Select(p => Activator.CreateInstance(c, p[0].GetInt32())).ToList();
            var next = c.GetField("next"); var random = c.GetField("random");
            for (int i = 0; i + 1 < nodes.Count; i++) next.SetValue(nodes[i], nodes[i + 1]);
            for (int i = 0; i < nodes.Count; i++) random.SetValue(nodes[i], ps[i][1].ValueKind == JsonValueKind.Null ? null : nodes[ps[i][1].GetInt32()]);
            foreach (var n in nodes) orig.Add(n);
            return nodes.Count > 0 ? nodes[0] : null;
        }

        static object MkGraph(string ns, JsonElement adj, HashSet<object> orig)
        {
            var lists = adj.EnumerateArray().ToList();
            if (lists.Count == 0) return null;
            var c = Cls(ns, "Node");
            var nodes = Enumerable.Range(1, lists.Count).Select(i => Activator.CreateInstance(c, i)).ToList();
            var nb = c.GetField("neighbors");
            for (int i = 0; i < lists.Count; i++)
            {
                var l = (IList)nb.GetValue(nodes[i]);
                foreach (var j in lists[i].EnumerateArray()) l.Add(nodes[j.GetInt32() - 1]);
            }
            foreach (var n in nodes) orig.Add(n);
            return nodes[0];
        }

        // ---------------- reading outputs (conv_out in HARNESS_PY) ----------------
        static object ConvOut(object v, string kind, HashSet<object> orig)
        {
            switch (kind)
            {
                case "list":
                    var outL = new List<object>();
                    for (var h = (ListNode)v; h != null; h = h.next)
                    {
                        outL.Add(h.val);
                        if (outL.Count > 2000000) throw new Exception("the returned list loops forever (it has a cycle)");
                    }
                    return outL;
                case "tree": return TreeOut((TreeNode)v);
                case "val": return v?.GetType().GetField("val").GetValue(v);
                case "rlist": return RListOut(v, orig);
                case "graph": return GraphOut(v, orig);
                default: return Plain(v);
            }
        }

        static object Plain(object v)
        {
            if (v is ListNode || v is TreeNode || (v != null && v.GetType().Name == "Node"))
                throw new Exception($"returned a {v.GetType().Name}, but this problem expects a plain value");
            return v;
        }

        static List<object> TreeOut(TreeNode root)
        {
            var outT = new List<object>();
            var q = new Queue<TreeNode>(); q.Enqueue(root);
            while (q.Count > 0)
            {
                var n = q.Dequeue();
                if (n == null) { outT.Add(null); continue; }
                outT.Add(n.val);
                q.Enqueue(n.left); q.Enqueue(n.right);
                if (outT.Count > 4000000) throw new Exception("the returned tree loops forever (a node points back up)");
            }
            while (outT.Count > 0 && outT[^1] == null) outT.RemoveAt(outT.Count - 1);
            return outT;
        }

        static List<object> RListOut(object head, HashSet<object> orig)
        {
            var res = new List<object>();
            if (head == null) return res;
            var c = head.GetType();
            FieldInfo val = c.GetField("val"), next = c.GetField("next"), random = c.GetField("random");
            var nodes = new List<object>();
            for (var cur = head; cur != null; cur = next.GetValue(cur))
            {
                if (orig.Contains(cur)) throw new Exception("the copy reuses nodes from the original list; create new nodes");
                nodes.Add(cur);
                if (nodes.Count > 1000000) throw new Exception("the returned list loops forever (it has a cycle)");
            }
            var idx = new Dictionary<object, int>(ReferenceEqualityComparer.Instance);
            for (int i = 0; i < nodes.Count; i++) idx[nodes[i]] = i;
            foreach (var n in nodes)
            {
                var r = random.GetValue(n);
                if (r != null && orig.Contains(r)) throw new Exception("a random pointer in the copy points into the original list");
                res.Add(new List<object> { val.GetValue(n), r == null ? null : idx[r] });
            }
            return res;
        }

        static List<object> GraphOut(object node, HashSet<object> orig)
        {
            var res = new List<object>();
            if (node == null) return res;
            var c = node.GetType();
            FieldInfo val = c.GetField("val"), nb = c.GetField("neighbors");
            var seen = new SortedDictionary<int, object>();
            var q = new Queue<object>(); q.Enqueue(node);
            while (q.Count > 0)
            {
                var n = q.Dequeue();
                if (orig.Contains(n)) throw new Exception("the clone reuses nodes from the original graph; create new nodes");
                int v = (int)val.GetValue(n);
                if (seen.ContainsKey(v)) continue;
                seen[v] = n;
                foreach (var m in (IEnumerable)nb.GetValue(n)) if (!seen.ContainsKey((int)val.GetValue(m))) q.Enqueue(m);
            }
            foreach (var n in seen.Values)
                res.Add(((IEnumerable)nb.GetValue(n)).Cast<object>().Select(m => val.GetValue(m)).ToList());
            return res;
        }

        // ---------------- JSON out ----------------
        static string Quote(string s) => JsonSerializer.Serialize(s);

        static string ToJson(object v)
        {
            switch (v)
            {
                case null: return "null";
                case string s: return Quote(s);
                case char ch: return Quote(ch.ToString());
                case bool b: return b ? "true" : "false";
                case int or long or short or byte or uint or ulong: return System.Convert.ToString(v, CultureInfo.InvariantCulture);
                case double or float or decimal:
                    double dv = System.Convert.ToDouble(v, CultureInfo.InvariantCulture);
                    if (double.IsNaN(dv)) return "NaN";
                    if (double.IsInfinity(dv)) return dv > 0 ? "Infinity" : "-Infinity";
                    return dv.ToString("R", CultureInfo.InvariantCulture);
                case ITuple t:
                    var parts = new List<string>();
                    for (int i = 0; i < t.Length; i++) parts.Add(ToJson(t[i]));
                    return "[" + string.Join(",", parts) + "]";
                case IEnumerable e: return "[" + string.Join(",", e.Cast<object>().Select(ToJson)) + "]";
                default: throw new NotSupportedException("can't write a " + v.GetType().Name + " as JSON");
            }
        }
    }
}
