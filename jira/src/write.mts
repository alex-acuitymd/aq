import { writeFileSync } from "fs";

export default function write(filename: string, body: string) {
  writeFileSync(`generated/${filename}`, body);
}
