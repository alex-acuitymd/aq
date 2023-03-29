import { teamComponentsLabel } from "./label.mjs";
import type { Component, Team } from "./types.mjs";

// conditions
export const resolved = "statusCategory = Done";
export const bug = "type = Bug";
export const task = "type = Task";
export const createdWithinPastThirtyDays = "created >= -30d";
export const createdWithinPastTwoDays = "created >= -2d";

export const project = "project = APPL";

export const componentEmpty = "component is EMPTY";

export const priorityEmpty = "priority is EMPTY";

export function componentsFilter(components: Set<Component>) {
  return and([
    `component in (${[...components].map((c) => `"${c}"`).join(",")})`,
    project,
  ]);
}

export function teamComponentsLabelFilter(team: Team) {
  return `labels = ${teamComponentsLabel(team)}`;
}

// filter combination
export function or(s: string[]) {
  return perens(s.join(" OR "));
}

export function and(s: string[]) {
  return perens(s.join(" AND "));
}

export function perens(s: string) {
  return `( ${s} )`;
}

export function not(s: string) {
  return `not( ${s} )`;
}
