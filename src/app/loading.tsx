export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="space-y-3 text-center">
        <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-primary/20" />
        <p className="text-sm text-muted-foreground">Preparing workspace...</p>
      </div>
    </main>
  );
}
