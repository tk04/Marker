import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { AppsType } from "@/utils/types";
import { TbTrash } from "react-icons/tb";
interface props {
  apps: AppsType;
  deleteHandler: (id: string) => void;
}
const Projects: React.FC<props> = ({ apps, deleteHandler }) => {
  return (
    <div className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
      {Object.entries(apps).map((app) => (
        <div
          className="flex flex-col border border-neutral-200 overflow-auto rounded-sm h-[140px] group"
          key={app[0]}
        >
          <a href={`/project/${app[0]}`} className="grow p-5 h-full w-full">
            <h1 className="text-xl font-medium">{app[1].name}</h1>
            <p className="text-sm text-gray-500">{app[1].dir}</p>
          </a>
          <div className="self-end opacity-0 group-hover:opacity-100 transition-all duration-150">
            <Popover>
              <PopoverTrigger className="hover:bg-red-200/30 rounded-md m-2 p-1 hover:text-red-500 cursor-pointer">
                <TbTrash />
              </PopoverTrigger>
              <PopoverContent className=" flex justify-between items-center text-xs">
                <p>Are you sure?</p>
                <button
                  className="float-right p-1 px-2  bg-red-500 text-white rounded-md hover:bg-red-700"
                  onClick={deleteHandler.bind(null, app[0])}
                >
                  Delete
                </button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Projects;
