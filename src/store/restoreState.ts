import { getCurrProject, getProjects, getSortInfo } from "@/utils/appStore";
import useStore from "./appStore";

async function restoreState() {
  useStore.setState({
    projects: await getProjects(),
    sortInfo: (await getSortInfo()) ?? undefined,
    currProject: (await getCurrProject()) ?? undefined,
  });
}

export default restoreState;
