# GA4 MCP Configuration Tasks
## ETF Analytics Dashboard - Implementation Checklist

**Date**: June 1, 2025  
**Analyst**: Priya Sharma  
**Status**: 🔄 In Progress  
**MCP Server**: GA4 Admin (mcp-ga4-admin) - ✅ RUNNING

---

## 🎯 Configuration Objectives

Based on Michael's implementation and our tracking plan, we need to configure:

1. **GA4 Property Settings** (G-FH17P76S7Y)
2. **Custom Dimensions** (5 event-scoped)
3. **User Properties** (2 user-scoped)
4. **Conversion Events** (3 key conversions)
5. **Enhanced Measurement** settings
6. **Data Retention** policies

---

## 📋 Task Checklist

### Phase 1: Property Configuration ✅
- [x] **MCP Server Started**: GA4 Admin server running with authentication
- [ ] **Property Access**: Add service account to GA4 property G-FH17P76S7Y
- [ ] **Data Stream**: Verify web data stream configuration
- [ ] **Enhanced Measurement**: Configure automatic event collection

### Phase 2: Custom Dimensions Setup 🔄
Based on Michael's data layer implementation:

#### Event-Scoped Custom Dimensions
- [ ] **page_path** - Virtual path for SPA tabs (e.g., /overview, /news-sentiment)
- [ ] **chart_id** - Chart identifiers (e.g., price_trend, top_etfs)
- [ ] **card_id** - News sentiment cards (e.g., microsoft, duolingo)
- [ ] **sentiment** - News sentiment values (e.g., Somewhat Bullish)
- [ ] **action** - Interaction types (hover, click)

### Phase 3: User Properties Setup 🔄
- [ ] **device_type** - Device category (desktop, mobile)
- [ ] **session_id** - Unique session identifier

### Phase 4: Conversion Events 🔄
Mark these events as conversions:
- [ ] **search** (from search_performed event)
- [ ] **chart_interaction** (chart engagement)
- [ ] **card_click** (news sentiment engagement)

### Phase 5: Data Retention & Privacy 🔄
- [ ] **Data Retention**: Set to 14 months
- [ ] **Reset on Activity**: Enable reset user data on new activity
- [ ] **IP Anonymization**: Verify privacy settings

---

## 🤖 MCP Commands to Execute

### 1. Property Access Verification
```
"Check if I have access to GA4 property G-FH17P76S7Y and show me the current configuration"
```

### 2. Custom Dimensions Creation
```
"Create the following custom dimensions for GA4 property G-FH17P76S7Y:
1. page_path (Event-scoped) - Virtual path for SPA tabs
2. chart_id (Event-scoped) - Chart identifiers  
3. card_id (Event-scoped) - News sentiment cards
4. sentiment (Event-scoped) - News sentiment values
5. action (Event-scoped) - Interaction types"
```

### 3. User Properties Setup
```
"Create the following user properties for GA4 property G-FH17P76S7Y:
1. device_type (User-scoped) - Device category
2. session_id (User-scoped) - Session identifier"
```

### 4. Conversion Events Configuration
```
"Mark the following events as conversions in GA4 property G-FH17P76S7Y:
1. search - Search engagement tracking
2. chart_interaction - Chart engagement measurement  
3. card_click - News sentiment interaction tracking"
```

### 5. Enhanced Measurement Settings
```
"Configure enhanced measurement for GA4 property G-FH17P76S7Y:
- Enable page views (manual handling for SPA)
- Enable scrolls
- Enable outbound clicks
- Enable site search
- Enable video engagement
- Enable file downloads"
```

### 6. Data Retention Configuration
```
"Set data retention to 14 months for GA4 property G-FH17P76S7Y and enable reset user data on new activity"
```

---

## 📊 Expected Data Layer Events (Already Implemented by Michael)

### Virtual Page Views
```javascript
window.dataLayer.push({
  event: 'virtual_page_view',
  page_path: '/overview',           // → page_path custom dimension
  page_title: 'Overview Tab'
});
```

### Search Events
```javascript
window.dataLayer.push({
  event: 'search_performed',
  search_query: 'QQQ',
  result_count: 5
});
```

### Chart Interactions
```javascript
window.dataLayer.push({
  event: 'chart_interaction',
  chart_id: 'price_trend',          // → chart_id custom dimension
  action: 'click'                   // → action custom dimension
});
```

### News Card Clicks
```javascript
window.dataLayer.push({
  event: 'card_click',
  card_id: 'microsoft',             // → card_id custom dimension
  sentiment: 'Somewhat Bullish'     // → sentiment custom dimension
});
```

### Real-Time Toggle
```javascript
window.dataLayer.push({
  event: 'real_time_toggle',
  status: 'on'
});
```

---

## 🔧 GTM Configuration (Next Phase)

After GA4 is configured, we need to set up GTM tags to send these events:

### Required GTM Components
1. **GA4 Configuration Tag** - Base GA4 setup
2. **Data Layer Variables** - Extract event parameters
3. **Custom Triggers** - Fire on specific events
4. **GA4 Event Tags** - Send events to Analytics

### GTM Container: GTM-TWCDWPT5
- **Status**: Installed by Michael ✅
- **Data Layer**: Implemented ✅
- **Events**: All firing ✅
- **Configuration**: Pending GTM MCP setup

---

## 🧪 Testing Plan

### GA4 DebugView Testing
Once configured, verify:
- [ ] Virtual page views appear with page_path dimension
- [ ] Search events fire with proper parameters
- [ ] Chart interactions include chart_id and action
- [ ] News card clicks show card_id and sentiment
- [ ] User properties are set correctly
- [ ] Conversion events are marked properly

### Real-Time Reports
- [ ] Active users showing
- [ ] Events appearing in real-time
- [ ] Custom dimensions populated
- [ ] No PII being collected

---

## 🚨 Prerequisites for Success

### Service Account Access
The service account `productora@gen-lang-client-0301679764.iam.gserviceaccount.com` needs:
- [ ] **GA4 Property Access**: Editor/Administrator role on G-FH17P76S7Y
- [ ] **GTM Container Access**: Editor role on GTM-TWCDWPT5

### API Permissions
- [x] **GA4 Admin API**: Enabled ✅
- [x] **GA4 Data API**: Enabled ✅
- [ ] **GTM API**: Enable for container management

---

## 📈 Success Metrics

### Configuration Complete When:
- ✅ All 5 custom dimensions created and active
- ✅ Both user properties configured
- ✅ 3 conversion events marked
- ✅ Enhanced measurement enabled
- ✅ Data retention set to 14 months
- ✅ GTM tags configured and firing
- ✅ Events appearing in GA4 with proper dimensions

### Data Quality Indicators:
- Events firing with correct parameters
- Custom dimensions populating with expected values
- User properties being set on session start
- Conversion events tracking properly
- No PII in any collected data

---

## 🔄 Next Steps

1. **Immediate**: Execute MCP commands to configure GA4
2. **Phase 2**: Set up GTM container configuration
3. **Phase 3**: Test and validate all tracking
4. **Phase 4**: Create reports and funnels
5. **Phase 5**: Monitor and optimize

---

**Ready to Execute**: All MCP commands above can be run now with the authenticated GA4 Admin server.

**Owner**: Priya Sharma (Data Analyst)  
**Support**: Michael Chen (Implementation), Alex Rivera (Testing)  
**Timeline**: Complete by end of Day 6 (June 6, 2025) 