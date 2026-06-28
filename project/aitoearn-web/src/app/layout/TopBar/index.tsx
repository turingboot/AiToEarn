/**
 * TopBar - 全局顶栏（桌面端）
 * 左侧品牌区（宽度与侧栏对齐）+ 中部面包屑/页面标题 + 右侧用户菜单。
 * 仅做布局承载，复用既有 UserDropdownMenu 等组件，不改动任何业务逻辑。
 */
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useShallow } from 'zustand/shallow'
import { UserDropdownMenu } from '@/app/layout/LayoutSidebar/components'
import { BRAND_TITLE, BrandWordmark, useCurrentPageTitle, useNavigationLogic } from '@/app/layout/shared'
import logo from '@/assets/images/logo.png'
import { useSettingsModalStore } from '@/store/settingsModal'
import { useUserStore } from '@/store/user'
import { cn } from '@/utils/className'

export default function TopBar() {
  const { isAuthPage } = useNavigationLogic()
  const { openSettings } = useSettingsModalStore()
  const title = useCurrentPageTitle()
  const collapsed = useUserStore(useShallow(state => state.sidebarCollapsed))

  if (isAuthPage)
    return null

  return (
    <header className="hidden h-14 w-full shrink-0 items-center border-b border-border bg-card md:flex">
      {/* 品牌区：宽度与左侧栏对齐 */}
      <div
        className={cn(
          'flex h-full items-center border-r border-border transition-all duration-300',
          collapsed ? 'w-[68px] min-w-[68px] justify-center' : 'w-[240px] min-w-[240px] px-4',
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-foreground no-underline hover:opacity-85"
          data-testid="topbar-logo-link"
        >
          <Image src={logo} alt={BRAND_TITLE} width={28} height={28} />
          {!collapsed && <BrandWordmark as="span" size="sidebar" />}
        </Link>
      </div>

      {/* 面包屑 / 当前页面标题 */}
      <div className="flex min-w-0 flex-1 items-center gap-2 px-5">
        <span className="hidden truncate text-sm text-muted-foreground lg:inline">{BRAND_TITLE}</span>
        {title && (
          <>
            <span className="hidden text-muted-foreground/40 lg:inline">/</span>
            <span className="truncate text-sm font-medium text-foreground">{title}</span>
          </>
        )}
      </div>

      {/* 右侧：用户菜单（自侧栏底部迁移而来） */}
      <div className="flex h-full items-center gap-1 px-3">
        <div className="w-[200px]">
          <UserDropdownMenu collapsed={false} onOpenSettings={openSettings} />
        </div>
      </div>
    </header>
  )
}
