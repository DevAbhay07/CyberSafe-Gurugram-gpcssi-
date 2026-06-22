/**
 * src/features/public/PublicMapPage.tsx
 *
 * Citizen-facing scam hotspot map for Gurugram.
 * Changed: Replaced the inline SVG ScamMapFallback with the real MapLibre
 * <CyberMap> component. Added loading + error states via api.getPublicMapData().
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  MapPin,
  AlertTriangle,
  TrendingUp,
  Shield,
  ChevronRight,
  Info,
  ServerCrash,
} from "lucide-react";
import { mockStats, type Area } from "@/lib/mockData";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartSkeleton } from "@/components/ui/SkeletonCard";
import CyberMap from "@/components/map/CyberMap";
import AreaDetailModal from "./AreaDetailModal";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function riskBadge(level: string): string {
  if (level === "High") return "bg-red-100 text-red-700 border-red-200";
  if (level === "Medium") return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-green-100 text-green-700 border-green-200";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PublicMapPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [modalArea, setModalArea] = useState<Area | null>(null);

  const topScamTypes = mockStats.scamTypeCounts.slice(0, 3).map((s) => s.type);
  const selectedArea = areas.find((a) => a.id === selectedAreaId) ?? null;

  // Fetch area data on mount
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getPublicMapData()
      .then((data) => {
        if (!cancelled) {
          setAreas(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to load map data. Please refresh the page.");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-lg">
              Gurugram Scam Hotspot Map
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">
              Click a hotspot to see area details
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">
              Anonymized data for public awareness
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-4 py-4 gap-4">
        {/* Map */}
        <div className="flex-1 h-96 lg:h-auto lg:min-h-[500px] rounded-xl overflow-hidden border border-slate-700">
          {loading ? (
            <ChartSkeleton height={500} />
          ) : error ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 gap-3">
              <ServerCrash className="h-10 w-10 text-slate-600" />
              <p className="text-slate-400 text-sm">{error}</p>
            </div>
          ) : (
            <CyberMap
              areas={areas}
              selectedAreaId={selectedAreaId}
              onAreaClick={(id) => setSelectedAreaId(id === selectedAreaId ? null : id)}
              className="w-full h-full"
            />
          )}
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
                <span className="text-white font-semibold">
                  {mockStats.totalComplaints.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Reported Loss</span>
                <span className="text-red-400 font-semibold">
                  {formatCurrency(mockStats.totalLoss)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">High-Risk Areas</span>
                <span className="text-orange-400 font-semibold">
                  {mockStats.highRiskLocalities}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-700">
                <p className="text-xs text-slate-500 mb-2">Top Scam Types</p>
                <div className="flex flex-wrap gap-1.5">
                  {topScamTypes.map((t) => (
                    <Badge
                      key={t}
                      className="bg-slate-700 text-slate-300 border-0 text-xs"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected area panel */}
          {selectedArea ? (
            <Card
              className="bg-slate-800 border-slate-700"
              data-testid="area-details-panel"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    Area Details
                  </CardTitle>
                  <button
                    onClick={() => setSelectedAreaId(null)}
                    className="text-slate-500 hover:text-slate-300 text-xs"
                  >
                    ✕
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-white font-semibold">{selectedArea.name}</p>
                  <p className="text-slate-400 text-xs">
                    {selectedArea.policeStation}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`${riskBadge(selectedArea.riskLevel)} text-xs border`}
                  >
                    {selectedArea.riskLevel} Risk
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-700/50 rounded-lg p-2">
                    <p className="text-slate-400 text-xs">Complaints</p>
                    <p className="text-white font-bold">
                      {selectedArea.complaintCount}
                    </p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-2">
                    <p className="text-slate-400 text-xs">Total Loss</p>
                    <p className="text-red-400 font-bold">
                      {formatCurrency(selectedArea.totalLoss)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1.5">
                    Top Scam Types
                  </p>
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
                <button
                  onClick={() => setModalArea(selectedArea)}
                  className="w-full mt-1 py-2 text-xs text-blue-400 border border-blue-800 hover:bg-blue-900/30 rounded-lg transition-colors font-medium"
                  data-testid="button-view-area-details"
                >
                  View Full Details &amp; Safety Tips
                </button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700 border-dashed">
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">
                  Click a hotspot on the map to see area details
                </p>
              </CardContent>
            </Card>
          )}

          {/* Area quick list */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                All Areas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-48 overflow-y-auto">
                {areas.length === 0 && !loading && (
                  <p className="text-slate-500 text-xs text-center py-4">
                    No area data available
                  </p>
                )}
                {areas.map((area) => (
                  <button
                    key={area.id}
                    onClick={() =>
                      setSelectedAreaId(
                        area.id === selectedAreaId ? null : area.id
                      )
                    }
                    data-testid={`area-list-${area.id}`}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-slate-700/50 transition-colors border-b border-slate-700/50 last:border-0 ${
                      selectedAreaId === area.id ? "bg-slate-700/50" : ""
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
                      className={`${riskBadge(area.riskLevel)} text-xs border flex-shrink-0`}
                    >
                      {area.riskLevel}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Awareness links */}
          <Card className="bg-blue-900/30 border-blue-700/40">
            <CardContent className="p-4 space-y-2">
              <p className="text-blue-300 text-xs font-semibold uppercase tracking-wide">
                Stay Safe
              </p>
              <Link
                href="/awareness"
                className="flex items-center justify-between text-blue-200 hover:text-white text-sm py-1 group"
              >
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  Awareness Hub
                </span>
                <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100" />
              </Link>
              <Link
                href="/how-to-report"
                className="flex items-center justify-between text-blue-200 hover:text-white text-sm py-1 group"
              >
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  How to Report
                </span>
                <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100" />
              </Link>
              <Link
                href="/report"
                className="flex items-center justify-between text-blue-200 hover:text-white text-sm py-1 group"
              >
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-400" />
                  Report a Crime
                </span>
                <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Area detail modal */}
      <AreaDetailModal area={modalArea} onClose={() => setModalArea(null)} />
    </div>
  );
}
