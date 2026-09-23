import { MessageSquare } from "lucide-react";

export default function MessagesView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
        <p className="mt-1 text-slate-600">Communicate with your assigned technician and support team.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 text-slate-500">
          <MessageSquare size={20} />
          <p>No messages yet.</p>
        </div>
      </div>
    </div>
  );
}
