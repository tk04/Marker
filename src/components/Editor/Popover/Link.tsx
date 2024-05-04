import { Editor } from "@tiptap/react";

import { TbTrash } from "react-icons/tb";
import { FiEdit } from "react-icons/fi";
import { getLinkText } from "../hasLink";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useRef, useState } from "react";

interface props {
  editor: Editor | null;
}
const LinkPopover: React.FC<props> = ({ editor }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState("");
  const [text, setText] = useState("");

  if (ref.current) {
    if (editor?.isActive("link")) {
      let { from } = editor.state.selection;
      let startPos = editor.view.coordsAtPos(from);
      ref.current!.style.display = "block";
      ref.current!.style.top = `${startPos.bottom + 10 + window.scrollY}px`;
      ref.current!.style.left = `${startPos.left}px`;
    } else {
      ref.current!.style.display = "none";
    }
  }
  const scrollHandler = () => {
    if (editor?.isActive("link")) {
      //@ts-ignore
      let { from } = editor.state.selection;
      let startPos = editor.view.coordsAtPos(from);
      ref.current!.style.display = "block";
      ref.current!.style.top = `${startPos.bottom + 10 + window.scrollY}px`;
    }
  };
  useEffect(() => {
    if (!editor) return;
    let textEditor = document.querySelector(".editor");
    textEditor?.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [editor?.isActive("link")]);
  const clickHandler = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const { view, state } = editor;
    const { from, to } = view.state.selection;
    //@ts-ignore
    let nodeBefore = view.state.selection.$cursor?.nodeBefore;
    //@ts-ignore
    let nodeAfter = view.state.selection.$cursor?.nodeAfter;

    if (previousUrl && (nodeBefore || nodeAfter)) {
      let linkText = getLinkText(nodeBefore, nodeAfter);
      setText(linkText);
    } else {
      setText(state.doc.textBetween(from, to, ""));
    }
    setLink(editor.getAttributes("link").href);
  };
  if (!editor) return;

  return (
    <div
      ref={ref}
      className="absolute shadow-sm border px-3 py-1 bg-popover rounded-md text-neutral-500 z-10"
      style={{ display: "none" }}
    >
      {editor.isActive("link") && (
        <div className="flex text-[13px] z-10">
          <a
            href={editor.getAttributes("link").href + "?open=true"}
            className="text-blue-400 underline cursor-pointer"
            target="_blank"
          >
            {editor.getAttributes("link").href}
          </a>
          <p className="mx-2">-</p>
          <Popover open={open} onOpenChange={(val) => setOpen(val)}>
            <PopoverTrigger className="underline mx-2" onClick={clickHandler}>
              <FiEdit />
            </PopoverTrigger>
            <PopoverContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  if (link === null) {
                    return;
                  }
                  if (link === "") {
                    editor
                      .chain()
                      .focus()
                      .extendMarkRange("link")
                      .unsetLink()
                      .run();
                    return;
                  }
                  editor
                    .chain()
                    .focus()
                    .extendMarkRange("link")
                    .setLink({ href: link })
                    .command(({ tr }) => {
                      tr.insertText(text);
                      return true;
                    })
                    .run();
                  setOpen(false);
                }}
              >
                <div>
                  <label className="block text-sm ">Text</label>
                  <input
                    defaultValue={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full text-[15px] border rounded-md px-2 focus:outline-none py-1"
                  />
                </div>

                <div className="w-56 py-1 xspace-y-1 space-y-5">
                  <div>
                    <label className="block text-sm ">Link</label>
                    <input
                      defaultValue={link}
                      onChange={(e) => setLink(e.target.value)}
                      className="w-full text-[15px] border rounded-md px-2 focus:outline-none py-1"
                    />
                  </div>
                </div>
                <button
                  className="bg-primary text-secondary rounded-md py-1 font-semibold text-[13px] px-2 w-full mt-2"
                  type="submit"
                >
                  Save
                </button>
              </form>
            </PopoverContent>
          </Popover>
          <button
            className="underline"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleLink({ href: editor.getAttributes("link").href })
                .run()
            }
          >
            <TbTrash />
          </button>
        </div>
      )}
    </div>
  );
};
export default LinkPopover;
