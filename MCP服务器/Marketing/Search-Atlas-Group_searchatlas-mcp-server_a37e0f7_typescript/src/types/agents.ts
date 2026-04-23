/**
 * Agent endpoint registry
 * Maps each SearchAtlas agent to its API endpoint and metadata.
 * Derived from frontend/app/general-agent/constants/agents.tsx
 */

export interface AgentEndpoint {
  /** MCP tool name (e.g. "searchatlas_orchestrator") */
  toolName: string;
  /** Human-readable display name */
  displayName: string;
  /** Tool description shown to LLMs */
  description: string;
  /** API endpoint path (e.g. "/api/agent/orchestrator/") */
  endpoint: string;
  /** Backend history namespace for conversation retrieval */
  historyNamespace: string;
}

export const AGENT_ENDPOINTS: AgentEndpoint[] = [
  {
    toolName: "searchatlas_orchestrator",
    displayName: "Orchestrator",
    description:
      "Multi-agent coordinator — routes queries to the best specialized agent (SEO, content, PPC, etc.)",
    endpoint: "/api/agent/orchestrator/",
    historyNamespace: "orchestrator",
  },
  {
    toolName: "searchatlas_otto_seo",
    displayName: "OTTO SEO",
    description:
      "On-page SEO automation — deploys technical fixes, schema markup, and content optimizations",
    endpoint: "/api/agent/otto/",
    historyNamespace: "otto",
  },
  {
    toolName: "searchatlas_ppc",
    displayName: "PPC",
    description:
      "PPC / Google Ads management — campaign creation, bid strategy, and performance analysis",
    endpoint: "/api/agent/otto-ppc/",
    historyNamespace: "otto_ppc",
  },
  {
    toolName: "searchatlas_content",
    displayName: "Content Genius",
    description:
      "AI content generation — blog posts, landing pages, and optimized copy",
    endpoint: "/api/agent/content-genius/chat/",
    historyNamespace: "content_genius",
  },
  {
    toolName: "searchatlas_site_explorer",
    displayName: "Site Explorer",
    description:
      "Site audit and analysis — crawl data, backlink profiles, and competitive intelligence",
    endpoint: "/api/agent/site-explorer/",
    historyNamespace: "site_explorer",
  },
  {
    toolName: "searchatlas_gbp",
    displayName: "Google Business Profile",
    description:
      "Google Business Profile management — listings, reviews, and local SEO",
    endpoint: "/api/agent/gbp/",
    historyNamespace: "gbp",
  },
  {
    toolName: "searchatlas_authority_building",
    displayName: "Authority Building",
    description:
      "Link building and digital PR — outreach, guest posts, and authority signals",
    endpoint: "/api/agent/authority-building/",
    historyNamespace: "authority_building",
  },
  {
    toolName: "searchatlas_llm_visibility",
    displayName: "LLM Visibility",
    description:
      "LLM brand monitoring — tracks how AI models reference your brand and competitors",
    endpoint: "/api/agent/llm-visibility/",
    historyNamespace: "llm_visibility",
  },
  {
    toolName: "searchatlas_keywords",
    displayName: "Keywords",
    description:
      "Keyword research — search volume, difficulty, SERP analysis, and clustering",
    endpoint: "/api/agent/keywords/",
    historyNamespace: "keywords",
  },
  {
    toolName: "searchatlas_website_studio",
    displayName: "Website Studio",
    description:
      "Website builder — creates and edits pages, layouts, and site structure",
    endpoint: "/api/agent/website-studio/",
    historyNamespace: "website_studio",
  },
];
