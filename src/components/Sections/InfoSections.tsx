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
  Globe
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
      a: "This study evaluates the adoption, effectiveness, and overall pedagogical impact of Artificial Intelligence tools (like ChatGPT, Gemini, and Grammarly) among undergraduate students across institutions in Maharashtra, India."
    },
    {
      q: "Is my personal identity or response data kept confidential?",
      a: "Yes, 100%. All responses are completely anonymous, encrypted, and processed strictly for aggregate academic research purposes."
    },
    {
      q: "Who is eligible to participate in the survey?",
      a: "Undergraduate students enrolled in B.Sc. CS, B.Sc. IT, BCA, B.Com, B.A., or related higher education programs across Maharashtra."
    },
    {
      q: "How long does it take to fill out the questionnaire?",
      a: "The survey comprises structured multiple-choice questions and takes approximately 10 to 15 minutes to complete."
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
      
      {/* ---------------- REDESIGNED: ABOUT STUDY, INSTRUCTIONS & FAQS ---------------- */}
      {(activeSection === "about" || activeSection === "instructions" || activeSection === "faqs" || activeSection === "all") && (
        <div id="about-study-merged" className="space-y-10 animate-fade-in">

          {/* Section 1: 4 Research Pillar Cards Grid */}
          <div id="about" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">Key Research Dimensions</h3>
                <p className="text-xs text-slate-500">Methodology & Academic Focus Areas</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Pillar 1 */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-3 hover:shadow-lg transition">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-extrabold text-slate-900">Pedagogical & Learning Impact</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Evaluates how AI tools assist concept comprehension, self-paced study routines, time optimization, revision summaries, and exam preparation across CS, IT, Commerce, and Arts streams.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-3 hover:shadow-lg transition">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-extrabold text-slate-900">Faculty Integration & Teaching</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Investigates educator adoption of AI for preparing teaching aids, generating interactive classroom materials, offering prompt student feedback, and facilitating personalized instruction.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-3 hover:shadow-lg transition">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-extrabold text-slate-900">Challenges, Risks & Overdependence</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Addresses critical concerns regarding hallucinated information, reduction in critical independent thinking, academic integrity, plagiarism risks, and student data privacy safeguards.
                </p>
              </div>

              {/* Pillar 4 */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-3 hover:shadow-lg transition">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-extrabold text-slate-900">Demographic & Regional Scope</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Gathers empirical insights from undergraduate students in both rural and urban institutions across Latur district (*Latur, Ausa, Ahmedpur, Udgir, Nilanga, Chakur, Deoni, Jalkot, Renapur, Shirur Anantpal*).
                </p>
              </div>

            </div>
          </div>

          {/* Section 2: Step-by-step Survey Instructions & Participation Workflow */}
          <div id="instructions" className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-md space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Participation Workflow & Instructions</h3>
                <p className="text-xs text-slate-500">3 Simple Steps to Complete the Questionnaire</p>
              </div>

              <button
                onClick={onStartSurvey}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-2"
              >
                <span>Start Survey Now</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 relative">
                <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                  1
                </span>
                <h4 className="font-extrabold text-slate-900 text-base">Select Your Institution</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Select your college, taluka location, course stream (B.Sc. CS/IT, BCA, B.Com, B.A.), and year of study in Section A.
                </p>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 relative">
                <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                  2
                </span>
                <h4 className="font-extrabold text-slate-900 text-base">Complete 10 Sections</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Rate statements on a scale of 1 (Strongly Disagree) to 5 (Strongly Agree) across AI awareness, benefits, risks, and perception.
                </p>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 relative">
                <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                  3
                </span>
                <h4 className="font-extrabold text-slate-900 text-base">Instant Real-time Sync</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Submit your response to immediately contribute to the aggregated research analytics and institutional policy reports.
                </p>
              </div>

            </div>
          </div>

          {/* Section 3: Frequently Asked Questions (FAQs) Accordion */}
          <div id="faqs" className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-md space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Frequently Asked Questions</h3>
                <p className="text-xs text-slate-500">Ethics, Privacy & Eligibility Guidelines</p>
              </div>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-slate-800 flex justify-between items-center bg-slate-50/70 hover:bg-slate-100 text-sm sm:text-base"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? "rotate-180 text-blue-600" : ""}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="p-5 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ---------------- REDESIGNED CONTACT SECTION ---------------- */}
      {(activeSection === "contact" || activeSection === "all") && (
        <div id="contact" className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl space-y-8 animate-fade-in relative overflow-hidden">
          
          {/* Top Decorative Banner Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200/80 rounded-full text-xs font-bold text-blue-700">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Direct Academic Desk</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Connect with the Research Cell
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
                Have questions regarding the survey methodology, dataset access requests, or institutional participation across Maharashtra? Our lead academic desk is at your service.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl shrink-0">
              <Clock className="w-4 h-4 text-emerald-600" />
              <div className="text-xs">
                <p className="font-bold text-slate-800">Desk Hours</p>
                <p className="text-slate-500">Mon - Sat: 09:00 AM - 05:00 PM IST</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Side: Contact Information Cards */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Card 1: Email */}
              <div className="p-5 bg-gradient-to-br from-blue-50/70 to-indigo-50/50 border border-blue-100 rounded-2xl space-y-3 relative group transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700">Official Research Email</h4>
                      <p className="text-sm font-extrabold text-slate-900">research@aiedu-survey.org</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy("research@aiedu-survey.org", "email")}
                    className="p-2 rounded-xl bg-white text-slate-600 hover:text-blue-600 border border-slate-200 shadow-sm transition"
                    title="Copy Email"
                  >
                    {copiedField === "email" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-600">
                  Send dataset access proposals, methodology queries, or thesis citations.
                </p>
              </div>

              {/* Card 2: Location / Address */}
              <div className="p-5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3 relative group transition-all hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-md">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Research Headquarters</h4>
                    <p className="text-sm font-extrabold text-slate-900">Higher Education Academic Cell</p>
                    <p className="text-xs text-slate-600">
                      Rajarshi Shahu Mahavidyalaya (Autonomous) & Partner Campuses, Latur District, Maharashtra 413512
                    </p>
                  </div>
                </div>
                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-blue-600">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Covering 10 Talukas & 42 Higher Education Colleges</span>
                </div>
              </div>

              {/* Card 3: Direct Telephone */}
              <div className="p-5 bg-gradient-to-br from-emerald-50/70 to-teal-50/50 border border-emerald-100 rounded-2xl space-y-3 relative group transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Helpline Desk</h4>
                      <p className="text-sm font-extrabold text-slate-900">+91 22 2847 9000 / +91 94220 18250</p>
                    </div>
                  </div>

                  <a
                    href="tel:+912228479000"
                    className="p-2 rounded-xl bg-white text-emerald-600 border border-slate-200 shadow-sm hover:bg-emerald-50 transition"
                    title="Call Desk"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-xs text-slate-600">
                  Institutional coordination & student survey assistance.
                </p>
              </div>

            </div>

            {/* Right Side: Redesigned Interactive Inquiry Form */}
            <div className="lg:col-span-7 bg-slate-50/80 p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm relative">
              
              {!formSubmitted ? (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <h3 className="text-base font-extrabold text-slate-900">Send an Inquiry to the Team</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Dr. Rajesh Sharma"
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="rajesh@college.edu"
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Institution / College Name</label>
                      <input
                        type="text"
                        value={contactOrg}
                        onChange={(e) => setContactOrg(e.target.value)}
                        placeholder="e.g. RSML Latur"
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Topic</label>
                      <select
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      >
                        <option value="General Research Inquiry">General Research Inquiry</option>
                        <option value="Research Dataset Access">Research Dataset Access</option>
                        <option value="Methodology & Questionnaire">Methodology & Questionnaire</option>
                        <option value="Institutional Partnership">Institutional Partnership</option>
                        <option value="Student Assistance">Student Assistance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Message</label>
                    <textarea
                      rows={4}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Please specify your message, research interest, or feedback..."
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    {formLoading ? (
                      <span>Sending Inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message to Research Cell</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Success Confirmation View */
                <div className="text-center py-8 space-y-4 animate-fade-in">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-extrabold text-slate-900">
                    Message Sent Successfully!
                  </h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
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
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </section>
  );
};

