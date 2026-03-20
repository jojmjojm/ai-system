import { AlertTriangle, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react'

const demoCategories = [
  { label: 'Klarhed & Struktur', score: 8, max: 27, pct: 30 },
  { label: 'Troværdighed', score: 3, max: 10, pct: 30 },
  { label: 'Indholdskvalitet', score: 10, max: 28, pct: 36 },
  { label: 'AI-parathed', score: 2, max: 19, pct: 11 },
  { label: 'Konvertering', score: 5, max: 13, pct: 38 },
  { label: 'Teknisk', score: 10, max: 18, pct: 56 },
]

const demoIssues = [
  { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', title: 'Ingen struktureret data', severity: 'Kritisk' },
  { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', title: 'Manglende meta description', severity: 'Kritisk' },
  { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50', title: 'Kun 120 ord på forsiden', severity: 'Advarsel' },
  { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50', title: 'Ingen Open Graph tags', severity: 'Advarsel' },
]

export default function DemoResult() {
  return (
    <section className="py-16 bg-dark-50/30">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-dark-900 mb-3">
            Eksempel: Typisk dansk virksomhedsside
          </h2>
          <p className="text-dark-400 max-w-xl mx-auto">
            Sådan ser resultatet ud for en gennemsnitlig dansk hjemmeside.
            De fleste scorer under 40 — og det betyder tabte kunder.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-dark-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-dark-100">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Score circle */}
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e3e5" strokeWidth="10" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#ef4444" strokeWidth="10"
                    strokeLinecap="round" strokeDasharray={`${(33 / 100) * 327} 327`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-red-500">33</span>
                  <span className="text-[10px] text-dark-400">/100</span>
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-xs font-semibold text-dark-400 uppercase tracking-wide mb-1">Eksempelresultat</div>
                <h3 className="text-xl font-bold text-red-500">Kritisk lav AI-synlighed</h3>
                <p className="text-dark-400 text-sm mt-1">eksempel-firma.dk</p>
                <p className="text-dark-500 text-sm mt-2 max-w-md">
                  Denne side er næsten usynlig for AI-søgemaskiner. Grundlæggende elementer mangler.
                </p>
              </div>
            </div>
          </div>

          {/* Category bars */}
          <div className="p-6 sm:p-8 border-b border-dark-100">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {demoCategories.map((cat, i) => (
                <div key={i} className="bg-dark-50/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-dark-500">{cat.label}</span>
                    <span className="text-xs font-bold text-dark-700">{cat.score}/{cat.max}</span>
                  </div>
                  <div className="w-full h-1.5 bg-dark-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${cat.pct >= 50 ? 'bg-yellow-400' : 'bg-red-500'}`}
                      style={{ width: `${cat.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Issues preview */}
          <div className="p-6 sm:p-8 border-b border-dark-100">
            <h4 className="text-sm font-bold text-dark-900 mb-3">Fundne problemer</h4>
            <div className="space-y-2">
              {demoIssues.map((issue, i) => (
                <div key={i} className={`${issue.bg} rounded-lg px-4 py-3 flex items-center gap-3`}>
                  <issue.icon className={`w-4 h-4 ${issue.color} flex-shrink-0`} />
                  <span className="text-sm text-dark-800 font-medium flex-1">{issue.title}</span>
                  <span className={`text-xs font-medium ${issue.color}`}>{issue.severity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="p-6 sm:p-8 bg-brand-50/50 text-center">
            <p className="text-dark-700 font-semibold mb-3">
              Er din side bedre? Eller værre?
            </p>
            <a
              href="#scan"
              className="inline-flex items-center gap-2 gradient-brand text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-brand-500/20"
            >
              Tjek din egen side gratis
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
