"use client";

import { useEffect, useRef, useState } from "react";
import { copy, projects } from "@/data/portfolio";
import { runSandboxedCode } from "./terminalSandbox";
import styles from "./TerminalOverlay.module.css";

type Entry = { command?: string; lines: string[] };

const welcome = [
  "AN/OS 2026 — visitor shell",
  "Explore the site, search the web, or try JavaScript. Type help for commands.",
  "AI opens free ChatGPT in a new tab; code runs in a restricted browser sandbox.",
];

const cvLines = [
  "// cv.json — a readable version of the original PDF",
  '{ "name": "Adnan Naous",',
  '  "focus": "Computer Science + Artificial Intelligence",',
  '  "education": ["Ain Shams University / Medicine / began 2023, ~1.5 years",',
  '                "Arab Open University / CS + AI / 2025–present"],',
  '  "project": "Adnan OS — AI Showcase Featured Project",',
  '  "current_work": ["Windows Maintenance", "This Website"] }',
  "The source document is available with: open cv.pdf",
];

export default function TerminalOverlay({ onClose }: { onClose: () => void }) {
  const [entries, setEntries] = useState<Entry[]>([{ lines: welcome }]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [codeOpen, setCodeOpen] = useState(false);
  const [code, setCode] = useState('console.log("Hello, visitor.");\nprint(1 + 1);');
  const [codeOutput, setCodeOutput] = useState<string[]>(["Ready. Edit the JavaScript, then select Run code."]);
  const input = useRef<HTMLInputElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const editor = useRef<HTMLTextAreaElement>(null);
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

  const openCode = () => {
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
    let lines: string[];
    if (key === "help" || key === "?") lines = [
      "help             Show this command list",
      "whoami           Short introduction",
      "ls               List available files",
      "cat cv.json      Read the CV as code",
      "cat story.txt    Read the four-part story",
      "cat projects     List current projects",
      "open cv.pdf      Open the original CV",
      "open work        Jump to selected work",
      "open contact     Jump to contact",
      "search <words>   Search DuckDuckGo in a new tab",
      "ai [question]    Open free ChatGPT in a new tab",
      "code             Open the JavaScript playground",
      "date             Current local time",
      "history          Show recent commands",
      "clear            Clear the screen",
      "exit             Close the terminal",
    ];
    else if (key === "whoami") lines = ["Adnan Naous / CS + AI student / building to learn."];
    else if (key === "ls") lines = ["cv.json    story.txt    projects    cv.pdf"];
    else if (key === "cat cv.json" || key === "cv") lines = cvLines;
    else if (key === "cat story.txt") lines = copy.en.story.map((beat, index) => `0${index + 1}  ${beat}`);
    else if (key === "cat projects") lines = projects.map((project, index) => `0${index + 1}  ${project.title.en} — ${project.summary.en}`);
    else if (key === "date") lines = [new Date().toLocaleString("en", { dateStyle: "full", timeStyle: "medium" })];
    else if (key === "history") lines = history.length ? history.slice(-20).map((item, index) => `${index + 1}  ${item}`) : ["No commands yet."];
    else if (key === "open cv.pdf") { window.open("/documents/adnan-naous-cv.pdf", "_blank", "noopener,noreferrer"); lines = ["Opening the original CV PDF in a new tab."]; }
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
    } else if (key === "ai" || key.startsWith("ai ")) {
      const question = command.slice(2).trim();
      window.open("https://chatgpt.com/", "_blank", "noopener,noreferrer");
      lines = question ? ["Opening free ChatGPT in a new tab. Paste this question there:", question] : ["Opening free ChatGPT in a new tab. Ask your question there."];
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
        <button type="button" onClick={() => run("ai")}>✦ Free AI ↗</button>
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
      <div ref={sandboxHost} aria-hidden="true" />
      <footer className="terminal-window-foot"><span>↑↓ HISTORY · ESC CLOSE</span><span>Site commands run here · search and AI open external tabs.</span></footer>
    </section>
  </div>;
}
