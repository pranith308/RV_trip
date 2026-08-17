import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import '../theme-journey.css'
import './gate-lab.css'
import { GateLab } from './GateLab'

createRoot(document.getElementById('lab-root')!).render(
  <StrictMode>
    <GateLab />
  </StrictMode>,
)
