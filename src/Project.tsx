import { useLoaderData } from "react-router-dom";
import { Dir } from "./utils/types";
import App from "@/components/Project/App";

function Project() {
  const { project }: { project: Dir } = useLoaderData() as any;
  return <App project={project} />;
}

export default Project;
