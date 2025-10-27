/**
 * Favicon Template
 *
 * This file defines the visual design for the favicon.
 * Displays "-1" in a red box using the Flexoki color scheme.
 */

/**
 * Generate the favicon as a React component
 * Simple design with "-1" centered in a red rounded box
 */
export function FaviconTemplate() {
  // Flexoki brand colors (from global.css - dark theme)
  const colors = {
    red: '#AF3029', // red (Flexoki)
    text: '#FFFCF0', // base
  }

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
      }}
    >
      <div
        style={{
          fontSize: '80px',
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
