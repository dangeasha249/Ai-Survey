import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      targetGroup: "Undergraduate Students",
      studyArea: "Maharashtra, India (Latur District)",
      surveyDuration: "10-15 Minutes",
      purpose: "Academic Research Study",
      targetTalukasCount: 10,
      participatingCollegesCount: 42,
      academicYear: "2024–2025",
      leadResearcher: "Dr. Ananya Deshmukh",
    },
  });
}
