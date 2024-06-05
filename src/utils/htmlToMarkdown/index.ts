import service from "./turndown";

function htmlToMarkdown(html: string) {
  return service.turndown(html);
}

export default htmlToMarkdown;
