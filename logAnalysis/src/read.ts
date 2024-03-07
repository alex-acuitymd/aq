import { readFileSync } from "node:fs";

export default function read() {
  const j = readFileSync("./resource/raw.json").toString();
  return JSON.parse(j);
}
