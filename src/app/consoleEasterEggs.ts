type ANOSConsole = Readonly<{
  help: () => string;
  signal: () => string;
}>;

declare global {
  interface Window {
    ANOS?: ANOSConsole;
  }
}

export function installConsoleEasterEggs() {
  if (window.ANOS) return;

  // If you're reading this, the interface already worked.
  window.ANOS = Object.freeze({
    help: () => "AN/OS // FICTIONAL MAINTENANCE CHANNEL\nhelp() — this index\nsignal() — locate a memory fragment",
    signal: () => "/an-os/memory-fragment.txt",
  });

  console.info("AN/OS // INTERNAL TERMINAL\nUnauthorized curiosity detected.\nYou found the maintenance channel.\nTry ANOS.help()");
}
