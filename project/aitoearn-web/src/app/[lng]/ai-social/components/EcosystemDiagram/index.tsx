'use client'

import { useMemo, useState } from 'react'
import {
  Boxes,
  ClipboardPenLine,
  FileUp,
  History,
  Images,
  MessageSquareText,
  PlugZap,
} from 'lucide-react'
import { cn } from '@/utils/className'

type StepKey = 'brief' | 'media' | 'task' | 'records' | 'channels'

const flowSteps: Array<{
  key: StepKey
  title: string
  desc: string
  icon: typeof ClipboardPenLine
  details: string[]
}> = [
  {
    key: 'brief',
    title: '输入需求',
    desc: '在输入框描述要生成或处理的内容。',
    icon: ClipboardPenLine,
    details: ['支持一句话创建任务', '可套用模板提示词', '未填写时使用默认示例'],
  },
  {
    key: 'media',
    title: '添加素材',
    desc: '上传图片或视频作为任务参考。',
    icon: FileUp,
    details: ['支持拖拽上传', '可移除已选素材', '模板可带入参考图片'],
  },
  {
    key: 'task',
    title: '创建任务',
    desc: '登录并满足积分条件后进入任务会话。',
    icon: MessageSquareText,
    details: ['未登录会先前往登录', '积分不足会提示充值', '任务会进入聊天页处理'],
  },
  {
    key: 'records',
    title: '查看记录',
    desc: '通过任务记录和素材入口查看历史内容。',
    icon: History,
    details: ['查看任务记录', '查看 AI 生成素材', '打开素材预览'],
  },
  {
    key: 'channels',
    title: '连接频道',
    desc: '从输入区进入频道连接列表。',
    icon: PlugZap,
    details: ['未登录先完成登录', '按平台连接账号', '为后续发布流程做准备'],
  },
]

export function EcosystemDiagram() {
  const [activeKey, setActiveKey] = useState<StepKey>('brief')
  const activeStep = useMemo(
    () => flowSteps.find(step => step.key === activeKey) ?? flowSteps[0],
    [activeKey],
  )

  return (
    <section className="px-4 py-12 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Boxes className="h-3.5 w-3.5" />
              FlowMint 工作流程
            </div>
            <h2 className="text-2xl font-semibold text-foreground md:text-3xl">从需求输入到任务处理</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            输入需求、添加参考素材，并进入任务会话继续处理内容。
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm md:p-5">
          <div className="relative overflow-hidden rounded-md border border-border bg-background p-4 md:p-6">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(20,184,166,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:28px_28px]" />
            <div className="relative grid gap-3 md:grid-cols-5">
              {flowSteps.map((step, index) => (
                <button
                  key={step.key}
                  type="button"
                  className={cn(
                    'group relative rounded-lg border p-4 text-left transition-all',
                    activeKey === step.key
                      ? 'border-primary bg-primary/10 shadow-sm shadow-primary/20'
                      : 'border-border bg-card/95 hover:border-primary/35',
                  )}
                  onClick={() => setActiveKey(step.key)}
                >
                  {index < flowSteps.length - 1 && (
                    <span className="absolute left-[calc(100%-2px)] top-1/2 hidden h-px w-3 bg-primary/40 md:block" />
                  )}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-background text-primary ring-1 ring-border">
                      <step.icon className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 min-h-10 text-xs leading-5 text-muted-foreground">{step.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_280px]">
            <div className="rounded-lg border border-border bg-background p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_0_4px_rgba(20,184,166,0.14)]" />
                <h3 className="font-semibold text-foreground">{activeStep.title}</h3>
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                {activeStep.details.map(detail => (
                  <div key={detail} className="rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
                    {detail}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-primary/25 bg-primary/10 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Images className="h-4 w-4 text-primary" />
                常用入口
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                你可以进入任务记录、打开生成素材预览，并通过频道连接列表管理账号。
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                任务、素材和频道连接都可快速进入
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EcosystemDiagram
