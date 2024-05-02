import React, {
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";

type Metadata = { [key: string]: any };
interface props {
  metadata?: Metadata;
  setMetadata: Dispatch<SetStateAction<Metadata>>;
  onUpdate: () => void;
}
const Titles: React.FC<props> = ({ metadata, setMetadata, onUpdate }) => {
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const subTitleRef = useRef<HTMLTextAreaElement>(null);
  function resizeInput() {
    if (titleRef.current && subTitleRef.current) {
      titleRef.current!.style.height = "auto";
      titleRef.current!.style.height =
        titleRef.current!.scrollHeight + 4 + "px";

      subTitleRef.current!.style.height = "auto";
      subTitleRef.current!.style.height =
        subTitleRef.current!.scrollHeight + 4 + "px";
    }
  }
  useEffect(() => {
    resizeInput();
  }, [metadata]);

  useEffect(() => {
    window.addEventListener("resize", resizeInput);
    return () => {
      window.removeEventListener("resize", resizeInput);
    };
  }, []);
  return (
    <div className="mt-2 mb-5 px-2 md:px-0 ">
      <textarea
        ref={titleRef}
        className="outline-none text-5xl font-semibold resize-none mt-10 w-full block"
        rows={1}
        placeholder="Enter title..."
        value={metadata?.title || ""}
        onChange={(e) => {
          setMetadata((p) => ({ ...p, title: e.target.value }));
          onUpdate();
        }}
      />
      <textarea
        ref={subTitleRef}
        className="text-md text-gray-700/70 dark:text-gray-400 outline-none resize-none w-full block mt-2"
        rows={1}
        placeholder="Enter subtitle..."
        value={metadata?.subtitle || ""}
        onChange={(e) => {
          setMetadata((p) => ({ ...p, subtitle: e.target.value }));
          onUpdate();
        }}
      />
    </div>
  );
};
export default React.memo(Titles);
