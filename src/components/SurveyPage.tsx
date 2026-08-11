"use client";

import React, { useState } from "react";
import { FileEdit } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { SurveyModal } from "@/components/Modals/SurveyModal";
import { SurveyProvider } from "@/context/SurveyContext";

function SurveyPageContent() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <PageLayout activeSection="survey">
      <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
          <FileEdit className="mx-auto h-10 w-10 text-blue-600" />
          <h1 className="mt-4 text-3xl font-extrabold text-slate-900">AI-Edu Impact Survey</h1>
          <p className="mt-3 text-slate-600">Share your learning experience in our confidential academic study.</p>
          <button onClick={() => setIsOpen(true)} className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700">Open Survey</button>
        </div>
      </section>
      <SurveyModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </PageLayout>
  );
}

export function SurveyPage() {
  return <SurveyProvider><SurveyPageContent /></SurveyProvider>;
}
