import { Bell } from "lucide-react";

export default function NotificationsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <p className="mt-1 text-slate-600">Stay updated with your complaint status and service alerts.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 text-slate-500">
          <Bell size={20} />
          <p>No new notifications.</p>
        </div>
      </div>
    </div>
  );
}
