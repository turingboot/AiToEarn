import type { MobileNavItemProps } from '../types'
/**
 * MobileNavItem - 移动端单个导航项
 */
import { FileText } from 'lucide-react'
import Link from 'next/link'
import { useTransClient } from '@/app/i18n/client'
import { useGetClientLng } from '@/hooks/useSystem'
import { cn } from '@/utils/className'

export function MobileNavItem({
  path,
  href,
  translationKey,
  icon,
  isActive,
  onClose,
  className,
}: MobileNavItemProps) {
  const { t } = useTransClient('route')
  const lng = useGetClientLng()
  const fullPath = href ?? (path.startsWith('/') ? `/${lng}${path}` : `/${lng}/${path}`)

  return (
    <Link
      href={fullPath}
      onClick={onClose}
      data-testid={`mobile-nav-item-${translationKey}`}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all',
        'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        isActive && 'bg-primary text-primary-foreground shadow-sm shadow-primary/20',
        className,
      )}
    >
      <span className="flex items-center justify-center">
        {icon || <FileText size={20} />}
      </span>
      <span>{t(translationKey)}</span>
    </Link>
  )
}
