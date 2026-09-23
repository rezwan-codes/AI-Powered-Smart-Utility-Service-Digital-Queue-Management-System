import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Phone, Mail, MapPin, HelpCircle, AlertTriangle, MessageSquare, ArrowLeft, Globe } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const contactInfo = [
  {
    title: "Phone",
    Icon: Phone,
    value: "01761112352",
    detail: "Available Sunday–Thursday, 9:00 AM – 6:00 PM",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Email",
    Icon: Mail,
    value: "rezwanmolla222@gmail.com",
    detail: "We'll respond as soon as possible.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Location",
    Icon: MapPin,
    value: "Dhaka, Bangladesh",
    detail: "Digital Queue System, Smart Utility Service Platform",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

const quickSupport = [
  { title: "General Support", Icon: HelpCircle, description: "Need help using the platform?" },
  { title: "Report an Issue", Icon: AlertTriangle, description: "Having trouble with your complaint or queue?" },
  { title: "Feedback", Icon: MessageSquare, description: "Share your ideas to improve our platform." },
];

export default function Contact() {
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
          <img src="/images/hero-bg.png" alt="" className="h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#061A40]/90 via-[#0B1F5E]/90 to-[#061A40]/90" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.2 }}
              className="text-center lg:text-left"
            >
              <motion.h1 variants={fadeUp} className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Contact Us
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0">
                We're always here to help. Get in touch with us if you have any questions, suggestions, or need support with our Digital Queue System.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative h-[320px] w-full max-w-sm rounded-[3rem] border-8 border-slate-800 bg-slate-900 shadow-2xl">
                <div className="h-full w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-slate-50 to-white p-6">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-slate-800" />
                      <div className="h-3 w-3 rounded-full bg-slate-800" />
                    </div>
                  </div>
                  <div className="mt-8 flex flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                      <MessageSquare size={32} className="text-blue-600" />
                    </div>
                    <p className="text-lg font-bold text-slate-900">Get in Touch</p>
                    <p className="text-sm text-slate-500 text-center">We're here to help you with any questions or support you need.</p>
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="rounded-xl bg-blue-50 p-3">
                      <p className="text-xs font-semibold text-blue-700">Response Time</p>
                      <p className="text-2xl font-bold text-blue-900">&lt; 24 hrs</p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-3">
                      <p className="text-xs font-semibold text-emerald-700">Support</p>
                      <p className="text-2xl font-bold text-emerald-900">Available</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 left-1/2 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-800" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {contactInfo.map(({ title, Icon, value, detail, color, bg }, index) => (
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
                <p className="mt-2 text-base font-semibold text-white">{value}</p>
                <p className="mt-1 text-sm text-slate-300 whitespace-pre-line">{detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Support */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
            className="mb-12 text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-white sm:text-4xl">Quick Support</motion.h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {quickSupport.map(({ title, Icon, description }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="cursor-pointer rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  <Icon size={24} className="text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-white">{title}</h3>
                <p className="mt-1 text-sm text-slate-300">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Map */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
            className="mb-12 text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-white sm:text-4xl">Our Location</motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm"
          >
            <div className="relative h-[400px] w-full bg-slate-100">
              <div className="absolute inset-0 opacity-30">
                <div className="h-full w-full [background-image:linear-gradient(#cbd5e1_1px,transparent_1px),linear-gradient(90deg,#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]" />
              </div>
              <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-blue-500 bg-white shadow-lg">
                <div className="absolute inset-0 animate-ping rounded-full border-4 border-blue-400 opacity-75" />
              </div>
              <div className="absolute bottom-4 left-4 rounded-xl border border-white/20 bg-white/95 p-4 shadow-lg">
                <p className="text-sm font-semibold text-slate-900">Dhaka, Bangladesh</p>
                <p className="text-xs text-slate-500">Digital Queue System Headquarters</p>
              </div>
              <div className="absolute right-4 top-1/2 flex flex-col gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md text-slate-700 transition hover:bg-slate-50">+</button>
                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md text-slate-700 transition hover:bg-slate-50">−</button>
              </div>
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
                <li><a href="/about" className="text-sm text-slate-300 transition hover:text-white">About</a></li>
                <li><a href="/contact" className="text-sm text-slate-300 transition hover:text-white">Contact</a></li>
                <li><a href="#" className="text-sm text-slate-300 transition hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-slate-300 transition hover:text-white">Terms & Conditions</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Contact</h3>
              <ul className="mt-4 space-y-2">
                <li className="text-sm text-slate-300">Phone: 01761112352</li>
                <li className="text-sm text-slate-300">Email: rezwanmolla222@gmail.com</li>
                <li className="text-sm text-slate-300">Dhaka, Bangladesh</li>
              </ul>
            </div>
            <div className="sm:col-span-2 lg:col-span-2">
              <h3 className="text-lg font-bold text-white">Connect With Us</h3>
              <div className="mt-4 flex items-center gap-4">
                <a href="#" className="text-slate-300 transition hover:text-white"><Globe size={20} /></a>
                <a href="#" className="text-slate-300 transition hover:text-white"><Globe size={20} /></a>
                <a href="#" className="text-slate-300 transition hover:text-white"><Globe size={20} /></a>
                <a href="#" className="text-slate-300 transition hover:text-white"><Mail size={20} /></a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-8 text-center">
            <p className="text-sm text-slate-300">© 2026 Digital Queue System. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
