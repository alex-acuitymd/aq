import { writeFileSync } from "fs";

export default function write(s: string) {
  const now = new Date();
  const dateString = `${now.getFullYear()}_${
    now.getUTCMonth() + 1
  }_${now.getUTCDate()}`;
  const filename = `jira_filters_${dateString}.md`;
  writeFileSync(`generated/${filename}`, s);
}
