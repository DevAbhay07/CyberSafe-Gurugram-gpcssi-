/**
 * src/components/map/MapFallback.tsx
 *
 * SVG pseudo-map fallback rendered when WebGL / MapLibre GL is unavailable.
 * Shared between PublicMapPage and AdminMapPage via the <CyberMap> component.
 */

import type { Area } from "@/lib/mockData";

interface MapFallbackProps {
  areas: Area[];
  selectedAreaId: number | null;
  onAreaClick: (id: number) => void;
}

function riskColor(level: string): string {
  if (level === "High") return "#ef4444";
  if (level === "Medium") return "#f59e0b";
  return "#22c55e";
}

/** Geographic bounding box for Gurugram used to project lat/lng → relative % */
const BOUNDS = { minLat: 28.34, maxLat: 28.52, minLng: 76.88, maxLng: 77.12 };

export default function MapFallback({
  areas,
  selectedAreaId,
  onAreaClick,
}: MapFallbackProps) {
  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden rounded-lg">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950" />

      {/* Grid overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="fallback-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#fallback-grid)" />
      </svg>

      {/* Label */}
      <div className="absolute top-3 left-4 text-slate-600 text-xs font-medium tracking-widest uppercase">
        Gurugram, Haryana
      </div>
      <div className="absolute bottom-3 right-3 text-slate-700 text-xs">
        28.45°N 77.03°E
      </div>

      {/* Area markers */}
      <div className="absolute inset-0">
        {areas.map((area) => {
          const relLat =
            ((area.center.lat - BOUNDS.minLat) /
              (BOUNDS.maxLat - BOUNDS.minLat)) *
            100;
          const relLng =
            ((area.center.lng - BOUNDS.minLng) /
              (BOUNDS.maxLng - BOUNDS.minLng)) *
            100;
          const size = 14 + (area.complaintCount / 350) * 26;
          const isSelected = selectedAreaId === area.id;
          const color = riskColor(area.riskLevel);

          return (
            <button
              key={area.id}
              data-testid={`map-marker-${area.id}`}
              onClick={() => onAreaClick(area.id)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 focus:outline-none group z-10"
              style={{ left: `${relLng}%`, top: `${100 - relLat}%` }}
            >
              {/* Pulse ring for high-risk areas */}
              {area.riskLevel === "High" && (
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-30"
                  style={{ backgroundColor: color }}
                />
              )}
              <div
                className={`rounded-full border-2 transition-all relative ${
                  isSelected ? "scale-150 z-20" : "hover:scale-125"
                }`}
                style={{
                  width: size,
                  height: size,
                  backgroundColor: `${color}bb`,
                  borderColor: color,
                  boxShadow: `0 0 ${isSelected ? 20 : 10}px ${color}80`,
                }}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap pointer-events-none z-30 shadow-lg">
                <p className="font-semibold">{area.name}</p>
                <p className="text-slate-400">{area.complaintCount} complaints</p>
                <p className="text-slate-400">{area.riskLevel} Risk</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {areas.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-slate-500 text-sm">No areas match the current filters</p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-900/95 border border-slate-700 rounded-lg p-3 text-xs">
        <p className="text-slate-400 font-medium mb-2">Risk Level</p>
        {(
          [
            ["High", "#ef4444"],
            ["Medium", "#f59e0b"],
            ["Low", "#22c55e"],
          ] as [string, string][]
        ).map(([label, color]) => (
          <div key={label} className="flex items-center gap-2 mb-1">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-slate-300">{label}</span>
          </div>
        ))}
        <p className="text-slate-600 border-t border-slate-700 pt-1.5 mt-1.5">
          Size = complaint count
        </p>
      </div>
    </div>
  );
}
