"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type SkillNode = { name: string; detail: string };

const paths: { name: string; nodes: SkillNode[] }[] = [
  {
    name: "FOUNDATIONS",
    nodes: [
      { name: "Programming", detail: "Programming fundamentals and the logic behind small programs." },
      { name: "AI fundamentals", detail: "Coursework and experiments in introductory AI." },
    ],
  },
  {
    name: "SYSTEMS",
    nodes: [
      { name: "Windows setup", detail: "Windows installation and configuration." },
      { name: "Troubleshooting", detail: "Technical troubleshooting, one cause at a time." },
    ],
  },
  {
    name: "BUILDING",
    nodes: [
      { name: "AI workflows", detail: "AI agents and assisted workflows as practical tools." },
      { name: "Web projects", detail: "Web project development, including this portfolio." },
    ],
  },
];

const energy = 70;

export function NowSectionV2() {
  const [selected, setSelected] = useState(0);
  const [entered, setEntered] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setEntered(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(map);
    return () => observer.disconnect();
  }, []);

  return <section id="now" className="content-section now-section now-v2" aria-labelledby="now-title">
    <div className="section-head reveal">
      <p className="section-index">04 / RIGHT NOW</p>
      <h2 id="now-title" className="section-title">The skills I’m building.</h2>
      <p className="section-lead">A living map of what I study and practice. Select a node to read more.</p>
    </div>

    <div ref={mapRef} className={`now-v2-map${entered ? " is-entered" : ""}`}>
      <div className="now-v2-topline" aria-hidden="true"><span>AN.OS / 04</span><span>LIVE SKILL MAP</span><span>06 / 06</span></div>
      <div className="now-v2-origin">
        <div className="now-v2-origin-mark" aria-hidden="true"><span /></div>
        <div className="now-v2-origin-copy">
          <span className="now-v2-kicker">01 / CURRENT PATH</span>
          <strong>Computer Science + AI</strong>
          <small>Arab Open University · Jeddah</small>
        </div>
        <div className="now-v2-energy">
          <div className="now-v2-energy-copy"><span>CURRENT ENERGY</span><strong>{energy}%</strong></div>
          <div className="now-v2-energy-bar" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={energy} aria-label="Current energy" style={{ "--energy": `${energy}%` } as CSSProperties}>
            <span className="now-v2-energy-fill" aria-hidden="true"><span className="now-v2-heatwave" /></span>
          </div>
        </div>
      </div>

      <div className="now-v2-paths" aria-label="Skill paths">
        {paths.map((path, pathIndex) => <div className="now-v2-path" key={path.name}>
          <div className="now-v2-path-heading"><span className="now-v2-path-index">0{pathIndex + 1}</span><h3>{path.name}</h3><span className="now-v2-path-count">02 NODES</span></div>
          <div className="now-v2-node-list">
            {path.nodes.map((node, nodeIndex) => {
              const index = pathIndex * 2 + nodeIndex;
              const active = selected === index;
              const readoutId = `now-v2-readout-${index}`;
              return <div className={`now-v2-node-slot${active ? " is-active" : ""}`} key={node.name}>
                <button type="button" className={`now-v2-node${active ? " is-selected" : ""}`} aria-expanded={active} aria-controls={active ? readoutId : undefined} onClick={() => setSelected(index)}>
                  <span className="now-v2-node-glyph" aria-hidden="true"><span /></span>
                  <span className="now-v2-node-body"><span>0{index + 1} / SKILL</span><strong>{node.name}</strong></span>
                  <span className="now-v2-node-arrow" aria-hidden="true">↗</span>
                </button>
                {active && <div id={readoutId} className="now-v2-readout" role="region" aria-label={`${node.name} detail`}>
                  <span className="now-v2-readout-label">SELECTED NODE <strong>0{index + 1} / 06</strong></span>
                  <p>{node.detail}</p>
                </div>}
              </div>;
            })}
          </div>
        </div>)}
      </div>
    </div>
  </section>;
}
