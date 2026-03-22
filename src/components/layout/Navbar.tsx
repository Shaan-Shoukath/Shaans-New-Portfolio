"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  Home,
  Layers,
  FolderKanban,
  BookOpen,
  FileText,
  Mail,
} from "lucide-react";

const navItems = [
  { label: "Home", href: "#hero", icon: Home },
  { label: "Skills", href: "#domains", icon: Layers },
  { label: "Projects", href: "#projects", icon: FolderKanban },
  { label: "Blog", href: "#blogs", icon: BookOpen },
  { label: "Resume", href: "#resume", icon: FileText },
  { label: "Contact", href: "#contact", icon: Mail },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "glass-strong shadow-lg shadow-black/20"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 md:h-20 items-center justify-between">
            {/* Logo */}
            <a href="#hero" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm group-hover:shadow-lg group-hover:shadow-indigo-500/25 transition-shadow">
                P
              </div>
              <span className="text-lg font-bold font-[family-name:var(--font-heading)] hidden sm:block">
                Portfolio
              </span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </a>
              ))}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-72 glass-strong p-6 pt-20 flex flex-col gap-2"
            >
              {navItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                >
                  <item.icon className="w-5 h-5 text-indigo-400" />
                  <span className="font-medium">{item.label}</span>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
