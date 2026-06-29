import { ImageIcon } from 'lucide-react'
import type { MagazinePage } from '@/lib/magazine-data'
import { cn } from '@/lib/utils'

type PageSlotProps = {
  page?: MagazinePage
  pageNumber?: number
  side: 'left' | 'right'
}

export function PageSlot({ page, pageNumber, side }: PageSlotProps) {
  if (!page) {
    return <div className="h-full w-full bg-muted" aria-hidden />
  }

  return (
    <div
      className={cn(
        'relative flex h-full w-full flex-col overflow-hidden bg-card text-card-foreground',
        side === 'left'
          ? 'shadow-[inset_-18px_0_28px_-22px_rgba(0,0,0,0.55)]'
          : 'shadow-[inset_18px_0_28px_-22px_rgba(0,0,0,0.55)]',
      )}
    >
      {page.src ? (
        <img src={page.src} alt={page.label} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 border-2 border-dashed border-border bg-muted/50 p-6">
          <span className="flex size-12 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm">
            <ImageIcon className="size-6" aria-hidden />
          </span>
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{page.label}</p>
            <p className="mt-1 font-mono text-[11px] leading-relaxed text-muted-foreground/70 text-balance">
              {page.prompt}
            </p>
          </div>
        </div>
      )}

      {pageNumber ? (
        <span
          className={cn(
            'pointer-events-none absolute bottom-3 text-[11px] font-medium text-muted-foreground',
            side === 'left' ? 'left-4' : 'right-4',
          )}
        >
          {pageNumber}
        </span>
      ) : null}
    </div>
  )
}
