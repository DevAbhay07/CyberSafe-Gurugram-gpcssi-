/**
 * src/features/admin/map/AdminMapPage.tsx
 *
 * Admin-facing scam hotspot map with filters and detailed area panels.
 * Changed: Replaced the inline MapVisualization SVG with <CyberMap>.
 * Filters now use MapFilters type from src/lib/types.ts.
 */

import { useState, useEffect } from "react";
import { Filter, MapPin, X, ServerCrash } from "lucide-react";
import { type Area } from "@/lib/mockData";
import { api } from "@/lib/api";
import {
  type MapFilters,
  defaultMapFilters,
} from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartSkeleton } from "@/components/ui/SkeletonCard";
import CyberMap from "@/components/map/CyberMap";

// ─── Filter option lists ──────────────────────────────────────────────────────

const SCAM_TYPES = [
  "All",
  "UPI Fraud",
  "QR Code Scam",
  "Task Fraud",
  "Sextortion",
  "Investment Scam",
  "Job Scam",
  "Fake KYC",
  "Electricity Bill Scam",
  "OTP Fraud",
];

const DATE_RANGES: MapFilters["dateRange"][] = [
  "All Time",
  "Last 7 Days",
  "Last 30 Days",
  "Last Quarter",
  "Last Year",
];

const PS_LIST = [
  "All",
  "DLF Cyber City PS",
  "Sohna Road PS",
  "MG Road PS",
  "South City PS",
  "Palam Vihar PS",
  "Sector 56 PS",
  "Badshahpur PS",
  "Manesar PS",
  "Civil Lines PS",
  "Sector 14 PS",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function riskBadge(level: string): string {
  if (level === "High") return "bg-red-900/40 text-red-400 border-red-800";
  if (level === "Medium")
    return "bg-amber-900/40 text-amber-400 border-amber-800";
  return "bg-green-900/40 text-green-400 border-green-800";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminMapPage() {
  const [filters, setFilters] = useState<MapFilters>(defaultMapFilters);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);

  // Load areas from API
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getAdminHeatmapData()
      .then((data) => {
        if (!cancelled) {
          setAreas(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to load map data.");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Apply client-side filters
  const filtered = areas.filter((a) => {
    if (
      filters.policeStation !== "All" &&
      a.policeStation !== filters.policeStation
    )
      return false;
    if (filters.riskLevel !== "All" && a.riskLevel !== filters.riskLevel)
      return false;
    return true;
  });

  const selectedArea = filtered.find((a) => a.id === selectedAreaId) ?? null;

  const setFilter = <K extends keyof MapFilters>(
    key: K,
    value: MapFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    // Clear selection if the selected area is no longer in view
    if (key === "policeStation" || key === "riskLevel") {
      setSelectedAreaId(null);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Filters */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-3">
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="h-4 w-4 text-slate-500" />
            <Select
              value={filters.scamType}
              onValueChange={(v) =>
                setFilter("scamType", v as MapFilters["scamType"])
              }
            >
              <SelectTrigger
                className="w-40 bg-slate-700 border-slate-600 text-slate-300 h-8 text-xs"
                data-testid="filter-scam-type"
              >
                <SelectValue placeholder="Scam Type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                {SCAM_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.dateRange}
              onValueChange={(v) =>
                setFilter("dateRange", v as MapFilters["dateRange"])
              }
            >
              <SelectTrigger
                className="w-36 bg-slate-700 border-slate-600 text-slate-300 h-8 text-xs"
                data-testid="filter-date-range"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                {DATE_RANGES.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.policeStation}
              onValueChange={(v) => setFilter("policeStation", v)}
            >
              <SelectTrigger
                className="w-44 bg-slate-700 border-slate-600 text-slate-300 h-8 text-xs"
                data-testid="filter-ps"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                {PS_LIST.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.riskLevel}
              onValueChange={(v) =>
                setFilter("riskLevel", v as MapFilters["riskLevel"])
              }
            >
              <SelectTrigger
                className="w-28 bg-slate-700 border-slate-600 text-slate-300 h-8 text-xs"
                data-testid="filter-risk"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                {["All", "High", "Medium", "Low"].map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-slate-500 text-xs ml-2">
              {filtered.length} area{filtered.length !== 1 ? "s" : ""} shown
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Map + panel */}
      <div
        className="flex gap-4 flex-1 min-h-0"
        style={{ height: "calc(100vh - 280px)", minHeight: 400 }}
      >
        {/* Map */}
        <div className="flex-1 rounded-xl overflow-hidden border border-slate-700">
          {loading ? (
            <ChartSkeleton height={480} />
          ) : error ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 gap-3">
              <ServerCrash className="h-10 w-10 text-slate-600" />
              <p className="text-slate-400 text-sm">{error}</p>
            </div>
          ) : (
            <CyberMap
              areas={filtered}
              selectedAreaId={selectedAreaId}
              onAreaClick={(id) =>
                setSelectedAreaId(id === selectedAreaId ? null : id)
              }
              className="w-full h-full"
            />
          )}
        </div>

        {/* Details panel */}
        <div className="w-80 flex-shrink-0 space-y-4 overflow-y-auto">
          {selectedArea ? (
            <Card
              className="bg-slate-800 border-slate-700"
              data-testid="area-details-panel"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-200 text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    Area Details
                  </CardTitle>
                  <button
                    onClick={() => setSelectedAreaId(null)}
                    className="text-slate-500 hover:text-slate-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-white font-semibold text-base">
                    {selectedArea.name}
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {selectedArea.policeStation}
                  </p>
                </div>
                <Badge
                  className={`${riskBadge(selectedArea.riskLevel)} border text-xs`}
                >
                  {selectedArea.riskLevel} Risk — Score:{" "}
                  {selectedArea.riskScore}/100
                </Badge>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-700/50 rounded-lg p-2.5">
                    <p className="text-slate-500 text-xs">Complaints</p>
                    <p className="text-white font-bold text-lg">
                      {selectedArea.complaintCount}
                    </p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-2.5">
                    <p className="text-slate-500 text-xs">Total Loss</p>
                    <p className="text-red-400 font-bold">
                      {formatCurrency(selectedArea.totalLoss)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-2">Top Scam Types</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedArea.topScamTypes.map((t) => (
                      <Badge
                        key={t}
                        className="bg-slate-700 text-slate-300 border-0 text-xs"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-3">
                  <p className="text-blue-300 text-xs font-medium mb-1">
                    Common MO
                  </p>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {selectedArea.moText}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700 border-dashed">
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">
                  Click an area on the map to view details
                </p>
              </CardContent>
            </Card>
          )}

          {/* Area list */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-200 text-xs font-semibold uppercase tracking-wide">
                All Areas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <MapPin className="h-6 w-6 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500 text-xs">
                    No areas match current filters
                  </p>
                </div>
              ) : (
                [...filtered]
                  .sort((a, b) => b.complaintCount - a.complaintCount)
                  .map((area) => (
                    <button
                      key={area.id}
                      onClick={() =>
                        setSelectedAreaId(
                          selectedAreaId === area.id ? null : area.id
                        )
                      }
                      data-testid={`area-list-item-${area.id}`}
                      className={`w-full flex items-center justify-between px-4 py-2.5 border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30 transition-colors text-left ${
                        selectedAreaId === area.id ? "bg-blue-900/20" : ""
                      }`}
                    >
                      <div>
                        <p className="text-slate-200 text-xs font-medium">
                          {area.name}
                        </p>
                        <p className="text-slate-500 text-xs">
                          {area.complaintCount} complaints
                        </p>
                      </div>
                      <Badge
                        className={`${riskBadge(area.riskLevel)} border text-xs`}
                      >
                        {area.riskLevel}
                      </Badge>
                    </button>
                  ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
