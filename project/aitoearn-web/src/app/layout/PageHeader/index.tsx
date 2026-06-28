/**
 * PageHeader - 内容区页头（桌面端）
 * 展示当前页面标题，强化「顶栏 + 左栏 + 页头」的层级结构。
 * 标题来自路由，纯展示；不影响页面自身的工具栏与功能。
 */
'use client'

import { useCurrentPageTitle, useNavigationLogic } from '@/app/layout/shared'

export function PageHeader() {
  const { isAuthPage } = useNavigationLogic()
  const title = useCurrentPageTitle()

  if (isAuthPage || !title)
    return null

  return (
    <div className="hidden shrink-0 items-center justify-between border-b border-border bg-background px-6 py-3 md:flex">
      <div className="flex items-center gap-2.5">
        <span className="h-4 w-1 rounded-full bg-primary" />
        <h2 className="text-base font-semibold leading-tight text-foreground">{title}</h2>
      </div>
    </div>
  )
}
