'use client'

import { pages } from '@/lib/magazine-data'
import { cn } from '@/lib/utils'

type ThumbnailsProps = {
  activeIndex: number
  onSelect: (pageIndex: number) => void
}

export function Thumbnails({ activeIndex, onSelect }: ThumbnailsProps) {
  return (
    <nav aria-label="Índice de páginas" className="w-full">
      <ul className="flex items-end gap-2 overflow-x-auto px-4 py-3">
        {pages.map((page, index) => {
          const isActive = index === activeIndex
          return (
            <li key={page.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'group flex flex-col items-center gap-1.5 rounded-md p-1 outline-none transition focus-visible:ring-2 focus-visible:ring-ring',
                )}
              >
                <span
                  className={cn(
                    'relative flex aspect-[1/1.414] w-10 items-center justify-center overflow-hidden rounded-[3px] border bg-card text-[9px] font-medium text-muted-foreground transition',
                    isActive
                      ? 'border-accent ring-2 ring-accent/30'
                      : 'border-border group-hover:border-foreground/40',
                  )}
                >
                  {page.src ? (
                    <img src={page.src} alt="" className="h-full w-full object-cover" />
                  ) : (
                    page.id
                  )}
                </span>
                <span
                  className={cn(
                    'max-w-12 truncate text-[10px] transition',
                    isActive ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {page.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
