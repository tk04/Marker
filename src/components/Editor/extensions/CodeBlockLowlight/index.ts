import CodeBlock, { type CodeBlockOptions } from "@tiptap/extension-code-block";
import { common, createLowlight } from "lowlight";

import { LowlightPlugin } from "./lowlightPlugin";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CodeBlockView from "../../NodeViews/CodeBlockView";

export interface CodeBlockLowlightOptions extends CodeBlockOptions {
  lowlight: any;
  defaultLanguage: string | null | undefined;
}

export const lowlight = createLowlight(common);

lowlight.registerAlias({
  javascript: ["js"],
  typescript: ["ts"],
});
const CodeBlockLowlight = CodeBlock.extend<CodeBlockLowlightOptions>({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockView);
  },
  addOptions() {
    return {
      ...this.parent?.(),
      defaultLanguage: null,
    };
  },
  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() || []),
      LowlightPlugin({
        name: this.name,
        lowlight,
        defaultLanguage: this.options.defaultLanguage,
      }),
    ];
  },
});
export default CodeBlockLowlight;
