import { useEffect, useRef } from 'react'
import { Rnd } from 'react-rnd'
import { Decoration } from './Decoration'
import { blobToDisplayDataURL } from '../lib/clipboardImage'
import type { CanvasElement, ImageElement, Page } from '../types'
import { PAGE_HEIGHT, PAGE_WIDTH } from '../types'

type Props = {
  page: Page
  pageNumber: number
  selectedId: string | null
  zoom: number
  editingTextId: string | null
  onSelect: (id: string | null) => void
  onChange: (id: string, patch: Partial<CanvasElement>) => void
  onStartEditText: (id: string) => void
  onEndEditText: () => void
  onDropPhoto: (src: string, x: number, y: number, targetId?: string) => void
  onFitZoom?: (zoom: number) => void
  /** How many letter pages share the stage width (dual view = 2) */
  fitSlots?: number
  label?: string
  active?: boolean
  /** Override elements / background (blank surface) */
  elementsOverride?: CanvasElement[]
  backgroundOverride?: string
  hideUnderlay?: boolean
}

function imageStyle(el: ImageElement): React.CSSProperties {
  const zoom = Math.max(1, el.cropZoom || 1)
  if (el.objectFit === 'contain' || el.objectFit === 'fill') {
    return {
      width: '100%',
      height: '100%',
      objectFit: el.objectFit,
      objectPosition: `${el.focalX}% ${el.focalY}%`,
      display: 'block',
      pointerEvents: 'none',
      border: el.borderWidth ? `${el.borderWidth}px solid ${el.borderColor}` : undefined,
    }
  }
  return {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: `${el.focalX}% ${el.focalY}%`,
    transform: zoom !== 1 ? `scale(${zoom})` : undefined,
    transformOrigin: `${el.focalX}% ${el.focalY}%`,
    display: 'block',
    pointerEvents: 'none',
    border: el.borderWidth ? `${el.borderWidth}px solid ${el.borderColor}` : undefined,
  }
}

export function PageCanvas({
  page,
  pageNumber,
  selectedId,
  zoom,
  editingTextId,
  onSelect,
  onChange,
  onStartEditText,
  onEndEditText,
  onDropPhoto,
  onFitZoom,
  fitSlots = 1,
  label,
  active = false,
  elementsOverride,
  backgroundOverride,
  hideUnderlay = false,
}: Props) {
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const elements = elementsOverride ?? page.elements
  const background = backgroundOverride ?? page.background
  const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex)

  useEffect(() => {
    if (!onFitZoom || !stageRef.current) return
    const el = stageRef.current
    const fit = () => {
      const pad = 48
      const gap = 24
      const availW = Math.max(200, el.clientWidth - pad)
      const availH = Math.max(200, el.clientHeight - pad)
      const slots = Math.max(1, fitSlots)
      const totalW = PAGE_WIDTH * slots + gap * (slots - 1)
      const next = Math.min(availW / totalW, availH / PAGE_HEIGHT, 1.15)
      onFitZoom(Math.max(0.28, Math.round(next * 100) / 100))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [onFitZoom, fitSlots])

  const clientToPage = (clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return {
      x: (clientX - rect.left) / zoom,
      y: (clientY - rect.top) / zoom,
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const { x, y } = clientToPage(e.clientX, e.clientY)
    const target = (e.target as HTMLElement).closest('[data-element-id]')
    const targetId = target?.getAttribute('data-element-id') ?? undefined

    const src = e.dataTransfer.getData('application/x-photo-src') || e.dataTransfer.getData('text/plain')
    if (src && (src.startsWith('/') || src.startsWith('data:') || src.startsWith('blob:') || src.startsWith('http'))) {
      onDropPhoto(src, x, y, targetId ?? undefined)
      return
    }

    const file = [...e.dataTransfer.files].find((f) => f.type.startsWith('image/') || /\.(png|jpe?g|gif|webp|tiff?)$/i.test(f.name))
    if (!file) return
    void blobToDisplayDataURL(file)
      .then((src) => onDropPhoto(src, x, y, targetId ?? undefined))
      .catch((err) => console.warn('Drop image failed', err))
  }

  const pageNumberStyle = (() => {
    const base: React.CSSProperties = {
      position: 'absolute',
      fontFamily: '"Source Serif 4", Georgia, serif',
      fontSize: 16,
      color: '#1c1916',
      zIndex: 1000,
      pointerEvents: 'none',
    }
    switch (page.pageNumberPosition) {
      case 'br':
        return { ...base, right: 36, bottom: 28 }
      case 'tl':
        return { ...base, left: 36, top: 28 }
      case 'tr':
        return { ...base, right: 36, top: 28 }
      default:
        return { ...base, left: 36, bottom: 28 }
    }
  })()

  return (
    <div className={`stage-pane ${active ? 'active' : ''}`} ref={stageRef}>
      {label && <div className="stage-pane-label">{label}</div>}
      <div
        className="page-canvas-wrap"
        style={{ width: PAGE_WIDTH * zoom, height: PAGE_HEIGHT * zoom }}
        onMouseDown={() => onSelect(null)}
      >
        <div
          ref={canvasRef}
          className="page-canvas"
          style={{
            width: PAGE_WIDTH,
            height: PAGE_HEIGHT,
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            background,
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {!hideUnderlay && page.showUnderlay && page.underlaySrc && (
            <img
              className="page-underlay"
              src={page.underlaySrc}
              alt=""
              draggable={false}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'fill',
                opacity: 0.35,
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
          )}

          {sorted.map((el) => {
            const selected = el.id === selectedId
            const editing = editingTextId === el.id
            const locked = el.locked

            return (
              <Rnd
                key={el.id}
                scale={zoom}
                size={{ width: el.width, height: el.height }}
                position={{ x: el.x, y: el.y }}
                disableDragging={locked || editing}
                enableResizing={
                  locked || editing
                    ? false
                    : {
                        top: true,
                        right: true,
                        bottom: true,
                        left: true,
                        topRight: true,
                        bottomRight: true,
                        bottomLeft: true,
                        topLeft: true,
                      }
                }
                bounds="parent"
                style={{ zIndex: el.zIndex + (selected ? 500 : 0) }}
                resizeHandleClasses={{
                  top: 'rnd-handle rnd-handle-t',
                  right: 'rnd-handle rnd-handle-r',
                  bottom: 'rnd-handle rnd-handle-b',
                  left: 'rnd-handle rnd-handle-l',
                  topRight: 'rnd-handle rnd-handle-corner',
                  bottomRight: 'rnd-handle rnd-handle-corner',
                  bottomLeft: 'rnd-handle rnd-handle-corner',
                  topLeft: 'rnd-handle rnd-handle-corner',
                }}
                resizeHandleStyles={{
                  topRight: { width: 14, height: 14, right: -7, top: -7 },
                  bottomRight: { width: 14, height: 14, right: -7, bottom: -7 },
                  bottomLeft: { width: 14, height: 14, left: -7, bottom: -7 },
                  topLeft: { width: 14, height: 14, left: -7, top: -7 },
                }}
                onDragStop={(_e, d) => onChange(el.id, { x: d.x, y: d.y })}
                onResizeStop={(_e, _dir, ref, _delta, position) =>
                  onChange(el.id, {
                    width: parseFloat(ref.style.width),
                    height: parseFloat(ref.style.height),
                    x: position.x,
                    y: position.y,
                  })
                }
                onDragStart={(_e, _d) => onSelect(el.id)}
                onResizeStart={(_e, _dir, _ref) => onSelect(el.id)}
                onMouseDown={(e: MouseEvent) => {
                  e.stopPropagation()
                  onSelect(el.id)
                }}
                className={`canvas-el ${selected ? 'selected' : ''} ${locked ? 'locked' : ''} ${
                  el.type === 'image' && el.isFrame ? 'is-frame' : ''
                }`}
              >
                <div
                  data-element-id={el.id}
                  className="canvas-el-inner"
                  style={{
                    width: '100%',
                    height: '100%',
                    transform: `rotate(${el.rotation}deg)`,
                    opacity: 'opacity' in el ? el.opacity : 1,
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation()
                    if (el.type === 'text') onStartEditText(el.id)
                  }}
                >
                  {el.type === 'text' &&
                    (editing ? (
                      <textarea
                        className="text-editor"
                        autoFocus
                        value={el.content}
                        onChange={(e) => onChange(el.id, { content: e.target.value })}
                        onBlur={onEndEditText}
                        onMouseDown={(e) => e.stopPropagation()}
                        style={{
                          fontFamily: el.fontFamily,
                          fontSize: el.fontSize,
                          fontWeight: el.fontWeight,
                          fontStyle: el.fontStyle,
                          color: el.color,
                          textAlign: el.textAlign,
                          lineHeight: el.lineHeight,
                          letterSpacing: el.letterSpacing,
                        }}
                      />
                    ) : (
                      <div
                        className="text-display"
                        style={{
                          fontFamily: el.fontFamily,
                          fontSize: el.fontSize,
                          fontWeight: el.fontWeight,
                          fontStyle: el.fontStyle,
                          color: el.color,
                          textAlign: el.textAlign,
                          lineHeight: el.lineHeight,
                          letterSpacing: el.letterSpacing,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {el.content}
                      </div>
                    ))}

                  {el.type === 'image' &&
                    (el.src ? (
                      <div className="image-frame-clip">
                        <img src={el.src} alt="" draggable={false} style={imageStyle(el)} />
                      </div>
                    ) : (
                      <div
                        className="image-placeholder"
                        style={{
                          border: el.borderWidth
                            ? `${el.borderWidth}px solid ${el.borderColor}`
                            : '1px dashed #cfc7ba',
                        }}
                      >
                        {el.isFrame ? 'Drop photo' : 'Drop image'}
                      </div>
                    ))}

                  {el.type === 'shape' && (
                    <div
                      style={{
                        width: '100%',
                        height: el.shape === 'line' ? el.strokeWidth : '100%',
                        marginTop: el.shape === 'line' ? Math.max(0, (el.height - el.strokeWidth) / 2) : undefined,
                        background: el.shape === 'line' || el.shape === 'frame' ? 'transparent' : el.fill,
                        border:
                          el.shape === 'line'
                            ? undefined
                            : `${el.strokeWidth}px solid ${el.stroke === 'transparent' ? 'transparent' : el.stroke}`,
                        borderTop:
                          el.shape === 'line'
                            ? `${el.strokeWidth}px solid ${el.stroke}`
                            : undefined,
                        borderRadius:
                          el.shape === 'ellipse'
                            ? '50%'
                            : el.shape === 'rounded'
                              ? el.borderRadius ?? 16
                              : el.borderRadius ?? 0,
                        boxSizing: 'border-box',
                      }}
                    />
                  )}

                  {el.type === 'decoration' && (
                    <div style={{ transform: el.flipX ? 'scaleX(-1)' : undefined, width: '100%', height: '100%' }}>
                      <Decoration kind={el.kind} color={el.color} />
                    </div>
                  )}
                </div>
              </Rnd>
            )
          })}

          {page.showPageNumber && <div style={pageNumberStyle}>{pageNumber}</div>}
        </div>
      </div>
    </div>
  )
}
