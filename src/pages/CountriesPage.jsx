import CountryFlag from '../components/CountryFlag';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HorizScroll from '../components/HorizScroll';
import { surfaces } from '../lib/surfaces';
import {
  MapPin,
  CheckCircle2,
  ArrowRight,
  Globe2,
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
  {
    id: 'united-states',
    name: 'United States',
    flag: '🇺🇸',
    hub: 'San Francisco, New York, Austin, Seattle',
    visaType: 'H-1B / L-1 / O-1 / TN (for Canadians & Mexicans)',
    salaryFloor: 'Prevailing wage by role & metro (LCA)',
    shortageFloor: 'STEM OPT + H-1B lottery; specialty occupation required',
    prTimeline: 'Employment-based green card (EB-2/EB-3) — multi-year, country caps apply',
    highlights: [
      'Employer files Labor Condition Application (LCA) before H-1B petition',
      'Cap-exempt routes exist for universities and non-profits',
      'TN available to Canadian and Mexican citizens in listed professions',
      'State tax and healthcare costs vary widely by metro',
    ],
    inDemand: ['Full Stack', 'ML / AI Engineers', 'Cloud / SRE', 'Security', 'Mobile'],
  },
  {
    id: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    hub: 'Toronto, Vancouver, Montreal, Ottawa',
    visaType: 'Express Entry / Temporary Foreign Worker / Global Talent Stream',
    salaryFloor: 'Median wage by NOC & province (LMIA or GTS)',
    shortageFloor: 'Global Talent Stream Category A/B — 2-week processing target',
    prTimeline: 'Express Entry / PNP often 6–18 months once invited',
    highlights: [
      'Global Talent Stream speeds work permits for listed tech roles',
      'Provincial Nominee Programs (PNP) target regional skill gaps',
      'Spouses often get open work permits',
      'CRS score drives Express Entry invitations — language and education matter',
    ],
    inDemand: ['Full Stack', 'Data Engineers', 'DevOps', 'Product Engineers', 'Cybersecurity'],
  },
  {
    id: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    hub: 'Sydney, Melbourne, Brisbane, Perth',
    visaType: 'Subclass 482 (TSS) / 189 / 190 / 491',
    salaryFloor: 'Temporary Skilled Migration Income Threshold (TSMIT) + market rate',
    shortageFloor: 'Skills in Demand / Core Skills Occupation List pathways',
    prTimeline: 'Employer-sponsored 186 or points-tested 189/190 — often 2–4 years',
    highlights: [
      'Employer sponsorship requires nomination and skills assessment for many roles',
      'Points-tested visas reward age, English, and skilled work experience',
      'Regional visas (491/494) can shorten PR paths outside major metros',
      'ANZSCO code must match the nominated occupation',
    ],
    inDemand: ['Software Engineers', 'Data / ML', 'Cybersecurity', 'Cloud Architects'],
  },
  {
    id: 'new-zealand',
    name: 'New Zealand',
    flag: '🇳🇿',
    hub: 'Auckland, Wellington, Christchurch',
    visaType: 'Accredited Employer Work Visa (AEWV) / Green List',
    salaryFloor: 'Median wage threshold for AEWV (updates periodically)',
    shortageFloor: 'Green List Straight to Residence for eligible occupations',
    prTimeline: 'Straight to Residence or work-to-residence — often 1–3 years',
    highlights: [
      'Employer must be Immigration NZ accredited before AEWV',
      'Green List roles can skip intermediate work steps',
      'English evidence required for many skilled pathways',
      'Smaller market — fewer openings, faster decision cycles',
    ],
    inDemand: ['Full Stack', 'Cloud / DevOps', 'Data Engineers', 'Product Engineers'],
  },
];

export default function CountriesPage() {
  const [activeTab, setActiveTab] = useState('germany');

  const selectedCountry = COUNTRIES_DATA.find((c) => c.id === activeTab) || COUNTRIES_DATA[0];

  return (
    <div className="min-h-screen rw-paper-wash text-[var(--rw-ink)] selection:bg-[var(--rw-accent-2)] selection:text-white flex flex-col justify-between">

      <div>
        <Navbar />

        <div className="rw-page-hero">
          <div className="mx-auto max-w-3xl px-4 text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--rw-accent-2)]/35 bg-[var(--rw-sky-soft)] px-3 py-1 text-[11px] font-semibold text-[var(--rw-accent-2)]">
              <Globe2 className="h-3.5 w-3.5" />
              <span>Europe · US · Canada · AU · NZ</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-display font-semibold tracking-tight text-[var(--rw-ink)]">
              Country guides & visa thresholds
            </h1>
            <p className="text-sm sm:text-base text-[var(--rw-muted)] leading-relaxed max-w-2xl mx-auto">
              Salary floors, sponsorship routes, and work permits across key tech destinations.
            </p>
          </div>
        </div>

        <main className="relative z-10 mx-auto max-w-5xl px-4 pt-10 pb-20 space-y-10">
          <HorizScroll className="flex items-center gap-2 w-full max-w-full px-1 py-1">
            {COUNTRIES_DATA.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveTab(c.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition shrink-0 ${
                  activeTab === c.id
                    ? 'bg-[var(--rw-ink)] text-[var(--rw-paper)] shadow-sm'
                    : 'rw-surface text-[var(--rw-muted)] border border-[var(--rw-line)] hover:text-[var(--rw-ink)]'
                }`}
              >
                <CountryFlag code={c.id} className="h-4 w-6 rounded shadow-xs" />
                <span>{c.name}</span>
              </button>
            ))}
          </HorizScroll>

          <div className="rounded-3xl border border-[var(--rw-line)] rw-surface p-4 sm:p-10 space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--rw-line)]">
              <div className="flex items-center gap-3">
                <CountryFlag code={selectedCountry.id} className="h-9 w-12 rounded-md shadow-sm border border-[var(--rw-line)]" />
                <div>
                  <h2 className="text-2xl font-bold text-[var(--rw-ink)]">{selectedCountry.name} tech relocation</h2>
                  <p className="text-xs sm:text-sm text-[var(--rw-muted)] flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Hubs: {selectedCountry.hub}</span>
                  </p>
                </div>
              </div>

              <a
                href={surfaces.candidateRegister()}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--rw-ink)] px-5 py-2.5 text-xs font-semibold text-[var(--rw-paper)] hover:opacity-90 transition self-start sm:self-auto"
              >
                <span>Check eligibility</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)]/60 p-4 space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--rw-muted)]">Primary visa</span>
                <div className="text-sm font-semibold text-[var(--rw-ink)]">{selectedCountry.visaType}</div>
              </div>
              <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)]/60 p-4 space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--rw-muted)]">Salary floor</span>
                <div className="text-sm font-semibold text-[var(--rw-accent)]">{selectedCountry.salaryFloor}</div>
              </div>
              <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)]/60 p-4 space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--rw-muted)]">Permanent residency</span>
                <div className="text-sm font-semibold text-[var(--rw-ink)]">{selectedCountry.prTimeline}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-semibold text-[var(--rw-ink)] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[var(--rw-accent)]" />
                <span>Visa & sponsorship notes</span>
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedCountry.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--rw-muted)]">
                    <CheckCircle2 className="h-4 w-4 text-[var(--rw-accent)] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 pt-4 border-t border-[var(--rw-line)]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--rw-muted)]">
                High-demand roles in {selectedCountry.name}
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedCountry.inDemand.map((role) => (
                  <span
                    key={role}
                    className="rounded-xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)]/50 px-3 py-1.5 text-xs font-medium text-[var(--rw-ink)]"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rw-band-ink p-8 sm:p-10 space-y-6">
            <h3 className="text-xl sm:text-2xl font-display font-semibold text-white">How RightWay helps relocation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-white/55">
              <div className="space-y-2">
                <div className="h-7 w-7 rounded-full bg-white/10 text-white font-bold flex items-center justify-center text-xs">
                  1
                </div>
                <h4 className="text-white font-semibold">Confirm credentials first</h4>
                <p>Degree and skill proof locked before you apply.</p>
              </div>
              <div className="space-y-2">
                <div className="h-7 w-7 rounded-full bg-white/10 text-white font-bold flex items-center justify-center text-xs">
                  2
                </div>
                <h4 className="text-white font-semibold">Check salary floors</h4>
                <p>Roles screened against legal thresholds before you send.</p>
              </div>
              <div className="space-y-2">
                <div className="h-7 w-7 rounded-full bg-white/10 text-white font-bold flex items-center justify-center text-xs">
                  3
                </div>
                <h4 className="text-white font-semibold">Reach sponsors direct</h4>
                <p>Connect with employers who can handle visa paperwork.</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

