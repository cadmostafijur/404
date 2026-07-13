"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import type { Task, TaskFormData, TaskStatus } from "@/lib/types";
import Column from "./Column";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";

const STATUSES: TaskStatus[] = ["todo", "in_progress", "done"];

interface BoardProps {
  taskDate: string;
}

export default function Board({ taskDate }: BoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("todo");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getTasks(taskDate);
      setTasks(data);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [taskDate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const getTasksByStatus = (status: TaskStatus) =>
    tasks
      .filter((t) => t.status === status)
      .sort((a, b) => a.order - b.order);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as number;
    const activeTaskItem = tasks.find((t) => t.id === activeId);
    if (!activeTaskItem) return;

    let overStatus: TaskStatus;
    let overId: number | null = null;

    if (STATUSES.includes(over.id as TaskStatus)) {
      overStatus = over.id as TaskStatus;
    } else {
      const overTask = tasks.find((t) => t.id === over.id);
      if (!overTask) return;
      overStatus = overTask.status;
      overId = overTask.id;
    }

    if (activeTaskItem.status === overStatus && overId === null) return;

    let updatedTasks = [...tasks];

    if (activeTaskItem.status !== overStatus) {
      updatedTasks = updatedTasks.map((t) =>
        t.id === activeId ? { ...t, status: overStatus } : t,
      );
    }

    const sourceList = updatedTasks
      .filter((t) => t.status === overStatus)
      .sort((a, b) => a.order - b.order);

    const oldIndex = sourceList.findIndex((t) => t.id === activeId);
    let newIndex: number;

    if (overId !== null) {
      newIndex = sourceList.findIndex((t) => t.id === overId);
    } else {
      newIndex = sourceList.length - 1;
    }

    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      const reordered = arrayMove(sourceList, oldIndex, newIndex);
      reordered.forEach((t, i) => {
        const idx = updatedTasks.findIndex((ut) => ut.id === t.id);
        if (idx !== -1) updatedTasks[idx] = { ...updatedTasks[idx], order: i };
      });
    } else if (activeTaskItem.status !== overStatus) {
      const targetList = updatedTasks
        .filter((t) => t.status === overStatus)
        .sort((a, b) => a.order - b.order);
      targetList.forEach((t, i) => {
        const idx = updatedTasks.findIndex((ut) => ut.id === t.id);
        if (idx !== -1) updatedTasks[idx] = { ...updatedTasks[idx], order: i };
      });
    }

    setTasks(updatedTasks);

    try {
      const reorderPayload = updatedTasks
        .filter((t) => t.status === overStatus)
        .sort((a, b) => a.order - b.order)
        .map((t, i) => ({ id: t.id, status: t.status, order: i }));

      if (activeTaskItem.status !== overStatus) {
        const oldStatusList = updatedTasks
          .filter((t) => t.status === activeTaskItem.status)
          .sort((a, b) => a.order - b.order)
          .map((t, i) => ({ id: t.id, status: t.status, order: i }));
        await api.reorderTasks([...reorderPayload, ...oldStatusList]);
      } else {
        await api.reorderTasks(reorderPayload);
      }
    } catch {
      fetchTasks();
    }
  };

  const handleCreate = async (data: TaskFormData) => {
    const maxOrder = tasks
      .filter((t) => t.status === data.status)
      .reduce((max, t) => Math.max(max, t.order), -1);
    const created = await api.createTask({
      ...data,
      task_date: taskDate,
    });
    await api.reorderTasks([
      ...tasks
        .filter((t) => t.status === data.status)
        .map((t) => ({ id: t.id, status: t.status, order: t.order })),
      { id: created.id, status: data.status, order: maxOrder + 1 },
    ]);
    await fetchTasks();
  };

  const handleUpdate = async (data: TaskFormData) => {
    if (!editingTask) return;
    await api.updateTask(editingTask.id, data);
    await fetchTasks();
  };

  const handleDelete = async (task: Task) => {
    if (!confirm(`Delete "${task.title}"?`)) return;
    await api.deleteTask(task.id);
    await fetchTasks();
  };

  const openCreateModal = (status: TaskStatus) => {
    setEditingTask(null);
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUSES.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={getTasksByStatus(status)}
              onAdd={openCreateModal}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="rotate-2 opacity-90">
              <TaskCard
                task={activeTask}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {tasks.length === 0 && (
        <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
          <p className="text-slate-400">
            No tasks for this date yet. Click + on any column to get started!
          </p>
        </div>
      )}

      <TaskModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdate : handleCreate}
        initialData={editingTask}
        defaultStatus={defaultStatus}
        taskDate={taskDate}
      />
    </>
  );
}
