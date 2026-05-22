import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App.jsx'

export function renderRoute(route) {
  return renderToString(
    <StaticRouter location={route}>
      <App />
    </StaticRouter>,
  )
}
