import { motion } from "framer-motion";
import { Users, CheckCircle, UserCheck, TrendingUp, Clock } from "lucide-react";

const stats = [
  {
    value: "15K+",
    label: "Happy Users",
    Icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    value: "35K+",
    label: "Complaints Resolved",
    Icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    value: "120+",
    label: "Active Technicians",
    Icon: UserCheck,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    value: "98%",
    label: "Service Efficiency",
    Icon: TrendingUp,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    value: "24/7",
    label: "Support Available",
    Icon: Clock,
    color: "text-red-600",
    bg: "bg-red-50",
  },
];

export default function Stats() {
  return (
    <section className="relative bg-gradient-to-br from-[#061A40] via-[#0B1F5E] to-[#061A40] py-20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5"
        >
          {stats.map(({ value, label, Icon, color, bg }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.05 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all hover:bg-white/10"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Icon */}
              <div
                className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${bg} transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon size={32} className={color} />
              </div>

              {/* Value */}
              <motion.p
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                className="text-4xl font-bold text-white"
              >
                {value}
              </motion.p>

              {/* Label */}
              <p className="mt-2 text-sm font-medium text-slate-300">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
