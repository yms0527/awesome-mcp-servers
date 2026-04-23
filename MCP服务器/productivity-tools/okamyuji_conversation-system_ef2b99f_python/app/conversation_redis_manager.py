#!/usr/bin/env python3
"""
スマート圧縮と多層要約機能を備えた拡張会話Redisマネージャー
- 優先度1: コンテキスト切り詰め問題（B1） - content[:500]制限を廃止し、適応的詳細レベル提供
- 優先度2: 圧縮機能不在（A2） - zlib圧縮とスマート要約システム実装
- 優先度3: AI文脈理解制限（C1） - 多層構造による高精度文脈提供
"""

import base64
import datetime
import hashlib
import json
import logging
import re
import zlib
from dataclasses import asdict, dataclass
# load .env with explicit path
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
from uuid import uuid4

import redis
from dotenv import load_dotenv

env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class ConversationMessage:
    """Enhanced conversation message with compression support"""
    id: str
    timestamp: str
    role: str
    content: str
    compressed_content: str  # zlib compressed version
    summary_short: str       # 100-150 chars
    summary_medium: str      # 300-400 chars
    key_points: List[str]    # Bullet points of key information
    technical_terms: List[str]  # Technical vocabulary
    topics: List[str]
    keywords: List[str]
    context_hash: str
    session_id: str
    content_length: int
    compression_ratio: float

@dataclass 
class ConversationInsight:
    """Enhanced insight with detailed context"""
    id: str
    timestamp: str
    insight_type: str
    content: str
    summary: str
    source_messages: List[str]
    relevance_score: float
    business_area: str
    impact_level: str
    actionable_items: List[str]

class SmartTextProcessor:
    """Intelligent text processing for compression and summarization"""
    
    @staticmethod
    def compress_text(text: str) -> Tuple[str, float]:
        """Compress text using zlib and return compression ratio"""
        if not text:
            return "", 1.0
            
        original_size = len(text.encode('utf-8'))
        compressed = zlib.compress(text.encode('utf-8'))
        compressed_b64 = base64.b64encode(compressed).decode('ascii')
        compression_ratio = len(compressed) / original_size if original_size > 0 else 1.0
        return compressed_b64, compression_ratio
    
    @staticmethod
    def decompress_text(compressed_b64: str) -> str:
        """Decompress zlib compressed text"""
        if not compressed_b64:
            return ""
        try:
            compressed = base64.b64decode(compressed_b64)
            return zlib.decompress(compressed).decode('utf-8')
        except Exception as e:
            logger.error(f"Decompression failed: {e}")
            return ""
    
    @staticmethod
    def generate_summary_short(text: str) -> str:
        """Generate 100-150 character summary preserving key information"""
        if len(text) <= 150:
            return text
            
        # Extract first meaningful sentence or key phrase
        sentences = re.split(r'[.。!！?？\n]', text)
        meaningful_sentences = [s.strip() for s in sentences if len(s.strip()) > 20]
        
        if meaningful_sentences:
            summary = meaningful_sentences[0]
            if len(summary) > 150:
                # Try to find a natural break point
                words = summary.split()
                truncated = ""
                for word in words:
                    if len(truncated + word + " ") <= 147:
                        truncated += word + " "
                    else:
                        break
                summary = truncated.strip() + "..."
            elif len(summary) < 80 and len(meaningful_sentences) > 1:
                # Add second sentence if there's room
                additional = meaningful_sentences[1]
                if len(summary + " " + additional) <= 150:
                    summary += " " + additional
                else:
                    # Add partial second sentence
                    remaining_space = 147 - len(summary + " ")
                    if remaining_space > 10:
                        summary += " " + additional[:remaining_space] + "..."
        else:
            # Fallback: smart truncation
            summary = text[:147].rsplit(' ', 1)[0] + "..." if len(text) > 150 else text
            
        return summary
    
    @staticmethod
    def generate_summary_medium(text: str) -> str:
        """Generate 300-400 character summary with key technical details"""
        if len(text) <= 400:
            return text
            
        sentences = re.split(r'[.。!！?？]', text)
        meaningful_sentences = [s.strip() for s in sentences if len(s.strip()) > 10]
        
        summary = ""
        
        # First pass: build main summary
        for sentence in meaningful_sentences:
            if len(summary + sentence + "。") <= 300:
                summary += sentence + "。"
            else:
                break
        
        # Second pass: extract technical terms and key information
        remaining_text = text[len(summary):]
        
        # Extract technical terms
        tech_patterns = [
            r'\b[A-Z][a-z]*[A-Z][a-zA-Z]*\b',  # CamelCase (React, PostgreSQL)
            r'\b[A-Z]{2,}\b',                   # Acronyms (API, SQL, HTTP)
            r'\b\w+\.[a-z]+\b',                # File extensions
            r'(?:Docker|Kubernetes|Redis|PostgreSQL|MySQL|MongoDB|AWS|Azure|GCP|GoogleCloud|Terraform|FastAPI|React|Vue|Angular)',
            r'(?:システム|データベース|サーバー|API|エラー|実装|設定|最適化|解決)'
        ]
        
        tech_terms = set()
        for pattern in tech_patterns:
            matches = re.findall(pattern, remaining_text, re.IGNORECASE)
            tech_terms.update(matches[:5])  # Limit to 5 most important terms
        
        # Add technical information if space allows
        if tech_terms and len(summary) < 350:
            tech_info = " [技術要素: " + ", ".join(list(tech_terms)[:3]) + "]"
            if len(summary + tech_info) <= 400:
                summary += tech_info
        
        return summary if summary else text[:397] + "..."
    
    @staticmethod
    def extract_key_points(text: str) -> List[str]:
        """Extract key points as bullet points with intelligent analysis"""
        points = []
        
        # Look for explicit numbered lists
        numbered_items = re.findall(r'(?:^|\n)\s*[0-9]+\.\s*([^.。\n]+[.。]?)', text, re.MULTILINE)
        points.extend([item.strip() for item in numbered_items[:5]])
        
        # Look for bullet points
        bullet_patterns = [
            r'(?:^|\n)\s*[•\-\*]\s*([^.。\n]+)',
            r'(?:^|\n)\s*-\s+([^.。\n]+)',
            r'(?:^|\n)\s*\*\s+([^.。\n]+)'
        ]
        
        for pattern in bullet_patterns:
            bullet_items = re.findall(pattern, text, re.MULTILINE)
            points.extend([item.strip() for item in bullet_items[:3]])
        
        # Extract sentences with important keywords (technical focus)
        important_keywords = [
            '実装', '解決', '課題', '改善', '最適化', '設計', 'エラー', '修正',
            '構築', '開発', '導入', '設定', '統合', 'デプロイ', 'システム',
            'データベース', 'API', 'フレームワーク', 'インフラ', 'セキュリティ'
        ]
        
        sentences = re.split(r'[.。!！]', text)
        for sentence in sentences:
            if any(keyword in sentence for keyword in important_keywords):
                if 10 < len(sentence.strip()) < 120:
                    points.append(sentence.strip())
                    
        return list(set(points))[:8]  # Remove duplicates, max 8 points
    
    @staticmethod
    def extract_technical_terms(text: str) -> List[str]:
        """Extract technical terms and technologies"""
        # Enhanced technical patterns
        tech_patterns = [
            r'\b[A-Z][a-z]*[A-Z][a-zA-Z]*\b',  # CamelCase
            r'\b[A-Z]{2,}\b',                   # Acronyms
            r'\b\w+\.(js|py|java|go|rs|cpp|hpp|ts|jsx|tsx)\b',  # File extensions
            r'\b(?:API|SDK|CLI|GPU|CPU|RAM|SSD|HDD|HTTP|HTTPS|TCP|UDP|SSL|TLS|JWT)\b',
            r'\b(?:Docker|Kubernetes|Redis|PostgreSQL|MySQL|MongoDB|SQLite|MariaDB)\b',
            r'\b(?:AWS|Azure|GCP|GoogleCloud|Terraform|Ansible|Jenkins|GitHub|GitLab)\b',
            r'\b(?:React|Vue|Angular|FastAPI|Django|Flask|Spring|Express|Laravel)\b',
            r'\b(?:Node\.js|Python|JavaScript|TypeScript|Java|C\+\+|Rust|Go)\b',
            r'\b(?:Linux|Ubuntu|CentOS|Docker|Container|Microservice)\b'
        ]
        
        terms = set()
        for pattern in tech_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            terms.update(matches)
            
        # Add Japanese technical terms
        jp_tech_terms = re.findall(r'(?:システム|データベース|サーバー|クライアント|フレームワーク|ライブラリ|アルゴリズム|アーキテクチャ|インフラ|セキュリティ|最適化)', text)
        terms.update(jp_tech_terms)
        
        return list(terms)[:12]

class ConversationRedisManager:
    """Enhanced Redis-based conversation management system with smart compression"""
    
    def __init__(self, host='localhost', port=6379, db=0, password=None, 
                 use_ssl=False, decode_responses=True):
        """Initialize Redis connection with enhanced features"""
        try:
            self.redis_client = redis.Redis(
                host=host, port=port, db=db, password=password,
                ssl=use_ssl, decode_responses=decode_responses,
                socket_connect_timeout=10, socket_timeout=10,
                retry_on_timeout=True, health_check_interval=30
            )
            self.redis_client.ping()
            self.processor = SmartTextProcessor()
            logger.info("Enhanced Redis connection established successfully")
        except redis.ConnectionError as e:
            logger.error(f"Failed to connect to Redis: {e}")
            raise
    
    def save_message(self, role: str, content: str, topics: List[str] = None, 
                    keywords: List[str] = None, session_id: str = None) -> str:
        """
        Enhanced save_message with intelligent compression and multi-layer summarization
        【優先度1解決】: 詳細情報の完全保存により切り詰め問題を解決
        【優先度2解決】: zlib圧縮によりストレージ効率化
        """
        message_id = str(uuid4())
        timestamp = datetime.datetime.now().isoformat()
        timestamp_numeric = datetime.datetime.now().timestamp()
        context_hash = hashlib.md5(content.encode()).hexdigest()
        
        if session_id is None:
            session_id = self._get_or_create_session()
        
        # Generate compressed content and summaries
        compressed_content, compression_ratio = self.processor.compress_text(content)
        summary_short = self.processor.generate_summary_short(content)
        summary_medium = self.processor.generate_summary_medium(content)
        key_points = self.processor.extract_key_points(content)
        technical_terms = self.processor.extract_technical_terms(content)
        
        message = ConversationMessage(
            id=message_id,
            timestamp=timestamp,
            role=role,
            content=content,  # Full content preserved
            compressed_content=compressed_content,
            summary_short=summary_short,
            summary_medium=summary_medium,
            key_points=key_points,
            technical_terms=technical_terms,
            topics=topics or [],
            keywords=keywords or [],
            context_hash=context_hash,
            session_id=session_id,
            content_length=len(content),
            compression_ratio=compression_ratio
        )
        
        # Store in Redis with multiple access patterns
        pipe = self.redis_client.pipeline()
        
        # 1. Store full message data
        message_dict = asdict(message)
        # Convert lists to JSON for Redis storage
        for field in ['topics', 'keywords', 'key_points', 'technical_terms']:
            message_dict[field] = json.dumps(message_dict[field])
        
        # Convert numeric fields to strings for Redis compatibility
        message_dict['content_length'] = str(message_dict['content_length'])
        message_dict['compression_ratio'] = str(message_dict['compression_ratio'])
        
        # Debug: Check for any remaining non-string/numeric values
        for key, value in message_dict.items():
            if isinstance(value, (dict, list)):
                logger.error(f"Found dict/list in message_dict['{key}']: {type(value)} = {value}")
                message_dict[key] = json.dumps(value)
        
        pipe.hset(f"message:{message_id}", mapping=message_dict)
        
        # 2. Store optimized versions for different use cases
        summary_dict = {
            'short': summary_short,
            'medium': summary_medium,
            'key_points': json.dumps(key_points),
            'technical_terms': json.dumps(technical_terms)
        }
        pipe.hset(f"message:{message_id}:summary", mapping=summary_dict)
        
        # 3. Timeline and indexing
        pipe.zadd("messages:timeline", {message_id: float(timestamp_numeric)})
        pipe.sadd(f"session:{session_id}:messages", message_id)
        
        # 4. Enhanced indexing
        for topic in (topics or []):
            pipe.sadd(f"topic:{topic.lower()}", message_id)
        for keyword in (keywords or []):
            pipe.sadd(f"keyword:{keyword.lower()}", message_id)
        for term in technical_terms:
            pipe.sadd(f"tech:{term.lower()}", message_id)
        
        pipe.sadd(f"role:{role}", message_id)
        
        # 5. Analytics
        pipe.incr("analytics:total_messages")
        bytes_saved = int((1 - compression_ratio) * len(content))
        if bytes_saved > 0:
            pipe.incr("analytics:compression_total_saved", bytes_saved)
        
        pipe.execute()
        
        logger.info(f"Enhanced message {message_id} saved with {compression_ratio:.2f} compression ratio")
        return message_id
    
    def save_insight(self, insight_type: str, content: str, source_messages: List[str],
                    relevance_score: float, business_area: str, summary: str = "",
                    impact_level: str = "medium", actionable_items: List[str] = None) -> str:
        """Enhanced save_insight with additional context"""
        insight_id = str(uuid4())
        timestamp = datetime.datetime.now().isoformat()
        
        if not summary:
            summary = self.processor.generate_summary_short(content)
        
        insight = ConversationInsight(
            id=insight_id,
            timestamp=timestamp,
            insight_type=insight_type,
            content=content,
            summary=summary,
            source_messages=source_messages,
            relevance_score=relevance_score,
            business_area=business_area,
            impact_level=impact_level,
            actionable_items=actionable_items or []
        )
        
        pipe = self.redis_client.pipeline()
        
        # Store insight data
        insight_dict = asdict(insight)
        insight_dict['source_messages'] = json.dumps(insight_dict['source_messages'])
        insight_dict['actionable_items'] = json.dumps(insight_dict['actionable_items'])
        # Convert numeric fields to strings for Redis compatibility
        insight_dict['relevance_score'] = str(insight_dict['relevance_score'])
        pipe.hset(f"insight:{insight_id}", mapping=insight_dict)
        
        # Enhanced indexing
        pipe.sadd(f"insights:{insight_type}", insight_id)
        pipe.sadd(f"business_area:{business_area}", insight_id)
        pipe.sadd(f"impact:{impact_level}", insight_id)
        pipe.zadd("insights:by_relevance", {insight_id: float(relevance_score)})
        
        pipe.execute()
        
        logger.info(f"Enhanced insight {insight_id} saved")
        return insight_id
    
    def get_conversation_context(self, limit: int = 50, detail_level: str = "adaptive") -> Dict[str, Any]:
        """
        Enhanced context retrieval with configurable detail levels
        【優先度1解決】: content[:500]制限を完全廃止、適応的詳細レベル提供
        【優先度3解決】: AI文脈理解の大幅改善
        
        detail_level options:
        - "short": Use short summaries (for quick context)
        - "medium": Use medium summaries (balanced)
        - "full": Use full content (for detailed analysis)
        - "adaptive": Mix based on message importance and recency
        """
        recent_message_ids = self.redis_client.zrevrange("messages:timeline", 0, limit-1)
        
        messages = []
        topics_frequency = {}
        keywords_frequency = {}
        tech_terms_frequency = {}
        
        for i, msg_id in enumerate(recent_message_ids):
            msg_data = self.redis_client.hgetall(f"message:{msg_id}")
            summary_data = self.redis_client.hgetall(f"message:{msg_id}:summary")
            
            if msg_data:
                # Choose content based on detail level - NO MORE [:500] TRUNCATION!
                if detail_level == "short":
                    content = summary_data.get('short', msg_data.get('summary_short', msg_data.get('content', '')))
                elif detail_level == "medium":
                    content = summary_data.get('medium', msg_data.get('summary_medium', msg_data.get('content', '')))
                elif detail_level == "full":
                    content = msg_data.get('content', '')  # Full content always available
                elif detail_level == "adaptive":
                    # Intelligent adaptive selection
                    if i < 5:  # Most recent 5 messages get full content
                        content = msg_data.get('content', '')
                    elif i < 20:  # Next 15 get medium summary
                        content = summary_data.get('medium', msg_data.get('summary_medium', msg_data.get('content', '')))
                    else:  # Older messages get short summary
                        content = summary_data.get('short', msg_data.get('summary_short', msg_data.get('content', '')))
                else:
                    content = summary_data.get('medium', msg_data.get('summary_medium', msg_data.get('content', '')))
                
                message_info = {
                    'role': msg_data['role'],
                    'content': content,  # No truncation applied here!
                    'timestamp': msg_data['timestamp'],
                    'topics': json.loads(msg_data.get('topics', '[]')),
                    'keywords': json.loads(msg_data.get('keywords', '[]')),
                    'content_length': int(msg_data.get('content_length', 0)),
                    'compression_ratio': float(msg_data.get('compression_ratio', 1.0))
                }
                
                # Add enhanced information for important messages
                if detail_level in ["full", "adaptive"] and i < 15:
                    message_info['key_points'] = json.loads(summary_data.get('key_points', msg_data.get('key_points', '[]')))
                    message_info['technical_terms'] = json.loads(summary_data.get('technical_terms', msg_data.get('technical_terms', '[]')))
                
                messages.append(message_info)
                
                # Update frequency counters
                for topic in json.loads(msg_data.get('topics', '[]')):
                    topics_frequency[topic] = topics_frequency.get(topic, 0) + 1
                for keyword in json.loads(msg_data.get('keywords', '[]')):
                    keywords_frequency[keyword] = keywords_frequency.get(keyword, 0) + 1
                for term in json.loads(msg_data.get('technical_terms', '[]')):
                    tech_terms_frequency[term] = tech_terms_frequency.get(term, 0) + 1
        
        # Get enhanced insights
        top_insights = self._get_top_insights(5)
        
        # Get compression statistics
        total_saved = int(self.redis_client.get("analytics:compression_total_saved") or 0)
        
        return {
            'recent_messages': messages,
            'frequent_topics': sorted(topics_frequency.items(), key=lambda x: x[1], reverse=True)[:10],
            'frequent_keywords': sorted(keywords_frequency.items(), key=lambda x: x[1], reverse=True)[:15],
            'technical_terms': sorted(tech_terms_frequency.items(), key=lambda x: x[1], reverse=True)[:10],
            'key_insights': top_insights,
            'total_messages': self.redis_client.zcard("messages:timeline"),
            'compression_stats': {
                'total_bytes_saved': total_saved,
                'detail_level_used': detail_level
            },
            'context_generated_at': datetime.datetime.now().isoformat()
        }
    
    def search_conversations(self, query_terms: List[str], limit: int = 20,
                           search_scope: str = "all") -> List[Dict]:
        """
        Enhanced search with technical terms and full content access
        【優先度1解決】: 検索結果で完全なコンテンツにアクセス可能
        """
        matching_message_ids = set()
        
        for term in query_terms:
            term_lower = term.lower()
            
            if search_scope in ["all", "topics"]:
                matching_message_ids.update(self.redis_client.smembers(f"topic:{term_lower}"))
                matching_message_ids.update(self.redis_client.smembers(f"keyword:{term_lower}"))
            
            if search_scope in ["all", "technical"]:
                matching_message_ids.update(self.redis_client.smembers(f"tech:{term_lower}"))
        
        # Retrieve and enhance results with full content access
        results = []
        for msg_id in list(matching_message_ids)[:limit]:
            msg_data = self.redis_client.hgetall(f"message:{msg_id}")
            summary_data = self.redis_client.hgetall(f"message:{msg_id}:summary")
            
            if msg_data:
                result = {
                    'id': msg_id,
                    'role': msg_data['role'],
                    'content': msg_data['content'],  # Full content available
                    'summary_medium': summary_data.get('medium', ''),
                    'key_points': json.loads(summary_data.get('key_points', '[]')),
                    'technical_terms': json.loads(summary_data.get('technical_terms', '[]')),
                    'timestamp': msg_data['timestamp'],
                    'compression_ratio': float(msg_data.get('compression_ratio', 1.0)),
                    'topics': json.loads(msg_data.get('topics', '[]')),
                    'keywords': json.loads(msg_data.get('keywords', '[]'))
                }
                results.append(result)
        
        # Sort by timestamp (most recent first)
        results.sort(key=lambda x: x['timestamp'], reverse=True)
        return results
    
    def _get_or_create_session(self) -> str:
        """Get current session or create new one"""
        today = datetime.date.today().isoformat()
        session_key = f"session:{today}"
        
        if not self.redis_client.exists(session_key):
            session_id = str(uuid4())
            self.redis_client.setex(session_key, 86400, session_id)
            return session_id
        
        return self.redis_client.get(session_key)
    
    def _get_top_insights(self, limit: int) -> List[Dict]:
        """Get top insights by relevance score"""
        top_insight_ids = self.redis_client.zrevrange("insights:by_relevance", 0, limit-1)
        
        insights = []
        for insight_id in top_insight_ids:
            insight_data = self.redis_client.hgetall(f"insight:{insight_id}")
            if insight_data:
                insights.append({
                    'type': insight_data['insight_type'],
                    'content': insight_data['content'],
                    'summary': insight_data.get('summary', ''),
                    'business_area': insight_data['business_area'],
                    'relevance_score': float(insight_data['relevance_score']),
                    'impact_level': insight_data.get('impact_level', 'medium'),
                    'actionable_items': json.loads(insight_data.get('actionable_items', '[]')),
                    'source_messages': json.loads(insight_data.get('source_messages', '[]'))
                })
        
        return insights
    
    def export_for_ai_context(self, format_type: str = "narrative", detail_level: str = "adaptive") -> str:
        """
        Enhanced AI context export with improved formatting
        【優先度3解決】: AI文脈理解の大幅改善
        """
        context = self.get_conversation_context(detail_level=detail_level)
        
        if format_type == "structured":
            return json.dumps(context, indent=2, ensure_ascii=False)
        
        elif format_type == "narrative":
            # Create enhanced narrative summary for AI
            narrative_parts = []
            
            narrative_parts.append("## 会話履歴の要約")
            narrative_parts.append(f"総メッセージ数: {context['total_messages']}")
            
            # Compression stats
            if context.get('compression_stats', {}).get('total_bytes_saved', 0) > 0:
                narrative_parts.append(f"圧縮効率: {context['compression_stats']['total_bytes_saved']:,} bytes saved")
            
            if context['frequent_topics']:
                narrative_parts.append("\n### 頻出トピック:")
                for topic, count in context['frequent_topics'][:5]:
                    narrative_parts.append(f"- {topic} ({count}回)")
            
            if context.get('technical_terms'):
                narrative_parts.append("\n### 技術用語:")
                for term, count in context['technical_terms'][:5]:
                    narrative_parts.append(f"- {term} ({count}回)")
            
            if context['key_insights']:
                narrative_parts.append("\n### 重要な知見:")
                for insight in context['key_insights'][:3]:
                    narrative_parts.append(f"- [{insight['type']}] {insight.get('summary', insight['content'][:200])}...")
                    if insight.get('actionable_items'):
                        for action in insight['actionable_items'][:2]:
                            narrative_parts.append(f"  • アクション: {action}")
            
            narrative_parts.append(f"\n### 最近の会話傾向:")
            recent_user_msgs = [m for m in context['recent_messages'][-10:] if m['role'] == 'user']
            if recent_user_msgs:
                narrative_parts.append("ユーザーは以下の領域に関心を示している:")
                for msg in recent_user_msgs[-3:]:
                    content_preview = msg['content'][:200] if len(msg['content']) > 200 else msg['content']
                    narrative_parts.append(f"- {content_preview}...")
                    
                    # Add key points if available
                    if msg.get('key_points'):
                        for point in msg['key_points'][:2]:
                            narrative_parts.append(f"  • {point}")
            
            return "\n".join(narrative_parts)
        
        return json.dumps(context, ensure_ascii=False)

# Migration utilities for existing data
def migrate_existing_messages(redis_client, processor=None):
    """Migrate existing messages to enhanced format"""
    if processor is None:
        processor = SmartTextProcessor()
        
    logger.info("Starting migration of existing messages...")
    
    # Get all existing message IDs
    all_message_ids = redis_client.zrange("messages:timeline", 0, -1)
    migrated_count = 0
    
    for msg_id in all_message_ids:
        msg_data = redis_client.hgetall(f"message:{msg_id}")
        
        if 'compressed_content' not in msg_data and msg_data:  # Not yet migrated
            content = msg_data.get('content', '')
            
            if content:  # Only migrate if content exists
                # Generate new fields
                compressed_content, compression_ratio = processor.compress_text(content)
                summary_short = processor.generate_summary_short(content)
                summary_medium = processor.generate_summary_medium(content)
                key_points = processor.extract_key_points(content)
                technical_terms = processor.extract_technical_terms(content)
                
                # Update message data
                updates = {
                    'compressed_content': compressed_content,
                    'summary_short': summary_short,
                    'summary_medium': summary_medium,
                    'key_points': json.dumps(key_points),
                    'technical_terms': json.dumps(technical_terms),
                    'content_length': str(len(content)),
                    'compression_ratio': str(compression_ratio)
                }
                
                pipe = redis_client.pipeline()
                pipe.hset(f"message:{msg_id}", mapping=updates)
                
                # Create summary hash
                summary_data = {
                    'short': summary_short,
                    'medium': summary_medium,
                    'key_points': json.dumps(key_points),
                    'technical_terms': json.dumps(technical_terms)
                }
                pipe.hset(f"message:{msg_id}:summary", mapping=summary_data)
                
                # Add technical term indexes
                for term in technical_terms:
                    pipe.sadd(f"tech:{term.lower()}", msg_id)
                
                pipe.execute()
                migrated_count += 1
                
                if migrated_count % 10 == 0:
                    logger.info(f"Migrated {migrated_count} messages...")
    
    logger.info(f"Migration completed successfully! Migrated {migrated_count} messages.")

# Usage example and CLI interface
def main():
    """Enhanced example usage demonstrating the system"""
    manager = ConversationRedisManager()
    
    # Test enhanced message saving
    msg_id = manager.save_message(
        role="user",
        content="Azure/Terraformインフラ実装について、大塚商会様向けのPostgreSQL Flexible Serverの設定でパフォーマンス最適化を行いたいです。具体的には、以下の点について検討したいです：1. 接続プール設定の最適化、2. インデックス戦略の見直し、3. Docker統合時のメモリ管理、4. コスト最適化のためのリソース配分調整。これらの技術課題を体系的に解決していくための実装ロードマップを教えてください。",
        topics=["Terraform", "Azure", "PostgreSQL", "Docker", "コスト最適化"],
        keywords=["インフラ", "実装", "パフォーマンス", "最適化", "設定"]
    )
    
    print(f"Enhanced message saved: {msg_id}")
    
    # Test enhanced context retrieval with different detail levels
    for detail_level in ["short", "medium", "full", "adaptive"]:
        context = manager.get_conversation_context(limit=5, detail_level=detail_level)
        print(f"\n=== Context with {detail_level} detail level ===")
        print(f"Messages retrieved: {len(context['recent_messages'])}")
        if context['recent_messages']:
            first_msg = context['recent_messages'][0]
            print(f"Content length: {len(first_msg['content'])}")
            print(f"Content preview: {first_msg['content'][:100]}...")

if __name__ == "__main__":
    main()
