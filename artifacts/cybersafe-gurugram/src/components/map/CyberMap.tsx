/**
 * src/components/map/CyberMap.tsx
 *
 * Reusable 3D interactive map component built on MapLibre GL JS via react-map-gl.
 *
 * Design decisions:
 * - Uses MapLibre GL (free, no paid token) with a configurable basemap style.
 *   Default: MapLibre demo tiles. Override via VITE_MAP_STYLE env variable.
 * - Areas are rendered as GeoJSON circle markers (color = risk level, radius =
 *   complaint count). This approach works with any basemap style.
 * - Map is initialised with pitch:45 + bearing:-20 for a 3D feel even without
 *   building extrusion data.
 * - Clicking a circle calls onAreaClick(areaId) so existing side panels work
 *   without any changes.
 * - If WebGL is unavailable, falls back to <MapFallback> (the SVG pseudo-map).
 */

import {
  useRef,
  useEffect,
  useCallback,
  useState,
} from "react";
import Map, {
  Source,
  Layer,
  Popup,
  NavigationControl,
  type MapRef,
  type MapLayerMouseEvent,
} from "react-map-gl/maplibre";
import type { ExpressionSpecification } from "maplibre-gl";
import type { FeatureCollection } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Area } from "@/lib/mockData";
import MapFallback from "./MapFallback";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CyberMapProps {
  areas: Area[];
  selectedAreaId: number | null;
  onAreaClick: (id: number) => void;
  /** Optional extra CSS class for the wrapper div */
  className?: string;
}

interface HoverInfo {
  longitude: number;
  latitude: number;
  area: Area;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Free MapLibre demo tiles. Swap to any MapTiler/Stadia URL via env var. */
const DEFAULT_MAP_STYLE =
  "https://demotiles.maplibre.org/style.json";

const MAP_STYLE: string =
  (import.meta.env.VITE_MAP_STYLE as string | undefined) ?? DEFAULT_MAP_STYLE;

/** Gurugram city centre */
const GURUGRAM_CENTER: [number, number] = [77.0266, 28.4595];

/** Colour stops keyed by risk level */
const RISK_COLORS: Record<string, string> = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#22c55e",
};

// ─── GeoJSON helpers ──────────────────────────────────────────────────────────

function areasToGeoJSON(areas: Area[]): FeatureCollection {
  return {
    type: "FeatureCollection",
    features: areas.map((area) => ({
      type: "Feature",
      id: area.id,
      geometry: {
        type: "Point",
        coordinates: [area.center.lng, area.center.lat],
      },
      properties: {
        id: area.id,
        name: area.name,
        policeStation: area.policeStation,
        complaintCount: area.complaintCount,
        totalLoss: area.totalLoss,
        riskLevel: area.riskLevel,
        riskScore: area.riskScore,
      },
    })),
  };
}

function areasToPolygonsGeoJSON(areas: Area[]): FeatureCollection {
  return {
    type: "FeatureCollection",
    features: areas
      .filter((area) => area.polygon)
      .map((area) => ({
        type: "Feature",
        id: area.id,
        geometry: area.polygon!,
        properties: {
          id: area.id,
          name: area.name,
          policeStation: area.policeStation,
          complaintCount: area.complaintCount,
          totalLoss: area.totalLoss,
          riskLevel: area.riskLevel,
          riskScore: area.riskScore,
        },
      })),
  };
}

/** Interpolate circle radius between 10–30px based on complaintCount (0–350). */
function buildRadiusExpression(): ExpressionSpecification {
  return [
    "interpolate",
    ["linear"],
    ["get", "complaintCount"],
    0,
    10,
    350,
    30,
  ] as ExpressionSpecification;
}

/** Map riskLevel property → fill colour using a match expression. */
function buildColorExpression(): ExpressionSpecification {
  return [
    "match",
    ["get", "riskLevel"],
    "High",
    RISK_COLORS.High,
    "Medium",
    RISK_COLORS.Medium,
    /* default (Low) */
    RISK_COLORS.Low,
  ] as ExpressionSpecification;
}

// ─── Component ────────────────────────────────────────────────────────────────

let webGLSupported: boolean | null = null;

function checkWebGL(): boolean {
  if (webGLSupported !== null) return webGLSupported;
  try {
    const canvas = document.createElement("canvas");
    const ctx =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    webGLSupported = !!ctx;
  } catch {
    webGLSupported = false;
  }
  return webGLSupported;
}

export default function CyberMap({
  areas,
  selectedAreaId,
  onAreaClick,
  className = "",
}: CyberMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Skip MapLibre entirely if WebGL is unavailable
  const webGLOk = checkWebGL();

  // ─── Fly to selected area ────────────────────────────────────────────────

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    if (selectedAreaId === null) return;
    const area = areas.find((a) => a.id === selectedAreaId);
    if (!area) return;
    mapRef.current.flyTo({
      center: [area.center.lng, area.center.lat],
      zoom: 14,
      pitch: 50,
      duration: 800,
    });
  }, [selectedAreaId, areas, mapLoaded]);

  // ─── Highlight selected feature ──────────────────────────────────────────

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current.getMap();
    // Reset all features first, then highlight selected
    areas.forEach((a) => {
      map.setFeatureState(
        { source: "areas", id: a.id },
        { selected: a.id === selectedAreaId }
      );
    });
  }, [selectedAreaId, areas, mapLoaded]);

  // ─── Event handlers ──────────────────────────────────────────────────────

  const handleClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      if (!feature) return;
      const id = feature.properties?.id as number | undefined;
      if (id !== undefined) onAreaClick(id);
    },
    [onAreaClick]
  );

  const handleMouseEnter = useCallback((e: MapLayerMouseEvent) => {
    const feature = e.features?.[0];
    if (!feature || !e.lngLat) return;
    // Properties come back from MapLibre as plain JSON
    const props = feature.properties as Record<string, unknown>;
    const area: Area = {
      id: props.id as number,
      name: props.name as string,
      policeStation: props.policeStation as string,
      complaintCount: props.complaintCount as number,
      totalLoss: props.totalLoss as number,
      riskLevel: props.riskLevel as Area["riskLevel"],
      topScamTypes: [] as Area["topScamTypes"],
      riskScore: props.riskScore as number,
      moText: "",
      center: { lat: e.lngLat.lat, lng: e.lngLat.lng },
    };

    setHoverInfo({
      longitude: e.lngLat.lng,
      latitude: e.lngLat.lat,
      area,
    });
  }, []);

  const handleMouseLeave = useCallback(() => setHoverInfo(null), []);

  // ─── Fallback ────────────────────────────────────────────────────────────

  if (!webGLOk || hasError) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        {!webGLOk && (
          <div className="absolute top-2 left-2 right-2 z-20 bg-amber-900/80 border border-amber-700 rounded-md px-3 py-1.5 text-amber-200 text-xs">
            WebGL not available — showing simplified map view.
          </div>
        )}
        <MapFallback
          areas={areas}
          selectedAreaId={selectedAreaId}
          onAreaClick={onAreaClick}
        />
      </div>
    );
  }

  // ─── GeoJSON data source ─────────────────────────────────────────────────

  const geojson = areasToGeoJSON(areas);
  const polygonsGeojson = areasToPolygonsGeoJSON(areas);

  return (
    <div
      className={`relative w-full h-full ${className}`}
      data-testid="cyber-map-container"
    >
      {/* Loading overlay — shown until MapLibre fires onLoad */}
      {!mapLoaded && (
        <div className="absolute inset-0 z-10 bg-slate-950 flex flex-col items-center justify-center gap-3 rounded-lg">
          <div className="h-8 w-8 rounded-full border-2 border-slate-700 border-t-blue-400 animate-spin" />
          <p className="text-slate-500 text-xs">Loading map…</p>
        </div>
      )}

      {/* Empty-state overlay — shown when no areas pass current filters */}
      {areas.length === 0 && mapLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="bg-slate-900/90 border border-slate-700 rounded-lg px-5 py-4 text-center shadow-lg">
            <p className="text-slate-300 text-sm font-medium">No areas match current filters</p>
            <p className="text-slate-500 text-xs mt-1">Adjust filters to see hotspots</p>
          </div>
        </div>
      )}

      <Map
        ref={mapRef}
        mapStyle={MAP_STYLE}
        initialViewState={{
          longitude: GURUGRAM_CENTER[0],
          latitude: GURUGRAM_CENTER[1],
          zoom: 11.5,
          pitch: 45,
          bearing: -20,
        }}
        style={{ width: "100%", height: "100%" }}
        interactiveLayerIds={["areas-polygons-fill", "area-circles", "area-circles-selected"]}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onLoad={() => setMapLoaded(true)}
        onError={() => setHasError(true)}
        cursor={hoverInfo ? "pointer" : "grab"}
        attributionControl={false}
      >
        <NavigationControl position="top-right" showCompass showZoom />

        {/* Polygon Zones */}
        <Source id="areas-polygons" type="geojson" data={polygonsGeojson} generateId={false}>
          <Layer
            id="areas-polygons-fill"
            type="fill"
            paint={{
              "fill-color": buildColorExpression(),
              "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                0.7,
                0.4,
              ],
              "fill-outline-color": "#111827",
            }}
          />
        </Source>

        {/* All area circles (now subtle) */}
        <Source id="areas" type="geojson" data={geojson} generateId={false}>
          {/* Main circles */}
          <Layer
            id="area-circles"
            type="circle"
            paint={{
              "circle-radius": 4,
              "circle-color": "#ffffff",
              "circle-opacity": 0.5,
              "circle-stroke-width": 1,
              "circle-stroke-color": "#000000",
              "circle-stroke-opacity": 0.5,
            }}
          />

          {/* Text label */}
          <Layer
            id="area-labels"
            type="symbol"
            minzoom={12}
            layout={{
              "text-field": ["get", "name"],
              "text-size": 11,
              "text-offset": [0, 2.2],
              "text-anchor": "top",
              "text-font": ["Open Sans Regular"],
            }}
            paint={{
              "text-color": "#e2e8f0",
              "text-halo-color": "#0f172a",
              "text-halo-width": 1.5,
            }}
          />
        </Source>

        {/* Hover popup */}
        {hoverInfo && (
          <Popup
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            closeButton={false}
            closeOnClick={false}
            anchor="bottom"
            offset={[0, -20] as [number, number]}
            className="cyber-map-popup"
          >
            <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs shadow-lg min-w-32">
              <p className="font-semibold">{hoverInfo.area.name}</p>
              <p className="text-slate-400 mt-0.5">
                {hoverInfo.area.complaintCount} complaints
              </p>
              <p
                className="mt-0.5 font-medium"
                style={{ color: RISK_COLORS[hoverInfo.area.riskLevel] }}
              >
                {hoverInfo.area.riskLevel} Risk
              </p>
            </div>
          </Popup>
        )}
      </Map>

      {/* Legend overlay */}
      <div className="absolute bottom-4 left-4 bg-slate-900/95 border border-slate-700 rounded-lg p-3 text-xs shadow-lg z-10 pointer-events-none">
        <p className="text-slate-400 font-medium mb-2">Risk Level</p>
        {Object.entries(RISK_COLORS).map(([label, color]) => (
          <div key={label} className="flex items-center gap-2 mb-1">
            <div
              className="h-3 w-3 rounded-full flex-shrink-0"
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
