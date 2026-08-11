import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  X, 
  User, 
  Mail, 
  Building2, 
  Award, 
  FileText, 
  ShieldCheck, 
  Edit3, 
  Check, 
  Download,
  LogOut,
  Sparkles,
  BookOpen
} from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
  const { user, updateUserProfile, logoutUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Form State initialized from authenticated user
  const [formState, setFormState] = useState({
    name: user?.name || "Dr. Ananya Deshmukh",
    email: user?.email || "ananya.deshmukh@aiedu-research.org",
    institution: user?.institution || "University of Mumbai / Higher Education Cell",
    department: user?.department || "Department of Computer Science & Educational Tech",
    orcid: user?.orcid || "0000-0002-1825-009X",
    bio: user?.bio || "Principal Investigator studying the impact of AI tools on higher education outcomes.",
  });

  useEffect(() => {
    if (user) {
      setFormState({
        name: user.name,
        email: user.email,
        institution: user.institution,
        department: user.department,
        orcid: user.orcid || "0000-0002-1825-009X",
        bio: user.bio || "Principal Investigator studying the impact of AI tools on higher education outcomes.",
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile(formState);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 relative overflow-hidden max-h-[94dvh] flex flex-col">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 sm:p-8 text-white relative shrink-0">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-white shadow-xl text-3xl font-extrabold uppercase">
                {user?.name ? user.name.slice(0, 2) : "AD"}
              </div>
              <span className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-500 text-white rounded-lg shadow-md">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            {/* Profile Header Details */}
            <div className="text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-2xl font-extrabold text-white">{user?.name || "Dr. Ananya Deshmukh"}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-blue-100 border border-white/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  {user?.role || "Researcher"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100">{user?.department || "Department of Computer Science"}</p>
              <p className="text-xs text-blue-200/80">{user?.institution || "University of Mumbai"}</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* Activity Stats Cards */}
          <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Surveys</span>
              <p className="text-xl sm:text-2xl font-extrabold text-blue-900 mt-0.5">{user?.surveysManaged || 12}</p>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Responses</span>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-900 mt-0.5">532</p>
            </div>

            <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Access Level</span>
              <p className="text-xs sm:text-sm font-bold text-purple-900 mt-2.5">
                {user?.role === "Student" ? "Student Participant" : "Full Admin"}
              </p>
            </div>
          </div>

          {!isEditing ? (
            /* View Mode */
            <div className="space-y-5">
              
              {/* Details List */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3.5 text-xs sm:text-sm">
                
                <div className="flex items-center gap-3 text-slate-700">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-semibold text-slate-500 w-28">Email:</span>
                  <span className="font-bold text-slate-900">{user?.email}</span>
                </div>

                <div className="flex items-center gap-3 text-slate-700">
                  <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-semibold text-slate-500 w-28">Institution:</span>
                  <span className="font-bold text-slate-900">{user?.institution}</span>
                </div>

                <div className="flex items-center gap-3 text-slate-700">
                  <Award className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-semibold text-slate-500 w-28">ORCID iD:</span>
                  <span className="font-bold text-blue-700 underline">{user?.orcid || "0000-0002-1825-009X"}</span>
                </div>

                <div className="flex items-start gap-3 text-slate-700">
                  <BookOpen className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="font-semibold text-slate-500 w-28 shrink-0">Research Bio:</span>
                  <span className="font-medium text-slate-800">{user?.bio || "Principal Investigator studying the impact of AI tools on higher education outcomes."}</span>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-2 transition"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>

                <div className="flex items-center gap-2">
                  {onLogout && (
                    <button
                      onClick={() => {
                        onLogout();
                        onClose();
                      }}
                      className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  )}

                  <button
                    onClick={onClose}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition"
                  >
                    Close
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* Edit Mode Form */
            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Institutional Email</label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ORCID iD</label>
                  <input
                    type="text"
                    value={formState.orcid}
                    onChange={(e) => setFormState({ ...formState, orcid: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Institution Name</label>
                <input
                  type="text"
                  required
                  value={formState.institution}
                  onChange={(e) => setFormState({ ...formState, institution: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Research Bio</label>
                <textarea
                  rows={3}
                  value={formState.bio}
                  onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
