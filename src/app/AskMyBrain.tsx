"use client";

import { useEffect, useRef, useState } from "react";
import { brainEntries } from "../data/brain";
import { brainPromptCount, loadBrainPrompts, type BrainPrompt } from "../data/brainPrompts";
import { samplePromptIndexes } from "../data/brainPromptSampling";

type SelectedPrompt = { index: number; prompt: BrainPrompt };

async function loadQuestionGroup(current: readonly number[]): Promise<SelectedPrompt[]> {
  const indexes = samplePromptIndexes(brainPromptCount, 3, current);
  const prompts = await loadBrainPrompts(indexes);
  return indexes.map((index, position) => ({ index, prompt: prompts[position] }));
}

export function AskMyBrain({ onOpenSource }: { onOpenSource: (id: string) => void }) {
  const [questions, setQuestions] = useState<SelectedPrompt[]>([]);
  const [answer, setAnswer] = useState<BrainPrompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestSequence = useRef(0);

  // Randomize only after mount so server and first client render agree.
  useEffect(() => {
    let cancelled = false;
    const sequenceRef = requestSequence;
    const sequence = ++requestSequence.current;
    void loadQuestionGroup([]).then(group => {
      if (!cancelled && requestSequence.current === sequence) setQuestions(group);
    }).catch(() => {
      if (!cancelled && requestSequence.current === sequence) setError("Questions couldn't load. Please try again.");
    }).finally(() => {
      if (!cancelled && requestSequence.current === sequence) setLoading(false);
    });
    return () => { cancelled = true; sequenceRef.current++; };
  }, []);

  function showAnotherGroup() {
    if (loading) return;
    const sequence = ++requestSequence.current;
    const current = questions.map(item => item.index);
    setLoading(true);
    setError("");
    setAnswer(null);
    setQuestions([]);
    void loadQuestionGroup(current).then(group => {
      if (requestSequence.current === sequence) setQuestions(group);
    }).catch(() => {
      if (requestSequence.current === sequence) setError("Questions couldn't load. Please try again.");
    }).finally(() => {
      if (requestSequence.current === sequence) setLoading(false);
    });
  }

  const source = answer && brainEntries.find(entry => entry.id === answer.sourceId);

  return <div className="brain-ask" aria-labelledby="brain-ask-title">
    <div className="brain-ask-top">
      <h4 id="brain-ask-title">Ask My Brain</h4>
      <span className="brain-ask-wishes">Guided questions</span>
    </div>
    <p className="brain-ask-label">Guided answers from published thoughts. Choose a question:</p>
    {loading && questions.length === 0 && <p className="brain-ask-message" role="status">Finding questions…</p>}
    <div className="brain-ask-prompts">
      {questions.map(({ index, prompt }) => <button className="brain-ask-prompt" type="button" key={index} onClick={() => setAnswer(prompt)} disabled={loading}>{prompt.question} ↗</button>)}
    </div>
    {(questions.length > 0 || error) && <button className="brain-ask-another" type="button" onClick={showAnotherGroup} disabled={loading}>{error ? "Retry questions ↗" : "Show me another 3 ↗"}</button>}
    {error && <p className="brain-ask-message" role="alert">{error}</p>}
    {answer && <div className="brain-ask-response" aria-live="polite">
      <p>{answer.answer}</p>
      {source && <div className="brain-ask-sources"><span>FROM THE ARCHIVE</span><button type="button" onClick={() => onOpenSource(source.id)}>{source.title} ↗</button></div>}
    </div>}
  </div>;
}
