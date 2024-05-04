import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { createProject } from "@/utils/appStore";
import { open } from "@tauri-apps/api/dialog";
import { ReactNode, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useStore from "@/store/appStore";

const defaultClass =
  "p-2 w-full rounded-md bg-primary text-secondary font-medium";
interface props {
  children: ReactNode;
  className?: string;
}
const AddProject: React.FC<props> = ({
  children,
  className = defaultClass,
}) => {
  const setProjects = useStore((s) => s.setProjects);
  const [error, setError] = useState<string>();
  const nameRef = useRef<HTMLInputElement>(null);
  const [dir, setDir] = useState<string | null>(null);

  async function searchForDirectory() {
    try {
      const result = await open({
        directory: true,
        multiple: false,
      });
      if (result) {
        setDir(result as string);
      } else {
        console.log("No directory selected.");
        return null;
      }
    } catch (error) {
      console.error("Error while selecting directory:", error);
      return null;
    }
  }
  const submitHandler = async () => {
    const name = nameRef.current?.value;
    if (!dir || !name) {
      setError("Please make sure to enter both name and directory values");
      return;
    }

    const { projects, newProjectId } = await createProject({ dir, name });
    setProjects(projects);

    window.location.assign(`/project/${newProjectId}`);
  };
  return (
    <Dialog>
      <DialogTrigger className={className}>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
          <DialogDescription>
            Add a new project to your workspace
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 mb-5">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Project name"
              className="!bg-background"
              ref={nameRef}
              required
            />
          </div>

          <div>
            <Label htmlFor="dir">Project Directory</Label>
            <div>
              <Button
                size="sm"
                variant="outline"
                className="border-2 rounded-lg mt-1 px-4 text-sm"
                id="dir"
                onClick={searchForDirectory}
              >
                Select directory
              </Button>
              {dir && <p className="text-sm mt-2">{dir}</p>}
            </div>
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button className="rounded-sm" onClick={submitHandler}>
          Add Project
        </Button>
      </DialogContent>
    </Dialog>
  );
};
export default AddProject;
