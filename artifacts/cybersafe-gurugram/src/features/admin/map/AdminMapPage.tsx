import { useState } from "react";
import { Filter, MapPin, X } from "lucide-react";
import { mockAreas, type Area } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const SCAM_TYPES = ["All", "UPI Fraud", "QR Code Scam", "Task Fraud", "Sextortion", "Investment Scam", "Job Scam", "Fake KYC", "Electricity Bill Scam", "OTP Fraud"];
const DATE_RANGES = ["All Time", "Last 7 Days", "Last 30 Days", "Last Quarter", "Last Year"];
const PS_LIST = ["All", "DLF Cyber City PS", "Sohna Road PS", "MG Road PS", "South City PS", "Palam Vihar PS", "Sector 56 PS", "Badshahpur PS", "Manesar PS", "Civil Lines PS", "Sector 14 PS"];

function formatCurrency(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function riskColor(level: string) {
  if (level === "High") return "#ef4444";
  if (level === "Medium") return "#f59e0b";
  return "#22c55e";
}

function riskBadge(level: string) {
  if (level === "High") return "bg-red-900/40 text-red-400 border-red-800";
  if (level === "Medium") return "bg-amber-900/40 text-amber-400 border-amber-800";
  return "bg-green-900/40 text-green-400 border-green-800";
}

function MapVisualization({ areas, selected, onSelect, onHover }: {
  areas: Area[];
  selected: Area | null;
  onSelect: (a: Area | null) => void;
  onHover: (a: Area | null) => void;
}) {
  return (
    <div className="relative w-full h-full bg-slate-950 rounded-lg overflow-hidden">
      {/* Map background with grid */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950" />
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="admingrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#60a5fa" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#admingrid)" />
        </svg>
        {/* Gurugram label */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-slate-600 text-xs font-medium tracking-widest uppercase">
          Gurugram, Haryana
        </div>
        <div className="absolute bottom-4 right-4 text-slate-700 text-xs">
          28.45°N 77.03°E
        </div>
      </div>

      {/* Markers */}
      <div className="absolute inset-0">
        {areas.map((area) => {
          const relLat = ((area.center.lat - 28.34) / (28.52 - 28.34)) * 100;
          const relLng = ((area.center.lng - 76.88) / (77.12 - 76.88)) * 100;
          const size = 14 + (area.complaintCount / 350) * 28;
          const isSelected = selected?.id === area.id;

          return (
            <button
              key={area.id}
              data-testid={`admin-map-marker-${area.id}`}
              onClick={() => onSelect(isSelected ? null : area)}
              onMouseEnter={() => onHover(area)}
              onMouseLeave={() => onHover(null)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 focus:outline-none group z-10"
              style={{ left: `${relLng}%`, top: `${100 - relLat}%` }}
            >
              {/* Pulse ring for high risk */}
              {area.riskLevel === "High" && (
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-30"
                  style={{ backgroundColor: riskColor(area.riskLevel) }}
                />
              )}
              <div
                className={`rounded-full border-2 transition-all relative ${isSelected ? "scale-150 z-20" : "hover:scale-125"}`}
                style={{
                  width: size,
                  height: size,
                  backgroundColor: riskColor(area.riskLevel) + "bb",
                  borderColor: riskColor(area.riskLevel),
                  boxShadow: `0 0 ${isSelected ? 20 : 10}px ${riskColor(area.riskLevel)}80`,
                }}
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap pointer-events-none z-30 shadow-lg">
                <p className="font-semibold">{area.name}</p>
                <p className="text-slate-400">{area.complaintCount} complaints</p>
                <p className="text-slate-400">{area.riskLevel} Risk</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-900/95 border border-slate-700 rounded-lg p-3 text-xs">
        <p className="text-slate-400 font-medium mb-2">Risk Level</p>
        {([["High", "#ef4444"], ["Medium", "#f59e0b"], ["Low", "#22c55e"]] as [string, string][]).map(([label, color]) => (
          <div key={label} className="flex items-center gap-2 mb-1">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-slate-300">{label}</span>
          </div>
        ))}
        <p className="text-slate-600 border-t border-slate-700 pt-1.5 mt-1.5">Size = complaint count</p>
      </div>
    </div>
  );
}

export default function AdminMapPage() {
  const [scamType, setScamType] = useState("All");
  const [dateRange, setDateRange] = useState("All Time");
  const [ps, setPs] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [selected, setSelected] = useState<Area | null>(null);
  const [hovered, setHovered] = useState<Area | null>(null);

  const filtered = mockAreas.filter((a) => {
    if (ps !== "All" && a.policeStation !== ps) return false;
    if (riskFilter !== "All" && a.riskLevel !== riskFilter) return false;
    return true;
  });

  const displayArea = selected;

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Filters */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-3">
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="h-4 w-4 text-slate-500" />
            <Select value={scamType} onValueChange={setScamType}>
              <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-slate-300 h-8 text-xs" data-testid="filter-scam-type">
                <SelectValue placeholder="Scam Type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                {SCAM_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-36 bg-slate-700 border-slate-600 text-slate-300 h-8 text-xs" data-testid="filter-date-range">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                {DATE_RANGES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={ps} onValueChange={setPs}>
              <SelectTrigger className="w-44 bg-slate-700 border-slate-600 text-slate-300 h-8 text-xs" data-testid="filter-ps">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                {PS_LIST.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-28 bg-slate-700 border-slate-600 text-slate-300 h-8 text-xs" data-testid="filter-risk">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                {["All", "High", "Medium", "Low"].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
            <span className="text-slate-500 text-xs ml-2">{filtered.length} areas shown</span>
          </div>
        </CardContent>
      </Card>

      {/* Map + panel */}
      <div className="flex gap-4 flex-1 min-h-0" style={{ height: "calc(100vh - 280px)", minHeight: 400 }}>
        <div className="flex-1 rounded-xl overflow-hidden border border-slate-700">
          <MapVisualization areas={filtered} selected={selected} onSelect={setSelected} onHover={setHovered} />
        </div>

        {/* Details panel */}
        <div className="w-80 flex-shrink-0 space-y-4 overflow-y-auto">
          {displayArea ? (
            <Card className="bg-slate-800 border-slate-700" data-testid="area-details-panel">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-200 text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    Area Details
                  </CardTitle>
                  <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-300">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-white font-semibold text-base">{displayArea.name}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{displayArea.policeStation}</p>
                </div>
                <Badge className={`${riskBadge(displayArea.riskLevel)} border text-xs`}>{displayArea.riskLevel} Risk — Score: {displayArea.riskScore}/100</Badge>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-700/50 rounded-lg p-2.5">
                    <p className="text-slate-500 text-xs">Complaints</p>
                    <p className="text-white font-bold text-lg">{displayArea.complaintCount}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-2.5">
                    <p className="text-slate-500 text-xs">Total Loss</p>
                    <p className="text-red-400 font-bold">{formatCurrency(displayArea.totalLoss)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-2">Top Scam Types</p>
                  <div className="flex flex-wrap gap-1">
                    {displayArea.topScamTypes.map((t) => (
                      <Badge key={t} className="bg-slate-700 text-slate-300 border-0 text-xs">{t}</Badge>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-3">
                  <p className="text-blue-300 text-xs font-medium mb-1">Common MO</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{displayArea.moText}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700 border-dashed">
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">Click an area on the map to view details</p>
              </CardContent>
            </Card>
          )}

          {/* Area list */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-200 text-xs font-semibold uppercase tracking-wide">All Areas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filtered.sort((a, b) => b.complaintCount - a.complaintCount).map((area) => (
                <button
                  key={area.id}
                  onClick={() => setSelected(selected?.id === area.id ? null : area)}
                  data-testid={`area-list-item-${area.id}`}
                  className={`w-full flex items-center justify-between px-4 py-2.5 border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30 transition-colors text-left ${selected?.id === area.id ? "bg-blue-900/20" : ""}`}
                >
                  <div>
                    <p className="text-slate-200 text-xs font-medium">{area.name}</p>
                    <p className="text-slate-500 text-xs">{area.complaintCount} complaints</p>
                  </div>
                  <Badge className={`${riskBadge(area.riskLevel)} border text-xs`}>{area.riskLevel}</Badge>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
