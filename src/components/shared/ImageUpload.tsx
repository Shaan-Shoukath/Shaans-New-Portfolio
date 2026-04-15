"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Link, X, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  /** Current image URL value */
  value: string;
  /** Called whenever the URL changes (either typed or uploaded) */
  onChange: (url: string) => void;
  /** Label shown above the field */
  label?: string;
  /** html id for the URL input */
  id?: string;
  /** Supabase Storage bucket name */
  bucket?: string;
  /** Folder path inside the bucket */
  folder?: string;
  /** Extra className for the wrapper */
  className?: string;
  /** Accent colour used for focus rings & upload button e.g. "indigo" | "red" */
  accent?: "indigo" | "red" | "violet";
}

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  id = "image-upload",
  bucket = "portfolio",
  folder = "uploads",
  accent = "indigo",
}: ImageUploadProps) {
  const [tab, setTab] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = useRef(createClient()).current;

  const accentMap = {
    indigo: {
      border: "border-indigo-500/60",
      bg: "bg-indigo-500/10",
      text: "text-indigo-400",
      tab: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      focus: "focus:border-indigo-500/50",
    },
    red: {
      border: "border-red-500/60",
      bg: "bg-red-500/10",
      text: "text-red-400",
      tab: "bg-red-500/20 text-red-300 border-red-500/30",
      focus: "focus:border-red-500/50",
    },
    violet: {
      border: "border-violet-500/60",
      bg: "bg-violet-500/10",
      text: "text-violet-400",
      tab: "bg-violet-500/20 text-violet-300 border-violet-500/30",
      focus: "focus:border-violet-500/50",
    },
  };
  const ac = accentMap[accent];

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10 MB");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filename, file, { upsert: false, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
      onChange(data.publicUrl);
      toast.success("Image uploaded!");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void uploadFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void uploadFile(file);
  }

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 rounded-lg bg-white/5 border border-white/8 w-fit">
        <button
          type="button"
          onClick={() => setTab("url")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
            tab === "url"
              ? `${ac.tab} border`
              : "text-white/40 hover:text-white/60"
          }`}
        >
          <Link className="w-3 h-3" />
          URL
        </button>
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
            tab === "upload"
              ? `${ac.tab} border`
              : "text-white/40 hover:text-white/60"
          }`}
        >
          <Upload className="w-3 h-3" />
          Upload
        </button>
      </div>

      {/* URL input */}
      {tab === "url" && (
        <div className="relative">
          <Input
            id={id}
            placeholder="https://..."
            className={`bg-white/5 border-white/10 pr-8 ${ac.focus}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* File upload dropzone */}
      {tab === "upload" && (
        <div
          onClick={() => !uploading && fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 cursor-pointer transition-all ${
            dragOver
              ? `${ac.border} ${ac.bg}`
              : "border-white/15 hover:border-white/25 hover:bg-white/3"
          } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
          />
          {uploading ? (
            <>
              <Loader2 className={`w-6 h-6 animate-spin ${ac.text}`} />
              <p className="text-xs text-white/50">Uploading…</p>
            </>
          ) : (
            <>
              <Upload className={`w-6 h-6 ${ac.text}`} />
              <p className="text-xs text-white/60 text-center">
                <span className={`font-medium ${ac.text}`}>Click to browse</span> or drag & drop
              </p>
              <p className="text-[10px] text-white/30">PNG, JPG, WebP — max 10 MB</p>
            </>
          )}
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="flex items-center gap-3 p-2 rounded-lg bg-white/3 border border-white/8">
          <div className="w-12 h-10 rounded-md overflow-hidden shrink-0 bg-black/40 border border-white/8">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-white/40 font-mono truncate">{value}</p>
            <p className="text-[10px] text-white/25 mt-0.5 flex items-center gap-1">
              <ImageIcon className="w-2.5 h-2.5" /> Image preview
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="shrink-0 p-1 rounded-md text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
