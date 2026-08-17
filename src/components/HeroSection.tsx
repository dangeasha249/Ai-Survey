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
  Database,
  GraduationCap,
  ChevronRight,
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
          <div className="lg:col-span-6 space-y-5 sm:space-y-6 relative">
            
            {/* Ambient Watermark Background Image behind text */}
            <div className="absolute -inset-6 -z-10 opacity-15 pointer-events-none flex items-center justify-center overflow-hidden">
              <Image
                src="/images/landing-page.png"
                alt="AI Tools in Higher Education Illustration"
                width={600}
                height={400}
                className="w-full h-auto object-contain"
                priority
              />
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                AI Tools in Education:
              </h1>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-600 tracking-tight leading-tight">
                Understanding Their Impact on Teaching
              </h2>
            </div>

            <p className="text-xs sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-medium">
              This study aims to analyze the impact of Artificial Intelligence tools
              on teaching effectiveness and student learning outcomes in higher education.
            </p>

            {/* Trust Badges (Parallel Single Row Grid on Mobile View) */}
            <div className="grid grid-cols-3 gap-1 sm:flex sm:flex-wrap sm:gap-2.5 pt-1 text-[9px] min-[370px]:text-[10px] sm:text-xs font-semibold text-blue-900">
              <div className="flex items-center justify-center gap-1 bg-blue-100/70 px-1 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-blue-200/80 text-center whitespace-nowrap">
                <CheckCircle2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-blue-600 shrink-0" />
                <span>100% Confidential</span>
              </div>
              <div className="flex items-center justify-center gap-1 bg-blue-100/70 px-1 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-blue-200/80 text-center whitespace-nowrap">
                <Lock className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-blue-600 shrink-0" />
                <span>Secure Data</span>
              </div>
              <div className="flex items-center justify-center gap-1 bg-blue-100/70 px-1 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-blue-200/80 text-center whitespace-nowrap">
                <UserCheck className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">Academic Only</span>
              </div>
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

          </div>

          {/* Right Column Floating Interactive Survey Form Card */}
          <div className="lg:col-span-6 flex justify-center items-center relative">

            {/* Floating Survey Form Card */}
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-blue-100/90 relative overflow-hidden animate-fade-in space-y-4">

              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                      Faculty AI Impact Questionnaire
                    </h3>
                    <p className="text-xs font-medium text-slate-500">
                      21 Questions • 5 Sections
                    </p>
                  </div>
                </div>


              </div>

              {/* Quick Dropdown Form Fields */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>SECTION A – STAFF PROFILE</span>
                  <span className="text-blue-600 font-extrabold">Step 1 of 5</span>
                </div>

                {/* Field 1: Age Group */}
                <div className="space-y-1 text-left">
                  <label className="block text-xs font-bold text-slate-700">
                    1. What is your age group? *
                  </label>
                  <select
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onStartSurvey();
                    }}
                    onClick={onStartSurvey}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer hover:border-blue-300 transition"
                  >
                    <option>-- Select Age Group --</option>
                    <option>Below 30</option>
                    <option>31–40</option>
                    <option>41–50</option>
                    <option>Above 50</option>
                  </select>
                </div>

                {/* Field 2: Teaching Experience */}
                <div className="space-y-1 text-left">
                  <label className="block text-xs font-bold text-slate-700">
                    2. What is your teaching experience? *
                  </label>
                  <select
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onStartSurvey();
                    }}
                    onClick={onStartSurvey}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer hover:border-blue-300 transition"
                  >
                    <option>-- Select Teaching Experience --</option>
                    <option>Below 5 Years</option>
                    <option>5–10 Years</option>
                    <option>11–15 Years</option>
                    <option>16–20 Years</option>
                    <option>Above 20 Years</option>
                  </select>
                </div>

                {/* Field 3: Highest Qualification */}
                <div className="space-y-1 text-left">
                  <label className="block text-xs font-bold text-slate-700">
                    3. Highest Educational Qualification *
                  </label>
                  <select
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onStartSurvey();
                    }}
                    onClick={onStartSurvey}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer hover:border-blue-300 transition"
                  >
                    <option>-- Select Qualification --</option>
                    <option>Master’s Degree</option>
                    <option>M.Phil.</option>
                    <option>Ph.D.</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onStartSurvey}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <FileEdit className="w-4 h-4" />
                <span>Open 21-Question Survey Form</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-slate-400 font-medium pt-1">
                100% Confidential • Academic Research Study
              </p>

            </div>

          </div>

        </div>

        {/* Key Information Bar (Parallel 2-Column Grid on Mobile View) */}
        <div className="mt-6 sm:mt-14 w-full border-t border-slate-200/60 pt-4 sm:pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">

            {/* Target Group */}
            <div className="flex items-center gap-2 sm:gap-3.5 bg-blue-50/50 sm:bg-transparent p-2.5 sm:p-0 rounded-2xl border border-blue-100/60 sm:border-0">
              <div className="flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-100/80 text-blue-600 shrink-0">
                <Users className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-blue-600 uppercase tracking-wide truncate">Target Group</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">Teaching Staff / Faculty</p>
              </div>
            </div>

            {/* Study Area */}
            <div className="flex items-center gap-2 sm:gap-3.5 bg-blue-50/50 sm:bg-transparent p-2.5 sm:p-0 rounded-2xl border border-blue-100/60 sm:border-0">
              <div className="flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-100/80 text-blue-600 shrink-0">
                <MapPin className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-blue-600 uppercase tracking-wide truncate">Study Area</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">Maharashtra, India</p>
              </div>
            </div>

            {/* Survey Duration */}
            <div className="flex items-center gap-2 sm:gap-3.5 bg-blue-50/50 sm:bg-transparent p-2.5 sm:p-0 rounded-2xl border border-blue-100/60 sm:border-0">
              <div className="flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-100/80 text-blue-600 shrink-0">
                <ClipboardList className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-blue-600 uppercase tracking-wide truncate">Duration</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">10-15 Minutes</p>
              </div>
            </div>

            {/* Purpose */}
            <div className="flex items-center gap-2 sm:gap-3.5 bg-blue-50/50 sm:bg-transparent p-2.5 sm:p-0 rounded-2xl border border-blue-100/60 sm:border-0">
              <div className="flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-100/80 text-blue-600 shrink-0">
                <Database className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-blue-600 uppercase tracking-wide truncate">Purpose</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">Academic Research</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
