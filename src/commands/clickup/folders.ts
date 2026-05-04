import { createClickUpClient } from "../../clickup/client.js";
import { loadConfig } from "../../config/config.js";
import type { Runtime } from "../../runtime.js";
import { theme } from "../../terminal/theme.js";

export interface FoldersOptions {
  spaceId?: string;
  json?: boolean;
}

export async function clickUpFoldersCommand(
  opts: FoldersOptions,
  runtime: Runtime,
): Promise<void> {
  const client = createClickUpClient(runtime);

  let spaceId = opts.spaceId;

  if (!spaceId) {
    const workspaces = await client.getWorkspaces();
    if (workspaces.length === 0) {
      runtime.error("No workspaces found.");
      runtime.exit(1);
      return;
    }
    const spaces = await client.getSpaces(workspaces[0].id);
    if (spaces.length === 0) {
      runtime.error("No spaces found.");
      runtime.exit(1);
      return;
    }
    spaceId = spaces[0].id;
    runtime.log(theme.muted(`Using space: ${spaces[0].name}`));
  }

  try {
    const folders = await client.getFolders(spaceId);

    if (opts.json) {
      runtime.log(JSON.stringify(folders, null, 2));
      return;
    }

    if (folders.length === 0) {
      runtime.log(theme.warn("No folders found in this space."));
      return;
    }

    runtime.log(theme.heading("Folders:"));
    for (const folder of folders) {
      const hidden = folder.hidden ? " [hidden]" : "";
      runtime.log(`  ${theme.bold(folder.name)}${hidden} ${theme.muted(`(${folder.id})`)}`);
    }
  } catch (error) {
    runtime.error(`Failed to fetch folders: ${error}`);
    runtime.exit(1);
  }
}