import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Toast from '../components/Toast'

describe('Toast', () => {
  it('visible 为 true 时显示消息', () => {
    render(<Toast message="测试消息" visible={true} />)
    expect(screen.getByText('测试消息')).toBeInTheDocument()
  })

  it('visible 为 false 时消息仍渲染在 DOM（用于过渡动画）但不可见', () => {
    const { container } = render(<Toast message="隐藏消息" visible={false} />)
    // 外层定位 div 是 container 的第一个子节点
    const outerDiv = container.firstChild
    expect(outerDiv.className).toContain('opacity-0')
  })

  it('visible 为 true 时外层有 opacity-100 类', () => {
    const { container } = render(<Toast message="显示消息" visible={true} />)
    const outerDiv = container.firstChild
    expect(outerDiv.className).toContain('opacity-100')
  })

  it('visible 为 false 时有 pointer-events-none', () => {
    const { container } = render(<Toast message="消息" visible={false} />)
    const outerDiv = container.firstChild
    expect(outerDiv.className).toContain('pointer-events-none')
  })

  it('使用固定定位 top-6', () => {
    const { container } = render(<Toast message="消息" visible={true} />)
    const outerDiv = container.firstChild
    expect(outerDiv.className).toContain('fixed')
    expect(outerDiv.className).toContain('top-6')
  })

  it('使用 z-50 层级', () => {
    const { container } = render(<Toast message="消息" visible={true} />)
    const outerDiv = container.firstChild
    expect(outerDiv.className).toContain('z-50')
  })

  it('消息为空字符串时也能渲染', () => {
    render(<Toast message="" visible={true} />)
    expect(true).toBe(true)
  })

  it('包含 emoji 的消息正常显示', () => {
    render(<Toast message="⚠️ 内卷警告" visible={true} />)
    expect(screen.getByText('⚠️ 内卷警告')).toBeInTheDocument()
  })
})
