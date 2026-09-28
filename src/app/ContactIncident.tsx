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
  const dialog = useRef<HTMLDivElement>(null);
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
        dialog.current?.focus();
      }
    };
    const trapKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (phaseRef.current === "confirm") closeRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialog.current) return;
      const focusable = Array.from(dialog.current.querySelectorAll<HTMLElement>("button:not([disabled])"));
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
    dialog.current?.focus();
  }, [portal, phase]);

  useEffect(() => {
    if (phase !== "pending" && phase !== "destroying") return;
    const timer = window.setTimeout(() => setPhase(phase === "pending" ? "incident" : "locked"), phase === "pending" ? 1000 : 1200);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (!portal) return null;
  return createPortal(<div data-phase={phase} className={`${styles.overlay} ${phase === "confirm" ? styles.confirmOverlay : styles.incidentOverlay}`}>
    <div className={styles.scanlines} aria-hidden="true" />
    {phase !== "confirm" && <div className={styles.faultField} aria-hidden="true"><span>AN/OS // SIGNAL LOST<br />FRAME 001—404<br />MEMORY DESYNC</span><span>01001011 00110110<br />NO CARRIER / NO RESPONSE<br />RECOVERY MODE ACTIVE</span></div>}
    {phase !== "confirm" && <div className={styles.radar} aria-hidden="true"><span /><span /><span /><span /></div>}
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
        <p id="contact-incident-description">The channel fractured. Choose a route to continue.</p>
        <div className={styles.routeChoices}><button type="button" onClick={onFix}><span>01 / RECOVERY</span><strong>Fix the website</strong><small>Restore the signal and return home ↗</small></button><button type="button" onClick={() => setPhase("destroying")}><span>02 / OVERRIDE</span><strong>Hack me</strong><small>Trigger a simulated shutdown ↗</small></button></div>
      </> : phase === "destroying" ? <>
        <p className={styles.eyebrow}>AN / SYSTEM OVERRIDE · 02</p>
        <h2 id="contact-incident-title">Self-destruct sequence</h2>
        <p id="contact-incident-description">Simulating system shutdown...</p>
        <div className={styles.shutdownBar} aria-hidden="true"><span /></div>
      </> : <>
        <p className={styles.eyebrow}>AN / SIGNAL TERMINATED</p>
        <h2 id="contact-incident-title" className={styles.errorCode}>404</h2>
        <p id="contact-incident-description">Signal terminated. This session has ended.</p>
        <button className={styles.reboot} type="button" onClick={() => window.location.reload()}>↻ Refresh to reboot</button>
      </>}
    </div>
  </div>, portal);
}
