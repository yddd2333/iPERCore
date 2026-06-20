import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

// 分析延迟 1200ms，waitFor 默认 1000ms 会超时，统一设为 3000ms
const WAIT_OPTS = { timeout: 3000 }

describe('App 集成测试 - 完整交互流程', () => {
  it('初始渲染：显示 LVC 总值 10000 与三大资产卡片', () => {
    render(<App />)
    expect(screen.getByText('10,000')).toBeInTheDocument()
    expect(screen.getByText('财务 Financial')).toBeInTheDocument()
    expect(screen.getByText('健康 Health')).toBeInTheDocument()
    expect(screen.getByText('认知 Cognitive')).toBeInTheDocument()
  })

  it('初始渲染：财务 3000、健康 4000、认知 3000', () => {
    render(<App />)
    expect(screen.getAllByText('3,000')).toHaveLength(2)
    expect(screen.getByText('4,000')).toBeInTheDocument()
  })

  it('完整流程：输入"熬夜加班" → loading → 资产更新 + Toast', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText(/描述你今天的行为/)
    await user.type(input, '熬夜加班')
    await user.click(screen.getByRole('button', { name: /提交测算/ }))

    expect(screen.getByRole('button', { name: /AI 分析中/ })).toBeInTheDocument()
    expect(input).toHaveValue('')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /提交测算/ })).toBeInTheDocument()
    }, WAIT_OPTS)

    expect(screen.getByText('3,200')).toBeInTheDocument()
    expect(screen.getByText('3,500')).toBeInTheDocument()
    expect(screen.getByText('9,700')).toBeInTheDocument()
    expect(screen.getByText(/内卷警告/)).toBeInTheDocument()
  })

  it('完整流程：输入"跑步运动" → 健康 +400', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/描述你今天的行为/), '跑步运动')
    await user.click(screen.getByRole('button', { name: /提交测算/ }))

    await waitFor(() => {
      expect(screen.getByText('4,400')).toBeInTheDocument()
    }, WAIT_OPTS)
    expect(screen.getByText('10,400')).toBeInTheDocument()
    expect(screen.getByText(/健康资产稳步提升/)).toBeInTheDocument()
  })

  it('完整流程：输入"读书学习" → 认知 +500', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/描述你今天的行为/), '读书学习')
    await user.click(screen.getByRole('button', { name: /提交测算/ }))

    await waitFor(() => {
      expect(screen.getByText('3,500')).toBeInTheDocument()
    }, WAIT_OPTS)
    expect(screen.getByText('10,500')).toBeInTheDocument()
    expect(screen.getByText(/认知资产稳步提升/)).toBeInTheDocument()
  })

  it('完整流程：无匹配关键词 → 显示默认 Toast，资产不变', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/描述你今天的行为/), '今天吃了顿好的')
    await user.click(screen.getByRole('button', { name: /提交测算/ }))

    await waitFor(() => {
      expect(screen.getByText(/未识别到有效行为/)).toBeInTheDocument()
    }, WAIT_OPTS)
    expect(screen.getByText('10,000')).toBeInTheDocument()
  })

  it('Enter 键提交等效于点击按钮', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText(/描述你今天的行为/)
    await user.type(input, '熬夜{Enter}')

    expect(screen.getByRole('button', { name: /AI 分析中/ })).toBeInTheDocument()
  })

  it('连续多次提交：history 持续推进，资产累加', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/描述你今天的行为/), '跑步')
    await user.click(screen.getByRole('button', { name: /提交测算/ }))
    await waitFor(() => expect(screen.getByText('4,400')).toBeInTheDocument(), WAIT_OPTS)

    await user.type(screen.getByPlaceholderText(/描述你今天的行为/), '跑步')
    await user.click(screen.getByRole('button', { name: /提交测算/ }))
    await waitFor(() => expect(screen.getByText('4,800')).toBeInTheDocument(), WAIT_OPTS)

    expect(screen.getByText('10,800')).toBeInTheDocument()
  })

  it('Toast 3 秒后自动消失', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/描述你今天的行为/), '跑步')
    await user.click(screen.getByRole('button', { name: /提交测算/ }))

    await waitFor(() => {
      expect(screen.getByText(/健康资产稳步提升/)).toBeInTheDocument()
    }, WAIT_OPTS)

    await waitFor(
      () => {
        const toastEl = screen.getByText(/健康资产稳步提升/)
        expect(toastEl.parentElement.parentElement.className).toContain('opacity-0')
      },
      { timeout: 5000 }
    )
  })

  it('高亮 800ms 后恢复', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)

    await user.type(screen.getByPlaceholderText(/描述你今天的行为/), '跑步')
    await user.click(screen.getByRole('button', { name: /提交测算/ }))

    await waitFor(() => {
      const cards = container.querySelectorAll('.backdrop-blur-lg')
      const healthCard = Array.from(cards).find((c) => c.textContent.includes('健康 Health'))
      expect(healthCard.className).toContain('bg-emerald-500/20')
    }, WAIT_OPTS)

    await waitFor(() => {
      const cards = container.querySelectorAll('.backdrop-blur-lg')
      const healthCard = Array.from(cards).find((c) => c.textContent.includes('健康 Health'))
      expect(healthCard.className).toContain('bg-white/5')
      expect(healthCard.className).not.toContain('bg-emerald-500/20')
    })
  })
})
