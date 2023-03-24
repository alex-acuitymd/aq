import { teamComponentsLabel } from "./label.mjs";
import type { Component, Team } from "./types.mjs";

// conditions
export const unresolved = "statusCategory != Done";
export const bug = "type = Bug";
export const task = "type = Task";
export const createdLastThirtyDays = "created >= -30d";

export function componentsFilter(components: Set<Component>) {
  return and([`component in (${[...components].join(",")})`, "project = APPL"]);
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
