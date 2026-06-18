import { Phone, Globe, Camera, Building2, CheckCircle, ExternalLink, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    number: 1,
    icon: Phone,
    title: "Call 1930 Helpline Immediately",
    desc: "The National Cybercrime Helpline is available 24/7. Calling immediately increases the chances of blocking fraudulent transactions and recovering funds.",
    color: "bg-green-600",
    tips: [
      "Call within minutes of noticing the fraud",
      "Keep your bank account number and transaction details handy",
      "Note down the complaint reference number given",
      "Available in Hindi and English",
    ],
    link: { label: "Call 1930", href: "tel:1930" },
  },
  {
    number: 2,
    icon: Globe,
    title: "File a Report on cybercrime.gov.in",
    desc: "Register your complaint on the National Cybercrime Reporting Portal for official record-keeping and investigation. This creates a legal trail.",
    color: "bg-blue-600",
    tips: [
      "Register with your Aadhaar-linked mobile number",
      "Fill all details accurately — location, time, scam type, amount",
      "You can track your complaint status online",
      "Reports are directly assigned to Cyber Police Stations",
    ],
    link: { label: "Go to cybercrime.gov.in", href: "https://cybercrime.gov.in", external: true },
  },
  {
    number: 3,
    icon: Camera,
    title: "Preserve All Evidence",
    desc: "Do not delete any messages, calls, or screenshots. Evidence is critical for investigation and may help in fund recovery or prosecution.",
    color: "bg-purple-600",
    tips: [
      "Take screenshots of conversations, payment confirmations, and profiles",
      "Save all SMS messages — do not delete",
      "Note the date, time, and mode of fraud",
      "Preserve bank transaction records and any links received",
    ],
    link: null,
  },
  {
    number: 4,
    icon: Building2,
    title: "Visit Local Cyber Police Station",
    desc: "For serious fraud cases, visit the Gurugram Cyber Police Station to file an FIR. Bring all evidence in print and digital form.",
    color: "bg-orange-600",
    tips: [
      "Gurugram Cyber Crime Police Station: Sector 14, Gurugram",
      "Bring original screenshots and transaction records",
      "Carry Aadhaar card and bank documents",
      "FIR registration is free — no charges",
    ],
    link: null,
  },
];

const doNots = [
  "Do not pay any more money to 'recover' lost funds",
  "Do not engage further with the fraudster",
  "Do not share OTP, PIN, or passwords with anyone claiming to help",
  "Do not delete any messages or call records",
  "Do not accept UPI payment links from unknown contacts",
];

export default function HowToReportPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-blue-300" />
            <span className="text-blue-300 text-sm font-medium">Act Fast — Every Minute Counts</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">How to Report Cybercrime</h1>
          <p className="text-blue-200 max-w-2xl">
            If you have been a victim of cybercrime, follow these steps immediately. Prompt reporting significantly improves the chances of fund recovery and prosecution.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-800 font-semibold text-sm">Time is critical</p>
            <p className="text-amber-700 text-sm">Financial fraud reported within the first hour has a significantly higher rate of fund freezing and recovery. Do not wait.</p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, idx) => (
            <Card key={step.number} className="border-slate-200 bg-white shadow-sm" data-testid={`step-${step.number}`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`h-10 w-10 ${step.color} rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                    {step.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h2 className="font-bold text-slate-900 text-base">{step.title}</h2>
                      {step.link && (
                        <a
                          href={step.link.href}
                          target={step.link.href.startsWith("http") ? "_blank" : undefined}
                          rel={step.link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          data-testid={`link-step-${step.number}`}
                          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
                        >
                          {step.link.label}
                          {step.link.href.startsWith("http") && <ExternalLink className="h-3 w-3" />}
                        </a>
                      )}
                    </div>
                    <p className="text-slate-600 text-sm mb-3 leading-relaxed">{step.desc}</p>
                    <ul className="space-y-1.5">
                      {step.tips.map((tip) => (
                        <li key={tip} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex items-center mt-4 ml-14">
                    <div className="h-6 w-px bg-slate-200 ml-0.5" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Do nots */}
        <Card className="border-red-100 bg-red-50 shadow-sm">
          <CardContent className="p-5">
            <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              What NOT to Do After Being Scammed
            </h3>
            <ul className="space-y-2">
              {doNots.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-red-700">
                  <span className="text-red-500 font-bold mt-0.5 flex-shrink-0">✕</span>
                  {d}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Helpline */}
        <div className="bg-green-700 rounded-xl p-6 text-center text-white">
          <p className="font-bold text-xl mb-1">1930</p>
          <p className="text-green-200 text-sm mb-4">National Cybercrime Helpline — 24/7, Free of Charge</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:1930" data-testid="link-helpline-1930" className="inline-flex items-center justify-center gap-2 bg-white text-green-700 font-bold px-8 py-3 rounded-lg hover:bg-green-50 text-sm">
              <Phone className="h-4 w-4" />
              Call 1930 Now
            </a>
            <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" data-testid="link-report-portal" className="inline-flex items-center justify-center gap-2 border border-green-400 text-white px-8 py-3 rounded-lg hover:bg-green-600 text-sm">
              <Globe className="h-4 w-4" />
              Report Online
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
