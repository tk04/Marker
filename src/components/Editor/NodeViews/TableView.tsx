import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

import { HiPlus } from "react-icons/hi2";
import props from "./types";

const TableView: React.FC<props> = ({ editor }) => {
  return (
    <NodeViewWrapper>
      <div className="flex" autoCorrect="false" autoCapitalize="false">
        <div>
          <NodeViewContent />
          <button
            className="absolute w-[calc(100%-30px)] cursor-pointer border border-black/70 text-sm text-center bg-background border-dashed mt-1 py-1 opacity-0 hover:opacity-100 select-none"
            onClick={() => {
              editor.commands.addRowAfter();
            }}
          >
            <HiPlus size={17} className="inline" />
          </button>
        </div>

        <button
          className="block border border-black/70 text-sm text-center bg-background border-dashed opacity-0 hover:opacity-100 ml-1 px-1 select-none"
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
