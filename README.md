# CU-CLI

A standalone CLI for managing ClickUp tasks, lists, and workspaces.

## Installation

```bash
npm install -g cu
```

## Commands

### Authentication

```bash
# Set your ClickUp API token
cu auth set pk_xxxxxxxxxxxxx

# Check if token is valid
cu auth status
```

Get your API token from: https://app.clickup.com/settings/apps

Or set via environment variable:
```bash
export CLICKUP_API_TOKEN=pk_xxxxxxxxxxxxx
```

### Workspaces

```bash
# List all workspaces
cu workspaces

# JSON output
cu workspaces --json
```

### Spaces

```bash
# List spaces in a workspace
cu spaces --workspace-id <id>

# If no workspace specified, uses first available
cu spaces
```

### Folders

```bash
# List folders in a space
cu folders --space-id <id>
```

### Lists

```bash
# List lists in a folder
cu lists --folder-id <id>

# Or list in a space (not in folder)
cu lists --space-id <id>
```

### Tasks

```bash
# List tasks in a list
cu tasks list --list-id <id>

# Filter by status
cu tasks list --list-id <id> --status "Open"

# Filter by assignee
cu tasks list --list-id <id> --assignee <user-id>

# Limit results
cu tasks list --list-id <id> --limit 50
```

```bash
# Get task details
cu tasks get <task-id>
```

```bash
# Create a task
cu tasks create --list-id <id> --name "New Task"
cu tasks create --list-id <id> --name "Task" --description "Details" --priority 2
cu tasks create --list-id <id> --name "Task" --tags "bug,urgent"
```

```bash
# Update a task
cu tasks update <task-id> --name "New Name"
cu tasks update <task-id> --status "In Progress"
cu tasks update <task-id> --priority 1 --due-date 1700000000000
```

```bash
# Delete a task
cu tasks delete <task-id> --confirm
```

## Configuration

Token is stored in `~/.cu/config.json`:

```json
{
  "integrations": {
    "clickup": {
      "token": "pk_xxxxxxxxxxxxx"
    }
  }
}
```

## Priority Values

| Value | Priority |
|-------|----------|
| 1 | Urgent 🔴 |
| 2 | High 🟠 |
| 3 | Normal 🟢 |
| 4 | Low ⚪ |

## Files

- `src/cli/cu.ts` - CLI registration
- `src/clickup/client.ts` - ClickUp API client
- `src/commands/clickup/` - Command implementations
  - `auth-set.ts`
  - `auth-status.ts`
  - `workspaces.ts`
  - `spaces.ts`
  - `folders.ts`
  - `lists.ts`
  - `tasks-list.ts`
  - `task-get.ts`
  - `task-create.ts`
  - `task-update.ts`
  - `task-delete.ts`