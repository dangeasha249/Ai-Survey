import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import SurveyResponseModel from "@/models/SurveyResponse";

export async function GET() {
  try {
    await connectToDatabase();
    const responses = await SurveyResponseModel.find().sort({ createdAt: -1 }).lean();

    const headers = [
      "Response ID",
      "Course",
      "Year of Study",
      "AI Aware",
      "Used AI",
      "AI Tools Used",
      "Frequency",
      "Purposes",
      "Q8 Understand Concepts",
      "Q9 Save Time",
      "Q10 Improve Learning",
      "Q11 Problem Solving",
      "Q12 Academic Performance",
      "Q13 Learn Independently",
      "Q14 Interesting Learning",
      "Q15 Teachers Explanation",
      "Challenges",
      "Verify Info",
      "Attended Workshop",
      "Need Training",
      "Overall Opinion",
      "Submitted At",
    ];

    const rows = responses.map((r: any) => {
      const sa = r.surveyAnswers || {};
      const likert = sa.likertRatings || {};

      const toolsStr = Array.isArray(sa.q5Tools) ? sa.q5Tools.join("; ") : (r.primaryTool || "ChatGPT");
      const purpStr = Array.isArray(sa.q7Purposes) ? sa.q7Purposes.join("; ") : "";
      const chalStr = Array.isArray(sa.q16Challenges) ? sa.q16Challenges.join("; ") : "";

      return [
        `"${r.responseId || r._id}"`,
        `"${sa.q1Course || r.course || "B.Sc. CS"}"`,
        `"${sa.q2Year || "N/A"}"`,
        `"${sa.q3Aware || "Yes"}"`,
        `"${sa.q4UsedAI || r.usesAI || "Yes"}"`,
        `"${toolsStr}"`,
        `"${sa.q6Frequency || "Daily"}"`,
        `"${purpStr}"`,
        `"${likert.q8 || 4}"`,
        `"${likert.q9 || 4}"`,
        `"${likert.q10 || 4}"`,
        `"${likert.q11 || 4}"`,
        `"${likert.q12 || 4}"`,
        `"${likert.q13 || 4}"`,
        `"${likert.q14 || 4}"`,
        `"${likert.q15 || 4}"`,
        `"${chalStr}"`,
        `"${sa.q17Verify || "N/A"}"`,
        `"${sa.q18Workshop || "N/A"}"`,
        `"${sa.q19NeedTraining || "N/A"}"`,
        `"${sa.q20OverallOpinion || "N/A"}"`,
        `"${r.createdAt ? new Date(r.createdAt).toISOString() : ""}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="AI_Edu_Survey_Dataset_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error: any) {
    console.error("CSV Export error:", error);
    return NextResponse.json({ success: false, message: "Export failed" }, { status: 500 });
  }
}
