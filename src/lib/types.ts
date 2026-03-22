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
  updated_at: string;
}

export interface Domain {
  id: string;
  title: string;
  icon: string | null;
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
