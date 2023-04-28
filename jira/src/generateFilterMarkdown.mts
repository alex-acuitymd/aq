import {
  and,
  bug,
  componentEmpty,
  createdWithinPastThirtyDays,
  not,
  project,
  teamComponentsLabelFilter,
  resolved,
  createdWithinPastDay,
  createdBeforeAprilTwelfth,
  teamCleanSlateCondition,
} from "./filters.mjs";
import { filterLink, h1, h2, page, table } from "./markdown.mjs";
import type { Team } from "./types.mjs";

export default function generateFilterMarkdown(
  teams: Set<Team>,
  dateString: string
) {
  const missingComponentCommon = [
    project,
    bug,
    componentEmpty,
    createdWithinPastThirtyDays,
  ];
  return page(
    h1(`Filters ${dateString}`),
    h2("Across teams"),
    ...table(
      ["Description", "Filter"],
      [
        ["Missing component", filterLink(and(missingComponentCommon))],
        [
          "Missing component (Out of SLA)",
          filterLink(
            and([...missingComponentCommon, not(createdWithinPastDay)])
          ),
        ],
        [
          "Needs resolution (out of SLA)",
          filterLink(
            and([
              project,
              bug,
              not(resolved),
              not(componentEmpty),
              not(createdWithinPastThirtyDays),
            ])
          ),
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
        ["Needs resolution", filterLink(and([...baseFilters]))],
        [
          "Needs resolution (out of SLA)",
          filterLink(and([...baseFilters, not(createdWithinPastThirtyDays)])),
        ],
        [
          "Needs resolution (clean slate 5/1)",
          filterLink(
            and([
              ...baseFilters,
              createdBeforeAprilTwelfth,
              teamCleanSlateCondition(team),
            ])
          ),
        ],
      ]
    ),
  ];
}
