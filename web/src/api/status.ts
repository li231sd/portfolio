export interface Status {
  available: boolean
  note: string
}

export function watchStatus(cb: (s: Status) => void): () => void {
  const es = new EventSource('/api/status')
  es.onmessage = e => cb(JSON.parse(e.data))
  es.onerror   = () => es.close()
  return () => es.close()
}
