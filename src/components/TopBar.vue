<script setup lang="ts">
import { useNewsFeed } from '@/composables/useNewsFeed'

const { countdown, ringOffset, refreshNow } = useNewsFeed()
</script>

<template>
  <header class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <span class="num">24h</span>
        <span class="txt">要闻</span>
        <span class="live lbl-hide">LIVE</span>
      </div>

      <div class="cd-grid">
        <div class="cd">
          <div class="ring">
            <svg viewBox="0 0 34 34">
              <circle class="track" cx="17" cy="17" r="15" />
              <circle
                class="bar"
                cx="17"
                cy="17"
                r="15"
                stroke-dasharray="94.2"
                :stroke-dashoffset="ringOffset"
              />
            </svg>
            <span class="n">{{ countdown }}</span>
          </div>
          <div class="lbl lbl-hide">
            <b>自动刷新</b>
            <span>到点拉取最新</span>
          </div>
        </div>

        <button class="btn" type="button" @click="refreshNow">立即刷新</button>
      </div>
    </div>
  </header>
</template>
