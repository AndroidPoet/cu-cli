import type { Runtime } from "../runtime.js";

export function getClickUpToken(): string | undefined {
  return (
    process.env.CLICKUP_API_TOKEN ||
    process.env.CLICKUP_TOKEN
  );
}

export class ClickUpClient {
  private baseUrl = "https://api.clickup.com/api/v2";
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Authorization": this.token,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ClickUp API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async getWorkspaces(): Promise<Workspace[]> {
    const data = await this.request<{ teams: Workspace[] }>("/team");
    return data.teams;
  }

  async getSpaces(workspaceId: string): Promise<Space[]> {
    const data = await this.request<{ spaces: Space[] }>(`/team/${workspaceId}/space`);
    return data.spaces;
  }

  async getFolders(spaceId: string): Promise<Folder[]> {
    const data = await this.request<{ folders: Folder[] }>(`/space/${spaceId}/folder`);
    return data.folders;
  }

  async getLists(folderId?: string, spaceId?: string): Promise<List[]> {
    let endpoint: string;
    if (folderId) {
      endpoint = `/folder/${folderId}/list`;
    } else if (spaceId) {
      endpoint = `/space/${spaceId}/list`;
    } else {
      throw new Error("Either folder-id or space-id is required");
    }
    const data = await this.request<{ lists: List[] }>(endpoint);
    return data.lists;
  }

  async getTasks(listId: string, options?: {
    status?: string;
    assignee?: string;
    limit?: number;
  }): Promise<Task[]> {
    const params = new URLSearchParams();
    if (options?.status) params.append("status", options.status);
    if (options?.assignee) params.append("assignee", options.assignee);
    if (options?.limit) params.append("limit", String(options.limit));

    const query = params.toString() ? `?${params.toString()}` : "";
    const data = await this.request<{ tasks: Task[] }>(`/list/${listId}/task${query}`);
    return data.tasks;
  }

  async getTask(taskId: string): Promise<Task> {
    return this.request<Task>(`/task/${taskId}`);
  }

  async createTask(listId: string, task: CreateTaskPayload): Promise<Task> {
    return this.request<Task>(`/list/${listId}/task`, {
      method: "POST",
      body: JSON.stringify(task),
    });
  }

  async updateTask(taskId: string, task: UpdateTaskPayload): Promise<Task> {
    return this.request<Task>(`/task/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(task),
    });
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.request(`/task/${taskId}`, { method: "DELETE" });
  }
}

export interface Workspace {
  id: string;
  name: string;
  color: string;
  avatar?: string;
}

export interface Space {
  id: string;
  name: string;
  private: boolean;
  status: string | null;
}

export interface Folder {
  id: string;
  name: string;
  hidden: boolean;
  private: boolean;
}

export interface List {
  id: string;
  name: string;
  type: number;
  status?: string;
}

export interface Task {
  id: string;
  name: string;
  description: string | null;
  status: { status: string; color: string };
  priority: number | null;
  due_date: number | null;
  assignees: Array<{ id: string; username: string; email: string }>;
  tags: Array<{ name: string; color: string }>;
  created: string;
  updated: string;
}

export interface CreateTaskPayload {
  name: string;
  description?: string;
  assignees?: number[];
  priority?: number;
  due_date?: number;
  tags?: string[];
}

export interface UpdateTaskPayload {
  name?: string;
  description?: string;
  status?: string;
  assignees?: number[];
  priority?: number;
  due_date?: number;
}

export function createClickUpClient(_runtime: Runtime): ClickUpClient {
  const token = getClickUpToken();

  if (!token) {
    throw new Error(
      "ClickUp API token not set.\n" +
      "Set CLICKUP_API_TOKEN environment variable or run:\n" +
      "  cu auth set <token>\n" +
      "Get token from: https://app.clickup.com/settings/apps"
    );
  }

  return new ClickUpClient(token);
}