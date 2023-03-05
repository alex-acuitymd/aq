import {
  action,
  addLabel,
  applProject,
  automation,
  conditionContainerBlock,
  conditionIfBlock,
  jqlCondition,
  manualTrigger,
  removeLabel,
  rule,
} from "./automation.mjs";
import { componentsFilter } from "./filters.mjs";
import type { TeamComponents } from "./types.mjs";

export default function generateAutomationJson(teamComponents: TeamComponents) {
  return JSON.stringify(
    automation([
      rule(
        "zzz_aq_components",
        manualTrigger,
        [
          ...[...teamComponents.keys()].map((k) => {
            const teamFilter = componentsFilter(
              teamComponents.get(k) || new Set()
            );
            const teamLabel = `components:${k}`;
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
