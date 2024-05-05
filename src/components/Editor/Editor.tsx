import yaml from "yaml";

import {
  readTextFile,
  writeTextFile,
  type FileEntry,
} from "@tauri-apps/api/fs";
import { EditorContent, isMacOS } from "@tiptap/react";
import Titles from "./Titles";
import { useEffect, useState } from "react";
import Menu from "./Menu";
import LinkPopover from "./Popover/Link";
import useTextEditor from "@/hooks/useEditor.ts";
import Publish from "./Publish";
import { markdownToHtml, htmlToMarkdown } from "@/utils/markdown";
import { Node } from "@tiptap/pm/model";
import TableOfContents from "./TableOfContents";
import { Editor as EditorType } from "@tiptap/core";
import useStore from "@/store/appStore";

export type TOC = { node: Node; level: number }[];
interface props {
  file: FileEntry;
  content: string;
  fileMetadata: { [key: string]: any };
  projectPath: string;
  collapse: boolean;
  reRender: () => void;
}
const Editor: React.FC<props> = ({
  projectPath,
  reRender,
  file,
  content,
  fileMetadata,
  collapse,
}) => {
  const settings = useStore((s) => s.settings);
  const [metadata, setMetadata] = useState(fileMetadata);
  const [toc, setToc] = useState<TOC>([]);
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
    try {
      let mdContent = "---\n" + yaml.stringify(metadata) + "---\n";
      mdContent += htmlToMarkdown(editor?.getHTML() || "");
      await writeTextFile(file.path, mdContent);
      updateTOC();
    } catch {
      alert(
        "An error occurred when trying to save this file. Let us know by opening an issue at https://github.com/tk04/marker",
      );
    }
  }
  function updateTOC(initEditor?: EditorType) {
    // @ts-ignores
    const content = (editor || initEditor).state.doc.content.content as Node[];
    const headings: TOC = [];
    let prevLevel: number | null = null;
    for (let i = 0; i < content.length; i++) {
      const node = content[i];
      if (node.type.name === "heading") {
        let currLvl;
        if (prevLevel != null) {
          let lastVal = headings[headings.length - 1].level;
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
        headings.push({ level: currLvl, node: node });
      }
    }
    setToc(headings);
  }
  useEffect(() => {
    if (updateContent) {
      const timeout = setTimeout(saveFile, 200);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [updateContent]);

  useEffect(() => {
    if (!editor) return;
    setUpdateContent(0);
    editor?.commands.setContent(content);
    editor?.setOptions({
      editorProps: {
        attributes: {
          folderPath: file.path,
        },
      },
    });

    updateTOC();
    setMetadata(fileMetadata);
    editor?.commands.focus("start");
    document.querySelector(".editor")?.scroll({ top: 0 });
  }, [content]);

  if (!editor) return;

  return (
    <div className="h-screen flex flex-col dark:bg-neutral-900">
      <Menu editor={editor} />
      <LinkPopover editor={editor} />

      <p className="text-neutral-400 fixed right-5 text-xs bottom-3">
        {editor.storage.characterCount.words()} words
      </p>
      <div
        className={`duration-75 transition-all h-fit pb-2 flex items-center justify-between px-5 z-20 pt-[7px] ${
          collapse ? (isMacOS() ? "ml-[130px]" : "ml-[55px]") : "ml-[210px]"
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
            reRender={reRender}
          />
        </div>
      </div>
      {settings.showTOC && (
        <div className="border-l h-screen fixed right-0 pt-[170px] hidden xl:block overflow-hidden hover:overflow-y-auto z-0 hover:z-10">
          <TableOfContents toc={toc} />
        </div>
      )}
      <div
        className={`editor transition-all duration-50 h-full overflow-auto ${
          !collapse ? "ml-[200px] px-5 lg:px-0 lg:ml-0" : "ml-0"
        } transition-all duration-75`}
      >
        <div className={`flex flex-col pt-20 h-full`}>
          <div className="text-editor grow justify-center flex flex-col max-w-[580px] lg:pl-20 xl:pl-0 lg:max-w-[736px] m-auto w-full">
            <Titles
              metadata={metadata}
              setMetadata={setMetadata}
              onUpdate={onUpdate}
            />

            <EditorContent
              editor={editor}
              className="pb-44 px-2 md:px-0 grow h-full"
            />
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
  const [content, setContent] = useState<string>("");
  const [metadata, setMetadata] = useState<{ [key: string]: any }>({});

  async function getContent() {
    setContent("");
    let data = await readTextFile(file.path);
    const linesIdx = data.indexOf("---", 2);
    if (data.startsWith("---") && linesIdx != -1) {
      const metadataText = data.slice(3, linesIdx);
      const parsed = yaml.parse(metadataText);
      setMetadata(parsed);
      data = data.slice(data.indexOf("---", 2) + 4);
    } else {
      setMetadata({});
    }
    const parsedHTML = await markdownToHtml(data);
    setContent(parsedHTML);
  }
  useEffect(() => {
    getContent();
  }, [file.path]);
  return (
    <Editor
      projectPath={projectPath}
      reRender={async () => await getContent()}
      file={file}
      content={content}
      fileMetadata={metadata}
      collapse={collapse}
    />
  );
};
export default MainEditor;
