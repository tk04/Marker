import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

import { HiPlus } from "react-icons/hi2";
import props from "./types";

const TableView: React.FC<props> = ({ editor }) => {
  return (
    <NodeViewWrapper>
      <div className="flex">
        <div>
          <NodeViewContent />
          <div
            className="cursor-pointer border border-black/70 text-sm text-center bg-white border-dashed mt-1 opacity-0 hover:opacity-100 "
            onClick={() => {
              editor.commands.addRowAfter();
            }}
          >
            <HiPlus size={17} className="inline" />
          </div>
        </div>

        <button
          className="block border border-black/70 text-sm text-center bg-white border-dashed opacity-0 hover:opacity-100 mb-7 ml-2"
          onClick={() => {
            editor.commands.addColumnAfter();
          }}
        >
          <HiPlus size={17} className="inline" />
        </button>
      </div>
    </NodeViewWrapper>
  );
};

export default TableView;
