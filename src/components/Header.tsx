import React, { useState } from "react";
import { GraduationCap, Sparkles, FileEdit, User, Menu, X, LogIn } from "lucide-react";
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
  const { user, isAuthenticated } = useAuth();

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About Study" },
    { id: "contact", label: "Contact" },
  ];

  const handleNavClick = (id: string) => {
    const routes: Record<string, string> = {
      home: "/",
      about: "/about",
      survey: "/survey",
      instructions: "/instructions",
      faqs: "/faqs",
      contact: "/contact",
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

          {/* Action Buttons & Mobile Menu Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <button
                onClick={onOpenProfile}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all duration-200 active:scale-95 flex items-center gap-2"
                title="View Account Profile"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-extrabold flex items-center justify-center uppercase">
                  {user?.name ? user.name.slice(0, 1) : "A"}
                </div>
                <span className="hidden sm:inline font-bold">{user?.name ? user.name.split(" ")[0] : "Profile"}</span>
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all duration-200 active:scale-95 flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4 text-blue-600" />
                <span>Sign In</span>
              </button>
            )}

            <button
              onClick={onOpenSurvey}
              className="px-3 sm:px-4 py-2 min-h-10 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/25 transition-all duration-200 active:scale-95 flex items-center gap-2 whitespace-nowrap"
            >
              <FileEdit className="w-4 h-4 hidden sm:inline" />
              <span className="hidden xs:inline">Start Survey</span><span className="xs:hidden">Survey</span>
            </button>

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
