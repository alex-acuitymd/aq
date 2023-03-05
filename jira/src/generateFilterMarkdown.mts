import {
  and,
  bug,
  componentsFilter,
  createdLastThirtyDays,
  task,
  unresolved,
} from "./filters.mjs";
import { h1, page, teamFilterTable } from "./markdown.mjs";
import type { TeamComponents } from "./types.mjs";

export default function generateJiraFilterMarkdown(
  teamComponents: TeamComponents
) {
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
