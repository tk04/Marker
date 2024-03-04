import type { FileEntry } from "@tauri-apps/api/fs";
import { useState, type Dispatch, type SetStateAction } from "react";
import File from "./File";
import { IoIosArrowForward } from "react-icons/io";

interface props {
  file: FileEntry;
  setCurrFile: Dispatch<SetStateAction<FileEntry | undefined>>;
  currFile?: FileEntry;
}
const Dir: React.FC<props> = ({ file, setCurrFile, currFile }) => {
  const [toggle, setToggle] = useState(false);
  return (
    <div>
      <div
        className={`flex items-center gap-2 cursor-pointer -mx-5 hover:bg-neutral-200  px-4 py-2 ${currFile?.path == file.path && "bg-neutral-200/80"
          }`}
        onClick={() => setToggle((p) => !p)}
        key={file.path}
      >
        <IoIosArrowForward
          size={15}
          className={`${toggle ? "rotate-90" : "rotate-0"
            } transition-all duration-75`}
        />
        <p className="text-sm">{file.name}</p>
      </div>

      {toggle && (
        <div className="border-l border-neutral-300">
          <div className="pl-5">
            {file.children?.map((file) =>
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
      )}
    </div>
  );
};
export default Dir;
