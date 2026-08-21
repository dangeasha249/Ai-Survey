import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import SurveyResponseModel from "@/models/SurveyResponse";
import { requireResearcher } from "@/lib/auth";

export async function GET() {
  if (!requireResearcher()) {
    return NextResponse.json({ success: false, message: "Researcher authorization required." }, { status: 401 });
  }
  try {
    await connectToDatabase();
    const responses = await SurveyResponseModel.find().sort({ createdAt: -1 }).lean();

    const headers = [
      "Response ID",
      "User Email",
      "Q1 Age Group",
      "Q2 Teaching Experience",
      "Q3 Qualification",
      "Q4 Attended AI Workshop",
      "Q5 Affiliated College",
      "Q6 AI Tools Awareness",
      "Q7 Most Used AI Tool",
      "Q8 Main Teaching Activity for AI",
      "Q9 AI Knowledge Rating",
      "Q10 AI Use for Teaching Materials",
      "Q11 Teaching Effectiveness Impact",
      "Q12 Overall Impact on Teaching",
      "Q13 Helps Create Better Materials",
      "Q14 Generating Assignments & Quizzes Utility",
      "Q15 Lesson Prep Time Effect",
      "Q16 Assignment Completion Help",
      "Q17 Learning Activities AI Frequency",
      "Q18 Exam Prep Utility",
      "Q19 Personalized Learning Help",
      "Q20 Major Learning Benefit",
      "Q21 Overall Impact on Learning",
      "Q22 Major Benefit Higher Education",
      "Q23 Student Academic Help in HE",
      "Q24 Teacher Teaching Help in HE",
      "Q25 Personalized Learning Utility in HE",
      "Submitted At",
    ];

    const rows = responses.map((r: any) => {
      const sa = r.surveyAnswers || {};
      const mcq = sa.mcqAnswers || sa.answers || sa.likertRatings || {};
      const sp = sa.staffProfile || {};

      return [
        `"${r.responseId || r._id}"`,
        `"${r.userEmail || sa.userEmail || "N/A"}"`,
        `"${sa.q1AgeGroup || sp.ageGroup || "N/A"}"`,
        `"${sa.q2Experience || sp.experience || "N/A"}"`,
        `"${sa.q3Qualification || sp.qualification || "N/A"}"`,
        `"${sa.q4Workshop || sp.workshop || "N/A"}"`,
        `"${sa.q5College || sp.college || r.course || "N/A"}"`,
        `"${mcq.q6 || "N/A"}"`,
        `"${mcq.q7 || r.primaryTool || "N/A"}"`,
        `"${mcq.q8 || "N/A"}"`,
        `"${mcq.q9 || "N/A"}"`,
        `"${mcq.q10 || "N/A"}"`,
        `"${mcq.q11 || "N/A"}"`,
        `"${mcq.q12 || "N/A"}"`,
        `"${mcq.q13 || "N/A"}"`,
        `"${mcq.q14 || "N/A"}"`,
        `"${mcq.q15 || "N/A"}"`,
        `"${mcq.q16 || "N/A"}"`,
        `"${mcq.q17 || "N/A"}"`,
        `"${mcq.q18 || "N/A"}"`,
        `"${mcq.q19 || "N/A"}"`,
        `"${mcq.q20 || "N/A"}"`,
        `"${mcq.q21 || "N/A"}"`,
        `"${mcq.q22 || "N/A"}"`,
        `"${mcq.q23 || "N/A"}"`,
        `"${mcq.q24 || "N/A"}"`,
        `"${mcq.q25 || "N/A"}"`,
        `"${r.createdAt ? new Date(r.createdAt).toISOString() : ""}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="AI_Education_Impact_Dataset_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error: any) {
    console.error("CSV Export error:", error);
    return NextResponse.json({ success: false, message: "Export failed" }, { status: 500 });
  }
}
