import { createClickUpClient } from "../../clickup/client.js";
import type { Runtime } from "../../runtime.js";
import { theme } from "../../terminal/theme.js";

export interface TaskDeleteOptions {
  taskId: string;
  confirm?: boolean;
}

export async function clickUpTaskDeleteCommand(
  opts: TaskDeleteOptions,
  runtime: Runtime,
): Promise<void> {
  const client = createClickUpClient(runtime);

  if (!opts.confirm) {
    runtime.log(theme.warn(`Delete task ${opts.taskId}?`));
    runtime.log(theme.muted("Run with --confirm to skip this prompt"));
    runtime.exit(1);
    return;
  }

  try {
    await client.deleteTask(opts.taskId);
    runtime.log(theme.success(`Task ${opts.taskId} deleted`));
  } catch (error) {
    runtime.error(`Failed to delete task: ${error}`);
    runtime.exit(1);
  }
}