import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, AlertTriangle, Droplets, Flame, User, Wrench, Shield } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Features", href: "#features" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);

  const tickerItems = [
    { text: "Mirpur: Transfer valve failure reported", Icon: AlertTriangle, color: "text-red-600" },
    { text: "Badda: Water supply restored", Icon: Droplets, color: "text-blue-600" },
    { text: "Gulshan: Gas leakage investigation ongoing", Icon: Flame, color: "text-orange-600" },
    { text: "Dhanmondi: Electricity outage in progress", Icon: Zap, color: "text-yellow-600" },
    { text: "Uttara: Water pressure normalized", Icon: Droplets, color: "text-sky-600" },
    { text: "Mohammadpur: Gas maintenance scheduled", Icon: Flame, color: "text-orange-500" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (loginRef.current && !loginRef.current.contains(event.target as Node)) {
        setLoginOpen(false);
      }
    };

    if (loginOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [loginOpen]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#F5F9FF]/90 backdrop-blur-xl shadow-lg shadow-blue-900/5"
          : "bg-[#F5F9FF]/80 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 transition hover:opacity-80"
          >
            <img
              src="/images/logo.png"
              alt="Smart Utility"
              className="h-12 w-12 rounded-xl object-cover shadow-lg shadow-blue-500/30 ring-2 ring-white"
            />
            <div>
              <p className="text-lg font-bold text-slate-900">Smart Utility</p>
              <p className="text-xs text-slate-500">Digital Queue System</p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Buttons */}
          <div className="hidden items-center gap-3 lg:flex">
            <div className="relative" ref={loginRef}>
              <button
                onClick={() => setLoginOpen(!loginOpen)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
              >
                Login
              </button>
              <AnimatePresence>
                {loginOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg z-50"
                  >
                    <button
                      onClick={() => {
                        setLoginOpen(false);
                        navigate("/user/login");
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-700"
                    >
                      <User size={16} />
                      User Login
                    </button>
                    <button
                      onClick={() => {
                        setLoginOpen(false);
                        navigate("/technician/login");
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-700"
                    >
                      <Wrench size={16} />
                      Technician Login
                    </button>
                    <button
                      onClick={() => {
                        setLoginOpen(false);
                        navigate("/admin/login");
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-700"
                    >
                      <Shield size={16} />
                      Admin Login
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={() => navigate("/user/register")}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Live Notification Ticker */}
        <div className="hidden lg:block border-t border-slate-200/60 bg-gradient-to-r from-blue-50 via-white to-blue-50">
          <div className="flex items-center overflow-hidden py-2">
            <div className="flex items-center gap-2 px-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>
              <span className="text-xs font-bold text-red-700">LIVE</span>
            </div>
            <div className="h-4 w-px bg-slate-200 mx-2" />
            <div className="flex-1 overflow-hidden">
              <div className="flex animate-ticker whitespace-nowrap">
                {[...tickerItems, ...tickerItems].map((item, index) => (
                  <span
                    key={index}
                    className="mx-6 flex items-center gap-2 text-xs font-semibold text-slate-700"
                  >
                    <item.Icon size={14} className={item.color} />
                    {item.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden lg:hidden"
            >
              <div className="space-y-2 pb-4">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/user/login");
                    }}
                    className="w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
                  >
                    User Login
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/technician/login");
                    }}
                    className="w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
                  >
                    Technician Login
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/admin/login");
                    }}
                    className="w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
                  >
                    Admin Login
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/user/register");
                    }}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 text-sm font-semibold text-white"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
