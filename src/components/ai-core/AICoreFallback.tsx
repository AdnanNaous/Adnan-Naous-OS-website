import styles from "./AICore.module.css";

export function AICoreFallback() {
  return (
    <div className={styles.fallback} aria-hidden="true">
      <svg viewBox="0 0 480 480" className={styles.fallbackSvg}>
        <defs>
          <radialGradient id="core-fallback-fill" cx="38%" cy="28%" r="68%">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.28" />
            <stop offset="0.52" stopColor="currentColor" stopOpacity="0.07" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.015" />
          </radialGradient>
          <linearGradient id="core-fallback-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#dffcff" stopOpacity="0.54" />
            <stop offset="0.32" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="0.68" stopColor="#d8cbff" stopOpacity="0.2" />
            <stop offset="1" stopColor="#efd6a8" stopOpacity="0.18" />
          </linearGradient>
        </defs>
        <circle cx="240" cy="240" r="156" fill="url(#core-fallback-fill)" stroke="url(#core-fallback-edge)" strokeWidth="1.4" />
        <circle cx="240" cy="240" r="132" fill="none" stroke="currentColor" strokeOpacity="0.11" />
        <path d="M174 118c72 24 123 78 142 158" fill="none" stroke="url(#core-fallback-edge)" strokeWidth="2.2" strokeLinecap="round" />
        <ellipse cx="240" cy="240" rx="192" ry="68" fill="none" stroke="currentColor" strokeOpacity="0.16" transform="rotate(-18 240 240)" />
        <ellipse cx="240" cy="240" rx="176" ry="54" fill="none" stroke="currentColor" strokeOpacity="0.09" transform="rotate(56 240 240)" />
        <path d="M164 277c24-72 51-112 84-121 31-8 57 20 74 87-32-26-58-33-78-20-22 13-48 31-80 54Z" fill="currentColor" fillOpacity="0.06" />
        <circle cx="83" cy="290" r="3.5" fill="currentColor" fillOpacity="0.6" />
        <circle cx="392" cy="188" r="2.6" fill="currentColor" fillOpacity="0.46" />
      </svg>
      <span className={styles.fallbackGlow} />
    </div>
  );
}
