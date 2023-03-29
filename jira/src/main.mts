import { getDateString } from "./date.mjs";
import generateAutomationJson from "./generateAutomationJson.mjs";
import generateFilterMarkdown from "./generateFilterMarkdown.mjs";
import read from "./read.mjs";
import write from "./write.mjs";

(function () {
  const { teams, teamComponents } = read();
  const dateString = getDateString();

  write(`filters.md`, generateFilterMarkdown(teams, dateString));
  write(`automation.json`, generateAutomationJson(teamComponents, dateString));
})();
