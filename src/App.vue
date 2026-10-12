<script setup lang="ts">
import { onMounted } from 'vue'

import ChannelChips from '@/components/ChannelChips.vue'
import NewsFeed from '@/components/NewsFeed.vue'
import RankList from '@/components/RankList.vue'
import TopBar from '@/components/TopBar.vue'
import { useNewsFeed } from '@/composables/useNewsFeed'

const { boot } = useNewsFeed()

onMounted(boot)
</script>

<template>
  <TopBar />
  <ChannelChips />

  <main class="stage">
    <NewsFeed />
    <aside class="side">
      <RankList />
    </aside>
  </main>

  <footer>24小时要闻 · 数据来自同花顺公开接口 · 点击任意标题可打开原文</footer>
</template>
