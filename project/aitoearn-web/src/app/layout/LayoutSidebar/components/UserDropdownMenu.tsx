'use client'

import type { SidebarCommonProps } from '../types'
import type { SettingsTab } from '@/store/settingsModal'
import {
  BookOpen,
  ChevronRight,
  FileText,
  Puzzle,
  ScrollText,
  Settings,
  Shield,
  SlidersHorizontal,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useTransClient } from '@/app/i18n/client'
import { DOCS_URL, GITHUB_REPO } from '@/app/layout/shared/constants'
import { useGitHubStars } from '@/app/layout/shared/hooks/useGitHubStars'
import { PluginModal } from '@/components/Plugin'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useConfigManagerDialogStore } from '@/store/configManagerDialog'
import { usePluginStore } from '@/store/plugin'
import { useUserStore } from '@/store/user'
import { navigateToLogin } from '@/utils/auth'
import { cn } from '@/utils/className'
import { getOssUrl } from '@/utils/oss'

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={cn('h-4 w-4', className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

export interface UserDropdownMenuProps extends SidebarCommonProps {
  onOpenSettings: (defaultTab?: SettingsTab) => void
}

function MenuItem({
  icon: Icon,
  label,
  rightContent,
  onClick,
  href,
  external,
  className,
}: {
  icon: React.ElementType
  label: string
  rightContent?: React.ReactNode
  onClick?: () => void
  href?: string
  external?: boolean
  className?: string
}) {
  const content = (
    <>
      <Icon size={16} className="shrink-0" />
      <span className="flex-1 text-left">{label}</span>
      {rightContent}
    </>
  )

  const baseClassName = cn(
    'flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent',
    className,
  )

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={baseClassName}>
          {content}
        </a>
      )
    }
    return (
      <Link href={href} className={baseClassName}>
        {content}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={cn(baseClassName, 'border-none bg-transparent')}>
      {content}
    </button>
  )
}

function LoggedInMenuContent({
  onOpenSettings,
  onClose,
}: {
  onOpenSettings: (defaultTab?: SettingsTab) => void
  onClose: () => void
}) {
  const { t } = useTransClient(['common'])
  const userInfo = useUserStore(state => state.userInfo)
  const starCount = useGitHubStars()
  const openConfigDialog = useConfigManagerDialogStore(state => state.openDialog)
  const pluginModalVisible = usePluginStore(state => state.pluginModalVisible)
  const openPluginModal = usePluginStore(state => state.openPluginModal)
  const closePluginModal = usePluginStore(state => state.closePluginModal)

  const handleOpenSettings = () => {
    onOpenSettings()
    onClose()
  }

  const handleOpenConfig = () => {
    openConfigDialog('sidebar')
    onClose()
  }

  const handleOpenPlugin = () => {
    openPluginModal()
    onClose()
  }

  return (
    <>
      <div className="flex flex-col gap-1 p-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="h-10 w-10 shrink-0 border border-border">
            <AvatarImage
              src={getOssUrl(userInfo?.avatar) || ''}
              alt={userInfo?.name || t('common:unknownUser')}
            />
            <AvatarFallback className="bg-muted-foreground font-semibold text-background">
              {userInfo?.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium text-foreground" data-testid="sidebar-user-name">
              {userInfo?.name || t('common:unknownUser')}
            </span>
          </div>
        </div>

        <div className="my-1 h-px bg-border" />

        <MenuItem
          icon={GitHubIcon}
          label="GitHub"
          rightContent={<span className="text-xs text-muted-foreground">{starCount}</span>}
          href={`https://github.com/${GITHUB_REPO}`}
          external
        />

        <div className="my-1 h-px bg-border" />

        <MenuItem
          icon={SlidersHorizontal}
          label={t('common:configManagement')}
          onClick={handleOpenConfig}
        />
        <MenuItem icon={Puzzle} label={t('common:plugin')} onClick={handleOpenPlugin} />

        <div className="my-1 h-px bg-border" />

        <div className="group/docs relative">
          <div className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent">
            <BookOpen size={16} className="shrink-0" />
            <span className="flex-1 text-left">{t('common:documents')}</span>
            <ChevronRight size={14} className="text-muted-foreground" />
          </div>
          <div className="invisible absolute left-full top-0 z-50 pl-1 opacity-0 transition-all group-hover/docs:visible group-hover/docs:opacity-100">
            <div className="w-48 rounded-md border bg-popover p-1 shadow-md">
              <MenuItem icon={FileText} label={t('common:helpDocs')} href={DOCS_URL} external />
              <MenuItem icon={FileText} label={t('common:pluginGuide')} href="/websit/plugin-guide" />
              <MenuItem icon={Shield} label={t('common:privacyPolicy')} href="/websit/privacy-policy" />
              <MenuItem icon={ScrollText} label={t('common:termsOfService')} href="/websit/terms-of-service" />
            </div>
          </div>
        </div>

        <div className="my-1 h-px bg-border" />

        <div data-testid="sidebar-settings-entry">
          <MenuItem icon={Settings} label={t('common:settings')} onClick={handleOpenSettings} />
        </div>
      </div>
      <PluginModal visible={pluginModalVisible} onClose={closePluginModal} />
    </>
  )
}

export function UserDropdownMenu({ collapsed, onOpenSettings }: UserDropdownMenuProps) {
  const token = useUserStore(state => state.token)
  const userInfo = useUserStore(state => state.userInfo)
  const hasHydrated = useUserStore(state => state._hasHydrated)
  const { t } = useTransClient('common')
  const [open, setOpen] = useState(false)

  if (!hasHydrated) {
    if (collapsed) {
      return <Skeleton className="h-9 w-9 rounded-md" />
    }
    return <Skeleton className="mt-2 h-9 w-full rounded-md" />
  }

  if (!token) {
    const handleLogin = () => navigateToLogin()

    if (collapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleLogin} size="icon" className="h-9 w-9" data-testid="sidebar-login-btn">
                <span className="text-sm font-semibold">In</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{t('login')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return (
      <Button onClick={handleLogin} className="mt-2 w-full" data-testid="sidebar-login-btn">
        {t('login')}
      </Button>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center rounded-lg transition-colors hover:bg-accent',
        collapsed ? 'p-1' : 'gap-2 px-2 py-1.5',
      )}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <TooltipProvider>
          <Tooltip>
            <PopoverTrigger asChild>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onOpenSettings('profile')
                  }}
                  data-testid="sidebar-user-trigger"
                  className={cn(
                    'relative flex cursor-pointer items-center border-none bg-transparent flex-1',
                    collapsed ? 'justify-center' : 'gap-2',
                  )}
                >
                  <Avatar className="h-8 w-8 shrink-0 border border-border">
                    <AvatarImage
                      src={getOssUrl(userInfo?.avatar) || ''}
                      alt={userInfo?.name || t('unknownUser')}
                    />
                    <AvatarFallback className="bg-muted-foreground font-semibold text-background">
                      {userInfo?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>

                  {!collapsed && (
                    <div className="flex min-w-0 flex-1 flex-col items-start">
                      <span className="w-full truncate text-left text-sm font-medium text-foreground">
                        {userInfo?.name || t('unknownUser')}
                      </span>
                    </div>
                  )}
                </button>
              </TooltipTrigger>
            </PopoverTrigger>
            {collapsed && !open && (
              <TooltipContent side="right">
                <p>{t('profile')}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <PopoverContent
          side={collapsed ? 'right' : 'top'}
          align={collapsed ? 'end' : 'start'}
          className="w-64 p-0"
          sideOffset={4}
          data-testid="sidebar-user-menu"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <LoggedInMenuContent onOpenSettings={onOpenSettings} onClose={() => setOpen(false)} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
