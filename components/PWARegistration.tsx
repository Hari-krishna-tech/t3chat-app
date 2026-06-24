'use client'

import { useEffect } from 'react'

export default function PWARegistration() {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator)
    ) {
      return
    }

    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        reg.addEventListener('updatefound', () => {
          const installing = reg.installing
          if (installing) {
            installing.addEventListener('statechange', () => {
              if (
                installing.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                console.log('T3 Chat update available — refresh to apply')
              }
            })
          }
        })
      })
      .catch(() => {
        /* sw registration failed — app works without it */
      })
  }, [])

  return null
}
