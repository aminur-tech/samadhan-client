import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Compass,
  MessageSquareQuote,
  PlayCircle,
  Scale,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";

const features = [
  {
    title: "Decision intelligence",
    description:
      "Structured pros and cons matrices, weighted scenarios, and guidance tuned for high-stakes decisions.",
    icon: Compass,
  },
  {
    title: "Legal navigator",
    description:
      "Plain-language playbooks for documents, offices, fees, and practical follow-up steps.",
    icon: Scale,
  },
  {
    title: "Crisis command center",
    description:
      "Rapid SOS protocols, escalation checklists, and safe next steps for urgent situations.",
    icon: ShieldAlert,
  },
  {
    title: "Verified experts",
    description:
      "Book trusted professionals instantly for legal, personal, and mental health support.",
    icon: Users,
  },
];

const stats = [
  { value: "24/7", label: "Crisis coverage" },
  { value: "98%", label: "Action clarity" },
  { value: "4.9/5", label: "Expert satisfaction" },
];

const testimonials = [
  {
    quote:
      "The guidance felt calm, structured, and deeply human when I needed it most.",
    name: "Mira K.",
    role: "Founder, Northstar Studio",
  },
  {
    quote:
      "Every next step was obvious. It felt like a premium operating system for difficult moments.",
    name: "Rohit S.",
    role: "Product Lead, Gridline",
  },
  {
    quote:
      "We use it as a confidential partner for decisions, paperwork, and urgent support.",
    name: "Ava L.",
    role: "Operations Director, Aster Labs",
  },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "$19",
    description: "A focused workspace for personal support and decision planning.",
    features: ["Core decision matrix", "Crisis checklists", "Email support"],
    featured: false,
  },
  {
    name: "Growth",
    price: "$79",
    description: "For teams and households that want deeper workflows and expert access.",
    features: ["Unlimited workspace", "Priority expert booking", "Advanced analytics"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored for organizations that need governance, compliance, and scale.",
    features: ["SSO and role controls", "Dedicated onboarding", "Security reviews"],
    featured: false,
  },
];

const faqs = [
  {
    question: "How quickly can I get help?",
    answer: "Most urgent guidance paths are available immediately, with direct expert routes for time-sensitive cases.",
  },
  {
    question: "Can I use this for personal and professional decisions?",
    answer: "Yes. The experience is designed for both everyday planning and sensitive situations.",
  },
  {
    question: "Is the platform secure?",
    answer: "Sensitive workflows are handled with privacy-first architecture and secure account controls.",
  },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.24),_transparent_60%)]" />

      <section className="section-shell py-20 sm:py-24 lg:py-28">
        <div className="surface-card overflow-hidden px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-8">
              <div className="chip">
                <Sparkles className="h-3.5 w-3.5" />
                AI + human hybrid guidance platform
              </div>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Navigate life’s hardest moments with calm clarity.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                  Samadhan combines a premium operating system for decisions, legal support, and crisis response with instant access to trusted experts.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="focus-ring inline-flex items-center gap-2 rounded-[12px] bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_12px_32px_-12px_rgba(79,70,229,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95"
                >
                  Open the workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard/crisis"
                  className="focus-ring inline-flex items-center gap-2 rounded-[12px] border border-red-500/25 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-500/20 dark:text-red-400"
                >
                  <ShieldAlert className="h-4 w-4" />
                  Emergency SOS
                </Link>
              </div>
            </div>

            <div className="panel-soft p-6 sm:p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Today’s readiness score</p>
                    <p className="text-sm text-muted-foreground">Prepared for decisions, paperwork, and crises</p>
                  </div>
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">92%</div>
                </div>
                <div className="space-y-2 rounded-[16px] border border-border/80 bg-background/70 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Decision matrix</span>
                    <span className="font-semibold text-foreground">Live</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Crisis checklist</span>
                    <span className="font-semibold text-foreground">Ready</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Expert response</span>
                    <span className="font-semibold text-foreground">Available</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-[16px] border border-border/80 bg-background/70 p-4">
                  <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                    <PlayCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Preview the command center</p>
                    <p className="text-sm text-muted-foreground">Fast, focused, and beautifully structured</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="section-shell py-8 sm:py-12">
        <div className="flex flex-col gap-3 text-center sm:text-left">
          <div className="chip w-fit">Platform modules</div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Every module shares the same premium experience.
          </h2>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            From legal navigation to crisis action plans, the experience feels calm, deliberate, and enterprise-ready.
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="surface-card p-6 transition-all duration-200 hover:-translate-y-1">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-shell py-16 sm:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="surface-card p-6">
              <p className="text-3xl font-black tracking-tight text-foreground">{stat.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="testimonials" className="section-shell py-8 sm:py-12">
        <div className="flex flex-col gap-3 text-center sm:text-left">
          <div className="chip w-fit">Trusted by teams</div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Designed for moments that matter.
          </h2>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="surface-card p-6">
              <div className="mb-4 flex items-center gap-2 text-primary">
                <MessageSquareQuote className="h-5 w-5" />
                <span className="text-sm font-semibold">Customer story</span>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">“{testimonial.quote}”</p>
              <div className="mt-6">
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="section-shell py-16 sm:py-20">
        <div className="flex flex-col gap-3 text-center sm:text-left">
          <div className="chip w-fit">Flexible plans</div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built to support both individuals and organizations.
          </h2>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <div key={tier.name} className={`surface-card p-6 ${tier.featured ? "border-primary/40 bg-primary/[0.03]" : ""}`}>
              {tier.featured ? (
                <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  Most popular
                </div>
              ) : null}
              <h3 className="text-xl font-semibold text-foreground">{tier.name}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{tier.description}</p>
              <p className="mt-6 text-4xl font-black tracking-tight text-foreground">{tier.price}</p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="focus-ring mt-8 inline-flex items-center gap-2 rounded-[12px] border border-border/80 px-4 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-accent"
              >
                Choose plan
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="section-shell py-8 sm:py-12">
        <div className="surface-card p-6 sm:p-8">
          <div className="flex flex-col gap-3 text-center sm:text-left">
            <div className="chip w-fit">FAQ</div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Questions people ask before getting started.
            </h2>
          </div>
          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-[16px] border border-border/80 bg-background/70 p-4">
                <p className="font-semibold text-foreground">{faq.question}</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-16 sm:py-20">
        <div className="surface-card overflow-hidden bg-primary/[0.05] p-8 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="chip">Ready when you are</div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Start with a clear plan instead of a scattered response.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Bring structure to your toughest decisions and support your team with a calm, premium experience.
              </p>
            </div>
            <Link
              href="/register"
              className="focus-ring inline-flex items-center gap-2 rounded-[12px] bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_12px_32px_-12px_rgba(79,70,229,0.55)] transition-all duration-200 hover:-translate-y-0.5"
            >
              Create your workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}