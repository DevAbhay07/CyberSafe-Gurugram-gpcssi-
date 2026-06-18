import { X, AlertTriangle, TrendingUp, Users, Shield, Phone, ExternalLink, ChevronRight } from "lucide-react";
import { type Area } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

const SCAM_TIPS: Record<string, string> = {
  "UPI Fraud": "Never enter your UPI PIN to 'receive' money. PIN is only needed for sending.",
  "QR Code Scam": "Scanning a QR code cannot add money to your account. It only sends money.",
  "Task Fraud": "Legitimate WFH jobs never require upfront deposits. Walk away immediately.",
  "Sextortion": "Do not pay. Report to cybercrime.gov.in immediately and preserve evidence.",
  "Investment Scam": "No legitimate platform blocks withdrawals. Guaranteed returns are always a scam.",
  "Job Scam": "Verify company registration on MCA21. Real jobs never demand registration fees.",
  "Fake KYC": "Banks never ask for OTP over phone. Disconnect and call your bank's official number.",
  "Electricity Bill Scam": "Never click SMS links for bill payment. Use official DHBVN website/app only.",
  "OTP Fraud": "Never share OTP with anyone — not even someone claiming to be from your bank or TRAI.",
  "Social Media Fraud": "Always verify money requests via phone call, even from known contacts.",
};

function riskBadge(level: string) {
  if (level === "High") return "bg-red-100 text-red-700 border-red-300";
  if (level === "Medium") return "bg-amber-100 text-amber-700 border-amber-300";
  return "bg-green-100 text-green-700 border-green-300";
}

function riskBarColor(level: string) {
  if (level === "High") return "bg-red-500";
  if (level === "Medium") return "bg-amber-500";
  return "bg-green-500";
}

interface Props {
  area: Area | null;
  onClose: () => void;
}

export default function AreaDetailModal({ area, onClose }: Props) {
  if (!area) return null;

  const topScam = area.topScamTypes[0] || "UPI Fraud";
  const tip = SCAM_TIPS[topScam] || "Stay vigilant — verify before trusting.";

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
        data-testid="area-modal-overlay"
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        data-testid="area-detail-modal"
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className={`p-5 rounded-t-2xl ${area.riskLevel === "High" ? "bg-red-50 border-b border-red-100" : area.riskLevel === "Medium" ? "bg-amber-50 border-b border-amber-100" : "bg-green-50 border-b border-green-100"}`}>
            <div className="flex items-start justify-between">
              <div>
                <Badge className={`${riskBadge(area.riskLevel)} border text-xs mb-2`}>{area.riskLevel} Risk Zone</Badge>
                <h2 className="text-xl font-bold text-slate-900">{area.name}</h2>
                <p className="text-slate-500 text-sm mt-0.5">Gurugram, Haryana</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/80 text-slate-500 hover:text-slate-800 transition-colors"
                data-testid="button-close-area-modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Risk score meter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 text-sm font-medium">Risk Score</span>
                <span className="text-slate-900 font-bold text-lg">{area.riskScore}/100</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${riskBarColor(area.riskLevel)}`}
                  style={{ width: `${area.riskScore}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-slate-400 text-xs">Low</span>
                <span className="text-slate-400 text-xs">High</span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <div className="flex justify-center mb-1.5">
                  <AlertTriangle className={`h-5 w-5 ${area.riskLevel === "High" ? "text-red-500" : "text-amber-500"}`} />
                </div>
                <p className="text-slate-900 font-bold text-lg">{area.complaintCount}</p>
                <p className="text-slate-500 text-xs">Complaints</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <div className="flex justify-center mb-1.5">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-slate-900 font-bold text-lg">
                  {area.totalLoss >= 100000
                    ? `₹${(area.totalLoss / 100000).toFixed(1)}L`
                    : `₹${(area.totalLoss / 1000).toFixed(0)}K`}
                </p>
                <p className="text-slate-500 text-xs">Reported Loss</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <div className="flex justify-center mb-1.5">
                  <Users className="h-5 w-5 text-purple-500" />
                </div>
                <p className="text-slate-900 font-bold text-lg">{area.topScamTypes.length}</p>
                <p className="text-slate-500 text-xs">Scam Types</p>
              </div>
            </div>

            {/* MO Text */}
            {area.moText && (
              <div className="bg-slate-50 rounded-xl p-4 border-l-4 border-blue-400">
                <p className="text-slate-700 text-xs font-semibold uppercase tracking-wide mb-1.5">Modus Operandi</p>
                <p className="text-slate-600 text-sm leading-relaxed">{area.moText}</p>
              </div>
            )}

            {/* Top scam types */}
            <div>
              <p className="text-slate-700 text-sm font-semibold mb-2">Top Scam Types in This Area</p>
              <div className="flex flex-wrap gap-2">
                {area.topScamTypes.map((t) => (
                  <Badge key={t} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 border text-xs">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Safety tip */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-800 font-semibold text-sm mb-1">Safety Tip for {topScam}</p>
                  <p className="text-amber-700 text-xs leading-relaxed">{tip}</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-2 pt-1">
              <a
                href="tel:1930"
                className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-green-700"
                data-testid="link-call-1930"
              >
                <Phone className="h-4 w-4" />
                Call 1930
              </a>
              <Link
                href="/report"
                className="flex-1 flex items-center justify-center gap-1.5 border border-blue-200 text-blue-700 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-blue-50"
                data-testid="link-report-crime"
              >
                Report a Crime
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
