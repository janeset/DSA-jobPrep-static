// Runs Python (Pyodide) off the page, so a slow or endless solution can be stopped with
// worker.terminate() instead of freezing the tab. Each message is { id, code }; the reply is
// { id, value, out } or { id, err, out }, where out is everything the code printed.
importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");

const ready = loadPyodide();

onmessage = async (e) => {
  const { id, code } = e.data;
  let py;
  try { py = await ready; } catch (err) { postMessage({ id, err: "Could not load Python (offline?)", out: "" }); return; }
  let out = "";
  py.setStdout({ batched: (t) => (out += t + "\n") });
  py.setStderr({ batched: (t) => (out += t + "\n") });
  try {
    const v = await py.runPythonAsync(code);
    postMessage({ id, value: v === undefined || v === null ? null : String(v), out });
  } catch (err) {
    postMessage({ id, err: String(err.message || err), out });
  }
};
