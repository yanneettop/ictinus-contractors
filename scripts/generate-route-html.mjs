import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const SITE_URL = 'https://www.ictinuscontractors.co.uk'

const routes = [
  '/',
  '/about',
  '/services',
  '/services/painting-and-decorating',
  '/services/property-refurbishment-extensions',
  '/services/bathroom-fitting',
  '/services/hard-flooring',
  '/services/plastering',
  '/services/finishing-carpentry',
  '/services/electrical-works',
  '/services/plumbing',
  '/portfolio',
  '/contact',
  '/thank-you',
]

const distDir = join(process.cwd(), 'dist')
const sourceIndex = join(distDir, 'index.html')
const sourceHtml = readFileSync(sourceIndex, 'utf8')

function canonicalForRoute(route) {
  return route === '/' ? `${SITE_URL}/` : `${SITE_URL}${route}/`
}

function htmlForRoute(route) {
  let html = sourceHtml.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${canonicalForRoute(route)}" />`,
  )

  if (route === '/thank-you') {
    html = html.replace(
      /<meta\s+name="robots"\s+content="[^"]*"\s*\/>/,
      '<meta name="robots" content="noindex, nofollow" />',
    )
  }

  return html
}

for (const route of routes) {
  if (route === '/') {
    writeFileSync(sourceIndex, htmlForRoute(route))
    continue
  }

  const target = join(distDir, route.slice(1), 'index.html')
  mkdirSync(dirname(target), { recursive: true })
  copyFileSync(sourceIndex, target)
  writeFileSync(target, htmlForRoute(route))
}
