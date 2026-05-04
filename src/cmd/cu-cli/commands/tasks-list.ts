import { createClickUpClient } from "../../../internal/api/client.js";
import type { Runtime } from "../../../internal/cli/runtime.js";
import { theme } from "../../../internal/cli/theme.js";

export interface TasksListOptions {
  listId?: string;
  status?: string;
  assignee?: string;
  limit?: string;
  json?: boolean;
}

export async function clickUpTasksListCommand(
  opts: TasksListOptions,
  runtime: Runtime,
): Promise<void> {
  if (!opts.listId) {
    runtime.error("--list-id is required");
    runtime.exit(1);
    return;
  }

  const client = createClickUpClient(runtime);

  try {
    const tasks = await client.getTasks(opts.listId, {
      status: opts.status,
      assignee: opts.assignee,
      limit: opts.limit ? parseInt(opts.limit) : 100,
    });

    if (opts.json) {
      runtime.log(JSON.stringify(tasks, null, 2));
      return;
    }

    if (tasks.length === 0) {
      runtime.log(theme.warn("No tasks found."));
      return;
    }

    runtime.log(theme.heading(`Tasks in list ${opts.listId} (${tasks.length}):`));
    for (const task of tasks) {
      const priority = task.priority ? getPriorityLabel(task.priority) : "";
      const assignee = task.assignees.length > 0
        ? ` @${task.assignees[0].username}`
        : "";
      runtime.log(
        `  ${theme.bold(task.name)}${priority}${assignee} ${theme.muted(`[${task.status.status}]`)}`
      );
    }
  } catch (error) {
    runtime.error(`Failed to fetch tasks: ${error}`);
    runtime.exit(1);
  }
}

function getPriorityLabel(priority: number): string {
  switch (priority) {
    case 1: return " 🔴";
    case 2: return " 🟠";
    case 3: return " 🟢";
    case 4: return " ⚪";
    default: return "";
  }
}