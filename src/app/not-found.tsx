"use client";

import ErrorLayout from "./components/Static/ErrorLayout";
import { TitleBannerPage } from "./components/TitleBannerPage/TitleBannerPage";

export default function NotFoundPage() {
  return (
    <>
      <TitleBannerPage
        supTitle="404"
        text="Whoops! Looks like you&apos;ve followed a broken link or entered a URL that doesn't exist on this site."
        title="Page Not Found"
      />
      <ErrorLayout />
    </>
  );
}
