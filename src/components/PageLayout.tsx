"use client";

import React from "react";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";

interface PageLayoutProps {
  activeSection: string;
  children: React.ReactNode;
}

function PageContent({ activeSection, children }: PageLayoutProps) {
  const goHome = (path = "") => window.location.assign(`/${path}`);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        activeSection={activeSection}
        setActiveSection={() => undefined}
        onOpenLogin={() => goHome("?auth=signin")}
        onOpenSurvey={() => goHome("survey")}
        onOpenProfile={() => goHome()}
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}

export function PageLayout(props: PageLayoutProps) {
  return <AuthProvider><PageContent {...props} /></AuthProvider>;
}
