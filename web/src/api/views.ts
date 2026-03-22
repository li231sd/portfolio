export async function trackView(slug: string): Promise<number> {
  const res = await fetch(`/api/views/${slug}`, { method: 'POST' })
  const { count } = await res.json()
  return count
}
