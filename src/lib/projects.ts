export type Result = { label: string; value: string };

export type Project = {
  slug: string;
  title: string;
  client: string;
  category: string;
  channels: string[];
  summary: string;
  thumbLabel: string;
  accent: "yellow" | "purple" | "teal" | "red";
  problem: string;
  approach: string[];
  results: Result[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "d2c-skincare-launch",
    title: "Launch → $1M in 9 months",
    client: "D2C Skincare Brand",
    category: "Paid + Email + CRO",
    channels: ["Meta Ads", "Klaviyo", "CRO"],
    summary: "Took a pre-revenue skincare brand from launch to $1M ARR.",
    thumbLabel: "D2C SKINCARE",
    accent: "yellow",
    problem:
      "A founder-led skincare brand had a great product but no acquisition engine and a leaky checkout funnel.",
    approach: [
      "Built a Meta Ads prospecting + retargeting structure around UGC creative.",
      "Set up Klaviyo flows: welcome, abandoned cart, post-purchase, win-back.",
      "Ran CRO experiments on the PDP and checkout to lift conversion rate.",
    ],
    results: [
      { label: "Revenue", value: "+312%" },
      { label: "ROAS", value: "4.6x" },
      { label: "Email rev. share", value: "31%" },
    ],
    featured: true,
  },
  {
    slug: "b2b-saas-organic-engine",
    title: "An organic growth engine",
    client: "B2B SaaS Startup",
    category: "SEO + Content",
    channels: ["SEO", "Content", "GA4"],
    summary: "Built an SEO + content engine that 3x'd inbound demo signups.",
    thumbLabel: "B2B SAAS",
    accent: "teal",
    problem:
      "A Series A SaaS depended entirely on paid demos with rising CAC and no organic pipeline.",
    approach: [
      "Ran keyword + intent research to map a bottom-of-funnel content cluster.",
      "Shipped 24 comparison and use-case articles with on-page SEO.",
      "Instrumented GA4 + attribution to tie content to demo signups.",
    ],
    results: [
      { label: "Demo signups", value: "3x" },
      { label: "Organic traffic", value: "+212%" },
      { label: "CAC", value: "-29%" },
    ],
    featured: true,
  },
  {
    slug: "mobile-app-growth",
    title: "Profitable app growth",
    client: "Consumer Mobile App",
    category: "ASO + Paid Social",
    channels: ["ASO", "TikTok Ads", "Meta Ads"],
    summary: "Scaled installs while cutting cost per acquisition by 38%.",
    thumbLabel: "MOBILE APP",
    accent: "purple",
    problem:
      "A consumer app was buying expensive, low-retention installs with no creative testing system.",
    approach: [
      "Optimized App Store listing (ASO) for the highest-intent keywords.",
      "Built a weekly creative testing sprint across TikTok and Meta.",
      "Shifted budget to retained-user cohorts using post-install events.",
    ],
    results: [
      { label: "CAC", value: "-38%" },
      { label: "Installs", value: "+140%" },
      { label: "D7 retention", value: "+22%" },
    ],
  },
  {
    slug: "local-retail-rebrand",
    title: "Rebrand + local ads",
    client: "Local Retail Chain",
    category: "Brand + Meta Ads",
    channels: ["Brand", "Meta Ads", "Local SEO"],
    summary: "Repositioned a 4-store chain and drove a 5.2x return on ad spend.",
    thumbLabel: "LOCAL RETAIL",
    accent: "red",
    problem:
      "A regional retailer had an outdated brand and flat foot traffic across four stores.",
    approach: [
      "Led a brand refresh: voice, visual identity, and offer architecture.",
      "Launched geo-targeted Meta campaigns tied to in-store promotions.",
      "Cleaned up Google Business Profiles and local SEO for each location.",
    ],
    results: [
      { label: "ROAS", value: "5.2x" },
      { label: "Foot traffic", value: "+47%" },
      { label: "Avg. order value", value: "+18%" },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return projects.map((p) => p.slug);
}
