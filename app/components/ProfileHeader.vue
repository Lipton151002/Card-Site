<script setup lang="ts">
const { profile } = useAppConfig()

const roleParts = profile.role
  .split('|')
  .map(part => part.trim())
  .filter(Boolean)
</script>

<template>
  <header class="flex w-full items-center">
    <img
      :src="profile.avatar"
      :alt="profile.name"
      width="250"
      height="250"
      class="size-[85px] shrink-0 rounded-[15px] object-contain transition-transform duration-400 hover:scale-105 tiny:size-[125px]"
    >

    <div class="ml-[25px] flex min-w-0 flex-col items-start">
      <h1 class="text-[15px] leading-[25px] font-medium text-white tiny:text-xl">
        {{ profile.name }}
      </h1>
      <p
        v-if="roleParts.length"
        class="mt-[7px] tiny:mt-2.5"
      >
        <span class="sr-only">{{ profile.role }}</span>
        <code
          aria-hidden="true"
          class="inline-block rounded-lg border border-white/10 bg-black/30 px-2 py-1 font-code text-[11px] leading-[18px] break-words tiny:px-2.5 tiny:text-[12.5px]"
        >
          <span class="text-code-keyword">const </span>
          <span class="text-code-name">role</span>
          <span class="text-code-punct"> = </span>
          <template
            v-for="(part, index) in roleParts"
            :key="`${index}-${part}`"
          >
            <span
              v-if="index"
              class="text-code-punct"
            > | </span>
            <span class="text-code-string">"{{ part }}"</span>
          </template>
          <span class="text-code-punct">;</span>
        </code>
      </p>
    </div>
  </header>
</template>
