import Link from "next/link";

export function HomeFooter() {
  return (
    <footer className="border-t border-border/70 bg-muted/20 py-8 text-sm text-muted-foreground">
      <div className="section-shell flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p>© 2026 Samadhan.com (&quot;Co-Pilot Life&quot;). Calm, structured guidance for life’s most important decisions.</p>
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
          <Link href="/privacy" className="rounded-full px-2 py-1 transition-colors hover:bg-accent hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/terms" className="rounded-full px-2 py-1 transition-colors hover:bg-accent hover:text-foreground">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}