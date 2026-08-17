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
      "Q6 AI Knowledge",
      "Q7 Familiarity with AI Tools",
      "Q8 Regular AI Usage",
      "Q9 Notes & Exam Prep Usage",
      "Q10 Concept Explanation Impact",
      "Q11 Time Saving Impact",
      "Q12 Teaching Quality Impact",
      "Q13 Interactive Classroom Impact",
      "Q14 Student Personalized Support",
      "Q15 Student Concept Understanding",
      "Q16 Student Independent Learning",
      "Q17 Student Critical Thinking",
      "Q18 Student Performance Impact",
      "Q19 Teacher Workload Reduction",
      "Q20 Overdependence Risk",
      "Q21 Institutional Guidelines Need",
      "Submitted At",
    ];

    const rows = responses.map((r: any) => {
      const sa = r.surveyAnswers || {};
      const likert = sa.likertRatings || {};
      const sp = sa.staffProfile || {};

      return [
        `"${r.responseId || r._id}"`,
        `"${r.userEmail || sa.userEmail || "N/A"}"`,
        `"${sa.q1AgeGroup || sp.ageGroup || "N/A"}"`,
        `"${sa.q2Experience || sp.experience || "N/A"}"`,
        `"${sa.q3Qualification || sp.qualification || "N/A"}"`,
        `"${sa.q4Workshop || sp.workshop || "N/A"}"`,
        `"${sa.q5College || sp.college || r.course || "N/A"}"`,
        `"${likert.q6 || "N/A"}"`,
        `"${likert.q7 || "N/A"}"`,
        `"${likert.q8 || "N/A"}"`,
        `"${likert.q9 || "N/A"}"`,
        `"${likert.q10 || "N/A"}"`,
        `"${likert.q11 || "N/A"}"`,
        `"${likert.q12 || "N/A"}"`,
        `"${likert.q13 || "N/A"}"`,
        `"${likert.q14 || "N/A"}"`,
        `"${likert.q15 || "N/A"}"`,
        `"${likert.q16 || "N/A"}"`,
        `"${likert.q17 || "N/A"}"`,
        `"${likert.q18 || "N/A"}"`,
        `"${likert.q19 || "N/A"}"`,
        `"${likert.q20 || "N/A"}"`,
        `"${likert.q21 || "N/A"}"`,
        `"${r.createdAt ? new Date(r.createdAt).toISOString() : ""}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="Faculty_AI_Impact_Dataset_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error: any) {
    console.error("CSV Export error:", error);
    return NextResponse.json({ success: false, message: "Export failed" }, { status: 500 });
  }
}
