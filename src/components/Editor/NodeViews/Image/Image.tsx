import { NodeViewWrapper } from "@tiptap/react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { IoResizeOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Options from "./Options";
import type props from "../types";
import { toast } from "@/components/ui/use-toast";

const ImageView: React.FC<props> = ({
  node,
  selected,
  updateAttributes,
  deleteNode,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [uploadImage, setUploadImage] = useState(false);
  useEffect(() => {
    if (node && node.attrs?.src?.startsWith("blob:") && !node.attrs?.noUpload) {
      setUploadImage(true);
    }
  }, [node.attrs]);
  useEffect(() => {
    if (uploadImage && node.attrs.src?.startsWith("blob:")) {
      const uploadImg = async () => { };
      uploadImg();
    }
  }, [uploadImage]);

  const handleCircleDrag = (event: any) => {
    let rects = ref.current!.getBoundingClientRect();
    let aspectRatio = rects.width / rects.height;
    let moveX = event.movementX;

    ref.current!.style.background = "rgba(0,0,0,0.1)";
    ref.current!.style.borderStyle = "dashed";
    if (rects.width + moveX <= 1024 && rects.width + moveX >= 150) {
      ref.current!.style.height = `${(moveX + rects.width) / aspectRatio}px`;
      ref.current!.style.width = `${moveX + rects.width}px`;
    }
  };
  const mouseUpHandler = () => {
    window.removeEventListener("mousemove", handleCircleDrag);

    ref.current!.style.background = "none";
    ref.current!.style.borderStyle = "solid";
    let rects = ref.current!.getBoundingClientRect();
    updateAttributes({
      height: rects.height,
      width: rects.width,
    });
    window.removeEventListener("mouseup", mouseUpHandler);
  };
  const updateAlt = (alt: string) => {
    updateAttributes({
      alt,
    });
  };
  useEffect(() => {
    if (node.attrs.width > 1040) {
      updateAttributes({
        width: 1040,
      });
    }
  }, [node]);
  return (
    <NodeViewWrapper className="max-w-[1040px] m-auto flex justify-center w-full my-[42px]">
      <div
        ref={ref}
        style={{ width: Math.min(node.attrs.width, 1040) + "px" }}
        className={`relative max-h-[${node.attrs.height}px] max-w-[${Math.min(
          node.attrs.width,
          1040,
        )}px] ${selected && "outline outline-[3px] outline-[#7bf]"}`}
      >
        <img
          src={node.attrs.src}
          width={Math.min(node.attrs.width, 1040)}
          height={node.attrs.height}
          style={{ borderRadius: node.attrs.rounded + "px" }}
        />
        {selected && (
          <div>
            <div
              className="absolute -bottom-4 -right-4 cursor-nwse-resize h-8 w-8 rounded-full bg-[#7bf]"
              onMouseDown={() => {
                window.addEventListener("mousemove", handleCircleDrag);
                window.addEventListener("mouseup", mouseUpHandler);
              }}
            >
              <div className="flex justify-center items-center h-full w-full">
                <IoResizeOutline className="-scale-x-100 text-white" />
              </div>
            </div>
            <Popover open={open} onOpenChange={(val) => setOpen(val)}>
              <PopoverTrigger className="absolute -top-2 -right-2 text-white rounded-full p-1 z-10 bg-[#7bf]">
                <BiDotsVerticalRounded size={20} />
              </PopoverTrigger>
              <PopoverContent>
                <Options
                  alt={node.attrs.alt}
                  updateAlt={updateAlt}
                  closeModal={() => setOpen(false)}
                  updateAttributes={updateAttributes}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};
export default ImageView;
