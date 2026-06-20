import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InputBar from '../components/InputBar'

describe('InputBar', () => {
  it('渲染输入框与提交按钮', () => {
    render(<InputBar value="" onChange={() => {}} onSubmit={() => {}} loading={false} />)
    expect(screen.getByPlaceholderText(/描述你今天的行为/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /提交测算/ })).toBeInTheDocument()
  })

  it('输入框显示当前 value', () => {
    render(<InputBar value="熬夜加班" onChange={() => {}} onSubmit={() => {}} loading={false} />)
    expect(screen.getByDisplayValue('熬夜加班')).toBeInTheDocument()
  })

  it('用户输入时触发 onChange', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<InputBar value="" onChange={handleChange} onSubmit={() => {}} loading={false} />)
    await user.type(screen.getByPlaceholderText(/描述你今天的行为/), '跑步')
    expect(handleChange).toHaveBeenCalled()
  })

  it('点击按钮触发 onSubmit', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    render(<InputBar value="熬夜" onChange={() => {}} onSubmit={handleSubmit} loading={false} />)
    await user.click(screen.getByRole('button', { name: /提交测算/ }))
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })

  it('按 Enter 键触发 onSubmit', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    render(<InputBar value="熬夜" onChange={() => {}} onSubmit={handleSubmit} loading={false} />)
    const input = screen.getByPlaceholderText(/描述你今天的行为/)
    await user.type(input, '{Enter}')
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })

  it('loading 为 true 时按钮显示"AI 分析中..."', () => {
    render(<InputBar value="" onChange={() => {}} onSubmit={() => {}} loading={true} />)
    expect(screen.getByRole('button', { name: /AI 分析中/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /提交测算/ })).not.toBeInTheDocument()
  })

  it('loading 为 true 时按钮被禁用', () => {
    const { container } = render(<InputBar value="" onChange={() => {}} onSubmit={() => {}} loading={true} />)
    const button = container.querySelector('button')
    expect(button).toBeDisabled()
  })

  it('loading 为 true 时按钮有 animate-pulse 类', () => {
    const { container } = render(<InputBar value="" onChange={() => {}} onSubmit={() => {}} loading={true} />)
    const button = container.querySelector('button')
    expect(button.className).toContain('animate-pulse')
  })

  it('loading 为 true 时按 Enter 不触发 onSubmit', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    render(<InputBar value="熬夜" onChange={() => {}} onSubmit={handleSubmit} loading={true} />)
    const input = screen.getByPlaceholderText(/描述你今天的行为/)
    await user.type(input, '{Enter}')
    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it('渲染 Send 图标', () => {
    const { container } = render(<InputBar value="" onChange={() => {}} onSubmit={() => {}} loading={false} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
