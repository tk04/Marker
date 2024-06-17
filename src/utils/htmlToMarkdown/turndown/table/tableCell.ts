import { Rule } from "turndown";

export default {
  filter: ["th", "td"],
  replacement: function (content) {
    return "| " + content.trim() + " ";
  },
} as Rule;
