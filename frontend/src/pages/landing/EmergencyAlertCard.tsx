import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";

export default function EmergencyAlertCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 to-red-700 p-6 text-white shadow-2xl shadow-red-500/20"
    >
      {/* Glow Effect */}
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-red-400/30 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-red-400/20 blur-3xl" />

      <div className="relative flex items-start gap-4">
        {/* Icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
          <Zap size={24} className="text-white" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white">Emergency Alert</h3>
          <p className="mt-2 text-sm leading-6 text-red-100">
            Pipeline leakage reported in Mirpur Area. Emergency response team dispatched.
          </p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/30">
            View Details
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
