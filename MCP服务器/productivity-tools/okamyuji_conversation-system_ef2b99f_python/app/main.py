#!/usr/bin/env python3
"""
スマート圧縮と多層要約機能を備えた拡張FastAPIベースの会話管理システム
"""

import json
import logging
import os
from contextlib import asynccontextmanager
from datetime import datetime
# load .env with explicit path
from pathlib import Path
from typing import Any, Dict, List, Optional

from conversation_redis_manager import (ConversationRedisManager,
                                        SmartTextProcessor,
                                        migrate_existing_messages)
from dotenv import load_dotenv
from fastapi import BackgroundTasks, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/app/logs/app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Enhanced Pydantic models
class MessageRequest(BaseModel):
    role: str = Field(..., description="Message role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")
    topics: Optional[List[str]] = Field(default=[], description="Message topics")
    keywords: Optional[List[str]] = Field(default=[], description="Message keywords")
    session_id: Optional[str] = Field(default=None, description="Session ID")

class EnhancedInsightRequest(BaseModel):
    insight_type: str = Field(..., description="Type of insight")
    content: str = Field(..., description="Insight content")
    summary: str = Field(default="", description="Brief insight summary")
    source_messages: List[str] = Field(..., description="Source message IDs")
    relevance_score: float = Field(..., ge=0.0, le=1.0, description="Relevance score")
    business_area: str = Field(..., description="Business area")
    impact_level: str = Field(default="medium", description="Impact level: low/medium/high")
    actionable_items: List[str] = Field(default=[], description="Actionable items")

class EnhancedSearchRequest(BaseModel):
    query_terms: List[str] = Field(..., description="Search terms")
    search_scope: str = Field(default="all", description="Search scope: all/summaries/technical/topics")
    limit: int = Field(default=20, ge=1, le=100, description="Result limit")

class EnhancedContextRequest(BaseModel):
    limit: int = Field(default=50, ge=1, le=200, description="Message limit")
    detail_level: str = Field(default="adaptive", description="Detail level: short/medium/full/adaptive")
    format_type: str = Field(default="structured", description="Context format")

class CompressionAnalysisRequest(BaseModel):
    text: str = Field(..., description="Text to analyze for compression potential")

# Global enhanced Redis manager
redis_manager = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan with enhanced features"""
    global redis_manager
    # Startup
    try:
        logger.info(f"Environment variables loaded from: {env_path}")
        
        redis_host = os.getenv('REDIS_HOST', 'localhost')
        redis_port = int(os.getenv('REDIS_PORT', 6379))
        redis_db = int(os.getenv('REDIS_DB', 0))
        redis_password = os.getenv('REDIS_PASSWORD')
        redis_ssl = os.getenv('REDIS_SSL', 'false').lower() == 'true'
        
        logger.info(f"Connecting to Enhanced Redis at {redis_host}:{redis_port} (SSL: {redis_ssl})")
        
        redis_manager = ConversationRedisManager(
            host=redis_host,
            port=redis_port,
            db=redis_db,
            password=redis_password,
            use_ssl=redis_ssl
        )
        
        # Check if migration is needed
        migration_needed = os.getenv('ENABLE_MIGRATION', 'false').lower() == 'true'
        if migration_needed:
            logger.info("Starting data migration to enhanced format...")
            migrate_existing_messages(redis_manager.redis_client, redis_manager.processor)
            logger.info("Migration completed successfully")
        
        logger.info("Enhanced Redis connection established successfully")
        
    except Exception as e:
        logger.error(f"Failed to connect to Enhanced Redis: {e}")
        raise
    
    yield
    
    # Shutdown
    if redis_manager:
        logger.info("Shutting down Enhanced Redis connection")

# Enhanced FastAPI app
app = FastAPI(
    title="Enhanced Conversation Management API",
    description="Production-ready API with smart compression, multi-layer summarization, and adaptive context",
    version="2.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enhanced API Routes
@app.get("/health")
async def health_check():
    """Enhanced health check with compression stats"""
    try:
        if redis_manager:
            redis_manager.redis_client.ping()
            total_messages = redis_manager.redis_client.zcard("messages:timeline")
            total_saved = int(redis_manager.redis_client.get("analytics:compression_total_saved") or 0)
            
            return {
                "status": "healthy",
                "timestamp": datetime.now().isoformat(),
                "version": "2.0.0",
                "features": ["smart_compression", "multi_layer_summary", "adaptive_context"],
                "stats": {
                    "total_messages": total_messages,
                    "compression_bytes_saved": total_saved
                }
            }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service unhealthy: {e}")

@app.post("/messages", response_model=Dict[str, Any])
async def save_message_enhanced(
    message: MessageRequest,
    background_tasks: BackgroundTasks
):
    """Save a conversation message with enhanced compression and summarization"""
    try:
        if not redis_manager:
            raise HTTPException(status_code=503, detail="Redis not available")
        
        message_id = redis_manager.save_message(
            role=message.role,
            content=message.content,
            topics=message.topics,
            keywords=message.keywords,
            session_id=message.session_id
        )
        
        # Background task for analytics
        background_tasks.add_task(update_analytics_enhanced, message_id, message.content)
        
        # Get message details for response
        msg_data = redis_manager.redis_client.hgetall(f"message:{message_id}")
        
        return {
            "message_id": message_id,
            "status": "saved",
            "compression_ratio": float(msg_data.get('compression_ratio', 1.0)),
            "content_length": int(msg_data.get('content_length', 0)),
            "summary_generated": bool(msg_data.get('summary_short')),
            "technical_terms_extracted": len(json.loads(msg_data.get('technical_terms', '[]')))
        }
        
    except Exception as e:
        logger.error(f"Error saving enhanced message: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/insights", response_model=Dict[str, str])
async def save_insight_enhanced(insight: EnhancedInsightRequest):
    """Save an enhanced insight with additional context"""
    try:
        if not redis_manager:
            raise HTTPException(status_code=503, detail="Redis not available")
        
        insight_id = redis_manager.save_insight(
            insight_type=insight.insight_type,
            content=insight.content,
            summary=insight.summary,
            source_messages=insight.source_messages,
            relevance_score=insight.relevance_score,
            business_area=insight.business_area,
            impact_level=insight.impact_level,
            actionable_items=insight.actionable_items
        )
        
        return {"insight_id": insight_id, "status": "saved"}
        
    except Exception as e:
        logger.error(f"Error saving enhanced insight: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search", response_model=List[Dict])
async def search_conversations_enhanced(search: EnhancedSearchRequest):
    """Enhanced search with technical terms and full content access"""
    try:
        if not redis_manager:
            raise HTTPException(status_code=503, detail="Redis not available")
        
        results = redis_manager.search_conversations(
            query_terms=search.query_terms,
            limit=search.limit,
            search_scope=search.search_scope
        )
        
        return results
        
    except Exception as e:
        logger.error(f"Error searching enhanced conversations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/context", response_model=Dict[str, Any])
async def get_context_enhanced(context_req: EnhancedContextRequest):
    """Get enhanced conversation context with adaptive detail levels"""
    try:
        if not redis_manager:
            raise HTTPException(status_code=503, detail="Redis not available")
        
        context = redis_manager.get_conversation_context(
            limit=context_req.limit,
            detail_level=context_req.detail_level
        )
        
        if context_req.format_type == "narrative":
            formatted_context = redis_manager.export_for_ai_context(
                "narrative", 
                context_req.detail_level
            )
            return {"context": formatted_context, "raw_data": context}
        
        return context
        
    except Exception as e:
        logger.error(f"Error getting enhanced context: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analytics")
async def get_analytics_enhanced():
    """Get enhanced conversation analytics with compression stats"""
    try:
        if not redis_manager:
            raise HTTPException(status_code=503, detail="Redis not available")
            
        total_messages = redis_manager.redis_client.zcard("messages:timeline")
        total_insights = redis_manager.redis_client.zcard("insights:by_relevance")
        total_saved = int(redis_manager.redis_client.get("analytics:compression_total_saved") or 0)
        
        # Get top topics
        topic_keys = redis_manager.redis_client.keys("topic:*")
        topics = []
        for key in topic_keys[:15]:
            count = redis_manager.redis_client.scard(key)
            topic = key.replace("topic:", "")
            topics.append({"topic": topic, "count": count})
        
        topics.sort(key=lambda x: x["count"], reverse=True)
        
        # Get technical terms
        tech_keys = redis_manager.redis_client.keys("tech:*")
        tech_terms = []
        for key in tech_keys[:10]:
            count = redis_manager.redis_client.scard(key)
            term = key.replace("tech:", "")
            tech_terms.append({"term": term, "count": count})
        
        tech_terms.sort(key=lambda x: x["count"], reverse=True)
        
        return {
            "total_messages": total_messages,
            "total_insights": total_insights,
            "top_topics": topics[:5],
            "technical_terms": tech_terms[:5],
            "compression_stats": {
                "total_bytes_saved": total_saved,
                "average_compression_ratio": 0.7  # Could calculate from actual data
            },
            "last_updated": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting enhanced analytics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/compression")
async def analyze_compression_potential(analysis: CompressionAnalysisRequest):
    """Analyze text compression potential"""
    try:
        processor = SmartTextProcessor()
        
        # Analyze compression
        compressed, ratio = processor.compress_text(analysis.text)
        
        # Generate summaries
        short_summary = processor.generate_summary_short(analysis.text)
        medium_summary = processor.generate_summary_medium(analysis.text)
        key_points = processor.extract_key_points(analysis.text)
        technical_terms = processor.extract_technical_terms(analysis.text)
        
        return {
            "original_length": len(analysis.text),
            "compressed_length": len(compressed),
            "compression_ratio": ratio,
            "bytes_saved": len(analysis.text) - len(compressed),
            "short_summary": short_summary,
            "medium_summary": medium_summary,
            "key_points": key_points,
            "technical_terms": technical_terms,
            "analysis_timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error analyzing compression: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/migrate")
async def trigger_migration(
    confirm: str = Query(..., description="Must be 'CONFIRM_MIGRATION'"),
    background_tasks: BackgroundTasks = None
):
    """Trigger migration of existing messages to enhanced format"""
    if confirm != "CONFIRM_MIGRATION":
        raise HTTPException(
            status_code=400, 
            detail="Must provide exact confirmation string 'CONFIRM_MIGRATION'"
        )
    
    try:
        if not redis_manager:
            raise HTTPException(status_code=503, detail="Redis not available")
        
        # Run migration in background
        background_tasks.add_task(
            migrate_existing_messages, 
            redis_manager.redis_client, 
            redis_manager.processor
        )
        
        return {
            "status": "migration_started",
            "message": "Migration running in background",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error starting migration: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/data")
async def clear_data(confirm: str):
    """Clear all conversation data (dangerous!)"""
    if confirm != "I_UNDERSTAND_THIS_WILL_DELETE_ALL_DATA":
        raise HTTPException(
            status_code=400, 
            detail="Must provide exact confirmation string"
        )
    
    try:
        if not redis_manager:
            raise HTTPException(status_code=503, detail="Redis not available")
            
        redis_manager.redis_client.flushdb()
        logger.warning("All conversation data cleared")
        return {"status": "cleared", "timestamp": datetime.now().isoformat()}
        
    except Exception as e:
        logger.error(f"Error clearing data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Enhanced background tasks
def update_analytics_enhanced(message_id: str, content: str):
    """Enhanced analytics update in background"""
    try:
        if not redis_manager:
            return
            
        # Enhanced analytics update
        redis_manager.redis_client.incr("analytics:total_messages")
        redis_manager.redis_client.incr(f"analytics:daily:{datetime.now().date()}")
        
        # Word count analytics
        word_count = len(content.split())
        redis_manager.redis_client.lpush("analytics:word_counts", word_count)
        redis_manager.redis_client.ltrim("analytics:word_counts", 0, 999)
        
        # Content length analytics
        content_length = len(content)
        redis_manager.redis_client.lpush("analytics:content_lengths", content_length)
        redis_manager.redis_client.ltrim("analytics:content_lengths", 0, 999)
        
        logger.info(f"Enhanced analytics updated for message {message_id}")
        
    except Exception as e:
        logger.error(f"Error updating enhanced analytics: {e}")

# Exception handlers
@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "version": "2.0.0"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
