"use client";

import React from "react";
import { 
  LayoutDashboard, 
  FileCheck, 
  BarChart3, 
  PieChart, 
  Download, 
  Users, 
  Settings, 
  LogOut,
  UserCircle
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "responses", label: "Responses", icon: FileCheck },
    { id: "analysis", label: "Survey Analysis", icon: BarChart3 },
    { id: "charts", label: "Charts & Reports", icon: PieChart },
    { id: "export", label: "Export Data", icon: Download },
    { id: "users", label: "Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#0B192C] text-slate-200 p-5 rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        
        {/* Profile Card */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-slate-700/60">
          <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-blue-500/50 flex items-center justify-center text-slate-100 shadow-inner">
            <UserCircle className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white leading-tight">Admin Panel</h3>
            <p className="text-xs text-slate-400 font-medium">Researcher</p>
          </div>
        </div>

        {/* Navigation Options */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="pt-6 border-t border-slate-700/60 mt-6 lg:mt-0">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
