RagAlgo: Applying CKN Technology to Financial Markets

"A Financial Context Engine for AI"
The First Multi-Market Financial Context Provider Demonstrating the CKN Architecture


[ 1. Overview ]

RagAlgo is an experimental service that pioneered the application of CKN (Contextual Knowledge Network) architecture to financial market analysis.

Beyond merely aggregating news or displaying charts, RagAlgo is a context-delivery system designed to "detect market contradictions and prompt AI to autonomously explore root causes."

* Core Identity
  - Data Provider, Not Advisor: We do not offer buy/sell recommendations.
  - Context Engine for AI: Our service is designed for AI agents, not human users.
  - Living Proof: We demonstrate that the CKN concept works in real-world environments.


[ 2. Why Financial Markets? ]

Financial markets, with clearly defined users, serve as an ideal testbed for validating the CKN architecture.

1. Extreme Complexity: News, charts, financials, macroeconomic trends, and market psychology are all intertwined
2. Daily Contradictions: Situations like "strong earnings yet falling stock prices" occur regularly
3. Verifiability: Predictions can be instantly compared against actual price movements


[ 3. Operational Strategy: Overcoming Human Limitations Through Automation ]

RagAlgo is a solo-developer project.
To overcome the physical constraints of time and manpower while covering global markets (U.S., Japan, U.K., South Korea), we chose "100% automation."

* A 24/7 Tireless Infrastructure
  - Over 30 independent AI workers run organically interconnected on Railway's cloud infrastructure.
  - The system collects and refines data from each country even while the developer sleeps, maintaining 24/7 surveillance without gaps.


[ 4. Intelligence: A Self-Growing Tag Dictionary (Auto-Growing Dictionary) ]

RagAlgo is not a static database—it's a living organism that evolves daily.

* An Ecosystem of 30,000+ Tags
  As AI reads the news, it autonomously discovers "new keywords." Currently, over 30,000 tags have been self-generated—not manually entered, but created by AI as it observes the markets.

* Hierarchical Knowledge Structure (G-Series)
  - G99 (Market) → G100 (Sector) → G101 (Theme) → Individual Stocks
  - When AI detects emerging themes like "room-temperature superconductors," it autonomously creates tags and classifies news without human intervention.


[ 5. Filtering: From 8 Million to 120,000 (Signal Only) ]

Over 8 million data points pour in each month, but 98.5% of them are simple noise with no market impact.
RagAlgo boldly filters out this noise using CKN algorithms to efficiently allocate resources.

* 3-Stage Filtering
  1. Remove spam/advertisements
  2. Eliminate simple duplicates
  3. Remove neutral (0-score) noise

As a result, only 120,000 "high-density signals" per month are delivered to AI.


[ 6. Core Engine: Contrasting A and B (The 4-Pillar Context) ]

RagAlgo doesn't simply list data—it categorizes information into **Cause (A)** and **Effect (B)** for analytical judgment.

1. A (Context)
   - Definition: Text-based information such as news, financials, and themes. (The "rationale" for movement)
   - Role: Provides the answer to "Why is it moving?"

2. B (Coordinate)
   - Definition: Position (Zone) and velocity (Score) on the chart. (The "actual price location")
   - Role: Serves as **Ground Truth** to verify whether A (news) is genuine.

-- AI Decision Logic: Alignment vs Contradiction --

RagAlgo compares these two dimensions to enable AI to think independently.

Case 1: Alignment (Match) → "Strong Confidence"
- Situation: A (news) positive (+9) AND B (chart) rising (+8)
- Judgment: "The rationale (A) aligns with actual money flow (B). This is a reliable strong bullish signal."

Case 2: Contradiction → "Active Exploration" (Why?)
- Situation: A (news) positive (+10) BUT B (chart) falling (-7)
- Judgment: "The news is good, yet the price is collapsing (contradiction). Why might this be?"
- Action: AI asks itself questions and initiates a self-search to uncover hidden negative factors.


[ 7. RagAlgo's Differentiator: Answer vs Trigger ]

Traditional financial terminals and RagAlgo have fundamentally different objectives.

* Traditional Financial Terminals (Legacy)
  - Role: Answer Provider
  - Offering: Cooked Meal
  - Message: "This stock is good. Buy it." (Delivering conclusions to humans)

* RagAlgo (Next-Gen)
  - Role: Thinking Trigger
  - Offering: Fresh Ingredients and Recipes
  - Message: "The news is good, but the chart is bad. Doesn't that seem odd?" (Prompting questions for AI)

Rather than replacing existing services, we provide a new kind of **"thinking tool"** for the AI era.


[ 8. Integration Methods: MCP & Realtime ]

1. MCP (Model Context Protocol)
   - Method: Request/Response (Pull)
   - Tools: get_tags, get_news, get_snapshot
   - Use Case: Deep analysis by Claude, ChatGPT, etc.

2. WebSocket Realtime
   - Method: Real-time streaming (Push)
   - Address: `wss://www.ragalgo.com/ws/v2`
   - Channels: global_news, market_snapshot
   - Use Case: Real-time monitoring that tolerates zero latency


[ 9. Business Model and Participation ]

Our goal is to provide the most efficient context to AI agents.

* API Policy
  - Scored API: Automatically removes 0-score noise. Cost-effective.
  - Non-Scored API: Provides all raw data. For research/analysis.

* How to Participate
  - Website: ragalgo.com
  - Developers: `npm install @ragalgo/mcp-server`
  - Dataset Download: [AlgoBalloon.com](https://algoballoon.com)
  - Inquiries: Contact@algoballoon.com

*We offer free downloads of the raw global news datasets collected by RagAlgo at AlgoBalloon.com.
*Users who obtain an API KEY at RagAlgo.com receive 1,000 free API calls per account.

This document was written based on RagAlgo's actual operational data as of January 1, 2026.
