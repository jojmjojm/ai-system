import { AlertTriangle, AlertCircle, Info } from 'lucide-react'
import type { Finding } from '@/types'

const severityConfig = {
  critical: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', label: 'Kritisk', badge: 'bg-red-100 text-red-700' },
  warning: { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Advarsel', badge: 'bg-yellow-100 text-yellow-700' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Info', badge: 'bg-blue-100 text-blue-700' },
}

export default function FindingCard({ finding, index }: { finding: Finding; index: number }) {
  const config = severityConfig[finding.severity]
  const Icon = config.icon

  return (
    <div className={`${config.bg} border ${config.border} rounded-xl p-4 sm:p-5`}>
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${config.badge}`}>
            {index}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className="font-semibold text-dark-900 text-sm sm:text-base">{finding.title}</h4>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}>{config.label}</span>
          </div>
          <p className="text-sm text-dark-500 leading-relaxed">{finding.description}</p>
          <span className="text-[11px] text-dark-300 mt-1.5 inline-block font-medium">{finding.category}</span>
        </div>
      </div>
    </div>
  )
}
