import { marked } from "marked";
import yaml from "yaml";

import { readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { EditorContent } from "@tiptap/react";
import Titles from "./Titles";
import { useEffect, useState } from "react";
import Menu from "./Menu";
import LinkPopover from "./Popover/Link";
import useTextEditor from "@/hooks/useEditor.ts";
import TurndownService from "turndown";
import type { FileData } from "../Dir/App";

const service = new TurndownService({
  headingStyle: "atx",
  hr: "---",
  codeBlockStyle: "fenced",
});
service.addRule("paragraph", {
  filter: "p",
  replacement: function(content) {
    return "\n" + content + "\n";
  },
});
interface props {
  filePath: string;
  content: string;
  fileMetadata: { [key: string]: any };
}
const Editor: React.FC<props> = ({ filePath, content, fileMetadata }) => {
  const [metadata, setMetadata] = useState(fileMetadata);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [updateContent, setUpdateContent] = useState(0);
  const editor = useTextEditor({
    content,
    onUpdate,
  });

  function onUpdate() {
    setUpdateContent((p) => p + 1);
  }

  useEffect(() => {
    setSaving(false);
    if (updateContent) {
      setSaving(true);
      const timeout = setTimeout(async () => {
        let mdContent = "---\n" + yaml.stringify(metadata) + "---\n";
        mdContent += service.turndown(editor?.getHTML() || "");
        await writeTextFile(filePath, mdContent).catch(() => setError(true));

        setSaving(false);
        setUpdateContent(0);
      }, 2000);
      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    }
  }, [updateContent, metadata]);
  if (!editor) return;
  return (
    <div>
      <LinkPopover editor={editor} />
      <div className="h-full flex flex-col m-auto pt-2 w-full">
        <div className="pl-5 flex items-center justify-between p-2 px-5 bg-white relative z-20">
          <div className="flex items-center gap-5">
            {/* <IoIosArrowBack */}
            {/*   size={20} */}
            {/*   className="p-2 w-9 h-9 border rounded-full cursor-pointer" */}
            {/* /> */}

            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 ${error
                    ? "bg-red-500"
                    : !saving
                      ? "bg-green-500"
                      : "bg-orange-400"
                  } rounded-full`}
              ></div>
              <p className="text-neutral-400 text-sm inter">
                Draft -{" "}
                {error ? "An error occurred" : saving ? "saving..." : "saved"}
              </p>
            </div>
          </div>
        </div>
        <div className="border-y p-0 relative z-20">
          <div className="max-w-[736px] m-auto">
            <Menu editor={editor} />
          </div>
        </div>

        <div className="overflow-auto editor">
          <div className="w-full">
            <div className="text-editor flex-auto justify-center">
              <Titles
                metadata={metadata}
                setMetadata={setMetadata}
                onUpdate={onUpdate}
              />

              <EditorContent
                editor={editor}
                className="pb-10 flex-auto px-2 md:px-0 m-auto h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MainEditor = ({ file }: { file: FileData }) => {
  const [content, setContent] = useState<null | string>(null);
  async function getContent() {
    let data = await readTextFile(file.path);
    const linesIdx = data.indexOf("---", 2);
    if (linesIdx != -1) {
      data = data.slice(data.indexOf("---", 2) + 4);
    }
    const parsedHTML = await marked.parse(data);
    setContent(parsedHTML);
  }
  useEffect(() => {
    getContent();
  }, [file.path]);
  if (content == null) return;
  return (
    <Editor
      filePath={file.path}
      content={content}
      fileMetadata={file.metadata}
    />
  );
};
export default MainEditor;
