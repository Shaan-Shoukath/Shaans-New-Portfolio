"use client";

import { Github, Linkedin, Twitter, Mail, Heart } from "lucide-react";

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Mail, href: "mailto:hello@example.com", label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo / Branding */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs">
              P
            </div>
            <span className="text-sm text-muted-foreground">
              Built with <Heart className="w-3 h-3 inline text-red-400 mx-1" />{" "}
              using Next.js & Supabase
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="p-2.5 rounded-xl glass hover:bg-white/10 hover:scale-110 transition-all duration-200"
              >
                <link.icon className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
