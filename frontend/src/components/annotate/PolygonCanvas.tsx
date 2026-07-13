"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Trash2, Undo2, Save, MousePointer2 } from "lucide-react";
import { api } from "@/lib/api";
import type { AnnotatedImage, Point, Polygon } from "@/lib/types";

const COLORS = [
  "#6366f1",
  "#ec4899",
  "#10b981",
  "#f59e0b",
  "#06b6d4",
  "#8b5cf6",
];

interface PolygonCanvasProps {
  image: AnnotatedImage;
  onPolygonSaved: () => void;
  onPolygonDeleted: () => void;
}

export default function PolygonCanvas({
  image,
  onPolygonSaved,
  onPolygonDeleted,
}: PolygonCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const [selectedPolygon, setSelectedPolygon] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0, naturalW: 0, naturalH: 0 });

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    setImgSize({
      width: rect.width,
      height: rect.height,
      naturalW: img.naturalWidth,
      naturalH: img.naturalHeight,
    });
  };

  const toImageCoords = useCallback(
    (clientX: number, clientY: number): Point | null => {
      const img = containerRef.current?.querySelector("img");
      if (!img) return null;
      const rect = img.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * img.naturalWidth;
      const y = ((clientY - rect.top) / rect.height) * img.naturalHeight;
      return { x: Math.round(x), y: Math.round(y) };
    },
    [],
  );

  const handleClick = (e: React.MouseEvent) => {
    if (!drawing) return;
    const point = toImageCoords(e.clientX, e.clientY);
    if (point) setPoints((prev) => [...prev, point]);
  };

  const handleDoubleClick = async () => {
    if (points.length < 3) return;
    setSaving(true);
    try {
      await api.createPolygon({
        image: image.id,
        points,
        color,
      });
      setPoints([]);
      setDrawing(false);
      onPolygonSaved();
    } catch {
      alert("Failed to save polygon");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePolygon = async (polygonId: number) => {
    try {
      await api.deletePolygon(polygonId);
      setSelectedPolygon(null);
      onPolygonDeleted();
    } catch {
      alert("Failed to delete polygon");
    }
  };

  const scalePoint = (p: Point) => ({
    x: (p.x / imgSize.naturalW) * imgSize.width,
    y: (p.y / imgSize.naturalH) * imgSize.height,
  });

  const renderPolygon = (polygon: Polygon, isSelected: boolean) => {
    if (imgSize.naturalW === 0) return null;
    const scaled = polygon.points.map(scalePoint);
    const pathData =
      scaled.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") +
      " Z";

    return (
      <g key={polygon.id}>
        <path
          d={pathData}
          fill={polygon.color}
          fillOpacity={isSelected ? 0.4 : 0.25}
          stroke={polygon.color}
          strokeWidth={isSelected ? 3 : 2}
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPolygon(polygon.id);
            setDrawing(false);
          }}
        />
        {scaled.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={polygon.color}
            stroke="white"
            strokeWidth={1}
          />
        ))}
      </g>
    );
  };

  useEffect(() => {
    setPoints([]);
    setDrawing(false);
    setSelectedPolygon(null);
  }, [image.id]);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h3 className="truncate font-medium text-white">{image.name}</h3>
        <div className="flex items-center gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`h-6 w-6 rounded-full border-2 transition ${
                color === c ? "border-white scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-white/10 px-4 py-2">
        <button
          onClick={() => {
            setDrawing(!drawing);
            setPoints([]);
            setSelectedPolygon(null);
          }}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            drawing
              ? "bg-indigo-500 text-white"
              : "bg-white/10 text-slate-300 hover:bg-white/20"
          }`}
        >
          <MousePointer2 className="h-3.5 w-3.5" />
          {drawing ? "Drawing..." : "Draw Polygon"}
        </button>
        {points.length > 0 && (
          <button
            onClick={() => setPoints([])}
            className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/20"
          >
            <Undo2 className="h-3.5 w-3.5" />
            Undo Points
          </button>
        )}
        {points.length >= 3 && (
          <button
            onClick={handleDoubleClick}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-500/30"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Saving..." : "Save Polygon"}
          </button>
        )}
        {selectedPolygon && (
          <button
            onClick={() => handleDeletePolygon(selectedPolygon)}
            className="flex items-center gap-1.5 rounded-lg bg-red-500/20 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/30"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Selected
          </button>
        )}
      </div>

      <p className="px-4 py-2 text-xs text-slate-500">
        {drawing
          ? "Click to add points. Double-click or press Save when done (min 3 points)."
          : "Select Draw Polygon to start, or click an existing shape to select it."}
      </p>

      <div
        ref={containerRef}
        className="relative cursor-crosshair"
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.image_url}
          alt={image.name}
          className="w-full object-contain"
          onLoad={handleImageLoad}
          draggable={false}
        />
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ pointerEvents: "none" }}
        >
          <g style={{ pointerEvents: "auto" }}>
            {image.polygons.map((p) =>
              renderPolygon(p, p.id === selectedPolygon),
            )}
            {points.length > 0 && imgSize.naturalW > 0 && (
              <>
                <polyline
                  points={points
                    .map((p) => {
                      const s = scalePoint(p);
                      return `${s.x},${s.y}`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                />
                {points.map((p, i) => {
                  const s = scalePoint(p);
                  return (
                    <circle
                      key={i}
                      cx={s.x}
                      cy={s.y}
                      r={5}
                      fill={color}
                      stroke="white"
                      strokeWidth={2}
                    />
                  );
                })}
              </>
            )}
          </g>
        </svg>
      </div>
    </div>
  );
}
