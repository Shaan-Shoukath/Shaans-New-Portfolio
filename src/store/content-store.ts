"use client";

import { create } from "zustand";
import type { About, Domain, Project, Blog } from "@/lib/types";

interface ContentState {
  about: About | null;
  domains: Domain[];
  projects: Project[];
  blogs: Blog[];
  loading: boolean;
  setAbout: (about: About | null) => void;
  setDomains: (domains: Domain[]) => void;
  setProjects: (projects: Project[]) => void;
  setBlogs: (blogs: Blog[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useContentStore = create<ContentState>((set) => ({
  about: null,
  domains: [],
  projects: [],
  blogs: [],
  loading: true,
  setAbout: (about) => set({ about }),
  setDomains: (domains) => set({ domains }),
  setProjects: (projects) => set({ projects }),
  setBlogs: (blogs) => set({ blogs }),
  setLoading: (loading) => set({ loading }),
}));
