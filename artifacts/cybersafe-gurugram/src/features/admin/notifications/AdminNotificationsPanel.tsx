import { X, AlertTriangle, TrendingUp, FileText, MapPin, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

type AlertSeverity = "high" | "medium" | "info";
type AlertStatus = "unread" | "read";

interface Alert {
  id: number;
  type: AlertSeverity;
  title: string;
  body: string;
  time: string;
  area?: string;
  status: AlertStatus;
}

const INITIAL_ALERTS: Alert[] = [
  { id: 1, type: "high", title: "Surge detected — Cyber City", body: "22 new UPI Fraud complaints in the last 6 hours. Risk score elevated to 94. Immediate action recommended.", time: "2 hours ago", area: "Cyber City", status: "unread" },
  { id: 2, type: "high", title: "Sextortion cluster — Palam Vihar", body: "7 sextortion complaints filed today from Palam Vihar, all targeting males aged 18-30 via WhatsApp video calls.", time: "4 hours ago", area: "Palam Vihar", status: "unread" },
  { id: 3, type: "medium", title: "Investment scam spike — Golf Course Road", body: "Investment scam complaints up 45% this week. Common MO: fake trading app 'TradeMax Pro' with fabricated profit screenshots.", time: "6 hours ago", area: "Golf Course Road", status: "unread" },
  { id: 4, type: "medium", title: "New scam variant identified", body: "Electricity bill scam now using WhatsApp voice calls instead of SMS links. 12 new complaints in 48 hours.", time: "Yesterday", area: undefined, status: "read" },
  { id: 5, type: "info", title: "Monthly report ready", body: "November 2024 cybercrime analytics report has been compiled and is ready for review.", time: "Yesterday", area: undefined, status: "read" },
  { id: 6, type: "info", title: "System: New complaint batch imported", body: "85 complaints imported from Cyber Crime Portal batch upload. All assigned to respective police stations.", time: "2 days ago", area: undefined, status: "read" },
  { id: 7, type: "medium", title: "Task fraud via new Telegram group", body: "Group 'GuruTask Pro' identified as fraudulent — 28 victims so far. Group link preserved as evidence.", time: "2 days ago", area: "Sohna Road", status: "read" },
];

function severityStyle(type: AlertSeverity) {
  if (type === "high") return { border: "border-l-red-500", bg: "hover:bg-red-950/10", icon: AlertTriangle, iconColor: "text-red-400", badge: "bg-red-900/40 text-red-400 border-red-800" };
  if (type === "medium") return { border: "border-l-amber-500", bg: "hover:bg-amber-950/10", icon: TrendingUp, iconColor: "text-amber-400", badge: "bg-amber-900/40 text-amber-400 border-amber-800" };
  return { border: "border-l-blue-500", bg: "hover:bg-blue-950/10", icon: FileText, iconColor: "text-blue-400", badge: "bg-blue-900/40 text-blue-400 border-blue-800" };
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AdminNotificationsPanel({ open, onClose }: Props) {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = alerts.filter((a) => a.status === "unread").length;

  const markAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, status: "read" as AlertStatus })));
  };

  const markRead = (id: number) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: "read" as AlertStatus } : a));
  };

  const dismiss = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const displayed = filter === "unread" ? alerts.filter((a) => a.status === "unread") : alerts;

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed right-4 top-16 w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 flex flex-col max-h-[calc(100vh-80px)] overflow-hidden" data-testid="notifications-panel">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <p className="text-white font-semibold text-sm">Alerts</p>
            {unreadCount > 0 && (
              <Badge className="bg-red-600 text-white border-0 text-xs px-1.5 py-0">{unreadCount}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-blue-400 hover:text-blue-300 text-xs" data-testid="button-mark-all-read">
                Mark all read
              </button>
            )}
            <button onClick={onClose} className="text-slate-500 hover:text-white p-1 rounded hover:bg-slate-700" data-testid="button-close-notifications">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex border-b border-slate-700">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 text-xs font-medium transition-colors capitalize ${filter === f ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-500 hover:text-slate-300"}`}
              data-testid={`filter-${f}`}
            >
              {f === "unread" ? `Unread (${unreadCount})` : "All Alerts"}
            </button>
          ))}
        </div>

        {/* Alert list */}
        <div className="flex-1 overflow-y-auto">
          {displayed.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">All caught up</p>
            </div>
          ) : (
            displayed.map((alert) => {
              const style = severityStyle(alert.type);
              const Icon = style.icon;
              return (
                <div
                  key={alert.id}
                  onClick={() => markRead(alert.id)}
                  data-testid={`alert-${alert.id}`}
                  className={`border-l-2 ${style.border} ${style.bg} px-4 py-3 border-b border-slate-800 cursor-pointer transition-colors relative ${alert.status === "unread" ? "bg-slate-800/30" : ""}`}
                >
                  {alert.status === "unread" && (
                    <div className="absolute top-3 right-8 h-2 w-2 bg-blue-400 rounded-full" />
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); dismiss(alert.id); }}
                    className="absolute top-3 right-3 text-slate-600 hover:text-slate-400"
                    data-testid={`dismiss-alert-${alert.id}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="flex items-start gap-2 pr-5">
                    <Icon className={`h-4 w-4 ${style.iconColor} flex-shrink-0 mt-0.5`} />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-slate-200 text-xs font-semibold">{alert.title}</p>
                        <Badge className={`${style.badge} border text-xs px-1.5 py-0 capitalize`}>{alert.type}</Badge>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed">{alert.body}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-slate-600 text-xs">
                          <Clock className="h-3 w-3" />
                          {alert.time}
                        </span>
                        {alert.area && (
                          <span className="flex items-center gap-1 text-slate-600 text-xs">
                            <MapPin className="h-3 w-3" />
                            {alert.area}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
