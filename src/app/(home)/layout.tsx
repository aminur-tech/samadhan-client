import Link from "next/link";
import { HomeNavbar } from "@/components/layout/home-navbar";
import { HomeFooter } from "@/components/layout/home-footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">

      {/* Header / Navbar */}
      <HomeNavbar />

      {/* Main Page Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer>
        <HomeFooter/>
      </footer>
    </div>
  );
}