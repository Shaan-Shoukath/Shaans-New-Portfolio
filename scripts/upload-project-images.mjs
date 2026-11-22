#!/usr/bin/env node
/**
 * Upload public/projects/*.webp to Supabase Storage and point each project's
 * image_url at it. Run once (safe to re-run):
 *
 *   SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=... \
 *     node scripts/upload-project-images.mjs
 *
 * Creates a public bucket "portfolio" if missing, uploads to projects/<file>,
 * and sets projects.image_url for the featured projects by title. Work-product
 * images stay in code (they aren't DB rows).
 */
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (service role, never commit it).");
  process.exit(1);
}

const BUCKET = "portfolio";
// file name -> project title in the projects table
const PROJECT_FILES = {
  "spaceworks.webp": "SpaceWorks",
  "makerfaire.webp": "makerfaire.in",
  "lmusic.webp": "LMusic",
  "arkairo.webp": "Arkairo",
};
// Set UPLOAD_ONLY=1 to upload files without touching any table.
const UPLOAD_ONLY = process.env.UPLOAD_ONLY === "1";

const supabase = createClient(url, key, { auth: { persistSession: false } });

const { data: buckets } = await supabase.storage.listBuckets();
if (!buckets?.some((b) => b.name === BUCKET)) {
  const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
  if (error) throw error;
  console.log(`created bucket ${BUCKET}`);
}

const dir = join(process.cwd(), "public/projects");
for (const file of (await readdir(dir)).filter((f) => f.endsWith(".webp"))) {
  const body = await readFile(join(dir, file));
  const path = `projects/${file}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, body, { contentType: "image/webp", upsert: true, cacheControl: "31536000" });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  console.log(`uploaded ${path} -> ${data.publicUrl}`);

  const title = PROJECT_FILES[file];
  if (title && !UPLOAD_ONLY) {
    const { error: e2 } = await supabase.from("projects").update({ image_url: data.publicUrl }).ilike("title", title);
    if (e2) throw e2;
    console.log(`  set image_url on "${title}"`);
  }
}
