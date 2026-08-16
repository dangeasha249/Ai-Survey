"use client";

import React, { useState, useEffect } from "react";
import {
  Lock,
  Database,
  Download,
  Trash2,
  Search,
  RefreshCw,
  Eye,
  CheckCircle2,
  BarChart3,
  Users,
  FileSpreadsheet,
  LogOut,
  Sparkles,
  SlidersHorizontal,
  Building2,
} from "lucide-react";
import { AnalyticsCharts } from "@/components/Dashboard/AnalyticsCharts";
import { useAuth } from "@/context/AuthContext";

interface ResponseItem {
  id: string;
  mongoId?: string;
  course: string;
  year: string;
  usesAI: string;
  primaryTool: string;
  toolsUsed?: string[];
  frequency?: string;
  purposes?: string[];
  likertRatings?: Record<string, number>;
  challenges?: string[];
  verify?: string;
  workshop?: string;
  training?: string;
  opinion?: string;
  timestamp: string;
  impactRating?: number;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "Student" | "Researcher";
  institution?: string;
  department?: string;
  createdAt: string;
}

export const AdminPanel: React.FC = () => {
  const { user, isAuthenticated: isUserLoggedIn } = useAuth();
  const [pinGranted, setPinGranted] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const isStudent = isUserLoggedIn && user?.role === "Student";
  const isResearcher = isUserLoggedIn && user?.role === "Researcher";
  const isAccessGranted = isResearcher || (pinGranted && !isStudent);

  const [activeTab, setActiveTab] = useState<"responses" | "users" | "analytics">("responses");
  const [responses, setResponses] = useState<ResponseItem[]>([]);
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState("all");
  const [selectedAiFilter, setSelectedAiFilter] = useState("all");

  const [selectedResponse, setSelectedResponse] = useState<ResponseItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAccessGranted) {
      fetchResponses();
      fetchUsers();
    }
  }, [isAccessGranted]);

  // Admin PIN Passcode check
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "1234" || pinInput === "admin123" || pinInput.toLowerCase() === "admin") {
      setPinGranted(true);
      setPinError(false);
      fetchResponses();
      fetchUsers();
    } else {
      setPinError(true);
    }
  };

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin");
      if (res.ok) {
        const json = await res.json();
        if (json.responses) {
          setResponses(json.responses);
        }
      }
    } catch {
      setActionMessage("Error loading responses data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const json = await res.json();
        if (json.users) {
          setUsersList(json.users);
        }
      }
    } catch {
      // Quiet fail
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user account "${userName}"?`)) return;
    setDeletingUserId(userId);
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setActionMessage(`User "${userName}" deleted successfully.`);
        fetchUsers();
      } else {
        setActionMessage(json.message || "Failed to delete user.");
      }
    } catch {
      setActionMessage("Error deleting user.");
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleToggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "Researcher" ? "Student" : "Researcher";
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateRole", userId, newRole }),
      });
      const json = await res.json();
      if (json.success) {
        setActionMessage(`Role updated to ${newRole}.`);
        fetchUsers();
      }
    } catch {}
  };



  const handleDelete = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete response ${id}? This action cannot be undone.`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setResponses(prev => prev.filter(r => r.id !== id));
        setActionMessage(`Response ${id} deleted successfully.`);
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch {
      alert("Failed to delete response.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportCSV = () => {
    window.open("/api/admin/export", "_blank");
  };

  // Filtered responses list
  const filteredResponses = responses.filter(r => {
    const matchesSearch = r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.primaryTool.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCourse = selectedCourseFilter === "all" || r.course.includes(selectedCourseFilter);
    const matchesAi = selectedAiFilter === "all" || r.usesAI === selectedAiFilter;

    return matchesSearch && matchesCourse && matchesAi;
  });

  const totalCount = responses.length;
  const aiUsersCount = responses.filter(r => r.usesAI === "Yes").length;
  const nonAiCount = totalCount - aiUsersCount;
  const aiPercentage = totalCount ? ((aiUsersCount / totalCount) * 100).toFixed(1) : "0";

  // 1. If user is a Student account, display 404 Page Not Found (Page Unavailable)
  if (isStudent) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6 animate-fade-in">
        <div className="space-y-3 max-w-md">
          <h1 className="text-7xl sm:text-8xl font-black text-slate-200 tracking-tight">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Page Not Found / Page Unavailable
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            The requested page <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono text-xs">/admin</code> could not be found or is not available on this server.
          </p>
        </div>

        <div className="pt-2">
          <a
            href="/"
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition shadow-sm inline-flex items-center gap-2"
          >
            <span>Return to Home Page</span>
          </a>
        </div>
      </div>
    );
  }

  // 2. Lock Screen for unauthenticated guests
  if (!isAccessGranted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl p-7 border border-slate-200 shadow-sm space-y-5 text-center animate-fade-in">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">
              Admin Access
            </h2>
            <p className="text-xs text-slate-500">
              Enter your passcode to manage survey responses and export datasets.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-3">
            <div className="text-left">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Passcode (e.g. 1234)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            {pinError && (
              <p className="text-xs font-semibold text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                Incorrect passcode. (Try <strong>1234</strong>)
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition shadow-sm"
            >
              Enter Admin Portal
            </button>
          </form>

          <p className="text-[11px] text-slate-400">
            Passcode: <code>1234</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 space-y-8 animate-fade-in">
      
      {/* Header Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Academic Research Administration</span>
            <span>•</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Database Online
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Survey Responses & Dataset Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage research participant entries, view response details, and export raw CSV files.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchResponses}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition"
            title="Reload responses"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setPinGranted(false)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            title="Lock Panel"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Participants</span>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-extrabold text-slate-900">{totalCount}</p>
            <Database className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-xs text-slate-500">Recorded response entries</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">AI Tool Adoption Rate</span>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-extrabold text-slate-900">{aiPercentage}%</p>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-xs text-slate-500">{aiUsersCount} active AI users</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Non-AI Participants</span>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-extrabold text-slate-900">{nonAiCount}</p>
            <Users className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-xs text-slate-500">Traditional study workflow</p>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("responses")}
          className={`pb-2 px-1 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === "responses"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Responses Table ({filteredResponses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`pb-2 px-1 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === "users"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="w-4 h-4 text-blue-600" />
          <span>User Management ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`pb-2 px-1 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === "analytics"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics Overview</span>
        </button>
      </div>

      {/* TAB 1: Responses Table */}
      {activeTab === "responses" && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row justify-between gap-3">
            
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by ID, course, or tool..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-slate-400 pl-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </div>
              <select
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">All Courses</option>
                <option value="B.Sc. CS">B.Sc. CS</option>
                <option value="B.Sc. IT">B.Sc. IT</option>
                <option value="BCA">BCA</option>
                <option value="B.Com">B.Com</option>
                <option value="B.A.">B.A.</option>
              </select>

              <select
                value={selectedAiFilter}
                onChange={(e) => setSelectedAiFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">All Participants</option>
                <option value="Yes">AI Users Only</option>
                <option value="No">Non-AI Users Only</option>
              </select>
            </div>

          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Response ID</th>
                    <th className="px-5 py-3.5">Course</th>
                    <th className="px-5 py-3.5">Year</th>
                    <th className="px-5 py-3.5">AI User</th>
                    <th className="px-5 py-3.5">Primary Tool</th>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredResponses.length > 0 ? (
                    filteredResponses.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                          {r.id}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-slate-800">
                          {r.course}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500">
                          {r.year}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                            r.usesAI === "Yes" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : "bg-slate-100 text-slate-600"
                          }`}>
                            {r.usesAI}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-medium text-slate-800">
                          {r.primaryTool}
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 text-[11px] whitespace-nowrap">
                          {r.timestamp}
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap space-x-1">
                          <button
                            onClick={() => setSelectedResponse(r)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition"
                          >
                            View
                          </button>

                          <button
                            onClick={() => handleDelete(r.id)}
                            disabled={deletingId === r.id}
                            className="p-1 text-slate-400 hover:text-red-600 transition inline-flex items-center"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                        No responses match the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: User Management Table */}
      {activeTab === "users" && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Search Controls */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="Search user by name or email..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>

            <button
              onClick={fetchUsers}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Users</span>
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200/80 font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">User Name</th>
                    <th className="px-5 py-3">Email Address</th>
                    <th className="px-5 py-3">Account Role</th>
                    <th className="px-5 py-3">Institution</th>
                    <th className="px-5 py-3">Registered Date</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {usersList.filter((u) =>
                    u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                    u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
                  ).length > 0 ? (
                    usersList
                      .filter((u) =>
                        u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                        u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
                      )
                      .map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition">
                          <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                              {u.name.slice(0, 1).toUpperCase()}
                            </div>
                            <span>{u.name}</span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-700">
                            {u.email}
                          </td>
                          <td className="px-5 py-3.5">
                            <button
                              onClick={() => handleToggleUserRole(u.id, u.role)}
                              title="Click to toggle role"
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition ${
                                u.role === "Researcher"
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              }`}
                            >
                              {u.role}
                            </button>
                          </td>
                          <td className="px-5 py-3.5 text-slate-600">
                            {u.institution || "Not Specified"}
                          </td>
                          <td className="px-5 py-3.5 text-slate-400 text-[11px] whitespace-nowrap">
                            {u.createdAt}
                          </td>
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              disabled={deletingUserId === u.id}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ml-auto"
                              title="Delete user account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                        No registered users found in MongoDB database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: Analytics Overview */}
      {activeTab === "analytics" && (
        <div className="space-y-4 animate-fade-in">
          <AnalyticsCharts />
        </div>
      )}

      {/* View Response Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden space-y-4 p-6">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Response Details: {selectedResponse.id}
                </h3>
                <p className="text-xs text-slate-400">Submitted {selectedResponse.timestamp}</p>
              </div>
              <button
                onClick={() => setSelectedResponse(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-800">Academic Profile</h4>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div><strong>Course:</strong> {selectedResponse.course}</div>
                  <div><strong>Year of Study:</strong> {selectedResponse.year}</div>
                  <div><strong>Aware of AI:</strong> Yes</div>
                  <div><strong>Uses AI Tools:</strong> {selectedResponse.usesAI}</div>
                </div>
              </div>

              <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-800">AI Usage & Frequency</h4>
                <div className="space-y-1 text-slate-600">
                  <p><strong>Primary Tool:</strong> {selectedResponse.primaryTool}</p>
                  <p><strong>Usage Frequency:</strong> {selectedResponse.frequency || "N/A"}</p>
                  {selectedResponse.toolsUsed && selectedResponse.toolsUsed.length > 0 && (
                    <div>
                      <strong>All Tools Used:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedResponse.toolsUsed.map(t => (
                          <span key={t} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded text-[11px] font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedResponse.challenges && selectedResponse.challenges.length > 0 && (
                <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-slate-800">Reported Challenges</h4>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {selectedResponse.challenges.map(ch => (
                      <span key={ch} className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200/60 rounded text-[11px]">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-600">
                <h4 className="font-bold text-slate-800 mb-1">Verification & Training</h4>
                <p><strong>Verifies Information:</strong> {selectedResponse.verify || "N/A"}</p>
                <p><strong>Attended Workshop:</strong> {selectedResponse.workshop || "N/A"}</p>
                <p><strong>Needs Formal Training:</strong> {selectedResponse.training || "N/A"}</p>
                <p><strong>Overall Opinion:</strong> {selectedResponse.opinion || "N/A"}</p>
              </div>

            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedResponse(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
