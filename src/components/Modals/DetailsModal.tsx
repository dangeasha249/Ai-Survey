"use client";

import React, { useEffect } from "react";
import { X, Info, Download, Filter } from "lucide-react";

interface DetailsModalProps {
  metricKey: string | null;
  onClose: () => void;
  totalResponses: number;
  aiUsers: number;
  nonAiUsers: number;
  avgImpactScore: number;
  coursesCount: number;
}

export const DetailsModal: React.FC<DetailsModalProps> = ({
  metricKey,
  onClose,
  totalResponses,
  aiUsers,
  nonAiUsers,
  avgImpactScore,
  coursesCount,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (metricKey) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [metricKey, onClose]);

  if (!metricKey) return null;

  const getContent = () => {
    switch (metricKey) {
      case "total":
        return {
          title: "Total Responses Breakdown",
          subtitle: "Complete participation statistics from undergraduate institutes",
          stat: totalResponses,
          details: [
            { label: "Validated Submissions", value: `${totalResponses}` },
            { label: "Completion Rate", value: "98.4%" },
            { label: "Avg Time to Complete", value: "11 mins 42 secs" },
            { label: "Active Institutions", value: "14 Colleges across Maharashtra" },
          ],
        };
      case "ai_users":
        return {
          title: "AI Tools Users Analysis",
          subtitle: "Students who report using AI tools at least weekly",
          stat: `${aiUsers} (${((aiUsers / totalResponses) * 100).toFixed(1)}%)`,
          details: [
            { label: "Daily Active Users", value: "64.2%" },
            { label: "Weekly Active Users", value: "35.8%" },
            { label: "Most Popular Tool", value: "ChatGPT (82%)" },
            { label: "Primary Use Case", value: "Concept Clarification & Homework Help" },
          ],
        };
      case "non_ai_users":
        return {
          title: "Non-AI Users Breakdown",
          subtitle: "Students who do not currently utilize AI tools for study",
          stat: `${nonAiUsers} (${((nonAiUsers / totalResponses) * 100).toFixed(1)}%)`,
          details: [
            { label: "Primary Reason", value: "Lack of Awareness / Familiarity (52%)" },
            { label: "Secondary Reason", value: "Preference for Traditional Books (31%)" },
            { label: "Willingness to Learn", value: "78% interested in introductory workshops" },
          ],
        };
      case "impact_score":
        return {
          title: "Average Impact Score Analysis",
          subtitle: "Standardized 5-point Likert scale aggregate",
          stat: `${avgImpactScore.toFixed(2)} / 5.00`,
          details: [
            { label: "Understanding Concepts", value: "4.31 / 5" },
            { label: "Time Efficiency", value: "4.25 / 5" },
            { label: "Learning Improvement", value: "4.18 / 5" },
            { label: "Academic Performance", value: "4.12 / 5" },
          ],
        };
      case "courses":
        return {
          title: "Courses Covered Spectrum",
          subtitle: "Demographic spread across degree streams",
          stat: `${coursesCount} Academic Programs`,
          details: [
            { label: "B.Sc. Computer Science", value: "30.3% of total" },
            { label: "B.Sc. Information Technology", value: "22.4% of total" },
            { label: "Bachelor of Computer Applications", value: "18.6% of total" },
            { label: "Bachelor of Commerce", value: "12.8% of total" },
            { label: "Bachelor of Arts", value: "10.3% of total" },
          ],
        };
      default:
        return {
          title: "Metric Breakdown",
          subtitle: "Detailed statistical view",
          stat: "-",
          details: [],
        };
    }
  };

  const data = getContent();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[94dvh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-100 text-blue-600">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">{data.title}</h3>
              <p className="text-xs text-slate-500">{data.subtitle}</p>
            </div>
          </div>

          {/* Key Highlight Metric */}
          <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Metric Value</span>
            <p className="text-3xl font-extrabold text-blue-900 mt-1">{data.stat}</p>
          </div>

          {/* Table Breakdown */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Detailed Data Points</h4>
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 divide-y divide-slate-200/60">
              {data.details.map((item, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center text-xs sm:text-sm">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <span className="font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
            >
              Close Details
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
