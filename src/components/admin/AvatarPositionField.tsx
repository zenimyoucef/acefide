"use client";

import { type DragEvent, type PointerEvent, useEffect, useRef, useState } from "react";
import { CheckCircle2, ImagePlus, Move, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type Point = { x: number; y: number };

const clamp = (value: number) => Math.min(100, Math.max(0, value));
const round = (value: number) => Math.round(value * 10) / 10;

function parsePosition(value?: string | null): Point {
  const match = value?.match(/^(\d{1,3}(?:\.\d+)?)%\s+(\d{1,3}(?:\.\d+)?)%$/);
  if (!match) return { x: 50, y: 50 };
  return { x: clamp(Number(match[1])), y: clamp(Number(match[2])) };
}

type AvatarPositionFieldProps = {
  label: string;
  currentImage?: string | null;
  currentPosition?: string | null;
  initials?: string;
  accent?: string;
  maxMb?: number;
};

/**
 * Circular avatar field for team members: upload/replace a photo and drag it inside the
 * circle to choose the focal point. Emits three form fields:
 *  - imageFile      (the chosen file, if any)
 *  - imageUrl       (hidden, preserves the existing image when no new file is picked)
 *  - imagePosition  (hidden, CSS object-position value such as "50% 30%")
 */
export function AvatarPositionField({
  label,
  currentImage,
  currentPosition,
  initials,
  accent = "from-primary to-turquoise",
  maxMb = 8,
}: AvatarPositionFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const dragOrigin = useRef<{ px: number; py: number } | null>(null);
  const objectUrl = useRef<string | null>(null);

  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState<string>(currentImage || "");
  const [pos, setPos] = useState<Point>(() => parsePosition(currentPosition));
  const [dragging, setDragging] = useState(false);

  useEffect(() => () => { if (objectUrl.current) URL.revokeObjectURL(objectUrl.current); }, []);

  function select(file?: File) {
    if (!file) return;
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    const url = URL.createObjectURL(file);
    objectUrl.current = url;
    setFileName(file.name);
    setPreview(url);
  }

  function onDropFile(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file || !inputRef.current) return;
    const transfer = new DataTransfer();
    transfer.items.add(file);
    inputRef.current.files = transfer.files;
    select(file);
  }

  function startDrag(event: PointerEvent) {
    if (!preview) return;
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    dragOrigin.current = { px: event.clientX, py: event.clientY };
    setDragging(true);
  }

  function onDrag(event: PointerEvent) {
    if (!dragging || !dragOrigin.current || !circleRef.current) return;
    const rect = circleRef.current.getBoundingClientRect();
    const dx = event.clientX - dragOrigin.current.px;
    const dy = event.clientY - dragOrigin.current.py;
    dragOrigin.current = { px: event.clientX, py: event.clientY };
    setPos((prev) => ({
      x: clamp(prev.x - (dx / rect.width) * 100),
      y: clamp(prev.y - (dy / rect.height) * 100),
    }));
  }

  function endDrag(event: PointerEvent) {
    dragOrigin.current = null;
    setDragging(false);
    try { (event.target as HTMLElement).releasePointerCapture(event.pointerId); } catch { /* ignore */ }
  }

  const positionValue = `${round(pos.x)}% ${round(pos.y)}%`;

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        ref={inputRef}
        name="imageFile"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={(e) => select(e.target.files?.[0])}
      />
      {currentImage && <input type="hidden" name="imageUrl" value={currentImage} />}
      <input type="hidden" name="imagePosition" value={positionValue} />

      <div
        ref={circleRef}
        onPointerDown={startDrag}
        onPointerMove={onDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDropFile}
        className={cn(
          "group relative h-44 w-44 shrink-0 touch-none select-none overflow-hidden rounded-full border-4 border-white bg-muted shadow-md ring-1 ring-black/10",
          preview ? (dragging ? "cursor-grabbing" : "cursor-grab") : "cursor-pointer"
        )}
        role="group"
        aria-label={label}
      >
        {preview ? (
          <div
            className="absolute inset-0 h-full w-full bg-no-repeat"
            style={{ backgroundImage: `url("${preview.replace(/"/g, '%22')}")`, backgroundSize: "cover", backgroundPosition: positionValue }}
          />
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn("flex h-full w-full items-center justify-center bg-gradient-to-br text-white", accent)}
          >
            {initials ? <span className="text-3xl font-extrabold">{initials}</span> : <ImagePlus className="h-9 w-9 opacity-90" />}
          </button>
        )}

        {preview && (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-black/45 py-1.5 text-[11px] font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100" aria-hidden>
            <Move className="h-3.5 w-3.5" /> اسحب لضبط الموضع
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-dark"
        >
          <ImagePlus className="h-4 w-4" />
          {preview ? "تغيير الصورة" : label}
        </button>
        {preview && (
          <button
            type="button"
            onClick={() => setPos({ x: 50, y: 50 })}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary hover:text-primary"
          >
            <RotateCcw className="h-4 w-4" />
            توسيط
          </button>
        )}
      </div>

      <p className="max-w-xs text-center text-xs text-slate-500">
        {preview
          ? "اسحب الصورة داخل الدائرة لتحديد الجزء الظاهر منها."
          : `اضغط لاختيار صورة العضو · JPG, PNG, WebP · بحد أقصى ${maxMb} ميغابايت`}
      </p>

      {fileName && (
        <span className="inline-flex max-w-full items-center gap-2 truncate rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span className="truncate">{fileName}</span>
        </span>
      )}
    </div>
  );
}
