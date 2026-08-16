import React, { useState } from "react";
import { 
  ChevronDown, 
  HelpCircle, 
  BookOpen, 
  Send, 
  Mail, 
  MapPin, 
  Phone, 
  Building2, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check, 
  MessageSquare,
  Globe,
  User,
  FileText
} from "lucide-react";

interface InfoSectionsProps {
  activeSection: string;
  onStartSurvey: () => void;
}

export const InfoSections: React.FC<InfoSectionsProps> = ({
  activeSection,
  onStartSurvey,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Contact Form State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactOrg, setContactOrg] = useState("");
  const [contactSubject, setContactSubject] = useState("General Research Inquiry");
  const [contactMessage, setContactMessage] = useState("");

  const faqs = [
    {
      q: "What is the primary objective of this study?",
      a: "This study evaluates the adoption, teaching effectiveness, student learning impact, and ethical challenges of Artificial Intelligence tools (like ChatGPT, Gemini, and Copilot) among faculty and teaching staff members across higher education institutions."
    },
    {
      q: "Is my personal identity or response data kept confidential?",
      a: "Yes, 100%. All responses are completely anonymous, encrypted, and processed strictly for aggregate academic research purposes."
    },
    {
      q: "Who is eligible to participate in the survey?",
      a: "Teaching staff, lecturers, assistant professors, and faculty members across affiliated higher education colleges and universities."
    },
    {
      q: "How long does it take to fill out the questionnaire?",
      a: "The questionnaire comprises 21 structured questions across 5 sections (A through E) and takes approximately 5 to 7 minutes to complete."
    },
  ];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setTimeout(() => {
      setFormLoading(false);
      setFormSubmitted(true);
    }, 1000);
  };

  if (activeSection === "home") return null;

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 space-y-10 sm:space-y-16">
      
      {/* ---------------- ELEGANT EDITORIAL PAGE: ABOUT STUDY, INSTRUCTIONS & FAQS ---------------- */}
      {(activeSection === "about" || activeSection === "instructions" || activeSection === "faqs" || activeSection === "all") && (
        <div id="about-study-merged" className="space-y-12 sm:space-y-16 animate-fade-in py-2">
          
          {/* Header & Page Title */}
          <div className="space-y-3 pb-8 border-b border-slate-200/80">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200/80 rounded-full text-xs font-bold text-blue-700">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Higher Education Academic Investigation</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Understanding the Impact of AI in Higher Education
            </h1>
            <p className="text-sm sm:text-base text-slate-500 max-w-3xl leading-relaxed">
              An empirical multi-institutional study across Maharashtra evaluating student adoption patterns, self-learning efficiency, faculty integration, and ethical AI policy frameworks.
            </p>
          </div>

          {/* Section 1: Study Background & Key Focus Areas (Editorial 2-Column Layout) */}
          <div id="about" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pb-10 border-b border-slate-200/80">
            
            {/* Left Column: Rich Typography Narrative */}
            <div className="lg:col-span-7 space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 pb-2">
                Background & Research Objective
              </h2>
              <p>
                As Artificial Intelligence tools like ChatGPT, Gemini, and Copilot rapidly permeate higher education, understanding student adoption patterns, cognitive benefits, and operational challenges is paramount for academic leaders and policymakers.
              </p>
              <p>
                Our study gathers empirical data from undergraduate institutions across Maharashtra, measuring how AI assists concept understanding, study time savings, exam preparation, and assignment drafting.
              </p>
              <p>
                Simultaneously, the investigation addresses critical concerns regarding hallucinated information, reduction in independent critical thinking, academic integrity, plagiarism risks, and student data privacy safeguards.
              </p>
            </div>

            {/* Right Column: Key Focus List with Divider Lines */}
            <div className="lg:col-span-5 space-y-4 pt-2">
              <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider text-xs text-blue-600">
                Core Research Dimensions
              </h3>

              <div className="divide-y divide-slate-100 space-y-3">
                <div className="pt-3 flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Pedagogical & Learning Impact</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Adoption rates and exam preparation scores across CS, IT, Commerce, and Arts streams.</p>
                  </div>
                </div>

                <div className="pt-3 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Faculty Integration & Teaching</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Educator adoption for preparing teaching aids, interactive materials, and prompt feedback.</p>
                  </div>
                </div>

                <div className="pt-3 flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Ethical Policies & Integrity</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Mitigating plagiarism, overdependence, and establishing institutional AI guidelines.</p>
                  </div>
                </div>

                <div className="pt-3 flex items-start gap-3">
                  <Globe className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Regional Demographic Scope</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Insights across 10 Talukas and 42 higher education colleges in Latur district.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Section 2: Participation Workflow (Clean Numbered Timeline) */}
          <div id="instructions" className="space-y-6 pb-10 border-b border-slate-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Survey Instructions & Participation</h2>
                <p className="text-xs sm:text-sm text-slate-500">How to contribute your response to the study</p>
              </div>

              <button
                onClick={onStartSurvey}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
              >
                <span>Start 76-Question Survey</span>
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="space-y-2 border-l-2 border-blue-600 pl-4 py-1">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 01</span>
                <h4 className="font-extrabold text-slate-900 text-base">Select Your Institution</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Choose your college name, taluka location, course stream (B.Sc. CS/IT, BCA, B.Com, B.A.), and year of study accurately.
                </p>
              </div>

              <div className="space-y-2 border-l-2 border-blue-600 pl-4 py-1">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 02</span>
                <h4 className="font-extrabold text-slate-900 text-base">Rate 76 Statements</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Rate statements on a scale of 1 (Strongly Disagree) to 5 (Strongly Agree) based on your personal academic experience.
                </p>
              </div>

              <div className="space-y-2 border-l-2 border-blue-600 pl-4 py-1">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 03</span>
                <h4 className="font-extrabold text-slate-900 text-base">Instant Analytics Sync</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Submit your response to immediately contribute to the aggregated research analytics and policy framework reports.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Frequently Asked Questions (Accordion) */}
          <div id="faqs" className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
              <p className="text-xs sm:text-sm text-slate-500">Ethics, Privacy & Eligibility Guidelines</p>
            </div>

            <div className="divide-y divide-slate-200/90 border-t border-b border-slate-200/90">
              {faqs.map((faq, idx) => (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left font-bold text-slate-900 flex justify-between items-center text-sm sm:text-base py-1 hover:text-blue-600 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? "rotate-180 text-blue-600" : ""}`} />
                  </button>
                  {openFaq === idx && (
                    <p className="pt-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ---------------- ELEGANT CARDLESS CONTACT PAGE ---------------- */}
      {(activeSection === "contact" || activeSection === "all") && (
        <div id="contact" className="space-y-10 animate-fade-in py-2">

          {/* Section 1: Inquiry Form (Inside Card Container) */}
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-md space-y-6">
            
            <div className="space-y-1 pb-3 border-b border-slate-200/80">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span>Send an Inquiry</span>
              </h3>
              <p className="text-xs text-slate-500">Fill in the details below to message the lead academic research desk</p>
            </div>

            {!formSubmitted ? (
              <form onSubmit={handleContactSubmit} className="space-y-5">
                
                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Dr. Rajesh Sharma"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="rajesh@college.edu"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                </div>

                {/* Row 2: Organization & Topic */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Organization Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">College / Institution</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={contactOrg}
                        onChange={(e) => setContactOrg(e.target.value)}
                        placeholder="e.g. RSML Latur"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Topic Select */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Inquiry Subject *</label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="General Research Inquiry">General Research Inquiry</option>
                        <option value="Research Dataset Access">Research Dataset Access</option>
                        <option value="Methodology & Questionnaire">Methodology & Questionnaire</option>
                        <option value="Institutional Partnership">Institutional Partnership</option>
                        <option value="Student Assistance">Student Assistance</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                </div>

                {/* Row 3: Message Textarea */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Your Detailed Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Please enter your query, research interest, or feedback here..."
                    className="w-full p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  {formLoading ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>

              </form>
            ) : (
              /* Success Confirmation View */
              <div className="py-8 space-y-4 animate-fade-in">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-extrabold text-slate-900">
                  Message Sent Successfully!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                  Thank you, <strong>{contactName || "Researcher"}</strong>. Your message regarding <em>"{contactSubject}"</em> has been received by our lead research desk. We will respond within 24 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFormSubmitted(false);
                    setContactName("");
                    setContactEmail("");
                    setContactMessage("");
                  }}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
                >
                  Send Another Message
                </button>
              </div>
            )}

          </div>

          {/* Section 2: Direct Contact Details (Inside Card Container) */}
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-5">
            
            <div className="space-y-1 pb-2 border-b border-slate-100 text-center">
              <h3 className="text-lg font-extrabold text-slate-900">Direct Contact Details</h3>
              <p className="text-xs text-slate-500">Academic queries, methodology & dataset permissions</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
              
              {/* Email Item */}
              <div className="space-y-1.5 border-l-2 border-blue-600 pl-4 py-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Official Research Email</span>
                  </div>
                  <button
                    onClick={() => handleCopy("research@aiedu-survey.org", "email")}
                    className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition"
                    title="Copy Email"
                  >
                    {copiedField === "email" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === "email" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <p className="text-sm font-extrabold text-slate-900 pt-0.5">research@aiedu-survey.org</p>
                <p className="text-xs text-slate-500 leading-relaxed">Send dataset proposals, methodology queries, or thesis citations.</p>
              </div>

              {/* Telephone Item */}
              <div className="space-y-1.5 border-l-2 border-emerald-600 pl-4 py-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Helpline Desk</span>
                </div>
                <p className="text-sm font-extrabold text-slate-900 pt-0.5">+91 22 2847 9000 / +91 94220 18250</p>
                <p className="text-xs text-slate-500 leading-relaxed">Direct helpline for institutional coordination & student assistance.</p>
              </div>

            </div>

          </div>

        </div>
      )}

    </section>
  );
};
