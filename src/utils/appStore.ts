import { Store } from "tauri-plugin-store-api";
import type { Projects, Dir } from "./types";

const store = new Store(".apps.dat");

async function getProjects(): Promise<Projects> {
  return (await store.get("projects")) || ({} as any);
}

async function getProject(id: string): Promise<Dir> {
  const projects = await getProjects();
  return projects[id];
}
async function createProject(
  project: Omit<Dir, "id">,
): Promise<{ projects: Projects; newProjectId: string }> {
  const projects = await getProjects();
  const currId: string = (await store.get("id")) || "0";
  projects[currId] = { ...project, id: currId };

  await store.set("projects", projects);
  await store.set("id", currId + 1);

  return { projects, newProjectId: currId };
}

async function deleteProject(id: string) {
  const projects = await getProjects();
  delete projects[id];

  await store.set("projects", projects);
  return projects;
}

async function getCurrProject(): Promise<string | null> {
  return store.get("currProject");
}
async function setCurrProject(id: string) {
  await store.set("currProject", id);
}

export {
  getProjects,
  getProject,
  createProject,
  deleteProject,
  getCurrProject,
  setCurrProject,
};
