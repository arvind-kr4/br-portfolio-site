import { profile } from "@/lib/profile";
import { Label } from "@/components/ui/brutal";
import { Reveal } from "@/components/reveal";

export function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-paper text-ink">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-5 py-20 sm:flex-row sm:items-center">
        <Reveal>
          <div className="border-brutal shadow-brutal-lg h-40 w-40 flex-none rounded-2xl bg-pop-red" />
        </Reveal>
        <Reveal delay={0.1} className="flex-1">
          <Label>About</Label>
          <h2 className="font-display mt-3 text-3xl sm:text-4xl">
            {profile.name}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed">{profile.bio}</p>
        </Reveal>
      </div>
    </section>
  );
}
