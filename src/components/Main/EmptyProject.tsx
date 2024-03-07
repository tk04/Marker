import docSrc from "/docs.svg";
import { open } from "@tauri-apps/api/shell";

const EmptyProject = () => {
  return (
    <div className="mx-auto w-fit mb-20 flex items-center gap-2">
      <div className="flex flex-col -mt-20">
        <img src={docSrc} width={400} />
        <p className="text-neutral-600 text-[10px] -mt-10 m-auto">
          Illustrations by{" "}
          <button onClick={() => open("https://storyset.com/")}>
            Storyset
          </button>
        </p>
      </div>
    </div>
  );
};
export default EmptyProject;
