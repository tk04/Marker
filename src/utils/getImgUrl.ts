import { join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";
async function getImgUrl(folderPath: string, imgPath: string) {
  const dir = await join(folderPath, imgPath);
  return convertFileSrc(dir);
}
export default getImgUrl;
