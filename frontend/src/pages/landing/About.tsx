import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users,
  CheckCircle,
  UserCheck,
  TrendingUp,
  Clock,
  Shield,
  Zap,
  Droplets,
  Flame,
  Trash2,
  Lightbulb,
  MapPin,
  Bell,
  Ticket,
  Navigation,
  Map,
  User,
  Star,
  Phone,
  ArrowRight,
  Check,
  ArrowLeft,
  Globe,
  Mail,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const missionCards = [
  {
    title: "Reduce Waiting Time",
    description: "Eliminate long queues with digital token-based queuing",
    Icon: Clock,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Increase Transparency",
    description: "Track every complaint in real-time with full visibility",
    Icon: Shield,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Improve Public Services",
    description: "Deliver faster, more reliable utility services",
    Icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    title: "Digital Transformation",
    description: "Modernize utility management with cutting-edge technology",
    Icon: Zap,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

const problems = [
  {
    title: "Long Waiting Lines",
    description: "Citizens waste hours standing in queues for utility services",
    Icon: Users,
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    title: "No Complaint Tracking",
    description: "No visibility into complaint status or progress",
    Icon: Navigation,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    title: "Lack of Transparency",
    description: "Unclear processes and no accountability in service delivery",
    Icon: Shield,
    color: "text-yellow-500",
    bg: "bg-yellow-50",
  },
  {
    title: "Slow Technician Assignment",
    description: "Manual dispatch leads to delays and inefficient resource use",
    Icon: UserCheck,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
];

const features = [
  {
    title: "Digital Complaint Submission",
    description: "Submit complaints online with photos and details",
    Icon: Ticket,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Digital Queue Token",
    description: "Get instant queue number and estimated wait time",
    Icon: Ticket,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    title: "Real-Time Queue Tracking",
    description: "Track your position in queue live",
    Icon: Navigation,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Live Complaint Status",
    description: "Get updates on complaint progress",
    Icon: Bell,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    title: "Nearest Technician Assignment",
    description: "AI assigns the closest available technician",
    Icon: UserCheck,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    title: "Live Outage Map",
    description: "Monitor service disruptions in real-time",
    Icon: Map,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    title: "Emergency Alerts",
    description: "Receive critical utility notifications",
    Icon: Bell,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    title: "Admin Dashboard",
    description: "Comprehensive analytics and management tools",
    Icon: Shield,
    color: "text-slate-600",
    bg: "bg-slate-50",
  },
];

const timelineSteps = [
  { step: "Step 1", title: "Submit Complaint", description: "Citizen submits complaint with details" },
  { step: "Step 2", title: "Generate Digital Token", description: "System generates unique queue token" },
  { step: "Step 3", title: "AI Categorizes Complaint", description: "AI categorizes and prioritizes complaint" },
  { step: "Step 4", title: "Nearest Technician Assigned", description: "Closest available technician is notified" },
  { step: "Step 5", title: "Real-Time Tracking", description: "Track progress from submission to completion" },
  { step: "Step 6", title: "Complaint Completed", description: "Service delivered and feedback collected" },
];

const stats = [
  { value: "15K+", label: "Citizens Served", Icon: Users },
  { value: "35K+", label: "Complaints Resolved", Icon: CheckCircle },
  { value: "120+", label: "Technicians", Icon: UserCheck },
  { value: "98%", label: "Resolution Rate", Icon: TrendingUp },
];

const platforms = [
  {
    title: "Citizen Portal",
    description: "Submit complaints, track queue, and get updates",
    Icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Technician Portal",
    description: "Receive jobs, navigate to locations, update status",
    Icon: UserCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Admin Dashboard",
    description: "Manage users, view analytics, and oversee operations",
    Icon: Shield,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    title: "Analytics & Reports",
    description: "Generate insights and performance reports",
    Icon: TrendingUp,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

const roadmap = [
  { year: "2026", title: "Digital Complaint Platform", description: "Launch core platform" },
  { year: "2027", title: "AI Complaint Classification", description: "Smart categorization" },
  { year: "2028", title: "Predictive Maintenance", description: "AI-powered issue prediction" },
  { year: "2029", title: "Smart City Integration", description: "IoT and smart city APIs" },
  { year: "2030", title: "Nationwide Digital Utility Ecosystem", description: "Full digital transformation" },
];

const technologies = [
  "React", "TypeScript", "Tailwind CSS", "Node.js", "Express.js", "Prisma",
  "PostgreSQL", "JWT", "Render", "Cloud",
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#061A40] via-[#0B1F5E] to-[#061A40]">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0">
          <img
            src="/images/hero-bg.png"
            alt=""
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#061A40]/90 via-[#0B1F5E]/90 to-[#061A40]/90" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.2 }}
              className="flex flex-col justify-center"
            >
              <motion.div variants={fadeUp} className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                </span>
                About Digital Queue System
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Transforming Bangladesh's Public Utility Services
              </motion.h1>

              <motion.p variants={fadeUp} className="mt-6 text-lg text-slate-300">
                Smart Digital Technology for Efficient, Transparent, and Citizen-Centric Services
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 font-semibold text-white shadow-xl shadow-blue-500/30 transition-all hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1">
                  Learn More
                  <ArrowRight size={18} className="transition group-hover:translate-x-1" />
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-8 py-4 font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 hover:-translate-y-1">
                  Submit Complaint
                </button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative flex items-center justify-center"
            >
              <div className="relative h-[500px] w-full max-w-md rounded-[3rem] border-8 border-slate-800 bg-slate-900 shadow-2xl">
                <div className="h-full w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-slate-50 to-white p-6">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-slate-800" />
                      <div className="h-3 w-3 rounded-full bg-slate-800" />
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-sm text-slate-500">Good morning,</p>
                    <p className="text-2xl font-bold text-slate-900">Ahmed 👋</p>
                  </div>
                  <div className="mt-6 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white shadow-xl">
                    <p className="text-xs font-semibold text-blue-100">Digital Token</p>
                    <p className="mt-1 text-3xl font-bold">#A1024</p>
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
                </div>
                <div className="absolute top-0 left-1/2 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-800" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
            className="mb-12 text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-white sm:text-4xl">
              Our Mission
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
              Our mission is to digitize utility service management across Bangladesh by creating a transparent, efficient, and user-friendly platform that connects citizens, technicians, and government authorities.
            </motion.p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {missionCards.map(({ title, description, Icon, color, bg }, index) => (
              <motion.div
                key={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all hover:bg-white/10"
              >
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${bg}`}>
                  <Icon size={32} className={color} />
                </div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-300">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Our Vision</h2>
              <p className="mt-6 text-lg text-slate-300">
                We envision a future where every citizen can access public utility services digitally, track complaints in real-time, receive instant updates, and experience faster service delivery through AI-powered technologies.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm">
                  <MapPin className="mx-auto mb-2 text-emerald-400" size={32} />
                  <p className="text-sm font-semibold text-white">Smart Bangladesh</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm">
                  <Zap className="mx-auto mb-2 text-blue-400" size={32} />
                  <p className="text-sm font-semibold text-white">Connected City</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm">
                  <Shield className="mx-auto mb-2 text-purple-400" size={32} />
                  <p className="text-sm font-semibold text-white">AI Network</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm">
                  <Users className="mx-auto mb-2 text-orange-400" size={32} />
                  <p className="text-sm font-semibold text-white">Digital Citizens</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center"
            >
              <div className="relative h-[400px] w-full max-w-md rounded-[3rem] border-8 border-slate-800 bg-slate-900 shadow-2xl">
                <div className="h-full w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-slate-50 to-white p-6">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-slate-800" />
                      <div className="h-3 w-3 rounded-full bg-slate-800" />
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-sm text-slate-500">Smart City</p>
                    <p className="text-2xl font-bold text-slate-900">Dashboard</p>
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="rounded-xl bg-blue-50 p-3">
                      <p className="text-xs font-semibold text-blue-700">Active Complaints</p>
                      <p className="text-2xl font-bold text-blue-900">1,234</p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-3">
                      <p className="text-xs font-semibold text-emerald-700">Resolved Today</p>
                      <p className="text-2xl font-bold text-emerald-900">456</p>
                    </div>
                    <div className="rounded-xl bg-purple-50 p-3">
                      <p className="text-xs font-semibold text-purple-700">Active Technicians</p>
                      <p className="text-2xl font-bold text-purple-900">89</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 left-1/2 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-800" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Solve */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
            className="mb-12 text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-white sm:text-4xl">
              Problems We Solve
            </motion.h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {problems.map(({ title, description, Icon, color, bg }, index) => (
              <motion.div
                key={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10"
              >
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${bg}`}>
                  <Icon size={28} className={color} />
                </div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-300">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Solution - Timeline */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
            className="mb-12 text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-white sm:text-4xl">
              Our Smart Solution
            </motion.h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-blue-500 to-emerald-500" />
            <div className="space-y-12">
              {timelineSteps.map(({ step, title, description }, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
                >
                  <div className="w-5/12 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                    <span className="text-xs font-semibold text-blue-400">{step}</span>
                    <h3 className="mt-2 text-lg font-bold text-white">{title}</h3>
                    <p className="mt-1 text-sm text-slate-300">{description}</p>
                  </div>
                  <div className="absolute left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-blue-500 bg-white" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
            className="mb-12 text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-white sm:text-4xl">
              Core Features
            </motion.h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ title, description, Icon, color, bg }, index) => (
              <motion.div
                key={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10"
              >
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${bg}`}>
                  <Icon size={28} className={color} />
                </div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-300">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center"
            >
              <div className="relative h-[400px] w-full max-w-md rounded-[3rem] border-8 border-slate-800 bg-slate-900 shadow-2xl">
                <div className="h-full w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-slate-50 to-white p-6">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-slate-800" />
                      <div className="h-3 w-3 rounded-full bg-slate-800" />
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-sm text-slate-500">Why Choose Us</p>
                    <p className="text-2xl font-bold text-slate-900">Smart Utility</p>
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3">
                      <Check className="text-emerald-600" size={20} />
                      <span className="text-sm font-semibold text-emerald-900">Fast Service</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-blue-50 p-3">
                      <Check className="text-blue-600" size={20} />
                      <span className="text-sm font-semibold text-blue-900">Transparent System</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-purple-50 p-3">
                      <Check className="text-purple-600" size={20} />
                      <span className="text-sm font-semibold text-purple-900">Digital Queue</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-orange-50 p-3">
                      <Check className="text-orange-600" size={20} />
                      <span className="text-sm font-semibold text-orange-900">Real-Time Updates</span>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 left-1/2 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-800" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Why Choose Us</h2>
              <p className="mt-4 text-lg text-slate-300">
                We combine cutting-edge technology with user-centric design to deliver the best utility service experience.
              </p>
              <div className="mt-8 grid gap-4">
                {[
                  "Fast Service",
                  "Transparent System",
                  "Digital Queue",
                  "Real-Time Updates",
                  "Smart Assignment",
                  "AI Ready",
                  "24/7 Support",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <Check size={16} />
                    </div>
                    <span className="text-base font-semibold text-white">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="bg-[#061A40] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
            className="mb-12 text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-white sm:text-4xl">
              Our Impact
            </motion.h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ value, label, Icon }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                  <Icon size={32} className="text-blue-600" />
                </div>
                <p className="text-4xl font-bold text-white">{value}</p>
                <p className="mt-2 text-sm text-slate-300">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Platform */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
            className="mb-12 text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-white sm:text-4xl">
              Meet the Platform
            </motion.h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {platforms.map(({ title, description, Icon, color, bg }, index) => (
              <motion.div
                key={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10"
              >
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${bg}`}>
                  <Icon size={28} className={color} />
                </div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-300">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Roadmap */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
            className="mb-12 text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-white sm:text-4xl">
              Future Roadmap
            </motion.h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-8 top-0 h-full w-0.5 bg-gradient-to-b from-blue-500 to-emerald-500 md:left-1/2" />
            <div className="space-y-8">
              {roadmap.map(({ year, title, description }, index) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div className="w-full md:w-5/12 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                    <span className="text-xs font-semibold text-blue-400">{year}</span>
                    <h3 className="mt-2 text-lg font-bold text-white">{title}</h3>
                    <p className="mt-1 text-sm text-slate-300">{description}</p>
                  </div>
                  <div className="absolute left-8 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-blue-500 bg-white md:left-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Used */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
            className="mb-12 text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-white sm:text-4xl">
              Technologies Used
            </motion.h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {technologies.map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-600/20 to-emerald-600/20 p-8 text-center backdrop-blur-sm sm:p-12"
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Experience Smarter Utility Services?
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              Join thousands of citizens already using Digital Queue System
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 font-semibold text-white shadow-xl shadow-blue-500/30 transition-all hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1">
                Submit Complaint
                <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </button>
              <button className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-8 py-4 font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 hover:-translate-y-1">
                Explore Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#061A40] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-lg font-bold text-white">Quick Links</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#home" className="text-sm text-slate-300 transition hover:text-white">Home</a></li>
                <li><a href="#features" className="text-sm text-slate-300 transition hover:text-white">Features</a></li>
                <li><a href="#mission" className="text-sm text-slate-300 transition hover:text-white">Mission</a></li>
                <li><a href="#contact" className="text-sm text-slate-300 transition hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Services</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-sm text-slate-300 transition hover:text-white">Water</a></li>
                <li><a href="#" className="text-sm text-slate-300 transition hover:text-white">Gas</a></li>
                <li><a href="#" className="text-sm text-slate-300 transition hover:text-white">Electricity</a></li>
                <li><a href="#" className="text-sm text-slate-300 transition hover:text-white">Waste</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-sm text-slate-300 transition hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-slate-300 transition hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-slate-300 transition hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Connect</h3>
              <div className="mt-4 flex items-center gap-4">
                <a href="#" className="text-slate-300 transition hover:text-white"><Globe size={20} /></a>
                <a href="#" className="text-slate-300 transition hover:text-white"><Globe size={20} /></a>
                <a href="#" className="text-slate-300 transition hover:text-white"><Globe size={20} /></a>
                <a href="#" className="text-slate-300 transition hover:text-white"><Mail size={20} /></a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-8 text-center">
            <p className="text-sm text-slate-300">© 2026 Smart Utility. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
