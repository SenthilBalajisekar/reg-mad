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
  FileText,
  CheckCircle,
  Eye
} from "lucide-react";
import { jsPDF } from "jspdf";

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
  const [isRegOpen, setIsRegOpen] = useState(true);
  const [isTogglingReg, setIsTogglingReg] = useState(false);

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

      // Also fetch registration permission setting
      const statsRes = await fetch(`${API_BASE_URL}/api/registrations/dashboard/stats`).catch(() => null);
      if (statsRes && statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.isRegistrationOpen !== undefined) {
          setIsRegOpen(statsData.isRegistrationOpen);
        }
      }
    } catch (err) {
      setError("Cannot fetch registrations. Backend server unreachable.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRegistration = async () => {
    setIsTogglingReg(true);
    const nextVal = !isRegOpen;
    try {
      const res = await fetch(`${API_BASE_URL}/api/registrations/admin/toggle-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOpen: nextVal })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsRegOpen(nextVal);
        setActionSuccess(`Registration portal access set to ${nextVal ? "ON (Opened)" : "OFF (Closed)"}.`);
        setTimeout(() => setActionSuccess(""), 4000);
        if (onDataChange) onDataChange();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("registrationStatusChanged", { detail: { isOpen: nextVal } }));
        }
      } else {
        alert(data.error || "Failed to update registration status.");
      }
    } catch (err) {
      alert("Error connecting to backend server.");
    } finally {
      setIsTogglingReg(false);
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
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("registrationStatusChanged"));
        }
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

  const exportToPDF = () => {
    if (registrations.length === 0) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    let y = 32;

    const addHeader = () => {
      doc.setFillColor(30, 41, 59); // slate-800
      doc.rect(margin, 10, pageWidth - margin * 2, 16, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text("MOBILE APP CLUB HACKATHON 2026 - REGISTERED TEAMS", margin + 4, 18);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(203, 213, 225);
      doc.text(`Generated: ${new Date().toLocaleString()}  |  Total Teams: ${registrations.length}`, margin + 4, 23);

      doc.setTextColor(15, 23, 42);
    };

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - 16) {
        doc.addPage();
        addHeader();
        y = 32;
      }
    };

    addHeader();

    registrations.forEach((r, index) => {
      const memberCount = r.members ? r.members.length : 0;
      const boxHeight = 22 + (memberCount > 0 ? 6 + memberCount * 5.5 : 5);

      checkPageBreak(boxHeight + 5);

      // Card boundary
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, pageWidth - margin * 2, boxHeight, 2, 2, "FD");

      // Card Header
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin, y, pageWidth - margin * 2, 7.5, 2, 2, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${index + 1}. TEAM: ${r.teamName.toUpperCase()}`, margin + 3, y + 5.2);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(37, 99, 235);
      const metaText = `ID: ${r.registrationId} | TRACK: ${r.track}`;
      doc.text(metaText, pageWidth - margin - doc.getTextWidth(metaText) - 3, y + 5.2);

      let innerY = y + 12;

      // Leader
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(109, 40, 217);
      doc.text("Leader:", margin + 3, innerY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      const leaderName = r.leader?.fullName || "N/A";
      const leaderEmail = r.leader?.email || "N/A";
      const leaderPhone = r.leader?.phone || "N/A";
      const leaderDept = r.leader?.department ? `${r.leader.department}` : "";
      const leaderYear = r.leader?.year ? `Yr ${r.leader.year}` : "";
      const leaderId = r.leader?.studentId ? `[ID: ${r.leader.studentId}]` : "";

      doc.text(
        `${leaderName} ${leaderId} | Email: ${leaderEmail} | Phone: ${leaderPhone} | ${leaderDept} ${leaderYear}`,
        margin + 17,
        innerY
      );

      innerY += 5.5;

      // Members
      if (memberCount > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text("Members:", margin + 3, innerY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(51, 65, 85);

        r.members.forEach((m, mIdx) => {
          const mName = m.fullName || "N/A";
          const mEmail = m.email || "N/A";
          const mPhone = m.phone || "N/A";
          const mDept = m.department ? `${m.department}` : "";
          const mId = m.studentId ? `[ID: ${m.studentId}]` : "";
          doc.text(
            `M0${mIdx + 2}: ${mName} ${mId} - ${mEmail} | ${mPhone} ${mDept ? `| ${mDept}` : ""}`,
            margin + 17,
            innerY
          );
          innerY += 5;
        });
      } else {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text("No additional team members listed", margin + 17, innerY);
        innerY += 4.5;
      }

      y += boxHeight + 4;
    });

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 6,
        { align: "center" }
      );
    }

    doc.save(`Registered_Teams_MAC_2026_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportSingleTeamPDF = (team: Registration) => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;

    // Header banner
    doc.setFillColor(30, 41, 59);
    doc.rect(margin, 12, pageWidth - margin * 2, 20, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("MOBILE APP CLUB HACKATHON 2026", margin + 6, 21);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    doc.text("Official Team Registration Card", margin + 6, 27);

    // Team summary box
    let y = 38;
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 24, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(team.teamName.toUpperCase(), margin + 5, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Registration ID: ${team.registrationId}`, margin + 5, y + 14);
    doc.text(`Track: ${team.track} | Total Members: ${team.totalMembersCount}`, margin + 5, y + 20);

    y += 30;

    // Leader box
    if (team.leader) {
      doc.setFillColor(245, 243, 255);
      doc.setDrawColor(196, 181, 253);
      doc.roundedRect(margin, y, pageWidth - margin * 2, 34, 2, 2, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(109, 40, 217);
      doc.text("TEAM LEADER", margin + 5, y + 7);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text(`Full Name: ${team.leader.fullName}`, margin + 5, y + 14);
      doc.text(`Student ID: ${team.leader.studentId || "N/A"}`, margin + 95, y + 14);
      doc.text(`Email: ${team.leader.email}`, margin + 5, y + 20);
      doc.text(`Phone: ${team.leader.phone}`, margin + 95, y + 20);
      doc.text(`Department: ${team.leader.department || "N/A"}`, margin + 5, y + 26);
      doc.text(`Year: Year ${team.leader.year || 1}`, margin + 95, y + 26);

      y += 40;
    }

    // Members box
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`TEAM MEMBERS (${team.members.length})`, margin, y);
    y += 4;

    if (team.members.length === 0) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text("No additional team members listed.", margin, y + 6);
    } else {
      team.members.forEach((m, idx) => {
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(margin, y + 2, pageWidth - margin * 2, 26, 2, 2, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(30, 41, 59);
        doc.text(`Member 0${idx + 2}: ${m.fullName}`, margin + 5, y + 8);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        doc.text(`Email: ${m.email}`, margin + 5, y + 14);
        doc.text(`Phone: ${m.phone}`, margin + 95, y + 14);
        doc.text(`Student ID: ${m.studentId || "N/A"}`, margin + 5, y + 20);
        doc.text(`Department: ${m.department || "N/A"} (Yr ${m.year || 1})`, margin + 95, y + 20);

        y += 28;
      });
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Generated on ${new Date().toLocaleString()} • Mobile App Club Hackathon`,
      pageWidth / 2,
      285,
      { align: "center" }
    );

    doc.save(`${team.teamName.replace(/\s+/g, '_')}_${team.registrationId}.pdf`);
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

              {/* Registration Permission & Portal Status Control Card */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                    registrations.length >= 25 
                      ? "bg-rose-500" 
                      : isRegOpen 
                      ? "bg-emerald-500 animate-pulse" 
                      : "bg-rose-500"
                  }`} />
                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-orbitron font-extrabold text-xs sm:text-sm text-slate-900 uppercase">
                        PORTAL STATUS:
                      </span>
                      <span className={`text-[11px] font-mono font-black px-2.5 py-0.5 rounded-full border ${
                        registrations.length >= 25
                          ? "bg-rose-50 text-rose-700 border-rose-300"
                          : isRegOpen
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                          : "bg-rose-50 text-rose-700 border-rose-300"
                      }`}>
                        {registrations.length >= 25
                          ? "REGISTRATION CLOSES (LIMIT 25 REACHED)"
                          : isRegOpen
                          ? "REGISTRATION OPENS"
                          : "REGISTRATION CLOSES (OFF BY ADMIN)"}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 mt-0.5 font-bold">
                      {registrations.length} / 25 Teams Registered • Auto-closes when 25 teams are reached
                    </span>
                  </div>
                </div>

                {/* Toggle Button */}
                <div className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-lg border border-slate-200 shadow-sm shrink-0">
                  <span className="text-xs font-mono font-extrabold text-slate-700">
                    ADMIN PERMISSION:
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleRegistration}
                    disabled={isTogglingReg}
                    title="Click to toggle registration portal ON/OFF"
                    className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${
                      isRegOpen ? "bg-emerald-600" : "bg-slate-300"
                    } ${isTogglingReg ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                        isRegOpen ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className={`text-xs font-mono font-black w-8 ${isRegOpen ? "text-emerald-700" : "text-slate-500"}`}>
                    {isRegOpen ? "ON" : "OFF"}
                  </span>
                </div>
              </div>

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
                    onClick={exportToPDF}
                    disabled={registrations.length === 0}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono font-bold tracking-wider transition-all disabled:opacity-50 shadow-sm"
                  >
                    <FileText size={15} />
                    EXPORT PDF
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

                <div className="pt-2 flex justify-between items-center">
                  <button
                    onClick={() => exportSingleTeamPDF(selectedTeam)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono font-bold transition-all shadow-sm"
                  >
                    <FileText size={14} />
                    DOWNLOAD PDF
                  </button>

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
