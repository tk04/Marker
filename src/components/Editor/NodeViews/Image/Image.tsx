import { NodeViewWrapper } from "@tiptap/react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Options from "./Options";
import type props from "../types";
import getImgUrl from "@/utils/getImgUrl";

var imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "heif"];
const ImageView: React.FC<props> = ({ node, selected, updateAttributes }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [isImg, setIsImage] = useState(true);
  async function updateAssetSrc() {
    const src = await getImgUrl(node.attrs.folderPath, node.attrs.src);
    updateAttributes({ src, imgPath: node.attrs.src });
  }
  useEffect(() => {
    if (
      !node?.attrs?.src?.startsWith("asset://") &&
      !node?.attrs?.src?.startsWith("http")
    ) {
      updateAssetSrc();
    }

    const ext: string = node.attrs.src.split(".").pop();
    setIsImage(imageExtensions.includes(ext.toLowerCase()));
  }, [node.attrs.src]);

  const updateAlt = (alt: string) => {
    updateAttributes({
      alt,
    });
  };
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
        {isImg ? (
          <img src={node.attrs.src} />
        ) : (
          <video className="video" controls>
            <source src={node.attrs.src} />
          </video>
        )}
        {selected && isImg && (
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
        )}
      </div>
    </NodeViewWrapper>
  );
};
export default ImageView;
