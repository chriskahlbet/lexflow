import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronRight, Sun, Moon } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

const navLinks = [
  { label: 'Funktionen', href: '/#features' },
  { label: 'So funktioniert es', href: '/#how-it-works' },
  { label: 'Für Anwälte', href: '/dashboard' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const location = useLocation()
  const isDashboard = location.pathname === '/dashboard'
  const isDark = theme === 'dark'

  return (
    <header
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        background: 'var(--bg-header)',
        backdropFilter: 'blur(22px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

          {/* ── Logo ── */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
            <div className="logo-circle">LF</div>
            <div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.03em', display: 'block', lineHeight: 1.2 }}>
                LexFlow
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1px' }}>
                <span style={{ fontSize: '0.625rem', color: 'var(--t5)', fontWeight: 600, letterSpacing: '0.03em' }}>· KI-gestützt</span>
                <span style={{ fontSize: '0.625rem', color: 'var(--t5)', fontWeight: 600, letterSpacing: '0.03em' }}>· DSGVO-konform</span>
              </div>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden-mobile">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  padding: '0.5rem 0.875rem',
                  color: link.href === '/dashboard' ? '#ffffff' : 'var(--t2)',
                  textDecoration: 'none',
                  fontSize: '0.9375rem',
                  fontWeight: link.href === '/dashboard' ? 600 : 500,
                  borderRadius: '0.5rem',
                  transition: 'all 0.2s',
                  background: link.href === '/dashboard' ? '#254448' : 'transparent',
                  border: 'none',
                }}
                onMouseEnter={e => {
                  if (link.href !== '/dashboard') e.currentTarget.style.color = 'var(--t1)'
                  else {
                    const dark = document.documentElement.getAttribute('data-theme') === 'dark'
                    e.currentTarget.style.background = dark ? '#F5A95A' : '#2E6569'
                  }
                }}
                onMouseLeave={e => {
                  if (link.href !== '/dashboard') e.currentTarget.style.color = 'var(--t2)'
                  else {
                    const dark = document.documentElement.getAttribute('data-theme') === 'dark'
                    e.currentTarget.style.background = dark ? '#F0923C' : '#254448'
                  }
                }}
                className={link.href === '/dashboard' ? 'nav-cta-pill' : ''}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* ── CTA Buttons + Theme Toggle ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="hidden-mobile">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              title={isDark ? 'Zu Hellmodus wechseln' : 'Zu Dunkelmodus wechseln'}
              style={{
                background: 'var(--bg-card-sub)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                cursor: 'pointer',
                color: 'var(--t4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--t1)'; e.currentTarget.style.borderColor = 'rgba(110,60,220,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--t4)'; e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {isDashboard ? (
              <Link to="/" className="btn-ghost">Zurück zur Startseite</Link>
            ) : (
              <>
                <Link to="/portal" className="btn-ghost">Mandanten-Login</Link>
                <Link to="/onboarding" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}>
                  Jetzt starten <ChevronRight size={15} />
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile toggle ── */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} className="show-mobile">
            <button
              onClick={toggle}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t4)', padding: '0.25rem', display: 'flex' }}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t4)', padding: '0.25rem' }}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div style={{
          background: 'var(--bg-2)',
          borderTop: '1px solid var(--border)',
          padding: '1rem 1.5rem 1.5rem',
        }}>
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block', padding: '0.75rem 0',
                color: 'var(--t3)', textDecoration: 'none',
                fontSize: '1rem', borderBottom: '1px solid var(--border)',
              }}
            >
              {link.label}
            </a>
          ))}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <Link to="/portal" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>
              Mandanten-Login
            </Link>
            <Link to="/onboarding" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>
              Jetzt starten
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
        [data-theme="dark"] .nav-cta-pill {
          background: #F0923C !important;
          color: #1a1008 !important;
        }
      `}</style>
    </header>
  )
}
