"use client";

import { useRef, useState } from "react";

export function CodeBlock({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(ref.current?.innerText ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="code-block group">
      <button type="button" onClick={copy} className="code-copy" aria-label="Kodni nusxalash">
        {copied ? "Nusxalandi" : "Nusxalash"}
      </button>
      <pre ref={ref}>{children}</pre>
    </div>
  );
}
