import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/app/AuthForm";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Nexus workspace" },
      {
        name: "description",
        content:
          "Sign in to your Nexus workspace to access projects, teams, chat and your portfolio.",
      },
      { property: "og:title", content: "Sign in — Nexus workspace" },
      {
        property: "og:description",
        content: "Access your Nexus projects, teams and realtime chat.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AuthForm mode="login" />,
});
