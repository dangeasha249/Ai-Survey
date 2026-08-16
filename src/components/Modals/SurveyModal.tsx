"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle, Send, ChevronRight, ChevronLeft, Sparkles, AlertCircle, ClipboardCheck, Lock, Edit3, LogIn } from "lucide-react";
import confetti from "canvas-confetti";
import { useSurvey } from "@/context/SurveyContext";
import { useAuth } from "@/context/AuthContext";

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
  onRequireLogin?: () => void;
}

export const SurveyModal: React.FC<SurveyModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
  onRequireLogin,
}) => {
  const { addSurveyResponse } = useSurvey();
  const { user, isAuthenticated } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sectionError, setSectionError] = useState<string | null>(null);

  // Edit response state
  const [isEditing, setIsEditing] = useState(false);
  const [existingResponseId, setExistingResponseId] = useState<string | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(false);

  // Q1 - Q4
  const [q1Course, setQ1Course] = useState("");
  const [q2Year, setQ2Year] = useState("");
  const [q3Aware, setQ3Aware] = useState("");
  const [q4UsedAI, setQ4UsedAI] = useState("");

  // Q5 - Q7
  const [q5Tools, setQ5Tools] = useState<string[]>([]);
  const [q6Frequency, setQ6Frequency] = useState("");
  const [q7Purposes, setQ7Purposes] = useState<string[]>([]);

  // Q8 - Q15 (Likert Ratings 1..5)
  const [likertRatings, setLikertRatings] = useState<Record<string, number>>({});

  // Q16 - Q20
  const [q16Challenges, setQ16Challenges] = useState<string[]>([]);
  const [q17Verify, setQ17Verify] = useState("");
  const [q18Workshop, setQ18Workshop] = useState("");
  const [q19NeedTraining, setQ19NeedTraining] = useState("");
  const [q20OverallOpinion, setQ20OverallOpinion] = useState("");

  // Fetch existing survey if user is logged in
  useEffect(() => {
    let isMounted = true;

    async function checkUserSurvey() {
      if (isOpen && isAuthenticated && user?.email) {
        setLoadingExisting(true);
        try {
          const res = await fetch(`/api/survey?email=${encodeURIComponent(user.email)}`);
          if (res.ok) {
            const json = await res.json();
            if (isMounted && json.hasSubmitted && json.existingResponse) {
              const r = json.existingResponse;
              const ans = r.surveyAnswers || {};

              setIsEditing(true);
              setExistingResponseId(r.responseId);

              setQ1Course(ans.q1Course || r.course || "");
              setQ2Year(ans.q2Year || "");
              setQ3Aware(ans.q3Aware || "Yes");
              setQ4UsedAI(ans.q4UsedAI || r.usesAI || "Yes");
              setQ5Tools(ans.q5Tools || (r.primaryTool ? [r.primaryTool] : []));
              setQ6Frequency(ans.q6Frequency || "Daily");
              setQ7Purposes(ans.q7Purposes || []);
              setLikertRatings(ans.likertRatings || {});
              setQ16Challenges(ans.q16Challenges || []);
              setQ17Verify(ans.q17Verify || "");
              setQ18Workshop(ans.q18Workshop || "");
              setQ19NeedTraining(ans.q19NeedTraining || "");
              setQ20OverallOpinion(ans.q20OverallOpinion || "");
            }
          }
        } catch {
          // Ignore
        } finally {
          if (isMounted) setLoadingExisting(false);
        }
      }
    }

    checkUserSurvey();

    return () => {
      isMounted = false;
    };
  }, [isOpen, isAuthenticated, user?.email]);

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

  const stepsList = [
    { id: 1, label: "1. Profile & Awareness" },
    { id: 2, label: "2. Tools & Usage" },
    { id: 3, label: "3. Learning Impact" },
    { id: 4, label: "4. Challenges & Opinion" },
  ];

  const handleMultiSelect = (setter: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    setter(prev => prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]);
  };

  const handleLikertChange = (key: string, val: number) => {
    setLikertRatings(prev => ({ ...prev, [key]: val }));
  };

  // Validation per step
  const validateStep = (step: number): boolean => {
    setSectionError(null);
    if (step === 1) {
      if (!q1Course || !q2Year || !q3Aware || !q4UsedAI) {
        setSectionError("Please answer all 4 questions in Step 1 before continuing.");
        return false;
      }
    } else if (step === 2) {
      if (q4UsedAI === "Yes") {
        if (q5Tools.length === 0 || !q6Frequency || q7Purposes.length === 0) {
          setSectionError("Please answer all questions in Step 2 regarding your AI usage.");
          return false;
        }
      }
    } else if (step === 3) {
      const likertKeys = ["q8", "q9", "q10", "q11", "q12", "q13", "q14", "q15"];
      const missing = likertKeys.filter(k => !likertRatings[k]);
      if (missing.length > 0) {
        setSectionError("Please provide a rating for all 8 impact statements in Step 3.");
        return false;
      }
    } else if (step === 4) {
      if (!q17Verify || !q18Workshop || !q19NeedTraining || !q20OverallOpinion) {
        setSectionError("Please complete all questions in Step 4 before submitting.");
        return false;
      }
      if (q4UsedAI === "Yes" && q16Challenges.length === 0) {
        setSectionError("Please select at least one challenge option in Q16.");
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(4, prev + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setSubmitError(null);

    // Calculate average impact score (1..5)
    const likertVals = Object.values(likertRatings);
    const avgScore = likertVals.length
      ? Number((likertVals.reduce((a, b) => a + b, 0) / likertVals.length).toFixed(2))
      : 4;

    const payload = {
      userEmail: user?.email,
      course: q1Course,
      usesAI: q4UsedAI,
      primaryTool: q5Tools[0] || "ChatGPT",
      impactRating: Math.max(1, Math.min(5, Math.round(avgScore))),
      q1Course,
      q2Year,
      q3Aware,
      q4UsedAI,
      q5Tools,
      q6Frequency,
      q7Purposes,
      likertRatings,
      q16Challenges,
      q17Verify,
      q18Workshop,
      q19NeedTraining,
      q20OverallOpinion,
    };

    const success = await addSurveyResponse(payload);

    if (success) {
      setSubmitted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      if (onSubmitSuccess) onSubmitSuccess();
    } else {
      setSubmitError("Failed to save your response to the database. Please try again.");
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setCurrentStep(1);
    onClose();
  };

  // 1. Enforce Authentication Check
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-3xl p-7 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-5 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-100 shadow-sm">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-slate-900">
              Sign In Required
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Please sign in or create an account to participate in the AI Impact Survey.
            </p>
            <p className="text-[11px] text-slate-400">
              Each account can submit the survey once and update their saved response anytime.
            </p>
          </div>

          <button
            onClick={() => {
              onClose();
              if (onRequireLogin) onRequireLogin();
            }}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Create Account</span>
          </button>
        </div>
      </div>
    );
  }

  const likertOptions = [
    { label: "Strongly Agree", val: 5 },
    { label: "Agree", val: 4 },
    { label: "Neutral", val: 3 },
    { label: "Disagree", val: 2 },
    { label: "Strongly Disagree", val: 1 },
  ];

  const likertQuestions = [
    { key: "q8", text: "8. Do AI tools help you understand difficult concepts?" },
    { key: "q9", text: "9. Do AI tools help you save time in academic work?" },
    { key: "q10", text: "10. Do AI tools improve your learning?" },
    { key: "q11", text: "11. Do AI tools improve your problem-solving skills?" },
    { key: "q12", text: "12. Do AI tools improve your academic performance?" },
    { key: "q13", text: "13. Do AI tools help you learn independently?" },
    { key: "q14", text: "14. Do AI tools make learning more interesting?" },
    { key: "q15", text: "15. Do AI tools help teachers explain difficult concepts?" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-slate-900 text-white px-5 sm:px-8 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                AI-Edu Impact Survey (20 Questions)
              </h2>
              <p className="text-xs text-slate-300">
                Step {currentStep} of 4 • Confidential & Academic
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Edit Banner if editing existing response */}
        {isEditing && (
          <div className="bg-emerald-50 border-b border-emerald-100 px-5 sm:px-8 py-2 flex items-center justify-between text-xs font-bold text-emerald-800">
            <div className="flex items-center gap-2">
              <Edit3 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Editing Previously Saved Survey Response ({existingResponseId})</span>
            </div>
            <span className="hidden sm:inline-block text-[10px] bg-emerald-200/60 text-emerald-900 px-2.5 py-0.5 rounded-full">
              Single Account Sync
            </span>
          </div>
        )}

        {/* Progress Step Bar */}
        <div className="bg-slate-100 px-4 sm:px-8 py-3 border-b border-slate-200 shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {stepsList.map(step => (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  if (step.id < currentStep || validateStep(currentStep)) {
                    setCurrentStep(step.id);
                  }
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  currentStep === step.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : step.id < currentStep
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                <span>{step.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
          
          {sectionError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{sectionError}</span>
            </div>
          )}

          {submitError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* STEP 1: Profile & Awareness (Q1..Q4) */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b pb-2 border-slate-100">
                    <h3 className="text-base font-extrabold text-slate-900">
                      Step 1: Student Profile & AI Awareness
                    </h3>
                    <p className="text-xs text-slate-500">Please answer questions 1 to 4</p>
                  </div>

                  {/* Q1 */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      1. What is your course? *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {["B.Sc. Computer Science", "B.Sc. Information Technology", "BCA", "B.Com", "B.A.", "Other"].map(course => (
                        <button
                          key={course}
                          type="button"
                          onClick={() => setQ1Course(course)}
                          className={`p-3 rounded-xl text-xs font-bold border text-left transition ${
                            q1Course === course
                              ? "bg-blue-50 border-blue-600 text-blue-700 shadow-sm"
                              : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {course}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q2 */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      2. What is your year of study? *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {["First Year", "Second Year", "Third Year", "Final Year"].map(yr => (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => setQ2Year(yr)}
                          className={`p-3 rounded-xl text-xs font-bold border text-center transition ${
                            q2Year === yr
                              ? "bg-blue-50 border-blue-600 text-blue-700 shadow-sm"
                              : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {yr}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q3 */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      3. Are you aware of Artificial Intelligence (AI) tools? *
                    </label>
                    <div className="flex gap-3">
                      {["Yes", "No"].map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setQ3Aware(opt)}
                          className={`px-6 py-2.5 rounded-xl text-xs font-bold border transition ${
                            q3Aware === opt
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q4 */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      4. Have you used AI tools for your studies? *
                    </label>
                    <div className="flex gap-3">
                      {["Yes", "No"].map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setQ4UsedAI(opt)}
                          className={`px-6 py-2.5 rounded-xl text-xs font-bold border transition ${
                            q4UsedAI === opt
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 2: Tools & Usage (Q5..Q7) */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b pb-2 border-slate-100">
                    <h3 className="text-base font-extrabold text-slate-900">
                      Step 2: AI Tools & Usage Pattern
                    </h3>
                    <p className="text-xs text-slate-500">Please answer questions 5 to 7</p>
                  </div>

                  {/* Q5 */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      5. Which AI tools do you use? (Select all that apply) *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {["ChatGPT", "Google Gemini", "Microsoft Copilot", "Grammarly", "QuillBot", "Perplexity", "Other"].map(tool => {
                        const isSelected = q5Tools.includes(tool);
                        return (
                          <button
                            key={tool}
                            type="button"
                            onClick={() => handleMultiSelect(setQ5Tools, tool)}
                            className={`p-3 rounded-xl text-xs font-bold border text-left transition flex items-center justify-between ${
                              isSelected
                                ? "bg-blue-50 border-blue-600 text-blue-700 shadow-sm"
                                : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <span>{tool}</span>
                            {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Q6 */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      6. How often do you use AI tools? *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {["Daily", "Several times a week", "Weekly", "Occasionally", "Rarely", "Never"].map(freq => (
                        <button
                          key={freq}
                          type="button"
                          onClick={() => setQ6Frequency(freq)}
                          className={`p-3 rounded-xl text-xs font-bold border text-left transition ${
                            q6Frequency === freq
                              ? "bg-blue-50 border-blue-600 text-blue-700 shadow-sm"
                              : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q7 */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      7. For what purpose do you use AI tools? (Select all that apply) *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        "Understanding concepts",
                        "Assignments",
                        "Project work",
                        "Programming/Coding",
                        "Exam preparation",
                        "Research work",
                        "Presentation preparation",
                        "Other",
                      ].map(purp => {
                        const isSelected = q7Purposes.includes(purp);
                        return (
                          <button
                            key={purp}
                            type="button"
                            onClick={() => handleMultiSelect(setQ7Purposes, purp)}
                            className={`p-3 rounded-xl text-xs font-bold border text-left transition flex items-center justify-between ${
                              isSelected
                                ? "bg-blue-50 border-blue-600 text-blue-700 shadow-sm"
                                : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <span>{purp}</span>
                            {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 3: Impact on Learning & Teaching (Q8..Q15) */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b pb-2 border-slate-100">
                    <h3 className="text-base font-extrabold text-slate-900">
                      Step 3: Impact on Learning & Teaching (Likert Scale)
                    </h3>
                    <p className="text-xs text-slate-500">Rate statements 8 to 15 on a 5-point scale</p>
                  </div>

                  <div className="space-y-5">
                    {likertQuestions.map(q => (
                      <div key={q.key} className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-3">
                        <label className="block text-xs sm:text-sm font-bold text-slate-800">
                          {q.text} *
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {likertOptions.map(opt => {
                            const isSelected = likertRatings[q.key] === opt.val;
                            return (
                              <button
                                key={opt.val}
                                type="button"
                                onClick={() => handleLikertChange(q.key, opt.val)}
                                className={`px-2 py-2 rounded-xl text-[11px] font-bold border text-center transition ${
                                  isSelected
                                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: Challenges, Verification & Opinion (Q16..Q20) */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b pb-2 border-slate-100">
                    <h3 className="text-base font-extrabold text-slate-900">
                      Step 4: Challenges, Verification & Overall Opinion
                    </h3>
                    <p className="text-xs text-slate-500">Please answer final questions 16 to 20</p>
                  </div>

                  {/* Q16 */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      16. What challenges do you face while using AI tools? (Select all that apply) *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        "Incorrect Information",
                        "Overdependence on AI",
                        "Plagiarism Concern",
                        "Lack of AI Knowledge",
                        "Privacy Concern",
                        "Internet/Technical Problems",
                        "Difficulty in verifying information",
                        "No major challenge",
                      ].map(ch => {
                        const isSelected = q16Challenges.includes(ch);
                        return (
                          <button
                            key={ch}
                            type="button"
                            onClick={() => handleMultiSelect(setQ16Challenges, ch)}
                            className={`p-3 rounded-xl text-xs font-bold border text-left transition flex items-center justify-between ${
                              isSelected
                                ? "bg-blue-50 border-blue-600 text-blue-700 shadow-sm"
                                : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <span>{ch}</span>
                            {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Q17 */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      17. Do you verify AI-generated information before using it? *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {["Always", "Often", "Sometimes", "Rarely", "Never"].map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setQ17Verify(opt)}
                          className={`p-2.5 rounded-xl text-xs font-bold border text-center transition ${
                            q17Verify === opt
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q18 */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      18. Have you attended any AI-related workshop or training? *
                    </label>
                    <div className="flex gap-3">
                      {["Yes", "No"].map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setQ18Workshop(opt)}
                          className={`px-6 py-2.5 rounded-xl text-xs font-bold border transition ${
                            q18Workshop === opt
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
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
                      19. Do you think students need formal training in AI tools? *
                    </label>
                    <div className="flex gap-3">
                      {["Yes", "No", "Not Sure"].map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setQ19NeedTraining(opt)}
                          className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition ${
                            q19NeedTraining === opt
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
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
                      20. Overall, what is your opinion about the use of AI tools in higher education? *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {["Very Positive", "Positive", "Neutral", "Negative", "Very Negative"].map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setQ20OverallOpinion(opt)}
                          className={`p-2.5 rounded-xl text-xs font-bold border text-center transition ${
                            q20OverallOpinion === opt
                              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* Wizard Bottom Bar */}
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center gap-3">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                ) : <div />}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 transition"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-lg flex items-center gap-2 transition"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isEditing ? "Update My Saved Survey Answers" : "Submit 20-Question Survey"}</span>
                  </button>
                )}
              </div>

            </form>
          ) : (
            /* Celebration Success Screen */
            <div className="py-10 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {isEditing ? "Survey Updated Successfully!" : "Survey Submitted Successfully!"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isEditing
                  ? "Your previous survey response has been updated successfully in the MongoDB database."
                  : "Thank you for completing all 20 questions of the AI-Edu Impact Survey. Your response has been recorded."}
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md text-xs transition"
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
