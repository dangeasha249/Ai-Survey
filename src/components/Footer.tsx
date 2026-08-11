"use client";

import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B192C] text-white py-6 sm:py-8 border-t border-slate-800">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-center text-center">
          <div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
              Impact of Artificial Intelligence Tools on Teaching and Learning in Higher Education
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
