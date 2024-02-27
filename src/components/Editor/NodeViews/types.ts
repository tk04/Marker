import { Node } from "@tiptap/pm/model";
import { Editor } from "@tiptap/react";
export default interface props {
  node: Node & { attrs: { articleId: number; blogId: number } };
  selected: boolean;
  updateAttributes: (attrs: object) => void;
  editor: Editor;
  getPos: () => number;
  deleteNode: () => void;
}
