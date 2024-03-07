import store from "@/utils/appStore";

import { useEffect, useState } from "react";
import type { AppsType } from "@/utils/types";
import Projects from "./Projects";
import EmptyProject from "./EmptyProject";
import AddProject from "./AddProject";

const Apps = () => {
  const [apps, setApps] = useState<AppsType>();
  const [empty, setEmpty] = useState(false);
  useEffect(() => {
    store.get("apps").then((e) => {
      setApps(e || {});
    });
  }, []);
  useEffect(() => {
    if (apps && Object.keys(apps).length == 0) {
      setEmpty(true);
    } else {
      setEmpty(false);
    }
  }, [apps]);

  async function deleteHandler(id: string) {
    const currApps: object = (await store.get("apps")) || {};
    //@ts-ignore
    delete currApps[id];
    setApps(currApps);

    await store.set("apps", currApps);
    await store.save();
  }
  if (!apps) return;
  return (
    <div>
      {empty ? (
        <EmptyProject />
      ) : (
        <Projects apps={apps} deleteHandler={deleteHandler} />
      )}
      <AddProject setApps={setApps}>Add Project</AddProject>
    </div>
  );
};
export default Apps;
