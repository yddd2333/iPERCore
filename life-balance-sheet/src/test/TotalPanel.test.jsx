import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TotalPanel from '../components/TotalPanel'

describe('TotalPanel', () => {
  it('渲染 LVC 标题', () => {
    render(<TotalPanel value={10000} />)
    expect(screen.getByText('Life Net Worth (LVC)')).toBeInTheDocument()
  })

  it('渲染副标题', () => {
    render(<TotalPanel value={10000} />)
    expect(screen.getByText(/人生总资产/)).toBeInTheDocument()
  })

  it('渲染 LIVE 标签', () => {
    render(<TotalPanel value={10000} />)
    expect(screen.getByText('LIVE')).toBeInTheDocument()
  })

  it('数值使用千分位格式化', () => {
    render(<TotalPanel value={1234567} />)
    expect(screen.getByText('1,234,567')).toBeInTheDocument()
  })

  it('value 为 0 时显示 0', () => {
    render(<TotalPanel value={0} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('负数也能正确格式化', () => {
    render(<TotalPanel value={-1000} />)
    expect(screen.getByText('-1,000')).toBeInTheDocument()
  })
})
