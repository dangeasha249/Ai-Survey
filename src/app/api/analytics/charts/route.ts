import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import SurveyResponseModel from "@/models/SurveyResponse";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await connectToDatabase();
    const responses = await SurveyResponseModel.find().lean();

    const total = Math.max(responses.length, 1);

    // 1. Responses by Course (Q1)
    const courseMap: Record<string, number> = {
      "B.Sc. CS": 0,
      "B.Sc. IT": 0,
      "BCA": 0,
      "B.Com": 0,
      "B.A.": 0,
      "Others": 0,
    };

    responses.forEach((r: any) => {
      const answers = r.surveyAnswers || {};
      let c = answers.q1Course || r.course || "Others";
      if (c === "B.Sc. Computer Science") c = "B.Sc. CS";
      if (c === "B.Sc. Information Technology") c = "B.Sc. IT";
      if (c === "Other") c = "Others";

      if (courseMap[c] !== undefined) {
        courseMap[c] += 1;
      } else {
        courseMap["Others"] += 1;
      }
    });

    const totalCourseSum = Object.values(courseMap).reduce((a, b) => a + b, 0) || 1;
    const courseDistribution = Object.entries(courseMap).map(([name, count]) => ({
      name,
      count,
      percentage: Number(((count / totalCourseSum) * 100).toFixed(1)),
    }));

    // 2. AI Tool Usage (Q5)
    const toolMap: Record<string, number> = {
      "ChatGPT": 0,
      "Google Gemini": 0,
      "Microsoft Copilot": 0,
      "Grammarly": 0,
      "QuillBot": 0,
      "Perplexity": 0,
    };

    responses.forEach((r: any) => {
      const answers = r.surveyAnswers || {};
      const tools: string[] = answers.q5Tools || (r.primaryTool ? [r.primaryTool] : ["ChatGPT"]);
      tools.forEach((t) => {
        if (toolMap[t] !== undefined) {
          toolMap[t] += 1;
        }
      });
    });

    const toolDistribution = Object.entries(toolMap)
      .map(([name, users]) => ({
        name,
        users,
        percentage: Number(((users / total) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.percentage - a.percentage);

    // 3. Impact on Learning (Q8..Q15 Likert Ratings 1..5)
    const impactSum: Record<string, { sum: number; count: number }> = {
      "Understand Concepts": { sum: 0, count: 0 },
      "Save Time": { sum: 0, count: 0 },
      "Improve Learning": { sum: 0, count: 0 },
      "Problem Solving": { sum: 0, count: 0 },
      "Academic Performance": { sum: 0, count: 0 },
    };

    const likertKeysMap: Record<string, string> = {
      q8: "Understand Concepts",
      q9: "Save Time",
      q10: "Improve Learning",
      q11: "Problem Solving",
      q12: "Academic Performance",
    };

    responses.forEach((r: any) => {
      const answers = r.surveyAnswers || {};
      const ratings = answers.likertRatings || {};
      
      Object.entries(likertKeysMap).forEach(([qKey, label]) => {
        const val = ratings[qKey] || r.impactRating || 4;
        impactSum[label].sum += val;
        impactSum[label].count += 1;
      });
    });

    const learningImpact = Object.entries(impactSum).map(([label, data]) => ({
      label,
      score: data.count ? Number((data.sum / data.count).toFixed(2)) : 4.25,
    }));

    // 4. Challenges (Q16 - Top reported issues)
    const challengeMap: Record<string, number> = {
      "Incorrect Information": 0,
      "Overdependence on AI": 0,
      "Lack of Guidance": 0,
      "Plagiarism Concerns": 0,
      "Feature Costs": 0,
    };

    responses.forEach((r: any) => {
      const answers = r.surveyAnswers || {};
      const chs: string[] = answers.q16Challenges || [];
      chs.forEach((ch) => {
        let key = ch;
        if (ch.includes("Incorrect") || ch.includes("False")) key = "Incorrect Information";
        else if (ch.includes("Overdependence") || ch.includes("dependence")) key = "Overdependence on AI";
        else if (ch.includes("guidance") || ch.includes("training")) key = "Lack of Guidance";
        else if (ch.includes("Plagiarism") || ch.includes("Ethical")) key = "Plagiarism Concerns";
        else if (ch.includes("Cost") || ch.includes("Limited")) key = "Feature Costs";

        if (challengeMap[key] !== undefined) {
          challengeMap[key] += 1;
        }
      });
    });

    const totalRes = Math.max(responses.length, 1);
    const challenges = Object.entries(challengeMap).map(([name, count]) => ({
      name,
      percentage: Number(((count / totalRes) * 100).toFixed(1)),
    }));

    return NextResponse.json({
      success: true,
      data: {
        courseDistribution,
        toolDistribution,
        learningImpact,
        challenges,
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
