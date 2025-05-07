// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { ScriptPreferenceProvider } from './components/ScriptPreference.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScriptPreferenceProvider>
        <App />
      </ScriptPreferenceProvider>
    </BrowserRouter>
  </React.StrictMode>,
)