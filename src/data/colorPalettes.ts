export type PaletteSwatch = { name: string; hex: string }

export const COLOR_PALETTES = {
  memorial: {
    label: 'Memorial',
    colors: [
      { name: 'Ink', hex: '#1c1916' },
      { name: 'Muted', hex: '#5c564e' },
      { name: 'Line', hex: '#cfc7ba' },
      { name: 'Paper', hex: '#f4f1ea' },
      { name: 'White', hex: '#ffffff' },
      { name: 'Lavender page', hex: '#ebe4f2' },
      { name: 'Tribute purple', hex: '#5b2d8e' },
      { name: 'Soft violet', hex: '#7a4cb5' },
      { name: 'Accent green', hex: '#3d4a3a' },
    ] as PaletteSwatch[],
  },
  redHat: {
    label: 'Red Hat',
    colors: [
      { name: 'Hat red', hex: '#dc2626' },
      { name: 'Deep red', hex: '#9f1239' },
      { name: 'Society purple', hex: '#6b21a8' },
      { name: 'Royal purple', hex: '#4c1d95' },
      { name: 'Gold pin', hex: '#f0d878' },
      { name: 'Cream', hex: '#faf6f0' },
      { name: 'Black', hex: '#111111' },
      { name: 'Blush', hex: '#fecaca' },
    ] as PaletteSwatch[],
  },
  florals: {
    label: 'Florals',
    colors: [
      { name: 'Iris', hex: '#5b2d8e' },
      { name: 'Lilac', hex: '#a78bfa' },
      { name: 'Lavender', hex: '#9b7bb8' },
      { name: 'Leaf', hex: '#3d4a3a' },
      { name: 'Sage', hex: '#6b7c5e' },
      { name: 'Pollen', hex: '#e8d48b' },
      { name: 'Rose', hex: '#be123c' },
      { name: 'Petal pink', hex: '#f9a8d4' },
    ] as PaletteSwatch[],
  },
  paper: {
    label: 'Paper',
    colors: [
      { name: 'White', hex: '#ffffff' },
      { name: 'Ivory', hex: '#faf8f3' },
      { name: 'Cream', hex: '#f4f1ea' },
      { name: 'Warm sand', hex: '#ebe4d6' },
      { name: 'Lavender wash', hex: '#ebe4f2' },
      { name: 'Blush wash', hex: '#f8ecec' },
      { name: 'Sage wash', hex: '#eef1eb' },
      { name: 'Soft lilac', hex: '#f3eef8' },
    ] as PaletteSwatch[],
  },
} as const

export type PaletteKey = keyof typeof COLOR_PALETTES
