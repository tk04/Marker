import { Rule } from "turndown";

export default {
  filter: "p",

  replacement: function (content, node) {
    if (node.parentNode?.nodeName == "LI") {
      return content;
    }
    return "\n\n" + content + "\n\n";
  },
} as Rule;
