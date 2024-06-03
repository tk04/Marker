import { Extension } from "@tiptap/core";
export interface MetadataType {
  projectDir: string;
  assetsFolder: string;
  filePath: string;
}
declare module "@tiptap/core" {
  interface Storage {
    metadata: MetadataType;
  }
}

const Metadata = Extension.create<MetadataType, MetadataType>({
  name: "metadata",
  addStorage() {
    return this.options;
  },
});

export default Metadata;
