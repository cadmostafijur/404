"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import type { AnnotatedImage } from "@/lib/types";
import ImageUploader from "./ImageUploader";
import PolygonCanvas from "./PolygonCanvas";

export default function AnnotationWorkspace() {
  const [images, setImages] = useState<AnnotatedImage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getImages();
      setImages(data);
    } catch {
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleDeleteImage = async (id: number) => {
    if (!confirm("Delete this image and all its annotations?")) return;
    await api.deleteImage(id);
    await fetchImages();
  };

  return (
    <div className="space-y-6">
      <ImageUploader onUploaded={fetchImages} />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
        </div>
      ) : images.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-12 text-center">
          <p className="text-slate-400">
            No images yet. Upload some images above to start annotating!
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          <p className="text-sm text-slate-400">
            Scroll through {images.length} image{images.length !== 1 ? "s" : ""}{" "}
            below. Draw polygons on each one independently.
          </p>
          {images.map((image) => (
            <div key={image.id} className="relative">
              <button
                onClick={() => handleDeleteImage(image.id)}
                className="absolute right-4 top-16 z-10 flex items-center gap-1.5 rounded-lg bg-red-500/20 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/30"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Image
              </button>
              <PolygonCanvas
                image={image}
                onPolygonSaved={fetchImages}
                onPolygonDeleted={fetchImages}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
