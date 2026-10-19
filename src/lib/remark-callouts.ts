import type { Blockquote, Paragraph, Root, Text } from "mdast";
import { visit } from "unist-util-visit";

/**
 * GitHub uslubidagi callout'lar:
 *   > [!TIP] Ixtiyoriy sarlavha
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

export default function remarkCallouts() {
  return (tree: Root) => {
    visit(tree, "blockquote", (node: Blockquote) => {
      const first = node.children[0] as Paragraph | undefined;
      if (first?.type !== "paragraph") return;
      const text = first.children[0] as Text | undefined;
      if (text?.type !== "text") return;
      const m = text.value.match(/^\[!(\w+)\][ \t]*([^\n]*)\n?/);
      if (!m || !TYPES[m[1].toUpperCase()]) return;

      const kind = m[1].toLowerCase();
      const title = m[2].trim() || TYPES[m[1].toUpperCase()];
      text.value = text.value.slice(m[0].length);
      if (!text.value) first.children.shift();
      if (first.children.length === 0) node.children.shift();

      const titleNode: Paragraph = {
        type: "paragraph",
        children: [{ type: "text", value: title }],
        data: { hProperties: { className: ["callout-title"] } },
      };
      node.children.unshift(titleNode);
      node.data = { ...node.data, hProperties: { className: ["callout", `callout-${kind}`] } };
    });
  };
}
