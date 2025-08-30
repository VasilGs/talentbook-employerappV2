import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { BASE } from './lib/url'
const basename = BASE.replace(/\/$/, '')

const root = document.getElementById('root')!
createRoot(root).render(<App />)
