"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/validators";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimatedHeading } from "@/components/shared/AnimatedHeading";
import { GlassCard } from "@/components/shared/GlassCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Send,
  Mail,
  MapPin,
  Github,
  Linkedin,
  CheckCircle2,
  Loader2,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
    accent: "from-indigo-500 to-cyan-400",
    accentColor: "text-indigo-400",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Remote / Worldwide",
    href: "#",
    accent: "from-emerald-400 to-teal-500",
    accentColor: "text-emerald-400",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/user",
    href: "https://github.com",
    accent: "from-violet-500 to-fuchsia-400",
    accentColor: "text-violet-400",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/user",
    href: "https://linkedin.com",
    accent: "from-sky-400 to-blue-500",
    accentColor: "text-sky-400",
  },
];

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSending(true);
    await new Promise((res) => setTimeout(res, 1500));
    setSending(false);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <SectionWrapper id="contact">
      <AnimatedHeading subtitle="Let's build something amazing together">
        Get In Touch
      </AnimatedHeading>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-4">
          {contactInfo.map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={
                item.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ x: 6 }}
              className="group relative flex items-center gap-4 p-4 rounded-xl glass hover:bg-white/[0.08] transition-all overflow-hidden"
            >
              {/* Left edge accent */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b ${item.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div
                className="p-2.5 rounded-xl border border-white/10 group-hover:border-white/20 shrink-0 transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))`,
                }}
              >
                <item.icon
                  className={`w-5 h-5 ${item.accentColor} transition-transform duration-300 group-hover:scale-110`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium truncate">{item.value}</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.a>
          ))}
        </div>

        {/* Contact Form */}
        <GlassCard
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          hover={false}
          className="lg:col-span-3 relative overflow-hidden"
        >
          {/* Decorative corner glow */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500/10 to-violet-500/10 blur-3xl" />

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="relative">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4" />
                <Sparkles className="w-6 h-6 text-emerald-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
              <p className="text-muted-foreground">
                Thank you for reaching out. I&apos;ll get back to you soon.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm text-white/80">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    className="bg-white/5 border-white/10 focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm text-white/80">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="bg-white/5 border-white/10 focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm text-white/80">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell me about your project..."
                  rows={5}
                  className="bg-white/5 border-white/10 focus:border-indigo-500/50 focus:bg-white/[0.07] resize-none transition-all"
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-xs text-red-400">
                    {errors.message.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={sending}
                className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-500 to-violet-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 group"
              >
                {/* Shine sweep on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                {sending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin relative z-10" />
                ) : (
                  <Send className="w-4 h-4 mr-2 relative z-10" />
                )}
                <span className="relative z-10">
                  {sending ? "Sending..." : "Send Message"}
                </span>
              </Button>
            </form>
          )}
        </GlassCard>
      </div>
    </SectionWrapper>
  );
}
