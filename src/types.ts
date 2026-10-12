/**
 * 资讯项，来自同花顺公开的频道 RSS 脚本
 */
export interface NewsItem {
  /** 唯一标识，用于去重 */
  seq: string | number
  title?: string
  /** 正文摘要 */
  content?: string
  /** 原文链接 */
  url?: string
  /** 发布时间，如 "2026-10-12 15:30:00" 或 "15:30" */
  pubDate: string
  /** 栏目名，如 "要闻"、"财经" */
  category?: string
  /** 热度/点赞数 */
  like?: number | string
}

/** 频道脚本返回的数据结构 */
export interface ChannelPayload {
  item?: NewsItem[]
}
