import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import SurveyResponseModel from "@/models/SurveyResponse";
import { getSession, requireResearcher } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    await connectToDatabase();
    
    // If specific user email requested, check if user submitted previously
    if (email) {
      const session = getSession();
      const existingDoc = await SurveyResponseModel.findOne({
        $or: [{ userEmail: email.toLowerCase() }, { "surveyAnswers.userEmail": email.toLowerCase() }],
      }).lean();

      // Only return full document if it belongs to the logged-in user or requester is a Researcher
      const isResearcher = requireResearcher();
      const isOwner = session && session.email === email.toLowerCase();

      return NextResponse.json({
        success: true,
        hasSubmitted: !!existingDoc,
        // Only expose full document to the owner or researcher — not to anonymous callers
        existingResponse: (isOwner || isResearcher) ? (existingDoc || null) : null,
      });
    }

    // Public stats — only aggregate info, no personal data
    const dbResponses = await SurveyResponseModel.find().sort({ createdAt: -1 }).lean();

    const totalCount = dbResponses.length;
    const aiUsersCount = dbResponses.filter((r) => r.usesAI === "Yes").length;
    const nonAiCount = totalCount - aiUsersCount;

    const totalRatingSum = dbResponses.reduce((sum, item) => sum + (item.impactRating || 4), 0);
    const avgScore = totalCount ? Number((totalRatingSum / totalCount).toFixed(2)) : 0;

    // Public list: no emails, no personal info
    const formattedList = dbResponses.map((item) => ({
      id: item.responseId,
      course: item.course,
      usesAI: item.usesAI,
      primaryTool: item.primaryTool,
      impactRating: item.impactRating,
      timestamp: item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Today",
    }));

    return NextResponse.json({
      success: true,
      totalResponses: totalCount,
      aiUsers: aiUsersCount,
      nonAiUsers: nonAiCount,
      avgImpactScore: avgScore,
      coursesCount: new Set(dbResponses.map((item) => item.course)).size,
      responses: formattedList,
    });
  } catch (error: any) {
    console.error("MongoDB GET error:", error instanceof Error ? error.message : "Unknown");
    return NextResponse.json({ success: false, message: "Survey data is temporarily unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  // Teacher must be logged in to submit a survey response
  const session = getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Please sign in to submit your survey response." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    if (!body || !["Yes", "No"].includes(body.usesAI) || typeof body.course !== "string" || typeof body.primaryTool !== "string" || !Number.isInteger(body.impactRating) || body.impactRating < 1 || body.impactRating > 5) {
      return NextResponse.json({ success: false, message: "Please provide a valid survey response." }, { status: 400 });
    }
    await connectToDatabase();

    // Always use the authenticated session email — ignore any client-provided email
    const email = session.email;

    // Check if user already submitted a survey response
    const existingDoc = await SurveyResponseModel.findOne({
      $or: [{ userEmail: email }, { "surveyAnswers.userEmail": email }],
    });

    if (existingDoc) {
      // UPDATE existing survey response
      existingDoc.course = body.course || existingDoc.course;
      existingDoc.usesAI = body.usesAI || existingDoc.usesAI;
      existingDoc.primaryTool = body.primaryTool || existingDoc.primaryTool;
      existingDoc.impactRating = body.impactRating || existingDoc.impactRating;
      existingDoc.surveyAnswers = { ...body, userEmail: email };
      existingDoc.userEmail = email;

      await existingDoc.save();

      return NextResponse.json({
        success: true,
        isUpdate: true,
        message: "Your survey response has been updated successfully!",
        responseId: existingDoc.responseId,
        data: existingDoc,
      });
    }

    // CREATE new survey response
    const count = await SurveyResponseModel.countDocuments();
    const newId = `RES-${String(533 + count).padStart(4, "0")}`;

    const newDoc = new SurveyResponseModel({
      responseId: newId,
      userEmail: email,
      course: body.course || "B.Sc. CS",
      usesAI: body.usesAI || "Yes",
      primaryTool: body.primaryTool || "ChatGPT",
      impactRating: body.impactRating || 4,
      surveyAnswers: { ...body, userEmail: email },
      studentProfile: body.studentProfile,
      awareness: body.awareness,
      aiUsage: body.aiUsage,
      learningImpact: body.learningImpact,
      teachingImpact: body.teachingImpact,
      benefits: body.benefits,
      challenges: body.challenges,
      perception: body.perception,
      overallRating: body.overallRating,
      openFeedback: body.openFeedback,
    });

    await newDoc.save();

    return NextResponse.json({
      success: true,
      isUpdate: false,
      message: "Survey response saved successfully!",
      responseId: newId,
      data: newDoc,
    });
  } catch (error: any) {
    console.error("MongoDB POST error:", error instanceof Error ? error.message : "Unknown");
    return NextResponse.json(
      { success: false, message: "Failed to save response. Please try again." },
      { status: 500 }
    );
  }
}

