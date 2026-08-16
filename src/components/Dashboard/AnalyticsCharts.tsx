import React, { useState, useEffect } from "react";
import { useSurvey } from "@/context/SurveyContext";

export const AnalyticsCharts: React.FC = () => {
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const { totalResponses } = useSurvey();

  // Dynamic Chart States
  const [courseData, setCourseData] = useState([
    { name: "B.Sc. CS", percentage: 30.3, color: "#2563EB" },
    { name: "B.Sc. IT", percentage: 22.4, color: "#06B6D4" },
    { name: "BCA", percentage: 18.6, color: "#F59E0B" },
    { name: "B.Com", percentage: 12.8, color: "#8B5CF6" },
    { name: "B.A.", percentage: 10.3, color: "#EC4899" },
    { name: "Others", percentage: 5.6, color: "#94A3B8" },
  ]);

  const [toolData, setToolData] = useState([
    { name: "ChatGPT", percentage: 82 },
    { name: "Google Gemini", percentage: 61 },
    { name: "Microsoft Copilot", percentage: 38 },
    { name: "Grammarly", percentage: 34 },
    { name: "QuillBot", percentage: 28 },
    { name: "Perplexity", percentage: 17 },
  ]);

  const [impactData, setImpactData] = useState([
    { label: "Understand Concepts", score: 4.45 },
    { label: "Save Time", score: 4.62 },
    { label: "Improve Learning", score: 4.38 },
    { label: "Problem Solving", score: 4.28 },
    { label: "Academic Performance", score: 4.35 },
  ]);

  const [challengeData, setChallengeData] = useState([
    { name: "Incorrect Information", percentage: 74.2 },
    { name: "Overdependence", percentage: 81.5 },
    { name: "Plagiarism Concern", percentage: 76.9 },
    { name: "Reduced Thinking", percentage: 68.4 },
  ]);

  useEffect(() => {
    let isMounted = true;
    async function loadServerCharts() {
      try {
        const res = await fetch("/api/analytics/charts", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.data) {
            if (json.data.courseDistribution && json.data.courseDistribution.length > 0) {
              const colors = ["#2563EB", "#06B6D4", "#F59E0B", "#8B5CF6", "#EC4899", "#94A3B8"];
              setCourseData(
                json.data.courseDistribution.map((item: any, idx: number) => ({
                  name: item.name,
                  percentage: item.percentage,
                  color: colors[idx % colors.length],
                }))
              );
            }
            if (json.data.toolDistribution && json.data.toolDistribution.length > 0) {
              setToolData(json.data.toolDistribution);
            }
            if (json.data.learningImpact && json.data.learningImpact.length > 0) {
              setImpactData(json.data.learningImpact);
            }
            if (json.data.challenges && json.data.challenges.length > 0) {
              setChallengeData(json.data.challenges);
            }
          }
        }
      } catch {
        // Fallback
      }
    }
    loadServerCharts();
    return () => {
      isMounted = false;
    };
  }, [totalResponses]);

  const radius = 65;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      
      {/* ---------------- CARD 1: RESPONSES BY COURSE ---------------- */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col justify-between">
        <h3 className="text-sm font-extrabold text-slate-900 pb-2 border-b border-slate-100">
          Responses by Course
        </h3>

        <div className="flex flex-col items-center gap-3 my-auto py-2">
          
          {/* Donut Visual */}
          <div className="relative flex justify-center items-center">
            <svg className="w-28 h-28 -rotate-90 transform" viewBox="0 0 160 160">
              {(() => {
                let accumulatedPercent = 0;
                return courseData.map((item) => {
                  const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                  accumulatedPercent += item.percentage;
                  
                  const isHovered = hoveredCourse === item.name;

                  return (
                    <circle
                      key={item.name}
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="transparent"
                      stroke={item.color}
                      strokeWidth={isHovered ? 24 : 20}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredCourse(item.name)}
                      onMouseLeave={() => setHoveredCourse(null)}
                    />
                  );
                });
              })()}
            </svg>

            {/* Inner Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[9px] font-semibold text-slate-400">Total</span>
              <span className="text-sm font-extrabold text-slate-900">100%</span>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full grid grid-cols-2 gap-1.5 pt-1">
            {courseData.map((item) => (
              <div
                key={item.name}
                className={`flex items-center justify-between p-1 rounded-md transition-colors cursor-pointer ${
                  hoveredCourse === item.name ? "bg-slate-100 font-bold" : ""
                }`}
                onMouseEnter={() => setHoveredCourse(item.name)}
                onMouseLeave={() => setHoveredCourse(null)}
              >
                <div className="flex items-center gap-1 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[11px] font-medium text-slate-700 truncate">{item.name}</span>
                </div>
                <span className="text-[11px] font-bold text-slate-900 shrink-0">{item.percentage}%</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ---------------- CARD 2: AI TOOL USAGE ---------------- */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col justify-between">
        <h3 className="text-sm font-extrabold text-slate-900 pb-2 border-b border-slate-100">
          AI Tool Usage
        </h3>

        <div className="space-y-2.5 my-auto py-2">
          {toolData.map((tool) => (
            <div key={tool.name} className="space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-semibold text-slate-700">{tool.name}</span>
                <span className="font-bold text-slate-900">{tool.percentage}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${tool.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- CARD 3: IMPACT ON LEARNING ---------------- */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col justify-between">
        <div className="pb-2 border-b border-slate-100">
          <h3 className="text-sm font-extrabold text-slate-900">
            Impact on Learning
          </h3>
          <p className="text-[10px] text-slate-400">Average score (out of 5)</p>
        </div>

        <div className="py-2">
          <div className="flex items-end justify-between gap-1 h-32 pt-3 pb-1 border-b border-slate-200 relative">
            
            {/* Y-Axis Grid Lines */}
            {[5, 4, 3, 2, 1].map((scale) => (
              <div
                key={scale}
                className="absolute left-0 right-0 flex items-center gap-1 pointer-events-none"
                style={{ bottom: `${((scale - 1) / 4) * 100}%` }}
              >
                <span className="text-[8px] font-semibold text-slate-300 w-2.5">{scale}</span>
                <div className="w-full border-t border-slate-100" />
              </div>
            ))}

            {/* Bars */}
            {impactData.map((item) => {
              const heightPercent = ((item.score - 1) / 4) * 100;
              return (
                <div key={item.label} className="flex-1 flex flex-col items-center gap-1 z-10 group">
                  <span className="text-[9px] font-extrabold text-blue-600 group-hover:scale-110 transition-transform">
                    {item.score}
                  </span>
                  <div className="w-full max-w-[20px] bg-slate-100 rounded-t-md h-24 flex items-end">
                    <div
                      className="w-full bg-blue-600 hover:bg-blue-700 rounded-t-md transition-all duration-500"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-Axis Labels */}
          <div className="grid grid-cols-5 gap-1 pt-1.5 text-center">
            {impactData.map((item) => {
              const shortLabel = item.label.replace("Understand Concepts", "Concepts")
                .replace("Save Time", "Time")
                .replace("Improve Learning", "Learning")
                .replace("Problem Solving", "Problem")
                .replace("Academic Performance", "Perf.");
              return (
                <span key={item.label} className="text-[9px] font-semibold text-slate-500 truncate" title={item.label}>
                  {shortLabel}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------------- CARD 4: CHALLENGES (TOP 5) ---------------- */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col justify-between">
        <div className="pb-2 border-b border-slate-100">
          <h3 className="text-sm font-extrabold text-slate-900">
            Challenges Faced
          </h3>
          <p className="text-[10px] text-slate-400">Top reported issues</p>
        </div>

        <div className="space-y-2.5 my-auto py-2">
          {challengeData.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-semibold text-slate-700 truncate max-w-[130px]">{item.name}</span>
                <span className="font-bold text-red-600">{item.percentage}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-red-500 hover:bg-red-600 h-2 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
