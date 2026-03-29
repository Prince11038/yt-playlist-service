import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Navbar from './components/Navbar.jsx'
import URLinput from './components/URLinput.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navbar />
    <URLinput />
  </StrictMode>,
)
