import { EOL } from "os";
import type { Component, TeamComponents } from "./types.mjs";

export default function generate(teamComponents: TeamComponents) {
  return page(
    h1("all"),
    ...teamFilterTable(teamComponents, componentsFilter),
    "",
    h1("all l30"),
    ...teamFilterTable(teamComponents, (components) =>
      and([componentsFilter(components), createdLastThirtyDays])
    ),
    "",
    h1("all bugs l30"),
    ...teamFilterTable(teamComponents, (components) =>
      and([componentsFilter(components), bug, createdLastThirtyDays])
    ),
    "",
    h1("all tasks l30"),
    ...teamFilterTable(teamComponents, (components) =>
      and([componentsFilter(components), task, createdLastThirtyDays])
    ),
    "",
    h1("unresolved bugs"),
    ...teamFilterTable(teamComponents, (components) =>
      and([componentsFilter(components), bug, unresolved])
    ),
    "",
    h1("unresolved tasks"),
    ...teamFilterTable(teamComponents, (components) =>
      and([componentsFilter(components), task, unresolved])
    )
  );
}

// filters
const unresolved = "statusCategory != Done";
const bug = "type = Bug";
const task = "type = Task";
const createdLastThirtyDays = "created >= -30d";

function componentsFilter(components: Set<Component>) {
  return and([
    or([...components].map((c) => `component = "${c}"`)),
    "project = APPL",
  ]);
}

function or(s: string[]) {
  return perens(s.join(" OR "));
}

// filter combination
function and(s: string[]) {
  return perens(s.join(" AND "));
}

function perens(s: string) {
  return `( ${s} )`;
}

// markdown
function link(s: string) {
  return `[link](https://acuitymd.atlassian.net/issues/?jql=${encodeURI(s)})`;
}

function page(...lines: string[]) {
  return lines.join(EOL);
}

function h1(s: string) {
  return `# ${s}`;
}

function teamFilterTable(
  teamComponents: TeamComponents,
  filter: (components: Set<Component>) => string
) {
  return table(
    ["team", "filter", "link"],
    [
      ...[...teamComponents.keys()].map((k) => {
        const filterString = filter(teamComponents.get(k) || new Set());
        const filterLink = link(filterString);
        return [k, filterString, filterLink];
      }),
    ]
  );
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
