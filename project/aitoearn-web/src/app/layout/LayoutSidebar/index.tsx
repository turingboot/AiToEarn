/**
 * LayoutSidebar - 左侧侧边栏布局组件
 * 包含 Logo、主导航、底部功能区（余额、插件）、用户下拉菜单
 * 支持展开/收缩两种状态
 */
'use client'

import type { IRouterDataItem } from '../routerData'
import type { NavItemData } from './types'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useShallow } from 'zustand/shallow'
import { useNavigationLogic, useVisibleRouterData } from '@/app/layout/shared'
import { useSettingsModalStore } from '@/store/settingsModal'
import { useUserStore } from '@/store/user'
import { cn } from '@/utils/className'
import { BottomSection, NavSection } from './components'
import { ConfigManagerEntry } from './components/BottomSection/ConfigManagerEntry'
import { MyChannelsEntry } from './components/BottomSection/MyChannelsEntry'

/**
 * 侧边栏主组件
 */
function LayoutSidebar() {
  const { currRouter, isAuthPage } = useNavigationLogic()
  const visibleRoutes = useVisibleRouterData()

  // 获取侧边栏状态和设置方法
  const { sidebarCollapsed: collapsed, setSidebarCollapsed: setCollapsed } = useUserStore(
    useShallow(state => ({
      sidebarCollapsed: state.sidebarCollapsed,
      setSidebarCollapsed: state.setSidebarCollapsed,
    })),
  )

  const { openSettings } = useSettingsModalStore()

  const mapNavItem = (item: IRouterDataItem): NavItemData => ({
    path: item.path,
    translationKey: item.translationKey,
    icon: item.icon,
    children: item.children?.map(mapNavItem),
  })

  // 首页、auth、websit 页面不显示侧边栏
  if (isAuthPage) {
    return null
  }

  // 转换路由数据为 NavSection 所需格式
  const navItems = visibleRoutes.filter(item => item.translationKey !== 'myTasks').map(mapNavItem)

  return (
    <aside
      className={cn(
        'group hidden h-full flex-col border-r border-sidebar-border bg-sidebar p-3 transition-all duration-300 md:flex',
        collapsed ? 'w-[68px] min-w-[68px]' : 'w-[240px] min-w-[240px]',
      )}
    >
      {/* 折叠开关（Logo 已迁移至全局顶栏） */}
      <div className={cn('mb-2 flex items-center px-1', collapsed ? 'justify-center' : 'justify-end')}>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-md border-none bg-transparent text-muted-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          data-testid="sidebar-toggle-btn"
          aria-label="toggle sidebar"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* 可滚动区域：主导航 */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <NavSection items={navItems} currentRoute={currRouter!} collapsed={collapsed} />
      </div>

      {/* 底部固定区域 - 不随滚动 */}
      <div className="flex-shrink-0">
        {/* 配置管理入口 */}
        <div className="pb-1 flex flex-1">
          <ConfigManagerEntry collapsed={collapsed} />
        </div>

        {/* 我的频道入口 */}
        <div className="pb-1 flex flex-1">
          <MyChannelsEntry collapsed={collapsed} />
        </div>

        {/* 底部功能区 */}
        <BottomSection collapsed={collapsed} onOpenSettings={openSettings} />
      </div>
    </aside>
  )
}

export default LayoutSidebar
