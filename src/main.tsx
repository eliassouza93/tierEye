import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Inicio from './pages'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Inicio />
  </StrictMode>,
)
