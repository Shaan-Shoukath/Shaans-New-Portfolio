"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { domainSchema, type DomainFormData } from "@/lib/validators";
import type { Domain } from "@/lib/types";
import { DEFAULT_DOMAIN_TONE, DOMAIN_TONES } from "@/lib/domain-tones";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/GlassCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";

export default function DomainsManager() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toolsInput, setToolsInput] = useState("");
  const [backgroundTone, setBackgroundTone] = useState(DEFAULT_DOMAIN_TONE);
  const supabase = useRef(createClient()).current;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DomainFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(domainSchema) as any,
    defaultValues: {
      tools: [],
      order_index: 0,
      description: "",
      background_tone: DEFAULT_DOMAIN_TONE,
    },
  });

  const fetchDomains = useCallback(async () => {
    const { data } = await supabase
      .from("domains")
      .select("*")
      .order("order_index", { ascending: true });
    if (data) setDomains(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void fetchDomains();
  }, [fetchDomains]);

  function openCreate() {
    setEditingId(null);
    reset({
      title: "",
      icon: "",
      description: "",
      background_tone: DEFAULT_DOMAIN_TONE,
      tools: [],
      order_index: domains.length,
    });
    setToolsInput("");
    setBackgroundTone(DEFAULT_DOMAIN_TONE);
    setDialogOpen(true);
  }

  function openEdit(domain: Domain) {
    setEditingId(domain.id);
    reset({
      title: domain.title,
      icon: domain.icon || "",
      description: domain.description || "",
      background_tone: domain.background_tone || DEFAULT_DOMAIN_TONE,
      tools: domain.tools,
      order_index: domain.order_index,
    });
    setToolsInput(domain.tools.join(", "));
    setBackgroundTone(domain.background_tone || DEFAULT_DOMAIN_TONE);
    setDialogOpen(true);
  }

  const onSubmit = async (formData: DomainFormData) => {
    try {
      const tools = toolsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        description: formData.description || null,
        background_tone: backgroundTone,
        tools,
      };

      if (editingId) {
        const { error } = await supabase
          .from("domains")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Domain updated!");
      } else {
        const { error } = await supabase.from("domains").insert(payload);
        if (error) throw error;
        toast.success("Domain created!");
      }
      setDialogOpen(false);
      void fetchDomains();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to save");
    }
  };

  async function handleDelete(id: string) {
    const { error } = await supabase.from("domains").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Domain deleted");
      void fetchDomains();
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
            Domains
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your skill domains and tools.
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
            Add Domain
          </DialogTrigger>
          <DialogContent className="bg-[#0f1629] border-white/10">
            <DialogHeader>
              <DialogTitle className="font-[family-name:var(--font-heading)]">
                {editingId ? "Edit Domain" : "New Domain"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Web Development"
                  className="bg-white/5 border-white/10"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-xs text-red-400">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (lucide name)</Label>
                <Input
                  id="icon"
                  placeholder="e.g. globe, cpu, smartphone"
                  className="bg-white/5 border-white/10"
                  {...register("icon")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Describe how this domain shows up in the work."
                  className="bg-white/5 border-white/10 resize-none"
                  {...register("description")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="background_tone">Background Tone</Label>
                <Select
                  value={backgroundTone}
                  onValueChange={(value) => {
                    const nextTone = value || DEFAULT_DOMAIN_TONE;
                    setBackgroundTone(nextTone);
                    setValue("background_tone", nextTone, { shouldValidate: true });
                  }}
                >
                  <SelectTrigger
                    id="background_tone"
                    className="w-full bg-white/5 border-white/10"
                  >
                    <SelectValue placeholder="Select a dark tone" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f1629] border-white/10">
                    {DOMAIN_TONES.map((tone) => (
                      <SelectItem key={tone.value} value={tone.value}>
                        {tone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tools">Tools (comma-separated)</Label>
                <Input
                  id="tools"
                  placeholder="React, Node.js, TypeScript"
                  className="bg-white/5 border-white/10"
                  value={toolsInput}
                  onChange={(e) => setToolsInput(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order_index">Order</Label>
                <Input
                  id="order_index"
                  type="number"
                  className="bg-white/5 border-white/10"
                  {...register("order_index", { valueAsNumber: true })}
                />
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
        {domains.length === 0 ? (
          <p className="text-center py-10 text-muted-foreground">
            No domains yet. Create your first one!
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/5">
                <TableHead className="text-muted-foreground">Order</TableHead>
                <TableHead className="text-muted-foreground">Title</TableHead>
                <TableHead className="text-muted-foreground">Icon</TableHead>
                <TableHead className="text-muted-foreground">Tools</TableHead>
                <TableHead className="text-muted-foreground text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domains.map((domain) => (
                <TableRow key={domain.id} className="border-white/5">
                  <TableCell className="text-muted-foreground">
                    {domain.order_index}
                  </TableCell>
                  <TableCell className="font-medium">{domain.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {domain.icon || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {domain.tools.slice(0, 3).map((t) => (
                        <Badge
                          key={t}
                          variant="secondary"
                          className="bg-white/5 text-xs"
                        >
                          {t}
                        </Badge>
                      ))}
                      {domain.tools.length > 3 && (
                        <Badge variant="secondary" className="bg-white/5 text-xs">
                          +{domain.tools.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(domain)}
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
                            <AlertDialogTitle>Delete domain?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete &quot;{domain.title}&quot;.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white/5 border-white/10">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(domain.id)}
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
