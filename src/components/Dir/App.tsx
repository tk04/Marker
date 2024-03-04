import { readDir, type FileEntry } from "@tauri-apps/api/fs";
import store from "@/utils/appStore";

import { useEffect, useState } from "react";
import Editor from "../Editor/Editor";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { HiOutlineHome } from "react-icons/hi2";
import Dir from "./Dir";
import File from "./File";

interface Project {
  dir: string;
  name: string;
}
interface props {
  id: number;
}
const App: React.FC<props> = ({ id }) => {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [project, setProject] = useState<Project>();
  const [collapse, setCollapse] = useState(false);
  const [currFile, setCurrFile] = useState<FileEntry>();
  async function getDir() {
    const proj = await store.get("apps");
    if (!proj) return;
    //@ts-ignore
    const app = proj[id];
    setProject(app);

    const entries = await readDir(app.dir, {
      recursive: true,
    });

    async function processEntries(entries: FileEntry[], arr: any[]) {
      for (const entry of entries) {
        if (entry.children) {
          let subArr: any[] = [];
          processEntries(entry.children, subArr);
          arr.push({ ...entry, children: subArr });
        } else {
          if (!entry.name?.endsWith(".md") || entry.name.startsWith(".")) {
            continue;
          }
          arr.push(entry);
        }
      }
    }
    const files: any[] = [];
    await processEntries(entries, files);
    setFiles(files);
  }
  useEffect(() => {
    getDir();
  }, []);

  return (
    <div className="flex h-full">
      <div>
        <div className={`max-w-[210px] w-full px-3 mt-3 fixed pb-5 z-10`}>
          <div
            className={`flex px-2 gap-3 transition-all ease-in-out duration-50 w-full ${collapse ? "justify-start" : "justify-between"
              } items-center mt-1 pb-2`}
          >
            <a href="/" className={`cursor-pointer h-fit text-neutral-500`}>
              <HiOutlineHome size={18} />
            </a>
            <div
              className={`cursor-pointer h-fit text-neutral-500 ${collapse && "rotate-180"
                }`}
              onClick={() => setCollapse((p) => !p)}
            >
              <MdKeyboardDoubleArrowLeft size={20} />
            </div>
          </div>
        </div>
        <div
          className={`transition-all ease-in-out duration-50 max-w-[210px] w-full border-r pt-10 px-5 xh-screen fixed bg-neutral-100/80  h-full ${collapse ? "-left-[210px]" : "left-0"
            }`}
        >
          <h1 className="text-xl mb-2 mt-5">Files</h1>
          <hr className="-ml-5 -mr-5 xmb-2" />
          <div className="text-gray-700">
            {files.map((file) =>
              file.children ? (
                <Dir
                  currFile={currFile}
                  setCurrFile={setCurrFile}
                  file={file}
                />
              ) : (
                <File
                  currFile={currFile}
                  setCurrFile={setCurrFile}
                  file={file}
                />
              ),
            )}
          </div>
        </div>
      </div>
      <div className="w-full h-full">
        {currFile && (
          <Editor
            file={currFile}
            key={currFile.path}
            projectPath={project?.dir || ""}
            collapse={collapse}
          />
        )}
      </div>
    </div>
  );
};

export default App;
