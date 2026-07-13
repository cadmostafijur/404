export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
}

export interface Task {
  id: number;
  title: string;
  priority: TaskPriority;
  due_date: string;
  task_date: string;
  tags: string[];
  status: TaskStatus;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface Polygon {
  id: number;
  image: number;
  points: Point[];
  label: string;
  color: string;
  created_at: string;
}

export interface AnnotatedImage {
  id: number;
  name: string;
  image: string;
  image_url: string;
  uploaded_at: string;
  polygons: Polygon[];
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface TaskFormData {
  title: string;
  priority: TaskPriority;
  due_date: string;
  task_date: string;
  tags: string[];
  status: TaskStatus;
}
