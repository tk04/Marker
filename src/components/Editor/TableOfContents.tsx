import { TOC } from "./Editor";
import { memo } from "react";

interface props {
  toc: TOC;
}
const TableOfContents: React.FC<props> = ({ toc }) => {
  return (
    <div className="text-sm w-[200px] font-light">
      <h1 className="font-medium font-mono">Table of Contents</h1>
      <hr className="my-2" />
      {toc.map((element) => (
        <button
          key={element.node.attrs.id}
          className="block whitespace-nowrap w-full overflow-hidden text-ellipsis py-1 cursor-pointer hover:underline text-left"
          style={{
            marginLeft: `${(element.level - 1) * 10}px`,
          }}
          onClick={() => {
            const el = document.querySelector(
              `[id="${element.node.attrs.id}"]`,
            );
            el?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
        >
          {element.node.textContent}
        </button>
      ))}
    </div>
  );
};
export default memo(TableOfContents);
