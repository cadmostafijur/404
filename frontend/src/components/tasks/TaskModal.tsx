"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Task, TaskFormData, TaskPriority, TaskStatus } from "@/lib/types";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  initialData?: Task | null;
  defaultStatus?: TaskStatus;
  taskDate: string;
}

const emptyForm = (
  taskDate: string,
  status: TaskStatus = "todo",
): TaskFormData => ({
  title: "",
  priority: "medium",
  due_date: taskDate,
  task_date: taskDate,
  tags: [],
  status,
});

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  defaultStatus = "todo",
  taskDate,
}: TaskModalProps) {
  const [form, setForm] = useState<TaskFormData>(() =>
    initialData
      ? {
          title: initialData.title,
          priority: initialData.priority,
          due_date: initialData.due_date,
          task_date: initialData.task_date,
          tags: initialData.tags,
          status: initialData.status,
        }
      : emptyForm(taskDate, defaultStatus),
  );
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onSubmit({ ...form, title: form.title.trim() });
      onClose();
    } catch {
      setError("Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().replace(/^#/, "");
    if (tag && !form.tags.includes(tag)) {
      setForm({ ...form, tags: [...form.tags, tag] });
    }
    setTagInput("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            {initialData ? "Edit Task" : "New Task"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-slate-400">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-indigo-500"
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm text-slate-400">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority: e.target.value as TaskPriority,
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-slate-400">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as TaskStatus,
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-indigo-500"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-400">
              Due Date
            </label>
            <input
              type="date"
              value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-400">Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="flex-1 rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-indigo-500"
                placeholder="Add tag and press Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="rounded-xl bg-indigo-500/20 px-4 py-2.5 text-sm text-indigo-300 hover:bg-indigo-500/30"
              >
                Add
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-lg bg-indigo-500/15 px-2 py-1 text-xs text-indigo-300"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          tags: form.tags.filter((t) => t !== tag),
                        })
                      }
                      className="hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 py-2.5 text-slate-400 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-2.5 font-medium text-white hover:from-indigo-600 hover:to-violet-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
