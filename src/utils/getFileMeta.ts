import { FileEntry } from "@tauri-apps/api/fs";
import { invoke } from "@tauri-apps/api/tauri";

interface SystemTime {
  secs_since_epoch: number;
}
interface FileMeta {
  updated_at?: SystemTime;
  created_at?: SystemTime;
}

interface FileInfo extends FileEntry {
  meta?: FileMeta;
}
async function getFileMeta(file: FileEntry) {
  return (await invoke("get_file_metadata", {
    filepath: file.path,
  })) as FileMeta;
}

export { getFileMeta, type FileInfo };
