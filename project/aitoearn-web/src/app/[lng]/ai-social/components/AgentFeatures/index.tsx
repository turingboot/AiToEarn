'use client'

import type { FC } from 'react'
import {
  BadgeCheck,
  Blocks,
  ClipboardList,
  FileStack,
  GalleryHorizontalEnd,
  History,
  LogIn,
  MessageSquareText,
  MousePointerClick,
  PlugZap,
  UploadCloud,
} from 'lucide-react'
import { cn } from '@/utils/className'

interface AgentFeaturesProps {
  className?: string
}

const featureGroups = [
  {
    title: '任务输入',
    description: '输入内容需求，并添加生成时需要参考的素材。',
    items: [
      { icon: ClipboardList, title: '需求描述', desc: '输入一句话需求，作为创建任务的主要内容。' },
      { icon: UploadCloud, title: '素材上传', desc: '支持在输入区添加图片或视频，并可拖拽上传。' },
      { icon: FileStack, title: '模板带入', desc: '模板可把提示词和参考素材带回输入区。' },
    ],
  },
  {
    title: '任务处理',
    description: '沿用现有登录、积分和任务会话流程。',
    items: [
      { icon: LogIn, title: '登录校验', desc: '未登录时会保存待处理任务并跳转登录。' },
      { icon: BadgeCheck, title: '积分校验', desc: '积分不足时会打开余额提示。' },
      { icon: MessageSquareText, title: '进入会话', desc: '通过任务会话页继续查看生成过程。' },
    ],
  },
  {
    title: '结果入口',
    description: '继续查看任务、素材和频道连接状态。',
    items: [
      { icon: History, title: '任务记录', desc: '查看历史任务和处理进度。' },
      { icon: GalleryHorizontalEnd, title: '生成素材', desc: '显示 AI 生成素材，并支持打开预览。' },
      { icon: PlugZap, title: '频道连接', desc: '从输入区进入频道连接列表，管理发布账号。' },
    ],
  },
]

const sideMetrics = [
  { label: '输入', value: '需求' },
  { label: '素材', value: '上传' },
  { label: '记录', value: '查看' },
]

const AgentFeatures: FC<AgentFeaturesProps> = ({ className }) => {
  return (
    <section className={cn('px-4 py-10 md:px-6 lg:px-8', className)}>
      <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
            <Blocks className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">智能编排能力</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            将需求输入、素材上传、任务会话和记录入口放在同一条操作路径中。
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {sideMetrics.map(metric => (
              <div key={metric.label} className="rounded-md border border-border bg-background px-3 py-2">
                <div className="text-base font-semibold text-foreground">{metric.value}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">{metric.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-md border border-dashed border-primary/30 bg-primary/5 p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <MousePointerClick className="h-4 w-4 text-primary" />
              快速开始
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              输入内容需求，按需添加参考素材，系统会进入任务会话继续处理。
            </p>
          </div>
        </aside>

        <div className="grid gap-4 md:grid-cols-3">
          {featureGroups.map(group => (
            <div key={group.title} className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <h3 className="text-base font-semibold text-foreground">{group.title}</h3>
              <p className="mt-1 min-h-10 text-xs leading-5 text-muted-foreground">{group.description}</p>

              <div className="mt-4 space-y-3">
                {group.items.map(item => (
                  <div key={item.title} className="rounded-md border border-border/80 bg-background p-3 transition-colors hover:border-primary/35">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <item.icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium text-foreground">{item.title}</span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-card px-4 py-3 lg:col-span-2">
          <div className="flex flex-col gap-3 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-4 w-4 text-primary" />
              <span>输入需求并添加参考素材后，即可进入任务会话继续处理。</span>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">FlowMint workspace</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AgentFeatures
