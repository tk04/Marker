import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import VideoView from "../NodeViews/Video";
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      /**
       * Add a video
       */
      setVideo: (options: { src: string; type?: string }) => ReturnType;
    };
  }
}
const Video = Node.create({
  name: "video",
  group: "block",
  parseHTML() {
    return [{ tag: "video" }];
  },

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => {
          return element.querySelector("source")?.getAttribute("src");
        },
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      { controls: true, class: "video" },
      ["source", HTMLAttributes],
    ];
  },
  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(VideoView);
  },
});

export default Video;
