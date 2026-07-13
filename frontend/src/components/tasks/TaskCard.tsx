"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import type { Task } from "@/lib/types";
import { format, parseISO } from "date-fns";

const priorityStyles = {
  low: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  medium: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  high: "bg-rose-500/20 text-rose-300 border-rose-500/30",
};

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group rounded-xl border border-white/10 bg-slate-900/80 p-4 shadow-lg transition hover:border-indigo-500/30 hover:shadow-indigo-500/10"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <button
            {...attributes}
            {...listeners}
            className="mt-0.5 cursor-grab text-slate-500 hover:text-slate-300 active:cursor-grabbing"
            aria-label="Drag task"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <h4 className="font-medium text-white">{task.title}</h4>
        </div>
        <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={() => onEdit(task)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-indigo-400"
            aria-label="Edit task"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-red-400"
            aria-label="Delete task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${priorityStyles[task.priority]}`}
        >
          {task.priority}
        </span>
        <span className="text-xs text-slate-500">
          Due {format(parseISO(task.due_date), "MMM d")}
        </span>
      </div>

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-indigo-500/15 px-2 py-0.5 text-xs text-indigo-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
