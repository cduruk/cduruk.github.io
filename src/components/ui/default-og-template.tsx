/**
 * Default OG Image Template
 *
 * This file defines the visual design for the default OG image used as a fallback.
 * Uses the Flexoki dark color scheme for brand consistency.
 */

import React from 'react'

export interface DefaultOGTemplateProps {
  title?: string
  subtitle?: string
}

/**
 * Generate the default OG image template as a React component
 * Simple, clean design featuring the site branding
 */
export function DefaultOGTemplate({
  title = 'Off by One',
  subtitle = 'by Can Duruk'
}: DefaultOGTemplateProps) {
  // Flexoki brand colors (from global.css - dark theme)
  const colors = {
    background: '#100F0F', // black
    foreground: '#F2F0E5', // base-50
    primary: '#AF3029', // red
    mutedForeground: '#878580', // base-500
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: '80px',
        background: colors.background,
        color: colors.foreground,
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '48px',
      }}
    >
      {/* Large -1 logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '200px',
          height: '200px',
          background: colors.primary,
          borderRadius: '40px',
        }}
      >
        <div
          style={{
            fontSize: '140px',
            fontWeight: 'bold',
            color: '#FFFCF0',
            lineHeight: '1',
          }}
        >
          -1
        </div>
      </div>

      {/* Title and subtitle */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: colors.foreground,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: '36px',
            color: colors.mutedForeground,
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  )
}
