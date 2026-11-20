<script setup lang="ts">
const { contacts } = useAppConfig()
const { title: contactsTitle, copyNotice } = contacts
const toast = useToast()

const contactStyles: Record<string, { icon: string, background: string }> = {
  discord: { icon: '/images/discord.svg', background: 'bg-discord' },
  telegram: { icon: '/images/telegram.svg', background: 'bg-telegram' },
  youtube: { icon: '/images/youtube.svg', background: 'bg-youtube' },
  github: { icon: '/images/github.svg', background: 'bg-github' },
  figma: { icon: '/images/figma.svg', background: 'bg-figma' },
  vk: { icon: '/images/vk.svg', background: 'bg-vk' },
}

interface ContactItem {
  key: string
  label: string
  icon: string
  background: string
  tag: 'a' | 'button'
  attrs: Record<string, string>
  copyText: string
}

function isSafeLink(url: string) {
  return /^https?:\/\/\S+$/i.test(url)
}

const contactItems = computed(() => Object.entries(contacts.links).flatMap(([key, contact]): ContactItem[] => {
  const style = contactStyles[key]
  if (!style) return []
  const url = contact.url.trim()
  const copyText = contact.copyText.trim()
  if (url && isSafeLink(url)) {
    return [{ key, label: contact.label, ...style, tag: 'a', attrs: { href: url, target: '_blank', rel: 'noopener' }, copyText: '' }]
  }
  if (!url && copyText) {
    return [{ key, label: contact.label, ...style, tag: 'button', attrs: { type: 'button', title: copyText }, copyText }]
  }
  return []
}))

async function copyContact(value: string) {
  if (!value) return
  toast.removeAllGroups()
  try {
    await navigator.clipboard.writeText(value)
    toast.add({ severity: 'secondary', summary: copyNotice.success, detail: value, life: 2000 })
  }
  catch {
    toast.add({ severity: 'error', summary: copyNotice.error, detail: value, life: 3000 })
  }
}
</script>

<template>
  <section
    v-if="contactItems.length"
    class="mt-10"
  >
    <h2 class="mb-[22px] text-[17.5px] leading-[21px] font-medium text-white">
      {{ contactsTitle }}
    </h2>

    <div class="flex flex-wrap justify-center gap-2.5 tiny:gap-[15px] wide:grid wide:grid-cols-3">
      <component
        :is="item.tag"
        v-for="item in contactItems"
        :key="item.key"
        v-bind="item.attrs"
        :class="item.background"
        class="block w-full max-w-[115px] cursor-pointer rounded-[15px] p-2 text-left transition-transform duration-400 hover:scale-105 focus-visible:outline-2 focus-visible:outline-white/60 tiny:max-w-[190px] tiny:min-w-[156px] tiny:p-[13px] wide:max-w-none wide:min-w-0"
        @click="copyContact(item.copyText)"
      >
        <span class="flex items-center gap-[9px] text-xs leading-[18px] font-medium text-white tiny:gap-[15px] tiny:text-sm">
          <img
            :src="item.icon"
            alt=""
            width="41"
            height="41"
            class="size-[25px] tiny:size-[41px]"
          >
          {{ item.label }}
        </span>
      </component>
    </div>
  </section>
</template>
