"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";
import { AICoreFallback } from "./AICoreFallback";
import styles from "./AICore.module.css";

const DynamicAICoreCanvas = dynamic(
  () => import("./AICoreCanvas").then((module) => module.AICoreCanvas),
  {
    ssr: false,
    loading: () => <AICoreFallback />,
  },
);

class CoreErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    // The static optical fallback is intentional; no semantic content depends on WebGL.
  }

  render() {
    return this.state.failed ? <AICoreFallback /> : this.props.children;
  }
}

export function AICore() {
  return (
    <div className={`${styles.stage} ds-glass ds-glass-orb-shell`} aria-hidden="true">
      <CoreErrorBoundary>
        <DynamicAICoreCanvas />
      </CoreErrorBoundary>
      <span className={styles.edgeLight} />
    </div>
  );
}
