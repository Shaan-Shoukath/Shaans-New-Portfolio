"use client";

import { Github, Linkedin, Twitter, Mail, Heart, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Mail, href: "mailto:hello@example.com", label: "Email" },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/5">
      {/* Subtle gradient glow at the top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo / Branding */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs animate-gradient-shift">
                S
              </div>
              <span className="text-sm text-muted-foreground">
                Built with{" "}
                <Heart className="w-3 h-3 inline text-red-400 mx-0.5 animate-glow-pulse" />{" "}
                using Next.js & Supabase
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-xl glass-card group"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <link.icon className="w-4 h-4 text-muted-foreground group-hover:text-indigo-400 transition-colors duration-200" />
                </motion.a>
              ))}
            </div>

            {/* Back to top + Copyright */}
            <div className="flex items-center gap-4">
              <button
                onClick={scrollToTop}
                className="p-2 rounded-xl glass hover:bg-white/10 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 group"
                aria-label="Back to top"
              >
                <ArrowUp className="w-4 h-4 text-muted-foreground group-hover:text-indigo-400 group-hover:-translate-y-0.5 transition-all duration-200" />
              </button>
              <p className="text-xs text-muted-foreground/60">
                © {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
