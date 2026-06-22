/**
 * src/features/public/ComplaintTrackPage.tsx
 *
 * Citizen-facing complaint tracking page.
 * Accepts a reference ID (e.g. CYB-2024-1234) and shows a mock status timeline.
 *
 * IMPORTANT: This is a demo/mock feature. Status is deterministically derived
 * from the reference ID so the same ID always shows the same stage. In a real
 * system, this would query an actual case management database.
 */

import { useState, type FormEvent } from "react";
import { Link } from "wouter";
import {
  Search,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  ChevronRight,
  ArrowLeft,
  Info,
} from "lucide-react";
import { api } from "@/lib/api";
import {
  COMPLAINT_STATUS_STAGES,
  type ComplaintStatus,
} from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ─── Stage icon helper ────────────────────────────────────────────────────────

function StageIcon({
  index,
  activeIndex,
}: {
  index: number;
  activeIndex: number;
}) {
  if (index < activeIndex) {
    return (
      <div className="h-8 w-8 rounded-full bg-green-900/50 border-2 border-green-500 flex items-center justify-center flex-shrink-0">
        <CheckCircle2 className="h-4 w-4 text-green-400" />
      </div>
    );
  }
  if (index === activeIndex) {
    return (
      <div className="h-8 w-8 rounded-full bg-blue-900/50 border-2 border-blue-400 flex items-center justify-center flex-shrink-0 ring-4 ring-blue-900/30">
        <Clock className="h-4 w-4 text-blue-400" />
      </div>
    );
  }
  return (
    <div className="h-8 w-8 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center flex-shrink-0">
      <Circle className="h-4 w-4 text-slate-600" />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ComplaintTrackPage() {
  const [refId, setRefId] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<ComplaintStatus | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!refId.trim()) return;

    setLoading(true);
    setNotFound(false);
    setStatus(null);

    try {
      const result = await api.getComplaintStatus(refId);
      if (result) {
        setStatus(result);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-blue-300 text-sm hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-white">
            Track Your Complaint
          </h1>
          <p className="text-blue-200 text-sm mt-1">
            Enter your reference ID to check the current status of your
            cybercrime complaint.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Demo banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-800 font-semibold text-sm">
              Demo / Mock Feature
            </p>
            <p className="text-amber-700 text-xs mt-0.5 leading-relaxed">
              This tracking feature uses simulated data for demonstration
              purposes. Status is derived algorithmically from your reference ID
              and does <strong>not</strong> reflect a real investigation system.
              For actual case status, contact your nearest police station or call{" "}
              <strong>1930</strong>.
            </p>
          </div>
        </div>

        {/* Search form */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Search className="h-4 w-4 text-blue-500" />
              Enter Reference ID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                id="track-ref-input"
                value={refId}
                onChange={(e) => setRefId(e.target.value.toUpperCase())}
                placeholder="e.g. CYB-2024-1234"
                className="flex-1 font-mono text-sm"
                data-testid="input-reference-id"
              />
              <Button
                type="submit"
                disabled={loading || !refId.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                data-testid="button-track"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Searching…
                  </span>
                ) : (
                  "Track"
                )}
              </Button>
            </form>
            <p className="text-slate-400 text-xs mt-2">
              Your reference ID was shown after submitting your complaint on the{" "}
              <Link href="/report" className="text-blue-500 hover:underline">
                Report a Crime
              </Link>{" "}
              page.
            </p>
          </CardContent>
        </Card>

        {/* Not found state */}
        {hasSearched && notFound && (
          <Card className="border-red-200 bg-red-50 shadow-sm" data-testid="track-not-found">
            <CardContent className="p-6 text-center">
              <Info className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-700 font-semibold text-sm">
                Reference ID not found
              </p>
              <p className="text-red-500 text-xs mt-1">
                Please check the ID and try again. Valid formats:{" "}
                <code className="bg-red-100 px-1 rounded">CYB-2024-XXXX</code>{" "}
                or{" "}
                <code className="bg-red-100 px-1 rounded">CMP-XXXXXXX</code>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Status result */}
        {status && (
          <div className="space-y-4" data-testid="track-result">
            {/* Summary card */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Reference ID</p>
                    <p className="text-xl font-bold font-mono text-slate-900">
                      {status.referenceId}
                    </p>
                  </div>
                  <Badge
                    className={`text-xs border flex-shrink-0 ${
                      status.currentStage === "Closed"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : status.currentStage === "In Investigation"
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : "bg-amber-100 text-amber-700 border-amber-200"
                    }`}
                  >
                    {status.currentStage}
                  </Badge>
                </div>
                <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
                  <p className="text-blue-800 text-xs leading-relaxed">
                    {status.note}
                  </p>
                </div>
                <p className="text-slate-400 text-xs mt-2">
                  Last updated: {status.updatedAt}
                </p>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-900">
                  Case Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-200" />

                  <div className="space-y-6">
                    {COMPLAINT_STATUS_STAGES.map((stage, index) => {
                      const isActive = index === status.stageIndex;
                      const isDone = index < status.stageIndex;
                      return (
                        <div key={stage} className="flex items-start gap-4 relative">
                          <StageIcon
                            index={index}
                            activeIndex={status.stageIndex}
                          />
                          <div className="pt-1">
                            <p
                              className={`text-sm font-medium ${
                                isActive
                                  ? "text-blue-700"
                                  : isDone
                                  ? "text-green-700"
                                  : "text-slate-400"
                              }`}
                            >
                              {stage}
                            </p>
                            {isActive && (
                              <p className="text-xs text-slate-500 mt-0.5">
                                Current status
                              </p>
                            )}
                            {isDone && (
                              <p className="text-xs text-green-600 mt-0.5">
                                Completed
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/report"
                className="flex-1 flex items-center justify-center gap-1.5 border border-blue-200 text-blue-600 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
                File Another Complaint
              </Link>
              <a
                href="tel:1930"
                className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors"
              >
                Call 1930 for Assistance
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
