import { scanCutouts } from '../data/scanManifest'
import { createDecorationFromCutout, createShape, type ShapePreset } from '../data/seedDocument'
import type { DocumentStore } from '../hooks/useDocumentStore'

type Props = {
  store: DocumentStore
  onZoomChange: (zoom: number) => void
  onFit: () => void
  autoFit: boolean
  onPasteImage?: () => void
}

const SHAPE_OPTIONS: { id: ShapePreset; label: string }[] = [
  { id: 'box', label: 'Box' },
  { id: 'rounded', label: 'Rounded box' },
  { id: 'frame', label: 'Frame outline' },
  { id: 'circle', label: 'Circle' },
  { id: 'oval', label: 'Oval' },
  { id: 'line', label: 'Line' },
  { id: 'bar', label: 'Accent bar' },
]

export function Toolbar({ store, onZoomChange, onFit, autoFit, onPasteImage }: Props) {
  const {
    doc,
    zoom,
    addText,
    addImageFrame,
    addElement,
    addPage,
    deletePage,
    resetToSeed,
    exportDocument,
    importDocument,
    removeSelected,
    selected,
  } = store

  const cutoutChoices = scanCutouts.filter((c) => c.kind === 'decoration' || c.src.endsWith('.png'))

  const addShape = (preset: ShapePreset) => {
    addElement(createShape(preset), 'blank')
  }

  return (
    <header className="toolbar">
      <div className="brand">
        <p className="eyebrow">Memorial</p>
        <strong>Booklet</strong>
      </div>

      <div className="toolbar-group tools">
        <button type="button" onClick={addText}>
          Text
        </button>
        <button type="button" onClick={() => addImageFrame(null)}>
          Frame
        </button>
        {onPasteImage && (
          <button type="button" onClick={onPasteImage} title="Paste image from clipboard (Freeform, Photos, screenshot)">
            Paste image
          </button>
        )}
        <div className="menu">
          <button type="button">Shape ▾</button>
          <div className="menu-panel">
            {SHAPE_OPTIONS.map((s) => (
              <button key={s.id} type="button" onClick={() => addShape(s.id)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="menu">
          <button type="button">Cutout ▾</button>
          <div className="menu-panel">
            {cutoutChoices.map((c) => (
              <button key={c.id} type="button" onClick={() => addElement(createDecorationFromCutout(c.src), 'blank')}>
                {c.name}
              </button>
            ))}
          </div>
        </div>
        <button type="button" onClick={addPage}>
          Page
        </button>
        <button type="button" onClick={deletePage} disabled={!doc || doc.pages.length <= 1}>
          Delete page
        </button>
        <button type="button" onClick={removeSelected} disabled={!selected}>
          Delete
        </button>
      </div>

      <div className="toolbar-group actions">
        <label className="zoom">
          Zoom
          <input
            type="range"
            min={0.28}
            max={1.2}
            step={0.01}
            value={Math.min(1.2, Math.max(0.28, zoom))}
            onChange={(e) => onZoomChange(Number(e.target.value))}
          />
          <span>{Math.round(zoom * 100)}%</span>
        </label>
        <button type="button" className={autoFit ? 'primary' : undefined} onClick={onFit} title="Fit page in view">
          Fit
        </button>
        <button type="button" onClick={exportDocument} title="Download a backup of your booklet">
          Save file
        </button>
        <button type="button" onClick={importDocument} title="Load a booklet backup JSON">
          Load file
        </button>
        <button type="button" className="primary" onClick={() => window.print()}>
          Print / PDF
        </button>
        <button
          type="button"
          className="ghost"
          onClick={() => {
            resetToSeed()
            onFit()
          }}
        >
          Reset
        </button>
      </div>
    </header>
  )
}
