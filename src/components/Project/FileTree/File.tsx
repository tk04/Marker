import useStore from "@/store/appStore";
import type { FileEntry } from "@tauri-apps/api/fs";

interface props {
  file: FileEntry;
}
const File: React.FC<props> = ({ file }) => {
  const { currFile, setCurrFile } = useStore((s) => ({
    currFile: s.currFile,
    setCurrFile: s.setCurrFile,
  }));
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
