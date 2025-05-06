import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LayoutHeader from './components/LayoutHeader.js'  
import LayoutFooter from './components/LayoutFooter.js'  
import PoemBook from './components/PoemBook.js'          
import NotFound from './components/NotFound.js'          

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode')
    return savedMode ? JSON.parse(savedMode) : false
  })

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="flex flex-col min-h-screen">
      <LayoutHeader darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <Routes>
          <Route path="/" element={<PoemBook />} />
          <Route path="/poem/:id" element={<PoemBook />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <LayoutFooter />
    </div>
  )
}

export default App