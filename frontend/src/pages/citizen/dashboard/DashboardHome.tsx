import { motion } from "framer-motion";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  AlertTriangle,
  ClipboardList,
  Lightbulb,
  MapPinned,
  Phone,
  Plus,
  Wrench,
} from "lucide-react";
import {
  formatEta,
  formatSubmittedAt,
  statusStyles,
} from "../../../utils/utilityDisplay";
import type { Complaint } from "../../../types/utility";
import MapTracker from "../../../components/map/MapTracker";

type OutletContext = {
  complaints: Complaint[];
  user: any | null;
  activeComplaint: Complaint | undefined;
  stats: any[];
};

export default function DashboardHome() {
  const navigate = useNavigate();
  const ctx = useOutletContext<OutletContext>();

  if (!ctx) return null;

  const { activeComplaint, stats } = ctx;

  return (
    <div className="grid gap-6 xl:grid-cols-[13fr_7fr]">
      <div className="space-y-6">
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
              <p className="mt-1 text-sm text-blue-700">
                {activeComplaint
                  ? "You have an active complaint that needs attention."
                  : "No complaints yet. Submit your first utility issue to get started!"}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-3">
          <button
            onClick={() => navigate("new-complaint")}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-5 flex items-center justify-center gap-3 transition hover:shadow-lg hover:-translate-y-0.5"
          >
            <Plus size={20} />
            New Complaint
          </button>
          <button
            onClick={() => navigate("complaints")}
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl p-5 flex items-center justify-center gap-3 transition hover:shadow-lg hover:-translate-y-0.5"
          >
            <ClipboardList size={20} />
            View All
          </button>
          <button
            onClick={() => navigate("map")}
            className="bg-green-600 hover:bg-green-700 text-white rounded-2xl p-5 flex items-center justify-center gap-3 transition hover:shadow-lg hover:-translate-y-0.5"
          >
            <MapPinned size={20} />
            Live Map
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, Icon, color, bg, suffix }: any, index: number) => (
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
                  <>{value}{suffix}</>
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
                  <AlertTriangle className="text-sky-300" size={20} />
                  <p className="mt-2 text-xs text-slate-300">Queue Position</p>
                  <p className="text-xl font-bold">#{activeComplaint.position}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <AlertTriangle className="text-amber-300" size={20} />
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
                onClick={() => navigate("new-complaint")}
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
              locations={[]}
              userLocation={null}
              technicianLocations={[]}
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
                <h4 className="font-bold text-xl text-slate-900">Unknown</h4>
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
  );
}
