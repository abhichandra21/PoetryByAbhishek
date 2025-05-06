const LayoutFooter = () => {
    const currentYear = new Date().getFullYear()
    
    return (
      <footer className="p-4 border-t border-ink-light/10 dark:border-ink-dark/10 text-center text-sm">
        <div className="max-w-4xl mx-auto">
          <p>© {currentYear} Abhishek Chandra</p>
        </div>
      </footer>
    )
  }
  
  export default LayoutFooter