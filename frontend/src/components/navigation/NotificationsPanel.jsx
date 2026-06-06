import { useMemo } from "react";
import notificationData from "../../data/notifications/NotificationData";

const toneClasses = {
  amber: "bg-amber-50 text-amber-700",
  sky: "bg-sky-50 text-sky-700",
  emerald: "bg-emerald-50 text-emerald-700",
};

function NotificationsPanel({ isOpen, onClose }) {
  const unreadCount = useMemo(
    () => notificationData.filter((item) => item.unread).length,
    []
  );

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-950/20 lg:hidden" onClick={onClose} />
      <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[min(92vw,380px)] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                Notifications
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                Inbox updates
              </h3>
            </div>
            <span className="rounded-full bg-[#0C2B4E] px-2.5 py-1 text-xs font-semibold text-white">
              {unreadCount} new
            </span>
          </div>
        </div>

        <div className="max-h-[420px] space-y-3 overflow-y-auto px-4 py-4">
          {notificationData.map((notification) => (
            <div
              key={notification.id}
              className="rounded-[24px] border border-slate-100 bg-slate-50/80 px-4 py-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                    toneClasses[notification.tone]
                  }`}
                >
                  {notification.category}
                </span>
                <span className="text-xs text-slate-400">{notification.time}</span>
              </div>
              <h4 className="mt-3 text-sm font-semibold text-slate-900">
                {notification.title}
              </h4>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {notification.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default NotificationsPanel;
