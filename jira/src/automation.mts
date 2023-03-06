export type Action = ReturnType<typeof action>;

export type Automation = ReturnType<typeof automation>;
export function automation(rules: Rule[]) {
  return {
    cloud: true,
    rules: rules,
  } as const;
}
export type Rule = ReturnType<typeof rule>;

export function rule(
  name: string,
  trigger: Trigger,
  components: RuleComponent[],
  projects: Project[]
) {
  return {
    id: 10440318,
    clientKey: "e53e4be4-c654-354e-aa94-71b6a856b2e5",
    name,
    state: "DISABLED",
    description: "",
    authorAccountId: "6001b7bb91bb2e01083f41ed",
    actor: {
      type: "ACCOUNT_ID",
      value: "557058:f58131cb-b67d-43c7-b30d-6b58d40bd077",
    },
    created: 1677511922278,
    updated: 1678033544741,
    trigger,
    components,
    canOtherRuleTrigger: false,
    notifyOnError: "FIRSTERROR",
    projects,
    labels: [],
    tags: [],
    ruleScope: {
      resources: [
        "ari:cloud:jira:90705784-acb9-400f-96b7-5564fe1c88db:project/10006",
      ],
    },
    writeAccessType: "UNRESTRICTED",
    collaborators: [],
  } as const;
}

export type Trigger =
  | typeof manualTrigger
  | ReturnType<typeof fieldChangeTrigger>;
export const manualTrigger = {
  id: "224960425",
  component: "TRIGGER",
  parentId: null,
  conditionParentId: null,
  schemaVersion: 1,
  type: "jira.manual.trigger.issue",
  value: { groups: [], inputFromUsers: false, inputPrompts: [] },
  children: [],
  conditions: [],
  connectionId: null,
};

export function fieldChangeTrigger(fieldValue: string) {
  return {
    id: "225360019",
    component: "TRIGGER",
    parentId: null,
    conditionParentId: null,
    schemaVersion: 2,
    type: "jira.issue.field.changed",
    value: {
      changeType: "ANY_CHANGE",
      fields: [{ value: fieldValue, type: "field" }],
      actions: [],
    },
    children: [],
    conditions: [],
    connectionId: null,
  };
}

export type Project = typeof applProject;
export const applProject = {
  projectId: "10006",
  projectTypeKey: "software",
};

export type RuleComponent = ReturnType<typeof conditionContainerBlock>;
export function conditionContainerBlock(children: ConditionIfBlock[]) {
  return {
    id: "224960426",
    component: "CONDITION",
    parentId: null,
    conditionParentId: null,
    schemaVersion: 1,
    type: "jira.condition.container.block",
    value: null,
    children,
    conditions: [],
    connectionId: null,
  } as const;
}

export type ConditionIfBlock = ReturnType<typeof conditionIfBlock>;
export function conditionIfBlock(children: Action[], conditions: Condition[]) {
  return {
    id: "224960427",
    component: "CONDITION_BLOCK",
    parentId: "224960426",
    conditionParentId: null,
    schemaVersion: 1,
    type: "jira.condition.if.block",
    value: { conditionMatchType: "ALL" },
    children,
    conditions,
    connectionId: null,
  } as const;
}

export function action(operations: Operation[]) {
  return {
    id: "224960429",
    component: "ACTION",
    parentId: "224960427",
    conditionParentId: null,
    schemaVersion: 10,
    type: "jira.issue.edit",
    value: {
      operations,
      advancedFields: null,
      sendNotifications: false,
    },
    children: [],
    conditions: [],
    connectionId: null,
  } as const;
}

export type Condition = ReturnType<typeof jqlCondition>;
export function jqlCondition(value: string) {
  return {
    id: "224960428",
    component: "CONDITION",
    parentId: null,
    conditionParentId: "224960427",
    schemaVersion: 1,
    type: "jira.jql.condition",
    value,
    children: [],
    conditions: [],
    connectionId: null,
  } as const;
}

export type Operation =
  | ReturnType<typeof addLabel>
  | ReturnType<typeof removeLabel>;

export function addLabel(value: string) {
  return addRemoveLabel(value, "add");
}

export function removeLabel(value: string) {
  return addRemoveLabel(value, "remove");
}
type AddRemove = "add" | "remove";
function addRemoveLabel(value: string, addRemove: AddRemove) {
  const label = { type: "FREE", value }; // todo: check why "FREE"
  return {
    field: { type: "ID", value: "labels" },
    fieldType: "labels",
    type: "ADDREMOVE",
    value: {
      ADD: addRemove === "add" ? [label] : [],
      REMOVE: addRemove === "remove" ? [label] : [],
    },
  } as const;
}
