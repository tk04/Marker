import markdownToHtml from "./markdownToHtml";
import htmlToMarkdown from "./htmlToMarkdown";
import { readTextFile } from "@tauri-apps/api/fs";

import yaml from "yaml";

async function readMarkdownFile(filePath: string) {
  let content = await readTextFile(filePath);
  const linesIdx = content.indexOf("---", 2);
  let metadata = {};
  // parse YAML header
  if (content.startsWith("---") && linesIdx != -1) {
    const metadataText = content.slice(3, linesIdx);
    metadata = yaml.parse(metadataText);
    content = content.slice(content.indexOf("---", 2) + 4);
  }
  const parsedHTML = await markdownToHtml(content);

  return {
    metadata,
    html: parsedHTML,
  };
}

export { markdownToHtml, htmlToMarkdown, readMarkdownFile };
