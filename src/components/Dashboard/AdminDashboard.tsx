import React, { useState } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { MetricCards } from "./MetricCards";
import { AnalyticsCharts } from "./AnalyticsCharts";
import { useSurvey } from "@/context/SurveyContext";
import { useAuth } from "@/context/AuthContext";
import { Download, Lock, ShieldAlert } from "lucide-react";

interface AdminDashboardProps {
  totalResponses?: number;
  aiUsers?: number;
  nonAiUsers?: number;
  avgImpactScore?: number;
  coursesCount?: number;
  onSelectMetric: (metricKey: string) => void;
  onOpenLogin?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSelectMetric,
  onOpenLogin,
}) => {
  const contextData = useSurvey();
  const { user } = useAuth();
  const totalResponses = contextData.totalResponses;
  const aiUsers = contextData.aiUsers;
  const nonAiUsers = contextData.nonAiUsers;
  const avgImpactScore = contextData.avgImpactScore;
  const coursesCount = contextData.coursesCount;
  const responses = contextData.responses;

  const [activeTab, setActiveTab] = useState("dashboard");
  const [dateRange, setDateRange] = useState("01 May 2024 - 31 May 2024");
  const [showAccessDeniedMsg, setShowAccessDeniedMsg] = useState(false);

  const isResearcher = user?.role === "Researcher";

  const handleCsvDownload = () => {
    if (!isResearcher) {
      setShowAccessDeniedMsg(true);
      return;
    }
    window.location.href = "/api/survey/export";
  };

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-6">
      
      {/* Welcome Header */}
      <DashboardHeader
        dateRange={dateRange}
        setDateRange={setDateRange}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Access Denied Warning Toast/Banner */}
      {showAccessDeniedMsg && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs sm:text-sm text-amber-900 font-semibold flex items-center justify-between animate-fade-in shadow-sm">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              <strong>Access Restricted:</strong> Raw CSV Dataset exports are available exclusively to verified Academic Researchers. Log in with a Researcher account to download raw data.
            </span>
          </div>
          <button
            onClick={() => setShowAccessDeniedMsg(false)}
            className="px-3 py-1 bg-amber-200/60 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold transition"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Render selected view */}
      {activeTab === "dashboard" && (
        <div className="space-y-6 animate-fade-in">
          {/* 5 Metric Cards */}
          <MetricCards
            totalResponses={totalResponses}
            aiUsers={aiUsers}
            nonAiUsers={nonAiUsers}
            avgImpactScore={avgImpactScore}
            coursesCount={coursesCount}
            onSelectMetric={onSelectMetric}
          />

          {/* 4 Interactive Charts Grid */}
          <AnalyticsCharts />
        </div>
      )}

      {/* Live Responses Raw Data View */}
      {activeTab === "responses" && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                {isResearcher ? "Raw Survey Submissions" : "Public Anonymized Survey Submissions"} ({responses.length})
              </h3>
              <p className="text-xs text-slate-500">
                {isResearcher ? "Researcher View • Real-time database records" : "Public view • anonymized records"}
              </p>
            </div>
            
            <button
              onClick={handleCsvDownload}
              className={`px-4 py-2 rounded-xl font-semibold text-xs shadow-sm flex items-center gap-2 transition ${
                !isResearcher
                  ? "bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {!isResearcher ? <Lock className="w-4 h-4 text-slate-400" /> : <Download className="w-4 h-4" />}
              <span>{!isResearcher ? "Dataset Download Restricted" : "Download CSV Dataset"}</span>
            </button>
          </div>

          <div className="overflow-x-auto -mx-2 px-2 pb-2">
            <table className="w-full min-w-[640px] text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
                <tr>
                  <th className="p-3 rounded-l-lg">ID</th>
                  <th className="p-3">Course</th>
                  <th className="p-3">Uses AI?</th>
                  <th className="p-3">Primary Tool</th>
                  <th className="p-3">Impact Rating</th>
                  <th className="p-3 rounded-r-lg">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {responses.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-bold text-blue-900">{row.id}</td>
                    <td className="p-3 font-semibold">{row.course}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${row.usesAI === "Yes" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {row.usesAI}
                      </span>
                    </td>
                    <td className="p-3">{row.primaryTool}</td>
                    <td className="p-3 font-bold text-emerald-600">{row.impactRating} / 5 ⭐</td>
                    <td className="p-3 text-slate-500 text-xs">{row.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab !== "dashboard" && activeTab !== "responses" && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4">
          <h3 className="text-xl font-bold text-slate-800 capitalize">{activeTab.replace("_", " ")} Workspace</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Configured filters for timeframe: <strong className="text-blue-600">{dateRange}</strong>.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => setActiveTab("dashboard")}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-xs shadow-md hover:bg-blue-700 transition"
            >
              Return to Main Dashboard Overview
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
