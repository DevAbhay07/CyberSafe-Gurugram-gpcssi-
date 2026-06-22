/**
 * src/lib/api.ts
 *
 * Fake async API layer wrapping mockData.ts.
 * All functions add a small artificial delay to simulate network latency.
 *
 * When connecting to a real backend, replace each function body with a
 * fetch() / axios call to the corresponding REST endpoint listed in the
 * TODO comments.  The return types should remain identical so call-sites
 * need no changes.
 */

import {
  mockAreas,
  mockStats,
  mockComplaints,
  playbooks,
  STATUS_NOTES,
  type Area,
  type Complaint,
  type Playbook,
} from "./mockData";
import type {
  CreateComplaintPayload,
  RiskThresholdConfig,
  ComplaintStatus,
} from "./types";
import { COMPLAINT_STATUS_STAGES as STAGES } from "./types";

// ─── Utility ──────────────────────────────────────────────────────────────────

/** Wraps a value in a Promise that resolves after `ms` milliseconds. */
function delay<T>(data: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

/**
 * Deterministic stage index seeded from the last 4 chars of a reference ID.
 * Same ID → same stage every time within a session.
 */
function seedStageIndex(refId: string): number {
  const digits = refId.replace(/\D/g, "");
  const seed = parseInt(digits.slice(-4) || "0", 10);
  return seed % STAGES.length;
}

// ─── Public auth ──────────────────────────────────────────────────────────────

/**
 * TODO: POST /api/auth/login  { email, password }
 * Returns a JWT on the real backend; here we derive role from email.
 */
export const api = {
  login: async (
    email: string,
    _password: string
  ): Promise<{ user: { email: string; role: "admin" | "public" } }> => {
    const role: "admin" | "public" = email.includes("admin") ? "admin" : "public";
    return delay({ user: { email, role } });
  },

  // ─── Public endpoints ─────────────────────────────────────────────────────

  /**
   * TODO: GET /api/public/overview
   * Returns high-level stats displayed on the public HomePage.
   */
  getPublicOverview: async (): Promise<{
    totalComplaints: number;
    totalLoss: number;
    topScamType: { type: string; count: number };
  }> => {
    return delay({
      totalComplaints: mockStats.totalComplaints,
      totalLoss: mockStats.totalLoss,
      topScamType: mockStats.scamTypeCounts[0],
    });
  },

  /**
   * TODO: GET /api/public/map
   * Returns anonymised area-level data for the public scam hotspot map.
   */
  getPublicMapData: async (): Promise<Area[]> => {
    return delay(mockAreas);
  },

  // ─── Admin endpoints ──────────────────────────────────────────────────────

  /**
   * TODO: GET /api/admin/overview
   * Returns aggregate stats for the admin dashboard.
   */
  getAdminOverview: async (): Promise<typeof mockStats> => {
    return delay(mockStats);
  },

  /**
   * TODO: GET /api/admin/trends?period=monthly|weekly
   * Returns time-series data for the analytics charts.
   */
  getAdminTrends: async (): Promise<{
    monthly: typeof mockStats.monthlyTrend;
    last7Days: typeof mockStats.last7Days;
  }> => {
    return delay({
      monthly: mockStats.monthlyTrend,
      last7Days: mockStats.last7Days,
    });
  },

  /**
   * TODO: GET /api/admin/areas  (with optional ?ps=&risk=&scamType= filters)
   * Returns area-level data for the admin map with full detail (MO text, etc.).
   */
  getAdminHeatmapData: async (): Promise<Area[]> => {
    return delay(mockAreas);
  },

  /**
   * TODO: GET /api/admin/complaints  (with optional filter query params)
   * Returns paginated complaint records.
   */
  getComplaints: async (): Promise<Complaint[]> => {
    return delay(mockComplaints);
  },

  /**
   * TODO: POST /api/admin/complaints  body: CreateComplaintPayload
   * Creates a new complaint record and returns it with a generated ID.
   */
  createComplaint: async (
    payload: CreateComplaintPayload
  ): Promise<Complaint> => {
    const newComplaint: Complaint = {
      id: `CMP-${Date.now()}`,
      ...payload,
    };
    mockComplaints.unshift(newComplaint);
    return delay(newComplaint);
  },

  /**
   * TODO: PUT /api/admin/config/thresholds  body: RiskThresholdConfig
   * Updates the risk classification thresholds used by the heatmap engine.
   */
  updateRiskThresholds: async (
    config: RiskThresholdConfig
  ): Promise<{ success: boolean; config: RiskThresholdConfig }> => {
    return delay({ success: true, config });
  },

  /**
   * TODO: GET /api/admin/playbooks/:scamType
   * Returns the investigation playbook for a given scam type.
   */
  getPlaybook: async (scamType: string): Promise<Playbook> => {
    return delay(
      playbooks[scamType] ?? {
        description: "N/A",
        redFlags: [],
        steps: [],
        moText: "N/A",
      }
    );
  },

  // ─── Citizen complaint tracking ───────────────────────────────────────────

  /**
   * TODO: GET /api/public/complaints/:refId/status
   * Returns the current processing status for a citizen's complaint reference ID.
   * Returns null if the reference ID is not found or has an invalid format.
   */
  getComplaintStatus: async (
    refId: string
  ): Promise<ComplaintStatus | null> => {
    // Validate format: must look like CYB-XXXX-NNNN or CMP-NNNNNNN
    const isValid = /^(CYB|CMP)-[\w-]+$/i.test(refId.trim());
    if (!isValid) return delay(null, 500);

    const stageIndex = seedStageIndex(refId);
    const currentStage = STAGES[stageIndex];

    return delay(
      {
        referenceId: refId.trim().toUpperCase(),
        currentStage,
        stageIndex,
        updatedAt: new Date(
          Date.now() - stageIndex * 86400000 * 2
        ).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        note: STATUS_NOTES[currentStage] ?? "Status update pending.",
      } satisfies ComplaintStatus,
      600
    );
  },
};
