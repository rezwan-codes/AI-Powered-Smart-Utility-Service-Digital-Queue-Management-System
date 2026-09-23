import { useEffect, useState } from "react";
import { CheckCircle2, Database, WifiOff } from "lucide-react";
import { healthService } from "../services/healthService";

export default function ApiStatusBanner() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    healthService
      .check()
      .then(() => setIsConnected(true))
      .catch(() => setIsConnected(false));
  }, []);

  if (isConnected === null) {
    return null;
  }

  if (isConnected) {
    return (
      <div className="mb-5 overflow-hidden rounded-lg border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 px-5 py-4 text-sm text-emerald-900 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
            <CheckCircle2 size={20} />
          </div>
          <div className="min-w-0">
            <p className="font-bold">Connected to PostgreSQL via backend API</p>
            <p className="mt-0.5 text-xs font-medium text-emerald-800/70">All systems are running smoothly.</p>
          </div>
          <Database className="ml-auto hidden text-emerald-300 sm:block" size={36} />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-800 shadow-sm">
      <WifiOff size={18} />
      Backend API is offline. Start it with `npm run dev` in the backend folder.
    </div>
  );
}
