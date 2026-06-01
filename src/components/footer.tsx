import { profile } from "@/lib/profile";

export function Footer() {
  return (
    <footer className="border-t-[3px] border-[var(--shadow-color)] bg-paper text-ink">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
        <p className="text-sm font-bold">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <div className="flex gap-4 text-sm font-bold">
          {profile.socials.map((s) => (
            <a key={s.label} href={s.href} className="hover:text-pop-purple">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
