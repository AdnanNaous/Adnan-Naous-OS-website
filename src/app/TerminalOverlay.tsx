"use client";

import { useEffect, useRef, useState } from "react";
import { copy, projects } from "@/data/portfolio";
import { cvText } from "@/data/cvText";
import { runSandboxedCode, runSandboxedDots } from "./terminalSandbox";
import styles from "./TerminalOverlay.module.css";
import { subscribeMotion } from "@/motion/runtime";

type Entry = { command?: string; lines: string[] };

const welcome = [
  "AN/OS 2026 — visitor shell",
  "Explore the site, read the CV, or write and run code. Type help for commands.",
  "JavaScript runs locally; Java and Python use an embedded external compiler.",
];
const startingDotCode = `function pixel(x, y, t) {
  const radius = Math.hypot(x, y);
  const angle = Math.atan2(y, x);
  const ripple = Math.sin(angle * 5 - t * Math.PI * 2) * 0.08;
  return Math.abs(radius - 0.58 - ripple) < 0.055
      || Math.abs(radius - 0.27 + Math.sin(t * 8) * 0.05) < 0.05;
}`;

export default function TerminalOverlay({ onClose, initialDocument }: { onClose: () => void; initialDocument?: string }) {
  const [entries, setEntries] = useState<Entry[]>([{ lines: welcome }, ...(initialDocument === "cv" ? [{ command: "cat cv.txt", lines: cvText }] : [])]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [codeOpen, setCodeOpen] = useState(false);
  const [externalLanguage, setExternalLanguage] = useState<"java" | "python" | null>(null);
  const [dotsOpen, setDotsOpen] = useState(false);
  const [dotFrame, setDotFrame] = useState(0);
  const [dotCode, setDotCode] = useState(startingDotCode);
  const [dotFrames, setDotFrames] = useState<string[]>([]);
  const [dotError, setDotError] = useState("");
  const [code, setCode] = useState('console.log("Hello, visitor.");\nprint(1 + 1);');
  const [codeOutput, setCodeOutput] = useState<string[]>(["Ready. Edit the JavaScript, then select Run code."]);
  const input = useRef<HTMLInputElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const editor = useRef<HTMLTextAreaElement>(null);
  const compilerFrame = useRef<HTMLIFrameElement>(null);
  const sandboxHost = useRef<HTMLDivElement>(null);
  const cleanupRun = useRef<(() => void) | null>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (matchMedia("(pointer: fine)").matches) input.current?.focus({ preventScroll: true });
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const focusable = [...document.querySelectorAll<HTMLElement>(".terminal-window button,.terminal-window input,.terminal-window textarea")];
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    addEventListener("keydown", closeOnEscape);
    return () => { document.body.style.overflow = overflow; removeEventListener("keydown", closeOnEscape); previous?.focus({ preventScroll: true }); };
  }, [onClose]);

  useEffect(() => { if (screen.current) screen.current.scrollTop = screen.current.scrollHeight; }, [entries]);
  useEffect(() => { if (codeOpen) editor.current?.focus({ preventScroll: true }); }, [codeOpen]);
  useEffect(() => () => cleanupRun.current?.(), []);
  useEffect(() => {
    if (!dotsOpen || !dotFrames.length || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last = 0;
    return subscribeMotion(frame => {
      if (frame.time - last < .075) return;
      last = frame.time;
      setDotFrame(value => value + 1);
    }, { continuous: true, foreground: true });
  }, [dotsOpen, dotFrames.length]);

  const executeDots = (source: string) => {
    cleanupRun.current?.();
    if (!sandboxHost.current) return;
    setDotError("Compiling dot frames…");
    cleanupRun.current = runSandboxedDots(source, sandboxHost.current, (frames, error) => {
      setDotFrames(frames);
      setDotFrame(0);
      setDotError(error);
      cleanupRun.current = null;
    });
  };

  const openCode = () => {
    setExternalLanguage(null); setDotsOpen(false);
    setCodeOpen(true);
    setEntries(items => [...items, { command: "code", lines: ["JavaScript playground opened below. Output appears beside the editor."] }]);
  };

  const executeCode = () => {
    cleanupRun.current?.();
    if (!sandboxHost.current) return;
    setCodeOutput(["Running in isolated sandbox…"]);
    cleanupRun.current = runSandboxedCode(code, sandboxHost.current, lines => {
      setCodeOutput(lines);
      cleanupRun.current = null;
    });
  };

  const run = (raw: string) => {
    const command = raw.trim().replace(/\s+/g, " ");
    if (!command) return;
    setHistory(items => [...items.slice(-49), command]);
    setHistoryIndex(-1);
    setValue("");
    const key = command.toLowerCase();
    if (key === "clear") { setEntries([]); return; }
    if (key === "exit" || key === "quit") { onClose(); return; }
    if (key === "code" || key === "js") { openCode(); return; }
    if (key === "java" || key === "python") { setCodeOpen(false); setDotsOpen(false); setExternalLanguage(key); setEntries(items => [...items, { command, lines: [`${key.toUpperCase()} compiler opened below. Code runs through OneCompiler, outside this site's sandbox.`] }]); return; }
    if (key === "dots" || key === "dot" || key === "dots orbit") { setCodeOpen(false); setExternalLanguage(null); setDotsOpen(true); setEntries(items => [...items, { command, lines: ["Dot lab opened. Edit pixel(x, y, t), then run the script to animate character frames."] }]); executeDots(dotCode); return; }
    let lines: string[];
    if (key === "help" || key === "?") lines = [
      "help             Show this command list",
      "whoami           Short introduction",
      "ls               List available files",
      "cat cv.txt       Read CV text extracted from the hosted PDF",
      "cat story.txt    Read the four-part story",
      "cat projects     List current projects",
      "open cv.pdf      Read the CV here in the terminal",
      "open work        Jump to selected work",
      "open contact     Jump to contact",
      "search <words>   Search DuckDuckGo in a new tab",
      "code             Open the JavaScript playground",
      "python           Run real Python in an embedded compiler",
      "java             Run real Java in an embedded compiler",
      "dots             Edit and run a dot-matrix animation script",
      "sudo             Explain browser-shell permissions",
      "date             Current local time",
      "history          Show recent commands",
      "clear            Clear the screen",
      "exit             Close the terminal",
    ];
    else if (key === "whoami") lines = ["Adnan Naous / CS + AI student / building to learn."];
    else if (key === "ls") lines = ["cv.txt    story.txt    projects    cv.pdf"];
    else if (key === "sudo" || key.startsWith("sudo ")) lines = ["No administrator privileges exist in this visitor shell.", "Use code, python, or java to run code in their isolated editors."];
    else if (key === "cat cv.txt" || key === "open cv.pdf") lines = cvText;
    else if (key === "cat cv.json" || key === "cv") lines = cvText;
    else if (key === "cat story.txt") lines = copy.en.story.map((beat, index) => `0${index + 1}  ${beat}`);
    else if (key === "cat projects") lines = projects.map((project, index) => `0${index + 1}  ${project.title.en} — ${project.summary.en}`);
    else if (key === "date") lines = [new Date().toLocaleString("en", { dateStyle: "full", timeStyle: "medium" })];
    else if (key === "history") lines = history.length ? history.slice(-20).map((item, index) => `${index + 1}  ${item}`) : ["No commands yet."];
    else if (key === "open work" || key === "open contact") {
      const target = key.split(" ")[1];
      onClose();
      requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }));
      return;
    } else if (key === "search") lines = ["Usage: search <words> — opens DuckDuckGo in a new tab."];
    else if (key.startsWith("search ")) {
      const query = command.slice(7).trim();
      window.open(`https://duckduckgo.com/?q=${encodeURIComponent(query)}`, "_blank", "noopener,noreferrer");
      lines = [`Searching DuckDuckGo for: ${query}`, "Results open in a new tab."];
    } else lines = [`Command not found: ${command}`, "Type help for supported commands."];
    setEntries(items => [...items, { command, lines }]);
  };

  return <div className="terminal-overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="terminal-window" role="dialog" aria-modal="true" aria-label="AN/OS terminal">
      <header className="terminal-window-head"><span>AN/OS · VISITOR SHELL</span><span>LOCAL SESSION / 2026</span><button type="button" onClick={onClose} aria-label="Close terminal">×</button></header>
      <div className={styles.toolbar} aria-label="Terminal shortcuts">
        <button type="button" onClick={() => run("help")}>⌘ Help</button>
        <button type="button" onClick={openCode}>⌘ Write code</button>
        <button type="button" onClick={() => { setValue("search "); input.current?.focus(); }}>⌕ Search web</button>
        <button type="button" onClick={() => run("dots")}>● Dot motion</button>
        <button type="button" onClick={() => run("python")}>⌘ Python</button>
        <button type="button" onClick={() => run("java")}>⌘ Java</button>
      </div>
      <div className="terminal-window-screen" ref={screen} onClick={event => { if (event.target === event.currentTarget) input.current?.focus({ preventScroll: true }); }}>
        {entries.map((entry, index) => <div className="terminal-entry" key={index}>{entry.command && <div className="terminal-entry-command"><span>visitor@an-os:~$</span> {entry.command}</div>}{entry.lines.map((line, lineIndex) => <div className="terminal-output" key={lineIndex}>{line}</div>)}</div>)}
        <form className="terminal-input-line" onSubmit={event => { event.preventDefault(); run(value); }}><label htmlFor="terminal-input">visitor@an-os:~$</label><input id="terminal-input" ref={input} value={value} onChange={event => setValue(event.target.value)} onKeyDown={event => {
          if (event.key === "ArrowUp" && history.length) { event.preventDefault(); const next = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1); setHistoryIndex(next); setValue(history[next]); }
          if (event.key === "ArrowDown" && historyIndex >= 0) { event.preventDefault(); const next = historyIndex + 1; setHistoryIndex(next < history.length ? next : -1); setValue(next < history.length ? history[next] : ""); }
        }} autoComplete="off" autoCapitalize="off" spellCheck={false} aria-label="Terminal command" placeholder="Type a command…" /><button className={styles.submit} type="submit" aria-label="Run command">↵</button></form>
      </div>
      {codeOpen && <section className={styles.playground} aria-label="JavaScript playground">
        <div className={styles.playgroundHead}><strong>JAVASCRIPT PLAYGROUND</strong><span>Isolated · 3 second limit · no network</span><button type="button" onClick={() => { cleanupRun.current?.(); cleanupRun.current = null; setCodeOpen(false); input.current?.focus(); }} aria-label="Close code editor">×</button></div>
        <div className={styles.playgroundBody}><label className={styles.editorLabel} htmlFor="terminal-code">Your code<textarea id="terminal-code" ref={editor} value={code} onChange={event => setCode(event.target.value)} spellCheck={false} autoCapitalize="off" /></label><div className={styles.output} role="status" aria-live="polite"><span>OUTPUT</span>{codeOutput.map((line, index) => <div key={index}>{line}</div>)}</div></div>
        <button className={styles.runCode} type="button" onClick={executeCode}>▶ Run code</button>
      </section>}
      {externalLanguage && <section className={styles.compiler} aria-label={`${externalLanguage} compiler`}>
        <div className={styles.playgroundHead}><strong>{externalLanguage.toUpperCase()} / LIVE COMPILER</strong><span>Provided by OneCompiler · code is sent to their service</span><button className={styles.compilerRun} type="button" onClick={() => compilerFrame.current?.contentWindow?.postMessage({ eventType: "triggerRun" }, "https://onecompiler.com")}>▶ Run</button><button type="button" onClick={() => { setExternalLanguage(null); input.current?.focus(); }} aria-label="Close compiler">×</button></div>
        <iframe ref={compilerFrame} title={`${externalLanguage} code runner`} src={`https://onecompiler.com/embed/${externalLanguage}?theme=dark&hideLanguageSelection=true&hideNew=true&listenToEvents=true`} loading="lazy" referrerPolicy="no-referrer" allow="clipboard-write" />
      </section>}
      {dotsOpen && <section className={styles.dotLab} aria-label="Animated dot motion"><div className={styles.playgroundHead}><strong>DOT MOTION / SCRIPT 01</strong><span>18 × 54 · 32 frames · isolated JavaScript</span><button type="button" onClick={() => { cleanupRun.current?.(); setDotsOpen(false); input.current?.focus(); }} aria-label="Close dot motion">×</button></div><pre aria-label="Dot animation frame">{dotFrames[dotFrame % (dotFrames.length || 1)] ?? "Compiling frames…"}</pre><label htmlFor="terminal-dot-code">EDIT PIXEL SCRIPT<textarea id="terminal-dot-code" value={dotCode} onChange={event => setDotCode(event.target.value)} spellCheck={false} autoCapitalize="off" /></label><div className={styles.dotControls}><button type="button" onClick={() => executeDots(dotCode)}>▶ Run dot script</button><span role="status">{dotError || "Animation generated from your code. No GIF asset."}</span></div></section>}
      <div ref={sandboxHost} aria-hidden="true" />
      <footer className="terminal-window-foot"><span>↑↓ HISTORY · ESC CLOSE</span><span>JavaScript is local · Python and Java use OneCompiler · no system privileges.</span></footer>
    </section>
  </div>;
}
