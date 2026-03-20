import { Globe, BarChart3, Lightbulb, ShieldAlert, TrendingDown, Eye } from 'lucide-react'

const problems = [
  {
    icon: ShieldAlert,
    title: 'AI kan ikke læse din side',
    desc: 'Manglende metadata, dårlig struktur og ingen schema gør dig usynlig for ChatGPT, Perplexity og Gemini.'
  },
  {
    icon: TrendingDown,
    title: 'Du mister kunder lige nu',
    desc: 'Dine konkurrenter bliver anbefalet af AI. Du gør ikke. Hver dag koster det dig penge.'
  },
  {
    icon: Eye,
    title: 'Du ved det ikke engang',
    desc: 'Du kan ikke se problemet i Google Analytics. Men kunderne er allerede væk.'
  }
]

const steps = [
  {
    icon: Globe,
    title: 'Indtast din URL',
    desc: 'Skriv din adresse — vi scanner siden på 30 sekunder.'
  },
  {
    icon: BarChart3,
    title: 'Se din score',
    desc: 'Få en score fra 0-100 og se præcis hvad der er galt.'
  },
  {
    icon: Lightbulb,
    title: 'Få det fikset',
    desc: 'Vi fikser det for dig til fast pris — eller du gør det selv.'
  }
]

export default function HowItWorks() {
  return (
    <>
      {/* Problem Section */}
      <section className="py-16 sm:py-20 bg-dark-950 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
            Problemet de fleste ikke kender
          </h2>
          <p className="text-center text-white/50 mb-12 max-w-xl mx-auto text-sm sm:text-base">
            Google er ikke længere den eneste vej til kunder.
            AI-søgning vokser eksplosivt — og din side er sandsynligvis ikke klar.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {problems.map((p, i) => {
              const Icon = p.icon
              return (
                <div key={i} className="bg-white/5 backdrop-blur rounded-2xl p-6 sm:p-8 border border-white/10">
                  <div className="w-11 h-11 bg-red-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2">{p.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-16 sm:py-20 bg-dark-50/50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-dark-900 mb-3">
            3 trin til AI-synlighed
          </h2>
          <p className="text-center text-dark-400 mb-12 max-w-xl mx-auto text-sm sm:text-base">
            Det tager 30 sekunder at finde ud af om du har et problem
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={i} className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-sm border border-dark-100">
                  <div className="w-12 h-12 gradient-brand rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xs font-bold text-brand-500 mb-2">TRIN {i + 1}</div>
                  <h3 className="text-base sm:text-lg font-semibold text-dark-900 mb-2">{step.title}</h3>
                  <p className="text-dark-400 text-sm">{step.desc}</p>
                </div>
              )
            })}
          </div>
          <div className="text-center mt-10">
            <a
              href="#scan"
              className="inline-flex items-center gap-2 gradient-brand text-white font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity text-base sm:text-lg shadow-lg shadow-brand-500/20"
            >
              Scan din side nu — gratis
            </a>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-10 sm:py-12 bg-white border-y border-dark-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-brand-600">847+</div>
              <div className="text-xs sm:text-sm text-dark-400 mt-1">Sider scannet</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-brand-600">38</div>
              <div className="text-xs sm:text-sm text-dark-400 mt-1">Gns. score i DK</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-brand-600">48t</div>
              <div className="text-xs sm:text-sm text-dark-400 mt-1">Typisk leveringstid</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
