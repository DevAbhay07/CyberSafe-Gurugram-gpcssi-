import { Link } from "wouter";
import { Shield, Map, AlertTriangle, TrendingUp, Phone, ExternalLink, ChevronRight, Eye } from "lucide-react";
import { mockStats, mockAreas } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function formatCurrency(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

const topHighRisk = mockAreas.filter((a) => a.riskLevel === "High").slice(0, 3);

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 h-64 w-64 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 h-64 w-64 bg-indigo-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <Badge className="bg-blue-800 text-blue-200 border-blue-700 text-sm px-3 py-1">
              Gurugram Cyber Police
            </Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            CyberSafe Gurugram
          </h1>
          <p className="text-lg text-blue-200 mb-3 font-medium">
            Scam Hotspot Map & Complaint Intelligence Portal
          </p>
          <p className="text-slate-300 max-w-2xl mx-auto text-base mb-8">
            Real-time visibility into cyber fraud patterns across Gurugram. Understand where scams happen, who is being targeted, and how to stay safe.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/map">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8" data-testid="button-view-map">
                <Map className="h-5 w-5 mr-2" />
                View Scam Map
              </Button>
            </Link>
            <Link href="/how-to-report">
              <Button size="lg" variant="outline" className="border-blue-400 text-blue-200 hover:bg-blue-900/40" data-testid="button-how-to-report">
                How to Report
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-100 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-slate-500 text-sm mb-6 uppercase tracking-wide font-medium">Gurugram Cybercrime — 2024 Overview</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Complaints", value: mockStats.totalComplaints.toLocaleString("en-IN"), icon: FileIcon, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Reported Loss", value: formatCurrency(mockStats.totalLoss), icon: TrendingUp, color: "text-red-600", bg: "bg-red-50" },
              { label: "Avg Loss / Case", value: formatCurrency(mockStats.avgLoss), icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "High-Risk Areas", value: String(mockStats.highRiskLocalities), icon: Map, color: "text-orange-600", bg: "bg-orange-50" },
            ].map((s) => (
              <Card key={s.label} className="border-slate-100 shadow-sm" data-testid={`stat-card-${s.label.toLowerCase().replace(/\s+/g, "-")}`}>
                <CardContent className="p-4">
                  <div className={`h-10 w-10 ${s.bg} rounded-lg flex items-center justify-center mb-3`}>
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* High Risk Areas */}
      <section className="py-12 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">High-Risk Areas in Gurugram</h2>
            <Link href="/map" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
              View all on map <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {topHighRisk.map((area) => (
              <Card key={area.id} className="border-red-100 bg-white shadow-sm" data-testid={`area-card-${area.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-slate-900">{area.name}</p>
                    <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">High Risk</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{area.policeStation}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Complaints</span>
                      <span className="font-medium text-slate-800">{area.complaintCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Total Loss</span>
                      <span className="font-medium text-red-600">{formatCurrency(area.totalLoss)}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {area.topScamTypes.slice(0, 2).map((t) => (
                      <Badge key={t} className="bg-slate-100 text-slate-600 text-xs border-0">{t}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it helps */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-8 text-center">How CyberSafe Gurugram Helps</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Map, title: "Interactive Scam Map", desc: "See where cyber fraud hotspots are in Gurugram, filterable by scam type and time period.", href: "/map" },
              { icon: Eye, title: "Awareness Hub", desc: "Learn about the latest scam types, red flags to watch for, and immediate steps to take if targeted.", href: "/awareness" },
              { icon: Phone, title: "Report a Cybercrime", desc: "Step-by-step guide to report cyber fraud via the 1930 helpline and national portal.", href: "/how-to-report" },
            ].map((item) => (
              <Link key={item.title} href={item.href} className="block group">
                <Card className="border-slate-100 hover:border-blue-200 hover:shadow-md transition-all h-full" data-testid={`feature-${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  <CardContent className="p-6">
                    <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                      <item.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="bg-green-700 text-white py-8 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-green-100 text-sm mb-1 uppercase tracking-wide font-medium">Victim of Cybercrime?</p>
          <h2 className="text-2xl font-bold mb-2">Call 1930 Immediately</h2>
          <p className="text-green-200 text-sm mb-4">
            The National Cybercrime Helpline is available 24/7. Quick reporting improves chances of fund recovery.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:1930" data-testid="link-call-1930" className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-6 py-2.5 rounded-lg hover:bg-green-50 transition-colors text-sm">
              <Phone className="h-4 w-4" />
              Call 1930
            </a>
            <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" data-testid="link-cybercrime-portal" className="inline-flex items-center gap-2 border border-green-400 text-white px-6 py-2.5 rounded-lg hover:bg-green-600 transition-colors text-sm">
              <ExternalLink className="h-4 w-4" />
              cybercrime.gov.in
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
