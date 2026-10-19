import type { Blockquote, Paragraph, PhrasingContent, Root, Text } from "mdast";
import { visit } from "unist-util-visit";

/**
 * GitHub uslubidagi callout'lar:
 *   > [!TIP] Ixtiyoriy sarlavha (ichida `kod`, **qalin** ham bo'lishi mumkin)
 *   > Matn...
 * Turlari: NOTE, TIP, WARNING, IMPORTANT, EXAMPLE.
 */
const TYPES: Record<string, string> = {
  NOTE: "Eslatma",
  TIP: "Maslahat",
  WARNING: "Diqqat",
  IMPORTANT: "Muhim",
  EXAMPLE: "Misol",
};

/** Paragrafning birinchi qatoridagi (birinchi "\n" gacha) inline elementlarni ajratib oladi. */
function takeFirstLine(p: Paragraph): PhrasingContent[] {
  const line: PhrasingContent[] = [];
  while (p.children.length > 0) {
    const c = p.children[0];
    if (c.type === "break") {
      p.children.shift();
      break;
    }
    if (c.type === "text") {
      const i = c.value.indexOf("\n");
      if (i >= 0) {
        const before = c.value.slice(0, i);
        if (before) line.push({ type: "text", value: before });
        c.value = c.value.slice(i + 1);
        if (!c.value) p.children.shift();
        break;
      }
      if (!c.value) {
        p.children.shift();
        continue;
      }
    }
    line.push(p.children.shift()!);
  }
  const last = line.at(-1);
  if (last?.type === "text") last.value = last.value.trimEnd();
  return line;
}

export default function remarkCallouts() {
  return (tree: Root) => {
    visit(tree, "blockquote", (node: Blockquote) => {
      const first = node.children[0];
      if (first?.type !== "paragraph") return;
      const text = first.children[0] as Text | undefined;
      if (text?.type !== "text") return;
      const m = text.value.match(/^\[!(\w+)\][ \t]*/);
      if (!m || !TYPES[m[1].toUpperCase()]) return;

      const kind = m[1].toLowerCase();
      text.value = text.value.slice(m[0].length);
      const titleNodes = takeFirstLine(first);
      if (first.children.length === 0) node.children.shift();

      const titleNode: Paragraph = {
        type: "paragraph",
        children: titleNodes.length > 0 ? titleNodes : [{ type: "text", value: TYPES[m[1].toUpperCase()] }],
        data: { hProperties: { className: ["callout-title"] } },
      };
      node.children.unshift(titleNode);
      node.data = { ...node.data, hProperties: { className: ["callout", `callout-${kind}`] } };
    });
  };
}
