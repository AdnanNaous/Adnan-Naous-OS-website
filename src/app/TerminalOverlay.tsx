"use client";

import { useEffect, useRef, useState } from "react";
import { copy, projects } from "@/data/portfolio";

type Entry = { command?: string; lines: string[] };

const welcome = [
  "AN/OS 2026 — visitor shell",
  "Type help to see the available commands.",
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
  const input = useRef<HTMLInputElement>(null);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    input.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const focusable = [...document.querySelectorAll<HTMLElement>(".terminal-window button,.terminal-window input")];
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    addEventListener("keydown", closeOnEscape);
    return () => { document.body.style.overflow = overflow; removeEventListener("keydown", closeOnEscape); previous?.focus(); };
  }, [onClose]);

  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [entries]);

  const run = (raw: string) => {
    const command = raw.trim().replace(/\s+/g, " ");
    if (!command) return;
    setHistory(items => [...items, command]);
    setHistoryIndex(-1);
    setValue("");
    const key = command.toLowerCase();
    if (key === "clear") { setEntries([]); return; }
    if (key === "exit" || key === "quit") { onClose(); return; }
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
      "date             Current local time",
      "clear            Clear the screen",
      "exit             Close the terminal",
    ];
    else if (key === "whoami") lines = ["Adnan Naous / CS + AI student / building to learn."];
    else if (key === "ls") lines = ["cv.json    story.txt    projects    cv.pdf"];
    else if (key === "cat cv.json" || key === "cv") lines = cvLines;
    else if (key === "cat story.txt") lines = copy.en.story.map((beat, index) => `0${index + 1}  ${beat}`);
    else if (key === "cat projects") lines = projects.map((project, index) => `0${index + 1}  ${project.title.en} — ${project.summary.en}`);
    else if (key === "date") lines = [new Date().toLocaleString("en", { dateStyle: "full", timeStyle: "medium" })];
    else if (key === "open cv.pdf") { window.open("/documents/adnan-naous-cv.pdf", "_blank", "noopener,noreferrer"); lines = ["Opening the original CV PDF in a new tab."]; }
    else if (key === "open work" || key === "open contact") {
      const target = key.split(" ")[1];
      onClose();
      requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }));
      return;
    } else lines = [`Command not found: ${command}`, "Type help for supported commands."];
    setEntries(items => [...items, { command, lines }]);
  };

  return <div className="terminal-overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="terminal-window" role="dialog" aria-modal="true" aria-label="AN/OS terminal">
      <header className="terminal-window-head"><span>AN/OS · VISITOR SHELL</span><span>LOCAL SESSION / 2026</span><button type="button" onClick={onClose} aria-label="Close terminal">×</button></header>
      <div className="terminal-window-screen" onClick={() => input.current?.focus()}>
        {entries.map((entry, index) => <div className="terminal-entry" key={index}>{entry.command && <div className="terminal-entry-command"><span>visitor@an-os:~$</span> {entry.command}</div>}{entry.lines.map((line, lineIndex) => <div className="terminal-output" key={lineIndex}>{line}</div>)}</div>)}
        <form className="terminal-input-line" onSubmit={event => { event.preventDefault(); run(value); }}><label htmlFor="terminal-input">visitor@an-os:~$</label><input id="terminal-input" ref={input} value={value} onChange={event => setValue(event.target.value)} onKeyDown={event => {
          if (event.key === "ArrowUp" && history.length) { event.preventDefault(); const next = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1); setHistoryIndex(next); setValue(history[next]); }
          if (event.key === "ArrowDown" && historyIndex >= 0) { event.preventDefault(); const next = historyIndex + 1; setHistoryIndex(next < history.length ? next : -1); setValue(next < history.length ? history[next] : ""); }
        }} autoComplete="off" spellCheck={false} aria-label="Terminal command" /></form>
        <div ref={end} />
      </div>
      <footer className="terminal-window-foot"><span>↑↓ HISTORY · ESC CLOSE</span><span>Commands run locally in this page.</span></footer>
    </section>
  </div>;
}
