import { createClickUpClient } from "../../../internal/api/client.js";
import { loadConfig } from "../../../internal/config/config.js";
import type { Runtime } from "../../../internal/cli/runtime.js";
import { theme } from "../../../internal/cli/theme.js";

export interface SpacesOptions {
  workspaceId?: string;
  json?: boolean;
}

export async function clickUpSpacesCommand(
  opts: SpacesOptions,
  runtime: Runtime,
): Promise<void> {
  const client = createClickUpClient(runtime);

  let workspaceId = opts.workspaceId;

  if (!workspaceId) {
    const workspaces = await client.getWorkspaces();
    if (workspaces.length === 0) {
      runtime.error("No workspaces found.");
      runtime.exit(1);
      return;
    }
    workspaceId = workspaces[0].id;
    runtime.log(theme.muted(`Using workspace: ${workspaces[0].name}`));
  }

  try {
    const spaces = await client.getSpaces(workspaceId);

    if (opts.json) {
      runtime.log(JSON.stringify(spaces, null, 2));
      return;
    }

    if (spaces.length === 0) {
      runtime.log(theme.warn("No spaces found in this workspace."));
      return;
    }

    runtime.log(theme.heading("Spaces:"));
    for (const space of spaces) {
      const status = space.status ? ` [${space.status}]` : "";
      runtime.log(`  ${theme.bold(space.name)}${status} ${theme.muted(`(${space.id})`)}`);
    }
  } catch (error) {
    runtime.error(`Failed to fetch spaces: ${error}`);
    runtime.exit(1);
  }
}