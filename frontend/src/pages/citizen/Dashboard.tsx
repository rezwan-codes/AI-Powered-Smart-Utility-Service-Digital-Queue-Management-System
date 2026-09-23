import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  ClipboardPlus,
  Clock,
  Lightbulb,
  LogOut,
  MapPinned,
  Phone,
  RefreshCw,
  Ticket,
  TrendingUp,
  Wrench,
  Activity,
  Bell,
  Menu,
  Plus,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import MapTracker from "../../components/map/MapTracker";
import type { MapLocation } from "../../components/map/MapTracker";
import { useLiveLocation } from "../../hooks/useLiveLocation";
import { authService } from "../../services/authService";
import { complaintService } from "../../services/complaintService";
import type { Complaint, User } from "../../types/utility";
import { buildComplaintMapLocations } from "../../utils/mapLocations";
import {
  averageEtaMinutes,
  buildAreaIssues,
  formatDistance,
  formatEta,
  formatSubmittedAt,
  priorityStyles,
  statusStyles,
  utilityStyles,
} from "../../utils/utilityDisplay";

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1600;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };

    const frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return <span>{count}{suffix}</span>;
}

function getSmartTip(complaints: Complaint[]): { text: string; icon: string } | null {
  if (!complaints.length) {
    return { text: "No complaints yet. Submit your first utility issue to get started!", icon: "info" };
  }

  const emergency = complaints.filter((c) => c.priority === "Emergency" && c.status !== "Completed");
  if (emergency.length) {
    return { text: `You have ${emergency.length} emergency complaint${emergency.length > 1 ? "s" : ""} requiring immediate attention.`, icon: "alert" };
  }

  const pending = complaints.filter((c) => c.status === "Pending");
  if (pending.length > 2) {
    return { text: `${pending.length} complaints are pending. Consider following up for faster resolution.`, icon: "clock" };
  }

  const processing = complaints.filter((c) => c.status === "Processing");
  if (processing.length) {
    return { text: `${processing.length} complaint${processing.length > 1 ? "s are" : " is"} being processed. Track live on the map.`, icon: "map" };
  }

  return null;
}

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pollInterval, setPollInterval] = useState<number>(8);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const liveLocation = useLiveLocation(Boolean(user));
  const activeComplaint = complaints.find((item) => item.status !== "Completed");
  const completedCount = complaints.filter((item) => item.status === "Completed").length;
  const areaIssues = useMemo(() => buildAreaIssues(complaints), [complaints]);
  const averageWaiting = averageEtaMinutes(complaints);
  const smartTip = getSmartTip(complaints);

  const loadData = useCallback(async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    try {
      const [complaintData, userData] = await Promise.all([complaintService.list(), authService.me()]);
      setComplaints(complaintData.complaints);
      setUser(userData.user);
      setLastUpdated(Date.now());
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
    buildComplaintMapLocations(complaints)
      .then(setMapLocations)
      .catch(() => {});
  }, [complaints]);

  useEffect(() => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => loadData(false), pollInterval * 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [loadData, pollInterval]);

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const assignedTechnicianLocation =
    typeof activeComplaint?.technician?.latitude === "number" &&
    typeof activeComplaint?.technician?.longitude === "number"
      ? {
          id: activeComplaint.technician.id,
          name: activeComplaint.technician.name,
          lat: activeComplaint.technician.latitude,
          lng: activeComplaint.technician.longitude,
          status: activeComplaint.technician.status,
        }
      : null;

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
                    localStorage.clear();
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
              <div className="grid gap-6 xl:grid-cols-[13fr_7fr]">
                <div className="space-y-6">
                  {smartTip && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-blue-200 bg-blue-50 p-5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                          <Lightbulb size={20} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-blue-900">Smart Insight</h3>
                          <p className="mt-1 text-sm text-blue-700">{smartTip.text}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-3">
                    <button
                      onClick={() => navigate("/new-complaint")}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-5 flex items-center justify-center gap-3 transition hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <Plus size={20} />
                      New Complaint
                    </button>
                    <button
                      onClick={() => navigate("/complaints")}
                      className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl p-5 flex items-center justify-center gap-3 transition hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <ClipboardList size={20} />
                      View All
                    </button>
                    <button
                      onClick={() => navigate("/map")}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-2xl p-5 flex items-center justify-center gap-3 transition hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <MapPinned size={20} />
                      Live Map
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map(({ label, value, Icon, color, bg }, index) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all"
                      >
                        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${bg}`}>
                          <Icon size={24} className={color} />
                        </div>
                        <h2 className="text-4xl font-bold text-slate-900">
                          {label === "Queue Position" && activeComplaint ? (
                            `#${activeComplaint.position}`
                          ) : (
                            <AnimatedCounter target={value} suffix={label.includes("Waiting") && averageWaiting ? " min" : ""} />
                          )}
                        </h2>
                        <p className="mt-2 text-slate-500">{label}</p>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-8 text-white shadow-sm"
                  >
                    {activeComplaint ? (
                      <>
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                          <div className="flex-1">
                            <p className="text-sm font-semibold uppercase tracking-wide text-sky-300">Current Complaint</p>
                            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{activeComplaint.title}</h2>
                            <p className="mt-2 flex items-center gap-2 text-slate-300">
                              <MapPinned size={16} />
                              {activeComplaint.area} - Submitted {formatSubmittedAt(activeComplaint.createdAt)}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-white px-5 py-3 text-slate-950 shadow-lg">
                            <p className="text-xs text-slate-500">Digital Token</p>
                            <p className="text-2xl font-bold">{activeComplaint.token}</p>
                          </div>
                        </div>

                        <div className="mt-8">
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="font-semibold text-slate-200">Service Progress</span>
                            <span className="font-bold text-white">{activeComplaint.status}</span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-white/15">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ${
                                activeComplaint.status === "Cancelled" ? "bg-rose-400" : "bg-green-400"
                              }`}
                              style={{
                                width: activeComplaint.status === "Cancelled" ? "100%" : activeComplaint.status === "Pending" ? "33%" : activeComplaint.status === "Processing" ? "66%" : "100%",
                              }}
                            />
                          </div>
                          <div className="mt-2 flex justify-between text-xs text-slate-400">
                            <span>Submitted</span>
                            <span>Assigned</span>
                            <span className="text-green-400">Processing</span>
                            <span>Completed</span>
                          </div>
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                          <div className="rounded-xl bg-white/10 p-4">
                            <Ticket className="text-sky-300" size={20} />
                            <p className="mt-2 text-xs text-slate-300">Queue Position</p>
                            <p className="text-xl font-bold">#{activeComplaint.position}</p>
                          </div>
                          <div className="rounded-xl bg-white/10 p-4">
                            <Clock className="text-amber-300" size={20} />
                            <p className="mt-2 text-xs text-slate-300">Status</p>
                            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[activeComplaint.status]}`}>
                              {activeComplaint.status}
                            </span>
                          </div>
                          <div className="rounded-xl bg-white/10 p-4">
                            <Wrench className="text-emerald-300" size={20} />
                            <p className="mt-2 text-xs text-slate-300">Technician ETA</p>
                            <p className="text-xl font-bold">{formatEta(activeComplaint.technician?.etaMinutes)}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="py-12 text-center">
                        <ClipboardList className="mx-auto mb-4 text-slate-400" size={48} />
                        <p className="text-lg font-semibold text-slate-300">No active complaints</p>
                        <p className="mt-2 text-sm text-slate-400">Submit a new complaint to get started.</p>
                        <button
                          onClick={() => navigate("/new-complaint")}
                          className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                          New Complaint
                        </button>
                      </div>
                    )}
                  </motion.div>
                </div>

                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
                      <div className="flex items-center gap-2">
                        <MapPinned size={22} />
                        <h2 className="text-lg font-bold">Live Outage Map</h2>
                      </div>
                    </div>
                    <div className="p-4">
                      <MapTracker
                        height="300px"
                        locations={mapLocations}
                        userLocation={liveLocation.location}
                        technicianLocations={assignedTechnicianLocation ? [assignedTechnicianLocation] : []}
                        initialLocation={{ lat: 23.8103, lng: 90.4125 }}
                      />
                    </div>
                  </motion.div>

                  {activeComplaint?.technician && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <h3 className="text-xl font-bold text-slate-900">Assigned Technician</h3>
                      <div className="mt-5 flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-50 text-2xl font-bold text-blue-700">
                          {activeComplaint.technician.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{activeComplaint.technician.name}</h4>
                          <p className="text-sm text-slate-500">{activeComplaint.technician.skill} Specialist</p>
                          <div className="mt-1 flex items-center gap-1 text-sm text-amber-600">
                            <span>⭐</span>
                            <span className="font-semibold">{activeComplaint.technician.rating}/5</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="rounded-xl bg-slate-100 p-4">
                          <p className="text-sm text-slate-500">ETA</p>
                          <h4 className="font-bold text-xl text-slate-900">{formatEta(activeComplaint.technician.etaMinutes)}</h4>
                        </div>
                        <div className="rounded-xl bg-slate-100 p-4">
                          <p className="text-sm text-slate-500">Distance</p>
                          <h4 className="font-bold text-xl text-slate-900">{formatDistance(activeComplaint.technician.distanceKm)}</h4>
                        </div>
                      </div>
                      <button className="mt-6 w-full rounded-xl bg-green-600 text-white py-3 flex justify-center items-center gap-2 transition hover:bg-green-700">
                        <Phone size={18} />
                        Call Technician
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
