import { db } from "@/lib/db"
import crypto from "crypto"
import * as cheerio from "cheerio"
import fs from "fs"
import path from "path"

function parseSitemapIndex(localPath: string): string[] {
  const content = fs.readFileSync(path.resolve(process.cwd(), localPath), "utf-8")
  const $ = cheerio.load(content, { xmlMode: true })
  
  const sitemapUrls: string[] = []
  $('sitemap loc').each((_, elem) => {
    const url = $(elem).text().trim()
    if (url) sitemapUrls.push(url)
  })
  
  return sitemapUrls
}

async function fetchSubSitemap(url: string): Promise<string[]> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      }
    })
    
    if (!response.ok) return []
    
    const xml = await response.text()
    const $ = cheerio.load(xml, { xmlMode: true })
    
    const urls: string[] = []
    $('url loc').each((_, elem) => {
      const pageUrl = $(elem).text().trim()
      if (
        pageUrl && 
        pageUrl.startsWith("https://www.zus.pl/") &&
        !pageUrl.startsWith("https://www.zus.pl/en/")
      ) {
        urls.push(pageUrl)
      }
    })
    
    return urls
  } catch (error) {
    console.warn(`  ⚠️  Failed to fetch ${url}`)
    return []
  }
}

async function extractContent(url: string) {
  try {
    // Fetch HTML with proper headers
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1"
      }
    })

    if (!response.ok) {
      console.log(`  ⚠️  HTTP ${response.status}`)
      return null
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Aggressive element removal - everything that's not content
    $('script, style, iframe, noscript, svg, img').remove()
    $('nav, header, footer, aside').remove()
    $('.navigation, .nav, .menu, .breadcrumb, .sidebar').remove()
    $('.cookie, .banner, .advertisement, .social, .share').remove()
    $('[role="navigation"], [role="banner"], [role="complementary"]').remove()

    // Extract title from multiple sources
    let title = ""
    
    // Try h1 in main content first
    const mainH1 = $('main h1, article h1, [role="main"] h1').first().text().trim()
    if (mainH1) title = mainH1
    
    // Try any h1
    if (!title) title = $('h1').first().text().trim()
    
    // Try h2 as fallback
    if (!title) title = $('h2').first().text().trim()
    
    // Try page title meta
    if (!title) title = $('meta[property="og:title"]').attr('content')?.trim() || ""
    
    // Try title tag
    if (!title) {
      const pageTitle = $('title').text().trim()
      title = pageTitle
        .replace(/\s*[-|]\s*ZUS.*$/i, '')
        .replace(/\s*[-|]\s*Zakład Ubezpieczeń Społecznych.*$/i, '')
        .trim()
    }
    
    // Debug: show what we found
    if (!title || title.length < 3) {
      const h1Text = $('h1').first().text().slice(0, 100)
      const titleText = $('title').text().slice(0, 100)
      console.log(`  ⚠️  No valid title. H1: "${h1Text}", Title: "${titleText}"`)
      
      // Last resort: use URL path as title
      const urlParts = url.split('/').filter(p => p && p !== 'https:')
      if (urlParts.length > 1) {
        title = urlParts[urlParts.length - 1]
          .replace(/-/g, ' ')
          .replace(/\.html?$/i, '')
          .trim()
        console.log(`  → Using URL-based title: "${title}"`)
      }
      
      if (!title || title.length < 3) {
        return null
      }
    }

    // Extract from #main-content or fallback to body
    let mainArea = $('#main-content')
    if (mainArea.length === 0) {
      mainArea = $('body')
    }

    // Get all text from main area
    let text = mainArea.text()
      .replace(/\s+/g, " ")
      .trim()

    // Remove common navigation noise
    const noisePatterns = [
      /Ścieżka nawigacji/gi,
      /Menu nawigacji/gi,
      /Strona główna\s+rozwiń breadcrumbs/gi,
      /Przejdź do treści głównej/gi,
      /Przejdź do treści/gi,
      /Menu główne/gi,
      /Zaloguj się/gi,
      /Wyszukaj/gi,
      /Szukaj/gi,
      /Polityka prywatności.*$/gi,
      /Wszystkie prawa zastrzeżone.*$/gi,
      /Deklaracja dostępności.*$/gi,
      /© Copyright ZUS.*$/gi,
      /\(link otwiera nowe okno\)/gi,
      /\(otwiera w nowym oknie\)/gi,
      /Więcej informacji o EUMASS/gi,
    ]

    for (const pattern of noisePatterns) {
      text = text.replace(pattern, '')
    }

    text = text.trim()

    // Validate
    if (text.length < 300) {
      console.log(`  ⚠️  Too short: ${text.length} chars`)
      return null
    }

    // Limit size
    if (text.length > 15000) {
      text = text.substring(0, 15000)
      console.log(`  ✓ Truncated from ${mainArea.text().length} to 15k chars`)
    } else {
      console.log(`  ✓ Extracted ${text.length} chars`)
    }

    return { 
      title, 
      content: text 
    }

  } catch (err) {
    console.log("  ❌ Extraction error:", err instanceof Error ? err.message : String(err))
    return null
  }
}

// Helper to delay between requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function main() {
  const sitemapPath = "public/zus-sitemap.xml"
  const sitemapUrls = parseSitemapIndex(sitemapPath)
  console.log(`Sitemap index entries: ${sitemapUrls.length}`)

  const pageUrls: string[] = []
  const sitemapBatches: string[][] = []
  for (let i = 0; i < sitemapUrls.length; i += 50) {
    sitemapBatches.push(sitemapUrls.slice(i, i + 50))
  }

  for (let b = 0; b < sitemapBatches.length; b++) {
    const batch = sitemapBatches[b]
    const results = await Promise.all(batch.map((u) => fetchSubSitemap(u)))
    for (const arr of results) pageUrls.push(...arr)
    if ((b + 1) % 5 === 0) console.log(`Fetched ${Math.min((b + 1) * 50, sitemapUrls.length)} sub-sitemaps`)
    await delay(100)
  }

  const uniqueUrls = [...new Set(pageUrls)]
  console.log(`Total page URLs: ${uniqueUrls.length}`)

  const insert = db.prepare(
    `INSERT OR REPLACE INTO corpus (id, url, title, text, lang, lastModified) VALUES (?, ?, ?, ?, ?, ?)`
  )

  let saved = 0
  let skipped = 0
  const pageBatches: string[][] = []
  for (let i = 0; i < uniqueUrls.length; i += 12) {
    pageBatches.push(uniqueUrls.slice(i, i + 12))
  }

  for (let b = 0; b < pageBatches.length; b++) {
    const batch = pageBatches[b]
    const extracted = await Promise.all(batch.map((url) => extractContent(url)))
    for (let i = 0; i < batch.length; i++) {
      const url = batch[i]
      const result = extracted[i]
      if (!result) {
        skipped++
        continue
      }
      const id = crypto.createHash("sha1").update(url).digest("hex")
      const text = result.content.replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim()
      insert.run(id, url, result.title, text, "pl", new Date().toISOString())
      saved++
    }
    if ((b + 1) % 10 === 0) console.log(`Processed ${Math.min((b + 1) * 12, uniqueUrls.length)} pages`)
    await delay(150)
  }

  console.log(`Done. Saved: ${saved}, Skipped: ${skipped}`)
  const sample = db.prepare("SELECT title, length(text) as len FROM corpus ORDER BY RANDOM() LIMIT 3").all()
  console.log(JSON.stringify(sample, null, 2))
  process.exit(0)
}

main()

