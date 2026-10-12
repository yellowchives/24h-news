<script setup lang="ts">
import { useNewsFeed } from '@/composables/useNewsFeed'
import { categoryColor } from '@/config'
import { formatDay, formatTime } from '@/utils/format'

const { visibleItems, total, status, loadTime, hasMore, selected, loadMore, openItem } =
  useNewsFeed()

function tagStyle(category: string) {
  const color = categoryColor(category)
  return {
    color,
    border: `1px solid ${color}55`,
    background: `${color}18`,
  }
}
</script>

<template>
  <section class="panel">
    <div class="feed-head">
      <h2>资讯流</h2>
      <span class="meta"><b>{{ total }}</b> 条 · {{ loadTime }}</span>
    </div>

    <span v-if="status" class="list-status">{{ status }}</span>

    <ul class="timeline">
      <li
        v-for="(item, index) in visibleItems"
        :key="item.seq"
        class="tl"
        :class="{ hot: index < 10 }"
        @click="openItem(item)"
      >
        <span class="t">{{ formatTime(item.pubDate) }}<span class="d">{{
            formatDay(item.pubDate)
          }}</span></span>

        <div class="title">
          <span v-if="item.category" class="tag" :style="tagStyle(item.category)">{{
            item.category
          }}</span
          >{{ item.title }}
        </div>

        <div v-if="item.content" class="digest">{{ item.content }}</div>
      </li>
    </ul>

    <p v-if="!status && total === 0" class="center-tip">
      {{ selected.length === 0 ? '请至少选择一个栏目' : '暂无数据，请稍后刷新' }}
    </p>

    <button v-if="hasMore" class="loadmore" type="button" @click="loadMore">加载更多</button>
  </section>
</template>
