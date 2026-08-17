import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import './park-lab.css'
import { ThemeLab } from './ThemeLab'

createRoot(document.getElementById('lab-root')!).render(
  <StrictMode>
    <ThemeLab />
  </StrictMode>,
)
