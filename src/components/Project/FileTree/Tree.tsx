import useStore from "@/store/appStore";
import { useState, useRef } from "react";
import { removeDir } from "@tauri-apps/api/fs";
import { confirm } from "@tauri-apps/api/dialog";
import { showMenu } from "tauri-plugin-context-menu";
import File from "./File";
import { IoIosArrowForward } from "react-icons/io";
import CreateFile from "../createFile";
import { FileInfo } from "@/utils/getFileMeta";
import removePath from "@/utils/removePath";
import { resolveResource } from "@tauri-apps/api/path";

interface props {
  file: FileInfo;
  addFile: (path: string, filename: string) => Promise<void>;
}
const Tree: React.FC<props> = ({ file, addFile }) => {
  const { setFiles, files } = useStore((s) => ({
    setFiles: s.setFiles,
    files: s.files,
  }));
  const [toggle, setToggle] = useState(false);
  const filenameRef = useRef<HTMLInputElement>(null);
  const [create, setCreate] = useState(false);
  function createHandler() {
    setToggle(true);
    setCreate((p) => !p);
  }

  async function deleteFile() {
    const confirmed = await confirm("Are you sure?", `Delete ${file.name}`);
    if (!confirmed) return;
    await removeDir(file.path, { recursive: true });
    setFiles(removePath(file.path, files));
  }
  return (
    <div>
      <div
        onContextMenu={async (e) => {
          e.preventDefault();
          const trash = await resolveResource("assets/trash.svg");
          showMenu({
            pos: { x: e.clientX, y: e.clientY },
            items: [
              {
                label: "Delete",
                event: deleteFile,
                icon: {
                  path: trash,
                  width: 12,
                  height: 12,
                },
              },
            ],
          });
        }}
        className="flex justify-between items-center gap-2 cursor-pointer -mx-5 group has-[:not(.addFile:hover)]:hover:bg-accent has-[.addFile:hover]:hover:bg-opacity-0 pr-3"
        key={file.path}
      >
        <div
          className="flex gap-2 items-center w-full h-full px-4 py-2"
          onClick={() => setToggle((p) => !p)}
        >
          <IoIosArrowForward
            size={15}
            className={`${toggle ? "rotate-90" : "rotate-0"
              } transition-all duration-75 text-primary`}
          />
          <p className="text-sm select-none">{file.name}</p>
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
