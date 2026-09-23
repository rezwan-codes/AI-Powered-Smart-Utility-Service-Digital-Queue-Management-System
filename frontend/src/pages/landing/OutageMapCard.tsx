import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const legendItems = [
  { color: "bg-blue-500", label: "Electricity" },
  { color: "bg-orange-500", label: "Gas" },
  { color: "bg-red-500", label: "Water" },
  { color: "bg-emerald-500", label: "Resolved" },
];

export default function OutageMapCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Live Outage Map</h3>
          <p className="mt-1 text-sm text-slate-500">Real-time service disruptions</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <MapPin size={20} />
        </div>
      </div>

      {/* Map Illustration */}
      <div
        className="mt-6 h-64 w-full overflow-hidden rounded-2xl bg-slate-100 relative"
        style={{ backgroundImage: "url('/images/outagemap.png')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="h-full w-full [background-image:linear-gradient(#cbd5e1_1px,transparent_1px),linear-gradient(90deg,#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        {/* Decorative Circles */}
        <div className="absolute left-[10%] top-[15%] h-24 w-24 rounded-full bg-blue-100/20" />
        <div className="absolute left-[40%] top-[25%] h-32 w-32 rounded-full bg-orange-100/20" />
        <div className="absolute left-[60%] top-[60%] h-28 w-28 rounded-full bg-red-100/20" />
        <div className="absolute left-[20%] top-[70%] h-20 w-20 rounded-full bg-emerald-100/20" />

        {/* Map Pins */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[15%] top-[20%] h-4 w-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 ring-4 ring-white"
        />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          className="absolute left-[45%] top-[30%] h-4 w-4 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50 ring-4 ring-white"
        />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          className="absolute left-[65%] top-[65%] h-4 w-4 rounded-full bg-red-500 shadow-lg shadow-red-500/50 ring-4 ring-white"
        />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
          className="absolute left-[25%] top-[75%] h-4 w-4 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 ring-4 ring-white"
        />
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        {legendItems.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${color} shadow-sm`} />
            <span className="text-xs font-medium text-slate-600">{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
