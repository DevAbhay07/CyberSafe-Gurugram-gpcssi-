import { mockAreas, mockStats, mockComplaints, playbooks } from "./mockData";

const delay = <T>(data: T, ms = 300): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), ms));

export const api = {
  login: async (email: string) => {
    const role = email.includes("admin") ? "admin" : "public";
    return delay({ user: { email, role } });
  },
  getPublicOverview: async () => {
    return delay({
      totalComplaints: mockStats.totalComplaints,
      totalLoss: mockStats.totalLoss,
      topScamType: mockStats.scamTypeCounts[0]
    });
  },
  getPublicMapData: async () => {
    return delay(mockAreas);
  },
  getAdminOverview: async () => {
    return delay(mockStats);
  },
  getAdminTrends: async () => {
    return delay({ monthly: mockStats.monthlyTrend, last7Days: mockStats.last7Days });
  },
  getAdminHeatmapData: async () => {
    return delay(mockAreas);
  },
  getComplaints: async () => {
    return delay(mockComplaints);
  },
  createComplaint: async (payload: any) => {
    const newComplaint = {
      id: `CMP-${Date.now()}`,
      ...payload
    };
    mockComplaints.unshift(newComplaint);
    return delay(newComplaint);
  },
  updateRiskThresholds: async (config: any) => {
    return delay({ success: true, config });
  },
  getPlaybook: async (scamType: string) => {
    return delay(playbooks[scamType] || { description: "N/A", redFlags: [], steps: [], moText: "N/A" });
  }
};
