import { ArrowUpRight } from 'lucide-react'
import type { Recommendation } from '@/types'

const priorityConfig = {
  high: { dot: 'bg-brand-500', badge: 'bg-brand-100 text-brand-700', label: 'Vigtig' },
  medium: { dot: 'bg-brand-300', badge: 'bg-dark-100 text-dark-600', label: 'Anbefalet' },
  low: { dot: 'bg-dark-300', badge: 'bg-dark-100 text-dark-500', label: 'Nice to have' },
}

export default function RecommendationCard({ recommendation, index }: { recommendation: Recommendation; index: number }) {
  const config = priorityConfig[recommendation.priority]

  return (
    <div className="bg-white border border-dark-100 rounded-xl p-4 sm:p-5 hover:border-brand-200 hover:shadow-sm transition-all group">
      <div className="flex items-start gap-3">
        <span className="w-6 h-6 gradient-brand rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
          {index}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className="font-semibold text-dark-900 text-sm sm:text-base">{recommendation.title}</h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.badge}`}>
              {config.label}
            </span>
          </div>
          <p className="text-sm text-dark-500 leading-relaxed">{recommendation.description}</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-brand-600 font-semibold group-hover:text-brand-700 transition-colors">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Effekt: {recommendation.impact}
          </div>
        </div>
      </div>
    </div>
  )
}
