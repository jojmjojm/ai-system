import { Check, ArrowRight, Zap, Star, Repeat } from 'lucide-react'

const plans = [
  {
    name: 'Basis',
    price: '2.500',
    unit: 'engangsbeløb',
    desc: 'Hurtig AI-optimering af din hjemmeside',
    icon: Zap,
    features: [
      'Meta tags og descriptions',
      'Schema / struktureret data',
      'HTML-struktur optimering',
      'Open Graph tags',
      'AI-synlighedsrapport',
    ],
    cta: 'Kom i gang',
    popular: false,
  },
  {
    name: 'Fuld optimering',
    price: '4.900',
    unit: 'engangsbeløb',
    desc: 'Komplet AI-synlighed — alt i basis plus mere',
    icon: Star,
    features: [
      'Alt fra Basis',
      'Indholdsoptimering',
      'FAQ-sektion til AI',
      'Intern linkstruktur',
      'Konkurrentanalyse',
      'Prioriteret support',
    ],
    cta: 'Vælg fuld optimering',
    popular: true,
  },
  {
    name: 'Løbende',
    price: '990',
    unit: 'kr/md',
    desc: 'Løbende overvågning og optimering',
    icon: Repeat,
    features: [
      'Månedlig AI-scanning',
      'Løbende optimering',
      'Nye anbefalinger',
      'Performance-rapport',
      'Email-support',
    ],
    cta: 'Start abonnement',
    popular: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-dark-900 mb-3">
          Simple, faste priser
        </h2>
        <p className="text-center text-dark-400 mb-12 max-w-xl mx-auto">
          Ingen timepriser. Ingen overraskelser. Du ved hvad du betaler.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const Icon = plan.icon
            return (
              <div
                key={i}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  plan.popular
                    ? 'bg-dark-950 text-white border-2 border-brand-500 shadow-xl shadow-brand-500/10'
                    : 'bg-white border border-dark-100 shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    Mest populær
                  </div>
                )}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                  plan.popular ? 'bg-brand-500' : 'bg-brand-50'
                }`}>
                  <Icon className={`w-5 h-5 ${plan.popular ? 'text-white' : 'text-brand-600'}`} />
                </div>
                <h3 className={`text-lg font-bold ${plan.popular ? 'text-white' : 'text-dark-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mt-1 mb-4 ${plan.popular ? 'text-white/60' : 'text-dark-400'}`}>
                  {plan.desc}
                </p>
                <div className="mb-6">
                  <span className={`text-4xl font-extrabold ${plan.popular ? 'text-white' : 'text-dark-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ml-1 ${plan.popular ? 'text-white/50' : 'text-dark-400'}`}>
                    {plan.unit}
                  </span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        plan.popular ? 'text-brand-400' : 'text-brand-500'
                      }`} />
                      <span className={plan.popular ? 'text-white/80' : 'text-dark-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                    plan.popular
                      ? 'gradient-brand text-white hover:opacity-90 shadow-lg shadow-brand-500/30'
                      : 'bg-dark-900 text-white hover:bg-dark-800'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )
          })}
        </div>

        <p className="text-center text-xs text-dark-300 mt-8">
          Alle priser er ekskl. moms. Ingen binding. Pengene tilbage hvis du ikke er tilfreds.
        </p>
      </div>
    </section>
  )
}
