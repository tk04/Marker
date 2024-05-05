import { CiFolderOn } from "react-icons/ci";
import { PiFileTextThin } from "react-icons/pi";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import useStore from "@/store/appStore";
import { FileEntry } from "@tauri-apps/api/fs";
import { useState, useEffect, memo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/ThemeProvider";
import { Moon, Sun, SunMoon } from "lucide-react";

const Files = ({
  files,
  close,
}: {
  files?: FileEntry[];
  close: () => void;
}) => {
  const { setCurrFile, projectDir } = useStore((s) => ({
    setCurrFile: s.setCurrFile,
    projectDir: s.currProject!.dir,
  }));
  return (
    <>
      {files?.map((file) =>
        file.name?.endsWith(".md") ? (
          <CommandItem
            key={file.path}
            onSelect={() => {
              setCurrFile(file);
              close();
            }}
            className="space-x-1"
          >
            <PiFileTextThin />
            <p>{file.path.replace(projectDir, "")}</p>
          </CommandItem>
        ) : (
          <Files key={file.path} files={file.children} close={close} />
        ),
      )}
    </>
  );
};

const CommandMenu: React.FC = () => {
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const elementRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { files, projects } = useStore((s) => ({
    files: s.files,
    projects: s.projects,
  }));
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  function close() {
    setOpen(false);
  }
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type a command or search..."
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            const arrowDownEvent = new KeyboardEvent("keydown", {
              bubbles: true,
              cancelable: true,
              key: "ArrowDown",
              code: "ArrowDown",
            });
            elementRef.current?.dispatchEvent(arrowDownEvent);
          }
        }}
      />
      <CommandList ref={elementRef}>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Go to">
          <Files files={files} close={close} />
        </CommandGroup>
        <CommandGroup heading="Projects">
          {Object.entries(projects).map((p) => (
            <CommandItem
              key={p[0]}
              className="space-x-1"
              onSelect={() => {
                navigate(`/project/${p[0]}`);
                close();
              }}
            >
              <CiFolderOn />
              <p>{p[1].name}</p>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Theme">
          <CommandItem
            className="space-x-1"
            onSelect={() => {
              setTheme("light");
              close();
            }}
          >
            <Sun />
            <p>Light Theme</p>
          </CommandItem>
          <CommandItem
            className="space-x-1"
            onSelect={() => {
              setTheme("dark");
              close();
            }}
          >
            <Moon />
            <p>Dark Theme</p>
          </CommandItem>

          <CommandItem
            className="space-x-1"
            onSelect={() => {
              setTheme("system");
              close();
            }}
          >
            <SunMoon />
            <p>System Theme</p>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default memo(CommandMenu);
