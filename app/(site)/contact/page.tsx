import {
  CodeIcon,
  LifeBuoyIcon,
  MailIcon,
  MessageCircleIcon,
  TriangleAlertIcon,
} from "lucide-react";
import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { LINKS } from "@/lib/site";

export const metadata: Metadata = {
  description:
    "Get help from NodeByte: open a support ticket, ask on Discord, or email our team.",
  title: "Contact",
};

const CHANNELS = [
  {
    action: "Open a ticket",
    href: LINKS.ticket,
    icon: LifeBuoyIcon,
    text: "Best for anything about your account, billing or a specific service. Tracked, prioritised and usually answered within 24 hours.",
    title: "Support ticket",
  },
  {
    action: "Join Discord",
    href: LINKS.discord,
    icon: MessageCircleIcon,
    text: "Quick questions, community help and announcements. Our team and other customers are around most of the day.",
    title: "Discord",
  },
  {
    action: LINKS.email,
    href: `mailto:${LINKS.email}`,
    icon: MailIcon,
    text: "Prefer email? Write to us and we'll reply, usually within 24 hours.",
    title: "Email",
  },
  {
    action: "Open GitHub",
    href: LINKS.github,
    icon: CodeIcon,
    text: "Report bugs and suggest features for our open-source projects.",
    title: "GitHub",
  },
];

const ContactPage = () => (
  <>
    <PageHero
      description="Whatever you need, there's a way to reach us. For anything about your account or a service, a ticket is the fastest route."
      eyebrow="Contact"
      title="How can we help?"
    />
    <Section>
      <div className="grid gap-4 md:grid-cols-2">
        {CHANNELS.map((channel) => (
          <a
            className="bg-card hover:border-primary flex flex-col gap-4 rounded-2xl border p-6 transition-colors"
            href={channel.href}
            key={channel.title}
          >
            <channel.icon className="text-link size-6" />
            <div className="flex flex-col gap-1.5">
              <h2 className="text-lg font-semibold">{channel.title}</h2>
              <p className="text-muted-foreground text-sm">{channel.text}</p>
            </div>
            <span className="text-link mt-auto text-sm font-medium">
              {channel.action}
            </span>
          </a>
        ))}
      </div>
      <div className="mt-8 flex gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 text-sm">
        <TriangleAlertIcon className="mt-0.5 size-4 shrink-0 text-amber-500" />
        <p>
          We don&apos;t handle billing or account questions on Discord. For your
          privacy, please open a ticket or email {LINKS.email} instead.
        </p>
      </div>
    </Section>
  </>
);

export default ContactPage;
