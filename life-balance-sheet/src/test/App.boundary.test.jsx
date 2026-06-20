import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

const WAIT_OPTS = { timeout: 3000 }

describe('边界条件与异常场景测试', () => {
  it('空输入提交：不触发分析流程', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /提交测算/ }))

    expect(screen.getByRole('button', { name: /提交测算/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /AI 分析中/ })).not.toBeInTheDocument()
    expect(screen.getByText('10,000')).toBeInTheDocument()
  })

  it('纯空格输入提交：不触发分析流程', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/描述你今天的行为/), '   ')
    await user.click(screen.getByRole('button', { name: /提交测算/ }))

    expect(screen.queryByRole('button', { name: /AI 分析中/ })).not.toBeInTheDocument()
  })

  it('loading 中再次点击：不重复触发', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/描述你今天的行为/), '跑步')
    await user.click(screen.getByRole('button', { name: /提交测算/ }))

    expect(screen.getByRole('button', { name: /AI 分析中/ })).toBeDisabled()

    await waitFor(() => expect(screen.getByText('10,400')).toBeInTheDocument(), WAIT_OPTS)
    expect(screen.queryByText('10,800')).not.toBeInTheDocument()
  })

  it('极长输入文本（1000 字符）能正常处理', async () => {
    const user = userEvent.setup()
    render(<App />)

    const longText = '跑步'.repeat(500)
    await user.type(screen.getByPlaceholderText(/描述你今天的行为/), longText)
    await user.click(screen.getByRole('button', { name: /提交测算/ }))

    await waitFor(() => {
      expect(screen.getByText(/健康资产稳步提升/)).toBeInTheDocument()
    }, WAIT_OPTS)
    expect(screen.getByText('10,400')).toBeInTheDocument()
  })

  it('特殊字符输入不崩溃', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/描述你今天的行为/), '<script>alert(1)</script>')
    await user.click(screen.getByRole('button', { name: /提交测算/ }))

    await waitFor(() => {
      expect(screen.getByText(/未识别到有效行为/)).toBeInTheDocument()
    }, WAIT_OPTS)
  })

  it('SQL 注入式输入不崩溃', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/描述你今天的行为/), "'; DROP TABLE users; --")
    await user.click(screen.getByRole('button', { name: /提交测算/ }))

    await waitFor(() => {
      expect(screen.getByText(/未识别到有效行为/)).toBeInTheDocument()
    }, WAIT_OPTS)
  })

  it('同时包含多类关键词：按优先级匹配第一条规则', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/描述你今天的行为/), '熬夜后去健身')
    await user.click(screen.getByRole('button', { name: /提交测算/ }))

    await waitFor(() => {
      expect(screen.getByText(/内卷警告/)).toBeInTheDocument()
    }, WAIT_OPTS)
    expect(screen.getByText('9,700')).toBeInTheDocument()
  })

  it('大小写混合的英文输入不匹配', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/描述你今天的行为/), 'Running exercise')
    await user.click(screen.getByRole('button', { name: /提交测算/ }))

    await waitFor(() => {
      expect(screen.getByText(/未识别到有效行为/)).toBeInTheDocument()
    }, WAIT_OPTS)
  })

  it('数字输入不匹配', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/描述你今天的行为/), '1234567890')
    await user.click(screen.getByRole('button', { name: /提交测算/ }))

    await waitFor(() => {
      expect(screen.getByText(/未识别到有效行为/)).toBeInTheDocument()
    }, WAIT_OPTS)
  })

  it('Emoji 输入不崩溃', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/描述你今天的行为/), '😀🎉💪')
    await user.click(screen.getByRole('button', { name: /提交测算/ }))

    await waitFor(() => {
      expect(screen.getByText(/未识别到有效行为/)).toBeInTheDocument()
    }, WAIT_OPTS)
  })

  it('资产可降至负数（熬夜多次）', async () => {
    const user = userEvent.setup()
    render(<App />)

    // 熬夜 6 次：健康 4000 - 800*6 = -800
    // 每次等待健康值变化，而非按钮状态（避免 Toast 定时器干扰）
    for (let i = 1; i <= 6; i++) {
      await user.type(screen.getByPlaceholderText(/描述你今天的行为/), '熬夜')
      await user.click(screen.getByRole('button', { name: /提交测算/ }))
      const expectedHealth = (4000 - 800 * i).toLocaleString()
      await waitFor(() => {
        expect(screen.getByText(expectedHealth)).toBeInTheDocument()
      }, WAIT_OPTS)
    }

    expect(screen.getByText('-800')).toBeInTheDocument()
  }, 30000)

  it('快速连续提交：每次都正确推进 history', async () => {
    const user = userEvent.setup()
    render(<App />)

    // 读书 3 次：认知 3000 + 500*3 = 4500
    // 每次等待认知值变化（比等待按钮状态更稳定）
    for (let i = 1; i <= 3; i++) {
      // 确保按钮可点击（非 loading 态）
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /提交测算/ })).toBeEnabled()
      }, WAIT_OPTS)
      await user.type(screen.getByPlaceholderText(/描述你今天的行为/), '读书')
      await user.click(screen.getByRole('button', { name: /提交测算/ }))
      const expectedCognitive = (3000 + 500 * i).toLocaleString()
      await waitFor(() => {
        expect(screen.getByText(expectedCognitive)).toBeInTheDocument()
      }, WAIT_OPTS)
    }

    expect(screen.getByText('4,500')).toBeInTheDocument()
    expect(screen.getByText('11,500')).toBeInTheDocument()
  }, 30000)
})
