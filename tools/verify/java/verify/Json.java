package verify;

import java.lang.reflect.Array;
import java.util.*;

// Just enough JSON: parse into Map / List / String / Long / Double / Boolean / null, and write back.
public final class Json {
    private final String s;
    private int i;
    private Json(String s) { this.s = s; }

    public static Object parse(String text) {
        Json p = new Json(text);
        p.ws();
        Object v = p.value();
        return v;
    }

    private void ws() { while (i < s.length() && Character.isWhitespace(s.charAt(i))) i++; }

    private Object value() {
        char c = s.charAt(i);
        if (c == '{') {
            i++; Map<String, Object> m = new LinkedHashMap<>(); ws();
            if (s.charAt(i) == '}') { i++; return m; }
            while (true) {
                ws(); String k = str(); ws(); i++; ws(); m.put(k, value()); ws();
                if (s.charAt(i++) == '}') return m;
            }
        }
        if (c == '[') {
            i++; List<Object> a = new ArrayList<>(); ws();
            if (s.charAt(i) == ']') { i++; return a; }
            while (true) {
                ws(); a.add(value()); ws();
                if (s.charAt(i++) == ']') return a;
            }
        }
        if (c == '"') return str();
        if (s.startsWith("true", i)) { i += 4; return Boolean.TRUE; }
        if (s.startsWith("false", i)) { i += 5; return Boolean.FALSE; }
        if (s.startsWith("null", i)) { i += 4; return null; }
        if (s.startsWith("NaN", i)) { i += 3; return Double.NaN; }
        if (s.startsWith("Infinity", i)) { i += 8; return Double.POSITIVE_INFINITY; }
        if (s.startsWith("-Infinity", i)) { i += 9; return Double.NEGATIVE_INFINITY; }
        int st = i;
        while (i < s.length() && "+-0123456789.eE".indexOf(s.charAt(i)) >= 0) i++;
        String num = s.substring(st, i);
        if (num.contains(".") || num.contains("e") || num.contains("E")) return Double.parseDouble(num);
        return Long.parseLong(num);
    }

    private String str() {
        StringBuilder b = new StringBuilder();
        i++;
        while (true) {
            char c = s.charAt(i++);
            if (c == '"') return b.toString();
            if (c != '\\') { b.append(c); continue; }
            char e = s.charAt(i++);
            switch (e) {
                case 'n' -> b.append('\n'); case 't' -> b.append('\t'); case 'r' -> b.append('\r');
                case 'b' -> b.append('\b'); case 'f' -> b.append('\f');
                case 'u' -> { b.append((char) Integer.parseInt(s.substring(i, i + 4), 16)); i += 4; }
                default -> b.append(e);
            }
        }
    }

    public static String write(Object v) {
        StringBuilder b = new StringBuilder();
        write(v, b);
        return b.toString();
    }

    private static void write(Object v, StringBuilder b) {
        if (v == null) b.append("null");
        else if (v instanceof String str) quote(str, b);
        else if (v instanceof Character ch) quote(String.valueOf(ch), b);
        else if (v instanceof Boolean || v instanceof Integer || v instanceof Long || v instanceof Short || v instanceof Byte) b.append(v);
        else if (v instanceof Double || v instanceof Float) {
            double d = ((Number) v).doubleValue();
            b.append(Double.isNaN(d) ? "NaN" : Double.isInfinite(d) ? (d > 0 ? "Infinity" : "-Infinity") : Double.toString(d));
        } else if (v instanceof Map<?, ?> m) {
            b.append('{'); boolean first = true;
            for (Map.Entry<?, ?> e : m.entrySet()) { if (!first) b.append(','); first = false; quote(String.valueOf(e.getKey()), b); b.append(':'); write(e.getValue(), b); }
            b.append('}');
        } else if (v instanceof Iterable<?> it) {
            b.append('['); boolean first = true;
            for (Object x : it) { if (!first) b.append(','); first = false; write(x, b); }
            b.append(']');
        } else if (v.getClass().isArray()) {
            b.append('[');
            for (int k = 0; k < Array.getLength(v); k++) { if (k > 0) b.append(','); write(Array.get(v, k), b); }
            b.append(']');
        } else throw new IllegalArgumentException("can't write " + v.getClass().getName() + " as JSON");
    }

    private static void quote(String str, StringBuilder b) {
        b.append('"');
        for (char c : str.toCharArray()) {
            switch (c) {
                case '"' -> b.append("\\\""); case '\\' -> b.append("\\\\"); case '\n' -> b.append("\\n");
                case '\r' -> b.append("\\r"); case '\t' -> b.append("\\t");
                default -> { if (c < 0x20) b.append(String.format("\\u%04x", (int) c)); else b.append(c); }
            }
        }
        b.append('"');
    }
}
