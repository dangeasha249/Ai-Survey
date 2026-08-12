import React, { useState, useEffect, useRef } from "react";
import { GraduationCap, Sparkles, FileEdit, User, Menu, X, LogIn, LogOut, ShieldCheck, CheckCircle2, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onOpenLogin?: () => void;
  onOpenSurvey: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  setActiveSection,
  onOpenLogin,
  onOpenSurvey,
  onOpenProfile,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);
  const profilePanelRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logoutUser } = useAuth();

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About Study" },
    { id: "contact", label: "Contact" },
  ];

  // Close floating profile panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profilePanelRef.current && !profilePanelRef.current.contains(e.target as Node)) {
        setIsProfilePanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (id: string) => {
    const routes: Record<string, string> = {
      home: "/",
      about: "/about",
      survey: "/survey",
      instructions: "/instructions",
      faqs: "/faqs",
      contact: "/contact",
      admin: "/admin",
    };
    if (routes[id]) {
      window.location.assign(routes[id]);
      return;
    }
    setActiveSection(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-2 h-16 sm:h-20">
          
          {/* Brand / Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavClick("home")}
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6" />
              <Sparkles className="w-3 h-3 absolute top-1.5 right-1.5 text-blue-200" />
            </div>
            <span className="hidden min-[430px]:block text-lg sm:text-2xl font-extrabold text-blue-900 tracking-tight truncate">
              AI-Edu Impact Survey
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-2 text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? "text-blue-600 font-bold"
                      : "text-slate-600 hover:text-blue-600"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-full animate-fade-in" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons & Profile Icon */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Start Survey Button */}
            <button
              onClick={onOpenSurvey}
              className="px-3 sm:px-4 py-2 min-h-10 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/25 transition-all duration-200 active:scale-95 flex items-center gap-2 whitespace-nowrap"
            >
              <FileEdit className="w-4 h-4 hidden sm:inline" />
              <span className="hidden xs:inline">Start Survey</span><span className="xs:hidden">Survey</span>
            </button>

            {/* Profile Icon with Floating Panel */}
            <div className="relative" ref={profilePanelRef}>
              <button
                onClick={() => setIsProfilePanelOpen(!isProfilePanelOpen)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/90 flex items-center justify-center text-slate-700 shadow-sm transition-all duration-200 active:scale-95 group"
                title="User Profile & Account Options"
              >
                {user?.name ? (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center uppercase shadow-sm">
                    {user.name.slice(0, 1)}
                  </div>
                ) : (
                  <User className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition" />
                )}
              </button>

              {/* Floating Profile Panel */}
              {isProfilePanelOpen && (
                <div className="absolute right-0 top-12 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-4">
                  
                  {isAuthenticated ? (
                    <>
                      {/* User Profile Header Card */}
                      <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-base flex items-center justify-center shrink-0 uppercase shadow-sm">
                          {user?.name ? user.name.slice(0, 1) : "A"}
                        </div>
                        <div className="overflow-hidden space-y-0.5">
                          <h4 className="text-sm font-extrabold text-slate-900 truncate">
                            {user?.name}
                          </h4>
                          <p className="text-xs text-slate-500 truncate">
                            {user?.email}
                          </p>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-700">
                            {user?.role === "Researcher" ? <ShieldCheck className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                            <span>{user?.role ? `${user.role} Mode` : "Verified Participant"}</span>
                          </span>
                        </div>
                      </div>

                      {/* Details / Institution */}
                      <div className="text-xs space-y-1.5 px-1 font-medium text-slate-600">
                        {user?.institution && (
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-400">Institution</span>
                            <span className="font-bold text-slate-800 truncate max-w-[150px]">{user.institution}</span>
                          </div>
                        )}
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-400">Survey Status</span>
                          <span className="font-bold text-amber-600">Ready to Take</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2 pt-1">
                        <button
                          onClick={() => {
                            setIsProfilePanelOpen(false);
                            onOpenProfile();
                          }}
                          className="w-full py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
                        >
                          <User className="w-4 h-4" />
                          <span>View Full Profile Details</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfilePanelOpen(false);
                            logoutUser();
                          }}
                          className="w-full py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out Account</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Guest Welcome View */
                    <div className="space-y-3.5 text-center p-1">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-sm">
                        <User className="w-6 h-6" />
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-base font-extrabold text-slate-900">
                          Welcome, Academic Guest
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Sign In or Create an Account to participate in the AI Impact Survey and record your responses.
                        </p>
                      </div>

                      <div className="space-y-2 pt-1">
                        <button
                          onClick={() => {
                            setIsProfilePanelOpen(false);
                            if (onOpenLogin) onOpenLogin();
                          }}
                          className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition"
                        >
                          <LogIn className="w-4 h-4" />
                          <span>Sign In / Create Account</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 bg-white/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1.5 px-2">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
