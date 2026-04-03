export interface Profile {
  id: string;
  email: string;
  role: "admin" | "user";
  created_at: string;
}

export interface About {
  id: string;
  name: string;
  tagline: string | null;
  quote: string | null;
  profile_image_url: string | null;
  hero_floating_words: string[];
  updated_at: string;
}

export interface Domain {
  id: string;
  title: string;
  icon: string | null;
  description: string | null;
  background_tone: string | null;
  tools: string[];
  order_index: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  featured: boolean;
  published: boolean;
  created_at: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  cover_image: string | null;
  published: boolean;
  tags: string[];
  created_at: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  description: string | null;
  image_url: string | null;
  type: "professional" | "social" | "education" | "freelance";
  start_date: string;
  end_date: string | null;
  tags: string[];
  published: boolean;
  order_index: number;
  created_at: string;
}

export interface HeroImage {
  id: string;
  image_url: string;
  alt_text: string;
  order_index: number;
  active: boolean;
  created_at: string;
}
