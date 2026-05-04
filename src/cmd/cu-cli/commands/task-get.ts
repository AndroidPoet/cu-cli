import { createClickUpClient } from "../../../internal/api/client.js";
import type { Runtime } from "../../../internal/cli/runtime.js";
import { theme } from "../../../internal/cli/theme.js";

export interface TaskGetOptions {
  taskId: string;
  json?: boolean;
}

export async function clickUpTaskGetCommand(
  opts: TaskGetOptions,
  runtime: Runtime,
): Promise<void> {
  const client = createClickUpClient(runtime);

  try {
    const task = await client.getTask(opts.taskId);

    if (opts.json) {
      runtime.log(JSON.stringify(task, null, 2));
      return;
    }

    runtime.log(theme.heading(task.name));
    runtime.log(`  ID: ${task.id}`);
    runtime.log(`  Status: ${task.status.status} ${theme.muted(`(${task.status.color})`)}`);
    if (task.priority) {
      runtime.log(`  Priority: ${getPriorityLabel(task.priority)}`);
    }
    if (task.due_date) {
      runtime.log(`  Due: ${new Date(task.due_date).toLocaleDateString()}`);
    }
    if (task.assignees.length > 0) {
      runtime.log(`  Assignees: ${task.assignees.map(a => a.username).join(", ")}`);
    }
    if (task.tags.length > 0) {
      runtime.log(`  Tags: ${task.tags.map(t => t.name).join(", ")}`);
    }
    if (task.description) {
      runtime.log(`\n${theme.heading("Description:")}`);
      runtime.log(`  ${task.description}`);
    }
  } catch (error) {
    runtime.error(`Failed to fetch task: ${error}`);
    runtime.exit(1);
  }
}

function getPriorityLabel(priority: number): string {
  switch (priority) {
    case 1: return "Urgent (🔴)";
    case 2: return "High (🟠)";
    case 3: return "Normal (🟢)";
    case 4: return "Low (⚪)";
    default: return "Unknown";
  }
}