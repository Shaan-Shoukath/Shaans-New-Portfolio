"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { blogSchema, type BlogFormData } from "@/lib/validators";
import type { Blog } from "@/lib/types";
import { PostBody } from "@/components/blog/PostBody";
import { readingMinutes } from "@/lib/blog";
import { refreshSite } from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { GlassCard } from "@/components/shared/GlassCard";
import { ImageUpload, uploadImage } from "@/components/shared/ImageUpload";
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
  Eye,
  EyeOff,
  ExternalLink,
  ImagePlus,
} from "lucide-react";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function BlogsManager() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [published, setPublished] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);
  const [preview, setPreview] = useState(false);
  // The post being edited, so a slug change or first publish can be handled on save.
  const [editing, setEditing] = useState<Blog | null>(null);
  const supabase = useMemo(() => createClient(), []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(blogSchema) as any,
  });

  const titleValue = watch("title");
  const contentValue = watch("content");
  const coverValue = watch("cover_image") ?? "";
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const contentField = register("content");
  const fileRef = useRef<HTMLInputElement>(null);
  const [inserting, setInserting] = useState(false);

  // Uploads images to Storage (blog/ folder) and drops markdown at the cursor.
  async function insertImages(files: File[]) {
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (!images.length) return;
    setInserting(true);
    try {
      const md: string[] = [];
      for (const file of images) {
        const url = await uploadImage(supabase, file, "portfolio", "blog");
        const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
        md.push(`![${alt}](${url})`);
      }
      const el = contentRef.current;
      const text = contentValue ?? "";
      const at = el ? el.selectionStart : text.length;
      const insert = `\n\n${md.join("\n\n")}\n\n`;
      setValue("content", text.slice(0, at) + insert + text.slice(el ? el.selectionEnd : at), { shouldDirty: true });
      toast.success(images.length > 1 ? `${images.length} images added` : "Image added");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Upload failed");
    } finally {
      setInserting(false);
    }
  }

  // Auto-generate slug from title
  useEffect(() => {
    if (autoSlug && titleValue && !editingId) {
      setValue("slug", slugify(titleValue));
    }
  }, [titleValue, autoSlug, editingId, setValue]);

  const fetchBlogs = useCallback(async () => {
    const { data } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setBlogs(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  function openCreate() {
    setEditingId(null);
    setEditing(null);
    setPreview(false);
    setAutoSlug(true);
    reset({
      title: "",
      slug: "",
      content: "",
      cover_image: "",
      published: false,
      tags: [],
    });
    setTagsInput("");
    setPublished(false);
    setDialogOpen(true);
  }

  function openEdit(blog: Blog) {
    setEditingId(blog.id);
    setEditing(blog);
    setPreview(false);
    setAutoSlug(false);
    reset({
      title: blog.title,
      slug: blog.slug,
      content: blog.content || "",
      cover_image: blog.cover_image || "",
      published: blog.published,
      tags: blog.tags,
    });
    setTagsInput(blog.tags.join(", "));
    setPublished(blog.published);
    setDialogOpen(true);
  }

  const onSubmit = async (formData: BlogFormData) => {
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        tags,
        published,
        cover_image: formData.cover_image || null,
        content: formData.content || null,
        // A post's date is when it first goes live, not when the draft was started.
        ...(published && !editing?.published ? { created_at: new Date().toISOString() } : {}),
      };

      if (editingId) {
        const { error } = await supabase
          .from("blogs")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Blog post updated!");
      } else {
        const { error } = await supabase.from("blogs").insert(payload);
        if (error) throw error;
        toast.success("Blog post created!");
      }
      setDialogOpen(false);
      fetchBlogs();
      await refreshSite([formData.slug, editing?.slug ?? ""]).catch(() =>
        toast.error("Saved, but the site will update within the hour")
      );
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to save");
    }
  };

  async function togglePublished(blog: Blog) {
    const { error } = await supabase
      .from("blogs")
      .update({
        published: !blog.published,
        ...(!blog.published ? { created_at: new Date().toISOString() } : {}),
      })
      .eq("id", blog.id);
    if (error) {
      toast.error("Failed to update");
    } else {
      fetchBlogs();
      await refreshSite([blog.slug]).catch(() => toast.error("Saved, but the site will update within the hour"));
    }
  }

  async function handleDelete(blog: Blog) {
    const { error } = await supabase.from("blogs").delete().eq("id", blog.id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Blog post deleted");
      fetchBlogs();
      await refreshSite([blog.slug]).catch(() => toast.error("Deleted, but the site will update within the hour"));
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
            Blog Posts
          </h2>
          <p className="text-sm text-muted-foreground">
            Write and manage your blog posts.
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
            New Post
          </DialogTrigger>
          <DialogContent className="bg-[#0f1629] border-white/10 max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-[family-name:var(--font-heading)]">
                {editingId ? "Edit Post" : "New Post"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Post title"
                    className="bg-white/5 border-white/10"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-400">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    placeholder="post-url-slug"
                    className="bg-white/5 border-white/10"
                    {...register("slug")}
                    onChange={(e) => {
                      setAutoSlug(false);
                      setValue("slug", e.target.value);
                    }}
                  />
                  {errors.slug && (
                    <p className="text-xs text-red-400">
                      {errors.slug.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="content">
                    Content (Markdown) · {readingMinutes(contentValue)} min read
                  </Label>
                  <div className="flex gap-1" role="group" aria-label="Editor mode">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={inserting || preview}
                      onClick={() => fileRef.current?.click()}
                    >
                      {inserting ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <ImagePlus className="w-4 h-4 mr-1" />}
                      Image
                    </Button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={(e) => {
                        void insertImages([...(e.target.files ?? [])]);
                        e.target.value = "";
                      }}
                    />
                    <Button type="button" size="sm" variant={preview ? "ghost" : "secondary"} onClick={() => setPreview(false)}>
                      Write
                    </Button>
                    <Button type="button" size="sm" variant={preview ? "secondary" : "ghost"} onClick={() => setPreview(true)}>
                      Preview
                    </Button>
                  </div>
                </div>
                {/* Hidden, not unmounted, so react-hook-form keeps the value while previewing. */}
                <Textarea
                  id="content"
                  placeholder={"## A heading\n\nWrite in markdown. Fenced code blocks (```ts) get syntax highlighting; tables and links work too."}
                  rows={20}
                  className={`bg-white/5 border-white/10 font-mono text-sm resize-y ${preview ? "hidden" : ""}`}
                  {...contentField}
                  ref={(el) => {
                    contentField.ref(el);
                    contentRef.current = el;
                  }}
                  onPaste={(e) => {
                    const files = [...e.clipboardData.files];
                    if (files.some((f) => f.type.startsWith("image/"))) {
                      e.preventDefault();
                      void insertImages(files);
                    }
                  }}
                  onDrop={(e) => {
                    const files = [...e.dataTransfer.files];
                    if (files.length) {
                      e.preventDefault();
                      void insertImages(files);
                    }
                  }}
                />
                <p className={`text-xs text-muted-foreground ${preview ? "hidden" : ""}`}>
                  Paste or drop images straight into the editor. Add a caption with ![alt](url &quot;Caption&quot;).
                </p>
                {preview && (
                  <div className="post-preview max-h-[60vh] overflow-y-auto">
                    <PostBody content={contentValue ?? ""} />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUpload
                  id="cover_image"
                  label="Cover image (also the share card)"
                  value={coverValue}
                  onChange={(url) => setValue("cover_image", url, { shouldDirty: true })}
                  bucket="portfolio"
                  folder="blog"
                  accent="red"
                />
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="React, Tutorial, Web Dev"
                    className="bg-white/5 border-white/10"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={published} onCheckedChange={setPublished} />
                <Label>{published ? "Live on shaans.works when saved" : "Draft (only visible here)"}</Label>
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
        {blogs.length === 0 ? (
          <p className="text-center py-10 text-muted-foreground">
            No blog posts yet. Write your first one!
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/5">
                <TableHead className="text-muted-foreground">Title</TableHead>
                <TableHead className="text-muted-foreground">Tags</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog.id} className="border-white/5">
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {blog.title}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {blog.tags.slice(0, 2).map((t) => (
                        <Badge
                          key={t}
                          variant="secondary"
                          className="bg-white/5 text-xs"
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(blog.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <button onClick={() => togglePublished(blog)}>
                      {blog.published ? (
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
                      {blog.published && (
                        <Button
                          variant="ghost"
                          size="sm"
                          render={
                            <a
                              href={`/blog/${blog.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          }
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(blog)}
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
                            <AlertDialogTitle>Delete post?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete &quot;{blog.title}&quot;.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white/5 border-white/10">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(blog)}
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
