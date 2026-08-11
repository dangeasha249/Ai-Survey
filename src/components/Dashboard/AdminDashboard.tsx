import React, { useState } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { MetricCards } from "./MetricCards";
import { AnalyticsCharts } from "./AnalyticsCharts";
import { useSurvey } from "@/context/SurveyContext";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert } from "lucide-react";

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
}) => {
  const contextData = useSurvey();
  const { user } = useAuth();
  const totalResponses = contextData.totalResponses;
  const aiUsers = contextData.aiUsers;
  const nonAiUsers = contextData.nonAiUsers;
  const avgImpactScore = contextData.avgImpactScore;
  const coursesCount = contextData.coursesCount;

  const [dateRange, setDateRange] = useState("01 May 2024 - 31 May 2024");
  const [showAccessDeniedMsg, setShowAccessDeniedMsg] = useState(false);

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-6">
      
      {/* Welcome Header */}
      <DashboardHeader
        dateRange={dateRange}
        setDateRange={setDateRange}
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

      {/* Main Analytics View */}
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

    </section>
  );
};
