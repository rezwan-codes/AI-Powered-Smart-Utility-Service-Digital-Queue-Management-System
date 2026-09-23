import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ClipboardList,
  HelpCircle,
  Home,
  LogOut,
  Mail,
  Map,
  MessageSquare,
  Settings,
  Ticket,
  User,
  Navigation,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { label: "Dashboard", icon: Home, path: "/dashboard" },
  { label: "My Complaints", icon: ClipboardList, path: "/dashboard/complaints" },
  { label: "New Complaint", icon: Ticket, path: "/dashboard/new-complaint" },
  { label: "Live Map", icon: Navigation, path: "/dashboard/map" },
  { label: "Notifications", icon: Mail, path: "/dashboard/notifications" },
  { label: "Messages", icon: MessageSquare, path: "/dashboard/messages" },
  { label: "Profile", icon: User, path: "/dashboard/profile" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
  { label: "Help & Support", icon: HelpCircle, path: "/dashboard/help" },
];

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const sidebarContent = (
    <div className="flex h-screen w-72 flex-col justify-between overflow-hidden bg-slate-900 text-white shadow-2xl relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/slidebar.png')" }}
      />
      <div className="absolute inset-0 bg-[#061A40]/50" />

      <div className="relative flex flex-1 flex-col overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 pt-8 pb-6">
          <img
            src="/images/logo.png"
            alt="Smart Utility"
            className="h-10 w-10 rounded-xl object-cover shadow-lg shadow-blue-500/30 ring-2 ring-white"
          />
          <div>
            <p className="text-base font-bold text-white">Smart Utility</p>
            <p className="text-xs text-slate-300">Digital Queue System</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-2 flex-1 space-y-1 px-4">
          {navItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/dashboard"}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                      isActive ? "bg-white/20 text-white" : "bg-white/10 text-slate-300 group-hover:bg-white/20 group-hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <span>{label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="ml-auto h-2 w-2 rounded-full bg-white"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="relative px-6 pb-6">
        <button
          onClick={() => {
            logout();
            onClose?.();
            navigate("/");
          }}
          className="group mb-4 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white w-full"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-slate-300 group-hover:bg-white/20 group-hover:text-white">
            <LogOut size={18} />
          </div>
          Logout
        </button>

        {/* Smart City Illustration */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-center">
            <div className="flex h-16 w-full items-end justify-center gap-0.5">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 rounded-t-sm bg-white/20"
                  style={{
                    height: `${Math.max(8, Math.sin(i * 0.8) * 24 + Math.random() * 12)}px`,
                  }}
                />
              ))}
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-slate-400">Smart City Platform</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">{sidebarContent}</div>
        </>
      )}
    </>
  );
}
