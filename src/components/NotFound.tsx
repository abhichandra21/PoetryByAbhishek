import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Bookmark Lost</h1>
      <p className="mb-6">The page you're looking for isn't in our poetry book.</p>
      <Link 
        to="/" 
        className="inline-block px-4 py-2 bg-accent-light dark:bg-accent-dark text-paper-light dark:text-paper-dark rounded"
      >
        Return to First Page
      </Link>
    </div>
  )
}

export default NotFound