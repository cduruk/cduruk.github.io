/**
 * Favicon Template
 *
 * This file defines the visual design for the favicon.
 * Displays "-1" in a red box using the Flexoki color scheme.
 */

import React from 'react'

export interface FaviconTemplateProps {
  size?: number
}

/**
 * Generate the favicon as a React component
 * Simple design with "-1" centered in a red rounded box
 */
export function FaviconTemplate({ size = 100 }: FaviconTemplateProps) {
  // Flexoki brand colors (from global.css - dark theme)
  const colors = {
    red: '#F89C91', // red accent
    text: '#FFFCF0', // base
  }

  // Scale font size based on canvas size (65% of size works well)
  const fontSize = Math.round(size * 0.65)

  // Add slight padding top to improve vertical centering
  // Text baseline naturally sits high, so we nudge it down
  const paddingTop = Math.round(size * 0.05)

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.red,
        borderRadius: '20%',
        paddingTop: `${paddingTop}px`,
      }}
    >
      <div
        style={{
          fontSize: `${fontSize}px`,
          fontWeight: 'bold',
          color: colors.text,
          lineHeight: '1',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        }}
      >
        -1
      </div>
    </div>
  )
}
