"use client"

import { useEffect } from 'react'

export default function GTMDebug() {
  useEffect(() => {
    // Debug GTM loading
    const checkGTM = () => {
      console.log('=== GTM Debug Info ===')
      console.log('GTM Container ID:', process.env.NEXT_PUBLIC_GTM_CONTAINER_ID)
      console.log('DataLayer exists:', typeof window !== 'undefined' && !!window.dataLayer)
      console.log('DataLayer contents:', typeof window !== 'undefined' ? window.dataLayer : 'N/A')
      
      // Check if GTM script is loaded
      const gtmScripts = document.querySelectorAll('script[src*="googletagmanager.com"]')
      console.log('GTM scripts found:', gtmScripts.length)
      
      if (gtmScripts.length > 0) {
        gtmScripts.forEach((script, index) => {
          const scriptElement = script as HTMLScriptElement
          console.log(`GTM Script ${index + 1}:`, scriptElement.src)
        })
      }
      
      // Test dataLayer push
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'gtm_debug_test',
          debug_timestamp: new Date().toISOString()
        })
        console.log('Test event pushed to dataLayer')
      }
    }

    // Check immediately and after a delay
    checkGTM()
    const timer = setTimeout(checkGTM, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  return null // This component doesn't render anything
} 