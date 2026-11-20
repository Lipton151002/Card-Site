<script setup lang="ts">
interface Ring {
  x: number
  y: number
  born: number
}

interface SonarGridProps {
  spacing?: number
  dotRadius?: number
  baseOpacity?: number
  peakOpacity?: number
  color?: string
  pingEvery?: number
  speed?: number
  ringWidth?: number
  amplitude?: number
  interactive?: boolean
  maxRings?: number
  seedPing?: boolean
  pingArea?: readonly number[]
}

const props = withDefaults(defineProps<SonarGridProps>(), {
  spacing: 26,
  dotRadius: 1.4,
  baseOpacity: 0.15,
  peakOpacity: 0.55,
  color: '',
  pingEvery: 2.4,
  speed: 260,
  ringWidth: 90,
  amplitude: 1.6,
  interactive: true,
  maxRings: 6,
  seedPing: true,
  pingArea: () => [0.15, 0.2, 0.85, 0.8],
})

const MAX_DPR = 2
const LOW_POWER_QUERY = '(max-width: 640px), (pointer: coarse)'
const LOW_POWER_MAX_DPR = 1.5
const LOW_POWER_FPS = 30
const LOW_POWER_SPACING_SCALE = 1.35
const TAU = Math.PI * 2

const hostRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

let refresh = () => {}
let teardown = () => {}

function resolvePingArea(): [number, number, number, number] {
  const [x0 = 0.15, y0 = 0.2, x1 = 0.85, y1 = 0.8] = props.pingArea
  return [x0, y0, x1, y1]
}

onMounted(() => {
  const host = hostRef.value
  const canvas = canvasRef.value
  if (!host || !canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const lowPowerQuery = window.matchMedia(LOW_POWER_QUERY)
  let lowPower = lowPowerQuery.matches
  let rings: Ring[] = []
  let width = 0
  let height = 0
  let raf = 0
  let timer = 0
  let lastFrame = 0
  let visible = true
  let seeded = false
  let fill = ''
  let nextPing = performance.now() + props.pingEvery * 1000

  const readColor = () => {
    fill = getComputedStyle(canvas).color
  }

  const addRing = (x: number, y: number, born: number) => {
    readColor()
    rings.push({ x, y, born })
    while (rings.length > props.maxRings) rings.shift()
  }

  const draw = (now: number) => {
    const { dotRadius, baseOpacity, peakOpacity, speed, ringWidth, amplitude } = props
    const spacing = props.spacing * (lowPower ? LOW_POWER_SPACING_SCALE : 1)
    const lifetime = (Math.hypot(width, height) + ringWidth) / speed
    rings = rings.filter(ring => (now - ring.born) / 1000 < lifetime)
    const live = rings.map((ring) => {
      const age = (now - ring.born) / 1000
      const radius = age * speed
      return { x: ring.x, y: ring.y, radius, reach: radius + ringWidth, fade: 1 - age / lifetime }
    })

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = fill

    const cols = Math.ceil(width / spacing) + 1
    const rows = Math.ceil(height / spacing) + 1
    const offsetX = (width - (cols - 1) * spacing) / 2
    const offsetY = (height - (rows - 1) * spacing) / 2

    const hot: number[] = []
    ctx.globalAlpha = baseOpacity
    ctx.beginPath()
    for (let i = 0; i < cols; i++) {
      const cx = offsetX + i * spacing
      for (let j = 0; j < rows; j++) {
        const cy = offsetY + j * spacing
        let energy = 0
        for (const ring of live) {
          if (Math.abs(cx - ring.x) > ring.reach || Math.abs(cy - ring.y) > ring.reach) continue
          const distance = Math.abs(Math.hypot(cx - ring.x, cy - ring.y) - ring.radius)
          if (distance >= ringWidth) continue
          const t = 1 - distance / ringWidth
          const strength = t * t * (3 - 2 * t) * ring.fade
          if (strength > energy) energy = strength
        }
        if (energy < 0.01) {
          ctx.moveTo(cx + dotRadius, cy)
          ctx.arc(cx, cy, dotRadius, 0, TAU)
        }
        else {
          hot.push(cx, cy, energy)
        }
      }
    }
    ctx.fill()

    const peak = Math.max(baseOpacity, peakOpacity)
    for (let k = 0; k < hot.length; k += 3) {
      const energy = hot[k + 2] ?? 0
      ctx.globalAlpha = baseOpacity + (peak - baseOpacity) * energy
      ctx.beginPath()
      ctx.arc(hot[k] ?? 0, hot[k + 1] ?? 0, dotRadius * (1 + amplitude * energy), 0, TAU)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    width = Math.max(1, Math.round(rect.width))
    height = Math.max(1, Math.round(rect.height))
    const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? LOW_POWER_MAX_DPR : MAX_DPR)
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    if (!seeded) {
      seeded = true
      const [x0, y0, x1, y1] = resolvePingArea()
      if (props.seedPing && !reduceMotion.matches) {
        addRing(width * (x0 + (x1 - x0) * 0.68), height * (y0 + (y1 - y0) * 0.34), performance.now() - 500)
      }
    }
    draw(performance.now())
  }

  const scheduleIdle = (delay: number) => {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => tick(performance.now()), Math.max(16, delay))
  }

  const tick = (now: number) => {
    raf = 0
    if (!visible || document.hidden) return
    if (reduceMotion.matches) {
      rings = []
      draw(now)
      return
    }
    if (lowPower && rings.length > 0 && now - lastFrame < 1000 / LOW_POWER_FPS) {
      raf = requestAnimationFrame(tick)
      return
    }
    lastFrame = now
    if (props.pingEvery > 0 && now >= nextPing) {
      const [x0, y0, x1, y1] = resolvePingArea()
      addRing(width * (x0 + Math.random() * (x1 - x0)), height * (y0 + Math.random() * (y1 - y0)), now)
      nextPing = now + props.pingEvery * 1000
    }
    draw(now)
    if (rings.length > 0) raf = requestAnimationFrame(tick)
    else if (props.pingEvery > 0) scheduleIdle(nextPing - now)
  }

  const wake = () => {
    if (!raf) {
      window.clearTimeout(timer)
      raf = requestAnimationFrame(tick)
    }
  }

  refresh = () => {
    readColor()
    nextPing = Math.min(nextPing, performance.now() + props.pingEvery * 1000)
    wake()
  }

  const onPointerDown = (event: PointerEvent) => {
    if (!props.interactive || reduceMotion.matches) return
    const rect = canvas.getBoundingClientRect()
    addRing(event.clientX - rect.left, event.clientY - rect.top, performance.now())
    wake()
  }

  const onVisibilityChange = () => {
    if (!document.hidden) wake()
  }

  const onLowPowerChange = () => {
    lowPower = lowPowerQuery.matches
    resize()
    wake()
  }

  const resizeObserver = new ResizeObserver(resize)
  const intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      visible = entry?.isIntersecting ?? true
      if (visible) wake()
    },
    { threshold: 0 },
  )
  const mutationObserver = new MutationObserver(() => refresh())

  readColor()
  resize()
  resizeObserver.observe(canvas)
  intersectionObserver.observe(host)
  mutationObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] })
  host.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('visibilitychange', onVisibilityChange)
  reduceMotion.addEventListener('change', wake)
  lowPowerQuery.addEventListener('change', onLowPowerChange)
  wake()

  teardown = () => {
    resizeObserver.disconnect()
    intersectionObserver.disconnect()
    mutationObserver.disconnect()
    host.removeEventListener('pointerdown', onPointerDown)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    reduceMotion.removeEventListener('change', wake)
    lowPowerQuery.removeEventListener('change', onLowPowerChange)
    cancelAnimationFrame(raf)
    window.clearTimeout(timer)
    refresh = () => {}
  }
})

onBeforeUnmount(() => teardown())

watch(() => ({ ...props, pingArea: [...props.pingArea] }), () => refresh(), { flush: 'post' })
</script>

<template>
  <div
    ref="hostRef"
    data-slot="sonar-grid"
    class="relative isolate overflow-hidden"
  >
    <canvas
      ref="canvasRef"
      aria-hidden="true"
      class="pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh w-full text-primary"
      :style="color ? { color } : undefined"
    />
    <div
      aria-hidden="true"
      class="pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh w-full bg-[radial-gradient(ellipse_55%_50%_at_50%_50%,var(--color-page)_0%,transparent_100%)] opacity-85"
    />
    <slot />
  </div>
</template>
