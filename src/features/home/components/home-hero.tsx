import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/shared/config/site";

const checkpoints = [
  "App Router with TypeScript strict mode",
  "Tailwind CSS v4, ESLint, Prettier, absolute imports",
  "Feature-first structure for scalable frontend delivery",
];

export function HomeHero() {
  return (
    <main className="relative overflow-hidden">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid w-full gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <Badge>Senior Frontend Baseline</Badge>

            <div className="max-w-3xl space-y-5">
              <h1 className="font-heading text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
                Build CRM screens on a clean, scalable Next.js foundation.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                {siteConfig.description}. The structure is prepared for reusable UI, isolated feature modules,
                API integration, and polished responsive delivery.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button as={Link} href="/docs">
                Project Guidelines
              </Button>
              <Button as={Link} href="https://nextjs.org/docs" target="_blank" rel="noreferrer" variant="secondary">
                Next.js Docs
              </Button>
            </div>

            <ul className="grid gap-3 text-sm text-foreground sm:grid-cols-2">
              {checkpoints.map((item) => (
                <li key={item} className="rounded-2xl border border-border bg-surface px-4 py-4 shadow-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(15,98,254,0.18),transparent_58%)] blur-2xl" />
            <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_-36px_rgba(20,33,61,0.35)] backdrop-blur">
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Workspace</p>
                    <h2 className="mt-2 font-heading text-3xl font-semibold text-foreground">MTCRMS Frontend</h2>
                  </div>
                  <span className="rounded-full bg-success/12 px-3 py-1 text-sm font-medium text-success">
                    Ready
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoCard label="Architecture" value="Feature-first + shared layers" />
                  <InfoCard label="Quality" value="Strict TS, lint, format, typecheck" />
                  <InfoCard label="Styling" value="Tailwind v4 with design tokens" />
                  <InfoCard label="Next Step" value="Implement approved Figma screens" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-strong p-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-3 text-sm font-medium leading-6 text-foreground">{value}</p>
    </div>
  );
}
