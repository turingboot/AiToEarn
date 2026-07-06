/**
 * MyChannelsEntry - 我的频道入口组件
 */

'use client'

import type { SidebarCommonProps } from '../../types'
import { Tv } from 'lucide-react'
import { useTransClient } from '@/app/i18n/client'
import { useChannelManagerStore } from '@/components/ChannelManager'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/utils/className'

export function MyChannelsEntry({ collapsed }: SidebarCommonProps) {
  const { t } = useTransClient('account')
  const openModal = useChannelManagerStore(state => state.openModal)

  const handleClick = () => {
    openModal()
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleClick}
            data-testid="sidebar-my-channels"
            className={cn(
              'group flex flex-1 cursor-pointer items-center rounded-lg text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              collapsed ? 'justify-center px-2 py-2' : 'justify-between px-3 py-2',
            )}
          >
            <div className="flex items-center gap-3">
              <Tv size={20} className="h-5 w-5 shrink-0 text-sidebar-foreground/70 transition-colors group-hover:text-sidebar-foreground" />
              {!collapsed && <span className="text-sm">{t('channelManager.myChannels')}</span>}
            </div>
          </button>
        </TooltipTrigger>
        {collapsed && (
          <TooltipContent side="right">
            <p>{t('channelManager.myChannels')}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}
