import { Link, useLocation, Redirect } from "wouter";
import {
  LayoutDashboard, Map, BarChart3, FileText, Settings, Users,
  Shield, LogOut, ChevronRight, Bell
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminNotificationsPanel from "@/features/admin/notifications/AdminNotificationsPanel";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/map", label: "Map Intelligence", icon: Map },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/complaints", label: "Complaints", icon: FileText },
  { href: "/admin/config", label: "Configuration", icon: Settings },
  { href: "/admin/users", label: "Users", icon: Users },
];

const pageTitles: Record<string, string> = {
  "/admin": "Overview",
  "/admin/map": "Map Intelligence",
  "/admin/analytics": "Analytics",
  "/admin/complaints": "Complaints",
  "/admin/config": "Configuration",
  "/admin/users": "User Management",
};

const UNREAD_COUNT = 3;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [location] = useLocation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  if (!isAuthenticated) return <Redirect to="/login" />;
  if (!isAdmin) return <Redirect to="/" />;

  const pageTitle = pageTitles[location] || "Admin";

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="h-16 flex items-center gap-2.5 px-4 border-b border-slate-800">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">CyberSafe</p>
            <p className="text-blue-400 text-xs">Gurugram Police</p>
          </div>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.exact
              ? location === item.href
              : location.startsWith(item.href);
            const isOverview = item.exact && location === "/admin";

            return (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  (active || isOverview)
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
                {(active || isOverview) && <ChevronRight className="h-3 w-3 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center gap-2 px-2 py-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.email?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{user?.email}</p>
              <Badge className="bg-blue-900 text-blue-300 text-xs px-1.5 py-0 mt-0.5">Admin</Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            data-testid="button-admin-logout"
            className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-900/20 text-sm"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 relative">
          <h1 className="text-white font-semibold text-lg">{pageTitle}</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNotificationsOpen((o) => !o)}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 relative transition-colors"
              data-testid="button-notifications"
            >
              <Bell className="h-5 w-5" />
              {UNREAD_COUNT > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                  {UNREAD_COUNT}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <span className="text-slate-500">|</span>
              <span className="font-medium text-blue-400">Admin Console</span>
            </div>
          </div>

          <AdminNotificationsPanel
            open={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
          />
        </header>

        <main className="flex-1 overflow-auto bg-slate-950 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
