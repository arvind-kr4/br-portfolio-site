import Link from "next/link";
import { profile } from "@/lib/profile";
import { ThemeToggle } from "@/components/theme-toggle";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-[var(--shadow-color)] bg-ink text-paper">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/" className="font-display text-lg">
          {profile.initials}
        </Link>
        <div className="flex items-center gap-3 text-xs font-bold sm:gap-5 sm:text-sm">
          <Link href="/#work" className="hover:text-pop-yellow">Work</Link>
          <Link href="/#about" className="hover:text-pop-yellow">About</Link>
          <Link href="/#skills" className="hover:text-pop-yellow">Skills</Link>
          <Link
            href="/#contact"
            className="rounded-md bg-pop-red px-3 py-1.5 text-paper"
          >
            Contact ↗
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
