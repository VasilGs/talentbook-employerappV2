import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { BASE } from './lib/url'

const root = document.getElementById('root')!
const basename = BASE.replace(/\/$/, '')

createRoot(root).render(
  <BrowserRouter basename={basename}>
    <App />
  </BrowserRouter>
