import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource-variable/nunito'
import '@fontsource-variable/fredoka'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'

// Offline support. Only on the real website: a native app wrapper bundles its own files, and
// the dev server must never serve old copies.
if ('serviceWorker' in navigator && import.meta.env.PROD && location.protocol.startsWith('http') && !window.Capacitor) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // offline support is a bonus: the app works the same without it
    })
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </AuthProvider>
  </StrictMode>,
)
