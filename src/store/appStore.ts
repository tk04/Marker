import { setCurrProject, setSortInfo } from "@/utils/appStore";
import { FileInfo } from "@/utils/getFileMeta";
import { Dir, Projects, SortInfo } from "@/utils/types";
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
  setSortInfo: (sortInfo: SortInfo) => Promise<void>;
}
const useStore = create<AppState>()((set) => ({
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
}));

export default useStore;
