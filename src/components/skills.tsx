import { profile } from "@/lib/profile";
import { Label } from "@/components/ui/brutal";
import { Reveal } from "@/components/reveal";

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-20 border-t-[3px] border-[var(--shadow-color)] bg-pop-red text-paper">
      <div className="mx-auto max-w-5xl px-5 py-20">
        <Reveal>
          <Label>Toolkit</Label>
          <h2 className="font-display mt-3 text-3xl sm:text-4xl">
            The full-funnel stack.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap gap-3">
            {profile.skills.map((s) => (
              <span
                key={s}
                className="border-brutal shadow-brutal rounded-lg bg-paper px-3 py-2 text-sm font-extrabold text-ink"
              >
                {s}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
