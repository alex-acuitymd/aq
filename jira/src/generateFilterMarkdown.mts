import {
  and,
  bug,
  componentEmpty,
  createdWithinPastTwoDays,
  createdWithinPastThirtyDays,
  not,
  priorityEmpty,
  project,
  teamComponentsLabelFilter,
  resolved,
} from "./filters.mjs";
import { filterLink, h1, h2, page, table } from "./markdown.mjs";
import type { Team } from "./types.mjs";

export default function generateFilterMarkdown(
  teams: Set<Team>,
  dateString: string
) {
  return page(
    h1(`Filters ${dateString}`),
    h2("Across teams"),
    ...table(
      ["Description", "Filter"],
      [
        [
          "Missing component",
          filterLink(and([project, bug, not(resolved), componentEmpty])),
        ],
      ]
    ),
    ...[...teams].reduce<string[]>((memo, t) => {
      memo.push(...teamSection(t));
      return memo;
    }, [])
  );
}

function teamSection(team: Team) {
  const baseFilters = [
    project,
    bug,
    not(resolved),
    teamComponentsLabelFilter(team),
  ];
  return [
    h2(team),
    ...table(
      ["Description", "Filter"],
      [
        ["Needs triage", filterLink(and([...baseFilters, priorityEmpty]))],
        [
          "Needs triage (out of SLA)",
          filterLink(
            and([...baseFilters, priorityEmpty, not(createdWithinPastTwoDays)])
          ),
        ],
        [
          "Needs resolution",
          filterLink(and([...baseFilters, not(priorityEmpty)])),
        ],
        [
          "Needs resolution (out of SLA)",
          filterLink(
            and([
              ...baseFilters,
              not(priorityEmpty),
              not(createdWithinPastThirtyDays),
            ])
          ),
        ],
      ]
    ),
  ];
}
