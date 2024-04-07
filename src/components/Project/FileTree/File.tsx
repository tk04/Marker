import useStore from "@/store/appStore";

import { showMenu } from "tauri-plugin-context-menu";
import { removeFile, renameFile, type FileEntry } from "@tauri-apps/api/fs";
import { confirm } from "@tauri-apps/api/dialog";
import { useRef, useState } from "react";
import { join } from "@tauri-apps/api/path";
import removePath from "@/utils/removePath";

interface props {
  file: FileEntry;
}
const File: React.FC<props> = ({ file }) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const [showInput, setShowInput] = useState(false);
  const { currFile, fetchDir, setCurrFile, files, setFiles } = useStore(
    (s) => ({
      currFile: s.currFile,
      setCurrFile: s.setCurrFile,
      setFiles: s.setFiles,
      files: s.files,
      fetchDir: s.fetchDir,
    }),
  );

  async function rename() {
    let name = nameRef.current?.value;
    if (!name) return;

    if (!name.endsWith(".md")) name += ".md";
    const newPath = await join(file.path, "../", name);
    await renameFile(file.path!, newPath);
    await fetchDir();
    setShowInput(false);
    if (currFile?.path == file.path) {
      setCurrFile({ path: newPath, name, children: [] });
    }
  }
  async function deleteFile() {
    const confirmed = await confirm("Are you sure?", `Delete ${file.name}`);
    if (!confirmed) return;
    await removeFile(file.path);
    setFiles(removePath(file.path, files));
  }
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        showMenu({
          pos: { x: e.clientX, y: e.clientY },
          items: [
            { label: "Rename", event: () => setShowInput(true) },
            { label: "Delete", event: deleteFile },
          ],
        });
      }}
      className={` flex group items-center justify-between -mx-5 px-5 py-2 ${currFile?.path == file.path && "bg-neutral-200/80"} cursor-pointer has-[.dots:hover]:bg-opacity-0 hover:bg-neutral-200 `}
      onClick={() => setCurrFile(file)}
      key={file.path}
    >
      {showInput ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            rename();
          }}
        >
          <input
            ref={nameRef}
            className="w-full overflow-auto"
            defaultValue={file.name}
            onBlur={() => setShowInput(false)}
            autoFocus
          />
        </form>
      ) : (
        <p className="select-none text-sm block whitespace-nowrap w-full overflow-hidden text-ellipsis">
          {file.name}
        </p>
      )}
    </div>
  );
};
export default File;
