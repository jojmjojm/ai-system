import { AlertTriangle, Clock, Shield, Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-brand-50/30" />
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />
      <div className="relative max-w-6xl mx-auto px-4 pt-16 sm:pt-20 pb-6 text-center">
        <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          <AlertTriangle className="w-4 h-4" />
          <span>73% af danske virksomheder er usynlige i AI-søgning</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark-950 leading-[1.1] max-w-4xl mx-auto">
          Dine kunder spørger{' '}
          <span className="text-gradient">ChatGPT</span>
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>— finder de dig?
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-dark-500 max-w-2xl mx-auto leading-relaxed">
          Flere og flere danskere bruger AI i stedet for Google.
          Hvis din hjemmeside ikke er klar, mister du kunder — hver dag.
        </p>

        <p className="mt-3 text-lg sm:text-xl font-semibold text-dark-800">
          Tjek det gratis på 30 sekunder.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-6 sm:gap-8 text-sm text-dark-400">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-500" />
            30 sekunder
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-500" />
            20+ AI-faktorer
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-500" />
            100% gratis
          </div>
        </div>
      </div>
    </section>
  )
}
