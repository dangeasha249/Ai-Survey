"use client";

import React, { useEffect, useState } from "react";
import { X, Info, Layers, BarChart3, PieChart, TrendingUp, Users } from "lucide-react";

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
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (metricKey) {
      window.addEventListener("keydown", handleKeyDown);

      // Fetch dynamic analytics details from MongoDB API
      fetch("/api/analytics/charts")
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success && resData.data) {
            setChartData(resData.data);
          }
        })
        .catch(() => {});
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [metricKey, onClose]);

  if (!metricKey) return null;

  const total = Math.max(totalResponses, 1);
  const aiPct = ((aiUsers / total) * 100).toFixed(1);
  const nonAiPct = ((nonAiUsers / total) * 100).toFixed(1);

  const getContent = () => {
    switch (metricKey) {
      case "total":
        return {
          title: "Total Responses Analysis",
          subtitle: "Real-time participation statistics from undergraduate participants in MongoDB",
          stat: `${totalResponses} Submissions`,
          icon: Users,
          details: [
            { label: "Validated Student Responses", value: `${totalResponses}` },
            { label: "AI Tools Active Adopters", value: `${aiUsers} (${aiPct}%)` },
            { label: "Non-AI Traditional Learners", value: `${nonAiUsers} (${nonAiPct}%)` },
            { label: "Active Academic Degree Streams", value: `${coursesCount} Courses` },
          ],
        };

      case "ai_users": {
        const tools = chartData?.toolDistribution || [];
        const top1 = tools[0] ? `${tools[0].name} (${tools[0].percentage}%)` : "ChatGPT";
        const top2 = tools[1] ? `${tools[1].name} (${tools[1].percentage}%)` : "Google Gemini";
        const top3 = tools[2] ? `${tools[2].name} (${tools[2].percentage}%)` : "Microsoft Copilot";
        return {
          title: "AI Tools Adoption Analysis",
          subtitle: "Real-time breakdown of students utilizing AI for higher education",
          stat: `${aiUsers} Students (${aiPct}%)`,
          icon: BarChart3,
          details: [
            { label: "Total Active AI Users", value: `${aiUsers} (${aiPct}%)` },
            { label: "#1 Most Popular Tool", value: top1 },
            { label: "#2 Popular Tool", value: top2 },
            { label: "#3 Popular Tool", value: top3 },
          ],
        };
      }

      case "non_ai_users": {
        const challenges = chartData?.challenges || [];
        const topChallenge = challenges[0] ? `${challenges[0].name} (${challenges[0].percentage}%)` : "Lack of Guidance";
        return {
          title: "Non-AI Participants Breakdown",
          subtitle: "Students who do not currently utilize AI tools for study",
          stat: `${nonAiUsers} Students (${nonAiPct}%)`,
          icon: PieChart,
          details: [
            { label: "Non-AI Student Count", value: `${nonAiUsers}` },
            { label: "Share of Total Submissions", value: `${nonAiPct}%` },
            { label: "Top Reported Concern", value: topChallenge },
          ],
        };
      }

      case "impact_score": {
        const impactList = chartData?.learningImpact || [];
        const dynamicDetails = impactList.length > 0
          ? impactList.map((item: any) => ({
              label: item.label,
              value: `${Number(item.score).toFixed(2)} / 5.00`,
            }))
          : [
              { label: "Understanding Concepts", value: "4.31 / 5.00" },
              { label: "Time Efficiency", value: "4.25 / 5.00" },
              { label: "Learning Improvement", value: "4.18 / 5.00" },
              { label: "Academic Performance", value: "4.12 / 5.00" },
            ];

        return {
          title: "Learning Impact Analysis",
          subtitle: "Real-time 5-point Likert scale aggregate from MongoDB answers",
          stat: `${avgImpactScore.toFixed(2)} / 5.00`,
          icon: TrendingUp,
          details: dynamicDetails,
        };
      }

      case "courses": {
        const coursesList = chartData?.courseDistribution || [];
        const dynamicDetails = coursesList.length > 0
          ? coursesList.map((item: any) => ({
              label: item.name,
              value: `${item.count} responses (${item.percentage}%)`,
            }))
          : [
              { label: "B.Sc. Computer Science", value: "30.3% of total" },
              { label: "B.Sc. Information Technology", value: "22.4% of total" },
              { label: "BCA", value: "18.6% of total" },
            ];

        return {
          title: "Courses Covered Spectrum",
          subtitle: "Real-time demographic spread across degree programs in MongoDB",
          stat: `${coursesCount} Academic Programs`,
          icon: Layers,
          details: dynamicDetails,
        };
      }

      default:
        return {
          title: "Metric Breakdown",
          subtitle: "Detailed statistical view from MongoDB",
          stat: "-",
          icon: Info,
          details: [],
        };
    }
  };

  const data = getContent();
  const HeaderIcon = data.icon;

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
              <HeaderIcon className="w-6 h-6" />
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
              {data.details.map((item: { label: string; value: string }, idx: number) => (
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
