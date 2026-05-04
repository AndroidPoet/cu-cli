# Building and Installing CU-CLI

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

## Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build from Source**
   ```bash
   npm run build
   ```

## Global Installation

To install the `cu-cli` command globally on your system:

```bash
npm install -g .
```

## Running without Installation

You can run the CLI directly using `ts-node` (if you have it installed):

```bash
npx ts-node src/cli/clickup-cli.ts --help
```

## Configuration

Before using the CLI, you need to set your ClickUp API token:

```bash
cu-cli auth set pk_your_token_here
```

Alternatively, set the `CLICKUP_API_TOKEN` environment variable.
