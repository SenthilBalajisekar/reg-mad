"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Lock, 
  Trash2, 
  RefreshCw, 
  Download, 
  Search, 
  Users, 
  ShieldCheck, 
  AlertTriangle,
  User,
  Phone,
  Mail,
  FileSpreadsheet,
  CheckCircle,
  Eye
} from "lucide-react";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChange?: () => void;
}

interface Participant {
  id?: number;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  year: number;
  studentId: string;
}

interface Registration {
  registrationId: string;
  status: string;
  registeredAt: string;
  teamName: string;
  track: string;
  problemStatement: string;
  technologyStack: string;
  leader: Participant | null;
  members: Participant[];
  totalMembersCount: number;
}

export default function AdminModal({ isOpen, onClose, onDataChange }: AdminModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<Registration | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isResettingAll, setIsResettingAll] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Reset local auth on open if needed
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchRegistrations();
    }
  }, [isOpen, isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsAuthenticating(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/registrations/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setPassword("");
        fetchRegistrations();
      } else {
        setAuthError(data.error || "Invalid admin password.");
      }
    } catch (err) {
      setAuthError("Failed to connect to backend server. Make sure backend is running.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/registrations/admin/all`);
      const data = await res.json();
      if (res.ok) {
        setRegistrations(data.registrations || []);
      } else {
        setError(data.error || "Failed to fetch registrations.");
      }
    } catch (err) {
      setError("Cannot fetch registrations. Backend server unreachable.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (regId: string, teamName: string) => {
    if (!confirm(`Are you sure you want to remove team "${teamName}" (${regId})? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(regId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/registrations/${regId}`, {
        method: "DELETE"
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setActionSuccess(`Team "${teamName}" removed successfully.`);
        setTimeout(() => setActionSuccess(""), 4000);
        fetchRegistrations();
        if (onDataChange) onDataChange();
      } else {
        alert(data.error || "Failed to delete team.");
      }
    } catch (err) {
      alert("Error executing delete request.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleResetAll = async () => {
    if (!confirm("WARNING: Are you sure you want to CLEAR ALL REGISTERED TEAMS? This will wipe all registration records permanently!")) {
      return;
    }

    setIsResettingAll(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/registrations/reset/all`, {
        method: "DELETE"
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setActionSuccess("All registered teams have been cleared.");
        setTimeout(() => setActionSuccess(""), 4000);
        fetchRegistrations();
        if (onDataChange) onDataChange();
      } else {
        alert(data.error || "Failed to reset registrations.");
      }
    } catch (err) {
      alert("Error resetting database.");
    } finally {
      setIsResettingAll(false);
    }
  };

  const exportToCSV = () => {
    if (registrations.length === 0) return;

    const headers = [
      "Registration ID",
      "Registered At",
      "Team Name",
      "Track",
      "Total Members",
      "Leader Name",
      "Leader Email",
      "Leader Phone",
      "Leader Dept",
      "Leader Student ID",
      "Members Details"
    ];

    const rows = registrations.map(r => [
      `"${r.registrationId}"`,
      `"${new Date(r.registeredAt).toLocaleString()}"`,
      `"${r.teamName.replace(/"/g, '""')}"`,
      `"${r.track}"`,
      r.totalMembersCount,
      `"${r.leader?.fullName || ''}"`,
      `"${r.leader?.email || ''}"`,
      `"${r.leader?.phone || ''}"`,
      `"${r.leader?.department || ''}"`,
      `"${r.leader?.studentId || ''}"`,
      `"${r.members.map(m => `${m.fullName} (${m.email}, ${m.phone})`).join('; ')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Registered_Teams_MAC_2026_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRegistrations = registrations.filter(r => {
    const query = searchQuery.toLowerCase();
    return (
      r.teamName.toLowerCase().includes(query) ||
      r.registrationId.toLowerCase().includes(query) ||
      r.track.toLowerCase().includes(query) ||
      (r.leader && r.leader.fullName.toLowerCase().includes(query)) ||
      (r.leader && r.leader.email.toLowerCase().includes(query)) ||
      (r.leader && r.leader.studentId.toLowerCase().includes(query))
    );
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-white flex flex-col w-screen h-screen overflow-hidden text-slate-900 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          className="w-full h-full flex flex-col overflow-hidden bg-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-amber-400">
                <Lock size={18} />
              </div>
              <div>
                <h3 className="font-orbitron text-base font-bold text-slate-900 tracking-wider">
                  ADMIN PORTAL
                </h3>
                <span className="text-[10px] font-mono text-slate-500 font-medium">
                  Mobile App Club Hackathon Management
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated && (
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="text-xs font-mono text-slate-600 hover:text-red-600 px-3 py-1.5 rounded border border-slate-200 bg-white font-bold transition-colors"
                >
                  LOGOUT
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-slate-200/70 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          {!isAuthenticated ? (
            /* Auth Login Screen */
            <div className="p-8 md:p-12 flex flex-col items-center justify-center text-center gap-6">
              <div className="w-16 h-16 rounded-full bg-violet-100 border-2 border-violet-300 flex items-center justify-center text-violet-700 shadow-md">
                <ShieldCheck size={32} />
              </div>
              
              <div className="max-w-md flex flex-col gap-1">
                <h4 className="font-orbitron text-xl font-extrabold text-slate-900">
                  Authentication Required
                </h4>
                <p className="text-xs text-slate-600 font-sans">
                  Enter the admin passcode to access team registrations, view participant details, and manage records.
                </p>
              </div>

              <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-mono text-slate-700 uppercase font-bold">
                    Admin Passcode
                  </label>
                  <input
                    type="password"
                    placeholder="Enter admin password (e.g. admin123)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-violet-600 focus:bg-white transition-all font-sans"
                    autoFocus
                  />
                </div>

                {authError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-mono flex items-center gap-2">
                    <AlertTriangle size={14} className="shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAuthenticating || !password}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-700 to-violet-700 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-md hover:from-blue-800 hover:to-violet-800 transition-all disabled:opacity-50"
                >
                  {isAuthenticating ? "AUTHENTICATING..." : "ACCESS ADMIN DASHBOARD"}
                </button>
              </form>
            </div>
          ) : (
            /* Dashboard Management Interface */
            <div className="flex-grow flex flex-col overflow-hidden p-6 gap-5 bg-white">
              {/* Action Banner */}
              {actionSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-600" />
                    <span className="font-bold">{actionSuccess}</span>
                  </div>
                  <button onClick={() => setActionSuccess("")} className="text-emerald-700 hover:text-emerald-950 font-bold text-xs">
                    DISMISS
                  </button>
                </div>
              )}

              {/* Controls Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-72">
                    <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search team, leader, email, track..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-xs font-sans focus:outline-none focus:border-violet-600 focus:bg-white"
                    />
                  </div>
                  <button
                    onClick={fetchRegistrations}
                    title="Refresh List"
                    className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-300"
                  >
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                  </button>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    TOTAL: <span className="text-blue-700 font-extrabold">{registrations.length}</span> TEAMS
                  </span>

                  <button
                    onClick={exportToCSV}
                    disabled={registrations.length === 0}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold tracking-wider transition-all disabled:opacity-50 shadow-sm"
                  >
                    <FileSpreadsheet size={15} />
                    EXPORT CSV
                  </button>

                  <button
                    onClick={handleResetAll}
                    disabled={registrations.length === 0 || isResettingAll}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-mono font-bold transition-all disabled:opacity-40"
                  >
                    <Trash2 size={14} />
                    RESET ALL
                  </button>
                </div>
              </div>

              {/* Error state */}
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-sans">
                  {error}
                </div>
              )}

              {/* Registrations List / Table */}
              <div className="flex-grow overflow-y-auto pr-1">
                {loading ? (
                  <div className="py-20 text-center font-mono text-xs text-slate-500">
                    Loading registrations...
                  </div>
                ) : filteredRegistrations.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center gap-2">
                    <Users size={32} className="text-slate-300" />
                    <span className="font-mono text-xs text-slate-500 font-bold">
                      {searchQuery ? "No teams matched your search query." : "No registered teams found."}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filteredRegistrations.map((reg) => (
                      <div
                        key={reg.registrationId}
                        className="p-4 md:p-5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
                      >
                        {/* Team Basic Info */}
                        <div className="flex flex-col gap-1.5 flex-grow">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-orbitron font-extrabold text-sm md:text-base text-slate-900">
                              {reg.teamName}
                            </span>
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800 border border-blue-200">
                              {reg.registrationId}
                            </span>
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-violet-100 text-violet-800 border border-violet-200">
                              {reg.track}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-700">
                              {reg.totalMembersCount} Members
                            </span>
                          </div>

                          {/* Leader summary */}
                          {reg.leader && (
                            <div className="flex items-center gap-4 text-xs font-sans text-slate-600 flex-wrap">
                              <span className="flex items-center gap-1 font-semibold text-slate-800">
                                <User size={13} className="text-violet-600" />
                                Leader: {reg.leader.fullName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Mail size={13} className="text-slate-400" />
                                {reg.leader.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone size={13} className="text-slate-400" />
                                {reg.leader.phone}
                              </span>
                              <span className="font-mono text-[10px] text-slate-500">
                                ID: {reg.leader.studentId}
                              </span>
                            </div>
                          )}

                          <span className="text-[10px] font-mono text-slate-400">
                            Registered: {new Date(reg.registeredAt).toLocaleString()}
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                          <button
                            onClick={() => setSelectedTeam(reg)}
                            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm transition-all"
                          >
                            <Eye size={14} />
                            VIEW MEMBERS
                          </button>
                          <button
                            onClick={() => handleDeleteTeam(reg.registrationId, reg.teamName)}
                            disabled={deletingId === reg.registrationId}
                            className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm transition-all"
                          >
                            <Trash2 size={14} />
                            REMOVE
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Detailed Team View Modal */}
          {selectedTeam && (
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="font-orbitron text-lg font-bold text-slate-900">
                      {selectedTeam.teamName}
                    </h4>
                    <span className="text-xs font-mono text-blue-700 font-bold">
                      {selectedTeam.registrationId} • Track: {selectedTeam.track}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedTeam(null)}
                    className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Leader Section */}
                {selectedTeam.leader && (
                  <div className="p-4 rounded-lg bg-violet-50/70 border border-violet-200 flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-violet-800 uppercase font-extrabold tracking-widest">
                      TEAM LEADER
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-slate-800">
                      <div><span className="font-bold">Name:</span> {selectedTeam.leader.fullName}</div>
                      <div><span className="font-bold">Email:</span> {selectedTeam.leader.email}</div>
                      <div><span className="font-bold">Phone:</span> {selectedTeam.leader.phone}</div>
                      <div><span className="font-bold">Student ID:</span> {selectedTeam.leader.studentId}</div>
                      <div><span className="font-bold">Department:</span> {selectedTeam.leader.department}</div>
                      <div><span className="font-bold">Year:</span> Year {selectedTeam.leader.year}</div>
                    </div>
                  </div>
                )}

                {/* Members Section */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-mono text-slate-600 uppercase font-bold tracking-widest">
                    TEAM MEMBERS ({selectedTeam.members.length})
                  </span>
                  {selectedTeam.members.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">No additional team members listed.</span>
                  ) : (
                    selectedTeam.members.map((m, idx) => (
                      <div key={idx} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs font-sans">
                        <div className="flex flex-col gap-1.5 flex-grow">
                          <span className="font-bold text-slate-900">Member {idx + 2}: {m.fullName}</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 text-[11px]">
                            <div><span className="font-semibold">Email:</span> {m.email}</div>
                            <div><span className="font-semibold">Phone:</span> {m.phone}</div>
                            <div><span className="font-semibold">Student ID:</span> {m.studentId}</div>
                            <div><span className="font-semibold">Department:</span> {m.department}</div>
                          </div>
                        </div>

                        {m.id && (
                          <button
                            onClick={() => {
                              if (confirm(`Remove member "${m.fullName}" from database?`)) {
                                fetch(`${API_BASE_URL}/api/registrations/participant/${m.id}`, { method: "DELETE" })
                                  .then(r => r.json())
                                  .then(data => {
                                    if (data.success) {
                                      setActionSuccess(`Member "${m.fullName}" deleted from database.`);
                                      setTimeout(() => setActionSuccess(""), 4000);
                                      setSelectedTeam(null);
                                      fetchRegistrations();
                                      if (onDataChange) onDataChange();
                                    } else {
                                      alert(data.error || "Failed to remove member.");
                                    }
                                  });
                              }
                            }}
                            className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[11px] font-mono font-bold shrink-0 transition-colors"
                            title="Delete this participant from database"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setSelectedTeam(null)}
                    className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-mono font-bold"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
