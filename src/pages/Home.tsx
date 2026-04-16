import { Link } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useTheme } from '../contexts/ThemeContext'
import {
  ChevronRight, Shield, Clock, MessageSquare, Calendar,
  BarChart3, Users, CheckCircle, Star, ArrowRight,
  FileText, Zap, Lock, TrendingUp, Bot, Briefcase
} from 'lucide-react'

const stats = [
  { value: '3×', label: 'Schnelleres Mandanten-Intake' },
  { value: '92%', label: 'Mandantenzufriedenheit' },
  { value: '60%', label: 'Weniger Verwaltungsaufwand' },
  { value: '24/7', label: 'Zugang zum Mandantenportal' },
]

const features = [
  {
    icon: <Bot size={22} />,
    title: 'KI-gestützter Intake-Bot',
    desc: 'Intelligente Fragebögen führen Mandanten durch den Intake-Prozess und erfassen alle relevanten Informationen vor der ersten Beratung.',
    color: '#254448',
  },
  {
    icon: <Calendar size={22} />,
    title: 'Smarte Terminbuchung',
    desc: 'Mandanten buchen Beratungen direkt in Ihrem Kalender. Automatische Erinnerungen reduzieren Nichterscheinen um bis zu 80 %.',
    color: '#254448',
  },
  {
    icon: <Users size={22} />,
    title: 'Mandantenverwaltung',
    desc: 'Ein zentrales Dashboard für alle Mandate, Beratungsstatus, Dokumente und die gesamte Kommunikationshistorie.',
    color: '#254448',
  },
  {
    icon: <FileText size={22} />,
    title: 'Digitales Onboarding',
    desc: 'Neue Mandanten erledigen ihr Onboarding online – von persönlichen Daten über die Fallbeschreibung bis zum Dokumenten-Upload.',
    color: '#254448',
  },
  {
    icon: <Shield size={22} />,
    title: 'DSGVO-konform',
    desc: 'Alle Daten werden verschlüsselt auf deutschen Servern gespeichert. Vollständige Konformität mit DSGVO und anwaltlicher Schweigepflicht.',
    color: '#254448',
  },
  {
    icon: <BarChart3 size={22} />,
    title: 'Analysen & Einblicke',
    desc: 'Verfolgen Sie Erfolgsquoten, Mandantenakquise, Umsatz und Team-Performance mit Echtzeit-Dashboards.',
    color: '#254448',
  },
]

const steps = [
  {
    number: '01',
    title: 'Mandant füllt den Intake-Bogen aus',
    desc: 'Neue oder bestehende Mandanten füllen einen geführten digitalen Fragebogen aus. Der KI-Bot sammelt alle Informationen, die Sie vor dem ersten Gespräch benötigen.',
    icon: <MessageSquare size={24} />,
  },
  {
    number: '02',
    title: 'Termin buchen',
    desc: 'Mandanten wählen direkt einen freien Slot aus Ihrem Kalender. Bestätigungen und Erinnerungen werden automatisch versendet.',
    icon: <Calendar size={24} />,
  },
  {
    number: '03',
    title: 'Anwalt prüft den Fall',
    desc: 'Vor dem Beratungsgespräch sind alle Mandantendaten, Falldetails und Dokumente im Dashboard verfügbar – kein Vorbereitungsaufwand.',
    icon: <Briefcase size={24} />,
  },
  {
    number: '04',
    title: 'Beratung & Nachbereitung',
    desc: 'Nach dem Gespräch aktualisiert sich der Fallstatus automatisch. Mandanten erhalten Folgeaufgaben und Dokumentenanforderungen über das Portal.',
    icon: <CheckCircle size={24} />,
  },
]

const testimonials = [
  {
    quote: 'LexFlow hat unseren Intake-Prozess von 45 Minuten auf unter 10 Minuten reduziert. Unsere Anwälte gehen nun bestens vorbereitet in jedes Gespräch.',
    name: 'Dr. Sarah Müller',
    role: 'Partnerin, Müller & Kollegen',
    initials: 'SM',
    rating: 5,
  },
  {
    quote: 'Die Terminbuchung allein hat uns täglich 2 Stunden an E-Mail-Ping-Pong erspart. Das Mandantenportal ist ein echter Gamechanger.',
    name: 'Thomas Weber',
    role: 'Einzelanwalt, Familienrecht',
    initials: 'TW',
    rating: 5,
  },
  {
    quote: 'Meine Mandanten lieben das professionelle Onboarding-Erlebnis. Es setzt Erwartungen und schafft Vertrauen, noch bevor wir uns treffen.',
    name: 'Anna Hoffmann',
    role: 'Rechtsanwältin, Hoffmann Legal',
    initials: 'AH',
    rating: 5,
  },
]

export default function Home() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Dark mode swaps teal → orange
  const accent       = isDark ? '#F0923C' : '#254448'
  const accentLight  = isDark ? '#F5B876' : '#2E6569'
  const accentDeep   = isDark ? '#C8690A' : '#1e3a3d'
  const accentTint   = isDark ? 'rgba(240,146,60,0.12)' : 'rgba(37,68,72,0.12)'
  const accentTintBg = isDark ? 'rgba(240,146,60,0.08)' : 'rgba(37,68,72,0.03)'
  const accentGlow   = isDark ? 'rgba(240,146,60,0.35)' : 'rgba(37,68,72,0.35)'
  const sectionBg    = isDark
    ? `linear-gradient(160deg, #4A1E06 0%, #6B2D08 40%, #3A1504 100%)`
    : `linear-gradient(160deg, #254448 0%, #2E6569 50%, #1e3a3d 100%)`
  const ctaBg        = isDark
    ? `linear-gradient(135deg, #4A1E06 0%, #6B2D08 55%, #3A1504 100%)`
    : `linear-gradient(135deg, #254448 0%, #2E6569 60%, #1e3a3d 100%)`

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Header />

      {/* ── Hero ── */}
      <section style={{ position: 'relative', overflow: 'hidden', paddingTop: 140, paddingBottom: 100 }}>
        <div style={{
          position: 'absolute', top: -250, left: '50%', transform: 'translateX(-50%)',
          width: 1000, height: 1000, borderRadius: '50%',
          background: `radial-gradient(circle, ${isDark ? 'rgba(240,146,60,0.14)' : 'rgba(37,68,72,0.14)'} 0%, transparent 68%)`,
          pointerEvents: 'none',
        }} />
        <div className="bg-grid" style={{ position: 'absolute', inset: 0, opacity: 0.6, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <span className="section-label">
                <Zap size={12} /> Die Zukunft der Mandantenverwaltung
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
              fontWeight: 800, lineHeight: 1.08,
              letterSpacing: '-0.03em', color: 'var(--t1)',
              marginBottom: '1.5rem',
            }}>
              Rechtsberatung beginnt mit einem{' '}
              <span className="gradient-text">nahtlosen Mandantenerlebnis</span>
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--t4)', lineHeight: 1.75,
              marginBottom: '2.5rem',
              maxWidth: 580, margin: '0 auto 2.5rem',
            }}>
              LexFlow automatisiert das Mandanten-Intake, die Terminbuchung und das Fallmanagement – damit Ihre Anwälte beraten statt verwalten.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/onboarding" className="btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
                Als neuer Mandant starten <ChevronRight size={18} />
              </Link>
              <Link to="/portal" className="btn-secondary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
                Bestehender Mandant
              </Link>
            </div>

            <p style={{ color: 'var(--t6)', fontSize: '0.8125rem', marginTop: '1.25rem' }}>
              Keine Kreditkarte erforderlich · DSGVO-konform · Server in Deutschland
            </p>
          </div>

          {/* Dashboard Preview — forced dark so it always shows as a dark UI mockup */}
          <div data-theme="dark" style={{ maxWidth: 900, margin: '4rem auto 0', position: 'relative' }}>
            <div className="glass-card purple-glow" style={{ borderRadius: 18, overflow: 'hidden' }}>
              {/* Browser bar */}
              <div style={{
                background: '#141728', borderBottom: '1px solid rgba(255,255,255,0.08)',
                padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C940' }} />
                <div style={{
                  flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 6,
                  padding: '0.25rem 0.75rem', fontSize: '0.75rem', color: '#3A4060',
                  marginLeft: '0.75rem', maxWidth: 260,
                }}>
                  app.lexflow.de/dashboard
                </div>
              </div>

              {/* Mini dashboard */}
              <div style={{ padding: '1.5rem', background: '#0D102A' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {[
                    { label: 'Aktive Mandate', value: '47', trend: '+8%', color: accent },
                    { label: 'Diese Woche', value: '12', trend: '+3', color: '#10B981' },
                    { label: 'Termine', value: '8', trend: 'Heute', color: '#F59E0B' },
                    { label: 'Ausstehend', value: '5', trend: '2 dringend', color: '#EF4444' },
                  ].map((stat, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '0.875rem' }}>
                      <div style={{ fontSize: '0.7rem', color: '#5A6490', marginBottom: '0.375rem' }}>{stat.label}</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--t1)', lineHeight: 1 }}>{stat.value}</div>
                      <div style={{ fontSize: '0.7rem', color: stat.color, marginTop: '0.25rem' }}>{stat.trend}</div>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--t2)' }}>Aktuelle Mandanten</span>
                    <span style={{ fontSize: '0.75rem', color: accent, cursor: 'pointer' }}>Alle anzeigen →</span>
                  </div>
                  {[
                    { name: 'Maria Schmidt', case: 'Arbeitsrecht', status: 'Laufend', statusClass: 'status-in-progress', date: 'Heute, 14:00' },
                    { name: 'Klaus Bauer', case: 'Vertragsrecht', status: 'Neu', statusClass: 'status-new', date: 'Morgen, 10:30' },
                    { name: 'Eva Braun', case: 'Scheidungsverfahren', status: 'Wartend', statusClass: 'status-waiting', date: '16. Apr, 09:00' },
                  ].map((client, i) => (
                    <div key={i} style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: `linear-gradient(135deg, ${accent}, ${accentLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 700, color: 'white' }}>
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--t1)' }}>{client.name}</div>
                          <div style={{ fontSize: '0.7rem', color: '#5A6490' }}>{client.case}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className={`status-badge ${client.statusClass}`}>{client.status}</span>
                        <span style={{ fontSize: '0.7rem', color: '#5A6490' }}>{client.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: '3rem 1.5rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, background: `linear-gradient(135deg, ${accent}, ${accentLight})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 }}>
                  {stat.value}
                </div>
                <div style={{ color: 'var(--t4)', fontSize: '0.9375rem', marginTop: '0.375rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Funktionen ── */}
      <section id="features" style={{ padding: '6rem 1.5rem', background: sectionBg, position: 'relative', overflow: 'hidden' }}>
        {/* Background glow accents */}
        <div style={{ position: 'absolute', top: -120, right: -120, width: 500, height: 500, background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 360, height: 360, background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: 9999, padding: '0.3rem 1rem', fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>
                <TrendingUp size={12} /> Alles was Sie brauchen
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
              Eine Plattform für die gesamte<br />
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>Mandantenreise</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: '1.0625rem', maxWidth: 520, margin: '0 auto' }}>
              Vom ersten Kontakt bis zum Fallabschluss – LexFlow übernimmt die gesamte Mandantenbeziehung, damit Sie sich auf die rechtliche Arbeit konzentrieren können.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {features.map((f, i) => (
              <div key={i} style={{ borderRadius: 14, padding: '1.75rem', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)', backdropFilter: 'blur(8px)', transition: 'all 0.2s', cursor: 'default' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.transform = 'none' }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', marginBottom: '1.125rem' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.625rem' }}>{f.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: '0.9rem', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── So funktioniert es ── */}
      <section id="how-it-works" style={{ padding: '6rem 1.5rem', background: accentTintBg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <span className="section-label"><CheckCircle size={12} /> Einfacher Ablauf</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.03em' }}>
              So funktioniert LexFlow
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(12px)', borderRadius: 14, padding: '1.75rem', textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: `0 0 28px ${accentGlow}`, color: 'white' }}>
                  {step.icon}
                </div>
                <div style={{ display: 'inline-block', background: accentTint, color: accent, fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 6, marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                  {step.number}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--t1)', marginBottom: '0.625rem' }}>{step.title}</h3>
                <p style={{ color: 'var(--t4)', fontSize: '0.875rem', lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <span className="section-label"><Star size={12} /> Stimmen unserer Kunden</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.03em' }}>
              Vertraut von Rechtsanwälten
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(12px)', borderRadius: 14, padding: '1.75rem' }}>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} size={14} fill="#F5C842" color="#F5C842" />
                  ))}
                </div>
                <p style={{ color: 'var(--t2)', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '1.25rem', fontStyle: 'italic' }}>
                  „{t.quote}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${accent}, ${accentLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700, color: 'white' }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--t1)', fontSize: '0.9375rem' }}>{t.name}</div>
                    <div style={{ color: 'var(--t4)', fontSize: '0.8125rem' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            background: ctaBg,
            borderRadius: 22, padding: '3.5rem 2.5rem',
            position: 'relative', overflow: 'hidden',
            boxShadow: `0 8px 40px ${accentGlow}`,
          }}>
            {/* Subtle radial highlight */}
            <div style={{ position: 'absolute', top: -100, right: -100, width: 380, height: 380, background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <Lock size={28} color="rgba(255,255,255,0.75)" style={{ marginBottom: '1.25rem' }} />
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
              Bereit, Ihre Kanzlei zu modernisieren?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: '1.0625rem', marginBottom: '2rem', lineHeight: 1.65 }}>
              Schließen Sie sich hunderten Juristen an, die ihre Mandantenverwaltung mit LexFlow transformiert haben.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/onboarding" style={{ background: '#ffffff', color: accent, padding: '0.875rem 2rem', borderRadius: 8, fontWeight: 700, fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
                Als neuer Mandant starten <ArrowRight size={18} />
              </Link>
              <Link to="/dashboard" style={{ background: 'transparent', color: '#ffffff', padding: '0.875rem 2rem', borderRadius: 8, fontWeight: 600, fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.45)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.75)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)' }}>
                Anwalt-Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
