import { NodeViewWrapper } from "@tiptap/react";
import type props from "./types";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

const VideoView: React.FC<props> = ({ node, deleteNode, updateAttributes }) => {
  const [uploadVid, setUploadVid] = useState(false);
  useEffect(() => {
    if (node?.attrs?.src?.startsWith("blob:") && !node?.attrs?.noUpload) {
      setUploadVid(true);
    }
  }, [node.attrs]);
  useEffect(() => { }, [uploadVid]);

  return (
    <NodeViewWrapper>
      <video className="video" controls>
        <source src={node.attrs.src} />
      </video>
    </NodeViewWrapper>
  );
};
export default VideoView;
