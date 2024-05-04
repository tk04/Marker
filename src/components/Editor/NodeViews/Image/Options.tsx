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
      <form
        className="w-56 py-1 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();

          updateAlt(inputRef.current?.value || alt);
          closeModal();
        }}
      >
        <div>
          <label className="block text-sm ">Alt text</label>
          <input
            ref={inputRef}
            className="w-full text-[15px] border rounded-md px-2  focus:outline-none py-1"
            defaultValue={alt}
          />
        </div>
        <button
          className="bg-primary text-secondary rounded-md py-1 font-semibold text-[13px] px-2 w-full hover:opacity-80"
          type="submit"
        >
          Save
        </button>
      </form>
    </div>
  );
};
export default Options;
