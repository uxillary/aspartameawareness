// TEXT-ONLY remark plugin: convert markdown image nodes to MDX <SmartImage .../>
import { visit } from "unist-util-visit";

export default function remarkSmartImage() {
  return (tree) => {
    visit(tree, "image", (node, index, parent) => {
      if (!parent || typeof index !== "number") return;
      const alt = node.alt || "";
      const src = node.url || "";
      const caption = alt;
      parent.children[index] = {
        type: "mdxJsxFlowElement",
        name: "SmartImage",
        attributes: [
          { type: "mdxJsxAttribute", name: "src", value: src },
          { type: "mdxJsxAttribute", name: "alt", value: alt },
          { type: "mdxJsxAttribute", name: "caption", value: caption }
        ],
        children: []
      };
    });
  };
}
