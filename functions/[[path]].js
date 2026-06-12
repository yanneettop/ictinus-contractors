const CANONICAL_ORIGIN = 'https://www.ictinuscontractors.co.uk'
const CANONICAL_HOST = 'www.ictinuscontractors.co.uk'
const LOCAL_HOSTS = new Set(['127.0.0.1', 'localhost'])

const REDIRECTS = new Map([
  ['/about/', '/about'],
  ['/services/', '/services'],
  ['/services/painting-and-decorating/', '/services/painting-and-decorating'],
  ['/services/property-refurbishment-extensions/', '/services/property-refurbishment-extensions'],
  ['/services/bathroom-fitting/', '/services/bathroom-fitting'],
  ['/services/hard-flooring/', '/services/hard-flooring'],
  ['/services/plastering/', '/services/plastering'],
  ['/services/finishing-carpentry/', '/services/finishing-carpentry'],
  ['/services/electrical-works/', '/services/electrical-works'],
  ['/services/plumbing/', '/services/plumbing'],
  ['/portfolio/', '/portfolio'],
  ['/contact/', '/contact'],
  ['/thank-you/', '/thank-you'],
  ['/booking', '/contact'],
  ['/booking/', '/contact'],
  ['/request-a-quote', '/contact#quote'],
  ['/request-a-quote/', '/contact#quote'],
  ['/projects', '/portfolio'],
  ['/projects/', '/portfolio'],
  ['/services/property-refurbishment-extensions-london', '/services/property-refurbishment-extensions'],
  ['/services/property-refurbishment-extensions-london/', '/services/property-refurbishment-extensions'],
  ['/services/bathroom-fitting-london', '/services/bathroom-fitting'],
  ['/services/bathroom-fitting-london/', '/services/bathroom-fitting'],
  ['/services/hard-flooring-london', '/services/hard-flooring'],
  ['/services/hard-flooring-london/', '/services/hard-flooring'],
  ['/services/plastering-london', '/services/plastering'],
  ['/services/plastering-london/', '/services/plastering'],
  ['/services/painting-decorating-london', '/services/painting-and-decorating'],
  ['/services/painting-decorating-london/', '/services/painting-and-decorating'],
  ['/services/finishing-carpentry-london', '/services/finishing-carpentry'],
  ['/services/finishing-carpentry-london/', '/services/finishing-carpentry'],
  ['/services/electrical-works-london', '/services/electrical-works'],
  ['/services/electrical-works-london/', '/services/electrical-works'],
  ['/services/plumbing-london', '/services/plumbing'],
  ['/services/plumbing-london/', '/services/plumbing'],
])

const JUNK_PATHS = new Set([
  '/hello-world',
  '/hello-world/',
  '/sample-page',
  '/sample-page/',
  '/category/uncategorized',
  '/category/uncategorized/',
  '/2025/10',
  '/2025/10/',
  '/23660-2',
  '/23660-2/',
  '/23634-2',
  '/23634-2/',
  '/comments/feed',
  '/comments/feed/',
])

function isWordPressJunk(pathname) {
  return (
    JUNK_PATHS.has(pathname) ||
    pathname.startsWith('/wp-content/') ||
    pathname.startsWith('/wp-includes/')
  )
}

function canonicalUrl(url, targetPath) {
  const target = new URL(targetPath, CANONICAL_ORIGIN)
  target.search = url.search

  return target.toString()
}

async function notFound(context) {
  const response = await context.env.ASSETS.fetch(new URL('/404.html', context.request.url))
  const headers = new Headers(response.headers)

  headers.set('x-robots-tag', 'noindex, nofollow')

  return new Response(response.body, {
    status: 404,
    statusText: 'Not Found',
    headers,
  })
}

export async function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)

  if (url.pathname.startsWith('/api/')) {
    return context.next()
  }

  if (!LOCAL_HOSTS.has(url.hostname) && (url.hostname !== CANONICAL_HOST || url.protocol !== 'https:')) {
    return Response.redirect(canonicalUrl(url, url.pathname), 301)
  }

  if (isWordPressJunk(url.pathname)) {
    return notFound(context)
  }

  const redirectTarget = REDIRECTS.get(url.pathname)
  if (redirectTarget) {
    return Response.redirect(canonicalUrl(url, redirectTarget), 301)
  }

  return context.next()
}
