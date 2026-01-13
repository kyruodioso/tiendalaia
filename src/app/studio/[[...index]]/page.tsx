'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'
import { useEffect } from 'react'

export default function StudioPage() {
  useEffect(() => {
    // Suppress specific React warning from Sanity Studio
    const originalError = console.error
    console.error = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('disableTransition')) {
        return
      }
      originalError.apply(console, args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  return <NextStudio config={config} />
}
