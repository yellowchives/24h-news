import { FETCH_TIMEOUT, NEWS_BASE } from '@/config'
import type { ChannelPayload, NewsItem } from '@/types'
import { sortKey } from '@/utils/format'

/** 频道脚本共用的全局回调名 */
const CALLBACK_NAME = 'ths_rss_news_callback'

declare global {
  interface Window {
    ths_rss_news_callback?: (data: ChannelPayload) => void
  }
}

/**
 * 并发拉取指定频道的脚本，聚合后按 seq 去重、按发布时间倒序返回。
 * 脚本方式加载（跨域 + GBK），无法用 fetch/XHR 直接替代。
 */
export function fetchNews(channels: string[]): Promise<NewsItem[]> {
  if (channels.length === 0) return Promise.resolve([])

  return new Promise<NewsItem[]>((resolve, reject) => {
    const items: NewsItem[] = []
    const scripts: HTMLScriptElement[] = []
    const pending = new Set(channels)
    let failures = 0
    let settled = false
    let timer = 0

    const finish = () => {
      if (settled) return
      settled = true
      window.clearTimeout(timer)
      delete window[CALLBACK_NAME]
      scripts.forEach((s) => {
        s.onload = null
        s.onerror = null
        s.remove()
      })
      if (failures === channels.length) {
        reject(new Error('所有频道拉取失败'))
        return
      }
      resolve(dedupeAndSort(items))
    }

    const settleChannel = (channel: string, failed = false) => {
      if (failed) failures += 1
      pending.delete(channel)
      if (pending.size === 0) finish()
    }

    window[CALLBACK_NAME] = (data) => {
      for (const item of data?.item ?? []) items.push(item)
    }

    for (const channel of channels) {
      const script = document.createElement('script')
      script.charset = 'gbk'
      script.src = `${NEWS_BASE}${channel}.js?t=${Date.now()}`
      script.onload = () => settleChannel(channel)
      script.onerror = () => settleChannel(channel, true)
      scripts.push(script)
      document.head.appendChild(script)
    }

    // 超时兜底：用已拿到的数据先出结果
    timer = window.setTimeout(finish, FETCH_TIMEOUT)
  })
}

/** 按 seq 去重 + 按发布时间倒序 */
function dedupeAndSort(items: NewsItem[]): NewsItem[] {
  const seen = new Set<string | number>()
  const unique: NewsItem[] = []
  for (const item of items) {
    if (seen.has(item.seq)) continue
    seen.add(item.seq)
    unique.push(item)
  }
  unique.sort((a, b) => sortKey(b.pubDate) - sortKey(a.pubDate))
  return unique
}
