import { Command } from "@tauri-apps/api/shell";

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

interface props {
  projectPath: string;
  filePath: string;
}
const txt = `---
test
---
[example](https://example.com)
`;
const Publish: React.FC<props> = ({ projectPath }) => {
  const mdRef = useRef<HTMLElement>(null);
  const [update, setUpdate] = useState(0);
  const [open, setOpen] = useState(false);
  async function publishHandler() {
    const command = await new Command("ls-command", ["-la"], {
      cwd: projectPath,
    }).execute();
    console.log(command.stdout);
  }
  useEffect(() => {
    let timeout = setTimeout(() => {
      if (!mdRef.current) return;
      mdRef.current.removeAttribute("data-highlighted");
      hljs.highlightElement(mdRef.current);
    }, 0);
    return () => {
      clearTimeout(timeout);
    };
  }, [open, mdRef]);
  useEffect(() => {
    let timeout = setTimeout(() => {
      if (!mdRef.current) return;
      mdRef.current.removeAttribute("data-highlighted");
      hljs.highlightElement(mdRef.current);
    }, 1000);
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

          <div>
            <h2 className="text-lg font-medium">Raw Markdown</h2>

            <pre className="max-h-[400px] overflow-auto">
              <code
                ref={mdRef}
                className="language-md"
                contentEditable
                onInput={() => {
                  setUpdate((p) => p + 1);
                }}
              >
                {txt}
              </code>
            </pre>
          </div>
          <DialogFooter>
            <Button className="w-full rounded-sm" onClick={publishHandler}>
              Publish changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Publish;
