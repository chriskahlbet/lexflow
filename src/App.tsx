import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'
import Home from './pages/Home'
import Onboarding from './pages/Onboarding'
import Portal from './pages/Portal'
import Dashboard from './pages/Dashboard'
import Booking from './pages/Booking'
import IntakeAI from './pages/IntakeAI'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/intake" element={<IntakeAI />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
