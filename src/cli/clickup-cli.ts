import type { Command } from "commander";
import { defaultRuntime } from "../runtime.js";
import { formatDocsLink } from "../terminal/links.js";
import { theme } from "../terminal/theme.js";
import { runCommandWithRuntime } from "./cli-utils.js";
import { formatHelpExamples } from "./help-format.js";
import { applyParentDefaultHelpAction } from "./program/parent-default-help.js";

function runClickUpCommand(action: () => Promise<void>) {
  return runCommandWithRuntime(defaultRuntime, action);
}

export function registerClickUpCli(program: Command) {
  const clickup = program
    .command("clickup")
    .description("Manage ClickUp tasks, lists, and workspaces")
    .addHelpText(
      "after",
      () =>
        `\n${theme.heading("Examples:")}\n${formatHelpExamples([
          ["cu auth", "Configure ClickUp API token"],
          ["cu workspaces", "List workspaces"],
          ["cu lists --space-id <id>", "List lists in a space"],
          ["cu tasks list --list-id <id>", "List tasks in a list"],
          ["cu tasks create --list-id <id> --name \"New Task\"", "Create a task"],
        ])}\n\n${theme.muted("Docs:")} ${formatDocsLink(
          "/cli/clickup",
          "docs.cu.com",
        )}\n`,
    );

  const auth = clickup.command("auth").description("Configure ClickUp API token");

  auth
    .command("set")
    .description("Set ClickUp API token")
    .argument("<token>", "ClickUp API token (starts with pk_)")
    .action(async (token: string) => {
      await runClickUpCommand(async () => {
        const { clickUpAuthSetCommand } = await import("../commands/clickup/auth-set.js");
        await clickUpAuthSetCommand(token, defaultRuntime);
      });
    });

  auth
    .command("status")
    .description("Check API token status")
    .action(async () => {
      await runClickUpCommand(async () => {
        const { clickUpAuthStatusCommand } = await import("../commands/clickup/auth-status.js");
        await clickUpAuthStatusCommand(defaultRuntime);
      });
    });

  clickup
    .command("workspaces")
    .description("List workspaces")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runClickUpCommand(async () => {
        const { clickUpWorkspacesCommand } = await import("../commands/clickup/workspaces.js");
        await clickUpWorkspacesCommand({ json: Boolean(opts.json) }, defaultRuntime);
      });
    });

  clickup
    .command("spaces")
    .description("List spaces in a workspace")
    .option("--workspace-id <id>", "Workspace ID")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runClickUpCommand(async () => {
        const { clickUpSpacesCommand } = await import("../commands/clickup/spaces.js");
        await clickUpSpacesCommand(
          { workspaceId: opts.workspaceId as string | undefined, json: Boolean(opts.json) },
          defaultRuntime,
        );
      });
    });

  clickup
    .command("folders")
    .description("List folders in a space")
    .option("--space-id <id>", "Space ID")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runClickUpCommand(async () => {
        const { clickUpFoldersCommand } = await import("../commands/clickup/folders.js");
        await clickUpFoldersCommand(
          { spaceId: opts.spaceId as string | undefined, json: Boolean(opts.json) },
          defaultRuntime,
        );
      });
    });

  clickup
    .command("lists")
    .description("List lists in a folder or space")
    .option("--folder-id <id>", "Folder ID")
    .option("--space-id <id>", "Space ID (use if not in folder)")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runClickUpCommand(async () => {
        const { clickUpListsCommand } = await import("../commands/clickup/lists.js");
        await clickUpListsCommand(
          {
            folderId: opts.folderId as string | undefined,
            spaceId: opts.spaceId as string | undefined,
            json: Boolean(opts.json),
          },
          defaultRuntime,
        );
      });
    });

  const tasks = clickup.command("tasks").description("Manage tasks");

  tasks
    .command("list")
    .description("List tasks in a list")
    .option("--list-id <id>", "List ID (required)")
    .option("--status <status>", "Filter by status")
    .option("--assignee <id>", "Filter by assignee")
    .option("--limit <n>", "Max tasks to return", "100")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runClickUpCommand(async () => {
        const { clickUpTasksListCommand } = await import("../commands/clickup/tasks-list.js");
        await clickUpTasksListCommand(
          {
            listId: opts.listId as string | undefined,
            status: opts.status as string | undefined,
            assignee: opts.assignee as string | undefined,
            limit: opts.limit as string | undefined,
            json: Boolean(opts.json),
          },
          defaultRuntime,
        );
      });
    });

  tasks
    .command("get")
    .description("Get task details")
    .argument("<task-id>", "Task ID")
    .option("--json", "Output JSON", false)
    .action(async (taskId: string, opts) => {
      await runClickUpCommand(async () => {
        const { clickUpTaskGetCommand } = await import("../commands/clickup/task-get.js");
        await clickUpTaskGetCommand(
          { taskId, json: Boolean(opts.json) },
          defaultRuntime,
        );
      });
    });

  tasks
    .command("create")
    .description("Create a new task")
    .option("--list-id <id>", "List ID (required)")
    .option("--name <name>", "Task name (required)")
    .option("--description <text>", "Task description")
    .option("--assignee <id>", "Assignee user ID")
    .option("--priority <1|2|3|4>", "Priority (1=Urgent, 2=High, 3=Normal, 4=Low)")
    .option("--due-date <timestamp>", "Due date (Unix timestamp)")
    .option("--tags <tags>", "Tags (comma-separated)")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runClickUpCommand(async () => {
        const { clickUpTaskCreateCommand } = await import("../commands/clickup/task-create.js");
        await clickUpTaskCreateCommand(
          {
            listId: opts.listId as string | undefined,
            name: opts.name as string | undefined,
            description: opts.description as string | undefined,
            assignee: opts.assignee as string | undefined,
            priority: opts.priority as string | undefined,
            dueDate: opts.dueDate as string | undefined,
            tags: opts.tags as string | undefined,
            json: Boolean(opts.json),
          },
          defaultRuntime,
        );
      });
    });

  tasks
    .command("update")
    .description("Update a task")
    .argument("<task-id>", "Task ID")
    .option("--name <name>", "Task name")
    .option("--description <text>", "Task description")
    .option("--status <status>", "Status (e.g., 'Open', 'In Progress', 'Done')")
    .option("--assignee <id>", "Assignee user ID")
    .option("--priority <1|2|3|4>", "Priority (1=Urgent, 2=High, 3=Normal, 4=Low)")
    .option("--due-date <timestamp>", "Due date (Unix timestamp)")
    .option("--json", "Output JSON", false)
    .action(async (taskId: string, opts) => {
      await runClickUpCommand(async () => {
        const { clickUpTaskUpdateCommand } = await import("../commands/clickup/task-update.js");
        await clickUpTaskUpdateCommand(
          {
            taskId,
            name: opts.name as string | undefined,
            description: opts.description as string | undefined,
            status: opts.status as string | undefined,
            assignee: opts.assignee as string | undefined,
            priority: opts.priority as string | undefined,
            dueDate: opts.dueDate as string | undefined,
            json: Boolean(opts.json),
          },
          defaultRuntime,
        );
      });
    });

  tasks
    .command("delete")
    .description("Delete a task")
    .argument("<task-id>", "Task ID")
    .option("--confirm", "Skip confirmation", false)
    .action(async (taskId: string, opts) => {
      await runClickUpCommand(async () => {
        const { clickUpTaskDeleteCommand } = await import("../commands/clickup/task-delete.js");
        await clickUpTaskDeleteCommand(
          { taskId, confirm: Boolean(opts.confirm) },
          defaultRuntime,
        );
      });
    });

  applyParentDefaultHelpAction(clickup);
}