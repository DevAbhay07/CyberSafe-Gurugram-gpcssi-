/**
 * src/lib/types.ts
 *
 * Centralized shared types used across the application.
 * These types define the API boundary between the frontend and the future
 * REST backend.  All filter shapes, request payloads, and response wrappers
 * should live here rather than being duplicated across page components.
 */

import type { RiskLevel, ScamType, Channel, AgeBand, Gender } from "./mockData";

export interface AreaPolygon {
  type: "Polygon";
  coordinates: [number, number][][];
}

// ─── Date range filter ────────────────────────────────────────────────────────

export type DateRange =
  | "All Time"
  | "Last 7 Days"
  | "Last 30 Days"
  | "Last Quarter"
  | "Last Year";

// ─── Map page filters ─────────────────────────────────────────────────────────

export interface MapFilters {
  /** "All" means no scam-type filter */
  scamType: ScamType | "All";
  dateRange: DateRange;
  /** "All" means no police-station filter */
  policeStation: string;
  /** "All" means no risk-level filter */
  riskLevel: RiskLevel | "All";
}

export const defaultMapFilters: MapFilters = {
  scamType: "All",
  dateRange: "All Time",
  policeStation: "All",
  riskLevel: "All",
};

// ─── Complaints page filters ──────────────────────────────────────────────────

export interface ComplaintFilters {
  search: string;
  scamType: ScamType | "All";
  riskLevel: RiskLevel | "All";
  policeStation: string;
}

export const defaultComplaintFilters: ComplaintFilters = {
  search: "",
  scamType: "All",
  riskLevel: "All",
  policeStation: "All",
};

// ─── Complaint creation payload ───────────────────────────────────────────────
// TODO: This payload will map to POST /api/complaints

export interface CreateComplaintPayload {
  date: string;
  policeStation: string;
  locality: string;
  scamType: ScamType;
  channel: Channel;
  amount: number;
  ageBand: AgeBand;
  gender: Gender;
  riskLevel: RiskLevel;
}

// ─── Risk threshold config ────────────────────────────────────────────────────
// TODO: This will map to PUT /api/admin/config/thresholds

export interface RiskThresholdConfig {
  highMinScore: number;
  mediumMinScore: number;
}

// ─── Complaint tracking ───────────────────────────────────────────────────────

export type ComplaintStatusStage =
  | "Received"
  | "Under Review"
  | "Forwarded to PS"
  | "In Investigation"
  | "Closed";

export const COMPLAINT_STATUS_STAGES: ComplaintStatusStage[] = [
  "Received",
  "Under Review",
  "Forwarded to PS",
  "In Investigation",
  "Closed",
];

export interface ComplaintStatus {
  referenceId: string;
  currentStage: ComplaintStatusStage;
  /** Index into COMPLAINT_STATUS_STAGES (0-based) */
  stageIndex: number;
  updatedAt: string;
  /** Human-readable note for the current stage */
  note: string;
}

// ─── Generic API response wrapper ─────────────────────────────────────────────
// TODO: Future REST responses will be wrapped in this shape:
//   { data: T, success: boolean, error?: string }

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}
