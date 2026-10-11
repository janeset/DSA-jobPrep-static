package verify;

import java.lang.reflect.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;

// Runs every Java solution on the same raw inputs as the Python reference (built the same way as
// build_args in HARNESS_PY) and prints {slug: [{got} | {error}]} as JSON. verify.py compares the
// answers with the app's own same(), so the comparison rules live in one place.
public final class Runner {
    static final int TIMEOUT_SECONDS = 10;

    @SuppressWarnings("unchecked")
    public static void main(String[] argv) throws Exception {
        List<Object> jobs = (List<Object>) Json.parse(Files.readString(Path.of(argv[0])));
        ExecutorService pool = Executors.newCachedThreadPool(r -> {
            Thread t = new Thread(null, r, "solution", 256L << 20);   // deep stacks for recursive solutions
            t.setDaemon(true);
            return t;
        });
        Map<String, Object> out = new LinkedHashMap<>();
        for (Object jo : jobs) {
            Map<String, Object> job = (Map<String, Object>) jo;
            String ns = (String) job.get("ns");
            Map<String, Object> spec = (Map<String, Object>) job.get("spec");
            int offset = ((Number) job.get("offset")).intValue();
            List<Object> results = new ArrayList<>();
            for (Object raw : (List<Object>) job.get("tests")) {
                Map<String, Object> r = new LinkedHashMap<>();
                Future<Object> f = pool.submit(() -> runOne(ns, spec, (List<Object>) raw));
                try {
                    r.put("got", f.get(TIMEOUT_SECONDS, TimeUnit.SECONDS));
                } catch (TimeoutException e) {
                    f.cancel(true);
                    r.put("error", "ran for more than " + TIMEOUT_SECONDS + " seconds");
                } catch (ExecutionException e) {
                    r.put("error", describe(e.getCause(), ns, offset));
                }
                results.add(r);
            }
            out.put((String) job.get("slug"), results);
        }
        System.out.println(Json.write(out));
        System.exit(0);
    }

    static String describe(Throwable t, String ns, int offset) {
        while ((t instanceof InvocationTargetException || t instanceof ExecutionException) && t.getCause() != null) t = t.getCause();
        String where = "";
        for (StackTraceElement el : t.getStackTrace())
            if (el.getClassName().startsWith(ns + ".")) { where = " (line " + (el.getLineNumber() - offset) + ")"; break; }
        return t.getClass().getSimpleName() + (t.getMessage() != null ? ": " + t.getMessage() : "") + where;
    }

    // ---------------- running one test ----------------
    @SuppressWarnings("unchecked")
    static Object runOne(String ns, Map<String, Object> spec, List<Object> raw) throws Exception {
        Object design = spec.get("design");
        String api = (String) spec.get("api");
        List<String> kinds = spec.get("in") == null ? List.of() : (List<String>) (List<?>) spec.get("in");
        String outKind = (String) spec.get("out");
        String cmp = spec.get("cmp") == null ? "" : (String) spec.get("cmp");
        Map<Object, Boolean> orig = new IdentityHashMap<>();

        if ("codec".equals(design)) {
            Class<?> c = cls(ns, "Codec");
            TreeNode root = mkTree((List<Object>) raw.get(0));
            Object s = method(c, "serialize", 1).invoke(make(c), root);
            Object back = method(c, "deserialize", 1).invoke(make(c), s);
            return treeOut((TreeNode) back);
        }
        if (Boolean.TRUE.equals(design)) {
            List<Object> ops = (List<Object>) raw.get(0), params = (List<Object>) raw.get(1);
            Class<?> c = cls(ns, (String) ops.get(0));
            List<Object> p0 = (List<Object>) params.get(0);
            Constructor<?> ctor = Arrays.stream(c.getDeclaredConstructors()).filter(k -> k.getParameterCount() == p0.size()).findFirst()
                .orElseThrow(() -> new NoSuchMethodException(ops.get(0) + " needs a constructor taking " + p0.size() + " argument(s)"));
            ctor.setAccessible(true);
            Object obj = ctor.newInstance(convertAll(p0, ctor.getGenericParameterTypes()));
            List<Object> res = new ArrayList<>();
            res.add(null);
            for (int i = 1; i < ops.size(); i++) {
                List<Object> p = (List<Object>) params.get(i);
                Method mm = method(c, (String) ops.get(i), p.size());
                Object r = mm.invoke(obj, convertAll(p, mm.getGenericParameterTypes()));
                res.add(mm.getReturnType() == void.class ? null : plain(r));
            }
            return res;
        }
        if ("nestediter".equals(api)) {
            Class<?> c = cls(ns, "NestedIterator");
            Constructor<?> ctor = c.getDeclaredConstructors()[0];
            ctor.setAccessible(true);
            Object it = ctor.newInstance(mkNested((List<Object>) raw.get(0)));
            Method hasNext = method(c, "hasNext", 0), next = method(c, "next", 0);
            List<Object> res = new ArrayList<>();
            while ((Boolean) hasNext.invoke(it)) {
                res.add(next.invoke(it));
                if (res.size() > 100000) throw new RuntimeException("hasNext() kept returning true");
            }
            return res;
        }
        if ("strcodec".equals(api)) {
            Class<?> c = cls(ns, "Codec");
            Method enc = method(c, "encode", 1), dec = method(c, "decode", 1);
            Object e = enc.invoke(make(c), convert(raw.get(0), enc.getGenericParameterTypes()[0]));
            if (!(e instanceof String)) throw new RuntimeException("encode must return a single String");
            return plain(dec.invoke(make(c), e));
        }
        if ("badversion".equals(api)) {
            VersionControl.firstBad = ((Number) raw.get(1)).intValue();
            raw = raw.subList(0, 1);
        }
        Class<?> sol = cls(ns, "Solution");
        String m = (String) spec.get("m");
        int argc = raw.size() - (int) kinds.stream().filter("cycle"::equals).count();
        Method meth = method(sol, m, argc);
        Object[] args = buildArgs(ns, raw, kinds, meth.getGenericParameterTypes(), orig);
        Object v = meth.invoke(make(sol), args);
        if (cmp.startsWith("inplace")) {
            int idx = cmp.length() > 7 ? Integer.parseInt(cmp.substring(7)) : 0;
            return convOut(args[idx], idx < kinds.size() ? kinds.get(idx) : null, orig);
        }
        if (cmp.equals("k") || cmp.equals("ksort")) {
            int k = ((Number) v).intValue();
            List<Object> first = new ArrayList<>();
            for (int i = 0; i < k; i++) first.add(Array.get(args[0], i));
            return List.of(k, first);
        }
        return convOut(v, outKind, orig);
    }

    static Class<?> cls(String ns, String name) throws ClassNotFoundException {
        try {
            return Class.forName(ns + "." + name);
        } catch (ClassNotFoundException e) {
            throw new ClassNotFoundException("define a class named " + name);
        }
    }

    // Fields of the solution's own Node class, which is package-private in the generated sources.
    static Field field(Class<?> c, String name) throws NoSuchFieldException {
        Field f = c.getDeclaredField(name);
        f.setAccessible(true);
        return f;
    }

    static Object make(Class<?> c) throws Exception {
        Constructor<?> k = c.getDeclaredConstructor();
        k.setAccessible(true);
        return k.newInstance();
    }

    // Operation names in the tests are the Python ones (set_with_ttl); Java spells them setWithTtl.
    static String norm(String name) { return name.replace("_", "").toLowerCase(); }

    static Method method(Class<?> c, String name, int argc) throws NoSuchMethodException {
        for (Class<?> k = c; k != null; k = k.getSuperclass())
            for (Method mm : k.getDeclaredMethods())
                if (norm(mm.getName()).equals(norm(name)) && mm.getParameterCount() == argc && !mm.isBridge()) { mm.setAccessible(true); return mm; }
        throw new NoSuchMethodException(c.getSimpleName() + " needs a method " + name + " taking " + argc + " argument(s)");
    }

    // ---------------- building inputs ----------------
    @SuppressWarnings("unchecked")
    static Object[] buildArgs(String ns, List<Object> raw, List<String> kinds, Type[] types, Map<Object, Boolean> orig) throws Exception {
        List<Object> args = new ArrayList<>();
        for (int k = 0; k < raw.size(); k++) {
            String kind = k < kinds.size() ? kinds.get(k) : null;
            Object a = raw.get(k);
            Type t = types[args.size()];
            if ("list".equals(kind)) args.add(mkList((List<Object>) a));
            else if ("tree".equals(kind)) args.add(mkTree((List<Object>) a));
            else if ("lists".equals(kind)) {
                List<ListNode> ls = new ArrayList<>();
                for (Object x : (List<Object>) a) ls.add(mkList((List<Object>) x));
                args.add(t == ListNode[].class ? ls.toArray(new ListNode[0]) : ls);
            } else if ("cycle".equals(kind)) {
                args.add(mkCycle((List<Object>) a, ((Number) raw.get(k + 1)).intValue()));
                k++;
            } else if ("rlist".equals(kind)) args.add(mkRList(ns, (List<Object>) a, orig));
            else if ("graph".equals(kind)) args.add(mkGraph(ns, (List<Object>) a, orig));
            else if ("ref".equals(kind)) args.add(find((TreeNode) args.get(0), ((Number) a).intValue()));
            else args.add(convert(a, t));
        }
        return args.toArray();
    }

    static Object[] convertAll(List<Object> vals, Type[] types) {
        Object[] out = new Object[types.length];
        for (int i = 0; i < types.length; i++) out[i] = convert(vals.get(i), types[i]);
        return out;
    }

    @SuppressWarnings("unchecked")
    static Object convert(Object j, Type t) {
        if (t instanceof ParameterizedType pt) {
            Class<?> rawType = (Class<?>) pt.getRawType();
            if (Collection.class.isAssignableFrom(rawType) || rawType == Iterable.class) {
                Type el = pt.getActualTypeArguments()[0];
                Collection<Object> c = Set.class.isAssignableFrom(rawType) ? new HashSet<>() : new ArrayList<>();
                for (Object x : (List<Object>) j) c.add(convert(x, el));
                return c;
            }
            if (Map.class.isAssignableFrom(rawType)) {
                Type kt = pt.getActualTypeArguments()[0], vt = pt.getActualTypeArguments()[1];
                Map<Object, Object> m = new HashMap<>();
                for (var e : ((Map<String, Object>) j).entrySet()) m.put(convert(e.getKey(), kt), convert(e.getValue(), vt));
                return m;
            }
            return convert(j, rawType);
        }
        if (t instanceof WildcardType || t instanceof TypeVariable<?> || t == Object.class) return untyped(j);
        Class<?> c = (Class<?>) t;
        if (j == null) return c.isPrimitive() ? Array.get(Array.newInstance(c, 1), 0) : null;
        if (c == int.class || c == Integer.class) return ((Number) j).intValue();
        if (c == long.class || c == Long.class) return ((Number) j).longValue();
        if (c == double.class || c == Double.class) return ((Number) j).doubleValue();
        if (c == float.class || c == Float.class) return ((Number) j).floatValue();
        if (c == boolean.class || c == Boolean.class) return j;
        if (c == char.class || c == Character.class) return ((String) j).charAt(0);
        if (c == String.class) return j;
        if (c.isArray()) {
            Class<?> comp = c.getComponentType();
            if (j instanceof String s && comp == char.class) return s.toCharArray();
            List<Object> l = (List<Object>) j;
            Object arr = Array.newInstance(comp, l.size());
            for (int i = 0; i < l.size(); i++) Array.set(arr, i, convert(l.get(i), comp));
            return arr;
        }
        if (List.class.isAssignableFrom(c) || c == Collection.class) {
            List<Object> l = new ArrayList<>();
            for (Object x : (List<Object>) j) l.add(x instanceof Long n ? (Object) n.intValue() : x);
            return l;
        }
        return j;
    }

    // Mixed data typed as Object (e.g. [timestamp, [names]]): whole numbers become Integer, lists stay lists.
    @SuppressWarnings("unchecked")
    static Object untyped(Object j) {
        if (j instanceof Long n && n >= Integer.MIN_VALUE && n <= Integer.MAX_VALUE) return n.intValue();
        if (j instanceof List<?> l) {
            List<Object> out = new ArrayList<>();
            for (Object x : l) out.add(untyped(x));
            return out;
        }
        return j;
    }

    static ListNode mkList(List<Object> a) {
        ListNode head = new ListNode(), cur = head;
        for (Object v : a) { cur.next = new ListNode(((Number) v).intValue()); cur = cur.next; }
        return head.next;
    }

    static ListNode mkCycle(List<Object> vals, int pos) {
        List<ListNode> nodes = new ArrayList<>();
        for (Object v : vals) nodes.add(new ListNode(((Number) v).intValue()));
        for (int i = 0; i + 1 < nodes.size(); i++) nodes.get(i).next = nodes.get(i + 1);
        if (pos >= 0 && !nodes.isEmpty()) nodes.get(nodes.size() - 1).next = nodes.get(pos);
        return nodes.isEmpty() ? null : nodes.get(0);
    }

    static TreeNode mkTree(List<Object> a) {
        if (a.isEmpty() || a.get(0) == null) return null;
        TreeNode root = new TreeNode(((Number) a.get(0)).intValue());
        ArrayDeque<TreeNode> q = new ArrayDeque<>(List.of(root));
        int i = 1;
        while (!q.isEmpty() && i < a.size()) {
            TreeNode n = q.poll();
            if (i < a.size() && a.get(i) != null) { n.left = new TreeNode(((Number) a.get(i)).intValue()); q.add(n.left); }
            i++;
            if (i < a.size() && a.get(i) != null) { n.right = new TreeNode(((Number) a.get(i)).intValue()); q.add(n.right); }
            i++;
        }
        return root;
    }

    static TreeNode find(TreeNode root, int v) {
        ArrayDeque<TreeNode> st = new ArrayDeque<>();
        if (root != null) st.push(root);
        while (!st.isEmpty()) {
            TreeNode n = st.pop();
            if (n.val == v) return n;
            if (n.left != null) st.push(n.left);
            if (n.right != null) st.push(n.right);
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    static List<NestedInteger> mkNested(List<Object> a) {
        List<NestedInteger> out = new ArrayList<>();
        for (Object x : a) out.add(x instanceof List<?> l ? new NestedInteger(mkNested((List<Object>) l)) : new NestedInteger(((Number) x).intValue()));
        return out;
    }

    // Node with next + random (Copy List with Random Pointer); the class lives in the solution's package.
    @SuppressWarnings("unchecked")
    static Object mkRList(String ns, List<Object> pairs, Map<Object, Boolean> orig) throws Exception {
        Class<?> c = Class.forName(ns + ".Node");
        Constructor<?> k = c.getDeclaredConstructor(int.class);
        k.setAccessible(true);
        Field next = field(c, "next"), random = field(c, "random");
        List<Object> nodes = new ArrayList<>();
        for (Object p : pairs) nodes.add(k.newInstance(((Number) ((List<Object>) p).get(0)).intValue()));
        for (int i = 0; i + 1 < nodes.size(); i++) next.set(nodes.get(i), nodes.get(i + 1));
        for (int i = 0; i < nodes.size(); i++) {
            Object r = ((List<Object>) pairs.get(i)).get(1);
            random.set(nodes.get(i), r == null ? null : nodes.get(((Number) r).intValue()));
        }
        nodes.forEach(n -> orig.put(n, true));
        return nodes.isEmpty() ? null : nodes.get(0);
    }

    // Node with neighbors (Clone Graph): adjacency list, nodes numbered from 1.
    @SuppressWarnings("unchecked")
    static Object mkGraph(String ns, List<Object> adj, Map<Object, Boolean> orig) throws Exception {
        if (adj.isEmpty()) return null;
        Class<?> c = Class.forName(ns + ".Node");
        Constructor<?> k = c.getDeclaredConstructor(int.class);
        k.setAccessible(true);
        Field nb = field(c, "neighbors");
        List<Object> nodes = new ArrayList<>();
        for (int i = 0; i < adj.size(); i++) nodes.add(k.newInstance(i + 1));
        for (int i = 0; i < adj.size(); i++) {
            List<Object> l = (List<Object>) nb.get(nodes.get(i));
            for (Object j : (List<Object>) adj.get(i)) l.add(nodes.get(((Number) j).intValue() - 1));
        }
        nodes.forEach(n -> orig.put(n, true));
        return nodes.get(0);
    }

    // ---------------- reading outputs (conv_out in HARNESS_PY) ----------------
    static Object convOut(Object v, String kind, Map<Object, Boolean> orig) throws Exception {
        if ("list".equals(kind)) {
            List<Object> out = new ArrayList<>();
            for (ListNode h = (ListNode) v; h != null; h = h.next) {
                out.add(h.val);
                if (out.size() > 2000000) throw new RuntimeException("the returned list loops forever (it has a cycle)");
            }
            return out;
        }
        if ("tree".equals(kind)) return treeOut((TreeNode) v);
        if ("val".equals(kind)) return v == null ? null : field(v.getClass(), "val").get(v);
        if ("rlist".equals(kind)) return rlistOut(v, orig);
        if ("graph".equals(kind)) return graphOut(v, orig);
        return plain(v);
    }

    static Object plain(Object v) {
        if (v instanceof ListNode || v instanceof TreeNode || (v != null && v.getClass().getSimpleName().equals("Node")))
            throw new RuntimeException("returned a " + v.getClass().getSimpleName() + ", but this problem expects a plain value");
        return v;
    }

    static List<Object> treeOut(TreeNode root) {
        List<Object> out = new ArrayList<>();
        ArrayDeque<Object> q = new ArrayDeque<>();
        LinkedList<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            TreeNode n = queue.poll();
            if (n == null) { out.add(null); continue; }
            out.add(n.val);
            queue.add(n.left);
            queue.add(n.right);
            if (out.size() > 4000000) throw new RuntimeException("the returned tree loops forever (a node points back up)");
        }
        while (!out.isEmpty() && out.get(out.size() - 1) == null) out.remove(out.size() - 1);
        return out;
    }

    static List<Object> rlistOut(Object head, Map<Object, Boolean> orig) throws Exception {
        List<Object> nodes = new ArrayList<>();
        if (head == null) return nodes;
        Field val = field(head.getClass(), "val"), next = field(head.getClass(), "next"), random = field(head.getClass(), "random");
        for (Object cur = head; cur != null; cur = next.get(cur)) {
            if (orig.containsKey(cur)) throw new RuntimeException("the copy reuses nodes from the original list; create new nodes");
            nodes.add(cur);
            if (nodes.size() > 1000000) throw new RuntimeException("the returned list loops forever (it has a cycle)");
        }
        Map<Object, Integer> idx = new IdentityHashMap<>();
        for (int i = 0; i < nodes.size(); i++) idx.put(nodes.get(i), i);
        List<Object> out = new ArrayList<>();
        for (Object n : nodes) {
            Object r = random.get(n);
            if (r != null && orig.containsKey(r)) throw new RuntimeException("a random pointer in the copy points into the original list");
            out.add(Arrays.asList(val.get(n), r == null ? null : idx.get(r)));
        }
        return out;
    }

    @SuppressWarnings("unchecked")
    static List<Object> graphOut(Object node, Map<Object, Boolean> orig) throws Exception {
        if (node == null) return new ArrayList<>();
        Field val = field(node.getClass(), "val"), nb = field(node.getClass(), "neighbors");
        TreeMap<Integer, Object> seen = new TreeMap<>();
        ArrayDeque<Object> q = new ArrayDeque<>(List.of(node));
        while (!q.isEmpty()) {
            Object n = q.poll();
            if (orig.containsKey(n)) throw new RuntimeException("the clone reuses nodes from the original graph; create new nodes");
            int v = (Integer) val.get(n);
            if (seen.containsKey(v)) continue;
            seen.put(v, n);
            for (Object m : (List<Object>) nb.get(n)) if (!seen.containsKey((Integer) val.get(m))) q.add(m);
        }
        List<Object> out = new ArrayList<>();
        for (Object n : seen.values()) {
            List<Object> ids = new ArrayList<>();
            for (Object m : (List<Object>) nb.get(n)) ids.add(val.get(m));
            out.add(ids);
        }
        return out;
    }
}
