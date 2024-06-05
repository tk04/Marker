import marked from "./marked";

async function markdownToHtml(markdown: string) {
  return marked.parse(markdown, { breaks: true });
}

export default markdownToHtml;
