import { describe, it, expect } from 'vitest'
import {
  computeTotal,
  matchRule,
  applyDelta,
  appendHistory,
  buildRadarData,
  analyzeInput,
  INITIAL_ASSETS,
  INITIAL_HISTORY,
  DEFAULT_TOAST,
  ANALYZE_DELAY,
  TOAST_DURATION,
  HIGHLIGHT_DURATION,
} from '../lib/logic'

describe('computeTotal', () => {
  it('正确计算三项资产总和', () => {
    expect(computeTotal({ financial: 1000, health: 2000, cognitive: 3000 })).toBe(6000)
  })

  it('初始资产总和为 10000', () => {
    expect(computeTotal(INITIAL_ASSETS)).toBe(10000)
  })

  it('资产为 0 时总和为 0', () => {
    expect(computeTotal({ financial: 0, health: 0, cognitive: 0 })).toBe(0)
  })

  it('支持负数资产', () => {
    expect(computeTotal({ financial: -500, health: 1000, cognitive: 500 })).toBe(1000)
  })
})

describe('matchRule', () => {
  it('匹配"熬夜"关键词', () => {
    const rule = matchRule('昨晚熬夜了')
    expect(rule).not.toBeNull()
    expect(rule.id).toBe('overwork')
  })

  it('匹配"加班"关键词', () => {
    expect(matchRule('今天加班到很晚').id).toBe('overwork')
  })

  it('匹配"通宵"关键词', () => {
    expect(matchRule('通宵打游戏').id).toBe('overwork')
  })

  it('匹配"健身"关键词', () => {
    expect(matchRule('去健身房锻炼').id).toBe('exercise')
  })

  it('匹配"跑步"关键词', () => {
    expect(matchRule('早上跑步五公里').id).toBe('exercise')
  })

  it('匹配"运动"关键词', () => {
    expect(matchRule('户外运动').id).toBe('exercise')
  })

  it('匹配"读书"关键词', () => {
    expect(matchRule('读书一小时').id).toBe('study')
  })

  it('匹配"学习"关键词', () => {
    expect(matchRule('学习新知识').id).toBe('study')
  })

  it('匹配"上课"关键词', () => {
    expect(matchRule('今天上课认真听讲').id).toBe('study')
  })

  it('无匹配时返回 null', () => {
    expect(matchRule('今天吃了顿好的')).toBeNull()
  })

  it('空字符串返回 null', () => {
    expect(matchRule('')).toBeNull()
  })

  it('纯空格字符串返回 null', () => {
    expect(matchRule('   ')).toBeNull()
  })

  it('非字符串输入返回 null', () => {
    expect(matchRule(null)).toBeNull()
    expect(matchRule(undefined)).toBeNull()
    expect(matchRule(123)).toBeNull()
  })

  it('优先级：同时包含多类关键词时按规则表顺序匹配（熬夜优先）', () => {
    // 同时包含熬夜和健身，应优先匹配熬夜
    expect(matchRule('熬夜后去健身').id).toBe('overwork')
  })

  it('带前后空格的文本能正确匹配', () => {
    expect(matchRule('  跑步  ').id).toBe('exercise')
  })
})

describe('applyDelta', () => {
  it('正确应用正增量', () => {
    const result = applyDelta({ financial: 1000, health: 1000, cognitive: 1000 }, { financial: 500, health: 0, cognitive: 0 })
    expect(result).toEqual({ financial: 1500, health: 1000, cognitive: 1000 })
  })

  it('正确应用负增量', () => {
    const result = applyDelta({ financial: 1000, health: 1000, cognitive: 1000 }, { financial: 0, health: -800, cognitive: 0 })
    expect(result.health).toBe(200)
  })

  it('不修改原对象（不可变更新）', () => {
    const original = { financial: 1000, health: 1000, cognitive: 1000 }
    applyDelta(original, { financial: 500, health: 0, cognitive: 0 })
    expect(original.financial).toBe(1000)
  })

  it('delta 缺失字段按 0 处理', () => {
    const result = applyDelta({ financial: 1000, health: 1000, cognitive: 1000 }, { financial: 500 })
    expect(result).toEqual({ financial: 1500, health: 1000, cognitive: 1000 })
  })

  it('增量可导致负数', () => {
    const result = applyDelta({ financial: 100, health: 100, cognitive: 100 }, { financial: 0, health: -500, cognitive: 0 })
    expect(result.health).toBe(-400)
  })
})

describe('appendHistory', () => {
  it('追加新记录并递增 day', () => {
    const history = [{ day: '1', total: 10000 }]
    const result = appendHistory(history, 9700)
    expect(result).toHaveLength(2)
    expect(result[1]).toEqual({ day: '2', total: 9700 })
  })

  it('不修改原数组', () => {
    const history = [{ day: '1', total: 10000 }]
    appendHistory(history, 9700)
    expect(history).toHaveLength(1)
  })

  it('空历史时 day 从 1 开始', () => {
    const result = appendHistory([], 5000)
    expect(result).toEqual([{ day: '1', total: 5000 }])
  })

  it('连续追加 day 递增正确', () => {
    let history = [{ day: '1', total: 10000 }]
    history = appendHistory(history, 9700)
    history = appendHistory(history, 10100)
    expect(history[2].day).toBe('3')
    expect(history[2].total).toBe(10100)
  })
})

describe('buildRadarData', () => {
  it('返回 5 个维度', () => {
    const data = buildRadarData(INITIAL_ASSETS)
    expect(data).toHaveLength(5)
  })

  it('维度顺序为财务/身体/心理/技能/体验', () => {
    const data = buildRadarData(INITIAL_ASSETS)
    expect(data.map((d) => d.dimension)).toEqual(['财务', '身体', '心理', '技能', '体验'])
  })

  it('心理维度 = 健康 × 0.6（四舍五入）', () => {
    const data = buildRadarData({ financial: 0, health: 4000, cognitive: 0 })
    expect(data[2].value).toBe(2400)
  })

  it('体验维度 = 认知 × 0.6（四舍五入）', () => {
    const data = buildRadarData({ financial: 0, health: 0, cognitive: 3000 })
    expect(data[4].value).toBe(1800)
  })

  it('健康为奇数时四舍五入正确', () => {
    const data = buildRadarData({ financial: 0, health: 4001, cognitive: 0 })
    // 4001 * 0.6 = 2400.6 → 2401
    expect(data[2].value).toBe(2401)
  })
})

describe('analyzeInput', () => {
  const assets = { financial: 3000, health: 4000, cognitive: 3000 }
  const history = [{ day: '1', total: 10000 }]

  it('熬夜类：健康 -800，财务 +500，history 推进', () => {
    const result = analyzeInput('熬夜加班', assets, history)
    expect(result.matched).toBe(true)
    expect(result.assets).toEqual({ financial: 3500, health: 3200, cognitive: 3000 })
    expect(result.history).toHaveLength(2)
    expect(result.history[1].total).toBe(9700)
    expect(result.history[1].day).toBe('2')
    expect(result.toast).toContain('内卷警告')
    expect(result.highlight.keys).toEqual(['health', 'financial'])
  })

  it('健身类：健康 +400', () => {
    const result = analyzeInput('跑步运动', assets, history)
    expect(result.matched).toBe(true)
    expect(result.assets.health).toBe(4400)
    expect(result.history[1].total).toBe(10400)
    expect(result.toast).toContain('健康资产')
    expect(result.highlight.keys).toEqual(['health'])
  })

  it('学习类：认知 +500', () => {
    const result = analyzeInput('读书学习', assets, history)
    expect(result.matched).toBe(true)
    expect(result.assets.cognitive).toBe(3500)
    expect(result.history[1].total).toBe(10500)
    expect(result.toast).toContain('认知资产')
    expect(result.highlight.keys).toEqual(['cognitive'])
  })

  it('无匹配：资产与历史不变，返回默认 Toast', () => {
    const result = analyzeInput('今天天气不错', assets, history)
    expect(result.matched).toBe(false)
    expect(result.assets).toBe(assets)
    expect(result.history).toBe(history)
    expect(result.toast).toBe(DEFAULT_TOAST)
    expect(result.highlight.keys).toEqual([])
  })

  it('不修改原 assets/history 对象', () => {
    const originalAssets = { ...assets }
    const originalHistory = [...history]
    analyzeInput('熬夜', assets, history)
    expect(assets).toEqual(originalAssets)
    expect(history).toEqual(originalHistory)
  })

  it('history 总分与新 assets 总分一致（同步性验证）', () => {
    const result = analyzeInput('熬夜加班', assets, history)
    const newTotal = result.assets.financial + result.assets.health + result.assets.cognitive
    expect(result.history[result.history.length - 1].total).toBe(newTotal)
  })
})

describe('常量', () => {
  it('ANALYZE_DELAY 为 1200ms', () => {
    expect(ANALYZE_DELAY).toBe(1200)
  })

  it('TOAST_DURATION 为 3000ms', () => {
    expect(TOAST_DURATION).toBe(3000)
  })

  it('HIGHLIGHT_DURATION 为 800ms', () => {
    expect(HIGHLIGHT_DURATION).toBe(800)
  })

  it('INITIAL_ASSETS 总和为 10000', () => {
    expect(computeTotal(INITIAL_ASSETS)).toBe(10000)
  })

  it('INITIAL_HISTORY 第一天 total 为 10000', () => {
    expect(INITIAL_HISTORY[0].total).toBe(10000)
  })
})
