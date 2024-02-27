//parse md yaml metadata
import yaml from "yaml";
function parseMd(metadata: string | null) {
  if (!metadata) return {};
  return yaml.parse(metadata);

  // const data = {};
  // metadata?.split("\n").forEach((s) => {
  //   let colonIdx = s.indexOf(":");
  //   if (colonIdx == -1) return;
  //   //@ts-ignore
  //   data[s.slice(0, colonIdx)] = s.slice(colonIdx + 1).trim();
  // });
  // return data;
}
export default parseMd;
