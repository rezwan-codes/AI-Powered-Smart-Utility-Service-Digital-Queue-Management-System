import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Droplets,
  Flame,
  Zap,
  Trash2,
  Lightbulb,
  Phone,
  Navigation,
  Clock,
  User,
  Star,
  ArrowRight,
} from "lucide-react";

const utilityCategories = [
  { name: "Water", Icon: Droplets, color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-200" },
  { name: "Gas", Icon: Flame, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  { name: "Electricity", Icon: Zap, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
  { name: "Waste", Icon: Trash2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  { name: "Streetlight", Icon: Lightbulb, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-[#061A40] via-[#0B1F5E] to-[#061A40] py-20 lg:py-32">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-bg.png"
          alt=""
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#061A40]/40 via-[#0B1F5E]/40 to-[#061A40]/40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              Smart Services. Better Community.
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
            >
              Smart Utility
              <br />
              Services.
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                Real-Time.
              </span>
              <br />
              <span className="text-slate-300">Transparent.</span>
              <br />
              <span className="text-emerald-400">Efficient.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 max-w-lg text-base leading-7 text-slate-300 sm:text-lg"
            >
              Submit complaints, track your queue in real-time, receive updates, and experience faster utility services with complete transparency.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <button
                onClick={() => navigate("/user/register")}
                className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 font-semibold text-white shadow-xl shadow-blue-500/30 transition-all hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1"
              >
                <Phone size={18} className="transition group-hover:scale-110" />
                Submit Complaint
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => navigate("/user/login")}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-8 py-4 font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 hover:-translate-y-1"
              >
                <Navigation size={18} />
                Track Your Token
              </button>
            </motion.div>

            {/* Utility Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-10 grid grid-cols-5 gap-3"
            >
              {utilityCategories.map(({ name, Icon, color, bg, border }) => (
                <motion.div
                  key={name}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className={`flex flex-col items-center gap-2 rounded-2xl border ${border} ${bg} p-4 transition-shadow hover:shadow-lg`}
                >
                  <Icon size={24} className={color} />
                  <span className="text-xs font-semibold text-slate-700">{name}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div className="flex items-center justify-center gap-6 lg:gap-10">
              {/* Floating Outage Map Card - LEFT of phone */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="hidden lg:block"
              >
                <div className="rounded-2xl border border-white/20 bg-white/95 p-5 shadow-xl backdrop-blur-sm">
                  <p className="text-sm font-bold text-slate-900">Live Outage Map</p>
                  <div className="mt-3 h-48 w-64 rounded-xl bg-slate-100 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30">
                      <div className="h-full w-full [background-image:linear-gradient(#cbd5e1_1px,transparent_1px),linear-gradient(90deg,#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]" />
                    </div>
                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="absolute left-1/4 top-1/4 h-4 w-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 ring-4 ring-white" />
                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} className="absolute left-1/2 top-1/3 h-4 w-4 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50 ring-4 ring-white" />
                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} className="absolute left-3/4 top-1/2 h-4 w-4 rounded-full bg-red-500 shadow-lg shadow-red-500/50 ring-4 ring-white" />
                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.9 }} className="absolute left-1/3 top-2/3 h-4 w-4 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 ring-4 ring-white" />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500 shadow-sm" /> Electricity</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-orange-500 shadow-sm" /> Gas</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500 shadow-sm" /> Water</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm" /> Resolved</span>
                  </div>
                </div>
              </motion.div>

              {/* Phone Mockup + Emergency Card Column */}
              <div className="flex flex-col items-center gap-6">
                {/* Phone Mockup - Center */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative h-[500px] w-[260px] rounded-[3rem] border-8 border-slate-800 bg-slate-900 shadow-2xl"
                >
                  {/* Phone Screen */}
                  <div className="h-full w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-slate-50 to-white p-6">
                    {/* Status Bar */}
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-slate-800" />
                        <div className="h-3 w-3 rounded-full bg-slate-800" />
                      </div>
                    </div>

                    {/* Greeting */}
                    <div className="mt-6">
                      <p className="text-sm text-slate-500">Good morning,</p>
                      <p className="text-2xl font-bold text-slate-900">Ahmed 👋</p>
                    </div>

                    {/* Digital Token Card */}
                    <div className="mt-6 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white shadow-xl shadow-blue-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-blue-100">Digital Token</p>
                          <p className="mt-1 text-3xl font-bold">#A1024</p>
                        </div>
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                          Pending
                        </span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-blue-100">ETA</p>
                          <p className="text-sm font-bold">25-30 mins</p>
                        </div>
                        <div>
                          <p className="text-xs text-blue-100">Queue Position</p>
                          <p className="text-sm font-bold">12 / 45</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Timeline */}
                    <div className="mt-6">
                      <p className="text-xs font-semibold text-slate-500">Complaint Progress</p>
                      <div className="mt-3 flex items-center justify-between">
                        {["Submitted", "Processing", "On The Way", "Completed"].map(
                          (step, index) => (
                            <div key={step} className="flex flex-col items-center">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                                  index <= 1
                                    ? "border-blue-600 bg-blue-600 text-white"
                                    : "border-slate-300 bg-white text-slate-400"
                                }`}
                              >
                                {index <= 1 ? (
                                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                ) : (
                                  <span className="text-xs font-bold">{index + 1}</span>
                                )}
                              </div>
                              <p className="mt-1 text-[10px] font-medium text-slate-600">{step}</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Assigned Technician */}
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-xs font-semibold text-slate-500">Assigned Technician</p>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
                          <User size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900">Rahman Mia</p>
                          <div className="flex items-center gap-1">
                            <Star size={12} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-semibold text-slate-600">4.8</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock size={12} />
                            ETA: 25 mins
                          </div>
                        </div>
                        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 transition hover:scale-110">
                          <Phone size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Phone Notch */}
                  <div className="absolute top-0 left-1/2 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-800" />
                </motion.div>

                {/* Emergency Alert Card */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
                  className="hidden lg:block"
                >
                  <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-red-100/50 p-5 shadow-xl backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30">
                        <Zap size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-red-900">Emergency Alert</p>
                        <p className="mt-1 text-xs text-red-700">
                          Pipeline leakage reported in Mirpur Area
                        </p>
                        <button className="mt-2 text-xs font-semibold text-red-600 transition hover:text-red-800">
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
