'use client'

import type { IRouterDataItem } from '../routerData'
import type { NavItemData } from './types'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useShallow } from 'zustand/shallow'
import { useNavigationLogic, useVisibleRouterData } from '@/app/layout/shared'
import { useUserStore } from '@/store/user'
import { cn } from '@/utils/className'
import { NavSection } from './components'
import { MyChannelsEntry } from './components/BottomSection/MyChannelsEntry'

function LayoutSidebar() {
  const { currRouter, isAuthPage } = useNavigationLogic()
  const visibleRoutes = useVisibleRouterData()

  const { sidebarCollapsed: collapsed, setSidebarCollapsed: setCollapsed } = useUserStore(
    useShallow(state => ({
      sidebarCollapsed: state.sidebarCollapsed,
      setSidebarCollapsed: state.setSidebarCollapsed,
    })),
  )

  const mapNavItem = (item: IRouterDataItem): NavItemData => ({
    path: item.path,
    translationKey: item.translationKey,
    icon: item.icon,
    children: item.children?.map(mapNavItem),
  })

  if (isAuthPage) {
    return null
  }

  const navItems = visibleRoutes.filter(item => item.translationKey !== 'myTasks').map(mapNavItem)

  return (
    <aside
      className={cn(
        'group hidden h-full flex-col border-r border-sidebar-border bg-sidebar px-3 py-4 transition-all duration-300 md:flex',
        collapsed ? 'w-[72px] min-w-[72px]' : 'w-[256px] min-w-[256px]',
      )}
    >
      <div className={cn('mb-3 flex items-center px-1', collapsed ? 'justify-center' : 'justify-end')}>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent bg-transparent text-muted-foreground/70 transition-colors hover:border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-foreground"
          data-testid="sidebar-toggle-btn"
          aria-label="toggle sidebar"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <NavSection items={navItems} currentRoute={currRouter!} collapsed={collapsed} />
      </div>

      <div className="flex-shrink-0">
        <div className="pb-1.5 flex flex-1">
          <MyChannelsEntry collapsed={collapsed} />
        </div>
      </div>
    </aside>
  )
}

export default LayoutSidebar
