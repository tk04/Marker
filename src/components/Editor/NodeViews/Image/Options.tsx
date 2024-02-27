import Option from "@/components/Option";
import { Slider } from "@/components/ui/slider";
import { useRef, useState } from "react";
import { BiLeftArrowAlt } from "react-icons/bi";

interface props {
  alt: string;
  updateAlt: (alt: string) => void;
  closeModal: () => void;
  updateAttributes: (attrs: object) => void;
}
const Options: React.FC<props> = ({
  alt,
  updateAlt,
  closeModal,
  updateAttributes,
}) => {
  let inputRef = useRef<HTMLInputElement>(null);
  const [screen, setScreen] = useState(0);
  const clickHandler = (item: number) => {
    setScreen(item);
  };
  return (
    <div className="text-sm">
      {screen != 0 && (
        <div
          className="flex items-center cursor-pointer text-xs text-neutral-500"
          onClick={clickHandler.bind(null, 0)}
        >
          <BiLeftArrowAlt size={17} />
          <p>back</p>
        </div>
      )}
      {screen == 0 ? (
        <div className="space-y-2">
          <Option onClick={clickHandler.bind(null, 1)}>Change Alt</Option>

          <p>Rounded:</p>
          <Slider
            defaultValue={[30]}
            max={100}
            step={1}
            onValueChange={(e: number[]) => updateAttributes({ rounded: e[0] })}
          />
        </div>
      ) : (
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
      )}
    </div>
  );
};
export default Options;
