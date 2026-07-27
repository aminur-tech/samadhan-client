import Link from "next/link";

export function HomeFooter() {
  return (
    <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 Samadhan.com (&quot;Co-Pilot Life&quot;). All rights reserved.</p>
        <div className="flex gap-4 text-xs">
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}