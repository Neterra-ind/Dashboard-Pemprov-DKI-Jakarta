import { Newspaper } from 'lucide-react'
import type { JenisSumber } from '@/types'
import { cn } from '@/lib/utils'

export function PlatformBadge({ size = 'md' }: { platform: JenisSumber; size?: 'sm' | 'md' }) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-lg bg-primary-soft font-bold text-primary',
        size === 'sm' ? 'h-6 w-6 text-[10px]' : 'h-8 w-8 text-xs',
      )}
      title="Media Online"
    >
      <Newspaper className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
    </span>
  )
}
