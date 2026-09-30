"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { brainEntries } from "../data/brain";
import { brainPrompts } from "../data/brainPrompts";

type Source = { id: string; title: string };
type AskResponse = { answer: string; sources: Source[]; remaining: number; resetAt?: string };

// Keep unlocked answers available when the archive window is closed and reopened.
const unlockedAnswers = new Map<string, AskResponse>();

export function AskMyBrain({ onOpenSource }: { onOpenSource: (id: string) => void }) {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [answer, setAnswer] = useState<AskResponse | null>(null);
  const [error, setError] = useState("");
  const [busyPromptId, setBusyPromptId] = useState<string | null>(null);
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

  async function ask(promptId: string) {
    if (submitting.current) return;
    const unlocked = unlockedAnswers.get(promptId);
    if (unlocked) {
      setAnswer(unlocked);
      setError("");
      return;
    }
    if (wishStatus !== "ready" || remaining === 0) return;
    submitting.current = true;
    setBusyPromptId(promptId);
    setError("");
    setAnswer(null);
    try {
      const response = await fetch("/api/brain/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptId }),
      });
      const data = await response.json();
      if (typeof data.remaining === "number") setRemaining(data.remaining);
      if (!response.ok) {
        if (response.status === 429) setRemaining(0);
        else if (response.status === 400 && typeof data.error === "string" && data.error === "That question has already been asked recently.") setError(data.error);
        else setError("The Brain couldn't answer right now. Please try again later.");
        return;
      }
      if (typeof data.answer !== "string" || !Array.isArray(data.sources)) throw new Error("Invalid answer");
      const result = data as AskResponse;
      unlockedAnswers.set(promptId, result);
      setAnswer(result);
    } catch {
      setError("The Brain couldn't answer right now. Please try again later.");
    } finally {
      submitting.current = false;
      setBusyPromptId(null);
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
    <p className="brain-ask-label">Guided answers from published thoughts. Choose a question:</p>
    <div className="brain-ask-prompts">
      {brainPrompts.map(prompt => <button className="brain-ask-prompt" type="button" key={prompt.id} onClick={() => void ask(prompt.id)} disabled={busyPromptId !== null || (!unlockedAnswers.has(prompt.id) && (wishStatus !== "ready" || remaining === 0))}>{busyPromptId === prompt.id ? "Opening thought…" : prompt.question} ↗</button>)}
    </div>
    {error && <p className="brain-ask-message" role="alert">{error}</p>}
    {answer && <div className="brain-ask-response" aria-live="polite">
      <p>{answer.answer}</p>
      {sourceEntries.length > 0 && <div className="brain-ask-sources"><span>FROM THE ARCHIVE</span>{sourceEntries.map(entry => <button type="button" key={entry.id} onClick={() => onOpenSource(entry.id)}>{entry.title} ↗</button>)}</div>}
    </div>}
  </div>;
}
