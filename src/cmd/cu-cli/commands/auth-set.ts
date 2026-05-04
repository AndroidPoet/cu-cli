import { loadConfig, writeConfigFile } from "../../../internal/config/config.js";
import type { Runtime } from "../../../internal/cli/runtime.js";
import { theme } from "../../../internal/cli/theme.js";

export async function clickUpAuthSetCommand(token: string, runtime: Runtime): Promise<void> {
  if (!token.startsWith("pk_")) {
    runtime.error("Invalid token format. ClickUp tokens start with 'pk_'");
    runtime.exit(1);
    return;
  }

  const config = loadConfig();

  if (!config.integrations) {
    config.integrations = {};
  }

  if (!config.integrations.clickup) {
    config.integrations.clickup = {};
  }

  config.integrations.clickup.token = token;

  writeConfigFile(config);

  runtime.log(theme.success("ClickUp API token configured successfully!"));
  runtime.log(theme.muted("You can now use: cu workspaces"));
}