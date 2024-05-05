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
import { useToast } from "../ui/use-toast";
import { IoCheckmarkSharp } from "react-icons/io5";

interface props {
  projectPath: string;
  filePath: string;
  reRender: () => void;
}
const Publish: React.FC<props> = ({ filePath, projectPath, reRender }) => {
  const { toast } = useToast();
  const mdRef = useRef<HTMLElement>(null);
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
    if (addCmd.code != 0) {
      setError(addCmd.stderr || addCmd.stdout);
      return;
    }

    const commitCmd = await new Command(
      "git",
      ["commit", "-m", commitMsgRef.current!.value],
      {
        cwd: dir,
      },
    ).execute();
    if (commitCmd.code != 0) {
      setError(commitCmd.stderr || commitCmd.stdout);
      return;
    }

    const pushCmd = await new Command("git", ["push"], {
      cwd: dir,
    }).execute();
    if (pushCmd.code != 0) {
      setError(pushCmd.stderr || pushCmd.stdout);
      return;
    }
    //re-render to show changes in updated markdown content
    reRender();

    toast({
      title: "Pushed changes successfully",
      variant: "successfull",
      action: <IoCheckmarkSharp className="mr-5" />,
    });
  }
  async function getContent() {
    let data = await readTextFile(filePath);
    setContent(data);
  }
  useEffect(() => {
    if (open) {
      getContent();
    }
    let timeout: ReturnType<typeof setTimeout>;
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
  function highlightMarkdown() {
    if (!mdRef.current) return;
    mdRef.current.removeAttribute("data-highlighted");
    hljs.highlightElement(mdRef.current);
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
        <DialogTrigger className="text-sm">Publish</DialogTrigger>
        <DialogContent className="sm:rounded-sm max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Commit Changes</DialogTitle>
            <DialogDescription>
              We will commit your changes using git. Make sure you have a git
              repo setup in your project's directory.
            </DialogDescription>
          </DialogHeader>

          <div className="mb-5 max-w-full">
            <h2 className="text-lg font-medium">Raw Markdown</h2>
            <pre className="max-h-[400px] max-w-[650px] whitespace-pre-wrap overflow-auto">
              <code
                ref={mdRef}
                className="language-md"
                contentEditable
                onBlur={highlightMarkdown}
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
