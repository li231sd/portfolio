export function initSmoothScroll() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href')
      if (!href || href === '#') return

      const target = document.querySelector<HTMLElement>(href)
      if (!target) return

      e.preventDefault()

      // Flash the section tag briefly
      const tag = target.querySelector<HTMLElement>('.s-tag')
      if (tag) {
        tag.style.transition = 'none'
        tag.style.background = 'var(--ink)'
        setTimeout(() => {
          tag.style.transition = 'background 600ms ease'
          tag.style.background = 'var(--celadon)'
        }, 150)
      }

      // Scroll
      const navHeight = (document.getElementById('nav')?.offsetHeight ?? 0)
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight

      window.scrollTo({ top, behavior: 'smooth' })
    })
  })
}
