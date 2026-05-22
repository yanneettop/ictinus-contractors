import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createServer } from 'vite'

const reactRouterEsm = join(process.cwd(), 'node_modules/react-router/dist/development/index.mjs')

const routes = [
  { route: '/', file: 'index.html' },
  { route: '/about/', file: 'about/index.html' },
  { route: '/services/', file: 'services/index.html' },
  { route: '/services/painting-and-decorating/', file: 'services/painting-and-decorating/index.html' },
  { route: '/services/property-refurbishment-extensions/', file: 'services/property-refurbishment-extensions/index.html' },
  { route: '/services/bathroom-fitting/', file: 'services/bathroom-fitting/index.html' },
  { route: '/services/hard-flooring/', file: 'services/hard-flooring/index.html' },
  { route: '/services/plastering/', file: 'services/plastering/index.html' },
  { route: '/services/finishing-carpentry/', file: 'services/finishing-carpentry/index.html' },
  { route: '/services/electrical-works/', file: 'services/electrical-works/index.html' },
  { route: '/services/plumbing/', file: 'services/plumbing/index.html' },
  { route: '/portfolio/', file: 'portfolio/index.html' },
  { route: '/contact/', file: 'contact/index.html' },
]

const distDir = join(process.cwd(), 'dist')

function injectRootHtml(html, appHtml) {
  const emptyRoot = '<div id="root"></div>'
  if (!html.includes(emptyRoot)) {
    throw new Error('Could not find empty #root shell in route HTML')
  }

  return html.replace(emptyRoot, `<div id="root">${appHtml}</div>`)
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

  for (const { route, file } of routes) {
    const target = join(distDir, file)
    const html = readFileSync(target, 'utf8')
    const appHtml = renderRoute(route)
    writeFileSync(target, injectRootHtml(html, appHtml))
    console.log(`Prerendered ${route} -> dist/${file}`)
  }
} finally {
  await vite.close()
}
