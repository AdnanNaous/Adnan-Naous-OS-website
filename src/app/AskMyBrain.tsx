"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { brainEntries } from "../data/brain";

type Source = { id: string; title: string };
type AskResponse = { answer: string; sources: Source[]; remaining: number; resetAt?: string };

export function AskMyBrain({ onOpenSource }: { onOpenSource: (id: string) => void }) {
  const [question, setQuestion] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [answer, setAnswer] = useState<AskResponse | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [wishStatus, setWishStatus] = useState<"checking" | "ready" | "unavailable">("checking");
  const submitting = useRef(false);

  const loadWishes = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch("/api/brain/ask", { signal });
      if (!response.ok) throw new Error("Status unavailable");
      const data: { remaining?: unknown } = await response.json();
      if (typeof data.remaining !== "number") throw new Error("Invalid status");
      setRemaining(data.remaining);
      setWishStatus("ready");
    } catch {
      if (!signal?.aborted) {
        setRemaining(null);
        setWishStatus("unavailable");
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve().then(() => loadWishes(controller.signal));
    return () => controller.abort();
  }, [loadWishes]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = question.trim();
    if (!text || text.length > 240 || submitting.current || wishStatus !== "ready" || remaining === 0) return;
    submitting.current = true;
    setBusy(true);
    setError("");
    setAnswer(null);
    try {
      const response = await fetch("/api/brain/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      const data = await response.json();
      if (typeof data.remaining === "number") setRemaining(data.remaining);
      if (!response.ok) {
        if (response.status === 429) setRemaining(0);
        else if (response.status === 400 && typeof data.error === "string" && ["That thought isn't in my Brain yet.", "That question has already been asked recently.", "Ask a short Brain question."].includes(data.error)) setError(data.error);
        else setError("The Brain couldn't answer right now. Please try again later.");
        return;
      }
      if (typeof data.answer !== "string" || !Array.isArray(data.sources)) throw new Error("Invalid answer");
      setAnswer(data as AskResponse);
      setQuestion("");
    } catch {
      setError("The Brain couldn't answer right now. Please try again later.");
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  const sourceEntries = answer?.sources.flatMap(source => {
    const entry = brainEntries.find(item => item.id === source.id);
    return entry ? [entry] : [];
  }) ?? [];

  return <div className="brain-ask" aria-labelledby="brain-ask-title">
    <div className="brain-ask-top">
      <h4 id="brain-ask-title">Ask My Brain</h4>
      <span className="brain-ask-wishes" role="status">{wishStatus === "unavailable" ? "Wishes unavailable" : wishStatus === "checking" ? "✦ Checking wishes…" : remaining === 0 ? "No wishes left. Come back later." : `✦ ${remaining} ${remaining === 1 ? "wish" : "wishes"} remaining`}</span>
    </div>
    {wishStatus === "unavailable" && <button type="button" className="brain-ask-retry" onClick={() => { setWishStatus("checking"); setError(""); void loadWishes(); }}>Retry wish check ↗</button>}
    <form className="brain-ask-form" onSubmit={submit}>
      <label className="brain-ask-label" htmlFor="brain-ask-question">Ask about a published thought</label>
      <div className="brain-ask-controls">
        <input id="brain-ask-question" type="text" value={question} onChange={event => setQuestion(event.target.value)} maxLength={240} autoComplete="off" placeholder="What does Adnan think about…?" disabled={busy || wishStatus !== "ready" || remaining === 0} />
        <button type="submit" disabled={busy || wishStatus !== "ready" || !question.trim() || remaining === 0}>{busy ? "Thinking…" : "Ask ↗"}</button>
      </div>
    </form>
    {error && <p className="brain-ask-message" role="alert">{error}</p>}
    {answer && <div className="brain-ask-response" aria-live="polite">
      <p>{answer.answer}</p>
      {sourceEntries.length > 0 && <div className="brain-ask-sources"><span>FROM THE ARCHIVE</span>{sourceEntries.map(entry => <button type="button" key={entry.id} onClick={() => onOpenSource(entry.id)}>{entry.title} ↗</button>)}</div>}
    </div>}
  </div>;
}
