import type {
  AnnotatedImage,
  AuthResponse,
  Polygon,
  Task,
  TaskFormData,
  User,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      data = null;
    }
    throw new ApiError(
      (data as { detail?: string })?.detail || "Request failed",
      response.status,
      data,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  login: (email: string, password: string) =>
    request<AuthResponse>("/api/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<User>("/api/auth/me/"),

  getTasks: (taskDate: string) =>
    request<Task[]>(`/api/tasks/?task_date=${taskDate}`),

  createTask: (data: TaskFormData) =>
    request<Task>("/api/tasks/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateTask: (id: number, data: Partial<TaskFormData>) =>
    request<Task>(`/api/tasks/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteTask: (id: number) =>
    request<void>(`/api/tasks/${id}/`, { method: "DELETE" }),

  reorderTasks: (
    items: { id: number; status: string; order: number }[],
  ) =>
    request<Task[]>("/api/tasks/reorder/", {
      method: "POST",
      body: JSON.stringify(items),
    }),

  getImages: () => request<AnnotatedImage[]>("/api/annotations/images/"),

  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", file.name);
    return request<AnnotatedImage>("/api/annotations/images/", {
      method: "POST",
      body: formData,
    });
  },

  deleteImage: (id: number) =>
    request<void>(`/api/annotations/images/${id}/`, { method: "DELETE" }),

  createPolygon: (data: {
    image: number;
    points: { x: number; y: number }[];
    label?: string;
    color?: string;
  }) =>
    request<Polygon>("/api/annotations/polygons/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deletePolygon: (id: number) =>
    request<void>(`/api/annotations/polygons/${id}/`, { method: "DELETE" }),
};

export { ApiError };
