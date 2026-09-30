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
  const [query, setQuery] = useState("");
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
  const words = query.toLocaleLowerCase().match(/[a-z0-9]{2,}/g) ?? [];
  const terms = [...new Set(words.filter(word => !["what", "with", "that", "this", "have", "does", "about", "from", "your", "could", "would", "there", "their", "where", "when", "do", "is", "of", "to", "in", "an", "the", "me"].includes(word)))];
  const retrieved = terms.length ? brainEntries.map(entry => {
    const heading = (`${entry.title} ${entry.category} ${entry.type}`.toLocaleLowerCase().match(/[a-z0-9]+/g) ?? []);
    const body = (entry.paragraphs.join(" ").toLocaleLowerCase().match(/[a-z0-9]+/g) ?? []);
    const contains = (tokens: string[], term: string) => tokens.some(token => token === term || (term.length >= 4 && token.startsWith(term)));
    const score = terms.reduce((total, term) => total + (contains(heading, term) ? 3 : 0) + (contains(body, term) ? 1 : 0), 0);
    return { entry, score };
  }).filter(result => result.score > 0).sort((a, b) => b.score - a.score).slice(0, 3) : [];

  return <div className="brain-ask" aria-labelledby="brain-ask-title">
    <div className="brain-ask-top">
      <h4 id="brain-ask-title">Ask My Brain</h4>
      <span className="brain-ask-wishes">Guided questions</span>
    </div>
    <p className="brain-ask-label">Search the published thoughts, or choose a guided question.</p>
    <label className="brain-search-label" htmlFor="brain-ask-query">ASK THE ARCHIVE</label>
    <input id="brain-ask-query" className="brain-search" type="search" value={query} onChange={event => { setQuery(event.target.value); setAnswer(null); }} placeholder="What has Adnan written about…" autoComplete="off" />
    {query.trim() && <div className="brain-ask-retrieval" role="status">
      <span className="brain-ask-retrieval-label">{retrieved.length ? "RELATED PUBLISHED THOUGHTS" : "NO DIRECT MEMORY FOUND"}</span>
      {retrieved.length ? retrieved.map(({ entry }) => <button type="button" key={entry.id} onClick={() => onOpenSource(entry.id)}>{entry.title}<span>{entry.type} / {entry.category} ↗</span></button>) : <p>The archive has no matching published thought yet.</p>}
    </div>}
    <p className="brain-ask-label">GUIDED QUESTIONS / SOURCED ANSWERS</p>
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
