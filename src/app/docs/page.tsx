const sections = [
  {
    title: "Feature-first modules",
    description: "Keep screen-specific UI, hooks, and adapters inside each feature to limit cross-module coupling.",
  },
  {
    title: "Shared foundation",
    description: "Reuse tokens, utilities, components, and service clients from shared layers before adding new code.",
  },
  {
    title: "Delivery standards",
    description: "Run lint, typecheck, and responsive polish on every UI slice before moving to review.",
  },
];

export default function DocsPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-16 sm:px-8">
      <div className="max-w-2xl space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Project Structure</p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground">Working baseline</h1>
        <p className="text-base leading-8 text-muted-foreground">
          This screen documents the initial frontend organization so new modules can be added without reshaping the
          foundation repeatedly.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {sections.map((section) => (
          <article key={section.title} className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-2xl font-semibold text-foreground">{section.title}</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{section.description}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
