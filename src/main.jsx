import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

// Fade out the boot loader after the intro animation has had time to play
// (build 1.1s + wordmark), but never before React is ready underneath.
const LOADER_MIN_VISIBLE_MS = 1600
let loaderHidden = false
function hideAppLoader() {
  if (loaderHidden) return
  loaderHidden = true
  const loader = document.getElementById('app-loader')
  if (!loader) return
  loader.classList.add('app-loader--hide')
  setTimeout(() => loader.remove(), 450)
}
if (document.getElementById('app-loader')) {
  const shownAt = window.__ictLoaderStart || Date.now()
  const remaining = Math.max(0, LOADER_MIN_VISIBLE_MS - (Date.now() - shownAt))
  setTimeout(hideAppLoader, remaining)
}
