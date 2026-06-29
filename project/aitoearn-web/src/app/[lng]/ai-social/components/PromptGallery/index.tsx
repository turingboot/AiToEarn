'use client'

import type { PromptGalleryItem } from './types'
import {
  ArrowUpRight,
  CalendarClock,
  ClipboardCheck,
  FileText,
  Layers3,
  PanelsTopLeft,
} from 'lucide-react'
import { memo, useCallback, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/className'
import { VideoDetailModal } from './components'
import { promptGalleryAssets } from './data'

export interface ApplyPromptData {
  prompt: string
  materials?: string[]
  mode: 'edit' | 'generate'
}

export interface PromptGalleryProps {
  onApplyPrompt?: (data: ApplyPromptData) => void
  className?: string
}

const templateMeta = [
  {
    icon: PanelsTopLeft,
    scene: '探店内容',
    output: '提示词 + 参考素材',
    platforms: ['TikTok', 'Reels', '小红书'],
    accent: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  },
  {
    icon: Layers3,
    scene: '内容发现',
    output: '短视频提示词',
    platforms: ['小红书', '抖音', 'Instagram'],
    accent: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
  },
  {
    icon: CalendarClock,
    scene: '餐饮推广',
    output: '视频生成提示词',
    platforms: ['TikTok', 'Facebook', 'Threads'],
    accent: 'bg-slate-500/10 text-slate-700 dark:text-slate-300',
  },
]

const PromptGallery = memo(({ onApplyPrompt, className }: PromptGalleryProps) => {
  const [selectedItem, setSelectedItem] = useState<PromptGalleryItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const promptGalleryItems = useMemo<PromptGalleryItem[]>(
    () =>
      promptGalleryAssets.map(asset => ({
        ...asset,
        title: asset.title,
        prompt: asset.prompt,
      })),
    [],
  )

  const handleTemplateClick = useCallback((item: PromptGalleryItem) => {
    setSelectedItem(item)
    setModalOpen(true)
  }, [])

  const handleModalClose = useCallback((open: boolean) => {
    setModalOpen(open)
    if (!open) {
      setTimeout(() => setSelectedItem(null), 300)
    }
  }, [])

  const handleApplyPrompt = useCallback(
    (data: { prompt: string, materials?: string[] }) => {
      onApplyPrompt?.({
        prompt: data.prompt,
        materials: data.materials,
        mode: 'generate',
      })
    },
    [onApplyPrompt],
  )

  return (
    <section className="px-4 py-10 md:px-6 lg:px-8">
      <div className={cn('mx-auto w-full max-w-6xl', className)}>
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <ClipboardCheck className="h-3.5 w-3.5" />
              常用模板
            </div>
            <h2 className="text-2xl font-semibold text-foreground md:text-3xl">选择模板快速填入输入区</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            模板会打开提示词详情；点击应用后，提示词和参考素材会带回顶部输入区。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {promptGalleryItems.slice(0, 3).map((item, index) => {
            const meta = templateMeta[index % templateMeta.length]
            return (
              <button
                key={item.title}
                type="button"
                className="group rounded-lg border border-border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
                onClick={() => handleTemplateClick(item)}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className={cn('flex h-10 w-10 items-center justify-center rounded-lg', meta.accent)}>
                    <meta.icon className="h-5 w-5" />
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </div>

                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-background px-2.5 py-1 text-xs text-muted-foreground ring-1 ring-border">
                    {meta.scene}
                  </span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
                    可应用
                  </span>
                </div>

                <h3 className="line-clamp-2 min-h-11 text-base font-semibold leading-6 text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {meta.output}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {meta.platforms.map(platform => (
                    <span key={platform} className="rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground">
                      {platform}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" />
                    查看提示词和参考素材
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                    应用
                  </Button>
                </div>
              </button>
            )
          })}
        </div>

        <VideoDetailModal
          open={modalOpen}
          onOpenChange={handleModalClose}
          item={selectedItem}
          onApplyPrompt={handleApplyPrompt}
        />
      </div>
    </section>
  )
})

export default PromptGallery
