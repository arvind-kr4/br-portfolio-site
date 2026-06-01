import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getAllSlugs } from "@/lib/projects";
import { profile } from "@/lib/profile";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Label, Card } from "@/components/ui/brutal";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Not found" };
  return { title: `${project.title} — ${profile.name}`, description: project.summary };
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <Nav />
      <main className="bg-paper text-ink">
        <section className="bg-pop-yellow">
          <div className="mx-auto max-w-3xl px-5 py-16">
            <Link href="/#work" className="text-sm font-bold hover:underline">
              ← Back to work
            </Link>
            <div className="mt-4">
              <Label>{project.client}</Label>
            </div>
            <h1 className="font-display mt-3 text-4xl leading-tight sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 max-w-xl text-lg">{project.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.channels.map((c) => (
                <span
                  key={c}
                  className="border-brutal rounded-md bg-paper px-2.5 py-1 text-xs font-extrabold"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-5 py-16">
          <div className="grid gap-4 sm:grid-cols-3">
            {project.results.map((r) => (
              <Card key={r.label} className="px-4 py-5">
                <div className="font-display text-3xl">{r.value}</div>
                <div className="mt-1 text-sm font-semibold">{r.label}</div>
              </Card>
            ))}
          </div>

          <h2 className="font-display mt-12 text-2xl">The problem</h2>
          <p className="mt-3 leading-relaxed">{project.problem}</p>

          <h2 className="font-display mt-10 text-2xl">The approach</h2>
          <ul className="mt-3 space-y-3">
            {project.approach.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-display flex h-7 w-7 flex-none items-center justify-center rounded-md bg-pop-purple text-paper">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12">
            <Link
              href="/#contact"
              className="border-brutal shadow-brutal inline-flex rounded-lg bg-pop-teal px-5 py-3 font-extrabold transition-transform duration-100 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Want results like these? Let&apos;s talk →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
