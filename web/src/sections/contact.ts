import { submitContact } from '../api/contact'

export function initContact() {
  const form   = document.getElementById('contact-form')   as HTMLFormElement
  const btn    = document.getElementById('contact-submit') as HTMLButtonElement
  const status = document.getElementById('form-status')    as HTMLParagraphElement

  if (!form) return

  form.addEventListener('submit', async e => {
    e.preventDefault()

    const name    = (form.querySelector('#name')    as HTMLInputElement).value.trim()
    const email   = (form.querySelector('#email')   as HTMLInputElement).value.trim()
    const message = (form.querySelector('#message') as HTMLTextAreaElement).value.trim()

    // Loading state
    btn.disabled    = true
    btn.textContent = 'Sending...'
    status.textContent = ''
    status.className   = 'form-status'

    try {
      await submitContact({ name, email, message })

      // Success
      btn.textContent    = 'Sent'
      status.textContent = 'Message received — I\'ll be in touch soon.'
      status.classList.add('form-status--success')
      form.reset()

      // Reset button after 3s
      setTimeout(() => {
        btn.disabled    = false
        btn.textContent = 'Send Message'
      }, 3000)

    } catch (err: any) {
      // Error
      btn.disabled    = false
      btn.textContent = 'Send Message'
      status.textContent = err.message || 'Failed to send — please try again.'
      status.classList.add('form-status--error')
    }
  })
}
