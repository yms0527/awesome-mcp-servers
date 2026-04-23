# GTM Implementation for ETF Analytics Dashboard

## Overview
Google Tag Manager (GTM) has been successfully installed on the ETF Analytics Dashboard with ID `GTM-TWCDWPT5`. This implementation supports the tracking plan requirements for the single-page application (SPA).

## What Was Implemented

### 1. GTM Snippet Installation
- **Location**: `app/layout.tsx`
- **GTM ID**: `GTM-TWCDWPT5`
- **Implementation**: Using Next.js `Script` component with `afterInteractive` strategy
- **Includes**: Both the main GTM script and noscript fallback for accessibility

### 2. GTM Utilities Library
- **Location**: `lib/gtm.ts`
- **Purpose**: Provides helper functions for tracking SPA interactions
- **Features**: TypeScript support with proper type declarations

### 3. Virtual Page View Tracking
- **Location**: `app/page.tsx`
- **Implementation**: Tracks tab switches as virtual page views
- **Supported Tabs**:
  - Real Time (`/real-time`)
  - Overview (`/overview`)
  - News Sentiment (`/news-sentiment`)
  - Top Performers (`/top-performers`)
  - Category Performance (`/category-performance`)

### 4. User Properties Setup
- **Device Type**: Automatically detected (mobile/desktop)
- **Session ID**: Generated on page load
- **Implementation**: Set via `setUserProperties()` function

## Available Tracking Functions

### Virtual Page Views
```typescript
import { trackVirtualPageView } from '@/lib/gtm';

trackVirtualPageView('/overview', 'Overview Tab');
```

### Search Tracking
```typescript
import { trackSearchPerformed } from '@/lib/gtm';

trackSearchPerformed('QQQ', 5); // query, result count
```

### Chart Interactions
```typescript
import { trackChartInteraction } from '@/lib/gtm';

trackChartInteraction('price_trend', 'click');
```

### News Card Clicks
```typescript
import { trackCardClick } from '@/lib/gtm';

trackCardClick('microsoft', 'Somewhat Bullish');
```

### Real-Time Toggle
```typescript
import { trackRealTimeToggle } from '@/lib/gtm';

trackRealTimeToggle('on'); // or 'off'
```

### Custom Events
```typescript
import { trackCustomEvent } from '@/lib/gtm';

trackCustomEvent('custom_event_name', {
  parameter1: 'value1',
  parameter2: 'value2'
});
```

## Next Steps for Implementation Team

### For Data Analyst (Priya Sharma)
1. Configure GA4 in GTM with Measurement ID `G-FH17P76S7Y`
2. Set up triggers for the following events:
   - `virtual_page_view`
   - `search_performed`
   - `chart_interaction`
   - `card_click`
   - `real_time_toggle`
3. Create custom dimensions for `page_path`, `chart_id`, and `card_id`
4. Set up conversion goals for key interactions

### For Front-End Developer (Michael Chen)
1. Add tracking calls to individual components:
   - Search functionality in search components
   - Chart hover/click events in chart components
   - News card click events in news sentiment components
   - Real-time toggle functionality
2. Test tracking implementation using GTM Preview mode

### For QA Tester (Alex Rivera)
1. Use GTM Preview mode to validate all events fire correctly
2. Check GA4 DebugView for proper event reception
3. Test across different devices and browsers
4. Verify no PII is being collected

## Testing the Implementation

### GTM Preview Mode
1. Go to GTM container `GTM-TWCDWPT5`
2. Click "Preview" button
3. Enter the dashboard URL
4. Navigate through tabs and interact with elements
5. Verify events appear in the GTM debugger

### GA4 DebugView
1. Go to GA4 property `G-FH17P76S7Y`
2. Navigate to Configure > DebugView
3. Interact with the dashboard
4. Verify events appear in real-time

### Browser Developer Tools
Check the browser console for:
```javascript
// Verify dataLayer exists
console.log(window.dataLayer);

// Manually trigger an event to test
window.dataLayer.push({
  event: 'test_event',
  test_parameter: 'test_value'
});
```

## Files Modified
- `app/layout.tsx` - Added GTM snippet
- `app/page.tsx` - Added virtual page view tracking
- `lib/gtm.ts` - Created GTM utilities library
- `GTM_IMPLEMENTATION.md` - This documentation file

## Notes
- All tracking functions include client-side checks (`typeof window !== 'undefined'`)
- TypeScript declarations are included for proper IDE support
- Implementation follows Next.js best practices for script loading
- Ready for GA4 configuration in GTM dashboard 