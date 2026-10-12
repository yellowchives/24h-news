<script setup lang="ts">
import { useNewsFeed } from '@/composables/useNewsFeed'

const { topRank, openItem } = useNewsFeed()
</script>

<template>
  <div class="panel">
    <h3>最热要闻排行</h3>

    <ul class="rank">
      <li v-for="(item, index) in topRank" :key="item.seq" @click="openItem(item)">
        <span class="no">{{ index + 1 }}</span>
        <span class="txt">{{ item.title }}</span>
        <span class="lk">{{ item.like ?? '' }}</span>
      </li>
    </ul>

    <p v-if="topRank.length === 0" class="center-tip">暂无数据</p>
  </div>
</template>
