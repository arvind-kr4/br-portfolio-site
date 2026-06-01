"use client";

import { useState } from "react";
import type { ContactErrors } from "@/lib/validate-contact";

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrors({});
    setMessage("");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      message: String(form.get("message") ?? ""),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("success");
        return;
      }
      if (res.status === 422 && data.errors) setErrors(data.errors);
      setStatus("error");
      setMessage(data.error ?? "Please fix the highlighted fields.");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  const field =
    "border-brutal w-full rounded-lg bg-paper px-3 py-2.5 text-ink placeholder:text-ink/40 focus:outline-none focus:shadow-brutal";

  if (status === "success") {
    return (
      <div className="border-brutal shadow-brutal rounded-xl bg-pop-teal p-6 text-ink">
        <p className="font-display text-xl">Message sent! 🎉</p>
        <p className="mt-1 text-sm font-semibold">I&apos;ll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <div>
        <input name="name" placeholder="Your name" className={field} />
        {errors.name && <p className="mt-1 text-xs font-bold text-pop-yellow">{errors.name}</p>}
      </div>
      <div>
        <input name="email" type="email" placeholder="you@email.com" className={field} />
        {errors.email && <p className="mt-1 text-xs font-bold text-pop-yellow">{errors.email}</p>}
      </div>
      <div>
        <textarea name="message" rows={4} placeholder="What are you working on?" className={field} />
        {errors.message && <p className="mt-1 text-xs font-bold text-pop-yellow">{errors.message}</p>}
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="border-brutal shadow-brutal rounded-lg bg-pop-yellow px-5 py-3 font-extrabold text-ink transition-transform duration-100 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message →"}
      </button>
      {status === "error" && message && (
        <p className="text-sm font-bold text-pop-yellow">{message}</p>
      )}
    </form>
  );
}
