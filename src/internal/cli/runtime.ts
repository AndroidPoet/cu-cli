export interface Runtime {
  log(message: string): void;
  error(message: string): void;
  exit(code: number): void;
}

export const defaultRuntime: Runtime = {
  log(message: string) {
    console.log(message);
  },
  error(message: string) {
    console.error(message);
  },
  exit(code: number) {
    process.exit(code);
  }
};

export async function runCommandWithRuntime(runtime: Runtime, action: () => Promise<void>) {
  try {
    await action();
  } catch (err: any) {
    runtime.error(err.message || String(err));
    runtime.exit(1);
  }
}
