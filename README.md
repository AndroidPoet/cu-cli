# 🚀 CU-CLI (ClickUp CLI)

[![GitHub License](https://img.shields.io/github/license/AndroidPoet/cu-cli)](https://github.com/AndroidPoet/cu-cli/blob/master/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/AndroidPoet/cu-cli)](https://github.com/AndroidPoet/cu-cli/stargazers)

A powerful, standalone command-line interface for managing **ClickUp** tasks, lists, and workspaces with speed and efficiency. Built for developers who prefer the terminal over the browser.

---

## ✨ Features

- 🔐 **Secure Auth**: Local configuration and environment variable support.
- 📂 **Hierarchy Management**: List Workspaces, Spaces, Folders, and Lists.
- ✅ **Task Operations**: Create, read, update, and delete tasks seamlessly.
- 🔍 **Filtering**: Filter tasks by status, assignee, and more.
- 📦 **JSON Output**: Optional JSON output for all commands, perfect for scripting.
- 🎨 **Beautiful UI**: Styled output with clear status indicators and emojis.

---

## 📥 Installation

### From Source
```bash
git clone https://github.com/AndroidPoet/cu-cli.git
cd cu-cli
npm install
npm run build
npm install -g .
```

---

## 🔑 Authentication

First, get your personal API token from [ClickUp Settings > Apps](https://app.clickup.com/settings/apps).

```bash
# Set your token
cu-cli auth set pk_your_token_here

# Verify connectivity
cu-cli auth status
```

*Or use an environment variable:* `export CLICKUP_API_TOKEN=pk_xxxxxxxxxxxxx`

---

## 🛠 Usage Guide

### 🏢 Workspaces & hierarchy
```bash
# List all workspaces
cu-cli workspaces

# List spaces (uses first workspace by default)
cu-cli spaces --workspace-id <id>

# List folders in a space
cu-cli folders --space-id <id>

# List lists in a folder or space
cu-cli lists --folder-id <id>
cu-cli lists --space-id <id>
```

### 📝 Task Management
| Feature | Command |
| :--- | :--- |
| **List Tasks** | `cu-cli tasks list --list-id <id> --status "In Progress"` |
| **Get Details** | `cu-cli tasks get <task-id>` |
| **Create Task** | `cu-cli tasks create --list-id <id> --name "New Bug Fix"` |
| **Update Task** | `cu-cli tasks update <task-id> --status "Done"` |
| **Delete Task** | `cu-cli tasks delete <task-id> --confirm` |

#### Creating tasks with extra options:
```bash
cu-cli tasks create \
  --list-id 123456 \
  --name "Urgent API Fix" \
  --description "Fix the auth timeout issue" \
  --priority 1 \
  --tags "bug,high-priority"
```

---

## ⚙️ Configuration

Your configuration is stored locally in `~/.cu-cli/config.json`:

```json
{
  "integrations": {
    "clickup": {
      "token": "pk_xxxxxxxxxxxxx"
    }
  }
}
```

---

## 🔴 Priority Cheat Sheet

| Value | Priority | Color |
| :--- | :--- | :--- |
| `1` | Urgent | 🔴 |
| `2` | High | 🟠 |
| `3` | Normal | 🟢 |
| `4` | Low | ⚪ |

---

## 🤝 Contributing

Contributions are welcome! Please check out the [BUILD.md](./BUILD.md) for local development instructions.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the ISC License. See `LICENSE` for more information.

Developed with ❤️ by [AndroidPoet](https://github.com/AndroidPoet)
