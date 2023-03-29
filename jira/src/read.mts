import { readFileSync } from "node:fs";
import { EOL } from "node:os";
import type { Component, Team, TeamComponents } from "./types.mjs";

export default function read() {
  const arr = readFileSync("./resource/component_ownership.csv")
    .toString()
    .split(EOL)
    .slice(1)
    .map((row) => row.split(","));

  const teamComponents: TeamComponents = new Map();
  const teams = new Set<Team>();
  arr.forEach((vals) => {
    const [component, team] = vals as [Component, Team];
    teams.add(team);
    if (!teamComponents.has(team)) {
      teamComponents.set(team, new Set());
    }
    teamComponents.get(team)?.add(component);
  });
  return { teamComponents, teams };
}
