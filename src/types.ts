export type ElementType = 'text' | 'image' | 'shape' | 'decoration'

export interface BaseElement {
  id: string
  type: ElementType
  x: number
  y: number
  width: number
  height: number
  rotation: number
  locked: boolean
  zIndex: number
}

export interface TextElement extends BaseElement {
  type: 'text'
  content: string
  fontFamily: string
  fontSize: number
  fontWeight: number | string
  fontStyle: 'normal' | 'italic'
  color: string
  textAlign: 'left' | 'center' | 'right' | 'justify'
  lineHeight: number
  letterSpacing?: number
}

export interface ImageElement extends BaseElement {
  type: 'image'
  src: string | null
  /** cover | contain | fill — how the image fills the frame */
  objectFit: 'cover' | 'contain' | 'fill'
  /** Focal point inside frame, percent 0–100 */
  focalX: number
  focalY: number
  /** Zoom within frame; 1 = default cover */
  cropZoom: number
  borderWidth: number
  borderColor: string
  borderRadius: number
  opacity: number
  /** If true, treat as refillable photo frame (not a free decoration) */
  isFrame: boolean
}

export interface ShapeElement extends BaseElement {
  type: 'shape'
  shape: 'rect' | 'rounded' | 'ellipse' | 'line' | 'frame'
  fill: string
  stroke: string
  strokeWidth: number
  opacity: number
  /** Corner radius for rect / rounded (ignored for ellipse/line) */
  borderRadius?: number
}

export interface DecorationElement extends BaseElement {
  type: 'decoration'
  kind: 'butterfly' | 'flowers-tl' | 'flowers-br' | 'flowers-tr' | 'branch'
  color: string
  opacity: number
  flipX?: boolean
}

export type CanvasElement =
  | TextElement
  | ImageElement
  | ShapeElement
  | DecorationElement

export interface Page {
  id: string
  name: string
  background: string
  /** Reference / middle render (photos, layered layout, or scan) */
  elements: CanvasElement[]
  /** Blank text reconstruction — editable text + decor only */
  blankElements: CanvasElement[]
  blankBackground: string
  showPageNumber: boolean
  pageNumberPosition: 'bl' | 'br' | 'tl' | 'tr'
  /** Dimmed scan underlay for reference while editing */
  underlaySrc: string | null
  showUnderlay: boolean
}

export type EditSurface = 'reference' | 'blank'

export interface MemorialDocument {
  id: string
  title: string
  pageWidth: number
  pageHeight: number
  pages: Page[]
  updatedAt: string
}

export const PAGE_WIDTH = 816
export const PAGE_HEIGHT = 1056

export const SCRIPT = '"Great Vibes", "Segoe Script", cursive'
export const SERIF = '"Source Serif 4", "Iowan Old Style", Palatino, serif'
export const SANS = '"Source Sans 3", "Helvetica Neue", Helvetica, Arial, sans-serif'
