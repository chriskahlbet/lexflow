import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Send, Bot, User, CheckCircle, Calendar } from 'lucide-react'

type Message = {
  id: number
  role: 'bot' | 'user'
  content: string
  options?: string[]
  inputType?: 'text' | 'email'
}

type Step = {
  field: string
  question: string
  options?: string[]
  inputType?: 'text' | 'email'
  followUp?: (val: string) => string
}

const intakeSteps: Step[] = [
  {
    field: 'name',
    question: "Willkommen bei LexFlow! Ich bin Ihr digitaler Rechtsassistent.\n\nBevor ich Sie mit dem richtigen Anwalt verbinde, benötige ich einige Informationen. Das dauert nur ca. 3–5 Minuten.\n\nWie ist Ihr vollständiger Name?",
    inputType: 'text',
  },
  {
    field: 'email',
    question: "Schön, Sie kennenzulernen! Wie lautet Ihre E-Mail-Adresse? Wir senden Ihnen dort Ihre Fallzusammenfassung zu.",
    inputType: 'email',
  },
  {
    field: 'legalArea',
    question: 'Welches Rechtsgebiet betrifft Ihr Anliegen?',
    options: ['Arbeitsrecht', 'Familienrecht / Scheidung', 'Vertragsrecht', 'Strafrecht', 'Immobilienrecht', 'Erbrecht', 'Gesellschaftsrecht', 'Ausländerrecht', 'Sonstiges'],
  },
  {
    field: 'situation',
    question: '',
    followUp: (area) => `Ich sehe, Sie benötigen Hilfe im Bereich **${area}**. Können Sie Ihre Situation kurz beschreiben? Was ist passiert, und wann hat es begonnen?`,
    inputType: 'text',
  },
  {
    field: 'urgency',
    question: 'Wie dringend ist Ihr Anliegen?',
    options: ['Kritisch – Ich brauche innerhalb von 24 Stunden Hilfe', 'Dringend – Innerhalb dieser Woche', 'Normal – Innerhalb von 2–3 Wochen', 'Keine Eile – Wenn es passt'],
  },
  {
    field: 'previousContact',
    question: 'Haben Sie in dieser Angelegenheit bereits rechtliche Schritte unternommen oder einen Anwalt kontaktiert?',
    options: ['Nein, das ist mein erster Schritt', 'Ja, ich habe bereits einen Anwalt konsultiert', 'Ja, es laufen bereits Verfahren'],
  },
  {
    field: 'documents',
    question: 'Haben Sie relevante Dokumente zu diesem Fall (Verträge, Briefe, Gerichtsdokumente)?',
    options: ['Ja, ich habe Dokumente', 'Noch keine Dokumente', 'Ich bin mir nicht sicher, was relevant ist'],
  },
  {
    field: 'goal',
    question: 'Was erhoffen Sie sich als Ergebnis? Wie sieht ein erfolgreiches Ergebnis für Sie aus?',
    inputType: 'text',
  },
  {
    field: 'contactMethod',
    question: 'Wie möchten Sie für die erste Beratung kontaktiert werden?',
    options: ['Videoanruf (Zoom/Teams)', 'Telefonanruf', 'Persönlich im Büro', 'Erst per E-Mail, dann entscheiden'],
  },
]

export default function IntakeBotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [stepIndex, setStepIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [finished, setFinished] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    askStep(0, {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const askStep = (idx: number, currentAnswers: Record<string, string>) => {
    if (idx >= intakeSteps.length) {
      finishIntake(currentAnswers)
      return
    }
    const step = intakeSteps[idx]
    const question = step.followUp
      ? step.followUp(currentAnswers[intakeSteps[idx - 1]?.field] ?? '')
      : step.question

    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, { id: Date.now(), role: 'bot', content: question, options: step.options, inputType: step.inputType }])
    }, 900 + Math.random() * 400)
  }

  const handleAnswer = (value: string) => {
    if (!value.trim()) return
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: value }])
    setInputValue('')
    const step = intakeSteps[stepIndex]
    const newAnswers = { ...answers, [step.field]: value }
    setAnswers(newAnswers)
    const next = stepIndex + 1
    setStepIndex(next)
    askStep(next, newAnswers)
  }

  const finishIntake = (finalAnswers: Record<string, string>) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, {
        id: Date.now(), role: 'bot',
        content: `Vielen Dank, **${finalAnswers.name}**! Ich habe alle benötigten Informationen erfasst.\n\nIhre Fallzusammenfassung wurde an **${finalAnswers.email}** gesendet. Ein auf **${finalAnswers.legalArea}** spezialisierter Anwalt wird Ihren Fall prüfen und sich **innerhalb von 24 Stunden** bei Ihnen melden.\n\nMöchten Sie direkt einen Termin buchen?`,
      }])
      setFinished(true)
    }, 1200)
  }

  const currentStep = intakeSteps[stepIndex]
  const progress = Math.min((stepIndex / intakeSteps.length) * 100, 100)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-sub)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-header)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 40 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div className="logo-circle-sm">LF</div>
          <span style={{ fontWeight: 800, color: 'var(--t1)', fontSize: '1.0625rem' }}>LexFlow</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: 'var(--t5)', fontSize: '0.8125rem' }}>Rechts-Intake</span>
          {!finished ? (
            <div style={{ width: 100, height: 4, background: 'var(--border)', borderRadius: 2 }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #254448, #254448)', borderRadius: 2, transition: 'width 0.4s ease' }} />
            </div>
          ) : (
            <CheckCircle size={16} color="#10B981" />
          )}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 1.5rem', maxWidth: 720, width: '100%', margin: '0 auto' }}>
        {messages.map((msg, msgIdx) => (
          <div key={msg.id} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: msg.role === 'bot' ? 'linear-gradient(135deg, #254448, #254448)' : 'rgba(255,255,255,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: msg.role === 'bot' ? '0 0 14px rgba(26,51,38,0.35)' : 'none' }}>
              {msg.role === 'bot' ? <Bot size={18} color="white" /> : <User size={18} color="#B0B8D8" />}
            </div>
            <div style={{ maxWidth: '78%' }}>
              <div style={{ padding: '0.875rem 1.125rem', borderRadius: msg.role === 'bot' ? '4px 14px 14px 14px' : '14px 4px 14px 14px', background: msg.role === 'bot' ? '#254448' : 'linear-gradient(135deg, #2E6569, #254448)', border: 'none', color: '#ffffff', fontSize: '0.9375rem', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
                {msg.content.split('**').map((part, i) =>
                  i % 2 === 1 ? <strong key={i} style={{ color: '#FAD4A0' }}>{part}</strong> : part
                )}
              </div>

              {/* Option buttons — only show for last bot message that has options */}
              {msg.options && msgIdx === messages.length - 1 && !finished && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.625rem' }}>
                  {msg.options.map(opt => (
                    <button key={opt} onClick={() => handleAnswer(opt)}
                      style={{ padding: '0.5rem 0.875rem', borderRadius: 20, border: '1.5px solid rgba(37,68,72,0.6)', background: '#254448', color: '#ffffff', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Inter, sans-serif' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#2E6569'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(37,68,72,0.3)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#254448'; e.currentTarget.style.boxShadow = 'none' }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #254448, #254448)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 14px rgba(26,51,38,0.35)' }}>
              <Bot size={18} color="white" />
            </div>
            <div style={{ padding: '0.875rem 1.25rem', borderRadius: '4px 14px 14px 14px', background: '#254448', border: 'none', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        {/* Abschluss-CTA */}
        {finished && !isTyping && (
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/booking" className="btn-primary">
              <Calendar size={16} /> Termin buchen
            </Link>
            <Link to="/" className="btn-secondary">Zur Startseite</Link>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!finished && !isTyping && currentStep?.inputType && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.18)', padding: '1.25rem 1.5rem', background: 'var(--bg-header)', backdropFilter: 'blur(20px)' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', gap: '0.75rem' }}>
            <input
              className="input-dark"
              type={currentStep.inputType === 'email' ? 'email' : 'text'}
              placeholder={currentStep.inputType === 'email' ? 'ihre@email.de' : 'Antwort eingeben...'}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAnswer(inputValue)}
              autoFocus
            />
            <button className="btn-primary" onClick={() => handleAnswer(inputValue)} disabled={!inputValue.trim()} style={{ opacity: inputValue.trim() ? 1 : 0.4, padding: '0.75rem 1.25rem', flexShrink: 0 }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
