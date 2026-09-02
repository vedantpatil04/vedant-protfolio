import { useEffect } from 'react'
import { profile } from '@/data/profile'

const DEFAULT_DESCRIPTION = profile.tagline
  ? `${profile.name} — ${profile.title}. ${profile.tagline}`
  : `${profile.name} — ${profile.title}.`

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

/**
 * Sets document.title plus meta description, canonical link and Open
 * Graph/Twitter tags for the lifetime of the page. Every route gets a
 * consistent SEO baseline from profile data without repeating copy;
 * pass `description` to override it for a specific page.
 */
export function usePageTitle(title?: string, description?: string) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${profile.name}` : `${profile.name} — ${profile.title}`
    document.title = fullTitle

    const desc = description ?? DEFAULT_DESCRIPTION
    setMetaTag('name', 'description', desc)
    setMetaTag('property', 'og:title', fullTitle)
    setMetaTag('property', 'og:description', desc)
    setMetaTag('property', 'og:type', 'website')
    setMetaTag('property', 'og:site_name', profile.name)
    setMetaTag('name', 'twitter:card', 'summary')
    setMetaTag('name', 'twitter:title', fullTitle)
    setMetaTag('name', 'twitter:description', desc)

    if (typeof window !== 'undefined') {
      const canonicalUrl = `${window.location.origin}${window.location.pathname}`
      setCanonical(canonicalUrl)
      setMetaTag('property', 'og:url', canonicalUrl)
    }
  }, [title, description])
}
