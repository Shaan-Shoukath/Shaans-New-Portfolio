"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { aboutSchema, type AboutFormData } from "@/lib/validators";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/GlassCard";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

export default function AboutEditor() {
  const [loading, setLoading] = useState(true);
  const [aboutId, setAboutId] = useState<string | null>(null);
  const [floatingWordsInput, setFloatingWordsInput] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const supabase = useRef(createClient()).current;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AboutFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(aboutSchema) as any,
    defaultValues: {
      hero_floating_words: [],
    },
  });

  useEffect(() => {
    async function fetchAbout() {
      const { data } = await supabase.from("about").select("*").limit(1).single();
      if (data) {
        setAboutId(data.id);
        reset({
          name: data.name,
          tagline: data.tagline || "",
          quote: data.quote || "",
          profile_image_url: data.profile_image_url || "",
          hero_floating_words: data.hero_floating_words || [],
        });
        setFloatingWordsInput((data.hero_floating_words || []).join(", "));
        setProfileImageUrl(data.profile_image_url || "");
      }
      setLoading(false);
    }
    void fetchAbout();
  }, [reset, supabase]);

  const onSubmit = async (formData: AboutFormData) => {
    try {
      const heroFloatingWords = floatingWordsInput
        .split(",")
        .map((word) => word.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        profile_image_url: profileImageUrl || null,
        hero_floating_words: heroFloatingWords,
        updated_at: new Date().toISOString(),
      };

      if (aboutId) {
        const { error } = await supabase
          .from("about")
          .update(payload)
          .eq("id", aboutId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("about")
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        if (data) setAboutId(data.id);
      }

      toast.success("About info saved successfully!");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to save");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-1">
          Edit About
        </h2>
        <p className="text-sm text-muted-foreground">
          Update your personal information displayed on the portfolio.
        </p>
      </div>

      <GlassCard hover={false}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Your name"
              className="bg-white/5 border-white/10 focus:border-indigo-500/50"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              placeholder="A bold one-line statement for the editorial hero"
              className="bg-white/5 border-white/10 focus:border-indigo-500/50"
              {...register("tagline")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero_floating_words">Floating Hero Words</Label>
            <Textarea
              id="hero_floating_words"
              placeholder="Creative Direction, Systems, Motion, Strategy"
              rows={2}
              className="bg-white/5 border-white/10 focus:border-indigo-500/50 resize-none"
              value={floatingWordsInput}
              onChange={(event) => setFloatingWordsInput(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated words that float around the hero name.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quote">Quote</Label>
            <Textarea
              id="quote"
              placeholder="An inspiring quote..."
              rows={3}
              className="bg-white/5 border-white/10 focus:border-indigo-500/50 resize-none"
              {...register("quote")}
            />
          </div>

          <ImageUpload
            id="profile_image_url"
            label="Profile Image"
            value={profileImageUrl}
            onChange={setProfileImageUrl}
            bucket="portfolio"
            folder="profile"
            accent="indigo"
          />
          {errors.profile_image_url && (
            <p className="text-xs text-red-400">
              {errors.profile_image_url.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:shadow-lg hover:shadow-indigo-500/25"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </GlassCard>
    </div>
  );
}
