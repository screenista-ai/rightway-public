export default function AtsScorePanel({ result, loading, error }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
        Scoring resume…
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
    );
  }
  if (!result) return null;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">ATS score</div>
          <div className="mt-1 text-4xl font-semibold tabular-nums text-zinc-900">{result.score}</div>
          <div className="mt-1 text-xs text-zinc-500">
            ~{result.approxPages} page(s) · {result.wordCount} words
            {result.fileName ? ` · ${result.fileName}` : ''}
          </div>
        </div>
        <div
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            result.score >= 75
              ? 'bg-emerald-100 text-emerald-800'
              : result.score >= 50
                ? 'bg-amber-100 text-amber-900'
                : 'bg-red-100 text-red-800'
          }`}
        >
          {result.score >= 75 ? 'Strong' : result.score >= 50 ? 'Needs work' : 'Weak for ATS'}
        </div>
      </div>

      <ul className="space-y-3">
        {(result.parameters || []).map((p) => (
          <li key={p.id} className="rounded-xl border border-zinc-100 bg-zinc-50/80 px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-zinc-900">{p.label}</span>
              <span
                className={`text-xs font-semibold tabular-nums ${
                  p.pass ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {p.score}/100 · w{p.weight}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-200">
              <div
                className={`h-full rounded-full ${p.pass ? 'bg-emerald-500' : 'bg-amber-500'}`}
                style={{ width: `${p.score}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-zinc-500">{p.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
