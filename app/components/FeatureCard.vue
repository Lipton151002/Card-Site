<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  text: string
  icon: string
  shineDelay?: number
}>(), {
  shineDelay: 0,
})
</script>

<template>
  <article class="relative isolate overflow-hidden rounded-[15px] bg-panel px-[13px] py-[15px] tiny:px-[15px] tiny:py-[17px]">
    <h2 class="mb-[9px] text-[15px] leading-[21px] font-medium text-white tiny:mb-3 tiny:text-lg">
      {{ title }}
    </h2>
    <p class="relative z-10 max-w-[180px] text-xs leading-4 text-white/50 tiny:text-[13px]">
      {{ text }}
    </p>
    <img
      v-if="icon"
      :src="icon"
      alt=""
      loading="lazy"
      class="pointer-events-none absolute top-[45px] -right-[30px] select-none"
    >
    <span
      aria-hidden="true"
      class="pointer-events-none absolute inset-y-0 left-0 z-20 w-2/5 animate-shine bg-linear-to-r from-transparent via-white/12 to-transparent will-change-transform motion-reduce:hidden"
      :style="{ animationDelay: `${shineDelay}s` }"
    />
  </article>
</template>
