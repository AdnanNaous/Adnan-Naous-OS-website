"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ContactIncident.module.css";

type Phase = "confirm" | "pending" | "incident" | "destroying" | "locked";

export default function ContactIncident({ emailHref, onClose, onFix }: {
  emailHref: string;
  onClose: () => void;
  onFix: () => void;
}) {
  const [portal] = useState<HTMLDivElement | null>(() => typeof document === "undefined" ? null : document.createElement("div"));
  const [phase, setPhase] = useState<Phase>("confirm");
  const [command, setCommand] = useState("");
  const [error, setError] = useState("");
  const dialog = useRef<HTMLDivElement>(null);
  const commandInput = useRef<HTMLInputElement>(null);
  const phaseRef = useRef(phase);
  const closeRef = useRef(onClose);

  useEffect(() => { phaseRef.current = phase; closeRef.current = onClose; }, [phase, onClose]);

  useEffect(() => {
    if (!portal) return;
    document.body.appendChild(portal);
    return () => portal.remove();
  }, [portal]);

  useEffect(() => {
    if (!portal) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const siblings = Array.from(document.body.children).filter(node => node !== portal);
    const previousInert = siblings.map(node => (node as HTMLElement).inert);
    siblings.forEach(node => { (node as HTMLElement).inert = true; });
    document.body.style.overflow = "hidden";

    const keepFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !portal.contains(event.target)) {
        (commandInput.current ?? dialog.current)?.focus();
      }
    };
    const trapKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (phaseRef.current === "confirm") closeRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialog.current) return;
      const focusable = Array.from(dialog.current.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled])"));
      if (!focusable.length) { event.preventDefault(); dialog.current.focus(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialog.current.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.current.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener("focusin", keepFocus);
    document.addEventListener("keydown", trapKeys);
    return () => {
      document.removeEventListener("focusin", keepFocus);
      document.removeEventListener("keydown", trapKeys);
      siblings.forEach((node, index) => { (node as HTMLElement).inert = previousInert[index]; });
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [portal]);

  useEffect(() => {
    if (!portal) return;
    if (phase === "incident") commandInput.current?.focus();
    else dialog.current?.focus();
  }, [portal, phase]);

  useEffect(() => {
    if (phase !== "pending" && phase !== "destroying") return;
    const timer = window.setTimeout(() => setPhase(phase === "pending" ? "incident" : "locked"), phase === "pending" ? 1000 : 1200);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const runCommand = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = command.trim().toLowerCase().replace(/\s+/g, " ");
    if (value === "fix the website") { onFix(); return; }
    if (value === "hack me") { setPhase("destroying"); return; }
    setError("COMMAND NOT RECOGNIZED. TYPE ONE OF THE TWO COMMANDS SHOWN ABOVE.");
  };

  if (!portal) return null;
  return createPortal(<div className={`${styles.overlay} ${phase === "confirm" ? styles.confirmOverlay : styles.incidentOverlay}`}>
    <div className={styles.scanlines} aria-hidden="true" />
    <div ref={dialog} className={`${styles.panel} ${phase === "confirm" ? styles.confirmPanel : styles.incidentPanel} ${phase === "destroying" ? styles.destroying : ""}`} role="dialog" aria-modal="true" aria-labelledby="contact-incident-title" aria-describedby="contact-incident-description" tabIndex={-1}>
      {phase === "confirm" ? <>
        <p className={styles.eyebrow}>AN / MAIL CHANNEL</p>
        <h2 id="contact-incident-title">Open your email app?</h2>
        <p id="contact-incident-description">Choose Yes to write an email, or No to stay here.</p>
        <div className={styles.choices}><button type="button" onClick={() => { window.location.href = emailHref; onClose(); }}>Yes, write an email</button><button type="button" onClick={() => setPhase("pending")}>No</button></div>
      </> : phase === "pending" ? <>
        <p className={styles.eyebrow}>AN / TRANSMISSION INTERRUPTED</p>
        <h2 id="contact-incident-title">Connection lost.</h2>
        <p id="contact-incident-description">Re-routing signal...</p>
      </> : phase === "incident" ? <>
        <p className={styles.eyebrow}>AN / SYSTEM OVERRIDE · 01</p>
        <h2 id="contact-incident-title">You are inside the system.</h2>
        <p id="contact-incident-description">The site is waiting for a command. Type exactly one of these:</p>
        <ul className={styles.commands}><li><code>fix the website</code><span>restore the site and return home</span></li><li><code>hack me</code><span>trigger a simulated shutdown</span></li></ul>
        <form className={styles.form} onSubmit={runCommand}><label htmlFor="contact-incident-command">SYSTEM COMMAND</label><div className={styles.inputLine}><span aria-hidden="true">&gt;</span><input ref={commandInput} id="contact-incident-command" autoComplete="off" autoCapitalize="off" spellCheck={false} value={command} onChange={event => { setCommand(event.target.value); setError(""); }} /><button type="submit">Enter ↵</button></div></form>
        {error && <p className={styles.error} role="status">{error}</p>}
      </> : phase === "destroying" ? <>
        <p className={styles.eyebrow}>AN / SYSTEM OVERRIDE · 02</p>
        <h2 id="contact-incident-title">Self-destruct sequence</h2>
        <p id="contact-incident-description">Simulating system shutdown...</p>
        <div className={styles.shutdownBar} aria-hidden="true"><span /></div>
      </> : <>
        <p className={styles.eyebrow}>AN / SIGNAL TERMINATED</p>
        <h2 id="contact-incident-title" className={styles.errorCode}>404</h2>
        <p id="contact-incident-description">System unavailable. Refresh the page to start a new session.</p>
      </>}
    </div>
  </div>, portal);
}
