import { NodeViewWrapper } from "@tiptap/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type props from "../types";
import { useState } from "react";
import Options from "./Options";
const ButtonView: React.FC<props> = ({
  node,
  updateAttributes,
  selected,
  deleteNode,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <NodeViewWrapper className={`${selected && "border"} py-3 relative`}>
      <button
        className="button"
        data-align={node.attrs.align}
        style={{ justifyContent: node.attrs.align }}
      >
        <a
          className="cursor-pointer"
          style={{
            backgroundColor: node.attrs.bgColor,
            color: node.attrs.color,
            width: `${node.attrs.width}`,
            borderRadius: `${node.attrs.rounded}px`,
          }}
        >
          {node.attrs.text}
        </a>
      </button>

      {selected && (
        <div className="absolute -bottom-7 border px-3 bg-white rounded-md text-neutral-500 z-10">
          <div className="flex text-[13px] items-center">
            <a
              href={node.attrs.href}
              className="text-blue-400 underline"
              target="_blank"
            >
              {node.attrs.href}
            </a>
            <p className="mx-2">-</p>
            <Popover open={open} onOpenChange={(val) => setOpen(val)}>
              <PopoverTrigger className="underline mx-2">Edit</PopoverTrigger>
              <PopoverContent>
                <Options
                  closeModal={() => setOpen(false)}
                  updateAttributes={updateAttributes}
                  attrs={node.attrs as any}
                />
              </PopoverContent>
            </Popover>
            <button className="underline" onClick={deleteNode}>
              Remove
            </button>
          </div>
        </div>
      )}
    </NodeViewWrapper>
  );
};
export default ButtonView;
