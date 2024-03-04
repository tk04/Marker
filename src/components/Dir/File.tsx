import type { FileEntry } from "@tauri-apps/api/fs";
import type { Dispatch, SetStateAction } from "react";

interface props {
  file: FileEntry;
  setCurrFile: Dispatch<SetStateAction<FileEntry | undefined>>;
  currFile?: FileEntry;
}
const File: React.FC<props> = ({ file, setCurrFile, currFile }) => {
  return (
    <div
      className={`flex items-center gap-2 cursor-pointer -mx-5 hover:bg-neutral-200  px-5 py-2 ${currFile?.path == file.path && "bg-neutral-200/80"
        }`}
      onClick={() => setCurrFile(file)}
      key={file.path}
    >
      <p className="text-sm block whitespace-nowrap w-full overflow-hidden text-ellipsis">
        {file.name}
      </p>
    </div>
  );
};
export default File;
