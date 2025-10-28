/**
 * Hero Image Template
 *
 * This file defines the visual design for auto-generated blog post hero images.
 * Uses the Flexoki dark color scheme from global.css.
 */

import React from 'react'
import { FaviconTemplate } from './favicon-template.js'

export interface HeroTemplateProps {
  title: string
  description?: string
}

/**
 * Generate the hero image template as a React component
 * Uses Flexoki dark color scheme for brand consistency
 */
export function HeroTemplate({ title, description }: HeroTemplateProps) {
  // Flexoki brand colors (from global.css - dark theme)
  const colors = {
    background: '#100F0F', // black
    foreground: '#F2F0E5', // base-50
    primary: '#AF3029', // brand red
    highlight: '#FC4B44', // highlight red
    mutedForeground: '#878580', // base-500
    border: '#343331', // base-850
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
        fontFamily: 'Fira Sans, system-ui, -apple-system, sans-serif',
        justifyContent: 'space-between',
      }}
    >
      {/* Main content area */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          flex: 1,
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
            color: colors.foreground,
          }}
        >
          {title}
        </div>

        {/* Description (if provided) */}
        {description && (
          <div
            style={{
              fontSize: '32px',
              lineHeight: '1.4',
              color: colors.mutedForeground,
            }}
          >
            {description}
          </div>
        )}
      </div>

      {/* Separator line and footer */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Horizontal separator line */}
        <div
          style={{
            width: '100%',
            height: '1px',
            background: colors.border,
          }}
        />

        {/* Footer with branding */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          {/* Logo and site name */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div style={{ width: '64px', height: '64px', display: 'flex' }}>
              <FaviconTemplate size={64} />
            </div>
            <div
              style={{
                fontSize: '54px',
                fontWeight: 'bold',
                color: colors.foreground,
                letterSpacing: '-0.02em',
              }}
            >
              Off by One
            </div>
          </div>

          {/* Site link */}
          <div
            style={{
              fontSize: '28px',
              color: colors.highlight,
              textDecoration: 'underline',
            }}
          >
            justoffbyone.com
          </div>
        </div>
      </div>
    </div>
  )
}
