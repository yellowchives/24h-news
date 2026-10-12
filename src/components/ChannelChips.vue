<script setup lang="ts">
import { CHANNELS } from '@/config'
import { useNewsFeed } from '@/composables/useNewsFeed'

const { selected, allSelected, toggleChannel, selectAll } = useNewsFeed()

const entries = Object.entries(CHANNELS)
</script>

<template>
  <nav class="chips">
    <button class="chip" :class="{ on: allSelected }" type="button" @click="selectAll">
      <span class="dot" />全部
    </button>

    <button
      v-for="[key, label] in entries"
      :key="key"
      class="chip"
      :class="{ on: selected.includes(key) }"
      type="button"
      @click="toggleChannel(key)"
    >
      <span class="dot" />{{ label }}
    </button>
  </nav>
</template>
