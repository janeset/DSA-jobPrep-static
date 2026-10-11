// highlight.js, self-hosted: just the core and the three languages the app shows (about 30 KB
// instead of the 120 KB full build). Files in js/vendor/highlight/ are highlight.js 11.9.0 from cdnjs,
// unmodified (checked against cdnjs's published SHA-512 hashes). A module, so it runs after the app's
// first render; codecolors.js then colours whatever is on the page.
import hljs from "./vendor/highlight/core.min.js";
import python from "./vendor/highlight/python.min.js";
import java from "./vendor/highlight/java.min.js";
import csharp from "./vendor/highlight/csharp.min.js";

hljs.registerLanguage("python", python);
hljs.registerLanguage("java", java);
hljs.registerLanguage("csharp", csharp);
window.hljs = hljs;
if (typeof hlReady === "function") hlReady();
