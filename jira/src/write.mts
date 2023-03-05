import { writeFileSync } from "fs";

export default function write(
  filenamePrefix: string,
  fileType: string,
  body: string
) {
  const now = new Date();
  const dateString = `${now.getFullYear()}_${
    now.getUTCMonth() + 1
  }_${now.getUTCDate()}`;
  const filename = `${filenamePrefix}_${dateString}.${fileType}`;
  writeFileSync(`generated/${filename}`, body);
}
