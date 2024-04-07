import { setCurrProject, setSortInfo } from "@/utils/appStore";
import { FileInfo, getFileMeta } from "@/utils/getFileMeta";
import { Dir, Projects, SortInfo } from "@/utils/types";
import { FileEntry, readDir } from "@tauri-apps/api/fs";
import { create } from "zustand";
interface AppState {
  currProject?: Dir;
  projects: Projects;
  files: FileInfo[];
  currFile?: FileInfo;
  sortInfo?: SortInfo;

  setCurrFile: (name?: FileInfo) => void;
  setProjects: (projects: Projects) => void;
  setCurrProject: (project: Dir) => void;
  setFiles: (files: FileInfo[]) => void;
  fetchDir: () => Promise<void>;
  setSortInfo: (sortInfo: SortInfo) => Promise<void>;
}
const useStore = create<AppState>()((set, get) => ({
  currProject: undefined,
  projects: {},
  files: [],
  currFile: undefined,

  setCurrFile: (currFile) => set(() => ({ currFile })),
  setCurrProject: async (project) => {
    set(() => ({ currProject: project }));
    await setCurrProject(project);
  },

  setProjects: (projects) => set(() => ({ projects })),
  setFiles: (files) => set(() => ({ files })),

  setSortInfo: async (sortInfo) => {
    set(() => ({
      sortInfo,
    }));
    await setSortInfo(sortInfo);
  },
  fetchDir: async () => {
    const currProject = get().currProject?.dir;
    if (!currProject) return;
    const entries = await readDir(currProject, {
      recursive: true,
    });

    async function processEntries(entries: FileEntry[], arr: FileInfo[]) {
      for (const entry of entries) {
        if (entry.name?.startsWith(".")) {
          continue;
        }
        if (entry.children) {
          let subArr: any[] = [];
          processEntries(entry.children, subArr);
          arr.push({
            ...entry,
            children: subArr,
            meta: await getFileMeta(entry),
          });
        } else {
          if (!entry.name?.endsWith(".md")) {
            continue;
          }
          arr.push({ ...entry, meta: await getFileMeta(entry) });
        }
      }
    }
    const files: FileInfo[] = [];
    await processEntries(entries, files);
    set(() => ({ files }));
  },
}));

export default useStore;
