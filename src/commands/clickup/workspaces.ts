import { createClickUpClient, type Workspace } from "../../clickup/client.js";
import type { Runtime } from "../../runtime.js";
import { theme } from "../../terminal/theme.js";

export interface WorkspacesOptions {
  json?: boolean;
}

export async function clickUpWorkspacesCommand(
  opts: WorkspacesOptions,
  runtime: Runtime,
): Promise<void> {
  const client = createClickUpClient(runtime);

  try {
    const workspaces = await client.getWorkspaces();

    if (opts.json) {
      runtime.log(JSON.stringify(workspaces, null, 2));
      return;
    }

    if (workspaces.length === 0) {
      runtime.log(theme.warn("No workspaces found."));
      return;
    }

    runtime.log(theme.heading("Workspaces:"));
    for (const ws of workspaces) {
      runtime.log(`  ${theme.bold(ws.name)} ${theme.muted(`(${ws.id})`)}`);
    }
  } catch (error) {
    runtime.error(`Failed to fetch workspaces: ${error}`);
    runtime.exit(1);
  }
}