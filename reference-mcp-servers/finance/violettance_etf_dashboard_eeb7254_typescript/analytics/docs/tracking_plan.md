# Tracking Plan for ETF Analytics Dashboard (Single-Page Application)

## Overview
This tracking plan implements Google Analytics 4 (GA4) and Google Tag Manager (GTM) for the ETF Analytics Dashboard at https://v0-data-dashboard-design-iota.vercel.app/, using GA4 Measurement ID G-FH17P76S7Y and GTM ID GTM-TWCDWPT5. The dashboard is a single-page application (SPA) where the URL does not change when switching tabs (e.g., Overview, News Sentiment, Top Performers). Visible elements include a search bar (e.g., "QQQ"), a 45-Day Price Trend chart, Current Price/Daily Change cards, news sentiment cards, and a Top ETFs by 3-Year Returns bar chart. The plan uses virtual page views and custom events to track tab switches and interactions, providing actionable insights for product optimization.

## Objectives
- **Track Navigation**: Capture tab switches (Overview, News Sentiment, Top Performers) using virtual page views.
- **Measure Engagement**: Monitor interactions with the search bar, charts, and news sentiment cards.
- **Identify Key Actions**: Track searches, chart interactions, and news card clicks as conversions.
- **Ensure Scalability**: Use GTM for manageable tag deployment.
- **Support Product Insights**: Provide data to enhance UX and prioritize features.

## Assumptions
- Built with Next.js, Tailwind CSS, and shadcn/ui, hosted on Vercel.
- Tab switches (e.g., Overview, News Sentiment) do not change the URL, requiring virtual page views.
- Real-time toggle exists but does not affect tracking unless user-initiated.
- Responsive design for desktop and mobile users.

## Tag Management System (GTM) Setup
GTM will manage GA4 tags, with adjustments for SPA behavior.

### GTM Implementation Steps
1. **Install GTM**:
   - Add the GTM snippet to `app/layout.js` or via Vercel settings:
     ```html
     <!-- Google Tag Manager -->
     <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
     new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
     j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
     'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
     })(window,document,'script','dataLayer','GTM-TWCDWPT5');</script>
     <!-- End Google Tag Manager -->
     <!-- Google Tag Manager (noscript) -->
     <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TWCDWPT5"
     height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
     <!-- End Google Tag Manager (noscript) -->
     ```
2. **Configure GA4 in GTM**:
   - Create a GA4 Configuration tag with Measurement ID `G-FH17P76S7Y`.
   - Set to fire on “All Pages” trigger.
3. **Data Layer Setup for SPA**:
   - Push virtual page views to the data layer on tab switches:
     ```javascript
     window.dataLayer = window.dataLayer || [];
     window.dataLayer.push({
       event: 'virtual_page_view',
       page_path: '/overview',
       page_title: 'Overview Tab'
     });
     ```
   - Trigger this on tab click events (e.g., using Next.js `useEffect` to detect route changes or tab state changes).
4. **Testing**:
   - Use GTM Preview mode and GA4 DebugView to verify virtual page views and events.
   - Ensure no Personally Identifiable Information (PII) is sent.

## GA4 Tracking Setup
### Property Configuration
- **GA4 Property**: Use existing property with Measurement ID `G-FH17P76S7Y`.
- **Data Stream**: Add a web data stream for the site.
- **Enhanced Measurement**: Enable for scrolls and outbound clicks (e.g., “Read more” links in news cards).
- **Custom Dimensions**:
  - `page_path`: Virtual path for SPA tabs (e.g., /overview, /news-sentiment).
  - `chart_id`: Identifies charts (e.g., price_trend, top_etfs).
  - `card_id`: Tracks news sentiment cards (e.g., microsoft, duolingo).

### User Properties
| Property Name  | Description               | Example Value |
|----------------|---------------------------|---------------|
| `device_type`  | Device category           | desktop, mobile |
| `session_id`   | Unique session identifier  | 987654321     |

**Implementation**:
- Set via GTM:
  ```javascript
  gtag('set', 'user_properties', {
    device_type: 'desktop',
    session_id: '987654321'
  });
  ```

### Event Tracking
#### Automatically Collected Events
- `session_start`: Marks session start.
- `user_engagement`: Tracks time spent on the dashboard.

#### Enhanced Measurement Events
- `scroll`: Tracks scroll depth (e.g., 90% of content).
- `click`: Tracks outbound links (e.g., “Read more” in news cards).

#### Custom Events
Since the URL doesn’t change, we’ll use virtual page views and custom events:

| Event Name            | Trigger                              | Parameters                              |
|-----------------------|--------------------------------------|-----------------------------------------|
| `virtual_page_view`   | User switches tabs                   | `page_path` (e.g., /news-sentiment), `page_title` (e.g., News Sentiment Tab) |
| `search_performed`    | User submits a search query          | `search_query` (e.g., QQQ), `result_count` |
| `chart_interaction`   | User hovers/clicks on Price Trend or Top ETFs chart | `chart_id` (e.g., price_trend), `action` (hover, click) |
| `card_click`          | User clicks a news sentiment card    | `card_id` (e.g., microsoft), `sentiment` (e.g., Somewhat Bullish) |
| `real_time_toggle`    | User toggles Real Time button        | `status` (on, off)                     |

**Implementation Example** (for `virtual_page_view` on tab switch):
```javascript
// In Next.js component, on tab click
window.dataLayer.push({
  event: 'virtual_page_view',
  page_path: '/news-sentiment',
  page_title: 'News Sentiment Tab'
});
```

**Implementation Example** (for `card_click`):
```javascript
window.dataLayer.push({
  event: 'card_click',
  card_id: 'microsoft',
  sentiment: 'Somewhat Bullish'
});
```

### Conversion Goals
| Conversion Name       | Event Trigger              | Purpose                                   |
|-----------------------|----------------------------|-------------------------------------------|
| `Search Engagement`   | `search_performed`         | Tracks active search usage                |
| `Chart Interaction`   | `chart_interaction`        | Measures chart engagement                 |
| `News Card Click`     | `card_click`               | Tracks interest in news sentiment         |

**Setup**:
- Mark as conversions in GA4 under “Events” > “Mark as Conversion.”

## Funnels
| Funnel Name           | Steps                                | Purpose                                   |
|-----------------------|--------------------------------------|-------------------------------------------|
| `Tab Navigation`      | `virtual_page_view` (/overview) → `virtual_page_view` (/news-sentiment) → `card_click` | Analyze tab flow and news engagement      |
| `Data Engagement`     | `virtual_page_view` (/overview) → `chart_interaction` → `search_performed` | Track data interaction depth              |

**Setup**:
- Create in GA4 under “Explore” > “Funnel Exploration.”
- Use `page_path` and `chart_id` for segmentation.

## Reports
| Report Name           | Metrics/Dimensions                   | Purpose                                   |
|-----------------------|--------------------------------------|-------------------------------------------|
| **Engagement**        | Sessions, Engaged Sessions, `device_type` | Assess activity by device                 |
| **Feature Usage**     | `chart_interaction`, `card_click`, `search_performed`, `page_path` | Monitor feature interactions              |
| **Sentiment Analysis**| `card_click`, `sentiment`, `card_id`  | Evaluate news sentiment engagement        |

**Custom Reports**:
- Build in GA4’s “Reports” > “Library” to visualize trends (e.g., chart interactions by tab).

## Privacy and Compliance
- **No PII**: Avoid collecting personal data.
- **Consent**: Add a consent banner for GDPR regions.
- **Data Retention**: Set to 14 months in GA4.
- **Vercel Compliance**: Adhere to data usage policies (no AI training with user data).

## Dream Team
- **Project Manager (Sarah Jones)**: Oversees timeline and coordination. Experienced in Agile methodologies, previously managed analytics implementations for fintech dashboards.
- **Front-End Developer (Michael Chen)**: Implements GTM snippet and data layer in Next.js. Expert in React/Next.js with 5+ years of experience, skilled in SPA tracking.
- **Data Analyst (Priya Sharma)**: Configures GA4 events, virtual page views, and conversions. GA4-certified with a background in financial analytics dashboards.
- **QA Tester (Alex Rivera)**: Validates tracking accuracy using GTM Preview and GA4 DebugView. Detail-oriented with 3+ years in testing analytics implementations.
- **UX Designer (Emily Tran)**: Ensures tracking aligns with user flows. Specializes in dashboard UX, previously designed for data-heavy applications.

## Implementation Timeline
| Task                          | Duration | Owner           |
|-------------------------------|----------|-----------------|
| Install GTM snippet           | 1 day    | Michael Chen    |
| Configure GA4 in GTM          | 1 day    | Priya Sharma    |
| Implement data layer for SPA  | 2 days   | Michael Chen    |
| Set up events and conversions | 2 days   | Priya Sharma    |
| Test and validate             | 1 day    | Alex Rivera     |
| Create reports and funnels    | 1 day    | Priya Sharma    |

## Maintenance
- **Weekly**: Check GA4 DebugView for issues (Priya).
- **Monthly**: Audit GTM tags for accuracy (Michael).
- **Quarterly**: Update plan for new features (Sarah).

## Notes
- Virtual page views are critical for SPA tracking due to static URL.
- Test across devices to ensure responsiveness.
- Expand events if new tabs (e.g., Category Performance) are added.
- Current plan reflects visible elements as of June 01, 2025, 11:43 PM +03.