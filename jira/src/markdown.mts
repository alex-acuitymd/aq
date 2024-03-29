import { EOL } from "os";
import type { Component, TeamComponents } from "./types.mjs";

export function filterLink(s: string) {
  return `[${s}](https://acuitymd.atlassian.net/issues/?jql=${encodeURI(s)})`;
}

export function page(...lines: string[]) {
  return lines.join(EOL);
}

export function h1(s: string) {
  return `# ${s}`;
}

export function h2(s: string) {
  return `## ${s}`;
}

export function teamFilterTable(
  teamComponents: TeamComponents,
  filter: (components: Set<Component>) => string
) {
  return table(
    ["team", "filter"],
    [
      ...[...teamComponents.keys()].map((k) => {
        const filterString = filter(teamComponents.get(k) || new Set());
        return [k, filterLink(filterString)];
      }),
    ]
  );
}

export function table(headerRow: string[], body: string[][]) {
  return [
    tableRow(headerRow),
    tableRow(headerRow.map(() => "---")),
    ...body.map(tableRow),
    "",
  ];
}

export function tableRow(cells: string[]) {
  return `| ${cells.join(" | ")} |`;
}
