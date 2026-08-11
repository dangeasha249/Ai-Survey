"use client";

import React, { useState } from "react";
import { FileEdit, Lock, UserPlus, LogIn, CheckCircle } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { SurveyModal } from "@/components/Modals/SurveyModal";
import { AuthModal } from "@/components/Modals/AuthModal";
import { SurveyProvider } from "@/context/SurveyContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function SurveyPageContent() {
  const { isAuthenticated, loginUser } = useAuth();
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signup");

  const handleOpenClick = () => {
    if (isAuthenticated) {
      setIsSurveyOpen(true);
    } else {
      setAuthTab("signup");
      setIsAuthOpen(true);
    }
  };

  return (
    <PageLayout activeSection="survey">
      <section className="mx-auto flex min-h-[65vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm space-y-5 max-w-lg mx-auto">
          
          {!isAuthenticated ? (
            <>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-sm">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Sign Up Required
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  To ensure research dataset integrity and prevent duplicate entries, students must Sign Up / Sign In before filling out the survey form.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setAuthTab("signup");
                    setIsAuthOpen(true);
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up to Fill Survey</span>
                </button>
                <button
                  onClick={() => {
                    setAuthTab("signin");
                    setIsAuthOpen(true);
                  }}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Existing User Sign In</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
                <FileEdit className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  AI-Edu Impact Survey
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Your account is verified. Click below to launch the 20-question questionnaire form.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsSurveyOpen(true)}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition"
                >
                  <FileEdit className="w-4 h-4" />
                  <span>Start 20-Question Survey</span>
                </button>
              </div>
            </>
          )}

        </div>
      </section>

      {/* Survey Form Modal */}
      <SurveyModal
        isOpen={isSurveyOpen}
        onClose={() => setIsSurveyOpen(false)}
      />

      {/* MongoDB Auth Modal */}
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
    </PageLayout>
  );
}

export function SurveyPage() {
  return (
    <AuthProvider>
      <SurveyProvider>
        <SurveyPageContent />
      </SurveyProvider>
    </AuthProvider>
  );
}
