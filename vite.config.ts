import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { mapsDevPlugin } from './server/mapsPlugin.ts'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), mapsDevPlugin(env.GOOGLE_MAPS_API_KEY)],
    server: {
      host: true,
      port: 5173,
    },
  }
})
