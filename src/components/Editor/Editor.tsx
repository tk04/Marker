import yaml from "yaml";

import {
  readTextFile,
  writeTextFile,
  type FileEntry,
} from "@tauri-apps/api/fs";
import { EditorContent, isMacOS } from "@tiptap/react";
import Titles from "./Titles";
import { useEffect, useRef, useState } from "react";
import Menu from "./Menu";
import LinkPopover from "./Popover/Link";
import useTextEditor from "@/hooks/useEditor.ts";
import Publish from "./Publish";
import { markdownToHtml, htmlToMarkdown } from "@/utils/markdown";
import { Node } from "@tiptap/pm/model";
import TableOfContents from "./TableOfContents";
import useStore from "@/store/appStore";
import type { Editor as EditorType } from "@tiptap/core";

export type TOC = { node: Node; level: number }[];
interface props {
  file: FileEntry;
  projectPath: string;
  collapse: boolean;
}
const Editor: React.FC<props> = ({ projectPath, file, collapse }) => {
  const settings = useStore((s) => s.settings);
  const [metadata, setMetadata] = useState<{ [key: string]: any }>({});
  const editor = useTextEditor({
    content: "",
    onUpdate,
    filePath: file.path,
    projectDir: projectPath,
    loadFile: loadFile,
  });

  const saveFileTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  function clearSaveFileTimeout() {
    if (saveFileTimeoutRef.current != null) {
      clearTimeout(saveFileTimeoutRef.current);
    }
  }

  function onUpdate() {
    clearSaveFileTimeout();
    saveFileTimeoutRef.current = setTimeout(saveFile, 200);
  }

  async function saveFile() {
    try {
      let mdContent = "---\n" + yaml.stringify(metadata) + "---\n";
      mdContent += htmlToMarkdown(editor?.getHTML() || "");
      await writeTextFile(file.path, mdContent);
    } catch {
      alert(
        "An error occurred when trying to save this file. Let us know by opening an issue at https://github.com/tk04/marker",
      );
    }
  }
  useEffect(() => {
    onUpdate();
  }, [metadata]);

  async function loadFile(editor: EditorType | null) {
    if (!editor) return;
    let data = await readTextFile(file.path);
    const linesIdx = data.indexOf("---", 2);
    // parse YAML header
    if (data.startsWith("---") && linesIdx != -1) {
      const metadataText = data.slice(3, linesIdx);
      const parsed = yaml.parse(metadataText);
      setMetadata(parsed);
      data = data.slice(data.indexOf("---", 2) + 4);
    } else {
      setMetadata({});
    }
    // parse markdown content
    const parsedHTML = await markdownToHtml(data);

    editor.commands.updateMetadata({
      filePath: file.path,
    });
    editor.commands.setContent(parsedHTML);

    editor.commands.focus("start");
    document.querySelector(".editor")?.scroll({ top: 0 });

    // reset history (see https://github.com/ueberdosis/tiptap/issues/491#issuecomment-1261056162)
    // @ts-ignore
    if (editor.state.history$) {
      // @ts-ignore
      editor.state.history$.prevRanges = null;
      // @ts-ignore
      editor.state.history$.done.eventCount = 0;
    }
  }
  useEffect(() => {
    clearSaveFileTimeout();
    let timeout = setTimeout(loadFile.bind(null, editor), 0);
    return () => {
      clearTimeout(timeout);
    };
  }, [file.path]);

  if (!editor) return;

  return (
    <div className="h-screen flex flex-col dark:bg-neutral-900">
      <Menu editor={editor} />
      <LinkPopover editor={editor} />

      <p className="text-neutral-400 fixed right-5 text-xs bottom-3">
        {editor.storage.characterCount.words()} words
      </p>
      <div
        className={`duration-75 transition-all h-fit pb-2 flex items-center justify-between px-5 z-20 pt-[7px] ${collapse ? (isMacOS() ? "ml-[130px]" : "ml-[55px]") : "ml-[210px]"
          }`}
      >
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <p>{file.path.replace(projectPath + "/", "")}</p>
          </div>
        </div>
        <div className="-z-10 grow  h-full" data-tauri-drag-region></div>
        <div>
          <Publish
            projectPath={projectPath}
            filePath={file.path}
            reRender={() => loadFile(editor)}
          />
        </div>
      </div>
      {settings.showTOC && (
        <div className="border-l h-screen fixed right-0 pt-[170px] hidden xl:block overflow-hidden hover:overflow-y-auto z-0 hover:z-10">
          <TableOfContents toc={editor.storage.tableOfContents.toc} />
        </div>
      )}
      <div
        className={`editor transition-all duration-50 h-full overflow-auto ${!collapse ? "ml-[200px] px-5 lg:px-0 lg:ml-0" : "ml-0"
          } transition-all duration-75`}
      >
        <div className={`flex flex-col pt-20 h-full`}>
          <div className="text-editor grow justify-center flex flex-col max-w-[580px] lg:pl-20 xl:pl-0 lg:max-w-[736px] m-auto w-full">
            <Titles metadata={metadata} setMetadata={setMetadata} />

            <EditorContent
              editor={editor}
              className="pb-10 px-2 md:px-0 grow h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
