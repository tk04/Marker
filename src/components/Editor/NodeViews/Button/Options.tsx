import Option from "@/components/Option";

import { Slider } from "@/components/ui/slider";
import { useEffect, useRef, useState } from "react";
import { BiLeftArrowAlt } from "react-icons/bi";
import { TfiAlignCenter, TfiAlignLeft, TfiAlignRight } from "react-icons/tfi";
import ChromePicker from "react-color";

interface props {
  closeModal: () => void;
  updateAttributes: (attrs: object) => void;
  attrs: {
    text: string;
    align: string;
    color: string;
    bgColor: string;
    href: string;
    width: string;
  };
}
const Options: React.FC<props> = ({ attrs, closeModal, updateAttributes }) => {
  let textRef = useRef<HTMLInputElement>(null);
  let linkRef = useRef<HTMLInputElement>(null);
  const [screen, setScreen] = useState(0);
  const [color, setColor] = useState<null | "text" | "bg">(null);
  const clickHandler = (item: number) => {
    setScreen(item);
    setColor(null);
  };
  const updateAlign = (align: string) => {
    updateAttributes({
      align,
    });
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
          <Option onClick={clickHandler.bind(null, 1)}>
            Change Text or Link
          </Option>
          <Option onClick={clickHandler.bind(null, 2)}>Adjust Colors</Option>

          <p>Width:</p>
          <Slider
            defaultValue={[0]}
            max={100}
            step={1}
            min={10}
            onValueChange={(e: number[]) =>
              updateAttributes({ width: e[0] + "%" })
            }
          />
          <p>Rounded:</p>
          <Slider
            defaultValue={[30]}
            max={100}
            step={1}
            onValueChange={(e: number[]) => updateAttributes({ rounded: e[0] })}
          />

          <div className="flex justify-center pt-2 gap-4 text-md">
            <TfiAlignLeft
              className="hover:bg-neutral-200/50 p-2 w-8 h-8 rounded-lg cursor-pointer"
              onClick={updateAlign.bind(null, "left")}
            />
            <TfiAlignCenter
              className="hover:bg-neutral-200/50 p-2 w-8 h-8 rounded-lg cursor-pointer"
              onClick={updateAlign.bind(null, "center")}
            />
            <TfiAlignRight
              className="hover:bg-neutral-200/50 p-2 w-8 h-8 rounded-lg cursor-pointer"
              onClick={updateAlign.bind(null, "right")}
            />
          </div>
        </div>
      ) : screen == 1 ? (
        <div className="w-56 py-1  space-y-2">
          <div>
            <label className="block text-sm ">Text</label>
            <input
              ref={textRef}
              defaultValue={attrs.text}
              className="w-full text-[15px] border rounded-md px-2  focus:outline-none py-1"
            />
          </div>

          <div className="w-56 py-1 xspace-y-1 space-y-5">
            <div>
              <label className="block text-sm ">Link</label>
              <input
                ref={linkRef}
                defaultValue={attrs.href}
                className="w-full text-[15px] border rounded-md px-2  focus:outline-none py-1"
              />
            </div>
          </div>
          <button
            className="bg-primary text-secondary rounded-md py-1 font-semibold  text-[13px] px-2 w-full hover:bg-neutral-600 "
            onClick={() => {
              updateAttributes({
                text: textRef.current?.value,
                href: linkRef.current?.value,
              });
              closeModal();
            }}
          >
            Save
          </button>
        </div>
      ) : (
        <div className="space-y-2 p-1 relative">
          <div
            className="flex gap-2 items-center hover:bg-neutral-200/50 p-2 rounded-lg cursor-pointer"
            onClick={setColor.bind(null, "bg")}
          >
            <div
              className={`w-5 h-5 rounded-full border-2`}
              style={{ backgroundColor: attrs.bgColor }}
            ></div>
            <p>Background Color</p>
          </div>

          <div
            className="flex gap-2 items-center hover:bg-neutral-200/50 p-2 rounded-lg cursor-pointer"
            onClick={setColor.bind(null, "text")}
          >
            <div
              className={`w-5 h-5 rounded-full border-2`}
              style={{ backgroundColor: attrs.color }}
            ></div>
            <p>Text Color</p>
          </div>
          {color && (
            <ChromePicker
              disableAlpha
              color={color == "text" ? attrs.color : attrs.bgColor}
              // onChangeComplete={() => setColor(null)}
              onChange={(c) => {
                if (color == "bg") {
                  updateAttributes({ bgColor: c.hex });
                } else {
                  updateAttributes({ color: c.hex });
                }
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};
export default Options;
