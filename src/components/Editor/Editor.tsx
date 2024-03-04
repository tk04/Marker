import { marked } from "marked";

import yaml from "yaml";

import {
  readTextFile,
  writeTextFile,
  type FileEntry,
} from "@tauri-apps/api/fs";
import { EditorContent } from "@tiptap/react";
import Titles from "./Titles";
import { useEffect, useState } from "react";
import Menu from "./Menu";
import LinkPopover from "./Popover/Link";
import useTextEditor from "@/hooks/useEditor.ts";
import TurndownService from "turndown";

const service = new TurndownService({
  headingStyle: "atx",
  hr: "---",
  codeBlockStyle: "fenced",
});
marked.Renderer.prototype.paragraph = (text) => {
  if (text.startsWith("<img")) {
    return text + "\n";
  }
  return "<p>" + text + "</p>";
};
interface props {
  file: FileEntry;
  content: string;
  fileMetadata: { [key: string]: any };
  projectPath: string;
  collapse: boolean;
}
const Editor: React.FC<props> = ({
  projectPath,
  file,
  content,
  fileMetadata,
  collapse,
}) => {
  const [metadata, setMetadata] = useState(fileMetadata);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [updateContent, setUpdateContent] = useState(0);
  const editor = useTextEditor({
    content,
    onUpdate,
    folderPath: file.path,
  });

  function onUpdate() {
    setUpdateContent((p) => p + 1);
  }
  async function saveFile() {
    let mdContent = "---\n" + yaml.stringify(metadata) + "---\n";
    mdContent += service.turndown(editor?.getHTML() || "");
    await writeTextFile(file.path, mdContent).catch(() => setError(true));

    setSaving(false);
    setUpdateContent(0);
  }

  useEffect(() => {
    setSaving(false);
    if (updateContent) {
      setSaving(true);
      const timeout = setTimeout(saveFile, 800);
      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    }
  }, [updateContent, metadata]);
  if (!editor) return;

  return (
    <div className="h-screen flex flex-col">
      <Menu editor={editor} />
      <LinkPopover editor={editor} />

      <p className="text-neutral-400 fixed right-5 text-xs bottom-3">
        {editor.storage.characterCount.words()} words
      </p>
      <div
        className={`pl-5 pt-4 h-fit flex items-center justify-between px-5 bg-white relative z-20 transition-all duration-50 ${collapse ? "ml-[65px]" : "ml-[210px]"
          }`}
      >
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <p className="text-sm text-neutral-400">
              {file.path.replace(projectPath + "/", "")}
            </p>
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

      <div
        className={`transition-all duration-50 ${collapse ? "ml-0" : "ml-[230px] lg:ml-0"
          }`}
      >
        <div className="flex flex-col editor pt-20 grow max-w-[580px] lg:max-w-[736px] m-auto w-full">
          <div className="text-editor grow justify-center flex flex-col">
            <Titles
              metadata={metadata}
              setMetadata={setMetadata}
              onUpdate={onUpdate}
            />

            <EditorContent editor={editor} className="pb-3 px-2 md:px-0 grow" />
          </div>
        </div>
      </div>
    </div>
  );
};

const MainEditor = ({
  file,
  projectPath,
  collapse,
}: {
  file: FileEntry;
  projectPath: string;
  collapse: boolean;
}) => {
  const [content, setContent] = useState<null | string>(null);
  const [metadata, setMetadata] = useState<{ [key: string]: any }>({});

  async function getContent() {
    let data = await readTextFile(file.path);
    const linesIdx = data.indexOf("---", 2);
    if (data.startsWith("---") && linesIdx != -1) {
      const metadataText = data.slice(3, linesIdx);
      const parsed = yaml.parse(metadataText);
      setMetadata(parsed);
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
      projectPath={projectPath}
      file={file}
      content={content}
      fileMetadata={metadata}
      collapse={collapse}
    />
  );
};
export default MainEditor;
