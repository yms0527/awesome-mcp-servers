"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { trackSearchPerformed, trackChartInteraction } from "@/lib/gtm"

const API_KEY = process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY
const CACHE_DURATION = 1000 * 60 * 30 // 30 minutes

export default function RealTimeTab() {
  const [symbol, setSymbol] = useState("QQQ")
  const [input, setInput] = useState("QQQ")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [priceData, setPriceData] = useState<any[]>([])
  const [realTimeData, setRealTimeData] = useState<any | null>(null)

  // Fetch and cache logic
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError("")
      const cacheKey = `realtime_${symbol}`
      const cacheRaw = localStorage.getItem(cacheKey)
      if (cacheRaw) {
        const cache = JSON.parse(cacheRaw)
        if (Date.now() - cache.time < CACHE_DURATION) {
          setPriceData(cache.priceData)
          setRealTimeData(cache.realTimeData)
          setLoading(false)
          return
        }
      }
      try {
        if (!API_KEY) throw new Error("Twelve Data API key is missing. Please set NEXT_PUBLIC_TWELVE_DATA_API_KEY in your .env file.")

        // Fetch quote data for real-time info
        const quoteUrl = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${API_KEY}`
        const quoteRes = await fetch(quoteUrl)
        const quoteData = await quoteRes.json()
        
        if (quoteData.status === "error" || !quoteData.close) {
          setError(quoteData.message || "No data found for this symbol.")
          setPriceData([])
          setRealTimeData(null)
          setLoading(false)
          return
        }

        // Fetch time series data for the chart
        const timeSeriesUrl = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=45&apikey=${API_KEY}`
        const timeSeriesRes = await fetch(timeSeriesUrl)
        const timeSeriesData = await timeSeriesRes.json()

        if (timeSeriesData.status === "error" || !timeSeriesData.values) {
          setError(timeSeriesData.message || "Failed to fetch historical data.")
          setPriceData([])
          setRealTimeData(null)
          setLoading(false)
          return
        }

        // Parse time series data for chart
        const values = timeSeriesData.values.reverse()
        const priceData = values.map((v: any) => ({ date: v.datetime, price: parseFloat(v.close) }))

        // Parse quote data for real-time info
        const currentPrice = parseFloat(quoteData.close)
        const dailyChange = parseFloat(quoteData.change)
        const dailyChangePercent = parseFloat(quoteData.percent_change)

        const realTimeData = {
          currentPrice,
          dailyChange,
          dailyChangePercent,
        }

        setPriceData(priceData)
        setRealTimeData(realTimeData)
        localStorage.setItem(cacheKey, JSON.stringify({ priceData, realTimeData, time: Date.now() }))
      } catch (e) {
        setError("Failed to fetch data.")
        setPriceData([])
        setRealTimeData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [symbol])

  const isPositive = realTimeData && realTimeData.dailyChangePercent > 0

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (input.trim() && input.trim().toUpperCase() !== symbol) {
      const searchQuery = input.trim().toUpperCase()
      setSymbol(searchQuery)
      
      // Track search event
      trackSearchPerformed(searchQuery)
    }
  }

  // Handle chart interactions
  const handleChartClick = () => {
    trackChartInteraction('price_trend_chart', 'click')
  }

  const handleChartHover = () => {
    trackChartInteraction('price_trend_chart', 'hover')
  }

  return (
    <div className="space-y-6">
      <form className="flex items-center gap-2" onSubmit={handleSearch}>
        <Input
          placeholder="Enter ETF symbol (e.g. QQQ, SPY)"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-[200px]"
        />
        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-blue-700 font-semibold text-sm">Search</button>
      </form>

      {loading ? (
        <div className="text-center py-12 text-lg">Loading...</div>
      ) : error ? (
        <div className="text-center py-12 text-lg text-red-600 font-semibold">{error}</div>
      ) : realTimeData ? (
        <>
          {/* Real-time KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800">
              <CardHeader className="pb-2">
                <CardDescription>Current Price (Adjusted Close)</CardDescription>
                <CardTitle className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  ${realTimeData.currentPrice.toFixed(2)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">As of market close</p>
              </CardContent>
            </Card>

            <Card
              className={`bg-gradient-to-br ${isPositive ? "from-green-500/10 to-green-600/5 border-green-200 dark:border-green-800" : "from-red-500/10 to-red-600/5 border-red-200 dark:border-red-800"}`}
            >
              <CardHeader className="pb-2">
                <CardDescription>Daily Change</CardDescription>
                <CardTitle
                  className={`text-3xl font-bold flex items-center gap-2 ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {isPositive ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                  {isPositive ? "+" : ""}${realTimeData.dailyChange.toFixed(2)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">1-day price movement</p>
              </CardContent>
            </Card>

            <Card
              className={`bg-gradient-to-br ${isPositive ? "from-green-500/10 to-green-600/5 border-green-200 dark:border-green-800" : "from-red-500/10 to-red-600/5 border-red-200 dark:border-red-800"}`}
            >
              <CardHeader className="pb-2">
                <CardDescription>Daily Change %</CardDescription>
                <CardTitle
                  className={`text-3xl font-bold flex items-center gap-2 ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {isPositive ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                  {isPositive ? "+" : ""}
                  {realTimeData.dailyChangePercent.toFixed(2)}%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Percentage change</p>
              </CardContent>
            </Card>
          </div>

          {/* Price Trend Chart - Full Width */}
          <Card>
            <CardHeader>
              <CardTitle>45-Day Price Trend</CardTitle>
              <CardDescription>Adjusted closing prices for the last 45 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  price: { label: "Price", color: "hsl(var(--chart-1))" },
                }}
                className="h-[400px] w-full"
              >
                <LineChart 
                  data={priceData} 
                  width={1200} 
                  height={400}
                  onClick={handleChartClick}
                  onMouseEnter={handleChartHover}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    }
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    domain={["dataMin - 5", "dataMax + 5"]} 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.toFixed(2)}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  )
}
