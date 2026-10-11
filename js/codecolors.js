"use strict";
// Syntax colours in the style of Visual Studio Code's "Dark+" (or "Light+") theme, for code
// blocks and the code editors. highlight.js splits code into tokens; a few extra passes match
// Dark+ more closely (control keywords purple, self blue, function calls yellow). Editors get a
// coloured layer behind a transparent textarea, so typing stays a plain textarea.
// highlight.js arrives from js/highlight.js (a module, so after the first render); until then, or
// without it (offline, or opened as a file), code simply shows uncoloured.

// Dark+ shows flow-control keywords in purple and the rest (def, class, in, and...) in blue.
const HL_CTRL = new Set("if elif else for while return import from try except finally raise with yield break continue pass as async await del assert switch case default do throw catch goto foreach using".split(" "));
// Output and result blocks that aren't code.
const HL_SKIP = "#out, .tc pre, [id^='res-'], .plain";
const HL_LANGS = { py: "python", python: "python", java: "java", cs: "csharp", csharp: "csharp" };

function hlLang(el) {
  const m = /language-(\w+)/.exec(el.className || "");
  const near = el.closest && el.closest("[data-code-lang]");
  return HL_LANGS[(m && m[1]) || (near && near.dataset.codeLang) || "python"] || "python";
}

// Extra passes over highlight.js output, only on text outside its spans.
function hlTweak(html, lang) {
  let depth = 0;
  return html.replace(/(<\/?span[^>]*>)|([^<]+)/g, (m, tag, text) => {
    if (tag) { depth += tag.startsWith("</") ? -1 : 1; return tag; }
    if (depth > 0) return text;
    return text
      .replace(/\b(self|this|cls)\b/g, '<span class="hljs-keyword">$1</span>')
      .replace(/\b([A-Za-z_]\w*)(?=\s*\()/g, (w) => (/^[A-Z]/.test(w) && lang !== "csharp" ? `<span class="hljs-title class_">${w}</span>` : `<span class="hljs-title function_">${w}</span>`));
  }).replace(/<span class="hljs-keyword">(\w+)<\/span>/g, (m, w) => (HL_CTRL.has(w) ? `<span class="hljs-keyword hl-ctrl">${w}</span>` : m));
}

function hlHtml(code, lang) {
  if (!window.hljs) return esc(code);
  try { return hlTweak(hljs.highlight(code, { language: lang, ignoreIllegals: true }).value, lang); }
  catch (e) { return esc(code); }
}

// A coloured layer behind the textarea; the textarea's own text is transparent.
function enhanceEditor(ta, lang) {
  ta.classList.add("hl-on");
  ta.setAttribute("wrap", "off");
  const wrap = document.createElement("div"), layer = document.createElement("pre");
  wrap.className = "code-edit";
  layer.className = "code-layer hl";
  layer.setAttribute("aria-hidden", "true");
  ta.parentNode.insertBefore(wrap, ta);
  wrap.append(layer, ta);
  const cs = getComputedStyle(ta);
  ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "fontFamily", "fontSize", "lineHeight", "letterSpacing", "tabSize",
    "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth", "borderRadius"].forEach((p) => { layer.style[p] = cs[p]; });
  const sync = () => { layer.scrollTop = ta.scrollTop; layer.scrollLeft = ta.scrollLeft; };
  const paint = () => { layer.innerHTML = hlHtml(ta.value, lang) + "\n"; sync(); };
  ta.addEventListener("input", paint);
  ta.addEventListener("hl-ready", paint);
  ta.addEventListener("scroll", sync);
  paint();
}

// Colours every code block and editor in the page; called after each render.
function highlightCode(root = document.getElementById("view")) {
  if (!root) return;
  root.querySelectorAll("pre:not(.hl)").forEach((pre) => {
    if (!window.hljs || pre.matches(HL_SKIP) || !pre.textContent.trim()) return;
    pre.innerHTML = hlHtml(pre.textContent, hlLang(pre));
    pre.classList.add("hl");
  });
  root.querySelectorAll("textarea#code, textarea.ex, textarea.lx").forEach((ta) => {
    if (ta.classList.contains("hl-on")) return;
    const lx = ta.dataset.lx || "";   // data-hl names the language directly (the problem editor)
    enhanceEditor(ta, HL_LANGS[ta.dataset.hl] || (lx.startsWith("java:") ? "java" : lx.startsWith("cs:") ? "csharp" : "python"));
  });
}

// Called by js/highlight.js once highlight.js has loaded: colour the page as it is now.
function hlReady() {
  highlightCode();
  document.querySelectorAll("textarea.hl-on").forEach((ta) => ta.dispatchEvent(new Event("hl-ready")));
}
