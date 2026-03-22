export function initWork() {
  const cards = document.querySelectorAll<HTMLElement>('.work-card:not(.work-card--more)')

  cards.forEach(card => {
    // Parallax on the background on mousemove
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect()
      const x  = (e.clientX - r.left) / r.width  - 0.5
      const y  = (e.clientY - r.top)  / r.height - 0.5
      const bg = card.querySelector<HTMLElement>('.work-card-bg')
      if (bg) {
        bg.style.transform = `scale(1) translate(${x * 12}px, ${y * 12}px)`
      }
    })

    card.addEventListener('mouseleave', () => {
      const bg = card.querySelector<HTMLElement>('.work-card-bg')
      if (bg) {
        bg.style.transform = 'scale(1.04) translate(0,0)'
      }
    })
  })
}
