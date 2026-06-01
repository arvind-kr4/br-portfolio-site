import { profile } from "@/lib/profile";
import { Label } from "@/components/ui/brutal";
import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 border-t-[3px] border-[var(--shadow-color)] bg-ink text-paper">
      <div className="mx-auto grid max-w-5xl gap-10 px-5 py-20 sm:grid-cols-2">
        <Reveal>
          <Label>Let&apos;s work together</Label>
          <h2 className="font-display mt-3 text-4xl leading-tight">
            Looking for a marketer who owns the whole funnel?
          </h2>
          <p className="mt-4 text-paper/70">
            Or email me directly at{" "}
            <a className="font-bold text-pop-yellow underline" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            .
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
