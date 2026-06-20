import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AssetCard from '../components/AssetCard'
import { Wallet } from 'lucide-react'

describe('AssetCard', () => {
  const defaultProps = {
    title: '财务 Financial',
    value: 3000,
    Icon: Wallet,
    color: 'bg-emerald-500/20 text-emerald-400',
  }

  it('渲染标题', () => {
    render(<AssetCard {...defaultProps} />)
    expect(screen.getByText('财务 Financial')).toBeInTheDocument()
  })

  it('数值千分位格式化', () => {
    render(<AssetCard {...defaultProps} value={1234567} />)
    expect(screen.getByText('1,234,567')).toBeInTheDocument()
  })

  it('渲染图标', () => {
    const { container } = render(<AssetCard {...defaultProps} />)
    // lucide 图标渲染为 svg
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('未传 highlight 时使用默认背景', () => {
    const { container } = render(<AssetCard {...defaultProps} />)
    const card = container.firstChild
    expect(card.className).toContain('bg-white/5')
    expect(card.className).toContain('transition-colors')
    expect(card.className).toContain('duration-500')
  })

  it('传入 highlight 时使用高亮背景', () => {
    const { container } = render(<AssetCard {...defaultProps} highlight="bg-rose-500/20" />)
    const card = container.firstChild
    expect(card.className).toContain('bg-rose-500/20')
    expect(card.className).not.toContain('bg-white/5')
  })

  it('highlight 为空字符串时使用默认背景', () => {
    const { container } = render(<AssetCard {...defaultProps} highlight="" />)
    const card = container.firstChild
    expect(card.className).toContain('bg-white/5')
  })

  it('value 为 0 时显示 0', () => {
    render(<AssetCard {...defaultProps} value={0} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('负数 value 正确显示', () => {
    render(<AssetCard {...defaultProps} value={-500} />)
    expect(screen.getByText('-500')).toBeInTheDocument()
  })
})
