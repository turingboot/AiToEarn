/**
 * 路由/导航数据配置
 * 包含开源版保留导航项的图标、路径、翻译键等信息。
 */

export interface IRouterDataItem {
  // 导航标题
  name: string
  // 翻译键
  translationKey: string
  // 跳转链接
  path?: string
  // 图标
  icon?: React.ReactNode
  // 子导航
  children?: IRouterDataItem[]
}

export function FlowSidebarIcon({
  variant,
}: {
  variant: 'content' | 'ai' | 'publish' | 'assets' | 'history'
}) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 20 20',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true,
  }

  if (variant === 'content') {
    return (
      <svg {...common}>
        <path d="M4.5 8.2 10 4l5.5 4.2v6.6a1.7 1.7 0 0 1-1.7 1.7H6.2a1.7 1.7 0 0 1-1.7-1.7V8.2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M8 16.5v-4.4h4v4.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.7 6.3V3.8h2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    )
  }

  if (variant === 'ai') {
    return (
      <svg {...common}>
        <path d="M10 2.8v3.1M10 14.1v3.1M2.8 10h3.1M14.1 10h3.1" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
        <path d="M7.5 7.5 5.3 5.3M12.5 12.5l2.2 2.2M12.5 7.5l2.2-2.2M7.5 12.5l-2.2 2.2" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
        <path d="M10 7.1a2.9 2.9 0 1 1 0 5.8 2.9 2.9 0 0 1 0-5.8Z" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    )
  }

  if (variant === 'publish') {
    return (
      <svg {...common}>
        <path d="M10 13.4V3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="m6.5 7 3.5-3.5L13.5 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 11.8v3.7c0 .8.7 1.5 1.5 1.5h9c.8 0 1.5-.7 1.5-1.5v-3.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M6.2 11.5h7.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".55" />
      </svg>
    )
  }

  if (variant === 'assets') {
    return (
      <svg {...common}>
        <path d="M4.2 6.5 10 3.3l5.8 3.2-5.8 3.2-5.8-3.2Z" stroke="currentColor" strokeWidth="1.55" strokeLinejoin="round" />
        <path d="m4.2 10 5.8 3.2 5.8-3.2M4.2 13.5l5.8 3.2 5.8-3.2" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 9.7v3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".6" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path d="M15.7 10.7a5.8 5.8 0 1 1-1.9-4.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M15.7 4.5v3.8h-3.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.4 10.2h2.4l1.2-2.3 1.7 4.2.9-1.9h1.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export const routerData: IRouterDataItem[] = [
  {
    name: 'Content Management',
    translationKey: 'header.draftBox',
    path: '/',
    icon: <FlowSidebarIcon variant="content" />,
  },
  {
    name: 'AI Publish',
    translationKey: 'aiSocial',
    path: '/ai-social',
    icon: <FlowSidebarIcon variant="ai" />,
  },
  {
    name: 'Task History',
    translationKey: 'tasksHistory',
    path: '/tasks-history',
    icon: <FlowSidebarIcon variant="history" />,
  },
  {
    name: 'Agent Assets',
    translationKey: 'header.agentAssets',
    path: '/agent-assets',
    icon: <FlowSidebarIcon variant="assets" />,
  },
  {
    name: 'Publish',
    translationKey: 'accounts',
    path: '/accounts',
    icon: <FlowSidebarIcon variant="publish" />,
  },
]

export const visibleRouterData = routerData
