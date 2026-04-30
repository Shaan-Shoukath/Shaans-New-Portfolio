"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { projectSchema, type ProjectFormData } from "@/lib/validators";
import type { Project } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { GlassCard } from "@/components/shared/GlassCard";
import { ImageUpload } from "@/components/shared/ImageUpload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  Loader2,
  Star,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [techInput, setTechInput] = useState("");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const supabase = useMemo(() => createClient(), []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(projectSchema) as any,
  });

  const fetchProjects = useCallback(async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProjects(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  function openCreate() {
    setEditingId(null);
    reset({
      title: "",
      description: "",
      tech_stack: [],
      github_url: "",
      live_url: "",
      medium_url: "",
      image_url: "",
      featured: false,
      published: true,
      order_index: 0,
    });
    setTechInput("");
    setFeatured(false);
    setPublished(true);
    setImageUrl("");
    setDialogOpen(true);
  }

  function openEdit(project: Project) {
    setEditingId(project.id);
    reset({
      title: project.title,
      description: project.description || "",
      tech_stack: project.tech_stack,
      github_url: project.github_url || "",
      live_url: project.live_url || "",
      medium_url: project.medium_url || "",
      image_url: project.image_url || "",
      featured: project.featured,
      published: project.published,
      order_index: project.order_index ?? 0,
    });
    setTechInput(project.tech_stack.join(", "));
    setFeatured(project.featured);
    setPublished(project.published);
    setImageUrl(project.image_url || "");
    setDialogOpen(true);
  }

  const onSubmit = async (formData: ProjectFormData) => {
    try {
      const techStack = techInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        tech_stack: techStack,
        featured,
        published,
        github_url: formData.github_url || null,
        live_url: formData.live_url || null,
        medium_url: formData.medium_url || null,
        image_url: imageUrl || null,
        order_index: formData.order_index ?? 0,
      };

      if (editingId) {
        const { error } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Project updated!");
      } else {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
        toast.success("Project created!");
      }
      setDialogOpen(false);
      fetchProjects();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to save");
    }
  };

  async function togglePublished(project: Project) {
    const { error } = await supabase
      .from("projects")
      .update({ published: !project.published })
      .eq("id", project.id);
    if (error) {
      toast.error("Failed to update");
    } else {
      fetchProjects();
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Project deleted");
      fetchProjects();
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-1">
            Projects
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your portfolio projects.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button
                onClick={openCreate}
                className="bg-gradient-to-r from-indigo-500 to-violet-500"
              />
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </DialogTrigger>
          <DialogContent className="bg-[#0f1629] border-white/10 max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-[family-name:var(--font-heading)]">
                {editingId ? "Edit Project" : "New Project"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Project title"
                  className="bg-white/5 border-white/10"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-xs text-red-400">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project..."
                  rows={3}
                  className="bg-white/5 border-white/10 resize-none"
                  {...register("description")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tech_stack">Tech Stack (comma-separated)</Label>
                <Input
                  id="tech_stack"
                  placeholder="React, Node.js, PostgreSQL"
                  className="bg-white/5 border-white/10"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="github_url">GitHub URL</Label>
                  <Input
                    id="github_url"
                    placeholder="https://github.com/..."
                    className="bg-white/5 border-white/10"
                    {...register("github_url")}
                  />
                  {errors.github_url && (
                    <p className="text-xs text-red-400">{errors.github_url.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="live_url">Live URL</Label>
                  <Input
                    id="live_url"
                    placeholder="https://..."
                    className="bg-white/5 border-white/10"
                    {...register("live_url")}
                  />
                  {errors.live_url && (
                    <p className="text-xs text-red-400">{errors.live_url.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="medium_url">Medium / Article URL</Label>
                  <Input
                    id="medium_url"
                    placeholder="https://medium.com/..."
                    className="bg-white/5 border-white/10"
                    {...register("medium_url")}
                  />
                  {errors.medium_url && (
                    <p className="text-xs text-red-400">{errors.medium_url.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order_index">Order Index</Label>
                  <Input
                    id="order_index"
                    type="number"
                    placeholder="0"
                    className="bg-white/5 border-white/10"
                    {...register("order_index", { valueAsNumber: true })}
                  />
                </div>
              </div>
              <ImageUpload
                id="image_url"
                label="Project Image"
                value={imageUrl}
                onChange={setImageUrl}
                bucket="portfolio"
                folder="projects"
                accent="indigo"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch checked={featured} onCheckedChange={setFeatured} />
                  <Label>Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={published} onCheckedChange={setPublished} />
                  <Label>Published</Label>
                </div>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-500 to-violet-500"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {editingId ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <GlassCard hover={false}>
        {projects.length === 0 ? (
          <p className="text-center py-10 text-muted-foreground">
            No projects yet. Create your first one!
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/5">
                <TableHead className="text-muted-foreground">Title</TableHead>
                <TableHead className="text-muted-foreground">Tech</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id} className="border-white/5">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{project.title}</span>
                      {project.featured && (
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.tech_stack.slice(0, 2).map((t) => (
                        <Badge
                          key={t}
                          variant="secondary"
                          className="bg-white/5 text-xs"
                        >
                          {t}
                        </Badge>
                      ))}
                      {project.tech_stack.length > 2 && (
                        <Badge variant="secondary" className="bg-white/5 text-xs">
                          +{project.tech_stack.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => togglePublished(project)}
                      className="flex items-center gap-1.5"
                    >
                      {project.published ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
                          <Eye className="w-3 h-3 mr-1" />
                          Live
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-white/5 text-muted-foreground hover:bg-white/10"
                        >
                          <EyeOff className="w-3 h-3 mr-1" />
                          Draft
                        </Badge>
                      )}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(project)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300"
                            />
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#0f1629] border-white/10">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete project?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete &quot;{project.title}&quot;.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white/5 border-white/10">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(project.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </GlassCard>
    </div>
  );
}
