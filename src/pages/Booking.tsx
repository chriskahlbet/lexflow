import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Check, Calendar, Clock, Video, Phone, MapPin, User } from 'lucide-react'

const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

const lawyers = [
  { id: 1, name: 'Dr. Klaus Bauer', specialty: 'Arbeitsrecht', initials: 'KB', available: 12 },
  { id: 2, name: 'Sarah Hoffmann', specialty: 'Familienrecht · Scheidung', initials: 'SH', available: 8 },
  { id: 3, name: 'Marcus Weber', specialty: 'Gesellschafts- & Vertragsrecht', initials: 'MW', available: 15 },
  { id: 4, name: 'Dr. Lena Fischer', specialty: 'Immobilien- & Erbrecht', initials: 'LF', available: 6 },
]

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00',
]
const unavailableSlots = ['09:30', '11:00', '13:30', '15:00', '16:30']

const consultationTypes = [
  { id: 'video', label: 'Videoanruf', sub: 'Zoom oder Teams', icon: <Video size={18} />, color: '#254448' },
  { id: 'phone', label: 'Telefonanruf', sub: 'Wir rufen Sie an', icon: <Phone size={18} />, color: '#254448' },
  { id: 'in-person', label: 'Persönlich', sub: 'In unserem Büro', icon: <MapPin size={18} />, color: '#254448' },
]

function getDaysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate() }
function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

export default function Booking() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedLawyer, setSelectedLawyer] = useState<number | null>(null)
  const [consultationType, setConsultationType] = useState<string>('video')
  const [topic, setTopic] = useState('')
  const [step, setStep] = useState<'select' | 'confirm' | 'done'>('select')

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1); setSelectedDay(null) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1); setSelectedDay(null) }

  const isPastDay = (day: number) => new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const isWeekend = (day: number) => { const dow = new Date(year, month, day).getDay(); return dow === 0 || dow === 6 }

  const canConfirm = selectedDay && selectedTime && selectedLawyer && consultationType
  const selectedLawyerObj = lawyers.find(l => l.id === selectedLawyer)

  const cardStyle = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    backdropFilter: 'blur(16px)',
    borderRadius: 16,
    padding: '1.75rem',
    boxShadow: 'var(--card-shadow)',
  }

  if (step === 'done') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: 500, width: '100%', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 40px rgba(16,185,129,0.4)' }}>
            <Check size={36} color="white" strokeWidth={3} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--t1)', marginBottom: '0.875rem', letterSpacing: '-0.03em' }}>Termin bestätigt!</h1>
          <p style={{ color: 'var(--t4)', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Ihr Termin wurde gebucht. Eine Bestätigung wurde an Ihre E-Mail gesendet.
          </p>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
            {[
              { label: 'Datum', value: `${selectedDay}. ${MONTHS[month]} ${year}` },
              { label: 'Uhrzeit', value: selectedTime },
              { label: 'Anwalt', value: selectedLawyerObj?.name },
              { label: 'Art', value: consultationTypes.find(t => t.id === consultationType)?.label },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--t5)', fontSize: '0.9rem' }}>{item.label}</span>
                <span style={{ color: 'var(--t1)', fontWeight: 600, fontSize: '0.9rem' }}>{item.value}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link to="/portal" className="btn-primary">Zum Mandantenportal</Link>
            <Link to="/" className="btn-secondary">Zur Startseite</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, background: 'var(--bg-header)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 40 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div className="logo-circle-sm">LF</div>
          <span style={{ fontWeight: 800, color: 'var(--t1)' }}>LexFlow</span>
        </Link>
        <span style={{ color: 'var(--t5)', fontSize: '0.875rem' }}>Termin buchen</span>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {step === 'select' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Beratungsgespräch buchen</h1>
              <p style={{ color: 'var(--t4)', fontSize: '1.0625rem' }}>Wählen Sie Ihren Anwalt, Datum und die gewünschte Uhrzeit.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Anwalt wählen */}
                <div style={cardStyle}>
                  <h3 style={{ fontWeight: 700, color: 'var(--t1)', marginBottom: '1.25rem', fontSize: '1.0625rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={16} color="#254448" /> Anwalt auswählen
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                    {lawyers.map(lawyer => (
                      <button key={lawyer.id} onClick={() => setSelectedLawyer(lawyer.id)}
                        style={{ padding: '1rem', borderRadius: 12, border: selectedLawyer === lawyer.id ? '1px solid rgba(134,239,172,0.7)' : '1px solid rgba(255,255,255,0.1)', background: selectedLawyer === lawyer.id ? 'rgba(37,68,72,0.2)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'Inter, sans-serif' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
                          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #254448, #254448)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                            {lawyer.initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--t1)', fontSize: '0.875rem' }}>{lawyer.name}</div>
                            <div style={{ color: 'var(--t5)', fontSize: '0.75rem' }}>{lawyer.specialty}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#254448' }}>{lawyer.available} freie Slots</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Kalender */}
                <div style={cardStyle}>
                  <h3 style={{ fontWeight: 700, color: 'var(--t1)', marginBottom: '1.25rem', fontSize: '1.0625rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} color="#254448" /> Datum auswählen
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <button onClick={prevMonth} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 8, padding: '0.5rem', cursor: 'pointer', color: 'var(--t2)', display: 'flex' }}>
                      <ChevronLeft size={16} />
                    </button>
                    <span style={{ fontWeight: 600, color: 'var(--t1)', fontSize: '1rem' }}>{MONTHS[month]} {year}</span>
                    <button onClick={nextMonth} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 8, padding: '0.5rem', cursor: 'pointer', color: 'var(--t2)', display: 'flex' }}>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', marginBottom: '0.5rem' }}>
                    {DAYS.map(d => (
                      <div key={d} style={{ textAlign: 'center', fontSize: '0.75rem', color: '#2E3460', fontWeight: 600, padding: '0.25rem' }}>{d}</div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
                    {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                      const disabled = isPastDay(day) || isWeekend(day)
                      const isSelected = selectedDay === day
                      return (
                        <button key={day} disabled={disabled} onClick={() => { setSelectedDay(day); setSelectedTime(null) }}
                          style={{ aspectRatio: '1', borderRadius: 8, border: isSelected ? '1px solid rgba(134,239,172,0.7)' : '1px solid transparent', background: isSelected ? 'linear-gradient(135deg, #254448, #254448)' : 'transparent', color: disabled ? '#1E2240' : isSelected ? 'white' : 'var(--t2)', fontSize: '0.875rem', fontWeight: isSelected ? 700 : 400, cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.15s', fontFamily: 'Inter, sans-serif', boxShadow: isSelected ? '0 0 14px rgba(37,68,72,0.35)' : 'none' }}
                          onMouseEnter={e => { if (!disabled && !isSelected) e.currentTarget.style.background = 'rgba(37,68,72,0.18)' }}
                          onMouseLeave={e => { if (!disabled && !isSelected) e.currentTarget.style.background = 'transparent' }}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Uhrzeiten */}
                {selectedDay && (
                  <div style={cardStyle}>
                    <h3 style={{ fontWeight: 700, color: 'var(--t1)', marginBottom: '1.25rem', fontSize: '1.0625rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={16} color="#254448" /> Verfügbare Zeiten — {selectedDay}. {MONTHS[month]}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                      {timeSlots.map(slot => {
                        const unavail = unavailableSlots.includes(slot)
                        const isSelected = selectedTime === slot
                        return (
                          <button key={slot} disabled={unavail} onClick={() => setSelectedTime(slot)}
                            style={{ padding: '0.5rem', borderRadius: 8, border: isSelected ? '1px solid rgba(134,239,172,0.7)' : '1px solid rgba(255,255,255,0.09)', background: isSelected ? 'linear-gradient(135deg, #254448, #254448)' : unavail ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.05)', color: unavail ? '#1E2240' : isSelected ? 'white' : 'var(--t2)', fontSize: '0.875rem', fontWeight: isSelected ? 600 : 400, cursor: unavail ? 'not-allowed' : 'pointer', transition: 'all 0.15s', textDecoration: unavail ? 'line-through' : 'none', fontFamily: 'Inter, sans-serif' }}>
                            {slot}
                          </button>
                        )
                      })}
                    </div>
                    <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(37,68,72,0.4)', border: '1px solid rgba(134,239,172,0.5)' }} />
                        <span style={{ color: 'var(--t5)', fontSize: '0.75rem' }}>Verfügbar</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }} />
                        <span style={{ color: 'var(--t5)', fontSize: '0.75rem' }}>Belegt</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Rechte Sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '4.5rem' }}>
                {/* Beratungsart */}
                <div style={{ ...cardStyle, padding: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, color: 'var(--t1)', marginBottom: '1rem', fontSize: '1rem' }}>Beratungsart</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {consultationTypes.map(ct => (
                      <button key={ct.id} onClick={() => setConsultationType(ct.id)}
                        style={{ padding: '0.75rem', borderRadius: 10, border: consultationType === ct.id ? `1px solid ${ct.color}66` : '1px solid rgba(255,255,255,0.1)', background: consultationType === ct.id ? `${ct.color}18` : 'rgba(255,255,255,0.03)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'all 0.15s', fontFamily: 'Inter, sans-serif' }}>
                        <div style={{ color: consultationType === ct.id ? ct.color : 'var(--t5)' }}>{ct.icon}</div>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontWeight: 600, color: consultationType === ct.id ? 'var(--t1)' : 'var(--t2)', fontSize: '0.875rem' }}>{ct.label}</div>
                          <div style={{ color: 'var(--t5)', fontSize: '0.75rem' }}>{ct.sub}</div>
                        </div>
                        {consultationType === ct.id && <Check size={14} color={ct.color} style={{ marginLeft: 'auto' }} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Thema */}
                <div style={{ ...cardStyle, padding: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, color: 'var(--t1)', marginBottom: '0.75rem', fontSize: '1rem' }}>Thema (optional)</h3>
                  <textarea className="input-dark" rows={3} placeholder="Kurze Beschreibung, worüber Sie sprechen möchten..." value={topic} onChange={e => setTopic(e.target.value)} style={{ resize: 'none', fontSize: '0.875rem' }} />
                </div>

                {/* Zusammenfassung */}
                <div style={{ ...cardStyle, padding: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, color: 'var(--t1)', marginBottom: '1rem', fontSize: '1rem' }}>Zusammenfassung</h3>
                  {[
                    { label: 'Anwalt', value: selectedLawyerObj?.name ?? '—' },
                    { label: 'Datum', value: selectedDay ? `${selectedDay}. ${MONTHS[month]} ${year}` : '—' },
                    { label: 'Uhrzeit', value: selectedTime ?? '—' },
                    { label: 'Art', value: consultationTypes.find(t => t.id === consultationType)?.label ?? '—' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--t5)', fontSize: '0.8125rem' }}>{item.label}</span>
                      <span style={{ color: item.value === '—' ? '#2E3460' : 'var(--t1)', fontSize: '0.8125rem', fontWeight: 500 }}>{item.value}</span>
                    </div>
                  ))}
                  <button onClick={() => setStep('confirm')} disabled={!canConfirm} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', opacity: canConfirm ? 1 : 0.4 }}>
                    Weiter zur Bestätigung
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 'confirm' && (
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <button onClick={() => setStep('select')} className="btn-ghost" style={{ marginBottom: '1.5rem' }}>
              <ChevronLeft size={16} /> Zurück zur Auswahl
            </button>
            <div style={{ ...cardStyle, padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--t1)', marginBottom: '0.5rem' }}>Termin bestätigen</h2>
              <p style={{ color: 'var(--t4)', marginBottom: '2rem', fontSize: '0.9375rem' }}>Bitte prüfen Sie Ihre Angaben, bevor Sie den Termin buchen.</p>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Anwalt', value: selectedLawyerObj?.name },
                  { label: 'Fachgebiet', value: selectedLawyerObj?.specialty },
                  { label: 'Datum', value: `${selectedDay}. ${MONTHS[month]} ${year}` },
                  { label: 'Uhrzeit', value: selectedTime },
                  { label: 'Art', value: consultationTypes.find(t => t.id === consultationType)?.label },
                  ...(topic ? [{ label: 'Thema', value: topic }] : []),
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                    <span style={{ color: 'var(--t5)', fontSize: '0.9rem' }}>{item.label}</span>
                    <span style={{ color: 'var(--t1)', fontSize: '0.9rem', fontWeight: 500, maxWidth: '55%', textAlign: 'right' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: 'rgba(37,68,72,0.09)', border: '1px solid rgba(74,222,128,0.22)', borderRadius: 10, padding: '0.875rem 1rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--t2)', lineHeight: 1.6 }}>
                Nach der Buchung erhalten Sie eine Bestätigungs-E-Mail. Sie können den Termin bis zu 24 Stunden vorher verschieben oder absagen.
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setStep('select')} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Ändern</button>
                <button onClick={() => setStep('done')} className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                  <Check size={16} /> Termin verbindlich buchen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
