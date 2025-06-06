// Create src/components/DebugEnv.tsx
import React from 'react'

const DebugEnv: React.FC = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      right: 0, 
      background: 'red', 
      color: 'white', 
      padding: '10px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>Debug Info:</h4>
      <p>Mode: {import.meta.env.MODE}</p>
      <p>URL: {supabaseUrl ? '✅ Set' : '❌ Missing'}</p>
      <p>Key: {supabaseKey ? '✅ Set' : '❌ Missing'}</p>
      <p>URL Value: {supabaseUrl?.substring(0, 20)}...</p>
    </div>
  )
}

export default DebugEnv
