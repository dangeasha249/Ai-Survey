"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle, Send, ChevronRight, ChevronLeft, Sparkles, AlertCircle, ClipboardCheck, Clock3, ShieldCheck, LockKeyhole } from "lucide-react";
import confetti from "canvas-confetti";
import { useSurvey } from "@/context/SurveyContext";

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export const SurveyModal: React.FC<SurveyModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
}) => {
  const { addSurveyResponse } = useSurvey();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedThrough, setCompletedThrough] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sectionError, setSectionError] = useState<string | null>(null);

  // Section A - Student Profile
  const [q1Age, setQ1Age] = useState("");
  const [q2Gender, setQ2Gender] = useState("");
  const [q3Course, setQ3Course] = useState("");
  const [q4Year, setQ4Year] = useState("");
  const [q5InstType, setQ5InstType] = useState("");
  const [q6Residence, setQ6Residence] = useState("");
  const [q7Taluka, setQ7Taluka] = useState("");
  const [q8College, setQ8College] = useState("");

  // Section B - Awareness Q9..Q16 (Rating 1..5)
  const [secB, setSecB] = useState<Record<string, number>>({});

  // Section C - Use of AI Q17..Q21
  const [q17Tools, setQ17Tools] = useState<string[]>([]);
  const [q18Frequency, setQ18Frequency] = useState("");
  const [q19Duration, setQ19Duration] = useState("");
  const [q20Purposes, setQ20Purposes] = useState<string[]>([]);
  const [q21DailyTime, setQ21DailyTime] = useState("");

  // Section D - Learning Impact Q22..Q36
  const [secD, setSecD] = useState<Record<string, number>>({});

  // Section E - Teaching Impact Q37..Q46
  const [secE, setSecE] = useState<Record<string, number>>({});

  // Section F - Benefits Q47..Q54
  const [secF, setSecF] = useState<Record<string, number>>({});

  // Section G - Challenges Q55..Q63
  const [secG, setSecG] = useState<Record<string, number>>({});

  // Section H - Perception Q64..Q71
  const [secH, setSecH] = useState<Record<string, number>>({});

  // Section I - Rating Q72..Q73
  const [q72OverallRating, setQ72OverallRating] = useState(0);
  const [q73Confidence, setQ73Confidence] = useState("");

  // Section J - Feedback Q74..Q76
  const [q74Help, setQ74Help] = useState("");
  const [q75Problem, setQ75Problem] = useState("");
  const [q76Suggestions, setQ76Suggestions] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sectionsList = [
    { id: 1, label: "A. Profile" },
    { id: 2, label: "B. Awareness" },
    { id: 3, label: "C. AI Usage" },
    { id: 4, label: "D. Learning Impact" },
    { id: 5, label: "E. Teaching Impact" },
    { id: 6, label: "F. Benefits" },
    { id: 7, label: "G. Challenges" },
    { id: 8, label: "H. Perception" },
    { id: 9, label: "I. Rating" },
    { id: 10, label: "J. Open Feedback" },
  ];

  const handleRatingChange = (setter: React.Dispatch<React.SetStateAction<Record<string, number>>>, key: string, val: number) => {
    setter(prev => ({ ...prev, [key]: val }));
  };

  const handleToolToggle = (tool: string) => {
    if (tool === "I do not use AI tools") {
      setQ17Tools(["I do not use AI tools"]);
      return;
    }
    setQ17Tools(prev => {
      const filtered = prev.filter(t => t !== "I do not use AI tools");
      if (filtered.includes(tool)) {
        return filtered.filter(t => t !== tool);
      } else {
        return [...filtered, tool];
      }
    });
  };

  const handlePurposeToggle = (purpose: string) => {
    setQ20Purposes(prev => {
      if (prev.includes(purpose)) {
        return prev.filter(p => p !== purpose);
      } else {
        return [...prev, purpose];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!isCurrentSectionComplete()) {
      setSectionError("Please answer every question in this section before submitting.");
      return;
    }
    setSectionError(null);
    
    // Add survey response to shared context
    const primaryTool = q17Tools.length > 0 ? q17Tools[0] : "ChatGPT";
    const usesAI = q17Tools.includes("I do not use AI tools") ? "No" : "Yes";

    const saved = await addSurveyResponse({
      course: q3Course,
      usesAI,
      primaryTool: usesAI === "Yes" ? primaryTool : "None",
      impactRating: q72OverallRating,
      studentProfile: { ageGroup: q1Age, gender: q2Gender, course: q3Course, yearOfStudy: q4Year, institutionType: q5InstType, residenceArea: q6Residence, taluka: q7Taluka, collegeName: q8College },
      awareness: secB,
      aiUsage: { toolsUsed: q17Tools, frequency: q18Frequency, duration: q19Duration, purposes: q20Purposes, dailyTimeSpent: q21DailyTime },
      learningImpact: secD,
      teachingImpact: secE,
      benefits: secF,
      challenges: secG,
      perception: secH,
      overallRating: { rating: q72OverallRating, confidence: q73Confidence },
      openFeedback: { helpText: q74Help, problemText: q75Problem, suggestionsText: q76Suggestions },
    });

    if (!saved) {
      setSubmitError("We could not save your response. Please check your connection and try again.");
      return;
    }

    setSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });
    if (onSubmitSuccess) onSubmitSuccess();
  };

  const handleReset = () => {
    setCurrentStep(1);
    setCompletedThrough(1);
    setSubmitted(false);
    onClose();
  };

  const goToSection = (sectionId: number) => {
    if (sectionId <= completedThrough) {
      setSectionError(null);
      setCurrentStep(sectionId);
    }
  };

  const hasAllRatings = (answers: Record<string, number>, expectedCount: number) =>
    Object.keys(answers).length === expectedCount && Object.values(answers).every((value) => Number.isInteger(value) && value >= 1 && value <= 5);

  const isCurrentSectionComplete = () => {
    switch (currentStep) {
      case 1:
        return [q1Age, q2Gender, q3Course, q4Year, q5InstType, q6Residence, q7Taluka, q8College].every(Boolean);
      case 2: return hasAllRatings(secB, 8);
      case 3: return q17Tools.length > 0 && Boolean(q18Frequency) && Boolean(q19Duration) && q20Purposes.length > 0 && Boolean(q21DailyTime);
      case 4: return hasAllRatings(secD, 15);
      case 5: return hasAllRatings(secE, 10);
      case 6: return hasAllRatings(secF, 8);
      case 7: return hasAllRatings(secG, 9);
      case 8: return hasAllRatings(secH, 8);
      case 9: return q72OverallRating >= 1 && q72OverallRating <= 5 && Boolean(q73Confidence);
      case 10: return Boolean(q74Help.trim()) && Boolean(q75Problem.trim()) && Boolean(q76Suggestions.trim());
      default: return false;
    }
  };

  const completeAndContinue = () => {
    if (!isCurrentSectionComplete()) {
      setSectionError("Please answer every question in this section before continuing.");
      return;
    }
    setSectionError(null);
    setCompletedThrough((previous) => Math.max(previous, currentStep + 1));
    setCurrentStep((previous) => previous + 1);
  };

  const renderLikertGroup = (
    questions: { key: string; text: string }[],
    valuesState: Record<string, number>,
    setter: React.Dispatch<React.SetStateAction<Record<string, number>>>
  ) => (
    <div className="space-y-4">
      <div className="p-3 bg-blue-50/80 border border-blue-100 rounded-xl text-xs text-blue-800 font-semibold flex items-center justify-between">
        <span>Response Scale: 1 = Strongly Disagree, 5 = Strongly Agree</span>
        <span className="hidden sm:inline text-[11px] text-blue-600 font-normal">Click rating to select</span>
      </div>

      <div className="space-y-3">
        {questions.map((q) => (
          <div key={q.key} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
            <p className="text-xs sm:text-sm font-bold text-slate-800">
              <span className="text-blue-600 font-extrabold mr-1.5">{q.key}.</span>
              {q.text}
            </p>
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => handleRatingChange(setter, q.key, score)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    valuesState[q.key] === score
                      ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {score} {score === 1 ? "★" : score === 5 ? "★★★★★" : "★"}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-t-[2rem] sm:rounded-[2rem] max-w-4xl w-full shadow-2xl border border-slate-200 relative flex flex-col max-h-[96dvh] overflow-hidden">
        
        {/* Guided questionnaire header */}
        <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white shrink-0 relative overflow-hidden">
          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-blue-500/20 blur-2xl" />
          <div className="absolute right-24 bottom-0 h-20 w-20 rounded-full bg-indigo-400/10 blur-xl" />
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-600 sm:hidden" />
          <button
            onClick={onClose}
            aria-label="Close survey"
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative pr-10 sm:pr-12">
            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-blue-200">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              Higher education research
            </div>
            <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Share your AI learning experience
            </h3>
            <p className="mt-1 max-w-2xl text-xs sm:text-sm text-slate-300">
              Your anonymous responses help improve teaching and learning practices.
            </p>
          </div>

          <div className="relative mt-5 grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-5 text-[10px] sm:text-xs">
            <div className="flex items-center gap-1.5 text-slate-300"><ClipboardCheck className="h-3.5 w-3.5 text-blue-300" /> 76 short questions</div>
            <div className="flex items-center gap-1.5 text-slate-300"><Clock3 className="h-3.5 w-3.5 text-blue-300" /> 10–15 minutes</div>
            <div className="flex items-center gap-1.5 text-slate-300"><ShieldCheck className="h-3.5 w-3.5 text-blue-300" /> Confidential</div>
          </div>

          {/* Progress and section navigation */}
          <div className="relative mt-5 rounded-2xl border border-white/10 bg-white/[0.07] p-3 sm:p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-xs font-bold text-white">{sectionsList[currentStep - 1].label}</p>
              <p className="text-[11px] font-semibold text-blue-200">Step {currentStep} <span className="text-slate-400">/ 10</span></p>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden" aria-label={`Survey progress: ${currentStep} of 10 sections`}>
              <div
                className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 h-2 transition-all duration-300"
                style={{ width: `${(currentStep / 10) * 100}%` }}
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pt-3 pb-0.5 no-scrollbar text-[11px] font-bold" aria-label="Survey sections">
              {sectionsList.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => goToSection(sec.id)}
                  disabled={sec.id > completedThrough}
                  aria-label={sec.id > completedThrough ? `${sec.label} is locked until the previous section is completed` : `Go to ${sec.label}`}
                  className={`h-8 min-w-8 px-2.5 rounded-lg shrink-0 transition-all ${
                    currentStep === sec.id
                      ? "bg-white text-blue-700 shadow-sm"
                      : sec.id > completedThrough
                      ? "bg-slate-950/20 text-slate-500 cursor-not-allowed"
                      : "bg-slate-950/30 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {sec.id > completedThrough ? <LockKeyhole className="mx-auto h-3 w-3" /> : <><span className="sm:hidden">{sec.id}</span><span className="hidden sm:inline">{sec.label}</span></>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Questionnaire Form Body */}
        <div className="bg-slate-50/70 p-4 sm:p-6 lg:p-8 overflow-y-auto flex-1 space-y-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
              {submitError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{submitError}</div>}
              {sectionError && <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">{sectionError}</div>}
              
              {/* STEP 1: SECTION A - STUDENT PROFILE (Q1-Q8) */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h4 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2">
                    Section A – Student Profile (Q1–Q8)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Q1. Age Group */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Q1. Age Group</label>
                      <select
                        value={q1Age}
                        onChange={(e) => setQ1Age(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                      >
                        <option value="" disabled>Select your age group</option>
                        <option value="Below 18">Below 18</option>
                        <option value="18–20">18–20</option>
                        <option value="21–23">21–23</option>
                        <option value="Above 23">Above 23</option>
                      </select>
                    </div>

                    {/* Q2. Gender */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Q2. Gender</label>
                      <select
                        value={q2Gender}
                        onChange={(e) => setQ2Gender(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                      >
                        <option value="" disabled>Select an option</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>

                    {/* Q3. Course */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Q3. Course</label>
                      <select
                        value={q3Course}
                        onChange={(e) => setQ3Course(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                      >
                        <option value="" disabled>Select your course</option>
                        <option value="B.Sc. Computer Science">B.Sc. Computer Science</option>
                        <option value="B.Sc. Information Technology">B.Sc. Information Technology</option>
                        <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                        <option value="B.Com.">B.Com. (Bachelor of Commerce)</option>
                        <option value="B.A.">B.A. (Bachelor of Arts)</option>
                        <option value="Other">Other Degree / Engineering</option>
                      </select>
                    </div>

                    {/* Q4. Year of Study */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Q4. Year of Study</label>
                      <select
                        value={q4Year}
                        onChange={(e) => setQ4Year(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                      >
                        <option value="" disabled>Select your year</option>
                        <option value="First Year">First Year</option>
                        <option value="Second Year">Second Year</option>
                        <option value="Third Year">Third Year</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Q5. Type of Institution */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Q5. Type of Institution</label>
                      <select
                        value={q5InstType}
                        onChange={(e) => setQ5InstType(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                      >
                        <option value="" disabled>Select institution type</option>
                        <option value="Government">Government</option>
                        <option value="Aided">Aided</option>
                        <option value="Private">Private</option>
                        <option value="Autonomous">Autonomous</option>
                      </select>
                    </div>

                    {/* Q6. Area of Residence */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Q6. Area of Residence</label>
                      <select
                        value={q6Residence}
                        onChange={(e) => setQ6Residence(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                      >
                        <option value="" disabled>Select residence area</option>
                        <option value="Rural">Rural</option>
                        <option value="Urban">Urban</option>
                      </select>
                    </div>

                    {/* Q7. Taluka */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Q7. Taluka</label>
                      <select
                        value={q7Taluka}
                        onChange={(e) => setQ7Taluka(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                      >
                        <option value="" disabled>Select your taluka</option>
                        <option value="Latur">Latur</option>
                        <option value="Ausa">Ausa</option>
                        <option value="Ahmedpur">Ahmedpur</option>
                        <option value="Udgir">Udgir</option>
                        <option value="Nilanga">Nilanga</option>
                        <option value="Chakur">Chakur</option>
                        <option value="Deoni">Deoni</option>
                        <option value="Jalkot">Jalkot</option>
                        <option value="Renapur">Renapur</option>
                        <option value="Shirur Anantpal">Shirur Anantpal</option>
                      </select>
                    </div>

                    {/* Q8. College Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Q8. College Name</label>
                      <select
                        value={q8College}
                        onChange={(e) => setQ8College(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                      >
                        <option value="" disabled>Select your college</option>
                        <option value="Rajarshi Shahu Mahavidyalaya Latur">Rajarshi Shahu Mahavidyalaya Latur</option>
                        <option value="Dayanand Science College Latur">Dayanand Science College Latur</option>
                        <option value="COCSIT Latur">College of Computer Science & Information Tech (COCSIT)</option>
                        <option value="Maharashtra Udayagiri Mahavidyalaya Udgir">Maharashtra Udayagiri Mahavidyalaya Udgir</option>
                        <option value="Dayanand College of Commerce Latur">Dayanand College of Commerce Latur</option>
                        <option value="Mahatma Basaveshwar College Latur">Mahatma Basaveshwar College Latur</option>
                        <option value="Government Medical College Latur">Government Medical College Latur</option>
                        <option value="VDF School of Engineering Latur">VDF School of Engineering Latur</option>
                        <option value="Others">Other Affiliated Institution</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: SECTION B - AWARENESS OF AI (Q9-Q16) */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h4 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2">
                    Section B – Awareness of Artificial Intelligence (Q9–Q16)
                  </h4>
                  {renderLikertGroup([
                    { key: "Q9", text: "I am aware of Artificial Intelligence (AI) tools used in education." },
                    { key: "Q10", text: "I understand the basic functions of AI tools." },
                    { key: "Q11", text: "I know how to use AI tools for academic purposes." },
                    { key: "Q12", text: "I am aware of different AI tools such as ChatGPT, Gemini and Copilot." },
                    { key: "Q13", text: "I understand that AI-generated information may sometimes be incorrect." },
                    { key: "Q14", text: "I know that AI-generated information should be verified before academic use." },
                    { key: "Q15", text: "I am aware of ethical issues related to the use of AI in education." },
                    { key: "Q16", text: "I am aware of the risks of becoming overly dependent on AI tools." },
                  ], secB, setSecB)}
                </div>
              )}

              {/* STEP 3: SECTION C - USE OF AI TOOLS (Q17-Q21) */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  <h4 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2">
                    Section C – Use of AI Tools (Q17–Q21)
                  </h4>

                  {/* Q17 */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      Q17. Which AI tools do you use? (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["ChatGPT", "Google Gemini", "Microsoft Copilot", "Grammarly", "QuillBot", "Perplexity", "Other", "I do not use AI tools"].map((tool) => {
                        const isSelected = q17Tools.includes(tool);
                        return (
                          <button
                            key={tool}
                            type="button"
                            onClick={() => handleToolToggle(tool)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                              isSelected
                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {tool} {isSelected ? "✓" : "+"}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Q18 */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      Q18. How frequently do you use AI tools for academic purposes?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {["Daily", "Several times a week", "Once a week", "Occasionally", "Never"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setQ18Frequency(opt)}
                          className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                            q18Frequency === opt
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q19 */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      Q19. How long have you been using AI tools?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {["Less than 6 months", "6–12 months", "1–2 years", "More than 2 years", "I do not use AI tools"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setQ19Duration(opt)}
                          className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                            q19Duration === opt
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q20 */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      Q20. For what purposes do you use AI tools? (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["Understanding concepts", "Assignments", "Notes and summaries", "Exam preparation", "Programming/Coding", "Presentations", "Research", "Writing and Grammar", "Translation", "Project Work", "Other"].map((p) => {
                        const isSelected = q20Purposes.includes(p);
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => handlePurposeToggle(p)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                              isSelected
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {p} {isSelected ? "✓" : "+"}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Q21 */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      Q21. Average daily time spent using AI tools for study?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {["Less than 30 minutes", "30–60 minutes", "1–2 hours", "2–3 hours", "More than 3 hours"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setQ21DailyTime(t)}
                          className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                            q21DailyTime === t
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: SECTION D - IMPACT ON LEARNING (Q22-Q36) */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <h4 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2">
                    Section D – Impact of AI Tools on Learning (Q22–Q36)
                  </h4>
                  {renderLikertGroup([
                    { key: "Q22", text: "AI tools help me understand difficult concepts more easily." },
                    { key: "Q23", text: "AI tools help me learn at my own pace." },
                    { key: "Q24", text: "AI tools save my study time." },
                    { key: "Q25", text: "AI tools provide quick explanations of academic topics." },
                    { key: "Q26", text: "AI tools help me find relevant learning resources quickly." },
                    { key: "Q27", text: "AI tools help me prepare assignments effectively." },
                    { key: "Q28", text: "AI tools help me solve academic problems." },
                    { key: "Q29", text: "AI tools improve my learning experience." },
                    { key: "Q30", text: "AI tools increase my confidence in learning." },
                    { key: "Q31", text: "AI tools help me revise and summarize study material." },
                    { key: "Q32", text: "AI tools encourage me to explore new topics." },
                    { key: "Q33", text: "AI tools support personalized learning." },
                    { key: "Q34", text: "AI tools help me improve my academic performance." },
                    { key: "Q35", text: "AI tools provide immediate feedback when I have difficulties." },
                    { key: "Q36", text: "AI tools help me develop problem-solving skills." },
                  ], secD, setSecD)}
                </div>
              )}

              {/* STEP 5: SECTION E - IMPACT ON TEACHING (Q37-Q46) */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <h4 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2">
                    Section E – Impact of AI Tools on Teaching (Q37–Q46)
                  </h4>
                  {renderLikertGroup([
                    { key: "Q37", text: "My teachers use AI tools or AI-based resources in teaching." },
                    { key: "Q38", text: "AI tools help teachers explain difficult concepts more effectively." },
                    { key: "Q39", text: "AI tools help teachers prepare teaching materials." },
                    { key: "Q40", text: "AI-based resources make classroom teaching more interesting." },
                    { key: "Q41", text: "AI tools help teachers provide faster feedback to students." },
                    { key: "Q42", text: "AI tools support personalized teaching and learning." },
                    { key: "Q43", text: "AI tools make teaching more interactive." },
                    { key: "Q44", text: "AI tools help teachers save time in academic preparation." },
                    { key: "Q45", text: "AI tools can help teachers identify students' learning difficulties." },
                    { key: "Q46", text: "AI tools can improve the overall effectiveness of teaching." },
                  ], secE, setSecE)}
                </div>
              )}

              {/* STEP 6: SECTION F - BENEFITS OF AI TOOLS (Q47-Q54) */}
              {currentStep === 6 && (
                <div className="space-y-4">
                  <h4 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2">
                    Section F – Benefits of AI Tools (Q47–Q54)
                  </h4>
                  {renderLikertGroup([
                    { key: "Q47", text: "AI tools provide easy access to academic information." },
                    { key: "Q48", text: "AI tools improve productivity in academic work." },
                    { key: "Q49", text: "AI tools provide learning support whenever required." },
                    { key: "Q50", text: "AI tools help students with different learning needs." },
                    { key: "Q51", text: "AI tools improve writing and communication skills." },
                    { key: "Q52", text: "AI tools are useful for programming and technical learning." },
                    { key: "Q53", text: "AI tools are useful for research and project work." },
                    { key: "Q54", text: "AI tools make learning more flexible." },
                  ], secF, setSecF)}
                </div>
              )}

              {/* STEP 7: SECTION G - CHALLENGES AND RISKS (Q55-Q63) */}
              {currentStep === 7 && (
                <div className="space-y-4">
                  <h4 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2">
                    Section G – Challenges and Risks (Q55–Q63)
                  </h4>
                  {renderLikertGroup([
                    { key: "Q55", text: "AI tools sometimes provide incorrect or misleading information." },
                    { key: "Q56", text: "Students may become overdependent on AI tools." },
                    { key: "Q57", text: "Excessive use of AI may reduce independent thinking." },
                    { key: "Q58", text: "AI tools may encourage plagiarism or academic dishonesty." },
                    { key: "Q59", text: "Students may submit AI-generated work without understanding it." },
                    { key: "Q60", text: "Privacy and data security are concerns when using AI tools." },
                    { key: "Q61", text: "Lack of knowledge about AI can lead to its improper use." },
                    { key: "Q62", text: "Excessive use of AI may reduce students' creativity." },
                    { key: "Q63", text: "AI-generated answers should always be verified before academic use." },
                  ], secG, setSecG)}
                </div>
              )}

              {/* STEP 8: SECTION H - OVERALL PERCEPTION (Q64-Q71) */}
              {currentStep === 8 && (
                <div className="space-y-4">
                  <h4 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2">
                    Section H – Overall Perception (Q64–Q71)
                  </h4>
                  {renderLikertGroup([
                    { key: "Q64", text: "Overall, AI tools have a positive impact on my learning." },
                    { key: "Q65", text: "AI tools can improve the quality of higher education." },
                    { key: "Q66", text: "AI tools should be integrated into higher education." },
                    { key: "Q67", text: "Students should receive formal training on responsible use of AI." },
                    { key: "Q68", text: "Teachers should receive training on the effective use of AI tools." },
                    { key: "Q69", text: "AI should be used as a support tool rather than a replacement for teachers." },
                    { key: "Q70", text: "Colleges should develop guidelines for responsible use of AI tools." },
                    { key: "Q71", text: "I would recommend the responsible use of AI tools for academic purposes." },
                  ], secH, setSecH)}
                </div>
              )}

              {/* STEP 9: SECTION I - OVERALL RATING & CONFIDENCE (Q72-Q73) */}
              {currentStep === 9 && (
                <div className="space-y-6">
                  <h4 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2">
                    Section I – Overall Rating (Q72–Q73)
                  </h4>

                  {/* Q72 */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      Q72. How would you rate the overall impact of AI tools on your learning?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                      {[
                        { val: 1, label: "1 – Very Low" },
                        { val: 2, label: "2 – Low" },
                        { val: 3, label: "3 – Moderate" },
                        { val: 4, label: "4 – High" },
                        { val: 5, label: "5 – Very High" },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setQ72OverallRating(item.val)}
                          className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                            q72OverallRating === item.val
                              ? "bg-blue-600 text-white border-blue-600 shadow-md"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q73 */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      Q73. How confident are you in using AI tools responsibly for academic purposes?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                      {["Very Low", "Low", "Moderate", "High", "Very High"].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setQ73Confidence(c)}
                          className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                            q73Confidence === c
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 10: SECTION J - OPEN-ENDED FEEDBACK (Q74-Q76) */}
              {currentStep === 10 && (
                <div className="space-y-5">
                  <h4 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2">
                    Section J – Open-ended Questions (Q74–Q76)
                  </h4>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Q74. How have AI tools helped you in your studies?
                    </label>
                    <textarea
                      rows={3}
                      value={q74Help}
                      onChange={(e) => setQ74Help(e.target.value)}
                      placeholder="Share your personal experience..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Q75. What is the biggest problem you face while using AI tools?
                    </label>
                    <textarea
                      rows={3}
                      value={q75Problem}
                      onChange={(e) => setQ75Problem(e.target.value)}
                      placeholder="e.g. incorrect answers, overdependence, privacy concerns..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Q76. What suggestions would you give your college for the effective and responsible use of AI?
                    </label>
                    <textarea
                      rows={3}
                      value={q76Suggestions}
                      onChange={(e) => setQ76Suggestions(e.target.value)}
                      placeholder="e.g. workshops, clear policies, AI labs..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* Wizard Bottom Navigation Buttons */}
              <div className="sticky bottom-0 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-3 border-t border-slate-200 bg-white/95 backdrop-blur">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="min-h-11 px-3 sm:px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous Section</span><span className="sm:hidden">Previous</span>
                  </button>
                ) : <div />}

                {currentStep < 10 ? (
                  <button
                    type="button"
                    onClick={completeAndContinue}
                    className="min-h-11 px-4 sm:px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 transition"
                  >
                    <span className="hidden sm:inline">Complete & Continue</span><span className="sm:hidden">Continue</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="min-h-11 px-4 sm:px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-lg flex items-center gap-2 transition"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Full Survey</span>
                  </button>
                )}
              </div>

            </form>
          ) : (
            /* Celebration View */
            <div className="mx-auto max-w-lg rounded-3xl bg-white p-6 sm:p-10 text-center shadow-sm border border-slate-200 py-10 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Full Questionnaire Submitted!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you for completing all 76 questions of the <strong>AI-Edu Impact Survey</strong>.
                Your responses across Sections A through J have been recorded into the research dataset.
              </p>
              <button
                onClick={handleReset}
                className="min-h-11 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 text-xs transition"
              >
                Close Survey Window
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
