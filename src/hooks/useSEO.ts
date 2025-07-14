import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  canonicalUrl?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  structuredData?: Record<string, unknown> | null
}

export const useSEO = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  structuredData
}: SEOProps) => {
  const location = useLocation()
  const baseUrl = 'https://poetrybyabhishek.netlify.app'
  
  useEffect(() => {
    // Update page title
    if (title) {
      document.title = `${title} | Poetry by Abhishek`
    } else {
      document.title = 'Poetry by Abhishek - Hindi Poetry Collection'
    }

    // Helper function to update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name'
      let element = document.querySelector(`meta[${attribute}="${name}"]`)
      
      if (element) {
        element.setAttribute('content', content)
      } else {
        element = document.createElement('meta')
        element.setAttribute(attribute, name)
        element.setAttribute('content', content)
        document.head.appendChild(element)
      }
    }

    // Update description
    if (description) {
      updateMetaTag('description', description)
      updateMetaTag('og:description', description, true)
    }

    // Update keywords
    if (keywords) {
      updateMetaTag('keywords', keywords)
    }

    // Update Open Graph tags
    updateMetaTag('og:title', ogTitle || title || 'Poetry by Abhishek', true)
    updateMetaTag('og:type', ogType, true)
    updateMetaTag('og:url', canonicalUrl || `${baseUrl}${location.pathname}`, true)
    updateMetaTag('og:site_name', 'Poetry by Abhishek', true)
    updateMetaTag('og:locale', 'hi_IN', true)

    if (ogImage) {
      updateMetaTag('og:image', ogImage, true)
      updateMetaTag('og:image:alt', ogTitle || title || 'Poetry by Abhishek', true)
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', ogTitle || title || 'Poetry by Abhishek')
    updateMetaTag('twitter:description', ogDescription || description || 'Hindi Poetry Collection by Abhishek Chandra')
    if (ogImage) {
      updateMetaTag('twitter:image', ogImage)
    }

    // Update canonical URL
    let canonicalElement = document.querySelector('link[rel="canonical"]')
    const canonical = canonicalUrl || `${baseUrl}${location.pathname}`
    
    if (canonicalElement) {
      canonicalElement.setAttribute('href', canonical)
    } else {
      canonicalElement = document.createElement('link')
      canonicalElement.setAttribute('rel', 'canonical')
      canonicalElement.setAttribute('href', canonical)
      document.head.appendChild(canonicalElement)
    }

    // Add structured data
    if (structuredData) {
      let scriptElement = document.querySelector('script[type="application/ld+json"]')
      
      if (scriptElement) {
        scriptElement.textContent = JSON.stringify(structuredData)
      } else {
        const newScriptElement = document.createElement('script')
        newScriptElement.type = 'application/ld+json'
        newScriptElement.textContent = JSON.stringify(structuredData)
        document.head.appendChild(newScriptElement)
      }
    }

    // Add language meta tags
    updateMetaTag('language', 'Hindi')
    updateMetaTag('content-language', 'hi')

    // Add author meta tag
    updateMetaTag('author', 'Abhishek Chandra')

  }, [title, description, keywords, canonicalUrl, ogTitle, ogDescription, ogImage, ogType, structuredData, location.pathname])
}