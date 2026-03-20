import { Eye, Shield, FileText, Bot, Target, Wrench } from 'lucide-react'
import type { CategoryScore } from '@/types'

const categoryIcons: Record<string, typeof Eye> = {
  clarity: Eye,
  trust: Shield,
  content: FileText,
  aiReady: Bot,
  conversion: Target,
  technical: Wrench,
}

interface Props {
  category: CategoryScore
}

export default function ScoreCard({ category }: Props) {
  const pct = Math.round((category.score / category.maxScore) * 100)
  const color = pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-400' : 'bg-red-500'
  const textColor = pct >= 70 ? 'text-green-600' : pct >= 40 ? 'text-yellow-600' : 'text-red-500'
  const Icon = categoryIcons[category.name] || Eye

  return (
    <div className="bg-white rounded-xl border border-dark-100 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-7 h-7 rounded-lg bg-dark-50 flex items-center justify-center flex-shrink-0">
          <Icon className="w-3.5 h-3.5 text-dark-500" />
        </div>
        <span className="text-sm font-medium text-dark-700 leading-tight">{category.label}</span>
      </div>
      <div className="flex items-end justify-between mb-2">
        <span className={`text-2xl font-bold ${textColor}`}>{pct}%</span>
        <span className="text-xs text-dark-400">{category.score}/{category.maxScore} point</span>
      </div>
      <div className="w-full h-2 bg-dark-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
