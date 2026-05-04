import { createClickUpClient, type UpdateTaskPayload } from "../../../internal/api/client.js";
import type { Runtime } from "../../../internal/cli/runtime.js";
import { theme } from "../../../internal/cli/theme.js";

export interface TaskUpdateOptions {
  taskId: string;
  name?: string;
  description?: string;
  status?: string;
  assignee?: string;
  priority?: string;
  dueDate?: string;
  json?: boolean;
}

export async function clickUpTaskUpdateCommand(
  opts: TaskUpdateOptions,
  runtime: Runtime,
): Promise<void> {
  const client = createClickUpClient(runtime);

  const task: UpdateTaskPayload = {
    name: opts.name,
    description: opts.description,
    status: opts.status,
    assignees: opts.assignee ? [parseInt(opts.assignee)] : undefined,
    priority: opts.priority ? parseInt(opts.priority) : undefined,
    due_date: opts.dueDate ? parseInt(opts.dueDate) : undefined,
  };

  try {
    const updated = await client.updateTask(opts.taskId, task);

    if (opts.json) {
      runtime.log(JSON.stringify(updated, null, 2));
      return;
    }

    runtime.log(theme.success(`Task updated: ${updated.name}`));
    runtime.log(`  ID: ${updated.id}`);
  } catch (error) {
    runtime.error(`Failed to update task: ${error}`);
    runtime.exit(1);
  }
}