import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export interface Config {
  integrations?: {
    clickup?: {
      token?: string;
    };
  };
}

const configDir = path.join(os.homedir(), ".cu-cli");
const configPath = path.join(configDir, "config.json");

export function loadConfig(): Config {
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, "utf-8");
      return JSON.parse(data) as Config;
    }
  } catch (err) {
    // Ignore and return empty config
  }
  return {};
}

export function writeConfigFile(config: Config) {
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
}
