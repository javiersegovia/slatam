import 'react-icons'
// twin.d.ts
import 'twin.macro'
import styledImport, { CSSProp, css as cssImport } from 'styled-components'

declare module 'twin.macro' {
  // The styled and css imports
  const styled: typeof styledImport
  const css: typeof cssImport
}

declare module 'react' {
  // The css prop
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: CSSProp
  }
  // The inline svg css prop
  interface SVGProps extends SVGProps<SVGSVGElement> {
    css?: CSSProp
  }
}

declare module 'react-icons' {
  interface IconType {
    css?: CSSProp
  }
}

// The 'as' prop on styled components
declare global {
  namespace JSX {
    interface IntrinsicAttributes<T> extends DOMAttributes<T> {
      as?: string | React.ReactNode
    }
  }
}
