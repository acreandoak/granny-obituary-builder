import type { DocumentStore } from '../hooks/useDocumentStore'

type Props = {
  store: DocumentStore
}

function previewSrc(page: DocumentStore['doc']['pages'][number]): string | null {
  const img = page.elements.find((e) => e.type === 'image' && e.src)
  return img && img.type === 'image' ? img.src : null
}

export function PageRail({ store }: Props) {
  const { doc, pageIndex, setPageIndex, movePage, setSelectedId } = store

  return (
    <div className="page-rail">
      {doc.pages.map((p, i) => {
        const src = previewSrc(p)
        return (
          <button
            key={p.id}
            type="button"
            className={`page-thumb ${i === pageIndex ? 'active' : ''}`}
            onClick={() => {
              setPageIndex(i)
              setSelectedId(null)
            }}
          >
            <div
              className="page-thumb-preview"
              style={{
                backgroundColor: p.background,
                backgroundImage: src ? `url(${src})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
              }}
            >
              <span className="page-thumb-num">{i + 1}</span>
              <span className="page-thumb-actions">
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()
                    movePage(i, i - 1)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.stopPropagation()
                      movePage(i, i - 1)
                    }
                  }}
                  title="Move earlier"
                >
                  ←
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()
                    movePage(i, i + 1)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.stopPropagation()
                      movePage(i, i + 1)
                    }
                  }}
                  title="Move later"
                >
                  →
                </span>
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
