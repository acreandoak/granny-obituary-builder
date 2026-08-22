/** Read an image from the system clipboard (Freeform, Photos, screenshots, Finder). */

const MAX_EDGE = 1400
const JPEG_QUALITY = 0.82

function fileToDataURL(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error ?? new Error('read failed'))
    reader.readAsDataURL(file)
  })
}

/**
 * Convert clipboard image bytes to a compact JPEG data URL.
 * Freeform often gives huge TIFF/PNG — full-size data URLs blow localStorage and crash the app.
 */
export async function blobToDisplayDataURL(blob: Blob): Promise<string> {
  try {
    const bitmap = await createImageBitmap(blob)
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height, 1))
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      bitmap.close()
      return fileToDataURL(blob)
    }
    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()
    return canvas.toDataURL('image/jpeg', JPEG_QUALITY)
  } catch {
    try {
      return fileToDataURL(blob)
    } catch {
      throw new Error('Could not read clipboard image')
    }
  }
}

function looksLikeImageFile(file: File): boolean {
  if (file.type.startsWith('image/')) return true
  return /\.(png|jpe?g|gif|webp|tiff?|heic|bmp)$/i.test(file.name)
}

function pickImageType(types: readonly string[]): string | null {
  const preferred = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/tiff', 'image/bmp']
  for (const t of preferred) {
    if (types.includes(t)) return t
  }
  return types.find((t) => t.startsWith('image/')) ?? null
}

async function dataURLFromHtml(html: string): Promise<string | null> {
  const match = html.match(
    /(?:src|srcset)=["'](data:image\/[^"'>\s]+|blob:[^"'>\s]+|https?:\/\/[^"'>\s]+)["']/i,
  )
  if (!match) return null
  const url = match[1].split(/\s+/)[0]
  if (url.startsWith('data:image/')) {
    // Re-encode oversized data URLs from HTML paste
    try {
      const res = await fetch(url)
      return blobToDisplayDataURL(await res.blob())
    } catch {
      return url
    }
  }
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    return blobToDisplayDataURL(await res.blob())
  } catch {
    return null
  }
}

export async function imageFromPasteEvent(e: ClipboardEvent): Promise<string | null> {
  const items = e.clipboardData?.items
  if (items?.length) {
    for (const item of items) {
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) return blobToDisplayDataURL(file)
      }
    }
    for (const item of items) {
      if (item.kind !== 'file') continue
      const file = item.getAsFile()
      if (file && looksLikeImageFile(file)) return blobToDisplayDataURL(file)
    }
    for (const item of items) {
      if (item.type !== 'text/html') continue
      const html = await new Promise<string>((resolve) => {
        item.getAsString(resolve)
      })
      const fromHtml = await dataURLFromHtml(html)
      if (fromHtml) return fromHtml
    }
  }

  const files = e.clipboardData?.files
  if (files?.length) {
    for (const file of files) {
      if (looksLikeImageFile(file)) return blobToDisplayDataURL(file)
    }
  }

  return null
}

export async function imageFromClipboardAPI(): Promise<string | null> {
  if (!navigator.clipboard?.read) return null
  try {
    const items = await navigator.clipboard.read()
    for (const item of items) {
      const imageType = pickImageType(item.types)
      if (imageType) {
        const blob = await item.getType(imageType)
        return blobToDisplayDataURL(blob)
      }
      if (item.types.includes('text/html')) {
        const html = await (await item.getType('text/html')).text()
        const fromHtml = await dataURLFromHtml(html)
        if (fromHtml) return fromHtml
      }
    }
  } catch {
    return null
  }
  return null
}

export async function readClipboardImage(e?: ClipboardEvent): Promise<string | null> {
  try {
    if (e) {
      const fromEvent = await imageFromPasteEvent(e)
      if (fromEvent) return fromEvent
    }
    return await imageFromClipboardAPI()
  } catch (err) {
    console.warn('Clipboard image read failed', err)
    return null
  }
}
