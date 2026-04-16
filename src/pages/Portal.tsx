import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Calendar, FileText,
  MessageSquare, CheckCircle, Clock, AlertCircle, ChevronRight,
  Download, Send
} from 'lucide-react'

type View = 'login' | 'dashboard'

const mockCase = {
  caseId: 'LF-2024-0847',
  client: 'Maria Schmidt',
  initials: 'MS',
  legalArea: 'Arbeitsrecht',
  lawyer: 'Dr. Klaus Bauer',
  lawyerInitials: 'KB',
  status: 'in-progress',
  startDate: '12. März 2025',
  nextAppointment: '18. April 2025 um 14:00 Uhr',
  progress: 65,
}

const timeline = [
  { date: '14. Apr', title: 'Dokumentenanforderung versendet', desc: 'Arbeitsvertrag und Kündigungsschreiben angefordert', status: 'pending', icon: <FileText size={14} /> },
  { date: '10. Apr', title: 'Beratungsgespräch abgeschlossen', desc: 'Erstberatung mit Dr. Bauer – 60 Minuten', status: 'done', icon: <CheckCircle size={14} /> },
  { date: '3. Apr', title: 'Fall geprüft', desc: 'Fallunterlagen vom Rechtsteam geprüft', status: 'done', icon: <CheckCircle size={14} /> },
  { date: '28. Mär', title: 'Intake abgeschlossen', desc: 'Online-Intake-Formular erfolgreich ausgefüllt', status: 'done', icon: <CheckCircle size={14} /> },
  { date: '12. Mär', title: 'Akte eröffnet', desc: 'Mandat LF-2024-0847 im System angelegt', status: 'done', icon: <CheckCircle size={14} /> },
]

const messages = [
  { from: 'Dr. Klaus Bauer', time: 'Vor 2 Stunden', text: 'Bitte laden Sie Ihren Arbeitsvertrag so bald wie möglich hoch. Dieser wird vor unserem nächsten Termin benötigt.', initials: 'KB', isLawyer: true },
  { from: 'Sie', time: 'Gestern', text: 'Ich habe die Dokumente gefunden. Ich werde sie morgen früh einscannen und hochladen.', initials: 'MS', isLawyer: false },
  { from: 'Dr. Klaus Bauer', time: 'Vor 2 Tagen', text: "Vielen Dank für das ausgefüllte Intake-Formular. Ich habe Ihren Fall geprüft und bin für unser Beratungsgespräch am 10. April vorbereitet.", initials: 'KB', isLawyer: true },
]

// ── Google SVG Icon ──
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
  </svg>
)

export default function Portal() {
  const [view, setView] = useState<View>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'documents' | 'appointments'>('overview')

  const handleLogin = () => {
    if (email && password) {
      setView('dashboard')
      setLoginError('')
    } else {
      setLoginError('Bitte geben Sie Ihre E-Mail und Ihr Passwort ein.')
    }
  }

  const handleGoogleLogin = () => {
    setGoogleLoading(true)
    // Simulate Google OAuth flow
    setTimeout(() => {
      setGoogleLoading(false)
      setView('dashboard')
    }, 1500)
  }

  // ── Login View ──
  if (view === 'login') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '2.5rem' }}>
          <div className="logo-circle">LF</div>
          <span style={{ fontWeight: 800, color: 'var(--t1)', fontSize: '1.25rem' }}>LexFlow</span>
        </Link>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(16px)', borderRadius: 18, padding: '2.5rem', width: '100%', maxWidth: 440 }}>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--t1)', marginBottom: '0.5rem', textAlign: 'center' }}>Mandantenportal</h1>
          <p style={{ color: 'var(--t4)', textAlign: 'center', fontSize: '0.9375rem', marginBottom: '2rem' }}>
            Anmelden, um Ihren Fall zu verfolgen und mit Ihrem Anwalt zu kommunizieren.
          </p>

          {/* ── Google Login ── */}
          <button
            onClick={handleGoogleLogin}
            className="btn-google"
            disabled={googleLoading}
            style={{ marginBottom: '1.25rem', opacity: googleLoading ? 0.75 : 1 }}
          >
            {googleLoading ? (
              <>
                <div style={{ width: 18, height: 18, border: '2px solid #ccc', borderTopColor: '#4285F4', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Mit Google anmelden...
              </>
            ) : (
              <>
                <GoogleIcon />
                Mit Google anmelden
              </>
            )}
          </button>

          {/* Divider */}
          <div className="divider-or" style={{ marginBottom: '1.25rem' }}>oder</div>

          {/* Email */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>E-Mail-Adresse</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--t5)' }} />
              <input className="input-dark" type="email" placeholder="ihre@email.de" value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: '2.5rem' }} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={labelStyle}>Passwort</label>
              <a href="#" style={{ color: '#254448', fontSize: '0.8125rem', textDecoration: 'none' }}>Passwort vergessen?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--t5)' }} />
              <input className="input-dark" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
              <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t5)' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {loginError && (
            <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '0.625rem 0.875rem', color: '#FCA5A5', fontSize: '0.875rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={14} /> {loginError}
            </div>
          )}

          <button onClick={handleLogin} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', fontSize: '1rem' }}>
            Anmelden <ArrowRight size={16} />
          </button>

          <div style={{ marginTop: '1.5rem', padding: '0.875rem', background: 'rgba(37,68,72,0.1)', borderRadius: 10, border: '1px solid rgba(74,222,128,0.22)' }}>
            <p style={{ color: 'var(--t2)', fontSize: '0.8125rem', textAlign: 'center' }}>
              <strong style={{ color: 'var(--accent-d)' }}>Demo:</strong> Beliebige E-Mail + Passwort eingeben oder Google nutzen
            </p>
          </div>
        </div>

        <p style={{ color: 'var(--t6)', fontSize: '0.875rem', marginTop: '1.5rem' }}>
          Noch kein Mandant?{' '}
          <Link to="/onboarding" style={{ color: '#254448', textDecoration: 'none' }}>Jetzt registrieren</Link>
        </p>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    )
  }

  // ── Dashboard View ──
  const tabs = [
    { id: 'overview', label: 'Übersicht', icon: <CheckCircle size={15} /> },
    { id: 'messages', label: 'Nachrichten', icon: <MessageSquare size={15} />, badge: 1 },
    { id: 'documents', label: 'Dokumente', icon: <FileText size={15} /> },
    { id: 'appointments', label: 'Termine', icon: <Calendar size={15} /> },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Top nav */}
      <div style={{ borderBottom: '1px solid var(--border-sub)', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, background: 'var(--bg-header)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 40 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div className="logo-circle-sm">LF</div>
          <span style={{ fontWeight: 800, color: 'var(--t1)' }}>LexFlow</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--t4)', fontSize: '0.875rem' }}>Mandantenportal</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.375rem 0.75rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.22)', cursor: 'pointer' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #254448, #254448)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 700, color: 'white' }}>
              {mockCase.initials}
            </div>
            <span style={{ color: 'var(--t2)', fontSize: '0.875rem', fontWeight: 500 }}>{mockCase.client}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Case header */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(16px)', borderRadius: 16, padding: '1.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--t5)', fontSize: '0.8125rem', fontFamily: 'monospace' }}>{mockCase.caseId}</span>
                <span className="status-badge status-in-progress">Laufend</span>
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--t1)', marginBottom: '0.375rem' }}>{mockCase.legalArea}</h1>
              <p style={{ color: 'var(--t4)', fontSize: '0.9rem' }}>
                Bearbeitet von <strong style={{ color: 'var(--t2)' }}>{mockCase.lawyer}</strong> · Eröffnet am {mockCase.startDate}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8125rem', color: 'var(--t5)', marginBottom: '0.375rem' }}>Fallfortschritt</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--t1)', lineHeight: 1 }}>{mockCase.progress}%</div>
              <div style={{ width: 120, height: 4, background: 'rgba(255,255,255,0.09)', borderRadius: 2, marginTop: '0.5rem' }}>
                <div style={{ height: '100%', width: `${mockCase.progress}%`, background: 'linear-gradient(90deg, #254448, #254448)', borderRadius: 2 }} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.28)', borderRadius: 8, padding: '0.5rem 0.875rem' }}>
              <Calendar size={14} color="#FCD34D" />
              <span style={{ color: '#FCD34D', fontSize: '0.875rem', fontWeight: 500 }}>Nächster Termin: {mockCase.nextAppointment}</span>
            </div>
            <Link to="/booking" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              Neuen Termin buchen <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '0.25rem', border: '1px solid var(--border-sub)', width: 'fit-content', marginLeft: 'auto' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{ padding: '0.5rem 1rem', borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 500, background: activeTab === tab.id ? 'linear-gradient(135deg, #254448, #254448)' : 'transparent', color: activeTab === tab.id ? 'white' : 'var(--t4)', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif', position: 'relative' }}
            >
              {tab.icon} {tab.label}
              {tab.badge && (
                <span style={{ background: '#EF4444', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Übersicht ── */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.25rem' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(16px)', borderRadius: 14, padding: '1.75rem' }}>
              <h3 style={{ fontWeight: 700, color: 'var(--t1)', marginBottom: '1.5rem', fontSize: '1.0625rem' }}>Fallchronik</h3>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 20, top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,0.07)' }} />
                {timeline.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: i < timeline.length - 1 ? '1.5rem' : 0, position: 'relative' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: item.status === 'done' ? 'rgba(16,185,129,0.18)' : 'rgba(245,158,11,0.18)', border: `2px solid ${item.status === 'done' ? 'rgba(16,185,129,0.45)' : 'rgba(245,158,11,0.45)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.status === 'done' ? '#254448' : '#FCD34D', zIndex: 1 }}>
                      {item.icon}
                    </div>
                    <div style={{ paddingTop: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--t1)', fontSize: '0.9375rem' }}>{item.title}</span>
                        <span style={{ color: 'var(--t5)', fontSize: '0.75rem' }}>{item.date}</span>
                      </div>
                      <p style={{ color: 'var(--t4)', fontSize: '0.875rem' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(16px)', borderRadius: 14, padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, color: 'var(--t1)', marginBottom: '1rem', fontSize: '1rem' }}>Ihr Anwalt</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #254448, #254448)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '0.9375rem' }}>
                    {mockCase.lawyerInitials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--t1)' }}>{mockCase.lawyer}</div>
                    <div style={{ color: 'var(--t5)', fontSize: '0.8125rem' }}>Fachanwalt für Arbeitsrecht</div>
                  </div>
                </div>
                <button onClick={() => setActiveTab('messages')} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '0.625rem' }}>
                  <MessageSquare size={14} /> Nachricht senden
                </button>
              </div>

              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(16px)', borderRadius: 14, padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, color: 'var(--t1)', marginBottom: '1rem', fontSize: '1rem' }}>Offene Aufgaben</h3>
                {[
                  { text: 'Arbeitsvertrag hochladen', urgent: true },
                  { text: 'Kündigungsschreiben hochladen', urgent: true },
                  { text: 'Nächsten Termin bestätigen', urgent: false },
                ].map((action, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: i < 2 ? '0.625rem' : 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: action.urgent ? '#EF4444' : '#F59E0B', flexShrink: 0 }} />
                    <span style={{ color: 'var(--t2)', fontSize: '0.875rem' }}>{action.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Nachrichten ── */}
        {activeTab === 'messages' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(16px)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-sub)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={16} color="#254448" />
              <h3 style={{ fontWeight: 700, color: 'var(--t1)', fontSize: '1rem' }}>Nachrichten</h3>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', flexDirection: msg.isLawyer ? 'row' : 'row-reverse' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: msg.isLawyer ? 'linear-gradient(135deg, #254448, #254448)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: msg.isLawyer ? 'white' : 'var(--t2)', flexShrink: 0 }}>
                    {msg.initials}
                  </div>
                  <div style={{ maxWidth: '70%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexDirection: msg.isLawyer ? 'row' : 'row-reverse' }}>
                      <span style={{ fontWeight: 600, color: 'var(--t2)', fontSize: '0.8125rem' }}>{msg.from}</span>
                      <span style={{ color: 'var(--t6)', fontSize: '0.75rem' }}>{msg.time}</span>
                    </div>
                    <div style={{ padding: '0.75rem 1rem', borderRadius: msg.isLawyer ? '4px 12px 12px 12px' : '12px 4px 12px 12px', background: msg.isLawyer ? 'rgba(255,255,255,0.06)' : 'rgba(37,68,72,0.22)', border: msg.isLawyer ? '1px solid rgba(255,255,255,0.09)' : '1px solid rgba(74,222,128,0.35)', color: 'var(--t1)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-sub)', display: 'flex', gap: '0.75rem' }}>
              <input className="input-dark" placeholder="Nachricht an Ihren Anwalt schreiben..." style={{ flex: 1 }} />
              <button className="btn-primary" style={{ padding: '0.75rem 1.25rem', flexShrink: 0 }}>
                <Send size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ── Dokumente ── */}
        {activeTab === 'documents' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(16px)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-sub)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={16} color="#254448" />
                <h3 style={{ fontWeight: 700, color: 'var(--t1)', fontSize: '1rem' }}>Dokumente</h3>
              </div>
              <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Dokument hochladen</button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {[
                { name: 'Intake-Formular – Maria Schmidt', date: '28. Mär 2025', size: '124 KB', status: 'uploaded' },
                { name: 'Vollmacht', date: '3. Apr 2025', size: '87 KB', status: 'uploaded' },
                { name: 'Arbeitsvertrag', date: '—', size: '—', status: 'requested' },
                { name: 'Kündigungsschreiben', date: '—', size: '—', status: 'requested' },
              ].map((doc, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.16)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: doc.status === 'requested' ? 'rgba(245,158,11,0.12)' : 'rgba(37,68,72,0.12)', border: `1px solid ${doc.status === 'requested' ? 'rgba(245,158,11,0.3)' : 'rgba(74,222,128,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: doc.status === 'requested' ? '#FCD34D' : '#254448' }}>
                      <FileText size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, color: 'var(--t1)', fontSize: '0.9rem' }}>{doc.name}</div>
                      <div style={{ color: 'var(--t5)', fontSize: '0.75rem' }}>{doc.date !== '—' ? `${doc.date} · ${doc.size}` : 'Vom Anwalt angefordert'}</div>
                    </div>
                  </div>
                  {doc.status === 'uploaded' ? (
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#254448' }}><Download size={16} /></button>
                  ) : (
                    <span className="status-badge status-in-progress" style={{ fontSize: '0.7rem' }}>
                      <Clock size={10} /> Ausstehend
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Termine ── */}
        {activeTab === 'appointments' && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              { date: '18. April 2025', time: '14:00 – 15:00', type: 'Videoanruf', topic: 'Prüfung der arbeitsrechtlichen Ansprüche', status: 'upcoming', lawyer: 'Dr. Klaus Bauer' },
              { date: '10. April 2025', time: '10:00 – 11:00', type: 'Videoanruf', topic: 'Erstberatung', status: 'completed', lawyer: 'Dr. Klaus Bauer' },
            ].map((appt, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(16px)', borderRadius: 14, padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ background: appt.status === 'upcoming' ? 'rgba(37,68,72,0.18)' : 'rgba(16,185,129,0.12)', border: `1px solid ${appt.status === 'upcoming' ? 'rgba(74,222,128,0.38)' : 'rgba(16,185,129,0.3)'}`, borderRadius: 10, padding: '0.75rem 1rem', textAlign: 'center', minWidth: 70 }}>
                      <div style={{ fontSize: '0.75rem', color: appt.status === 'upcoming' ? '#254448' : '#254448', fontWeight: 600, textTransform: 'uppercase' }}>{appt.date.split('. ')[1]?.split(' ')[0] ?? 'Apr'}</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--t1)', lineHeight: 1 }}>{appt.date.split('. ')[0]}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--t1)', marginBottom: '0.25rem' }}>{appt.topic}</div>
                      <div style={{ color: 'var(--t4)', fontSize: '0.875rem' }}>{appt.time} · {appt.type} · {appt.lawyer}</div>
                    </div>
                  </div>
                  <span className={`status-badge ${appt.status === 'upcoming' ? 'status-new' : 'status-completed'}`}>
                    {appt.status === 'upcoming' ? 'Bevorstehend' : 'Abgeschlossen'}
                  </span>
                </div>
                {appt.status === 'upcoming' && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.18)', display: 'flex', gap: '0.625rem' }}>
                    <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Videoanruf beitreten</button>
                    <button className="btn-ghost" style={{ fontSize: '0.875rem' }}>Umbuchen</button>
                  </div>
                )}
              </div>
            ))}
            <Link to="/booking" className="btn-secondary" style={{ justifyContent: 'center' }}>
              <Calendar size={15} /> Neuen Termin buchen
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.875rem', fontWeight: 600,
  color: 'var(--t2)', marginBottom: '0.5rem',
}
