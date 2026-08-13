import { Reveal, Tag } from "./Reveal";
import { Link } from "@tanstack/react-router";
import { Scene3D } from "./Scene3D";
import communityApp from "@/assets/community-app.jpg";

const nav = ["Curriculum", "Mentors", "Community", "Pricing"];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav className="flex w-full max-w-5xl items-center justify-between rounded-full border border-border bg-card/70 px-4 py-2.5 backdrop-blur-xl">
        <a href="#top" className="font-display text-lg font-bold tracking-tight">
          nexus<span className="text-primary">.</span>
        </a>
        <ul className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          {nav.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="transition-colors hover:text-foreground"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            Join now
          </Link>
        </div>
      </nav>
    </header>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[92vh] overflow-hidden px-4 pt-36 pb-28 md:pt-44 md:pb-36"
    >
      <div
        className="pointer-events-none absolute inset-0 animate-glow"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden
      />
      <Scene3D />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(55% 40% at 50% 45%, var(--background) 15%, transparent 78%)",
        }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <Reveal>
          <Tag>Cohort 12 — open</Tag>
          <h1 className="mt-6 text-5xl leading-[0.95] font-bold md:text-7xl">
            Where designers <span className="text-gradient">never stop</span> learning
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
            Lessons, live critiques and a community of 10,000+ product designers. Learn the craft
            from the people already shipping it.
          </p>
        </Reveal>
        <Reveal delay={140}>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="you@studio.com"
              aria-label="Email address"
              className="h-12 flex-1 rounded-full border border-input bg-card px-5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            <button
              type="submit"
              className="h-12 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              Start learning
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

const skills = [
  {
    title: "Design systems",
    level: "Core",
    body: "Tokens, components and the discipline to keep them alive.",
  },
  { title: "Web design", level: "Core", body: "Layout, type and rhythm that feels effortless." },
  {
    title: "Product thinking",
    level: "Advanced",
    body: "Frame the problem before you open the canvas.",
  },
  { title: "Motion", level: "Advanced", body: "Timing and easing that reads as quality." },
  { title: "Brand identity", level: "Core", body: "Marks and voice that survive reality." },
  { title: "AI workflows", level: "New", body: "Ship faster without looking generated." },
];

export function Skills() {
  return (
    <section id="curriculum" className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <h2 className="text-3xl font-bold md:text-5xl">Expand your skillset</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Six tracks, built as a single curriculum. Start anywhere, finish everywhere.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((s, i) => (
            <Reveal key={s.title} delay={i * 70}>
              <article className="group h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50">
                <div className="flex items-center justify-between">
                  <span className="size-8 rounded-lg bg-surface-elevated transition-colors group-hover:bg-primary" />
                  <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground">
                    {s.level}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const stats: Array<[string, string]> = [
  ["30+", "Lessons"],
  ["26+", "Workshops"],
  ["14+", "Nationalities"],
  ["10k+", "Members"],
  ["9+", "Challenges"],
];

export function Community() {
  return (
    <section id="community" className="relative overflow-hidden px-4 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <h2 className="text-3xl font-bold md:text-5xl">
            Become part of our <span className="text-gradient">community</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <img
            src={communityApp}
            alt="Nexus community app dashboard"
            loading="lazy"
            width={1408}
            height={912}
            className="mx-auto mt-10 w-full rounded-3xl border border-border"
            style={{ boxShadow: "var(--shadow-card)" }}
          />
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-5">
          {stats.map(([value, label], i) => (
            <Reveal key={label} delay={i * 60}>
              <p className="font-display text-3xl font-bold md:text-4xl">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const mentors = [
  { name: "Dan Mall", topic: "Design systems" },
  { name: "Grace Walker", topic: "Freelancing" },
  { name: "Femi Manuel", topic: "Branding" },
  { name: "Molly Hellmuth", topic: "Figma tactics" },
  { name: "David Hoang", topic: "Future of AI" },
  { name: "James McDonald", topic: "Web design" },
];

export function Mentors() {
  return (
    <section id="mentors" className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="text-3xl font-bold md:text-5xl">Learn from the best</h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            Every session unlocks the working knowledge of people leading today&apos;s best teams.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mentors.map((m, i) => (
            <Reveal key={m.name} delay={i * 70}>
              <div className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent/60">
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-surface-elevated font-display text-sm font-bold text-accent transition-transform group-hover:scale-110">
                  {m.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <div>
                  <p className="text-xs text-accent">{m.name}</p>
                  <p className="font-display text-lg font-semibold">{m.topic}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const quotes: Array<[string, string]> = [
  ["The critiques alone paid for the year. I ship twice as fast.", "Ana R., Product Designer"],
  ["Best design community on the internet, and it's not even close.", "Kyle B., Founder"],
  ["I stopped guessing at type and spacing. It's all systems now.", "Marco T., Design Lead"],
  ["Six weeks in and my portfolio landed me three interviews.", "Priya S., UI Designer"],
];

export function Testimonials() {
  const row = [...quotes, ...quotes];
  return (
    <section className="overflow-hidden py-24">
      <Reveal className="px-4 text-center">
        <Tag>Reviews</Tag>
        <h2 className="mt-5 text-3xl font-bold md:text-5xl">What designers say about us</h2>
      </Reveal>
      <div className="mt-12 flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
        {row.map(([quote, author], i) => (
          <figure
            key={`${author}-${i}`}
            className="w-[320px] shrink-0 rounded-2xl border border-border bg-card p-6"
          >
            <blockquote className="text-sm leading-relaxed">&ldquo;{quote}&rdquo;</blockquote>
            <figcaption className="mt-4 text-xs text-muted-foreground">{author}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

const plans = [
  {
    name: "Free",
    price: "$0",
    featured: false,
    perks: ["3 starter lessons", "Community read access", "Weekly newsletter"],
  },
  {
    name: "Pro",
    price: "$299",
    featured: true,
    perks: ["Full curriculum", "Live workshops", "Portfolio critiques", "Private community"],
  },
  {
    name: "Ultimate",
    price: "$999",
    featured: false,
    perks: ["Everything in Pro", "1:1 mentor sessions", "Career coaching", "Lifetime access"],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <h2 className="text-3xl font-bold md:text-5xl">
            Start your journey <span className="text-gradient">today</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3 md:items-center">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 90}>
              <div
                className={`rounded-3xl border p-7 transition-transform hover:-translate-y-1 ${
                  p.featured
                    ? "border-primary/60 bg-surface-elevated md:scale-105"
                    : "border-border bg-card"
                }`}
                style={p.featured ? { boxShadow: "var(--shadow-glow)" } : undefined}
              >
                <div className="flex items-center justify-between">
                  <p className="font-display text-sm font-semibold">{p.name}</p>
                  {p.featured && <Tag>Popular</Tag>}
                </div>
                <p className="mt-5 font-display text-5xl font-bold">{p.price}</p>
                <p className="mt-1 text-xs text-muted-foreground">one-time payment</p>
                <ul className="mt-6 space-y-2.5 text-sm text-muted-foreground">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex gap-2">
                      <span className="text-primary">—</span>
                      {perk}
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-8 h-11 w-full rounded-full text-sm font-semibold transition-transform hover:scale-[1.03] ${
                    p.featured
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-transparent text-foreground"
                  }`}
                >
                  Choose {p.name}
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border px-4 py-14">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-2xl font-bold">
            nexus<span className="text-primary">.</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            A learning platform for designers who never stop learning.
          </p>
        </div>
        <div className="flex gap-10 text-sm text-muted-foreground">
          <ul className="space-y-2">
            <li className="text-foreground">Learn</li>
            <li>Curriculum</li>
            <li>Mentors</li>
          </ul>
          <ul className="space-y-2">
            <li className="text-foreground">Company</li>
            <li>About</li>
            <li>Careers</li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-5xl text-xs text-muted-foreground">
        © {new Date().getFullYear()} Nexus. All rights reserved.
      </p>
    </footer>
  );
}
