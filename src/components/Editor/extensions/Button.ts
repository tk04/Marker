import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ButtonView from "../NodeViews/Button/Button";
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    button: {
      /**
       * Add a button
       */
      setButton: (options: { href: string; text: string }) => ReturnType;
    };
  }
}
const Button = Node.create({
  name: "button",
  group: "block",
  parseHTML() {
    return [{ tag: "button" }];
  },

  addAttributes() {
    return {
      href: {
        default: null,
        parseHTML: (element) =>
          element.querySelector("a")?.getAttribute("href"),
      },
      text: {
        default: null,
        parseHTML: (element) => element.querySelector("a")?.innerText,
      },
      color: {
        default: "white",
        parseHTML: (element) =>
          element.querySelector("a")?.getAttribute("color"),
        renderhtml: (attributes: any) => {
          return {
            style: `color: ${attributes.color}`,
          };
        },
      },
      bgColor: {
        default: "#1677ff",
        parseHTML: (element) =>
          element.querySelector("a")?.getAttribute("bgColor"),
        renderhtml: (attributes: any) => {
          return {
            style: `background-color: ${attributes.color}`,
          };
        },
      },
      width: {
        default: "fit-content",
        parseHTML: (element) =>
          element.querySelector("a")?.getAttribute("width"),
        renderhtml: (attributes: any) => {
          return {
            style: `width: ${attributes.width}`,
          };
        },
      },

      align: {
        default: "center",
        parseHTML: (element) => element.getAttribute("data-align"),
        renderhtml: (attributes: any) => {
          return {
            style: `justify-content:${attributes.align};`,
          };
        },
      },

      rounded: {
        default: "0",
        parseHTML: (element) =>
          element.querySelector("a")?.getAttribute("rounded"),
        renderhtml: (attributes: any) => {
          return {
            style: `border-radius: ${attributes.rounded}px`,
          };
        },
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    let { align, ...attrs } = HTMLAttributes;
    let style = `color: ${attrs.color}; background-color: ${attrs.bgColor}; width: ${attrs.width}; border-radius: ${attrs.rounded}px`;
    return [
      "button",
      {
        class: "button",
        "data-align": align,
        style: `justify-content:${align};`,
      },
      ["a", { ...attrs, style, target: "_blank" }, HTMLAttributes.text],
    ];
  },
  addCommands() {
    return {
      setButton:
        (options) =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: options,
            });
          },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ButtonView);
  },
});

export default Button;
