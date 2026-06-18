import { X, Shield, AlertTriangle, Calendar, MapPin, CreditCard, User, Phone, FileText, CheckCircle, Clock, ArrowUpRight } from "lucide-react";
import { type Complaint } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function riskBadge(level: string) {
  if (level === "High") return "bg-red-900/40 text-red-400 border-red-800";
  if (level === "Medium") return "bg-amber-900/40 text-amber-400 border-amber-800";
  return "bg-green-900/40 text-green-400 border-green-800";
}

const scamRedFlags: Record<string, string[]> = {
  "UPI Fraud": ["Victim entered UPI PIN believing it was a receive action", "Collect request received from unknown VPA", "No prior transaction history with sender"],
  "QR Code Scam": ["Victim scanned QR code provided by 'buyer' on OLX/Quikr", "Amount shown as debit not credit after scanning", "No physical meeting with buyer"],
  "Task Fraud": ["Victim joined Telegram group for WFH tasks", "Small initial payments received before deposits demanded", "Victim lost access to group after depositing funds"],
  "Sextortion": ["Video call initiated by unknown contact on WhatsApp", "Screenshots shared via anonymous number after call", "Demands for payment via UPI/crypto within 24 hours"],
  "Investment Scam": ["Victim joined WhatsApp investment group", "Platform shows large profits but withdrawals blocked", "Cited 'tax clearance fee' or 'verification' before withdrawal"],
  "Job Scam": ["Job offer received via WhatsApp/SMS without application", "Company not registered on MCA21 portal", "Registration fee or security deposit demanded"],
  "Fake KYC": ["Victim received call claiming KYC expiry", "OTP shared with caller posing as bank official", "Subsequent unauthorized transactions detected"],
  "Electricity Bill Scam": ["SMS with payment link received from unknown number", "Threat of immediate disconnection within 1-2 hours", "Payment made to non-official account"],
  "OTP Fraud": ["Victim received unsolicited OTP on mobile", "Caller claimed to be from bank/TRAI/UIDAI", "Full account balance transferred after OTP shared"],
  "Social Media Fraud": ["Request received from cloned profile of known contact", "Money sent before verifying via phone call", "Contact unaware of any request being made"],
};

const investigationSteps: Record<string, string[]> = {
  "UPI Fraud": ["Obtain VPA details and associated mobile number from victim", "Issue LOC to payment aggregator/NPCI for freeze request", "Trace beneficiary bank account via NPCI portal", "Coordinate with beneficiary bank for hold request"],
  "QR Code Scam": ["Collect original QR code image from victim if available", "Trace merchant ID/VPA linked to QR code", "Request CCTV footage if in-person meeting occurred", "Coordinate with payment gateway for beneficiary details"],
  "Task Fraud": ["Obtain Telegram group link and admin numbers", "Issue notice to Telegram for user data disclosure", "Trace UPI IDs used for deposit collection", "Coordinate with cyber cells in beneficiary states"],
  "Sextortion": ["Preserve all chat screenshots and call records", "Issue notice to WhatsApp for account data", "Trace UPI/crypto wallet IDs used for extortion", "Coordinate with NCMEC if victim is minor"],
  "Investment Scam": ["Preserve platform URL and login credentials", "Issue notice to hosting provider for user data", "Trace all inward/outward transactions from victim account", "Issue LOC on withdrawal accounts identified"],
  "Job Scam": ["Verify company registration on MCA21 portal", "Trace mobile numbers used in job offer messages", "Issue notice to job portal if fraudulent listing found", "Trace UPI IDs used for fee collection"],
  "Fake KYC": ["Obtain caller number and CDR from telecom operator", "Trace transactions initiated after OTP sharing", "Issue LOC on beneficiary accounts", "Coordinate with issuing bank for CCTV at withdrawal point"],
  "Electricity Bill Scam": ["Trace SMS sender ID to telemarketer", "Obtain beneficiary account details from payment link host", "Issue notice to DHBVN to verify if SMS was official", "Coordinate with payment gateway for freeze request"],
  "OTP Fraud": ["Obtain caller number and CDR", "Issue LOC immediately on all debit accounts", "Trace beneficiary accounts for fund trail", "Request call recording from telecom operator if available"],
  "Social Media Fraud": ["Report and preserve cloned profile via platform reporting", "Issue notice to social media platform for account holder data", "Trace UPI ID used for receiving transferred money", "Coordinate with cyber cell in account holder's jurisdiction"],
};

type Status = "Open" | "Under Investigation" | "Resolved" | "Escalated";
type Note = { text: string; time: string };

interface Props {
  complaint: Complaint | null;
  onClose: () => void;
}

export default function ComplaintDetailDrawer({ complaint, onClose }: Props) {
  const [status, setStatus] = useState<Status>("Open");
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteInput, setNoteInput] = useState("");
  const [saved, setSaved] = useState(false);

  if (!complaint) return null;

  const flags = scamRedFlags[complaint.scamType] || ["Verify complaint details with victim", "Check for related complaints in system"];
  const steps = investigationSteps[complaint.scamType] || ["Document all evidence", "Trace transaction trail", "Coordinate with relevant banks"];

  const addNote = () => {
    if (!noteInput.trim()) return;
    setNotes((n) => [...n, { text: noteInput, time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) }]);
    setNoteInput("");
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} data-testid="drawer-overlay" />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full w-full sm:w-[600px] bg-slate-900 border-l border-slate-700 z-50 flex flex-col shadow-2xl overflow-hidden"
        data-testid="complaint-detail-drawer"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700 flex-shrink-0">
          <div>
            <p className="text-white font-bold text-base">{complaint.id}</p>
            <p className="text-slate-400 text-xs mt-0.5">{complaint.date} — {complaint.locality}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${riskBadge(complaint.riskLevel)} border text-xs`}>{complaint.riskLevel} Risk</Badge>
            <button onClick={onClose} className="text-slate-500 hover:text-white p-1.5 hover:bg-slate-700 rounded-lg transition-colors" data-testid="drawer-close">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-5">
            {/* Status bar */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 text-xs">Status:</span>
              {(["Open", "Under Investigation", "Resolved", "Escalated"] as Status[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  data-testid={`status-${s.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    status === s
                      ? s === "Resolved" ? "bg-green-600 border-green-500 text-white"
                        : s === "Escalated" ? "bg-red-600 border-red-500 text-white"
                        : s === "Under Investigation" ? "bg-blue-600 border-blue-500 text-white"
                        : "bg-amber-600 border-amber-500 text-white"
                      : "border-slate-600 text-slate-400 hover:border-slate-500"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Case overview */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: FileText, label: "Scam Type", value: complaint.scamType, color: "text-blue-400" },
                { icon: CreditCard, label: "Channel", value: complaint.channel, color: "text-purple-400" },
                { icon: ArrowUpRight, label: "Amount Lost", value: formatCurrency(complaint.amount), color: "text-red-400" },
                { icon: MapPin, label: "Police Station", value: complaint.policeStation, color: "text-slate-300" },
              ].map((item) => (
                <div key={item.label} className="bg-slate-800 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                    <span className="text-slate-500 text-xs">{item.label}</span>
                  </div>
                  <p className={`font-semibold text-sm ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Victim profile */}
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-slate-300 text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-500" />
                Victim Profile
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-slate-500 text-xs">Age Group</p>
                  <p className="text-slate-200 text-sm font-medium mt-0.5">{complaint.ageBand} yrs</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Gender</p>
                  <p className="text-slate-200 text-sm font-medium mt-0.5">{complaint.gender}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Locality</p>
                  <p className="text-slate-200 text-sm font-medium mt-0.5">{complaint.locality}</p>
                </div>
              </div>
            </div>

            {/* Red flags observed */}
            <div className="bg-red-950/30 border border-red-900/40 rounded-lg p-4">
              <p className="text-red-400 text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                Red Flags Observed
              </p>
              <ul className="space-y-1.5">
                {flags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-red-500 mt-0.5 flex-shrink-0">•</span>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>

            {/* Investigation steps */}
            <div className="bg-blue-950/30 border border-blue-900/40 rounded-lg p-4">
              <p className="text-blue-400 text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                Recommended Investigation Steps
              </p>
              <ol className="space-y-2">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="h-4 w-4 rounded-full bg-blue-800 text-blue-300 flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-medium">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Timeline */}
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-slate-300 text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                Case Timeline
              </p>
              <div className="space-y-3">
                {[
                  { time: complaint.date, event: "Complaint registered", sub: "Via cybercrime.gov.in portal" },
                  { time: complaint.date, event: "Assigned to cyber cell", sub: complaint.policeStation },
                  ...(status !== "Open" ? [{ time: "Today", event: `Status updated to "${status}"`, sub: "By investigating officer" }] : []),
                  ...notes.map((n) => ({ time: n.time, event: "Note added", sub: n.text })),
                ].map((item, i, arr) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`h-2 w-2 rounded-full mt-1 flex-shrink-0 ${i === arr.length - 1 ? "bg-blue-400" : "bg-slate-600"}`} />
                      {i < arr.length - 1 && <div className="w-px flex-1 bg-slate-700 mt-1" />}
                    </div>
                    <div className="pb-3">
                      <p className="text-slate-200 text-xs font-medium">{item.event}</p>
                      <p className="text-slate-500 text-xs">{item.sub}</p>
                      <p className="text-slate-600 text-xs mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add note */}
            <div>
              <p className="text-slate-400 text-xs font-medium mb-2">Add Investigation Note</p>
              <div className="flex gap-2">
                <input
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addNote()}
                  placeholder="Type a note and press Enter..."
                  className="flex-1 bg-slate-800 border border-slate-600 text-slate-200 text-xs rounded-lg px-3 py-2 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                  data-testid="input-note"
                />
                <button onClick={addNote} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg transition-colors" data-testid="button-add-note">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-700 flex-shrink-0 gap-3">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white text-xs h-8" data-testid="button-print">
              <Phone className="h-3.5 w-3.5 mr-1.5" />
              Contact Victim
            </Button>
            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white text-xs h-8" data-testid="button-escalate" onClick={() => setStatus("Escalated")}>
              Escalate
            </Button>
          </div>
          <Button
            size="sm"
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
            data-testid="button-save-case"
          >
            {saved ? (
              <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5" /> Saved</span>
            ) : "Save Case"}
          </Button>
        </div>
      </div>
    </>
  );
}
