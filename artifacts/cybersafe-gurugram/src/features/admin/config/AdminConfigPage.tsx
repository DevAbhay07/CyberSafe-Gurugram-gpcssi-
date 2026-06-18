import { useState } from "react";
import { Save, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const SCAM_TYPES = ["UPI Fraud", "QR Code Scam", "Task Fraud", "Sextortion", "Investment Scam", "Job Scam", "Fake KYC", "Electricity Bill Scam", "OTP Fraud", "Social Media Fraud"];

const defaultPlaybooks: Record<string, { description: string; redFlags: string; steps: string }> = {
  "UPI Fraud": {
    description: "Scammers trick victims into entering their UPI PIN to 'receive' money.",
    redFlags: "Asked to enter PIN to receive money\nUnknown payment requests\nUrgency or threats",
    steps: "Do not enter PIN\nDecline the request\nReport VPA to bank\nCall 1930",
  },
  "QR Code Scam": {
    description: "Scammers send QR codes claiming they pay the victim, but scanning debits the victim's account.",
    redFlags: "Asked to scan QR to receive funds\nUnverified QR codes",
    steps: "Never scan QR to receive money\nVerify merchant before paying\nReport to 1930",
  },
};

export default function AdminConfigPage() {
  const [thresholds, setThresholds] = useState({ highRiskComplaintCount: 150, highRiskLossAmount: 5000000 });
  const [thresholdSaved, setThresholdSaved] = useState(false);
  const [selectedScam, setSelectedScam] = useState("UPI Fraud");
  const [playbookSaved, setPlaybookSaved] = useState(false);
  const [playbooks, setPlaybooks] = useState(defaultPlaybooks);

  const currentPlaybook = playbooks[selectedScam] || { description: "", redFlags: "", steps: "" };

  const saveThresholds = () => {
    setThresholdSaved(true);
    setTimeout(() => setThresholdSaved(false), 2500);
  };

  const savePlaybook = () => {
    setPlaybookSaved(true);
    setTimeout(() => setPlaybookSaved(false), 2500);
  };

  const updatePlaybookField = (field: string, value: string) => {
    setPlaybooks((prev) => ({
      ...prev,
      [selectedScam]: { ...prev[selectedScam], [field]: value },
    }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Risk Thresholds */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-slate-200 text-sm font-semibold">Risk Score Thresholds</CardTitle>
          <p className="text-slate-500 text-xs">Configure when areas are classified as high or medium risk</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-400 text-xs mb-1.5 block">
                High-Risk Complaint Count
                <Badge className="ml-2 bg-red-900/40 text-red-400 border-red-800 border text-xs">High = above this</Badge>
              </Label>
              <Input
                type="number"
                value={thresholds.highRiskComplaintCount}
                onChange={(e) => setThresholds((t) => ({ ...t, highRiskComplaintCount: Number(e.target.value) }))}
                className="bg-slate-700 border-slate-600 text-slate-200 text-sm"
                data-testid="input-high-risk-count"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs mb-1.5 block">
                High-Risk Loss Amount (₹)
                <Badge className="ml-2 bg-red-900/40 text-red-400 border-red-800 border text-xs">High = above this</Badge>
              </Label>
              <Input
                type="number"
                value={thresholds.highRiskLossAmount}
                onChange={(e) => setThresholds((t) => ({ ...t, highRiskLossAmount: Number(e.target.value) }))}
                className="bg-slate-700 border-slate-600 text-slate-200 text-sm"
                data-testid="input-high-risk-loss"
              />
            </div>
          </div>
          <div className="bg-slate-700/40 rounded-lg p-3 text-xs text-slate-400">
            <p>Current settings: Areas with more than <span className="text-white font-medium">{thresholds.highRiskComplaintCount}</span> complaints or losses over <span className="text-white font-medium">₹{thresholds.highRiskLossAmount.toLocaleString("en-IN")}</span> will be flagged as High Risk.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={saveThresholds} className="bg-blue-600 hover:bg-blue-700 text-white text-sm" data-testid="button-save-thresholds">
              <Save className="h-4 w-4 mr-1.5" />
              Save Thresholds
            </Button>
            {thresholdSaved && (
              <span className="text-green-400 text-sm flex items-center gap-1.5" data-testid="threshold-saved-msg">
                <CheckCircle className="h-4 w-4" /> Saved successfully
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Scam Playbooks */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-slate-200 text-sm font-semibold">Scam Playbooks</CardTitle>
          <p className="text-slate-500 text-xs">Manage awareness content and red flags per scam type. Shown to citizens when they click a scam type.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-400 text-xs mb-1.5 block">Select Scam Type</Label>
            <Select value={selectedScam} onValueChange={setSelectedScam}>
              <SelectTrigger className="w-60 bg-slate-700 border-slate-600 text-slate-300 text-sm" data-testid="select-playbook-scam-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                {SCAM_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-400 text-xs mb-1.5 block">Short Description</Label>
            <Textarea
              value={currentPlaybook.description}
              onChange={(e) => updatePlaybookField("description", e.target.value)}
              className="bg-slate-700 border-slate-600 text-slate-200 text-sm resize-none"
              rows={3}
              placeholder="Brief description of the scam modus operandi..."
              data-testid="textarea-playbook-description"
            />
          </div>

          <div>
            <Label className="text-slate-400 text-xs mb-1.5 block">Red Flags (one per line)</Label>
            <Textarea
              value={currentPlaybook.redFlags}
              onChange={(e) => updatePlaybookField("redFlags", e.target.value)}
              className="bg-slate-700 border-slate-600 text-slate-200 text-sm resize-none"
              rows={4}
              placeholder="Enter red flags, one per line..."
              data-testid="textarea-playbook-red-flags"
            />
          </div>

          <div>
            <Label className="text-slate-400 text-xs mb-1.5 block">Recommended Steps (one per line)</Label>
            <Textarea
              value={currentPlaybook.steps}
              onChange={(e) => updatePlaybookField("steps", e.target.value)}
              className="bg-slate-700 border-slate-600 text-slate-200 text-sm resize-none"
              rows={4}
              placeholder="Enter recommended steps, one per line..."
              data-testid="textarea-playbook-steps"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={savePlaybook} className="bg-blue-600 hover:bg-blue-700 text-white text-sm" data-testid="button-save-playbook">
              <Save className="h-4 w-4 mr-1.5" />
              Save Playbook
            </Button>
            {playbookSaved && (
              <span className="text-green-400 text-sm flex items-center gap-1.5" data-testid="playbook-saved-msg">
                <CheckCircle className="h-4 w-4" /> Saved successfully
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
