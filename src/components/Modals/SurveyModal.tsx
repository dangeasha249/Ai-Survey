"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle, Send, ChevronRight, ChevronLeft, Lock, Edit3, LogIn, GraduationCap, Building2, HelpCircle } from "lucide-react";
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

  // SECTION A – STAFF PROFILE (Q1 - Q5)
  const [q1AgeGroup, setQ1AgeGroup] = useState("");
  const [q2Experience, setQ2Experience] = useState("");
  const [q3Qualification, setQ3Qualification] = useState("");
  const [q4Workshop, setQ4Workshop] = useState("");
  const [q5College, setQ5College] = useState("");

  // SECTIONS B, C, D, E – LIKERT RATINGS 1..5 (Q6 - Q21)
  const [likertRatings, setLikertRatings] = useState<Record<string, number>>({});

  // Fetch existing survey if user is logged in & reset state on open
  useEffect(() => {
    let isMounted = true;

    async function checkUserSurvey() {
      if (isOpen) {
        // Reset all form state to clean empty defaults on modal open
        setIsEditing(false);
        setExistingResponseId(null);
        setSubmitted(false);
        setCurrentStep(1);
        setSectionError(null);
        setSubmitError(null);
        setQ1AgeGroup("");
        setQ2Experience("");
        setQ3Qualification("");
        setQ4Workshop("");
        setQ5College("");
        setLikertRatings({});

        if (isAuthenticated && user?.email) {
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

                setQ1AgeGroup(ans.q1AgeGroup || ans.staffProfile?.ageGroup || "");
                setQ2Experience(ans.q2Experience || ans.staffProfile?.experience || "");
                setQ3Qualification(ans.q3Qualification || ans.staffProfile?.qualification || "");
                setQ4Workshop(ans.q4Workshop || ans.staffProfile?.workshop || "");
                setQ5College(ans.q5College || r.course || "");
                setLikertRatings(ans.likertRatings || {});
              }
            }
          } catch {
            // Ignore
          } finally {
            if (isMounted) setLoadingExisting(false);
          }
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
    { id: 1, label: "A. Staff Profile" },
    { id: 2, label: "B. AI Awareness & Usage" },
    { id: 3, label: "C. Impact on Teaching" },
    { id: 4, label: "D. Student Learning" },
    { id: 5, label: "E. Benefits & Ethics" },
  ];

  const handleLikertChange = (key: string, val: number) => {
    setLikertRatings(prev => ({ ...prev, [key]: val }));
  };

  // Step Validation
  const validateStep = (step: number): boolean => {
    setSectionError(null);
    if (step === 1) {
      if (!q1AgeGroup || !q2Experience || !q3Qualification || !q4Workshop || !q5College.trim()) {
        setSectionError("Please answer all 5 Staff Profile dropdown fields before continuing.");
        return false;
      }
    } else if (step === 2) {
      const keys = ["q6", "q7", "q8", "q9"];
      const missing = keys.filter(k => !likertRatings[k]);
      if (missing.length > 0) {
        setSectionError("Please select a rating dropdown for all 4 statements in Section B.");
        return false;
      }
    } else if (step === 3) {
      const keys = ["q10", "q11", "q12", "q13", "q14"];
      const missing = keys.filter(k => !likertRatings[k]);
      if (missing.length > 0) {
        setSectionError("Please select a rating dropdown for all 5 statements in Section C.");
        return false;
      }
    } else if (step === 4) {
      const keys = ["q15", "q16", "q17", "q18"];
      const missing = keys.filter(k => !likertRatings[k]);
      if (missing.length > 0) {
        setSectionError("Please select a rating dropdown for all 4 statements in Section D.");
        return false;
      }
    } else if (step === 5) {
      const keys = ["q19", "q20", "q21"];
      const missing = keys.filter(k => !likertRatings[k]);
      if (missing.length > 0) {
        setSectionError("Please select a rating dropdown for all 3 statements in Section E.");
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(5, prev + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    setSubmitError(null);

    // Calculate average impact score (1..5)
    const likertVals = Object.values(likertRatings);
    const avgScore = likertVals.length
      ? Number((likertVals.reduce((a, b) => a + b, 0) / likertVals.length).toFixed(2))
      : 4;

    const payload = {
      userEmail: user?.email,
      course: q5College,
      usesAI: (likertRatings["q8"] && likertRatings["q8"] >= 3) ? "Yes" : "No",
      primaryTool: "ChatGPT / Gemini / Copilot",
      impactRating: Math.max(1, Math.min(5, Math.round(avgScore))),
      q1AgeGroup,
      q2Experience,
      q3Qualification,
      q4Workshop,
      q5College,
      likertRatings,
      staffProfile: {
        ageGroup: q1AgeGroup,
        experience: q2Experience,
        qualification: q3Qualification,
        workshop: q4Workshop,
        college: q5College,
      },
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
              Faculty Sign In Required
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Please sign in or create a teaching staff account to participate in the AI Impact Questionnaire.
            </p>
            <p className="text-[11px] text-slate-400">
              Each faculty account can submit the survey once and update their saved response anytime.
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

  const sectionBQuestions = [
    { key: "q6", text: "6. I have sufficient knowledge about Artificial Intelligence and its educational applications." },
    { key: "q7", text: "7. I am familiar with AI tools such as ChatGPT, Gemini, Copilot and other AI tools." },
    { key: "q8", text: "8. I regularly use AI tools for academic and teaching-related activities." },
    { key: "q9", text: "9. I use AI tools for preparing notes, presentations, assignments, quizzes or question papers." },
  ];

  const sectionCQuestions = [
    { key: "q10", text: "10. AI tools help me explain difficult concepts more effectively." },
    { key: "q11", text: "11. AI helps me prepare teaching materials in less time." },
    { key: "q12", text: "12. AI tools improve the quality and effectiveness of my teaching." },
    { key: "q13", text: "13. AI makes my classroom teaching more interactive and engaging." },
    { key: "q14", text: "14. AI helps me provide quick and personalized support to students." },
  ];

  const sectionDQuestions = [
    { key: "q15", text: "15. AI tools help students understand difficult concepts more easily." },
    { key: "q16", text: "16. AI encourages students to learn independently and explore additional resources." },
    { key: "q17", text: "17. AI improves students’ problem-solving, creativity and critical-thinking skills." },
    { key: "q18", text: "18. AI can improve students’ academic performance and learning outcomes." },
  ];

  const sectionEQuestions = [
    { key: "q19", text: "19. AI reduces teachers’ workload and improves overall productivity." },
    { key: "q20", text: "20. Overdependence on AI may negatively affect students’ independent thinking and academic integrity." },
    { key: "q21", text: "21. Colleges should provide AI training and develop clear guidelines for the responsible and ethical use of AI in education." },
  ];

  const renderLikertGroupDropdown = (questions: { key: string; text: string }[]) => (
    <div className="space-y-4">
      {questions.map((q) => (
        <div key={q.key} className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2.5">
          <label className="block text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
            {q.text} *
          </label>
          <select
            value={likertRatings[q.key] || ""}
            onChange={(e) => handleLikertChange(q.key, Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm cursor-pointer"
          >
            <option value="" disabled>-- Select Your Rating --</option>
            <option value={5}>5 - Strongly Agree</option>
            <option value={4}>4 - Agree</option>
            <option value={3}>3 - Neutral</option>
            <option value={2}>2 - Disagree</option>
            <option value={1}>1 - Strongly Disagree</option>
          </select>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-slate-900 text-white px-5 sm:px-8 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                AI Impact Questionnaire for Teaching Staff (21 Questions)
              </h2>
              <p className="text-xs text-slate-300">
                Step {currentStep} of 5 • Confidential Academic Survey
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
              <span>Editing Previously Saved Response ({existingResponseId})</span>
            </div>
            <span className="hidden sm:inline-block text-[10px] bg-emerald-200/60 text-emerald-900 px-2.5 py-0.5 rounded-full">
              Single Account Sync
            </span>
          </div>
        )}

        {/* Progress Step Bar */}
        <div className="bg-slate-100 px-4 sm:px-8 py-3 border-b border-slate-200 shrink-0">
          <div className="grid grid-cols-5 gap-1 text-center">
            {stepsList.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  if (st.id < currentStep || validateStep(currentStep)) {
                    setCurrentStep(st.id);
                  }
                }}
                className={`py-1.5 px-1 rounded-xl text-[10px] sm:text-xs font-bold transition truncate ${
                  currentStep === st.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : st.id < currentStep
                    ? "bg-blue-100 text-blue-800"
                    : "bg-slate-200/60 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          {sectionError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-shake">
              <HelpCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{sectionError}</span>
            </div>
          )}

          {submitError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* STEP 1: SECTION A – STAFF PROFILE */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="pb-2 border-b border-slate-100">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                      <span>SECTION A – STAFF PROFILE</span>
                    </h3>
                    <p className="text-xs text-slate-500">Select your profile details from the dropdown options below.</p>
                  </div>

                  {/* Q1: Age Group */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      1. What is your age group? *
                    </label>
                    <select
                      value={q1AgeGroup}
                      onChange={(e) => setQ1AgeGroup(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm cursor-pointer"
                    >
                      <option value="" disabled>-- Select Age Group --</option>
                      <option value="Below 30">Below 30</option>
                      <option value="31–40">31–40</option>
                      <option value="41–50">41–50</option>
                      <option value="Above 50">Above 50</option>
                    </select>
                  </div>

                  {/* Q2: Teaching Experience */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      2. What is your teaching experience? *
                    </label>
                    <select
                      value={q2Experience}
                      onChange={(e) => setQ2Experience(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm cursor-pointer"
                    >
                      <option value="" disabled>-- Select Teaching Experience --</option>
                      <option value="Below 5 Years">Below 5 Years</option>
                      <option value="5–10 Years">5–10 Years</option>
                      <option value="11–15 Years">11–15 Years</option>
                      <option value="16–20 Years">16–20 Years</option>
                      <option value="Above 20 Years">Above 20 Years</option>
                    </select>
                  </div>

                  {/* Q3: Highest Educational Qualification */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      3. What is your highest educational qualification? *
                    </label>
                    <select
                      value={q3Qualification}
                      onChange={(e) => setQ3Qualification(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm cursor-pointer"
                    >
                      <option value="" disabled>-- Select Educational Qualification --</option>
                      <option value="Master’s Degree">Master’s Degree</option>
                      <option value="M.Phil.">M.Phil.</option>
                      <option value="Ph.D.">Ph.D.</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Q4: AI Workshop / Training */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      4. Have you attended any AI-related workshop or training? *
                    </label>
                    <select
                      value={q4Workshop}
                      onChange={(e) => setQ4Workshop(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm cursor-pointer"
                    >
                      <option value="" disabled>-- Select Option --</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  {/* Q5: Name of Affiliated College */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      5. Name of the Affiliated College *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={q5College}
                        onChange={(e) => setQ5College(e.target.value)}
                        placeholder="Enter your college name (e.g. Government Degree College)"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: SECTION B – AI AWARENESS & USAGE */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="pb-2 border-b border-slate-100">
                    <h3 className="text-base font-extrabold text-slate-900">
                      SECTION B – AI AWARENESS & USAGE
                    </h3>
                    <p className="text-xs text-slate-500">Select your agreement rating dropdown for each statement.</p>
                  </div>
                  {renderLikertGroupDropdown(sectionBQuestions)}
                </div>
              )}

              {/* STEP 3: SECTION C – IMPACT ON TEACHING */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="pb-2 border-b border-slate-100">
                    <h3 className="text-base font-extrabold text-slate-900">
                      SECTION C – IMPACT ON TEACHING
                    </h3>
                    <p className="text-xs text-slate-500">Select your agreement rating dropdown regarding teaching effectiveness.</p>
                  </div>
                  {renderLikertGroupDropdown(sectionCQuestions)}
                </div>
              )}

              {/* STEP 4: SECTION D – IMPACT ON STUDENT LEARNING */}
              {currentStep === 4 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="pb-2 border-b border-slate-100">
                    <h3 className="text-base font-extrabold text-slate-900">
                      SECTION D – IMPACT ON STUDENT LEARNING
                    </h3>
                    <p className="text-xs text-slate-500">Select your agreement rating dropdown regarding student learning outcomes.</p>
                  </div>
                  {renderLikertGroupDropdown(sectionDQuestions)}
                </div>
              )}

              {/* STEP 5: SECTION E – BENEFITS, CHALLENGES & ETHICS */}
              {currentStep === 5 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="pb-2 border-b border-slate-100">
                    <h3 className="text-base font-extrabold text-slate-900">
                      SECTION E – BENEFITS, CHALLENGES & ETHICS
                    </h3>
                    <p className="text-xs text-slate-500">Select your agreement rating dropdown regarding productivity and ethics.</p>
                  </div>
                  {renderLikertGroupDropdown(sectionEQuestions)}
                </div>
              )}

              {/* Wizard Bottom Navigation Bar */}
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

                {currentStep < 5 ? (
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
                    <span>{isEditing ? "Update Saved Questionnaire" : "Submit 21-Question Survey"}</span>
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
                {isEditing ? "Faculty Survey Updated Successfully!" : "Faculty Survey Submitted Successfully!"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isEditing
                  ? "Your teaching staff survey responses have been updated successfully in the MongoDB database."
                  : "Thank you for completing all 21 questions of the AI Impact Questionnaire for Teaching Staff."}
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
