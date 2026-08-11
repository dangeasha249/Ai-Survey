"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface SurveyResponseItem {
  id: string;
  course: string;
  usesAI: string;
  primaryTool: string;
  impactRating: number;
  timestamp: string;
}

interface SurveyContextType {
  totalResponses: number;
  aiUsers: number;
  nonAiUsers: number;
  avgImpactScore: number;
  coursesCount: number;
  responses: SurveyResponseItem[];
  addSurveyResponse: (response: Omit<SurveyResponseItem, "id" | "timestamp"> & Record<string, unknown>) => Promise<boolean>;
}

const defaultContextValue: SurveyContextType = {
  totalResponses: 0,
  aiUsers: 0,
  nonAiUsers: 0,
  avgImpactScore: 0,
  coursesCount: 0,
  responses: [],
  addSurveyResponse: async () => false,
};

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [totalResponses, setTotalResponses] = useState(0);
  const [aiUsers, setAiUsers] = useState(0);
  const [nonAiUsers, setNonAiUsers] = useState(0);
  const [avgImpactScore, setAvgImpactScore] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [responses, setResponses] = useState<SurveyResponseItem[]>([]);

  // Load from MongoDB backend API
  const fetchLatestSurveyData = async () => {
    try {
      const res = await fetch("/api/survey");
      if (res.ok) {
        const data = await res.json();
        if (data.responses) {
          setResponses(data.responses);
          setTotalResponses(data.totalResponses);
          setAiUsers(data.aiUsers);
          setNonAiUsers(data.nonAiUsers);
          setAvgImpactScore(data.avgImpactScore);
          setCoursesCount(data.coursesCount);
        }
      }
    } catch {
      // Ignore API fetch error, fallback to initial state
    }
  };

  useEffect(() => {
    fetchLatestSurveyData();
  }, []);

  const addSurveyResponse = async (newRes: Omit<SurveyResponseItem, "id" | "timestamp"> & Record<string, unknown>) => {
    setTotalResponses((prev) => prev + 1);
    if (newRes.usesAI === "Yes") {
      setAiUsers((prev) => prev + 1);
    } else {
      setNonAiUsers((prev) => prev + 1);
    }

    setAvgImpactScore((prev) => {
      const newScore = (prev * totalResponses + newRes.impactRating) / (totalResponses + 1);
      return Number(newScore.toFixed(2));
    });

    const formattedItem: SurveyResponseItem = {
      ...newRes,
      id: `RES-0${totalResponses + 1}`,
      timestamp: "Just Now",
    };

    setResponses((prev) => [formattedItem, ...prev]);

    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRes),
      });
      if (!response.ok) throw new Error("Survey submission failed");
      fetchLatestSurveyData();
      return true;
    } catch {
      setResponses((prev) => prev.filter((item) => item.id !== formattedItem.id));
      setTotalResponses((prev) => Math.max(0, prev - 1));
      if (newRes.usesAI === "Yes") setAiUsers((prev) => Math.max(0, prev - 1));
      else setNonAiUsers((prev) => Math.max(0, prev - 1));
      return false;
    }
  };

  return (
    <SurveyContext.Provider
      value={{
        totalResponses,
        aiUsers,
        nonAiUsers,
        avgImpactScore,
        coursesCount,
        responses,
        addSurveyResponse,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    return defaultContextValue;
  }
  return context;
};
