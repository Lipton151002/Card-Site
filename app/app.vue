<script setup lang="ts">
const { site, features } = useAppConfig()

const faviconTypes: Record<string, string> = {
  svg: 'image/svg+xml',
  png: 'image/png',
  ico: 'image/x-icon',
}
const faviconType = faviconTypes[site.favicon.split('.').pop()?.toLowerCase() ?? '']

const origin = siteOrigin(site.domain)
const pageUrl = origin ? `${origin}/` : undefined
const previewImage = origin && site.previewImage ? new URL(site.previewImage, origin).href : undefined

useSeoMeta({
  title: site.title,
  description: site.description,
  ogTitle: site.title,
  ogDescription: site.description,
  ogUrl: pageUrl,
  ogType: 'website',
  ogImage: previewImage,
  twitterCard: previewImage ? 'summary_large_image' : 'summary',
  twitterTitle: site.title,
  twitterDescription: site.description,
  twitterImage: previewImage,
})

useHead({
  link: [
    { rel: 'icon', type: faviconType, href: site.favicon },
    ...(pageUrl ? [{ rel: 'canonical' as const, href: pageUrl }] : []),
  ],
  script: site.googleAnalyticsId
    ? [
        { src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(site.googleAnalyticsId)}`, async: true },
        { innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(site.googleAnalyticsId)});` },
      ]
    : [],
})
</script>

<template>
  <SonarGrid
    color="#6366f1"
    class="min-h-dvh"
  >
    <div class="flex min-h-dvh flex-col items-center justify-center px-5 py-10 font-acrom">
      <main class="w-full max-w-[740px] rounded-[30px] border border-white/12 bg-glass p-[30px] backdrop-blur-md">
        <ProfileHeader />

        <section class="mt-[25px] grid grid-cols-1 gap-[15px] wide:grid-cols-2">
          <FeatureCard
            v-for="(feature, index) in features"
            :key="feature.title"
            v-bind="feature"
            :shine-delay="index * 0.6"
          />
        </section>

        <ContactLinks />
      </main>
    </div>

    <Toast position="top-center" />
  </SonarGrid>
</template>
