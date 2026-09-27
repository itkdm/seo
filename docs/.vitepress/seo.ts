import type { HeadConfig, PageData, SiteData } from 'vitepress'

const DEFAULT_SOCIAL_IMAGE = '/social/default-share-v2.jpg'
const DEFAULT_SOCIAL_IMAGE_ALT = '插画：独立开发者研究需求，并围绕产品和增长开展实践'

type SeoOptions = {
  pageData: PageData
  siteData: SiteData
  title: string
  description: string
  siteUrl?: string
}

function normalizeSiteOrigin(siteUrl?: string) {
  if (!siteUrl) return undefined

  try {
    return new URL(siteUrl).origin
  } catch {
    return undefined
  }
}

function pagePath(relativePath: string) {
  const normalized = relativePath.replace(/\\/g, '/')

  if (normalized === 'index.md') return '/'
  if (normalized.endsWith('/index.md')) {
    return `/${normalized.slice(0, -'index.md'.length)}`
  }

  return `/${normalized.replace(/\.md$/, '')}`
}

function withBase(base: string, path: string) {
  const basePath = `/${base.split('/').filter(Boolean).join('/')}`.replace(/^\/$/, '')
  const page = path.startsWith('/') ? path : `/${path}`
  return `${basePath}${page}` || '/'
}

function absoluteUrl(origin: string, base: string, path: string) {
  if (/^https?:\/\//i.test(path)) return new URL(path).toString()
  return new URL(withBase(base, path), origin).toString()
}

function isoDate(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString()
  if (typeof value !== 'string' && typeof value !== 'number') return undefined

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

function pageKind(relativePath: string) {
  if (relativePath === 'index.md') return 'website'
  if (relativePath.endsWith('/index.md')) return 'section'
  return 'article'
}

export function createSeoHead({ pageData, siteData, title, description, siteUrl }: SeoOptions): HeadConfig[] {
  const frontmatter = pageData.frontmatter
  const origin = normalizeSiteOrigin(siteUrl)
  const kind = pageKind(pageData.relativePath)
  const head: HeadConfig[] = [
    ['meta', { property: 'og:type', content: kind === 'article' ? 'article' : 'website' }],
    ['meta', { property: 'og:site_name', content: siteData.title }],
    ['meta', { property: 'og:locale', content: siteData.lang.replace('-', '_') }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description || siteData.description }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description || siteData.description }]
  ]

  if (frontmatter.noindex === true) {
    head.push(['meta', { name: 'robots', content: 'noindex, follow' }])
  }

  if (frontmatter.author && typeof frontmatter.author === 'string') {
    head.push(['meta', { name: 'author', content: frontmatter.author }])
  }

  if (!origin) return head

  const canonicalUrl = absoluteUrl(origin, siteData.base, pagePath(pageData.relativePath))
  const pageSpecificImage = typeof frontmatter.ogImage === 'string'
    ? frontmatter.ogImage
    : undefined
  const socialImagePath = pageSpecificImage || DEFAULT_SOCIAL_IMAGE
  const socialImageUrl = absoluteUrl(origin, siteData.base, socialImagePath)
  const socialImageAlt = typeof frontmatter.ogImageAlt === 'string'
    ? frontmatter.ogImageAlt
    : pageSpecificImage ? title : DEFAULT_SOCIAL_IMAGE_ALT

  head.push(
    ['link', { rel: 'canonical', href: canonicalUrl }],
    ['meta', { property: 'og:url', content: canonicalUrl }],
    ['meta', { property: 'og:image', content: socialImageUrl }],
    ['meta', { property: 'og:image:alt', content: socialImageAlt }],
    ['meta', { name: 'twitter:image', content: socialImageUrl }],
    ['meta', { name: 'twitter:image:alt', content: socialImageAlt }]
  )

  if (kind === 'website') {
    head.push([
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteData.title,
        url: canonicalUrl,
        description: description || siteData.description,
        inLanguage: siteData.lang
      })
    ])
    return head
  }

  const publishedDate = isoDate(frontmatter.date)
  const modifiedDate = isoDate(frontmatter.lastUpdated) ??
    (pageData.lastUpdated ? new Date(pageData.lastUpdated).toISOString() : undefined)

  if (kind === 'article') {
    if (publishedDate) head.push(['meta', { property: 'article:published_time', content: publishedDate }])
    if (modifiedDate) head.push(['meta', { property: 'article:modified_time', content: modifiedDate }])
  }

  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': kind === 'article' ? 'Article' : 'CollectionPage',
    headline: title,
    name: title,
    description: description || siteData.description,
    url: canonicalUrl,
    inLanguage: siteData.lang,
    isPartOf: { '@type': 'WebSite', name: siteData.title, url: origin }
  }

  if (kind !== 'article' || pageSpecificImage) {
    structuredData.image = socialImageUrl
  }

  if (publishedDate) structuredData.datePublished = publishedDate
  if (modifiedDate) structuredData.dateModified = modifiedDate
  if (typeof frontmatter.author === 'string' && frontmatter.author.trim()) {
    structuredData.author = { '@type': 'Person', name: frontmatter.author.trim() }
  }

  head.push(['script', { type: 'application/ld+json' }, JSON.stringify(structuredData)])

  return head
}
