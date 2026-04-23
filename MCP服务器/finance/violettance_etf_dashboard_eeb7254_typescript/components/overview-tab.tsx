"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import { trackChartInteraction } from "@/lib/gtm"

interface OverviewData {
  totalAssets: number
  threeYearReturn: number
  fiveYearReturn: number
  dividendYieldData: Array<{ range: string; count: number }>
  trailingPEData: Array<{ range: string; count: number }>
}

export default function OverviewTab() {
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching CSV data...")
        const response = await fetch("/data/usa_etf_data.csv")
        const csvText = await response.text()
        const lines = csvText.split("\n").filter((line) => line.trim())
        
        // Get header row and find dividendYield and trailingPE column indices
        const headers = lines[0].split(",").map(h => h.replace(/"/g, ""))
        console.log("CSV Headers:", headers)
        const dividendYieldIndex = headers.findIndex(h => h === "dividendYield")
        const trailingPEIndex = headers.findIndex(h => h === "trailingPE")
        console.log("Dividend Yield column index:", dividendYieldIndex)
        console.log("Trailing PE column index:", trailingPEIndex)
        
        // Skip header row and calculate total assets and returns
        let totalAssets = 0
        let threeYearReturns: number[] = []
        let fiveYearReturns: number[] = []
        let dividendYields: number[] = []
        let trailingPEValues: number[] = []
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",")
          const assets = Number.parseFloat(values[4]?.replace(/"/g, ""))
          if (!isNaN(assets)) {
            totalAssets += assets
          }
          
          const threeYearReturn = Number.parseFloat(values[6]?.replace(/"/g, ""))
          if (!isNaN(threeYearReturn) && threeYearReturn > 0 && threeYearReturn < 1) {
            threeYearReturns.push(threeYearReturn)
          }

          const fiveYearReturn = Number.parseFloat(values[7]?.replace(/"/g, ""))
          if (!isNaN(fiveYearReturn) && fiveYearReturn > 0 && fiveYearReturn < 1) {
            fiveYearReturns.push(fiveYearReturn)
          }

          const rawValue = values[dividendYieldIndex];
          if (rawValue !== undefined && rawValue.trim() !== "") {
            const dividendYield = Number.parseFloat(rawValue.replace(/"/g, ""));
            if (!isNaN(dividendYield) && dividendYield > 0 && dividendYield <= 20) {
              dividendYields.push(dividendYield);
            }
          }

          // trailingPE
          const peRaw = values[trailingPEIndex];
          if (peRaw !== undefined && peRaw.trim() !== "") {
            const pe = Number.parseFloat(peRaw.replace(/"/g, ""));
            if (!isNaN(pe) && pe > 0 && pe < 200) {
              trailingPEValues.push(pe);
            }
          }
        }

        console.log("Data processing complete:")
        console.log("- Total assets:", totalAssets)
        console.log("- Three year returns count:", threeYearReturns.length)
        console.log("- Five year returns count:", fiveYearReturns.length)
        console.log("- Dividend yields count:", dividendYields.length)
        console.log("- Sample dividend yields:", dividendYields.slice(0, 5))

        // Helper to calculate median for both even and odd length arrays
        const getMedian = (arr: number[]) => {
          if (arr.length === 0) return 0
          const sorted = [...arr].sort((a, b) => a - b)
          const mid = Math.floor(sorted.length / 2)
          if (sorted.length % 2 === 0) {
            return (sorted[mid - 1] + sorted[mid]) / 2
          } else {
            return sorted[mid]
          }
        }

        const threeYearReturnMedian = getMedian(threeYearReturns)
        const fiveYearReturnMedian = getMedian(fiveYearReturns)

        // Calculate dividend yield distribution with appropriate bins (0-20% range)
        const dividendYieldData = [
          { range: "0-2%", count: dividendYields.filter(v => v > 0 && v <= 2).length },
          { range: "2-4%", count: dividendYields.filter(v => v > 2 && v <= 4).length },
          { range: "4-6%", count: dividendYields.filter(v => v > 4 && v <= 6).length },
          { range: "6-8%", count: dividendYields.filter(v => v > 6 && v <= 8).length },
          { range: "8-10%", count: dividendYields.filter(v => v > 8 && v <= 10).length },
          { range: "10-12%", count: dividendYields.filter(v => v > 10 && v <= 12).length },
          { range: "12-14%", count: dividendYields.filter(v => v > 12 && v <= 14).length },
          { range: "14-16%", count: dividendYields.filter(v => v > 14 && v <= 16).length },
          { range: "16-18%", count: dividendYields.filter(v => v > 16 && v <= 18).length },
          { range: "18-20%", count: dividendYields.filter(v => v > 18 && v <= 20).length }
        ]

        console.log("Dividend Yield Distribution:", dividendYieldData)

        // Calculate trailing PE distribution from the local CSV
        const trailingPEData = [
          { range: "0-10", count: trailingPEValues.filter(v => v > 0 && v <= 10).length },
          { range: "10-15", count: trailingPEValues.filter(v => v > 10 && v <= 15).length },
          { range: "15-20", count: trailingPEValues.filter(v => v > 15 && v <= 20).length },
          { range: "20-25", count: trailingPEValues.filter(v => v > 20 && v <= 25).length },
          { range: "25-30", count: trailingPEValues.filter(v => v > 25 && v <= 30).length },
          { range: "30-40", count: trailingPEValues.filter(v => v > 30 && v <= 40).length },
          { range: "40+", count: trailingPEValues.filter(v => v > 40).length },
        ]

        setData({
          totalAssets,
          threeYearReturn: threeYearReturnMedian,
          fiveYearReturn: fiveYearReturnMedian,
          dividendYieldData,
          trailingPEData,
        })
      } catch (error) {
        console.error("Error fetching data:", error)
        setData({
          totalAssets: 2847500000000,
          threeYearReturn: 8.45,
          fiveYearReturn: 10.23,
          dividendYieldData: [
            { range: "0-2%", count: 45 },
            { range: "2-4%", count: 78 },
            { range: "4-6%", count: 65 },
            { range: "6-8%", count: 32 },
            { range: "8-10%", count: 18 },
            { range: "10-12%", count: 12 },
            { range: "12-14%", count: 8 },
            { range: "14-16%", count: 5 },
            { range: "16-18%", count: 3 },
            { range: "18-20%", count: 2 }
          ],
          trailingPEData: [
            { range: "0-10", count: 35 },
            { range: "10-15", count: 85 },
            { range: "15-20", count: 120 },
            { range: "20-25", count: 95 },
            { range: "25-30", count: 65 },
            { range: "30-40", count: 35 },
            { range: "40+", count: 15 },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const createHistogram = (
    values: number[],
    bins: Array<{ min: number; max: number; label: string }>
  ) => {
    return bins.map((bin) => ({
      range: bin.label,
      count: values.filter((value) => value >= bin.min && value < bin.max).length,
    }))
  }

  // Handle chart interactions
  const handleDividendChartClick = () => {
    trackChartInteraction('dividend_yield_distribution', 'click')
  }

  const handleDividendChartHover = () => {
    trackChartInteraction('dividend_yield_distribution', 'hover')
  }

  const handlePEChartClick = () => {
    trackChartInteraction('trailing_pe_distribution', 'click')
  }

  const handlePEChartHover = () => {
    trackChartInteraction('trailing_pe_distribution', 'hover')
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  if (!data) {
    return <div className="flex items-center justify-center h-64">Error loading data</div>
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-2">
            <CardDescription>Total ETF Assets (USD)</CardDescription>
            <CardTitle className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              ${(data.totalAssets / 1000000000000).toFixed(2)}T
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Combined assets under management</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardDescription>Median 3-Year Return</CardDescription>
            <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-400">
              {(data.threeYearReturn * 100).toFixed(2)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Annualized median performance</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardDescription>Median 5-Year Return</CardDescription>
            <CardTitle className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {(data.fiveYearReturn * 100).toFixed(2)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Long-term median performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dividend Yield Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Dividend Yield Distribution</CardTitle>
            <CardDescription>Number of ETFs by dividend yield range</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Count", color: "hsl(var(--chart-1))" },
              }}
              className="h-[300px] w-full"
            >
              <BarChart 
                data={data.dividendYieldData} 
                width={400} 
                height={300}
                onClick={handleDividendChartClick}
                onMouseEnter={handleDividendChartHover}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Trailing P/E Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Trailing P/E Distribution</CardTitle>
            <CardDescription>Number of ETFs by trailing P/E ratio range</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Count", color: "hsl(var(--chart-2))" },
              }}
              className="h-[300px] w-full"
            >
              <BarChart 
                data={data.trailingPEData} 
                width={400} 
                height={300}
                onClick={handlePEChartClick}
                onMouseEnter={handlePEChartHover}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
