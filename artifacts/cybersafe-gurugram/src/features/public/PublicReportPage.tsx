import { useState } from "react";
import { Shield, Send, CheckCircle, ExternalLink, AlertTriangle, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const SCAM_TYPES = [
  "UPI Fraud", "QR Code Scam", "Task Fraud / WFH Scam", "Sextortion",
  "Investment Scam", "Job Scam", "Fake KYC", "Electricity Bill Scam",
  "OTP Fraud", "Social Media Fraud", "Other",
];
const CHANNELS = ["UPI", "QR Code", "WhatsApp", "Telegram", "Phone Call", "SMS", "Social Media", "Website / App", "Other"];
const LOCALITIES = [
  "Cyber City", "Sohna Road", "MG Road", "Golf Course Road", "Palam Vihar",
  "Sector 56", "Badshahpur", "Manesar", "Old Gurugram", "Sector 14", "Other Area",
];

function generateId() {
  const n = Math.floor(Math.random() * 9000 + 1000);
  return `CYB-2024-${n}`;
}

export default function PublicReportPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    locality: "",
    date: new Date().toISOString().split("T")[0],
    scamType: "",
    channel: "",
    amount: "",
    description: "",
    upiId: "",
    screenshotDesc: "",
    consent: false,
  });

  const field = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setReferenceId(generateId());
    setStep(3);
    setSubmitting(false);
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <Card className="max-w-lg w-full border-green-200 shadow-md" data-testid="success-card">
          <CardContent className="p-8 text-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Complaint Registered</h2>
            <p className="text-slate-500 text-sm mb-4">Your cybercrime complaint has been received and will be reviewed by the Gurugram Cyber Police.</p>
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-5">
              <p className="text-xs text-green-600 font-medium mb-1">Reference Number</p>
              <p className="text-xl font-bold font-mono text-green-700" data-testid="reference-id">{referenceId}</p>
              <p className="text-xs text-green-600 mt-1">Save this for tracking your complaint</p>
            </div>
            <div className="space-y-3 mb-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-left">
                <p className="text-amber-800 font-semibold text-sm mb-1">Next Steps</p>
                <ul className="text-xs text-amber-700 space-y-1">
                  <li>• Also file on <strong>cybercrime.gov.in</strong> for official record</li>
                  <li>• Contact your bank immediately to block further transactions</li>
                  <li>• Preserve all evidence — do not delete chats or screenshots</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 border border-blue-200 text-blue-600 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-blue-50" data-testid="link-official-portal">
                <ExternalLink className="h-4 w-4" />
                File on cybercrime.gov.in
              </a>
              <a href="tel:1930" className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-green-700" data-testid="link-call-helpline">
                <Phone className="h-4 w-4" />
                Call 1930
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-blue-300" />
            <span className="text-blue-300 text-sm">Report a Cybercrime</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Submit a Complaint</h1>
          <p className="text-blue-200 text-sm mt-1">This goes directly to the Gurugram Cyber Police. We also recommend filing on cybercrime.gov.in for the official national record.</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="max-w-3xl mx-auto px-4 pt-5">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 text-sm">
          <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-amber-700">
            <strong>For emergencies, call 1930 immediately.</strong> Online form submissions may take 24–48 hours to process. If you lost money recently, call 1930 first for faster intervention.
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-3xl mx-auto px-4 pt-5">
        <div className="flex items-center gap-2 mb-6">
          {[{ n: 1, label: "Your Details" }, { n: 2, label: "Incident Details" }].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= s.n ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"}`}>
                {step > s.n ? <CheckCircle className="h-4 w-4" /> : s.n}
              </div>
              <span className={`text-sm ${step === s.n ? "text-blue-700 font-medium" : "text-slate-400"}`}>{s.label}</span>
              {i === 0 && <div className={`h-px w-8 ${step > 1 ? "bg-blue-400" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-10">
        {step === 1 && (
          <Card className="border-slate-200 shadow-sm" data-testid="step-1-form">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">Your Details</CardTitle>
              <p className="text-slate-500 text-xs">Your personal details are kept confidential and used only for follow-up by the investigating officer.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-600 text-sm mb-1.5 block">Full Name *</Label>
                  <Input value={form.name} onChange={(e) => field("name", e.target.value)} placeholder="e.g. Rahul Sharma" className="text-sm" data-testid="input-name" />
                </div>
                <div>
                  <Label className="text-slate-600 text-sm mb-1.5 block">Mobile Number *</Label>
                  <Input value={form.mobile} onChange={(e) => field("mobile", e.target.value)} placeholder="+91 XXXXXXXXXX" className="text-sm" data-testid="input-mobile" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-600 text-sm mb-1.5 block">Email Address</Label>
                  <Input value={form.email} onChange={(e) => field("email", e.target.value)} placeholder="your@email.com" type="email" className="text-sm" data-testid="input-email" />
                </div>
                <div>
                  <Label className="text-slate-600 text-sm mb-1.5 block">Your Locality / Area *</Label>
                  <Select value={form.locality} onValueChange={(v) => field("locality", v)}>
                    <SelectTrigger className="text-sm" data-testid="select-locality">
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCALITIES.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-2">
                <input
                  id="consent"
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => field("consent", e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-blue-600"
                  data-testid="checkbox-consent"
                />
                <label htmlFor="consent" className="text-xs text-slate-500 cursor-pointer">
                  I consent to sharing this information with the Gurugram Cyber Police for investigation purposes.
                </label>
              </div>
              <Button
                onClick={() => setStep(2)}
                disabled={!form.name || !form.mobile || !form.locality || !form.consent}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                data-testid="button-next-step"
              >
                Continue to Incident Details
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="border-slate-200 shadow-sm" data-testid="step-2-form">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">Incident Details</CardTitle>
              <p className="text-slate-500 text-xs">Provide as much detail as possible — this helps investigators act faster.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-600 text-sm mb-1.5 block">Type of Scam *</Label>
                  <Select value={form.scamType} onValueChange={(v) => field("scamType", v)}>
                    <SelectTrigger className="text-sm" data-testid="select-scam-type">
                      <SelectValue placeholder="Select scam type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SCAM_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-slate-600 text-sm mb-1.5 block">How were you contacted?</Label>
                  <Select value={form.channel} onValueChange={(v) => field("channel", v)}>
                    <SelectTrigger className="text-sm" data-testid="select-channel">
                      <SelectValue placeholder="Select channel" />
                    </SelectTrigger>
                    <SelectContent>
                      {CHANNELS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-600 text-sm mb-1.5 block">Date of Incident *</Label>
                  <Input type="date" value={form.date} onChange={(e) => field("date", e.target.value)} className="text-sm" data-testid="input-date" />
                </div>
                <div>
                  <Label className="text-slate-600 text-sm mb-1.5 block">Amount Lost (₹)</Label>
                  <Input type="number" value={form.amount} onChange={(e) => field("amount", e.target.value)} placeholder="e.g. 25000" className="text-sm" data-testid="input-amount" />
                </div>
              </div>
              <div>
                <Label className="text-slate-600 text-sm mb-1.5 block">Fraudster's UPI ID / Phone Number / Profile Link</Label>
                <Input value={form.upiId} onChange={(e) => field("upiId", e.target.value)} placeholder="e.g. fraudster@upi or +91 9876543210" className="text-sm" data-testid="input-upi-id" />
              </div>
              <div>
                <Label className="text-slate-600 text-sm mb-1.5 block">Describe what happened *</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => field("description", e.target.value)}
                  placeholder="Briefly describe how the fraud happened, what was said/sent, and the sequence of events..."
                  rows={4}
                  className="text-sm resize-none"
                  data-testid="textarea-description"
                />
              </div>
              <div>
                <Label className="text-slate-600 text-sm mb-1.5 block">Evidence Available (screenshots, messages, etc.)</Label>
                <Textarea
                  value={form.screenshotDesc}
                  onChange={(e) => field("screenshotDesc", e.target.value)}
                  placeholder="Describe any evidence you have (WhatsApp screenshots, UPI receipts, email threads, etc.)"
                  rows={2}
                  className="text-sm resize-none"
                  data-testid="textarea-evidence"
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-slate-200 text-slate-600">
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || !form.scamType || !form.description}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  data-testid="button-submit"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Submit Complaint
                    </span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
