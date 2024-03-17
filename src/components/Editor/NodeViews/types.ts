import { Node } from "@tiptap/pm/model";
import { Editor } from "@tiptap/react";
export default interface props {
  node: Node;
  selected: boolean;
  updateAttributes: (attrs: object) => void;
  editor: Editor;
  getPos: () => number;
  deleteNode: () => void;
}
