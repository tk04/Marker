import styles from "@/components/Editor/styles.module.css";
import CharacterCount from "@tiptap/extension-character-count";
import BubbleMenu from "@tiptap/extension-bubble-menu";

import { useEditor, ReactNodeViewRenderer } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import StarterKit from "@tiptap/starter-kit";
import Video from "@/components/Editor/extensions/Video";
import Code from "@tiptap/extension-code";
import Placeholder from "@tiptap/extension-placeholder";

import ImageView from "@/components/Editor/NodeViews/Image/Image";
import CodeBlockLowlight from "@/components/Editor/extensions/CodeBlockLowlight";
import { RichTextLink } from "@/components/Editor/extensions/link-text";

interface props {
  content: string;
  onUpdate?: () => void;
  folderPath: string;
}
const useTextEditor = ({ content, onUpdate, folderPath }: props) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: `prose h-full ${styles.ProseMirror}`,
      },
    },
    extensions: [
      BubbleMenu.configure({
        element: document.querySelector(".menu") as HTMLElement,
      }),
      Image.extend({
        addNodeView() {
          return ReactNodeViewRenderer(ImageView, {
            className: `${styles["node-image"]}`,
          });
        },
        addAttributes() {
          return {
            ...this.parent?.(),
            folderPath: {
              default: folderPath,
            },
            imgPath: {
              default: null,
              parseHTML: (element) => {
                return element.getAttribute("src");
              },
            },
          };
        },
        renderHTML({ HTMLAttributes }) {
          let { imgPath, ...props } = HTMLAttributes;
          return [
            "img",
            {
              ...props,
              src: imgPath,
            },
          ];
        },
        addInputRules() {
          return [
            {
              find: /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/,
              type: this.type,
              handler({ state, range, match }) {
                const { tr } = state;
                const { $from } = state.selection;
                const start = range.from;
                let end = range.to;

                const isEmptyLine =
                  $from.parent.textContent.trim() === match[0].slice(0, -1);
                if (isEmptyLine) {
                  //@ts-ignore
                  const node = this.type.create({
                    src: match[3],
                    alt: match[2],
                    title: match[4],
                  });
                  tr.insert(start - 1, node).delete(
                    tr.mapping.map(start),
                    tr.mapping.map(end),
                  );
                }

                tr.scrollIntoView();
              },
            },
          ];
        },
      }),
      CharacterCount,
      OrderedList,
      BulletList,
      ListItem,
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

      RichTextLink.configure({
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
