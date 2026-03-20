import { Scan } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-dark-100 bg-dark-950 text-white/50 py-10 sm:py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 gradient-brand rounded-lg flex items-center justify-center">
                <Scan className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                AI<span className="text-brand-400">SM</span>
              </span>
            </div>
            <p className="text-sm max-w-xs leading-relaxed">
              AISM hjælper danske virksomheder med at blive synlige
              i AI-søgning. ChatGPT, Perplexity, Gemini — vi sørger for at de finder dig.
            </p>
          </div>
          <div className="flex gap-8 sm:gap-12 text-sm">
            <div className="space-y-2">
              <p className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Produkt</p>
              <a href="#scan" className="block hover:text-white transition-colors">Gratis scan</a>
              <a href="#pricing" className="block hover:text-white transition-colors">Priser</a>
              <a href="#contact" className="block hover:text-white transition-colors">Kontakt</a>
            </div>
            <div className="space-y-2">
              <p className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Info</p>
              <a href="#how" className="block hover:text-white transition-colors">Sådan virker det</a>
              <a href="#privacy" className="block hover:text-white transition-colors">Privatlivspolitik</a>
              <a href="#terms" className="block hover:text-white transition-colors">Vilkår</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p>&copy; {new Date().getFullYear()} AISM.dk — AI Site Monitor</p>
          <p>CVR: XX XX XX XX</p>
        </div>
      </div>
    </footer>
  )
}
