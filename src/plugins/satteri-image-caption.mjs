/**
 * Render the alternative text of standalone Markdown images as a visible
 * caption. Inline images are intentionally left alone.
 */
export default {
  name: "image-caption",
  element: {
    filter: ["p"],
    visit(node, context) {
      if (node.children?.length !== 1) {
        return;
      }

      const image = node.children[0];
      const alt = image.properties?.alt;

      if (
        image.type !== "element" ||
        image.tagName !== "img" ||
        typeof alt !== "string" ||
        alt.trim().length === 0
      ) {
        return;
      }

      context.replaceNode(node, {
        type: "element",
        tagName: "figure",
        properties: { className: ["mdx-figure"] },
        children: [
          image,
          {
            type: "element",
            tagName: "figcaption",
            properties: {},
            children: [{ type: "text", value: alt.trim() }],
          },
        ],
      });
    },
  },
};
