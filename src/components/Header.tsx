import { useState } from 'react'
import { Scan, Menu, X } from 'lucide-react'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-dark-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
            <Scan className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-dark-900">
            AI<span className="text-brand-500">SM</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6 text-sm text-dark-500">
          <a href="#scan" className="hover:text-dark-900 transition-colors">Gratis scan</a>
          <a href="#how" className="hover:text-dark-900 transition-colors">Sådan virker det</a>
          <a href="#pricing" className="hover:text-dark-900 transition-colors">Priser</a>
          <a href="#contact" className="hover:text-dark-900 transition-colors">Kontakt</a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#scan"
            className="hidden sm:flex gradient-brand text-white text-sm font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-brand-500/20"
          >
            Tjek din side
          </a>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="sm:hidden w-10 h-10 flex items-center justify-center text-dark-500 hover:text-dark-900 transition-colors"
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="sm:hidden border-t border-dark-100 bg-white px-4 py-4 space-y-1">
          {[
            { href: '#scan', label: 'Gratis scan' },
            { href: '#how', label: 'Sådan virker det' },
            { href: '#pricing', label: 'Priser' },
            { href: '#contact', label: 'Kontakt' },
          ].map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 px-3 rounded-lg text-dark-600 hover:bg-dark-50 hover:text-dark-900 transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#scan"
            onClick={() => setOpen(false)}
            className="block w-full text-center gradient-brand text-white font-semibold py-3 rounded-lg mt-2"
          >
            Tjek din side — gratis
          </a>
        </div>
      )}
    </header>
  )
}
