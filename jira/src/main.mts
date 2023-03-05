import generateAutomationJson from "./generateAutomationJson.mjs";
import generateJiraFilterMarkdown from "./generateFilterMarkdown.mjs";
import read from "./read.mjs";
import write from "./write.mjs";

(function () {
  const teamComponents = read();
  write("jira_filters", "md", generateJiraFilterMarkdown(teamComponents));
  write("automation", "json", generateAutomationJson(teamComponents));
})();
