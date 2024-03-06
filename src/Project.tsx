import { useParams } from "react-router-dom";
import App from "@/components/Project/App";

function Project() {
  const { id } = useParams();

  return <App id={id} />;
}

export default Project;
