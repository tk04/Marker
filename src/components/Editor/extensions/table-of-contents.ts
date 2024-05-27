import { Extension } from "@tiptap/core";
import { Node } from "@tiptap/pm/model";
import { Transaction } from "@tiptap/pm/state";
import { ReplaceAroundStep, ReplaceStep } from "@tiptap/pm/transform";
import { Editor } from "@tiptap/react";

import { v4 as uuidv4 } from "uuid";

export type TOC = { node: Node; level: number }[];

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    tableOfContents: {
      /**
       * updates the table of contents
       */
      updateTOC: () => ReturnType;
    };
  }
}

const TableOfContents = Extension.create({
  name: "tableOfContents",
  addGlobalAttributes() {
    return [
      {
        types: ["heading"],
        attributes: {
          id: {
            isRequired: true,
            renderHTML(attributes) {
              return { id: attributes.id };
            },
            parseHTML: (element) => {
              element.getAttribute("id") || uuidv4();
            },
          },
        },
      },
    ];
  },

  addStorage() {
    return {
      toc: [],
    };
  },

  //@ts-ignore
  onTransaction({
    transaction: tr,
    editor,
  }: {
    transaction: Transaction;
    editor: Editor;
  }) {
    if (!tr.docChanged || tr.getMeta("tocUpdated")) return;

    let runUpdate = false;
    if (!runUpdate) {
      for (let step of tr.steps) {
        if (!(step instanceof ReplaceStep || step instanceof ReplaceAroundStep))
          continue;
        const { from, to } = step;

        //@ts-ignore
        // check for new inserted headings
        for (let node of step.slice.content.content as Node[]) {
          if (node.type.name == "heading") {
            runUpdate = true;
            break;
          }
        }

        if (!runUpdate) {
          // check for updated/deleted headings
          tr.before.nodesBetween(from, to, (node) => {
            if (runUpdate) return false;
            if (node.type.name == "heading") runUpdate = true;
          });
        }
      }
    }

    if (runUpdate) {
      editor.commands.updateTOC();
    }
  },

  addCommands() {
    return {
      updateTOC:
        () =>
          ({ tr }) => {
            const toc: TOC = [];
            let prevLevel: number | null = null;

            tr.setMeta("tocUpdated", true);
            tr.setMeta("addToHistory", false);

            tr.doc.descendants((node, pos) => {
              if (node.type.name != "heading") return;
              let nodeId = node.attrs.id;

              if (!nodeId) {
                nodeId = uuidv4();
                tr.setNodeAttribute(pos, "id", nodeId);
              }

              let currLvl;
              if (prevLevel != null) {
                let lastVal = toc[toc.length - 1].level;
                currLvl =
                  node.attrs.level < prevLevel
                    ? node.attrs.level
                    : node.attrs.level == prevLevel
                      ? lastVal
                      : lastVal + 1;
              } else {
                currLvl = 1;
              }
              prevLevel = node.attrs.level;

              let headingNode =
                node.attrs.id != nodeId
                  ? node.type.create(
                    { ...node.attrs, id: nodeId },
                    node.content,
                    node.marks,
                  )
                  : node;

              toc.push({
                level: currLvl,
                node: headingNode,
              });
            });

            this.storage.toc = toc;
            return true;
          },
    };
  },
});

export default TableOfContents;
