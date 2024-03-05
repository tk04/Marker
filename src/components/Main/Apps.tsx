import store from "@/utils/appStore";

import { open } from "@tauri-apps/api/dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import type { AppsType } from "@/utils/types";
import Projects from "./Projects";

const Apps = () => {
  const [apps, setApps] = useState<AppsType>({});
  const [error, setError] = useState<string>();
  const [dir, setDir] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    store.get("apps").then((e) => setApps(e || {}));
  }, []);

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
    const currApps: object = (await store.get("apps")) || {};
    const currId: number = (await store.get("id")) || 0;
    if (!dir || !name) {
      setError("Please make sure to enter both name and directory values");
      return;
    }
    //@ts-ignore
    currApps[currId] = { dir, name };
    setApps(currApps);
    await store.set("apps", currApps);
    await store.set("id", currId + 1);
    await store.save();
    window.location.assign(`/project/${currId}`);
  };

  async function deleteHandler(id: string) {
    const currApps: object = (await store.get("apps")) || {};
    //@ts-ignore
    delete currApps[id];
    setApps(currApps);

    await store.set("apps", currApps);
    await store.save();
  }
  return (
    <div>
      <Projects apps={apps} deleteHandler={deleteHandler} />
      <Dialog>
        <DialogTrigger className="border border-gray-400 hover:bg-neutral-100 p-2 w-full border-dashed rounded-md float-end mt-auto block">
          Add project
        </DialogTrigger>
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
                {dir && <p className="text-sm text-neutral-700 mt-2">{dir}</p>}
              </div>
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button className="rounded-sm" onClick={submitHandler}>
            Add Project
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Apps;
