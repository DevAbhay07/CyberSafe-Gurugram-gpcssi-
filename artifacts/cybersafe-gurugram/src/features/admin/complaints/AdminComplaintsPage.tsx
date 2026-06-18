import { useState, useMemo } from "react";
import { Plus, Upload, Download, Search, Filter } from "lucide-react";
import { mockComplaints, type Complaint } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const SCAM_TYPES = ["All", "UPI Fraud", "QR Code Scam", "Task Fraud", "Sextortion", "Investment Scam", "Job Scam", "Fake KYC", "Electricity Bill Scam", "OTP Fraud", "Social Media Fraud"];
const RISK_LEVELS = ["All", "High", "Medium", "Low"];
const PS_LIST = ["All", "DLF Cyber City PS", "Sohna Road PS", "MG Road PS", "South City PS", "Palam Vihar PS", "Sector 56 PS", "Badshahpur PS", "Manesar PS", "Civil Lines PS", "Sector 14 PS"];
const PAGE_SIZE = 10;

function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function riskBadge(level: string) {
  if (level === "High") return "bg-red-900/40 text-red-400 border-red-800";
  if (level === "Medium") return "bg-amber-900/40 text-amber-400 border-amber-800";
  return "bg-green-900/40 text-green-400 border-green-800";
}

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints as Complaint[]);
  const [search, setSearch] = useState("");
  const [scamFilter, setScamFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [psFilter, setPsFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [showCsv, setShowCsv] = useState(false);

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      if (scamFilter !== "All" && c.scamType !== scamFilter) return false;
      if (riskFilter !== "All" && c.riskLevel !== riskFilter) return false;
      if (psFilter !== "All" && c.policeStation !== psFilter) return false;
      if (search && !c.id.toLowerCase().includes(search.toLowerCase()) && !c.locality.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [complaints, search, scamFilter, riskFilter, psFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5">
      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-slate-200 font-semibold">
          {filtered.length} Complaint{filtered.length !== 1 ? "s" : ""}
        </h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white" onClick={() => setShowCsv(true)} data-testid="button-upload-csv">
            <Upload className="h-4 w-4 mr-1.5" />
            Upload CSV
          </Button>
          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white" data-testid="button-export-csv">
            <Download className="h-4 w-4 mr-1.5" />
            Export
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowAdd(true)} data-testid="button-add-complaint">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Complaint
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-3">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-36">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by ID or locality..."
                className="pl-9 bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-500 text-sm h-9"
                data-testid="input-search-complaints"
              />
            </div>
            <Select value={scamFilter} onValueChange={(v) => { setScamFilter(v); setPage(1); }}>
              <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-slate-300 h-9 text-sm" data-testid="select-scam-type">
                <SelectValue placeholder="Scam Type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                {SCAM_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={(v) => { setRiskFilter(v); setPage(1); }}>
              <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-slate-300 h-9 text-sm" data-testid="select-risk-level">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                {RISK_LEVELS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={psFilter} onValueChange={(v) => { setPsFilter(v); setPage(1); }}>
              <SelectTrigger className="w-44 bg-slate-700 border-slate-600 text-slate-300 h-9 text-sm" data-testid="select-police-station">
                <SelectValue placeholder="Police Station" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                {PS_LIST.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs" data-testid="complaints-table">
              <thead>
                <tr className="border-b border-slate-700">
                  {["ID", "Date", "Police Station", "Locality", "Scam Type", "Channel", "Amount", "Age", "Gender", "Risk"].map((h) => (
                    <th key={h} className="text-left text-slate-500 font-medium px-3 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center text-slate-500 py-10">No complaints match the current filters</td>
                  </tr>
                ) : paginated.map((c) => (
                  <tr key={c.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors" data-testid={`complaint-row-${c.id}`}>
                    <td className="px-3 py-2.5 text-slate-400 font-mono">{c.id}</td>
                    <td className="px-3 py-2.5 text-slate-300 whitespace-nowrap">{c.date}</td>
                    <td className="px-3 py-2.5 text-slate-300 whitespace-nowrap">{c.policeStation}</td>
                    <td className="px-3 py-2.5 text-slate-300">{c.locality}</td>
                    <td className="px-3 py-2.5 text-slate-300 whitespace-nowrap">{c.scamType}</td>
                    <td className="px-3 py-2.5 text-slate-300">{c.channel}</td>
                    <td className="px-3 py-2.5 text-slate-300 font-medium whitespace-nowrap">{formatCurrency(c.amount)}</td>
                    <td className="px-3 py-2.5 text-slate-300">{c.ageBand}</td>
                    <td className="px-3 py-2.5 text-slate-300">{c.gender}</td>
                    <td className="px-3 py-2.5">
                      <Badge className={`${riskBadge(c.riskLevel)} border text-xs`}>{c.riskLevel}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700">
              <p className="text-slate-500 text-xs">Page {page} of {totalPages} ({filtered.length} total)</p>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="h-7 px-2 text-slate-400 hover:text-white disabled:opacity-30" data-testid="button-prev-page">
                  Prev
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                  return (
                    <Button key={p} size="sm" variant={p === page ? "default" : "ghost"} onClick={() => setPage(p)} className={`h-7 w-7 p-0 text-xs ${p === page ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`} data-testid={`button-page-${p}`}>
                      {p}
                    </Button>
                  );
                })}
                <Button size="sm" variant="ghost" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="h-7 px-2 text-slate-400 hover:text-white disabled:opacity-30" data-testid="button-next-page">
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Complaint Modal */}
      <AddComplaintDialog open={showAdd} onClose={() => setShowAdd(false)} onAdd={(c) => setComplaints(prev => [c, ...prev])} />

      {/* CSV Upload Modal */}
      <Dialog open={showCsv} onOpenChange={setShowCsv}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-200">
          <DialogHeader>
            <DialogTitle className="text-slate-100">Upload CSV</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer" data-testid="csv-drop-zone">
              <Upload className="h-8 w-8 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-300 text-sm font-medium">Drop CSV file here or click to browse</p>
              <p className="text-slate-500 text-xs mt-1">Columns: date, scamType, policeStation, locality, channel, amount, ageBand, gender</p>
              <Input type="file" accept=".csv" className="mt-3 bg-slate-700 border-slate-600 text-slate-300 text-xs" data-testid="input-csv-file" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowCsv(false)} className="text-slate-400">Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-import-csv">Import</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddComplaintDialog({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (c: Complaint) => void }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    scamType: "UPI Fraud",
    policeStation: "DLF Cyber City PS",
    locality: "Cyber City",
    channel: "UPI",
    amount: "",
    ageBand: "31-45",
    gender: "Male",
    riskLevel: "Medium",
  });

  const field = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = () => {
    const newC: Complaint = {
      id: `CYB-2024-${Date.now().toString().slice(-4)}`,
      date: form.date,
      policeStation: form.policeStation,
      locality: form.locality,
      scamType: form.scamType as Complaint["scamType"],
      channel: form.channel as Complaint["channel"],
      amount: Number(form.amount) || 0,
      ageBand: form.ageBand as Complaint["ageBand"],
      gender: form.gender as Complaint["gender"],
      riskLevel: form.riskLevel as Complaint["riskLevel"],
    };
    onAdd(newC);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-slate-200 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-slate-100">Add New Complaint</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div>
            <Label className="text-slate-400 text-xs">Date</Label>
            <Input type="date" value={form.date} onChange={(e) => field("date", e.target.value)} className="bg-slate-700 border-slate-600 text-slate-200 text-sm mt-1" data-testid="input-complaint-date" />
          </div>
          <div>
            <Label className="text-slate-400 text-xs">Amount (₹)</Label>
            <Input type="number" value={form.amount} onChange={(e) => field("amount", e.target.value)} placeholder="e.g. 50000" className="bg-slate-700 border-slate-600 text-slate-200 text-sm mt-1" data-testid="input-complaint-amount" />
          </div>
          <div>
            <Label className="text-slate-400 text-xs">Scam Type</Label>
            <Select value={form.scamType} onValueChange={(v) => field("scamType", v)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-300 text-sm mt-1" data-testid="select-complaint-scam-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                {SCAM_TYPES.filter((t) => t !== "All").map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-slate-400 text-xs">Channel</Label>
            <Select value={form.channel} onValueChange={(v) => field("channel", v)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-300 text-sm mt-1" data-testid="select-complaint-channel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                {["UPI", "QR Code", "Social Media", "OTP", "Card", "Phone Call", "Other"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-slate-400 text-xs">Locality</Label>
            <Input value={form.locality} onChange={(e) => field("locality", e.target.value)} className="bg-slate-700 border-slate-600 text-slate-200 text-sm mt-1" data-testid="input-complaint-locality" />
          </div>
          <div>
            <Label className="text-slate-400 text-xs">Police Station</Label>
            <Select value={form.policeStation} onValueChange={(v) => field("policeStation", v)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-300 text-sm mt-1" data-testid="select-complaint-ps">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                {PS_LIST.filter((p) => p !== "All").map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-slate-400 text-xs">Age Band</Label>
            <Select value={form.ageBand} onValueChange={(v) => field("ageBand", v)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-300 text-sm mt-1" data-testid="select-complaint-age">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                {["18-30", "31-45", "46-60", "60+"].map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-slate-400 text-xs">Gender</Label>
            <Select value={form.gender} onValueChange={(v) => field("gender", v)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-300 text-sm mt-1" data-testid="select-complaint-gender">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                {["Male", "Female", "Other"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label className="text-slate-400 text-xs">Risk Level</Label>
            <Select value={form.riskLevel} onValueChange={(v) => field("riskLevel", v)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-300 text-sm mt-1" data-testid="select-complaint-risk">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                {["High", "Medium", "Low"].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={onClose} className="text-slate-400">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-submit-complaint">Submit Complaint</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
