export interface ScanResult {
  url: string
  score: number
  summary: string
  categories: CategoryScore[]
  issues: Finding[]
  recommendations: Recommendation[]
  scannedAt: string
}

export interface CategoryScore {
  name: string
  score: number
  maxScore: number
  label: string
}

export interface Finding {
  severity: 'critical' | 'warning' | 'info'
  title: string
  description: string
  category: string
}

export interface Recommendation {
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  impact: string
}

export interface LeadForm {
  name: string
  email: string
  website: string
  message: string
}
