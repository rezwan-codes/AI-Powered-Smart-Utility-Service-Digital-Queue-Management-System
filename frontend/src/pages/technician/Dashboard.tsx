import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bell,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ClipboardList,
  Clock,
  ExternalLink,
  ImageOff,
  LogOut,
  MapPin,
  Menu,
  Navigation,
  Phone,
  Send,
  ShieldAlert,
  SlidersHorizontal,
  Star,
  WalletCards,
  Wrench,
  RefreshCw,
  Activity,
  Zap,
} from "lucide-react";
import MapTracker from "../../components/map/MapTracker";
import type { MapLocation } from "../../components/map/MapTracker";
import { useLiveLocation } from "../../hooks/useLiveLocation";
import { authService } from "../../services/authService";
import { complaintService } from "../../services/complaintService";
import { requestService } from "../../services/requestService";
import { notificationService } from "../../services/notificationService";
import type { Notification } from "../../services/notificationService";
import type {
  Complaint,
  ComplaintPriority,
  ComplaintStatus,
  RequestType,
  TechnicianRequest,
  User,
} from "../../types/utility";
import { buildComplaintMapLocations } from "../../utils/mapLocations";
import {
  averageEtaMinutes,
  formatDistance,
  formatEta,
  formatSubmittedAt,
  priorityStyles,
  utilityStyles,
} from "../../utils/utilityDisplay";

type TechnicianSection = "Dashboard" | "My Jobs" | "Available Jobs" | "Admin Requests";

const STATUSES: ComplaintStatus[] = ["Pending", "Processing"];
const PRIORITIES: ComplaintPriority[] = ["Normal", "High", "Emergency"];
const requestTypes: RequestType[] = ["Assignment", "Help", "Reassign", "Other"];

interface ActivityItem {
  id: string;
  message: string;
  timestamp: number;
  type: "assign" | "status" | "request" | "complete" | "confirm" | "emergency";
}

export default function TechnicianDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<TechnicianSection>("Dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [openJobs, setOpenJobs] = useState<Complaint[]>([]);
  const [requests, setRequests] = useState<TechnicianRequest[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [jobMapLocations, setJobMapLocations] = useState<MapLocation[]>([]);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  const [, setActivities] = useState<ActivityItem[]>([]);
  const [pollInterval, setPollInterval] = useState<number>(8);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const intervalRef = useRef<number | null>(null);

  const [completingId, setCompletingId] = useState<string | null>(null);
  const [completionNote, setCompletionNote] = useState("");
  const [requestingJobId, setRequestingJobId] = useState<string | null>(null);
  const [requestType, setRequestType] = useState<RequestType>("Assignment");
  const [requestMessage, setRequestMessage] = useState("");
  const [requestContext, setRequestContext] = useState<"available" | "assigned">("available");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [sortBy, setSortBy] = useState<SortKey>("priority");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [showCompletedInAssignments, setShowCompletedInAssignments] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);

  const liveLocation = useLiveLocation(Boolean(currentUser));

  const assignedJobs = complaints.filter((complaint) => complaint.status !== "Completed");
  const completedJobs = complaints.filter((complaint) => complaint.status === "Completed");
  const pendingRequests = requests.filter((request) => request.status === "Pending");
  const avgEta = useMemo(() => averageEtaMinutes(assignedJobs), [assignedJobs]);

  const utilityBreakdown = useMemo(() => {
    return assignedJobs.reduce<Record<string, number>>((acc, job) => {
      acc[job.type] = (acc[job.type] || 0) + 1;
      return acc;
    }, {});
  }, [assignedJobs]);

  const addActivity = useCallback((message: string, type: ActivityItem["type"]) => {
    setActivities((prev) => [
      { id: `${Date.now()}-${Math.random()}`, message, timestamp: Date.now(), type },
      ...prev.slice(0, 49),
    ]);
  }, []);

  const loadData = useCallback(async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    try {
      const [userData, assignedData, openData, requestData, notifCount, notifList] =
        await Promise.all([
          authService.me(),
          complaintService.list(),
          complaintService.listOpenJobs(),
          requestService.list(),
          notificationService.unreadCount().catch(() => ({ count: 0 })),
          notificationService.list().catch(() => ({ notifications: [] })),
        ]);
      setCurrentUser(userData.user);
      setComplaints(assignedData.complaints);
      setOpenJobs(openData.complaints);
      setRequests(requestData.requests);
      setUnreadCount(notifCount.count);
      setNotifications(notifList.notifications);
      setLastUpdated(Date.now());
      setError("");
    } catch {
      setError("Could not load technician data from the backend.");
    } finally {
      if (showRefreshIndicator) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    buildComplaintMapLocations([...complaints, ...openJobs])
      .then(setJobMapLocations)
      .catch(() => {});
  }, [complaints, openJobs]);

  useEffect(() => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => loadData(false), pollInterval * 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [loadData, pollInterval]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleConfirmJob = async (jobId: string) => {
    setActionError("");
    try {
      await complaintService.confirm(jobId);
      setConfirmingId(null);
      await loadData();
      addActivity(`Confirmed job assignment`, "confirm");
    } catch {
      setActionError("Could not confirm this job. Please try again.");
    }
  };

  const handleCompleteWork = async (jobId: string) => {
    setActionError("");
    try {
      await complaintService.updateStatus(jobId, "Completed", completionNote.trim() || "Work completed on site");
      setCompletingId(null);
      setCompletionNote("");
      await loadData();
      addActivity(`Completed job`, "complete");
    } catch {
      setActionError("Could not mark this job as completed. Please try again.");
    }
  };

  const handleRequestAdmin = async (complaintId: string) => {
    if (!requestMessage.trim()) {
      setActionError("Please enter a message for the admin.");
      return;
    }
    setActionError("");
    try {
      await requestService.create({
        complaintId,
        type: requestType,
        message: requestMessage.trim(),
      });
      setRequestingJobId(null);
      setRequestMessage("");
      setRequestType("Assignment");
      setRequestContext("available");
      await loadData();
      addActivity(`Sent admin request`, "request");
    } catch {
      setActionError("Could not send request to admin. You may already have a pending request for this job.");
    }
  };

  const openRequestForm = (
    job: Complaint,
    context: "available" | "assigned",
    type: RequestType,
    message: string,
  ) => {
    setRequestContext(context);
    setRequestingJobId(job.id);
    setRequestType(type);
    setRequestMessage(message);
  };

  const requestFormTypes =
    requestContext === "assigned"
      ? requestTypes.filter((type) => type !== "Assignment")
      : requestTypes;

  const selectSection = (section: TechnicianSection) => {
    setActiveSection(section);
    setMobileNavOpen(false);
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await notificationService.markAsRead(notification.id);
    }
    setShowNotificationsPanel(false);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const resetAssignmentFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setSortBy("priority");
    setTypeFilter(null);
    setShowCompletedInAssignments(false);
    setExpandedCardId(null);
  };

  const handleToggleCard = (jobId: string) => {
    setExpandedCardId((prev) => (prev === jobId ? null : jobId));
  };

  const sectionTitles: Record<TechnicianSection, string> = {
    Dashboard: "Technician Dashboard",
    "My Jobs": "My Jobs",
    "Available Jobs": "Available Jobs",
    "Admin Requests": "My Admin Requests",
  };

  const sectionDescriptions: Record<TechnicianSection, string> = {
    Dashboard: "Overview of your assigned jobs, available work, and live map.",
    "My Jobs": "Active work assigned to you. Use filters to narrow results.",
    "Available Jobs": "Open jobs matching your skill. Auto-matched jobs require your confirmation.",
    "Admin Requests": "Track requests you sent to the authority panel.",
  };

  const technicianSkill = currentUser?.technician?.skill ?? "Field Service";
  const liveStatusText =
    liveLocation.status === "tracking"
      ? "Location live"
      : liveLocation.status === "blocked"
        ? "Location blocked"
        : liveLocation.status === "unavailable"
          ? "Location unavailable"
          : "Awaiting location";
  const liveStatusClass =
    liveLocation.status === "tracking"
      ? "bg-teal-400"
      : liveLocation.status === "blocked"
        ? "bg-amber-400"
        : "bg-slate-400";
  const urgentJobs = assignedJobs.filter((job) => job.priority === "Emergency" || job.priority === "High").length;
  const technicianCompletionRate =
    completedJobs.length + assignedJobs.length > 0
      ? Math.round((completedJobs.length / (completedJobs.length + assignedJobs.length)) * 100)
      : 0;

  const sidebarItems: Array<{
    label: string;
    Icon: typeof Wrench;
    section?: TechnicianSection;
    badge?: number;
    muted?: boolean;
    onClick?: () => void;
  }> = [
    { label: "Dashboard", Icon: ClipboardList, section: "Dashboard" },
    { label: "My Jobs", Icon: ClipboardList, section: "My Jobs" },
    { label: "Available Jobs", Icon: Wrench, section: "Available Jobs", badge: openJobs.length },
    { label: "Live Map", Icon: Navigation, section: "Dashboard" },
    { label: "Admin Requests", Icon: ClipboardList, section: "Admin Requests", badge: pendingRequests.length },
  ];

  const sidebar = (
    <div className="relative flex h-screen w-72 flex-col justify-between overflow-hidden bg-slate-900 text-white shadow-2xl">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/slidebar.png')" }}
      />
      <div className="absolute inset-0 bg-[#061A40]/50" />

      <div className="relative flex flex-1 flex-col overflow-y-auto">
        <div className="flex items-center gap-3 px-6 pb-6 pt-8">
          <img
            src="/images/logo.png"
            alt="Smart Utility"
            className="h-10 w-10 rounded-xl object-cover shadow-lg shadow-blue-500/30 ring-2 ring-white"
          />
          <div className="min-w-0">
            <p className="text-base font-bold text-white">Smart Utility</p>
            <p className="truncate text-xs text-slate-300">Technician Service Panel</p>
          </div>
        </div>

        <div className="mx-6 mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
              <Wrench size={22} />
              <span className={`absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full ${liveStatusClass} ring-2 ring-[#061A40]`} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">{currentUser?.name ?? "Technician"}</p>
              <p className="truncate text-xs text-slate-300">{technicianSkill} response desk</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-white/10 p-2">
              <p className="text-base font-bold text-white">{assignedJobs.length}</p>
              <p className="text-[10px] font-semibold text-slate-300">Active</p>
            </div>
            <div className="rounded-xl bg-white/10 p-2">
              <p className="text-base font-bold text-white">{openJobs.length}</p>
              <p className="text-[10px] font-semibold text-slate-300">Open</p>
            </div>
            <div className="rounded-xl bg-white/10 p-2">
              <p className="text-base font-bold text-white">{urgentJobs}</p>
              <p className="text-[10px] font-semibold text-slate-300">Urgent</p>
            </div>
          </div>
        </div>

        <nav className="mt-2 flex-1 space-y-1 px-4">
          {sidebarItems.map(({ label, Icon, section, badge, muted, onClick }) => {
            const active = section === activeSection && label !== "Live Map" && !muted;

            return (
              <button
                key={label}
                type="button"
                disabled={muted}
                onClick={() => {
                  if (onClick) {
                    onClick();
                  } else if (section) {
                    selectSection(section);
                  }
                }}
                className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                    : muted
                      ? "cursor-not-allowed text-slate-500"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    active ? "bg-white/20 text-white" : "bg-white/10 text-slate-300 group-hover:bg-white/20 group-hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{label}</span>
                  {muted && <span className="block text-[10px] font-medium text-slate-500">Coming soon</span>}
                </span>
                {typeof badge === "number" && badge > 0 && (
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-blue-700">
                    {badge}
                  </span>
                )}
                {active && <span className="ml-auto h-2 w-2 rounded-full bg-white" />}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="relative px-6 pb-6">
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to logout?")) {
              localStorage.clear();
              navigate("/");
            }
          }}
          className="group mb-4 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-slate-300 group-hover:bg-white/20 group-hover:text-white">
            <LogOut size={18} />
          </span>
          Logout
        </button>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-white">Shift Pulse</p>
              <p className="mt-1 text-xs text-slate-400">{liveStatusText}</p>
            </div>
            <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold text-slate-200">
              {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400"
              style={{ width: `${Math.max(technicianCompletionRate, 8)}%` }}
            />
          </div>
          <p className="mt-2 text-center text-xs text-slate-400">Smart City Platform</p>
        </div>
      </div>
    </div>
  );

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 5) return "Just now";
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  const renderDashboard = () => {
    const completionRate = completedJobs.length + assignedJobs.length > 0
      ? Math.round((completedJobs.length / (completedJobs.length + assignedJobs.length)) * 100)
      : 0;
    const waterJobs = utilityBreakdown.Water ?? 0;
    const gasJobs = utilityBreakdown.Gas ?? 0;
    const electricityJobs = utilityBreakdown.Electricity ?? 0;
    const featuredJobs = assignedJobs.slice(0, 3);
    const scheduleJobs = [...assignedJobs, ...openJobs].slice(0, 4);

    const statCards = [
      {
        label: "Assigned Jobs",
        value: assignedJobs.length,
        helper: assignedJobs.length ? "3 from yesterday" : "No active assignments",
        Icon: ClipboardList,
        iconClass: "bg-blue-100 text-blue-700",
        line: "bg-blue-500",
      },
      {
        label: "Open Jobs",
        value: openJobs.length,
        helper: openJobs.length ? "New jobs available" : "No change",
        Icon: Wrench,
        iconClass: "bg-emerald-100 text-emerald-700",
        line: "bg-emerald-500",
      },
      {
        label: "Pending Requests",
        value: pendingRequests.length,
        helper: pendingRequests.length ? "Needs admin response" : "No change",
        Icon: Clock,
        iconClass: "bg-orange-100 text-orange-700",
        line: "bg-orange-400",
      },
      {
        label: "Avg ETA",
        value: formatEta(avgEta ?? undefined),
        helper: avgEta ? "2m improved" : "Waiting assignment",
        Icon: Navigation,
        iconClass: "bg-violet-100 text-violet-700",
        line: "bg-violet-500",
      },
    ];

    const serviceCards = [
      { label: "Water Jobs", value: waterJobs, Icon: utilityStyles.Water.Icon, color: "text-sky-700", bg: "bg-sky-100", bar: "bg-sky-300", helper: waterJobs ? `${waterJobs} active` : "No jobs today" },
      { label: "Gas Jobs", value: gasJobs, Icon: utilityStyles.Gas.Icon, color: "text-orange-700", bg: "bg-orange-100", bar: "bg-orange-300", helper: gasJobs ? `${gasJobs} active` : "No jobs today" },
      { label: "Electricity Jobs", value: electricityJobs, Icon: utilityStyles.Electricity.Icon, color: "text-emerald-700", bg: "bg-emerald-100", bar: "bg-emerald-300", helper: electricityJobs ? `${electricityJobs} active` : "1 active" },
    ];

    return (
      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_410px]">
        <div className="space-y-5">
          <section className="relative overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 shadow-sm">
            <div className="relative z-10 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
                <CheckCircle2 size={23} />
              </div>
              <div>
                <h2 className="font-bold text-emerald-800">Connected to PostgreSQL via backend API</h2>
                <p className="mt-1 text-sm text-slate-600">All systems are running smoothly.</p>
              </div>
            </div>
            <div className="absolute bottom-0 right-8 hidden text-emerald-200 lg:block">
              <Zap size={82} />
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map(({ label, value, helper, Icon, iconClass, line }) => (
              <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass}`}>
                  <Icon size={24} />
                </div>
                <p className="mt-5 text-3xl font-bold text-slate-950">{value}</p>
                <p className="mt-1 text-sm font-medium text-slate-600">{label}</p>
                <p className="mt-2 text-xs text-slate-500">{helper}</p>
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full w-3/5 rounded-full ${line}`} />
                </div>
              </div>
            ))}
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-600">Completed Jobs</p>
                  <p className="mt-3 text-3xl font-bold text-emerald-700">{completedJobs.length}</p>
                  <p className="mt-2 text-xs text-slate-500">{completionRate}% from last week</p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-8 border-emerald-200 bg-white text-sm font-bold text-emerald-700">
                  {completionRate}%
                </div>
              </div>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-emerald-200">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${completionRate}%` }} />
              </div>
            </div>

            {serviceCards.map(({ label, value, Icon, color, bg, bar, helper }) => (
              <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg} ${color}`}>
                    <Icon size={21} />
                  </div>
                  <p className="text-sm font-semibold text-slate-600">{label}</p>
                </div>
                <p className="mt-4 text-3xl font-bold text-slate-950">{value}</p>
                <p className={`mt-2 text-xs ${color}`}>{helper}</p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full w-2/3 rounded-full ${bar}`} />
                </div>
              </div>
            ))}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-950">Live Job Map</h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Live
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">Real-time view of your assigned jobs and nearby requests.</p>
              </div>
              <button
                type="button"
                onClick={() => selectSection("My Jobs")}
                className="flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700"
              >
                <Navigation size={18} />
                Open Full Map
              </button>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-slate-200">
              <MapTracker
                height="330px"
                locations={jobMapLocations}
                userLocation={liveLocation.location}
                initialLocation={liveLocation.location ?? { lat: 23.8103, lng: 90.4125 }}
              />
              <button className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-md">
                <SlidersHorizontal size={16} />
                Filters
              </button>
            </div>
            <div className="mt-0 grid grid-cols-2 gap-2 rounded-b-xl border border-t-0 border-slate-200 bg-white px-5 py-4 text-xs font-semibold text-slate-600 md:grid-cols-4">
              <span className="flex items-center justify-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" />Assigned</span>
              <span className="flex items-center justify-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Open</span>
              <span className="flex items-center justify-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-orange-500" />Nearby Requests</span>
              <span className="flex items-center justify-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-violet-500" />Completed Today</span>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Earnings (This Month)", value: "৳ 12,450", Icon: WalletCards, color: "text-teal-700", bg: "bg-teal-100", helper: "8% from last month" },
              { label: "Jobs Completed (This Week)", value: completedJobs.length, Icon: Wrench, color: "text-blue-700", bg: "bg-blue-100", helper: "50% from last week" },
              { label: "Customer Rating", value: currentUser?.technician?.rating?.toFixed(1) ?? "4.8", Icon: Star, color: "text-violet-700", bg: "bg-violet-100", helper: "Based on 24 reviews" },
              { label: "Availability", value: "Online", Icon: BarChart3, color: "text-emerald-700", bg: "bg-emerald-100", helper: "You are available for jobs" },
            ].map(({ label, value, Icon, color, bg, helper }) => (
              <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full ${bg} ${color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">{label}</p>
                    <p className="mt-1 text-xl font-bold text-slate-950">{value}</p>
                    <p className="mt-2 text-xs text-slate-500">{helper}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-xl bg-[#06142c] p-5 text-white shadow-xl shadow-slate-300">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">My Assigned Jobs</h2>
              <button onClick={() => selectSection("My Jobs")} className="text-sm font-semibold text-blue-300">View All</button>
            </div>
            <div className="mt-5 space-y-3">
              {(featuredJobs.length ? featuredJobs : openJobs.slice(0, 3)).map((job, index) => (
                <Link
                  key={job.id}
                  to={`/complaints/${job.id}`}
                  className="block rounded-xl bg-white/7 p-4 transition hover:bg-white/12"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${priorityStyles[job.priority]}`}>
                        {job.priority}
                      </span>
                      <h3 className="mt-3 font-bold text-white">{job.title}</h3>
                      <p className="mt-1 text-sm text-slate-300">{job.area}</p>
                    </div>
                    <ChevronDown size={18} className="-rotate-90 text-slate-300" />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-300">
                    <span>{job.token}</span>
                    <span>{index === 2 ? formatDistance(job.technician?.distanceKm) : formatEta(job.technician?.etaMinutes)}</span>
                  </div>
                </Link>
              ))}
              {!featuredJobs.length && !openJobs.length && (
                <p className="rounded-xl bg-white/7 p-4 text-sm text-slate-300">No assigned jobs yet.</p>
              )}
            </div>
          </section>

          <section className="rounded-xl bg-[#06142c] p-5 text-white shadow-xl shadow-slate-300">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Today's Schedule</h2>
              <span className="text-sm font-semibold text-blue-300">View Calendar</span>
            </div>
            <div className="mt-5 space-y-4">
              {scheduleJobs.map((job, index) => (
                <div key={job.id} className="grid grid-cols-[70px_1fr_auto] items-start gap-3">
                  <p className="text-sm font-bold text-white">{["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"][index] ?? "05:00 PM"}</p>
                  <div className="border-l border-blue-500/40 pl-4">
                    <p className="font-bold text-white">{job.title}</p>
                    <p className="mt-1 text-xs text-slate-300">{job.area}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    index === 0 ? "bg-blue-600 text-white" : index === 3 ? "bg-slate-600 text-white" : "bg-white/20 text-white"
                  }`}>
                    {index === 0 ? "In Progress" : index === 3 ? "Planned" : "Upcoming"}
                  </span>
                </div>
              ))}
              {!scheduleJobs.length && (
                <p className="rounded-xl bg-white/7 p-4 text-sm text-slate-300">No schedule items today.</p>
              )}
            </div>
          </section>

          <section className="relative overflow-hidden rounded-xl bg-blue-600 p-5 text-white shadow-xl shadow-blue-200">
            <div className="relative z-10 max-w-[70%]">
              <h2 className="text-lg font-bold">Need Help?</h2>
              <p className="mt-1 text-sm text-blue-50">Contact support if you face any issues.</p>
              <button className="mt-4 rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-sm font-bold text-white">
                Chat with Support
              </button>
            </div>
            <Wrench className="absolute bottom-5 right-7 text-blue-200" size={70} />
          </section>
        </aside>
      </div>
    );
  };

  const filteredAndSortedJobs = useMemo(() => {
    const filtered = assignedJobs.filter((job) => {
      if (statusFilter !== "all" && job.status !== statusFilter) return false;
      if (priorityFilter !== "all" && job.priority !== priorityFilter) return false;
      if (typeFilter && job.type !== typeFilter) return false;
      return true;
    });

    const sorted = [...filtered];
    const priorityScore = { Emergency: 3, High: 2, Normal: 1 };

    sorted.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          return (priorityScore[b.priority] || 0) - (priorityScore[a.priority] || 0);
        case "eta":
          return (a.technician?.etaMinutes ?? Infinity) - (b.technician?.etaMinutes ?? Infinity);
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "token":
          return (a.token ?? "").localeCompare(b.token ?? "");
        default:
          return 0;
      }
    });

    return sorted;
  }, [assignedJobs, statusFilter, priorityFilter, sortBy, typeFilter]);

  const renderMyJobs = () => (
    <section className="rounded-lg bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">My Assignments</h1>
          <p className="mt-1 text-sm text-slate-500">
            Active work assigned to you. Use filters to narrow results.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold outline-none focus:border-[#2563EB]"
          >
            <option value="all">All statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
            {showCompletedInAssignments && (
              <option value="Completed">Completed</option>
            )}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
            className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold outline-none focus:border-[#2563EB]"
          >
            <option value="all">All priorities</option>
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold outline-none focus:border-[#2563EB]"
          >
            <option value="priority">Sort: Priority</option>
            <option value="eta">Sort: ETA</option>
            <option value="recent">Sort: Recent</option>
            <option value="token">Sort: Token</option>
          </select>
          {typeFilter && (
            <button
              onClick={() => setTypeFilter(null)}
              className="flex items-center gap-2 rounded-md border border-[#2563EB]/20 bg-[#2563EB]/10 px-3 py-2 text-xs font-semibold text-[#2563EB] transition hover:bg-[#2563EB]/20"
            >
              {typeFilter}
              <span className="text-[#2563EB]">×</span>
            </button>
          )}
          <button
            onClick={resetAssignmentFilters}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </div>
      <div className="mt-5 grid gap-4">
        {filteredAndSortedJobs.map((job) => {
          const hasPendingRequest = requests.some(
            (request) => request.complaintId === job.id && request.status === "Pending",
          );

          return (
            <div key={job.id}>
              <JobCard
                job={job}
                completingId={completingId}
                completionNote={completionNote}
                onStartComplete={() => setCompletingId(job.id)}
                onCancelComplete={() => {
                  setCompletingId(null);
                  setCompletionNote("");
                }}
                onComplete={() => handleCompleteWork(job.id)}
                onNoteChange={setCompletionNote}
                onRequestAdmin={() =>
                  openRequestForm(
                    job,
                    "assigned",
                    "Help",
                    `I need admin support for assigned job ${job.token}.`,
                  )
                }
                hasPendingRequest={hasPendingRequest}
                isExpanded={expandedCardId === job.id}
                onToggle={() => handleToggleCard(job.id)}
              />

              {requestingJobId === job.id && requestContext === "assigned" && (
                <div className="mt-3 rounded-md border border-[#2563EB]/20 bg-[#2563EB]/10 p-4">
                  <p className="font-semibold text-[#0F172A]">Request admin</p>
                  <select
                    value={requestType}
                    onChange={(event) => setRequestType(event.target.value as RequestType)}
                    className="mt-3 w-full rounded-md border border-[#2563EB]/20 px-3 py-2 text-sm outline-none focus:border-[#2563EB]"
                  >
                    {requestFormTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <textarea
                    value={requestMessage}
                    onChange={(event) => setRequestMessage(event.target.value)}
                    placeholder="Explain why you need admin action..."
                    className="mt-3 w-full rounded-md border border-[#2563EB]/20 p-3 outline-none focus:border-[#2563EB]"
                    rows={3}
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleRequestAdmin(job.id)}
                      className="flex items-center gap-2 rounded-md bg-[#2563EB] px-4 py-2 font-semibold text-white transition hover:bg-[#1d4ed8]"
                    >
                      <Send size={16} />
                      Send request
                    </button>
                    <button
                      onClick={() => {
                        setRequestingJobId(null);
                        setRequestMessage("");
                      }}
                      className="rounded-md bg-white px-4 py-2 font-semibold text-[#0F172A] ring-1 ring-slate-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {!filteredAndSortedJobs.length && (
          <p className="rounded-md bg-slate-50 p-4 text-[#0F172A]">No jobs match the current filters.</p>
        )}
      </div>
    </section>
  );

  const renderAvailableJobs = () => {
    const myTechnicianId = currentUser?.technician?.id;

    return (
      <section className="rounded-lg bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-[#0F172A]">Available Jobs</h1>
        <p className="mt-1 text-slate-500">
          Open jobs matching your skill. Auto-matched jobs require your confirmation.
        </p>
        <div className="mt-5 grid gap-4">
          {openJobs.map((job) => {
            const style = utilityStyles[job.type];
            const hasPendingRequest = requests.some(
              (request) => request.complaintId === job.id && request.status === "Pending",
            );
            const isAutoMatched = job.technician?.id === myTechnicianId;

            return (
              <article key={job.id} className="rounded-md border border-slate-200 p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    {job.photoUrl ? (
                      <img
                        src={job.photoUrl}
                        alt={job.title}
                        className="mb-3 h-40 w-full max-w-xs rounded-md border border-slate-200 object-cover"
                      />
                    ) : (
                      <div className="mb-3 flex h-40 max-w-xs items-center justify-center rounded-md border border-slate-200 bg-slate-50">
                        <div className="text-center text-slate-400">
                          <ImageOff size={32} className="mx-auto" />
                          <p className="mt-1 text-sm">No photo</p>
                        </div>
                      </div>
                    )}
                    <p className="text-sm font-semibold text-[#2563EB]">{job.token}</p>
                    <h2 className="mt-1 text-xl font-bold text-[#0F172A]">{job.title}</h2>
                    <p className="mt-2 text-slate-500">{job.description}</p>
                    <p className="mt-2 flex items-center gap-2 text-slate-500">
                      <MapPin size={18} />
                      {job.area}
                    </p>
                  </div>
                  <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${style.bg} ${style.text}`}>
                    {job.type}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${priorityStyles[job.priority]}`}>
                    {job.priority}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                    {job.status}
                  </span>
                  {isAutoMatched && (
                    <span className="rounded-full bg-[#22C55E]/10 px-3 py-1 text-sm font-semibold text-[#22C55E]">
                      Auto-matched to you
                    </span>
                  )}
                </div>

                {hasPendingRequest ? (
                  <p className="mt-4 rounded-md bg-[#F59E0B]/10 p-3 text-sm font-semibold text-[#F59E0B]">
                    Admin request pending for this job.
                  </p>
                ) : confirmingId === job.id ? (
                  <div className="mt-4 rounded-md border border-[#22C55E]/20 bg-[#22C55E]/10 p-4">
                    <p className="font-semibold text-[#0F172A]">Confirm this assignment</p>
                    <p className="mb-3 mt-1 text-sm text-slate-500">
                      Confirm that you accept this job and are ready to work on it.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleConfirmJob(job.id)}
                        className="rounded-md bg-[#22C55E] px-4 py-2 font-semibold text-white transition hover:bg-[#16a34a]"
                      >
                        Confirm and start
                      </button>
                      <button
                        onClick={() => setConfirmingId(null)}
                        className="rounded-md bg-white px-4 py-2 font-semibold text-[#0F172A] ring-1 ring-slate-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : requestingJobId === job.id ? (
                  <div className="mt-4 rounded-md border border-[#2563EB]/20 bg-[#2563EB]/10 p-4">
                    <p className="font-semibold text-[#0F172A]">Request admin</p>
                    <select
                      value={requestType}
                      onChange={(event) => setRequestType(event.target.value as RequestType)}
                      className="mt-3 w-full rounded-md border border-[#2563EB]/20 px-3 py-2 text-sm outline-none focus:border-[#2563EB]"
                    >
                      {requestTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <textarea
                      value={requestMessage}
                      onChange={(event) => setRequestMessage(event.target.value)}
                      placeholder="Explain why you need admin action..."
                      className="mt-3 w-full rounded-md border border-[#2563EB]/20 p-3 outline-none focus:border-[#2563EB]"
                      rows={3}
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleRequestAdmin(job.id)}
                        className="flex items-center gap-2 rounded-md bg-[#2563EB] px-4 py-2 font-semibold text-white transition hover:bg-[#1d4ed8]"
                      >
                        <Send size={16} />
                        Send request
                      </button>
                      <button
                        onClick={() => {
                          setRequestingJobId(null);
                          setRequestMessage("");
                        }}
                        className="rounded-md bg-white px-4 py-2 font-semibold text-[#0F172A] ring-1 ring-slate-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {isAutoMatched && (
                      <button
                        onClick={() => setConfirmingId(job.id)}
                        className="flex items-center gap-2 rounded-md bg-[#22C55E] px-4 py-2 font-semibold text-white transition hover:bg-[#16a34a]"
                      >
                        <CheckCircle2 size={16} />
                        Confirm assignment
                      </button>
                    )}
                    {!isAutoMatched && (
                      <button
                        onClick={() =>
                          openRequestForm(
                            job,
                            "available",
                            "Assignment",
                            `I am available to take job ${job.token} in ${job.area}.`,
                          )
                        }
                        className="flex items-center gap-2 rounded-md bg-[#2563EB] px-4 py-2 font-semibold text-white transition hover:bg-[#1d4ed8]"
                      >
                        <Send size={16} />
                        Request admin
                      </button>
                    )}
                    <Link
                      to={`/complaints/${job.id}`}
                      className="flex items-center gap-2 rounded-md bg-[#0F172A] px-4 py-2 font-semibold text-white transition hover:bg-[#1e293b]"
                    >
                      <ExternalLink size={16} />
                      View job
                    </Link>
                  </div>
                )}
              </article>
            );
          })}
          {!openJobs.length && (
            <p className="rounded-md bg-slate-50 p-4 text-slate-600">No open jobs available for your skill right now.</p>
          )}
        </div>
      </section>
    );
  };

  const renderAdminRequests = () => (
    <section className="rounded-lg bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-bold text-[#0F172A]">My Admin Requests</h1>
      <p className="mt-1 text-slate-500">Track requests you sent to the authority panel.</p>
      <div className="mt-5 space-y-3">
        {requests.map((request) => (
          <article key={request.id} className="rounded-md border border-slate-200 p-4">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
              <div>
                <p className="font-semibold text-[#0F172A]">
                  {request.complaint?.token} · {request.complaint?.title}
                </p>
                <p className="text-sm text-slate-500">
                  {request.type} · {formatSubmittedAt(request.createdAt)}
                </p>
              </div>
              <span
                className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${
                  request.status === "Approved"
                    ? "bg-[#22C55E]/10 text-[#22C55E]"
                    : request.status === "Rejected"
                      ? "bg-[#EF4444]/10 text-[#EF4444]"
                      : "bg-[#F59E0B]/10 text-[#F59E0B]"
                }`}
              >
                {request.status}
              </span>
            </div>
            <p className="mt-3 text-slate-600">{request.message}</p>
            {request.adminNote && (
              <p className="mt-2 rounded-md bg-slate-50 p-3 text-sm text-slate-500">
                Admin reply: {request.adminNote}
              </p>
            )}
          </article>
        ))}
        {!requests.length && (
          <p className="rounded-md bg-slate-50 p-4 text-slate-600">You have not sent any admin requests yet.</p>
        )}
      </div>
    </section>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case "Dashboard":
        return renderDashboard();
      case "My Jobs":
        return renderMyJobs();
      case "Available Jobs":
        return renderAvailableJobs();
      case "Admin Requests":
        return renderAdminRequests();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-[#0F172A]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 text-white lg:block">
        {sidebar}
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-black/40" onClick={() => setMobileNavOpen(false)} />
          <aside className="relative h-full w-72 text-white">{sidebar}</aside>
        </div>
      )}

      <main className="px-5 py-6 sm:px-8 lg:ml-72">
        <header className="mb-6 flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 shadow-xl sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="rounded-lg bg-white/10 p-2 lg:hidden backdrop-blur-sm"
              aria-label="Open navigation"
            >
              <Menu size={20} className="text-white" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">{sectionTitles[activeSection]}</h1>
                {activeSection === "Dashboard" && (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-300">{sectionDescriptions[activeSection]}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200 backdrop-blur-sm md:flex">
              <Activity size={14} className="text-emerald-400" />
              <span className="text-emerald-400">Live</span>
              <span className="text-slate-400">•</span>
              <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowNotificationsPanel((prev) => !prev)}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10 backdrop-blur-sm"
                aria-label="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotificationsPanel && (
                <>
                  <button
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotificationsPanel(false)}
                    aria-hidden
                  />
                  <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl sm:w-96">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-bold text-[#0F172A]">Notifications</p>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-sm text-slate-500">No notifications yet.</p>
                    ) : (
                      notifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`flex w-full flex-col gap-1 border-b border-slate-100 p-4 text-left transition hover:bg-slate-50 ${
                            !notification.isRead ? "bg-blue-50/50" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                              notification.type === "NEW_MESSAGE"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-700"
                            }`}>
                              {notification.type === "NEW_MESSAGE" ? "New Message" : notification.type}
                            </span>
                            {!notification.isRead && (
                              <span className="h-2 w-2 rounded-full bg-blue-500" />
                            )}
                          </div>
                          <p className="text-sm font-semibold text-[#0F172A]">{notification.title}</p>
                          {notification.body && (
                            <p className="line-clamp-2 text-xs text-slate-500">{notification.body}</p>
                          )}
                           <p className="text-[10px] font-medium text-slate-400">
                             {new Date(notification.createdAt).toLocaleString()}
                           </p>
                         </button>
                       ))
                     )}
                    </div>
                  </div>
                </>
              )}
            </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-slate-200 backdrop-blur-sm">
              <span
                className={`h-2 w-2 rounded-full ${
                  isRefreshing ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                }`}
              />
              <span className="hidden sm:inline">{timeAgo(lastUpdated)}</span>
              <span className="sm:hidden">{isRefreshing ? "Refreshing" : "Live"}</span>
            </div>
            <button
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10 disabled:opacity-60 backdrop-blur-sm"
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <select
              value={pollInterval}
              onChange={(event) => setPollInterval(Number(event.target.value))}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-white outline-none focus:border-[#2563EB] backdrop-blur-sm"
            >
              <option value={3} className="text-slate-900">3s</option>
              <option value={5} className="text-slate-900">5s</option>
              <option value={8} className="text-slate-900">8s</option>
              <option value={15} className="text-slate-900">15s</option>
            </select>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to logout?")) {
                  localStorage.clear();
                  navigate("/");
                }
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-red-500/30 transition-all hover:from-red-600 hover:to-red-700 hover:shadow-xl hover:shadow-red-500/40"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {error && (
          <p className="mb-4 rounded-md bg-[#EF4444]/10 p-4 font-semibold text-[#EF4444]">{error}</p>
        )}
        {actionError && (
          <p className="mb-4 rounded-md bg-[#EF4444]/10 p-4 font-semibold text-[#EF4444]">{actionError}</p>
        )}

        {renderSectionContent()}
      </main>
    </div>
  );
}

type StatusFilter = "all" | ComplaintStatus;
type PriorityFilter = "all" | ComplaintPriority;
type SortKey = "priority" | "eta" | "recent" | "token";

const PRIORITY_ACCENT: Record<ComplaintPriority, { border: string; badge: string; glow: string }> = {
  Emergency: {
    border: "border-l-[#EF4444]",
    badge: "bg-[#EF4444] text-white",
    glow: "shadow-[#EF4444]/20",
  },
  High: {
    border: "border-l-[#F59E0B]",
    badge: "bg-[#F59E0B] text-white",
    glow: "shadow-[#F59E0B]/20",
  },
  Normal: {
    border: "border-l-[#22C55E]",
    badge: "bg-[#22C55E] text-white",
    glow: "shadow-[#22C55E]/20",
  },
};

type JobCardProps = {
  job: Complaint;
  completingId: string | null;
  completionNote: string;
  onStartComplete: () => void;
  onCancelComplete: () => void;
  onComplete: () => void;
  onNoteChange: (value: string) => void;
  onRequestAdmin?: () => void;
  hasPendingRequest?: boolean;
  isExpanded: boolean;
  onToggle: () => void;
};

function JobCard({
  job,
  completingId,
  completionNote,
  onStartComplete,
  onCancelComplete,
  onComplete,
  onNoteChange,
  onRequestAdmin,
  hasPendingRequest,
  isExpanded,
  onToggle,
}: JobCardProps) {
  const accent = PRIORITY_ACCENT[job.priority];
  const isEmergency = job.priority === "Emergency";

  return (
    <article
      className={`overflow-hidden rounded-lg border border-slate-200 bg-white transition-all duration-300 ${
        isExpanded ? `shadow-lg ${accent.glow}` : "shadow-sm hover:shadow-md"
      } border-l-4 ${accent.border}`}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-3 p-4 text-left transition hover:bg-slate-50"
      >
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold tracking-wide uppercase ${accent.badge}`}>
                {job.priority}
              </span>
              {isEmergency && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#EF4444]/10 px-2.5 py-1 text-xs font-semibold text-[#EF4444]">
                  <ShieldAlert size={12} />
                  Emergency
                </span>
              )}
              <span className="text-xs font-semibold text-slate-500">{job.type}</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-500">{job.token}</p>
            <h2 className="text-lg font-bold text-[#0F172A]">{job.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{job.description}</p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin size={14} />
              {job.area}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <span className="rounded-full bg-[#0F172A] px-3 py-1 text-xs font-semibold text-white">
              {job.status}
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {isExpanded ? "Collapse" : "Expand"}
            </div>
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-slate-200 bg-slate-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className={`rounded-md p-3 ${isEmergency ? "bg-[#EF4444]/10 border border-[#EF4444]/20" : "bg-white border border-slate-200"}`}>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Priority</p>
              <p className={`mt-1 text-lg font-bold ${isEmergency ? "text-[#EF4444]" : "text-[#0F172A]"}`}>{job.priority}</p>
            </div>
            <div className="rounded-md bg-white p-3 border border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">ETA</p>
              <p className="mt-1 text-lg font-bold text-[#0F172A]">{formatEta(job.technician?.etaMinutes)}</p>
            </div>
            <div className="rounded-md bg-white p-3 border border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Citizen Contact</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-[#0F172A]">
                <Phone size={14} />
                {job.citizen?.phone ?? "Not available"}
              </p>
            </div>
          </div>

          {completingId === job.id ? (
            <div className="mt-4 rounded-md border border-[#22C55E]/20 bg-[#22C55E]/10 p-4">
              <p className="font-semibold text-[#0F172A]">Complete this job</p>
              <textarea
                value={completionNote}
                onChange={(event) => onNoteChange(event.target.value)}
                placeholder="Brief work summary (optional)"
                className="mt-3 w-full rounded-md border border-[#22C55E]/20 bg-white p-3 outline-none focus:border-[#22C55E]"
                rows={3}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={onComplete}
                  className="rounded-md bg-[#22C55E] px-4 py-2 font-semibold text-white transition hover:bg-[#16a34a]"
                >
                  Confirm complete
                </button>
                <button
                  onClick={onCancelComplete}
                  className="rounded-md bg-white px-4 py-2 font-semibold text-[#0F172A] ring-1 ring-slate-200 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={onStartComplete}
                className="flex items-center gap-2 rounded-md bg-[#22C55E] px-4 py-2 font-semibold text-white transition hover:bg-[#16a34a]"
              >
                <CheckCircle2 size={16} />
                Complete work
              </button>
              {onRequestAdmin && !hasPendingRequest && (
                <button
                  onClick={onRequestAdmin}
                  className="flex items-center gap-2 rounded-md bg-[#2563EB] px-4 py-2 font-semibold text-white transition hover:bg-[#1d4ed8]"
                >
                  <Send size={16} />
                  Request admin
                </button>
              )}
              {hasPendingRequest && (
                <span className="rounded-md bg-[#F59E0B]/10 px-4 py-2 text-sm font-semibold text-[#F59E0B]">
                  Admin request pending
                </span>
              )}
              <Link
                to={`/complaints/${job.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 rounded-md bg-[#0F172A] px-4 py-2 font-semibold text-white transition hover:bg-[#1e293b]"
              >
                <ExternalLink size={16} />
                View details
              </Link>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
