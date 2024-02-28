import { useRef } from "react";

interface props {
  alt: string;
  updateAlt: (alt: string) => void;
  closeModal: () => void;
  updateAttributes: (attrs: object) => void;
}
const Options: React.FC<props> = ({ alt, updateAlt, closeModal }) => {
  let inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="text-sm">
      <div className="w-56 py-1 xspace-y-1 space-y-5">
        <div>
          <label className="block text-sm ">Alt text</label>
          <input
            ref={inputRef}
            className="w-full text-[15px] border rounded-md px-2  focus:outline-none py-1"
            defaultValue={alt}
          />
        </div>
        <button
          className="bg-primary text-secondary rounded-md py-1 font-semibold  text-[13px] px-2 w-full hover:bg-neutral-600 "
          onClick={() => {
            updateAlt(inputRef.current?.value || alt);
            closeModal();
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};
export default Options;
