"""List MCP assets prompt implementation."""


async def list_mcp_assets() -> str:
    """Return a comprehensive list of all MCP server capabilities."""
    
    return """# 🚀 Quick-Data MCP Server Assets

## 📝 Prompts
Interactive conversation starters and analysis guides:

• **dataset_first_look** (dataset_name) - Initial exploration guide for any new dataset
• **segmentation_workshop** (dataset_name) - Plan segmentation strategy based on available columns
• **data_quality_assessment** (dataset_name) - Systematic data quality assessment workflow
• **correlation_investigation** (dataset_name) - Guide correlation analysis workflow
• **pattern_discovery_session** (dataset_name) - Open-ended pattern mining conversation
• **insight_generation_workshop** (dataset_name, business_context) - Generate business insights from data
• **dashboard_design_consultation** (dataset_name, audience) - Plan dashboards for specific audiences
• **find_datasources** (directory_path) - Discover available data files and present load options

## 🔧 Tools
Data analysis and manipulation functions:

### Dataset Management
• **load_dataset** (file_path, dataset_name, sample_size) - Load JSON/CSV datasets with automatic schema discovery
• **list_loaded_datasets** () - Show all datasets currently in memory
• **clear_dataset** (dataset_name) - Remove specific dataset from memory
• **clear_all_datasets** () - Clear all datasets from memory
• **get_dataset_info** (dataset_name) - Get basic info about loaded dataset

### Analysis Tools
• **segment_by_column** (dataset_name, column_name, method, top_n) - Generic segmentation on categorical columns
• **find_correlations** (dataset_name, columns, threshold) - Find correlations between numerical columns
• **analyze_distributions** (dataset_name, column_name) - Analyze distribution of any column
• **detect_outliers** (dataset_name, columns, method) - Detect outliers using configurable methods
• **time_series_analysis** (dataset_name, date_column, value_column, frequency) - Temporal analysis for date data
• **suggest_analysis** (dataset_name) - AI recommendations based on data characteristics

### Visualization
• **create_chart** (dataset_name, chart_type, x_column, y_column, groupby_column, title, save_path) - Create charts that adapt to any dataset
• **generate_dashboard** (dataset_name, chart_configs) - Generate multi-chart dashboards

### Advanced Analytics
• **validate_data_quality** (dataset_name) - Comprehensive data quality assessment
• **compare_datasets** (dataset_a, dataset_b, common_columns) - Compare multiple datasets
• **merge_datasets** (dataset_configs, join_strategy) - Join datasets on common keys
• **calculate_feature_importance** (dataset_name, target_column, feature_columns) - Feature importance for predictive modeling
• **memory_optimization_report** (dataset_name) - Analyze memory usage and suggest optimizations
• **export_insights** (dataset_name, format, include_charts) - Export analysis in multiple formats
• **execute_custom_analytics_code** (dataset_name, python_code) - Execute custom Python code against loaded datasets

### Resource Mirror Tools
Tool versions of resources for tool-only MCP clients:
• **resource_datasets_loaded** () - Tool mirror of datasets://loaded resource
• **resource_datasets_schema** (dataset_name) - Tool mirror of datasets schema resource
• **resource_datasets_summary** (dataset_name) - Tool mirror of datasets summary resource
• **resource_datasets_sample** (dataset_name) - Tool mirror of datasets sample resource
• **resource_analytics_current_dataset** () - Tool mirror of current dataset resource
• **resource_analytics_available_analyses** () - Tool mirror of available analyses resource
• **resource_analytics_column_types** () - Tool mirror of column types resource
• **resource_analytics_suggested_insights** () - Tool mirror of suggested insights resource
• **resource_analytics_memory_usage** () - Tool mirror of memory usage resource
• **resource_config_server** () - Tool mirror of server config resource
• **resource_users_profile** (user_id) - Tool mirror of user profile resource
• **resource_system_status** () - Tool mirror of system status resource

## 📊 Resources
Dynamic data context and system information:

### Dataset Resources
• **datasets://loaded** - List of all currently loaded datasets with basic info
• **datasets://{dataset_name}/schema** - Dynamic schema for any loaded dataset
• **datasets://{dataset_name}/summary** - Statistical summary (pandas.describe() equivalent)
• **datasets://{dataset_name}/sample** - Sample rows for data preview

### Analytics Resources
• **analytics://current_dataset** - Currently active dataset name and basic stats
• **analytics://available_analyses** - List of applicable analysis types for current data
• **analytics://column_types** - Column classification (categorical, numerical, temporal, text)
• **analytics://suggested_insights** - AI-generated analysis recommendations
• **analytics://memory_usage** - Monitor memory usage of loaded datasets

### System Resources
• **config://server** - Server configuration information
• **users://{user_id}/profile** - User profile information by ID
• **system://status** - System status and health information

---

**🎯 Quick Start:**
1. Use `find_datasources()` to discover available data files
2. Load data with `load_dataset(file_path, dataset_name)`
3. Start exploring with `dataset_first_look(dataset_name)`
4. Use specific analysis tools or `execute_custom_analytics_code()` for custom analysis

**💡 Pro Tips:**
• Use prompts for guided workflows and analysis planning
• Tools provide direct functionality and data manipulation
• Resources offer real-time context and metadata about your data
• All functions work generically across any dataset structure
"""