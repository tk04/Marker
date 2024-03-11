import {
  readDir,
  type FileEntry,
  writeTextFile,
  exists,
  createDir,
} from "@tauri-apps/api/fs";
import { getProjects, setCurrProject } from "@/utils/appStore";

import { useEffect, useState } from "react";
import Editor from "../Editor/Editor";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import FileTree from "./FileTree";
import { join } from "@tauri-apps/api/path";
import { Projects, Dir } from "@/utils/types";
import Selector from "./Selector";
import { BsHouse } from "react-icons/bs";

interface props {
  project: Dir;
}
const App: React.FC<props> = ({ project }) => {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [projects, setProjects] = useState<Projects>();

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
    await getFiles(project.dir);
    setProjects(await getProjects());
  }
  useEffect(() => {
    setCurrFile(undefined);
    setCurrProject(project.id);
    getProject();
  }, [project]);

  async function addFileHandler(path: string, filename: string) {
    if (!filename.endsWith(".md")) filename += ".md";
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
  if (!project || !projects) return;
  return (
    <div className="flex h-full">
      <div className="group/menu">
        <div
          className={`${!collapse && "opacity-0 group-hover/menu:opacity-100"
            } max-w-[210px] w-full px-3 pl-20 pt-[5px] fixed pb-5 z-10 transition-all duration-100`}
        >
          <div
            className={`flex px-2 gap-3 w-full ${collapse ? "justify-start" : "justify-end"
              } items-center mt-1 pb-2`}
          >
            <a
              href="/?home=true"
              className={`cursor-pointer h-fit text-neutral-500`}
            >
              <BsHouse />
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
          className={`transition-all ease-in-out duration-50 max-w-[210px] w-full border-r pt-12 fixed bg-neutral-100 flex flex-col h-screen ${collapse ? "-left-[210px]" : "left-0"
            }`}
        >
          <div className="text-gray-700 overflow-y-auto h-full pr-5 overflow-x-hidden w-full">
            <FileTree
              currFile={currFile}
              addFile={addFileHandler}
              setCurrFile={setCurrFile}
              file={{ name: "root", path: project!.dir, children: files }}
              root={true}
            />
          </div>
          <Selector
            projects={projects}
            currProject={project}
            setProjects={setProjects}
          />
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
