import { profile } from "@/lib/profile";
import { Label, BrutalButton } from "@/components/ui/brutal";
import { Reveal } from "@/components/reveal";

export function Hero() {
  return (
    <section className="bg-pop-yellow text-ink">
      <div className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
        <Reveal>
          <Label>{profile.role}</Label>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="font-display mt-4 text-5xl leading-[0.95] tracking-tight sm:text-7xl">
            I help brands turn clicks into{" "}
            <span className="bg-pop-purple px-2 text-paper">customers.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
            {profile.tagline}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-wrap gap-3">
            <BrutalButton href="/#work" accent="teal">See my work →</BrutalButton>
            <BrutalButton href={profile.cvPath} accent="paper">Download CV</BrutalButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
