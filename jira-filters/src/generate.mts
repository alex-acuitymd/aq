import { EOL } from "os";
import type { Component, TeamComponents } from "./types.mjs";

export default function generate(teamComponents: TeamComponents) {
  return page(h1("Jira Components"), "", ...getTeamFilterTable(teamComponents));
}

function getTeamFilterTable(teamComponents: TeamComponents) {
  return table(
    ["team", "filter"],
    [
      ...[...teamComponents.keys()].map((k) => {
        const components = teamComponents.get(k);
        if (components) {
          return [k, teamFilter(components)];
        } else {
          return [k, ""];
        }
      }),
    ]
  );
}

function teamFilter(components: Set<Component>) {
  return or(...[...components].map(componentFilter));
}

function componentFilter(c: string) {
  return `component = "${c}”`;
}

function or(...c: string[]) {
  return "(" + c.join(" OR ") + ")";
}

function page(...lines: string[]) {
  return lines.join(EOL);
}

function h1(s: string) {
  return `# ${s}`;
}

function table(headerRow: string[], body: string[][]) {
  return [
    tableRow(headerRow),
    tableRow(headerRow.map(() => "---")),
    ...body.map(tableRow),
  ];
}

function tableRow(cells: string[]) {
  return `| ${cells.join(" | ")} |`;
}
