export interface Row {
  label: string;
  rhythmix: string;
  suno: string;
  udio: string;
  landr: string;
  acestep: string;
  highlight?: boolean;
}

export interface Competitor {
  key: CompetitorKey;
  name: string;
  subtitle?: string;
  slug: string;
}

export type CompetitorKey = "suno" | "udio" | "landr" | "acestep";

export const competitors: Record<CompetitorKey, Competitor> = {
  suno:    { key: "suno",    name: "Suno",         slug: "vs-suno" },
  udio:    { key: "udio",    name: "Udio",         slug: "vs-udio" },
  landr:   { key: "landr",   name: "LANDR",        slug: "vs-landr" },
  acestep: { key: "acestep", name: "ACE-Step UI",  subtitle: "(open source)", slug: "vs-ace-step" },
};

export const rows: Row[] = [
  { label: "Price",                        rhythmix: "$149 once",                suno: "$10–30/mo",        udio: "$10–30/mo",        landr: "$15–25/mo",       acestep: "Free",                     highlight: true },
  { label: "AI music generation",          rhythmix: "✓ Unlimited",              suno: "✓ Limited credits", udio: "✓ Limited credits", landr: "✗",               acestep: "✓ Unlimited" },
  { label: "AI mastering included",        rhythmix: "✓",                        suno: "✗",                 udio: "✗",                 landr: "✓",               acestep: "✗" },
  { label: "One-tap distribution",         rhythmix: "✓ 120+ platforms",         suno: "✗ (export only)",  udio: "✗ (export only)",  landr: "✓ DistroKid",     acestep: "✗ (export only)" },
  { label: "Royalty share",                rhythmix: "100% yours",               suno: "Pro plan only",     udio: "Pro plan only",     landr: "100% yours",      acestep: "100% yours" },
  { label: "Hardware required",            rhythmix: "Phone or laptop",           suno: "Phone or laptop",   udio: "Phone or laptop",   landr: "Phone or laptop", acestep: "NVIDIA GPU 4GB+",          highlight: true },
  { label: "Setup time",                   rhythmix: "30 seconds",                suno: "30 seconds",        udio: "30 seconds",        landr: "30 seconds",      acestep: "1–3 hours",                highlight: true },
  { label: "Works offline",                rhythmix: "—",                         suno: "✗",                 udio: "✗",                 landr: "✗",               acestep: "✓ (after setup)" },
  { label: "3D venue performances",        rhythmix: "✓ Coming",                  suno: "✗",                 udio: "✗",                 landr: "✗",               acestep: "✗" },
  { label: "Sync licensing marketplace",   rhythmix: "✓ Coming",                  suno: "✗",                 udio: "✗",                 landr: "✗",               acestep: "✗" },
  { label: "Cloud library",                rhythmix: "✓ Coming",                  suno: "✓",                 udio: "✓",                 landr: "✓",               acestep: "Local only" },
  { label: "Subscription locks you in",    rhythmix: "✗ Pay once",                suno: "✓",                 udio: "✓",                 landr: "✓",               acestep: "—" },
  { label: "Open source",                  rhythmix: "✗",                         suno: "✗",                 udio: "✗",                 landr: "✗",               acestep: "✓" },
];
