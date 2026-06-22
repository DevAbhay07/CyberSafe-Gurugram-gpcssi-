/**
 * src/lib/mockData.ts
 *
 * All static mock data for the CyberSafe Gurugram application.
 * On a real backend, these would be served from a database via REST/GraphQL.
 * In-memory mutations (e.g. createComplaint) reset on page reload — by design.
 */

// ─── Domain enums ─────────────────────────────────────────────────────────────

import type { AreaPolygon } from "./types";

export type RiskLevel = "High" | "Medium" | "Low";
export type ScamType =
  | "UPI Fraud"
  | "QR Code Scam"
  | "Task Fraud"
  | "Sextortion"
  | "Investment Scam"
  | "Job Scam"
  | "Fake KYC"
  | "Electricity Bill Scam"
  | "OTP Fraud"
  | "Social Media Fraud";
export type Channel =
  | "UPI"
  | "QR Code"
  | "Social Media"
  | "OTP"
  | "Card"
  | "Other"
  | "Phone Call";
export type AgeBand = "18-30" | "31-45" | "46-60" | "60+";
export type Gender = "Male" | "Female" | "Other";

// ─── Core data models ─────────────────────────────────────────────────────────

export interface Area {
  id: number;
  name: string;
  policeStation: string;
  center: { lat: number; lng: number };
  complaintCount: number;
  totalLoss: number;
  riskLevel: RiskLevel;
  topScamTypes: ScamType[];
  riskScore: number;
  moText: string;
  polygon?: AreaPolygon;
}

export interface Complaint {
  id: string;
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

// ─── Playbook interface (replaces Record<string, any>) ────────────────────────

export interface Playbook {
  description: string;
  redFlags: string[];
  steps: string[];
  moText: string;
}

// ─── Mock areas (10 Gurugram localities) ──────────────────────────────────────

export const mockAreas: Area[] = [
  {
    id: 1,
    name: "Cyber City",
    policeStation: "DLF Cyber City PS",
    center: { lat: 28.4952, lng: 77.0889 },
    complaintCount: 342,
    totalLoss: 12500000,
    riskLevel: "High",
    topScamTypes: ["UPI Fraud", "Investment Scam", "Job Scam"],
    riskScore: 92,
    moText:
      "Fraudsters pose as job recruiters on LinkedIn targeting IT professionals, then demand registration fees via UPI.",
    polygon: {
      type: "Polygon",
      coordinates: [[
        [77.08, 28.49],
        [77.10, 28.49],
        [77.10, 28.51],
        [77.08, 28.51],
        [77.08, 28.49]
      ]]
    }
  },
  {
    id: 2,
    name: "Sohna Road",
    policeStation: "Sohna Road PS",
    center: { lat: 28.4231, lng: 77.0394 },
    complaintCount: 218,
    totalLoss: 8900000,
    riskLevel: "High",
    topScamTypes: ["Task Fraud", "Sextortion", "OTP Fraud"],
    riskScore: 81,
    moText:
      "Work-from-home task fraud — victims paid small amounts for liking videos, then asked to deposit money to unlock earnings.",
    polygon: {
      type: "Polygon",
      coordinates: [[
        [77.03, 28.41],
        [77.05, 28.41],
        [77.05, 28.44],
        [77.03, 28.44],
        [77.03, 28.41]
      ]]
    }
  },
  {
    id: 3,
    name: "MG Road",
    policeStation: "MG Road PS",
    center: { lat: 28.48, lng: 77.0741 },
    complaintCount: 156,
    totalLoss: 5200000,
    riskLevel: "Medium",
    topScamTypes: ["QR Code Scam", "Fake KYC", "UPI Fraud"],
    riskScore: 61,
    moText:
      "QR code scams targeting shopkeepers — fraudsters send payment QR codes that debit money from the victim's account.",
    polygon: {
      type: "Polygon",
      coordinates: [[
        [77.06, 28.47],
        [77.09, 28.47],
        [77.09, 28.49],
        [77.06, 28.49],
        [77.06, 28.47]
      ]]
    }
  },
  {
    id: 4,
    name: "Golf Course Road",
    policeStation: "South City PS",
    center: { lat: 28.4502, lng: 77.0902 },
    complaintCount: 98,
    totalLoss: 3100000,
    riskLevel: "Medium",
    topScamTypes: ["Investment Scam", "Job Scam", "UPI Fraud"],
    riskScore: 52,
    moText:
      "Investment scams targeting high-income residents — fake trading platforms promising 40-50% monthly returns.",
    polygon: {
      type: "Polygon",
      coordinates: [[
        [77.08, 28.44],
        [77.11, 28.44],
        [77.11, 28.46],
        [77.08, 28.46],
        [77.08, 28.44]
      ]]
    }
  },
  {
    id: 5,
    name: "Palam Vihar",
    policeStation: "Palam Vihar PS",
    center: { lat: 28.5073, lng: 76.9917 },
    complaintCount: 201,
    totalLoss: 7800000,
    riskLevel: "High",
    topScamTypes: ["Electricity Bill Scam", "OTP Fraud", "Fake KYC"],
    riskScore: 78,
    moText:
      "DHBVN impersonation calls threatening electricity disconnection unless dues cleared via UPI link sent by SMS.",
    polygon: {
      type: "Polygon",
      coordinates: [[
        [76.98, 28.49],
        [77.01, 28.49],
        [77.01, 28.52],
        [76.98, 28.52],
        [76.98, 28.49]
      ]]
    }
  },
  {
    id: 6,
    name: "Sector 56",
    policeStation: "Sector 56 PS",
    center: { lat: 28.4174, lng: 77.078 },
    complaintCount: 87,
    totalLoss: 2900000,
    riskLevel: "Medium",
    topScamTypes: ["UPI Fraud", "Task Fraud", "Social Media Fraud"],
    riskScore: 45,
    moText:
      "Social media impersonation — fake profiles of relatives asking for urgent money transfers citing emergencies.",
    polygon: {
      type: "Polygon",
      coordinates: [[
        [77.06, 28.40],
        [77.09, 28.40],
        [77.09, 28.43],
        [77.06, 28.43],
        [77.06, 28.40]
      ]]
    }
  },
  {
    id: 7,
    name: "Badshahpur",
    policeStation: "Badshahpur PS",
    center: { lat: 28.3912, lng: 77.0564 },
    complaintCount: 45,
    totalLoss: 1200000,
    riskLevel: "Low",
    topScamTypes: ["Fake KYC", "OTP Fraud"],
    riskScore: 28,
    moText:
      "KYC update fraud — calls claiming bank account will be blocked unless OTP is shared for verification.",
    polygon: {
      type: "Polygon",
      coordinates: [[
        [77.04, 28.38],
        [77.07, 28.38],
        [77.07, 28.40],
        [77.04, 28.40],
        [77.04, 28.38]
      ]]
    }
  },
  {
    id: 8,
    name: "Manesar",
    policeStation: "Manesar PS",
    center: { lat: 28.3578, lng: 76.9336 },
    complaintCount: 62,
    totalLoss: 1800000,
    riskLevel: "Low",
    topScamTypes: ["Job Scam", "Investment Scam"],
    riskScore: 32,
    moText:
      "Fake job offers targeting factory workers — overseas employment promises with demands for processing fees.",
    polygon: {
      type: "Polygon",
      coordinates: [[
        [76.91, 28.34],
        [76.95, 28.34],
        [76.95, 28.37],
        [76.91, 28.37],
        [76.91, 28.34]
      ]]
    }
  },
  {
    id: 9,
    name: "Old Gurugram",
    policeStation: "Civil Lines PS",
    center: { lat: 28.458, lng: 77.0261 },
    complaintCount: 134,
    totalLoss: 4100000,
    riskLevel: "Medium",
    topScamTypes: ["UPI Fraud", "QR Code Scam", "Sextortion"],
    riskScore: 58,
    moText:
      "Sextortion targeting young men — fake video calls record intimate moments, then blackmail for money via UPI.",
    polygon: {
      type: "Polygon",
      coordinates: [[
        [77.01, 28.44],
        [77.04, 28.44],
        [77.04, 28.47],
        [77.01, 28.47],
        [77.01, 28.44]
      ]]
    }
  },
  {
    id: 10,
    name: "Sector 14",
    policeStation: "Sector 14 PS",
    center: { lat: 28.4632, lng: 77.018 },
    complaintCount: 78,
    totalLoss: 2500000,
    riskLevel: "Medium",
    topScamTypes: ["OTP Fraud", "Task Fraud", "Fake KYC"],
    riskScore: 41,
    moText:
      "OTP sharing fraud — callers posing as bank officials request OTP to process a refund, then transfer funds.",
    polygon: {
      type: "Polygon",
      coordinates: [[
        [77.00, 28.45],
        [77.03, 28.45],
        [77.03, 28.48],
        [77.00, 28.48],
        [77.00, 28.45]
      ]]
    }
  },
];

// ─── Mock complaint generator ─────────────────────────────────────────────────

/**
 * Generates an array of typed Complaint objects for use in the mock data layer.
 * NOTE: Random values change on every module reload — deterministic seeding
 * is intentionally not used so the data feels fresh each session.
 */
export const generateComplaints = (count = 50): Complaint[] => {
  const types: ScamType[] = [
    "UPI Fraud",
    "QR Code Scam",
    "Task Fraud",
    "Sextortion",
    "Investment Scam",
    "Job Scam",
    "Fake KYC",
    "Electricity Bill Scam",
    "OTP Fraud",
    "Social Media Fraud",
  ];
  const channels: Channel[] = [
    "UPI",
    "QR Code",
    "Social Media",
    "OTP",
    "Card",
    "Other",
  ];
  const ageBands: AgeBand[] = ["18-30", "31-45", "46-60", "60+"];
  const genders: Gender[] = ["Male", "Female", "Other"];
  const risks: RiskLevel[] = ["High", "Medium", "Low"];
  const locs = mockAreas.map((a) => ({ name: a.name, ps: a.policeStation }));

  return Array.from({ length: count }).map(
    (_, i): Complaint => {
      const loc = locs[Math.floor(Math.random() * locs.length)];
      return {
        id: `CMP-${2023000 + i}`,
        date: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
          .toISOString()
          .split("T")[0],
        policeStation: loc.ps,
        locality: loc.name,
        scamType: types[Math.floor(Math.random() * types.length)],
        channel: channels[Math.floor(Math.random() * channels.length)],
        amount: Math.floor(Math.random() * 500000),
        ageBand: ageBands[Math.floor(Math.random() * ageBands.length)],
        gender: genders[Math.floor(Math.random() * genders.length)],
        riskLevel: risks[Math.floor(Math.random() * risks.length)],
      };
    }
  );
};

export const mockComplaints: Complaint[] = generateComplaints(50);

// ─── Aggregated statistics ────────────────────────────────────────────────────

export const mockStats = {
  totalComplaints: 1421,
  totalLoss: 52100000,
  avgLoss: 36665,
  highRiskLocalities: 3,
  monthlyTrend: [
    { month: "Jan", complaints: 120, loss: 4500000 },
    { month: "Feb", complaints: 135, loss: 5100000 },
    { month: "Mar", complaints: 110, loss: 4200000 },
    { month: "Apr", complaints: 140, loss: 5300000 },
    { month: "May", complaints: 160, loss: 6100000 },
    { month: "Jun", complaints: 180, loss: 6800000 },
    { month: "Jul", complaints: 155, loss: 5700000 },
    { month: "Aug", complaints: 190, loss: 7200000 },
    { month: "Sep", complaints: 210, loss: 8100000 },
    { month: "Oct", complaints: 175, loss: 6500000 },
    { month: "Nov", complaints: 165, loss: 6000000 },
    { month: "Dec", complaints: 195, loss: 7400000 },
  ],
  scamTypeCounts: [
    { type: "UPI Fraud", count: 450 },
    { type: "QR Code Scam", count: 280 },
    { type: "Task Fraud", count: 210 },
    { type: "Sextortion", count: 180 },
    { type: "Investment Scam", count: 150 },
    { type: "Job Scam", count: 130 },
    { type: "Fake KYC", count: 90 },
    { type: "Electricity Bill Scam", count: 70 },
    { type: "OTP Fraud", count: 61 },
  ],
  channelCounts: [
    { channel: "UPI", count: 520 },
    { channel: "QR Code", count: 310 },
    { channel: "Social Media", count: 240 },
    { channel: "OTP", count: 180 },
    { channel: "Card", count: 110 },
    { channel: "Other", count: 61 },
  ],
  ageBandCounts: [
    { band: "18-30", count: 520 },
    { band: "31-45", count: 480 },
    { band: "46-60", count: 310 },
    { band: "60+", count: 111 },
  ],
  genderCounts: [
    { gender: "Male", count: 850 },
    { gender: "Female", count: 540 },
    { gender: "Other", count: 31 },
  ],
  last7Days: [
    { date: "Mon", count: 12 },
    { date: "Tue", count: 15 },
    { date: "Wed", count: 8 },
    { date: "Thu", count: 22 },
    { date: "Fri", count: 18 },
    { date: "Sat", count: 25 },
    { date: "Sun", count: 14 },
  ],
};

// ─── Scam playbooks ───────────────────────────────────────────────────────────

export const playbooks: Record<string, Playbook> = {
  "UPI Fraud": {
    description:
      "Scammers trick victims into entering their UPI PIN to receive money, which actually deducts money from their account.",
    redFlags: [
      "Being asked to enter PIN to 'receive' money",
      "Unknown payment requests",
      "Urgency or threats",
    ],
    steps: [
      "Do not enter PIN",
      "Decline the request",
      "Report the VPA to the bank",
      "Call 1930",
    ],
    moText:
      "The victim receives a call about a refund or prize. The scammer sends a collect request and asks them to enter their PIN.",
  },
  "QR Code Scam": {
    description:
      "Scammers send a QR code claiming it's to pay the victim, but scanning it initiates a payment to the scammer.",
    redFlags: [
      "Being asked to scan a QR to receive money",
      "Unverified QR codes at local shops overlaid with fake ones",
    ],
    steps: [
      "Never scan QR to receive funds",
      "Verify merchant details before paying",
    ],
    moText:
      "Victim selling items online is contacted by a 'buyer' who sends a QR code to 'transfer funds'.",
  },
};

// ─── Mock users ───────────────────────────────────────────────────────────────

export const mockUsers = [
  {
    id: 1,
    name: "Amit Kumar",
    email: "amit.admin@police.gov.in",
    role: "Admin",
    status: "Active",
    lastLogin: "2023-11-01 10:23 AM",
  },
  {
    id: 2,
    name: "Neha Sharma",
    email: "neha@police.gov.in",
    role: "Analyst",
    status: "Active",
    lastLogin: "2023-11-02 09:15 AM",
  },
  {
    id: 3,
    name: "Rajesh Singh",
    email: "rajesh@police.gov.in",
    role: "Investigator",
    status: "Inactive",
    lastLogin: "2023-10-15 04:30 PM",
  },
  {
    id: 4,
    name: "Vikram Yadav",
    email: "vikram.admin@police.gov.in",
    role: "Admin",
    status: "Active",
    lastLogin: "2023-11-03 11:45 AM",
  },
  {
    id: 5,
    name: "Priya Patel",
    email: "priya@police.gov.in",
    role: "Analyst",
    status: "Active",
    lastLogin: "2023-11-03 08:20 AM",
  },
];

// ─── Complaint status notes ───────────────────────────────────────────────────
// Used by the /track page to show a timeline for a given reference ID.
// Status is seeded deterministically from the last digit of the ref ID so
// the same reference number always shows the same stage.

export const STATUS_NOTES: Record<string, string> = {
  Received: "Your complaint has been logged in the Cyber Crime portal.",
  "Under Review":
    "An officer has been assigned and is reviewing your complaint details.",
  "Forwarded to PS":
    "Your case has been forwarded to the relevant Police Station for further action.",
  "In Investigation":
    "The investigating officer is actively working on your case. You may be contacted for additional information.",
  Closed:
    "Your case has been resolved. If you are unsatisfied, you may re-open it by visiting your nearest police station.",
};
