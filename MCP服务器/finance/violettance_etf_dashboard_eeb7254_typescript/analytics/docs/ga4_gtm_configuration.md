# GA4 Configuration in GTM - Implementation Guide

## Overview
This document provides step-by-step instructions for configuring Google Analytics 4 (GA4) in Google Tag Manager (GTM) for the ETF Analytics Dashboard. Michael has already implemented the GTM snippet and data layer - now we need to configure the GA4 tags, triggers, and variables.

## Prerequisites
- GTM Container ID: `GTM-TWCDWPT5` (already installed by Michael)
- GA4 Measurement ID: `G-FH17P76S7Y`
- Data layer implementation complete (✅ Done by Michael)
- All tracking functions available in `lib/gtm.ts`

## Configuration Steps

### Step 1: GA4 Configuration Tag

**Tag Name**: `GA4 Configuration`
**Tag Type**: Google Analytics: GA4 Configuration
**Configuration**:
- **Measurement ID**: `G-FH17P76S7Y`
- **Send to**: Google Analytics
- **Trigger**: All Pages

**Custom Parameters**:
```
send_page_view: false  // We'll handle page views manually for SPA
```

**User Properties**:
```
device_type: {{Device Type}}
session_id: {{Session ID}}
```

### Step 2: Create Variables

#### Built-in Variables to Enable
- Page Path
- Page Title
- Event
- Click Element
- Click Text
- Scroll Depth Threshold

#### Custom Variables

**Variable Name**: `DL - Page Path`
**Type**: Data Layer Variable
**Data Layer Variable Name**: `page_path`

**Variable Name**: `DL - Page Title`
**Type**: Data Layer Variable
**Data Layer Variable Name**: `page_title`

**Variable Name**: `DL - Search Query`
**Type**: Data Layer Variable
**Data Layer Variable Name**: `search_query`

**Variable Name**: `DL - Result Count`
**Type**: Data Layer Variable
**Data Layer Variable Name**: `result_count`

**Variable Name**: `DL - Chart ID`
**Type**: Data Layer Variable
**Data Layer Variable Name**: `chart_id`

**Variable Name**: `DL - Action`
**Type**: Data Layer Variable
**Data Layer Variable Name**: `action`

**Variable Name**: `DL - Card ID`
**Type**: Data Layer Variable
**Data Layer Variable Name**: `card_id`

**Variable Name**: `DL - Sentiment`
**Type**: Data Layer Variable
**Data Layer Variable Name**: `sentiment`

**Variable Name**: `DL - Status`
**Type**: Data Layer Variable
**Data Layer Variable Name**: `status`

**Variable Name**: `Device Type`
**Type**: JavaScript Variable
**JavaScript**:
```javascript
function() {
  return /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
}
```

**Variable Name**: `Session ID`
**Type**: JavaScript Variable
**JavaScript**:
```javascript
function() {
  return Date.now().toString();
}
```

### Step 3: Create Triggers

#### Trigger 1: Virtual Page View
**Trigger Name**: `Virtual Page View`
**Type**: Custom Event
**Event Name**: `virtual_page_view`

#### Trigger 2: Search Performed
**Trigger Name**: `Search Performed`
**Type**: Custom Event
**Event Name**: `search_performed`

#### Trigger 3: Chart Interaction
**Trigger Name**: `Chart Interaction`
**Type**: Custom Event
**Event Name**: `chart_interaction`

#### Trigger 4: Card Click
**Trigger Name**: `Card Click`
**Type**: Custom Event
**Event Name**: `card_click`

#### Trigger 5: Real Time Toggle
**Trigger Name**: `Real Time Toggle`
**Type**: Custom Event
**Event Name**: `real_time_toggle`

### Step 4: Create GA4 Event Tags

#### Tag 1: GA4 Virtual Page View
**Tag Name**: `GA4 - Virtual Page View`
**Type**: Google Analytics: GA4 Event
**Configuration Tag**: `{{GA4 Configuration}}`
**Event Name**: `page_view`
**Parameters**:
```
page_location: {{Page URL}}
page_path: {{DL - Page Path}}
page_title: {{DL - Page Title}}
```
**Trigger**: `Virtual Page View`

#### Tag 2: GA4 Search Event
**Tag Name**: `GA4 - Search Performed`
**Type**: Google Analytics: GA4 Event
**Configuration Tag**: `{{GA4 Configuration}}`
**Event Name**: `search`
**Parameters**:
```
search_term: {{DL - Search Query}}
result_count: {{DL - Result Count}}
```
**Trigger**: `Search Performed`

#### Tag 3: GA4 Chart Interaction
**Tag Name**: `GA4 - Chart Interaction`
**Type**: Google Analytics: GA4 Event
**Configuration Tag**: `{{GA4 Configuration}}`
**Event Name**: `chart_interaction`
**Parameters**:
```
chart_id: {{DL - Chart ID}}
action: {{DL - Action}}
page_path: {{DL - Page Path}}
```
**Trigger**: `Chart Interaction`

#### Tag 4: GA4 Card Click
**Tag Name**: `GA4 - Card Click`
**Type**: Google Analytics: GA4 Event
**Configuration Tag**: `{{GA4 Configuration}}`
**Event Name**: `card_click`
**Parameters**:
```
card_id: {{DL - Card ID}}
sentiment: {{DL - Sentiment}}
page_path: {{DL - Page Path}}
```
**Trigger**: `Card Click`

#### Tag 5: GA4 Real Time Toggle
**Tag Name**: `GA4 - Real Time Toggle`
**Type**: Google Analytics: GA4 Event
**Configuration Tag**: `{{GA4 Configuration}}`
**Event Name**: `real_time_toggle`
**Parameters**:
```
status: {{DL - Status}}
page_path: {{DL - Page Path}}
```
**Trigger**: `Real Time Toggle`

### Step 5: GA4 Property Configuration

#### Custom Dimensions (to be created in GA4 interface)
1. **page_path** (Event-scoped)
   - Parameter name: `page_path`
   - Scope: Event
   - Description: Virtual path for SPA tabs

2. **chart_id** (Event-scoped)
   - Parameter name: `chart_id`
   - Scope: Event
   - Description: Identifies charts (price_trend, top_etfs, etc.)

3. **card_id** (Event-scoped)
   - Parameter name: `card_id`
   - Scope: Event
   - Description: Tracks news sentiment cards

4. **sentiment** (Event-scoped)
   - Parameter name: `sentiment`
   - Scope: Event
   - Description: News sentiment value

5. **action** (Event-scoped)
   - Parameter name: `action`
   - Scope: Event
   - Description: Interaction type (hover, click)

#### User Properties (to be created in GA4 interface)
1. **device_type** (User-scoped)
   - Description: Device category (desktop, mobile)

2. **session_id** (User-scoped)
   - Description: Unique session identifier

#### Conversion Events (to be marked in GA4)
- `search` (from search_performed)
- `chart_interaction`
- `card_click`

### Step 6: Enhanced Measurement Settings
In GA4 Property Settings, enable:
- ✅ Page views (we handle manually)
- ✅ Scrolls
- ✅ Outbound clicks
- ✅ Site search (our custom search events)
- ✅ Video engagement
- ✅ File downloads

### Step 7: Data Retention Settings
- Set data retention to **14 months**
- Enable **Reset user data on new activity**

## Testing Checklist

### GTM Preview Mode Testing
- [ ] Virtual page view events fire on tab switches
- [ ] Search events fire with correct parameters
- [ ] Chart interaction events fire on hover/click
- [ ] News card click events fire with sentiment data
- [ ] Real-time toggle events fire with status

### GA4 DebugView Testing
- [ ] All events appear in GA4 DebugView
- [ ] Custom parameters are populated correctly
- [ ] User properties are set
- [ ] No PII is being collected
- [ ] Events fire across different devices

### Cross-Device Testing
- [ ] Desktop browser testing
- [ ] Mobile browser testing
- [ ] Tablet testing (if applicable)

## Implementation Notes

### Data Layer Events Already Implemented by Michael
All these events are already firing from the frontend:

```javascript
// Virtual page views
window.dataLayer.push({
  event: 'virtual_page_view',
  page_path: '/overview',
  page_title: 'Overview Tab'
});

// Search events
window.dataLayer.push({
  event: 'search_performed',
  search_query: 'QQQ',
  result_count: 5
});

// Chart interactions
window.dataLayer.push({
  event: 'chart_interaction',
  chart_id: 'price_trend',
  action: 'click'
});

// Card clicks
window.dataLayer.push({
  event: 'card_click',
  card_id: 'microsoft',
  sentiment: 'Somewhat Bullish'
});

// Real-time toggle
window.dataLayer.push({
  event: 'real_time_toggle',
  status: 'on'
});
```

### Files Modified by Michael
- `app/layout.tsx` - GTM snippet installed
- `app/page.tsx` - Virtual page view tracking
- `lib/gtm.ts` - Complete tracking utilities
- All component files - Event tracking implemented

## Next Steps After Configuration

1. **Publish GTM Container**: Submit and publish the GTM container
2. **Verify GA4 Data**: Check GA4 Real-time reports for incoming data
3. **Create Custom Reports**: Set up the reports defined in tracking plan
4. **Set up Funnels**: Create the funnel analysis in GA4 Explore
5. **Monitor Data Quality**: Weekly checks using GA4 DebugView

## Troubleshooting

### Common Issues
- **Events not firing**: Check GTM Preview mode for trigger conditions
- **Missing parameters**: Verify data layer variable names match exactly
- **GA4 not receiving data**: Confirm Measurement ID is correct
- **Cross-domain issues**: Ensure GTM container is published

### Debug Commands
```javascript
// Check data layer
console.log(window.dataLayer);

// Manually trigger test event
window.dataLayer.push({
  event: 'test_event',
  test_parameter: 'test_value'
});
```

---

**Configuration Owner**: Priya Sharma (Data Analyst)  
**Implementation Status**: Ready for GTM configuration  
**Last Updated**: June 1, 2025 