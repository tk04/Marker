import styles from "@/components/Editor/styles.module.css";

import { useEditor, ReactNodeViewRenderer } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Video from "@/components/Editor/extensions/Video";
import ButtonExt from "@/components/Editor/extensions/Button";
import Code from "@tiptap/extension-code";
import Placeholder from "@tiptap/extension-placeholder";

import ImageView from "@/components/Editor/NodeViews/Image/Image";
import CodeBlockLowlight from "@/components/Editor/extensions/CodeBlockLowlight";

interface props {
  content: string;
  onUpdate?: () => void;
}
const useTextEditor = ({ content, onUpdate }: props) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: `prose h-full ${styles.ProseMirror}`,
      },
    },
    extensions: [
      Image.extend({
        addNodeView() {
          return ReactNodeViewRenderer(ImageView, {
            className: `${styles["node-image"]}`,
          });
        },
        addAttributes() {
          return {
            ...this.parent?.(),
            blogId: {
              default: "",
            },
            articleId: {
              default: "",
            },
            width: {
              default: "auto",
            },
            height: {
              default: "auto",
            },
            rounded: {
              default: "0",

              parseHTML: (element) => element.getAttribute("data-rounded"),
              renderhtml: (attributes: any) => {
                return {
                  "data-rounded": attributes.rounded,
                  style: `border-radius: ${attributes.rounded}px`,
                };
              },
            },
          };
        },
        renderHTML({ HTMLAttributes }) {
          let { rounded, ...props } = HTMLAttributes;
          return [
            "div",
            {
              class: "image-container",
              style: "display: flex; justify-content: center; margin-top: 0px;",
            },
            [
              "img",
              {
                ...props,
                style: `border-radius: ${rounded}px; max-width: min(96vw, 1024px); margin: 42px auto;`,
                "data-rounded": rounded,
              },
            ],
          ];
        },
      }),
      OrderedList,
      BulletList,
      ListItem,
      ButtonExt,
      Video.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            blogId: {
              default: "",
            },
            articleId: {
              default: "",
            },
          };
        },
      }),
      Code.configure({
        HTMLAttributes: {
          class: "code",
        },
      }),
      CodeBlockLowlight,
      StarterKit.configure({
        orderedList: false,
        bulletList: false,
        listItem: false,
        codeBlock: false,
        code: false,
        heading: {
          levels: [1, 2, 3],
        },
      }),

      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "link",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing here...",
      }),
    ],
    content,
    onUpdate,
  });

  return editor;
};
export default useTextEditor;
