import { createFileRoute } from "@tanstack/react-router";
import {
  Community,
  Footer,
  Hero,
  Mentors,
  Nav,
  Pricing,
  Skills,
  Testimonials,
} from "@/components/landing/Sections";
import { Craft } from "@/components/landing/Craft";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexus — Design school for people who ship" },
      {
        name: "description",
        content:
          "Lessons, live workshops, mentors and a 10,000-designer community. Learn design craft from the people already shipping it.",
      },
      { property: "og:title", content: "Nexus — Design school for people who ship" },
      {
        property: "og:description",
        content: "Lessons, live workshops, mentors and a 10,000-designer community.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <Skills />
      <Craft />
      <Community />
      <Mentors />
      <Testimonials />
      <Pricing />
      <Footer />
    </main>
  );
}
