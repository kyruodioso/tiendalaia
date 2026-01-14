'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schemas'
import { projectId, dataset } from './src/sanity/client'
import Dashboard from './src/sanity/components/Dashboard'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool(),
  ],
  tools: (prev) => {
    return [
      ...prev,
      {
        name: 'dashboard',
        title: 'Dashboard',
        component: Dashboard,
      },
    ]
  },
})
