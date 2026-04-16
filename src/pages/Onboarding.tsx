import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Check, User, Briefcase, FileText, Calendar, Shield } from 'lucide-react'

type FormData = {
  firstName: string; lastName: string; email: string; phone: string; dob: string
  legalArea: string; urgency: string; description: string
  hasExistingDocuments: string; previousLawyer: string; budget: string
  privacyAccepted: boolean; termsAccepted: boolean
}

const legalAreas = [
  'Arbeitsrecht', 'Familienrecht / Scheidung', 'Vertragsrecht',
  'Strafrecht', 'Immobilienrecht', 'Gesellschaftsrecht',
  'Ausländerrecht / Asyl', 'Erbrecht', 'Gewerblicher Rechtsschutz', 'Sonstiges',
]

const urgencyLevels = [
  { value: 'urgent', label: 'Dringend', sub: 'Innerhalb von 24–48 Stunden', color: '#EF4444' },
  { value: 'soon', label: 'Zeitnah', sub: '3–7 Werktage', color: '#F59E0B' },
  { value: 'normal', label: 'Keine Eile', sub: 'Innerhalb von 2–3 Wochen', color: '#10B981' },
]

const steps = [
  { label: 'Persönliche Daten', icon: <User size={16} /> },
  { label: 'Ihr Anliegen', icon: <Briefcase size={16} /> },
  { label: 'Details', icon: <FileText size={16} /> },
  { label: 'Bestätigung', icon: <Shield size={16} /> },
]

const initialForm: FormData = {
  firstName: '', lastName: '', email: '', phone: '', dob: '',
  legalArea: '', urgency: '', description: '',
  hasExistingDocuments: '', previousLawyer: '', budget: '',
  privacyAccepted: false, termsAccepted: false,
}

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const canProceed = () => {
    if (step === 0) return form.firstName && form.lastName && form.email && form.phone
    if (step === 1) return form.legalArea && form.urgency && form.description.length >= 20
    if (step === 2) return form.hasExistingDocuments !== ''
    if (step === 3) return form.privacyAccepted && form.termsAccepted
    return true
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: 540, width: '100%', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #F0923C, #E8700A)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 40px rgba(240,146,60,0.45)' }}>
            <Check size={36} color="white" strokeWidth={3} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--t1)', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
            Onboarding abgeschlossen!
          </h1>
          <p style={{ color: 'var(--t4)', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Vielen Dank, <strong style={{ color: 'var(--t1)' }}>{form.firstName}</strong>. Ihr Fall wurde erfolgreich übermittelt. Unser Team wird Ihre Angaben prüfen und sich innerhalb von 24 Stunden bei Ihnen melden.
          </p>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--t2)', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Ihre Angaben</h3>
            {[
              { label: 'Name', value: `${form.firstName} ${form.lastName}` },
              { label: 'E-Mail', value: form.email },
              { label: 'Rechtsgebiet', value: form.legalArea },
              { label: 'Dringlichkeit', value: urgencyLevels.find(u => u.value === form.urgency)?.label ?? '' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--t5)', fontSize: '0.9rem' }}>{item.label}</span>
                <span style={{ color: 'var(--t1)', fontSize: '0.9rem', fontWeight: 500 }}>{item.value}</span>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(37,68,72,0.1)', border: '1px solid rgba(37,68,72,0.3)', borderRadius: 14, padding: '1.25rem 1.5rem', marginBottom: '1.25rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #254448, #254448)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'white' }}>KI</span>
              </div>
              <span style={{ color: 'var(--accent-d)', fontWeight: 700, fontSize: '0.9375rem' }}>Nächster Schritt: KI-Dokumenten-Assistent</span>
            </div>
            <p style={{ color: 'var(--t4)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Unser KI-Assistent führt Sie durch den Dokumenten-Upload und bereitet Ihren Fall optimal vor – schnell, sicher und ohne Wartezeit.
            </p>
            <button onClick={() => navigate('/intake')} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              KI-Intake starten <ChevronRight size={16} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button onClick={() => navigate('/booking')} className="btn-secondary">
              <Calendar size={16} /> Termin buchen
            </button>
            <Link to="/" className="btn-secondary">Zur Startseite</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-header)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 40 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div className="logo-circle-sm">LF</div>
          <span style={{ fontWeight: 800, color: 'var(--t1)', fontSize: '1.0625rem' }}>LexFlow</span>
        </Link>
        <span style={{ color: 'var(--t5)', fontSize: '0.875rem' }}>Neues Mandatsverhältnis</span>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ width: '100%', maxWidth: 640 }}>

          {/* Step indicators */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem' }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: i < step ? 'linear-gradient(135deg, #F0923C, #E8700A)' : i === step ? '#254448' : 'var(--bg-card-sub)',
                    border: i === step ? '2px solid #254448' : i < step ? '2px solid #F0923C' : '2px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: i <= step ? 'white' : 'var(--t5)', transition: 'all 0.3s',
                    boxShadow: i === step ? '0 0 18px rgba(37,68,72,0.35)' : i < step ? '0 0 14px rgba(240,146,60,0.35)' : 'none', flexShrink: 0,
                  }}>
                    {i < step ? <Check size={16} /> : s.icon}
                  </div>
                  <span style={{ fontSize: '0.6875rem', color: i === step ? 'var(--accent-d)' : i < step ? '#E8700A' : 'var(--t5)', marginTop: '0.25rem', whiteSpace: 'nowrap', fontWeight: i === step ? 600 : 400 }}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ flex: 1, height: 2, margin: '0 0.5rem', marginBottom: '1.25rem', background: i < step ? 'linear-gradient(90deg, #E8700A, #F0923C)' : 'var(--border)', transition: 'background 0.3s' }} />
                )}
              </div>
            ))}
          </div>

          {/* Card */}
          <div className="onboarding-card" style={{ background: '#254448', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 16, padding: '2.5rem', boxShadow: '0 8px 40px rgba(37,68,72,0.3)' }}>

            {/* Schritt 1: Persönliche Daten */}
            {step === 0 && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>Persönliche Angaben</h2>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9375rem', marginBottom: '2rem' }}>Bitte geben Sie Ihre Kontaktdaten an, damit wir Sie erreichen können.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Vorname *</label>
                    <input className="input-dark" placeholder="Maria" value={form.firstName} onChange={set('firstName')} />
                  </div>
                  <div>
                    <label style={labelStyle}>Nachname *</label>
                    <input className="input-dark" placeholder="Schmidt" value={form.lastName} onChange={set('lastName')} />
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>E-Mail-Adresse *</label>
                  <input className="input-dark" type="email" placeholder="maria.schmidt@email.de" value={form.email} onChange={set('email')} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Telefonnummer *</label>
                    <input className="input-dark" placeholder="+49 30 ..." value={form.phone} onChange={set('phone')} />
                  </div>
                  <div>
                    <label style={labelStyle}>Geburtsdatum</label>
                    <input className="input-dark" type="date" value={form.dob} onChange={set('dob')} style={{ colorScheme: 'dark' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Schritt 2: Rechtliches Anliegen */}
            {step === 1 && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>Ihr rechtliches Anliegen</h2>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9375rem', marginBottom: '2rem' }}>Beschreiben Sie uns das rechtliche Problem, bei dem Sie Unterstützung benötigen.</p>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={labelStyle}>Rechtsgebiet *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.625rem' }}>
                    {legalAreas.map(area => (
                      <button
                        key={area}
                        onClick={() => setForm(prev => ({ ...prev, legalArea: area }))}
                        style={{ padding: '0.75rem 1rem', borderRadius: 10, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left', border: form.legalArea === area ? '2px solid #ffffff' : '2px solid rgba(255,255,255,0.55)', background: form.legalArea === area ? '#ffffff' : 'rgba(255,255,255,0.14)', color: form.legalArea === area ? '#254448' : '#ffffff', transition: 'all 0.15s', fontFamily: 'Inter, sans-serif', boxShadow: form.legalArea === area ? '0 0 0 3px rgba(255,255,255,0.25), inset 0 0 0 1px rgba(255,255,255,0.5)' : 'none' }}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={labelStyle}>Dringlichkeit *</label>
                  <div style={{ display: 'grid', gap: '0.625rem' }}>
                    {urgencyLevels.map(u => (
                      <button
                        key={u.value}
                        onClick={() => setForm(prev => ({ ...prev, urgency: u.value }))}
                        style={{ padding: '0.875rem 1.125rem', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: form.urgency === u.value ? `2px solid #ffffff` : '2px solid rgba(255,255,255,0.55)', background: form.urgency === u.value ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)', transition: 'all 0.15s', fontFamily: 'Inter, sans-serif', boxShadow: form.urgency === u.value ? '0 0 0 3px rgba(255,255,255,0.2)' : 'none' }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9375rem', textAlign: 'left' }}>{u.label}</div>
                          <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.65)', textAlign: 'left' }}>{u.sub}</div>
                        </div>
                        {form.urgency === u.value && <Check size={18} color={u.color} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Kurze Beschreibung * <span style={{ color: 'var(--t5)', fontWeight: 400 }}>(mind. 20 Zeichen)</span></label>
                  <textarea className="input-dark" rows={4} placeholder="Bitte beschreiben Sie Ihre rechtliche Situation kurz..." value={form.description} onChange={set('description')} style={{ resize: 'vertical', minHeight: 100 }} />
                  <div style={{ fontSize: '0.75rem', color: form.description.length >= 20 ? '#10B981' : 'var(--t5)', marginTop: '0.25rem', textAlign: 'right' }}>
                    {form.description.length} / 20+ Zeichen
                  </div>
                </div>
              </div>
            )}

            {/* Schritt 3: Details */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>Weitere Details</h2>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9375rem', marginBottom: '2rem' }}>Noch ein paar Fragen, damit wir Ihre Beratung optimal vorbereiten können.</p>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>Haben Sie bereits Dokumente zu diesem Fall? *</label>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {['Ja', 'Nein', 'Unsicher'].map(opt => (
                      <button key={opt} onClick={() => setForm(prev => ({ ...prev, hasExistingDocuments: opt }))}
                        style={{ flex: 1, padding: '0.75rem', borderRadius: 10, cursor: 'pointer', border: form.hasExistingDocuments === opt ? '2px solid #ffffff' : '2px solid rgba(255,255,255,0.55)', background: form.hasExistingDocuments === opt ? '#ffffff' : 'rgba(255,255,255,0.14)', color: form.hasExistingDocuments === opt ? '#254448' : '#ffffff', fontWeight: form.hasExistingDocuments === opt ? 700 : 600, fontSize: '0.9rem', transition: 'all 0.15s', fontFamily: 'Inter, sans-serif', boxShadow: form.hasExistingDocuments === opt ? '0 0 0 3px rgba(255,255,255,0.25)' : 'none' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={labelStyle}>Haben Sie sich bereits an einen Anwalt gewandt?</label>
                  <select className="input-dark" value={form.previousLawyer} onChange={set('previousLawyer')} style={{ appearance: 'none' }}>
                    <option value="">Bitte auswählen...</option>
                    <option value="no">Nein, das ist das erste Mal</option>
                    <option value="yes-same">Ja, zu diesem Fall</option>
                    <option value="yes-other">Ja, zu einem anderen Fall</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Geschätztes Budget für rechtliche Dienstleistungen</label>
                  <select className="input-dark" value={form.budget} onChange={set('budget')} style={{ appearance: 'none' }}>
                    <option value="">Keine Angabe</option>
                    <option value="under-500">Unter 500 €</option>
                    <option value="500-2000">500 € – 2.000 €</option>
                    <option value="2000-5000">2.000 € – 5.000 €</option>
                    <option value="5000+">Über 5.000 €</option>
                    <option value="hourly">Stundensatz bevorzugt</option>
                  </select>
                </div>
              </div>
            )}

            {/* Schritt 4: Bestätigung */}
            {step === 3 && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>Fast geschafft!</h2>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9375rem', marginBottom: '2rem' }}>Bitte überprüfen Sie Ihre Angaben und stimmen Sie unseren Bedingungen zu.</p>

                {/* Zusammenfassung */}
                <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.75rem' }}>
                  <h3 style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Zusammenfassung</h3>
                  {[
                    { label: 'Name', value: `${form.firstName} ${form.lastName}` },
                    { label: 'E-Mail', value: form.email },
                    { label: 'Telefon', value: form.phone },
                    { label: 'Rechtsgebiet', value: form.legalArea },
                    { label: 'Dringlichkeit', value: urgencyLevels.find(u => u.value === form.urgency)?.label ?? '' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>{item.label}</span>
                      <span style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 600 }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Zustimmungen */}
                {[
                  { field: 'privacyAccepted' as keyof FormData, label: 'Ich stimme der Datenschutzerklärung zu und bin mit der Verarbeitung meiner personenbezogenen Daten zum Zweck der Rechtsberatung einverstanden.' },
                  { field: 'termsAccepted' as keyof FormData, label: 'Ich akzeptiere die Nutzungsbedingungen und verstehe, dass das Ausfüllen dieses Formulars kein Mandatsverhältnis begründet.' },
                ].map(item => (
                  <label key={item.field} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }}>
                    <div
                      onClick={() => setForm(prev => ({ ...prev, [item.field]: !prev[item.field] }))}
                      style={{ width: 20, height: 20, borderRadius: 5, flexShrink: 0, marginTop: 1, background: form[item.field] ? '#ffffff' : 'rgba(255,255,255,0.1)', border: form[item.field] ? '2px solid #ffffff' : '1.5px solid rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', cursor: 'pointer' }}
                    >
                      {form[item.field] && <Check size={12} color="#254448" strokeWidth={3} />}
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', lineHeight: 1.6 }}>{item.label}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              <button onClick={() => setStep(s => s - 1)} disabled={step === 0} className="btn-ghost" style={{ opacity: step === 0 ? 0.3 : 1 }}>
                <ChevronLeft size={16} /> Zurück
              </button>
              {step < steps.length - 1 ? (
                <button onClick={() => setStep(s => s + 1)} disabled={!canProceed()} className="btn-primary" style={{ opacity: canProceed() ? 1 : 0.4 }}>
                  Weiter <ChevronRight size={16} />
                </button>
              ) : (
                <button onClick={() => setSubmitted(true)} disabled={!canProceed()} className="btn-primary" style={{ opacity: canProceed() ? 1 : 0.4 }}>
                  <Check size={16} /> Absenden & abschließen
                </button>
              )}
            </div>
          </div>

          <p style={{ textAlign: 'center', color: 'var(--t4)', fontSize: '0.8125rem', marginTop: '1.5rem' }}>
            Bereits registriert?{' '}
            <Link to="/portal" style={{ color: 'var(--accent-d)', textDecoration: 'none', fontWeight: 600 }}>Im Mandantenportal anmelden</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.875rem', fontWeight: 600,
  color: 'rgba(255,255,255,0.9)', marginBottom: '0.5rem',
}
