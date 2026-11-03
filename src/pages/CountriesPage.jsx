import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { surfaces } from '../lib/surfaces';
import {
  MapPin,
  CheckCircle2,
  Euro,
  FileCheck,
  Building,
  ArrowRight,
  Globe2,
  Clock,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

const COUNTRIES_DATA = [
  {
    id: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    hub: 'Berlin, Munich, Hamburg',
    visaType: 'EU Blue Card / Opportunity Card (Chancenkarte)',
    salaryFloor: '€45,300 gross / year',
    shortageFloor: '€41,041 (Shortage / STEM roles)',
    prTimeline: '21 months with B1 German (or 27 months with A1)',
    highlights: [
      'Degree recognition via anabin or ZAB statement of comparability',
      'No labor market priority test for Blue Card eligible roles',
      'Spouses receive unrestricted working rights immediately',
      'Option to switch jobs after 12 months with notification to Ausländerbehörde',
    ],
    inDemand: ['Full Stack Engineers', 'Cloud Architects', 'DevOps', 'Data Engineers', 'Embedded Systems'],
  },
  {
    id: 'netherlands',
    name: 'Netherlands',
    flag: '🇳🇱',
    hub: 'Amsterdam, Rotterdam, Eindhoven (Brainport)',
    visaType: 'Highly Skilled Migrant (Kennismigrant)',
    salaryFloor: '€4,233 / month (>30 yrs) or €3,104 / month (<30 yrs)',
    shortageFloor: '30% Tax Ruling eligibility for incoming specialists',
    prTimeline: '5 years continuous legal residence',
    highlights: [
      'Employer must be registered as an IND-recognized sponsor',
      'Fast-track 2-week processing for certified sponsors',
      'World-class English proficiency in both tech and daily life',
      'Search year visa (Zoekjaar) available for top global university graduates',
    ],
    inDemand: ['React/TypeScript', 'Kubernetes/SRE', 'Rust/Go Engineers', 'AI/ML Researchers'],
  },
  {
    id: 'sweden',
    name: 'Sweden',
    flag: '🇸🇪',
    hub: 'Stockholm, Gothenburg, Malmö',
    visaType: 'Swedish Work Permit (Arbetstillstånd)',
    salaryFloor: '27,360 SEK / month (approx. €2,400/mo)',
    shortageFloor: 'Must align with Swedish collective bargaining union standards',
    prTimeline: '4 years within a 7-year period',
    highlights: [
      'Employer must advertise role on EU EURES portal for 10 days',
      'Comprehensive occupational pension & health insurance mandatory',
      'Vibrant startup unicorn hub (Spotify, Klarna, King, Einride)',
      'High standard of living and generous parental leave',
    ],
    inDemand: ['Distributed Systems', 'Security Engineers', 'Mobile Developers', 'Hardware/Robotics'],
  },
  {
    id: 'france',
    name: 'France',
    flag: '🇫🇷',
    hub: 'Paris (Station F), Lyon, Toulouse',
    visaType: 'Passeport Talent (Salarié Qualifié / Entreprise Innovante)',
    salaryFloor: '€42,406 gross / year (2x French minimum wage SMIC)',
    shortageFloor: 'French Tech Visa accelerated pathway for eligible startups',
    prTimeline: '5 years continuous residence',
    highlights: [
      'Multi-year residency permit valid up to 4 years from first entry',
      'Simplified family reunification with automatic work authorization for spouses',
      'Station F: World’s largest startup campus and European AI hub',
      'Significant French state tax credits for R&D engineers',
    ],
    inDemand: ['Python/PyTorch', 'Backend Microservices', 'Data Scientists', 'Cybersecurity'],
  },
  {
    id: 'ireland',
    name: 'Ireland',
    flag: '🇮🇪',
    hub: 'Dublin (Silicon Docks), Cork, Galway',
    visaType: 'Critical Skills Employment Permit (CSEP)',
    salaryFloor: '€38,000 (Critical Skills List) or €64,000 (All occupations)',
    shortageFloor: 'Fast-track Stamp 4 permanent residency after 2 years',
    prTimeline: '2 years to Stamp 4; 5 years to Irish citizenship',
    highlights: [
      'Native English-speaking European tech hub',
      'European headquarters for Stripe, Google, Meta, Apple, AWS',
      'Immediate spousal work rights on Stamp 1G',
      'Pathway to EU passport and Freedom of Movement',
    ],
    inDemand: ['Site Reliability Engineers', 'FinTech Leads', 'Cloud Architects', 'Full Stack'],
  },
];

export default function CountriesPage() {
  const [activeTab, setActiveTab] = useState('germany');

  const selectedCountry = COUNTRIES_DATA.find((c) => c.id === activeTab) || COUNTRIES_DATA[0];

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-900 selection:text-white flex flex-col justify-between">
      <div className="fixed inset-0 pointer-events-none bg-grid-subtle opacity-70 z-0" />

      <div>
        <Navbar />

        <main className="relative z-10 mx-auto max-w-5xl px-4 pt-12 pb-20 space-y-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-semibold text-zinc-700 shadow-sm">
              <Globe2 className="h-3.5 w-3.5 text-zinc-900" />
              <span>European Mobility Guides</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-950">
              European Country Guides & Visa Thresholds
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl mx-auto">
              Clear, practical rules on Blue Cards, minimum salary floors, degree verification, and work authorizations across key European tech destinations.
            </p>
          </div>

          {/* Country Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {COUNTRIES_DATA.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveTab(c.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition ${
                  activeTab === c.id
                    ? 'bg-zinc-900 text-white shadow-sm'
                    : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>

          {/* Active Country Detail Card */}
          <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-10 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedCountry.flag}</span>
                <div>
                  <h2 className="text-2xl font-bold text-zinc-950">{selectedCountry.name} Tech Relocation</h2>
                  <p className="text-xs sm:text-sm text-zinc-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Primary Hubs: {selectedCountry.hub}</span>
                  </p>
                </div>
              </div>

              <a
                href={surfaces.candidateRegister()}
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition self-start sm:self-auto"
              >
                <span>Check Eligibility for {selectedCountry.name}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Primary Visa Route</span>
                <div className="text-sm font-semibold text-zinc-900">{selectedCountry.visaType}</div>
              </div>
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Gross Salary Floor</span>
                <div className="text-sm font-semibold text-emerald-800">{selectedCountry.salaryFloor}</div>
              </div>
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Permanent Residency</span>
                <div className="text-sm font-semibold text-zinc-900">{selectedCountry.prTimeline}</div>
              </div>
            </div>

            {/* Key Immigration Rules */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-zinc-950 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Essential Visa & Sponsorship Requirements</span>
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedCountry.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-600">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* In Demand Tech Roles */}
            <div className="space-y-3 pt-4 border-t border-zinc-100">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">High-Demand Roles in {selectedCountry.name}</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCountry.inDemand.map((role) => (
                  <span
                    key={role}
                    className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-800"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick FAQ / Relocation Process */}
          <div className="rounded-3xl border border-zinc-200 bg-zinc-900 text-white p-8 sm:p-10 space-y-6">
            <h3 className="text-xl sm:text-2xl font-semibold">How RightWay automates your relocation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-zinc-400">
              <div className="space-y-2">
                <div className="h-7 w-7 rounded-full bg-zinc-800 text-white font-bold flex items-center justify-center text-xs">
                  1
                </div>
                <h4 className="text-white font-semibold">Credentials Verified Upfront</h4>
                <p>We confirm degree equivalence and skill certificates before you submit a single application.</p>
              </div>
              <div className="space-y-2">
                <div className="h-7 w-7 rounded-full bg-zinc-800 text-white font-bold flex items-center justify-center text-xs">
                  2
                </div>
                <h4 className="text-white font-semibold">Salary Floors Guarded</h4>
                <p>Every role is checked against current legal Blue Card thresholds so you never waste time on sub-threshold offers.</p>
              </div>
              <div className="space-y-2">
                <div className="h-7 w-7 rounded-full bg-zinc-800 text-white font-bold flex items-center justify-center text-xs">
                  3
                </div>
                <h4 className="text-white font-semibold">Direct Sponsor Access</h4>
                <p>Your profile is shared directly with registered European corporate sponsors ready to handle your visa paperwork.</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

