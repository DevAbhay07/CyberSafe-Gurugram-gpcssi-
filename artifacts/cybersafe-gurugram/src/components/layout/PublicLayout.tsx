import { Link, useLocation } from "wouter";
import { Shield, Menu, X, LogIn, LogOut, Phone, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/map", label: "Scam Map" },
  { href: "/awareness", label: "Awareness" },
  { href: "/how-to-report", label: "How to Report" },
  { href: "/track", label: "Track Complaint" },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8fafc" }}>
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-blue-700 font-bold">
              <div className="bg-blue-700 p-1.5 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-base font-bold text-blue-900">CyberSafe Gurugram</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location === link.href
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/report"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  location === "/report"
                    ? "bg-red-50 text-red-700"
                    : "text-red-600 hover:text-red-700 hover:bg-red-50"
                }`}
                data-testid="nav-report"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                Report Crime
              </Link>
            </nav>

            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  {user?.role === "admin" && (
                    <Link href="/admin">
                      <Button variant="outline" size="sm" className="text-blue-700 border-blue-200 hover:bg-blue-50">
                        Admin Console
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    data-testid="button-logout"
                    className="text-slate-600 hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-1.5" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white" data-testid="link-login">
                    <LogIn className="h-4 w-4 mr-1.5" />
                    Login
                  </Button>
                </Link>
              )}
            </div>

            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/report"
              className="block px-3 py-2 rounded-md text-sm text-red-600 font-medium hover:bg-red-50"
              onClick={() => setMobileOpen(false)}
            >
              Report Crime
            </Link>
            <Link
              href="/track"
              className="block px-3 py-2 rounded-md text-sm text-blue-600 font-medium hover:bg-blue-50"
              onClick={() => setMobileOpen(false)}
            >
              Track Complaint
            </Link>
            {isAuthenticated ? (
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-sm font-medium text-blue-700 bg-blue-50"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-slate-900 text-slate-400 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-white font-semibold text-sm">CyberSafe Gurugram</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
            <a
              href="tel:1930"
              className="flex items-center gap-1.5 text-green-400 hover:text-green-300 font-medium"
              data-testid="link-helpline"
            >
              <Phone className="h-4 w-4" />
              1930 Cybercrime Helpline
            </a>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
              data-testid="link-ncpp"
            >
              cybercrime.gov.in
            </a>
            <Link href="/track" className="text-blue-400 hover:text-blue-300">
              Track Complaint
            </Link>
            <Link href="/report" className="text-red-400 hover:text-red-300" data-testid="footer-report-link">
              Report a Crime
            </Link>
          </div>
          <p className="text-xs text-slate-600">© 2024 Gurugram Cyber Police. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
