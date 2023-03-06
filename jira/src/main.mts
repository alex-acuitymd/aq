import { getDateString } from "./date.mjs";
import generateAutomationJson from "./generateAutomationJson.mjs";
import generateFilterMarkdown from "./generateFilterMarkdown.mjs";
import read from "./read.mjs";
import write from "./write.mjs";

(function () {
  const teamComponents = read();
  const dateString = getDateString();

  write(
    `filters_${dateString}.md`,
    generateFilterMarkdown(teamComponents, dateString)
  );
  write(
    `automation_${dateString}.json`,
    generateAutomationJson(teamComponents, dateString)
  );
})();
