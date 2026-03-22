export function initHero() {
  runReveal()
  document.getElementById('hero')!
    .addEventListener('click', runReveal)
}

function runReveal() {
  // Reset lines
  for (let i = 0; i < 5; i++) {
    const el = document.getElementById(`l${i}`)!
    el.style.transition = 'none'
    el.classList.remove('in')
  }

  // Reset annotations
  ;['box1', 'box2', 'c1', 'c2'].forEach(id => {
    document.getElementById(id)!.classList.remove('on')
  })

  // Reset rule
  const rule = document.getElementById('hrule')!
  rule.style.transition = 'none'
  rule.classList.remove('in')

  // Trigger reflow then animate
  requestAnimationFrame(() => requestAnimationFrame(() => {
    for (let i = 0; i < 5; i++) {
      const el = document.getElementById(`l${i}`)!
      el.style.transition = `transform 720ms cubic-bezier(0.16,1,0.3,1) ${i * 85}ms`
      el.classList.add('in')
    }

    // Wait for all line animations to complete (last line starts at 340ms + 720ms duration)
    setTimeout(placeAndShowCallouts, 1060)

    setTimeout(() => {
      rule.style.transition = 'width 700ms cubic-bezier(0.16,1,0.3,1)'
      rule.classList.add('in')
    }, 460)
  }))
}

function placeAndShowCallouts() {
  const container = document.querySelector<HTMLElement>('.hero-content')!
  const hr        = container.getBoundingClientRect()

  const b1 = document.getElementById('box1')!.getBoundingClientRect()
  const b2 = document.getElementById('box2')!.getBoundingClientRect()
  const l1 = document.getElementById('l1')!.getBoundingClientRect()
  const l2 = document.getElementById('l2')!.getBoundingClientRect()
  const l3 = document.getElementById('l3')!.getBoundingClientRect()
  const l4 = document.getElementById('l4')!.getBoundingClientRect()

  const gap12 = ((l1.bottom + l2.top) / 2) - hr.top
  const gap34 = ((l3.bottom + l4.top) / 2) - hr.top

  const c1 = document.getElementById('c1')!
  const c2 = document.getElementById('c2')!

  c1.style.top  = (gap12 - 5) + 'px'
  c1.style.left = (b1.left - hr.left + 4) + 'px'

  c2.style.top  = (gap34 - 5) + 'px'
  c2.style.left = Math.max(0, (b2.right - hr.left - c2.offsetWidth - 4)) + 'px'

  setTimeout(() => {
    document.getElementById('box1')!.classList.add('on')
    c1.classList.add('on')
  }, 0)
  setTimeout(() => {
    document.getElementById('box2')!.classList.add('on')
    c2.classList.add('on')
  }, 200)
}

// Fade in CTA after lines finish
const cta = document.querySelector<HTMLElement>('.hero-cta')
if (cta) {
  cta.style.transition = 'none'
  cta.style.opacity = '0'
  cta.style.transform = 'translateY(10px)'
  setTimeout(() => {
    cta.style.transition = 'opacity 500ms ease, transform 500ms cubic-bezier(0.16,1,0.3,1)'
    cta.style.opacity = '1'
    cta.style.transform = 'translateY(0)'
  }, 500)
}
