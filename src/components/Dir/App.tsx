import { readDir, BaseDirectory, type FileEntry } from "@tauri-apps/api/fs";
import parseMd from "@/utils/parseMd";

import { invoke } from "@tauri-apps/api";
import store from "@/utils/appStore";

import { useEffect, useState } from "react";
import Editor from "../Editor/Editor";
import { IoIosArrowBack } from "react-icons/io";

export interface FileData extends FileEntry {
  metadata: { [key: string]: any };
}
interface props {
  id: number;
}
const App: React.FC<props> = ({ id }) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [currFile, setCurrFile] = useState<FileData | null>(null);
  async function getDir() {
    const proj = await store.get("apps");
    if (!proj) return;
    //@ts-ignore
    const app = proj[id];

    const entries = await readDir(app.dir, {
      dir: BaseDirectory.AppData,
      recursive: true,
    });
    async function processEntries(entries: FileEntry[], arr: any[]) {
      for (const entry of entries) {
        if (entry.children) {
          let arr: any[] = [];
          processEntries(entry.children, arr);
          arr.push({ ...entry, children: arr });
        } else {
          if (!entry.name?.endsWith(".md")) return;
          const metadata: string | null =
            (await invoke("get_file_metadata", {
              filePath: entry.path,
            })) || null;
          arr.push({ ...entry, metadata: parseMd(metadata) });
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
      <div className="max-w-[200px] w-full border-r px-5 h-screen fixed">
        <a href="/" className="flex items-center gap-1 mt-3 text-sm">
          <IoIosArrowBack />
          <p>back</p>
        </a>
        <h1 className="text-xl mb-2 mt-5">Files</h1>
        <hr className="-ml-5 -mr-5 xmb-2" />
        <div className="xspace-y-2">
          {files.map((file) => (
            <div
              className={`flex items-center gap-2 cursor-pointer -mx-5 hover:bg-neutral-100  px-5 py-2 ${currFile?.path == file.path && "bg-neutral-200/80"
                }`}
              onClick={() => setCurrFile(file)}
              key={file.path}
            >
              <h1 className="text-md">{file.name}</h1>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full h-full ml-[200px]">
        {currFile && <Editor file={currFile} key={currFile.path} />}
      </div>
    </div>
  );
};

export default App;
