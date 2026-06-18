import { useState, useEffect } from "react";
import { TrendingUp, AlertTriangle, MapPin, FileText, ArrowUpRight } from "lucide-react";
import { mockStats, mockComplaints, mockAreas } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function formatCurrency(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function riskBadge(level: string) {
  if (level === "High") return "bg-red-900/40 text-red-400 border-red-800";
  if (level === "Medium") return "bg-amber-900/40 text-amber-400 border-amber-800";
  return "bg-green-900/40 text-green-400 border-green-800";
}

const statCards = [
  { label: "Total Complaints", value: mockStats.totalComplaints.toLocaleString("en-IN"), icon: FileText, color: "text-blue-400", bg: "bg-blue-900/30", border: "border-blue-800/50", change: "+18% vs last month" },
  { label: "Total Reported Loss", value: formatCurrency(mockStats.totalLoss), icon: TrendingUp, color: "text-red-400", bg: "bg-red-900/30", border: "border-red-800/50", change: "+23% vs last month" },
  { label: "Avg Loss / Complaint", value: formatCurrency(mockStats.avgLoss), icon: ArrowUpRight, color: "text-amber-400", bg: "bg-amber-900/30", border: "border-amber-800/50", change: "+5% vs last month" },
  { label: "High-Risk Localities", value: String(mockStats.highRiskLocalities), icon: MapPin, color: "text-orange-400", bg: "bg-orange-900/30", border: "border-orange-800/50", change: "Stable" },
];

const recent = mockComplaints.slice(0, 10);

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className={`bg-slate-800 border ${s.border} shadow-sm`} data-testid={`stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className={`h-9 w-9 ${s.bg} rounded-lg flex items-center justify-center`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
              <p className="text-white text-2xl font-bold mt-3">{s.value}</p>
              <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
              <p className="text-slate-600 text-xs mt-2">{s.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 7-day trend chart */}
        <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-200 text-sm font-semibold">Last 7 Days — Complaint Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mockStats.last7Days} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0" }} cursor={{ fill: "#334155" }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Complaints" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* High risk areas */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-200 text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              High-Risk Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockAreas
                .filter((a) => a.riskLevel === "High")
                .map((area) => (
                  <div key={area.id} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                    <div>
                      <p className="text-slate-200 text-sm font-medium">{area.name}</p>
                      <p className="text-slate-500 text-xs">{area.complaintCount} complaints</p>
                    </div>
                    <Badge className={`${riskBadge(area.riskLevel)} text-xs border`}>{area.riskLevel}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-slate-200 text-sm font-semibold">Recent Complaints</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="recent-complaints-table">
              <thead>
                <tr className="border-b border-slate-700">
                  {["ID", "Date", "Locality", "Scam Type", "Amount", "Risk"].map((h) => (
                    <th key={h} className="text-left text-xs text-slate-500 font-medium px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((c) => (
                  <tr key={c.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors" data-testid={`complaint-row-${c.id}`}>
                    <td className="px-4 py-2.5 text-slate-400 font-mono text-xs">{c.id}</td>
                    <td className="px-4 py-2.5 text-slate-300 text-xs">{c.date}</td>
                    <td className="px-4 py-2.5 text-slate-300 text-xs">{c.locality}</td>
                    <td className="px-4 py-2.5 text-slate-300 text-xs">{c.scamType}</td>
                    <td className="px-4 py-2.5 text-slate-300 text-xs font-medium">{formatCurrency(c.amount)}</td>
                    <td className="px-4 py-2.5">
                      <Badge className={`${riskBadge(c.riskLevel)} text-xs border`}>{c.riskLevel}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
