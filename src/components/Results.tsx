import { ArrowLeft, ExternalLink, AlertTriangle, Phone, Share2, Calendar, CheckCircle } from 'lucide-react'
import type { ScanResult } from '@/types'
import ScoreCard from './ScoreCard'
import FindingCard from './FindingCard'
import RecommendationCard from './RecommendationCard'

interface Props {
  result: ScanResult
  onReset: () => void
}

export default function Results({ result, onReset }: Props) {
  const scoreColor = result.score >= 70 ? 'text-green-600' : result.score >= 40 ? 'text-yellow-500' : 'text-red-500'
  const scoreBg = result.score >= 70 ? 'bg-green-50' : result.score >= 40 ? 'bg-yellow-50' : 'bg-red-50'
  const scoreStroke = result.score >= 70 ? '#16a34a' : result.score >= 40 ? '#eab308' : '#ef4444'
  const scoreLabel = result.score >= 80
    ? 'Stærk AI-parathed'
    : result.score >= 60
      ? 'God start — plads til forbedring'
      : result.score >= 40
        ? 'Du mister kunder til AI-søgning'
        : 'Kritisk — din side er usynlig for AI'
  const isLow = result.score < 60

  const scanDate = new Date(result.scannedAt).toLocaleDateString('da-DK', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  const handleShare = () => {
    const text = `Min hjemmeside scorer ${result.score}/100 på AI-synlighed. Tjek din egen side gratis: aism.dk`
    if (navigator.share) {
      navigator.share({ title: 'AISM Score', text }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text).then(() => alert('Kopieret til udklipsholder!'))
    }
  }

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-dark-400 hover:text-dark-900 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ny scanning
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-dark-400 hover:text-dark-900 text-sm transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Del resultat
          </button>
        </div>

        {/* Urgency Banner */}
        {isLow && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3 animate-fade-in-up">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-red-900 font-semibold">
                Din side er ikke klar til AI-søgning
              </p>
              <p className="text-sm text-red-700 mt-0.5">
                Kunder der spørger ChatGPT, Perplexity eller Gemini om din branche finder dig ikke.
              </p>
            </div>
          </div>
        )}

        {/* Main Score Card */}
        <div className={`${scoreBg} rounded-2xl border border-dark-100 shadow-sm p-6 sm:p-8 mb-8 animate-fade-in-up`}>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-36 h-36 flex-shrink-0">
              <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="white" strokeWidth="10" />
                <circle cx="60" cy="60" r="52" fill="none" stroke={scoreStroke} strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(result.score / 100) * 327} 327`}
                  className="score-ring-animated" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-extrabold ${scoreColor}`}>{result.score}</span>
                <span className="text-xs text-dark-400 font-medium">/100</span>
              </div>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className={`text-xl sm:text-2xl font-bold ${scoreColor}`}>{scoreLabel}</h2>
              <p className="text-dark-400 mt-1 flex items-center gap-1.5 justify-center sm:justify-start text-sm">
                <ExternalLink className="w-3.5 h-3.5" />
                {result.url}
              </p>
              <p className="text-dark-600 mt-3 max-w-lg text-sm leading-relaxed">{result.summary}</p>
              <p className="text-dark-300 text-xs mt-3 flex items-center gap-1 justify-center sm:justify-start">
                <Calendar className="w-3 h-3" />
                Scannet {scanDate}
              </p>
            </div>
          </div>
        </div>

        {/* Category Scores */}
        <div className="mb-8 animate-fade-in-up animate-delay-100">
          <h3 className="text-lg font-bold text-dark-900 mb-4">Score pr. kategori</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {result.categories.map((cat, i) => (
              <ScoreCard key={i} category={cat} />
            ))}
          </div>
        </div>

        {/* Mid-page CTA for low scores */}
        {isLow && (
          <div className="gradient-brand rounded-2xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center gap-4 text-white animate-fade-in-up animate-delay-200">
            <div className="flex-1 text-center sm:text-left">
              <p className="font-bold text-lg">Vi kan fikse dette for dig</p>
              <p className="text-white/70 text-sm mt-1">Fast pris. De fleste sider er klar inden 48 timer.</p>
            </div>
            <a
              href="#contact"
              className="flex items-center gap-2 bg-white text-dark-900 font-semibold px-6 py-3 rounded-xl hover:bg-brand-50 transition-colors whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              Få tilbud nu
            </a>
          </div>
        )}

        {/* Issues */}
        {result.issues.length > 0 && (
          <div className="mb-8 animate-fade-in-up animate-delay-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-dark-900">
                Problemer vi fandt
              </h3>
              <span className="text-xs font-medium bg-red-100 text-red-700 px-2.5 py-1 rounded-full">
                {result.issues.length} fundet
              </span>
            </div>
            <div className="space-y-3">
              {result.issues.map((issue, i) => (
                <FindingCard key={i} finding={issue} index={i + 1} />
              ))}
            </div>
          </div>
        )}

        {/* No issues state */}
        {result.issues.length === 0 && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="font-semibold text-green-800">Ingen kritiske problemer fundet</p>
            <p className="text-green-600 text-sm mt-1">Din side har et godt teknisk fundament</p>
          </div>
        )}

        {/* Recommendations */}
        {result.recommendations.length > 0 && (
          <div className="mb-8 animate-fade-in-up animate-delay-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-dark-900">
                Vores anbefalinger
              </h3>
              <span className="text-xs font-medium bg-brand-100 text-brand-700 px-2.5 py-1 rounded-full">
                {result.recommendations.length} anbefalinger
              </span>
            </div>
            <div className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <RecommendationCard key={i} recommendation={rec} index={i + 1} />
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="gradient-dark rounded-2xl p-8 sm:p-10 text-center text-white animate-fade-in-up animate-delay-400">
          <h3 className="text-2xl font-bold mb-3">
            {isLow ? 'Stop med at miste kunder til AI' : 'Klar til næste niveau?'}
          </h3>
          <p className="text-white/60 mb-6 max-w-lg mx-auto text-sm leading-relaxed">
            {isLow
              ? 'Vi fikser din AI-synlighed til fast pris. De fleste sider er klar inden 48 timer. Du betaler kun hvis du er tilfreds.'
              : 'Vi hjælper dig med de sidste optimeringer så AI-søgemaskiner altid anbefaler dig.'
            }
          </p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 bg-white text-dark-900 font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-50 transition-colors shadow-lg"
          >
            Få tilbud — vi svarer inden 24 timer
          </a>
          <p className="text-white/30 text-xs mt-4">Ingen binding. Fast pris fra 2.500 kr. Pengene tilbage garanti.</p>
        </div>
      </div>
    </section>
  )
}
