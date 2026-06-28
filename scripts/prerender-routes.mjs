import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { createServer } from 'vite'

const reactRouterEsm = join(process.cwd(), 'node_modules/react-router/dist/development/index.mjs')

const routes = [
  { route: '/', file: 'index.html' },
  { route: '/about', file: 'about/index.html', altFile: 'about.html' },
  { route: '/services', file: 'services/index.html', altFile: 'services.html' },
  { route: '/services/painting-and-decorating', file: 'services/painting-and-decorating/index.html', altFile: 'services/painting-and-decorating.html' },
  { route: '/services/property-refurbishment-extensions', file: 'services/property-refurbishment-extensions/index.html', altFile: 'services/property-refurbishment-extensions.html' },
  { route: '/services/bathroom-fitting', file: 'services/bathroom-fitting/index.html', altFile: 'services/bathroom-fitting.html' },
  { route: '/services/hard-flooring', file: 'services/hard-flooring/index.html', altFile: 'services/hard-flooring.html' },
  { route: '/services/plastering', file: 'services/plastering/index.html', altFile: 'services/plastering.html' },
  { route: '/services/finishing-carpentry', file: 'services/finishing-carpentry/index.html', altFile: 'services/finishing-carpentry.html' },
  { route: '/services/electrical-works', file: 'services/electrical-works/index.html', altFile: 'services/electrical-works.html' },
  { route: '/services/plumbing', file: 'services/plumbing/index.html', altFile: 'services/plumbing.html' },
  { route: '/portfolio', file: 'portfolio/index.html', altFile: 'portfolio.html' },
  {
    route: '/portfolio/complete-east-london-home-refurbishment',
    file: 'portfolio/complete-east-london-home-refurbishment/index.html',
    altFile: 'portfolio/complete-east-london-home-refurbishment.html',
  },
  { route: '/contact', file: 'contact/index.html', altFile: 'contact.html' },
]

const distDir = join(process.cwd(), 'dist')

function injectRootHtml(html, appHtml) {
  const emptyRoot = '<div id="root"></div>'
  if (!html.includes(emptyRoot)) {
    throw new Error('Could not find empty #root shell in route HTML')
  }

  return html.replace(emptyRoot, `<div id="root">${appHtml}</div>`)
}

function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = join(dir, entry.name)

    if (entry.isDirectory()) {
      return listFiles(target)
    }

    return entry.isFile() ? [target] : []
  })
}

function assertNoPrecompressedHtml() {
  const compressedHtml = listFiles(distDir).filter(
    (file) => file.endsWith('.html.gz') || file.endsWith('.html.br'),
  )

  if (compressedHtml.length > 0) {
    throw new Error(
      `Precompressed HTML files are not allowed for Cloudflare Pages preview:\n${compressedHtml
        .map((file) => `- ${relative(distDir, file)}`)
        .join('\n')}`,
    )
  }
}

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  resolve: {
    alias: {
      'react-router-dom': reactRouterEsm,
      'react-router': reactRouterEsm,
    },
  },
})

try {
  const { renderRoute } = await vite.ssrLoadModule('/src/entry-prerender.jsx')

  for (const { route, file, altFile } of routes) {
    const target = join(distDir, file)
    const html = readFileSync(target, 'utf8')
    const appHtml = renderRoute(route)
    const prerenderedHtml = injectRootHtml(html, appHtml)

    writeFileSync(target, prerenderedHtml)
    if (altFile) {
      writeFileSync(join(distDir, altFile), prerenderedHtml)
    }
    console.log(`Prerendered ${route} -> dist/${file}`)
  }
} finally {
  await vite.close()
}

assertNoPrecompressedHtml()
