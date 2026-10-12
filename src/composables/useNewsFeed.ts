import { computed, ref } from 'vue'

import { CHANNELS, PAGE_SIZE, REFRESH_SECONDS } from '@/config'
import { fetchNews } from '@/services/news'
import type { NewsItem } from '@/types'

/**
 * 资讯流的共享状态与逻辑。
 * refs 定义在模块级，多处调用拿到的是同一份数据（等价于一个极简 store）。
 */
const list = ref<NewsItem[]>([])
const rendered = ref(PAGE_SIZE)
const selected = ref<string[]>(Object.keys(CHANNELS))
const status = ref('')
const loadTime = ref('-')
const countdown = ref(REFRESH_SECONDS)

const CIRCUMFERENCE = 94.2 // 2 * PI * 15

let timer: number | null = null
let fetching = false
let queued = false
let loadSeq = 0

export function useNewsFeed() {
  const visibleItems = computed(() => list.value.slice(0, rendered.value))
  const total = computed(() => list.value.length)
  const hasMore = computed(() => rendered.value < total.value)
  const topRank = computed(() => list.value.slice(0, 10))
  const channelKeys = Object.keys(CHANNELS)
  const allSelected = computed(() => selected.value.length === channelKeys.length)
  /** 部分选中：给「全部」显示半选横杠用 */
  const someSelected = computed(
    () => selected.value.length > 0 && !allSelected.value,
  )
  const ringOffset = computed(
    () => CIRCUMFERENCE * (1 - countdown.value / REFRESH_SECONDS),
  )

  /* ---------- 自动刷新倒计时 ---------- */
  function stopCount() {
    if (timer !== null) {
      window.clearInterval(timer)
      timer = null
    }
  }

  function startCount() {
    stopCount()
    countdown.value = REFRESH_SECONDS
    timer = window.setInterval(() => {
      countdown.value -= 1
      if (countdown.value <= 0) {
        startCount()
        void refresh()
      }
    }, 1000)
  }

  /* ---------- 拉取数据 ---------- */
  async function refresh() {
    // 一个栏目都没选：清空列表，并让进行中的请求结果作废
    if (selected.value.length === 0) {
      loadSeq += 1
      list.value = []
      rendered.value = PAGE_SIZE
      loadTime.value = '-'
      status.value = ''
      return
    }
    if (fetching) {
      queued = true
      return
    }
    fetching = true
    const seq = ++loadSeq
    const before = performance.now()
    status.value = '正在拉取…'
    try {
      const items = await fetchNews([...selected.value])
      if (seq !== loadSeq) return
      list.value = items
      rendered.value = PAGE_SIZE
      loadTime.value = `${((performance.now() - before) / 1000).toFixed(2)}s`
      status.value = ''
    } catch {
      if (seq === loadSeq) status.value = '拉取失败，稍后重试'
    } finally {
      fetching = false
      if (queued) {
        queued = false
        void refresh()
      }
    }
  }

  /* ---------- 栏目筛选 ---------- */
  function toggleChannel(key: string) {
    const keys = new Set(selected.value)
    if (keys.has(key)) {
      keys.delete(key)
    } else {
      keys.add(key)
    }
    selected.value = channelKeys.filter((k) => keys.has(k))
    applyFilter()
  }

  /** 「全部」：全选 <-> 全不选 */
  function toggleAll() {
    selected.value = allSelected.value ? [] : [...channelKeys]
    applyFilter()
  }

  function applyFilter() {
    startCount()
    void refresh()
  }

  /* ---------- 交互 ---------- */
  function loadMore() {
    if (!hasMore.value) return
    rendered.value += PAGE_SIZE
  }

  function openItem(item: NewsItem) {
    if (!item.url) return
    window.open(item.url, '_blank', 'noopener')
  }

  function refreshNow() {
    startCount()
    void refresh()
  }

  /** 页面启动 */
  function boot() {
    startCount()
    void refresh()
  }

  return {
    // state
    selected,
    status,
    loadTime,
    countdown,
    // computed
    visibleItems,
    total,
    hasMore,
    topRank,
    allSelected,
    someSelected,
    ringOffset,
    // actions
    boot,
    refreshNow,
    toggleChannel,
    toggleAll,
    loadMore,
    openItem,
  }
}
