const dot  = document.getElementById('cursor-dot')!
const ring = document.getElementById('cursor-ring')!

let mx = 0, my = 0
let rx = 0, ry = 0

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

function tick() {
  rx = lerp(rx, mx, 0.13)
  ry = lerp(ry, my, 0.13)

  dot.style.left  = mx + 'px'
  dot.style.top   = my + 'px'
  ring.style.left = rx + 'px'
  ring.style.top  = ry + 'px'

  requestAnimationFrame(tick)
}

export function initCursor() {
  // Always run the loop — no start/stop
  tick()

  document.addEventListener('mousemove', e => {
    mx = e.clientX
    my = e.clientY
    dot.style.opacity  = '1'
    ring.style.opacity = '0.4'
  })

  // Only hide on true window exit, not element boundaries
  document.addEventListener('mouseleave', e => {
    if (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
      dot.style.opacity  = '0'
      ring.style.opacity = '0'
    }
  })
}

export function expandCursor() {
  ring.style.width   = '48px'
  ring.style.height  = '48px'
  ring.style.opacity = '0.7'
}

export function resetCursor() {
  ring.style.width   = '28px'
  ring.style.height  = '28px'
  ring.style.opacity = '0.4'
}
