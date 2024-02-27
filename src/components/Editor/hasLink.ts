import { Mark, Node } from "@tiptap/core";

export function isLink(marks: Mark[]) {
  for (let i = 0; i < marks.length; i++) {
    //@ts-ignore
    if (marks[i].type?.name == "link") {
      return true;
    }
  }
  return false;
}

export function getLinkText(
  nodeBefore: Node | undefined,
  nodeAfter: Node | undefined
) {
  let text = "";
  if (nodeBefore) {
    //@ts-ignore
    if (isLink(nodeBefore.marks)) {
      //@ts-ignore
      text += nodeBefore.text;
    }
  }

  if (nodeAfter) {
    //@ts-ignore
    if (isLink(nodeAfter.marks)) {
      //@ts-ignore
      text += nodeAfter.text;
    }
  }
  return text;
}
