"use client";

import React from "react";
import { InfoSections } from "@/components/Sections/InfoSections";
import { PageLayout } from "@/components/PageLayout";

export function InfoPage({ section }: { section: "about" | "instructions" | "faqs" | "contact" }) {
  return (
    <PageLayout activeSection={section}>
      <InfoSections activeSection={section} onStartSurvey={() => window.location.assign("/survey")} />
    </PageLayout>
  );
}
