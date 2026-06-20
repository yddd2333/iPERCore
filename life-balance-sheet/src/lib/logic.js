/**
 * 人生资产负债表 - 业务逻辑模块
 * 将关键词匹配、资产计算、历史推进等纯逻辑从组件中抽离，便于单元测试与复用。
 */

// 资产维度键名常量，避免魔法字符串
export const ASSET_KEYS = {
  FINANCIAL: 'financial',
  HEALTH: 'health',
  COGNITIVE: 'cognitive',
}

// 关键词匹配规则表（顺序即优先级）
// 每条规则包含：正则、资产增量、Toast 文案、高亮的资产键与颜色
const RULES = [
  {
    id: 'overwork',
    regex: /熬夜|加班|通宵/,
    delta: { financial: +500, health: -800, cognitive: 0 },
    toast: '⚠️ 内卷警告：消耗健康换取微薄财务，不值得',
    highlight: { keys: ['health', 'financial'], color: 'bg-rose-500/20' },
  },
  {
    id: 'exercise',
    regex: /健身|跑步|运动/,
    delta: { financial: 0, health: +400, cognitive: 0 },
    toast: '✨ 优质定投：健康资产稳步提升',
    highlight: { keys: ['health'], color: 'bg-emerald-500/20' },
  },
  {
    id: 'study',
    regex: /读书|学习|上课/,
    delta: { financial: 0, health: 0, cognitive: +500 },
    toast: '✨ 优质定投：认知资产稳步提升',
    highlight: { keys: ['cognitive'], color: 'bg-blue-500/20' },
  },
]

// 无匹配时的默认 Toast 文案
export const DEFAULT_TOAST = '🤔 未识别到有效行为，试试描述你的日常'

// 模拟 AI 分析的延迟（毫秒）
export const ANALYZE_DELAY = 1200

// Toast 自动消失延迟（毫秒）
export const TOAST_DURATION = 3000

// 卡片高亮持续时长（毫秒）
export const HIGHLIGHT_DURATION = 800

// 初始资产
export const INITIAL_ASSETS = { financial: 3000, health: 4000, cognitive: 3000 }

// 初始历史
export const INITIAL_HISTORY = [{ day: '1', total: 10000 }]

/**
 * 计算三项资产总和
 * @param {{financial:number, health:number, cognitive:number}} assets
 * @returns {number}
 */
export function computeTotal(assets) {
  return assets.financial + assets.health + assets.cognitive
}

/**
 * 根据输入文本匹配规则，返回命中的规则对象；无命中返回 null
 * @param {string} text
 * @returns {object|null}
 */
export function matchRule(text) {
  if (typeof text !== 'string') return null
  const trimmed = text.trim()
  if (!trimmed) return null
  return RULES.find((rule) => rule.regex.test(trimmed)) || null
}

/**
 * 将规则增量应用到当前资产上，返回新资产对象（不可变更新）
 * @param {object} assets
 * @param {object} delta
 * @returns {object}
 */
export function applyDelta(assets, delta) {
  return {
    financial: assets.financial + (delta.financial || 0),
    health: assets.health + (delta.health || 0),
    cognitive: assets.cognitive + (delta.cognitive || 0),
  }
}

/**
 * 生成下一条历史记录
 * @param {Array} history
 * @param {number} newTotal
 * @returns {Array}
 */
export function appendHistory(history, newTotal) {
  return [...history, { day: String(history.length + 1), total: newTotal }]
}

/**
 * 将 assets 映射为雷达图所需的五维数据
 * 心理 = 健康 × 0.6，体验 = 认知 × 0.6
 * @param {object} assets
 * @returns {Array<{dimension:string, value:number}>}
 */
export function buildRadarData(assets) {
  return [
    { dimension: '财务', value: assets.financial },
    { dimension: '身体', value: assets.health },
    { dimension: '心理', value: Math.round(assets.health * 0.6) },
    { dimension: '技能', value: assets.cognitive },
    { dimension: '体验', value: Math.round(assets.cognitive * 0.6) },
  ]
}

/**
 * 综合分析：输入文本 + 当前资产/历史，返回分析结果
 * 包含新资产、新历史、Toast 文案、高亮信息
 * @param {string} text
 * @param {object} assets
 * @param {Array} history
 * @returns {{matched:boolean, assets:object, history:Array, toast:string, highlight:{keys:Array, color:string}}}
 */
export function analyzeInput(text, assets, history) {
  const rule = matchRule(text)
  if (!rule) {
    return {
      matched: false,
      assets,
      history,
      toast: DEFAULT_TOAST,
      highlight: { keys: [], color: '' },
    }
  }
  const newAssets = applyDelta(assets, rule.delta)
  const newTotal = computeTotal(newAssets)
  const newHistory = appendHistory(history, newTotal)
  return {
    matched: true,
    assets: newAssets,
    history: newHistory,
    toast: rule.toast,
    highlight: rule.highlight,
  }
}
