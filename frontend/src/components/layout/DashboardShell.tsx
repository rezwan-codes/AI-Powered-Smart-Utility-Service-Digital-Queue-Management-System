import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Lightbulb,
  LogOut,
  MapPinned,
  Menu,
  Phone,
  RefreshCw,
  ClipboardList,
  Clock,
  CheckCircle2,
  Ticket,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import { authService } from "../../services/authService";
import { complaintService } from "../../services/complaintService";
import type { Complaint, User } from "../../types/utility";
import { averageEtaMinutes, formatEta, formatSubmittedAt, statusStyles } from "../../utils/utilityDisplay";
import { useAuth } from "../../context/AuthContext";

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getSmartTip(complaints: Complaint[]): { text: string } | null {
  if (!complaints.length) {
    return { text: "No complaints yet. Submit your first utility issue to get started!" };
  }

  const emergency = complaints.filter((c) => c.priority === "Emergency" && c.status !== "Completed");
  if (emergency.length) {
    return { text: `You have ${emergency.length} emergency complaint${emergency.length > 1 ? "s" : ""} requiring immediate attention.` };
  }

  const pending = complaints.filter((c) => c.status === "Pending");
  if (pending.length > 2) {
    return { text: `${pending.length} complaints are pending. Consider following up for faster resolution.` };
  }

  const processing = complaints.filter((c) => c.status === "Processing");
  if (processing.length) {
    return { text: `${processing.length} complaint${processing.length > 1 ? "s are" : " is"} being processed. Track live on the map.` };
  }

  return null;
}

export default function DashboardShell() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const activeComplaint = complaints.find((item) => item.status !== "Completed");
  const completedCount = complaints.filter((item) => item.status === "Completed").length;
  const averageWaiting = averageEtaMinutes(complaints);
  const smartTip = getSmartTip(complaints);

  const loadData = useCallback(async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    try {
      const [complaintData, userData] = await Promise.all([complaintService.list(), authService.me()]);
      setComplaints(complaintData.complaints);
      setUser(userData.user);
      setError("");
    } catch {
      setError("Could not load live database data. Please login and start the backend.");
    } finally {
      setIsLoading(false);
      if (showRefreshIndicator) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => loadData(false), 8000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [loadData]);

  const stats = useMemo(
    () => [
      {
        label: "Active Complaints",
        value: complaints.length - completedCount,
        Icon: ClipboardList,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        label: "Average Waiting",
        value: averageWaiting ?? 0,
        suffix: averageWaiting ? " min" : "",
        Icon: Clock,
        color: "text-amber-600",
        bg: "bg-amber-50",
      },
      {
        label: "Completed",
        value: completedCount,
        Icon: CheckCircle2,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      },
      {
        label: "Queue Position",
        value: activeComplaint ? activeComplaint.position : 0,
        suffix: activeComplaint ? `#${activeComplaint.position}` : "#0",
        Icon: Ticket,
        color: "text-purple-600",
        bg: "bg-purple-50",
      },
    ],
    [averageWaiting, completedCount, complaints.length, activeComplaint]
  );

  return (
    <div className="flex min-h-screen bg-slate-50 lg:pl-72">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl border border-slate-200 p-2 transition hover:bg-slate-50 lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {getTimeGreeting()}, {user?.name ?? "Md Rezwan"} 👋
                </h1>
                <p className="mt-1 text-sm text-slate-500">Welcome back! Here's what's happening today.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                Live
              </div>

              <button
                onClick={() => loadData(true)}
                disabled={isRefreshing}
                className="rounded-xl border border-slate-200 p-2.5 transition hover:bg-slate-50 disabled:opacity-60"
                aria-label="Refresh"
              >
                <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
              </button>

              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to logout?")) {
                    logout();
                    navigate("/");
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6">
            {error && (
              <div className="animate-fade-in rounded-2xl bg-red-50 p-4 font-semibold text-red-700 shadow-sm">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="animate-fade-in rounded-2xl bg-white p-6 text-center text-slate-600 shadow-sm">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
                Loading live data...
              </div>
            ) : (
              <Outlet
                context={{
                  complaints,
                  user,
                  activeComplaint,
                  completedCount,
                  averageWaiting,
                  smartTip,
                  stats,
                  refresh: () => loadData(true),
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
