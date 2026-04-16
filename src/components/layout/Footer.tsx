import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-2)',
      borderTop: '1px solid var(--border)',
      padding: '3.5rem 1.5rem 2rem',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>

          {/* ── Brand ── */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', marginBottom: '1rem' }}>
              <div className="logo-circle-sm">LF</div>
              <div>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--t1)', display: 'block', lineHeight: 1.2 }}>LexFlow</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.6rem', color: 'var(--t5)', fontWeight: 600 }}>· KI-gestützt</span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--t5)', fontWeight: 600 }}>· DSGVO-konform</span>
                </div>
              </div>
            </Link>
            <p style={{ color: 'var(--t5)', fontSize: '0.875rem', lineHeight: 1.75, maxWidth: 260 }}>
              Die moderne Mandantenverwaltung für Kanzleien – Intake, Beratung und Terminbuchung in einer Plattform.
            </p>
          </div>

          {/* ── Platform ── */}
          <div>
            <h4 style={{ color: 'var(--t2)', fontWeight: 600, marginBottom: '1rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Plattform</h4>
            {[
              { label: 'Für neue Mandanten', to: '/onboarding' },
              { label: 'Mandantenportal', to: '/portal' },
              { label: 'Termin buchen', to: '/booking' },
              { label: 'Anwalt-Dashboard', to: '/dashboard' },
            ].map(item => (
              <Link
                key={item.label} to={item.to}
                style={{ display: 'block', color: 'var(--t5)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '0.5rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#254448')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--t5)')}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* ── Rechtliches ── */}
          <div>
            <h4 style={{ color: 'var(--t2)', fontWeight: 600, marginBottom: '1rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Rechtliches</h4>
            {['Datenschutzerklärung', 'Nutzungsbedingungen', 'Cookie-Richtlinie', 'Impressum'].map(item => (
              <a
                key={item} href="#"
                style={{ display: 'block', color: 'var(--t5)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '0.5rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#254448')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--t5)')}
              >
                {item}
              </a>
            ))}
          </div>

          {/* ── Kontakt ── */}
          <div>
            <h4 style={{ color: 'var(--t2)', fontWeight: 600, marginBottom: '1rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Kontakt</h4>
            {[
              { icon: <Mail size={14} />, text: 'kanzlei@lexflow.de' },
              { icon: <Phone size={14} />, text: '+49 30 12345678' },
              { icon: <MapPin size={14} />, text: 'Berlin, Deutschland' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--t5)', fontSize: '0.9rem', marginBottom: '0.625rem' }}>
                <span style={{ color: '#254448' }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <p style={{ color: 'var(--t6)', fontSize: '0.8125rem' }}>
            © {new Date().getFullYear()} LexFlow. Alle Rechte vorbehalten.
          </p>
          <p style={{ color: 'var(--t6)', fontSize: '0.8125rem' }}>
            Mit ❤ für Rechtsanwälte entwickelt
          </p>
        </div>
      </div>
    </footer>
  )
}
