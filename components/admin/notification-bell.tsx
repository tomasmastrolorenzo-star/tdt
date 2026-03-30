"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, CheckCheck } from "lucide-react";

type Notification = {
  id: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter(n => !n.is_read).length;

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    await fetch("/api/admin/notifications", { method: "PATCH" });
    setNotifications(n => n.map(x => ({ ...x, is_read: true })));
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const typeColor = (type: string) => {
    if (type === 'delivery') return 'text-orange-400';
    if (type === 'retention') return 'text-cyan-400';
    if (type === 'renewal') return 'text-red-400';
    return 'text-zinc-400';
  };

  const typeDot = (type: string) => {
    if (type === 'delivery') return 'bg-orange-500';
    if (type === 'retention') return 'bg-cyan-500';
    if (type === 'renewal') return 'bg-red-500';
    return 'bg-zinc-500';
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen(!open); if (!open) fetchNotifications(); }}
        className="relative w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 flex items-center justify-center transition-colors"
      >
        <Bell className="w-4 h-4 text-zinc-400" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-black text-white animate-pulse">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-[360px] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-zinc-900">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white">System Alerts</h3>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button onClick={markAllRead} className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white flex items-center gap-1 transition-colors">
                  <CheckCheck className="w-3 h-3" /> Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-zinc-600 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
            {loading && notifications.length === 0 && (
              <div className="p-8 text-center text-zinc-600 text-[10px] font-black uppercase tracking-widest">Loading...</div>
            )}
            {!loading && notifications.length === 0 && (
              <div className="p-8 text-center text-zinc-600 text-[10px] font-black uppercase tracking-widest">No notifications yet.</div>
            )}
            {notifications.map(n => (
              <div key={n.id} className={`flex items-start gap-3 p-4 border-b border-zinc-900/50 transition-colors ${!n.is_read ? 'bg-zinc-900/30' : ''}`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${typeDot(n.type)} ${!n.is_read ? 'animate-pulse' : 'opacity-30'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold leading-snug ${!n.is_read ? 'text-white' : 'text-zinc-500'}`}>{n.message}</p>
                  <span className={`text-[9px] uppercase font-black tracking-widest mt-1 block ${typeColor(n.type)}`}>{n.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
