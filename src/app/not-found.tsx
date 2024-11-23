"use client";

import ErrorLayout from "./components/Static/ErrorLayout";
import { PageHero } from "./components/PageHero/UsePageHero";

export default function NotFoundPage() {
  return (
    <>
      <PageHero

        text="Whoops! Looks like you&apos;ve followed a broken link or entered a URL that doesn't exist on this site."
        title="Page Not Found"
      />
      <ErrorLayout />
    </>
  );
}
