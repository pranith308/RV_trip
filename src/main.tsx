import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './theme-journey.css'
import { applyStoredTheme, DevThemeSwitch } from './dev/ThemeSwitch'

if (import.meta.env.DEV) applyStoredTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {import.meta.env.DEV && <DevThemeSwitch />}
  </StrictMode>,
)
