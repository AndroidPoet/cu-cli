import { createClickUpClient, type CreateTaskPayload } from "../../../internal/api/client.js";
import type { Runtime } from "../../../internal/cli/runtime.js";
import { theme } from "../../../internal/cli/theme.js";

export interface TaskCreateOptions {
  listId?: string;
  name?: string;
  description?: string;
  assignee?: string;
  priority?: string;
  dueDate?: string;
  tags?: string;
  json?: boolean;
}

export async function clickUpTaskCreateCommand(
  opts: TaskCreateOptions,
  runtime: Runtime,
): Promise<void> {
  if (!opts.listId) {
    runtime.error("--list-id is required");
    runtime.exit(1);
    return;
  }

  if (!opts.name) {
    runtime.error("--name is required");
    runtime.exit(1);
    return;
  }

  const client = createClickUpClient(runtime);

  const task: CreateTaskPayload = {
    name: opts.name,
    description: opts.description,
    assignees: opts.assignee ? [parseInt(opts.assignee)] : undefined,
    priority: opts.priority ? parseInt(opts.priority) : undefined,
    due_date: opts.dueDate ? parseInt(opts.dueDate) : undefined,
    tags: opts.tags ? opts.tags.split(",").map(t => t.trim()) : undefined,
  };

  try {
    const created = await client.createTask(opts.listId, task);

    if (opts.json) {
      runtime.log(JSON.stringify(created, null, 2));
      return;
    }

    runtime.log(theme.success(`Task created: ${created.name}`));
    runtime.log(`  ID: ${created.id}`);
    runtime.log(`  URL: https://app.clickup.com/t/${created.id}`);
  } catch (error) {
    runtime.error(`Failed to create task: ${error}`);
    runtime.exit(1);
  }
}