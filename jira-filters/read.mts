import { readFileSync } from "node:fs";
import { EOL } from "node:os";
import type { Brand } from "utility-types";

export default function read() {
  const arr = readFileSync("./component_ownership.csv")
    .toString()
    .split(EOL)
    .map((row) => row.split(","));
  type Team = Brand<string, "team">;
  type Component = Brand<string, "component">;
  const teamComponents = new Map<Team, Set<Component>>();
  const componentTeam = new Map<Component, Team>();
  arr.forEach((vals) => {
    const [component, team] = vals as [Component, Team];
    if (!teamComponents.has(team)) {
      teamComponents.set(team, new Set());
    }
    teamComponents.get(team)?.add(component);
    componentTeam.set(component, team);
  });
  //   console.log(JSON.stringify(componentTeam));
}
