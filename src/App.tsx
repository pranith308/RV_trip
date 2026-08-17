import { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from './auth/AuthContext'
import { PinGate } from './auth/PinGate'
import { bootTrip } from './data/store'
import { AppShell } from './shell/AppShell'

function Gate() {
  const { current, ready, error } = useAuth()
  if (!ready) {
    return (
      <div className="gate">
        <div className="poster-frame gate-poster">
          <p className="poster-kicker">Department of Family Adventure</p>
          <h1 className="poster-title">The Family Expedition</h1>
          <p className="gate-lead">Opening camp…</p>
        </div>
      </div>
    )
  }
  if (error && !current) {
    return (
      <div className="gate">
        <div className="poster-frame gate-poster">
          <p className="poster-kicker">Department of Family Adventure</p>
          <h1 className="poster-title">The Family Expedition</h1>
          <p className="gate-error">{error}</p>
        </div>
      </div>
    )
  }
  return current ? <AppShell /> : <PinGate />
}

export default function App() {
  const [tripReady, setTripReady] = useState(false)

  useEffect(() => {
    void bootTrip().finally(() => setTripReady(true))
  }, [])

  if (!tripReady) {
    return (
      <div className="gate">
        <div className="poster-frame gate-poster">
          <p className="poster-kicker">Department of Family Adventure</p>
          <h1 className="poster-title">The Family Expedition</h1>
          <p className="gate-lead">Opening camp…</p>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  )
}
