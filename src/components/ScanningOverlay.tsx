import { Shield, FileSearch, BarChart3, Lightbulb } from 'lucide-react'
import { useState, useEffect } from 'react'

const steps = [
  { icon: Shield, label: 'Forbinder til siden...' },
  { icon: FileSearch, label: 'Analyserer metadata og struktur...' },
  { icon: BarChart3, label: 'Beregner AI-synlighedsscore...' },
  { icon: Lightbulb, label: 'Genererer anbefalinger...' },
]

export default function ScanningOverlay() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const timers = steps.map((_, i) =>
      setTimeout(() => setActiveStep(i), i * 2200)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h3 className="text-xl font-bold text-dark-900 text-center mb-2">
          Analyserer din hjemmeside
        </h3>
        <p className="text-dark-400 text-sm text-center mb-6">
          Vi tjekker 20+ faktorer for AI-synlighed
        </p>

        {/* Progress bar */}
        <div className="w-full h-2 bg-dark-100 rounded-full mb-8 overflow-hidden">
          <div className="h-full gradient-brand rounded-full scan-progress-bar" />
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, i) => {
            const Icon = step.icon
            const isActive = i === activeStep
            const isDone = i < activeStep

            return (
              <div
                key={i}
                className={`flex items-center gap-3 transition-all duration-300 ${
                  isDone ? 'opacity-50' : isActive ? 'opacity-100' : 'opacity-30'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isDone ? 'bg-green-100' : isActive ? 'gradient-brand' : 'bg-dark-100'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    isDone ? 'text-green-600' : isActive ? 'text-white' : 'text-dark-400'
                  }`} />
                </div>
                <span className={`text-sm ${
                  isActive ? 'text-dark-900 font-medium' : 'text-dark-500'
                }`}>
                  {step.label}
                  {isDone && <span className="text-green-600 ml-2">&#10003;</span>}
                </span>
                {isActive && (
                  <div className="ml-auto flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-dot" />
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-dot" style={{ animationDelay: '0.3s' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-dot" style={{ animationDelay: '0.6s' }} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
