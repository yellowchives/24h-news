/** 频道 key -> 展示名，顺序即展示顺序 */
export const CHANNELS: Record<string, string> = {
  yaowen: '要闻',
  caijing: '财经',
  gupiao: '股票',
  zhibo: '股市直播',
  jijin: '基金',
  qihuo: '期货',
  huangjin: '黄金',
  ganggu: '港股',
  touzi: '投资机会',
}

/** 频道数据源地址（脚本为 GBK 编码，必须走 https 否则在 Pages 上会被当混合内容拦截） */
export const NEWS_BASE = 'https://stock.10jqka.com.cn/thsgd/'

/** 每页加载条数 */
export const PAGE_SIZE = 20

/** 自动刷新间隔（秒） */
export const REFRESH_SECONDS = 60

/** 拉取超时（毫秒），超时后用已拿到的数据先渲染 */
export const FETCH_TIMEOUT = 5000

/** 栏目标签配色 */
const CATEGORY_COLORS: Record<string, string> = {
  要闻: '#2f6fd0',
  财经: '#1f9d63',
  股票: '#d04048',
  股市直播: '#8a54c8',
  基金: '#0e9ab8',
  期货: '#c07a1f',
  黄金: '#b8911a',
  港股: '#189aa0',
  投资机会: '#c54d7a',
}

export function categoryColor(category?: string): string {
  return (category && CATEGORY_COLORS[category]) || '#7a86a0'
}
