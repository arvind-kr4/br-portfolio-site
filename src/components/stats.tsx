import { profile } from "@/lib/profile";
import { Card } from "@/components/ui/brutal";
import { Reveal } from "@/components/reveal";

export function Stats() {
  return (
    <section className="border-y-[3px] border-[var(--shadow-color)] bg-pop-purple">
      <div className="mx-auto grid max-w-5xl gap-4 px-5 py-12 sm:grid-cols-3">
        {profile.heroStats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <Card className="px-5 py-6">
              <div className="font-display text-4xl">{s.value}</div>
              <div className="mt-1 text-sm font-semibold">{s.label}</div>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
