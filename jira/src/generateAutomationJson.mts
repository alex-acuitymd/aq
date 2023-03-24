import {
  action,
  addLabel,
  applProject,
  automation,
  conditionContainerBlock,
  conditionIfBlock,
  fieldChangeTrigger,
  jqlCondition,
  removeLabel,
  rule,
} from "./automation.mjs";
import { componentsFilter } from "./filters.mjs";
import { teamComponentsLabel } from "./label.mjs";
import type { TeamComponents } from "./types.mjs";

export default function generateAutomationJson(
  teamComponents: TeamComponents,
  dateString: string
) {
  return JSON.stringify(
    automation([
      rule(
        `team_components_label_${dateString}`,
        fieldChangeTrigger("components"),
        [
          ...[...teamComponents.keys()].map((k) => {
            const teamFilter = componentsFilter(
              teamComponents.get(k) || new Set()
            );
            const teamLabel = teamComponentsLabel(k);
            return conditionContainerBlock([
              conditionIfBlock(
                [action([addLabel(teamLabel)])],
                [jqlCondition(teamFilter)]
              ),
              conditionIfBlock([action([removeLabel(teamLabel)])], []),
            ]);
          }),
        ],
        [applProject]
      ),
    ]),
    null,
    2
  );
}
