import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['react-toolbox'],
    include: ['react-toolbox/lib/button', 'react-toolbox/lib/input', 'react-toolbox/lib/autocomplete' ]
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    }

  }
});