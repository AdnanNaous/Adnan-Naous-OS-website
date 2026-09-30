"use client";

import { useEffect, useRef, useState } from "react";
import { subscribeMotion } from "@/motion/runtime";

type SkillNode = { name: string; detail: string };
const paths: { name: string; nodes: SkillNode[] }[] = [
  { name: "FOUNDATIONS", nodes: [
    { name: "Programming", detail: "Programming fundamentals and the logic behind small programs." },
    { name: "AI fundamentals", detail: "Coursework and experiments in introductory AI." },
  ] },
  { name: "SYSTEMS", nodes: [
    { name: "Windows setup", detail: "Windows installation and configuration." },
    { name: "Troubleshooting", detail: "Technical troubleshooting, one cause at a time." },
  ] },
  { name: "BUILDING", nodes: [
    { name: "AI workflows", detail: "AI agents and assisted workflows as practical tools." },
    { name: "Web projects", detail: "Web project development, including this portfolio." },
  ] },
];
const flat = paths.flatMap(path => path.nodes);

export function NowSectionV2() {
  const [selected, setSelected] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    let visible = false;
    const updateActivity = () => { map.dataset.motionActive = String(visible && !document.hidden); };
    const unsubscribe = subscribeMotion(frame => {
      if (frame.reduced) map.classList.add("is-entered");
    });
    if (typeof IntersectionObserver === "undefined") {
      map.classList.add("is-entered");
      return unsubscribe;
    }
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) map.classList.add("is-entered");
      updateActivity();
    }, { threshold: 0.12 });
    observer.observe(map);
    document.addEventListener("visibilitychange", updateActivity);
    return () => {
      observer.disconnect();
      unsubscribe();
      document.removeEventListener("visibilitychange", updateActivity);
    };
  }, []);

  const active = flat[selected];
  const activePath = paths[Math.floor(selected / 2)].name;
  return <section id="now" className="content-section now-section now-v2" aria-labelledby="now-title">
    <div className="section-head reveal">
      <p className="section-index">04 / RIGHT NOW</p>
      <h2 id="now-title" className="section-title">The skills I’m building.</h2>
      <p className="section-lead">A living map of what I study and practice. Select a node to read more.</p>
    </div>
    <div ref={mapRef} data-path={Math.floor(selected / 2)} className="now-v2-map">
      <div className="now-v2-topline"><span>AN.OS / 04</span><span>CURRENT PATH</span><span>SELECT A NODE / 01—06</span></div>
      <div className="now-v2-origin">
        <div><span className="now-v2-kicker">SOURCE / STUDY & PRACTICE</span><strong>Computer Science + AI</strong><small>Arab Open University · Jeddah</small></div>
      </div>
      <div className="now-v2-stage">
        <div className="now-v2-feature" aria-live="polite" aria-atomic="true">
          <div className="now-v2-feature-meta"><span>SELECTED NODE</span><span>0{selected + 1} / 06</span></div>
          <strong key={`number-${selected}`} className="now-v2-feature-number" aria-hidden="true">0{selected + 1}</strong>
          <p key={`path-${selected}`} className="now-v2-feature-path">{activePath} / CURRENT PRACTICE</p>
          <h3 key={`name-${selected}`}>{active.name}</h3>
          <p key={`detail-${selected}`} className="now-v2-feature-detail">{active.detail}</p>
          <div key={`route-${selected}`} className="now-v2-feature-route" aria-hidden="true"><span /> ROUTE ACTIVE / 0{selected + 1}</div>
        </div>
        <div className="now-v2-paths" aria-label="Skill paths">
          {paths.map((path, pathIndex) => <div className="now-v2-path" data-selected={Math.floor(selected / 2) === pathIndex} key={path.name}>
            <div className="now-v2-path-heading"><span>0{pathIndex + 1}</span><h3>{path.name}</h3><span>02 NODES</span></div>
            <div className="now-v2-node-list">
              {path.nodes.map((node, nodeIndex) => {
                const index = pathIndex * 2 + nodeIndex;
                return <button type="button" className="now-v2-node" aria-pressed={selected === index} key={node.name} onClick={() => setSelected(index)}>
                  <span className="now-v2-node-index">0{index + 1}</span>
                  <span className="now-v2-node-name">{node.name}</span>
                  <span className="now-v2-node-arrow" aria-hidden="true">↗</span>
                </button>;
              })}
            </div>
          </div>)}
        </div>
      </div>
      <div className="now-v2-energy">
        <div className="now-v2-energy-heading"><span>CURRENT ENERGY</span><strong>70%</strong></div>
        <div className="now-v2-energy-band" aria-hidden="true"><span /></div>
        <p>A snapshot of the momentum I bring to learning.</p>
      </div>
    </div>
  </section>;
}
