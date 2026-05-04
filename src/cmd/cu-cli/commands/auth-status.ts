import { getClickUpToken, ClickUpClient } from "../../../internal/api/client.js";
import { loadConfig } from "../../../internal/config/config.js";
import type { Runtime } from "../../../internal/cli/runtime.js";
import { theme } from "../../../internal/cli/theme.js";

export async function clickUpAuthStatusCommand(runtime: Runtime): Promise<void> {
  const config = loadConfig();
  const token = getClickUpToken();

  if (!token) {
    runtime.log(theme.error("ClickUp API token not configured."));
    runtime.log(theme.muted("Run: cu auth set <token>"));
    runtime.log(theme.muted("Or set CLICKUP_API_TOKEN environment variable"));
    runtime.exit(1);
    return;
  }

  try {
    const client = new ClickUpClient(token);
    const workspaces = await client.getWorkspaces();

    if (workspaces.length === 0) {
      runtime.log(theme.warn("No workspaces found for this token."));
    } else {
      runtime.log(theme.success("ClickUp API token is valid!"));
      runtime.log(`\nAccessible workspaces (${workspaces.length}):`);
      for (const ws of workspaces) {
        runtime.log(`  - ${theme.bold(ws.name)} (${ws.id})`);
      }
    }
  } catch (error) {
    runtime.error(`Failed to validate token: ${error}`);
    runtime.exit(1);
  }
}