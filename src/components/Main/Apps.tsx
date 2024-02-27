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
const Apps = () => {
  const [apps, setApps] = useState<any>({});
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
    if (!dir || !name) return;
    //@ts-ignore
    currApps[currId] = { dir, name };
    setApps(currApps);
    await store.set("apps", currApps);
    await store.set("id", currId + 1);
    await store.save();
  };
  return (
    <div>
      <div className="mb-10 space-y-7">
        {Object.keys(apps).map((app: any) => (
          <a
            href={`/project/${app}`}
            className="border block rounded-md p-5 w-full"
            key={app}
          >
            <h1 className="text-xl">{apps[app].name}</h1>
            <p className="text-sm text-gray-500">{apps[app].dir}</p>
          </a>
        ))}
      </div>

      <Dialog>
        <DialogTrigger className="border border-gray-400 hover:bg-neutral-100 p-2 w-full border-dashed rounded-md">
          Add project
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Project</DialogTitle>
            <DialogDescription>
              Add a new project to your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Project name" ref={nameRef} />
            </div>

            <div>
              <Label htmlFor="dir">Project Directory</Label>
              <p>dir: {dir}</p>
              <button onClick={searchForDirectory}>search dir</button>
            </div>
          </div>

          <Button onClick={submitHandler}>Add Project</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Apps;
