import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bot, User, Send, Paperclip, CheckCircle, RotateCcw,
  FileText, Upload, X, ChevronRight, LogOut, LayoutDashboard,
  MessageSquare, Calendar, Activity, Settings, AlertCircle,
  Clock, Zap, BookOpen, ArrowRight
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type Role = 'bot' | 'user'
type MsgType = 'text' | 'options' | 'upload'

interface Message {
  id: number
  role: Role
  content: string
  options?: string[]
  uploadCards?: DocCard[]
}

interface DocCard {
  id: string
  name: string
  reason: string
  required: boolean
  status: 'pending' | 'uploaded' | 'skipped'
  file?: string
}

interface CaseBrief {
  jurisdiction: string
  caseTypes: string[]
  keyFacts: string[]
  nextSteps: string[]
  urgency: string
  timeline: string
}

interface IntakeStep {
  id: number
  label: string
  sub: string
  status: 'done' | 'active' | 'pending'
}

// ─── Document requirements per case type ────────────────────────────────────

const docRequirements: Record<string, DocCard[]> = {
  'Kündigung / Entlassung': [
    { id: 'd1', name: 'Kündigungsschreiben', reason: 'Belegt den offiziellen Kündigungsgrund und das Datum.', required: true, status: 'pending' },
    { id: 'd2', name: 'Arbeitsvertrag', reason: 'Zeigt vereinbarte Bedingungen und Kündigungsfristen.', required: true, status: 'pending' },
    { id: 'd3', name: 'Gehaltsabrechnungen (letzte 3 Monate)', reason: 'Belegt Lohn und Beschäftigungsdauer.', required: true, status: 'pending' },
    { id: 'd4', name: 'Leistungsbeurteilungen', reason: 'Widerlegt ggf. vorgeschobene Kündigungsgründe.', required: false, status: 'pending' },
  ],
  'Vertragsstreit': [
    { id: 'd1', name: 'Originalvertrag', reason: 'Dokument des Streitgegenstands.', required: true, status: 'pending' },
    { id: 'd2', name: 'Vertragsänderungen / Nachträge', reason: 'Änderungen an den ursprünglichen Bedingungen.', required: false, status: 'pending' },
    { id: 'd3', name: 'Schriftverkehr (E-Mails, Briefe)', reason: 'Belegt Kommunikation und Vereinbarungen.', required: true, status: 'pending' },
    { id: 'd4', name: 'Rechnungen / Zahlungsbelege', reason: 'Dokumentiert finanzielle Transaktionen.', required: false, status: 'pending' },
  ],
  'Lohnrückstand': [
    { id: 'd1', name: 'Gehaltsabrechnungen', reason: 'Belegt ausstehende Zahlungen.', required: true, status: 'pending' },
    { id: 'd2', name: 'Arbeitszeitnachweise / Stundenzettel', reason: 'Dokumentiert geleistete Arbeitsstunden.', required: true, status: 'pending' },
    { id: 'd3', name: 'Arbeitsvertrag', reason: 'Vereinbarte Vergütungsbedingungen.', required: true, status: 'pending' },
  ],
  'Scheidung': [
    { id: 'd1', name: 'Heiratsurkunde', reason: 'Nachweis der Ehe.', required: true, status: 'pending' },
    { id: 'd2', name: 'Finanzielle Unterlagen (Kontoauszüge, Steuererklärungen)', reason: 'Vermögensaufteilung.', required: true, status: 'pending' },
    { id: 'd3', name: 'Immobiliendokumente', reason: 'Eigentumsnachweise gemeinsamer Güter.', required: false, status: 'pending' },
    { id: 'd4', name: 'Ehevertrag (falls vorhanden)', reason: 'Beeinflusst die Vermögensaufteilung.', required: false, status: 'pending' },
  ],
  'Sorgerecht / Unterhalt': [
    { id: 'd1', name: 'Geburtsurkunde(n) des Kindes', reason: 'Nachweis der Eltern-Kind-Beziehung.', required: true, status: 'pending' },
    { id: 'd2', name: 'Bestehende Sorge-/Unterhaltsvereinbarungen', reason: 'Aktuelle rechtliche Vereinbarungen.', required: false, status: 'pending' },
    { id: 'd3', name: 'Einkommensnachweise', reason: 'Grundlage für Unterhaltsberechnungen.', required: true, status: 'pending' },
  ],
  'Mietrecht': [
    { id: 'd1', name: 'Mietvertrag', reason: 'Vereinbarte Mietbedingungen.', required: true, status: 'pending' },
    { id: 'd2', name: 'Korrespondenz mit Vermieter', reason: 'Dokumentiert Konflikte oder Versprechen.', required: true, status: 'pending' },
    { id: 'd3', name: 'Fotos der Mängel / Schäden', reason: 'Beweissicherung für den Zustand.', required: false, status: 'pending' },
    { id: 'd4', name: 'Zahlungsbelege (Miete)', reason: 'Nachweis geleisteter Zahlungen.', required: false, status: 'pending' },
  ],
  'default': [
    { id: 'd1', name: 'Relevante Verträge oder Vereinbarungen', reason: 'Kernunterlagen des Falles.', required: true, status: 'pending' },
    { id: 'd2', name: 'Schriftverkehr', reason: 'Briefe, E-Mails, Nachrichten zum Streitfall.', required: true, status: 'pending' },
    { id: 'd3', name: 'Finanzielle Unterlagen', reason: 'Kontoauszüge, Rechnungen, Belege.', required: false, status: 'pending' },
  ],
}

// ─── Bot conversation steps ───────────────────────────────────────────────────

type ConvPhase = 'greeting' | 'area' | 'issue' | 'description' | 'timeline' | 'documents' | 'goal' | 'urgency' | 'done'

const legalAreas: Record<string, string[]> = {
  'Arbeitsrecht': ['Kündigung / Entlassung', 'Vertragsstreit', 'Lohnrückstand', 'Sonstiges Arbeitsrecht'],
  'Familienrecht': ['Scheidung', 'Sorgerecht / Unterhalt', 'Adoption', 'Sonstiges Familienrecht'],
  'Miet- & Immobilienrecht': ['Mietrecht', 'Immobilienkauf/-verkauf', 'Baurecht', 'Sonstiges Immobilienrecht'],
  'Vertragsrecht': ['Vertragsstreit', 'Vertragserstellung', 'AGB-Prüfung', 'Sonstiges Vertragsrecht'],
  'Strafrecht': ['Strafanzeige', 'Verteidigung', 'Ordnungswidrigkeiten', 'Sonstiges Strafrecht'],
  'Erbrecht': ['Testament', 'Erbstreit', 'Nachlassverwaltung', 'Sonstiges Erbrecht'],
}

const timelineOptions = ['Heute / Diese Woche', 'Letzten Monat', 'Letztes Jahr', 'Länger als 1 Jahr']
const goalOptions = ['Entschädigung / Schadensersatz', 'Rechtliche Absicherung', 'Vertragsauflösung', 'Gerichtliches Verfahren', 'Außergerichtliche Einigung']
const urgencyOptions = [
  { label: 'Sofort (< 48 Std.)', color: '#EF4444' },
  { label: 'Diese Woche', color: '#F59E0B' },
  { label: 'Diesen Monat', color: '#10B981' },
  { label: 'Keine Eile', color: 'var(--t4)' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function IntakeAI() {
  const navigate = useNavigate()
  const [userName] = useState('Max Mustermann')
  const [phase, setPhase] = useState<ConvPhase>('greeting')
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [uploadDocs, setUploadDocs] = useState<DocCard[]>([])
  const [intakeSteps, setIntakeSteps] = useState<IntakeStep[]>([
    { id: 1, label: 'Grunddaten', sub: 'Name, Kontakt', status: 'done' },
    { id: 2, label: 'Falldetails', sub: 'Art, Zeitraum, Fakten', status: 'active' },
    { id: 3, label: 'Dokumente', sub: 'Verträge, Briefe', status: 'pending' },
    { id: 4, label: 'Ziele & Dringlichkeit', sub: 'Gewünschtes Ergebnis', status: 'pending' },
  ])
  const [brief, setBrief] = useState<CaseBrief>({
    jurisdiction: 'Deutschland',
    caseTypes: [],
    keyFacts: [],
    nextSteps: [],
    urgency: '',
    timeline: '',
  })
  const [selectedArea, setSelectedArea] = useState('')
  const [selectedIssue, setSelectedIssue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const addBotMessage = useCallback((content: string, opts?: { options?: string[]; uploadCards?: DocCard[] }) => {
    return new Promise<void>(resolve => {
      setIsTyping(true)
      const delay = 700 + content.length * 12
      setTimeout(() => {
        setIsTyping(false)
        setMessages(prev => [...prev, {
          id: Date.now(),
          role: 'bot',
          content,
          ...opts,
        }])
        resolve()
      }, Math.min(delay, 2200))
    })
  }, [])

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content }])
  }

  // Start conversation
  useEffect(() => {
    const firstName = userName.split(' ')[0]
    addBotMessage(
      `Hallo, ${firstName}! Ich bin Ihr KI-gestützter Rechts-Intake-Assistent.\n\nIch helfe Ihnen dabei, die wichtigsten Informationen zu Ihrem Fall zu erfassen und die richtigen Dokumente zusammenzustellen — bevor Sie mit einem spezialisierten Anwalt sprechen.\n\nIn welchem Rechtsgebiet liegt Ihr Anliegen?`,
      { options: Object.keys(legalAreas) }
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const advanceStep = (from: number, to: number) => {
    setIntakeSteps(prev => prev.map(s => ({
      ...s,
      status: s.id < to ? 'done' : s.id === to ? 'active' : s.id === from ? 'done' : s.status,
    })))
  }

  const handleOption = async (value: string) => {
    addUserMessage(value)

    if (phase === 'greeting') {
      setSelectedArea(value)
      setPhase('area')
      setBrief(b => ({ ...b, caseTypes: [value] }))
      await addBotMessage(
        `Verstanden – **${value}**. Welches spezifische Problem liegt vor?`,
        { options: legalAreas[value] ?? ['Vertragsstreit', 'Sonstige Klage', 'Beratung'] }
      )
    } else if (phase === 'area') {
      setSelectedIssue(value)
      setPhase('issue')
      setBrief(b => ({ ...b, caseTypes: [selectedArea, value], nextSteps: [`Dokumente für ${value} zusammenstellen`, 'Erstberatung buchen'] }))
      await addBotMessage(
        `Gut. Sie benötigen Hilfe bei **${value}**.\n\nKönnen Sie kurz beschreiben, was genau passiert ist? (z. B. wann, was die andere Partei getan hat, was Sie sich erhofft haben)`
      )
      setPhase('description')
    } else if (phase === 'timeline') {
      setBrief(b => ({
        ...b,
        timeline: value,
        keyFacts: [...b.keyFacts, `Ereignis: ${value}`],
      }))
      setPhase('documents')
      advanceStep(2, 3)
      const docs = docRequirements[selectedIssue] ?? docRequirements['default']
      setUploadDocs(docs.map(d => ({ ...d, status: 'pending' })))
      await addBotMessage(
        `Danke. Basierend auf Ihrem Fall (**${selectedIssue}**) habe ich ermittelt, welche Dokumente für Ihre Erstberatung benötigt werden.\n\nBitte laden Sie die folgenden Unterlagen hoch. Pflichtdokumente sind mit einem Stern markiert.`,
        { uploadCards: docs }
      )
    } else if (phase === 'goal') {
      setBrief(b => ({
        ...b,
        keyFacts: [...b.keyFacts, `Ziel: ${value}`],
        nextSteps: [...b.nextSteps.filter(s => !s.startsWith('Ziel')), `Angestrebtes Ergebnis: ${value}`],
      }))
      setPhase('urgency')
      advanceStep(3, 4)
      await addBotMessage(
        `Verstanden – Sie streben **${value}** an.\n\nWie dringend ist Ihr Anliegen?`,
        { options: urgencyOptions.map(u => u.label) }
      )
    } else if (phase === 'urgency') {
      setBrief(b => ({ ...b, urgency: value }))
      setPhase('done')
      await addBotMessage(
        `Perfekt! Ich habe alle Informationen erfasst.\n\nIhr Fallbrief ist vollständig. Ein auf **${selectedArea}** spezialisierter Anwalt wird Ihre Unterlagen prüfen und sich innerhalb von **24 Stunden** bei Ihnen melden.\n\nMöchten Sie direkt einen Termin buchen?`
      )
    }
  }

  const handleTextSubmit = async () => {
    const val = inputValue.trim()
    if (!val) return
    setInputValue('')
    addUserMessage(val)

    if (phase === 'description') {
      setBrief(b => ({
        ...b,
        keyFacts: [...b.keyFacts, val.length > 80 ? val.slice(0, 80) + '…' : val],
      }))
      setPhase('timeline')
      await addBotMessage(
        `Danke für diese Details. Ich habe die wichtigsten Fakten notiert.\n\nWann hat das auslösende Ereignis stattgefunden?`,
        { options: timelineOptions }
      )
    } else {
      // Fallback for any other text input
      await addBotMessage('Danke! Bitte fahren Sie fort.')
    }
  }

  const handleDocUpload = (docId: string, fileName: string) => {
    setUploadDocs(prev => prev.map(d => d.id === docId ? { ...d, status: 'uploaded', file: fileName } : d))
    setBrief(b => ({
      ...b,
      nextSteps: b.nextSteps.map(s =>
        s.includes('Dokumente') ? `${uploadDocs.filter(d => d.status === 'uploaded').length + 1} Dokument(e) hochgeladen` : s
      ),
    }))
  }

  const handleDocSkip = (docId: string) => {
    setUploadDocs(prev => prev.map(d => d.id === docId ? { ...d, status: 'skipped' } : d))
  }

  const handleDocsDone = async () => {
    const uploaded = uploadDocs.filter(d => d.status === 'uploaded').length
    const required = uploadDocs.filter(d => d.required && d.status !== 'uploaded').length
    if (required > 0) {
      await addBotMessage(`Bitte laden Sie noch ${required} Pflichtdokument(e) hoch, bevor Sie fortfahren.`)
      return
    }
    setPhase('goal')
    advanceStep(3, 4)
    setBrief(b => ({
      ...b,
      nextSteps: [`${uploaded} Dokument(e) hochgeladen ✓`, 'Erstberatung vorbereiten', 'Anwalt zuweisen'],
    }))
    await addBotMessage(
      `Ausgezeichnet! Sie haben ${uploaded} Dokument(e) erfolgreich hochgeladen.\n\nWas ist Ihr gewünschtes Ergebnis in diesem Fall?`,
      { options: goalOptions }
    )
  }

  const handleRestart = () => {
    setMessages([])
    setPhase('greeting')
    setSelectedArea('')
    setSelectedIssue('')
    setUploadDocs([])
    setBrief({ jurisdiction: 'Deutschland', caseTypes: [], keyFacts: [], nextSteps: [], urgency: '', timeline: '' })
    setIntakeSteps(prev => prev.map((s, i) => ({ ...s, status: i === 0 ? 'done' : i === 1 ? 'active' : 'pending' })))
    const firstName = userName.split(' ')[0]
    addBotMessage(
      `Hallo, ${firstName}! Ich bin Ihr KI-gestützter Rechts-Intake-Assistent. In welchem Rechtsgebiet liegt Ihr Anliegen?`,
      { options: Object.keys(legalAreas) }
    )
  }

  const needsTextInput = phase === 'description'
  const uploadedCount = uploadDocs.filter(d => d.status === 'uploaded').length
  const requiredMissing = uploadDocs.filter(d => d.required && d.status !== 'uploaded').length

  const navItems = [
    { label: 'Mandanten-Dashboard', icon: <LayoutDashboard size={16} />, to: '/portal' },
    { label: 'Intake-Assistent', icon: <Bot size={16} />, to: '/intake', active: true },
    { label: 'Dokumente & Nachrichten', icon: <MessageSquare size={16} />, to: '/portal' },
    { label: 'Termine', icon: <Calendar size={16} />, to: '/booking' },
    { label: 'Beratungsstatus', icon: <Activity size={16} />, to: '/portal' },
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Right Sidebar ────────────────────────────────────────────────── */}
      <div style={{ width: 230, background: 'var(--bg-2)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0, order: 1 }}>
        {/* Logo */}
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--border-sub)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="logo-circle-sm">LF</div>
          <span style={{ fontWeight: 800, color: 'var(--t1)', fontSize: '1rem' }}>LexFlow</span>
        </div>

        {/* Nav */}
        <div style={{ padding: '0.875rem 0.625rem', flex: 1 }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--t5)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 0.5rem', marginBottom: '0.5rem' }}>Hauptmenü</div>
          {navItems.map(item => (
            <Link key={item.label} to={item.to}
              style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 0.625rem', borderRadius: 8, marginBottom: '0.125rem', textDecoration: 'none', background: item.active ? 'rgba(37,68,72,0.2)' : 'transparent', color: item.active ? 'var(--accent-d)' : 'var(--t4)', fontSize: '0.8125rem', fontWeight: item.active ? 600 : 400, transition: 'all 0.15s', border: item.active ? '1px solid rgba(37,68,72,0.3)' : '1px solid transparent' }}
              onMouseEnter={e => { if (!item.active) { e.currentTarget.style.background = 'var(--bg-card-sub)'; e.currentTarget.style.color = 'var(--t2)' } }}
              onMouseLeave={e => { if (!item.active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--t4)' } }}
            >
              {item.icon} {item.label}
            </Link>
          ))}

          {/* Intake Progress */}
          <div style={{ marginTop: '1.5rem', padding: '0 0.5rem' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--t5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>Intake-Fortschritt</div>
            {intakeSteps.map((step, i) => (
              <div key={step.id} style={{ display: 'flex', gap: '0.625rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                {/* Connector line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 700, flexShrink: 0,
                    background: step.status === 'done' ? 'linear-gradient(135deg, #10B981, #059669)' : step.status === 'active' ? 'linear-gradient(135deg, #254448, #254448)' : 'var(--border)',
                    color: step.status === 'pending' ? 'var(--t5)' : 'white',
                    boxShadow: step.status === 'active' ? '0 0 10px rgba(37,68,72,0.4)' : 'none',
                  }}>
                    {step.status === 'done' ? <CheckCircle size={12} /> : step.id}
                  </div>
                  {i < intakeSteps.length - 1 && (
                    <div style={{ width: 1, height: 18, background: step.status === 'done' ? 'rgba(16,185,129,0.4)' : 'var(--bg-card-sub)', marginTop: '2px' }} />
                  )}
                </div>
                <div style={{ paddingTop: '2px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: step.status === 'active' ? 600 : 500, color: step.status === 'active' ? 'var(--accent-d)' : step.status === 'done' ? '#254448' : 'var(--t4)' }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: step.status === 'pending' ? 'var(--t6)' : 'var(--t5)' }}>{step.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account */}
        <div style={{ padding: '0.875rem 0.625rem', borderTop: '1px solid var(--border-sub)' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--t5)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 0.5rem', marginBottom: '0.5rem' }}>Konto</div>
          <Link to="/portal" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 0.625rem', borderRadius: 8, textDecoration: 'none', color: 'var(--t4)', fontSize: '0.8125rem', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--t2)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--t4)'}
          >
            <Settings size={15} /> Profil & Einstellungen
          </Link>
          <button onClick={() => navigate('/')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 0.625rem', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t4)', fontSize: '0.8125rem', textAlign: 'left', fontFamily: 'Inter, sans-serif', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#FCA5A5'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--t4)'}
          >
            <LogOut size={15} /> Abmelden
          </button>
        </div>
      </div>

      {/* ── Main Area ────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <div style={{ height: 54, borderBottom: '1px solid var(--border-sub)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.25rem', background: 'var(--bg-header)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #254448, #254448)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(37,68,72,0.4)' }}>
              <Bot size={14} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--t1)', fontSize: '0.9rem' }}>KI-Rechtsassistent</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--t5)' }}>Fallvorbereitung · {phase === 'done' ? 'Abgeschlossen' : 'Läuft…'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleRestart} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.4rem 0.875rem', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.22)', color: 'var(--t2)', fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = 'var(--t1)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--t2)' }}
            >
              <RotateCcw size={13} /> Neu starten
            </button>
            {phase === 'done' && (
              <Link to="/booking" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.4rem 0.875rem', borderRadius: 8, background: 'linear-gradient(135deg, #254448, #254448)', border: 'none', color: 'white', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', transition: 'all 0.15s', boxShadow: '0 0 16px rgba(37,68,72,0.3)' }}>
                Termin buchen <ArrowRight size={13} />
              </Link>
            )}
          </div>
        </div>

        {/* Content row */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* ── Chat Column ──────────────────────────────────────────────── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1.25rem' }}>
              {messages.map((msg, mi) => (
                <div key={msg.id}>
                  {/* Message bubble */}
                  <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '0.875rem', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                    {/* Avatar */}
                    <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: msg.role === 'bot' ? 'linear-gradient(135deg, #254448, #254448)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: msg.role === 'bot' ? '0 0 10px rgba(37,68,72,0.35)' : 'none', marginTop: '2px' }}>
                      {msg.role === 'bot' ? <Bot size={15} color="white" /> : <User size={15} color="#B0B8D8" />}
                    </div>

                    <div style={{ maxWidth: msg.role === 'user' ? '65%' : '75%' }}>
                      <div style={{ padding: '0.75rem 1rem', borderRadius: msg.role === 'bot' ? '3px 12px 12px 12px' : '12px 3px 12px 12px', background: msg.role === 'bot' ? 'var(--bg-card-sub)' : 'linear-gradient(135deg, #254448, #254448)', border: msg.role === 'bot' ? '1px solid rgba(255,255,255,0.1)' : 'none', color: 'var(--t1)', fontSize: '0.8875rem', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
                        {msg.content.split('**').map((part, i) =>
                          i % 2 === 1
                            ? <strong key={i} style={{ color: msg.role === 'user' ? 'rgba(255,255,255,0.9)' : 'var(--accent-d)' }}>{part}</strong>
                            : part
                        )}
                      </div>

                      {/* Option buttons — only on last bot message */}
                      {msg.options && mi === messages.length - 1 && phase !== 'done' && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                          {msg.options.map(opt => (
                            <button key={opt} onClick={() => handleOption(opt)}
                              style={{ padding: '0.45rem 0.875rem', borderRadius: 20, border: '1.5px solid rgba(37,68,72,0.55)', background: 'rgba(37,68,72,0.1)', color: 'var(--accent-d)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Inter, sans-serif' }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,68,72,0.2)'; e.currentTarget.style.borderColor = 'rgba(37,68,72,0.8)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(37,68,72,0.18)' }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37,68,72,0.1)'; e.currentTarget.style.borderColor = 'rgba(37,68,72,0.55)'; e.currentTarget.style.boxShadow = 'none' }}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Upload cards — only on last bot message */}
                      {msg.uploadCards && mi === messages.length - 1 && phase === 'documents' && (
                        <div style={{ marginTop: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 480 }}>
                          {uploadDocs.map(doc => (
                            <UploadCard
                              key={doc.id}
                              doc={doc}
                              onUpload={handleDocUpload}
                              onSkip={handleDocSkip}
                              fileInputRef={fileInputRef}
                            />
                          ))}
                          {/* Done button */}
                          <button
                            onClick={handleDocsDone}
                            disabled={requiredMissing > 0}
                            style={{ marginTop: '0.375rem', padding: '0.625rem 1.25rem', borderRadius: 10, background: requiredMissing > 0 ? 'var(--bg-card-sub)' : 'linear-gradient(135deg, #254448, #254448)', border: 'none', color: requiredMissing > 0 ? 'var(--t5)' : 'white', fontSize: '0.875rem', fontWeight: 600, cursor: requiredMissing > 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', boxShadow: requiredMissing === 0 ? '0 0 14px rgba(37,68,72,0.3)' : 'none' }}
                          >
                            <CheckCircle size={15} />
                            {requiredMissing > 0 ? `Noch ${requiredMissing} Pflichtdokument(e) ausstehend` : `Dokumente bestätigen (${uploadedCount} hochgeladen)`}
                          </button>
                        </div>
                      )}

                      {/* Done CTA */}
                      {phase === 'done' && mi === messages.length - 1 && (
                        <div style={{ marginTop: '0.875rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <Link to="/booking" className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1.125rem' }}>
                            <Calendar size={14} /> Termin buchen
                          </Link>
                          <Link to="/portal" className="btn-secondary" style={{ fontSize: '0.875rem', padding: '0.5rem 1.125rem' }}>
                            Zum Portal
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', marginBottom: '0.875rem' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #254448, #254448)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(37,68,72,0.35)' }}>
                    <Bot size={15} color="white" />
                  </div>
                  <div style={{ padding: '0.75rem 1rem', borderRadius: '3px 12px 12px 12px', background: 'var(--bg-card-sub)', border: '1px solid rgba(255,255,255,0.22)', display: 'flex', gap: '0.275rem', alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#254448', animation: `bounce 1.2s ease-in-out ${i * 0.18}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div style={{ borderTop: '1px solid var(--border-sub)', padding: '0.875rem 1.25rem', background: 'var(--bg-header)', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t5)', padding: '0.375rem', borderRadius: 8, display: 'flex', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#254448'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--t5)'}
                >
                  <Paperclip size={17} />
                </button>
                <input
                  className="input-dark"
                  style={{ flex: 1, fontSize: '0.875rem' }}
                  placeholder={needsTextInput ? 'Beschreiben Sie Ihre Situation…' : 'Wählen Sie eine Option oben oder schreiben Sie…'}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && needsTextInput && handleTextSubmit()}
                  disabled={!needsTextInput && phase !== 'done'}
                />
                <button
                  onClick={needsTextInput ? handleTextSubmit : undefined}
                  disabled={!needsTextInput || !inputValue.trim()}
                  style={{ width: 36, height: 36, borderRadius: 8, background: needsTextInput && inputValue.trim() ? 'linear-gradient(135deg, #254448, #254448)' : 'var(--bg-card-sub)', border: 'none', cursor: needsTextInput && inputValue.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', color: needsTextInput && inputValue.trim() ? 'white' : '#3A4060', flexShrink: 0, transition: 'all 0.2s', boxShadow: needsTextInput && inputValue.trim() ? '0 0 12px rgba(37,68,72,0.3)' : 'none' }}
                >
                  <Send size={15} />
                </button>
              </div>
              <p style={{ fontSize: '0.6875rem', color: 'var(--t5)', textAlign: 'center', marginTop: '0.5rem' }}>
                Ihre Informationen werden sicher übertragen und vertraulich behandelt.
              </p>
            </div>
          </div>

          {/* ── Live Case Brief ───────────────────────────────────────────── */}
          <div style={{ width: 272, borderLeft: '1px solid var(--border)', background: 'var(--bg-2)', padding: '1.125rem', overflowY: 'auto', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.125rem' }}>
              <BookOpen size={14} color="#254448" />
              <span style={{ fontWeight: 700, color: 'var(--t1)', fontSize: '0.875rem' }}>Live-Fallbrief</span>
              {phase !== 'greeting' && phase !== 'area' && (
                <span style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.6)', animation: 'pulse-dot 2s ease-in-out infinite' }} />
              )}
            </div>

            {/* Jurisdiction */}
            <BriefSection label="Zuständigkeit" color="#254448">
              <BriefPill value={brief.jurisdiction} color="#254448" />
            </BriefSection>

            {/* Case type */}
            <BriefSection label="Fallart" color="#254448">
              {brief.caseTypes.length === 0
                ? <span style={{ color: 'var(--t5)', fontSize: '0.8rem', fontStyle: 'italic' }}>Ausstehend</span>
                : brief.caseTypes.map((ct, i) => <BriefPill key={i} value={ct} color="#254448" />)
              }
            </BriefSection>

            {/* Key facts */}
            <BriefSection label="Wichtige Fakten" color="#254448">
              {brief.keyFacts.length === 0
                ? <span style={{ color: 'var(--t5)', fontSize: '0.8rem', fontStyle: 'italic' }}>Noch keine Fakten</span>
                : brief.keyFacts.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.375rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#254448', marginTop: '5px', flexShrink: 0 }} />
                    <span style={{ color: 'var(--t2)', fontSize: '0.8rem', lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))
              }
            </BriefSection>

            {/* Documents status */}
            {uploadDocs.length > 0 && (
              <BriefSection label="Dokumente" color="#10B981">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {uploadDocs.map(doc => (
                    <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <div style={{ width: 14, height: 14, borderRadius: '50%', background: doc.status === 'uploaded' ? 'rgba(16,185,129,0.2)' : doc.status === 'skipped' ? 'rgba(245,158,11,0.15)' : 'var(--bg-card-sub)', border: `1px solid ${doc.status === 'uploaded' ? 'rgba(16,185,129,0.5)' : doc.status === 'skipped' ? 'rgba(245,158,11,0.4)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {doc.status === 'uploaded' && <CheckCircle size={8} color="#254448" />}
                        {doc.status === 'skipped' && <X size={7} color="#FCD34D" />}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: doc.status === 'uploaded' ? '#254448' : doc.status === 'skipped' ? '#FCD34D' : 'var(--t5)', lineHeight: 1.3 }}>
                        {doc.name}{doc.required ? ' *' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </BriefSection>
            )}

            {/* Next steps */}
            <BriefSection label="Nächste Schritte" color="#F59E0B">
              {brief.nextSteps.length === 0
                ? <span style={{ color: 'var(--t5)', fontSize: '0.8rem', fontStyle: 'italic' }}>Noch keine</span>
                : brief.nextSteps.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.375rem', alignItems: 'flex-start' }}>
                    <ChevronRight size={11} color="#F59E0B" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <span style={{ color: 'var(--t2)', fontSize: '0.8rem', lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))
              }
            </BriefSection>

            {/* Urgency */}
            {brief.urgency && (
              <BriefSection label="Dringlichkeit" color="#EF4444">
                <BriefPill value={brief.urgency} color={urgencyOptions.find(u => u.label === brief.urgency)?.color ?? 'var(--t4)'} />
              </BriefSection>
            )}

            {/* Completion */}
            {phase === 'done' && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, textAlign: 'center' }}>
                <CheckCircle size={20} color="#254448" style={{ marginBottom: '0.375rem' }} />
                <div style={{ color: '#254448', fontSize: '0.8125rem', fontWeight: 600 }}>Fallbrief vollständig</div>
                <div style={{ color: 'var(--t5)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Bereit zur Anwaltszuweisung</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}

// ─── Upload Card Component ────────────────────────────────────────────────────

function UploadCard({ doc, onUpload, onSkip, fileInputRef }: {
  doc: DocCard
  onUpload: (id: string, name: string) => void
  onSkip: (id: string) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}) {
  const localRef = useRef<HTMLInputElement>(null)

  const handleClick = () => localRef.current?.click()

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onUpload(doc.id, file.name)
  }

  return (
    <div style={{
      background: doc.status === 'uploaded' ? 'rgba(16,185,129,0.08)' : doc.status === 'skipped' ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
      border: `1px solid ${doc.status === 'uploaded' ? 'rgba(16,185,129,0.35)' : doc.status === 'skipped' ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.1)'}`,
      borderRadius: 10, padding: '0.75rem 0.875rem',
      transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.2rem' }}>
            <FileText size={13} color={doc.status === 'uploaded' ? '#254448' : '#254448'} />
            <span style={{ fontWeight: 600, color: doc.status === 'skipped' ? '#3A4060' : 'var(--t1)', fontSize: '0.8125rem' }}>
              {doc.name}
              {doc.required && <span style={{ color: '#EF4444', marginLeft: '0.25rem' }}>*</span>}
            </span>
          </div>
          <p style={{ color: doc.status === 'skipped' ? '#2E3460' : 'var(--t4)', fontSize: '0.75rem', lineHeight: 1.4 }}>{doc.reason}</p>
          {doc.file && <p style={{ color: '#254448', fontSize: '0.7rem', marginTop: '0.25rem' }}>✓ {doc.file}</p>}
        </div>

        <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
          {doc.status === 'uploaded' ? (
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={14} color="#254448" />
            </div>
          ) : doc.status === 'skipped' ? (
            <button onClick={handleClick}
              style={{ padding: '0.3rem 0.625rem', borderRadius: 6, background: 'rgba(37,68,72,0.15)', border: '1px solid rgba(37,68,72,0.35)', color: 'var(--accent-d)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              Hochladen
            </button>
          ) : (
            <>
              <button onClick={handleClick}
                style={{ padding: '0.3rem 0.625rem', borderRadius: 6, background: 'linear-gradient(135deg, #254448, #254448)', border: 'none', color: 'white', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'Inter, sans-serif' }}>
                <Upload size={11} /> Hochladen
              </button>
              {!doc.required && (
                <button onClick={() => onSkip(doc.id)}
                  style={{ padding: '0.3rem 0.625rem', borderRadius: 6, background: 'transparent', border: '1px solid var(--border)', color: 'var(--t4)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                  Überspringen
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <input ref={localRef} type="file" style={{ display: 'none' }} onChange={handleFile} accept=".pdf,.doc,.docx,.jpg,.png" />
    </div>
  )
}

// ─── Brief Section Helper ─────────────────────────────────────────────────────

function BriefSection({ label, color, children }: { label: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--t5)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 5px ${color}80` }} />
        {label}
      </div>
      <div style={{ paddingLeft: '0.75rem' }}>
        {children}
      </div>
    </div>
  )
}

function BriefPill({ value, color }: { value: string; color: string }) {
  return (
    <span style={{ display: 'inline-block', padding: '0.2rem 0.625rem', borderRadius: 6, background: `${color}18`, border: `1px solid ${color}40`, color: value ? 'var(--t2)' : '#3A4060', fontSize: '0.8rem', fontWeight: 500, marginRight: '0.25rem', marginBottom: '0.25rem' }}>
      {value || '—'}
    </span>
  )
}
