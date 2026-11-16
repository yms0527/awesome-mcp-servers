#!/usr/bin/env python3
"""
Enhanced MCP Server for Conversation System using official MCP Python SDK
対応する拡張機能：
- スマート圧縮システム
- 適応的詳細レベル 
- 技術用語検索
- 拡張分析機能
"""

import asyncio
import json
import logging
import os
import sys
from typing import Any, Dict, List, Optional

import httpx
from mcp.server.fastmcp import FastMCP

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastMCP server
mcp = FastMCP("conversation-system")

class EnhancedConversationAPI:
    """Enhanced API client for conversation system with v2.0 features"""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
    
    async def save_message(self, role: str, content: str, topics: List[str] = None, keywords: List[str] = None) -> Dict[str, Any]:
        """Save a conversation message with enhanced response"""
        data = {
            "role": role,
            "content": content,
            "topics": topics or [],
            "keywords": keywords or []
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(f"{self.base_url}/messages", json=data)
            response.raise_for_status()
            return response.json()
    
    async def get_context(self, limit: int = 50, detail_level: str = "adaptive", format_type: str = "narrative") -> Dict[str, Any]:
        """Get enhanced conversation context with adaptive detail levels"""
        data = {
            "limit": limit,
            "detail_level": detail_level,
            "format_type": format_type
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(f"{self.base_url}/context", json=data)
            response.raise_for_status()
            return response.json()
    
    async def search_conversations(self, query_terms: List[str], limit: int = 20, search_scope: str = "all") -> List[Dict]:
        """Enhanced search with technical terms and scope options"""
        data = {
            "query_terms": query_terms,
            "limit": limit,
            "search_scope": search_scope
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(f"{self.base_url}/search", json=data)
            response.raise_for_status()
            return response.json()
    
    async def get_analytics(self) -> Dict[str, Any]:
        """Get enhanced conversation analytics with compression stats"""
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{self.base_url}/analytics")
            response.raise_for_status()
            return response.json()
    
    async def analyze_compression(self, text: str) -> Dict[str, Any]:
        """Analyze text compression potential"""
        data = {"text": text}
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(f"{self.base_url}/analyze/compression", json=data)
            response.raise_for_status()
            return response.json()
    
    async def save_insight(self, insight_type: str, content: str, summary: str,
                          source_messages: List[str], relevance_score: float,
                          business_area: str, impact_level: str = "medium",
                          actionable_items: List[str] = None) -> str:
        """Save enhanced insight with additional context"""
        data = {
            "insight_type": insight_type,
            "content": content,
            "summary": summary,
            "source_messages": source_messages,
            "relevance_score": relevance_score,
            "business_area": business_area,
            "impact_level": impact_level,
            "actionable_items": actionable_items or []
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(f"{self.base_url}/insights", json=data)
            response.raise_for_status()
            result = response.json()
            return result.get("insight_id", "")

# Initialize enhanced API client
api = EnhancedConversationAPI()

# === ENHANCED MCP TOOLS ===

@mcp.tool()
async def record_current_conversation(
    user_message: str,
    assistant_message: str,
    topics: List[str] = None,
    keywords: List[str] = None
) -> str:
    """
    Record the current conversation exchange automatically with enhanced compression.
    Use this when user asks to 'save conversation' or 'record this chat'
    
    Args:
        user_message: The user's message in this conversation
        assistant_message: The assistant's response message  
        topics: Topics discussed in this conversation
        keywords: Key terms from the conversation
    """
    try:
        # Save user message with enhanced features
        user_result = await api.save_message("user", user_message, topics, keywords)
        user_msg_id = user_result.get("message_id", "")
        
        # Save assistant message with enhanced features
        assistant_result = await api.save_message("assistant", assistant_message, topics, keywords)
        assistant_msg_id = assistant_result.get("message_id", "")
        
        # Get compression stats
        user_compression = user_result.get("compression_ratio", 1.0)
        assistant_compression = assistant_result.get("compression_ratio", 1.0)
        
        response = f"✅ Enhanced conversation recorded successfully!\n"
        response += f"User message ID: {user_msg_id} (compression: {user_compression:.2f})\n"
        response += f"Assistant message ID: {assistant_msg_id} (compression: {assistant_compression:.2f})\n"
        
        # Add technical terms if extracted
        user_tech_terms = user_result.get("technical_terms_extracted", 0)
        if user_tech_terms > 0:
            response += f"Technical terms extracted: {user_tech_terms}\n"
        
        return response
        
    except Exception as e:
        logger.error(f"Error recording enhanced conversation: {e}")
        return f"❌ Error recording conversation: {str(e)}"

@mcp.tool()
async def save_conversation_message(
    role: str,
    content: str,
    topics: List[str] = None,
    keywords: List[str] = None
) -> str:
    """
    Save a single conversation message with enhanced compression and summarization.
    
    Args:
        role: Role of the message sender ("user" or "assistant")
        content: Content of the message
        topics: Optional list of topics related to the message
        keywords: Optional list of keywords for the message
    """
    try:
        if role not in ["user", "assistant"]:
            return f"❌ Invalid role: {role}. Must be 'user' or 'assistant'"
        
        result = await api.save_message(role, content, topics, keywords)
        message_id = result.get("message_id", "")
        
        response = f"✅ Enhanced message saved successfully!\n"
        response += f"Message ID: {message_id}\n"
        response += f"Role: {role}\n"
        response += f"Content length: {result.get('content_length', 0)} characters\n"
        response += f"Compression ratio: {result.get('compression_ratio', 1.0):.2f}\n"
        response += f"Summary generated: {'Yes' if result.get('summary_generated') else 'No'}\n"
        
        tech_terms_count = result.get('technical_terms_extracted', 0)
        if tech_terms_count > 0:
            response += f"Technical terms extracted: {tech_terms_count}\n"
        
        response += f"Topics: {', '.join(topics) if topics else 'None'}\n"
        response += f"Keywords: {', '.join(keywords) if keywords else 'None'}"
        
        return response
        
    except Exception as e:
        logger.error(f"Error saving enhanced message: {e}")
        return f"❌ Error saving message: {str(e)}"

@mcp.tool()
async def get_conversation_context(
    limit: int = 50,
    detail_level: str = "adaptive",
    format_type: str = "narrative"
) -> str:
    """
    Get enhanced conversation history and context with adaptive detail levels.
    
    Args:
        limit: Number of recent messages to retrieve (default: 50)
        detail_level: Detail level ("short", "medium", "full", "adaptive", default: "adaptive")
        format_type: Format of the context response ("structured" or "narrative", default: "narrative")
    """
    try:
        valid_detail_levels = ["short", "medium", "full", "adaptive"]
        if detail_level not in valid_detail_levels:
            return f"❌ Invalid detail_level: {detail_level}. Must be one of: {', '.join(valid_detail_levels)}"
        
        valid_formats = ["structured", "narrative"]
        if format_type not in valid_formats:
            return f"❌ Invalid format_type: {format_type}. Must be one of: {', '.join(valid_formats)}"
        
        context_data = await api.get_context(limit=limit, detail_level=detail_level, format_type=format_type)
        
        if format_type == "narrative":
            response_text = f"📊 Enhanced Conversation Context (last {limit} messages, {detail_level} detail):\n\n"
            response_text += context_data.get('context', 'No context available')
            
            # Add compression stats if available
            compression_stats = context_data.get('compression_stats', {})
            if compression_stats.get('total_bytes_saved', 0) > 0:
                response_text += f"\n\n💾 Compression Statistics:\n"
                response_text += f"Total bytes saved: {compression_stats['total_bytes_saved']:,}\n"
                response_text += f"Detail level used: {compression_stats.get('detail_level_used', detail_level)}"
        else:
            response_text = f"📊 Enhanced Conversation Context (Structured - last {limit} messages, {detail_level} detail):\n\n"
            response_text += json.dumps(context_data, indent=2, ensure_ascii=False)
        
        return response_text
        
    except Exception as e:
        logger.error(f"Error getting enhanced context: {e}")
        return f"❌ Error getting context: {str(e)}"

@mcp.tool()
async def search_conversation_history(
    query_terms: List[str],
    limit: int = 20,
    search_scope: str = "all"
) -> str:
    """
    Enhanced search with technical terms and configurable scope options.
    
    Args:
        query_terms: List of terms to search for in conversation history
        limit: Maximum number of results to return (default: 20)
        search_scope: Search scope ("all", "technical", "topics", "summaries", default: "all")
    """
    try:
        if not query_terms:
            return "❌ Please provide at least one search term"
        
        valid_scopes = ["all", "technical", "topics", "summaries"]
        if search_scope not in valid_scopes:
            return f"❌ Invalid search_scope: {search_scope}. Must be one of: {', '.join(valid_scopes)}"
        
        results = await api.search_conversations(query_terms=query_terms, limit=limit, search_scope=search_scope)
        
        if not results:
            response_text = f"🔍 No conversations found for terms: {', '.join(query_terms)} (scope: {search_scope})"
        else:
            response_text = f"🔍 Found {len(results)} conversations for terms: {', '.join(query_terms)} (scope: {search_scope})\n\n"
            
            for i, result in enumerate(results[:10], 1):  # Show max 10 results
                response_text += f"{i}. [{result['role']}] {result['content'][:150]}...\n"
                response_text += f"   📅 {result['timestamp'].split('T')[0]} {result['timestamp'].split('T')[1][:8]}\n"
                
                # Show topics if available
                if result.get('topics'):
                    response_text += f"   🏷️ Topics: {', '.join(result['topics'])}\n"
                
                # Show technical terms if available
                if result.get('technical_terms'):
                    tech_terms = result['technical_terms'][:3]  # Show first 3
                    response_text += f"   🔧 Tech terms: {', '.join(tech_terms)}\n"
                
                # Show compression info
                compression_ratio = result.get('compression_ratio')
                if compression_ratio and compression_ratio < 1.0:
                    savings = int((1 - compression_ratio) * 100)
                    response_text += f"   💾 Compressed: {savings}% savings\n"
                
                response_text += "\n"
        
        return response_text
        
    except Exception as e:
        logger.error(f"Error searching enhanced conversations: {e}")
        return f"❌ Error searching conversations: {str(e)}"

@mcp.tool()
async def get_conversation_analytics() -> str:
    """
    Get enhanced analytics and statistics about conversation patterns with compression data.
    """
    try:
        analytics = await api.get_analytics()
        
        response_text = f"📈 Enhanced Conversation Analytics:\n\n"
        response_text += f"📝 Total Messages: {analytics.get('total_messages', 0)}\n"
        response_text += f"💡 Total Insights: {analytics.get('total_insights', 0)}\n\n"
        
        # Compression statistics
        compression_stats = analytics.get('compression_stats', {})
        if compression_stats:
            response_text += f"💾 Compression Statistics:\n"
            response_text += f"  Total bytes saved: {compression_stats.get('total_bytes_saved', 0):,}\n"
            avg_ratio = compression_stats.get('average_compression_ratio', 1.0)
            if avg_ratio < 1.0:
                savings_pct = int((1 - avg_ratio) * 100)
                response_text += f"  Average compression: {savings_pct}% space saved\n"
            response_text += "\n"
        
        # Top topics
        if analytics.get('top_topics'):
            response_text += "🏷️ Top Topics:\n"
            for i, topic in enumerate(analytics['top_topics'][:5], 1):
                response_text += f"  {i}. {topic['topic']}: {topic['count']} times\n"
            response_text += "\n"
        
        # Technical terms
        if analytics.get('technical_terms'):
            response_text += "🔧 Technical Terms:\n"
            for i, term in enumerate(analytics['technical_terms'][:5], 1):
                response_text += f"  {i}. {term['term']}: {term['count']} times\n"
            response_text += "\n"
        
        if analytics.get('last_updated'):
            response_text += f"🕒 Last Updated: {analytics['last_updated']}\n"
        
        return response_text
        
    except Exception as e:
        logger.error(f"Error getting enhanced analytics: {e}")
        return f"❌ Error getting analytics: {str(e)}"

@mcp.tool()
async def analyze_text_compression(text: str) -> str:
    """
    Analyze text compression potential and generate enhanced summaries.
    
    Args:
        text: Text to analyze for compression and summarization
    """
    try:
        if not text or len(text.strip()) < 10:
            return "❌ Please provide text with at least 10 characters for analysis"
        
        result = await api.analyze_compression(text)
        
        response_text = f"🔬 Text Compression Analysis:\n\n"
        response_text += f"📏 Original length: {result.get('original_length', 0):,} characters\n"
        response_text += f"🗜️ Compressed length: {result.get('compressed_length', 0):,} characters\n"
        
        compression_ratio = result.get('compression_ratio', 1.0)
        if compression_ratio < 1.0:
            savings_pct = int((1 - compression_ratio) * 100)
            response_text += f"💾 Compression ratio: {compression_ratio:.2f} ({savings_pct}% space saved)\n"
            response_text += f"📉 Bytes saved: {result.get('bytes_saved', 0):,}\n"
        else:
            response_text += f"💾 Compression ratio: {compression_ratio:.2f} (no compression benefit)\n"
        
        response_text += f"\n📋 Short summary (100-150 chars):\n{result.get('short_summary', 'N/A')}\n"
        response_text += f"\n📄 Medium summary (300-400 chars):\n{result.get('medium_summary', 'N/A')}\n"
        
        # Key points
        key_points = result.get('key_points', [])
        if key_points:
            response_text += f"\n🎯 Key points:\n"
            for i, point in enumerate(key_points[:5], 1):
                response_text += f"  {i}. {point}\n"
        
        # Technical terms
        technical_terms = result.get('technical_terms', [])
        if technical_terms:
            response_text += f"\n🔧 Technical terms: {', '.join(technical_terms[:8])}\n"
        
        response_text += f"\n🕒 Analysis timestamp: {result.get('analysis_timestamp', 'N/A')}"
        
        return response_text
        
    except Exception as e:
        logger.error(f"Error analyzing text compression: {e}")
        return f"❌ Error analyzing compression: {str(e)}"

@mcp.tool()
async def save_enhanced_insight(
    insight_type: str,
    content: str,
    source_messages: List[str],
    relevance_score: float,
    business_area: str,
    summary: str = "",
    impact_level: str = "medium",
    actionable_items: List[str] = None
) -> str:
    """
    Save an enhanced insight with impact level and actionable items.
    
    Args:
        insight_type: Type of insight (solution, pattern, framework, blind_spot)
        content: Detailed insight content
        source_messages: List of source message IDs
        relevance_score: Relevance score (0.0 to 1.0)
        business_area: Business area or domain
        summary: Brief summary of the insight (optional)
        impact_level: Impact level (low, medium, high, default: medium)
        actionable_items: List of actionable items (optional)
    """
    try:
        valid_types = ["solution", "pattern", "framework", "blind_spot"]
        if insight_type not in valid_types:
            return f"❌ Invalid insight_type: {insight_type}. Must be one of: {', '.join(valid_types)}"
        
        valid_impacts = ["low", "medium", "high"]
        if impact_level not in valid_impacts:
            return f"❌ Invalid impact_level: {impact_level}. Must be one of: {', '.join(valid_impacts)}"
        
        if not (0.0 <= relevance_score <= 1.0):
            return f"❌ Invalid relevance_score: {relevance_score}. Must be between 0.0 and 1.0"
        
        insight_id = await api.save_insight(
            insight_type=insight_type,
            content=content,
            summary=summary,
            source_messages=source_messages,
            relevance_score=relevance_score,
            business_area=business_area,
            impact_level=impact_level,
            actionable_items=actionable_items or []
        )
        
        response = f"✅ Enhanced insight saved successfully!\n"
        response += f"Insight ID: {insight_id}\n"
        response += f"Type: {insight_type}\n"
        response += f"Impact level: {impact_level}\n"
        response += f"Relevance score: {relevance_score}\n"
        response += f"Business area: {business_area}\n"
        response += f"Source messages: {len(source_messages)}\n"
        
        if actionable_items:
            response += f"Actionable items: {len(actionable_items)}\n"
            for i, item in enumerate(actionable_items[:3], 1):
                response += f"  {i}. {item}\n"
        
        return response
        
    except Exception as e:
        logger.error(f"Error saving enhanced insight: {e}")
        return f"❌ Error saving insight: {str(e)}"

if __name__ == "__main__":
    # Set environment variable
    os.environ["CONVERSATION_API_URL"] = "http://localhost:8000"
    
    # Test enhanced API connection on startup
    async def test_enhanced_connection():
        try:
            # Test basic analytics
            analytics = await api.get_analytics()
            logger.info("✅ Enhanced API connection successful")
            
            # Test enhanced features
            compression_stats = analytics.get('compression_stats', {})
            if compression_stats:
                logger.info(f"✅ Compression features available: {compression_stats.get('total_bytes_saved', 0):,} bytes saved")
            
            tech_terms = analytics.get('technical_terms', [])
            if tech_terms:
                logger.info(f"✅ Technical terms indexing available: {len(tech_terms)} terms indexed")
                
        except Exception as e:
            logger.warning(f"Enhanced API connection test failed: {e}")
            logger.info("MCP server will continue, but enhanced features may not work until API is available")
    
    # Run enhanced connection test
    asyncio.run(test_enhanced_connection())
    
    # Run the enhanced server
    logger.info("🚀 Starting Enhanced MCP Server v2.0 with smart compression and adaptive context...")
    mcp.run()
