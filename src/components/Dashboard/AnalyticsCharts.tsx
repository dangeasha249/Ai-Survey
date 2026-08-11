import React, { useState, useEffect } from "react";

export const AnalyticsCharts: React.FC = () => {
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);

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
    { label: "Performance", score: 4.28 },
    { label: "Self Learning", score: 4.35 },
  ]);

  const [challengeData, setChallengeData] = useState([
    { name: "Incorrect Information", percentage: 74.2 },
    { name: "Overdependence", percentage: 81.5 },
    { name: "Plagiarism Concern", percentage: 76.9 },
    { name: "Reduced Thinking", percentage: 68.4 },
  ]);

  useEffect(() => {
    async function loadServerCharts() {
      try {
        const res = await fetch("/api/analytics/charts");
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            if (json.data.courseDistribution) {
              const colors = ["#2563EB", "#06B6D4", "#F59E0B", "#8B5CF6", "#EC4899", "#94A3B8"];
              setCourseData(
                json.data.courseDistribution.map((item: any, idx: number) => ({
                  name: item.name,
                  percentage: item.percentage,
                  color: colors[idx % colors.length],
                }))
              );
            }
            if (json.data.toolDistribution) {
              setToolData(json.data.toolDistribution);
            }
          }
        }
      } catch {
        // Fallback
      }
    }
    loadServerCharts();
  }, []);

  // Calculate SVG Pie/Donut Chart slices
  let accumulatedPercent = 0;
  const radius = 65;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* ---------------- CARD 1: RESPONSES BY COURSE ---------------- */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
        <h3 className="text-base font-bold text-slate-800 pb-4 border-b border-slate-100">
          Responses by Course
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-auto py-4">
          
          {/* Donut Visual */}
          <div className="sm:col-span-6 flex justify-center items-center relative">
            <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 160 160">
              {courseData.map((item) => {
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
                    strokeWidth={isHovered ? 26 : 22}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredCourse(item.name)}
                    onMouseLeave={() => setHoveredCourse(null)}
                  />
                );
              })}
            </svg>

            {/* Inner Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-semibold text-slate-500">Total</span>
              <span className="text-xl font-extrabold text-slate-800">100%</span>
            </div>
          </div>

          {/* Legend */}
          <div className="sm:col-span-6 space-y-2.5">
            {courseData.map((item) => (
              <div
                key={item.name}
                className={`flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer ${
                  hoveredCourse === item.name ? "bg-slate-50 font-bold" : ""
                }`}
                onMouseEnter={() => setHoveredCourse(item.name)}
                onMouseLeave={() => setHoveredCourse(null)}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-medium text-slate-700">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-800">{item.percentage}%</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ---------------- CARD 2: AI TOOL USAGE ---------------- */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
        <h3 className="text-base font-bold text-slate-800 pb-4 border-b border-slate-100">
          AI Tool Usage
        </h3>

        <div className="space-y-3 my-auto py-2">
          {toolData.map((tool) => (
            <div key={tool.name} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">{tool.name}</span>
                <span className="font-bold text-slate-900">{tool.percentage}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${tool.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- CARD 3: IMPACT ON LEARNING ---------------- */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-800">
            Impact on Learning <span className="text-xs font-normal text-slate-500">(Average Score)</span>
          </h3>
        </div>

        <div className="py-4">
          <div className="flex items-end justify-between gap-2 h-48 pt-6 pb-2 px-2 border-b border-slate-200 relative">
            
            {/* Y-Axis Grid Lines */}
            {[5, 4, 3, 2, 1].map((scale) => (
              <div
                key={scale}
                className="absolute left-0 right-0 flex items-center gap-2 pointer-events-none"
                style={{ bottom: `${((scale - 1) / 4) * 100}%` }}
              >
                <span className="text-[10px] font-semibold text-slate-400 w-3">{scale}</span>
                <div className="w-full border-t border-slate-100" />
              </div>
            ))}

            {/* Bars */}
            {impactData.map((item) => {
              const heightPercent = ((item.score - 1) / 4) * 100;
              return (
                <div key={item.label} className="flex-1 flex flex-col items-center gap-2 z-10 group">
                  <span className="text-xs font-bold text-blue-600 group-hover:scale-110 transition-transform">
                    {item.score}
                  </span>
                  <div className="w-full max-w-[36px] bg-slate-100 rounded-t-lg h-36 flex items-end">
                    <div
                      className="w-full bg-blue-500 hover:bg-blue-600 rounded-t-lg transition-all duration-500"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-Axis Labels */}
          <div className="grid grid-cols-5 gap-1 pt-2 text-center">
            {impactData.map((item) => (
              <span key={item.label} className="text-[10px] sm:text-xs font-semibold text-slate-600 leading-tight">
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- CARD 4: CHALLENGES (TOP 5) ---------------- */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
        <h3 className="text-base font-bold text-slate-800 pb-4 border-b border-slate-100">
          Challenges <span className="text-xs font-normal text-slate-500">(Top 5)</span>
        </h3>

        <div className="space-y-4 my-auto py-2">
          {challengeData.map((item) => (
            <div key={item.name} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">{item.name}</span>
                <span className="font-bold text-red-600">{item.percentage}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-red-400 hover:bg-red-500 h-3 rounded-full transition-all duration-700 ease-out"
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
