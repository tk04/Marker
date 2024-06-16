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

var imageExtensions = [
  "svg",
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "heif",
];
const ImageView: React.FC<props> = ({
  editor,
  node,
  selected,
  updateAttributes,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<string>(node.attrs?.src);
  const [open, setOpen] = useState(false);
  const [isImg, setIsImage] = useState(true);
  async function updateAssetSrc() {
    const src = await getImgUrl(
      editor.storage.metadata.filePath,
      node.attrs.src,
    );
    setSrc(src);
  }
  useEffect(() => {
    if (
      !node?.attrs?.src?.startsWith("asset://") &&
      !node?.attrs?.src?.startsWith("http")
    ) {
      updateAssetSrc();
    }

    const ext: string = node.attrs.src.split("?")[0].split(".").pop();
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
          <img src={src} />
        ) : (
          <video className="video" controls>
            <source src={src} />
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
