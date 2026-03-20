import { useState, type FormEvent } from 'react'
import { Send, CheckCircle, Shield, Clock, Star, ArrowRight, Mail, MessageSquare } from 'lucide-react'
import { submitLead } from '@/lib/api'

interface Props {
  prefilledWebsite?: string
}

export default function ContactForm({ prefilledWebsite }: Props) {
  const [form, setForm] = useState({ name: '', email: '', website: prefilledWebsite || '', phone: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!form.name.trim()) errors.name = 'Indtast dit navn'
    if (!form.email.trim()) errors.email = 'Indtast din email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Indtast en gyldig email'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSending(true)
    setError('')
    try {
      await submitLead({ ...form, message: form.phone ? `Tlf: ${form.phone}\n${form.message}` : form.message })
      setSent(true)
    } catch {
      setError('Noget gik galt. Du kan også skrive direkte til os på kontakt@aism.dk')
    } finally {
      setSending(false)
    }
  }

  const update = (key: string, val: string) => {
    setForm(f => ({ ...f, [key]: val }))
    if (fieldErrors[key]) setFieldErrors(e => ({ ...e, [key]: '' }))
  }

  // "What happens next" success state
  if (sent) {
    return (
      <section id="contact" className="py-20">
        <div className="max-w-lg mx-auto px-4">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-dark-900 mb-2">Vi har modtaget din besked!</h2>
            <p className="text-dark-500 mb-8">Her er hvad der sker nu:</p>

            <div className="space-y-4 text-left max-w-sm mx-auto">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-brand-600" />
                </div>
                <div>
                  <p className="font-semibold text-dark-900 text-sm">Inden 24 timer</p>
                  <p className="text-dark-500 text-sm">Vi gennemgår din scanning og sender dig et konkret tilbud</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-brand-600" />
                </div>
                <div>
                  <p className="font-semibold text-dark-900 text-sm">Kort opkald (valgfrit)</p>
                  <p className="text-dark-500 text-sm">Vi tilbyder et gratis 15-min gennemgang af dine resultater</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-brand-600" />
                </div>
                <div>
                  <p className="font-semibold text-dark-900 text-sm">Du beslutter</p>
                  <p className="text-dark-500 text-sm">Ingen pres, ingen binding. Du vælger om du vil gå videre</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-20 bg-dark-50/50">
      <div className="max-w-xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-dark-900 mb-3">
          Lad os fikse din AI-synlighed
        </h2>
        <p className="text-center text-dark-400 mb-8">
          Udfyld formularen — vi sender et konkret tilbud inden 24 timer. Ingen sælgersnak.
        </p>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-dark-100 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Navn *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                className={`w-full h-11 px-4 rounded-lg border outline-none text-sm transition-colors ${
                  fieldErrors.name ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100' : 'border-dark-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                }`}
                placeholder="Dit navn"
              />
              {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                className={`w-full h-11 px-4 rounded-lg border outline-none text-sm transition-colors ${
                  fieldErrors.email ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100' : 'border-dark-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                }`}
                placeholder="din@email.dk"
              />
              {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Hjemmeside</label>
              <input
                type="text"
                value={form.website}
                onChange={e => update('website', e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-dark-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none text-sm"
                placeholder="minside.dk"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Telefon</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => update('phone', e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-dark-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none text-sm"
                placeholder="+45 12 34 56 78"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Hvad har du brug for?</label>
            <textarea
              value={form.message}
              onChange={e => update('message', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-dark-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none text-sm resize-none"
              placeholder="F.eks. 'Jeg vil gerne have hjælp til at blive synlig i ChatGPT'"
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={sending}
            className="w-full h-12 gradient-brand text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
          >
            {sending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sender...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send — få tilbud inden 24 timer
              </>
            )}
          </button>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-dark-400 pt-1">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Ingen binding</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Svar inden 24t</span>
            <span className="flex items-center gap-1"><Star className="w-3 h-3" /> Fast pris</span>
          </div>
        </form>
      </div>
    </section>
  )
}
