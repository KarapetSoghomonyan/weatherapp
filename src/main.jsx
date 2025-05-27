
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


const stored = localStorage.getItem('theme')
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const theme = stored || (systemPrefersDark ? 'dark' : 'light')
document.documentElement.classList.add(theme)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)