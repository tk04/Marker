import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AppsType, Dir } from "@/utils/types";
import { Dispatch, SetStateAction, useState } from "react";
import { BsFolder2Open } from "react-icons/bs";
import { Link } from "react-router-dom";
import CreateProject from "../Main/AddProject";
import { MdAdd } from "react-icons/md";
interface props {
  apps: AppsType;
  currProject: Dir;
  setApps: Dispatch<SetStateAction<AppsType>>;
}
const Selector: React.FC<props> = ({ apps, currProject, setApps }) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={(e) => setOpen(e)}>
      <PopoverTrigger
        title={currProject.dir}
        className="w-full border-t px-5 py-3"
      >
        <div className="flex items-center gap-2 text-neutral-700">
          <BsFolder2Open size={18} />
          <h1 className="w-fit">{currProject.name}</h1>
        </div>
        <p className="text-neutral-400 text-[10px] text-ellipsis overflow-hidden">
          {currProject.dir}
        </p>
      </PopoverTrigger>
      <PopoverContent className="m-0 p-0">
        <div>
          {apps &&
            Object.entries(apps).map((app) => (
              <Link
                key={app[0]}
                to={`/project/${app[0]}`}
                onClick={() => setOpen(false)}
                className={`block border-b py-4 px-5 last:border-b-0 hover:bg-neutral-100 hover:cursor-pointer ${
                  app[1].dir == currProject.dir && "bg-neutral-100"
                }`}
              >
                <div className="flex items-center gap-2 text-neutral-700">
                  <BsFolder2Open />
                  <h2 className="text-[15px]">{app[1].name}</h2>
                </div>
                <p className="text-neutral-700 text-[10px]">{app[1].dir}</p>
              </Link>
            ))}
        </div>
        <CreateProject
          setApps={setApps}
          className="px-5 py-2 w-full text-sm border-t hover:bg-neutral-100 outline-none"
        >
          <div className="flex gap-1 items-center">
            <MdAdd />
            Add Project
          </div>
        </CreateProject>
      </PopoverContent>
    </Popover>
  );
};
export default Selector;
