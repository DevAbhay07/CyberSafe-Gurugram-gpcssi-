export type RiskLevel = "High" | "Medium" | "Low";
export type ScamType = "UPI Fraud" | "QR Code Scam" | "Task Fraud" | "Sextortion" | "Investment Scam" | "Job Scam" | "Fake KYC" | "Electricity Bill Scam" | "OTP Fraud" | "Social Media Fraud";
export type Channel = "UPI" | "QR Code" | "Social Media" | "OTP" | "Card" | "Other" | "Phone Call";
export type AgeBand = "18-30" | "31-45" | "46-60" | "60+";
export type Gender = "Male" | "Female" | "Other";

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

export const mockAreas: Area[] = [
  { id: 1, name: "Cyber City", policeStation: "DLF Cyber City PS", center: {lat: 28.4952, lng: 77.0889}, complaintCount: 342, totalLoss: 12500000, riskLevel: "High", topScamTypes: ["UPI Fraud", "Investment Scam", "Job Scam"], riskScore: 92, moText: "Fraudsters pose as job recruiters on LinkedIn targeting IT professionals, then demand registration fees via UPI." },
  { id: 2, name: "Sohna Road", policeStation: "Sohna Road PS", center: {lat: 28.4231, lng: 77.0394}, complaintCount: 218, totalLoss: 8900000, riskLevel: "High", topScamTypes: ["Task Fraud", "Sextortion", "OTP Fraud"], riskScore: 81, moText: "Work-from-home task fraud — victims paid small amounts for liking videos, then asked to deposit money to unlock earnings." },
  { id: 3, name: "MG Road", policeStation: "MG Road PS", center: {lat: 28.4800, lng: 77.0741}, complaintCount: 156, totalLoss: 5200000, riskLevel: "Medium", topScamTypes: ["QR Code Scam", "Fake KYC", "UPI Fraud"], riskScore: 61, moText: "QR code scams targeting shopkeepers — fraudsters send payment QR codes that debit money from the victim's account." },
  { id: 4, name: "Golf Course Road", policeStation: "South City PS", center: {lat: 28.4502, lng: 77.0902}, complaintCount: 98, totalLoss: 3100000, riskLevel: "Medium", topScamTypes: ["Investment Scam", "Job Scam", "UPI Fraud"], riskScore: 52, moText: "Investment scams targeting high-income residents — fake trading platforms promising 40-50% monthly returns." },
  { id: 5, name: "Palam Vihar", policeStation: "Palam Vihar PS", center: {lat: 28.5073, lng: 76.9917}, complaintCount: 201, totalLoss: 7800000, riskLevel: "High", topScamTypes: ["Electricity Bill Scam", "OTP Fraud", "Fake KYC"], riskScore: 78, moText: "DHBVN impersonation calls threatening electricity disconnection unless dues cleared via UPI link sent by SMS." },
  { id: 6, name: "Sector 56", policeStation: "Sector 56 PS", center: {lat: 28.4174, lng: 77.0780}, complaintCount: 87, totalLoss: 2900000, riskLevel: "Medium", topScamTypes: ["UPI Fraud", "Task Fraud", "Social Media Fraud"], riskScore: 45, moText: "Social media impersonation — fake profiles of relatives asking for urgent money transfers citing emergencies." },
  { id: 7, name: "Badshahpur", policeStation: "Badshahpur PS", center: {lat: 28.3912, lng: 77.0564}, complaintCount: 45, totalLoss: 1200000, riskLevel: "Low", topScamTypes: ["Fake KYC", "OTP Fraud"], riskScore: 28, moText: "KYC update fraud — calls claiming bank account will be blocked unless OTP is shared for verification." },
  { id: 8, name: "Manesar", policeStation: "Manesar PS", center: {lat: 28.3578, lng: 76.9336}, complaintCount: 62, totalLoss: 1800000, riskLevel: "Low", topScamTypes: ["Job Scam", "Investment Scam"], riskScore: 32, moText: "Fake job offers targeting factory workers — overseas employment promises with demands for processing fees." },
  { id: 9, name: "Old Gurugram", policeStation: "Civil Lines PS", center: {lat: 28.4580, lng: 77.0261}, complaintCount: 134, totalLoss: 4100000, riskLevel: "Medium", topScamTypes: ["UPI Fraud", "QR Code Scam", "Sextortion"], riskScore: 58, moText: "Sextortion targeting young men — fake video calls record intimate moments, then blackmail for money via UPI." },
  { id: 10, name: "Sector 14", policeStation: "Sector 14 PS", center: {lat: 28.4632, lng: 77.0180}, complaintCount: 78, totalLoss: 2500000, riskLevel: "Medium", topScamTypes: ["OTP Fraud", "Task Fraud", "Fake KYC"], riskScore: 41, moText: "OTP sharing fraud — callers posing as bank officials request OTP to process a refund, then transfer funds." }
];

export const generateComplaints = (count = 50) => {
  const types = ["UPI Fraud", "QR Code Scam", "Task Fraud", "Sextortion", "Investment Scam", "Job Scam", "Fake KYC", "Electricity Bill Scam", "OTP Fraud", "Social Media Fraud"];
  const channels = ["UPI", "QR Code", "Social Media", "OTP", "Card", "Other"];
  const ageBands = ["18-30", "31-45", "46-60", "60+"];
  const genders = ["Male", "Female", "Other"];
  const risks = ["High", "Medium", "Low"];
  const locs = mockAreas.map(a => ({ name: a.name, ps: a.policeStation }));

  return Array.from({ length: count }).map((_, i) => {
    const loc = locs[Math.floor(Math.random() * locs.length)];
    return {
      id: `CMP-${2023000 + i}`,
      date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
      policeStation: loc.ps,
      locality: loc.name,
      scamType: types[Math.floor(Math.random() * types.length)],
      channel: channels[Math.floor(Math.random() * channels.length)],
      amount: Math.floor(Math.random() * 500000),
      ageBand: ageBands[Math.floor(Math.random() * ageBands.length)],
      gender: genders[Math.floor(Math.random() * genders.length)],
      riskLevel: risks[Math.floor(Math.random() * risks.length)],
    };
  });
};

export const mockComplaints = generateComplaints(50);

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
    { month: "Dec", complaints: 195, loss: 7400000 }
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
    { type: "OTP Fraud", count: 61 }
  ],
  channelCounts: [
    { channel: "UPI", count: 520 },
    { channel: "QR Code", count: 310 },
    { channel: "Social Media", count: 240 },
    { channel: "OTP", count: 180 },
    { channel: "Card", count: 110 },
    { channel: "Other", count: 61 }
  ],
  ageBandCounts: [
    { band: "18-30", count: 520 },
    { band: "31-45", count: 480 },
    { band: "46-60", count: 310 },
    { band: "60+", count: 111 }
  ],
  genderCounts: [
    { gender: "Male", count: 850 },
    { gender: "Female", count: 540 },
    { gender: "Other", count: 31 }
  ],
  last7Days: [
    { date: "Mon", count: 12 },
    { date: "Tue", count: 15 },
    { date: "Wed", count: 8 },
    { date: "Thu", count: 22 },
    { date: "Fri", count: 18 },
    { date: "Sat", count: 25 },
    { date: "Sun", count: 14 }
  ]
};

export const playbooks: Record<string, any> = {
  "UPI Fraud": {
    description: "Scammers trick victims into entering their UPI PIN to receive money, which actually deducts money from their account.",
    redFlags: ["Being asked to enter PIN to 'receive' money", "Unknown payment requests", "Urgency or threats"],
    steps: ["Do not enter PIN", "Decline the request", "Report the VPA to the bank", "Call 1930"],
    moText: "The victim receives a call about a refund or prize. The scammer sends a collect request and asks them to enter their PIN."
  },
  "QR Code Scam": {
    description: "Scammers send a QR code claiming it's to pay the victim, but scanning it initiates a payment to the scammer.",
    redFlags: ["Being asked to scan a QR to receive money", "Unverified QR codes at local shops overlaid with fake ones"],
    steps: ["Never scan QR to receive funds", "Verify merchant details before paying"],
    moText: "Victim selling items online is contacted by a 'buyer' who sends a QR code to 'transfer funds'."
  }
};

export const mockUsers = [
  { id: 1, name: "Amit Kumar", email: "amit.admin@police.gov.in", role: "Admin", status: "Active", lastLogin: "2023-11-01 10:23 AM" },
  { id: 2, name: "Neha Sharma", email: "neha@police.gov.in", role: "Analyst", status: "Active", lastLogin: "2023-11-02 09:15 AM" },
  { id: 3, name: "Rajesh Singh", email: "rajesh@police.gov.in", role: "Investigator", status: "Inactive", lastLogin: "2023-10-15 04:30 PM" },
  { id: 4, name: "Vikram Yadav", email: "vikram.admin@police.gov.in", role: "Admin", status: "Active", lastLogin: "2023-11-03 11:45 AM" },
  { id: 5, name: "Priya Patel", email: "priya@police.gov.in", role: "Analyst", status: "Active", lastLogin: "2023-11-03 08:20 AM" }
];
