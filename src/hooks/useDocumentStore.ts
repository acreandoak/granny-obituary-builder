import { useCallback, useEffect, useMemo, useState } from 'react'
import { v4 as uid } from 'uuid'
import {
  createBlankPage,
  createEmptyImage,
  createEmptyText,
  createPhotoFrame,
  createSeedDocument,
} from '../data/seedDocument'
import { libraryPhotos } from '../data/photoManifest'
import type { CanvasElement, EditSurface, MemorialDocument, Page } from '../types'

const STORAGE_KEY = 'granny-obituary-builder:v7'

function loadFromLocalStorage(): MemorialDocument | null {
  try {
    for (const key of [STORAGE_KEY, 'granny-obituary-builder:v6', 'granny-obituary-builder:v5']) {
      const raw = localStorage.getItem(key)
      if (!raw) continue
      const doc = JSON.parse(raw) as MemorialDocument
      return migrateDocument(doc)
    }
  } catch {
    /* ignore */
  }
  return null
}

function migrateDocument(doc: MemorialDocument): MemorialDocument {
  const seed = createSeedDocument()
  const bookletCount = Math.min(20, seed.pages.length)
  const keepExactPages = Boolean(doc.sharedDefaultVersion)

  const pages = doc.pages.map((p) => ({
    ...p,
    underlaySrc: p.underlaySrc ?? null,
    showUnderlay: p.showUnderlay ?? false,
    blankElements: Array.isArray(p.blankElements) ? p.blankElements : [],
    blankBackground: p.blankBackground ?? '#ffffff',
    elements: (p.elements ?? []).map((el) => {
      if (el.type !== 'image') return el
      return {
        ...el,
        focalX: el.focalX ?? 50,
        focalY: el.focalY ?? 50,
        cropZoom: el.cropZoom ?? 1,
        isFrame: el.isFrame ?? false,
      }
    }),
  }))

  // Shared / finished booklets keep their page count. Only pad old incomplete saves.
  if (!keepExactPages && pages.length < bookletCount) {
    for (let i = pages.length; i < bookletCount; i++) {
      pages.push(seed.pages[i])
    }
  }

  if (!keepExactPages) {
    for (let i = 0; i < Math.min(pages.length, bookletCount); i++) {
      if ((!pages[i].blankElements || pages[i].blankElements.length === 0) && seed.pages[i].blankElements.length > 0) {
        pages[i] = {
          ...pages[i],
          blankElements: seed.pages[i].blankElements,
          blankBackground: pages[i].blankBackground || seed.pages[i].blankBackground,
        }
      }
    }
  }

  return { ...doc, pages }
}

async function loadSharedDefault(): Promise<MemorialDocument | null> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}default-booklet.json`)
    if (!res.ok) return null
    const parsed = (await res.json()) as MemorialDocument
    if (!parsed?.pages || !Array.isArray(parsed.pages)) return null
    return migrateDocument(parsed)
  } catch {
    return null
  }
}

export function useDocumentStore() {
  const [doc, setDoc] = useState<MemorialDocument | null>(null)
  const [ready, setReady] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editSurface, setEditSurface] = useState<EditSurface>('blank')
  const [zoom, setZoom] = useState(0.55)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const fromLs = loadFromLocalStorage()
      if (fromLs) {
        if (!cancelled) {
          setDoc(fromLs)
          setReady(true)
        }
        return
      }
      const shared = await loadSharedDefault()
      if (cancelled) return
      if (shared) {
        setDoc(shared)
      } else {
        setDoc(createSeedDocument(libraryPhotos[0]?.src ?? null))
      }
      setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!ready || !doc) return
    const payload = JSON.stringify({ ...doc, updatedAt: new Date().toISOString() })
    try {
      localStorage.setItem(STORAGE_KEY, payload)
    } catch (err) {
      // Pasted Freeform images as huge data URLs used to throw QuotaExceededError and white-screen the app.
      console.warn('Browser storage full — booklet kept in memory. Use Save file to back up.', err)
      try {
        localStorage.removeItem('granny-obituary-builder:v5')
        localStorage.removeItem('granny-obituary-builder:v6')
        localStorage.setItem(STORAGE_KEY, payload)
      } catch {
        /* still over quota — do not rethrow */
      }
    }
  }, [doc, ready])

  const page = doc?.pages[pageIndex] ?? doc?.pages[0]

  const activeElements =
    editSurface === 'blank' ? page?.blankElements ?? [] : page?.elements ?? []

  const selected = useMemo(
    () => activeElements.find((e) => e.id === selectedId) ?? null,
    [activeElements, selectedId],
  )

  const updatePage = useCallback(
    (updater: (p: Page) => Page) => {
      setDoc((d) => {
        if (!d) return d
        return {
          ...d,
          pages: d.pages.map((p, i) => (i === pageIndex ? updater(p) : p)),
          updatedAt: new Date().toISOString(),
        }
      })
    },
    [pageIndex],
  )

  const updateElement = useCallback(
    (id: string, patch: Partial<CanvasElement>, surface: EditSurface = editSurface) => {
      updatePage((p) => {
        if (surface === 'blank') {
          return {
            ...p,
            blankElements: (p.blankElements ?? []).map((el) =>
              el.id === id ? ({ ...el, ...patch } as CanvasElement) : el,
            ),
          }
        }
        return {
          ...p,
          elements: (p.elements ?? []).map((el) => (el.id === id ? ({ ...el, ...patch } as CanvasElement) : el)),
        }
      })
    },
    [updatePage, editSurface],
  )

  const addElement = useCallback(
    (el: CanvasElement, surface: EditSurface = editSurface) => {
      updatePage((p) =>
        surface === 'blank'
          ? { ...p, blankElements: [...(p.blankElements ?? []), el] }
          : { ...p, elements: [...(p.elements ?? []), el] },
      )
      setEditSurface(surface)
      setSelectedId(el.id)
    },
    [updatePage, editSurface],
  )

  const removeSelected = useCallback(() => {
    if (!selectedId) return
    updatePage((p) =>
      editSurface === 'blank'
        ? { ...p, blankElements: (p.blankElements ?? []).filter((e) => e.id !== selectedId) }
        : { ...p, elements: (p.elements ?? []).filter((e) => e.id !== selectedId) },
    )
    setSelectedId(null)
  }, [selectedId, updatePage, editSurface])

  const bringForward = useCallback(() => {
    if (!selected) return
    updateElement(selected.id, { zIndex: selected.zIndex + 1 })
  }, [selected, updateElement])

  const sendBackward = useCallback(() => {
    if (!selected) return
    updateElement(selected.id, { zIndex: Math.max(0, selected.zIndex - 1) })
  }, [selected, updateElement])

  const addText = () => {
    setEditSurface('blank')
    addElement(createEmptyText(), 'blank')
  }
  const addImageFrame = (src: string | null = null) =>
    addElement(src ? createEmptyImage(src) : createPhotoFrame(), editSurface)

  const placePhotoOnSelectionOrNew = (src: string) => {
    const isDecorClip =
      (src.includes('/cutouts/') && src.endsWith('.png')) ||
      (src.includes('/stock/') && src.endsWith('.svg'))
    const isScan = src.includes('/scans/')
    const isDecor = isDecorClip

    // Decor always lands on the blank reconstruction page
    if (isDecor) {
      if (selected?.type === 'image' && editSurface === 'blank') {
        updateElement(selected.id, { src, objectFit: 'contain', isFrame: false }, 'blank')
        return
      }
      addElement(createEmptyImage(src), 'blank')
      return
    }

  // Stock photos from decor library also prefer blank page
  if (src.includes('/stock/') && !isDecor) {
    if (selected?.type === 'image' && editSurface === 'blank') {
      updateElement(selected.id, { src, objectFit: 'cover', isFrame: true }, 'blank')
      return
    }
    addElement(createEmptyImage(src), 'blank')
    return
  }

  // Prefer replacing selected frame / image on active surface
  if (selected?.type === 'image') {
      updateElement(
        selected.id,
        {
          src,
          objectFit: isScan ? 'fill' : 'cover',
          isFrame: selected.isFrame || !isScan,
        } as Partial<CanvasElement>,
        editSurface,
      )
      return
    }

    const frames = activeElements.filter((e) => e.type === 'image' && e.isFrame) as import('../types').ImageElement[]
    const empty = frames.find((f) => !f.src)
    const target = empty ?? frames[0]
    if (target && !isScan) {
      updateElement(target.id, { src, objectFit: 'cover' }, editSurface)
      setSelectedId(target.id)
      return
    }

    addImageFrame(src)
  }

  const addPage = () => {
    setDoc((d) => {
      if (!d) return d
      const pages = [...d.pages]
      pages.splice(pageIndex + 1, 0, createBlankPage(`Page ${pages.length + 1}`))
      return { ...d, pages }
    })
    setPageIndex((i) => i + 1)
    setSelectedId(null)
  }

  const deletePage = () => {
    if (!doc || doc.pages.length <= 1) return
    const len = doc.pages.length
    setDoc((d) => (d ? { ...d, pages: d.pages.filter((_, i) => i !== pageIndex) } : d))
    setPageIndex((i) => Math.max(0, Math.min(i, len - 2)))
    setSelectedId(null)
  }

  const movePage = (from: number, to: number) => {
    if (!doc || to < 0 || to >= doc.pages.length) return
    setDoc((d) => {
      if (!d) return d
      const pages = [...d.pages]
      const [item] = pages.splice(from, 1)
      pages.splice(to, 0, item)
      return { ...d, pages }
    })
    setPageIndex(to)
  }

  const resetToSeed = () => {
    if (!confirm('Reset to the shared starter booklet? Your saved layout will be replaced.')) return
    void (async () => {
      const shared = await loadSharedDefault()
      const next = shared ?? createSeedDocument(libraryPhotos[0]?.src ?? null)
      setDoc(next)
      setPageIndex(0)
      setSelectedId(null)
      setEditSurface('blank')
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    })()
  }

  const exportDocument = () => {
    if (!doc) return
    const payload = JSON.stringify({ ...doc, updatedAt: new Date().toISOString() }, null, 2)
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `memorial-booklet-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importDocument = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json,.json'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        const parsed = JSON.parse(text) as MemorialDocument
        if (!parsed?.pages || !Array.isArray(parsed.pages)) {
          alert('That file does not look like a memorial booklet save.')
          return
        }
        const next = migrateDocument(parsed)
        setDoc(next)
        setPageIndex(0)
        setSelectedId(null)
        setEditSurface('blank')
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        alert('Could not read that save file.')
      }
    }
    input.click()
  }

  const renamePage = (name: string) => updatePage((p) => ({ ...p, name }))

  const setPageBackground = (background: string) =>
    updatePage((p) =>
      editSurface === 'blank' ? { ...p, blankBackground: background } : { ...p, background },
    )

  const duplicateSelected = () => {
    if (!selected) return
    const copy = { ...selected, id: uid(), x: selected.x + 20, y: selected.y + 20, zIndex: selected.zIndex + 1 }
    addElement(copy as CanvasElement)
  }

  const selectOnSurface = (surface: EditSurface, id: string | null) => {
    setEditSurface(surface)
    setSelectedId(id)
  }

  return {
    ready,
    doc,
    setDoc,
    page,
    pageIndex,
    setPageIndex,
    selectedId,
    setSelectedId,
    selected,
    editSurface,
    setEditSurface,
    selectOnSurface,
    zoom,
    setZoom,
    updateElement,
    updatePage,
    addElement,
    removeSelected,
    bringForward,
    sendBackward,
    addText,
    addImageFrame,
    placePhotoOnSelectionOrNew,
    addPage,
    deletePage,
    movePage,
    resetToSeed,
    exportDocument,
    importDocument,
    renamePage,
    setPageBackground,
    duplicateSelected,
  }
}

export type DocumentStore = ReturnType<typeof useDocumentStore>
