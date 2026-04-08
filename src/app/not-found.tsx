import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="max-w-md space-y-6 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">404</p>
        <div className="space-y-3">
          <h1 className="font-heading text-4xl font-semibold text-foreground">Page not found</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            The route does not exist in the current frontend baseline.
          </p>
        </div>
        <Button as={Link} href="/">
          Back to home
        </Button>
      </div>
    </main>
  );
}
