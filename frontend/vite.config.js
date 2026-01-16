import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    host: true, // Permite acesso de qualquer host
    port: 5173,
    // Configurar para aceitar subdomínios .localhost
    hmr: {
      host: 'localhost',
    },
  },
})
