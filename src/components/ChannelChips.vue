<script setup lang="ts">
import { CHANNELS } from '@/config'
import { useNewsFeed } from '@/composables/useNewsFeed'

const { selected, allSelected, someSelected, toggleChannel, toggleAll } = useNewsFeed()

const entries = Object.entries(CHANNELS)
</script>

<template>
  <nav class="chips">
    <label class="chip" :class="{ on: allSelected }">
      <input
        type="checkbox"
        :checked="allSelected"
        :indeterminate.prop="someSelected"
        @change="toggleAll"
      />
      全部
    </label>

    <label
      v-for="[key, label] in entries"
      :key="key"
      class="chip"
      :class="{ on: selected.includes(key) }"
    >
      <input type="checkbox" :checked="selected.includes(key)" @change="toggleChannel(key)" />
      {{ label }}
    </label>
  </nav>
</template>
