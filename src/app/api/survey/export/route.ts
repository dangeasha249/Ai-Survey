import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import SurveyResponseModel from "@/models/SurveyResponse";
import { requireResearcher } from "@/lib/auth";

export async function GET() {
  if (!requireResearcher()) {
    return NextResponse.json({ success: false, message: "Researcher authorization is required." }, { status: 403 });
  }
  try {
    await connectToDatabase();
    const responses = await SurveyResponseModel.find().sort({ createdAt: -1 }).lean();

    const headers = [
      "Response ID",
      "Course",
      "Uses AI",
      "Primary Tool",
      "Impact Rating (1-5)",
      "Age Group",
      "Gender",
      "Taluka",
      "College Name",
      "Timestamp",
    ];

    const rows = responses.map((r) => [
      r.responseId || "",
      `"${String(r.course || "").replaceAll('"', '""')}"`,
      `"${String(r.usesAI || "").replaceAll('"', '""')}"`,
      `"${String(r.primaryTool || "").replaceAll('"', '""')}"`,
      r.impactRating || "",
      `"${String(r.studentProfile?.ageGroup || "").replaceAll('"', '""')}"`,
      `"${String(r.studentProfile?.gender || "").replaceAll('"', '""')}"`,
      `"${String(r.studentProfile?.taluka || "").replaceAll('"', '""')}"`,
      `"${String(r.studentProfile?.collegeName || "").replaceAll('"', '""')}"`,
      `"${r.createdAt ? new Date(r.createdAt).toISOString() : ""}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="aiedu_survey_mongodb_dataset.csv"',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
