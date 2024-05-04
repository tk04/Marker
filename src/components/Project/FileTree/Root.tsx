import { useState, useRef, useEffect } from "react";
import { TiSortAlphabetically } from "react-icons/ti";
import File from "./File";
import CreateFile from "../createFile";
import { FileInfo } from "@/utils/getFileMeta";
import Tree from "./Tree";
import { MdFilterList, MdOutlineEditCalendar } from "react-icons/md";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FaRegCalendarPlus,
  FaSortAmountDownAlt,
  FaSortAmountUp,
} from "react-icons/fa";
import SortItem from "./SortItem";
import { SortBy, SortType } from "@/utils/types";
import useStore from "@/store/appStore";

interface props {
  file: FileInfo;
  addFile: (path: string, filename: string) => Promise<void>;
}
const Root: React.FC<props> = ({ file, addFile }) => {
  const { sortBy, sortType, setSortInfo } = useStore((s) => ({
    ...s.sortInfo,
    setSortInfo: s.setSortInfo,
  }));
  const filenameRef = useRef<HTMLInputElement>(null);
  const [create, setCreate] = useState(false);
  const [sortedFiles, setSortedFiles] = useState<FileInfo[]>();

  function createHandler() {
    setCreate((p) => !p);
  }
  function compare(res: boolean) {
    if (sortType == SortType.Asc) {
      return res ? -1 : 1;
    }
    return res ? 1 : -1;
  }
  function sortFn(a: FileInfo, b: FileInfo) {
    let res = 0;
    switch (sortBy) {
      case SortBy.Name: {
        if (!a.name || !b.name) break;
        res = compare(a.name < b.name);
        break;
      }
      case SortBy.UpdatedAt: {
        if (!a.meta?.updated_at || !b.meta?.updated_at) break;
        res = compare(
          a.meta.updated_at.secs_since_epoch >
          b.meta.updated_at.secs_since_epoch,
        );
        break;
      }

      case SortBy.CreatedAt: {
        if (!a.meta?.created_at || !b.meta?.created_at) break;
        res = compare(
          a.meta.created_at.secs_since_epoch >
          b.meta.created_at.secs_since_epoch,
        );
        break;
      }
    }
    a.children?.sort(sortFn);
    b.children?.sort(sortFn);
    return res;
  }
  useEffect(() => {
    if (!file.children) return;
    file.children?.sort(sortFn);
    setSortedFiles([...file.children]);
  }, [sortBy, sortType, file.children]);
  return (
    <div>
      <div className="ml-5">
        <div className="flex group justify-between items-center mt-10 mb-2">
          <h1 className="text-xl">Files</h1>
          <div className="flex items-center gap-1">
            <CreateFile onClick={createHandler} root={true} />
            <Popover>
              <PopoverTrigger className="p-1 hover:bg-accent z-20 rounded-md cursor-pointer text-primary">
                <MdFilterList />
              </PopoverTrigger>
              <PopoverContent
                className="text-xs shadow-xl text-neutral-200 p-0 items-start flex flex-col gap-2 mt-[88px] bg-neutral-800 pb-1 min-w-36 duration-50"
                side="right"
                sideOffset={20}
              >
                <h2 className="pl-2 pt-2 pb-0 font-medium text-xs">Sort by:</h2>
                <div className="flex flex-col items-start w-full">
                  <SortItem
                    onClick={() =>
                      setSortInfo({ sortBy: SortBy.Name, sortType })
                    }
                    active={sortBy == SortBy.Name}
                  >
                    <TiSortAlphabetically />
                    Name
                  </SortItem>

                  <SortItem
                    onClick={() =>
                      setSortInfo({ sortBy: SortBy.CreatedAt, sortType })
                    }
                    active={sortBy == SortBy.CreatedAt}
                  >
                    <FaRegCalendarPlus />
                    Created At
                  </SortItem>

                  <SortItem
                    onClick={() =>
                      setSortInfo({ sortBy: SortBy.UpdatedAt, sortType })
                    }
                    active={sortBy == SortBy.UpdatedAt}
                  >
                    <MdOutlineEditCalendar />
                    Updated At
                  </SortItem>
                </div>

                <hr className="w-full border-neutral-400" />
                <h2 className="pl-2 pt-2 pb-0 font-medium text-xs">
                  Sort type:
                </h2>
                <div className="flex flex-col items-start w-full">
                  <SortItem
                    onClick={() =>
                      setSortInfo({ sortBy, sortType: SortType.Asc })
                    }
                    active={sortType == SortType.Asc}
                  >
                    <FaSortAmountDownAlt size={12} />
                    Ascending
                  </SortItem>

                  <SortItem
                    onClick={() =>
                      setSortInfo({ sortBy, sortType: SortType.Desc })
                    }
                    active={sortType == SortType.Desc}
                  >
                    <FaSortAmountUp size={12} />
                    Descending
                  </SortItem>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <hr className="-ml-5 -mr-5" />
      </div>
      <div>
        <div className="pl-5">
          {sortedFiles?.map((file) =>
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
    </div>
  );
};
export default Root;
