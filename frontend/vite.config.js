import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = parseInt(env.VITE_PORT) || 5175
  const appEnv = loadEnv(mode, path.resolve(__dirname, '../backend'), '')
  const appPort = appEnv.BACKEND_PORT || '5000'
  const backendPort = appPort

  return {
    plugins: [react()],
    server: {
      port: port,
      proxy: {
        '/auth': {
          target: `http://localhost:${backendPort}`,
          changeOrigin: true,
        },
        '/organization': {
          target: `http://localhost:${backendPort}`,
          changeOrigin: true,
        },
        '/license': {
          target: `http://localhost:${backendPort}`,
          changeOrigin: true,
        },
        '/stats': {
          target: `http://localhost:${backendPort}`,
          changeOrigin: true,
        },
      },
    },
  }
})
