import { FileInfo } from "./getFileMeta";

function removePath(path: string, files: FileInfo[]) {
  return files.filter((f) => {
    if (f.path == path) return false;
    if (f.children) {
      f.children = removePath(path, f.children);
    }
    return true;
  });
}

export default removePath;
