import Link from "next/link";
import type { Project } from "@/lib/projects";
import { Badge } from "@/components/ui/brutal";

const thumbBg: Record<Project["accent"], string> = {
  yellow: "bg-pop-yellow",
  purple: "bg-pop-purple text-paper",
  teal: "bg-pop-teal",
  red: "bg-pop-red text-paper",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="border-brutal shadow-brutal group block overflow-hidden rounded-xl bg-paper text-ink transition-transform duration-100 hover:-translate-x-0.5 hover:-translate-y-1"
    >
      <div
        className={`font-display flex h-28 items-center justify-center border-b-[3px] border-[var(--shadow-color)] text-sm tracking-wide ${thumbBg[project.accent]}`}
      >
        {project.thumbLabel}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg">{project.title}</h3>
        <p className="mt-1 text-sm text-ink/70">{project.category}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {project.results.slice(0, 1).map((r) => (
            <Badge key={r.label} accent="purple">
              {r.value} {r.label}
            </Badge>
          ))}
          <span className="text-sm font-bold group-hover:underline">View case study →</span>
        </div>
      </div>
    </Link>
  );
}
