import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/app/AuthForm";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your Nexus account" },
      {
        name: "description",
        content:
          "Create a free Nexus account and join 10,000+ designers and engineers shipping together.",
      },
      { property: "og:title", content: "Create your Nexus account" },
      {
        property: "og:description",
        content: "Join 10,000+ designers and engineers shipping together.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AuthForm mode="register" />,
});
