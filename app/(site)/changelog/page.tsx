import { ExternalLinkIcon } from "lucide-react";
import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";

export const revalidate = 1800;

export const metadata: Metadata = {
  description:
    "Release notes for NodeByte's website, BytePanel and other projects.",
  title: "Changelog",
};

const REPOSITORIES = [
  { label: "Website", repo: "NodeByteHosting/website" },
  { label: "BytePanel", repo: "NodeByteHosting/BytePanel" },
  { label: "Game panel", repo: "NodeByteHosting/Game-Panel" },
  { label: "BytePay", repo: "NodeByteHosting/BytePay" },
];

interface Release {
  body: string;
  date: string;
  label: string;
  name: string;
  url: string;
}

const fetchReleases = async (
  repo: string,
  label: string
): Promise<Release[]> => {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/releases?per_page=20`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
        next: { revalidate: 1800 },
        signal: AbortSignal.timeout(8000),
      }
    );
    if (!res.ok) {
      return [];
    }
    const releases = (await res.json()) as {
      body: string | null;
      draft: boolean;
      html_url: string;
      name: string | null;
      published_at: string | null;
      tag_name: string;
    }[];
    return releases
      .filter((release) => !release.draft && release.published_at)
      .map((release) => ({
        body: (release.body ?? "").trim(),
        date: release.published_at ?? "",
        label,
        name: release.name || release.tag_name,
        url: release.html_url,
      }));
  } catch {
    return [];
  }
};

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "long" });

const summary = (body: string) =>
  body
    .split("\n")
    .map((line) => line.replace(/^#+\s*|^\*\s+|^-\s+/u, "").trim())
    .filter((line) => line && !line.startsWith("**Full Changelog**"))
    .slice(0, 6);

const ChangelogPage = async () => {
  const perRepo = await Promise.all(
    REPOSITORIES.map(({ label, repo }) => fetchReleases(repo, label))
  );
  const releases = perRepo
    .flat()
    .toSorted((a, b) => b.date.localeCompare(a.date))
    .slice(0, 40);

  return (
    <>
      <PageHero
        description="Release notes from across NodeByte: this website, BytePanel, our game panel and BytePay."
        eyebrow="Changelog"
        title="What's new"
      />
      <Section>
        {releases.length === 0 ? (
          <p className="text-muted-foreground">
            Release notes couldn&apos;t be loaded right now. Try again later.
          </p>
        ) : (
          <ol className="flex max-w-4xl flex-col divide-y">
            {releases.map((release) => (
              <li
                className="grid gap-3 py-8 md:grid-cols-[180px_1fr]"
                key={release.url}
              >
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-link font-medium">{release.label}</span>
                  <time
                    className="text-muted-foreground"
                    dateTime={release.date}
                  >
                    {dateFormat.format(new Date(release.date))}
                  </time>
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    className="inline-flex items-center gap-2 text-lg font-semibold hover:underline"
                    href={release.url}
                  >
                    {release.name}
                    <ExternalLinkIcon className="text-muted-foreground size-4" />
                  </a>
                  <ul className="text-muted-foreground flex flex-col gap-1 text-sm">
                    {summary(release.body).map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Section>
    </>
  );
};

export default ChangelogPage;
