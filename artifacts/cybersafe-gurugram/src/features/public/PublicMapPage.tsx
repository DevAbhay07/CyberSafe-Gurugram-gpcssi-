import { useState, useEffect } from "react";
import { Link } from "wouter";
import { MapPin, AlertTriangle, TrendingUp, Shield, ChevronRight, Info } from "lucide-react";
import { mockAreas, mockStats, type Area } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GURUGRAM_CENTER = { lat: 28.4595, lng: 77.0266 };

function formatCurrency(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function riskColor(level: string) {
  if (level === "High") return "#dc2626";
  if (level === "Medium") return "#d97706";
  return "#16a34a";
}

function riskBadge(level: string) {
  if (level === "High") return "bg-red-100 text-red-700 border-red-200";
  if (level === "Medium") return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-green-100 text-green-700 border-green-200";
}

function ScamMapFallback({ areas, selected, onSelect }: { areas: Area[]; selected: Area | null; onSelect: (a: Area) => void }) {
  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden rounded-lg">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 opacity-90" />
        <div className="absolute top-4 left-4 text-slate-500 text-xs">
          Map view — Gurugram, Haryana (28.45°N 77.03°E)
        </div>
        {/* Grid lines for map effect */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Scatter areas on pseudo-map */}
      <div className="absolute inset-0">
        {areas.map((area) => {
          const relLat = ((area.center.lat - 28.35) / (28.52 - 28.35)) * 100;
          const relLng = ((area.center.lng - 76.90) / (77.15 - 76.90)) * 100;
          const size = 12 + (area.complaintCount / 350) * 24;
          const isSelected = selected?.id === area.id;

          return (
            <button
              key={area.id}
              data-testid={`map-marker-${area.id}`}
              onClick={() => onSelect(area)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 focus:outline-none group"
              style={{ left: `${relLng}%`, top: `${100 - relLat}%` }}
            >
              <div
                className={`rounded-full border-2 transition-all cursor-pointer ${isSelected ? "scale-150 z-10" : "hover:scale-125"}`}
                style={{
                  width: size,
                  height: size,
                  backgroundColor: riskColor(area.riskLevel) + "aa",
                  borderColor: riskColor(area.riskLevel),
                  boxShadow: `0 0 ${isSelected ? 16 : 8}px ${riskColor(area.riskLevel)}80`,
                }}
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none z-20">
                {area.name} ({area.complaintCount})
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-800/90 rounded-lg p-3 text-xs text-white space-y-1.5">
        <p className="font-medium text-slate-300 mb-2">Risk Level</p>
        {([["High", "#dc2626"], ["Medium", "#d97706"], ["Low", "#16a34a"]] as [string, string][]).map(([label, color]) => (
          <div key={label} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-slate-300">{label}</span>
          </div>
        ))}
        <p className="text-slate-500 text-xs mt-2 border-t border-slate-700 pt-2">Size = complaint count</p>
      </div>
    </div>
  );
}

export default function PublicMapPage() {
  const [selected, setSelected] = useState<Area | null>(null);
  const topScamTypes = mockStats.scamTypeCounts.slice(0, 3).map((s) => s.type);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-lg">Gurugram Scam Hotspot Map</h1>
            <p className="text-slate-400 text-xs mt-0.5">Click a hotspot to see area details</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">Anonymized data for public awareness</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-4 py-4 gap-4">
        {/* Map */}
        <div className="flex-1 h-96 lg:h-auto lg:min-h-[500px] rounded-xl overflow-hidden border border-slate-700">
          <ScamMapFallback areas={mockAreas} selected={selected} onSelect={setSelected} />
        </div>

        {/* Side Panel */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          {/* City overview */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400" />
                City Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Complaints</span>
                <span className="text-white font-semibold">{mockStats.totalComplaints.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Reported Loss</span>
                <span className="text-red-400 font-semibold">{formatCurrency(mockStats.totalLoss)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">High-Risk Areas</span>
                <span className="text-orange-400 font-semibold">{mockStats.highRiskLocalities}</span>
              </div>
              <div className="pt-2 border-t border-slate-700">
                <p className="text-xs text-slate-500 mb-2">Top Scam Types</p>
                <div className="flex flex-wrap gap-1.5">
                  {topScamTypes.map((t) => (
                    <Badge key={t} className="bg-slate-700 text-slate-300 border-0 text-xs">{t}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected area */}
          {selected ? (
            <Card className="bg-slate-800 border-slate-700" data-testid="area-details-panel">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    Area Details
                  </CardTitle>
                  <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-300 text-xs">✕</button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-white font-semibold">{selected.name}</p>
                  <p className="text-slate-400 text-xs">{selected.policeStation}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${riskBadge(selected.riskLevel)} text-xs`}>{selected.riskLevel} Risk</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-700/50 rounded-lg p-2">
                    <p className="text-slate-400 text-xs">Complaints</p>
                    <p className="text-white font-bold">{selected.complaintCount}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-2">
                    <p className="text-slate-400 text-xs">Total Loss</p>
                    <p className="text-red-400 font-bold">{formatCurrency(selected.totalLoss)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1.5">Top Scam Types</p>
                  <div className="flex flex-wrap gap-1">
                    {selected.topScamTypes.map((t) => (
                      <Badge key={t} className="bg-slate-700 text-slate-300 border-0 text-xs">{t}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700 border-dashed">
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">Click a hotspot on the map to see area details</p>
              </CardContent>
            </Card>
          )}

          {/* Awareness links */}
          <Card className="bg-blue-900/30 border-blue-700/40">
            <CardContent className="p-4 space-y-2">
              <p className="text-blue-300 text-xs font-semibold uppercase tracking-wide">Stay Safe</p>
              <Link href="/awareness" className="flex items-center justify-between text-blue-200 hover:text-white text-sm py-1 group">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  Awareness Hub
                </span>
                <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100" />
              </Link>
              <Link href="/how-to-report" className="flex items-center justify-between text-blue-200 hover:text-white text-sm py-1 group">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  How to Report
                </span>
                <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
