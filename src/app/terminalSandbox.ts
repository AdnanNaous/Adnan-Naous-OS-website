// Snippets run in a worker created by an opaque-origin sandboxed iframe.
// The iframe CSP blocks network and storage; the parent removes it after 3s.
const workerSource = `self.onmessage = async ({ data }) => {
  const lines = [];
  const format = value => {
    if (typeof value === "string") return value;
    try { return JSON.stringify(value); } catch { return String(value); }
  };
  const print = (...values) => {
    if (lines.length < 30) lines.push(values.map(format).join(" ").slice(0, 400));
  };
  const console = { log: print, info: print, warn: print, error: print };
  try {
    const result = await new Function("console", "print", '"use strict";\\n' + data.code)(console, print);
    if (result !== undefined) print(result);
    self.postMessage({ lines: lines.length ? lines : ["Finished. Use print(...) or console.log(...) to show output."] });
  } catch (error) {
    self.postMessage({ lines: [...lines, String(error).slice(0, 400)] });
  }
};`;

const documentSource = `<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' blob:; worker-src blob:; connect-src 'none'; img-src 'none'; media-src 'none'; font-src 'none'; form-action 'none'; base-uri 'none'">
<script>
const source = ${JSON.stringify(workerSource)};
addEventListener("message", event => {
  if (event.source !== parent || event.data?.type !== "run") return;
  const { token, code } = event.data;
  try {
    const url = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
    const worker = new Worker(url);
    worker.onmessage = result => {
      parent.postMessage({ type: "result", token, lines: result.data.lines }, "*");
      worker.terminate(); URL.revokeObjectURL(url);
    };
    worker.onerror = () => {
      parent.postMessage({ type: "result", token, lines: ["JavaScript worker failed to start."] }, "*");
      worker.terminate(); URL.revokeObjectURL(url);
    };
    worker.postMessage({ code });
  } catch (error) {
    parent.postMessage({ type: "result", token, lines: [String(error)] }, "*");
  }
});
</script>`;

export function runSandboxedCode(code: string, host: HTMLDivElement, onResult: (lines: string[]) => void): () => void {
  if (code.length > 4000) { onResult(["Keep snippets under 4,000 characters."]); return () => {}; }
  const token = crypto.randomUUID();
  const frame = document.createElement("iframe");
  frame.title = "Isolated JavaScript runner";
  frame.setAttribute("sandbox", "allow-scripts");
  frame.setAttribute("aria-hidden", "true");
  frame.style.display = "none";
  frame.srcdoc = documentSource;
  let finished = false;
  const cleanup = () => { clearTimeout(timeout); removeEventListener("message", receive); frame.remove(); };
  const finish = (lines: string[]) => {
    if (finished) return;
    finished = true;
    cleanup();
    onResult(lines);
  };
  const receive = (event: MessageEvent) => {
    if (event.source !== frame.contentWindow || event.data?.type !== "result" || event.data.token !== token) return;
    const lines = Array.isArray(event.data.lines)
      ? event.data.lines.filter((line: unknown): line is string => typeof line === "string").slice(0, 30).map((line: string) => line.slice(0, 400))
      : ["Invalid runner output."];
    finish(lines);
  };
  addEventListener("message", receive);
  frame.onload = () => frame.contentWindow?.postMessage({ type: "run", token, code }, "*");
  host.appendChild(frame);
  const timeout = setTimeout(() => finish(["Stopped after 3 seconds. Try a shorter snippet."]), 3000);
  return cleanup;
}
