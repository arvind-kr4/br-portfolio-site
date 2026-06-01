import { projects } from "@/lib/projects";
import { Label } from "@/components/ui/brutal";
import { Reveal } from "@/components/reveal";
import { ProjectCard } from "@/components/project-card";

export function WorkGrid() {
  return (
    <section id="work" className="scroll-mt-20 border-t-[3px] border-[var(--shadow-color)] bg-pop-teal">
      <div className="mx-auto max-w-5xl px-5 py-20">
        <Reveal>
          <Label>Selected work</Label>
          <h2 className="font-display mt-3 text-3xl text-ink sm:text-4xl">
            Proof, not promises.
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
