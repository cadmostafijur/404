"use client";

import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import AnnotationWorkspace from "@/components/annotate/AnnotationWorkspace";

export default function AnnotatePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <main className="mx-auto max-w-5xl px-6 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">
              A great annotation ahead!
            </h1>
            <p className="mt-1 text-slate-400">
              Upload images and draw polygon annotations
            </p>
          </div>

          <AnnotationWorkspace />
        </main>
      </div>
    </AuthGuard>
  );
}
