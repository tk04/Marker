import { getProjects, deleteProject } from "@/utils/appStore";

import { useEffect, useState } from "react";
import Projects from "./Projects";
import EmptyProject from "./EmptyProject";
import AddProject from "./AddProject";
import useStore from "@/store/appStore";

const Apps = () => {
  const { projects, setProjects } = useStore((s) => ({
    projects: s.projects,
    setProjects: s.setProjects,
  }));
  const [empty, setEmpty] = useState(false);
  useEffect(() => {
    getProjects().then((e) => setProjects(e));
  }, []);
  useEffect(() => {
    if (projects && Object.keys(projects).length == 0) {
      setEmpty(true);
    } else {
      setEmpty(false);
    }
  }, [projects]);

  async function deleteHandler(id: string) {
    const res = await deleteProject(id);
    setProjects(res);
  }
  if (!projects) return;
  return (
    <div>
      {empty ? (
        <EmptyProject />
      ) : (
        <Projects projects={projects} deleteHandler={deleteHandler} />
      )}
      <AddProject>Add Project</AddProject>
    </div>
  );
};
export default Apps;
