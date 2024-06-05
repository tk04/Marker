import { Renderer, marked } from "marked";
import { escape } from "../helpers";

const renderer: Partial<Renderer> = {
  paragraph(text) {
    // don't wrap images in p tags
    if (text.startsWith("<img")) {
      return text + "\n";
    }
    return "<p>" + text + "</p>";
  },

  // same as the marked default code renderer
  // here we just adjust it to not add a trailing new line at the end of code blocks
  code(code, infostring, escaped) {
    const lang = (infostring || "").match(/^\S*/)?.[0];

    code = code.replace(/\n$/, "");

    if (!lang) {
      return (
        "<pre><code>" + (escaped ? code : escape(code)) + "</code></pre>\n"
      );
    }

    return (
      '<pre><code class="language-' +
      escape(lang) +
      '">' +
      (escaped ? code : escape(code)) +
      "</code></pre>\n"
    );
  },
};
export default marked.use({ renderer });
