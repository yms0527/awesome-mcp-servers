"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useIsMobile } from "@/hooks/use-mobile"
import { trackChartInteraction } from "@/lib/gtm"

interface TopPerformersData {
  threeYearData: Array<{ etf: string; return: number }>
  fiveYearData: Array<{ etf: string; return: number }>
  dividendData: Array<{ etf: string; yield: number }>
}

export default function TopPerformersTab() {
  const [data, setData] = useState<TopPerformersData | null>(null)
  const [loading, setLoading] = useState(true)
  const [category3Y, setCategory3Y] = useState<string>("All")
  const [category5Y, setCategory5Y] = useState<string>("All")
  const [categoryDiv, setCategoryDiv] = useState<string>("All")
  const [categories3Y, setCategories3Y] = useState<string[]>([])
  const [categories5Y, setCategories5Y] = useState<string[]>([])
  const [categoriesDiv, setCategoriesDiv] = useState<string[]>([])
  const [etfs, setEtfs] = useState<Array<{ symbol: string; name: string; threeYearReturn: number; fiveYearReturn: number; dividendYield: number; category: string }>>([])
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/usa_etf_data.csv")
        const text = await response.text()

        const lines = text.split("\n").filter((line) => line.trim())
        const headers = lines[0].split(",").map(h => h.replace(/"/g, ""))
        const symbolIndex = headers.findIndex(h => h === "symbol")
        const nameIndex = headers.findIndex(h => h === "longName")
        const threeYearIndex = headers.findIndex(h => h === "threeYearAverageReturn" || h === "threeYearReturn")
        const fiveYearIndex = headers.findIndex(h => h === "fiveYearAverageReturn" || h === "fiveYearReturn")
        const dividendYieldIndex = headers.findIndex(h => h === "dividendYield")
        const categoryIndex = headers.findIndex(h => h === "category")

        const etfList: Array<{ symbol: string; name: string; threeYearReturn: number; fiveYearReturn: number; dividendYield: number; category: string }> = []
        const categoryCounts3Y: Record<string, number> = {}
        const categoryCounts5Y: Record<string, number> = {}
        const categoryCountsDiv: Record<string, number> = {}

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",")
          const symbol = values[symbolIndex]?.replace(/"/g, "")
          const name = values[nameIndex]?.replace(/"/g, "")
          const raw3Y = values[threeYearIndex]
          const raw5Y = values[fiveYearIndex]
          const rawDiv = values[dividendYieldIndex]
          const cat = values[categoryIndex]?.replace(/"/g, "") || "Unknown"
          const threeYearReturn = raw3Y !== undefined && raw3Y.trim() !== "" ? Number.parseFloat(raw3Y.replace(/"/g, "")) * 100 : NaN
          const fiveYearReturn = raw5Y !== undefined && raw5Y.trim() !== "" ? Number.parseFloat(raw5Y.replace(/"/g, "")) * 100 : NaN
          const dividendYield = rawDiv !== undefined && rawDiv.trim() !== "" ? Number.parseFloat(rawDiv.replace(/"/g, "")) : NaN
          if (
            symbol &&
            !symbol.toLowerCase().includes("copy") &&
            !symbol.toLowerCase().includes("tweedy") &&
            !(name && (name.toLowerCase().includes("copy") || name.toLowerCase().includes("tweedy")))
          ) {
            etfList.push({ symbol, name, threeYearReturn, fiveYearReturn, dividendYield, category: cat })
            if (!isNaN(threeYearReturn) && threeYearReturn > 0) categoryCounts3Y[cat] = (categoryCounts3Y[cat] || 0) + 1
            if (!isNaN(fiveYearReturn) && fiveYearReturn > 0) categoryCounts5Y[cat] = (categoryCounts5Y[cat] || 0) + 1
            if (!isNaN(dividendYield) && dividendYield > 0) categoryCountsDiv[cat] = (categoryCountsDiv[cat] || 0) + 1
          }
        }
        const filteredCategories3Y = Object.entries(categoryCounts3Y)
          .filter(([cat, count]) => cat && cat !== "Unknown" && count >= 10)
          .map(([cat]) => cat)
        const filteredCategories5Y = Object.entries(categoryCounts5Y)
          .filter(([cat, count]) => cat && cat !== "Unknown" && count >= 10)
          .map(([cat]) => cat)
        const filteredCategoriesDiv = Object.entries(categoryCountsDiv)
          .filter(([cat, count]) => cat && cat !== "Unknown" && count >= 10)
          .map(([cat]) => cat)
        setCategories3Y(["All", ...filteredCategories3Y])
        setCategories5Y(["All", ...filteredCategories5Y])
        setCategoriesDiv(["All", ...filteredCategoriesDiv])
        setEtfs(etfList)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setCategories3Y(["All"])
        setCategories5Y(["All"])
        setCategoriesDiv(["All"])
        setEtfs([])
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  if (!etfs.length) {
    return <div className="flex items-center justify-center h-64">Error loading data</div>
  }

  // Top 20 for each metric, filtered by category if selected
  const filterByCategory = (arr: any[], cat: string) => cat === "All" ? arr : arr.filter((etf: any) => etf.category === cat)
  const top3Y = filterByCategory(etfs, category3Y)
    .filter((etf) => !isNaN(etf.threeYearReturn) && etf.threeYearReturn > 0)
    .sort((a, b) => b.threeYearReturn - a.threeYearReturn)
    .slice(0, 20)
    .map((etf) => ({ etf: etf.symbol, return: etf.threeYearReturn }))
  const top5Y = filterByCategory(etfs, category5Y)
    .filter((etf) => !isNaN(etf.fiveYearReturn) && etf.fiveYearReturn > 0)
    .sort((a, b) => b.fiveYearReturn - a.fiveYearReturn)
    .slice(0, 20)
    .map((etf) => ({ etf: etf.symbol, return: etf.fiveYearReturn }))
  const topDividend = filterByCategory(etfs, categoryDiv)
    .filter((etf) => !isNaN(etf.dividendYield) && etf.dividendYield > 0)
    .sort((a, b) => b.dividendYield - a.dividendYield)
    .slice(0, 20)
    .map((etf) => ({ etf: etf.symbol, yield: etf.dividendYield }))

  // Handle chart interactions
  const handle3YChartClick = () => {
    trackChartInteraction('top_3y_returns_chart', 'click')
  }

  const handle3YChartHover = () => {
    trackChartInteraction('top_3y_returns_chart', 'hover')
  }

  const handle5YChartClick = () => {
    trackChartInteraction('top_5y_returns_chart', 'click')
  }

  const handle5YChartHover = () => {
    trackChartInteraction('top_5y_returns_chart', 'hover')
  }

  const handleDividendChartClick = () => {
    trackChartInteraction('top_dividend_yields_chart', 'click')
  }

  const handleDividendChartHover = () => {
    trackChartInteraction('top_dividend_yields_chart', 'hover')
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* 3-Year Returns */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">Top ETFs by 3-Year Returns</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Highest performing ETFs by 3-year average return</CardDescription>
            </div>
            <div className="min-w-[180px] mt-2 sm:mt-0">
              <Select value={category3Y} onValueChange={setCategory3Y}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories3Y.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                return: { label: "3Y Return %", color: "hsl(var(--chart-1))" },
              }}
              className="h-[400px] w-full"
            >
              <BarChart 
                data={top3Y} 
                width={800} 
                height={400}
                onClick={handle3YChartClick}
                onMouseEnter={handle3YChartHover}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="etf" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} interval={0} />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="return" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* 5-Year Returns */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">Top ETFs by 5-Year Returns</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Highest performing ETFs by 5-year average return</CardDescription>
            </div>
            <div className="min-w-[180px] mt-2 sm:mt-0">
              <Select value={category5Y} onValueChange={setCategory5Y}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories5Y.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                return: { label: "5Y Return %", color: "hsl(var(--chart-2))" },
              }}
              className="h-[400px] w-full"
            >
              <BarChart 
                data={top5Y} 
                width={800} 
                height={400}
                onClick={handle5YChartClick}
                onMouseEnter={handle5YChartHover}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="etf" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} interval={0} />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="return" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Dividend Yields */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">Top ETFs by Dividend Yield</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Highest dividend yielding ETFs</CardDescription>
            </div>
            <div className="min-w-[180px] mt-2 sm:mt-0">
              <Select value={categoryDiv} onValueChange={setCategoryDiv}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesDiv.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                yield: { label: "Dividend Yield %", color: "hsl(var(--chart-3))" },
              }}
              className="h-[400px] w-full"
            >
              <BarChart 
                data={topDividend} 
                width={800} 
                height={400}
                onClick={handleDividendChartClick}
                onMouseEnter={handleDividendChartHover}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="etf" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} interval={0} />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="yield" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
