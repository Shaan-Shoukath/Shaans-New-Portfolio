"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/validators";
import { Github, Linkedin, Send, CheckCircle2 } from "lucide-react";

function MediumIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
  );
}

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    const subject = encodeURIComponent(`Portfolio Contact from ${data.name}`);
    const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`);
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=shaanshoukath4522@gmail.com&su=${subject}&body=${body}`,
      "_blank",
      "noopener,noreferrer"
    );
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <section id="contact" className="cn-stage">
      {/* Ambient blobs */}
      <div className="cn-blob cn-blob--1" />
      <div className="cn-blob cn-blob--2" />

      <div className="cn-grid">
        {/* ── LEFT: Headline ── */}
        <motion.div
          className="cn-left"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          <span className="cn-eyebrow">Get in touch</span>

          {/* Main headline */}
          <h2 className="cn-title">
            <span className="cn-title__line">LET&apos;S</span>
            <span className="cn-title__line cn-title__line--accent">
              <span className="cn-orb" aria-hidden="true">
                <span className="cn-orb__inner">✦</span>
              </span>
              BUILD
            </span>
            <span className="cn-title__line">TOGETHER</span>
          </h2>

          <p className="cn-sub">
            Open to freelance, collaboration,<br />and full-time roles.
          </p>

          {/* Social links */}
          <div className="cn-socials">
            <a
              href="https://github.com/Shaan-Shoukath"
              target="_blank"
              rel="noopener noreferrer"
              id="social-github"
              className="cn-social"
              aria-label="GitHub"
            >
              <Github size={15} />
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/shaan-shoukath"
              target="_blank"
              rel="noopener noreferrer"
              id="social-linkedin"
              className="cn-social"
              aria-label="LinkedIn"
            >
              <Linkedin size={15} />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://medium.com/@shaanshoukath"
              target="_blank"
              rel="noopener noreferrer"
              id="social-medium"
              className="cn-social"
              aria-label="Medium"
            >
              <MediumIcon size={15} />
              <span>Medium</span>
            </a>
          </div>

          {/* Copyright pinned at bottom of left col */}
          <p className="cn-copy">
            © {new Date().getFullYear()} Shaan Shoukath — Built with precision
          </p>
        </motion.div>

        {/* ── RIGHT: Form ── */}
        <motion.div
          className="cn-right"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              className="cn-success"
            >
              <CheckCircle2 className="cn-success__icon" />
              <p className="cn-success__text">
                Message received.<br />I&apos;ll be in touch.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="cn-form"
              noValidate
            >
              {/* Name */}
              <div className="cn-field">
                <label className="cn-label" htmlFor="cn-name">NAME</label>
                <input
                  id="cn-name"
                  className={`cn-input ${errors.name ? "cn-input--error" : ""}`}
                  placeholder="Your name"
                  autoComplete="name"
                  {...register("name")}
                />
                {errors.name && (
                  <span className="cn-error">{errors.name.message}</span>
                )}
              </div>

              {/* Email */}
              <div className="cn-field">
                <label className="cn-label" htmlFor="cn-email">EMAIL</label>
                <input
                  id="cn-email"
                  type="email"
                  className={`cn-input ${errors.email ? "cn-input--error" : ""}`}
                  placeholder="your@email.com"
                  autoComplete="email"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="cn-error">{errors.email.message}</span>
                )}
              </div>

              {/* Message */}
              <div className="cn-field cn-field--grow">
                <label className="cn-label" htmlFor="cn-message">MESSAGE</label>
                <textarea
                  id="cn-message"
                  className={`cn-input cn-input--textarea ${errors.message ? "cn-input--error" : ""}`}
                  placeholder="Tell me about your project or idea..."
                  {...register("message")}
                />
                {errors.message && (
                  <span className="cn-error">{errors.message.message}</span>
                )}
              </div>

              {/* Submit */}
              <button
                id="contact-submit"
                type="submit"
                className="cn-btn"
              >
                <Send size={14} />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
