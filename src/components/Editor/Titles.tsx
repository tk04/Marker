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
  useEffect(() => {
    if (titleRef.current && subTitleRef.current) {
      titleRef.current!.style.height = "52px";
      titleRef.current!.style.height = titleRef.current!.scrollHeight + "px";

      subTitleRef.current!.style.height = "25px";
      subTitleRef.current!.style.height =
        subTitleRef.current!.scrollHeight + "px";
    }
  }, [metadata]);
  return (
    <div className="mt-2 mb-5 px-2 md:px-0 max-w-[736px] m-auto">
      <textarea
        ref={titleRef}
        className="outline-none text-5xl font-semibold resize-none mt-10 w-full block"
        maxLength={200}
        placeholder="Enter title..."
        defaultValue={metadata?.title}
        onChange={(e) => {
          setMetadata((p) => ({ ...p, title: e.target.value }));
          onUpdate();
        }}
      />
      <textarea
        ref={subTitleRef}
        className="text-md text-gray-700/70 outline-none resize-none w-full block mt-2"
        placeholder="Enter subtitle..."
        defaultValue={metadata?.subtitle}
        onChange={(e) => {
          setMetadata((p) => ({ ...p, subtitle: e.target.value }));
          onUpdate();
        }}
      />
    </div>
  );
};
export default React.memo(Titles);
