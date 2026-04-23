// GTM Utilities for ETF Analytics Dashboard
// Handles data layer pushes for SPA tracking

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

// Initialize data layer if it doesn't exist
export const initDataLayer = () => {
  window.dataLayer = window.dataLayer || [];
};

// Track virtual page views for SPA navigation
export const trackVirtualPageView = (pagePath: string, pageTitle: string) => {
  if (typeof window !== 'undefined') {
    initDataLayer();
    window.dataLayer.push({
      event: 'virtual_page_view',
      page_path: pagePath,
      page_title: pageTitle
    });
  }
};

// Track search performed
export const trackSearchPerformed = (searchQuery: string, resultCount?: number) => {
  if (typeof window !== 'undefined') {
    initDataLayer();
    window.dataLayer.push({
      event: 'search_performed',
      search_query: searchQuery,
      result_count: resultCount
    });
  }
};

// Track chart interactions
export const trackChartInteraction = (chartId: string, action: 'hover' | 'click') => {
  if (typeof window !== 'undefined') {
    initDataLayer();
    window.dataLayer.push({
      event: 'chart_interaction',
      chart_id: chartId,
      action: action
    });
  }
};

// Track news card clicks
export const trackCardClick = (cardId: string, sentiment: string) => {
  if (typeof window !== 'undefined') {
    initDataLayer();
    window.dataLayer.push({
      event: 'card_click',
      card_id: cardId,
      sentiment: sentiment
    });
  }
};

// Track real-time toggle
export const trackRealTimeToggle = (status: 'on' | 'off') => {
  if (typeof window !== 'undefined') {
    initDataLayer();
    window.dataLayer.push({
      event: 'real_time_toggle',
      status: status
    });
  }
};

// Set user properties
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', properties);
  }
};

// Generic event tracking function
export const trackCustomEvent = (eventName: string, parameters: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    initDataLayer();
    window.dataLayer.push({
      event: eventName,
      ...parameters
    });
  }
}; 