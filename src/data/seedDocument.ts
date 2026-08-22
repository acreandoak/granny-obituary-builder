import { v4 as uid } from 'uuid'
import { scanCutouts, scannedPages } from './scanManifest'
import { TEXT_FONTS, textPages } from './textPages'
import type {
  CanvasElement,
  ImageElement,
  MemorialDocument,
  Page,
  ShapeElement,
  TextElement,
} from '../types'
import { PAGE_HEIGHT, PAGE_WIDTH, SANS, SCRIPT, SERIF } from '../types'

const INK = '#1c1916'
const PURPLE = '#5b2d8e'
const LAVENDER = '#ebe4f2'
const LINE = '#cfc7ba'

function cutout(id: string): string | null {
  return scanCutouts.find((c) => c.id === id)?.src ?? null
}

function scan(n: number): string | null {
  const id = `page-${String(n).padStart(2, '0')}`
  return scannedPages.find((p) => p.id === id)?.src ?? null
}

function text(
  partial: Partial<TextElement> &
    Pick<TextElement, 'content' | 'x' | 'y' | 'width' | 'height' | 'fontFamily' | 'fontSize' | 'color' | 'textAlign'>,
): TextElement {
  return {
    id: uid(),
    type: 'text',
    rotation: 0,
    locked: false,
    zIndex: 20,
    fontStyle: 'normal',
    lineHeight: 1.35,
    fontWeight: 400,
    letterSpacing: 0,
    ...partial,
  }
}

function image(
  partial: Partial<ImageElement> & Pick<ImageElement, 'x' | 'y' | 'width' | 'height'> & { src: string | null },
): ImageElement {
  return {
    id: uid(),
    type: 'image',
    rotation: 0,
    locked: false,
    zIndex: 5,
    objectFit: 'cover',
    focalX: 50,
    focalY: 50,
    cropZoom: 1,
    borderWidth: 0,
    borderColor: '#111',
    borderRadius: 0,
    opacity: 1,
    isFrame: false,
    ...partial,
  }
}

function shape(
  partial: Partial<ShapeElement> &
    Pick<ShapeElement, 'x' | 'y' | 'width' | 'height' | 'shape' | 'fill' | 'stroke' | 'strokeWidth'>,
): ShapeElement {
  return {
    id: uid(),
    type: 'shape',
    rotation: 0,
    locked: false,
    zIndex: 2,
    opacity: 1,
    borderRadius: 0,
    ...partial,
  }
}

function blankElementsFor(pageNum: number): CanvasElement[] {
  const seed = textPages.find((p) => p.page === pageNum)
  if (!seed) return []
  return seed.blocks.map((b, i) =>
    text({
      content: b.content,
      x: b.x,
      y: b.y,
      width: b.width,
      height: Math.max(b.height, b.fontSize * 1.5),
      fontFamily: TEXT_FONTS[b.font],
      fontSize: b.fontSize,
      color: b.color,
      textAlign: b.align,
      zIndex: 10 + i,
      lineHeight: 1.4,
    }),
  )
}

function page(
  name: string,
  background: string,
  elements: CanvasElement[],
  opts?: Partial<Page>,
): Page {
  return {
    id: uid(),
    name,
    background,
    elements,
    blankElements: [],
    blankBackground: '#ffffff',
    showPageNumber: false,
    pageNumberPosition: 'bl',
    underlaySrc: null,
    showUnderlay: false,
    ...opts,
  }
}

function buildCover(): Page {
  return page(
    'Cover',
    LAVENDER,
    [
      image({
        src: cutout('cover-florals-top'),
        x: 520,
        y: -40,
        width: 340,
        height: 240,
        objectFit: 'contain',
        zIndex: 8,
        isFrame: false,
      }),
      image({
        src: cutout('oos-butterfly-right'),
        x: 36,
        y: 430,
        width: 90,
        height: 80,
        objectFit: 'contain',
        zIndex: 12,
      }),
      image({
        src: cutout('cover-butterfly-right'),
        x: 690,
        y: 450,
        width: 80,
        height: 70,
        objectFit: 'contain',
        zIndex: 12,
      }),
      image({
        src: cutout('cover-butterfly-bottom'),
        x: 28,
        y: 920,
        width: 100,
        height: 90,
        objectFit: 'contain',
        zIndex: 12,
      }),
      text({
        content: 'Celebrating',
        x: 120,
        y: 70,
        width: 576,
        height: 78,
        fontFamily: SCRIPT,
        fontSize: 68,
        color: INK,
        textAlign: 'center',
        zIndex: 40,
      }),
      text({
        content: 'the Life of',
        x: 220,
        y: 145,
        width: 376,
        height: 36,
        fontFamily: SERIF,
        fontSize: 26,
        color: INK,
        textAlign: 'center',
        zIndex: 40,
      }),
      text({
        content: 'Kaila Marie Chizer',
        x: 80,
        y: 190,
        width: 656,
        height: 70,
        fontFamily: SCRIPT,
        fontSize: 52,
        color: INK,
        textAlign: 'center',
        zIndex: 40,
      }),
      image({
        src: cutout('cover-portrait'),
        x: 248,
        y: 290,
        width: 320,
        height: 400,
        objectFit: 'cover',
        borderWidth: 3,
        borderColor: '#1a1a1a',
        zIndex: 15,
        isFrame: true,
        focalX: 50,
        focalY: 35,
      }),
      text({
        content: 'Sunrise\nMay 29, 1996',
        x: 48,
        y: 420,
        width: 180,
        height: 80,
        fontFamily: SERIF,
        fontSize: 16,
        color: INK,
        textAlign: 'center',
        lineHeight: 1.45,
        zIndex: 30,
      }),
      text({
        content: 'Sunset\nAugust 23, 2022',
        x: 588,
        y: 420,
        width: 180,
        height: 80,
        fontFamily: SERIF,
        fontSize: 16,
        color: INK,
        textAlign: 'center',
        lineHeight: 1.45,
        zIndex: 30,
      }),
      text({
        content:
          'Christian Faith Baptist Church\n4304 Brinkley\nHouston, Texas 77051\nReverend Henry Guillory, Pastor',
        x: 160,
        y: 760,
        width: 496,
        height: 130,
        fontFamily: SERIF,
        fontSize: 16,
        color: INK,
        textAlign: 'center',
        lineHeight: 1.5,
        zIndex: 30,
      }),
    ],
    {
      underlaySrc: scan(1),
      showUnderlay: false,
      showPageNumber: false,
    },
  )
}

function buildOrderOfService(): Page {
  return page(
    'Order of Service',
    '#ffffff',
    [
      image({
        src: cutout('oos-florals-left'),
        x: -20,
        y: -10,
        width: 260,
        height: 210,
        objectFit: 'contain',
        zIndex: 25,
      }),
      image({
        src: cutout('oos-butterfly-right'),
        x: 580,
        y: 20,
        width: 220,
        height: 160,
        objectFit: 'contain',
        zIndex: 25,
      }),
      text({
        content: 'Order of Service',
        x: 120,
        y: 70,
        width: 576,
        height: 70,
        fontFamily: SCRIPT,
        fontSize: 52,
        color: PURPLE,
        textAlign: 'center',
        zIndex: 30,
      }),
      text({
        content: [
          'Processional ........................ Soft Music / Donald Reynolds, Musician',
          'Officiating Pastor ................. Rev. Henry Guillory, Pastor',
          'Reading of the Holy Scriptures',
          '    Old Testament ................. Dr. Dennis W. Young, Pastor',
          '    New Testament ................. Glenn Holmes, Sr., Pastor',
          'Prayer of Comfort ................. Joe Thompson, FCA',
          'Musical Selection ................. Mary Hill',
          'Resolutions and Acknowledgments ... Tamara Owens',
          'Obituary .......................... Olivia Thorpe',
          'Musical Selection ................. Chauntel Harris',
          'Special Expressions ............... 2 minutes each person, please',
          'Eulogy ............................ Rev. Henry Guillory, Pastor',
          'Recessional ....................... Soft Music',
        ].join('\n'),
        x: 72,
        y: 180,
        width: 672,
        height: 720,
        fontFamily: SERIF,
        fontSize: 16,
        color: INK,
        textAlign: 'left',
        lineHeight: 2.0,
        zIndex: 30,
      }),
    ],
    { underlaySrc: scan(2), showUnderlay: false, showPageNumber: true },
  )
}

function buildTributeParents(): Page {
  return page(
    'Tribute — Parents',
    '#ffffff',
    [
      text({
        content: 'Tribute',
        x: 500,
        y: 36,
        width: 260,
        height: 56,
        fontFamily: SCRIPT,
        fontSize: 44,
        color: PURPLE,
        textAlign: 'right',
        zIndex: 30,
      }),
      shape({
        shape: 'frame',
        x: 60,
        y: 110,
        width: 696,
        height: 760,
        fill: 'transparent',
        stroke: PURPLE,
        strokeWidth: 2,
        zIndex: 5,
      }),
      text({
        content: 'Parents',
        x: 84,
        y: 124,
        width: 200,
        height: 48,
        fontFamily: SCRIPT,
        fontSize: 34,
        color: PURPLE,
        textAlign: 'left',
        zIndex: 30,
      }),
      text({
        content:
          'The unselfish nature you showed never wavered.\n\nIn times that you felt pain, you would comfort us.\n\nEveryday was an opportunity you took to shower us with your kindness and warmth because our smiles mattered to you.\n\nYou never complained when times got hard, you just went harder.\n\nYour confidence and maturity made us so proud, while your adventurous spirit amazed us.\n\nWith all of this we watched you take time to smell the roses.\n\nThank you God for such a Blessing!\n\nWe love you, Kaila.\n\nMom and Dad',
        x: 84,
        y: 200,
        width: 340,
        height: 620,
        fontFamily: SERIF,
        fontSize: 15,
        color: INK,
        textAlign: 'left',
        lineHeight: 1.45,
        zIndex: 30,
      }),
      image({
        src: cutout('tribute-parents-photo'),
        x: 450,
        y: 260,
        width: 270,
        height: 340,
        objectFit: 'cover',
        borderWidth: 1,
        borderColor: '#333',
        zIndex: 15,
        isFrame: true,
      }),
      image({
        src: cutout('tribute-florals-corner'),
        x: 520,
        y: 820,
        width: 280,
        height: 200,
        objectFit: 'contain',
        zIndex: 28,
      }),
      image({
        src: cutout('cover-butterfly-bottom'),
        x: 40,
        y: 900,
        width: 110,
        height: 100,
        objectFit: 'contain',
        zIndex: 28,
      }),
    ],
    { underlaySrc: scan(7), showUnderlay: false, showPageNumber: true },
  )
}

function buildCollage(): Page {
  const gap = 12
  const frames: CanvasElement[] = [
    image({
      src: cutout('collage-a'),
      x: 36,
      y: 36,
      width: 240,
      height: 240,
      isFrame: true,
      objectFit: 'cover',
      zIndex: 10,
    }),
    image({
      src: cutout('collage-b'),
      x: 36 + 240 + gap,
      y: 36,
      width: 240,
      height: 240,
      isFrame: true,
      objectFit: 'cover',
      zIndex: 10,
    }),
    image({
      src: cutout('collage-c'),
      x: 36 + (240 + gap) * 2,
      y: 36,
      width: PAGE_WIDTH - 36 - (36 + (240 + gap) * 2),
      height: 240,
      isFrame: true,
      objectFit: 'cover',
      zIndex: 10,
    }),
    image({
      src: null,
      x: 36,
      y: 36 + 240 + gap,
      width: 360,
      height: 280,
      isFrame: true,
      objectFit: 'cover',
      borderWidth: 1,
      borderColor: LINE,
      zIndex: 10,
    }),
    image({
      src: cutout('collage-feature'),
      x: 36 + 360 + gap,
      y: 36 + 240 + gap,
      width: PAGE_WIDTH - 36 - (36 + 360 + gap),
      height: 280,
      isFrame: true,
      objectFit: 'cover',
      zIndex: 10,
    }),
    image({
      src: null,
      x: 36,
      y: 36 + 240 + gap + 280 + gap,
      width: 240,
      height: 300,
      isFrame: true,
      objectFit: 'cover',
      borderWidth: 1,
      borderColor: LINE,
      zIndex: 10,
    }),
    image({
      src: null,
      x: 36 + 240 + gap,
      y: 36 + 240 + gap + 280 + gap,
      width: 240,
      height: 300,
      isFrame: true,
      objectFit: 'cover',
      borderWidth: 1,
      borderColor: LINE,
      zIndex: 10,
    }),
    image({
      src: null,
      x: 36 + (240 + gap) * 2,
      y: 36 + 240 + gap + 280 + gap,
      width: PAGE_WIDTH - 36 - (36 + (240 + gap) * 2),
      height: 300,
      isFrame: true,
      objectFit: 'cover',
      borderWidth: 1,
      borderColor: LINE,
      zIndex: 10,
    }),
    image({
      src: cutout('tributes-florals-right'),
      x: 520,
      y: 900,
      width: 300,
      height: 160,
      objectFit: 'contain',
      zIndex: 30,
      isFrame: false,
    }),
  ]

  return page('Photo memories', '#ffffff', frames, {
    underlaySrc: scan(15),
    showUnderlay: false,
    showPageNumber: true,
  })
}

function buildCompose(): Page {
  return page(
    'Compose',
    '#ffffff',
    [
      text({
        content: 'Compose',
        x: 72,
        y: 64,
        width: 400,
        height: 48,
        fontFamily: SERIF,
        fontSize: 36,
        color: INK,
        textAlign: 'left',
        fontWeight: 600,
        zIndex: 10,
      }),
      text({
        content:
          'Select a frame, then click a photo in the library to replace it.\nDrag cutouts from Cutouts. Double-click text to edit.\nToggle Underlay in Inspect to compare with the scan.',
        x: 72,
        y: 130,
        width: 672,
        height: 90,
        fontFamily: SANS,
        fontSize: 15,
        color: '#5c564e',
        textAlign: 'left',
        lineHeight: 1.45,
        zIndex: 10,
      }),
      image({
        src: null,
        x: 208,
        y: 280,
        width: 400,
        height: 480,
        isFrame: true,
        objectFit: 'cover',
        borderWidth: 1,
        borderColor: LINE,
        zIndex: 8,
      }),
    ],
    { showPageNumber: true },
  )
}

/** Remaining pages keep scan underlay visible until rebuilt — editable frames on top optional. */
function buildScanPlaceholder(n: number, name: string): Page {
  return page(
    name,
    '#ffffff',
    [
      image({
        src: scan(n),
        x: 0,
        y: 0,
        width: PAGE_WIDTH,
        height: PAGE_HEIGHT,
        objectFit: 'fill',
        locked: true,
        zIndex: 1,
        isFrame: false,
        opacity: 1,
      }),
      text({
        content: 'Scan underlay — unlock or hide via Inspect → Underlay / Lock.\nAdd Text, Frame, or Cutout to rebuild this page.',
        x: 72,
        y: 48,
        width: 672,
        height: 60,
        fontFamily: SANS,
        fontSize: 13,
        color: '#5c564e',
        textAlign: 'left',
        zIndex: 40,
      }),
    ],
    {
      underlaySrc: scan(n),
      showUnderlay: false,
      showPageNumber: false,
    },
  )
}

export function createSeedDocument(_firstPhoto?: string | null): MemorialDocument {
  const names = [
    'Cover',
    'Order of Service',
    'Kaila-Isms',
    'A Beautiful Life',
    'Obituary continued',
    'Photo page',
    'Tribute — Parents',
    'Tribute — Sister',
    'Photo page',
    'Tributes',
    'Photo page',
    'Tributes',
    'Photo page',
    'Photo page',
    'Photo memories',
    'Photo page',
    'Photo memories',
    'Photo page',
    'Photo page',
    'Full page photo',
  ]

  const layered: Record<number, Page> = {
    1: buildCover(),
    2: buildOrderOfService(),
    7: buildTributeParents(),
    15: buildCollage(),
  }

  const pages: Page[] = []
  for (let i = 1; i <= scannedPages.length; i++) {
    const seed = textPages.find((p) => p.page === i)
    const base = layered[i] ?? buildScanPlaceholder(i, names[i - 1] ?? `Page ${i}`)
    pages.push({
      ...base,
      blankElements: blankElementsFor(i),
      blankBackground: seed?.background ?? '#ffffff',
      showPageNumber: seed?.showPageNumber ?? base.showPageNumber,
      pageNumberPosition: seed?.pageNumberPosition ?? base.pageNumberPosition,
    })
  }
  pages.push({
    ...buildCompose(),
    blankElements: [
      text({
        content: 'Blank compose page',
        x: 72,
        y: 64,
        width: 500,
        height: 48,
        fontFamily: SERIF,
        fontSize: 28,
        color: INK,
        textAlign: 'left',
      }),
      text({
        content: 'Drag Decor assets here. Double-click text to edit.',
        x: 72,
        y: 130,
        width: 600,
        height: 48,
        fontFamily: SANS,
        fontSize: 15,
        color: '#5c564e',
        textAlign: 'left',
      }),
    ],
    blankBackground: '#ffffff',
  })

  return {
    id: uid(),
    title: 'Celebrating the Life of Kaila Marie Chizer',
    pageWidth: PAGE_WIDTH,
    pageHeight: PAGE_HEIGHT,
    pages,
    updatedAt: new Date().toISOString(),
  }
}

export function createBlankPage(name = 'New page'): Page {
  return page(name, '#ffffff', [], {
    showPageNumber: true,
    blankElements: [],
    blankBackground: '#ffffff',
  })
}

export function createEmptyText(): TextElement {
  return text({
    content: 'New text',
    x: 120,
    y: 200,
    width: 576,
    height: 60,
    fontFamily: SERIF,
    fontSize: 20,
    color: INK,
    textAlign: 'left',
  })
}

export function createEmptyImage(src: string | null = null): ImageElement {
  const isScan = !!src?.includes('/scans/')
  const isStockClip = !!src?.includes('/stock/') && (src.endsWith('.svg') || src.includes('/clip-'))
  const isCutout = (!!src?.includes('/cutouts/') && src.endsWith('.png')) || isStockClip
  const isPhotoCutout = !!src?.includes('/cutouts/') && !isCutout && !src.endsWith('.png')
  const isStockPhoto = !!src?.includes('/stock/') && (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.webp'))

  if (isScan) {
    return image({
      src,
      x: 0,
      y: 0,
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      objectFit: 'fill',
      isFrame: false,
    })
  }
  if (isCutout) {
    return image({
      src,
      x: 80,
      y: 80,
      width: 260,
      height: 200,
      objectFit: 'contain',
      isFrame: false,
      zIndex: 25,
    })
  }
  if (isStockPhoto) {
    return image({
      src,
      x: 120,
      y: 160,
      width: 360,
      height: 360,
      objectFit: 'cover',
      isFrame: true,
      borderWidth: 1,
      borderColor: LINE,
      zIndex: 12,
    })
  }
  return image({
    src,
    x: 180,
    y: 220,
    width: 400,
    height: isPhotoCutout ? 480 : 400,
    objectFit: 'cover',
    isFrame: true,
    borderWidth: 1,
    borderColor: LINE,
  })
}

export function createDecorationFromCutout(src: string): ImageElement {
  return image({
    src,
    x: 80,
    y: 80,
    width: 260,
    height: 200,
    objectFit: 'contain',
    zIndex: 25,
    isFrame: false,
  })
}

export function createPhotoFrame(): ImageElement {
  return image({
    src: null,
    x: 208,
    y: 280,
    width: 400,
    height: 400,
    isFrame: true,
    objectFit: 'cover',
    borderWidth: 1,
    borderColor: LINE,
  })
}

export type ShapePreset =
  | 'box'
  | 'rounded'
  | 'frame'
  | 'circle'
  | 'oval'
  | 'line'
  | 'bar'

export function createShape(preset: ShapePreset = 'box'): ShapeElement {
  const base = {
    id: uid(),
    type: 'shape' as const,
    rotation: 0,
    locked: false,
    zIndex: 20,
    opacity: 1,
    borderRadius: 0,
  }

  switch (preset) {
    case 'rounded':
      return {
        ...base,
        shape: 'rounded',
        x: 180,
        y: 280,
        width: 420,
        height: 280,
        fill: '#f7f4ee',
        stroke: LINE,
        strokeWidth: 1,
        borderRadius: 18,
      }
    case 'frame':
      return {
        ...base,
        shape: 'frame',
        x: 160,
        y: 220,
        width: 480,
        height: 520,
        fill: 'transparent',
        stroke: INK,
        strokeWidth: 2,
        borderRadius: 0,
      }
    case 'circle':
      return {
        ...base,
        shape: 'ellipse',
        x: 280,
        y: 300,
        width: 240,
        height: 240,
        fill: LAVENDER,
        stroke: PURPLE,
        strokeWidth: 1,
      }
    case 'oval':
      return {
        ...base,
        shape: 'ellipse',
        x: 200,
        y: 340,
        width: 400,
        height: 240,
        fill: '#f7f4ee',
        stroke: LINE,
        strokeWidth: 1,
      }
    case 'line':
      return {
        ...base,
        shape: 'line',
        x: 120,
        y: 520,
        width: 560,
        height: 24,
        fill: 'transparent',
        stroke: INK,
        strokeWidth: 2,
      }
    case 'bar':
      return {
        ...base,
        shape: 'rect',
        x: 120,
        y: 200,
        width: 560,
        height: 12,
        fill: PURPLE,
        stroke: 'transparent',
        strokeWidth: 0,
      }
    case 'box':
    default:
      return {
        ...base,
        shape: 'rect',
        x: 180,
        y: 280,
        width: 420,
        height: 280,
        fill: '#ffffff',
        stroke: INK,
        strokeWidth: 1,
        borderRadius: 0,
      }
  }
}

