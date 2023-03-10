import type { Component } from "./types.mjs";

// conditions
export const unresolved = "statusCategory != Done";
export const bug = "type = Bug";
export const task = "type = Task";
export const createdLastThirtyDays = "created >= -30d";

export function componentsFilter(components: Set<Component>) {
  return and([
    or([...components].map((c) => `component = "${c}"`)),
    "project = APPL",
  ]);
}

export function or(s: string[]) {
  return perens(s.join(" OR "));
}

// filter combination
export function and(s: string[]) {
  return perens(s.join(" AND "));
}

export function perens(s: string) {
  return `( ${s} )`;
}
