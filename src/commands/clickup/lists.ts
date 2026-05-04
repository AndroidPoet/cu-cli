import { createClickUpClient } from "../../clickup/client.js";
import type { Runtime } from "../../runtime.js";
import { theme } from "../../terminal/theme.js";

export interface ListsOptions {
  folderId?: string;
  spaceId?: string;
  json?: boolean;
}

export async function clickUpListsCommand(
  opts: ListsOptions,
  runtime: Runtime,
): Promise<void> {
  const client = createClickUpClient(runtime);

  if (!opts.folderId && !opts.spaceId) {
    runtime.error("Either --folder-id or --space-id is required");
    runtime.exit(1);
    return;
  }

  try {
    const lists = await client.getLists(opts.folderId, opts.spaceId);

    if (opts.json) {
      runtime.log(JSON.stringify(lists, null, 2));
      return;
    }

    if (lists.length === 0) {
      runtime.log(theme.warn("No lists found."));
      return;
    }

    runtime.log(theme.heading("Lists:"));
    for (const list of lists) {
      runtime.log(`  ${theme.bold(list.name)} ${theme.muted(`(${list.id})`)}`);
    }
  } catch (error) {
    runtime.error(`Failed to fetch lists: ${error}`);
    runtime.exit(1);
  }
}