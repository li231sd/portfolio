export function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement
  if (!canvas) return
  const ctx = canvas.getContext('2d')!

  const CELADON  = '#7ab8a0'
  const CELADON2 = '#4e8a72'
  const INK3     = '#4a524e'
  const NODE_COUNT = 22  // reduced from 38
  const DIST_SQ    = 0   // calculated on resize

  let W = 0, H = 0
  let distSq = 0
  let frame = 0
  let animId = 0
  let visible = true

  interface Node {
    x: number; y: number
    vx: number; vy: number
    r: number
    pulse: number
    pulseSpeed: number
  }

  let nodes: Node[] = []

  // ── Noise: generate ONCE, reuse every frame ──
  let noiseCanvas: HTMLCanvasElement | null = null

  function buildNoise(w: number, h: number) {
    noiseCanvas = document.createElement('canvas')
    noiseCanvas.width  = Math.floor(w / 2)  // half-res, stretched
    noiseCanvas.height = Math.floor(h / 2)
    const nCtx = noiseCanvas.getContext('2d')!
    const img  = nCtx.createImageData(noiseCanvas.width, noiseCanvas.height)
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 20
      img.data[i]     = v
      img.data[i + 1] = v + 4
      img.data[i + 2] = v + 2
      img.data[i + 3] = 12
    }
    nCtx.putImageData(img, 0, 0)
  }

  function resize() {
    // Use CSS pixels — no devicePixelRatio multiplication
    const rect = canvas.parentElement!.getBoundingClientRect()
    W = canvas.width  = Math.floor(rect.width  * 0.5)
    H = canvas.height = Math.floor(rect.height)
    canvas.style.width  = rect.width * 0.5 + 'px'
    canvas.style.height = rect.height + 'px'

    const d = W * 0.26
    distSq  = d * d

    buildNoise(W, H)
    initNodes()
  }

  function initNodes() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r:  Math.random() * 1.6 + 0.5,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.007 + Math.random() * 0.01,
    }))
  }

  function drawGrid() {
    ctx.strokeStyle = INK3
    ctx.lineWidth   = 0.4
    ctx.globalAlpha = 0.15
    ctx.beginPath()
    const cols = 6, rows = 8
    for (let c = 1; c < cols; c++) {
      const x = (c / cols) * W
      ctx.moveTo(x, 0); ctx.lineTo(x, H)
    }
    for (let r = 1; r < rows; r++) {
      const y = (r / rows) * H
      ctx.moveTo(0, y); ctx.lineTo(W, y)
    }
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  function drawConnections() {
    ctx.lineWidth = 0.6
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const d2 = dx * dx + dy * dy
        if (d2 > distSq) continue
        ctx.strokeStyle = CELADON2
        ctx.globalAlpha = (1 - d2 / distSq) * 0.3
        ctx.beginPath()
        ctx.moveTo(nodes[i].x, nodes[i].y)
        ctx.lineTo(nodes[j].x, nodes[j].y)
        ctx.stroke()
      }
    }
    ctx.globalAlpha = 1
  }

  function drawNodes() {
    for (const n of nodes) {
      const pulse = Math.sin(n.pulse) * 0.5 + 0.5
      const r = n.r + pulse * 1.0

      ctx.beginPath()
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
      ctx.fillStyle = CELADON
      ctx.globalAlpha = 0.45 + pulse * 0.45
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  function drawAccents() {
    const t = frame * 0.003

    // Large rotating square
    ctx.save()
    ctx.translate(W * 0.72, H * 0.3)
    ctx.rotate(t * 0.3)
    const sq = W * 0.18
    ctx.strokeStyle = INK3
    ctx.lineWidth   = 0.5
    ctx.globalAlpha = 0.1
    ctx.strokeRect(-sq / 2, -sq / 2, sq, sq)
    ctx.restore()

    // Small celadon square
    ctx.save()
    ctx.translate(W * 0.35, H * 0.68)
    ctx.rotate(-t * 0.5)
    const sq2 = W * 0.08
    ctx.strokeStyle = CELADON
    ctx.lineWidth   = 0.5
    ctx.globalAlpha = 0.08
    ctx.strokeRect(-sq2 / 2, -sq2 / 2, sq2, sq2)
    ctx.restore()

    // Crosshair
    ctx.save()
    ctx.translate(W * 0.88, H * 0.6)
    ctx.strokeStyle = CELADON
    ctx.lineWidth   = 0.5
    ctx.globalAlpha = 0.12
    const ch = W * 0.035
    ctx.beginPath()
    ctx.moveTo(-ch, 0); ctx.lineTo(ch, 0)
    ctx.moveTo(0, -ch); ctx.lineTo(0, ch)
    ctx.stroke()
    ctx.globalAlpha = 1
    ctx.restore()
  }

  // ── Throttle to 30fps ──
  let lastTime = 0
  function tick(time: number) {
    if (!visible) { animId = requestAnimationFrame(tick); return }

    if (time - lastTime < 33) { animId = requestAnimationFrame(tick); return }
    lastTime = time
    frame++

    ctx.clearRect(0, 0, W, H)

    // Draw static noise texture (no per-frame putImageData)
    if (noiseCanvas) ctx.drawImage(noiseCanvas, 0, 0, W, H)

    drawGrid()
    drawAccents()
    drawConnections()
    drawNodes()

    for (const n of nodes) {
      n.x += n.vx
      n.y += n.vy
      n.pulse += n.pulseSpeed
      if (n.x < 0 || n.x > W) n.vx *= -1
      if (n.y < 0 || n.y > H) n.vy *= -1
    }

    animId = requestAnimationFrame(tick)
  }

  resize()
  window.addEventListener('resize', resize)

  // Pause when hero not visible
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting
  })
  observer.observe(canvas)

  animId = requestAnimationFrame(tick)
}
