"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Experience } from "@/lib/types";
import { GlassCard } from "@/components/shared/GlassCard";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Briefcase,
  GraduationCap,
  Users,
  Code2,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

const typeIcons: Record<string, React.ElementType> = {
  professional: Briefcase,
  social: Users,
  education: GraduationCap,
  freelance: Code2,
};

const typeColors: Record<string, string> = {
  professional: "text-red-400 bg-red-500/10 border-red-500/20",
  social: "text-white/60 bg-white/5 border-white/10",
  education: "text-white/60 bg-white/5 border-white/10",
  freelance: "text-red-400 bg-red-500/10 border-red-500/20",
};

type FormData = {
  title: string;
  company: string;
  description: string;
  image_url: string;
  type: "professional" | "social" | "education" | "freelance";
  start_date: string;
  end_date: string;
  tags: string;
  published: boolean;
  order_index: number;
};

const emptyForm: FormData = {
  title: "",
  company: "",
  description: "",
  image_url: "",
  type: "professional",
  start_date: "",
  end_date: "",
  tags: "",
  published: true,
  order_index: 0,
};

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  async function fetchExperiences() {
    const { data } = await supabase
      .from("experiences")
      .select("*")
      .order("order_index", { ascending: true });
    if (data) setExperiences(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchExperiences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(exp: Experience) {
    setForm({
      title: exp.title,
      company: exp.company,
      description: exp.description || "",
      image_url: exp.image_url || "",
      type: exp.type,
      start_date: exp.start_date,
      end_date: exp.end_date || "",
      tags: exp.tags?.join(", ") || "",
      published: exp.published,
      order_index: exp.order_index,
    });
    setEditingId(exp.id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.title || !form.company || !form.start_date) {
      toast.error("Title, company, and start date are required");
      return;
    }

    setSaving(true);
    const payload = {
      title: form.title,
      company: form.company,
      description: form.description || null,
      image_url: form.image_url || null,
      type: form.type,
      start_date: form.start_date,
      end_date: form.end_date || null,
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      published: form.published,
      order_index: form.order_index,
    };

    if (editingId) {
      const { error } = await supabase
        .from("experiences")
        .update(payload)
        .eq("id", editingId);
      if (error) {
        toast.error("Failed to update");
      } else {
        toast.success("Experience updated");
      }
    } else {
      const { error } = await supabase.from("experiences").insert(payload);
      if (error) {
        toast.error("Failed to create: " + error.message);
      } else {
        toast.success("Experience created");
      }
    }

    setSaving(false);
    resetForm();
    fetchExperiences();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this experience?")) return;
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Experience deleted");
      fetchExperiences();
    }
  }

  async function togglePublish(exp: Experience) {
    await supabase
      .from("experiences")
      .update({ published: !exp.published })
      .eq("id", exp.id);
    fetchExperiences();
    toast.success(exp.published ? "Unpublished" : "Published");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-heading">
            Experiences
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your professional and social experience timeline
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <GlassCard hover={false} className="relative">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold font-heading">
              {editingId ? "Edit Experience" : "New Experience"}
            </h3>
            <button onClick={resetForm} className="p-1 hover:bg-white/5 rounded cursor-pointer">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-white/50 uppercase tracking-wider">Title / Role</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Senior Developer"
                className="bg-white/3 border-white/6"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-white/50 uppercase tracking-wider">Company / Org</Label>
              <Input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="e.g. TechCorp"
                className="bg-white/3 border-white/6"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-white/50 uppercase tracking-wider">Type</Label>
              <Select
                value={form.type}
                onValueChange={(value) =>
                  setForm({ ...form, type: value as FormData["type"] })
                }
              >
                <SelectTrigger className="w-full bg-white/3 border-white/6">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10">
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-white/50 uppercase tracking-wider">Order Index</Label>
              <Input
                type="number"
                value={form.order_index}
                onChange={(e) =>
                  setForm({ ...form, order_index: parseInt(e.target.value) || 0 })
                }
                className="bg-white/3 border-white/6"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-white/50 uppercase tracking-wider">Start Date</Label>
              <Input
                value={form.start_date}
                onChange={(e) =>
                  setForm({ ...form, start_date: e.target.value })
                }
                placeholder="e.g. Jan 2023"
                className="bg-white/3 border-white/6"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-white/50 uppercase tracking-wider">End Date</Label>
              <Input
                value={form.end_date}
                onChange={(e) =>
                  setForm({ ...form, end_date: e.target.value })
                }
                placeholder="Leave empty for 'Present'"
                className="bg-white/3 border-white/6"
              />
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label className="text-xs text-white/50 uppercase tracking-wider">Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Brief description of role and impact..."
              rows={3}
              className="bg-white/3 border-white/6 resize-none"
            />
          </div>

          <div className="mt-4">
            <ImageUpload
              id="exp-image-url"
              label="IMAGE"
              value={form.image_url}
              onChange={(url) => setForm({ ...form, image_url: url })}
              bucket="portfolio"
              folder="experiences"
              accent="red"
            />
          </div>

          <div className="space-y-2 mt-4">
            <Label className="text-xs text-white/50 uppercase tracking-wider">Tags (comma-separated)</Label>
            <Input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="e.g. React, Node.js, Leadership"
              className="bg-white/3 border-white/6"
            />
          </div>

          <div className="flex items-center gap-4 mt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm({ ...form, published: e.target.checked })
                }
                className="rounded border-white/20 bg-white/5 accent-red-600"
              />
              <span className="text-sm text-white/50">Published</span>
            </label>
            <div className="flex-1" />
            <Button
              variant="ghost"
              onClick={resetForm}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </GlassCard>
      )}

      {/* List */}
      <div className="space-y-3">
        {experiences.map((exp) => {
          const TypeIcon = typeIcons[exp.type] || Briefcase;
          const colorClass = typeColors[exp.type] || typeColors.professional;

          return (
            <GlassCard key={exp.id} hover={false} className="flex items-start gap-4">
              {/* Image thumbnail or type icon */}
              {exp.image_url ? (
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0">
                  <Image
                    src={exp.image_url}
                    alt={exp.title}
                    width={48}
                    height={48}
                    sizes="48px"
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className={`p-2 rounded-lg border ${colorClass} shrink-0`}>
                  <TypeIcon className="w-4 h-4" />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold font-heading text-sm truncate">
                    {exp.title}
                  </h4>
                  {!exp.published && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-white/30 uppercase tracking-wider">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {exp.company} · {exp.start_date}
                  {exp.end_date ? ` — ${exp.end_date}` : " — Present"}
                </p>
                <p className="text-xs text-white/20 mt-1 capitalize">{exp.type}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => togglePublish(exp)}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  title={exp.published ? "Unpublish" : "Publish"}
                >
                  {exp.published ? (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={() => startEdit(exp)}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Pencil className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-red-500/50 hover:text-red-400" />
                </button>
              </div>
            </GlassCard>
          );
        })}

        {experiences.length === 0 && !showForm && (
          <div className="text-center py-16">
            <Briefcase className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No experiences yet. Click &quot;Add Experience&quot; to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
