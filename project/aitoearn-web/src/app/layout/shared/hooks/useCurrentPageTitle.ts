/**
 * useCurrentPageTitle - 根据当前路由解析页面标题（用于全局顶栏面包屑与内容页头）
 * 复用 routerData 的 translationKey + route 命名空间，纯展示，不涉及任何业务逻辑。
 */
'use client'

import type { IRouterDataItem } from '@/app/layout/routerData'
import { useTransClient } from '@/app/i18n/client'
import { routerData } from '@/app/layout/routerData'
import { useNavigationLogic } from './useNavigationLogic'

function findByPath(items: IRouterDataItem[], path: string): IRouterDataItem | undefined {
  for (const item of items) {
    if (item.path === path)
      return item
    if (item.children) {
      const found = findByPath(item.children, path)
      if (found)
        return found
    }
  }
  return undefined
}

export function useCurrentPageTitle(): string {
  const { t } = useTransClient('route')
  const { currRouter } = useNavigationLogic()
  const item = findByPath(routerData, currRouter)
  return item ? t(item.translationKey) : ''
}
