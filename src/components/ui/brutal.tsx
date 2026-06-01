import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const accentBg: Record<string, string> = {
  yellow: "bg-pop-yellow",
  purple: "bg-pop-purple text-paper",
  teal: "bg-pop-teal",
  red: "bg-pop-red text-paper",
  ink: "bg-ink text-paper",
  paper: "bg-paper text-ink",
};

export function Label({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-md bg-ink px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-pop-yellow">
      {children}
    </span>
  );
}

export function Badge({
  children,
  accent = "purple",
}: {
  children: ReactNode;
  accent?: keyof typeof accentBg;
}) {
  return (
    <span
      className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-extrabold ${accentBg[accent]}`}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-brutal shadow-brutal rounded-xl bg-paper text-ink ${className}`}
    >
      {children}
    </div>
  );
}

type ButtonProps = {
  children: ReactNode;
  accent?: keyof typeof accentBg;
} & (
  | ({ href: string } & ComponentProps<typeof Link>)
  | ({ href?: undefined } & ComponentProps<"button">)
);

export function BrutalButton({ children, accent = "teal", ...props }: ButtonProps) {
  const cls = `border-brutal shadow-brutal inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-extrabold transition-transform duration-100 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none ${accentBg[accent]}`;
  if ("href" in props && props.href) {
    return (
      <Link className={cls} {...(props as ComponentProps<typeof Link>)}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...(props as ComponentProps<"button">)}>
      {children}
    </button>
  );
}
