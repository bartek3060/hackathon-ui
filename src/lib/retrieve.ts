import Fuse from "fuse.js"
import type { FuseResultMatch } from "fuse.js"
import { db } from "@/lib/db"

export interface RetrievedDoc {
  id: string
  url: string
  title: string
  text: string
  snippet: string
  score: number
}

interface CorpusRow {
  id: string
  url: string
  title: string
  text: string
}

let fuse: Fuse<CorpusRow> | null = null
let loadedDocs: CorpusRow[] = []

function makeSnippet(text: string, matches: readonly FuseResultMatch[] | undefined, maxLen = 400): string {
  if (!text) return ""
  if (matches && matches.length > 0) {
    const match = matches.find(m => m.key === "text") || matches[0]
    if (match && match.indices && match.indices.length > 0) {
      const [start, end] = match.indices[0]
      const center = Math.max(0, Math.min(text.length, Math.floor((start + end) / 2)))
      const half = Math.floor(maxLen / 2)
      const from = Math.max(0, center - half)
      const to = Math.min(text.length, from + maxLen)
      const slice = text.slice(from, to)
      const prefix = from > 0 ? "…" : ""
      const suffix = to < text.length ? "…" : ""
      return `${prefix}${slice}${suffix}`
    }
  }
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen) + "…"
}

export function initRetriever() {
  loadedDocs = db
    .prepare("SELECT id, url, title, text FROM corpus WHERE text IS NOT NULL AND length(text) > 0 LIMIT 20000")
    .all() as CorpusRow[]
  fuse = new Fuse(loadedDocs, {
    keys: [
      { name: "title", weight: 0.6 },
      { name: "text", weight: 0.4 },
    ],
    includeScore: true,
    includeMatches: true,
    threshold: 0.3,
    ignoreLocation: true,
    minMatchCharLength: 3,
    distance: 200,
  })
  console.log(`🔍 Retriever initialized (${loadedDocs.length} docs)`)
}

export function retrieve(query: string, k = 5): RetrievedDoc[] {
  if (!fuse) initRetriever()
  if (!fuse) return []
  const results = fuse.search(query).slice(0, k)
  return results.map((r) => ({
    ...r.item,
    snippet: makeSnippet(r.item.text, r.matches),
    score: r.score ?? 0,
  }))
}

export function refreshRetriever() {
  fuse = null
  loadedDocs = []
  initRetriever()
}

