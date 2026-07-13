"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare, PenTool, LogOut, Sparkles } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const links = [
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/annotate", label: "Annotate", icon: PenTool },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/tasks" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">
            404<span className="text-indigo-400">Project</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                    : "text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-slate-400 sm:block">
            {user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
