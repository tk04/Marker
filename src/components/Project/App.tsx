import {
  readDir,
  type FileEntry,
  writeTextFile,
  exists,
  createDir,
} from "@tauri-apps/api/fs";
import store from "@/utils/appStore";

import { useEffect, useState } from "react";
import Editor from "../Editor/Editor";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { HiHome } from "react-icons/hi2";
import Dir from "./Dir";
import { join } from "@tauri-apps/api/path";

interface Project {
  dir: string;
  name: string;
}
interface props {
  id?: string;
}
const App: React.FC<props> = ({ id }) => {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [project, setProject] = useState<Project>();
  const [collapse, setCollapse] = useState(false);
  const [currFile, setCurrFile] = useState<FileEntry>();
  async function getFiles(path: string) {
    const entries = await readDir(path, {
      recursive: true,
    });

    async function processEntries(entries: FileEntry[], arr: any[]) {
      for (const entry of entries) {
        if (entry.name?.startsWith(".")) {
          continue;
        }
        if (entry.children) {
          let subArr: any[] = [];
          processEntries(entry.children, subArr);
          arr.push({ ...entry, children: subArr });
        } else {
          if (!entry.name?.endsWith(".md")) {
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
  async function getProject() {
    const proj = await store.get("apps");
    if (!proj) return;
    //@ts-ignore
    const app = proj[id];
    setProject(app);
    await getFiles(app.dir);
  }
  useEffect(() => {
    getProject();
  }, []);

  async function addFileHandler(path: string, filename: string) {
    const newfilePath = await join(path, filename);
    const folder = await join(newfilePath, "../");
    if (!(await exists(folder))) {
      await createDir(folder, { recursive: true });
    }
    if (newfilePath.endsWith(".md")) {
      await writeTextFile(newfilePath, "");
    }
    await getFiles(project!.dir);
  }
  if (!project) return;
  return (
    <div className="flex h-full">
      <div>
        <div className={`max-w-[210px] w-full px-3 pt-[15px] fixed pb-5 z-10`}>
          <div
            className={`flex px-2 gap-3 w-full ${collapse ? "justify-start" : "justify-between"
              } items-center mt-1 pb-2`}
          >
            <a href="/" className={`cursor-pointer h-fit text-neutral-500`}>
              <HiHome size={18} />
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
          className={`transition-all ease-in-out duration-50 max-w-[210px] w-full border-r pt-12  fixed bg-neutral-100 flex flex-col h-screen ${collapse ? "-left-[210px]" : "left-0"
            }`}
        >
          <div className="text-gray-700 overflow-y-auto h-full pr-5 overflow-x-hidden w-full">
            <Dir
              currFile={currFile}
              addFile={addFileHandler}
              setCurrFile={setCurrFile}
              file={{ name: "root", path: project!.dir, children: files }}
              root={true}
            />
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
