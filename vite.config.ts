import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { mapsDevPlugin } from './server/mapsPlugin.ts'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const mapsApiKey = env.GOOGLE_MAPS_API_KEY ?? process.env.GOOGLE_MAPS_API_KEY
  return {
    plugins: [react(), mapsDevPlugin(mapsApiKey)],
    server: {
      host: true,
      port: 5173,
    },
  }
})
