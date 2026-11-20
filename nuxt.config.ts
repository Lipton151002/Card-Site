import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import Aura from '@primeuix/themes/aura'
import site from './config/site'
import { normalizeDomain } from './shared/utils/domain'

const domain = normalizeDomain(site.domain)

if (site.domain.trim() && !domain) {
  console.warn(`[config/site.ts] Некорректный домен "${site.domain}" — он не будет использован.`)
}

export default defineNuxtConfig({
  compatibilityDate: '2026-11-20',
  hooks: {
    async 'nitro:build:public-assets'(nitro) {
      if (!domain || !nitro.options.static) return
      await writeFile(join(nitro.options.output.publicDir, 'CNAME'), `${domain}\n`)
    },
  },
  devtools: { enabled: true },
  modules: ['@primevue/nuxt-module'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  primevue: {
    components: { include: ['Toast'] },
    directives: { include: [] },
    composables: { include: ['useToast'] },
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.app-dark',
          cssLayer: {
            name: 'primevue',
            order: 'theme, base, primevue',
          },
        },
      },
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'ru', class: 'app-dark' },
      meta: [
        { name: 'theme-color', content: '#1E1E1E' },
      ],
      link: [
        { rel: 'preload', as: 'font', type: 'font/woff', href: '/fonts/Acrom-Regular.woff', crossorigin: '' },
        { rel: 'preload', as: 'font', type: 'font/woff', href: '/fonts/Acrom-Medium.woff', crossorigin: '' },
      ],
    },
  },
})
