import { useState, useRef } from 'react'
import type { ScanResult } from '@/types'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Scanner from '@/components/Scanner'
import ScanningOverlay from '@/components/ScanningOverlay'
import Results from '@/components/Results'
import DemoResult from '@/components/DemoResult'
import HowItWorks from '@/components/HowItWorks'
import Pricing from '@/components/Pricing'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'

export default function App() {
  const [result, setResult] = useState<ScanResult | null>(null)
  const [scanning, setScanning] = useState(false)
  const [scannedUrl, setScannedUrl] = useState('')
  const resultsRef = useRef<HTMLDivElement>(null)

  const handleResult = (r: ScanResult) => {
    setResult(r)
    setScannedUrl(r.url)
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {scanning && <ScanningOverlay />}
        {!result ? (
          <>
            <Hero />
            <Scanner
              onResult={handleResult}
              scanning={scanning}
              setScanning={setScanning}
            />
            <DemoResult />
            <HowItWorks />
            <Pricing />
          </>
        ) : (
          <div ref={resultsRef}>
            <Results
              result={result}
              onReset={() => { setResult(null); window.scrollTo({ top: 0 }) }}
            />
          </div>
        )}
        <ContactForm prefilledWebsite={scannedUrl} />
      </main>
      <Footer />
    </div>
  )
}
