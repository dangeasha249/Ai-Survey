import React, { useState } from "react";
import { Calendar, ChevronDown, BarChart2, Table, ShieldCheck, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface DashboardHeaderProps {
  dateRange: string;
  setDateRange: (range: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  dateRange,
  setDateRange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const dateOptions = [
    "01 May 2024 - 31 May 2024",
    "Last 7 Days",
    "Last 30 Days",
    "Academic Year 2023-2024",
    "All Time Data",
  ];

  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
      
      {/* Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Research Analytics & Insights
          </h2>
          {user && (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 ${
              user?.role === "Researcher"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}>
              {user?.role === "Researcher" ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
              <span>{user?.role === "Researcher" ? "Researcher Admin" : "Student Mode"}</span>
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
          AI-Edu Impact Survey • Real-time Academic Data
        </p>
      </div>

      {/* Right Controls: Date Filter Dropdown */}
      <div className="flex items-center gap-3">
        {/* Date Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full sm:w-auto flex items-center justify-between gap-2 bg-white border border-slate-200 hover:border-slate-300 px-3.5 py-2 min-h-10 rounded-xl shadow-sm text-xs font-semibold text-slate-700 hover:text-slate-900 transition-all duration-200"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>{dateRange}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {isOpen && (
            <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
              {dateOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setDateRange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                    dateRange === option
                      ? "bg-blue-50 text-blue-600 font-bold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
