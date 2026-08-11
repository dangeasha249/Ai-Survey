"use client";

import React from "react";
import { Users, UserCheck, UserX, TrendingUp, GraduationCap, ChevronRight } from "lucide-react";

interface MetricCardsProps {
  totalResponses: number;
  aiUsers: number;
  nonAiUsers: number;
  avgImpactScore: number;
  coursesCount: number;
  onSelectMetric: (metricKey: string) => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  totalResponses,
  aiUsers,
  nonAiUsers,
  avgImpactScore,
  coursesCount,
  onSelectMetric,
}) => {
  const aiPercentage = ((aiUsers / totalResponses) * 100).toFixed(1);
  const nonAiPercentage = ((nonAiUsers / totalResponses) * 100).toFixed(1);

  const cards = [
    {
      id: "total",
      title: "Total Responses",
      value: totalResponses.toString(),
      subtext: "",
      icon: Users,
      bgColor: "bg-[#EFF6FF]",
      borderColor: "border-blue-100",
      iconBg: "bg-blue-600 text-white",
      textColor: "text-blue-900",
      accentColor: "text-blue-600",
    },
    {
      id: "ai_users",
      title: "AI Tools Users",
      value: aiUsers.toString(),
      subtext: `(${aiPercentage}%)`,
      icon: UserCheck,
      bgColor: "bg-[#F0FDF4]",
      borderColor: "border-emerald-100",
      iconBg: "bg-emerald-600 text-white",
      textColor: "text-emerald-950",
      accentColor: "text-emerald-600",
    },
    {
      id: "non_ai_users",
      title: "Non-AI Users",
      value: nonAiUsers.toString(),
      subtext: `(${nonAiPercentage}%)`,
      icon: UserX,
      bgColor: "bg-[#FFFBEB]",
      borderColor: "border-amber-100",
      iconBg: "bg-amber-500 text-white",
      textColor: "text-amber-950",
      accentColor: "text-amber-600",
    },
    {
      id: "impact_score",
      title: "Avg. Overall Impact Score",
      value: `${avgImpactScore.toFixed(2)}`,
      subtext: "/ 5",
      icon: TrendingUp,
      bgColor: "bg-[#F5F3FF]",
      borderColor: "border-purple-100",
      iconBg: "bg-purple-600 text-white",
      textColor: "text-purple-950",
      accentColor: "text-purple-600",
    },
    {
      id: "courses",
      title: "Courses Covered",
      value: coursesCount.toString(),
      subtext: "",
      icon: GraduationCap,
      bgColor: "bg-[#ECFEFF]",
      borderColor: "border-cyan-100",
      iconBg: "bg-cyan-600 text-white",
      textColor: "text-cyan-950",
      accentColor: "text-cyan-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onSelectMetric(card.id)}
            className={`${card.bgColor} ${card.borderColor} border rounded-2xl p-4 sm:p-5 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-600">{card.title}</p>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {card.value}
                  </span>
                  {card.subtext && (
                    <span className="text-xs sm:text-sm font-semibold text-slate-500">
                      {card.subtext}
                    </span>
                  )}
                </div>
              </div>

              <div className={`p-2.5 rounded-xl ${card.iconBg} shadow-sm shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-semibold">
              <span className={`${card.accentColor} group-hover:underline flex items-center gap-1`}>
                View Details
              </span>
              <ChevronRight className={`w-3.5 h-3.5 ${card.accentColor} group-hover:translate-x-0.5 transition-transform`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
