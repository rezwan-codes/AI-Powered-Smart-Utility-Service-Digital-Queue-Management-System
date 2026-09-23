import { motion } from "framer-motion";
import {
  Ticket,
  MapPin,
  UserCheck,
  Map,
  Bell,
} from "lucide-react";

const features = [
  {
    title: "Digital Token",
    description: "Get instant queue number",
    Icon: Ticket,
    color: "text-blue-600",
    bg: "bg-blue-50",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    title: "Real-Time Tracking",
    description: "Track complaint progress",
    Icon: MapPin,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Auto Technician Assignment",
    description: "Nearest technician automatically assigned",
    Icon: UserCheck,
    color: "text-purple-600",
    bg: "bg-purple-50",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    title: "Live Outage Map",
    description: "Monitor nearby service disruptions",
    Icon: Map,
    color: "text-orange-600",
    bg: "bg-orange-50",
    gradient: "from-orange-500 to-orange-600",
  },
  {
    title: "Emergency Alerts",
    description: "Receive critical utility notifications",
    Icon: Bell,
    color: "text-red-600",
    bg: "bg-red-50",
    gradient: "from-red-500 to-red-600",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-20">
      {/* Floating Features Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-[2rem] bg-white p-8 shadow-2xl shadow-blue-900/10 sm:p-12"
        >
          {/* Section Header */}
          <div className="mb-12 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-slate-900 sm:text-4xl"
            >
              Powerful Features for
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                {" "}
                Modern Citizens
              </span>
            </motion.h2>
            <p className="mt-4 text-lg text-slate-600">
              Everything you need to manage utility complaints efficiently
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {features.map(({ title, description, Icon, color, bg, gradient }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-shadow hover:shadow-xl"
              >
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 -z-10 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                />

                {/* Icon */}
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${bg} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={28} className={color} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>

                {/* Hover Arrow */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600"
                >
                  Learn more
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
