/**
 * BrandWordmark - 布局区域复用的品牌字标
 */

import Image from 'next/image'
import tavixWordmark from '@/assets/images/tavix-wordmark.png'
import { cn } from '@/utils/className'

export const BRAND_TITLE = 'Tavix 拓效'

type BrandWordmarkTag = 'h1' | 'span'
type BrandWordmarkSize = 'sidebar' | 'mobile'

export interface BrandWordmarkProps {
  as?: BrandWordmarkTag
  size?: BrandWordmarkSize
  className?: string
}

const WORDMARK_IMAGE_CLASSNAME: Record<BrandWordmarkSize, string> = {
  sidebar: 'h-7 w-auto',
  mobile: 'h-6 w-auto',
}

export function BrandWordmark({
  as = 'span',
  size = 'sidebar',
  className,
}: BrandWordmarkProps) {
  const Component = as

  return (
    <Component
      className={cn(
        'm-0 inline-flex select-none items-center leading-none',
        className,
      )}
      aria-label={BRAND_TITLE}
    >
      <Image
        src={tavixWordmark}
        alt={BRAND_TITLE}
        priority={size === 'sidebar'}
        className={cn('block object-contain', WORDMARK_IMAGE_CLASSNAME[size])}
      />
    </Component>
  )
}
