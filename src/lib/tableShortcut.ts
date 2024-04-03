import {
  findParentNodeClosestToPos,
  KeyboardShortcutCommand,
} from "@tiptap/core";

import { CellSelection } from "@tiptap/pm/tables";

export function isCellSelection(value: unknown): value is CellSelection {
  return value instanceof CellSelection;
}

export const DeleteCells: KeyboardShortcutCommand = ({ editor }) => {
  const { selection } = editor.state;

  if (!isCellSelection(selection)) {
    return false;
  }

  let cellCount = 0;
  const table = findParentNodeClosestToPos(
    selection.ranges[0].$from,
    (node) => {
      return node.type.name === "table";
    },
  );
  let numRows = 0;
  let numCols = 0;

  table?.node.descendants((node) => {
    if (node.type.name === "table") {
      return false;
    }
    if (node.type.name == "tableRow") {
      //@ts-ignore
      numCols = node.content.content.length;
      numRows += 1;
    }
    if (["tableCell", "tableHeader"].includes(node.type.name)) {
      cellCount += 1;
    }
  });

  const allCellsSelected = cellCount === selection.ranges.length;
  if (allCellsSelected) {
    editor.commands.deleteTable();
    return true;
  } else if (selection.ranges.length == numRows) {
    // delete column
    editor.commands.deleteColumn();
    return true;
  } else if (selection.ranges.length == numCols) {
    // delete row
    editor.commands.deleteRow();
    return true;
  }
  return false;
};
