import { join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";
async function getImgUrl(filePath: string, imgPath: string) {
  const dir = await join(filePath, "../", imgPath);
  return convertFileSrc(dir);
}
export default getImgUrl;
