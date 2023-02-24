import type { Brand } from "utility-types";

export type Team = Brand<string, "team">;
export type Component = Brand<string, "component">;

export type TeamComponents = Map<Team, Set<Component>>;
export type ComponentTeam = Map<Component, Team>;
