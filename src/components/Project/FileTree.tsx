import type { FileEntry } from "@tauri-apps/api/fs";
import { useState, type Dispatch, type SetStateAction, useRef } from "react";
import File from "./File";
import { IoIosArrowForward } from "react-icons/io";
import CreateFile from "./createFile";
interface props {
  file: FileEntry;
  setCurrFile: Dispatch<SetStateAction<FileEntry | undefined>>;
  addFile: (path: string, filename: string) => Promise<void>;
  currFile?: FileEntry;
  root?: boolean;
}
const FileTree: React.FC<props> = ({
  root,
  file,
  setCurrFile,
  currFile,
  addFile,
}) => {
  const [toggle, setToggle] = useState(root);
  const filenameRef = useRef<HTMLInputElement>(null);
  const [create, setCreate] = useState(false);
  function createHandler() {
    setToggle(true);
    setCreate((p) => !p);
  }
  return (
    <div>
      {root ? (
        <div className="ml-5">
          <div className="flex group justify-between items-center mt-10 mb-2">
            <h1 className="text-xl">Files</h1>
            <CreateFile onClick={createHandler} root={root} />
          </div>
          <hr className="-ml-5 -mr-5" />
        </div>
      ) : (
        <div
          className="flex justify-between items-center gap-2 cursor-pointer -mx-5 group has-[:not(.addFile:hover)]:hover:bg-neutral-200 has-[.addFile:hover]:hover:bg-opacity-0 pr-3"
          key={file.path}
        >
          <div
            className="flex gap-2 items-center w-full h-full px-4 py-2"
            onClick={() => setToggle((p) => !p)}
          >
            <IoIosArrowForward
              size={15}
              className={`${toggle ? "rotate-90" : "rotate-0"
                } transition-all duration-75`}
            />
            <p className="text-sm">{file.name}</p>
          </div>
          <CreateFile onClick={createHandler} />
        </div>
      )}

      {toggle && (
        <div className={`${!root && "border-l border-neutral-300"}`}>
          <div className="pl-5">
            {file.children?.map((file) =>
              file.children ? (
                <FileTree
                  currFile={currFile}
                  addFile={addFile}
                  setCurrFile={setCurrFile}
                  file={file}
                  key={file.path}
                />
              ) : (
                <File
                  currFile={currFile}
                  setCurrFile={setCurrFile}
                  file={file}
                  key={file.path}
                />
              ),
            )}
          </div>

          {create && (
            <form
              className="w-full"
              onBlur={() => setCreate(false)}
              onSubmit={async (e) => {
                e.preventDefault();
                if (filenameRef.current?.value) {
                  await addFile(file.path, filenameRef.current!.value);
                  filenameRef.current!.value = "";
                }
                setCreate(false);
              }}
            >
              <input
                autoFocus
                ref={filenameRef}
                placeholder="Filename.."
                className="border px-2 py-1 focus:outline-none text-sm w-full"
                spellCheck={false}
              />
            </form>
          )}
        </div>
      )}
    </div>
  );
};
export default FileTree;
