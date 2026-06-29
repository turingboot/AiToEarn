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
import { BRAND_TITLE, BrandWordmark, useNavigationLogic } from '@/app/layout/shared'
import logo from '@/assets/images/logo.png'
import { useSettingsModalStore } from '@/store/settingsModal'
import { useUserStore } from '@/store/user'
import { cn } from '@/utils/className'

export default function TopBar() {
  const { isAuthPage } = useNavigationLogic()
  const { openSettings } = useSettingsModalStore()
  const collapsed = useUserStore(useShallow(state => state.sidebarCollapsed))

  if (isAuthPage)
    return null

  return (
    <header className="hidden h-16 w-full shrink-0 items-center border-b border-border bg-card/95 shadow-sm shadow-border/30 backdrop-blur md:flex">
      {/* 品牌区：宽度与左侧栏对齐 */}
      <div
        className={cn(
          'flex h-full items-center border-r border-border transition-all duration-300',
          collapsed ? 'w-[72px] min-w-[72px] justify-center' : 'w-[256px] min-w-[256px] px-5',
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
      <div className="flex min-w-0 flex-1 items-center gap-2 px-6" />

      {/* 右侧：用户菜单（自侧栏底部迁移而来） */}
      <div className="flex h-full items-center gap-1 px-4">
        <div className="w-[200px]">
          <UserDropdownMenu collapsed={false} onOpenSettings={openSettings} />
        </div>
      </div>
    </header>
  )
}
