import { useState, useRef } from "react";
import File from "./File";
import { IoIosArrowForward } from "react-icons/io";
import CreateFile from "../createFile";
import { FileInfo } from "@/utils/getFileMeta";

interface props {
  file: FileInfo;
  addFile: (path: string, filename: string) => Promise<void>;
}
const Tree: React.FC<props> = ({ file, addFile }) => {
  const [toggle, setToggle] = useState(false);
  const filenameRef = useRef<HTMLInputElement>(null);
  const [create, setCreate] = useState(false);
  function createHandler() {
    setToggle(true);
    setCreate((p) => !p);
  }
  return (
    <div>
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

      {toggle && (
        <div className="border-l border-neutral-300">
          <div className="pl-5">
            {file.children?.map((file) =>
              file.children ? (
                <Tree addFile={addFile} file={file} key={file.path} />
              ) : (
                <File file={file} key={file.path} />
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
export default Tree;
