import { expandCursor, resetCursor } from './cursor'

export function initMagnetic(el: HTMLElement, strength = 0.42, radius = 100) {
  let mx = 0, my = 0

  document.addEventListener('mousemove', e => {
    mx = e.clientX
    my = e.clientY
  })

  function tick() {
    const r    = el.getBoundingClientRect()
    const dx   = mx - (r.left + r.width  / 2)
    const dy   = my - (r.top  + r.height / 2)
    const dist = Math.hypot(dx, dy)

    if (dist < radius) {
      const pull = (1 - dist / radius) * strength
      el.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`
      expandCursor()
    } else {
      el.style.transform = ''
      resetCursor()
    }

    requestAnimationFrame(tick)
  }

  tick()
}
