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

// Fade out the boot loader once React has painted the first frame.
// rAF never fires in hidden tabs, so a timer backstop guarantees removal.
let loaderHidden = false
function hideAppLoader() {
  if (loaderHidden) return
  loaderHidden = true
  const loader = document.getElementById('app-loader')
  if (!loader) return
  loader.classList.add('app-loader--hide')
  setTimeout(() => loader.remove(), 450)
}
requestAnimationFrame(() => requestAnimationFrame(hideAppLoader))
setTimeout(hideAppLoader, 800)
