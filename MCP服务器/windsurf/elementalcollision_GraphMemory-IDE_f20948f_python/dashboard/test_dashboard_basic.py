#!/usr/bin/env python3
"""
Basic Dashboard Test

This script tests that all dashboard components can be imported
and basic functionality works without running the full Streamlit app.
"""

import sys
import os
from pathlib import Path

# Add dashboard directory to path
dashboard_dir = Path(__file__).parent
sys.path.insert(0, str(dashboard_dir))

def test_imports() -> bool:
    """Test that all components can be imported"""
    print("🧪 Testing component imports...")
    
    try:
        # Test utility imports
        from utils.auth_utils import get_auth_headers, validate_token
        from utils.api_client import DashboardAPIClient
        from utils.chart_configs import create_analytics_chart_config
        print("✅ Utils imports successful")
        
        # Test component imports (these might fail due to Streamlit context)
        try:
            from components.auth import authenticate_user
            from components.layout import setup_page_config
            print("✅ Component imports successful")
        except Exception as e:
            print(f"⚠️  Component imports failed (expected without Streamlit context): {e}")
        
        return True
        
    except Exception as e:
        print(f"❌ Import error: {e}")
        return False


def test_api_client() -> bool:
    """Test API client initialization"""
    print("\n🧪 Testing API client...")
    
    try:
        from utils.api_client import DashboardAPIClient
        
        # Initialize client
        client = DashboardAPIClient()
        print(f"✅ API client initialized with base URL: {client.base_url}")
        
        # Test connection (this will likely fail without server)
        try:
            status = client.check_server_status()
            print(f"📡 Server status: {'Connected' if status else 'Disconnected'}")
        except Exception as e:
            print(f"⚠️  Server connection test failed (expected): {e}")
        
        return True
        
    except Exception as e:
        print(f"❌ API client error: {e}")
        return False


def test_chart_configs() -> bool:
    """Test chart configuration generation"""
    print("\n🧪 Testing chart configurations...")
    
    try:
        from utils.chart_configs import (
            create_analytics_chart_config,
            create_memory_distribution_config,
            create_graph_metrics_config
        )
        
        # Test data
        analytics_data = {
            'memory_usage': 75.5,
            'cpu_usage': 45.2,
            'response_time': 120
        }
        
        memory_data = {
            'procedural_memories': 150,
            'semantic_memories': 200,
            'episodic_memories': 100
        }
        
        graph_data = {
            'node_count': 1000,
            'edge_count': 2500,
            'connected_components': 5,
            'diameter': 8
        }
        
        # Generate configurations
        analytics_config = create_analytics_chart_config(analytics_data)
        memory_config = create_memory_distribution_config(memory_data)
        graph_config = create_graph_metrics_config(graph_data)
        
        print("✅ Analytics chart config generated")
        print("✅ Memory distribution config generated")
        print("✅ Graph metrics config generated")
        
        # Verify structure
        assert 'title' in analytics_config
        assert 'series' in analytics_config
        assert 'title' in memory_config
        assert 'series' in memory_config
        assert 'title' in graph_config
        assert 'series' in graph_config
        
        print("✅ Chart configurations have correct structure")
        return True
        
    except Exception as e:
        print(f"❌ Chart config error: {e}")
        return False


def test_auth_utils() -> bool:
    """Test authentication utilities"""
    print("\n🧪 Testing auth utilities...")
    
    try:
        from utils.auth_utils import get_auth_headers, validate_token
        
        # Test auth headers generation
        headers = get_auth_headers("test_token")
        assert isinstance(headers, dict)
        assert 'Authorization' in headers
        print("✅ Auth headers generation works")
        
        # Test token validation (will likely fail without proper setup)
        try:
            is_valid = validate_token("test_token")
            print(f"🔑 Token validation: {'Valid' if is_valid else 'Invalid'}")
        except Exception as e:
            print(f"⚠️  Token validation test failed (expected): {e}")
        
        return True
        
    except Exception as e:
        print(f"❌ Auth utils error: {e}")
        return False


def test_file_structure() -> bool:
    """Test that all required files exist"""
    print("\n🧪 Testing file structure...")
    
    required_files = [
        'streamlit_app.py',
        '.streamlit/config.toml',
        'assets/styles.css',
        'components/__init__.py',
        'components/auth.py',
        'components/layout.py',
        'components/metrics.py',
        'components/charts.py',
        'utils/__init__.py',
        'utils/auth_utils.py',
        'utils/api_client.py',
        'utils/chart_configs.py',
        'requirements.txt',
        'README.md'
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if missing_files:
        print(f"❌ Missing files: {missing_files}")
        return False
    else:
        print("✅ All required files present")
        return True


def main() -> bool:
    """Run all tests"""
    print("🚀 Starting Dashboard Basic Tests\n")
    
    tests = [
        test_file_structure,
        test_imports,
        test_api_client,
        test_chart_configs,
        test_auth_utils
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"❌ Test {test.__name__} failed with exception: {e}")
    
    print(f"\n📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Dashboard is ready to run.")
        return True
    else:
        print("⚠️  Some tests failed. Check the output above for details.")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 