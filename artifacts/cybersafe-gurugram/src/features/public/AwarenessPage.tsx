import { AlertTriangle, CheckCircle, Shield, Smartphone, QrCode, Briefcase, Camera, TrendingUp, MapPin, CreditCard, Zap, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const scams = [
  {
    icon: Smartphone,
    title: "UPI Fraud",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    desc: "Fraudsters trick victims into entering UPI PIN to 'receive' money, or send fake collect requests posing as refund agents or bank officials.",
    redFlags: [
      "Asked to enter UPI PIN to receive a refund or prize",
      "Collect request from unknown contact",
      "Urgent pressure to complete transfer immediately",
      "Caller claims to be from bank or government",
    ],
    steps: [
      "Do NOT enter PIN for receiving money",
      "Call 1930 immediately if money debited",
      "Report at cybercrime.gov.in within 24 hours",
      "Preserve all SMS, call logs, and screenshots",
    ],
  },
  {
    icon: QrCode,
    title: "QR Code Scam",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
    desc: "Fraudsters send QR codes claiming they initiate payment to you. Scanning the code actually debits money from your account.",
    redFlags: [
      "Buyer/seller sends QR code to 'pay' you",
      "QR received via WhatsApp from unknown number",
      "Asked to scan code multiple times 'for verification'",
      "Amount is larger than expected as 'bonus'",
    ],
    steps: [
      "Never scan a QR code to receive money",
      "QR codes ONLY debit, they cannot credit",
      "Verify all transactions in your bank app",
      "Report to 1930 and cybercrime.gov.in",
    ],
  },
  {
    icon: Briefcase,
    title: "Work-from-Home / Task Fraud",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    desc: "Victims are paid small initial amounts for simple tasks (liking videos, rating apps) to build trust, then larger deposits are demanded to unlock earnings.",
    redFlags: [
      "Job offer via WhatsApp or Telegram with no interview",
      "Tasks involve liking videos, rating apps, or writing reviews",
      "Early small payments to build trust",
      "Deposits required to 'unlock' higher commissions",
    ],
    steps: [
      "Stop all payments immediately",
      "Do not deposit more money regardless of promises",
      "Screenshot all conversations and receipts",
      "Report to 1930 and cybercrime.gov.in",
    ],
  },
  {
    icon: Camera,
    title: "Sextortion",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-100",
    desc: "Fraudsters use fake profiles to initiate video calls, secretly record intimate moments, then blackmail victims for money with threats to share recordings.",
    redFlags: [
      "Unknown attractive person initiates video call",
      "Call becomes intimate very quickly",
      "Message received with screenshot demanding payment",
      "Threats to share video with family or employer",
    ],
    steps: [
      "Do NOT pay — payment leads to more demands",
      "Block the contact immediately on all platforms",
      "Report to cybercrime.gov.in and local cyber police",
      "Inform trusted family members proactively",
    ],
  },
  {
    icon: TrendingUp,
    title: "Investment Scam",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-100",
    desc: "Fake trading platforms or WhatsApp investment groups promise 30-50% monthly returns, backed by fabricated profit screenshots and fake expert testimonials.",
    redFlags: [
      "Guaranteed returns (no investment is guaranteed)",
      "Profits visible on platform but withdrawals blocked",
      "WhatsApp group with experts showing huge profits",
      "More deposits needed to 'clear tax' or 'verification'",
    ],
    steps: [
      "Verify platforms on SEBI website before investing",
      "Never invest based on social media tips",
      "Report to 1930 before attempting to withdraw",
      "File complaint with all transaction details",
    ],
  },
  {
    icon: MapPin,
    title: "Job Scam",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-100",
    desc: "Fake job offers for high-paying positions in India or abroad, demanding registration fees, security deposits, or document processing charges upfront.",
    redFlags: [
      "Job offer via SMS/WhatsApp with no application",
      "Salary unusually high for the position",
      "Requests for registration fee or security deposit",
      "Foreign job with very fast visa processing claims",
    ],
    steps: [
      "Verify company on MCA21 portal before paying",
      "Legitimate companies never charge candidates",
      "Report fake job portals to cybercrime.gov.in",
      "Call 1930 if money already paid",
    ],
  },
  {
    icon: CreditCard,
    title: "Fake KYC Fraud",
    color: "text-slate-700",
    bg: "bg-slate-50",
    border: "border-slate-100",
    desc: "Fraudsters pose as bank or telecom officials claiming KYC update is overdue and account/SIM will be blocked unless completed immediately by sharing OTP or documents.",
    redFlags: [
      "Unsolicited call about expired bank or SIM KYC",
      "Requests to share Aadhaar/PAN via WhatsApp",
      "OTP requested for 'KYC verification'",
      "Link sent to update personal and banking details",
    ],
    steps: [
      "Banks never ask for OTP over phone",
      "Visit bank branch or official website for KYC",
      "Do not click any KYC link via SMS/WhatsApp",
      "Report to 1930 if information was shared",
    ],
  },
  {
    icon: Zap,
    title: "Electricity Bill Scam",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-100",
    desc: "Fraudsters impersonate DHBVN/UHBVN officials threatening immediate power disconnection unless overdue bills are paid via a link sent by SMS or WhatsApp.",
    redFlags: [
      "SMS about electricity disconnection within hours",
      "Payment link sent via SMS or WhatsApp",
      "Threat of immediate disconnection",
      "Caller ID appears as helpline number",
    ],
    steps: [
      "Check bill on official DHBVN website or app",
      "Never pay via links received on WhatsApp/SMS",
      "Call DHBVN official helpline to verify",
      "Report to 1930 if money was transferred",
    ],
  },
  {
    icon: MessageCircle,
    title: "OTP Fraud",
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-100",
    desc: "Fraudsters pose as bank officials or government representatives and trick victims into sharing OTPs received on their phone to process a fake refund or verify account.",
    redFlags: [
      "Unexpected OTP received without any action from you",
      "Caller asks for OTP to 'process refund'",
      "Claims account will be blocked without OTP",
      "Urgency and countdown pressure",
    ],
    steps: [
      "NEVER share OTP with anyone, ever",
      "Hang up immediately if asked for OTP",
      "Report to bank and 1930 immediately",
      "Change all banking passwords and PINs",
    ],
  },
];

export default function AwarenessPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-blue-300" />
            <span className="text-blue-300 text-sm font-medium">Stay Informed, Stay Safe</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Cyber Fraud Awareness</h1>
          <p className="text-blue-200 max-w-2xl">
            Know the tactics, recognize the warning signs, and take the right action. Information is your best defense against cybercrime.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {scams.map((scam) => (
            <Card key={scam.title} className={`border ${scam.border} bg-white shadow-sm hover:shadow-md transition-shadow`} data-testid={`awareness-card-${scam.title.toLowerCase().replace(/\s+\/\s+/g, "-").replace(/\s+/g, "-")}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 ${scam.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <scam.icon className={`h-5 w-5 ${scam.color}`} />
                  </div>
                  <CardTitle className="text-base font-semibold text-slate-900 leading-tight pt-1">{scam.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">{scam.desc}</p>

                <div>
                  <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Red Flags
                  </p>
                  <ul className="space-y-1">
                    {scam.redFlags.map((flag) => (
                      <li key={flag} className="text-xs text-slate-600 flex items-start gap-1.5">
                        <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Do This Immediately
                  </p>
                  <ol className="space-y-1">
                    {scam.steps.map((step, i) => (
                      <li key={step} className="text-xs text-slate-600 flex items-start gap-1.5">
                        <Badge className="h-4 w-4 text-xs p-0 flex items-center justify-center bg-green-100 text-green-700 border-0 flex-shrink-0 rounded-full mt-0.5">{i + 1}</Badge>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 bg-green-700 rounded-xl p-6 text-center text-white">
          <p className="font-bold text-lg mb-1">Fell victim to cybercrime?</p>
          <p className="text-green-200 text-sm mb-4">Act fast — every hour matters. Quick reporting significantly improves recovery chances.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:1930" className="inline-flex items-center justify-center gap-2 bg-white text-green-700 font-bold px-6 py-2.5 rounded-lg hover:bg-green-50 text-sm" data-testid="link-awareness-1930">
              Call 1930 Now
            </a>
            <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 border border-green-400 text-white px-6 py-2.5 rounded-lg hover:bg-green-600 text-sm" data-testid="link-awareness-portal">
              Report Online
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
