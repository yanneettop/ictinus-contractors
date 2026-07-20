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
  '/portfolio/complete-east-london-home-refurbishment',
  '/portfolio/modern-walk-in-bathroom-renovation',
  '/contact',
  '/thank-you',
  '/job-manager',
  '/job-manager/login',
  '/job-manager/update-password',
  '/job-manager/calendar',
  '/job-manager/leads',
  '/job-manager/assistant',
  '/job-manager/projects',
  '/job-manager/files',
  '/job-manager/projects/new',
  '/job-manager/projects/project-sample',
  '/job-manager/projects/project-stratford',
  '/job-manager/projects/project-george',
  '/job-manager/projects/project-emma',
  '/job-manager/projects/project-millie',
  '/job-manager/payments',
  '/job-manager/settings',
]

const routeMeta = {
  '/': {
    title: 'Ictinus Contractors | London Refurbishment & Renovation',
    description:
      'Trusted London contractors for property refurbishment, bathroom fitting, painting and decorating, plastering, hard flooring, electrical works and plumbing.',
  },
  '/about': {
    title: 'About Ictinus Contractors | London Refurbishment & Decorating Team',
    description:
      'Learn about Ictinus Contractors, a trusted London team for refurbishment, decorating, bathrooms, flooring, plastering and finishing works.',
  },
  '/services': {
    title: 'Decorating & Refurbishment Services in London | Ictinus Contractors',
    description:
      'Expert painting & decorating, plastering, bathroom fitting, hard flooring installation and property refurbishment across London. 9.97/10 Checkatrade. Fully insured. Free quotes.',
  },
  '/services/painting-and-decorating': {
    title: 'Painting & Decorating London | Ictinus Contractors',
    description:
      'Painting and decorating in London by Ictinus Contractors. Interior painting, walls, ceilings, woodwork, preparation and tidy finishing. Free quotes.',
  },
  '/services/property-refurbishment-extensions': {
    title: 'Property Refurbishment London | Ictinus Contractors',
    description:
      'Property refurbishment in London by Ictinus Contractors. Full refurbishments, room renovations, decorating, plastering, flooring and bathroom fitting. Free quotes.',
  },
  '/services/bathroom-fitting': {
    title: 'Bathroom Fitting London | Ictinus Contractors',
    description:
      'Bathroom fitting and bathroom improvement services across London for homeowners, landlords and businesses. Clean workmanship, careful preparation and reliable finishing.',
  },
  '/services/hard-flooring': {
    title: 'Hard Flooring London | Ictinus Contractors',
    description:
      'Hard flooring installation and preparation services across London for homes, flats, rental properties and commercial spaces. Clean workmanship and reliable finishing.',
  },
  '/services/plastering': {
    title: 'Plastering London | Ictinus Contractors',
    description:
      'Plastering and surface preparation services across London for homes, flats, rental properties and refurbishment projects. Smooth finishes, clean work and reliable communication.',
  },
  '/services/finishing-carpentry': {
    title: 'Finishing Carpentry London | Ictinus Contractors',
    description:
      'Finishing carpentry services across London for homes, flats, rental properties and refurbishment projects. Skirting, architraves, doors and clean finishing details.',
  },
  '/services/electrical-works': {
    title: 'Electrical Works London | Ictinus Contractors',
    description:
      'Electrical works coordination and support for London refurbishments, bathrooms and property improvements. Reliable finishing, planning and trade coordination.',
  },
  '/services/plumbing': {
    title: 'Plumbing Support London | Ictinus Contractors',
    description:
      'Plumbing support for London bathroom works, refurbishments and property improvements. Clean coordination, reliable finishing and clear communication.',
  },
  '/portfolio': {
    title: 'Project Portfolio | Ictinus Contractors London',
    description:
      'View recent refurbishment, decorating, bathroom, flooring and plastering projects completed by Ictinus Contractors across London.',
  },
  '/portfolio/complete-east-london-home-refurbishment': {
    title: 'East London Home Refurbishment, Decorating & Finishing | Ictinus Contractors',
    description:
      'See an East London home refurbishment by Ictinus Contractors, including interior decorating, flooring details, bathroom finishing and careful preparation across the property.',
  },
  '/portfolio/modern-walk-in-bathroom-renovation': {
    title: 'Modern Walk-In Bathroom Renovation East London | Ictinus Contractors',
    description:
      'A modern East London bathroom renovation case study with walk-in shower, fitted vanity storage, waterproofing, tiling, lighting and final finishing.',
  },
  '/contact': {
    title: 'Request a Quote | Ictinus Contractors London',
    description:
      'Request a free quote from Ictinus Contractors for refurbishment, bathroom fitting, painting, decorating, plastering, flooring and finishing works across London.',
  },
  '/thank-you': {
    title: 'Thank You | Ictinus Contractors',
    description:
      'Thank you for contacting Ictinus Contractors. We will review your enquiry and get back to you as soon as possible.',
  },
  '/job-manager': {
    title: 'Ictinus Job Manager | Private Operations Workspace',
    description: 'Private project operations workspace for Ictinus Contractors.',
  },
}

const distDir = join(process.cwd(), 'dist')
const sourceIndex = join(distDir, 'index.html')
const sourceHtml = readFileSync(sourceIndex, 'utf8')

function canonicalForRoute(route) {
  return route === '/' ? `${SITE_URL}/` : `${SITE_URL}${route}`
}

function htmlForRoute(route) {
  const routeUrl = canonicalForRoute(route)
  const meta = routeMeta[route] || (route.startsWith('/job-manager') ? routeMeta['/job-manager'] : routeMeta['/'])

  let html = sourceHtml.replace(
    /<title>.*?<\/title>/,
    `<title>${meta.title}</title>`,
  )

  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${meta.description}" />`,
  )

  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${routeUrl}" />`,
  )

  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${meta.title}" />`,
  )

  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${meta.description}" />`,
  )

  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${routeUrl}" />`,
  )

  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${meta.title}" />`,
  )

  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${meta.description}" />`,
  )

  html = html.replace(
    /<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:url" content="${routeUrl}" />`,
  )

  if (route === '/thank-you') {
    html = html.replace(
      /<meta\s+name="robots"\s+content="[^"]*"\s*\/>/,
      '<meta name="robots" content="noindex, nofollow" />',
    )
  }

  if (route.startsWith('/job-manager')) {
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

  const html = htmlForRoute(route)
  const directoryTarget = join(distDir, route.slice(1), 'index.html')
  const fileTarget = join(distDir, `${route.slice(1)}.html`)

  mkdirSync(dirname(directoryTarget), { recursive: true })
  mkdirSync(dirname(fileTarget), { recursive: true })
  copyFileSync(sourceIndex, directoryTarget)
  writeFileSync(directoryTarget, html)
  writeFileSync(fileTarget, html)
}

// GitHub Pages does not support SPA rewrites. Its custom 404 document keeps the
// requested URL in the browser, allowing React Router to resolve dynamic manager
// routes after the application shell loads.
writeFileSync(join(distDir, '404.html'), htmlForRoute('/job-manager'))
