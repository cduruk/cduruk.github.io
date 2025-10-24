/**
 * Hero Image Template
 *
 * This file defines the visual design for auto-generated blog post hero images.
 * Customize colors, layout, typography, and spacing here.
 */

import React from 'react'

export interface HeroTemplateProps {
  title: string
  description?: string
  date: string | Date
  tags?: string[]
}

/**
 * Generate the hero image template as a React component
 */
export function HeroTemplate({ title, description, date, tags = [] }: HeroTemplateProps) {
  // Format date
  const dateObj = new Date(date)
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: '80px',
        // Customize background gradient here
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        justifyContent: 'space-between',
      }}
    >
      {/* Main content area */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </div>

        {/* Description (if provided) */}
        {description && (
          <div
            style={{
              fontSize: '32px',
              opacity: 0.9,
              lineHeight: '1.4',
            }}
          >
            {description}
          </div>
        )}
      </div>

      {/* Footer with date and tags */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '24px',
          opacity: 0.8,
        }}
      >
        {/* Date */}
        <div>{formattedDate}</div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '12px',
            }}
          >
            {tags.slice(0, 3).map((tag) => (
              <div
                key={tag}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
