"use client";

import React, { useState } from "react";
import "./globals.css";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AdminDashboard } from "@/components/Dashboard/AdminDashboard";
import { InfoSections } from "@/components/Sections/InfoSections";
import { Footer } from "@/components/Footer";
import { SurveyModal } from "@/components/Modals/SurveyModal";
import { LoginModal } from "@/components/Modals/LoginModal";
import { DetailsModal } from "@/components/Modals/DetailsModal";
import { ProfileModal } from "@/components/Modals/ProfileModal";
import { AuthModal } from "@/components/Modals/AuthModal";
import { SurveyProvider, useSurvey } from "@/context/SurveyContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function MainContent() {
  const [activeSection, setActiveSection] = useState("home");
  const { totalResponses, aiUsers, nonAiUsers, avgImpactScore, coursesCount } = useSurvey();
  const { loginUser, logoutUser } = useAuth();

  // Modals state
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedMetricKey, setSelectedMetricKey] = useState<string | null>(null);

  const scrollToDashboard = () => {
    const el = document.getElementById("dashboard-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* 1. Header Navigation */}
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onOpenLogin={() => {
          setAuthTab("signin");
          setIsAuthOpen(true);
        }}
        onOpenSurvey={() => setIsSurveyOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <main className="flex-grow">
        {/* 2. Top Hero Banner & Floating Summary Bar */}
        <HeroSection
          onStartSurvey={() => setIsSurveyOpen(true)}
          onLearnMore={() => window.location.assign("/about")}
        />

        {/* 3. Researcher Dashboard Panel */}
        <div id="dashboard-section">
          <AdminDashboard
            onSelectMetric={(key) => setSelectedMetricKey(key)}
            onOpenLogin={() => {
              setAuthTab("signin");
              setIsAuthOpen(true);
            }}
          />
        </div>

        {/* 4. Secondary Content Views (About, Instructions, FAQs, Contact) */}
        <InfoSections
          activeSection={activeSection}
          onStartSurvey={() => setIsSurveyOpen(true)}
        />
      </main>

      {/* 5. Footer */}
      <Footer />

      {/* ------------ MODALS ------------ */}
      {/* Student Survey Form Modal */}
      <SurveyModal
        isOpen={isSurveyOpen}
        onClose={() => setIsSurveyOpen(false)}
      />

      {/* MongoDB Authentication Modal (Sign In & Sign Up) */}
      <AuthModal
        isOpen={isAuthOpen}
        initialTab={authTab}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(userData) => {
          loginUser(userData);
          scrollToDashboard();
        }}
      />

      {/* Researcher / User Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogout={() => {
          logoutUser();
          setAuthTab("signin");
          setIsAuthOpen(true);
        }}
      />

      {/* Metric Stat Details Breakdown Modal */}
      <DetailsModal
        metricKey={selectedMetricKey}
        onClose={() => setSelectedMetricKey(null)}
        totalResponses={totalResponses}
        aiUsers={aiUsers}
        nonAiUsers={nonAiUsers}
        avgImpactScore={avgImpactScore}
        coursesCount={coursesCount}
      />

    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <SurveyProvider>
        <MainContent />
      </SurveyProvider>
    </AuthProvider>
  );
}
