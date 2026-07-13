"use client";

import { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface ImageUploaderProps {
  onUploaded: () => void;
}

export default function ImageUploader({ onUploaded }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        await api.uploadImage(file);
      }
      onUploaded();
    } catch {
      setError("Failed to upload image(s)");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
      }}
      className="cursor-pointer rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-8 text-center transition hover:border-indigo-500/50 hover:bg-indigo-500/5"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {uploading ? (
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-indigo-400" />
      ) : (
        <Upload className="mx-auto h-10 w-10 text-indigo-400" />
      )}
      <p className="mt-3 font-medium text-white">
        Drop images here or click to upload
      </p>
      <p className="mt-1 text-sm text-slate-400">PNG, JPG, GIF up to 10MB</p>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
