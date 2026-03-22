export interface ContactPayload {
  name:    string
  email:   string
  message: string
}

export async function submitContact(payload: ContactPayload): Promise<void> {
  const res = await fetch('/api/contact', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Something went wrong')
  }
}
