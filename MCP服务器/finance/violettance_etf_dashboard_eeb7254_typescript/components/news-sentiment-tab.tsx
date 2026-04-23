"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { trackCardClick } from "@/lib/gtm"

const TOPICS = [
  { key: "technology", label: "Technology" },
  { key: "financial_markets", label: "Financial Markets" },
  { key: "economy_macro", label: "Economy Macro" },
  { key: "economy_monetary", label: "Economy Monetary" },
  { key: "economy_fiscal", label: "Economy Fiscal" },
]
const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY
const CACHE_DURATION = 1000 * 60 * 30 // 30 minutes

type NewsFeed = Record<string, any[]>

function formatDateTime(dt: string) {
  // dt: 20250524T225408
  const y = dt.slice(0, 4)
  const m = dt.slice(4, 6)
  const d = dt.slice(6, 8)
  const H = dt.slice(9, 11)
  const M = dt.slice(11, 13)
  const date = new Date(`${y}-${m}-${d}T${H}:${M}`)
  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

function sentimentBadge(label: string) {
  switch (label) {
    case "Bullish":
    case "Somewhat-Bullish":
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-800">🟢 {label}</span>
    case "Bearish":
    case "Somewhat-Bearish":
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800">🔴 {label}</span>
    default:
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-800">🟡 {label}</span>
  }
}

function SentimentBar({ score }: { score: number }) {
  // -1 to +1, show a colored bar
  const percent = (score + 1) * 50
  let color = "bg-gray-300"
  if (score > 0.15) color = "bg-green-400"
  else if (score < -0.15) color = "bg-red-400"
  else color = "bg-yellow-400"
  return (
    <div className="w-full h-2 bg-gray-200 rounded mt-1" title={score.toFixed(2)}>
      <div className={`${color} h-2 rounded`} style={{ width: `${percent}%` }} />
    </div>
  )
}

function TickerBadges({ tickers }: { tickers: any[] }) {
  if (!tickers || !tickers.length) return null
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {tickers.map((t, i) => (
        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
          {t.ticker} {t.ticker_sentiment_score > 0 ? "🔼" : t.ticker_sentiment_score < 0 ? "🔽" : ""}{" "}{Number(t.ticker_sentiment_score).toFixed(2)}
        </span>
      ))}
    </div>
  )
}

export default function NewsSentimentTab() {
  const [newsByTopic, setNewsByTopic] = useState<NewsFeed>({})
  const [loading, setLoading] = useState(true)
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0].key)
  const [rateLimitInfo, setRateLimitInfo] = useState<{ time: number } | null>(null)
  const [rateLimitCountdown, setRateLimitCountdown] = useState<{ hours: number, minutes: number } | null>(null)
  const [formattedNewsDates, setFormattedNewsDates] = useState<Record<string, string[]>>({})
  const cacheKey = 'newsByTopicCacheV2'
  const rateLimitKey = 'newsByTopicRateLimitV2'

  // Update rate limit countdown on client
  useEffect(() => {
    if (!rateLimitInfo) return;
    function updateCountdown() {
      if (!rateLimitInfo) return;
      const now = Date.now();
      const msSince = now - rateLimitInfo.time;
      const msToReset = 24 * 60 * 60 * 1000 - msSince;
      const hours = Math.floor(msToReset / (60 * 60 * 1000));
      const minutes = Math.floor((msToReset % (60 * 60 * 1000)) / (60 * 1000));
      setRateLimitCountdown({ hours, minutes });
    }
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [rateLimitInfo]);

  // Format news dates on client
  useEffect(() => {
    const formatted: Record<string, string[]> = {};
    Object.entries(newsByTopic).forEach(([topic, news]) => {
      formatted[topic] = news.map((item: any) => {
        const dt = item.time_published;
        if (!dt) return "";
        const y = dt.slice(0, 4)
        const m = dt.slice(4, 6)
        const d = dt.slice(6, 8)
        const H = dt.slice(9, 11)
        const M = dt.slice(11, 13)
        const date = new Date(`${y}-${m}-${d}T${H}:${M}`)
        return date.toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      })
    })
    setFormattedNewsDates(formatted)
  }, [newsByTopic])

  useEffect(() => {
    // Check localStorage for rate limit info BEFORE defining fetchAll
    const rateLimitRaw = localStorage.getItem(rateLimitKey)
    if (rateLimitRaw) {
      const rateLimit = JSON.parse(rateLimitRaw)
      // If less than 24 hours, show rate limit message and do not fetch
      if (Date.now() - rateLimit.time < 24 * 60 * 60 * 1000) {
        setRateLimitInfo(rateLimit)
        setLoading(false)
        return
      } else {
        localStorage.removeItem(rateLimitKey)
      }
    }
    async function fetchAll() {
      if (!API_KEY) throw new Error("Alpha Vantage API key is missing. Please set NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY in your .env file.");
      setLoading(true)
      // Check localStorage for cache
      const cacheRaw = localStorage.getItem(cacheKey)
      if (cacheRaw) {
        const cache = JSON.parse(cacheRaw)
        if (Date.now() - cache.time < 60 * 60 * 1000) { // 1 hour
          setNewsByTopic(cache.data)
          setLoading(false)
          return
        }
      }
      try {
        const result: NewsFeed = {}
        let rateLimited = false
        await Promise.all(
          TOPICS.map(async (topic) => {
            const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=${topic.key}&limit=9&sort=LATEST&apikey=${API_KEY}`
            const res = await fetch(url)
            const data = await res.json()
            if (data.Information && data.Information.includes('rate limit')) {
              rateLimited = true
            }
            let feed = data.feed || []
            feed = Array.from(new Map(feed.map((item: any) => [item.url, item])).values())
            result[topic.key] = feed
          })
        )
        if (rateLimited) {
          const info = { time: Date.now() }
          setRateLimitInfo(info)
          localStorage.setItem(rateLimitKey, JSON.stringify(info))
          setLoading(false)
          return
        }
        localStorage.setItem(cacheKey, JSON.stringify({ data: result, time: Date.now() }))
        setNewsByTopic(result)
        setRateLimitInfo(null)
      } catch (e) {
        setNewsByTopic({})
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const filteredNews = newsByTopic[selectedTopic] || []

  // Rate limit UI
  function renderRateLimit() {
    if (!rateLimitInfo || !rateLimitCountdown) return null
    const { hours, minutes } = rateLimitCountdown
    return (
      <div className="text-center py-12 text-lg text-red-600 font-semibold">
        API rate limit exceeded. The limit will reset tomorrow.<br />
        Try again in {hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : ''}{hours > 0 && minutes > 0 ? ' and ' : ''}{minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : ''}.
      </div>
    )
  }

  // Handle news card clicks
  const handleCardClick = (item: any) => {
    const cardId = item.title?.slice(0, 50) || 'unknown_card'
    const sentiment = item.overall_sentiment_label || 'neutral'
    trackCardClick(cardId, sentiment)
  }

  const handleReadMoreClick = (item: any) => {
    const cardId = item.title?.slice(0, 50) || 'unknown_card'
    const sentiment = item.overall_sentiment_label || 'neutral'
    trackCardClick(cardId, sentiment)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Latest News Sentiment</CardTitle>
            <CardDescription>Powered by Alpha Vantage News Sentiment API</CardDescription>
          </div>
          <div>
            <select
              className="border rounded px-3 py-1 text-sm"
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
            >
              {TOPICS.map(t => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {rateLimitInfo ? (
            renderRateLimit()
          ) : loading ? (
            <div className="text-center py-12 text-lg">Loading news...</div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-12 text-lg">No news found for this topic.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((item: any, idx: number) => (
                <Card 
                  key={item.url + idx} 
                  className="flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleCardClick(item)}
                >
                  <div className="relative w-full h-32 mb-2">
                    {item.banner_image && typeof item.banner_image === 'string' && item.banner_image.trim() !== '' ? (
                      <Image src={item.banner_image} alt="news" fill className="object-cover rounded-t" />
                    ) : (
                      <Image src="/banner_image_placeholder.png" alt="placeholder" fill className="object-cover rounded-t" />
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold line-clamp-2">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="text-xs text-gray-500 mb-1">{item.source}</div>
                    <div className="text-xs text-gray-400 mb-1">{formattedNewsDates[selectedTopic]?.[idx]}</div>
                    <div className="mb-2 text-sm text-gray-700 line-clamp-3">{item.summary}</div>
                    <div className="mb-2">{sentimentBadge(item.overall_sentiment_label)}</div>
                    <SentimentBar score={item.overall_sentiment_score} />
                    <TickerBadges tickers={item.ticker_sentiment} />
                    <div className="mt-3">
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-block px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-semibold"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleReadMoreClick(item)
                        }}
                      >
                        Read more
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
