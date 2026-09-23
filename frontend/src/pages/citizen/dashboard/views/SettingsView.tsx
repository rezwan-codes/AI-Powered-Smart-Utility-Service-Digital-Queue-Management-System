import { Settings } from "lucide-react";

export default function SettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-slate-600">Customize your dashboard experience and notification preferences.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 text-slate-500">
          <Settings size={20} />
          <p>Settings panel coming soon.</p>
        </div>
      </div>
    </div>
  );
}
