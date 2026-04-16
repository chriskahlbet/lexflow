import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, Calendar, FileText, TrendingUp,
  Search, Bell, ChevronRight, MoreHorizontal,
  MessageSquare, Clock, AlertCircle, CheckCircle,
  Briefcase, BarChart3, Filter, Plus, Eye,
  ArrowUpRight, ArrowDownRight, Bot, Sparkles,
  Upload, Send, ChevronDown, Zap
} from 'lucide-react'

type TabId = 'overview' | 'clients' | 'calendar' | 'analytics' | 'ai'

const clients = [
  { id: 1, name: 'Maria Schmidt', initials: 'MS', area: 'Arbeitsrecht', status: 'in-progress', date: '18. Apr, 14:00', urgency: 'normal', progress: 65, lastContact: 'Vor 2 Std.' },
  { id: 2, name: 'Klaus Bauer', initials: 'KB', area: 'Vertragsrecht', status: 'new', date: '19. Apr, 10:30', urgency: 'soon', progress: 10, lastContact: 'Vor 1 Tag' },
  { id: 3, name: 'Eva Neumann', initials: 'EN', area: 'Scheidungsverfahren', status: 'waiting', date: '16. Apr, 09:00', urgency: 'urgent', progress: 40, lastContact: 'Vor 3 Std.' },
  { id: 4, name: 'Thomas Klein', initials: 'TK', area: 'Immobilienrecht', status: 'completed', date: '10. Apr, 11:00', urgency: 'normal', progress: 100, lastContact: 'Vor 5 Tagen' },
  { id: 5, name: 'Sandra Wolf', initials: 'SW', area: 'Erbrecht', status: 'in-progress', date: '22. Apr, 15:00', urgency: 'soon', progress: 55, lastContact: 'Vor 1 Std.' },
  { id: 6, name: 'Peter Braun', initials: 'PB', area: 'Strafrecht', status: 'urgent', date: 'Heute, 16:30', urgency: 'urgent', progress: 25, lastContact: 'Vor 30 Min.' },
  { id: 7, name: 'Lisa Fischer', initials: 'LF', area: 'Gesellschaftsrecht', status: 'new', date: '23. Apr, 13:00', urgency: 'normal', progress: 5, lastContact: 'Vor 2 Tagen' },
  { id: 8, name: 'Marc Weber', initials: 'MW', area: 'Ausländerrecht', status: 'waiting', date: '25. Apr, 14:30', urgency: 'soon', progress: 30, lastContact: 'Vor 4 Std.' },
]

const appointments = [
  { time: '09:30', client: 'Eva Neumann', area: 'Scheidungsverfahren', type: 'Videoanruf', duration: '60 Min.', status: 'confirmed', urgent: true },
  { time: '11:00', client: 'Thomas Klein', area: 'Immobilienrecht', type: 'Persönlich', duration: '45 Min.', status: 'confirmed', urgent: false },
  { time: '13:30', client: 'Neues Mandat (Intake)', area: 'Unbekannt', type: 'Telefon', duration: '30 Min.', status: 'pending', urgent: false },
  { time: '14:00', client: 'Maria Schmidt', area: 'Arbeitsrecht', type: 'Videoanruf', duration: '60 Min.', status: 'confirmed', urgent: false },
  { time: '16:30', client: 'Peter Braun', area: 'Strafrecht', type: 'Persönlich', duration: '90 Min.', status: 'confirmed', urgent: true },
]

const statCards = [
  { label: 'Aktive Mandate', value: '47', change: '+8', up: true, icon: <Briefcase size={18} />, color: '#254448' },
  { label: 'Neue diese Woche', value: '12', change: '+3', up: true, icon: <Users size={18} />, color: '#10B981' },
  { label: 'Termine heute', value: '5', change: '2 dringend', up: false, icon: <Calendar size={18} />, color: '#F59E0B' },
  { label: 'Ausstehend', value: '9', change: '-2', up: true, icon: <FileText size={18} />, color: '#EF4444' },
]

const statusConfig: Record<string, { label: string; cls: string }> = {
  new: { label: 'Neu', cls: 'status-new' },
  'in-progress': { label: 'Laufend', cls: 'status-in-progress' },
  waiting: { label: 'Wartend', cls: 'status-waiting' },
  completed: { label: 'Abgeschlossen', cls: 'status-completed' },
  urgent: { label: 'Dringend', cls: 'status-urgent' },
}

const cardStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  backdropFilter: 'blur(16px)',
  boxShadow: 'var(--card-shadow)',
}

// ── Mock AI Intake Summaries ────────────────────────────────────────────────
const aiIntakes = [
  {
    id: 1,
    client: 'Maria Schmidt',
    initials: 'MS',
    date: '15. Apr 2025, 09:14',
    legalArea: 'Arbeitsrecht',
    urgency: 'urgent',
    urgencyLabel: 'Dringend',
    description: 'Ungerechtfertigte Kündigung nach 8 Jahren Betriebszugehörigkeit. Arbeitgeber hat keine schriftliche Begründung geliefert. Kündigungsschutzklage angedacht.',
    keyFacts: ['Kündigung am 10. April 2025 erhalten', 'Keine schriftliche Begründung', '8 Jahre Betriebszugehörigkeit', 'Keine Abfindung angeboten'],
    documents: ['Arbeitsvertrag (vorhanden)', 'Kündigungsschreiben (vorhanden)'],
    goal: 'Weiterbeschäftigung oder angemessene Abfindung',
    expanded: false,
  },
  {
    id: 2,
    client: 'Klaus Bauer',
    initials: 'KB',
    date: '14. Apr 2025, 16:47',
    legalArea: 'Vertragsrecht',
    urgency: 'soon',
    urgencyLabel: 'Zeitnah',
    description: 'Streit über mangelhafte Leistung eines Lieferanten. Ware wurde beschädigt geliefert, Lieferant verweigert Schadensersatz. Vertragswert ca. 28.000 €.',
    keyFacts: ['Lieferung am 2. April 2025', 'Ca. 30% der Ware beschädigt', 'Lieferant bestreitet Verschulden', 'Fotos und Protokoll vorhanden'],
    documents: ['Kaufvertrag (vorhanden)', 'Fotos der Schäden (vorhanden)', 'E-Mail-Korrespondenz (vorhanden)'],
    goal: 'Schadensersatz in Höhe von 8.500 €',
    expanded: false,
  },
  {
    id: 3,
    client: 'Eva Neumann',
    initials: 'EN',
    date: '12. Apr 2025, 11:02',
    legalArea: 'Familienrecht',
    urgency: 'urgent',
    urgencyLabel: 'Dringend',
    description: 'Einleitung eines Scheidungsverfahrens nach 14-jähriger Ehe. Drei gemeinsame Kinder, ungeklärte Vermögensfragen und Sorgerecht im Fokus.',
    keyFacts: ['Getrennt seit Januar 2025', '3 gemeinsame Kinder (7, 11, 14 Jahre)', 'Gemeinsames Immobilieneigentum', 'Ehemann verweigert Kommunikation'],
    documents: ['Heiratsurkunde (vorhanden)', 'Grundbuchauszug (vorhanden)'],
    goal: 'Scheidung, alleiniges Sorgerecht, faire Vermögensaufteilung',
    expanded: false,
  },
]

// ── AI Chat messages ────────────────────────────────────────────────────────
type AiMsg = { role: 'ai' | 'user'; text: string }
const initialAiMsgs: AiMsg[] = [
  { role: 'ai', text: 'Willkommen im KI-Dokumentenanalyse-System. Laden Sie ein Dokument hoch oder stellen Sie mir eine Frage zu einem bestehenden Mandat. Ich analysiere Verträge, Schriftsätze, Urteile und alle anderen Rechtsdokumente.' },
]

const getReplyTemplate = (intake: typeof aiIntakes[0]) => {
  const today = new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
  return `München, den ${today}\n\nBetreff: Ihre Anfrage – ${intake.legalArea}\n\nSehr geehrte/r Frau/Herr ${intake.client.split(' ')[1]},\n\nvielen Dank für Ihre Kontaktaufnahme und die Übermittlung Ihrer Unterlagen im Rahmen unseres KI-gestützten Intake-Prozesses.\n\nNach Prüfung Ihrer Angaben haben wir Ihren Fall aufgenommen. Auf Basis der vorliegenden Informationen besteht ${intake.urgency === 'urgent' ? 'dringender' : 'zeitnaher'} Handlungsbedarf.\n\nZusammenfassung Ihres Anliegens:\n${intake.description}\n\nIhr Ziel:\n${intake.goal}\n\nWir werden uns umgehend mit Ihnen in Verbindung setzen, um das weitere Vorgehen zu besprechen. Bitte halten Sie alle relevanten Unterlagen bereit.\n\nMit freundlichen Grüßen\n\n\nDr. Richter\nRechtsanwalt / Fachanwalt`
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('ai')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedClient, setSelectedClient] = useState<number | null>(null)
  const [expandedIntake, setExpandedIntake] = useState<number | null>(1)
  const [replyOpen, setReplyOpen] = useState<number | null>(1)
  const [replyContent, setReplyContent] = useState('')
  const [aiMessages, setAiMessages] = useState<AiMsg[]>(initialAiMsgs)
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const aiEndRef = useRef<HTMLDivElement>(null)

  const sendAiMessage = () => {
    if (!aiInput.trim() || aiLoading) return
    const userMsg: AiMsg = { role: 'user', text: aiInput }
    setAiMessages(prev => [...prev, userMsg])
    setAiInput('')
    setAiLoading(true)
    setTimeout(() => {
      const responses = [
        'Ich habe das Dokument analysiert. Die relevanten Klauseln für Ihren Fall befinden sich in §4 (Haftungsausschluss) und §7 (Schadensersatz). Die Formulierungen sind zugunsten des Lieferanten formuliert, jedoch gibt es in §7.2 eine Ausnahme für Vorsatz und grobe Fahrlässigkeit.',
        'Basierend auf den vorliegenden Unterlagen sehe ich gute Erfolgschancen. Die dreijährige Klagefrist beginnt ab Kenntnis des Schadens. Ich empfehle, umgehend eine Mängelrüge per eingeschriebenem Brief zu versenden.',
        'Die Klausel ist nach §307 BGB möglicherweise unwirksam, da sie den Vertragspartner unangemessen benachteiligt. Ich kann eine kurze Einschätzung zur AGB-Konformität erstellen – soll ich das tun?',
      ]
      setAiMessages(prev => [...prev, { role: 'ai', text: responses[Math.floor(Math.random() * responses.length)] }])
      setAiLoading(false)
      setTimeout(() => aiEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }, 1400)
  }

  const filteredClients = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.area.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  const navTabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'ai', label: 'KI-Assistent', icon: <Bot size={16} /> },
    { id: 'overview', label: 'Übersicht', icon: <BarChart3 size={16} /> },
    { id: 'clients', label: 'Mandanten', icon: <Users size={16} /> },
    { id: 'calendar', label: 'Kalender', icon: <Calendar size={16} /> },
    { id: 'analytics', label: 'Analysen', icon: <TrendingUp size={16} /> },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Top nav */}
      <div style={{ ...cardStyle, borderLeft: 'none', borderRight: 'none', borderTop: 'none', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', height: 64, background: 'var(--bg-header)', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginRight: '1.5rem' }}>
          <div className="logo-circle-sm">LF</div>
          <span style={{ fontWeight: 800, color: 'var(--t1)' }}>LexFlow</span>
        </Link>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', gap: '0.125rem' }}>
          {navTabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ padding: '0.5rem 0.875rem', borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 500, background: activeTab === tab.id ? 'rgba(37,68,72,0.22)' : 'transparent', color: activeTab === tab.id ? 'var(--accent-d)' : 'var(--t4)', transition: 'all 0.15s', fontFamily: 'Inter, sans-serif' }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button style={{ position: 'relative', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: 8, padding: '0.5rem', cursor: 'pointer', color: 'var(--t4)', display: 'flex' }}>
            <Bell size={16} />
            <span style={{ position: 'absolute', top: -3, right: -3, width: 14, height: 14, background: '#EF4444', borderRadius: '50%', fontSize: '0.5625rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>3</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.375rem 0.75rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.22)', cursor: 'pointer' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #254448, #254448)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 700, color: 'white' }}>DR</div>
            <span style={{ color: 'var(--t2)', fontSize: '0.875rem', fontWeight: 500 }}>Dr. Richter</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: 1300, width: '100%', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* ── ÜBERSICHT ── */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>Guten Morgen, Dr. Richter</h1>
                <p style={{ color: 'var(--t4)', fontSize: '0.9375rem' }}>Montag, 14. April 2025 · 5 Termine heute</p>
              </div>
              <button className="btn-primary">
                <Plus size={15} /> Neuer Mandant
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {statCards.map((card, i) => (
                <div key={i} style={{ ...cardStyle, borderRadius: 14, padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${card.color}18`, border: `1px solid ${card.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                      {card.icon}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', color: card.up ? '#254448' : '#FCD34D' }}>
                      {card.up ? <ArrowUpRight size={14} /> : <AlertCircle size={12} />}
                      {card.change}
                    </div>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--t1)', lineHeight: 1, marginBottom: '0.25rem' }}>{card.value}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--t4)' }}>{card.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '1.25rem' }}>
              {/* Mandanten */}
              <div style={{ ...cardStyle, borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-sub)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontWeight: 700, color: 'var(--t1)', fontSize: '1rem' }}>Aktuelle Mandanten</h3>
                  <button onClick={() => setActiveTab('clients')} style={{ background: 'none', border: 'none', color: '#254448', cursor: 'pointer', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'Inter, sans-serif' }}>
                    Alle anzeigen <ChevronRight size={13} />
                  </button>
                </div>
                {clients.slice(0, 6).map((c, i) => (
                  <div key={c.id}
                    style={{ padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.15)' : 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    onClick={() => setSelectedClient(c.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #254448, #254448)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                        {c.initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--t1)', fontSize: '0.9rem' }}>{c.name}</div>
                        <div style={{ color: 'var(--t5)', fontSize: '0.75rem' }}>{c.area}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className={`status-badge ${statusConfig[c.status].cls}`} style={{ fontSize: '0.7rem' }}>{statusConfig[c.status].label}</span>
                      <span style={{ color: 'var(--t6)', fontSize: '0.75rem' }}>{c.lastContact}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Termine heute */}
              <div style={{ ...cardStyle, borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-sub)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontWeight: 700, color: 'var(--t1)', fontSize: '1rem' }}>Heutiger Terminplan</h3>
                  <span style={{ color: 'var(--t5)', fontSize: '0.8125rem' }}>14. Apr. 2025</span>
                </div>
                <div style={{ padding: '1rem' }}>
                  {appointments.map((appt, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.875rem', marginBottom: i < appointments.length - 1 ? '0.5rem' : 0, padding: '0.875rem', borderRadius: 10, background: appt.urgent ? 'rgba(239,68,68,0.07)' : 'rgba(255,255,255,0.03)', border: appt.urgent ? '1px solid rgba(239,68,68,0.22)' : '1px solid rgba(255,255,255,0.18)' }}>
                      <div style={{ textAlign: 'right', minWidth: 44 }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--t1)' }}>{appt.time}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--t5)' }}>{appt.duration}</div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.125rem' }}>
                          <span style={{ fontWeight: 600, color: 'var(--t1)', fontSize: '0.875rem' }}>{appt.client}</span>
                          {appt.urgent && <AlertCircle size={12} color="#FCA5A5" />}
                        </div>
                        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--t4)' }}>{appt.area}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--t6)' }}>·</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--t4)' }}>{appt.type}</span>
                        </div>
                      </div>
                      <span className={`status-badge ${appt.status === 'confirmed' ? 'status-completed' : 'status-waiting'}`} style={{ fontSize: '0.65rem', alignSelf: 'center', flexShrink: 0 }}>
                        {appt.status === 'confirmed' ? 'Bestätigt' : 'Ausstehend'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MANDANTEN ── */}
        {activeTab === 'clients' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.03em' }}>Alle Mandanten</h1>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--t5)' }} />
                  <input className="input-dark" placeholder="Mandanten suchen..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.25rem', width: 220, fontSize: '0.875rem', padding: '0.6rem 0.875rem 0.6rem 2.25rem' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Filter size={14} color="#7880A8" />
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.24)', borderRadius: 8, color: 'var(--t2)', padding: '0.6rem 0.875rem', fontSize: '0.875rem', cursor: 'pointer', outline: 'none', fontFamily: 'Inter, sans-serif' }}>
                    <option value="all">Alle Status</option>
                    <option value="new">Neu</option>
                    <option value="in-progress">Laufend</option>
                    <option value="waiting">Wartend</option>
                    <option value="urgent">Dringend</option>
                    <option value="completed">Abgeschlossen</option>
                  </select>
                </div>
                <button className="btn-primary" style={{ padding: '0.6rem 1rem', fontSize: '0.875rem' }}>
                  <Plus size={14} /> Mandant anlegen
                </button>
              </div>
            </div>

            <div style={{ ...cardStyle, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 140px 80px 80px', gap: '1rem', padding: '0.875rem 1.5rem', borderBottom: '1px solid var(--border-sub)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--t6)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <span>Mandant</span><span>Rechtsgebiet</span><span>Status</span><span>Nächster Termin</span><span>Fortschritt</span><span></span>
              </div>

              {filteredClients.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--t5)' }}>Keine Mandanten gefunden.</div>
              ) : filteredClients.map((c, i) => (
                <div key={c.id}
                  style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 140px 80px 80px', gap: '1rem', padding: '1rem 1.5rem', borderBottom: i < filteredClients.length - 1 ? '1px solid rgba(255,255,255,0.15)' : 'none', alignItems: 'center', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => setSelectedClient(selectedClient === c.id ? null : c.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #254448, #254448)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                      {c.initials}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--t1)', fontSize: '0.9375rem' }}>{c.name}</div>
                      <div style={{ color: 'var(--t5)', fontSize: '0.75rem' }}>{c.lastContact}</div>
                    </div>
                  </div>
                  <span style={{ color: 'var(--t2)', fontSize: '0.875rem' }}>{c.area}</span>
                  <span className={`status-badge ${statusConfig[c.status].cls}`} style={{ fontSize: '0.7rem' }}>{statusConfig[c.status].label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--t4)', fontSize: '0.8125rem' }}>
                    <Clock size={12} />{c.date}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--t4)', marginBottom: '0.25rem', textAlign: 'center' }}>{c.progress}%</div>
                    <div style={{ height: 4, background: 'var(--border-sub)', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${c.progress}%`, background: c.progress === 100 ? '#10B981' : 'linear-gradient(90deg, #254448, #254448)', borderRadius: 2 }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                    {[<Eye size={15} />, <MoreHorizontal size={15} />].map((icon, j) => (
                      <button key={j} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t5)', padding: '0.25rem', borderRadius: 6, transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#254448'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--t5)'}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {selectedClient && (() => {
              const c = clients.find(cl => cl.id === selectedClient)!
              return (
                <div style={{ ...cardStyle, borderRadius: 14, padding: '1.5rem', marginTop: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #254448, #254448)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white' }}>{c.initials}</div>
                      <div>
                        <h2 style={{ fontWeight: 800, color: 'var(--t1)', fontSize: '1.125rem' }}>{c.name}</h2>
                        <p style={{ color: 'var(--t4)', fontSize: '0.875rem' }}>{c.area} · Fallfortschritt: {c.progress}%</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.625rem' }}>
                      <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                        <MessageSquare size={14} /> Nachricht
                      </button>
                      <Link to="/booking" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                        <Calendar size={14} /> Termin
                      </Link>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                    {[
                      { label: 'Status', value: statusConfig[c.status].label },
                      { label: 'Nächster Termin', value: c.date },
                      { label: 'Dringlichkeit', value: c.urgency === 'urgent' ? 'Dringend' : c.urgency === 'soon' ? 'Zeitnah' : 'Normal' },
                      { label: 'Letzter Kontakt', value: c.lastContact },
                    ].map(item => (
                      <div key={item.label} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '0.875rem' }}>
                        <div style={{ color: 'var(--t5)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{item.label}</div>
                        <div style={{ color: 'var(--t1)', fontSize: '0.9rem', fontWeight: 600 }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* ── KALENDER ── */}
        {activeTab === 'calendar' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.03em' }}>Terminkalender</h1>
              <Link to="/booking" className="btn-primary" style={{ padding: '0.6rem 1rem', fontSize: '0.875rem' }}>
                <Plus size={14} /> Neuer Termin
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem' }}>
              <div style={{ ...cardStyle, borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-sub)' }}>
                  <h3 style={{ fontWeight: 700, color: 'var(--t1)', fontSize: '1rem' }}>Woche vom 14. April 2025</h3>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((hour, hi) => (
                    <div key={hour} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem', alignItems: 'stretch', minHeight: 52 }}>
                      <div style={{ width: 46, color: 'var(--t6)', fontSize: '0.75rem', paddingTop: '0.25rem', flexShrink: 0 }}>{hour}</div>
                      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.25rem', position: 'relative' }}>
                        <div style={{ gridColumn: '1 / -1', height: 1, background: 'rgba(255,255,255,0.05)', position: 'absolute', top: 0, left: 0, right: 0 }} />
                        {hi === 0 && <div style={{ gridColumn: '2', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 6, padding: '0.25rem 0.5rem', fontSize: '0.7rem', color: '#FCA5A5', fontWeight: 600 }}>Eva N. · Video</div>}
                        {hi === 1 && <div style={{ gridColumn: '4', background: 'rgba(37,68,72,0.18)', border: '1px solid rgba(74,222,128,0.38)', borderRadius: 6, padding: '0.25rem 0.5rem', fontSize: '0.7rem', color: '#254448', fontWeight: 600 }}>Thomas K.</div>}
                        {hi === 3 && <div style={{ gridColumn: '1', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: 6, padding: '0.25rem 0.5rem', fontSize: '0.7rem', color: '#FCD34D', fontWeight: 600 }}>Neues Mandat</div>}
                        {hi === 4 && <div style={{ gridColumn: '3', background: 'rgba(37,68,72,0.18)', border: '1px solid rgba(74,222,128,0.38)', borderRadius: 6, padding: '0.25rem 0.5rem', fontSize: '0.7rem', color: '#254448', fontWeight: 600 }}>Maria S.</div>}
                        {hi === 6 && <div style={{ gridColumn: '5', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: 6, padding: '0.25rem 0.5rem', fontSize: '0.7rem', color: '#254448', fontWeight: 600 }}>Sandra W.</div>}
                        {hi === 7 && <div style={{ gridColumn: '2', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 6, padding: '0.25rem 0.5rem', fontSize: '0.7rem', color: '#FCA5A5', fontWeight: 600 }}>Peter B. · Dringend</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ ...cardStyle, borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-sub)' }}>
                  <h3 style={{ fontWeight: 700, color: 'var(--t1)', fontSize: '1rem' }}>Bevorstehende Termine</h3>
                </div>
                <div style={{ padding: '1rem' }}>
                  {appointments.map((appt, i) => (
                    <div key={i} style={{ padding: '0.875rem', borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.18)', marginBottom: i < appointments.length - 1 ? '0.5rem' : 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.375rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--t1)', fontSize: '0.875rem' }}>{appt.client}</span>
                        <span style={{ color: '#254448', fontSize: '0.8125rem', fontWeight: 600 }}>{appt.time}</span>
                      </div>
                      <div style={{ color: 'var(--t4)', fontSize: '0.75rem' }}>{appt.area} · {appt.type} · {appt.duration}</div>
                      {appt.urgent && <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.375rem', color: '#FCA5A5', fontSize: '0.75rem' }}><AlertCircle size={11} /> Dringend</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ANALYSEN ── */}
        {activeTab === 'analytics' && (
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.03em', marginBottom: '1.75rem' }}>Analysen</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>

              {/* Rechtsgebiete */}
              <div style={{ ...cardStyle, borderRadius: 14, padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, color: 'var(--t1)', marginBottom: '1.25rem', fontSize: '1rem' }}>Mandate nach Rechtsgebiet</h3>
                {[
                  { area: 'Arbeitsrecht', count: 12, pct: 26, color: '#254448' },
                  { area: 'Familienrecht', count: 9, pct: 19, color: '#254448' },
                  { area: 'Vertragsrecht', count: 8, pct: 17, color: '#254448' },
                  { area: 'Immobilienrecht', count: 7, pct: 15, color: '#254448' },
                  { area: 'Sonstiges', count: 11, pct: 23, color: '#254448' },
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom: '0.875rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                      <span style={{ color: 'var(--t2)', fontSize: '0.875rem' }}>{item.area}</span>
                      <span style={{ color: 'var(--t4)', fontSize: '0.8125rem' }}>{item.count} Mandate</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--border-sub)', borderRadius: 3 }}>
                      <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Monatliche Neuzugänge */}
              <div style={{ ...cardStyle, borderRadius: 14, padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, color: 'var(--t1)', marginBottom: '1.25rem', fontSize: '1rem' }}>Neue Mandanten pro Monat</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: 160, paddingBottom: '0.5rem' }}>
                  {[
                    { month: 'Nov', count: 8 }, { month: 'Dez', count: 6 }, { month: 'Jan', count: 10 },
                    { month: 'Feb', count: 14 }, { month: 'Mär', count: 11 }, { month: 'Apr', count: 12 },
                  ].map((item, i, arr) => {
                    const max = Math.max(...arr.map(a => a.count))
                    return (
                      <div key={item.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
                        <span style={{ color: 'var(--t4)', fontSize: '0.7rem' }}>{item.count}</span>
                        <div style={{ width: '100%', height: `${(item.count / max) * 100}%`, background: i === arr.length - 1 ? 'linear-gradient(180deg, #254448, #254448)' : 'rgba(37,68,72,0.35)', borderRadius: '4px 4px 0 0', boxShadow: i === arr.length - 1 ? '0 0 14px rgba(123,82,240,0.45)' : 'none' }} />
                        <span style={{ color: 'var(--t5)', fontSize: '0.7rem' }}>{item.month}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Fallergebnisse */}
              <div style={{ ...cardStyle, borderRadius: 14, padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, color: 'var(--t1)', marginBottom: '1.25rem', fontSize: '1rem' }}>Fallergebnisse (letzte 30 Tage)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  {[
                    { label: 'Gewonnen / Erledigt', value: 18, color: '#10B981', icon: <CheckCircle size={16} /> },
                    { label: 'Vergleich', value: 7, color: '#254448', icon: <CheckCircle size={16} /> },
                    { label: 'Im Verfahren', value: 14, color: '#FCD34D', icon: <Clock size={16} /> },
                    { label: 'Verloren / Eingestellt', value: 3, color: '#FCA5A5', icon: <ArrowDownRight size={16} /> },
                  ].map((item, i) => (
                    <div key={i} style={{ background: `${item.color}0D`, border: `1px solid ${item.color}25`, borderRadius: 10, padding: '0.875rem', textAlign: 'center' }}>
                      <div style={{ color: item.color, display: 'flex', justifyContent: 'center', marginBottom: '0.375rem' }}>{item.icon}</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--t1)', lineHeight: 1 }}>{item.value}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--t4)', marginTop: '0.25rem' }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kennzahlen */}
              <div style={{ ...cardStyle, borderRadius: 14, padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, color: 'var(--t1)', marginBottom: '1.25rem', fontSize: '1rem' }}>Leistungskennzahlen</h3>
                {[
                  { label: 'Ø Antwortzeit', value: '2,4 Std.', trend: '-18%', up: true },
                  { label: 'Mandantenzufriedenheit', value: '94 %', trend: '+2 %', up: true },
                  { label: 'Beratungsrate', value: '87 %', trend: '-3 %', up: false },
                  { label: 'Weiterempfehlungsrate', value: '32 %', trend: '+5 %', up: true },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem 0', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
                    <span style={{ color: 'var(--t2)', fontSize: '0.875rem' }}>{item.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--t1)', fontSize: '0.9rem' }}>{item.value}</span>
                      <span style={{ fontSize: '0.75rem', color: item.up ? '#254448' : '#FCA5A5', display: 'flex', alignItems: 'center', gap: '0.125rem' }}>
                        {item.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {item.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── KI-ASSISTENT ── */}
        {activeTab === 'ai' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #254448, #254448)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 14px rgba(37,68,72,0.3)' }}>
                    <Bot size={16} color="white" />
                  </div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.03em' }}>KI-Assistent</h1>
                </div>
                <p style={{ color: 'var(--t4)', fontSize: '0.9375rem' }}>KI-Intake-Zusammenfassungen und Dokumentenanalyse</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.4rem 0.875rem', background: 'rgba(37,68,72,0.1)', border: '1px solid rgba(37,68,72,0.25)', borderRadius: 20 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#254448', boxShadow: '0 0 6px rgba(37,68,72,0.45)' }} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#254448' }}>KI aktiv</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '1.25rem', alignItems: 'start' }}>

              {/* ── KI-Intake Summaries ── */}
              <div>
                <div style={{ ...cardStyle, borderRadius: 14, overflow: 'hidden' }}>
                  <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-sub)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--t1)', fontSize: '1rem' }}>KI-Intake Zusammenfassungen</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--t4)', marginTop: '0.125rem' }}>Vom KI-Assistenten erfasste Mandanteninformationen</div>
                    </div>
                    <span style={{ background: 'rgba(37,68,72,0.1)', color: '#254448', border: '1px solid rgba(37,68,72,0.25)', borderRadius: 20, padding: '0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: 600 }}>
                      {aiIntakes.length} neu
                    </span>
                  </div>

                  <div>
                    {aiIntakes.map((intake, i) => (
                      <div key={intake.id} style={{ borderBottom: i < aiIntakes.length - 1 ? '1px solid var(--border-sub)' : 'none' }}>
                        {/* Header row */}
                        <button
                          onClick={() => setExpandedIntake(expandedIntake === intake.id ? null : intake.id)}
                          style={{ width: '100%', padding: '1.125rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.875rem', background: expandedIntake === intake.id ? 'var(--accent-tint)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s', fontFamily: 'Inter, sans-serif' }}
                        >
                          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #254448, #254448)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                            {intake.initials}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                              <span style={{ fontWeight: 600, color: 'var(--t1)', fontSize: '0.9375rem' }}>{intake.client}</span>
                              <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.6rem', borderRadius: 6, background: intake.urgency === 'urgent' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: intake.urgency === 'urgent' ? '#B91C1C' : '#B45309', border: `1px solid ${intake.urgency === 'urgent' ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)'}`, fontWeight: 600 }}>
                                {intake.urgencyLabel}
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.8125rem', color: '#254448', fontWeight: 500 }}>{intake.legalArea}</span>
                              <span style={{ color: 'var(--t5)', fontSize: '0.75rem' }}>·</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--t5)' }}>{intake.date}</span>
                            </div>
                          </div>
                          <ChevronDown size={16} color="var(--t4)" style={{ transform: expandedIntake === intake.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                        </button>

                        {/* Expanded detail */}
                        {expandedIntake === intake.id && (
                          <div style={{ padding: '0 1.5rem 1.5rem', background: 'var(--accent-tint)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              {/* Beschreibung */}
                              <div style={{ gridColumn: '1 / -1', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--t5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                  <Sparkles size={11} color="#254448" /> KI-Zusammenfassung
                                </div>
                                <p style={{ color: 'var(--t2)', fontSize: '0.875rem', lineHeight: 1.65 }}>{intake.description}</p>
                              </div>
                              {/* Key facts */}
                              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--t5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.625rem' }}>Wichtige Fakten</div>
                                {intake.keyFacts.map((f, fi) => (
                                  <div key={fi} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.375rem', alignItems: 'flex-start' }}>
                                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#254448', marginTop: '6px', flexShrink: 0 }} />
                                    <span style={{ fontSize: '0.8125rem', color: 'var(--t2)', lineHeight: 1.5 }}>{f}</span>
                                  </div>
                                ))}
                              </div>
                              {/* Documents + Goal */}
                              <div>
                                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem', marginBottom: '0.75rem' }}>
                                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--t5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.625rem' }}>Dokumente</div>
                                  {intake.documents.map((d, di) => (
                                    <div key={di} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                                      <CheckCircle size={12} color="#10B981" />
                                      <span style={{ fontSize: '0.8125rem', color: 'var(--t2)' }}>{d}</span>
                                    </div>
                                  ))}
                                </div>
                                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem' }}>
                                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--t5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Mandantenziel</div>
                                  <p style={{ fontSize: '0.8125rem', color: 'var(--t2)', lineHeight: 1.5 }}>{intake.goal}</p>
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.625rem', marginTop: '1rem' }}>
                              <button className="btn-primary" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}
                                onClick={() => {
                                  if (replyOpen === intake.id) { setReplyOpen(null) }
                                  else { setReplyOpen(intake.id); setReplyContent(getReplyTemplate(intake)) }
                                }}>
                                <MessageSquare size={13} /> {replyOpen === intake.id ? 'Schriftsatz schließen' : 'Antworten / Schriftsatz'}
                              </button>
                              <Link to="/booking" className="btn-secondary" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>
                                <Calendar size={13} /> Termin buchen
                              </Link>
                            </div>

                            {/* ── Word-style document editor ── */}
                            {replyOpen === intake.id && (
                              <div style={{ marginTop: '1.25rem' }}>
                                {/* Toolbar */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderBottom: 'none', borderRadius: '10px 10px 0 0', flexWrap: 'wrap' }}>
                                  {[
                                    { label: 'B', title: 'Fett', style: { fontWeight: 800 } },
                                    { label: 'I', title: 'Kursiv', style: { fontStyle: 'italic' } },
                                    { label: 'U', title: 'Unterstrichen', style: { textDecoration: 'underline' } },
                                  ].map(btn => (
                                    <button key={btn.label} title={btn.title} style={{ width: 28, height: 28, borderRadius: 5, border: '1px solid var(--border)', background: 'var(--bg-card-sub)', cursor: 'pointer', fontSize: '0.8125rem', color: 'var(--t2)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...btn.style, fontFamily: 'Inter, sans-serif' }}>
                                      {btn.label}
                                    </button>
                                  ))}
                                  <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 0.25rem' }} />
                                  <select style={{ fontSize: '0.75rem', padding: '0.2rem 0.375rem', border: '1px solid var(--border)', borderRadius: 5, background: 'var(--bg-card-sub)', color: 'var(--t2)', cursor: 'pointer', outline: 'none', fontFamily: 'Inter, sans-serif' }}>
                                    <option>Inter</option><option>Times New Roman</option><option>Arial</option>
                                  </select>
                                  <select style={{ fontSize: '0.75rem', padding: '0.2rem 0.375rem', border: '1px solid var(--border)', borderRadius: 5, background: 'var(--bg-card-sub)', color: 'var(--t2)', cursor: 'pointer', outline: 'none', fontFamily: 'Inter, sans-serif' }}>
                                    <option>11</option><option>12</option><option>14</option>
                                  </select>
                                  <div style={{ flex: 1 }} />
                                  <span style={{ fontSize: '0.7rem', color: 'var(--t5)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <FileText size={11} /> Schriftsatz / Antwortschreiben
                                  </span>
                                </div>

                                {/* Document paper */}
                                <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', position: 'relative' }}>
                                  {/* Letterhead */}
                                  <div style={{ padding: '1.5rem 2rem 0.75rem', borderBottom: '2px solid #254448', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                    <div>
                                      <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1a1a1a', letterSpacing: '-0.02em' }}>Dr. Richter & Partner</div>
                                      <div style={{ fontSize: '0.75rem', color: '#555', lineHeight: 1.6 }}>Rechtsanwälte · Fachanwälte<br />Maximilianstraße 22 · 80539 München<br />Tel: +49 89 12345678 · info@kanzlei-richter.de</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#254448', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', marginBottom: '0.375rem' }}>
                                        <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#254448', boxShadow: '0 0 0 3px white' }} />
                                      </div>
                                      <div style={{ fontSize: '0.6875rem', color: '#888', fontWeight: 600 }}>LEXFLOW</div>
                                    </div>
                                  </div>

                                  {/* Editable body */}
                                  <textarea
                                    value={replyContent}
                                    onChange={e => setReplyContent(e.target.value)}
                                    style={{ width: '100%', minHeight: 360, padding: '1.5rem 2rem', border: 'none', outline: 'none', resize: 'vertical', fontFamily: '"Times New Roman", Georgia, serif', fontSize: '0.9375rem', lineHeight: 1.85, color: '#1a1a1a', background: 'transparent', boxSizing: 'border-box' }}
                                    spellCheck={true}
                                  />
                                </div>

                                {/* Action bar */}
                                <div style={{ display: 'flex', gap: '0.625rem', padding: '0.75rem 0.875rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 10px 10px', alignItems: 'center' }}>
                                  <button className="btn-primary" style={{ fontSize: '0.8125rem', padding: '0.5rem 1.125rem' }}>
                                    <Send size={13} /> Absenden
                                  </button>
                                  <button className="btn-secondary" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}
                                    onClick={() => { const w = window.open('', '_blank'); if(w){ w.document.write('<pre style="font-family:Times New Roman;font-size:14px;white-space:pre-wrap;padding:2rem">' + replyContent + '</pre>'); w.print() } }}>
                                    <FileText size={13} /> Drucken / PDF
                                  </button>
                                  <div style={{ flex: 1 }} />
                                  <span style={{ fontSize: '0.75rem', color: 'var(--t5)' }}>{replyContent.split(/\s+/).filter(Boolean).length} Wörter</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── KI-Dokumentenanalyse ── */}
              <div style={{ ...cardStyle, borderRadius: 14, display: 'flex', flexDirection: 'column', height: 620 }}>
                <div style={{ padding: '1.125rem 1.25rem', borderBottom: '1px solid var(--border-sub)', display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #254448, #254448)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={13} color="white" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--t1)', fontSize: '0.9rem' }}>KI-Dokumentenanalyse</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--t5)' }}>Dokumente analysieren · Klauseln prüfen</div>
                  </div>
                </div>

                {/* Upload area */}
                <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border-sub)', flexShrink: 0 }}>
                  <div style={{ border: '1.5px dashed var(--border)', borderRadius: 10, padding: '0.875rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#254448'; (e.currentTarget as HTMLElement).style.background = 'var(--accent-tint)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                  >
                    <Upload size={16} color="var(--t5)" style={{ margin: '0 auto 0.375rem' }} />
                    <div style={{ fontSize: '0.8125rem', color: 'var(--t4)', fontWeight: 500 }}>Dokument hochladen</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--t5)', marginTop: '0.125rem' }}>PDF, DOCX, TXT · Max 25 MB</div>
                  </div>
                </div>

                {/* Chat messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {aiMessages.map((msg, mi) => (
                    <div key={mi} style={{ display: 'flex', gap: '0.5rem', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: msg.role === 'ai' ? 'linear-gradient(135deg, #254448, #254448)' : 'var(--bg-card-sub)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: msg.role === 'ai' ? '0 0 8px rgba(37,68,72,0.3)' : 'none' }}>
                        {msg.role === 'ai' ? <Bot size={13} color="white" /> : <Users size={13} color="var(--t4)" />}
                      </div>
                      <div style={{ maxWidth: '82%', padding: '0.625rem 0.875rem', borderRadius: msg.role === 'ai' ? '3px 10px 10px 10px' : '10px 3px 10px 10px', background: msg.role === 'ai' ? 'var(--bg-card-sub)' : 'linear-gradient(135deg, #254448, #254448)', border: msg.role === 'ai' ? '1px solid var(--border)' : 'none', color: 'var(--t1)', fontSize: '0.8125rem', lineHeight: 1.6 }}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #254448, #254448)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bot size={13} color="white" />
                      </div>
                      <div style={{ padding: '0.625rem 0.875rem', borderRadius: '3px 10px 10px 10px', background: 'var(--bg-card-sub)', border: '1px solid var(--border)', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                        {[0, 1, 2].map(i => (
                          <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#254448', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={aiEndRef} />
                </div>

                {/* Input */}
                <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid var(--border-sub)', flexShrink: 0 }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      className="input-dark"
                      style={{ flex: 1, fontSize: '0.875rem', padding: '0.625rem 0.875rem' }}
                      placeholder="Frage stellen oder Klausel eingeben…"
                      value={aiInput}
                      onChange={e => setAiInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendAiMessage()}
                    />
                    <button
                      onClick={sendAiMessage}
                      disabled={!aiInput.trim() || aiLoading}
                      style={{ width: 36, height: 36, borderRadius: 8, background: aiInput.trim() && !aiLoading ? 'linear-gradient(135deg, #254448, #254448)' : 'var(--bg-card-sub)', border: 'none', cursor: aiInput.trim() && !aiLoading ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', color: aiInput.trim() && !aiLoading ? 'white' : 'var(--t5)', flexShrink: 0, transition: 'all 0.2s' }}
                    >
                      <Send size={14} />
                    </button>
                  </div>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--t5)', textAlign: 'center', marginTop: '0.4rem' }}>
                    KI-Analyse · Nicht als Rechtsberatung verwenden
                  </p>
                </div>

                <style>{`
                  @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                    40% { transform: scale(1.2); opacity: 1; }
                  }
                `}</style>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
