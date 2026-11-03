import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { surfaces } from '../lib/surfaces';
import {
  Search,
  MapPin,
  CheckCircle2,
  Building2,
  DollarSign,
  Filter,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe2,
  Briefcase,
  Share2,
} from 'lucide-react';

const SAMPLE_JOBS = [
  {
    id: 'job-1',
    title: 'Senior Full Stack Engineer (Node.js & React)',
    company: 'FinLeap Mobility SE',
    location: 'Berlin, Germany',
    country: 'Germany',
    type: 'Full-time · Hybrid',
    salary: '€75,000 - €90,000',
    blueCardEligible: true,
    visaSponsorship: true,
    tags: ['TypeScript', 'Node.js', 'React', 'PostgreSQL', 'Docker'],
    posted: '2 days ago',
    description:
      'Scale enterprise payments infrastructure for European cross-border logistics. Direct visa sponsorship supported with full relocation package to Berlin.',
  },
  {
    id: 'job-2',
    title: 'DevOps & Platform Infrastructure Lead',
    company: 'Adyen Tech Group',
    location: 'Amsterdam, Netherlands',
    country: 'Netherlands',
    type: 'Full-time · On-site',
    salary: '€85,000 - €105,000',
    blueCardEligible: true,
    visaSponsorship: true,
    tags: ['Kubernetes', 'AWS', 'Terraform', 'Go', 'CI/CD'],
    posted: '1 day ago',
    description:
      'Manage high-throughput Kubernetes clusters processing European transaction networks. Full IND fast-track sponsorship and 30% tax ruling eligibility.',
  },
  {
    id: 'job-3',
    title: 'Backend Systems Engineer (Rust / Go)',
    company: 'Klarna Core Systems',
    location: 'Stockholm, Sweden',
    country: 'Sweden',
    type: 'Full-time · Hybrid',
    salary: '€70,000 - €88,000',
    blueCardEligible: true,
    visaSponsorship: true,
    tags: ['Rust', 'Go', 'gRPC', 'Distributed Systems'],
    posted: '3 days ago',
    description:
      'Join core ledger infrastructure team building latency-critical microservices. Migrationsverket certified sponsor offering fast visa turnaround.',
  },
  {
    id: 'job-4',
    title: 'Machine Learning & NLP Specialist',
    company: 'Mistral Partner Labs',
    location: 'Paris, France',
    country: 'France',
    type: 'Full-time · Hybrid',
    salary: '€78,000 - €95,000',
    blueCardEligible: true,
    visaSponsorship: true,
    tags: ['PyTorch', 'Python', 'LLM', 'Transformers', 'CUDA'],
    posted: 'Just now',
    description:
      'Fine-tuning multilingual LLMs for domain-specific industrial diagnostics. Passeport Talent sponsorship provided.',
  },
  {
    id: 'job-5',
    title: 'Senior Frontend Engineer (Design Systems)',
    company: 'Stripe Europe Operations',
    location: 'Dublin, Ireland',
    country: 'Ireland',
    type: 'Full-time · Hybrid',
    salary: '€80,000 - €98,000',
    blueCardEligible: true,
    visaSponsorship: true,
    tags: ['React', 'TypeScript', 'Tailwind', 'Next.js', 'Accessibility'],
    posted: '4 days ago',
    description:
      'Build seamless customer dashboard experiences across 30 European markets. Critical Skills Employment Permit (CSEP) support.',
  },
  {
    id: 'job-6',
    title: 'Cloud Security & Compliance Engineer',
    company: 'Zalando Payments GmbH',
    location: 'Munich, Germany',
    country: 'Germany',
    type: 'Full-time · Hybrid',
    salary: '€82,000 - €96,000',
    blueCardEligible: true,
    visaSponsorship: true,
    tags: ['GCP', 'Zero Trust', 'Kubernetes', 'ISO 27001', 'Python'],
    posted: '5 days ago',
    description:
      'Implement automated cloud governance and security observability for millions of active European shoppers. EU Blue Card guaranteed approval support.',
  },
];

const COUNTRIES = ['All', 'Germany', 'Netherlands', 'Sweden', 'France', 'Ireland'];

export default function JobsPage() {
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [onlySponsored, setOnlySponsored] = useState(false);

  const filteredJobs = useMemo(() => {
    return SAMPLE_JOBS.filter((job) => {
      const matchSearch =
        !search.trim() ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchCountry = selectedCountry === 'All' || job.country === selectedCountry;
      const matchSponsor = !onlySponsored || job.visaSponsorship;

      return matchSearch && matchCountry && matchSponsor;
    });
  }, [search, selectedCountry, onlySponsored]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-900 selection:text-white flex flex-col justify-between">
      <div className="fixed inset-0 pointer-events-none bg-grid-subtle opacity-70 z-0" />

      <div>
        <Navbar />

        <main className="relative z-10 mx-auto max-w-5xl px-4 pt-12 pb-20">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-semibold text-zinc-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-zinc-900" />
              <span>NextRaise-Grade European Tech Directory</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-950">
              Find Jobs in Europe with Guaranteed Visa Checks
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl mx-auto">
              Every listing is pre-evaluated against European Blue Card minimums and employer sponsorship records. No phantom postings, no blind rejections.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="mt-8 rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by job title, tech stack (e.g. React, Rust, Kubernetes) or company…"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-zinc-900 focus:bg-white transition"
                />
              </div>
              <button
                type="button"
                onClick={() => setOnlySponsored((v) => !v)}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition ${
                  onlySponsored
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Verified Visa Sponsorship Only</span>
              </button>
            </div>

            {/* Country Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100 text-xs">
              <span className="text-zinc-400 font-medium mr-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> Destination:
              </span>
              {COUNTRIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCountry(c)}
                  className={`rounded-full px-3 py-1 font-semibold transition ${
                    selectedCountry === c
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Job Results Count */}
          <div className="mt-6 flex items-center justify-between text-xs text-zinc-500 px-1">
            <span>Showing {filteredJobs.length} active verified openings</span>
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <ShieldCheck className="h-4 w-4" /> 100% Sponsor Vetted
            </span>
          </div>

          {/* Job Cards */}
          <div className="mt-4 space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center space-y-3">
                <Briefcase className="h-8 w-8 text-zinc-400 mx-auto" />
                <h3 className="text-base font-semibold text-zinc-900">No matching jobs found</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Try clearing your search query or selecting "All" countries to see all active opportunities.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setSelectedCountry('All');
                    setOnlySponsored(false);
                  }}
                  className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-zinc-950 hover:text-zinc-700 transition">
                          {job.title}
                        </h2>
                        {job.blueCardEligible && (
                          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            EU Blue Card Ready
                          </span>
                        )}
                        {job.visaSponsorship && (
                          <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                            Visa Sponsored
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                        <span className="flex items-center gap-1 font-medium text-zinc-800">
                          <Building2 className="h-3.5 w-3.5 text-zinc-400" />
                          {job.company}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                          {job.location}
                        </span>
                        <span>·</span>
                        <span className="font-semibold text-zinc-900">{job.salary}</span>
                        <span>·</span>
                        <span>{job.posted}</span>
                      </div>
                    </div>

                    <a
                      href={surfaces.candidateRegister()}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition shrink-0"
                    >
                      <span>Apply with Verified CV</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">{job.description}</p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-100">
                    <div className="flex flex-wrap gap-1.5">
                      {job.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-lg bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="text-[11px] text-zinc-400">
                      Verified RightWay application · Max 15/day
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Banner */}
          <div className="mt-12 rounded-3xl border border-zinc-200 bg-zinc-950 text-white p-8 sm:p-10 text-center space-y-4">
            <h3 className="text-xl sm:text-2xl font-semibold">Want direct match alerts for your exact stack?</h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
              Upload your resume to RightWay. Our AI matches your verified skills to unadvertised hiring rounds in Germany, the Netherlands, Sweden, and France.
            </p>
            <div className="pt-2">
              <a
                href={surfaces.candidateRegister()}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-100 transition"
              >
                <span>Set Up Match Profile</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

