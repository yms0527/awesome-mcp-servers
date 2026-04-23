#!/usr/bin/env python3
"""
Enhanced Test script for all MCP tools with v2.0 features
拡張機能テスト：
- スマート圧縮システム
- 適応的詳細レベル  
- 技術用語検索
- 拡張分析機能
"""

import asyncio
import time

from main import api


async def test_enhanced_mcp_tools():
    print("🧪 Testing Enhanced MCP tools v2.0 against backend API...")
    print("=" * 70)
    
    test_results = []
    start_time = time.time()
    
    # Test 1: Enhanced Analytics (GET endpoint with compression stats)
    print("1. Testing enhanced get_analytics...")
    try:
        analytics = await api.get_analytics()
        total_messages = analytics.get('total_messages', 0)
        compression_stats = analytics.get('compression_stats', {})
        tech_terms = analytics.get('technical_terms', [])
        
        print(f"   ✅ Enhanced Analytics: {total_messages} messages")
        if compression_stats.get('total_bytes_saved', 0) > 0:
            print(f"   💾 Compression: {compression_stats['total_bytes_saved']:,} bytes saved")
        if tech_terms:
            print(f"   🔧 Technical terms: {len(tech_terms)} terms indexed")
        
        test_results.append({"test": "enhanced_analytics", "status": "pass", "details": analytics})
    except Exception as e:
        print(f"   ❌ Enhanced Analytics failed: {e}")
        test_results.append({"test": "enhanced_analytics", "status": "fail", "error": str(e)})
    
    # Test 2: Adaptive Context Retrieval (POST endpoint with detail levels)
    print("\n2. Testing adaptive context retrieval...")
    
    for detail_level in ["short", "medium", "full", "adaptive"]:
        try:
            context = await api.get_context(limit=3, detail_level=detail_level, format_type="narrative")
            context_text = context.get('context', '')
            compression_stats = context.get('compression_stats', {})
            
            print(f"   ✅ {detail_level.title()} context: {len(context_text)} characters")
            if compression_stats.get('detail_level_used'):
                print(f"      Detail level used: {compression_stats['detail_level_used']}")
            
            test_results.append({
                "test": f"adaptive_context_{detail_level}", 
                "status": "pass", 
                "details": {"length": len(context_text), "compression_stats": compression_stats}
            })
        except Exception as e:
            print(f"   ❌ {detail_level.title()} context failed: {e}")
            test_results.append({"test": f"adaptive_context_{detail_level}", "status": "fail", "error": str(e)})
    
    # Test 3: Enhanced Search with Scope Options (POST endpoint)
    print("\n3. Testing enhanced search with scope options...")
    
    search_scopes = ["all", "technical", "topics", "summaries"]
    for scope in search_scopes:
        try:
            results = await api.search_conversations(
                query_terms=["MCP", "test"], 
                limit=3, 
                search_scope=scope
            )
            print(f"   ✅ {scope.title()} search: {len(results)} conversations found")
            
            # Check for enhanced result fields
            if results and len(results) > 0:
                first_result = results[0]
                if 'technical_terms' in first_result:
                    tech_terms = first_result.get('technical_terms', [])
                    if tech_terms:
                        print(f"      Technical terms: {', '.join(tech_terms[:3])}")
                if 'compression_ratio' in first_result:
                    ratio = first_result.get('compression_ratio', 1.0)
                    if ratio < 1.0:
                        savings = int((1 - ratio) * 100)
                        print(f"      Compression: {savings}% savings")
            
            test_results.append({
                "test": f"enhanced_search_{scope}", 
                "status": "pass", 
                "details": {"results_count": len(results)}
            })
        except Exception as e:
            print(f"   ❌ {scope.title()} search failed: {e}")
            test_results.append({"test": f"enhanced_search_{scope}", "status": "fail", "error": str(e)})
    
    # Test 4: Enhanced Message Saving (POST endpoint with compression)
    print("\n4. Testing enhanced message saving with compression...")
    try:
        # Test with a longer message to see compression in action
        long_content = """Azure/Terraformインフラ実装について、大塚商会様向けのPostgreSQL Flexible Serverの設定でパフォーマンス最適化を行いたいです。具体的には、以下の点について検討したいです：
        1. 接続プール設定の最適化
        2. インデックス戦略の見直し  
        3. Docker統合時のメモリ管理
        4. コスト最適化のためのリソース配分調整
        これらの技術課題を体系的に解決していくための実装ロードマップを教えてください。"""
        
        result = await api.save_message(
            role="user",
            content=long_content, 
            topics=["Testing", "MCP", "Terraform", "Azure", "PostgreSQL"],
            keywords=["test", "MCP", "compression", "enhancement", "infrastructure"]
        )
        
        message_id = result.get("message_id", "")
        compression_ratio = result.get("compression_ratio", 1.0)
        content_length = result.get("content_length", 0)
        tech_terms_count = result.get("technical_terms_extracted", 0)
        
        print(f"   ✅ Enhanced message saved: {message_id}")
        print(f"   📏 Content length: {content_length} characters")
        if compression_ratio < 1.0:
            savings = int((1 - compression_ratio) * 100)
            print(f"   💾 Compression: {compression_ratio:.2f} ratio ({savings}% savings)")
        if tech_terms_count > 0:
            print(f"   🔧 Technical terms extracted: {tech_terms_count}")
        
        test_results.append({
            "test": "enhanced_message_saving", 
            "status": "pass", 
            "details": {
                "message_id": message_id,
                "compression_ratio": compression_ratio,
                "content_length": content_length,
                "tech_terms_extracted": tech_terms_count
            }
        })
    except Exception as e:
        print(f"   ❌ Enhanced message saving failed: {e}")
        test_results.append({"test": "enhanced_message_saving", "status": "fail", "error": str(e)})
    
    # Test 5: Compression Analysis (POST endpoint - new feature)
    print("\n5. Testing compression analysis (new feature)...")
    try:
        test_text = """このテストでは、会話システムのスマート圧縮機能を検証します。
        システムは以下の技術を使用しています：
        - zlib圧縮アルゴリズム
        - 多層要約システム（短縮・中程度・完全版）
        - 技術用語自動抽出（PostgreSQL、Terraform、Docker等）
        - 適応的詳細レベル選択機能
        これらの機能により、ストレージ効率を大幅に改善しながら情報の完全性を保持します。"""
        
        analysis = await api.analyze_compression(test_text)
        
        original_length = analysis.get('original_length', 0)
        compression_ratio = analysis.get('compression_ratio', 1.0)
        bytes_saved = analysis.get('bytes_saved', 0)
        short_summary = analysis.get('short_summary', '')
        tech_terms = analysis.get('technical_terms', [])
        
        print(f"   ✅ Compression analysis completed")
        print(f"   📏 Original: {original_length} chars")
        if compression_ratio < 1.0:
            savings_pct = int((1 - compression_ratio) * 100)
            print(f"   💾 Compression: {compression_ratio:.2f} ratio ({savings_pct}% savings)")
            print(f"   📉 Bytes saved: {bytes_saved}")
        print(f"   📋 Summary: {short_summary[:60]}...")
        if tech_terms:
            print(f"   🔧 Tech terms: {', '.join(tech_terms[:3])}")
        
        test_results.append({
            "test": "compression_analysis", 
            "status": "pass", 
            "details": {
                "original_length": original_length,
                "compression_ratio": compression_ratio,
                "tech_terms_count": len(tech_terms)
            }
        })
    except Exception as e:
        print(f"   ❌ Compression analysis failed: {e}")
        test_results.append({"test": "compression_analysis", "status": "fail", "error": str(e)})
    
    # Test 6: Enhanced Insight Saving (POST endpoint with impact levels)
    print("\n6. Testing enhanced insight saving...")
    try:
        insight_id = await api.save_insight(
            insight_type="solution",
            content="スマート圧縮システムにより、会話データの保存効率が55%向上し、検索精度も35%改善された。",
            summary="圧縮システムによる効率向上",
            source_messages=["test-msg-1", "test-msg-2"],
            relevance_score=0.9,
            business_area="AI/データ管理",
            impact_level="high",
            actionable_items=[
                "圧縮比率の継続監視",
                "技術用語抽出精度の改善",
                "適応的レベル選択の最適化"
            ]
        )
        
        print(f"   ✅ Enhanced insight saved: {insight_id}")
        
        test_results.append({
            "test": "enhanced_insight_saving", 
            "status": "pass", 
            "details": {"insight_id": insight_id}
        })
    except Exception as e:
        print(f"   ❌ Enhanced insight saving failed: {e}")
        test_results.append({"test": "enhanced_insight_saving", "status": "fail", "error": str(e)})
    
    # Results Summary
    end_time = time.time()
    execution_time = end_time - start_time
    
    print("\n" + "=" * 70)
    print("📊 Enhanced MCP Tools Test Results:")
    
    passed_tests = [r for r in test_results if r["status"] == "pass"]
    failed_tests = [r for r in test_results if r["status"] == "fail"]
    
    print(f"✅ Passed: {len(passed_tests)}")
    print(f"❌ Failed: {len(failed_tests)}")
    print(f"⏱️ Execution time: {execution_time:.2f} seconds")
    
    if failed_tests:
        print("\n🚨 Failed Tests:")
        for test in failed_tests:
            print(f"   - {test['test']}: {test['error']}")
    
    print("\n" + "=" * 70)
    if len(failed_tests) == 0:
        print("🎉 All enhanced MCP tools tested successfully!")
        print("🚀 System is ready for production with v2.0 features!")
        return True
    else:
        print(f"⚠️ {len(failed_tests)} test(s) failed. Please check the errors above.")
        return False

if __name__ == "__main__":
    try:
        success = asyncio.run(test_enhanced_mcp_tools())
        exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n⚠️ Tests interrupted by user")
        exit(130)
    except Exception as e:
        print(f"\n❌ Test execution failed: {e}")
        exit(1)
