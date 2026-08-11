"use client";

import React from "react";
import Image from "next/image";
import { 
  FileEdit, 
  Info, 
  CheckCircle2, 
  Lock, 
  UserCheck, 
  Users, 
  MapPin, 
  ClipboardList, 
  Database 
} from "lucide-react";

interface HeroSectionProps {
  onStartSurvey: () => void;
  onLearnMore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartSurvey,
  onLearnMore,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-blue-50/40 to-slate-50 pt-8 sm:pt-10 pb-10 sm:pb-16">
      
      {/* Background Decorative SVG Waves */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" viewBox="0 0 1440 600" fill="none">
          <path
            d="M0,128L60,149.3C120,171,240,213,360,218.7C480,224,600,192,720,181.3C840,171,960,181,1080,197.3C1200,213,1320,235,1380,245.3L1440,256L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            fill="url(#gradient-wave)"
          />
          <defs>
            <linearGradient id="gradient-wave" x1="0" y1="0" x2="1440" y2="600">
              <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column Text Content */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                AI Tools in Education:
              </h1>
              <h2 className="text-xl sm:text-4xl lg:text-5xl font-extrabold text-blue-600 tracking-tight leading-tight">
                Understanding Their Impact on Teaching and Learning
              </h2>
            </div>

            <p className="text-xs sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              This study aims to analyze the impact of Artificial Intelligence tools
              on teaching effectiveness and student learning outcomes in higher education.
            </p>

            {/* Mobile View Image (Appears Above Buttons on Mobile) */}
            <div className="block lg:hidden py-2 flex justify-center">
              <Image
                src="/images/landing-page.png"
                alt="AI Tools in Education Illustration"
                width={400}
                height={320}
                className="w-full max-w-xs sm:max-w-md h-auto object-contain"
                priority
              />
            </div>

            {/* Action Buttons (Parallel & Smaller on Mobile View) */}
            <div className="flex flex-row items-center gap-2.5 sm:gap-4 pt-1 sm:pt-2">
              <button
                onClick={onStartSurvey}
                className="flex-1 sm:flex-none justify-center px-4 sm:px-7 py-2.5 sm:py-3.5 text-xs sm:text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/25 transition-all duration-200 active:scale-95 flex items-center gap-1.5 sm:gap-2.5 whitespace-nowrap"
              >
                <FileEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Start Survey</span>
              </button>

              <button
                onClick={onLearnMore}
                className="flex-1 sm:flex-none justify-center px-4 sm:px-7 py-2.5 sm:py-3.5 text-xs sm:text-base font-semibold text-blue-600 border border-blue-600 sm:border-2 rounded-xl hover:bg-blue-50 transition-all duration-200 active:scale-95 flex items-center gap-1.5 sm:gap-2.5 whitespace-nowrap"
              >
                <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Learn More</span>
              </button>
            </div>

            {/* Trust Badges (Compact Small Size) */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-2 text-[11px] font-semibold text-blue-900">
              <div className="flex items-center gap-1.5 bg-blue-100/70 px-2.5 py-1 rounded-full border border-blue-200/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>100% Confidential</span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-100/70 px-2.5 py-1 rounded-full border border-blue-200/80">
                <Lock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Secure Data</span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-100/70 px-2.5 py-1 rounded-full border border-blue-200/80">
                <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>For Academic Research Only</span>
              </div>
            </div>

          </div>

          {/* Right Column Graphic / Artwork (Desktop Only) */}
          <div className="hidden lg:flex lg:col-span-6 justify-center items-center">
            <Image
              src="/images/landing-page.png"
              alt="AI Tools in Education Illustration"
              width={600}
              height={480}
              className="w-full max-w-lg lg:max-w-none h-auto object-contain"
              priority
            />
          </div>

        </div>

        {/* Key Information Bar */}
        <div className="mt-10 sm:mt-14 w-full border-t border-slate-200/60 pt-6 sm:pt-8">
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Target Group */}
            <div className="flex items-center gap-3.5">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100/80 text-blue-600 shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Target Group</p>
                <p className="text-sm font-bold text-slate-800">Undergraduate Students</p>
              </div>
            </div>

            {/* Study Area */}
            <div className="flex items-center gap-3.5">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100/80 text-blue-600 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Study Area</p>
                <p className="text-sm font-bold text-slate-800">Maharashtra, India</p>
              </div>
            </div>

            {/* Survey Duration */}
            <div className="flex items-center gap-3.5">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100/80 text-blue-600 shrink-0">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Survey Duration</p>
                <p className="text-sm font-bold text-slate-800">10-15 Minutes</p>
              </div>
            </div>

            {/* Purpose */}
            <div className="flex items-center gap-3.5">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100/80 text-blue-600 shrink-0">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Purpose</p>
                <p className="text-sm font-bold text-slate-800">Academic Research</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
