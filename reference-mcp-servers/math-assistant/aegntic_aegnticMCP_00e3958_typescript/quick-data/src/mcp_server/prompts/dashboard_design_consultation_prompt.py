"""Dashboard design consultation prompt implementation."""

from typing import List, Optional
from ..models.schemas import DatasetManager, dataset_schemas


async def dashboard_design_consultation(dataset_name: str, audience: str = "general") -> str:
    """Plan dashboards for specific audiences."""
    try:
        if dataset_name not in dataset_schemas:
            return f"Dataset '{dataset_name}' not loaded. Use load_dataset() tool first."
        
        schema = dataset_schemas[dataset_name]
        
        # Analyze available data types
        numerical_cols = [name for name, info in schema.columns.items() 
                         if info.suggested_role == 'numerical']
        categorical_cols = [name for name, info in schema.columns.items() 
                           if info.suggested_role == 'categorical']
        temporal_cols = [name for name, info in schema.columns.items() 
                        if info.suggested_role == 'temporal']
        
        prompt = f"""📊 **Dashboard Design Consultation: {dataset_name}**

**Target Audience**: {audience}

Let's design a compelling dashboard from your **{schema.row_count:,} records** that tells a clear story!

**📋 Available data for dashboards:**
• **{len(numerical_cols)} numerical metrics**: Perfect for KPIs, trends, and comparisons
• **{len(categorical_cols)} categorical dimensions**: Great for filtering and segmentation
• **{len(temporal_cols)} time dimensions**: Ideal for time series and trend analysis

**🎯 Dashboard design principles:**

**For Executive/Leadership Audience:**
• High-level KPIs and trend indicators
• Exception-based reporting (what needs attention)
• Comparative analysis (vs targets, previous periods)
• Clean, simple visualizations with clear takeaways

**For Operational/Management Audience:**
• Detailed performance metrics
• Drill-down capabilities by segment/category
• Operational efficiency indicators
• Actionable insights for daily decisions

**For Analytical/Technical Audience:**
• Comprehensive data exploration capabilities
• Statistical analysis and correlation views
• Raw data access and filtering options
• Advanced visualization types

**📊 Dashboard component recommendations:**

**1. Key Performance Indicators (KPIs)**"""
        
        if numerical_cols:
            prompt += f"""
   • Primary metrics from: {', '.join(numerical_cols[:3])}
   • Trend indicators and period-over-period changes
   • Target vs actual comparisons"""
        
        prompt += f"""

**2. Trend Analysis**"""
        
        if temporal_cols and numerical_cols:
            prompt += f"""
   • Time series charts showing {numerical_cols[0]} over {temporal_cols[0]}
   • Seasonal patterns and growth trends
   • Anomaly detection and highlighting"""
        
        prompt += f"""

**3. Segmentation Views**"""
        
        if categorical_cols and numerical_cols:
            prompt += f"""
   • Performance by {categorical_cols[0]} (bar charts, tables)
   • Comparative analysis across segments
   • Top/bottom performer identification"""
        
        prompt += f"""

**4. Distribution Analysis**
   • Data quality indicators and completeness
   • Outlier detection and unusual patterns
   • Statistical summaries and ranges

**🛠️ Dashboard creation workflow:**

1. **Define dashboard objectives**
   → What decisions should this dashboard support?
   → What questions should it answer?

2. **Create individual visualizations**
   → `create_chart('{dataset_name}', 'chart_type', 'x_column', 'y_column')`
   → Test different chart types for each insight

3. **Build comprehensive dashboard**
   → `generate_dashboard('{dataset_name}', chart_configs)`
   → Combine multiple visualizations

4. **Export for sharing**
   → `export_insights('{dataset_name}', 'html')`
   → Create shareable dashboard file

**📊 Recommended chart types by purpose:**

**KPI Monitoring**: Bar charts, line charts, gauge charts
**Trend Analysis**: Line charts, area charts, sparklines  
**Comparison**: Bar charts, grouped charts, heatmaps
**Distribution**: Histograms, box plots, violin plots
**Relationship**: Scatter plots, correlation matrices

**🎨 Dashboard layout suggestions for {audience}:**
"""
        
        if audience.lower() in ['executive', 'leadership', 'c-suite']:
            prompt += """
• **Top row**: 3-4 key KPIs with trend indicators
• **Second row**: Main performance chart (trend over time)
• **Bottom rows**: Segmentation breakdown and key insights
• **Colors**: Minimal palette, red/green for performance indicators"""
            
        elif audience.lower() in ['manager', 'operational', 'team lead']:
            prompt += """
• **Left panel**: Filters and controls for interactivity
• **Main area**: Primary operational metrics and trends
• **Right panel**: Top/bottom performers and alerts
• **Bottom**: Detailed breakdowns and drill-down options"""
            
        elif audience.lower() in ['analyst', 'technical', 'data team']:
            prompt += """
• **Full data exploration**: Multiple visualization types
• **Statistical summaries**: Correlation matrices, distributions
• **Interactive filters**: Full dataset slicing capabilities
• **Export options**: Data download and analysis tools"""
            
        else:
            prompt += """
• **Balanced approach**: Mix of high-level and detailed views
• **Clear navigation**: Logical flow from summary to detail
• **Contextual information**: Explanations and data definitions
• **Action orientation**: Clear next steps and recommendations"""
        
        prompt += f"""

**🚀 Let's start building your dashboard!**

**Immediate next steps:**
1. **Identify your top 3 KPIs** from available numerical columns
2. **Choose primary segmentation** from categorical columns  
3. **Create initial visualizations** with create_chart()
4. **Iterate and refine** based on feedback

**Quick start commands:**
"""
        
        if numerical_cols and categorical_cols:
            prompt += f"""• `create_chart('{dataset_name}', 'bar', '{categorical_cols[0]}', '{numerical_cols[0]}')` - Key metric by segment
"""
        if len(numerical_cols) >= 2:
            prompt += f"""• `create_chart('{dataset_name}', 'scatter', '{numerical_cols[0]}', '{numerical_cols[1]}')` - Relationship analysis
"""
        if temporal_cols and numerical_cols:
            prompt += f"""• `create_chart('{dataset_name}', 'line', '{temporal_cols[0]}', '{numerical_cols[0]}')` - Trend analysis
"""
        
        prompt += f"""

What type of dashboard story do you want to tell with your **{dataset_name}** data?"""
        
        return prompt
        
    except Exception as e:
        return f"Error generating dashboard consultation prompt: {str(e)}"