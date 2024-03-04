import { Command } from "@tauri-apps/api/shell";

import { readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import markdown from "highlight.js/lib/languages/markdown";
import "highlight.js/styles/nord.css";
import hljs from "highlight.js/lib/core";
hljs.registerLanguage("md", markdown);
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { join } from "@tauri-apps/api/path";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface props {
  projectPath: string;
  filePath: string;
  reRender: () => void;
}
const Publish: React.FC<props> = ({ filePath, projectPath, reRender }) => {
  const mdRef = useRef<HTMLElement>(null);
  const [update, setUpdate] = useState(0);
  const commitMsgRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>();
  const [content, setContent] = useState<string>();
  const [open, setOpen] = useState(false);
  async function publishHandler() {
    const txtContent = mdRef.current!.textContent;
    if (!txtContent) {
      setError(
        `An error happened while trying to get this file's text content.`,
      );
      return;
    }
    await writeTextFile(filePath, txtContent);
    const dir = await join(filePath, "../");
    const addCmd = await new Command(
      "git",
      ["add", filePath.replace(dir + "/", "")],
      {
        cwd: dir,
      },
    ).execute();
    if (addCmd.stderr) {
      setError(addCmd.stderr);
      return;
    }

    const commitCmd = await new Command(
      "git",
      ["commit", "-m", commitMsgRef.current!.value],
      {
        cwd: dir,
      },
    ).execute();
    if (commitCmd.stderr) {
      setError(commitCmd.stderr);
      return;
    }

    const pushCmd = await new Command("git", ["push"], {
      cwd: dir,
    }).execute();
    if (pushCmd.stderr) {
      setError(pushCmd.stderr);
      return;
    }
    //re-render to show changes in updated markdown content
    reRender();
  }
  async function getContent() {
    let data = await readTextFile(filePath);
    setContent(data);
  }
  useEffect(() => {
    if (open) {
      getContent();
    }
    let timeout: number;
    if (open && content) {
      timeout = setTimeout(() => {
        if (!mdRef.current) return;
        mdRef.current.removeAttribute("data-highlighted");
        hljs.highlightElement(mdRef.current);
      }, 0);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [open, content]);
  useEffect(() => {
    let timeout = setTimeout(() => {
      if (!mdRef.current) return;
      mdRef.current.removeAttribute("data-highlighted");
      hljs.highlightElement(mdRef.current);
    }, 3000);
    return () => {
      clearTimeout(timeout);
    };
  }, [update]);

  return (
    <div>
      <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
        <DialogTrigger className="">Publish</DialogTrigger>
        <DialogContent className="sm:rounded-sm max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Commit Changes</DialogTitle>
            <DialogDescription>
              We will commit your changes using git. Make sure you have a git
              repo setup in your project's directory.
            </DialogDescription>
          </DialogHeader>

          <div className="mb-5">
            <h2 className="text-lg font-medium">Raw Markdown</h2>
            <pre className="max-h-[400px] overflow-auto">
              <code
                ref={mdRef}
                className="language-md"
                contentEditable
                onInput={(e) => {
                  e.preventDefault();
                  setUpdate((p) => p + 1);
                }}
              >
                {content}
              </code>
            </pre>
            <div className="mt-5">
              <Label>Commit message</Label>
              <Input
                ref={commitMsgRef}
                defaultValue={`Made changes to ${filePath.replace(
                  projectPath + "/",
                  "",
                )} `}
              ></Input>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <DialogFooter className="block">
            <Button className="w-full rounded-sm" onClick={publishHandler}>
              Commit & Push Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Publish;
