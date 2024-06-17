import { Rule } from "turndown";

export default {
  filter: "li",

  replacement: function (content, node, options) {
    content = content
      .replace(/^\n+/, "") // remove leading newlines
      .replace(/\n+$/, "\n") // replace trailing newlines with just a single one
      .replace(/\n/gm, "\n    ") // indent
      .replace(/\n\s{2,}\n/, "\n"); // remove 2 new lines seperate by 2 spaces (occurs in the task list item nodes)
    let prefix = options.bulletListMarker + " ";
    let parent = node.parentNode as HTMLElement;
    if (parent?.nodeName === "OL") {
      //@ts-ignore
      var start = parent?.getAttribute("start");
      var index = Array.prototype.indexOf.call(parent.children, node);
      prefix = (start ? Number(start) + index : index + 1) + ".  ";
    } else if (parent?.getAttribute("data-type") == "taskList") {
      const checked =
        (<HTMLElement>node).getAttribute("data-checked") == "true";
      prefix += (checked ? "[x]" : "[ ]") + " ";
      content = content.trim();
    }
    return (
      prefix + content + (node.nextSibling && !/\n$/.test(content) ? "\n" : "")
    );
  },
} as Rule;
