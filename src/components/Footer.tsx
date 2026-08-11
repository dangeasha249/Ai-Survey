"use client";

import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B192C] text-white py-6 sm:py-8 border-t border-slate-800">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          
          {/* Left Title */}
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">
              AI-Edu Impact Survey
            </h3>
          </div>

          {/* Center Tagline */}
          <div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
              Impact of Artificial Intelligence Tools on Teaching and Learning in Higher Education
            </p>
          </div>

          {/* Right Copyright */}
          <div>
            <p className="text-xs text-slate-400 font-medium">
              © 2024 All Rights Reserved
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};
