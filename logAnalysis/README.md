## Update component_ownership.csv

1. Navigate to [Team Component Affiliation](https://www.notion.so/acuitymd/be5b554a52e84ffbbea663307c44a2b5?v=866e427afc914a75a52973d92729b2e7)
1. Ensure first column is component name and second column is team name
1. Export to csv. Exclude images.
1. Unzip. Drop the file in `./resource`
1. Rename the file to `component_ownership.csv`
1. Run `npm install && npm start`
1. Commit and push the diff.
1. View diff on github.
1. Create new components in Jira that didn't previously exist.
1. [Upload new automation](https://acuitymd.atlassian.net/jira/settings/automation#/import)
1. Deactivate old rule. Activate new rule. Delete old rule.
1. Migrate issues to new components.
1. Delete components in Jira that have been removed.
