import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

const routes = [
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
  '/request-a-quote',
  '/projects',
  '/services/property-refurbishment-extensions-london',
  '/services/bathroom-fitting-london',
  '/services/hard-flooring-london',
  '/services/plastering-london',
  '/services/painting-decorating-london',
  '/services/finishing-carpentry-london',
  '/services/electrical-works-london',
  '/services/plumbing-london',
]

const distDir = join(process.cwd(), 'dist')
const sourceIndex = join(distDir, 'index.html')

for (const route of routes) {
  const target = join(distDir, route.slice(1), 'index.html')
  mkdirSync(dirname(target), { recursive: true })
  copyFileSync(sourceIndex, target)
}
