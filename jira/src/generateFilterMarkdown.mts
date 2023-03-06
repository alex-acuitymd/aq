import {
  and,
  bug,
  componentsFilter,
  createdLastThirtyDays,
  task,
  unresolved,
} from "./filters.mjs";
import { h1, h2, page, teamFilterTable } from "./markdown.mjs";
import type { TeamComponents } from "./types.mjs";

export default function generateFilterMarkdown(
  teamComponents: TeamComponents,
  dateString: string
) {
  return page(
    h1(`Filters ${dateString}`),
    h2("all"),
    ...teamFilterTable(teamComponents, componentsFilter),
    h2("all l30"),
    ...teamFilterTable(teamComponents, (components) =>
      and([componentsFilter(components), createdLastThirtyDays])
    ),
    h2("all bugs l30"),
    ...teamFilterTable(teamComponents, (components) =>
      and([componentsFilter(components), bug, createdLastThirtyDays])
    ),
    h2("all tasks l30"),
    ...teamFilterTable(teamComponents, (components) =>
      and([componentsFilter(components), task, createdLastThirtyDays])
    ),
    h2("unresolved bugs"),
    ...teamFilterTable(teamComponents, (components) =>
      and([componentsFilter(components), bug, unresolved])
    ),
    h2("unresolved tasks"),
    ...teamFilterTable(teamComponents, (components) =>
      and([componentsFilter(components), task, unresolved])
    )
  );
}
