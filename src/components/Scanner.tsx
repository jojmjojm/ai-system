import { useState, type FormEvent } from 'react'
import { ArrowRight, Loader2, Zap, AlertCircle } from 'lucide-react'
import type { ScanResult } from '@/types'
import { scanWebsite } from '@/lib/api'

interface Props {
  onResult: (r: ScanResult) => void
  scanning: boolean
  setScanning: (v: boolean) => void
}

export default function Scanner({ onResult, scanning, setScanning }: Props) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)

  const isValidUrl = (input: string) => {
    if (!input.trim()) return false
    let test = input.trim()
    if (!test.startsWith('http')) test = 'https://' + test
    try {
      const parsed = new URL(test)
      return parsed.hostname.includes('.')
    } catch {
      return false
    }
  }

  const showValidationHint = touched && url.trim() !== '' && !isValidUrl(url)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setTouched(true)

    let cleanUrl = url.trim()
    if (!cleanUrl) return
    if (!cleanUrl.startsWith('http')) cleanUrl = 'https://' + cleanUrl

    if (!isValidUrl(url)) {
      setError('Indtast en gyldig hjemmesideadresse, f.eks. minside.dk')
      return
    }

    setScanning(true)
    try {
      const result = await scanWebsite(cleanUrl)
      onResult(result)
    } catch (err: any) {
      const msg = err.message || ''
      if (msg.includes('fetch') || msg.includes('network') || msg.includes('Failed')) {
        setError('Kunne ikke nå siden. Tjek at adressen er korrekt og at siden er online.')
      } else {
        setError(msg || 'Noget gik galt. Prøv igen.')
      }
    } finally {
      setScanning(false)
    }
  }

  return (
    <section id="scan" className="py-8 sm:py-10">
      <div className="max-w-2xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className={`bg-white rounded-2xl border-2 shadow-lg p-5 sm:p-6 transition-colors ${
            error ? 'border-red-300' : 'border-dark-200 hover:border-brand-300'
          }`}>
            <div className="flex items-center gap-2 text-brand-600 font-semibold text-sm mb-3">
              <Zap className="w-4 h-4" />
              Gratis AI-synlighedscheck
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={url}
                  onChange={e => { setUrl(e.target.value); if (error) setError('') }}
                  onBlur={() => setTouched(true)}
                  placeholder="Indtast din hjemmeside, f.eks. minside.dk"
                  className={`w-full h-14 px-5 rounded-xl border-2 outline-none text-base sm:text-lg transition-all bg-white ${
                    showValidationHint
                      ? 'border-yellow-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100'
                      : 'border-dark-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100'
                  }`}
                  disabled={scanning}
                  autoComplete="url"
                />
                {showValidationHint && (
                  <p className="mt-1.5 text-yellow-600 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Skriv en fuld adresse, f.eks. minside.dk
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={scanning || !url.trim()}
                className="h-14 px-6 sm:px-8 gradient-brand text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-base sm:text-lg whitespace-nowrap shadow-lg shadow-brand-500/20"
              >
                {scanning ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Scanner...
                  </>
                ) : (
                  <>
                    Tjek min side
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
            {error && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>
        </form>
        <p className="mt-4 text-center text-xs text-dark-300">
          Gratis. Ingen login. Ingen kreditkort. Resultat på 30 sekunder.
        </p>
      </div>
    </section>
  )
}
