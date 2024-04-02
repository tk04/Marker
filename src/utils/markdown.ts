import TurndownService from "turndown";

import { marked } from "marked";

const escapeTest = /[&<>"']/;
const escapeReplace = new RegExp(escapeTest.source, "g");
const escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
const escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, "g");
const escapeReplacements: { [index: string]: string } = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
const getEscapeReplacement = (ch: string) => escapeReplacements[ch];
export function escape(html: string, encode?: boolean) {
  if (encode) {
    if (escapeTest.test(html)) {
      return html.replace(escapeReplace, getEscapeReplacement);
    }
  } else {
    if (escapeTestNoEncode.test(html)) {
      return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
    }
  }

  return html;
}

const service = new TurndownService({
  headingStyle: "atx",
  hr: "---",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

service.addRule("table", {
  filter: "table",

  replacement: function (content) {
    return "\n\n" + content + "\n\n";
  },
});
service.addRule("tableRow", {
  filter: "tr",

  replacement: function (_, node) {
    let body = "";
    let sep = "";
    for (let i = 0; i < node.children.length; i++) {
      const item = node.children[i];
      body += `| ${item.textContent} `;
      if (item.nodeName == "TH") {
        sep += "| " + "-".repeat(item.textContent?.length || 1) + " ";
      }
    }
    body += " |";
    if (sep != "") {
      body += "\n" + sep + " |";
    }
    return "\n" + body + "\n";
  },
});
service.addRule("paragraph", {
  filter: "p",

  replacement: function (content, node) {
    if (node.parentNode?.nodeName == "LI") {
      return content;
    }
    return "\n\n" + content + "\n\n";
  },
});
service.addRule("listItem", {
  filter: "li",

  replacement: function (content, node, options) {
    content = content
      .replace(/^\n+/, "") // remove leading newlines
      .replace(/\n+$/, "\n") // replace trailing newlines with just a single one
      .replace(/\n/gm, "\n    "); // indent
    var prefix = options.bulletListMarker + " ";
    var parent = node.parentNode;
    if (parent?.nodeName === "OL") {
      //@ts-ignore
      var start = parent?.getAttribute("start");
      var index = Array.prototype.indexOf.call(parent.children, node);
      prefix = (start ? Number(start) + index : index + 1) + ".  ";
    }
    return (
      prefix + content + (node.nextSibling && !/\n$/.test(content) ? "\n" : "")
    );
  },
});

marked.Renderer.prototype.paragraph = (text) => {
  if (text.startsWith("<img")) {
    return text + "\n";
  }
  return "<p>" + text + "</p>";
};

marked.Renderer.prototype.code = (code, infostring, escaped) => {
  const lang = (infostring || "").match(/^\S*/)?.[0];

  code = code.replace(/\n$/, "");

  if (!lang) {
    return (
      "<pre><code>" + (escaped ? code : escape(code, true)) + "</code></pre>\n"
    );
  }

  return (
    '<pre><code class="language-' +
    escape(lang) +
    '">' +
    (escaped ? code : escape(code, true)) +
    "</code></pre>\n"
  );
};
async function markdownToHtml(markdown: string) {
  return marked.parse(markdown, { breaks: true });
}
function htmlToMarkdown(html: string) {
  return service.turndown(html);
}

export { markdownToHtml, htmlToMarkdown };
