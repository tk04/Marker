import { Dir, Projects } from "@/utils/types";
import { FileEntry } from "@tauri-apps/api/fs";
import { create } from "zustand";

interface AppState {
  currProject?: Dir;
  projects: Projects;
  files: FileEntry[];
  currFile?: FileEntry;

  setCurrFile: (name?: FileEntry) => void;
  setProjects: (projects: Projects) => void;
  setCurrProject: (project: Dir) => void;
  setFiles: (files: FileEntry[]) => void;
}
const useStore = create<AppState>()((set) => ({
  currProject: undefined,
  projects: {},
  files: [],
  currFile: undefined,

  setCurrFile: (currFile) => set(() => ({ currFile })),
  setCurrProject: (project) => set(() => ({ currProject: project })),
  setProjects: (projects) => set(() => ({ projects })),
  setFiles: (files) => set(() => ({ files })),
}));

export default useStore;
