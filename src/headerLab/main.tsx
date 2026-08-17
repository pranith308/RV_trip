import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import './header-lab.css'
import { HeaderLab } from './HeaderLab'

createRoot(document.getElementById('lab-root')!).render(
  <StrictMode>
    <HeaderLab />
  </StrictMode>,
)
