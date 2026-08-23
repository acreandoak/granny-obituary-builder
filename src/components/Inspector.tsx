import type { CanvasElement, TextElement } from '../types'
import type { DocumentStore } from '../hooks/useDocumentStore'
import { COLOR_PALETTES } from '../data/colorPalettes'

type Props = {
  store: DocumentStore
}

export function Inspector({ store }: Props) {
  const {
    selected,
    updateElement,
    removeSelected,
    bringForward,
    sendBackward,
    duplicateSelected,
    page,
    renamePage,
    setPageBackground,
    editSurface,
  } = store

  if (!page) return null

  const bg = editSurface === 'blank' ? page.blankBackground : page.background

  return (
    <aside className="inspector">
      <div className="panel-header">
        <p className="eyebrow">Inspect</p>
        <h2>{selected ? selected.type : editSurface === 'blank' ? 'Blank page' : 'Reference'}</h2>
      </div>

      {!selected && (
        <div className="field-group">
          <label>
            Page name
            <input value={page.name} onChange={(e) => renamePage(e.target.value)} />
          </label>
          <label>
            Background ({editSurface === 'blank' ? 'blank' : 'reference'})
            <input type="color" value={toColorInput(bg)} onChange={(e) => setPageBackground(e.target.value)} />
          </label>
          <div className="inspector-swatches">
            {COLOR_PALETTES.paper.colors.map((c) => (
              <button
                key={c.hex}
                type="button"
                className="mini-swatch"
                title={c.name}
                style={{ background: c.hex }}
                onClick={() => setPageBackground(c.hex)}
              />
            ))}
          </div>
          <label className="row">
            <input
              type="checkbox"
              checked={page.showUnderlay}
              disabled={!page.underlaySrc}
              onChange={(e) => store.updatePage((p) => ({ ...p, showUnderlay: e.target.checked }))}
            />
            Show scan underlay
          </label>
          <label className="row">
            <input
              type="checkbox"
              checked={page.showPageNumber}
              onChange={(e) => store.updatePage((p) => ({ ...p, showPageNumber: e.target.checked }))}
            />
            Show page number
          </label>
          <label>
            Number position
            <select
              value={page.pageNumberPosition}
              onChange={(e) =>
                store.updatePage((p) => ({
                  ...p,
                  pageNumberPosition: e.target.value as typeof page.pageNumberPosition,
                }))
              }
            >
              <option value="bl">Bottom left</option>
              <option value="br">Bottom right</option>
              <option value="tl">Top left</option>
              <option value="tr">Top right</option>
            </select>
          </label>
        </div>
      )}

      {selected && (
        <div className="field-group">
          <div className="btn-row">
            <button type="button" onClick={bringForward}>
              Forward
            </button>
            <button type="button" onClick={sendBackward}>
              Back
            </button>
            <button type="button" onClick={duplicateSelected}>
              Duplicate
            </button>
            <button type="button" className="danger" onClick={removeSelected}>
              Delete
            </button>
          </div>

          <label className="row">
            <input
              type="checkbox"
              checked={selected.locked}
              onChange={(e) => updateElement(selected.id, { locked: e.target.checked })}
            />
            Lock position
          </label>

          <label>
            Rotation
            <input
              type="range"
              min={-180}
              max={180}
              value={selected.rotation}
              onChange={(e) => updateElement(selected.id, { rotation: Number(e.target.value) })}
            />
            <span className="muted">{selected.rotation}°</span>
          </label>

          {selected.type === 'text' && <TextControls el={selected} onChange={(patch) => updateElement(selected.id, patch)} />}

          {selected.type === 'image' && (
            <>
              <label className="row">
                <input
                  type="checkbox"
                  checked={selected.isFrame}
                  onChange={(e) => updateElement(selected.id, { isFrame: e.target.checked })}
                />
                Photo frame (replace from library)
              </label>
              <label>
                Fit
                <select
                  value={selected.objectFit}
                  onChange={(e) => updateElement(selected.id, { objectFit: e.target.value as 'cover' | 'contain' | 'fill' })}
                >
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                  <option value="fill">Fill</option>
                </select>
              </label>
              <label>
                Focal X
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={selected.focalX}
                  onChange={(e) => updateElement(selected.id, { focalX: Number(e.target.value) })}
                />
              </label>
              <label>
                Focal Y
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={selected.focalY}
                  onChange={(e) => updateElement(selected.id, { focalY: Number(e.target.value) })}
                />
              </label>
              <label>
                Crop zoom
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={selected.cropZoom}
                  onChange={(e) => updateElement(selected.id, { cropZoom: Number(e.target.value) })}
                />
              </label>
              <label>
                Border width
                <input
                  type="number"
                  min={0}
                  value={selected.borderWidth}
                  onChange={(e) => updateElement(selected.id, { borderWidth: Number(e.target.value) })}
                />
              </label>
              <label>
                Border color
                <input
                  type="color"
                  value={toColorInput(selected.borderColor)}
                  onChange={(e) => updateElement(selected.id, { borderColor: e.target.value })}
                />
              </label>
              <label>
                Opacity
                <input
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={selected.opacity}
                  onChange={(e) => updateElement(selected.id, { opacity: Number(e.target.value) })}
                />
              </label>
              <button type="button" onClick={() => updateElement(selected.id, { src: null })}>
                Clear photo
              </button>
            </>
          )}

          {selected.type === 'decoration' && (
            <label>
              Color
              <input
                type="color"
                value={toColorInput(selected.color)}
                onChange={(e) => updateElement(selected.id, { color: e.target.value })}
              />
            </label>
          )}

          {selected.type === 'shape' && (
            <>
              <label>
                Shape
                <select
                  value={selected.shape}
                  onChange={(e) => {
                    const next = e.target.value as typeof selected.shape
                    const patch: Partial<typeof selected> = { shape: next }
                    if (next === 'ellipse' && Math.abs(selected.width - selected.height) < 8) {
                      /* keep circle */
                    } else if (next === 'rounded' && !(selected.borderRadius && selected.borderRadius > 0)) {
                      patch.borderRadius = 16
                    } else if (next === 'frame') {
                      patch.fill = 'transparent'
                      if (!selected.strokeWidth) patch.strokeWidth = 2
                    } else if (next === 'line') {
                      patch.fill = 'transparent'
                      patch.height = Math.max(selected.strokeWidth, 12)
                    }
                    updateElement(selected.id, patch)
                  }}
                >
                  <option value="rect">Box</option>
                  <option value="rounded">Rounded box</option>
                  <option value="frame">Frame outline</option>
                  <option value="ellipse">Circle / oval</option>
                  <option value="line">Line</option>
                </select>
              </label>

              {selected.shape !== 'line' && selected.shape !== 'frame' && (
                <label>
                  Fill
                  <input
                    type="color"
                    value={toColorInput(selected.fill === 'transparent' ? '#ffffff' : selected.fill)}
                    onChange={(e) => updateElement(selected.id, { fill: e.target.value })}
                  />
                </label>
              )}

              {(selected.shape === 'frame' || selected.shape === 'line' || selected.fill === 'transparent') && (
                <button type="button" onClick={() => updateElement(selected.id, { fill: '#f7f4ee' })}>
                  Add fill
                </button>
              )}

              {selected.shape !== 'line' && selected.fill !== 'transparent' && (
                <button type="button" onClick={() => updateElement(selected.id, { fill: 'transparent' })}>
                  Clear fill
                </button>
              )}

              <label>
                Stroke
                <input
                  type="color"
                  value={toColorInput(selected.stroke === 'transparent' ? '#1c1916' : selected.stroke)}
                  onChange={(e) => updateElement(selected.id, { stroke: e.target.value })}
                />
              </label>

              <label>
                Stroke width
                <input
                  type="number"
                  min={0}
                  max={48}
                  value={selected.strokeWidth}
                  onChange={(e) => updateElement(selected.id, { strokeWidth: Number(e.target.value) })}
                />
              </label>

              {(selected.shape === 'rect' || selected.shape === 'rounded' || selected.shape === 'frame') && (
                <label>
                  Corner radius
                  <input
                    type="range"
                    min={0}
                    max={80}
                    value={selected.borderRadius ?? (selected.shape === 'rounded' ? 16 : 0)}
                    onChange={(e) =>
                      updateElement(selected.id, {
                        borderRadius: Number(e.target.value),
                        shape: Number(e.target.value) > 0 && selected.shape === 'rect' ? 'rounded' : selected.shape,
                      })
                    }
                  />
                </label>
              )}

              <label>
                Opacity
                <input
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={selected.opacity}
                  onChange={(e) => updateElement(selected.id, { opacity: Number(e.target.value) })}
                />
              </label>

              <p className="eyebrow" style={{ marginTop: '0.5rem' }}>
                Quick fills
              </p>
              <div className="inspector-swatches">
                {[
                  ...COLOR_PALETTES.paper.colors,
                  ...COLOR_PALETTES.memorial.colors.slice(0, 4),
                  ...COLOR_PALETTES.redHat.colors.slice(0, 3),
                ].map((c) => (
                  <button
                    key={`shape-fill-${c.hex}-${c.name}`}
                    type="button"
                    className="mini-swatch"
                    title={c.name}
                    style={{ background: c.hex }}
                    onClick={() => updateElement(selected.id, { fill: c.hex })}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </aside>
  )
}

function TextControls({
  el,
  onChange,
}: {
  el: TextElement
  onChange: (patch: Partial<CanvasElement>) => void
}) {
  return (
    <>
      <label>
        Font
        <select value={el.fontFamily} onChange={(e) => onChange({ fontFamily: e.target.value })}>
          <option value='"Great Vibes", "Segoe Script", cursive'>Script</option>
          <option value='"Source Serif 4", "Iowan Old Style", Palatino, serif'>Serif</option>
          <option value='"Source Sans 3", "Helvetica Neue", Helvetica, Arial, sans-serif'>Sans</option>
          <option value='Georgia, serif'>Georgia</option>
        </select>
      </label>
      <label>
        Size
        <input type="number" min={8} max={120} value={el.fontSize} onChange={(e) => onChange({ fontSize: Number(e.target.value) })} />
      </label>
      <label>
        Color
        <input type="color" value={toColorInput(el.color)} onChange={(e) => onChange({ color: e.target.value })} />
      </label>
      <div className="inspector-swatches">
        {[...COLOR_PALETTES.memorial.colors, ...COLOR_PALETTES.redHat.colors.slice(0, 4)].map((c) => (
          <button
            key={c.hex + c.name}
            type="button"
            className="mini-swatch"
            title={c.name}
            style={{ background: c.hex }}
            onClick={() => onChange({ color: c.hex })}
          />
        ))}
      </div>
      <label>
        Align
        <select value={el.textAlign} onChange={(e) => onChange({ textAlign: e.target.value as TextElement['textAlign'] })}>
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
      </label>
      <label>
        Weight
        <select value={String(el.fontWeight)} onChange={(e) => onChange({ fontWeight: e.target.value })}>
          <option value="400">Regular</option>
          <option value="600">Semibold</option>
          <option value="700">Bold</option>
        </select>
      </label>
      <label className="row">
        <input
          type="checkbox"
          checked={el.fontStyle === 'italic'}
          onChange={(e) => onChange({ fontStyle: e.target.checked ? 'italic' : 'normal' })}
        />
        Italic
      </label>
      <label>
        Line height
        <input
          type="number"
          min={1}
          max={3}
          step={0.05}
          value={el.lineHeight}
          onChange={(e) => onChange({ lineHeight: Number(e.target.value) })}
        />
      </label>
    </>
  )
}

function toColorInput(value: string) {
  if (!value) return '#ffffff'
  if (value.startsWith('#') && value.length === 7) return value
  if (value.startsWith('#') && value.length === 4) return expand(value)
  return '#ffffff'
}

function expand(hex: string) {
  const h = hex.slice(1)
  return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`
}
