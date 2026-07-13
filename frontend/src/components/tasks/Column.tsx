"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import type { Task, TaskStatus } from "@/lib/types";
import TaskCard from "./TaskCard";

const columnConfig: Record<
  TaskStatus,
  { title: string; accent: string; dot: string }
> = {
  todo: {
    title: "To Do",
    accent: "border-slate-500/30",
    dot: "bg-slate-400",
  },
  in_progress: {
    title: "In Progress",
    accent: "border-amber-500/30",
    dot: "bg-amber-400",
  },
  done: {
    title: "Done",
    accent: "border-emerald-500/30",
    dot: "bg-emerald-400",
  },
};

interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onAdd: (status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function Column({
  status,
  tasks,
  onAdd,
  onEdit,
  onDelete,
}: ColumnProps) {
  const config = columnConfig[status];
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      className={`flex min-h-[500px] flex-1 flex-col rounded-2xl border bg-white/5 backdrop-blur-sm ${config.accent} ${
        isOver ? "ring-2 ring-indigo-500/50" : ""
      }`}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${config.dot}`} />
          <h3 className="font-semibold text-white">{config.title}</h3>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-400">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAdd(status)}
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          aria-label={`Add task to ${config.title}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-3 overflow-y-auto p-4"
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">
              Drop tasks here or click + to add
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}
