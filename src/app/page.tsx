"use client";

import React, { useState } from "react";
import "./globals.css";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { InfoSections } from "@/components/Sections/InfoSections";
import { SurveyModal } from "@/components/Modals/SurveyModal";
import { ProfileModal } from "@/components/Modals/ProfileModal";
import { AuthModal } from "@/components/Modals/AuthModal";
import { SurveyProvider } from "@/context/SurveyContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function MainContent() {
  const [activeSection, setActiveSection] = useState("home");
  const { loginUser, logoutUser, isAuthenticated } = useAuth();

  // Modals state
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signup");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleOpenSurvey = () => {
    if (isAuthenticated) {
      setIsSurveyOpen(true);
    } else {
      setAuthTab("signup");
      setIsAuthOpen(true);
    }
  };

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
        onOpenSurvey={handleOpenSurvey}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <main className="flex-grow">
        {/* 2. Top Hero Banner & Floating Summary Bar */}
        <HeroSection
          onStartSurvey={handleOpenSurvey}
          onLearnMore={() => window.location.assign("/about")}
        />



        {/* 4. Secondary Content Views (About, Instructions, FAQs, Contact) */}
        <InfoSections
          activeSection={activeSection}
          onStartSurvey={handleOpenSurvey}
        />
      </main>



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
          setIsAuthOpen(false);
          setIsSurveyOpen(true);
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
