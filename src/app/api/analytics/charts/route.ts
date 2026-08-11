import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import SurveyResponseModel from "@/models/SurveyResponse";

export async function GET() {
  try {
    await connectToDatabase();
    const responses = await SurveyResponseModel.find().lean();

    const total = Math.max(responses.length, 1);
    const courseMap: Record<string, number> = {};

    responses.forEach((r) => {
      const c = r.course || "Other";
      courseMap[c] = (courseMap[c] || 0) + 1;
    });

    const totalCourseSum = Object.values(courseMap).reduce((a, b) => a + b, 0);
    const courseDistribution = Object.entries(courseMap).map(([name, count]) => ({
      name,
      count,
      percentage: Number(((count / totalCourseSum) * 100).toFixed(1)),
    }));

    const toolMap: Record<string, number> = {};

    responses.forEach((r) => {
      const tool = r.primaryTool || "ChatGPT";
      if (tool !== "None") {
        toolMap[tool] = (toolMap[tool] || 0) + 1;
      }
    });

    const toolDistribution = Object.entries(toolMap).map(([name, users]) => ({
      name,
      users,
      percentage: Number(((users / total) * 100).toFixed(1)),
    }));

    return NextResponse.json({
      success: true,
      data: {
        courseDistribution,
        toolDistribution,
        learningImpact: [],
        challenges: [],
      },
    });
  } catch (error: any) {
    console.error("Charts API error:", error);
    return NextResponse.json({
      success: false,
      message: "Analytics are temporarily unavailable.",
    }, { status: 503 });
  }
}
