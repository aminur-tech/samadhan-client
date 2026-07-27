import Link from "next/link";
import { Compass, Scale, ShieldAlert, Users, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 text-center space-y-6 pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold">
          <span>AI + Human Hybrid Guidance Platform</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          Navigate Life’s Complex Crises & Decisions with Confidence
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Samadhan blends Google Gemini AI workflows with a panel of verified human experts to help you solve legal, bureaucratic, and personal emergencies.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl shadow-lg hover:opacity-90 flex items-center gap-2"
          >
            Go to App <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/crisis"
            className="px-6 py-3 border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 font-medium rounded-xl hover:bg-red-500/20"
          >
            Emergency SOS
          </Link>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-12">System Core Modules</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <Compass className="h-8 w-8 text-primary" />
            <h3 className="font-bold text-lg">Smart Decision Maker</h3>
            <p className="text-sm text-muted-foreground">
              Structured pros & cons matrix with option probability scores powered by Gemini.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <Scale className="h-8 w-8 text-primary" />
            <h3 className="font-bold text-lg">Legal Navigator</h3>
            <p className="text-sm text-muted-foreground">
              Plain-language bureaucratic guides detailing required fees, offices, and forms.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <ShieldAlert className="h-8 w-8 text-red-500" />
            <h3 className="font-bold text-lg">Crisis Support</h3>
            <p className="text-sm text-muted-foreground">
              Instant action checklists for cybercrime, financial fraud, and urgent emergencies.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <Users className="h-8 w-8 text-primary" />
            <h3 className="font-bold text-lg">Verified Panel</h3>
            <p className="text-sm text-muted-foreground">
              Book consultations directly with certified lawyers, counselors, and advisors.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}