import { useCallback, useEffect, useRef, useState } from 'react'
import { Decoration } from './components/Decoration'
import { Inspector } from './components/Inspector'
import { PageCanvas } from './components/PageCanvas'
import { PageRail } from './components/PageRail'
import { PhotoLibrary } from './components/PhotoLibrary'
import { Toolbar } from './components/Toolbar'
import { createEmptyImage } from './data/seedDocument'
import { useDocumentStore } from './hooks/useDocumentStore'
import { assetUrl } from './lib/assetUrl'
import { readClipboardImage } from './lib/clipboardImage'
import type { CanvasElement, EditSurface } from './types'
import { PAGE_HEIGHT, PAGE_WIDTH } from './types'
import './styles/app.css'

export default function App() {
  const store = useDocumentStore()
  const [editingTextId, setEditingTextId] = useState<string | null>(null)
  const [autoFit, setAutoFit] = useState(true)

  const {
    ready,
    page,
    pageIndex,
    selectedId,
    selected,
    zoom,
    setZoom,
    editSurface,
    selectOnSurface,
    updateElement,
    addElement,
    removeSelected,
    placePhotoOnSelectionOrNew,
    doc,
  } = store

  const dualRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!autoFit || !dualRef.current) return
    const el = dualRef.current
    const fit = () => {
      const pad = 32
      const gap = 24
      const availW = Math.max(200, el.clientWidth - pad)
      const availH = Math.max(200, el.clientHeight - pad)
      const totalW = PAGE_WIDTH * 2 + gap
      const next = Math.min(availW / totalW, availH / PAGE_HEIGHT, 1.05)
      setZoom((z) => {
        const v = Math.max(0.28, Math.round(next * 100) / 100)
        return Math.abs(z - v) < 0.015 ? z : v
      })
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [autoFit, setZoom])

  const onDropPhoto = useCallback(
    (surface: EditSurface, src: string, x: number, y: number, targetId?: string) => {
      if (!page) return
      const isScan = src.includes('/scans/')
      const isDecorClip =
        (src.includes('/cutouts/') && src.endsWith('.png')) ||
        (src.includes('/stock/') && src.endsWith('.svg'))
      const isStockPhoto = src.includes('/stock/') && !isDecorClip
      const fit = isScan ? 'fill' : isDecorClip ? 'contain' : 'cover'

      // Decor clips + stock photos prefer the blank page
      const dest: EditSurface = isDecorClip || isStockPhoto ? 'blank' : surface

      // Prefer replacing into the surface that received the drop
      if (targetId) {
        const list = dest === 'blank' ? page.blankElements ?? [] : page.elements ?? []
        const target = list.find((e) => e.id === targetId)
        if (target?.type === 'image') {
          selectOnSurface(dest, targetId)
          updateElement(
            targetId,
            {
              src,
              objectFit: fit,
              isFrame: target.isFrame || (!isDecorClip && !isScan && !isStockPhoto),
            },
            dest,
          )
          return
        }
      }

      if (selected?.type === 'image' && editSurface === dest) {
        updateElement(
          selected.id,
          {
            src,
            objectFit: fit,
            isFrame: selected.isFrame || (!isDecorClip && !isScan),
          },
          dest,
        )
        return
      }

      if (!isDecorClip && !isScan && dest === 'reference') {
        const frames = page.elements.filter((e) => e.type === 'image' && e.isFrame)
        const empty = frames.find((f) => f.type === 'image' && !f.src)
        const target = empty ?? frames[0]
        if (target && target.type === 'image') {
          selectOnSurface('reference', target.id)
          updateElement(target.id, { src, objectFit: 'cover' }, 'reference')
          return
        }
      }

      const el = createEmptyImage(src)
      if (isScan) {
        el.x = 0
        el.y = 0
        el.width = PAGE_WIDTH
        el.height = PAGE_HEIGHT
        el.objectFit = 'fill'
        el.borderWidth = 0
      } else {
        el.x = Math.max(0, Math.min(PAGE_WIDTH - el.width, x - el.width / 2))
        el.y = Math.max(0, Math.min(PAGE_HEIGHT - el.height, y - el.height / 2))
      }
      addElement(el, dest)
    },
    [page, selected, editSurface, updateElement, selectOnSurface, addElement],
  )

  const placePastedImage = useCallback(
    (src: string) => {
      const dest: EditSurface = editSurface === 'reference' ? 'reference' : 'blank'
      if (selected?.type === 'image') {
        updateElement(
          selected.id,
          { src, objectFit: selected.isFrame ? 'cover' : 'contain', isFrame: selected.isFrame },
          dest,
        )
        return
      }
      const el = createEmptyImage(src)
      el.objectFit = 'cover'
      el.isFrame = true
      el.x = 160
      el.y = 220
      el.width = 420
      el.height = 420
      addElement(el, 'blank')
    },
    [editSurface, selected, updateElement, addElement],
  )

  const pasteImageFromClipboard = useCallback(async () => {
    try {
      const src = await readClipboardImage()
      if (!src) {
        alert(
          'No image found on the clipboard.\n\nIn Freeform: select the image, Copy, then click Paste image (or ⌘V).\nIf Chrome asks for clipboard permission, choose Allow.',
        )
        return
      }
      placePastedImage(src)
    } catch (err) {
      console.warn('Paste failed', err)
      alert('Could not paste that image. Try exporting from Freeform as a JPG/PNG and dropping the file onto the page.')
    }
  }, [placePastedImage])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (editingTextId) return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedId) {
        e.preventDefault()
        removeSelected()
      }
      if (e.key === 'Escape') {
        selectOnSurface(editSurface, null)
        setEditingTextId(null)
      }
    }

  const onPaste = async (e: ClipboardEvent) => {
      if (editingTextId) return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      try {
        const src = await readClipboardImage(e)
        if (!src) return
        e.preventDefault()
        placePastedImage(src)
      } catch (err) {
        console.warn('Paste failed', err)
      }
    }

    const onCopy = async (e: ClipboardEvent) => {
      if (editingTextId) return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (selected?.type !== 'image' || !selected.src) return

      try {
        const res = await fetch(assetUrl(selected.src))
        const blob = await res.blob()
        const type = blob.type.startsWith('image/') ? blob.type : 'image/png'
        e.preventDefault()
        if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
          await navigator.clipboard.write([new ClipboardItem({ [type]: blob })])
        }
      } catch {
        /* ignore */
      }
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('paste', onPaste)
    window.addEventListener('copy', onCopy)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('paste', onPaste)
      window.removeEventListener('copy', onCopy)
    }
  }, [
    selectedId,
    selected,
    editingTextId,
    removeSelected,
    selectOnSurface,
    editSurface,
    placePastedImage,
  ])


  const handleManualZoom = (value: number) => {
    setAutoFit(false)
    setZoom(value)
  }

  if (!ready || !doc || !page) {
    return (
      <div className="app-boot">
        <p>Loading booklet…</p>
      </div>
    )
  }

  const printPages = doc.pages.map((p) => {
    const blank = p.blankElements ?? []
    return {
      ...p,
      elements: blank.length ? blank : p.elements ?? [],
      background: blank.length ? p.blankBackground ?? p.background : p.background,
    }
  })

  return (
    <div className="app">
      <Toolbar
        store={store}
        onZoomChange={handleManualZoom}
        onFit={() => setAutoFit(true)}
        autoFit={autoFit}
        onPasteImage={pasteImageFromClipboard}
      />
      <div className="workspace">
        <PhotoLibrary
          onPick={placePhotoOnSelectionOrNew}
          onPickColor={(hex, role) => {
            if (role === 'page') {
              store.setPageBackground(hex)
              return
            }
            if (selected?.type === 'text') {
              updateElement(selected.id, { color: hex }, editSurface)
              return
            }
            // No text selected — still useful: switch to blank and leave hint via page name noop;
            // apply to first blank text if any
            const firstText = (page.blankElements ?? []).find((e) => e.type === 'text')
            if (firstText) {
              selectOnSurface('blank', firstText.id)
              updateElement(firstText.id, { color: hex }, 'blank')
            }
          }}
        />
        <main className="stage">
          <PageRail store={store} />
          <div className="dual-stage" ref={dualRef}>
            <PageCanvas
              page={page}
              pageNumber={pageIndex + 1}
              selectedId={editSurface === 'reference' ? selectedId : null}
              zoom={zoom}
              editingTextId={editSurface === 'reference' ? editingTextId : null}
              onSelect={(id) => selectOnSurface('reference', id)}
              onChange={(id, patch) => {
                selectOnSurface('reference', id)
                updateElement(id, patch as Partial<CanvasElement>, 'reference')
              }}
              onStartEditText={(id) => {
                selectOnSurface('reference', id)
                setEditingTextId(id)
              }}
              onEndEditText={() => setEditingTextId(null)}
              onDropPhoto={(src, x, y, targetId) => onDropPhoto('reference', src, x, y, targetId)}
              label="Reference"
              active={editSurface === 'reference'}
            />
            <PageCanvas
              page={page}
              pageNumber={pageIndex + 1}
              selectedId={editSurface === 'blank' ? selectedId : null}
              zoom={zoom}
              editingTextId={editSurface === 'blank' ? editingTextId : null}
              onSelect={(id) => selectOnSurface('blank', id)}
              onChange={(id, patch) => {
                selectOnSurface('blank', id)
                updateElement(id, patch as Partial<CanvasElement>, 'blank')
              }}
              onStartEditText={(id) => {
                selectOnSurface('blank', id)
                setEditingTextId(id)
              }}
              onEndEditText={() => setEditingTextId(null)}
              onDropPhoto={(src, x, y, targetId) => onDropPhoto('blank', src, x, y, targetId)}
              label="Blank text"
              active={editSurface === 'blank'}
              elementsOverride={page.blankElements ?? []}
              backgroundOverride={page.blankBackground ?? '#ffffff'}
              hideUnderlay
            />
          </div>
        </main>
        <Inspector store={store} />
      </div>

      <div className="print-root" aria-hidden>
        {printPages.map((p, i) => (
          <div key={p.id} className="print-page">
            <div className="print-page-inner" style={{ background: p.background }}>
              {[...p.elements]
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((el) => (
                  <PrintElement key={el.id} el={el} />
                ))}
              {p.showPageNumber && <div className={`print-page-num pos-${p.pageNumberPosition}`}>{i + 1}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PrintElement({ el }: { el: CanvasElement }) {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: el.x,
    top: el.y,
    width: el.width,
    height: el.height,
    transform: `rotate(${el.rotation}deg)`,
    zIndex: el.zIndex,
    opacity: 'opacity' in el ? el.opacity : 1,
  }

  if (el.type === 'text') {
    return (
      <div
        style={{
          ...style,
          fontFamily: el.fontFamily,
          fontSize: el.fontSize,
          fontWeight: el.fontWeight,
          fontStyle: el.fontStyle,
          color: el.color,
          textAlign: el.textAlign,
          lineHeight: el.lineHeight,
          whiteSpace: 'pre-wrap',
        }}
      >
        {el.content}
      </div>
    )
  }
  if (el.type === 'image') {
    return el.src ? (
      <div
        style={{
          ...style,
          overflow: 'hidden',
        }}
      >
        <img
          src={assetUrl(el.src)}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: el.objectFit,
            objectPosition: `${el.focalX ?? 50}% ${el.focalY ?? 50}%`,
            transform: el.cropZoom && el.cropZoom !== 1 ? `scale(${el.cropZoom})` : undefined,
            transformOrigin: `${el.focalX ?? 50}% ${el.focalY ?? 50}%`,
            border: el.borderWidth ? `${el.borderWidth}px solid ${el.borderColor}` : undefined,
          }}
        />
      </div>
    ) : null
  }
  if (el.type === 'shape') {
    const radius =
      el.shape === 'ellipse' ? '50%' : el.shape === 'rounded' ? el.borderRadius ?? 16 : el.borderRadius ?? 0
    return (
      <div
        style={{
          ...style,
          background: el.shape === 'line' || el.shape === 'frame' ? 'transparent' : el.fill,
          border:
            el.shape === 'line'
              ? undefined
              : `${el.strokeWidth}px solid ${el.stroke === 'transparent' ? 'transparent' : el.stroke}`,
          borderTop: el.shape === 'line' ? `${el.strokeWidth}px solid ${el.stroke}` : undefined,
          height: el.shape === 'line' ? el.strokeWidth : el.height,
          borderRadius: radius,
          boxSizing: 'border-box',
        }}
      />
    )
  }
  if (el.type === 'decoration') {
    return (
      <div
        style={{
          ...style,
          transform: `rotate(${el.rotation}deg)${el.flipX ? ' scaleX(-1)' : ''}`,
        }}
      >
        <Decoration kind={el.kind} color={el.color} />
      </div>
    )
  }
  return null
}
