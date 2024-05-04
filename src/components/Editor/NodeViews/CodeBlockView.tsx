import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { FaSort } from "react-icons/fa";
import props from "./types";

import { common } from "lowlight";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { CommandList } from "cmdk";

const langs = Object.keys(common);
const CodeBlockView: React.FC<props> = ({ node, updateAttributes }) => {
  const [open, setOpen] = useState(false);
  return (
    <NodeViewWrapper className="group relative">
      <div className={`${open ? "block" : "invisible group-hover:visible"}`}>
        <Popover open={open} onOpenChange={(val) => setOpen(val)}>
          <PopoverTrigger
            asChild
            className="mx-2 absolute right-0 bg-transparent text-white py-2"
            onClick={() => setOpen(true)}
          >
            <button
              role="combobox"
              aria-expanded={open}
              className={`gap-1 font-sans text-xs flex w-fit items-center`}
            >
              {node.attrs.language || "Select a language..."}
              <FaSort />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px]  p-0">
            <Command>
              <CommandInput
                placeholder="Search language..."
                className="h-9 !bg-transparent"
              />
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandList className="max-h-[200px] overflow-auto">
                {langs.map((lang) => (
                  <CommandItem
                    key={lang}
                    value={lang}
                    onSelect={(currentValue) => {
                      updateAttributes({ language: currentValue });
                      setOpen(false);
                    }}
                  >
                    {lang}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <pre>
        <NodeViewContent as={"code"} />
      </pre>
    </NodeViewWrapper>
  );
};
export default CodeBlockView;
