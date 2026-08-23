/**
 * Resolve a public asset path for both local (`/`) and GitHub Pages (`/granny-obituary-builder/`).
 * Leaves data URLs and absolute http(s)/blob URLs unchanged.
 */
export function assetUrl(src: string | null | undefined): string {
  if (!src) return ''
  if (
    src.startsWith('data:') ||
    src.startsWith('blob:') ||
    src.startsWith('http://') ||
    src.startsWith('https://')
  ) {
    return src
  }
  const base = import.meta.env.BASE_URL || '/'
  const path = src.startsWith('/') ? src.slice(1) : src
  return `${base}${path}`
}
