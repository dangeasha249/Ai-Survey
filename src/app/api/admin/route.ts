import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import SurveyResponseModel from "@/models/SurveyResponse";
import { requireResearcher } from "@/lib/auth";

// GET all survey responses with full details for Admin Panel
export async function GET() {
  if (!requireResearcher()) {
    return NextResponse.json({ success: false, message: "Researcher authorization required." }, { status: 401 });
  }
  try {
    await connectToDatabase();
    const responses = await SurveyResponseModel.find().sort({ createdAt: -1 }).lean();

    const formatted = responses.map((r: any) => ({
      id: r.responseId || r._id,
      mongoId: r._id,
      course: r.course || r.surveyAnswers?.q1Course || "B.Sc. CS",
      usesAI: r.usesAI || r.surveyAnswers?.q4UsedAI || "Yes",
      primaryTool: r.primaryTool || (r.surveyAnswers?.q5Tools?.[0]) || "ChatGPT",
      impactRating: r.impactRating || 4,
      year: r.surveyAnswers?.q2Year || "N/A",
      toolsUsed: r.surveyAnswers?.q5Tools || [r.primaryTool || "ChatGPT"],
      frequency: r.surveyAnswers?.q6Frequency || "Daily",
      purposes: r.surveyAnswers?.q7Purposes || [],
      likertRatings: r.surveyAnswers?.likertRatings || {},
      challenges: r.surveyAnswers?.q16Challenges || [],
      verify: r.surveyAnswers?.q17Verify || "N/A",
      workshop: r.surveyAnswers?.q18Workshop || "N/A",
      training: r.surveyAnswers?.q19NeedTraining || "N/A",
      opinion: r.surveyAnswers?.q20OverallOpinion || "N/A",
      timestamp: r.createdAt ? new Date(r.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recently",
    }));

    const totalCount = responses.length;
    const aiUsersCount = responses.filter((r: any) => (r.usesAI === "Yes" || r.surveyAnswers?.q4UsedAI === "Yes")).length;

    return NextResponse.json({
      success: true,
      stats: {
        totalResponses: totalCount,
        aiUsers: aiUsersCount,
        nonAiUsers: totalCount - aiUsersCount,
      },
      responses: formatted,
    });
  } catch (error: any) {
    console.error("Admin GET Error:", error instanceof Error ? error.message : "Unknown");
    return NextResponse.json({ success: false, message: "Failed to fetch admin data" }, { status: 500 });
  }
}
// DELETE a specific response by ID
export async function DELETE(request: Request) {
  if (!requireResearcher()) {
    return NextResponse.json({ success: false, message: "Researcher authorization required." }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || typeof id !== "string" || id.length > 128) {
      return NextResponse.json({ success: false, message: "Valid Response ID is required." }, { status: 400 });
    }

    await connectToDatabase();

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { $or: [{ responseId: id }, { _id: id }] }
      : { responseId: id };

    const result = await SurveyResponseModel.deleteOne(query);

    return NextResponse.json({
      success: true,
      message: `Response ${id} deleted successfully.`,
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error("Admin DELETE Error:", error instanceof Error ? error.message : "Unknown");
    return NextResponse.json({ success: false, message: "Failed to delete response" }, { status: 500 });
  }
}
