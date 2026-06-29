import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react'
import { magazineMeta, pages } from '@/lib/magazine-data'
import { cn } from '@/lib/utils'
import { PageSlot } from './PageSlot'
import { Thumbnails } from './Thumbnails'
import logoSinFondo from '@/assets/laran-logo-sin-fondo.png'

type Leaf = {
  index: number
  frontPageIndex: number
  backPageIndex: number | null
}

function buildSpreadLeaves(): Leaf[] {
  const leaves: Leaf[] = []
  for (let i = 0; i < pages.length; i += 2) {
    leaves.push({
      index: i / 2,
      frontPageIndex: i,
      backPageIndex: i + 1 < pages.length ? i + 1 : null,
    })
  }
  return leaves
}

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const update = () => setIsMobile(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [breakpoint])
  return isMobile
}

export function Flipbook() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [focusMode, setFocusMode] = useState(false)

  const spreadLeaves = useMemo(buildSpreadLeaves, [])
  const isMobile = useIsMobile()
  const spread = !isMobile

  const maxLocation = spread ? spreadLeaves.length : pages.length - 1
  const [location, setLocation] = useState(0)

  useEffect(() => {
    setLocation((l) => Math.min(l, maxLocation))
  }, [maxLocation])

  const isAtStart = location === 0
  const isAtEnd = location === maxLocation

  const goNext = useCallback(() => {
    setLocation((l) => Math.min(l + 1, maxLocation))
  }, [maxLocation])

  const goPrev = useCallback(() => {
    setLocation((l) => Math.max(l - 1, 0))
  }, [])

  const goToPageIndex = useCallback(
    (pageIndex: number) => {
      if (spread) {
        setLocation(Math.min(Math.floor(pageIndex / 2), maxLocation))
      } else {
        setLocation(Math.min(pageIndex, maxLocation))
      }
    },
    [spread, maxLocation],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) setFocusMode(false)
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  const toggleFocus = useCallback(() => {
    if (!focusMode) {
      setFocusMode(true)
      containerRef.current?.requestFullscreen().catch(() => {})
    } else {
      setFocusMode(false)
      if (document.fullscreenElement) document.exitFullscreen()
    }
  }, [focusMode])

  const activeIndex = spread ? Math.min(location * 2, pages.length - 1) : location

  const indicatorText = spread
    ? isAtStart
      ? `Portada · ${pages[0].label}`
      : isAtEnd
        ? `Contraportada · ${pages[pages.length - 1].label}`
        : `Páginas ${location * 2} – ${Math.min(location * 2 + 1, pages.length)} de ${pages.length}`
    : `Página ${location + 1} de ${pages.length} · ${pages[location].label}`

  const leaves: Leaf[] = spread
    ? spreadLeaves
    : pages.map((_, i) => ({ index: i, frontPageIndex: i, backPageIndex: null }))
  const numLeaves = leaves.length

  const bookHeight = focusMode ? 'min(78vh, 680px)' : 'min(62vh, 520px)'

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex w-full flex-col items-center gap-6 bg-background px-4 py-6',
        focusMode && 'h-screen justify-center',
      )}
    >

      {/* Header: oculto en modo enfoque */}
      {!focusMode && (
        <header className="flex flex-col items-center gap-2 text-center">
          <img src={logoSinFondo} alt="Laran" className="h-14 w-auto object-contain" />
          <p className="font-heading text-xs uppercase tracking-[0.35em] text-muted-foreground">
            {magazineMeta.issue} · {magazineMeta.date}
          </p>
        </header>
      )}

      {/* Visor del catálogo */}
      <div className="flex w-full items-center justify-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={goPrev}
          disabled={isAtStart}
          aria-label="Página anterior"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30 sm:size-10"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>

        <div
          className="relative shrink-0"
          style={{
            height: bookHeight,
            aspectRatio: spread ? '2 / 1.414' : '1 / 1.414',
            perspective: '2400px',
          }}
        >
          <div className="relative h-full w-full" style={{ transformStyle: 'preserve-3d' }}>
            {spread ? (
              <>
                <div className="absolute left-0 top-0 h-full w-1/2 rounded-l-sm bg-muted shadow-md" aria-hidden />
                <div className="absolute right-0 top-0 h-full w-1/2 rounded-r-sm bg-muted shadow-md" aria-hidden />
              </>
            ) : (
              <div className="absolute inset-0 rounded-sm bg-muted shadow-md" aria-hidden />
            )}

            {leaves.map((leaf) => {
              const flipped = leaf.index < location
              const zIndex = flipped ? leaf.index + 1 : numLeaves - leaf.index
              return (
                <div
                  key={leaf.index}
                  className={cn(
                    'absolute top-0 h-full origin-left transition-transform duration-700 ease-in-out',
                    spread ? 'right-0 w-1/2' : 'inset-x-0',
                  )}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: flipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                    zIndex,
                  }}
                >
                  <div
                    className={cn('absolute inset-0 overflow-hidden', spread ? 'rounded-r-sm' : 'rounded-sm')}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <PageSlot
                      page={pages[leaf.frontPageIndex]}
                      pageNumber={leaf.frontPageIndex + 1}
                      side="right"
                    />
                  </div>

                  {spread ? (
                    <div
                      className="absolute inset-0 overflow-hidden rounded-l-sm"
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      {leaf.backPageIndex !== null ? (
                        <PageSlot page={pages[leaf.backPageIndex]} pageNumber={leaf.backPageIndex + 1} side="left" />
                      ) : (
                        <div className="h-full w-full bg-muted" />
                      )}
                    </div>
                  ) : (
                    <div
                      className="absolute inset-0 rounded-sm bg-muted"
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      aria-hidden
                    />
                  )}
                </div>
              )
            })}

            <button
              type="button"
              onClick={goPrev}
              disabled={isAtStart}
              aria-label="Página anterior"
              className="absolute inset-y-0 left-0 w-1/2 cursor-w-resize disabled:cursor-default"
              style={{ zIndex: numLeaves + 10 }}
            />
            <button
              type="button"
              onClick={goNext}
              disabled={isAtEnd}
              aria-label="Página siguiente"
              className="absolute inset-y-0 right-0 w-1/2 cursor-e-resize disabled:cursor-default"
              style={{ zIndex: numLeaves + 10 }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={isAtEnd}
          aria-label="Página siguiente"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30 sm:size-10"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>

      {/* Indicador de página + botón de enfoque */}
      <div className="flex items-center gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {indicatorText}
        </p>
        <button
          type="button"
          onClick={toggleFocus}
          aria-label={focusMode ? 'Salir del modo enfoque' : 'Enfocar catálogo'}
          title={focusMode ? 'Salir del modo enfoque (Esc)' : 'Enfocar catálogo'}
          className="flex size-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition hover:border-accent hover:text-accent"
        >
          {focusMode ? (
            <Minimize2 className="size-3.5" aria-hidden />
          ) : (
            <Maximize2 className="size-3.5" aria-hidden />
          )}
        </button>
      </div>

      {/* Thumbnails: ocultas en modo enfoque */}
      {!focusMode && (
        <div className="w-full max-w-3xl rounded-lg border border-border bg-card">
          <Thumbnails activeIndex={activeIndex} onSelect={goToPageIndex} />
        </div>
      )}
    </div>
  )
}
