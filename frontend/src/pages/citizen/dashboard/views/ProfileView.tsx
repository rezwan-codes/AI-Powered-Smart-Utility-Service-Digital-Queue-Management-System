import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Headphones,
  KeyRound,
  LockKeyhole,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  ShieldCheck,
  Ticket,
  User,
  X,
} from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { authService } from "../../../../services/authService";
import type { Complaint, User as AppUser } from "../../../../types/utility";
import { priorityStyles, statusStyles, utilityStyles } from "../../../../utils/utilityDisplay";

type OutletContext = {
  complaints: Complaint[];
  user: AppUser | null;
  completedCount: number;
  averageWaiting: number | null;
  refresh?: () => void;
};

type EditForm = {
  name: string;
  email: string;
  phone: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const defaultUser: AppUser = {
  id: "local-user",
  name: "Md Rezwan",
  email: "rezwanmolla222@gmail.com",
  phone: "01761112352",
  role: "Citizen",
};

function formatDate(value?: string) {
  if (!value) return "Unknown";
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function firstName(value: string) {
  return value.trim().split(/\s+/)[0] || value;
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-950">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function ProfileView() {
  const navigate = useNavigate();
  const ctx = useOutletContext<OutletContext>();
  const { updateUser } = useAuth();
  const user = ctx?.user ?? defaultUser;
  const complaints = ctx?.complaints ?? [];

  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
  });
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");

  const activeCount = complaints.filter((item) => item.status !== "Completed").length;
  const completedCount = ctx?.completedCount ?? complaints.filter((item) => item.status === "Completed").length;
  const averageWaiting = ctx?.averageWaiting ?? null;
  const recentComplaints = useMemo(
    () =>
      [...complaints]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [complaints],
  );

  const statCards = [
    {
      label: "Active Complaints",
      value: activeCount,
      icon: ClipboardList,
      bg: "bg-blue-50",
      color: "text-blue-700",
    },
    {
      label: "Completed Complaints",
      value: completedCount,
      icon: CheckCircle2,
      bg: "bg-emerald-50",
      color: "text-emerald-700",
    },
    {
      label: "Avg. Resolution Time",
      value: averageWaiting ? `${averageWaiting} min` : "N/A",
      icon: Clock3,
      bg: "bg-orange-50",
      color: "text-orange-700",
    },
    {
      label: "Tokens Generated",
      value: complaints.length,
      icon: Ticket,
      bg: "bg-violet-50",
      color: "text-violet-700",
    },
  ];

  const resetFeedback = () => {
    setFormError("");
    setFormMessage("");
  };

  const openEdit = () => {
    resetFeedback();
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
    });
    setEditOpen(true);
  };

  const openPassword = () => {
    resetFeedback();
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordOpen(true);
  };

  const submitEdit = async (event: FormEvent) => {
    event.preventDefault();
    resetFeedback();
    setIsSaving(true);
    try {
      const { user: updatedUser } = await authService.updateProfile(editForm);
      updateUser(updatedUser);
      ctx?.refresh?.();
      setFormMessage("Profile updated successfully.");
      window.setTimeout(() => setEditOpen(false), 650);
    } catch (error: any) {
      setFormError(error?.response?.data?.message ?? "Could not update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const submitPassword = async (event: FormEvent) => {
    event.preventDefault();
    resetFeedback();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setFormError("New password and confirm password do not match.");
      return;
    }

    setIsSaving(true);
    try {
      await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setFormMessage("Password changed successfully.");
      window.setTimeout(() => setPasswordOpen(false), 650);
    } catch (error: any) {
      setFormError(error?.response?.data?.message ?? "Could not change password.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">My Profile</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your personal information and view your activity.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={openEdit}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm transition hover:bg-blue-50"
          >
            <Pencil size={16} />
            Edit Profile
          </button>
          <button
            type="button"
            onClick={openPassword}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800"
          >
            <LockKeyhole size={16} />
            Change Password
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[245px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="relative mx-auto h-28 w-28">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-100 text-4xl font-bold text-slate-700 ring-8 ring-slate-50">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="absolute bottom-3 right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
          </div>
          <h2 className="mt-4 text-xl font-extrabold text-slate-950">{user.name}</h2>
          <span className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            {user.role}
          </span>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Active
          </div>

          <div className="mt-8 space-y-5 text-left text-sm text-slate-700">
            <div className="flex items-center gap-3">
              <Mail size={17} className="text-slate-600" />
              <span className="min-w-0 truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={17} className="text-slate-600" />
              <span>{user.phone || "Not added"}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={17} className="text-slate-600" />
              <span>Dhaka, Bangladesh</span>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays size={17} className="text-slate-600" />
              <span>Member of Smart Utility</span>
            </div>
          </div>
        </aside>

        <section className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map(({ label, value, icon: Icon, bg, color }) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}>
                  <Icon size={21} className={color} />
                </div>
                <p className="text-sm font-semibold text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-950">{value}</p>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/complaints")}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition hover:text-blue-900"
                >
                  View details
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="grid gap-5 2xl:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-extrabold text-slate-950">Personal Information</h3>
              <div className="mt-4 divide-y divide-slate-100">
                {[
                  { label: "Full Name", value: user.name, icon: User, color: "text-blue-700", bg: "bg-blue-50" },
                  { label: "Email Address", value: user.email, icon: Mail, color: "text-blue-700", bg: "bg-blue-50" },
                  { label: "Phone Number", value: user.phone || "Not added", icon: Phone, color: "text-emerald-700", bg: "bg-emerald-50" },
                  { label: "Address", value: "Dhaka, Bangladesh", icon: MapPin, color: "text-indigo-700", bg: "bg-indigo-50" },
                  { label: "Account Type", value: user.role, icon: ShieldCheck, color: "text-rose-700", bg: "bg-rose-50" },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                  <div key={label} className="grid grid-cols-[1fr_1.2fr] items-center gap-3 py-3 text-sm">
                    <div className="flex items-center gap-3 text-slate-600">
                      <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${bg}`}>
                        <Icon size={15} className={color} />
                      </span>
                      {label}
                    </div>
                    <p className="min-w-0 truncate font-semibold text-slate-800">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-950">Recent Complaints</h3>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/complaints")}
                  className="text-sm font-bold text-blue-700 hover:text-blue-900"
                >
                  View all
                </button>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[660px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                    <tr>
                      <th className="px-3 py-3">Token</th>
                      <th className="px-3 py-3">Category</th>
                      <th className="px-3 py-3">Location</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Priority</th>
                      <th className="px-3 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentComplaints.map((complaint) => {
                      const utility = utilityStyles[complaint.type];
                      const UtilityIcon = utility.Icon;

                      return (
                        <tr
                          key={complaint.id}
                          onClick={() => navigate(`/complaints/${complaint.id}`)}
                          className="cursor-pointer transition hover:bg-blue-50/60"
                        >
                          <td className="px-3 py-4 font-extrabold text-slate-800">{complaint.token}</td>
                          <td className="px-3 py-4">
                            <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
                              <UtilityIcon size={15} className={utility.text} />
                              {complaint.type}
                            </span>
                          </td>
                          <td className="px-3 py-4 text-slate-600">{complaint.area}</td>
                          <td className="px-3 py-4">
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[complaint.status]}`}>
                              {complaint.status}
                            </span>
                          </td>
                          <td className="px-3 py-4">
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${priorityStyles[complaint.priority]}`}>
                              {complaint.priority}
                            </span>
                          </td>
                          <td className="px-3 py-4 text-slate-500">{formatDate(complaint.createdAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {!recentComplaints.length && (
                  <div className="rounded-xl bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500">
                    No complaints yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.35fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-950">Account Settings</h3>
          <div className="mt-4 divide-y divide-slate-100">
            <div className="flex items-center justify-between gap-3 py-3 text-sm">
              <div className="flex items-center gap-3 text-slate-700">
                <KeyRound size={17} className="text-slate-600" />
                Password
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold tracking-widest text-slate-700">********</span>
                <button
                  type="button"
                  onClick={openPassword}
                  className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-50"
                >
                  Change
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 py-3 text-sm">
              <div className="flex items-center gap-3 text-slate-700">
                <ShieldCheck size={17} className="text-slate-600" />
                Email Verification
              </div>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700">
                Verified
                <Check size={14} />
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 py-3 text-sm">
              <div className="flex items-center gap-3 text-slate-700">
                <Phone size={17} className="text-slate-600" />
                Phone Number
              </div>
              <button
                type="button"
                onClick={openEdit}
                className="text-xs font-bold text-blue-700 hover:text-blue-900"
              >
                {user.phone ? "Edit" : "Add"}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-950">Quick Actions</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "New Complaint", note: "Submit a new issue", icon: Plus, path: "/dashboard/new-complaint", bg: "bg-blue-50", color: "text-blue-700" },
              { label: "My Complaints", note: "View all complaints", icon: ClipboardList, path: "/dashboard/complaints", bg: "bg-emerald-50", color: "text-emerald-700" },
              { label: "Live Map", note: "Track in real-time", icon: MapPin, path: "/dashboard/map", bg: "bg-violet-50", color: "text-violet-700" },
              { label: "Contact Support", note: "Get help 24/7", icon: Headphones, path: "/dashboard/help", bg: "bg-orange-50", color: "text-orange-700" },
            ].map(({ label, note, icon: Icon, path, bg, color }) => (
              <button
                key={label}
                type="button"
                onClick={() => navigate(path)}
                className={`${bg} rounded-2xl border border-slate-100 p-5 text-center transition hover:-translate-y-0.5 hover:shadow-md`}
              >
                <Icon size={34} className={`mx-auto ${color}`} />
                <p className={`mt-4 font-extrabold ${color}`}>{label}</p>
                <p className="mt-1 text-xs text-slate-500">{note}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {editOpen && (
        <Modal title="Edit Profile" onClose={() => setEditOpen(false)}>
          <form onSubmit={submitEdit} className="space-y-4 p-5">
            <label className="block text-sm font-bold text-slate-700">
              Full Name
              <input
                value={editForm.name}
                onChange={(event) => setEditForm((current) => ({ ...current, name: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
              />
            </label>
            <label className="block text-sm font-bold text-slate-700">
              Email Address
              <input
                type="email"
                value={editForm.email}
                onChange={(event) => setEditForm((current) => ({ ...current, email: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
              />
            </label>
            <label className="block text-sm font-bold text-slate-700">
              Phone Number
              <input
                value={editForm.phone}
                onChange={(event) => setEditForm((current) => ({ ...current, phone: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>
            {formError && <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{formError}</p>}
            {formMessage && <p className="rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{formMessage}</p>}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-xl bg-blue-700 px-4 py-3 font-bold text-white transition hover:bg-blue-800 disabled:opacity-60"
            >
              {isSaving ? "Saving..." : `Save ${firstName(editForm.name)}`}
            </button>
          </form>
        </Modal>
      )}

      {passwordOpen && (
        <Modal title="Change Password" onClose={() => setPasswordOpen(false)}>
          <form onSubmit={submitPassword} className="space-y-4 p-5">
            <label className="block text-sm font-bold text-slate-700">
              Current Password
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(event) => setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
              />
            </label>
            <label className="block text-sm font-bold text-slate-700">
              New Password
              <input
                type="password"
                minLength={6}
                value={passwordForm.newPassword}
                onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
              />
            </label>
            <label className="block text-sm font-bold text-slate-700">
              Confirm New Password
              <input
                type="password"
                minLength={6}
                value={passwordForm.confirmPassword}
                onChange={(event) => setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
              />
            </label>
            {formError && <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{formError}</p>}
            {formMessage && <p className="rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{formMessage}</p>}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-xl bg-blue-700 px-4 py-3 font-bold text-white transition hover:bg-blue-800 disabled:opacity-60"
            >
              {isSaving ? "Changing..." : "Change Password"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
