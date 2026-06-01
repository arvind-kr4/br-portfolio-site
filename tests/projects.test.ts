import { describe, it, expect } from "vitest";
import { getProject, getAllSlugs, projects } from "@/lib/projects";

describe("projects data", () => {
  it("returns a project for a known slug", () => {
    const first = projects[0];
    expect(getProject(first.slug)).toEqual(first);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProject("does-not-exist")).toBeUndefined();
  });

  it("exposes every slug via getAllSlugs", () => {
    expect(getAllSlugs().sort()).toEqual(projects.map((p) => p.slug).sort());
  });

  it("has unique slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
