"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { HeroImage } from "@/lib/types";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Loader2,
  ImageIcon,
  Save,
} from "lucide-react";

export default function HeroImagesAdmin() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New image form state
  const [newUrl, setNewUrl] = useState("");
  const [newAlt, setNewAlt] = useState("");
  const [adding, setAdding] = useState(false);

  const supabase = useRef(createClient()).current;

  const fetchImages = useCallback(async () => {
    const { data, error } = await supabase
      .from("hero_images")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      toast.error("Failed to load hero images");
      return;
    }
    setImages(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void fetchImages();
  }, [fetchImages]);

  const addImage = async () => {
    if (!newUrl.trim()) {
      toast.error("Image URL is required");
      return;
    }

    setAdding(true);
    try {
      const maxOrder = images.reduce(
        (max, img) => Math.max(max, img.order_index),
        -1
      );

      const { error } = await supabase.from("hero_images").insert({
        image_url: newUrl.trim(),
        alt_text: newAlt.trim(),
        order_index: maxOrder + 1,
        active: true,
      });

      if (error) throw error;

      setNewUrl("");
      setNewAlt("");
      toast.success("Image added!");
      await fetchImages();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to add image");
    } finally {
      setAdding(false);
    }
  };

  const toggleActive = async (image: HeroImage) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("hero_images")
        .update({ active: !image.active })
        .eq("id", image.id);

      if (error) throw error;

      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id ? { ...img, active: !img.active } : img
        )
      );
      toast.success(image.active ? "Image hidden" : "Image visible");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const deleteImage = async (id: string) => {
    if (!confirm("Delete this hero image?")) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("hero_images")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setImages((prev) => prev.filter((img) => img.id !== id));
      toast.success("Image deleted");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to delete");
    } finally {
      setSaving(false);
    }
  };

  const moveImage = async (index: number, direction: "up" | "down") => {
    const newImages = [...images];
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= newImages.length) return;

    // Swap order_index values
    const tempOrder = newImages[index].order_index;
    newImages[index].order_index = newImages[swapIndex].order_index;
    newImages[swapIndex].order_index = tempOrder;

    // Swap in array
    [newImages[index], newImages[swapIndex]] = [
      newImages[swapIndex],
      newImages[index],
    ];
    setImages(newImages);

    setSaving(true);
    try {
      await Promise.all([
        supabase
          .from("hero_images")
          .update({ order_index: newImages[index].order_index })
          .eq("id", newImages[index].id),
        supabase
          .from("hero_images")
          .update({ order_index: newImages[swapIndex].order_index })
          .eq("id", newImages[swapIndex].id),
      ]);
    } catch {
      toast.error("Failed to reorder");
      await fetchImages();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold font-heading mb-1 text-white">
          Hero Images
        </h2>
        <p className="text-sm text-white/30">
          Manage the carousel images displayed in the hero section. Active images
          cycle every 5 seconds.
        </p>
      </div>

      {/* Add new image */}
      <GlassCard hover={false}>
        <h3 className="text-sm font-semibold mb-4 text-white/70 uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Image
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hero-image-url">Image URL *</Label>
            <Input
              id="hero-image-url"
              placeholder="https://your-storage.com/hero-image.jpg"
              className="bg-white/5 border-white/10 focus:border-red-500/50"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-image-alt">Alt Text</Label>
            <Input
              id="hero-image-alt"
              placeholder="Description of the image"
              className="bg-white/5 border-white/10 focus:border-red-500/50"
              value={newAlt}
              onChange={(e) => setNewAlt(e.target.value)}
            />
          </div>
          <Button
            onClick={addImage}
            disabled={adding || !newUrl.trim()}
            className="bg-linear-to-r from-red-600 to-red-500 hover:shadow-lg hover:shadow-red-500/25"
          >
            {adding ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {adding ? "Adding..." : "Add Image"}
          </Button>
        </div>
      </GlassCard>

      {/* Image list */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Carousel Images ({images.length})
        </h3>

        {images.length === 0 ? (
          <GlassCard hover={false}>
            <div className="text-center py-8 text-white/30">
              <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No hero images yet.</p>
              <p className="text-xs mt-1 text-white/20">
                Add images above to create a hero carousel.
              </p>
            </div>
          </GlassCard>
        ) : (
          images.map((image, index) => (
            <GlassCard key={image.id} hover={false}>
              <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 border border-white/6 bg-black/40">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || "Hero image"}
                    className="w-full h-full object-cover"
                    style={{
                      filter: image.active
                        ? "none"
                        : "grayscale(1) opacity(0.4)",
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/50 truncate font-mono">
                    {image.image_url}
                  </p>
                  <p className="text-xs text-white/25 mt-0.5">
                    {image.alt_text || "No alt text"} · Order:{" "}
                    {image.order_index}
                  </p>
                  <span
                    className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      image.active
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-white/5 text-white/30 border border-white/10"
                    }`}
                  >
                    {image.active ? "Active" : "Hidden"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => moveImage(index, "up")}
                    disabled={index === 0 || saving}
                    className="p-1.5 rounded-md hover:bg-white/5 disabled:opacity-20 text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveImage(index, "down")}
                    disabled={index === images.length - 1 || saving}
                    className="p-1.5 rounded-md hover:bg-white/5 disabled:opacity-20 text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleActive(image)}
                    disabled={saving}
                    className="p-1.5 rounded-md hover:bg-white/5 text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                    title={image.active ? "Hide" : "Show"}
                  >
                    {image.active ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteImage(image.id)}
                    disabled={saving}
                    className="p-1.5 rounded-md hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
