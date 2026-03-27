"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/validators";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

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
    <section id="contact" className="relative min-h-screen flex items-center justify-center py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-[#050505]" />
      <div className="absolute inset-0 bg-gradient-to-t from-red-950/[0.03] to-transparent" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] tracking-[0.4em] text-red-600/60 uppercase font-mono block mb-4">
            [CONTACT]
          </span>
          <h2 className="text-5xl md:text-7xl font-bold font-[family-name:var(--font-heading)] tracking-tight mb-4">
            <span className="text-white">Let&apos;s Talk</span>
          </h2>
          <div className="w-12 h-[1px] bg-red-600/40 mx-auto mb-6" />
          <p className="text-sm text-white/25 max-w-md mx-auto">
            Have a project in mind? Let&apos;s build something remarkable together.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-lg p-8 relative overflow-hidden"
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-red-600/20" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-red-600/20" />

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <CheckCircle2 className="w-12 h-12 text-red-500/70 mb-4" />
              <h3 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-white mb-2">
                Message Sent
              </h3>
              <p className="text-sm text-white/30">
                Thank you. I&apos;ll respond soon.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name" className="text-[11px] tracking-[0.2em] text-white/40 uppercase">
                    Name
                  </Label>
                  <Input
                    id="contact-name"
                    placeholder="Your name"
                    className="bg-white/[0.03] border-white/[0.06] focus:border-red-600/30 text-white placeholder:text-white/15 rounded transition-all"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500/70">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email" className="text-[11px] tracking-[0.2em] text-white/40 uppercase">
                    Email
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="your@email.com"
                    className="bg-white/[0.03] border-white/[0.06] focus:border-red-600/30 text-white placeholder:text-white/15 rounded transition-all"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500/70">{errors.email.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-message" className="text-[11px] tracking-[0.2em] text-white/40 uppercase">
                  Message
                </Label>
                <Textarea
                  id="contact-message"
                  placeholder="Tell me about your project..."
                  rows={5}
                  className="bg-white/[0.03] border-white/[0.06] focus:border-red-600/30 text-white placeholder:text-white/15 resize-none rounded transition-all"
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-xs text-red-500/70">{errors.message.message}</p>
                )}
              </div>
              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-white/[0.06] hover:bg-red-600/20 border border-white/[0.08] hover:border-red-600/30 text-white transition-all duration-300 rounded cursor-pointer"
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
        </motion.div>

        {/* Footer line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="w-16 h-[1px] bg-white/[0.06] mx-auto mb-4" />
          <p className="text-[9px] tracking-[0.3em] text-white/15 uppercase font-mono">
            © {new Date().getFullYear()} — Built with precision
          </p>
        </motion.div>
      </div>
    </section>
  );
}
