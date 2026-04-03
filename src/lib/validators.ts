import { z } from "zod";
import { DOMAIN_TONES, DEFAULT_DOMAIN_TONE } from "@/lib/domain-tones";

export const aboutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  tagline: z.string().optional(),
  quote: z.string().optional(),
  profile_image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  hero_floating_words: z.array(z.string()).default([]),
});

export const domainSchema = z.object({
  title: z.string().min(1, "Title is required"),
  icon: z.string().optional(),
  description: z.string().optional(),
  background_tone: z
    .enum(DOMAIN_TONES.map((tone) => tone.value) as [string, ...string[]])
    .default(DEFAULT_DOMAIN_TONE),
  tools: z.array(z.string()).default([]),
  order_index: z.number().int().default(0),
});

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  tech_stack: z.array(z.string()).default([]),
  github_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  live_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  image_url: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  content: z.string().optional(),
  cover_image: z.string().optional(),
  published: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});


export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const heroImageSchema = z.object({
  image_url: z.string().url("Must be a valid URL").min(1, "Image URL is required"),
  alt_text: z.string().default(""),
  order_index: z.number().int().default(0),
  active: z.boolean().default(true),
});

export type AboutFormData = z.infer<typeof aboutSchema>;
export type DomainFormData = z.infer<typeof domainSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type BlogFormData = z.infer<typeof blogSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type HeroImageFormData = z.infer<typeof heroImageSchema>;
