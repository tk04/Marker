import docSrc from "/docs.svg";
import { open } from "@tauri-apps/api/shell";

const EmptyProject = () => {
  return (
    <div className="mx-auto w-fit mb-20 flex items-center gap-2">
      <div className="text-neutral-600 max-w-xs">
        <p className="mb-2">
          You don't have any projects. Create one to get started
        </p>
        <ol className="text-sm">
          <li>Click the "Add project" button below</li>
          <li>Give your project a name</li>
          <li>
            Select the directory in which your markdown files will be stored
          </li>
          <li>Create the project by clicking the "Add project" button</li>
        </ol>
      </div>
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
