/**
 * src/features/admin/analytics/AdminAnalyticsPage.tsx
 *
 * Admin analytics page with monthly trends, scam type breakdowns,
 * channel distribution, and victim demographic pie charts.
 *
 * Changed: Added empty-state guards on every chart so the page degrades
 * gracefully if the API ever returns empty arrays.
 */

import { useState, useEffect } from "react";
import { BarChart2 } from "lucide-react";
import { mockStats } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartSkeleton, StatCardSkeleton } from "@/components/ui/SkeletonCard";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

const CHART_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

const tooltipStyle = {
  backgroundColor: "#1e293b",
  border: "1px solid #334155",
  borderRadius: "8px",
  color: "#e2e8f0",
  fontSize: 12,
};

// ─── Empty chart state ────────────────────────────────────────────────────────

function EmptyChart({ height = 200 }: { height?: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 text-slate-600"
      style={{ height }}
    >
      <BarChart2 className="h-8 w-8" />
      <p className="text-sm">No data available</p>
    </div>
  );
}

// ─── Static derived data ──────────────────────────────────────────────────────

const scamTypeData = mockStats.scamTypeCounts.map((s) => ({
  name: s.type,
  count: s.count,
}));
const channelData = mockStats.channelCounts.map((c) => ({
  name: c.channel,
  value: c.count,
}));
const ageData = mockStats.ageBandCounts.map((a) => ({
  name: a.band,
  value: a.count,
}));
const genderData = mockStats.genderCounts.map((g) => ({
  name: g.gender,
  value: g.count,
}));

const summaryStats = [
  {
    label: "Total Complaints",
    value: mockStats.totalComplaints.toLocaleString("en-IN"),
    sub: "All time",
  },
  {
    label: "Total Loss",
    value: formatCurrency(mockStats.totalLoss),
    sub: "Reported",
  },
  {
    label: "Avg Loss",
    value: formatCurrency(mockStats.avgLoss),
    sub: "Per complaint",
  },
  {
    label: "High-Risk Zones",
    value: String(mockStats.highRiskLocalities),
    sub: "Active areas",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-6">
      {/* Summary stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))
          : summaryStats.map((s) => (
              <Card key={s.label} className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-slate-400 text-xs mt-1">{s.label}</p>
                  <p className="text-slate-600 text-xs mt-0.5">{s.sub}</p>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Monthly trend — line chart */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-slate-200 text-sm font-semibold">
            Monthly Complaint Volume (2024)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ChartSkeleton height={220} />
          ) : mockStats.monthlyTrend.length === 0 ? (
            <EmptyChart height={220} />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={mockStats.monthlyTrend}
                margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ stroke: "#3b82f6", strokeWidth: 1 }}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                <Line
                  type="monotone"
                  dataKey="complaints"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#3b82f6" }}
                  name="Complaints"
                />
                <Line
                  type="monotone"
                  dataKey="loss"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#ef4444" }}
                  name="Loss (₹)"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Scam type + channel bar charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-200 text-sm font-semibold">
              Complaints by Scam Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <ChartSkeleton height={280} />
            ) : scamTypeData.length === 0 ? (
              <EmptyChart height={280} />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={scamTypeData}
                  layout="vertical"
                  margin={{ top: 0, right: 8, left: 80, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: "#334155" }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Complaints">
                    {scamTypeData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-200 text-sm font-semibold">
              Complaints by Channel
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <ChartSkeleton height={280} />
            ) : channelData.length === 0 ? (
              <EmptyChart height={280} />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={channelData}
                  layout="vertical"
                  margin={{ top: 0, right: 8, left: 70, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: "#334155" }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Complaints">
                    {channelData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CHART_COLORS[(i + 2) % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pie charts — age + gender */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-200 text-sm font-semibold">
              Victim Age Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <ChartSkeleton height={220} />
            ) : ageData.length === 0 ? (
              <EmptyChart height={220} />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={ageData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={3}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {ageData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-200 text-sm font-semibold">
              Victim Gender Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <ChartSkeleton height={220} />
            ) : genderData.length === 0 ? (
              <EmptyChart height={220} />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={genderData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={3}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {genderData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={["#3b82f6", "#ec4899", "#8b5cf6"][i % 3]}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
