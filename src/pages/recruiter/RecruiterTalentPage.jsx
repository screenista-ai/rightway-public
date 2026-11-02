import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

const EU_COUNTRIES = ['ALL', 'DE', 'NL', 'SE', 'DK', 'FR', 'IE', 'ES', 'PL', 'CH', 'AT'];
const POPULAR_SKILLS = ['ALL', 'React', 'Node.js', 'Python', 'Go', 'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'Java', 'SQL'];

export default function RecruiterTalentPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [country, setCountry] = useState('ALL');
  const [skill, setSkill] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTalent();
  }, [country, skill]);

  async function fetchTalent() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (country !== 'ALL') params.set('country', country);
      if (skill !== 'ALL') params.set('skill', skill);
      if (search) params.set('search', search);

      const res = await api(`/recruiter/talent-pool?${params.toString()}`);
      setCandidates(res.items || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch candidate pool');
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    fetchTalent();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">European Talent Discovery</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Filter pre-verified international candidates seeking EU Blue Card and European tech relocation.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-600">
          {error}
        </div>
      ) : null}

      {/* Filter Bar */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search by candidate name or target role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[240px] rounded-xl border border-zinc-200 px-3.5 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-zinc-900 px-5 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-zinc-100 text-xs">
          {/* Country Filter */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-600">Target Country:</span>
            <div className="flex flex-wrap gap-1">
              {EU_COUNTRIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCountry(c)}
                  className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                    country === c
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Skill Filter */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-600">Core Skill:</span>
            <div className="flex flex-wrap gap-1">
              {POPULAR_SKILLS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSkill(s)}
                  className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                    skill === s
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-zinc-800">
            Available Candidates ({candidates.length})
          </h2>
          <span className="text-xs text-zinc-400">All profiles verified from original diplomas & CVs</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-zinc-400">Loading talent pool...</div>
        ) : candidates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center text-xs text-zinc-400">
            No candidates matched your filter criteria. Try adjusting target country or skills.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidates.map((cand) => (
              <div
                key={cand.id}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-zinc-900">
                        {cand.user?.firstName} {cand.user?.lastName}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {cand.customResume1Name || 'Software Engineer'}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      Verified Facts
                    </span>
                  </div>

                  <div className="mt-3 text-xs text-zinc-600 space-y-1">
                    <p>
                      <strong className="text-zinc-700">Location:</strong> {cand.currentCountry || 'Non-EU'} &rarr; Target: <span className="font-semibold text-blue-600">{cand.targetCountry || 'Europe'}</span>
                    </p>
                    <p>
                      <strong className="text-zinc-700">Experience:</strong> {cand.experiences?.length || 0} verified roles ({cand.experiences?.[0]?.jobTitle || 'Engineer'})
                    </p>
                  </div>

                  {/* Skills badges */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {cand.skills?.slice(0, 5).map((s) => (
                      <span
                        key={s.id}
                        className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-700 font-medium"
                      >
                        {s.skillName}
                      </span>
                    ))}
                    {cand.skills?.length > 5 && (
                      <span className="text-[10px] text-zinc-400 self-center">
                        +{cand.skills.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-zinc-400">
                    Template: {cand.selectedTemplateId || 'modern-ats-classic'}
                  </span>
                  <a
                    href={`mailto:${cand.user?.email}?subject=Invitation%20from%20EU%20Recruiter`}
                    className="rounded-full bg-blue-600 px-3 py-1 font-semibold text-white hover:bg-blue-700 transition text-[11px]"
                  >
                    Contact Candidate
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

