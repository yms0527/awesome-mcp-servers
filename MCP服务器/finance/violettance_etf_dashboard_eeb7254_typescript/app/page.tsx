"use client"
import { Moon, Sun, TrendingUp, BarChart3, Newspaper, Zap, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"
import { useIsMobile } from "@/hooks/use-mobile"
import { trackVirtualPageView, setUserProperties, trackCustomEvent } from "@/lib/gtm"
import { useEffect } from "react"
import OverviewTab from "@/components/overview-tab"
import NewsSentimentTab from "@/components/news-sentiment-tab"
import RealTimeTab from "@/components/real-time-tab"
import TopPerformersTab from "@/components/top-performers-tab"
import CategoryPerformanceTab from "@/components/category-performance-tab"
import GTMDebug from "@/components/gtm-debug"

export default function ETFDashboard() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const { theme, setTheme } = useTheme()

  // Set user properties on component mount
  useEffect(() => {
    const deviceType = isMobile ? 'mobile' : 'desktop';
    const sessionId = Date.now().toString();
    
    setUserProperties({
      device_type: deviceType,
      session_id: sessionId
    });

    // Track initial page view for real-time tab (default)
    trackVirtualPageView('/real-time', 'Real Time Tab');
  }, [isMobile]);

  // Handle tab changes for virtual page view tracking
  const handleTabChange = (value: string) => {
    const tabMappings: Record<string, { path: string; title: string }> = {
      'real-time': { path: '/real-time', title: 'Real Time Tab' },
      'overview': { path: '/overview', title: 'Overview Tab' },
      'news-sentiment': { path: '/news-sentiment', title: 'News Sentiment Tab' },
      'top-performers': { path: '/top-performers', title: 'Top Performers Tab' },
      'category-performance': { path: '/category-performance', title: 'Category Performance Tab' }
    };

    const tabInfo = tabMappings[value];
    if (tabInfo) {
      trackVirtualPageView(tabInfo.path, tabInfo.title);
    }
  };

  // Handle theme toggle tracking
  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    
    // Track theme toggle event
    trackCustomEvent('theme_toggle', {
      previous_theme: theme,
      new_theme: newTheme,
      device_type: isMobile ? 'mobile' : 'desktop'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">ETF Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">Comprehensive ETF performance and market analysis</p>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" size="icon" onClick={handleThemeToggle}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="real-time" className="space-y-4 sm:space-y-6" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-5 gap-1 sm:gap-2 overflow-x-auto">
            <TabsTrigger value="real-time" className="flex items-center justify-center sm:gap-2 text-xs sm:text-sm px-2 py-1 sm:px-0 sm:py-0">
              <Zap className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Real Time</span>
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center justify-center sm:gap-2 text-xs sm:text-sm px-2 py-1 sm:px-0 sm:py-0">
              <TrendingUp className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="news-sentiment" className="flex items-center justify-center sm:gap-2 text-xs sm:text-sm px-2 py-1 sm:px-0 sm:py-0">
              <Newspaper className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">News Sentiment</span>
            </TabsTrigger>
            <TabsTrigger value="top-performers" className="flex items-center justify-center sm:gap-2 text-xs sm:text-sm px-2 py-1 sm:px-0 sm:py-0">
              <BarChart3 className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Top Performers</span>
            </TabsTrigger>
            <TabsTrigger value="category-performance" className="flex items-center justify-center sm:gap-2 text-xs sm:text-sm px-2 py-1 sm:px-0 sm:py-0">
              <Grid3X3 className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Category Performance</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="real-time">
            <RealTimeTab />
          </TabsContent>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="news-sentiment">
            <NewsSentimentTab />
          </TabsContent>

          <TabsContent value="top-performers">
            <TopPerformersTab />
          </TabsContent>

          <TabsContent value="category-performance">
            <CategoryPerformanceTab />
          </TabsContent>
        </Tabs>
      </div>
      <GTMDebug />
    </div>
  )
}
