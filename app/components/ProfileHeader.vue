<script setup lang="ts">
const { profile } = useAppConfig()

const roleParts = profile.role
  .split('|')
  .map(part => part.trim())
  .filter(Boolean)
</script>

<template>
  <header class="grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-x-[25px] narrow:grid-rows-[1fr_auto_auto_1fr]">
    <img
      :src="profile.avatar"
      :alt="profile.name"
      width="250"
      height="250"
      class="size-[85px] shrink-0 rounded-[15px] object-contain transition-transform duration-400 hover:scale-105 tiny:size-[125px] narrow:row-span-4 narrow:row-start-1"
    >

    <h1 class="min-w-0 text-[15px] leading-[25px] font-medium break-words text-white tiny:text-xl narrow:col-start-2 narrow:row-start-2">
      {{ profile.name }}
    </h1>

    <p
      v-if="roleParts.length"
      class="col-span-2 mt-3 min-w-0 narrow:col-span-1 narrow:col-start-2 narrow:row-start-3 narrow:mt-2.5"
    >
      <span class="sr-only">{{ profile.role }}</span>
      <code
        aria-hidden="true"
        class="block rounded-lg border border-white/10 bg-black/30 px-2.5 py-1.5 font-code text-[11px] leading-[18px] [overflow-wrap:anywhere] tiny:text-xs narrow:inline-block narrow:py-1 narrow:text-[12.5px]"
      >
        <span class="mr-[1ch] inline-block"><span class="text-code-keyword">const</span> <span class="text-code-name">role</span> <span class="text-code-punct">=</span></span>
        <span
          v-for="(part, index) in roleParts"
          :key="`${index}-${part}`"
          class="inline-block"
          :class="{ 'mr-[1ch]': index < roleParts.length - 1 }"
        ><span
          v-if="index"
          class="text-code-punct"
        >| </span><span class="text-code-string">"{{ part }}"</span><span
          v-if="index === roleParts.length - 1"
          class="text-code-punct"
        >;</span></span>
      </code>
    </p>
  </header>
</template>
