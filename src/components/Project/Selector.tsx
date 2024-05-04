import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { BsFolder2Open } from "react-icons/bs";
import { Link } from "react-router-dom";
import CreateProject from "../Main/AddProject";
import { MdAdd } from "react-icons/md";
import useStore from "@/store/appStore";

const Selector = () => {
  const { projects, currProject } = useStore((s) => ({
    projects: s.projects,
    currProject: s.currProject,
  }));
  const [open, setOpen] = useState(false);

  if (!currProject) return;
  return (
    <Popover open={open} onOpenChange={(e) => setOpen(e)}>
      <PopoverTrigger
        title={currProject.dir}
        className="w-full border-t px-5 py-3"
      >
        <div className="flex items-center gap-2 text-neutral-700 text-primary">
          <BsFolder2Open size={18} />
          <h1 className="w-fit">{currProject.name}</h1>
        </div>
        <p className="text-neutral-400 text-[10px] w-full whitespace-nowrap text-ellipsis overflow-hidden">
          {currProject.dir}
        </p>
      </PopoverTrigger>
      <PopoverContent className="m-0 p-0 border-gray-200 bg-neutral-100 text-black">
        <div>
          {Object.entries(projects).map((p) => (
            <Link
              key={p[0]}
              to={`/project/${p[0]}`}
              onClick={() => setOpen(false)}
              className={`block border-b border-gray-300 py-4 px-5 last:border-b-0 hover:bg-neutral-200 hover:cursor-pointer ${p[1].dir == currProject.dir && "bg-neutral-200"
                }`}
            >
              <div className="flex items-center gap-2">
                <BsFolder2Open className="" />
                <h2 className="text-black text-[15px]">{p[1].name}</h2>
              </div>
              <p className="xtext-neutral-700 text-black xdark:text-neutral-300 text-[10px]">
                {p[1].dir}
              </p>
            </Link>
          ))}
        </div>
        <CreateProject className="px-5 py-2 w-full text-sm border-t hover:bg-neutral-100 outline-none">
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
