"use client";

import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import DateSelector from "@/components/DateSelector";
import Board from "@/components/tasks/Board";
import { useDateStore } from "@/lib/store";

export default function TasksPage() {
  const { selectedDate, setSelectedDate } = useDateStore();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <main className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">
              Nobody does the task
            </h1>
            <p className="mt-1 text-slate-400">
              Manage your daily tasks on a beautiful Kanban board
            </p>
          </div>

          <div className="mb-8">
            <DateSelector
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>

          <Board taskDate={selectedDate} />
        </main>
      </div>
    </AuthGuard>
  );
}
