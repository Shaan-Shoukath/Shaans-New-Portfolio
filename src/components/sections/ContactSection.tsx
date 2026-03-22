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
  Twitter,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@example.com", href: "mailto:hello@example.com" },
  { icon: MapPin, label: "Location", value: "Remote / Worldwide", href: "#" },
  { icon: Github, label: "GitHub", value: "github.com/user", href: "https://github.com" },
  { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/user", href: "https://linkedin.com" },
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
    // Simulate submission (you can wire this to an API or email service)
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
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 p-4 rounded-xl glass hover:bg-white/[0.08] transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 shrink-0 group-hover:border-indigo-500/40 transition-colors">
                <item.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium">{item.value}</p>
              </div>
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
          className="lg:col-span-3"
        >
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
              <p className="text-muted-foreground">
                Thank you for reaching out. I&apos;ll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    className="bg-white/5 border-white/10 focus:border-indigo-500/50"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="bg-white/5 border-white/10 focus:border-indigo-500/50"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400">{errors.email.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell me about your project..."
                  rows={5}
                  className="bg-white/5 border-white/10 focus:border-indigo-500/50 resize-none"
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-xs text-red-400">{errors.message.message}</p>
                )}
              </div>
              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          )}
        </GlassCard>
      </div>
    </SectionWrapper>
  );
}
