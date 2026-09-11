import type * as React from 'react'

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        [elementName: `md-${string}`]: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & Record<string, unknown>
      }
    }
  }
}

export {}
