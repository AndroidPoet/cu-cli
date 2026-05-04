import chalk from "chalk";

export const theme = {
  heading: chalk.bold.blue,
  bold: chalk.bold,
  muted: chalk.dim,
  error: chalk.red,
  success: chalk.green,
  warn: chalk.yellow,
};

export function formatDocsLink(path: string, url: string) {
  return chalk.cyan.underline(url);
}

export function formatHelpExamples(examples: [string, string][]) {
  return examples.map(([cmd, desc]) => `  ${chalk.cyan(cmd).padEnd(40)} ${chalk.dim(desc)}`).join("\n");
}
