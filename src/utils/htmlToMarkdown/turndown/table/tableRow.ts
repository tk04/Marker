import { Rule } from "turndown";

export default {
  filter: "tr",

  replacement: function (content, node) {
    let body = content;
    let sep = "";
    const isHeader = node.children[0].nodeName == "TH";
    if (isHeader) {
      sep = content.replace(/[^|]/g, "-");
    }
    body += " |";
    if (sep != "") {
      body += "\n" + sep + "|";
    }
    return "\n" + body + "\n";
  },
} as Rule;
