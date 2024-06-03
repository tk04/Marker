import { createDir, exists, writeBinaryFile } from "@tauri-apps/api/fs";
import { join } from "@tauri-apps/api/path";
import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { MetadataType } from "./metadata";

const allowedMimes = new Set([
  // image mimes
  "image/svg+xml",
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/webp",
  "image/heif",

  // video mimes
  "video/mp4",
  "video/quicktime",
]);
const FileHandler = Extension.create({
  name: "fileHandler",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            drop: (view, event: DragEvent) => {
              event.preventDefault();
              event.stopPropagation();
              const file = event.dataTransfer?.files[0];
              if (!file) return false;
              if (!allowedMimes.has(file.type)) return false;

              const { assetsFolder, projectDir, filePath } = this.editor.storage
                .metadata as MetadataType;

              const paths = filePath
                .replace(projectDir, "")
                .split("/")
                .filter(Boolean);

              const relativePath = "./" + "../".repeat(paths.length - 1);

              async function dropFile() {
                const assetsDir = await join(projectDir, assetsFolder);
                if (!(await exists(assetsDir))) {
                  await createDir(assetsDir);
                }
                await writeBinaryFile(
                  await join(assetsDir, file!.name),
                  await file!.arrayBuffer(),
                );

                const { state, dispatch } = view;
                const { schema, tr } = state;
                const imgNode = schema.nodes.image.create({
                  src: `${relativePath + assetsFolder}/${file!.name}`,
                });
                const coords = { left: event.clientX, top: event.clientY };
                const pos = view.posAtCoords(coords);
                if (pos?.pos) {
                  tr.insert(pos.pos, imgNode);
                } else {
                  tr.replaceSelectionWith(imgNode);
                }
                dispatch(tr);
              }
              dropFile();
              return true;
            },
          },
        },
      }),
    ];
  },
});

export default FileHandler;
