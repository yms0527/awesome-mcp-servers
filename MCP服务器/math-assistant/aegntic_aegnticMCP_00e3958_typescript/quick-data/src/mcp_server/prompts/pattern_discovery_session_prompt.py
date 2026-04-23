"""Pattern discovery session prompt implementation."""

from typing import List, Optional
from ..models.schemas import DatasetManager, dataset_schemas


async def pattern_discovery_session(dataset_name: str) -> str:
    """Open-ended pattern mining conversation."""
    try:
        if dataset_name not in dataset_schemas:
            return f"Dataset '{dataset_name}' not loaded. Use load_dataset() tool first."
        
        schema = dataset_schemas[dataset_name]
        
        # Categorize columns
        numerical_cols = [name for name, info in schema.columns.items() 
                         if info.suggested_role == 'numerical']
        categorical_cols = [name for name, info in schema.columns.items() 
                           if info.suggested_role == 'categorical']
        temporal_cols = [name for name, info in schema.columns.items() 
                        if info.suggested_role == 'temporal']
        
        prompt = f"""🔍 **Pattern Discovery Session: {dataset_name}**

Let's uncover hidden patterns and insights in your data! With **{schema.row_count:,} records** and **{len(schema.columns)} variables**, there are many potential discoveries waiting.

**📊 Your data landscape:**
• **{len(numerical_cols)} numerical variables**: Perfect for trends, distributions, and correlations
• **{len(categorical_cols)} categorical variables**: Great for segmentation and group patterns  
• **{len(temporal_cols)} temporal variables**: Ideal for time-based patterns and seasonality

**🎯 Pattern discovery toolkit:**

**1. Distribution Patterns** - Understand your data's shape
   • `analyze_distributions('{dataset_name}', 'column_name')` - Detailed distribution analysis
   • Look for: skewness, multiple peaks, unusual gaps, outliers

**2. Relationship Patterns** - Find connections between variables"""
        
        if len(numerical_cols) >= 2:
            prompt += f"""
   • `find_correlations('{dataset_name}')` - Statistical relationships
   • `create_chart('{dataset_name}', 'scatter', '{numerical_cols[0]}', '{numerical_cols[1]}')` - Visual relationships"""
        
        if categorical_cols and numerical_cols:
            prompt += f"""
   
**3. Segmentation Patterns** - Discover group differences
   • `segment_by_column('{dataset_name}', '{categorical_cols[0]}')` - Group-based analysis
   • Look for: performance differences, size variations, behavioral patterns"""
        
        if temporal_cols and numerical_cols:
            prompt += f"""
   
**4. Temporal Patterns** - Time-based insights
   • `time_series_analysis('{dataset_name}', '{temporal_cols[0]}', '{numerical_cols[0]}')` - Trend analysis
   • Look for: seasonality, cycles, growth trends, anomalies"""
        
        prompt += f"""

**5. Quality Patterns** - Data integrity insights
   • `validate_data_quality('{dataset_name}')` - Systematic quality assessment
   • `detect_outliers('{dataset_name}')` - Unusual value detection

**🔬 Advanced pattern hunting:**
• **Feature importance**: `calculate_feature_importance('{dataset_name}', 'target_column')`
• **Cross-pattern analysis**: Combine multiple discovery techniques
• **Visual pattern exploration**: Create multiple chart types to see different perspectives

**💡 Pattern discovery questions to explore:**
• Which variables have the most unusual distributions?
• Are there hidden subgroups in your data?
• Do certain combinations of variables create interesting patterns?
• Are there seasonal or cyclical patterns in time-based data?
• Which variables are most predictive of outcomes?

**🚀 Let's start discovering! Choose your exploration path:**
1. **"Show me the most interesting distributions"** - Start with distribution analysis
2. **"Find the strongest relationships"** - Begin with correlation analysis  
3. **"Reveal hidden segments"** - Start with categorical segmentation
4. **"Uncover time patterns"** - Begin with temporal analysis
5. **"Assess data quality first"** - Start with quality assessment

What patterns are you most curious about discovering in your **{dataset_name}** data?"""
        
        return prompt
        
    except Exception as e:
        return f"Error generating pattern discovery prompt: {str(e)}"