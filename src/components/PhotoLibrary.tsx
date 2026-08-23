import { useMemo, useState } from 'react'
import { COLOR_PALETTES, type PaletteKey } from '../data/colorPalettes'
import { libraryPhotos } from '../data/photoManifest'
import { scanCutouts, scannedPages } from '../data/scanManifest'
import { assetUrl } from '../lib/assetUrl'

type Props = {
  onPick: (src: string) => void
  onPickColor?: (hex: string, role: 'ink' | 'page') => void
}

type Tab = 'photos' | 'pages' | 'cutouts' | 'decor' | 'colors'
type DecorFilter = 'all' | 'butterflies' | 'florals'

function isBookletDecor(c: (typeof scanCutouts)[number]) {
  return c.kind === 'decoration' || (c.src.endsWith('.png') && !c.src.includes('portrait'))
}

export function PhotoLibrary({ onPick, onPickColor }: Props) {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<Tab>('photos')
  const [decorFilter, setDecorFilter] = useState<DecorFilter>('all')
  const [paletteKey, setPaletteKey] = useState<PaletteKey>('memorial')
  const [colorRole, setColorRole] = useState<'ink' | 'page'>('ink')

  const bookletDecor = useMemo(() => scanCutouts.filter(isBookletDecor), [])

  const decorItems = useMemo(() => {
    if (decorFilter === 'all') return bookletDecor
    if (decorFilter === 'butterflies') {
      return bookletDecor.filter(
        (a) => a.motif === 'butterfly' || /butterfly|butterflies/.test(a.id) || /butterfly|butterflies/.test(a.name),
      )
    }
    return bookletDecor.filter(
      (a) => a.motif === 'floral' || /floral|florals|flower/.test(a.id) || /floral|florals/.test(a.name),
    )
  }, [bookletDecor, decorFilter])

  const items = useMemo(() => {
    if (tab === 'colors') return []
    const q = query.trim().toLowerCase()
    const list =
      tab === 'photos' ? libraryPhotos : tab === 'pages' ? scannedPages : tab === 'decor' ? decorItems : scanCutouts
    if (!q) return list
    return list.filter((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
  }, [query, tab, decorItems])

  const palette = COLOR_PALETTES[paletteKey]

  return (
    <aside className="photo-library">
      <div className="panel-header">
        <p className="eyebrow">Assets</p>
        <h2>Library</h2>
      </div>

      <div className="lib-tabs">
        <button type="button" className={tab === 'decor' ? 'primary' : undefined} onClick={() => setTab('decor')}>
          Decor
        </button>
        <button type="button" className={tab === 'colors' ? 'primary' : undefined} onClick={() => setTab('colors')}>
          Colors
        </button>
        <button type="button" className={tab === 'photos' ? 'primary' : undefined} onClick={() => setTab('photos')}>
          Photos
        </button>
        <button type="button" className={tab === 'pages' ? 'primary' : undefined} onClick={() => setTab('pages')}>
          Pages
        </button>
        <button type="button" className={tab === 'cutouts' ? 'primary' : undefined} onClick={() => setTab('cutouts')}>
          Cutouts
        </button>
      </div>

      {tab === 'photos' && (
        <p className="color-hint">
          From Freeform: Copy the image, then click <strong>Paste image</strong> in the toolbar (or ⌘V). Allow clipboard
          access if the browser asks. You can also drop image files onto the page.
        </p>
      )}

      {tab === 'decor' && (
        <>
          <div className="lib-subtabs">
            {(
              [
                ['all', 'All'],
                ['butterflies', 'Butterflies'],
                ['florals', 'Florals'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={decorFilter === id ? 'primary' : undefined}
                onClick={() => setDecorFilter(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="color-hint">
            Cut from the booklet pages with transparent backgrounds — butterflies and florals only.
            For Red Hat looks, use Photos named “Red accent” (from Granny’s album) plus the Colors → Red Hat swatches.
          </p>
        </>
      )}

      {tab !== 'colors' && (
        <input
          className="search"
          placeholder={tab === 'decor' ? 'Search booklet decor…' : 'Search…'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      )}

      {tab === 'colors' ? (
        <div className="color-library">
          <div className="lib-subtabs">
            {(Object.keys(COLOR_PALETTES) as PaletteKey[]).map((key) => (
              <button
                key={key}
                type="button"
                className={paletteKey === key ? 'primary' : undefined}
                onClick={() => setPaletteKey(key)}
              >
                {COLOR_PALETTES[key].label}
              </button>
            ))}
          </div>
          <div className="lib-subtabs">
            <button
              type="button"
              className={colorRole === 'ink' ? 'primary' : undefined}
              onClick={() => setColorRole('ink')}
            >
              Text / ink
            </button>
            <button
              type="button"
              className={colorRole === 'page' ? 'primary' : undefined}
              onClick={() => setColorRole('page')}
            >
              Page bg
            </button>
          </div>
          <p className="color-hint">
            {colorRole === 'ink' ? 'Applies to selected text.' : 'Applies to the active page background.'}
          </p>
          <div className="color-swatches">
            {palette.colors.map((c) => (
              <button
                key={c.hex + c.name}
                type="button"
                className="color-swatch"
                title={`${c.name} ${c.hex}`}
                style={{ background: c.hex }}
                onClick={() => onPickColor?.(c.hex, colorRole)}
              >
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className={`photo-grid ${tab === 'decor' ? 'decor-grid' : ''}`}>
          {items.map((asset) => (
            <button
              key={asset.id}
              type="button"
              className={`photo-thumb ${tab !== 'photos' ? 'scan' : ''} ${tab === 'decor' ? 'decor' : ''}`}
              title={asset.name}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/x-photo-src', asset.src)
                e.dataTransfer.setData('text/plain', asset.src)
                e.dataTransfer.effectAllowed = 'copy'
              }}
              onClick={() => onPick(asset.src)}
            >
              <img src={assetUrl(asset.src)} alt={asset.name} loading="eager" />
            </button>
          ))}
        </div>
      )}
    </aside>
  )
}
