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
  interface Commands<ReturnType> {
    metadata: {
      /**
       * Comments will be added to the autocomplete.
       */
      updateMetadata: (data: Partial<MetadataType>) => ReturnType;
    };
  }
}

const Metadata = Extension.create<MetadataType, MetadataType>({
  name: "metadata",
  addStorage() {
    return this.options;
  },

  addCommands() {
    return {
      updateMetadata: (data) => () => {
        for (let prop of Object.keys(data)) {
          //@ts-ignore
          this.storage[prop] = data[prop];
        }
        return true;
      },
    };
  },
});

export default Metadata;
